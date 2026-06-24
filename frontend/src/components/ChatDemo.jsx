import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Languages,
  SpellCheck,
  BookOpen,
  Volume2,
  Shuffle,
  Calendar,
  MessageSquare,
  ArrowRight,
  Compass,
  MessageCircle,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { updateCompletedTasks, completeDay } from "../services/api";
import LearnerProfile from "./dashboard/LearnerProfile";
import LearningAnalytics from "./dashboard/LearningAnalytics";
import AgentStatus from "./dashboard/AgentStatus";
import Roadmap from "./dashboard/Roadmap";
import TodayPlan from "./dashboard/TodayPlan";
import ToolIntegration from "./dashboard/ToolIntegration";
import AgentReasoning from "./dashboard/AgentReasoning";
import AgentActivityFeed from "./dashboard/AgentActivityFeed";
import JourneyTimeline from "./dashboard/JourneyTimeline";
import "../styles/dashboard.css";
import "./ChatDemo.css";

const EXAMPLE_QUESTIONS = [
  { text: "I want to improve English", icon: Sparkles },
  { text: "Create a 30-Day Placement English Plan", icon: Calendar },
  { text: "What should I study today?", icon: Compass },
  { text: "Translate \"How are you?\" to Telugu", icon: Languages },
  { text: "Meaning of perseverance", icon: BookOpen },
];

