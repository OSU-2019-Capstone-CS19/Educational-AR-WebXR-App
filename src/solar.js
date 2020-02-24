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
var sunPreview;
var originPoint;
var planets = [];
var pivots = [];
var orbitLines = [];
var sunObj, moonObj, moonPivot;

let xrButton = document.getElementById('xr-button');
let xrSession = null;
let xrRefSpace = null;
var showSolarSystem = false;
var arActivated = false;
var reticle;
let gl = null;


/**********
Load up JSON file
***********
=> This file contains all relevent information concerning all the objects in the scene
**********/
var jsonObj;
var request = new XMLHttpRequest();
  request.open("GET", "./solarSystem.json", false);
  request.send(null);
  jsonObj = JSON.parse(request.responseText);


/**********
Create Renderer
**********/
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


/**********
Create Scene
***********
=> Create the scene
=> Create Sun object
=> Create Astronaut object
=> Create all pivots for objects in the scene
**********/
var scene = new THREE.Scene();
scene.background = null;

sunObj = new THREE.Object3D();
moonObj = new THREE.Object3D();
moonPivot = new THREE.Object3D();


/**********
Create Camera
=> Set starting point for camera
**********/
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 10000000);
camera.matrixAutoUpdate = false;
scene.add(camera);

/**********
Create Lights
**********/
// var sunLight = new THREE.PointLight( 0xfffee8, jsonObj.sun.intensity, 0, 0);
// sunLight.position.set( 0, 0, 0);
// scene.add(sunLight);

var light = new THREE.PointLight( 0xfffee8, 2, 0, 0);
camera.add(light);



