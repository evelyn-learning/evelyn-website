'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/docs', label: 'Docs' },
  { href: '/demo', label: 'Demo' },
  { href: '/pricing', label: 'Pricing' },
];

export function PortalNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Middleware rewrites tutor.evelynlearning.com/docs → /tutor-portal/docs
  // But links should be relative to the subdomain root
  const isActive = (href: string) => {
    const fullPath = `/tutor-portal${href}`;
    return pathname === fullPath || pathname?.startsWith(`${fullPath}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            E
          </div>
          <div>
            <span className="text-lg font-semibold text-white">Voice Tutor</span>
            <span className="ml-2 text-xs text-slate-400">by Evelyn Learning</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/sandbox"
            className="ml-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Request Sandbox
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-slate-800 bg-slate-900 px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                isActive(link.href)
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/sandbox"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white"
          >
            Request Sandbox
          </Link>
        </nav>
      )}
    </header>
  );
}
