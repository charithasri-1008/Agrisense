const axios = require("axios");
const Groq = require("groq-sdk");

const LANGUAGE_NAMES = {
  "en-IN": "English",
  "te-IN": "Telugu",
  "hi-IN": "Hindi",
  "ta-IN": "Tamil",
  "kn-IN": "Kannada",
  "ml-IN": "Malayalam",
};

const FALLBACK_SUMMARIES = {
  "en-IN": ({
    crop,
    state,
    count,
    lowestModalPrice,
    highestModalPrice,
    highestPriceMarket,
  }) => {
    let summary =
      `${count} market price records were found for ${crop} in ${state}.`;

    if (
      lowestModalPrice !== null &&
      highestModalPrice !== null
    ) {
      summary +=
        ` The visible modal prices range from ₹${lowestModalPrice} to ₹${highestModalPrice} per quintal.`;
    }

    if (highestPriceMarket) {
      summary +=
        ` The highest visible modal price is available at ${highestPriceMarket}.`;
    }

    summary +=
      " Compare nearby markets and confirm the current price with the mandi before selling.";

    return summary;
  },

  "te-IN": ({
    crop,
    state,
    count,
    lowestModalPrice,
    highestModalPrice,
    highestPriceMarket,
  }) => {
    let summary =
      `${state}లో ${crop} పంటకు సంబంధించిన ${count} మార్కెట్ ధరల రికార్డులు లభించాయి.`;

    if (
      lowestModalPrice !== null &&
      highestModalPrice !== null
    ) {
      summary +=
        ` కనిపిస్తున్న సాధారణ ధరలు క్వింటాల్‌కు ₹${lowestModalPrice} నుంచి ₹${highestModalPrice} వరకు ఉన్నాయి.`;
    }

    if (highestPriceMarket) {
      summary +=
        ` కనిపిస్తున్న అత్యధిక సాధారణ ధర ${highestPriceMarket} మార్కెట్‌లో ఉంది.`;
    }

    summary +=
      " అమ్మే ముందు సమీప మార్కెట్ల ధరలను పోల్చి, స్థానిక మండీలో ప్రస్తుత ధరను నిర్ధారించండి.";

    return summary;
  },

  "hi-IN": ({
    crop,
    state,
    count,
    lowestModalPrice,
    highestModalPrice,
    highestPriceMarket,
  }) => {
    let summary =
      `${state} में ${crop} के लिए ${count} मंडी मूल्य रिकॉर्ड मिले हैं।`;

    if (
      lowestModalPrice !== null &&
      highestModalPrice !== null
    ) {
      summary +=
        ` उपलब्ध सामान्य कीमतें ₹${lowestModalPrice} से ₹${highestModalPrice} प्रति क्विंटल तक हैं।`;
    }

    if (highestPriceMarket) {
      summary +=
        ` सबसे अधिक दिखाई देने वाली सामान्य कीमत ${highestPriceMarket} मंडी में है।`;
    }

    summary +=
      " बेचने से पहले आसपास की मंडियों की तुलना करें और स्थानीय मंडी में वर्तमान कीमत की पुष्टि करें।";

    return summary;
  },

  "ta-IN": ({
    crop,
    state,
    count,
    lowestModalPrice,
    highestModalPrice,
    highestPriceMarket,
  }) => {
    let summary =
      `${state} மாநிலத்தில் ${crop} பயிருக்கான ${count} சந்தை விலை பதிவுகள் கிடைத்துள்ளன.`;

    if (
      lowestModalPrice !== null &&
      highestModalPrice !== null
    ) {
      summary +=
        ` காணப்படும் பொதுவான விலைகள் குவிண்டாலுக்கு ₹${lowestModalPrice} முதல் ₹${highestModalPrice} வரை உள்ளன.`;
    }

    if (highestPriceMarket) {
      summary +=
        ` அதிகமாக காணப்படும் பொதுவான விலை ${highestPriceMarket} சந்தையில் உள்ளது.`;
    }

    summary +=
      " விற்பதற்கு முன் அருகிலுள்ள சந்தைகளின் விலைகளை ஒப்பிட்டு, உள்ளூர் சந்தையில் தற்போதைய விலையை உறுதிப்படுத்துங்கள்.";

    return summary;
  },

  "kn-IN": ({
    crop,
    state,
    count,
    lowestModalPrice,
    highestModalPrice,
    highestPriceMarket,
  }) => {
    let summary =
      `${state} ರಾಜ್ಯದಲ್ಲಿ ${crop} ಬೆಳೆಗೆ ಸಂಬಂಧಿಸಿದ ${count} ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ದಾಖಲೆಗಳು ದೊರಕಿವೆ.`;

    if (
      lowestModalPrice !== null &&
      highestModalPrice !== null
    ) {
      summary +=
        ` ಲಭ್ಯವಿರುವ ಸಾಮಾನ್ಯ ಬೆಲೆಗಳು ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹${lowestModalPrice} ರಿಂದ ₹${highestModalPrice} ವರೆಗೆ ಇವೆ.`;
    }

    if (highestPriceMarket) {
      summary +=
        ` ಕಾಣುತ್ತಿರುವ ಅತ್ಯಧಿಕ ಸಾಮಾನ್ಯ ಬೆಲೆ ${highestPriceMarket} ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಇದೆ.`;
    }

    summary +=
      " ಮಾರಾಟಕ್ಕೂ ಮೊದಲು ಸಮೀಪದ ಮಾರುಕಟ್ಟೆಗಳ ಬೆಲೆಗಳನ್ನು ಹೋಲಿಸಿ, ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಪ್ರಸ್ತುತ ಬೆಲೆಯನ್ನು ದೃಢೀಕರಿಸಿ.";

    return summary;
  },

  "ml-IN": ({
    crop,
    state,
    count,
    lowestModalPrice,
    highestModalPrice,
    highestPriceMarket,
  }) => {
    let summary =
      `${state} സംസ്ഥാനത്ത് ${crop} വിളയ്ക്കായി ${count} വിപണി വില രേഖകൾ ലഭിച്ചു.`;

    if (
      lowestModalPrice !== null &&
      highestModalPrice !== null
    ) {
      summary +=
        ` കാണുന്ന സാധാരണ വിലകൾ ക്വിന്റലിന് ₹${lowestModalPrice} മുതൽ ₹${highestModalPrice} വരെയാണ്.`;
    }

    if (highestPriceMarket) {
      summary +=
        ` ഏറ്റവും ഉയർന്നതായി കാണുന്ന സാധാരണ വില ${highestPriceMarket} വിപണിയിലാണ്.`;
    }

    summary +=
      " വിൽക്കുന്നതിന് മുമ്പ് സമീപ വിപണികളുടെ വിലകൾ താരതമ്യം ചെയ്ത് പ്രാദേശിക വിപണിയിൽ നിലവിലെ വില സ്ഥിരീകരിക്കുക.";

    return summary;
  },
};

