'use client';

import Link from 'next/link';

// Hero Section
function HeroSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
      <div className="container-wide">
        <div className="max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-emerald-200 text-sm mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Integrations</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🔌</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Integration Ready
              </h1>
              <p className="text-xl text-emerald-100 mb-6">
                Connect to your existing ecosystem. Our AI products work seamlessly with the LMS platforms,
                authentication systems, and tools your institution already uses.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact?subject=integration"
                  className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition"
                >
                  Discuss Integration Needs
                </Link>
                <Link
                  href="/security"
                  className="px-6 py-3 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition"
                >
                  Security & Compliance
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// LMS Platform Grid
function LMSPlatformsSection() {
  const platforms = [
    {
      name: 'Canvas',
      logo: '🎨',
      description: 'Full LTI 1.3 integration with Canvas LMS for seamless tool launches and grade passback.',
      status: 'Integration Ready'
    },
    {
      name: 'Blackboard',
      logo: '📋',
      description: 'Compatible with Blackboard Learn through LTI and REST API integration options.',
      status: 'Integration Ready'
    },
    {
      name: 'Moodle',
      logo: '🎓',
      description: 'Works with Moodle deployments through standard LTI protocol support.',
      status: 'Integration Ready'
    },
    {
      name: 'Google Classroom',
      logo: '📚',
      description: 'Connect with Google Classroom through our dedicated integration layer.',
      status: 'Integration Ready'
    },
    {
      name: 'Schoology',
      logo: '🏫',
      description: 'LTI-based integration with Schoology learning management platform.',
      status: 'Integration Ready'
    },
    {
      name: 'Brightspace (D2L)',
      logo: '💡',
      description: 'Full compatibility with Brightspace through LTI 1.3 standards.',
      status: 'Integration Ready'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">LMS Platform Support</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Works with your existing tech stack—no switching costs, no platform lock-in
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {platforms.map((platform, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-slate-100 hover:border-emerald-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{platform.logo}</span>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{platform.name}</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    {platform.status}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-sm">{platform.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Don&apos;t see your LMS? <Link href="/contact" className="text-emerald-600 hover:underline">Contact us</Link> - we can discuss custom integration options.
          </p>
        </div>
      </div>
    </section>
  );
}

// Technical Capabilities
function TechnicalCapabilitiesSection() {
  const capabilities = [
    {
      title: 'LTI 1.3 Compliant',
      description: 'Full Learning Tools Interoperability 1.3 support for secure tool launches, deep linking, and grade passback.',
      icon: '🔗',
      badge: 'Standard'
    },
    {
      title: 'REST API Access',
      description: 'Comprehensive RESTful APIs for programmatic integration with your systems and workflows.',
      icon: '🔧',
      badge: 'Full Access'
    },
    {
      title: 'Single Sign-On (SSO)',
      description: 'SAML 2.0 and OAuth 2.0 support for seamless authentication with your identity provider.',
      icon: '🔐',
      badge: 'Enterprise'
    },
    {
      title: 'Webhook Support',
      description: 'Real-time event notifications to keep your systems synchronized with user activities.',
      icon: '📡',
      badge: 'Real-time'
    },
    {
      title: 'Bulk Data Import/Export',
      description: 'Efficient data migration tools for large-scale deployments and reporting.',
      icon: '📦',
      badge: 'Scalable'
    },
    {
      title: 'Custom Branding',
      description: 'White-label options to match your institution&apos;s brand across all touchpoints.',
      icon: '🎨',
      badge: 'Customizable'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Technical Capabilities</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Enterprise-grade integration infrastructure built for scale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{cap.icon}</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  {cap.badge}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{cap.title}</h3>
              <p className="text-slate-600">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Integration Options
function IntegrationOptionsSection() {
  const options = [
    {
      title: 'White-Label Embedding',
      description: 'Embed our AI tools directly into your existing platform with your branding. Students interact with your interface—Evelyn powers it behind the scenes.',
      features: ['Custom CSS/themes', 'Your domain', 'Logo replacement', 'Branded communications'],
      ideal: 'EdTech platforms wanting seamless integration',
      icon: '🏷️'
    },
    {
      title: 'API-First Integration',
      description: 'Full programmatic access to all our AI capabilities. Build custom experiences on top of our infrastructure.',
      features: ['RESTful endpoints', 'Webhook callbacks', 'Rate limiting tiers', 'Comprehensive docs'],
      ideal: 'Development teams building custom solutions',
      icon: '🔧'
    },
    {
      title: 'LTI Tool Provider',
      description: 'Plug our tools directly into any LTI-compatible LMS. Launch from course menus with automatic authentication.',
      features: ['One-click install', 'Grade passback', 'Roster sync', 'Deep linking'],
      ideal: 'Institutions with existing LMS deployments',
      icon: '🔌'
    },
    {
      title: 'Standalone Deployment',
      description: 'Use our hosted platform directly. No integration needed—just add users and start using our AI tools.',
      features: ['Instant setup', 'User management', 'Analytics dashboard', 'No dev work needed'],
      ideal: 'Organizations wanting quick deployment',
      icon: '🖥️'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Flexible Deployment Options</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the integration approach that works best for your technical needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {options.map((option, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-emerald-200 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{option.icon}</span>
                <h3 className="text-xl font-bold text-slate-900">{option.title}</h3>
              </div>
              <p className="text-slate-600 mb-6">{option.description}</p>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Includes:</h4>
                <div className="flex flex-wrap gap-2">
                  {option.features.map((feature, i) => (
                    <span key={i} className="px-3 py-1 bg-white text-slate-600 text-sm rounded-lg border border-slate-200">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm">
                  <span className="font-medium text-slate-700">Ideal for:</span>{' '}
                  <span className="text-slate-500">{option.ideal}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Developer Resources Preview
function DeveloperResourcesSection() {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Developer Resources</h2>
            <p className="text-xl text-slate-300">
              Everything you need to integrate Evelyn AI into your platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'API Documentation',
                description: 'Comprehensive API reference with examples, authentication guides, and best practices.',
                icon: '📚',
                status: 'Coming Soon'
              },
              {
                title: 'SDKs & Libraries',
                description: 'Client libraries for popular languages to accelerate your integration.',
                icon: '📦',
                status: 'Coming Soon'
              },
              {
                title: 'Integration Guides',
                description: 'Step-by-step tutorials for common integration patterns and use cases.',
                icon: '📖',
                status: 'Coming Soon'
              }
            ].map((resource, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                <span className="text-3xl mb-4 block">{resource.icon}</span>
                <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                <p className="text-slate-300 text-sm mb-4">{resource.description}</p>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-emerald-300 text-xs rounded-full">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  {resource.status}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-400 mb-4">
              Need early access to our developer resources?
            </p>
            <Link
              href="/contact?subject=developer-access"
              className="inline-flex items-center gap-2 text-emerald-400 font-medium hover:text-emerald-300"
            >
              Request Developer Preview Access
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Enterprise SSO Section
function EnterpriseFeatures() {
  const features = [
    {
      title: 'SAML 2.0',
      description: 'Connect with enterprise identity providers like Okta, Azure AD, OneLogin, and more.'
    },
    {
      title: 'OAuth 2.0',
      description: 'Standard OAuth flows for secure authorization with your existing auth systems.'
    },
    {
      title: 'SCIM Provisioning',
      description: 'Automated user provisioning and deprovisioning from your identity provider.'
    },
    {
      title: 'Custom Domains',
      description: 'Host our tools on your own domain for a seamless branded experience.'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Enterprise Features
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Enterprise SSO & Provisioning</h2>
            <p className="text-xl text-slate-600">
              Integrate with your existing identity infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-600 to-teal-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Discuss Your Integration Needs
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Every institution is different. Let&apos;s talk about your specific technical requirements
            and find the right integration approach for your use case.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?subject=integration"
              className="px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition"
            >
              Talk to Integration Team
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Page
export default function IntegrationsPage() {
  return (
    <main className="pt-16">
      <HeroSection />
      <LMSPlatformsSection />
      <TechnicalCapabilitiesSection />
      <IntegrationOptionsSection />
      <EnterpriseFeatures />
      <DeveloperResourcesSection />
      <CTASection />
    </main>
  );
}
