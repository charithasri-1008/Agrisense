import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
} from "../utils/settings";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      return {
        ...DEFAULT_SETTINGS,
        ...getSettings(),
      };
    } catch (error) {
      console.error("Unable to load settings:", error);

      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSetting = (name, value) => {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [name]: value,
    }));
  };

  const updateSettings = (newSettings) => {
    setSettings((previousSettings) => ({
      ...previousSettings,
      ...newSettings,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const value = useMemo(
    () => ({
      settings,

      language: settings.language,

      voiceInputEnabled: settings.voiceInput,

      voiceResponsesEnabled: settings.voiceResponses,

      updateSetting,

      updateSettings,

      resetSettings,
    }),
    [settings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
}