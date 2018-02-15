const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '../client/static/index.html'), 'utf8', (err, data) => {
    res.send(data);
  })
});
app.use(express.static(path.join(__dirname, '../client/static'))); //css
app.get(/\/fonts\/.*\.ttf/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client', req.url));
});
app.get('/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.js'));
});



// API
app.get('/namespaces', (req, res) => {
  let obj = {};
  fs.readdir(path.join(__dirname, 'ARDOC'), (err, files) => {
    files.forEach( (elem) => {
      obj[elem] = fs.readdirSync(path.join(__dirname, 'ARDOC', elem));
    });
    res.send(JSON.stringify(obj));
  });
});



app.listen(8080, () => {
  console.log('server started');
});