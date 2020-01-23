//Test Button
document.getElementById("testButton").addEventListener("click", function(){
    for (var i=0; i<jsonObj.numPlanets; i++){
      jsonObj.planets[i].beingViewed = "false";
    }
    jsonObj.sun.beingViewed = "false";
    jsonObj.planets[2].beingViewed = "true";

    pivots[2].add(camera);
    camera.position.set( (jsonObj.planets[2].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[2].radius/jsonObj.sizeScale, 0);



});
