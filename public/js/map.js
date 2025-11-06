document.addEventListener("DOMContentLoaded", () => {
  // Get  JSON string from the script tag
  const data = document.getElementById("listing-coordinates").textContent;

  // Parse it into a JS object
  let { lat, lng, title } = JSON.parse(data);

  // Initialize the map centered on the coordinates
  const map = L.map("map").setView([lat, lng], 14);

  // Add OpenStreetMap tiles
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


  // Add a marker with a popup
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(title)
    .openPopup();

  L.circle([lat, lng], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.2,
    radius: 1000,
    weight:1,
  }).addTo(map);
});
