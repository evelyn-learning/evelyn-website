"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
    name: "What We Offer",
    href: "/products",
    children: [
      { name: "AI Products", href: "/products", description: "Ready-to-deploy AI tools with live demos" },
      { name: "Custom AI Development", href: "/services/custom-ai", description: "Bespoke AI solutions for your business" },
      { name: "Content Services", href: "/services/content", description: "Curriculum, assessments & content development" },
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
      { name: "Blog", href: "/blog" },
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
        <div className="lg:hidden">
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
