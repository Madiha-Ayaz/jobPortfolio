I have integrated the `react-phone-number-input` library into your phone login page.

Now, instead of a simple text input, you will see a phone number input field that allows you to:
*   Select the country from a dropdown.
*   Automatically formats the phone number to E.164 format.
*   Provides client-side validation for the entered number.

**To test this new functionality:**

1.  **Ensure your Next.js development server is running (`npm run dev`).**
2.  Go to the login page, then navigate to the "Sign in with Phone Number" page (`http://localhost:3000/auth/phone-login`).
3.  You should now see the enhanced phone number input. Select your country and enter your phone number.

**Important Notes:**

*   **Styling:** The `react-phone-number-input` component comes with its own default styling. While I've tried to apply some basic Tailwind classes, you might need to add custom CSS to fully match your project's aesthetic. You can inspect the elements to find the correct classes to override.
*   **Firebase Console Setup:** Remember that Phone Authentication still requires proper setup in the Firebase Console (enabling phone sign-in, adding authorized domains for reCAPTCHA).

Please test this new input and let me know if it works as expected.