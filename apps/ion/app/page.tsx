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
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Hero />
      <Stats />
      <Features />
      <Collaboration />
      <Footer />
    </main>
  );
}
