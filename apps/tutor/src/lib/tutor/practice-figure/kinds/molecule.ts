/**
 * molecular_structure — Lewis structures, skeletal structures and small
 * groups of molecules, drawn from an EXPLICIT atom list. Nothing is laid out
 * from a formula: every atom has coordinates, a place in a named layout, or a
 * position relative to another atom — or the spec is refused.
 *
 * { molecules: Molecule[];               // 1–3
 *   arrangement?: 'panels' | 'shared';   // ('panels'; 'shared' when there are hbonds) side by side, each
 *                                        //   on its own — or all in ONE coordinate frame (`origin` places each)
 *   between?: 'resonance' | 'none';      // ('none') a double-headed arrow between neighbouring panels
 *   hbonds?: Array<{ from: { mol: index; atom: id }; to: { mol: index; atom: id } }>;   // dotted lines ('shared')
 *   showLonePairs?: boolean (true); showFormalCharges?: boolean (true);   // switch every set / mark off at once
 *   title?: string }
 * Molecule = {
 *   atoms: Array<{ id: string; el: string;        // element symbol ("C", "Cl")
 *                  x?: number; y?: number;        // in bond lengths, y up — OR
 *                  from?: id; angle?: number; length?: number (1);   // relative to another atom, degrees
 *                                                 //   counter-clockwise from "right" — OR placed by `layout`
 *                  lonePairs?: 0–4;               // drawn as pairs of dots in the widest gaps between the bonds
 *                  h?: 0–4;                       // hydrogens written with the symbol ("OH", "NH₂")
 *                  charge?: number;               // formal charge; with lonePairs it is COMPUTED and this must agree
 *                  partial?: '+' | '-';           // δ+ / δ−
 *                  show?: { label?, lonePairs?, charge?: 'value' | 'blank' | 'none' } }>;
 *   bonds: Array<{ a: id; b: id; order?: 1 | 2 | 3 (1);
 *                  style?: 'plain' | 'wedge' | 'dash';   // a solid / hashed wedge, narrow at `a`
 *                  show?: 'value' | 'blank';             // 'blank': one dashed line with a "?" box (the order is asked)
 *                  dipole?: 'to_a' | 'to_b' }>;          // a crossed arrow beside the bond, pointing at the δ− end
 *   layout?: { type: 'linear' | 'bent' | 'trigonal_planar' | 'tetrahedral' | 'trigonal_pyramidal';
 *              center: id; around: id[]; angle?: number (104.5, bent only) }
 *          | { type: 'chain'; atoms: id[] }       // a zig-zag, 120° at every atom
 *          | { type: 'ring'; atoms: id[] };       // a regular polygon, 3–8 atoms
 *   skeletal?: boolean (false);          // carbons are unlabelled corners; their hydrogens are implied
 *   highlight?: Array<{ atoms: id[]; label?: string }>;   // a dashed outline round a group (not colour)
 *   label?: string;                      // a caption under the molecule ("I", "A"; "?" = a blank box)
 *   origin?: [x, y];                     // 'shared' only: where its (0, 0) sits in the common frame
 *   center?: id }                        // the central atom, for the geometry / polarity checkers
 *
 * tetrahedral: around[0] up and around[1] lower left in the plane, around[2]
 * on a solid wedge (toward the viewer), around[3] on a hashed wedge (away).
 * trigonal_pyramidal: around[0] in the plane, [1] wedge, [2] hashed.
 * Formal charge = valence electrons − 2 × lone pairs − bond orders − hydrogens;
 * a non-zero one is drawn as a ringed + or − beside its atom.
 */
import { FIGURE_WIDTH, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, arrow, blank, inkWidth, text, titleBlock, type Box } from './draw';
import { SHOWS, deg, facts, head, lab, stroke, type Notes, type Pt, type Show } from './draw2';

export const VALENCE: Record<string, number> = { H: 1, Li: 1, Na: 1, K: 1, Be: 2, Mg: 2, B: 3, Al: 3, C: 4, Si: 4, N: 5, P: 5, As: 5, O: 6, S: 6, Se: 6, F: 7, Cl: 7, Br: 7, I: 7, Xe: 8, Kr: 8 };
const LAYOUTS = ['linear', 'bent', 'trigonal_planar', 'tetrahedral', 'trigonal_pyramidal', 'chain', 'ring'] as const;
const AROUND: Record<string, number[]> = { linear: [180, 0], trigonal_planar: [90, 210, 330], tetrahedral: [90, 205, 285, 345], trigonal_pyramidal: [205, 285, 345] };

export interface MolAtom {
  id: string;
  el: string;
  x: number;
  y: number;
  lonePairs?: number;
  /** Hydrogens written with the symbol, and those implied on a skeletal carbon. */
  h: number;
  implicitH: number;
  /** Formal charge: computed when lonePairs are given, else as given (0). */
  charge: number;
  partial?: '+' | '-';
  show: { label: Show; lonePairs: Show; charge: Show };
}
export interface MolBond { a: number; b: number; order: 1 | 2 | 3; style: 'plain' | 'wedge' | 'dash'; show: 'value' | 'blank'; dipole?: 'to_a' | 'to_b' }
export interface Molecule {
  label?: string;
  atoms: MolAtom[];
  bonds: MolBond[];
  skeletal: boolean;
  highlight: Array<{ atoms: number[]; label?: string }>;
  center?: string;
  origin: Pt;
}
export interface MoleculeModel {
  molecules: Molecule[];
  arrangement: 'panels' | 'shared';
  between: 'resonance' | 'none';
  hbonds: Array<{ from: [number, number]; to: [number, number] }>;
  title?: string;
}

