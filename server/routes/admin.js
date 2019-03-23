const express = require("express");
const router = express.Router();


//Admin Page Route 
router.get("/admin", (req, res)=>{
    res.render("adminPage");
});


module.exports = router;    