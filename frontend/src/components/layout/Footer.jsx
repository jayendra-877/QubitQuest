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
            <span>QubitQuest</span>
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

        {/* Right Side: Team Members */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '900', fontSize: '1.5rem', color: 'var(--color-primary)' }}>Our Team</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="team-member">
              <strong style={{ fontSize: '1.1rem' }}>Krish Mishra</strong><br/>
              <a href="mailto:24bcs130@ietdavv.edu.in" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>24bcs130@ietdavv.edu.in</a>
            </div>
            <div className="team-member">
              <strong style={{ fontSize: '1.1rem' }}>Jayendra Vishwakarma</strong><br/>
              <a href="mailto:24bcs126@ietdavv.edu.in" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>24bcs126@ietdavv.edu.in</a>
            </div>
            <div className="team-member">
              <strong style={{ fontSize: '1.1rem' }}>Shourya Malviya</strong><br/>
              <a href="mailto:24btc063@ietdavv.edu.in" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>24btc063@ietdavv.edu.in</a>
            </div>
            <div className="team-member">
              <strong style={{ fontSize: '1.1rem' }}>Dhruv Chourey</strong><br/>
              <a href="mailto:24bit025@ietdavv.edu.in" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>24bit025@ietdavv.edu.in</a>
            </div>
            <div className="team-member">
              <strong style={{ fontSize: '1.1rem' }}>Mahak Bansal</strong><br/>
              <a href="mailto:24bcs134@ietdavv.edu.in" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>24bcs134@ietdavv.edu.in</a>
            </div>
            <div className="team-member">
              <strong style={{ fontSize: '1.1rem' }}>Ansh Zamde</strong><br/>
              <a href="mailto:24bcs107@ietdavv.edu.in" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>24bcs107@ietdavv.edu.in</a>
            </div>
          </div>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 QubitQuest. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
