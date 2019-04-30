const express = require("express");
const router = express.Router();
const serverInfo = require('./../server.js');
const multer = require('multer')
const session = serverInfo.session;
const db = serverInfo.db;
var upload = multer({
    dest: 'uploads/'
})

router.post("/registerId", (req, res) => {
    db.query(`SELECT Name FROM UserProfile`, (selReq, selRes) => {
        for (var i = 0; i < selRes.length; i++) {
            if (selRes[i].Name == req.body.username) {
                return res.render("userIds", {
                    error: "Duplicate user use a different username"
                });
            }
        }
        if (req.body.isAdmin) {
            db.query(`INSERT INTO UserProfile(Name, Password, isAdmin) VALUES (?, ?, ?)`, [req.body.username, req.body.password, 1]);
            res.redirect("/admin/userIds")
        } else {
            db.query(`INSERT INTO UserProfile(Name, Password, isAdmin) VALUES (?, ?, ?)`, [req.body.username, req.body.password, 0]);
            res.redirect("/admin/userIds")
        }
    })

})

router.get("/userIds", (req, result) => {
    if (!req.session.userId) {
        result.render("loginPage");
    } else {
        db.query(`SELECT isAdmin FROM UserProfile WHERE UserProfileId=?`, [req.session.userId], (req, res) => {
            if (res[0].isAdmin == 0)
                result.render("loginPage");
            else
                getUsersAndRenderUserIds(result);
        });
    }
});

function getUsersAndRenderUserIds(res) {
    db.query(`SELECT * FROM UserProfile`, (req1, res1) => {
        res.render("userIds", {
            result: res1
        });
    });
}


router.get("/addQuestions", (req, result) => {
    if (!req.session.userId)
        result.redirect('/users/login');
    else {
        db.query(`SELECT isAdmin FROM UserProfile WHERE UserProfileId=?`, [req.session.userId], (req, res) => {
            if (res[0].isAdmin == 0)
                result.render("loginPage");
            else
                rerenderAdminAddQuestionsPage(result);
        });
    }
});

router.get("/editQuestions", (req, res) => {
    if (!req.session.userId)
        return res.redirect(`/users/login`);
    else {
        var id = req.query.id;
        db.query("SELECT * FROM Question INNER JOIN Choices ON Question.QuestionId= Choices.QuestionId WHERE Question.QuestionId=?", [id], (req1, res1) => {

            if (res1.length < 1) {
                var error = "This question is part of a test please remove the test first or make a new question";
                return rerenderAdminAddQuestionsPage(res, error, questionInfo);
            }
            var questionInfo = {
                question: res1[0].Question,
                choice1: undefined,
                choice2: undefined,
                choice3: undefined,
                choice4: undefined,
                type: "TF"
            };
            console.log(res1);
            console.log(questionInfo);
            if (res1[0].TypeOfQuestion == "Multiple Choice") {
                questionInfo.choice1 = res1[0].PossibleAnswer;
                questionInfo.choice2 = res1[1].PossibleAnswer;
                questionInfo.choice3 = res1[2].PossibleAnswer;
                questionInfo.choice4 = res1[3].PossibleAnswer;
                questionInfo.type = "MC"
                questionInfo.category = res1[0].category;
            }
            db.query(`DELETE FROM Choices WHERE QuestionId=?`, [id]);
            db.query(`DELETE FROM Question WHERE QuestionId=?`, [id]);
            rerenderAdminAddQuestionsPage(res, undefined, questionInfo);
        });
    }

    console.log("EDIT");
});


router.get("/deleteQuestions", (req1, res1) => {
    if (!req1.session.userId)
        res1.redirect('/users/login');
    else {
        var id = req1.query.id;
        db.query(`SELECT TestId FROM QuestionsForTest WHERE QuestionId=?`, [id], (req, res) => {
            console.log(res);
            if (res.length > 0 && res[0].TestId != null) {
                var error = "This question is part of a test please remove the test first or make a new question";
                rerenderAdminAddQuestionsPage(res1, error);
            } else {
                db.query(`DELETE FROM Choices WHERE QuestionId=?`, [id]);
                db.query(`DELETE FROM Question WHERE QuestionId=${id}`, (req2, res2) => {
                    rerenderAdminAddQuestionsPage(res1);
                })
            }
        });
    }
});

