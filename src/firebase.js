import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC097zfJTujVoFLA-B-rFIaDIg2DKUV_VY",
  authDomain: "pitudiet-2d166.firebaseapp.com",
  projectId: "pitudiet-2d166",
  storageBucket: "pitudiet-2d166.firebasestorage.app",
  messagingSenderId: "492904065341",
  appId: "1:492904065341:web:327843f217d438597f7d54",
  measurementId: "G-0037KHGYWX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);