const app = require('express').Router();
const multipart = require('connect-multiparty');
var expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const multipartMiddleware = multipart();
const firebase = require('firebase');

var database = firebase.database();

//Route Educations
app.get('/', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('educations').once('value').then(function(snap){
					console.log(snap.val());
					res.render('educations/index', {loginUser: user, data: snapshot.val(), educations: snap.val() });
				})
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/add', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				res.render('educations/add', {loginUser: user, data: snapshot.val() });
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.post('/add', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var postData = {
				title: req.body.title,
				institution: req.body.institution,
				year: req.body.year
			}

			database.ref().child('profiles').child(user.uid).child('educations').push(postData).then(function(){
				res.redirect('/educations');
			}, function(error){
				console.log(error.message);
				res.redirect('/educations/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/edit/:educationId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('educations').child(req.params.educationId)
				.once('value').then(function(snap){
					console.log(snap.val());
					res.render('educations/edit', {loginUser: user, data: snapshot.val(), education: snap.val() });
				})
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.post('/edit/:educationId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var postData = {
				title: req.body.title,
				institution: req.body.institution,
				year: req.body.year
			}

			database.ref().child('profiles').child(user.uid).child('educations').child(req.params.educationId).set(postData)
			.then(function(){
				res.redirect('/educations');
			}, function(error){
				console.log(error.message);
				res.redirect('/educations/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/delete/:educationId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			database.ref().child('profiles').child(user.uid).child('educations').child(req.params.educationId).remove()
			.then(function(){
				res.redirect('/educations');
			}, function(error){
				console.log(error.message);
				res.redirect('/educations/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

module.exports = app;