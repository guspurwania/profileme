const app = require('express').Router();
const multipart = require('connect-multiparty');
var expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const multipartMiddleware = multipart();
const firebase = require('firebase');

var database = firebase.database();

//Route interests
app.get('/', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('interests').once('value').then(function(snap){
					console.log(snap.val());
					res.render('interests/index', {loginUser: user, data: snapshot.val(), interests: snap.val() });
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
				res.render('interests/add', {loginUser: user, data: snapshot.val() });
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
				interest: req.body.interest
			}

			database.ref().child('profiles').child(user.uid).child('interests').push(postData).then(function(){
				res.redirect('/interests');
			}, function(error){
				console.log(error.message);
				res.redirect('/interests/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/edit/:interestId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var dataNew = database.ref('profiles/' + user.uid);
			dataNew.once('value').then(function(snapshot){
				database.ref().child('profiles').child(user.uid).child('interests').child(req.params.interestId)
				.once('value').then(function(snap){
					console.log(snap.val());
					res.render('interests/edit', {loginUser: user, data: snapshot.val(), interest: snap.val() });
				})
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.post('/edit/:interestId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			var postData = {
				interest: req.body.interest
			}

			database.ref().child('profiles').child(user.uid).child('interests').child(req.params.interestId).set(postData)
			.then(function(){
				res.redirect('/interests');
			}, function(error){
				console.log(error.message);
				res.redirect('/interests/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

app.get('/delete/:interestId', function(req, res){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			database.ref().child('profiles').child(user.uid).child('interests').child(req.params.interestId).remove()
			.then(function(){
				res.redirect('/interests');
			}, function(error){
				console.log(error.message);
				res.redirect('/interests/add');
			})
		}
		else
		{
			res.redirect('/login');
		}
	});
})

module.exports = app;