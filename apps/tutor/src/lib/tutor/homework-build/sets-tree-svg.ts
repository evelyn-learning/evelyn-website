/**
 * Static SVG thumbnails of the Venn-diagram and tree-diagram homework figures
 * (showVennDiagram, showTree), for the homework list (spec 2026-10-21 §4.6
 * option (b)). The board draws these with VennDiagramRenderer / TreeRenderer,
 * which use hooks and are not refactored (GAC freeze); this is a small
 * hand-written writer in the board's DIAGRAM_COLORS. Venn: the renderer's
 * circle layout and region anchors (500×400). Tree: top-down, leaves spread
 * evenly, the stated probability and label on each branch. Draws only what
 * the figure states: never a leaf probability product. Bounded: at most
 * TREE_MAX_DEPTH levels and TREE_MAX_BRANCHES branches per node are drawn.
 * Never throws: anything it cannot draw gives null.
 */

import { DIAGRAM_COLORS as C } from '../diagrams/theme';
import { TREE_MAX_BRANCHES, TREE_MAX_DEPTH } from './figure-validate-data';
import { clip, esc, fmt, svgDoc } from './svg-util';
import type { FigureCommand } from './types';

type Venn = Extract<FigureCommand, { action: 'showVennDiagram' }>;
type Tree = Extract<FigureCommand, { action: 'showTree' }>;

