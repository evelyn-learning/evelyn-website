'use client';
/**
 * Two exact physics figures the board lacked (Praveen, AP Physics 1 rotation, 2026-11-11):
 *
 *   RigidBodyRenderer — a beam, plank or ladder with forces acting at DIFFERENT points along it and what
 *     holds it up. The force diagram draws every force from one box, which cannot show a see-saw with two
 *     loads or a ladder against a wall.
 *   RotationRenderer — something turning about an axis, seen from above: masses at a radius, the radius and
 *     the angular speed labelled. Two of these side by side (before_after) show a skater's arms out and in.
 *
 * Both draw what was given and never a derived answer.
 */
import { InlineMathText } from './InlineMathText';
import type { RigidBodyFigure, RotationFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const COLORS = ['#dc2626', '#2563eb', '#059669', '#d97706', '#7c3aed', '#0891b2'];

export function RigidBodyRenderer({ figure }: { figure: RigidBodyFigure }) {
  const { angleDegrees, lengthLabel, bodyName, supports, forces, title } = figure;
  const W = 640; const H = angleDegrees > 20 ? 360 : 280;
  const a = (angleDegrees * Math.PI) / 180;
  const bodyLen = angleDegrees > 20 ? 300 : 400;
  // The body runs from its lower-left end; a ladder leans up to the right against a wall.
  const x0 = (W - Math.cos(a) * bodyLen) / 2; const y0 = angleDegrees > 20 ? 318 : 180;
  const at = (t: number) => ({ x: x0 + Math.cos(a) * bodyLen * t, y: y0 - Math.sin(a) * bodyLen * t });
  const end = at(1);
  const leaning = angleDegrees > 20;
  const arrow = 62;
  const mid = at(0.5);
  return (
    <div className="rigid-body-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]" role="img" aria-label={`${bodyName} with ${forces.length} forces`}>
        <defs>
          {COLORS.map((c, i) => <marker key={i} id={`rb-arrow-${i}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={c} /></marker>)}
        </defs>
        {/* What a leaning body leans on */}
        {leaning && <>
          <line x1={40} y1={y0 + 6} x2={W - 40} y2={y0 + 6} stroke="#6b7280" strokeWidth={3} />
          <line x1={end.x + 6} y1={30} x2={end.x + 6} y2={y0 + 6} stroke="#6b7280" strokeWidth={3} />
          <text x={end.x + 16} y={48} fontSize={12} fill="#6b7280">wall</text>
          <text x={52} y={y0 + 24} fontSize={12} fill="#6b7280">floor</text>
        </>}
        {/* The body */}
        <line x1={x0} y1={y0} x2={end.x} y2={end.y} stroke="#374151" strokeWidth={10} strokeLinecap="round" />
        <text x={leaning ? 52 : W / 2} y={leaning ? 24 : H - 10} fontSize={13} textAnchor={leaning ? 'start' : 'middle'} fill="#374151">{lengthLabel ? `${bodyName}, ${lengthLabel}` : bodyName}</text>
        {/* What holds it up */}
        {supports.map((s, i) => {
          const p = at(s.at);
          return (
            <g key={`s${i}`}>
              {s.type === 'pivot'
                ? <><polygon points={`${p.x - 18},${p.y + 38} ${p.x + 18},${p.y + 38} ${p.x},${p.y + 6}`} fill="#9ca3af" stroke="#4b5563" strokeWidth={1.5} /><circle cx={p.x} cy={p.y} r={4} fill="#111827" /></>
                : <rect x={p.x - 14} y={p.y + 6} width={28} height={30} fill="#d1d5db" stroke="#4b5563" strokeWidth={1.5} />}
              {s.label && <text x={p.x} y={p.y + 56} fontSize={12} textAnchor="middle" fill="#4b5563">{s.label}</text>}
            </g>
          );
        })}
        {/* The forces, each at its own point */}
        {forces.map((f, i) => {
          const p = at(f.at); const c = COLORS[i % COLORS.length];
          const r = (f.directionDegrees * Math.PI) / 180;
          const dx = Math.cos(r); const dy = -Math.sin(r);
          // Every arrow starts at the point the force acts on and points the way it acts; its label sits past the tip.
          const tipX = p.x + dx * arrow; const tipY = p.y + dy * arrow;
          // Past the tip for a sideways arrow; beside the tip, on the side away from the body's middle, for an
          // upright one, so a label never lies along the body or on another arrow's shaft.
          const sideways = Math.abs(dx) > 0.5;
          const outward = p.x < mid.x - 1 ? -1 : 1;
          const anchor = sideways ? (dx > 0 ? 'start' : 'end') : outward < 0 ? 'end' : 'start';
          const lx = sideways ? tipX + dx * 10 : tipX + outward * 9; const ly = Math.min(Math.max(sideways ? tipY - 8 : tipY + dy * 2 + 5, 16), H - 8);
          // How far along the body it acts: written on the side the arrow does not use.
          const awayY = p.y - (dy > 0 ? 1 : -1) * 16 + 4;
          return (
            <g key={`f${i}`}>
              <line x1={p.x} y1={p.y} x2={tipX} y2={tipY} stroke={c} strokeWidth={3} markerEnd={`url(#rb-arrow-${i % COLORS.length})`} />
              <circle cx={p.x} cy={p.y} r={3.5} fill={c} />
              <text x={lx} y={ly} fontSize={13} textAnchor={anchor} fill={c} fontWeight={700}>{f.label}</text>
              {f.atLabel && !leaning && <text x={p.x} y={awayY} fontSize={11} textAnchor="middle" fill="#6b7280">{f.atLabel}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function RotationRenderer({ figure }: { figure: RotationFigure }) {
  const { radiusFraction, radiusLabel, omegaLabel, massLabel, clockwise, bodyName, title } = figure;
  const W = 320; const H = 330; const cx = W / 2; const cy = 172;
  const R = 22 + 86 * radiusFraction;
  // The faster turn gets the longer arc: a rough cue only, the label carries the value.
  const arc = (r: number, from: number, to: number) => {
    const p = (d: number) => ({ x: cx + r * Math.cos((d * Math.PI) / 180), y: cy + r * Math.sin((d * Math.PI) / 180) });
    const s = p(from); const e = p(to);
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${Math.abs(to - from) > 180 ? 1 : 0} ${to > from ? 1 : 0} ${e.x} ${e.y}`;
  };
  const sweep = clockwise ? [200, 320] : [340, 220];
  return (
    <div className="rotation-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[320px]" role="img" aria-label={`${bodyName} turning about its axis, radius ${radiusLabel}`}>
        <defs><marker id="rot-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7c3aed" /></marker></defs>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="5 5" />
        <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#374151" strokeWidth={5} strokeLinecap="round" />
        <circle cx={cx - R} cy={cy} r={11} fill="#93c5fd" stroke="#1d4ed8" strokeWidth={2} />
        <circle cx={cx + R} cy={cy} r={11} fill="#93c5fd" stroke="#1d4ed8" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={6} fill="#111827" />
        <text x={cx} y={cy + 24} fontSize={11} textAnchor="middle" fill="#111827">axis</text>
        <text x={cx + R / 2} y={cy - 9} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>{`r = ${radiusLabel}`}</text>
        {massLabel && <text x={cx - R} y={cy - 18} fontSize={12} textAnchor="middle" fill="#1d4ed8">{massLabel}</text>}
        <path d={arc(R + 20, sweep[0], sweep[1])} fill="none" stroke="#7c3aed" strokeWidth={2.5} markerEnd="url(#rot-arrow)" />
        {/* An angular speed that was not given is the thing to find. */}
        <text x={cx} y={Math.max(16, cy - R - 34)} fontSize={14} textAnchor="middle" fill="#7c3aed" fontWeight={700}>{`ω = ${omegaLabel || '?'}`}</text>
        <text x={cx} y={H - 10} fontSize={12} textAnchor="middle" fill="#6b7280">{bodyName}</text>
      </svg>
    </div>
  );
}
