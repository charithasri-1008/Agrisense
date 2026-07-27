import { useState } from "react";
import { detectDisease } from "../services/diseaseService";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select a crop image");
      return;
    }

    try {
      setLoading(true);

      const res = await detectDisease(image);

      setResult(res.result);

      toast.success("Disease Analysis Completed 🌿");
    } catch (err) {
      console.log(err);

      toast.error("Disease Detection Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-8">

      <h1 className="text-5xl font-bold text-center text-green-700 mb-3">
        🌿 AI Disease Detection
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Upload a crop leaf image and let AI detect possible diseases.
      </p>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-10">

        <label className="block font-semibold text-gray-700 mb-3">
          Upload Crop Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="w-full border-2 border-green-300 rounded-xl p-3"
        />

        {preview && (
          <div className="mt-8 flex justify-center">

            <img
              src={preview}
              alt="Preview"
              className="w-72 h-72 object-cover rounded-2xl shadow-lg border-4 border-green-200"
            />

          </div>
        )}

        <button
          onClick={handleUpload}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-xl font-bold"
        >
          🔍 Detect Disease
        </button>

      </div>

      {loading && <LoadingSpinner />}

      {!loading && !result && (
        <div className="text-center mt-16">

          <div className="text-7xl">
            🌱
          </div>

          <h2 className="text-2xl font-bold mt-4 text-gray-700">
            AI Plant Doctor
          </h2>

          <p className="text-gray-500 mt-2">
            Upload a crop leaf image to detect diseases instantly.
          </p>

        </div>
      )}

      {!loading && result && (

        <div className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl p-10">

          <h2 className="text-4xl font-bold text-center text-green-700 mb-8">
            🌾 Detection Result
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="bg-green-50 rounded-2xl p-5">
              <h3 className="font-bold text-green-700 mb-2">
                🌿 Disease
              </h3>

              <p>{result.disease}</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              <h3 className="font-bold text-blue-700 mb-2">
                📊 Confidence
              </h3>

              <p>{result.confidence}</p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-5 md:col-span-2">
              <h3 className="font-bold text-yellow-700 mb-2">
                🔍 Cause
              </h3>

              <p>{result.cause}</p>
            </div>

            <div className="bg-red-50 rounded-2xl p-5 md:col-span-2">
              <h3 className="font-bold text-red-700 mb-2">
                💊 Treatment
              </h3>

              <p>{result.treatment}</p>
            </div>

            <div className="bg-green-100 rounded-2xl p-5 md:col-span-2">
              <h3 className="font-bold text-green-800 mb-2">
                🛡 Prevention
              </h3>

              <p>{result.prevention}</p>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default DiseaseDetection;