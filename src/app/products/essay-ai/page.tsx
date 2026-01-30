'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FAQ } from '@/components/ui/FAQ';
import { productFAQs } from '@/data/faqs/products';

// Dynamically import the demo component (client-side only)
const EssayScoringDemo = dynamic(
  () => import('@/components/demos/EssayScoringDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading demo...</p>
        </div>
      </div>
    )
  }
);

// Product Hero
function ProductHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-600 via-primary-600 to-purple-700">
      <div className="container-wide">
        <div className="max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-purple-200 text-sm mb-8">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">AI Essay Scoring</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">📝</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                AI Essay Scoring & Feedback
              </h1>
              <p className="text-xl text-purple-100 mb-6">
                Professional essay feedback in 10 seconds. Rubric-aligned scoring for SAT, ACT, AP,
                and college applications with detailed, actionable improvement suggestions.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#demo"
                  className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-purple-50 transition"
                >
                  Try Live Demo
                </a>
                <Link
                  href="/contact?product=essay-ai"
                  className="px-6 py-3 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition"
                >
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

// Key Metrics
function MetricsSection() {
  const metrics = [
    { value: '80%', label: 'Grading time saved', icon: '⏱️' },
    { value: '10 sec', label: 'Average feedback time', icon: '⚡' },
    { value: '95%', label: 'Correlation with human graders', icon: '🎯' },
    { value: '∞', label: 'Essays per month', icon: '📈' }
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

// Live Demo Section
function DemoSection() {
  return (
    <section id="demo" className="py-16 bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Demo
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Try It Now
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Paste an essay below or use one of our samples. See the quality of AI feedback for yourself.
          </p>
        </div>

        {/* Demo Component */}
        <div className="max-w-6xl mx-auto">
          <EssayScoringDemo />
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 mb-4">
            This is a live demo using the same AI that powers our production system.
          </p>
          <Link
            href="/contact?product=essay-ai&demo=true"
            className="inline-flex items-center gap-2 text-primary-500 font-medium hover:text-primary-600"
          >
            Want to see it with your content? Book a personalized demo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      title: 'Multiple Rubric Support',
      description: 'Pre-configured for SAT, ACT, AP, and college application essays. Custom rubrics available.',
      icon: '📋'
    },
    {
      title: 'Category Breakdown',
      description: 'Detailed scoring across all rubric categories—specific feedback for each dimension.',
      icon: '📊'
    },
    {
      title: 'Actionable Suggestions',
      description: 'Specific, prioritized improvement recommendations students can act on immediately.',
      icon: '💡'
    },
    {
      title: 'Rewrite Examples',
      description: 'Shows students exactly how to improve with before/after sentence rewrites.',
      icon: '✏️'
    },
    {
      title: 'Progress Tracking',
      description: 'Track improvement over time across multiple submissions.',
      icon: '📈'
    },
    {
      title: 'White-Label Ready',
      description: 'Your branding, your platform. Students never see Evelyn.',
      icon: '🏷️'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Features</h2>
          <p className="text-xl text-slate-600">Everything you need for comprehensive essay feedback</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-primary-50 transition-colors">
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

// Use Cases Section
function UseCasesSection() {
  const useCases = [
    {
      title: 'Test Prep Companies',
      description: 'Let students practice unlimited essays with instant feedback. Tutors review AI scores and add strategic guidance.',
      outcomes: ['More essay practice per student', 'Tutors focus on strategy', 'Better score improvements']
    },
    {
      title: 'College Counselors',
      description: 'Give students rapid feedback on application essays. Iterate faster through multiple drafts.',
      outcomes: ['Faster revision cycles', 'More students served', 'Higher quality final essays']
    },
    {
      title: 'Schools & Districts',
      description: 'Provide writing feedback at scale without overwhelming teachers. Track writing development.',
      outcomes: ['Teacher time saved', 'Consistent feedback quality', 'Data-driven writing instruction']
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Who Uses Essay Scoring?</h2>
          <p className="text-xl text-slate-300">Built for education businesses that need scale</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-slate-300 mb-4">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 to-purple-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Scale Your Essay Feedback?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Let&apos;s discuss how AI Essay Scoring can work for your business.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?product=essay-ai"
              className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Get Pricing
            </Link>
            <Link
              href="/contact?product=essay-ai&demo=true"
              className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Book Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Related Products
function RelatedProductsSection() {
  const related = [
    { title: '24/7 Homework Helper', href: '/products/homework-bot', icon: '🤖' },
    { title: 'Practice Test Generator', href: '/products/test-generator', icon: '📊' },
    { title: 'Tutoring Co-Pilot', href: '/products/tutor-copilot', icon: '👨‍🏫' }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
          Other AI Products
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {related.map((product, idx) => (
            <Link
              key={idx}
              href={product.href}
              className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl">{product.icon}</span>
              <span className="font-medium text-slate-900">{product.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const faqs = productFAQs['essay-ai'] || [];
  return (
    <FAQ
      items={faqs}
      title="Frequently Asked Questions"
      description="Common questions about AI Essay Scoring"
    />
  );
}

// Main Page
export default function EssayAIProductPage() {
  return (
    <main className="pt-16">
      <ProductHero />
      <MetricsSection />
      <DemoSection />
      <FeaturesSection />
      <UseCasesSection />
      <FAQSection />
      <CTASection />
      <RelatedProductsSection />
    </main>
  );
}
