import React from 'react';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* 1. Hero Section */}
      <section className="hero-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
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
        <h2 className="page-title" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Why We Built This</h2>
        <div className="game-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem', backgroundColor: '#fff' }}>
          <p style={{ color: 'var(--color-text)', fontSize: '1.2rem', fontWeight: '700', lineHeight: '1.8' }}>
            Quantum computing is the future, but learning it shouldn't require a PhD in physics. We noticed a huge gap between highly academic textbooks and accessible, hands-on learning. Our intention is to bridge that gap by gamifying quantum concepts—making them intuitive, interactive, and fun for developers and enthusiasts alike.
          </p>
        </div>
      </section>

      {/* 3. About Us Section */}
      <section id="about" className="container" style={{ padding: '4rem 2rem', margin: '2rem auto' }}>
        <h2 className="page-title" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '2rem' }}>About Us</h2>
        <div className="game-card" style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#e0f7fa' }}>
          <p style={{ color: 'var(--color-text)', fontSize: '1.2rem', fontWeight: '700', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
            We are a team of developers and quantum enthusiasts. Our goal is to democratize quantum education and build the next generation of quantum developers through an engaging, interactive platform.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            <div className="game-card" style={{ padding: '1.5rem', flex: '1 1 200px', backgroundColor: '#fff' }}>
              <h3 style={{ color: 'var(--color-primary)', fontWeight: '900', fontSize: '1.5rem' }}>Learn</h3>
              <p style={{ fontWeight: '600', marginTop: '0.5rem' }}>Bite-sized theory</p>
            </div>
            <div className="game-card" style={{ padding: '1.5rem', flex: '1 1 200px', backgroundColor: '#fff' }}>
              <h3 style={{ color: 'var(--color-secondary)', fontWeight: '900', fontSize: '1.5rem' }}>Play</h3>
              <p style={{ fontWeight: '600', marginTop: '0.5rem' }}>Interactive puzzles</p>
            </div>
            <div className="game-card" style={{ padding: '1.5rem', flex: '1 1 200px', backgroundColor: '#fff' }}>
              <h3 style={{ color: '#1cb0f6', fontWeight: '900', fontSize: '1.5rem' }}>Build</h3>
              <p style={{ fontWeight: '600', marginTop: '0.5rem' }}>Full circuit sandbox</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
