import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Download, FileText, BookOpen, BarChart3, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Research & White Papers | Evelyn Learning',
  description: 'Original research on AI in education, white papers, and industry reports. Evidence-based insights for education leaders.',
};

const featuredResearch = {
  title: 'The State of AI in Education 2024',
  description: 'Comprehensive analysis of AI adoption trends, effectiveness data, and future outlook across K-12, higher education, and corporate learning.',
  image: '📊',
  stats: [
    { label: 'Institutions surveyed', value: '2,500+' },
    { label: 'Countries represented', value: '45' },
    { label: 'Pages of analysis', value: '120' },
  ],
  topics: ['Adoption rates by sector', 'ROI benchmarks', 'Implementation challenges', 'Future trends'],
};

const whitepapers = [
  {
    id: 'ai-essay-scoring-accuracy',
    title: 'AI Essay Scoring: Accuracy, Bias, and Best Practices',
    description: 'A rigorous analysis of AI essay scoring systems comparing performance to human raters across different demographics and writing styles.',
    category: 'Assessment',
    icon: FileText,
    pages: 32,
    readTime: '15 min',
    date: 'January 2024',
    findings: [
      '94% agreement with expert human raters',
      'No significant demographic bias detected',
      'Best practices for rubric design',
    ],
  },
  {
    id: 'adaptive-learning-outcomes',
    title: 'Measuring Adaptive Learning Outcomes: A 3-Year Study',
    description: 'Longitudinal study tracking learning outcomes for 50,000+ students using adaptive learning systems versus traditional instruction.',
    category: 'Learning Science',
    icon: BarChart3,
    pages: 45,
    readTime: '20 min',
    date: 'November 2023',
    findings: [
      '23% improvement in learning outcomes',
      '31% reduction in time to mastery',
      'Strongest effects for struggling learners',
    ],
  },
  {
    id: 'ai-tutoring-effectiveness',
    title: 'AI Tutoring vs. Human Tutoring: A Comparative Analysis',
    description: 'Controlled study comparing learning gains from AI tutoring systems to one-on-one human tutoring across multiple subjects.',
    category: 'Tutoring',
    icon: Users,
    pages: 28,
    readTime: '12 min',
    date: 'September 2023',
    findings: [
      'AI achieves 85% effectiveness of human tutors',
      'Availability advantage: 24/7 vs. scheduled',
      'Best results with hybrid approach',
    ],
  },
  {
    id: 'student-success-prediction',
    title: 'Early Warning Systems: Predicting Student Success',
    description: 'Analysis of machine learning models for predicting at-risk students, including accuracy metrics and ethical considerations.',
    category: 'Analytics',
    icon: BarChart3,
    pages: 38,
    readTime: '18 min',
    date: 'August 2023',
    findings: [
      '87% accuracy in identifying at-risk students',
      '6 weeks earlier identification than traditional methods',
      'Ethical framework for responsible use',
    ],
  },
  {
    id: 'ai-content-generation',
    title: 'AI-Generated Educational Content: Quality Assessment',
    description: 'Evaluation of AI-generated learning content quality compared to traditionally authored materials across multiple dimensions.',
    category: 'Content',
    icon: BookOpen,
    pages: 25,
    readTime: '10 min',
    date: 'July 2023',
    findings: [
      'Expert-rated quality comparable to human authors',
      '10x faster content production',
      'Consistency advantages at scale',
    ],
  },
  {
    id: 'proctoring-integrity',
    title: 'AI Proctoring and Academic Integrity: What Works',
    description: 'Review of AI proctoring effectiveness, false positive rates, and student perceptions across 50+ institutions.',
    category: 'Assessment',
    icon: FileText,
    pages: 35,
    readTime: '15 min',
    date: 'June 2023',
    findings: [
      '78% reduction in academic integrity violations',
      '< 2% false positive rate',
      'Student anxiety mitigation strategies',
    ],
  },
];

const industryReports = [
  {
    title: 'K-12 AI Adoption Report 2024',
    description: 'Survey of 1,200 K-12 districts on AI tool adoption, spending, and outcomes.',
    category: 'K-12',
  },
  {
    title: 'Higher Ed AI Investment Trends',
    description: 'Analysis of AI spending priorities across 500 colleges and universities.',
    category: 'Higher Ed',
  },
  {
    title: 'Corporate Learning AI Benchmark',
    description: 'L&D leaders share AI ROI data and implementation lessons learned.',
    category: 'Enterprise',
  },
  {
    title: 'Publisher Digital Transformation Index',
    description: 'How publishers are leveraging AI to modernize content and operations.',
    category: 'Publishing',
  },
];

