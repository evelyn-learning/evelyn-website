'use client';

import React from 'react';
import Timer from '../../shared/Timer';
import type { IndependentPracticeSegment } from '../../../data/presentation-lessons';

interface Props {
  segment: IndependentPracticeSegment;
}

export default function IndependentPractice({ segment }: Props) {
  return (
    <div className="flex flex-col items-center h-full gap-6 px-8 py-4 overflow-y-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-2">
          Independent Practice
        </span>
        <h2 className="text-2xl font-bold text-gray-900">{segment.title}</h2>
      </div>

      <Timer seconds={segment.timerSeconds} size={120} label="Work Time" />

      <div className="w-full max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Problems</p>
          <div className="space-y-3">
            {segment.problems.map((problem, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#003B71] text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <p className="text-gray-800 pt-0.5">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
