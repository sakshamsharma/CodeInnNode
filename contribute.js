exports.contribute= function(connection) {

  return function(req, res) {

    connection.query("INSERT into Contributions values('" + req.body.Username + "', '" + req.body.Category + "', '" + req.body.Title + "', '" + req. body.Content + "', '" + req.body.AdditionalContent + "')", function(err, rows, fields) {
      if(err) {
        res.writeHead(403);
        res.write("Submission unsuccessful. Please try again.");
        res.end();
        return;
      }
      res.send("Submission successful!");
    })

  }

}
