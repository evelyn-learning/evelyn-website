'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FAQ } from '@/components/ui/FAQ';
import { productFAQs } from '@/data/faqs/products';

const StudentSuccessPredictorDemo = dynamic(
  () => import('@/components/demos/StudentSuccessPredictorDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading demo...</p>
        </div>
      </div>
    )
  }
);

function ProductHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700">
      <div className="container-wide">
        <div className="max-w-4xl">
          <nav className="flex items-center gap-2 text-amber-200 text-sm mb-8">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">Student Success Predictor</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">📈</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Student Success Predictor
              </h1>
              <p className="text-xl text-amber-100 mb-6">
                AI-powered early warning system that identifies at-risk students before they fall behind.
                Integrates with your SIS and LMS for real-time intervention recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#demo"
                  className="px-6 py-3 bg-white text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition"
                >
                  Try Live Demo
                </a>
                <Link
                  href="/contact?product=student-success-predictor"
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
    { value: '85%', label: 'Prediction accuracy', icon: '🎯' },
    { value: '3 weeks', label: 'Early detection', icon: '⏰' },
    { value: '40%', label: 'Improved retention', icon: '📊' },
    { value: 'Real-time', label: 'Data integration', icon: '🔄' }
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
          <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Demo
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Try It Now
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Explore the early warning dashboard with sample student data and AI-generated insights.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <StudentSuccessPredictorDemo />
        </div>

        <div className="text-center mt-8">
          <Link
            href="/contact?product=student-success-predictor&demo=true"
            className="inline-flex items-center gap-2 text-amber-500 font-medium hover:text-amber-600"
          >
            Want to see it with your student data? Book a personalized demo
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
      title: 'Multi-Factor Risk Analysis',
      description: 'Combines grades, attendance, LMS engagement, and behavioral patterns for comprehensive risk assessment.',
      icon: '📊'
    },
    {
      title: 'Early Warning Alerts',
      description: 'Automated alerts to counselors, teachers, and administrators when students show risk indicators.',
      icon: '🔔'
    },
    {
      title: 'AI Recommendations',
      description: 'Personalized intervention suggestions based on student-specific risk factors.',
      icon: '💡'
    },
    {
      title: 'SIS/LMS Integration',
      description: 'Direct integration with Canvas, Blackboard, PowerSchool, and other major platforms.',
      icon: '🔌'
    },
    {
      title: 'Trend Visualization',
      description: 'Historical performance trends and predictive trajectories for each student.',
      icon: '📈'
    },
    {
      title: 'Intervention Tracking',
      description: 'Track intervention effectiveness and adjust strategies based on outcomes.',
      icon: '✓'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Features</h2>
          <p className="text-xl text-slate-600">Comprehensive student success monitoring</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-amber-50 transition-colors">
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

function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: 'Connect Your Data',
      description: 'Integrate with your SIS, LMS, and other student information sources.'
    },
    {
      step: 2,
      title: 'AI Analyzes Patterns',
      description: 'Our models identify risk factors based on historical and real-time data.'
    },
    {
      step: 3,
      title: 'Get Early Alerts',
      description: 'Receive notifications when students show early warning signs.'
    },
    {
      step: 4,
      title: 'Take Action',
      description: 'Follow AI-recommended interventions and track outcomes.'
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-slate-300">From data to intervention in real-time</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center relative">
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-amber-500/30" />
              )}
              <div className="w-16 h-16 mx-auto bg-amber-500 rounded-full flex items-center justify-center text-2xl font-bold mb-4 relative z-10">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm">{step.description}</p>
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
      title: 'K-12 Districts',
      description: 'Identify struggling students early and coordinate support across schools.',
      outcomes: ['Improved graduation rates', 'Targeted resource allocation', 'Family engagement alerts']
    },
    {
      title: 'Higher Education',
      description: 'Improve retention by identifying at-risk students in the critical first year.',
      outcomes: ['First-year retention boost', 'Academic advising support', 'Financial aid optimization']
    },
    {
      title: 'Online Learning',
      description: 'Combat course abandonment with engagement-based risk detection.',
      outcomes: ['Reduced dropout rates', 'Proactive outreach', 'Engagement optimization']
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Who Uses Success Predictor?</h2>
          <p className="text-xl text-slate-600">Improving outcomes at every level</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{useCase.title}</h3>
              <p className="text-slate-600 mb-4">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
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

// FAQ Section
function FAQSection() {
  const faqs = productFAQs['student-success-predictor'] || [];
  return (
    <FAQ
      items={faqs}
      title="Frequently Asked Questions"
      description="Common questions about Student Success Predictor"
    />
  );
}

function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-600 to-orange-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Predict and Prevent Student Struggles?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Let&apos;s discuss how Student Success Predictor can improve outcomes at your institution.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?product=student-success-predictor"
              className="px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Get Pricing
            </Link>
            <Link
              href="/contact?product=student-success-predictor&demo=true"
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
    { title: 'Student Analytics Dashboard', href: '/products/analytics-dashboard', icon: '📊' },
    { title: 'Adaptive Learning Engine', href: '/products/adaptive-learning', icon: '🎯' },
    { title: 'AI Proctoring Suite', href: '/products/proctoring-suite', icon: '🎥' }
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

export default function StudentSuccessPredictorPage() {
  return (
    <main className="pt-16">
      <ProductHero />
      <MetricsSection />
      <DemoSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <FAQSection />
      <CTASection />
      <RelatedProductsSection />
    </main>
  );
}
