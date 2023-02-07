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
  orderBy,
  limit,
  startAfter,
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
import { enableIndexedDbPersistence } from "firebase/firestore";

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

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    console.log(`Firebase persistance error ${err.code}`);
  } else if (err.code == "unimplemented") {
    console.log(`Firebase unimplemented error ${err.code}`);
  }
});

const createUser = createUserWithEmailAndPassword;
const songsCollection = collection(db, "songs");
const usersCollection = collection(db, "users");
const commentsCollection = collection(db, "comments");

export {
  auth,
  createUser,
  updateProfile,
  db,
  usersCollection,
  songsCollection,
  commentsCollection,
  doc,
  setDoc,
  addDoc,
  signInWithEmailAndPassword,
  signOut,
  query,
  where,
  orderBy,
  limit,
  startAfter,
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
