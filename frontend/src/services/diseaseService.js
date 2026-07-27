import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/disease`,
});

export const detectDisease = async (image) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("image", image);

  const response = await API.post("/", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};