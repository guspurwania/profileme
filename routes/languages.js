const app = require('express').Router();
const multipart = require('connect-multiparty');
var expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const multipartMiddleware = multipart();
const firebase = require('firebase');

var database = firebase.database();

//Route languages
app.get('/', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('languages').once('value').then(function(snap){
					console.log(snap.val());
					res.render('languages/index', {loginUser: user, data: snapshot.val(), languages: snap.val() });
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
				res.render('languages/add', {loginUser: user, data: snapshot.val() });
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
				language: req.body.language,
				level: req.body.level
			}

			database.ref().child('profiles').child(user.uid).child('languages').push(postData).then(function(){
				res.redirect('/languages');
			}, function(error){
				console.log(error.message);
				res.redirect('/languages/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/edit/:languageId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('languages').child(req.params.languageId)
				.once('value').then(function(snap){
					console.log(snap.val());
					res.render('languages/edit', {loginUser: user, data: snapshot.val(), language: snap.val() });
				})
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.post('/edit/:languageId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var postData = {
				language: req.body.language,
				level: req.body.level
			}

			database.ref().child('profiles').child(user.uid).child('languages').child(req.params.languageId).set(postData)
			.then(function(){
				res.redirect('/languages');
			}, function(error){
				console.log(error.message);
				res.redirect('/languages/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/delete/:languageId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			database.ref().child('profiles').child(user.uid).child('languages').child(req.params.languageId).remove()
			.then(function(){
				res.redirect('/languages');
			}, function(error){
				console.log(error.message);
				res.redirect('/languages/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

module.exports = app;