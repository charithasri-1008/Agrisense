const Groq = require("groq-sdk");

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

const LANGUAGE_NAMES = {
  "en-IN": "English",
  "te-IN": "Telugu",
  "hi-IN": "Hindi",
  "ta-IN": "Tamil",
  "kn-IN": "Kannada",
  "ml-IN": "Malayalam",
};

const SUPPORTED_SOILS = [
  "Clay",
  "Black",
  "Loamy",
  "Sandy",
];

const SUPPORTED_SEASONS = [
  "Kharif",
  "Rabi",
  "Zaid",
];

const CROP_NAMES = {
  Rice: {
    "en-IN": "Rice",
    "te-IN": "వరి",
    "hi-IN": "धान",
    "ta-IN": "நெல்",
    "kn-IN": "ಭತ್ತ",
    "ml-IN": "നെല്ല്",
  },

  Cotton: {
    "en-IN": "Cotton",
    "te-IN": "పత్తి",
    "hi-IN": "कपास",
    "ta-IN": "பருத்தி",
    "kn-IN": "ಹತ್ತಿ",
    "ml-IN": "പരുത്തി",
  },

  Wheat: {
    "en-IN": "Wheat",
    "te-IN": "గోధుమ",
    "hi-IN": "गेहूं",
    "ta-IN": "கோதுமை",
    "kn-IN": "ಗೋಧಿ",
    "ml-IN": "ഗോതമ്പ്",
  },

  Groundnut: {
    "en-IN": "Groundnut",
    "te-IN": "వేరుశనగ",
    "hi-IN": "मूंगफली",
    "ta-IN": "நிலக்கடலை",
    "kn-IN": "ಕಡಲೆಕಾಯಿ",
    "ml-IN": "നിലക്കടല",
  },

  Millets: {
    "en-IN": "Millets",
    "te-IN": "చిరుధాన్యాలు",
    "hi-IN": "मोटे अनाज",
    "ta-IN": "சிறுதானியங்கள்",
    "kn-IN": "ಸಿರಿಧಾನ್ಯಗಳು",
    "ml-IN": "ചെറുധാന്യങ്ങൾ",
  },

  Maize: {
    "en-IN": "Maize",
    "te-IN": "మొక్కజొన్న",
    "hi-IN": "मक्का",
    "ta-IN": "மக்காச்சோளம்",
    "kn-IN": "ಮೆಕ್ಕೆಜೋಳ",
    "ml-IN": "ചോളം",
  },
};

