const express = require("express");
const router = express.Router();

router.get("/login", (req, res)=>{
    res.render("loginPage"); // to access this page go to /users/login
});



module.exports = router;    