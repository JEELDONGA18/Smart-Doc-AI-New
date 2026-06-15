"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/[0.07] rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-xs uppercase tracking-[0.2em] text-indigo-400 font-medium mb-6"
            >
              Enterprise AI Platform
            </motion.p>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white"
            >
              Private{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                AI
              </span>{" "}
              For
              <br />
              Company Knowledge
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-lg text-zinc-400 mt-6 max-w-lg leading-relaxed mx-auto lg:mx-0"
            >
              Upload internal documents and get accurate AI-powered answers
              securely.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-10 flex gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-all duration-300"
              >
                Get Started
              </motion.a>
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-full text-sm font-medium text-zinc-300 border border-white/[0.1] hover:border-white/[0.2] hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-zinc-400"
                >
                  <path
                    d="M4.5 2.5L11 7L4.5 11.5V2.5Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </svg>
                Live Demo
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
            className="flex-1 w-full max-w-2xl lg:max-w-none"
          >
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-b from-indigo-500/20 via-transparent to-violet-500/10 rounded-2xl blur-xl opacity-50 pointer-events-none" />

              <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]">
                <Image
                  src="/dashboard-mockup.png"
                  alt="Smart Doc AI Dashboard"
                  width={700}
                  height={500}
                  className="w-full h-auto"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-40 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
