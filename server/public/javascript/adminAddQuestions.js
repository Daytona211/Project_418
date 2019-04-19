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
    trueAnswerRadioBtn.addEventListener("click", () => {
        falseAnswerRadioBtn.checked = false;
    });
    falseAnswerRadioBtn.addEventListener("click", () => {
        trueAnswerRadioBtn.checked = false;
    });
    correctAnswerRadioBtn();
    editQuestion();
}


function correctAnswerRadioBtn(){
    var aRadioBtn = document.getElementById('aRadioBtn');
    var bRadioBtn = document.getElementById('bRadioBtn');
    var cRadioBtn = document.getElementById('cRadioBtn');
    var dRadioBtn = document.getElementById('dRadioBtn');
    aRadioBtn.addEventListener("click", () => {
        bRadioBtn.checked = false;
        cRadioBtn.checked = false;
        dRadioBtn.checked = false;
    });
    bRadioBtn.addEventListener("click", () => {
        aRadioBtn.checked = false;
        cRadioBtn.checked = false;
        dRadioBtn.checked = false;
    });
    cRadioBtn.addEventListener("click", () => {
        aRadioBtn.checked = false;
        bRadioBtn.checked = false;
        dRadioBtn.checked = false;
    });
    dRadioBtn.addEventListener("click", () => {
        aRadioBtn.checked = false;
        bRadioBtn.checked = false;
        cRadioBtn.checked = false;
    });
}

function editQuestion(){

    var rows = document.getElementById("questionsTable").getElementsByTagName("tbody")[0].getElementsByTagName("tr")
    console.log(rows[0]);
    for(var i = 0; i < rows.length; i++){
        var store = rows[i].children[5];
        console.log(store);
        store.addEventListener("click", () =>{
            console.log(store.parentElement);
        });
    }
}

function checkEntry(){
    // display alert if user tries to leave
}

document.addEventListener("DOMContentLoaded", function (event) {
    main();
});