import { motion } from "framer-motion";
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
  BarChart3,
  ShieldCheck,
  Sparkles,
  Languages,
  Mic2,
  Activity,
  CheckCircle2,
} from "lucide-react";

const cards = [
  {
    title: "Weather",
    desc: "Check live weather, rainfall, humidity, wind speed and five-day forecast.",
    icon: CloudSun,
    color: "bg-blue-100 text-blue-700",
    badge: "Live",
    badgeColor: "bg-blue-100 text-blue-700",
    link: "/weather",
  },
  {
    title: "Market Prices",
    desc: "Compare the latest mandi prices across different states and districts.",
    icon: TrendingUp,
    color: "bg-yellow-100 text-yellow-700",
    badge: "Daily",
    badgeColor: "bg-yellow-100 text-yellow-700",
    link: "/market",
  },
  {
    title: "Crop Recommendation",
    desc: "Get AI-based crop suggestions using soil, season and climate information.",
    icon: Sprout,
    color: "bg-green-100 text-green-700",
    badge: "AI",
    badgeColor: "bg-green-100 text-green-700",
    link: "/crop",
  },
  {
    title: "Disease Detection",
    desc: "Upload a crop leaf image and identify possible diseases and precautions.",
    icon: Leaf,
    color: "bg-red-100 text-red-700",
    badge: "Vision AI",
    badgeColor: "bg-red-100 text-red-700",
    link: "/disease",
  },
  {
    title: "AI Chatbot",
    desc: "Ask agriculture questions and receive simple answers in Indian languages.",
    icon: Bot,
    color: "bg-purple-100 text-purple-700",
    badge: "24/7",
    badgeColor: "bg-purple-100 text-purple-700",
    link: "/chatbot",
  },
  {
    title: "Profile",
    desc: "Manage your personal information, language and voice preferences.",
    icon: User,
    color: "bg-gray-100 text-gray-700",
    badge: "Settings",
    badgeColor: "bg-gray-100 text-gray-700",
    link: "/profile",
  },
];

const highlights = [
  {
    label: "Smart Services",
    value: "6",
    icon: Sparkles,
  },
  {
    label: "Live Weather",
    value: "Real-Time",
    icon: CloudSun,
  },
  {
    label: "Market Prices",
    value: "Daily",
    icon: BarChart3,
  },
  {
    label: "AI Support",
    value: "24/7",
    icon: Bot,
  },
];

const heroStats = [
  {
    value: "6",
    label: "Smart Services",
  },
  {
    value: "6",
    label: "Languages",
  },
  {
    value: "Live",
    label: "Weather Data",
  },
  {
    value: "24/7",
    label: "AI Support",
  },
];

