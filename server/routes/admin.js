const express = require("express");
const router = express.Router();
const serverInfo = require('./../server.js');
const session = serverInfo.session;
const db = serverInfo.db;

router.get("/addQuestions", (req, res) => {
    if (!req.session.userId)
        res.redirect('/users/login');
    else {
        res.render("adminAddQuestions", {
            results: undefined
        });
    }
});

function insertTrueFalse(req, res) {
    var question = req.body.question;
    var answer;
    var questionId = req.body.questionId;
    console.log(req.body);
    var type = req.body.TypeOfQuestion;
    if (req.body.isTrueCorrect == undefined)
        answer = "true";
    else
        answer = "false";
     //   INSERT INTO table(c1,c2,...) VALUES (v1,v2,...);
   // var sqlQuery = `INSERT INTO question(Answer) VALUES (?);`;
    db.query(`INSERT INTO question(Answer, Question, TypeOfQuestion) VALUES (?, ?, "True False");`, [answer, question, type], (req, res, error) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Added t/f question");
        console.log(req);
    });

    var pass;
    db.query(`SELECT * FROM question;`, (req, res, error )=>{
        if(error) console.log(error);
        //console.log(res);
        //console.log(req);
        //console.log(res[0]);
        pass = res[1];
       // console.log(pass);
    });
    res.render("adminAddQuestions", {
        results: pass
    });
}


function insertMC(req){
    var quest = req.body.question;
   // if(isACorrect) // NEED TO FINISH
    //if()
    //var ans = req.body.ans;
    //var sqlQuery = `INSERT INTO question (TypeOfQuestion, Answer, Question)` +
     //   `VALUES(\"Multiple Choice\",\"${ans}\",\"${quest}\");`;

}


router.post("/questionSubmission", (req, res) => {
    console.log(req.body);
    if (req.body.isTF == "on") { // if it's a T/F question
        insertTrueFalse(req, res);
    } else { // if it's MC
        insertMC(req);
    }
});

module.exports = router;