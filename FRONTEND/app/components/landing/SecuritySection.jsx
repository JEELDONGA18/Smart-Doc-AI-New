"use client";

import { motion } from "framer-motion";

const features = [
  "End-to-end encryption",
  "Company-only AI responses",
  "SOC 2 compliant architecture",
];

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="w-5 h-5 text-indigo-400 shrink-0"
    >
      <path
        d="M6 10.5L8.5 13L14 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldVisual() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute w-64 h-64 bg-indigo-500/[0.06] rounded-full blur-[80px]" />

      <svg
        width="192"
        height="192"
        viewBox="0 0 192 192"
        fill="none"
        className="relative z-10"
      >
        <defs>
          <linearGradient
            id="shieldGradient"
            x1="96"
            y1="16"
            x2="96"
            y2="176"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#818cf8" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>

        <path
          d="M96 20L160 52V100C160 138 134 164 96 176C58 164 32 138 32 100V52L96 20Z"
          stroke="url(#shieldGradient)"
          strokeWidth="1.5"
          fill="none"
        />

        <path
          d="M76 98L90 112L116 82"
          stroke="url(#shieldGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default function SecuritySection() {
  return (
    <section id="security" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">
              Security
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Enterprise-grade privacy
            </h2>

            <p className="text-zinc-400 mt-4 text-lg leading-relaxed max-w-md">
              Your AI assistant only answers from your uploaded documents. No
              external data, no hallucinations.
            </p>

            <div className="mt-8 space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckIcon />
                  <span className="text-zinc-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.15,
            }}
            className="flex-1 flex items-center justify-center"
          >
            <ShieldVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
