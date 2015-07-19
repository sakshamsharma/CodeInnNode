exports.usernamequery = function(connection) {
  
  return function(req, res) {

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

  }

}

exports.emailquery = function(connection) {
  
  return function(req, res) {

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

  }

}

exports.increasePoints = function(connection, increment, username, callback) {
  
  connection.query('UPDATE Users SET Points = Points + ' + increment + ' WHERE Name = "' + username + '"', function(err, rows, fields) {
    if(err) {
      console.log(err);
      callback(1);
    }
    else {
      console.log(username + " gets " + increment + " more points.");
      callback(0);
    }
  })

}

exports.addToList = function(connection, column, username, id, callback) {
  
  connection.query('SELECT ' + column + ' AS to_increment from Users WHERE Name = "' + username + '"', function(err, rows, fields) {
    if(err) {
      console.log(err);
      callback(1);
    }
    else {
      var list = rows[0].to_increment.split(',');
      var does_exist = 0;
      for(var i=1; i<list.length; i++) {
        if(list[i] == id) {
          does_exist = 1;
          break;
        }
      }
      if(does_exist)
        callback(-1);
      else {
        var newrows = rows[0].to_increment + "," + id;
        connection.query('UPDATE Users SET ' + column + ' = "' + newrows + '" WHERE Name = "' + username + '"', function(err, rows, fields) {
          if(err) {
            console.log(err);
            callback(2);
          }
          else {
            exports.increasePoints(connection, 10, username, function(code) {
              if(code != 0)
                callback(3);
              else
                callback(0);
            })
          }
        })
      }
    }
  })

}

exports.checkInList = function(connection, column, username, id, callback) {
  
  connection.query('SELECT ' + column + ' AS to_search from Users WHERE Name = "' + username + '"', function(err, rows, fields) {
    if(err) {
      console.log("Error searching if question id has been solved")
      console.log(err)
      callback(2);
    }
    else {
      var list = rows[0].to_search.split(',');
      var does_exist = 0;
      for(var i=1; i<list.length; i++) {
        if(list[i] == id) {
          does_exist = 1;
          break;
        }
      }
      if(does_exist)
        callback(1);
      else callback(0);
    }
  })
}
