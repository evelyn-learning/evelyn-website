/**
 * phylogenetic_tree — a rooted cladogram in the rectangular layout: the root
 * on the left, every tip in one column on the right.
 *
 * { tree: Clade;
 *   outgroup?: string;                  // the name of a tip that branches off at the root; printed "(outgroup)" after it
 *   nodeDots?: boolean;                 // a dot on every internal node (default: only on labelled nodes)
 *   traitStyle?: 'auto' | 'label' | 'key';   // trait names on the branches, or numbered ticks with a key under the tree
 *                                       //   ('auto': names when they all fit clear of the tree, else the key)
 *   letterLabels?: 'numerals' | 'roman'; // print single-letter node labels as 1, 2, 3 … or I, II, III … (so they
 *                                       //   cannot be taken for the option letters of a multiple-choice question)
 *   title?: string }
 *
 * Clade = string                        // a tip
 *       | { name: string;               // a tip …
 *           blank?: boolean;            //   … whose name is replaced by a "?" box (the name is the answer)
 *           traits?: Trait[] }          //   derived traits marked on the branch leading to it, root side first
 *       | { children: Clade[];          // an internal node, 2–4 children (top to bottom)
 *           node?: string;              //   its label ("A", "1") — drawn with a dot
 *           traits?: Trait[] }
 * Trait = string | { label: string; blank?: boolean }
 *
 * A cladogram: branch lengths mean nothing, only the branching order. Tips
 * are drawn in the order given (the first tip at the top). 2–12 tips.
 */
import { FIGURE_WIDTH, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, Placer, segmentBoxes, text, textBox, titleBlock, type Box, type Candidate } from './draw';
import { facts, lab, labBox, stroke, type Notes } from './draw2';
import { letterAs, readLetterLabels } from './batch3';

export interface PhyloTrait { label: string; blank: boolean }
export interface PhyloNode {
  /** Tip name (tips only). */
  name?: string;
  /** Label of an internal node. */
  node?: string;
  blank: boolean;
  traits: PhyloTrait[];
  children: PhyloNode[];
  parent?: PhyloNode;
  /** Names of the tips under (or at) this node, top to bottom. */
  tips: string[];
  /** Longest path to a tip, in branches. */
  height: number;
  /** Row of a tip; mean of the children's for an internal node. */
  row: number;
}
export interface PhyloModel {
  root: PhyloNode;
  tips: PhyloNode[];
  internals: PhyloNode[];
  outgroup?: string;
  nodeDots: boolean;
  traitStyle: 'auto' | 'label' | 'key';
  title?: string;
}

export function phyloModel(r: Reader): PhyloModel {
  const p = r.p;
  const letters = readLetterLabels(r);
  const tips: PhyloNode[] = [];
  const internals: PhyloNode[] = [];
  const traitsOf = (v: unknown, at: string): PhyloTrait[] => (v === undefined || v === null ? [] : r.list(v, `${at}.traits`, 0, 3)).map((raw, i) => {
    if (typeof raw === 'string') return { label: r.str(raw, `${at}.traits[${i}]`, 24), blank: false };
    const o = r.obj(raw, `${at}.traits[${i}]`);
    return { label: r.str(o.label, `${at}.traits[${i}].label`, 24), blank: r.bool(o.blank, `${at}.traits[${i}].blank`, false) };
  });
  const read = (raw: unknown, at: string, depth: number): PhyloNode => {
    if (depth > 10) r.fail(`${at}: nested more than ten deep`);
    const o = typeof raw === 'string' ? { name: raw } : r.obj(raw, at);
    if (o.children === undefined) {
      const name = r.str(o.name, `${at}.name`, 22);
      if (tips.some((t) => t.name === name)) r.fail(`${at}: the tip "${name}" appears twice`);
      const tip: PhyloNode = { name, blank: r.bool(o.blank, `${at}.blank`, false), traits: traitsOf(o.traits, at), children: [], tips: [name], height: 0, row: tips.length };
      tips.push(tip);
      return tip;
    }
    if (o.name !== undefined) r.fail(`${at}: an internal node is labelled with "node", not "name"`);
    const kids = r.list(o.children, `${at}.children`, 2, 4).map((c, i) => read(c, `${at}.children[${i}]`, depth + 1));
    const node: PhyloNode = {
      node: letterAs(r.optStr(o.node, `${at}.node`, 6), letters), blank: false, traits: traitsOf(o.traits, at), children: kids,
      tips: kids.flatMap((k) => k.tips), height: Math.max(...kids.map((k) => k.height)) + 1, row: kids.reduce((a, k) => a + k.row, 0) / kids.length,
    };
    if (node.node && internals.some((n) => n.node === node.node)) r.fail(`${at}.node: the label "${node.node}" is used twice`);
    kids.forEach((k) => { k.parent = node; });
    internals.push(node);
    return node;
  };
  const root = read(p.tree, 'tree', 0);
  if (root.children.length === 0) r.fail('tree: a single tip is not a tree');
  if (tips.length > 12) r.fail(`tree: ${tips.length} tips — at most 12`);
  const outgroup = r.optStr(p.outgroup, 'outgroup', 22);
  if (outgroup !== undefined && !root.children.some((c) => c.name === outgroup)) r.fail(`outgroup: "${outgroup}" must be a tip that branches off at the root`);
  if (p.traitStyle !== undefined && !['auto', 'label', 'key'].includes(p.traitStyle as string)) r.fail("traitStyle must be 'auto', 'label' or 'key'");
  return {
    root, tips, internals, outgroup,
    nodeDots: r.bool(p.nodeDots, 'nodeDots', false),
    traitStyle: (p.traitStyle as PhyloModel['traitStyle']) ?? 'auto',
    title: r.optStr(p.title, 'title', 160),
  };
}

