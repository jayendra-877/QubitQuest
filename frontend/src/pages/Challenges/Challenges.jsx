import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Challenges.css';

// Coordinates estimated from the 287x1024 image
// top is 0 at top, 100% at bottom
// left is 0 at left, 100% at right
// Stage 1 (Bottom): 4 levels
// Stage 2 (Middle): 3 levels
// Stage 3 (Top): 3 levels
const QUESTS = [
  { id: 'c1', stage: 1, title: 'Quest 1', completed: true, top: '91.8%', left: '76.6%' },
  { id: 'c2', stage: 1, title: 'Quest 2', completed: false, top: '79.5%', left: '88.0%' },
  { id: 'c3', stage: 1, title: 'Quest 3', completed: false, top: '77.0%', left: '54.0%' },
  { id: 'c4', stage: 1, title: 'Quest 4', completed: false, top: '69.0%', left: '29.6%' },

  { id: 'c5', stage: 2, title: 'Quest 5', completed: false, top: '48.8%', left: '80.1%' },
  { id: 'c6', stage: 2, title: 'Quest 6', completed: false, top: '44.5%', left: '34.8%' },
  { id: 'c7', stage: 2, title: 'Quest 7', completed: false, top: '36.1%', left: '12.2%' },

  { id: 'c8', stage: 3, title: 'Quest 8', completed: false, top: '22.4%', left: '87.1%' },
  { id: 'c9', stage: 3, title: 'Quest 9', completed: false, top: '18.5%', left: '50.5%' },
  { id: 'c10', stage: 3, title: 'Quest 10', completed: false, top: '12.7%', left: '29.6%' }
];

const API_URL = 'http://localhost:8080/api/v1';

const Challenges = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [challengesList, setChallengesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch(`${API_URL}/challenges?userId=1`);
        const json = await res.json();
        if (json.data) {
          // Flatten all challenges from all missions into a single array
          const allChallenges = [];
          json.data.forEach(mission => {
            // Keep the limit of 4 per mission if we want to respect the previous "4 per level" rule,
            // or just take them all. The new map has exactly 10 nodes defined.
            // I'll push all of them, the layout handles up to 10 gracefully based on the QUESTS coords.
            mission.challenges.forEach(chal => {
              allChallenges.push({ ...chal, missionTitle: mission.title });
            });
          });
          setChallengesList(allChallenges);
        }
      } catch (e) {
        console.error("Failed to load map data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (location.state && location.state.returnFrom) {
          const element = document.getElementById(`challenge-node-${location.state.returnFrom}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
          }
        }
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [loading, location.state]);

  if (loading) {
    return (
      <div className="challenges-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
        <h2>Loading Map...</h2>
      </div>
    );
  }

  return (
    <div className="challenges-page">
      <div className="map-wrapper">
        <img src="/pathway_svg_1.svg" alt="Quest Map" className="map-image" />

        {challengesList.map((chal, index) => {
          // Map backend challenge to the hardcoded coordinates from QUESTS based on index
          const pos = QUESTS[index] || { top: '50%', left: '50%' };
          const isCompleted = chal.userStatus === 'COMPLETED';

          return (
            <button
              key={chal.id}
              id={`challenge-node-${chal.id}`}
              className={`quest-node ${isCompleted ? 'completed' : 'locked'}`}
              style={{ top: pos.top, left: pos.left }}
              onClick={() => navigate(`/challenges/${chal.id}`)}
              title={`${chal.missionTitle} - ${chal.title} (${chal.challengeType})`}
            >
              <span className="quest-number">{index + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;
