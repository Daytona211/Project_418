const express = require("express");
const router = express.Router();
const serverInfo = require('./../server.js');
const session = serverInfo.session;
const db = serverInfo.db;

router.get("/addQuestions", (req, res) => {
    if (!req.session.userId)
        res.redirect('/users/login');
    else {
        res.render("adminAddQuestions");
    }
});

function insertTrueFalse(req) {
    var quest = req.body.question;
    var ans;
    if (req.body.isTrueCorrect == undefined)
        ans = "true";
    else
        ans = "false";
    var sqlQuery = `INSERT INTO question (TypeOfQuestion, Answer, Question)` +
        `VALUES(\"T/F\",\"${ans}\",\"${quest}\");`;
    db.query(sqlQuery, (req, res, error) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Added t/f question");
    });
    res.redirect("adminAddQuestions");
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
        insertTrueFalse(req);
    } else { // if it's MC
        insertMC(req);
    }
});

module.exports = router;