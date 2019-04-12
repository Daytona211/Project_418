const express = require("express");
const router = express.Router();
const serverInfo = require('./../server.js');
const multer = require('multer')
const session = serverInfo.session;
const db = serverInfo.db;
var upload = multer({
    dest: 'uploads/'
})

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
        db.query(`DELETE FROM question WHERE QuestionId=${id}`, (req2, res2) => {
            db.query(`SELECT * FROM question;`, (req3, res3, error) => {
                if (error) console.log(error);
                res1.render("adminAddQuestions", {
                    results: res3
                });
            });
        })
    }
});


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
    var question = req.body.question;
    var answer = "";
    var type = req.body.TypeOfQuestion;
    if (req.body.isACorrect != undefined)
        answer += "A ";
    if (req.body.isBCorrect != undefined)
        answer += "B ";
    if (req.body.isCCorrect != undefined)
        answer += "C ";
    if (req.body.isDCorrect != undefined)
        answer += "D";
    db.query(`INSERT INTO question(Answer, Question, TypeOfQuestion) VALUES (?, ?, "Multiple Choice");`, [answer, question], (req, res, error) => {
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
                correctAns = ans1.split("*")[1];
            else if (ans2.charAt(0) == '*')
                correctAns = ans2.split("*")[1];
            else if (ans3.charAt(0) == '*')
                correctAns = ans3.split("*")[1];
            else if (ans4.charAt(0) == '*')
                correctAns = ans4.split("*")[1];
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