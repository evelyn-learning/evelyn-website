import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, CheckCircle, PenTool, BarChart3, Globe } from 'lucide-react';
import { ServiceJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { FAQ } from '@/components/ui/FAQ';
import { serviceFAQs } from '@/data/faqs/services';
import { getKeywordsForService } from '@/lib/seo/keywords';

const serviceId = 'content';
const serviceName = 'Content Transformation';
const serviceDescription = 'Professional educational content development services. Curriculum design, assessment creation, content conversion, and more from a team of 300+ educators.';

export const metadata: Metadata = {
  title: `${serviceName} | Evelyn Learning`,
  description: serviceDescription,
  keywords: getKeywordsForService(serviceId),
};

const services = [
  {
    icon: BookOpen,
    title: 'Curriculum Development',
    description: 'Complete curriculum design aligned to standards (Common Core, NGSS, state standards) with scope and sequence, lesson plans, and instructional materials.',
    deliverables: ['Scope & sequence documents', 'Lesson plans', 'Teacher guides', 'Student materials'],
  },
  {
    icon: FileText,
    title: 'Assessment Authoring',
    description: 'High-quality assessment items for formative, summative, and standardized testing. Aligned to standards with detailed metadata.',
    deliverables: ['Multiple choice items', 'Constructed response', 'Performance tasks', 'Rubrics'],
  },
  {
    icon: PenTool,
    title: 'Content Creation',
    description: 'Original educational content across subjects and grade levels. Engaging, accurate, and pedagogically sound.',
    deliverables: ['Textbook content', 'Digital lessons', 'Video scripts', 'Interactive content'],
  },
  {
    icon: CheckCircle,
    title: 'Content Review & QA',
    description: 'Expert review for accuracy, alignment, bias, and accessibility. Multi-stage QA processes for production-ready content.',
    deliverables: ['Accuracy review', 'Standards alignment', 'Bias & sensitivity review', 'ADA compliance'],
  },
  {
    icon: BarChart3,
    title: 'Item Analysis & Validation',
    description: 'Psychometric analysis and field testing to ensure assessment quality and reliability.',
    deliverables: ['Difficulty analysis', 'Discrimination indices', 'DIF analysis', 'Validity studies'],
  },
  {
    icon: Globe,
    title: 'Localization & Adaptation',
    description: 'Adapt content for different regions, languages, and cultural contexts while maintaining educational integrity.',
    deliverables: ['Translation', 'Cultural adaptation', 'Regional customization', 'Accessibility conversion'],
  },
];

const subjects = [
  'Mathematics', 'English Language Arts', 'Science', 'Social Studies',
  'World Languages', 'Computer Science', 'Test Prep (SAT, ACT, AP)',
  'Professional Development', 'Corporate Training', 'Higher Education',
];

const stats = [
  { value: '1M+', label: 'Content items delivered' },
  { value: '300+', label: 'Educator experts' },
  { value: '50+', label: 'Subject areas' },
  { value: '500+', label: 'Clients served' },
];

export default function ContentServicesPage() {
  const faqs = serviceFAQs[serviceId] || [];

  return (
    <main>
      <ServiceJsonLd
        name={serviceName}
        description={serviceDescription}
        serviceType="Content Services"
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
            <span className="inline-block px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
              Content Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Educational Content
              <span className="block text-emerald-200">Built by Educators</span>
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              From curriculum development to assessment authoring, our team of 300+ educators
              creates high-quality educational content at scale. Every team member has taught—it&apos;s
              how we ensure content that actually works in classrooms.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact?inquiry=content"
                className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition"
              >
                Get a Quote
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              >
                Meet Our Team
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

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Content Services
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive content solutions for publishers, EdTech companies, and educational institutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-slate-50 rounded-2xl p-6 hover:bg-emerald-50 transition-colors">
                <service.icon className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{service.description}</p>
                <div className="space-y-1">
                  {service.deliverables.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-500">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Subject Matter Expertise
            </h2>
            <p className="text-xl text-slate-600">
              Deep expertise across K-12, higher education, test prep, and professional development.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {subjects.map((subject) => (
              <span
                key={subject}
                className="px-4 py-2 bg-white rounded-full text-slate-700 text-sm font-medium border border-slate-200"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* AI Enhancement */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                AI-Enhanced
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Content Services + AI
              </h2>
              <p className="text-xl text-slate-600 mb-6">
                We combine traditional content development with AI tools to deliver
                faster, more cost-effective solutions without sacrificing quality.
              </p>
              <ul className="space-y-3">
                {[
                  'AI-assisted first drafts reviewed by human experts',
                  'Automated standards alignment checking',
                  'AI-powered consistency and style enforcement',
                  'Intelligent content tagging and metadata',
                  'Rapid content variation generation',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">The Best of Both Worlds</h3>
              <p className="text-slate-600 mb-6">
                AI handles the heavy lifting—generating initial drafts, checking alignment,
                ensuring consistency. Human educators review, refine, and ensure pedagogical quality.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">40%</div>
                  <div className="text-sm text-slate-500">Faster delivery</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">100%</div>
                  <div className="text-sm text-slate-500">Human reviewed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">Common questions about Content Transformation</p>
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
              Ready to Scale Your Content?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Tell us about your project and get a custom quote from our team.
            </p>
            <Link
              href="/contact?inquiry=content"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition"
            >
              Get a Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
