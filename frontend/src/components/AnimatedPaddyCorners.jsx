import { motion } from "framer-motion";

function PaddyCluster({ side = "left" }) {
  const mirrored = side === "right";

  return (
    <motion.svg
      viewBox="0 0 150 230"
      aria-hidden="true"
      className={`h-36 w-24 sm:h-44 sm:w-28 ${
        mirrored ? "scale-x-[-1]" : ""
      }`}
      animate={{
        rotate: mirrored
          ? [2, -3, 2]
          : [-2, 3, -2],
      }}
      transition={{
        duration: mirrored ? 5.2 : 4.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        transformOrigin: mirrored
          ? "bottom right"
          : "bottom left",
      }}
    >
      <defs>
        <linearGradient
          id={`paddy-stem-${side}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#d9f99d" />
          <stop offset="100%" stopColor="#4d7c0f" />
        </linearGradient>

        <linearGradient
          id={`paddy-grain-${side}`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>

      {/* stems */}
      <path
        d="M24 225 C30 166, 42 112, 65 32"
        fill="none"
        stroke={`url(#paddy-stem-${side})`}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M52 225 C58 170, 70 122, 96 55"
        fill="none"
        stroke={`url(#paddy-stem-${side})`}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M78 225 C88 176, 102 136, 126 82"
        fill="none"
        stroke={`url(#paddy-stem-${side})`}
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* leaves */}
      <path
        d="M31 181 C8 164, 6 139, 11 121 C31 137, 39 158, 31 181"
        fill="#84cc16"
        opacity="0.82"
      />
      <path
        d="M42 150 C61 131, 68 111, 65 94 C47 108, 37 130, 42 150"
        fill="#65a30d"
        opacity="0.9"
      />
      <path
        d="M59 198 C81 180, 91 158, 89 141 C69 155, 56 177, 59 198"
        fill="#84cc16"
        opacity="0.8"
      />
      <path
        d="M82 176 C104 157, 115 136, 114 118 C94 133, 80 154, 82 176"
        fill="#65a30d"
        opacity="0.88"
      />
      <path
        d="M98 210 C121 191, 132 172, 132 154 C111 168, 96 188, 98 210"
        fill="#84cc16"
        opacity="0.8"
      />

      {/* grains */}
      {[
        { x: 65, y: 34, count: 9, angle: -8 },
        { x: 96, y: 57, count: 8, angle: 8 },
        { x: 126, y: 84, count: 7, angle: 16 },
      ].map((panicle, pIndex) => (
        <motion.g
          key={pIndex}
          transform={`translate(${panicle.x} ${panicle.y}) rotate(${panicle.angle})`}
          animate={{
            rotate: [
              panicle.angle,
              panicle.angle + (mirrored ? -2 : 2),
              panicle.angle,
            ],
          }}
          transition={{
            duration: 4.2 + pIndex * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: pIndex * 0.08,
          }}
          style={{
            transformOrigin: "0 0",
          }}
        >
          <path
            d="M0 0 C7 15, 10 31, 9 49"
            fill="none"
            stroke="#bef264"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {Array.from({ length: panicle.count }).map((_, gIndex) => {
            const y = 6 + gIndex * 5;
            const direction = gIndex % 2 === 0 ? -1 : 1;

            return (
              <ellipse
                key={gIndex}
                cx={direction * (3.5 + (gIndex % 3))}
                cy={y}
                rx="2.8"
                ry="4.4"
                fill={`url(#paddy-grain-${side})`}
                transform={`rotate(${direction * 24})`}
              />
            );
          })}
        </motion.g>
      ))}
    </motion.svg>
  );
}

function PaddyCornerAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute bottom-0 left-0 opacity-80">
  <PaddyCluster side="left" />
</div>

<div className="absolute bottom-0 right-0 opacity-80">
  <PaddyCluster side="right" />
</div>
    </div>
  );
}

export default PaddyCornerAnimation;