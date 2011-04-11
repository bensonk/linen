var linen = require("./linen").linen;
var fs = require('fs');

var file = process.argv[2];
if(file) {
  if(file == '-') {
    // Read from stdin
    var stdin = process.openStdin();
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    var data = "";
    process.stdin.on('data', function (chunk) {
      data = data + chunk;
    });
    process.stdin.on('end', function() {
      console.log(linen(data));
    });
  }
  else {
    // Read from a file
    console.log(linen(fs.readFileSync(file, "ascii")));
  }
}
else {
  console.log("Usage: node cli.js <file.textile>");
}
