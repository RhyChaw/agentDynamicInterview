"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaBullhorn, FaPhoneVolume, FaRuler } from "react-icons/fa";
import { FadeIn, Stagger, StaggerItem } from "@/components/marketing/Motion";
import { images } from "@/lib/images";

const products = [
  {
    title: "Sales Agent",
    description:
      "Answers outbound calls to past customers, qualifies interest, and books measure appointments around the clock.",
    icon: FaPhoneVolume,
    image: images.phoneCall,
    accent: "from-navy to-navy-light",
  },
  {
    title: "Measure Agent",
    description:
      "Handles scheduling for free in-home measures, checks availability, and confirms addresses on file.",
    icon: FaRuler,
    image: images.measureInHome,
    accent: "from-maple to-maple-light",
  },
  {
    title: "Sale Campaigns",
    description:
      "Automated follow-ups for weekend sales, missed calls, and inactive leads — voice and text unified.",
    icon: FaBullhorn,
    image: images.showroom,
    accent: "from-navy to-[#1a3a5c]",
  },
];

export function Products() {
  return (
    <section id="products" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <p className="text-maple text-sm font-semibold tracking-widest uppercase mb-3">
            Our Products
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-4">
            AI for Flooring Sales & Service
          </h2>
          <p className="text-navy/55 max-w-2xl mx-auto text-lg">
            Maya is an AI Employee built for flooring stores, handling real sales
            conversations across voice and messaging.
          </p>
        </FadeIn>

        <Stagger className="grid md:grid-cols-3 gap-8">
          {products.map((p) => (
            <StaggerItem key={p.title}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(11,31,58,0.06)] border border-navy/5 hover:shadow-[0_20px_60px_rgba(11,31,58,0.12)] group h-full"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${p.accent} opacity-60 group-hover:opacity-40 transition-opacity`} />
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center shadow-lg">
                    <p.icon className="text-navy text-lg" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-navy mb-3">{p.title}</h3>
                  <p className="text-navy/55 leading-relaxed text-sm">
                    {p.description}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn delay={0.3} className="text-center mt-14">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 text-navy font-semibold hover:text-maple transition-colors group"
          >
            Try the call simulator
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
