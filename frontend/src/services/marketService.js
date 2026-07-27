import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/market",
});

export const getMarketPrices = async (state, crop) => {
  const token = localStorage.getItem("token");

  const response = await API.get(
    `?state=${encodeURIComponent(state)}&crop=${encodeURIComponent(crop)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};