const platformFeatures = [
  {
    icon: Languages,
    title: "Multi-Language",
    desc: "Supports multiple Indian languages.",
  },
  {
    icon: Mic2,
    title: "Voice Assistance",
    desc: "Listen to farming advice using voice.",
  },
  {
    icon: Activity,
    title: "Real-Time Insights",
    desc: "Weather and market information in one place.",
  },
  {
    icon: CheckCircle2,
    title: "Simple Decisions",
    desc: "Clear recommendations for daily farming.",
  },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-emerald-700 text-white">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-emerald-200/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 md:grid-cols-2 md:py-20 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-md">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-lime-300" />
              Secure AI-powered agriculture dashboard
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Smart Farming Control Center
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-green-100 md:text-xl">
              Empowering farmers with AI, real-time weather, market intelligence
              and smarter crop guidance.
            </p>

            <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                  👋
                </div>

                <div>
                  <h2 className="text-2xl font-bold">Welcome to AgriSense</h2>

                  <p className="mt-2 leading-7 text-green-100">
                    Weather updates, market prices, AI recommendations and crop
                    support are available in one dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-green-800 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-green-50 hover:shadow-2xl"
              >
                Explore Services
                <ArrowRight size={18} className="ml-2" />
              </a>

              <Link
                to="/market"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white shadow-lg backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                View Market Prices
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  <p className="text-2xl font-bold sm:text-3xl">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-green-100 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-white/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
             <img
  src="https://images.pexels.com/photos/38777974/pexels-photo-38777974.jpeg?_gl=1*1ejvsj5*_ga*MTQwMzYyNDI0Ny4xNzg1NTk4OTkw*_ga_8JE65Q40S6*czE3ODU2MDA5MDkkbzIkZzEkdDE3ODU2MDA5MzIkajM3JGwwJGgw"
  alt="Farmers planting rice in a traditional paddy field"
  className="relative h-[360px] w-full rounded-[2rem] object-cover shadow-2xl sm:h-[440px] lg:h-[500px]"
/>

              <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/40 bg-white/90 p-5 text-gray-900 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                    <Sparkles className="text-green-700" size={24} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Smart farming support
                    </p>

                    <p className="font-bold text-green-700">
                      Weather + AI + Market Intelligence
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute right-8 top-8 rounded-full border border-white/40 bg-green-700/80 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur">
                ● Secure Dashboard
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Statistics */}
      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-6">
        <div className="grid gap-4 rounded-3xl border border-green-100 bg-white p-5 shadow-2xl md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group flex items-center gap-4 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-green-700 shadow-md transition duration-300 group-hover:scale-110">
                  <Icon size={27} />
                </div>

                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </p>

                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Section */}
      <main id="services" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700">
              AgriSense Tools
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Smart Agriculture Services
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-gray-600">
              Access real-time information and AI-powered agricultural support
              from one simple platform.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" />
            All systems active
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.link}
                className="group relative overflow-hidden rounded-3xl border border-white bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:border-green-200 hover:shadow-2xl hover:shadow-green-200/40"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-100/40 transition duration-500 group-hover:scale-150" />

                <div
                  className={`absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-bold ${card.badgeColor}`}
                >
                  {card.badge}
                </div>

                <div
                  className={`relative flex h-16 w-16 items-center justify-center rounded-2xl ${card.color} shadow-sm transition duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon size={34} />
                </div>

                <h3 className="relative mt-6 text-2xl font-bold text-gray-900">
                  {card.title}
                </h3>

                <p className="relative mt-3 min-h-[78px] leading-7 text-gray-600">
                  {card.desc}
                </p>

                <div className="relative mt-6 inline-flex items-center font-semibold text-green-700">
                  Launch Service

                  <ArrowRight
                    size={18}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-2"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Platform Features */}
        <section className="mt-16 rounded-3xl border border-green-100 bg-white p-7 shadow-xl md:p-10">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Platform Advantages
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Designed for simple and smarter farming
            </h2>
          </div>

          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-green-100 bg-green-50/60 p-6 text-center transition duration-300 hover:-translate-y-1 hover:bg-green-50 hover:shadow-lg"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-green-700 shadow-md">
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Farmer Tip */}
        <section className="mt-12 overflow-hidden rounded-3xl border border-yellow-100 bg-gradient-to-r from-yellow-50 via-white to-green-50 p-8 shadow-xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 shadow-sm">
                  <Lightbulb className="text-yellow-600" size={30} />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-yellow-700">
                    Daily Insight
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Farmer Tip of the Day
                  </h2>
                </div>
              </div>

              <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-700">
                🌱 Irrigate crops during the early morning or evening to reduce
                water loss caused by evaporation and improve overall water
                efficiency.
              </p>
            </div>

            <div className="shrink-0 rounded-xl border border-green-200 bg-green-100 px-5 py-3 font-semibold text-green-700 shadow-sm">
              🌾 Practical Farming Tip
            </div>
          </div>
        </section>
      </main>

      {/* Final CTA */}
      <section className="mx-auto mb-14 max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 p-8 text-center text-white shadow-2xl md:p-12">
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-200">
              Start Exploring
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Ready to make smarter farming decisions?
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-green-100">
              Access weather forecasts, market prices, crop recommendations,
              disease detection and AI assistance from one platform.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/weather"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 font-bold text-green-700 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-green-50"
              >
                Check Weather
                <ArrowRight size={18} className="ml-2" />
              </Link>

              <Link
                to="/chatbot"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                Ask AI Assistant
              </Link>

              <Link
                to="/disease"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                Detect Crop Disease
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with moving paddy leaves */}
      <footer className="relative overflow-hidden border-t border-green-800 bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-52 w-52 rounded-full bg-lime-300/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />
        </div>

        {/* Real paddy images moving gently in both footer corners */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <motion.img
            src="/paddy-left.png"
            alt=""
            animate={{
              rotate: [-2, 3, -2],
              x: [0, 3, 0],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              transformOrigin: "bottom left",
            }}
            className="absolute -bottom-3 -left-3 h-28 w-auto opacity-60 sm:h-36 md:h-40"
          />

          <motion.img
            src="/paddy-right.png"
            alt=""
            animate={{
              rotate: [2, -3, 2],
              x: [0, -3, 0],
            }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              transformOrigin: "bottom right",
            }}
            className="absolute -bottom-3 -right-3 h-28 w-auto opacity-60 sm:h-36 md:h-40"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 pb-20 text-center sm:pb-24">
          <motion.div
            initial={{
              opacity: 0,
              y: 14,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
            }}
          >
            <p className="text-lg font-bold text-white">
              © 2026 AgriSense
            </p>

            <p className="mt-2 text-sm text-green-100/80">
              Empowering farmers through smart agriculture and AI.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;