import { motion } from "framer-motion";
import {
  Bot,
  CloudSun,
  Leaf,
  LineChart,
  Mail,
  MapPin,
  Sprout,
} from "lucide-react";

const featureLinks = [
  { label: "Weather Intelligence", icon: CloudSun },
  { label: "Crop Recommendation", icon: Sprout },
  { label: "Disease Detection", icon: Leaf },
  { label: "Market Prices", icon: LineChart },
  { label: "AI Farming Assistant", icon: Bot },
];

const technologies = [
  "React",
  "Node.js",
  "Express",
  "PostgreSQL",
  "Groq AI",
  "Gemini AI",
  "Hugging Face",
];

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_40%)]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-28 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-around px-4 opacity-35">
          {Array.from({ length: 24 }).map((_, index) => (
            <motion.div
              key={index}
              animate={{ rotate: [-3, 4, -3] }}
              transition={{
                duration: 3.5 + (index % 5) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (index % 6) * 0.15,
              }}
              style={{ transformOrigin: "bottom center" }}
              className="relative flex h-20 w-3 flex-col items-center justify-end"
            >
              <div className="h-16 w-[2px] rounded-full bg-yellow-200/70" />
              <div className="absolute bottom-11 left-[1px] h-5 w-2 -rotate-45 rounded-full bg-yellow-200/70" />
              <div className="absolute bottom-8 right-[1px] h-5 w-2 rotate-45 rounded-full bg-yellow-200/70" />
              <div className="absolute bottom-14 flex flex-col items-center gap-[2px]">
                {Array.from({ length: 5 }).map((__, grainIndex) => (
                  <span
                    key={grainIndex}
                    className="block h-2.5 w-1.5 rounded-full bg-yellow-200/80"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-green-950 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 pb-28 sm:px-8 lg:px-10 lg:py-16 lg:pb-28">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-lg">
                <Sprout size={27} strokeWidth={2.4} />
              </div>

              <div>
                <h2 className="text-3xl font-black tracking-tight">AgriSense</h2>
                <p className="text-sm font-medium text-green-200">Smart Farming Assistant</p>
              </div>
            </div>

            <p className="mt-5 max-w-md leading-8 text-green-100/85">
              AgriSense is an AI-powered farming platform that helps farmers make better decisions using weather intelligence, crop recommendations, disease detection, market prices, and multilingual assistance.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="mailto:agrisense.team@gmail.com"
                aria-label="Email AgriSense"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 transition hover:-translate-y-1 hover:bg-white/20"
              >
                <Mail size={18} />
              </a>

             
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold">AI Features</h3>
            <ul className="mt-5 space-y-3">
              {featureLinks.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li
                    key={feature.label}
                    className="flex items-center gap-3 text-green-100/85 transition hover:translate-x-2 hover:text-white"
                  >
                    <Icon size={18} className="text-green-300" />
                    <span>{feature.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold">Technology</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/20"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold">Contact</h3>
            <div className="mt-5 space-y-4 text-green-100/85">
              <a
                href="mailto:agrisense.team@gmail.com"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Mail size={18} className="text-green-300" />
                <span className="break-all">agrisense.team@gmail.com</span>
              </a>

              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-green-300" />
                <span>Andhra Pradesh, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-green-200/85 md:flex-row md:text-left">
          <p>© 2026 AgriSense. All Rights Reserved.</p>
          <p>Powered by React • Express • PostgreSQL • Groq AI • Gemini AI • Hugging Face</p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;