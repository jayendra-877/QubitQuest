import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="container footer-container">
        
        {/* Left Side: Brand and Socials */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div className="footer-brand">
            <span className="logo-icon small">Q</span>
            <span>QuantumEdu</span>
          </div>
          <p style={{ color: 'var(--color-text)', fontWeight: '600', marginTop: '1rem', marginBottom: '2rem' }}>
            Leveling up the world's quantum computing skills.
          </p>
          <div className="footer-social">
            <a href="#">Twitter</a>
            <a href="#">GitHub</a>
            <a href="#">Discord</a>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div style={{ flex: 1, minWidth: '300px' }} className="game-card contact-card">
          <h3 style={{ marginBottom: '1rem', fontWeight: '900', fontSize: '1.5rem', color: 'var(--color-primary)' }}>Send us a message</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Your Name" 
              className="gamified-input"
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="gamified-input"
            />
            <textarea 
              placeholder="How can we help?" 
              rows="3" 
              className="gamified-input"
              style={{ resize: 'vertical' }}
            ></textarea>
            <button className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>Send</button>
          </form>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 QuantumEdu. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
