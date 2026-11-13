'use client';

import React from 'react';
import {
  solid3DFeatureNames,
  type Solid3DFigure,
  type SolidShape,
} from '@/lib/tutor/diagrams/catalog/kinds/solid-3d';

const EDGE = '#1e3a8a';
const FILL = '#3b82f6';
const HID = '#93c5fd';
const DIM = '#b91c1c';
const KZX = 0.5; // depth → screen x
const KZY = 0.34; // depth → screen y
const HALO: React.CSSProperties = { paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3.5, strokeLinejoin: 'round' };

type P = [number, number];

/** A dimension for a label: up to two decimals, no trailing zeros (1.25 stays 1.25). */
const f = (n: number) => String(Number(n.toFixed(2)));
/** A derived length (slant, circumference): "≈" unless it came out exact. */
const approx = (n: number) => (Math.abs(n - Number(n.toFixed(2))) < 1e-9 ? `= ${f(n)}` : `≈ ${f(n)}`);

/** Dimensions as DRAWN. Past a 4 : 1 spread the picture turns into a sliver
 *  whose labels cannot be placed, so the spread is compressed (order kept) and
 *  the caption says the drawing is not to scale. Labels keep the true numbers. */
function drawnDims(dims: Record<string, number>): { drawn: Record<string, number>; distorted: boolean } {
  const vals = Object.values(dims).filter((v) => v > 0);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const MAX = 4;
  if (!(lo > 0) || hi / lo <= MAX) return { drawn: dims, distorted: false };
  const p = Math.log(MAX) / Math.log(hi / lo);
  const drawn: Record<string, number> = {};
  for (const [k, v] of Object.entries(dims)) drawn[k] = lo * Math.pow(v / lo, p);
  return { drawn, distorted: true };
}

/** Width and height of the solid's projection, in model units. */
function solidExtent(shape: SolidShape, d: Record<string, number>): [number, number] {
  if (shape === 'cube') return [d.side * (1 + KZX), d.side * (1 + KZY)];
  if (shape === 'rectangular_prism') return [d.length + d.width * KZX, d.height + d.width * KZY];
  if (shape === 'cylinder' || shape === 'cone') return [2 * d.radius, d.height + 2 * d.radius * 0.34];
  if (shape === 'sphere') return [2 * d.radius, 2 * d.radius];
  if (shape === 'square_pyramid') return [d.base * (1 + KZX), d.height + d.base * KZY];
  return [d.base + d.length * KZX, d.triHeight + d.length * KZY];
}