const minus = (v: number): string => String(v).replace(/^-/, '−');
export const atomIndex = (mol: Molecule, id: string): number => mol.atoms.findIndex((a) => a.id === id);
/** Sum of the bond orders at an atom, and its neighbours. */
export const bondsAt = (mol: Molecule, i: number): MolBond[] => mol.bonds.filter((b) => b.a === i || b.b === i);
export const bondOrderSum = (mol: Molecule, i: number): number => bondsAt(mol, i).reduce((s, b) => s + b.order, 0);

/** The formal charge on an atom (by id). */
export function formalCharge(mol: Molecule, id: string): number {
  return mol.atoms[atomIndex(mol, id)].charge;
}

export interface Vsepr { steric: number; lonePairs: number; electron: string; molecular: string; hybridisation: string }
const ELECTRON: Record<number, [string, string]> = { 2: ['linear', 'sp'], 3: ['trigonal planar', 'sp2'], 4: ['tetrahedral', 'sp3'], 5: ['trigonal bipyramidal', 'sp3d'], 6: ['octahedral', 'sp3d2'] };
const SHAPE: Record<string, string> = {
  '2:0': 'linear', '3:0': 'trigonal planar', '3:1': 'bent', '4:0': 'tetrahedral', '4:1': 'trigonal pyramidal', '4:2': 'bent', '4:3': 'linear',
  '5:0': 'trigonal bipyramidal', '5:1': 'seesaw', '5:2': 'T-shaped', '5:3': 'linear', '6:0': 'octahedral', '6:1': 'square pyramidal', '6:2': 'square planar',
};
/** Steric number, geometries and hybridisation of an atom whose lone pairs are given; null when they are not, or it is outside 2–6 domains. */
export function vsepr(mol: Molecule, id: string): Vsepr | null {
  const i = atomIndex(mol, id);
  const a = mol.atoms[i];
  if (!a || a.lonePairs === undefined) return null;
  const sigma = bondsAt(mol, i).length + a.h + a.implicitH;
  const steric = sigma + a.lonePairs;
  const shape = SHAPE[`${steric}:${a.lonePairs}`];
  if (!ELECTRON[steric] || !shape || sigma < 2) return null;
  return { steric, lonePairs: a.lonePairs, electron: ELECTRON[steric][0], molecular: shape, hybridisation: ELECTRON[steric][1] };
}

/** The molecular formula in Hill order (C, H, then the rest alphabetically), plain digits: "C3H7NO2". */
export function moleculeFormula(mol: Molecule): string {
  const n: Record<string, number> = {};
  for (const a of mol.atoms) {
    n[a.el] = (n[a.el] ?? 0) + 1;
    if (a.h + a.implicitH > 0) n.H = (n.H ?? 0) + a.h + a.implicitH;
  }
  const order = n.C ? ['C', 'H', ...Object.keys(n).filter((e) => e !== 'C' && e !== 'H').sort()] : Object.keys(n).sort();
  return order.filter((e) => n[e]).map((e) => `${e}${n[e] > 1 ? n[e] : ''}`).join('');
}

