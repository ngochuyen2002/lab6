import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/messaging";
import "firebase/compat/firestore";
import "firebase/compat/storage"; // Import storage module

firebase.initializeApp({
  apiKey: "AIzaSyCULVDIZwLGrb8B95F9jLEABvDX4mvMCZc",
  authDomain: "lab06-3d9b4.firebaseapp.com",
  projectId: "lab06-3d9b4",
  storageBucket: "lab06-3d9b4.appspot.com",
  messagingSenderId: "539133349296",
  appId: "1:539133349296:web:6e38bb7822541316509a75",
  measurementId: "G-LYENEBP0WD",
});

const auth = firebase.auth();
const messaging = firebase.messaging();
const firestore = firebase.firestore();
const storage = firebase.storage(); // Initialize storage

auth.onAuthStateChanged((user) => {
  if (user) {
    const uid = user.uid;
    console.log("User is signed in");
    console.log(user);
  } else {
    console.log("User is signed out");
  }
});

export { auth, messaging, firestore, storage }; // Export storage
