const serverInfo = require('./../server.js');
const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const bodyParser = require('body-parser');
const session = serverInfo.session;
let user = null;

var exams = [
	{ name : "Intro to CS"}, 
	{ name :"Data Structures"},
	{ name : "Systems Programming"}, 
	{ name :"Object Oriented Programming"}, 
	//{ name :"Intro to Web Technologies"}
]

router.use(bodyParser.json());
router.use(
	bodyParser.urlencoded({
		extended: true
	})
);

// DATABASE SETUP
var db = serverInfo.db;

router.use(bodyParser.json());
router.use(
	bodyParser.urlencoded({
		extended: true
	})
);

router.get('/login', (req, res) => {
	console.log(req.session.userId);
	if (req.session.userId != undefined)
		res.render('adminAddQuestions', {results: undefined});
	else
		res.render('loginPage'); // to access this page go to /users/login
});

router.get("/register", (req, res) => {
	console.log(req.session.userId);
	if (req.session.userId)
		res.render('adminAddQuestions', {results: undefined});
	else
		res.render("registerPage");
});

router.post('/registers', (req, res) => {
	//res.render("registerPage"); // to access this page go to /users/register
	var username = req.body.username;
	var password = req.body.password;
	db.query(`INSERT INTO userprofile(Name, Password) VALUES (?, ?)`, [username, password]);
	db.query('SELECT * FROM userprofile WHERE Name="' + username + '";', (error, result) =>{
		// if(error) throw error;
		console.log(error);
		req.session.userId = result[0].UserProfileId;
		console.log(result[0].UserProfileId);
		console.log(req.session.userId);
		res.render('adminAddQuestions', {results: undefined});
	});
});

router.get('/about', (req, res) => {
	console.log(req.session);
	res.render('aboutPage');
});

router.get('/home', (req, res) => {

let sqlQuery_user = 'SELECT UserProfileId FROM test;';
let sqlQuery_status = 'SELECT  UserStatus FROM test;';
let sqlQuery_testid = 'SELECT TestId FROM test;';
var exams_incomplete = [];
var exams_complete = [];
var testids = new Array();
var statuses =  new Array() ;
var userids = new Array() ;

db.query(sqlQuery_status, (err, status)  => {

		if (err) throw err;
		statuses = status;
    
  });

  db.query(sqlQuery_testid, (err, testid)  => {
    if (err) throw err;
		testids = testid;
  });

   
db.query(sqlQuery_user, (err, users) => {
	if (err) throw err;
	userids = users;

	
	
	//	console.log("yerr else");

	
		
	
});


console.log("gijufhjdi " + userids.length);

console.log("gijufhjdi" + statuses.length);

console.log("gijufhjdi" + testids.length);

for( let i= 0; i < userids.length; i++){
		
//	console.log("gijufhjdi" + userids.length);
	if (usersids[i].UserProfileId == 0){
		
	console.log("In if statement "+ statuses[i].UserStatus);
	// console.log("hhefu ");
		if(statuses[i].UserStatus == 'incomplete'){
		
			console.log(testids[i]);
			exams_incomplete.concat(testids[i]);
		}
		else
			exams_complete.push(testids[i]);
		}
	}
	console.log(exams_incomplete);
	console.log(exams_complete);
	res.render('userhome', {username: user, examstoTake: exams_incomplete, examsComplete: exams_complete});



	
	

});

router.post('/sublogin', (req, res) => {
	let userName = req.body.username;
	let passWord = req.body.password;
	let sqlQuery = 'SELECT * FROM userprofile WHERE Name="' + userName + '";';
	user = userName;
	
	db.query(sqlQuery, (error, result) => {
		if (error) console.log(error);
		else {
			if (result.length == 0) {
				// User doesn't exist
				let errorMsg = "We don't recognize that username. Please register";
				res.render('loginPage', {
					errorMsg
				});
			} else {
				for (let i = 0; i < result.length; i++) {
					if (passWord == result[i].Password) {
						req.session.userId = result[i].UserProfileId;
						console.log(req.session);
						return res.render('userhome', {
						//return res.render('adminAddQuestions', {
							username: userName, examstoTake: exams, examsComplete: exams
						}); //TO FIX WITH PROPER ROUTE
					}
				}

				let errorMsg = "We don't recognize that password. Please try again";
				res.render('loginPage', {
					errorMsg
				});
			}
		}
	});
});






module.exports = router;