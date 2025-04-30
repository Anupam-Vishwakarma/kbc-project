import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const prizeMoney = [
  1000, 2000, 3000, 5000, 10000, 20000, 40000, 80000, 160000, 320000,
  640000, 1250000, 2500000, 5000000, 10000000, 20000000
];

const safeMilestones = [5, 10, 15];
const prizeMilestones = [10000, 100000, 1000000];

const rules = [
  "Rule 1: The game consists of multiple-choice questions with increasing difficulty.",
  "Rule 2: You will have 30 seconds to answer each question.",
  "Rule 3: You can use lifelines if available. Each lifeline can be used only once.",
  "Rule 4: If you give a wrong answer, the game will be over, and you lose your prize money.",
  "Rule 5: You can quit at any time to take the current prize money.",
  "Rule 6: There are 4 possible answers to each question, but only one correct answer.",
  "Rule 7: The prize money will increase as you progress through the game.",
  "Rule 8: The final prize will be awarded once you answer all questions correctly.",
  "Rule 9: In case of a tie or draw, the game will be decided by additional questions."
];

const PrizeDisplay = ({ currentPrize }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [currentPrize]);

  return (
    <div className={`prize-amount ${animate ? "prize-popup" : ""}`}>
      ₹ {currentPrize}
    </div>
  );
};
const App = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    phoneAFriend: true,
    audiencePoll: true,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(30);
  const [rulesPage, setRulesPage] = useState(0);
  const [currentPrize, setCurrentPrize] = useState(0);
  const [gameStatus, setGameStatus] = useState(""); // "", "over", "finished"
  const [error, setError] = useState(null);
  const [musicStarted, setMusicStarted] = useState(false);

  useEffect(() => {
    if (musicStarted && currentPage === "landing") {
      new Audio('kbc-start.mp3').play(); // Play music when the user interacts
    }
  }, [currentPage, musicStarted]);
  
  const startMusic = () => {
    setMusicStarted(true); // Indicate that user has interacted
  };

  useEffect(() => {
   
    if (currentPage === "game") {
      fetchQuestion();
    }
    
  }, [questionNumber, currentPage]);

  useEffect(() => {
    if (currentPage !== "game" || gameStatus !== "") return;
    const countdown = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer, currentPage, gameStatus]);

  useEffect(() => {
    if (timer === 0) {
      handleGameOver("Time's up!");
    }
  }, [timer]);
  useEffect(() => {
    if (currentQuestion) {
      new Audio('correct-answer.mp3').play(); 
    }
  }, [currentQuestion]); // This will run whenever currentQuestion changes

  const fetchQuestion = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/question/${questionNumber}`);
      setCurrentQuestion(res.data.question);
      setTimer(30);
    } catch (err) {
      setError("Error fetching question.");
      handleGameOver();
    }
  };

  const handleAnswer = (selected) => {
    const correct = currentQuestion.correct_answer;
    if (selected === correct) {
      new Audio('right.mp3').play();
      setCurrentPrize(prizeMoney[questionNumber - 1]);
      if (questionNumber === prizeMoney.length) {
        setGameStatus("finished");
        setCurrentPage("gameOver");
      } else {
        setTimeout(() => {
          setQuestionNumber(prev => prev + 1); // Wait for 10 seconds before showing next question
        }, 5000); // 10 seconds delay
      }
    } else {
      new Audio('incorrect-answer.mp3').play();
      handleGameOver("Wrong answer!");
    }
  };

  const handleGameOver = (message = "Game Over!") => {
    setError(message);
    setGameStatus("over");
    setCurrentPage("gameOver");
  };

  const useFiftyFifty = () => {
    if (!currentQuestion) return;
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));
    const wrongOptions = currentQuestion.options.filter(opt => opt !== currentQuestion.correct_answer);
    const optionsToRemove = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
    const updatedOptions = currentQuestion.options.filter(opt => !optionsToRemove.includes(opt));
    setCurrentQuestion(prev => ({ ...prev, options: updatedOptions }));
  };

  const usePhoneAFriend = () => {
    setLifelines(prev => ({ ...prev, phoneAFriend: false }));
    alert(`Phone a Friend thinks: ${currentQuestion.correct_answer}`);
  };

  const useAudiencePoll = () => {
    setLifelines(prev => ({ ...prev, audiencePoll: false }));
    alert(`Audience majority chose: ${currentQuestion.correct_answer}`);
  };

  const getMilestonePrize = (qNo) => {
    for (let i = safeMilestones.length - 1; i >= 0; i--) {
      if (qNo > safeMilestones[i]) return prizeMilestones[i];
    }
    return 0;
  };

  const quitGame = () => {
    const prize = getMilestonePrize(questionNumber);
    setCurrentPrize(prize);
    setGameStatus("over");
    setCurrentPage("gameOver");
  };

  const restartGame = () => {
    setQuestionNumber(1);
    setCurrentPrize(0);
    setTimer(30);
    setCurrentQuestion(null);
    setLifelines({
      fiftyFifty: true,
      phoneAFriend: true,
      audiencePoll: true,
    });
    setRulesPage(0);
    setError(null);
    setGameStatus("");
    setCurrentPage("landing");
  };

  if (currentPage === "landing") {
    return (
      <div className="landing-page" onClick={startMusic}>
        <img className="logo" src="your-logo.png" alt="Logo" />
        <h1>Kaun Banega Crorepati</h1>
        <button onClick={() => setCurrentPage("rules")}>Go to Game</button>
      </div>
    
    );
  }

  if (currentPage === "rules") {
    return (
      <div className="rules-page" >
        <h2>Rules and Regulations</h2>
        <p>{rules[rulesPage]}</p>
        <div className="navigation">
          {rulesPage > 0 && <button onClick={() => setRulesPage(r => r - 1)}>Previous</button>}
          {rulesPage < rules.length - 1 ? (
            <button onClick={() => setRulesPage(r => r + 1)}>Next</button>
          ) : (
            <button onClick={() => setCurrentPage("game")}>Start Game</button>
          )}
        </div>
      </div>
    );
  }

  if (currentPage === "game") {
    if (!currentQuestion) return <div>Loading...</div>;

    return (
      <div className="App">
        <h1>Kaun Banega Crorepati</h1>
        <PrizeDisplay currentPrize={currentPrize} />
        <h2>Question #{questionNumber}</h2>
        <div className="timer-bar" style={{ width: `${(timer / 30) * 100}%` }}></div>
        <div className="question-container">
          <h3>{currentQuestion.question}</h3>
          <ul>
            {currentQuestion.options.map((opt, idx) => (
              <li key={idx} onClick={() => handleAnswer(opt)}>{opt}</li>
            ))}
          </ul>
        </div>
        <div className="lifelines">
          {lifelines.fiftyFifty && <button onClick={useFiftyFifty}>50:50</button>}
          {lifelines.phoneAFriend && <button onClick={usePhoneAFriend}>Phone a Friend</button>}
          {lifelines.audiencePoll && <button onClick={useAudiencePoll}>Audience Poll</button>}
        </div>
        <button onClick={quitGame}>Quit</button>
      </div>
    );
  }

  if (currentPage === "gameOver" || gameStatus === "over") {
    return (
      <div className="App">
        <h2>Game Over</h2>
        <h3>Your Prize: ₹{currentPrize}</h3>
        <button onClick={restartGame}>Restart Game</button>
      </div>
    );
  }

  if (gameStatus === "finished") {
    return (
      <div className="App">
        <h2>Congratulations!</h2>
        <h3>You Won ₹{currentPrize}</h3>
        <button onClick={restartGame}>Play Again</button>
      </div>
    );
  }

  return null;
};

export default App;
