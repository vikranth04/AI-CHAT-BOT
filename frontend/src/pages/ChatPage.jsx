import { useState, useRef, useEffect } from "react";
import { sendMessage, fetchDashboardData } from "../services/api";
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
  const [dashboardData, setDashboardData] = useState(null);
  const [agentStatus, setAgentStatus] = useState("Idle");
  const [statusMessage, setStatusMessage] = useState("Idle - Ready to assist");

  const chatSectionRef = useRef(null);
  const featuresSectionRef = useRef(null);

  const loadDashboard = async () => {
    try {
      const res = await fetchDashboardData();
      if (res && res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

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

    // 1. Analyzing Intent
    setAgentStatus("Analyzing Intent");
    setStatusMessage("Classifying user request and identifying goals...");

    const memoryTimeout = setTimeout(() => {
      // 2. Retrieving Memory
      setAgentStatus("Retrieving Memory");
      setStatusMessage("Fetching learner profile and past performance...");
    }, 600);

    const planTimeout = setTimeout(() => {
      // 3. Generating Plan
      setAgentStatus("Generating Plan");
      setStatusMessage("Constructing reasoning path for optimal response...");
    }, 1200);

    const toolsTimeout = setTimeout(() => {
      // 4. Executing Tools
      setAgentStatus("Executing Tools");
      setStatusMessage("Running internal linguistic engines and cross-referencing...");
    }, 1800);

    const responseTimeout = setTimeout(() => {
      // 5. Generating Response
      setAgentStatus("Generating Response");
      setStatusMessage("Finalizing personalized AI response...");
    }, 2400);

    try {
      const data = await sendMessage(trimmed);

      clearTimeout(memoryTimeout);
      clearTimeout(planTimeout);
      clearTimeout(toolsTimeout);
      clearTimeout(responseTimeout);

      // 6. Completed
      setAgentStatus("Completed");
      setStatusMessage("Response generation successful!");

      const responseTimestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.success ? data.response : (data.error || "An error occurred on the server."),
          intent: data.success ? data.intent : null,
          time: responseTimestamp,
        },
      ]);

      // Reload dashboard memory/progress values - SYNC AFTER CHAT
      await loadDashboard();

    } catch (error) {
      clearTimeout(memoryTimeout);
      clearTimeout(planTimeout);
      clearTimeout(toolsTimeout);
      clearTimeout(responseTimeout);

      setAgentStatus("Idle");
      setStatusMessage("Unable to connect to the LingoLift AI backend service.");

      const responseTimestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to connect to the LingoLift AI backend service. Please check your internet connection.",
          intent: null,
          time: responseTimestamp,
        },
      ]);
    }

    setLoading(false);

    // Revert status to Idle after 2.5 seconds
    setTimeout(() => {
      setAgentStatus("Idle");
      setStatusMessage("Idle - Ready to assist");
    }, 2500);
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
      </div>

      {/* Section 4 & 5: Example Questions & Chat Interface */}
      {/* Moved out of content-wrapper to allow full-width background */}
      <ChatDemo
        sectionRef={chatSectionRef}
        messages={messages}
        inputMessage={message}
        setInputMessage={setMessage}
        onSendMessage={() => handleSend()}
        onPromptClick={handlePromptClick}
        isLoading={loading}
        dashboardData={dashboardData}
        agentStatus={agentStatus}
        statusMessage={statusMessage}
        onRefreshDashboard={loadDashboard}
      />

      <Footer />
    </div>
  );
}
