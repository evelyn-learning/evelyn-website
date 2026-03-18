import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';

const productId = 'career-pathways';
const productName = 'Career Pathways AI';
const productDescription = 'AI-powered career exploration software and career guidance platform that provides skill gap analysis, career matching, and personalized course recommendations based on real job market data. Connect education to employment with AI-driven career path planning for students, workforce development programs, and higher education career services.';

export const metadata: Metadata = {
  title: `AI Career Exploration Platform | Career Guidance & Skill Gap Analysis Software`,
  description: productDescription,
  keywords: getKeywordsForProduct(productId),
  openGraph: {
    title: `${productName} | AI Career Exploration & Skill Gap Analysis Platform`,
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
          'AI-powered skill gap analysis and assessment',
          'Career exploration software with 500+ career paths',
          'Real-time job market data and salary insights',
          'Personalized learning path recommendations',
          'Career guidance platform for students and professionals',
          'Workforce development and reskilling tools',
          'Employer insights and competency mapping',
          'Career development platform with credential tracking',
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
