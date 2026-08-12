I have completed the conversion of your project from Next.js to a Vite-based React application.

Here's a summary of the changes:
- The project now uses Vite for development and building.
- Next.js pages have been converted to React components with routing handled by `react-router-dom`.
- Next.js specific components (`<Image>`, `<Link>`) and APIs (`useRouter`) have been replaced with standard React equivalents.
- The API route for your chatbot has been moved to a separate Express server, which you can find in `server.ts`.
- Next.js configuration files have been removed or updated.
- The `src/app` directory has been renamed to `src/pages` to better reflect its role in a React application.
- `RootLayout` content has been integrated into `App.tsx` and `index.html`.

To run the application, you will need to do the following:

1.  Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```
    You can use `.env.example` as a template.

2.  Open two terminals.
    - In the first terminal, run the API server:
      ```
      npm run dev:server
      ```
    - In the second terminal, run the React application:
      ```
      npm run dev:vite
      ```

Alternatively, you can run both concurrently with `npm run dev`.

You may want to set up a new ESLint configuration for your project, as the previous one was specific to Next.js.