// Initialize Constructore & Component
const express = require('express');
const app = express();
const path = require('path');
// const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const firebase = require('firebase');
const fs = require('fs');
const gcs = require('@google-cloud/storage')({
	projectId: 'barberkita-d4b0e',
	keyFilename: 'BarberKita-440eedf916e0.json'
})

require('firebase/auth');
require('firebase/storage');

// Application Settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({ 
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(expressValidator());

// Firebase Initialization
var config = {
	apiKey: "AIzaSyDtRYsHeyYFym4zLqabWgPVU8kNqCFhOoQ",
    authDomain: "barberkita-d4b0e.firebaseapp.com",
    databaseURL: "https://barberkita-d4b0e.firebaseio.com",
    projectId: "barberkita-d4b0e",
    storageBucket: "barberkita-d4b0e.appspot.com",
    messagingSenderId: "169518771108"
};

firebase.initializeApp(config);
var routes = require('./routes/auth.js');
var profile = require('./routes/profile.js');
var educations = require('./routes/educations.js');
var languages = require('./routes/languages.js');
var interests = require('./routes/interests.js');
var experiences = require('./routes/experiences.js');
var projects = require('./routes/projects.js');
var skills = require('./routes/skills.js');

var database = firebase.database();
var storage = firebase.storage();

app.use('/', routes);
app.use('/profile', profile);
app.use('/educations', educations);
app.use('/languages', languages);
app.use('/interests', interests);
app.use('/experiences', experiences);
app.use('/projects', projects);
app.use('/skills', skills);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
// 	app.use(function(err, req, res, next) {
// 		res.status(err.status || 500); 
// 		res.render('error', { 
// 			message: err.message, 
// 			error: err 
// 		});
// 	});
// }

// // production error handler 
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
// 	res.status(err.status || 500); 
// 	res.render('error', { 
// 		message: err.message, 
// 		error: {} 
// 	});
// });

module.exports = app;
app.listen(process.env.PORT || 3000);