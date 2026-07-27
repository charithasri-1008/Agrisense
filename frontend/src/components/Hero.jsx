import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-white py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
            AI-Powered <span className="text-green-600">Farm Decision</span><br />
            Support System
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            AgriSense helps farmers make smarter decisions using
            Artificial Intelligence, weather insights, and crop analytics
            to improve productivity and sustainability.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              🚀 Get Started Free
            </Link>

            <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition">
              ▶ View Demo
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900"
            alt="Smart Farming"
            className="rounded-2xl shadow-2xl"
          />
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;