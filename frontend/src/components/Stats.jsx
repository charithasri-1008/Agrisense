import { motion } from "framer-motion";
import { LockKeyhole, ShieldCheck, Sprout, UserCheck } from "lucide-react";

const points = [
  { icon: LockKeyhole, title: "Protected Access", description: "Dashboard tools are available only after login." },
  { icon: ShieldCheck, title: "Secure User Flow", description: "Registration and authentication protect private features." },
  { icon: UserCheck, title: "Farmer-Focused", description: "Clear and practical information designed for farmers." },
  { icon: Sprout, title: "Technology as Support", description: "AI assists the farmer without replacing the farmer's decision." },
];

function Stats() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-emerald-800 to-green-900 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-green-100">
            Built around secure access
          </span>

          <h2 className="mt-5 text-4xl font-black text-white sm:text-5xl">
            A protected platform designed for farmers
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white/12 text-white">
                  <Icon size={26} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 leading-7 text-green-100/80">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Stats;
