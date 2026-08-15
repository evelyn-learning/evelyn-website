"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "../../utils";

interface NavChild {
  name: string;
  href: string;
  description?: string;
}

interface NavItem {
  name: string;
  href: string;
  children?: NavChild[];
}

const navigation: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Products",
    href: "/products",
    children: [
      { name: "All AI Products", href: "/products", description: "24 ready-to-deploy AI tools with live demos" },
      { name: "Flagship Products", href: "/products#flagship", description: "Voice Tutor, Virtual Labs, Essay AI, and more" },
      { name: "Assessment AI", href: "/products#assessment-ai", description: "Essay scoring, proctoring, test generation" },
      { name: "Tutoring AI", href: "/products#tutoring-ai", description: "Homework help, tutoring co-pilot, math solver" },
      { name: "Content AI", href: "/products#content-ai", description: "Authoring, curriculum, accessibility" },
    ],
  },
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "All Services", href: "/services", description: "Professional services for AI success" },
      { name: "AI Readiness Assessment", href: "/services/ai-readiness", description: "Strategic roadmap development" },
      { name: "Implementation & Integration", href: "/services/implementation", description: "LMS, SSO, and API setup" },
      { name: "Training", href: "/services/training", description: "Faculty and staff AI training" },
      { name: "Managed AI Services", href: "/services/managed-services", description: "Hosting, monitoring, support" },
    ],
  },
  {
    name: "Who We Serve",
    href: "/industries",
    children: [
      { name: "Test Prep & Tutoring", href: "/industries/test-prep", description: "Scale your tutoring business with AI" },
      { name: "K-12 Schools", href: "/industries/k12", description: "AI tools for classrooms & districts" },
      { name: "Higher Education", href: "/industries/higher-ed", description: "University & college solutions" },
      { name: "Publishers", href: "/industries/publishers", description: "Transform content with AI" },
      { name: "Enterprise", href: "/industries/enterprise", description: "Workforce learning & upskilling" },
    ],
  },
  {
    name: "Platform",
    href: "/integrations",
    children: [
      { name: "Integrations", href: "/integrations", description: "LMS integrations & API access" },
      { name: "Security & Compliance", href: "/security", description: "Enterprise-grade data protection" },
    ],
  },
  { name: "About", href: "/about" },
  {
    name: "Resources",
    href: "/blog",
    children: [
      { name: "Blog", href: "/blog", description: "Latest insights on AI in education" },
      { name: "Case Studies", href: "/case-studies", description: "Real results from real clients" },
      { name: "Research & White Papers", href: "/research", description: "Original research and reports" },
      { name: "Press", href: "/press/time-top-edtech-2026", description: "Recognition and media coverage" },
      { name: "Interviews", href: "/interviews" },
      { name: "Speakers", href: "/speakers" },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container-wide flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/site/logo-icon.png"
            alt="Evelyn Learning"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <span className="font-heading text-xl">
            <span className="font-normal" style={{ color: '#982c7c' }}>Evelyn</span>
            {' '}
            <span className="font-bold text-gray-900">Learning</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          {navigation.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.name)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-primary-500",
                  item.children && "cursor-pointer"
                )}
              >
                {item.name}
                {item.children && <ChevronDown className="h-4 w-4" />}
              </Link>

              {/* Dropdown */}
              {item.children && openDropdown === item.name && (
                <div className="absolute left-0 top-full z-50 w-64 pt-2">
                  <div className="rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900/5">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-3 hover:bg-gray-50"
                      >
                        <span className="block text-sm font-medium text-gray-900 hover:text-primary-500">
                          {child.name}
                        </span>
                        {child.description && (
                          <span className="block text-xs text-gray-500 mt-0.5">
                            {child.description}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors">
            Contact
          </Link>
          <Link href="/contact?demo=true" className="btn-primary">
            Book Demo
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => !item.children && setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="ml-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/contact?demo=true"
              className="btn-primary mt-4 block w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
