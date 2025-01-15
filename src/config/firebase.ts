// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "lapakhub.firebaseapp.com",
  projectId: "lapakhub",
  storageBucket: "lapakhub.firebasestorage.app",
  messagingSenderId: "635850459096",
  appId: "1:635850459096:web:e5b867ccfa13c3502e14ad",
  measurementId: "G-T51SFQLBB2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
