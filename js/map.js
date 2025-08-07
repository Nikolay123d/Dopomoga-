const mapContainer = document.getElementById('map-container');

const locations = [
  { name: "Центр допомоги", lat: 50.087, lng: 14.420 },
  { name: "Аптека", lat: 50.089, lng: 14.417 },
  { name: "Продукти", lat: 50.088, lng: 14.422 },
  { name: "Інфоцентр", lat: 50.086, lng: 14.423 },
  { name: "Міграційна служба", lat: 50.084, lng: 14.421 },
  { name: "Гуртожиток", lat: 50.090, lng: 14.425 },
  { name: "ЦНАП", lat: 50.091, lng: 14.419 },
  { name: "Медичний центр", lat: 50.085, lng: 14.418 },
  { name: "Перукарня", lat: 50.083, lng: 14.416 },
  { name: "Українське кафе", lat: 50.088, lng: 14.415 },
  { name: "Крамниця одягу", lat: 50.089, lng: 14.428 },
  { name: "Транспортний вузол", lat: 50.087, lng: 14.429 },
  { name: "Дитячий садок", lat: 50.092, lng: 14.427 },
  { name: "Школа", lat: 50.093, lng: 14.423 },
  { name: "Благодійна організація", lat: 50.094, lng: 14.426 },
  { name: "Волонтерський штаб", lat: 50.090, lng: 14.418 },
];

// Простий рендер (без Google Maps)
mapContainer.innerHTML = '<ul class="location-list">' +
  locations.map(loc => `<li>📍 <strong>${loc.name}</strong></li>`).join('') +
  '</ul>';
￼Enter
