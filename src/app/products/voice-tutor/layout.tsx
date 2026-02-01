import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';

const productId = 'voice-tutor';
const productName = 'AI Voice Tutor';
const productDescription = 'Real-time AI voice tutoring with visual whiteboard support. Natural voice conversations, step-by-step problem solving, homework upload, and interactive visual explanations for physics, math, and STEM subjects.';

export const metadata: Metadata = {
  title: `${productName} | AI-Powered Learning`,
  description: productDescription,
  keywords: getKeywordsForProduct(productId),
  openGraph: {
    title: `${productName} | Evelyn Learning`,
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
          'Real-time voice tutoring',
          'Visual whiteboard with equations and diagrams',
          'Text and voice input modes',
          'Homework photo upload',
          'Step-by-step problem guidance',
          'White-label deployment ready',
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
