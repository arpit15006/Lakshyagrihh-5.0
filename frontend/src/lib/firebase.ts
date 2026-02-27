import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCsYX8dhGKi102Vl-_tn0pYLoA5546Zi1M",
  authDomain: "fleetflow-9e083.firebaseapp.com",
  projectId: "fleetflow-9e083",
  storageBucket: "fleetflow-9e083.firebasestorage.app",
  messagingSenderId: "1087483035188",
  appId: "1:1087483035188:web:37e74e4f4cdc729dfbd461",
  measurementId: "G-NMNF0JDLZW"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
