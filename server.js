// var http = require('http');
var fs = require("fs");

var THREE = require("./three");
var express = require("express");
var path = require("path");
var app = express();
const port = 8080;

app.get('/', function(req, res) {

  innerWidth = 660;
  innerHeight = 500;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 1000 );
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( innerWidth, innerHeight);
  document.body.appendChild( renderer.domElement );

  var sun_geometry = new THREE.SphereGeometry( 4, 32, 32 );
  var yellowMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
  var sphere1 = new THREE.Mesh(sun_geometry, yellowMaterial);
  scene.add(sphere1);

  camera.position.set(0, 30, 50);
  camera.lookAt(sphere1.position);

  renderer.render(scene, camera);

  renderer.domElement.toBuffer (err, buf) => {
    res.contentType 'image/jpg';
    res.send buf;
  };

});

app.listen(port);
console.log("Server running on port " + port);
