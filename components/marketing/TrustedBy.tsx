"use client";

import { motion } from "framer-motion";
import { FaAward, FaHome, FaStore, FaUsers } from "react-icons/fa";
import { FadeIn } from "@/components/marketing/Motion";

const brands = [
  { name: "Waterloo Homeowners", icon: FaHome },
  { name: "Kitchener Renovators", icon: FaStore },
  { name: "Local Contractors", icon: FaUsers },
  { name: "Design Studios", icon: FaAward },
];

export function TrustedBy() {
  const doubled = [...brands, ...brands];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <p className="text-center text-navy/35 text-xs font-semibold uppercase tracking-[0.2em] mb-10">
            Trusted by forward-thinking flooring businesses across Ontario
          </p>
        </FadeIn>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

          <motion.div
            className="flex gap-16 items-center w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {doubled.map((b, i) => (
              <div
                key={`${b.name}-${i}`}
                className="flex items-center gap-3 text-navy/25 hover:text-navy/45 transition-colors shrink-0"
              >
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                  <b.icon className="text-lg text-navy/40" />
                </div>
                <span className="font-semibold text-base tracking-tight whitespace-nowrap">
                  {b.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
