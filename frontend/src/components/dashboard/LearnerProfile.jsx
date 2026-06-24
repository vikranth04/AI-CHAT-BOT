import React from 'react';
import { User, Target, Brain, Award } from 'lucide-react';

const LearnerProfile = ({ data, hasProfile }) => {
  if (!hasProfile) {
    return (
      <div className="dashboard-card">
        <div className="card-title">
          <User size={14} /> Learner Profile
        </div>
        <div style={{ textAlign: 'center', padding: '1rem', border: '1px dashed #d2d2d7', borderRadius: '12px', background: '#f5f5f7' }}>
          <h4 style={{ fontSize: '0.9rem', color: '#1d1d1f', margin: '0 0 0.25rem' }}>No Profile Available</h4>
          <p style={{ fontSize: '0.75rem', color: '#86868b', margin: 0 }}>Start a conversation to create your learning identity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="card-title">
        <User size={14} /> Learner Profile
      </div>

      <div className="profile-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="info-row">
          <span className="info-label" style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#86868b' }}>Current Level</span>
          <div className="badge-pill" style={{ background: '#e1f5fe', color: '#0071e3', border: '1px solid #b3e5fc', fontWeight: 700, marginTop: '0.1rem' }}>
            {data.level}
          </div>
        </div>

        <div className="info-row">
          <span className="info-label" style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#86868b' }}>Primary Goal</span>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1d1d1f' }}>{data.goal}</div>
        </div>

        <div className="info-row">
          <span className="info-label" style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#86868b' }}>Focus Areas</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
            {data.weak_areas && data.weak_areas.length > 0 ? (
              data.weak_areas.map((area, idx) => (
                <span key={idx} className="badge-pill" style={{ fontSize: '0.65rem', background: '#f3e5f5', color: '#af52de', border: '1px solid #e1bee7', fontWeight: 600 }}>
                  {area}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#86868b' }}>General Mastery</span>
            )}
          </div>
        </div>

        <div className="progress-container" style={{ marginTop: '0.5rem' }}>
          <div className="progress-header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <span style={{ color: '#86868b' }}>COURSE PROGRESS</span>
            <span style={{ color: '#0071e3' }}>{data.progress}%</span>
          </div>
          <div className="progress-track" style={{ height: '6px', background: '#e5e5ea', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              className="progress-fill"
              style={{ width: `${data.progress}%`, background: '#0071e3' }}
            />
          </div>
          <div style={{ fontSize: '0.65rem', color: '#86868b', marginTop: '0.4rem', textAlign: 'right', fontWeight: 600 }}>
            Day {data.current_day} / 30
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerProfile;
