import React from 'react';
import { Brain, Database, Wrench, Zap, MessageSquare } from 'lucide-react';

const AgentReasoning = ({ dashboardData, lastIntent, agentStatus }) => {
  if (!dashboardData?.has_profile && agentStatus === "Idle") return null;

  const reasoning = {
    intent: lastIntent || "ANALYZING_INTENT",
    memory: {
      goal: dashboardData?.learner_profile?.goal || "None",
      level: dashboardData?.learner_profile?.level || "None",
      weak_areas: dashboardData?.learner_profile?.weak_areas?.join(', ') || "None"
    },
    tool: dashboardData?.tool_usage ? Object.keys(dashboardData.tool_usage).filter(k => dashboardData.tool_usage[k]).pop() : "None",
    action: dashboardData?.today_plan ? `Optimizing Day ${dashboardData.today_plan.day} Curriculum` : "Retrieving Memory"
  };

  return (
    <div className="dashboard-card" style={{ background: '#f8f9ff', border: '1px solid #e0e7ff' }}>
      <div className="card-title" style={{ color: '#4f46e5' }}>
        <Brain size={14} /> Agent Reasoning
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Zap size={14} color="#f59e0b" style={{ marginTop: '0.2rem' }} />
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#86868b', textTransform: 'uppercase' }}>Intent Detected</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1d1d1f' }}>{reasoning.intent}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Database size={14} color="#4f46e5" style={{ marginTop: '0.2rem' }} />
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#86868b', textTransform: 'uppercase' }}>Memory Context</div>
            <div style={{ fontSize: '0.75rem', color: '#1d1d1f' }}>
               Goal: <strong>{reasoning.memory.goal}</strong><br/>
               Level: {reasoning.memory.level}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Wrench size={14} color="#10b981" style={{ marginTop: '0.2rem' }} />
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#86868b', textTransform: 'uppercase' }}>Tool Execution</div>
            <div style={{ fontSize: '0.8rem', color: '#1d1d1f', fontWeight: 600 }}>{reasoning.tool?.toUpperCase() || "NONE"}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <MessageSquare size={14} color="#0071e3" style={{ marginTop: '0.2rem' }} />
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#86868b', textTransform: 'uppercase' }}>Current Action</div>
            <div style={{ fontSize: '0.8rem', color: '#0071e3', fontWeight: 600 }}>{reasoning.action}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentReasoning;
