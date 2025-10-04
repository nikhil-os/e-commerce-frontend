// app/firebase/config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtdqEQ-6i36jN4wjskD9MGmKMNCaZa6Ms",
  authDomain: "e--commerce-2df01.firebaseapp.com",
  projectId: "e--commerce-2df01",
  storageBucket: "e--commerce-2df01.firebasestorage.app",
  messagingSenderId: "52883930355",
  appId: "1:52883930355:web:25f218ba07bccc7eadcb86",
  measurementId: "G-078JPRSNZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication
const auth = getAuth(app);

export { auth };
