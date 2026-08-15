import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Compass, Database, Target, FileCheck, Users, BarChart3 } from 'lucide-react';
import { ServiceJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { FAQ } from '@/components/ui/FAQ';
import { serviceFAQs } from '@/data/faqs/services';
import { getKeywordsForService } from '@/lib/seo/keywords';

const serviceId = 'ai-readiness';
const serviceName = 'AI Readiness Assessment';
const serviceDescription = 'Evaluate your organization\'s data infrastructure, processes, and capabilities to create a strategic AI implementation roadmap with clear ROI projections for adaptive learning platforms and intelligent tutoring systems.';

export const metadata: Metadata = {
  title: `${serviceName} | EdTech Consulting`,
  description: serviceDescription,
  keywords: getKeywordsForService(serviceId),
};

const assessmentAreas = [
  {
    icon: Database,
    title: 'Data Infrastructure',
    description: 'Evaluate data quality, accessibility, and governance readiness for AI applications.',
    checks: ['Data completeness audit', 'Quality assessment', 'Privacy compliance review', 'Integration capability'],
  },
  {
    icon: Target,
    title: 'Use Case Prioritization',
    description: 'Identify and rank AI opportunities based on impact, feasibility, and strategic alignment.',
    checks: ['Impact analysis', 'Technical feasibility', 'Resource requirements', 'Risk assessment'],
  },
  {
    icon: Users,
    title: 'Organizational Readiness',
    description: 'Assess team capabilities, change management needs, and cultural factors.',
    checks: ['Skills gap analysis', 'Change readiness', 'Stakeholder mapping', 'Training needs'],
  },
  {
    icon: FileCheck,
    title: 'Technology Landscape',
    description: 'Review existing systems and identify integration points for AI solutions.',
    checks: ['System inventory', 'API availability', 'Vendor assessment', 'Security review'],
  },
  {
    icon: BarChart3,
    title: 'ROI Modeling',
    description: 'Build business cases with projected costs, benefits, and implementation timelines.',
    checks: ['Cost analysis', 'Benefit quantification', 'Timeline planning', 'Risk modeling'],
  },
  {
    icon: Compass,
    title: 'Roadmap Development',
    description: 'Create a phased implementation plan with clear milestones and success metrics.',
    checks: ['Phase planning', 'Milestone definition', 'Resource allocation', 'Success criteria'],
  },
];

const deliverables = [
  {
    title: 'Executive Summary',
    description: 'High-level findings and recommendations for leadership decision-making.',
  },
  {
    title: 'Detailed Assessment Report',
    description: 'Comprehensive analysis of each assessment area with supporting data.',
  },
  {
    title: 'Gap Analysis Matrix',
    description: 'Current state vs. required state mapping with remediation steps.',
  },
  {
    title: 'Prioritized Use Case List',
    description: 'Ranked list of AI opportunities with impact and effort scores.',
  },
  {
    title: 'Implementation Roadmap',
    description: 'Phased plan with timelines, resources, and dependencies.',
  },
  {
    title: 'ROI Projections',
    description: 'Financial models showing expected return on AI investments.',
  },
];

const process = [
  {
    step: '01',
    title: 'Discovery Workshop',
    duration: 'Week 1',
    description: 'Stakeholder interviews and documentation review to understand your current state and goals.',
  },
  {
    step: '02',
    title: 'Technical Assessment',
    duration: 'Week 2',
    description: 'Deep dive into data systems, infrastructure, and existing technology landscape.',
  },
  {
    step: '03',
    title: 'Analysis & Modeling',
    duration: 'Week 3',
    description: 'Analyze findings, build ROI models, and develop preliminary recommendations.',
  },
  {
    step: '04',
    title: 'Roadmap Development',
    duration: 'Week 4',
    description: 'Create detailed implementation plan with stakeholder input and validation.',
  },
  {
    step: '05',
    title: 'Executive Presentation',
    duration: 'Week 5',
    description: 'Present findings and recommendations to leadership with actionable next steps.',
  },
];

export default function AIReadinessPage() {
  const faqs = serviceFAQs[serviceId] || [];

  return (
    <main>
      <ServiceJsonLd
        name={serviceName}
        description={serviceDescription}
        serviceType="AI Consulting"
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
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700">
        <div className="container-wide">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-blue-200 text-sm mb-8">
              <Link href="/services" className="hover:text-white">Services</Link>
              <span>/</span>
              <span className="text-white">AI Readiness Assessment</span>
            </nav>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  AI Readiness Assessment
                </h1>
                <p className="text-xl text-blue-100 mb-6">
                  Before you invest in AI, understand where you are and where you need to go.
                  Our assessment provides a clear roadmap with realistic ROI projections.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact?inquiry=ai-readiness"
                    className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
                  >
                    Request Assessment
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

      {/* Why Assessment */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-2">60%</div>
              <p className="text-slate-600">of AI projects fail due to poor planning</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-2">3x</div>
              <p className="text-slate-600">higher ROI with proper assessment</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-2">5 weeks</div>
              <p className="text-slate-600">to actionable roadmap</p>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Areas */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What We Assess
            </h2>
            <p className="text-xl text-slate-600">
              A comprehensive evaluation across six critical dimensions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assessmentAreas.map((area) => (
              <div key={area.title} className="bg-white rounded-2xl p-6 border border-slate-100">
                <area.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{area.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{area.description}</p>
                <div className="space-y-2">
                  {area.checks.map((check) => (
                    <div key={check} className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {check}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Assessment Process
            </h2>
            <p className="text-xl text-slate-600">
              A structured approach that respects your time while gathering deep insights
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {process.map((step, idx) => (
              <div key={step.step} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {step.step}
                  </div>
                  {idx < process.length - 1 && (
                    <div className="w-0.5 h-16 bg-blue-200 mx-auto mt-2" />
                  )}
                </div>
                <div className="pt-2 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What You&apos;ll Receive
            </h2>
            <p className="text-xl text-slate-300">
              Actionable deliverables that guide your AI strategy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {deliverables.map((item) => (
              <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-300 text-sm">{item.description}</p>
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
            <p className="text-xl text-slate-600">Common questions about AI Readiness Assessment</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your AI Journey Right
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Don&apos;t guess—know exactly where you stand and what it takes to succeed with AI.
            </p>
            <Link
              href="/contact?inquiry=ai-readiness"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
            >
              Request Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