export function moleculeModel(r: Reader): MoleculeModel {
  const p = r.p;
  if (p.formula !== undefined) r.fail('formula: a structure is not laid out from a formula — give molecules[].atoms with coordinates (or a named layout) and molecules[].bonds');
  const pick = <T extends string>(v: unknown, name: string, allowed: readonly T[], dflt: T): T => {
    if (v === undefined || v === null) return dflt;
    if (!allowed.includes(v as T)) r.fail(`${name} must be one of ${allowed.join(', ')}`);
    return v as T;
  };
  const showLP = r.bool(p.showLonePairs, 'showLonePairs', true);
  const showFC = r.bool(p.showFormalCharges, 'showFormalCharges', true);
  const rawMols = r.list(p.molecules, 'molecules', 1, 3);
  const hbRaw = p.hbonds === undefined || p.hbonds === null ? [] : r.list(p.hbonds, 'hbonds', 0, 6);
  const arrangement = pick(p.arrangement, 'arrangement', ['panels', 'shared'] as const, hbRaw.length ? 'shared' : 'panels');
  if (hbRaw.length && arrangement !== 'shared') r.fail("hbonds: hydrogen bonds join molecules drawn in one frame — set arrangement: 'shared'");
  const molecules = rawMols.map((raw, mi): Molecule => {
    const at = `molecules[${mi}]`;
    const o = r.obj(raw, at);
    const skeletal = r.bool(o.skeletal, `${at}.skeletal`, false);
    const rawAtoms = r.list(o.atoms, `${at}.atoms`, 1, 24).map((x, i) => r.obj(x, `${at}.atoms[${i}]`));
    const ids = rawAtoms.map((a, i) => r.str(a.id, `${at}.atoms[${i}].id`, 6));
    ids.forEach((id, i) => { if (ids.indexOf(id) !== i) r.fail(`${at}.atoms: the id "${id}" is used twice`); });
    const idx = (v: unknown, name: string): number => {
      const k = ids.indexOf(v as string);
      if (typeof v !== 'string' || k < 0) r.fail(`${name}: "${String(v)}" is not one of the atoms`);
      return k;
    };
    // Positions: explicit, from the layout, or relative to another atom.
    const pos: Array<Pt | null> = rawAtoms.map((a, i) => (a.x !== undefined || a.y !== undefined ? [r.num(a.x, `${at}.atoms[${i}].x`), r.num(a.y, `${at}.atoms[${i}].y`)] : null));
    const styleFromLayout = new Map<string, 'wedge' | 'dash'>();
    if (o.layout !== undefined && o.layout !== null) {
      const lo = r.obj(o.layout, `${at}.layout`);
      const type = pick(lo.type, `${at}.layout.type`, LAYOUTS, 'linear');
      if (type === 'chain' || type === 'ring') {
        const list = r.list(lo.atoms, `${at}.layout.atoms`, type === 'ring' ? 3 : 2, type === 'ring' ? 8 : 12).map((v, i) => idx(v, `${at}.layout.atoms[${i}]`));
        const n = list.length;
        const R = 1 / (2 * Math.sin(Math.PI / n));
        list.forEach((k, i) => {
          pos[k] = type === 'chain' ? [i * Math.cos(deg(30)), i % 2 === 1 ? Math.sin(deg(30)) : 0] : [R * Math.cos(deg(90) - (2 * Math.PI * i) / n), R * Math.sin(deg(90) - (2 * Math.PI * i) / n)];
        });
      } else {
        const c = idx(lo.center, `${at}.layout.center`);
        const want = type === 'bent' ? 2 : AROUND[type].length;
        if (!Array.isArray(lo.around) || lo.around.length !== want) r.fail(`${at}.layout.around must name ${want} atoms for ${type}`);
        const around = (lo.around as unknown[]).map((v, i) => idx(v, `${at}.layout.around[${i}]`));
        const bent = r.optNum(lo.angle, `${at}.layout.angle`) ?? 104.5;
        if (type === 'bent' && (bent < 60 || bent > 175)) r.fail(`${at}.layout.angle must be between 60 and 175 degrees`);
        const angles = type === 'bent' ? [270 - bent / 2, 270 + bent / 2] : AROUND[type];
        const c0: Pt = pos[c] ?? [0, 0];
        pos[c] = c0;
        around.forEach((k, i) => { pos[k] = [c0[0] + Math.cos(deg(angles[i])), c0[1] + Math.sin(deg(angles[i]))]; });
        if (type === 'tetrahedral') { styleFromLayout.set(`${c}:${around[2]}`, 'wedge'); styleFromLayout.set(`${c}:${around[3]}`, 'dash'); }
        if (type === 'trigonal_pyramidal') { styleFromLayout.set(`${c}:${around[1]}`, 'wedge'); styleFromLayout.set(`${c}:${around[2]}`, 'dash'); }
      }
    }
    for (let pass = 0; pass < rawAtoms.length; pass++) {
      rawAtoms.forEach((a, i) => {
        if (pos[i] || a.from === undefined) return;
        const f = idx(a.from, `${at}.atoms[${i}].from`);
        const base = pos[f];
        if (!base) return;
        const ang = r.num(a.angle, `${at}.atoms[${i}].angle`);
        const len = a.length === undefined ? 1 : r.positive(a.length, `${at}.atoms[${i}].length`);
        pos[i] = [base[0] + len * Math.cos(deg(ang)), base[1] + len * Math.sin(deg(ang))];
      });
    }
    pos.forEach((q, i) => { if (!q) r.fail(`${at}.atoms[${i}] ("${ids[i]}") has no position — give x and y, or from and angle, or place it with layout (no position is guessed)`); });
    const P = pos as Pt[];
    P.forEach((q, i) => P.slice(0, i).forEach((s, j) => { if (Math.hypot(q[0] - s[0], q[1] - s[1]) < 0.4) r.fail(`${at}.atoms: "${ids[j]}" and "${ids[i]}" are drawn on top of each other (under 0.4 of a bond length apart)`); }));
    const bonds = r.list(o.bonds, `${at}.bonds`, 0, 30).map((raw2, i): MolBond => {
      const b = r.obj(raw2, `${at}.bonds[${i}]`);
      let a = idx(b.a, `${at}.bonds[${i}].a`);
      let c = idx(b.b, `${at}.bonds[${i}].b`);
      if (a === c) r.fail(`${at}.bonds[${i}]: both ends are the same atom`);
      const order = b.order === undefined || b.order === null ? 1 : b.order;
      if (order !== 1 && order !== 2 && order !== 3) r.fail(`${at}.bonds[${i}].order must be 1, 2 or 3`);
      let style = pick(b.style, `${at}.bonds[${i}].style`, ['plain', 'wedge', 'dash'] as const, 'plain');
      let dipole = b.dipole === undefined || b.dipole === null ? undefined : pick(b.dipole, `${at}.bonds[${i}].dipole`, ['to_a', 'to_b'] as const, 'to_a');
      if (b.style === undefined) {
        const viaA = styleFromLayout.get(`${a}:${c}`);
        const viaB = styleFromLayout.get(`${c}:${a}`);
        if (viaA) style = viaA;
        else if (viaB) { style = viaB; [a, c] = [c, a]; if (dipole) dipole = dipole === 'to_a' ? 'to_b' : 'to_a'; }
      }
      if (style !== 'plain' && order !== 1) r.fail(`${at}.bonds[${i}]: a wedge or dashed bond is a single bond`);
      return { a, b: c, order: order as 1 | 2 | 3, style, show: pick(b.show, `${at}.bonds[${i}].show`, ['value', 'blank'] as const, 'value'), dipole };
    });
    bonds.forEach((b, i) => { if (bonds.findIndex((x) => (x.a === b.a && x.b === b.b) || (x.a === b.b && x.b === b.a)) !== i) r.fail(`${at}.bonds[${i}]: "${ids[b.a]}" and "${ids[b.b]}" are already bonded`); });
    const atoms = rawAtoms.map((a, i): MolAtom => {
      const here = `${at}.atoms[${i}]`;
      const el = r.str(a.el, `${here}.el`, 2);
      if (!/^[A-Z][a-z]?$/.test(el)) r.fail(`${here}.el must be an element symbol ("C", "Cl")`);
      const intIn = (v: unknown, name: string, max: number): number | undefined => {
        if (v === undefined || v === null) return undefined;
        const k = r.num(v, name);
        if (!Number.isInteger(k) || k < 0 || k > max) r.fail(`${name} must be a whole number from 0 to ${max}`);
        return k;
      };
      const lonePairs = intIn(a.lonePairs, `${here}.lonePairs`, 4);
      const h = intIn(a.h, `${here}.h`, 4) ?? 0;
      const orders = bonds.filter((b) => b.a === i || b.b === i).reduce((s, b) => s + b.order, 0);
      const given = a.charge === undefined || a.charge === null ? undefined : r.num(a.charge, `${here}.charge`);
      if (given !== undefined && (!Number.isInteger(given) || Math.abs(given) > 3)) r.fail(`${here}.charge must be a whole number from −3 to 3`);
      let implicitH = 0;
      if (skeletal && el === 'C' && a.h === undefined) {
        implicitH = 4 - orders - Math.abs(given ?? 0) - 2 * (lonePairs ?? 0);
        if (implicitH < 0) r.fail(`${here}: a skeletal carbon with bonds of total order ${orders} has more than four bonds`);
      }
      let charge = given ?? 0;
      if (lonePairs !== undefined && VALENCE[el] !== undefined && !(skeletal && el === 'C' && a.h === undefined)) {
        const fc = VALENCE[el] - 2 * lonePairs - orders - h;
        if (given !== undefined && given !== fc) r.fail(`${here}.charge is ${minus(given)} but ${VALENCE[el]} valence electrons − ${2 * lonePairs} in lone pairs − ${orders + h} in bonds gives ${minus(fc)}`);
        charge = fc;
      }
      const sh = a.show === undefined || a.show === null ? {} : r.obj(a.show, `${here}.show`);
      const partial = a.partial === undefined || a.partial === null ? undefined : pick(a.partial, `${here}.partial`, ['+', '-', '−'] as const, '+');
      const carbonCorner = skeletal && el === 'C' && h === 0 && charge === 0 && !partial && !(lonePairs && lonePairs > 0);
      return {
        id: ids[i], el, x: P[i][0], y: P[i][1], lonePairs, h, implicitH, charge, partial: partial === undefined ? undefined : partial === '+' ? '+' : '-',
        show: {
          label: pick(sh.label, `${here}.show.label`, SHOWS, carbonCorner ? 'none' : 'value'),
          lonePairs: lonePairs === undefined ? 'none' : pick(sh.lonePairs, `${here}.show.lonePairs`, SHOWS, showLP ? 'value' : 'none'),
          charge: pick(sh.charge, `${here}.show.charge`, SHOWS, charge !== 0 && showFC ? 'value' : 'none'),
        },
      };
    });
    const highlight = (o.highlight === undefined || o.highlight === null ? [] : r.list(o.highlight, `${at}.highlight`, 0, 4)).map((raw2, i) => {
      const hgl = r.obj(raw2, `${at}.highlight[${i}]`);
      return { atoms: r.list(hgl.atoms, `${at}.highlight[${i}].atoms`, 1, 8).map((v, k) => idx(v, `${at}.highlight[${i}].atoms[${k}]`)), label: r.optStr(hgl.label, `${at}.highlight[${i}].label`, 12) };
    });
    let origin: Pt = [0, 0];
    if (o.origin !== undefined && o.origin !== null) {
      if (arrangement !== 'shared') r.fail(`${at}.origin: only with arrangement: 'shared'`);
      const og = r.list(o.origin, `${at}.origin`, 2, 2);
      origin = [r.num(og[0], `${at}.origin[0]`), r.num(og[1], `${at}.origin[1]`)];
    }
    const center = o.center === undefined || o.center === null ? (o.layout && typeof (o.layout as Record<string, unknown>).center === 'string' ? ((o.layout as Record<string, unknown>).center as string) : undefined) : ids[idx(o.center, `${at}.center`)];
    return { label: r.optStr(o.label, `${at}.label`, 18), atoms, bonds, skeletal, highlight, center, origin };
  });
  const hbonds = hbRaw.map((raw, i) => {
    const o = r.obj(raw, `hbonds[${i}]`);
    const end = (v: unknown, name: string): [number, number] => {
      const e = r.obj(v, name);
      const mi = r.num(e.mol, `${name}.mol`);
      if (!Number.isInteger(mi) || mi < 0 || mi >= molecules.length) r.fail(`${name}.mol must be the index of a molecule (0 to ${molecules.length - 1})`);
      const ai = atomIndex(molecules[mi], e.atom as string);
      if (ai < 0) r.fail(`${name}.atom: "${String(e.atom)}" is not an atom of molecules[${mi}]`);
      return [mi, ai];
    };
    return { from: end(o.from, `hbonds[${i}].from`), to: end(o.to, `hbonds[${i}].to`) };
  });
  return { molecules, arrangement, between: pick(p.between, 'between', ['resonance', 'none'] as const, 'none'), hbonds, title: r.optStr(p.title, 'title', 160) };
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

const ATOM_FS = 15;
const SUB = '₀₁₂₃₄';
/** What an atom prints: its symbol with any written hydrogens, "?" for a blank, '' for a bare corner. `flip`: hydrogens first ("HO", "H₂N"). */
export function atomText(a: MolAtom, flip = false): string {
  if (a.show.label === 'none') return '';
  if (a.show.label === 'blank') return '?';
  const hs = a.h === 0 ? '' : `H${a.h > 1 ? SUB[a.h] : ''}`;
  return flip ? `${hs}${a.el}` : `${a.el}${hs}`;
}

/** Angles (degrees, y up) at which `k` things are set in the widest gaps left by `taken`. */
function inGaps(taken: number[], k: number): number[] {
  if (k <= 0) return [];
  if (taken.length === 0) return Array.from({ length: k }, (_, i) => (90 + (360 * i) / k) % 360);
  const t = [...taken].map((a) => ((a % 360) + 360) % 360).sort((a, b) => a - b);
  const gaps = t.map((a, i) => ({ start: a, size: i === t.length - 1 ? t[0] + 360 - a : t[i + 1] - a, n: 0 }));
  for (let i = 0; i < k; i++) {
    let best = gaps[0];
    for (const g of gaps) if (g.size / (g.n + 1) > best.size / (best.n + 1) + 1e-9) best = g;
    best.n++;
  }
  return gaps.flatMap((g) => Array.from({ length: g.n }, (_, i) => (g.start + (g.size * (i + 1)) / (g.n + 1)) % 360));
}
/** The freest direction for one more mark: the preferred diagonals first, when they are at least 38° clear;
 *  else the clearest direction there is — of equally clear ones, the one that points furthest from `awayFrom`. */
function freeDirection(taken: number[], prefs: number[] = [45, 135, 315, 225], awayFrom?: number): number {
  const sep = (a: number, b: number): number => Math.abs(((a - b + 540) % 360) - 180);
  const clear = (a: number): number => (taken.length ? Math.min(...taken.map((t) => sep(a, t))) : 180);
  for (const a of prefs) if (clear(a) >= 38) return a;
  let best = prefs[0];
  for (let a = 0; a < 360; a += 15) {
    const better = clear(a) > clear(best) + 1e-9 || (Math.abs(clear(a) - clear(best)) < 1e-9 && awayFrom !== undefined && sep(a, awayFrom) > sep(best, awayFrom) + 1e-9);
    if (better) best = a;
  }
  return best;
}

interface Placed { mol: number; atom: number; cx: number; cy: number; rx: number; ry: number; text: string; flip: boolean; taken: number[] }

export function renderMolecule(r: Reader): Drawn {
  const m = moleculeModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const PAD = 22;
  const shared = m.arrangement === 'shared';
  // Extents of each molecule (or of the whole frame), in bond lengths.
  const ext = (list: Molecule[]) => {
    const xs = list.flatMap((mol) => mol.atoms.map((a) => a.x + mol.origin[0]));
    const ys = list.flatMap((mol) => mol.atoms.map((a) => a.y + mol.origin[1]));
    return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  };
  const groups: Molecule[][] = shared ? [m.molecules] : m.molecules.map((mol) => [mol]);
  const exts = groups.map(ext);
  const arrowGap = m.between === 'resonance' ? 30 : 14;
  /** Bond length in canvas units when the panels are set `perRow` to a row. */
  const scaleFor = (perRow: number): number => {
    let L = 46;
    for (let i = 0; i < groups.length; i += perRow) {
      const row = exts.slice(i, i + perRow);
      const wu = row.reduce((s, e) => s + (e.x1 - e.x0), 0);
      const fixed = row.length * 2 * PAD + (row.length - 1) * arrowGap + (i > 0 && m.between === 'resonance' ? arrowGap : 0);
      if (wu > 0) L = Math.min(L, (W - 12 - fixed) / wu);
    }
    return L;
  };
  let perRow = groups.length;
  let L = scaleFor(perRow);
  if (L < 30 && groups.length > 1) {
    perRow = Math.ceil(groups.length / 2);
    L = scaleFor(perRow);
  }
  if (L < 26) r.fail(`molecules: ${Math.max(...exts.map((e) => e.x1 - e.x0)).toFixed(1)} bond lengths across — too wide to draw at 340 px (fewer atoms in a row, or fewer molecules)`);
  const maxH = Math.max(...exts.map((e) => e.y1 - e.y0));
  if (maxH * L > 300) L = 300 / maxH;

  const under: string[] = [];
  const parts: string[] = [];
  const over: string[] = [];
  const placed: Placed[] = [];
  /** Ink boxes with their owner (molecule:atom), for the crowding report. */
  const ink: Array<{ owner: string; what: string; box: Box }> = [];
  const segs: Array<{ owners: string[]; a: Pt; b: Pt }> = [];
  const dipoles: Array<{ mi: number; b: MolBond; ux: number; uy: number }> = [];
  let y = t.top + 2;
  for (let g0 = 0; g0 < groups.length; g0 += perRow) {
    const row = groups.slice(g0, g0 + perRow);
    const rowExt = exts.slice(g0, g0 + perRow);
    const hasCaption = row.some((grp) => grp.some((mol) => mol.label));
    const rowH = Math.max(...rowExt.map((e) => e.y1 - e.y0)) * L + 2 * PAD;
    const lead = g0 > 0 && m.between === 'resonance' ? arrowGap : 0;
    const rowW = rowExt.reduce((s, e) => s + (e.x1 - e.x0) * L + 2 * PAD, 0) + (row.length - 1) * arrowGap + lead;
    let x = (W - rowW) / 2;
    const cyRow = y + rowH / 2;
    const resArrow = (ax: number) => {
      over.push(`<path d="M${n2(ax - 6)},${n2(cyRow)}H${n2(ax + 6)}" ${stroke(INK, 1.6)}/>` + head(ax - 12, cyRow, -1, 0, 7.5) + head(ax + 12, cyRow, 1, 0, 7.5));
    };
    if (lead) { resArrow(x + lead / 2); x += lead; }
    row.forEach((grp, gi) => {
      const e = rowExt[gi];
      const pw = (e.x1 - e.x0) * L + 2 * PAD;
      const ox = x + PAD - e.x0 * L;
      const oy = cyRow + ((e.y0 + e.y1) / 2) * L;
      grp.forEach((mol) => {
        const mi = m.molecules.indexOf(mol);
        const C = (a: MolAtom): Pt => [ox + (a.x + mol.origin[0]) * L, oy - (a.y + mol.origin[1]) * L];
        mol.atoms.forEach((a, ai) => {
          const [cx, cy] = C(a);
          const nb = bondsAt(mol, ai).map((b) => mol.atoms[b.a === ai ? b.b : b.a]);
          const taken = nb.map((q) => (Math.atan2(q.y - a.y, q.x - a.x) * 180) / Math.PI);
          // Hydrogens are written on the side away from the bonds.
          const flip = a.h > 0 && nb.length > 0 && nb.reduce((s, q) => s + (q.x - a.x), 0) / nb.length > 0.3;
          const s = atomText(a, flip);
          const wEl = inkWidth(s === '?' ? '??' : a.el, ATOM_FS);
          placed.push({ mol: mi, atom: ai, cx, cy, rx: s ? wEl / 2 + 2.5 : 0, ry: s ? 8.5 : 0, text: s, flip, taken });
        });
      });
      // Captions under the panel (or under each molecule of a shared frame).
      grp.forEach((mol) => {
        if (!mol.label) return;
        const me = shared ? ext([mol]) : e;
        const cx = shared ? ox + ((me.x0 + me.x1) / 2) * L : x + pw / 2;
        const cyCap = shared ? oy - me.y0 * L + PAD + 10 : y + rowH + 12;
        over.push(lab(cx, cyCap, mol.label, 'middle', { fs: 12, weight: 700 }));
      });
      if (gi < row.length - 1 && m.between === 'resonance') resArrow(x + pw + arrowGap / 2);
      x += pw + arrowGap;
    });
    y += rowH + (hasCaption ? 20 : 0) + 2;
  }
  const at = (mi: number, ai: number): Placed => placed.find((q) => q.mol === mi && q.atom === ai) as Placed;
  /** The point where a line leaving an atom towards (tx, ty) clears its label. */
  const edge = (q: Placed, tx: number, ty: number, gap = 1.5): Pt => {
    if (!q.text) return [q.cx, q.cy];
    const dx = tx - q.cx;
    const dy = ty - q.cy;
    const l = Math.hypot(dx, dy) || 1;
    // A written-out group ("NH₂") is wider on the side its hydrogens are on.
    const extra = q.text.length > 2 || /H/.test(q.text.slice(1)) ? inkWidth(q.text, ATOM_FS) - 2 * (q.rx - 2.5) : 0;
    const rx = q.rx + (extra > 0 && (q.flip ? dx < 0 : dx > 0) ? extra : 0);
    const k = 1 / Math.hypot(dx / l / rx, dy / l / q.ry);
    return [q.cx + (dx / l) * (k + gap), q.cy + (dy / l) * (k + gap)];
  };

  m.molecules.forEach((mol, mi) => {
    const owner = (ai: number) => `${mi}:${ai}`;
    // Group outlines, under everything.
    mol.highlight.forEach((h) => {
      const ps = h.atoms.map((ai) => at(mi, ai));
      const boxOf = (q: Placed): Box => {
        const w = q.text ? inkWidth(q.text, ATOM_FS) : 0;
        const left = q.text ? (q.flip ? q.cx + q.rx - 2.5 - w : q.cx - q.rx + 2.5) : q.cx;
        return { x0: left, y0: q.cy - (q.text ? 8 : 0), x1: left + w, y1: q.cy + (q.text ? 8 : 0) };
      };
      const bs = ps.map(boxOf);
      const b = { x0: Math.min(...bs.map((q) => q.x0)) - 8, y0: Math.min(...bs.map((q) => q.y0)) - 8, x1: Math.max(...bs.map((q) => q.x1)) + 8, y1: Math.max(...bs.map((q) => q.y1)) + 8 };
      under.push(`<rect x="${n2(b.x0)}" y="${n2(b.y0)}" width="${n2(b.x1 - b.x0)}" height="${n2(b.y1 - b.y0)}" rx="9" fill="none" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="5 3"/>`);
      if (h.label) {
        // At the corner furthest from every atom outside the group.
        const others = placed.filter((q) => q.mol === mi && !h.atoms.includes(q.atom));
        const corners: Array<[number, number, 'start' | 'end']> = [[b.x1 + 4, b.y0 + 4, 'start'], [b.x0 - 4, b.y0 + 4, 'end'], [b.x1 + 4, b.y1 + 2, 'start'], [b.x0 - 4, b.y1 + 2, 'end']];
        const far = (c: [number, number, string]) => Math.min(999, ...others.map((q) => Math.hypot(q.cx - (c[0] + (c[2] === 'start' ? 5 : -5)), q.cy - c[1])));
        const best = corners.reduce((a, c) => (far(c) > far(a) + 1e-9 ? c : a));
        over.push(lab(best[0], best[1], h.label, best[2], { fs: 12, weight: 700, halo: true }));
      }
    });
    // Bonds.
    mol.bonds.forEach((b) => {
      const A = at(mi, b.a);
      const B = at(mi, b.b);
      const p0 = edge(A, B.cx, B.cy);
      const p1 = edge(B, A.cx, A.cy);
      const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) || 1;
      const ux = (p1[0] - p0[0]) / len;
      const uy = (p1[1] - p0[1]) / len;
      const [nx, ny] = [-uy, ux];
      segs.push({ owners: [owner(b.a), owner(b.b)], a: p0, b: p1 });
      const line = (off: number, dash?: string) => `<path d="M${n2(p0[0] + nx * off)},${n2(p0[1] + ny * off)}L${n2(p1[0] + nx * off)},${n2(p1[1] + ny * off)}" ${stroke(INK, 1.8, dash)}${mol.skeletal ? ' stroke-linecap="round"' : ''}/>`;
      if (b.show === 'blank') {
        parts.push(line(0, '3 3'));
        over.push(blank((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, 15, 15, 11));
      } else if (b.style === 'wedge') {
        parts.push(`<polygon points="${n2(p0[0])},${n2(p0[1])} ${n2(p1[0] + nx * 4.2)},${n2(p1[1] + ny * 4.2)} ${n2(p1[0] - nx * 4.2)},${n2(p1[1] - ny * 4.2)}" fill="${INK}"/>`);
      } else if (b.style === 'dash') {
        const k = Math.max(5, Math.round(len / 4.2));
        const d: string[] = [];
        for (let i = 1; i <= k; i++) {
          const f = i / k;
          const hw = 0.8 + 3.6 * f;
          d.push(`M${n2(p0[0] + ux * len * f + nx * hw)},${n2(p0[1] + uy * len * f + ny * hw)}L${n2(p0[0] + ux * len * f - nx * hw)},${n2(p0[1] + uy * len * f - ny * hw)}`);
        }
        parts.push(`<path d="${d.join('')}" ${stroke(INK, 1.5)}/>`);
      } else if (b.order === 1) parts.push(line(0));
      else if (b.order === 2) parts.push(line(-2.5), line(2.5));
      else parts.push(line(-4.4), line(0), line(4.4));
      if (b.dipole) dipoles.push({ mi, b, ux, uy });
    });
    // Atoms: label, lone pairs, charge, partial charge.
    mol.atoms.forEach((a, ai) => {
      const q = at(mi, ai);
      const name = `"${a.id}"`;
      if (q.text === '?') over.push(blank(q.cx, q.cy, 17, 17, 12));
      else if (q.text) {
        const w = inkWidth(a.el, ATOM_FS);
        over.push(q.text === a.el
          ? text(q.cx, q.cy + ATOM_FS * 0.36, q.text, { fs: ATOM_FS, anchor: 'middle', weight: 600 })
          : text(q.flip ? q.cx + w / 2 : q.cx - w / 2, q.cy + ATOM_FS * 0.36, q.text, { fs: ATOM_FS, anchor: q.flip ? 'end' : 'start', weight: 600 }));
      }
      if (q.text) ink.push({ owner: owner(ai), what: `the atom ${name}`, box: { x0: q.cx - q.rx, y0: q.cy - q.ry, x1: q.cx + q.rx, y1: q.cy + q.ry } });
      const taken = [...q.taken];
      // A written group blocks the side its hydrogens are on.
      if (a.h > 0 && a.show.label === 'value') taken.push(q.flip ? 180 : 0);
      /** A point `d` beyond the label in direction `ang` (degrees, y up). */
      const out = (ang: number, d: number): Pt => {
        const e = edge(q, q.cx + Math.cos(deg(ang)) * 100, q.cy - Math.sin(deg(ang)) * 100, 0);
        return [e[0] + Math.cos(deg(ang)) * d, e[1] - Math.sin(deg(ang)) * d];
      };
      if (a.lonePairs !== undefined && a.show.lonePairs === 'value') {
        const dirs = inGaps(taken, a.lonePairs);
        for (const ang of dirs) {
          const [px, py] = out(ang, q.text ? 4.4 : 6);
          const tx = -Math.sin(deg(ang));
          const ty = -Math.cos(deg(ang));
          over.push(`<circle cx="${n2(px + tx * 2.9)}" cy="${n2(py + ty * 2.9)}" r="1.7" fill="${INK}"/><circle cx="${n2(px - tx * 2.9)}" cy="${n2(py - ty * 2.9)}" r="1.7" fill="${INK}"/>`);
          ink.push({ owner: owner(ai), what: `a lone pair of ${name}`, box: { x0: px - 4.2, y0: py - 4.2, x1: px + 4.2, y1: py + 4.2 } });
        }
        taken.push(...dirs);
      } else if (a.lonePairs !== undefined && a.show.lonePairs === 'blank') {
        const ang = inGaps(taken, 1)[0];
        const [px, py] = out(ang, 10);
        over.push(blank(px, py, 15, 15, 11));
        ink.push({ owner: owner(ai), what: `the "?" beside ${name}`, box: { x0: px - 7.5, y0: py - 7.5, x1: px + 7.5, y1: py + 7.5 } });
        taken.push(ang);
      }
      if (a.show.charge !== 'none') {
        // The diagonals that point away from the atom's bonds first.
        const mean = q.taken.length ? (Math.atan2(q.taken.reduce((s2, v) => s2 + Math.sin(deg(v)), 0), q.taken.reduce((s2, v) => s2 + Math.cos(deg(v)), 0)) * 180) / Math.PI : 225;
        const away = (v: number): number => Math.abs(((v - mean + 540) % 360) - 180);
        const ang = freeDirection(taken, [45, 135, 315, 225].sort((u, v) => away(v) - away(u) || u - v), q.taken.length ? mean : undefined);
        const [px, py] = out(ang, a.show.charge === 'blank' ? 15.5 : 12.5);
        if (a.show.charge === 'blank') over.push(blank(px, py, 15, 15, 11));
        else if (Math.abs(a.charge) === 1) over.push(`<circle cx="${n2(px)}" cy="${n2(py)}" r="6.4" fill="#ffffff" stroke="${INK}" stroke-width="1"/>` + text(px, py + 4, a.charge > 0 ? '+' : '−', { fs: 12, anchor: 'middle', weight: 700 }));
        else over.push(text(px, py + 4, `${Math.abs(a.charge)}${a.charge > 0 ? '+' : '−'}`, { fs: 12, anchor: 'middle', weight: 700, halo: true }));
        ink.push({ owner: owner(ai), what: `the charge on ${name}`, box: { x0: px - 6.4, y0: py - 6.4, x1: px + 6.4, y1: py + 6.4 } });
        taken.push(ang);
      }
      if (a.partial) {
        const ang = freeDirection(taken, [90, 270, 45, 135, 315, 225]);
        const [px, py] = out(ang, 9);
        over.push(text(px, py + 4.2, a.partial === '+' ? 'δ+' : 'δ−', { fs: 12, anchor: 'middle', halo: true }));
        ink.push({ owner: owner(ai), what: `the partial charge on ${name}`, box: { x0: px - 7, y0: py - 6, x1: px + 7, y1: py + 6 } });
      }
    });
  });
  // Dipole arrows: beside the bond, on whichever side is clear of the atoms' marks; the crossed end is δ+.
  for (const { mi, b, ux, uy } of dipoles) {
    const A = at(mi, b.a);
    const B = at(mi, b.b);
    const [nx, ny] = [-uy, ux];
    const mx = (A.cx + B.cx) / 2;
    const my = (A.cy + B.cy) / 2;
    const half = Math.min(15, Math.hypot(B.cx - A.cx, B.cy - A.cy) * 0.36);
    const dir = b.dipole === 'to_b' ? 1 : -1;
    const ends = (side: number): [number, number, number, number] => [mx + nx * side * 11 - ux * dir * half, my + ny * side * 11 - uy * dir * half, mx + nx * side * 11 + ux * dir * half, my + ny * side * 11 + uy * dir * half];
    const boxOf = (e: [number, number, number, number]): Box => ({ x0: Math.min(e[0], e[2]) - 4, y0: Math.min(e[1], e[3]) - 4, x1: Math.max(e[0], e[2]) + 4, y1: Math.max(e[1], e[3]) + 4 });
    const hits = (side: number): number => { const q = boxOf(ends(side)); return ink.filter((o) => o.box.x0 < q.x1 && q.x0 < o.box.x1 && o.box.y0 < q.y1 && q.y0 < o.box.y1).length; };
    const side = hits(1) <= hits(-1) ? 1 : -1;
    const [sx, sy, ex, ey] = ends(side);
    over.push(arrow(sx, sy, ex, ey, { color: MUTED, width: 1.5, head: 7 }) + `<path d="M${n2(sx + ux * dir * 4 + nx * 4)},${n2(sy + uy * dir * 4 + ny * 4)}L${n2(sx + ux * dir * 4 - nx * 4)},${n2(sy + uy * dir * 4 - ny * 4)}" ${stroke(MUTED, 1.5)}/>`);
    // Only a clash with a mark counts: the arrow lies beside its own bond on purpose.
    if (hits(side) > 0) ink.push({ owner: `dipole ${mi}`, what: 'a dipole arrow', box: { x0: Math.min(sx, ex), y0: Math.min(sy, ey), x1: Math.max(sx, ex), y1: Math.max(sy, ey) } });
  }
  for (const hb of m.hbonds) {
    const A = at(hb.from[0], hb.from[1]);
    const B = at(hb.to[0], hb.to[1]);
    const p0 = edge(A, B.cx, B.cy, 3);
    const p1 = edge(B, A.cx, A.cy, 3);
    parts.push(`<path d="M${n2(p0[0])},${n2(p0[1])}L${n2(p1[0])},${n2(p1[1])}" ${stroke(MUTED, 1.8, '1.5 3.5')} stroke-linecap="round"/>`);
    segs.push({ owners: [`${hb.from[0]}:${hb.from[1]}`, `${hb.to[0]}:${hb.to[1]}`], a: p0, b: p1 });
  }
  // Crowding: a mark of one atom on a mark of another, or on a bond that is not its own.
  const clashes = new Set<string>();
  ink.forEach((a, i) => {
    ink.slice(i + 1).forEach((b) => {
      if (a.owner !== b.owner && a.box.x0 < b.box.x1 && b.box.x0 < a.box.x1 && a.box.y0 < b.box.y1 && b.box.y0 < a.box.y1) clashes.add(`${a.what} runs into ${b.what}`);
    });
    for (const s of segs) {
      if (s.owners.includes(a.owner)) continue;
      const n = Math.max(2, Math.ceil(Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]) / 2));
      for (let k = 0; k <= n; k++) {
        const px = s.a[0] + ((s.b[0] - s.a[0]) * k) / n;
        const py = s.a[1] + ((s.b[1] - s.a[1]) * k) / n;
        if (px > a.box.x0 + 0.5 && px < a.box.x1 - 0.5 && py > a.box.y0 + 0.5 && py < a.box.y1 - 0.5) { clashes.add(`${a.what} lies on a bond`); break; }
      }
    }
  });
  for (const c of [...clashes].slice(0, 4)) notes.push({ code: 'crowded', message: `${c} — move the atoms apart, or hide a lone-pair set or a charge` });
  const marks = ink.filter((q) => q.box.x0 < 2 || q.box.x1 > W - 2);
  if (marks.length) notes.push({ code: 'crowded', message: `${marks[0].what} is cut by the edge of the figure` });
  return { body: t.svg + under.join('') + parts.join('') + over.join(''), H: y + 4, facts: facts(notes) };
}
