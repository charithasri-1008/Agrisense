const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const {
  detectDisease,
} = require("../controllers/diseaseController");

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  detectDisease
);

module.exports = router;