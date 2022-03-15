const appsscriptUrl = "https://script.google.com/macros/s/AKfycbwXRO_WVyU2eJY73bxukLbku0BY5w1s5SOrcWdURy7vawVFFfyk-_ZBhGpgHsoZTHb-/exec"
let features = [];
let usableFeatures = [];
let userName = "";
let userPoints = 0;
let tries = 0;
let playersList = []
let currentPolygonLayer = L.geoJson({
    "type": "FeatureCollection",
    "features": []
  })

async function sendScore(userName,userPoints,tries){
    let url = appsscriptUrl+`?user=${userName}&score=${userPoints}&tries=${tries}`
    let response = await fetch(url,{method: "POST"})
    playersList = await response.json()
    
    playersList.sort(function (a, b) {return b.score - a.score});
    return playersList
}

function polygonToMarker(center, polygon, bearing, scale ){
    distances = []
    bearings = []
    coordinates = polygon.geometry.coordinates[0][0];
    centroid = turf.center(polygon)
    for(i in coordinates){
        to = turf.point(coordinates[i]);
        options = {units: 'kilometers'};
        distanceI = turf.distance(centroid, to, options);
        bearingI = turf.bearing(centroid, to);
        bearings.push(bearingI)
        distances.push(distanceI)
        }
    //console.log({distances, bearings})
    points = []
    for(j in distances){
        distanceJ = distances[j]
        bearingJ = bearings[j]
        point = turf.destination(center, distanceJ, bearingJ);
        points.push(point.geometry.coordinates)
    }
    polygon = turf.polygon([points])
    if(bearing){
        polygon = turf.transformRotate(polygon,bearing);
    }
    if(scale){
        polygon = turf.transformScale(polygon, scale);
    }
    return polygon
}

function selectRandomPolygon(features){
    let i = Math.floor(Math.random() * features.length);
    let polygon = features[i];
    return polygon
}
function selectRandomLocation(features){
    let i = Math.floor(Math.random() * features.length);
    center = turf.centroid(features[i]);
    return center;
}
function selectQuestionOptions(features, polygon){
    ids = [polygon.properties.SEMEL_YISH]
    for(var i=0;i<4;i++){
        optionalFeatures = features.filter(x => ids.includes(x.properties.SEMEL_YISH) === false)
        let j = Math.floor(Math.random() * optionalFeatures.length);
        ids.push(optionalFeatures[j].properties.SEMEL_YISH)
    }
    return shuffle(ids);
    
}
function getNewRandoms(){
    if(usableFeatures.length >= 5){
        if(map.hasLayer(currentPolygonLayer)){
            map.removeLayer(currentPolygonLayer)
        }
        if(currentQuestions._map){
            map.removeControl(currentQuestions)
        }
        if(whatnow._map){
            map.removeControl(whatnow)
        }
        polygon = selectRandomPolygon(usableFeatures);
        questionOptions = selectQuestionOptions(usableFeatures,polygon);
        center = selectRandomLocation(usableFeatures);
        newPolygon = polygonToMarker(center.geometry.coordinates, polygon);
        newBounds = turf.bboxPolygon(turf.bbox(newPolygon))
        newLBounds = L.geoJson(newBounds).getBounds()
        coords = newPolygon.geometry.coordinates
        coords[0].forEach(x => x = x.reverse())
        currentPolygonLayer = L.polygon(coords,{color: 'red',draggable: true})
        currentPolygonLayer.addTo(map);
        map.fitBounds(newLBounds);
        currentQuestions = L.control.question({ids:questionOptions})
        currentQuestions.addTo(map)
    }else{
        openScoreboard(true)
    }
    
}
function getUserName(){
    if(whatnow._map){
        map.removeControl(whatnow)
    }
    whatsyourname.addTo(map)
}
function openScoreboard(done=false){
    if(leaderboard._map){
        map.removeControl(leaderboard)
    }
    if(currentQuestions._map){
        map.removeControl(currentQuestions)
    }
    if(whatsyourname._map){
        map.removeControl(whatsyourname)
    }
    leaderboard.addTo(map)
}

function getAnswer(e){
    tries +=1
    if(e.target.id == polygon.properties.SEMEL_YISH){
        userPoints += 1
    }
    if(currentQuestions._map){
        map.removeControl(currentQuestions)
    }
    if(whatnow._map){
        map.removeControl(whatnow)
    }
    usableFeatures = usableFeatures.filter(x => x.properties.SEMEL_YISH != polygon.properties.SEMEL_YISH)
    whatnow = L.control.continue({score:userPoints,tries:tries});
    whatnow.addTo(map);
}
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
async function onMapLoad(){
    const response = await fetch('set20k.fgb')
    for await (const f of flatgeobuf.deserialize(response.body)){
        feature = f;
        features.push(feature)
        usableFeatures.push(feature)
    }   
    polygon = selectRandomPolygon(features);
    questionOptions = selectQuestionOptions(features,polygon);
    center = selectRandomLocation(features);
    newPolygon = polygonToMarker(center.geometry.coordinates, polygon);
    newBounds = turf.bboxPolygon(turf.bbox(newPolygon))
    newLBounds = L.geoJson(newBounds).getBounds()
    //tempGJ = L.geoJson(newPolygon)
    coords = newPolygon.geometry.coordinates
    coords[0].forEach(x => x = x.reverse())
    currentPolygonLayer = L.polygon(coords,{color: 'red',draggable: true})
    currentPolygonLayer.addTo(map);
    currentPolygonLayer.dragging.enable()
    map.fitBounds(newLBounds);
    currentQuestions = L.control.question({ids:questionOptions})
    whatnow = L.control.continue();
    currentQuestions.addTo(map)
}