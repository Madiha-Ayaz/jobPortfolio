Okay, I have successfully added the Phone Number Login functionality to your application!

You can now find a "Sign in with Phone Number" link on your login page, which will lead to a dedicated page for phone authentication.

**However, this functionality will NOT work until you complete some essential setup steps in your Firebase Console.**

Please follow these steps very carefully:

### **Step 1: Enable Phone Number Sign-in Method in Firebase**

1.  Go to your [Firebase Console](https://console.firebase.google.com/).
2.  Select your project (`website1-e1d59`).
3.  In the left menu, navigate to **Build** > **Authentication**.
4.  Click on the **"Sign-in method"** tab at the top.
5.  Find the **"Phone number"** provider in the list and click on it.
6.  **Toggle the switch to "Enable"** phone number sign-in.
7.  Click **"Save"**.

### **Step 2: Add your Domain to the OAuth Redirect Domains (for reCAPTCHA)**

Firebase Phone Authentication uses reCAPTCHA to prevent abuse. For this to work correctly in your development environment, you must authorize your local domain.

1.  While still in **Firebase Console** > **Authentication** > **Sign-in method**, scroll down to the **"Authorized domains"** section (usually under the "Google" provider, but it applies globally for reCAPTCHA).
2.  Click **"Add domain"**.
3.  Enter your local development domain: `localhost:3000`
4.  Click **"Add"** and then **"Save"** the list of authorized domains.

---

**After you complete these two steps in your Firebase Console, restart your Next.js development server (`npm run dev`)** and then test the phone login functionality. You should then be able to send OTPs and sign in with a phone number.

If you encounter issues, ensure you are providing phone numbers in the E.164 format (e.g., `+11234567890`).

I have completed the task of adding phone authentication.