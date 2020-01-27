

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

function showMoon(){
  for (var i=0; i<jsonObj.numPlanets; i++){
    jsonObj.planets[i].beingViewed = "false";
  }
  jsonObj.sun.beingViewed = "false";
  jsonObj.planets[2].moon.beingViewed = "true";

  moonPivot.add(camera);
  camera.position.set(10,0,0);

}

function showSun(){
  for (var i=0; i<jsonObj.numPlanets; i++){
    jsonObj.planets[i].beingViewed = "false";
  }
  jsonObj.sun.beingViewed = "true";

  sunObj.add(camera);

  camera.position.set(0,700, 1500);
  cameraControls.target = sunObj.position;
  cameraControls.update();

  
}

document.getElementById("intensitySlider").addEventListener("click", function(){
  jsonObj.sun.intensity=jsonObj.sun.intensity+1.0;
  console.log("sun intensity = ", jsonObj.sun.intensity);
});

document.getElementById("toggleAstronaut").addEventListener("click", function(){
  jsonObj.astronaut.visible=!(jsonObj.astronaut.visible);
  console.log("astronaut.visible = ", jsonObj.astronaut.visible);
});

document.getElementById("toggleTrace").addEventListener("click", function(){
  //jsonObj.showPlanetLines=!(jsonObj.showPlanetLines);
  //console.log("showPlanetLines = ", jsonObj.showPlanetLines);
  if(jsonObj.showPlanetLines =="true"){
    jsonObj.showPlanetLines = "false";
    for (var i=0; i<jsonObj.numPlanets; i++){
      scene.remove(orbitLines[i]);
    }
  }
  else if(jsonObj.showPlanetLines=="false"){
    jsonObj.showPlanetLines ="true";
    for (var i=0;i<jsonObj.numPlanets; i++){
      scene.add(orbitLines[i]);
    }
  }
  
});



/*document.getElementById("showEarth").addEventListener("click", function(){
  for (var i=0; i<jsonObj.numPlanets; i++){
    jsonObj.planets[i].beingViewed = "false";
  }
  jsonObj.sun.beingViewed = "false";
  jsonObj.planets[2].beingViewed = "true";

  pivots[2].add(camera);
  camera.position.set( (jsonObj.planets[2].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[2].radius/jsonObj.sizeScale, 0);

});*/

