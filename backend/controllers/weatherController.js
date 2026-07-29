const axios = require("axios");

const {
  generateWeatherAdvice,
} = require("../services/weatherAIService");

const SUPPORTED_LANGUAGES = {
  "en-IN": {
    apiCode: "en",

    messages: {
      cityRequired:
        "Please enter a city or village name.",

      apiMissing:
        "Weather API is not configured.",

      placeNotFound:
        "City or village not found. Please check the name.",

      invalidApiKey:
        "Weather API key is invalid.",

      timeout:
        "Weather service took too long to respond.",

      fetchFailed:
        "Unable to fetch weather data.",
    },

    fallbackAdvice: {
      title:
        "Weather Forecast and Farming Advice",

      irrigation:
        "Check soil moisture before irrigation.",

      rainAlert:
        "Monitor local weather conditions before field work.",

      pesticide:
        "Avoid spraying pesticides during rain or strong winds. Follow the product label and local agriculture department recommendations.",

      cropCare:
        "Inspect crops regularly for stress, pests and disease symptoms.",

      fieldWork:
        "Plan field work according to the current weather conditions.",

      summary: ({
        place,
        temperature,
        humidity,
        windSpeed,
      }) =>
        `The current temperature in ${place} is ${temperature} degrees Celsius. Humidity is ${humidity} percent and wind speed is ${windSpeed} meters per second.`,
    },
  },

  "te-IN": {
    apiCode: "te",

    messages: {
      cityRequired:
        "దయచేసి నగరం లేదా గ్రామం పేరు నమోదు చేయండి.",

      apiMissing:
        "వాతావరణ API సరిగ్గా అమర్చబడలేదు.",

      placeNotFound:
        "నగరం లేదా గ్రామం కనుగొనబడలేదు. పేరును సరిచూసి మళ్లీ ప్రయత్నించండి.",

      invalidApiKey:
        "వాతావరణ API కీ చెల్లదు.",

      timeout:
        "వాతావరణ సేవ స్పందించడానికి ఎక్కువ సమయం తీసుకుంది.",

      fetchFailed:
        "వాతావరణ సమాచారం పొందలేకపోయాము.",
    },

    fallbackAdvice: {
      title:
        "వాతావరణ సూచన మరియు రైతులకు సలహాలు",

      irrigation:
        "నీటిపారుదల చేయడానికి ముందు నేలలో తేమను పరిశీలించండి.",

      rainAlert:
        "పొలం పనులు ప్రారంభించే ముందు స్థానిక వాతావరణ పరిస్థితులను పరిశీలించండి.",

      pesticide:
        "వర్షం లేదా బలమైన గాలులు ఉన్నప్పుడు పురుగుమందులు పిచికారీ చేయవద్దు. ఉత్పత్తి లేబుల్ మరియు స్థానిక వ్యవసాయ శాఖ సూచనలను పాటించండి.",

      cropCare:
        "పంటల్లో ఒత్తిడి, పురుగులు మరియు వ్యాధి లక్షణాలు ఉన్నాయో క్రమం తప్పకుండా పరిశీలించండి.",

      fieldWork:
        "ప్రస్తుత వాతావరణ పరిస్థితులకు అనుగుణంగా పొలం పనులను ప్రణాళిక చేయండి.",

      summary: ({
        place,
        temperature,
        humidity,
        windSpeed,
      }) =>
        `${place}లో ప్రస్తుత ఉష్ణోగ్రత ${temperature} డిగ్రీల సెల్సియస్. తేమ ${humidity} శాతం మరియు గాలి వేగం సెకనుకు ${windSpeed} మీటర్లు.`,
    },
  },

  "hi-IN": {
    apiCode: "hi",

    messages: {
      cityRequired:
        "कृपया शहर या गाँव का नाम दर्ज करें।",

      apiMissing:
        "मौसम API कॉन्फ़िगर नहीं किया गया है।",

      placeNotFound:
        "शहर या गाँव नहीं मिला। कृपया नाम जाँचें।",

      invalidApiKey:
        "मौसम API कुंजी अमान्य है।",

      timeout:
        "मौसम सेवा ने उत्तर देने में अधिक समय लिया।",

      fetchFailed:
        "मौसम की जानकारी प्राप्त नहीं हो सकी।",
    },

    fallbackAdvice: {
      title:
        "मौसम पूर्वानुमान और किसान सलाह",

      irrigation:
        "सिंचाई से पहले मिट्टी की नमी जाँचें।",

      rainAlert:
        "खेत का काम शुरू करने से पहले स्थानीय मौसम की स्थिति जाँचें।",

      pesticide:
        "बारिश या तेज हवा में कीटनाशक का छिड़काव न करें। उत्पाद लेबल और स्थानीय कृषि विभाग की सलाह का पालन करें।",

      cropCare:
        "फसल में तनाव, कीट और रोग के लक्षणों की नियमित जाँच करें।",

      fieldWork:
        "वर्तमान मौसम के अनुसार खेत के काम की योजना बनाएँ।",

      summary: ({
        place,
        temperature,
        humidity,
        windSpeed,
      }) =>
        `${place} में वर्तमान तापमान ${temperature} डिग्री सेल्सियस है। नमी ${humidity} प्रतिशत और हवा की गति ${windSpeed} मीटर प्रति सेकंड है।`,
    },
  },

  "ta-IN": {
    apiCode: "ta",

    messages: {
      cityRequired:
        "நகரம் அல்லது கிராமத்தின் பெயரை உள்ளிடவும்.",

      apiMissing:
        "வானிலை API அமைக்கப்படவில்லை.",

      placeNotFound:
        "நகரம் அல்லது கிராமம் கிடைக்கவில்லை. பெயரைச் சரிபார்க்கவும்.",

      invalidApiKey:
        "வானிலை API விசை தவறானது.",

      timeout:
        "வானிலை சேவை பதிலளிக்க அதிக நேரம் எடுத்துக்கொண்டது.",

      fetchFailed:
        "வானிலை தகவலைப் பெற முடியவில்லை.",
    },

    fallbackAdvice: {
      title:
        "வானிலை முன்னறிவிப்பு மற்றும் விவசாய ஆலோசனை",

      irrigation:
        "நீர்ப்பாசனத்திற்கு முன் மண்ணின் ஈரப்பதத்தைச் சரிபார்க்கவும்.",

      rainAlert:
        "வயல் பணிக்கு முன் உள்ளூர் வானிலை நிலையைச் சரிபார்க்கவும்.",

      pesticide:
        "மழை அல்லது பலத்த காற்றின் போது பூச்சிக்கொல்லி தெளிக்க வேண்டாம். தயாரிப்பு லேபிளையும் உள்ளூர் வேளாண்மைத் துறை ஆலோசனையையும் பின்பற்றவும்.",

      cropCare:
        "பயிர்களில் அழுத்தம், பூச்சி மற்றும் நோய் அறிகுறிகளை தொடர்ந்து கண்காணிக்கவும்.",

      fieldWork:
        "தற்போதைய வானிலைக்கு ஏற்ப வயல் பணிகளைத் திட்டமிடவும்.",

      summary: ({
        place,
        temperature,
        humidity,
        windSpeed,
      }) =>
        `${place} பகுதியில் தற்போதைய வெப்பநிலை ${temperature} டிகிரி செல்சியஸ். ஈரப்பதம் ${humidity} சதவீதம் மற்றும் காற்றின் வேகம் வினாடிக்கு ${windSpeed} மீட்டர்.`,
    },
  },

  "kn-IN": {
    apiCode: "kn",

    messages: {
      cityRequired:
        "ದಯವಿಟ್ಟು ನಗರ ಅಥವಾ ಗ್ರಾಮದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",

      apiMissing:
        "ಹವಾಮಾನ API ಹೊಂದಿಸಲಾಗಿಲ್ಲ.",

      placeNotFound:
        "ನಗರ ಅಥವಾ ಗ್ರಾಮ ಕಂಡುಬಂದಿಲ್ಲ. ಹೆಸರನ್ನು ಪರಿಶೀಲಿಸಿ.",

      invalidApiKey:
        "ಹವಾಮಾನ API ಕೀ ಅಮಾನ್ಯವಾಗಿದೆ.",

      timeout:
        "ಹವಾಮಾನ ಸೇವೆ ಪ್ರತಿಕ್ರಿಯಿಸಲು ಹೆಚ್ಚು ಸಮಯ ತೆಗೆದುಕೊಂಡಿತು.",

      fetchFailed:
        "ಹವಾಮಾನ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    },

    fallbackAdvice: {
      title:
        "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ರೈತರಿಗೆ ಸಲಹೆ",

      irrigation:
        "ನೀರಾವರಿಗೂ ಮೊದಲು ಮಣ್ಣಿನ ತೇವಾಂಶವನ್ನು ಪರಿಶೀಲಿಸಿ.",

      rainAlert:
        "ಹೊಲದ ಕೆಲಸಕ್ಕೂ ಮೊದಲು ಸ್ಥಳೀಯ ಹವಾಮಾನ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",

      pesticide:
        "ಮಳೆ ಅಥವಾ ಬಲವಾದ ಗಾಳಿಯ ಸಮಯದಲ್ಲಿ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ. ಉತ್ಪನ್ನದ ಲೇಬಲ್ ಮತ್ತು ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆಯ ಸಲಹೆಗಳನ್ನು ಅನುಸರಿಸಿ.",

      cropCare:
        "ಬೆಳೆಗಳಲ್ಲಿ ಒತ್ತಡ, ಕೀಟ ಮತ್ತು ರೋಗದ ಲಕ್ಷಣಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ.",

      fieldWork:
        "ಪ್ರಸ್ತುತ ಹವಾಮಾನಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಹೊಲದ ಕೆಲಸವನ್ನು ಯೋಜಿಸಿ.",

      summary: ({
        place,
        temperature,
        humidity,
        windSpeed,
      }) =>
        `${place}ದಲ್ಲಿ ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${temperature} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್. ಆರ್ದ್ರತೆ ${humidity} ಶೇಕಡಾ ಮತ್ತು ಗಾಳಿಯ ವೇಗ ಪ್ರತಿ ಸೆಕೆಂಡಿಗೆ ${windSpeed} ಮೀಟರ್.`,
    },
  },

  "ml-IN": {
    apiCode: "ml",

    messages: {
      cityRequired:
        "നഗരത്തിന്റെയോ ഗ്രാമത്തിന്റെയോ പേര് നൽകുക.",

      apiMissing:
        "കാലാവസ്ഥാ API ക്രമീകരിച്ചിട്ടില്ല.",

      placeNotFound:
        "നഗരമോ ഗ്രാമമോ കണ്ടെത്താനായില്ല. പേര് പരിശോധിക്കുക.",

      invalidApiKey:
        "കാലാവസ്ഥാ API കീ അസാധുവാണ്.",

      timeout:
        "കാലാവസ്ഥാ സേവനം പ്രതികരിക്കാൻ കൂടുതൽ സമയം എടുത്തു.",

      fetchFailed:
        "കാലാവസ്ഥാ വിവരം ലഭ്യമാക്കാനായില്ല.",
    },

    fallbackAdvice: {
      title:
        "കാലാവസ്ഥാ പ്രവചനവും കർഷക നിർദ്ദേശങ്ങളും",

      irrigation:
        "ജലസേചനത്തിന് മുമ്പ് മണ്ണിലെ ഈർപ്പം പരിശോധിക്കുക.",

      rainAlert:
        "വയൽ ജോലിക്ക് മുമ്പ് പ്രാദേശിക കാലാവസ്ഥ പരിശോധിക്കുക.",

      pesticide:
        "മഴയോ ശക്തമായ കാറ്റോ ഉള്ളപ്പോൾ കീടനാശിനി തളിക്കരുത്. ഉൽപ്പന്ന ലേബലും പ്രാദേശിക കൃഷിവകുപ്പിന്റെ നിർദ്ദേശങ്ങളും പാലിക്കുക.",

      cropCare:
        "വിളകളിൽ സമ്മർദ്ദം, കീടങ്ങൾ, രോഗലക്ഷണങ്ങൾ എന്നിവ പതിവായി പരിശോധിക്കുക.",

      fieldWork:
        "നിലവിലെ കാലാവസ്ഥ അനുസരിച്ച് വയൽ ജോലികൾ ആസൂത്രണം ചെയ്യുക.",

      summary: ({
        place,
        temperature,
        humidity,
        windSpeed,
      }) =>
        `${place}യിലെ നിലവിലെ താപനില ${temperature} ഡിഗ്രി സെൽഷ്യസ് ആണ്. ഈർപ്പം ${humidity} ശതമാനവും കാറ്റിന്റെ വേഗം സെക്കൻഡിൽ ${windSpeed} മീറ്ററുമാണ്.`,
    },
  },
};

const getLanguageConfig = (language) => {
  return (
    SUPPORTED_LANGUAGES[language] ||
    SUPPORTED_LANGUAGES["en-IN"]
  );
};

const getLocalizedPlaceName = ({
  location,
  apiCode,
  originalQuery,
}) => {
  const localizedName =
    location?.local_names?.[apiCode];

  if (localizedName) {
    return localizedName;
  }

  /*
   * User already typed the place in Telugu/Tamil/Hindi etc.
   * In that case preserve the entered script instead of
   * replacing it with an English API name.
   */
  const containsNonLatinCharacters =
    /[^\u0000-\u007F]/.test(originalQuery);

  if (containsNonLatinCharacters) {
    return originalQuery;
  }

  return location?.name || originalQuery;
};

const createFallbackAdvice = (
  config,
  weatherData
) => {
  const fallback =
    config.fallbackAdvice;

  return {
    title: fallback.title,
    irrigation: fallback.irrigation,
    rainAlert: fallback.rainAlert,
    pesticide: fallback.pesticide,
    cropCare: fallback.cropCare,
    fieldWork: fallback.fieldWork,

    summary: fallback.summary({
      place: weatherData.localizedCity,
      temperature:
        weatherData.temperature,
      humidity: weatherData.humidity,
      windSpeed: weatherData.windSpeed,
    }),

    fallback: true,
  };
};

const getWeather = async (req, res) => {
  const requestedLanguage = String(
    req.query.language || "en-IN"
  ).trim();

  const selectedLanguage =
    Object.prototype.hasOwnProperty.call(
      SUPPORTED_LANGUAGES,
      requestedLanguage
    )
      ? requestedLanguage
      : "en-IN";

  const config = getLanguageConfig(
    selectedLanguage
  );

  try {
    const city = String(
      req.query.city || ""
    ).trim();

    if (!city) {
      return res.status(400).json({
        success: false,
        message:
          config.messages.cityRequired,
      });
    }

    if (!process.env.WEATHER_API_KEY) {
      console.error(
        "WEATHER_API_KEY is missing"
      );

      return res.status(500).json({
        success: false,
        message:
          config.messages.apiMissing,
      });
    }

    /*
     * Step 1:
     * Search city or village through OpenWeather Geocoding API.
     */
    const geocodingResponse =
      await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: city,
            limit: 1,
            appid:
              process.env.WEATHER_API_KEY,
          },

          timeout: 10000,
        }
      );

    const location =
      geocodingResponse.data?.[0];

    if (!location) {
      return res.status(404).json({
        success: false,
        message:
          config.messages.placeNotFound,
      });
    }

    const localizedCity =
      getLocalizedPlaceName({
        location,
        apiCode: config.apiCode,
        originalQuery: city,
      });

    /*
     * Step 2:
     * Fetch weather using coordinates.
     * This is more accurate than searching weather by name again.
     */
    const weatherResponse =
      await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            lat: location.lat,
            lon: location.lon,
            appid:
              process.env.WEATHER_API_KEY,
            units: "metric",
            lang: config.apiCode,
          },

          timeout: 10000,
        }
      );

    const currentWeather =
      weatherResponse.data;

    const weatherData = {
      city:
        currentWeather.name ||
        location.name ||
        city,

      localizedCity,

      state: location.state || null,

      country:
        location.country ||
        currentWeather.sys?.country ||
        null,

      latitude: location.lat,

      longitude: location.lon,

      temperature:
        currentWeather.main?.temp,

      humidity:
        currentWeather.main?.humidity,

      windSpeed:
        currentWeather.wind?.speed,

      condition:
        currentWeather.weather?.[0]
          ?.main,

      description:
        currentWeather.weather?.[0]
          ?.description,
    };

    let aiAdvice;

    try {
      aiAdvice =
        await generateWeatherAdvice(
          {
            ...weatherData,

            /*
             * Gemini ki localized place name pampisthe,
             * advice title and summary lo kuda ade name use chesthundi.
             */
            city:
              weatherData.localizedCity,
          },

          selectedLanguage
        );
    } catch (aiError) {
      console.error(
        "Weather AI failed:",
        aiError.response?.data ||
          aiError.message
      );

      aiAdvice =
        createFallbackAdvice(
          config,
          weatherData
        );
    }

    return res.status(200).json({
      success: true,

      language: selectedLanguage,

      /*
       * Original API place name.
       */
      city: weatherData.city,

      /*
       * Selected language place name.
       * Frontend lo idi display cheyyali.
       */
      localizedCity:
        weatherData.localizedCity,

      state: weatherData.state,

      country: weatherData.country,

      latitude: weatherData.latitude,

      longitude:
        weatherData.longitude,

      temperature:
        weatherData.temperature,

      humidity:
        weatherData.humidity,

      windSpeed:
        weatherData.windSpeed,

      condition:
        weatherData.condition,

      description:
        weatherData.description,

      aiAdvice,
    });
  } catch (error) {
    console.error(
      "Weather controller error:",
      error.response?.data ||
        error.message
    );

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message:
          config.messages.placeNotFound,
      });
    }

    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message:
          config.messages.invalidApiKey,
      });
    }

    if (
      error.code === "ECONNABORTED"
    ) {
      return res.status(504).json({
        success: false,
        message:
          config.messages.timeout,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        config.messages.fetchFailed,
    });
  }
};

module.exports = {
  getWeather,
};