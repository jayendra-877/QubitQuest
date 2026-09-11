import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">Q</span>
          <span className="logo-text">QuantumEdu</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/learning" className="nav-link">Learning</Link>
          <Link to="/challenges" className="nav-link">Challenges</Link>
          
          {location.pathname === '/' ? (
            <button className="nav-link nav-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
          ) : (
            <Link to="/" className="nav-link">Home</Link>
          )}
        </div>

        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <div className="avatar" title={user.username}>
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <button className="nav-link nav-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">Log In</Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '1rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
