"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function DashboardShowcase() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">
            Product
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Built for modern teams
          </h2>
          <p className="text-zinc-400 mt-3 text-lg">
            A unified workspace for document intelligence.
          </p>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
        >
          <div className="absolute -inset-4 bg-gradient-to-b from-indigo-500/[0.08] to-violet-500/[0.04] rounded-3xl blur-2xl" />

          <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
            </div>

            <Image
              src="/dashboard-mockup.png"
              alt="Smart Doc AI Dashboard"
              width={1200}
              height={750}
              className="w-full h-auto"
              priority={false}
            />

            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#09090b] to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
