import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Case Studies | Evelyn Learning',
  description: 'See how education companies achieve measurable results with Evelyn Learning AI. Real stories, real metrics, real impact.',
};

const caseStudies = [
  {
    id: 'national-test-prep',
    title: 'National Test Prep Company Scales Feedback 10x',
    client: 'Fortune 500 Test Prep Provider',
    clientType: 'Test Prep',
    logo: '📊',
    challenge: 'Couldn\'t provide personalized essay feedback at scale—tutors were overwhelmed with 50,000+ monthly submissions.',
    solution: 'Deployed AI Essay Scoring with custom rubrics for SAT, ACT, and AP exams. Integrated with existing LMS via API.',
    results: [
      { metric: '10x', label: 'More essays scored monthly' },
      { metric: '< 30 sec', label: 'Average feedback time' },
      { metric: '94%', label: 'Student satisfaction' },
      { metric: '$2.1M', label: 'Annual cost savings' },
    ],
    quote: 'Evelyn\'s AI doesn\'t just grade—it teaches. Our students get feedback that rivals our best tutors, instantly.',
    quoteAuthor: 'VP of Product',
    products: ['AI Essay Scoring', 'Practice Test Generator'],
    color: 'purple',
  },
  {
    id: 'state-university-system',
    title: 'State University System Improves Retention by 23%',
    client: 'Large Public University System (12 campuses)',
    clientType: 'Higher Education',
    logo: '🎓',
    challenge: 'High dropout rates in first-year students. Advisors couldn\'t identify at-risk students early enough to intervene.',
    solution: 'Implemented Student Success Predictor integrated with SIS and LMS. Automated early alerts to advisors with recommended interventions.',
    results: [
      { metric: '23%', label: 'Improvement in retention' },
      { metric: '6 weeks', label: 'Earlier risk identification' },
      { metric: '15,000', label: 'Students flagged for support' },
      { metric: '$18M', label: 'Retained tuition revenue' },
    ],
    quote: 'We went from reactive to proactive. Now we reach students before they\'re in crisis, not after they\'ve already failed.',
    quoteAuthor: 'Dean of Student Success',
    products: ['Student Success Predictor', 'Analytics Dashboard'],
    color: 'blue',
  },
  {
    id: 'k12-district',
    title: 'Urban School District Closes Achievement Gaps',
    client: 'Large Urban K-12 District (85,000 students)',
    clientType: 'K-12',
    logo: '🏫',
    challenge: 'Wide achievement gaps between schools. Teachers lacked time for individualized instruction and parent communication.',
    solution: 'Rolled out Adaptive Learning Engine, 24/7 Homework Helper, and Parent Engagement Portal with multilingual support.',
    results: [
      { metric: '31%', label: 'Reduction in achievement gap' },
      { metric: '2.5x', label: 'Parent engagement increase' },
      { metric: '89%', label: 'Teacher satisfaction' },
      { metric: '40+', label: 'Languages supported' },
    ],
    quote: 'For the first time, every parent can understand their child\'s progress—in their own language. That changes everything.',
    quoteAuthor: 'Superintendent',
    products: ['Adaptive Learning', 'Homework Helper', 'Parent Engagement Portal'],
    color: 'teal',
  },
  {
    id: 'global-publisher',
    title: 'Global Publisher Digitizes 500+ Textbooks',
    client: 'Top 5 Educational Publisher',
    clientType: 'Publisher',
    logo: '📚',
    challenge: 'Massive print backlist losing market share to digital-first competitors. Manual digitization was too slow and expensive.',
    solution: 'Used Textbook Digitizer and Content Authoring AI to transform print content into interactive digital experiences with auto-generated assessments.',
    results: [
      { metric: '500+', label: 'Textbooks digitized' },
      { metric: '10x', label: 'Faster than manual process' },
      { metric: '85%', label: 'Cost reduction' },
      { metric: '3M+', label: 'Auto-generated questions' },
    ],
    quote: 'We turned a 10-year digitization roadmap into an 18-month project. Our backlist is now our competitive advantage.',
    quoteAuthor: 'Chief Digital Officer',
    products: ['Textbook Digitizer', 'Content Authoring AI', 'Accessibility AI'],
    color: 'orange',
  },
  {
    id: 'fortune-500-ld',
    title: 'Fortune 500 Transforms Compliance Training',
    client: 'Global Financial Services Company',
    clientType: 'Enterprise',
    logo: '🏢',
    challenge: 'Compliance training completion rates below 60%. Content was outdated, boring, and took too long to update.',
    solution: 'Deployed Corporate Training AI for microlearning generation, compliance tracking, and personalized learning paths.',
    results: [
      { metric: '94%', label: 'Completion rate (was 58%)' },
      { metric: '67%', label: 'Reduction in training time' },
      { metric: '4 hours', label: 'Content update time (was 2 weeks)' },
      { metric: '$4.2M', label: 'Productivity savings' },
    ],
    quote: 'Our employees actually engage with training now. And when regulations change, we update content in hours, not months.',
    quoteAuthor: 'Chief Learning Officer',
    products: ['Corporate Training AI', 'Analytics Dashboard'],
    color: 'indigo',
  },
  {
    id: 'online-tutoring-platform',
    title: 'Online Tutoring Platform Reduces Churn 40%',
    client: 'Fast-Growing EdTech Startup',
    clientType: 'EdTech',
    logo: '💻',
    challenge: 'High customer churn between tutoring sessions. Students disengaged when not actively with a tutor.',
    solution: 'Integrated 24/7 Homework Helper and AI Tutoring Co-Pilot to maintain engagement between sessions and enhance tutor effectiveness.',
    results: [
      { metric: '40%', label: 'Reduction in churn' },
      { metric: '3.2x', label: 'Sessions between live tutoring' },
      { metric: '28%', label: 'Increase in tutor efficiency' },
      { metric: 'NPS 72', label: 'Net Promoter Score (was 45)' },
    ],
    quote: 'The AI keeps students engaged between sessions. They come to live tutoring better prepared, and tutors can focus on higher-value work.',
    quoteAuthor: 'CEO',
    products: ['24/7 Homework Helper', 'Tutoring Co-Pilot'],
    color: 'pink',
  },
];

