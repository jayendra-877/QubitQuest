import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* 1. Hero Section */}
      <section className="hero-section" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container hero-content" style={{ textAlign: 'center' }}>
          <h1 className="page-title" style={{ fontSize: '5rem', marginBottom: '1rem' }}>
            Quantum Computing,<br/>Unleashed.
          </h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)', marginBottom: '3rem', fontWeight: '700' }}>
            Level up your quantum mechanics knowledge.
          </p>
        </div>
      </section>
      
      {/* 2. Motive / Intention Section */}
      <section className="container" style={{ padding: '2rem 2rem', textAlign: 'center' }}>
        <h2 className="page-title animate-up" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Why We Built This</h2>
        <div className="motive-grid">
          <div className="game-card animate-up hover-lift" style={{ padding: '2rem', backgroundColor: '#fff', textAlign: 'left' }}>
            <h3 style={{ color: 'var(--color-primary)', fontWeight: '900', fontSize: '1.5rem', marginBottom: '1rem' }}>No PhD Required</h3>
            <p style={{ fontWeight: '600', lineHeight: '1.6', color: 'var(--color-text)' }}>Quantum computing shouldn't be locked behind advanced degrees. We make it accessible for any enthusiastic developer to start learning.</p>
          </div>
          
          <div className="game-card animate-up hover-lift" style={{ padding: '2rem', backgroundColor: '#fff', textAlign: 'left' }}>
            <h3 style={{ color: 'var(--color-secondary)', fontWeight: '900', fontSize: '1.5rem', marginBottom: '1rem' }}>Gamified Approach</h3>
            <p style={{ fontWeight: '600', lineHeight: '1.6', color: 'var(--color-text)' }}>We replace dense academic textbooks with intuitive, interactive puzzles that make learning complex quantum logic fun and engaging.</p>
          </div>

          <div className="game-card animate-up hover-lift" style={{ padding: '2rem', backgroundColor: '#fff', textAlign: 'left' }}>
            <h3 style={{ color: '#1cb0f6', fontWeight: '900', fontSize: '1.5rem', marginBottom: '1rem' }}>Bridge the Gap</h3>
            <p style={{ fontWeight: '600', lineHeight: '1.6', color: 'var(--color-text)' }}>There is a massive gap between theoretical physics and practical programming. We provide the missing hands-on link for software engineers.</p>
          </div>

          <div className="game-card animate-up hover-lift" style={{ padding: '2rem', backgroundColor: '#fff', textAlign: 'left' }}>
            <h3 style={{ color: '#ff9600', fontWeight: '900', fontSize: '1.5rem', marginBottom: '1rem' }}>Interactive Sandbox</h3>
            <p style={{ fontWeight: '600', lineHeight: '1.6', color: 'var(--color-text)' }}>Reading about superposition is one thing, but manipulating quantum gates to instantly visualize state changes builds true, deep intuition.</p>
          </div>

          <div className="game-card animate-up hover-lift" style={{ padding: '2rem', backgroundColor: '#fff', textAlign: 'left' }}>
            <h3 style={{ color: '#ce82ff', fontWeight: '900', fontSize: '1.5rem', marginBottom: '1rem' }}>Visual Learning</h3>
            <p style={{ fontWeight: '600', lineHeight: '1.6', color: 'var(--color-text)' }}>We demystify complex mathematics, like Bloch spheres and probability amplitudes, through immediate, beautiful visual feedback.</p>
          </div>

          <div className="game-card animate-up hover-lift" style={{ padding: '2rem', backgroundColor: '#fff', textAlign: 'left' }}>
            <h3 style={{ color: '#ff4b4b', fontWeight: '900', fontSize: '1.5rem', marginBottom: '1rem' }}>Future-Proofing</h3>
            <p style={{ fontWeight: '600', lineHeight: '1.6', color: 'var(--color-text)' }}>Quantum computing is the next massive frontier in technology. Our goal is to empower the foundational generation of quantum developers.</p>
          </div>
        </div>
      </section>

      {/* 3. Explore Section */}
      <section id="explore" style={{ padding: '4rem 2rem', margin: '2rem auto', maxWidth: '95%' }}>
        <h2 className="page-title animate-up" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '2rem' }}>Explore QubitQuest</h2>
        <div className="game-card animate-up" style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#e0f7fa' }}>
          <p style={{ color: 'var(--color-text)', fontSize: '1.6rem', fontWeight: '700', maxWidth: '1400px', margin: '0 auto', lineHeight: '1.8', marginBottom: '4rem' }}>
            Whether you're starting from scratch or looking to test your skills, we have everything you need. Dive into our bite-sized theory lessons, challenge yourself with interactive puzzles, or experiment freely in our quantum sandbox.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
            <button className="game-btn hover-lift" onClick={() => navigate('/challenges')} style={{ fontSize: '1.5rem', padding: '1.5rem 2rem', backgroundColor: 'var(--color-primary)', color: 'white', border: '4px solid #fff', borderRadius: '12px', cursor: 'pointer', fontWeight: '900' }}>
              Challenge Yourself!
            </button>
            <button className="game-btn hover-lift" onClick={() => navigate('/learning')} style={{ fontSize: '1.5rem', padding: '1.5rem 2rem', backgroundColor: 'var(--color-secondary)', color: 'white', border: '4px solid #fff', borderRadius: '12px', cursor: 'pointer', fontWeight: '900' }}>
              Start Learning
            </button>
            <button className="game-btn hover-lift" onClick={() => navigate('/sandbox')} style={{ fontSize: '1.5rem', padding: '1.5rem 2rem', backgroundColor: '#1cb0f6', color: 'white', border: '4px solid #fff', borderRadius: '12px', cursor: 'pointer', fontWeight: '900' }}>
              Open Sandbox
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
