const fs = require('fs');
const marked = require('marked');
marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
});

const path = require('path');
const pathToFolder = path.join(__dirname, '/ARDOC');

const module_name = process.argv[2];

let file = fs.readFileSync(path.join(pathToFolder, module_name, 'index.ardoc'), 'utf8');
let file_type = file.match(/@[^\r\n]*\r\n|@[^\r\n]*\r|@[^\r\n]*\n/)[0];
file = file.substr(file_type.length);

