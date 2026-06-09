"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface CarpetRollEntranceProps {
  onComplete: () => void;
}

export function CarpetRollEntrance({ onComplete }: CarpetRollEntranceProps) {
  const [phase, setPhase] = useState<"rolling" | "fade" | "done">("rolling");

  useEffect(() => {
    const rollTimer = setTimeout(() => setPhase("fade"), 1400);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2000);
    return () => {
      clearTimeout(rollTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-navy maple-grain"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fade" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-full max-w-lg h-96 flex flex-col items-center justify-center">
          <motion.p
            className="text-maple text-sm font-semibold tracking-widest uppercase mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Maple Carpet & Flooring
          </motion.p>

          <div className="relative w-80 h-48 perspective-1000">
            <motion.div
              className="absolute inset-x-0 top-0 h-12 rounded-full carpet-texture shadow-2xl"
              style={{ transformOrigin: "center bottom" }}
              initial={{ rotateX: 0, y: 0 }}
              animate={{ rotateX: -90, y: 180 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            />

            <motion.div
              className="absolute inset-x-0 carpet-texture rounded-b-lg shadow-inner"
              style={{ top: "3rem" }}
              initial={{ height: 0, opacity: 0.8 }}
              animate={{ height: 192, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-navy/60 font-bold text-lg tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Unrolling your call...
                </motion.span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-maple"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
