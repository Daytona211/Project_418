const express = require("express");
const router = express.Router();

router.get("/addQuestions", (req, res)=>{
    res.render("adminAddQuestions");
});

router.post("/questionSubmission", (req,res)=>{
    console.log(req.body);
    if(req.body.isTF == "on"){ // if it's a T/F question
        req.body.question;
        req.body.trueAnswerBox;
        req.body.falseAnswerBox;
        
    }
    else{ // if it's MC

    }    
});

module.exports = router;