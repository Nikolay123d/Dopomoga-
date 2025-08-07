// Firebase инициализация
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getDatabase, ref, push, onChildAdded
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import {
  getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// Твой Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDVW5HTBG...",
  authDomain: "chatpraha-xxxx.firebaseapp.com",
  projectId: "chatpraha-xxxx",
  storageBucket: "chatpraha-xxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  databaseURL: "https://chatpraha-xxxx-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM элементы
const chatTab = document.getElementById("chat-tab");
const mapTab = document.getElementById("map-tab");
const infoTab = document.getElementById("info-tab");

const chatScreen = document.getElementById("chat-screen");
const mapScreen = document.getElementById("map-screen");
const infoScreen = document.getElementById("info-screen");

const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const fileInput = document.getElementById("file-input");
const messagesContainer = document.getElementById("messages");
const modal = document.getElementById("auth-modal");
const loginBtn = document.getElementById("login-btn");

let currentUser = null;

// Вкладки
chatTab.onclick = () => {
  showTab("chat");
};
mapTab.onclick = () => {
  showTab("map");
};
infoTab.onclick = () => {
  showTab("info");
};

function showTab(tab) {
  chatScreen.classList.add("hidden");
  mapScreen.classList.add("hidden");
  infoScreen.classList.add("hidden");

  if (tab === "chat") chatScreen.classList.remove("hidden");
  if (tab === "map") mapScreen.classList.remove("hidden");
  if (tab === "info") infoScreen.classList.remove("hidden");
}

// Авторизация
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    document.getElementById("avatar").src = user.photoURL || "img/avatar.png";
    document.getElementById("username").textContent = user.displayName || "Користувач";
    modal.style.display = "none";
  } else {
    currentUser = null;
    modal.style.display = "flex";
  }
});

loginBtn.onclick = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      modal.style.display = "none";
    })
    .catch((error) => {
      alert("Помилка авторизації");
    });
};

// Отправка сообщений
sendBtn.onclick = () => {
  if (!currentUser) {
    modal.style.display = "flex";
    return;
  }

  const text = messageInput.value;
  const file = fileInput.files[0];

  const message = {
    text: text,
    sender: currentUser.displayName || "Користувач",
    avatar: currentUser.photoURL || "img/avatar.png",
    timestamp: Date.now()
  };

  push(ref(db, "messages"), message);
  messageInput.value = "";
};

// Загрузка сообщений
onChildAdded(ref(db, "messages"), (snapshot) => {
  const msg = snapshot.val();
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `
    <img src="${msg.avatar}" alt="avatar">
    <div>
      <strong>${msg.sender}</strong>
      <p>${msg.text}</p>
    </div>
  `;
  messagesContainer.appendChild(div);
});
