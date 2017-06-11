const app = require('express').Router();
const multipart = require('connect-multiparty');
var expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const multipartMiddleware = multipart();
const firebase = require('firebase');

var database = firebase.database();

//Route projects
app.get('/', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('projects').once('value').then(function(snap){
					console.log(snap.val());
					res.render('projects/index', {loginUser: user, data: snapshot.val(), projects: snap.val() });
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
				res.render('projects/add', {loginUser: user, data: snapshot.val() });
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
				project: req.body.project,
				description: req.body.description
			}

			database.ref().child('profiles').child(user.uid).child('projects').push(postData).then(function(){
				res.redirect('/projects');
			}, function(error){
				console.log(error.message);
				res.redirect('/projects/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/edit/:projectId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('projects').child(req.params.projectId)
				.once('value').then(function(snap){
					console.log(snap.val());
					res.render('projects/edit', {loginUser: user, data: snapshot.val(), project: snap.val() });
				})
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.post('/edit/:projectId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var postData = {
				project: req.body.project,
				description: req.body.description
			}

			database.ref().child('profiles').child(user.uid).child('projects').child(req.params.projectId).set(postData)
			.then(function(){
				res.redirect('/projects');
			}, function(error){
				console.log(error.message);
				res.redirect('/projects/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/delete/:projectId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			database.ref().child('profiles').child(user.uid).child('projects').child(req.params.projectId).remove()
			.then(function(){
				res.redirect('/projects');
			}, function(error){
				console.log(error.message);
				res.redirect('/projects');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

module.exports = app;