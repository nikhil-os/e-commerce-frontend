// app/firebase/config.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyDtdqEQ-6i36jN4wjskD9MGmKMNCaZa6Ms',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'e--commerce-2df01.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'e--commerce-2df01',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'e--commerce-2df01.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '52883930355',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:52883930355:web:25f218ba07bccc7eadcb86',
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-078JPRSNZ3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication
const auth = getAuth(app);

export { auth };
