var helpers = require('./helpers.js')

exports.daily = function(connection) {

  return function(req, res) {

    connection.query('SELECT * from DailyChallenge order by Id DESC LIMIT 1', function(err, rows, fields){
      if(err) throw err;
      res.writeHead(200, { 'Content-Type': 'application/json'  });
      res.write(JSON.stringify(rows));
      res.end();
    })
  }
}

exports.data = function(connection) {

  return function(req, res) {

    connection.query('SELECT * from ' + req.query.Table + ' WHERE UNIX_TIMESTAMP(CreationDate) > ' + Number(Date.parse(req.query.Timestamp))/1000, function(err, rows, fields){
      if(err) throw err;
      res.writeHead(200, { 'Content-Type': 'application/json'  });
      res.write(JSON.stringify(rows));
      res.end();
    })
  }
}

exports.solution = function(connection) {

  return function(req, res) {

    connection.query('SELECT Solutions from ProblemsSol WHERE Id = "' + req.query.Id + '"', function(err, rows, fields) {
      if(err) throw err;
      helpers.checkInList(connection, 'PPsolved', req.query.username, req.query.Id, function(code) {
        if(code != 0 && code != 1) {
          res.writeHead(403);
          res.write("There was an internal server error. Try again later.");
          res.end();
        }
        else {
          if(code == 1) {
            res.writeHead(200, { 'Content-Type': 'application/json'  });
            res.write(JSON.stringify(rows));
            res.end();
          }
          else if(code == 0) {
            helpers.increasePoints(connection, -8, req.query.username, function(code2) {
              if(code2 == 1) {
                res.writeHead(403);
                res.write("There was an internal server error. Try again later.");
                res.end();
              }
              else {
                res.writeHead(200, { 'Content-Type': 'application/json'  });
                res.write(JSON.stringify(rows));
                res.end();
              }
            })
          }
        }
      })
    })
  }
}
