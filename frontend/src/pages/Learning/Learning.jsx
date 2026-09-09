import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './Learning.css';

const API_URL = 'http://localhost:5000/api';

const Learning = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [topicContent, setTopicContent] = useState(null);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState(null);

  // Fetch topics on mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/topics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to fetch topics');
        
        const data = await res.json();
        // Sort by order_number ascending
        const sorted = data.sort((a, b) => a.order_number - b.order_number);
        setTopics(sorted);
        
        if (sorted.length > 0) {
          setSelectedTopicId(sorted[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, []);

  // Fetch full content when a topic is selected
  useEffect(() => {
    const fetchContent = async () => {
      if (!selectedTopicId) return;
      
      setLoadingContent(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/topics/${selectedTopicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to fetch topic content');
        
        const data = await res.json();
        setTopicContent(data);
      } catch (err) {
        console.error(err);
        setTopicContent({ content: 'Failed to load content.' });
      } finally {
        setLoadingContent(false);
      }
    };

    fetchContent();
  }, [selectedTopicId]);

  if (loadingTopics) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <h2 className="page-title">Scanning Quantum Data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="game-card" style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="game-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>No Topics Available Yet!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container learning-layout">
      
      {/* LEFT SIDEBAR: Topic List */}
      <aside className="game-card sidebar">
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: '900', textTransform: 'uppercase' }}>Modules</h3>
        <ul className="topic-list">
          {topics.map(topic => (
            <li key={topic.id}>
              <button 
                className={`topic-btn ${selectedTopicId === topic.id ? 'active' : ''}`}
                onClick={() => setSelectedTopicId(topic.id)}
              >
                <span className="topic-number">{topic.order_number}</span>
                <span className="topic-title">{topic.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN PANEL: Content */}
      <section className="game-card content-panel">
        {loadingContent ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <h2>Loading Module...</h2>
          </div>
        ) : topicContent ? (
          <div className="markdown-content">
            <ReactMarkdown>{topicContent.content}</ReactMarkdown>
          </div>
        ) : (
          <div>Select a topic to start learning.</div>
        )}
      </section>

    </div>
  );
};

export default Learning;
