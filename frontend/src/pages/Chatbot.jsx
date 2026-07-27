import { useState } from "react";
import { askAI } from "../services/chatService";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!message.trim()) {
      toast.error("Please enter your question");
      return;
    }

    try {
      setLoading(true);

      const res = await askAI(message);

      setAnswer(res.answer);

      toast.success("AI Response Ready 🤖");

    } catch (err) {
      console.log(err);

      toast.error("Unable to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-8">

      <h1 className="text-5xl font-bold text-center text-green-700 mb-3">
        🤖 AgriSense AI Assistant
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Ask any agriculture-related question and get instant AI guidance.
      </p>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">

        <label className="block text-lg font-semibold text-gray-700 mb-3">
          Your Question
        </label>

        <textarea
          rows="6"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Example: My tomato leaves are turning yellow. What should I do?"
          className="w-full border-2 border-green-300 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />

        <button
          onClick={handleAsk}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-xl font-bold text-lg"
        >
          🤖 Ask AI
        </button>

      </div>

      {loading && <LoadingSpinner />}

      {!loading && !answer && (

        <div className="text-center mt-16">

          <div className="text-7xl">
            🌾
          </div>

          <h2 className="text-2xl font-bold mt-4 text-gray-700">
            AI Agriculture Expert
          </h2>

          <p className="text-gray-500 mt-2">
            Ask about crops, fertilizers, pests, irrigation, diseases and modern farming.
          </p>

        </div>

      )}

      {!loading && answer && (

        <div className="max-w-4xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="bg-green-700 text-white p-6">

            <h2 className="text-3xl font-bold">
              🤖 AI Recommendation
            </h2>

          </div>

          <div className="p-8">

            <div className="bg-green-50 border-l-4 border-green-600 rounded-xl p-6 whitespace-pre-wrap leading-8 text-gray-800">

              {answer}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Chatbot;