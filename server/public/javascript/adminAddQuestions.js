function main() {
    var mcRadio = document.getElementById("mcInput");
    var tfRadio = document.getElementById("tfInput");
    mcRadio.addEventListener("click", () => {
        tfRadio.checked = false;
        document.getElementById("tfAllContent").style.display = "none";
        document.getElementById("mcAllContent").style.display = "block";
    });
    tfRadio.addEventListener("click", () => {
        mcRadio.checked = false;
        document.getElementById("tfAllContent").style.display = "block";
        document.getElementById("mcAllContent").style.display = "none";
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

document.addEventListener("DOMContentLoaded", function (event) {
    main();
});