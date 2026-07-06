/**
 * Pure (no-React) rough.js path builder for sketch primitives. Shared by:
 *   - SketchRenderer.tsx (live whiteboard, declarative <path> elements);
 *   - the PDF renderer (sketchToSvgString → embedded SVG);
 *   - the Phase-0 smoke script (rasterize + eyeball).
 *
 * rough.generator() needs no DOM, so this runs server-side and in node too.
 * A fixed per-primitive seed keeps hand-drawn jitter STABLE across re-renders.
 */
import rough from 'roughjs';
import {
  SKETCH_COLORS,
  SKETCH_VIEWBOX,
  type Pt,
  type SketchColor,
  type SketchPrimitive,
} from './sketch-schema';
import { feat, shortLabelSlug } from '@/lib/tutor/diagrams/layout';

export const ROUGH_OPTS = { roughness: 1.1, bowing: 1 } as const;
const DEFAULT_SW = 1; // in 0..100 units

export interface PathInfo {
  d: string;
  stroke: string;
  strokeWidth: number;
  fill?: string;
}
export interface LabelSpec {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  anchor: 'start' | 'middle' | 'end';
  fill: string;
  feature: Record<string, string>;
}

const hex = (c: SketchColor | undefined, fallback: SketchColor = 'ink') => SKETCH_COLORS[c ?? fallback];

type Gen = ReturnType<typeof rough.generator>;

/** Small deterministic PRNG (mulberry32) so `blob`/`dots_cluster` jitter is
 *  STABLE across re-renders (matches the fixed-seed philosophy of this module). */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Curly-brace silhouette + tip point for a `brace` primitive. Shared by the
 *  renderer (draws the curve) and buildSketchPaths (places the label at the tip). */
function braceGeom(p: {
  x1: number; y1: number; x2: number; y2: number;
  side?: 'left' | 'right' | 'top' | 'bottom';
}): { pts: [number, number][]; tip: [number, number] } {
  const dx = p.x2 - p.x1, dy = p.y2 - p.y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const px = -uy, py = ux; // unit perpendicular (left of the direction)
  const eff = p.side ?? (Math.abs(ux) >= Math.abs(uy) ? 'top' : 'right');
  // pick the perpendicular sign so the brace bulges toward the requested side
  const sign =
    eff === 'top' ? (py < 0 ? 1 : -1)
    : eff === 'bottom' ? (py > 0 ? 1 : -1)
    : eff === 'left' ? (px < 0 ? 1 : -1)
    : (px > 0 ? 1 : -1);
  const d = Math.min(8, Math.max(3, len * 0.12));
  // (t along the span, magnitude of the outward bump) — a central nib reads as a brace
  const prof: [number, number][] = [
    [0, 0], [0.12, 0.8], [0.28, 1], [0.45, 1], [0.5, 1.7], [0.55, 1], [0.72, 1], [0.88, 0.8], [1, 0],
  ];
  const pts = prof.map(
    ([t, m]) => [p.x1 + dx * t + px * sign * d * m, p.y1 + dy * t + py * sign * d * m] as [number, number],
  );
  const mx = p.x1 + dx * 0.5, my = p.y1 + dy * 0.5;
  const tip: [number, number] = [mx + px * sign * (d * 1.7 + 4), my + py * sign * (d * 1.7 + 4)];
  return { pts, tip };
}

/** Where a `vector`'s midpoint label sits — nudged to the upper side of the shaft. */
function vectorLabelPos(p: { x1: number; y1: number; x2: number; y2: number }): [number, number] {
  const dx = p.x2 - p.x1, dy = p.y2 - p.y1;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len, py = dx / len;
  const sign = py > 0 ? -1 : 1; // keep it above the shaft (smaller y)
  const mx = (p.x1 + p.x2) / 2, my = (p.y1 + p.y2) / 2;
  return [mx + px * sign * 6, my + py * sign * 6];
}

/** Node positions (angle + point + label) around a `cycle` ring. Shared by the
 *  renderer (node dots + arc arrows) and buildSketchPaths (stage labels). Stage 0
 *  sits at the top; stages advance clockwise (default) or counter-clockwise. */
function cycleNodes(p: {
  cx: number; cy: number; r: number; stages: string[]; clockwise?: boolean;
}): { a: number; x: number; y: number; text: string }[] {
  const n = p.stages.length;
  const dir = p.clockwise === false ? -1 : 1;
  return p.stages.map((text, i) => {
    const a = -Math.PI / 2 + dir * ((i * 2 * Math.PI) / n); // -90° = top; +y is down
    return { a, x: p.cx + p.r * Math.cos(a), y: p.cy + p.r * Math.sin(a), text };
  });
}

/** Box + arrow layout for a `flow_chain`. Boxes flow right (a row) or down (a
 *  column) from the top-left anchor, auto-sized to stay inside the canvas. */
function flowLayout(p: {
  x: number; y: number; steps: string[]; direction?: 'right' | 'down';
}): {
  boxes: { x: number; y: number; w: number; h: number; text: string }[];
  arrows: [number, number, number, number][];
} {
  const horiz = (p.direction ?? 'right') === 'right';
  const n = p.steps.length;
  const boxes: { x: number; y: number; w: number; h: number; text: string }[] = [];
  const arrows: [number, number, number, number][] = [];
  if (horiz) {
    const bh = 15;
    let gap = 7;
    let bw = Math.min(20, (Math.max(20, 96 - p.x) - (n - 1) * gap) / n);
    if (bw < 9) { gap = 4; bw = Math.min(20, (Math.max(20, 96 - p.x) - (n - 1) * gap) / n); }
    bw = Math.max(7, bw);
    for (let i = 0; i < n; i++) {
      const bx = p.x + i * (bw + gap);
      boxes.push({ x: bx, y: p.y, w: bw, h: bh, text: p.steps[i] });
      if (i < n - 1) arrows.push([bx + bw, p.y + bh / 2, bx + bw + gap, p.y + bh / 2]);
    }
  } else {
    const bw = 34;
    let gap = 7;
    let bh = Math.min(14, (Math.max(20, 96 - p.y) - (n - 1) * gap) / n);
    if (bh < 7) { gap = 4; bh = Math.min(14, (Math.max(20, 96 - p.y) - (n - 1) * gap) / n); }
    bh = Math.max(6, bh);
    for (let i = 0; i < n; i++) {
      const by = p.y + i * (bh + gap);
      boxes.push({ x: p.x, y: by, w: bw, h: bh, text: p.steps[i] });
      if (i < n - 1) arrows.push([p.x + bw / 2, by + bh, p.x + bw / 2, by + bh + gap]);
    }
  }
  return { boxes, arrows };
}

/** Beam-end + pan geometry for a `balance_scale`. The beam tips `tilt` degrees
 *  about the pivot (cx,cy); each pan hangs straight down from its beam end. */
function balanceGeom(p: { cx: number; cy: number; tilt?: number }): {
  lx: number; ly: number; rx: number; ry: number; hang: number; postBot: number;
} {
  const rad = ((p.tilt ?? 0) * Math.PI) / 180;
  const half = 26;
  return {
    lx: p.cx - half * Math.cos(rad),
    ly: p.cy - half * Math.sin(rad),
    rx: p.cx + half * Math.cos(rad),
    ry: p.cy + half * Math.sin(rad),
    hang: 15,
    postBot: p.cy + 30,
  };
}

/** Root + child box layout for a `tree_diagram`. Root centered at (x,y); children
 *  in a row below, auto-sized to stay inside the canvas. Shared by the renderer
 *  (boxes + connectors) and buildSketchPaths (the box labels). */
function treeLayout(p: { x: number; y: number; root: string; branches: string[] }): {
  root: { x: number; y: number; w: number; h: number };
  children: { x: number; y: number; w: number; h: number; text: string }[];
} {
  const n = p.branches.length;
  const rw = 26, rh = 12;
  const root = { x: p.x - rw / 2, y: p.y, w: rw, h: rh };
  let cw = 20, gap = 5;
  const total = n * cw + (n - 1) * gap;
  const maxW = 92;
  if (total > maxW) { const sc = maxW / total; cw *= sc; gap *= sc; }
  const startX = p.x - (n * cw + (n - 1) * gap) / 2;
  const childY = p.y + 26;
  const children = p.branches.map((text, i) => ({ x: startX + i * (cw + gap), y: childY, w: cw, h: 14, text }));
  return { root, children };
}

/** Cell + header geometry for a `matrix`. Reserves a top band for column headers
 *  and a left band for row headers when present. Shared by the renderer (cells)
 *  and buildSketchPaths (header + cell labels). */
function matrixGeom(p: {
  x: number; y: number; w: number; h: number; rows: number; cols: number;
  rowLabels?: string[]; colLabels?: string[];
}): { gx: number; gy: number; cw: number; ch: number; headT: number; headL: number } {
  const headT = p.colLabels && p.colLabels.length ? 10 : 0;
  const headL = p.rowLabels && p.rowLabels.length ? 16 : 0;
  const gx = p.x + headL, gy = p.y + headT;
  return { gx, gy, cw: (p.w - headL) / p.cols, ch: (p.h - headT) / p.rows, headT, headL };
}

/** Tier trapezoids for a `pyramid` (or funnel when flipped). Width grows toward
 *  the base (0 at the apex, w at the base); `flip` inverts it. Shared by the
 *  renderer (trapezoids) and buildSketchPaths (tier labels). */
function pyramidTiers(p: { x: number; y: number; w: number; h: number; tiers: string[]; flip?: boolean }): {
  cx: number; topY: number; botY: number; topW: number; botW: number; labelCy: number; text: string;
}[] {
  const n = p.tiers.length;
  const cx = p.x + p.w / 2;
  const widthAt = (v: number) => (p.flip ? p.w * (1 - v) : p.w * v); // v: 0 top → 1 bottom
  return p.tiers.map((text, i) => {
    const vTop = i / n, vBot = (i + 1) / n;
    const topY = p.y + p.h * vTop, botY = p.y + p.h * vBot;
    return { cx, topY, botY, topW: widthAt(vTop), botW: widthAt(vBot), labelCy: (topY + botY) / 2, text };
  });
}

