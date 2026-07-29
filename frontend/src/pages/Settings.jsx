import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Settings() {

  const [settings, setSettings] = useState({
    language: "en-US",
    voiceInput: true,
    chatbotVoice: true,
    cropVoice: true,
    diseaseVoice: true,
  });

  useEffect(() => {

    const saved = localStorage.getItem("agrisense_settings");

    if (saved) {
      setSettings(JSON.parse(saved));
    }

  }, []);

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

  };

  const saveSettings = () => {

    localStorage.setItem(
      "agrisense_settings",
      JSON.stringify(settings)
    );

    toast.success("Settings Saved Successfully ✅");

  };
    return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 flex items-center justify-center p-8">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-10">

        <h1 className="text-4xl font-bold text-center text-green-700 mb-2">
          ⚙ Voice & Language Preferences
        </h1>

        <p className="text-center text-gray-500 mb-10">
          Customize your AgriSense AI experience.
        </p>

        {/* Language */}

        <div className="mb-8">

          <label className="block font-semibold text-lg mb-3">
            🌐 Preferred Language
          </label>

          <select
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="w-full border-2 border-green-300 rounded-xl p-3"
          >
            <option value="en-US">English</option>
            <option value="te-IN">తెలుగు</option>
            <option value="hi-IN">हिन्दी</option>
            <option value="ta-IN">தமிழ்</option>
            <option value="kn-IN">ಕನ್ನಡ</option>
            <option value="ml-IN">മലയാളം</option>
          </select>

        </div>

        {/* Voice Settings */}

        <div className="space-y-5">

          <label className="flex justify-between items-center bg-green-50 p-4 rounded-xl">

            <span className="font-semibold">
              🎤 Voice Input
            </span>

            <input
              type="checkbox"
              name="voiceInput"
              checked={settings.voiceInput}
              onChange={handleChange}
              className="w-5 h-5"
            />

          </label>

          <label className="flex justify-between items-center bg-green-50 p-4 rounded-xl">

            <span className="font-semibold">
              🤖 Chatbot Voice
            </span>

            <input
              type="checkbox"
              name="chatbotVoice"
              checked={settings.chatbotVoice}
              onChange={handleChange}
              className="w-5 h-5"
            />

          </label>

          <label className="flex justify-between items-center bg-green-50 p-4 rounded-xl">

            <span className="font-semibold">
              🌾 Crop Recommendation Voice
            </span>

            <input
              type="checkbox"
              name="cropVoice"
              checked={settings.cropVoice}
              onChange={handleChange}
              className="w-5 h-5"
            />

          </label>

          <label className="flex justify-between items-center bg-green-50 p-4 rounded-xl">

            <span className="font-semibold">
              🍃 Disease Detection Voice
            </span>

            <input
              type="checkbox"
              name="diseaseVoice"
              checked={settings.diseaseVoice}
              onChange={handleChange}
              className="w-5 h-5"
            />

          </label>

        </div>

        <button
          onClick={saveSettings}
          className="w-full mt-10 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition"
        >
          💾 Save Settings
        </button>

      </div>

    </div>
  );

}

export default Settings;