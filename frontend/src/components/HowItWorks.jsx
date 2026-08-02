import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, LogIn, UserPlus } from "lucide-react";

const steps = [
  { number: "01", icon: UserPlus, title: "Create Your Account", description: "Register with your details to create a secure AgriSense account." },
  { number: "02", icon: LogIn, title: "Login Securely", description: "Sign in with your account credentials to access protected features." },
  { number: "03", icon: LayoutDashboard, title: "Use the Dashboard", description: "Access weather, market prices, crop AI, disease detection, and the AI assistant." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            Secure Access Flow
          </span>

          <h2 className="mt-5 text-4xl font-black text-slate-900 sm:text-5xl">
            How AgriSense Works
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Create an account, login securely, and then use all tools from
            one protected dashboard.
          </p>
        </motion.div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-[0_20px_45px_-25px_rgba(15,23,42,0.25)]"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 text-white shadow-lg">
                  <Icon size={30} />
                </div>

                <div className="mx-auto mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
                  {step.number}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <ArrowRight size={20} className="mx-auto mt-6 text-green-600" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;