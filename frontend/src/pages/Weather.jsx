import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getWeather,
  getWeatherByLocation,
  getForecast,
} from "../services/weatherService";
import LoadingSpinner from "../components/LoadingSpinner";
import { speakText } from "../utils/speech";
import { useSettings } from "../context/SettingsContext";

const translations = {
  "en-IN": {
    pageTitle: "Weather Information",
    pageSubtitle:
      "Get real-time weather updates and AI-powered farming advice.",

    cityPlaceholder: "Enter City",
    search: "Search",
    searching: "Searching...",

    enterCityError: "Please enter a city",
    weatherUpdated: "Weather updated",
    fetchError: "Unable to fetch weather",

    emptyTitle: "Search a City",
    emptyDescription:
      "Enter any city name to receive weather updates and farming advice.",

    temperature: "Temperature",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    condition: "Condition",
    description: "Description",

    irrigation: "Irrigation",
    rainAlert: "Rain Alert",
    pesticideAdvice: "Pesticide Advice",
    cropCare: "Crop Care",
    fieldWork: "Field Work",
    aiSummary: "AI Summary",

    listen: "Listen",
    stop: "Stop",
    voiceOff: "Voice Off",

    voiceDisabled:
      "Voice responses are turned off in Profile settings",
    noSummary: "No weather summary is available",

    degreeUnit: "°C",
    windUnit: "m/s",
  },

  "te-IN": {
    pageTitle: "వాతావరణ సమాచారం",
    pageSubtitle:
      "ప్రస్తుత వాతావరణ వివరాలు మరియు AI ఆధారిత వ్యవసాయ సలహాలను పొందండి.",

    cityPlaceholder: "నగరం పేరు నమోదు చేయండి",
    search: "వెతకండి",
    searching: "వెతుకుతోంది...",

    enterCityError: "దయచేసి నగరం పేరు నమోదు చేయండి",
    weatherUpdated: "వాతావరణ సమాచారం నవీకరించబడింది",
    fetchError: "వాతావరణ సమాచారం పొందలేకపోయాము",

    emptyTitle: "నగరాన్ని వెతకండి",
    emptyDescription:
      "వాతావరణ సమాచారం మరియు వ్యవసాయ సలహాల కోసం నగరం పేరు నమోదు చేయండి.",

    temperature: "ఉష్ణోగ్రత",
    humidity: "తేమ శాతం",
    windSpeed: "గాలి వేగం",
    condition: "వాతావరణ పరిస్థితి",
    description: "వివరణ",

    irrigation: "నీటిపారుదల",
    rainAlert: "వర్ష హెచ్చరిక",
    pesticideAdvice: "పురుగుమందుల సలహా",
    cropCare: "పంట సంరక్షణ",
    fieldWork: "పొలం పనులు",
    aiSummary: "AI సారాంశం",

    listen: "వినండి",
    stop: "ఆపండి",
    voiceOff: "వాయిస్ ఆఫ్",

    voiceDisabled:
      "ప్రొఫైల్ సెట్టింగ్స్‌లో వాయిస్ సమాధానాలు ఆఫ్‌లో ఉన్నాయి",
    noSummary: "వాతావరణ సారాంశం అందుబాటులో లేదు",

    degreeUnit: "°C",
    windUnit: "మీ/సె",
  },

  "hi-IN": {
    pageTitle: "मौसम की जानकारी",
    pageSubtitle:
      "वास्तविक समय के मौसम अपडेट और AI आधारित कृषि सलाह प्राप्त करें।",

    cityPlaceholder: "शहर का नाम दर्ज करें",
    search: "खोजें",
    searching: "खोज रहा है...",

    enterCityError: "कृपया शहर का नाम दर्ज करें",
    weatherUpdated: "मौसम की जानकारी अपडेट हो गई",
    fetchError: "मौसम की जानकारी प्राप्त नहीं हो सकी",

    emptyTitle: "शहर खोजें",
    emptyDescription:
      "मौसम अपडेट और कृषि सलाह के लिए शहर का नाम दर्ज करें।",

    temperature: "तापमान",
    humidity: "नमी",
    windSpeed: "हवा की गति",
    condition: "मौसम की स्थिति",
    description: "विवरण",

    irrigation: "सिंचाई",
    rainAlert: "बारिश की चेतावनी",
    pesticideAdvice: "कीटनाशक सलाह",
    cropCare: "फसल की देखभाल",
    fieldWork: "खेत का कार्य",
    aiSummary: "AI सारांश",

    listen: "सुनें",
    stop: "रोकें",
    voiceOff: "आवाज़ बंद",

    voiceDisabled:
      "प्रोफ़ाइल सेटिंग में वॉइस उत्तर बंद हैं",
    noSummary: "मौसम सारांश उपलब्ध नहीं है",

    degreeUnit: "°C",
    windUnit: "मी/से",
  },

  "ta-IN": {
    pageTitle: "வானிலை தகவல்",
    pageSubtitle:
      "நேரடி வானிலை தகவல்களையும் AI விவசாய ஆலோசனைகளையும் பெறுங்கள்.",

    cityPlaceholder: "நகரத்தின் பெயரை உள்ளிடவும்",
    search: "தேடுங்கள்",
    searching: "தேடுகிறது...",

    enterCityError: "நகரத்தின் பெயரை உள்ளிடவும்",
    weatherUpdated: "வானிலை தகவல் புதுப்பிக்கப்பட்டது",
    fetchError: "வானிலை தகவலைப் பெற முடியவில்லை",

    emptyTitle: "நகரத்தைத் தேடுங்கள்",
    emptyDescription:
      "வானிலை தகவல் மற்றும் விவசாய ஆலோசனைக்காக நகரத்தின் பெயரை உள்ளிடவும்.",

    temperature: "வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    windSpeed: "காற்றின் வேகம்",
    condition: "வானிலை நிலை",
    description: "விளக்கம்",

    irrigation: "நீர்ப்பாசனம்",
    rainAlert: "மழை எச்சரிக்கை",
    pesticideAdvice: "பூச்சிக்கொல்லி ஆலோசனை",
    cropCare: "பயிர் பராமரிப்பு",
    fieldWork: "வயல் வேலை",
    aiSummary: "AI சுருக்கம்",

    listen: "கேளுங்கள்",
    stop: "நிறுத்துங்கள்",
    voiceOff: "குரல் நிறுத்தப்பட்டது",

    voiceDisabled:
      "சுயவிவர அமைப்புகளில் குரல் பதில்கள் நிறுத்தப்பட்டுள்ளன",
    noSummary: "வானிலை சுருக்கம் கிடைக்கவில்லை",

    degreeUnit: "°C",
    windUnit: "மீ/வி",
  },

  "kn-IN": {
    pageTitle: "ಹವಾಮಾನ ಮಾಹಿತಿ",
    pageSubtitle:
      "ನೈಜ ಸಮಯದ ಹವಾಮಾನ ಮಾಹಿತಿ ಮತ್ತು AI ಕೃಷಿ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ.",

    cityPlaceholder: "ನಗರದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    search: "ಹುಡುಕಿ",
    searching: "ಹುಡುಕಲಾಗುತ್ತಿದೆ...",

    enterCityError: "ದಯವಿಟ್ಟು ನಗರದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    weatherUpdated: "ಹವಾಮಾನ ಮಾಹಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ",
    fetchError: "ಹವಾಮಾನ ಮಾಹಿತಿ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ",

    emptyTitle: "ನಗರವನ್ನು ಹುಡುಕಿ",
    emptyDescription:
      "ಹವಾಮಾನ ಮಾಹಿತಿ ಮತ್ತು ಕೃಷಿ ಸಲಹೆಗಾಗಿ ನಗರದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",

    temperature: "ತಾಪಮಾನ",
    humidity: "ಆರ್ದ್ರತೆ",
    windSpeed: "ಗಾಳಿಯ ವೇಗ",
    condition: "ಹವಾಮಾನ ಸ್ಥಿತಿ",
    description: "ವಿವರಣೆ",

    irrigation: "ನೀರಾವರಿ",
    rainAlert: "ಮಳೆ ಎಚ್ಚರಿಕೆ",
    pesticideAdvice: "ಕೀಟನಾಶಕ ಸಲಹೆ",
    cropCare: "ಬೆಳೆ ಆರೈಕೆ",
    fieldWork: "ಹೊಲದ ಕೆಲಸ",
    aiSummary: "AI ಸಾರಾಂಶ",

    listen: "ಕೇಳಿ",
    stop: "ನಿಲ್ಲಿಸಿ",
    voiceOff: "ಧ್ವನಿ ಆಫ್",

    voiceDisabled:
      "ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಧ್ವನಿ ಉತ್ತರಗಳನ್ನು ಆಫ್ ಮಾಡಲಾಗಿದೆ",
    noSummary: "ಹವಾಮಾನ ಸಾರಾಂಶ ಲಭ್ಯವಿಲ್ಲ",

    degreeUnit: "°C",
    windUnit: "ಮೀ/ಸೆ",
  },

  "ml-IN": {
    pageTitle: "കാലാവസ്ഥാ വിവരം",
    pageSubtitle:
      "തത്സമയ കാലാവസ്ഥാ വിവരങ്ങളും AI കാർഷിക നിർദ്ദേശങ്ങളും നേടുക.",

    cityPlaceholder: "നഗരത്തിന്റെ പേര് നൽകുക",
    search: "തിരയുക",
    searching: "തിരയുന്നു...",

    enterCityError: "നഗരത്തിന്റെ പേര് നൽകുക",
    weatherUpdated: "കാലാവസ്ഥാ വിവരം പുതുക്കി",
    fetchError: "കാലാവസ്ഥാ വിവരം ലഭ്യമാക്കാനായില്ല",

    emptyTitle: "നഗരം തിരയുക",
    emptyDescription:
      "കാലാവസ്ഥാ വിവരങ്ങളും കാർഷിക നിർദ്ദേശങ്ങളും ലഭിക്കാൻ നഗരത്തിന്റെ പേര് നൽകുക.",

    temperature: "താപനില",
    humidity: "ഈർപ്പം",
    windSpeed: "കാറ്റിന്റെ വേഗം",
    condition: "കാലാവസ്ഥാ സ്ഥിതി",
    description: "വിവരണം",

    irrigation: "ജലസേചനം",
    rainAlert: "മഴ മുന്നറിയിപ്പ്",
    pesticideAdvice: "കീടനാശിനി നിർദ്ദേശം",
    cropCare: "വിള പരിപാലനം",
    fieldWork: "വയൽ ജോലി",
    aiSummary: "AI സംഗ്രഹം",

    listen: "കേൾക്കുക",
    stop: "നിർത്തുക",
    voiceOff: "ശബ്ദം ഓഫ്",

    voiceDisabled:
      "പ്രൊഫൈൽ ക്രമീകരണങ്ങളിൽ ശബ്ദ പ്രതികരണങ്ങൾ ഓഫ് ചെയ്തിരിക്കുന്നു",
    noSummary: "കാലാവസ്ഥാ സംഗ്രഹം ലഭ്യമല്ല",

    degreeUnit: "°C",
    windUnit: "മീ/സെ",
  },
};

