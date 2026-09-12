import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup(username, email, password);
      navigate('/learning');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="game-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px', backgroundColor: '#fff' }}>
        <h2 className="page-title" style={{ fontSize: '2.5rem', textAlign: 'center', color: 'var(--color-secondary)', WebkitTextStroke: '0', textShadow: '2px 2px 0px var(--color-border)' }}>Create Account</h2>
        
        {error && <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Username" 
            className="gamified-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="gamified-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="gamified-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            className="gamified-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <button className="btn-primary" type="submit" style={{ marginTop: '1rem', backgroundColor: 'var(--color-secondary)', color: 'var(--color-text)', boxShadow: '0px 6px 0px var(--color-secondary-dark), 0px 6px 0px 3px var(--color-border)' }}>Sign Up</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontWeight: 'bold' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)' }}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
