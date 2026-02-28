/**
 * Real time notifications FireBase
 *
 * */
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// config/firebase.ts
import admin from 'firebase-admin';

import serviceAccount from '../../management-accca-firebase-adminsdk-fbsvc-d69349595b.json';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB77tIpMF9FTdss6KePhrXMaFr8mTltmOw',
  authDomain: 'management-accca.firebaseapp.com',
  projectId: 'management-accca',
  storageBucket: 'management-accca.firebasestorage.app',
  messagingSenderId: '880730218420',
  appId: '1:880730218420:web:1a0df38627c2bfb5869ce1',
  measurementId: 'G-6LX2M8TESZ',
};

// Initialize Firebase
initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
