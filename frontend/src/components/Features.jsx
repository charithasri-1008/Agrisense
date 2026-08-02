import { motion } from "framer-motion";
import { Bot, CloudSun, Languages, Leaf, LineChart, Sprout } from "lucide-react";

const features = [
  { icon: CloudSun, title: "Weather Intelligence", description: "Real-time weather conditions, forecasts, and practical farming advice." },
  { icon: Sprout, title: "Crop Recommendation", description: "Crop suggestions based on soil type, season, weather, and local conditions." },
  { icon: Leaf, title: "Disease Detection", description: "Image-based crop disease identification with treatment and prevention guidance." },
  { icon: LineChart, title: "Market Prices", description: "Latest mandi price records with minimum, maximum, and modal prices." },
  { icon: Bot, title: "AI Farming Assistant", description: "Simple agriculture guidance through a multilingual AI assistant." },
  { icon: Languages, title: "Multilingual Voice Support", description: "Support for multiple Indian languages with text and voice assistance." },
];

function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-[#f7faf8] py-20 sm:py-24">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
            Available after secure login
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Explore what AgriSense offers
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            These tools are available inside the protected dashboard after
            account creation and login.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.25)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>

                <span className="mt-6 inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                  Login required
                </span>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;