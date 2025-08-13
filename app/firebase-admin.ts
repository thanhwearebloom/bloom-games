import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";

const adminApp = initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FB_PROJECT_ID,
    privateKey: process.env.FB_PRIVATE_KEY,
    clientEmail: process.env.FB_CLIENT_EMAIL,
  }),
});

export default adminApp;
