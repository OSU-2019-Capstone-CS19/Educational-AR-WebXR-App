//3D Objects
var planets = [];
var pivots = [];
var sunObj, astronautObj;

//JSON
var jsonObj;
var request = new XMLHttpRequest();
  request.open("GET", "./solarSystem.json", false);
  request.send(null)
  jsonObj = JSON.parse(request.responseText);

//Camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
//camera.position.x = -30
camera.position.z = 100;
//camera.position.y = 200;
camera.lookAt(new THREE.Vector3( 0, 0, 0));

//Scene
sunObj = new THREE.Object3D();
astronautObj = new THREE.Object3D();

for (var i=0; i < jsonObj.numPlanets; i++){ //need to add pluto
  pivots[i] = new THREE.Object3D();
  pivots[i].position.set(0, 0, 0);
  scene.add(pivots[i]);
}

//Lights
var sunLight = new THREE.PointLight( 0xfffff, 1, 1000, 2);
sunLight.position.set( 0, 0, 0);
scene.add(sunLight);

//NOTE: May remove and rely on just the point light from the sun. In this case we do need a light to light up the sun from what the camera sees
var pointLight = new THREE.DirectionalLight(0xffffff, 1);
pointLight.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(pointLight);

//Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Load Models
var loader = new THREE.GLTFLoader();

var loadSun = ( gltf ) => {
  sunObj = gltf.scene;
  sunObj.position.set(0, 0, 0);
  sunObj.scale.set((jsonObj.sun.radius/jsonObj.sizeScale/10), //10 for testing
                    (jsonObj.sun.radius/jsonObj.sizeScale/10),
                    (jsonObj.sun.radius/jsonObj.sizeScale/10));
  scene.add(sunObj);
};

var loadAstronaut = ( gltf ) => {
  astronautObj = gltf.scene;
  astronautObj.position.set(0, 0, 0);
  astronautObj.scale.set(0, 0, 0);
  scene.add(astronautObj);
};

var loadPlanet = ( gltf ) => {

  //Order based on what comes through
  switch (gltf.parser.options.path){
    case "./model/planets-gltf/mercury/":
      num = 0;
      break;
    case "./model/planets-gltf/venus/":
      num = 1;
      break;
    case "./model/planets-gltf/earth/":
      num = 2;
      break;
    case "./model/planets-gltf/mars/":
      num = 3;
      break;
    case "./model/planets-gltf/jupiter/":
      num = 4;
      break;
    case "./model/planets-gltf/saturn/":
      num = 5;
      break;
    case "./model/planets-gltf/uranus/":
      num = 6;
      break;
    case "./model/planets-gltf/neptune/":
      num = 7;
      break;
    default:
      console.log("Bad Case");
      break;
  }

  planets[num] = gltf.scene;
  planets[num].position.set(pivots[num].position.x + jsonObj.planets[num].DistanceFromSun/jsonObj.distanceScale,
                            pivots[num].position.y,
                            pivots[num].position.z);
  planets[num].scale.set((jsonObj.planets[num].radius/jsonObj.sizeScale),
                          (jsonObj.planets[num].radius/jsonObj.sizeScale),
                          (jsonObj.planets[num].radius/jsonObj.sizeScale));
  pivots[num].add(planets[num]);
  num++;
};

var onProgress = (xhr) => {
  console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded');
};

var onError = (errorMessage) => {
  console.log(errorMessage);
};

//Sun
loader.load(
  //NOTE cant seem to load glb files from NASA website (missing textures)
  jsonObj.sun.file,
  gltf => loadSun( gltf ),
  xhr => onProgress(xhr),
  error => onError(error)
);

//Astronaut
// loader.load(
//   //NOTE cant seem to load glb files from NASA website (missing textures)
//   jsonObj.astronaut.file,
//   gltf => loadAstronaut( gltf ),
//   xhr => onProgress(xhr),
//   error => onError(error)
// );

//Planets
var num=0;

//NOTE: Loads planets in the wrong order
for (var i=0; i < jsonObj.numPlanets; i++){    //need to add pluto
  loader.load(
    //NOTE cant seem to load glb files from NASA website (missing textures)
    jsonObj.planets[i].file,
    gltf => loadPlanet( gltf ),
    xhr => onProgress(xhr),
    error => onError(error)
  );
}

var render = () => {
  requestAnimationFrame( render );

  //rotation
  // for (var i=0; i<sunObj.children.length(); i++){
  //   if (sunObj.children[i]){
  //       sunObj.children[i].rotation.y += 0.02;
  //   }
  // }

  //Orbit (rad/day)
  for (var i=0; i<jsonObj.numPlanets; i++){ //will use jsonObj.numElements
    if (pivots[i]){
      pivots[i].rotation.y += jsonObj.planets[i].Orbit / jsonObj.orbitScale;
    }
  }

  renderer.render( scene, camera );
};

render();
