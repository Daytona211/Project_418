const express = require("express");
const router = express.Router();

//Home Page Route
router.get("/", (req, res)=>{
    res.render("welcomePage");
});

//About Page Route
router.get("/about", (req, res)=>{
    res.render("aboutPage");
});



module.exports = router;