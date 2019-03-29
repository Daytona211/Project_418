const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get("/login", (req, res) => {
    res.render("loginPage"); // to access this page go to /users/login
});

router.post("/registers", (req, res) => {
    //res.render("registerPage"); // to access this page go to /users/register
    var username = req.body.username;
    console.log(username);
    res.end(JSON.stringify(req.body));
});



module.exports = router;