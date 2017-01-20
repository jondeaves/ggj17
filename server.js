/* eslint-disable */
var express = require("express");
var http = require('http')
var app = express();
var server = http.createServer(app);


// Serve all static files
app.use(express.static('./public'));

// Start the server
app.server = server.listen(4001, function() {
  console.info('Express server listening on http://localhost:4001');
});
