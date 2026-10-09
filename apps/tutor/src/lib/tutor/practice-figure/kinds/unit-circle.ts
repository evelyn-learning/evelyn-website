/**
 * unit_circle — the circle of radius 1 on x / y axes with marked angles.
 *
 * { angles: Array<{
 *     degrees?: number;              // −360 … 360, OR
 *     pi?: [num, den];               // the angle num·π/den (den 1 … 12)
 *     label?: 'degrees' | 'radians' | 'none' | 'blank';   // the angle's printed size
 *                                    // (default: `angleLabels`); 'blank' prints "?"
 *     labelText?: string;            // printed instead of the size ("θ")
 *     radius?: boolean (true);       // the radius line to the point
 *     arc?: boolean (false);         // the arc from the positive x-axis
 *     point?: boolean (true);        // the dot on the circle
 *     name?: string;                 // a letter beside the dot ("P")
 *     coords?: 'hide' | 'show' | 'blank' | 'blank_x' | 'blank_y' ('hide');
 *     triangle?: boolean (false) }>; // the reference triangle to the x-axis
 *   angleLabels?: 'degrees' | 'radians' | 'none';   // default: as each angle was given
 *   quadrantLabels?: boolean (false); axisTicks?: boolean (true — "1" / "−1" on the axes);
 *   title?: string }
 *
 * Coordinates are printed EXACTLY for multiples of 30° and 45° ("(−√3/2, 1/2)")
 * and to two decimals otherwise. What an item can hide: the angle's size
 * (`label: 'none' | 'blank'`), either or both coordinates (`coords`), the
 * triangle, the quadrant names.
 *
 * No plot frame here: a unit circle is read from its labels, and the frame's
 * edge numbers and grid would let cos θ and sin θ be read off as decimals.
 * The axes are drawn in the frame's ink and type sizes.
 */
import { FIGURE_WIDTH, LABEL_FS, SERIES_COLORS, TICK_FS, n2 } from '../plot-frame';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { INK, MUTED, Placer, arcPath, around, arrow, exactTrig, inkWidth, label, layoutText, numText, piText, segmentBoxes, text, textBox, titleBlock, type Candidate } from './draw';

export type AngleLabel = 'degrees' | 'radians' | 'none' | 'blank';
export type CoordsMode = 'hide' | 'show' | 'blank' | 'blank_x' | 'blank_y';

export interface UnitCircleAngle {
  degrees: number;
  pi?: [number, number];
  label: AngleLabel;
  labelText?: string;
  radius: boolean;
  arc: boolean;
  point: boolean;
  name?: string;
  coords: CoordsMode;
  triangle: boolean;
  /** What is printed for the angle ("150°", "5π/6", "θ", "?"), or '' for nothing. */
  shownLabel: string;
  /** What is printed for the point ("P(?, 1/2)"), or '' for nothing. */
  shownCoords: string;
  /** Exact (or 2-decimal) cos and sin as they would be printed. */
  cosText: string;
  sinText: string;
}

export interface UnitCircleModel {
  angles: UnitCircleAngle[];
  quadrantLabels: boolean;
  axisTicks: boolean;
  title?: string;
}