const FALLBACK_TEXT = {
  "en-IN": {
    confidence: "85%",

    reason: (crop, season) => [
      `${crop} is suitable for the given soil and weather conditions.`,
      `The ${season} season can support this crop with proper field management.`,
      "This recommendation considers rainfall, temperature and soil type.",
    ],

    fertilizer:
      "Use balanced NPK fertilizer after checking the soil test report. Consult a local agriculture officer for the correct quantity.",

    pesticide:
      "Use pesticides only after confirming pest infestation. Follow the product label and local agriculture officer guidance.",

    irrigation:
      "Check soil moisture regularly and irrigate according to the crop growth stage. Avoid excessive watering.",

    expectedYield:
      "Expected yield depends on seed quality, soil fertility, rainfall, irrigation and farming practices.",

    tips: [
      "Use certified and healthy seeds.",
      "Monitor the field regularly for pests and diseases.",
      "Follow local agriculture department recommendations.",
    ],

    narration: (crop) =>
      `${crop} is recommended based on the selected soil type, season, rainfall and temperature. Use certified seeds, maintain proper irrigation and consult a local agriculture officer before applying fertilizers or pesticides.`,

    quotaMessage:
      "AI request limit was reached. A standard recommendation is being shown.",

    serviceMessage:
      "AI service is temporarily unavailable. A standard recommendation is being shown.",

    invalidMessage:
      "AI returned an invalid response. A standard recommendation is being shown.",
  },

  "te-IN": {
    confidence: "85%",

    reason: (crop, season) => [
      `ఇచ్చిన నేల మరియు వాతావరణ పరిస్థితులకు ${crop} అనుకూలంగా ఉంటుంది.`,
      `${season} కాలంలో సరైన పొలం నిర్వహణతో ఈ పంటను సాగు చేయవచ్చు.`,
      "వర్షపాతం, ఉష్ణోగ్రత మరియు నేల రకాన్ని ఆధారంగా ఈ సిఫార్సు ఇవ్వబడింది.",
    ],

    fertilizer:
      "నేల పరీక్ష నివేదికను పరిశీలించిన తరువాత సమతుల్య NPK ఎరువులను వాడండి. సరైన మోతాదు కోసం స్థానిక వ్యవసాయ అధికారిని సంప్రదించండి.",

    pesticide:
      "పురుగు ఉధృతి నిర్ధారించిన తరువాత మాత్రమే పురుగుమందు వాడండి. ఉత్పత్తి లేబుల్ మరియు స్థానిక వ్యవసాయ అధికారి సూచనలను పాటించండి.",

    irrigation:
      "నేల తేమను తరచుగా పరిశీలించి పంట పెరుగుదల దశకు అనుగుణంగా నీరు పెట్టండి. అధిక నీటిపారుదలను నివారించండి.",

    expectedYield:
      "దిగుబడి విత్తన నాణ్యత, నేల సారవంతత, వర్షపాతం, నీటిపారుదల మరియు సాగు విధానాలపై ఆధారపడి ఉంటుంది.",

    tips: [
      "ధృవీకరించిన ఆరోగ్యకరమైన విత్తనాలను ఉపయోగించండి.",
      "పురుగులు మరియు వ్యాధుల కోసం పొలాన్ని తరచుగా పరిశీలించండి.",
      "స్థానిక వ్యవసాయ శాఖ సూచనలను పాటించండి.",
    ],

    narration: (crop) =>
      `మీరు ఇచ్చిన నేల రకం, కాలం, వర్షపాతం మరియు ఉష్ణోగ్రత ఆధారంగా ${crop} సిఫార్సు చేయబడింది. నాణ్యమైన విత్తనాలను ఉపయోగించండి, సరైన నీటిపారుదల నిర్వహించండి మరియు ఎరువులు లేదా పురుగుమందులు వాడే ముందు వ్యవసాయ అధికారిని సంప్రదించండి.`,

    quotaMessage:
      "AI అభ్యర్థన పరిమితి పూర్తైంది. సాధారణ పంట సిఫార్సు చూపబడుతోంది.",

    serviceMessage:
      "AI సేవ ప్రస్తుతం అందుబాటులో లేదు. సాధారణ పంట సిఫార్సు చూపబడుతోంది.",

    invalidMessage:
      "AI నుంచి సరైన సమాధానం రాలేదు. సాధారణ పంట సిఫార్సు చూపబడుతోంది.",
  },

  "hi-IN": {
    confidence: "85%",

    reason: (crop, season) => [
      `${crop} दी गई मिट्टी और मौसम की परिस्थितियों के लिए उपयुक्त है।`,
      `${season} मौसम में उचित खेत प्रबंधन के साथ इस फसल की खेती की जा सकती है।`,
      "यह सुझाव वर्षा, तापमान और मिट्टी के प्रकार पर आधारित है।",
    ],

    fertilizer:
      "मिट्टी परीक्षण रिपोर्ट के बाद संतुलित NPK उर्वरक का उपयोग करें। सही मात्रा के लिए स्थानीय कृषि अधिकारी से संपर्क करें।",

    pesticide:
      "कीट प्रकोप की पुष्टि के बाद ही कीटनाशक का उपयोग करें। उत्पाद लेबल और स्थानीय कृषि अधिकारी के निर्देशों का पालन करें।",

    irrigation:
      "मिट्टी की नमी नियमित रूप से जांचें और फसल की अवस्था के अनुसार सिंचाई करें। अधिक पानी देने से बचें।",

    expectedYield:
      "उपज बीज की गुणवत्ता, मिट्टी की उर्वरता, वर्षा, सिंचाई और कृषि पद्धतियों पर निर्भर करती है।",

    tips: [
      "प्रमाणित और स्वस्थ बीजों का उपयोग करें।",
      "कीटों और रोगों के लिए खेत की नियमित जांच करें।",
      "स्थानीय कृषि विभाग की सलाह का पालन करें।",
    ],

    narration: (crop) =>
      `मिट्टी के प्रकार, मौसम, वर्षा और तापमान के आधार पर ${crop} की सिफारिश की गई है। प्रमाणित बीजों का उपयोग करें, उचित सिंचाई बनाए रखें और उर्वरक या कीटनाशक उपयोग से पहले कृषि अधिकारी से संपर्क करें।`,

    quotaMessage:
      "AI अनुरोध सीमा पूरी हो गई है। सामान्य सुझाव दिखाया जा रहा है।",

    serviceMessage:
      "AI सेवा अभी उपलब्ध नहीं है। सामान्य सुझाव दिखाया जा रहा है।",

    invalidMessage:
      "AI से सही उत्तर नहीं मिला। सामान्य सुझाव दिखाया जा रहा है।",
  },

  "ta-IN": {
    confidence: "85%",

    reason: (crop, season) => [
      `கொடுக்கப்பட்ட மண் மற்றும் வானிலை நிலைகளுக்கு ${crop} ஏற்றது.`,
      `${season} பருவத்தில் சரியான நில மேலாண்மையுடன் இந்தப் பயிரை வளர்க்கலாம்.`,
      "மழை, வெப்பநிலை மற்றும் மண் வகையை அடிப்படையாகக் கொண்டு இந்த பரிந்துரை வழங்கப்பட்டுள்ளது.",
    ],

    fertilizer:
      "மண் பரிசோதனை அறிக்கைக்குப் பிறகு சமநிலையான NPK உரத்தைப் பயன்படுத்தவும். சரியான அளவுக்கு உள்ளூர் வேளாண் அதிகாரியை அணுகவும்.",

    pesticide:
      "பூச்சி தாக்குதல் உறுதி செய்யப்பட்ட பிறகு மட்டுமே பூச்சிக்கொல்லி பயன்படுத்தவும். தயாரிப்பு லேபிள் மற்றும் வேளாண் அதிகாரியின் ஆலோசனையைப் பின்பற்றவும்.",

    irrigation:
      "மண்ணின் ஈரப்பதத்தை அடிக்கடி பரிசோதித்து பயிர் வளர்ச்சி நிலைக்கு ஏற்ப நீர்ப்பாசனம் செய்யவும். அதிக நீரை தவிர்க்கவும்.",

    expectedYield:
      "விளைச்சல் விதை தரம், மண் வளம், மழை, நீர்ப்பாசனம் மற்றும் விவசாய முறைகளைப் பொறுத்தது.",

    tips: [
      "சான்றளிக்கப்பட்ட ஆரோக்கியமான விதைகளைப் பயன்படுத்தவும்.",
      "பூச்சிகள் மற்றும் நோய்களுக்காக நிலத்தை அடிக்கடி பரிசோதிக்கவும்.",
      "உள்ளூர் வேளாண் துறை பரிந்துரைகளைப் பின்பற்றவும்.",
    ],

    narration: (crop) =>
      `மண் வகை, பருவம், மழை மற்றும் வெப்பநிலையை அடிப்படையாகக் கொண்டு ${crop} பரிந்துரைக்கப்படுகிறது. தரமான விதைகளைப் பயன்படுத்தி சரியான நீர்ப்பாசனத்தை மேற்கொள்ளவும். உரம் அல்லது பூச்சிக்கொல்லி பயன்படுத்துவதற்கு முன் வேளாண் அதிகாரியை அணுகவும்.`,

    quotaMessage:
      "AI கோரிக்கை வரம்பு முடிந்துள்ளது. பொதுவான பரிந்துரை காட்டப்படுகிறது.",

    serviceMessage:
      "AI சேவை தற்போது கிடைக்கவில்லை. பொதுவான பரிந்துரை காட்டப்படுகிறது.",

    invalidMessage:
      "AI சரியான பதிலை வழங்கவில்லை. பொதுவான பரிந்துரை காட்டப்படுகிறது.",
  },

  "kn-IN": {
    confidence: "85%",

    reason: (crop, season) => [
      `ನೀಡಿದ ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ${crop} ಸೂಕ್ತವಾಗಿದೆ.`,
      `${season} ಋತುವಿನಲ್ಲಿ ಸರಿಯಾದ ಹೊಲ ನಿರ್ವಹಣೆಯೊಂದಿಗೆ ಈ ಬೆಳೆಯನ್ನು ಬೆಳೆಸಬಹುದು.`,
      "ಮಳೆ, ತಾಪಮಾನ ಮತ್ತು ಮಣ್ಣಿನ ಪ್ರಕಾರದ ಆಧಾರದ ಮೇಲೆ ಈ ಶಿಫಾರಸು ನೀಡಲಾಗಿದೆ.",
    ],

    fertilizer:
      "ಮಣ್ಣಿನ ಪರೀಕ್ಷಾ ವರದಿ ಪರಿಶೀಲಿಸಿದ ನಂತರ ಸಮತೋಲಿತ NPK ಗೊಬ್ಬರ ಬಳಸಿ. ಸರಿಯಾದ ಪ್ರಮಾಣಕ್ಕಾಗಿ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",

    pesticide:
      "ಕೀಟದ ಹಾವಳಿ ದೃಢಪಟ್ಟ ನಂತರ ಮಾತ್ರ ಕೀಟನಾಶಕ ಬಳಸಿ. ಉತ್ಪನ್ನದ ಲೇಬಲ್ ಮತ್ತು ಕೃಷಿ ಅಧಿಕಾರಿಯ ಸೂಚನೆಗಳನ್ನು ಪಾಲಿಸಿ.",

    irrigation:
      "ಮಣ್ಣಿನ ತೇವಾಂಶವನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಬೆಳೆಯ ಹಂತಕ್ಕೆ ಅನುಗುಣವಾಗಿ ನೀರಾವರಿ ಮಾಡಿ. ಹೆಚ್ಚು ನೀರು ನೀಡಬೇಡಿ.",

    expectedYield:
      "ಇಳುವರಿ ಬೀಜದ ಗುಣಮಟ್ಟ, ಮಣ್ಣಿನ ಫಲವತ್ತತೆ, ಮಳೆ, ನೀರಾವರಿ ಮತ್ತು ಕೃಷಿ ಕ್ರಮಗಳ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ.",

    tips: [
      "ಪ್ರಮಾಣೀಕೃತ ಆರೋಗ್ಯಕರ ಬೀಜಗಳನ್ನು ಬಳಸಿ.",
      "ಕೀಟಗಳು ಮತ್ತು ರೋಗಗಳಿಗಾಗಿ ಹೊಲವನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ.",
      "ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆಯ ಸಲಹೆಗಳನ್ನು ಪಾಲಿಸಿ.",
    ],

    narration: (crop) =>
      `ಮಣ್ಣಿನ ಪ್ರಕಾರ, ಋತು, ಮಳೆ ಮತ್ತು ತಾಪಮಾನವನ್ನು ಆಧರಿಸಿ ${crop} ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ. ಉತ್ತಮ ಬೀಜಗಳನ್ನು ಬಳಸಿ, ಸರಿಯಾದ ನೀರಾವರಿ ಮಾಡಿ ಮತ್ತು ಗೊಬ್ಬರ ಅಥವಾ ಕೀಟನಾಶಕ ಬಳಸುವ ಮೊದಲು ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.`,

    quotaMessage:
      "AI ವಿನಂತಿ ಮಿತಿ ಪೂರ್ಣಗೊಂಡಿದೆ. ಸಾಮಾನ್ಯ ಶಿಫಾರಸು ತೋರಿಸಲಾಗುತ್ತಿದೆ.",

    serviceMessage:
      "AI ಸೇವೆ ಈಗ ಲಭ್ಯವಿಲ್ಲ. ಸಾಮಾನ್ಯ ಶಿಫಾರಸು ತೋರಿಸಲಾಗುತ್ತಿದೆ.",

    invalidMessage:
      "AI ಸರಿಯಾದ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಲಿಲ್ಲ. ಸಾಮಾನ್ಯ ಶಿಫಾರಸು ತೋರಿಸಲಾಗುತ್ತಿದೆ.",
  },

  "ml-IN": {
    confidence: "85%",

    reason: (crop, season) => [
      `നൽകിയ മണ്ണിനും കാലാവസ്ഥയ്ക്കും ${crop} അനുയോജ്യമാണ്.`,
      `${season} കാലത്ത് ശരിയായ കൃഷി പരിപാലനത്തോടെ ഈ വിള വളർത്താം.`,
      "മഴ, താപനില, മണ്ണിന്റെ തരം എന്നിവയെ അടിസ്ഥാനമാക്കിയുള്ള ശുപാർശയാണിത്.",
    ],

    fertilizer:
      "മണ്ണ് പരിശോധനാ റിപ്പോർട്ട് പരിശോധിച്ച ശേഷം സമതുലിതമായ NPK വളം ഉപയോഗിക്കുക. ശരിയായ അളവിന് പ്രാദേശിക കൃഷി ഓഫീസറെ സമീപിക്കുക.",

    pesticide:
      "കീടബാധ സ്ഥിരീകരിച്ച ശേഷം മാത്രം കീടനാശിനി ഉപയോഗിക്കുക. ഉൽപ്പന്ന ലേബലും കൃഷി ഓഫീസറുടെ നിർദേശങ്ങളും പാലിക്കുക.",

    irrigation:
      "മണ്ണിലെ ഈർപ്പം പതിവായി പരിശോധിച്ച് വിളയുടെ വളർച്ചാ ഘട്ടത്തിന് അനുസരിച്ച് ജലസേചനം നൽകുക. അധിക വെള്ളം ഒഴിവാക്കുക.",

    expectedYield:
      "വിളവ് വിത്തിന്റെ ഗുണനിലവാരം, മണ്ണിന്റെ ഫലഭൂയിഷ്ഠത, മഴ, ജലസേചനം, കൃഷിരീതികൾ എന്നിവയെ ആശ്രയിച്ചിരിക്കും.",

    tips: [
      "സാക്ഷ്യപ്പെടുത്തിയ ആരോഗ്യകരമായ വിത്തുകൾ ഉപയോഗിക്കുക.",
      "കീടങ്ങളും രോഗങ്ങളും കണ്ടെത്താൻ കൃഷിയിടം പതിവായി പരിശോധിക്കുക.",
      "പ്രാദേശിക കൃഷിവകുപ്പിന്റെ നിർദേശങ്ങൾ പാലിക്കുക.",
    ],

    narration: (crop) =>
      `മണ്ണിന്റെ തരം, കാലം, മഴ, താപനില എന്നിവയെ അടിസ്ഥാനമാക്കി ${crop} ശുപാർശ ചെയ്യുന്നു. ഗുണമേന്മയുള്ള വിത്തുകൾ ഉപയോഗിക്കുക, ശരിയായ ജലസേചനം നൽകുക, വളമോ കീടനാശിനിയോ ഉപയോഗിക്കുന്നതിന് മുമ്പ് കൃഷി ഓഫീസറെ സമീപിക്കുക.`,

    quotaMessage:
      "AI അഭ്യർത്ഥന പരിധി കഴിഞ്ഞു. സാധാരണ ശുപാർശ കാണിക്കുന്നു.",

    serviceMessage:
      "AI സേവനം ഇപ്പോൾ ലഭ്യമല്ല. സാധാരണ ശുപാർശ കാണിക്കുന്നു.",

    invalidMessage:
      "AI ശരിയായ മറുപടി നൽകിയില്ല. സാധാരണ ശുപാർശ കാണിക്കുന്നു.",
  },
};

