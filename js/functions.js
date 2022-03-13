let features = [];
let userPoints = 0;
let currentPolygonLayer = L.geoJson({
    "type": "FeatureCollection",
    "features": []
  })

function getUpdatedLeaderboard(){
    let playersList = [
        {name:"player1",score:57},
        {name:"player12",score:59},
        {name:"player20",score:5},
        {name:"player29",score:62},
        {name:"player9",score:12},
        {name:"player90",score:1},
        {name:"player930",score:10},
        {name:"player93",score:18},
        {name:"player58",score:58},
        {name:"player52",score:4},
        {name:"player69",score:5}
        ]
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
    return ids;
    
}
function getNewRandoms(){
    if(map.hasLayer(currentPolygonLayer)){
        map.removeLayer(currentPolygonLayer)
    }
    if(currentQuestions._map){
        map.removeControl(currentQuestions)
    }
    if(whatnow._map){
        map.removeControl(whatnow)
    }
    polygon = selectRandomPolygon(features);
    questionOptions = selectQuestionOptions(features,polygon);
    center = selectRandomLocation(features);
    newPolygon = polygonToMarker(center.geometry.coordinates, polygon);
    newBounds = turf.bboxPolygon(turf.bbox(newPolygon))
    newLBounds = L.geoJson(newBounds).getBounds()
    currentPolygonLayer = L.geoJson(newPolygon,{color: 'red'})
    currentPolygonLayer.addTo(map);
    map.fitBounds(newLBounds);
    currentQuestions = L.control.question({ids:questionOptions})
    currentQuestions.addTo(map)
}

function getAnswer(e){
    if(e.target.id == polygon.properties.SEMEL_YISH){
        userPoints += 1
    }
    if(currentQuestions._map){
        map.removeControl(currentQuestions)
    }
    if(whatnow._map){
        map.removeControl(whatnow)
    }
    whatnow = L.control.continue({score:userPoints});
    whatnow.addTo(map);
}

async function onMapLoad(){
    const response = await fetch('set20k.fgb')
    for await (const f of flatgeobuf.deserialize(response.body)){
        feature = f;
        features.push(feature)
    }   
    polygon = selectRandomPolygon(features);
    questionOptions = selectQuestionOptions(features,polygon);
    center = selectRandomLocation(features);
    newPolygon = polygonToMarker(center.geometry.coordinates, polygon);
    newBounds = turf.bboxPolygon(turf.bbox(newPolygon))
    newLBounds = L.geoJson(newBounds).getBounds()
    currentPolygonLayer = L.geoJson(newPolygon,{color: 'red'})
    currentPolygonLayer.addTo(map);
    map.fitBounds(newLBounds);
    currentQuestions = L.control.question({ids:questionOptions})
    whatnow = L.control.continue();
    currentQuestions.addTo(map)
}