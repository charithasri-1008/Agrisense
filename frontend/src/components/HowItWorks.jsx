import { Search, Brain, BarChart3 } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      icon: <Search size={40} className="text-green-600" />,
      title: "Enter Farm Details",
      description:
        "Provide information like soil type, crop, season, and location.",
    },
    {
      icon: <Brain size={40} className="text-green-600" />,
      title: "AI Analysis",
      description:
        "AgriSense analyzes your data using AI along with weather insights.",
    },
    {
      icon: <BarChart3 size={40} className="text-green-600" />,
      title: "Get Smart Recommendations",
      description:
        "Receive personalized suggestions for crops, irrigation, and fertilizers.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900">
          How AgriSense Works
        </h2>

        <p className="text-center text-gray-600 mt-4">
          Three simple steps to make better farming decisions.
        </p>

        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl border hover:shadow-lg transition"
            >
              <div className="flex justify-center">{step.icon}</div>

              <h3 className="text-xl font-semibold mt-6">
                {step.title}
              </h3>

              <p className="mt-3 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;