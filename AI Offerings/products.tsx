// =============================================================================
// AI PRODUCTS PAGE
// =============================================================================
// File: app/products/page.tsx (or pages/products/index.tsx)
// 
// Overview page for all AI products with links to demos
// =============================================================================

import Link from 'next/link';

// Product data
const products = [
  {
    id: 'essay-ai',
    title: 'AI Essay Scoring & Feedback',
    tagline: 'Professional essay feedback in 10 seconds',
    description: 'Our Essay Scoring system delivers instant, rubric-aligned feedback on student writing. Calibrated to SAT, ACT, AP, and college application standards, it provides the detailed critique students need to improve—immediately.',
    icon: '📝',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    features: [
      'Multiple rubric support (SAT, ACT, AP, College App, Custom)',
      'Detailed scoring across all categories',
      'Specific, actionable improvement suggestions',
      'Sentence-level rewrite examples',
      'Plagiarism detection integration available'
    ],
    benefits: [
      { metric: '80%', label: 'Grading time saved' },
      { metric: '10 sec', label: 'Average feedback time' },
      { metric: '95%', label: 'Correlation with human graders' }
    ],
    useCases: ['Test prep companies', 'Writing tutors', 'Schools', 'College counselors'],
    demoAvailable: true
  },
  {
    id: 'homework-bot',
    title: '24/7 AI Homework Helper',
    tagline: 'Instant help, any hour—without adding staff',
    description: 'The Homework Help Bot provides students with on-demand tutoring support between sessions. Unlike generic AI chatbots, our solution is trained on pedagogical best practices—guiding students to discover answers rather than simply providing them.',
    icon: '🤖',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    features: [
      'Step-by-step problem breakdown',
      'Socratic questioning approach',
      'Multi-subject coverage (Math, Science, English, History)',
      'Conversation history for tutor review',
      'White-label branding with your logo'
    ],
    benefits: [
      { metric: '24/7', label: 'Availability' },
      { metric: '40%', label: 'Reduction in churn' },
      { metric: '< 3 sec', label: 'Response time' }
    ],
    useCases: ['Tutoring companies', 'Test prep centers', 'Online learning platforms', 'Schools'],
    demoAvailable: true
  },
  {
    id: 'test-generator',
    title: 'AI Practice Test Generator',
    tagline: 'Unlimited unique practice tests, every time',
    description: 'Generate original, test-aligned practice questions on demand. Our AI creates novel problems that match the style, difficulty, and format of real standardized tests—eliminating answer memorization and ensuring genuine skill assessment.',
    icon: '📊',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    features: [
      'SAT, ACT, PSAT, AP exam alignment',
      'Difficulty calibration (Easy/Medium/Hard)',
      'Topic-specific targeting',
      'Detailed explanations for every answer',
      'Export to PDF, integrate with your LMS'
    ],
    benefits: [
      { metric: '∞', label: 'Unique questions' },
      { metric: '$50K+', label: 'Test bank savings' },
      { metric: '100%', label: 'Fresh every time' }
    ],
    useCases: ['Test prep companies', 'Schools', 'Publishers', 'Online tutoring platforms'],
    demoAvailable: true
  },
  {
    id: 'tutor-copilot',
    title: 'AI Tutoring Co-Pilot',
    tagline: 'Make every tutor your best tutor',
    description: 'The Tutoring Co-Pilot works alongside your instructors, providing real-time suggestions, student insights, and teaching strategies during live sessions. It\'s like giving every tutor a master educator whispering in their ear.',
    icon: '👨‍🏫',
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    features: [
      'Real-time teaching suggestions',
      'Student learning profile integration',
      'Misconception detection alerts',
      'Personalized explanation strategies',
      'Session summary auto-generation'
    ],
    benefits: [
      { metric: '2-3x', label: 'Tutor capacity' },
      { metric: '50%', label: 'Faster onboarding' },
      { metric: '100%', label: 'Consistent quality' }
    ],
    useCases: ['Tutoring companies', 'Test prep centers', 'Learning centers', 'Online tutoring'],
    demoAvailable: true
  },
  {
    id: 'content-ai',
    title: 'AI Content Generation',
    tagline: 'Scale content production 10x',
    description: 'Our AI Content platform combines our 20+ years of educational expertise with advanced AI to produce curriculum-aligned content at scale. From lesson plans to assessments, we help you create more content faster while maintaining quality.',
    icon: '✍️',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    features: [
      'Curriculum-aligned content generation',
      'Multiple output formats (lessons, assessments, summaries)',
      'Brand voice customization',
      'Human-in-the-loop review workflow',
      'Bulk processing capabilities'
    ],
    benefits: [
      { metric: '10x', label: 'Content velocity' },
      { metric: '70%', label: 'Cost reduction' },
      { metric: '99%', label: 'Accuracy rate' }
    ],
    useCases: ['Publishers', 'EdTech platforms', 'Corporate training', 'Schools'],
    demoAvailable: false
  }
];

