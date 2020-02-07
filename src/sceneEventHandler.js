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
            sunSelect();
            break;

          case "Mercury":
            planetSelect(0);
            break;

          case "Venus":
            planetSelect(1);
            break;

          case "Earth":
            planetSelect(2);

            if (jsonObj.planets[2].beingViewed){
              var point = planets[2].worldToLocal(intersects[0].point);

              if (antarcticaBox.containsPoint(point)){
                console.log("Antarctica");
              } else if (australiaBox.containsPoint(point)){
                console.log("Australia");
              } else if (europeBox.containsPoint(point)){
                console.log("Europe");
              } else if (africaBox1.containsPoint(point)){
                console.log("Africa");
              } else if (africaBox2.containsPoint(point)){
                console.log("Africa");
              } else if (southAmericaBox1.containsPoint(point)){
                console.log("South America");
              } else if (southAmericaBox2.containsPoint(point)){
                console.log("South America");
              } else if (northAmericaBox1.containsPoint(point)){
                console.log("North America");
              } else if (northAmericaBox2.containsPoint(point)){
                console.log("North America");
              } else if (asiaBox1.containsPoint(point)){
                console.log("Asia");
              } else if (asiaBox2.containsPoint(point)){
                console.log("Asia");
              } else {
                console.log("False");
              }
            }
            break;

          case "Moon":
            moonSelect();
            break;

          case "Mars":
            planetSelect(3);
            break;

          case "Jupiter":
            planetSelect(4);
            break;

          case "Saturn":
            planetSelect(5);
            break;

          case "Uranus":
            planetSelect(6);
            break;

          case "Neptune":
            planetSelect(7);
            break;

          case "Pluto":
            planetSelect(8);
            break;

          default:
            break;
        }
      }
   }
}, false );
