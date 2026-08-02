import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Leaf, ShieldCheck, Sprout } from "lucide-react";

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#f5fbf6] via-white to-[#edf8f1]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-green-200/30 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-green-200 bg-white/85 px-4 py-2 text-sm font-semibold text-green-800 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600" />
            </span>
            Farmer-first smart agriculture platform
          </div>

          <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-[4.2rem]">
            Smarter farming starts with{" "}
            <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 bg-clip-text text-transparent">
              better insights.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            AgriSense combines traditional farming knowledge with modern
            technology to support better decisions. Create an account and
            sign in to access the complete dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-700 to-emerald-600 px-7 py-4 font-bold text-white shadow-lg shadow-green-700/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Create Free Account
              <ArrowRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-green-700 bg-white px-7 py-4 font-bold text-green-800 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-green-50 hover:shadow-md"
            >
              Login
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-green-600" />
              Farmer-friendly design
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-green-600" />
              Protected dashboard access
            </span>
            <span className="flex items-center gap-2">
              <Leaf size={17} className="text-green-600" />
              Agriculture-focused support
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-green-300/35 via-emerald-200/20 to-yellow-100/40 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-2.5 shadow-[0_30px_80px_-25px_rgba(20,83,45,0.45)]">
            <div className="relative overflow-hidden rounded-[1.55rem]">
             <img
  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
  alt="Farmer inspecting crops"
  className="h-[420px] w-full object-cover object-center sm:h-[500px] lg:h-[570px]"
/>

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-100">
                  Tradition supported by technology
                </p>
                <h2 className="mt-2 max-w-md text-2xl font-bold leading-tight sm:text-3xl">
                  The farmer stays in control. AgriSense supports the decision.
                </h2>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-3 top-8 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-xl sm:-left-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Sprout size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Farmer-first platform
                </p>
                <p className="font-bold text-slate-900">Login to Access</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;