const colorClasses: Record<string, { gradient: string; light: string; text: string }> = {
  purple: { gradient: 'from-purple-500 to-primary-600', light: 'bg-purple-50', text: 'text-purple-600' },
  blue: { gradient: 'from-blue-500 to-indigo-600', light: 'bg-blue-50', text: 'text-blue-600' },
  teal: { gradient: 'from-teal-500 to-cyan-600', light: 'bg-teal-50', text: 'text-teal-600' },
  orange: { gradient: 'from-orange-500 to-amber-600', light: 'bg-orange-50', text: 'text-orange-600' },
  indigo: { gradient: 'from-indigo-500 to-purple-600', light: 'bg-indigo-50', text: 'text-indigo-600' },
  pink: { gradient: 'from-pink-500 to-rose-600', light: 'bg-pink-50', text: 'text-pink-600' },
};

export default function CaseStudiesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 text-sm font-medium">Real Results</span>
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Case Studies
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              See how education companies across sectors achieve measurable results with Evelyn Learning AI.
              Real stories, real metrics, real impact.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact?inquiry=case-study"
                className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all"
              >
                Become a Case Study
              </Link>
              <Link
                href="/products"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">500+</div>
              <div className="text-sm text-slate-500 mt-1">Clients worldwide</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">$50M+</div>
              <div className="text-sm text-slate-500 mt-1">Client savings documented</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">10M+</div>
              <div className="text-sm text-slate-500 mt-1">Learners impacted</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">92%</div>
              <div className="text-sm text-slate-500 mt-1">Client satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter by Industry */}
      <section className="py-8 bg-slate-50 border-b border-slate-100 sticky top-16 z-30">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-full">
              All Industries
            </span>
            {['Test Prep', 'Higher Education', 'K-12', 'Publisher', 'Enterprise', 'EdTech'].map((industry) => (
              <span
                key={industry}
                className="px-4 py-2 bg-white text-slate-600 text-sm font-medium rounded-full border border-slate-200 hover:border-slate-300 cursor-pointer transition"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 bg-slate-50">
        <div className="container-wide">
          <div className="space-y-12">
            {caseStudies.map((study, idx) => (
              <div
                key={study.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow"
              >
                <div className="grid lg:grid-cols-3">
                  {/* Left Column - Header */}
                  <div className={`bg-gradient-to-br ${colorClasses[study.color].gradient} p-8 text-white`}>
                    <span className="text-5xl mb-4 block">{study.logo}</span>
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                      {study.clientType}
                    </span>
                    <h2 className="text-2xl font-bold mb-3">{study.title}</h2>
                    <p className="text-white/80 text-sm">{study.client}</p>
                  </div>

                  {/* Right Column - Content */}
                  <div className="lg:col-span-2 p-8">
                    {/* Challenge & Solution */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Challenge</h3>
                        <p className="text-slate-600">{study.challenge}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Solution</h3>
                        <p className="text-slate-600">{study.solution}</p>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Results</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {study.results.map((result) => (
                          <div key={result.label} className={`${colorClasses[study.color].light} rounded-xl p-4 text-center`}>
                            <div className={`text-2xl font-bold ${colorClasses[study.color].text}`}>{result.metric}</div>
                            <div className="text-xs text-slate-600 mt-1">{result.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="bg-slate-50 rounded-xl p-6 mb-6">
                      <svg className="w-8 h-8 text-slate-300 mb-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-slate-700 italic mb-3">&ldquo;{study.quote}&rdquo;</p>
                      <p className="text-sm text-slate-500">— {study.quoteAuthor}, {study.client}</p>
                    </div>

                    {/* Products Used */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-slate-500">Products used:</span>
                      {study.products.map((product) => (
                        <span
                          key={product}
                          className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-700">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join 500+ education companies achieving measurable results with Evelyn Learning AI.
            </p>
            <Link
              href="/contact?demo=true"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Book a Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
