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

const FALLBACK_RESPONSES = {
  "en-IN": {
    disease: "Unable to identify accurately",
    confidence: "Low",
    cause:
      "The image could not be analyzed clearly or the AI service is temporarily unavailable.",
    symptoms: [
      "Inspect the crop for spots, discoloration, curling, drying, or unusual growth.",
      "Check both sides of the leaves and nearby plants.",
      "Observe whether the issue is spreading across the field.",
    ],
    treatment:
      "Avoid applying chemicals based only on this result. Remove severely damaged leaves if appropriate and consult a local agriculture officer or plant pathology expert.",
    prevention:
      "Use healthy planting material, maintain field hygiene, avoid excessive irrigation, and inspect crops regularly.",
    narration:
      "The disease could not be identified accurately from this image. Please upload a clear close-up image of the affected leaf in good lighting and consult a local agriculture officer before applying any pesticide.",
    message:
      "AI analysis is temporarily unavailable. A safe general response is being shown.",
  },

  "te-IN": {
    disease: "వ్యాధిని ఖచ్చితంగా గుర్తించలేకపోయాము",
    confidence: "తక్కువ",
    cause:
      "చిత్రం స్పష్టంగా లేకపోవడం లేదా AI సేవ ప్రస్తుతం అందుబాటులో లేకపోవడం వల్ల వ్యాధిని ఖచ్చితంగా గుర్తించలేకపోయాము.",
    symptoms: [
      "ఆకులపై మచ్చలు, రంగు మారడం, ముడుచుకోవడం లేదా ఎండిపోవడం ఉన్నాయో పరిశీలించండి.",
      "ఆకుల రెండు వైపులా మరియు పక్కనున్న మొక్కలను పరిశీలించండి.",
      "ఈ సమస్య పొలం మొత్తం వ్యాపిస్తుందో గమనించండి.",
    ],
    treatment:
      "ఈ ఫలితాన్ని మాత్రమే ఆధారంగా చేసుకుని రసాయనాలు వాడవద్దు. అవసరమైతే తీవ్రంగా దెబ్బతిన్న ఆకులను తొలగించి స్థానిక వ్యవసాయ అధికారిని లేదా మొక్కల వ్యాధి నిపుణుడిని సంప్రదించండి.",
    prevention:
      "ఆరోగ్యకరమైన నాటే పదార్థాన్ని ఉపయోగించండి, పొలం పరిశుభ్రంగా ఉంచండి, అధిక నీటిపారుదలను నివారించండి మరియు పంటను తరచుగా పరిశీలించండి.",
    narration:
      "ఈ చిత్రాన్ని ఆధారంగా వ్యాధిని ఖచ్చితంగా గుర్తించలేకపోయాము. మంచి వెలుతురులో ప్రభావితమైన ఆకు యొక్క స్పష్టమైన దగ్గరి చిత్రాన్ని అప్‌లోడ్ చేయండి. పురుగుమందు వాడే ముందు స్థానిక వ్యవసాయ అధికారిని సంప్రదించండి.",
    message:
      "AI విశ్లేషణ ప్రస్తుతం అందుబాటులో లేదు. సాధారణ సురక్షిత సూచన చూపబడుతోంది.",
  },

  "hi-IN": {
    disease: "रोग की सही पहचान नहीं हो सकी",
    confidence: "कम",
    cause:
      "तस्वीर स्पष्ट न होने या AI सेवा उपलब्ध न होने के कारण रोग की सही पहचान नहीं हो सकी।",
    symptoms: [
      "पत्तियों पर धब्बे, रंग बदलना, मुड़ना या सूखना जांचें।",
      "पत्तियों के दोनों तरफ और आसपास के पौधों को देखें।",
      "देखें कि समस्या खेत में फैल रही है या नहीं।",
    ],
    treatment:
      "केवल इस परिणाम के आधार पर रसायन न लगाएं। आवश्यक होने पर गंभीर रूप से प्रभावित पत्तियां हटाएं और स्थानीय कृषि अधिकारी से संपर्क करें।",
    prevention:
      "स्वस्थ रोपण सामग्री का उपयोग करें, खेत को साफ रखें, अधिक सिंचाई से बचें और फसल की नियमित जांच करें।",
    narration:
      "इस तस्वीर से रोग की सही पहचान नहीं हो सकी। अच्छी रोशनी में प्रभावित पत्ती की स्पष्ट नजदीकी तस्वीर अपलोड करें और कीटनाशक लगाने से पहले स्थानीय कृषि अधिकारी से संपर्क करें।",
    message:
      "AI विश्लेषण अभी उपलब्ध नहीं है। सामान्य सुरक्षित सलाह दिखाई जा रही है।",
  },

  "ta-IN": {
    disease: "நோயை துல்லியமாக கண்டறிய முடியவில்லை",
    confidence: "குறைவு",
    cause:
      "படம் தெளிவாக இல்லாததால் அல்லது AI சேவை கிடைக்காததால் நோயை துல்லியமாக கண்டறிய முடியவில்லை.",
    symptoms: [
      "இலைகளில் புள்ளிகள், நிறமாற்றம், சுருட்டல் அல்லது உலர்வு உள்ளதா பாருங்கள்.",
      "இலையின் இருபுறங்களையும் அருகிலுள்ள தாவரங்களையும் பரிசோதிக்கவும்.",
      "பிரச்சினை வயலில் பரவுகிறதா கவனிக்கவும்.",
    ],
    treatment:
      "இந்த முடிவை மட்டும் நம்பி ரசாயனங்களைப் பயன்படுத்த வேண்டாம். கடுமையாக பாதிக்கப்பட்ட இலைகளை தேவைக்கேற்ப அகற்றி உள்ளூர் வேளாண் அதிகாரியை அணுகவும்.",
    prevention:
      "ஆரோக்கியமான நடவு பொருட்களைப் பயன்படுத்தவும், வயலை சுத்தமாக வைத்திருக்கவும், அதிக நீர்ப்பாசனத்தைத் தவிர்க்கவும் மற்றும் பயிரை தொடர்ந்து கண்காணிக்கவும்.",
    narration:
      "இந்தப் படத்தின் அடிப்படையில் நோயை துல்லியமாக கண்டறிய முடியவில்லை. நல்ல வெளிச்சத்தில் பாதிக்கப்பட்ட இலையின் தெளிவான நெருக்கமான படத்தை பதிவேற்றவும். பூச்சிக்கொல்லி பயன்படுத்தும் முன் வேளாண் அதிகாரியை அணுகவும்.",
    message:
      "AI ஆய்வு தற்போது கிடைக்கவில்லை. பொதுவான பாதுகாப்பான ஆலோசனை காட்டப்படுகிறது.",
  },

  "kn-IN": {
    disease: "ರೋಗವನ್ನು ನಿಖರವಾಗಿ ಗುರುತಿಸಲಾಗಲಿಲ್ಲ",
    confidence: "ಕಡಿಮೆ",
    cause:
      "ಚಿತ್ರ ಸ್ಪಷ್ಟವಾಗಿಲ್ಲದಿರುವುದು ಅಥವಾ AI ಸೇವೆ ಲಭ್ಯವಿಲ್ಲದಿರುವುದರಿಂದ ರೋಗವನ್ನು ನಿಖರವಾಗಿ ಗುರುತಿಸಲಾಗಲಿಲ್ಲ.",
    symptoms: [
      "ಎಲೆಗಳಲ್ಲಿ ಕಲೆಗಳು, ಬಣ್ಣ ಬದಲಾವಣೆ, ಮಡಚಿಕೊಳ್ಳುವುದು ಅಥವಾ ಒಣಗುವುದು ಇದೆಯೇ ನೋಡಿ.",
      "ಎಲೆಗಳ ಎರಡೂ ಬದಿಗಳನ್ನು ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ಸಸ್ಯಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
      "ಸಮಸ್ಯೆ ಹೊಲದಲ್ಲಿ ಹರಡುತ್ತಿದೆಯೇ ಗಮನಿಸಿ.",
    ],
    treatment:
      "ಈ ಫಲಿತಾಂಶವನ್ನು ಮಾತ್ರ ಆಧರಿಸಿ ರಾಸಾಯನಿಕಗಳನ್ನು ಬಳಸಬೇಡಿ. ಅಗತ್ಯವಿದ್ದರೆ ತೀವ್ರವಾಗಿ ಹಾನಿಗೊಂಡ ಎಲೆಗಳನ್ನು ತೆಗೆದು ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    prevention:
      "ಆರೋಗ್ಯಕರ ನೆಡುವ ವಸ್ತು ಬಳಸಿ, ಹೊಲವನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ, ಹೆಚ್ಚು ನೀರಾವರಿ ತಪ್ಪಿಸಿ ಮತ್ತು ಬೆಳೆಯನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ.",
    narration:
      "ಈ ಚಿತ್ರದಿಂದ ರೋಗವನ್ನು ನಿಖರವಾಗಿ ಗುರುತಿಸಲಾಗಲಿಲ್ಲ. ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿ ಹಾನಿಗೊಂಡ ಎಲೆಯ ಸ್ಪಷ್ಟ ಸಮೀಪದ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಕೀಟನಾಶಕ ಬಳಸುವ ಮೊದಲು ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    message:
      "AI ವಿಶ್ಲೇಷಣೆ ಈಗ ಲಭ್ಯವಿಲ್ಲ. ಸಾಮಾನ್ಯ ಸುರಕ್ಷಿತ ಸಲಹೆ ತೋರಿಸಲಾಗುತ್ತಿದೆ.",
  },

  "ml-IN": {
    disease: "രോഗം കൃത്യമായി തിരിച്ചറിയാനായില്ല",
    confidence: "കുറവ്",
    cause:
      "ചിത്രം വ്യക്തമല്ലാത്തതിനാലോ AI സേവനം ലഭ്യമല്ലാത്തതിനാലോ രോഗം കൃത്യമായി തിരിച്ചറിയാനായില്ല.",
    symptoms: [
      "ഇലകളിൽ പാടുകൾ, നിറമാറ്റം, ചുരുളൽ അല്ലെങ്കിൽ ഉണങ്ങൽ ഉണ്ടോ പരിശോധിക്കുക.",
      "ഇലകളുടെ ഇരുവശവും സമീപമുള്ള ചെടികളും പരിശോധിക്കുക.",
      "പ്രശ്നം കൃഷിയിടത്തിൽ പടരുന്നുണ്ടോ ശ്രദ്ധിക്കുക.",
    ],
    treatment:
      "ഈ ഫലം മാത്രം അടിസ്ഥാനമാക്കി രാസവസ്തുക്കൾ ഉപയോഗിക്കരുത്. ആവശ്യമായാൽ ഗുരുതരമായി ബാധിച്ച ഇലകൾ നീക്കം ചെയ്ത് പ്രാദേശിക കൃഷി ഓഫീസറെ സമീപിക്കുക.",
    prevention:
      "ആരോഗ്യമുള്ള നടീൽ വസ്തുക്കൾ ഉപയോഗിക്കുക, കൃഷിയിടം വൃത്തിയായി സൂക്ഷിക്കുക, അധിക ജലസേചനം ഒഴിവാക്കുക, വിള പതിവായി പരിശോധിക്കുക.",
    narration:
      "ഈ ചിത്രത്തിൽ നിന്ന് രോഗം കൃത്യമായി തിരിച്ചറിയാനായില്ല. നല്ല വെളിച്ചത്തിൽ ബാധിച്ച ഇലയുടെ വ്യക്തമായ അടുത്ത ചിത്രം അപ്‌ലോഡ് ചെയ്യുക. കീടനാശിനി ഉപയോഗിക്കുന്നതിന് മുമ്പ് കൃഷി ഓഫീസറെ സമീപിക്കുക.",
    message:
      "AI വിശകലനം ഇപ്പോൾ ലഭ്യമല്ല. പൊതുവായ സുരക്ഷിത നിർദേശം കാണിക്കുന്നു.",
  },
};

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  return new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );
};

