const app = require('express').Router();
const multipart = require('connect-multiparty');
var expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const multipartMiddleware = multipart();
const firebase = require('firebase');

var database = firebase.database();

//Route skills
app.get('/', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('skills').once('value').then(function(snap){
					console.log(snap.val());
					res.render('skills/index', {loginUser: user, data: snapshot.val(), skills: snap.val() });
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
				res.render('skills/add', {loginUser: user, data: snapshot.val() });
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
				skill: req.body.skill,
				value: req.body.value
			}

			database.ref().child('profiles').child(user.uid).child('skills').push(postData).then(function(){
				res.redirect('/skills');
			}, function(error){
				console.log(error.message);
				res.redirect('/skills/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/edit/:skillId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('skills').child(req.params.skillId)
				.once('value').then(function(snap){
					console.log(snap.val());
					res.render('skills/edit', {loginUser: user, data: snapshot.val(), skill: snap.val() });
				})
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.post('/edit/:skillId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var postData = {
				skill: req.body.skill,
				value: req.body.value
			}

			database.ref().child('profiles').child(user.uid).child('skills').child(req.params.skillId).set(postData)
			.then(function(){
				res.redirect('/skills');
			}, function(error){
				console.log(error.message);
				res.redirect('/skills/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/delete/:skillId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			database.ref().child('profiles').child(user.uid).child('skills').child(req.params.skillId).remove()
			.then(function(){
				res.redirect('/skills');
			}, function(error){
				console.log(error.message);
				res.redirect('/skills');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

module.exports = app;