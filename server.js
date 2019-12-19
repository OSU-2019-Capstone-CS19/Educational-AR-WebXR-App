var http = require('http');
var express = require("express");
var app = express();
var server = http.createServer(app);
const port = 8080;

// Attach files to html
app.use('/model', express.static(__dirname + '/model'));
app.use('/src', express.static(__dirname + '/src'));


//API, send html file
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(port);
console.log("Server running on port " + port);
