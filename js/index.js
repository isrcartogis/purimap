const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
// Create a map object with the basemap, center and zoom.
const map = L.map('map',{
    layers: OpenStreetMap_Mapnik,
    center: [ 31.983617, 34.7703552 ],
    zoom: 11,
});