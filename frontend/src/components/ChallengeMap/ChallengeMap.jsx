import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChallengeMap.css';

const ChallengeMap = () => {
  const navigate = useNavigate();

  const handleZoneClick = (category) => {
    navigate(`/challenges?category=${category}`);
  };

  return (
    <div className="challenge-map-wrapper">
      <svg
        viewBox="0 0 800 500"
        xmlns="http://www.w3.org/2000/svg"
        className="challenge-map"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Ocean Background / Map Base */}
        <rect width="100%" height="100%" rx="32" className="map-ocean" />

        {/* Zone 1: Basics (Top Left Island) */}
        <g
          className="map-zone zone-basics"
          onClick={() => handleZoneClick('basics')}
        >
          <path d="M 150 100 C 200 80, 300 100, 320 180 C 340 250, 250 300, 180 280 C 100 260, 80 150, 150 100 Z" />
          <text x="210" y="190" className="zone-label">Quantum Basics</text>
        </g>

        {/* Zone 2: Superposition (Bottom Left Island) */}
        <g
          className="map-zone zone-superposition"
          onClick={() => handleZoneClick('superposition')}
        >
          <path d="M 80 350 C 130 310, 220 330, 250 380 C 280 430, 200 480, 150 460 C 90 440, 50 390, 80 350 Z" />
          <text x="160" y="400" className="zone-label">Superposition</text>
        </g>

        {/* Zone 3: Entanglement (Middle Right Island) */}
        <g
          className="map-zone zone-entanglement"
          onClick={() => handleZoneClick('entanglement')}
        >
          <path d="M 400 200 C 480 150, 600 180, 650 250 C 700 320, 620 400, 500 420 C 380 440, 350 260, 400 200 Z" />
          <text x="500" y="300" className="zone-label">Entanglement</text>
        </g>

        {/* Zone 4: Algorithms (Top Right Island) */}
        <g
          className="map-zone zone-algorithms"
          onClick={() => handleZoneClick('algorithms')}
        >
          <path d="M 550 50 C 620 30, 720 50, 750 100 C 780 150, 700 220, 650 200 C 600 180, 500 100, 550 50 Z" />
          <text x="640" y="120" className="zone-label">Algorithms</text>
        </g>
        
        {/* Decorative elements - clouds/stars */}
        <circle cx="100" cy="80" r="15" className="map-cloud" />
        <circle cx="120" cy="70" r="20" className="map-cloud" />
        <circle cx="140" cy="85" r="12" className="map-cloud" />

        <circle cx="680" cy="400" r="18" className="map-cloud" />
        <circle cx="710" cy="390" r="25" className="map-cloud" />
        <circle cx="740" cy="410" r="15" className="map-cloud" />
      </svg>
    </div>
  );
};

export default ChallengeMap;
