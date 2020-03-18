import {Workbox} from 'workbox-window';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//Service Worker
if ("serviceWorker" in navigator) {
  const wb = new Workbox('service-worker.js');
  wb.register();
}

//variables
let originPoint;
let originMatrix;
let planets = [];
let pivots = [];
let orbitLines = [];
let uiOptions = [];
let planetOptions = [];
let sunObj, sunPivot, moonObj, moonPivot;

let xrButton = document.getElementById('xr-button');
let xrSession = null;
let xrRefSpace = null;
let showSolarSystem = false;
let arActivated = false;
let reticle;
let gl = null;
let planetOptionsVisible = false;
let uiOptionsVisible = false;


/**********
JSON file
***********
=> This file contains all relevent information concerning all the objects in the scene
**********/
let jsonObj;
let request = new XMLHttpRequest();

request.open("GET", "./solarSystem.json", false);
request.send(null);
jsonObj = JSON.parse(request.responseText);


/**********
Renderer
**********/
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


/**********
Scene
**********/
let scene = new THREE.Scene();
scene.background = null;

sunObj = new THREE.Object3D();
sunPivot = new THREE.Object3D();
moonObj = new THREE.Object3D();
moonPivot = new THREE.Object3D();


/**********
Camera
**********/
let camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.001, 10000000);
camera.matrixAutoUpdate = false;
scene.add(camera);

//Test
//let boxGeometry = new THREE.BoxGeometry( 0.05, 0.05, 0.05 );
/*
let drawerGeometry = new THREE.PlaneGeometry( .05,.05,.05 );
let drawerTexture = new THREE.ImageUtils.loadTexture('./model/UI-textures/drawer-icon.png');
let boxmaterial = new THREE.MeshBasicMaterial(  {map: drawerTexture} );     //UI box 
let cameraPoint = new THREE.Mesh( drawerGeometry, boxmaterial );
camera.add( cameraPoint );
cameraPoint.position.z -= 0.5;
cameraPoint.position.x += 0.13;
cameraPoint.position.y +=.25;*/


/**********
Lights
**********/
let sunLight = new THREE.PointLight( 0xfffee8, 1, 0, 0); //TODO: use jsonObj.sun.intensity?
sunLight.position.set( 0, 0, 0);
sunLight.visible = false;

let cameraLight = new THREE.PointLight( 0xfffee8, 2, 0, 0);
cameraLight.visible = true;
camera.add(cameraLight);

/**********
INIT
**********/
function init() {

  if (navigator.xr) {

    checkSupportedState();
    loadModels();
    loadUI();

    originPoint = new THREE.Object3D();
    originPoint.name = "origin";

  } else {
    alert("AR no go");
  }
}

function loadUI(){
  console.log("ui_size = ", jsonObj.ui_size);
  for (let i=0; i< jsonObj.ui_size ; i++){
    let uiGeometry = new THREE.PlaneGeometry( .05,.05,.05 );
    var uiTexture = new THREE.TextureLoader().load( jsonObj.ui[i].texture );
    //let uiTexture = new THREE.ImageUtils.loadTexture(jsonObj.ui[i].texture);
    let uiMaterial = new THREE.MeshBasicMaterial( {map: uiTexture} );     //UI box 
    uiOptions[i] = new THREE.Mesh( uiGeometry, uiMaterial );
    uiOptions[i].name = jsonObj.ui[i].name;
    if (i == 0){
      uiOptions[i].position.x = jsonObj.ui[i].position.x;
    } else if (i==2){
      uiOptions[i].position.x = jsonObj.ui[i].position.x;
    } else {
      uiOptions[i].position.x = 1.0;
    }
    uiOptions[i].position.y += jsonObj.ui[i].position.y;
    uiOptions[i].position.z -= jsonObj.ui[i].position.z;
    camera.add(uiOptions[i]);
  }

  
  for(let i=0; i< jsonObj.ui[3].size ; i++){
    let uiGeometry = new THREE.PlaneGeometry( .07,.05,.05 );
    let uiTexture = new THREE.ImageUtils.loadTexture(jsonObj.ui[3].options[i].texture);
    let uiMaterial = new THREE.MeshBasicMaterial(  {map: uiTexture} ); 
    planetOptions[i]= new THREE.Mesh(uiGeometry, uiMaterial);
    planetOptions[i].name = jsonObj.ui[3].options[i].name;
    planetOptions[i].position.x = 1.0;
    planetOptions[i].position.y += jsonObj.ui[3].options[i].position.y;
    planetOptions[i].position.z -= jsonObj.ui[3].options[i].position.z;
    camera.add(planetOptions[i]);
  }
}

