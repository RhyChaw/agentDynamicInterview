"use client";

import { FaCalendarCheck, FaPercent, FaStopwatch } from "react-icons/fa";
import { FadeIn, Stagger, StaggerItem } from "@/components/marketing/Motion";

const stats = [
  { icon: FaPercent, value: "40%", label: "Off this weekend only" },
  { icon: FaStopwatch, value: "< 2 min", label: "Average call length" },
  { icon: FaCalendarCheck, value: "Free", label: "In-home measure" },
];

export function StatsBar() {
  return (
    <section className="bg-white relative z-10 -mt-8 pb-4">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="bg-white rounded-2xl p-6 shadow-[0_8px_40px_rgba(11,31,58,0.08)] border border-navy/5 flex items-center gap-5 hover:shadow-[0_12px_48px_rgba(11,31,58,0.12)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center shrink-0">
                    <s.icon className="text-maple text-xl" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-navy tracking-tight">
                      {s.value}
                    </p>
                    <p className="text-navy/50 text-sm">{s.label}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </FadeIn>
      </div>
    </section>
  );
}
