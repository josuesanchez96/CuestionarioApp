const { useState, useEffect, useMemo, useRef } = React;

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function App() {
  const [vh, setVh] = useState(window.innerHeight * 0.01);

  useEffect(() => {
    const updateHeight = () => {
      const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setVh(height * 0.01);
      document.documentElement.style.setProperty("--vh", `${height * 0.01}px`);
    };
    window.addEventListener("resize", updateHeight);
    window.addEventListener("orientationchange", updateHeight);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", updateHeight);
    updateHeight();
    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
      if (window.visualViewport) window.visualViewport.removeEventListener("resize", updateHeight);
    };
  }, []);

  const [rawRows, setRawRows] = useState([]); // {answer, question}
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [failedQuestions, setFailedQuestions] = useState([]);
  const timeoutRef = useRef(null);
  const sfxCorrect = useRef(new Audio("music/Correcto.mp3"));
  const sfxError = useRef(new Audio("music/Error.mp3"));
  const sfxCelebration = useRef(new Audio("music/Celebration.mp3"));
  const celebrationUnlocked = useRef(false);

  const totalQuestions = questions.length;

  const progressPercent = useMemo(() => {
    if (!totalQuestions) return 0;
    return ((currentIndex + 1) / totalQuestions) * 100;
  }, [currentIndex, totalQuestions]);

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      prepareOptionsForCurrentQuestion();
    } else {
      setOptions([]);
    }
  }, [questions, currentIndex]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameOver) playSound(sfxCelebration);
  }, [gameOver]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingFile(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const parsed = rows
          .filter(row => Array.isArray(row) && row.length >= 2 && row[0] != null && row[1] != null && String(row[1]).trim() !== "")
          .map(row => ({ answer: String(row[0]).trim(), question: String(row[1]).trim() }));
        if (parsed.length < 2) {
          alert("El archivo debe tener al menos dos filas válidas.");
          setLoadingFile(false);
          return;
        }
        setRawRows(parsed);
        const shuffled = shuffleArray(parsed);
        setQuestions(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setCorrectCount(0);
        setWrongCount(0);
        setGameOver(false);
        setGameStarted(true);
        setSelectedOption(null);
        setFeedback(null);
      } catch (error) {
        alert("Hubo un problema al leer el archivo Excel.");
      } finally {
        setLoadingFile(false);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  }

  function prepareOptionsForCurrentQuestion() {
    const current = questions[currentIndex];
    if (!current) return;
    const otherAnswers = questions.filter((_, idx) => idx !== currentIndex).map(q => q.answer).filter(a => a !== current.answer);
    const shuffledOthers = shuffleArray(otherAnswers).slice(0, Math.min(3, otherAnswers.length));
    const distractors = shuffledOthers.map(text => ({ text, isCorrect: false }));
    const opts = shuffleArray([{ text: current.answer, isCorrect: true }, ...distractors]);
    setOptions(opts);
    setSelectedOption(null);
    setFeedback(null);
    setDisabledOptions([]);
  }

  function playSound(ref) {
    try {
      ref.current.currentTime = 0;
      ref.current.play();
    } catch (_) { }
  }

  function triggerConfetti() {
    if (typeof confetti !== "function") return;
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  }

  function handleOptionClick(option) {
    if (!options.length || selectedOption || disabledOptions.includes(option.text)) return;
    if (!celebrationUnlocked.current) {
      const unlock = sfxCelebration.current.play();
      if (unlock !== undefined) unlock.then(() => { sfxCelebration.current.pause(); sfxCelebration.current.currentTime = 0; }).catch(() => { });
      celebrationUnlocked.current = true;
    }
    setSelectedOption(option);
    if (option.isCorrect) {
      setFeedback({ type: "correct", message: "¡Correcto!" });
      playSound(sfxCorrect);
      setScore(s => s + (disabledOptions.length === 0 ? Math.round(100 / questions.length) : 0));
      if (disabledOptions.length === 0) setCorrectCount(c => c + 1);
      triggerConfetti();
      timeoutRef.current = setTimeout(goToNextQuestion, 1600);
    } else {
      if (disabledOptions.length === 0) {
        const current = questions[currentIndex];
        setFailedQuestions(prev => prev.some(q => q.answer === current.answer) ? prev : [...prev, current]);
      }
      setFeedback({ type: "wrong", message: "Incorrecto. ¡Intenta de nuevo!" });
      playSound(sfxError);
      setWrongCount(c => c + 1);
      timeoutRef.current = setTimeout(() => { setDisabledOptions(prev => [...prev, option.text]); setSelectedOption(null); setFeedback(null); }, 1600);
    }
  }

  function goToNextQuestion() {
    setCurrentIndex(idx => {
      if (idx + 1 >= questions.length) { setGameOver(true); return idx; }
      return idx + 1;
    });
    setSelectedOption(null);
    setFeedback(null);
  }

  function handleRestart() {
    if (!rawRows.length) {
      setQuestions([]); setGameStarted(false); setGameOver(false); setScore(0); setCorrectCount(0); setWrongCount(0); setCurrentIndex(0); setSelectedOption(null); setFeedback(null); setFailedQuestions([]); return;
    }
    const shuffled = shuffleArray(rawRows);
    setQuestions(shuffled); setCurrentIndex(0); setScore(0); setCorrectCount(0); setWrongCount(0); setGameOver(false); setGameStarted(true); setSelectedOption(null); setFeedback(null); setFailedQuestions([]);
  }

  function handleReviewFailed() {
    if (!failedQuestions.length) return;
    const shuffled = shuffleArray(failedQuestions);
    setQuestions(shuffled); setCurrentIndex(0); setScore(0); setCorrectCount(0); setWrongCount(0); setGameOver(false); setGameStarted(true); setSelectedOption(null); setFeedback(null); setFailedQuestions([]);
  }

  const currentQuestion = questions.length && currentIndex < questions.length ? questions[currentIndex] : null;

  const successPercentage = correctCount + wrongCount === 0 ? 0 : Math.round((correctCount / (correctCount + wrongCount)) * 100);

  return (
    <div className="app-root">
      <div className="background-gradient" />
      <div className="app-container">
        <header className="app-header">
          <h1>Cuestionario App</h1>
          <p className="subtitle">Estudia tus conceptos convirtiendo tu Excel en un juego rápido.</p>
        </header>

        <section className="top-bar">
          {!gameStarted && (
            <div className="file-input-wrapper">
              <label className="file-label">
                <span>📁 Cargar archivo Excel</span>
                <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
              </label>
              <p className="file-help">Columna 1: respuesta · Columna 2: pregunta</p>
            </div>
          )}

          {!gameOver && gameStarted && (
            <div className="stats">
              <div className="stat-item"><span className="stat-label">Puntaje</span><span className="stat-value">{score}</span></div>
              <div className="stat-item"><span className="stat-label">Aciertos</span><span className="stat-value stat-ok">{correctCount}</span></div>
              <div className="stat-item"><span className="stat-label">Errores</span><span className="stat-value stat-bad">{wrongCount}</span></div>
              <div className="stat-item"><span className="stat-label">Progreso</span><span className="stat-value">{totalQuestions ? `${currentIndex + 1}/${totalQuestions}` : "-"}</span></div>
            </div>
          )}
        </section>

        <section className="progress-bar-wrapper">
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPercent}%` }} /></div>
        </section>

        {!gameStarted && (
          <section className="welcome-card">
            <h2>¡Bienvenido!</h2>
            <p>Sube tu Excel para empezar. El juego tomará respuestas de otras filas como distractores.</p>
            <p>Responde rápido para sumar puntos y repasa tus errores al final.</p>
          </section>
        )}

        {loadingFile && <div className="overlay-message"><div className="overlay-card"><div className="spinner" /><p>Leyendo Excel...</p></div></div>}

        {gameStarted && !gameOver && currentQuestion && (
          <main className="game-area">
            <div className="question-card">
              <div className="question-label">Pregunta</div>
              <div className="question-text">{currentQuestion.question}</div>
            </div>
            <div className="options-container">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`option-button ${disabledOptions.includes(opt.text) ? "option-eliminated" : selectedOption?.text === opt.text ? (feedback?.type === "correct" ? "option-correct option-pulse" : "option-wrong option-shake") : ""}`}
                  onClick={() => handleOptionClick(opt)}
                  disabled={!!selectedOption || disabledOptions.includes(opt.text)}
                >
                  <span className="option-label">{["A", "B", "C", "D"][idx]}</span>
                  {opt.text}
                </button>
              ))}
            </div>
            {feedback && <div className={`feedback feedback-${feedback.type}`}>{feedback.message}</div>}
          </main>
        )}

        {gameOver && (
          <section className="results-card">
            <h2>Resultados finales</h2>
            <div className="results-grid">
              <div className="result-item"><span className="result-label">Preguntas</span><span className="result-value">{totalQuestions}</span></div>
              <div className="result-item"><span className="result-label">Aciertos</span><span className="result-value stat-ok">{correctCount}</span></div>
              <div className="result-item"><span className="result-label">Errores</span><span className="result-value stat-bad">{wrongCount}</span></div>
              <div className="result-item"><span className="result-label">% Éxito</span><span className="result-value">{successPercentage}%</span></div>
            </div>
            <div className="results-actions">
              <button className="restart-button" onClick={handleRestart}>Reiniciar juego</button>
              {failedQuestions.length > 0 && <button className="review-button" onClick={handleReviewFailed}>🔁 Repasar errores</button>}
            </div>
          </section>
        )}

        {gameStarted && !gameOver && (
          <div className="bottom-actions">
            <button className="ghost-button" onClick={handleRestart}>Volver al inicio</button>
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

