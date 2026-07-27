import { useState } from "react";
import { recommendCrop } from "../services/cropService";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

function CropRecommendation() {
  const [form, setForm] = useState({
    soilType: "Clay",
    season: "Kharif",
    rainfall: "",
    temperature: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {

    if (!form.rainfall || !form.temperature) {
      toast.error("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const data = await recommendCrop({
        ...form,
        rainfall: Number(form.rainfall),
        temperature: Number(form.temperature),
      });

      setResult(data);

      toast.success("Recommendation Ready 🌱");

    } catch (err) {

      console.log(err);

      toast.error("Recommendation Failed");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-8">

      <h1 className="text-5xl font-bold text-center text-green-700 mb-3">
        🌱 Crop Recommendation
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Get AI-powered crop recommendations based on soil and climate conditions.
      </p>

      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl p-10">

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="font-semibold text-gray-700">
              Soil Type
            </label>

            <select
              name="soilType"
              value={form.soilType}
              onChange={handleChange}
              className="w-full mt-2 border-2 border-green-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Clay</option>
              <option>Black</option>
              <option>Loamy</option>
              <option>Sandy</option>
            </select>

          </div>

          <div>

            <label className="font-semibold text-gray-700">
              Season
            </label>

            <select
              name="season"
              value={form.season}
              onChange={handleChange}
              className="w-full mt-2 border-2 border-green-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Kharif</option>
              <option>Rabi</option>
              <option>Zaid</option>
            </select>

          </div>

          <div>

            <label className="font-semibold text-gray-700">
              Rainfall (mm)
            </label>

            <input
              type="number"
              name="rainfall"
              value={form.rainfall}
              onChange={handleChange}
              placeholder="Enter Rainfall"
              className="w-full mt-2 border-2 border-green-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          <div>

            <label className="font-semibold text-gray-700">
              Temperature (°C)
            </label>

            <input
              type="number"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              placeholder="Enter Temperature"
              className="w-full mt-2 border-2 border-green-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

        </div>

        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold transition"
        >
          🌾 Get Recommendation
        </button>

      </div>

      {loading && <LoadingSpinner />}

      {!loading && !result && (

        <div className="text-center mt-16">

          <div className="text-7xl">
            🌱
          </div>

          <h2 className="text-2xl font-bold mt-4 text-gray-700">
            AI Crop Advisor
          </h2>

          <p className="text-gray-500 mt-2">
            Fill the details above and receive the best crop recommendation.
          </p>

        </div>

      )}

      {!loading && result && (

        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl p-10">

          <h2 className="text-4xl font-bold text-green-700 mb-6 text-center">
            🌾 {result.recommendedCrop}
          </h2>

          <div className="bg-green-50 rounded-2xl p-6">

            <h3 className="font-bold text-xl text-green-800 mb-3">
              Why this crop?
            </h3>

            <p className="text-gray-700 leading-8">
              {result.reason}
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default CropRecommendation;