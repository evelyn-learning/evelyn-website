// =============================================================================
// NEW HOMEPAGE - AI-FIRST POSITIONING
// =============================================================================
// File: app/page.tsx (or pages/index.tsx depending on your Next.js version)
// 
// This replaces the existing homepage with AI-first messaging
// =============================================================================

import Link from 'next/link';
import Image from 'next/image';

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`
        }} />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-300 text-sm font-medium">Now powering 500+ education companies</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            AI That Understands
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Education
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
            We build intelligent tools for test prep companies, tutoring businesses, publishers, and EdTech platforms. 
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
          
          {/* Trust Indicators */}
          <div className="mt-12 pt-12 border-t border-white/10">
            <p className="text-slate-400 text-sm mb-4">Trusted by leading education companies</p>
            <div className="flex flex-wrap gap-8 items-center opacity-60">
              {/* Add your client logos here */}
              <div className="h-8 w-24 bg-white/20 rounded" />
              <div className="h-8 w-28 bg-white/20 rounded" />
              <div className="h-8 w-20 bg-white/20 rounded" />
              <div className="h-8 w-32 bg-white/20 rounded" />
              <div className="h-8 w-24 bg-white/20 rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// AI Products Section
const AIProductsSection = () => {
  const products = [
    {
      id: 'essay-scorer',
      title: 'AI Essay Scoring',
      description: 'Instant, rubric-aligned feedback on student essays. SAT, ACT, AP, and college application scoring.',
      icon: '📝',
      color: 'from-blue-500 to-indigo-600',
      stats: '80% grading time saved',
      href: '/products/essay-ai'
    },
    {
      id: 'homework-bot',
      title: '24/7 Homework Helper',
      description: 'AI tutor that guides students through problems step-by-step, available around the clock.',
      icon: '🤖',
      color: 'from-purple-500 to-pink-600',
      stats: 'Always available',
      href: '/products/homework-bot'
    },
    {
      id: 'test-generator',
      title: 'Practice Test Generator',
      description: 'Unlimited unique practice questions. Every test is different—no answer memorization.',
      icon: '📊',
      color: 'from-emerald-500 to-teal-600',
      stats: 'Infinite fresh content',
      href: '/products/test-generator'
    },
    {
      id: 'tutor-copilot',
      title: 'Tutoring Co-Pilot',
      description: 'Real-time AI assistance for tutors. Teaching suggestions and student insights on the fly.',
      icon: '👨‍🏫',
      color: 'from-orange-500 to-red-600',
      stats: '2-3x tutor capacity',
      href: '/products/tutor-copilot'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">AI Products</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
            Intelligent Tools Built for Education
          </h2>
          <p className="text-xl text-slate-600">
            Production-ready AI products you can deploy today. White-label ready, enterprise-grade, built by educators.
          </p>
        </div>
        
        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <Link 
              key={product.id}
              href={product.href}
              className="group relative bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-indigo-100"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                {product.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {product.title}
              </h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                {product.description}
              </p>
              
              {/* Stats Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-100 group-hover:bg-indigo-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm font-medium text-slate-700">{product.stats}</span>
              </div>
              
              {/* Arrow */}
              <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-all group-hover:translate-x-1">
                <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700"
          >
            View all products and try live demos
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Solutions Section
const SolutionsSection = () => {
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
      description: 'Extend your tutors\' capacity with AI co-pilots and keep students engaged between sessions.',
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
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Solutions</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
            Built for Your Business
          </h2>
          <p className="text-xl text-slate-600">
            Whether you're a test prep company, tutoring business, publisher, or EdTech platform—we have solutions designed for you.
          </p>
        </div>
        
        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, idx) => (
            <Link 
              key={idx}
              href={solution.href}
              className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-indigo-100"
            >
              <span className="text-4xl mb-4 block">{solution.icon}</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
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
};

// Why Evelyn Section
const WhyEvelynSection = () => {
  const advantages = [
    {
      stat: '300+',
      label: 'Educator Experts',
      description: 'Real teachers training our AI models'
    },
    {
      stat: '1M+',
      label: 'Content Items',
      description: 'Knowledge base powering our AI'
    },
    {
      stat: '20+',
      label: 'Years Experience',
      description: 'Deep pedagogical expertise'
    },
    {
      stat: '50+',
      label: 'Countries',
      description: 'Global education understanding'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div>
            <span className="text-indigo-300 font-semibold text-sm uppercase tracking-wider">The Evelyn Difference</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              AI + Expertise = Results
            </h2>
            <p className="text-xl text-indigo-200 mb-8 leading-relaxed">
              Most AI companies don't understand education. Most education companies don't understand AI. 
              <span className="text-white font-medium"> We do both.</span>
            </p>
            
            <div className="space-y-4">
              {[
                'Our AI is trained by teachers, not just engineers',
                'Pedagogically sound—guides discovery, not just answers',
                'White-label ready with your branding',
                'Enterprise-grade security and compliance',
                'Dedicated integration support'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-indigo-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {advantages.map((adv, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{adv.stat}</div>
                <div className="text-lg font-semibold text-indigo-200 mb-1">{adv.label}</div>
                <div className="text-sm text-indigo-300">{adv.description}</div>
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Add AI to Your Education Business?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Schedule a demo and see our AI products working with your content. 
            No commitment, just possibilities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/contact?demo=true"
              className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/30"
            >
              Book a Demo
            </Link>
            <Link 
              href="/products"
              className="px-8 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all"
            >
              Try Live Demos
            </Link>
          </div>
          
          {/* Contact Info */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-500">
            <a href="mailto:contact@evelynlearning.com" className="flex items-center gap-2 hover:text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contact@evelynlearning.com
            </a>
            <a href="tel:+13022120975" className="flex items-center gap-2 hover:text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +1 (302) 212-0975
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Page Component
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AIProductsSection />
      <SolutionsSection />
      <WhyEvelynSection />
      <CTASection />
    </main>
  );
}
