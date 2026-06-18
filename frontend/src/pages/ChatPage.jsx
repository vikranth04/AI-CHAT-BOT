import { useState, useRef } from "react";
import { sendMessage } from "../services/api";
import Hero from "../components/Hero";
import ProjectDescription from "../components/ProjectDescription";
import FeaturesGrid from "../components/FeaturesGrid";
import ChatDemo from "../components/ChatDemo";
import Footer from "../components/Footer";
import "./ChatPage.css";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatSectionRef = useRef(null);
  const featuresSectionRef = useRef(null);

  const scrollToChat = () => {
    setTimeout(() => {
      chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const scrollToFeatures = () => {
    featuresSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (text = message) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: trimmed,
        time: timestamp,
      },
    ]);

    setMessage("");
    setLoading(true);
    scrollToChat();

    try {
      const data = await sendMessage(trimmed);
      const responseTimestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.success ? data.response : (data.error || "An error occurred on the server."),
          feature: data.success ? data.feature : null,
          time: responseTimestamp,
        },
      ]);
    } catch (error) {
      const responseTimestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Failed to connect to the language server. Please ensure the backend is running at http://127.0.0.1:8000.",
          feature: null,
          time: responseTimestamp,
        },
      ]);
    }

    setLoading(false);
  };

  const handleFeatureClick = (prompt) => {
    handleSend(prompt);
  };

  const handlePromptClick = (prompt) => {
    handleSend(prompt);
  };

  return (
    <div className="apple-page-wrapper">
      <div className="content-wrapper">
        {/* Section 1: Hero Section */}
        <Hero
          onStartLearning={scrollToChat}
          onExploreFeatures={scrollToFeatures}
        />

        {/* Section 2: Project Description Section */}
        <ProjectDescription />

        {/* Section 3: Features Grid */}
        <FeaturesGrid
          sectionRef={featuresSectionRef}
          onFeatureClick={handleFeatureClick}
        />

        {/* Section 4 & 5: Example Questions & Chat Interface */}
        <ChatDemo
          sectionRef={chatSectionRef}
          messages={messages}
          inputMessage={message}
          setInputMessage={setMessage}
          onSendMessage={() => handleSend()}
          onPromptClick={handlePromptClick}
          isLoading={loading}
        />
      </div>

      {/* Section 8: Footer */}
      <Footer />
    </div>
  );
}