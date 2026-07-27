const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { chatWithAI } = require("../controllers/chatController");

router.post("/", authMiddleware, chatWithAI);

module.exports = router;