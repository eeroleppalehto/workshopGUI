// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import for Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUl43uq0ZJ86DDApRebmOM86PKK4xaS_s",
    authDomain: "ichkanndasallesnichtmehr-cb7be.firebaseapp.com",
    databaseURL: "https://ichkanndasallesnichtmehr-cb7be-default-rtdb.europe-west1.firebasedatabase.app", // Your Realtime Database URL
    projectId: "ichkanndasallesnichtmehr-cb7be",
    storageBucket: "ichkanndasallesnichtmehr-cb7be.appspot.com",
    messagingSenderId: "882682309905",
    appId: "1:882682309905:web:021036a5ef6d3213b730b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
//
