const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { recommendCrop } = require("../controllers/cropController");

router.post("/", authMiddleware, recommendCrop);

module.exports = router;