var useranswers=[];

function update(amountofquestions,answer,choice,index){
    console.log(choice)
    if(useranswers.length==0){
        for(let x=0; x<amountofquestions; x++){
            useranswers[x]=false;
        }
    }

    listofuserpicks();
    // console.log(useranswers)
    //grading part
    if(answer==choice){
        useranswers[index]=true;
    }
    else{
        useranswers[index]=false;
    }

    let grade=0;
    for(let x=0; x<useranswers.length; x++){
        if(useranswers[x]==true){
            grade++;
        }
    }
    document.getElementById("score").value=grade/useranswers.length + "";
}
//update(<%=amountofquestions%>,<%=answers[answers.length-1]%>,<%=results[q].PossibleAnswer%>,<%=counter%>)



function listofuserpicks(){

    var amountofchoices=document.getElementById("amountofchoices").innerHTML;
    amountofchoices=parseInt(amountofchoices);
    
    var userchoices = "";
    for(let x=0; x<amountofchoices; x++){
        if(document.getElementById(x).checked){ 
            userchoices += document.getElementById(x).value + " ";
        }
    }


    document.getElementById("userchoices").value=userchoices;
}