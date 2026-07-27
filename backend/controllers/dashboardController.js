const dashboard = async (req, res) => {
  try {
    res.json({
      success: true,
      message: `Welcome ${req.user.id}`,
      modules: [
        "Weather",
        "Crop Recommendation",
        "Disease Detection",
        "AI Chatbot",
        "Market Prices"
      ]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = {
  dashboard,
};