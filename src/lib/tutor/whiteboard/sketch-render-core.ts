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
  primitives.forEach((p, i) => {
    if (p.type === 'label') {
      const fontSize = p.fontSize ?? 5;
      const anchor = p.anchor ?? 'middle';
      const w = estLabelWidth(p.text, fontSize);
      const slug = shortLabelSlug(p.text) || `label-${i}`;
      const { x, y } = clampLabelPos(p.x, p.y, w, fontSize, anchor);
      labels.push({
        x,
        y,
        text: p.text,
        fontSize,
        anchor,
        fill: hex(p.stroke),
        feature: feat(slug, { cx: x, cy: y, w, h: fontSize * 1.2 }, SKETCH_VIEWBOX),
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
