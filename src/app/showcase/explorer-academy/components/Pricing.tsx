'use client';

import React from 'react';

interface Tier {
  name: string;
  subtitle: string;
  price: string;
  features: string[];
  cta: string;
  recommended?: boolean;
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    subtitle: 'Up to 100 students',
    price: '$500–$800/mo',
    features: [
      'AI Math Solver',
      'Practice Test Generator',
      '24/7 Homework Helper',
      'Student Analytics Dashboard',
      'White-labeled under Explorer Academy brand',
      'Hosted and maintained by Evelyn Learning',
      'Email support',
    ],
    cta: 'Best for getting started',
  },
  {
    name: 'Growth',
    subtitle: 'Up to 300 students',
    price: '$1,200–$1,500/mo',
    features: [
      'Everything in Starter, plus:',
      'Adaptive Learning Engine',
      'AI Curriculum Designer',
      'Parent Engagement Portal',
      'Science modules included',
      'Priority support',
    ],
    cta: 'Best for scaling',
    recommended: true,
  },
  {
    name: 'Premium',
    subtitle: 'Unlimited students',
    price: '$2,000–$2,500/mo',
    features: [
      'Everything in Growth, plus:',
      'Custom feature development',
      'Dedicated account manager',
      'AI-generated video lessons',
      'Multi-location support',
      'SLA guarantee',
    ],
    cta: 'Best for full transformation',
  },
];

const HYBRID_SETUP = [
  'Scope & sequence for Math and Science (Grades 3–10, BC curriculum)',
  'Instructor lesson plans and teaching guides',
  'Core worksheet sets for in-class use',
  'AI-generated video scripts for key topics',
];

export default function Pricing() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-purple-50 bg-gradient-to-r from-purple-50 to-white">
        <h2 className="text-2xl font-bold text-gray-900">
          <span className="text-purple-600">7.</span> Partnership Plans
        </h2>
        <p className="text-gray-600 mt-1">
          Every plan includes full white-labeling, hosting, maintenance, BC curriculum alignment, and monthly usage reports.
        </p>
      </div>

      <div className="p-6">
        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl border-2 p-6 flex flex-col ${
                tier.recommended
                  ? 'border-purple-400 bg-purple-50/40 shadow-lg scale-[1.02]'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Recommended
                </div>
              )}

              <div className="mb-4">
                <h3 className={`text-xl font-bold ${tier.recommended ? 'text-purple-800' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
                <p className="text-sm text-gray-500">{tier.subtitle}</p>
              </div>

              <p className={`text-2xl font-bold mb-5 ${tier.recommended ? 'text-purple-700' : 'text-gray-900'}`}>
                {tier.price}
              </p>

              <ul className="space-y-2.5 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    {i === 0 && feature.includes('Everything in') ? (
                      <span className="text-purple-500 font-medium">{feature}</span>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <div className={`mt-6 py-2.5 rounded-lg text-center text-sm font-medium ${
                tier.recommended
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tier.cta}
              </div>
            </div>
          ))}
        </div>

        {/* Hybrid Package */}
        <div className="mt-8 rounded-xl border-2 border-yellow-300 bg-yellow-50/50 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">Recommended for Explorer Academy</p>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                The Hybrid Package
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                One-time curriculum framework development + AI platform subscription
              </p>

              {/* Setup */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  One-time setup: <span className="text-purple-700">$5,000–$8,000</span>
                </p>
                <ul className="space-y-1.5">
                  {HYBRID_SETUP.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-purple-400 mt-1">&#8226;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plus platform */}
              <p className="text-sm text-gray-800">
                <span className="font-semibold">Plus</span> monthly AI platform subscription at any tier above
              </p>
            </div>

            <div className="lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-lg border border-yellow-200 p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Onboarding fee</p>
                  <p className="text-lg font-bold text-gray-900">$1,500–$2,500</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Includes BC curriculum configuration, branding setup, initial content mapping, and instructor training session
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    This approach gives your instructors structured materials to teach from while your students get personalized AI-powered practice, assessment, and tutoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footnotes */}
        <div className="mt-6 space-y-1.5 text-xs text-gray-400">
          <p>All prices in USD. Volume discounts available for annual commitments.</p>
          <p>
            AI-generated videos: We create pedagogically sound video scripts written by our educators,
            then produce animated explainer videos using AI generation — high quality at a fraction of traditional video production costs.
          </p>
          <p>Pricing ranges reflect customization level — we&apos;ll finalize exact pricing based on your specific requirements.</p>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-right">
        <span className="text-xs text-gray-400">Powered by Evelyn Learning</span>
      </div>
    </div>
  );
}
