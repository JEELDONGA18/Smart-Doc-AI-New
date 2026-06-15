"use client";

import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-40 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]"
        >
          Transform Company Documents Into{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Intelligent AI
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.1,
          }}
          className="text-zinc-400 mt-6 text-lg"
        >
          Start building your company&apos;s AI knowledge base today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2,
          }}
          className="mt-10"
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block px-8 py-4 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-all duration-300"
          >
            Get Started
          </motion.a>

          <p className="text-zinc-600 text-xs mt-4">
            No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
