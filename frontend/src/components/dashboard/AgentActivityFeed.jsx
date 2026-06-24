import React from 'react';
import { History, Clock } from 'lucide-react';

const AgentActivityFeed = ({ dashboardData }) => {
  if (!dashboardData?.has_profile) return null;

  // Simulate activities based on data changes
  const activities = [
    { time: 'Just now', desc: 'Curriculum Synchronization' },
    { time: '1 min ago', desc: `Progress sync: ${dashboardData.learning_analytics?.progress}%` },
    { time: '5 mins ago', desc: 'Long-term memory retrieval' },
    { time: '10 mins ago', desc: 'Agent session initialized' }
  ];

  return (
    <div className="dashboard-card">
      <div className="card-title">
        <History size={14} /> Activity Feed
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {activities.map((act, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', borderLeft: '2px solid #f5f5f7', paddingLeft: '0.75rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', background: i === 0 ? '#0071e3' : '#d2d2d7' }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1d1d1f' }}>{act.desc}</div>
              <div style={{ fontSize: '0.6rem', color: '#86868b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Clock size={10} /> {act.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentActivityFeed;
