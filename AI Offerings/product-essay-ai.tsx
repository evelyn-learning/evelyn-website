// =============================================================================
// INDIVIDUAL PRODUCT PAGE - ESSAY SCORING
// =============================================================================
// File: app/products/essay-ai/page.tsx
// 
// Product detail page with embedded demo
// =============================================================================

import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the demo component (client-side only)
const EssayScoringDemo = dynamic(
  () => import('@/components/demos/EssayScoringDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading demo...</p>
        </div>
      </div>
    )
  }
);

// Product Hero
const ProductHero = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-blue-200 text-sm mb-8">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">AI Essay Scoring</span>
          </nav>
          
          <div className="flex items-start gap-6">
            <span className="text-6xl">📝</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                AI Essay Scoring & Feedback
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Professional essay feedback in 10 seconds. Rubric-aligned scoring for SAT, ACT, AP, 
                and college applications with detailed, actionable improvement suggestions.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#demo"
                  className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-blue-50 transition"
                >
                  Try Live Demo
                </a>
                <Link 
                  href="/contact?product=essay-ai"
                  className="px-6 py-3 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition"
                >
                  Get Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Key Metrics
const MetricsSection = () => {
  const metrics = [
    { value: '80%', label: 'Grading time saved', icon: '⏱️' },
    { value: '10 sec', label: 'Average feedback time', icon: '⚡' },
    { value: '95%', label: 'Correlation with human graders', icon: '🎯' },
    { value: '∞', label: 'Essays per month', icon: '📈' }
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {metrics.map((metric, idx) => (
            <div key={idx} className="text-center">
              <span className="text-3xl mb-2 block">{metric.icon}</span>
              <div className="text-3xl font-bold text-slate-900">{metric.value}</div>
              <div className="text-sm text-slate-500">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Live Demo Section
const DemoSection = () => {
  return (
    <section id="demo" className="py-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Demo
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Try It Now
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Paste an essay below or use one of our samples. See the quality of AI feedback for yourself.
          </p>
        </div>
        
        {/* Demo Component */}
        <div className="max-w-6xl mx-auto">
          <EssayScoringDemo />
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 mb-4">
            This is a live demo using the same AI that powers our production system.
          </p>
          <Link 
            href="/contact?product=essay-ai&demo=true"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700"
          >
            Want to see it with your content? Book a personalized demo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      title: 'Multiple Rubric Support',
      description: 'Pre-configured for SAT, ACT, AP, and college application essays. Custom rubrics available for your specific needs.',
      icon: '📋'
    },
    {
      title: 'Category Breakdown',
      description: 'Detailed scoring across all rubric categories—not just a single score, but specific feedback for each dimension.',
      icon: '📊'
    },
    {
      title: 'Actionable Suggestions',
      description: 'Specific, prioritized improvement recommendations students can act on immediately.',
      icon: '💡'
    },
    {
      title: 'Rewrite Examples',
      description: 'Shows students exactly how to improve with before/after sentence rewrites and explanations.',
      icon: '✏️'
    },
    {
      title: 'Progress Tracking',
      description: 'Track improvement over time across multiple submissions. See which areas are improving.',
      icon: '📈'
    },
    {
      title: 'White-Label Ready',
      description: 'Your branding, your platform. Students never see Evelyn—they see your company.',
      icon: '🏷️'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Features</h2>
          <p className="text-xl text-slate-600">Everything you need for comprehensive essay feedback</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors">
              <span className="text-3xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Use Cases Section
const UseCasesSection = () => {
  const useCases = [
    {
      title: 'Test Prep Companies',
      description: 'Let students practice unlimited essays with instant feedback. Tutors review AI scores and add strategic guidance.',
      outcomes: ['More essay practice per student', 'Tutors focus on strategy', 'Better score improvements']
    },
    {
      title: 'College Counselors',
      description: 'Give students rapid feedback on application essays. Iterate faster through multiple drafts.',
      outcomes: ['Faster revision cycles', 'More students served', 'Higher quality final essays']
    },
    {
      title: 'Schools & Districts',
      description: 'Provide writing feedback at scale without overwhelming teachers. Track writing development across grade levels.',
      outcomes: ['Teacher time saved', 'Consistent feedback quality', 'Data-driven writing instruction']
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Who Uses Essay Scoring?</h2>
          <p className="text-xl text-slate-300">Built for education businesses that need scale</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-slate-300 mb-4">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Integration Section
const IntegrationSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Easy Integration</h2>
              <p className="text-xl text-slate-600 mb-6">
                Deploy in days, not months. Choose the integration method that works for your platform.
              </p>
              
              <div className="space-y-4">
                {[
                  { label: 'REST API', desc: 'Full control, any platform' },
                  { label: 'JavaScript SDK', desc: 'Drop-in widget for web apps' },
                  { label: 'LMS Integration', desc: 'Canvas, Blackboard, Moodle' },
                  { label: 'Hosted Solution', desc: 'No development needed' }
                ].map((option, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{option.label}</div>
                      <div className="text-sm text-slate-500">{option.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <div className="text-sm text-slate-400 mb-2">Quick Start Example</div>
              <pre className="text-sm overflow-x-auto">
                <code>{`const response = await fetch(
  'https://api.evelyn.ai/v1/essay/score',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      essay: studentEssay,
      rubric: 'sat'
    })
  }
);

const { score, feedback } = await response.json();`}</code>
              </pre>
              <Link 
                href="/docs/essay-scoring"
                className="mt-4 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm"
              >
                View full documentation →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Scale Your Essay Feedback?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Let's discuss how AI Essay Scoring can work for your business.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/contact?product=essay-ai"
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Get Pricing
            </Link>
            <Link 
              href="/contact?product=essay-ai&demo=true"
              className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Book Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Related Products
const RelatedProductsSection = () => {
  const related = [
    { title: '24/7 Homework Helper', href: '/products/homework-bot', icon: '🤖' },
    { title: 'Practice Test Generator', href: '/products/test-generator', icon: '📊' },
    { title: 'Tutoring Co-Pilot', href: '/products/tutor-copilot', icon: '👨‍🏫' }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
          Other AI Products
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {related.map((product, idx) => (
            <Link 
              key={idx}
              href={product.href}
              className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl">{product.icon}</span>
              <span className="font-medium text-slate-900">{product.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Page
export default function EssayAIProductPage() {
  return (
    <main className="pt-20"> {/* Account for fixed nav */}
      <ProductHero />
      <MetricsSection />
      <DemoSection />
      <FeaturesSection />
      <UseCasesSection />
      <IntegrationSection />
      <CTASection />
      <RelatedProductsSection />
    </main>
  );
}