/**********
Load Models
**********/
function loadModels() {

  let loader = new GLTFLoader();

  //Sun
  loader.load(
    jsonObj.sun.file,
    gltf => loadSun( gltf ),
    xhr => onProgress(xhr),
    error => onError(error)
  );

  //Planets
  //NOTE: Loads planets in the wrong order
  for (let i=0; i < jsonObj.numPlanets; i++){
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
***********/

//Load Sun Model
function loadSun(gltf) {
  sunObj = gltf.scene;

  //SunObj is scalled a 10th more due to its size

  sunObj.scale.set( jsonObj.sun.radius/jsonObj.sizeScale/10,
                    jsonObj.sun.radius/jsonObj.sizeScale/10,
                    jsonObj.sun.radius/jsonObj.sizeScale/10);
  sunObj.rotateZ(jsonObj.sun.rotationAngle);
  sunObj.name = jsonObj.sun.name;
  sunObj.add(sunLight);
  scene.add(sunPivot);
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

  //Add pivot to center
  pivots[num] = new THREE.Object3D();
  pivots[num].name = "pivotPoint";
  originPoint.add(pivots[num]);

  //Add Planet based on Json
  planets[num] = gltf.scene
  planets[num].scale.set((jsonObj.planets[num].radius/jsonObj.sizeScale),
                          (jsonObj.planets[num].radius/jsonObj.sizeScale),
                          (jsonObj.planets[num].radius/jsonObj.sizeScale));
  planets[num].position.set(pivots[num].position.x + jsonObj.planets[num].distanceFromSun/jsonObj.distanceScale,
                            pivots[num].position.y,
                            pivots[num].position.z);

  planets[num].rotateZ(jsonObj.planets[num].rotationAngle);
  planets[num].name = jsonObj.planets[num].name;

  //Add planet to pivot
  pivots[num].add(planets[num]);
  pivots[num].rotateZ(jsonObj.planets[num].orbitInclination);

  //Draw orbit lines based on planet
  let orbitMaterial = new THREE.LineBasicMaterial({ color:0xffffa1 });
  let orbitCircle = new THREE.CircleGeometry(jsonObj.planets[num].distanceFromSun/jsonObj.distanceScale, 100);
  orbitCircle.vertices.shift();
  orbitCircle.rotateX(Math.PI * 0.5);
  orbitCircle.rotateZ(jsonObj.planets[num].orbitInclination);

  orbitLines[num] = new THREE.LineLoop( orbitCircle, orbitMaterial);
  orbitLines[num].name = "oribitLine";
  originPoint.add(orbitLines[num]);

  //Add Moon
  //Note: Currently only for earth but could be altered to incoperate moons for any planet in the solar system
  if (jsonObj.planets[num].moon){

    pivots[num].add(moonPivot);
    moonPivot.add(moonObj);
    moonPivot.position.copy(planets[num].position);

    moonObj.scale.set(jsonObj.planets[2].moon.radius/jsonObj.sizeScale,
                      jsonObj.planets[2].moon.radius/jsonObj.sizeScale,
                      jsonObj.planets[2].moon.radius/jsonObj.sizeScale);

    //Get the size of the planet to determin radius
    let planetBox = new THREE.Box3().setFromObject( planets[num] );

    moonObj.position.x = planetBox.getSize().x/2 + jsonObj.planets[2].moon.distanceFromEarth/jsonObj.distanceScale;

    moonObj.rotateZ(jsonObj.planets[2].moon.rotationAngle);
    moonObj.name = jsonObj.planets[2].moon.name;
    moonPivot.rotateZ(jsonObj.planets[2].moon.orbitInclination);
  }
};

//Load Moon Model
function loadMoon(gltf) {
  moonObj = gltf.scene;
};

function onProgress(xhr) {
  // console.log((xhr.loaded / xhr.total *100) + '% loaded');
}

function onError(error) {
  console.log(error);
}


/*********
Check AR Support
*********/
function checkSupportedState() {
  navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
    let statusBox = document.getElementById('statusbox');
    if (supported) {

      xrButton.addEventListener('click', toggleAR);

    } else {
      statusBox.innerHTML = 'Houston we have a problem, your device is not compatible';
      xrButton.style.backgroundColor = '#cc0000';
      xrButton.innerHTML = 'Error';
    }
  });
}

