'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const AnalyticsDashboardDemo = dynamic(
  () => import('@/components/demos/AnalyticsDashboardDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading demo...</p>
        </div>
      </div>
    )
  }
);

function ProductHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800">
      <div className="container-wide">
        <div className="max-w-4xl">
          <nav className="flex items-center gap-2 text-slate-400 text-sm mb-8">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">Analytics Dashboard</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">📊</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Student Analytics Dashboard
              </h1>
              <p className="text-xl text-slate-300 mb-6">
                Real-time insights into student progress, engagement, and learning patterns.
                Identify at-risk students early and make data-driven instructional decisions.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#demo"
                  className="px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl hover:bg-slate-100 transition"
                >
                  Try Live Demo
                </a>
                <Link
                  href="/contact?product=analytics-dashboard"
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
    { value: 'Real-time', label: 'Data updates', icon: '⚡' },
    { value: '50+', label: 'Metrics tracked', icon: '📈' },
    { value: '85%', label: 'Early warning accuracy', icon: '🎯' },
    { value: 'Custom', label: 'Report builder', icon: '📋' }
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
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Interactive Demo
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Explore the Dashboard
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Toggle between class overview and individual student views to see comprehensive analytics.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <AnalyticsDashboardDemo />
        </div>

        <div className="text-center mt-8">
          <Link
            href="/contact?product=analytics-dashboard&demo=true"
            className="inline-flex items-center gap-2 text-blue-500 font-medium hover:text-blue-600"
          >
            Want to see it with your data? Book a personalized demo
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
      title: 'Class Overview',
      description: 'Bird\'s eye view of entire class performance with subject breakdowns.',
      icon: '👥'
    },
    {
      title: 'Individual Profiles',
      description: 'Deep dive into each student with strengths, weaknesses, and activity history.',
      icon: '👤'
    },
    {
      title: 'Early Warning System',
      description: 'AI-powered alerts identify at-risk students before they fall behind.',
      icon: '⚠️'
    },
    {
      title: 'Progress Tracking',
      description: 'Visual progress bars, streak tracking, and mastery indicators.',
      icon: '📈'
    },
    {
      title: 'Custom Reports',
      description: 'Generate reports for parents, administrators, or IEP meetings.',
      icon: '📋'
    },
    {
      title: 'Data Export',
      description: 'Export to CSV, PDF, or integrate via API with your SIS.',
      icon: '📤'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Features</h2>
          <p className="text-xl text-slate-600">Complete visibility into student learning</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors">
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
      title: 'Schools & Districts',
      description: 'Monitor student progress across classrooms and schools with unified dashboards.',
      outcomes: ['District-wide visibility', 'Data-driven decisions', 'Compliance reporting']
    },
    {
      title: 'Tutoring Companies',
      description: 'Track student progress and demonstrate ROI to parents.',
      outcomes: ['Parent engagement', 'Session effectiveness', 'Retention insights']
    },
    {
      title: 'EdTech Platforms',
      description: 'Add analytics layer to your learning platform for institutional sales.',
      outcomes: ['Enterprise feature', 'Admin dashboards', 'Usage analytics']
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Who Uses Analytics Dashboard?</h2>
          <p className="text-xl text-slate-300">Data-driven education at every level</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-slate-300 mb-4">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
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

function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-800 to-blue-900">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Data-Driven Education?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Let&apos;s discuss how Analytics Dashboard can transform your insights.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?product=analytics-dashboard"
              className="px-8 py-4 bg-white text-slate-800 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Get Pricing
            </Link>
            <Link
              href="/contact?product=analytics-dashboard&demo=true"
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
    { title: 'Adaptive Learning', href: '/products/adaptive-learning', icon: '🎯' },
    { title: 'AI Essay Scoring', href: '/products/essay-ai', icon: '📝' },
    { title: 'Practice Test Generator', href: '/products/test-generator', icon: '📊' }
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

export default function AnalyticsDashboardPage() {
  return (
    <main className="pt-16">
      <ProductHero />
      <MetricsSection />
      <DemoSection />
      <FeaturesSection />
      <UseCasesSection />
      <CTASection />
      <RelatedProductsSection />
    </main>
  );
}
