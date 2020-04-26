const questions = [{
										question: "Which planet is the one we inhabit?",
										options: ['Earth', 'Venus', 'Saturn', 'Mars'],
										answer: "Earth"
									},
									{
										question: "Which planet is the biggest in our solar system?",
										options: ['Jupiter', 'Neptune', 'Saturn', 'Uranus'],
										answer: "Jupiter"
									},
									{
										question: "Which planet is the smallest in our solar system?",
										options: ['Venus', 'Mercury', 'Mars', 'Earth'],
										answer: "Mercury"
									},
									{
										question: "How many moons does Jupiter have?",
										options: ['25', '67', '100', 'None'],
										answer: "67"
									}
								];


let userQuestions = [];

//4 Random Questions with out repeating
for (let i=0; i<4; i++){
	userQuestions[i] = Math.floor(Math.random() * questions.length);

	if (userQuestions.length > 1){
		for (let j=0; j<userQuestions.length; j++){
			if (userQuestions[j] == userQuestions[i] && i != j){
				userQuestions[i] = Math.floor(Math.random() * questions.length);
				j = 0;
			}
		}
	}
}


window.addEventListener('load', (event) => {
	//Question 1
	document.getElementById('question1').innerHTML = questions[userQuestions[0]].question;

	document.getElementById('option1').value = questions[userQuestions[0]].options[0];
	document.getElementById('option1Text').innerHTML = questions[userQuestions[0]].options[0];

	document.getElementById('option2').value = questions[userQuestions[0]].options[1];
	document.getElementById('option2Text').innerHTML = questions[userQuestions[0]].options[1];

	document.getElementById('option3').value = questions[userQuestions[0]].options[2];
	document.getElementById('option3Text').innerHTML = questions[userQuestions[0]].options[2];

	document.getElementById('option4').value = questions[userQuestions[0]].options[3];
	document.getElementById('option4Text').innerHTML = questions[userQuestions[0]].options[3];

	//Question 2
	document.getElementById('question2').innerHTML = questions[userQuestions[1]].question;

	document.getElementById('option5').value = questions[userQuestions[1]].options[0];
	document.getElementById('option5Text').innerHTML = questions[userQuestions[1]].options[0];

	document.getElementById('option6').value = questions[userQuestions[1]].options[1];
	document.getElementById('option6Text').innerHTML = questions[userQuestions[1]].options[1];

	document.getElementById('option7').value = questions[userQuestions[1]].options[2];
	document.getElementById('option7Text').innerHTML = questions[userQuestions[1]].options[2];

	document.getElementById('option8').value = questions[userQuestions[1]].options[3];
	document.getElementById('option8Text').innerHTML = questions[userQuestions[1]].options[3];

	//Question 3
	document.getElementById('question3').innerHTML = questions[userQuestions[2]].question;

	document.getElementById('option9').value = questions[userQuestions[2]].options[0];
	document.getElementById('option9Text').innerHTML = questions[userQuestions[2]].options[0];

	document.getElementById('option10').value = questions[userQuestions[2]].options[1];
	document.getElementById('option10Text').innerHTML = questions[userQuestions[2]].options[1];

	document.getElementById('option11').value = questions[userQuestions[2]].options[2];
	document.getElementById('option11Text').innerHTML = questions[userQuestions[2]].options[2];

	document.getElementById('option12').value = questions[userQuestions[2]].options[3];
	document.getElementById('option12Text').innerHTML = questions[userQuestions[2]].options[3];

	//Question 4
	document.getElementById('question4').innerHTML = questions[userQuestions[3]].question;

	document.getElementById('option13').value = questions[userQuestions[3]].options[0];
	document.getElementById('option13Text').innerHTML = questions[userQuestions[3]].options[0];

	document.getElementById('option14').value = questions[userQuestions[3]].options[1];
	document.getElementById('option14Text').innerHTML = questions[userQuestions[3]].options[1];

	document.getElementById('option15').value = questions[userQuestions[3]].options[2];
	document.getElementById('option15Text').innerHTML = questions[userQuestions[3]].options[2];

	document.getElementById('option16').value = questions[userQuestions[3]].options[3];
	document.getElementById('option16Text').innerHTML = questions[userQuestions[3]].options[3];



});


function quizCheck() {

	let answer1 = document.quiz.question1.value;
	let answer2 = document.quiz.question2.value;
	let answer3 = document.quiz.question3.value;
	let answer4 = document.quiz.question4.value;
	let correct = 0;

	if (answer1 == questions[userQuestions[0]].answer) {
		correct++;
	}

	if (answer2 == questions[userQuestions[1]].answer) {
		correct++;
	}

	if (answer3 == questions[userQuestions[2]].answer) {
		correct++;
	}

	if (answer4 == questions[userQuestions[3]].answer) {
		correct++;
	}

	document.getElementById("postSubmit").style.visibility = "visible";
	document.getElementById("correctAnswers").innerHTML = "There were " + correct + " correct answers.";
}