export function unitCircleModel(r: Reader): UnitCircleModel {
  const p = r.p;
  const dflt = p.angleLabels;
  if (dflt !== undefined && dflt !== null && dflt !== 'degrees' && dflt !== 'radians' && dflt !== 'none') r.fail("angleLabels must be 'degrees', 'radians' or 'none'");
  const angles = r.list(p.angles, 'angles', 1, 16).map((raw, i): UnitCircleAngle => {
    const a = r.obj(raw, `angles[${i}]`);
    const at = `angles[${i}]`;
    let degrees: number;
    let pi: [number, number] | undefined;
    if (a.pi !== undefined && a.pi !== null) {
      if (a.degrees !== undefined && a.degrees !== null) r.fail(`${at}: give degrees or pi, not both`);
      if (!Array.isArray(a.pi) || a.pi.length !== 2) r.fail(`${at}.pi must be [numerator, denominator] (the angle numerator·π/denominator)`);
      const num = r.num((a.pi as unknown[])[0], `${at}.pi[0]`);
      const den = r.num((a.pi as unknown[])[1], `${at}.pi[1]`);
      if (!Number.isInteger(num) || !Number.isInteger(den) || den < 1 || den > 12) r.fail(`${at}.pi must be two whole numbers with a denominator from 1 to 12`);
      pi = [num, den];
      degrees = (num * 180) / den;
    } else {
      degrees = r.num(a.degrees, `${at}.degrees`);
    }
    if (degrees < -360 || degrees > 360) r.fail(`${at}: the angle must lie between −360° and 360° (it is ${numText(degrees)}°)`);
    const label = (a.label ?? dflt ?? (pi ? 'radians' : 'degrees')) as AngleLabel;
    if (!['degrees', 'radians', 'none', 'blank'].includes(label)) r.fail(`${at}.label must be 'degrees', 'radians', 'none' or 'blank'`);
    const labelText = r.optStr(a.labelText, `${at}.labelText`, 8);
    if (label === 'radians' && !pi && !Number.isInteger(degrees) && !labelText) r.fail(`${at}: a radian label needs the angle as pi: [num, den]`);
    const coords = (a.coords ?? 'hide') as CoordsMode;
    if (!['hide', 'show', 'blank', 'blank_x', 'blank_y'].includes(coords)) r.fail(`${at}.coords must be 'hide', 'show', 'blank', 'blank_x' or 'blank_y'`);
    const name = r.optStr(a.name, `${at}.name`, 4);
    const cosText = exactTrig('cos', degrees) ?? numText(Math.cos((degrees * Math.PI) / 180));
    const sinText = exactTrig('sin', degrees) ?? numText(Math.sin((degrees * Math.PI) / 180));
    const shownLabel = labelText ?? (label === 'none' ? '' : label === 'blank' ? '?' : label === 'degrees' ? `${numText(degrees)}°` : pi ? piText(pi[0], pi[1]) : piText(degrees, 180));
    const pair = coords === 'hide' ? '' : `(${coords === 'blank' || coords === 'blank_x' ? '?' : cosText}, ${coords === 'blank' || coords === 'blank_y' ? '?' : sinText})`;
    const point = r.bool(a.point, `${at}.point`, true);
    if (!point && (name || pair)) r.fail(`${at}: a name or coordinates need the point to be drawn`);
    return {
      degrees, pi, label, labelText,
      radius: r.bool(a.radius, `${at}.radius`, true),
      arc: r.bool(a.arc, `${at}.arc`, false),
      point, name, coords,
      triangle: r.bool(a.triangle, `${at}.triangle`, false),
      shownLabel,
      shownCoords: `${name ?? ''}${pair}`,
      cosText, sinText,
    };
  });
  const seen = new Set<number>();
  angles.forEach((a, i) => {
    const key = Math.round((((a.degrees % 360) + 360) % 360) * 1000);
    if (seen.has(key) && a.point) r.fail(`angles[${i}] ends at the same point of the circle as an earlier angle`);
    if (a.point) seen.add(key);
  });
  return {
    angles,
    quadrantLabels: r.bool(p.quadrantLabels, 'quadrantLabels', false),
    axisTicks: r.bool(p.axisTicks, 'axisTicks', true),
    title: r.optStr(p.title, 'title', 160),
  };
}

const R = 86;
const BLUE = SERIES_COLORS[0];

