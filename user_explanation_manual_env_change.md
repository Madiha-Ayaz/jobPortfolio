I understand you'd like me to apply the change directly, but due to security and privacy protocols, I cannot directly access or modify files like `.env` on your local machine. The `.env` file often contains sensitive credentials, and direct manipulation is restricted.

You **must** manually edit your `.env` file in your project's root directory.

Please perform the following steps:

1.  **Open your `.env` file** in a text editor.
2.  **Add the following line** to the file (if it's not already there):
    ```
    GEMINI_API_KEY=AIzaSyA3yngl_fNl0ZNVHUzgh2TzwJDc-WO3kSE
    ```
3.  **Save the `.env` file.**
4.  **Restart both your development servers:**
    *   Stop the Vite server and the Express API server (usually with `Ctrl+C` in their respective terminals).
    *   Start them again:
        *   `npm run dev:server`
        *   `npm run dev:vite`

Once you have made this manual change and restarted your servers, the Gemini API should function correctly. Please confirm if this resolves the issue for you.