import React from 'react';
import { Calendar } from 'lucide-react';

const JourneyTimeline = ({ dashboardData }) => {
  if (!dashboardData?.has_profile) return null;

  const currentDay = dashboardData.learner_profile?.current_day || 1;
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
      <div className="card-title">
        <Calendar size={14} /> 30-Day Learning Journey
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: '0.4rem', marginTop: '0.5rem' }}>
        {days.map(day => {
          const isCompleted = day < currentDay;
          const isCurrent = day === currentDay;

          return (
            <div
              key={day}
              title={`Day ${day}`}
              style={{
                height: '24px',
                borderRadius: '4px',
                background: isCompleted ? '#34c759' : isCurrent ? '#0071e3' : '#f5f5f7',
                border: isCurrent ? '2px solid #0071e3' : '1px solid #d2d2d7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: (isCompleted || isCurrent) ? '#fff' : '#86868b'
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyTimeline;
