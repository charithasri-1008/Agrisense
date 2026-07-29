import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { recommendCrop } from "../services/cropService";
import LoadingSpinner from "../components/LoadingSpinner";
import { speakText } from "../utils/speech";
import { useSettings } from "../context/SettingsContext";

const translations = {
  "en-IN": {
    pageTitle: "Crop Recommendation",
    subtitle:
      "Get AI-powered crop recommendations based on your farming conditions.",

    soilType: "Soil Type",
    season: "Season",
    rainfall: "Rainfall (mm)",
    temperature: "Temperature (°C)",

    clay: "Clay",
    black: "Black",
    loamy: "Loamy",
    sandy: "Sandy",

    kharif: "Kharif",
    rabi: "Rabi",
    zaid: "Zaid",

    rainfallPlaceholder: "Example: 120",
    temperaturePlaceholder: "Example: 28",

    getRecommendation: "Get Recommendation",
    gettingRecommendation: "Getting Recommendation...",

    emptyTitle: "AI Crop Advisor",
    emptyDescription:
      "Fill the details above and receive an intelligent crop recommendation.",

    fillAllFields: "Please fill all fields",
    invalidRainfall: "Please enter valid rainfall",
    invalidTemperature: "Please enter a valid temperature",
    recommendationReady: "AI recommendation ready",
    recommendationFailed: "Recommendation failed",

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
    noSummary: "No summary is available",
  },

  "te-IN": {
    pageTitle: "పంట సిఫార్సు",
    subtitle:
      "మీ వ్యవసాయ పరిస్థితుల ఆధారంగా AI పంట సిఫార్సులను పొందండి.",

    soilType: "నేల రకం",
    season: "కాలం",
    rainfall: "వర్షపాతం (మి.మీ)",
    temperature: "ఉష్ణోగ్రత (°C)",

    clay: "బంకమట్టి నేల",
    black: "నల్ల నేల",
    loamy: "లోమీ నేల",
    sandy: "ఇసుక నేల",

    kharif: "ఖరీఫ్",
    rabi: "రబీ",
    zaid: "జైద్",

    rainfallPlaceholder: "ఉదాహరణ: 120",
    temperaturePlaceholder: "ఉదాహరణ: 28",

    getRecommendation: "పంట సిఫార్సు పొందండి",
    gettingRecommendation: "సిఫార్సు సిద్ధమవుతోంది...",

    emptyTitle: "AI పంట సలహాదారు",
    emptyDescription:
      "పై వివరాలను నమోదు చేసి సరైన పంట సిఫార్సును పొందండి.",

    fillAllFields: "అన్ని వివరాలను నమోదు చేయండి",
    invalidRainfall: "సరైన వర్షపాతం నమోదు చేయండి",
    invalidTemperature: "సరైన ఉష్ణోగ్రత నమోదు చేయండి",
    recommendationReady: "AI సిఫార్సు సిద్ధమైంది",
    recommendationFailed: "సిఫార్సు పొందడం విఫలమైంది",

    confidence: "నమ్మక స్థాయి",
    whyCrop: "ఈ పంట ఎందుకు?",
    fertilizer: "ఎరువుల సూచన",
    pesticide: "సిఫార్సు చేసిన పురుగుమందు",
    irrigation: "నీటిపారుదల సూచన",
    expectedYield: "అంచనా దిగుబడి",
    farmingTips: "వ్యవసాయ సూచనలు",
    aiSummary: "AI సారాంశం",

    listen: "వినండి",
    stop: "ఆపండి",
    voiceOff: "వాయిస్ ఆఫ్",
    voiceDisabled:
      "ప్రొఫైల్ సెట్టింగ్స్‌లో వాయిస్ స్పందనలు ఆఫ్‌లో ఉన్నాయి",
    noSummary: "వినడానికి సారాంశం అందుబాటులో లేదు",
  },

  "hi-IN": {
    pageTitle: "फसल अनुशंसा",
    subtitle:
      "अपनी कृषि परिस्थितियों के आधार पर AI फसल सुझाव प्राप्त करें।",

    soilType: "मिट्टी का प्रकार",
    season: "मौसम",
    rainfall: "वर्षा (मिमी)",
    temperature: "तापमान (°C)",

    clay: "चिकनी मिट्टी",
    black: "काली मिट्टी",
    loamy: "दोमट मिट्टी",
    sandy: "रेतीली मिट्टी",

    kharif: "खरीफ",
    rabi: "रबी",
    zaid: "जायद",

    rainfallPlaceholder: "उदाहरण: 120",
    temperaturePlaceholder: "उदाहरण: 28",

    getRecommendation: "फसल सुझाव प्राप्त करें",
    gettingRecommendation: "सुझाव तैयार हो रहा है...",

    emptyTitle: "AI फसल सलाहकार",
    emptyDescription:
      "ऊपर दिए गए विवरण भरें और फसल सुझाव प्राप्त करें।",

    fillAllFields: "सभी विवरण भरें",
    invalidRainfall: "सही वर्षा मान दर्ज करें",
    invalidTemperature: "सही तापमान दर्ज करें",
    recommendationReady: "AI सुझाव तैयार है",
    recommendationFailed: "सुझाव प्राप्त नहीं हुआ",

    confidence: "विश्वास स्तर",
    whyCrop: "यह फसल क्यों?",
    fertilizer: "उर्वरक",
    pesticide: "अनुशंसित कीटनाशक",
    irrigation: "सिंचाई सलाह",
    expectedYield: "अनुमानित उपज",
    farmingTips: "खेती के सुझाव",
    aiSummary: "AI सारांश",

    listen: "सुनें",
    stop: "रोकें",
    voiceOff: "आवाज़ बंद",
    voiceDisabled:
      "प्रोफाइल सेटिंग्स में आवाज़ प्रतिक्रियाएं बंद हैं",
    noSummary: "कोई सारांश उपलब्ध नहीं है",
  },

  "ta-IN": {
    pageTitle: "பயிர் பரிந்துரை",
    subtitle:
      "உங்கள் விவசாய நிலைமைகளின் அடிப்படையில் AI பயிர் பரிந்துரைகளைப் பெறுங்கள்.",

    soilType: "மண் வகை",
    season: "பருவம்",
    rainfall: "மழைப்பொழிவு (மி.மீ)",
    temperature: "வெப்பநிலை (°C)",

    clay: "களிமண்",
    black: "கருப்பு மண்",
    loamy: "வண்டல் மண்",
    sandy: "மணல் மண்",

    kharif: "காரிஃப்",
    rabi: "ரபி",
    zaid: "சயித்",

    rainfallPlaceholder: "உதாரணம்: 120",
    temperaturePlaceholder: "உதாரணம்: 28",

    getRecommendation: "பரிந்துரை பெறுங்கள்",
    gettingRecommendation: "பரிந்துரை தயாராகிறது...",

    emptyTitle: "AI பயிர் ஆலோசகர்",
    emptyDescription:
      "மேலே உள்ள விவரங்களை நிரப்பி பயிர் பரிந்துரையைப் பெறுங்கள்.",

    fillAllFields: "அனைத்து விவரங்களையும் நிரப்பவும்",
    invalidRainfall: "சரியான மழைப்பொழிவு அளவை உள்ளிடவும்",
    invalidTemperature: "சரியான வெப்பநிலையை உள்ளிடவும்",
    recommendationReady: "AI பரிந்துரை தயாராக உள்ளது",
    recommendationFailed: "பரிந்துரை பெற முடியவில்லை",

    confidence: "நம்பிக்கை அளவு",
    whyCrop: "இந்தப் பயிர் ஏன்?",
    fertilizer: "உரம்",
    pesticide: "பரிந்துரைக்கப்பட்ட பூச்சிக்கொல்லி",
    irrigation: "நீர்ப்பாசன ஆலோசனை",
    expectedYield: "எதிர்பார்க்கப்படும் விளைச்சல்",
    farmingTips: "விவசாய குறிப்புகள்",
    aiSummary: "AI சுருக்கம்",

    listen: "கேட்க",
    stop: "நிறுத்து",
    voiceOff: "குரல் முடக்கம்",
    voiceDisabled:
      "சுயவிவர அமைப்புகளில் குரல் பதில்கள் முடக்கப்பட்டுள்ளன",
    noSummary: "சுருக்கம் கிடைக்கவில்லை",
  },

  "kn-IN": {
    pageTitle: "ಬೆಳೆ ಶಿಫಾರಸು",
    subtitle:
      "ನಿಮ್ಮ ಕೃಷಿ ಪರಿಸ್ಥಿತಿಗಳ ಆಧಾರದ ಮೇಲೆ AI ಬೆಳೆ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ.",

    soilType: "ಮಣ್ಣಿನ ಪ್ರಕಾರ",
    season: "ಋತು",
    rainfall: "ಮಳೆಯ ಪ್ರಮಾಣ (ಮಿಮೀ)",
    temperature: "ತಾಪಮಾನ (°C)",

    clay: "ಜೇಡಿ ಮಣ್ಣು",
    black: "ಕಪ್ಪು ಮಣ್ಣು",
    loamy: "ಲೋಮಿ ಮಣ್ಣು",
    sandy: "ಮರಳು ಮಣ್ಣು",

    kharif: "ಖರೀಫ್",
    rabi: "ರಬಿ",
    zaid: "ಜೈದ್",

    rainfallPlaceholder: "ಉದಾಹರಣೆ: 120",
    temperaturePlaceholder: "ಉದಾಹರಣೆ: 28",

    getRecommendation: "ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ",
    gettingRecommendation: "ಶಿಫಾರಸು ಸಿದ್ಧವಾಗುತ್ತಿದೆ...",

    emptyTitle: "AI ಬೆಳೆ ಸಲಹೆಗಾರ",
    emptyDescription:
      "ಮೇಲಿನ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಬೆಳೆ ಶಿಫಾರಸನ್ನು ಪಡೆಯಿರಿ.",

    fillAllFields: "ಎಲ್ಲ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
    invalidRainfall: "ಸರಿಯಾದ ಮಳೆಯ ಪ್ರಮಾಣ ನಮೂದಿಸಿ",
    invalidTemperature: "ಸರಿಯಾದ ತಾಪಮಾನ ನಮೂದಿಸಿ",
    recommendationReady: "AI ಶಿಫಾರಸು ಸಿದ್ಧವಾಗಿದೆ",
    recommendationFailed: "ಶಿಫಾರಸು ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ",

    confidence: "ವಿಶ್ವಾಸ ಮಟ್ಟ",
    whyCrop: "ಈ ಬೆಳೆ ಏಕೆ?",
    fertilizer: "ರಸಗೊಬ್ಬರ",
    pesticide: "ಶಿಫಾರಸು ಮಾಡಿದ ಕೀಟನಾಶಕ",
    irrigation: "ನೀರಾವರಿ ಸಲಹೆ",
    expectedYield: "ನಿರೀಕ್ಷಿತ ಇಳುವರಿ",
    farmingTips: "ಕೃಷಿ ಸಲಹೆಗಳು",
    aiSummary: "AI ಸಾರಾಂಶ",

    listen: "ಆಲಿಸಿ",
    stop: "ನಿಲ್ಲಿಸಿ",
    voiceOff: "ಧ್ವನಿ ಆಫ್",
    voiceDisabled:
      "ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಧ್ವನಿ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಆಫ್ ಆಗಿವೆ",
    noSummary: "ಸಾರಾಂಶ ಲಭ್ಯವಿಲ್ಲ",
  },

  "ml-IN": {
    pageTitle: "വിള ശുപാർശ",
    subtitle:
      "നിങ്ങളുടെ കൃഷി സാഹചര്യങ്ങളെ അടിസ്ഥാനമാക്കി AI വിള ശുപാർശകൾ നേടുക.",

    soilType: "മണ്ണിന്റെ തരം",
    season: "കാലം",
    rainfall: "മഴയുടെ അളവ് (മിമീ)",
    temperature: "താപനില (°C)",

    clay: "കളിമണ്ണ്",
    black: "കറുത്ത മണ്ണ്",
    loamy: "ലോമി മണ്ണ്",
    sandy: "മണൽമണ്ണ്",

    kharif: "ഖാരിഫ്",
    rabi: "റാബി",
    zaid: "സൈദ്",

    rainfallPlaceholder: "ഉദാഹരണം: 120",
    temperaturePlaceholder: "ഉദാഹരണം: 28",

    getRecommendation: "വിള ശുപാർശ നേടുക",
    gettingRecommendation: "ശുപാർശ തയ്യാറാക്കുന്നു...",

    emptyTitle: "AI വിള ഉപദേഷ്ടാവ്",
    emptyDescription:
      "മുകളിലെ വിവരങ്ങൾ നൽകി വിള ശുപാർശ നേടുക.",

    fillAllFields: "എല്ലാ വിവരങ്ങളും നൽകുക",
    invalidRainfall: "ശരിയായ മഴയുടെ അളവ് നൽകുക",
    invalidTemperature: "ശരിയായ താപനില നൽകുക",
    recommendationReady: "AI ശുപാർശ തയ്യാറായി",
    recommendationFailed: "ശുപാർശ ലഭിച്ചില്ല",

    confidence: "വിശ്വാസനില",
    whyCrop: "ഈ വിള എന്തുകൊണ്ട്?",
    fertilizer: "വളം",
    pesticide: "ശുപാർശ ചെയ്ത കീടനാശിനി",
    irrigation: "ജലസേചന നിർദേശം",
    expectedYield: "പ്രതീക്ഷിക്കുന്ന വിളവ്",
    farmingTips: "കൃഷി നിർദേശങ്ങൾ",
    aiSummary: "AI സംഗ്രഹം",

    listen: "കേൾക്കുക",
    stop: "നിർത്തുക",
    voiceOff: "ശബ്ദം ഓഫ്",
    voiceDisabled:
      "പ്രൊഫൈൽ ക്രമീകരണങ്ങളിൽ ശബ്ദ പ്രതികരണങ്ങൾ ഓഫ് ആണ്",
    noSummary: "സംഗ്രഹം ലഭ്യമല്ല",
  },
};

