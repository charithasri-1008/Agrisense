const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const SUPPORTED_LANGUAGES = {
  "en-IN": {
    name: "English",
    invalidMessage: "Message is required.",
    agricultureOnly:
      "I can only answer agriculture-related questions.",
    fallback:
      "I could not generate a detailed answer right now. Please try again shortly.",
  },

  "te-IN": {
    name: "Telugu",
    invalidMessage:
      "దయచేసి మీ ప్రశ్నను నమోదు చేయండి.",
    agricultureOnly:
      "నేను వ్యవసాయానికి సంబంధించిన ప్రశ్నలకు మాత్రమే సమాధానం ఇవ్వగలను.",
    fallback:
      "ప్రస్తుతం పూర్తి సమాధానం రూపొందించలేకపోయాను. దయచేసి కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.",
  },

  "hi-IN": {
    name: "Hindi",
    invalidMessage:
      "कृपया अपना प्रश्न दर्ज करें।",
    agricultureOnly:
      "मैं केवल कृषि से संबंधित प्रश्नों का उत्तर दे सकता हूँ।",
    fallback:
      "अभी विस्तृत उत्तर तैयार नहीं हो सका। कृपया थोड़ी देर बाद फिर प्रयास करें।",
  },

  "ta-IN": {
    name: "Tamil",
    invalidMessage:
      "தயவுசெய்து உங்கள் கேள்வியை உள்ளிடவும்.",
    agricultureOnly:
      "நான் விவசாயம் தொடர்பான கேள்விகளுக்கு மட்டுமே பதிலளிக்க முடியும்.",
    fallback:
      "இப்போது விரிவான பதிலை உருவாக்க முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.",
  },

  "kn-IN": {
    name: "Kannada",
    invalidMessage:
      "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ.",
    agricultureOnly:
      "ನಾನು ಕೃಷಿಗೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಶ್ನೆಗಳಿಗೆ ಮಾತ್ರ ಉತ್ತರಿಸಬಹುದು.",
    fallback:
      "ಈಗ ವಿವರವಾದ ಉತ್ತರವನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  },

  "ml-IN": {
    name: "Malayalam",
    invalidMessage:
      "ദയവായി നിങ്ങളുടെ ചോദ്യം നൽകുക.",
    agricultureOnly:
      "കൃഷിയുമായി ബന്ധപ്പെട്ട ചോദ്യങ്ങൾക്ക് മാത്രമേ എനിക്ക് ഉത്തരം നൽകാനാകൂ.",
    fallback:
      "ഇപ്പോൾ വിശദമായ ഉത്തരം തയ്യാറാക്കാനായില്ല. കുറച്ച് സമയത്തിന് ശേഷം വീണ്ടും ശ്രമിക്കുക.",
  },
};

const getLanguageConfig = (language) => {
  return (
    SUPPORTED_LANGUAGES[language] ||
    SUPPORTED_LANGUAGES["en-IN"]
  );
};

const cleanGeneratedText = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/^```(?:text|markdown)?/i, "")
    .replace(/```$/i, "")
    .trim();
};

const buildPrompt = ({
  message,
  languageName,
  agricultureOnlyMessage,
}) => {
  return `
You are AgriSense AI, a responsible agriculture assistant for farmers and agriculture students in India.

The user selected this response language:
${languageName}

User question:
${message}

Follow these rules strictly:

1. First decide whether the question is genuinely related to agriculture.

2. Agriculture-related topics include:
   - crops
   - soil
   - seeds
   - irrigation
   - fertilizers
   - plant nutrients
   - crop diseases
   - pests
   - weeds
   - farm machinery
   - livestock
   - dairy farming
   - poultry
   - fisheries
   - horticulture
   - agricultural weather
   - market prices
   - storage
   - harvesting
   - government agriculture schemes
   - sustainable farming
   - organic farming
   - farm management

3. If the question is not related to agriculture, reply with only this exact sentence:
${agricultureOnlyMessage}

4. Answer entirely in ${languageName}.

5. Use simple words that farmers can easily understand.

6. Do not change languages based on the language detected in the question. Always use the selected language: ${languageName}.

7. Give practical and safe suggestions.

8. Do not claim certainty when the information is uncertain.

9. For crop disease or pest questions:
   - explain likely causes
   - mention that accurate diagnosis may require a clear image or local expert inspection
   - avoid presenting a guess as confirmed diagnosis

10. When mentioning pesticides, herbicides, fungicides, fertilizers or veterinary medicines:
   - do not invent exact dosages
   - advise the user to follow the official product label
   - recommend checking with a local agriculture officer or qualified expert
   - mention protective equipment where relevant

11. Do not recommend banned, illegal or unsafe chemicals.

12. For urgent crop loss, poisoning, animal illness or widespread disease:
   - advise contacting the appropriate local agriculture or veterinary professional

13. Keep the answer relevant and reasonably concise.

Use this structure when it fits the question:

🌾 సమస్య / Problem:
Briefly explain the issue.

🔍 కారణాలు / Possible Causes:
List the likely causes.

✅ పరిష్కారం / Recommended Actions:
Give clear actions in order.

🛡 నివారణ / Prevention:
Explain how to reduce the chance of the issue happening again.

Do not force every heading when the question is simple, such as a definition or general agriculture question.
`;
};

const chatWithAI = async (req, res) => {
  const requestedLanguage =
    typeof req.body?.language === "string"
      ? req.body.language
      : "en-IN";

  const selectedLanguage =
    Object.prototype.hasOwnProperty.call(
      SUPPORTED_LANGUAGES,
      requestedLanguage
    )
      ? requestedLanguage
      : "en-IN";

  const languageConfig =
    getLanguageConfig(selectedLanguage);

  try {
    const message =
      typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

    if (!message) {
      return res.status(400).json({
        success: false,
        message:
          languageConfig.invalidMessage,
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message:
          selectedLanguage === "te-IN"
            ? "ప్రశ్న 2000 అక్షరాల కంటే తక్కువగా ఉండాలి."
            : "The question must be shorter than 2000 characters.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error(
        "GEMINI_API_KEY is not configured."
      );

      return res.status(503).json({
        success: false,
        message: languageConfig.fallback,
      });
    }

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
          maxOutputTokens: 1200,
        },
      });

    const prompt = buildPrompt({
      message,
      languageName:
        languageConfig.name,
      agricultureOnlyMessage:
        languageConfig.agricultureOnly,
    });

    const result =
      await model.generateContent(prompt);

    const generatedAnswer =
      cleanGeneratedText(
        result?.response?.text?.()
      );

    const answer =
      generatedAnswer ||
      languageConfig.fallback;

    return res.status(200).json({
      success: true,
      question: message,
      language: selectedLanguage,
      answer,
    });
  } catch (error) {
    console.error(
      "Gemini Chat Error:",
      error?.message || error
    );

    return res.status(200).json({
      success: true,
      language: selectedLanguage,
      answer: languageConfig.fallback,
      fallback: true,
    });
  }
};

module.exports = {
  chatWithAI,
};