/** The three circle centers of a `venn3`, arranged in a triangle around (cx,cy). */
function venn3Centers(p: { cx: number; cy: number; r: number }): { x: number; y: number }[] {
  const off = p.r * 0.62;
  return [
    { x: p.cx, y: p.cy - off },                    // top (A)
    { x: p.cx - off * 0.87, y: p.cy + off * 0.5 }, // lower-left (B)
    { x: p.cx + off * 0.87, y: p.cy + off * 0.5 }, // lower-right (C)
  ];
}

/** Input bar + proportional output bands + connecting ribbons for a `sankey`. */
function sankeyLayout(p: { x: number; y: number; w: number; h: number; flows: { value: number; label: string }[] }): {
  barW: number; inX2: number; outX1: number;
  bands: { label: string; inTop: number; inH: number; outTop: number; outH: number }[];
} {
  const total = p.flows.reduce((a, f) => a + Math.max(0, f.value), 0) || 1;
  const barW = 8;
  const n = p.flows.length;
  const gap = 3;
  const availH = Math.max(1, p.h - (n - 1) * gap);
  let inAcc = 0, outAcc = 0;
  const bands = p.flows.map((f) => {
    const frac = Math.max(0, f.value) / total;
    const inH = p.h * frac, outH = availH * frac;
    const b = { label: f.label, inTop: p.y + inAcc, inH, outTop: p.y + outAcc, outH };
    inAcc += inH; outAcc += outH + gap;
    return b;
  });
  return { barW, inX2: p.x + barW, outX1: p.x + p.w - barW, bands };
}

/** Rough paths for one `icon` glyph — a simple, recognizable object drawn within
 *  a box of height `size` centered at (x,y). Deterministic (fixed seed) so the
 *  doodler never hand-places these strokes. */
function iconPaths(
  gen: Gen, name: string, x: number, y: number, size: number,
  seed: number, stroke: string, sw: number, fillHex?: string,
): PathInfo[] {
  const s = size / 2;
  const out: PathInfo[] = [];
  // Icons are small — the default rough jitter (roughness 1.1) turns a 15px glyph
  // into a scribble, so draw them with a gentle, crisp hand-drawn wobble.
  const ROUGH = { roughness: 0.5, bowing: 0.35 };
  const base = { ...ROUGH, seed, stroke, strokeWidth: sw, ...(fillHex ? { fill: fillHex, fillStyle: 'solid' as const } : {}) };
  const solid = { ...ROUGH, seed, stroke, strokeWidth: sw, fill: stroke, fillStyle: 'solid' as const };
  const E = (cx: number, cy: number, rx: number, ry: number, o = base) => out.push(...gen.toPaths(gen.ellipse(cx, cy, rx * 2, ry * 2, o)));
  const L = (x1: number, y1: number, x2: number, y2: number, o = base) => out.push(...gen.toPaths(gen.line(x1, y1, x2, y2, o)));
  const P = (pts: [number, number][], o = base) => out.push(...gen.toPaths(gen.polygon(pts, o)));
  const R = (rx: number, ry: number, rw: number, rh: number, o = base) => out.push(...gen.toPaths(gen.rectangle(rx, ry, rw, rh, o)));
  const C = (pts: [number, number][], o = base) => out.push(...gen.toPaths(gen.curve([...pts, pts[0], pts[1], pts[2]], o))); // closed spline
  const OC = (pts: [number, number][], o = base) => out.push(...gen.toPaths(gen.curve(pts, o))); // open curve

  switch (name) {
    case 'sun':
      E(x, y, s * 0.46, s * 0.46);
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4;
        L(x + Math.cos(a) * s * 0.62, y + Math.sin(a) * s * 0.62, x + Math.cos(a) * s * 0.95, y + Math.sin(a) * s * 0.95);
      }
      break;
    case 'moon': {
      const Ro = s * 0.72, Ri = s * 0.42;
      const pts: [number, number][] = [];
      const n = 16;
      for (let k = 0; k <= n; k++) { const a = ((50 + 260 * (k / n)) * Math.PI) / 180; pts.push([x + Ro * Math.cos(a), y + Ro * Math.sin(a)]); }
      for (let k = n; k >= 0; k--) { const a = ((50 + 260 * (k / n)) * Math.PI) / 180; pts.push([x + Ri * Math.cos(a), y + Ri * Math.sin(a)]); }
      out.push(...gen.toPaths(gen.polygon(pts, base)));
      break;
    }
    case 'cloud':
      C([
        [x - 0.70 * s, y + 0.28 * s], [x - 0.72 * s, y - 0.02 * s], [x - 0.45 * s, y - 0.28 * s],
        [x - 0.15 * s, y - 0.12 * s], [x - 0.05 * s, y - 0.40 * s], [x + 0.28 * s, y - 0.32 * s],
        [x + 0.40 * s, y - 0.05 * s], [x + 0.68 * s, y - 0.02 * s], [x + 0.66 * s, y + 0.28 * s],
      ]);
      break;
    case 'raindrop':
      C([
        [x, y - 0.72 * s], [x + 0.34 * s, y - 0.10 * s], [x + 0.44 * s, y + 0.28 * s],
        [x + 0.20 * s, y + 0.60 * s], [x - 0.20 * s, y + 0.60 * s], [x - 0.44 * s, y + 0.28 * s],
        [x - 0.34 * s, y - 0.10 * s],
      ]);
      break;
    case 'flame':
      C([
        [x, y - 0.75 * s], [x + 0.28 * s, y - 0.20 * s], [x + 0.42 * s, y + 0.20 * s],
        [x + 0.22 * s, y + 0.58 * s], [x - 0.05 * s, y + 0.50 * s], [x - 0.30 * s, y + 0.55 * s],
        [x - 0.42 * s, y + 0.15 * s], [x - 0.18 * s, y - 0.15 * s],
      ]);
      break;
    case 'tree':
      E(x, y - 0.22 * s, s * 0.5, s * 0.4); // canopy (upper), clear of the trunk
      R(x - 0.09 * s, y + 0.16 * s, 0.18 * s, 0.52 * s); // trunk below
      break;
    case 'leaf':
      C([[x, y - 0.62 * s], [x + 0.34 * s, y - 0.05 * s], [x, y + 0.55 * s], [x - 0.34 * s, y - 0.05 * s]]);
      L(x, y - 0.62 * s, x, y + 0.55 * s);
      L(x, y + 0.55 * s, x, y + 0.72 * s);
      break;
    case 'mountain':
      P([[x - 0.72 * s, y + 0.45 * s], [x - 0.18 * s, y - 0.5 * s], [x + 0.02 * s, y - 0.12 * s], [x + 0.32 * s, y - 0.34 * s], [x + 0.72 * s, y + 0.45 * s]]);
      break;
    case 'star': {
      const pts: [number, number][] = [];
      for (let k = 0; k < 10; k++) {
        const a = ((-90 + k * 36) * Math.PI) / 180;
        const rr = k % 2 === 0 ? s * 0.62 : s * 0.28;
        pts.push([x + rr * Math.cos(a), y + rr * Math.sin(a)]);
      }
      P(pts);
      break;
    }
    case 'heart':
      C([
        [x, y + 0.6 * s], [x - 0.5 * s, y + 0.05 * s], [x - 0.52 * s, y - 0.28 * s], [x - 0.26 * s, y - 0.46 * s],
        [x, y - 0.24 * s], [x + 0.26 * s, y - 0.46 * s], [x + 0.52 * s, y - 0.28 * s], [x + 0.5 * s, y + 0.05 * s],
      ]);
      break;
    case 'house':
      R(x - 0.4 * s, y - 0.08 * s, 0.8 * s, 0.56 * s);
      P([[x - 0.5 * s, y - 0.08 * s], [x, y - 0.55 * s], [x + 0.5 * s, y - 0.08 * s]]);
      R(x - 0.1 * s, y + 0.16 * s, 0.2 * s, 0.32 * s);
      break;
    case 'book':
      R(x - 0.42 * s, y - 0.34 * s, 0.84 * s, 0.68 * s);
      L(x - 0.26 * s, y - 0.34 * s, x - 0.26 * s, y + 0.34 * s);
      L(x - 0.12 * s, y - 0.14 * s, x + 0.3 * s, y - 0.14 * s);
      L(x - 0.12 * s, y + 0.04 * s, x + 0.3 * s, y + 0.04 * s);
      break;
    case 'lightbulb':
      E(x, y - 0.2 * s, s * 0.4, s * 0.42); // bulb (upper), bottom near y+0.22s
      R(x - 0.15 * s, y + 0.22 * s, 0.3 * s, 0.18 * s); // screw base just below
      L(x - 0.13 * s, y + 0.3 * s, x + 0.13 * s, y + 0.3 * s);
      L(x - 0.11 * s, y + 0.37 * s, x + 0.11 * s, y + 0.37 * s);
      break;
    case 'gear': {
      E(x, y, s * 0.48, s * 0.48);
      const teeth = { ...base, strokeWidth: sw + 0.6 };
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4;
        L(x + Math.cos(a) * s * 0.48, y + Math.sin(a) * s * 0.48, x + Math.cos(a) * s * 0.66, y + Math.sin(a) * s * 0.66, teeth);
      }
      E(x, y, s * 0.15, s * 0.15, solid);
      break;
    }
    case 'coin':
      E(x, y, s * 0.52, s * 0.52);
      E(x, y, s * 0.4, s * 0.4);
      L(x, y - 0.2 * s, x, y + 0.2 * s);
      break;
    case 'magnet':
      OC([
        [x - 0.32 * s, y - 0.5 * s], [x - 0.32 * s, y + 0.1 * s], [x - 0.22 * s, y + 0.38 * s],
        [x, y + 0.48 * s], [x + 0.22 * s, y + 0.38 * s], [x + 0.32 * s, y + 0.1 * s], [x + 0.32 * s, y - 0.5 * s],
      ]);
      R(x - 0.42 * s, y - 0.52 * s, 0.2 * s, 0.14 * s);
      R(x + 0.22 * s, y - 0.52 * s, 0.2 * s, 0.14 * s);
      break;
    case 'bolt':
      P([
        [x + 0.12 * s, y - 0.62 * s], [x - 0.28 * s, y + 0.06 * s], [x - 0.02 * s, y + 0.06 * s],
        [x - 0.14 * s, y + 0.62 * s], [x + 0.3 * s, y - 0.14 * s], [x + 0.04 * s, y - 0.14 * s],
      ]);
      break;
    case 'clock':
      E(x, y, s * 0.55, s * 0.55);
      R(x - 0.05 * s, y - 0.64 * s, 0.1 * s, 0.1 * s);
      L(x, y, x - 0.02 * s, y - 0.3 * s);
      L(x, y, x + 0.34 * s, y - 0.02 * s);
      E(x, y, s * 0.05, s * 0.05, solid);
      break;
    default:
      break;
  }
  return out;
}

