const SETTINGS_KEY = "agrisense_settings";

export const DEFAULT_SETTINGS = {
  language: "en-IN",
  voiceInput: true,
  voiceResponses: true,
};

export const getSettings = () => {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);

    if (!savedSettings) {
      return DEFAULT_SETTINGS;
    }

    const parsedSettings = JSON.parse(savedSettings);

    return {
      ...DEFAULT_SETTINGS,
      ...parsedSettings,
    };
  } catch (error) {
    console.error("Unable to read settings:", error);

    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  try {
    const finalSettings = {
      ...DEFAULT_SETTINGS,
      ...settings,
    };

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(finalSettings)
    );
  } catch (error) {
    console.error("Unable to save settings:", error);
  }
};

export const clearSettings = () => {
  localStorage.removeItem(SETTINGS_KEY);
};

export const getLanguage = () => {
  return getSettings().language;
};

export const isVoiceInputEnabled = () => {
  return getSettings().voiceInput;
};

export const isVoiceResponseEnabled = () => {
  return getSettings().voiceResponses;
};