export function renderUnitCircle(r: Reader): Drawn {
  const m = unitCircleModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const cx = W / 2;
  const cy = t.top + 34 + R;
  const H = cy + R + 40;
  const notes: NonNullable<FigureFacts['notes']> = [];
  const placer = new Placer({ x0: 3, y0: t.top, x1: W - 3, y1: H - 3 });
  const under: string[] = [];
  const lines: string[] = [];
  const dots: string[] = [];
  const labels: string[] = [];
  const ext = R + 26;

  // Axes with arrow tips, in the frame's ink.
  under.push(arrow(cx - ext, cy, cx + ext, cy, { width: 1.3, head: 7 }), arrow(cx, cy + ext, cx, cy - ext, { width: 1.3, head: 7 }));
  labels.push(text(cx + ext + 3, cy + 4, 'x', { fs: LABEL_FS, weight: 600, italic: true }), text(cx + 6, cy - ext + 6, 'y', { fs: LABEL_FS, weight: 600, italic: true }));
  placer.block(textBox(cx + ext + 3, cy + 4, 'x', LABEL_FS), textBox(cx + 6, cy - ext + 6, 'y', LABEL_FS));
  placer.block(...segmentBoxes(cx - ext, cy, cx + ext, cy, 1.5), ...segmentBoxes(cx, cy - ext, cx, cy + ext, 1.5));
  under.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${R}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
  for (let k = 0; k < 72; k++) {
    const a = (k * Math.PI) / 36;
    const x = cx + R * Math.cos(a);
    const y = cy - R * Math.sin(a);
    placer.block({ x0: x - 2, y0: y - 2, x1: x + 2, y1: y + 2 });
  }

  const pos = (deg: number, rad = R): [number, number] => [cx + rad * Math.cos((deg * Math.PI) / 180), cy - rad * Math.sin((deg * Math.PI) / 180)];

  // Everything a label must keep off is blocked before any label is placed.
  m.angles.forEach((a, i) => {
    const [px, py] = pos(a.degrees);
    if (a.radius) {
      lines.push(`<line x1="${n2(cx)}" y1="${n2(cy)}" x2="${n2(px)}" y2="${n2(py)}" stroke="${BLUE}" stroke-width="1.9"/>`);
      placer.block(...segmentBoxes(cx, cy, px, py, 2));
    }
    if (a.triangle) {
      if (Math.abs(Math.sin((a.degrees * Math.PI) / 180)) < 1e-9 || Math.abs(Math.cos((a.degrees * Math.PI) / 180)) < 1e-9) r.fail(`angles[${i}].triangle: an angle on an axis has no reference triangle`);
      lines.push(`<path d="M${n2(px)},${n2(py)}V${n2(cy)}" fill="none" stroke="${BLUE}" stroke-width="1.5" stroke-dasharray="4 3"/>`);
      lines.push(`<line x1="${n2(cx)}" y1="${n2(cy)}" x2="${n2(px)}" y2="${n2(cy)}" stroke="${BLUE}" stroke-width="2.4"/>`);
      // The right-angle mark at the foot, opening toward the centre and the point.
      const sx = px > cx ? -1 : 1;
      const sy = py < cy ? -1 : 1;
      lines.push(`<path d="M${n2(px + sx * 7)},${n2(cy)}v${n2(sy * 7)}h${n2(-sx * 7)}" fill="none" stroke="${BLUE}" stroke-width="1.1"/>`);
      placer.block(...segmentBoxes(px, py, px, cy, 2));
    }
    if (a.arc && Math.abs(a.degrees) > 1e-9) {
      const ar = 17 + (i % 4) * 8;
      lines.push(`<path d="${arcPath(cx, cy, ar, 0, (a.degrees * Math.PI) / 180)}" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
      // A small tip, so the direction of rotation shows (it matters for a negative angle).
      const [ex, ey] = pos(a.degrees, ar);
      const back = a.degrees > 0 ? -8 : 8;
      const [bx, by] = pos(a.degrees + (back * 180) / (Math.PI * ar), ar);
      lines.push(arrow(bx, by, ex, ey, { width: 0.1, head: 6 }));
      for (let k = 0; k <= 12; k++) {
        const [x, y] = pos((a.degrees * k) / 12, ar);
        placer.block({ x0: x - 2, y0: y - 2, x1: x + 2, y1: y + 2 });
      }
    }
    if (a.point) {
      dots.push(`<circle cx="${n2(px)}" cy="${n2(py)}" r="4" fill="${BLUE}" stroke="#ffffff" stroke-width="1.2"/>`);
      placer.block({ x0: px - 5, y0: py - 5, x1: px + 5, y1: py + 5 });
    }
  });

  if (m.axisTicks) {
    for (const [dx, dy, s] of [[1, 0, '1'], [-1, 0, '−1'], [0, 1, '1'], [0, -1, '−1']] as Array<[number, number, string]>) {
      const x = cx + dx * R;
      const y = cy - dy * R;
      under.push(dx !== 0 ? `<line x1="${n2(x)}" y1="${n2(cy - 4)}" x2="${n2(x)}" y2="${n2(cy + 4)}" stroke="${INK}" stroke-width="1.3"/>` : `<line x1="${n2(cx - 4)}" y1="${n2(y)}" x2="${n2(cx + 4)}" y2="${n2(y)}" stroke="${INK}" stroke-width="1.3"/>`);
      // Just outside the circle, in the quadrant below / left of the axis; moved when a marked angle is there.
      const cands: Candidate[] = dx !== 0
        ? [{ x: x + dx * 6, y: cy + TICK_FS + 3, anchor: dx > 0 ? 'start' : 'end' }, { x: x + dx * 6, y: cy - 6, anchor: dx > 0 ? 'start' : 'end' }, { x: x - dx * 6, y: cy + TICK_FS + 3, anchor: dx > 0 ? 'end' : 'start' }]
        : [{ x: cx - 6, y: y - dy * 6 + (dy > 0 ? 0 : TICK_FS * 0.72), anchor: 'end' }, { x: cx + 6, y: y - dy * 6 + (dy > 0 ? 0 : TICK_FS * 0.72), anchor: 'start' }, { x: cx - 6, y: y + dy * 12 + (dy > 0 ? TICK_FS * 0.72 : 0), anchor: 'end' }];
      const c = placer.place(s, TICK_FS, cands);
      labels.push(text(c.x, c.y, s, { anchor: c.anchor, fill: MUTED, halo: true }));
    }
  }

  m.angles.forEach((a, i) => {
    const rad = (a.degrees * Math.PI) / 180;
    const [px, py] = pos(a.degrees);
    const ux = Math.cos(rad);
    const uy = -Math.sin(rad);
    if (a.shownCoords) {
      const c = placer.place(a.shownCoords, TICK_FS, around(px, py, TICK_FS, ux, uy, [8, 13, 20, 28]));
      if (!c.clean) notes.push({ code: 'labels_overlap', message: `angles[${i}]: there is no clear place for "${a.shownCoords}" beside its point` });
      if (a.coords !== 'show' && a.coords !== 'hide') {
        // The dashed box hugs the ink, not the (wider) layout estimate.
        const w = inkWidth(a.shownCoords, TICK_FS) + 4;
        const bx0 = c.anchor === 'start' ? c.x - 4 : c.anchor === 'end' ? c.x - w - 1 : c.x - w / 2 - 2;
        labels.push(`<path d="M${n2(bx0)},${n2(c.box.y0 - 2)}h${n2(w + 5)}V${n2(c.box.y1 + 2)}h${n2(-(w + 5))}z" fill="#ffffff" stroke="${MUTED}" stroke-width="1" stroke-dasharray="3 2"/>`);
        placer.block({ x0: c.box.x0 - 4, y0: c.box.y0 - 3, x1: c.box.x1 + 4, y1: c.box.y1 + 3 });
      }
      labels.push(text(c.x, c.y, a.shownCoords, { anchor: c.anchor, weight: 600, halo: true }));
    }
    if (a.shownLabel) {
      let cands: Candidate[];
      if (a.arc && Math.abs(a.degrees) > 1e-9) {
        // Beside the arc, on the bisector; a narrow angle's label goes further out.
        const ar = 17 + (i % 4) * 8;
        const mid = rad / 2;
        cands = [ar + 12, ar + 18, ar + 26, ar + 36].flatMap((d) => [0, 0.25, -0.25].map((off): Candidate => ({ x: cx + d * Math.cos(mid + off), y: cy - d * Math.sin(mid + off) + TICK_FS * 0.36, anchor: 'middle' })));
      } else {
        // Just inside the circle beside the radius, as on a printed unit circle.
        cands = [R - 17, R - 28, R - 40].flatMap((d) => [0.2, -0.2, 0.34, -0.34, 0].map((off): Candidate => ({ x: cx + d * Math.cos(rad + off), y: cy - d * Math.sin(rad + off) + TICK_FS * 0.36, anchor: 'middle' })));
        cands.push(...around(px, py, TICK_FS, ux, uy, [9, 16]));
      }
      const c = placer.place(layoutText(a.shownLabel), TICK_FS, cands);
      if (!c.clean) notes.push({ code: 'labels_overlap', message: `angles[${i}]: there is no clear place for the angle label "${a.shownLabel}"` });
      labels.push(label(c, a.shownLabel, { weight: 600, halo: true }));
    }
    if (a.coords === 'blank' && (a.label === 'none' || a.label === 'blank') && !a.labelText) {
      notes.push({ code: 'ambiguous_blank', message: `angles[${i}]: both coordinates are blank and the angle's size is not printed — only the picture fixes which point it is` });
    }
  });

  if (m.quadrantLabels) {
    for (const [sx, sy, s] of [[1, -1, 'I'], [-1, -1, 'II'], [-1, 1, 'III'], [1, 1, 'IV']] as Array<[number, number, string]>) {
      const cands: Candidate[] = [R * 1.02, R * 0.94, R * 0.5, R * 0.36].map((d) => ({ x: cx + sx * d, y: cy + sy * d + LABEL_FS * 0.36, anchor: 'middle' }));
      const c = placer.place(s, LABEL_FS, cands);
      labels.push(text(c.x, c.y, s, { fs: LABEL_FS, anchor: 'middle', weight: 600, fill: MUTED }));
    }
  }

  const withCoords = m.angles.filter((a) => a.shownCoords).length;
  if (withCoords > 8) notes.push({ code: 'too_many_elements', message: `${withCoords} points carry coordinates — more than 8 cannot be set clear of one another at 340 px` });
  if (m.angles.length > 12) notes.push({ code: 'too_many_elements', message: `${m.angles.length} marked angles — more than 12 crowd the circle at 340 px` });

  return { body: t.svg + under.join('') + lines.join('') + dots.join('') + labels.join(''), H, facts: { curveCount: 0, marks: [], curves: [], notes } };
}
