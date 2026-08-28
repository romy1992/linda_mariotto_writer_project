import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, initializeFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const useFirebaseEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true";

if (
  useFirebaseEmulators &&
  (!firebaseConfig.projectId || !firebaseConfig.projectId.startsWith("demo-"))
) {
  throw new Error(
    "Firebase emulators require a demo-* project ID; refusing to connect local development to cloud resources.",
  );
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Admin forms send optional fields (imageURL, publishedAt, ...) as undefined
// when empty; Firestore rejects undefined values by default.
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });
export const storage = getStorage(app);
export const functions = getFunctions(app, "europe-west1");

if (useFirebaseEmulators) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  console.info(`Firebase Emulator Suite connected (${firebaseConfig.projectId}).`);
}
