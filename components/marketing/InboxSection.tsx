"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaInbox, FaMagic, FaPhoneAlt } from "react-icons/fa";
import { FadeIn, slideLeft, slideRight } from "@/components/marketing/Motion";
import { images } from "@/lib/images";

const features = [
  { icon: FaInbox, text: "One inbox for calls, texts, and outcomes" },
  { icon: FaMagic, text: "AI summaries and suggested follow-ups" },
  { icon: FaPhoneAlt, text: "Seamless AI-to-human handoff to Priya" },
];

export function InboxSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn variant={slideRight}>
            <p className="text-maple text-sm font-semibold tracking-widest uppercase mb-4">
              Every Conversation, One Inbox
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6 leading-tight">
              All Customer Communication in One Place
            </h2>
            <p className="text-navy/55 mb-10 leading-relaxed text-lg">
              SMS, voice, and campaign outcomes unified with AI and full lead
              context — the same pattern production vendors like AgentDynamics
              lead with.
            </p>
            <ul className="space-y-5">
              {features.map((f, i) => (
                <motion.li
                  key={f.text}
                  className="flex items-center gap-4 bg-cream rounded-2xl p-4 border border-navy/5"
                  whileHover={{ x: 6 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center shrink-0">
                    <f.icon className="text-maple" />
                  </div>
                  <span className="text-navy font-medium">{f.text}</span>
                </motion.li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn variant={slideLeft} delay={0.15}>
            <div className="relative">
              <motion.div
                className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-[0_20px_60px_rgba(11,31,58,0.12)] border-4 border-cream"
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src={images.hardwoodFloor}
                  alt="Hardwood flooring installation"
                  fill
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                className="absolute -bottom-8 -left-4 md:-left-8 bg-white rounded-2xl shadow-[0_16px_48px_rgba(11,31,58,0.15)] p-6 border border-navy/5 max-w-xs"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs text-navy/40 uppercase tracking-wider font-semibold">
                    Latest outcome
                  </p>
                </div>
                <p className="font-bold text-navy">Raj Patel — Booked</p>
                <p className="text-navy/50 text-sm mt-1">
                  Sat 10–12 measure · price-sensitive
                </p>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
