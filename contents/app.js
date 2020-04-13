const express = require('express')
const app = express()
const port = 3000

// route, routing
// app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', function(req, res) {
  res.send('Hello World!');
})

app.get('/home', function(req, res) {
  res.send('homepage');
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
