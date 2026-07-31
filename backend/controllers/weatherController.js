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

      coordinatesRequired:
        "Valid latitude and longitude are required.",

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
        "Avoid spraying pesticides during rain or strong winds.",

      cropCare:
        "Inspect crops regularly for stress, pests and diseases.",

      fieldWork:
        "Plan field work according to current weather conditions.",
    },
  },

  "te-IN": {
    apiCode: "te",

    messages: {
      cityRequired:
        "దయచేసి నగరం లేదా గ్రామం పేరు నమోదు చేయండి.",

      coordinatesRequired:
        "సరైన latitude మరియు longitude అవసరం.",

      apiMissing:
        "వాతావరణ API సరిగ్గా అమర్చబడలేదు.",

      placeNotFound:
        "నగరం లేదా గ్రామం కనుగొనబడలేదు.",

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
        "పొలం పనులకు ముందు స్థానిక వాతావరణాన్ని పరిశీలించండి.",

      pesticide:
        "వర్షం లేదా బలమైన గాలులు ఉన్నప్పుడు పురుగుమందులు పిచికారీ చేయవద్దు.",

      cropCare:
        "పంటల్లో పురుగులు మరియు వ్యాధి లక్షణాలను పరిశీలించండి.",

      fieldWork:
        "ప్రస్తుత వాతావరణానికి అనుగుణంగా పొలం పనులను ప్రణాళిక చేయండి.",
    },
  },

  "hi-IN": {
    apiCode: "hi",

    messages: {
      cityRequired:
        "कृपया शहर या गाँव का नाम दर्ज करें।",

      coordinatesRequired:
        "सही latitude और longitude आवश्यक हैं।",

      apiMissing:
        "मौसम API कॉन्फ़िगर नहीं किया गया है।",

      placeNotFound:
        "शहर या गाँव नहीं मिला।",

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
        "खेत का काम शुरू करने से पहले मौसम जाँचें।",

      pesticide:
        "बारिश या तेज हवा में कीटनाशक का छिड़काव न करें।",

      cropCare:
        "फसल में कीट और रोग के लक्षणों की जाँच करें।",

      fieldWork:
        "वर्तमान मौसम के अनुसार खेत का काम करें।",
    },
  },

  "ta-IN": {
    apiCode: "ta",

    messages: {
      cityRequired:
        "நகரம் அல்லது கிராமத்தின் பெயரை உள்ளிடவும்.",

      coordinatesRequired:
        "சரியான latitude மற்றும் longitude தேவை.",

      apiMissing:
        "வானிலை API அமைக்கப்படவில்லை.",

      placeNotFound:
        "நகரம் அல்லது கிராமம் கிடைக்கவில்லை.",

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
        "வயல் பணிக்கு முன் வானிலையைச் சரிபார்க்கவும்.",

      pesticide:
        "மழை அல்லது பலத்த காற்றில் பூச்சிக்கொல்லி தெளிக்க வேண்டாம்.",

      cropCare:
        "பயிர்களில் பூச்சி மற்றும் நோய் அறிகுறிகளைச் சரிபார்க்கவும்.",

      fieldWork:
        "தற்போதைய வானிலைக்கு ஏற்ப வயல் பணிகளைத் திட்டமிடவும்.",
    },
  },

  "kn-IN": {
    apiCode: "kn",

    messages: {
      cityRequired:
        "ದಯವಿಟ್ಟು ನಗರ ಅಥವಾ ಗ್ರಾಮದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",

      coordinatesRequired:
        "ಸರಿಯಾದ latitude ಮತ್ತು longitude ಅಗತ್ಯವಿದೆ.",

      apiMissing:
        "ಹವಾಮಾನ API ಹೊಂದಿಸಲಾಗಿಲ್ಲ.",

      placeNotFound:
        "ನಗರ ಅಥವಾ ಗ್ರಾಮ ಕಂಡುಬಂದಿಲ್ಲ.",

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
        "ಹೊಲದ ಕೆಲಸಕ್ಕೂ ಮೊದಲು ಹವಾಮಾನವನ್ನು ಪರಿಶೀಲಿಸಿ.",

      pesticide:
        "ಮಳೆ ಅಥವಾ ಬಲವಾದ ಗಾಳಿಯಲ್ಲಿ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ.",

      cropCare:
        "ಬೆಳೆಗಳಲ್ಲಿ ಕೀಟ ಮತ್ತು ರೋಗದ ಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",

      fieldWork:
        "ಪ್ರಸ್ತುತ ಹವಾಮಾನಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಕೆಲಸ ಮಾಡಿ.",
    },
  },

  "ml-IN": {
    apiCode: "ml",

    messages: {
      cityRequired:
        "നഗരത്തിന്റെയോ ഗ്രാമത്തിന്റെയോ പേര് നൽകുക.",

      coordinatesRequired:
        "ശരിയായ latitude, longitude ആവശ്യമാണ്.",

      apiMissing:
        "കാലാവസ്ഥാ API ക്രമീകരിച്ചിട്ടില്ല.",

      placeNotFound:
        "നഗരമോ ഗ്രാമമോ കണ്ടെത്താനായില്ല.",

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
        "വയൽ ജോലിക്ക് മുമ്പ് കാലാവസ്ഥ പരിശോധിക്കുക.",

      pesticide:
        "മഴയോ ശക്തമായ കാറ്റോ ഉള്ളപ്പോൾ കീടനാശിനി തളിക്കരുത്.",

      cropCare:
        "വിളകളിൽ കീടങ്ങളും രോഗലക്ഷണങ്ങളും പരിശോധിക്കുക.",

      fieldWork:
        "നിലവിലെ കാലാവസ്ഥ അനുസരിച്ച് വയൽ ജോലി ആസൂത്രണം ചെയ്യുക.",
    },
  },
};

