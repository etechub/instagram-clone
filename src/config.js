// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyASQVIfAdKl_DWqz9Ze8qDWMbZ0baX9Stg",
    authDomain: "etech-projects-cent.firebaseapp.com",
    projectId: "etech-projects-cent",
    storageBucket: "etech-projects-cent.appspot.com",
    messagingSenderId: "94033725190",
    appId: "1:94033725190:web:8a9406eff59166bffd4087",
    measurementId: "G-8K98ZC0D89"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

var apps = getApps()
var app;
try {
    if (!apps?.length) {
        app = initializeApp(firebaseConfig);
    }
} catch (error) {
    console.log('Firebase error:', error)
}


// const analytics = getAnalytics();
const storage = getStorage();
const db = getFirestore()
const auth = getAuth()

export { db, storage, auth };