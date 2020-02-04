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
    var ranNum = Math.floor(Math.random() * 3);

    mouse.x = (event.clientX / window.innerWidth) *2 -1;
    mouse.y = - (event.clientY / window.innerHeight) *2 +1;

    raycaster.setFromCamera( mouse, camera );
	  var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0){

      if(intersects[0].object.parent.name){
        switch(intersects[0].object.parent.name){

          case "Sun":
            if (!jsonObj.sun.beingViewed && !jsonObj.traversal){
              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = false;
              }
              jsonObj.sun.beingViewed = true;

              sunObj.add(camera);

              //TODO: this is hard coded
              camera.position.set(0, 700, 1500);
              cameraControls.target = sunObj.position;
              cameraControls.update();
              document.getElementById("TextBox").innerHTML = jsonObj.sun.facts[ranNum];

            } else {
              //NOTE: Is broken right now
              jsonObj.sun.beingViewed = false;
              scene.add(camera);

              //TODO: this is hard coded
              camera.position.set(0, 700, 0);
              cameraControls.target = new THREE.Vector3(0,0,0);
              cameraControls.update();
              document.getElementById("TextBox").innerHTML = jsonObj.sun.standard;
            }

            break;


          case "Mercury":
            if (!jsonObj.planets[0].beingViewed && !jsonObj.traversal){

              jsonObj.sun.beingViewed = false;
              jsonObj.planets[2].moon.beingViewed = false;
              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = false;
              }

              jsonObj.planets[0].beingViewed = true;
              jsonObj.traversal = true;

              document.getElementById("TextBox").innerHTML = jsonObj.planets[0].facts[ranNum];


          // } else if (jsonObj.planets[0].beingViewed == "true"){
          //
          //   planets[0].add(camera);
          //   camera.position.set( (jsonObj.planets[0].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);


          }

            break;


          case "Venus":
            if (!jsonObj.planets[1].beingViewed && !jsonObj.traversal){

              jsonObj.sun.beingViewed = false;
              jsonObj.planets[2].moon.beingViewed = false;
              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = false;
              }

              jsonObj.planets[1].beingViewed = true;
              jsonObj.traversal = true;

              document.getElementById("TextBox").innerHTML = jsonObj.planets[1].facts[ranNum];

            // } else if (jsonObj.planets[1].beingViewed){
            //
            //   planets[1].add(camera);
            //   camera.position.set( (jsonObj.planets[1].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
            }

            break;


          case "Earth":
            if (!jsonObj.planets[2].beingViewed && !jsonObj.traversal){

              jsonObj.sun.beingViewed = false;
              jsonObj.planets[2].moon.beingViewed = false;
              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = false;
              }

              jsonObj.planets[2].beingViewed = true;
              jsonObj.traversal = true;

              document.getElementById("TextBox").innerHTML = jsonObj.planets[2].facts[ranNum];

            // } else if (jsonObj.planets[2].beingViewed){
            //
            //   console.log(intersects[0]);
            //   var temp = new THREE.Vector3;
            //   planets[2].getWorldPosition(temp);
            //   console.log(temp);
            }

            break;


          case "Moon":
            if (jsonObj.planets[2].moon.beingViewed && !jsonObj.traversal){
              jsonObj.planets[2].moon.beingViewed = false;
              moonPivot.add(camera);
              camera.position.set(10, 0, 0);

            } else if (!jsonObj.planets[2].moon.beingViewed){
              jsonObj.planets[2].moon.beingViewed = true;
              moonPivot.add(camera);
              camera.position.set( -1, 0, 0);
            }

            break;


          case "Mars":
            if (!jsonObj.planets[3].beingViewed && !jsonObj.traversal){

              jsonObj.sun.beingViewed = false;
              jsonObj.planets[2].moon.beingViewed = false;
              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = false;
              }

              jsonObj.planets[3].beingViewed = true;
              jsonObj.traversal = true;

              document.getElementById("TextBox").innerHTML = jsonObj.planets[3].facts[ranNum];


            // } else if (jsonObj.planets[3].beingViewed == "true"){
            //
            // planets[3].add(camera);
            // camera.position.set( (jsonObj.planets[3].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
          }

            break;


          case "Jupiter":
            if (!jsonObj.planets[4].beingViewed && !jsonObj.traversal){

              jsonObj.sun.beingViewed = false;
              jsonObj.planets[2].moon.beingViewed = false;
              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = false;
              }

              jsonObj.planets[4].beingViewed = true;
              jsonObj.traversal = true;

              document.getElementById("TextBox").innerHTML = jsonObj.planets[4].facts[ranNum];


            // } else if (jsonObj.planets[4].beingViewed == "true"){
            //
            //   planets[4].add(camera);
            //   camera.position.set( (jsonObj.planets[4].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
            }

            break;

          case "Saturn":
            if (!jsonObj.planets[5].beingViewed && !jsonObj.traversal){

              jsonObj.sun.beingViewed = false;
              jsonObj.planets[2].moon.beingViewed = false;
              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = false;
              }

              jsonObj.planets[5].beingViewed = true;
              jsonObj.traversal = true;

              document.getElementById("TextBox").innerHTML = jsonObj.planets[5].facts[ranNum];
            
            // } else if (jsonObj.planets[5].beingViewed){
            //
            //   planets[5].add(camera);
            //   camera.position.set( (jsonObj.planets[5].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
            }

            break;

          case "Uranus":
            if (!jsonObj.planets[6].beingViewed && !jsonObj.traversal){

              jsonObj.sun.beingViewed = false;
              jsonObj.planets[2].moon.beingViewed = false;
              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = false;
              }

              jsonObj.planets[6].beingViewed = true;
              jsonObj.traversal = true;

              document.getElementById("TextBox").innerHTML = jsonObj.planets[6].facts[ranNum];

            // } else if (jsonObj.planets[6].beingViewed == "true"){
            //
            //   planets[6].add(camera);
            //   camera.position.set( (jsonObj.planets[6].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
            }

            break;

          case "Neptune":
            if (!jsonObj.planets[7].beingViewed && !jsonObj.traversal){

              jsonObj.sun.beingViewed = false;
              jsonObj.planets[2].moon.beingViewed = false;
              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = false;
              }

              jsonObj.planets[7].beingViewed = true;
              jsonObj.traversal = true;

              document.getElementById("TextBox").innerHTML = jsonObj.planets[7].facts[ranNum];

          // } else if (jsonObj.planets[7].beingViewed == true){
          //
          //   planets[7].add(camera);
          //   camera.position.set( (jsonObj.planets[7].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
          }

            break;

          case "Pluto":
            if (!jsonObj.planets[8].beingViewed && !jsonObj.traversal){

              jsonObj.sun.beingViewed = false;
              jsonObj.planets[2].moon.beingViewed = false;
              for (var i=0; i<jsonObj.numPlanets; i++){
                jsonObj.planets[i].beingViewed = false;
              }

              jsonObj.planets[8].beingViewed = true;
              jsonObj.traversal = true;

              document.getElementById("TextBox").innerHTML = jsonObj.planets[8].facts[ranNum];

            // } else if (jsonObj.planets[8].beingViewed == "true"){
            //
            //   planets[8].add(camera);
            //   camera.position.set( (jsonObj.planets[8].distanceFromSun/jsonObj.distanceScale)*(2), 0, 0);
            }

            break;

          default:
            break;

        }
      }
   }
}, false );


/**********
Click Event Listener for astronaut and textbox
**********/
// window.addEventListener( 'mousedown', () => {
// document.body.onkeyup = function(e){
    // if(e.keyCode == 32){
    //   if(document.getElementById("TextBox").style.visibility == "visible"){
    //     document.getElementById("TextBox").style.visibility = "hidden";
    //   } else {
    //     document.getElementById("TextBox").style.visibility = "visible";
    //   }

    //   Test
    //   spawnAstronaut(cameraPivot);

  		// cameraPivot.position.setFromMatrixPosition(camera.matrixWorld);
  		// cameraPivot.quaternion.setFromRotationMatrix(camera.matrixWorld);
  		// cameraPivot.updateMatrix();
      
  		// cameraPivot.add(astronautObj);
    //   astronautObj.position.y = -50;
    //   astronautObj.position.z = -100;
    //   cameraPivot.rotateY(-Math.PI/2);
    //   jsonObj.astronaut.angle = 0;
    //   jsonObj.astronaut.rotate = "true";
    // }
// }
