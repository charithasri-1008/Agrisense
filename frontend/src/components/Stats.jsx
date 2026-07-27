import { motion } from "framer-motion";

const stats = [
  {
    number: "10K+",
    title: "Farmers Supported",
  },
  {
    number: "96%",
    title: "AI Prediction Accuracy",
  },
  {
    number: "150+",
    title: "Supported Crops",
  },
  {
    number: "24/7",
    title: "AI Assistance",
  },
];

function Stats() {
  return (
    <section className="py-16 bg-green-700">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {stats.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-white">
                {item.number}
              </h2>

              <p className="text-green-100 mt-2">
                {item.title}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Stats;