router.get("/deleteTest", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/users/login');
    } else {
        var id = req.query.id;
        db.query("DELETE FROM TestStatus WHERE TestId=?", [id]);
        db.query("DELETE FROM UserAnswers WHERE TestId=?", [id]);
        db.query("DELETE FROM QuestionsForTest WHERE TestId=?", [id]);
        db.query("DELETE FROM Test WHERE TestId=?", [id]);
        db.query(`SELECT * FROM Test;`, (req, results) => {
            return res.render("adminPage", {
                results: results
            })
        })
    }
})

// router.get("/deleteQuestions", (req1, res1) => {
//     if (!req1.session.userId)
//         res1.redirect('/users/login');
//     else {
//         var id = req1.query.id;
//         db.query(`SELECT TestId FROM question WHERE QuestionId=?`, [id], (req, res) => {
//             if (res[0].TestId != null) {
//                 var error = "This question is part of a test please remove it from the test first";
//                 rerenderAdminAddQuestionsPage(res1, error);
//             } else {
//                 db.query(`DELETE FROM choices WHERE QuestionId=?`, [id]);
//                 db.query(`DELETE FROM question WHERE QuestionId=${id}`, (req2, res2) => {
//                     rerenderAdminAddQuestionsPage(res1);
//                 })
//             }
//         });
//     }
// });


router.post("/tfQuestionSubmission", (req, res) => {
    insertTrueFalse(req, res);
});
router.post("/mcQuestionSubmission", (req, res) => {
    insertMC(req, res);
});
router.post("/csvQuestionSubmission", upload.single('csvFile'), (req, res) => {
    insertCSV(req, res);
});

function rerenderAdminAddQuestionsPage(res, errorMessage, questionInfo) {
    console.log(errorMessage);
    db.query(`SELECT * FROM Question;`, (request, result, error) => {
        if (error) console.log(error);
        res.render("adminAddQuestions", {
            results: result,
            error: errorMessage,
            questionInfo: questionInfo
        });
    });
}

function insertTrueFalse(req, res) {
    var question = req.body.question;
    var answer;
    var questionId = req.body.questionId;
    if (req.body.isTrueCorrect != undefined)
        answer = "True";
    else
        answer = "False";

    var category = "None";
    if(req.body.category)
        category = req.body.category;

    db.query(`INSERT INTO Question(Answer, Question, TypeOfQuestion, Category) VALUES (?, ?, "True False", ?);`, [answer, question, category], (req, resl, error) => {
        if (error) {
            console.log(error);
        }
        db.query(`INSERT INTO Choices(QuestionId, PossibleAnswer) VALUES (?, "True");`, [resl.insertId]);
        db.query(`INSERT INTO Choices(QuestionId, PossibleAnswer) VALUES (?, "False");`, [resl.insertId]);
        rerenderAdminAddQuestionsPage(res);
        console.log("Added t/f question");
    });
}

function insertMC(req, res1) {
    var question = req.body.question;
    var answer = "";
    var type = req.body.TypeOfQuestion;
    if (req.body.isACorrect)
        answer = req.body.AAnswerBox;
    else if (req.body.isBCorrect)
        answer = req.body.BAnswerBox;
    else if (req.body.isCCorrect)
        answer = req.body.CAnswerBox;
    else if (req.body.isDCorrect)
        answer = req.body.AAnswerBox;
    var choices = [req.body.AAnswerBox, req.body.BAnswerBox, req.body.CAnswerBox, req.body.DAnswerBox];
    var category = "None";
    if(req.body.category)
        category = req.body.category;

    db.query(`INSERT INTO Question(Answer, Question, TypeOfQuestion, Category) VALUES (?, ?, "Multiple Choice", ?);`, [answer, question, category], (req, res, error) => {
        if (error) {
            console.log(error);
            return;
        }
        for (var i = 0; i < choices.length; i++) {
            db.query(`INSERT INTO Choices(QuestionId, PossibleAnswer) VALUES (?, ?);`, [res.insertId, choices[i]]);
        }
        console.log("Added MC question");
    }); // adds the question to the DB and rerenders

    rerenderAdminAddQuestionsPage(res1);
}

