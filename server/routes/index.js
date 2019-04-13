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
});


module.exports = router;