var planets = [];
var pivots = [];
var sunObj, moonObj, moonPivot;
var astronautObj;
var cameraTarget

/**********
Load up JSON file
**********/
var jsonObj;
var request = new XMLHttpRequest();
  request.open("GET", "./solarSystem.json", false);
  request.send(null)
  jsonObj = JSON.parse(request.responseText);


/**********
Create Renderer
**********/
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


/**********
Create Scene
Load 3D objects
**********/
var scene = new THREE.Scene();
sunObj = new THREE.Object3D();
moonObj = new THREE.Object3D();
moonPivot = new THREE.Object3D();
astronautObj = new THREE.Object3D();

for (var i=0; i < jsonObj.numPlanets; i++){ //need to add pluto
  pivots[i] = new THREE.Object3D();
  pivots[i].position.set(0, 0, 0);
  scene.add(pivots[i]);
}


/**********
Create Camera
Camera Controls
**********/
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000000 );
var cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
cameraControls.target = new THREE.Vector3( 0, 0, 0);
cameraControls.update();

//camera.position.x = 200
// camera.position.z =  500;
camera.position.y = 7000;


/**********
Create Lights
**********/
var sunLight = new THREE.PointLight( 0xfffff, 1, 1000, 2);
sunLight.position.set( 0, 0, 0);
scene.add(sunLight);

//NOTE: May remove and rely on just the point light from the sun. In this case we do need a light to light up the sun from what the camera sees
var pointLight = new THREE.DirectionalLight(0xffffff, 1);
pointLight.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(pointLight);


/**********
Raycasting and Mouse
**********/
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// function onMouseClick(event){
//   mouse.x = (event.clientX / window.innerWidth) *2 -1;
//   mouse.y = - (event.clientY / window.innerHeight) *2 -1;
// }


/**********
Load Models
**********/
var loader = new THREE.GLTFLoader();

//Astronaut
// loader.load(
//   //NOTE cant seem to load glb files from NASA website (missing textures)
//   jsonObj.astronaut.file,
//   gltf => loadAstronaut( gltf ),
//   xhr => onProgress(xhr),
//   error => onError(error)
// );

//Sun
loader.load(
  //NOTE cant seem to load glb files from NASA website (missing textures)
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
    //NOTE cant seem to load glb files from NASA website (missing textures)
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


/**********
Load Model Functions
TODO: include inclination of rotation
Each Planet, Sun, and Moon begins with a scale of 1, equivalent to (1000, 1000, 1000)
Scalled down by 10000
**********/
// var loadAstronaut = ( gltf ) => {
//   astronautObj = gltf.scene;
//   astronautObj.position.set(100, 1000, 1000);
//   astronautObj.scale.set(200, 200, 200);
//   scene.add(astronautObj);
// };

//Load Sun Model
var loadSun = ( gltf ) => {
  sunObj = gltf.scene;
  //TODO: remove /10
  sunObj.scale.set( jsonObj.sun.radius/jsonObj.sizeScale/10,
                    jsonObj.sun.radius/jsonObj.sizeScale/10,
                    jsonObj.sun.radius/jsonObj.sizeScale/10);
  sunObj.name = jsonObj.sun.name;
  scene.add(sunObj);

  var boundingBox = new THREE.Box3().setFromObject(sunObj);
  console.log(boundingBox.getSize());
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
  planets[num].name = jsonObj.planets[num].name;

  pivots[num].add(planets[num]);
  pivots[num].rotation.z += jsonObj.planets[num].orbitInclination;


  //Draw Orbit Lines
  material = new THREE.LineBasicMaterial({ color:0xffffa1 });
  orbitCircle = new THREE.CircleGeometry(jsonObj.planets[num].distanceFromSun/jsonObj.distanceScale, 100);
  orbitCircle.vertices.shift();
  orbitCircle.rotateX(Math.PI * 0.5);
  orbitCircle.rotateZ(jsonObj.planets[num].orbitInclination);
  scene.add( new THREE.LineLoop( orbitCircle, material ));

  num++;
};

//Load Moon Model
var loadMoon = ( gltf ) => {
  moonObj = gltf.scene;

  moonPivot.position.set( moonPivot.position.x + jsonObj.planets[2].distanceFromSun/jsonObj.distanceScale,
                          moonPivot.position.y,
                          moonPivot.position.z);

  moonObj.scale.set((jsonObj.planets[2].moon.radius/jsonObj.sizeScale),
                    (jsonObj.planets[2].moon.radius/jsonObj.sizeScale),
                    (jsonObj.planets[2].moon.radius/jsonObj.sizeScale));

  moonObj.position.set( jsonObj.planets[2].moon.distanceFromEarth/jsonObj.distanceScale,
                        moonPivot.position.y,
                        moonPivot.position.z);
  moonObj.name = jsonObj.planets[2].moon.name;
  pivots[2].add(moonPivot);
  moonPivot.add(moonObj);

  moonPivot.rotation.z += jsonObj.planets[2].moon.orbitInclination;
};

//Model Load Progress
var onProgress = (xhr) => {
  console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded');
};

//Model Load Error
var onError = (errorMessage) => {
  console.log(errorMessage);
};


/**********
Render/Animate Function
TODO: set actual rotation speed for sun moon and planets
TODO: pivot points need to rotate on the y axis with respect to the inclination
**********/
var render = () => {
  requestAnimationFrame( render );

  //Sun Rotation
  if (sunObj){
    sunObj.rotation.y += 0.01;
  }

  //Planet Rotation (rad/day)
  for (var i=0; i<jsonObj.numPlanets; i++){
    if (planets[i]){
        planets[i].rotation.y += 0.01;//jsonObj.planets[i].Rotation / jsonObj.rotationScale;
    }
  }

  //Orbit (rad/day)
  for (var i=0; i<jsonObj.numPlanets; i++){ //will use jsonObj.numElements
    if (pivots[i]){
      pivots[i].rotation.y += jsonObj.planets[i].orbit / jsonObj.orbitScale;
    }
  }

  //Moon Orbit (rad/day)
  if (moonPivot){
    moonPivot.rotation.y += jsonObj.planets[2].moon.orbit / jsonObj.orbitScale;
  }

  //Camera rotation if viewing planet
  for (var i=0; i<jsonObj.numPlanets; i++){
    if (jsonObj.planets[i].beingViewed == "true"){
      cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[i].matrixWorld);
      cameraControls.target = cameraTarget;
    }
  }

  cameraControls.update();

  renderer.render( scene, camera );
};

