// js/map.js
// создаёт карту Google и 30 маркеров, фильтрация по категориям
// maps API подключается в index.html с callback=initMap (ключ твой)

const ICONS = {
  hospital: "https://i.ibb.co/TqWJ9VTM/palata-vchehii-jpg.webp",
  lawyer: "https://i.ibb.co/0gWD5wW/images-5.jpg",
  shop: "https://i.ibb.co/R49shL6k/images-6.jpg",
  help: "https://i.ibb.co/Fqq6sH5q/istockphoto-1495088043-612x612.jpg"
};

// 30 точек - примеры по Праге (центральные координаты)
const POINTS = [
  { title: "Motol Hospital", pos: {lat:50.057, lng:14.378}, cat:"hospital" },
  { title: "Nemocnice Na Františku", pos: {lat:50.085, lng:14.420}, cat:"hospital" },
  { title: "Klinika Praha", pos: {lat:50.078, lng:14.422}, cat:"hospital" },
  { title: "Právní pomoc centrum A", pos: {lat:50.083, lng:14.412}, cat:"lawyer" },
  { title: "Právní pomoc centrum B", pos: {lat:50.089, lng:14.430}, cat:"lawyer" },
  { title: "Advokátní kancelář C", pos: {lat:50.071, lng:14.425}, cat:"lawyer" },

  { title: "Albert Supermarket", pos: {lat:50.084, lng:14.417}, cat:"shop" },
  { title: "Billa City", pos: {lat:50.076, lng:14.437}, cat:"shop" },
  { title: "Kaufland Praha", pos: {lat:50.085, lng:14.414}, cat:"shop" },
  { title: "Pomoc Centrum 1", pos: {lat:50.082, lng:14.419}, cat:"help" },
  { title: "Pomoc Centrum 2", pos: {lat:50.088, lng:14.427}, cat:"help" },
  { title: "Shelter Point", pos: {lat:50.074, lng:14.432}, cat:"help" },

  // дополнительные точки (до 30)
  { title: "Clinic D", pos: {lat:50.090, lng:14.418}, cat:"hospital" },
  { title: "Clinic E", pos: {lat:50.079, lng:14.404}, cat:"hospital" },
  { title: "Law Office D", pos: {lat:50.081, lng:14.440}, cat:"lawyer" },
  { title: "Law Office E", pos: {lat:50.075, lng:14.433}, cat:"lawyer" },
  { title: "Shop D", pos: {lat:50.083, lng:14.445}, cat:"shop" },
  { title: "Shop E", pos: {lat:50.0715, lng:14.421}, cat:"shop" },
  { title: "Help Center 3", pos: {lat:50.086, lng:14.431}, cat:"help" },
  { title: "Help Center 4", pos: {lat:50.072, lng:14.439}, cat:"help" },
  { title: "Medical Aid 8", pos: {lat:50.0875, lng:14.435}, cat:"hospital" },
  { title: "Legal Aid 9", pos: {lat:50.0785, lng:14.410}, cat:"lawyer" },
  { title: "Shop F", pos: {lat:50.080, lng:14.408}, cat:"shop" },
  { title: "Community Aid", pos: {lat:50.0835, lng:14.425}, cat:"help" },
  { title: "Pharmacy 1", pos: {lat:50.088, lng:14.420}, cat:"shop" },
  { title: "Pharmacy 2", pos: {lat:50.085, lng:14.439}, cat:"shop" },
  { title: "Charity Hub", pos: {lat:50.079, lng:14.430}, cat:"help" },
  { title: "Support Point", pos: {lat:50.0745, lng:14.420}, cat:"help" },
];

let map;
let markers = [];

// инициализация: Google Maps вызовет initMap (callback)
export function initMap() {
  const center = { lat: 50.0755, lng: 14.4378 };
  map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 13,
    gestureHandling: "greedy",
  });
  renderMarkers("all");
  attachFilterButtons();
  // add legend markers if needed
}
window.initMap = initMap;

function createIconFor(cat) {
  const url = ICONS[cat] || ICONS.help;
  return {
    url,
    scaledSize: new google.maps.Size(40, 40),
  };
}

function renderMarkers(filterCat = "all") {
  // очистить старые
  markers.forEach(m => m.setMap(null));
  markers = [];

  POINTS.forEach(p => {
    if (filterCat === "all" || p.cat === filterCat) {
      const mk = new google.maps.Marker({
        position: p.pos,
        map,
        title: p.title,
        icon: createIconFor(p.cat)
      });
      const inf = new google.maps.InfoWindow({ content: `<strong>${p.title}</strong><div>${p.cat}</div>` });
      mk.addListener("click", () => inf.open(map, mk));
      markers.push(mk);
    }
  });
}

// фильтры через кнопки
function attachFilterButtons() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.cat;
      renderMarkers(cat);
    });
  });
  }
