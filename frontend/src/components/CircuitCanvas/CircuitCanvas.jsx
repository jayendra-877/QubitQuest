import React from 'react';
import './CircuitCanvas.css';

const NUM_QUBITS = 3;
const NUM_STEPS = 5;

const GATE_COLORS = {
  'X': '#58cc02', // Green
  'H': '#1cb0f6', // Blue
  'CNOT': '#ff4b4b' // Red
};

const CircuitCanvas = ({ circuit, setCircuit, isReadonly = false }) => {
  
  const handleDragStart = (e, gateType) => {
    if (isReadonly) return;
    e.dataTransfer.setData('gateType', gateType);
  };

  const handleDrop = (e, qubit, step) => {
    if (isReadonly) return;
    e.preventDefault();
    const gateType = e.dataTransfer.getData('gateType');
    
    if (gateType) {
      // Remove existing gate at this position if any
      const newCircuit = circuit.filter(g => !(g.qubit === qubit && g.step === step));
      
      const newGate = { type: gateType, qubit, step };
      
      // For CNOT, default target to adjacent qubit
      if (gateType === 'CNOT') {
        newGate.target = qubit === NUM_QUBITS - 1 ? qubit - 1 : qubit + 1;
      }

      setCircuit([...newCircuit, newGate]);
    }
  };

  const handleDragOver = (e) => {
    if (isReadonly) return;
    e.preventDefault();
  };

  const handleRemoveGate = (qubit, step) => {
    if (isReadonly) return;
    setCircuit(circuit.filter(g => !(g.qubit === qubit && g.step === step)));
  };

  // Build grid
  const grid = [];
  for (let q = 0; q < NUM_QUBITS; q++) {
    const row = [];
    for (let s = 0; s < NUM_STEPS; s++) {
      const gate = circuit.find(g => g.qubit === q && g.step === s);
      row.push(
        <div 
          key={`cell-${q}-${s}`} 
          className="canvas-cell"
          onDrop={(e) => handleDrop(e, q, s)}
          onDragOver={handleDragOver}
          onClick={() => gate && handleRemoveGate(q, s)}
          title={gate && !isReadonly ? "Click to remove" : ""}
        >
          {/* Render Wire */}
          <div className="wire-line"></div>
          
          {/* Render Gate */}
          {gate && (
            <div 
              className="canvas-gate" 
              style={{ backgroundColor: GATE_COLORS[gate.type] }}
            >
              {gate.type}
            </div>
          )}

          {/* Render CNOT Target Line if applicable */}
          {gate && gate.type === 'CNOT' && gate.target !== undefined && (
            <div className={`cnot-line ${gate.target > q ? 'down' : 'up'}`}>
              <div className="cnot-target-dot"></div>
            </div>
          )}
        </div>
      );
    }
    grid.push(
      <div key={`row-${q}`} className="canvas-row">
        <div className="qubit-label">q[{q}]</div>
        {row}
      </div>
    );
  }

  return (
    <div className="circuit-canvas-container">
      {!isReadonly && (
        <div className="gate-palette game-card">
          <h4>Gates</h4>
          <div className="palette-gates">
            {Object.keys(GATE_COLORS).map(type => (
              <div 
                key={type}
                className="palette-gate"
                style={{ backgroundColor: GATE_COLORS[type] }}
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
              >
                {type}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
            Drag to wire. Click on wire to remove.
          </p>
        </div>
      )}

      <div className="canvas-grid game-card">
        {grid}
      </div>
    </div>
  );
};

export default CircuitCanvas;
