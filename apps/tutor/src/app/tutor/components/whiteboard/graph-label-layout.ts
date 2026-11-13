/**
 * Where the names of points and segments go on a graph (DesmosGraphRenderer).
 *
 * Desmos puts each label beside its own point without looking at the others, and a segment's name used to sit
 * on the segment's midpoint: two roots one unit apart had their names printed over each other, and the three
 * diagonals of a hexagon had theirs stacked on the centre (figure audit, 2026-11-13). Here every label is given
 * a place of its own: beside its point or beside its segment, clear of the other labels, of the points, of the
 * segments and, when they can be evaluated, of the curves.
 *
 * Pure: pixel geometry in, math coordinates of each label's CENTRE out.
 */

export interface LabelWindow { left: number; right: number; bottom: number; top: number }
export interface LabelPoint { x: number; y: number; label?: string }
export interface LabelSegment { from: { x: number; y: number }; to: { x: number; y: number }; label?: string }
export interface LabelLayoutInput {
  /** Plot box in pixels. */
  width: number; height: number;
  window: LabelWindow;
  points: LabelPoint[];
  segments: LabelSegment[];
  /** y = f(x) curves that could be evaluated; a label keeps off them when it can. */
  curves?: Array<(x: number) => number>;
}
export interface LabelLayout {
  /** One entry per input point / segment: the label's centre in math coordinates, or null when it has no label. */
  points: Array<{ x: number; y: number } | null>;
  segments: Array<{ x: number; y: number } | null>;
}

interface Rect { x: number; y: number; w: number; h: number; weight: number }

const CHAR_W = 7.6;   // Desmos label text, medium size
const LABEL_H = 20;

/** The label's box in pixels, for its text. */
export function labelBox(text: string): { w: number; h: number } {
  return { w: Math.max(14, text.length * CHAR_W + 6), h: LABEL_H };
}

function overlap(a: { x: number; y: number; w: number; h: number }, b: Rect): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h * b.weight : 0;
}

