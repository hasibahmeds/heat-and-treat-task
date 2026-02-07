// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAOdwUB83quL-T3gLWmshmM7-FUG4hONiA",
  authDomain: "reacthasib.firebaseapp.com",
  projectId: "reacthasib",
  storageBucket: "reacthasib.firebasestorage.app",
  messagingSenderId: "62525725315",
  appId: "1:62525725315:web:0752ba32eaa4ee56ffd9b6",
  measurementId: "G-3EVK9SPHLQ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Optional analytics (guarded for environments where it is not supported)
isSupported()
  .then((yes) => {
    if (yes) getAnalytics(app);
  })
  .catch(() => {});