import { Link } from "react-router-dom";
import {
  CloudSun,
  TrendingUp,
  Sprout,
  Bot,
  Leaf,
  User,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

const cards = [
  {
    title: "Weather",
    desc: "Live weather updates",
    icon: <CloudSun size={42} />,
    color: "bg-blue-100 text-blue-700",
    link: "/weather",
  },
  {
    title: "Market Prices",
    desc: "Latest mandi prices",
    icon: <TrendingUp size={42} />,
    color: "bg-yellow-100 text-yellow-700",
    link: "/market",
  },
  {
    title: "Crop Recommendation",
    desc: "AI based crop suggestions",
    icon: <Sprout size={42} />,
    color: "bg-green-100 text-green-700",
    link: "/crop",
  },
  {
    title: "Disease Detection",
    desc: "Upload leaf image",
    icon: <Leaf size={42} />,
    color: "bg-red-100 text-red-700",
    link: "/disease",
  },
  {
    title: "AI Chatbot",
    desc: "Ask agriculture questions",
    icon: <Bot size={42} />,
    color: "bg-purple-100 text-purple-700",
    link: "/chatbot",
  },
  {
    title: "Profile",
    desc: "Manage your account",
    icon: <User size={42} />,
    color: "bg-gray-100 text-gray-700",
    link: "/profile",
  },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">

      {/* Hero */}
      <div className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">

          <h1 className="text-4xl md:text-5xl font-bold">
            🌾 AgriSense Dashboard
          </h1>

          <p className="mt-4 text-lg text-green-100">
            Empowering Farmers with Artificial Intelligence
          </p>

          <div className="mt-8 bg-white/20 backdrop-blur rounded-xl p-5 inline-block">
            <h2 className="text-2xl font-semibold">
              👋 Welcome Back!
            </h2>

            <p className="mt-2 text-green-100">
              Make smarter farming decisions using AI.
            </p>
          </div>

        </div>
      </div>

      {/* Cards */}

      <div className="max-w-7xl mx-auto px-6 py-12">

        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Smart Agriculture Services
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8"
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center ${card.color}`}
              >
                {card.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                {card.title}
              </h3>

              <p className="mt-3 text-gray-600">
                {card.desc}
              </p>

              <div className="mt-6 flex items-center text-green-700 font-semibold">
                Open
                <ArrowRight size={18} className="ml-2" />
              </div>

            </Link>
          ))}

        </div>

        {/* Farmer Tip */}

        <div className="mt-12 bg-white rounded-2xl shadow-md p-8">

          <div className="flex items-center gap-3">
            <Lightbulb
              className="text-yellow-500"
              size={34}
            />

            <h2 className="text-2xl font-bold">
              Farmer Tip of the Day
            </h2>
          </div>

          <p className="mt-5 text-lg text-gray-700">
            🌱 Irrigate crops during the early morning or evening to reduce
            water loss caused by evaporation and improve water efficiency.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;