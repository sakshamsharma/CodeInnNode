var fs = require('fs');
    sys = require('sys')
    exec = require('child_process').exec;
    spawn = require('child_process').spawn;

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

  var curtime = new Date().getTime();
  
  fs.writeFile("./cpp/" + curtime + ".cpp", new Buffer(req.query.Content, 'base64'), function(err) {
    if (err) return console.log(err);
    console.log("File written");

    exec("g++ cpp/" + curtime + ".cpp", function (error, stdout, stderr) {

      if(error) {
        res.writeHead(403);
        res.write(stderr);
        res.end();
      }
      else {
        res.writeHead(200);
        res.write("Compiled successfully");
        res.end();
      }

      fs.unlink("./cpp/" + curtime + ".cpp", function(err) {
        if(err) throw err;
        console.log("Deleted " + curtime + ".cpp");
      })

    });

  }) 

}


exports.run = function(req, res) {

  var curtime = new Date().getTime();
  //I2luY2x1ZGUgPGlvc3RyZWFtPg0KDQp1c2luZyBuYW1lc3BhY2Ugc3RkOw0KDQppbnQgbWFpbigpIHsNCglzdHJpbmcgbmFtZTsNCgljaW4gPj4gbmFtZTsNCgljb3V0IDw8ICJIZWxsbyAiIDw8IG5hbWUgPDwgZW5kbDsNCglyZXR1cm4gMDsNCn0NCg==

  fs.writeFile("./cpp/" + curtime + ".cpp", new Buffer(req.query.Content, 'base64'), function(err) {
    if (err) return console.log(err);
    console.log("File written");

    exec("g++ cpp/" + curtime + ".cpp", function (error, stdout, stderr) {

      if(error) {
        res.writeHead(403);
        res.write(stderr);
        res.end();
      }

      var child = spawn('./a.out');
      child.stdin.setEncoding = 'utf-8';
      child.stdout.pipe(res);
      child.stdin.write(req.query.Input + "\n");

      fs.unlink("./cpp/" + curtime + ".cpp", function(err) {
        if(err) throw err;
        console.log("Deleted " + curtime + ".cpp");
      })

    });

  }) 

}