/** Every trait of the tree in drawing order (root first, then top to bottom), with the node it is on. */
export function phyloTraits(m: PhyloModel): Array<{ trait: PhyloTrait; on: PhyloNode }> {
  const out: Array<{ trait: PhyloTrait; on: PhyloNode }> = [];
  const walk = (n: PhyloNode) => {
    n.traits.forEach((trait) => out.push({ trait, on: n }));
    n.children.forEach(walk);
  };
  walk(m.root);
  return out;
}

export function renderPhyloTree(r: Reader): Drawn {
  const m = phyloModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const traits = phyloTraits(m);
  const tipText = (n: PhyloNode): string => (n.blank ? '?' : (n.name as string));
  const OUT = ' (outgroup)';
  const labelW = Math.max(...m.tips.map((n) => estWidth(n.blank ? '???' : (n.name as string), 12) + (n.name === m.outgroup ? estWidth(OUT, TICK_FS) : 0)));
  const xTip = W - 10 - labelW - 7;
  const stub = m.root.traits.length ? 30 + 22 * m.root.traits.length : 14;
  const xRoot = 8 + stub;
  const dx = (xTip - xRoot) / m.root.height;
  if (dx < 26) notes.push({ code: 'crowded', message: `tree: ${m.root.height} levels leave ${Math.floor(dx)} units per branch at 340 px — shorten the tip names or flatten the tree` });
  const pitch = traits.length ? 30 : 26;
  const y0 = t.top + 16;
  const X = (n: PhyloNode) => xTip - n.height * dx;
  const Y = (n: PhyloNode) => y0 + n.row * pitch;
  const lines: string[] = [];
  const blocks: Box[] = [];
  const all = [...m.internals, ...m.tips];
  for (const n of all) {
    const x1 = n.parent ? X(n.parent) : X(n) - stub;
    lines.push(`M${n2(x1)},${n2(Y(n))}H${n2(X(n))}`);
    blocks.push(...segmentBoxes(x1, Y(n), X(n), Y(n), 1.5));
    if (n.children.length) {
      const ys = n.children.map(Y);
      lines.push(`M${n2(X(n))},${n2(Math.min(...ys))}V${n2(Math.max(...ys))}`);
      blocks.push(...segmentBoxes(X(n), Math.min(...ys), X(n), Math.max(...ys), 1.5));
    }
  }
  const parts: string[] = [];
  const placer = new Placer({ x0: 2, y0: t.top, x1: W - 2, y1: y0 + (m.tips.length - 1) * pitch + 16 });
  placer.block(...blocks);
  for (const n of m.tips) {
    const s = tipText(n);
    const y = Y(n) + 12 * 0.36;
    parts.push(lab(xTip + 7, y, s, 'start', { fs: 12, weight: 600 }));
    const b = labBox(xTip + 7, y, s, 'start', 12);
    placer.block(b);
    if (n.name === m.outgroup) {
      parts.push(text(b.x1 + 4, y, OUT.trim(), { fill: MUTED }));
      placer.block(textBox(b.x1 + 4, y, OUT, TICK_FS));
    }
  }
  for (const n of m.internals) {
    if (!n.node && !m.nodeDots) continue;
    parts.push(`<circle cx="${n2(X(n))}" cy="${n2(Y(n))}" r="3.4" fill="${INK}"/>`);
    placer.block({ x0: X(n) - 4, y0: Y(n) - 4, x1: X(n) + 4, y1: Y(n) + 4 });
    if (!n.node) continue;
    const c: Candidate[] = [
      { x: X(n) - 5, y: Y(n) - 5, anchor: 'end' }, { x: X(n) - 5, y: Y(n) + 13, anchor: 'end' },
      { x: X(n) + 6, y: Y(n) - 5, anchor: 'start' }, { x: X(n) + 6, y: Y(n) + 13, anchor: 'start' },
    ];
    const at = placer.place(n.node, 12, c);
    if (!at.clean) notes.push({ code: 'labels_overlap', message: `the node label "${n.node}" could not be set clear of the tree` });
    parts.push(text(at.x, at.y, n.node, { fs: 12, anchor: at.anchor, weight: 700, halo: true }));
  }
  // Trait ticks: on the branch leading to the node, root side first.
  const ticks = traits.map(({ trait, on }, i) => {
    const mine = on.traits;
    const k = mine.indexOf(trait);
    const x1 = on.parent ? X(on.parent) : X(on) - stub;
    const x = x1 + ((X(on) - x1) * (k + 1)) / (mine.length + 1);
    return { trait, x, y: Y(on), number: String(i + 1) };
  });
  const tickMarks = ticks.map((k) => `M${n2(k.x)},${n2(k.y - 6)}v12`).join('');
  ticks.forEach((k) => placer.block({ x0: k.x - 2, y0: k.y - 6, x1: k.x + 2, y1: k.y + 6 }));
  const candidates = (k: { x: number; y: number }): Candidate[] => [
    { x: k.x, y: k.y - 10.5, anchor: 'middle' }, { x: k.x - 3, y: k.y - 10.5, anchor: 'start' }, { x: k.x + 3, y: k.y - 10.5, anchor: 'end' },
    { x: k.x, y: k.y + 18, anchor: 'middle' }, { x: k.x - 3, y: k.y + 18, anchor: 'start' }, { x: k.x + 3, y: k.y + 18, anchor: 'end' },
  ];
  let useKey = m.traitStyle === 'key';
  let traitSvg: string[] = [];
  if (!useKey && ticks.length) {
    // Try the names on the branches (on a copy of the placer's state: a failed try must leave no trace).
    const trial = new Placer({ x0: 2, y0: t.top, x1: W - 2, y1: y0 + (m.tips.length - 1) * pitch + 16 });
    trial.block(...blocks);
    for (const n of m.tips) trial.block(labBox(xTip + 7, Y(n) + 4, n.blank ? '?' : (n.name as string), 'start', 12));
    ticks.forEach((k) => trial.block({ x0: k.x - 2, y0: k.y - 6, x1: k.x + 2, y1: k.y + 6 }));
    let clean = true;
    const svg: string[] = [];
    for (const k of ticks) {
      const s = k.trait.blank ? '?' : k.trait.label;
      const at = trial.place(s === '?' ? '???' : s, TICK_FS, candidates(k));
      if (!at.clean) clean = false;
      svg.push(lab(at.x, at.y, s, at.anchor, { halo: true }));
    }
    if (clean || m.traitStyle === 'label') {
      traitSvg = svg;
      if (!clean) notes.push({ code: 'labels_overlap', message: "a trait name could not be set clear of the tree — use traitStyle 'key' or shorter names" });
    } else useKey = true;
  }
  let H = y0 + (m.tips.length - 1) * pitch + 18;
  if (useKey && ticks.length) {
    for (const k of ticks) {
      const at = placer.place(k.number, TICK_FS, candidates(k));
      traitSvg.push(text(at.x, at.y, k.number, { anchor: at.anchor, weight: 700, halo: true }));
    }
    parts.push(`<path d="M8,${n2(H)}H${n2(W - 8)}" ${stroke('#cbd5e1', 1)}/>`);
    H += 4;
    let x = 10;
    let y = H + TICK_FS + 2;
    for (const k of ticks) {
      const entry = `${k.number} = ${k.trait.blank ? '?' : k.trait.label}`;
      const w = estWidth(entry, TICK_FS) + 14;
      if (x > 10 && x + w > W - 6) {
        x = 10;
        y += TICK_FS + 7;
      }
      parts.push(text(x, y, entry, {}));
      x += w;
    }
    H = y + 10;
  }
  if (m.tips.length > 10) notes.push({ code: 'too_many_elements', message: `tree: ${m.tips.length} tips — more than 10 make a tall figure on a phone` });
  const body = t.svg + `<path d="${lines.join('')}" ${stroke(INK, 1.8)} stroke-linecap="round"/>`
    + (tickMarks ? `<path d="${tickMarks}" ${stroke(INK, 3)}/>` : '') + parts.join('') + traitSvg.join('');
  return { body, H, facts: facts(notes) };
}