const extractJson = (value) => {
  let cleanedText = String(value || "")
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
      "No valid JSON object found"
    );
  }

  cleanedText = cleanedText.slice(
    firstBrace,
    lastBrace + 1
  );

  return JSON.parse(cleanedText);
};

const getValidString = (
  value,
  fallback
) => {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  return fallback;
};

const getValidSymptoms = (
  value,
  fallback
) => {
  if (Array.isArray(value)) {
    const symptoms = value
      .filter(
        (item) =>
          typeof item === "string" &&
          item.trim()
      )
      .map((item) => item.trim())
      .slice(0, 5);

    if (symptoms.length > 0) {
      return symptoms;
    }
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return [value.trim()];
  }

  return fallback;
};

const createFallbackResult = (
  language
) => {
  const selectedLanguage =
    FALLBACK_RESPONSES[language]
      ? language
      : "en-IN";

  const fallback =
    FALLBACK_RESPONSES[
      selectedLanguage
    ];

  return {
    disease: fallback.disease,
    confidence: fallback.confidence,
    cause: fallback.cause,
    symptoms: fallback.symptoms,
    treatment: fallback.treatment,
    prevention: fallback.prevention,
    narration: fallback.narration,
    fallback: true,
  };
};

const detectDisease = async (
  req,
  res
) => {
  const requestedLanguage =
    req.body?.language || "en-IN";

  const selectedLanguage =
    LANGUAGE_NAMES[requestedLanguage]
      ? requestedLanguage
      : "en-IN";

  const fallbackResult =
    createFallbackResult(
      selectedLanguage
    );

  const fallbackText =
    FALLBACK_RESPONSES[
      selectedLanguage
    ];

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image.",
    });
  }

  if (
    !req.file.mimetype?.startsWith(
      "image/"
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Uploaded file must be an image.",
    });
  }

  const genAI = getGeminiClient();

  if (!genAI) {
    console.warn(
      "GEMINI_API_KEY is missing."
    );

    return res.status(200).json({
      success: true,
      result: fallbackResult,
      message: fallbackText.message,
    });
  }

  try {
    const languageName =
      LANGUAGE_NAMES[selectedLanguage];

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",

        generationConfig: {
          temperature: 0.2,
          responseMimeType:
            "application/json",
        },
      });

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString(
          "base64"
        ),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `
You are AgriSense AI, an Indian crop disease analysis assistant.

Analyze the uploaded image carefully.

Required response language:
${languageName}

Return exactly one valid JSON object using this structure:

{
  "disease": "Disease name or Unable to identify",
  "confidence": "Confidence percentage or Low",
  "cause": "Likely cause",
  "symptoms": [
    "Visible symptom 1",
    "Visible symptom 2",
    "Visible symptom 3"
  ],
  "treatment": "Safe practical treatment guidance",
  "prevention": "Prevention guidance",
  "narration": "Natural spoken summary"
}

Strict rules:

1. Write every user-facing value in ${languageName}.
2. Keep JSON property names in English.
3. Return valid JSON only.
4. Do not use markdown or code blocks.
5. Do not claim certainty when the image is unclear.
6. If the image is not a crop leaf or plant image, set disease to an appropriate message saying identification is not possible.
7. Do not invent a disease when visible evidence is insufficient.
8. Confidence must reflect actual image clarity and evidence.
9. Include three concise visible symptoms.
10. Treatment must begin with low-risk actions such as field inspection, sanitation, isolation of affected plants, or removal of severely affected material when appropriate.
11. Do not recommend banned, highly hazardous, or restricted pesticides.
12. Any pesticide guidance must say to follow the product label and local agriculture officer guidance.
13. Do not provide an exact pesticide dosage unless it is clearly supported and safe.
14. Mention that laboratory or agriculture officer confirmation may be needed for uncertain cases.
15. Narration must be concise, natural, farmer-friendly, and suitable for text-to-speech.
16. Avoid literal machine translation. Use simple language commonly understood by farmers.
`;

    const result =
      await model.generateContent([
        prompt,
        imagePart,
      ]);

    const responseText =
      result?.response?.text?.() || "";

    if (!responseText.trim()) {
      return res.status(200).json({
        success: true,
        result: fallbackResult,
        message: fallbackText.message,
      });
    }

    let aiData;

    try {
      aiData =
        extractJson(responseText);
    } catch (parseError) {
      console.error(
        "Invalid disease AI JSON:",
        responseText
      );

      return res.status(200).json({
        success: true,
        result: fallbackResult,
        message:
          fallbackText.message,
      });
    }

    const finalResult = {
      disease: getValidString(
        aiData.disease,
        fallbackResult.disease
      ),

      confidence: getValidString(
        aiData.confidence,
        fallbackResult.confidence
      ),

      cause: getValidString(
        aiData.cause,
        fallbackResult.cause
      ),

      symptoms: getValidSymptoms(
        aiData.symptoms,
        fallbackResult.symptoms
      ),

      treatment: getValidString(
        aiData.treatment,
        fallbackResult.treatment
      ),

      prevention: getValidString(
        aiData.prevention,
        fallbackResult.prevention
      ),

      narration: getValidString(
        aiData.narration,
        fallbackResult.narration
      ),

      fallback: false,
    };

    return res.status(200).json({
      success: true,
      language: selectedLanguage,
      result: finalResult,
    });
  } catch (error) {
    const errorMessage =
      error?.message ||
      String(error);

    console.error(
      "Disease Detection Error:",
      errorMessage
    );

    const normalizedError =
      errorMessage.toLowerCase();

    const quotaExceeded =
      normalizedError.includes("quota") ||
      normalizedError.includes("429") ||
      error?.status === 429;

    return res.status(200).json({
      success: true,
      language: selectedLanguage,
      result: fallbackResult,
      message: quotaExceeded
        ? "Gemini quota is unavailable. A safe general response is being shown."
        : fallbackText.message,
    });
  }
};

module.exports = {
  detectDisease,
};