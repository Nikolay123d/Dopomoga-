here// js/firebase-auth.js

import { auth } from '../firebase/firebase-config.js';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// Перевірка, чи користувач вже збережений у localStorage
let currentUser = JSON.parse(localStorage.getItem('user')) || null;

// Якщо користувач є, оновлюємо UI
if (currentUser) {
  showLoggedInUser(currentUser);
}

// Обробка натискання на кнопку надсилання повідомлення
document.getElementById('sendBtn').addEventListener('click', async (e) => {
  if (!currentUser) {
    e.preventDefault();
    await loginWithGoogle();
  } else {
    sendMessage(); // Функція надсилання повідомлення, реалізуєш у chat.js
  }
});

// Авторизація через Google
async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userData = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL
    };

    localStorage.setItem('user', JSON.stringify(userData));
    currentUser = userData;

    showLoggedInUser(userData);
    alert("Успішний вхід. Тепер ви можете писати повідомлення.");
  } catch (error) {
    console.error("Помилка входу:", error);
  }
}

// Оновлення інтерфейсу після входу
function showLoggedInUser(user) {
  const profileImg = document.getElementById('profile-img');
  const profileName = document.getElementById('profile-name');

  if (profileImg && user.photo) profileImg.src = user.photo;
  if (profileName && user.name) profileName.textContent = user.name;
}
