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
import React from 'react';
import { InlineMathText } from './InlineMathText';
import type { RigidBodyFigure, RotationFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const COLORS = ['#dc2626', '#2563eb', '#059669', '#d97706', '#7c3aed', '#0891b2'];

const tw = (s: string, fs: number) => s.replace(/[_{}]/g, '').length * fs * 0.58;
/** "ω = 2 rad/s" from "2 rad/s"; a value that already names itself ("ω₂ = 12.5 rad/s") is left alone. */
const named = (symbol: string, value: string) => (value.includes('=') || value.trim().startsWith(symbol) ? value : `${symbol} = ${value}`);
/** "F_app" and "N_{wall}" are written as true subscripts. */
function sub(text: string, fs: number): React.ReactNode {
  const parts = text.split(/_(\{[^}]*\}|[A-Za-z0-9]+)/);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (i % 2
    ? <tspan key={i} dy={fs * 0.28} fontSize={fs * 0.75}>{p.replace(/[{}]/g, '')}</tspan>
    : <tspan key={i} dy={i ? -fs * 0.28 : 0}>{p}</tspan>));
}

// ── Label placement: every label is a box, tried at a short list of tidy spots and kept at the first one
// that touches nothing already drawn. Arrows may grow a step longer so close neighbours' labels stagger. ──
interface Rect { l: number; t: number; r: number; b: number }
const hits = (a: Rect, b: Rect, pad = 3) => a.l < b.r + pad && a.r > b.l - pad && a.t < b.b + pad && a.b > b.t - pad;
const boxAt = (cx: number, cy: number, w: number, h: number): Rect => ({ l: cx - w / 2, t: cy - h / 2, r: cx + w / 2, b: cy + h / 2 });
/** A line as a run of small boxes, so a slanted body or arrow blocks only where it really is. */
function along(x1: number, y1: number, x2: number, y2: number, half: number): Rect[] {
  const n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 7));
  return Array.from({ length: n + 1 }, (_, i) => boxAt(x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n, half * 2, half * 2));
}
const ARROW_LENGTHS = [64, 90, 116, 142];

