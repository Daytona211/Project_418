const express = require("express");
const router = express.Router();
const serverInfo = require('./../server.js');
const multer = require('multer')
const session = serverInfo.session;
const db = serverInfo.db;
var upload = multer({
    dest: 'uploads/'
});


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


router.get("/deleteQuestions", (req1, res1) => {
    if (!req1.session.userId)
        res1.redirect('/users/login');
    else {
        var id = req1.query.id;
        var displayErr = false;
        db.query(`SELECT * FROM question WHERE QuestionId=?`, [id], (req, res) => {
            if (!res[0].testId) { // if the question isn't in a test
                db.query(`DELETE FROM choices WHERE QuestionId=?`, [id], (req, res) => {
                    deleteQuestionAndRerender(id, res1);
                });
            } else {
                console.log("AAAA")
                // if is in a test render error
                db.query(`SELECT * FROM question;`, (req, res, error) => {
                    if (error) console.log(error);
                    res1.render("adminAddQuestions", {
                        results: res,
                        error: displayErr
                    });
                });
            }
        });
    }
});


function deleteQuestionAndRerender(id, renderingRes) {
    db.query(`DELETE FROM question WHERE QuestionId=${id}`, (req2, res2, err) => {
        db.query(`SELECT * FROM question;`, (req3, res3, error) => {
            if (error) console.log(error);
            renderingRes.render("adminAddQuestions", {
                results: res3,
                error: undefined
            });
        });
    })
}

router.post("/tfQuestionSubmission", (req, res) => {
    insertTrueFalse(req, res);
});
router.post("/mcQuestionSubmission", (req, res) => {
    insertMC(req, res);
});
router.post("/csvQuestionSubmission", upload.single('csvFile'), (req, res) => {
    insertCSV(req, res);
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
    console.log(req.body);
    var question = req.body.question;
    var answer = "";
    var choices = [];
    choices[0] = req.body.AAnswerBox;
    choices[1] = req.body.BAnswerBox;
    choices[2] = req.body.CAnswerBox;
    choices[3] = req.body.DAnswerBox;
    /*
{ question: 'Question',
  AAnswerBox: 'A answer',
  BAnswerBox: 'B answer',
  isCCorrect: 'on',
  CAnswerBox: 'C answer',
  DAnswerBox: 'D answer' } */
    //choices[0] = 
    var type = req.body.TypeOfQuestion;
    if (req.body.isACorrect != undefined)
        answer = req.body.AAnswerBox;
    if (req.body.isBCorrect != undefined)
        answer = req.body.BAnswerBox;
    if (req.body.isCCorrect != undefined)
        answer = req.body.CAnswerBox;
    if (req.body.isDCorrect != undefined)
        answer = req.body.DAnswerBox;
    db.query(`INSERT INTO question(Answer, Question, TypeOfQuestion) VALUES (?, ?, "Multiple Choice");`, [answer, question], (req, res, error) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Added MC question");
    });
    db.query(`SELECT * FROM question;`, (request, res2, error) => {
        if (error) console.log(error);
        console.log("RES2");
        console.log(res2);
        var qid = res2[res2.length - 1].QuestionId;
        console.log("QID");
        console.log(qid);
        for (var i = 0; i < choices.length; i++) {
            db.query(`INSERT INTO choices(QuestionId, PossibleAnswer) VALUES (?, ?);`, [qid, choices[i]], (req, res, error) => {
                console.log(res);
            });
        }
        res.render("adminAddQuestions", {
            results: res2
        });
    });
}

function insertCSV(req, res) { //55 gallons of lube
    console.log(req.file.filename);
    potato_salad_on_top_of_my_bowl(__dirname + "/../uploads/" + req.file.filename, res);
}

function potato_salad_on_top_of_my_bowl(path, res) {
    var fs = require("fs");
    fs.readFile(path, function read(err, data) {
        if (err) {
            throw err;
        }
        var meaningfulvariable = [];
        //this does something useful
        data = String(data);
        data = data.trim();
        var lines = data.split("\n");


        router.post("/questionSubmission", (req, res) => {
            console.log(req.body);
            if (req.body.isTF == "on") { // if it's a T/F question
                insertTrueFalse(req, res);
            } else { // if it's MC
                insertMC(req);
            }
        });

        //IF YOU READ THIS MESSAGE GIVE ME A HIGH FIVE NEXT TIME I SEE YOU
        var thisisgood = [];


        //this also does something useful
        for (let x = 0; x < lines.length; x++) {
            var NANIIIIII = [];
            for (let a = 0; a < lines[x].length; a++) {
                //useful comments
                let temp = "";
                while (lines[x].charAt(a) != ",") {
                    temp += lines[x].charAt(a);
                    a++;
                    if (a == lines[x].length) {
                        break;
                    }
                }
                NANIIIIII.push(temp);
            }
            //deal with it
            objectarray = {
                "Question #": NANIIIIII[0],
                "Question text": NANIIIIII[1],
                "Ans 1": NANIIIIII[2],
                "Ans 1 text": NANIIIIII[3],
                "Ans 2": NANIIIIII[4],
                "Ans 2 text": NANIIIIII[5],
                "Ans 3": NANIIIIII[6],
                "Ans 3 text": NANIIIIII[7],
                "Ans 4": NANIIIIII[8],
                "Ans 4 text": NANIIIIII[9],
                "Image Link": NANIIIIII[10],
                "Right Answer": NANIIIIII[11]
            }
            thisisgood.push(objectarray);
        }
        //console.log(thisisgood);
        // insertIntoDB(thisisgood, res);
        for (var i = 0; i < thisisgood.length; i++) {
            var ele = thisisgood[i];
            var questionNum = ele["Question #"];
            var question = ele["Question text"];
            var ans1 = ele["Ans 1"];
            var ans1Txt = ele["Ans 1 text"];
            var ans2 = ele["Ans 2"];
            var ans2Txt = ele["Ans 2 text"];
            var ans3 = ele["Ans 3"];
            var ans3Txt = ele["Ans 3 text"];
            var ans4 = ele["Ans 4"];
            var ans4Txt = ele["Ans 4 text"];
            var img = ele["Image Link"];
            var correctAns;
            if (ans1.charAt(0) == '*')
                correctAns = ans1Txt;
            else if (ans2.charAt(0) == '*')
                correctAns = ans2Txt;
            else if (ans3.charAt(0) == '*')
                correctAns = ans3Txt;
            else if (ans4.charAt(0) == '*')
                correctAns = ans4Txt;
            db.query(`INSERT INTO question(TypeOfQuestion, Answer, Question) VALUES (?, ?, ?);`, ["Multiple Choice", correctAns, question], (req, result, err) => {
                if (err) throw err;
                db.query(`SELECT * FROM question;`, (request, result, error) => {
                    if (error) console.log(error);
                    console.log(result);
                    return res.render("adminAddQuestions", {
                        results: result
                    });
                });
            });
        }
    });
}
module.exports = router;