var express = require('express')
var app = express();
var path = require('path');

app.use(express.static('dist'));

// All routes should redirect to the index.html
app.route('/*')
  .get((req, res) => {
    res.sendFile(path.resolve(path.normalize(__dirname) + '/dist/index.html'));
  });

app.listen(process.env.PORT || 3001);
