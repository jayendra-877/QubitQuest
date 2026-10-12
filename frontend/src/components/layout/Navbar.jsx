import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const getAvatarColor = (name) => {
    if (!name) return '#facc15'; // default yellow
    const colors = ['#f87171', '#60a5fa', '#34d399', '#a78bfa', '#fb923c', '#f472b6', '#4ade80'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const displayName = user?.name || user?.username || '';

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
          <img src="/cat_icon_logo.svg" className="logo-icon" alt="QubitQuest Logo" />
          <span className="logo-text">QubitQuest</span>
        </Link>

        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="navbar-links" onClick={() => setIsMenuOpen(false)}>
            {location.pathname === '/' ? (
              <button className="nav-link nav-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
            ) : (
              <Link to="/" className="nav-link">Home</Link>
            )}
            <Link to="/challenges" className="nav-link">Challenges</Link>
            <Link to="/sandbox" className="nav-link">Sandbox</Link>
            <Link to="/learning" className="nav-link">Learning</Link>
            <Link to="/arena" className="nav-link">Arena</Link>
          </div>

          <div className="navbar-auth" onClick={() => setIsMenuOpen(false)}>
            {user ? (
              <div className="user-menu">
                <div
                  className="avatar"
                  title={displayName}
                  style={{ backgroundColor: getAvatarColor(displayName) }}
                >
                  {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
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
      </div>
    </nav>
  );
};

export default Navbar;
