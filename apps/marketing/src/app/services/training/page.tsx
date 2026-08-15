import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Users, BookOpen, Award, Video, Calendar } from 'lucide-react';
import { ServiceJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { FAQ } from '@/components/ui/FAQ';
import { serviceFAQs } from '@/data/faqs/services';
import { getKeywordsForService } from '@/lib/seo/keywords';

const serviceId = 'training';
const serviceName = 'Faculty & Staff Training';
const serviceDescription = 'Train educators on AI tools, prompt engineering, AI-enhanced pedagogy, and academic integrity. Workshops, certifications, and train-the-trainer programs.';

export const metadata: Metadata = {
  title: `${serviceName} | Evelyn Learning`,
  description: serviceDescription,
  keywords: getKeywordsForService(serviceId),
};

const programs = [
  {
    icon: BookOpen,
    title: 'AI Foundations for Educators',
    duration: '2 days',
    format: 'In-person or virtual',
    description: 'Build foundational understanding of AI in education for faculty and staff.',
    topics: [
      'How AI works (without the jargon)',
      'Current AI tools in education',
      'Opportunities and limitations',
      'Ethical considerations',
    ],
  },
  {
    icon: GraduationCap,
    title: 'AI-Enhanced Pedagogy',
    duration: '3 days',
    format: 'Blended learning',
    description: 'Transform teaching practices with AI as a pedagogical partner.',
    topics: [
      'AI for personalized learning',
      'Automated feedback strategies',
      'AI-assisted lesson planning',
      'Assessment innovation',
    ],
  },
  {
    icon: Award,
    title: 'Prompt Engineering Certification',
    duration: '1 day + project',
    format: 'Self-paced + workshop',
    description: 'Master the art of getting great results from AI tools.',
    topics: [
      'Prompt design principles',
      'Educational prompt templates',
      'Iterative refinement',
      'Quality evaluation',
    ],
  },
  {
    icon: Users,
    title: 'Train-the-Trainer',
    duration: '4 days',
    format: 'Intensive workshop',
    description: 'Build internal capacity to train others on AI tools and practices.',
    topics: [
      'Adult learning principles',
      'Facilitation techniques',
      'Workshop design',
      'Ongoing support strategies',
    ],
  },
  {
    icon: Video,
    title: 'Academic Integrity in the AI Era',
    duration: '1 day',
    format: 'Interactive workshop',
    description: 'Navigate the changing landscape of academic honesty with AI.',
    topics: [
      'Detection vs. prevention',
      'Policy development',
      'Assignment redesign',
      'Student conversations',
    ],
  },
  {
    icon: Calendar,
    title: 'Custom Training Programs',
    duration: 'Varies',
    format: 'Tailored to your needs',
    description: 'Bespoke training designed for your specific tools and context.',
    topics: [
      'Needs assessment',
      'Custom curriculum',
      'Platform-specific training',
      'Ongoing coaching',
    ],
  },
];

const audiences = [
  {
    role: 'Faculty',
    needs: 'How to use AI to enhance teaching and research',
    outcomes: 'Effective AI integration in courses, improved productivity',
  },
  {
    role: 'Instructional Designers',
    needs: 'Building AI-enhanced learning experiences',
    outcomes: 'AI-powered content creation, adaptive learning design',
  },
  {
    role: 'Academic Leaders',
    needs: 'Strategic AI adoption and policy decisions',
    outcomes: 'Informed leadership, risk mitigation, innovation culture',
  },
  {
    role: 'IT Staff',
    needs: 'Supporting and maintaining AI tools',
    outcomes: 'Technical competency, user support skills',
  },
  {
    role: 'Advisors & Counselors',
    needs: 'AI tools for student support and career guidance',
    outcomes: 'Efficient advising, better student outcomes',
  },
  {
    role: 'Administrators',
    needs: 'AI for operational efficiency and decision-making',
    outcomes: 'Process automation, data-driven decisions',
  },
];

const stats = [
  { value: '10K+', label: 'Educators trained' },
  { value: '95%', label: 'Satisfaction rate' },
  { value: '50+', label: 'Institutions served' },
  { value: '4.8/5', label: 'Average rating' },
];

export default function TrainingPage() {
  const faqs = serviceFAQs[serviceId] || [];

  return (
    <main>
      <ServiceJsonLd
        name={serviceName}
        description={serviceDescription}
        serviceType="Professional Training"
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
      <section className="py-20 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600">
        <div className="container-wide">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-pink-100 text-sm mb-8">
              <Link href="/services" className="hover:text-white">Services</Link>
              <span>/</span>
              <span className="text-white">Faculty & Staff Training</span>
            </nav>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Faculty & Staff Training
                </h1>
                <p className="text-xl text-pink-100 mb-6">
                  AI tools are only as effective as the people using them. Our training programs
                  help educators confidently leverage AI to improve teaching and learning.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact?inquiry=training"
                    className="px-6 py-3 bg-white text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition"
                  >
                    Request Training
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

      {/* Programs */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Training Programs
            </h2>
            <p className="text-xl text-slate-600">
              Research-based programs designed by educators, for educators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div key={program.title} className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                <div className="p-6">
                  <program.icon className="w-10 h-10 text-pink-500 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{program.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{program.description}</p>

                  <div className="flex gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {program.duration}
                    </span>
                    <span>{program.format}</span>
                  </div>

                  <div className="space-y-2">
                    {program.topics.map((topic) => (
                      <div key={topic} className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full flex-shrink-0" />
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Who We Train
            </h2>
            <p className="text-xl text-slate-600">
              Tailored content for every role in your institution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {audiences.map((audience) => (
              <div key={audience.role} className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{audience.role}</h3>
                <p className="text-sm text-slate-500 mb-3">{audience.needs}</p>
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-xs font-medium text-pink-600 uppercase tracking-wider">Outcomes</span>
                  <p className="text-sm text-slate-600 mt-1">{audience.outcomes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Flexible Delivery
            </h2>
            <p className="text-xl text-slate-300">
              Training that fits your schedule and preferences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">On-Site</h3>
              <p className="text-slate-300 text-sm">
                Our trainers come to your campus for immersive, hands-on workshops.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Virtual Live</h3>
              <p className="text-slate-300 text-sm">
                Interactive online sessions with real-time practice and Q&A.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Self-Paced</h3>
              <p className="text-slate-300 text-sm">
                On-demand courses with optional coaching for flexible learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">Common questions about Faculty & Staff Training</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-pink-500 to-rose-600">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Empower Your Educators
            </h2>
            <p className="text-xl text-pink-100 mb-8">
              The best AI investment is in the people who will use it.
            </p>
            <Link
              href="/contact?inquiry=training"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition"
            >
              Request Training Proposal
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
