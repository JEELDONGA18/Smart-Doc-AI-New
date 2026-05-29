"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-500 ${
          scrolled
            ? "bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="text-indigo-400"
            >
              <circle cx="9" cy="9" r="3" fill="currentColor" />
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
            </svg>
            <span className="text-white font-semibold tracking-tight text-sm">
              Smart Doc AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-white text-black rounded-full px-4 py-2 hover:bg-zinc-200 transition-colors duration-300"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <motion.line
                x1="0" y1="1" x2="18" y2="1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={mobileOpen ? { rotate: 45, y: 6, x: 0 } : { rotate: 0, y: 0, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: "center" }}
              />
              <motion.line
                x1="0" y1="7" x2="18" y2="7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.line
                x1="0" y1="13" x2="18" y2="13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={mobileOpen ? { rotate: -45, y: -6, x: 0 } : { rotate: 0, y: 0, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: "center" }}
              />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#09090b]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col items-center gap-4 mt-4"
              >
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-lg text-zinc-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium bg-white text-black rounded-full px-6 py-3 hover:bg-zinc-200 transition-colors"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