const forecastTranslations = {
  "en-IN": {
    title: "5-Day Weather Forecast",
    min: "Min",
    max: "Max",
    humidity: "Humidity",
    rain: "Rain",
    loading: "Loading forecast...",
    unavailable: "Forecast is not available.",
  },
  "te-IN": {
    title: "5 రోజుల వాతావరణ సూచన",
    min: "కనిష్ఠం",
    max: "గరిష్ఠం",
    humidity: "తేమ",
    rain: "వర్షం",
    loading: "వాతావరణ సూచన లోడ్ అవుతోంది...",
    unavailable: "వాతావరణ సూచన అందుబాటులో లేదు.",
  },
  "hi-IN": {
    title: "5 दिनों का मौसम पूर्वानुमान",
    min: "न्यूनतम",
    max: "अधिकतम",
    humidity: "नमी",
    rain: "बारिश",
    loading: "मौसम पूर्वानुमान लोड हो रहा है...",
    unavailable: "मौसम पूर्वानुमान उपलब्ध नहीं है।",
  },
  "ta-IN": {
    title: "5 நாள் வானிலை முன்னறிவிப்பு",
    min: "குறைந்த",
    max: "அதிக",
    humidity: "ஈரப்பதம்",
    rain: "மழை",
    loading: "வானிலை முன்னறிவிப்பு ஏற்றப்படுகிறது...",
    unavailable: "வானிலை முன்னறிவிப்பு கிடைக்கவில்லை.",
  },
  "kn-IN": {
    title: "5 ದಿನಗಳ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    min: "ಕನಿಷ್ಠ",
    max: "ಗರಿಷ್ಠ",
    humidity: "ಆರ್ದ್ರತೆ",
    rain: "ಮಳೆ",
    loading: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    unavailable: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಲಭ್ಯವಿಲ್ಲ.",
  },
  "ml-IN": {
    title: "5 ദിവസത്തെ കാലാവസ്ഥാ പ്രവചനം",
    min: "കുറഞ്ഞ",
    max: "കൂടിയ",
    humidity: "ഈർപ്പം",
    rain: "മഴ",
    loading: "കാലാവസ്ഥാ പ്രവചനം ലോഡ് ചെയ്യുന്നു...",
    unavailable: "കാലാവസ്ഥാ പ്രവചനം ലഭ്യമല്ല.",
  },
};

