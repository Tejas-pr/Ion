'use client';

import { useState } from 'react';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import Stats from '@/components/landing/stats';
import Collaboration from '@/components/landing/collaboration';
import Footer from '@/components/landing/footer';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen text-gray-900 overflow-x-hidden relative bg-[#f9fdfb]">
      {/* Gorgeous Full-Page Emerald Glow Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(120% 120% at 50% 10%, #ffffff 40%, #e6fcf2 70%, #d1fae5 100%)
          `,
          backgroundAttachment: "fixed",
        }}
      />

      <div className="relative z-10">
        <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <Hero />
        <Stats />
        <Features />
        <Collaboration />
        <Footer />
      </div>
    </main>
  );
}

