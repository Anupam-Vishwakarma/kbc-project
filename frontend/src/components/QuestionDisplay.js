import React, { useState, useEffect } from "react";
import axios from "axios";

const QuestionDisplay = ({ questionNumber, onAnswer }) => {
  const [questionData, setQuestionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/question/${questionNumber}`);
        setQuestionData(response.data.question);
      } catch (err) {
        setError("Error fetching question.");
      }
    };

    fetchQuestion();
  }, [questionNumber]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!questionData) {
    return <div>Loading...</div>;
  }

  const handleAnswer = (answer) => {
    const correctAnswer = questionData.correct_answer;
    if (answer === correctAnswer) {
      onAnswer("correct");
    } else {
      onAnswer("incorrect");
    }
  };

  return (
    <div className="question-container">
      <h2>{questionData.question}</h2>
      <ul>
        {questionData.options.map((option, index) => (
          <li key={index} onClick={() => handleAnswer(option)}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionDisplay;
