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
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.x = -10
camera.position.z = 10;
camera.position.y = 5;
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
var sunLight = new THREE.PointLight( 0xff000, 1, 1000, 1);
sunLight.position.set( 0, 0, 0);
scene.add(sunLight);
var pointLight = new THREE.DirectionalLight(0xffffff, 1);
pointLight.position.set(0, 0, 200);
scene.add(pointLight);

//Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// renderer.gammaOutput = true;
// renderer.gammaFactor = 2.2;

var render = () => {
  requestAnimationFrame( render );

  //rotation
  // for (var i=0; i<sunObj.children.length(); i++){
  //   if (sunObj.children[i]){
  //       sunObj.children[i].rotation.y += 0.02;
  //   }
  // }

  // if (mercuryObj){
  //   mercuryObj.rotation.y += 0.02;
  // }
  //
  //Orbit
  // for (var i=0; i<5; i++){ //will use jsonObj.numElements
  //   if (pivots[i]){
  //     pivots[i].rotation.y += 0.02; //be based on the rotation within jsonObj
  //   }
  // }

  renderer.render( scene, camera );
};

//Load Models
var loader = new THREE.GLTFLoader();

var loadSun = ( gltf ) => {
  sunObj = gltf.scene;
  sunObj.position.set(0, 0, 0);
  scene.add(sunObj);
};

var loadAstronaut = ( gltf ) => {
  astronautObj = gltf.scene;
  astronautObj.position.set(0, 0, 0);
  astronautObj.scale.set(3, 3, 3);
  scene.add(astronautObj);
};

var loadPlanet = ( gltf ) => {
  planets[num] = gltf.scene;
  planets[num].position.set(pivots[num].position.x + jsonObj.planets[num].DistanceFromSun/jsonObj.distanceScale,
                            pivots[num].position.y,
                            pivots[num].position.z);
  planets[num].scale.set((jsonObj.planets[num].radius/jsonObj.sizeScale),
                          (jsonObj.planets[num].radius/jsonObj.sizeScale),
                          (jsonObj.planets[num].radius/jsonObj.sizeScale));
  pivots[num].add(planets[num]);
  console.log(jsonObj.planets[num].name);
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
loader.load(
  //NOTE cant seem to load glb files from NASA website (missing textures)
  jsonObj.astronaut.file,
  gltf => loadAstronaut( gltf ),
  xhr => onProgress(xhr),
  error => onError(error)
);

//Planets
var num=0;
for (var i=0; i < jsonObj.numPlanets; i++){    //need to add pluto
  loader.load(
    //NOTE cant seem to load glb files from NASA website (missing textures)
    jsonObj.planets[i].file,
    gltf => loadPlanet( gltf ),
    xhr => onProgress(xhr),
    error => onError(error)
  );
}

render();