export function RigidBodyRenderer({ figure }: { figure: RigidBodyFigure }) {
  const { angleDegrees, lengthLabel, bodyName, supports, forces, title } = figure;
  const a = (angleDegrees * Math.PI) / 180;
  const leaning = angleDegrees > 20;
  const bodyLen = leaning ? 400 : 520;
  // Drawn around the body's lower-left end at (0, 0); the view box is fitted to what was drawn at the end.
  const at = (t: number) => ({ x: Math.cos(a) * bodyLen * t, y: -Math.sin(a) * bodyLen * t });
  const end = at(1); const mid = at(0.5);
  const FS = 13; const AFS = 12;

  const solid: Rect[] = [...along(0, 0, end.x, end.y, 6)];   // things a label may never sit on
  const wallX = end.x + 8; const floorY = 9;
  if (leaning) {
    solid.push({ l: wallX - 2, t: end.y - 60, r: wallX + 400, b: floorY + 40 });
    solid.push({ l: -400, t: floorY + 3, r: wallX + 400, b: floorY + 40 });
  }
  const supportDraw = supports.map((s) => {
    const p = at(s.at);
    const text = [s.label, s.atLabel].filter(Boolean).join(', ');
    const shape: Rect = { l: p.x - 18, t: p.y + 4, r: p.x + 18, b: p.y + 40 };
    solid.push(shape);
    const label = text ? { text, cx: p.x, cy: p.y + 52, w: tw(text, AFS), h: AFS + 4 } : null;
    return { p, type: s.type, label };
  });

  // The forces. Each arrow starts where the force acts; its label goes past the tip, or beside the tip.
  const base = forces.map((f) => {
    const p = at(f.at); const r = (f.directionDegrees * Math.PI) / 180;
    return { f, p, dx: Math.cos(r), dy: -Math.sin(r) };
  });
  // The shaft, and the wider head at its tip.
  const shaft = (i: number, len: number) => { const b = base[i]; return [...along(b.p.x + b.dx * 10, b.p.y + b.dy * 10, b.p.x + b.dx * len, b.p.y + b.dy * len, 3), boxAt(b.p.x + b.dx * (len - 9), b.p.y + b.dy * (len - 9), 18, 18)]; };
  const MAX_LEN = ARROW_LENGTHS[ARROW_LENGTHS.length - 1];
  const shafts: Rect[][] = base.map((_, i) => shaft(i, ARROW_LENGTHS[0]));
  const done = new Set<number>();
  const placed: Rect[] = [];
  const overlap = (p: Rect, q: Rect, pad: number) => Math.max(0, Math.min(p.r, q.r + pad) - Math.max(p.l, q.l - pad)) * Math.max(0, Math.min(p.b, q.b + pad) - Math.max(p.t, q.t - pad));
  const forceDraw: Array<{ len: number; cx: number; cy: number } | null> = base.map(() => null);
  const order = base.map((_, i) => i).sort((i, j) => base[i].f.at - base[j].f.at || i - j);
  for (const i of order) {
    const { f, p, dx, dy } = base[i];
    const w = tw(f.label, FS); const h = FS + 4;
    const nx = -dy; const ny = dx;
    // Beside the tip, the side away from the body's middle is tried first.
    const out = (p.x + nx - mid.x) ** 2 + (p.y + ny - mid.y) ** 2 >= (p.x - nx - mid.x) ** 2 + (p.y - ny - mid.y) ** 2 ? 1 : -1;
    const reach = Math.abs(dx) * w / 2 + Math.abs(dy) * h / 2;
    const sideReach = Math.abs(nx) * w / 2 + Math.abs(ny) * h / 2;
    const options = ARROW_LENGTHS.flatMap((len) => {
      const tip = { x: p.x + dx * len, y: p.y + dy * len };
      const past = { cx: tip.x + dx * (9 + reach), cy: tip.y + dy * (9 + reach) };
      const slide = Math.max(0, sideReach - 12);
      return [
        past,
        ...[out, -out].map((sgn) => ({ cx: tip.x - dx * 9 + sgn * nx * (10 + sideReach), cy: tip.y - dy * 9 + sgn * ny * (10 + sideReach) })),
        // Beside the tip but further off: across a slanted body that runs close to the arrow.
        ...[18, 36, 54].flatMap((extra) => [out, -out].map((sgn) => ({ cx: tip.x - dx * 9 + sgn * nx * (10 + sideReach + extra), cy: tip.y - dy * 9 + sgn * ny * (10 + sideReach + extra) }))),
        // Past the tip but slid to one side, for a label wider than the gap it has to fit.
        ...(slide > 6 ? [out, -out].map((sgn) => ({ cx: past.cx + sgn * nx * slide, cy: past.cy + sgn * ny * slide })) : []),
      ].map((sp) => ({ len, ...sp }));
    });
    // What a spot costs: the area it shares with things already drawn, with its own arrow, and (when
    // `ahead`) with the line a neighbour's arrow may still grow along, so an early label does not take
    // the only room a later arrow has.
    const cost = (o: { len: number; cx: number; cy: number }, ahead: boolean) => {
      const box = boxAt(o.cx, o.cy, w, h); const own = shaft(i, o.len);
      let c = 0;
      for (const q of solid) c += overlap(box, q, 3);
      for (const q of placed) { c += overlap(box, q, 3); for (const s of own) c += overlap(s, q, 1); }
      for (const s of own) c += overlap(box, s, 1);
      base.forEach((_, j) => {
        if (j === i) return;
        for (const s of (ahead && !done.has(j) ? shaft(j, MAX_LEN) : shafts[j])) c += overlap(box, s, 2);
      });
      return c;
    };
    let choice = options.find((o) => cost(o, true) === 0) ?? options.find((o) => cost(o, false) === 0);
    if (!choice) { const costs = options.map((o) => cost(o, false)); choice = options[costs.indexOf(Math.min(...costs))]; }
    forceDraw[i] = choice;
    shafts[i] = shaft(i, choice.len);
    done.add(i);
    placed.push(boxAt(choice.cx, choice.cy, w, h));
  }

  // What each support is called: under it, or lower still (or to one side) when arrows come down there.
  for (const s of supportDraw) {
    const lb = s.label; if (!lb) continue;
    const clear = (cx: number, cy: number) => { const box = boxAt(cx, cy, lb.w, lb.h); return !solid.some((o) => hits(box, o)) && !placed.some((o) => hits(box, o)) && !shafts.some((sh) => sh.some((o) => hits(box, o))); };
    const spots = [0, 1, 2, 3, 4].flatMap((k) => [0, -1, 1].map((side) => ({ cx: s.p.x + side * (lb.w / 2 + 24), cy: s.p.y + (side ? 24 : 52) + k * 20 })));
    const spot = spots.find((sp) => clear(sp.cx, sp.cy));
    if (spot) { lb.cx = spot.cx; lb.cy = spot.cy; }
    placed.push(boxAt(lb.cx, lb.cy, lb.w, lb.h));
  }

  // Where along the body each force acts: written on the side its arrow does not use, stepping further out
  // (on a thin leader) when a neighbour's note is in the way. Short notes are seated first: a long one can
  // step out over them, but not the other way round.
  const noteDraw: Array<{ cx: number; cy: number; lead: { x1: number; y1: number; x2: number; y2: number } | null } | null> = base.map(() => null);
  const noteOrder = base.map((_, i) => i).filter((i) => base[i].f.atLabel).sort((i, j) => tw(base[i].f.atLabel as string, AFS) - tw(base[j].f.atLabel as string, AFS));
  for (const i of noteOrder) {
    const { f, p, dx, dy } = base[i];
    const w = tw(f.atLabel as string, AFS); const h = AFS + 4;
    const ox = -dx; const oy = -dy;
    const horizontalArrow = Math.abs(dx) > Math.abs(dy);
    for (let k = 0; k < 6 && !noteDraw[i]; k++) {
      const d = 18 + k * 20;
      const bx = p.x + ox * (d + (horizontalArrow ? w / 2 : 0)); const by = p.y + oy * d;
      const spots = horizontalArrow
        ? [{ cx: bx, cy: by }, { cx: bx, cy: by - 14 }, { cx: bx, cy: by + 14 }]
        : [{ cx: bx, cy: by }, { cx: bx - w / 2 - 8, cy: by }, { cx: bx + w / 2 + 8, cy: by }];
      const leadEnd = d + (horizontalArrow ? -4 : -h / 2 * Math.abs(oy) - 1);
      const lead = k > 0 ? { x1: p.x + ox * 9, y1: p.y + oy * 9, x2: p.x + ox * leadEnd, y2: p.y + oy * leadEnd } : null;
      const leadBoxes = lead ? along(lead.x1, lead.y1, lead.x2, lead.y2, 1) : [];
      if (leadBoxes.some((o) => placed.some((q) => hits(o, q, 1)) || shafts.some((sh, j) => j !== i && sh.some((q) => hits(o, q, 1))))) continue;
      const spot = spots.find((sp) => {
        const box = boxAt(sp.cx, sp.cy, w, h);
        return !solid.some((o) => hits(box, o)) && !placed.some((o) => hits(box, o)) && !shafts.some((sh) => sh.some((o) => hits(box, o)));
      });
      if (spot) {
        placed.push(boxAt(spot.cx, spot.cy, w, h), ...leadBoxes);
        // A note beside its leader, not over it: the leader stops level with the note's middle.
        noteDraw[i] = { ...spot, lead: lead && spot.cx !== bx && !horizontalArrow ? { ...lead, x2: p.x + ox * (d + 6), y2: p.y + oy * (d + 6) } : lead };
      }
    }
  }

  // Fit the view to everything drawn, then write what the body is underneath it all.
  const all: Rect[] = [...solid.slice(0, along(0, 0, end.x, end.y, 6).length), ...placed, ...shafts.flat(), ...supportDraw.map((s) => ({ l: s.p.x - 18, t: s.p.y, r: s.p.x + 18, b: s.p.y + 40 })), ...supportDraw.flatMap((s) => (s.label ? [boxAt(s.label.cx, s.label.cy, s.label.w, s.label.h)] : []))];
  if (leaning) all.push({ l: -60, t: end.y - 50, r: wallX + 60, b: floorY + 22 });
  const caption = lengthLabel ? `${bodyName}, ${lengthLabel}` : bodyName;
  const bottom = Math.max(...all.map((r) => r.b));
  const captionY = bottom + 26;
  all.push(boxAt(mid.x, captionY - 5, tw(caption, 14), 18));
  // A note that found no room on the figure is still said, in its force's colour, under the caption.
  const leftOver = base.map((bq, i) => ({ i, text: `${bq.f.label}: ${bq.f.atLabel}` })).filter(({ i }) => base[i].f.atLabel && !noteDraw[i]);
  leftOver.forEach(({ text }, k) => all.push(boxAt(mid.x, captionY + 20 * (k + 1) - 4, tw(text, AFS), 16)));
  const pad = 14;
  let l = Math.min(...all.map((r) => r.l)) - pad; let r = Math.max(...all.map((q) => q.r)) + pad;
  const t = Math.min(...all.map((q) => q.t)) - pad; const b = captionY + 20 * leftOver.length + pad;
  // Never narrower than a normal figure, so a short ladder is not blown up to fill the board.
  if (r - l < 640) { const extra = (640 - (r - l)) / 2; l -= extra; r += extra; }
  const floorL = Math.min(-60, Math.min(...placed.map((q) => q.l), 0) - 10);
  return (
    <div className="rigid-body-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`${l} ${t} ${r - l} ${b - t}`} className="w-full max-w-[720px]" role="img" aria-label={`${bodyName} with ${forces.length} forces`}>
        <defs>
          {COLORS.map((c, i) => <marker key={i} id={`rb-arrow-${i}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={c} /></marker>)}
        </defs>
        {/* What a leaning body leans on */}
        {leaning && <>
          <line x1={floorL} y1={floorY} x2={wallX + 60} y2={floorY} stroke="#6b7280" strokeWidth={3} />
          <line x1={wallX} y1={end.y - 50} x2={wallX} y2={floorY} stroke="#6b7280" strokeWidth={3} />
          <text x={wallX + 10} y={end.y - 34} fontSize={12} fill="#6b7280">wall</text>
          <text x={wallX + 56} y={floorY + 18} fontSize={12} textAnchor="end" fill="#6b7280">floor</text>
        </>}
        {/* The body */}
        <line x1={0} y1={0} x2={end.x} y2={end.y} stroke="#374151" strokeWidth={10} strokeLinecap="round" />
        <text x={mid.x} y={captionY} fontSize={14} textAnchor="middle" fill="#374151">{sub(caption, 14)}</text>
        {leftOver.map(({ i, text }, k) => <text key={`lo${i}`} x={mid.x} y={captionY + 20 * (k + 1)} fontSize={AFS} textAnchor="middle" fill={COLORS[i % COLORS.length]}>{sub(text, AFS)}</text>)}
        {/* What holds it up */}
        {supportDraw.map((s, i) => (
          <g key={`s${i}`}>
            {s.type === 'pivot'
              ? <><polygon points={`${s.p.x - 18},${s.p.y + 38} ${s.p.x + 18},${s.p.y + 38} ${s.p.x},${s.p.y + 6}`} fill="#9ca3af" stroke="#4b5563" strokeWidth={1.5} strokeLinejoin="round" /><circle cx={s.p.x} cy={s.p.y} r={4} fill="#fff" stroke="#111827" strokeWidth={1.5} /></>
              : <rect x={s.p.x - 14} y={s.p.y + 6} width={28} height={32} fill="#d1d5db" stroke="#4b5563" strokeWidth={1.5} />}
            {s.label && <text x={s.label.cx} y={s.label.cy + 4} fontSize={AFS} textAnchor="middle" fill="#4b5563">{sub(s.label.text, AFS)}</text>}
          </g>
        ))}
        {/* Where each force acts */}
        {noteDraw.map((n, i) => n && (
          <g key={`n${i}`}>
            {n.lead && <line x1={n.lead.x1} y1={n.lead.y1} x2={n.lead.x2} y2={n.lead.y2} stroke="#9ca3af" strokeWidth={1} />}
            <text x={n.cx} y={n.cy + 4} fontSize={AFS} textAnchor="middle" fill="#4b5563">{sub(base[i].f.atLabel as string, AFS)}</text>
          </g>
        ))}
        {/* The forces, each at its own point */}
        {base.map(({ f, p, dx, dy }, i) => {
          const c = COLORS[i % COLORS.length]; const d = forceDraw[i]!;
          return (
            <g key={`f${i}`}>
              <line x1={p.x} y1={p.y} x2={p.x + dx * d.len} y2={p.y + dy * d.len} stroke={c} strokeWidth={3} markerEnd={`url(#rb-arrow-${i % COLORS.length})`} />
              <circle cx={p.x} cy={p.y} r={3.5} fill={c} />
              <text x={d.cx} y={d.cy + 4.5} fontSize={FS} textAnchor="middle" fill={c} fontWeight={700}>{sub(f.label, FS)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function RotationRenderer({ figure }: { figure: RotationFigure }) {
  const { radiusFraction, radiusLabel, omegaLabel, massLabel, clockwise, bodyName, title } = figure;
  const W = 360; const cx = W / 2;
  const R = 26 + 84 * radiusFraction;
  const cy = 58 + R;
  const arc = (r: number, from: number, to: number) => {
    const p = (d: number) => ({ x: cx + r * Math.cos((d * Math.PI) / 180), y: cy + r * Math.sin((d * Math.PI) / 180) });
    const s = p(from); const e = p(to);
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${Math.abs(to - from) > 180 ? 1 : 0} ${to > from ? 1 : 0} ${e.x} ${e.y}`;
  };
  const sweep = clockwise ? [215, 325] : [325, 215];
  /** A long line is set smaller rather than run off the figure. */
  const fit = (text: string, fs: number) => Math.max(11, Math.min(fs, (W - 16) / Math.max(1, tw(text, 1))));
  // An angular speed that was not given is the thing to find.
  const omegaText = named('ω', omegaLabel || '?');
  const rText = named('r', radiusLabel);
  const mText = massLabel ? named('m', massLabel) : '';
  // A label is written on the figure only where it has room: along the rod for r, under a mass for m.
  // Otherwise the figure carries the bare letter and the full value is written underneath.
  const rOnRod = tw(rText, 13) <= R - 26;
  // Beside the left mass when it fits there (clear of the dashed path), else under it.
  const mBeside = !!massLabel && tw(massLabel, 12) <= cx - R - 26;
  const mUnder = !!massLabel && !mBeside && tw(massLabel, 12) / 2 <= Math.min(R - 20, cx - R - 6);
  const notes = [...(rOnRod ? [] : [rText]), ...(massLabel && !mUnder && !mBeside ? [mText] : [])];
  const notesY = cy + R + 34;
  const bodyY = notesY + notes.length * 20 + (notes.length ? 4 : 0);
  const H = bodyY + 12;
  const halo = { paintOrder: 'stroke' as const, stroke: '#fff', strokeWidth: 4, strokeLinejoin: 'round' as const };
  return (
    <div className="rotation-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[360px]" role="img" aria-label={`${bodyName} turning about its axis, radius ${radiusLabel}`}>
        <defs><marker id="rot-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7c3aed" /></marker></defs>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="5 5" />
        <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#374151" strokeWidth={5} strokeLinecap="round" />
        <circle cx={cx - R} cy={cy} r={11} fill="#93c5fd" stroke="#1d4ed8" strokeWidth={2} />
        <circle cx={cx + R} cy={cy} r={11} fill="#93c5fd" stroke="#1d4ed8" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={6} fill="#111827" />
        <text x={cx} y={cy + 24} fontSize={11} textAnchor="middle" fill="#111827" {...halo}>axis</text>
        <text x={cx + R / 2 + 2} y={cy - 9} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600} fontStyle={rOnRod ? undefined : 'italic'} {...halo}>{rOnRod ? sub(rText, 13) : 'r'}</text>
        {mBeside && <text x={cx - R - 18} y={cy + 4} fontSize={12} textAnchor="end" fill="#1d4ed8" fontWeight={600}>{sub(massLabel, 12)}</text>}
        {massLabel && !mBeside && <text x={cx - R} y={cy + 28} fontSize={12} textAnchor="middle" fill="#1d4ed8" fontWeight={600} fontStyle={mUnder ? undefined : 'italic'} {...halo}>{mUnder ? sub(massLabel, 12) : 'm'}</text>}
        <path d={arc(R + 22, sweep[0], sweep[1])} fill="none" stroke="#7c3aed" strokeWidth={2.5} markerEnd="url(#rot-arrow)" />
        <text x={cx} y={cy - R - 34} fontSize={fit(omegaText, 15)} textAnchor="middle" fill="#7c3aed" fontWeight={700}>{sub(omegaText, fit(omegaText, 15))}</text>
        {notes.map((n, i) => <text key={i} x={cx} y={notesY + i * 20} fontSize={fit(n, 13)} textAnchor="middle" fill={n === rText ? '#374151' : '#1d4ed8'} fontWeight={600}>{sub(n, fit(n, 13))}</text>)}
        <text x={cx} y={bodyY} fontSize={fit(bodyName, 12)} textAnchor="middle" fill="#6b7280">{bodyName}</text>
      </svg>
    </div>
  );
}
