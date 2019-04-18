
const serverInfo = require('./../server.js');
const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const bodyParser = require('body-parser');
const session = serverInfo.session;

 user = null;
 userId = null;
 

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
	if (req.session.userId != undefined){
		res.render('adminPage'); 	
	}
	else
		res.render('loginPage'); // to access this page go to /users/login
});

router.get("/register", (req, res) => {
	if (req.session.userId){
		res.render('adminPage'); 	
	}
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
		req.session.userId = result[0].UserProfileId;
		return res.render("adminPage");
	});
});


router.get('/about', (req, res) => {
	res.render('aboutPage');
});

router.post('/sublogin', (req, res) => {
	let userName = req.body.username;
	let passWord = req.body.password;
	let sqlQuery = 'SELECT * FROM userprofile WHERE Name="' + userName + '";';
	db.query(sqlQuery, (error, result) => {
		if (error) console.log(error);
		else {
			if (result.length == 0) {
				// User doesn't exist
				let errorMsg = "We don't recognize that username. Please register";
				return res.render('loginPage', {
					errorMsg
				});
			} else {
				user = userName;
				for (let i = 0; i < result.length; i++) {
					if (passWord == result[i].Password) {
						req.session.userId = result[i].UserProfileId;
						userId = result[i].UserProfileId;
						return res.render("adminPage");
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

router.get('/home', (req, res) => {

	let sqlQuery = 'SELECT * FROM test WHERE UserProfileId ="'+ userId + '";';
	//let sqlQuery_status = 'SELECT  UserStatus FROM test;';
	//let sqlQuery_testid = 'SELECT TestId FROM test;';
	var exams_incomplete = new Array();
	var exams_complete = new Array();
	// var testids = new Array();
	// var statuses =  new Array();
	//var userids = new Array() ;
	
	//console.log("user profile id is"+ userId);
	db.query(sqlQuery, (err, status)  => {
	
			if (err) throw err;
			for (let i =0 ;  i< status.length; i++){

				if (status[i].UserStatus == "incomplete"){
					exams_incomplete.push(status[i].TestId);
					console.log("hello " + exams_incomplete[1]);
				}
				if(status[i].UserStatus == "complete")
				{
					exams_complete.push(status[i].TestId);
					console.log("hello  yo" + exams_complete[0]);
				}
				//console.log("ew");
			}
			//statuses = status;
			console.log("yooooooooo "+ status.length);
			res.render('userhome', {username: user, examstoTake: exams_incomplete, examsComplete: exams_complete});
		
	  });
	
	//console.log("tretgf "+ exams_complete.length);
	//   db.query(sqlQuery_testid, (err, testid)  => {
	// 	if (err) throw err;

	// 	for (let i =0 ;  i< testid.length; i++){
	// 		testids[i] = testid[i];
	// 	}
	// 		//testids = testid;
	//   });
	
	   
	// db.query(sqlQuery_user, (err, users) => {
	// 	if (err) throw err;

	// 	for (let i =0 ;  i< users.length; i++){
	// 		userids[i] = users[i];
	// 	}
	//	userids = users;
	
		
		
		//	console.log("yerr else");
	
		
			
		
	//});
	
	
//	console.log("gijufhjdi " + userids.length);
	
//	console.log("gijufhjdi" + statuses.length);
	
//	console.log("gijufhjdi" + testids.length);
	
	// for( let i= 0; i < userids.length; i++){
			
	// 	console.log("gijufhjdi" + userids.length);
	// 	if (usersids[i].UserProfileId == 0){
			
	// 	console.log("In if statement "+ statuses[i].UserStatus);
	// 	// console.log("hhefu ");
	// 		if(statuses[i].UserStatus == 'incomplete'){
			
	// 			console.log(testids[i]);
	// 			exams_incomplete.concat(testids[i]);
	// 		}
	// 		else
	// 			exams_complete.push(testids[i]);
	// 		}
	// 	}
//		console.log(exams_incomplete);
//		console.log(exams_complete);
	//	res.render('userhome', {username: user, examstoTake: exams_incomplete, examsComplete: exams_complete});
	
	
	
		
		
	
	});

	function store(quizC, quizIC){

	}
//queries question/choices
router.get('/QuizPage', (req, res) => {
	var id = req.session.userId;
	console.log(id);
	db.query("SELECT * FROM question JOIN choices on question.questionid=choices.questionid;",(request,results,error) => {

		//join statements to userprofile table, add after choices.questionid, not working needs to be fixed.
		//JOIN test on test.testid=question.testid JOIN userprofile on userprofile.userprofileid=test.userprofileid;
		if(error){
			console.log(error);
		}

		res.render("QuizPage",{results: results})
	})

});


router.post("/Grade", (req, res) => {
    insertGrade(req, res);
});


//write the proper grade for the question
function insertGrade(req, res) {
    var question = req.body.question;
    var answer;
    var questionId = req.body.questionId;

    console.log(req.body);
    var type = req.body.TypeOfQuestion;
    if (req.body.isTrueCorrect == undefined)
        answer = "true";
    else
		answer = "false";
		
    var type = req.body.TypeOfQuestion;
    if (req.body.isTrueCorrect != undefined)
        answer = "true";
    else
        answer = "false";

    db.query(`INSERT INTO question(Answer, Question, TypeOfQuestion) VALUES (?, ?, "True False");`, [answer, question, type], (req, res, error) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Added t/f question");
        console.log(req);
    });
}

module.exports = router;