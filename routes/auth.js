const app = require('express').Router();
const multipart = require('connect-multiparty');
var expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const multipartMiddleware = multipart();
const firebase = require('firebase');
var gcs = require('@google-cloud/storage')({
	projectId: 'barberkita-d4b0e',
	keyFilename: 'BarberKita-440eedf916e0.json'
})

require('firebase/auth');
require('firebase/storage');

var database = firebase.database();
var storage = firebase.storage();

// Route Home Page
app.get('/', function(req, res){
	database.ref('profiles').once('value').then(function(profile){
		res.render('index', {
			profile: profile.val()
		});
	});
})

app.get('/portfolio/:uid', function(req, res){
	var profile = database.ref('profiles/' + req.params.uid).once('value').then(function(profile){
		res.render('home', {
			profile: profile.val()
		});
	}, function(err){
		console.log(err);
		res.redirect('/')
	})
})

// Route Register
app.get('/register', function(req, res){
	var user = firebase.auth().currentUser;
	res.render('register', {loginUser: user});
})

app.post('/register', multipartMiddleware, function(req, res){
	firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(function(success){
		console.log(success.uid);
		var bucket = gcs.bucket('barberkita-d4b0e.appspot.com');
		var file = req.files.displayImage;

		bucket.upload(file.path, function(err, file) {
			if (err) {
		    	console.log("Can't Upload!");
		  	}
		  	else
		  	{
		  		console.log(file.metadata);
		  		var postData = {
					name: req.body.name,
					position: req.body.position,
					email: req.body.email,
					phone: req.body.phone,
					website: req.body.website,
					linkedin: req.body.linkedin,
					github: req.body.github,
					facebook: req.body.facebook,
					career: req.body.career,
					photo: file.metadata.mediaLink,
					image: file.metadata.name
				};

				database.ref('profiles/' + success.uid).set(postData).then(function(){
					firebase.auth().signOut().then(function(){
						res.redirect('login');
					});
				}, function(error){
					console.log(error.message);
				});

		  		console.log("Image Uploaded!");
		  	}
		});

	}, function(error){
		res.render('register', {message: error.message});
	});
})

//Route Login
app.get('/login', function(req, res){
	var user = firebase.auth().currentUser;
	if(user)
	{
		res.redirect('dashboard');
	}
	else
	{
		res.render('login', {loginUser: user});
	}
})

app.post('/login', function(req, res){
	firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(function(success){
		var user = firebase.auth().currentUser;
		res.redirect('dashboard');
	}, function(error){
		console.log(error.message);
		res.render('login', {message: error.message});
	});
})

//Route Logout
app.get('/logout', function(req, res){
	firebase.auth().signOut().then(function(){
		res.redirect('login');
	}, function(error){
		res.render('dashboard', {message: error.message});
	})
})

//Route Forgot Password
app.get('/forgot-password', function(req, res){
	var user = firebase.auth().currentUser;
	res.render('forgot', {loginUser: user});
})

app.post('/forgot-password', function(req, res){
	var auth = firebase.auth();
	var email = req.body.email;

	auth.sendPasswordResetEmail(email).then(function(){
		res.redirect('login');
	}, function(error){
		res.render('forgot', {message: error.message});
	})
})

// Route Dashboard
app.get('/dashboard', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				res.render('dashboard', {loginUser: user, data: snapshot.val() });
			})
		}
		else
		{
			res.redirect('login');
		}
	});
})

module.exports = app;

