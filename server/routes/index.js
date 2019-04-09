const express = require("express");
const router = express.Router();

//Home Page Route
router.get("/", (req, res)=>{
    res.render("welcomePage");
});

//Register Page Route 
router.get("/register", (req, res)=>{
    res.render("registerPage");
});

//About Page Route
router.get("/about", (req, res)=>{
    res.render("aboutPage");
});

//Quiz Page Route
router.get("/QuizPage", (req, res)=>{
    res.render("QuizPage");

    connection.query("SELECT * FROM question",function(err,result){

        if(err){
            throw err;
        } else {
            res.render('print', result);                
        }
    });
});

module.exports = router;