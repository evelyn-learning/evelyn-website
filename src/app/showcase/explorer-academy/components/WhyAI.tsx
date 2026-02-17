'use client';

import React from 'react';

const STATIC_ITEMS = [
  'Fixed curriculum — needs manual updates when standards change',
  'Same content for every student regardless of skill level',
  'One-time delivery — additions and revisions cost extra each time',
  'No student performance data or analytics',
  'No interactivity — PDFs, printed worksheets, static videos',
  'Students get stuck with no help outside class hours',
  'Content becomes outdated over time',
];

const AI_ITEMS = [
  'Dynamic content — AI generates curriculum-aligned material on demand',
  'Personalized learning paths adapted to each student\'s strengths and gaps',
  'Continuous platform — always evolving, new features included in subscription',
  'Real-time analytics dashboard for instructors and parents',
  'Interactive — students solve, practice, ask questions, get instant feedback',
  '24/7 AI tutor available for homework help anytime',
  'Always current — AI stays aligned to latest curriculum standards',
];

export default function WhyAI() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-purple-50 bg-gradient-to-r from-purple-50 to-white">
        <h2 className="text-2xl font-bold text-gray-900">
          <span className="text-purple-600">6.</span> Why AI-Powered Learning?
        </h2>
        <p className="text-gray-600 mt-1">
          How an AI platform compares to traditional static content development
        </p>
      </div>

      <div className="p-6">
        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Static Content Column */}
          <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6">
            <h3 className="text-lg font-bold text-gray-500 mb-4">Traditional Static Content</h3>
            <ul className="space-y-3">
              {STATIC_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs mt-0.5">
                    &times;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-400 font-medium">Typical cost</p>
              <p className="text-lg font-bold text-gray-500">
                $8,000–$15,000 <span className="text-sm font-normal">one-time per subject set</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Plus $3,000–$5,000 per annual update cycle
              </p>
            </div>
          </div>

          {/* AI Platform Column */}
          <div className="rounded-xl border-2 border-purple-300 bg-purple-50/50 p-6 relative">
            <div className="absolute -top-3 right-4 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Recommended
            </div>
            <h3 className="text-lg font-bold text-purple-800 mb-4">AI-Powered Learning Platform</h3>
            <ul className="space-y-3">
              {AI_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-purple-200">
              <p className="text-sm text-purple-500 font-medium">Starting at</p>
              <p className="text-lg font-bold text-purple-800">
                $500/month <span className="text-sm font-normal">— scales with your student base</span>
              </p>
            </div>
          </div>
        </div>

        {/* Hybrid Recommendation */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 text-white">
          <p className="text-sm font-medium text-purple-200 mb-2">Our recommendation for Explorer Academy</p>
          <p className="text-lg leading-relaxed">
            <span className="font-bold">The Hybrid Approach:</span> a one-time curriculum framework for your instructors + an AI-powered student platform.
            Your teachers get structured lesson plans to teach from. Your students get personalized, interactive AI tools. Best of both worlds.
          </p>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-right">
        <span className="text-xs text-gray-400">Powered by Evelyn Learning</span>
      </div>
    </div>
  );
}
