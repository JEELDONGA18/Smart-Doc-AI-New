"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Secure Document Upload",
    description:
      "Upload and organize company documents with end-to-end encryption.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 14V3m0 0L6 7m4-4 4 4" />
        <path d="M3 14v1.5A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5V14" />
      </svg>
    ),
  },
  {
    title: "AI-Powered Answers",
    description:
      "Get instant, accurate answers from your company knowledge base.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 1l1.326 4.073h4.284l-3.468 2.52 1.325 4.074L10 9.146l-3.468 2.52 1.326-4.073-3.468-2.52h4.284L10 1z" />
        <path d="M4 14.5l-1.5 4.5" />
        <path d="M16 14.5l1.5 4.5" />
        <path d="M10 12.5V19" />
      </svg>
    ),
  },
  {
    title: "Chat History",
    description:
      "Every conversation is saved and searchable for your team.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7l-4 3V6a2 2 0 0 1 2-2z" />
        <path d="M7 9h6" />
        <path d="M7 12h3" />
      </svg>
    ),
  },
  {
    title: "Downloadable Reports",
    description:
      "Export conversations and insights as professional reports.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 3v11m0 0 4-4m-4 4-4-4" />
        <path d="M3 14v1.5A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5V14" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 sm:py-40">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-12 text-center">
          Features
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-zinc-400">
                {feature.icon}
              </div>
              <h3 className="text-white font-medium text-lg mt-4">
                {feature.title}
              </h3>
              <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
