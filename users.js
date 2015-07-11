exports.login = function(connection) {

  return function(req, res) {
 
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

  }

}

exports.signup = function(connection) {

  return function(req, res) {

    connection.query('SELECT Name from Users WHERE Name = "' + req.body.Username + '"', function(err, rows, fields) {
      if(err) throw err;
      if(rows.length != 0) {
        res.writeHead(403);
        res.write("Username already exists");
        res.end();
      }
      else {
        connection.query("INSERT into Users (Name, Email, Password) values ('" + req.body.Username + "', '" + req.body.Email + "', '" + req.body.Password + "')", function(err, rows, fields) {
          if(err) {
            res.writeHead(403);
            res.write(err.stack);
            res.end();
          }
          res.writeHead(200);
          res.write("Successfully created a new account");
          res.end();
        })
      }
    })

  }

}

exports.getUserData = function(connection) {

  return function(req, res) {

    connection.query('SELECT PPsolved, Contributions, Points from Users WHERE Name = "' + req.body.Username + '"', function(err, rows, fields) {
      res.writeHead(403);
      res.write( JSON.stringify(rows) );
      res.end();
    })

  }

}
