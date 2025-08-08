// js/chat.js
import { auth, db, storage } from "./firebase-config.js";
import { push, ref as dbRef, onChildAdded, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { canSendMessage, showAuthModal } from "./auth.js";

const messagesEl = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const fileInput = document.getElementById("fileInput");

// default avatar (локальное)
const DEFAULT_AVATAR = "./img/istockphoto-1495088043-612x612.jpg";

// обработчик: отправка текста/фото
sendButton.addEventListener("click", async () => {
  // если нет user — показать модалку
  if (!auth.currentUser) {
    showAuthModal();
    return;
  }

  // проверка возможности отправлять (emailVerified или within 6 hours)
  const ok = await canSendMessage();
  if (!ok) {
    alert("Пожалуйста, подтвердите email — после 6 часов с момента регистрации доступ будет закрыт.");
    return;
  }

  const text = messageInput.value.trim();
  const file = fileInput.files[0];

  if (!text && !file) return; // пустое сообщение

  // если есть файл — загрузим сначала в Storage
  let imageUrl = null;
  if (file) {
    try {
      const uid = auth.currentUser.uid;
      const sRef = storageRef(storage, `chat_images/${uid}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(sRef, file);
      // простой промис для ожидания завершения
      await new Promise((res, rej) => {
        uploadTask.on('state_changed', null, (err) => rej(err), async () => {
          imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          res();
        });
      });
    } catch (err) {
      console.error("Upload error", err);
      alert("Ошибка загрузки файла");
    }
  }

  // подготовим объект сообщения
  const msg = {
    uid: auth.currentUser.uid,
    nick: auth.currentUser.displayName || auth.currentUser.email || "Аноним",
    avatar: auth.currentUser.photoURL || DEFAULT_AVATAR,
    text: text || null,
    image: imageUrl || null,
    ts: Date.now()
  };

  // пушим в Realtime DB
  await push(dbRef(db, "messages"), msg);

  // очистим поля
  messageInput.value = "";
  fileInput.value = "";
});

// показ сообщений — подписка
onChildAdded(dbRef(db, "messages"), (snap) => {
  const m = snap.val();
  displayMessage(m);
});

// helper: формат времени
function timeAgo(ts){
  const d = new Date(ts);
  return d.toLocaleString();
}

// отображение сообщения в DOM
function displayMessage(m){
  const wrap = document.createElement("div");
  wrap.className = "message";

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = m.avatar || DEFAULT_AVATAR;
  avatar.alt = m.nick || "avatar";

  const txt = document.createElement("div");
  txt.className = "message-content";
  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.textContent = `${m.nick || "Аноним"} · ${timeAgo(m.ts)}`;

  txt.appendChild(meta);
  if (m.text) {
    const p = document.createElement("div");
    p.innerText = m.text;
    txt.appendChild(p);
  }
  if (m.image) {
    const im = document.createElement("img");
    im.src = m.image;
    im.alt = "Фото";
    im.className = "chat-image";
    im.style.maxWidth = "240px";
    im.style.marginTop = "8px";
    im.style.borderRadius = "8px";
    txt.appendChild(im);
  }

  wrap.appendChild(avatar);
  wrap.appendChild(txt);

  messagesEl.appendChild(wrap);
  // автопрокрутка вниз
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// выбрать фото через label
document.querySelector(".camera-btn").addEventListener("click", () => {
  fileInput.click();
});
