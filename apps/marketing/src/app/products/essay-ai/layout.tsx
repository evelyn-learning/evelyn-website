import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';

const productId = 'essay-ai';
const productName = 'AI Essay Scoring & Feedback';
const productDescription = 'AI essay feedback generator that scores and grades essays in 10 seconds using analytic rubrics. Automated essay scoring software with rubric-aligned feedback for SAT, ACT, AP Lang, AP Lit, and college applications. Custom rubric essay grader with detailed category breakdowns and actionable improvement suggestions for teachers and students.';

export const metadata: Metadata = {
  title: `AI Essay Feedback & Grading Software | Analytic Rubric Essay Scoring`,
  description: productDescription,
  keywords: getKeywordsForProduct(productId),
  openGraph: {
    title: `${productName} | AI Essay Feedback Generator for Teachers & Students`,
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
          'AI essay feedback in under 10 seconds',
          'Analytic rubric scoring for SAT, ACT, AP Lang, and AP Lit essays',
          'Custom rubric essay grader for any curriculum',
          'Detailed category breakdown with specific improvement suggestions',
          'Before/after rewrite examples for student learning',
          'Automated essay scoring for schools and districts at scale',
          'College application essay feedback and scoring',
          'Progress tracking across multiple submissions',
          'White-label essay grading software for EdTech platforms',
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
