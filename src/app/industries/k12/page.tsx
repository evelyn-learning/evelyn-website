import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI for K-12 Schools & Districts',
  description: 'AI-powered tools for K-12 education. Automated essay feedback, 24/7 homework help, and practice test generation to support teachers and students.',
};

const products = [
  {
    title: 'AI Essay Scoring',
    description: 'Give students instant writing feedback. Teachers review AI scores and add strategic guidance, saving hours of grading time.',
    benefits: ['Standards-aligned rubrics', 'Detailed improvement suggestions', 'Teacher review dashboard'],
    href: '/products/essay-ai',
    hasDemo: true,
  },
  {
    title: '24/7 Homework Helper',
    description: 'Every student gets a personal tutor, available any time. Guides students through problems without giving away answers.',
    benefits: ['Socratic questioning method', 'Multi-subject coverage', 'Safe for students'],
    href: '/products/homework-bot',
    hasDemo: true,
  },
  {
    title: 'Practice Test Generator',
    description: 'Create formative assessments aligned to state standards. Fresh questions every time for meaningful practice.',
    benefits: ['State standards alignment', 'Difficulty calibration', 'Instant generation'],
    href: '/products/test-generator',
    hasDemo: true,
  },
];

const challenges = [
  { problem: 'Teacher workload', solution: 'AI handles routine grading and feedback, freeing teacher time' },
  { problem: 'Limited 1:1 support', solution: '24/7 homework help for every student' },
  { problem: 'Inconsistent feedback', solution: 'Standardized, rubric-aligned assessment' },
  { problem: 'Resource constraints', solution: 'Scale support without adding staff' },
];

const concerns = [
  {
    concern: 'Student data privacy',
    answer: 'FERPA and COPPA compliant. Student data is never used to train models. Full data deletion on request.',
  },
  {
    concern: 'Academic integrity',
    answer: 'Our AI teaches, not tells. Socratic method guides students to answers without giving them away.',
  },
  {
    concern: 'Replacing teachers',
    answer: 'AI handles routine tasks so teachers can focus on instruction, relationships, and high-value interventions.',
  },
  {
    concern: 'Implementation complexity',
    answer: 'We provide dedicated onboarding, training, and ongoing support. Most schools are live within 2 weeks.',
  },
];

export default function K12IndustryPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-700">
        <div className="container-wide">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-cyan-200 text-sm mb-6">
              <Link href="/industries" className="hover:text-white">Industries</Link>
              <span>/</span>
              <span className="text-white">K-12 Schools</span>
            </nav>
            <div className="flex items-start gap-6">
              <span className="text-6xl">🏫</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  AI for K-12 Schools
                </h1>
                <p className="text-xl text-cyan-100 mb-6">
                  Support teachers with automated feedback and give students always-on help.
                  Our AI tools save time while improving learning outcomes—designed with
                  educators, for educators.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact?industry=k12"
                    className="px-6 py-3 bg-white text-cyan-700 font-semibold rounded-xl hover:bg-cyan-50 transition"
                  >
                    Schedule a Demo
                  </Link>
                  <Link
                    href="/products"
                    className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
                  >
                    Try Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Challenges We Solve</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
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
              AI Products for Schools
            </h2>
            <p className="text-xl text-slate-600">
              Classroom-ready tools designed for K-12 environments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <div key={product.title} className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{product.title}</h3>
                  {product.hasDemo && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Demo
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

      {/* Addressing Concerns */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Addressing Your Concerns
            </h2>
            <p className="text-xl text-slate-600">
              We understand the unique considerations for AI in K-12 education.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {concerns.map((item) => (
              <div key={item.concern} className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">{item.concern}</h3>
                <p className="text-slate-600 text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* District Pricing */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              District & School Pricing
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Flexible pricing for schools of all sizes. Volume discounts for districts.
              Pilot programs available.
            </p>
            <Link
              href="/contact?industry=k12&inquiry=pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition"
            >
              Get District Pricing
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 to-blue-700">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Bring AI to Your School?
            </h2>
            <p className="text-xl text-cyan-100 mb-8">
              Let&apos;s discuss how AI can support your teachers and students.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact?industry=k12"
                className="px-8 py-4 bg-white text-cyan-700 font-semibold rounded-xl hover:bg-cyan-50 transition"
              >
                Book a Demo
              </Link>
              <Link
                href="/products"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              >
                Try Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
