import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, Scale, Eye, FileText, Users, AlertTriangle } from 'lucide-react';
import { ServiceJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { FAQ } from '@/components/ui/FAQ';
import { serviceFAQs } from '@/data/faqs/services';
import { getKeywordsForService } from '@/lib/seo/keywords';

const serviceId = 'ethics-governance';
const serviceName = 'AI Ethics & Governance';
const serviceDescription = 'Develop responsible AI policies, bias auditing frameworks, and transparency practices for educational AI. Build trust with stakeholders.';

export const metadata: Metadata = {
  title: `${serviceName} | EdTech Consulting`,
  description: serviceDescription,
  keywords: getKeywordsForService(serviceId),
};

const services = [
  {
    icon: FileText,
    title: 'Policy Development',
    description: 'Create comprehensive AI governance policies tailored to your institution.',
    deliverables: ['AI acceptable use policy', 'Data governance framework', 'Student privacy guidelines', 'Faculty AI guidelines'],
  },
  {
    icon: Scale,
    title: 'Bias Auditing',
    description: 'Systematic evaluation of AI systems for fairness and equity concerns.',
    deliverables: ['Algorithmic bias assessment', 'Disparate impact analysis', 'Remediation recommendations', 'Ongoing monitoring plan'],
  },
  {
    icon: Eye,
    title: 'Transparency Framework',
    description: 'Help stakeholders understand how AI decisions are made.',
    deliverables: ['Explainability documentation', 'Student-facing disclosures', 'Decision audit trails', 'Appeals process design'],
  },
  {
    icon: Users,
    title: 'Stakeholder Engagement',
    description: 'Build consensus and trust across your educational community.',
    deliverables: ['Faculty consultation', 'Student feedback systems', 'Parent communication', 'Board presentations'],
  },
  {
    icon: Shield,
    title: 'Compliance Mapping',
    description: 'Align AI practices with regulatory requirements and best practices.',
    deliverables: ['FERPA compliance review', 'State AI regulations', 'Accessibility requirements', 'International standards'],
  },
  {
    icon: AlertTriangle,
    title: 'Risk Assessment',
    description: 'Identify and mitigate ethical risks before they become problems.',
    deliverables: ['Risk identification', 'Impact assessment', 'Mitigation strategies', 'Incident response planning'],
  },
];

const principles = [
  {
    title: 'Fairness & Equity',
    description: 'AI should not disadvantage students based on protected characteristics or socioeconomic factors.',
  },
  {
    title: 'Transparency',
    description: 'Students and educators should understand when AI is being used and how it affects them.',
  },
  {
    title: 'Privacy',
    description: 'Student data should be protected and used only for educational purposes with appropriate consent.',
  },
  {
    title: 'Accountability',
    description: 'Clear ownership and responsibility for AI decisions with meaningful human oversight.',
  },
  {
    title: 'Beneficence',
    description: 'AI should demonstrably improve educational outcomes and not cause harm.',
  },
  {
    title: 'Human Agency',
    description: 'AI should augment human decision-making, not replace it for high-stakes educational decisions.',
  },
];

const challenges = [
  {
    challenge: 'AI grading may perpetuate historical biases',
    solution: 'Bias auditing, diverse training data, human review for borderline cases',
  },
  {
    challenge: 'Students don\'t know when AI is being used',
    solution: 'Clear disclosure policies, student-facing documentation',
  },
  {
    challenge: 'Faculty concerns about academic integrity',
    solution: 'Policy development, detection tools, pedagogical guidance',
  },
  {
    challenge: 'Parent anxiety about AI in education',
    solution: 'Communication templates, opt-out processes, transparency reports',
  },
  {
    challenge: 'Regulatory uncertainty',
    solution: 'Compliance mapping, policy flexibility, proactive engagement',
  },
];

export default function EthicsGovernancePage() {
  const faqs = serviceFAQs[serviceId] || [];

  return (
    <main>
      <ServiceJsonLd
        name={serviceName}
        description={serviceDescription}
        serviceType="Consulting Services"
        url={`/services/${serviceId}`}
      />
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Services', url: '/services' },
          { name: serviceName, url: `/services/${serviceId}` },
        ]}
      />
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700">
        <div className="container-wide">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-emerald-100 text-sm mb-8">
              <Link href="/services" className="hover:text-white">Services</Link>
              <span>/</span>
              <span className="text-white">AI Ethics & Governance</span>
            </nav>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  AI Ethics & Governance
                </h1>
                <p className="text-xl text-emerald-100 mb-6">
                  Build trust and do right by your students. We help educational institutions
                  develop responsible AI practices that stand up to scrutiny.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact?inquiry=ethics-governance"
                    className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/services"
                    className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
                  >
                    All Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Ethics */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              Why AI Governance Matters in Education
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">70%</div>
                <p className="text-slate-600">of parents want to know when AI is used in their child&apos;s education</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">15+</div>
                <p className="text-slate-600">states have proposed or passed AI in education regulations</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">$0</div>
                <p className="text-slate-600">is what a lawsuit costs if you prevent it with good governance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Guiding Principles
            </h2>
            <p className="text-xl text-slate-600">
              Our framework is built on established ethical principles for AI in education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {principles.map((principle) => (
              <div key={principle.title} className="bg-white rounded-xl p-6 border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{principle.title}</h3>
                <p className="text-slate-600 text-sm">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive support for responsible AI adoption
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-slate-50 rounded-2xl p-6 hover:bg-emerald-50 transition-colors">
                <service.icon className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{service.description}</p>
                <div className="space-y-2">
                  {service.deliverables.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Challenges */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Common Challenges We Address
            </h2>
            <p className="text-xl text-slate-300">
              Real problems require practical solutions
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {challenges.map((item) => (
              <div key={item.challenge} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      Challenge
                    </div>
                    <p className="text-white">{item.challenge}</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-white/20" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-1">
                      <Shield className="w-4 h-4" />
                      Solution
                    </div>
                    <p className="text-slate-300">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">Common questions about AI Ethics & Governance</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lead with Responsibility
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Be proactive about AI ethics—your students, faculty, and community deserve it.
            </p>
            <Link
              href="/contact?inquiry=ethics-governance"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition"
            >
              Schedule Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
