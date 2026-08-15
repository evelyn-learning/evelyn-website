import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';

const productId = 'textbook-digitizer';
const productName = 'Textbook Digitizer';
const productDescription = 'Convert print textbooks to interactive digital formats with auto-generated quizzes, flashcards, highlights, and study tools. Monetize backlist content with AI-powered digitization.';

export const metadata: Metadata = {
  title: `${productName} | AI-Powered Content Transformation`,
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
          'PDF to interactive conversion',
          'Auto quiz generation',
          'Flashcard creation',
          'Chapter summaries',
          'WCAG accessibility ready',
          'Multi-format export',
          'OCR text extraction',
          'Study tool integration',
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
