const recommendCrop = async (req, res) => {
  try {
    const { soilType, season, rainfall, temperature } = req.body;

    let crop = "";
    let reason = "";

    if (soilType === "Clay" && rainfall >= 200) {
      crop = "Rice";
      reason = "Clay soil with high rainfall is ideal for rice cultivation.";
    }
    else if (soilType === "Black") {
      crop = "Cotton";
      reason = "Black soil retains moisture and is excellent for cotton.";
    }
    else if (soilType === "Loamy") {
      crop = "Wheat";
      reason = "Loamy soil provides balanced nutrients for wheat.";
    }
    else if (soilType === "Sandy") {
      crop = "Groundnut";
      reason = "Sandy soil has good drainage, suitable for groundnut.";
    }
    else if (temperature > 30) {
      crop = "Millets";
      reason = "High temperatures are favorable for millets.";
    }
    else {
      crop = "Maize";
      reason = "Based on the given conditions, maize is a safe recommendation.";
    }

    res.json({
      success: true,
      input: {
        soilType,
        season,
        rainfall,
        temperature,
      },
      recommendedCrop: crop,
      reason,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  recommendCrop,
};