const getRecommendedCrop = ({
  soilType,
  season,
  rainfall,
  temperature,
}) => {
  if (
    soilType === "Clay" &&
    rainfall >= 150 &&
    season === "Kharif"
  ) {
    return "Rice";
  }

  if (
    soilType === "Black" &&
    temperature >= 20
  ) {
    return "Cotton";
  }

  if (
    soilType === "Loamy" &&
    season === "Rabi"
  ) {
    return "Wheat";
  }

  if (soilType === "Sandy") {
    return "Groundnut";
  }

  if (temperature > 30) {
    return "Millets";
  }

  return "Maize";
};

const getLocalizedCropName = (
  crop,
  language
) => {
  return (
    CROP_NAMES[crop]?.[language] ||
    CROP_NAMES[crop]?.["en-IN"] ||
    crop
  );
};
const getFallbackResponse = ({
  cropKey,
  soilType,
  season,
  rainfall,
  temperature,
  language,
  message,
}) => {
  const selectedLanguage =
    FALLBACK_TEXT[language]
      ? language
      : "en-IN";

  const text =
    FALLBACK_TEXT[selectedLanguage];

  const localizedCrop =
    getLocalizedCropName(
      cropKey,
      selectedLanguage
    );

  return {
    success: true,

    recommendedCrop:
      localizedCrop,

    recommendedCropKey:
      cropKey,

    soilType,
    season,
    rainfall,
    temperature,

    language:
      selectedLanguage,

    confidence:
      text.confidence,

    reason:
      text.reason(
        localizedCrop,
        season
      ),

    fertilizer:
      text.fertilizer,

    pesticide:
      text.pesticide,

    irrigation:
      text.irrigation,

    expectedYield:
      text.expectedYield,

    tips:
      text.tips,

    narration:
      text.narration(
        localizedCrop
      ),

    fallback: true,

    message:
      message ||
      text.serviceMessage,
  };
};

