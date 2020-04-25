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