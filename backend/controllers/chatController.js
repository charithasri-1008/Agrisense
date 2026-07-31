const Groq = require("groq-sdk");

let groqClient = null;

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is missing in Railway Variables."
    );
  }

  if (!groqClient) {
    groqClient = new Groq({
      apiKey,
    });
  }

  return groqClient;
};

const SUPPORTED_LANGUAGES = {
  "en-IN": {
    name: "English",
    invalidMessage: "Message is required.",
    agricultureOnly:
      "I can only answer agriculture-related questions.",
    fallback:
      "I could not generate a detailed answer right now. Please try again shortly.",
    tooLong:
      "The question must be shorter than 2000 characters.",
  },

  "te-IN": {
    name: "Telugu",
    invalidMessage:
      "దయచేసి మీ ప్రశ్నను నమోదు చేయండి.",
    agricultureOnly:
      "నేను వ్యవసాయానికి సంబంధించిన ప్రశ్నలకు మాత్రమే సమాధానం ఇవ్వగలను.",
    fallback:
      "ప్రస్తుతం పూర్తి సమాధానం రూపొందించలేకపోయాను. దయచేసి కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.",
    tooLong:
      "ప్రశ్న 2000 అక్షరాల కంటే తక్కువగా ఉండాలి.",
  },

  "hi-IN": {
    name: "Hindi",
    invalidMessage:
      "कृपया अपना प्रश्न दर्ज करें।",
    agricultureOnly:
      "मैं केवल कृषि से संबंधित प्रश्नों का उत्तर दे सकता हूँ।",
    fallback:
      "अभी विस्तृत उत्तर तैयार नहीं हो सका। कृपया थोड़ी देर बाद फिर प्रयास करें।",
    tooLong:
      "प्रश्न 2000 अक्षरों से छोटा होना चाहिए।",
  },

  "ta-IN": {
    name: "Tamil",
    invalidMessage:
      "தயவுசெய்து உங்கள் கேள்வியை உள்ளிடவும்.",
    agricultureOnly:
      "நான் விவசாயம் தொடர்பான கேள்விகளுக்கு மட்டுமே பதிலளிக்க முடியும்.",
    fallback:
      "இப்போது விரிவான பதிலை உருவாக்க முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.",
    tooLong:
      "கேள்வி 2000 எழுத்துகளுக்கு குறைவாக இருக்க வேண்டும்.",
  },

  "kn-IN": {
    name: "Kannada",
    invalidMessage:
      "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ.",
    agricultureOnly:
      "ನಾನು ಕೃಷಿಗೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಶ್ನೆಗಳಿಗೆ ಮಾತ್ರ ಉತ್ತರಿಸಬಹುದು.",
    fallback:
      "ಈಗ ವಿವರವಾದ ಉತ್ತರವನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    tooLong:
      "ಪ್ರಶ್ನೆ 2000 ಅಕ್ಷರಗಳಿಗಿಂತ ಚಿಕ್ಕದಾಗಿರಬೇಕು.",
  },

  "ml-IN": {
    name: "Malayalam",
    invalidMessage:
      "ദയവായി നിങ്ങളുടെ ചോദ്യം നൽകുക.",
    agricultureOnly:
      "കൃഷിയുമായി ബന്ധപ്പെട്ട ചോദ്യങ്ങൾക്ക് മാത്രമേ എനിക്ക് ഉത്തരം നൽകാനാകൂ.",
    fallback:
      "ഇപ്പോൾ വിശദമായ ഉത്തരം തയ്യാറാക്കാനായില്ല. കുറച്ച് സമയത്തിന് ശേഷം വീണ്ടും ശ്രമിക്കുക.",
    tooLong:
      "ചോദ്യം 2000 അക്ഷരങ്ങളിൽ താഴെയായിരിക്കണം.",
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
    .replace(/^```(?:text|markdown)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const buildPrompt = ({
  languageName,
  agricultureOnlyMessage,
}) => {
  return `
You are AgriSense AI, a responsible agriculture assistant for farmers and agriculture students in India.

Selected response language:
${languageName}

Follow these rules strictly:

1. Decide whether the user's question is genuinely related to agriculture.

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

3. If the question is not related to agriculture, return only this exact sentence:
${agricultureOnlyMessage}

4. Answer completely in ${languageName}.

5. Use simple words that farmers can understand.

6. Do not switch language based on the language used in the question.

7. Give practical and safe suggestions.

8. Do not claim certainty when information is uncertain.

9. For crop disease or pest questions:
- explain likely causes
- state that accurate diagnosis may require a clear image or local expert inspection
- do not present a guess as a confirmed diagnosis

10. When mentioning pesticides, herbicides, fungicides, fertilizers, or veterinary medicines:
- never invent exact dosages
- advise following the official product label
- recommend consulting a local agriculture officer or qualified expert
- mention protective equipment where relevant

11. Do not recommend banned, illegal, or unsafe chemicals.

12. For urgent crop loss, poisoning, animal illness, or widespread disease:
- advise contacting an appropriate agriculture or veterinary professional

13. Keep detailed answers between 300 and 450 words.

14. Use a maximum of:
- 5 possible causes
- 5 recommended actions
- 4 prevention points

15. Complete every sentence and every section.

16. Do not repeat similar points.

Use this structure when suitable:

🌾 Problem:
Briefly explain the issue.

🔍 Possible Causes:
List likely causes.

✅ Recommended Actions:
Give clear actions in order.

🛡 Prevention:
Explain how to reduce the chance of the issue happening again.

For simple questions, give a direct answer without forcing all headings.
`.trim();
};
const generateGroqAnswer = async ({
  message,
  languageConfig,
}) => {
  const systemPrompt = buildPrompt({
    languageName: languageConfig.name,
    agricultureOnlyMessage:
      languageConfig.agricultureOnly,
  });

  const firstCompletion =
    await getGroqClient()
      .chat.completions.create({
        model:
          process.env.GROQ_MODEL ||
          "llama-3.3-70b-versatile",

        temperature: 0.2,
        top_p: 0.85,
        max_completion_tokens: 2500,

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

  const firstAnswer =
    cleanGeneratedText(
      firstCompletion?.choices?.[0]
        ?.message?.content
    );

  const firstFinishReason =
    firstCompletion?.choices?.[0]
      ?.finish_reason;

  console.log(
    "First Groq finish reason:",
    firstFinishReason
  );

  console.log(
    "First answer length:",
    firstAnswer.length
  );

  if (
    firstFinishReason !== "length" ||
    !firstAnswer
  ) {
    return {
      generatedAnswer: firstAnswer,
      finishReason: firstFinishReason,
    };
  }

  console.log(
    "First response was cut. Generating continuation..."
  );

  const secondCompletion =
    await getGroqClient()
      .chat.completions.create({
        model:
          process.env.GROQ_MODEL ||
          "llama-3.3-70b-versatile",

        temperature: 0.2,
        top_p: 0.85,
        max_completion_tokens: 2000,

        messages: [
          {
            role: "system",
            content: `
${systemPrompt}

The previous answer was cut because of a token limit.

Continue exactly from where the previous answer stopped.

Rules:
- Do not repeat the previous content.
- Complete the unfinished sentence first.
- Complete all remaining sections.
- Keep the continuation concise.
- End with a complete sentence.
            `.trim(),
          },
          {
            role: "user",
            content: `
Original question:
${message}

Previous incomplete answer:
${firstAnswer}

Continue the answer without repeating anything.
            `.trim(),
          },
        ],
      });

  const secondAnswer =
    cleanGeneratedText(
      secondCompletion?.choices?.[0]
        ?.message?.content
    );

  const secondFinishReason =
    secondCompletion?.choices?.[0]
      ?.finish_reason;

  console.log(
    "Second Groq finish reason:",
    secondFinishReason
  );

  console.log(
    "Second answer length:",
    secondAnswer.length
  );

  return {
    generatedAnswer: [firstAnswer, secondAnswer]
      .filter(Boolean)
      .join("\n"),
    finishReason:
      secondFinishReason ||
      firstFinishReason,
  };
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
        message: languageConfig.tooLong,
      });
    }

    const {
      generatedAnswer,
      finishReason,
    } = await generateGroqAnswer({
      message,
      languageConfig,
    });

    if (!generatedAnswer) {
      return res.status(200).json({
        success: true,
        question: message,
        language: selectedLanguage,
        answer: languageConfig.fallback,
        fallback: true,
      });
    }

    return res.status(200).json({
      success: true,
      question: message,
      language: selectedLanguage,
      answer: generatedAnswer,
      debug: {
        finishReason,
        answerLength:
          generatedAnswer.length,
      },
    });
  } catch (error) {
    console.error(
      "Groq Chat Error:",
      error?.response?.data ||
        error?.message ||
        error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        languageConfig.fallback,
    });
  }
};

module.exports = {
  chatWithAI,
};