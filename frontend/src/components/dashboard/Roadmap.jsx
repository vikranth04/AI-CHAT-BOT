import React from 'react';
import { Layers, Check, Lock, Play } from 'lucide-react';

const Roadmap = ({ data, hasProfile }) => {
  if (!hasProfile || !data) {
    return (
      <div className="dashboard-card">
        <div className="card-title">
          <Layers size={16} /> 30-Day Roadmap
        </div>
        <div className="profile-empty" style={{ padding: '1rem', textAlign: 'center', color: '#86868b', fontSize: '0.8rem' }}>
          No roadmap generated yet
        </div>
      </div>
    );
  }

  // Render roadmap dynamically based on keys returned by backend
  // Backend returns: { "week1": { "name": "...", "status": "..." }, ... }
  const roadmapKeys = Object.keys(data).sort(); // Sort to ensure sequence

  return (
    <div className="dashboard-card">
      <div className="card-title">
        <Layers size={16} /> 30-Day Roadmap
      </div>

      <div className="roadmap-timeline" style={{ marginTop: '0.5rem' }}>
        {roadmapKeys.map((key, idx) => {
          const weekData = data[key];
          const isCompleted = weekData?.status === 'completed';
          const isActive = weekData?.status === 'in-progress';

          // Format key (e.g., "week1" -> "Week 1")
          const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/(\d+)/, ' $1');

          return (
            <div key={idx} className={`roadmap-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              <div className="roadmap-icon">
                {isCompleted ? <Check size={12} /> : isActive ? <Play size={10} fill="currentColor" /> : <Lock size={10} />}
              </div>
              <div className="roadmap-content">
                <div style={{ fontSize: '0.65rem', color: '#86868b', fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 500, color: isCompleted || isActive ? '#1d1d1f' : '#86868b' }}>
                  {weekData?.name || 'Locked'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
