'use client';

/**
 * BalancedEquationRenderer — pretty render of a deterministically
 * balanced equation. Reactants and products laid out with subscripts
 * displayed as <sub>; coefficients shown only when > 1; an arrow
 * separates the two sides; a small green check + optional context
 * note confirms balance.
 */

import React from 'react';

export interface BalancedEquationProps {
  title?: string;
  reactants: Array<{ coefficient: number; formula: string }>;
  products: Array<{ coefficient: number; formula: string }>;
  /** Optional reaction-type label shown below: "synthesis",
   *  "single replacement", "combustion", etc. */
  reactionType?: string;
  /** Optional follow-up note ("balanced ✓ — atoms conserved on both sides"). */
  note?: string;
}

/** Render a chemical formula with digits as <sub>. "H2O" → "H₂O". */
function renderFormula(f: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let i = 0;
  while (i < f.length) {
    const c = f[i];
    if (/\d/.test(c)) {
      let j = i;
      while (j < f.length && /\d/.test(f[j])) j++;
      parts.push(<sub key={i}>{f.slice(i, j)}</sub>);
      i = j;
    } else {
      parts.push(c);
      i++;
    }
  }
  return parts;
}

function renderSide(side: Array<{ coefficient: number; formula: string }>): React.ReactNode {
  return side.map((c, i) => (
    <span key={i} className="inline-flex items-baseline">
      {i > 0 && <span className="mx-2 text-gray-500">+</span>}
      {c.coefficient > 1 && <span className="font-semibold text-blue-700 mr-0.5">{c.coefficient}</span>}
      <span>{renderFormula(c.formula)}</span>
    </span>
  ));
}

export default function BalancedEquationRenderer(props: BalancedEquationProps) {
  return (
    <div className="balanced-equation-renderer my-2 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg max-w-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          {props.title || 'Balanced equation'}
        </div>
        <span className="text-xs font-semibold text-emerald-800">✓ atoms conserved</span>
      </div>
      <div className="text-2xl font-medium text-gray-900 my-3 text-center leading-relaxed">
        {renderSide(props.reactants)}
        <span className="mx-3 text-emerald-700 text-2xl">→</span>
        {renderSide(props.products)}
      </div>
      {props.reactionType && (
        <div className="text-xs text-emerald-700 italic mt-1">
          Reaction type: {props.reactionType}
        </div>
      )}
      {props.note && (
        <div className="text-xs text-gray-700 mt-1">{props.note}</div>
      )}
    </div>
  );
}
