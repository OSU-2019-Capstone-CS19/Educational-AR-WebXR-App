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

/*document.getElementById("intensitySlider").addEventListener("click", function(){
  jsonObj.sun.intensity=jsonObj.sun.intensity+1.0;
  console.log("sun intensity = ", jsonObj.sun.intensity);
});*/

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
