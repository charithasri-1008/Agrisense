import { useState } from "react";
import { getWeather } from "../services/weatherService";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

function Weather() {
  const [city, setCity] = useState("Hyderabad");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast.error("Please enter a city");
      return;
    }

    try {
      setLoading(true);

      const data = await getWeather(city);

      setWeather(data);

      toast.success("Weather Updated 🌦");

    } catch (err) {
      console.error(err);

      toast.error("Unable to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-8">

      <h1 className="text-5xl font-bold text-center text-green-700 mb-3">
        🌦 Weather Information
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Get real-time weather updates for better farming decisions.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">

        <input
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border-2 border-green-300 rounded-xl px-5 py-3 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={fetchWeather}
          className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition font-semibold"
        >
          Search
        </button>

      </div>

      {loading && <LoadingSpinner />}

      {!loading && !weather && (
        <div className="text-center mt-16">

          <div className="text-7xl mb-5">
            🌤
          </div>

          <h2 className="text-2xl font-bold text-gray-700">
            Search a City
          </h2>

          <p className="text-gray-500 mt-2">
            Enter any city name to view current weather details.
          </p>

        </div>
      )}

      {!loading && weather && (

        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition">

          <h2 className="text-4xl font-bold text-center text-green-700 mb-8">
            📍 {weather.city}
          </h2>

          <div className="space-y-5 text-lg">

            <div className="flex justify-between">
              <span>🌡 Temperature</span>
              <b>{weather.temperature} °C</b>
            </div>

            <div className="flex justify-between">
              <span>💧 Humidity</span>
              <b>{weather.humidity}%</b>
            </div>

            <div className="flex justify-between">
              <span>🌬 Wind Speed</span>
              <b>{weather.windSpeed} m/s</b>
            </div>

            <div className="flex justify-between">
              <span>☁ Condition</span>
              <b>{weather.condition}</b>
            </div>

            <div className="flex justify-between">
              <span>📝 Description</span>
              <b>{weather.description}</b>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Weather;