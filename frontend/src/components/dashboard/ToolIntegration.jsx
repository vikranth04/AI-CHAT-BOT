import React from 'react';
import { Brain, BookOpen, Languages, Volume2, SpellCheck } from 'lucide-react';

const ToolIntegration = ({ data }) => {
  if (!data) return null;

  const { vocabulary, translation, pronunciation, grammar } = data;

  // Requirement 10: Hide card if no tool data is available
  const hasData = vocabulary || translation || pronunciation || grammar;

  if (!hasData) return null;

  return (
    <div className="dashboard-card" style={{ gap: '1rem' }}>
      <div className="card-title">
        <Brain size={14} /> Tool Integration
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {vocabulary && (
          <div className="tool-box" style={{ background: '#f3e5f5', border: '1px solid #e1bee7', padding: '0.75rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <BookOpen size={12} color="#af52de" />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#af52de', textTransform: 'uppercase' }}>Vocabulary</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1d1d1f' }}>{vocabulary.word}</div>
            <div style={{ fontSize: '0.7rem', color: '#86868b', marginTop: '0.1rem' }}>{vocabulary.meaning}</div>
          </div>
        )}

        {translation && (
          <div className="tool-box" style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', padding: '0.75rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <Languages size={12} color="#34c759" />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#34c759', textTransform: 'uppercase' }}>Translation</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#86868b' }}>English: {translation.english}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1d1d1f' }}>Telugu: {translation.telugu}</div>
          </div>
        )}

        {pronunciation && (
          <div className="tool-box" style={{ background: '#e1f5fe', border: '1px solid #b3e5fc', padding: '0.75rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <Volume2 size={12} color="#0071e3" />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0071e3', textTransform: 'uppercase' }}>Pronunciation</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1d1d1f' }}>{pronunciation.word}</div>
            <div style={{ fontSize: '0.75rem', color: '#0071e3', fontStyle: 'italic' }}>{pronunciation.phonetic}</div>
          </div>
        )}

        {grammar && (
          <div className="tool-box" style={{ background: '#fff3e0', border: '1px solid #ffe0b2', padding: '0.75rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <SpellCheck size={12} color="#ff9500" />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ff9500', textTransform: 'uppercase' }}>Grammar Advisor</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1d1d1f' }}>{grammar.rule}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolIntegration;
