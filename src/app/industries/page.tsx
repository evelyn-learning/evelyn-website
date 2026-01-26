import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Industries We Serve',
  description: 'Evelyn Learning serves test prep companies, K-12 schools, higher education, publishers, and enterprise organizations with AI products and content services.',
};

const industries = [
  {
    title: 'Test Prep & Tutoring',
    description: 'Scale your tutoring business with AI-powered practice tests, automated essay scoring, and 24/7 homework help. Let technology extend your tutors\' capacity.',
    icon: '📚',
    href: '/industries/test-prep',
    color: 'from-purple-500 to-primary-600',
    products: ['AI Essay Scoring', 'Practice Test Generator', 'Homework Helper', 'Tutor Co-Pilot'],
  },
  {
    title: 'K-12 Schools',
    description: 'Support teachers with automated feedback and provide students with always-on help. Save time while improving outcomes across your district.',
    icon: '🏫',
    href: '/industries/k12',
    color: 'from-cyan-500 to-blue-600',
    products: ['AI Essay Scoring', 'Homework Helper', 'Practice Test Generator'],
  },
  {
    title: 'Higher Education',
    description: 'From course assistants to research tools, help faculty and students with AI-powered learning support and content creation.',
    icon: '🎓',
    href: '/industries/higher-ed',
    color: 'from-amber-500 to-orange-600',
    products: ['Course Assistant AI', 'Research Support Tools', 'Assessment Automation'],
  },
  {
    title: 'Publishers',
    description: 'Transform static content into interactive, AI-powered learning experiences. Generate assessments, adapt content, and create personalized learning paths.',
    icon: '📖',
    href: '/industries/publishers',
    color: 'from-emerald-500 to-teal-600',
    products: ['Content Transformation AI', 'Assessment Generation', 'Adaptive Content'],
  },
  {
    title: 'Enterprise',
    description: 'Upskill your workforce with AI-powered training, compliance education, and skills assessment. Personalized learning at corporate scale.',
    icon: '🏢',
    href: '/industries/enterprise',
    color: 'from-slate-600 to-slate-800',
    products: ['Workforce Upskilling AI', 'Compliance Training', 'Skills Assessment'],
  },
];

export default function IndustriesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Who We Serve
            </h1>
            <p className="text-xl text-slate-300">
              We work with education companies of all types—from test prep startups to enterprise
              learning departments. Each industry has unique needs, and we&apos;ve built solutions for all of them.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="space-y-8">
            {industries.map((industry) => (
              <Link
                key={industry.title}
                href={industry.href}
                className="group block bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all border border-slate-100 hover:border-primary-100"
              >
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  {/* Left - Icon & Title */}
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${industry.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform`}>
                      {industry.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 group-hover:text-primary-500 transition-colors">
                        {industry.title}
                      </h2>
                      <span className="inline-flex items-center gap-1 text-primary-500 text-sm font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Middle - Description */}
                  <div className="lg:col-span-1">
                    <p className="text-slate-600">
                      {industry.description}
                    </p>
                  </div>

                  {/* Right - Products */}
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Relevant solutions:</p>
                    <div className="flex flex-wrap gap-2">
                      {industry.products.map((product) => (
                        <span
                          key={product}
                          className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600 group-hover:border-primary-200 group-hover:bg-primary-50 transition-colors"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Not Sure Where You Fit?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Every education business is unique. Let&apos;s talk about your specific needs
              and find the right solution—whether it&apos;s an existing product, custom development,
              or content services.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition"
            >
              Let&apos;s Talk
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
