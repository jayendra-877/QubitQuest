import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchWithAuth } from '../../utils/api';
import { API_BASE_URL } from '../../config';
import CircuitCanvas from '../../components/CircuitCanvas/CircuitCanvas';
import './Arena.css';

const Arena = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  
  const [ws, setWs] = useState(null);
  
  // App States: SELECTION -> MATCHMAKING -> COUNTDOWN -> PLAYING -> FETCHING_RESULTS -> RESULTS
  const [screen, setScreen] = useState('SELECTION');
  const [selectedDomain, setSelectedDomain] = useState('PREDICT'); // PREDICT, BUILD, DEBUG
  
  const [matchId, setMatchId] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timer, setTimer] = useState(0); // remaining seconds
  const [countdown, setCountdown] = useState(null);
  
  const [questionData, setQuestionData] = useState(null);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [circuit, setCircuit] = useState([]);
  const [numQubits, setNumQubits] = useState(3);
  
  const [finalResult, setFinalResult] = useState(null);
  
  // Use refs to avoid stale closures in websocket event listeners
  const stateRef = useRef({ score, screen, answerLocked });
  useEffect(() => {
    stateRef.current = { score, screen, answerLocked };
  }, [score, screen, answerLocked]);
  
  const timerIntervalRef = useRef(null);
  const wsRef = useRef(null);
  
  const wsUrlBase = API_BASE_URL.replace(/^http/, 'ws');
  const WS_URL = `${wsUrlBase}/ws/arena`;
  
  useEffect(() => {
    if (!user) return;
    
    // Connect WebSocket automatically
    const socket = new WebSocket(WS_URL);
    wsRef.current = socket;
    
    socket.onopen = () => {
      const authMessage = { type: "AUTH", token };
      socket.send(JSON.stringify(authMessage));
    };
    
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket Message:", message); // Debug log
        
        switch (message.type) {
          case "MATCH_FOUND":
            setMatchId(message.matchId);
            break;
          case "COUNTDOWN":
            setScreen("COUNTDOWN");
            setCountdown(message.data.seconds);
            if (message.data.seconds === 1) {
              setTimeout(() => setCountdown(null), 1000);
            }
            break;
          case "GAME_STARTED":
            setCountdown(null);
            setScreen("PLAYING");
            startGameTimer(message.data.durationSeconds);
            break;
          case "QUESTION":
            setMatchId(message.matchId);
            setQuestionId(message.data.questionId);
            setQuestionData(message.data);
            setAnswerLocked(false);
            setSelectedOption(null);
            setResult(null);
            
            if (message.data.mode === 'BUILD' || message.data.mode === 'DEBUG') {
              const startJson = message.data.data?.startingCircuitJson;
              
              if (message.data.data?.qubits) {
                setNumQubits(message.data.data.qubits);
              } else if (startJson && (typeof startJson !== 'string' ? startJson.qubits : JSON.parse(startJson).qubits)) {
                const parsedQubits = typeof startJson === 'string' ? JSON.parse(startJson).qubits : startJson.qubits;
                setNumQubits(parsedQubits);
              } else {
                setNumQubits(3);
              }

              if (startJson) {
                try {
                  const ckt = typeof startJson === 'string' ? JSON.parse(startJson) : startJson;
                  const rawGates = ckt.gates || [];
                  const mapped = rawGates.map((g, index) => {
                    if (g.step !== undefined) return g;
                    let qubit = g.target;
                    if (g.control !== undefined) qubit = g.control;
                    return { type: g.type, qubit, step: index, target: g.control !== undefined ? g.target : undefined };
                  });
                  setCircuit(mapped);
                } catch(e) {
                  setCircuit([]);
                }
              } else {
                setCircuit([]);
              }
            }
            break;
          case "ANSWER_RESULT":
            if (message.data.correct === true) {
              setResult({ correct: true, text: "✓ Correct!" });
              if (message.data.score !== undefined) {
                setScore(message.data.score);
              }
            } else {
              setResult({ correct: false, text: message.data.message || "✗ Wrong answer. Try again." });
              setAnswerLocked(false);
              setSelectedOption(null);
            }
            break;
          case "GAME_FINISHED":
            stopGameTimer();
            setAnswerLocked(true);
            setFinalResult(message.data || { userScore: stateRef.current.score });
            setScreen("FETCHING_RESULTS");
            setTimeout(() => {
              setScreen("RESULTS");
            }, 2000);
            break;
          case "OPPONENT_SCORE_UPDATE":
            if (message.data && message.data.opponentScore !== undefined) {
              setOpponentScore(message.data.opponentScore);
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    };
    
    socket.onclose = () => {
      setWs(null);
    };
    
    setWs(socket);
    
    return () => {
      if (wsRef.current) wsRef.current.close();
      stopGameTimer();
    };
  }, [user, WS_URL, token]);

  const joinArena = async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert("Connecting to server... please wait a moment and try again.");
      return;
    }
    
    setScreen("MATCHMAKING");
    setScore(0);
    setOpponentScore(0);
    setMatchId(null);
    setFinalResult(null);
    
    try {
      const response = await fetchWithAuth('/arena/matchmaking/join', {
        method: "POST",
        body: JSON.stringify({ mode: selectedDomain })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error?.message || "Failed to join arena");
      }
      
      if (data.matchId || data.data?.matchId) {
        setMatchId(data.matchId || data.data.matchId);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to join arena. Please try again.");
      setScreen("SELECTION");
    }
  };

  const leaveMatchmaking = async () => {
    try {
      await fetchWithAuth(`/arena/matchmaking/leave?mode=${selectedDomain}`, {
        method: "POST"
      });
    } catch (error) {
      console.error("Failed to leave matchmaking:", error);
    } finally {
      setScreen("SELECTION");
    }
  };

  const startGameTimer = (seconds) => {
    stopGameTimer();
    const startTime = Date.now();
    setTimer(seconds);
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, seconds - elapsed);
      setTimer(remaining);
      if (remaining <= 0) {
        stopGameTimer();
        if (stateRef.current.screen === 'PLAYING') {
          setScreen("FETCHING_RESULTS");
        }
      }
    }, 200); // Check more frequently for better precision
  };

  const stopGameTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const submitAnswer = (answer = null) => {
    if (answerLocked) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (matchId === null || questionId === null) return;
    
    setAnswerLocked(true);
    
    const mode = questionData?.mode;
    
    let answerMessage = {
      type: "ANSWER",
      matchId: matchId,
      questionId: questionId,
    };
    
    if (mode === 'BUILD' || mode === 'DEBUG') {
      const sortedCanvasGates = [...circuit].sort((a, b) => a.step - b.step);
      const backendGates = sortedCanvasGates.map(g => {
        if (g.type === 'CNOT' || g.type === 'CZ') {
          return { type: g.type, control: g.qubit, target: g.target, params: [] };
        }
        return { type: g.type, target: g.qubit, params: [] };
      });
      
      
      answerMessage.answer = JSON.stringify({ qubits: numQubits, gates: backendGates });
    } else {
      setSelectedOption(answer);
      answerMessage.answer = answer;
    }
    
    wsRef.current.send(JSON.stringify(answerMessage));
  };
  
  const goBack = () => {
    setScreen("SELECTION");
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>You must be logged in to access the Arena</h2>
      </div>
    );
  }
  
  // Transform circuit string from backend if applicable
  const getCircuitData = () => {
    let ckt = questionData?.data?.predictorCircuitJson;
    if (!ckt) return [];
    
    try {
      if (typeof ckt === 'string') ckt = JSON.parse(ckt);
      
      const rawGates = ckt.gates || [];
      return rawGates.map((g, index) => {
        if (g.step !== undefined) return g;
        
        let qubit = g.target;
        if (g.control !== undefined) {
          qubit = g.control;
        }

        return {
          type: g.type,
          qubit: qubit,
          step: index,
          target: g.control !== undefined ? g.target : undefined
        };
      });
    } catch (e) {
      console.error("Failed to parse circuit:", e);
      return [];
    }
  };
  
  const getPredictorQubits = () => {
    const ckt = questionData?.data?.predictorCircuitJson;
    if (!ckt) return 3;
    try {
      if (typeof ckt === 'string') return JSON.parse(ckt).qubits || 3;
      if (ckt.qubits) return ckt.qubits;
      return 3;
    } catch {
      return 3;
    }
  };

  const handleAddQubit = () => {
    if (numQubits < 8) setNumQubits(numQubits + 1);
  };

  const handleRemoveQubit = () => {
    if (numQubits > 1) {
      setCircuit(circuit.filter(g => g.qubit < numQubits - 1 && (g.target === undefined || g.target < numQubits - 1)));
      setNumQubits(numQubits - 1);
    }
  };

  const getOpponentScore = () => {
    if (!finalResult) return 0;
    const myScore = stateRef.current.score;
    if (finalResult.result === "WIN") return Math.max(0, myScore - (finalResult.winningMargin || 0));
    if (finalResult.result === "LOSS") return myScore + (finalResult.winningMargin || 0);
    return myScore; // DRAW
  };

  useEffect(() => {
    if (screen === 'PLAYING' && questionData) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [questionData, screen]);

  return (
    <div className="arena-page">
      <div className={`arena-container ${screen === 'RESULTS' ? 'results-mode' : ''}`}>
        
        {screen === 'SELECTION' && (
          <div className="selection-screen">
            <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '3rem' }}>⚛️ Arena Matchmaking</h1>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
              Select a domain and challenge other players in real-time!
            </p>
            
            <div className="domain-cards">
              <div 
                className={`domain-card ${selectedDomain === 'PREDICT' ? 'selected' : ''}`}
                onClick={() => setSelectedDomain('PREDICT')}
              >
                <div className="domain-icon">🔮</div>
                <h3>Predict</h3>
                <p>Test your intuition by predicting the outcomes of quantum circuits.</p>
              </div>
              
              <div 
                className={`domain-card ${selectedDomain === 'BUILD' ? 'selected' : ''}`}
                onClick={() => setSelectedDomain('BUILD')}
              >
                <div className="domain-icon">🛠️</div>
                <h3>Build</h3>
                <p>Construct circuits to solve specific quantum state tasks.</p>
              </div>
              
              <div 
                className={`domain-card ${selectedDomain === 'DEBUG' ? 'selected' : ''}`}
                onClick={() => setSelectedDomain('DEBUG')}
              >
                <div className="domain-icon">🐛</div>
                <h3>Debug</h3>
                <p>Find and fix errors in broken quantum circuits.</p>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="btn-primary play-btn" onClick={joinArena}>PLAY NOW</button>
            </div>
          </div>
        )}

        {screen === 'MATCHMAKING' && (
          <div className="matchmaking-screen">
            <div className="loader-ring"></div>
            <h2>Searching for Opponent...</h2>
            <p>Domain: {selectedDomain}</p>
            <div style={{ marginTop: '2rem' }}>
              <button 
                className="btn-primary" 
                onClick={leaveMatchmaking} 
                style={{ 
                  padding: '0.8rem 2rem', 
                  fontSize: '1rem',
                  backgroundColor: '#ff4b4b',
                  borderColor: '#cc0000'
                }}
              >
                Cancel ✕
              </button>
            </div>
          </div>
        )}

        {screen === 'COUNTDOWN' && (
          <div className="countdown-screen">
            <h2>Match Found!</h2>
            <div className="countdown-number">{countdown}</div>
            <p>Get ready...</p>
          </div>
        )}

        {screen === 'PLAYING' && (
          <div className="playing-screen">
            <div className="game-card arena-header">
              <div className="header-stat">
                <span className="stat-label">Score</span>
                <span className="stat-value text-accent">{score}</span>
              </div>
              <div className="header-stat">
                <span className="stat-label">Time</span>
                <span className="stat-value">{formatTime(timer)}</span>
              </div>
              <div className="header-stat">
                <span className="stat-label">Opponent</span>
                <span className="stat-value text-accent" style={{ color: '#ff4b4b' }}>{opponentScore}</span>
              </div>
            </div>

            {questionData && (
              <div className="game-card question-card" style={{ marginTop: '1.5rem' }}>
                <div className="question-tags">
                  <span className="badge">{questionData.mode || '-'}</span>
                  <span className="badge">{questionData.conceptTag || '-'}</span>
                  <span className="badge">{questionData.difficulty || '-'}</span>
                </div>

                <div className="question-text">
                  {questionData.data?.question}
                </div>
                
                {questionData.data?.predictorQuestion && (
                  <div className="predictor-text">
                    {questionData.data.predictorQuestion}
                  </div>
                )}

                {questionData.data?.predictorCircuitJson && questionData.mode === 'PREDICT' && (
                  <div className="circuit-display" style={{ marginBottom: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '12px' }}>
                    <h3 style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--color-primary)' }}>Circuit</h3>
                    <CircuitCanvas 
                      circuit={getCircuitData()} 
                      setCircuit={() => {}} 
                      isReadonly={true} 
                      numQubits={getPredictorQubits()} 
                    />
                  </div>
                )}

                {(questionData.mode === 'BUILD' || questionData.mode === 'DEBUG') && (
                  <div className="circuit-display" style={{ marginBottom: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '12px' }}>
                    <div className="arena-circuit-header">
                      <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>
                        {questionData.mode === 'BUILD' ? 'Build Circuit' : 'Debug Circuit'}
                      </h3>
                      {!answerLocked && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', padding: '0.2rem', borderRadius: '8px', border: '2px solid var(--color-border)' }}>
                          <button onClick={handleRemoveQubit} disabled={numQubits <= 1} style={{ background: 'none', border: 'none', cursor: numQubits <= 1 ? 'not-allowed' : 'pointer', fontSize: '1.2rem', padding: '0 0.5rem', fontWeight: 'bold' }}>-</button>
                          <span style={{ fontWeight: '900' }}>{numQubits} Qubits</span>
                          <button onClick={handleAddQubit} disabled={numQubits >= 8} style={{ background: 'none', border: 'none', cursor: numQubits >= 8 ? 'not-allowed' : 'pointer', fontSize: '1.2rem', padding: '0 0.5rem', fontWeight: 'bold' }}>+</button>
                        </div>
                      )}
                    </div>
                    <CircuitCanvas 
                      circuit={circuit} 
                      setCircuit={setCircuit} 
                      isReadonly={answerLocked} 
                      numQubits={numQubits} 
                      allowedGates={questionData.data?.allowedGates}
                    />
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                      <button 
                        className="btn-primary" 
                        onClick={() => submitAnswer()} 
                        disabled={answerLocked}
                      >
                        Submit Circuit
                      </button>
                    </div>
                  </div>
                )}

                {questionData.mode === 'PREDICT' && (
                  <div className="options-grid">
                    {questionData.data?.predictorOptions?.map((opt, idx) => (
                      <button
                        key={idx}
                        className={`option-btn ${selectedOption === opt ? 'selected' : ''}`}
                        onClick={() => submitAnswer(opt)}
                        disabled={answerLocked && selectedOption !== opt}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {result && (
                  <div className={`result-toast ${result.correct ? 'correct' : 'wrong'}`}>
                    {result.text}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {screen === 'FETCHING_RESULTS' && (
          <div className="matchmaking-screen">
            <div className="loader-ring"></div>
            <h2>Fetching Results...</h2>
          </div>
        )}

        {screen === 'RESULTS' && (
          <div className="results-screen game-card">
            <h2 
              className={`result-heading ${finalResult?.result?.toLowerCase() || ''}`}
            >
              {finalResult?.result === "WIN" ? "YOU WON!" : 
               finalResult?.result === "LOSS" ? "YOU LOST!" : 
               finalResult?.result === "DRAW" ? "DRAW!" : "Match Finished!"}
            </h2>
            
            <div className="score-board">
              <div className={`score-card player ${finalResult?.result?.toLowerCase() || ''}`}>
                <h3>You</h3>
                <div className="final-score">{stateRef.current.score}</div>
              </div>
              <div className="score-divider">VS</div>
              <div className={`score-card opponent ${finalResult?.result === "WIN" ? "loss" : finalResult?.result === "LOSS" ? "win" : "draw"}`}>
                <h3>Opponent</h3>
                <div className="final-score">{getOpponentScore()}</div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }} onClick={goBack}>Play Again</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Arena;
