import React from 'react';
import Plot from 'react-plotly.js';

// Vibrant colors for each qubit vector
const QUBIT_COLORS = [
  '#e74c3c', // Red
  '#3498db', // Blue
  '#2ecc71', // Green
  '#f1c40f', // Yellow
  '#9b59b6', // Purple
  '#e67e22', // Orange
  '#1abc9c', // Teal
  '#34495e'  // Navy
];

const BlochSphere = ({ data }) => {
  if (!data || !data.coordinates) return null;

  const plotData = [];

  // Generate wireframe rings for the sphere
  const resolution = 50;
  const t = Array.from({length: resolution}, (_, i) => (i * Math.PI * 2) / (resolution - 1));
  
  // Equator (XY plane)
  plotData.push({
    type: 'scatter3d', mode: 'lines',
    x: t.map(val => Math.cos(val)), y: t.map(val => Math.sin(val)), z: t.map(() => 0),
    line: { color: '#ccc', width: 2, dash: 'dot' }, hoverinfo: 'none', showlegend: false
  });
  // XZ plane
  plotData.push({
    type: 'scatter3d', mode: 'lines',
    x: t.map(val => Math.cos(val)), y: t.map(() => 0), z: t.map(val => Math.sin(val)),
    line: { color: '#ccc', width: 2, dash: 'dot' }, hoverinfo: 'none', showlegend: false
  });
  // YZ plane
  plotData.push({
    type: 'scatter3d', mode: 'lines',
    x: t.map(() => 0), y: t.map(val => Math.cos(val)), z: t.map(val => Math.sin(val)),
    line: { color: '#ccc', width: 2, dash: 'dot' }, hoverinfo: 'none', showlegend: false
  });

  // Plot axes
  const axisLine = { type: 'scatter3d', mode: 'lines', line: { color: '#888', width: 2 }, hoverinfo: 'none', showlegend: false };
  plotData.push({ ...axisLine, x: [-1.2, 1.2], y: [0, 0], z: [0, 0], name: 'X' });
  plotData.push({ ...axisLine, x: [0, 0], y: [-1.2, 1.2], z: [0, 0], name: 'Y' });
  plotData.push({ ...axisLine, x: [0, 0], y: [0, 0], z: [-1.2, 1.2], name: 'Z' });

  // Add bold vectors (lines + cones as arrowheads) for each qubit
  Object.keys(data.coordinates).forEach((key, idx) => {
    const coord = data.coordinates[key];
    const color = QUBIT_COLORS[idx % QUBIT_COLORS.length];
    
    // Draw bold line from origin to (x, y, z)
    plotData.push({
      type: 'scatter3d',
      mode: 'lines+text',
      x: [0, coord.x],
      y: [0, coord.y],
      z: [0, coord.z],
      name: `Qubit ${idx}`,
      text: ['', `|q${idx}⟩`],
      textposition: 'top center',
      textfont: { size: 14, color: color },
      line: { color: color, width: 8 },
      hoverinfo: 'name'
    });

    // Draw cone (arrowhead) at the tip
    plotData.push({
      type: 'cone',
      x: [coord.x],
      y: [coord.y],
      z: [coord.z],
      u: [coord.x || 0.001], // small offset to prevent 0-length vector error in plotly
      v: [coord.y || 0.001],
      w: [coord.z || 0.001],
      sizemode: 'absolute',
      sizeref: 0.15,
      showscale: false,
      colorscale: [[0, color], [1, color]],
      hoverinfo: 'none',
      showlegend: false
    });
  });

  const layout = {
    title: 'Bloch Sphere',
    margin: { l: 0, r: 0, b: 0, t: 30 },
    scene: {
      xaxis: { visible: false, range: [-1.2, 1.2] },
      yaxis: { visible: false, range: [-1.2, 1.2] },
      zaxis: { visible: false, range: [-1.2, 1.2] },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.2 }
      },
      aspectmode: 'cube'
    },
    showlegend: true,
    legend: { x: 0, y: 1 },
    autosize: true
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', border: '2px solid var(--color-border)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Plot
        data={plotData}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', minHeight: '350px', flex: 1 }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
};

export default BlochSphere;


