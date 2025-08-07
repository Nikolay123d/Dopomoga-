// firebase/config.js

// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

// Твоя конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDV2BslF-Ll37a1XO3GEfzNMXa7YsSXL1o",
  authDomain: "web-app-b4633.firebaseapp.com",
  databaseURL: "https://web-app-b4633-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "web-app-b4633",
  storageBucket: "web-app-b4633.appspot.com",
  messagingSenderId: "1041887915171",
  appId: "1:1041887915171:web:84d62eae54e9291b47a316",
  measurementId: "G-C65BPE81SJ"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт нужных модулей
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);￼Enter
