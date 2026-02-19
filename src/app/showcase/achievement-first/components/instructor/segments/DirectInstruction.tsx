'use client';

import React, { useState } from 'react';
import VideoEmbed from '../../shared/VideoEmbed';
import type { DirectInstructionSegment } from '../../../data/presentation-lessons';

interface Props {
  segment: DirectInstructionSegment;
}

export default function DirectInstruction({ segment }: Props) {
  const [showTakeaways, setShowTakeaways] = useState(false);

  return (
    <div className="flex flex-col items-center h-full gap-6 px-8 py-4 overflow-y-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#003B71]/10 text-[#003B71] text-sm font-semibold mb-2">
          Direct Instruction
        </span>
        <h2 className="text-2xl font-bold text-gray-900">{segment.title}</h2>
      </div>

      <div className="w-full max-w-3xl">
        <VideoEmbed youtubeId={segment.youtubeId} title={segment.title} />
      </div>

      {segment.teacherNotes && (
        <div className="w-full max-w-3xl bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">Teacher Notes</p>
          <p className="text-sm text-yellow-800">{segment.teacherNotes}</p>
        </div>
      )}

      <div className="w-full max-w-3xl">
        {!showTakeaways ? (
          <button
            onClick={() => setShowTakeaways(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-[#003B71]/30 text-[#003B71] font-semibold hover:bg-[#003B71]/5 transition-colors"
          >
            Reveal Key Takeaways ({segment.takeaways.length})
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-2">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">Key Takeaways</p>
            {segment.takeaways.map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-gray-800">{t}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
