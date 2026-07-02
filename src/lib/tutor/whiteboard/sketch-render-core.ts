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
