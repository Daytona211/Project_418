const express = require("express");
const router = express.Router();
const serverInfo = require('./../server.js');
const session = serverInfo.session;
const db = serverInfo.db;

router.get("/addQuestions", (req, res) => {
    if (!req.session.userId)
        res.redirect('/users/login');
    else {
        db.query(`SELECT * FROM question;`, (request, result, error) => {
            if (error) console.log(error);
            res.render("adminAddQuestions", {
                results: result
            });
        });
    }
});

function insertTrueFalse(req, res) {
    var question = req.body.question;
    var answer;
    var questionId = req.body.questionId;
    var type = req.body.TypeOfQuestion;
    if (req.body.isTrueCorrect != undefined)
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
    });
    db.query(`SELECT * FROM question;`, (request, result, error) => {
        if (error) console.log(error);
        res.render("adminAddQuestions", {
            results: result
        });
    });
}


function insertMC(req, res) {
    var question = req.body.question;
    var answer = "";
    var type = req.body.TypeOfQuestion;
    if (req.body.isACorrect != undefined)
        answer += "A";
    if (req.body.isBCorrect != undefined)
        answer += ",B";
    if (req.body.isCCorrect != undefined)
        answer += ",C";
    if (req.body.isDCorrect != undefined)
        answer += ",D";
    db.query(`INSERT INTO question(Answer, Question, TypeOfQuestion) VALUES (?, ?, "Multiple Choice");`, [answer, question, type], (req, res, error) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Added MC question");
    });
    db.query(`SELECT * FROM question;`, (request, result, error) => {
        if (error) console.log(error);
        res.render("adminAddQuestions", {
            results: result
        });
    });
}


router.post("/questionSubmission", (req, res) => {
    if (req.body.isTF == "on") { // if it's a T/F question
        insertTrueFalse(req, res);
    } else { // if it's MC
        insertMC(req, res);
    }
});

module.exports = router;