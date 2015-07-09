exports.dailyChallenge = function(connection) {

  return function(req, res) {

    connection.query('SELECT * from DailyChallenge order by Id LIMIT 1', function(err, rows, fields){
      if(err) throw err;
      res.writeHead(200, { 'Content-Type': 'application/json'  });
      res.write(JSON.stringify(rows));
      res.end();
    })

  }

}