const cleanText = (value) => {
  return String(value || "").trim();
};

const cleanPrice = (value) => {
  const cleanedValue = cleanText(value);

  if (!cleanedValue) {
    return null;
  }

  const numericValue = Number(
    cleanedValue.replace(/,/g, "")
  );

  return Number.isFinite(numericValue)
    ? numericValue
    : null;
};

const formatPrice = (value) => {
  if (!Number.isFinite(value)) {
    return null;
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 0,
    }
  ).format(value);
};

const getGroqClient = () => {
  const apiKey =
    process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  return new Groq({
    apiKey,
  });
};

const extractJson = (responseText) => {
  const cleanedText = String(
    responseText || ""
  )
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace =
    cleanedText.indexOf("{");

  const lastBrace =
    cleanedText.lastIndexOf("}");

  if (
    firstBrace === -1 ||
    lastBrace === -1 ||
    lastBrace <= firstBrace
  ) {
    throw new Error(
      "Groq did not return valid JSON."
    );
  }

  const jsonText =
    cleanedText.slice(
      firstBrace,
      lastBrace + 1
    );

  return JSON.parse(jsonText);
};

const calculateMarketInsights = (
  prices
) => {
  const validRecords = prices
    .map((item) => ({
      ...item,

      numericModalPrice:
        cleanPrice(
          item.modalPrice
        ),
    }))
    .filter((item) =>
      Number.isFinite(
        item.numericModalPrice
      )
    );

  if (validRecords.length === 0) {
    return {
      lowestModalPrice: null,
      highestModalPrice: null,
      averageModalPrice: null,
      highestPriceMarket: null,
      priceDifference: null,
    };
  }

  const modalPrices =
    validRecords.map(
      (item) =>
        item.numericModalPrice
    );

  const lowestModalPrice =
    Math.min(...modalPrices);

  const highestModalPrice =
    Math.max(...modalPrices);

  const averageModalPrice =
    Math.round(
      modalPrices.reduce(
        (total, price) =>
          total + price,
        0
      ) / modalPrices.length
    );

  const highestRecord =
    validRecords.find(
      (item) =>
        item.numericModalPrice ===
        highestModalPrice
    );

  return {
    lowestModalPrice,
    highestModalPrice,
    averageModalPrice,

    highestPriceMarket:
      highestRecord?.market ||
      highestRecord?.district ||
      null,

    priceDifference:
      highestModalPrice -
      lowestModalPrice,
  };
};

