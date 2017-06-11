const app = require('express').Router();
const multipart = require('connect-multiparty');
var expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const multipartMiddleware = multipart();
const firebase = require('firebase');

var database = firebase.database();

//Route Experiences
app.get('/', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('experiences').once('value').then(function(snap){
					console.log(snap.val());
					res.render('experiences/index', {loginUser: user, data: snapshot.val(), experiences: snap.val() });
				}, function(err){
					console.log(err);
					res.redirect('/dashboard')
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
				res.render('experiences/add', {loginUser: user, data: snapshot.val() });
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
				company: req.body.company,
				company_address: req.body.company_address,
				position: req.body.position,
				year: req.body.year,
				description: req.body.description
			}

			database.ref().child('profiles').child(user.uid).child('experiences').push(postData).then(function(){
				res.redirect('/experiences');
			}, function(error){
				console.log(error.message);
				res.redirect('/experiences/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/edit/:experienceId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('experiences').child(req.params.experienceId)
				.once('value').then(function(snap){
					console.log(snap.val());
					res.render('experiences/edit', {loginUser: user, data: snapshot.val(), experience: snap.val() });
				})
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.post('/edit/:experienceId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var postData = {
				company: req.body.company,
				company_address: req.body.company_address,
				position: req.body.position,
				year: req.body.year,
				description: req.body.description
			}

			database.ref().child('profiles').child(user.uid).child('experiences').child(req.params.experienceId).set(postData)
			.then(function(){
				res.redirect('/experiences');
			}, function(error){
				console.log(error.message);
				res.redirect('/experiences/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/delete/:experienceId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			database.ref().child('profiles').child(user.uid).child('Experiences').child(req.params.experienceId).remove()
			.then(function(){
				res.redirect('/experiences');
			}, function(error){
				console.log(error.message);
				res.redirect('/experiences');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

module.exports = app;