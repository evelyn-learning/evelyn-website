import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Products for Education | Adaptive Learning & Intelligent Tutoring',
  description: 'Explore 23 AI-powered learning products: adaptive learning platforms, intelligent tutoring systems, automated grading, learning analytics, and personalized learning solutions for K-12, higher education, and corporate training.',
  keywords: [
    'AI-Powered Learning',
    'Adaptive Learning Platform',
    'Intelligent Tutoring Systems',
    'Personalized Learning',
    'Automated Grading',
    'Learning Analytics',
    'EdTech Products',
    'AI Education Tools',
    'Student Success Platform',
  ],
};

// Demo status types
type DemoStatus = 'live' | 'interactive' | 'request';

// Product categories with all 23 products
const productCategories = [
  {
    name: 'Assessment AI',
    description: 'Evaluate student work with accuracy and consistency',
    products: [
      {
        id: 'essay-ai',
        title: 'AI Essay Scoring & Feedback',
        tagline: 'Professional essay feedback in 10 seconds',
        icon: '📝',
        gradient: 'from-purple-500 to-primary-600',
        demoStatus: 'live' as DemoStatus
      },
      {
        id: 'test-generator',
        title: 'AI Practice Test Generator',
        tagline: 'Unlimited unique practice tests, every time',
        icon: '📊',
        gradient: 'from-emerald-500 to-teal-600',
        demoStatus: 'interactive' as DemoStatus
      },
      {
        id: 'plagiarism-detection',
        title: 'Plagiarism & AI Detection',
        tagline: 'Multi-source originality and AI content analysis',
        icon: '🔍',
        gradient: 'from-orange-500 to-red-600',
        demoStatus: 'interactive' as DemoStatus
      },
      {
        id: 'proctoring-suite',
        title: 'AI Proctoring Suite',
        tagline: 'Real-time exam monitoring with AI face detection',
        icon: '🎥',
        gradient: 'from-rose-500 to-red-600',
        demoStatus: 'live' as DemoStatus
      }
    ]
  },
  {
    name: 'Tutoring AI',
    description: 'Scale personalized learning support',
    products: [
      {
        id: 'homework-bot',
        title: '24/7 AI Homework Helper',
        tagline: 'Instant help, any hour—without adding staff',
        icon: '🤖',
        gradient: 'from-purple-500 to-pink-600',
        demoStatus: 'live' as DemoStatus
      },
      {
        id: 'tutor-copilot',
        title: 'AI Tutoring Co-Pilot',
        tagline: 'Make every tutor your best tutor',
        icon: '👨‍🏫',
        gradient: 'from-orange-500 to-red-600',
        demoStatus: 'interactive' as DemoStatus
      },
      {
        id: 'math-solver',
        title: 'AI Math Solver',
        tagline: 'Step-by-step solutions for any math problem',
        icon: '🔢',
        gradient: 'from-blue-500 to-cyan-600',
        demoStatus: 'interactive' as DemoStatus
      },
      {
        id: 'language-learning',
        title: 'Language Learning AI',
        tagline: 'Conversational practice in real-world scenarios',
        icon: '🌍',
        gradient: 'from-indigo-500 to-purple-600',
        demoStatus: 'interactive' as DemoStatus
      }
    ]
  },
  {
    name: 'Content AI',
    description: 'Create and enhance educational content at scale',
    products: [
      {
        id: 'content-authoring',
        title: 'Content Authoring AI',
        tagline: 'Transform any text into interactive learning',
        icon: '✍️',
        gradient: 'from-emerald-500 to-teal-600',
        demoStatus: 'interactive' as DemoStatus
      },
      {
        id: 'reading-comprehension',
        title: 'Reading Comprehension AI',
        tagline: 'Deep passage analysis with auto-generated questions',
        icon: '📖',
        gradient: 'from-purple-500 to-pink-600',
        demoStatus: 'interactive' as DemoStatus
      },
      {
        id: 'curriculum-designer',
        title: 'AI Curriculum Designer',
        tagline: 'Standards-aligned curriculum maps in minutes',
        icon: '📋',
        gradient: 'from-violet-500 to-purple-600',
        demoStatus: 'interactive' as DemoStatus
      },
      {
        id: 'accessibility-ai',
        title: 'Content Accessibility AI',
        tagline: 'WCAG 2.1 AA compliance scanning and fixes',
        icon: '♿',
        gradient: 'from-green-500 to-teal-600',
        demoStatus: 'request' as DemoStatus
      },
      {
        id: 'course-creator-studio',
        title: 'AI Course Creator Studio',
        tagline: 'Transform any content into structured courses',
        icon: '🎓',
        gradient: 'from-cyan-500 to-blue-600',
        demoStatus: 'interactive' as DemoStatus
      },
      {
        id: 'textbook-digitizer',
        title: 'Textbook Digitizer',
        tagline: 'Convert print to interactive digital textbooks',
        icon: '📚',
        gradient: 'from-amber-500 to-orange-600',
        demoStatus: 'live' as DemoStatus
      }
    ]
  },
  {
    name: 'Analytics & Adaptive',
    description: 'Data-driven insights for personalized learning',
    products: [
      {
        id: 'adaptive-learning',
        title: 'Adaptive Learning Engine',
        tagline: 'AI-powered personalized learning paths',
        icon: '🎯',
        gradient: 'from-cyan-500 to-blue-600',
        demoStatus: 'interactive' as DemoStatus
      },
      {
        id: 'analytics-dashboard',
        title: 'Student Analytics Dashboard',
        tagline: 'Real-time insights into student progress',
        icon: '📈',
        gradient: 'from-slate-700 to-blue-800',
        demoStatus: 'interactive' as DemoStatus
      },
      {
        id: 'student-success-predictor',
        title: 'Student Success Predictor',
        tagline: 'AI early warning system for at-risk students',
        icon: '🔮',
        gradient: 'from-amber-500 to-orange-600',
        demoStatus: 'interactive' as DemoStatus
      },
      {
        id: 'career-pathways',
        title: 'Career Pathways AI',
        tagline: 'Skill gap analysis and career recommendations',
        icon: '🛤️',
        gradient: 'from-violet-500 to-purple-600',
        demoStatus: 'live' as DemoStatus
      }
    ]
  },
  {
    name: 'Institutional AI',
    description: 'Administrative automation for schools and universities',
    products: [
      {
        id: 'admissions-assistant',
        title: 'AI Admissions Assistant',
        tagline: '24/7 student support and application review',
        icon: '🎓',
        gradient: 'from-blue-500 to-indigo-600',
        demoStatus: 'live' as DemoStatus
      },
      {
        id: 'parent-engagement',
        title: 'Parent Engagement Portal',
        tagline: 'Multilingual progress reports and communications',
        icon: '👨‍👩‍👧',
        gradient: 'from-teal-500 to-cyan-600',
        demoStatus: 'live' as DemoStatus
      }
    ]
  },
  {
    name: 'Enterprise L&D',
    description: 'Corporate training and professional development',
    products: [
      {
        id: 'corporate-training',
        title: 'Corporate Training AI',
        tagline: 'Microlearning, compliance, and skill gap analysis',
        icon: '🏢',
        gradient: 'from-indigo-500 to-purple-600',
        demoStatus: 'live' as DemoStatus
      }
    ]
  },
  {
    name: 'Research & Higher Ed',
    description: 'Tools for academic research and scholarship',
    products: [
      {
        id: 'research-assistant',
        title: 'Research Assistant AI',
        tagline: 'Literature search, citations, and methodology help',
        icon: '🔬',
        gradient: 'from-emerald-500 to-teal-600',
        demoStatus: 'interactive' as DemoStatus
      }
    ]
  },
  {
    name: 'Simulations',
    description: 'Interactive hands-on learning experiences',
    products: [
      {
        id: 'virtual-labs',
        title: 'Virtual Lab Simulations',
        tagline: 'Interactive science experiments—safe and scalable',
        icon: '🧪',
        gradient: 'from-teal-500 to-green-600',
        demoStatus: 'request' as DemoStatus
      }
    ]
  }
];

