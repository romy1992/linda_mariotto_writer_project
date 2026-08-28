const { initializeApp, deleteApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

async function main() {
  const projectId = process.env.GCLOUD_PROJECT || "demo-linda-writer";
  const uid = process.env.LOCAL_ADMIN_UID;
  const email = process.env.LOCAL_ADMIN_EMAIL;
  const password = process.env.LOCAL_ADMIN_PASSWORD;

  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error("FIREBASE_AUTH_EMULATOR_HOST is required; refusing to seed a cloud project.");
  }
  if (!projectId.startsWith("demo-")) {
    throw new Error(`Unsafe emulator project id: ${projectId}`);
  }
  if (!uid || !email || !password) {
    throw new Error("Local admin seed configuration is incomplete.");
  }

  const app = initializeApp({ projectId });
  const auth = getAuth(app);

  try {
    await auth.getUser(uid);
    await auth.updateUser(uid, {
      email,
      password,
      emailVerified: true,
      disabled: false,
      displayName: "Admin locale",
    });
    console.log(`Updated local emulator admin: ${email}`);
  } catch (error) {
    if (error?.code !== "auth/user-not-found") {
      throw error;
    }
    await auth.createUser({
      uid,
      email,
      password,
      emailVerified: true,
      disabled: false,
      displayName: "Admin locale",
    });
    console.log(`Created local emulator admin: ${email}`);
  } finally {
    await deleteApp(app);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
