"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/marketing/Motion";

export function CtaBand() {
  return (
    <section className="py-24 bg-navy maple-grain relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-navy via-[#0f2a4a] to-navy"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-maple/10 blur-3xl rounded-full"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Turn Conversations Into Revenue
          </h2>
          <p className="text-white/60 mb-10 text-lg max-w-2xl mx-auto">
            Let Maya handle the outbound calls so Priya can focus on measures,
            quotes, and closing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/demo">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button variant="primary" size="lg" className="shadow-xl shadow-maple/25">
                  Try the Call Simulator
                </Button>
              </motion.div>
            </Link>
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" className="gap-2">
                  View Campaign Dashboard{" "}
                  <FaArrowRight className="text-sm" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
