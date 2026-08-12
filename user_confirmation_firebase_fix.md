I have addressed the `Uncaught ReferenceError: process is not defined` error in `src/lib/firebase.ts`.

This error occurred because the application was trying to access `process.env` in a client-side environment, which is not available in a standard React application using Vite.

Here's what I've done:
-   Updated `src/lib/firebase.ts` to use `import.meta.env.VITE_FIREBASE_...` for all Firebase environment variables, aligning with Vite's environment variable handling.
-   Updated the error message for missing API keys to reflect the new naming convention.
-   Created a new `.env.firebase.example` file to guide you on how to set up your Firebase environment variables correctly.

**Important:** You need to update your `.env` file (or `config.env` in production) by renaming all your Firebase environment variables from `NEXT_PUBLIC_FIREBASE_...` to `VITE_FIREBASE_...`. For example, `NEXT_PUBLIC_FIREBASE_API_KEY` should become `VITE_FIREBASE_API_KEY`. Please refer to the `.env.firebase.example` file for the correct naming convention.