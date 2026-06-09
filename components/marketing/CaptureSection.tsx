"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCheckCircle, FaPhone, FaReply, FaRobot } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { FadeIn, slideLeft, slideRight } from "@/components/marketing/Motion";
import { images } from "@/lib/images";

const bullets = [
  { icon: FaPhone, text: "Answers every outbound sales call to past customers" },
  { icon: FaRobot, text: "Qualifies and books the next step automatically" },
  { icon: FaReply, text: "Follows up when your team cannot" },
];

export function CaptureSection() {
  return (
    <section className="py-28 bg-navy relative overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-maple/5 blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <div className="absolute inset-0 maple-grain opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn variant={slideRight} className="order-2 lg:order-1">
            <motion.div
              className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-[0_24px_80px_rgba(0,0,0,0.4)] border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={images.carpetRoll}
                alt="Professional carpet installation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-navy/40 to-transparent" />
            </motion.div>
          </FadeIn>

          <FadeIn variant={slideLeft} className="order-1 lg:order-2">
            <p className="text-maple text-sm font-semibold tracking-widest uppercase mb-4">
              Capture & Convert
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Capture and Convert Every Lead, Automatically
            </h2>
            <p className="text-white/60 mb-10 leading-relaxed text-lg">
              Maya answers instantly and moves every sales conversation forward —
              with strict fact discipline and respectful compliance built in.
            </p>
            <ul className="space-y-5 mb-10">
              {bullets.map((b, i) => (
                <motion.li
                  key={b.text}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FaCheckCircle className="text-maple text-sm" />
                  </div>
                  <span className="text-white/80">{b.text}</span>
                </motion.li>
              ))}
            </ul>
            <Link href="/demo">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button variant="primary" size="lg" className="shadow-lg shadow-maple/20">
                  Capture Leads Now
                </Button>
              </motion.div>
            </Link>
            <p className="text-white/35 text-xs mt-4">
              No obligation. See real conversations.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
