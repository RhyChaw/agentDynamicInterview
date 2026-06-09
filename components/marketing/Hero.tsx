"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaComments,
  FaPlay,
  FaRulerCombined,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { images } from "@/lib/images";

const highlights = [
  {
    icon: FaRulerCombined,
    title: "Schedule more measures",
    desc: "Free in-home appointments booked automatically",
  },
  {
    icon: FaComments,
    title: "Better customer experiences",
    desc: "Warm, natural conversations — not telemarketer vibes",
  },
  {
    icon: FaCalendarCheck,
    title: "Book weekend appointments",
    desc: "Forty percent off locked in at the measure",
  },
];

export function Hero() {
  return (
    <section className="bg-navy maple-grain relative overflow-hidden">
      {/* Ambient glow orbs */}
      <motion.div
        className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-maple/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#0d2847] opacity-90" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-32 md:pb-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 text-maple text-xs font-semibold tracking-widest uppercase mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-maple animate-pulse" />
              Weekend Sale Campaign
            </motion.p>

            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.1] mb-6">
              Drive more revenue with an AI Employee built for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-maple to-maple-light">
                Flooring
              </span>
            </h1>

            <p className="text-white/65 text-lg mb-8 leading-relaxed max-w-xl">
              Maya, your AI Employee, calls past customers, shares the forty
              percent off weekend sale, and books free in-home measure
              appointments — so Priya can focus on closing.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/demo">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="primary" size="lg" className="shadow-lg shadow-maple/25">
                    Start a Call
                  </Button>
                </motion.div>
              </Link>
              <Link href="/demo">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="gap-2">
                    <FaPlay className="text-xs" /> See Sample Transcript
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.94, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.4)] border border-white/15 aspect-[4/3]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={images.heroCarpet}
                alt="Premium carpet and flooring showroom"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />

              {/* White glass card — pops with contrast */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-navy font-bold text-sm">
                      Forty percent off this weekend only
                    </p>
                    <p className="text-navy/50 text-xs mt-1">
                      Free in-home measures · No obligation
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center shrink-0">
                    <span className="text-maple font-black text-lg">40</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating accent card */}
            <motion.div
              className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-navy/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xs text-navy/40 uppercase tracking-wider">Live now</p>
              <p className="text-navy font-bold text-sm">Maya is calling</p>
            </motion.div>
          </motion.div>
        </div>

        {/* White highlight cards — overlap into white section below */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 md:mt-20 relative z-20"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
          }}
        >
          {highlights.map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-white rounded-2xl p-6 shadow-[0_12px_48px_rgba(11,31,58,0.12)] border border-navy/5 group"
            >
              <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center mb-4 group-hover:bg-maple transition-colors duration-300">
                <item.icon className="text-maple group-hover:text-navy text-lg transition-colors duration-300" />
              </div>
              <h3 className="text-navy font-bold mb-2">{item.title}</h3>
              <p className="text-navy/55 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Curve into white */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white rounded-t-[3rem]" />
    </section>
  );
}
