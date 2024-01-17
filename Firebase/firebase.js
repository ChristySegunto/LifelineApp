import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig ={
    apiKey: "AIzaSyDnbOfZhzfZMs1-1YZOa7B01DZVWtSqXxo",
    authDomain: "lifelineapp-fd774.firebaseapp.com",
    projectId: "lifelineapp-fd774",
    storageBucket: "lifelineapp-fd774.appspot.com",
    messagingSenderId: "537979236791",
    appId: "1:537979236791:web:9cb6563ed3b5ed38fd7832"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { app, db }