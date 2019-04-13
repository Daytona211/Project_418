function main() {
    var mcRadio = document.getElementById("mcInput");
    var tfRadio = document.getElementById("tfInput");
    var csvRadio = document.getElementById("csvInput");
    mcRadio.addEventListener("click", () => {
        tfRadio.checked = false;
        csvRadio.checked = false;
        document.getElementById("tfAllContent").style.display = "none";
        document.getElementById("mcAllContent").style.display = "block";
        document.getElementById("csvContent").style.display = "none";
    });
    tfRadio.addEventListener("click", () => {
        mcRadio.checked = false;
        csvRadio.checked = false;        
        document.getElementById("tfAllContent").style.display = "block";
        document.getElementById("mcAllContent").style.display = "none";
        document.getElementById("csvContent").style.display = "none";
    });
    csvRadio.addEventListener("click", () => {  
        mcRadio.checked = false;
        tfRadio.checked = false;        
        document.getElementById("tfAllContent").style.display = "none";
        document.getElementById("mcAllContent").style.display = "none";
        document.getElementById("csvContent").style.display = "block";
    });

    var trueAnswerRadioBtn = document.getElementById("trueAnswerRadioBtn");
    var falseAnswerRadioBtn = document.getElementById("falseAnswerRadioBtn");
    console.log(trueAnswerRadioBtn);
    trueAnswerRadioBtn.addEventListener("click", () => {
        falseAnswerRadioBtn.checked = false;
    });
    falseAnswerRadioBtn.addEventListener("click", () => {
        trueAnswerRadioBtn.checked = false;
    });
}

function addNewItemToQuizBank(item){
    
}

document.addEventListener("DOMContentLoaded", function (event) {
    main();
});