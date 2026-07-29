import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/market`,
  timeout: 20000,
});

export const getMarketPrices = async (
  state,
  crop,
  language = "en-IN"
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Authentication token not found"
    );
  }

  const cleanedState =
    String(state || "").trim();

  const cleanedCrop =
    String(crop || "").trim();

  if (!cleanedState || !cleanedCrop) {
    throw new Error(
      "State and crop are required"
    );
  }

  const response = await API.get("/", {
    params: {
      state: cleanedState,
      crop: cleanedCrop,
      language,
    },

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};