const categoryColors: Record<string, string> = {
  Assessment: 'bg-purple-100 text-purple-700',
  'Learning Science': 'bg-blue-100 text-blue-700',
  Tutoring: 'bg-emerald-100 text-emerald-700',
  Analytics: 'bg-orange-100 text-orange-700',
  Content: 'bg-pink-100 text-pink-700',
};

export default function ResearchPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <BookOpen className="w-4 h-4 text-blue-300" />
              <span className="text-blue-300 text-sm font-medium">Evidence-Based Insights</span>
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Research & White Papers
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Original research on AI in education. We don&apos;t just build AI—we study what works,
              share our findings, and contribute to the field.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#whitepapers"
                className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all"
              >
                Browse White Papers
              </Link>
              <Link
                href="/contact?inquiry=research"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Research Partnership
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Research */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="text-white">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                  Featured Report
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuredResearch.title}</h2>
                <p className="text-blue-100 mb-6">{featuredResearch.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {featuredResearch.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-blue-200 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact?inquiry=research-report"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
                >
                  <Download className="w-5 h-5" />
                  Download Full Report
                </Link>
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <span className="text-8xl block text-center mb-6">{featuredResearch.image}</span>
                  <h3 className="text-white font-semibold mb-4">Key Topics Covered:</h3>
                  <ul className="space-y-2">
                    {featuredResearch.topics.map((topic) => (
                      <li key={topic} className="flex items-center gap-2 text-blue-100">
                        <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* White Papers */}
      <section id="whitepapers" className="py-16 bg-slate-50 scroll-mt-20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">White Papers</h2>
            <p className="text-xl text-slate-600">
              Deep dives into specific topics with original data and actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whitepapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[paper.category]}`}>
                      {paper.category}
                    </span>
                    <span className="text-xs text-slate-400">{paper.date}</span>
                  </div>

                  <paper.icon className="w-10 h-10 text-slate-400 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {paper.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">{paper.description}</p>

                  <div className="space-y-2 mb-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Findings</h4>
                    {paper.findings.map((finding) => (
                      <div key={finding} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                        {finding}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-400">
                      {paper.pages} pages · {paper.readTime} read
                    </div>
                    <Link
                      href={`/contact?inquiry=whitepaper&paper=${paper.id}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      Download
                      <Download className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Reports */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Industry Reports</h2>
            <p className="text-xl text-slate-600">
              Market analysis and benchmarking data for education leaders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryReports.map((report) => (
              <div
                key={report.title}
                className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-colors group"
              >
                <span className="inline-block px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-medium mb-4">
                  {report.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {report.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4">{report.description}</p>
                <Link
                  href="/contact?inquiry=industry-report"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  Request Access
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Methodology */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Research Standards</h2>
              <p className="text-slate-300 mb-8">
                We hold ourselves to the highest standards of research integrity. Our methodology
                is designed to produce actionable insights you can trust.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: 'Rigorous Methodology',
                    description: 'Peer-reviewed research designs with appropriate sample sizes and controls.',
                  },
                  {
                    title: 'Transparent Data',
                    description: 'Clear documentation of data sources, limitations, and potential biases.',
                  },
                  {
                    title: 'Practical Focus',
                    description: 'Research questions driven by real challenges facing education practitioners.',
                  },
                  {
                    title: 'Open Collaboration',
                    description: 'Partnerships with universities, institutions, and industry researchers.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Research Partnership</h3>
              <p className="text-slate-300 mb-6">
                Interested in collaborating on research? We partner with universities and institutions
                on studies that advance the field of AI in education.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'Access to anonymized data sets',
                  'Co-authored publications',
                  'Joint conference presentations',
                  'Research funding opportunities',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-200">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact?inquiry=research-partnership"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition"
              >
                Propose a Study
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated on AI in Education Research</h2>
            <p className="text-blue-100 mb-8">
              Get notified when we publish new research, white papers, and industry analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-4 rounded-xl text-slate-900 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition">
                Subscribe
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
