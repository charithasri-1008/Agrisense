const axios = require("axios");

const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const LANGUAGE_NAMES = {
  "en-IN": "English",
  "te-IN": "Telugu",
  "hi-IN": "Hindi",
  "ta-IN": "Tamil",
  "kn-IN": "Kannada",
  "ml-IN": "Malayalam",
};

const FALLBACK_SUMMARIES = {
  "en-IN": ({ crop, state, count }) =>
    `${count} market price records were found for ${crop} in ${state}. Compare the minimum, maximum and modal prices before choosing a market.`,

  "te-IN": ({ crop, state, count }) =>
    `${state}లో ${crop} పంటకు సంబంధించిన ${count} మార్కెట్ ధరల రికార్డులు లభించాయి. మార్కెట్‌ను ఎంచుకునే ముందు కనిష్ఠ, గరిష్ఠ మరియు సాధారణ ధరలను పోల్చండి.`,

  "hi-IN": ({ crop, state, count }) =>
    `${state} में ${crop} के लिए ${count} मंडी मूल्य रिकॉर्ड मिले हैं। बाज़ार चुनने से पहले न्यूनतम, अधिकतम और सामान्य कीमतों की तुलना करें।`,

  "ta-IN": ({ crop, state, count }) =>
    `${state} மாநிலத்தில் ${crop} பயிருக்கான ${count} சந்தை விலை பதிவுகள் கிடைத்துள்ளன. சந்தையைத் தேர்ந்தெடுக்கும் முன் குறைந்தபட்ச, அதிகபட்ச மற்றும் பொதுவான விலைகளை ஒப்பிடுங்கள்.`,

  "kn-IN": ({ crop, state, count }) =>
    `${state} ರಾಜ್ಯದಲ್ಲಿ ${crop} ಬೆಳೆಗೆ ಸಂಬಂಧಿಸಿದ ${count} ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ದಾಖಲೆಗಳು ದೊರಕಿವೆ. ಮಾರುಕಟ್ಟೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡುವ ಮೊದಲು ಕನಿಷ್ಠ, ಗರಿಷ್ಠ ಮತ್ತು ಸಾಮಾನ್ಯ ಬೆಲೆಗಳನ್ನು ಹೋಲಿಸಿ.`,

  "ml-IN": ({ crop, state, count }) =>
    `${state} സംസ്ഥാനത്ത് ${crop} വിളയ്ക്കായി ${count} വിപണി വില രേഖകൾ ലഭിച്ചു. വിപണി തിരഞ്ഞെടുക്കുന്നതിന് മുമ്പ് കുറഞ്ഞ, കൂടിയ, സാധാരണ വിലകൾ താരതമ്യം ചെയ്യുക.`,
};

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  return new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );
};

const getFallbackSummary = ({
  language,
  crop,
  state,
  count,
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
  });
};

const cleanText = (value) => {
  return String(value || "").trim();
};

const cleanPrice = (value) => {
  const cleanedValue = cleanText(value);

  if (!cleanedValue) {
    return null;
  }

  const numericValue =
    Number(cleanedValue);

  return Number.isFinite(numericValue)
    ? numericValue
    : cleanedValue;
};

const generateMarketSummary = async ({
  prices,
  state,
  crop,
  language,
}) => {
  const fallbackSummary =
    getFallbackSummary({
      language,
      crop,
      state,
      count: prices.length,
    });

  const genAI = getGeminiClient();

  if (!genAI) {
    return fallbackSummary;
  }

  try {
    const languageName =
      LANGUAGE_NAMES[language] ||
      "English";

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",

        generationConfig: {
          temperature: 0.2,
          responseMimeType:
            "application/json",
        },
      });

    const compactPrices = prices.map(
      (item) => ({
        market: item.market,
        district: item.district,
        minPrice: item.minPrice,
        maxPrice: item.maxPrice,
        modalPrice: item.modalPrice,
        arrivalDate:
          item.arrivalDate,
      })
    );

    const prompt = `
You are AgriSense AI, an Indian agricultural market assistant.

State: ${state}
Crop: ${crop}
Language: ${languageName}

Market records:
${JSON.stringify(compactPrices)}

Return exactly one valid JSON object:

{
  "summary": "A short farmer-friendly market price summary"
}

Rules:

1. Write the summary only in ${languageName}.
2. Keep the JSON property name in English.
3. Return valid JSON only.
4. Do not use markdown.
5. Mention the number of records.
6. Mention the lowest and highest visible modal prices when available.
7. Mention the market with the highest visible modal price when identifiable.
8. Do not claim that the price is guaranteed.
9. Explain that market prices can change.
10. Keep the summary concise and suitable for text-to-speech.
11. Use natural farmer-friendly language.
`;

    const result =
      await model.generateContent(prompt);

    const responseText =
      result?.response?.text?.() || "";

    if (!responseText.trim()) {
      return fallbackSummary;
    }

    const cleanedResponse =
      responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const firstBrace =
      cleanedResponse.indexOf("{");

    const lastBrace =
      cleanedResponse.lastIndexOf("}");

    if (
      firstBrace === -1 ||
      lastBrace === -1 ||
      lastBrace <= firstBrace
    ) {
      return fallbackSummary;
    }

    const parsedResponse =
      JSON.parse(
        cleanedResponse.slice(
          firstBrace,
          lastBrace + 1
        )
      );

    if (
      typeof parsedResponse.summary !==
        "string" ||
      !parsedResponse.summary.trim()
    ) {
      return fallbackSummary;
    }

    return parsedResponse.summary.trim();
  } catch (error) {
    console.error(
      "Market summary generation error:",
      error?.message || error
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
    cleanText(req.query.language) ||
    "en-IN";

  const language =
    LANGUAGE_NAMES[requestedLanguage]
      ? requestedLanguage
      : "en-IN";

  if (!process.env.DATA_GOV_API_KEY) {
    return res.status(500).json({
      success: false,
      message:
        "Market data API key is not configured.",
    });
  }

  try {
    const response = await axios.get(
      "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
      {
        params: {
          "api-key":
            process.env.DATA_GOV_API_KEY,

          format: "json",

          "filters[state]": state,

          "filters[commodity]":
            crop,

          limit: 10,
        },

        timeout: 15000,
      }
    );

    const records = Array.isArray(
      response?.data?.records
    )
      ? response.data.records
      : [];

    if (records.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        summary: "",
        narration: "",
        language,
        state,
        crop,
        message:
          "No market price data found.",
      });
    }

    const prices = records
      .slice(0, 10)
      .map((item) => ({
        market:
          cleanText(item.market) ||
          null,

        district:
          cleanText(item.district) ||
          null,

        commodity:
          cleanText(item.commodity) ||
          crop,

        variety:
          cleanText(item.variety) ||
          null,

        minPrice: cleanPrice(
          item.min_price
        ),

        maxPrice: cleanPrice(
          item.max_price
        ),

        modalPrice: cleanPrice(
          item.modal_price
        ),

        arrivalDate:
          cleanText(
            item.arrival_date
          ) || null,
      }));

    const summary =
      await generateMarketSummary({
        prices,
        state,
        crop,
        language,
      });

    return res.status(200).json({
      success: true,
      count: prices.length,
      data: prices,
      summary,
      narration: summary,
      language,
      state,
      crop,
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
      error.code === "ECONNABORTED"
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