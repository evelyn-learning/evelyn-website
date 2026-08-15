import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Server, Clock, RefreshCw, Headphones, Shield, BarChart3 } from 'lucide-react';
import { ServiceJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { FAQ } from '@/components/ui/FAQ';
import { serviceFAQs } from '@/data/faqs/services';
import { getKeywordsForService } from '@/lib/seo/keywords';

const serviceId = 'managed-services';
const serviceName = 'Managed AI Services';
const serviceDescription = 'Ongoing hosting, monitoring, model updates, and dedicated support for long-term AI success. Enterprise SLAs with 99.9% uptime guarantee.';

export const metadata: Metadata = {
  title: `${serviceName} | Evelyn Learning`,
  description: serviceDescription,
  keywords: getKeywordsForService(serviceId),
};

const services = [
  {
    icon: Server,
    title: 'Hosting & Infrastructure',
    description: 'Enterprise-grade cloud infrastructure optimized for AI workloads.',
    features: ['Multi-region deployment', 'Auto-scaling', 'Disaster recovery', 'FERPA-compliant hosting'],
  },
  {
    icon: Clock,
    title: '24/7 Monitoring',
    description: 'Continuous system monitoring with proactive issue detection.',
    features: ['Real-time alerting', 'Performance dashboards', 'Anomaly detection', 'Capacity planning'],
  },
  {
    icon: RefreshCw,
    title: 'Model Updates',
    description: 'Keep AI models current with regular retraining and improvements.',
    features: ['Scheduled retraining', 'Performance optimization', 'Bias monitoring', 'A/B testing'],
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Named support team who knows your systems and needs.',
    features: ['Dedicated account manager', 'Priority escalation', 'Quarterly reviews', 'Training included'],
  },
  {
    icon: Shield,
    title: 'Security Management',
    description: 'Ongoing security operations and compliance maintenance.',
    features: ['Vulnerability scanning', 'Patch management', 'Access reviews', 'Compliance audits'],
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reporting',
    description: 'Insights into AI usage, performance, and business impact.',
    features: ['Usage analytics', 'ROI reporting', 'Trend analysis', 'Custom dashboards'],
  },
];

const tiers = [
  {
    name: 'Standard',
    description: 'For organizations with basic AI operations needs',
    features: [
      'Cloud hosting (shared infrastructure)',
      'Business hours support (9-5 M-F)',
      'Monthly model reviews',
      '99.5% uptime SLA',
      'Standard security monitoring',
      'Quarterly business reviews',
    ],
    highlight: false,
  },
  {
    name: 'Professional',
    description: 'For organizations with mission-critical AI applications',
    features: [
      'Dedicated cloud infrastructure',
      '24/7 support with 1-hour response',
      'Weekly model optimization',
      '99.9% uptime SLA',
      'Advanced security operations',
      'Monthly business reviews',
      'Named account manager',
      'Priority feature requests',
    ],
    highlight: true,
  },
  {
    name: 'Enterprise',
    description: 'For large institutions with complex requirements',
    features: [
      'Private cloud or hybrid deployment',
      '24/7 support with 15-min response',
      'Continuous model optimization',
      '99.99% uptime SLA',
      'Dedicated security team',
      'Weekly executive reviews',
      'On-site support available',
      'Custom SLA terms',
      'Unlimited training',
    ],
    highlight: false,
  },
];

const slaMetrics = [
  { metric: 'Uptime', standard: '99.5%', professional: '99.9%', enterprise: '99.99%' },
  { metric: 'Response Time (P1)', standard: '4 hours', professional: '1 hour', enterprise: '15 minutes' },
  { metric: 'Response Time (P2)', standard: '8 hours', professional: '4 hours', enterprise: '1 hour' },
  { metric: 'Model Update Frequency', standard: 'Monthly', professional: 'Weekly', enterprise: 'Continuous' },
  { metric: 'Business Reviews', standard: 'Quarterly', professional: 'Monthly', enterprise: 'Weekly' },
];

export default function ManagedServicesPage() {
  const faqs = serviceFAQs[serviceId] || [];

  return (
    <main>
      <ServiceJsonLd
        name={serviceName}
        description={serviceDescription}
        serviceType="Managed Services"
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
      <section className="py-20 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
        <div className="container-wide">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-slate-400 text-sm mb-8">
              <Link href="/services" className="hover:text-white">Services</Link>
              <span>/</span>
              <span className="text-white">Managed AI Services</span>
            </nav>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Server className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Managed AI Services
                </h1>
                <p className="text-xl text-slate-300 mb-6">
                  Deploy it and forget it—we handle the infrastructure, monitoring, updates, and support
                  so your team can focus on outcomes, not operations.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact?inquiry=managed-services"
                    className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition"
                  >
                    Get Pricing
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
              <div className="text-3xl font-bold text-slate-900">99.9%</div>
              <p className="text-sm text-slate-500">Average uptime</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">&lt;15min</div>
              <p className="text-sm text-slate-500">Fastest response time</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">24/7</div>
              <p className="text-sm text-slate-500">Monitoring coverage</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">100+</div>
              <p className="text-sm text-slate-500">Active managed clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What&apos;s Included
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive managed services for worry-free AI operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-white rounded-2xl p-6 border border-slate-100">
                <service.icon className="w-10 h-10 text-slate-700 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{service.description}</p>
                <div className="space-y-2">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Service Tiers
            </h2>
            <p className="text-xl text-slate-600">
              Choose the support level that matches your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 ${
                  tier.highlight
                    ? 'bg-slate-900 text-white ring-4 ring-primary-500'
                    : 'bg-slate-50 border border-slate-200'
                }`}
              >
                {tier.highlight && (
                  <span className="inline-block px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${tier.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm mb-6 ${tier.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                  {tier.description}
                </p>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 ${tier.highlight ? 'text-primary-400' : 'text-emerald-500'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className={tier.highlight ? 'text-slate-200' : 'text-slate-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA Table */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              SLA Comparison
            </h2>
            <p className="text-xl text-slate-300">
              Clear commitments you can count on
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4 font-semibold">Metric</th>
                  <th className="text-center py-4 px-4 font-semibold">Standard</th>
                  <th className="text-center py-4 px-4 font-semibold text-primary-400">Professional</th>
                  <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {slaMetrics.map((row) => (
                  <tr key={row.metric} className="border-b border-white/10">
                    <td className="py-4 px-4 text-slate-300">{row.metric}</td>
                    <td className="py-4 px-4 text-center text-slate-400">{row.standard}</td>
                    <td className="py-4 px-4 text-center text-white font-medium">{row.professional}</td>
                    <td className="py-4 px-4 text-center text-slate-400">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">Common questions about Managed AI Services</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-700 to-slate-900">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let Us Handle the Operations
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Focus on educational outcomes while we ensure your AI systems run flawlessly.
            </p>
            <Link
              href="/contact?inquiry=managed-services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Get Custom Pricing
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
