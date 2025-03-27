import { defineNuxtPlugin } from '#app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

export default defineNuxtPlugin(nuxtApp => {
    // Your Firebase config
    const firebaseConfig = {
        apiKey: "AIzaSyBMv1I4tEGUynCMI4UK7QPZ4uRspfvAmuU",
        authDomain: "cis655-fp.firebaseapp.com",
        projectId: "cis655-fp",
        storageBucket: "cis655-fp.firebasestorage.app",
        messagingSenderId: "1089189854369",
        appId: "1:1089189854369:web:0109f6d612f6cb4074c4e0",
        measurementId: "G-WC0RR25GES"
    };

    // Initialize Firebase app
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase services
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    // Provide Firebase services to the Nuxt app
    nuxtApp.provide('auth', auth);
    nuxtApp.provide('firestore', firestore);
});