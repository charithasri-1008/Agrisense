import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/crop",
});

export const recommendCrop = async (data) => {
  const token = localStorage.getItem("token");

  const response = await API.post("/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};