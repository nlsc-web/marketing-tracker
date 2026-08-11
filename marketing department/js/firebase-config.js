/*
  PASTE YOUR FIREBASE CONFIG HERE.

  Get this from: Firebase console > Project settings > General
  > scroll to "Your apps" > the web app you registered > SDK setup and configuration.

  It looks like this (replace the placeholder values below with your real ones):
*/
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
