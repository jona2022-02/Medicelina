// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBl8COPnwdflRd7E0GyxwBfQ3dIg4KD98g",
  authDomain: "medic-5c272.firebaseapp.com",
  projectId: "medic-5c272",
  storageBucket: "medic-5c272.firebasestorage.app",
  messagingSenderId: "309596331106",
  appId: "1:309596331106:web:c31a481668df73c79d453b"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
