// One-off dev utility: mirrors production Firestore data into the local
// Firebase emulator so the local admin/dashboard reflects what's really live.
//
// Reads production data over the Firestore REST API using the OAuth session
// already stored by `firebase login` (no service account needed), then
// writes it into the emulator via the Admin SDK (FIRESTORE_EMULATOR_HOST).
//
// Usage: node functions/scripts/copy-prod-to-emulator.cjs
// Requires: local emulators running (npm run emulators:up), `firebase login` done.
const fs = require("fs");
const os = require("os");
const path = require("path");
const admin = require("firebase-admin");

const PROD_PROJECT_ID = "lindamariottowriter";
const EMULATOR_PROJECT_ID = "demo-linda-writer";
const EMULATOR_HOST = "127.0.0.1:8080";

// Collections read from src/ usage: services, portfolio, books, articles,
// testimonials, socialPosts, contacts — plus the settings/site singleton.
const COLLECTIONS = [
  "services",
  "portfolio",
  "books",
  "articles",
  "testimonials",
  "socialPosts",
  "contacts",
];

// Public OAuth client used by firebase-tools itself for the CLI's own login
// session; reusing it here only refreshes the *same* already-authorized
// account's token, exactly like firebase-tools does internally.
const FIREBASE_TOOLS_CLIENT_SECRET = "j9iVZfS8kkCEFUPaAeJV0sAi";

function loadCliCredentials() {
  const configPath = path.join(os.homedir(), ".config", "configstore", "firebase-tools.json");
  if (!fs.existsSync(configPath)) {
    throw new Error(`Firebase CLI config not found at ${configPath}. Run "firebase login" first.`);
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  if (!config.tokens?.access_token) {
    throw new Error('No Firebase CLI session found. Run "firebase login" first.');
  }
  return config;
}

async function getAccessToken() {
  const config = loadCliCredentials();
  const { tokens, user } = config;
  const stillValid = tokens.expires_at && tokens.expires_at - Date.now() > 60_000;
  if (stillValid) return tokens.access_token;

  const clientId = user?.azp;
  if (!clientId || !tokens.refresh_token) {
    throw new Error("Stored Firebase CLI token is expired and cannot be refreshed automatically.");
  }
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: FIREBASE_TOOLS_CLIENT_SECRET,
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status} ${await response.text()}`);
  }
  const refreshed = await response.json();
  return refreshed.access_token;
}

function decodeValue(value) {
  if (!value || Object.keys(value).length === 0) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return parseInt(value.integerValue, 10);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("timestampValue" in value) return admin.firestore.Timestamp.fromDate(new Date(value.timestampValue));
  if ("geoPointValue" in value) {
    return new admin.firestore.GeoPoint(value.geoPointValue.latitude, value.geoPointValue.longitude);
  }
  if ("bytesValue" in value) return value.bytesValue;
  if ("referenceValue" in value) return value.referenceValue;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeValue);
  if ("mapValue" in value) return decodeFields(value.mapValue.fields || {});
  return null;
}

function decodeFields(fields) {
  const out = {};
  for (const [key, value] of Object.entries(fields)) {
    out[key] = decodeValue(value);
  }
  return out;
}

async function fetchCollection(accessToken, collectionId) {
  const docs = [];
  let pageToken;
  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${PROD_PROJECT_ID}/databases/(default)/documents/${collectionId}`,
    );
    url.searchParams.set("pageSize", "300");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!response.ok) {
      throw new Error(`Failed to read "${collectionId}": ${response.status} ${await response.text()}`);
    }
    const body = await response.json();
    for (const doc of body.documents || []) {
      const id = doc.name.split("/").pop();
      docs.push({ id, data: decodeFields(doc.fields || {}) });
    }
    pageToken = body.nextPageToken;
  } while (pageToken);
  return docs;
}

async function fetchSettingsDoc(accessToken) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROD_PROJECT_ID}/databases/(default)/documents/settings/site`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to read settings/site: ${response.status} ${await response.text()}`);
  }
  const doc = await response.json();
  return decodeFields(doc.fields || {});
}

async function clearCollection(db, collectionId) {
  const snapshot = await db.collection(collectionId).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  if (!snapshot.empty) await batch.commit();
}

async function main() {
  const accessToken = await getAccessToken();

  process.env.FIRESTORE_EMULATOR_HOST = EMULATOR_HOST;
  const app = admin.initializeApp({ projectId: EMULATOR_PROJECT_ID });
  const db = admin.firestore(app);

  for (const collectionId of COLLECTIONS) {
    const docs = await fetchCollection(accessToken, collectionId);
    await clearCollection(db, collectionId);
    const batch = db.batch();
    for (const { id, data } of docs) {
      batch.set(db.collection(collectionId).doc(id), data);
    }
    if (docs.length > 0) await batch.commit();
    console.log(`${collectionId}: ${docs.length} document(s) copied`);
  }

  const settings = await fetchSettingsDoc(accessToken);
  if (settings) {
    await db.collection("settings").doc("site").set(settings);
    console.log("settings/site: copied");
  } else {
    console.log("settings/site: not found in production, skipped");
  }

  await admin.app().delete();
  console.log("Done. Local emulator Firestore now mirrors production.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
