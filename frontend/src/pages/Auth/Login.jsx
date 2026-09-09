import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/learning';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="game-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px', backgroundColor: '#fff' }}>
        <h2 className="page-title" style={{ fontSize: '2.5rem', textAlign: 'center', color: 'var(--color-primary)', WebkitTextStroke: '0', textShadow: '2px 2px 0px var(--color-border)' }}>Welcome Back</h2>
        
        {error && <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          />
          <div style={{ textAlign: 'right' }}>
            <Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Forgot password?</Link>
          </div>
          <button className="btn-primary" type="submit" style={{ marginTop: '1rem' }}>Log In</button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', fontWeight: 'bold' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
