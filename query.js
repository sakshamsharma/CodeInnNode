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

exports.data= function(connection) {

  return function(req, res) {

    connection.query('SELECT * from ' + req.query.Table + ' WHERE UNIX_TIMESTAMP(CreationDate) > ' + Number(Date.parse(req.query.Timestamp))/1000, function(err, rows, fields){
      if(err) throw err;
      res.writeHead(200, { 'Content-Type': 'application/json'  });
      res.write(JSON.stringify(rows));
      res.end();
    })

  }

}
