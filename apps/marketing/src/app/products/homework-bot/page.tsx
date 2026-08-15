'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FAQ } from '@/components/ui/FAQ';
import { productFAQs } from '@/data/faqs/products';
import { DemoTracker } from '@/components/demos/DemoTracker';

const HomeworkHelpBot = dynamic(
  () => import('@/components/demos/HomeworkHelpBot'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading demo...</p>
        </div>
      </div>
    )
  }
);

function ProductHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700">
      <div className="container-wide">
        <div className="max-w-4xl">
          <nav className="flex items-center gap-2 text-purple-200 text-sm mb-8">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">24/7 Homework Helper</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🤖</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                24/7 AI Homework Helper
              </h1>
              <p className="text-xl text-purple-100 mb-6">
                Instant help, any hour—without adding staff. AI-powered tutoring support that guides students through problems step-by-step.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#demo" className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition">
                  Try Live Demo
                </a>
                <Link href="/contact?product=homework-bot" className="px-6 py-3 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition">
                  Get Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricsSection() {
  const metrics = [
    { value: '24/7', label: 'Always available', icon: '🌙' },
    { value: '< 3 sec', label: 'Response time', icon: '⚡' },
    { value: '40%', label: 'Reduction in churn', icon: '📈' },
    { value: '50+', label: 'Subjects covered', icon: '📚' }
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {metrics.map((metric, idx) => (
            <div key={idx} className="text-center">
              <span className="text-3xl mb-2 block">{metric.icon}</span>
              <div className="text-3xl font-bold text-slate-900">{metric.value}</div>
              <div className="text-sm text-slate-500">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section id="demo" className="py-16 bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Demo
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Try It Now</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Ask any homework question. See how our AI tutor guides students to understanding.
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          <DemoTracker productId="homework-bot" productTitle="24/7 AI Homework Helper">
            <HomeworkHelpBot />
          </DemoTracker>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: 'Step-by-Step Guidance', description: 'Breaks down complex problems into manageable steps', icon: '📋' },
    { title: 'Socratic Method', description: 'Guides discovery instead of just providing answers', icon: '💡' },
    { title: 'Multi-Subject Coverage', description: 'Math, Science, English, History, and more', icon: '📚' },
    { title: 'Conversation History', description: 'Tutors can review student interactions', icon: '💬' },
    { title: 'White-Label Ready', description: 'Your branding, your platform', icon: '🏷️' },
    { title: 'Engagement Tracking', description: 'Monitor student usage and topics', icon: '📊' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Features</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-purple-50 transition-colors">
              <span className="text-3xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const faqs = productFAQs['homework-bot'] || [];
  return (
    <FAQ
      items={faqs}
      title="Frequently Asked Questions"
      description="Common questions about 24/7 AI Homework Helper"
    />
  );
}

function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Provide 24/7 Student Support?</h2>
          <p className="text-xl text-purple-100 mb-8">Let&apos;s discuss how the Homework Helper can work for your business.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact?product=homework-bot" className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-slate-100 transition">
              Get Pricing
            </Link>
            <Link href="/contact?product=homework-bot&demo=true" className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition">
              Book Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedProductsSection() {
  const related = [
    { title: 'AI Essay Scoring', href: '/products/essay-ai', icon: '📝' },
    { title: 'Practice Test Generator', href: '/products/test-generator', icon: '📊' },
    { title: 'Tutoring Co-Pilot', href: '/products/tutor-copilot', icon: '👨‍🏫' }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Other AI Products</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {related.map((product, idx) => (
            <Link key={idx} href={product.href} className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-shadow">
              <span className="text-3xl">{product.icon}</span>
              <span className="font-medium text-slate-900">{product.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeworkBotProductPage() {
  return (
    <main className="pt-16">
      <ProductHero />
      <MetricsSection />
      <DemoSection />
      <FeaturesSection />
      <FAQSection />
      <CTASection />
      <RelatedProductsSection />
    </main>
  );
}
