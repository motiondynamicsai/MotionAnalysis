import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import the auth module

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATXJlQmmznAM9z0ZriLI0r7TM1anlUoX0",
  authDomain: "motiondynamicsapp.firebaseapp.com",
  projectId: "motiondynamicsapp",
  storageBucket: "motiondynamicsapp.appspot.com",
  messagingSenderId: "708228928163",
  appId: "1:708228928163:web:78e7a175ced87e6ceee516",
  measurementId: "G-YQD6WJLP9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication

// Conditionally import and initialize Firebase Analytics
let analytics;
if (typeof window !== 'undefined') {
  const { getAnalytics } = require("firebase/analytics");
  analytics = getAnalytics(app);
}

export { auth, analytics }; // Export the auth and analytics instances
