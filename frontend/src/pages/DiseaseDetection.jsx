import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import { detectDisease } from "../services/diseaseService";
import LoadingSpinner from "../components/LoadingSpinner";
import { speakText } from "../utils/speech";
import { useSettings } from "../context/SettingsContext";

const translations = {
  "en-IN": {
    pageTitle: "AI Disease Detection",
    subtitle:
      "Upload a crop leaf image and let AI detect possible diseases.",

    uploadLabel: "Upload Crop Image",
    previewAlt: "Selected crop preview",

    detectDisease: "Detect Disease",
    detectingDisease: "Analyzing Image...",

    emptyTitle: "AI Plant Doctor",
    emptyDescription:
      "Upload a crop leaf image to detect possible diseases.",

    resultTitle: "Detection Result",
    disease: "Disease",
    confidence: "Confidence",
    cause: "Cause",
    symptoms: "Symptoms",
    treatment: "Treatment",
    prevention: "Prevention",
    aiSummary: "Farmer Recommendation",

    listen: "Listen",
    stop: "Stop",
    voiceOff: "Voice Off",

    selectImage: "Please select a crop image",
    invalidImage:
      "Please select a valid image file",
    largeImage:
      "Image size must be below 5 MB",
    analysisCompleted:
      "Disease analysis completed",
    detectionFailed:
      "Disease detection failed",
    noSummary:
      "No voice summary is available",
    voiceDisabled:
      "Voice responses are turned off in Profile settings",
  },

  "te-IN": {
    pageTitle: "AI పంట వ్యాధి గుర్తింపు",
    subtitle:
      "పంట ఆకు చిత్రాన్ని అప్‌లోడ్ చేసి సంభావ్య వ్యాధులను AI ద్వారా గుర్తించండి.",

    uploadLabel: "పంట చిత్రాన్ని అప్‌లోడ్ చేయండి",
    previewAlt: "ఎంచుకున్న పంట చిత్రం",

    detectDisease: "వ్యాధిని గుర్తించండి",
    detectingDisease: "చిత్రాన్ని పరిశీలిస్తోంది...",

    emptyTitle: "AI మొక్కల వైద్యుడు",
    emptyDescription:
      "పంట ఆకులో ఉన్న వ్యాధిని గుర్తించడానికి చిత్రాన్ని అప్‌లోడ్ చేయండి.",

    resultTitle: "గుర్తింపు ఫలితం",
    disease: "వ్యాధి",
    confidence: "నమ్మక స్థాయి",
    cause: "కారణం",
    symptoms: "లక్షణాలు",
    treatment: "చికిత్స",
    prevention: "నివారణ",
    aiSummary: "రైతు సిఫార్సు",

    listen: "వినండి",
    stop: "ఆపండి",
    voiceOff: "వాయిస్ ఆఫ్",

    selectImage:
      "దయచేసి పంట చిత్రాన్ని ఎంచుకోండి",
    invalidImage:
      "సరైన ఇమేజ్ ఫైల్‌ను ఎంచుకోండి",
    largeImage:
      "చిత్ర పరిమాణం 5 MB కంటే తక్కువగా ఉండాలి",
    analysisCompleted:
      "వ్యాధి విశ్లేషణ పూర్తైంది",
    detectionFailed:
      "వ్యాధిని గుర్తించడం విఫలమైంది",
    noSummary:
      "వినడానికి సారాంశం అందుబాటులో లేదు",
    voiceDisabled:
      "ప్రొఫైల్ సెట్టింగ్స్‌లో వాయిస్ స్పందనలు ఆఫ్‌లో ఉన్నాయి",
  },

  "hi-IN": {
    pageTitle: "AI फसल रोग पहचान",
    subtitle:
      "फसल की पत्ती की तस्वीर अपलोड करें और AI से संभावित रोग पहचानें।",

    uploadLabel: "फसल की तस्वीर अपलोड करें",
    previewAlt: "चुनी गई फसल की तस्वीर",

    detectDisease: "रोग पहचानें",
    detectingDisease: "तस्वीर का विश्लेषण हो रहा है...",

    emptyTitle: "AI पौधा चिकित्सक",
    emptyDescription:
      "फसल रोग पहचानने के लिए पत्ती की तस्वीर अपलोड करें।",

    resultTitle: "पहचान परिणाम",
    disease: "रोग",
    confidence: "विश्वास स्तर",
    cause: "कारण",
    symptoms: "लक्षण",
    treatment: "उपचार",
    prevention: "रोकथाम",
    aiSummary: "किसान सुझाव",

    listen: "सुनें",
    stop: "रोकें",
    voiceOff: "आवाज़ बंद",

    selectImage:
      "कृपया फसल की तस्वीर चुनें",
    invalidImage:
      "कृपया सही इमेज फ़ाइल चुनें",
    largeImage:
      "तस्वीर का आकार 5 MB से कम होना चाहिए",
    analysisCompleted:
      "रोग विश्लेषण पूरा हुआ",
    detectionFailed:
      "रोग पहचान विफल रही",
    noSummary:
      "कोई आवाज़ सारांश उपलब्ध नहीं है",
    voiceDisabled:
      "प्रोफाइल सेटिंग्स में आवाज़ प्रतिक्रियाएं बंद हैं",
  },

  "ta-IN": {
    pageTitle: "AI பயிர் நோய் கண்டறிதல்",
    subtitle:
      "பயிர் இலைப் படத்தை பதிவேற்றி சாத்தியமான நோய்களை AI மூலம் கண்டறியுங்கள்.",

    uploadLabel: "பயிர் படத்தை பதிவேற்றவும்",
    previewAlt: "தேர்ந்தெடுக்கப்பட்ட பயிர் படம்",

    detectDisease: "நோயைக் கண்டறியவும்",
    detectingDisease: "படம் ஆய்வு செய்யப்படுகிறது...",

    emptyTitle: "AI தாவர மருத்துவர்",
    emptyDescription:
      "பயிர் நோயைக் கண்டறிய இலைப் படத்தை பதிவேற்றவும்.",

    resultTitle: "கண்டறிதல் முடிவு",
    disease: "நோய்",
    confidence: "நம்பிக்கை அளவு",
    cause: "காரணம்",
    symptoms: "அறிகுறிகள்",
    treatment: "சிகிச்சை",
    prevention: "தடுப்பு",
    aiSummary: "விவசாயி பரிந்துரை",

    listen: "கேட்க",
    stop: "நிறுத்து",
    voiceOff: "குரல் முடக்கம்",

    selectImage:
      "பயிர் படத்தைத் தேர்ந்தெடுக்கவும்",
    invalidImage:
      "சரியான படக் கோப்பைத் தேர்ந்தெடுக்கவும்",
    largeImage:
      "படத்தின் அளவு 5 MB-க்கு கீழ் இருக்க வேண்டும்",
    analysisCompleted:
      "நோய் ஆய்வு முடிந்தது",
    detectionFailed:
      "நோயைக் கண்டறிய முடியவில்லை",
    noSummary:
      "குரல் சுருக்கம் கிடைக்கவில்லை",
    voiceDisabled:
      "சுயவிவர அமைப்புகளில் குரல் பதில்கள் முடக்கப்பட்டுள்ளன",
  },

  "kn-IN": {
    pageTitle: "AI ಬೆಳೆ ರೋಗ ಪತ್ತೆ",
    subtitle:
      "ಬೆಳೆ ಎಲೆಯ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ AI ಮೂಲಕ ಸಾಧ್ಯವಾದ ರೋಗಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ.",

    uploadLabel: "ಬೆಳೆ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    previewAlt: "ಆಯ್ಕೆ ಮಾಡಿದ ಬೆಳೆ ಚಿತ್ರ",

    detectDisease: "ರೋಗ ಪತ್ತೆ ಮಾಡಿ",
    detectingDisease: "ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",

    emptyTitle: "AI ಸಸ್ಯ ವೈದ್ಯ",
    emptyDescription:
      "ಬೆಳೆ ರೋಗ ಪತ್ತೆ ಮಾಡಲು ಎಲೆಯ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",

    resultTitle: "ಪತ್ತೆ ಫಲಿತಾಂಶ",
    disease: "ರೋಗ",
    confidence: "ವಿಶ್ವಾಸ ಮಟ್ಟ",
    cause: "ಕಾರಣ",
    symptoms: "ಲಕ್ಷಣಗಳು",
    treatment: "ಚಿಕಿತ್ಸೆ",
    prevention: "ತಡೆಗಟ್ಟುವಿಕೆ",
    aiSummary: "ರೈತ ಶಿಫಾರಸು",

    listen: "ಆಲಿಸಿ",
    stop: "ನಿಲ್ಲಿಸಿ",
    voiceOff: "ಧ್ವನಿ ಆಫ್",

    selectImage:
      "ದಯವಿಟ್ಟು ಬೆಳೆ ಚಿತ್ರವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    invalidImage:
      "ಸರಿಯಾದ ಚಿತ್ರ ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ",
    largeImage:
      "ಚಿತ್ರದ ಗಾತ್ರ 5 MB ಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು",
    analysisCompleted:
      "ರೋಗ ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
    detectionFailed:
      "ರೋಗ ಪತ್ತೆ ವಿಫಲವಾಗಿದೆ",
    noSummary:
      "ಧ್ವನಿ ಸಾರಾಂಶ ಲಭ್ಯವಿಲ್ಲ",
    voiceDisabled:
      "ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಧ್ವನಿ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಆಫ್ ಆಗಿವೆ",
  },

  "ml-IN": {
    pageTitle: "AI വിള രോഗനിർണയം",
    subtitle:
      "വിളയുടെ ഇലയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്ത് സാധ്യതയുള്ള രോഗങ്ങൾ AI ഉപയോഗിച്ച് കണ്ടെത്തുക.",

    uploadLabel: "വിളയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക",
    previewAlt: "തിരഞ്ഞെടുത്ത വിളയുടെ ചിത്രം",

    detectDisease: "രോഗം കണ്ടെത്തുക",
    detectingDisease: "ചിത്രം പരിശോധിക്കുന്നു...",

    emptyTitle: "AI സസ്യ ഡോക്ടർ",
    emptyDescription:
      "വിളയിലെ രോഗം കണ്ടെത്താൻ ഇലയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക.",

    resultTitle: "രോഗനിർണയ ഫലം",
    disease: "രോഗം",
    confidence: "വിശ്വാസനില",
    cause: "കാരണം",
    symptoms: "ലക്ഷണങ്ങൾ",
    treatment: "ചികിത്സ",
    prevention: "പ്രതിരോധം",
    aiSummary: "കർഷക നിർദേശം",

    listen: "കേൾക്കുക",
    stop: "നിർത്തുക",
    voiceOff: "ശബ്ദം ഓഫ്",

    selectImage:
      "ദയവായി വിളയുടെ ചിത്രം തിരഞ്ഞെടുക്കുക",
    invalidImage:
      "ശരിയായ ചിത്രം തിരഞ്ഞെടുക്കുക",
    largeImage:
      "ചിത്രത്തിന്റെ വലുപ്പം 5 MB-ൽ താഴെയായിരിക്കണം",
    analysisCompleted:
      "രോഗ വിശകലനം പൂർത്തിയായി",
    detectionFailed:
      "രോഗനിർണയം പരാജയപ്പെട്ടു",
    noSummary:
      "ശബ്ദ സംഗ്രഹം ലഭ്യമല്ല",
    voiceDisabled:
      "പ്രൊഫൈൽ ക്രമീകരണങ്ങളിൽ ശബ്ദ പ്രതികരണങ്ങൾ ഓഫ് ആണ്",
  },
};

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const getConfidenceValue = (value) => {
  const match = String(value || "").match(/\d+(?:\.\d+)?/);

  if (!match) {
    return 0;
  }

  const numericValue = Number(match[0]);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(100, numericValue));
};

