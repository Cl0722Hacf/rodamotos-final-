import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA_xrKgCEpB514ruNLfaaexSfdMg7vzQ5Y",
    authDomain: "rodamotos-final.firebaseapp.com",
    projectId: "rodamotos-final",
    storageBucket: "rodamotos-final.firebasestorage.app",
    messagingSenderId: "755302609410",
    appId: "1:755302609410:web:dc7784f5a5f6d53728ed1b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
