"use client";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">RA</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">Resume AI</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-600 hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-gray-600 hover:text-primary transition-colors">How it works</a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-primary transition-colors">Pricing</a>
          <a href="#faq" className="text-sm text-gray-600 hover:text-primary transition-colors">FAQ</a>
          <a href="/app/login" className="text-sm text-gray-600 hover:text-primary transition-colors">Sign in</a>
          <a
            href="/app/register"
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started Free
          </a>
        </nav>

        {/* Mobile burger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <div className={`w-5 h-0.5 bg-gray-700 transition-all ${open ? "rotate-45 translate-y-1.5" : ""}`} />
          <div className={`w-5 h-0.5 bg-gray-700 my-1 transition-all ${open ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-gray-700 transition-all ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
          <a href="#features" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-sm text-gray-700" onClick={() => setOpen(false)}>How it works</a>
          <a href="#pricing" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Pricing</a>
          <a href="#faq" className="text-sm text-gray-700" onClick={() => setOpen(false)}>FAQ</a>
          <a href="/app/login" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Sign in</a>
          <a
            href="/app/register"
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
          >
            Get Started Free
          </a>
        </div>
      )}
    </header>
  );
}
