'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FAQ } from '@/components/ui/FAQ';
import { productFAQs } from '@/data/faqs/products';

const ProctoringSuiteDemo = dynamic(
  () => import('@/components/demos/ProctoringSuiteDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading demo...</p>
        </div>
      </div>
    )
  }
);

function ProductHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-rose-600 via-red-600 to-rose-700">
      <div className="container-wide">
        <div className="max-w-4xl">
          <nav className="flex items-center gap-2 text-rose-200 text-sm mb-8">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">AI Proctoring Suite</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🎥</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                AI Proctoring Suite
              </h1>
              <p className="text-xl text-rose-100 mb-6">
                Enterprise-grade exam proctoring with AI-powered face detection, browser lockdown,
                and real-time anomaly detection. FERPA-compliant with human review workflows.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#demo"
                  className="px-6 py-3 bg-white text-rose-600 font-semibold rounded-xl hover:bg-rose-50 transition"
                >
                  Try Live Demo
                </a>
                <Link
                  href="/contact?product=proctoring-suite"
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

function MetricsSection() {
  const metrics = [
    { value: '99.5%', label: 'Face detection accuracy', icon: '👤' },
    { value: '<100ms', label: 'Anomaly detection', icon: '⚡' },
    { value: '24/7', label: 'Monitoring available', icon: '🕐' },
    { value: 'FERPA', label: 'Compliant', icon: '🔒' }
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
          <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Demo
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Try It Now
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Experience real-time proctoring with face detection, browser monitoring, and event logging.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <ProctoringSuiteDemo />
        </div>

        <div className="text-center mt-8">
          <Link
            href="/contact?product=proctoring-suite&demo=true"
            className="inline-flex items-center gap-2 text-rose-500 font-medium hover:text-rose-600"
          >
            Want to see it with your exam system? Book a personalized demo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: 'AI Face Detection',
      description: 'Real-time face verification ensures the registered student is taking the exam.',
      icon: '👤'
    },
    {
      title: 'Browser Lockdown',
      description: 'Prevents tab switching, copy/paste, and unauthorized browser extensions.',
      icon: '🔒'
    },
    {
      title: 'Anomaly Detection',
      description: 'AI monitors for suspicious behavior patterns and flags for review.',
      icon: '🔍'
    },
    {
      title: 'Human Review Queue',
      description: 'Flagged events are queued for instructor review with video timestamps.',
      icon: '👁️'
    },
    {
      title: 'Session Recording',
      description: 'Full session recordings with AI-indexed timestamps for quick review.',
      icon: '📹'
    },
    {
      title: 'Compliance Ready',
      description: 'FERPA, COPPA, and GDPR compliant with data retention controls.',
      icon: '✓'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Features</h2>
          <p className="text-xl text-slate-600">Comprehensive exam integrity protection</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-rose-50 transition-colors">
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

function UseCasesSection() {
  const useCases = [
    {
      title: 'Higher Education',
      description: 'Remote exam administration with academic integrity for large-scale courses.',
      outcomes: ['Reduced cheating incidents', 'Scalable remote testing', 'ADA accommodations']
    },
    {
      title: 'Certification Bodies',
      description: 'High-stakes professional certification exams with audit-ready compliance.',
      outcomes: ['Industry compliance', 'Global accessibility', 'Fraud prevention']
    },
    {
      title: 'K-12 Districts',
      description: 'Standardized testing with age-appropriate monitoring and privacy controls.',
      outcomes: ['COPPA compliant', 'Parent notifications', 'District dashboards']
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Who Uses AI Proctoring?</h2>
          <p className="text-xl text-slate-300">Trusted by institutions worldwide</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-slate-300 mb-4">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
                    <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
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

function ComplianceSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Security & Compliance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { badge: 'FERPA', desc: 'Student Privacy' },
              { badge: 'COPPA', desc: 'Child Protection' },
              { badge: 'SOC 2', desc: 'Data Security' },
              { badge: 'GDPR', desc: 'EU Compliance' }
            ].map((item, idx) => (
              <div key={idx} className="p-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-slate-700">{item.badge}</span>
                </div>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/security" className="inline-flex items-center gap-2 text-rose-600 font-medium mt-8 hover:text-rose-700">
            View full security documentation
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const faqs = productFAQs['proctoring-suite'] || [];
  return (
    <FAQ
      items={faqs}
      title="Frequently Asked Questions"
      description="Common questions about AI Proctoring Suite"
    />
  );
}

function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-rose-600 to-red-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Secure Your Assessments?
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            Let&apos;s discuss how AI Proctoring Suite can protect exam integrity at your institution.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?product=proctoring-suite"
              className="px-8 py-4 bg-white text-rose-600 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Get Pricing
            </Link>
            <Link
              href="/contact?product=proctoring-suite&demo=true"
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

function RelatedProductsSection() {
  const related = [
    { title: 'Practice Test Generator', href: '/products/test-generator', icon: '📊' },
    { title: 'Student Analytics Dashboard', href: '/products/analytics-dashboard', icon: '📈' },
    { title: 'AI Essay Scoring', href: '/products/essay-ai', icon: '📝' }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
          Related Products
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

export default function ProctoringSuitePage() {
  return (
    <main className="pt-16">
      <ProductHero />
      <MetricsSection />
      <DemoSection />
      <FeaturesSection />
      <UseCasesSection />
      <ComplianceSection />
      <FAQSection />
      <CTASection />
      <RelatedProductsSection />
    </main>
  );
}
