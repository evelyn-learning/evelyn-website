'use client';

/**
 * LessonPlanProgress
 *
 * Compact horizontal strip shown in the page header during a lesson-
 * plan-driven session. Two stacked rows of small chips (one per
 * segment) with a thin progress line. Designed to fit alongside the
 * session timer + Export PDF + End Session controls without claiming
 * a whole panel of vertical space.
 */

import React from 'react';
import type { LessonPlan, Segment } from '@/lib/tutor/lesson-plan/types';

interface Props {
  plan: LessonPlan;
  currentSegmentId: string;
}

const KIND_LABEL: Record<Segment['kind'], string> = {
  hook: 'Hook',
  concept: 'Concept',
  worked_example: 'Example',
  try_yourself: 'Try',
  misconception_check: 'Check',
  recap: 'Recap',
  extension: 'Stretch',
};

export function LessonPlanProgress({ plan, currentSegmentId }: Props) {
  const segments = plan.segments;
  const currentIdx = segments.findIndex((s) => s.id === currentSegmentId);
  const minutesRemaining = segments
    .slice(Math.max(currentIdx, 0))
    .reduce((sum, s) => sum + (s.estimatedMinutes ?? 0), 0);
  const totalMinutes = plan.estimatedMinutes;
  const completedMinutes = Math.max(totalMinutes - minutesRemaining, 0);
  const pctComplete = totalMinutes > 0 ? Math.round((completedMinutes / totalMinutes) * 100) : 0;

  return (
    <div className="flex items-center gap-3 min-w-0 max-w-full">
      {/* Segment dots — compact, single row, no icons */}
      <div className="flex items-center gap-1 flex-wrap">
        {segments.map((s, i) => {
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <span
              key={s.id}
              title={getSegmentTitle(s)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium leading-tight whitespace-nowrap transition ${
                isCurrent
                  ? 'bg-blue-600 text-white'
                  : isDone
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-white animate-pulse' : isDone ? 'bg-blue-500' : 'bg-gray-400'}`} />
              {KIND_LABEL[s.kind] ?? s.kind}
            </span>
          );
        })}
      </div>
      {/* Slim progress + time */}
      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        <div className="w-24 h-1 rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${pctComplete}%` }} />
        </div>
        <span className="text-xs text-gray-600 whitespace-nowrap font-medium">{minutesRemaining} / {totalMinutes} min</span>
      </div>
    </div>
  );
}

function getSegmentTitle(s: Segment): string {
  switch (s.kind) {
    case 'hook':
    case 'concept':
      return s.goal;
    case 'worked_example':
      return s.problem;
    case 'try_yourself':
      return s.problem;
    case 'misconception_check':
      return s.question;
    case 'recap':
      return s.mustRemember[0] ?? '';
    case 'extension':
      return s.advancedQuestion;
    default:
      return (s as Segment).id;
  }
}
