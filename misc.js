exports.contribute = function(connection) {

  return function(req, res) {

    connection.query("INSERT into Contributions (Username, Category, Title, Content, AdditionalContent) values('" + req.body.Username + "', '" + req.body.Category + "', '" + req.body.Title + "', '" + req. body.Content + "', '" + req.body.AdditionalContent + "')", function(err, rows, fields) {
      if(err) {
        console.log(err);
        res.writeHead(403);
        res.write("Submission unsuccessful. Please try again.");
        res.end();
        return;
      }
      res.send("Submission successful!");
    })

  }

}

exports.leaderboard = function(connection) {

  return function(req, res) {

    connection.query("SELECT Name, Points from Users ORDER BY Points DESC LIMIT 10", function(err, rows, fields) {
      if(err) {
        res.writeHead(403);
        res.write("There was an internal server error.");
        res.end();
      }
      else {
        res.writeHead(200);
        res.write(JSON.stringify(rows));
        res.end();
      }
    })
  }
}
