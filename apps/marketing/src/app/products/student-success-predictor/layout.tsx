import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';

const productId = 'student-success-predictor';
const productName = 'Student Success Predictor';
const productDescription = 'AI-powered early warning system that identifies at-risk students before they fall behind. Integrates with your SIS and LMS for real-time intervention recommendations and improved retention.';

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
          'Multi-factor risk analysis',
          'Early warning alerts',
          'AI intervention recommendations',
          'SIS/LMS integration',
          'Trend visualization',
          'Intervention tracking',
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
