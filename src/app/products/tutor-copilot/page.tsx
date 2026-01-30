'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FAQ } from '@/components/ui/FAQ';
import { productFAQs } from '@/data/faqs/products';

const TutoringCoPilot = dynamic(
  () => import('@/components/demos/TutoringCoPilot'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-slate-800 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading demo...</p>
        </div>
      </div>
    )
  }
);

function ProductHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-600 via-red-600 to-orange-700">
      <div className="container-wide">
        <div className="max-w-4xl">
          <nav className="flex items-center gap-2 text-orange-200 text-sm mb-8">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">Tutoring Co-Pilot</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">👨‍🏫</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                AI Tutoring Co-Pilot
              </h1>
              <p className="text-xl text-orange-100 mb-6">
                Make every tutor your best tutor. Real-time AI assistance with teaching suggestions, student insights, and misconception detection.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#demo" className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition">
                  Try Live Demo
                </a>
                <Link href="/contact?product=tutor-copilot" className="px-6 py-3 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition">
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
    { value: '2-3x', label: 'Tutor capacity', icon: '📈' },
    { value: '50%', label: 'Faster onboarding', icon: '⚡' },
    { value: '100%', label: 'Consistent quality', icon: '🎯' },
    { value: 'Real-time', label: 'Suggestions', icon: '💬' }
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
    <section id="demo" className="py-16 bg-slate-900">
      <div className="container-wide">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live Session Demo
          </span>
          <h2 className="text-3xl font-bold text-white mb-2">Try It Now</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Simulate a tutoring session. Send student messages and see real-time AI suggestions.
          </p>
        </div>
        <div className="max-w-7xl mx-auto">
          <TutoringCoPilot />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: 'Real-Time Suggestions', description: 'Teaching strategies as the conversation unfolds', icon: '💡' },
    { title: 'Student Profiles', description: 'Learning style and history integration', icon: '👤' },
    { title: 'Misconception Alerts', description: 'Identify conceptual misunderstandings', icon: '⚠️' },
    { title: 'Session Summaries', description: 'Auto-generated notes and next steps', icon: '📝' },
    { title: 'Progress Tracking', description: 'Student performance over time', icon: '📊' },
    { title: 'Tutor Training', description: 'Faster onboarding for new tutors', icon: '🎓' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Features</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-orange-50 transition-colors">
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
  const faqs = productFAQs['tutor-copilot'] || [];
  return (
    <FAQ
      items={faqs}
      title="Frequently Asked Questions"
      description="Common questions about AI Tutoring Co-Pilot"
    />
  );
}

function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-600 to-red-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Supercharge Your Tutors?</h2>
          <p className="text-xl text-orange-100 mb-8">Let&apos;s discuss how the Co-Pilot can transform your tutoring business.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact?product=tutor-copilot" className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-slate-100 transition">
              Get Pricing
            </Link>
            <Link href="/contact?product=tutor-copilot&demo=true" className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition">
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
    { title: '24/7 Homework Helper', href: '/products/homework-bot', icon: '🤖' },
    { title: 'Practice Test Generator', href: '/products/test-generator', icon: '📊' }
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

export default function TutorCopilotProductPage() {
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
