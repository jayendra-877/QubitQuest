import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const StateVectorGraph = ({ data }) => {
  if (!data || !data.statevector) return null;

  const numQubits = data.qubits || Math.log2(data.statevector.length);
  
  // Transform data for recharts
  const chartData = data.statevector.map((amp, index) => {
    const binaryState = index.toString(2).padStart(numQubits, '0');
    const mag = Math.sqrt(amp.real * amp.real + amp.imaginary * amp.imaginary);
    const prob = mag * mag;
    
    return {
      state: `|${binaryState}⟩`,
      real: parseFloat(amp.real.toFixed(4)),
      imaginary: parseFloat(amp.imaginary.toFixed(4)),
      probability: prob,
      magnitude: mag
    };
  }).filter(item => {
    // Hide states with very tiny probabilities if there are too many states
    if (data.statevector.length > 16 && item.probability < 0.0001) return false;
    return true;
  });

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', border: '2px solid var(--color-border)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1rem', fontWeight: '900', color: 'var(--color-primary)' }}>State Vector Amplitudes</h3>
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="state" tick={{ fontSize: 12, fontWeight: 'bold' }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              cursor={{fill: '#f5f5f5'}} 
              contentStyle={{ borderRadius: '8px', border: '2px solid var(--color-border)', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontWeight: 'bold' }} />
            <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
            <Bar dataKey="real" name="Real (a)" fill="#3498db" radius={[4, 4, 0, 0]} />
            <Bar dataKey="imaginary" name="Imaginary (b)" fill="#e74c3c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StateVectorGraph;
