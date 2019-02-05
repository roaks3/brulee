const express = require('express');
const app = express();
const path = require('path');
const api = require('./api');

app.use('/api', api);

app.use(express.static('dist'));

// All routes should redirect to the index.html
app.route('/*')
  .get((req, res) => {
    res.sendFile(path.resolve(path.normalize(__dirname) + '/dist/index.html'));
  });

app.listen(process.env.PORT || 9000);
