here// Переключение вкладок
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(button.dataset.tab).style.display = 'block';
  });
});

// Firebase инициализация (конфигурация отдельно в firebase/config.js)
import { app, database, auth, storage } from '../firebase/config.js';
import { ref, push, onChildAdded } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js';
import { uploadBytes, getDownloadURL, ref as storageRef } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js';

const chatList = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message');
const loginModal = document.getElementById('login-modal');
const loginButton = document.getElementById('login-button');
const avatarInput = document.getElementById('avatar');
const nameInput = document.getElementById('nickname');
const profileImage = document.getElementById('profile-image');
const profileName = document.getElementById('profile-name');

const messagesRef = ref(database, 'messages');

// Авторизация
onAuthStateChanged(auth, user => {
  if (user) {
    localStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      name: user.displayName || nameInput.value || 'Гість',
      photoURL: user.photoURL || 'img/default-avatar.png'
    }));
    updateProfileUI();
    loginModal.style.display = 'none';
  } else {
    if (!localStorage.getItem('user')) {
      loginModal.style.display = 'flex';
    }
  }
});

loginButton.addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    alert('Помилка авторизації: ' + error.message);
  }
});

// Отправка сообщений
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    loginModal.style.display = 'flex';
    return;
  }

  const text = messageInput.value.trim();
  if (text === '') return;

  const messageData = {
    name: user.name,
    photo: user.photoURL,
    text,
    timestamp: Date.now()
  };

  await push(messagesRef, messageData);
  messageInput.value = '';
});

// Получение сообщений
onChildAdded(messagesRef, (data) => {
  const msg = data.val();
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-message');
  msgDiv.innerHTML = `
    <img src="${msg.photo}" alt="avatar">
    <div><strong>${msg.name}</strong><p>${msg.text}</p></div>
  `;
  chatList.appendChild(msgDiv);
  chatList.scrollTop = chatList.scrollHeight;
});

// Обновление UI профиля
function updateProfileUI() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    profileImage.src = user.photoURL;
    profileName.textContent = user.name;
  }
}

// Загрузка фото аватара
avatarInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const user = JSON.parse(localStorage.getItem('user'));
  const storageReference = storageRef(storage, `avatars/${user.uid}`);
  await uploadBytes(storageReference, file);
  const photoURL = await getDownloadURL(storageReference);

  user.photoURL = photoURL;
  localStorage.setItem('user', JSON.stringify(user));
  updateProfileUI();
});

// Установка ника
nameInput.addEventListener('change', () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  user.name = nameInput.value;
  localStorage.setItem('user', JSON.stringify(user));
  updateProfileUI();
});
