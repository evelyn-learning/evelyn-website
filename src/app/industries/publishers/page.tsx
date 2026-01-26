import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI for Educational Publishers',
  description: 'Transform educational content with AI. Assessment generation, content adaptation, interactive experiences, and more for publishers.',
};

const aiProducts = [
  {
    title: 'Assessment Generation AI',
    description: 'Automatically generate high-quality assessment items from your existing content. Multiple choice, short answer, and constructed response.',
    benefits: ['Aligned to your content', 'Multiple difficulty levels', 'Metadata tagging included'],
    icon: '📝',
  },
  {
    title: 'Content Transformation Engine',
    description: 'Convert static content into interactive, adaptive learning experiences. Print-to-digital at scale.',
    benefits: ['Interactive elements', 'Adaptive pathways', 'Multi-format output'],
    icon: '🔄',
  },
  {
    title: 'Intelligent Tutoring Layer',
    description: 'Add AI tutoring capabilities on top of your existing content. Students get help without leaving your platform.',
    benefits: ['Context-aware assistance', 'Branded experience', 'API integration'],
    icon: '🤖',
  },
  {
    title: 'Content Summarization & Adaptation',
    description: 'Automatically create summaries, study guides, and adapted versions for different reading levels.',
    benefits: ['Multiple reading levels', 'Study guide generation', 'Accessibility compliance'],
    icon: '📚',
  },
  {
    title: 'Answer Key & Rubric Generation',
    description: 'AI-generated answer keys, scoring rubrics, and teacher guides for your assessment content.',
    benefits: ['Consistent scoring criteria', 'Detailed rationales', 'Teacher-ready materials'],
    icon: '✅',
  },
  {
    title: 'Content Analytics Platform',
    description: 'Understand how learners interact with your content. Identify gaps, optimize pathways, improve outcomes.',
    benefits: ['Usage analytics', 'Learning insights', 'Content optimization'],
    icon: '📊',
  },
];

const contentServices = [
  'Curriculum development',
  'Assessment authoring',
  'Content conversion',
  'Standards alignment',
  'Accessibility remediation',
  'Localization & translation',
  'Quality assurance',
  'Editorial review',
];

const transformation = [
  {
    before: 'Static textbook content',
    after: 'Interactive digital experiences with embedded AI tutoring',
  },
  {
    before: 'Fixed question banks',
    after: 'Unlimited AI-generated questions aligned to your content',
  },
  {
    before: 'One-size-fits-all materials',
    after: 'Adaptive content that adjusts to learner level',
  },
  {
    before: 'Manual assessment creation',
    after: 'AI-assisted item development with human review',
  },
];

export default function PublishersIndustryPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700">
        <div className="container-wide">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-emerald-200 text-sm mb-6">
              <Link href="/industries" className="hover:text-white">Industries</Link>
              <span>/</span>
              <span className="text-white">Publishers</span>
            </nav>
            <div className="flex items-start gap-6">
              <span className="text-6xl">📖</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  AI for Educational Publishers
                </h1>
                <p className="text-xl text-emerald-100 mb-6">
                  Transform your content into AI-powered learning experiences. Generate assessments,
                  add intelligent tutoring, and create adaptive pathways—all while maintaining your
                  editorial standards and brand.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact?industry=publishers"
                    className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition"
                  >
                    Schedule a Demo
                  </Link>
                  <Link
                    href="/services/content"
                    className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
                  >
                    Content Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container-wide">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Content Transformation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {transformation.map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Before:</p>
                <p className="text-slate-700 text-sm mb-3">{item.before}</p>
                <p className="text-sm text-emerald-600 mb-1">After:</p>
                <p className="text-emerald-700 text-sm font-medium">{item.after}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Products */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              AI Products for Publishers
            </h2>
            <p className="text-xl text-slate-600">
              Tools that enhance your content without replacing your editorial expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {aiProducts.map((product) => (
              <div key={product.title} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <span className="text-4xl mb-4 block">{product.icon}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{product.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{product.description}</p>
                <ul className="space-y-2">
                  {product.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Services */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Plus: Traditional Content Services
              </h2>
              <p className="text-slate-600 mb-6">
                We started as a content development company serving publishers. We still offer
                full-service content creation, editorial, and production services—now enhanced
                with AI efficiency.
              </p>
              <Link
                href="/services/content"
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
              >
                Explore content services <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="font-bold text-slate-900 mb-4">Content Services</h3>
              <div className="grid grid-cols-2 gap-2">
                {contentServices.map((service) => (
                  <div key={service} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Flexible Integration
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Our AI tools work with your existing platforms and workflows. API access,
              white-label options, and custom integration support available.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['API Access', 'White-Label', 'LMS Integration', 'Custom Workflows'].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 bg-white rounded-full text-slate-700 text-sm font-medium border border-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Let&apos;s discuss how AI can enhance your publishing workflow.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact?industry=publishers"
                className="px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition"
              >
                Schedule a Demo
              </Link>
              <Link
                href="/services/content"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              >
                Content Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
