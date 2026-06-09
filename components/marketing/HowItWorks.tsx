"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaHeadset,
  FaPhoneAlt,
  FaUserCheck,
} from "react-icons/fa";
import { FadeIn, Stagger, StaggerItem, slideRight, slideLeft } from "@/components/marketing/Motion";
import { images } from "@/lib/images";

const steps = [
  {
    num: "01",
    icon: FaPhoneAlt,
    title: "Customer Receives the Call",
    desc: "Maya dials past customers from Priya's list — answered instantly, 24/7.",
  },
  {
    num: "02",
    icon: FaHeadset,
    title: "AI Handles The Conversation",
    desc: "Maya understands intent, shares the sale, and gathers key details naturally.",
  },
  {
    num: "03",
    icon: FaCalendarAlt,
    title: "Appointment Is Booked",
    desc: "Free in-home measures booked with availability checks and instant confirmation.",
  },
  {
    num: "04",
    icon: FaUserCheck,
    title: "Priya Takes Over When It Matters",
    desc: "High-intent leads handed off with full summaries. No repetition. No guesswork.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/50 skew-x-[-6deg] translate-x-32 hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <FadeIn variant={slideRight}>
            <p className="text-maple text-sm font-semibold tracking-widest uppercase mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-5 leading-tight">
              Transform Every Call Into Growth
            </h2>
            <p className="text-navy/55 leading-relaxed text-lg">
              From outbound dial to booked measure in under two minutes. Every
              call ends with exactly one disposition and a summary for Priya.
            </p>
          </FadeIn>

          <FadeIn variant={slideLeft} delay={0.15}>
            <motion.div
              className="relative rounded-3xl overflow-hidden aspect-video shadow-[0_20px_60px_rgba(11,31,58,0.15)] border-4 border-white"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={images.livingRoom}
                alt="Beautiful living room with new flooring"
                fill
                className="object-cover"
              />
            </motion.div>
          </FadeIn>
        </div>

        <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <StaggerItem key={step.num}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative bg-white rounded-2xl p-7 border border-navy/5 shadow-sm hover:shadow-lg hover:border-maple/20 transition-all duration-300 h-full"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-maple/30 z-10" />
                )}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-4xl font-black text-maple/20 leading-none">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
                    <step.icon className="text-maple text-sm" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-navy mb-2">{step.title}</h3>
                <p className="text-navy/55 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
