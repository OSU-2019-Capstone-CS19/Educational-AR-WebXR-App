//Load in all the planets
var sunObj, mercuryObj, venusObj, earthObj, moonObj, marsObj, saturnObj, jupiterObj, uranusObj, neptuneObj, plutoObj;
var sunPivot, mercuryPivot, venusPivot, earthPivot, moonPivot, marsObj, saturnPivot, jupiterPivot, uranusPivot, neptunePivot, plutoPivot;
var solarObj;

//JSON
var jsonObj;

var request = new XMLHttpRequest();
  request.open("GET", "./solarSystem.json", false);
  request.send(null)
  jsonObj = JSON.parse(request.responseText);

console.log(jsonObj.planets);

//Scene & camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
console.log("height: " + window.innerHeight + " width: " + window.innerWidth);
camera.position.z = 3;
camera.position.y = 2;
camera.lookAt(new THREE.Vector3( 0, 0, 0));

solarObj = new THREE.Object3D();
mercuryPivot = new THREE.Object3D();
scene.add(solarObj);
solarObj.add(mercuryPivot);

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
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

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

var onLoad = ( gltf ) => {
  mercuryObj = gltf.scene;
  //mercury.scale.set(100, 100, 100);
  mercuryObj.position.set(mercuryPivot.position.x, mercuryPivot.position.y, mercuryPivot.position.z);
  //scene.add( mercury );
  mercuryPivot.add(mercuryObj);
  console.log("model loaded");
}

var onProgress = (xhr) => {
  console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded');
};

var onError = (errorMessage) => {
  console.log(errorMessage);
};


loader.load(
  //NOTE cant seem to load glb files from NASA website (missing textures)
  //'./model/planets-glb/mercury/Mercury.glb'
  //'./model/planets-gltf/sun/sun.gltf'
  './model/planets-gltf/mercury/mercury.gltf'
  , (gltf) => onLoad( gltf ),
  xhr => onProgress(xhr), error => onError(error)
  );



render();
