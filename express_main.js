const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var sanitizeHTML = require('sanitize-html');
var template = require('./lib/template');

app.use(bodyParser.urlencoded({ extended: false }));

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

app.get('/page/:pageId', function(request, response) {
  fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHTML(title);
      var sanitizedDescription = sanitizeHTML(description, {
        allowedTags:['h1']
      });
      var list = template.list(filelist);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        `<a href="/create">create</a>
         <a href="/update/${sanitizedTitle}">update</a>
         <form action="/delete_process" method="post">
           <input type="hidden" name="id" value="${sanitizedTitle}">
           <input type="submit" value="delete">
         </form>`
        );
      response.send(html);
    })
  })
});

app.get('/create', function(request, response) {
  fs.readdir('./data', function(error, filelist) {
    var title = 'WEB - create';
    var list = template.list(filelist);
    var html = template.HTML(title, list,
      `<form action="/create_process" method="post">
         <p><input type="text" name="title" placeholder="title"></p>
         <p><textarea name="description" placeholder="description"></textarea></p>
         <p><input type="submit"></p>
       </form>
      `, '');
    response.send(html);
  })
});

app.post('/create_process', function(request, response) {
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(error) {
    response.redirect(302, `/page/${title}`);
  })
});

app.get('/update/:pageId', function(request, response) {
  fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(error, description) {
      var title = request.params.pageId;
      var list = template.list(filelist);
      var html = template.HTML(title, list,
        `<form action="/update_process" method="post">
           <input type="hidden" name="id" value="${title}">
           <p><input type="text" name="title" placeholder="title" value="${title}"></p>
           <p><textarea name="description" placeholder="description">${description}</textarea></p>
           <p><input type="submit"></p>
         </form>
        `, `<a href="/create">create</a> <a href="/update/${title}">update</a>`
        );
      response.send(html);
    })
  })
});

app.post('/update_process', function(request, response) {
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error) {
    fs.writeFile(`data/${title}`, description, 'utf8', function(error) {
      response.redirect(302, `/page/${title}`);
    })
  })
});

app.post('/delete_process', function(request, response) {
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error) {
    response.redirect(302, `/`);
  })
});

app.listen(port, function() {
  console.log(`Example app listening at http://localhost:${port}`);
});
