import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Code, Cpu, Server, Users, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Custom AI Development',
  description: 'We build bespoke AI solutions for education companies. From concept to deployment, we develop intelligent tools tailored to your specific business needs.',
};

const capabilities = [
  {
    icon: Cpu,
    title: 'AI Product Development',
    description: 'End-to-end development of education AI tools—from initial concept through deployment and ongoing refinement.',
  },
  {
    icon: Code,
    title: 'API & Integration',
    description: 'Connect AI capabilities to your existing platform, LMS, or tech stack with clean, documented APIs.',
  },
  {
    icon: Server,
    title: 'Hosting & Management',
    description: 'We can host and manage your AI infrastructure, or deploy on your servers—whatever fits your needs.',
  },
  {
    icon: Users,
    title: 'Training & Support',
    description: 'Dedicated support team to ensure successful adoption, with training for your staff.',
  },
  {
    icon: Zap,
    title: 'Technology Transfer',
    description: 'Full handoff with your branding. Your customers never see Evelyn—it&apos;s your product.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant infrastructure with data privacy controls for sensitive educational data.',
  },
];

const customProducts = [
  {
    title: 'Adaptive Learning Engines',
    description: 'AI that adjusts difficulty, pacing, and content based on individual learner performance.',
    useCases: ['Personalized learning paths', 'Mastery-based progression', 'Remediation systems'],
  },
  {
    title: 'Intelligent Content Systems',
    description: 'AI-powered content creation, curation, and transformation tools.',
    useCases: ['Auto-generated assessments', 'Content summarization', 'Multi-format conversion'],
  },
  {
    title: 'Conversational Learning Agents',
    description: 'Custom chatbots and virtual tutors trained on your specific content and pedagogy.',
    useCases: ['Subject-specific tutors', 'Onboarding assistants', 'FAQ bots'],
  },
  {
    title: 'Analytics & Insights Platforms',
    description: 'AI-driven dashboards that surface actionable insights from learning data.',
    useCases: ['At-risk student detection', 'Learning pattern analysis', 'Outcome prediction'],
  },
  {
    title: 'Assessment Intelligence',
    description: 'Smart grading, feedback, and question generation systems.',
    useCases: ['Essay scoring', 'Code review', 'Rubric-based evaluation'],
  },
  {
    title: 'Accessibility Solutions',
    description: 'AI tools that make content accessible to all learners.',
    useCases: ['Auto-captioning', 'Text-to-speech', 'Reading level adjustment'],
  },
];

const process = [
  {
    step: '01',
    title: 'Discovery',
    description: 'We dive deep into your business processes, user needs, and educational goals to understand exactly what you need.',
  },
  {
    step: '02',
    title: 'Design',
    description: 'Our educators and engineers collaborate to design an AI solution that&apos;s pedagogically sound and technically robust.',
  },
  {
    step: '03',
    title: 'Development',
    description: 'Agile development with regular demos. You see progress and can provide feedback throughout.',
  },
  {
    step: '04',
    title: 'Deployment',
    description: 'We handle deployment—whether on your infrastructure or ours—with minimal disruption to your operations.',
  },
  {
    step: '05',
    title: 'Iteration',
    description: 'Continuous improvement based on real usage data. AI gets smarter over time with your content.',
  },
];

export default function CustomAIPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium mb-6">
              Custom AI Development
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              We Build AI Solutions
              <span className="block text-primary-400">Tailored to Your Business</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Beyond our ready-made products, we develop custom AI solutions that fit your exact requirements,
              tech stack, and business processes. Your vision, our expertise.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact?inquiry=custom-ai"
                className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition"
              >
                Discuss Your Project
              </Link>
              <Link
                href="/products"
                className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              >
                See Our AI Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Full-Service AI Development
            </h2>
            <p className="text-xl text-slate-600">
              From concept to production, we handle every aspect of building your AI solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability) => (
              <div key={capability.title} className="p-6 rounded-2xl bg-slate-50 hover:bg-primary-50 transition-colors">
                <capability.icon className="w-10 h-10 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{capability.title}</h3>
                <p className="text-slate-600">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Can Build */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Custom Solutions We&apos;ve Built
            </h2>
            <p className="text-xl text-slate-600">
              Examples of bespoke AI products we&apos;ve developed for education companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customProducts.map((product) => (
              <div key={product.title} className="bg-white rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{product.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{product.description}</p>
                <div className="space-y-1">
                  {product.useCases.map((useCase) => (
                    <div key={useCase} className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      {useCase}
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
              Our Development Process
            </h2>
            <p className="text-xl text-slate-600">
              A proven approach that balances speed with quality.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {process.map((step, idx) => (
              <div key={step.step} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-500 text-white font-bold flex items-center justify-center">
                    {step.step}
                  </div>
                  {idx < process.length - 1 && (
                    <div className="w-0.5 h-16 bg-primary-200 mx-auto mt-2" />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-700 text-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Build Custom AI with Evelyn?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl font-bold mb-2">300+</div>
                <div className="text-primary-200">Educators on our team</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="text-primary-200">Years in education</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-primary-200">Custom projects delivered</div>
              </div>
            </div>
            <p className="text-xl text-primary-100 mt-8 mb-8">
              Most AI companies don&apos;t understand education. Most education companies don&apos;t understand AI.
              We do both—and that&apos;s why our custom solutions actually work.
            </p>
            <Link
              href="/contact?inquiry=custom-ai"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-slate-100 transition"
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
