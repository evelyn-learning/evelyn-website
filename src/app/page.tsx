import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models";
import { ArrowRight } from "lucide-react";

// Fetch latest posts for the blog section
async function getLatestPosts() {
  try {
    await connectDB();
    const posts = await BlogPost.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

// Client names - all companies we've worked with
const CLIENTS = [
  'Coursera',
  'McGraw Hill',
  'Barnes & Noble',
  'Chegg',
  'Course Hero',
  'Amazon',
  'Study.com',
  'GoGuardian',
  'Cuemath',
  'StuDocu',
  'Testbook',
  'HackerEarth',
  'Thinkster',
  'Brighterly',
  'Wisewire',
  'Bytelearn',
  'ExamFactor',
  'Flipclass',
  'Educomp',
  'Vikas Publishing',
  'Madhuban',
  'TETT',
  'Ezymathtutoring',
  'Excel Ed',
  'OneClass',
  'HomeShare',
  'InstaEDU',
];

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(122, 42, 142, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container-wide relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-300 text-sm font-medium">Powering 500+ education companies worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            AI-Powered Learning
            <span className="block bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              That Works
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
            Adaptive learning platforms, intelligent tutoring systems, and personalized learning solutions for test prep companies, tutoring businesses, publishers, and EdTech platforms.
            <span className="text-white font-medium"> Powered by 20+ years of teaching expertise.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all transform hover:scale-105 shadow-lg shadow-white/20"
            >
              Explore AI Products
            </Link>
            <Link
              href="/contact?demo=true"
              className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Client Logos Section - Professional wordmark display
function ClientLogosSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
      <div className="container-wide">
        <p className="text-slate-400 text-sm font-medium text-center mb-10 uppercase tracking-wider">
          Trusted by leading education companies
        </p>

        {/* Scrolling logo container */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex animate-scroll items-center">
            {/* First set of logos */}
            {CLIENTS.map((client, idx) => (
              <div
                key={`first-${idx}`}
                className="flex-shrink-0 mx-8 py-3 px-1"
              >
                <span
                  className="text-slate-400 hover:text-slate-600 font-bold text-xl tracking-tight whitespace-nowrap transition-colors cursor-default"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {client}
                </span>
              </div>
            ))}
            {/* Duplicate for seamless scroll */}
            {CLIENTS.map((client, idx) => (
              <div
                key={`second-${idx}`}
                className="flex-shrink-0 mx-8 py-3 px-1"
              >
                <span
                  className="text-slate-400 hover:text-slate-600 font-bold text-xl tracking-tight whitespace-nowrap transition-colors cursor-default"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {client}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Evelyn's AI essay scoring has transformed how we deliver feedback. Our students get instant, detailed critiques that used to take our tutors hours to produce.",
      author: "Sarah M.",
      role: "Director of Curriculum",
      company: "National Test Prep Company"
    },
    {
      quote: "The 24/7 homework bot keeps our students engaged between tutoring sessions. We've seen a 40% reduction in student churn since implementing it.",
      author: "James K.",
      role: "COO",
      company: "Online Tutoring Platform"
    },
    {
      quote: "What sets Evelyn apart is their understanding of pedagogy. Their AI doesn't just give answers—it teaches. That's exactly what we needed for our learners.",
      author: "Dr. Priya R.",
      role: "VP of Product",
      company: "EdTech Startup"
    },
    {
      quote: "We evaluated several AI vendors. Evelyn was the only one whose team actually understood our content and educational goals. The white-label solution works seamlessly.",
      author: "Michael T.",
      role: "CTO",
      company: "Educational Publisher"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
            What Our Partners Say
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100"
            >
              <svg className="w-10 h-10 text-primary-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-slate-700 text-lg leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-slate-900">{testimonial.author}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
                <p className="text-sm text-primary-500">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// AI Products Section - Expanded
function AIProductsSection() {
  const featuredProducts = [
    {
      id: 'essay-scorer',
      title: 'AI Essay Scoring',
      description: 'Instant, rubric-aligned feedback on student essays. SAT, ACT, AP, and college application scoring.',
      icon: '📝',
      color: 'from-purple-500 to-primary-600',
      stats: '80% grading time saved',
      href: '/products/essay-ai',
      market: 'K-12 & Higher Ed',
      demoType: 'live'
    },
    {
      id: 'proctoring',
      title: 'AI Proctoring Suite',
      description: 'Real-time exam monitoring with AI face detection, browser lockdown, and anomaly detection.',
      icon: '🎥',
      color: 'from-rose-500 to-red-600',
      stats: 'Real AI face detection',
      href: '/products/proctoring-suite',
      market: 'Higher Ed & Certification',
      demoType: 'live'
    },
    {
      id: 'corporate-training',
      title: 'Corporate Training AI',
      description: 'Microlearning generator, compliance tracking, and skill gap analysis for enterprise L&D.',
      icon: '🏢',
      color: 'from-indigo-500 to-purple-600',
      stats: 'SCORM/xAPI ready',
      href: '/products/corporate-training',
      market: 'Enterprise',
      demoType: 'live'
    },
    {
      id: 'admissions',
      title: 'AI Admissions Assistant',
      description: '24/7 prospective student chatbot, application review, and enrollment prediction.',
      icon: '🎓',
      color: 'from-blue-500 to-indigo-600',
      stats: '80% inquiry automation',
      href: '/products/admissions-assistant',
      market: 'Higher Ed',
      demoType: 'live'
    },
    {
      id: 'textbook-digitizer',
      title: 'Textbook Digitizer',
      description: 'Convert print textbooks to interactive digital formats with auto-generated quizzes and study tools.',
      icon: '📚',
      color: 'from-amber-500 to-orange-600',
      stats: '10x faster digitization',
      href: '/products/textbook-digitizer',
      market: 'Publishers',
      demoType: 'live'
    },
    {
      id: 'career-pathways',
      title: 'Career Pathways AI',
      description: 'Skill gap analysis, career matching, and personalized learning recommendations.',
      icon: '🛤️',
      color: 'from-violet-500 to-purple-600',
      stats: 'Real job market data',
      href: '/products/career-pathways',
      market: 'Workforce Dev',
      demoType: 'live'
    }
  ];

  const additionalProducts = [
    { title: '24/7 Homework Helper', description: 'AI tutoring available around the clock', icon: '🤖', market: 'K-12' },
    { title: 'Practice Test Generator', description: 'Unlimited unique practice questions', icon: '📊', market: 'Test Prep' },
    { title: 'Student Success Predictor', description: 'Early warning system for at-risk students', icon: '🔮', market: 'K-12 & Higher Ed' },
    { title: 'Parent Engagement Portal', description: 'Multilingual progress reports for families', icon: '👨‍👩‍👧', market: 'K-12' },
    { title: 'Research Assistant AI', description: 'Literature search and citation management', icon: '🔬', market: 'Higher Ed' },
    { title: 'Content Authoring AI', description: 'Transform text into interactive learning', icon: '✍️', market: 'Publishers' },
    { title: 'Adaptive Learning Engine', description: 'Personalized learning paths', icon: '🎯', market: 'All Markets' },
    { title: 'AI Curriculum Designer', description: 'Standards-aligned curriculum in minutes', icon: '📋', market: 'K-12' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">AI Products</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
            Adaptive Learning & Intelligent Tutoring Systems
          </h2>
          <p className="text-xl text-slate-600">
            Production-ready AI-powered learning solutions you can deploy today. Personalized learning, automated grading, and learning analytics—white-label ready and enterprise-grade.
            <span className="font-medium text-slate-800"> Complete technology transfer available.</span>
          </p>
        </div>

        {/* Featured Products Grid - With Live Demos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group relative bg-slate-50 rounded-2xl p-6 hover:bg-white hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-primary-100"
            >
              {/* Badges Row */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {product.market}
                </span>
                {product.demoType === 'live' && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live Demo
                  </span>
                )}
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {product.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-500 transition-colors">
                {product.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                {product.description}
              </p>

              {/* Stats Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-100 group-hover:bg-primary-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm font-medium text-slate-700">{product.stats}</span>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center transition-all group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Products */}
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Complete AI Product Suite</h3>
            <p className="text-slate-600">23 products across all education market segments</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalProducts.map((product, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow"
              >
                <span className="text-2xl mb-2 block">{product.icon}</span>
                <h4 className="font-semibold text-slate-800 text-sm mb-1">{product.title}</h4>
                <p className="text-xs text-slate-500 mb-2">{product.description}</p>
                <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {product.market}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            All products available as white-label solutions with API access
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600"
          >
            View all products and try live demos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Custom Development Section
function CustomDevelopmentSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div>
            <span className="text-primary-300 font-semibold text-sm uppercase tracking-wider">Custom AI Development</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              We Build AI Products
              <span className="block text-primary-400">Tailored to Your Business</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Beyond our ready-made products, we develop customized AI solutions that fit your exact requirements,
              tech stack, and business processes.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">We Understand Your Needs</h3>
                  <p className="text-slate-400">Deep discovery of your business processes, user workflows, and educational goals.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🖥️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Flexible Hosting & Integration</h3>
                  <p className="text-slate-400">Your servers or ours. Existing IT team or none. We adapt to your infrastructure.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Full-Service Delivery</h3>
                  <p className="text-slate-400">We develop, host, and manage AI products—or transfer the technology completely to you.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - What We Offer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6">Our Custom Development Services</h3>

            <div className="space-y-4">
              {[
                { title: 'AI Product Development', desc: 'End-to-end development of education AI tools' },
                { title: 'Technology Transfer', desc: 'Complete handoff with your branding' },
                { title: 'API & Integration', desc: 'Connect AI to your existing platform' },
                { title: 'Hosting & Management', desc: 'We handle infrastructure so you don\'t have to' },
                { title: 'Training & Support', desc: 'Dedicated team to ensure success' },
                { title: 'Content Enhancement', desc: 'Transform existing content with AI' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-medium text-white">{item.title}</span>
                    <span className="text-slate-400"> — {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href="/contact?inquiry=custom"
                className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Discuss Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Solutions Section
function SolutionsSection() {
  const solutions = [
    {
      title: 'Test Prep Companies',
      description: 'Scale your test prep business with AI-generated practice tests, automated scoring, and 24/7 student support.',
      icon: '📚',
      href: '/solutions/test-prep',
      features: ['Unlimited practice tests', 'Essay scoring', 'Score prediction']
    },
    {
      title: 'Tutoring Businesses',
      description: "Extend your tutors' capacity with AI co-pilots and keep students engaged between sessions.",
      icon: '👩‍🏫',
      href: '/solutions/tutoring',
      features: ['Tutor co-pilot', 'Homework bot', 'Session summaries']
    },
    {
      title: 'Publishers',
      description: 'Transform static content into interactive AI-powered learning experiences at scale.',
      icon: '📖',
      href: '/solutions/publishers',
      features: ['Content AI', 'Assessment generation', 'Adaptive learning']
    },
    {
      title: 'EdTech Platforms',
      description: 'Add AI capabilities to your platform with our white-label products and APIs.',
      icon: '💻',
      href: '/solutions/edtech',
      features: ['API access', 'White-label', 'Custom integration']
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Solutions</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
            Built for Your Business
          </h2>
          <p className="text-xl text-slate-600">
            Whether you&apos;re a test prep company, tutoring business, publisher, or EdTech platform—we have solutions designed for you.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, idx) => (
            <Link
              key={idx}
              href={solution.href}
              className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary-100"
            >
              <span className="text-4xl mb-4 block">{solution.icon}</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-500 transition-colors">
                {solution.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                {solution.description}
              </p>
              <ul className="space-y-2">
                {solution.features.map((feature, i) => (
                  <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Evelyn Section - Updated
function WhyEvelynSection() {
  const advantages = [
    {
      stat: '300+',
      label: 'Educator Experts',
      description: 'Teachers training our AI'
    },
    {
      stat: '1M+',
      label: 'Content Items',
      description: 'Powering our knowledge base'
    },
    {
      stat: '20+',
      label: 'Years Experience',
      description: 'Deep education expertise'
    },
    {
      stat: '50+',
      label: 'Countries Served',
      description: 'Global reach & understanding'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div>
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">The Evelyn Difference</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
              True Ed-Tech Expertise
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Most AI companies don&apos;t understand education. Most education companies don&apos;t understand AI.
              <span className="text-slate-900 font-semibold"> We do both.</span>
            </p>

            <div className="space-y-4 mb-8">
              {[
                { title: 'Teacher DNA', desc: 'Every employee has taught before—it\'s a hiring requirement' },
                { title: 'Content Capabilities', desc: 'We also provide content development services, so we understand the full picture' },
                { title: 'Top-Tier Engineers', desc: 'Our team includes the best AI engineers trained on cutting-edge technology' },
                { title: 'Process Excellence', desc: 'Our strengths lie in processes, operations, and methodology' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{item.title}:</span>
                    <span className="text-slate-600"> {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
              <p className="text-slate-700 leading-relaxed">
                <span className="font-semibold">We&apos;re a true Tech-in-Ed company</span> — combining deep pedagogical expertise
                with cutting-edge AI technology. Our AI is trained by teachers, designed for educators, and built to
                produce real learning outcomes.
              </p>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {advantages.map((adv, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-500 mb-2">{adv.stat}</div>
                <div className="text-lg font-semibold text-slate-900 mb-1">{adv.label}</div>
                <div className="text-sm text-slate-500">{adv.description}</div>
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
    <section className="py-24 bg-gradient-to-br from-primary-600 via-purple-600 to-primary-700">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Add AI to Your Education Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Schedule a demo and see our AI products working with your content.
            No commitment, just possibilities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?demo=true"
              className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-slate-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Book a Demo
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              Try Live Demos
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-100">
            <a href="mailto:contact@evelynlearning.com" className="flex items-center gap-2 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contact@evelynlearning.com
            </a>
            <a href="tel:+13022120975" className="flex items-center gap-2 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +1 (302) 212-0975
            </a>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              San Francisco, CA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Blog Preview Section
async function BlogPreviewSection() {
  const latestPosts = await getLatestPosts();

  if (latestPosts.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Resources</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Latest Insights</h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600"
          >
            View all posts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {latestPosts.map((post: { _id: string; slug: string; featuredImage?: string; title: string; category: string; excerpt: string; readingTime: number; publishedAt: string }) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="aspect-video relative bg-gradient-to-br from-primary-50 to-purple-50">
                {post.featuredImage && (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <span className="text-xs font-medium uppercase tracking-wider text-primary-500">
                  {post.category}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary-500 line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{post.readingTime} min read</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-500 font-semibold"
          >
            View all posts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default async function HomePage() {
  return (
    <main>
      <HeroSection />
      <ClientLogosSection />
      <AIProductsSection />
      <TestimonialsSection />
      <CustomDevelopmentSection />
      <SolutionsSection />
      <WhyEvelynSection />
      <BlogPreviewSection />
      <CTASection />
    </main>
  );
}
