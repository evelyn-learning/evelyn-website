'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FAQ } from '@/components/ui/FAQ';
import { productFAQs } from '@/data/faqs/products';
import { DemoTracker } from '@/components/demos/DemoTracker';

const VirtualLabDemo = dynamic(
  () => import('@/components/demos/VirtualLabDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading demo...</p>
        </div>
      </div>
    )
  }
);

function ProductHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-teal-600 via-green-600 to-teal-700">
      <div className="container-wide">
        <div className="max-w-4xl">
          <nav className="flex items-center gap-2 text-teal-200 text-sm mb-8">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">Virtual Lab Simulations</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🔬</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Virtual Lab Simulations for Science Education
              </h1>
              <p className="text-xl text-teal-100 mb-6">
                Interactive online science experiments for physics, chemistry, and biology. AI-powered virtual labs that provide hands-on STEM learning
                without physical equipment—safe, scalable, and infinitely repeatable.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#demo"
                  className="px-6 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition"
                >
                  Try Live Demo
                </a>
                <Link
                  href="/contact?product=virtual-labs"
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
    { value: '50+', label: 'Lab simulations', icon: '🧪' },
    { value: '100%', label: 'Safe experiments', icon: '🛡️' },
    { value: '$0', label: 'Equipment cost', icon: '💰' },
    { value: '∞', label: 'Repeatability', icon: '🔄' }
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
          <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Interactive Demo
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Physics Simulation Lab
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Experiment with gravity, collisions, and motion. Adjust parameters and observe the results.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <DemoTracker productId="virtual-labs" productTitle="Virtual Lab Simulations">
            <VirtualLabDemo />
          </DemoTracker>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/contact?product=virtual-labs&demo=true"
            className="inline-flex items-center gap-2 text-teal-500 font-medium hover:text-teal-600"
          >
            Want to see our full simulation library? Book a demo
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
      title: 'Physics Simulations',
      description: 'Mechanics, waves, optics, electricity, and thermodynamics experiments.',
      icon: '⚡'
    },
    {
      title: 'Chemistry Labs',
      description: 'Virtual titrations, reactions, molecular modeling, and spectroscopy.',
      icon: '🧪'
    },
    {
      title: 'Biology Explorations',
      description: 'Cell biology, genetics, ecology, and anatomy visualizations.',
      icon: '🧬'
    },
    {
      title: 'Parameter Controls',
      description: 'Adjust variables in real-time and observe immediate effects.',
      icon: '🎚️'
    },
    {
      title: 'Data Collection',
      description: 'Measure, record, and analyze experimental data within simulations.',
      icon: '📊'
    },
    {
      title: 'Guided Labs',
      description: 'Structured lab activities with procedures, questions, and assessments.',
      icon: '📋'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">What Can Students Do in Virtual Lab Simulations?</h2>
          <p className="text-xl text-slate-600">Hands-on online science experiments without physical equipment constraints</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-teal-50 transition-colors">
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
      title: 'K-12 Schools',
      description: 'Bring lab experiences to schools without equipment budgets or safety concerns.',
      outcomes: ['No equipment costs', 'Safe for all ages', 'Unlimited repetition']
    },
    {
      title: 'Online Learning',
      description: 'Add hands-on components to virtual and hybrid science courses.',
      outcomes: ['Remote lab access', 'Asynchronous experiments', 'Accessible anywhere']
    },
    {
      title: 'Test Prep',
      description: 'Help students visualize concepts tested on AP, SAT Subject, and standardized tests.',
      outcomes: ['Conceptual understanding', 'Visual learning', 'Exam readiness']
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Who Uses Virtual Labs?</h2>
          <p className="text-xl text-slate-300">Science education without limits</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-slate-300 mb-4">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
                    <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
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
  const faqs = productFAQs['virtual-labs'] || [];
  return (
    <FAQ
      items={faqs}
      title="Virtual Lab Simulations FAQ"
      description="Common questions about virtual labs, online science experiments, and how simulations compare to physical labs"
    />
  );
}

function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-teal-600 to-green-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Bring Labs to Every Student?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Let&apos;s discuss how Virtual Labs can transform your science program.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?product=virtual-labs"
              className="px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Get Pricing
            </Link>
            <Link
              href="/contact?product=virtual-labs&demo=true"
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
    { title: 'Content Authoring AI', href: '/products/content-authoring', icon: '✍️' },
    { title: 'Analytics Dashboard', href: '/products/analytics-dashboard', icon: '📊' }
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

export default function VirtualLabsPage() {
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
