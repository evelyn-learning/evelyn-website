'use client';

import React, { useState } from 'react';
import type { GuidedPracticeSegment } from '../../../data/presentation-lessons';

interface Props {
  segment: GuidedPracticeSegment;
}

export default function GuidedPractice({ segment }: Props) {
  const [visibleSteps, setVisibleSteps] = useState(0);

  return (
    <div className="flex flex-col items-center h-full gap-6 px-8 py-4 overflow-y-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#F5A623]/20 text-[#F5A623] text-sm font-semibold mb-2">
          Guided Practice
        </span>
        <h2 className="text-2xl font-bold text-gray-900">{segment.title}</h2>
      </div>

      <div className="w-full max-w-2xl">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6 text-center">
          <p className="text-2xl font-bold text-gray-900">{segment.problem}</p>
        </div>

        <div className="space-y-3">
          {segment.steps.map((step, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${
                i < visibleSteps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 h-0 overflow-hidden'
              }`}
            >
              <div className="flex gap-4 items-start bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#003B71] text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm mb-1">{step.label}</p>
                  <p className="text-gray-700">{step.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-6">
          {visibleSteps < segment.steps.length ? (
            <>
              <button
                onClick={() => setVisibleSteps((v) => v + 1)}
                className="px-6 py-3 rounded-xl bg-[#F5A623] text-[#003B71] font-semibold hover:bg-[#e6991a] transition-colors"
              >
                Reveal Step {visibleSteps + 1} of {segment.steps.length}
              </button>
              <button
                onClick={() => setVisibleSteps(segment.steps.length)}
                className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium transition-colors text-sm"
              >
                Show All
              </button>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-3 text-green-700 font-semibold">
              All steps revealed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
