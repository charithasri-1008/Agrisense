import {
  useEffect,
  useRef,
  useState,
} from "react";

import toast from "react-hot-toast";

import { askAI } from "../services/chatService";
import LoadingSpinner from "../components/LoadingSpinner";

import {
  speakText,
  stopSpeaking,
} from "../utils/speech";

const languages = [
  {
    label: "English",
    speech: "en-IN",
  },
  {
    label: "తెలుగు",
    speech: "te-IN",
  },
  {
    label: "हिन्दी",
    speech: "hi-IN",
  },
  {
    label: "தமிழ்",
    speech: "ta-IN",
  },
  {
    label: "ಕನ್ನಡ",
    speech: "kn-IN",
  },
  {
    label: "മലയാളം",
    speech: "ml-IN",
  },
];

const translations = {
  "en-IN": {
    title: "AgriSense AI Assistant",
    subtitle:
      "Ask any agriculture-related question using text or voice.",

    selectLanguage: "Select Language",
    askQuestion: "Ask Your Question",

    placeholder:
      "Example: My tomato leaves are turning yellow. What should I do?",

    voiceInput: "Voice Input",
    listening: "Listening...",
    clear: "Clear",
    askAI: "Ask AI",
    asking: "Getting Answer...",

    emptyTitle:
      "Smart Agriculture Assistant",

    emptyDescription:
      "Ask questions about crops, diseases, fertilizers, irrigation and farming practices.",

    recommendation:
      "AI Recommendation",

    listen: "Listen",
    stop: "Stop",

    enterQuestion:
      "Please enter your question.",

    responseReady:
      "AI response is ready.",

    responseFailed:
      "Unable to get AI response.",

    voiceSuccess:
      "Voice converted to text.",

    voiceFailed:
      "Voice recognition failed.",

    voiceUnsupported:
      "Speech recognition is not supported in this browser.",

    startSpeaking:
      "Start speaking now.",
  },

  "te-IN": {
    title: "AgriSense AI సహాయకుడు",

    subtitle:
      "వ్యవసాయానికి సంబంధించిన ప్రశ్నలను టెక్స్ట్ లేదా వాయిస్ ద్వారా అడగండి.",

    selectLanguage:
      "భాషను ఎంచుకోండి",

    askQuestion:
      "మీ ప్రశ్నను అడగండి",

    placeholder:
      "ఉదాహరణ: నా టమాట ఆకులు పసుపు రంగులోకి మారుతున్నాయి. ఏమి చేయాలి?",

    voiceInput:
      "వాయిస్ ఇన్‌పుట్",

    listening:
      "వింటోంది...",

    clear:
      "తొలగించండి",

    askAI:
      "AIని అడగండి",

    asking:
      "సమాధానం పొందుతోంది...",

    emptyTitle:
      "స్మార్ట్ వ్యవసాయ సహాయకుడు",

    emptyDescription:
      "పంటలు, వ్యాధులు, ఎరువులు, నీటిపారుదల మరియు వ్యవసాయ పద్ధతుల గురించి అడగండి.",

    recommendation:
      "AI సలహా",

    listen:
      "వినండి",

    stop:
      "ఆపండి",

    enterQuestion:
      "దయచేసి మీ ప్రశ్నను నమోదు చేయండి.",

    responseReady:
      "AI సమాధానం సిద్ధంగా ఉంది.",

    responseFailed:
      "AI సమాధానాన్ని పొందలేకపోయాము.",

    voiceSuccess:
      "వాయిస్ టెక్స్ట్‌గా మార్చబడింది.",

    voiceFailed:
      "వాయిస్ గుర్తింపు విఫలమైంది.",

    voiceUnsupported:
      "ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు అందుబాటులో లేదు.",

    startSpeaking:
      "ఇప్పుడు మాట్లాడండి.",
  },

  "hi-IN": {
    title: "AgriSense AI सहायक",

    subtitle:
      "कृषि से संबंधित प्रश्न टेक्स्ट या आवाज़ द्वारा पूछें।",

    selectLanguage:
      "भाषा चुनें",

    askQuestion:
      "अपना प्रश्न पूछें",

    placeholder:
      "उदाहरण: मेरे टमाटर के पत्ते पीले हो रहे हैं। क्या करूँ?",

    voiceInput:
      "वॉइस इनपुट",

    listening:
      "सुन रहा है...",

    clear:
      "साफ़ करें",

    askAI:
      "AI से पूछें",

    asking:
      "उत्तर प्राप्त हो रहा है...",

    emptyTitle:
      "स्मार्ट कृषि सहायक",

    emptyDescription:
      "फसल, रोग, उर्वरक, सिंचाई और खेती के तरीकों के बारे में पूछें।",

    recommendation:
      "AI सुझाव",

    listen:
      "सुनें",

    stop:
      "रोकें",

    enterQuestion:
      "कृपया अपना प्रश्न दर्ज करें।",

    responseReady:
      "AI उत्तर तैयार है।",

    responseFailed:
      "AI उत्तर प्राप्त नहीं हो सका।",

    voiceSuccess:
      "आवाज़ को टेक्स्ट में बदल दिया गया।",

    voiceFailed:
      "वॉइस पहचान विफल रही।",

    voiceUnsupported:
      "इस ब्राउज़र में वॉइस पहचान उपलब्ध नहीं है।",

    startSpeaking:
      "अब बोलना शुरू करें।",
  },

  "ta-IN": {
    title: "AgriSense AI உதவியாளர்",

    subtitle:
      "விவசாயம் தொடர்பான கேள்விகளை உரை அல்லது குரல் மூலம் கேளுங்கள்.",

    selectLanguage:
      "மொழியைத் தேர்ந்தெடுக்கவும்",

    askQuestion:
      "உங்கள் கேள்வியைக் கேளுங்கள்",

    placeholder:
      "உதாரணம்: என் தக்காளி இலைகள் மஞ்சளாக மாறுகின்றன. என்ன செய்ய வேண்டும்?",

    voiceInput:
      "குரல் உள்ளீடு",

    listening:
      "கேட்கிறது...",

    clear:
      "அழிக்கவும்",

    askAI:
      "AIயிடம் கேளுங்கள்",

    asking:
      "பதில் பெறப்படுகிறது...",

    emptyTitle:
      "ஸ்மார்ட் விவசாய உதவியாளர்",

    emptyDescription:
      "பயிர்கள், நோய்கள், உரங்கள், நீர்ப்பாசனம் மற்றும் விவசாய முறைகள் பற்றி கேளுங்கள்.",

    recommendation:
      "AI பரிந்துரை",

    listen:
      "கேளுங்கள்",

    stop:
      "நிறுத்து",

    enterQuestion:
      "உங்கள் கேள்வியை உள்ளிடவும்.",

    responseReady:
      "AI பதில் தயாராக உள்ளது.",

    responseFailed:
      "AI பதிலைப் பெற முடியவில்லை.",

    voiceSuccess:
      "குரல் உரையாக மாற்றப்பட்டது.",

    voiceFailed:
      "குரல் அங்கீகாரம் தோல்வியடைந்தது.",

    voiceUnsupported:
      "இந்த உலாவியில் குரல் அங்கீகாரம் இல்லை.",

    startSpeaking:
      "இப்போது பேசத் தொடங்குங்கள்.",
  },

  "kn-IN": {
    title: "AgriSense AI ಸಹಾಯಕ",

    subtitle:
      "ಕೃಷಿಗೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಶ್ನೆಗಳನ್ನು ಪಠ್ಯ ಅಥವಾ ಧ್ವನಿಯ ಮೂಲಕ ಕೇಳಿ.",

    selectLanguage:
      "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",

    askQuestion:
      "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ",

    placeholder:
      "ಉದಾಹರಣೆ: ನನ್ನ ಟೊಮ್ಯಾಟೊ ಎಲೆಗಳು ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗುತ್ತಿವೆ. ನಾನು ಏನು ಮಾಡಬೇಕು?",

    voiceInput:
      "ಧ್ವನಿ ಇನ್‌ಪುಟ್",

    listening:
      "ಕೇಳಲಾಗುತ್ತಿದೆ...",

    clear:
      "ಅಳಿಸಿ",

    askAI:
      "AIಗೆ ಕೇಳಿ",

    asking:
      "ಉತ್ತರ ಪಡೆಯಲಾಗುತ್ತಿದೆ...",

    emptyTitle:
      "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯಕ",

    emptyDescription:
      "ಬೆಳೆಗಳು, ರೋಗಗಳು, ರಸಗೊಬ್ಬರಗಳು, ನೀರಾವರಿ ಮತ್ತು ಕೃಷಿ ವಿಧಾನಗಳ ಬಗ್ಗೆ ಕೇಳಿ.",

    recommendation:
      "AI ಸಲಹೆ",

    listen:
      "ಕೇಳಿ",

    stop:
      "ನಿಲ್ಲಿಸಿ",

    enterQuestion:
      "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ.",

    responseReady:
      "AI ಉತ್ತರ ಸಿದ್ಧವಾಗಿದೆ.",

    responseFailed:
      "AI ಉತ್ತರವನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",

    voiceSuccess:
      "ಧ್ವನಿಯನ್ನು ಪಠ್ಯಕ್ಕೆ ಪರಿವರ್ತಿಸಲಾಗಿದೆ.",

    voiceFailed:
      "ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ವಿಫಲವಾಗಿದೆ.",

    voiceUnsupported:
      "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ.",

    startSpeaking:
      "ಈಗ ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಿ.",
  },

  "ml-IN": {
    title: "AgriSense AI സഹായി",

    subtitle:
      "കൃഷിയുമായി ബന്ധപ്പെട്ട ചോദ്യങ്ങൾ എഴുത്തിലൂടെയോ ശബ്ദത്തിലൂടെയോ ചോദിക്കുക.",

    selectLanguage:
      "ഭാഷ തിരഞ്ഞെടുക്കുക",

    askQuestion:
      "നിങ്ങളുടെ ചോദ്യം ചോദിക്കുക",

    placeholder:
      "ഉദാഹരണം: എന്റെ തക്കാളി ഇലകൾ മഞ്ഞനിറമാകുന്നു. ഞാൻ എന്ത് ചെയ്യണം?",

    voiceInput:
      "വോയ്സ് ഇൻപുട്ട്",

    listening:
      "കേൾക്കുന്നു...",

    clear:
      "മായ്ക്കുക",

    askAI:
      "AIയോട് ചോദിക്കുക",

    asking:
      "ഉത്തരം ലഭിക്കുന്നു...",

    emptyTitle:
      "സ്മാർട്ട് കാർഷിക സഹായി",

    emptyDescription:
      "വിളകൾ, രോഗങ്ങൾ, വളങ്ങൾ, ജലസേചനം, കൃഷിരീതികൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക.",

    recommendation:
      "AI നിർദ്ദേശം",

    listen:
      "കേൾക്കുക",

    stop:
      "നിർത്തുക",

    enterQuestion:
      "നിങ്ങളുടെ ചോദ്യം നൽകുക.",

    responseReady:
      "AI ഉത്തരം തയ്യാറായി.",

    responseFailed:
      "AI ഉത്തരം ലഭ്യമാക്കാനായില്ല.",

    voiceSuccess:
      "ശബ്ദം എഴുത്താക്കി മാറ്റി.",

    voiceFailed:
      "ശബ്ദ തിരിച്ചറിയൽ പരാജയപ്പെട്ടു.",

    voiceUnsupported:
      "ഈ ബ്രൗസറിൽ ശബ്ദ തിരിച്ചറിയൽ ലഭ്യമല്ല.",

    startSpeaking:
      "ഇപ്പോൾ സംസാരിക്കുക.",
  },
};

