import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/market",
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