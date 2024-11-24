import React, { useState } from "react";

const QuizForm = ({ onStartQuiz }) => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      await onStartQuiz(topic);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="title">Yeni Quiz Başlat</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic" className="label">
            Konu Seç
          </label>
          <input
            id="topic"
            type="text"
            className="input"
            placeholder="Bir konu girin (örn: Güneş Sistemi)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          className="button"
          disabled={isLoading}
        >
          {isLoading ? "Quiz Oluşturuluyor..." : "Quiz'i Başlat"}
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
