// js/auth.js
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { ref as dbRef, set as dbSet, get as dbGet } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

/*
  Логика:
  - При регистрации: createUser..., updateProfile(displayName = nick)
    -> сохраняем createdAt в Realtime DB: users/{uid}/createdAt
    -> локально сохраняем regTime_uid = Date.now()
    -> отправляем email verification
  - canSendMessage(): true если emailVerified OR (createdAt < 6 часов)
    возвращает Promise<boolean>
  - Экспортируем showAuthModal() и canSendMessage()
*/

const authModal = document.getElementById("authModal");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const nickInput = document.getElementById("nickInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const registerSubmit = document.getElementById("registerSubmit");
const loginShow = document.getElementById("loginShow");
const loginSubmit = document.getElementById("loginSubmit");
const backToRegister = document.getElementById("backToRegister");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const modalClose = document.getElementById("modalClose");

function showAuthModal() {
  authModal.style.display = "flex";
  authModal.setAttribute("aria-hidden", "false");
}

function hideAuthModal() {
  authModal.style.display = "none";
  authModal.setAttribute("aria-hidden", "true");
}

/* переключения внутри модалки */
loginShow?.addEventListener("click", () => {
  registerForm.style.display = "none";
  loginForm.style.display = "block";
});
backToRegister?.addEventListener("click", () => {
  registerForm.style.display = "block";
  loginForm.style.display = "none";
});
modalClose?.addEventListener("click", hideAuthModal);
authModal?.addEventListener("click", (e) => {
  if (e.target === authModal) hideAuthModal();
});

/* регистрация */
registerSubmit?.addEventListener("click", async () => {
  const nick = nickInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passwordInput.value.trim();
  if (!nick || !email || !pass) {
    alert("Заполните все поля");
    return;
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: nick });
    // записать createdAt в Realtime DB
    await dbSet(dbRef(db, "users/" + cred.user.uid), { nick, createdAt: Date.now() });
    // сохранить локально
    localStorage.setItem("regTime_" + cred.user.uid, String(Date.now()));
    await sendEmailVerification(cred.user);
    alert("Вы зарегистрированы. Мы отправили письмо подтверждения. У вас 6 часов доступа без подтверждения.");
    hideAuthModal();
  } catch (err) {
    alert("Ошибка регистрации: " + err.message);
  }
});

/* вход */
loginSubmit?.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const pass = loginPassword.value.trim();
  if (!email || !pass) return alert("Заполните email и пароль");
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    hideAuthModal();
  } catch (err) {
    alert("Ошибка входа: " + err.message);
  }
});

/* проверка: можно ли писать (emailVerified OR within 6 hours since createdAt) */
export async function canSendMessage() {
  const user = auth.currentUser;
  if (!user) return false;
  // если подтверждён — можно
  if (user.emailVerified) return true;

  const uid = user.uid;
  // локальный маркер
  const localKey = "regTime_" + uid;
  const localVal = localStorage.getItem(localKey);
  const sixHours = 6 * 60 * 60 * 1000;
  if (localVal && (Date.now() - Number(localVal) < sixHours)) return true;

  // попробуем взять createdAt из БД
  try {
    const snap = await dbGet(dbRef(db, "users/" + uid + "/createdAt"));
    if (snap && snap.exists()) {
      const createdAt = Number(snap.val());
      if (!Number.isNaN(createdAt) && (Date.now() - createdAt < sixHours)) {
        // сохраним локально для ускорения следующих проверок
        localStorage.setItem(localKey, String(createdAt));
        return true;
      }
    }
  } catch (e) {
    console.error("db get error", e);
  }

  // иначе — нельзя
  return false;
}

/* экспорт функции показа модалки */
export { showAuthModal };

/* следим за сменой авторизации — при выходе очистим локальные переменные (не удаляем regTime) */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // анонимная сессия
  } else {
    // можно обновить UI (например, показать ник где-то)
    console.log("Signed in:", user.uid, user.email, "verified:", user.emailVerified);
  }
});
