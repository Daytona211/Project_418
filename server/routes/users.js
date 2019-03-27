const express = require("express");
const router = express.Router();

router.get("/login", (req, res)=>{
    res.render("loginPage"); // to access this page go to /users/login
});

router.get("/register", (req, res)=>{
    res.render("registerPage"); // to access this page go to /users/register
});



module.exports = router;    