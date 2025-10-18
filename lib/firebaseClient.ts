// Client-side Firebase initialization and exports
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfuBVllPelyipAxSWbJi_ihLYkr7TKe3g",
  authDomain: "schedulai-app.firebaseapp.com",
  projectId: "schedulai-app",
  storageBucket: "schedulai-app.firebasestorage.app",
  messagingSenderId: "802550164823",
  appId: "1:802550164823:web:a04917f3498d1b8cda6212",
  measurementId: "G-T5MHB6H8BY",
};

// Ensure we don't re-initialize in Next.js fast refresh / SSR boundaries
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Core client SDK instances
const auth = getAuth(app);
const db = getFirestore(app);

// Guard analytics to the browser only
let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch {
    // Analytics may fail in some environments (e.g., no measurement ID); safe to ignore
  }
}

export { app, auth, db, analytics };