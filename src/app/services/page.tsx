import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Compass, Cpu, Settings, Shield, GraduationCap, Server, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Implementation Services | EdTech Consulting & Training',
  description: 'Enterprise AI consulting, implementation, training, and managed services for education. AI readiness assessment, custom AI development, LMS integration, and ongoing support for adaptive learning platforms.',
  keywords: [
    'AI Implementation Services',
    'EdTech Consulting',
    'AI Readiness Assessment',
    'Custom AI Development',
    'LMS Integration',
    'AI Ethics Governance',
    'Faculty AI Training',
    'Managed AI Services',
    'Educational Technology Services',
  ],
};

const services = [
  {
    icon: Compass,
    title: 'AI Readiness Assessment',
    description: 'Evaluate your data, infrastructure, and processes to create a strategic AI implementation roadmap.',
    href: '/services/ai-readiness',
    color: 'from-blue-500 to-indigo-600',
    highlights: ['Gap analysis', 'Roadmap development', 'ROI projection'],
  },
  {
    icon: Cpu,
    title: 'Custom AI Development',
    description: 'Bespoke AI solutions built for your specific business needs, content, and pedagogical approach.',
    href: '/services/custom-ai',
    color: 'from-purple-500 to-primary-600',
    highlights: ['Model fine-tuning', 'White-label products', 'API development'],
  },
  {
    icon: Settings,
    title: 'Implementation & Integration',
    description: 'Full deployment services including API integration, data migration, SSO setup, and LMS connectors.',
    href: '/services/implementation',
    color: 'from-orange-500 to-red-600',
    highlights: ['LMS integration', 'Data migration', 'SSO configuration'],
  },
  {
    icon: Shield,
    title: 'AI Ethics & Governance',
    description: 'Develop responsible AI policies, bias auditing frameworks, and transparency practices.',
    href: '/services/ethics-governance',
    color: 'from-emerald-500 to-teal-600',
    highlights: ['Policy development', 'Bias auditing', 'Compliance frameworks'],
  },
  {
    icon: GraduationCap,
    title: 'Faculty & Staff Training',
    description: 'Train educators on AI tools, prompt engineering, AI-enhanced pedagogy, and academic integrity.',
    href: '/services/training',
    color: 'from-pink-500 to-rose-600',
    highlights: ['Workshops', 'Certification programs', 'Train-the-trainer'],
  },
  {
    icon: Server,
    title: 'Managed AI Services',
    description: 'Ongoing hosting, monitoring, model updates, and support for long-term AI success.',
    href: '/services/managed-services',
    color: 'from-slate-600 to-slate-800',
    highlights: ['24/7 monitoring', 'Model updates', 'Dedicated support'],
  },
  {
    icon: FileText,
    title: 'Content Transformation',
    description: 'Convert legacy content from PDFs, print, and old LMS formats to modern, AI-enhanced experiences.',
    href: '/services/content',
    color: 'from-teal-500 to-cyan-600',
    highlights: ['Format conversion', 'Content modernization', 'Accessibility compliance'],
  },
];

const stats = [
  { value: '500+', label: 'Enterprise clients' },
  { value: '50+', label: 'Implementations' },
  { value: '10K+', label: 'Educators trained' },
  { value: '99.9%', label: 'Uptime SLA' },
];

export default function ServicesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 text-sm font-medium">Enterprise Services</span>
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              AI Implementation Services
              <span className="block text-primary-400">for EdTech Success</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Comprehensive AI consulting, implementation, and training services for adaptive learning platforms and intelligent tutoring systems.
              From readiness assessment to managed services, we&apos;re your strategic partner for data-driven learning outcomes.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact?inquiry=services"
                className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all"
              >
                Discuss Your Needs
              </Link>
              <Link
                href="/products"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                View AI Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive support at every stage of your AI journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${service.color} p-6 text-white`}>
                  <service.icon className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold mb-2 group-hover:underline">{service.title}</h3>
                  <p className="text-white/80 text-sm">{service.description}</p>
                </div>

                {/* Highlights */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Services */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Partner with Evelyn?
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                We&apos;re not just a vendor—we&apos;re educators who understand your challenges.
                Our services are designed for the unique needs of educational institutions.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: 'Education-First Expertise',
                    description: 'Our team includes 300+ educators who understand pedagogy, not just technology.',
                  },
                  {
                    title: 'Enterprise-Grade Security',
                    description: 'FERPA, COPPA, SOC 2 compliant infrastructure built for sensitive student data.',
                  },
                  {
                    title: 'Proven Track Record',
                    description: '500+ education companies trust us with their AI initiatives.',
                  },
                  {
                    title: 'Long-Term Partnership',
                    description: 'We succeed when you succeed. Ongoing support, not one-time sales.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Service Engagement Models</h3>

              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Project-Based</h4>
                  <p className="text-sm text-slate-600">Fixed-scope engagements with defined deliverables and timelines.</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Retainer</h4>
                  <p className="text-sm text-slate-600">Ongoing support with dedicated hours and priority access.</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Managed Services</h4>
                  <p className="text-sm text-slate-600">Full outsourcing of AI operations with SLA guarantees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-700">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Tell us about your AI goals and we&apos;ll recommend the right services for your organization.
            </p>
            <Link
              href="/contact?inquiry=services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Schedule a Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