const extractJson = (text) => {
  let cleanedText =
    String(text || "")
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

  cleanedText =
    cleanedText.slice(
      firstBrace,
      lastBrace + 1
    );

  try {
    return JSON.parse(
      cleanedText
    );
  } catch (error) {
    throw new Error(
      `Groq JSON parsing failed: ${error.message}`
    );
  }
};

const getValidString = (
  value,
  fallback
) => {
  return (
    typeof value ===
      "string" &&
    value.trim()
  )
    ? value.trim()
    : fallback;
};

const getValidArray = (
  value,
  fallback
) => {
  if (
    !Array.isArray(value)
  ) {
    return fallback;
  }

  const cleanedItems =
    value
      .filter(
        (item) =>
          typeof item ===
            "string" &&
          item.trim()
      )
      .map((item) =>
        item.trim()
      )
      .slice(0, 3);

  return (
    cleanedItems.length === 3
  )
    ? cleanedItems
    : fallback;
};

const getGroqErrorStatus = (
  error
) => {
  const directStatus =
    Number(
      error?.status ||
      error?.response?.status
    );

  if (
    Number.isInteger(
      directStatus
    ) &&
    directStatus >= 400 &&
    directStatus <= 599
  ) {
    return directStatus;
  }

  const message =
    String(
      error?.message || ""
    ).toLowerCase();

  if (
    message.includes("429") ||
    message.includes(
      "rate limit"
    ) ||
    message.includes("quota")
  ) {
    return 429;
  }

  if (
    message.includes("401") ||
    message.includes(
      "unauthorized"
    ) ||
    message.includes(
      "api key"
    )
  ) {
    return 401;
  }

  if (
    message.includes("403") ||
    message.includes(
      "permission"
    )
  ) {
    return 403;
  }

  return 500;
};

