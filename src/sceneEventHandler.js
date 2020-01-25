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
              //NOTE: Is broken right now
              jsonObj.sun.beingViewed = "false";
              scene.add(camera);

              //TODO: this is hard coded
              camera.position.set(0, 700, 0);
              cameraControls.target = new THREE.Vector3(0,0,0);
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

              console.log(intersects[0]);
              var temp = new THREE.Vector3;
              planets[2].getWorldPosition(temp);
              console.log(temp);
            }

            break;


          case "Moon":
            if (jsonObj.planets[2].moon.beingViewed == "true"){
              jsonObj.planets[2].moon.beingViewed = "false";
              moonPivot.add(camera);
              camera.position.set(10, 0, 0);

            } else if (jsonObj.planets[2].moon.beingViewed == "false"){
              jsonObj.planets[2].moon.beingViewed = "true";
              moonPivot.add(camera);
              camera.position.set( -1, 0, 0);
            }

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
// document.body.onkeyup = function(e){
//     if(e.keyCode == 32){
// 		    if(jsonObj.showPlanetLines == "true"){
//           jsonObj.showPlanetLines = "false";
//           for (var i=0; i < jsonObj.numPlanets; i++){
//             scene.remove(orbitLines[i]);
//           }
//
//         } else if(jsonObj.showPlanetLines == "false"){
//           jsonObj.showPlanetLines = "true";
//           for (var i=0; i < jsonObj.numPlanets; i++){
//             scene.add(orbitLines[i]);
//           }
//         }
//     }
// }

/**********
Click Event Listener for astronaut and textbox
**********/
// window.addEventListener( 'mousedown', () => {
document.body.onkeyup = function(e){
    if(e.keyCode == 32){
      if(document.getElementById("TextBox").style.visibility == "visible"){
        document.getElementById("TextBox").style.visibility = "hidden";
      } else {
        document.getElementById("TextBox").style.visibility = "visible";
      }

  		cameraPivot.position.setFromMatrixPosition(camera.matrixWorld);
  		cameraPivot.quaternion.setFromRotationMatrix(camera.matrixWorld);
  		// cameraPivot.rotateY()
  		cameraPivot.updateMatrix();

  		cameraPivot.add(astronautObj);
      astronautObj.position.y = -50;
      astronautObj.position.z = -100;
      cameraPivot.rotateY(-Math.PI/2);
      jsonObj.astronaut.angle = 0;
      jsonObj.astronaut.rotate = "true";
    }
}