//NOTE: This function can be removed if we want to (AR activated could be a json componet)
async function toggleAR(){
  if (arActivated){
    console.log("AR is already activated");
    return;
  }
  return activateAR();
}


/**********
XR Session
**********/
async function activateAR(){
  try{
    xrSession = await navigator.xr.requestSession('immersive-ar');
    xrRefSpace = await xrSession.requestReferenceSpace('local');

    xrSession.addEventListener('select', touchSelectEvent);

    let gl = renderer.getContext();
    await gl.makeXRCompatible();
    let layer = new XRWebGLLayer(xrSession, gl);
    xrSession.updateRenderState({ baseLayer: layer });

    xrSession.addEventListener('end', onSessionEnd);

    let transientInputHitTestSource = null;
    let hitTestOptionsInit = {
      profile: 'generic-touchscreen',
      offsetRay: new XRRay()
    };

    xrSession.requestHitTestSourceForTransientInput(hitTestOptionsInit).then((hitTestSource) => {
      transientInputHitTestSource = hitTestSource;
      transientInputHitTestSource.context = {options : hitTestOptionsInit };
    });

    xrSession.requestAnimationFrame(renderXR);
    arActivated = true;

  } catch (error){
    console.log("Catch: "+ error);
  }
}


/*********
Session End
*********/
function onSessionEnd(){
  console.log("SESSION ENDED");
  arActivated = false;
  xrSession = null;
}


/*********
Render XR
*********/
function renderXR(timestamp, xrFrame){

  if (!xrFrame || !xrSession || !arActivated){
    return;
  }

  let pose = xrFrame.getViewerPose(xrRefSpace);
  if (!pose){
    xrSession.requestAnimationFrame(renderXR);
    return;
  }

  if (!showSolarSystem){

    createReticle();

    const x=0;
    const y=0;
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x, y }, camera);

    let rayOrigin = raycaster.ray.origin;
    let rayDirection = raycaster.ray.direction;
    let ray = new XRRay({x : rayOrigin.x, y : rayOrigin.y, z : rayOrigin.z},
      {x : rayDirection.x, y : rayDirection.y, z : rayDirection.z});

    xrSession.requestHitTest(ray, xrRefSpace).then((results) => {
      if (results.length) {
        console.log("raycast good");
        let hitResult = results[0];
        reticle.visible = true;
        originPoint.visible = false;
        let hitMatrix = new THREE.Matrix4();
        hitMatrix.fromArray(hitResult.hitMatrix);
        reticle.position.setFromMatrixPosition(hitMatrix);

      } else {
        console.log("Keep looking");
        reticle.visible = false;
      }
    });

  } else {
    if (reticle){
      reticle.visible = false;
      originPoint.visible = true;
    }

    animateScene();
  }

  let xrLayer = xrSession.renderState.baseLayer;
  renderer.setFramebuffer(xrLayer.framebuffer);

  for (let xrView of pose.views){
    let viewport = xrLayer.getViewport(xrView);
    renderView(xrView, viewport);
  }

  xrSession.requestAnimationFrame(renderXR);
}


