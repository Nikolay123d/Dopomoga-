// js/tabs.js
// Отвечает за переключение вкладок и горячие клавиши
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

function openTabById(id) {
  tabButtons.forEach(b => b.classList.toggle("active", b.dataset.target === id));
  tabContents.forEach(c => {
    if (c.id === id) {
      c.style.display = "block";
      c.classList.add("active");
    } else {
      c.style.display = "none";
      c.classList.remove("active");
    }
  });
  // focus input when chat opens
  if (id === "chatTab") {
    const mi = document.getElementById("messageInput");
    if (mi) mi.focus();
  }
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => openTabById(btn.dataset.target));
});

// expose globally for inline usage (if any)
window.openTab = openTabById;

// горячие клавиши
document.addEventListener("keydown", (e) => {
  if (e.key === "c" || e.key === "C") openTabById("chatTab");
  if (e.key === "m" || e.key === "M") openTabById("mapTab");
  if (e.key === "h" || e.key === "H") openTabById("helpTab");
});
