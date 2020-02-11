
//This would reside in the main.js
//import { setUpEventHandlers } from './init.js';
//setUpEventHandlers(jsonObj);

//NOTE would need to import THREE to use those properties

//This.js
/*
function setUpEventHandlers(jsonObj){
  document.getElementById("testButton").addEventListener("click", function(){
    document.getElementById("mySidenav").style.width = "250px";
  });

  document.getElementById("closeNav").addEventListener("click", function(){
    document.getElementById("mySidenav").style.width = "0";
  });

  document.getElementById("openPlanetsNav").addEventListener("click", function(){
    document.getElementById("planetsNav").style.width = "250px";
  });

  document.getElementById("closePlanetsNav").addEventListener("click", function(){
    document.getElementById("planetsNav").style.width = "0px";
  });

  document.getElementById("showSun").addEventListener("click", function(){
    sunSelect();
  });

  document.getElementById("showMoon").addEventListener("click", function(){
    moonSelect();
  });

  document.getElementById("showMercury").addEventListener("click", function(){
    planetSelect(0);
  });

  document.getElementById("showVenus").addEventListener("click", function(){
    planetSelect(1);
  });

  document.getElementById("showEarth").addEventListener("click", function(){
    planetSelect(2);
  });

  document.getElementById("showMars").addEventListener("click", function(){
    planetSelect(3);
  });

  document.getElementById("showJupiter").addEventListener("click", function(){
    planetSelect(4);
  });

  document.getElementById("showSaturn").addEventListener("click", function(){
    planetSelect(5);
  });

  document.getElementById("showUranus").addEventListener("click", function(){
    planetSelect(6);
  });

  document.getElementById("showNeptune").addEventListener("click", function(){
    planetSelect(7);
  });

  document.getElementById("showPluto").addEventListener("click", function(){
    planetSelect(8);
  });

  document.getElementById("toggleAstronaut").addEventListener("click", function(){
    jsonObj.astronaut.visible=!(jsonObj.astronaut.visible);
    console.log("astronaut.visible = ", jsonObj.astronaut.visible);
  });

  document.getElementById("toggleTrace").addEventListener("click", function(){
    //jsonObj.showPlanetLines=!(jsonObj.showPlanetLines);
    //console.log("showPlanetLines = ", jsonObj.showPlanetLines);
    if(jsonObj.showPlanetLines){
      jsonObj.showPlanetLines = false;
      for (var i=0; i<jsonObj.numPlanets; i++){
        scene.remove(orbitLines[i]);
      }
    }
    else if(!jsonObj.showPlanetLines){
      jsonObj.showPlanetLines = true;
      for (var i=0;i<jsonObj.numPlanets; i++){
        scene.add(orbitLines[i]);
      }
    }
  });

  // Start of Range slider collapsible content
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }

  ////----- Here's range slider stuff

  var sunSlider = document.getElementById("sunRange");
  var output = document.getElementById("sunVal");
  sunSlider.value = jsonObj.sun.intensity;
  output.innerHTML = sunSlider.value;

  sunSlider.oninput = function() {
    output.innerHTML = this.value;
    jsonObj.sun.intensity=this.value;
  }

  var speedSlider = document.getElementById("speedRange");
  var speedOutput = document.getElementById("speedVal");
  speedSlider.value = jsonObj.orbitScale;
  speedOutput.innerHTML = speedSlider.value;

  speedSlider.oninput = function() {
    speedOutput.innerHTML = this.value;
    jsonObj.orbitScale = this.value;
    jsonObj.rotationScale = this.value;

  }
}
*/
