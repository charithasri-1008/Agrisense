const DEFAULT_LANGUAGE = "en-IN";

export const detectLanguage = (text) => {
  const value = String(text || "");

  if (/[\u0C00-\u0C7F]/.test(value)) {
    return "te-IN";
  }

  if (/[\u0900-\u097F]/.test(value)) {
    return "hi-IN";
  }

  if (/[\u0B80-\u0BFF]/.test(value)) {
    return "ta-IN";
  }

  if (/[\u0C80-\u0CFF]/.test(value)) {
    return "kn-IN";
  }

  if (/[\u0D00-\u0D7F]/.test(value)) {
    return "ml-IN";
  }

  return DEFAULT_LANGUAGE;
};

const findVoice = (voices, language) => {
  if (!Array.isArray(voices) || voices.length === 0) {
    return null;
  }

  const normalizedLanguage = language.toLowerCase();
  const languageCode =
    normalizedLanguage.split("-")[0];

  const exactVoice = voices.find(
    (voice) =>
      voice.lang.toLowerCase() ===
      normalizedLanguage
  );

  if (exactVoice) {
    return exactVoice;
  }

  const matchingVoice = voices.find(
    (voice) =>
      voice.lang
        .toLowerCase()
        .startsWith(languageCode)
  );

  if (matchingVoice) {
    return matchingVoice;
  }

  return null;
};

export const speakText = (
  text,
  preferredLanguage = null
) => {
  const cleanText = String(text || "").trim();

  if (!cleanText) {
    console.warn("Speech text is empty.");
    return false;
  }

  if (
    !("speechSynthesis" in window) ||
    !("SpeechSynthesisUtterance" in window)
  ) {
    console.error(
      "Speech synthesis is not supported in this browser."
    );

    return false;
  }

  try {
    const detectedLanguage =
      detectLanguage(cleanText);

    const language =
      preferredLanguage || detectedLanguage;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(cleanText);

    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices =
      window.speechSynthesis.getVoices();

    const matchingVoice = findVoice(
      voices,
      language
    );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
      utterance.lang = matchingVoice.lang;
    } else {
      console.warn(
        `No installed voice found for ${language}. Browser default voice will be used.`
      );
    }

    utterance.onstart = () => {
      console.log("Speech started:", {
        textLanguage: language,
        selectedVoice:
          utterance.voice?.name ||
          "Browser default",
        selectedVoiceLanguage:
          utterance.voice?.lang ||
          utterance.lang,
      });
    };

    utterance.onend = () => {
      console.log("Speech completed.");
    };

    utterance.onerror = (event) => {
      if (
        event.error !== "canceled" &&
        event.error !== "interrupted"
      ) {
        console.error(
          "Speech synthesis failed:",
          event.error
        );
      }
    };

    window.speechSynthesis.speak(utterance);

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    return true;
  } catch (error) {
    console.error(
      "Unable to start speech:",
      error
    );

    return false;
  }
};

export const stopSpeaking = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

if (
  typeof window !== "undefined" &&
  "speechSynthesis" in window
) {
  window.speechSynthesis.getVoices();

  window.speechSynthesis.onvoiceschanged =
    () => {
      window.speechSynthesis.getVoices();
    };
}