function primitivePaths(gen: Gen, p: SketchPrimitive, seed: number): PathInfo[] {
  const stroke = hex((p as { stroke?: SketchColor }).stroke);
  const fillTok = (p as { fill?: SketchColor }).fill;
  const sw = (p as { strokeWidth?: number }).strokeWidth ?? DEFAULT_SW;
  const opts = {
    ...ROUGH_OPTS,
    seed,
    stroke,
    strokeWidth: sw,
    // Solid fill (not hachure): on small objects like a ball, sparse hachure
    // renders as a messy cross/⊘. Solid reads as a clean filled object; the rough
    // OUTLINE still carries the hand-drawn feel. (2026-06-23 ear-test.)
    ...(fillTok ? { fill: SKETCH_COLORS[fillTok], fillStyle: 'solid' as const } : {}),
  };
  const xy = (pts: Pt[]): [number, number][] => pts.map((q) => [q.x, q.y]);

  switch (p.type) {
    case 'line':
      return gen.toPaths(gen.line(p.x1, p.y1, p.x2, p.y2, opts));
    case 'arrow': {
      const out = gen.toPaths(gen.line(p.x1, p.y1, p.x2, p.y2, opts));
      const ang = Math.atan2(p.y2 - p.y1, p.x2 - p.x1);
      const L = 4;
      const spread = 0.5;
      for (const s of [ang + Math.PI - spread, ang + Math.PI + spread]) {
        out.push(...gen.toPaths(gen.line(p.x2, p.y2, p.x2 + L * Math.cos(s), p.y2 + L * Math.sin(s), opts)));
      }
      return out;
    }
    case 'curve':
      return gen.toPaths(p.closed ? gen.polygon(xy(p.points), opts) : gen.curve(xy(p.points), opts));
    case 'polygon':
      return gen.toPaths(gen.polygon(xy(p.points), opts));
    case 'ellipse':
      return gen.toPaths(gen.ellipse(p.cx, p.cy, p.rx * 2, p.ry * 2, opts));
    case 'concentric': {
      // `count` rings of radius spacing·k. Each larger ring's center is shifted
      // BACK along `angle` by squeeze·r, so rings bunch ahead / spread behind —
      // the moving-source wavefront (Doppler) picture. squeeze 0 = even ripples.
      const squeeze = Math.min(0.9, Math.max(0, p.squeeze ?? 0));
      const rad = ((p.angle ?? 0) * Math.PI) / 180;
      const dx = Math.cos(rad);
      const dy = Math.sin(rad); // +y is down
      const out: ReturnType<Gen['toPaths']> = [];
      for (let k = 1; k <= p.count; k++) {
        const r = p.spacing * k;
        const ex = p.cx - dx * squeeze * r;
        const ey = p.cy - dy * squeeze * r;
        // per-ring seed so each ring reads as an independent hand-drawn stroke
        out.push(...gen.toPaths(gen.ellipse(ex, ey, r * 2, r * 2, { ...opts, seed: seed + k })));
      }
      return out;
    }
    case 'wave': {
      // Sample a transverse sine along (x1,y1)→(x2,y2). Perpendicular swing =
      // amplitude·sin(2π·cycles·t), tapered by damping toward the far end. Our
      // code places the crests, so the doodler never hand-draws a wobbly line.
      const dx = p.x2 - p.x1, dy = p.y2 - p.y1;
      const L = Math.hypot(dx, dy) || 1;
      const px = -dy / L, py = dx / L; // unit perpendicular
      const damp = Math.min(1, Math.max(0, p.damping ?? 0));
      const n = Math.max(16, Math.round(p.cycles * 12));
      const pts: [number, number][] = [];
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const s = p.amplitude * (1 - damp * t) * Math.sin(2 * Math.PI * p.cycles * t);
        pts.push([p.x1 + dx * t + px * s, p.y1 + dy * t + py * s]);
      }
      return gen.toPaths(gen.curve(pts, opts));
    }
    case 'spring': {
      // Zig-zag coil: straight leads at each end, then `coils` peaks alternating
      // ±width perpendicular to the axis. Drawn as one rough polyline.
      const dx = p.x2 - p.x1, dy = p.y2 - p.y1;
      const L = Math.hypot(dx, dy) || 1;
      const px = -dy / L, py = dx / L;
      const lead = 0.12;
      const at = (t: number, s: number): [number, number] => [
        p.x1 + dx * t + px * s,
        p.y1 + dy * t + py * s,
      ];
      const pts: [number, number][] = [at(0, 0), at(lead, 0)];
      const peaks = p.coils * 2;
      for (let k = 0; k < peaks; k++) {
        const t = lead + ((k + 0.5) / peaks) * (1 - 2 * lead);
        pts.push(at(t, k % 2 === 0 ? p.width : -p.width));
      }
      pts.push(at(1 - lead, 0), at(1, 0));
      return gen.toPaths(gen.linearPath(pts, opts));
    }
    case 'stick_figure': {
      // A simple, legible stick person: head circle + spine + two arms + two
      // legs, with pose-specific limb angles. Composed from rough line/ellipse.
      const H = p.scale;
      const cx = p.x;
      const topY = p.y - H / 2;
      const rh = H * 0.14; // head radius
      const headCy = topY + rh;
      const shoulderY = headCy + rh * 1.15;
      const hipY = shoulderY + H * 0.3;
      const footY = p.y + H / 2;
      const armLen = H * 0.3;
      const legSpread = H * 0.16;
      let larm: [number, number], rarm: [number, number];
      let lleg: [number, number], rleg: [number, number];
      let lean = 0;
      switch (p.pose ?? 'stand') {
        case 'walk':
          larm = [-armLen * 0.7, armLen * 0.7];
          rarm = [armLen * 0.7, armLen * 0.6];
          lleg = [-legSpread * 1.5, 0];
          rleg = [legSpread * 1.3, 0];
          break;
        case 'run':
          lean = H * 0.1;
          larm = [armLen * 0.85, -armLen * 0.1]; // front arm forward
          rarm = [-armLen * 0.85, armLen * 0.35]; // back arm swung back
          lleg = [legSpread * 1.9, -H * 0.04]; // front leg forward
          rleg = [-legSpread * 1.7, H * 0.02]; // back leg trailing
          break;
        case 'point':
          larm = [-armLen * 0.5, armLen * 0.6];
          rarm = [armLen * 1.15, -armLen * 0.1]; // arm out, pointing right
          lleg = [-legSpread, 0];
          rleg = [legSpread, 0];
          break;
        case 'arms-up':
          larm = [-armLen * 0.7, -armLen * 0.95];
          rarm = [armLen * 0.7, -armLen * 0.95];
          lleg = [-legSpread, 0];
          rleg = [legSpread, 0];
          break;
        case 'stand':
        default:
          larm = [-armLen * 0.75, armLen * 0.55];
          rarm = [armLen * 0.75, armLen * 0.55];
          lleg = [-legSpread, 0];
          rleg = [legSpread, 0];
      }
      const headX = cx + lean;
      const shX = (headX + cx) / 2;
      const out: ReturnType<Gen['toPaths']> = [];
      out.push(...gen.toPaths(gen.ellipse(headX, headCy, rh * 2, rh * 2, opts)));
      out.push(...gen.toPaths(gen.line(headX, shoulderY, cx, hipY, opts))); // spine
      out.push(...gen.toPaths(gen.line(shX, shoulderY, shX + larm[0], shoulderY + larm[1], opts)));
      out.push(...gen.toPaths(gen.line(shX, shoulderY, shX + rarm[0], shoulderY + rarm[1], opts)));
      out.push(...gen.toPaths(gen.line(cx, hipY, cx + lleg[0], footY + lleg[1], opts)));
      out.push(...gen.toPaths(gen.line(cx, hipY, cx + rleg[0], footY + rleg[1], opts)));
      return out;
    }
    case 'container_fill': {
      // Container outline + liquid filled from the bottom to fillFrac. The
      // liquid gets its own solid-fill color; the outline is stroke-only.
      const shape = p.shape ?? 'tank';
      const frac = Math.min(1, Math.max(0, p.fillFrac));
      const liquidTok = p.fillColor ?? (shape === 'battery' ? 'green' : shape === 'thermometer' ? 'red' : 'blue');
      const liquid = SKETCH_COLORS[liquidTok];
      const outlineOpts = { ...ROUGH_OPTS, seed, stroke, strokeWidth: sw };
      const liqOpts = {
        ...ROUGH_OPTS,
        seed: seed + 7,
        stroke: liquid,
        strokeWidth: 0.6,
        fill: liquid,
        fillStyle: 'solid' as const,
      };
      const out: ReturnType<Gen['toPaths']> = [];
      const { x, y, w, h } = p;

      if (shape === 'thermometer') {
        const cxt = x + w / 2;
        const bulbR = Math.min(w / 2, h * 0.17);
        const bulbCy = y + h - bulbR;
        const tubeW = bulbR * 0.9;
        const tubeTop = y + bulbR * 0.4;
        const tubeBot = bulbCy;
        // liquid first (under the outline): full bulb + tube up to frac
        out.push(...gen.toPaths(gen.ellipse(cxt, bulbCy, bulbR * 1.7, bulbR * 1.7, liqOpts)));
        const liqTop = tubeBot - (tubeBot - tubeTop) * frac;
        if (tubeBot - liqTop > 0.5)
          out.push(...gen.toPaths(gen.rectangle(cxt - tubeW * 0.35, liqTop, tubeW * 0.7, tubeBot - liqTop, liqOpts)));
        // outline: tube + bulb
        out.push(...gen.toPaths(gen.rectangle(cxt - tubeW / 2, tubeTop, tubeW, tubeBot - tubeTop, outlineOpts)));
        out.push(...gen.toPaths(gen.ellipse(cxt, bulbCy, bulbR * 2, bulbR * 2, outlineOpts)));
        return out;
      }

      // rect-bodied shapes (tank / beaker / battery)
      const inset = Math.min(w, h) * 0.07;
      const liqH = (h - inset) * frac;
      if (liqH > 0.5)
        out.push(...gen.toPaths(gen.rectangle(x + inset, y + h - inset - liqH, w - 2 * inset, liqH, liqOpts)));
      out.push(...gen.toPaths(gen.rectangle(x, y, w, h, outlineOpts)));
      if (shape === 'beaker') {
        // a pour spout on the top-left rim
        out.push(...gen.toPaths(gen.line(x, y, x - w * 0.1, y - h * 0.06, outlineOpts)));
        out.push(...gen.toPaths(gen.line(x - w * 0.1, y - h * 0.06, x + w * 0.12, y, outlineOpts)));
      } else if (shape === 'battery') {
        // a terminal nub centered on the top
        const nw = w * 0.28, nh = h * 0.08;
        out.push(...gen.toPaths(gen.rectangle(x + w / 2 - nw / 2, y - nh, nw, nh, outlineOpts)));
      }
      return out;
    }
    case 'vector': {
      // A styled arrow. `single` open head; `double` heads both ends; `block`
      // solid filled head; `curved` an arc arrow bulging to one side (rotation).
      const style = p.style ?? 'single';
      const out: ReturnType<Gen['toPaths']> = [];
      // open V-head at (tx,ty) pointing along `ang`
      const openHead = (tx: number, ty: number, ang: number) => {
        const L = 5, spread = 0.5;
        for (const s of [ang + Math.PI - spread, ang + Math.PI + spread])
          out.push(...gen.toPaths(gen.line(tx, ty, tx + L * Math.cos(s), ty + L * Math.sin(s), opts)));
      };
      if (style === 'curved') {
        // quadratic arc A→B bulging by the perpendicular; head at B along the tangent
        const dx = p.x2 - p.x1, dy = p.y2 - p.y1;
        const L = Math.hypot(dx, dy) || 1;
        const px = -dy / L, py = dx / L;
        const bulge = L * 0.4;
        const mx = (p.x1 + p.x2) / 2 + px * bulge, my = (p.y1 + p.y2) / 2 + py * bulge;
        const pts: [number, number][] = [];
        const n = 14;
        for (let i = 0; i <= n; i++) {
          const t = i / n, u = 1 - t;
          pts.push([
            u * u * p.x1 + 2 * u * t * mx + t * t * p.x2,
            u * u * p.y1 + 2 * u * t * my + t * t * p.y2,
          ]);
        }
        out.push(...gen.toPaths(gen.curve(pts, opts)));
        const prev = pts[pts.length - 2];
        openHead(p.x2, p.y2, Math.atan2(p.y2 - prev[1], p.x2 - prev[0]));
        return out;
      }
      out.push(...gen.toPaths(gen.line(p.x1, p.y1, p.x2, p.y2, opts)));
      const ang = Math.atan2(p.y2 - p.y1, p.x2 - p.x1);
      if (style === 'block') {
        const L = 5.5, spread = 0.42;
        const tri: [number, number][] = [
          [p.x2, p.y2],
          [p.x2 + L * Math.cos(ang + Math.PI - spread), p.y2 + L * Math.sin(ang + Math.PI - spread)],
          [p.x2 + L * Math.cos(ang + Math.PI + spread), p.y2 + L * Math.sin(ang + Math.PI + spread)],
        ];
        out.push(...gen.toPaths(gen.polygon(tri, { ...opts, fill: stroke, fillStyle: 'solid' })));
      } else {
        openHead(p.x2, p.y2, ang);
        if (style === 'double') openHead(p.x1, p.y1, ang + Math.PI); // head at the tail too
      }
      return out;
    }
    case 'grid': {
      // A regular cols×rows grid. `lines` = continuous rules; `dots` = a dot at
      // each intersection; `boxes` = each cell its own rough rectangle. fillCount
      // drops a filled counter dot into the first N cells (a ten-frame, an array).
      const gstyle = p.style ?? 'lines';
      const gw = p.cols * p.cell, gh = p.rows * p.cell;
      // The grid STRUCTURE is stroke-only; the `fill` token tints ONLY the
      // fillCount counter dots (otherwise every cell would flood with fill).
      const structOpts = { ...ROUGH_OPTS, seed, stroke, strokeWidth: sw };
      const out: ReturnType<Gen['toPaths']> = [];
      if (gstyle === 'dots') {
        for (let r = 0; r <= p.rows; r++)
          for (let c = 0; c <= p.cols; c++)
            out.push(...gen.toPaths(gen.ellipse(p.x + c * p.cell, p.y + r * p.cell, 1.4, 1.4, { ...structOpts, fill: stroke, fillStyle: 'solid' })));
      } else if (gstyle === 'boxes') {
        for (let r = 0; r < p.rows; r++)
          for (let c = 0; c < p.cols; c++)
            out.push(...gen.toPaths(gen.rectangle(p.x + c * p.cell, p.y + r * p.cell, p.cell, p.cell, { ...structOpts, seed: seed + r * p.cols + c })));
      } else {
        for (let c = 0; c <= p.cols; c++)
          out.push(...gen.toPaths(gen.line(p.x + c * p.cell, p.y, p.x + c * p.cell, p.y + gh, structOpts)));
        for (let r = 0; r <= p.rows; r++)
          out.push(...gen.toPaths(gen.line(p.x, p.y + r * p.cell, p.x + gw, p.y + r * p.cell, structOpts)));
      }
      const fillN = Math.min(p.fillCount ?? 0, p.cols * p.rows);
      if (fillN > 0) {
        const cr = p.cell * 0.32;
        const dotColor = fillTok ? SKETCH_COLORS[fillTok] : stroke;
        for (let k = 0; k < fillN; k++) {
          const cc = k % p.cols, rr = Math.floor(k / p.cols);
          const dxc = p.x + (cc + 0.5) * p.cell, dyc = p.y + (rr + 0.5) * p.cell;
          out.push(...gen.toPaths(gen.ellipse(dxc, dyc, cr * 2, cr * 2, { ...opts, seed: seed + 100 + k, fill: dotColor, fillStyle: 'solid', stroke: dotColor })));
        }
      }
      return out;
    }
    case 'brace': {
      // One rough curve through the brace silhouette (central nib = the brace).
      const { pts } = braceGeom(p);
      return gen.toPaths(gen.curve(pts, opts));
    }
    case 'arc': {
      // Sample an open arc from startAngle→endAngle (degrees, +y down). Sampling
      // (vs rough.arc) is robust to angle order / wrap and reads hand-drawn.
      const s = (p.startAngle * Math.PI) / 180;
      let e = (p.endAngle * Math.PI) / 180;
      if (e <= s) e += 2 * Math.PI;
      const n = Math.max(8, Math.round((Math.abs(e - s) / Math.PI) * 16));
      const pts: [number, number][] = [];
      for (let i = 0; i <= n; i++) {
        const a = s + ((e - s) * i) / n;
        pts.push([p.cx + p.r * Math.cos(a), p.cy + p.r * Math.sin(a)]);
      }
      return gen.toPaths(gen.curve(pts, opts));
    }
    case 'blob': {
      // Organic closed loop: an ellipse whose per-vertex radius is jittered by
      // `wobble`. Filled → rough polygon (a solid cloud/gas puff); unfilled →
      // a smooth closed spline (a cloud/region outline).
      const wob = Math.min(0.6, Math.max(0, p.wobble ?? 0.3));
      const rand = rng(seed * 131 + 7);
      const n = 14;
      const pts: [number, number][] = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 2 * Math.PI;
        const f = 1 + wob * (rand() * 2 - 1);
        pts.push([p.cx + p.rx * f * Math.cos(a), p.cy + p.ry * f * Math.sin(a)]);
      }
      if (fillTok) return gen.toPaths(gen.polygon(pts, opts));
      return gen.toPaths(gen.curve([...pts, pts[0], pts[1], pts[2]], opts)); // wrap to close the spline
    }
    case 'dots_cluster': {
      // `count` small filled dots scattered uniformly within `spread` of center.
      const rand = rng(seed * 97 + 13);
      const dotColor = fillTok ? SKETCH_COLORS[fillTok] : stroke;
      const dotR = 1.3;
      const out: ReturnType<Gen['toPaths']> = [];
      for (let k = 0; k < p.count; k++) {
        const a = rand() * 2 * Math.PI;
        const rr = Math.sqrt(rand()) * p.spread; // sqrt → uniform over the disc
        out.push(...gen.toPaths(gen.ellipse(
          p.cx + rr * Math.cos(a), p.cy + rr * Math.sin(a), dotR * 2, dotR * 2,
          { ...opts, seed: seed + k, fill: dotColor, fillStyle: 'solid', stroke: dotColor },
        )));
      }
      return out;
    }
    case 'pulley': {
      // A wheel (rim + hub) with a rope draped over the TOP, hanging straight
      // down each side. The rope sits just outside the rim so it reads as draped
      // over the wheel rather than merged into it.
      const r = p.r;
      const dir = p.ropeDir ?? 'both';
      const outlineOpts = { ...ROUGH_OPTS, seed, stroke, strokeWidth: sw };
      const out: ReturnType<Gen['toPaths']> = [];
      // rim + hub
      out.push(...gen.toPaths(gen.ellipse(p.cx, p.cy, r * 2, r * 2, outlineOpts)));
      out.push(...gen.toPaths(gen.ellipse(p.cx, p.cy, r * 0.5, r * 0.5, { ...outlineOpts, fill: stroke, fillStyle: 'solid', seed: seed + 3 })));
      // rope: an arc over the top from the left tangent to the right tangent
      const rr = r + 1.4;
      const hang = Math.max(r * 1.9, 12);
      const arcPts: [number, number][] = [];
      const n = 16;
      for (let i = 0; i <= n; i++) {
        const a = Math.PI + (Math.PI * i) / n; // 180°→360°, over the top (+y down)
        arcPts.push([p.cx + rr * Math.cos(a), p.cy + rr * Math.sin(a)]);
      }
      const ropeOpts = { ...outlineOpts, seed: seed + 5 };
      out.push(...gen.toPaths(gen.curve(arcPts, ropeOpts)));
      if (dir === 'both' || dir === 'left')
        out.push(...gen.toPaths(gen.line(p.cx - rr, p.cy, p.cx - rr, p.cy + hang, ropeOpts)));
      if (dir === 'both' || dir === 'right')
        out.push(...gen.toPaths(gen.line(p.cx + rr, p.cy, p.cx + rr, p.cy + hang, ropeOpts)));
      return out;
    }
    case 'lever': {
      // A straight beam centered at (x,y), rotated by `tilt` about the fulcrum,
      // which sits at `pivotFrac` along the beam. A triangular fulcrum (apex at
      // the pivot) supports it from below.
      const half = p.length / 2;
      const pivotX = p.x + (p.pivotFrac - 0.5) * p.length;
      const pivotY = p.y;
      const rad = ((p.tilt ?? 0) * Math.PI) / 180;
      const cos = Math.cos(rad), sin = Math.sin(rad);
      const rot = (px: number, py: number): [number, number] => {
        const dx = px - pivotX, dy = py - pivotY;
        return [pivotX + dx * cos - dy * sin, pivotY + dx * sin + dy * cos];
      };
      const left = rot(p.x - half, p.y);
      const right = rot(p.x + half, p.y);
      const out: ReturnType<Gen['toPaths']> = [];
      out.push(...gen.toPaths(gen.line(left[0], left[1], right[0], right[1], opts)));
      const fh = Math.max(p.length * 0.16, 8);
      const fw = fh * 0.7;
      const tri: [number, number][] = [
        [pivotX, pivotY],
        [pivotX - fw, pivotY + fh],
        [pivotX + fw, pivotY + fh],
      ];
      out.push(...gen.toPaths(gen.polygon(tri, { ...opts, seed: seed + 4 })));
      return out;
    }
    case 'gauge': {
      // A semicircular dial (top half), a straight base, evenly spaced ticks and
      // a needle from the hub to `frac` across the left→right sweep.
      const r = p.r;
      const ang = (f: number) => Math.PI + Math.PI * f; // 180°(left)→360°(right), over the top
      const out: ReturnType<Gen['toPaths']> = [];
      const arcPts: [number, number][] = [];
      const n = 20;
      for (let i = 0; i <= n; i++) {
        const a = ang(i / n);
        arcPts.push([p.cx + r * Math.cos(a), p.cy + r * Math.sin(a)]);
      }
      out.push(...gen.toPaths(gen.curve(arcPts, opts)));
      out.push(...gen.toPaths(gen.line(p.cx - r, p.cy, p.cx + r, p.cy, opts)));
      const ticks = 5;
      for (let i = 0; i <= ticks; i++) {
        const a = ang(i / ticks);
        const c = Math.cos(a), s = Math.sin(a);
        out.push(...gen.toPaths(gen.line(
          p.cx + r * 0.82 * c, p.cy + r * 0.82 * s, p.cx + r * c, p.cy + r * s,
          { ...opts, seed: seed + 10 + i },
        )));
      }
      const na = ang(Math.min(1, Math.max(0, p.frac)));
      out.push(...gen.toPaths(gen.line(
        p.cx, p.cy, p.cx + r * 0.72 * Math.cos(na), p.cy + r * 0.72 * Math.sin(na),
        { ...opts, seed: seed + 2, strokeWidth: sw + 0.4 },
      )));
      out.push(...gen.toPaths(gen.ellipse(p.cx, p.cy, r * 0.16, r * 0.16, { ...opts, fill: stroke, fillStyle: 'solid', seed: seed + 6 })));
      return out;
    }
    case 'axis': {
      // A straight axis with `ticks` evenly spaced perpendicular tick marks. The
      // optional `labels` ride under successive ticks (placed in buildSketchPaths).
      const dx = p.x2 - p.x1, dy = p.y2 - p.y1;
      const L = Math.hypot(dx, dy) || 1;
      let px = -dy / L, py = dx / L; // unit perpendicular
      if (py < 0) { px = -px; py = -py; } // point toward the label (down) side
      const out: ReturnType<Gen['toPaths']> = [];
      out.push(...gen.toPaths(gen.line(p.x1, p.y1, p.x2, p.y2, opts)));
      const nt = p.ticks ?? 0;
      const tickLen = 2.6;
      if (nt >= 2) {
        for (let i = 0; i < nt; i++) {
          const t = i / (nt - 1);
          const tx = p.x1 + dx * t, ty = p.y1 + dy * t;
          out.push(...gen.toPaths(gen.line(
            tx - px * tickLen, ty - py * tickLen, tx + px * tickLen, ty + py * tickLen,
            { ...opts, seed: seed + 20 + i },
          )));
        }
      }
      return out;
    }
    case 'coordinate_grid': {
      // A coordinate plane: faint gridlines, darker axes through the origin with
      // arrowheads. quadrants 4 → origin centered; 1 → origin at bottom-left.
      const { x, y, w, h } = p;
      const quad = p.quadrants ?? 4;
      const divs = 8;
      const gridOpts = { ...ROUGH_OPTS, roughness: 0.6, bowing: 0.4, seed, stroke: SKETCH_COLORS.gray, strokeWidth: 0.4 };
      const axisOpts = { ...ROUGH_OPTS, seed: seed + 1, stroke, strokeWidth: sw };
      const out: ReturnType<Gen['toPaths']> = [];
      for (let i = 0; i <= divs; i++) {
        const gx = x + (w * i) / divs;
        out.push(...gen.toPaths(gen.line(gx, y, gx, y + h, gridOpts)));
        const gy = y + (h * i) / divs;
        out.push(...gen.toPaths(gen.line(x, gy, x + w, gy, gridOpts)));
      }
      const ox = quad === 1 ? x : x + w / 2; // origin x
      const oy = quad === 1 ? y + h : y + h / 2; // origin y (+y down)
      out.push(...gen.toPaths(gen.line(x, oy, x + w, oy, axisOpts))); // x-axis
      out.push(...gen.toPaths(gen.line(ox, y, ox, y + h, axisOpts))); // y-axis
      const head = (tx: number, ty: number, ang: number) => {
        const L = 3.5, spread = 0.5;
        for (const s of [ang + Math.PI - spread, ang + Math.PI + spread])
          out.push(...gen.toPaths(gen.line(tx, ty, tx + L * Math.cos(s), ty + L * Math.sin(s), axisOpts)));
      };
      head(x + w, oy, 0); // x-axis points right
      head(ox, y, -Math.PI / 2); // y-axis points up
      if (quad === 4) {
        head(x, oy, Math.PI); // x-axis also points left
        head(ox, y + h, Math.PI / 2); // y-axis also points down
      }
      return out;
    }
    case 'orbit': {
      // A central filled body, an elliptical orbit path, and a satellite dot at
      // `angle`. The orbit line is thin; the two bodies are solid filled dots.
      const out: ReturnType<Gen['toPaths']> = [];
      out.push(...gen.toPaths(gen.ellipse(p.cx, p.cy, p.rx * 2, p.ry * 2, {
        ...ROUGH_OPTS, roughness: 0.8, seed, stroke, strokeWidth: Math.min(sw, 0.9),
      })));
      const bodyR = Math.max(2.5, Math.min(p.rx, p.ry) * 0.22);
      const bodyColor = fillTok ? SKETCH_COLORS[fillTok] : SKETCH_COLORS.amber; // sun by default
      out.push(...gen.toPaths(gen.ellipse(p.cx, p.cy, bodyR * 2, bodyR * 2, {
        ...opts, seed: seed + 2, fill: bodyColor, fillStyle: 'solid', stroke: bodyColor,
      })));
      const a = ((p.angle ?? 0) * Math.PI) / 180;
      const sx = p.cx + p.rx * Math.cos(a), sy = p.cy + p.ry * Math.sin(a);
      out.push(...gen.toPaths(gen.ellipse(sx, sy, 5, 5, {
        ...opts, seed: seed + 3, fill: stroke, fillStyle: 'solid', stroke,
      })));
      return out;
    }
    case 'molecule': {
      // Ball-and-stick: bonds (single/double/triple lines) UNDER outlined atom
      // circles, so the element letters (placed in buildSketchPaths) read on top.
      const out: ReturnType<Gen['toPaths']> = [];
      const atomR = 4.5;
      p.bonds.forEach((b, bi) => {
        const A = p.atoms[b.a], B = p.atoms[b.b];
        if (!A || !B) return;
        const dx = B.x - A.x, dy = B.y - A.y;
        const L = Math.hypot(dx, dy) || 1;
        const ux = dx / L, uy = dy / L; // along the bond
        const px = -uy, py = ux; // perpendicular (for double/triple offsets)
        // shorten so the bond meets the atom rims, not their centers
        const ax = A.x + ux * atomR, ay = A.y + uy * atomR;
        const bx = B.x - ux * atomR, by = B.y - uy * atomR;
        const order = b.order ?? 1;
        const offs = order >= 3 ? [-1.8, 0, 1.8] : order === 2 ? [-1.3, 1.3] : [0];
        for (const o of offs)
          out.push(...gen.toPaths(gen.line(ax + px * o, ay + py * o, bx + px * o, by + py * o, { ...opts, seed: seed + 30 + bi })));
      });
      p.atoms.forEach((a, ai) => {
        out.push(...gen.toPaths(gen.ellipse(a.x, a.y, atomR * 2, atomR * 2, {
          ...opts, seed: seed + 60 + ai, fill: SKETCH_COLORS.gray, fillStyle: 'solid',
        })));
      });
      return out;
    }
    case 'bar_compare': {
      // A mini bar chart: a baseline + one solid bar per value, heights scaled to
      // the tallest value. Labels (if any) are placed under each bar in build.
      const { x, y, w, h } = p;
      const vals = p.values;
      const n = vals.length;
      const maxV = Math.max(...vals, 1e-6);
      const gap = w * 0.06;
      const barW = Math.max(1, (w - gap * (n + 1)) / n);
      const baseY = y + h;
      const barColor = fillTok ? SKETCH_COLORS[fillTok] : SKETCH_COLORS.blue;
      const out: ReturnType<Gen['toPaths']> = [];
      out.push(...gen.toPaths(gen.line(x, baseY, x + w, baseY, { ...ROUGH_OPTS, seed, stroke, strokeWidth: sw })));
      vals.forEach((v, i) => {
        const bh = (Math.max(0, v) / maxV) * h;
        if (bh <= 0.5) return;
        const bx = x + gap + i * (barW + gap);
        out.push(...gen.toPaths(gen.rectangle(bx, baseY - bh, barW, bh, {
          ...opts, seed: seed + 10 + i, fill: barColor, fillStyle: 'solid', stroke,
        })));
      });
      return out;
    }
    case 'cycle': {
      // Stage nodes evenly spaced around the ring, joined by curved arrows going
      // around (clockwise by default). Each arc arrow leaves a small gap near the
      // nodes so it doesn't collide with the node dot or its label.
      const nodes = cycleNodes(p);
      const n = nodes.length;
      const dir = p.clockwise === false ? -1 : 1;
      const out: PathInfo[] = [];
      const gap = 0.34; // radians of clearance near each node
      for (let i = 0; i < n; i++) {
        const a0 = nodes[i].a + dir * gap;
        const a1 = nodes[(i + 1) % n].a - dir * gap;
        let span = (a1 - a0) * dir;
        span = ((span % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); // positive span in `dir`
        const steps = 12;
        const pts: [number, number][] = [];
        for (let k = 0; k <= steps; k++) {
          const a = a0 + dir * span * (k / steps);
          pts.push([p.cx + p.r * Math.cos(a), p.cy + p.r * Math.sin(a)]);
        }
        out.push(...gen.toPaths(gen.curve(pts, { ...opts, seed: seed + i })));
        const end = pts[pts.length - 1], prev = pts[pts.length - 2];
        const ang = Math.atan2(end[1] - prev[1], end[0] - prev[0]);
        const L = 4, spr = 0.5;
        for (const sg of [ang + Math.PI - spr, ang + Math.PI + spr])
          out.push(...gen.toPaths(gen.line(end[0], end[1], end[0] + L * Math.cos(sg), end[1] + L * Math.sin(sg), { ...opts, seed: seed + i })));
      }
      // clean, low-roughness node dots (a solid dot at full roughness reads as a blob)
      for (let i = 0; i < n; i++)
        out.push(...gen.toPaths(gen.ellipse(nodes[i].x, nodes[i].y, 5.4, 5.4, {
          roughness: 0.4, bowing: 0.3, seed: seed + 40 + i, stroke, strokeWidth: sw, fill: stroke, fillStyle: 'solid',
        })));
      return out;
    }
    case 'flow_chain': {
      // Ordered boxes joined by arrows, flowing right (a row) or down (a column).
      const { boxes, arrows } = flowLayout(p);
      const out: PathInfo[] = [];
      boxes.forEach((b, i) => out.push(...gen.toPaths(gen.rectangle(b.x, b.y, b.w, b.h, { ...opts, seed: seed + i }))));
      arrows.forEach((a, i) => {
        out.push(...gen.toPaths(gen.line(a[0], a[1], a[2], a[3], { ...opts, seed: seed + 20 + i })));
        const ang = Math.atan2(a[3] - a[1], a[2] - a[0]);
        const L = 3.2, spr = 0.5;
        for (const sg of [ang + Math.PI - spr, ang + Math.PI + spr])
          out.push(...gen.toPaths(gen.line(a[2], a[3], a[2] + L * Math.cos(sg), a[3] + L * Math.sin(sg), { ...opts, seed: seed + 20 + i })));
      });
      return out;
    }
    case 'balance_scale': {
      // A post on a base, a beam tipped `tilt` about the pivot (cx,cy), and a pan
      // hanging straight down from each beam end (pans stay level as the beam tips).
      const { cx, cy } = p;
      const g = balanceGeom(p);
      const out: PathInfo[] = [];
      out.push(...gen.toPaths(gen.line(cx, cy, cx, g.postBot, { ...opts, seed })));
      out.push(...gen.toPaths(gen.line(cx - 13, g.postBot, cx + 13, g.postBot, { ...opts, seed: seed + 1 })));
      out.push(...gen.toPaths(gen.polygon([[cx, cy], [cx - 4, cy + 7], [cx + 4, cy + 7]], { ...opts, seed: seed + 2 }))); // fulcrum
      out.push(...gen.toPaths(gen.line(g.lx, g.ly, g.rx, g.ry, { ...opts, seed: seed + 3, strokeWidth: sw + 0.3 }))); // beam
      const pan = (ex: number, ey: number, k: number) => {
        const by = ey + g.hang;
        out.push(...gen.toPaths(gen.line(ex, ey, ex - 7, by, { ...opts, seed: seed + 10 + k })));
        out.push(...gen.toPaths(gen.line(ex, ey, ex + 7, by, { ...opts, seed: seed + 11 + k })));
        const pts: [number, number][] = [];
        for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([ex - 9 + 18 * t, by + 4 * Math.sin(Math.PI * t)]); }
        out.push(...gen.toPaths(gen.curve(pts, { ...opts, seed: seed + 12 + k })));
      };
      pan(g.lx, g.ly, 0);
      pan(g.rx, g.ry, 20);
      return out;
    }
    case 'icon': {
      const fillHex = fillTok ? SKETCH_COLORS[fillTok] : undefined;
      return iconPaths(gen, p.name, p.x, p.y, p.size, seed, stroke, sw, fillHex);
    }
    case 'part_whole': {
      // A circle cut into `parts` equal wedges (spokes from the center), the first
      // `filled` shaded. Low roughness keeps the spokes + rim crisp.
      const { cx, cy, r, parts } = p;
      const filled = Math.min(parts, Math.max(0, p.filled ?? 0));
      const wedgeColor = fillTok ? SKETCH_COLORS[fillTok] : SKETCH_COLORS.blue;
      const start = -Math.PI / 2; // first wedge starts at the top
      const step = (2 * Math.PI) / parts;
      const out: PathInfo[] = [];
      for (let k = 0; k < filled; k++) {
        const a0 = start + k * step, a1 = start + (k + 1) * step;
        const pts: [number, number][] = [[cx, cy]];
        const seg = 8;
        for (let j = 0; j <= seg; j++) { const a = a0 + (a1 - a0) * (j / seg); pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
        out.push(...gen.toPaths(gen.polygon(pts, { roughness: 0.5, bowing: 0.4, seed: seed + k, stroke: wedgeColor, strokeWidth: 0.5, fill: wedgeColor, fillStyle: 'solid' })));
      }
      out.push(...gen.toPaths(gen.ellipse(cx, cy, r * 2, r * 2, { roughness: 0.5, bowing: 0.4, seed, stroke, strokeWidth: sw })));
      for (let k = 0; k < parts; k++) {
        const a = start + k * step;
        out.push(...gen.toPaths(gen.line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a), { roughness: 0.5, bowing: 0.3, seed: seed + 30 + k, stroke, strokeWidth: sw * 0.8 })));
      }
      return out;
    }
    case 'tree_diagram': {
      // Root box on top, child boxes in a row below, connectors between.
      const { root, children } = treeLayout(p);
      const rootBX = root.x + root.w / 2, rootBY = root.y + root.h;
      const out: PathInfo[] = [];
      children.forEach((c, i) => out.push(...gen.toPaths(gen.line(rootBX, rootBY, c.x + c.w / 2, c.y, { ...opts, seed: seed + 10 + i, strokeWidth: sw * 0.8 }))));
      out.push(...gen.toPaths(gen.rectangle(root.x, root.y, root.w, root.h, { ...opts, seed })));
      children.forEach((c, i) => out.push(...gen.toPaths(gen.rectangle(c.x, c.y, c.w, c.h, { ...opts, seed: seed + 20 + i }))));
      return out;
    }
    case 'network': {
      // Edges (rim-to-rim lines) under labelled node circles.
      const nodeR = 7;
      const out: PathInfo[] = [];
      p.edges.forEach((e, ei) => {
        const A = p.nodes[e.a], B = p.nodes[e.b];
        if (!A || !B) return;
        const dx = B.x - A.x, dy = B.y - A.y; const L = Math.hypot(dx, dy) || 1; const ux = dx / L, uy = dy / L;
        out.push(...gen.toPaths(gen.line(A.x + ux * nodeR, A.y + uy * nodeR, B.x - ux * nodeR, B.y - uy * nodeR, { ...opts, seed: seed + ei })));
      });
      p.nodes.forEach((nd, ni) => {
        out.push(...gen.toPaths(gen.ellipse(nd.x, nd.y, nodeR * 2, nodeR * 2, {
          roughness: 0.5, bowing: 0.4, seed: seed + 30 + ni, stroke, strokeWidth: sw,
          ...(fillTok ? { fill: SKETCH_COLORS[fillTok], fillStyle: 'solid' as const } : {}),
        })));
      });
      return out;
    }
    case 'speech_bubble': {
      // A rounded box + a triangular tail pointing at (tailX,tailY).
      const { x, y, w, h } = p;
      const out: PathInfo[] = [];
      out.push(...gen.toPaths(gen.rectangle(x, y, w, h, { ...opts, seed })));
      const tx = p.tailX ?? (x + w * 0.28);
      const ty = p.tailY ?? (y + h + 14);
      const baseX = Math.min(x + w * 0.72, Math.max(x + w * 0.1, tx));
      out.push(...gen.toPaths(gen.polygon([[baseX - 4, y + h], [baseX + 5, y + h], [tx, ty]], { ...opts, seed: seed + 1 })));
      return out;
    }
    case 'timeline': {
      // A line with an arrowhead, event dots at fractional positions, and a short
      // connector to each label (labels alternate above/below in buildSketchPaths).
      const { x1, y1, x2, y2 } = p;
      const dx = x2 - x1, dy = y2 - y1; const L = Math.hypot(dx, dy) || 1;
      const ux = dx / L, uy = dy / L; const px = -uy, py = ux;
      const out: PathInfo[] = [];
      out.push(...gen.toPaths(gen.line(x1, y1, x2, y2, { ...opts, seed })));
      const ang = Math.atan2(dy, dx); const AL = 4, spr = 0.5;
      for (const sg of [ang + Math.PI - spr, ang + Math.PI + spr]) out.push(...gen.toPaths(gen.line(x2, y2, x2 + AL * Math.cos(sg), y2 + AL * Math.sin(sg), { ...opts, seed })));
      p.events.forEach((e, ei) => {
        const ex = x1 + dx * e.at, ey = y1 + dy * e.at;
        const side = ei % 2 === 0 ? -1 : 1;
        out.push(...gen.toPaths(gen.line(ex, ey, ex + px * side * 6, ey + py * side * 6, { ...opts, seed: seed + 20 + ei, strokeWidth: sw * 0.7 })));
        out.push(...gen.toPaths(gen.ellipse(ex, ey, 3, 3, { roughness: 0.4, bowing: 0.3, seed: seed + 10 + ei, stroke, strokeWidth: sw, fill: stroke, fillStyle: 'solid' })));
      });
      return out;
    }
    case 'venn': {
      // Two overlapping circles; region labels are placed in buildSketchPaths.
      const { cx, cy, r } = p;
      const off = r * 0.55;
      const o = { roughness: 0.5, bowing: 0.4, seed, stroke, strokeWidth: sw };
      const out: PathInfo[] = [];
      out.push(...gen.toPaths(gen.ellipse(cx - off, cy, r * 2, r * 2, o)));
      out.push(...gen.toPaths(gen.ellipse(cx + off, cy, r * 2, r * 2, { ...o, seed: seed + 1 })));
      return out;
    }
    case 'layers': {
      // Contiguous horizontal bands (no gaps); each band's label is centered in it.
      const { x, y, w, h } = p;
      const n = p.layers.length;
      const bandH = h / n;
      const out: PathInfo[] = [];
      for (let i = 0; i < n; i++) out.push(...gen.toPaths(gen.rectangle(x, y + i * bandH, w, bandH, { ...opts, seed: seed + i })));
      return out;
    }
    case 'matrix': {
      // A rows×cols grid of cells; header + cell labels are placed in build.
      const g = matrixGeom(p);
      const out: PathInfo[] = [];
      for (let r = 0; r < p.rows; r++)
        for (let c = 0; c < p.cols; c++)
          out.push(...gen.toPaths(gen.rectangle(g.gx + c * g.cw, g.gy + r * g.ch, g.cw, g.ch, { ...opts, seed: seed + r * p.cols + c })));
      return out;
    }
    case 'pyramid': {
      // Each tier is a trapezoid (the apex tier collapses to a triangle).
      const out: PathInfo[] = [];
      pyramidTiers(p).forEach((t, i) => {
        const pts: [number, number][] = [
          [t.cx - t.topW / 2, t.topY], [t.cx + t.topW / 2, t.topY],
          [t.cx + t.botW / 2, t.botY], [t.cx - t.botW / 2, t.botY],
        ];
        out.push(...gen.toPaths(gen.polygon(pts, { ...opts, seed: seed + i })));
      });
      return out;
    }
    case 'iceberg': {
      // A wavy waterline, a small tip above it and a large jagged mass below.
      const size = p.size ?? 60;
      const { cx, cy } = p;
      const halfW = size * 0.42;
      const tipH = size * 0.26, bodyH = size * 0.74;
      const out: PathInfo[] = [];
      // the berg: tip above the waterline + a wider jagged mass below (one polygon)
      const berg: [number, number][] = [
        [cx - size * 0.14, cy], [cx, cy - tipH], [cx + size * 0.16, cy], // tip above
        [cx + halfW, cy + bodyH * 0.35], [cx + halfW * 0.7, cy + bodyH], // right + bottom
        [cx - halfW * 0.75, cy + bodyH], [cx - halfW, cy + bodyH * 0.4],  // bottom-left + left
      ];
      out.push(...gen.toPaths(gen.polygon(berg, { roughness: 0.7, bowing: 0.5, seed, stroke, strokeWidth: sw })));
      // waterline: a gently wavy line across, drawn on top
      const wl: [number, number][] = [];
      for (let i = 0; i <= 10; i++) { const t = i / 10; wl.push([cx - size * 0.9 + size * 1.8 * t, cy + Math.sin(t * Math.PI * 4) * 1.4]); }
      out.push(...gen.toPaths(gen.curve(wl, { roughness: 0.6, bowing: 0.4, seed: seed + 3, stroke: SKETCH_COLORS.blue, strokeWidth: Math.max(0.8, sw * 0.8) })));
      return out;
    }
    case 'venn3': {
      const c = venn3Centers(p);
      const o = { roughness: 0.5, bowing: 0.4, seed, stroke, strokeWidth: sw };
      const out: PathInfo[] = [];
      c.forEach((ct, i) => out.push(...gen.toPaths(gen.ellipse(ct.x, ct.y, p.r * 2, p.r * 2, { ...o, seed: seed + i }))));
      return out;
    }
    case 'sankey': {
      // Input bar on the left, proportional output bars on the right, ribbons between.
      const g = sankeyLayout(p);
      const flowColor = fillTok ? SKETCH_COLORS[fillTok] : SKETCH_COLORS.gray;
      const out: PathInfo[] = [];
      // ribbons (top + bottom edges), so the taper reads as a flow
      g.bands.forEach((b, i) => {
        out.push(...gen.toPaths(gen.line(g.inX2, b.inTop, g.outX1, b.outTop, { roughness: 0.5, bowing: 0.5, seed: seed + 40 + i, stroke: flowColor, strokeWidth: Math.max(0.7, sw * 0.7) })));
        out.push(...gen.toPaths(gen.line(g.inX2, b.inTop + b.inH, g.outX1, b.outTop + b.outH, { roughness: 0.5, bowing: 0.5, seed: seed + 60 + i, stroke: flowColor, strokeWidth: Math.max(0.7, sw * 0.7) })));
      });
      // input bar (full height) on the left
      out.push(...gen.toPaths(gen.rectangle(p.x, p.y, g.barW, p.h, { ...opts, seed })));
      // output bars on the right
      g.bands.forEach((b, i) => out.push(...gen.toPaths(gen.rectangle(g.outX1, b.outTop, g.barW, b.outH, { ...opts, seed: seed + 10 + i }))));
      return out;
    }
    case 'rect':
      return gen.toPaths(gen.rectangle(p.x, p.y, p.w, p.h, opts));
    case 'label':
      return [];
  }
}

