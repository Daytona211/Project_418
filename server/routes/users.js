
const serverInfo = require('./../server.js');
const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const bodyParser = require('body-parser');
const session = serverInfo.session;

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
	console.log("sss");
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
				for (let i = 0; i < result.length; i++) {
					if (passWord == result[i].Password) {
						req.session.userId = result[i].UserProfileId;
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


//queries question/choices
router.get('/QuizPage', (req, res) => {
	var id = req.session.userId;
	console.log(id);
	db.query("SELECT * FROM question JOIN choices on question.questionid=choices.questionid;",(request,results,error) => {

		//JOIN test on test.testid=question.testid JOIN userprofile on userprofile.userprofileid=test.userprofileid;
		if(error){
			console.log(error);
		}

		res.render("QuizPage",{results: results})
	})

});


router.post('/about', (req, res) => {
	console.log("hi");
	return res.render("");
	/* db.query(`INSERT INTO Grade(QuestionId, Grade) VALUES (?, ?);`, [answer, question], (req, res, error) => {
        if (error) {
            console.log(error);
            return;
		}
		return res.render("");
    }); */
});


module.exports = router;