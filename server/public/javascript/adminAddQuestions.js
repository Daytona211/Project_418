function main() {
    addingNewQuestionsRadioBtnControl();
    choicesRadioButtonControl();
}

function addingNewQuestionsRadioBtnControl() {
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
}

// function addNewItemToQuizBank(item) {

// }
function choicesRadioButtonControl(){
    var trueAnswerRadioBtn = document.getElementById("trueAnswerRadioBtn");
    var falseAnswerRadioBtn = document.getElementById("falseAnswerRadioBtn");
    console.log(trueAnswerRadioBtn);
    trueAnswerRadioBtn.addEventListener("click", () => {
        falseAnswerRadioBtn.checked = false;
    });
    falseAnswerRadioBtn.addEventListener("click", () => {
        trueAnswerRadioBtn.checked = false;
    });

    var aRadioButton = document.getElementById("aRadioButton");
    var bRadioButton = document.getElementById("bRadioButton");
    var cRadioButton = document.getElementById("cRadioButton");
    var dRadioButton = document.getElementById("dRadioButton");
    aRadioButton.addEventListener("click", ()=>{
        bRadioButton.checked = false;
        cRadioButton.checked = false;
        dRadioButton.checked = false;
    });
    bRadioButton.addEventListener("click", ()=>{
        aRadioButton.checked = false;
        cRadioButton.checked = false;
        dRadioButton.checked = false;
    });
    cRadioButton.addEventListener("click", ()=>{
        aRadioButton.checked = false;
        bRadioButton.checked = false;
        dRadioButton.checked = false;
    });
    dRadioButton.addEventListener("click", ()=>{
        aRadioButton.checked = false;
        cRadioButton.checked = false;
        bRadioButton.checked = false;
    });
}

document.addEventListener("DOMContentLoaded", function (event) {
    main();
});