/*********
Animate 3D scene
*********/
function animateScene(){

  //Sun Rotation
  if (sunObj && jsonObj.sun.moveRotate){
    sunObj.rotateY(jsonObj.sun.rotation / jsonObj.rotationScale);
  }

  //Planet Rotation (rad/day)
  for (let i=0; i<jsonObj.numPlanets; i++){
    if (planets[i] && jsonObj.planets[i].moveRotate){
      planets[i].rotateY(jsonObj.planets[i].rotation / jsonObj.rotationScale);
    }
  }

  //Planet Orbit (rad/day)
  for (let i=0; i<jsonObj.numPlanets; i++){
    if (pivots[i] && jsonObj.planets[i].moveOrbit){
      pivots[i].rotateY(jsonObj.planets[i].orbit / jsonObj.orbitScale);
    }

    if (jsonObj.planets[i].beingViewed && sunLight.visible){
      sunPivot.rotateY(jsonObj.planets[i].orbit / jsonObj.orbitScale);
    }
  }

  //Moon Rotation (rad/day)
  if (moonObj && jsonObj.planets[2].moon.moveRotate){
    moonObj.rotateY(jsonObj.planets[2].moon.rotation / jsonObj.rotationScale);
  }

  //Moon Orbit (rad/day)
  if (moonPivot && jsonObj.planets[2].moon.moveOrbit){
    moonPivot.rotateY(jsonObj.planets[2].moon.orbit / jsonObj.orbitScale);
  }
}


function renderView(xrView, viewport){
  renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
  const viewMatrix = xrView.transform.inverse.matrix;

  //camera
  camera.projectionMatrix.fromArray(xrView.projectionMatrix);
  camera.matrix.fromArray(viewMatrix).getInverse(camera.matrix);
  camera.updateMatrixWorld(true);

  renderer.render(scene, camera)
}


/**********
Event Handler
**********/
function touchSelectEvent() {
  if (showSolarSystem){

    let inputPose = event.frame.getPose(event.inputSource.targetRaySpace, xrRefSpace);
    if (inputPose) {

      let targetRay = new XRRay(inputPose.transform);
      let rayOrigin = new THREE.Vector3(targetRay.origin.x, targetRay.origin.y, targetRay.origin.z);
      let rayDirection = new THREE.Vector3(targetRay.direction.x, targetRay.direction.y, targetRay.direction.z);

      let sceneRaycaster = new THREE.Raycaster();
      sceneRaycaster.set(rayOrigin, rayDirection);

      let sceneIntersectsArray = [sunObj, moonObj, planets[0], planets[1], planets[2], planets[3], planets[4], planets[5], planets[6], planets[7], planets[8]];

      //TODO add 3D menu objs here
      let menuIntersectsArray = [uiOptions[0], uiOptions[1], uiOptions[2], uiOptions[3], planetOptions[0], planetOptions[1], planetOptions[2], planetOptions[3], planetOptions[4], planetOptions[5], planetOptions[6], planetOptions[7], planetOptions[8], planetOptions[9], planetOptions[10]];

      let intersects = sceneRaycaster.intersectObjects(menuIntersectsArray, true);

      if (intersects.length > 0){
        menuEvent(intersects);

      } else {
        let intersects = sceneRaycaster.intersectObjects(sceneIntersectsArray, true);
        if (intersects.length > 0){
          sceneEvent(intersects);
        }
      }
    }

  } else {
    if (reticle.visible){
      showSolarSystem = true;

      originMatrix = sunObj.matrixWorld;
      sunObj.position.y = 0;
      sunObj.children[0].material.opacity = 1;
      originPoint.add(sunObj);

      scene.add(originPoint);
      originPoint.position.setFromMatrixPosition(originMatrix);
    } else {
       console.log("cant place yet");
    }
  }
}