render();

/**********
Click Event Listener
**********/
window.addEventListener( 'mousedown', () => {
    mouse.x = (event.clientX / window.innerWidth) *2 -1;
    mouse.y = - (event.clientY / window.innerHeight) *2 +1;

    raycaster.setFromCamera( mouse, camera );
	  var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0){
      console.log(intersects[0]);
      if(intersects[0].object.parent.name){
        switch(intersects[0].object.parent.name){
          case "Sun":
            console.log("Sun");
            break;

          case "Mercury":
            console.log("Mercury");
            jsonObj.planets[0].beingViewed = "true";
            cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[1].matrixWorld);
            cameraControls.target = cameraTarget;
            cameraControls.update();

            //camera.posision.set
            pivots[1].add(camera);
            break;

          case "Venus":
            console.log("Venus");
            jsonObj.planets[1].beingViewed = "true";
            cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[1].matrixWorld);
            cameraControls.target = cameraTarget;
            cameraControls.update();

            //camera.posision.set
            pivots[1].add(camera);
            break;

          case "Earth":
            console.log("Earth");
            jsonObj.planets[2].beingViewed = "true";
            cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[2].matrixWorld);
            cameraControls.target = cameraTarget;
            cameraControls.update();

            //camera.posision.set
            pivots[2].add(camera);
            break;

          case "Moon":
            console.log("Moon");
            console.log(moonObj.matrixWorld);  //NOTE local position relitive to earth
            jsonObj.planets[2].moon.beingViewed = "true";
            cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[2].moon.matrixWorld);
            cameraControls.target = cameraTarget;
            cameraControls.update();

            //camera.posision.set
            moonPivot.add(camera);
            break;

          case "Mars":
            console.log("Mars");
            jsonObj.planets[3].beingViewed = "true";
            cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[3].matrixWorld);
            cameraControls.target = cameraTarget;
            cameraControls.update();

            //camera.posision.set
            pivots[3].add(camera);
            break;

          case "Jupiter":
            console.log("Jupiter");

            jsonObj.planets[4].beingViewed = "true";

            cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[4].matrixWorld);

            //TODO: Moving to the position
              //Raise up to a curtain y (so we can fly over anything)
              //Then fly to the position and rotate till there. (cameraControls are off during this)
              //Might come up with an equation dependent on how far away we are

            //TODO: set posision of camera
              //Take X and Z posision and set away from planet by the size of its radius
              //Y will be set based on height of planet(radius)
            camera.position.set( cameraTarget.x/2, 0, cameraTarget.z/2);
            cameraControls.target = cameraTarget;

            pivots[4].add(camera);
            cameraControls.update();
            break;

          case "Saturn":
            console.log("Saturn");
            jsonObj.planets[5].beingViewed = "true";
            cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[5].matrixWorld);
            cameraControls.target = cameraTarget;
            cameraControls.update();

            //camera.posision.set
            pivots[5].add(camera);
            break;

          case "Uranus":
            console.log("Uranus");
            jsonObj.planets[6].beingViewed = "true";
            cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[6].matrixWorld);
            cameraControls.target = cameraTarget;
            cameraControls.update();

            //camera.posision.set
            pivots[6].add(camera);
            break;

          case "Neptune":
            console.log("Neptune");
            jsonObj.planets[7].beingViewed = "true";
            cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[7].matrixWorld);
            cameraControls.target = cameraTarget;
            cameraControls.update();

            //camera.posision.set
            pivots[7].add(camera);
            break;

          default:
            break;

        }
      }
   }
}, false );
