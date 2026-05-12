'use client';

/**
 * LessonPlanProgress
 *
 * Compact progress strip shown in the page header during a lesson-
 * plan-driven session. Designed to fit alongside the session timer +
 * Export PDF + End Session controls without claiming a panel of
 * vertical space, AND to stay legible on mobile.
 *
 * "Completed" semantics: a segment is COMPLETED iff its id appears in
 * `completedSegmentIds` (= mark_segment_complete has fired for it).
 * Array-position-based completion (everything before currentIdx) was
 * tried and rejected — it falsely counted skipped segments as done
 * (observed 2026-05-12 bio session where the brain skipped hooks and
 * try_yourselfs and the strip read 4/4 for an LO that only had one
 * real concept turn).
 *
 * Three render modes:
 *
 *   1. PENDING_PICKER — plan is a Y>X picker waiting for the student
 *      to commit to a subset. We render a single chip "Pick to start"
 *      with the available count, not segment pills.
 *
 *   2. LO_SUMMARY — plan has many LOs (≥ 4), so segment pills get
 *      noisy and wrap across multiple rows. Render one row of LO chips
 *      with completed-segment ratio per LO. Each LO chip can be
 *      hovered for the LO description; per-segment detail collapsed.
 *
 *   3. SEGMENT_PILLS — small plan (< 4 LOs or no LOs at all, e.g. a
 *      curated single-LO plan). Show one pill per segment.
 *
 * Time is intentionally NOT shown here: the session timer in the
 * page header is the authoritative time signal. The strip is for
 * CONTENT progress, not time progress.
 */

import React from 'react';
import type { LessonPlan, Segment } from '@/lib/tutor/lesson-plan/types';

interface Props {
  plan: LessonPlan;
  currentSegmentId: string;
  /** Ids of segments the brain has marked complete via
   *  mark_segment_complete. Drives the per-LO completion count. */
  completedSegmentIds?: ReadonlyArray<string>;
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

const LO_SUMMARY_THRESHOLD = 4;

export function LessonPlanProgress({ plan, currentSegmentId, completedSegmentIds }: Props) {
  const segments = plan.segments;
  const completed = new Set(completedSegmentIds ?? []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingPicker = (plan.metadata as any)?.pendingPicker === true;

  if (pendingPicker) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const available = (plan.metadata as any)?.availableLOs;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allowedMaxLOs = (plan.metadata as any)?.allowedMaxLOs;
    const availableCount = Array.isArray(available) ? available.length : plan.los.length;
    return (
      <div className="flex items-center gap-2 min-w-0 max-w-full">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200 whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          Awaiting your pick
          {typeof allowedMaxLOs === 'number'
            ? ` · ${allowedMaxLOs} of ${availableCount}`
            : ` · ${availableCount} options`}
        </span>
      </div>
    );
  }

  // Build per-LO segment groups. Segment ids in our generated plans
  // follow the convention "<loId>-hook" / "<loId>-concept" etc.
  const losInOrder: string[] = plan.los.map((lo) => lo.id);
  const groupOf = (seg: Segment): string | null => {
    for (const lo of losInOrder) {
      if (seg.id.startsWith(`${lo}-`) || seg.id === lo) return lo;
    }
    return null;
  };
  const grouped = new Map<string, Segment[]>();
  let allGrouped = losInOrder.length > 0;
  for (const seg of segments) {
    if (seg.id === 'intro' || seg.id === 'pick-los') continue;
    const g = groupOf(seg);
    if (!g) {
      allGrouped = false;
      break;
    }
    const arr = grouped.get(g) ?? [];
    arr.push(seg);
    grouped.set(g, arr);
  }

  // ── LO_SUMMARY mode (many LOs, all segments groupable by LO) ──
  if (allGrouped && losInOrder.length >= LO_SUMMARY_THRESHOLD) {
    return (
      <div className="flex items-center gap-1 flex-wrap min-w-0 max-w-full">
        {plan.los.map((lo, i) => {
          const loSegments = grouped.get(lo.id) ?? [];
          const total = loSegments.length;
          const completedCount = loSegments.reduce((n, s) => n + (completed.has(s.id) ? 1 : 0), 0);
          const isCurrent = loSegments.some((s) => s.id === currentSegmentId);
          const isDone = total > 0 && completedCount === total;
          return (
            <span
              key={lo.id}
              title={lo.description}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-tight whitespace-nowrap transition ${
                isCurrent
                  ? 'bg-blue-600 text-white'
                  : isDone
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isCurrent ? 'bg-white animate-pulse' : isDone ? 'bg-blue-500' : 'bg-gray-400'}`} />
              LO {i + 1} · {completedCount}/{total}
            </span>
          );
        })}
      </div>
    );
  }

  // ── SEGMENT_PILLS mode (small plan) ──
  const currentIdx = segments.findIndex((s) => s.id === currentSegmentId);
  return (
    <div className="flex items-center gap-1 flex-wrap min-w-0 max-w-full">
      {segments.map((s, i) => {
        const isDone = completed.has(s.id);
        const isCurrent = i === currentIdx;
        return (
          <span
            key={s.id}
            title={getSegmentTitle(s)}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-tight whitespace-nowrap transition ${
              isCurrent
                ? 'bg-blue-600 text-white'
                : isDone
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isCurrent ? 'bg-white animate-pulse' : isDone ? 'bg-blue-500' : 'bg-gray-400'}`} />
            {KIND_LABEL[s.kind] ?? s.kind}
          </span>
        );
      })}
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
