'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import { SiteContext } from '@/app/showcase/[slug]/ShowcaseLayoutClient';
import type { ShowcaseSiteData, ShowcasePageData, ShowcaseSectionData } from './ShowcaseContext';

interface DynamicPageRendererProps {
  page: ShowcasePageData;
}

// Individual section renderers
function HeroSection({ section, site }: { section: ShowcaseSectionData; site: ShowcaseSiteData }) {
  const baseUrl = `/showcase/${site.slug}`;

  return (
    <section
      className="py-16 md:py-24"
      style={{
        background: section.backgroundColor
          ? section.backgroundColor
          : `linear-gradient(135deg, ${site.branding.primaryColor} 0%, ${site.branding.secondaryColor} 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl">
          {section.title && (
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {section.title}
            </h1>
          )}
          {section.subtitle && (
            <p className="text-xl text-white/90 mb-8">{section.subtitle}</p>
          )}
          {section.content && (
            <p className="text-lg text-white/80 mb-8">{section.content}</p>
          )}
          <Link
            href={`${baseUrl}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TextSection({ section, site }: { section: ShowcaseSectionData; site: ShowcaseSiteData }) {
  return (
    <section
      className="py-12 md:py-16"
      style={{ backgroundColor: section.backgroundColor || 'white' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className={`max-w-4xl ${section.textAlign === 'center' ? 'mx-auto text-center' : ''}`}>
          {section.title && (
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: site.branding.primaryColor }}
            >
              {section.title}
            </h2>
          )}
          {section.subtitle && (
            <p className="text-lg text-gray-600 mb-6">{section.subtitle}</p>
          )}
          {section.content && (
            <div className="prose prose-lg max-w-none text-gray-700">
              {section.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ListSection({ section, site }: { section: ShowcaseSectionData; site: ShowcaseSiteData }) {
  return (
    <section
      className="py-12 md:py-16"
      style={{ backgroundColor: section.backgroundColor || '#f9fafb' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {section.title && (
          <h2
            className="text-2xl md:text-3xl font-bold mb-8"
            style={{ color: site.branding.primaryColor }}
          >
            {section.title}
          </h2>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          {section.items?.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${site.branding.primaryColor}15` }}
              >
                <Check
                  className="w-4 h-4"
                  style={{ color: site.branding.primaryColor }}
                />
              </div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardsSection({ section, site }: { section: ShowcaseSectionData; site: ShowcaseSiteData }) {
  return (
    <section
      className="py-12 md:py-16"
      style={{ backgroundColor: section.backgroundColor || 'white' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {section.title && (
          <h2
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            style={{ color: site.branding.primaryColor }}
          >
            {section.title}
          </h2>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.cards?.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              {card.image && (
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                {card.price && (
                  <p
                    className="text-xl font-bold mb-2"
                    style={{ color: site.branding.primaryColor }}
                  >
                    {card.price}
                  </p>
                )}
                {card.description && (
                  <p className="text-gray-600 text-sm">{card.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ section, site }: { section: ShowcaseSectionData; site: ShowcaseSiteData }) {
  return (
    <section
      className="py-12 md:py-16"
      style={{ backgroundColor: section.backgroundColor || '#f9fafb' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {section.title && (
          <h2
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            style={{ color: site.branding.primaryColor }}
          >
            {section.title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {section.images?.map((image, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              {image.caption && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <p className="text-white text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ section, site }: { section: ShowcaseSectionData; site: ShowcaseSiteData }) {
  return (
    <section
      className="py-12 md:py-16"
      style={{ backgroundColor: section.backgroundColor || 'white' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {section.title && (
          <h2
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            style={{ color: site.branding.primaryColor }}
          >
            {section.title}
          </h2>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.cards?.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl p-6 relative"
            >
              <Quote
                className="absolute top-4 right-4 w-8 h-8 opacity-10"
                style={{ color: site.branding.primaryColor }}
              />
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.description}"
              </p>
              <div className="flex items-center gap-3">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.title}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ section, site }: { section: ShowcaseSectionData; site: ShowcaseSiteData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="py-12 md:py-16"
      style={{ backgroundColor: section.backgroundColor || '#f9fafb' }}
    >
      <div className="max-w-3xl mx-auto px-4">
        {section.title && (
          <h2
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            style={{ color: site.branding.primaryColor }}
          >
            {section.title}
          </h2>
        )}
        <div className="space-y-4">
          {section.cards?.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-semibold text-gray-900">{faq.title}</span>
                {openIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openIndex === idx && faq.description && (
                <div className="px-4 pb-4">
                  <p className="text-gray-600">{faq.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ section, site }: { section: ShowcaseSectionData; site: ShowcaseSiteData }) {
  const baseUrl = `/showcase/${site.slug}`;

  return (
    <section
      className="py-12"
      style={{ backgroundColor: site.branding.primaryColor }}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        {section.title && (
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p className="text-white/90 mb-6">{section.subtitle}</p>
        )}
        <Link
          href={`${baseUrl}/contact`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition"
        >
          Contact Us
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

function ImageSection({ section }: { section: ShowcaseSectionData }) {
  const image = section.images?.[0];
  if (!image) return null;

  return (
    <section className="py-8" style={{ backgroundColor: section.backgroundColor || 'white' }}>
      <div className={section.fullWidth ? '' : 'max-w-7xl mx-auto px-4'}>
        <img
          src={image.url}
          alt={image.alt}
          className={`w-full ${section.fullWidth ? '' : 'rounded-xl'} object-cover max-h-[500px]`}
        />
        {image.caption && (
          <p className="text-center text-gray-500 text-sm mt-2">{image.caption}</p>
        )}
      </div>
    </section>
  );
}

function RawSection({ section }: { section: ShowcaseSectionData }) {
  if (!section.content) return null;

  return (
    <section
      className="py-12"
      style={{ backgroundColor: section.backgroundColor || 'white' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </div>
    </section>
  );
}

// Main component that renders a section based on its type
function SectionRenderer({ section, site }: { section: ShowcaseSectionData; site: ShowcaseSiteData }) {
  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} site={site} />;
    case 'text':
    case 'heading':
      return <TextSection section={section} site={site} />;
    case 'list':
      return <ListSection section={section} site={site} />;
    case 'cards':
    case 'pricing':
    case 'team':
      return <CardsSection section={section} site={site} />;
    case 'gallery':
      return <GallerySection section={section} site={site} />;
    case 'testimonials':
      return <TestimonialsSection section={section} site={site} />;
    case 'faq':
      return <FAQSection section={section} site={site} />;
    case 'cta':
      return <CTASection section={section} site={site} />;
    case 'image':
      return <ImageSection section={section} />;
    case 'contact':
      // Contact sections are handled by the dedicated contact page
      return <TextSection section={section} site={site} />;
    case 'raw':
      return <RawSection section={section} />;
    default:
      return <TextSection section={section} site={site} />;
  }
}

// Main page renderer component
export function DynamicPageRenderer({ page }: DynamicPageRendererProps) {
  const site = useContext(SiteContext);

  if (!site) return null;

  // If no sections, show a placeholder
  if (!page.sections || page.sections.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{page.title}</h1>
          <p className="text-gray-600">
            This page content is being prepared. Please check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {page.sections.map((section, idx) => (
        <SectionRenderer key={idx} section={section} site={site} />
      ))}
    </div>
  );
}

export default DynamicPageRenderer;
