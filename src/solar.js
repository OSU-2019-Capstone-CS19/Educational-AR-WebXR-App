//import { WebGLRenderer, Scene, Object3D, PerspectiveCamera, OrbitControls, Vector3, PointLight, Raycaster, Vector2, GLTFLoader, LineBasicMaterial, CircleGeometry, LineLoop} from 'three';

var planets = [];
var pivots = [];
var orbitLines = [];
//var interestingPoints[];
var sunObj, moonObj, moonPivot;
var astronautObj, cameraPivot;
var cameraTarget


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

// var jsonAstroFacts;
// var factRequest = new XMLHttpRequest();
//   factRequest.open("GET", "./astronautFacts.json", false);
//   factRequest.send();
//   jsonAstroFacts = JSON.parse(factRequest.responseText);
//   console.log(jsonAstroFacts);


/**********
Create Renderer
**********/
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


/**********
Create Scene
***********
=> Create the scene
=> Create Sun object
=> Create Astronaut object
=> Create all pivots for objects in the scene
**********/
var scene = new THREE.Scene();
sunObj = new THREE.Object3D();
moonObj = new THREE.Object3D();
moonPivot = new THREE.Object3D();
astronautObj = new THREE.Object3D();


for (var i=0; i < jsonObj.numPlanets; i++){
  pivots[i] = new THREE.Object3D();
  pivots[i].position.set(0, 0, 0);
  scene.add(pivots[i]);
}

//Camera added to scene
//scene.add(camera); //TODO TEST OUT


/**********
Create Camera
=> NOTE: cameraControls will not be implemented in the AR build, instead an AR camera will be used
=> Set starting point for camera
**********/
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000000 );
var cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
cameraControls.target = new THREE.Vector3( 0, 0, 0);
cameraControls.update();

//camera.position.x = 200
// camera.position.z =  500;
camera.position.y = 700;

//Camera pivot (astronaut)
cameraPivot = new THREE.Object3D();
cameraPivot.position.set(camera.position.x, camera.position.y, camera.position.z);
cameraPivot.rotation.copy(camera.rotation);
cameraPivot.updateMatrix();
scene.add(cameraPivot);


/**********
Create Lights
**********/
var sunLight = new THREE.PointLight( 0xfffee8, 1, 0, 0);
sunLight.position.set( 0, 0, 0);
scene.add(sunLight);


/**********
Raycasting and Mouse
**********/
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();


/**********
Load Models
=> Use the GLTFLoader to load all nessisary models and set the models to appropriate objects
**********/
var loader = new THREE.GLTFLoader();

//Sun
loader.load(
  jsonObj.sun.file,
  gltf => loadSun( gltf ),
  xhr => onProgress(xhr),
  error => onError(error)
);

//Planets
var num=0;

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


//Astronaut
loader.load(
  jsonObj.astronaut.file,
  gltf => loadAstronaut( gltf ),
  xhr => onProgress(xhr),
  error => onError(error)
);


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
  //TODO: remove /10
  sunObj.scale.set( jsonObj.sun.radius/jsonObj.sizeScale/10,
                    jsonObj.sun.radius/jsonObj.sizeScale/10,
                    jsonObj.sun.radius/jsonObj.sizeScale/10);
  sunObj.rotateZ(jsonObj.sun.rotationAngle);
  sunObj.name = jsonObj.sun.name;
  scene.add(sunObj);
};

//Load Planet Models
var loadPlanet = ( gltf ) => {

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

  planets[num] = gltf.scene
  planets[num].scale.set((jsonObj.planets[num].radius/jsonObj.sizeScale),
                          (jsonObj.planets[num].radius/jsonObj.sizeScale),
                          (jsonObj.planets[num].radius/jsonObj.sizeScale));
  planets[num].position.set(pivots[num].position.x + jsonObj.planets[num].distanceFromSun/jsonObj.distanceScale,
                            pivots[num].position.y,
                            pivots[num].position.z);
  planets[num].rotateZ(jsonObj.planets[num].rotationAngle);
  planets[num].name = jsonObj.planets[num].name;

  pivots[num].add(planets[num]);
  pivots[num].rotateZ(jsonObj.planets[num].orbitInclination);// += jsonObj.planets[num].orbitInclination;

  //Draw Orbit Lines
  material = new THREE.LineBasicMaterial({ color:0xffffa1 });
  orbitCircle = new THREE.CircleGeometry(jsonObj.planets[num].distanceFromSun/jsonObj.distanceScale, 100);
  orbitCircle.vertices.shift();
  orbitCircle.rotateX(Math.PI * 0.5);
  orbitCircle.rotateZ(jsonObj.planets[num].orbitInclination);

  orbitLines[num] = new THREE.LineLoop( orbitCircle, material);
  scene.add(orbitLines[num]);

};

//Load Moon Model
var loadMoon = ( gltf ) => {
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

};

//Load Astronaut Model
var loadAstronaut = ( gltf ) => {
  astronautObj = gltf.scene;
  astronautObj.scale.set(.05, .05, .05);
};

//Model Load Progress
var onProgress = (xhr) => {
  //console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded');
};

//Model Load Error
var onError = (errorMessage) => {
  console.log(errorMessage);
};

//TODO: Need to sync to the rotation of planet
var spawnAstronaut = (pivot) => {
  pivot.add(cameraPivot);
  cameraPivot.add(astronautObj);
  astronautObj.position.y = -50;
  astronautObj.position.z = -100;
  cameraPivot.rotateY(-Math.PI/2);
  jsonObj.astronaut.angle = 0;
  jsonObj.astronaut.rotate = "true";

  cameraPivot.position.setFromMatrixPosition(camera.matrixWorld);
  cameraPivot.quaternion.setFromRotationMatrix(camera.matrixWorld);
  cameraPivot.updateMatrix();

  console.log(cameraPivot);
  console.log(camera);

}
