import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/weather",
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