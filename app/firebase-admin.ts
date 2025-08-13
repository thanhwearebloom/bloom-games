import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";

const adminApp = initializeApp({
  credential: admin.credential.cert({
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    privateKey: import.meta.env.VITE_FIREBASE_PRIVATE_KEY,
    clientEmail: import.meta.env.VITE_FIREBASE_CLIENT_EMAIL,
  }),
});

export default adminApp;
