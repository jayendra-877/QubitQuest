import React from 'react';
import { useNavigate } from 'react-router-dom';
import Castle from '../../components/Castle/Castle';
import './Challenges.css';

// Hardcoded static data for UI testing
const HARDCODED_LEVELS = {
  2: {
    theme: 'The Volcanic Crags',
    challenges: [
      { id: 'c4', type: 'debug', title: 'Fix the Entanglement', completed: false },
      { id: 'c3', type: 'predict', title: 'Predict Superposition', completed: false }
    ]
  },
  1: {
    theme: 'The Grasslands',
    challenges: [
      { id: 'c2', type: 'build', title: 'Build a NOT Gate', completed: false },
      { id: 'c1', type: 'predict', title: 'Predict the Bit Flip', completed: true }
    ]
  }
};

const LEVEL_THEMES = {
  1: { 
    gradient: 'linear-gradient(135deg, #aed581 0%, #66bb6a 100%)', 
    path: '#c5e1a5', 
    decorType: 'grass' 
  },
  2: { 
    gradient: 'linear-gradient(135deg, #ff8a65 0%, #e53935 100%)', 
    path: '#ffab91', 
    decorType: 'rock' 
  }
};

// Retro-style Decorative SVGs
const GrassDecor = ({ top, left, scale = 1 }) => (
  <svg style={{ position: 'absolute', top, left, transform: `scale(${scale})`, opacity: 0.5, zIndex: 1, pointerEvents: 'none' }} width="60" height="40" viewBox="0 0 60 40">
    <path d="M10 40 Q20 20 5 5 M30 40 Q35 15 30 0 M50 40 Q40 20 55 10" stroke="#2e7d32" strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
);

const RockDecor = ({ top, left, scale = 1 }) => (
  <svg style={{ position: 'absolute', top, left, transform: `scale(${scale})`, opacity: 0.7, zIndex: 1, pointerEvents: 'none' }} width="70" height="50" viewBox="0 0 70 50">
    <path d="M5 50 L20 20 L35 35 L55 10 L65 50 Z" fill="#795548" stroke="#3e2723" strokeWidth="4" strokeLinejoin="round" />
    <path d="M20 20 L35 35 M55 10 L35 35" stroke="#3e2723" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const Challenges = () => {
  const navigate = useNavigate();
  const sortedLevelKeys = Object.keys(HARDCODED_LEVELS).sort((a, b) => b - a);

  // Helper to render random decorations
  const renderDecorations = (type) => {
    const decors = [];
    for(let i=0; i<6; i++) {
      const top = `${Math.random() * 80 + 10}%`;
      const left = `${Math.random() * 80 + 10}%`;
      const scale = 0.5 + Math.random() * 1;
      if (type === 'grass') {
        decors.push(<GrassDecor key={i} top={top} left={left} scale={scale} />);
      } else {
        decors.push(<RockDecor key={i} top={top} left={left} scale={scale} />);
      }
    }
    return decors;
  };

  return (
    <div className="gamified-map-wrapper">
      {sortedLevelKeys.map((levelNum) => {
        const level = HARDCODED_LEVELS[levelNum];
        const theme = LEVEL_THEMES[levelNum] || LEVEL_THEMES[1];

        return (
          <section 
            key={levelNum} 
            className="level-zone"
            style={{ background: theme.gradient, position: 'relative' }}
          >
            {/* Background Decorations */}
            {renderDecorations(theme.decorType)}

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              
              <div className="level-header">
                <h2>Level {levelNum}</h2>
                <p>{level.theme}</p>
              </div>
              
              <div className="isometric-path">
                {level.challenges.map((chal, index) => {
                  const isLeft = index % 2 === 0;
                  // For the very first element (bottom), don't draw the connective path below it
                  const isFirst = index === 0 && levelNum === "1"; 
                  
                  return (
                    <div 
                      key={chal.id} 
                      className={`iso-node ${isLeft ? 'iso-left' : 'iso-right'} ${isFirst ? 'is-start' : ''}`}
                    >
                      {/* Isometric Tile Base */}
                      <div 
                        className="iso-tile" 
                        style={{ backgroundColor: theme.path, borderColor: 'rgba(0,0,0,0.3)' }}
                        onClick={() => navigate(`/challenges/${chal.id}`)}
                      >
                        {/* Un-rotated Content standing on the tile */}
                        <div className="iso-content">
                          <Castle completed={chal.completed} />
                          <div className="castle-label">
                            <span className="chal-type">{chal.type.toUpperCase()}</span>
                            <strong>{chal.title}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Challenges;
