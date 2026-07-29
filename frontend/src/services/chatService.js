import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn(
    "VITE_API_URL is not configured in the frontend environment file."
  );
}

const API = axios.create({
  baseURL: `${API_URL}/api/chat`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const askAI = async (
  message,
  language = "en-IN"
) => {
  const cleanMessage = message?.trim();

  if (!cleanMessage) {
    throw new Error(
      "Please enter a valid question."
    );
  }

  const supportedLanguages = [
    "en-IN",
    "te-IN",
    "hi-IN",
    "ta-IN",
    "kn-IN",
    "ml-IN",
  ];

  const selectedLanguage =
    supportedLanguages.includes(language)
      ? language
      : "en-IN";

  const token =
    localStorage.getItem("token");

  const headers = {};

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  try {
    const response = await API.post(
      "/",
      {
        message: cleanMessage,
        language: selectedLanguage,
      },
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Chat service error:",
      error?.response?.data ||
        error?.message
    );

    if (error.code === "ECONNABORTED") {
      throw new Error(
        "The AI response is taking too long. Please try again."
      );
    }

    throw error;
  }
};