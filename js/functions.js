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

function polygonToMarker(center, coordinates, bearing, scale ){
    distances = []
    bearings = []
    centroid = turf.center(turf.polygon([coordinates]))
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