import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getProfile } from "../services/profileService";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSettings } from "../context/SettingsContext";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    settings,
    updateSettings,
  } = useSettings();

  const [preferences, setPreferences] = useState(settings);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setPreferences(settings);
  }, [settings]);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.user);
    } catch (error) {
      console.error("Profile loading error:", error);
      toast.error("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (event) => {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    setPreferences((previousPreferences) => ({
      ...previousPreferences,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const savePreferences = () => {
    updateSettings(preferences);
    toast.success("Preferences saved successfully");
  };

  const logout = () => {
    window.speechSynthesis?.cancel();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-red-600 font-semibold">
          Unable to display profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden">
        <div className="bg-green-700 text-white p-8 sm:p-10 text-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white text-green-700 text-4xl sm:text-5xl font-bold flex items-center justify-center mx-auto shadow-lg">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mt-5">
            {user.name}
          </h1>

          <p className="mt-2 text-green-100">
            🌾 AgriSense Farmer
          </p>
        </div>

        <div className="p-5 sm:p-8 space-y-5">
          <div className="bg-green-50 rounded-2xl p-5">
            <h3 className="font-semibold text-green-700">
              📧 Email
            </h3>

            <p className="mt-2 text-gray-700 break-all">
              {user.email}
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5">
            <h3 className="font-semibold text-blue-700">
              🆔 User ID
            </h3>

            <p className="mt-2 text-gray-700 break-all">
              {user.id}
            </p>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-5">
            <h3 className="font-semibold text-yellow-700">
              📅 Member Since
            </h3>

            <p className="mt-2 text-gray-700">
              {new Date(user.createdAt).toLocaleDateString(
                preferences.language || "en-IN"
              )}
            </p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-5 sm:p-6">
            <h2 className="text-xl font-bold text-purple-700 mb-5">
              ⚙️ Language and Voice Preferences
            </h2>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="language"
                  className="font-semibold block mb-2"
                >
                  🌐 Preferred Language
                </label>

                <select
                  id="language"
                  name="language"
                  value={preferences.language}
                  onChange={handlePreferenceChange}
                  className="w-full border-2 border-purple-200 rounded-xl p-3 bg-white focus:outline-none focus:border-purple-500"
                >
                  <option value="en-IN">English</option>
                  <option value="te-IN">తెలుగు</option>
                  <option value="hi-IN">हिन्दी</option>
                  <option value="ta-IN">தமிழ்</option>
                  <option value="kn-IN">ಕನ್ನಡ</option>
                  <option value="ml-IN">മലയാളം</option>
                </select>
              </div>

              <label className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer">
                <div>
                  <p className="font-semibold">
                    🎤 Voice Input
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Allow farmers to ask questions using the microphone.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="voiceInput"
                  checked={preferences.voiceInput}
                  onChange={handlePreferenceChange}
                  className="w-5 h-5 shrink-0"
                />
              </label>

              <label className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer">
                <div>
                  <p className="font-semibold">
                    🔊 Read Responses Aloud
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Read chatbot, weather, crop and disease responses aloud.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="voiceResponses"
                  checked={preferences.voiceResponses}
                  onChange={handlePreferenceChange}
                  className="w-5 h-5 shrink-0"
                />
              </label>

              <button
                type="button"
                onClick={savePreferences}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold transition"
              >
                💾 Save Preferences
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;