// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6zHGWm3ZPS23G5y7l3J9Cw2mb6sf3rFU",
  authDomain: "pantry-manager-f232a.firebaseapp.com",
  projectId: "pantry-manager-f232a",
  storageBucket: "pantry-manager-f232a.appspot.com",
  messagingSenderId: "455977021702",
  appId: "1:455977021702:web:06f313bc21b946ef2e6e87",
  measurementId: "G-RR61EW7D8K"
};


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const firestore = getFirestore(app);


// export{app, firestore}
