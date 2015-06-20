var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
app.use(bodyParser.json());

var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost';
var mysqlUser = process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root';
var mysqlPass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD || '0808';
 
var connection = mysql.createConnection({
  host     : mysqlHost,
  user     : mysqlUser,
  password : mysqlPass,
  database : 'codeinn'
});

connection.connect();

app.get('/', function (req, res) {

  res.send('Hello hacker!');

});

app.get('/api/query', function(req, res) {

  connection.query('SELECT * from ' + req.query.Table + ' WHERE UNIX_TIMESTAMP(CreationDate) > ' + Number(Date.parse(req.query.Timestamp))/1000, function(err, rows, fields){
    if(err) throw err;
    res.writeHead(200, { 'Content-Type': 'application/json'  });
    res.write(JSON.stringify(rows));
    res.end();
  })

})

app.post('/users/login', function(req, res) {

  connection.query('SELECT Password from Users WHERE Name = "' + req.body.Username + '"', function(err, rows, fields){
    if(err) throw err;
    if(rows.length == 0) {
      res.writeHead(404);
      res.write("No such user");
      res.end();
    }
    else {
      if(rows[0].Password == req.body.Password) {
        res.writeHead(200);
        res.write("Login successful");
        res.end();
      }
      else {
        res.writeHead(403);
        res.write("Incorrect Credentials");
        res.end();
      }
    }
  })

})

app.post('/users/signup', function(req, res) {
  
  connection.query('SELECT Name from Users WHERE Name = "' + req.body.Username + '"', function(err, rows, fields) {
    if(err) throw err;
    if(rows.length != 0) {
      res.writeHead(403);
      res.write("Username already exists");
      res.end();
    }
    else {
      connection.query('INSERT into Users values (\'' + req.body.Username + '\', \'' + req.body.Email + '\', \'' + req.body.Password + '\')', function(err, rows, fields) {
        res.writeHead(200);
        res.write("Successfully created a new account");
        res.end();
      })
    }
  })

})

app.post('/users/usernamequery', function(req, res) {
  
  connection.query('SELECT Name from Users WHERE Name = "' + req.body.Username + '"', function(err, rows, fields) {
    if(err) throw err;
    if(rows.length != 0) {
      res.writeHead(403);
      res.write("Username already exists");
      res.end();
    }
    else {
      res.writeHead(200);
      res.writeHead("Username allowed");
      res.end();
    }
  })

})

app.post('/users/emailquery', function(req, res) {
  
  connection.query('SELECT Email from Users WHERE Email = "' + req.body.Email + '"', function(err, rows, fields) {
    if(err) throw err;
    if(rows.length != 0) {
      res.writeHead(403);
      res.write("Email already in use");
      res.end();
    }
    else {
      res.writeHead(200);
      res.writeHead("Email allowed");
      res.end();
    }
  })

})

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
var server = app.listen(server_port, server_ip_address, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('CodeInn server listening at http://%s:%s', host, port);

});
