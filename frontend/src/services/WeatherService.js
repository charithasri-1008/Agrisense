import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/weather`,
});

export const getWeather = async (city) => {
  const token = localStorage.getItem("token");

  const response = await API.get(`?city=${city}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};