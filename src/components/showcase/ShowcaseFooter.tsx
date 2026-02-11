'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { SiteContext } from '@/app/showcase/[slug]/ShowcaseLayoutClient';

export function ShowcaseFooter() {
  const site = useContext(SiteContext);

  if (!site) return null;

  const baseUrl = `/showcase/${site.slug}`;

  const quickLinks = [
    { label: 'Home', href: baseUrl },
    { label: 'About Us', href: `${baseUrl}/about` },
    { label: 'Programs', href: `${baseUrl}/programs` },
    { label: 'Our Team', href: `${baseUrl}/team` },
    { label: 'Pricing', href: `${baseUrl}/pricing` },
    { label: 'Contact', href: `${baseUrl}/contact` },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {site.branding.logoUrl ? (
                <img src={site.branding.logoUrl} alt={site.businessName} className="h-10" />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: site.branding.primaryColor }}
                >
                  {site.branding.logoText || site.businessName.charAt(0)}
                </div>
              )}
              <div className="font-bold text-xl">{site.businessName}</div>
            </div>
            {site.tagline && (
              <p className="text-gray-400 mb-4">{site.tagline}</p>
            )}
            <div className="space-y-2 text-gray-400">
              {site.contact.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>{site.contact.address}</span>
                </div>
              )}
              {site.contact.phone && (
                <a href={`tel:${site.contact.phone}`} className="flex items-center gap-2 hover:text-white transition">
                  <Phone className="w-4 h-4" />
                  <span>{site.contact.phone}</span>
                </a>
              )}
              {site.contact.email && (
                <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2 hover:text-white transition">
                  <Mail className="w-4 h-4" />
                  <span>{site.contact.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours & CTA */}
          <div>
            {site.contact.businessHours && (
              <>
                <h3 className="font-semibold text-lg mb-4">Hours</h3>
                <p className="text-gray-400 mb-6">{site.contact.businessHours}</p>
              </>
            )}
            <Link
              href={`${baseUrl}/contact`}
              className="inline-block px-6 py-3 text-white rounded-lg font-medium text-sm transition hover:opacity-90"
              style={{ backgroundColor: site.branding.primaryColor }}
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {site.businessName}. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm">
            Website powered by{' '}
            <a
              href="https://evelynlearning.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: site.branding.primaryColor }}
            >
              Evelyn Learning AI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
