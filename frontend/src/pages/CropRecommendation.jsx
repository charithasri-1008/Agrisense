import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import LoadingSpinner from "../components/LoadingSpinner";
import { useSettings } from "../context/SettingsContext";
import { recommendCrop } from "../services/cropService";
import { speakText } from "../utils/speech";

const translations = {
  "en-IN": {
    pageTitle: "Crop Recommendation",
    subtitle:
      "Allow location access and receive AI-powered crop recommendations using local weather.",

    soilType: "Soil Type",
    season: "Season",

    clay: "Clay",
    black: "Black",
    loamy: "Loamy",
    sandy: "Sandy",

    kharif: "Kharif",
    rabi: "Rabi",
    zaid: "Zaid",

    locationTitle: "Current Location",
    weatherTitle: "Local Weather",
    rainfall: "Rainfall",
    temperature: "Temperature",

    useLocation: "Use Current Location",
    refreshLocation: "Refresh Location",
    locating: "Finding your location...",
    locationNotLoaded: "Location not loaded",

    locationPermissionDenied:
      "Location permission was denied. Allow location access in the browser and try again.",

    locationUnsupported:
      "This browser does not support location access.",

    weatherLoaded:
      "Location and weather loaded",

    weatherFailed:
      "Unable to load weather for this location",

    weatherRequired:
      "Please load your current location first",

    getRecommendation:
      "Get Recommendation",

    gettingRecommendation:
      "Getting Recommendation...",

    recommendationReady:
      "AI recommendation ready",

    recommendationFailed:
      "Recommendation failed",

    emptyTitle:
      "AI Crop Advisor",

    emptyDescription:
      "Select the soil type and season, then use your location to receive a recommendation.",

    confidence: "Confidence",
    whyCrop: "Why this Crop?",
    fertilizer: "Fertilizer",
    pesticide: "Recommended Pesticide",
    irrigation: "Irrigation Advice",
    expectedYield: "Expected Yield",
    farmingTips: "Farming Tips",
    aiSummary: "AI Summary",

    listen: "Listen",
    stop: "Stop",
    voiceOff: "Voice Off",

    voiceDisabled:
      "Voice responses are turned off in Profile settings",

    noSummary:
      "No summary is available",
  },

  "te-IN": {
    pageTitle: "పంట సిఫార్సు",

    subtitle:
      "లొకేషన్ అనుమతి ఇచ్చి, మీ ప్రాంత వాతావరణం ఆధారంగా AI పంట సిఫార్సు పొందండి.",

    soilType: "నేల రకం",
    season: "కాలం",

    clay: "బంకమట్టి నేల",
    black: "నల్ల నేల",
    loamy: "లోమీ నేల",
    sandy: "ఇసుక నేల",

    kharif: "ఖరీఫ్",
    rabi: "రబీ",
    zaid: "జైద్",

    locationTitle: "ప్రస్తుత లొకేషన్",
    weatherTitle: "స్థానిక వాతావరణం",
    rainfall: "వర్షపాతం",
    temperature: "ఉష్ణోగ్రత",

    useLocation:
      "ప్రస్తుత లొకేషన్ ఉపయోగించండి",

    refreshLocation:
      "లొకేషన్ మళ్లీ పొందండి",

    locating:
      "మీ లొకేషన్ గుర్తిస్తున్నాము...",

    locationNotLoaded:
      "లొకేషన్ ఇంకా పొందలేదు",

    locationPermissionDenied:
      "లొకేషన్ అనుమతి ఇవ్వలేదు. బ్రౌజర్‌లో లొకేషన్ అనుమతించి మళ్లీ ప్రయత్నించండి.",

    locationUnsupported:
      "ఈ బ్రౌజర్‌లో లొకేషన్ సౌకర్యం లేదు.",

    weatherLoaded:
      "లొకేషన్ మరియు వాతావరణ వివరాలు వచ్చాయి",

    weatherFailed:
      "ఈ లొకేషన్‌కు వాతావరణ వివరాలు పొందలేకపోయాము",

    weatherRequired:
      "ముందుగా మీ ప్రస్తుత లొకేషన్ పొందండి",

    getRecommendation:
      "పంట సిఫార్సు పొందండి",

    gettingRecommendation:
      "సిఫార్సు సిద్ధమవుతోంది...",

    recommendationReady:
      "AI సిఫార్సు సిద్ధమైంది",

    recommendationFailed:
      "సిఫార్సు పొందడం విఫలమైంది",

    emptyTitle:
      "AI పంట సలహాదారు",

    emptyDescription:
      "నేల రకం, కాలం ఎంచుకుని మీ లొకేషన్ ద్వారా పంట సిఫార్సు పొందండి.",

    confidence: "నమ్మక స్థాయి",
    whyCrop: "ఈ పంట ఎందుకు?",
    fertilizer: "ఎరువుల సూచన",
    pesticide:
      "సిఫార్సు చేసిన పురుగుమందు",
    irrigation:
      "నీటిపారుదల సూచన",
    expectedYield:
      "అంచనా దిగుబడి",
    farmingTips:
      "వ్యవసాయ సూచనలు",
    aiSummary:
      "AI సారాంశం",

    listen: "వినండి",
    stop: "ఆపండి",
    voiceOff: "వాయిస్ ఆఫ్",

    voiceDisabled:
      "ప్రొఫైల్ సెట్టింగ్స్‌లో వాయిస్ స్పందనలు ఆఫ్‌లో ఉన్నాయి",

    noSummary:
      "వినడానికి సారాంశం అందుబాటులో లేదు",
  },

  "hi-IN": {
    pageTitle: "फसल अनुशंसा",

    subtitle:
      "स्थान की अनुमति दें और स्थानीय मौसम के आधार पर AI फसल सुझाव प्राप्त करें।",

    soilType: "मिट्टी का प्रकार",
    season: "मौसम",

    clay: "चिकनी मिट्टी",
    black: "काली मिट्टी",
    loamy: "दोमट मिट्टी",
    sandy: "रेतीली मिट्टी",

    kharif: "खरीफ",
    rabi: "रबी",
    zaid: "जायद",

    locationTitle: "वर्तमान स्थान",
    weatherTitle: "स्थानीय मौसम",
    rainfall: "वर्षा",
    temperature: "तापमान",

    useLocation:
      "वर्तमान स्थान का उपयोग करें",

    refreshLocation:
      "स्थान फिर से प्राप्त करें",

    locating:
      "आपका स्थान खोजा जा रहा है...",

    locationNotLoaded:
      "स्थान अभी लोड नहीं हुआ",

    locationPermissionDenied:
      "स्थान की अनुमति नहीं दी गई। ब्राउज़र में अनुमति देकर फिर प्रयास करें।",

    locationUnsupported:
      "यह ब्राउज़र स्थान सुविधा का समर्थन नहीं करता।",

    weatherLoaded:
      "स्थान और मौसम लोड हो गया",

    weatherFailed:
      "इस स्थान का मौसम प्राप्त नहीं हुआ",

    weatherRequired:
      "पहले अपना वर्तमान स्थान लोड करें",

    getRecommendation:
      "फसल सुझाव प्राप्त करें",

    gettingRecommendation:
      "सुझाव तैयार हो रहा है...",

    recommendationReady:
      "AI सुझाव तैयार है",

    recommendationFailed:
      "सुझाव प्राप्त नहीं हुआ",

    emptyTitle:
      "AI फसल सलाहकार",

    emptyDescription:
      "मिट्टी और मौसम चुनें, फिर अपने स्थान से फसल सुझाव प्राप्त करें।",

    confidence: "विश्वास स्तर",
    whyCrop: "यह फसल क्यों?",
    fertilizer: "उर्वरक",
    pesticide:
      "अनुशंसित कीटनाशक",
    irrigation:
      "सिंचाई सलाह",
    expectedYield:
      "अनुमानित उपज",
    farmingTips:
      "खेती के सुझाव",
    aiSummary:
      "AI सारांश",

    listen: "सुनें",
    stop: "रोकें",
    voiceOff: "आवाज़ बंद",

    voiceDisabled:
      "प्रोफाइल सेटिंग्स में आवाज़ प्रतिक्रियाएं बंद हैं",

    noSummary:
      "कोई सारांश उपलब्ध नहीं है",
  },

  "ta-IN": {
    pageTitle: "பயிர் பரிந்துரை",

    subtitle:
      "இருப்பிட அனுமதி அளித்து உள்ளூர் வானிலையின் அடிப்படையில் AI பயிர் பரிந்துரையைப் பெறுங்கள்.",

    soilType: "மண் வகை",
    season: "பருவம்",

    clay: "களிமண்",
    black: "கருப்பு மண்",
    loamy: "வண்டல் மண்",
    sandy: "மணல் மண்",

    kharif: "காரிஃப்",
    rabi: "ரபி",
    zaid: "சயித்",

    locationTitle:
      "தற்போதைய இருப்பிடம்",

    weatherTitle:
      "உள்ளூர் வானிலை",

    rainfall:
      "மழைப்பொழிவு",

    temperature:
      "வெப்பநிலை",

    useLocation:
      "தற்போதைய இருப்பிடத்தை பயன்படுத்தவும்",

    refreshLocation:
      "இருப்பிடத்தை புதுப்பிக்கவும்",

    locating:
      "உங்கள் இருப்பிடம் கண்டறியப்படுகிறது...",

    locationNotLoaded:
      "இருப்பிடம் இன்னும் ஏற்றப்படவில்லை",

    locationPermissionDenied:
      "இருப்பிட அனுமதி மறுக்கப்பட்டது. உலாவியில் அனுமதி அளித்து மீண்டும் முயற்சிக்கவும்.",

    locationUnsupported:
      "இந்த உலாவி இருப்பிட வசதியை ஆதரிக்கவில்லை.",

    weatherLoaded:
      "இருப்பிடம் மற்றும் வானிலை ஏற்றப்பட்டது",

    weatherFailed:
      "இந்த இருப்பிடத்திற்கான வானிலை கிடைக்கவில்லை",

    weatherRequired:
      "முதலில் தற்போதைய இருப்பிடத்தை ஏற்றவும்",

    getRecommendation:
      "பரிந்துரை பெறுங்கள்",

    gettingRecommendation:
      "பரிந்துரை தயாராகிறது...",

    recommendationReady:
      "AI பரிந்துரை தயாராக உள்ளது",

    recommendationFailed:
      "பரிந்துரை பெற முடியவில்லை",

    emptyTitle:
      "AI பயிர் ஆலோசகர்",

    emptyDescription:
      "மண் வகை மற்றும் பருவத்தை தேர்வு செய்து இருப்பிடத்தின் மூலம் பரிந்துரை பெறுங்கள்.",

    confidence:
      "நம்பிக்கை அளவு",

    whyCrop:
      "இந்தப் பயிர் ஏன்?",

    fertilizer: "உரம்",

    pesticide:
      "பரிந்துரைக்கப்பட்ட பூச்சிக்கொல்லி",

    irrigation:
      "நீர்ப்பாசன ஆலோசனை",

    expectedYield:
      "எதிர்பார்க்கப்படும் விளைச்சல்",

    farmingTips:
      "விவசாய குறிப்புகள்",

    aiSummary:
      "AI சுருக்கம்",

    listen: "கேட்க",
    stop: "நிறுத்து",
    voiceOff: "குரல் முடக்கம்",

    voiceDisabled:
      "சுயவிவர அமைப்புகளில் குரல் பதில்கள் முடக்கப்பட்டுள்ளன",

    noSummary:
      "சுருக்கம் கிடைக்கவில்லை",
  },

  "kn-IN": {
    pageTitle: "ಬೆಳೆ ಶಿಫಾರಸು",

    subtitle:
      "ಸ್ಥಳ ಅನುಮತಿ ನೀಡಿ ಸ್ಥಳೀಯ ಹವಾಮಾನದ ಆಧಾರದ ಮೇಲೆ AI ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ.",

    soilType:
      "ಮಣ್ಣಿನ ಪ್ರಕಾರ",

    season: "ಋತು",

    clay: "ಜೇಡಿ ಮಣ್ಣು",
    black: "ಕಪ್ಪು ಮಣ್ಣು",
    loamy: "ಲೋಮಿ ಮಣ್ಣು",
    sandy: "ಮರಳು ಮಣ್ಣು",

    kharif: "ಖರೀಫ್",
    rabi: "ರಬಿ",
    zaid: "ಜೈದ್",

    locationTitle:
      "ಪ್ರಸ್ತುತ ಸ್ಥಳ",

    weatherTitle:
      "ಸ್ಥಳೀಯ ಹವಾಮಾನ",

    rainfall:
      "ಮಳೆಯ ಪ್ರಮಾಣ",

    temperature:
      "ತಾಪಮಾನ",

    useLocation:
      "ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ",

    refreshLocation:
      "ಸ್ಥಳವನ್ನು ಮರುಪಡೆಯಿರಿ",

    locating:
      "ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",

    locationNotLoaded:
      "ಸ್ಥಳ ಇನ್ನೂ ಲೋಡ್ ಆಗಿಲ್ಲ",

    locationPermissionDenied:
      "ಸ್ಥಳ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಅನುಮತಿ ನೀಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",

    locationUnsupported:
      "ಈ ಬ್ರೌಸರ್ ಸ್ಥಳ ಸೌಲಭ್ಯವನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.",

    weatherLoaded:
      "ಸ್ಥಳ ಮತ್ತು ಹವಾಮಾನ ಲೋಡ್ ಆಗಿದೆ",

    weatherFailed:
      "ಈ ಸ್ಥಳದ ಹವಾಮಾನ ಪಡೆಯಲಾಗಲಿಲ್ಲ",

    weatherRequired:
      "ಮೊದಲು ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಲೋಡ್ ಮಾಡಿ",

    getRecommendation:
      "ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ",

    gettingRecommendation:
      "ಶಿಫಾರಸು ಸಿದ್ಧವಾಗುತ್ತಿದೆ...",

    recommendationReady:
      "AI ಶಿಫಾರಸು ಸಿದ್ಧವಾಗಿದೆ",

    recommendationFailed:
      "ಶಿಫಾರಸು ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ",

    emptyTitle:
      "AI ಬೆಳೆ ಸಲಹೆಗಾರ",

    emptyDescription:
      "ಮಣ್ಣಿನ ಪ್ರಕಾರ ಮತ್ತು ಋತುವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಸ್ಥಳದ ಮೂಲಕ ಶಿಫಾರಸು ಪಡೆಯಿರಿ.",

    confidence:
      "ವಿಶ್ವಾಸ ಮಟ್ಟ",

    whyCrop:
      "ಈ ಬೆಳೆ ಏಕೆ?",

    fertilizer:
      "ರಸಗೊಬ್ಬರ",

    pesticide:
      "ಶಿಫಾರಸು ಮಾಡಿದ ಕೀಟನಾಶಕ",

    irrigation:
      "ನೀರಾವರಿ ಸಲಹೆ",

    expectedYield:
      "ನಿರೀಕ್ಷಿತ ಇಳುವರಿ",

    farmingTips:
      "ಕೃಷಿ ಸಲಹೆಗಳು",

    aiSummary:
      "AI ಸಾರಾಂಶ",

    listen: "ಆಲಿಸಿ",
    stop: "ನಿಲ್ಲಿಸಿ",
    voiceOff: "ಧ್ವನಿ ಆಫ್",

    voiceDisabled:
      "ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಧ್ವನಿ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಆಫ್ ಆಗಿವೆ",

    noSummary:
      "ಸಾರಾಂಶ ಲಭ್ಯವಿಲ್ಲ",
  },

  "ml-IN": {
    pageTitle: "വിള ശുപാർശ",

    subtitle:
      "ലൊക്കേഷൻ അനുമതി നൽകി പ്രാദേശിക കാലാവസ്ഥയുടെ അടിസ്ഥാനത്തിൽ AI വിള ശുപാർശ നേടുക.",

    soilType:
      "മണ്ണിന്റെ തരം",

    season: "കാലം",

    clay: "കളിമണ്ണ്",
    black: "കറുത്ത മണ്ണ്",
    loamy: "ലോമി മണ്ണ്",
    sandy: "മണൽമണ്ണ്",

    kharif: "ഖാരിഫ്",
    rabi: "റാബി",
    zaid: "സൈദ്",

    locationTitle:
      "നിലവിലെ സ്ഥലം",

    weatherTitle:
      "പ്രാദേശിക കാലാവസ്ഥ",

    rainfall:
      "മഴയുടെ അളവ്",

    temperature:
      "താപനില",

    useLocation:
      "നിലവിലെ സ്ഥലം ഉപയോഗിക്കുക",

    refreshLocation:
      "സ്ഥലം വീണ്ടും നേടുക",

    locating:
      "നിങ്ങളുടെ സ്ഥലം കണ്ടെത്തുന്നു...",

    locationNotLoaded:
      "സ്ഥലം ഇതുവരെ ലോഡ് ചെയ്തിട്ടില്ല",

    locationPermissionDenied:
      "സ്ഥല അനുമതി നിഷേധിച്ചു. ബ്രൗസറിൽ അനുമതി നൽകി വീണ്ടും ശ്രമിക്കുക.",

    locationUnsupported:
      "ഈ ബ്രൗസർ ലൊക്കേഷൻ സൗകര്യം പിന്തുണയ്ക്കുന്നില്ല.",

    weatherLoaded:
      "സ്ഥലവും കാലാവസ്ഥയും ലോഡ് ചെയ്തു",

    weatherFailed:
      "ഈ സ്ഥലത്തിന്റെ കാലാവസ്ഥ ലഭ്യമല്ല",

    weatherRequired:
      "ആദ്യം നിലവിലെ സ്ഥലം ലോഡ് ചെയ്യുക",

    getRecommendation:
      "വിള ശുപാർശ നേടുക",

    gettingRecommendation:
      "ശുപാർശ തയ്യാറാക്കുന്നു...",

    recommendationReady:
      "AI ശുപാർശ തയ്യാറായി",

    recommendationFailed:
      "ശുപാർശ ലഭിച്ചില്ല",

    emptyTitle:
      "AI വിള ഉപദേഷ്ടാവ്",

    emptyDescription:
      "മണ്ണിന്റെ തരവും കാലവും തിരഞ്ഞെടുത്ത് സ്ഥലത്തിന്റെ അടിസ്ഥാനത്തിൽ ശുപാർശ നേടുക.",

    confidence:
      "വിശ്വാസനില",

    whyCrop:
      "ഈ വിള എന്തുകൊണ്ട്?",

    fertilizer: "വളം",

    pesticide:
      "ശുപാർശ ചെയ്ത കീടനാശിനി",

    irrigation:
      "ജലസേചന നിർദേശം",

    expectedYield:
      "പ്രതീക്ഷിക്കുന്ന വിളവ്",

    farmingTips:
      "കൃഷി നിർദേശങ്ങൾ",

    aiSummary:
      "AI സംഗ്രഹം",

    listen: "കേൾക്കുക",
    stop: "നിർത്തുക",
    voiceOff: "ശബ്ദം ഓഫ്",

    voiceDisabled:
      "പ്രൊഫൈൽ ക്രമീകരണങ്ങളിൽ ശബ്ദ പ്രതികരണങ്ങൾ ഓഫ് ആണ്",

    noSummary:
      "സംഗ്രഹം ലഭ്യമല്ല",
  },
};