const getLanguageConfig = (
  requestedLanguage
) => {
  const language = String(
    requestedLanguage || "en-IN"
  ).trim();

  return {
    language:
      SUPPORTED_LANGUAGES[language]
        ? language
        : "en-IN",

    config:
      SUPPORTED_LANGUAGES[language] ||
      SUPPORTED_LANGUAGES["en-IN"],
  };
};

const getLocalizedPlaceName = ({
  location,
  apiCode,
  fallbackName,
}) => {
  return (
    location?.local_names?.[apiCode] ||
    location?.name ||
    fallbackName ||
    "Current Location"
  );
};


const createLocalizedWeatherSummary = (
  language,
  weatherData
) => {
  const city =
    weatherData.localizedCity ||
    weatherData.city ||
    "Current Location";

  const temperature =
    weatherData.temperature ?? "N/A";

  const humidity =
    weatherData.humidity ?? "N/A";

  const windSpeed =
    weatherData.windSpeed ?? "N/A";

  const summaries = {
    "en-IN":
      `${city} currently has a temperature of ${temperature}°C, ` +
      `humidity of ${humidity}% and wind speed of ${windSpeed} m/s.`,

    "te-IN":
      `${city}లో ప్రస్తుతం ఉష్ణోగ్రత ${temperature}°C, ` +
      `తేమ ${humidity}% మరియు గాలి వేగం ${windSpeed} m/s ఉంది.`,

    "hi-IN":
      `${city} में वर्तमान तापमान ${temperature}°C, ` +
      `आर्द्रता ${humidity}% और हवा की गति ${windSpeed} m/s है।`,

    "ta-IN":
      `${city} இல் தற்போதைய வெப்பநிலை ${temperature}°C, ` +
      `ஈரப்பதம் ${humidity}% மற்றும் காற்றின் வேகம் ${windSpeed} m/s ஆகும்.`,

    "kn-IN":
      `${city} ನಲ್ಲಿ ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${temperature}°C, ` +
      `ಆರ್ದ್ರತೆ ${humidity}% ಮತ್ತು ಗಾಳಿಯ ವೇಗ ${windSpeed} m/s ಇದೆ.`,

    "ml-IN":
      `${city} ൽ നിലവിലെ താപനില ${temperature}°C, ` +
      `ഈർപ്പം ${humidity}% കൂടാതെ കാറ്റിന്റെ വേഗം ${windSpeed} m/s ആണ്.`,
  };

  return (
    summaries[language] ||
    summaries["en-IN"]
  );
};

const createFallbackAdvice = (
  config,
  weatherData,
  language
) => {
  const fallback =
    config.fallbackAdvice;

  return {
    title: fallback.title,

    irrigation:
      fallback.irrigation,

    rainAlert:
      fallback.rainAlert,

    pesticide:
      fallback.pesticide,

    cropCare:
      fallback.cropCare,

    fieldWork:
      fallback.fieldWork,

    summary:
      createLocalizedWeatherSummary(
        language,
        weatherData
      ),

    fallback: true,
  };
};

const fetchOpenWeatherData = async ({
  latitude,
  longitude,
  apiCode,
}) => {
  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        lat: latitude,
        lon: longitude,

        appid:
          process.env.WEATHER_API_KEY,

        units: "metric",

        lang: apiCode,
      },

      timeout: 10000,
    }
  );

  return response.data;
};

const buildWeatherResponse = ({
  currentWeather,
  location,
  localizedCity,
  latitude,
  longitude,
}) => {
  return {
    city:
      currentWeather?.name ||
      location?.name ||
      "Current Location",

    localizedCity,

    state:
      location?.state || null,

    country:
      location?.country ||
      currentWeather?.sys?.country ||
      null,

    latitude:
      currentWeather?.coord?.lat ??
      latitude,

    longitude:
      currentWeather?.coord?.lon ??
      longitude,

    temperature:
      currentWeather?.main?.temp,

    humidity:
      currentWeather?.main?.humidity,

    windSpeed:
      currentWeather?.wind?.speed,

    condition:
      currentWeather?.weather?.[0]
        ?.main,

    description:
      currentWeather?.weather?.[0]
        ?.description,
  };
};

