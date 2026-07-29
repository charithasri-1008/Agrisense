import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/disease`,
  timeout: 60000,
});

export const detectDisease = async (
  image,
  language = "en-IN"
) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("image", image);
  formData.append("language", language);

  const response = await API.post("/", formData, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  return response.data;
};