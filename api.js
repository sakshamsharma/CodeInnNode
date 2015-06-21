var sys = require('sys')
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

exports.query = function(connection) {

  return function(req, res) {

    connection.query('SELECT * from ' + req.query.Table + ' WHERE UNIX_TIMESTAMP(CreationDate) > ' + Number(Date.parse(req.query.Timestamp))/1000, function(err, rows, fields){
      if(err) throw err;
      res.writeHead(200, { 'Content-Type': 'application/json'  });
      res.write(JSON.stringify(rows));
      res.end();
    })

  }

}

exports.compile = function(req, res) {

  exec("g++ cpp/test.cpp", function (error, stdout, stderr) {
    var child = spawn('./a.out');
    child.stdin.setEncoding = 'utf-8';
    child.stdout.pipe(res);
    child.stdin.write("Saksham\n");
  });

}
