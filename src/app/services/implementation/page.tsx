import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Settings, Database, Key, Link2, Shield, Headphones } from 'lucide-react';
import { ServiceJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { FAQ } from '@/components/ui/FAQ';
import { serviceFAQs } from '@/data/faqs/services';
import { getKeywordsForService } from '@/lib/seo/keywords';

const serviceId = 'implementation';
const serviceName = 'Implementation & Integration';
const serviceDescription = 'Full deployment services including API integration, data migration, SSO setup, and LMS connectors. Enterprise-grade AI implementation.';

export const metadata: Metadata = {
  title: `${serviceName} | EdTech Consulting`,
  description: serviceDescription,
  keywords: getKeywordsForService(serviceId),
};

const services = [
  {
    icon: Link2,
    title: 'LMS Integration',
    description: 'Connect AI tools seamlessly with your learning management system.',
    details: ['Canvas, Blackboard, Moodle, Schoology', 'LTI 1.3 compliance', 'Grade passback', 'Deep linking'],
  },
  {
    icon: Database,
    title: 'Data Migration',
    description: 'Move content and data safely while maintaining integrity.',
    details: ['Content transformation', 'Metadata mapping', 'Quality validation', 'Rollback planning'],
  },
  {
    icon: Key,
    title: 'SSO Configuration',
    description: 'Single sign-on setup for frictionless user experience.',
    details: ['SAML 2.0 / OAuth 2.0', 'Azure AD, Okta, Google', 'Role mapping', 'Provisioning automation'],
  },
  {
    icon: Settings,
    title: 'API Integration',
    description: 'Connect AI capabilities to your existing tech stack.',
    details: ['RESTful API setup', 'Webhook configuration', 'Rate limiting', 'Error handling'],
  },
  {
    icon: Shield,
    title: 'Security Setup',
    description: 'Configure security controls for enterprise compliance.',
    details: ['Access control lists', 'Data encryption', 'Audit logging', 'Compliance verification'],
  },
  {
    icon: Headphones,
    title: 'Go-Live Support',
    description: 'Dedicated support during launch to ensure smooth rollout.',
    details: ['24/7 launch support', 'Issue escalation', 'Performance monitoring', 'User feedback loops'],
  },
];

const integrations = [
  { name: 'Canvas', category: 'LMS' },
  { name: 'Blackboard', category: 'LMS' },
  { name: 'Moodle', category: 'LMS' },
  { name: 'Schoology', category: 'LMS' },
  { name: 'Google Classroom', category: 'LMS' },
  { name: 'Brightspace D2L', category: 'LMS' },
  { name: 'Azure AD', category: 'Identity' },
  { name: 'Okta', category: 'Identity' },
  { name: 'Google Workspace', category: 'Identity' },
  { name: 'OneLogin', category: 'Identity' },
  { name: 'PowerSchool', category: 'SIS' },
  { name: 'Infinite Campus', category: 'SIS' },
  { name: 'Ellucian Banner', category: 'SIS' },
  { name: 'Workday', category: 'HCM' },
  { name: 'Salesforce', category: 'CRM' },
  { name: 'HubSpot', category: 'CRM' },
];

const process = [
  {
    phase: 'Planning',
    duration: '1-2 weeks',
    activities: [
      'Requirements gathering',
      'Technical architecture review',
      'Integration mapping',
      'Timeline development',
    ],
  },
  {
    phase: 'Development',
    duration: '2-4 weeks',
    activities: [
      'API configuration',
      'SSO integration',
      'Data migration scripts',
      'Custom connectors',
    ],
  },
  {
    phase: 'Testing',
    duration: '1-2 weeks',
    activities: [
      'Integration testing',
      'User acceptance testing',
      'Performance validation',
      'Security verification',
    ],
  },
  {
    phase: 'Deployment',
    duration: '1 week',
    activities: [
      'Staged rollout',
      'Go-live support',
      'Monitoring setup',
      'Documentation handoff',
    ],
  },
];

export default function ImplementationPage() {
  const faqs = serviceFAQs[serviceId] || [];

  return (
    <main>
      <ServiceJsonLd
        name={serviceName}
        description={serviceDescription}
        serviceType="Implementation Services"
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
      <section className="py-20 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600">
        <div className="container-wide">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-orange-100 text-sm mb-8">
              <Link href="/services" className="hover:text-white">Services</Link>
              <span>/</span>
              <span className="text-white">Implementation & Integration</span>
            </nav>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Implementation & Integration
                </h1>
                <p className="text-xl text-orange-100 mb-6">
                  We don&apos;t just hand you software—we make it work seamlessly with your existing
                  systems. Full deployment services for enterprise-grade AI implementation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact?inquiry=implementation"
                    className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition"
                  >
                    Discuss Your Project
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

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-slate-900">50+</div>
              <p className="text-sm text-slate-500">Enterprise deployments</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">99.9%</div>
              <p className="text-sm text-slate-500">Uptime during migration</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">15+</div>
              <p className="text-sm text-slate-500">LMS integrations</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">24/7</div>
              <p className="text-sm text-slate-500">Go-live support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Implementation Services
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need for a successful deployment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-white rounded-2xl p-6 border border-slate-100">
                <service.icon className="w-10 h-10 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{service.description}</p>
                <div className="space-y-2">
                  {service.details.map((detail) => (
                    <div key={detail} className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Pre-Built Integrations
            </h2>
            <p className="text-xl text-slate-600">
              We have experience with all major education platforms
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm"
              >
                <span className="font-medium text-slate-900">{integration.name}</span>
                <span className="text-slate-400 ml-2">({integration.category})</span>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 mt-8">
            Don&apos;t see your system? We build custom integrations too.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Implementation Process
            </h2>
            <p className="text-xl text-slate-300">
              A proven methodology for smooth deployments
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {process.map((phase, idx) => (
              <div key={phase.phase} className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{phase.phase}</h3>
                      <span className="text-xs text-slate-400">{phase.duration}</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {phase.activities.map((activity) => (
                      <li key={activity} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="w-1 h-1 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
                {idx < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-white/20" />
                )}
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
            <p className="text-xl text-slate-600">Common questions about Implementation & Integration</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-600">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for a Smooth Deployment?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Let our team handle the technical complexity while you focus on outcomes.
            </p>
            <Link
              href="/contact?inquiry=implementation"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