/** Rough estimate of a label's rendered width in canvas units. */
const estLabelWidth = (text: string, fontSize: number) => Math.max(8, text.length * fontSize * 0.55);

/**
 * Nudge a label so its estimated text box stays inside the canvas, so long
 * labels near an edge don't clip (e.g. "compressed (high pitch)" anchored near
 * x≈95). Adjusts x per anchor and clamps y by the text height. Best-effort: a
 * label wider than the canvas is pinned to the edge rather than inverted.
 */
function clampLabelPos(
  x: number,
  y: number,
  w: number,
  fontSize: number,
  anchor: 'start' | 'middle' | 'end',
): { x: number; y: number } {
  const PAD = 2;
  const lo = PAD;
  const hi = SKETCH_VIEWBOX.width - PAD;
  let cx = x;
  if (anchor === 'start') cx = Math.max(lo, Math.min(x, hi - w));
  else if (anchor === 'end') cx = Math.min(hi, Math.max(x, lo + w));
  else {
    const half = w / 2;
    // If the label is wider than the usable width, just center it.
    cx = hi - half < lo + half ? SKETCH_VIEWBOX.width / 2 : Math.max(lo + half, Math.min(x, hi - half));
  }
  const halfH = (fontSize * 1.2) / 2;
  const cy = Math.max(lo + halfH, Math.min(y, SKETCH_VIEWBOX.height - PAD - halfH));
  return { x: cx, y: cy };
}

