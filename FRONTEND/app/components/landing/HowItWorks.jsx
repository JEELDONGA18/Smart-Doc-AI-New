"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Upload",
    description: "Add your company documents, PDFs, and knowledge base.",
  },
  {
    number: "02",
    title: "Ask",
    description: "Ask questions in natural language about your data.",
  },
  {
    number: "03",
    title: "Answer",
    description: "Get precise, cited answers from your documents only.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function ChevronRight() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-zinc-700 shrink-0 hidden md:block"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4"
        >
          How it works
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.1,
          }}
          className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-16"
        >
          Three simple steps
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start gap-12 md:gap-8"
        >
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="flex flex-col md:flex-row items-center flex-1 w-full"
            >
              <motion.div
                variants={itemVariants}
                className="text-center flex-1"
              >
                <div className="text-5xl font-bold text-white/[0.05] mb-4">
                  {step.number}
                </div>
                <h3 className="text-white font-medium text-lg">{step.title}</h3>
                <p className="text-zinc-500 text-sm mt-2 max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </motion.div>

              {i < steps.length - 1 && (
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-center py-4 md:py-0 md:px-2"
                >
                  <ChevronRight />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
