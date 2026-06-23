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
    case 'rect':
      return gen.toPaths(gen.rectangle(p.x, p.y, p.w, p.h, opts));
    case 'label':
      return [];
  }
}

export function buildSketchPaths(primitives: SketchPrimitive[]): {
  drawn: { paths: PathInfo[] }[];
  labels: LabelSpec[];
} {
  const gen = rough.generator();
  const drawn: { paths: PathInfo[] }[] = [];
  const labels: LabelSpec[] = [];
  primitives.forEach((p, i) => {
    if (p.type === 'label') {
      const fontSize = p.fontSize ?? 5;
      const slug = shortLabelSlug(p.text) || `label-${i}`;
      labels.push({
        x: p.x,
        y: p.y,
        text: p.text,
        fontSize,
        anchor: p.anchor ?? 'middle',
        fill: hex(p.stroke),
        feature: feat(
          slug,
          { cx: p.x, cy: p.y, w: Math.max(8, p.text.length * fontSize * 0.55), h: fontSize * 1.2 },
          SKETCH_VIEWBOX,
        ),
      });
    } else {
      drawn.push({ paths: primitivePaths(gen, p, i + 1) });
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
