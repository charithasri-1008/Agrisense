import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/chat`,
});

export const askAI = async (message) => {
  const token = localStorage.getItem("token");

  const response = await API.post(
    "/",
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};