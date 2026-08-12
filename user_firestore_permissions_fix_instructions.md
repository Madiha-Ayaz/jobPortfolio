The error "FirebaseError: Missing or insufficient permissions" indicates that your Firebase Cloud Firestore security rules are preventing the contact form from writing data to the `contacts` collection. This is a configuration issue within your Firebase project, not an issue with the code itself.

To fix this, you need to update your Firestore security rules in the Firebase Console.

**Please follow these steps carefully:**

### **Step 1: Go to your Firestore Database Rules**

1.  Go to your [Firebase Console](https://console.firebase.google.com/).
2.  Select your project (`website1-e1d59`).
3.  In the left menu, navigate to **Build** > **Firestore Database**.
4.  Click on the **"Rules"** tab.

### **Step 2: Update the Security Rules**

You will see a text editor for your security rules. Replace the existing rules with the following to allow **anyone** to write to your `contacts` collection. This is suitable for a public contact form for initial testing, but remember to review security best practices for production.

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

### **Step 3: Publish the Rules**

1.  After pasting the rules above, click the **"Publish"** button to apply the changes.

---

Once you have updated and published these rules, restart your Next.js development server (`npm run dev`) and test your contact form again. The submissions should now successfully appear in your Firestore database under the `contacts` collection.