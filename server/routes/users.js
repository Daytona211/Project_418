const express = require("express");
const mysql = require('mysql');
const router = express.Router();


// DATABASE SETUP
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'coding_buddy'
  });
   
  db.connect();

router.get("/login", (req, res)=>{
    res.render("loginPage"); // to access this page go to /users/login
});

router.get("/register", (req, res)=>{
    res.render("registerPage"); // to access this page go to /users/register
});

router.get("/about", (req, res)=>{
    res.render("aboutPage");
});

router.post("/sublogin", (req, res)=>{
    let userName = req.body.username;
    let passWord = req.body.password;
    let sqlQuery = "SELECT * FROM userprofile WHERE Name=\"" + userName + "\";";
    db.query(sqlQuery, (error, result) => {
        if (error)
            console.log(error);
        else {
            if (result.length == 0) {
                // User doesn't exist
                let errorMsg = "We don't recognize that username. Please register";
                res.render("loginPage", {
                    errorMsg
                });
            } else {
                for (let i = 0; i < result.length; i++) {
                    if (passWord == result[i].Password) {
                        console.log(result);
                        res.render("adminPage"); //TOFIX with proper redirect
                        return;
                    }
                }

                let errorMsg = "We don't recognize that password. Please try again";
                res.render("loginPage", {
                    errorMsg
                });
            }
        }
    });
});

module.exports = router;        