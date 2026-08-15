import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI for Test Prep & Tutoring Companies',
  description: 'Scale your test prep or tutoring business with AI-powered practice tests, automated essay scoring, 24/7 homework help, and tutor co-pilot tools.',
};

const products = [
  {
    title: 'AI Essay Scoring',
    description: 'Give students instant, detailed feedback on practice essays. SAT, ACT, AP, and college application scoring aligned to official rubrics.',
    benefits: ['Unlimited essay practice', 'Instant rubric-aligned feedback', 'Free up tutors for strategy'],
    href: '/products/essay-ai',
    hasDemo: true,
  },
  {
    title: 'Practice Test Generator',
    description: 'Generate unlimited unique practice questions. Every test is different—no more answer memorization.',
    benefits: ['Fresh questions every time', 'Difficulty calibration', 'Standards-aligned content'],
    href: '/products/test-generator',
    hasDemo: true,
  },
  {
    title: '24/7 Homework Helper',
    description: 'AI tutor that guides students through problems step-by-step, available around the clock between sessions.',
    benefits: ['Always available', 'Socratic method', 'Session transcripts for tutors'],
    href: '/products/homework-bot',
    hasDemo: true,
  },
  {
    title: 'Tutor Co-Pilot',
    description: 'Real-time AI assistance for tutors during sessions. Teaching suggestions, student insights, and misconception detection.',
    benefits: ['Real-time suggestions', 'Student profile integration', 'Session summaries'],
    href: '/products/tutor-copilot',
    hasDemo: true,
  },
];

const challenges = [
  { problem: 'Limited tutor hours', solution: 'AI extends support to 24/7 without adding staff' },
  { problem: 'Essay feedback bottleneck', solution: 'Instant AI scoring for unlimited practice' },
  { problem: 'Test bank exhaustion', solution: 'Generate fresh, unique questions on demand' },
  { problem: 'Inconsistent tutor quality', solution: 'AI co-pilot ensures consistent best practices' },
  { problem: 'High student churn', solution: 'Always-on support keeps students engaged' },
];

export default function TestPrepIndustryPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-primary-600 to-purple-700">
        <div className="container-wide">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-purple-200 text-sm mb-6">
              <Link href="/industries" className="hover:text-white">Industries</Link>
              <span>/</span>
              <span className="text-white">Test Prep & Tutoring</span>
            </nav>
            <div className="flex items-start gap-6">
              <span className="text-6xl">📚</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  AI for Test Prep & Tutoring
                </h1>
                <p className="text-xl text-purple-100 mb-6">
                  Scale your business without scaling your team. Our AI tools handle practice tests,
                  essay feedback, and homework help—so your tutors can focus on strategy and high-value instruction.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact?industry=test-prep"
                    className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition"
                  >
                    Book a Demo
                  </Link>
                  <Link
                    href="/products"
                    className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
                  >
                    Try Live Demos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges We Solve */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Challenges We Solve</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {challenges.map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Challenge:</p>
                <p className="font-medium text-slate-900 mb-2">{item.problem}</p>
                <p className="text-sm text-emerald-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              AI Products for Test Prep
            </h2>
            <p className="text-xl text-slate-600">
              Ready-to-deploy tools that integrate with your existing workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <div key={product.title} className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{product.title}</h3>
                  {product.hasDemo && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Live Demo
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-sm mb-4">{product.description}</p>
                <ul className="space-y-2 mb-4">
                  {product.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  href={product.href}
                  className="inline-flex items-center gap-1 text-primary-500 font-medium text-sm hover:text-primary-600"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Solutions */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Need Something Custom?
              </h2>
              <p className="text-slate-600 mb-6">
                Our products work great out of the box, but we also build custom AI solutions
                for test prep companies with unique needs. Score prediction models, adaptive
                learning paths, custom content generation—whatever you need.
              </p>
              <Link
                href="/services/custom-ai"
                className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600"
              >
                Explore custom development <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="font-bold text-slate-900 mb-4">Custom solutions we&apos;ve built:</h3>
              <ul className="space-y-3">
                {[
                  'Score prediction engines',
                  'Adaptive learning platforms',
                  'Custom diagnostic assessments',
                  'White-label tutoring chatbots',
                  'Analytics dashboards',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-600">
                    <span className="w-2 h-2 bg-primary-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-primary-700">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Scale Your Test Prep Business?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              See how our AI tools can help you serve more students without adding staff.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact?industry=test-prep"
                className="px-8 py-4 bg-white text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition"
              >
                Book a Demo
              </Link>
              <Link
                href="/products"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              >
                Try Live Demos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
