var execute = require('./execute.js'),
    helpers = require('./helpers.js')

exports.compile = function(req, res) {
  
  var curtime = new Date().getTime();

  execute.saveCode(curtime, req.query.Content, function(sCode) {
    if(sCode != 0) {
      // If saving returned an error
      res.writeHead(403);
      res.write("There was an internal error.");
      res.end();
    }
    else {
      // Saved fine, go ahead with compile
      execute.compileCode(curtime, function(cCode, cErr) {
        if(cCode != 0) {
          // If there was a compilation error
          res.writeHead(403);
          res.write("Compilation error:\n" + cErr);
          res.end();
        }
        else {
          // Compiled fine
          res.writeHead(200);
          res.write("Compiled successfully!");
          res.end();
        }
        execute.deleteCode(curtime);
      })
    }
  });

}

exports.run = function(req, res) {
  
  var curtime = new Date().getTime();

  execute.saveCode(curtime, req.query.Content, function(sCode) {
    if(sCode != 0) {
      // If saving returned an error
      res.writeHead(403);
      res.write("There was an internal error.");
      res.end();
    }
    else {
      // Saved fine, go ahead with compile
      execute.compileCode(curtime, function(cCode, cErr) {
        if(cCode != 0) {
          // If there was a compilation error
          res.writeHead(403);
          res.write("Compilation error:\n" + cErr);
          res.end();
        }
        else {
          // Compiled fine, go ahead with running
          execute.runCode(curtime, req.query.Input, function(rCode, rOut, rErr) {
            if(rCode != 0) {
              // If there was a runtime error or TLE
              res.writeHead(403);
              if(rErr == "TLE")
                res.write("Time limit exceeded. Perhaps you let an infinite loop run?");
              else
                res.write("Runtime error!");
              res.end();
            } 
            else {
              // No runtime error, send the stdout back
              res.writeHead(200);
              res.write(rOut);
              res.end();
            }
            execute.deleteCode(curtime);
          })
        }
      })
    }
  });

}

exports.verify = function(connection) {

  return function(req, res) {

    connection.query('SELECT * from ' + req.query.Table + 'Sol WHERE Id = ' + req.query.Id, function(err, rows, fields){
      if(err) {
        console.log("DB error");
        res.writeHead(403);
        res.write("DB error");
        res.end();
        return;
      }

      preInput  = new Buffer(rows[0].Input, 'base64');
      ob = new Buffer(rows[0].Output, 'base64').toString();
      preOutput = ob.trim().replace(/\s\s*$/gm, "");

      console.log("output: \n" + preOutput);

      var curtime = new Date().getTime();

      execute.saveCode(curtime, req.query.Content, function(sCode) {
        if(sCode != 0) {
          // If saving returned an error
          res.writeHead(403);
          res.write("There was an internal error.");
          res.end();
        }
        else {
          // Saved fine, go ahead with compile
          execute.compileCode(curtime, function(cCode, cErr) {
            if(cCode != 0) {
              // If there was a compilation error
              res.writeHead(403);
              res.write("Compilation error:\n" + cErr);
              res.end();
            }
            else {
              // Compiled fine, go ahead with running
              execute.runCode(curtime, preInput, function(rCode, rOut, rErr) {
                if(rCode != 0) {
                  // If there was a runtime error or TLE
                  res.writeHead(403);
                  if(rErr == "TLE")
                    res.write("Time limit exceeded. Perhaps you let an infinite loop run?");
                  else
                    res.write("Runtime error!");
                  res.end();
                } 
                else {
                  // No runtime error, compare the stdout with predefined-output
                  if( rOut.trim() == preOutput ) {
                    var response = "Correct submission! ";

                    // Update the DB to store that the problem has been successfully solved
                    helpers.addToList(connection, 'PPsolved', req.query.username, req.query.Id, function(code) {
                      if(code != 0 && code != -1)
                        response = response + "But the database was not updated. Please submit again.";
                      else if(code == -1)
                        response = response + "The particular problem has already been submitted";

                      res.writeHead(200);
                      res.write(response);
                      res.end();
                    })
                  }
                  else {
                    res.writeHead(403);
                    res.write("Incorrect submission, please try again.");
                    res.end();
                  }
                }
                execute.deleteCode(curtime);
              })
            }
          })
        }
      });

    })

  }
  
}
