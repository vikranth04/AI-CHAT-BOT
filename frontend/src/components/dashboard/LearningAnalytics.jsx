import React from 'react';
import { TrendingUp, Book, CheckCircle, Zap, SpellCheck } from 'lucide-react';

const LearningAnalytics = ({ data, hasProfile }) => {
  // Requirement 7: Initialize with zero values if no profile exists
  // dashboardData.learning_analytics keys: overall_progress, vocabulary_learned, grammar_exercises, days_completed, current_streak
  const metrics = [
    {
      label: 'Progress',
      value: hasProfile ? `${data.progress}%` : '0%',
      icon: TrendingUp,
      color: '#0071e3',
      bg: '#e1f5fe'
    },
    {
      label: 'Vocabulary',
      value: hasProfile ? data.vocabulary_learned : '0',
      icon: Book,
      color: '#af52de',
      bg: '#f3e5f5'
    },
    {
      label: 'Grammar',
      value: hasProfile ? data.grammar_exercises : '0',
      icon: SpellCheck,
      color: '#ff3b30',
      bg: '#ffebee'
    },
    {
      label: 'Completed',
      value: hasProfile ? data.days_completed : '0',
      icon: CheckCircle,
      color: '#34c759',
      bg: '#e8f5e9'
    },
    {
      label: 'Streak',
      value: hasProfile ? data.current_streak : '0',
      icon: Zap,
      color: '#ff9500',
      bg: '#fff3e0'
    },
  ];

  return (
    <div className="dashboard-card">
      <div className="card-title">
        <TrendingUp size={14} /> Learning Analytics
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.75rem' }}>
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f5f5f7', borderRadius: '12px' }}>
            <div style={{ background: metric.bg, padding: '0.4rem', borderRadius: '50%', marginBottom: '0.5rem' }}>
              <metric.icon size={14} style={{ color: metric.color }} />
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1d1d1f' }}>{metric.value}</div>
            <div style={{ fontSize: '0.6rem', color: '#86868b', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.1rem' }}>{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningAnalytics;
