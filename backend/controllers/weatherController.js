const axios = require("axios");

const getWeather = async (req, res) => {
  try {
    const city = req.query.city || "Hyderabad";

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    res.json({
      success: true,
      city: response.data.name,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch weather data",
    });
  }
};

module.exports = {
  getWeather,
};