/** Draw one labeled 3D solid centred on (cx, cy). `d` is the drawn size, `t` the true one. */
function drawSolid(shape: SolidShape, d: Record<string, number>, t: Record<string, number>, cx: number, cy: number, S: number): React.ReactNode {
  const proj = (x: number, y: number, z: number): P => [cx + S * (x + z * KZX), cy - S * (y + z * KZY)];
  const poly = (pts: P[], props: React.SVGProps<SVGPolygonElement>) => (
    <polygon points={pts.map((p) => p.join(',')).join(' ')} strokeLinejoin="round" {...props} />
  );
  const dimLabel = (p: P, text: string, dx = 0, dy = 0, anchor: 'start' | 'middle' | 'end' = 'middle') => (
    <text x={p[0] + dx} y={p[1] + dy} fontSize={13} fill={DIM} fontWeight={700} textAnchor={anchor} style={HALO}>{text}</text>
  );
  /** A height measured OUTSIDE the solid: witness lines out to a dimension line on the left. */
  const outsideHeight = (xEdge: number, yTop: number, yBot: number, fromTopX: number, fromBotX: number, text: string) => {
    const x = xEdge - 18;
    return (
      <g>
        <line x1={fromTopX} y1={yTop} x2={x - 5} y2={yTop} stroke={DIM} strokeWidth={0.9} strokeDasharray="2 3" />
        <line x1={fromBotX} y1={yBot} x2={x - 5} y2={yBot} stroke={DIM} strokeWidth={0.9} strokeDasharray="2 3" />
        <line x1={x} y1={yTop} x2={x} y2={yBot} stroke={DIM} strokeWidth={1.3} />
        <line x1={x - 4} y1={yTop} x2={x + 4} y2={yTop} stroke={DIM} strokeWidth={1.3} />
        <line x1={x - 4} y1={yBot} x2={x + 4} y2={yBot} stroke={DIM} strokeWidth={1.3} />
        {dimLabel([x - 8, (yTop + yBot) / 2], text, 0, 4.5, 'end')}
      </g>
    );
  };

  if (shape === 'rectangular_prism' || shape === 'cube') {
    const L = shape === 'cube' ? d.side : d.length;
    const H = shape === 'cube' ? d.side : d.height;
    const W = shape === 'cube' ? d.side : d.width;
    const tL = shape === 'cube' ? t.side : t.length;
    const tH = shape === 'cube' ? t.side : t.height;
    const tW = shape === 'cube' ? t.side : t.width;
    const x0 = -L / 2, y0 = -H / 2, z0 = -W / 2;
    const c = (x: number, y: number, z: number) => proj(x0 + x, y0 + y, z0 + z);
    const fbl = c(0, 0, 0), fbr = c(L, 0, 0), ftr = c(L, H, 0), ftl = c(0, H, 0);
    const bbl = c(0, 0, W), bbr = c(L, 0, W), btr = c(L, H, W), btl = c(0, H, W);
    return (
      <g>
        {/* hidden back edges */}
        {[[bbl, bbr], [bbl, btl], [bbl, fbl]].map((e, i) => (
          <line key={i} x1={e[0][0]} y1={e[0][1]} x2={e[1][0]} y2={e[1][1]} stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
        ))}
        {poly([ftl, ftr, btr, btl], { fill: FILL, fillOpacity: 0.16, stroke: EDGE, strokeWidth: 2 })}{/* top */}
        {poly([fbr, ftr, btr, bbr], { fill: FILL, fillOpacity: 0.1, stroke: EDGE, strokeWidth: 2 })}{/* right */}
        {poly([fbl, fbr, ftr, ftl], { fill: FILL, fillOpacity: 0.22, stroke: EDGE, strokeWidth: 2 })}{/* front */}
        {dimLabel([(fbl[0] + fbr[0]) / 2, fbl[1]], f(tL), 0, 18)}
        {dimLabel([fbl[0], (fbl[1] + ftl[1]) / 2], f(tH), -9, 4.5, 'end')}
        {dimLabel([(fbr[0] + bbr[0]) / 2, (fbr[1] + bbr[1]) / 2], f(tW), 9, 13, 'start')}
      </g>
    );
  }

  if (shape === 'cylinder' || shape === 'cone') {
    const R = d.radius, Ht = d.height;
    const rx = S * R, ry = rx * 0.34;
    const bx = cx, by = cy + (S * Ht) / 2; // base centre
    const topY = by - S * Ht;
    if (shape === 'cylinder') {
      return (
        <g>
          <line x1={bx - rx} y1={by} x2={bx - rx} y2={topY} stroke={EDGE} strokeWidth={2} />
          <line x1={bx + rx} y1={by} x2={bx + rx} y2={topY} stroke={EDGE} strokeWidth={2} />
          <path d={`M ${bx - rx} ${by} A ${rx} ${ry} 0 0 0 ${bx + rx} ${by}`} fill="none" stroke={EDGE} strokeWidth={2} />
          <path d={`M ${bx - rx} ${by} A ${rx} ${ry} 0 0 1 ${bx + rx} ${by}`} fill="none" stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
          <ellipse cx={bx} cy={topY} rx={rx} ry={ry} fill={FILL} fillOpacity={0.18} stroke={EDGE} strokeWidth={2} />
          <line x1={bx} y1={topY} x2={bx + rx} y2={topY} stroke={DIM} strokeWidth={1.4} />
          <circle cx={bx} cy={topY} r={2.2} fill={DIM} />
          {dimLabel([bx, topY - ry], `r = ${f(t.radius)}`, 0, -8)}
          {dimLabel([bx + rx, (by + topY) / 2], `h = ${f(t.height)}`, 9, 4.5, 'start')}
        </g>
      );
    }
    // cone
    const apex: P = [bx, topY];
    return (
      <g>
        <path d={`M ${bx - rx} ${by} A ${rx} ${ry} 0 0 1 ${bx + rx} ${by}`} fill="none" stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
        <path d={`M ${apex[0]} ${apex[1]} L ${bx - rx} ${by} A ${rx} ${ry} 0 0 0 ${bx + rx} ${by} Z`} fill={FILL} fillOpacity={0.14} stroke={EDGE} strokeWidth={2} strokeLinejoin="round" />
        <line x1={bx} y1={by} x2={apex[0]} y2={apex[1]} stroke={DIM} strokeWidth={1.3} strokeDasharray="3 3" />
        <path d={`M ${bx} ${by - 9} h 9 v 9`} fill="none" stroke={DIM} strokeWidth={1} />
        <line x1={bx} y1={by} x2={bx + rx} y2={by} stroke={DIM} strokeWidth={1.4} />
        {dimLabel([bx + rx / 2, by], `r = ${f(t.radius)}`, 4, ry + 18)}
        {outsideHeight(bx - rx, topY, by, bx, bx - rx, `h = ${f(t.height)}`)}
      </g>
    );
  }

  if (shape === 'sphere') {
    const r = S * d.radius;
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill={FILL} fillOpacity={0.14} stroke={EDGE} strokeWidth={2} />
        <path d={`M ${cx - r} ${cy} A ${r} ${r * 0.3} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r * 0.3} 0 0 0 ${cx + r} ${cy}`} fill="none" stroke={EDGE} strokeWidth={1.3} />
        <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={DIM} strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={2.4} fill={DIM} />
        {dimLabel([cx + r / 2, cy], `r = ${f(t.radius)}`, 0, -8)}
      </g>
    );
  }

  if (shape === 'square_pyramid') {
    const B = d.base, Ht = d.height;
    const h = B / 2;
    const bfl = proj(-h, -Ht / 2, -h), bfr = proj(h, -Ht / 2, -h);
    const bbr = proj(h, -Ht / 2, h), bbl = proj(-h, -Ht / 2, h);
    const apex = proj(0, Ht / 2, 0);
    const foot = proj(0, -Ht / 2, 0);
    return (
      <g>
        <line x1={bbl[0]} y1={bbl[1]} x2={bbr[0]} y2={bbr[1]} stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
        <line x1={bbl[0]} y1={bbl[1]} x2={bfl[0]} y2={bfl[1]} stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
        <line x1={apex[0]} y1={apex[1]} x2={bbl[0]} y2={bbl[1]} stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
        {poly([bfr, bbr, apex], { fill: FILL, fillOpacity: 0.1, stroke: EDGE, strokeWidth: 2 })}
        {poly([bfl, bfr, apex], { fill: FILL, fillOpacity: 0.22, stroke: EDGE, strokeWidth: 2 })}
        <line x1={apex[0]} y1={apex[1]} x2={foot[0]} y2={foot[1]} stroke={DIM} strokeWidth={1.3} strokeDasharray="3 3" />
        <circle cx={foot[0]} cy={foot[1]} r={2} fill={DIM} />
        {dimLabel([(bfl[0] + bfr[0]) / 2, bfl[1]], f(t.base), 0, 18)}
        {dimLabel([(bfr[0] + bbr[0]) / 2, (bfr[1] + bbr[1]) / 2], f(t.base), 9, 13, 'start')}
        {outsideHeight(bfl[0], apex[1], foot[1], apex[0], foot[0], `h = ${f(t.height)}`)}
      </g>
    );
  }

  // triangular_prism
  const { base: tb, triHeight: th, length: tl } = d;
  const a0 = proj(-tb / 2, -th / 2, -tl / 2), b0 = proj(tb / 2, -th / 2, -tl / 2), c0 = proj(0, th / 2, -tl / 2);
  const a1 = proj(-tb / 2, -th / 2, tl / 2), b1 = proj(tb / 2, -th / 2, tl / 2), c1 = proj(0, th / 2, tl / 2);
  const m0: P = [(a0[0] + b0[0]) / 2, a0[1]];
  return (
    <g>
      {[[a1, b1], [a1, c1], [a0, a1]].map((e, i) => (
        <line key={i} x1={e[0][0]} y1={e[0][1]} x2={e[1][0]} y2={e[1][1]} stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
      ))}
      {poly([b0, c0, c1, b1], { fill: FILL, fillOpacity: 0.12, stroke: EDGE, strokeWidth: 2 })}
      {poly([a0, b0, c0], { fill: FILL, fillOpacity: 0.22, stroke: EDGE, strokeWidth: 2 })}
      <line x1={c0[0]} y1={c0[1]} x2={m0[0]} y2={m0[1]} stroke={DIM} strokeWidth={1.3} strokeDasharray="3 3" />
      <path d={`M ${m0[0]} ${m0[1] - 8} h 8 v 8`} fill="none" stroke={DIM} strokeWidth={1} />
      {dimLabel(m0, f(t.base), 0, 18)}
      {dimLabel([(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2], f(t.length), 9, 13, 'start')}
      {outsideHeight(a0[0], c0[1], a0[1], c0[0], a0[0], `h = ${f(t.triHeight)}`)}
    </g>
  );
}

