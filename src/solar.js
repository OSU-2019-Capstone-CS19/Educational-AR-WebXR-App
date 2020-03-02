import {Workbox} from 'workbox-window';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { render } from './render.js';

if ("serviceWorker" in navigator) {
  const wb = new Workbox('service-worker.js');
  wb.register();
}

// create a block scope for variables so all variables are visible to all functions inside
{
  let planets = [];
  let pivots = [];
  let planetTargets = [];
  let orbitLines = [];
  let continentBoxs = [];
  let sunObj, moonObj, moonPivot;
  let astronautObj, cameraPivot;
  let cameraTarget;

  let jsonObj;
  loadSolarJson();

  let renderer;
  createRenderer();

  let scene;
  createScene();

  let camera;
  let cameraControls;
  createCamera();

  let sunLight;
  createLight();

  let raycaster;
  let mouse;
  createRaycasterNMouse();

  let loader;
  createLoader();

  loadModels();

  let antarcticaBox;
  let australiaBox;
  let europeBox;
  let africaBox1;
  let africaBox2;
  let southAmericaBox1;
  let southAmericaBox2;
  let northAmericaBox1;
  let northAmericaBox2;
  let asiaBox1;
  let asiaBox2;
  createContinentBoundingBoxes();

  addClickListeners();

  // start animation loop of solar system
  render();

  /**********
  code beyond this point are function definitions
  **********/

  /**********
  Load up JSON file
  ***********
  => This file contains all relevent information concerning all the objects in the scene
  **********/
  function loadSolarJson() {
    //let jsonObj;
    let request = new XMLHttpRequest();
    request.open("GET", "./solarSystem.json", false);
    request.send(null);
    jsonObj = JSON.parse(request.responseText);
  }

  /**********
  Create Renderer
  **********/
  function createRenderer() {
    //let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
  }

  /**********
  Create Scene
  ***********
  => Create the scene
  => Create Sun object
  => Create Astronaut object
  => Create all pivots for objects in the scene
  **********/
  function createScene() {
    //let scene = new THREE.Scene();
    scene = new THREE.Scene();
    sunObj = new THREE.Object3D();
    moonObj = new THREE.Object3D();
    moonPivot = new THREE.Object3D();
    astronautObj = new THREE.Object3D();

    for (let i=0; i < jsonObj.numPlanets; i++){
      pivots[i] = new THREE.Object3D();
      pivots[i].position.set(0, 0, 0);
      scene.add(pivots[i]);
      planetTargets[i] = new THREE.Object3D();
    }
  }

  /**********
  Create Camera
  => NOTE: cameraControls will not be implemented in the AR build, instead an AR camera will be used
  => Set starting point for camera
  **********/
  function createCamera() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000000 );
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target = new THREE.Vector3( 0, 0, 0);
    cameraControls.update();

    camera.position.y = 700;
  }


  /**********
  Create Lights
  **********/
  function createLight() {
    sunLight = new THREE.PointLight( 0xfffee8, jsonObj.sun.intensity, 0, 0);
    sunLight.position.set( 0, 0, 0);
    scene.add(sunLight);
  }


  /**********
  Raycasting and Mouse
  **********/
  function createRaycasterNMouse() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
  }


  /**********
  Load Models
  => Use the GLTFLoader to load all nessisary models and set the models to appropriate objects
  **********/
  function createLoader() {
    loader = new GLTFLoader();
  }

  function loadModels() {
  //Sun
    loader.load(
      jsonObj.sun.file,
      gltf => loadSun( gltf ),
      xhr => onProgress(xhr),
      error => onError(error)
    );

  //Planets
  //NOTE: Loads planets in the wrong order
    for (let i=0; i < jsonObj.numPlanets; i++) {
      loader.load(
        jsonObj.planets[i].file,
        gltf => loadPlanet( gltf ),
        xhr => onProgress(xhr),
        error => onError(error)
      );
    }

  //Earths Moon
    loader.load(
      jsonObj.planets[2].moon.file,
      gltf => loadMoon( gltf ),
      xhr => onProgress(xhr),
      error => onError(error)
    );
  }


  /**********
  Load Model Functions
  ***********
  => These functions are called when the model is first loaded
  => Sun:
    => Set scale based on Json values
    => Set Y axis angle based on Json value
    => add to scene (Note: will be position to (0,0,0))

  => Planets:
    => Uses switch statement to determin which planet is loading in at this time (Note: planets dont load in order)
    => Set scale and position based on Json values
    => Set Y axis angle based on Json value
    => Set planets parent to proper pivot object (Pivot is already set to scene, and set to (0, 0, 0))
    => Set Y axis of the pivot to the orbit inclination value in the json
    => Create orbit rings and set Y axis of orbit ring based on the orbit inclination
    => Add to scene(Note: will be set to (0, 0, 0))

  => Moon:
    => Set moonPivot to the location of the Earth (uses the same values from the Json)
    => Set the scale and position of the moon based on json values
    => Set hierarchy as Earth > moonPivot > moonObj
    => Set Y axis of the pivot and the moon obj based on the json values

  => Note: Each Planet, Sun, and Moon begins with a scale of 1, equivalent to (1000, 1000, 1000)
  **********/

  //Load Sun Model
  function loadSun( gltf ) {
    sunObj = gltf.scene;
    //TODO: remove /10, Maybe?
    sunObj.scale.set( jsonObj.sun.radius/jsonObj.sizeScale/10,
                      jsonObj.sun.radius/jsonObj.sizeScale/10,
                      jsonObj.sun.radius/jsonObj.sizeScale/10);
    sunObj.rotateZ(jsonObj.sun.rotationAngle);
    sunObj.name = jsonObj.sun.name;
    scene.add(sunObj);
  };

  //Load Planet Models
  function loadPlanet(gltf) {
    let num;

    //Order Planets
    switch (gltf.parser.options.path){
      case "./model/planets-glb/mercury/":
        num = 0;
        break;
      case "./model/planets-glb/venus/":
        num = 1;
        break;
      case "./model/planets-glb/earth/":
        num = 2;
        break;
      case "./model/planets-glb/mars/":
        num = 3;
        break;
      case "./model/planets-glb/jupiter/":
        num = 4;
        break;
      case "./model/planets-glb/saturn/":
        num = 5;
        break;
      case "./model/planets-glb/uranus/":
        num = 6;
        break;
      case "./model/planets-glb/neptune/":
        num = 7;
        break;
      case "./model/planets-glb/pluto/":
        num = 8;
        break;
      default:
        break;
    }

    //Planet
    //Note: Scale is 1=1000 based on original model
    planets[num] = gltf.scene
    planets[num].scale.set((jsonObj.planets[num].radius/jsonObj.sizeScale),
                            (jsonObj.planets[num].radius/jsonObj.sizeScale),
                            (jsonObj.planets[num].radius/jsonObj.sizeScale));
    planets[num].position.set(pivots[num].position.x + jsonObj.planets[num].distanceFromSun/jsonObj.distanceScale,
                              pivots[num].position.y,
                              pivots[num].position.z);

    planets[num].rotateZ(jsonObj.planets[num].rotationAngle);
    planets[num].name = jsonObj.planets[num].name;

    //Planet Target
    planetTargets[num].position.set(planets[num].position.x - (jsonObj.planets[num].radius)*1500 / jsonObj.sizeScale,
                              planets[num].position.y,
                              planets[num].position.z);

    //Pivot
    pivots[num].add(planets[num]);
    pivots[num].add(planetTargets[num]);
    pivots[num].rotateZ(jsonObj.planets[num].orbitInclination);

    //Draw Orbit Lines
    let material = new THREE.LineBasicMaterial({ color:0xffffa1 });
    let orbitCircle = new THREE.CircleGeometry(jsonObj.planets[num].distanceFromSun/jsonObj.distanceScale, 100);
    orbitCircle.vertices.shift();
    orbitCircle.rotateX(Math.PI * 0.5);
    orbitCircle.rotateZ(jsonObj.planets[num].orbitInclination);

    orbitLines[num] = new THREE.LineLoop( orbitCircle, material);
    scene.add(orbitLines[num]);
  }

  //Load Moon Model

  function loadMoon(gltf) {
    moonObj = gltf.scene;

    moonPivot.position.set( jsonObj.planets[2].distanceFromSun/jsonObj.distanceScale,
                            moonPivot.position.y,
                            moonPivot.position.z);

    moonObj.scale.set(jsonObj.planets[2].moon.radius/jsonObj.sizeScale,
                      jsonObj.planets[2].moon.radius/jsonObj.sizeScale,
                      jsonObj.planets[2].moon.radius/jsonObj.sizeScale);

    moonObj.position.set( //jsonObj.planets[2].radius/jsonObj.sizeScale + jsonObj.planets[2].moon.distanceFromEarth/jsonObj.distanceScale,
                          5,
                          moonPivot.position.y,
                          moonPivot.position.z);

    moonObj.rotateZ(jsonObj.planets[2].moon.rotationAngle);
    moonObj.name = jsonObj.planets[2].moon.name;

    pivots[2].add(moonPivot);
    moonPivot.add(moonObj);

    moonPivot.rotateZ(jsonObj.planets[2].moon.orbitInclination);
  }

  //Model Load Progress
  function onProgress(xhr) {
    //console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded');
  }

  //Model Load Error
  function onError(errorMessage) {
    console.log(errorMessage);
  }


  /***********
  Planet Selection
  ***********/
  function planetSelect(planetNum) {
    let ranNum = Math.floor(Math.random() * 3);
    document.getElementById("TextBox").innerHTML = jsonObj.planets[planetNum].facts[ranNum];

    if (!jsonObj.planets[planetNum].beingViewed){
      jsonObj.sun.beingViewed = false;
      jsonObj.planets[2].moon.beingViewed = false;
      for (let i=0; i<jsonObj.numPlanets; i++){
        jsonObj.planets[i].beingViewed = false;
      }
      jsonObj.planets[planetNum].beingViewed = true;

      planetTargets[planetNum].add(camera);
      camera.position.set(0,0,0);
    }
  }

  function sunSelect() {
    let ranNum = Math.floor(Math.random() * 3);
    document.getElementById("TextBox").innerHTML = jsonObj.sun.facts[ranNum];

    if (!jsonObj.sun.beingViewed){
      jsonObj.sun.beingViewed = false;
      jsonObj.planets[2].moon.beingViewed = false;
      for (let i=0; i<jsonObj.numPlanets; i++){
        jsonObj.planets[i].beingViewed = false;
      }
      jsonObj.sun.beingViewed = true;

      sunObj.add(camera);

      //TODO: this is hard coded
      camera.position.set(0, 700, 1500);
      cameraControls.target = sunObj.position;
      cameraControls.update();

    } else {

      //Solar System View
      jsonObj.sun.beingViewed = false;
      sunObj.remove(camera);

      //TODO: this is hard coded
      camera.position.set(0, 700, 0);
      cameraControls.target = new THREE.Vector3(0,0,0);
      cameraControls.update();
    }
  }

  function moonSelect() {
    let ranNum = Math.floor(Math.random() * 3);
    document.getElementById("TextBox").innerHTML = jsonObj.planets[2].moon.facts[ranNum];

    if (!jsonObj.planets[2].moon.beingViewed){
      jsonObj.sun.beingViewed = false;
      jsonObj.planets[2].moon.beingViewed = false;
      for (let i=0; i<jsonObj.numPlanets; i++){
        jsonObj.planets[i].beingViewed = false;
      }
      jsonObj.planets[2].moon.beingViewed = true;

      moonPivot.add(camera);

      //TODO hard coded
      camera.position.set( -1, 0, 0);
    }
  }


  /*********
  Implementing bounding boxes for all the continenets
  *********/
  function createContinentBoundingBoxes() {
    antarcticaBox = new THREE.Box3();
    antarcticaBox.setFromPoints(jsonObj.continents[6].boundingBox);
    antarcticaBox.expandByPoint(jsonObj.continents[6].centerPoint);

    australiaBox = new THREE.Box3();
    australiaBox.setFromPoints(jsonObj.continents[5].boundingBox);
    //australiaBox.expandByPoint(jsonObj.continents[5].centerPoint);

    europeBox = new THREE.Box3();
    europeBox.setFromPoints(jsonObj.continents[2].boundingBox);
    //europeBox.expandByPoint(jsonObj.continents[2].centerPoint);

    africaBox1 = new THREE.Box3();
    africaBox1.setFromPoints(jsonObj.continents[3].boundingBox[0]);
    //africaBox.expandByPoint(jsonObj.continenets[3].centerPoint)

    africaBox2 = new THREE.Box3();
    africaBox2.setFromPoints(jsonObj.continents[3].boundingBox[1]);

    southAmericaBox1 = new THREE.Box3();
    southAmericaBox1.setFromPoints(jsonObj.continents[1].boundingBox[0]);

    southAmericaBox2 = new THREE.Box3();
    southAmericaBox2.setFromPoints(jsonObj.continents[1].boundingBox[1]);

    northAmericaBox1 = new THREE.Box3();
    northAmericaBox1.setFromPoints(jsonObj.continents[0].boundingBox[0]);

    northAmericaBox2 = new THREE.Box3();
    northAmericaBox2.setFromPoints(jsonObj.continents[0].boundingBox[1]);

    asiaBox1 = new THREE.Box3();
    asiaBox1.setFromPoints(jsonObj.continents[4].boundingBox[0]);

    asiaBox2 = new THREE.Box3();
    asiaBox2.setFromPoints(jsonObj.continents[4].boundingBox[1]);
  }


  //NOTE: Couldnt really find a good way to run all the javascripts together. Will look more into it later


  /**********
  Click Event Listener
  ***********
  => Use a raycaster to find intersects with mouse location
  => Check if click was on the Sun
    => Check if planet is currently being being viewed
      => No: Set all other planets.beingViewed to false and set the sun.beingViewed to true
             Set camera parent to planets pivot point so camera orbits around the sun
      => Yes: Set sun.beingViewed to false
              Return to original view of the solar system

  => Check if click was on a planet
   => Check if planet is currently being viewed
      => No: Set all other planets.beingViewed to false and this planet.beingViewed to true
             Set camera parent to planets pivot point so camera orbits around with the planet
      => Yes: Set camera parent to planet so camera orbits around the planet
  **********/
  function addClickListeners() {
    window.addEventListener('mousedown', () => {

      mouse.x = (event.clientX / window.innerWidth) *2 -1;
      mouse.y = - (event.clientY / window.innerHeight) *2 +1;

      console.log("mousedown");
      console.log(mouse);

      checkRaycasting(mouse);
    }, false);

    window.addEventListener('touchstart', () => {

      mouse.x = (event.targetTouches[0].pageX / window.innerWidth) *2 -1;
      mouse.y = - (event.targetTouches[0].pageY / window.innerHeight) *2 +1;

      console.log("touchstart");
      console.log(mouse);

      checkRaycasting(mouse);
    }, false);
  }


  function checkRaycasting(mouse) {

      console.log("raycasting");

      raycaster.setFromCamera( mouse, camera );
  	  let intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {

        if(intersects[0].object.parent.name) {
          switch(intersects[0].object.parent.name)  {

            case "Sun":
              sunSelect();
              break;

            case "Mercury":
              planetSelect(0);
              break;

            case "Venus":
              planetSelect(1);
              break;

            case "Earth":
              planetSelect(2);

              if (jsonObj.planets[2].beingViewed) {
                let point = planets[2].worldToLocal(intersects[0].point);

                if (antarcticaBox.containsPoint(point)){
                  console.log("Antarctica");
                } else if (australiaBox.containsPoint(point)){
                  console.log("Australia");
                } else if (europeBox.containsPoint(point)){
                  console.log("Europe");
                } else if (africaBox1.containsPoint(point)){
                  console.log("Africa");
                } else if (africaBox2.containsPoint(point)){
                  console.log("Africa");
                } else if (southAmericaBox1.containsPoint(point)){
                  console.log("South America");
                } else if (southAmericaBox2.containsPoint(point)){
                  console.log("South America");
                } else if (northAmericaBox1.containsPoint(point)){
                  console.log("North America");
                } else if (northAmericaBox2.containsPoint(point)){
                  console.log("North America");
                } else if (asiaBox1.containsPoint(point)){
                  console.log("Asia");
                } else if (asiaBox2.containsPoint(point)){
                  console.log("Asia");
                } else {
                  console.log("False");
                }
              }
              break;

            case "Moon":
              moonSelect();
              break;

            case "Mars":
              planetSelect(3);
              break;

            case "Jupiter":
              planetSelect(4);
              break;

            case "Saturn":
              planetSelect(5);
              break;

            case "Uranus":
              planetSelect(6);
              break;

            case "Neptune":
              planetSelect(7);
              break;

            case "Pluto":
              planetSelect(8);
              break;

            default:
              break;
          }
        }
     }
  }

  /***************************
  MenuEventHandler ***DEPRECATED***
  ***************************/

  // document.getElementById("testButton").addEventListener("click", function(){
  //   document.getElementById("mySidenav").style.width = "250px";
  // });
  //
  // document.getElementById("closeNav").addEventListener("click", function(){
  //   document.getElementById("mySidenav").style.width = "0";
  // });
  //
  // document.getElementById("openPlanetsNav").addEventListener("click", function(){
  //   document.getElementById("planetsNav").style.width = "250px";
  // });
  //
  // document.getElementById("closePlanetsNav").addEventListener("click", function(){
  //   document.getElementById("planetsNav").style.width = "0px";
  // });
  //
  // document.getElementById("showSun").addEventListener("click", function(){
  //   sunSelect();
  // });
  //
  // document.getElementById("showMoon").addEventListener("click", function(){
  //   moonSelect();
  // });
  //
  // document.getElementById("showMercury").addEventListener("click", function(){
  //   planetSelect(0);
  // });
  //
  // document.getElementById("showVenus").addEventListener("click", function(){
  //   planetSelect(1);
  // });
  //
  // document.getElementById("showEarth").addEventListener("click", function(){
  //   planetSelect(2);
  // });
  //
  // document.getElementById("showMars").addEventListener("click", function(){
  //   planetSelect(3);
  // });
  //
  // document.getElementById("showJupiter").addEventListener("click", function(){
  //   planetSelect(4);
  // });
  //
  // document.getElementById("showSaturn").addEventListener("click", function(){
  //   planetSelect(5);
  // });
  //
  // document.getElementById("showUranus").addEventListener("click", function(){
  //   planetSelect(6);
  // });
  //
  // document.getElementById("showNeptune").addEventListener("click", function(){
  //   planetSelect(7);
  // });
  //
  // document.getElementById("showPluto").addEventListener("click", function(){
  //   planetSelect(8);
  // });
  //
  // document.getElementById("toggleAstronaut").addEventListener("click", function(){
  //   jsonObj.astronaut.visible=!(jsonObj.astronaut.visible);
  //   console.log("astronaut.visible = ", jsonObj.astronaut.visible);
  // });

  // document.getElementById("toggleTrace").addEventListener("click", function(){
  //   //jsonObj.showPlanetLines=!(jsonObj.showPlanetLines);
  //   //console.log("showPlanetLines = ", jsonObj.showPlanetLines);
  //   if(jsonObj.showPlanetLines){
  //     jsonObj.showPlanetLines = false;
  //     for (let i=0; i<jsonObj.numPlanets; i++){
  //       scene.remove(orbitLines[i]);
  //     }
  //   }
  //   else if(!jsonObj.showPlanetLines){
  //     jsonObj.showPlanetLines = true;
  //     for (let i=0;i<jsonObj.numPlanets; i++){
  //       scene.add(orbitLines[i]);
  //     }
  //   }
  // });

  // Start of Range slider collapsible content
  // let coll = document.getElementsByClassName("collapsible");
  // let i;
  //
  // for (i = 0; i < coll.length; i++) {
  //   coll[i].addEventListener("click", function() {
  //     this.classList.toggle("active");
  //     let content = this.nextElementSibling;
  //     if (content.style.display === "block") {
  //       content.style.display = "none";
  //     } else {
  //       content.style.display = "block";
  //     }
  //   });
  // }

  ////----- Here's range slider stuff

  // let sunSlider = document.getElementById("sunRange");
  // let output = document.getElementById("sunVal");
  // sunSlider.value = jsonObj.sun.intensity;
  // output.innerHTML = sunSlider.value;
  //
  // sunSlider.oninput = function() {
  //   output.innerHTML = this.value;
  //   jsonObj.sun.intensity=this.value;
  // }
  //
  // let speedSlider = document.getElementById("speedRange");
  // let speedOutput = document.getElementById("speedVal");
  // speedSlider.value = jsonObj.orbitScale;
  // speedOutput.innerHTML = speedSlider.value;
  //
  // speedSlider.oninput = function() {
  //   speedOutput.innerHTML = this.value;
  //   jsonObj.orbitScale = this.value;
  //   jsonObj.rotationScale = this.value;
  //
  // }
  // ***CODE ABOVE IS DEPRECATED***

  /**********
  Render/Animate Function
  ***********
  => Check if sunObj exists
    => Yes: Rotate the sunObj about its Y axis

  => Check if planets exists
    => Yes: Rotate the planets based on their Y axis

  => Check if planets pivots exists
    => Yes: Rotate each pivot about its Y axis, resulting in an orbit around the sun

  => Check if moonObj exists
    => Yes: Rotate the moonObj about its Y axis

  => Check if moonPivot exists
    => Yes: Rotate the moonPivot about its Y axis, resulting in an orbit around the earth

  => Check if any planet is currently being viewed
    => Yes: Update cameraControls.Target to the planet
    => NOTE: This will not be in the AR version of the application

  => Update camera controls
  => Call render
  **********/
  function render() {
    requestAnimationFrame( render );

    sunLight.intensity = jsonObj.sun.intensity;

    //Sun Rotation
    if (sunObj){
      sunObj.rotateY(jsonObj.sun.rotation / jsonObj.rotationScale);
    }

    //Planet Rotation (rad/day)
    for (let i=0; i<jsonObj.numPlanets; i++){
      if (planets[i]){
          planets[i].rotateY(jsonObj.planets[i].rotation / jsonObj.rotationScale);
      }
    }

    // //Planet Orbit (rad/day)
    for (let i=0; i<jsonObj.numPlanets; i++){ //will use jsonObj.numElements
      if (pivots[i]){
        pivots[i].rotateY(jsonObj.planets[i].orbit / jsonObj.orbitScale);
      }
    }

    //Moon Rotation (rad/day)
    if (moonObj){
      moonObj.rotateY(jsonObj.planets[2].moon.rotation / jsonObj.rotationScale);
    }

    //Moon Orbit (rad/day)
    if (moonPivot){
      moonPivot.rotateY(jsonObj.planets[2].moon.orbit / jsonObj.orbitScale);
    }

    //Camera rotation if viewing planet
    //NOTE: this will not be present in the AR build
    for (let i=0; i<jsonObj.numPlanets; i++){
      if (jsonObj.planets[i].beingViewed){
        cameraControls.target = new THREE.Vector3().setFromMatrixPosition(planets[i].matrixWorld);

      } else if (jsonObj.planets[2].moon.beingViewed){
        cameraTarget = new THREE.Vector3().setFromMatrixPosition(moonObj.matrixWorld);
        cameraControls.target = cameraTarget;
      }
    }

    cameraControls.update();

    renderer.render( scene, camera );
  }
}
//render();
//main();
