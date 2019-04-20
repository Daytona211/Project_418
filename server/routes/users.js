
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
	var id = req.session.userId;
	var exams_incomplete = new Array();
	var exams_complete = new Array();

	
	db.query("SELECT * FROM Test JOIN TestStatus ON Test.TestId=TestStatus.TestId WHERE teststatus.UserProfileId=" + id + ";",(error,results) => {
	
			
		if(error){
			console.log(error);
		}

	
		for( let i = 0; i<results.length; i++){
			
				if(results[i].TestStatus == 0){

					exams_incomplete.push(results[i].TestTitle);

				}else{
					exams_complete.push(results[i].TestTitle);
				}
			}
		
		res.render("userhome",{examstoTake: exams_incomplete,examsComplete: exams_complete, userName: user})
	})

});


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
router.get("/results", (req, res) =>{

	res.render("quizResult", {userName: user})

});
module.exports = router;
