var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost';
var mysqlUser = process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root';
var mysqlPass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD || '0808';
 
var users = require('./users.js')
var api   = require('./api.js')

var sys = require('sys')
var exec = require('child_process').exec;

var connection = mysql.createConnection({
  host     : mysqlHost,
  user     : mysqlUser,
  password : mysqlPass,
  database : 'codeinn'
});

connection.connect();

app.get('/', function (req, res) {

  res.send('Hello hacker! Its ' + new Date().getTime());

});

// API Routes
app.get('/api/query', api.query(connection))

app.get('/api/compile', api.compile)

app.get('/api/run', api.run)

app.get('/api/verify', api.verify(connection))

// USERS Routes
app.post('/users/login', users.login(connection))

app.post('/users/signup', users.signup(connection))

app.post('/users/usernamequery', users.usernamequery(connection))

app.post('/users/emailquery', users.emailquery(connection))

// SERVER Configuration
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
var server = app.listen(server_port, server_ip_address, function () {

  console.log('CodeInn server listening at http://%s:%s', server_ip_address, server_port);

});
