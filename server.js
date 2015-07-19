var express    = require('express'),
    bodyParser = require('body-parser'),
    mysql      = require('mysql'),
    sys  = require('sys'),
    exec = require('child_process').exec


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
    mysqlUser = process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
    mysqlPass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD || '0808'
 
var users   = require('./users.js'),
    api     = require('./api.js'),
    misc    = require('./misc.js'),
    query   = require('./query.js'),
    helpers = require('./helpers.js')

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

// Query Routes
app.get('/query/data', query.data(connection))

app.get('/query/daily', query.daily(connection))

app.get('/query/solution', query.solution(connection))

// Compiling etc routes
app.get('/api/compile', api.compile)

app.get('/api/run', api.run)

app.get('/api/verify', api.verify(connection))

// USERS Routes
app.post('/users/login', users.login(connection))

app.post('/users/signup', users.signup(connection))

app.post('/users/usernamequery', helpers.usernamequery(connection))

app.post('/users/emailquery', helpers.emailquery(connection))

app.get('/users/getuserdata', users.getUserData(connection))

// Contribute api call
app.post('/contribute', misc.contribute(connection))

app.get('/leaderboard', misc.leaderboard(connection))

// SERVER Configuration
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
var server = app.listen(server_port, server_ip_address, function () {

  console.log('CodeInn server listening at http://%s:%s', server_ip_address, server_port);

});
