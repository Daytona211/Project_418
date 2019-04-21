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
		res.render('adminPage');
	} else
		res.render('loginPage'); // to access this page go to /users/login
});

router.get("/register", (req, res) => {
	if (req.session.userId) {
		res.render('adminPage');
	} else
		res.render("registerPage");
});

router.post('/registers', (req, res) => {
	console.log("sss");
	//res.render("registerPage"); // to access this page go to /users/register
	var username = req.body.username;
	var password = req.body.password;
	db.query(`INSERT INTO userprofile(Name, Password) VALUES (?, ?)`, [username, password]);
	db.query('SELECT * FROM userprofile WHERE Name="' + username + '";', (error, result) => {
		// if(error) throw error;
		req.session.userId = result[0].UserProfileId;
		req.session.admin = 0;
		return res.render("userhome", {userName: username, examsComplete: exams_complete, examstoTake: exams_incomplete});

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
							return res.render("adminPage")
						} else {
							req.session.admin = 0;

							
							console.log("hjfwjfgh");
							return res.redirect('/users/home');
						}
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
	db.query("SELECT * FROM question JOIN choices on question.questionid=choices.questionid;", (request, results, error) => {

		//JOIN test on test.testid=question.testid JOIN userprofile on userprofile.userprofileid=test.userprofileid;
		if (error) {
			console.log(error);
		}
		res.render("QuizPage", {
			results: results
		})
	})

});

router.post('/QuizPage', (req, res) => {
	
	var score = req.body.score;
	score = parseFloat(score)
	score = (score*100).toFixed(2);	

	
	var map = new Map();
	var useranswers=req.body.userchoices;
	for(let x=0; x<useranswers.length; x++){
		var buildanswer = "";
		while(x!=useranswers.length){
            if(useranswers.charAt(x)=="-" && useranswers.charAt(x+1)=="|" && useranswers.charAt(x+2)=="|" && useranswers.charAt(x+3)=="|" && useranswers.charAt(x+4)=="-"){
                x += 5;
                break;
            }
            buildanswer += useranswers.charAt(x);
            x++;
        }
        var answerid="";
        while(useranswers.charAt(x)!=" "){
            answerid += useranswers.charAt(x);
            x++;
            if(x==useranswers.length){
                break;
            }
        }
        answerid = parseInt(answerid);
        map.set(buildanswer,answerid);
    }
router.post("/Grade", (req, res) => {
	insertGrade(req, res);
});

	var userprofileid = req.body.UserProfileId;
	/* var testid = req.session.testid;
	var userid = req.session.userId; */

	console.log("score: "+ score);
	return;

	/* db.query(`INSERT INTO Grade(TestId, UserProfileId, Grade) VALUES (?,?,?);`, [testid, userid, score], (req, res, error) => {
		if (error) {
			console.log(error);
			return;
		}
		return res.render("");
	});	 */
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