const getConfidenceStyles = (value) => {
  const confidence = getConfidenceValue(value);

  if (confidence >= 90) {
    return {
      labelClass: "text-green-700",
      barClass: "bg-green-600",
      trackClass: "bg-green-100",
      badgeClass:
        "border-green-200 bg-green-100 text-green-800",
    };
  }

  if (confidence >= 70) {
    return {
      labelClass: "text-yellow-700",
      barClass: "bg-yellow-500",
      trackClass: "bg-yellow-100",
      badgeClass:
        "border-yellow-200 bg-yellow-100 text-yellow-800",
    };
  }

  return {
    labelClass: "text-red-700",
    barClass: "bg-red-500",
    trackClass: "bg-red-100",
    badgeClass:
      "border-red-200 bg-red-100 text-red-800",
  };
};

function DiseaseDetection() {
  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const {
    language,
    voiceResponsesEnabled,
  } = useSettings();

  const text = useMemo(() => {
    return (
      translations[language] ||
      translations["en-IN"]
    );
  }, [language]);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setResult(null);
  }, [language]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      window.speechSynthesis?.cancel();
    };
  }, [preview]);

  const handleImage = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      toast.error(text.invalidImage);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(text.largeImage);
      event.target.value = "";
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setImage(file);
    setPreview(previewUrl);
    setResult(null);

    window.speechSynthesis?.cancel();
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error(text.selectImage);
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      window.speechSynthesis?.cancel();

      const response =
        await detectDisease(
          image,
          language
        );

      const diseaseResult =
        response?.result ||
        response;

      setResult(diseaseResult);

      toast.success(
        text.analysisCompleted
      );

      if (
        voiceResponsesEnabled &&
        diseaseResult?.narration
      ) {
        speakText(
          diseaseResult.narration,
          language
        );
      }
    } catch (error) {
      console.error(
        "Disease detection error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          text.detectionFailed
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

    speakText(
      result.narration,
      language
    );
  };

  const handleStopReading = () => {
    window.speechSynthesis?.cancel();
  };

  const confidenceValue =
    getConfidenceValue(result?.confidence);

  const confidenceStyles =
    getConfidenceStyles(result?.confidence);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-4 sm:p-8">
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <h1 className="mb-3 text-center text-3xl font-bold text-green-700 sm:text-5xl">
        🌿 {text.pageTitle}
      </h1>

      <p className="mb-10 text-center text-gray-600">
        {text.subtitle}
      </p>

      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow-2xl sm:p-10">
        <label
          htmlFor="cropImage"
          className="mb-3 block font-semibold text-gray-700"
        >
          {text.uploadLabel}
        </label>

        <input
          id="cropImage"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleImage}
          disabled={loading}
          className="w-full rounded-xl border-2 border-green-300 p-3 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {preview && (
          <div className="mt-8 flex justify-center">
            <img
              src={preview}
              alt={text.previewAlt}
              className="h-72 w-72 rounded-2xl border-4 border-green-200 object-cover shadow-lg transition duration-500 hover:scale-[1.02] hover:shadow-2xl"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={loading || !image}
          className="mt-8 w-full rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? `⏳ ${text.detectingDisease}`
            : `🔍 ${text.detectDisease}`}
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && !result && (
        <div className="mt-16 text-center">
          <div className="text-7xl">
            🌱
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-700">
            {text.emptyTitle}
          </h2>

          <p className="mt-2 text-gray-500">
            {text.emptyDescription}
          </p>
        </div>
      )}

      {!loading && result && (
        <div className="mx-auto mt-10 max-w-3xl animate-[fadeIn_500ms_ease-out] rounded-3xl bg-white p-5 shadow-2xl sm:p-10">
          <h2 className="mb-8 text-center text-3xl font-bold text-green-700 sm:text-4xl">
            🌾 {text.resultTitle}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-green-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="mb-3 font-bold text-green-700">
                🍃 {text.disease}
              </h3>

              <span className="inline-flex rounded-full border border-green-200 bg-white px-4 py-2 font-semibold text-green-800 shadow-sm">
                🦠 {result.disease}
              </span>
            </div>

            <div className="rounded-2xl bg-blue-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h3 className="font-bold text-blue-700">
                  📊 {text.confidence}
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-sm font-bold ${confidenceStyles.badgeClass}`}
                >
                  {result.confidence}
                </span>
              </div>

              <div
                className={`h-3 overflow-hidden rounded-full ${confidenceStyles.trackClass}`}
                aria-label={`${text.confidence}: ${result.confidence}`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${confidenceStyles.barClass}`}
                  style={{
                    width: `${confidenceValue}%`,
                  }}
                />
              </div>

              <p
                className={`mt-3 text-sm font-semibold ${confidenceStyles.labelClass}`}
              >
                {confidenceValue >= 90
                  ? "High confidence"
                  : confidenceValue >= 70
                    ? "Moderate confidence"
                    : "Low confidence"}
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-5 transition duration-300 hover:shadow-lg md:col-span-2">
              <h3 className="mb-2 font-bold text-yellow-700">
                🔍 {text.cause}
              </h3>

              <p className="whitespace-pre-wrap leading-8">
                {result.cause}
              </p>
            </div>

            {result.symptoms && (
              <div className="rounded-2xl bg-orange-50 p-5 transition duration-300 hover:shadow-lg md:col-span-2">
                <h3 className="mb-2 font-bold text-orange-700">
                  🩺 {text.symptoms}
                </h3>

                {Array.isArray(
                  result.symptoms
                ) ? (
                  <ul className="space-y-2">
                    {result.symptoms.map(
                      (symptom, index) => (
                        <li
                          key={`${index}-${symptom}`}
                          className="flex gap-2"
                        >
                          <span>•</span>
                          <span>
                            {symptom}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="whitespace-pre-wrap leading-8">
                    {result.symptoms}
                  </p>
                )}
              </div>
            )}

            <div className="rounded-2xl bg-red-50 p-5 transition duration-300 hover:shadow-lg md:col-span-2">
              <h3 className="mb-2 font-bold text-red-700">
                💊 {text.treatment}
              </h3>

              <p className="whitespace-pre-wrap leading-8">
                {result.treatment}
              </p>
            </div>

            <div className="rounded-2xl bg-green-100 p-5 transition duration-300 hover:shadow-lg md:col-span-2">
              <h3 className="mb-2 font-bold text-green-800">
                🛡 {text.prevention}
              </h3>

              <p className="whitespace-pre-wrap leading-8">
                {result.prevention}
              </p>
            </div>
          </div>

          {result.narration && (
            <div className="mt-6 rounded-2xl border-l-4 border-green-700 bg-green-100 p-5 shadow-inner transition duration-300 hover:shadow-lg">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-bold text-green-800">
                  🌾 {text.aiSummary}
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

export default DiseaseDetection;