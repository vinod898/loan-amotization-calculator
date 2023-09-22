// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9IPmwdKoQzxkF2s9RA0aPbtg8KNexdF4",
  authDomain: "loan-amortization-aa45e.firebaseapp.com",
  projectId: "loan-amortization-aa45e",
  storageBucket: "loan-amortization-aa45e.appspot.com",
  messagingSenderId: "741950829721",
  appId: "1:741950829721:web:3f1442f92280371ec1b408",
  measurementId: "G-7ZW27D9WHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)