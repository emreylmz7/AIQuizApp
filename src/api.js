import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;

export const fetchQuizQuestions = async (topic) => {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
  
  // Daha net yönergelerle prompt'u geliştirdim
  const prompt = `
    ${topic} hakkında 10 tane çoktan seçmeli soru oluştur.
    Her soru için şu formatı kullan:

    Soru: [Soru metni]
    A) [Seçenek metni]
    B) [Seçenek metni]
    C) [Seçenek metni]
    D) [Seçenek metni]
    Doğru Cevap: [A/B/C/D]

    Lütfen her soruyu ayrı paragrafta yaz ve seçenekleri A, B, C, D harfleriyle işaretle.
    Seçenekler gerçekçi ve konuyla ilgili olmalı, "option1" gibi varsayılan değerler KULLANMA.
  `;

  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    const rawText = response.data.candidates[0].content.parts[0].text;
    return parseQuestionsEnhanced(rawText);
  } catch (error) {
    console.error("Quiz soruları oluşturulurken hata:", error);
    throw new Error("Quiz soruları oluşturulamadı. Lütfen tekrar deneyin.");
  }
};

const parseQuestionsEnhanced = (rawText) => {
  // Soruları ayır
  const questionBlocks = rawText.split(/\n\s*\n/).filter(block => block.trim());
  
  return questionBlocks.map(block => {
    const lines = block.split('\n').map(line => line.trim());
    
    // Soru metnini bul
    const questionLine = lines.find(line => line.startsWith('Soru:'));
    const question = questionLine ? questionLine.replace('Soru:', '').trim() : 'Soru yüklenemedi';

    // Seçenekleri bul
    const options = lines
      .filter(line => /^[A-D]\)/.test(line))
      .map(line => {
        const text = line.replace(/^[A-D]\)/, '').trim();
        return {
          text: text || 'Seçenek yüklenemedi',
          isCorrect: false
        };
      });

    // Doğru cevabı bul
    const correctAnswerLine = lines.find(line => line.startsWith('Doğru Cevap:'));
    if (correctAnswerLine) {
      const correctLetter = correctAnswerLine.replace('Doğru Cevap:', '').trim();
      const correctIndex = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0);
      if (options[correctIndex]) {
        options[correctIndex].isCorrect = true;
      }
    }

    // Eğer seçenekler eksikse veya hatalıysa varsayılan seçenekler oluştur
    if (options.length !== 4) {
      return {
        question,
        options: [
          { text: 'Bu soru için seçenekler yüklenemedi A', isCorrect: true },
          { text: 'Bu soru için seçenekler yüklenemedi B', isCorrect: false },
          { text: 'Bu soru için seçenekler yüklenemedi C', isCorrect: false },
          { text: 'Bu soru için seçenekler yüklenemedi D', isCorrect: false }
        ]
      };
    }

    // Hiç doğru cevap işaretlenmediyse ilk seçeneği doğru olarak işaretle
    if (!options.some(opt => opt.isCorrect)) {
      options[0].isCorrect = true;
    }

    return {
      question,
      options
    };
  });
};



// AIzaSyB6Z32NUSosRwqXqAxsbQfDzYakIv3ld-Q