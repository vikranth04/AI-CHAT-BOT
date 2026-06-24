import React from 'react';
import { Activity } from 'lucide-react';

const AgentStatus = ({ status, message }) => {
  // Required execution timeline steps
  const steps = [
    { label: 'Analyzing Intent' },
    { label: 'Retrieving Memory' },
    { label: 'Generating Plan' },
    { label: 'Executing Tools' },
    { label: 'Generating Response' },
    { label: 'Progress Update' }
  ];

  const getStatusColor = () => {
    switch (status) {
      case 'Analyzing Intent': return '#ff9500'; // Amber
      case 'Retrieving Memory': return '#af52de'; // Purple
      case 'Generating Plan': return '#5856d6'; // Indigo
      case 'Executing Tools': return '#0071e3'; // Blue
      case 'Generating Response': return '#5ac8fa'; // Cyan
      case 'Completed': return '#34c759'; // Green
      default: return '#34c759'; // Idle (Ready)
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-title">
        <Activity size={14} /> Agent Intelligence Pipeline
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
        <div className="status-dot-pulse" style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          boxShadow: `0 0 8px ${getStatusColor()}`
        }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1d1d1f' }}>{status}</span>
      </div>

      <div className="pipeline-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
        {steps.map((step, idx) => {
          // Logic to show progression
          const stepOrder = steps.map(s => s.label);
          const currentIndex = stepOrder.indexOf(status);
          const isPast = currentIndex > idx || status === 'Completed';
          const isActive = status === step.label;

          return (
            <div key={idx} className={`pipeline-step ${isActive || isPast ? 'active' : ''}`} style={{ opacity: isActive || isPast ? 1 : 0.3 }}>
              <div className="step-dot" style={{ background: isPast ? '#34c759' : isActive ? getStatusColor() : '#d2d2d7' }} />
              <span className="step-name" style={{ fontWeight: isActive ? 700 : 500, color: isActive ? '#1d1d1f' : '#86868b' }}>
                {step.label} {isPast && '✓'}
              </span>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: '0.7rem', color: '#86868b', marginTop: '0.75rem', fontStyle: 'italic', lineHeight: 1.3 }}>
        {message}
      </p>
    </div>
  );
};

export default AgentStatus;
