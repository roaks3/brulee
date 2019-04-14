const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const api = require('./api/dist');

app.use(bodyParser.json());
app.use('/api', cors(), api.router);

// Routes transitioned to the react app should redirect to the react index.html
app.route('/react_app')
  .get((req, res) => {
    res.sendFile(path.resolve(path.normalize(__dirname) + '/react_app/build/index.html'));
  });

app.use(express.static('dist'));
app.use(express.static('react_app/build'));

// All routes should redirect to the index.html
app.route('/*')
  .get((req, res) => {
    res.sendFile(path.resolve(path.normalize(__dirname) + '/dist/index.html'));
  });

app.listen(process.env.PORT || 9000);
