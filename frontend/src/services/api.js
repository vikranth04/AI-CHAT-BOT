import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

export default api;

/**
 * Sends a chat message to the LingoLift API backend.
 */
export const sendMessage = async (message) => {
  try {
    const response = await api.post("/chat/", {
      user_id: "test_user",
      message: message,
    });
    return response.data;
  } catch (error) {
    console.error("LingoLift API network error:", error);
    return {
      success: false,
      error: "Unable to connect to the LingoLift AI backend service.",
    };
  }
};

/**
 * Fetches current user progress dashboard and memory profile statistics.
 */
export const fetchDashboardData = async () => {
  try {
    const response = await api.get("/dashboard-data", {
      params: {
        user_id: "test_user",
      },
    });
    return response.data;
  } catch (error) {
    console.error("LingoLift API dashboard-data fetch error:", error);
    return {
      success: false,
      error: "Unable to connect to the LingoLift AI backend service.",
    };
  }
};

/**
 * Saves task completion states.
 */
export const updateCompletedTasks = async (completedTasks) => {
  try {
    const response = await api.post("/update-tasks", {
      user_id: "test_user",
      completed_tasks: completedTasks,
    });
    return response.data;
  } catch (error) {
    console.error("LingoLift API update-tasks error:", error);
    return {
      success: false,
      error: "Unable to connect to the LingoLift AI backend service.",
    };
  }
};

/**
 * Advances the user to the next day.
 */
export const completeDay = async () => {
  try {
    const response = await api.post("/complete-day", {
      user_id: "test_user",
    });
    return response.data;
  } catch (error) {
    console.error("LingoLift API complete-day error:", error);
    return {
      success: false,
      error: "Unable to connect to the LingoLift AI backend service.",
    };
  }
};
