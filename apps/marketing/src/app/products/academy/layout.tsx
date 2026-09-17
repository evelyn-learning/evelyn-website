import { Metadata } from 'next';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { productFAQs } from '@/data/faqs/products';
import { getKeywordsForProduct } from '@/lib/seo/keywords';

const productId = 'academy';
const productName = 'Evelyn Academy';
const productDescription =
  'Evelyn Academy is a white-label AI learning platform: a complete branded academy — courses, lessons, practice and quizzes, mock exams, notes, progress tracking, parent reports and an admin console — with an AI voice tutor teaching every lesson one-to-one on a live whiteboard. An interactive alternative to video-based e-learning courses, already live on Crimsora and Evelyn Tutor. Try the demo on this page.';

export const metadata: Metadata = {
  title: `${productName} | White-Label AI Learning Platform with a Voice Tutor`,
  description: productDescription,
  keywords: [
    ...getKeywordsForProduct(productId),
    'white-label learning platform',
    'white-label LMS',
    'AI learning platform',
    'AI tutor LMS',
    'video course alternative',
    'professional training platform',
    'branded online academy',
  ],
  alternates: { canonical: '/products/academy' },
  openGraph: {
    title: `${productName} | Your Branded AI Academy, with a Voice Tutor in Every Lesson`,
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
          'White-label branding: your name, domain and colour palette',
          'AI voice tutor teaching every lesson on a live whiteboard',
          'Course workspace: lessons, practice and quizzes, mock exams, notes',
          'Tutor-assigned homework and spaced review',
          'Learner model: mastery by objective, gaps, pace against a goal date',
          'Timed mock exam player with score reports',
          'Weekly parent or sponsor progress emails',
          'Admin dashboard with engagement stages and session replays',
          'Courses built from your own syllabus',
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
