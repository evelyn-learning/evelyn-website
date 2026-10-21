/**
 * ProblemPanel — the fixed problem beside the board in a one-problem
 * (`homework-problem`) session (GAC per-problem homework, 2026-10-20).
 *
 * The problem's verbatim text and its pre-built figure stay on screen for the
 * whole session, so the tutor never redraws them and the student never has
 * to scroll the board to find what they are solving.
 *
 *  - Desktop (md+): a fixed left column, the text above the figure (4:3).
 *  - Phone: a collapsible sheet above the board, collapsed by default, its
 *    header "Problem n ▾".
 *
 * The figure is the stored `FigureCommand`, drawn by the whiteboard's own
 * renderer inside the board item error boundary — a bad spec costs the
 * figure, never the page. `verified` only decides the one-line note; the
 * answer key never reaches the client.
 */
'use client';

import { useState } from 'react';
import type { WhiteboardCommand } from '@core/knowledge/types';
import type { FigureCommand } from '@/lib/tutor/homework-build/types';
import { CommandRenderer } from '../whiteboard/WhiteboardCanvas';
import { BoardItemErrorBoundary } from '../whiteboard/BoardItemErrorBoundary';
import { InlineMathText } from '../whiteboard/InlineMathText';

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
      className="relative z-20 shrink-0 flex flex-col bg-white border-b border-slate-200 select-text md:w-[min(38vw,440px)] md:h-full md:border-b-0 md:border-r"
    >
      {/* Phone header: the sheet's toggle. Hidden on desktop. */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={!collapsed}
        className="md:hidden flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-slate-800"
      >
        <span>Problem {n} ▾</span>
      </button>
      <div className={`${collapsed ? 'hidden' : 'block'} md:block max-h-[45vh] md:max-h-none md:flex-1 overflow-y-auto px-4 pb-4 md:pt-4`}>
        <div className="hidden md:block mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Problem {n}</div>
        <div className="text-[15px] leading-relaxed text-slate-900">
          <InlineMathText text={text} wrap />
        </div>
        {figure && (
          <div className="mt-4 w-full aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-white flex items-center justify-center">
            <div className="w-full h-full">
              <BoardItemErrorBoundary action={figure.action} resetKey={figure}>
                <CommandRenderer command={figure as unknown as WhiteboardCommand} />
              </BoardItemErrorBoundary>
            </div>
          </div>
        )}
        {!verified && (
          <p className="mt-3 text-xs text-slate-500">No answer check for this one yet — your tutor will work it through with you.</p>
        )}
      </div>
    </aside>
  );
}
