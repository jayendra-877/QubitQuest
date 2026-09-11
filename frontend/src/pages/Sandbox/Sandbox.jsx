import React, { useState } from 'react';
import CircuitCanvas from '../../components/CircuitCanvas/CircuitCanvas';
import SimulationResults from '../../components/SandboxVisuals/SimulationResults';
import StateVectorGraph from '../../components/SandboxVisuals/StateVectorGraph';
import StateVectorTable from '../../components/SandboxVisuals/StateVectorTable';
import BlochSphere from '../../components/SandboxVisuals/BlochSphere';

const Sandbox = () => {
  const [circuit, setCircuit] = useState([]);
  const [numQubits, setNumQubits] = useState(3);
  
  const [simulationData, setSimulationData] = useState(null);
  const [stateVectorData, setStateVectorData] = useState(null);
  const [blochSphereData, setBlochSphereData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const handleAddQubit = () => {
    if (numQubits < 8) setNumQubits(numQubits + 1);
  };

  const handleRemoveQubit = () => {
    if (numQubits > 1) {
      setCircuit(circuit.filter(g => g.qubit < numQubits - 1 && (g.target === undefined || g.target < numQubits - 1)));
      setNumQubits(numQubits - 1);
    }
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setSimulationData(null);
    setStateVectorData(null);
    setBlochSphereData(null);

    try {
      const sortedCanvasGates = [...circuit].sort((a, b) => a.step - b.step);
      const backendGates = sortedCanvasGates.map(g => {
        if (g.type === 'CNOT' || g.type === 'CZ') {
          return { type: g.type, control: g.qubit, target: g.target, params: [] };
        }
        return { type: g.type, target: g.qubit, params: [] };
      });

      const payload = {
        circuitJson: JSON.stringify({
          qubits: numQubits,
          gates: backendGates,
          shots: 1000,
          mode: "measure"
        })
      };

      const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      };

      const [resExec, resState, resBloch] = await Promise.all([
        fetch('http://localhost:8080/api/v1/playground/execute', fetchOptions).catch(e => ({ok: false, json: async () => ({error: 'Network Error'})})),
        fetch('http://localhost:8080/api/v1/playground/statevector', fetchOptions).catch(e => ({ok: false, json: async () => ({error: 'Network Error'})})),
        fetch('http://localhost:8080/api/v1/playground/bloch-sphere', fetchOptions).catch(e => ({ok: false, json: async () => ({error: 'Network Error'})}))
      ]);

      const [dataExec, dataState, dataBloch] = await Promise.all([
        resExec.ok ? resExec.json() : null,
        resState.ok ? resState.json() : null,
        resBloch.ok ? resBloch.json() : null
      ]);

      if (dataExec && dataExec.data) setSimulationData(dataExec.data);
      if (dataState && dataState.data) setStateVectorData(dataState.data);
      if (dataBloch && dataBloch.data) setBlochSphereData(dataBloch.data);
      
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to run simulation. Check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column' }}>
      <h1 className="page-title">Quantum Sandbox</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
        Experiment freely! Build a circuit and view the immediate measurement results, state vector, and Bloch sphere.
      </p>
      
      {errorMsg && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
          {errorMsg}
        </div>
      )}

      {/* Top Section: Circuit & Bloch Sphere */}
      <div style={{ display: 'flex', gap: '2rem', height: '500px' }}>
        {/* Left Pane: Circuit Builder */}
        <div className="game-card" style={{ flex: 2, padding: '1.5rem', backgroundColor: '#e0f7fa', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
            <h3 style={{ fontWeight: '900', margin: 0 }}>Circuit Builder</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem', backgroundColor: '#fff', padding: '0.2rem', borderRadius: '8px', border: '2px solid var(--color-border)' }}>
                <button onClick={handleRemoveQubit} disabled={numQubits <= 1} style={{ background: 'none', border: 'none', cursor: numQubits <= 1 ? 'not-allowed' : 'pointer', fontSize: '1.2rem', padding: '0 0.5rem', fontWeight: 'bold' }}>-</button>
                <span style={{ fontWeight: '900' }}>{numQubits} Qubits</span>
                <button onClick={handleAddQubit} disabled={numQubits >= 8} style={{ background: 'none', border: 'none', cursor: numQubits >= 8 ? 'not-allowed' : 'pointer', fontSize: '1.2rem', padding: '0 0.5rem', fontWeight: 'bold' }}>+</button>
              </div>
              <button className="btn-secondary" onClick={() => setCircuit([])} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Clear Circuit
              </button>
              <button className="btn-primary" onClick={handleRunSimulation} disabled={isLoading} style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? 'Running...' : 'Run Simulation'}
              </button>
            </div>
          </div>
          
          <div style={{ flex: 1, minHeight: 0 }}>
             <CircuitCanvas circuit={circuit} setCircuit={setCircuit} isReadonly={false} numQubits={numQubits} />
          </div>
        </div>

        {/* Right Pane: Bloch Sphere */}
        <div className="game-card" style={{ flex: 1, padding: '1.5rem', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '900', flexShrink: 0 }}>Bloch Sphere</h3>
          
          {!blochSphereData && !isLoading && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc', borderRadius: '8px' }}>
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '1.5rem' }}>
                Run the simulation to view...
              </p>
            </div>
          )}

          {isLoading && (
             <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h2 style={{ color: 'var(--color-primary)' }}>Simulating...</h2>
            </div>
          )}

          {!isLoading && blochSphereData && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <BlochSphere data={blochSphereData} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Graphs & Tables */}
      {!isLoading && (simulationData || stateVectorData) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column' }}>
            {stateVectorData && <StateVectorTable data={stateVectorData} />}
          </div>
          <div style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column' }}>
            {stateVectorData && <StateVectorGraph data={stateVectorData} />}
          </div>
          <div style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column' }}>
            {simulationData && <SimulationResults data={simulationData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sandbox;
