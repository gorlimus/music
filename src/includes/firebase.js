import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  updateProfile,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  setDoc,
  addDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BACKET,
  messagingSenderId: import.meta.env.VITE_FB_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore();
const createUser = createUserWithEmailAndPassword;
const songsCollection = collection(db, "songs");
const usersCollection = collection(db, "users");

export {
  auth,
  createUser,
  updateProfile,
  db,
  songsCollection,
  usersCollection,
  doc,
  setDoc,
  addDoc,
  signInWithEmailAndPassword,
  signOut,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
};