function addNewQuestion(answer, question, type) {
    db.query(`INSERT INTO Question(Answer, Question, TypeOfQuestion) VALUES (?, ?, ?);`, [answer, question, type], (req, res, error) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Added MC question");
    });
}

function insertCSV(req, res) { //55 gallons of lube
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

        // router.post("/questionSubmission", (req, res) => {
        //     console.log(req.body);
        //     if (req.body.isTF == "on") { // if it's a T/F question
        //         insertTrueFalse(req, res);
        //     } else { // if it's MC
        //         insertMC(req);
        //     }
        // }); I THINK THIS CAN GO
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
                // correctAns = ans1.split("*")[1];
            else if (ans2.charAt(0) == '*')
                // correctAns = ans2.split("*")[1];
                correctAns = ans2Txt;                
            else if (ans3.charAt(0) == '*')
                // correctAns = ans3.split("*")[1];
                correctAns = ans3Txt;
            else if (ans4.charAt(0) == '*')
                // correctAns = ans4.split("*")[1];
                correctAns = ans4Txt;
            var choices = [ans1Txt, ans2Txt, ans3Txt, ans4Txt];

            db.query(`INSERT INTO Question(TypeOfQuestion, Answer, Question) VALUES (?, ?, ?);`, ["Multiple Choice", correctAns, question], (req, result, err) => {
                if (err) throw err;
                for (var i = 0; i < choices.length; i++) {
                    db.query(`INSERT INTO Choices(QuestionId, PossibleAnswer) VALUES (?, ?);`, [result.insertId, choices[i]]);
                }
                rerenderAdminAddQuestionsPage(res);
            });
        }
    });
}

//Query for Quiz Creation Page
router.get('/creatingtestPage', (req, res) => {
    var id = req.session.userId;
    console.log(id);
    db.query("SELECT * FROM Question;", (request, results, error) => {
        if (error) {
            console.log(error);
        }
        res.render("creatingtestPage", {
            results: results
        })
    })

});

router.post("/createTestId", (req, res) => {
    var user = {
        testId: req.body.TestTitle

    };

    console.log(req.body.TestTitle);

    db.query("INSERT INTO Test (TestTitle) VALUES(?)", [user.testId], function (err, result) {

    });
});

router.post("/createDBTable", (req, res) => {
    var test = {
        checked: req.body.checked
    };


    //     console.log(req.body.TestTitle);

    //     db.query("INSERT INTO test (TestTitle) VALUES(?)", [user.testId],  function(err, result){

    //     });
    // });
});

router.post("/sendTODB", (req, res1) => {

    var user = {
        testTitle: req.body.TestTitle
    };
    console.log(req.body.TestTitle);

    db.query("INSERT INTO Test (TestTitle) VALUES(?)", [user.testTitle], function (err, result) {});

    var test = {
        checked: req.body.checked
    };
    console.log(req.body.checked);

    var array = new Array();
    for (let x = 0; x < [test.checked][0].length; x++) {
        array.push(parseInt([test.checked][0][x]));

    }

    db.query(`SELECT MAX(TestId) FROM Test;`, (req, res, err) => {
        if (!err) throw err;
        for (let x = 0; x < array.length; x++) {

            db.query(`INSERT INTO QuestionsForTest(QuestionId, TestId) VALUES(?, ?);`, [array[x], res[0]["MAX(TestId)"]], (req1, err, result) => {
                if (!err) throw err;
                db.query
                res1.redirect("/admin/adminPage")
            })
            console.log("============================")
            console.log(array[x]);
            console.log(res[0]["MAX(TestId)"]);
            console.log("============================");
        }

    });


});



//queries for tests
router.get('/adminPage', (req, res) => {
    db.query('SELECT * FROM Test;', (request, results, error) => {
        if (error) {
            console.log(error);
        }
        res.render('adminPage', {
            results: results
        });
    });
});


module.exports = router;