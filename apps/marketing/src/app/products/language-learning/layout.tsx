import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';

const productId = 'language-learning';
const productName = 'Language Learning AI';
const productDescription = 'Conversational AI for language practice in real-world scenarios. Practice speaking with an AI that adapts to your level and provides instant feedback in Spanish, French, German, Japanese, and Mandarin.';

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
          'Conversational practice in 5+ languages',
          'Adaptive difficulty levels',
          'Instant grammar corrections',
          'Translation toggle support',
          'Response suggestions',
          'Progress tracking',
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
