const QuizResult = ({ answers }) => {
  const correctCount = answers.filter(Boolean).length;
  const totalQuestions = answers.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="card">
      <div className="results-container">
        <div className="score">{percentage}%</div>
        <p className="score-text">
          {totalQuestions} sorudan {correctCount} tanesini doğru yanıtladınız
        </p>
        
        <div className="stats-grid">
          <div className="stat-card correct">
            <div className="stat-value">{correctCount}</div>
            <div className="stat-label">Doğru</div>
          </div>
          <div className="stat-card incorrect">
            <div className="stat-value">
              {totalQuestions - correctCount}
            </div>
            <div className="stat-label">Yanlış</div>
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="button"
        >
          Yeni Quiz Başlat
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
