'use client';

/**
 * SolvedExampleRenderer — formal worked-example formatting.
 *
 * Different from show_solution (which is the brain narrating the steps
 * conversationally) and show_problem (which presents the problem only).
 * This is a STANDALONE artifact the student keeps as a reference: a
 * problem statement, ordered steps with optional reasoning notes, the
 * final answer boxed, and an optional "key idea" callout.
 *
 * Used pedagogically as a model the student studies BEFORE attempting
 * a try-yourself — the equivalent of a textbook's "Example 1" box.
 */

import React from 'react';
import { InlineMathText } from './InlineMathText';

export interface SolvedExampleStep {
  /** The math / action for this step. Supports inline LaTeX `$...$`. */
  expression: string;
  /** Optional reasoning sentence shown to the right of the expression. */
  reason?: string;
}

export interface SolvedExampleSpec {
  /** Optional header — falls back to "Solved Example". */
  title?: string;
  /** The problem statement. */
  problem: string;
  /** Ordered solution steps. */
  steps: SolvedExampleStep[];
  /** The final answer, boxed at the bottom. */
  answer: string;
  /** Optional one-line "key idea" / takeaway shown below the answer. */
  keyIdea?: string;
  /** Optional difficulty label. */
  difficulty?: 'easy' | 'medium' | 'hard';
}

const DIFFICULTY_STYLE: Record<string, string> = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  hard: 'bg-red-100 text-red-800 border-red-200',
};

export default function SolvedExampleRenderer({ spec }: { spec: SolvedExampleSpec }) {
  return (
    <div className="solved-example-renderer max-w-2xl border-2 border-blue-300 bg-blue-50 rounded-lg p-4 my-2">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
          {spec.title || 'Solved Example'}
        </div>
        {spec.difficulty && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${DIFFICULTY_STYLE[spec.difficulty]}`}>
            {spec.difficulty}
          </span>
        )}
      </div>

      {/* Problem */}
      <div className="bg-white border border-blue-200 rounded px-3 py-2 mb-3">
        <div className="text-xs font-semibold text-blue-700 mb-1">Problem</div>
        {/* overflow-x-auto (round-7 item 7): oversized inline-math atoms
            scroll instead of clipping under the pane's overflow-x-hidden. */}
        <div className="text-sm text-gray-900 overflow-x-auto">
          <InlineMathText text={spec.problem} />
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white border border-blue-200 rounded px-3 py-2 mb-3">
        <div className="text-xs font-semibold text-blue-700 mb-2">Solution</div>
        <ol className="space-y-2">
          {spec.steps.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="font-mono text-blue-600 font-semibold flex-shrink-0">{i + 1}.</span>
              <div className="flex-1">
                <div className="text-gray-900 overflow-x-auto">
                  <InlineMathText text={s.expression} />
                </div>
                {s.reason && (
                  <div className="text-xs text-gray-600 italic mt-0.5">— {s.reason}</div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Answer */}
      <div className="bg-blue-600 text-white rounded px-3 py-2 mb-1">
        <div className="text-xs font-semibold opacity-90 mb-0.5">Answer</div>
        <div className="text-base font-semibold">
          <InlineMathText text={spec.answer} />
        </div>
      </div>

      {/* Key idea */}
      {spec.keyIdea && (
        <div className="text-xs text-blue-800 italic mt-2 px-1">
          💡 {spec.keyIdea}
        </div>
      )}
    </div>
  );
}
