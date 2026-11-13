'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { LeverFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

/** Numbers as a student would write them: no floating-point tails. */
const fmt = (n: number) => String(Number(n.toPrecision(6)));
const tw = (s: string, fs: number) => s.length * fs * 0.6;

export function LeverRenderer({ figure }: { figure: LeverFigure }) {
  const { effort, load, effortDistance, loadDistance, fulcrumPosition, balanced, title } = figure;
  const W = 720;
  const H = 300;
  const X0 = 110; const X1 = W - 110;
  const cy = 150;          // top face of the bar
  const BAR = 10;
  // A fulcrum very near one end is drawn a little way in, so the load, the fulcrum and both arm lengths
  // stay apart; the arm labels carry the true values and the figure says it is not to scale.
  const drawn = Math.min(0.8, Math.max(0.2, fulcrumPosition));
  const toScale = Math.abs(drawn - fulcrumPosition) < 1e-9;
  const fx = X0 + drawn * (X1 - X0);
  const barBottom = cy + BAR;
  const groundY = barBottom + 46;
  const dimY = groundY + 26;
  const loadText = `load ${fmt(load)} N`;
  const effortText = `effort ${fmt(effort)} N`;
  const arm = (text: string, a: number, b: number, outer: 'start' | 'end') => {
    const fits = tw(text, 13) + 12 <= b - a;
    // A label wider than its arm hangs from the outer end instead, where there is room.
    const x = fits ? (a + b) / 2 : outer === 'start' ? a : b;
    return (
      <g>
        <line x1={a} y1={groundY + 4} x2={a} y2={dimY + 6} stroke="#9ca3af" strokeWidth={1} />
        <line x1={b} y1={groundY + 4} x2={b} y2={dimY + 6} stroke="#9ca3af" strokeWidth={1} />
        <line x1={a + 2} y1={dimY} x2={b - 2} y2={dimY} stroke="#6b7280" strokeWidth={1.5} markerStart="url(#lever-d)" markerEnd="url(#lever-d)" />
        <text x={x} y={dimY + 22} fontSize={13} textAnchor={fits ? 'middle' : outer} fill="#374151" fontWeight={600}>{text}</text>
      </g>
    );
  };
  const statement = balanced
    ? `Balanced: ${fmt(effort)} × ${fmt(effortDistance)} = ${fmt(load)} × ${fmt(loadDistance)}`
    : `Not balanced: ${fmt(effort)} × ${fmt(effortDistance)} = ${fmt(effort * effortDistance)}, but ${fmt(load)} × ${fmt(loadDistance)} = ${fmt(load * loadDistance)}`;
  return (
    <div className="lever-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px]" role="img" aria-label={`Lever: load ${fmt(load)} N at ${fmt(loadDistance)} from the fulcrum, effort ${fmt(effort)} N at ${fmt(effortDistance)}`}>
        <defs>
          <marker id="lever-e" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#dc2626" /></marker>
          <marker id="lever-d" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#6b7280" /></marker>
        </defs>
        {/* Ground and fulcrum */}
        <line x1={X0 - 60} y1={groundY} x2={X1 + 60} y2={groundY} stroke="#9ca3af" strokeWidth={2} />
        <polygon points={`${fx - 26},${groundY} ${fx + 26},${groundY} ${fx},${barBottom}`} fill="#9ca3af" stroke="#374151" strokeWidth={1.5} strokeLinejoin="round" />
        {/* Bar */}
        <rect x={X0 - 26} y={cy} width={X1 - X0 + 52} height={BAR} rx={3} fill="#374151" />
        {/* Load: a block resting on the bar, its label above it */}
        <rect x={X0 - 24} y={cy - 44} width={48} height={44} rx={4} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} />
        <text x={X0} y={cy - 54} fontSize={15} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{loadText}</text>
        {/* Effort: a push down on the other end */}
        <line x1={X1} y1={cy - 74} x2={X1} y2={cy - 4} stroke="#dc2626" strokeWidth={3.5} markerEnd="url(#lever-e)" />
        <text x={X1} y={cy - 84} fontSize={15} textAnchor="middle" fill="#dc2626" fontWeight={700}>{effortText}</text>
        <text x={fx + 30} y={groundY - 8} fontSize={12} textAnchor="start" fill="#4b5563">fulcrum</text>
        {/* Arms, dimensioned below the ground line */}
        {arm(`load arm = ${fmt(loadDistance)}`, X0, fx, 'start')}
        {arm(`effort arm = ${fmt(effortDistance)}`, fx, X1, 'end')}
        {!toScale && <text x={W - 12} y={16} fontSize={11} textAnchor="end" fill="#6b7280">not to scale</text>}
        <text x={W / 2} y={H - 10} fontSize={tw(statement, 13) > W - 24 ? 11 : 13} textAnchor="middle" fill={balanced ? '#15803d' : '#b91c1c'} fontWeight={600}>{statement}</text>
      </svg>
    </div>
  );
}
