import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';

const productId = 'virtual-labs';
const productName = 'Virtual Lab Simulations';
const productDescription = 'Virtual lab simulations are interactive online science experiments that let students perform physics, chemistry, and biology labs safely without physical equipment. Evelyn Learning\'s AI-powered virtual labs provide hands-on STEM learning with realistic simulations, real-time data collection, and guided lab activities that are scalable and infinitely repeatable.';

export const metadata: Metadata = {
  title: `Virtual Lab Simulations | AI-Powered Online Science Experiments`,
  description: productDescription,
  keywords: getKeywordsForProduct(productId),
  openGraph: {
    title: `${productName} | Interactive Science Lab Simulations for Education`,
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
          'Interactive physics, chemistry, and biology simulations',
          'Safe online science experiments without physical equipment',
          'Real-time parameter controls and data collection',
          'Guided lab activities aligned to NGSS and state standards',
          'Built-in assessment with lab notebooks and grade reports',
          'Infinitely repeatable experiments for student mastery',
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
