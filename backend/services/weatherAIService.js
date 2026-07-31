const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
    firstBrace === -1 ||
    lastBrace === -1 ||
    lastBrace <= firstBrace
  ) {
    throw new Error(
      `Groq did not return valid JSON. Raw response: ${cleanedText}`
    );
  }

  cleanedText = cleanedText.slice(
    firstBrace,
    lastBrace + 1
  );

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    throw new Error(
      `Failed to parse Groq JSON response. Raw response: ${cleanedText}`
    );
  }
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

  return {
    title: advice.title.trim(),
    irrigation: advice.irrigation.trim(),
    rainAlert: advice.rainAlert.trim(),
    pesticide: advice.pesticide.trim(),
    cropCare: advice.cropCare.trim(),
    fieldWork: advice.fieldWork.trim(),
    summary: advice.summary.trim(),
  };
};

const generateWeatherAdvice = async (
  weather,
  language = "en-IN"
) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error(
      "GROQ_API_KEY is missing"
    );
  }

  const languageName =
    LANGUAGE_MAP[language] || "English";

  const modelName =
    process.env.GROQ_MODEL ||
    "llama-3.3-70b-versatile";

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
    const completion =
      await groq.chat.completions.create({
        model: modelName,
        temperature: 0.2,
        max_completion_tokens: 1200,
        messages: [
          {
            role: "system",
            content:
              "You are an agricultural weather advisor. Return strict JSON only.",
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

    if (!responseText.trim()) {
      throw new Error(
        "Groq returned an empty weather advice response."
      );
    }

    const parsedAdvice =
      extractJson(responseText);

    return validateAdvice(parsedAdvice);
  } catch (error) {
    console.error(
      "Groq weather advice error:",
      error?.message || error
    );

    throw error;
  }
};

module.exports = {
  generateWeatherAdvice,
};