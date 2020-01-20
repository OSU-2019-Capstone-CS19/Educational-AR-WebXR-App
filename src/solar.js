var planets = [];
var pivots = [];
var orbitLines = [];
var sunObj, moonObj, moonPivot;
var astronautObj;
var cameraTarget

/**********
Load up JSON file
***********
=> This file contains all relevent information concerning all the objects in the scene
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

for (var i=0; i < jsonObj.numPlanets; i++){ //need to add pluto
  pivots[i] = new THREE.Object3D();
  pivots[i].position.set(0, 0, 0);
  scene.add(pivots[i]);
}


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
***********
=> Check if sunObj exists
  => Yes: Rotate the sunObj about its Y axis

=> Check if planets exists
  => Yes: Rotate the planets based on their Y axis

=> Check if planets pivots exists
  => Yes: Rotate each pivot about its Y axis, resulting in an orbit around the sun

=> Check if moonObj exists
  => Yes: Rotate the moonObj about its Y axis

=> Check if moonPivot exists
  => Yes: Rotate the moonPivot about its Y axis, resulting in an orbit around the earth

=> Check if any planet is currently being viewed
  => Yes: Update cameraControls.Target to the planet
  => NOTE: This will not be in the AR version of the application

=> Update camera controls
=> Call render
**********/
var render = () => {
  requestAnimationFrame( render );

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

  //Planet Orbit (rad/day)
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

  //Camera rotation if viewing planet
  for (var i=0; i<jsonObj.numPlanets; i++){
    if (jsonObj.planets[i].beingViewed == "true"){
      cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[i].matrixWorld);
      cameraControls.target = cameraTarget;

    // } else if (jsonObj.planets[2].moon.beingViewed == "true"){
    //   cameraTarget = new THREE.Vector3().setFromMatrixPosition(planets[2].matrixWorld);
    //   cameraControls.target = cameraTarget;
    }
  }

  cameraControls.update();

  renderer.render( scene, camera );
};

render();

