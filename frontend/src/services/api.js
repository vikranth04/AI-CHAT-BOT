import axios from "axios";

// Read API URL from Vite environment variables, fallback to local localhost port
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Sends a chat message to the LingoLift API backend.
 * Handles timeouts and connection failures gracefully to prevent frontend crashes.
 * 
 * @param {string} message The user query input
 * @returns {Promise<{success: boolean, response?: string, feature?: string, error?: string}>}
 */
export const sendMessage = async (message) => {
  try {
    const response = await axios.get(`${API_URL}/chat`, {
      params: {
        message: message,
      },
      timeout: 10000, // 10 seconds timeout limit
    });
    return response.data;
  } catch (error) {
    console.error("LingoLift API network error:", error);
    
    // Return structured failure response so the caller is notified of the issue gracefully
    return {
      success: false,
      error: error.response?.data?.detail || error.message || "Failed to reach the backend server.",
    };
  }
};