export function buildSketchPaths(primitives: SketchPrimitive[]): {
  drawn: { paths: PathInfo[] }[];
  labels: LabelSpec[];
} {
  const gen = rough.generator();
  const drawn: { paths: PathInfo[] }[] = [];
  const labels: LabelSpec[] = [];
  const pushLabel = (
    lx: number, ly: number, text: string, i: number,
    fontSize = 5, anchor: 'start' | 'middle' | 'end' = 'middle', color?: SketchColor,
  ) => {
    const w = estLabelWidth(text, fontSize);
    const slug = shortLabelSlug(text) || `label-${i}`;
    const { x, y } = clampLabelPos(lx, ly, w, fontSize, anchor);
    labels.push({
      x, y, text, fontSize, anchor,
      fill: hex(color),
      feature: feat(slug, { cx: x, cy: y, w, h: fontSize * 1.2 }, SKETCH_VIEWBOX),
    });
  };
  primitives.forEach((p, i) => {
    if (p.type === 'label') {
      pushLabel(p.x, p.y, p.text, i, p.fontSize ?? 5, p.anchor ?? 'middle', p.stroke);
      return;
    }
    drawn.push({ paths: primitivePaths(gen, p, i + 1) });
    // vector/brace carry an OPTIONAL inline label (distinct from a `label` prim):
    // place it at the shaft midpoint / brace tip so the tag rides its own figure.
    if (p.type === 'vector' && p.label) {
      const [lx, ly] = vectorLabelPos(p);
      pushLabel(lx, ly, p.label, i, 5, 'middle', p.stroke);
    } else if (p.type === 'brace' && p.label) {
      const [lx, ly] = braceGeom(p).tip;
      pushLabel(lx, ly, p.label, i, 5, 'middle', p.stroke);
    } else if (p.type === 'gauge' && p.label) {
      // sits below the hub, in the empty lower half of the dial
      pushLabel(p.cx, p.cy + p.r * 0.55, p.label, i, 5, 'middle', p.stroke);
    } else if (p.type === 'axis' && p.labels && p.labels.length) {
      // one label under each of the first N ticks (N = labels.length, capped by ticks)
      const dx = p.x2 - p.x1, dy = p.y2 - p.y1;
      const L = Math.hypot(dx, dy) || 1;
      let px = -dy / L, py = dx / L;
      if (py < 0) { px = -px; py = -py; }
      const nt = p.ticks ?? p.labels.length;
      const denom = Math.max(1, nt - 1);
      p.labels.forEach((text, li) => {
        if (li >= nt) return;
        const t = nt <= 1 ? 0 : li / denom;
        const tx = p.x1 + dx * t, ty = p.y1 + dy * t;
        pushLabel(tx + px * 6, ty + py * 6, text, i * 100 + li, 4.5, 'middle', p.stroke);
      });
    } else if (p.type === 'coordinate_grid') {
      // axis captions: xLabel at the right end (above the axis), yLabel at the top.
      const quad = p.quadrants ?? 4;
      const ox = quad === 1 ? p.x : p.x + p.w / 2;
      const oy = quad === 1 ? p.y + p.h : p.y + p.h / 2;
      if (p.xLabel) pushLabel(p.x + p.w - 1, oy - 4, p.xLabel, i, 4.5, 'end', p.stroke);
      if (p.yLabel) pushLabel(ox + 4, p.y + 1, p.yLabel, i, 4.5, 'start', p.stroke);
    } else if (p.type === 'orbit') {
      // satellite label rides above its dot; center label sits just below the body.
      const a = ((p.angle ?? 0) * Math.PI) / 180;
      const sx = p.cx + p.rx * Math.cos(a), sy = p.cy + p.ry * Math.sin(a);
      if (p.satelliteLabel) pushLabel(sx, sy - 7, p.satelliteLabel, i * 100, 4.5, 'middle', p.stroke);
      if (p.centerLabel) pushLabel(p.cx, p.cy + 7, p.centerLabel, i * 100 + 1, 4.5, 'middle', p.stroke);
    } else if (p.type === 'molecule') {
      // each atom's element letter, centered on its circle
      p.atoms.forEach((a, ai) => {
        if (a.label) pushLabel(a.x, a.y, a.label, i * 100 + ai, 5, 'middle', p.stroke);
      });
    } else if (p.type === 'bar_compare' && p.labels && p.labels.length) {
      // one caption centered under each bar
      const n = p.values.length;
      const gap = p.w * 0.06;
      const barW = Math.max(1, (p.w - gap * (n + 1)) / n);
      const baseY = p.y + p.h;
      p.labels.forEach((text, li) => {
        if (li >= n) return;
        const bx = p.x + gap + li * (barW + gap) + barW / 2;
        pushLabel(bx, baseY + 5, text, i * 100 + li, 4.5, 'middle', p.stroke);
      });
    } else if (p.type === 'cycle') {
      // each stage label just OUTSIDE the ring, anchored so it reads away from the ring.
      cycleNodes(p).forEach((node, si) => {
        const lr = p.r + 8;
        const lx = p.cx + lr * Math.cos(node.a);
        const ly = p.cy + lr * Math.sin(node.a);
        const anchor = Math.cos(node.a) > 0.3 ? 'start' : Math.cos(node.a) < -0.3 ? 'end' : 'middle';
        pushLabel(lx, ly, node.text, i * 100 + si, 4.2, anchor, p.stroke);
      });
    } else if (p.type === 'flow_chain') {
      // each step label centered inside its box
      flowLayout(p).boxes.forEach((b, si) => {
        pushLabel(b.x + b.w / 2, b.y + b.h / 2, b.text, i * 100 + si, 4.2, 'middle', p.stroke);
      });
    } else if (p.type === 'balance_scale') {
      // pan labels sit just below each hanging bowl
      const g = balanceGeom(p);
      if (p.leftLabel) pushLabel(g.lx, g.ly + g.hang + 8, p.leftLabel, i * 100, 4.5, 'middle', p.stroke);
      if (p.rightLabel) pushLabel(g.rx, g.ry + g.hang + 8, p.rightLabel, i * 100 + 1, 4.5, 'middle', p.stroke);
    } else if (p.type === 'part_whole' && p.label) {
      // the fraction/percent caption sits below the pie
      pushLabel(p.cx, p.cy + p.r + 8, p.label, i, 5.5, 'middle', p.stroke);
    } else if (p.type === 'tree_diagram') {
      // root label + one label centered in each child box
      const { root, children } = treeLayout(p);
      pushLabel(root.x + root.w / 2, root.y + root.h / 2, p.root, i, 4.3, 'middle', p.stroke);
      children.forEach((c, si) => pushLabel(c.x + c.w / 2, c.y + c.h / 2, c.text, i * 100 + si, 4.0, 'middle', p.stroke));
    } else if (p.type === 'network') {
      // a word label centered in each node circle
      p.nodes.forEach((nd, ni) => {
        if (nd.label) pushLabel(nd.x, nd.y, nd.label, i * 100 + ni, 3.6, 'middle', p.stroke);
      });
    } else if (p.type === 'speech_bubble') {
      // the text centered inside the bubble
      pushLabel(p.x + p.w / 2, p.y + p.h / 2, p.text, i, 4.2, 'middle', p.stroke);
    } else if (p.type === 'timeline') {
      // each event label alternates above/below, beyond its connector
      const dx = p.x2 - p.x1, dy = p.y2 - p.y1; const L = Math.hypot(dx, dy) || 1;
      const px = -dy / L, py = dx / L;
      p.events.forEach((e, ei) => {
        const ex = p.x1 + dx * e.at, ey = p.y1 + dy * e.at;
        const side = ei % 2 === 0 ? -1 : 1;
        pushLabel(ex + px * side * 9, ey + py * side * 9, e.label, i * 100 + ei, 4.0, 'middle', p.stroke);
      });
    } else if (p.type === 'venn') {
      // left-only / shared / right-only region labels
      const off = p.r * 0.55;
      if (p.leftLabel) pushLabel(p.cx - off - p.r * 0.5, p.cy, p.leftLabel, i, 4.0, 'middle', p.stroke);
      if (p.rightLabel) pushLabel(p.cx + off + p.r * 0.5, p.cy, p.rightLabel, i * 100 + 1, 4.0, 'middle', p.stroke);
      if (p.bothLabel) pushLabel(p.cx, p.cy, p.bothLabel, i * 100 + 2, 3.8, 'middle', p.stroke);
    } else if (p.type === 'layers') {
      // each band label centered in its band
      const bandH = p.h / p.layers.length;
      p.layers.forEach((text, li) => pushLabel(p.x + p.w / 2, p.y + (li + 0.5) * bandH, text, i * 100 + li, 4.0, 'middle', p.stroke));
    } else if (p.type === 'matrix') {
      // column headers (top band), row headers (left band), and cell text
      const g = matrixGeom(p);
      if (p.colLabels) p.colLabels.forEach((t, c) => { if (c < p.cols) pushLabel(g.gx + (c + 0.5) * g.cw, p.y + g.headT * 0.5, t, i * 100 + c, 3.8, 'middle', p.stroke); });
      if (p.rowLabels) p.rowLabels.forEach((t, r) => { if (r < p.rows) pushLabel(p.x + g.headL * 0.5, g.gy + (r + 0.5) * g.ch, t, i * 100 + 20 + r, 3.5, 'middle', p.stroke); });
      if (p.cells) p.cells.forEach((t, k) => { const r = Math.floor(k / p.cols), c = k % p.cols; if (r < p.rows) pushLabel(g.gx + (c + 0.5) * g.cw, g.gy + (r + 0.5) * g.ch, t, i * 100 + 40 + k, 3.6, 'middle', p.stroke); });
    } else if (p.type === 'pyramid') {
      // each tier label centered in its band
      pyramidTiers(p).forEach((t, ti) => pushLabel(t.cx, t.labelCy, t.text, i * 100 + ti, 3.9, 'middle', p.stroke));
    } else if (p.type === 'iceberg') {
      // above/below labels, placed in the visible tip and the hidden mass
      const size = p.size ?? 60;
      if (p.aboveLabel) pushLabel(p.cx, p.cy - size * 0.36, p.aboveLabel, i, 4.2, 'middle', p.stroke);
      if (p.belowLabel) pushLabel(p.cx, p.cy + size * 0.42, p.belowLabel, i * 100 + 1, 4.2, 'middle', p.stroke);
    } else if (p.type === 'venn3') {
      // three set names in the outer regions + the shared-center label
      const c = venn3Centers(p);
      if (p.aLabel) pushLabel(c[0].x, c[0].y - p.r * 0.55, p.aLabel, i, 4.0, 'middle', p.stroke);
      if (p.bLabel) pushLabel(c[1].x - p.r * 0.5, c[1].y + p.r * 0.5, p.bLabel, i * 100 + 1, 4.0, 'middle', p.stroke);
      if (p.cLabel) pushLabel(c[2].x + p.r * 0.5, c[2].y + p.r * 0.5, p.cLabel, i * 100 + 2, 4.0, 'middle', p.stroke);
      if (p.allLabel) pushLabel(p.cx, p.cy + p.r * 0.12, p.allLabel, i * 100 + 3, 3.6, 'middle', p.stroke);
    } else if (p.type === 'sankey') {
      // input label on the left bar, each flow label at its output bar
      const g = sankeyLayout(p);
      if (p.inputLabel) pushLabel(p.x + g.barW / 2, p.y - 4, p.inputLabel, i, 4.0, 'middle', p.stroke);
      g.bands.forEach((b, bi) => pushLabel(g.outX1 + g.barW + 2, b.outTop + b.outH / 2, b.label, i * 100 + bi, 3.8, 'start', p.stroke));
    }
  });
  return { drawn, labels };
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Serialize a sketch to a standalone SVG string (PDF + smoke use). */
export function sketchToSvgString(primitives: SketchPrimitive[], opts: { title?: string } = {}): string {
  const { width: W, height: H } = SKETCH_VIEWBOX;
  const { drawn, labels } = buildSketchPaths(primitives);
  const paths = drawn
    .flatMap(({ paths }) =>
      paths.map(
        (pi) =>
          `<path d="${pi.d}" stroke="${pi.stroke}" stroke-width="${pi.strokeWidth}" ` +
          `fill="${pi.fill || 'none'}" stroke-linecap="round" stroke-linejoin="round"/>`,
      ),
    )
    .join('');
  const texts = labels
    .map(
      (l) =>
        `<text x="${l.x}" y="${l.y}" font-size="${l.fontSize}" fill="${l.fill}" ` +
        `text-anchor="${l.anchor}" dominant-baseline="middle" ` +
        `font-family="'Comic Sans MS','Segoe Print','Bradley Hand',cursive">${esc(l.text)}</text>`,
    )
    .join('');
  const title = opts.title
    ? `<text x="${W / 2}" y="6" font-size="6" font-weight="700" fill="#1f2937" text-anchor="middle">${esc(opts.title)}</text>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-feature="sketch">${title}${paths}${texts}</svg>`;
}