type Face =
  | { kind: 'rect'; x: number; y: number; w: number; h: number }
  | { kind: 'tri'; pts: [number, number][] }
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'sector'; cx: number; cy: number; r: number; a0: number; a1: number };
/** A measurement written on the net: anchored at a net point, nudged in pixels. */
interface NetNote { x: number; y: number; dx?: number; dy?: number; text: string; anchor?: 'start' | 'middle' | 'end' }
/** A thin measuring line on the net (a radius, a slant height). */
interface NetRule { x1: number; y1: number; x2: number; y2: number }
interface Net { faces: Face[]; notes: NetNote[]; rules: NetRule[] }

/** Build the unfolded net (net-local coords, drawn sizes `d`, true numbers `t`), or null. */
function buildNet(shape: SolidShape, d: Record<string, number>, t: Record<string, number>): Net | null {
  if (shape === 'rectangular_prism' || shape === 'cube') {
    const L = shape === 'cube' ? d.side : d.length;
    const H = shape === 'cube' ? d.side : d.height;
    const Wd = shape === 'cube' ? d.side : d.width;
    const tL = shape === 'cube' ? t.side : t.length;
    const tH = shape === 'cube' ? t.side : t.height;
    const tW = shape === 'cube' ? t.side : t.width;
    return {
      faces: [
        { kind: 'rect', x: Wd, y: 0, w: L, h: H },
        { kind: 'rect', x: 0, y: 0, w: Wd, h: H },
        { kind: 'rect', x: Wd + L, y: 0, w: Wd, h: H },
        { kind: 'rect', x: Wd + L + Wd, y: 0, w: L, h: H },
        { kind: 'rect', x: Wd, y: -Wd, w: L, h: Wd },
        { kind: 'rect', x: Wd, y: H, w: L, h: Wd },
      ],
      notes: [
        { x: Wd + L / 2, y: H + Wd, dy: 17, text: f(tL) },
        { x: 0, y: H / 2, dx: -8, dy: 4.5, text: f(tH), anchor: 'end' },
        { x: Wd / 2, y: 0, dy: -7, text: f(tW) },
      ],
      rules: [],
    };
  }
  if (shape === 'cylinder') {
    const r = d.radius, H = d.height;
    // The strip is as long as the circle's circumference AS DRAWN, so the
    // circles visibly roll along its edges.
    const circ = 2 * Math.PI * r;
    return {
      faces: [
        { kind: 'rect', x: 0, y: 0, w: circ, h: H },
        { kind: 'circle', cx: circ / 2, cy: -r, r },
        { kind: 'circle', cx: circ / 2, cy: H + r, r },
      ],
      notes: [
        { x: 0, y: H / 2, dx: -8, dy: 4.5, text: `h = ${f(t.height)}`, anchor: 'end' },
        { x: circ / 2, y: H / 2, dy: 4.5, text: `2πr ${approx(2 * Math.PI * t.radius)}` },
        { x: circ / 2 + r, y: -r, dx: 8, dy: 4.5, text: `r = ${f(t.radius)}`, anchor: 'start' },
      ],
      rules: [{ x1: circ / 2, y1: -r, x2: circ / 2 + r, y2: -r }],
    };
  }
  if (shape === 'cone') {
    const r = d.radius, H = d.height, slant = Math.hypot(r, H);
    const theta = (2 * Math.PI * r) / slant; // sector angle
    const tSlant = Math.hypot(t.radius, t.height);
    return {
      faces: [
        { kind: 'sector', cx: 0, cy: 0, r: slant, a0: -theta / 2, a1: theta / 2 },
        { kind: 'circle', cx: slant + r, cy: 0, r },
      ],
      notes: [
        {
          x: (slant / 2) * Math.cos(-theta / 2), y: (slant / 2) * Math.sin(-theta / 2),
          dx: 12 * Math.sin(-theta / 2), dy: -12 * Math.cos(-theta / 2) + 4,
          text: `slant ${approx(tSlant)}`, anchor: Math.sin(-theta / 2) < -0.5 ? 'end' : 'middle',
        },
        { x: slant + r, y: r, dy: 17, text: `r = ${f(t.radius)}` },
      ],
      rules: [{ x1: slant + r, y1: 0, x2: slant + r, y2: r }],
    };
  }
  if (shape === 'square_pyramid') {
    const B = d.base, h = d.height, slant = Math.hypot(h, B / 2);
    const tSlant = Math.hypot(t.height, t.base / 2);
    return {
      faces: [
        { kind: 'rect', x: 0, y: 0, w: B, h: B },
        { kind: 'tri', pts: [[0, 0], [B, 0], [B / 2, -slant]] },
        { kind: 'tri', pts: [[0, B], [B, B], [B / 2, B + slant]] },
        { kind: 'tri', pts: [[0, 0], [0, B], [-slant, B / 2]] },
        { kind: 'tri', pts: [[B, 0], [B, B], [B + slant, B / 2]] },
      ],
      notes: [
        { x: B / 2, y: B, dy: -8, text: f(t.base) },
        { x: B + slant, y: B / 2, dx: 8, dy: 4.5, text: `slant ${approx(tSlant)}`, anchor: 'start' },
      ],
      rules: [{ x1: B, y1: B / 2, x2: B + slant, y2: B / 2 }],
    };
  }
  if (shape === 'triangular_prism') {
    const b = d.base, th = d.triHeight, L = d.length, side = Math.hypot(b / 2, th);
    const tSide = Math.hypot(t.base / 2, t.triHeight);
    return {
      faces: [
        { kind: 'rect', x: 0, y: 0, w: side, h: L },
        { kind: 'rect', x: side, y: 0, w: b, h: L },
        { kind: 'rect', x: side + b, y: 0, w: side, h: L },
        { kind: 'tri', pts: [[side, 0], [side + b, 0], [side + b / 2, -th]] },
        { kind: 'tri', pts: [[side, L], [side + b, L], [side + b / 2, L + th]] },
      ],
      notes: [
        { x: 0, y: L / 2, dx: -8, dy: 4.5, text: f(t.length), anchor: 'end' },
        { x: side / 2, y: L, dy: 17, text: f(tSide) === String(tSide) ? f(tSide) : `≈ ${f(tSide)}` },
        { x: side + b / 2, y: L, dy: -8, text: f(t.base) },
        { x: side + b * 0.75, y: -th / 2, dx: 9, dy: 4.5, text: `h = ${f(t.triHeight)}`, anchor: 'start' },
      ],
      rules: [{ x1: side + b / 2, y1: 0, x2: side + b / 2, y2: -th }],
    };
  }
  return null;
}

