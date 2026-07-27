const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cropRoutes = require("./routes/cropRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const chatRoutes = require("./routes/chatRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const marketRoutes = require("./routes/marketRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    project: "AgriSense",
    message: "🌾 AgriSense API is running successfully!"
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/market", marketRoutes);


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});