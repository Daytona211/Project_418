var useranswers=[];

function update(amountofquestions,answer,choice,index){
    if(useranswers.length==0){
        for(let x=0; x<amountofquestions; x++){
            useranswers[x]=false;
        }
    }

    console.log("answer=" + answer + " choice=" + choice);
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
    document.getElementById("score").innerHTML=grade/useranswers.length + "";
}


//update(<%=amountofquestions%>,<%=answers[answers.length-1]%>,<%=results[q].PossibleAnswer%>,<%=counter%>)