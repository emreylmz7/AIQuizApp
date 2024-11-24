import React, { useState } from "react";


const QuizQuestions = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswer = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...answers, selectedOption.isCorrect];
    setAnswers(newAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      onComplete(newAnswers);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentIndex];

  return (
    <div className="card">
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="progress-text">
          Soru {currentIndex + 1} / {questions.length}
        </p>
      </div>
      
      <h3 className="question">{currentQuestion.question}</h3>
      
      <div className="options-grid">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              selectedOption === option ? 'selected' : ''
            }`}
            onClick={() => handleAnswer(option)}
          >
            {option.text}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={selectedOption === null}
        className="button"
        style={{ marginTop: '1.5rem' }}
      >
        {currentIndex === questions.length - 1 ? "Quiz'i Bitir" : "Sonraki Soru"}
      </button>
    </div>
  );
};

export default QuizQuestions;