function CropRecommendation() {
  const [form, setForm] = useState({
    soilType: "Clay",
    season: "Kharif",
    rainfall: "",
    temperature: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const { language, voiceResponsesEnabled } =
    useSettings();

  const text = useMemo(() => {
    return translations[language] || translations["en-IN"];
  }, [language]);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setResult(null);
  }, [language]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      form.rainfall === "" ||
      form.temperature === ""
    ) {
      toast.error(text.fillAllFields);
      return;
    }

    const rainfall = Number(form.rainfall);
    const temperature = Number(form.temperature);

    if (
      !Number.isFinite(rainfall) ||
      rainfall < 0
    ) {
      toast.error(text.invalidRainfall);
      return;
    }

    if (
      !Number.isFinite(temperature) ||
      temperature < -20 ||
      temperature > 60
    ) {
      toast.error(text.invalidTemperature);
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      window.speechSynthesis?.cancel();

      const data = await recommendCrop({
        soilType: form.soilType,
        season: form.season,
        rainfall,
        temperature,
        language,
      });

      setResult(data);

      toast.success(text.recommendationReady);

      if (
        voiceResponsesEnabled &&
        data?.narration
      ) {
        speakText(data.narration, language);
      }
    } catch (error) {
      console.error(
        "Crop recommendation error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          text.recommendationFailed
      );
    } finally {
      setLoading(false);
    }
  };

  const handleListen = () => {
    if (!voiceResponsesEnabled) {
      toast.error(text.voiceDisabled);
      return;
    }

    if (!result?.narration) {
      toast.error(text.noSummary);
      return;
    }

    window.speechSynthesis?.cancel();
    speakText(result.narration, language);
  };

  const handleStopReading = () => {
    window.speechSynthesis?.cancel();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-4 sm:p-8">
      <h1 className="mb-3 text-center text-3xl font-bold text-green-700 sm:text-5xl">
        🌱 {text.pageTitle}
      </h1>

      <p className="mb-10 text-center text-gray-600">
        {text.subtitle}
      </p>

      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow-2xl sm:p-10">
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
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border-2 border-green-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {soilOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
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
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border-2 border-green-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {seasonOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="rainfall"
              className="font-semibold text-gray-700"
            >
              {text.rainfall}
            </label>

            <input
              id="rainfall"
              type="number"
              name="rainfall"
              min="0"
              step="any"
              value={form.rainfall}
              onChange={handleChange}
              placeholder={text.rainfallPlaceholder}
              className="mt-2 w-full rounded-xl border-2 border-green-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="temperature"
              className="font-semibold text-gray-700"
            >
              {text.temperature}
            </label>

            <input
              id="temperature"
              type="number"
              name="temperature"
              min="-20"
              max="60"
              step="any"
              value={form.temperature}
              onChange={handleChange}
              placeholder={
                text.temperaturePlaceholder
              }
              className="mt-2 w-full rounded-xl border-2 border-green-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? text.gettingRecommendation
            : `🌾 ${text.getRecommendation}`}
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && !result && (
        <div className="mt-16 text-center">
          <div className="text-7xl">🌱</div>

          <h2 className="mt-4 text-2xl font-bold text-gray-700">
            {text.emptyTitle}
          </h2>

          <p className="mt-2 text-gray-500">
            {text.emptyDescription}
          </p>
        </div>
      )}

      {!loading && result && (
        <div className="mx-auto mt-10 max-w-5xl space-y-6">
          <div className="rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
            <h2 className="text-3xl font-bold text-green-700 sm:text-4xl">
              🌾 {result.recommendedCrop}
            </h2>

            <p className="mt-4 text-lg font-semibold text-green-600 sm:text-xl">
              ⭐ {text.confidence}:{" "}
              {result.confidence}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-2xl font-bold text-green-700">
                📝 {text.whyCrop}
              </h3>

              <ul className="space-y-3">
                {Array.isArray(result.reason) &&
                  result.reason.map(
                    (item, index) => (
                      <li
                        key={`${index}-${item}`}
                        className="flex gap-2"
                      >
                        <span>✅</span>
                        <span>{item}</span>
                      </li>
                    )
                  )}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-2xl font-bold text-blue-700">
                🌿 {text.fertilizer}
              </h3>

              <p className="leading-8">
                {result.fertilizer}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-2xl font-bold text-red-700">
                🧪 {text.pesticide}
              </h3>

              <p className="leading-8">
                {result.pesticide}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-2xl font-bold text-cyan-700">
                💧 {text.irrigation}
              </h3>

              <p className="leading-8">
                {result.irrigation}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-2xl font-bold text-purple-700">
              📈 {text.expectedYield}
            </h3>

            <p className="text-lg">
              {result.expectedYield}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-2xl font-bold text-orange-700">
              💡 {text.farmingTips}
            </h3>

            <ul className="space-y-3">
              {Array.isArray(result.tips) &&
                result.tips.map(
                  (tip, index) => (
                    <li
                      key={`${index}-${tip}`}
                      className="flex gap-2"
                    >
                      <span>🌱</span>
                      <span>{tip}</span>
                    </li>
                  )
                )}
            </ul>
          </div>

          {result.narration && (
            <div className="rounded-2xl border-l-4 border-green-700 bg-green-100 p-6">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-bold">
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
                    onClick={handleStopReading}
                    className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
                  >
                    ⏹ {text.stop}
                  </button>
                </div>
              </div>

              <p className="whitespace-pre-wrap leading-8">
                {result.narration}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CropRecommendation;