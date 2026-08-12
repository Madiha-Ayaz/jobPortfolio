I have successfully integrated your contact form with Firebase Firestore!

When a user submits the form, the data (name, email, message, and a timestamp) will now be saved to a new collection named `contacts` in your Firebase Firestore database.

**However, for this to work correctly, you MUST complete some essential setup steps in your Firebase Console:**

### **Step 1: Enable Cloud Firestore in Firebase**

1.  Go to your [Firebase Console](https://console.firebase.google.com/).
2.  Select your project (`website1-e1d59`).
3.  In the left menu, navigate to **Build** > **Firestore Database**.
4.  Click the **"Create database"** button.
5.  You will be prompted to choose a security mode:
    *   For initial testing, you can select **"Start in test mode"**. This allows anyone to read and write to your database for 30 days. **Be aware this is NOT secure for production.**
    *   For more secure development, select **"Start in production mode"**. You will then need to manually set up security rules (see Step 2).
6.  Choose a location for your Firestore database (e.g., `nam5 (us-central)`).
7.  Click **"Enable"**.

### **Step 2: Set up Firestore Security Rules**

If you chose "Start in production mode" or want to make your test mode rules more specific, you'll need to update your Firestore security rules.

1.  While in **Firebase Console** > **Firestore Database**, click on the **"Rules"** tab.
2.  You will see a text editor for your security rules. Here’s an example of basic rules that would allow **anyone** to write to a `contacts` collection (useful for a public contact form) and **only authenticated users** to read (if you wanted to view submissions later).
    *   **For Public Write Access (Be Cautious in Production!):**
        ```firestore
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /contacts/{document=**} {
              allow read: if request.auth != null; // Only authenticated users can read
              allow write: if true; // Anyone can write
            }
          }
        }
        ```
    *   **For Authenticated Users Only (Read and Write):**
        ```firestore
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /contacts/{document=**} {
              allow read, write: if request.auth != null; // Only authenticated users can read and write
            }
          }
        }
        ```
3.  Modify your rules as needed and click **"Publish"**.

---

**After you complete these Firebase Console setup steps, restart your Next.js development server (`npm run dev`)** and then test your contact form. The submissions should appear in your Firestore database under the `contacts` collection.