// Hero Section
function HeroSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
      <div className="container-wide">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-300 text-sm font-medium">23 AI products with live demos</span>
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            AI-Powered Learning Products
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Explore our complete suite of adaptive learning platforms, intelligent tutoring systems, and personalized learning solutions.
            White-label ready, enterprise-grade, designed by educators for data-driven learning outcomes.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact?demo=true"
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all"
            >
              Book a Demo
            </Link>
            <a
              href="#products"
              className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              Explore Products
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Quick Navigation
function QuickNav() {
  return (
    <section className="py-6 bg-white border-b border-slate-100 sticky top-16 z-40">
      <div className="container-wide">
        <div className="flex flex-wrap justify-center gap-4">
          {productCategories.map((category) => (
            <a
              key={category.name}
              href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Demo badge component
function DemoBadge({ status }: { status: DemoStatus }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        Live Demo
      </span>
    );
  }
  if (status === 'interactive') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
        Interactive Preview
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
      Request Demo
    </span>
  );
}

// Product Card Component
function ProductCard({ product }: { product: typeof productCategories[0]['products'][0] }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-all hover:shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${product.gradient} p-6 text-white`}>
        <span className="text-4xl mb-3 block">{product.icon}</span>
        <h3 className="text-xl font-bold mb-1 group-hover:underline">{product.title}</h3>
        <p className="text-white/80 text-sm">{product.tagline}</p>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between">
        <DemoBadge status={product.demoStatus} />
        <span className="text-sm text-slate-500 group-hover:text-primary-600 flex items-center gap-1">
          Learn more
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}

// Category Section Component
function CategorySection({ category }: { category: typeof productCategories[0] }) {
  return (
    <div id={category.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-32">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{category.name}</h2>
        <p className="text-slate-600">{category.description}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Products Grid Section
function ProductsSection() {
  return (
    <section id="products" className="py-16 bg-slate-50">
      <div className="container-wide">
        {/* Demo Status Legend */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-6 p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-sm text-slate-600 font-medium">Demo availability:</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Demo
            </span>
            <span className="text-xs text-slate-500">Try it now</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Interactive Preview
            </span>
            <span className="text-xs text-slate-500">Sample experience</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Request Demo
            </span>
            <span className="text-xs text-slate-500">Personalized walkthrough</span>
          </div>
        </div>

        <div className="space-y-16">
          {productCategories.map((category) => (
            <CategorySection key={category.name} category={category} />
          ))}
        </div>

        {/* Custom Solutions CTA */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Need Something Custom?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              These are our pre-built solutions, but we specialize in custom AI development for education.
              From adaptive learning engines to automated content pipelines—let&apos;s build exactly what you need.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Discuss Custom Solutions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { value: '23', label: 'AI Products' },
    { value: '100%', label: 'White-label ready' },
    { value: '<1 week', label: 'To deployment' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Integration Section
function IntegrationSection() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Deploy Your Way
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Every product works with your existing tech stack
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔌',
                title: 'API Access',
                description: 'RESTful APIs for full integration with your existing platform'
              },
              {
                icon: '🏷️',
                title: 'White Label',
                description: 'Fully branded with your logo and colors—students never see us'
              },
              {
                icon: '🖥️',
                title: 'Standalone',
                description: 'Use our hosted interface directly—no development needed'
              }
            ].map((option, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <span className="text-4xl mb-4 block">{option.icon}</span>
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-slate-300">{option.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/integrations"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              View all integration options
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            See Our AI in Action
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Schedule a personalized demo. Whether you need one product or the entire suite,
            we&apos;ll show you exactly how our AI can transform your education business.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?demo=true"
              className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-slate-100 transition-all"
            >
              Book a Demo
            </Link>
            <Link
              href="/security"
              className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              Security & Compliance
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Page
export default function ProductsPage() {
  return (
    <main>
      <HeroSection />
      <QuickNav />
      <ProductsSection />
      <StatsSection />
      <IntegrationSection />
      <CTASection />
    </main>
  );
}
