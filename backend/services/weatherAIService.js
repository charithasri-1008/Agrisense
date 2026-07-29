const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const LANGUAGE_MAP = {
  "en-IN": "English",
  "te-IN": "Telugu",
  "hi-IN": "Hindi",
  "ta-IN": "Tamil",
  "kn-IN": "Kannada",
  "ml-IN": "Malayalam",
};

const extractJson = (text) => {
  let cleanedText = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace =
    cleanedText.indexOf("{");

  const lastBrace =
    cleanedText.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1
  ) {
    cleanedText = cleanedText.slice(
      firstBrace,
      lastBrace + 1
    );
  }

  return JSON.parse(cleanedText);
};

const validateAdvice = (advice) => {
  const requiredFields = [
    "title",
    "irrigation",
    "rainAlert",
    "pesticide",
    "cropCare",
    "fieldWork",
    "summary",
  ];

  for (const field of requiredFields) {
    if (
      typeof advice?.[field] !== "string" ||
      !advice[field].trim()
    ) {
      throw new Error(
        `Invalid AI response field: ${field}`
      );
    }
  }

  return advice;
};

const generateWeatherAdvice = async (
  weather,
  language = "en-IN"
) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing"
    );
  }

  const languageName =
    LANGUAGE_MAP[language] || "English";

  const model =
    genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

  const prompt = `
You are AgriSense AI, an expert agriculture advisor for Indian farmers.

The farmer selected this response language:

${languageName}

Weather details:

City: ${weather.city}
Temperature: ${weather.temperature} °C
Humidity: ${weather.humidity}%
Wind Speed: ${weather.windSpeed} m/s
Condition: ${weather.condition}
Description: ${weather.description}

Convert this weather information into simple and practical farming decisions.

Return ONLY valid JSON in this exact structure:

{
  "title": "",
  "irrigation": "",
  "rainAlert": "",
  "pesticide": "",
  "cropCare": "",
  "fieldWork": "",
  "summary": ""
}

Strict rules:

1. Write every value completely in ${languageName}.
2. Do not mix English unnecessarily.
3. Crop names, scientific terms, numbers, units and city names may remain unchanged when required.
4. Use simple farmer-friendly language.
5. Give actions the farmer should take.
6. Keep every field short and useful.
7. The summary must sound natural when read aloud.
8. Do not return markdown.
9. Do not use code blocks.
10. Return JSON only.
`;

  try {
    const result =
      await model.generateContent(prompt);

    const responseText =
      result.response.text();

    const parsedAdvice =
      extractJson(responseText);

    return validateAdvice(parsedAdvice);
  } catch (error) {
    console.error(
      "Weather AI service error:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  generateWeatherAdvice,
};