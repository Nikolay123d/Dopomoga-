import { auth, database, storage } from "../firebase/config.js";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
  ref as dbRef,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

const chatTab = document.getElementById("chat-tab");
const mapTab = document.getElementById("map-tab");
const infoTab = document.getElementById("info-tab");

const chatSection = document.getElementById("chat-section");
const mapSection = document.getElementById("map-section");
const infoSection = document.getElementById("info-section");

const loginModal = document.getElementById("login-modal");
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const messagesContainer = document.getElementById("messages");

const nameInput = document.getElementById("nickname");
const profileImage = document.getElementById("profile-image");
const profileUpload = document.getElementById("profile-upload");

// Навигация по вкладкам
chatTab.onclick = () => {
  showSection(chatSection);
};
mapTab.onclick = () => {
  showSection(mapSection);
};
infoTab.onclick = () => {
  showSection(infoSection);
};

function showSection(section) {
  chatSection.style.display = "none";
  mapSection.style.display = "none";
  infoSection.style.display = "none";
  section.style.display = "block";
}

// Проверка авторизации
onAuthStateChanged(auth, user => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    loginModal.style.display = "none";
  } else {
    localStorage.removeItem("user");
    loginModal.style.display = "block";
  }
});

// Авторизация через Google
document.getElementById("google-login").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
});

// Отправка сообщения
sendButton.onclick = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    loginModal.style.display = "block";
    return;
  }

  const nickname = nameInput.value || "Анонім";
  const text = messageInput.value.trim();
  if (text === "") return;

  const message = {
    uid: user.uid,
    nickname: nickname,
    text: text,
    timestamp: Date.now()
  };

  await push(dbRef(database, "messages"), message);
  messageInput.value = "";
};

// Загрузка сообщений
onChildAdded(dbRef(database, "messages"), snapshot => {
  const msg = snapshot.val();
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `<strong>${msg.nickname}</strong>: ${msg.text}`;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Загрузка аватарки
profileUpload.addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const storageReference = storageRef(storage, `avatars/${user.uid}`);
  await uploadBytes(storageReference, file);
  const url = await getDownloadURL(storageReference);
  profileImage.src = url;
  localStorage.setItem("avatar", url);
});

// Показать сохранённую аватарку
window.addEventListener("DOMContentLoaded", () => {
  const savedAvatar = localStorage.getItem("avatar");
  if (savedAvatar) {
    profileImage.src = savedAvatar;
  }
});
