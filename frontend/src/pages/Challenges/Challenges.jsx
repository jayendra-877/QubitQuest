import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Challenges.css';

// Coordinates estimated from the 287x1024 image
// top is 0 at top, 100% at bottom
// left is 0 at left, 100% at right
// Stage 1 (Bottom): 4 levels
// Stage 2 (Middle): 3 levels
// Stage 3 (Top): 3 levels
const QUESTS = [
  { id: 'c1', stage: 1, title: 'Quest 1', completed: true,  top: '91.8%', left: '76.6%' },
  { id: 'c2', stage: 1, title: 'Quest 2', completed: false, top: '79.5%', left: '88.0%' },
  { id: 'c3', stage: 1, title: 'Quest 3', completed: false, top: '77.0%', left: '54.0%' },
  { id: 'c4', stage: 1, title: 'Quest 4', completed: false, top: '69.0%', left: '29.6%' },

  { id: 'c5', stage: 2, title: 'Quest 5', completed: false, top: '48.8%', left: '80.1%' },
  { id: 'c6', stage: 2, title: 'Quest 6', completed: false, top: '44.5%', left: '34.8%' },
  { id: 'c7', stage: 2, title: 'Quest 7', completed: false, top: '36.1%', left: '12.2%' },

  { id: 'c8', stage: 3, title: 'Quest 8', completed: false, top: '22.4%', left: '87.1%' },
  { id: 'c9', stage: 3, title: 'Quest 9', completed: false, top: '18.5%', left: '50.5%' },
  { id: 'c10', stage: 3,title: 'Quest 10',completed: false, top: '12.7%', left: '29.6%' }
];

const Challenges = () => {
  const navigate = useNavigate();

  return (
    <div className="challenges-page">
      <div className="map-wrapper">
        <img src="/pathway_svg_1.svg" alt="Quest Map" className="map-image" />
        
        {QUESTS.map((quest, index) => (
          <button 
            key={quest.id}
            className={`quest-node ${quest.completed ? 'completed' : 'locked'}`}
            style={{ top: quest.top, left: quest.left }}
            onClick={() => navigate(`/challenges/${quest.id}`)}
            title={quest.title}
          >
            <span className="quest-number">{index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Challenges;