function formatForecastDate(date, language) {
  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(language || "en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(parsedDate);
}

const weatherConditionTranslations = {
  clear: {
    "en-IN": "Clear",
    "te-IN": "స్పష్టమైన వాతావరణం",
    "hi-IN": "साफ़ मौसम",
    "ta-IN": "தெளிவான வானிலை",
    "kn-IN": "ಸ್ಪಷ್ಟ ಹವಾಮಾನ",
    "ml-IN": "തെളിഞ്ഞ കാലാവസ്ഥ",
  },

  clouds: {
    "en-IN": "Cloudy",
    "te-IN": "మేఘావృతం",
    "hi-IN": "बादल छाए हुए",
    "ta-IN": "மேகமூட்டம்",
    "kn-IN": "ಮೋಡ ಕವಿದಿದೆ",
    "ml-IN": "മേഘാവൃതം",
  },

  rain: {
    "en-IN": "Rain",
    "te-IN": "వర్షం",
    "hi-IN": "बारिश",
    "ta-IN": "மழை",
    "kn-IN": "ಮಳೆ",
    "ml-IN": "മഴ",
  },

  drizzle: {
    "en-IN": "Drizzle",
    "te-IN": "చినుకులు",
    "hi-IN": "बूंदाबांदी",
    "ta-IN": "தூறல்",
    "kn-IN": "ತುಂತುರು ಮಳೆ",
    "ml-IN": "ചാറ്റൽമഴ",
  },

  thunderstorm: {
    "en-IN": "Thunderstorm",
    "te-IN": "ఉరుములతో కూడిన వర్షం",
    "hi-IN": "आंधी और गरज",
    "ta-IN": "இடியுடன் கூடிய மழை",
    "kn-IN": "ಗುಡುಗು ಸಹಿತ ಮಳೆ",
    "ml-IN": "ഇടിമിന്നലോടുകൂടിയ മഴ",
  },

  mist: {
    "en-IN": "Mist",
    "te-IN": "పొగమంచు",
    "hi-IN": "धुंध",
    "ta-IN": "மூடுபனி",
    "kn-IN": "ಮಂಜು",
    "ml-IN": "മൂടൽമഞ്ഞ്",
  },

  fog: {
    "en-IN": "Fog",
    "te-IN": "దట్టమైన పొగమంచు",
    "hi-IN": "कोहरा",
    "ta-IN": "அடர்ந்த மூடுபனி",
    "kn-IN": "ದಟ್ಟ ಮಂಜು",
    "ml-IN": "കനത്ത മൂടൽമഞ്ഞ്",
  },

  haze: {
    "en-IN": "Haze",
    "te-IN": "మసక వాతావరణం",
    "hi-IN": "धुंधला मौसम",
    "ta-IN": "மங்கலான வானிலை",
    "kn-IN": "ಮಬ್ಬಾದ ವಾತಾವರಣ",
    "ml-IN": "മങ്ങിയ കാലാവസ്ഥ",
  },

  snow: {
    "en-IN": "Snow",
    "te-IN": "మంచు",
    "hi-IN": "बर्फबारी",
    "ta-IN": "பனிப்பொழிவு",
    "kn-IN": "ಹಿಮಪಾತ",
    "ml-IN": "മഞ്ഞുവീഴ്ച",
  },
};

const weatherDescriptionTranslations = {
  "clear sky": {
    "en-IN": "Clear sky",
    "te-IN": "స్పష్టమైన ఆకాశం",
    "hi-IN": "साफ़ आसमान",
    "ta-IN": "தெளிவான வானம்",
    "kn-IN": "ಸ್ಪಷ್ಟ ಆಕಾಶ",
    "ml-IN": "തെളിഞ്ഞ ആകാശം",
  },

  "few clouds": {
    "en-IN": "Few clouds",
    "te-IN": "కొన్ని మేఘాలు",
    "hi-IN": "थोड़े बादल",
    "ta-IN": "சில மேகங்கள்",
    "kn-IN": "ಕೆಲವು ಮೋಡಗಳು",
    "ml-IN": "കുറച്ച് മേഘങ്ങൾ",
  },

  "scattered clouds": {
    "en-IN": "Scattered clouds",
    "te-IN": "చెల్లాచెదురైన మేఘాలు",
    "hi-IN": "छिटपुट बादल",
    "ta-IN": "சிதறிய மேகங்கள்",
    "kn-IN": "ಚದುರಿದ ಮೋಡಗಳು",
    "ml-IN": "ചിതറിയ മേഘങ്ങൾ",
  },

  "broken clouds": {
    "en-IN": "Broken clouds",
    "te-IN": "ఎక్కువ మేఘాలు",
    "hi-IN": "अधिक बादल",
    "ta-IN": "அதிக மேகங்கள்",
    "kn-IN": "ಹೆಚ್ಚು ಮೋಡಗಳು",
    "ml-IN": "കൂടുതൽ മേഘങ്ങൾ",
  },

  "overcast clouds": {
    "en-IN": "Overcast clouds",
    "te-IN": "పూర్తిగా మేఘావృతం",
    "hi-IN": "पूरी तरह बादल छाए हुए",
    "ta-IN": "முழுவதும் மேகமூட்டம்",
    "kn-IN": "ಸಂಪೂರ್ಣ ಮೋಡ ಕವಿದಿದೆ",
    "ml-IN": "പൂർണമായും മേഘാവൃതം",
  },

  "light rain": {
    "en-IN": "Light rain",
    "te-IN": "తేలికపాటి వర్షం",
    "hi-IN": "हल्की बारिश",
    "ta-IN": "லேசான மழை",
    "kn-IN": "ಲಘು ಮಳೆ",
    "ml-IN": "നേരിയ മഴ",
  },

  "moderate rain": {
    "en-IN": "Moderate rain",
    "te-IN": "మోస్తరు వర్షం",
    "hi-IN": "मध्यम बारिश",
    "ta-IN": "மிதமான மழை",
    "kn-IN": "ಮಧ್ಯಮ ಮಳೆ",
    "ml-IN": "മിതമായ മഴ",
  },

  "heavy intensity rain": {
    "en-IN": "Heavy rain",
    "te-IN": "భారీ వర్షం",
    "hi-IN": "भारी बारिश",
    "ta-IN": "கனமழை",
    "kn-IN": "ಭಾರಿ ಮಳೆ",
    "ml-IN": "കനത്ത മഴ",
  },

  "light intensity drizzle": {
    "en-IN": "Light drizzle",
    "te-IN": "తేలికపాటి చినుకులు",
    "hi-IN": "हल्की बूंदाबांदी",
    "ta-IN": "லேசான தூறல்",
    "kn-IN": "ಲಘು ತುಂತುರು ಮಳೆ",
    "ml-IN": "നേരിയ ചാറ്റൽമഴ",
  },
};

function translateWeatherValue(value, language, dictionary) {
  if (!value) {
    return "";
  }

  const normalizedValue = String(value).trim().toLowerCase();

  return (
    dictionary[normalizedValue]?.[language] ||
    dictionary[normalizedValue]?.["en-IN"] ||
    value
  );
}

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] =
    useState(false);
  const [usingCurrentLocation, setUsingCurrentLocation] =
    useState(false);

  const { language, voiceResponsesEnabled } = useSettings();

  const text =
    translations[language] ||
    translations["en-IN"];

  const forecastText =
    forecastTranslations[language] ||
    forecastTranslations["en-IN"];

  const speakWeatherSummary = (data) => {
    const summary = data?.aiAdvice?.summary;

    if (
      voiceResponsesEnabled &&
      summary
    ) {
      speakText(summary, language);
    }
  };

  const fetchForecastData = async (
    latitude,
    longitude
  ) => {
    try {
      setForecastLoading(true);

      const response = await getForecast(
        latitude,
        longitude,
        language
      );

      setForecast(
        Array.isArray(response?.forecast)
          ? response.forecast
          : []
      );
    } catch (error) {
      console.error(
        "Forecast fetch error:",
        error
      );

      setForecast([]);

      toast.error(
        error?.response?.data?.message ||
          forecastText.unavailable
      );
    } finally {
      setForecastLoading(false);
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(
        "Location is not supported by this browser."
      );
      return;
    }

    setLocationLoading(true);
    window.speechSynthesis?.cancel();

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } =
            position.coords;

          const data =
            await getWeatherByLocation(
              latitude,
              longitude,
              language
            );

          const currentLocation = String(
            data?.localizedCity ||
              data?.city ||
              "Current Location"
          ).trim();

          localStorage.setItem(
            "agrisenseCurrentLocation",
            currentLocation
          );

          const normalizedWeather = {
            ...data,
            city: currentLocation,
            localizedCity: currentLocation,
          };

          setWeather(normalizedWeather);
          setCity(currentLocation);
          setUsingCurrentLocation(true);

          await fetchForecastData(
            data.latitude ?? latitude,
            data.longitude ?? longitude
          );

          toast.success(
            "Current location weather updated"
          );

          speakWeatherSummary(data);
        } catch (error) {
          console.error(
            "Current location weather error:",
            error
          );

          toast.error(
            error?.response?.data?.message ||
              "Unable to fetch weather for your current location"
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        setLocationLoading(false);

        if (error.code === 1) {
          toast.error(
            "Location permission was denied. Search by city or allow location access."
          );
          return;
        }

        if (error.code === 2) {
          toast.error(
            "Your current location is unavailable."
          );
          return;
        }

        if (error.code === 3) {
          toast.error(
            "Location request timed out. Please try again."
          );
          return;
        }

        toast.error(
          "Unable to detect your current location."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
  fetchCurrentLocation();

  return () => {
    // Stop voice when leaving the Weather page
    window.speechSynthesis.cancel();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const fetchWeather = async () => {
    const cleanCity = city.trim();

    if (!cleanCity) {
      toast.error(text.enterCityError);
      return;
    }

    try {
      setLoading(true);

      window.speechSynthesis?.cancel();

      const data = await getWeather(
        cleanCity,
        language
      );

      setWeather(data);

      await fetchForecastData(
        data.latitude,
        data.longitude
      );

      toast.success(text.weatherUpdated);

      setUsingCurrentLocation(false);

      speakWeatherSummary(data);
    } catch (error) {
      console.error(
        "Weather fetch error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          text.fetchError
      );
    } finally {
      setLoading(false);
    }
  };

  const handleListen = () => {
    const summary =
      weather?.aiAdvice?.summary;

    if (!voiceResponsesEnabled) {
      toast.error(text.voiceDisabled);
      return;
    }

    if (!summary) {
      toast.error(text.noSummary);
      return;
    }

    window.speechSynthesis?.cancel();

    speakText(summary, language);
  };

  const handleStopReading = () => {
    window.speechSynthesis?.cancel();
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !loading &&
      !locationLoading
    ) {
      fetchWeather();
    }
  };

  const translatedCondition =
    translateWeatherValue(
      weather?.condition,
      language,
      weatherConditionTranslations
    );

  const translatedDescription =
    translateWeatherValue(
      weather?.description,
      language,
      weatherDescriptionTranslations
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-4 sm:p-8">
      <h1 className="mb-3 text-center text-3xl font-bold text-green-700 sm:text-5xl">
        🌦 {text.pageTitle}
      </h1>

      <p className="mb-10 text-center text-gray-600">
        {text.pageSubtitle}
      </p>

      <div className="mb-10 flex flex-col justify-center gap-4 md:flex-row">
        <input
          type="text"
          placeholder={text.cityPlaceholder}
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            setUsingCurrentLocation(false);
          }}
          onKeyDown={handleKeyDown}
          disabled={loading || locationLoading}
          className="w-full rounded-xl border-2 border-green-300 px-5 py-3 outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:bg-gray-100 md:w-96"
        />

        <button
          type="button"
          onClick={fetchWeather}
          disabled={loading || locationLoading}
          className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? text.searching
            : text.search}
        </button>

        <button
          type="button"
          onClick={fetchCurrentLocation}
          disabled={loading || locationLoading}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locationLoading
            ? "📍 Detecting..."
            : "📍 Use Current Location"}
        </button>
      </div>

      {usingCurrentLocation && weather && (
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          <span>📍</span>
          <span>
            Using current location: {
              weather.localizedCity ||
              weather.city
            }
          </span>
        </div>
      )}

      {(loading || locationLoading) && (
        <LoadingSpinner />
      )}

      {!loading && !locationLoading && !weather && (
        <div className="mt-16 text-center">
          <div className="mb-5 text-7xl">
            🌤
          </div>

          <h2 className="text-2xl font-bold text-gray-700">
            {text.emptyTitle}
          </h2>

          <p className="mt-2 text-gray-500">
            {text.emptyDescription}
          </p>
        </div>
      )}

      {!loading && !locationLoading && weather && (
        <>
          <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-xl transition hover:shadow-2xl sm:p-10">
            <h2 className="mb-8 text-center text-3xl font-bold text-green-700 sm:text-4xl">
              📍 {
                weather.localizedCity ||
                weather.city
              }
            </h2>

            <div className="space-y-5 text-base sm:text-lg">
              <div className="flex justify-between gap-4">
                <span>
                  🌡 {text.temperature}
                </span>

                <b>
                  {weather.temperature}{" "}
                  {text.degreeUnit}
                </b>
              </div>

              <div className="flex justify-between gap-4">
                <span>
                  💧 {text.humidity}
                </span>

                <b>{weather.humidity}%</b>
              </div>

              <div className="flex justify-between gap-4">
                <span>
                  🌬 {text.windSpeed}
                </span>

                <b>
                  {weather.windSpeed}{" "}
                  {text.windUnit}
                </b>
              </div>

              <div className="flex justify-between gap-4">
                <span>
                  ☁ {text.condition}
                </span>

                <b className="text-right">
                  {translatedCondition}
                </b>
              </div>

              <div className="flex justify-between gap-4">
                <span>
                  📝 {text.description}
                </span>

                <b className="text-right">
                  {translatedDescription}
                </b>
              </div>
            </div>
          </div>


          <section className="mx-auto mt-8 max-w-6xl rounded-3xl bg-white p-5 shadow-2xl sm:p-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-green-700 sm:text-4xl">
              📅 {forecastText.title}
            </h2>

            {forecastLoading ? (
              <p className="py-8 text-center font-medium text-gray-600">
                {forecastText.loading}
              </p>
            ) : forecast.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {forecast.map((day) => (
                  <article
                    key={day.date}
                    className="rounded-2xl border border-green-100 bg-gradient-to-b from-blue-50 to-green-50 p-5 text-center shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <p className="font-bold text-green-800">
                      {formatForecastDate(
                        day.date,
                        language
                      )}
                    </p>

                    <div className="my-4 text-5xl">
                      {day.icon || "🌤️"}
                    </div>

                    <p className="min-h-12 font-semibold capitalize text-gray-700">
                      {day.description ||
                        day.condition}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-gray-900">
                      {day.temperature ?? "--"}
                      °C
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between gap-2">
                        <span>
                          🔻 {forecastText.min}
                        </span>
                        <strong>
                          {day.minimumTemperature ??
                            "--"}
                          °C
                        </strong>
                      </div>

                      <div className="flex justify-between gap-2">
                        <span>
                          🔺 {forecastText.max}
                        </span>
                        <strong>
                          {day.maximumTemperature ??
                            "--"}
                          °C
                        </strong>
                      </div>

                      <div className="flex justify-between gap-2">
                        <span>
                          💧 {forecastText.humidity}
                        </span>
                        <strong>
                          {day.humidity ?? "--"}%
                        </strong>
                      </div>

                      <div className="flex justify-between gap-2">
                        <span>
                          🌧️ {forecastText.rain}
                        </span>
                        <strong>
                          {day.rainProbability ??
                            0}
                          %
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center font-medium text-gray-600">
                {forecastText.unavailable}
              </p>
            )}
          </section>

          {weather.aiAdvice && (
            <div className="mx-auto mt-8 max-w-5xl rounded-3xl bg-white p-5 shadow-2xl sm:p-8">
              <h2 className="mb-8 text-center text-3xl font-bold text-green-700 sm:text-4xl">
                🌾 {weather.aiAdvice.title}
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-blue-50 p-6">
                  <h3 className="mb-3 text-2xl font-bold text-blue-700">
                    💧 {text.irrigation}
                  </h3>

                  <p className="leading-8">
                    {
                      weather.aiAdvice
                        .irrigation
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-cyan-50 p-6">
                  <h3 className="mb-3 text-2xl font-bold text-cyan-700">
                    ☔ {text.rainAlert}
                  </h3>

                  <p className="leading-8">
                    {
                      weather.aiAdvice
                        .rainAlert
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-6">
                  <h3 className="mb-3 text-2xl font-bold text-red-700">
                    🧪{" "}
                    {text.pesticideAdvice}
                  </h3>

                  <p className="leading-8">
                    {
                      weather.aiAdvice
                        .pesticide
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-green-50 p-6">
                  <h3 className="mb-3 text-2xl font-bold text-green-700">
                    🌱 {text.cropCare}
                  </h3>

                  <p className="leading-8">
                    {
                      weather.aiAdvice
                        .cropCare
                    }
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-yellow-50 p-6">
                <h3 className="mb-3 text-2xl font-bold text-yellow-700">
                  🚜 {text.fieldWork}
                </h3>

                <p className="leading-8">
                  {
                    weather.aiAdvice
                      .fieldWork
                  }
                </p>
              </div>

              <div className="mt-6 rounded-2xl border-l-4 border-green-700 bg-green-100 p-6">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-2xl font-bold text-green-800">
                    🔊 {text.aiSummary}
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleListen}
                      disabled={
                        !voiceResponsesEnabled
                      }
                      className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {voiceResponsesEnabled
                        ? `🔊 ${text.listen}`
                        : `🔇 ${text.voiceOff}`}
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleStopReading
                      }
                      className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
                    >
                      ⏹ {text.stop}
                    </button>
                  </div>
                </div>

                <p className="whitespace-pre-wrap leading-8 text-gray-800">
                  {
                    weather.aiAdvice
                      .summary
                  }
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Weather;