const SET_COLORS = [C.primary, C.secondary, C.success];
const color = (c: unknown, i: number) => (typeof c === 'string' && /^#[0-9a-f]{3,8}$/i.test(c) ? c : SET_COLORS[i]);
const str = (v: unknown): string => (typeof v === 'string' ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : '');

// VennDiagramRenderer TWO_SET / THREE_SET and the region centres.
const TWO = [{ cx: 180, cy: 200, r: 120 }, { cx: 320, cy: 200, r: 120 }];
const THREE = [{ cx: 200, cy: 170, r: 110 }, { cx: 300, cy: 170, r: 110 }, { cx: 250, cy: 260, r: 110 }];
const TWO_AT: Record<string, [number, number]> = { onlyA: [140, 200], onlyB: [360, 200], intersection: [250, 200], neither: [60, 50] };
const THREE_AT: Record<string, [number, number]> = {
  onlyA: [160, 140], onlyB: [340, 140], onlyC: [250, 310], AB: [250, 145], AC: [200, 250], BC: [300, 250], ABC: [250, 210], neither: [60, 50],
};

export function vennToSvg(fig: Venn): string | null {
  try {
    const sets = (fig as unknown as { sets?: unknown }).sets;
    if (!Array.isArray(sets) || sets.length < 2) return null;
    const three = sets.length >= 3;
    const circles = three ? THREE : TWO;
    const at = three ? THREE_AT : TWO_AT;
    const W = 500, H = three ? 420 : 400;
    const out: string[] = [`<rect x="10" y="10" width="480" height="${H - 20}" rx="6" fill="${C.white}" stroke="${C.axis}" stroke-width="1.5"></rect>`];
    const title = str((fig as unknown as { title?: unknown }).title);
    if (title) out.push(`<text x="250" y="30" text-anchor="middle" font-size="16" font-weight="600" fill="${C.text}">${esc(clip(title, 50))}</text>`);
    const uni = str((fig as unknown as { universalLabel?: unknown }).universalLabel);
    if (uni) out.push(`<text x="482" y="${H - 18}" text-anchor="end" font-size="13" fill="${C.muted}">${esc(clip(uni, 40))}</text>`);
    circles.forEach((c, i) => {
      const s = (sets[i] ?? {}) as { label?: unknown; color?: unknown };
      const col = color(s.color, i);
      out.push(`<circle data-set="${i}" cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="${col}" fill-opacity="0.12" stroke="${col}" stroke-width="2"></circle>`);
      const label = str(s.label);
      // Labels above the top circles, below the bottom one.
      const ly = three && i === 2 ? c.cy + c.r + 18 : c.cy - c.r - 8;
      if (label) out.push(`<text x="${c.cx}" y="${ly}" text-anchor="middle" font-size="15" font-weight="600" fill="${col}">${esc(clip(label, 24))}</text>`);
    });
    const regions = (fig as unknown as { regions?: unknown }).regions;
    if (regions && typeof regions === 'object' && !Array.isArray(regions)) {
      for (const [k, raw] of Object.entries(regions as Record<string, unknown>)) {
        const p = at[k];
        if (!p || !raw || typeof raw !== 'object') continue;
        const r = raw as { value?: unknown; items?: unknown };
        const value = str(r.value);
        const items = Array.isArray(r.items) ? r.items.map(str).filter(Boolean) : [];
        let y = p[1] + (value && items.length ? -4 : 5);
        if (value) { out.push(`<text x="${p[0]}" y="${fmt(y)}" text-anchor="middle" font-size="18" font-weight="600" fill="${C.text}">${esc(clip(value, 12))}</text>`); y += 18; }
        if (items.length) out.push(`<text x="${p[0]}" y="${fmt(y)}" text-anchor="middle" font-size="12" fill="${C.text}">${esc(clip(items.join(', '), 20))}</text>`);
      }
    }
    return svgDoc(W, H, out);
  } catch {
    return null;
  }
}

interface Laid { label: string; value: string; x: number; y: number; kids: Array<{ label: string; probability: string; node: Laid }> }

const LEVEL_H = 90, LEAF_W = 90, BOX_H = 30, CHAR = 7;

export function treeToSvg(fig: Tree): string | null {
  try {
    const root = (fig as unknown as { root?: unknown }).root;
    if (!root || typeof root !== 'object' || Array.isArray(root)) return null;
    let nextLeaf = 0;
    let maxDepth = 0;
    // Post-order: a leaf takes the next slot, a parent sits over its children.
    const lay = (raw: unknown, depth: number): Laid => {
      const n = (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}) as Record<string, unknown>;
      maxDepth = Math.max(maxDepth, depth);
      const kids = depth < TREE_MAX_DEPTH && Array.isArray(n.children)
        ? n.children.filter((c): c is Record<string, unknown> => !!c && typeof c === 'object' && !Array.isArray(c) && !!(c as { node?: unknown }).node && typeof (c as { node?: unknown }).node === 'object')
          .slice(0, TREE_MAX_BRANCHES)
          .map((c) => ({ label: str(c.label), probability: str(c.probability), node: lay(c.node, depth + 1) }))
        : [];
      const x = kids.length ? (kids[0].node.x + kids[kids.length - 1].node.x) / 2 : 50 + LEAF_W * nextLeaf++;
      return { label: str(n.label), value: str(n.value), x, y: 30 + depth * LEVEL_H + BOX_H / 2, kids };
    };
    const laid = lay(root, 0);
    const title = str((fig as unknown as { title?: unknown }).title);
    const top = title ? 30 : 0;
    const W = Math.max(200, 100 + LEAF_W * Math.max(0, nextLeaf - 1));
    const H = top + 60 + maxDepth * LEVEL_H + BOX_H;
    const out: string[] = [];
    if (title) out.push(`<text x="${fmt(W / 2)}" y="22" text-anchor="middle" font-size="15" font-weight="600" fill="${C.text}">${esc(clip(title, 50))}</text>`);
    const lines: string[] = [], nodes: string[] = [];
    const draw = (n: Laid) => {
      const y = n.y + top;
      for (const k of n.kids) {
        const ky = k.node.y + top;
        lines.push(`<line data-branch="1" x1="${fmt(n.x)}" y1="${fmt(y + BOX_H / 2)}" x2="${fmt(k.node.x)}" y2="${fmt(ky - BOX_H / 2)}" stroke="${C.axis}" stroke-width="1.5"></line>`);
        const mx = (n.x + k.node.x) / 2, my = (y + ky) / 2;
        const side = k.node.x < n.x ? -1 : k.node.x > n.x ? 1 : 0;
        const anchor = side < 0 ? 'end' : side > 0 ? 'start' : 'middle';
        const tx = fmt(mx + side * 6);
        if (k.probability) lines.push(`<text x="${tx}" y="${fmt(my - 2)}" text-anchor="${anchor}" font-size="12" font-weight="600" fill="${C.primary}">${esc(clip(k.probability, 12))}</text>`);
        if (k.label) lines.push(`<text x="${tx}" y="${fmt(my + 12)}" text-anchor="${anchor}" font-size="11" fill="${C.muted}">${esc(clip(k.label, 16))}</text>`);
        draw(k.node);
      }
      const label = clip(n.label, 14), value = clip(n.value, 12);
      const w = Math.max(44, CHAR * Math.max(label.length, value.length) + 16);
      nodes.push(`<g data-node="1"><rect x="${fmt(n.x - w / 2)}" y="${fmt(y - BOX_H / 2)}" width="${fmt(w)}" height="${BOX_H}" rx="6" fill="${C.panel}" stroke="${C.border}" stroke-width="1"></rect>`
        + (label ? `<text x="${fmt(n.x)}" y="${fmt(y + (value ? -1 : 4))}" text-anchor="middle" font-size="13" fill="${C.text}">${esc(label)}</text>` : '')
        + (value ? `<text x="${fmt(n.x)}" y="${fmt(y + 11)}" text-anchor="middle" font-size="10" fill="${C.muted}">${esc(value)}</text>` : '')
        + '</g>');
    };
    draw(laid);
    return svgDoc(W, H, [...out, ...lines, ...nodes]);
  } catch {
    return null;
  }
}
