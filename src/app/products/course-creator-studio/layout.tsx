import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';

const productId = 'course-creator-studio';
const productName = 'AI Course Creator Studio';
const productDescription = 'Transform documents, videos, or raw content into complete, interactive courses. Auto-generates quizzes, learning paths, and LMS-ready packages in minutes. An AI-powered course authoring platform for publishers, corporate L&D, and higher education.';

export const metadata: Metadata = {
  title: `${productName} | AI-Powered Course Authoring`,
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
          'Multi-format input (PDF, video, PowerPoint)',
          'Smart content chunking',
          'Auto-generated assessments',
          'Learning objectives creation',
          'SCORM/xAPI export',
          'Interactive elements',
          'LMS integrations',
          'White-label ready',
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
