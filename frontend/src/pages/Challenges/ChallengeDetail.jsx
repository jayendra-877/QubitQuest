import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CircuitCanvas from '../../components/CircuitCanvas/CircuitCanvas';

const API_URL = 'http://localhost:5000/api';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for user input
  const [prediction, setPrediction] = useState('');
  const [circuit, setCircuit] = useState([]);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/challenges/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load challenge');
        const data = await res.json();
        setChallenge(data);
        setCircuit(data.initial_circuit || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [id]);

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('token');
      const payload = challenge.type === 'predict' ? { prediction } : { circuit };
      
      const res = await fetch(`${API_URL}/challenges/${id}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      
      if (res.ok && result.success) {
        setSuccessMsg(result.message);
        setTimeout(() => navigate('/challenges'), 2000);
      } else {
        setErrorMsg(result.message || 'Incorrect submission.');
      }
    } catch (err) {
      setErrorMsg('An error occurred while submitting.');
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}><h2>Loading Challenge...</h2></div>;
  }

  if (!challenge) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}><h2>Challenge Not Found</h2></div>;
  }

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      
      {/* Header */}
      <div className="game-card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginRight: '1rem' }}>
              {challenge.type}
            </span>
            <span style={{ backgroundColor: 'var(--color-secondary)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              {challenge.difficulty}
            </span>
          </div>
          <button className="btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate('/challenges')}>Back to Map</button>
        </div>
        <h1 className="page-title" style={{ marginTop: '1rem', fontSize: '2.5rem' }}>{challenge.title}</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text)', fontWeight: '600' }}>{challenge.description}</p>
      </div>

      {/* Main Play Area */}
      {challenge.type === 'predict' && (
        <div className="game-card" style={{ padding: '2rem', backgroundColor: '#e0f7fa' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '900' }}>Analyze this circuit:</h3>
          <CircuitCanvas circuit={challenge.initial_circuit} setCircuit={() => {}} isReadonly={true} />
          
          <div style={{ marginTop: '2rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Your Prediction:</label>
            <input 
              type="text" 
              className="gamified-input" 
              placeholder="e.g. 1 or superposition"
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
          </div>
        </div>
      )}

      {(challenge.type === 'build' || challenge.type === 'debug') && (
        <div className="game-card" style={{ padding: '2rem', backgroundColor: '#e0f7fa' }}>
          <CircuitCanvas circuit={circuit} setCircuit={setCircuit} isReadonly={false} />
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
        >
          Submit Answer
        </button>
      </div>

    </div>
  );
};

export default ChallengeDetail;
