import React from 'react';

const StateVectorTable = ({ data }) => {
  if (!data || !data.statevector) return null;

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', border: '2px solid var(--color-border)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1rem', fontWeight: '900', color: 'var(--color-primary)' }}>State Vector Values</h3>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>State</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Amplitude (a + ib)</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Magnitude</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Probability</th>
            </tr>
          </thead>
          <tbody>
            {data.statevector.map((amp, index) => {
              const numQubits = data.qubits || Math.log2(data.statevector.length);
              const binaryState = index.toString(2).padStart(numQubits, '0');
              
              const real = amp.real.toFixed(4);
              const imag = amp.imaginary.toFixed(4);
              const mag = Math.sqrt(amp.real * amp.real + amp.imaginary * amp.imaginary);
              const prob = mag * mag;
              
              if (data.statevector.length > 16 && prob < 0.0001) return null;

              return (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>|{binaryState}⟩</td>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>
                    {real} {amp.imaginary >= 0 ? '+' : '-'} {Math.abs(imag)}i
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{mag.toFixed(4)}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    {(prob * 100).toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StateVectorTable;