// Hero Section
const HeroSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-300 text-sm font-medium">Interactive demos available</span>
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AI Products for Education
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Production-ready AI tools built specifically for education companies. 
            White-label ready, enterprise-grade, designed by educators.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
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
};

// Product Card Component
const ProductCard = ({ product, index }: { product: typeof products[0], index: number }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', border: 'hover:border-blue-200', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', border: 'hover:border-purple-200', text: 'text-purple-600' },
    emerald: { bg: 'bg-emerald-50', border: 'hover:border-emerald-200', text: 'text-emerald-600' },
    orange: { bg: 'bg-orange-50', border: 'hover:border-orange-200', text: 'text-orange-600' },
    cyan: { bg: 'bg-cyan-50', border: 'hover:border-cyan-200', text: 'text-cyan-600' }
  };
  
  const colors = colorClasses[product.color as keyof typeof colorClasses];
  
  return (
    <div className={`bg-white rounded-3xl border border-slate-100 ${colors.border} transition-all hover:shadow-2xl overflow-hidden`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${product.gradient} p-8 text-white`}>
        <span className="text-5xl mb-4 block">{product.icon}</span>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h2>
        <p className="text-white/80">{product.tagline}</p>
      </div>
      
      {/* Content */}
      <div className="p-8">
        <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>
        
        {/* Benefits */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {product.benefits.map((benefit, idx) => (
            <div key={idx} className={`${colors.bg} rounded-xl p-4 text-center`}>
              <div className={`text-2xl font-bold ${colors.text}`}>{benefit.metric}</div>
              <div className="text-xs text-slate-500">{benefit.label}</div>
            </div>
          ))}
        </div>
        
        {/* Features */}
        <div className="mb-8">
          <h3 className="font-semibold text-slate-900 mb-3">Features</h3>
          <ul className="space-y-2">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                <svg className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Use Cases */}
        <div className="mb-8">
          <h3 className="font-semibold text-slate-900 mb-3">Best For</h3>
          <div className="flex flex-wrap gap-2">
            {product.useCases.map((useCase, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                {useCase}
              </span>
            ))}
          </div>
        </div>
        
        {/* CTAs */}
        <div className="flex gap-4">
          {product.demoAvailable && (
            <Link 
              href={`/products/${product.id}`}
              className={`flex-1 py-3 bg-gradient-to-r ${product.gradient} text-white font-semibold rounded-xl text-center hover:opacity-90 transition-opacity`}
            >
              Try Live Demo
            </Link>
          )}
          <Link 
            href={`/contact?product=${product.id}`}
            className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl text-center hover:bg-slate-200 transition-colors"
          >
            Get Pricing
          </Link>
        </div>
      </div>
    </div>
  );
};

// Products Grid Section
const ProductsSection = () => {
  return (
    <section id="products" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Comparison Table Section
const ComparisonSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Before vs. After Evelyn AI
            </h2>
            <p className="text-xl text-slate-600">
              See the impact our AI products can have on your business
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold">Capability</th>
                  <th className="px-6 py-4 text-left text-slate-400">Without Evelyn</th>
                  <th className="px-6 py-4 text-left text-indigo-600 font-semibold">With Evelyn AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { capability: 'After-hours support', before: 'None or expensive', after: '24/7 AI assistance' },
                  { capability: 'Essay feedback time', before: '15-30 min per essay', after: '10 seconds' },
                  { capability: 'Practice test content', before: 'Licensed, limited', after: 'Unlimited, unique' },
                  { capability: 'Tutor effectiveness', before: 'Varies by experience', after: 'Consistently excellent' },
                  { capability: 'Session documentation', before: 'Manual, inconsistent', after: 'Automatic, detailed' },
                  { capability: 'Student insights', before: 'Scattered data', after: 'Unified AI analysis' }
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 font-medium text-slate-900">{row.capability}</td>
                    <td className="px-6 py-4 text-slate-400">{row.before}</td>
                    <td className="px-6 py-4 text-indigo-600 font-medium">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

// Integration Section
const IntegrationSection = () => {
  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Easy Integration, Your Way
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Deploy our AI products however works best for your business
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
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            See Our AI in Action
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Schedule a personalized demo. We'll show you exactly how our AI products 
            can work with your content and workflows.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/contact?demo=true"
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-slate-100 transition-all"
            >
              Book a Demo
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Page
export default function ProductsPage() {
  return (
    <main>
      <HeroSection />
      <ProductsSection />
      <ComparisonSection />
      <IntegrationSection />
      <CTASection />
    </main>
  );
}
