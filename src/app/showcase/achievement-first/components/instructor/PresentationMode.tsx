'use client';

import React, { useEffect, useCallback } from 'react';
import { useAFStore } from '../../store';
import { getPresentationLessonById } from '../../data/presentation-lessons';
import OpenerHook from './segments/OpenerHook';
import DirectInstruction from './segments/DirectInstruction';
import ThinkPairShare from './segments/ThinkPairShare';
import GuidedPractice from './segments/GuidedPractice';
import CheckForUnderstanding from './segments/CheckForUnderstanding';
import IndependentPractice from './segments/IndependentPractice';
import ExitTicket from './segments/ExitTicket';

const SEGMENT_LABELS: Record<string, string> = {
  'opener-hook': 'Do Now',
  'direct-instruction': 'Direct Instruction',
  'think-pair-share': 'Think-Pair-Share',
  'guided-practice': 'Guided Practice',
  'check-for-understanding': 'Check for Understanding',
  'independent-practice': 'Independent Practice',
  'exit-ticket': 'Exit Ticket',
};

export default function PresentationMode() {
  const {
    presentationLessonId,
    presentationSegmentIndex,
    advancePresentationSegment,
    setPresentationSegmentIndex,
    exitPresentation,
  } = useAFStore();

  const lesson = presentationLessonId ? getPresentationLessonById(presentationLessonId) : null;

  const goPrev = useCallback(() => {
    if (presentationSegmentIndex > 0) {
      setPresentationSegmentIndex(presentationSegmentIndex - 1);
    }
  }, [presentationSegmentIndex, setPresentationSegmentIndex]);

  const goNext = useCallback(() => {
    if (lesson && presentationSegmentIndex < lesson.segments.length - 1) {
      advancePresentationSegment();
    }
  }, [lesson, presentationSegmentIndex, advancePresentationSegment]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') exitPresentation();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext, exitPresentation]);

  if (!lesson) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Lesson not found.</p>
          <button onClick={exitPresentation} className="mt-4 text-[#003B71] hover:underline">
            Exit
          </button>
        </div>
      </div>
    );
  }

  const segment = lesson.segments[presentationSegmentIndex];
  const isFirst = presentationSegmentIndex === 0;
  const isLast = presentationSegmentIndex === lesson.segments.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex-shrink-0 bg-[#003B71] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[#F5A623] font-bold text-sm">{lesson.title}</span>
          <span className="text-blue-300 text-xs">|</span>
          <span className="text-blue-200 text-xs">{lesson.standard}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-200">
          <span>{presentationSegmentIndex + 1} / {lesson.segments.length}</span>
          <span className="text-blue-400">|</span>
          <span className="px-2 py-0.5 rounded bg-white/10">{SEGMENT_LABELS[segment.type] || segment.type}</span>
        </div>
      </div>

      {/* Segment content */}
      <div className="flex-1 overflow-hidden">
        {segment.type === 'opener-hook' && <OpenerHook segment={segment} />}
        {segment.type === 'direct-instruction' && <DirectInstruction key={presentationSegmentIndex} segment={segment} />}
        {segment.type === 'think-pair-share' && <ThinkPairShare segment={segment} />}
        {segment.type === 'guided-practice' && <GuidedPractice key={presentationSegmentIndex} segment={segment} />}
        {segment.type === 'check-for-understanding' && <CheckForUnderstanding key={presentationSegmentIndex} segment={segment} />}
        {segment.type === 'independent-practice' && <IndependentPractice segment={segment} />}
        {segment.type === 'exit-ticket' && <ExitTicket key={presentationSegmentIndex} segment={segment} />}
      </div>

      {/* Bottom control bar */}
      <div className="flex-shrink-0 bg-gray-100 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Segment dots */}
        <div className="flex items-center gap-1.5">
          {lesson.segments.map((_, i) => (
            <button
              key={i}
              onClick={() => setPresentationSegmentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === presentationSegmentIndex
                  ? 'bg-[#003B71] scale-125'
                  : i < presentationSegmentIndex
                    ? 'bg-[#F5A623]'
                    : 'bg-gray-300'
              }`}
              title={SEGMENT_LABELS[lesson.segments[i].type]}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goNext}
            disabled={isLast}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={exitPresentation}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
