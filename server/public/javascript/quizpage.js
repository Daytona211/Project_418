var useranswers = [];

function update(amountofquestions, answer, choice, index) {
	// var ans = event.value.split('-|||~-')[0];
	// var questionId = event.value.split('-|||~-')[1];
	if (useranswers.length == 0) {
		for (let x = 0; x < amountofquestions; x++) {
			useranswers[x] = false;
		}
	}
	//console.log(amountofchoices)
	//saveAns(testId, ans, questionId, userId);
	listofuserpicks();
	// console.log(useranswers)
	//grading part
	if (answer == choice) {
		useranswers[index] = true;
	} else {
		useranswers[index] = false;
	}

	let grade = 0;
	for (let x = 0; x < useranswers.length; x++) {
		if (useranswers[x] == true) {
			grade++;
		}
	}
	document.getElementById('score').value = grade / useranswers.length + '';
}
//update(<%=amountofquestions%>,<%=answers[answers.length-1]%>,<%=results[q].PossibleAnswer%>,<%=counter%>)

// function saveAns(testId, ans, questionId, userId) {
// 	$.post(
// 		'/users/saveAnsOnQuizNotSubmitted',
// 		{
// 			testId: testId,
// 			answer: ans,
// 			questionId: questionId,
// 			userId: userId
// 		},
// 		function(data, status) {
// 			console.log(data);
// 		}
// 	);
// }

function listofuserpicks() {
	var amountofchoices = document.getElementById('amountofchoices').innerHTML;
	amountofchoices = parseInt(amountofchoices);

	var userchoices = '';
	for (let x = 0; x < amountofchoices; x++) {
		if (document.getElementById(x) != null) {
			if (document.getElementById(x).checked) {
				userchoices += document.getElementById(x).value + ' ';
			}
		}
	}
	console.log(userchoices);
	document.getElementById('userchoices').value = userchoices;
}