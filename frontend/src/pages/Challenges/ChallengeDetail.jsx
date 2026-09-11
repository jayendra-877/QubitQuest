import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CircuitCanvas from '../../components/CircuitCanvas/CircuitCanvas';

const API_URL = 'http://localhost:8080/api/v1';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for user input
  const [prediction, setPrediction] = useState('');
  const [circuit, setCircuit] = useState([]);
  const [fullCircuit, setFullCircuit] = useState(null);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/challenges/${id}?userId=1`, {
          headers: { 
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
        const json = await res.json();
        
        if (!json.data) {
           throw new Error(`Challenge ID ${id} not found in the fetched data.`);
        }
        
        const foundChallenge = json.data;
        setChallenge(foundChallenge);
        
        // Handle initial circuit parsing
        const cTypeStr = (foundChallenge.challengeType || foundChallenge.type || '').toUpperCase();
        const isPredict = cTypeStr === 'PREDICT';
        let initialCirc = isPredict ? foundChallenge.predictorCircuitJson : foundChallenge.startingCircuitJson;
        
        if (typeof initialCirc === 'string') {
          try { initialCirc = JSON.parse(initialCirc); } catch (e) {}
        }
        
        const full = initialCirc || { qubits: 3, gates: [] };
        setFullCircuit(full);
        
        // Convert backend gates to Canvas format
        const rawGates = full.gates || [];
        const canvasGates = rawGates.map((g, index) => {
          // If it already has step, it's already in canvas format (from old mock)
          if (g.step !== undefined) return g;
          
          let qubit = g.target;
          if (g.control !== undefined) {
            qubit = g.control; // Place the main block on the control wire
          }
          
          return {
            type: g.type,
            qubit: qubit,
            step: index, // Place sequentially
            target: g.control !== undefined ? g.target : undefined
          };
        });
        
        console.log("Setting circuit gates to:", canvasGates);
        setCircuit(canvasGates);
      } catch (err) {
        console.error("Fetch Error:", err);
        setErrorDetails(err.message);
        setChallenge(null);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [id]);

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setSubmissionResult(null);
    try {
      const token = localStorage.getItem('token');
      const cType = (challenge.challengeType || challenge.type || '').toLowerCase();
      
      let url = '';
      let payload = {};

      if (cType === 'predict') {
        url = `http://localhost:8080/challenges/${id}/predict?userId=1`;
        if (API_URL.includes('/api/v1')) {
           url = `${API_URL}/challenges/${id}/predict?userId=1`;
        }
        payload = {
          predictedAnswer: prediction
        };
      } else {
        url = `${API_URL}/challenges/${id}/submit?userId=1`;
        const sortedCanvasGates = [...circuit].sort((a, b) => a.step - b.step);
        const backendGates = sortedCanvasGates.map(g => {
          if (g.type === 'CNOT' || g.type === 'CZ') {
            return { type: g.type, control: g.qubit, target: g.target, params: [] };
          }
          return { type: g.type, target: g.qubit, params: [] };
        });
        
        payload = {
          userId: 1, 
          circuitJson: JSON.stringify({ ...(fullCircuit || {}), gates: backendGates })
        };
      }
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      
      if (res.ok && result.data) {
        if (cType === 'predict') {
          if (result.data.correct) {
            setSuccessMsg(result.data.feedback || 'Successfully completed!');
            setTimeout(() => navigate('/challenges', { state: { returnFrom: id } }), 2500);
          } else {
            setErrorMsg(result.data.feedback || 'Incorrect prediction. Try again.');
          }
        } else {
          // BUILD/DEBUG Response parsing
          if (result.data.result) {
            setSubmissionResult(result.data.result);
          }
          if (result.data.correct) {
             setSuccessMsg(result.data.feedbackMessage || `Correct! You earned ${result.data.pointsAwarded || 0} points!`);
             setTimeout(() => navigate('/challenges', { state: { returnFrom: id } }), 4000); // 4 seconds so they can see the chart
          } else {
             setErrorMsg(result.data.feedbackMessage || 'Incorrect submission.');
          }
        }
      } else {
        setErrorMsg(result.message || result.error || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setErrorMsg('An error occurred while submitting.');
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}><h2>Loading Challenge...</h2></div>;
  }

  if (errorDetails) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h2 style={{ color: 'red' }}>Error Loading Challenge</h2>
      <p>{errorDetails}</p>
    </div>;
  }

  if (!challenge) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}><h2>Challenge Not Found</h2></div>;
  }

  const cType = (challenge.challengeType || challenge.type || '').toUpperCase();

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      
      {/* Header */}
      <div className="game-card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginRight: '1rem' }}>
              {cType}
            </span>
            <span style={{ backgroundColor: 'var(--color-secondary)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              {challenge.difficulty}
            </span>
          </div>
          <button className="btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate('/challenges', { state: { returnFrom: id } })}>Back to Map</button>
        </div>
        <h1 className="page-title" style={{ marginTop: '1rem', fontSize: '2.5rem' }}>{challenge.title}</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text)', fontWeight: '600' }}>{challenge.story || challenge.description}</p>
      </div>

      {/* Main Play Area */}
      {cType === 'PREDICT' && (
        <div className="game-card" style={{ padding: '2rem', backgroundColor: '#e0f7fa' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '900' }}>Analyze this circuit:</h3>
          <CircuitCanvas circuit={circuit} setCircuit={() => {}} isReadonly={true} numQubits={fullCircuit?.qubits || 3} />
          
          <div style={{ marginTop: '2rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
              {challenge.predictorQuestion || 'What is your prediction?'}
            </label>
            
            {challenge.predictorOptions && challenge.predictorOptions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {challenge.predictorOptions.map((opt, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '1.1rem' }}>
                    <input 
                      type="radio" 
                      name="prediction" 
                      value={opt}
                      checked={prediction === opt}
                      onChange={(e) => setPrediction(e.target.value)}
                      style={{ marginRight: '0.5rem', transform: 'scale(1.2)' }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <input 
                type="text" 
                className="gamified-input" 
                placeholder="e.g. 1 or superposition"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
            )}
          </div>
        </div>
      )}

      {(cType === 'BUILD' || cType === 'DEBUG') && (
        <div className="game-card" style={{ padding: '2rem', backgroundColor: '#e0f7fa' }}>
          <CircuitCanvas circuit={circuit} setCircuit={setCircuit} isReadonly={!challenge.allowCircuitEdit} numQubits={fullCircuit?.qubits || 3} />
        </div>
      )}

      {/* Simulation Result */}
      {submissionResult && submissionResult.probabilities && (
        <div className="game-card" style={{ padding: '2rem', backgroundColor: '#f5f5f5', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '900' }}>Simulation Results:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {Object.entries(submissionResult.probabilities).map(([state, prob]) => (
              <div key={state} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '60px', fontWeight: 'bold', fontSize: '1.1rem' }}>|{state}⟩</span>
                <div style={{ flex: 1, backgroundColor: '#ddd', height: '20px', borderRadius: '4px', overflow: 'hidden', margin: '0 1rem', display: 'flex' }}>
                  <div style={{ width: `${prob * 100}%`, backgroundColor: 'var(--color-primary)', height: '100%', transition: 'width 0.5s ease-out' }}></div>
                </div>
                <span style={{ width: '60px', textAlign: 'right', fontWeight: 'bold' }}>{(prob * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
            <span>Success: {submissionResult.success ? 'Yes' : 'No'}</span>
            <span>Execution Time: {submissionResult.executionTimeMs}ms</span>
          </div>
        </div>
      )}

      {/* Validation Messages */}
      {errorMsg && (
        <div className="game-card" style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '1rem', marginTop: '2rem', textAlign: 'center' }}>
          <strong>{errorMsg}</strong>
        </div>
      )}
      {successMsg && (
        <div className="game-card" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '1rem', marginTop: '2rem', textAlign: 'center' }}>
          <strong>{successMsg} Redirecting...</strong>
        </div>
      )}

      {/* Submit Button */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button 
          className="btn-primary" 
          style={{ fontSize: '1.5rem', padding: '1rem 4rem' }}
          onClick={handleSubmit}
          disabled={!circuit && !prediction}
        >
          Submit Answer
        </button>
      </div>

    </div>
  );
};

export default ChallengeDetail;
