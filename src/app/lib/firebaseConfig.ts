// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REMOVED",
  authDomain: "asianlepos.firebaseapp.com",
  projectId: "asianlepos",
  storageBucket: "asianlepos.firebasestorage.app",
  messagingSenderId: "173502388712",
  appId: "1:173502388712:web:234143e63b050935f72c5d",
  measurementId: "G-ZB1DGHFBFR",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
