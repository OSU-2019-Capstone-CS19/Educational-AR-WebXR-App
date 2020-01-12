var planets = [];
var pivots = [];
var sunObj, moonObj, moonPivot;
var astronautObj;

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
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
var cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
cameraControls.update();

//camera.position.x = 200
camera.position.z =  500;
camera.position.y = 500;
camera.lookAt(new THREE.Vector3( 0, 0, 0));


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
for (var i=0; i < jsonObj.numPlanets; i++){    //need to add pluto
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
  jsonObj.planets[2].Moon.file,
  gltf => loadMoon( gltf ),
  xhr => onProgress(xhr),
  error => onError(error)
);


/**********
Load Model Functions
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
  sunObj.scale.set( jsonObj.sun.radius/jsonObj.sizeScale/10, //10 for testing
                    jsonObj.sun.radius/jsonObj.sizeScale/10,
                    jsonObj.sun.radius/jsonObj.sizeScale/10);
  sunObj.name = jsonObj.sun.name;
  scene.add(sunObj);
};

//Load Planet Models
var loadPlanet = ( gltf ) => {

  //Order Planets
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

  planets[num] = gltf.scene
  planets[num].scale.set((jsonObj.planets[num].radius/jsonObj.sizeScale),
                          (jsonObj.planets[num].radius/jsonObj.sizeScale),
                          (jsonObj.planets[num].radius/jsonObj.sizeScale));
  planets[num].position.set(pivots[num].position.x + jsonObj.planets[num].DistanceFromSun/jsonObj.distanceScale,
                            pivots[num].position.y,
                            pivots[num].position.z);
  planets[num].name = jsonObj.planets[num].name;
  pivots[num].add(planets[num]);
  pivots[num].rotation.z += jsonObj.planets[num].OrbitInclination;

  //Draw Orbit Lines
  material = new THREE.LineBasicMaterial({ color:0xffffa1 });
  orbitCircle = new THREE.CircleGeometry(jsonObj.planets[num].DistanceFromSun/jsonObj.distanceScale, 100);
  orbitCircle.vertices.shift();
  orbitCircle.rotateX(Math.PI * 0.5); //Fix oriantation
  orbitCircle.rotateZ(jsonObj.planets[num].OrbitInclination);
  scene.add( new THREE.LineLoop( orbitCircle, material ));

  num++;
};

//Load Moon Model
var loadMoon = ( gltf ) => {
  moonObj = gltf.scene;

  moonPivot.position.set( moonPivot.position.x + jsonObj.planets[2].DistanceFromSun/jsonObj.distanceScale,
                          moonPivot.position.y,
                          moonPivot.position.z);

  moonObj.scale.set((jsonObj.planets[2].Moon.radius/jsonObj.sizeScale),
                    (jsonObj.planets[2].Moon.radius/jsonObj.sizeScale),
                    (jsonObj.planets[2].Moon.radius/jsonObj.sizeScale));

  moonObj.position.set( jsonObj.planets[2].Moon.DistanceFromEarth/jsonObj.distanceScale,
                        moonPivot.position.y,
                        moonPivot.position.z);
  moonObj.name = jsonObj.planets[2].Moon.name;
  pivots[2].add(moonPivot);
  moonPivot.add(moonObj);

  moonPivot.rotation.z += jsonObj.planets[2].Moon.OrbitInclination;
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
**********/
var render = () => {
  requestAnimationFrame( render );

  //Sun Rotation
  if (sunObj){
    //sunObj.rotation.y += 0.01;
  }

  //Planet Rotation (rad/day)
  // for (var i=0; i<jsonObj.numPlanets; i++){
  //   if (planets[i]){
  //       planets[i].rotation.y += jsonObj.planets[i].Rotation / jsonObj.rotationScale;
  //   }
  // }

  //Orbit (rad/day)
  for (var i=0; i<jsonObj.numPlanets; i++){ //will use jsonObj.numElements
    if (pivots[i]){
      pivots[i].rotation.y += jsonObj.planets[i].Orbit / jsonObj.orbitScale;
    }
  }

  //Moon Orbit (rad/day)
  if (moonPivot){
    moonPivot.rotation.y += jsonObj.planets[2].Moon.Orbit / jsonObj.orbitScale;
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

      // //TODO check to see what was clicked on (planet/moon/sun)
      // console.log(intersects[0].object.parent.parent);
      // intersects[0].object.material.color.set( 0xff0000 );
      if(intersects[0].object.parent.parent.name){
        switch(intersects[0].object.parent.parent.name){
          case "Sun":
            console.log("Sun");
            console.log(sunObj.position);
            break;

          case "Mercury":
            console.log("Mercury");
            console.log(planets[0].position);
            break;

          case "Venus":
            console.log("Venus");
            console.log(planets[1].position);
            break;

          case "Earth":
            console.log("Earth");
            console.log(planets[2].position);
            break;

          case "Moon":
            console.log("Moon");
            console.log(moonObj.matrixWorld);  //NOTE local position relitive to earth
            break;

          case "Mars":
            console.log("Mars");
            console.log(planets[3].position);
            break;

          case "Jupiter":
            console.log("Jupiter");
            console.log(planets[4].matrixWorld);

            // var geometry = new THREE.BoxGeometry( 1, 100, 1 );
            // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            // var cube = new THREE.Mesh( geometry, material );
            // cube.position.set(planets[4].matrixWorld[0], 0, 0);
            // scene.add(cube);

            break;

          case "Saturn":
            console.log("Saturn");
            console.log(planets[5].position);
            break;

          case "Uranus":
            console.log("Uranus");
            console.log(planets[6].position);
            break;

          case "Neptune":
            console.log("Neptune");
            console.log(planets[7].position);
            break;

          default:
            break;

        }
      }
   }
}, false );
