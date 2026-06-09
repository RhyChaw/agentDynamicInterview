"use client";

import Link from "next/link";
import { FaChartBar, FaPhone } from "react-icons/fa";
import { Button } from "@/components/ui/Button";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-navy/95 backdrop-blur-md border-b border-white/10 h-[4.5rem]">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-maple flex items-center justify-center font-bold text-navy text-lg">
            M
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">
              Maple Carpet
            </span>
            <span className="text-maple text-xs block -mt-0.5">
              & Flooring
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#products"
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            Products
          </Link>
          <Link
            href="/#how-it-works"
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/dashboard"
            className="text-white/80 hover:text-white text-sm transition-colors flex items-center gap-1.5"
          >
            <FaChartBar className="text-xs" /> Dashboard
          </Link>
        </div>

        <Link href="/demo">
          <Button variant="primary" size="sm" className="gap-2">
            <FaPhone className="text-xs" /> Start a Call
          </Button>
        </Link>
      </div>
    </nav>
  );
}
