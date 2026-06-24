import React from 'react';
import { Compass, CheckCircle2, Circle, Target, ChevronRight, BarChart, Flag } from 'lucide-react';

const TodayPlan = ({ data, hasProfile, onToggleTask, onCompleteDay }) => {
  // Requirement 8: Empty State if no plan exists
  if (!hasProfile || !data) {
    return (
      <div className="dashboard-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#f5f5f7', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <Compass size={28} color="#86868b" />
        </div>
        <h4 style={{ fontSize: '1rem', color: '#1d1d1f', margin: '0 0 0.5rem', fontWeight: 700 }}>Curriculum Locked</h4>
        <p style={{ fontSize: '0.8rem', color: '#86868b', margin: 0, lineHeight: 1.4 }}>Initialize your learning profile in the chat to generate today's plan.</p>
      </div>
    );
  }

  const allCompleted = data.tasks && data.tasks.length > 0 && data.tasks.every(t => t.completed);

  return (
    <div className="dashboard-card" style={{ gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="card-title" style={{ color: '#0071e3' }}>
          <Compass size={16} /> TODAY'S PLAN
        </div>
        <div style={{ background: '#0071e3', color: '#fff', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 }}>
          DAY {data.day}
        </div>
      </div>

      <div style={{ background: '#f5f5f7', padding: '1rem', borderRadius: '12px', border: '1px solid #d2d2d7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Target size={14} color="#0071e3" />
          <span style={{ fontSize: '0.7rem', color: '#86868b', fontWeight: 700 }}>OBJECTIVE</span>
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1d1d1f', lineHeight: 1.4 }}>
          {data.objective}
        </div>
      </div>

      <div className="tasks-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ fontSize: '0.7rem', color: '#86868b', fontWeight: 700, marginBottom: '0.2rem' }}>TASKS TO COMPLETE</div>
        {data.tasks.map((task, idx) => (
          <div
            key={idx}
            onClick={() => onToggleTask(idx)}
            className="task-item-premium"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.8rem',
              padding: '0.75rem',
              borderRadius: '10px',
              background: task.completed ? '#f6ffed' : '#fff',
              border: `1px solid ${task.completed ? '#b7eb8f' : '#d2d2d7'}`,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ marginTop: '0.1rem' }}>
              {task.completed ? <CheckCircle2 size={18} color="#34c759" /> : <Circle size={18} color="#d2d2d7" />}
            </div>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#86868b' : '#1d1d1f',
              lineHeight: 1.3
            }}>
              {task.name}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
        <div style={{ background: '#f5f5f7', padding: '0.75rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <BarChart size={12} color="#86868b" />
            <span style={{ fontSize: '0.6rem', color: '#86868b', fontWeight: 700 }}>ASSESSMENT</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#1d1d1f', lineHeight: 1.3 }}>{data.assessment}</div>
        </div>
        <div style={{ background: '#f5f5f7', padding: '0.75rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <Flag size={12} color="#86868b" />
            <span style={{ fontSize: '0.6rem', color: '#86868b', fontWeight: 700 }}>OUTCOME</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#1d1d1f', lineHeight: 1.3 }}>{data.expected_outcome}</div>
        </div>
      </div>

      {allCompleted ? (
        <button
          onClick={onCompleteDay}
          style={{
            marginTop: '0.5rem',
            padding: '1rem',
            background: '#34c759',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            boxShadow: '0 4px 12px rgba(52, 199, 89, 0.2)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          COMPLETE DAY & ADVANCE <ChevronRight size={18} />
        </button>
      ) : (
        <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.75rem', color: '#86868b', fontStyle: 'italic' }}>
          Complete all tasks to unlock next day
        </div>
      )}
    </div>
  );
};

export default TodayPlan;
