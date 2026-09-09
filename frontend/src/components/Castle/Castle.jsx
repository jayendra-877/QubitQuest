import React from 'react';
import './Castle.css';

const Castle = ({ completed }) => {
  return (
    <div className={`castle-wrapper ${completed ? 'destroyed' : 'intact'}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        
        {/* Intact Castle */}
        <g className="castle-intact">
          {/* Main Building */}
          <rect x="20" y="50" width="80" height="60" fill="#a0a0a0" stroke="#000" strokeWidth="4" />
          {/* Left Tower */}
          <rect x="10" y="30" width="30" height="80" fill="#b0b0b0" stroke="#000" strokeWidth="4" />
          <polygon points="10,30 25,10 40,30" fill="#ff4b4b" stroke="#000" strokeWidth="4" />
          {/* Right Tower */}
          <rect x="80" y="30" width="30" height="80" fill="#b0b0b0" stroke="#000" strokeWidth="4" />
          <polygon points="80,30 95,10 110,30" fill="#ff4b4b" stroke="#000" strokeWidth="4" />
          {/* Door */}
          <path d="M 45 110 L 45 80 A 15 15 0 0 1 75 80 L 75 110 Z" fill="#654321" stroke="#000" strokeWidth="4" />
        </g>

        {/* Destroyed Castle */}
        <g className="castle-ruins">
          {/* Taller Rubble Main */}
          <polygon points="10,110 30,50 60,80 90,40 110,110" fill="#7a7a7a" stroke="#000" strokeWidth="4" />
          {/* Broken Tower Left */}
          <rect x="10" y="60" width="30" height="50" fill="#808080" stroke="#000" strokeWidth="4" />
          <polygon points="5,110 15,60 35,90" fill="#909090" />
          {/* Broken Tower Right */}
          <rect x="80" y="50" width="30" height="60" fill="#808080" stroke="#000" strokeWidth="4" />
          <polygon points="75,110 95,70 115,90" fill="#909090" />
          
          {/* Huge Fire / Smoke particles */}
          <circle cx="40" cy="30" r="12" fill="#ff4b4b" className="fire-flicker" />
          <circle cx="80" cy="40" r="10" fill="#ff8c00" className="fire-flicker" style={{ animationDelay: '0.2s' }} />
          <circle cx="50" cy="60" r="14" fill="#ff8c00" className="fire-flicker" style={{ animationDelay: '0.4s' }} />
          <circle cx="60" cy="20" r="15" fill="#555" className="smoke-rise" />
        </g>

      </svg>
    </div>
  );
};

export default Castle;
