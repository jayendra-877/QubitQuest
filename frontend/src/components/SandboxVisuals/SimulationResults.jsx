import React from 'react';

const SimulationResults = ({ data }) => {
  if (!data || !data.probabilities) return null;

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', border: '2px solid var(--color-border)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1rem', fontWeight: '900', color: 'var(--color-primary)' }}>Simulation Results</h3>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto', paddingRight: '1rem' }}>
        {Object.entries(data.probabilities).map(([state, prob]) => (
          <div key={state} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '60px', fontWeight: 'bold', fontSize: '1rem' }}>|{state}⟩</span>
            <div style={{ flex: 1, backgroundColor: '#e0e0e0', height: '16px', borderRadius: '4px', overflow: 'hidden', margin: '0 1rem', display: 'flex' }}>
              <div style={{ width: `${prob * 100}%`, backgroundColor: 'var(--color-primary)', height: '100%', transition: 'width 0.5s ease-out' }}></div>
            </div>
            <span style={{ width: '60px', textAlign: 'right', fontWeight: 'bold' }}>{(prob * 100).toFixed(1)}%</span>
            <span style={{ width: '50px', textAlign: 'right', fontSize: '0.8rem', color: '#666' }}>({data.counts[state]})</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
        <span>Execution Time: {data.executionTimeMs}ms</span>
      </div>
    </div>
  );
};

export default SimulationResults;
