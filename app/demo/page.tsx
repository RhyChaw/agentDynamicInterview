"use client";

import { useState } from "react";
import { CarpetRollEntrance } from "@/components/demo/CarpetRollEntrance";
import { CallSimulator } from "@/components/demo/CallSimulator";

export default function DemoPage() {
  const [showEntrance, setShowEntrance] = useState(true);

  return (
    <div className="bg-cream h-[calc(100vh-4.5rem)] flex flex-col overflow-hidden">
      {showEntrance && (
        <CarpetRollEntrance onComplete={() => setShowEntrance(false)} />
      )}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col flex-1 min-h-0 w-full">
        <div className="mb-4 shrink-0">
          <h1 className="text-2xl font-bold text-navy">Call Simulator</h1>
          <p className="text-navy/60 text-sm mt-0.5">
            Text or voice outbound call with Maya — Claude + System_prompt.md
          </p>
        </div>
        <div className="flex-1 min-h-0">
          <CallSimulator />
        </div>
      </div>
    </div>
  );
}
