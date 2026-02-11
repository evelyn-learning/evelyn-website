'use client';

import { useContext } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SiteContext } from '../ShowcaseLayoutClient';
import { DynamicPageRenderer } from '@/components/showcase/DynamicPageRenderer';

interface PageProps {
  params: Promise<{ slug: string; path: string[] }>;
}

export default function DynamicShowcasePage({ params }: PageProps) {
  const site = useContext(SiteContext);

  // We need to handle the async params - for now use a workaround
  // In Next.js 15, params are async, but we're using client component with context
  // The path is already available through window.location in client components

  if (!site) return null;

  const baseUrl = `/showcase/${site.slug}`;

  // Get current path from window.location (client-side)
  const currentPath = typeof window !== 'undefined'
    ? window.location.pathname.replace(`/showcase/${site.slug}`, '') || '/'
    : '/';

  // Find the matching page from scraped pages
  const page = site.scrapedPages?.find(p => p.path === currentPath);

  // If no matching page found, show a fallback
  if (!page) {
    // Check if this is a known route that should have a hardcoded page
    const knownRoutes = ['/about', '/contact', '/programs', '/pricing', '/team', '/resources', '/schedule'];
    const isKnownRoute = knownRoutes.some(r => currentPath.startsWith(r));

    // If it's a known route without scraped content, let them use the hardcoded pages
    // This helps with backwards compatibility
    if (isKnownRoute) {
      // Redirect to the hardcoded version - this shouldn't happen normally
      // as Next.js will match specific routes before catch-all
      return null;
    }

    // For unknown routes with no scraped content, show a 404-style page
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or hasn't been set up yet.
          </p>
          <Link
            href={baseUrl}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition"
            style={{ backgroundColor: site.branding.primaryColor }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Render the dynamic page content */}
      <DynamicPageRenderer page={page} />

      {/* CTA Section - Always show at the bottom */}
      <section
        className="py-12"
        style={{ backgroundColor: site.branding.primaryColor }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-6">
            Contact us to learn more about how we can help you achieve your goals.
          </p>
          <Link
            href={`${baseUrl}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition"
          >
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
