import axios from "axios";

const API = axios.create({
  baseURL: `${
    import.meta.env.VITE_API_URL
  }/api/weather`,
});

export const getWeather = async (
  city,
  language = "en-IN"
) => {
  const token =
    localStorage.getItem("token");

  const response = await API.get("/", {
    params: {
      city,
      language,
    },

    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  return response.data;
};