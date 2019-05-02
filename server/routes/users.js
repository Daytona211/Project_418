const serverInfo = require('./../server.js');
const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const bodyParser = require('body-parser');
const session = serverInfo.session;

user = null;
userId = null;
exams_incomplete = new Array();
exams_complete = new Array();

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

router.get('/', (req, res) => {
	res.render('welcomePage');
});

router.get('/login', (req, res) => {
	if (req.session.userId != undefined) {
		if (req.session.admin) {
			db.query('SELECT * FROM TestStatus JOIN UserProfile ON UserProfile.UserProfileId=TestStatus.UserProfileId;',(req,testStatus)=>{
				db.query(`SELECT * FROM Test;`, (req1, results) => {
				db.query('SELECT * FROM UserProfile',(req3,users)=>{
					console.log(results);
					return res.render('adminPage', {
						results: results,
						testStatus: testStatus,
						users: users
					});
				});
			});
		});
		} else {
			return res.redirect(`/users/home`);
		}
	} else res.render('loginPage'); // to access this page go to /users/login
});

router.get('/register', (req, res) => {
	if (req.session.userId) {
		if (req.session.admin) {
			db.query('SELECT * FROM TestStatus JOIN UserProfile ON UserProfile.UserProfileId=TestStatus.UserProfileId;',(req,testStatus)=>{
				db.query(`SELECT * FROM Test;`, (req1, results) => {
				db.query('SELECT * FROM UserProfile',(req3,users)=>{
					console.log(results);
					return res.render('adminPage', {
						results: results,
						testStatus: testStatus,
						users: users
					});
				});
			});
		});
		} else {
			return res.redirect(`/users/home`);
		}
	} else res.render('registerPage');
});

router.post('/registers', (req, res) => {
	console.log('sss');
	//res.render("registerPage"); // to access this page go to /users/register
	var username = req.body.username;
	var password = req.body.password;
	user = username;
	db.query(`INSERT INTO userprofile(Name, Password) VALUES (?, ?)`, [username, password]);
	db.query('SELECT * FROM userprofile WHERE Name="' + username + '";', (error, result) => {
		// if(error) throw error;
		req.session.userId = result[0].UserProfileId;
		req.session.admin = 0;
		return res.render('userhome', {
			userName: user,
			examsComplete: exams_complete,
			examstoTake: exams_incomplete
		});
	});
});

router.get('/about', (req, res) => {
	res.render('aboutPage');
});


// 7,8,12,20,29,30,34,40,42,43
// 7,8,12,20,29,30,34,40,42,43
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
						console.log(result[i]);
						if (result[i].isAdmin == 1) {
							req.session.admin = 1;
							db.query('SELECT * FROM TestStatus JOIN UserProfile ON UserProfile.UserProfileId=TestStatus.UserProfileId;',(req,testStatus)=>{
								db.query(`SELECT * FROM Test;`, (req1, results) => {
								db.query('SELECT * FROM UserProfile',(req3,users)=>{
									console.log(results);
									return res.render('adminPage', {
										results: results,
										testStatus: testStatus,
										users: users
									});
								});
							});
						});
						} else {
							req.session.admin = 0;
							return res.redirect('/users/home');
						}
					}
				}
			}
		}
	});
});

router.get('/home', (req, res) => {
	var id = req.session.userId;
	var exams_incomplete = new Array();
	var exams_complete = new Array();
// <<<<<<< zach
// 	db.query('SELECT * FROM Test JOIN TestStatus ON Test.TestId=TestStatus.TestId WHERE teststatus.UserProfileId=' + id + ';', (error, results) => {
// 		if (error) {
// 			console.log(error);
// 		}

// // // <<<<<<< rich
// // 				exams_incomplete.push(results[i]);
// =======
	db.query(`SELECT * FROM Test`, (req1, res1) => {
		db.query('SELECT * FROM Test JOIN TestStatus ON Test.TestId=TestStatus.TestId WHERE teststatus.UserProfileId=' + id + ';', (error, results) => {
			if (error) {
				console.log(error);
			}
			console.log(results);
			console.log("==========");
			console.log(res1);
			var touchedTests = [];
			for (var i = 0; i < results.length; i++)
				touchedTests.push(results[i].TestId);
			var untouchedTests = [];
			for (var i = 0; i < res1.length; i++) {
				if (!touchedTests.includes(res1[i].TestId))
					untouchedTests.push(res1[i]);
			}

			console.log(untouchedTests);
			// // <<<<<<< rich
			// 				exams_incomplete.push(results[i]);
			for (let i = 0; i < results.length; i++) {
				if (results[i].TestStatus == 0) {
					exams_incomplete.push(results[i]);

				} else {
					exams_complete.push(results[i]);
				}

			}
			res.render('userhome', {
				examstoTake: untouchedTests,
				examsComplete: exams_complete,
				userName: user
			})
		})
	});
});

