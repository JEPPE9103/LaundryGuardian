import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Din Firebase-konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyB6DC9yZOmZUxQCkrXwv8sxCcr1uYoDiAo",
  authDomain: "laundryguardian.firebaseapp.com",
  databaseURL: "https://laundryguardian-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "laundryguardian",
  storageBucket: "laundryguardian.firebasestorage.app",
  messagingSenderId: "393744233954",
  appId: "1:393744233954:web:d4d6d8ec95474fbb1b75bb"
};

// Initiera Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exportera för användning i andra filer
export { database, ref, onValue };
