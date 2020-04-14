const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var template = require('./lib/template');

app.get('/', function(request, response) {
  fs.readdir('./data', function(error, filelist) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
      );
    response.send(html);
  })
});

app.listen(port, function() {
  console.log(`Example app listening at http://localhost:${port}`);
});
