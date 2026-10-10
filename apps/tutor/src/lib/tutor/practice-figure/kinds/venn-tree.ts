/**
 * venn_diagram, probability_tree — batch 4 (2026-10-14).
 *
 * venn_diagram — two or three overlapping sets in a universe box, one number per region.
 * { sets: string[];                                  // 2 or 3 set names, printed beside their circles
 *   regions: Array<{ in: string[];                   // the sets the region is INSIDE (it is outside all others);
 *                                                    //   [] is the region outside every set
 *                    value: number;                  // a count, or a probability (see `values`)
 *                    show?: 'value' | 'blank' | 'none';   // 'value' (default) prints it, 'blank' a "?" box
 *                    shade?: boolean }>;             // hatch the region (drawn lines, no translucency)
 *   values?: 'count' | 'probability' ('count');      // probabilities must total 1 when every region is given
 *   universeLabel?: string;                          // printed in the box's lower-left corner ("U", "40 students")
 *   title?: string }
 * A region that is not listed is drawn empty, and nothing can be computed from it.
 *
 * probability_tree — a left-to-right tree of two or three stages.
 * { branches: Node[];                                // the first split (2–4 branches)
 *   Node = { label: string;                          // printed at the branch's end ("Red", "H", "D′")
 *            p: number | 'a/b';                      // the probability ON the branch, printed as written
 *            show?: 'value' | 'blank' | 'none';      // 'blank' prints a "?" on the branch
 *            children?: Node[];                      // the next split (2–4); up to 3 stages
 *            outcome?: string;                       // a leaf's outcome, printed right of it ("HH")
 *            product?: 'value' | 'blank' | 'none' }; // a leaf's path probability, right of it
 *   products?: 'value' | 'blank' | 'none' ('none');  // the default of every leaf's `product`
 *   stageTitles?: string[];                          // a heading over each stage ("1st draw", "2nd draw")
 *   title?: string }
 * The probabilities of each split must total 1. A product is printed as a fraction when every
 * probability on its path was written as one, else as a decimal.
 */
