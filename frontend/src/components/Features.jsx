import { Brain, CloudSun, Droplets, Sprout } from "lucide-react";

const features = [
  {
    icon: <Brain size={40} className="text-green-600" />,
    title: "AI Crop Recommendation",
    description:
      "Get intelligent crop suggestions based on soil, weather, and seasonal conditions.",
  },
  {
    icon: <CloudSun size={40} className="text-green-600" />,
    title: "Weather Intelligence",
    description:
      "Real-time weather insights to help farmers plan farming activities efficiently.",
  },
  {
    icon: <Droplets size={40} className="text-green-600" />,
    title: "Smart Irrigation",
    description:
      "Receive irrigation recommendations to optimize water usage and improve crop health.",
  },
  {
    icon: <Sprout size={40} className="text-green-600" />,
    title: "Sustainable Farming",
    description:
      "Promote eco-friendly farming practices with AI-driven recommendations.",
  },
];

function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center text-gray-900">
          Why Choose AgriSense?
        </h2>

        <p className="text-center text-gray-600 mt-4">
          Empowering farmers with Artificial Intelligence and smart agriculture.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition"
            >
              {feature.icon}

              <h3 className="text-xl font-semibold mt-5">
                {feature.title}
              </h3>

              <p className="text-gray-600 mt-3">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Features;