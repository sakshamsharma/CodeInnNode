var spawn = require('child_process').spawn,
    exec  = require('child_process').exec,
    fs    = require('fs')

exports.saveCode = function(curtime, content, callback) {

  fs.writeFile("./cpp/" + curtime + ".cpp", new Buffer(content, 'base64'), function(err) {
    if (err) return callback(1);
    console.log('File written ' + curtime + '.cpp');
    return callback(0);
  })
}

exports.deleteCode = function(curtime) {

  fs.unlink("./cpp/" + curtime + ".cpp", function(err) {
    if(err) console.log(curtime + ".cpp not deleted");
    else fs.unlink("./cpp/" + curtime + ".o", function(err) {
      if(err) console.log(curtime + ".o not deleted");
      else console.log("Files for " + curtime + " cleaned up.");
    })
  })
}

exports.compileCode = function(curtime, callback) {

  var err = '';
  var compiler = spawn('g++', ['cpp/' + curtime + '.cpp', '-o', 'cpp/' + curtime + '.o'])

  compiler.stderr.on('data', function(buffer) {
    err += buffer.toString();
  })

  compiler.on('close', function(code) {
    return callback(code, err);
  })
}

exports.runCode = function(curtime, input, callback) {

  fs.writeFile("./cpp/" + curtime + ".i", input, function(err) {

    var child = exec('./cpp/' + curtime + '.o < cpp/' + curtime + '.i', function(error, stdout, stderr) {
      
      if (error !== null) {
        console.log('exec error: ' + error);
        callback(1, stdout, stderr);
      }
      else
        callback(0, stdout, stderr);

      fs.unlink("./cpp/" + curtime + ".i", function(err) {
        console.log("Deleted " + curtime + ".i");
      });

    })
  })

}