const generateAdviceSafely = async ({
  weatherData,
  language,
  config,
}) => {
  try {
    return await generateWeatherAdvice(
      {
        ...weatherData,

        city:
          weatherData.localizedCity,
      },

      language
    );
  } catch (error) {
    console.error(
      "Groq weather advice error:",
      error?.response?.data ||
        error?.message
    );

    return createFallbackAdvice(
      config,
      weatherData,
      language
    );
  }
};
   

const sendWeatherResponse = (
  res,
  language,
  weatherData,
  aiAdvice
) => {
  return res.status(200).json({
    success: true,

    language,

    city:
      weatherData.city,

    localizedCity:
      weatherData.localizedCity,

    state:
      weatherData.state,

    country:
      weatherData.country,

    latitude:
      weatherData.latitude,

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
};

const handleWeatherError = (
  error,
  res,
  config
) => {
  console.error(
    "Weather controller error:",
    error?.response?.data ||
      error?.message
  );

  if (
    error?.response?.status === 401
  ) {
    return res.status(500).json({
      success: false,

      message:
        config.messages.invalidApiKey,
    });
  }

  if (
    error?.response?.status === 404
  ) {
    return res.status(404).json({
      success: false,

      message:
        config.messages.placeNotFound,
    });
  }

  if (
    error?.code === "ECONNABORTED"
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
};

/*
 * GET /api/weather?city=Hyderabad&language=en-IN
 */
const getWeather = async (
  req,
  res
) => {
  const {
    language,
    config,
  } = getLanguageConfig(
    req.query.language
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

    if (
      !process.env.WEATHER_API_KEY
    ) {
      console.error(
        "WEATHER_API_KEY is missing"
      );

      return res.status(500).json({
        success: false,

        message:
          config.messages.apiMissing,
      });
    }

    const geocodingResponse =
      await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: city,

            limit: 1,

            appid:
              process.env
                .WEATHER_API_KEY,
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
          config.messages
            .placeNotFound,
      });
    }

    const localizedCity =
      getLocalizedPlaceName({
        location,

        apiCode:
          config.apiCode,

        fallbackName: city,
      });

    const currentWeather =
      await fetchOpenWeatherData({
        latitude: location.lat,

        longitude: location.lon,

        apiCode:
          config.apiCode,
      });

    const weatherData =
      buildWeatherResponse({
        currentWeather,

        location,

        localizedCity,

        latitude: location.lat,

        longitude: location.lon,
      });

    const aiAdvice =
      await generateAdviceSafely({
        weatherData,

        language,

        config,
      });

    return sendWeatherResponse(
      res,
      language,
      weatherData,
      aiAdvice
    );
  } catch (error) {
    return handleWeatherError(
      error,
      res,
      config
    );
  }
};

/*
 * GET /api/weather/location
 *
 * Query:
 * latitude
 * longitude
 * language
 */
const getWeatherByLocation = async (
  req,
  res
) => {
  const {
    language,
    config,
  } = getLanguageConfig(
    req.query.language
  );

  try {
    const latitude = Number(
      req.query.latitude
    );

    const longitude = Number(
      req.query.longitude
    );

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,

        message:
          config.messages
            .coordinatesRequired,
      });
    }

    if (
      !process.env.WEATHER_API_KEY
    ) {
      console.error(
        "WEATHER_API_KEY is missing"
      );

      return res.status(500).json({
        success: false,

        message:
          config.messages.apiMissing,
      });
    }

    const reverseResponse =
      await axios.get(
        "https://api.openweathermap.org/geo/1.0/reverse",
        {
          params: {
            lat: latitude,

            lon: longitude,

            limit: 1,

            appid:
              process.env
                .WEATHER_API_KEY,
          },

          timeout: 10000,
        }
      );

    const location =
      reverseResponse.data?.[0] ||
      null;

    const localizedCity =
      getLocalizedPlaceName({
        location,

        apiCode:
          config.apiCode,

        fallbackName:
          "Current Location",
      });

    const currentWeather =
      await fetchOpenWeatherData({
        latitude,

        longitude,

        apiCode:
          config.apiCode,
      });

    const weatherData =
      buildWeatherResponse({
        currentWeather,

        location,

        localizedCity,

        latitude,

        longitude,
      });

    const aiAdvice =
      await generateAdviceSafely({
        weatherData,

        language,

        config,
      });

    return sendWeatherResponse(
      res,
      language,
      weatherData,
      aiAdvice
    );
  } catch (error) {
    return handleWeatherError(
      error,
      res,
      config
    );
  }
};

module.exports = {
  getWeather,
  getWeatherByLocation,
};