export function layoutGraphLabels(input: LabelLayoutInput): LabelLayout {
  const { width: W, height: H, window: win } = input;
  const xSpan = win.right - win.left;
  const ySpan = win.top - win.bottom;
  const none: LabelLayout = { points: input.points.map(() => null), segments: input.segments.map(() => null) };
  if (!(W > 0 && H > 0 && xSpan > 0 && ySpan > 0)) return none;
  const px = (x: number) => ((x - win.left) / xSpan) * W;
  const py = (y: number) => ((win.top - y) / ySpan) * H;
  const mx = (p: number) => win.left + (p / W) * xSpan;
  const my = (p: number) => win.top - (p / H) * ySpan;

  const obstacles: Rect[] = [];
  // The dots.
  for (const p of input.points) obstacles.push({ x: px(p.x) - 8, y: py(p.y) - 8, w: 16, h: 16, weight: 3 });
  // The segments, as a string of small squares.
  for (const s of input.segments) {
    const ax = px(s.from.x), ay = py(s.from.y), bx = px(s.to.x), by = py(s.to.y);
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 6));
    for (let i = 0; i <= n; i++) obstacles.push({ x: ax + ((bx - ax) * i) / n - 3, y: ay + ((by - ay) * i) / n - 3, w: 6, h: 6, weight: 2 });
  }
  // The curves that can be evaluated.
  for (const f of input.curves ?? []) {
    let prev: number | null = null;
    for (let p = 0; p <= W; p += 5) {
      let y: number;
      try { y = f(mx(p)); } catch { y = NaN; }
      if (!Number.isFinite(y)) { prev = null; continue; }
      const q = py(y);
      if (q >= -20 && q <= H + 20) {
        // A steep stretch is covered from the last sample to this one.
        const from: number = prev === null ? q : Math.max(-20, Math.min(H + 20, prev));
        obstacles.push({ x: p - 3, y: Math.min(from, q) - 3, w: 6, h: Math.abs(q - from) + 6, weight: 2.5 });
      }
      prev = q;
    }
  }
  // The axes and the numbers along them.
  const x0 = px(0), y0 = py(0);
  if (y0 >= 0 && y0 <= H) { obstacles.push({ x: 0, y: y0 - 1, w: W, h: 3, weight: 0.5 }); obstacles.push({ x: 0, y: y0 + 2, w: W, h: 16, weight: 0.5 }); }
  if (x0 >= 0 && x0 <= W) { obstacles.push({ x: x0 - 1, y: 0, w: 3, h: H, weight: 0.5 }); obstacles.push({ x: x0 - 26, y: 0, w: 24, h: H, weight: 0.5 }); }

  // The heavier grid lines: one running through a name reads as a word struck out. Desmos draws them about
  // every hundred pixels at a round step (1, 2 or 5 times a power of ten).
  const majorStep = (unitsPerPx: number) => { const raw = unitsPerPx * 100; const p = Math.pow(10, Math.floor(Math.log10(raw))); const m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; };
  const stepY = majorStep(ySpan / H), stepX = majorStep(xSpan / W);
  for (let v = Math.ceil(win.bottom / stepY) * stepY; v <= win.top; v += stepY) obstacles.push({ x: 0, y: py(v) - 2, w: W, h: 4, weight: 0.9 });
  for (let v = Math.ceil(win.left / stepX) * stepX; v <= win.right; v += stepX) obstacles.push({ x: px(v) - 1, y: 0, w: 2, h: H, weight: 0.3 });

  const cost = (cx: number, cy: number, w: number, h: number): number => {
    const box = { x: cx - w / 2, y: cy - h / 2, w, h };
    let c = 0;
    for (const o of obstacles) c += overlap(box, o);
    // Off the plot: what hangs over the edge cannot be read at all.
    const over = Math.max(0, 4 - box.x) + Math.max(0, box.x + w - (W - 4));
    const overV = Math.max(0, 4 - box.y) + Math.max(0, box.y + h - (H - 4));
    return c + over * h * 8 + overV * w * 8;
  };
  const best = (cands: Array<{ cx: number; cy: number; bias: number }>, w: number, h: number) => {
    let pick = cands[0]; let pickCost = Infinity;
    for (const c of cands) {
      const k = cost(c.cx, c.cy, w, h) + c.bias;
      if (k < pickCost) { pick = c; pickCost = k; }
    }
    return pick;
  };

  const out: LabelLayout = { points: [], segments: [] };

  // Points first: a point's name has to stay next to its dot.
  const DIRS: Array<[number, number]> = [[1, 0], [0, -1], [-1, 0], [0, 1], [1, -1], [-1, -1], [1, 1], [-1, 1]];
  for (const p of input.points) {
    const text = (p.label ?? '').trim();
    if (!text) { out.points.push(null); continue; }
    const { w, h } = labelBox(text);
    const cx0 = px(p.x), cy0 = py(p.y);
    const cands: Array<{ cx: number; cy: number; bias: number }> = [];
    for (let ring = 0; ring < 4; ring++) {
      const gap = 10 + ring * 14;
      DIRS.forEach(([dx, dy], i) => {
        // On a diagonal the label sits off the corner of the dot, not far out along both axes.
        const diag = dx !== 0 && dy !== 0;
        cands.push({
          cx: cx0 + dx * ((diag ? gap * 0.5 : gap) + w / 2),
          cy: cy0 + dy * ((diag ? gap * 0.6 : gap) + h / 2),
          bias: i * 3 + ring * 40,
        });
      });
    }
    const c = best(cands, w, h);
    obstacles.push({ x: c.cx - w / 2 - 2, y: c.cy - h / 2 - 1, w: w + 4, h: h + 2, weight: 4 });
    out.points.push({ x: mx(c.cx), y: my(c.cy) });
  }

  // Segments: beside the segment, on the outer side of the figure when there is one.
  const ends = input.segments.flatMap((s) => [s.from, s.to]);
  const gx = ends.length ? ends.reduce((a, e) => a + px(e.x), 0) / ends.length : W / 2;
  const gy = ends.length ? ends.reduce((a, e) => a + py(e.y), 0) / ends.length : H / 2;
  for (const s of input.segments) {
    const text = (s.label ?? '').trim();
    if (!text) { out.segments.push(null); continue; }
    const { w, h } = labelBox(text);
    const ax = px(s.from.x), ay = py(s.from.y), bx = px(s.to.x), by = py(s.to.y);
    const len = Math.hypot(bx - ax, by - ay) || 1;
    let nx = -(by - ay) / len, ny = (bx - ax) / len;
    // Outer side first: away from the middle of the figure; for a lone segment, above it.
    const midx = (ax + bx) / 2, midy = (ay + by) / 2;
    const away = (midx - gx) * nx + (midy - gy) * ny;
    if (away < -0.5 || (Math.abs(away) <= 0.5 && ny > 0)) { nx = -nx; ny = -ny; }
    const d = 7 + (Math.abs(nx) * w + Math.abs(ny) * h) / 2;
    const cands: Array<{ cx: number; cy: number; bias: number }> = [];
    [0.5, 0.36, 0.64, 0.24, 0.76].forEach((t, ti) => {
      [1, -1].forEach((side, si) => {
        cands.push({ cx: ax + (bx - ax) * t + nx * d * side, cy: ay + (by - ay) * t + ny * d * side, bias: ti * 6 + si * 10 });
      });
    });
    const c = best(cands, w, h);
    obstacles.push({ x: c.cx - w / 2 - 2, y: c.cy - h / 2 - 1, w: w + 4, h: h + 2, weight: 4 });
    out.segments.push({ x: mx(c.cx), y: my(c.cy) });
  }
  return out;
}

/** Colours for straight segments. A few segments are told apart by colour (two vectors and a projection);
 *  many are one figure (a hexagon and its diagonals) and a colour each would be a rainbow that means nothing,
 *  so they share one colour and their names tell them apart. */
const FEW = ['#2563eb', '#dc2626', '#059669', '#d97706'];
const MANY = '#1e40af';
export function segmentColours(segments: Array<{ color?: string }>): string[] {
  const unset = segments.filter((s) => !s.color).length;
  let n = 0;
  return segments.map((s) => s.color || (unset > FEW.length ? MANY : FEW[n++ % FEW.length]));
}
