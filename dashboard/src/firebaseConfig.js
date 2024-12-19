import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Din Firebase-konfiguration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  databaseURL: "YOUR_FIREBASE_DATABASE_URL",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"

};


// Initiera Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exportera för användning i andra filer
export { database, ref, onValue };
