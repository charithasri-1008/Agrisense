import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/crop`,
  timeout: 30000,
});

export const recommendCrop = async (data) => {
  const token = localStorage.getItem("token");

  const response = await API.post("/", data, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  return response.data;
};