const recommendCrop = async (
  req,
  res
) => {
  const {
    soilType,
    season,
    rainfall,
    temperature,
    language = "en-IN",
  } = req.body || {};

  const selectedLanguage =
    LANGUAGE_NAMES[language]
      ? language
      : "en-IN";

  if (
    !soilType ||
    !season ||
    rainfall === undefined ||
    temperature === undefined
  ) {
    return res
      .status(400)
      .json({
        success: false,

        message:
          "Soil type, season, rainfall and temperature are required.",
      });
  }

  if (
    !SUPPORTED_SOILS.includes(
      soilType
    )
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Invalid soil type.",
      });
  }

  if (
    !SUPPORTED_SEASONS.includes(
      season
    )
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Invalid season.",
      });
  }

  const rainfallNumber =
    Number(rainfall);

  const temperatureNumber =
    Number(temperature);

  if (
    !Number.isFinite(
      rainfallNumber
    ) ||
    !Number.isFinite(
      temperatureNumber
    )
  ) {
    return res
      .status(400)
      .json({
        success: false,

        message:
          "Rainfall and temperature must be valid numbers.",
      });
  }

  if (
    rainfallNumber < 0
  ) {
    return res
      .status(400)
      .json({
        success: false,

        message:
          "Rainfall cannot be negative.",
      });
  }

  if (
    temperatureNumber < -20 ||
    temperatureNumber > 60
  ) {
    return res
      .status(400)
      .json({
        success: false,

        message:
          "Temperature must be between -20°C and 60°C.",
      });
  }

  const cropKey =
    getRecommendedCrop({
      soilType,
      season,

      rainfall:
        rainfallNumber,

      temperature:
        temperatureNumber,
    });

  const localizedCrop =
    getLocalizedCropName(
      cropKey,
      selectedLanguage
    );

  const fallbackText =
    FALLBACK_TEXT[
      selectedLanguage
    ];

  const createFallback = (
    message
  ) =>
    getFallbackResponse({
      cropKey,
      soilType,
      season,

      rainfall:
        rainfallNumber,

      temperature:
        temperatureNumber,

      language:
        selectedLanguage,

      message,
    });

  const groq =
    getGroqClient();

  const modelName =
    process.env
      .GROQ_MODEL?.trim();

  if (
    !groq ||
    !modelName
  ) {
    console.warn(
      "GROQ_API_KEY or GROQ_MODEL is missing."
    );

    return res
      .status(200)
      .json(
        createFallback(
          fallbackText
            .serviceMessage
        )
      );
  }

  try {
    const languageName =
      LANGUAGE_NAMES[
        selectedLanguage
      ];

    const prompt = `
You are AgriSense AI, an expert Indian agriculture advisor.

The crop has already been selected using backend rule-based logic.

Do not change the selected crop.

Farmer information:

Soil type: ${soilType}
Season: ${season}
Rainfall: ${rainfallNumber} mm
Temperature: ${temperatureNumber} °C

Selected crop:

Canonical crop name: ${cropKey}
Localized crop name: ${localizedCrop}

Required response language:

${languageName}

Return exactly one valid JSON object using this structure:

{
  "recommendedCrop": "${localizedCrop}",
  "confidence": "Realistic confidence percentage",
  "reason": [
    "Reason 1",
    "Reason 2",
    "Reason 3"
  ],
  "fertilizer": "Safe fertilizer guidance",
  "pesticide": "Safe pesticide guidance",
  "irrigation": "Practical irrigation guidance",
  "expectedYield": "Realistic expected yield guidance per hectare",
  "tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ],
  "narration": "Natural spoken summary"
}

Strict rules:

1. Write every user-facing value in ${languageName}.
2. Keep all JSON property names in English.
3. Keep recommendedCrop exactly as "${localizedCrop}".
4. Do not change the selected crop.
5. Return valid JSON only.
6. Do not use markdown or code blocks.
7. Include exactly three reasons.
8. Include exactly three practical tips.
9. Narration must be natural and suitable for text-to-speech.
10. Do not recommend banned, restricted or highly hazardous pesticides.
11. Do not provide exact pesticide dosage.
12. State that pesticides must be used according to the product label and local agriculture officer guidance.
13. Fertilizer advice must recommend using a soil test report and local expert guidance.
14. Do not promise a guaranteed yield.
15. Explain that yield depends on seed quality, soil fertility, weather, irrigation and farm management.
16. Keep the response concise, complete and farmer-friendly.
`;

    const completion =
      await groq.chat
        .completions
        .create({
          model:
            modelName,

          temperature:
            0.2,

          max_completion_tokens:
            1600,

          messages: [
            {
              role:
                "system",

              content:
                "You are a responsible Indian agriculture advisor. Return strict JSON only.",
            },

            {
              role:
                "user",

              content:
                prompt,
            },
          ],
        });

    const responseText =
      completion
        ?.choices?.[0]
        ?.message?.content ||
      "";

    const finishReason =
      completion
        ?.choices?.[0]
        ?.finish_reason ||
      "unknown";

    console.log(
      "Groq crop recommendation finish reason:",
      finishReason
    );

    if (
      !responseText.trim()
    ) {
      return res
        .status(200)
        .json(
          createFallback(
            fallbackText
              .serviceMessage
          )
        );
    }

    let aiData;

    try {
      aiData =
        extractJson(
          responseText
        );
    } catch (
      parseError
    ) {
      console.error(
        "Invalid Groq JSON:",
        responseText
      );

      return res
        .status(200)
        .json(
          createFallback(
            fallbackText
              .invalidMessage
          )
        );
    }

    const fallback =
      createFallback();

    return res
      .status(200)
      .json({
        success: true,

        recommendedCrop:
          getValidString(
            aiData
              .recommendedCrop,

            localizedCrop
          ),

        recommendedCropKey:
          cropKey,

        soilType,
        season,

        rainfall:
          rainfallNumber,

        temperature:
          temperatureNumber,

        language:
          selectedLanguage,

        confidence:
          getValidString(
            aiData.confidence,
            fallback.confidence
          ),

        reason:
          getValidArray(
            aiData.reason,
            fallback.reason
          ),

        fertilizer:
          getValidString(
            aiData.fertilizer,
            fallback.fertilizer
          ),

        pesticide:
          getValidString(
            aiData.pesticide,
            fallback.pesticide
          ),

        irrigation:
          getValidString(
            aiData.irrigation,
            fallback.irrigation
          ),

        expectedYield:
          getValidString(
            aiData
              .expectedYield,

            fallback
              .expectedYield
          ),

        tips:
          getValidArray(
            aiData.tips,
            fallback.tips
          ),

        narration:
          getValidString(
            aiData.narration,
            fallback.narration
          ),

        fallback: false,
      });
  } catch (error) {
    const errorMessage =
      error?.message ||
      String(error);

    const status =
      getGroqErrorStatus(
        error
      );

    console.error(
      "Groq Crop Recommendation Error:",
      {
        status,
        message:
          errorMessage,
      }
    );

    return res
      .status(200)
      .json(
        createFallback(
          status === 429
            ? fallbackText
                .quotaMessage
            : fallbackText
                .serviceMessage
        )
      );
  }
};

module.exports = {
  recommendCrop,
};