import React, { useState, useEffect } from "react";
import "./Quiz.css"; 
import quizData from './quizData.json'; // Assuming this is the same JSON format

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerSelected, setAnswerSelected] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [timer, setTimer] = useState(10); // Timer starts at 10 seconds
  const [intervalId, setIntervalId] = useState(null);

  // Fetch quiz data and initialize quiz
  useEffect(() => {
    if (Array.isArray(quizData.questions)) {
      setQuestions(quizData.questions);
      setLoading(false);
    } else {
      setError("Invalid quiz data format");
      setLoading(false);
    }
  }, []);

  // Start Timer
  useEffect(() => {
    if (currentQuestion < questions.length) {
      const startTimer = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            handleNextQuestion(); // Automatically move to the next question after time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(startTimer);

      // Cleanup interval on unmount or next question
      return () => clearInterval(startTimer);
    }
  }, [currentQuestion]);

  // Handle answer click
  const handleAnswerClick = (selectedAnswer) => {
    if (answerSelected) return; // Prevent multiple answers

    setAnswerSelected(true);
    const correctOption = questions[currentQuestion]?.options.find(option => option.is_correct);
    const correctAnswer = correctOption ? correctOption.description : "";

    // Provide feedback
    if (selectedAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("Correct Answer!");
    } else {
      setFeedback(`Incorrect! The correct answer is: ${correctAnswer}`);
    }
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setTimer(10); // Reset timer for next question
      setAnswerSelected(false); // Allow selecting new answer
      setFeedback(""); // Clear feedback
    } else {
      setShowScore(true); // Show score after the last question
    }
  };

  // Restart quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setTimer(10);
    setAnswerSelected(false);
    setFeedback("");
    setLoading(true);
    setError(null);
  };

  return (
    <div className="quiz-container">
      {loading ? (
        <h2>Loading quiz...</h2>
      ) : error ? (
        <h2>Error: {error}</h2>
      ) : showScore ? (
        <div>
          <h2>Your Score: {score} / {questions.length}</h2>
          <button className="restart-button" onClick={handleRestart}>Restart Quiz</button>
        </div>
      ) : (
        <div>
          <h3>{questions[currentQuestion]?.description}</h3>
          <div className="timer">Time left: {timer}s</div>
          {questions[currentQuestion]?.options?.map((option, index) => (
            <button 
              key={index} 
              onClick={() => handleAnswerClick(option.description)}
              disabled={answerSelected}
              className={answerSelected ? (option.description === questions[currentQuestion]?.options.find(o => o.is_correct)?.description ? "correct" : "incorrect") : ""}
            >
              {option.description}
            </button>
          ))}
          {feedback && <div className="feedback">{feedback}</div>}
          {answerSelected && (
            <button onClick={handleNextQuestion} className="next-question-button">
              Next Question
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
