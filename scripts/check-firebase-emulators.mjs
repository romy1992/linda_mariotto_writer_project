import { deleteApp, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import {
  connectStorageEmulator,
  deleteObject,
  getBytes,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

const projectId = "demo-linda-writer";
const expectedEmulators = ["auth", "firestore", "functions", "storage"];

async function waitForResponse(url, label, attempts = 90) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(
    `${label} did not become ready: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}

async function expectDenied(operation, expectedCodes, label) {
  try {
    await operation();
  } catch (error) {
    if (error && typeof error === "object" && expectedCodes.includes(error.code)) {
      return;
    }
    throw error;
  }
  throw new Error(`${label} unexpectedly succeeded without authentication.`);
}

async function main() {
  const hubResponse = await waitForResponse(
    "http://127.0.0.1:4400/emulators",
    "Firebase Emulator Hub",
  );
  const siteResponse = await waitForResponse(
    "http://127.0.0.1:5175",
    "Dockerized Vite site",
  );
  const siteHtml = await siteResponse.text();
  if (!siteHtml.includes('id="root"')) {
    throw new Error("Dockerized Vite site returned unexpected HTML.");
  }

  const running = await hubResponse.json();
  const missing = expectedEmulators.filter((name) => !running[name]);
  if (missing.length > 0) {
    throw new Error(`Missing emulators: ${missing.join(", ")}`);
  }

  const firebaseConfig = {
    apiKey: "demo-api-key",
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: `${projectId}.firebasestorage.app`,
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:demo",
  };
  const app = initializeApp(firebaseConfig);
  const unauthenticatedApp = initializeApp(
    firebaseConfig,
    "unauthenticated-rule-check",
  );
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const unauthenticatedDb = getFirestore(unauthenticatedApp);
  const unauthenticatedStorage = getStorage(unauthenticatedApp);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectFirestoreEmulator(unauthenticatedDb, "127.0.0.1", 8080);
  connectStorageEmulator(unauthenticatedStorage, "127.0.0.1", 9199);

  const smokeDocument = doc(db, "socialPosts", "__emulator-smoke-check");
  const smokeObject = ref(storage, "social/__emulator-smoke-check.txt");
  const unauthenticatedSmokeDocument = doc(
    unauthenticatedDb,
    "socialPosts",
    "__emulator-smoke-check",
  );
  const unauthenticatedSmokeObject = ref(
    unauthenticatedStorage,
    "social/__emulator-smoke-check.txt",
  );
  let firestoreSmokeCreated = false;
  let storageSmokeCreated = false;

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      "admin@local.test",
      "LocalAdmin2026!",
    );
    if (credential.user.uid !== "2f6bylS8DrWniWMBOVtQMpplL0C2") {
      throw new Error(`Unexpected local admin UID: ${credential.user.uid}`);
    }

    await setDoc(smokeDocument, {
      kind: "emulator-smoke-check",
      createdAt: Date.now(),
    });
    firestoreSmokeCreated = true;
    const storedDocument = await getDoc(smokeDocument);
    if (storedDocument.data()?.kind !== "emulator-smoke-check") {
      throw new Error("Firestore smoke document could not be read back.");
    }

    await uploadString(smokeObject, "firebase-emulator-smoke-check", "raw", {
      contentType: "text/plain",
    });
    storageSmokeCreated = true;
    const storedObject = new TextDecoder().decode(await getBytes(smokeObject));
    if (storedObject !== "firebase-emulator-smoke-check") {
      throw new Error("Storage smoke object contents did not match.");
    }

    await expectDenied(
      () => getDoc(unauthenticatedSmokeDocument),
      ["permission-denied"],
      "Private Firestore read",
    );
    await expectDenied(
      () => getBytes(unauthenticatedSmokeObject),
      ["storage/unauthorized"],
      "Private Storage read",
    );

    await deleteDoc(smokeDocument);
    firestoreSmokeCreated = false;
    await deleteObject(smokeObject);
    storageSmokeCreated = false;
  } finally {
    if (firestoreSmokeCreated) {
      await deleteDoc(smokeDocument).catch(() => undefined);
    }
    if (storageSmokeCreated) {
      await deleteObject(smokeObject).catch(() => undefined);
    }
    await signOut(auth).catch(() => undefined);
    await deleteApp(unauthenticatedApp);
    await deleteApp(app);
  }

  console.log("Firebase emulators ready: Auth, Firestore, Functions and Storage.");
  console.log("Dockerized Vite site ready: http://127.0.0.1:5175.");
  console.log("Local admin login verified: admin@local.test.");
  console.log("Firestore admin write/read/delete verified.");
  console.log("Storage admin upload/read/delete verified.");
  console.log("Unauthenticated private Firestore and Storage reads denied.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
