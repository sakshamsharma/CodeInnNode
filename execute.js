var spawn = require('child_process').spawn,
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

  var out = '';
  var err = '';
  var running = 1;

  var execute = spawn('./cpp/' + curtime + '.o');

  execute.stderr.on('data', function(buffer) {
    err += buffer.toString();
  })

  execute.stdout.on('data', function(buffer) {
    out += buffer.toString();
  })

  execute.stdin.write(input + "\n");

  execute.on('close', function(code) {
    if(running) {
      running = 0;
      return callback(code, out, err);
    }
  })

  execute.stdout.on('end', function() {
    if(running) {
      running = 0;
      return callback(0, out, err);
    }
  })

  setTimeout(function() {
    if(running) {
      console.log("Timeout for " + curtime);
      running = 0;
      return callback(-1, '', 'TLE');
    }
    execute.kill();
  }, 1000);
}
