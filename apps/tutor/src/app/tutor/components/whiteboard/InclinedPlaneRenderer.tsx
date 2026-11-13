'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { InclinedPlaneFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const tw = (s: string, fs: number) => s.length * fs * 0.6;
interface Rect { l: number; t: number; r: number; b: number }
const boxAt = (cx: number, cy: number, w: number, h: number): Rect => ({ l: cx - w / 2, t: cy - h / 2, r: cx + w / 2, b: cy + h / 2 });

/**
 * A block at rest on a ramp. Drawn around the foot of the slope at (0, 0) and the view box fitted to what
 * was drawn, so no angle can push the ramp or the block out of the picture. The ramp is scaled to a fixed
 * frame: a steep ramp is tall and narrow, a shallow one long and low.
 */
export function InclinedPlaneRenderer({ figure }: { figure: InclinedPlaneFigure }) {
  const { angle, mass, showForces, showFriction, title } = figure;
  const rad = (angle * Math.PI) / 180;
  const base = Math.max(24, Math.min(440, 280 / Math.tan(rad)));
  const height = base * Math.tan(rad);
  const slope = Math.hypot(base, height);
  // Unit vectors: up the slope, and out of the surface.
  const ux = Math.cos(rad); const uy = -Math.sin(rad);
  const nx = -Math.sin(rad); const ny = -Math.cos(rad);
  const BW = 60; const BH = 40;
  // A little higher on a steep ramp, where the weight arrow would otherwise come down onto the angle.
  const s = Math.min(Math.max(slope * (0.58 + 0.1 * Math.min(1, Math.max(0, (angle - 40) / 30))), BW / 2 + 4), slope - BW / 2 - 4);
  const cx = ux * s + nx * (BH / 2); const cy = uy * s + ny * (BH / 2);

  // Forces on a block at rest, from its centre. Lengths follow N = W cos θ and f = W sin θ, but never so
  // short that the arrow fails to leave the block. Static friction holds the block: it points UP the slope.
  const WLEN = 92;
  const forces = showForces
    ? [
        { key: 'W', color: '#15803d', dx: 0, dy: 1, len: WLEN },
        { key: 'N', color: '#2563eb', dx: nx, dy: ny, len: Math.max(BH / 2 + 36, WLEN * Math.cos(rad)) },
        ...(showFriction ? [{ key: 'f', color: '#d97706', dx: ux, dy: uy, len: Math.max(BW / 2 + 36, WLEN * Math.sin(rad)) }] : []),
      ]
    : [];
  const FFS = 16;
  const forceDraw = forces.map((f) => {
    const tx = cx + f.dx * f.len; const ty = cy + f.dy * f.len;
    const w = tw(f.key, FFS) + 4; const reach = Math.abs(f.dx) * w / 2 + Math.abs(f.dy) * FFS / 2;
    let lx = tx + f.dx * (9 + reach); let ly = ty + f.dy * (9 + reach);
    if (f.key === 'W') {
      // The weight arrow ends in or under the ramp: its label must not sit on the slope or the base line.
      const onLine = (x: number, y: number) => Math.abs(y) < FFS * 0.8 || (x > -8 && x < base + 8 && Math.abs(x * nx + y * ny) < FFS * 0.8) || (y < 8 && Math.abs(x - base) < FFS * 0.8);
      const spot = [[lx, ly], [tx + 24, ty - 12], [tx - 24, ty - 12], [tx, Math.max(ly, FFS)]].find(([x, y]) => !onLine(x, y));
      if (spot) { lx = spot[0]; ly = spot[1]; }
    }
    return { ...f, tx, ty, lx, ly, w };
  });

  // The mass is written beside the block, never on it: the arrows start at the block's centre. With forces
  // drawn it goes out over the corner between the normal and the downhill side, the one free direction.
  const MFS = 14;
  const massText = mass !== undefined ? `m = ${Number(mass.toPrecision(6))} kg` : null;
  const mw = massText ? tw(massText, MFS) : 0;
  let gx = nx; let gy = ny; let gd = BH / 2 + 8;
  if (showForces) { gx = (nx - ux) / Math.SQRT2; gy = (ny - uy) / Math.SQRT2; gd = Math.hypot(BW, BH) / 2 + 6; }
  const mReach = Math.abs(gx) * mw / 2 + Math.abs(gy) * MFS / 2;
  const mx = cx + gx * (gd + mReach); const my = cy + gy * (gd + mReach);

  // The angle. Its label sits inside the wedge where the wedge is tall enough to hold it, which for a
  // shallow ramp is further from the corner (and the arc is drawn out there too). If the block is in the
  // way, or the ramp is too narrow, the label goes under the base line instead.
  const AFS = 14;
  const aText = `${angle}°`;
  const aw = tw(aText, AFS);
  let arcR = Math.min(46, base * 0.5);
  const xl = Math.max(arcR * Math.cos(rad / 2) + 7, (AFS + 10) / Math.tan(rad));
  const inX = xl + aw / 2;
  const inY = -Math.max(AFS / 2 + 3, Math.min((xl * Math.tan(rad)) / 2, inX * Math.tan(rad / 2)));
  const corners = [[-BW / 2, -BH / 2], [BW / 2, -BH / 2], [BW / 2, BH / 2], [-BW / 2, BH / 2]].map(([p, q]) => ({ x: cx + ux * p + nx * q, y: cy + uy * p + ny * q }));
  // In the way: the block itself, or the weight arrow coming down from it.
  const blockLeft = Math.min(...corners.map((c) => c.x)); const blockBottom = Math.max(...corners.map((c) => c.y));
  const blocked = inX + aw / 2 + 12 > blockLeft && inY - AFS / 2 - 6 < Math.max(blockBottom, showForces ? cy + WLEN + 26 : blockBottom);
  const inside = xl + aw + 6 <= base && !blocked;
  let ax: number; let ay: number;
  if (inside) {
    arcR = Math.max(arcR, xl - 8);
    ax = inX; ay = inY;
  } else {
    arcR = Math.min(angle < 15 ? 90 : 46, base * 0.6);
    ax = Math.max(arcR * 0.7, aw / 2); ay = AFS / 2 + 9;
  }

  const all: Rect[] = [
    { l: 0, t: -height, r: base, b: 0 },
    ...corners.map((c) => boxAt(c.x, c.y, 2, 2)),
    ...forceDraw.flatMap((f) => [boxAt(f.tx, f.ty, 10, 10), boxAt(f.lx, f.ly, f.w, FFS + 2)]),
    ...(massText ? [boxAt(mx, my, mw, MFS + 4)] : []),
    boxAt(ax, ay, aw, AFS + 4),
  ];
  const pad = 16;
  let l = Math.min(...all.map((r) => r.l)) - pad; let r = Math.max(...all.map((q) => q.r)) + pad;
  const t = Math.min(...all.map((q) => q.t)) - pad; const b = Math.max(...all.map((q) => q.b)) + pad;
  // Never narrower than a normal figure, so a steep, narrow ramp is not blown up to fill the board.
  if (r - l < 560) { const extra = (560 - (r - l)) / 2; l -= extra; r += extra; }
  const sq = Math.min(12, base * 0.25);
  // Every coordinate is shifted into a view box that starts at (0, 0): label checks read raw x and y.
  const X = (x: number) => x - l; const Y = (y: number) => y - t;
  return (
    <div className="incline-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${r - l} ${b - t}`} className="w-full max-w-[640px]" role="img" aria-label={`Block on a ramp inclined at ${angle} degrees`}>
        <defs>
          {forceDraw.map((f) => (
            <marker key={f.key} id={`incline-arrow-${f.key}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={f.color} /></marker>
          ))}
        </defs>
        {/* Ramp */}
        <polygon points={`${X(0)},${Y(0)} ${X(base)},${Y(0)} ${X(base)},${Y(-height)}`} fill="#f3f4f6" stroke="#374151" strokeWidth={2.5} strokeLinejoin="round" />
        <path d={`M ${X(base - sq)} ${Y(0)} L ${X(base - sq)} ${Y(-sq)} L ${X(base)} ${Y(-sq)}`} fill="none" stroke="#6b7280" strokeWidth={1.5} />
        {/* Angle */}
        <path d={`M ${X(arcR)} ${Y(0)} A ${arcR} ${arcR} 0 0 0 ${X(arcR * Math.cos(rad))} ${Y(-arcR * Math.sin(rad))}`} fill="none" stroke="#dc2626" strokeWidth={2} />
        <text x={X(ax)} y={Y(ay + AFS * 0.36)} fontSize={AFS} textAnchor="middle" fill="#dc2626" fontWeight={700}>{aText}</text>
        {/* Block, resting on the slope */}
        <g transform={`translate(${X(cx)} ${Y(cy)}) rotate(${-angle})`}>
          <rect x={-BW / 2} y={-BH / 2} width={BW} height={BH} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={3} />
        </g>
        {massText && <text x={X(mx)} y={Y(my + MFS * 0.36)} fontSize={MFS} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{massText}</text>}
        {/* Forces */}
        {forceDraw.map((f) => (
          <g key={f.key}>
            <line x1={X(cx)} y1={Y(cy)} x2={X(f.tx)} y2={Y(f.ty)} stroke={f.color} strokeWidth={3} markerEnd={`url(#incline-arrow-${f.key})`} />
            <text x={X(f.lx)} y={Y(f.ly + FFS * 0.36)} fontSize={FFS} textAnchor="middle" fill={f.color} fontWeight={700} fontStyle="italic">{f.key}</text>
          </g>
        ))}
        {showForces && <circle cx={X(cx)} cy={Y(cy)} r={3.5} fill="#111827" />}
      </svg>
    </div>
  );
}
