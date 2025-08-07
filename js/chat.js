herechat.js

import { db } from '../firebase/firebase-config.js';
import {
  ref,
  push,
  onChildAdded,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// Отримуємо користувача з localStorage
const user = JSON.parse(localStorage.getItem('user'));

// Елементи
const chatBox = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('sendBtn');

// Відправка повідомлення
sendBtn.addEventListener('click', async () => {
  if (!user) return;

  const text = messageInput.value.trim();
  if (text === '') return;

  const messageData = {
    text: text,
    name: user.name,
    photo: user.photo,
    timestamp: Date.now()
  };

  try {
    await push(ref(db, 'messages'), messageData);
    messageInput.value = '';
  } catch (err) {
    console.error('Помилка при надсиланні повідомлення:', err);
  }
});

// Відображення повідомлень у чаті
onChildAdded(ref(db, 'messages'), (snapshot) => {
  const msg = snapshot.val();
  renderMessage(msg);
});

// Рендер повідомлення
function renderMessage(msg) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');

  msgDiv.innerHTML = `
    <div class="msg-header">
      <img src="${msg.photo || 'img/user.png'}" alt="Avatar" class="msg-avatar">
      <span class="msg-name">${msg.name}</span>
    </div>
    <div class="msg-text">${msg.text}</div>
  `;

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
