const express = require("express");
const router = express.Router();
const serverInfo = require('./../server.js');
const session = serverInfo.session;

router.get("/addQuestions", (req, res) => {
    if (!req.session.userId)
        res.redirect('/users/login');
    else{
        res.render("adminAddQuestions");
    }
    // res.render("adminAddQuestions");
});

router.post("/questionSubmission", (req, res) => {
    console.log(req.body);
    if (req.body.isTF == "on") { // if it's a T/F question
        var quest = req.body.question;
    } else { // if it's MC

    }
});

module.exports = router;