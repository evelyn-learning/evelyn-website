'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FAQ } from '@/components/ui/FAQ';
import { productFAQs } from '@/data/faqs/products';
import { DemoTracker } from '@/components/demos/DemoTracker';

const PlagiarismDetectionDemo = dynamic(
  () => import('@/components/demos/PlagiarismDetectionDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading demo...</p>
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
            <span className="text-white">Plagiarism Detection</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🔍</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Plagiarism & AI Detection
              </h1>
              <p className="text-xl text-orange-100 mb-6">
                Comprehensive originality checking with AI-generated content detection.
                Protect academic integrity while providing educational feedback.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#demo"
                  className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition"
                >
                  Try Live Demo
                </a>
                <Link
                  href="/contact?product=plagiarism-detection"
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
    { value: '98%', label: 'Detection accuracy', icon: '🎯' },
    { value: '<5 sec', label: 'Analysis time', icon: '⚡' },
    { value: '100B+', label: 'Sources checked', icon: '📚' },
    { value: '99%', label: 'AI detection rate', icon: '🤖' }
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
          <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Demo
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Try It Now
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Paste text to check for originality and AI-generated content indicators.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <DemoTracker productId="plagiarism-detection" productTitle="Plagiarism & AI Detection">
            <PlagiarismDetectionDemo />
          </DemoTracker>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/contact?product=plagiarism-detection&demo=true"
            className="inline-flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600"
          >
            Want to integrate with your LMS? Book a demo
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
      title: 'AI Content Detection',
      description: 'Identify text generated by ChatGPT, Claude, and other AI writing tools.',
      icon: '🤖'
    },
    {
      title: 'Source Matching',
      description: 'Compare against billions of web pages, academic papers, and publications.',
      icon: '🔗'
    },
    {
      title: 'Similarity Highlighting',
      description: 'Visual highlighting of matched passages with source citations.',
      icon: '🖍️'
    },
    {
      title: 'Writing Analysis',
      description: 'Detect stylistic inconsistencies and unusual vocabulary patterns.',
      icon: '📊'
    },
    {
      title: 'Educational Reports',
      description: 'Reports designed to teach about proper citation, not just flag violations.',
      icon: '📋'
    },
    {
      title: 'LMS Integration',
      description: 'Seamless integration with Canvas, Blackboard, Moodle, and more.',
      icon: '🔌'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Features</h2>
          <p className="text-xl text-slate-600">Comprehensive integrity checking with educational focus</p>
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

function UseCasesSection() {
  const useCases = [
    {
      title: 'Higher Education',
      description: 'Maintain academic integrity across large student populations with automated checking.',
      outcomes: ['Scalable integrity monitoring', 'Consistent standards', 'Educational feedback']
    },
    {
      title: 'K-12 Schools',
      description: 'Teach proper citation and original thinking from an early age.',
      outcomes: ['Age-appropriate reports', 'Citation guidance', 'Learning-focused approach']
    },
    {
      title: 'Publishers',
      description: 'Verify originality of submitted manuscripts and content.',
      outcomes: ['Manuscript screening', 'Copyright protection', 'Quality assurance']
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Who Uses Plagiarism Detection?</h2>
          <p className="text-xl text-slate-300">Protecting integrity across education</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-slate-300 mb-4">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
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
  const faqs = productFAQs['plagiarism-detection'] || [];
  return (
    <FAQ
      items={faqs}
      title="Frequently Asked Questions"
      description="Common questions about Plagiarism & AI Detection"
    />
  );
}

function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-600 to-red-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Protect Academic Integrity?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Let&apos;s discuss how our detection tools can work for your institution.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?product=plagiarism-detection"
              className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Get Pricing
            </Link>
            <Link
              href="/contact?product=plagiarism-detection&demo=true"
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
    { title: 'AI Essay Scoring', href: '/products/essay-ai', icon: '📝' },
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

export default function PlagiarismDetectionPage() {
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