function Chatbot() {
  const [message, setMessage] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [listening, setListening] =
    useState(false);

  const [language, setLanguage] =
    useState({
      label: "English",
      speech: "en-IN",
    });

  const recognitionRef =
    useRef(null);

  const text =
    translations[language.speech] ||
    translations["en-IN"];

  useEffect(() => {
    return () => {
      stopSpeaking();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Recognition already stopped.
        }
      }
    };
  }, []);

  const handleLanguageChange = (
    event
  ) => {
    const selectedLanguage =
      languages.find(
        (item) =>
          item.speech ===
          event.target.value
      );

    if (!selectedLanguage) {
      return;
    }

    setLanguage(selectedLanguage);
    setMessage("");
    setAnswer("");
    stopSpeaking();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition already stopped.
      }
    }

    setListening(false);
  };

  const startListening = () => {
    if (loading || listening) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        text.voiceUnsupported
      );
      return;
    }

    stopSpeaking();

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      language.speech;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current =
      recognition;

    recognition.onstart = () => {
      setListening(true);

      toast.success(
        text.startSpeaking
      );
    };

    recognition.onresult = (
      event
    ) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim();

      if (!transcript) {
        return;
      }

      setMessage((previous) =>
        previous.trim()
          ? `${previous.trim()} ${transcript}`
          : transcript
      );

      toast.success(
        text.voiceSuccess
      );
    };

    recognition.onerror = (
      event
    ) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      if (
        event.error !== "aborted" &&
        event.error !== "no-speech"
      ) {
        toast.error(
          text.voiceFailed
        );
      }

      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Unable to start voice recognition:",
        error
      );

      setListening(false);

      toast.error(
        text.voiceFailed
      );
    }
  };

  const handleAsk = async () => {
    const cleanMessage =
      message.trim();

    if (!cleanMessage) {
      toast.error(
        text.enterQuestion
      );

      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      stopSpeaking();

      const response =
        await askAI(
          cleanMessage,
          language.speech
        );

      const receivedAnswer =
        response?.answer?.trim();

      if (!receivedAnswer) {
        throw new Error(
          text.responseFailed
        );
      }

      setAnswer(
        receivedAnswer
      );

      // Response vachina ventane
      // selected language lo automatic ga chadivuthundi.
      speakText(
        receivedAnswer,
        language.speech
      );

      toast.success(
        text.responseReady
      );
    } catch (error) {
      console.error(
        "Chatbot error:",
        error?.response?.data ||
          error?.message
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          text.responseFailed
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessage("");
    setAnswer("");
    stopSpeaking();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition already stopped.
      }
    }

    setListening(false);
  };

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-4 md:p-8">
      <h1 className="mb-3 text-center text-4xl font-bold text-green-700 md:text-5xl">
        🤖 {text.title}
      </h1>

      <p className="mb-10 text-center text-gray-600">
        {text.subtitle}
      </p>

      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-2xl md:p-10">
        <label
          htmlFor="chat-language"
          className="mb-3 block text-lg font-semibold text-gray-700"
        >
          🌐 {text.selectLanguage}
        </label>

        <select
          id="chat-language"
          value={language.speech}
          onChange={
            handleLanguageChange
          }
          disabled={loading}
          className="mb-6 w-full rounded-xl border-2 border-green-300 bg-white p-3 outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          {languages.map(
            (item) => (
              <option
                key={item.speech}
                value={item.speech}
              >
                {item.label}
              </option>
            )
          )}
        </select>

        <label
          htmlFor="chat-question"
          className="mb-3 block text-lg font-semibold text-gray-700"
        >
          🌾 {text.askQuestion}
        </label>

        <textarea
          id="chat-question"
          rows={6}
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
          onKeyDown={handleKeyDown}
          placeholder={
            text.placeholder
          }
          disabled={loading}
          maxLength={2000}
          className="w-full resize-none rounded-2xl border-2 border-green-300 p-5 outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        />

        <div className="mt-2 text-right text-sm text-gray-400">
          {message.length}/2000
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={
              startListening
            }
            disabled={
              listening || loading
            }
            className={`rounded-xl py-4 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              listening
                ? "bg-red-500"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {listening
              ? `🎙 ${text.listening}`
              : `🎤 ${text.voiceInput}`}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="rounded-xl bg-gray-500 py-4 font-bold text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            🗑 {text.clear}
          </button>

          <button
            type="button"
            onClick={handleAsk}
            disabled={
              loading ||
              !message.trim()
            }
            className="rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {loading
              ? `⏳ ${text.asking}`
              : `🤖 ${text.askAI}`}
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && !answer && (
        <div className="mt-16 text-center">
          <div className="text-7xl">
            🌾
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-700">
            {text.emptyTitle}
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-gray-500">
            {
              text.emptyDescription
            }
          </p>
        </div>
      )}

      {!loading && answer && (
        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="flex flex-col items-center justify-between gap-4 bg-green-700 p-6 text-white md:flex-row">
            <h2 className="text-2xl font-bold md:text-3xl">
              🤖{" "}
              {text.recommendation}
            </h2>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  speakText(
                    answer,
                    language.speech
                  )
                }
                className="rounded-lg bg-white px-5 py-2 font-semibold text-green-700 transition hover:bg-green-100"
              >
                🔊 {text.listen}
              </button>

              <button
                type="button"
                onClick={
                  stopSpeaking
                }
                className="rounded-lg bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
              >
                ⏹ {text.stop}
              </button>
            </div>
          </div>

          <div className="p-5 md:p-8">
            <div className="whitespace-pre-wrap rounded-xl border-l-4 border-green-600 bg-green-50 p-6 leading-8 text-gray-800">
              {answer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;