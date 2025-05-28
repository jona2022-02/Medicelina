// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey:",
  authDomain: "",
  projectId: "",
  storageBucket: "medi.firebasestorage.app",
  messagingSenderId: "30",
  "
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
