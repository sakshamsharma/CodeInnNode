exports.getData = function(connection) {

  connection.query('SELECT PPsolved, DCsolved, OCsolved, Contributions, Points from Users WHERE Name = "' + req.body.Username + '"', function(err, rows, fields) {
    if(err) throw err;
    return rows;
  })

}
