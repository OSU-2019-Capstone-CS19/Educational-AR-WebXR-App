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

//TEST: HitTestSourceInit


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

  var geometry = new THREE.SphereGeometry( 0.05, 0.05, 0.05 );
  var green = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true} ); //Green
  green.opacity = 0.5;
  var yellow = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent: true} ); //Yellow
  yellow.opacity = 0.5;
  var gray = new THREE.MeshBasicMaterial( {color: 0xD3D3D3, transparent: true} ); //light gray
  gray.opacity = 0.3;
  var gray2 = new THREE.MeshBasicMaterial( {color: 0x808080, transparent: true} ); //gray
  gray2.opacity = 0.5;
  sunPreview = new THREE.Mesh( geometry, gray2);

  originPoint = new THREE.Object3D();
  originPoint.name = "origin";

  loadModels();

  if (navigator.xr) {
    checkSupportedState();
  }
}

/**********
Load Models
**********/
function loadModels() {

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
}

/**********
Load Model Functions
***********/

//Load Sun Model
function loadSun(gltf) {
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
};

//Load Moon Model
function loadMoon(gltf) {
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
    let statusBox = document.getElementById('statusbox');
    if (supported) {
      
      xrButton.addEventListener('click', toggleAR);

      console.log("AR READY!");
    } else {
      //buttone change red and say error or warning.
      statusBox.innerHTML = 'Houston we have a problem, your device is not compatible';
      xrButton.style.backgroundColor = '#cc0000';
      xrButton.innerHTML = 'Error';

      console.log("AR unavailable");
    }
  });
}

  //NOTE: This function can be removed if we want to (AR activated could be a json componet)
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
    //console.log(event);

    let inputPose = event.frame.getPose(event.inputSource.targetRaySpace, xrRefSpace);

    if (inputPose) {
      console.log(inputPose);

      let targetRay = new XRRay(inputPose.transform);
      let rayOrigin = new THREE.Vector3(targetRay.origin.x, targetRay.origin.y, targetRay.origin.z);
      let rayDirection = new THREE.Vector3(targetRay.direction.x, targetRay.direction.y, targetRay.direction.z);

      let sceneRaycaster = new THREE.Raycaster();
      sceneRaycaster.set(rayOrigin, rayDirection);

      let intersectsArray = [sunObj, planets[1], planets[2], planets[3], planets[4], planets[5], planets[6], planets[7], planets[8]];

      let intersects = sceneRaycaster.intersectObjects(intersectsArray, true);
      if (intersects.length > 0){
        if (intersects[0].object.parent.name){
          switch(intersects[0].object.parent.name){

            case "Sun":
              console.log("sun");
              // sunSelect();
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
                var point = planets[2].worldToLocal(intersects[0].point);

                // if (antarcticaBox.containsPoint(point)){
                //   console.log("Antarctica");
                // } else if (australiaBox.containsPoint(point)){
                //   console.log("Australia");
                // } else if (europeBox.containsPoint(point)){
                //   console.log("Europe");
                // } else if (africaBox1.containsPoint(point)){
                //   console.log("Africa");
                // } else if (africaBox2.containsPoint(point)){
                //   console.log("Africa");
                // } else if (southAmericaBox1.containsPoint(point)){
                //   console.log("South America");
                // } else if (southAmericaBox2.containsPoint(point)){
                //   console.log("South America");
                // } else if (northAmericaBox1.containsPoint(point)){
                //   console.log("North America");
                // } else if (northAmericaBox2.containsPoint(point)){
                //   console.log("North America");
                // } else if (asiaBox1.containsPoint(point)){
                //   console.log("Asia");
                // } else if (asiaBox2.containsPoint(point)){
                //   console.log("Asia");
                // } else {
                //   console.log("False");
                // }
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
    }

    //TODO Change this to a reset button when the solar system is in place
    //showSolarSystem = false;

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

function planetSelect(num){
  let ranNum = Math.floor(Math.random() * 3);
  console.log(jsonObj.planets[num].facts[ranNum]);

  if (!jsonObj.planets[num].beingViewed){
    jsonObj.sun.beingViewed = false;
    jsonObj.planets[2].moon.beingViewed = false;
    for (var i=0; i<jsonObj.numPlanets; i++){
      jsonObj.planets[i].beingViewed = false;
    }
    jsonObj.planets[num].beingViewed = true;
  }
}

init();
