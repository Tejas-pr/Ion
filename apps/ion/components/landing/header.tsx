'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSession, signOut } from "@ion/auth/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Header({ mobileMenuOpen, setMobileMenuOpen }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useRouter();
  const { data: session } = useSession();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = session?.user 
    ? [
        { label: 'Workspace', href: '/workspace' },
        { label: 'From GitHub', href: '/github' },
      ]
    : [
        { label: 'Workspace', href: '/workspace' },
        { label: 'From GitHub', href: '/github' },
        { label: 'Log In', href: '/login' },
      ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-emerald-500/10 dark:border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white">
          <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="text-xl font-bold hidden sm:inline text-black dark:text-white">Ion</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA and Mobile Menu */}
        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full border border-emerald-500/10 dark:border-white/10 bg-white/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-emerald-500/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-500" />
              ) : (
                <Moon size={18} className="text-emerald-700 dark:text-emerald-400" />
              )}
            </button>
          )}

          {mounted && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-500/20 shadow-sm transition-all hover:shadow-md hover:border-emerald-500/40 ml-2 hidden md:block">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 font-semibold">
                      {session.user.name?.charAt(0).toUpperCase() || <User size={16} />}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-emerald-500/10 dark:border-white/10 shadow-xl rounded-xl p-1 z-[100]">
                <div className="flex flex-col space-y-1 p-2 border-b border-emerald-500/10 dark:border-white/10 mb-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.user.email}
                  </p>
                </div>
                <DropdownMenuItem 
                  className="cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50/50 dark:hover:bg-white/5 focus:bg-emerald-50/50 dark:focus:bg-white/5 rounded-md"
                  onClick={() => navigate.push('/workspace')}
                >
                  Workspace
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50/50 dark:hover:bg-white/5 focus:bg-emerald-50/50 dark:focus:bg-white/5 rounded-md"
                  onClick={() => navigate.push('/github')}
                >
                  Import Project
                </DropdownMenuItem>
                <div className="border-t border-emerald-500/10 dark:border-white/10 mt-1 pt-1">
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 font-medium rounded-md"
                    onClick={async () => {
                      await signOut();
                      navigate.push('/');
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            mounted && (
              <Link href="/signup" className="hidden md:inline px-6 py-2 bg-emerald-600 dark:bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors text-sm shadow-sm shadow-emerald-600/10 dark:shadow-emerald-500/5">
                Get Started
              </Link>
            )
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-black dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-black/95 border-t border-black/5 dark:border-white/5">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {session?.user ? (
              <button 
                className="flex w-full items-center justify-center gap-2 mt-4 px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full font-medium hover:bg-red-100 transition-colors text-sm" 
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await signOut();
                  navigate.push('/');
                }}
              >
                <LogOut size={16} />
                Log out
              </button>
            ) : (
              <Link href="/signup" className="block text-center w-full mt-4 px-4 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}



