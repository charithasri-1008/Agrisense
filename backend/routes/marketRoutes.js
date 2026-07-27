const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getMarketPrices,
} = require("../controllers/marketController");

router.get("/", authMiddleware, getMarketPrices);

module.exports = router;