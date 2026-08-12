import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

/**
 * Firebase configuration is read from Vite environment variables.
 *
 * IMPORTANT (Vite-specific):
 *  - Variables MUST be prefixed with `VITE_` to be exposed to the client.
 *  - They MUST be defined in a `.env` file located at the project root
 *    (the same folder that contains `package.json`).
 *  - If you change the `.env` file, you MUST restart the dev server
 *    (`npm run dev` / `npm run dev:vite`) so Vite re-reads the file.
 *
 * See `.env.example` in the project root for the full list of variables.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Returns true only when at least the minimum required Firebase
 * configuration values are present.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

if (!isFirebaseConfigured) {
  // Log a clear, actionable warning instead of crashing the entire app.
  // This way the rest of the UI still renders and only Firebase-backed
  // features (auth, contact form, etc.) will fail gracefully.
  // eslint-disable-next-line no-console
  console.warn(
    [
      "[firebase] Firebase is NOT configured.",
      "Missing one or more required environment variables (VITE_FIREBASE_API_KEY,",
      "VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID, ...).",
      "Create a `.env` file in the project root (copy from `.env.example`)",
      "and fill in your Firebase project credentials, then RESTART the dev server.",
    ].join(" ")
  );
}

// Lazily initialise the Firebase app so importing this module is always
// safe. We also guard `initializeApp` behind the configuration check so
// we never call it with `undefined` values.
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured && typeof window !== "undefined") {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[firebase] Failed to initialise Firebase:", err);
    app = null;
    auth = null;
  }
}

export { app, auth };
