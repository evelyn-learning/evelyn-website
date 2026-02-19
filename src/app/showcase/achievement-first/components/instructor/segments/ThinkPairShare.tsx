'use client';

import React from 'react';
import Timer from '../../shared/Timer';
import type { ThinkPairShareSegment } from '../../../data/presentation-lessons';

interface Props {
  segment: ThinkPairShareSegment;
}

export default function ThinkPairShare({ segment }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
      <div className="text-center max-w-2xl">
        <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
          Think-Pair-Share
        </span>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{segment.title}</h2>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-8">
          <p className="text-xl text-gray-800 leading-relaxed">{segment.prompt}</p>
        </div>
      </div>

      <Timer seconds={segment.timerSeconds} size={140} label="Discussion Time" />

      {segment.teacherTips && (
        <div className="max-w-xl bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">Teacher Tip</p>
          <p className="text-sm text-yellow-800">{segment.teacherTips}</p>
        </div>
      )}
    </div>
  );
}
