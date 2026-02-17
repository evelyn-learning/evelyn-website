'use client';

import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  active?: boolean;
}

const STEPS: Step[] = [
  {
    number: 1,
    title: "Today's Discussion",
    description:
      'We walk through the platform demos, discuss your specific needs for Math and Science courses, and identify the best plan for Explorer Academy.',
    active: true,
  },
  {
    number: 2,
    title: 'Custom Proposal',
    description:
      'Within 3–5 business days, we deliver a detailed proposal with exact pricing, feature scope, curriculum alignment plan, and timeline.',
  },
  {
    number: 3,
    title: 'Branded Demo',
    description:
      'We build a fully branded Explorer Academy prototype with your logo, colors, and sample content from your chosen grade levels — so you can see exactly what your students will experience.',
  },
  {
    number: 4,
    title: 'Launch',
    description:
      'After your approval, we configure the platform, onboard your instructors, and go live. Typical timeline: 4–6 weeks from sign-off.',
  },
];

export default function NextSteps() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-purple-50 bg-gradient-to-r from-purple-50 to-white">
        <h2 className="text-2xl font-bold text-gray-900">
          <span className="text-purple-600">8.</span> Getting Started — Your Roadmap
        </h2>
        <p className="text-gray-600 mt-1">
          From today&apos;s conversation to a live platform for your students
        </p>
      </div>

      <div className="p-6">
        {/* Desktop Timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" />
            <div className="absolute top-6 left-0 h-0.5 bg-purple-400" style={{ width: '12.5%' }} />

            <div className="grid grid-cols-4 gap-4 relative">
              {STEPS.map((step) => (
                <div key={step.number} className="flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4 ${
                      step.active
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                        : 'bg-white border-2 border-gray-200 text-gray-400'
                    }`}
                  >
                    {step.number}
                  </div>
                  <h3 className={`font-semibold text-sm mb-2 ${step.active ? 'text-purple-700' : 'text-gray-800'}`}>
                    {step.title}
                  </h3>
                  {step.active && (
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full mb-2">
                      WE ARE HERE
                    </span>
                  )}
                  <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden space-y-0">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-4">
              {/* Line + dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    step.active
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}
                >
                  {step.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[24px] ${i === 0 ? 'bg-purple-300' : 'bg-gray-200'}`} />
                )}
              </div>
              {/* Content */}
              <div className="pb-6">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold text-sm ${step.active ? 'text-purple-700' : 'text-gray-800'}`}>
                    {step.title}
                  </h3>
                  {step.active && (
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                      TODAY
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-lg font-semibold text-gray-800 mb-5">
            Ready to bring AI-powered learning to Explorer Academy?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://calendar.app.google/xCYpNbyynQntcaEC7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
            >
              Schedule Follow-Up
            </a>
            <a
              href="mailto:contact@evelynlearning.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-purple-200 hover:border-purple-400 text-purple-700 font-semibold transition-colors"
            >
              Email Us
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Praveen Tyagi &middot; contact@evelynlearning.com &middot; evelynlearning.com
          </p>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-right">
        <span className="text-xs text-gray-400">Powered by Evelyn Learning</span>
      </div>
    </div>
  );
}
