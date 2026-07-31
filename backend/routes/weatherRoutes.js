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

/*
 * Current-location weather
 *
 * GET /api/weather/location
 */
router.get(
  "/location",
  authMiddleware,
  getWeatherByLocation
);

/*
 * Manual city search
 *
 * GET /api/weather?city=Hyderabad
 */
router.get(
  "/",
  authMiddleware,
  getWeather
);

module.exports = router;