/**********
Click Event Listener
***********
=> Use a raycaster to find intersects with mouse location
=> Check if click was on the Sun
  => Check if planet is currently being being viewed
    => No: Set all other planets.beingViewed to false and set the sun.beingViewed to true
           Set camera parent to planets pivot point so camera orbits around the sun
    => Yes: Set sun.beingViewed to false
            Return to original view of the solar system

=> Check if click was on a planet
 => Check if planet is currently being viewed
    => No: Set all other planets.beingViewed to false and this planet.beingViewed to true
           Set camera parent to planets pivot point so camera orbits around with the planet
    => Yes: Set camera parent to planet so camera orbits around the planet
**********/
window.addEventListener( 'mousedown', () => {
    mouse.x = (event.clientX / window.innerWidth) *2 -1;
    mouse.y = - (event.clientY / window.innerHeight) *2 +1;

    raycaster.setFromCamera( mouse, camera );
	  var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0){

      if(intersects[0].object.parent.name){
        switch(intersects[0].object.parent.name){

          case "Sun":
            if (jsonObj.sun.beingViewed == "false"){
              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = "false";
              }
              jsonObj.sun.beingViewed = "true";

              sunObj.add(camera);

              //TODO: this is hard coded
              camera.position.set(0, 700, 1500);
              cameraControls.target = sunObj.position;
              cameraControls.update();

            } else {
              jsonObj.sun.beingViewed = "false";
              scene.add(camera);

              //TODO: this is hard coded
              camera.position.set(0, 700, 0);
              cameraControls.target = sunObj.position;
              cameraControls.update();
            }

            break;


          case "Mercury":
            if (jsonObj.planets[0].beingViewed == "false"){

              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = "false";
              }
              jsonObj.sun.beingViewed = "false";
              jsonObj.planets[0].beingViewed = "true";

              pivots[0].add(camera);
              camera.position.set( (jsonObj.planets[0].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[0].radius/jsonObj.sizeScale, 0);

          } else if (jsonObj.planets[0].beingViewed == "true"){

            planets[0].add(camera);
            camera.position.set( (jsonObj.planets[0].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
          }

            break;


          case "Venus":
            if (jsonObj.planets[1].beingViewed == "false"){

              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = "false";
              }
              jsonObj.sun.beingViewed = "false";
              jsonObj.planets[1].beingViewed = "true";

              pivots[1].add(camera);
              camera.position.set( (jsonObj.planets[1].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[1].radius/jsonObj.sizeScale, 0);

            } else if (jsonObj.planets[1].beingViewed == "true"){

              planets[1].add(camera);
              camera.position.set( (jsonObj.planets[1].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
            }

            break;


          case "Earth":
            if (jsonObj.planets[2].beingViewed == "false"){

              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = "false";
              }
              jsonObj.sun.beingViewed = "false";
              jsonObj.planets[2].beingViewed = "true";

              pivots[2].add(camera);
              camera.position.set( (jsonObj.planets[2].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[2].radius/jsonObj.sizeScale, 0);

            } else if (jsonObj.planets[2].beingViewed == "true"){

              planets[2].add(camera);
              camera.position.set( (jsonObj.planets[2].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
            }

            break;


          case "Moon":
            console.log("Moon");

            jsonObj.planets[2].moon.beingViewed = "true";
            moonPivot.add(camera);
            camera.position.set( 10, 0, 0);

            break;


          case "Mars":
            if (jsonObj.planets[3].beingViewed == "false"){

              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = "false";
              }
              jsonObj.sun.beingViewed = "false";
              jsonObj.planets[3].beingViewed = "true";

              pivots[3].add(camera);
              camera.position.set( (jsonObj.planets[3].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[3].radius/jsonObj.sizeScale, 0);

            } else if (jsonObj.planets[3].beingViewed == "true"){

            planets[3].add(camera);
            camera.position.set( (jsonObj.planets[3].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
          }

            break;


          case "Jupiter":
            if (jsonObj.planets[4].beingViewed == "false"){

              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = "false";
              }
              jsonObj.sun.beingViewed = "false";
              jsonObj.planets[4].beingViewed = "true";

              pivots[4].add(camera);
              camera.position.set( (jsonObj.planets[4].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[4].radius/jsonObj.sizeScale, 0);

            } else if (jsonObj.planets[4].beingViewed == "true"){

              planets[4].add(camera);
              camera.position.set( (jsonObj.planets[4].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
            }

            break;

          case "Saturn":
            if (jsonObj.planets[5].beingViewed == "false"){

              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = "false";
              }
              jsonObj.sun.beingViewed = "false";
              jsonObj.planets[5].beingViewed = "true";

              pivots[5].add(camera);
              camera.position.set( (jsonObj.planets[5].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[5].radius/jsonObj.sizeScale, 0);

            } else if (jsonObj.planets[5].beingViewed == "true"){

              planets[5].add(camera);
              camera.position.set( (jsonObj.planets[5].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
            }

            break;

          case "Uranus":
            if (jsonObj.planets[6].beingViewed == "false"){

              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = "false";
              }
              jsonObj.sun.beingViewed = "false";
              jsonObj.planets[6].beingViewed = "true";

              pivots[6].add(camera);
              camera.position.set( (jsonObj.planets[6].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[6].radius/jsonObj.sizeScale, 0);

            } else if (jsonObj.planets[6].beingViewed == "true"){

              planets[6].add(camera);
              camera.position.set( (jsonObj.planets[6].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
            }

            break;

          case "Neptune":
            if (jsonObj.planets[7].beingViewed == "false"){

              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = "false";
              }
              jsonObj.sun.beingViewed = "false";
            jsonObj.planets[7].beingViewed = "true";

            pivots[7].add(camera);
            camera.position.set( (jsonObj.planets[7].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[7].radius/jsonObj.sizeScale, 0);

          } else if (jsonObj.planets[7].beingViewed == "true"){

            planets[7].add(camera);
            camera.position.set( (jsonObj.planets[7].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
          }

            break;

          case "Pluto":
            if (jsonObj.planets[8].beingViewed == "false"){

              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = "false";
              }
              jsonObj.sun.beingViewed = "false";
              jsonObj.planets[8].beingViewed = "true";

              pivots[8].add(camera);
              camera.position.set( (jsonObj.planets[8].distanceFromSun/jsonObj.distanceScale) * 9/10 , jsonObj.planets[8].radius/jsonObj.sizeScale, 0);

            } else if (jsonObj.planets[8].beingViewed == "true"){

              planets[8].add(camera);
              camera.position.set( (jsonObj.planets[4].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
            }

            break;

          default:
            break;

        }
      }
   }
}, false );

/**********
Test Click Event Listener
NOTE: This will be added as an option 
**********/
document.body.onkeyup = function(e){
    if(e.keyCode == 32){
		    if(jsonObj.showPlanetLines == "true"){
          jsonObj.showPlanetLines = "false";
          for (var i=0; i < jsonObj.numPlanets; i++){
            scene.remove(orbitLines[i]);
          }

        } else if(jsonObj.showPlanetLines == "false"){
          jsonObj.showPlanetLines = "true";
          for (var i=0; i < jsonObj.numPlanets; i++){
            scene.add(orbitLines[i]);
          }
        }
    }
}
