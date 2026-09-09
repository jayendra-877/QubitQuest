import React from 'react';

const Sandbox = () => {
  return (
    <div className="container" style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <h1 className="page-title">Quantum Sandbox</h1>
      <div style={{ display: 'flex', gap: '2rem', flex: 1, marginTop: '1rem' }}>
        <div className="game-card" style={{ flex: 2, padding: '1rem' }}>
          <h3>Circuit Builder</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Drag and drop quantum gates here...</p>
        </div>
        <div className="game-card" style={{ flex: 1, padding: '1rem' }}>
          <h3>Results</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Measurement results chart goes here...</p>
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
