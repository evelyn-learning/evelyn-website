import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI for Higher Education',
  description: 'AI-powered solutions for universities and colleges. Course assistants, research support, assessment automation, and student success tools.',
};

const solutions = [
  {
    title: 'Course Assistant AI',
    description: 'AI teaching assistant that answers student questions 24/7, based on your course materials and syllabus.',
    benefits: ['Trained on your content', 'Reduces repetitive questions', 'Scales office hours'],
    icon: '🎓',
  },
  {
    title: 'Assessment Automation',
    description: 'Automated grading for essays, short answers, and coding assignments with detailed feedback.',
    benefits: ['Consistent rubric application', 'Instant student feedback', 'Frees TA time'],
    icon: '📝',
  },
  {
    title: 'Research Support Tools',
    description: 'AI-powered literature review, citation assistance, and research writing support.',
    benefits: ['Literature synthesis', 'Citation formatting', 'Writing improvement'],
    icon: '🔬',
  },
  {
    title: 'Student Success Platform',
    description: 'Early warning system that identifies at-risk students and recommends interventions.',
    benefits: ['Predictive analytics', 'Intervention recommendations', 'Outcome tracking'],
    icon: '📊',
  },
  {
    title: 'Adaptive Learning Paths',
    description: 'Personalized learning experiences that adapt to individual student performance.',
    benefits: ['Mastery-based progression', 'Remediation support', 'Self-paced learning'],
    icon: '🧠',
  },
  {
    title: 'Accessibility Solutions',
    description: 'AI tools that make course content accessible to all learners.',
    benefits: ['Auto-captioning', 'Content adaptation', 'Multi-format delivery'],
    icon: '♿',
  },
];

const useCases = [
  {
    department: 'Large Lecture Courses',
    challenge: '500+ students, 2 TAs, overwhelmed by questions and grading',
    solution: 'Course Assistant AI handles 80% of student questions. Assessment automation grades short-answer quizzes.',
    outcome: 'TAs focus on meaningful interaction instead of logistics',
  },
  {
    department: 'Writing Programs',
    challenge: 'Faculty can\'t provide enough draft feedback',
    solution: 'AI Essay Scoring gives instant feedback on drafts. Faculty review final submissions.',
    outcome: 'Students iterate more, final quality improves',
  },
  {
    department: 'Online Programs',
    challenge: 'Students feel disconnected, support is limited to email',
    solution: '24/7 AI tutoring and course assistance keeps students engaged',
    outcome: 'Reduced drop rates, improved satisfaction',
  },
];

export default function HigherEdIndustryPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600">
        <div className="container-wide">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-amber-100 text-sm mb-6">
              <Link href="/industries" className="hover:text-white">Industries</Link>
              <span>/</span>
              <span className="text-white">Higher Education</span>
            </nav>
            <div className="flex items-start gap-6">
              <span className="text-6xl">🎓</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  AI for Higher Education
                </h1>
                <p className="text-xl text-amber-100 mb-6">
                  From course assistants to research tools, help faculty scale their impact
                  and students get the support they need. AI that enhances the university
                  experience without replacing human connection.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact?industry=higher-ed"
                    className="px-6 py-3 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition"
                  >
                    Schedule a Demo
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
              AI Solutions for Universities
            </h2>
            <p className="text-xl text-slate-600">
              Tools designed for the unique needs of higher education.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {solutions.map((solution) => (
              <div key={solution.title} className="bg-slate-50 rounded-2xl p-6 hover:bg-amber-50 transition-colors">
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
              How Universities Use Our AI
            </h2>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {useCases.map((useCase) => (
              <div key={useCase.department} className="bg-white rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">{useCase.department}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Challenge</p>
                    <p className="text-slate-700 text-sm">{useCase.challenge}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Solution</p>
                    <p className="text-slate-700 text-sm">{useCase.solution}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Outcome</p>
                    <p className="text-emerald-600 text-sm font-medium">{useCase.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Built for Academic Settings
              </h2>
              <p className="text-slate-600 mb-6">
                We understand the unique requirements of higher education—from data privacy
                and academic integrity to faculty governance and IT integration.
              </p>
              <ul className="space-y-3">
                {[
                  'FERPA compliant data handling',
                  'LMS integration (Canvas, Blackboard, etc.)',
                  'Single sign-on with campus identity systems',
                  'Academic integrity safeguards',
                  'Faculty training and support',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8">
              <h3 className="font-bold text-slate-900 mb-4">Pilot Program Available</h3>
              <p className="text-slate-600 mb-6">
                Start with a single department or course. See results before scaling campus-wide.
                No long-term commitment required for pilots.
              </p>
              <Link
                href="/contact?industry=higher-ed&inquiry=pilot"
                className="inline-flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-800"
              >
                Learn about pilots <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Explore AI for Your Institution?
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              Let&apos;s discuss how AI can support your faculty and students.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact?industry=higher-ed"
                className="px-8 py-4 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition"
              >
                Schedule a Conversation
              </Link>
              <Link
                href="/services/custom-ai"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              >
                Custom Development
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
