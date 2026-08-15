import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI for Enterprise Learning & Development',
  description: 'AI-powered workforce training, compliance education, skills assessment, and employee upskilling solutions for enterprise organizations.',
};

const solutions = [
  {
    title: 'Workforce Upskilling AI',
    description: 'Personalized learning paths that adapt to each employee\'s current skills, role requirements, and learning pace.',
    benefits: ['Skills gap analysis', 'Personalized pathways', 'Progress tracking'],
    icon: '📈',
  },
  {
    title: 'Compliance Training Platform',
    description: 'AI-powered compliance education that ensures completion, understanding, and retention—not just checkboxes.',
    benefits: ['Adaptive assessments', 'Knowledge verification', 'Audit-ready reporting'],
    icon: '✅',
  },
  {
    title: 'Skills Assessment Engine',
    description: 'Measure employee competencies with AI-generated assessments tailored to your organization\'s skill frameworks.',
    benefits: ['Custom skill taxonomies', 'Continuous assessment', 'Team analytics'],
    icon: '🎯',
  },
  {
    title: 'Learning Content AI',
    description: 'Transform your internal knowledge base into interactive learning content. Policies, procedures, and expertise—made learnable.',
    benefits: ['Content transformation', 'Knowledge extraction', 'Multi-format delivery'],
    icon: '📚',
  },
  {
    title: 'AI Training Assistant',
    description: '24/7 AI assistant that answers employee questions about training, policies, and procedures.',
    benefits: ['Instant answers', 'Consistent information', 'Reduces HR tickets'],
    icon: '🤖',
  },
  {
    title: 'Leadership Development',
    description: 'AI-powered coaching and development for managers and leaders, with personalized feedback and growth plans.',
    benefits: ['360 feedback analysis', 'Personalized coaching', 'Development tracking'],
    icon: '👔',
  },
];

const useCases = [
  {
    industry: 'Technology',
    challenge: 'Rapid skill evolution, need to upskill thousands of engineers on new frameworks',
    solution: 'AI-powered skills assessment identifies gaps. Personalized learning paths close them efficiently.',
  },
  {
    industry: 'Healthcare',
    challenge: 'Compliance training completion and retention across distributed workforce',
    solution: 'Adaptive compliance platform ensures understanding, not just completion. AI tracks knowledge decay.',
  },
  {
    industry: 'Financial Services',
    challenge: 'Onboarding new hires quickly while ensuring regulatory compliance',
    solution: 'AI training assistant answers questions 24/7. Assessment engine verifies readiness.',
  },
  {
    industry: 'Manufacturing',
    challenge: 'Converting tribal knowledge from retiring workforce into training materials',
    solution: 'Learning Content AI transforms expertise into structured, adaptive learning experiences.',
  },
];

const capabilities = [
  'SCORM & xAPI compatible',
  'SSO & SAML integration',
  'LMS/LXP integration',
  'Custom branding',
  'Enterprise security (SOC 2)',
  'Dedicated success manager',
  'API access',
  'On-premise deployment options',
];

export default function EnterpriseIndustryPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        <div className="container-wide">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-slate-400 text-sm mb-6">
              <Link href="/industries" className="hover:text-white">Industries</Link>
              <span>/</span>
              <span className="text-white">Enterprise</span>
            </nav>
            <div className="flex items-start gap-6">
              <span className="text-6xl">🏢</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  AI for Enterprise Learning
                </h1>
                <p className="text-xl text-slate-300 mb-6">
                  Upskill your workforce with AI-powered training, compliance education,
                  and skills assessment. Personalized learning at scale—with enterprise-grade
                  security and integration.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact?industry=enterprise"
                    className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition"
                  >
                    Request a Demo
                  </Link>
                  <Link
                    href="/services/custom-ai"
                    className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
                  >
                    Custom Solutions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Enterprise AI Solutions
            </h2>
            <p className="text-xl text-slate-600">
              AI-powered tools for corporate learning and development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {solutions.map((solution) => (
              <div key={solution.title} className="bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors">
                <span className="text-4xl mb-4 block">{solution.icon}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{solution.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Industry Use Cases
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {useCases.map((useCase) => (
              <div key={useCase.industry} className="bg-white rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{useCase.industry}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Challenge</p>
                    <p className="text-slate-700 text-sm">{useCase.challenge}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Solution</p>
                    <p className="text-slate-700 text-sm">{useCase.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Capabilities */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Enterprise-Grade Platform
              </h2>
              <p className="text-slate-600 mb-6">
                Built for the security, compliance, and integration requirements of
                large organizations. Deploy with confidence.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {capabilities.map((capability) => (
                  <div key={capability} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {capability}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-8">
              <h3 className="font-bold text-slate-900 mb-4">ROI You Can Measure</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Training time reduction</span>
                  <span className="text-2xl font-bold text-emerald-600">40%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Compliance completion rate</span>
                  <span className="text-2xl font-bold text-emerald-600">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Knowledge retention</span>
                  <span className="text-2xl font-bold text-emerald-600">+60%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your L&D?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Let&apos;s discuss how AI can power your workforce development.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact?industry=enterprise"
                className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition"
              >
                Request a Demo
              </Link>
              <Link
                href="/services/custom-ai"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              >
                Custom Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
