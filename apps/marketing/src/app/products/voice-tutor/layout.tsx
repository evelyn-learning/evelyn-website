import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';
import { API_PRICING, PORTAL_LINKS } from '@/lib/portal-links';

const productId = 'voice-tutor';
const productName = 'AI Voice Tutor';
const productDescription = 'An AI voice tutor is an intelligent tutoring system that lets students speak naturally and receive real-time spoken explanations with a visual whiteboard. Evelyn Learning\'s Voice Tutor AI provides 24/7 student support with live equation rendering, step-by-step problem solving, homework photo upload, and 18 tutor personas across math, science, English, history, and test prep — try it live on this page.';

export const metadata: Metadata = {
  title: `${productName} | Voice Tutor AI for 24/7 Student Support`,
  description: productDescription,
  keywords: getKeywordsForProduct(productId),
  alternates: { canonical: '/products/voice-tutor' },
  openGraph: {
    title: `${productName} | Real-Time AI Voice Tutoring with Visual Whiteboard`,
    description: productDescription,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqs = productFAQs[productId] || [];

  return (
    <>
      <SoftwareApplicationJsonLd
        name={productName}
        description={productDescription}
        applicationCategory="Educational Software"
        url={`/products/${productId}`}
        featureList={[
          'Real-time AI voice tutoring conversations',
          'Visual whiteboard with equations, graphs, and diagrams',
          'Text and voice input modes for flexible learning',
          'Homework photo upload with guided step-by-step help',
          'Adaptive learning for physics, math, and STEM subjects',
          '24/7 student support without adding staff',
          'White-label deployment for your platform',
        ]}
        // 2026-11-24: the schema said price "0, contact for enterprise
        // pricing" while the API has public prices. Three true offers: the
        // free sandbox and the two per-minute rates (UN/CEFACT unit MIN).
        offers={[
          {
            '@type': 'Offer',
            name: 'Free sandbox',
            price: '0',
            priceCurrency: 'USD',
            description: `${API_PRICING.sandboxMinutes} tutoring minutes free. Keys on sign-up, no card needed.`,
            url: PORTAL_LINKS.sandbox,
          },
          {
            '@type': 'Offer',
            name: 'Voice Tutor API, voice sessions',
            price: API_PRICING.voicePerMinute,
            priceCurrency: 'USD',
            description: `$${API_PRICING.voicePerMinute} per voice minute`,
            url: PORTAL_LINKS.pricing,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: API_PRICING.voicePerMinute,
              priceCurrency: 'USD',
              unitCode: 'MIN',
            },
          },
          {
            '@type': 'Offer',
            name: 'Voice Tutor API, typed sessions',
            price: API_PRICING.typedPerMinute,
            priceCurrency: 'USD',
            description: `$${API_PRICING.typedPerMinute} per typed minute`,
            url: PORTAL_LINKS.pricing,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: API_PRICING.typedPerMinute,
              priceCurrency: 'USD',
              unitCode: 'MIN',
            },
          },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Products', url: '/products' },
          { name: productName, url: `/products/${productId}` },
        ]}
      />
      {children}
    </>
  );
}
