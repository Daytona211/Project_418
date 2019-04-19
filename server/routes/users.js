
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


module.exports = router;