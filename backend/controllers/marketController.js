const axios = require("axios");

const getMarketPrices = async (req, res) => {
  try {
    const state = req.query.state || "Telangana";
    const crop = req.query.crop || "Tomato";

    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&filters[state]=${encodeURIComponent(
      state
    )}&filters[commodity]=${encodeURIComponent(crop)}`;

    const response = await axios.get(url);

    const records = response.data.records;

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No market price data found",
      });
    }

    const prices = records.slice(0, 10).map((item) => ({
      market: item.market,
      district: item.district,
      commodity: item.commodity,
      variety: item.variety,
      minPrice: item.min_price,
      maxPrice: item.max_price,
      modalPrice: item.modal_price,
      arrivalDate: item.arrival_date,
    }));

    res.json({
      success: true,
      count: prices.length,
      data: prices,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch market prices",
    });
  }
};

module.exports = {
  getMarketPrices,
};