import { FIGURE_WIDTH, LABEL_FS, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { INK, MUTED, blank, fractionText, numText, text, titleBlock } from './draw';

type Notes = NonNullable<FigureFacts['notes']>;
export type Shown = 'value' | 'blank' | 'none';
const SHOWNS: readonly Shown[] = ['value', 'blank', 'none'];
function readShown(r: Reader, v: unknown, name: string, dflt: Shown): Shown {
  if (v === undefined || v === null) return dflt;
  if (!SHOWNS.includes(v as Shown)) r.fail(`${name} must be one of ${SHOWNS.join(', ')}`);
  return v as Shown;
}

// ── venn_diagram ─────────────────────────────────────────────────────────────

export interface VennRegion {
  /** Bit i set ⇔ the region is inside sets[i]; 0 is the region outside every set. */
  mask: number;
  in: string[];
  value: number;
  show: Shown;
  shade: boolean;
}
export interface VennModel {
  sets: string[];
  regions: VennRegion[];
  values: 'count' | 'probability';
  universeLabel?: string;
  title?: string;
}

export function vennModel(r: Reader): VennModel {
  const p = r.p;
  const sets = r.list(p.sets, 'sets', 2, 3).map((s, i) => r.str(s, `sets[${i}]`, 20));
  if (new Set(sets).size !== sets.length) r.fail('sets: two sets have the same name');
  const values = p.values === undefined || p.values === null ? 'count' : p.values;
  if (values !== 'count' && values !== 'probability') r.fail('values must be count or probability');
  const seen = new Set<number>();
  const regions = r.list(p.regions, 'regions', 1, 1 << sets.length).map((raw, i) => {
    const o = r.obj(raw, `regions[${i}]`);
    if (!Array.isArray(o.in)) r.fail(`regions[${i}].in must be an array of set names ([] for the region outside every set)`);
    let mask = 0;
    const inside = (o.in as unknown[]).map((n, j) => {
      const name = r.str(n, `regions[${i}].in[${j}]`, 20);
      const k = sets.indexOf(name);
      if (k < 0) r.fail(`regions[${i}].in names "${name}", which is not one of the sets (${sets.join(', ')})`);
      mask |= 1 << k;
      return name;
    });
    if (seen.has(mask)) r.fail(`regions[${i}]: the region ${mask === 0 ? 'outside every set' : `inside ${inside.join(' and ')} only`} is listed twice`);
    seen.add(mask);
    const value = r.num(o.value, `regions[${i}].value`);
    if (value < 0) r.fail(`regions[${i}].value must not be negative`);
    if (values === 'count' && !Number.isInteger(value)) r.fail(`regions[${i}].value must be a whole number (values: 'count')`);
    if (values === 'probability' && value > 1) r.fail(`regions[${i}].value is a probability — it cannot be more than 1`);
    return { mask, in: inside, value, show: readShown(r, o.show, `regions[${i}].show`, 'value'), shade: r.bool(o.shade, `regions[${i}].shade`, false) };
  });
  if (values === 'probability' && regions.length === 1 << sets.length) {
    const total = regions.reduce((t, g) => t + g.value, 0);
    if (Math.abs(total - 1) > 1e-6) r.fail(`regions: the probabilities total ${numText(total, 4)}, not 1`);
  }
  return { sets, regions, values, universeLabel: r.optStr(p.universeLabel, 'universeLabel', 24), title: r.optStr(p.title, 'title') };
}

const VALUE_FS = 13;

export function renderVennDiagram(r: Reader, _uid?: string): Drawn {
  const m = vennModel(r);
  const W = FIGURE_WIDTH;
  const notes: Notes = [];
  const t = titleBlock(m.title, W);
  const three = m.sets.length === 3;
  const R = three ? 64 : 78;
  const box = { x0: 8, y0: t.top, x1: W - 8, y1: 0 };
  const cyTop = box.y0 + 26 + R;
  const centres: Array<[number, number]> = three ? [[140, cyTop], [220, cyTop], [180, cyTop + 68]] : [[132, cyTop], [228, cyTop]];
  box.y1 = three ? cyTop + 68 + R + 32 : cyTop + R + 26;
  // Where each region's number sits, by mask.
  const at: Record<number, [number, number]> = three
    ? { 1: [110, cyTop - 14], 2: [250, cyTop - 14], 4: [180, cyTop + 102], 3: [180, cyTop - 22], 5: [142, cyTop + 46], 6: [218, cyTop + 46], 7: [180, cyTop + 22], 0: [box.x1 - 26, box.y1 - 16] }
    : { 1: [98, cyTop], 2: [262, cyTop], 3: [180, cyTop], 0: [box.x1 - 26, box.y1 - 16] };
  const maskAt = (x: number, y: number): number => centres.reduce((k, [cx, cy], i) => (Math.hypot(x - cx, y - cy) < R ? k | (1 << i) : k), 0);
  const parts: string[] = [t.svg];

  // Shading: 45° lines, kept where the point is in a shaded region.
  const shaded = new Set(m.regions.filter((g) => g.shade).map((g) => g.mask));
  if (shaded.size > 0) {
    const segs: string[] = [];
    const step = 7 * Math.SQRT2;
    for (let c = box.x0 + box.y0; c <= box.x1 + box.y1; c += step) {
      let start: [number, number] | null = null;
      let last: [number, number] | null = null;
      for (let x = Math.max(box.x0 + 1, c - box.y1 + 1); x <= Math.min(box.x1 - 1, c - box.y0 - 1); x += 0.5) {
        const y = c - x;
        const on = shaded.has(maskAt(x, y));
        if (on && !start) start = [x, y];
        if (!on && start && last) {
          segs.push(`M${n2(start[0])},${n2(start[1])}L${n2(last[0])},${n2(last[1])}`);
          start = null;
        }
        last = on ? [x, y] : last;
      }
      if (start && last) segs.push(`M${n2(start[0])},${n2(start[1])}L${n2(last[0])},${n2(last[1])}`);
    }
    parts.push(`<path d="${segs.join('')}" fill="none" stroke="${MUTED}" stroke-width="1"/>`);
  }
  parts.push(`<rect x="${n2(box.x0)}" y="${n2(box.y0)}" width="${n2(box.x1 - box.x0)}" height="${n2(box.y1 - box.y0)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  for (const [cx, cy] of centres) parts.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${R}" fill="none" stroke="${INK}" stroke-width="1.8"/>`);

  /** A white plate under a label that sits on hatching (a halo alone leaves the lines too close). */
  const plate = (cx: number, cy: number, w: number, h: number): string =>
    (shaded.has(maskAt(cx, cy)) ? `<rect x="${n2(cx - w / 2)}" y="${n2(cy - h / 2)}" width="${n2(w)}" height="${n2(h)}" fill="#ffffff"/>` : '');
  // Set names: over the two upper circles (pushed outward), under the third.
  const nameAt: Array<[number, number]> = three ? [[104, box.y0 + 16], [256, box.y0 + 16], [180, box.y1 - 9]] : [[108, box.y0 + 17], [252, box.y0 + 17]];
  m.sets.forEach((name, i) => {
    const w = estWidth(name, LABEL_FS);
    let x = nameAt[i][0];
    x = Math.max(box.x0 + 6 + w / 2, Math.min(box.x1 - 6 - w / 2, x));
    parts.push(plate(x, nameAt[i][1] - LABEL_FS * 0.36, w + 6, LABEL_FS + 5) + text(x, nameAt[i][1], name, { fs: LABEL_FS, anchor: 'middle', weight: 600, halo: true }));
  });
  if (m.universeLabel) parts.push(plate(box.x0 + 8 + estWidth(m.universeLabel, TICK_FS) / 2, box.y1 - 9 - TICK_FS * 0.36, estWidth(m.universeLabel, TICK_FS) + 6, TICK_FS + 5) + text(box.x0 + 8, box.y1 - 9, m.universeLabel, { fs: TICK_FS, anchor: 'start', fill: MUTED, halo: true }));
  if (m.universeLabel && three && estWidth(m.universeLabel, TICK_FS) > 180 - estWidth(m.sets[2], LABEL_FS) / 2 - 22) notes.push({ code: 'labels_overlap', message: 'universeLabel runs into the name of the third set — shorten it' });

  for (const g of m.regions) {
    if (g.show === 'none') continue;
    const [x, y] = at[g.mask];
    if (g.show === 'blank') parts.push(blank(x, y, 22, 18, VALUE_FS));
    else {
      const s = numText(g.value, 4);
      if (estWidth(s, VALUE_FS) > (three ? 34 : 46)) notes.push({ code: 'crowded', message: `the value ${s} is wider than its region at phone width — use fewer digits` });
      parts.push(plate(x, y, estWidth(s, VALUE_FS) + 6, VALUE_FS + 5) + text(x, y + VALUE_FS * 0.36, s, { fs: VALUE_FS, anchor: 'middle', weight: 600, halo: true }));
    }
  }
  if (m.regions.filter((g) => g.show === 'blank').length > 1 && m.values === 'count' && !m.universeLabel) {
    // Two unknowns with nothing that ties them: say so, the picture is still drawn.
    notes.push({ code: 'ambiguous_blank', message: 'more than one region is a "?" — the question must say which one it asks for (shade it, or give a total)' });
  }
  return { body: parts.join(''), H: box.y1 + 8, facts: { curveCount: 0, marks: [], curves: [], notes } };
}

// ── probability_tree ─────────────────────────────────────────────────────────

export interface TreeNode {
  label: string;
  p: number;
  /** As written on the branch: "0.3", "2/5". */
  pText: string;
  /** Numerator / denominator when `p` was written as a fraction. */
  frac?: [number, number];
  show: Shown;
  children: TreeNode[];
  outcome?: string;
  product: Shown;
  /** The labels from the first split down to this node. */
  path: string[];
  /** The product of the probabilities along `path`. */
  pathP: number;
  pathText: string;
}
export interface TreeModel {
  branches: TreeNode[];
  leaves: TreeNode[];
  depth: number;
  stageTitles: string[];
  title?: string;
}

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

export function treeModel(r: Reader): TreeModel {
  const p = r.p;
  const productsDflt = readShown(r, p.products, 'products', 'none');
  const leaves: TreeNode[] = [];
  let depth = 0;
  const readSplit = (raw: unknown, name: string, level: number, path: string[], pathP: number, pathFrac: [number, number] | undefined): TreeNode[] => {
    const list = r.list(raw, name, 2, 4);
    if (level > 3) r.fail(`${name}: a tree has at most 3 stages at phone width`);
    depth = Math.max(depth, level);
    const nodes = list.map((rawNode, i) => {
      const o = r.obj(rawNode, `${name}[${i}]`);
      const label = r.str(o.label, `${name}[${i}].label`, 16);
      let pv: number;
      let pText: string;
      let frac: [number, number] | undefined;
      if (typeof o.p === 'string' && /^\s*\d+\s*\/\s*\d+\s*$/.test(o.p)) {
        const [a, b] = o.p.split('/').map((s) => Number(s.trim()));
        if (b === 0) r.fail(`${name}[${i}].p: a fraction cannot have denominator 0`);
        pv = a / b;
        pText = `${a}/${b}`;
        frac = [a, b];
      } else {
        pv = r.num(o.p, `${name}[${i}].p`);
        pText = numText(pv, 4);
      }
      if (!(pv >= 0 && pv <= 1)) r.fail(`${name}[${i}].p must be a probability between 0 and 1 (a number, or "a/b")`);
      const nextFrac: [number, number] | undefined = frac && (level === 1 || pathFrac) ? [(pathFrac?.[0] ?? 1) * frac[0], (pathFrac?.[1] ?? 1) * frac[1]] : undefined;
      const here = pathP * pv;
      const node: TreeNode = {
        label, p: pv, pText, frac, show: readShown(r, o.show, `${name}[${i}].show`, 'value'), children: [], outcome: r.optStr(o.outcome, `${name}[${i}].outcome`, 14),
        product: readShown(r, o.product, `${name}[${i}].product`, productsDflt), path: [...path, label], pathP: here,
        pathText: nextFrac ? fractionText(nextFrac[0], nextFrac[1]) : numText(here, 4),
      };
      if (o.children !== undefined && o.children !== null) {
        if (node.outcome) r.fail(`${name}[${i}].outcome: only a leaf (a branch with no children) has an outcome`);
        node.children = readSplit(o.children, `${name}[${i}].children`, level + 1, node.path, here, nextFrac);
      } else leaves.push(node);
      return node;
    });
    const total = nodes.reduce((t, n) => t + n.p, 0);
    if (Math.abs(total - 1) > 1e-6) r.fail(`${name}: the probabilities of one split total ${numText(total, 4)}, not 1`);
    if (new Set(nodes.map((n) => n.label)).size !== nodes.length) r.fail(`${name}: two branches of one split have the same label`);
    return nodes;
  };
  const branches = readSplit(p.branches, 'branches', 1, [], 1, undefined);
  if (leaves.length > 12) r.fail(`branches: the tree ends in ${leaves.length} leaves — at most 12 are legible at phone width`);
  const stageTitles = (p.stageTitles === undefined || p.stageTitles === null ? [] : r.list(p.stageTitles, 'stageTitles', 1, depth)).map((s, i) => r.str(s, `stageTitles[${i}]`, 14));
  return { branches, leaves, depth, stageTitles, title: r.optStr(p.title, 'title') };
}

const NODE_FS = 12;

export function renderProbabilityTree(r: Reader, _uid?: string): Drawn {
  const m = treeModel(r);
  const W = FIGURE_WIDTH;
  const notes: Notes = [];
  const t = titleBlock(m.title, W);
  const parts: string[] = [t.svg];
  // Rows: 28 apart when there are many leaves; a small tree is opened up so its fans are not flat.
  const ROW = m.leaves.length <= 4 ? 36 : 28;
  // Column widths: the widest label of each stage, and the widest thing printed right of a leaf.
  const labelW: number[] = Array.from({ length: m.depth }, () => 0);
  let widestP = 0;
  const walk = (nodes: TreeNode[], level: number): void => {
    for (const n of nodes) {
      labelW[level] = Math.max(labelW[level], estWidth(n.label, NODE_FS));
      widestP = Math.max(widestP, n.show === 'value' ? estWidth(n.pText, TICK_FS) : n.show === 'blank' ? 20 : 0);
      walk(n.children, level + 1);
    }
  };
  walk(m.branches, 0);
  const leafText = (n: TreeNode): string => [n.outcome, n.product === 'value' ? n.pathText : n.product === 'blank' ? '???' : ''].filter(Boolean).join('   ');
  const extra = Math.max(0, ...m.leaves.map((n) => estWidth(leafText(n), TICK_FS)));
  const x0 = 12;
  const fixed = labelW.reduce((s, w) => s + w + 12, 0) + (extra > 0 ? extra + 14 : 0) + x0 + 6;
  const seg = (W - fixed) / m.depth;
  const need = Math.max(44, widestP + 22);
  if (seg < need) r.fail(`the tree does not fit a phone-width card: each stage has ${numText(seg, 0)} units for its branches and needs ${numText(need, 0)} — shorten the labels or outcomes, or drop a stage`);
  const colX: number[] = [];
  let x = x0;
  for (let k = 0; k < m.depth; k++) {
    x += seg;
    colX.push(x);
    x += labelW[k] + 12;
  }
  const top = t.top + (m.stageTitles.length ? 20 : 4);
  m.stageTitles.forEach((s, k) => {
    const cx = colX[k] - seg / 2;
    if (estWidth(s, TICK_FS) > seg + labelW[k]) notes.push({ code: 'labels_overlap', message: `stageTitles[${k}] is wider than its stage — shorten it` });
    parts.push(text(cx, t.top + 12, s, { fs: TICK_FS, anchor: 'middle', fill: MUTED, weight: 600 }));
  });
  // Rows: leaves evenly spaced; a parent sits at the middle of its children.
  let row = 0;
  const yOf = new Map<TreeNode, number>();
  const place = (nodes: TreeNode[]): void => {
    for (const n of nodes) {
      if (n.children.length === 0) yOf.set(n, top + ROW / 2 + ROW * row++);
      else {
        place(n.children);
        yOf.set(n, ((yOf.get(n.children[0]) as number) + (yOf.get(n.children[n.children.length - 1]) as number)) / 2);
      }
    }
  };
  place(m.branches);
  const rootY = ((yOf.get(m.branches[0]) as number) + (yOf.get(m.branches[m.branches.length - 1]) as number)) / 2;
  const lines: string[] = [];
  const over: string[] = [];
  const draw = (nodes: TreeNode[], level: number, px: number, py: number): void => {
    for (const n of nodes) {
      const cx = colX[level];
      const cy = yOf.get(n) as number;
      lines.push(`M${n2(px)},${n2(py)}L${n2(cx)},${n2(cy)}`);
      const lx = px + (cx - px) * 0.6;
      const ly = py + (cy - py) * 0.6;
      if (n.show === 'blank') over.push(blank(lx, ly, 20, 15, TICK_FS));
      else if (n.show === 'value') {
        // A white plate breaks the branch under the number (a halo alone leaves the line through it).
        const w = estWidth(n.pText, TICK_FS) + 4;
        over.push(`<rect x="${n2(lx - w / 2)}" y="${n2(ly - TICK_FS / 2 - 1)}" width="${n2(w)}" height="${TICK_FS + 2}" fill="#ffffff"/>` + text(lx, ly + TICK_FS * 0.36, n.pText, { fs: TICK_FS, anchor: 'middle' }));
      }
      over.push(text(cx + 5, cy + NODE_FS * 0.36, n.label, { fs: NODE_FS, anchor: 'start', weight: 600 }));
      if (n.children.length > 0) draw(n.children, level + 1, cx + labelW[level] + 10, cy);
      else {
        let ex = cx + 5 + estWidth(n.label, NODE_FS) + 12;
        // Leaves of a shorter branch line their outcomes up with the others.
        ex = Math.max(ex, W - 6 - extra);
        if (n.outcome) {
          over.push(text(ex, cy + TICK_FS * 0.36, n.outcome, { fs: TICK_FS, anchor: 'start', fill: MUTED }));
          ex += estWidth(`${n.outcome}   `, TICK_FS);
        }
        if (n.product === 'value') over.push(text(ex, cy + TICK_FS * 0.36, n.pathText, { fs: TICK_FS, anchor: 'start' }));
        else if (n.product === 'blank') over.push(blank(ex + 10, cy, 20, 15, TICK_FS));
      }
    }
  };
  draw(m.branches, 0, x0, rootY);
  parts.push(`<path d="${lines.join('')}" fill="none" stroke="${INK}" stroke-width="1.4"/>`, `<circle cx="${n2(x0)}" cy="${n2(rootY)}" r="2.6" fill="${INK}"/>`, over.join(''));
  return { body: parts.join(''), H: top + ROW * m.leaves.length + 8, facts: { curveCount: 0, marks: [], curves: [], notes } };
}