router.get('/quizResults', (req, res) => {

// <<<<<<< abe
// 	var testid = req.session.TestId;
// 	db.query(
// 		'SELECT * FROM QuestionsForTest JOIN Question on QuestionsForTest.QuestionId=Question.QuestionId JOIN Choices ON Question.QuestionId=Choices.QuestionId WHERE TestId= ?',
// 		[12],
// 		(request, results, error) => {
// 			db.query('SELECT * FROM UserAnswers WHERE TestId = ? AND UserProfileId=?', [12, 5], (request, answer, error1) => {
// 				db.query('SELECT TestTitle FROM TEST WHERE TestId = ?', [12], (req1, testtitle, error2) => {
// 					console.log(answer);
// =======
// 	res.render("quizResults", {
// 		userName: user,
// 		examName: null
// 	})
	var id;
	if(req.session.admin == 1){
		id = req.query.userId;
	}else{
		id = req.session.userId;
	}
	var testid = req.query.TestId;
	db.query(
		'SELECT * FROM QuestionsForTest JOIN Question on QuestionsForTest.QuestionId=Question.QuestionId JOIN Choices ON Question.QuestionId=Choices.QuestionId WHERE TestId= ?',
		[testid],
		(request, results, error) => {
			db.query('SELECT * FROM UserAnswers WHERE TestId = ? AND UserProfileId=?', [testid, id], (request, answer, error1) => {
				db.query('SELECT TestTitle FROM TEST WHERE TestId = ?', [testid], (req1, testtitle, error2) => {
					console.log(answer);
					console.log(testtitle);
// >>>>>>> testing
					res.render('quizResults', {
						results: results,
						answer: answer,
						testtitle: testtitle
					});
				});
			});
// <<<<<<< abe
// <<<<<<< zach
// 		}
// =======
		})
	});

	//res.render("quizResults", {userName: user, examName: null})
// =======
// 		for (let i = 0; i < results.length; i++) {
// 			if (results[i].TestStatus == 0) {
// 				exams_incomplete.push(results[i].TestTitle);
// 			} else {
// 				exams_complete.push(results[i].TestTitle);
// 			}
// 		}
// 	})
// >>>>>>> testing


// 	res.render("quizResults", {userName: user, examName: null})
// });

//queries question/choices
router.get('/QuizPage', (req, res) => {
	console.log(req.session)
	var userid = req.session.userId;
	var testid = req.query.TestId;
	req.session.testId = testid;
	db.query(
		'SELECT * FROM QuestionsForTest JOIN Question on QuestionsForTest.QuestionId=Question.QuestionId JOIN Choices ON Question.QuestionId=Choices.QuestionId WHERE TestId=' + testid + ';',
		(request, results, error) => {
			if (error) {
				console.log(error);
			}
			console.log(request)
			res.render('QuizPage', {
				results: results
			});
		}
	);
});

router.post('/QuizPage', (req, res1) => {
	var score = req.body.score;
	score = parseFloat(score);
	score = (score * 100).toFixed(2);

	var map = new Map();
	var useranswers = req.body.userchoices;
	for (let x = 0; x < useranswers.length; x++) {
		var buildanswer = '';
		while (x != useranswers.length) {
			if (
				useranswers.charAt(x) == '-' &&
				useranswers.charAt(x + 1) == '|' &&
				useranswers.charAt(x + 2) == '|' &&
				useranswers.charAt(x + 3) == '|' &&
				useranswers.charAt(x + 4) == '~' &&
				useranswers.charAt(x + 5) == '-'
			) {
				x += 6;
				break;
			}
			buildanswer += useranswers.charAt(x);
			x++;
		}
		var answerid = '';
		while (useranswers.charAt(x) != ' ') {
			answerid += useranswers.charAt(x);
			x++;
			if (x == useranswers.length) {
				break;
			}
		}
		answerid = parseInt(answerid);
		map.set(answerid, buildanswer);
	}

	var userid = req.session.userId;
	var testid = req.session.testId;
  
	if(req.session.testId)
		req.session.testId = undefined;
	db.query('INSERT INTO TestStatus(TestId, UserProfileId, TestStatus, Grade) VALUES (?,?,?,?);', [testid, userid, 1, score], (req, res, error) => {
		if (error) {
			console.log(error);
			return;
		}
	});

	for (let x of map.keys()) {
		let useranswer = map.get(x);
		let questionid = x;
		db.query('INSERT INTO UserAnswers(UserProfileId,TestId,QuestionId,UserAnswer) VALUES (?,?,?,?);', [userid, testid, questionid, useranswer], (req, res, error) => {
			if (error) {
				console.log(error);
				return;
			}
		});
	}

	return res1.redirect(`/users/home`);
});

module.exports = router;