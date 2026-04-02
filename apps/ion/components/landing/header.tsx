'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation'

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Header({ mobileMenuOpen, setMobileMenuOpen }: HeaderProps) {
  const [themeLogo, setThemeLogo] = useState<'light' | 'dark'>('dark');
  const navigate = useRouter();

  const navItems = [
    { label: 'Products', href: '#' },
    { label: 'Solutions', href: '#' },
    { label: 'Resources', href: '#' },
    { label: 'Enterprise', href: '#' },
    { label: 'Pricing', href: '#' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setThemeLogo(themeLogo === 'light' ? 'dark' : 'light')}>
          {themeLogo === 'dark' ? (
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="2" width="8" height="8" />
              <rect x="14" y="2" width="8" height="8" />
              <rect x="2" y="14" width="8" height="8" />
              <rect x="14" y="14" width="8" height="8" />
            </svg>
          )}
          <span className="text-xl font-bold hidden sm:inline">Ion</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA and Mobile Menu */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate.push('/signup')} className="hidden md:inline px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors text-sm">
            Get Started
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-sm text-gray-300 hover:text-white transition-colors py-2"
              >
                {item.label}
              </a>
            ))}
            <button className="w-full mt-4 px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors text-sm">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
