import axios from "axios";

const API = axios.create({
  baseURL: `${
    import.meta.env.VITE_API_URL
  }/api/weather`,
});

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token");

  return token
    ? {
        Authorization:
          `Bearer ${token}`,
      }
    : {};
};

export const getWeather = async (
  city,
  language = "en-IN"
) => {
  const cleanCity =
    String(city || "").trim();

  if (!cleanCity) {
    throw new Error(
      "City name is required"
    );
  }

  const response =
    await API.get("/", {
      params: {
        city: cleanCity,
        language,
      },

      headers:
        getAuthHeaders(),
    });

  return response.data;
};

export const getWeatherByLocation =
  async (
    latitude,
    longitude,
    language = "en-IN"
  ) => {
    const parsedLatitude =
      Number(latitude);

    const parsedLongitude =
      Number(longitude);

    if (
      !Number.isFinite(
        parsedLatitude
      ) ||
      !Number.isFinite(
        parsedLongitude
      )
    ) {
      throw new Error(
        "Valid latitude and longitude are required"
      );
    }

    const response =
      await API.get(
        "/location",
        {
          params: {
            latitude:
              parsedLatitude,

            longitude:
              parsedLongitude,

            language,
          },

          headers:
            getAuthHeaders(),
        }
      );

    return response.data;
  };

export const getForecast = async (
  latitude,
  longitude,
  language = "en-IN"
) => {
  const parsedLatitude =
    Number(latitude);

  const parsedLongitude =
    Number(longitude);

  if (
    !Number.isFinite(
      parsedLatitude
    ) ||
    !Number.isFinite(
      parsedLongitude
    )
  ) {
    throw new Error(
      "Valid latitude and longitude are required"
    );
  }

  const response =
    await API.get("/forecast", {
      params: {
        latitude:
          parsedLatitude,

        longitude:
          parsedLongitude,

        language,
      },

      headers:
        getAuthHeaders(),
    });

  return response.data;
};