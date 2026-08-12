I have identified and fixed the error related to `recaptchaVerifier.current.clear()` in `src/app/auth/phone-login/page.tsx`.

The `RecaptchaVerifier` object for invisible reCAPTCHA in Firebase does not have a `.clear()` method. Calling it caused the runtime error you saw. I have removed these incorrect calls from the code.

**Please test the phone login functionality again.**

1.  **Ensure your Next.js development server is running (`npm run dev`).**
2.  Go to the login page, then navigate to the "Sign in with Phone Number" page.
3.  Enter a phone number and try to send the OTP.

The error should now be resolved, and the reCAPTCHA should function correctly.