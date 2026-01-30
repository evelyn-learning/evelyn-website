import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';

const productId = 'plagiarism-detection';
const productName = 'Plagiarism & AI Detection';
const productDescription = 'Comprehensive originality checking with AI-generated content detection. Identify plagiarism, AI writing, and contract cheating with industry-leading accuracy. FERPA compliant with LMS integration.';

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
          'AI-generated content detection',
          'Source matching against 100B+ pages',
          'Similarity highlighting with citations',
          'Writing pattern analysis',
          'Educational feedback reports',
          'LMS integration (Canvas, Blackboard, Moodle)',
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
