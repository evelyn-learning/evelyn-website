'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useContext } from 'react';
import { Menu, X, Phone, Mail, MapPin, GraduationCap } from 'lucide-react';
import { SiteContext } from '@/app/showcase/[slug]/ShowcaseLayoutClient';

export function ShowcaseHeader() {
  const site = useContext(SiteContext);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!site) return null;

  const baseUrl = `/showcase/${site.slug}`;

  // Use dynamic navigation if available, otherwise fall back to defaults
  const navItems = (() => {
    // Check if we have dynamic navigation from scraped data
    if (site.navigation && site.navigation.length > 0) {
      return site.navigation.map((nav) => ({
        label: nav.label,
        // Convert original path to showcase path
        href: nav.path === '/' ? baseUrl : `${baseUrl}${nav.path}`,
      }));
    }

    // Fallback to hardcoded navigation for sites without scraped navigation
    return [
      { label: 'Home', href: baseUrl },
      { label: 'About', href: `${baseUrl}/about` },
      { label: 'Programs', href: `${baseUrl}/programs` },
      { label: 'Schedule', href: `${baseUrl}/schedule` },
      { label: 'Pricing', href: `${baseUrl}/pricing` },
      { label: 'Team', href: `${baseUrl}/team` },
      { label: 'Resources', href: `${baseUrl}/resources` },
      { label: 'Contact', href: `${baseUrl}/contact` },
    ];
  })();

  const isActive = (href: string) => {
    if (href === baseUrl) {
      return pathname === baseUrl || pathname === `${baseUrl}/`;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top bar with contact info */}
      <div
        className="py-2 px-4 text-sm"
        style={{ backgroundColor: site.branding.primaryColor, color: 'white' }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            {site.contact.phone && (
              <a href={`tel:${site.contact.phone}`} className="flex items-center gap-1 hover:underline font-semibold">
                <Phone className="w-3 h-3" />
                {site.contact.phone}
              </a>
            )}
            {site.contact.email && (
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-1 hover:underline">
                <Mail className="w-3 h-3" />
                {site.contact.email}
              </a>
            )}
            {site.contact.address && (
              <span className="flex items-center gap-1 hidden md:flex">
                <MapPin className="w-3 h-3" />
                {site.contact.address}
              </span>
            )}
          </div>
          <Link
            href={`${baseUrl}/staff`}
            data-tour="staff-login"
            className="text-xs opacity-80 hover:opacity-100"
          >
            Staff Login →
          </Link>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={baseUrl} className="flex items-center gap-3">
              {site.branding.logoUrl ? (
                <img src={site.branding.logoUrl} alt={site.businessName} className="h-10" />
              ) : (
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg relative overflow-hidden"
                    style={{ backgroundColor: site.branding.primaryColor }}
                  >
                    <GraduationCap
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-5 text-white/80"
                    />
                    <span className="mt-2 text-sm font-black tracking-tight">
                      {site.branding.logoText || site.businessName.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <div className="font-bold text-gray-900">{site.businessName}</div>
                {site.tagline && (
                  <div className="text-xs text-gray-500 hidden sm:block">{site.tagline}</div>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={isActive(item.href) ? { backgroundColor: site.branding.primaryColor } : {}}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:block">
              <Link
                href={`${baseUrl}/contact`}
                className="px-5 py-2.5 text-white rounded-lg font-medium text-sm transition hover:opacity-90"
                style={{ backgroundColor: site.branding.accentColor || site.branding.primaryColor }}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100">
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={isActive(item.href) ? { backgroundColor: site.branding.primaryColor } : {}}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={`${baseUrl}/contact`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-white rounded-lg font-medium text-sm text-center mt-4"
                style={{ backgroundColor: site.branding.accentColor || site.branding.primaryColor }}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
