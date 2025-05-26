const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});
// Create a map object with the basemap, center and zoom.
const map = L.map('map',{
    layers: CartoDB_PositronNoLabels,
    center: [ 31.983617, 34.7703552 ],
    zoom: 11,
});

L.control.logo({ position: 'bottomleft' }).addTo(map);
let leaderboard = L.control.leaderboard({ position: 'topleft' })
let whatsyourname = L.control.whatsyourname({ position: 'topright' })

onMapLoad()
