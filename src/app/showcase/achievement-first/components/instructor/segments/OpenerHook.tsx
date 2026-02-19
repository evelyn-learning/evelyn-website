'use client';

import React from 'react';
import Timer from '../../shared/Timer';
import type { OpenerHookSegment } from '../../../data/presentation-lessons';

interface Props {
  segment: OpenerHookSegment;
}

export default function OpenerHook({ segment }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
      <div className="text-center max-w-2xl">
        <span className="inline-block px-3 py-1 rounded-full bg-[#F5A623]/20 text-[#F5A623] text-sm font-semibold mb-4">
          Do Now
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{segment.title}</h2>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
          <p className="text-xl text-gray-800 leading-relaxed">{segment.doNowPrompt}</p>
        </div>
      </div>
      <Timer seconds={segment.timerSeconds} size={140} label="Time Remaining" />
    </div>
  );
}
