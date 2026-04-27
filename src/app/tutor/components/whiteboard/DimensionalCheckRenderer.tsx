'use client';

/**
 * DimensionalCheckRenderer — render a formula / expression with its
 * deterministically-verified dimensional analysis.
 *
 * Two modes:
 *   - formula mode:   "F = m·a" — both sides are parsed and compared.
 *   - expression mode: "m v² / r" with expected="N" — single side
 *     parsed and compared against the named unit.
 *
 * Either way the canvas case has already run the check and passes the
 * result down. We render the formula prominently, then a small ✓/✗ row
 * with the computed and (when applicable) expected dimensions.
 */

import React from 'react';
import { InlineMathText } from './InlineMathText';

export interface DimensionalCheckProps {
  title?: string;
  /** Raw formula or expression the brain wrote, rendered verbatim. */
  expression: string;
  /** Whether the dimensions matched. */
  match: boolean;
  /** Pretty-printed computed dimensions (e.g. "M·L·T^-2"). */
  computed: string;
  /** Pretty-printed expected dimensions, when in expression+unit mode. */
  expected?: string;
  /** When match=false, ordered list of issues from the validator. */
  issues?: string[];
  /** Optional one-line note from the brain ("checking units before solving"). */
  note?: string;
}

export default function DimensionalCheckRenderer(props: DimensionalCheckProps) {
  const palette = props.match
    ? { bg: 'bg-emerald-50', border: 'border-emerald-300', accent: 'text-emerald-700', tag: 'bg-emerald-600' }
    : { bg: 'bg-rose-50', border: 'border-rose-300', accent: 'text-rose-700', tag: 'bg-rose-600' };

  return (
    <div className={`dimensional-check-renderer my-2 p-4 rounded-lg max-w-2xl border-2 ${palette.bg} ${palette.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`text-xs font-bold uppercase tracking-wider ${palette.accent}`}>
          {props.title || 'Dimensional check'}
        </div>
        <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded ${palette.tag}`}>
          {props.match ? '✓ dimensions match' : '✗ dimensions mismatch'}
        </span>
      </div>
      <div className="text-xl font-medium text-gray-900 my-3 text-center">
        <InlineMathText text={props.expression} />
      </div>
      <div className="text-xs space-y-0.5 text-gray-700">
        <div>computed: <span className="font-mono">{props.computed}</span></div>
        {props.expected && (
          <div>expected: <span className="font-mono">{props.expected}</span></div>
        )}
      </div>
      {props.issues && props.issues.length > 0 && (
        <ul className="text-xs text-rose-700 mt-2 space-y-0.5 list-disc list-inside">
          {props.issues.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      )}
      {props.note && (
        <div className="text-xs italic text-gray-700 mt-2">{props.note}</div>
      )}
    </div>
  );
}
