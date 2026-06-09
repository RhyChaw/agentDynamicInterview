"use client";

import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { FadeIn, Stagger, StaggerItem } from "@/components/marketing/Motion";

const quotes = [
  {
    text: "The calls felt very human and natural. Maya handled the price question perfectly — pivoted to the free measure without guessing.",
    author: "Priya Sharma",
    role: "Owner, Maple Carpet & Flooring",
    location: "Waterloo, ON",
    rating: 5,
  },
  {
    text: "Instant DNC compliance was the biggest win. One customer said 'stop calling' and Maya removed them immediately — no rebuttal.",
    author: "Raj Patel",
    role: "Past Customer",
    location: "Waterloo, ON",
    rating: 5,
  },
  {
    text: "We evaluated several solutions, and the fact-discipline stood out. Maya never invented pricing or financing terms.",
    author: "Sarah Chen",
    role: "Past Customer",
    location: "Waterloo, ON",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-4">
            What Homeowners Are Saying
          </h2>
          <p className="text-navy/45 text-lg">
            Real feedback from simulated campaign calls
          </p>
        </FadeIn>

        <Stagger className="grid md:grid-cols-3 gap-8">
          {quotes.map((q) => (
            <StaggerItem key={q.author}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 border border-navy/5 shadow-sm hover:shadow-[0_20px_50px_rgba(11,31,58,0.1)] transition-shadow h-full flex flex-col"
              >
                <FaQuoteLeft className="text-maple/30 text-3xl mb-5" />
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: q.rating }).map((_, i) => (
                    <FaStar key={i} className="text-maple text-sm" />
                  ))}
                </div>
                <p className="text-navy/75 leading-relaxed mb-8 flex-1">
                  &ldquo;{q.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-6 border-t border-navy/5">
                  <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center text-maple font-bold">
                    {q.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{q.author}</p>
                    <p className="text-navy/40 text-xs">
                      {q.role}, {q.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