export default function ChatDemo({
  messages,
  inputMessage,
  setInputMessage,
  onSendMessage,
  onPromptClick,
  isLoading,
  sectionRef,
  dashboardData,
  agentStatus,
  statusMessage,
  onRefreshDashboard
}) {
  const chatBottomRef = useRef(null);
  const [updatingTask, setUpdatingTask] = useState(false);
  const [advancingDay, setAdvancingDay] = useState(false);

  // Extract last intent from messages
  const lastIntent = messages.filter(m => m.role === 'assistant' && m.intent).pop()?.intent;

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleToggleTask = async (idx) => {
    if (updatingTask || !dashboardData?.today_plan?.tasks) return;
    
    const tasks = dashboardData.today_plan.tasks;
    const updated = tasks.map((t, i) => i === idx ? { ...t, completed: !t.completed } : t);
    
    try {
      setUpdatingTask(true);
      const completedNames = updated.filter(t => t.completed).map(t => t.name);
      await updateCompletedTasks(completedNames);
      if (onRefreshDashboard) {
        await onRefreshDashboard();
      }
    } catch (err) {
      console.error("Failed to update tasks:", err);
    } finally {
      setUpdatingTask(false);
    }
  };

  const handleCompleteDay = async () => {
    if (advancingDay) return;
    try {
      setAdvancingDay(true);
      const res = await completeDay();
      if (res && res.success) {
        if (onRefreshDashboard) {
          await onRefreshDashboard();
        }
      }
    } catch (err) {
      console.error("Failed to advance day:", err);
    } finally {
      setAdvancingDay(false);
    }
  };

  const parseStructuredResponse = (text, headers) => {
    const sections = {};
    let currentHeader = null;
    const lines = text.split("\n");

    for (let line of lines) {
      const cleanLine = line.trim();
      if (cleanLine === "") continue;

      const normalizedLine = cleanLine
        .replace(/^\*+\s*/, "")
        .replace(/\*+$/, "")
        .replace(/:+$/, "")
        .trim()
        .toLowerCase();

      let matchedHeader = null;
      for (let header of headers) {
        const lowerHeader = header.toLowerCase();
        if (
          normalizedLine === lowerHeader ||
          normalizedLine.startsWith(lowerHeader + ":") ||
          normalizedLine.startsWith(lowerHeader)
        ) {
          matchedHeader = header;
          break;
        }
      }

      if (matchedHeader) {
        currentHeader = matchedHeader;
        sections[currentHeader] = [];
      } else if (currentHeader) {
        sections[currentHeader].push(line);
      }
    }

    for (let key in sections) {
      sections[key] = sections[key].join("\n").trim();
    }

    return sections;
  };

  const renderBotText = (text) => {
    if (!text) return null;
    const lines = text.split("\n");

    return lines.map((line, index) => {
      const isBullet = line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ");
      const isNumber = /^\d+\.\s/.test(line);

      let cleanLine = line;
      if (isBullet) cleanLine = line.substring(2);
      else if (isNumber) cleanLine = line.replace(/^\d+\.\s/, "");

      const parts = cleanLine.split(/\*\*(.*?)\*\*/g);
      const elements = parts.map((part, i) => {
        if (i % 2 === 1) return <strong key={i} style={{ color: "var(--accent-blue)", fontWeight: "600" }}>{part}</strong>;
        return part;
      });

      if (isBullet) return <li key={index} className="bot-bullet">{elements}</li>;
      if (isNumber) return <li key={index} className="bot-number">{elements}</li>;
      if (line.trim() === "") return <div key={index} className="bot-gap" />;
      return <p key={index} className="bot-para">{elements}</p>;
    });
  };

  const getFeatureIcon = (feature) => {
    switch (feature) {
      case "GRAMMAR": return SpellCheck;
      case "TRANSLATION": return Languages;
      case "VOCABULARY": return BookOpen;
      case "PRONUNCIATION": return Volume2;
      case "SYNONYMS":
      case "ANTONYMS": return Shuffle;
      case "WORD_OF_DAY": return Calendar;
      case "DAILY_PHRASES": return Compass;
      case "CONVERSATION": return MessageCircle;
      default: return Sparkles;
    }
  };

  const getFeatureTitle = (feature) => {
    switch (feature) {
      case "GRAMMAR": return "Grammar Advisor";
      case "TRANSLATION": return "Translation Hub";
      case "VOCABULARY": return "Vocabulary Insights";
      case "PRONUNCIATION": return "Pronunciation Guide";
      case "SYNONYMS": return "Synonym Finder";
      case "ANTONYMS": return "Antonym Companion";
      case "WORD_OF_DAY": return "Word of the Day";
      case "DAILY_PHRASES": return "Daily Phrase List";
      case "CONVERSATION": return "Conversation Coach";
      default: return "LingoLift Assistant";
    }
  };

  const renderResponseCard = (feature, text) => {
    if (!text) return null;
    const FeatureIcon = getFeatureIcon(feature);
    const title = getFeatureTitle(feature);
    const allHeaders = ["Word", "Pronunciation", "Meaning", "Usage Tip", "Memory Trick", "Original", "Corrected", "Explanation", "Translation"];
    const parsed = parseStructuredResponse(text, allHeaders);
    const headerTitle = parsed.Word || parsed.Phrase || title;
    
    return (
      <div className="response-card premium-response-card" style={{ background: '#ffffff', border: '1px solid #d2d2d7', borderRadius: '12px', padding: '1rem', color: '#1d1d1f' }}>
        <div className="card-header" style={{ borderBottom: '1px solid #f5f5f7', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
          <FeatureIcon size={16} style={{ color: '#0071e3' }} />
          <span style={{ fontWeight: 600, marginLeft: '0.5rem' }}>{headerTitle}</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="card-content-wrapper">
            {parsed.Original && (
              <div className="card-row error-row" style={{ background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: '8px', padding: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="row-title" style={{ fontSize: '0.7rem', color: '#cf1322' }}>Original</span>
                <p className="row-text" style={{ margin: 0 }}>{parsed.Original.replace(/^["']|["']$/g, "")}</p>
              </div>
            )}
            {parsed.Corrected && (
              <div className="card-row success-row" style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px', padding: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="row-title" style={{ fontSize: '0.7rem', color: '#389e0d' }}>Corrected</span>
                <p className="row-text" style={{ margin: 0 }}>{parsed.Corrected.replace(/^["']|["']$/g, "")}</p>
              </div>
            )}
            {parsed.Translation && (
              <div className="card-row success-row" style={{ background: '#f0f5ff', border: '1px solid #adc6ff', borderRadius: '8px', padding: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="row-title" style={{ fontSize: '0.7rem', color: '#1d39c4' }}>Translation</span>
                <p className="row-text" style={{ margin: 0 }}>{parsed.Translation}</p>
              </div>
            )}
            {parsed.Meaning && (
              <div className="card-row primary-meaning-row" style={{ marginBottom: '0.5rem' }}>
                <span className="row-title" style={{ fontSize: '0.7rem', color: '#86868b' }}>Meaning</span>
                <p className="row-text" style={{ margin: 0, fontWeight: 500 }}>{parsed.Meaning}</p>
              </div>
            )}
            {parsed.Explanation && <div className="info-row" style={{ fontSize: '0.9rem' }}>{renderBotText(parsed.Explanation)}</div>}
          </div>
          {!Object.keys(parsed).length && <div className="formatted-bot-text">{renderBotText(text)}</div>}

          {(parsed["Usage Tip"] || parsed["Memory Trick"]) && (
            <div className="card-tips-area" style={{ marginTop: '0.75rem', borderTop: '1px solid #f5f5f7', paddingTop: '0.75rem' }}>
              {parsed["Usage Tip"] && (
                <div className="tip-box" style={{ background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '8px', padding: '0.5rem' }}>
                  <Lightbulb size={15} style={{ color: '#1890ff' }} />
                  <div style={{ fontSize: '0.85rem' }}><strong>Usage Tip:</strong> {parsed["Usage Tip"]}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getCleanBadgeLabel = (feature) => feature?.replace("_", " ").toUpperCase() || "";
  const hasProfile = dashboardData?.has_profile === true;

  return (
    <section className="chat-section" ref={sectionRef} style={{ background: '#f5f5f7', width: '100%', padding: '4rem 0' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '3rem', alignItems: 'start' }}>

        {/* CHAT PANEL */}
        <div className="chat-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
          <div className="agent-status-bar" style={{ background: '#ffffff', borderColor: '#d2d2d7', color: '#1d1d1f', borderRadius: '16px', padding: '1rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div className="status-indicator">
              <span className="status-dot-pulse" style={{ backgroundColor: agentStatus === 'Planning' ? '#ff9500' : agentStatus === 'Executing' ? '#0071e3' : '#34c759' }} />
              <span style={{ fontWeight: 600 }}>{agentStatus}</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#86868b' }}>{statusMessage}</span>
          </div>

          <div className="example-queries-box" style={{ background: '#ffffff', borderColor: '#d2d2d7', borderRadius: '16px', padding: '1.25rem' }}>
            <div className="queries-chips-grid">
              {EXAMPLE_QUESTIONS.map((q, i) => (
                <button key={i} className="query-chip-btn" onClick={() => onPromptClick(q.text)} style={{ background: '#f5f5f7', borderColor: '#d2d2d7', color: '#1d1d1f', borderRadius: '20px', padding: '0.6rem 1rem' }}>
                  <q.icon size={13} style={{ color: '#0071e3' }} />
                  <span style={{ fontWeight: 500 }}>{q.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="chat-console-dashboard" style={{ background: '#ffffff', borderColor: '#d2d2d7', height: '650px', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="chat-messages-container" style={{ background: '#ffffff', flex: 1, overflowY: 'auto' }}>
              {messages.length === 0 ? (
                <div className="chat-empty-state">
                  <div className="empty-icon-circle" style={{ background: 'rgba(0, 113, 227, 0.08)' }}><MessageSquare size={32} color="#0071e3" /></div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1.5rem' }}>LingoLift AI Agent</h3>
                  <p style={{ color: '#86868b', maxWidth: '300px', margin: '0.5rem auto' }}>
                    {hasProfile ? `Ready to continue your ${dashboardData.learner_profile.goal} roadmap?` : 'Your personalized AI language partner is ready to start.'}
                  </p>
                </div>
              ) : (
                <div className="messages-flow" style={{ padding: '1rem' }}>
                  {messages.map((msg, i) => (
                    <motion.div key={i} className={`message-row ${msg.role === 'user' ? 'user-row' : 'bot-row'}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="bubble-wrapper">
                        {msg.role === 'assistant' && msg.intent && (
                          <div className="feature-badge" style={{ background: '#0071e3', borderRadius: '12px', padding: '2px 8px', fontSize: '0.65rem' }}>
                            <span>{getCleanBadgeLabel(msg.intent)}</span>
                          </div>
                        )}
                        <div className={`bubble ${msg.role === 'user' ? 'user-bubble' : 'bot-bubble'}`} style={msg.role === 'user' ? { background: '#0071e3', color: '#fff' } : { background: '#f5f5f7', color: '#1d1d1f', border: '1px solid #d2d2d7' }}>
                          {msg.role === 'user' ? <p style={{ margin: 0, padding: '0.75rem 1rem' }}>{msg.text}</p> : renderResponseCard(msg.intent, msg.text)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
            <div className="chat-input-area" style={{ background: '#ffffff', borderTop: '1px solid #d2d2d7', padding: '1.25rem' }}>
              <div className="input-pill" style={{ background: '#f5f5f7', borderColor: '#d2d2d7', borderRadius: '24px', padding: '0.4rem 0.6rem 0.4rem 1.25rem' }}>
                <input type="text" placeholder="Ask anything..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={handleKeyDown} style={{ color: '#1d1d1f', fontSize: '1rem' }} />
                <button className="send-button" onClick={() => onSendMessage()} style={{ background: '#0071e3', borderRadius: '50%', width: '36px', height: '36px' }}><ArrowUp size={18} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD PANEL */}
        <div className="dashboard-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Thinking & Memory Context */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <AgentReasoning dashboardData={dashboardData} lastIntent={lastIntent} agentStatus={agentStatus} />
            <LearnerProfile data={dashboardData?.learner_profile} hasProfile={hasProfile} />
          </div>

          <JourneyTimeline dashboardData={dashboardData} />

          {/* Grid for Plan and Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <TodayPlan
              data={dashboardData?.today_plan}
              hasProfile={hasProfile}
              onToggleTask={handleToggleTask}
              onCompleteDay={handleCompleteDay}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <LearningAnalytics data={dashboardData?.learning_analytics} hasProfile={hasProfile} />
              <AgentStatus status={agentStatus} message={statusMessage} />
              <AgentActivityFeed dashboardData={dashboardData} />
            </div>
          </div>

          {/* Grid for Roadmap and Tools */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Roadmap data={dashboardData?.roadmap} hasProfile={hasProfile} />
            <ToolIntegration data={dashboardData?.tool_usage} />
          </div>
        </div>
      </div>
    </section>
  );
}