function drawNet(net: Net, cx: number, cy: number, maxW: number, maxH: number): React.ReactNode {
  const { faces } = net;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const ext = (x: number, y: number) => { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); };
  for (const fc of faces) {
    if (fc.kind === 'rect') { ext(fc.x, fc.y); ext(fc.x + fc.w, fc.y + fc.h); }
    else if (fc.kind === 'tri') fc.pts.forEach((p) => ext(p[0], p[1]));
    else if (fc.kind === 'circle') { ext(fc.cx - fc.r, fc.cy - fc.r); ext(fc.cx + fc.r, fc.cy + fc.r); }
    else {
      ext(fc.cx, fc.cy);
      const n = 24;
      for (let i = 0; i <= n; i++) { const a = fc.a0 + ((fc.a1 - fc.a0) * i) / n; ext(fc.cx + fc.r * Math.cos(a), fc.cy + fc.r * Math.sin(a)); }
    }
  }
  const S = Math.min(maxW / (maxX - minX || 1), maxH / (maxY - minY || 1));
  const ox = cx - S * (minX + maxX) / 2;
  const oy = cy - S * (minY + maxY) / 2;
  const tx = (x: number) => ox + S * x;
  const ty = (y: number) => oy + S * y;
  const fill = '#bfdbfe', stroke = '#1e3a8a';
  return (
    <g>
      {faces.map((fc, i) => {
        if (fc.kind === 'rect') return <rect key={i} x={tx(fc.x)} y={ty(fc.y)} width={S * fc.w} height={S * fc.h} fill={fill} fillOpacity={0.5} stroke={stroke} strokeWidth={1.4} />;
        if (fc.kind === 'tri') return <polygon key={i} points={fc.pts.map((p) => `${tx(p[0])},${ty(p[1])}`).join(' ')} fill={fill} fillOpacity={0.5} stroke={stroke} strokeWidth={1.4} strokeLinejoin="round" />;
        if (fc.kind === 'circle') return <circle key={i} cx={tx(fc.cx)} cy={ty(fc.cy)} r={S * fc.r} fill={fill} fillOpacity={0.5} stroke={stroke} strokeWidth={1.4} />;
        // sector
        const x0 = fc.cx + fc.r * Math.cos(fc.a0), y0 = fc.cy + fc.r * Math.sin(fc.a0);
        const x1 = fc.cx + fc.r * Math.cos(fc.a1), y1 = fc.cy + fc.r * Math.sin(fc.a1);
        const large = fc.a1 - fc.a0 > Math.PI ? 1 : 0;
        return <path key={i} d={`M ${tx(fc.cx)} ${ty(fc.cy)} L ${tx(x0)} ${ty(y0)} A ${S * fc.r} ${S * fc.r} 0 ${large} 1 ${tx(x1)} ${ty(y1)} Z`} fill={fill} fillOpacity={0.5} stroke={stroke} strokeWidth={1.4} strokeLinejoin="round" />;
      })}
      {net.rules.map((r, i) => (
        <line key={`r${i}`} x1={tx(r.x1)} y1={ty(r.y1)} x2={tx(r.x2)} y2={ty(r.y2)} stroke={DIM} strokeWidth={1.2} strokeDasharray="3 3" />
      ))}
      {net.notes.map((n, i) => (
        <text key={`n${i}`} x={tx(n.x) + (n.dx ?? 0)} y={ty(n.y) + (n.dy ?? 0)} fontSize={12.5} fill={DIM} fontWeight={700} textAnchor={n.anchor ?? 'middle'} style={HALO}>{n.text}</text>
      ))}
    </g>
  );
}

