//Test Button


document.getElementById("testButton").addEventListener("click", function(){
    /*for (var i=0; i<jsonObj.numPlanets; i++){
      jsonObj.planets[i].beingViewed = "false";
    }
    jsonObj.sun.beingViewed = "false";
    jsonObj.planets[2].beingViewed = "true";

    pivots[2].add(camera);
    camera.position.set( (jsonObj.planets[2].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[2].radius/jsonObj.sizeScale, 0);
    */

});

function openNav(){
  document.getElementById("mySidenav").style.width = "250px";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function openPlanetsNav(){
  document.getElementById("planetsNav").style.width = "250px";
}

function closePlanetsNav(){
  document.getElementById("planetsNav").style.width = "0px";
}

function showPlanet(chosen){
  for (var i=0; i<jsonObj.numPlanets; i++){
    jsonObj.planets[i].beingViewed = "false";
  }
  jsonObj.sun.beingViewed = "false";
  jsonObj.planets[chosen].beingViewed = "true";

  pivots[chosen].add(camera);
  camera.position.set( (jsonObj.planets[chosen].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[chosen].radius/jsonObj.sizeScale, 0);
}


/*document.getElementById("showEarth").addEventListener("click", function(){
  for (var i=0; i<jsonObj.numPlanets; i++){
    jsonObj.planets[i].beingViewed = "false";
  }
  jsonObj.sun.beingViewed = "false";
  jsonObj.planets[2].beingViewed = "true";

  pivots[2].add(camera);
  camera.position.set( (jsonObj.planets[2].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[2].radius/jsonObj.sizeScale, 0);

});*/

