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
camera.position.z = 10;
camera.position.y = 5;
camera.lookAt(new THREE.Vector3( 0, 0, 0));

//Scene
sunObj = new THREE.Object3D();
astronautObj = new THREE.Object3D();

for (var i=0; i<5; i++){ //will use jsonObj.numElements
  pivots[i] = new THREE.Object3D();
  pivots[i].position.set(i+1, 0, 0);
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
  // //Orbit
  // if (mercuryPivot){
  //   mercuryPivot.rotation.y += 0.02;
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
  astronautObj.position.set(0, 5, 0);
  astronautObj.scale.set(100, 100, 100);
  scene.add(astronautObj);
};

var loadPlanet = ( gltf ) => {
  planets[num] = gltf.scene;
  planets[num].position.set(pivots[num].position.x, pivots[num].position.y, pivots[num].position.z);
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
loader.load(
  //NOTE cant seem to load glb files from NASA website (missing textures)
  jsonObj.astronaut.file,
  gltf => loadAstronaut( gltf ),
  xhr => onProgress(xhr),
  error => onError(error)
);

//Planets
var num=0;
for (var i=0; i<5 ; i++){    //will use jsonObj.numElements
  loader.load(
    //NOTE cant seem to load glb files from NASA website (missing textures)
    jsonObj.planets[i].file,
    gltf => loadPlanet( gltf ),
    xhr => onProgress(xhr),
    error => onError(error)
  );
}

render();
