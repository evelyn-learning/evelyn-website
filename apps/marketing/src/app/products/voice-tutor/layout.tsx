import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';

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
