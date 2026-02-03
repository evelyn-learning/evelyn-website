'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FAQ } from '@/components/ui/FAQ';
import { productFAQs } from '@/data/faqs/products';
import { DemoTracker } from '@/components/demos/DemoTracker';

const CourseCreatorStudioDemo = dynamic(
  () => import('@/components/demos/CourseCreatorStudioDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading demo...</p>
        </div>
      </div>
    )
  }
);

function ProductHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-700">
      <div className="container-wide">
        <div className="max-w-4xl">
          <nav className="flex items-center gap-2 text-cyan-200 text-sm mb-8">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">AI Course Creator Studio</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🎓</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                AI Course Creator Studio
              </h1>
              <p className="text-xl text-cyan-100 mb-6">
                Transform documents, videos, or raw content into complete, interactive courses.
                Auto-generates quizzes, learning paths, and LMS-ready packages in minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#demo"
                  className="px-6 py-3 bg-white text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition"
                >
                  Try Live Demo
                </a>
                <Link
                  href="/contact?product=course-creator-studio"
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
    { value: '10x', label: 'Faster course creation', icon: '⚡' },
    { value: '90%', label: 'Content accuracy', icon: '🎯' },
    { value: '100+', label: 'Export formats', icon: '📤' },
    { value: '$50K+', label: 'Saved per course', icon: '💰' }
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
          <span className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Demo
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Try It Now
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Paste any content and watch AI transform it into a structured course with modules and assessments.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <DemoTracker productId="course-creator-studio" productTitle="AI Course Creator Studio">
            <CourseCreatorStudioDemo />
          </DemoTracker>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/contact?product=course-creator-studio&demo=true"
            className="inline-flex items-center gap-2 text-cyan-500 font-medium hover:text-cyan-600"
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

function FeaturesSection() {
  const features = [
    {
      title: 'Multi-Format Input',
      description: 'Upload PDFs, Word docs, videos, presentations, or raw text. AI handles the rest.',
      icon: '📄'
    },
    {
      title: 'Smart Chunking',
      description: 'Automatically segments content into digestible learning modules.',
      icon: '🧩'
    },
    {
      title: 'Auto Assessments',
      description: 'Generates quiz questions, knowledge checks, and assignments from your content.',
      icon: '❓'
    },
    {
      title: 'Learning Objectives',
      description: 'Creates clear, measurable objectives aligned to content.',
      icon: '🎯'
    },
    {
      title: 'SCORM/xAPI Export',
      description: 'Export to any LMS with SCORM, xAPI, or direct integrations.',
      icon: '📤'
    },
    {
      title: 'Interactive Elements',
      description: 'Add simulations, branching scenarios, and engagement activities.',
      icon: '🎮'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Features</h2>
          <p className="text-xl text-slate-600">Everything you need to create world-class courses</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-cyan-50 transition-colors">
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

function WorkflowSection() {
  const steps = [
    {
      step: 1,
      title: 'Upload Content',
      description: 'Add your documents, videos, or paste raw text into the studio.'
    },
    {
      step: 2,
      title: 'AI Structures',
      description: 'AI analyzes content and creates modules, objectives, and assessments.'
    },
    {
      step: 3,
      title: 'Review & Edit',
      description: 'Refine the structure, adjust content, and add interactive elements.'
    },
    {
      step: 4,
      title: 'Export & Deploy',
      description: 'Export to your LMS or publish directly to learners.'
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">From Content to Course in 4 Steps</h2>
          <p className="text-xl text-slate-300">What used to take weeks now takes minutes</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center relative">
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-cyan-500/30" />
              )}
              <div className="w-16 h-16 mx-auto bg-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold mb-4 relative z-10">
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
      title: 'Publishers',
      description: 'Transform textbooks and backlist content into interactive digital courses.',
      outcomes: ['Rapid content modernization', 'New revenue streams', 'Reduced production costs']
    },
    {
      title: 'Corporate L&D',
      description: 'Convert training materials into engaging e-learning at scale.',
      outcomes: ['Faster onboarding', 'Compliance training', 'Skill development']
    },
    {
      title: 'Higher Education',
      description: 'Help faculty convert lecture materials into online-ready courses.',
      outcomes: ['Hybrid course support', 'OER development', 'Faculty time savings']
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Who Uses Course Creator?</h2>
          <p className="text-xl text-slate-600">Powering content transformation at scale</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{useCase.title}</h3>
              <p className="text-slate-600 mb-4">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
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

function IntegrationsSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Export to Any Platform</h2>
          <p className="text-slate-600 mb-8">
            Course Creator Studio works with all major learning management systems
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Canvas', logo: '🎨' },
              { name: 'Blackboard', logo: '📚' },
              { name: 'Moodle', logo: '🎓' },
              { name: 'Schoology', logo: '🏫' },
              { name: 'SCORM', logo: '📦' },
              { name: 'xAPI', logo: '🔌' },
              { name: 'Google Classroom', logo: '📱' },
              { name: 'Custom API', logo: '⚙️' }
            ].map((platform, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-3xl block mb-2">{platform.logo}</span>
                <span className="text-sm font-medium text-slate-700">{platform.name}</span>
              </div>
            ))}
          </div>
          <Link href="/integrations" className="inline-flex items-center gap-2 text-cyan-600 font-medium mt-8 hover:text-cyan-700">
            View all integrations
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = productFAQs['course-creator-studio'] || [];
  return (
    <FAQ
      items={faqs}
      title="Frequently Asked Questions"
      description="Common questions about AI Course Creator Studio"
    />
  );
}

function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-cyan-600 to-blue-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Content?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Let&apos;s discuss how Course Creator Studio can accelerate your content development.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?product=course-creator-studio"
              className="px-8 py-4 bg-white text-cyan-600 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Get Pricing
            </Link>
            <Link
              href="/contact?product=course-creator-studio&demo=true"
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
    { title: 'Content Authoring AI', href: '/products/content-authoring', icon: '✍️' },
    { title: 'AI Curriculum Designer', href: '/products/curriculum-designer', icon: '📋' },
    { title: 'Content Accessibility AI', href: '/products/accessibility-ai', icon: '♿' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
          Related Products
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {related.map((product, idx) => (
            <Link
              key={idx}
              href={product.href}
              className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow"
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

export default function CourseCreatorStudioPage() {
  return (
    <main className="pt-16">
      <ProductHero />
      <MetricsSection />
      <DemoSection />
      <FeaturesSection />
      <WorkflowSection />
      <UseCasesSection />
      <IntegrationsSection />
      <FAQSection />
      <CTASection />
      <RelatedProductsSection />
    </main>
  );
}
