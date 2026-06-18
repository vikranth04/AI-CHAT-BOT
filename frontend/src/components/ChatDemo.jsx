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
  AlertCircle,
  Lightbulb,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import "./ChatDemo.css";

const EXAMPLE_QUESTIONS = [
  { text: "Translate hello to Telugu", icon: Languages },
  { text: "Correct: I am go to college everyday", icon: SpellCheck },
  { text: "Teach me 5 advanced English words", icon: BookOpen },
  { text: "Give me today's word", icon: Calendar },
  { text: "How to pronounce Environment", icon: Volume2 },
  { text: "Give synonyms of Happy", icon: Shuffle },
];

// Interactive Prompt Chip Component with ripple effect
const RippleChip = ({ text, icon: Icon, onClick, isLoading }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (isLoading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    
    // Clear ripple after animation duration
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick(text);
  };

  return (
    <motion.button
      className="question-chip"
      onClick={handleClick}
      disabled={isLoading}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <div className="chip-content">
        <Icon size={14} className="chip-icon" />
        <span>{text}</span>
      </div>
      <ArrowRight size={12} className="chip-arrow" />
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple-effect"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </motion.button>
  );
};

export default function ChatDemo({
  messages,
  inputMessage,
  setInputMessage,
  onSendMessage,
  onPromptClick,
  isLoading,
  sectionRef,
}) {
  const chatBottomRef = useRef(null);

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

  // Structured response parser that splits LLM response by standard headers
  const parseStructuredResponse = (text, headers) => {
    const sections = {};
    let currentHeader = null;
    const lines = text.split("\n");

    for (let line of lines) {
      const cleanLine = line.trim();
      if (cleanLine === "") continue;

      // Normalize line to check against header keys
      const normalizedLine = cleanLine
        .replace(/^\*+\s*/, "") // Remove starting asterisks
        .replace(/\*+$/, "")    // Remove trailing asterisks
        .replace(/:+$/, "")     // Remove colon at the end
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

    // Join arrays back to strings
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
      if (isBullet) {
        cleanLine = line.substring(2);
      } else if (isNumber) {
        cleanLine = line.replace(/^\d+\.\s/, "");
      }

      const parts = cleanLine.split(/\*\*(.*?)\*\*/g);
      const elements = parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <strong key={i} style={{ color: "#0071E3", fontWeight: "600" }}>
              {part}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={index} className="bot-bullet">
            {elements}
          </li>
        );
      }
      if (isNumber) {
        return (
          <li key={index} className="bot-number">
            {elements}
          </li>
        );
      }

      if (line.trim() === "") {
        return <div key={index} className="bot-gap" />;
      }

      return <p key={index} className="bot-para">{elements}</p>;
    });
  };

  // Maps features to their corresponding icons
  const getFeatureIcon = (feature) => {
    switch (feature) {
      case "GRAMMAR":
        return SpellCheck;
      case "TRANSLATION":
        return Languages;
      case "VOCABULARY":
        return BookOpen;
      case "PRONUNCIATION":
        return Volume2;
      case "SYNONYMS":
      case "ANTONYMS":
        return Shuffle;
      case "WORD_OF_DAY":
        return Calendar;
      case "DAILY_PHRASES":
        return Compass;
      case "CONVERSATION":
        return MessageCircle;
      default:
        return Sparkles;
    }
  };

  // Maps features to their neat readable titles
  const getFeatureTitle = (feature) => {
    switch (feature) {
      case "GRAMMAR":
        return "Grammar Advisor";
      case "TRANSLATION":
        return "Translation Hub";
      case "VOCABULARY":
        return "Vocabulary Insights";
      case "PRONUNCIATION":
        return "Pronunciation Guide";
      case "SYNONYMS":
        return "Synonym Finder";
      case "ANTONYMS":
        return "Antonym Companion";
      case "WORD_OF_DAY":
        return "Word of the Day";
      case "DAILY_PHRASES":
        return "Daily Phrase List";
      case "CONVERSATION":
        return "Conversation Coach";
      default:
        return "LingoLift Assistant";
    }
  };

  // Generic Response Card Renderer that satisfies the "Do not show plain text blocks" requirement
  const renderResponseCard = (feature, text) => {
    if (!text) return null;

    const FeatureIcon = getFeatureIcon(feature);
    const title = getFeatureTitle(feature);

    // List of all possible headers to parse across all prompts
    const allHeaders = [
      "Word of the Day", "Word", "Pronunciation", "Part of Speech", "Meaning",
      "Synonyms", "Antonyms", "Example Sentence 1", "Example Sentence 2",
      "Example Sentence", "Example (Original Word)", "Example (Antonym)",
      "Usage Example", "Example", "Usage Tip", "Memory Trick",
      "Original", "Corrected", "Explanation", "Grammar Rule", "Natural Version", "Grammar Tip",
      "Source Text", "Translation", "Brief Explanation", "Linguistic Notes",
      "Syllable Breakdown", "Sound Tips", "Speaking Tip", "Phrase", "Natural Speaking Version",
      "Situation", "Your Response", "Correction", "Follow-up Question", "Vocabulary Tip", "Usage Differences"
    ];

    const parsed = parseStructuredResponse(text, allHeaders);
    const hasKeys = Object.keys(parsed).length > 0;

    // Render plain text inside card if no structured keys were found
    if (!hasKeys) {
      return (
        <div className="response-card standard-card">
          <div className="card-header">
            <FeatureIcon size={16} className="card-icon" />
            <span>{title}</span>
          </div>
          <div className="card-body">
            <div className="formatted-bot-text">
              {renderBotText(text)}
            </div>
          </div>
        </div>
      );
    }

    // Assemble components for the unified premium response card
    const headerTitle = parsed.Word || parsed.Phrase || parsed.Situation || parsed["Word of the Day"] || title;
    
    // Core details group
    const renderCardContent = () => {
      return (
        <div className="card-content-wrapper">
          {/* Main Meaning / Translation / Corrected values */}
          {parsed.Original && (
            <div className="card-row error-row">
              <span className="row-title">Original</span>
              <p className="row-text">{parsed.Original.replace(/^["']|["']$/g, "")}</p>
            </div>
          )}

          {parsed["Source Text"] && (
            <div className="card-row standard-row">
              <span className="row-title">Source Text</span>
              <p className="row-text">{parsed["Source Text"]}</p>
            </div>
          )}

          {parsed.Corrected && (
            <div className="card-row success-row">
              <span className="row-title">Corrected</span>
              <p className="row-text">{parsed.Corrected.replace(/^["']|["']$/g, "")}</p>
            </div>
          )}

          {parsed.Translation && (
            <div className="card-row success-row">
              <span className="row-title">Translation</span>
              <p className="row-text">{parsed.Translation}</p>
            </div>
          )}

          {parsed.Pronunciation && (
            <div className="card-row info-row pronunciation-row">
              <span className="row-title">Pronunciation</span>
              <p className="row-text italic-guide">{parsed.Pronunciation}</p>
            </div>
          )}

          {parsed["Part of Speech"] && (
            <div className="card-row info-row">
              <span className="row-title">Part of Speech</span>
              <span className="badge-pill">{parsed["Part of Speech"]}</span>
            </div>
          )}

          {parsed["Syllable Breakdown"] && (
            <div className="card-row info-row">
              <span className="row-title">Syllables</span>
              <p className="row-text font-inter">{parsed["Syllable Breakdown"]}</p>
            </div>
          )}

          {parsed.Meaning && (
            <div className="card-row primary-meaning-row">
              <span className="row-title">Meaning</span>
              <p className="row-text">{parsed.Meaning}</p>
            </div>
          )}

          {parsed["Your Response"] && (
            <div className="card-row chat-response-row">
              <span className="row-title">Coach Response</span>
              <p className="row-text">{parsed["Your Response"]}</p>
            </div>
          )}

          {parsed.Correction && parsed.Correction !== "No correction needed." && (
            <div className="card-row success-row">
              <span className="row-title">Grammar Correction</span>
              <p className="row-text">{parsed.Correction}</p>
            </div>
          )}

          {parsed.Explanation && (
            <div className="card-row info-row">
              <span className="row-title">Explanation</span>
              <div className="row-html">{renderBotText(parsed.Explanation)}</div>
            </div>
          )}

          {parsed["Grammar Rule"] && (
            <div className="card-row info-row">
              <span className="row-title">Grammar Rule</span>
              <p className="row-text">{parsed["Grammar Rule"]}</p>
            </div>
          )}

          {parsed["Natural Version"] && (
            <div className="card-row info-row">
              <span className="row-title">Natural Alternative</span>
              <p className="row-text italic-guide">"{parsed["Natural Version"]}"</p>
            </div>
          )}

          {parsed["Natural Speaking Version"] && (
            <div className="card-row info-row">
              <span className="row-title">Natural Speech</span>
              <p className="row-text italic-guide">"{parsed["Natural Speaking Version"]}"</p>
            </div>
          )}

          {parsed.Synonyms && (
            <div className="card-row synonyms-row">
              <span className="row-title">Synonyms</span>
              <div className="synonyms-list">
                {parsed.Synonyms.split("\n").map((s, idx) => (
                  <span key={idx} className="synonym-tag">{s.replace(/^[•\-\*\s]+/, "")}</span>
                ))}
              </div>
            </div>
          )}

          {parsed.Antonyms && (
            <div className="card-row antonyms-row">
              <span className="row-title">Antonyms</span>
              <div className="antonyms-list">
                {parsed.Antonyms.split("\n").map((a, idx) => (
                  <span key={idx} className="antonym-tag">{a.replace(/^[•\-\*\s]+/, "")}</span>
                ))}
              </div>
            </div>
          )}

          {parsed["Usage Differences"] && (
            <div className="card-row info-row">
              <span className="row-title">Usage Details</span>
              <div className="row-html">{renderBotText(parsed["Usage Differences"])}</div>
            </div>
          )}
        </div>
      );
    };

    // Example Block Group
    const hasExample = parsed["Example Sentence 1"] || parsed["Example Sentence 2"] || parsed["Example Sentence"] || parsed["Example (Original Word)"] || parsed["Example (Antonym)"] || parsed["Usage Example"] || parsed.Example;
    const renderCardExamples = () => {
      if (!hasExample) return null;
      return (
        <div className="card-examples-area">
          <h5 className="examples-header-label">Examples</h5>
          <div className="examples-list">
            {parsed["Example (Original Word)"] && (
              <div className="example-item">
                <span className="example-item-badge">Original</span>
                <p>"{parsed["Example (Original Word)"]}"</p>
              </div>
            )}
            {parsed["Example (Antonym)"] && (
              <div className="example-item">
                <span className="example-item-badge secondary">Antonym</span>
                <p>"{parsed["Example (Antonym)"]}"</p>
              </div>
            )}
            {parsed["Example Sentence 1"] && (
              <div className="example-item">
                <p>1. "{parsed["Example Sentence 1"]}"</p>
              </div>
            )}
            {parsed["Example Sentence 2"] && (
              <div className="example-item">
                <p>2. "{parsed["Example Sentence 2"]}"</p>
              </div>
            )}
            {parsed["Example Sentence"] && (
              <div className="example-item">
                <p>"{parsed["Example Sentence"]}"</p>
              </div>
            )}
            {parsed["Usage Example"] && (
              <div className="example-item">
                <p>"{parsed["Usage Example"]}"</p>
              </div>
            )}
            {parsed.Example && !parsed["Example Sentence 1"] && (
              <div className="example-item">
                <p>"{parsed.Example}"</p>
              </div>
            )}
          </div>
        </div>
      );
    };

    // Tips Block Group
    const hasTips = parsed["Usage Tip"] || parsed["Memory Trick"] || parsed["Grammar Tip"] || parsed["Vocabulary Tip"] || parsed["Speaking Tip"] || parsed["Sound Tips"] || parsed["Brief Explanation"] || parsed["Linguistic Notes"] || parsed["Follow-up Question"];
    const renderCardTips = () => {
      if (!hasTips) return null;
      return (
        <div className="card-tips-area">
          {parsed["Usage Tip"] && (
            <div className="tip-box">
              <Lightbulb size={15} className="tip-icon-bulb" />
              <div>
                <strong>Usage Tip:</strong> {parsed["Usage Tip"]}
              </div>
            </div>
          )}
          {parsed["Memory Trick"] && (
            <div className="tip-box memory-box">
              <Sparkles size={15} className="tip-icon-sparkle" />
              <div>
                <strong>Memory Trick:</strong> {parsed["Memory Trick"]}
              </div>
            </div>
          )}
          {parsed["Grammar Tip"] && (
            <div className="tip-box">
              <CheckCircle2 size={15} className="tip-icon-check" />
              <div>
                <strong>Grammar Tip:</strong> {parsed["Grammar Tip"]}
              </div>
            </div>
          )}
          {parsed["Vocabulary Tip"] && (
            <div className="tip-box">
              <Lightbulb size={15} className="tip-icon-bulb" />
              <div>
                <strong>Vocabulary Tip:</strong> {parsed["Vocabulary Tip"]}
              </div>
            </div>
          )}
          {parsed["Speaking Tip"] && (
            <div className="tip-box">
              <Volume2 size={15} className="tip-icon-volume" />
              <div>
                <strong>Speaking Tip:</strong> {parsed["Speaking Tip"]}
              </div>
            </div>
          )}
          {parsed["Sound Tips"] && (
            <div className="tip-box">
              <Info size={15} className="tip-icon-info" />
              <div>
                <strong>Pronunciation Tip:</strong> {parsed["Sound Tips"]}
              </div>
            </div>
          )}
          {parsed["Brief Explanation"] && (
            <div className="tip-box">
              <Info size={15} className="tip-icon-info" />
              <div>
                <strong>Explanation:</strong> {parsed["Brief Explanation"]}
              </div>
            </div>
          )}
          {parsed["Linguistic Notes"] && (
            <div className="tip-box">
              <Info size={15} className="tip-icon-info" />
              <div>
                <strong>Linguistic Note:</strong> {parsed["Linguistic Notes"]}
              </div>
            </div>
          )}
          {parsed["Follow-up Question"] && (
            <div className="tip-box follow-up-box">
              <MessageCircle size={15} className="tip-icon-message" />
              <div>
                <strong>Coach's Question:</strong> <span className="follow-up-question-text">{parsed["Follow-up Question"]}</span>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="response-card premium-response-card">
        {/* Title Section */}
        <div className="card-header">
          <FeatureIcon size={16} className="card-icon" />
          <span className="card-title-text">{headerTitle}</span>
        </div>
        
        <div className="card-body">
          {/* Content Area */}
          {renderCardContent()}
          
          {/* Example Area */}
          {renderCardExamples()}
          
          {/* Tips Area */}
          {renderCardTips()}
        </div>
      </div>
    );
  };

  const getCleanBadgeLabel = (feature) => {
    if (!feature) return "";
    const cleaned = feature.replace("_", " ").toUpperCase();
    if (cleaned === "SYNONYMS" || cleaned === "ANTONYMS") {
      return "SYNONYMS & ANTONYMS";
    }
    return cleaned;
  };

  return (
    <section className="chat-section" ref={sectionRef}>
      <div className="chat-section-header">
        <h2>AI Chat Sandbox</h2>
        <p>Type queries or click an example question to start learning immediately.</p>
      </div>

      <div className="chat-workspace">
        {/* Example Questions Section */}
        <div className="example-questions-panel">
          <h3>Example Questions</h3>
          <p>Click any prompt below to trigger the AI chatbot.</p>
          <div className="questions-grid">
            {EXAMPLE_QUESTIONS.map((question, idx) => (
              <RippleChip
                key={idx}
                text={question.text}
                icon={question.icon}
                onClick={onPromptClick}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>

        {/* Chat Console Section */}
        <div className="chat-console">
          <div className="chat-console-header">
            <div className="console-title-info">
              <span className="console-status-dot"></span>
              <h4>LingoLift Chatbot</h4>
            </div>
          </div>

          <div className="chat-messages-container">
            {messages.length === 0 ? (
              <div className="chat-empty-state">
                <div className="empty-icon-circle">
                  <MessageSquare size={22} className="empty-icon" />
                </div>
                <h5>Start your conversation</h5>
                <p>Learn vocabulary, correct grammar, translate text, or ask a language-related question.</p>
              </div>
            ) : (
              <div className="messages-flow">
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    const FeatureIcon = msg.feature ? getFeatureIcon(msg.feature) : Sparkles;
                    return (
                      <motion.div
                        key={index}
                        className={`message-row ${isUser ? "user-row" : "bot-row"}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        <div className="bubble-wrapper">
                          {/* Animated Pill Badge above AI Response */}
                          {!isUser && msg.feature && (
                            <motion.div 
                              className="feature-badge"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.25, delay: 0.05 }}
                            >
                              <FeatureIcon size={12} className="badge-icon" />
                              <span>{getCleanBadgeLabel(msg.feature)}</span>
                            </motion.div>
                          )}
                          
                          <div className={`bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
                            {isUser ? (
                              <p className="bubble-plain-text">{msg.text}</p>
                            ) : (
                              renderResponseCard(msg.feature, msg.text)
                            )}
                          </div>
                          <span className="bubble-timestamp">{msg.time}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Bouncing Dots Loading Indicator */}
            {isLoading && (
              <motion.div 
                className="message-row bot-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bubble-wrapper">
                  <div className="bubble thinking-bubble">
                    <div className="thinking-container">
                      <span className="thinking-text">LingoLift is thinking</span>
                      <div className="thinking-dots">
                        <span className="dot dot-1" />
                        <span className="dot dot-2" />
                        <span className="dot dot-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Sticky Input Footer Area */}
          <div className="chat-input-area">
            <div className="input-pill">
              <input
                type="text"
                placeholder="Type a language question (e.g. Correct: I is study English)..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <motion.button
                className="send-button"
                onClick={() => onSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                title="Send query"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
