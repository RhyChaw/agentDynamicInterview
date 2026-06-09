import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy text-white/60 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-maple flex items-center justify-center font-bold text-navy">
                M
              </div>
              <span className="text-white font-semibold">
                Maple Carpet & Flooring
              </span>
            </div>
            <p className="text-sm max-w-xs">
              Waterloo&apos;s trusted flooring store. AI-powered outbound
              campaigns by Maya.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <p className="text-white font-medium mb-3">Product</p>
              <Link href="/demo" className="block hover:text-white mb-2">
                Call Simulator
              </Link>
              <Link href="/dashboard" className="block hover:text-white">
                Dashboard
              </Link>
            </div>
            <div>
              <p className="text-white font-medium mb-3">Store</p>
              <p>Waterloo, Ontario</p>
              <p>(519) 555-0142</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-sm text-center">
          © 2026 Maple Carpet & Flooring. Built for interview demo.
        </div>
      </div>
    </footer>
  );
}
