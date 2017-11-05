var express = require('express');
var morgan = require('morgan');

var app = express();
app.use(morgan('tiny'));

// init database connection
var mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/healthdata', {
  useMongoClient: true
});

// Loading models
var County = require('./api/models/counties');

// init routes
var countiesRoutes = require('./api/routes/counties');
countiesRoutes(app);

// 404 message simple middleware
app.use((request, response) => {
  response.status(404).send({url: request.originalUrl + ' not found'});
});

var port = 3001;
const server = app.listen(port, () => {
  console.log('Health Data API server started in port '+port);
});