var express = require('express');
var mysql = require('mysql');

var app = express();

app.get('/', function (req, res) {

  res.send('Hello hacker!');

});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
var server = app.listen(server_port, server_ip_address, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('CodeInn server listening at http://%s:%s', host, port);

});
