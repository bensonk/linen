var linen = require("./linen").linen;
var fs = require('fs');

var file = process.argv[2];
if(file) {
  console.log(linen(fs.readFileSync(file, "ascii")));
}
else {
  console.log("Usage: node cli.js <file.textile>");
}