function sceneEvent(intersects){
  if (intersects[0].object.parent.name){
    switch(intersects[0].object.parent.name){

      case "Sun":
        console.log("sun");
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

        if (jsonObj.planets[2].beingViewed){
          let point = planets[2].worldToLocal(intersects[0].point);
          checkEarthBoundingBoxs(point);
        }
        break;

      // case "Moon":
      //   moonSelect();
      //   break;

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

function toggleUIOptionsVisibility(){
  uiOptionsVisible = !uiOptionsVisible;

  
  for(let i=1; i<jsonObj.ui_size; i++){
    if(uiOptionsVisible){
      uiOptions[i].position.x = jsonObj.ui[i].position.x;
    } else {
      if (i!=2)
      uiOptions[i].position.x = 1.0;
    }
    
  }
    
}

function toggleUIOptionsVisibilityOff(){
  
  uiOptionsVisible = false;
  for(let i=1; i<jsonObj.ui_size; i++){
    uiOptions[i].position.x = 1.0;
    
  }      
}

function togglePlanetsOptionsVisibility(){
  planetOptionsVisible = !planetOptionsVisible;

  
  for(let i=0; i<jsonObj.ui[3].size; i++){
    if(planetOptionsVisible){
      planetOptions[i].position.x = 0.05;
    } else {
      planetOptions[i].position.x = 1.0;
    }
    
  }
    
}

function togglePlanetsOptionsVisibilityOff(){
  planetOptionsVisible = false;  
  console.log("toggle off planets options");
  for(let i=0; i<jsonObj.ui[3].size; i++){
    
    planetOptions[i].position.x = 1.0;
  }
    
}

function menuEvent(intersects){
  console.log(intersects);
  if (intersects[0].object.name){
    switch(intersects[0].object.name){
      case "Drawer":
        console.log("Drawer button touched!!!!");
        toggleUIOptionsVisibility();
        break;
      case "Lines":
        toggleOrbitLines();
        toggleUIOptionsVisibility();
        togglePlanetsOptionsVisibilityOff();
        break;
      case "Planets":
        togglePlanetsOptionsVisibility();
        break;  
      case "Sun":
        console.log("sun");
        togglePlanetsOptionsVisibilityOff();
        
        sunSelect();

        break;
      case "Mercury":
        console.log("mercury");
        togglePlanetsOptionsVisibilityOff();
        
        planetSelect(0);
        break;

      case "Venus":
        console.log("venus");
        togglePlanetsOptionsVisibilityOff();
        
        planetSelect(1);
        break;

      case "Earth":
        console.log("earth");
        togglePlanetsOptionsVisibilityOff();
        
        planetSelect(2);

        if (jsonObj.planets[2].beingViewed){
          let point = planets[2].worldToLocal(intersects[0].point);
          
          checkEarthBoundingBoxs(point);
        }
        break;

      // case "Moon":
      //   moonSelect();
      //   break;

      case "Mars":
        console.log("mars");
        togglePlanetsOptionsVisibilityOff();
        
        planetSelect(3);
        break;

      case "Jupiter":
        console.log("jupiter");
        togglePlanetsOptionsVisibilityOff();
        
        planetSelect(4);
        break;

      case "Saturn":
        console.log("saturn");
        togglePlanetsOptionsVisibilityOff();
        
        planetSelect(5);
        break;

      case "Uranus":
        console.log("uranus");
        togglePlanetsOptionsVisibilityOff();
        
        planetSelect(6);
        break;

      case "Neptune":
        console.log("neptune");
        togglePlanetsOptionsVisibilityOff();
        
        planetSelect(7);
        break;

      case "Pluto":
        console.log("pluto");
        togglePlanetsOptionsVisibilityOff();
        
        planetSelect(8);
        break;
      case "Pause-Play":
        togglePause();
        break;
      default:
        break;
    }
  }
}


function createReticle(){
  if (reticle){
    reticle.add(sunObj);
    sunObj.position.y = 0.2;
    sunObj.children[0].material.opacity = 0.2;
    return;
  }

  reticle = new THREE.Object3D();

  let ringGeometry = new THREE.RingGeometry(0.07, 0.09, 24, 1);
  let ringMaterial = new THREE.MeshBasicMaterial({ color: 0x34d2eb });
  ringGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
  let circle = new THREE.Mesh(ringGeometry, ringMaterial);
  circle.position.y = 0.03;

  sunObj.position.y = 0.2;
  sunObj.children[0].material.opacity = 0.2;

  reticle.add(circle);
  reticle.add(sunObj);
  reticle.name = 'reticle';
  scene.add(reticle);
}


function planetSelect(num){
  //Pick random fact
  let ranNum = Math.floor(Math.random() * 3);
  console.log(jsonObj.planets[num].facts[ranNum]);

  if (!jsonObj.planets[num].beingViewed){
    for (let i=0; i<jsonObj.numPlanets; i++){
      planets[i].visible = false;
    }

    if (num != 2){
      moonObj.visible = false;
    }

    if (jsonObj.showPlanetLines){
      toggleOrbitLines();
    }

    jsonObj.planets[num].beingViewed = true;
    jsonObj.planets[num].moveOrbit = false;
    planets[num].visible = true;

    //TODO move to the render function

    //Direction
    let dir = new THREE.Vector3();
    let dir2 = new THREE.Vector3();
    dir.subVectors(camera.getWorldPosition(dir), planets[num].getWorldPosition(dir2)).normalize();

    //Distance
    let dist = new THREE.Vector3();
    let distance;
    planets[num].getWorldPosition(dist);
    distance = camera.position.distanceTo(dist);

    //Position
    originPoint.translateOnAxis(dir, distance - 0.4);

    //Scale
    planets[num].scale.set(0.0003, 0.0003, 0.0003);

    let centerPoint = new THREE.Vector3();
    let planetGeometry = planets[num].children[0].geometry

    let height = (planetGeometry.boundingBox.max.y + planetGeometry.boundingBox.min.y)/2;
    planets[num].getWorldPosition(sunPivot.position);

    originPoint.remove(sunObj);
    sunPivot.position.y += height;
    sunPivot.add(sunObj);
    sunObj.position.set(0, 0, 0);


    //Distance from sun
    dir.subVectors(planets[num].getWorldPosition(dir), sunObj.getWorldPosition(dir2));
    dir.y = 0;

    //TODO: Work on the size of the sun so its visible from all planets
    distance = jsonObj.planets[num].distanceFromSun / (jsonObj.distanceScale / 100) - planets[num].position.distanceTo(dir2);
    sunObj.scale.set(0.0005, 0.0005, 0.0005);
    sunObj.translateOnAxis(dir, distance );
  }
}

function sunSelect(){
  let reset = false;

  for( let i=0; i<jsonObj.numPlanets; i++){
    if (jsonObj.planets[i].beingViewed){
      reset = true;
      moonObj.visible = true;
      for( let j=0; j<jsonObj.numPlanets; j++){
        planets[j].visible = true;
      }

      if (!jsonObj.showPlanetLines){
        toggleOrbitLines();
      }

      jsonObj.planets[i].beingViewed = false;
      jsonObj.planets[i].moveOrbit = true;

      planets[i].scale.set((jsonObj.planets[i].radius/jsonObj.sizeScale),
                              (jsonObj.planets[i].radius/jsonObj.sizeScale),
                              (jsonObj.planets[i].radius/jsonObj.sizeScale));

      sunObj.scale.set( jsonObj.sun.radius/jsonObj.sizeScale/10,
                        jsonObj.sun.radius/jsonObj.sizeScale/10,
                        jsonObj.sun.radius/jsonObj.sizeScale/10);

      sunPivot.remove(sunObj);
      sunObj.position.set(0, 0, 0);
      originPoint.add(sunObj);

      returnToOrigin();
    }
  }

  if (!reset){
    //TODO: Be able to view the sun up close

  }
}


/************
Earth Bounding Boxs
************/
function checkEarthBoundingBoxs(point){

  let antarcticaBox = new THREE.Box3();
  antarcticaBox.setFromPoints(jsonObj.continents[6].boundingBox);
  antarcticaBox.expandByPoint(jsonObj.continents[6].centerPoint);

  let australiaBox = new THREE.Box3();
  australiaBox.setFromPoints(jsonObj.continents[5].boundingBox);

  let europeBox = new THREE.Box3();
  europeBox.setFromPoints(jsonObj.continents[2].boundingBox);

  let africaBox1 = new THREE.Box3();
  africaBox1.setFromPoints(jsonObj.continents[3].boundingBox[0]);

  let africaBox2 = new THREE.Box3();
  africaBox2.setFromPoints(jsonObj.continents[3].boundingBox[1]);

  let southAmericaBox1 = new THREE.Box3();
  southAmericaBox1.setFromPoints(jsonObj.continents[1].boundingBox[0]);

  let southAmericaBox2 = new THREE.Box3();
  southAmericaBox2.setFromPoints(jsonObj.continents[1].boundingBox[1]);

  let northAmericaBox1 = new THREE.Box3();
  northAmericaBox1.setFromPoints(jsonObj.continents[0].boundingBox[0]);

  let northAmericaBox2 = new THREE.Box3();
  northAmericaBox2.setFromPoints(jsonObj.continents[0].boundingBox[1]);

  let asiaBox1 = new THREE.Box3();
  asiaBox1.setFromPoints(jsonObj.continents[4].boundingBox[0]);

  let asiaBox2 = new THREE.Box3();
  asiaBox2.setFromPoints(jsonObj.continents[4].boundingBox[1]);

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


//TODO: part of menu
function toggleLight(){
  if (cameraLight.visible){
    console.log("Sun Light");
    cameraLight.visible = false;
    sunLight.visible = true;

  } else {
    console.log("cameraLight");
    cameraLight.visible = true;
    sunLight.visible = false;
  }
}

function toggleOrbitLines(){
  if (jsonObj.showPlanetLines){
    jsonObj.showPlanetLines = false;
    for (var i=0; i<jsonObj.numPlanets; i++){
      orbitLines[i].visible = false;
    }

  } else {
    jsonObj.showPlanetLines = true;
    for (var i=0; i<jsonObj.numPlanets; i++){
      orbitLines[i].visible = true;
    }
  }
}

function togglePause(){
  if (!jsonObj.pause){
    //Pause
    jsonObj.pause = true;
    jsonObj.sun.moveRotate = false;
    jsonObj.planets[2].moon.moveRotate = false;
    jsonObj.planets[2].moon.moveOrbit = false;
    for (let i=0; i<jsonObj.numPlanets; i++){
      jsonObj.planets[i].moveRotate = false;
      jsonObj.planets[i].moveOrbit = false;
    }
  } else {
    //UnPause
    jsonObj.pause = false;
    jsonObj.sun.moveRotate = true;
    jsonObj.planets[2].moon.moveRotate = true;
    jsonObj.planets[2].moon.moveOrbit = true;
    for (let i=0; i<jsonObj.numPlanets; i++){
      jsonObj.planets[i].moveRotate = true;
      jsonObj.planets[i].moveOrbit = true;
    }
  }
}


function returnToOrigin(){
  originPoint.position.setFromMatrixPosition(originMatrix);
}

function resetSolarSystem(){
  showSolarSystem = false;
}

init();
