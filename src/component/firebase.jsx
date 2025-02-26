// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Firebase Storage ko import karein

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDZKkJ9a5jd2fWMD9Z8NFjB7rkh8rd_oU",
  authDomain: "authentication-ff81e.firebaseapp.com",
  projectId: "authentication-ff81e",
  storageBucket: "authentication-ff81e.appspot.com",
  messagingSenderId: "122326198392",
  appId: "1:122326198392:web:5d3b8f37106e839152658d"
};

// Initialize Firebase
  const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Firebase Storage ko initialize karein

export { auth, db, storage };


