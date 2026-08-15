'use client';

import Link from 'next/link';

// Hero Section
function HeroSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container-wide">
        <div className="max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-blue-200 text-sm mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Security & Compliance</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🔒</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Enterprise-Grade Security
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Your data stays yours. We build AI solutions with security and privacy at the core—designed
                for education institutions that trust us with their most sensitive information.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact?subject=security"
                  className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-blue-50 transition"
                >
                  Request Security Documentation
                </Link>
                <Link
                  href="/integrations"
                  className="px-6 py-3 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition"
                >
                  View Integrations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Compliance Badges Grid
function ComplianceBadgesSection() {
  const badges = [
    {
      name: 'FERPA',
      fullName: 'Family Educational Rights and Privacy Act',
      description: 'Student data privacy protections for educational records',
      icon: '🎓',
      color: 'blue'
    },
    {
      name: 'COPPA',
      fullName: "Children's Online Privacy Protection Act",
      description: 'Protection for children under 13 years of age',
      icon: '👶',
      color: 'green'
    },
    {
      name: 'GDPR',
      fullName: 'General Data Protection Regulation',
      description: 'EU data protection and privacy standards',
      icon: '🇪🇺',
      color: 'purple'
    },
    {
      name: 'SOC 2 Type II',
      fullName: 'Service Organization Control 2',
      description: 'Security practices aligned with SOC 2 standards',
      icon: '✓',
      color: 'slate'
    },
    {
      name: 'WCAG 2.1 AA',
      fullName: 'Web Content Accessibility Guidelines',
      description: 'Digital accessibility compliance standards',
      icon: '♿',
      color: 'cyan'
    },
    {
      name: 'CCPA',
      fullName: 'California Consumer Privacy Act',
      description: 'California privacy rights compliance',
      icon: '🌴',
      color: 'orange'
    }
  ];

  const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-700' },
    green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-100 text-green-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-700' },
    slate: { bg: 'bg-slate-50', border: 'border-slate-200', icon: 'bg-slate-100 text-slate-700' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', icon: 'bg-cyan-100 text-cyan-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-100 text-orange-700' }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Compliance & Certifications</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Built with education-specific privacy regulations in mind from day one
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {badges.map((badge, idx) => {
            const colors = colorClasses[badge.color];
            return (
              <div
                key={idx}
                className={`${colors.bg} ${colors.border} border rounded-2xl p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${colors.icon} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{badge.name}</h3>
                    <p className="text-sm text-slate-500 mb-2">{badge.fullName}</p>
                    <p className="text-sm text-slate-600">{badge.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Data Security Practices
function DataSecuritySection() {
  const practices = [
    {
      title: 'Encryption at Rest & In Transit',
      description: 'All data is encrypted using AES-256 encryption at rest and TLS 1.3 for data in transit.',
      icon: '🔐'
    },
    {
      title: 'Access Control',
      description: 'Role-based access control (RBAC) with principle of least privilege. Multi-factor authentication required.',
      icon: '🔑'
    },
    {
      title: 'Data Isolation',
      description: 'Multi-tenant architecture with strict data isolation. Your data never mixes with other clients.',
      icon: '🏠'
    },
    {
      title: 'Audit Logging',
      description: 'Comprehensive audit trails for all data access and system changes. Logs retained for compliance.',
      icon: '📋'
    },
    {
      title: 'Regular Penetration Testing',
      description: 'Third-party security assessments and penetration testing conducted annually.',
      icon: '🔍'
    },
    {
      title: 'Secure Development',
      description: 'Secure SDLC practices including code reviews, static analysis, and dependency scanning.',
      icon: '💻'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Data Security Practices</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Industry-leading security practices protecting your educational data
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {practices.map((practice, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <span className="text-3xl mb-4 block">{practice.icon}</span>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{practice.title}</h3>
              <p className="text-slate-600">{practice.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Infrastructure Security
function InfrastructureSection() {
  const features = [
    {
      title: 'Cloud Infrastructure',
      points: [
        'Hosted on AWS with SOC 2 certified data centers',
        'US-based data residency by default',
        'EU data residency available for GDPR compliance',
        'Geographic redundancy across multiple availability zones'
      ]
    },
    {
      title: 'Monitoring & Response',
      points: [
        '24/7 automated security monitoring',
        'Real-time threat detection and alerting',
        'Incident response team with defined SLAs',
        'Regular disaster recovery testing'
      ]
    },
    {
      title: 'Backup & Recovery',
      points: [
        'Automated daily backups with 30-day retention',
        'Point-in-time recovery capability',
        'Cross-region backup replication',
        'Documented recovery procedures'
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Infrastructure Security</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Enterprise-grade infrastructure built for reliability and security
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
              <ul className="space-y-3">
                {feature.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Privacy Commitments
function PrivacyCommitmentsSection() {
  const commitments = [
    {
      title: 'Your Data Stays Yours',
      description: 'You retain full ownership of all data you provide to us. We process your data only to provide our services.',
      icon: '📁'
    },
    {
      title: 'No AI Training on Your Data',
      description: 'We never use your content or student data to train AI models. Your data is used solely to deliver your requested services.',
      icon: '🤖'
    },
    {
      title: 'Data Minimization',
      description: 'We only collect data necessary to provide our services. No excessive data collection or retention.',
      icon: '📊'
    },
    {
      title: 'Right to Deletion',
      description: 'Request deletion of your data at any time. We process deletion requests within 30 days.',
      icon: '🗑️'
    },
    {
      title: 'Transparent Processing',
      description: 'Clear documentation of how we use your data. No hidden purposes or surprise data sharing.',
      icon: '👁️'
    },
    {
      title: 'Student Privacy First',
      description: 'Educator-designed with student privacy as a foundational principle. Extra protections for minors.',
      icon: '🎒'
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Privacy Commitments</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Clear promises about how we handle your data
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {commitments.map((commitment, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <span className="text-3xl mb-4 block">{commitment.icon}</span>
              <h3 className="text-xl font-semibold mb-2">{commitment.title}</h3>
              <p className="text-slate-300">{commitment.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Vendor Security (AI Providers)
function VendorSecuritySection() {
  const vendors = [
    {
      name: 'Anthropic (Claude)',
      logo: '🧠',
      certifications: ['SOC 2 Type II', 'GDPR Compliant'],
      dataPolicy: 'No training on API data. Prompts not stored beyond request processing.'
    },
    {
      name: 'OpenAI',
      logo: '🤖',
      certifications: ['SOC 2 Type II', 'GDPR Compliant'],
      dataPolicy: 'API data not used for training. Zero data retention available.'
    },
    {
      name: 'AWS',
      logo: '☁️',
      certifications: ['SOC 2 Type II', 'ISO 27001', 'FedRAMP'],
      dataPolicy: 'Customer data ownership. Regional data residency options.'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Vendor & AI Provider Security</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We carefully vet our technology partners to ensure they meet our security standards
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {vendors.map((vendor, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-center mb-4">
                <span className="text-4xl">{vendor.logo}</span>
                <h3 className="text-lg font-semibold text-slate-900 mt-2">{vendor.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {vendor.certifications.map((cert, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {cert}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-600 text-center">{vendor.dataPolicy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-slate-800">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Questions About Security?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our team is happy to discuss your specific security requirements, provide additional documentation,
            or walk through our security practices in detail.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?subject=security"
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Contact Security Team
            </Link>
            <Link
              href="/contact?demo=true"
              className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Schedule a Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Page
export default function SecurityPage() {
  return (
    <main className="pt-16">
      <HeroSection />
      <ComplianceBadgesSection />
      <DataSecuritySection />
      <InfrastructureSection />
      <PrivacyCommitmentsSection />
      <VendorSecuritySection />
      <CTASection />
    </main>
  );
}