const getFallbackSummary = ({
  language,
  crop,
  state,
  count,
  insights,
}) => {
  const selectedLanguage =
    FALLBACK_SUMMARIES[language]
      ? language
      : "en-IN";

  return FALLBACK_SUMMARIES[
    selectedLanguage
  ]({
    crop,
    state,
    count,

    lowestModalPrice:
      formatPrice(
        insights.lowestModalPrice
      ),

    highestModalPrice:
      formatPrice(
        insights.highestModalPrice
      ),

    highestPriceMarket:
      insights.highestPriceMarket,
  });
};

const generateMarketSummary = async ({
  prices,
  state,
  crop,
  language,
  insights,
}) => {
  const fallbackSummary =
    getFallbackSummary({
      language,
      crop,
      state,
      count: prices.length,
      insights,
    });

  const groq =
    getGroqClient();

  const modelName =
    process.env.GROQ_MODEL?.trim();

  /*
   * Groq configuration lekapothe
   * market data matram work avvali.
   */
  if (
    !groq ||
    !modelName
  ) {
    console.warn(
      "Groq market summary skipped because GROQ_API_KEY or GROQ_MODEL is missing."
    );

    return fallbackSummary;
  }

  try {
    const languageName =
      LANGUAGE_NAMES[language] ||
      "English";

    const compactPrices =
      prices.map((item) => ({
        market: item.market,
        district: item.district,
        minPrice: item.minPrice,
        maxPrice: item.maxPrice,
        modalPrice:
          item.modalPrice,
        arrivalDate:
          item.arrivalDate,
      }));

    const prompt = `
You are AgriSense AI, an Indian agricultural market assistant.

The market price data below comes from an external government market-data source.

Do not invent, modify, estimate, or guarantee any price.

State:
${state}

Crop:
${crop}

Required response language:
${languageName}

Number of records:
${prices.length}

Calculated market insights:
- Lowest visible modal price: ${
      insights.lowestModalPrice ??
      "Not available"
    }
- Highest visible modal price: ${
      insights.highestModalPrice ??
      "Not available"
    }
- Average visible modal price: ${
      insights.averageModalPrice ??
      "Not available"
    }
- Market with highest visible modal price: ${
      insights.highestPriceMarket ||
      "Not available"
    }
- Difference between highest and lowest modal price: ${
      insights.priceDifference ??
      "Not available"
    }

Market records:
${JSON.stringify(compactPrices)}

Return only one valid JSON object:

{
  "summary": "A short farmer-friendly market price summary"
}

Rules:

1. Write the summary completely in ${languageName}.
2. Keep the JSON property name in English.
3. Return valid JSON only.
4. Do not use markdown or code blocks.
5. Mention the number of available records.
6. Mention the lowest and highest visible modal prices when available.
7. Mention the market with the highest visible modal price when available.
8. Do not claim that any price is guaranteed.
9. Clearly state that market prices can change.
10. Recommend checking the local mandi before selling.
11. Do not invent trends because historical data is not provided.
12. Keep the summary concise and suitable for text-to-speech.
13. Complete every sentence.
`;

    const completion =
      await groq.chat.completions.create({
        model: modelName,

        temperature: 0.2,

        max_completion_tokens:
          700,

        messages: [
          {
            role: "system",

            content:
              "You summarize agricultural market data accurately. Return strict JSON only and never invent prices.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const responseText =
      completion?.choices?.[0]
        ?.message?.content || "";

    const finishReason =
      completion?.choices?.[0]
        ?.finish_reason ||
      "unknown";

    console.log(
      "Groq market summary finish reason:",
      finishReason
    );

    if (!responseText.trim()) {
      return fallbackSummary;
    }

    const parsedResponse =
      extractJson(responseText);

    if (
      typeof parsedResponse
        ?.summary !== "string" ||
      !parsedResponse.summary.trim()
    ) {
      return fallbackSummary;
    }

    return parsedResponse
      .summary
      .trim();
  } catch (error) {
    console.error(
      "Groq market summary generation error:",
      error?.response?.data ||
        error?.message ||
        error
    );

    return fallbackSummary;
  }
};

const getMarketPrices = async (
  req,
  res
) => {
  const state =
    cleanText(req.query.state) ||
    "Telangana";

  const crop =
    cleanText(req.query.crop) ||
    "Tomato";

  const requestedLanguage =
    cleanText(
      req.query.language
    ) || "en-IN";

  const language =
    LANGUAGE_NAMES[
      requestedLanguage
    ]
      ? requestedLanguage
      : "en-IN";

  if (
    !process.env
      .DATA_GOV_API_KEY
  ) {
    return res.status(500).json({
      success: false,

      message:
        "Market data API key is not configured.",
    });
  }

  try {
    const response =
      await axios.get(
        "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
        {
          params: {
            "api-key":
              process.env
                .DATA_GOV_API_KEY,

            format: "json",

            "filters[state]":
              state,

            "filters[commodity]":
              crop,

            limit: 10,
          },

          timeout: 15000,
        }
      );

    const records =
      Array.isArray(
        response?.data?.records
      )
        ? response.data.records
        : [];

    if (
      records.length === 0
    ) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        summary: "",
        narration: "",
        language,
        state,
        crop,

        insights: {
          lowestModalPrice:
            null,

          highestModalPrice:
            null,

          averageModalPrice:
            null,

          highestPriceMarket:
            null,

          priceDifference:
            null,
        },

        message:
          "No market price data found.",
      });
    }

    const prices =
      records
        .slice(0, 10)
        .map((item) => ({
          market:
            cleanText(
              item.market
            ) || null,

          district:
            cleanText(
              item.district
            ) || null,

          commodity:
            cleanText(
              item.commodity
            ) || crop,

          variety:
            cleanText(
              item.variety
            ) || null,

          minPrice:
            cleanPrice(
              item.min_price
            ),

          maxPrice:
            cleanPrice(
              item.max_price
            ),

          modalPrice:
            cleanPrice(
              item.modal_price
            ),

          arrivalDate:
            cleanText(
              item.arrival_date
            ) || null,
        }));

    const insights =
      calculateMarketInsights(
        prices
      );

    const summary =
      await generateMarketSummary({
        prices,
        state,
        crop,
        language,
        insights,
      });

    return res.status(200).json({
      success: true,

      count:
        prices.length,

      data: prices,

      summary,

      narration: summary,

      language,

      state,

      crop,

      insights,
    });
  } catch (error) {
    const status =
      error?.response?.status;

    const errorMessage =
      error?.response?.data ||
      error?.message ||
      error;

    console.error(
      "Market price fetch error:",
      errorMessage
    );

    if (
      error?.code ===
      "ECONNABORTED"
    ) {
      return res.status(504).json({
        success: false,

        message:
          "Market price service timed out. Please try again.",
      });
    }

    if (
      status === 401 ||
      status === 403
    ) {
      return res.status(502).json({
        success: false,

        message:
          "Market data API authorization failed.",
      });
    }

    return res.status(502).json({
      success: false,

      message:
        "Failed to fetch market prices.",
    });
  }
};

module.exports = {
  getMarketPrices,
};