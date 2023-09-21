// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDY47UZGP51FxUhXbVL3qaGK1jyUmaSf7o",
  authDomain: "on-tap-monkey.firebaseapp.com",
  projectId: "on-tap-monkey",
  storageBucket: "on-tap-monkey.appspot.com",
  messagingSenderId: "427659340551",
  appId: "1:427659340551:web:bd2cce713df9d15ac3f3a2",
  measurementId: "G-LRYPQQYKKV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
