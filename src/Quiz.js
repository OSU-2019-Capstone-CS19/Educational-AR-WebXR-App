const questions = [{
										question: "Which planet is the one we inhabit?",
										options: ['Earth', 'Venus', 'Saturn', 'Mars'],
										answer: "Earth"
									},
									{
										question: "Which planet is the biggest in our solar system?",
										answerOption: ['Jupiter', 'Neptune', 'Saturn', 'Uranus'],
										answer: "Jupiter"
									}];

let userQuestions = []; //This will equal the numbers that were chosen from the list of questions

window.addEventListener('load', (event) => {
	document.getElementById('question1').innerHTML = questions[0].question;
	document.getElementById('option1').value = questions[0].options[0];
	document.getElementById('option1Text').innerHTML = questions[0].options[0];

	document.getElementById('option2').value = questions[0].options[1];
	document.getElementById('option3').value = questions[0].options[2];
	document.getElementById('option4').value = questions[0].options[3];

	document.getElementById('question2').innerHTML = questions[1].question;
	document.getElementById('question3').innerHTML = questions[1].question;
	document.getElementById('question4').innerHTML = questions[1].question;
});


function quizCheck() {

	var question1 = document.quiz.question1.value;
	var question2 = document.quiz.question2.value;
	var question3 = document.quiz.question3.value;
	var question4 = document.quiz.question4.value;
	var correct = 0;

	if (question1 == "Earth") {
		correct++;
	}

	if (question2 == "Jupiter") {
		correct++;
	}

	if (question3 == "Mercury") {
		correct++;
	}

	if (question4 == "67") {
		correct++;
	}

	document.getElementById("postSubmit").style.visibility = "visible";
	document.getElementById("correctAnswers").innerHTML = "There were " + correct + " correct answers.";
}
