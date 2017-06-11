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

//Route Profile
app.get('/', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				res.render('profile', {loginUser: user, data: snapshot.val() });
			})
		}
		else
		{
			res.redirect('login');
		}
	});
})

app.post('/edit', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			database.ref('profiles/' + user.uid).update({
	  			name: req.body.name, 
	  			position: req.body.position,
	  			phone: req.body.phone, 
	  			website: req.body.website,
	  			linkedin: req.body.linkedin, 
	  			github: req.body.github,
	  			facebook: req.body.facebook, 
	  			career: req.body.career
	  		}).then(function(){
	  			res.redirect('/profile');
	  		}, function(error){
	  			console.log(error.message);
	  			res.redirect('/profile');
	  		});
		}
		else
		{
			res.redirect('/login')
		}
	});
})

app.post('/image/edit', multipartMiddleware, function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var bucket = gcs.bucket('barberkita-d4b0e.appspot.com');
			var files = req.files.displayImage;
			if(files)
			{
				var dataNew = database.ref('profiles/' + user.uid);
				dataNew.once('value').then(function(snapshot){
					bucket.file(snapshot.val().image).delete().then(function(){
						console.log('Image deleted');
						uploadImage();
					}, function(err){
						console.log(err.message);
					})
				});
			}

			function uploadImage()
			{
				bucket.upload(files.path, function(err, file) {
					if (err) {
				    	console.log("Can't Upload!");
				  	}
				  	else
				  	{
				  		database.ref('profiles/' + user.uid).update({
				  			photo: file.metadata.mediaLink, 
				  			image: file.metadata.name
				  		}).then(function(){
				  			console.log('Image Saved');
				  			res.redirect('/profile');
				  		}, function(err){
				  			console.log(err.message);
				  			res.end('Error Upload');
				  		})
				  		console.log("Image Uploaded!");
				  	}
				});
			}

		}
		else
		{
			res.redirect('login');
		}
	});
})

app.post('/email/edit', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			database.ref('profiles/' + user.uid).update({email: req.body.email}).then(function(){
				console.log("Data Saved!");
			}, function(error){
				console.log(error.message);
			});

			user.updateEmail(req.body.email).then(function() {
				console.log("Email Updated!");
			}, function(error) {
				console.log(error.message);
			});

			res.redirect('/profile');
		}
		else
		{
			res.redirect('login');
		}
	});
})

app.post('/password/edit', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var newPassword = req.body.password;

			user.updatePassword(newPassword).then(function() {
				console.log('Password Updated!');
			}, function(error) {
				console.log(error.message);
			});

			res.redirect('/profile');
		}
		else
		{
			res.redirect('login');
		}
	});
})

module.exports = app;