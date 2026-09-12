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
  
  const [projectName, setProjectName] = useState('Untitled Project');
  const [projectDesc, setProjectDesc] = useState('');
  const [showAI, setShowAI] = useState(false);
  
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', message: "Hello! I'm QuantaAI. How can I help you with your quantum circuit today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const handleAddQubit = () => {
    if (numQubits < 8) setNumQubits(numQubits + 1);
  };

  const handleRemoveQubit = () => {
    if (numQubits > 1) {
      setCircuit(circuit.filter(g => g.qubit < numQubits - 1 && (g.target === undefined || g.target < numQubits - 1)));
      setNumQubits(numQubits - 1);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', message: userMsg }]);
    setIsChatLoading(true);

    try {
      const sortedCanvasGates = [...circuit].sort((a, b) => a.step - b.step);
      const backendGates = sortedCanvasGates.map(g => {
        if (g.type === 'CNOT' || g.type === 'CZ' || g.type === 'SWAP') {
          return { type: g.type, control: g.qubit, target: g.target, params: [] };
        }
        return { type: g.type, target: g.qubit, params: [] };
      });

      const payload = {
        circuitJson: JSON.stringify({
          qubits: numQubits,
          gates: backendGates
        }),
        description: projectDesc,
        message: userMsg
      };

      const res = await fetch('http://localhost:8080/api/v1/playground/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data && data.data) {
        let aiCircuit = null;
        let aiNumQubits = 3;
        if (data.data.circuitJson) {
          try {
            const parsed = JSON.parse(data.data.circuitJson);
            aiNumQubits = parsed.qubits || 3;
            if (parsed.gates && Array.isArray(parsed.gates)) {
              aiCircuit = parsed.gates.map((g, i) => {
                if (g.control !== undefined) {
                  return { type: g.type, qubit: g.control, target: g.target, step: i };
                }
                return { type: g.type, qubit: g.target, step: i };
              });
            }
          } catch (e) {
            console.error("Error parsing AI circuit JSON", e);
          }
        }
        setChatMessages(prev => [...prev, { role: 'ai', message: data.data.message, circuit: aiCircuit, circuitQubits: aiNumQubits }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', message: "Sorry, I couldn't process that request." }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'ai', message: "An error occurred while connecting to QuantaAI." }]);
    } finally {
      setIsChatLoading(false);
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
        if (g.type === 'CNOT' || g.type === 'CZ' || g.type === 'SWAP') {
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
      {/* HEADER ROW */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem', padding: '0 1rem' }}>
        <h1 className="page-title" style={{ textAlign: 'left', margin: 0, fontSize: '2.5rem' }}>Quantum Sandbox</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', width: '100%', maxWidth: '800px' }}>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={{ flex: 1, fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'left', border: '2px solid var(--color-border)', borderRadius: '8px', padding: '0.5rem' }}
              placeholder="Project Name"
            />
            <textarea 
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              style={{ flex: 2, fontSize: '1rem', textAlign: 'left', border: '2px solid var(--color-border)', borderRadius: '8px', padding: '0.5rem', fontFamily: 'inherit', resize: 'vertical', minHeight: '45px' }}
              placeholder="Project Description"
            />
          </div>
          
          <div>
            <button 
              className="btn-primary" 
              style={{ 
                padding: '0.6rem 1.5rem', 
                fontSize: '1rem',
                backgroundColor: showAI ? '#ff4b4b' : '',
                borderColor: showAI ? '#cc0000' : ''
              }} 
              onClick={() => setShowAI(!showAI)}
            >
              {showAI ? 'Close AI ✕' : 'Ask QuantaAI'}
            </button>
          </div>
        </div>
      </div>
      
      {errorMsg && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
          {errorMsg}
        </div>
      )}

      {/* Main Sandbox & AI/Sphere Area */}
      <div style={{ display: 'flex', gap: '2rem', height: '600px', marginBottom: '2rem' }}>
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

        {/* Right Pane: Sphere or AI Chat */}
        <div className="game-card" style={{ flex: 1, padding: '1.5rem', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {showAI ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--color-primary)', fontWeight: '900' }}>QuantaAI Assistant</h3>
              </div>
              <div style={{ flex: 1, backgroundColor: '#e0f7fa', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', overflowY: 'auto', border: '2px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ 
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : '#fff',
                    color: msg.role === 'user' ? '#fff' : 'var(--color-text)',
                    padding: '0.8rem 1rem',
                    borderRadius: '8px',
                    border: msg.role === 'user' ? 'none' : '2px solid var(--color-border)',
                    maxWidth: '85%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{msg.message}</p>
                    {msg.circuit && (
                      <div style={{ marginTop: '1rem', borderTop: '2px dashed #ccc', paddingTop: '1rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Suggested Circuit:</p>
                        <div style={{ backgroundColor: '#fff', padding: '0.5rem', borderRadius: '8px', border: '2px solid var(--color-border)', overflowX: 'auto' }}>
                          <CircuitCanvas circuit={msg.circuit} setCircuit={() => {}} isReadonly={true} numQubits={msg.circuitQubits} />
                        </div>
                        <button 
                          onClick={() => {
                            setCircuit(msg.circuit);
                            setNumQubits(msg.circuitQubits);
                          }}
                          style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Use This Circuit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isChatLoading && (
                  <div style={{ alignSelf: 'flex-start', backgroundColor: '#fff', padding: '0.8rem 1rem', borderRadius: '8px', border: '2px solid var(--color-border)', color: '#666', fontWeight: 'bold', fontStyle: 'italic' }}>
                    QuantaAI is thinking...
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Ask something..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  disabled={isChatLoading}
                  style={{ flex: 1, padding: '0.8rem', border: '3px solid var(--color-border)', borderRadius: '8px', fontFamily: 'inherit', fontWeight: 'bold' }} 
                />
                <button 
                  className="btn-primary" 
                  onClick={handleSendChatMessage}
                  disabled={isChatLoading || !chatInput.trim()}
                  style={{ padding: '0 1.5rem', fontWeight: 'bold' }}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
          )}
        </div>
      </div>

      {/* Enlarged Bloch Sphere (Only when AI is shown) */}
      {showAI && (
        <div className="game-card" style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', marginBottom: '2rem', display: 'flex', flexDirection: 'column', height: '500px' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '900', textAlign: 'center' }}>Bloch Sphere</h3>
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
      )}

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
