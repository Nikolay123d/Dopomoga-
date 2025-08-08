here// js/help.js
// Динамика вкладки Помощь (можно расширять)
const helpGrid = document.getElementById("helpGrid");

// (добавим две дополнительные карточки)
if (helpGrid) {
  const extra = [
    {img:"./img/Prague.jpg",title:"Инфо центр",desc:"Общие контакты и справочная информация."},
    {img:"./img/istockphoto-1495088043-612x612.jpg",title:"Добровольцы",desc:"Контакты волонтерских инициатив."}
  ];
  extra.forEach(it=>{
    const card = document.createElement("article");
    card.className = "help-card";
    card.innerHTML = `<img src="${it.img}" alt="${it.title}"><h3>${it.title}</h3><p>${it.desc}</p>`;
    helpGrid.appendChild(card);
  });
}