export function CatalogSolid3DRenderer({ figure }: { figure: Solid3DFigure }) {
  const N = solid3DFeatureNames;
  const { drawn, distorted } = drawnDims(figure.dims);
  const netModel = figure.showNet && figure.shape !== 'sphere' ? buildNet(figure.shape, drawn, figure.dims) : null;
  const net = !!netModel;
  const W = net ? 800 : 480;
  const H = 380;
  // The solid is fitted to its box from its real projected extent, so nothing
  // (a sphere included) can run past the caption or the frame.
  const boxW = net ? 210 : 300;
  const boxH = net ? 220 : 250;
  const [ew, eh] = solidExtent(figure.shape, drawn);
  const S = Math.min(boxW / ew, boxH / eh);
  const name = figure.shape.replace(/_/g, ' ');
  const caption = distorted ? `${name} (not to scale)` : name;
  const midY = 172;

  return (
    <div className="solid-3d-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2 text-center">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={net ? 'w-full max-w-[760px]' : 'w-full max-w-[520px]'}
        data-feature={N.solid}
        data-feature-label={figure.title || name}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {net && netModel ? (
          <>
            <g data-feature={N.solid} data-feature-label={name}>
              {drawSolid(figure.shape, drawn, figure.dims, 190, midY, S)}
            </g>
            <text x={190} y={H - 14} fontSize={12.5} textAnchor="middle" fill="#6b7280">{caption}</text>
            {/* unfolds-to arrow */}
            <line x1={346} y1={midY} x2={396} y2={midY} stroke="#6b7280" strokeWidth={1.5} markerEnd="url(#net-arr)" />
            <defs><marker id="net-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" /></marker></defs>
            <text x={371} y={midY - 8} fontSize={11} textAnchor="middle" fill="#6b7280">unfolds to</text>
            <g data-feature={N.net} data-feature-label="net">
              {drawNet(netModel, 590, midY, 250, 250)}
            </g>
            <text x={600} y={H - 14} fontSize={12.5} textAnchor="middle" fill="#6b7280">net</text>
          </>
        ) : (
          <>
            {drawSolid(figure.shape, drawn, figure.dims, W / 2 + 10, midY, S)}
            <text x={W / 2} y={H - 14} fontSize={12.5} textAnchor="middle" fill="#6b7280">{caption}</text>
          </>
        )}
      </svg>
    </div>
  );
}