//Inital function that starts AR off. Establishes AR to button with eventlistener
function init() {


  //Load in Models
  //TODO add new function for adding models

  var geometry = new THREE.SphereGeometry( 0.05, 0.05, 0.05 );
  var green = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); //Green
  var yellow = new THREE.MeshBasicMaterial( {color: 0xffff00} ); //Yellow
  sunPreview = new THREE.Mesh( geometry, green);

  originPoint = new THREE.Object3D();

  /**********
  Load Models
  => Use the GLTFLoader to load all nessisary models and set the models to appropriate objects
  **********/
  var loader = new GLTFLoader();

  //Sun
  loader.load(
    jsonObj.sun.file,
    gltf => loadSun( gltf ),
    xhr => onProgress(xhr),
    error => onError(error)
  );

  //Planets
  //NOTE: Loads planets in the wrong order
  for (var i=0; i < jsonObj.numPlanets; i++){
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


  if (navigator.xr) {
    checkSupportedState();
  }
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
var loadSun = ( gltf ) => {
  sunObj = gltf.scene;
  //TODO: remove /10, Maybe?
  sunObj.scale.set( jsonObj.sun.radius/jsonObj.sizeScale/10,
                    jsonObj.sun.radius/jsonObj.sizeScale/10,
                    jsonObj.sun.radius/jsonObj.sizeScale/10);
  sunObj.rotateZ(jsonObj.sun.rotationAngle);
  sunObj.name = jsonObj.sun.name;
  originPoint.add(sunObj);
};

//Load Planet Models
var loadPlanet = ( gltf ) => {
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

  pivots[num] = new THREE.Object3D();
  originPoint.add(pivots[num]);

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

  //Pivot
  pivots[num].add(planets[num]);
  pivots[num].rotateZ(jsonObj.planets[num].orbitInclination);

  //Draw Orbit Lines
  let orbitMaterial = new THREE.LineBasicMaterial({ color:0xffffa1 });
  let orbitCircle = new THREE.CircleGeometry(jsonObj.planets[num].distanceFromSun/jsonObj.distanceScale, 100);
  orbitCircle.vertices.shift();
  orbitCircle.rotateX(Math.PI * 0.5);
  orbitCircle.rotateZ(jsonObj.planets[num].orbitInclination);

  orbitLines[num] = new THREE.LineLoop( orbitCircle, orbitMaterial);
  originPoint.add(orbitLines[num]);
};

//Load Moon Model
var loadMoon = ( gltf ) => {
  moonPivot = new THREE.Object3D();
  moonObj = gltf.scene;

  moonPivot.position.set( jsonObj.planets[2].distanceFromSun/jsonObj.distanceScale,
                          moonPivot.position.y,
                          moonPivot.position.z);

  moonObj.scale.set(jsonObj.planets[2].moon.radius/jsonObj.sizeScale,
                    jsonObj.planets[2].moon.radius/jsonObj.sizeScale,
                    jsonObj.planets[2].moon.radius/jsonObj.sizeScale);

  moonObj.position.set( jsonObj.planets[2].radius/jsonObj.sizeScale + jsonObj.planets[2].moon.distanceFromEarth/jsonObj.distanceScale,
                        moonPivot.position.y,
                        moonPivot.position.z);

  moonObj.rotateZ(jsonObj.planets[2].moon.rotationAngle);
  moonObj.name = jsonObj.planets[2].moon.name;

  pivots[2].add(moonPivot);
  moonPivot.add(moonObj);

  moonPivot.rotateZ(jsonObj.planets[2].moon.orbitInclination);
};

function onProgress(xhr) {
  // console.log((xhr.loaded / xhr.total *100) + '% loaded');
}

function onError(error) {
  console.log(error);
}


//Check if AR is supported on the device
function checkSupportedState() {
  navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
    if (supported) {
      // xrButton.innerHTML = 'Enter AR';

      xrButton.addEventListener('click', toggleAR);
      console.log("AR READY!");
    } else {

      // xrButton.innerHTML = 'AR not found';
      console.log("AR unavailable");
    }
  });
}

  async function toggleAR(){
    if (arActivated){
      console.log("AR is already activated");
      return; //TODO: Would close down the XR
    }
    return activateAR();
  }

  async function activateAR(){
    try{
      xrSession = await navigator.xr.requestSession('immersive-ar');
      xrRefSpace = await xrSession.requestReferenceSpace('local');

      xrSession.addEventListener('select', touchSelectEvent);

      let gl = renderer.getContext();
      await gl.makeXRCompatible();
      let layer = new XRWebGLLayer(xrSession, gl);
      xrSession.updateRenderState({ baseLayer: layer });

      //TODO 'end' eventlistener

      xrSession.requestAnimationFrame(renderXR);
      arActivated = true;


    } catch (error){
      console.log("Catch: "+ error);
    }
  }


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

        //TODO: Render Animations here
        //Sun Rotation
        if (sunObj){
          sunObj.rotateY(jsonObj.sun.rotation / jsonObj.rotationScale);
        }

        //Planet Rotation (rad/day)
        for (var i=0; i<jsonObj.numPlanets; i++){
          if (planets[i]){
              planets[i].rotateY(jsonObj.planets[i].rotation / jsonObj.rotationScale);
          }
        }

        // //Planet Orbit (rad/day)
        for (var i=0; i<jsonObj.numPlanets; i++){ //will use jsonObj.numElements
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

    }

    let xrLayer = xrSession.renderState.baseLayer;
    renderer.setFramebuffer(xrLayer.framebuffer);

    for (let xrView of pose.views){
      let viewport = xrLayer.getViewport(xrView);
      renderView(xrView, viewport);
    }

    xrSession.requestAnimationFrame(renderXR);
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

function touchSelectEvent() {
  if (showSolarSystem){
    //TODO Change this to a reset button when the solar system is in place
    showSolarSystem = false;

  } else {
    showSolarSystem = true;

    let sunPreviewMatrix = sunPreview.matrixWorld;
    scene.add(originPoint);
    originPoint.position.setFromMatrixPosition(sunPreviewMatrix);

  }
}


function createReticle(){
  if (reticle){
    return;
  }

  reticle = new THREE.Object3D();

  let ringGeometry = new THREE.RingGeometry(0.07, 0.09, 24, 1);
  let ringMaterial = new THREE.MeshBasicMaterial({ color: 0x34d2eb });
  ringGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
  let circle = new THREE.Mesh(ringGeometry, ringMaterial);
  circle.position.y = 0.03;

  sunPreview.position.y = 0.2; //TODO could be fun to have a sit/stand mode to alter for different sizes and height

  reticle.add(circle);
  reticle.add(sunPreview);
  reticle.name = 'reticle';
  scene.add(reticle);

}

init();
