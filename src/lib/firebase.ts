import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

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
let analytics: Analytics | null = null;

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
  if (app && firebaseConfig.measurementId) {
    try {
      analytics = getAnalytics(app);
    } catch (err) {
      // Analytics is optional and may not be supported in every browser
      // (or requires the `@firebase/analytics` packages to be present).
      // eslint-disable-next-line no-console
      console.warn("[firebase] Analytics unavailable:", err);
      analytics = null;
    }
  }
}

export { app, auth, analytics };

/** Human-readable hints for the most common Google Auth failures. */
export function describeAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code || '';
  const message = (error as { message?: string })?.message || '';
  const hints: Record<string, string> = {
    "auth/unauthorized-domain":
      "This domain isn't authorized for sign-in. Add it in the Firebase console: Authentication → Settings → Authorized domains.",
    "auth/popup-blocked":
      "Your browser blocked the pop-up window. Allow pop-ups for this site, then try again.",
    "auth/popup-closed-by-user":
      "The sign-in window was closed before finishing. Try again.",
    "auth/cancelled-popup-request":
      "Sign-in was cancelled. Try again.",
    "auth/account-exists-with-different-credential":
      "An account with this email already exists using a different sign-in method.",
    "auth/invalid-credential":
      "Invalid credentials. Check your email and password, or use Google sign-in.",
    "auth/wrong-password":
      "Incorrect password. Try again or reset it.",
    "auth/user-not-found":
      "No account found with this email. Sign up first.",
    "auth/network-request-failed":
      "Network problem. Check your internet connection and try again.",
    "auth/admin-restricted-operation":
      "Google sign-in isn't enabled yet. Turn it on in the Firebase console: Authentication → Sign-in method → Google.",
    "auth/operation-not-supported-in-this-environment":
      "Popup sign-in isn't supported here — switching to the redirect flow.",
  };
  if (hints[code]) return hints[code];
  if (message) return `${message} (${code})`;
  return "Sign-in failed. Please try again.";
}

/**
 * Start Sign in with Google.
 * Uses the popup flow first, and automatically falls back to the redirect
 * flow when popups are blocked or unsupported (common on mobile / strict
 * browsers). Returns null on success (or when a redirect was started) and a
 * friendly error message otherwise.
 */
export async function signInWithGoogle(): Promise<string | null> {
  if (!auth || !isFirebaseConfigured) {
    return "Firebase is not configured yet. Add your .env credentials and restart the dev server.";
  }
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");
    await signInWithPopup(auth, provider);
    return null;
  } catch (err: any) {
    const code = err?.code || "";
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      try {
        const provider = new GoogleAuthProvider();
        provider.addScope("email");
        provider.addScope("profile");
        await signInWithRedirect(auth, provider);
        return null;
      } catch {
        return describeAuthError(err);
      }
    }
    return describeAuthError(err);
  }
}
