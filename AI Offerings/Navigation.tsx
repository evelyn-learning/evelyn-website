// =============================================================================
// NAVIGATION COMPONENT - AI-FIRST
// =============================================================================
// File: components/Navigation.tsx
// 
// Updated navigation with product focus and dropdown menus
// =============================================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const navItems = [
    {
      label: 'AI Products',
      href: '/products',
      dropdown: [
        { label: 'AI Essay Scoring', href: '/products/essay-ai', icon: '📝', description: 'Instant rubric-aligned feedback' },
        { label: '24/7 Homework Helper', href: '/products/homework-bot', icon: '🤖', description: 'Always-on student support' },
        { label: 'Practice Test Generator', href: '/products/test-generator', icon: '📊', description: 'Unlimited unique questions' },
        { label: 'Tutoring Co-Pilot', href: '/products/tutor-copilot', icon: '👨‍🏫', description: 'Real-time tutor assistance' },
        { label: 'AI Content Platform', href: '/products/content-ai', icon: '✍️', description: 'Scale content production' },
        { label: 'View All Products', href: '/products', icon: '→', description: 'Compare all AI products', highlight: true }
      ]
    },
    {
      label: 'Solutions',
      href: '/solutions',
      dropdown: [
        { label: 'Test Prep Companies', href: '/solutions/test-prep', icon: '📚', description: 'Scale your test prep business' },
        { label: 'Tutoring Businesses', href: '/solutions/tutoring', icon: '👩‍🏫', description: 'Extend tutor capacity' },
        { label: 'Publishers', href: '/solutions/publishers', icon: '📖', description: 'AI-powered content' },
        { label: 'EdTech Platforms', href: '/solutions/edtech', icon: '💻', description: 'White-label AI tools' },
        { label: 'K-12 Schools', href: '/solutions/k12', icon: '🏫', description: 'Classroom AI integration' }
      ]
    },
    {
      label: 'About',
      href: '/about',
      dropdown: null
    },
    {
      label: 'Resources',
      href: '/resources',
      dropdown: [
        { label: 'Blog', href: '/blog', icon: '📝', description: 'AI in education insights' },
        { label: 'Case Studies', href: '/resources/case-studies', icon: '📈', description: 'Customer success stories' },
        { label: 'Documentation', href: '/docs', icon: '📚', description: 'API and integration guides' },
        { label: 'Webinars', href: '/resources/webinars', icon: '🎥', description: 'Ed-Confabs and events' }
      ]
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold text-slate-900">
              Evelyn<span className="text-indigo-600">Learning</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div 
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    pathname.startsWith(item.href) 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {item.label}
                    {item.dropdown && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </span>
                </Link>

                {/* Dropdown */}
                {item.dropdown && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 w-80">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                      <div className="p-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                              subItem.highlight 
                                ? 'bg-indigo-50 hover:bg-indigo-100' 
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-2xl">{subItem.icon}</span>
                            <div>
                              <div className={`font-medium ${subItem.highlight ? 'text-indigo-600' : 'text-slate-900'}`}>
                                {subItem.label}
                              </div>
                              <div className="text-sm text-slate-500">{subItem.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/contact?demo=true"
              className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Book Demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100">
          <div className="container mx-auto px-6 py-4">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-slate-100 last:border-0">
                <Link
                  href={item.href}
                  className="block py-3 font-medium text-slate-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="pb-3 pl-4 space-y-2">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block py-2 text-sm text-slate-600 hover:text-indigo-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.icon} {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2">
              <Link
                href="/contact"
                className="block w-full py-3 text-center text-slate-600 font-medium border border-slate-200 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/contact?demo=true"
                className="block w-full py-3 text-center bg-indigo-600 text-white font-medium rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