const initialWeatherData = {
  location: "",
  rainfall: null,
  temperature: null,
  latitude: null,
  longitude: null,
};

const getStoredAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    ""
  );
};

function CropRecommendation() {
  const [form, setForm] =
    useState({
      soilType: "Clay",
      season: "Kharif",
    });

  const [
    weatherData,
    setWeatherData,
  ] = useState(
    initialWeatherData
  );

  const [
    weatherLoading,
    setWeatherLoading,
  ] = useState(false);

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const {
    language,
    voiceResponsesEnabled,
  } = useSettings();

  const text = useMemo(
    () =>
      translations[language] ||
      translations["en-IN"],
    [language]
  );

  const apiBaseUrl = useMemo(
    () =>
      String(
        import.meta.env
          .VITE_API_URL || ""
      ).replace(/\/$/, ""),
    []
  );

  useEffect(() => {
  window.speechSynthesis?.cancel();
  setResult(null);

  return () => {
    window.speechSynthesis?.cancel();
  };
}, [language]);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previousForm) => ({
        ...previousForm,
        [name]: value,
      })
    );
  };

  const fetchCurrentWeather = () => {
  if (!navigator.geolocation) {
    toast.error(text.locationUnsupported);
    return;
  }

  if (!apiBaseUrl) {
    toast.error(
      "VITE_API_URL is missing in the frontend environment variables."
    );
    return;
  }

  setWeatherLoading(true);
  setResult(null);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const {
          latitude,
          longitude,
        } = position.coords;

        const token =
          getStoredAuthToken();

        const response =
          await axios.get(
            `${apiBaseUrl}/api/weather/location`,
            {
              params: {
                latitude,
                longitude,
                language,
              },

              headers: token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : undefined,

              withCredentials: false,
            }
          );

        console.log(
          "Crop Weather API Response:",
          response.data
        );

        const payload =
          response?.data?.data ||
          response?.data ||
          {};

        console.log(
          "Crop Weather Location Values:",
          {
            localizedCity:
              payload.localizedCity,
            city: payload.city,
            location:
              payload.location,
            latitude:
              payload.latitude,
            longitude:
              payload.longitude,
          }
        );

        const parsedTemperature =
          Number(
            payload.temperature
          );

        const parsedRainfall =
          Number(
            payload.rainfall ??
              payload.rain ??
              0
          );

        if (
          !Number.isFinite(
            parsedTemperature
          )
        ) {
          throw new Error(
            "Weather API did not return a valid temperature."
          );
        }

        const savedLocation =
          localStorage.getItem(
            "agrisenseCurrentLocation"
          );

        const apiLocation = String(
          payload.localizedCity ||
            payload.city ||
            "Current Location"
        ).trim();

        const locationName =
          savedLocation?.trim() ||
          apiLocation;

        localStorage.setItem(
          "agrisenseCurrentLocation",
          locationName
        );

        setWeatherData({
          location:
            locationName,

          rainfall:
            Number.isFinite(
              parsedRainfall
            )
              ? parsedRainfall
              : 0,

          temperature:
            parsedTemperature,

          latitude:
            payload.latitude ??
            latitude,

          longitude:
            payload.longitude ??
            longitude,
        });

        toast.success(
          text.weatherLoaded
        );
      } catch (error) {
        console.error(
          "Current weather error:",
          error
        );

        setWeatherData(
          initialWeatherData
        );

        toast.error(
          error?.response?.data
            ?.message ||
            error?.response?.data
              ?.error ||
            error?.message ||
            text.weatherFailed
        );
      } finally {
        setWeatherLoading(false);
      }
    },

    (geolocationError) => {
      console.error(
        "Geolocation error:",
        geolocationError
      );

      setWeatherLoading(false);

      toast.error(
        geolocationError.code === 1
          ? text.locationPermissionDenied
          : text.weatherFailed
      );
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );
};
  

  const handleSubmit =
    async () => {
      if (
        !weatherData.location ||
        !Number.isFinite(
          Number(
            weatherData.temperature
          )
        )
      ) {
        toast.error(
          text.weatherRequired
        );

        return;
      }

      const rainfall =
        Number(
          weatherData.rainfall ??
            0
        );

      const temperature =
        Number(
          weatherData.temperature
        );

      if (
        !Number.isFinite(
          rainfall
        ) ||
        rainfall < 0
      ) {
        toast.error(
          text.weatherFailed
        );

        return;
      }

      if (
        !Number.isFinite(
          temperature
        ) ||
        temperature < -20 ||
        temperature > 60
      ) {
        toast.error(
          text.weatherFailed
        );

        return;
      }

      try {
        setLoading(true);
        setResult(null);

        window
          .speechSynthesis
          ?.cancel();

        const data =
          await recommendCrop({
            soilType:
              form.soilType,

            season:
              form.season,

            rainfall,

            temperature,

            location:
              weatherData.location,

            latitude:
              weatherData.latitude,

            longitude:
              weatherData.longitude,

            language,
          });

        const finalData =
          data?.result ||
          data?.data ||
          data;

        setResult(finalData);

        toast.success(
          text.recommendationReady
        );

        if (
          voiceResponsesEnabled &&
          finalData?.narration
        ) {
          speakText(
            finalData.narration,
            language
          );
        }
      } catch (error) {
        console.error(
          "Crop recommendation error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            error?.response?.data
              ?.error ||
            text
              .recommendationFailed
        );
      } finally {
        setLoading(false);
      }
    };

  const handleListen = () => {
    if (
      !voiceResponsesEnabled
    ) {
      toast.error(
        text.voiceDisabled
      );

      return;
    }

    if (!result?.narration) {
      toast.error(
        text.noSummary
      );

      return;
    }

    window
      .speechSynthesis
      ?.cancel();

    speakText(
      result.narration,
      language
    );
  };

  const handleStopReading =
    () => {
      window
        .speechSynthesis
        ?.cancel();
    };

  const soilOptions = [
    {
      value: "Clay",
      label: text.clay,
    },
    {
      value: "Black",
      label: text.black,
    },
    {
      value: "Loamy",
      label: text.loamy,
    },
    {
      value: "Sandy",
      label: text.sandy,
    },
  ];

  const seasonOptions = [
    {
      value: "Kharif",
      label: text.kharif,
    },
    {
      value: "Rabi",
      label: text.rabi,
    },
    {
      value: "Zaid",
      label: text.zaid,
    },
  ];

  const weatherReady =
    Boolean(
      weatherData.location
    ) &&
    Number.isFinite(
      Number(
        weatherData.temperature
      )
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-4 sm:p-8">
      <h1 className="mb-3 text-center text-3xl font-bold text-green-700 sm:text-5xl">
        🌱 {text.pageTitle}
      </h1>

      <p className="mx-auto mb-10 max-w-3xl text-center text-gray-600">
        {text.subtitle}
      </p>

      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-5 shadow-2xl sm:p-10">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="soilType"
              className="font-semibold text-gray-700"
            >
              {text.soilType}
            </label>

            <select
              id="soilType"
              name="soilType"
              value={form.soilType}
              onChange={
                handleChange
              }
              className="mt-2 w-full rounded-xl border-2 border-green-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {soilOptions.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="season"
              className="font-semibold text-gray-700"
            >
              {text.season}
            </label>

            <select
              id="season"
              name="season"
              value={form.season}
              onChange={
                handleChange
              }
              className="mt-2 w-full rounded-xl border-2 border-green-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {seasonOptions.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-green-800">
                📍{" "}
                {
                  text.locationTitle
                }
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {weatherLoading
                  ? text.locating
                  : weatherData.location ||
                    text
                      .locationNotLoaded}
              </p>
            </div>

            <button
              type="button"
              onClick={
                fetchCurrentWeather
              }
              disabled={
                weatherLoading
              }
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {weatherLoading
                ? `⏳ ${text.locating}`
                : weatherReady
                  ? `🔄 ${text.refreshLocation}`
                  : `📍 ${text.useLocation}`}
            </button>
          </div>

          {weatherReady && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">
                  🌧{" "}
                  {text.rainfall}
                </p>

                <p className="mt-1 text-xl font-bold text-cyan-700">
                  {
                    weatherData.rainfall
                  }{" "}
                  mm
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">
                  🌡{" "}
                  {
                    text.temperature
                  }
                </p>

                <p className="mt-1 text-xl font-bold text-orange-700">
                  {
                    weatherData.temperature
                  }{" "}
                  °C
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            loading ||
            weatherLoading ||
            !weatherReady
          }
          className="mt-8 w-full rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? text
                .gettingRecommendation
            : `🌾 ${text.getRecommendation}`}
        </button>
      </div>

      {loading && (
        <div className="mt-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading &&
        !result && (
          <div className="mt-16 text-center">
            <div className="text-7xl">
              🌱
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-700">
              {text.emptyTitle}
            </h2>

            <p className="mt-2 text-gray-500">
              {
                text.emptyDescription
              }
            </p>
          </div>
        )}

      {!loading &&
        result && (
          <div className="mx-auto mt-10 max-w-5xl space-y-6">
            <div className="rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
              <h2 className="text-3xl font-bold text-green-700 sm:text-4xl">
                🌾{" "}
                {result
                  .recommendedCrop ||
                  result.crop ||
                  "Recommended Crop"}
              </h2>

              {result.confidence && (
                <p className="mt-4 text-lg font-semibold text-green-600 sm:text-xl">
                  ⭐{" "}
                  {
                    text.confidence
                  }
                  :{" "}
                  {
                    result.confidence
                  }
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ResultCard
                title={`📝 ${text.whyCrop}`}
                value={
                  result.reason ||
                  result.reasons
                }
                listIcon="✅"
                titleClass="text-green-700"
              />

              <ResultCard
                title={`🌿 ${text.fertilizer}`}
                value={
                  result.fertilizer
                }
                titleClass="text-blue-700"
              />

              <ResultCard
                title={`🧪 ${text.pesticide}`}
                value={
                  result.pesticide
                }
                titleClass="text-red-700"
              />

              <ResultCard
                title={`💧 ${text.irrigation}`}
                value={
                  result.irrigation
                }
                titleClass="text-cyan-700"
              />
            </div>

            <ResultCard
              title={`📈 ${text.expectedYield}`}
              value={
                result.expectedYield
              }
              titleClass="text-purple-700"
            />

            <ResultCard
              title={`💡 ${text.farmingTips}`}
              value={
                result.tips
              }
              listIcon="🌱"
              titleClass="text-orange-700"
            />

            {result.narration && (
              <div className="rounded-2xl border-l-4 border-green-700 bg-green-100 p-6">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl font-bold">
                    🔊{" "}
                    {
                      text.aiSummary
                    }
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={
                        handleListen
                      }
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
                      ⏹{" "}
                      {text.stop}
                    </button>
                  </div>
                </div>

                <p className="whitespace-pre-wrap leading-8">
                  {
                    result.narration
                  }
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

function ResultCard({
  title,
  value,
  listIcon = "•",
  titleClass =
    "text-gray-700",
}) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl">
      <h3
        className={`mb-4 text-2xl font-bold ${titleClass}`}
      >
        {title}
      </h3>

      {Array.isArray(value) ? (
        <ul className="space-y-3">
          {value.map(
            (item, index) => (
              <li
                key={`${index}-${item}`}
                className="flex gap-2"
              >
                <span>
                  {listIcon}
                </span>

                <span>
                  {item}
                </span>
              </li>
            )
          )}
        </ul>
      ) : (
        <p className="whitespace-pre-wrap leading-8">
          {String(value)}
        </p>
      )}
    </div>
  );
}

export default CropRecommendation;