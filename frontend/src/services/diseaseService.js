import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/disease",
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