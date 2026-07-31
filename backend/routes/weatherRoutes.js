const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  getWeather,
  getWeatherByLocation,
} = require(
  "../controllers/weatherController"
);

const {
  getFiveDayForecast,
} = require(
  "../controllers/weatherForecastController"
);

router.get(
  "/forecast",
  authMiddleware,
  getFiveDayForecast
);

router.get(
  "/location",
  authMiddleware,
  getWeatherByLocation
);

router.get(
  "/",
  authMiddleware,
  getWeather
);

module.exports = router;