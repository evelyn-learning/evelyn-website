/**
 * ProblemPanel — the fixed problem beside the board in a one-problem
 * (`homework-problem`) session (GAC per-problem homework, 2026-10-20).
 *
 * The problem's verbatim text and its pre-built figure stay on screen for the
 * whole session, so the tutor never redraws them and the student never has
 * to scroll the board to find what they are solving.
 *
 *  - Desktop (xl+): a fixed left column holding the text.
 *  - Below xl: a collapsible sheet above the board, collapsed by default, its
 *    header "Problem n ▾" (▴ when open; the open sheet overlays the board).
 *  - The figure itself is NOT here (GAC acceptance 2026-10-21): it is drawn
 *    on the whiteboard as page 1's first item (TutorSession → WhiteboardCanvas
 *    `leadItem` → ProblemFigure), where the student works. With a figure
 *  - The read's bracketed `[Figure: …]` / `[Graph: …]` description is never
 *    shown, drawn figure or not (owner ruling 2026-10-22, hw-14: the drawer
 *    carries the problem text only; the student has the sheet). See
 *    problemTextForDisplay — the description can state what the student is
 *    asked to read off the figure. The tutor's prompt still has it.
 *
 * `verified` only decides the one-line note; the answer key never reaches
 * the client.
 */
'use client';

import { useState } from 'react';
import type { FigureCommand } from '@/lib/tutor/homework-build/types';
import { InlineMathText } from '../whiteboard/InlineMathText';
import { problemTextForDisplay } from '@/lib/tutor/lesson-plan/homework-problem-meta';

export interface ProblemPanelProps {
  n: number;
  text: string;
  figure: FigureCommand | null;
  verified: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function ProblemPanel(props: ProblemPanelProps): JSX.Element {
  const { n, text, figure, verified } = props;
  // Phone sheet: controlled when the parent passes `collapsed`, else its own
  // state, collapsed by default.
  const [collapsedOwn, setCollapsedOwn] = useState(true);
  const collapsed = props.collapsed ?? collapsedOwn;
  const toggle = () => {
    if (props.onToggle) props.onToggle();
    if (props.collapsed === undefined) setCollapsedOwn((c) => !c);
  };

  return (
    <aside
      data-testid="problem-panel"
      aria-label={`Problem ${n}`}
      className="fixed inset-x-0 top-0 z-[60] flex flex-col bg-white border-b border-slate-200 shadow-sm select-text xl:inset-x-auto xl:left-0 xl:bottom-0 xl:z-20 xl:w-[min(38vw,440px)] xl:border-b-0 xl:border-r xl:shadow-none"
    >
      {/* Phone header: the sheet's toggle. Hidden on desktop. */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={!collapsed}
        className="xl:hidden flex items-center justify-between w-full h-10 px-4 text-sm font-semibold text-slate-800"
      >
        <span>Problem {n} {collapsed ? '▾' : '▴'}</span>
      </button>
      <div className={`${collapsed ? 'hidden' : 'block'} xl:block max-h-[45vh] xl:max-h-none xl:flex-1 overflow-y-auto px-4 pb-4 xl:pt-4`}>
        <div className="hidden xl:block mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Problem {n}</div>
        <div className="text-[15px] leading-relaxed text-slate-900">
          <InlineMathText text={problemTextForDisplay(text)} wrap />
        </div>
        {!verified && (
          <p className="mt-3 text-xs text-slate-500">No answer check for this one yet — your tutor will work it through with you.</p>
        )}
      </div>
    </aside>
  );
}
