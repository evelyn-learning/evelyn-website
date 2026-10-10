/**
 * Hand-authored practice items that are read off a FIGURE — batch 3.
 *
 * PART A: the eleven objectives of the 105 figure objectives that had no
 *   figure item after batch 2 (molecular structure ×4, gel / amplification
 *   plot ×3, labelled biological diagram ×2, map ×1, bar-magnet field ×1),
 *   on the batch-3 kinds (molecular_structure, gel_electrophoresis with its
 *   amplification_plot variant, bio_schematic, schematic_map, and the
 *   bar_magnet variant of field_diagram). Up to four items an objective, of
 *   different task kinds, at least two of them at level 3–4.
 * PART B: harder items (level 3–4) for objectives whose held figure items
 *   are all plain read-offs or level 1–2, each on a NEW figure of the same
 *   kind; and items on the batch-3 kinds for ordinary objectives whose
 *   question the figure genuinely carries. At most two an objective.
 *
 * Same pattern, rules and output layout as author-batch2-figure-items.ts.
 * Every item is data in this file. For every item the script
 *   - draws the figure (`buildPracticeFigure`) and runs the SVG safety check,
 *     the legibility report (no warning allowed), the option-letter guard
 *     (`figureLetterClash`) and the job's rule checks;
 *   - PROVES the key from the figure spec: by a figure-core checker whose
 *     result is the key (`ck`), by code that combines checker results
 *     (`calc` / `holds` using `c.run`), or by code on the spec's own params;
 *     an item whose key does not follow from its spec stops the run;
 *   - shuffles and letters the options with a seeded shuffle (the correct
 *     option is written FIRST in this file);
 *   - writes the alt text from `describeForAlt` (what the picture prints,
 *     with any value to keep back hidden) plus the item's own specifics.
 * It then writes ProblemBank-shaped rows (insert-only import — NOT imported
 * here), the audited ids, the mapping of the 105 objectives (batch 2's
 * mapping with the eleven re-decided), a gallery page, PNGs at the 340 px
 * column (2×), contact sheets and a summary.
 *
 * Levels: 1 recall; 2 one-step read-off or application; 3 multi-step, choice
 * between cases, or interpretation; 4 non-routine (transfer, working
 * backwards, error-finding, edge case).
 *
 * No database, no network, no model. Run:
 *   env -u MONGODB_URI -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL \
 *     npx tsx scripts/practice-extend/author-batch3-figure-items.ts [--out <dir>] [--check] [--wip] [--list-objectives]
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { checkFigureLegibility } from '../../src/lib/tutor/practice-figure/legibility';
import { buildPracticeFigure, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { compileExpression } from '../../src/lib/tutor/practice-figure/expr';
import { MAX_FIGURE_SVG_CHARS, validateFigureSvg } from '../../src/lib/tutor/practice-figure/svg-safety';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { contentDefects, itemIdOf, simpleHash } from './core';
import { canonText, derivedText, describeFigure, describeForAlt, examineFigureItem, figureLetterClash, runChecker, type Derived, type FigureItem } from './figure-core';

const INTEGRATION = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration';
const DEFAULT_OUT = `${INTEGRATION}/practice-figures-2026-10-13-batch3`;
const BATCH2 = `${INTEGRATION}/practice-figures-2026-10-11-batch2`;
const BATCH1 = `${INTEGRATION}/practice-figures-2026-10-11-batch1`;
const OBJECTIVES_105 = `${INTEGRATION}/practice-extension-2026-10-09/coverage-run/figure-objectives.json`;
const ROWS_60 = `${INTEGRATION}/practice-figures-2026-10-10-slope/final/figure-rows-60.json`;
const ROWS_B1 = `${BATCH1}/final/figure-rows-batch1-151.v2.json`;
const ROWS_B2 = `${BATCH2}/final/figure-rows-batch2-123.v2.json`;
/** The CURRENT lesson packs (lesson text and every existing item). */
const PACKS = `${INTEGRATION}/practice-expand-2026-10-12/packs`;
const PNG_WIDTH = 680; // the 340 px column at 2×

type P = Record<string, unknown>;
type Spec = PracticeFigureSpec;

// ── proof context ───────────────────────────────────────────────────────────

class Ctx {
  used: Array<{ checker: string; args: P; result: string }> = [];
  constructor(public spec: Spec) {}
  get p(): P { return this.spec.params; }
  /** A checker on this item's spec, or (with `on`) on a variant of it — the variant is recorded with the result. */
  run(checker: string, args: P = {}, on?: { spec: Spec; what: string }): Derived {
    const d = runChecker(on?.spec ?? this.spec, { checker, args });
    this.used.push({ checker, args: on ? { ...args, _onVariant: on.what } : args, result: derivedText(d) });
    return d;
  }
  num(checker: string, args: P = {}, on?: { spec: Spec; what: string }): number {
    const d = this.run(checker, args, on);
    if (d.kind !== 'number') throw new Error(`${checker} gave no number`);
    return d.value;
  }
  txt(checker: string, args: P = {}, on?: { spec: Spec; what: string }): string {
    const d = this.run(checker, args, on);
    if (d.kind === 'number') return String(d.value);
    if (d.kind === 'numbers') return d.values.join(',');
    return d.value;
  }
}

interface A {
  /** Task kind — unique within an objective. */
  t: string;
  d: 1 | 2 | 3 | 4;
  /** What the item asks beyond locating a value on the figure. */
  need: 'read' | 'reason' | 'calc';
  spec: Spec;
  /** The item's own specifics, added to `describeForAlt(spec, { hide })`. */
  alt: string;
  /** Printed values `describeForAlt` must keep back (they would give the answer). */
  hide?: Array<string | number>;
  q: string;
  /** mcq: [text, the mistake behind it]; the CORRECT option first (its second entry is 'correct'). */
  o?: Array<[string, string]>;
  /** numeric: the stated key. */
  n?: string;
  /** The key is the result of this figure-core checker on the spec. */
  ck?: [string, P];
  /** The key is this value, computed in code from the spec (description, function). */
  calc?: [string, (c: Ctx) => string | number];
  /** mcq: the truth of each option as written (correct first), computed from the spec. */
  holds?: [string, Array<(c: Ctx) => boolean>];
  h: [string, string];
  s: string;
}
interface Item extends A { lo: string; sub: string; part: 'A' | 'B' }

const ITEMS: Item[] = [];
/** `lo` is "<first block of the plan id>.lo-N"; resolved against the lesson packs. */
function GA(lo: string, sub: string, items: A[]): void {
  for (const a of items) ITEMS.push({ ...a, lo, sub, part: 'A' });
}
function GB(lo: string, sub: string, items: A[]): void {
  for (const a of items) ITEMS.push({ ...a, lo, sub, part: 'B' });
}

const S = (type: string, params: P): Spec => ({ type, params });
const near = (a: number, b: number, tol = 1e-9): boolean => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
const round = (v: number, dp: number): number => Number(v.toFixed(dp));
const deg = (v: number): number => (v * Math.PI) / 180;
const arr = (v: unknown): P[] => v as P[];
/** Simpson's rule; n is even. */
function integrate(f: (x: number) => number, a: number, b: number, n = 2000): number {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

// ── helpers for particular kinds ────────────────────────────────────────────

/** Molecules: atoms and bonds are explicit; nothing is laid out from a formula. */
const at = (id: string, el: string, extra: P = {}): P => ({ id, el, ...extra });
const bd = (a: string, b: string, order = 1, extra: P = {}): P => ({ a, b, order, ...extra });
const molecule = (atoms: P[], bonds: P[], extra: P = {}): P => ({ atoms, bonds, ...extra });
const mols = (molecules: P[], extra: P = {}): Spec => S('molecular_structure', { molecules, ...extra });
/** Three atoms on a line: left – centre – right. */
const lin3 = (l: P, c: P, r: P, orders: [number, number], extra: P = {}): P =>
  molecule([l, c, r], [bd(l.id as string, c.id as string, orders[0]), bd(c.id as string, r.id as string, orders[1])], { layout: { type: 'linear', center: c.id, around: [l.id, r.id] }, center: c.id, ...extra });
const fcOf = (c: Ctx, atom: string, molecule_ = 0): number => c.num('mol_formal_charge', { atom, molecule: molecule_ });
const molCount = (c: Ctx, want: string, extra: P = {}): number => c.num('mol_count', { want, ...extra });

/** Gels and amplification plots. */
const gel = (sizes: number[], lanes: Array<[string, Array<number | P>]>, extra: P = {}, ladder: P = {}): Spec =>
  S('gel_electrophoresis', { ladder: { sizes, ...ladder }, lanes: lanes.map(([label, bands]) => ({ label, bands })), ...extra });
const amp = (samples: Array<[string, number | null]>, extra: P = {}): Spec => S('gel_electrophoresis', { variant: 'amplification_plot', samples: samples.map(([label, ct]) => ({ label, ct })), ...extra });
const bandsOf = (c: Ctx, lane: string): number[] => {
  const n = c.num('gel_fragment_count', { lane });
  return Array.from({ length: n }, (_, band) => c.num('gel_band_size', { lane, band }));
};
const hasBand = (c: Ctx, lane: string, size: number): boolean => c.txt('gel_presence', { lane, size }) === 'yes';

/** Biology schematics. */
const bio = (variant: string, params: P): Spec => S('bio_schematic', { variant, ...params });
const cell = (cellType: 'animal' | 'plant', organelles: Array<[string, string | null]>): Spec => bio('cell', { cellType, organelles: organelles.map(([type, label]) => ({ type, label })) });
const labelOf = (c: Ctx, part: string): string => c.txt('bio_label_of', { part });

/** Maps. */
const map = (params: P): Spec => S('schematic_map', params);
const box = (x0: number, y0: number, x1: number, y1: number): Array<[number, number]> => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const mapKm = (c: Ctx, from: string, to: string): number => c.num('map_distance', { from, to });

/** Bar magnets. */
const magnet = (magnets: P[], extra: P = {}): Spec => S('field_diagram', { variant: 'bar_magnet', magnets, ...extra });
const needle = (c: Ctx, compass: string): string => c.txt('magnet_compass_direction', { compass });
const bAt = (c: Ctx, point: string): string => c.txt('magnet_field_direction', { point });

/** The batch-1 / batch-2 kinds used in Part B. */
const fgraph = (params: P): Spec => S('function_graph', { xStep: 1, yStep: 1, ...params });
const signs = (label: string, critical: number[], sg: string[], atv?: string[]): Spec => S('sign_chart', { critical, rows: [{ label, signs: sg, at: atv ?? critical.map(() => '0') }] });
const region = (params: P, reg: P): Spec => S('shaded_region', { xStep: 1, yStep: 1, ...params, region: reg });
const motion = (quantity: 'position' | 'velocity', points: Array<[number, number]>, params: P): Spec => S('motion_graph', { quantity, series: [{ points }], interpolation: 'linear', showPoints: false, ...params });
const fbd = (forces: P[], extra: P = {}): Spec => S('free_body_diagram_v2', { forces, ...extra });
const F = (label: string, direction: string | number, magnitude?: number, extra: P = {}): P => ({ label, direction, ...(magnitude === undefined ? {} : { magnitude }), ...extra });
const vectors = (params: P): Spec => S('vector_diagram', { xStep: 1, yStep: 1, ...params });
const circ = (emf: number, circuit: P, battery: P = {}): Spec => S('circuit_diagram', { battery: { emf, ...battery }, circuit });
const ser = (...n: P[]): P => ({ series: n });
const par = (...n: P[]): P => ({ parallel: n });
const R = (name: string, value: number, extra: P = {}): P => ({ type: 'resistor', name, value, ...extra });
const bulb = (name: string, value = 6, extra: P = {}): P => ({ type: 'bulb', name, value, show: 'name', ...extra });
const sw = (name: string, closed = true): P => ({ type: 'switch', name, closed });
const cq = (c: Ctx, component: string, quantity: 'current' | 'voltage' | 'power', switches?: Record<string, boolean>): number => c.num('circuit_component', { component, quantity, ...(switches ? { switches } : {}) });
const ray = (params: P): Spec => S('ray_diagram', params);
const pes = (peaks: Array<[number, number]>, extra: P = {}): Spec => S('spectrum', { variant: 'pes', peaks: peaks.map(([energy, electrons]) => ({ energy, electrons })), ...extra });
const mass = (peaks: Array<[number, number]>, extra: P = {}): Spec => S('spectrum', { variant: 'mass', peaks: peaks.map(([mz, abundance]) => ({ mz, abundance })), ...extra });
const lines = (rows: Array<[string, number[]]>): Spec => S('spectrum', { variant: 'lines', rows: rows.map(([label, ls]) => ({ label, lines: ls })) });
const rc = (params: P): Spec => S('reaction_coordinate', { reactantLabel: 'reactants', productLabel: 'products', units: 'kJ/mol', showAxisValues: true, ...params });

// ════════════════════════════════════════════════════════════════════════════
// PART A — the eleven objectives that had no figure item
// ════════════════════════════════════════════════════════════════════════════

// ── AP Chemistry · Lewis Structures and Formal Charges (pack 173) ───────────

const LP3 = { lonePairs: 3 };
/** Carbonate, with the double bond to oxygen k (1–3). */
const carbonate = (k: number): P => molecule(
  [at('C', 'C', { lonePairs: 0 }), ...[1, 2, 3].map((i) => at(`O${i}`, 'O', { lonePairs: i === k ? 2 : 3 }))],
  [1, 2, 3].map((i) => bd('C', `O${i}`, i === k ? 2 : 1)),
  { layout: { type: 'trigonal_planar', center: 'C', around: ['O1', 'O2', 'O3'] } },
);
const ALT_LEWIS = 'Bonds are drawn as lines (one line a single bond, two a double, three a triple) and lone pairs as pairs of dots beside their atom.';

GA('87ef2ba6.lo-1', 'Reading and completing a Lewis structure', [
  {
    t: 'count the valence electrons a drawn structure shows', d: 2, need: 'calc',
    spec: mols([molecule([at('C', 'C', { lonePairs: 0 }), at('O', 'O', { lonePairs: 2 }), at('H1', 'H'), at('H2', 'H')], [bd('C', 'O', 2), bd('C', 'H1'), bd('C', 'H2')], { layout: { type: 'trigonal_planar', center: 'C', around: ['O', 'H1', 'H2'] } })]),
    alt: `A carbon atom in the middle is joined to an oxygen atom above it and to two hydrogen atoms below it. ${ALT_LEWIS}`,
    q: 'The diagram shows the Lewis structure of a molecule. How many valence electrons does the structure show in total, counting every bonding electron and every lone-pair electron?',
    n: '12', ck: ['mol_count', { want: 'valence_electrons' }],
    h: ['Each line is one shared pair of electrons, so a double bond holds four electrons.', 'Add the electrons in all the bonds to the electrons drawn as dots.'],
    s: 'Read from the figure: two C–H single bonds (2 electrons each), one C=O double bond (4 electrons) and two lone pairs on the oxygen (4 electrons). 2 + 2 + 4 + 4 = 12 valence electrons.',
  },
  {
    t: 'find a hidden bond order from the octets', d: 3, need: 'reason',
    spec: mols([molecule([at('H', 'H'), at('C', 'C', { lonePairs: 0 }), at('N', 'N', { lonePairs: 1 })], [bd('H', 'C'), bd('C', 'N', 3, { show: 'blank' })], { layout: { type: 'linear', center: 'C', around: ['H', 'N'] } })]),
    alt: `Three atoms in a row: hydrogen, carbon, nitrogen. The hydrogen–carbon bond is a single line; the carbon–nitrogen bond is hidden; one lone pair is drawn on the nitrogen. ${ALT_LEWIS}`,
    q: 'In the Lewis structure shown, the bond between carbon and nitrogen is hidden by a question mark. Every lone pair is drawn, the molecule is neutral, and carbon and nitrogen each have a complete octet. What is the order of the hidden bond (1 for single, 2 for double, 3 for triple)?',
    n: '3', ck: ['mol_bond_order', { a: 'C', b: 'N' }],
    h: ['Count the electrons carbon already has from the bond that is drawn, and how many more it needs for an octet.', 'Check your answer against nitrogen: its lone pair plus the hidden bond must also make eight electrons.'],
    s: 'Read from the figure: carbon has one single bond to hydrogen (2 electrons) and no lone pair, so it needs 6 more electrons from the hidden bond; nitrogen has one lone pair (2 electrons) and also needs 6 more. Six shared electrons are three pairs, so the hidden bond is a triple bond, order 3.',
  },
  {
    t: 'count the lone pairs a bond skeleton still needs', d: 3, need: 'calc',
    spec: mols([molecule([at('C', 'C', { lonePairs: 0 }), at('O', 'O', { lonePairs: 2 }), at('Cl1', 'Cl', LP3), at('Cl2', 'Cl', LP3)], [bd('C', 'O', 2), bd('C', 'Cl1'), bd('C', 'Cl2')], { layout: { type: 'trigonal_planar', center: 'C', around: ['O', 'Cl1', 'Cl2'] } })], { showLonePairs: false }),
    alt: 'A carbon atom in the middle is joined by a double line to an oxygen atom above it and by single lines to two chlorine atoms below it. No lone pairs are drawn.',
    q: 'The diagram shows the bonds of phosgene, COCl2, but none of its lone pairs. When the Lewis structure is completed so that every atom has an octet, how many lone pairs does the whole molecule have?',
    n: '8', ck: ['mol_count', { want: 'lone_pairs' }],
    h: ['Work atom by atom: how many electrons does each atom already have from the bonds drawn to it?', 'An atom with one single bond needs three lone pairs for an octet; an atom with a double bond needs two.'],
    s: 'Read from the figure: carbon has a double bond and two single bonds (8 electrons), so it needs no lone pair; oxygen has one double bond (4 electrons) and needs 2 lone pairs; each chlorine has one single bond (2 electrons) and needs 3 lone pairs. 0 + 2 + 3 + 3 = 8 lone pairs.',
  },
  {
    t: 'find the error in a drawn structure', d: 4, need: 'reason',
    spec: mols([lin3(at('O1', 'O', LP3), at('C', 'C', { lonePairs: 0 }), at('O2', 'O', LP3), [1, 1])], { showFormalCharges: false }),
    alt: `Three atoms in a row: oxygen, carbon, oxygen, joined by single lines. Each oxygen carries three lone pairs; the carbon carries none. ${ALT_LEWIS}`,
    q: 'A student drew the Lewis structure shown for carbon dioxide, CO2. Which statement about the student\'s structure is correct?',
    o: [
      ['It has the right number of electrons, but carbon lacks an octet', 'correct'],
      ['It has two more valence electrons than CO2 should have', 'miscounts the total: 4 + 6 + 6 = 16 are needed and 16 are drawn'],
      ['It has two fewer valence electrons than CO2 should have', 'forgets that the two bonds hold four of the sixteen electrons'],
      ['It is a correct Lewis structure: every atom has an octet', 'checks the octets of the oxygen atoms only'],
    ],
    holds: ['total electrons drawn (mol_count) against 4 + 6 + 6 = 16, and the electrons round carbon against 8', [
      (c) => molCount(c, 'valence_electrons') === 16 && molCount(c, 'valence_electrons', { atom: 'C' }) < 8,
      (c) => molCount(c, 'valence_electrons') === 18,
      (c) => molCount(c, 'valence_electrons') === 14,
      (c) => molCount(c, 'valence_electrons', { atom: 'C' }) === 8 && molCount(c, 'valence_electrons', { atom: 'O1' }) === 8,
    ]],
    h: ['Count the electrons drawn and compare with the valence electrons of one carbon and two oxygen atoms.', 'Then count the electrons round each atom separately, bonds included.'],
    s: 'Read from the figure: two single bonds (4 electrons) and six lone pairs (12 electrons) make 16, which is the correct total for CO2 (4 + 6 + 6). Each oxygen has 8 electrons, but carbon has only the two single bonds, 4 electrons. The structure has the right number of electrons, but carbon lacks an octet; moving one lone pair from each oxygen into the bonds gives O=C=O.',
  },
]);

GA('87ef2ba6.lo-3', 'Choosing the best Lewis structure by formal charge', [
  {
    t: 'choose among three candidate structures', d: 3, need: 'reason',
    spec: mols([
      lin3(at('N', 'N', { lonePairs: 1 }), at('C', 'C', { lonePairs: 0 }), at('O', 'O', LP3), [3, 1], { label: 'I' }),
      lin3(at('N', 'N', { lonePairs: 2 }), at('C', 'C', { lonePairs: 0 }), at('O', 'O', { lonePairs: 2 }), [2, 2], { label: 'II' }),
      lin3(at('N', 'N', LP3), at('C', 'C', { lonePairs: 0 }), at('O', 'O', { lonePairs: 1 }), [1, 3], { label: 'III' }),
    ], { showFormalCharges: false }),
    alt: `Each structure is a row of nitrogen, carbon and oxygen. I: triple bond N to C, single bond C to O, one lone pair on N and three on O. II: two double bonds, two lone pairs on each end atom. III: single bond N to C, triple bond C to O, three lone pairs on N and one on O. No formal charges are marked. ${ALT_LEWIS}`,
    q: 'Three candidate Lewis structures for the cyanate ion, OCN⁻, are shown without their formal charges. According to formal-charge rules, which structure contributes most to the real ion?',
    o: [['Structure I', 'correct'], ['Structure II', 'puts the negative charge on nitrogen, the less electronegative end atom'], ['Structure III', 'takes the structure with the largest formal charges'], ['Structures I and II equally', 'stops at the size of the charges and ignores which atom carries the negative one']],
    calc: ['"Structure " + mol_best_structure (smallest formal charges, then the negative charge on the most electronegative atom)', (c) => `Structure ${c.txt('mol_best_structure')}`],
    h: ['Work out the formal charge on each atom of each structure: valence electrons minus lone-pair electrons minus the number of bonds.', 'When two structures have charges of the same size, prefer the one whose negative charge sits on the more electronegative atom.'],
    s: 'Read from the figure and compute: in I the charges are N 0, C 0, O −1; in II they are N −1, C 0, O 0; in III they are N −2, C 0, O +1. III has the largest charges. I and II each have a single −1, and oxygen is more electronegative than nitrogen, so the structure with −1 on oxygen, Structure I, contributes most.',
  },
  {
    t: 'formal charge on one atom of the favoured structure', d: 4, need: 'calc',
    spec: mols([
      lin3(at('N1', 'N', { lonePairs: 1 }), at('N2', 'N', { lonePairs: 0 }), at('O', 'O', LP3), [3, 1], { label: 'I' }),
      lin3(at('N1', 'N', { lonePairs: 2 }), at('N2', 'N', { lonePairs: 0 }), at('O', 'O', { lonePairs: 2 }), [2, 2], { label: 'II' }),
      lin3(at('N1', 'N', LP3), at('N2', 'N', { lonePairs: 0 }), at('O', 'O', { lonePairs: 1 }), [1, 3], { label: 'III' }),
    ], { showFormalCharges: false }),
    alt: `Each structure is a row of nitrogen, nitrogen and oxygen. I: triple bond between the nitrogens, single bond to oxygen, one lone pair on the end nitrogen and three on oxygen. II: two double bonds, two lone pairs on each end atom. III: single bond between the nitrogens, triple bond to oxygen, three lone pairs on the end nitrogen and one on oxygen. No formal charges are marked.`,
    q: 'Three candidate Lewis structures for dinitrogen monoxide, N2O, are shown without their formal charges. In the structure that formal-charge rules favour, what is the formal charge on the oxygen atom? Give a signed whole number.',
    n: '-1',
    calc: ['mol_formal_charge of O in the structure mol_best_structure names', (c) => fcOf(c, 'O', ['I', 'II', 'III'].indexOf(c.txt('mol_best_structure')))],
    h: ['Find the formal charge on every atom of all three structures before you choose.', 'Two structures have charges of the same size; the better one has its negative charge on the more electronegative atom.'],
    s: 'Read from the figure and compute: I has N 0, N +1, O −1; II has N −1, N +1, O 0; III has N −2, N +1, O +1. III is worst. I and II have charges of the same size, and I places the negative charge on oxygen, the most electronegative atom, so I is favoured. In I the oxygen has three lone pairs and one bond: 6 − 6 − 1 = −1.',
  },
  {
    t: 'octet against formal charge (an incomplete octet)', d: 3, need: 'reason',
    spec: mols([
      molecule([at('B', 'B', { lonePairs: 0 }), at('F1', 'F', LP3), at('F2', 'F', LP3), at('F3', 'F', LP3)], [bd('B', 'F1'), bd('B', 'F2'), bd('B', 'F3')], { layout: { type: 'trigonal_planar', center: 'B', around: ['F1', 'F2', 'F3'] }, label: 'I' }),
      molecule([at('B', 'B', { lonePairs: 0 }), at('F1', 'F', { lonePairs: 2 }), at('F2', 'F', LP3), at('F3', 'F', LP3)], [bd('B', 'F1', 2), bd('B', 'F2'), bd('B', 'F3')], { layout: { type: 'trigonal_planar', center: 'B', around: ['F1', 'F2', 'F3'] }, label: 'II' }),
    ], { showFormalCharges: false }),
    alt: `Each structure has a boron atom in the middle joined to three fluorine atoms. I: three single bonds, three lone pairs on every fluorine. II: a double bond to the top fluorine, which has two lone pairs, and single bonds to the other two, which have three. No formal charges are marked. ${ALT_LEWIS}`,
    q: 'Two Lewis structures for boron trifluoride, BF3, are shown without their formal charges. Which structure do formal charges favour, and what is the formal charge on boron in that structure?',
    o: [['Structure I; 0', 'correct'], ['Structure II; −1', 'prefers a full octet on boron over the smaller formal charges'], ['Structure II; 0', 'prefers the octet and does not recompute the charge on boron'], ['Structure I; −1', 'chooses by formal charge but takes the charge of boron from the other structure']],
    calc: ['mol_best_structure and mol_formal_charge of B in it', (c) => { const best = c.txt('mol_best_structure'); const fc = fcOf(c, 'B', ['I', 'II'].indexOf(best)); return `Structure ${best}; ${String(fc).replace('-', '−')}`; }],
    h: ['Formal charge = valence electrons − lone-pair electrons − number of bonds. Boron has three valence electrons.', 'Compare the sizes of the charges in the two structures, and ask which atom would have to carry a positive charge.'],
    s: 'Read from the figure and compute: in I boron has three bonds and no lone pair, 3 − 0 − 3 = 0, and every fluorine is 7 − 6 − 1 = 0. In II boron has four bonds, 3 − 0 − 4 = −1, and the doubly bonded fluorine is 7 − 4 − 2 = +1 — a positive charge on the most electronegative element. Formal charges favour Structure I, in which boron is 0, even though boron then has only six electrons.',
  },
  {
    t: 'count the charged atoms in the disfavoured arrangement', d: 3, need: 'calc',
    spec: mols([
      molecule([at('H', 'H', { x: 0, y: 0 }), at('C', 'C', { x: 1, y: 0, lonePairs: 0 }), at('N', 'N', { x: 2, y: 0, lonePairs: 1 })], [bd('H', 'C'), bd('C', 'N', 3)], { label: 'I' }),
      molecule([at('H', 'H', { x: 0, y: 0 }), at('N', 'N', { x: 1, y: 0, lonePairs: 0 }), at('C', 'C', { x: 2, y: 0, lonePairs: 1 })], [bd('H', 'N'), bd('N', 'C', 3)], { label: 'II' }),
    ], { showFormalCharges: false }),
    alt: `I: hydrogen, carbon, nitrogen in a row, a single bond then a triple bond, one lone pair on the nitrogen. II: hydrogen, nitrogen, carbon in a row, a single bond then a triple bond, one lone pair on the carbon. No formal charges are marked. ${ALT_LEWIS}`,
    q: 'The diagram shows two ways of joining one hydrogen, one carbon and one nitrogen atom, drawn as Lewis structures without formal charges. In the arrangement that formal charges do NOT favour, how many atoms carry a non-zero formal charge?',
    n: '2',
    calc: ['atoms with a non-zero mol_formal_charge in the structure mol_best_structure does not name', (c) => { const worse = c.txt('mol_best_structure') === 'I' ? 1 : 0; return (worse === 1 ? ['H', 'N', 'C'] : ['H', 'C', 'N']).filter((a) => fcOf(c, a, worse) !== 0).length; }],
    h: ['Compute the formal charge on carbon and on nitrogen in each arrangement.', 'The favoured arrangement is the one in which every formal charge is zero; count the charged atoms in the other.'],
    s: 'Read from the figure and compute: in I carbon has four bonds and no lone pair (4 − 0 − 4 = 0) and nitrogen has three bonds and one lone pair (5 − 2 − 3 = 0), so every atom is neutral and I is favoured. In II nitrogen has four bonds and no lone pair (5 − 0 − 4 = +1) and carbon has three bonds and one lone pair (4 − 2 − 3 = −1). Two atoms carry a charge.',
  },
]);

GA('87ef2ba6.lo-4', 'Resonance structures', [
  {
    t: 'average bond order over the resonance structures', d: 3, need: 'calc',
    spec: mols([carbonate(1), carbonate(2), carbonate(3)], { between: 'resonance' }),
    alt: `Three structures joined by double-headed arrows. In each a carbon atom is joined to three oxygen atoms by one double bond and two single bonds; the double bond is to a different oxygen in each structure, and each singly bonded oxygen carries three lone pairs and a minus sign. ${ALT_LEWIS}`,
    q: 'The three resonance structures of the carbonate ion are shown. What is the average carbon–oxygen bond order in the real ion? Give your answer to two decimal places.',
    n: '1.33', ck: ['mol_bond_order', { a: 'C', b: 'O1', molecule: 'average' }],
    h: ['Follow one particular carbon–oxygen bond through all three structures and note its order in each.', 'Average the three orders; the real ion is the hybrid of the three structures.'],
    s: 'Read from the figure: the bond from carbon to any one oxygen is a double bond in one structure and a single bond in the other two. Its average order is (2 + 1 + 1) / 3 = 4/3 ≈ 1.33, the same for all three bonds.',
  },
  {
    t: 'complete the second resonance structure', d: 3, need: 'reason',
    spec: mols([
      molecule([at('C', 'C', { lonePairs: 0 }), at('H', 'H'), at('O1', 'O', { lonePairs: 2 }), at('O2', 'O', LP3)], [bd('C', 'H'), bd('C', 'O1', 2), bd('C', 'O2')], { layout: { type: 'trigonal_planar', center: 'C', around: ['H', 'O1', 'O2'] }, label: 'I' }),
      molecule([at('C', 'C', { lonePairs: 0 }), at('H', 'H'), at('O1', 'O', LP3), at('O2', 'O', { lonePairs: 2 })], [bd('C', 'H'), bd('C', 'O1'), bd('C', 'O2', 2, { show: 'blank' })], { layout: { type: 'trigonal_planar', center: 'C', around: ['H', 'O1', 'O2'] }, label: 'II' }),
    ], { between: 'resonance' }),
    alt: 'In each structure a carbon atom is joined to a hydrogen atom above it and to two oxygen atoms below it. I: a double bond to the left oxygen (two lone pairs), a single bond to the right oxygen (three lone pairs, a minus sign). II: a single bond to the left oxygen (three lone pairs, a minus sign); the bond to the right oxygen, which has two lone pairs, is hidden.',
    q: 'Two resonance structures of the methanoate (formate) ion are shown; one bond in structure II is hidden by a question mark. What is the order of the hidden bond (1 for single, 2 for double)?',
    n: '2', ck: ['mol_bond_order', { a: 'C', b: 'O2', molecule: 1 }],
    h: ['Resonance structures have the same atoms in the same places and the same number of electrons; only electron pairs move.', 'In structure II, count the lone pairs on the oxygen at the hidden bond, then ask how many shared electrons complete its octet.'],
    s: 'Read from the figure: in II the right-hand oxygen has two lone pairs (4 electrons) and no charge, so it needs 4 shared electrons — a double bond. This is structure I with the double bond and the negative charge exchanged between the two oxygens, and carbon still has four bonds. The hidden bond has order 2.',
  },
  {
    t: 'judge a claimed pair of resonance structures', d: 4, need: 'reason',
    spec: mols([
      lin3(at('N', 'N', { lonePairs: 2 }), at('C', 'C', { lonePairs: 0 }), at('O', 'O', { lonePairs: 2 }), [2, 2], { label: 'I' }),
      lin3(at('C', 'C', { lonePairs: 1 }), at('N', 'N', { lonePairs: 0 }), at('O', 'O', LP3), [3, 1], { label: 'II' }),
    ]),
    alt: `I: nitrogen, carbon, oxygen in a row joined by two double bonds, two lone pairs on each end atom, a minus sign on the nitrogen. II: carbon, nitrogen, oxygen in a row, a triple bond then a single bond, one lone pair on the carbon and three on the oxygen, a minus sign on the carbon and on the oxygen and a plus sign on the nitrogen. ${ALT_LEWIS}`,
    q: 'A student claims that the two Lewis structures shown are resonance structures of the same ion. Which statement about the claim is correct?',
    o: [
      ['Wrong: the atoms are joined in a different order', 'correct'],
      ['Right: both structures show 16 valence electrons', 'treats an equal electron count as enough'],
      ['Wrong: the structures show different numbers of electrons', 'miscounts: both show 16 valence electrons'],
      ['Right: both structures have an overall charge of −1', 'treats an equal overall charge as enough'],
    ],
    holds: ['resonance structures keep every atom in place: compare the middle atom of the two rows (spec), the electron counts (mol_count) and the summed formal charges', [
      (c) => (arr(arr(c.p.molecules)[0].atoms)[1].el !== arr(arr(c.p.molecules)[1].atoms)[1].el),
      (c) => (arr(arr(c.p.molecules)[0].atoms)[1].el === arr(arr(c.p.molecules)[1].atoms)[1].el) && molCount(c, 'valence_electrons', { molecule: 0 }) === 16 && molCount(c, 'valence_electrons', { molecule: 1 }) === 16,
      (c) => molCount(c, 'valence_electrons', { molecule: 0 }) !== molCount(c, 'valence_electrons', { molecule: 1 }),
      (c) => (arr(arr(c.p.molecules)[0].atoms)[1].el === arr(arr(c.p.molecules)[1].atoms)[1].el) && fcOf(c, 'N', 0) + fcOf(c, 'C', 0) + fcOf(c, 'O', 0) === -1,
    ]],
    h: ['Resonance structures differ only in where electron pairs are drawn.', 'Look at which atom is in the middle of each structure.'],
    s: 'Read from the figure: in I the middle atom is carbon (N–C–O); in II it is nitrogen (C–N–O). Both show 16 valence electrons and an overall charge of −1, but resonance structures must keep every atom bonded to the same neighbours and move only electrons. These are two different ions (cyanate and fulminate), so the claim is wrong: the atoms are joined in a different order.',
  },
  {
    t: 'average formal charge on an atom of the hybrid', d: 4, need: 'calc',
    spec: mols([
      molecule([at('O1', 'O', { lonePairs: 2 }), at('O2', 'O', { lonePairs: 1 }), at('O3', 'O', LP3)], [bd('O1', 'O2', 2), bd('O2', 'O3')], { layout: { type: 'bent', center: 'O2', around: ['O1', 'O3'], angle: 117 } }),
      molecule([at('O1', 'O', LP3), at('O2', 'O', { lonePairs: 1 }), at('O3', 'O', { lonePairs: 2 })], [bd('O1', 'O2'), bd('O2', 'O3', 2)], { layout: { type: 'bent', center: 'O2', around: ['O1', 'O3'], angle: 117 } }),
    ], { between: 'resonance', showFormalCharges: false }),
    alt: `Two bent structures of three oxygen atoms joined by a double-headed arrow. In the first the middle oxygen is double-bonded to the left oxygen and single-bonded to the right one; in the second the double bond is on the right. The middle oxygen has one lone pair, a doubly bonded end oxygen two and a singly bonded end oxygen three. No formal charges are marked. ${ALT_LEWIS}`,
    q: 'The two resonance structures of ozone, O3, are shown without their formal charges. Averaged over the two structures, what is the formal charge on the left-hand oxygen atom? Give a signed decimal.',
    n: '-0.5',
    calc: ['mean of mol_formal_charge of the left-hand oxygen over the two structures', (c) => (fcOf(c, 'O1', 0) + fcOf(c, 'O1', 1)) / 2],
    h: ['Find the formal charge on the left-hand oxygen in each structure separately: 6 − lone-pair electrons − bonds.', 'The real molecule is an equal blend of the two structures, so average the two values.'],
    s: 'Read from the figure: in the first structure the left-hand oxygen has two lone pairs and a double bond, 6 − 4 − 2 = 0; in the second it has three lone pairs and a single bond, 6 − 6 − 1 = −1. The average is (0 + (−1)) / 2 = −0.5.',
  },
]);

// ── AP Chemistry · VSEPR Theory and Molecular Geometry (pack 162) ───────────

GA('4354050b.lo-1', 'Reading and completing a Lewis structure', [
  {
    t: 'count the electrons round the central atom', d: 2, need: 'calc',
    spec: mols([lin3(at('F1', 'F', LP3), at('Xe', 'Xe', LP3), at('F2', 'F', LP3), [1, 1])]),
    alt: `Three atoms in a row: fluorine, xenon, fluorine, joined by single bonds. Every atom carries three lone pairs. ${ALT_LEWIS}`,
    q: 'How many valence electrons surround the central atom in the Lewis structure shown? Count both electrons of each of its bonds and every electron in its lone pairs.',
    n: '10', ck: ['mol_count', { want: 'valence_electrons', atom: 'Xe' }],
    h: ['Each bond line to the central atom is two electrons that count toward it.', 'Add the dots drawn on the central atom itself; ignore the dots on the outer atoms.'],
    s: 'Read from the figure: the central xenon atom has two single bonds (2 × 2 = 4 electrons) and three lone pairs (3 × 2 = 6 electrons). 4 + 6 = 10 electrons — an expanded octet.',
  },
  {
    t: 'find the overall charge of a drawn species', d: 3, need: 'calc',
    spec: mols([molecule([at('N', 'N', { lonePairs: 0 }), at('O1', 'O', { lonePairs: 2 }), at('O2', 'O', LP3), at('O3', 'O', LP3)], [bd('N', 'O1', 2), bd('N', 'O2'), bd('N', 'O3')], { layout: { type: 'trigonal_planar', center: 'N', around: ['O1', 'O2', 'O3'] } })], { showFormalCharges: false }),
    alt: `A nitrogen atom in the middle is joined to three oxygen atoms: a double bond to the top one, which has two lone pairs, and single bonds to the other two, which have three lone pairs each. No charges are marked. ${ALT_LEWIS}`,
    q: 'The diagram shows a Lewis structure in which every valence electron is drawn but no charge is marked. What is the overall charge of the species? Give a signed whole number.',
    n: '-1',
    calc: ['sum of mol_formal_charge over the four atoms', (c) => ['N', 'O1', 'O2', 'O3'].reduce((t, a) => t + fcOf(c, a), 0)],
    h: ['Count every electron drawn: two for each bond line and two for each pair of dots.', 'Compare that with the valence electrons the neutral atoms bring: 5 for nitrogen and 6 for each oxygen.'],
    s: 'Read from the figure: four bond lines (8 electrons) and eight lone pairs (16 electrons) make 24 electrons. One nitrogen and three oxygen atoms bring 5 + 3 × 6 = 23. The structure has one electron more than the neutral atoms, so the overall charge is −1 (the nitrate ion).',
  },
  {
    t: 'identify the hidden central atom', d: 4, need: 'reason',
    spec: mols([molecule([at('X', 'S', { lonePairs: 2, show: { label: 'blank' } }), at('Cl1', 'Cl', LP3), at('Cl2', 'Cl', LP3)], [bd('X', 'Cl1'), bd('X', 'Cl2')], { layout: { type: 'bent', center: 'X', around: ['Cl1', 'Cl2'] } })]),
    alt: `A central atom whose symbol is hidden is joined by single bonds to two chlorine atoms below it, one on each side. The hidden atom carries two lone pairs and each chlorine three. ${ALT_LEWIS}`,
    q: 'In the Lewis structure shown, the symbol of the central atom is hidden. The molecule is neutral, every atom has a formal charge of zero, and the hidden atom is in period 3. Which element is it?',
    o: [['Sulfur', 'correct'], ['Phosphorus', 'counts only one of the two lone pairs on the central atom'], ['Silicon', 'counts the bonding electrons and leaves out the lone pairs'], ['Chlorine', 'counts both electrons of each bond as belonging to the central atom']],
    calc: ['valence electrons of the hidden atom at formal charge 0 = 2 × lone pairs + bonds (mol_count), matched to period 3', (c) => ({ 4: 'Silicon', 5: 'Phosphorus', 6: 'Sulfur', 7: 'Chlorine' } as Record<number, string>)[2 * molCount(c, 'lone_pairs', { atom: 'X' }) + molCount(c, 'bonding_pairs', { atom: 'X' })]],
    h: ['With a formal charge of zero, an atom\'s valence electrons equal its lone-pair electrons plus one electron for each bond.', 'Find the group from the number of valence electrons, then take the element of that group in period 3.'],
    s: 'Read from the figure: the hidden atom has two lone pairs (4 electrons) and two single bonds (1 electron each), so at formal charge zero it has 4 + 2 = 6 valence electrons. The period-3 element with six valence electrons is sulfur; the molecule is SCl2.',
  },
  {
    t: 'count the electrons shared in bonds', d: 2, need: 'calc',
    spec: mols([molecule([at('H1', 'H', { x: 0, y: 0 }), at('C1', 'C', { x: 1, y: 0, lonePairs: 0 }), at('C2', 'C', { x: 2, y: 0, lonePairs: 0 }), at('H2', 'H', { x: 3, y: 0 })], [bd('H1', 'C1'), bd('C1', 'C2', 3), bd('C2', 'H2')])]),
    alt: `Four atoms in a row: hydrogen, carbon, carbon, hydrogen. Single lines join each hydrogen to its carbon and a triple line joins the two carbons. No lone pairs are present. ${ALT_LEWIS}`,
    q: 'How many electrons are shared between atoms in the Lewis structure shown?',
    n: '10',
    calc: ['2 × mol_count bonding_pairs', (c) => 2 * molCount(c, 'bonding_pairs')],
    h: ['Every line between two atoms is one shared pair.', 'Count the lines, including each line of the multiple bond, and double the count.'],
    s: 'Read from the figure: two single bonds (one line each) and one triple bond (three lines) are five shared pairs. 5 × 2 = 10 shared electrons.',
  },
]);

// ── AP Biology · Biotechnology Techniques and Applications (pack 058) ───────

const ALT_GEL = 'Wells are at the top; a band nearer the bottom is a shorter fragment. The left-hand lane is a ladder of fragments of known size.';

GA('252560d4.lo-2', 'Interpreting PCR results', [
  {
    t: 'target present or absent, with controls', d: 3, need: 'reason',
    spec: gel([1000, 750, 500, 250, 100], [['I', [500]], ['II', []], ['III', [500]], ['IV', [250]], ['Pos', [500]], ['Neg', []]]),
    alt: `Six sample lanes: I, II, III and IV for the patients, then Pos and Neg for the controls. Some lanes show one band and some show none; one patient lane has its band at a different level from the others. ${ALT_GEL}`,
    q: 'A PCR with primers for a 500 bp region of a viral gene was run on samples from four patients (lanes I to IV), a positive control (Pos) and a no-template control (Neg), and the products were run beside a size ladder (L) on the gel shown. Which patients\' samples contain the viral gene?',
    o: [['Patients I and III', 'correct'], ['Patients I, III and IV', 'counts any band as a positive result, whatever its size'], ['Patients II and IV', 'reads the lanes without the expected band as the positive ones'], ['Patient IV only', 'takes the band that travelled furthest as the target']],
    calc: ['patient lanes with a band at 500 bp (gel_lanes_with_band), after checking the controls (gel_presence)', (c) => {
      if (!hasBand(c, 'Pos', 500) || hasBand(c, 'Neg', 500)) throw new Error('the controls do not validate the run');
      const hit = c.txt('gel_lanes_with_band', { size: 500 }).split(', ').filter((l) => /^[IV]+$/.test(l));
      return `Patient${hit.length > 1 ? 's' : ''} ${hit.length > 1 ? `${hit.slice(0, -1).join(', ')} and ${hit[hit.length - 1]}` : `${hit[0]} only`}`;
    }],
    h: ['Check the two controls first: they tell you whether the run can be trusted and where the target band lies.', 'A sample is positive only if its band is level with the band of the positive control.'],
    s: 'Read from the figure: the positive control has a band level with the 500 marker and the no-template control has none, so the run is valid. Lanes I and III have a band at 500 bp. Lane II has no band. Lane IV has a band at 250 bp, which is not the 500 bp target (a non-specific product). The viral gene is present in patients I and III.',
  },
  {
    t: 'relative starting amount from two Ct values', d: 3, need: 'calc',
    spec: amp([['P', 20], ['Q', 25], ['NTC', null]]),
    alt: 'Curve P rises first and curve Q some cycles later, each crossing the dashed threshold line on a numbered gridline before levelling off; curve NTC stays flat along the bottom.',
    q: 'The amplification plot shows a qPCR run on two samples, P and Q, and a no-template control (NTC). Assume that the amount of product doubles in every cycle. How many times as much target DNA did sample P contain at the start as sample Q?',
    n: '32', ck: ['amp_fold_difference', { more: 'P', less: 'Q' }],
    h: ['Read the cycle at which each curve crosses the threshold line.', 'Each cycle of difference is one doubling.'],
    s: 'Read from the figure: curve P crosses the threshold at cycle 20 and curve Q at cycle 25, a difference of 5 cycles. Q needed five more doublings to reach the same amount, so P started with 2^5 = 32 times as much target.',
  },
  {
    t: 'quantify an unknown against a standard', d: 4, need: 'calc',
    spec: amp([['Standard', 15], ['Unknown', 20], ['NTC', null]]),
    alt: 'The curve named Standard rises first and the curve named Unknown some cycles later, each crossing the dashed threshold line on a numbered gridline; the curve NTC stays flat along the bottom.',
    q: 'The amplification plot shows a qPCR run on a standard that contained 6400 copies of a target gene, an unknown sample, and a no-template control (NTC). Assume that the amount of product doubles in every cycle. How many copies of the target did the unknown sample contain at the start?',
    n: '200',
    calc: ['6400 ÷ amp_fold_difference(Standard over Unknown)', (c) => 6400 / c.num('amp_fold_difference', { more: 'Standard', less: 'Unknown' })],
    h: ['Read the threshold cycle of the standard and of the unknown, and find how many cycles apart they are.', 'A sample that crosses the threshold n cycles later started with 2^n times fewer copies.'],
    s: 'Read from the figure: the standard crosses the threshold at cycle 15 and the unknown at cycle 20, five cycles later. The unknown therefore started with 2^5 = 32 times fewer copies: 6400 / 32 = 200 copies.',
  },
  {
    t: 'judge a run from its no-template control', d: 4, need: 'reason',
    spec: gel([1000, 750, 500, 250, 100], [['I', [500]], ['II', [500]], ['Pos', [500]], ['Neg', [500]]]),
    alt: `Four sample lanes: I and II for the water samples, then Pos and Neg for the controls. Each of the four lanes shows one band. ${ALT_GEL}`,
    q: 'A PCR for a 500 bp bacterial gene was run on two water samples (lanes I and II), a positive control (Pos) and a no-template control (Neg), and the products were run on the gel shown. Which conclusion do the results support?',
    o: [
      ['Neither sample can be judged; the run is contaminated', 'correct'],
      ['The two samples contain the gene', 'reads the sample lanes without checking the no-template control'],
      ['The two samples lack the gene', 'reads a band as the absence of the target'],
      ['Sample I contains the gene; sample II lacks it', 'misreads lane II'],
    ],
    holds: ['gel_presence of the 500 bp band in each lane: a band in the no-template control invalidates the run', [
      (c) => hasBand(c, 'Neg', 500),
      (c) => !hasBand(c, 'Neg', 500) && hasBand(c, 'I', 500) && hasBand(c, 'II', 500),
      (c) => !hasBand(c, 'Neg', 500) && !hasBand(c, 'I', 500) && !hasBand(c, 'II', 500),
      (c) => !hasBand(c, 'Neg', 500) && hasBand(c, 'I', 500) && !hasBand(c, 'II', 500),
    ]],
    h: ['The no-template control contains every reagent except sample DNA. What should its lane look like?', 'If a control does not behave as it should, ask what else could have produced the bands in the sample lanes.'],
    s: 'Read from the figure: all four lanes, including the no-template control, have a band at 500 bp. A band in the lane that received no sample DNA means target DNA got into the reagents or tubes, so the bands in lanes I and II may come from the same contamination. Neither sample can be judged; the run must be repeated with clean reagents.',
  },
]);

GA('252560d4.lo-4', 'Reading fragment size and amount from a gel', [
  {
    t: 'size of a band against the ladder', d: 2, need: 'read',
    spec: gel([3000, 2000, 1500, 1000, 750, 500, 250], [['S', [2000, 750]]]), hide: [750],
    alt: `One sample lane, S, shows two bands, each level with a ladder band. ${ALT_GEL}`,
    q: 'A DNA sample was run beside a size ladder on the gel shown. What is the size of the smaller of the two fragments in lane S, in base pairs?',
    n: '750', ck: ['gel_band_size', { lane: 'S', band: 1 }],
    h: ['Shorter fragments move further from the wells.', 'Follow the dotted line from the lower band of lane S across to the ladder.'],
    s: 'Read from the figure: the smaller fragment is the band further from the wells. It is level with the ladder band labelled 750, so the fragment is 750 bp long.',
  },
  {
    t: 'size against amount (band thickness)', d: 3, need: 'reason',
    spec: gel([2000, 1000, 500, 250], [['I', [1000]], ['II', [{ size: 1000, thick: 3 }]], ['III', [500]]]),
    alt: `Three sample lanes, I, II and III, each with one band. Two of the bands are at the same level and one of those two is much thicker; the third band is lower. ${ALT_GEL}`,
    q: 'Equal volumes of three DNA samples were loaded in lanes I, II and III of the gel shown. Which statement about the samples does the gel support?',
    o: [
      ['II holds the same fragment as I, in a larger amount', 'correct'],
      ['II holds a longer fragment than I, in the same amount', 'reads the thickness of a band as the size of its fragment'],
      ['III holds a longer fragment than I, in the same amount', 'takes the band further from the wells as the longer fragment'],
      ['III holds the same fragment as I, in a smaller amount', 'reads the position of a band as the amount of DNA'],
    ],
    holds: ['band sizes by gel_band_size and band thickness from the spec', [
      (c) => c.num('gel_band_size', { lane: 'II' }) === c.num('gel_band_size', { lane: 'I' }) && ((arr(arr(c.p.lanes)[1].bands)[0] as P).thick as number) > 1,
      (c) => c.num('gel_band_size', { lane: 'II' }) > c.num('gel_band_size', { lane: 'I' }),
      (c) => c.num('gel_band_size', { lane: 'III' }) > c.num('gel_band_size', { lane: 'I' }),
      (c) => c.num('gel_band_size', { lane: 'III' }) === c.num('gel_band_size', { lane: 'I' }),
    ]],
    h: ['The position of a band tells you the length of the fragment; nothing else.', 'What does a thicker, darker band at the same position tell you?'],
    s: 'Read from the figure: the bands of lanes I and II are level with the 1000 marker, so both hold a 1000 bp fragment; the band of lane II is much thicker, so it holds more DNA. The band of lane III is level with the 500 marker: a shorter fragment. So II holds the same fragment as I, in a larger amount.',
  },
  {
    t: 'estimate a size between two markers', d: 4, need: 'reason',
    spec: gel([10000, 1000, 100], [['S', [316]]]),
    alt: `One sample lane, S, shows a single band about half-way between the lower two of the three ladder bands. ${ALT_GEL}`,
    q: 'A DNA fragment was run in lane S beside a ladder on the gel shown. Which is the best estimate of the length of the fragment?',
    o: [['About 300 bp', 'correct'], ['About 550 bp', 'takes the half-way point on an even scale: (1000 + 100) / 2'], ['About 3000 bp', 'reads the band between the wrong pair of ladder bands'], ['About 30 bp', 'places the band below the smallest ladder band']],
    holds: ['gel_band_size accepts an estimate within 10 % of the true size and on the same side of every ladder band', [
      (c) => c.num('gel_band_size', { lane: 'S', claimed: 300 }) === 300,
      (c) => c.num('gel_band_size', { lane: 'S', claimed: 550 }) === 550,
      (c) => c.num('gel_band_size', { lane: 'S', claimed: 3000 }) === 3000,
      (c) => c.num('gel_band_size', { lane: 'S', claimed: 30 }) === 30,
    ]],
    h: ['Compare the spacing of the three ladder bands with their sizes: is the scale of the gel even?', 'Equal distances on a gel are equal RATIOS of length, so the half-way point between two markers is not their average.'],
    s: 'Read from the figure: the ladder bands at 10 000, 1000 and 100 bp are equally spaced, so each equal step down the gel divides the length by the same factor (here 10). The band of lane S is half-way between the 1000 and 100 markers, so its length is 1000 divided by the square root of 10, about 316 bp — about 300 bp, not the average 550 bp.',
  },
  {
    t: 'place a cut site from single and double digests', d: 4, need: 'calc',
    spec: gel([6000, 4000, 3000, 2000, 1000, 500], [['E', [6000]], ['B', [4000, 2000]], ['E + B', [3000, 2000, 1000]]]), hide: [1000],
    alt: `Three sample lanes: E with one band, B with two bands and E + B with three bands, every band level with a ladder band. ${ALT_GEL}`,
    q: 'A circular plasmid was cut with the enzyme EcoRI (lane E), with BamHI (lane B) and with both enzymes together (lane E + B), and the three digests were run on the gel shown. How far is the EcoRI site from the nearer BamHI site, in base pairs?',
    n: '1000',
    calc: ['the BamHI fragment missing from the double digest is the one EcoRI cuts; the smaller of the two new bands is the distance (gel_band_size)', (c) => {
      const [b, eb] = [bandsOf(c, 'B'), bandsOf(c, 'E + B')];
      const cut = b.filter((x) => !eb.includes(x));
      const pieces = eb.filter((x) => !b.includes(x));
      if (cut.length !== 1 || pieces.length !== 2 || pieces[0] + pieces[1] !== cut[0] || bandsOf(c, 'E').length !== 1) throw new Error('the digests do not fit one EcoRI site');
      return Math.min(...pieces);
    }],
    h: ['Compare lane B with lane E + B: which BamHI fragment has disappeared, and which new bands replace it?', 'The EcoRI site lies inside the fragment that disappeared; the two new bands are its distances from the two ends of that fragment.'],
    s: 'Read from the figure: EcoRI alone gives one 6000 bp band (one site); BamHI alone gives 4000 and 2000 bp (two sites). In the double digest the 2000 bp band is still there but the 4000 bp band is replaced by 3000 and 1000 bp bands (3000 + 1000 = 4000). So the EcoRI site lies inside the 4000 bp BamHI fragment, 1000 bp from one BamHI site and 3000 bp from the other. The nearer site is 1000 bp away.',
  },
]);

GA('252560d4.lo-7', 'Combining PCR and gel results', [
  {
    t: 'genotype from a digested PCR product', d: 3, need: 'reason',
    spec: gel([800, 600, 400, 200, 100], [['I', [600]], ['II', [400, 200]], ['III', [600, 400, 200]]]),
    alt: `Three sample lanes, I, II and III, showing one band, two bands and three bands; every band is level with a ladder band. ${ALT_GEL}`,
    q: 'A 600 bp region of a gene was amplified by PCR from three people. Allele R of the gene has one cut site for a restriction enzyme inside the region; allele r has none. Each PCR product was treated with the enzyme and run on the gel shown. Which person is heterozygous (Rr)?',
    o: [['Person III', 'correct'], ['Person I', 'takes the uncut product as a mixture of the two alleles'], ['Person II', 'takes two bands to mean two different alleles'], ['None of the three people', 'expects a heterozygote to show exactly two bands']],
    calc: ['the lane that shows the uncut 600 bp band AND the two pieces (gel_presence)', (c) => { const hit = ['I', 'II', 'III'].filter((l) => hasBand(c, l, 600) && hasBand(c, l, 400) && hasBand(c, l, 200)); return hit.length === 1 ? `Person ${hit[0]}` : 'None of the three people'; }],
    h: ['Work out what one allele of each kind gives after the enzyme: how many bands, and of what sizes?', 'A heterozygote has one copy of each allele, so its lane shows the bands of both.'],
    s: 'Read from the figure: lane I has only the uncut 600 bp band (rr); lane II has only the 400 and 200 bp pieces (RR: 400 + 200 = 600); lane III has all three bands — an uncut r product and a cut R product. Person III is heterozygous.',
  },
  {
    t: 'what the gel cannot show (when sequencing is needed)', d: 4, need: 'reason',
    spec: gel([800, 600, 400, 200], [['I', [400]], ['II', [400]]]),
    alt: `Two sample lanes, I and II, each with one band; the two bands are at the same level, level with a ladder band. ${ALT_GEL}`,
    q: 'The same region of a gene was amplified by PCR from two patients and the products were run on the gel shown. Patient II is known to carry a single-base substitution inside the region; patient I does not. Which statement do the results support?',
    o: [
      ['The gel cannot show the substitution; sequencing can', 'correct'],
      ['The gel shows that the two sequences are identical', 'takes equal length to mean equal sequence'],
      ['The PCR failed for patient II', 'expects a mutant allele to give no product'],
      ['The substitution has shortened the product of patient II', 'expects a substitution to change the length of the DNA'],
    ],
    holds: ['gel_band_size and gel_presence: both products are present and of one length — a gel compares lengths only (the stem says the sequences differ)', [
      (c) => c.num('gel_fragment_count', { lane: 'II' }) === 1 && c.num('gel_band_size', { lane: 'I' }) === c.num('gel_band_size', { lane: 'II' }),
      () => false, // the stem states that patient II's sequence differs by one base
      (c) => c.num('gel_fragment_count', { lane: 'II' }) === 0,
      (c) => c.num('gel_band_size', { lane: 'II' }) < c.num('gel_band_size', { lane: 'I' }),
    ]],
    h: ['What property of a DNA fragment decides how far it moves through a gel?', 'A substitution swaps one base for another. Does that change the number of base pairs?'],
    s: 'Read from the figure: both lanes have one band, at the same level (400 bp), so both PCRs worked and the two products have the same length. A substitution replaces one base without adding or removing any, so the product keeps its length and a gel, which separates by length only, cannot reveal it. Sequencing the two products, which reads the order of the bases, can.',
  },
  {
    t: 'paternity from an STR locus', d: 3, need: 'reason',
    spec: gel([1500, 1200, 900, 700, 500, 300], [['Mother', [900, 500]], ['Child', [900, 300]], ['Man I', [1200, 500]], ['Man II', [700, 300]], ['Man III', [900, 500]]]),
    alt: `Five sample lanes — Mother, Child, Man I, Man II and Man III — each with two bands level with ladder bands. ${ALT_GEL}`,
    q: 'One STR locus was amplified by PCR from a mother, her child and three men, and the products were run on the gel shown. Which man could be the biological father of the child?',
    o: [['Man II', 'correct'], ['Man I', 'matches a man to the mother instead of to the child'], ['Man III', 'matches the band the child received from the mother'], ['None of the three men', 'expects the father to share both bands with the child']],
    calc: ['gel_match, mode paternity: the man who has the child\'s band that the mother lacks', (c) => c.txt('gel_match', { mode: 'paternity', child: 'Child', mother: 'Mother', candidates: ['Man I', 'Man II', 'Man III'] })],
    h: ['The child has two alleles at the locus: one from each parent. Which of the child\'s bands does the mother also have?', 'The child\'s other band must have come from the father.'],
    s: 'Read from the figure: the child has bands at 900 and 300 bp. The mother has 900 and 500, so the 900 bp allele came from her and the 300 bp allele must come from the father. Only Man II has a 300 bp band, so only Man II could be the father.',
  },
  {
    t: 'size of a deletion from product lengths', d: 3, need: 'calc',
    spec: gel([900, 600, 450, 300, 200, 100], [['Normal', [450]], ['Patient', [450, 300]]]),
    alt: `Two sample lanes: Normal with one band and Patient with two bands, every band level with a ladder band. ${ALT_GEL}`,
    q: 'A region of a gene was amplified by PCR from a person with two normal alleles and from a patient who is heterozygous for a deletion inside the region; the gel shown was run on the two products. How many base pairs are missing from the patient\'s deletion allele?',
    n: '150',
    calc: ['normal band − the patient\'s extra, shorter band (gel_band_size)', (c) => c.num('gel_band_size', { lane: 'Normal' }) - c.num('gel_band_size', { lane: 'Patient', band: 1 })],
    h: ['The patient has one normal allele and one deletion allele, so the patient\'s lane shows a product of each.', 'Read the sizes of the two bands in the patient\'s lane and compare them.'],
    s: 'Read from the figure: the normal product is level with the 450 marker. The patient has that band and a second band level with the 300 marker, the product of the deletion allele. 450 − 300 = 150 base pairs are missing.',
  },
]);

// ── AP Biology · Organelle Structure and Function (pack 065) ────────────────

const ALT_CELL = 'The organelles are drawn as simple shapes inside the cell outline; leader lines join some of them to Roman-numeral labels outside the cell. No key names the shapes.';
const ANIMAL_I_V: Array<[string, string | null]> = [['nucleus', 'I'], ['rough_er', 'II'], ['golgi', 'III'], ['mitochondrion', 'IV'], ['lysosome', 'V'], ['smooth_er', null], ['ribosomes', null], ['cell_membrane', null]];

GA('4dbe1414.lo-1', 'Recognising organelles in a cell diagram', [
  {
    t: 'name a labelled organelle', d: 2, need: 'read',
    spec: cell('animal', ANIMAL_I_V),
    alt: `Five parts are labelled I to V; a winding tube, a cluster of dots and the cell outline are drawn but not labelled. ${ALT_CELL}`,
    q: 'Which organelle is labelled III in the diagram of an animal cell shown?',
    o: [['Golgi apparatus', 'correct'], ['Rough endoplasmic reticulum', 'confuses the stack of flattened sacs with the membranes beside the nucleus'], ['Smooth endoplasmic reticulum', 'takes any stack of membranes without ribosomes for smooth ER'], ['Mitochondrion', 'confuses the stack of sacs with the folded inner membrane of a mitochondrion']],
    holds: ['bio_identify of label III', [(c) => c.txt('bio_identify', { label: 'III' }) === 'Golgi apparatus', (c) => c.txt('bio_identify', { label: 'III' }) === 'rough ER', (c) => c.txt('bio_identify', { label: 'III' }) === 'smooth ER', (c) => c.txt('bio_identify', { label: 'III' }) === 'mitochondrion']],
    h: ['Look at the shape: a stack of separate, bowed sacs with small vesicles beside it.', 'It is not attached to the nucleus and carries no ribosomes.'],
    s: 'Read from the figure: label III points to a stack of flattened, bowed sacs with small round vesicles at its edge, lying away from the nucleus. That is the Golgi apparatus. The rough ER is the set of ribosome-studded membranes next to the nucleus (II).',
  },
  {
    t: 'match a cell\'s workload to an organelle', d: 3, need: 'reason',
    spec: cell('animal', [['nucleus', 'I'], ['mitochondrion', 'II'], ['golgi', 'III'], ['lysosome', 'IV'], ['rough_er', 'V'], ['cell_membrane', null]]),
    alt: `Five parts are labelled I to V. ${ALT_CELL}`,
    q: 'The diagram shows an animal cell. A heart-muscle cell contracts continuously and uses far more ATP than a skin cell. Which labelled structure would be much more numerous in the heart-muscle cell?',
    o: [['Structure II', 'correct'], ['Structure III', 'links energy use with the packaging of proteins'], ['Structure IV', 'links energy use with the digestion of worn-out parts'], ['Structure V', 'links energy use with the making of proteins']],
    calc: ['"Structure " + bio_label_of mitochondrion', (c) => `Structure ${labelOf(c, 'mitochondrion')}`],
    h: ['Which organelle makes most of a cell\'s ATP?', 'Find its shape in the diagram: a capsule whose inner membrane is folded.'],
    s: 'Most ATP is made by aerobic respiration in mitochondria, so a cell with a high ATP demand has many of them. Read from the figure: the capsule with a folded (zig-zag) inner membrane is labelled II. Structure II would be much more numerous.',
  },
  {
    t: 'structures shared by plant and animal cells', d: 3, need: 'reason',
    spec: cell('plant', [['chloroplast', 'I'], ['mitochondrion', 'II'], ['central_vacuole', 'III'], ['golgi', 'IV'], ['cell_wall', 'V'], ['rough_er', null], ['cell_membrane', null]]),
    alt: `Five parts are labelled I to V; the nucleus with the membranes beside it and the thin inner outline are drawn but not labelled. ${ALT_CELL}`,
    q: 'Which of the labelled structures in the plant cell shown would also be found in an animal cell?',
    o: [['II and IV only', 'correct'], ['All five structures', 'takes every organelle of a plant cell to be present in an animal cell'], ['II only', 'takes the Golgi apparatus to be a plant structure'], ['II, III and IV only', 'takes the large central vacuole to be present in animal cells']],
    calc: ['labels (bio_label_of) of the labelled organelles that are not plant-only', (c) => `${['mitochondrion', 'golgi'].map((p) => labelOf(c, p)).join(' and ')} only`],
    h: ['First name each labelled structure from its shape.', 'Three kinds of structure are found in plant cells but not in animal cells: one makes sugars, one stores water, one is a rigid outer layer.'],
    s: 'Read from the figure: I is a chloroplast (stacks of thylakoids), II a mitochondrion (folded inner membrane), III the large central vacuole, IV the Golgi apparatus and V the cell wall. Chloroplasts, a large central vacuole and a cell wall are absent from animal cells; mitochondria and the Golgi apparatus are found in both. The answer is II and IV only.',
  },
  {
t: 'where a newly made secreted protein is found first', d: 3, need: 'reason',
    spec: cell('animal', [['nucleus', 'I'], ['golgi', 'II'], ['rough_er', 'III'], ['mitochondrion', 'IV'], ['cell_membrane', 'V'], ['lysosome', null]]),
    alt: `Five parts are labelled I to V, one of them the cell outline; a small grey disc is drawn but not labelled. ${ALT_CELL}`,
    q: 'The cell shown makes and secretes a protein hormone. The cell is given radioactive amino acids for three minutes and then fixed at once. In which labelled structure is most of the radioactive protein found?',
    o: [['Structure III', 'correct'], ['Structure I', 'takes the nucleus to be where proteins are made'], ['Structure II', 'names the next stop of the protein and not the place where it is made'], ['Structure V', 'names the place where the protein leaves the cell']],
    calc: ['"Structure " + bio_label_of rough_er', (c) => `Structure ${labelOf(c, 'rough_er')}`],
    h: ['After only three minutes the labelled amino acids have just been built into protein; the protein has not yet travelled.', 'Secreted proteins are made on ribosomes attached to a membrane system next to the nucleus. Find it in the diagram.'],
    s: 'A secreted protein is made on the ribosomes of the rough ER, then moves in vesicles to the Golgi apparatus and finally to the cell membrane. Three minutes after the label is given, the radioactive protein is still where it was made. Read from the figure: the ribosome-studded membranes beside the nucleus, the rough ER, are labelled III.',
  },
]);

// ── AP Biology · Membrane Structure and Permeability (pack 087) ─────────────

const MEMBRANE_LABELLED = bio('membrane', {
  proteins: [{ type: 'channel', carbohydrate: true }, { type: 'carrier' }, { type: 'peripheral' }], cholesterol: true,
  labels: [{ target: 'head', label: 'I' }, { target: 'tails', label: 'II' }, { target: 'carbohydrate', label: 'III' }, { target: 'cholesterol', label: 'IV' }, { target: 'channel', label: 'V' }, { target: 'peripheral', label: 'VI' }],
});
const ALT_MEMBRANE = 'Two rows of round heads face away from each other, each head with two tails pointing to the middle; larger shapes span or sit on the rows. Leader lines join six parts to the labels I to VI.';

GA('c1c96ad6.lo-1', 'Components of the fluid mosaic model', [
  {
    t: 'name a labelled component', d: 2, need: 'read',
    spec: MEMBRANE_LABELLED,
    alt: ALT_MEMBRANE,
    q: 'What is the part labelled III in the diagram of a cell membrane shown?',
    o: [['A carbohydrate chain', 'correct'], ['A cholesterol molecule', 'confuses the two components that are not phospholipids or proteins'], ['A peripheral protein', 'takes anything on the surface of the membrane for a protein'], ['A phospholipid head', 'takes the small units of the chain for lipid heads']],
    holds: ['bio_identify of label III', [(c) => c.txt('bio_identify', { label: 'III' }) === 'carbohydrate', (c) => c.txt('bio_identify', { label: 'III' }) === 'cholesterol', (c) => c.txt('bio_identify', { label: 'III' }) === 'peripheral protein', (c) => c.txt('bio_identify', { label: 'III' }) === 'phospholipid head']],
    h: ['Look at where the part is: on which face of the membrane, and attached to what?', 'It is a short branched chain of sugar units.'],
    s: 'Read from the figure: label III points to a branched chain of small rings attached to the outer end of a membrane protein, on the side marked outside the cell. That is a carbohydrate chain (the protein that carries it is a glycoprotein).',
  },
  {
    t: 'which component a nonpolar molecule dissolves in', d: 3, need: 'reason',
    spec: bio('membrane', { proteins: [{ type: 'carrier', carbohydrate: true }, { type: 'channel' }, { type: 'peripheral' }], cholesterol: true, labels: [{ target: 'carbohydrate', label: 'I' }, { target: 'head', label: 'II' }, { target: 'channel', label: 'III' }, { target: 'tails', label: 'IV' }] }),
    alt: 'Two rows of round heads face away from each other, each head with two tails pointing to the middle; larger shapes span or sit on the rows. Leader lines join four parts to the labels I to IV.',
    q: 'Oxygen, a small nonpolar molecule, crosses the membrane shown without the help of any protein. Which labelled part of the membrane does an oxygen molecule dissolve in as it crosses?',
    o: [['Part IV', 'correct'], ['Part II', 'takes the hydrophilic heads for the part that nonpolar molecules dissolve in'], ['Part III', 'sends every solute through a protein'], ['Part I', 'takes the surface chains for the route into the cell']],
    calc: ['"Part " + bio_label_of tails', (c) => `Part ${labelOf(c, 'tails')}`],
    h: ['Nonpolar molecules dissolve in nonpolar surroundings.', 'Which part of a phospholipid is hydrophobic, and where in the bilayer is it?'],
    s: 'A small nonpolar molecule crosses by simple diffusion through the lipid itself, dissolving in the hydrophobic core of the bilayer. Read from the figure: the fatty acid tails between the two rows of heads are labelled IV. Oxygen dissolves in part IV.',
  },
  {
    t: 'sort the labelled components by class', d: 3, need: 'reason',
    spec: bio('membrane', {
      proteins: [{ type: 'channel', carbohydrate: true }, { type: 'carrier' }, { type: 'peripheral' }], cholesterol: true,
      labels: [{ target: 'head', label: 'I' }, { target: 'channel', label: 'II' }, { target: 'tails', label: 'III' }, { target: 'carbohydrate', label: 'IV' }, { target: 'peripheral', label: 'V' }, { target: 'cholesterol', label: 'VI' }],
    }),
    alt: ALT_MEMBRANE,
    q: 'Which of the labelled parts of the membrane diagram shown are proteins?',
    o: [['II and V only', 'correct'], ['II, IV and V only', 'counts the chain attached to a protein as protein'], ['II only', 'counts only the proteins that span the membrane'], ['IV and VI only', 'takes the parts that are not phospholipids for the proteins']],
    calc: ['bio_label_of channel and peripheral', (c) => `${labelOf(c, 'channel')} and ${labelOf(c, 'peripheral')} only`],
    h: ['Name each of the six labelled parts first.', 'Membrane proteins may span the bilayer or sit on one face of it; lipids and sugars are not proteins even when attached to one.'],
    s: 'Read from the figure: I is a phospholipid head, II a channel protein that spans the membrane, III the fatty acid tails, IV a carbohydrate chain, V a peripheral protein on the inner face and VI cholesterol (a lipid among the tails). The proteins are II and V only.',
  },
  {
    t: 'tell the outer face from the inner face', d: 4, need: 'reason',
    spec: bio('membrane', { proteins: [{ type: 'carrier', carbohydrate: true }, { type: 'channel', carbohydrate: true }, { type: 'peripheral' }], cholesterol: true, sideLabels: ['Side P', 'Side Q'] }),
    alt: 'Two rows of round heads face away from each other, each head with two tails pointing to the middle. Two large shapes span the rows, each with a branched chain of small rings on its upper end; a small oval sits on the lower face; short dark bars lie among the tails.',
    q: 'The diagram shows part of the plasma membrane of a cell, with its two sides marked P and Q. Which side faces the outside of the cell, and which feature of the diagram shows it?',
    o: [['Side P; the carbohydrate chains', 'correct'], ['Side Q; the carbohydrate chains', 'places the sugar chains on the cytoplasmic face'], ['Side P; the cholesterol', 'takes cholesterol to lie on one face only'], ['Side Q; the phospholipid heads', 'takes the heads to mark one face, though they are on both']],
    holds: ['spec: the carbohydrate chains stand on the outer end of their proteins, which the kind draws on the first-named side', [
      (c) => arr(c.p.proteins).some((x) => x.carbohydrate === true) && (c.p.sideLabels as string[])[0] === 'Side P',
      (c) => (c.p.sideLabels as string[])[0] === 'Side Q',
      () => false, // cholesterol lies among the tails of both layers: it marks no face
      () => false, // heads line both faces
    ]],
    h: ['Which of the components drawn is found on one face of a plasma membrane only?', 'Glycoproteins and glycolipids carry their sugar chains where cells recognise one another.'],
    s: 'Read from the figure: the branched carbohydrate chains stand on the ends of the proteins on side P only. In a plasma membrane the carbohydrate chains of glycoproteins and glycolipids always face the outside of the cell, where they serve in cell recognition; heads and cholesterol are found in both layers. Side P is the outside.',
  },
]);

// ── AP Biology · Evidence for Evolution (pack 096) ──────────────────────────

const ISLANDS = (values?: [number, number, number]): Spec => map({
  grid: { cols: 13, rows: 8 }, scale: { squares: 2, length: 100, unit: 'km' },
  regions: [
    { points: box(0, 0, 3, 8), label: 'Mainland' },
    { points: box(4.5, 3.5, 5.5, 4.5), label: 'P', ...(values ? { value: values[0] } : {}) },
    { points: box(6.5, 6.5, 7.5, 7.5), label: 'Q', ...(values ? { value: values[1] } : {}) },
    { points: box(10.5, 0.5, 11.5, 1.5), label: 'R', ...(values ? { value: values[2] } : {}) },
  ],
  ...(values ? { legend: { title: 'Endemic species' } } : {}),
  markers: [{ x: 3, y: 4, label: 'M' }],
});
const ALT_ISLANDS = 'A mainland fills the left edge of a grid, with a dot M on its coast; three small square islands, P, Q and R, lie in the sea to its east at different distances. A scale bar and a north arrow are under the map.';
const ISLAND_NAMES = ['P', 'Q', 'R'];

GA('f9ff0f1c.lo-5', 'Biogeography: isolation, dispersal and divergence', [
  {
    t: 'which island population diverges most', d: 2, need: 'reason',
    spec: ISLANDS(),
    alt: ALT_ISLANDS,
    q: 'The map shown has a mainland and three islands, P, Q and R, each colonised long ago by the same mainland lizard species. If distance over open water is the only barrier to gene flow, on which island are the lizards expected to differ most from the mainland population?',
    o: [['Island R', 'correct'], ['Island P', 'takes the population with the most gene flow to diverge most'], ['Island Q', 'judges by position north or south and not by distance'], ['All three islands equally', 'ignores the different distances']],
    calc: ['the island furthest from M (map_distance)', (c) => `Island ${[...ISLAND_NAMES].sort((x, y) => mapKm(c, 'M', y) - mapKm(c, 'M', x))[0]}`],
    h: ['Gene flow keeps populations alike; the less of it there is, the more a population can diverge.', 'Compare how far each island lies from the mainland coast.'],
    s: 'Read from the figure: island P is 2 squares from the coast, Q about 5 and R more than 8. Migrants from the mainland reach the most distant island least often, so gene flow to R is weakest and its lizards have diverged most. The answer is island R.',
  },
  {
    t: 'pattern of endemism with isolation', d: 3, need: 'reason',
    spec: ISLANDS([2, 5, 11]),
    alt: `${ALT_ISLANDS} The islands are hatched in three densities, explained by a key headed Endemic species.`,
    q: 'The map shown has a mainland and three islands; the hatching of each island gives the number of endemic species found on it. Which statement do the data on the map support?',
    o: [
      ['Endemic species increase with distance from the mainland', 'correct'],
      ['Endemic species decrease with distance from the mainland', 'reads the key in the wrong order'],
      ['Endemic species increase from south to north', 'compares positions along the north arrow and not the distances'],
      ['Endemic species are equally numerous on all the islands', 'does not read the hatching against the key'],
    ],
    holds: ['map_distance from M and the legend value of each island (spec)', [
      (c) => { const v = ISLAND_NAMES.map((n) => ({ d: mapKm(c, 'M', n), v: arr(c.p.regions).find((r) => r.label === n)!.value as number })).sort((x, y) => x.d - y.d); return v[0].v < v[1].v && v[1].v < v[2].v; },
      (c) => { const v = ISLAND_NAMES.map((n) => ({ d: mapKm(c, 'M', n), v: arr(c.p.regions).find((r) => r.label === n)!.value as number })).sort((x, y) => x.d - y.d); return v[0].v > v[1].v && v[1].v > v[2].v; },
      (c) => { const v = ISLAND_NAMES.map((n) => { const r = arr(c.p.regions).find((x) => x.label === n)!; return { y: (r.points as number[][])[0][1], v: r.value as number }; }).sort((x, y) => x.y - y.y); return v[0].v < v[1].v && v[1].v < v[2].v; },
      (c) => new Set(ISLAND_NAMES.map((n) => arr(c.p.regions).find((r) => r.label === n)!.value)).size === 1,
    ]],
    h: ['Use the key to read the number of endemic species on each island.', 'Then put the islands in order of their distance from the mainland and look for a trend.'],
    s: 'Read from the figure: P, the nearest island, has 2 endemic species; Q, further away, has 5; R, the most distant, has 11. The number of endemic species rises with distance from the mainland — the more isolated an island, the less gene flow reaches it and the more of its populations have diverged into species found nowhere else.',
  },
  {
    t: 'which islands a disperser can reach', d: 3, need: 'calc',
    spec: ISLANDS(),
    alt: ALT_ISLANDS,
    q: 'A seed-eating bird can fly at most 300 km over open water without resting. Starting from point M on the mainland coast of the map shown, which islands can it reach in a single flight? Measure to the middle of each island.',
    o: [['P and Q only', 'correct'], ['P only', 'overestimates the diagonal distance to Q'], ['P, Q and R', 'reads the scale bar as one square = 100 km'], ['Q and R only', 'compares the distances with the limit the wrong way round']],
    calc: ['islands within 300 km of M (map_distance)', (c) => `${ISLAND_NAMES.filter((n) => mapKm(c, 'M', n) <= 300).join(' and ')} only`],
    h: ['Use the scale bar to find how many kilometres one grid square stands for.', 'For an island that is not due east of M, count squares across and squares up, and use the Pythagorean theorem.'],
    s: 'Read from the figure: the scale bar spans 2 squares for 100 km, so one square is 50 km. P is 2 squares east of M: 100 km. Q is 4 squares east and 3 north: 5 squares, 250 km. R is 8 squares east and 3 south: about 8.5 squares, 427 km. Only P and Q lie within 300 km.',
  },
  {
    t: 'which population is cut off from gene flow', d: 3, need: 'reason',
    spec: map({
      grid: { cols: 12, rows: 7 }, scale: { squares: 2, length: 50, unit: 'km' },
      regions: [{ points: box(3.5, 0, 6.5, 7), label: 'Mountains' }],
      markers: [{ x: 1.5, y: 3.5, label: 'W' }, { x: 8.5, y: 5.5, label: 'X' }, { x: 8.5, y: 1.5, label: 'Y' }, { x: 11, y: 3.5, label: 'Z' }],
      arrows: [{ from: [8.5, 5], to: [8.5, 2] }, { from: [8.9, 1.8], to: [10.6, 3.2] }, { from: [10.6, 3.8], to: [8.9, 5.2] }],
    }),
    alt: 'A grid map with a broad strip named Mountains running from the top edge to the bottom edge. One dot, W, lies west of the strip; three dots, X, Y and Z, lie east of it and are joined to one another by arrows. No arrow crosses the strip. A scale bar and a north arrow are under the map.',
    q: 'The map shown has four populations of one beetle species, W, X, Y and Z, and a mountain range. Each arrow marks a route along which beetles regularly move from one population to another. Which population is most likely to become a separate species first?',
    o: [['Population W', 'correct'], ['Population X', 'takes the most northerly population to be the most isolated'], ['Population Y', 'takes the most southerly population to be the most isolated'], ['Population Z', 'takes the population furthest east to be the most isolated']],
    calc: ['the marker that no arrow starts or ends beside (spec)', (c) => { const ends = arr(c.p.arrows).flatMap((a) => [a.from as number[], a.to as number[]]); const lone = arr(c.p.markers).filter((m) => !ends.some((e) => Math.hypot(e[0] - (m.x as number), e[1] - (m.y as number)) < 0.8)); if (lone.length !== 1) throw new Error('not exactly one isolated population'); return `Population ${lone[0].label}`; }],
    h: ['Speciation needs reproductive isolation: a group whose gene pool no longer mixes with the others.', 'See which populations the arrows connect, and what lies between the remaining one and the rest.'],
    s: 'Read from the figure: arrows join X, Y and Z to one another, so genes keep flowing among those three. No arrow reaches W, which lies on the other side of the mountain range. With no gene flow, W can accumulate its own genetic changes and is the most likely to become a separate species (allopatric speciation).',
  },
]);

// ── Physics · Magnetic Fields and Right-Hand Rule (pack 228) ────────────────

const DIR_OPTION: Record<string, string> = { left: 'To the left', right: 'To the right', up: 'Toward the top of the page', down: 'Toward the bottom of the page' };

GA('73571e58.lo-2', 'Field direction round a bar magnet', [
  {
    t: 'direction of a compass needle beside the magnet', d: 2, need: 'reason',
    spec: magnet([{ north: 'right' }], { arrows: false, compasses: [{ x: 0, y: 1.45, label: '1', needle: false }] }),
    alt: 'A horizontal bar magnet with its two halves marked with pole letters. Curved field lines without arrowheads loop from one end of the magnet to the other. An empty compass, labelled 1, sits above the middle of the magnet.',
    q: 'A compass is placed at position 1 above the bar magnet in the diagram shown. In which direction does the north-seeking end of its needle point?',
    o: [['To the left', 'correct'], ['To the right', 'takes the field outside the magnet to run from the south pole to the north pole'], ['Toward the top of the page', 'takes the field to point straight away from the magnet everywhere'], ['Toward the bottom of the page', 'takes the needle to point straight at the magnet']],
    calc: ['magnet_compass_direction of compass 1, worded as an option', (c) => DIR_OPTION[needle(c, '1')]],
    h: ['Outside a magnet the field runs from its north pole round to its south pole.', 'A compass needle lines up with the field: its north-seeking end points the way the field points.'],
    s: 'Read from the figure: the north pole is the right-hand half of the magnet and the south pole the left-hand half. Outside the magnet the field leaves the north pole and loops round to the south pole, so above the middle of the magnet it runs from right to left. The north-seeking end of the needle points to the left.',
  },
  {
    t: 'find the north pole from compass needles', d: 3, need: 'reason',
    spec: magnet([{ north: 'left', poles: 'blank' }], { arrows: false, compasses: [{ x: 0, y: 1.45, label: '1' }, { x: -2.45, y: 0, label: '2' }] }),
    alt: 'A horizontal bar magnet whose pole letters are hidden. Curved field lines without arrowheads loop from one end of the magnet to the other. Two compasses with needles are drawn: 1 above the middle of the magnet and 2 beyond its left-hand end.',
    q: 'The pole letters of the bar magnet in the diagram shown are hidden. The dark end of each compass needle is its north-seeking end. Which end of the magnet is its north pole?',
    o: [['The left-hand end', 'correct'], ['The right-hand end', 'takes a needle\'s north-seeking end to point toward a north pole'], ['Neither end; the poles are on the long sides', 'takes the needle above the magnet to point at a pole'], ['It cannot be decided from two needles', 'does not use the rule that a needle follows the field']],
    calc: ['"The " + magnet_north_end + "-hand end"', (c) => `The ${c.txt('magnet_north_end')}-hand end`],
    h: ['The north-seeking end of a needle points along the field, and the field outside a magnet runs away from its north pole.', 'Look at compass 2: is its dark end pointing toward the magnet or away from it?'],
    s: 'Read from the figure: the dark end of compass 2, beyond the left-hand end, points away from the magnet, and the dark end of compass 1, above the middle, points to the right. The field therefore leaves the left-hand end and runs over the top toward the right-hand end. Field lines leave a north pole, so the left-hand end is the north pole.',
  },
  {
    t: 'compare the field direction at three points', d: 3, need: 'reason',
    spec: magnet([{ north: 'left' }], { arrows: false, points: [{ x: 2.5, y: 0, label: 'P' }, { x: -2.5, y: 0, label: 'Q' }, { x: 0, y: 1.45, label: 'R' }] }),
    alt: 'A horizontal bar magnet with its two halves marked with pole letters. Curved field lines without arrowheads loop from one end of the magnet to the other. Three dots are marked: P beyond the right-hand end, Q beyond the left-hand end, both on the line of the magnet, and R above its middle.',
    q: 'Three points, P, Q and R, are marked near the bar magnet in the diagram shown. At which two of them does the magnetic field point in the same direction?',
    o: [['P and Q', 'correct'], ['P and R', 'takes the field to point away from the north pole at every point'], ['Q and R', 'takes the field beyond the north pole to point back toward the magnet'], ['At all three points', 'takes the field to have one direction everywhere outside the magnet']],
    holds: ['magnet_field_direction at P, Q and R', [
      (c) => bAt(c, 'P') === bAt(c, 'Q') && bAt(c, 'P') !== bAt(c, 'R'),
      (c) => bAt(c, 'P') === bAt(c, 'R') && bAt(c, 'P') !== bAt(c, 'Q'),
      (c) => bAt(c, 'Q') === bAt(c, 'R') && bAt(c, 'P') !== bAt(c, 'Q'),
      (c) => bAt(c, 'P') === bAt(c, 'Q') && bAt(c, 'P') === bAt(c, 'R'),
    ]],
    h: ['Field lines leave the north pole, loop round the outside of the magnet and enter the south pole.', 'Work out the direction at each point separately: beyond the north pole, beyond the south pole, and beside the magnet.'],
    s: 'Read from the figure: the north pole is the left-hand half. At Q, beyond the north pole, the field points away from the magnet: to the left. At P, beyond the south pole, the field points toward the magnet: also to the left. At R, above the middle, the field runs from the north pole round to the south pole: to the right. The field has the same direction at P and Q.',
  },
  {
    t: 'hidden poles of a second magnet from the field pattern', d: 4, need: 'reason',
    spec: magnet([{ north: 'left' }, { north: 'right', poles: 'blank' }], { arrows: false }),
    alt: 'Two bar magnets end to end with a gap between them. The halves of the left-hand magnet are marked with pole letters; the pole letters of the right-hand magnet are hidden. Curved field lines without arrowheads are drawn round both magnets and in the gap.',
    q: 'The diagram shows the field lines round two bar magnets; the pole letters of the right-hand magnet are hidden. Which pole of the right-hand magnet faces the gap, and do the two magnets attract or repel each other?',
    o: [['A south pole; they repel', 'correct'], ['A north pole; they attract', 'reads the lines in the gap as joining the two magnets'], ['A north pole; they repel', 'reads the pattern correctly but takes unlike poles to repel'], ['A south pole; they attract', 'names the pole correctly but takes like poles to attract']],
    calc: ['magnet_interaction, and the pole of the left-hand magnet that faces the gap (spec): like poles repel', (c) => { const how = c.txt('magnet_interaction'); const facing = arr(c.p.magnets)[0].north === 'right' ? 'north' : 'south'; const other = how === 'repel' ? facing : facing === 'north' ? 'south' : 'north'; return `A ${other} pole; they ${how}`; }],
    h: ['Look at the lines in the gap: do they run straight across from one magnet to the other, or do the lines from the two facing ends bend away from each other?', 'Field lines run from a north pole to a south pole, so lines can join two facing poles only when the poles are unlike.'],
    s: 'Read from the figure: the right-hand end of the left-hand magnet, which faces the gap, is its south pole. In the gap the lines from the two facing ends bend away from each other and none runs across from one magnet to the other. Lines would join a south pole to a north pole, so the facing pole of the right-hand magnet must also be a south pole. Like poles repel.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PART B — harder items where only read-offs existed; batch-3 kinds on ordinary objectives
// ════════════════════════════════════════════════════════════════════════════

// ── helpers for the proofs of Part B ────────────────────────────────────────

interface Piece { f: (x: number) => number; a: number; b: number }
/** The drawn pieces of a function graph, each compiled from ITS OWN expression in the spec. */
const pieces = (c: Ctx): Piece[] => arr(c.p.curves).map((k) => { const d = (k.domain as number[] | undefined) ?? (c.p.xRange as number[]); return { f: compileExpression(k.expr), a: d[0], b: d[1] }; });
/** Where the drawn function fails to be differentiable strictly inside (lo, hi): jumps, corners and vertical tangents, looked for on the half-unit lattice. */
function nonDiff(c: Ctx, lo: number, hi: number): Array<{ x: number; kind: 'jump' | 'corner' | 'vertical' }> {
  const ps = pieces(c);
  const out: Array<{ x: number; kind: 'jump' | 'corner' | 'vertical' }> = [];
  const h = 1e-6;
  for (let x = lo + 0.5; x < hi - 1e-9; x += 0.5) {
    const left = ps.find((p) => p.a < x - 1e-9 && x <= p.b + 1e-9);
    const right = ps.find((p) => p.a <= x + 1e-9 && x < p.b - 1e-9);
    if (!left || !right) continue;
    const [yl, yr] = [left.f(x), right.f(x)];
    if (Math.abs(yl - yr) > 1e-6) { out.push({ x, kind: 'jump' }); continue; }
    const sl = (yl - left.f(x - h)) / h;
    const sr = (right.f(x + h) - yr) / h;
    if (Math.abs(sl) > 100 && Math.abs(sr) > 100) out.push({ x, kind: 'vertical' });
    else if (Math.abs(sl - sr) > 1e-3) out.push({ x, kind: 'corner' });
  }
  return out;
}
const kindAt = (c: Ctx, x: number): string => nonDiff(c, (c.p.xRange as number[])[0], (c.p.xRange as number[])[1]).find((k) => near(k.x, x))?.kind ?? 'smooth';
/** The sign chart's first row: where the sign changes, and how. */
function signChanges(c: Ctx): Array<{ x: number; from: string; to: string }> {
  const row = arr(c.p.rows)[0];
  const sg = row.signs as string[];
  return (c.p.critical as number[]).map((x, i) => ({ x, from: sg[i], to: sg[i + 1] }));
}
/** The same circuit with one named component replaced by something else. */
function swapped(spec: Spec, name: string, by: P, what: string): { spec: Spec; what: string } {
  const swap = (n: P): P => {
    if (Array.isArray(n.series)) return { series: (n.series as P[]).map(swap) };
    if (Array.isArray(n.parallel)) return { parallel: (n.parallel as P[]).map(swap) };
    return n.name === name ? by : n;
  };
  return { spec: S(spec.type, { ...spec.params, circuit: swap(spec.params.circuit as P) }), what };
}
const BLUE = '#1d4ed8';
/** Area of curve i beyond the first dashed vertical line, and the x at which curve i is highest. */
const tailOf = (c: Ctx, i: number): number => integrate(pieces(c)[i].f, arr(c.p.asymptotes)[0].x as number, 40);
const peakOf = (c: Ctx, i: number): number => { const f = pieces(c)[i].f; let best = 0; for (let x = 0; x <= 12; x += 0.01) if (f(x) > f(best)) best = x; return round(best, 2); };
const vec = (c: Ctx, label: string): [number, number] => { const v = arr(c.p.vectors).find((x) => x.label === label)!; if (v.components) return v.components as [number, number]; const [t, hd] = [v.tail as number[], v.head as number[]]; return [hd[0] - t[0], hd[1] - t[1]]; };

// ── AP Calculus AB ──────────────────────────────────────────────────────────

GB('5fec1ce2.lo-3', 'Classifying extrema from a sign chart of f′', [{
  t: 'count the maxima and the minima', d: 3, need: 'reason',
  spec: signs('f′(x)', [-3, 0, 2, 5], ['-', '+', '+', '-', '+']),
  alt: 'A number line with four marked values at which the derivative is zero, and a plus or a minus sign over each of the five intervals they cut the line into.',
  q: 'The sign chart shown gives the sign of f′(x) for a function f that is differentiable for all x. How many local maxima and how many local minima does f have?',
  o: [['1 local maximum and 2 local minima', 'correct'], ['2 local maxima and 2 local minima', 'counts every zero of f′ as an extremum'], ['2 local maxima and 1 local minimum', 'reads a change from − to + as a maximum'], ['1 local maximum and 1 local minimum', 'stops after the first two sign changes']],
  calc: ['sign changes of the chart row (spec): + to − is a maximum, − to + a minimum', (c) => { const ch = signChanges(c); const mx = ch.filter((k) => k.from === '+' && k.to === '-').length; const mn = ch.filter((k) => k.from === '-' && k.to === '+').length; return `${mx} local maxim${mx === 1 ? 'um' : 'a'} and ${mn} local minim${mn === 1 ? 'um' : 'a'}`; }],
  h: ['f has a local extremum only where f′ changes sign.', 'A change from + to − is a local maximum; a change from − to + is a local minimum; no change, no extremum.'],
  s: 'Read from the figure: f′ changes from − to + at x = −3 (a local minimum), does not change sign at x = 0 (no extremum), changes from + to − at x = 2 (a local maximum) and from − to + at x = 5 (a local minimum). So f has 1 local maximum and 2 local minima.',
}]);

GB('5fec1ce2.lo-4', 'First derivative test where f′ does not exist', [{
  t: 'local minimum at a point where the derivative is undefined', d: 3, need: 'reason',
  spec: signs('f′(x)', [-2, 1, 4], ['+', '-', '+', '-'], ['0', 'und', '0']), hide: [1],
  alt: 'A number line with three marked values and a plus or a minus sign over each of the four intervals they cut the line into. Under two of the marked values the derivative is shown as zero; under the middle one it is shown as undefined.',
  q: 'The sign chart shown gives the sign of f′(x) for a function f that is continuous for all x; at the value marked und, f′ does not exist. At what value of x does f have a local minimum?',
  n: '1',
  calc: ['the critical value where the sign of f′ changes from − to + (spec)', (c) => { const mn = signChanges(c).filter((k) => k.from === '-' && k.to === '+'); if (mn.length !== 1) throw new Error('not exactly one minimum'); return mn[0].x; }],
  h: ['The first derivative test needs f to be continuous at the point and f′ to change sign there; f′ itself need not exist at the point.', 'Look for the marked value where f′ goes from negative to positive.'],
  s: 'Read from the figure: f′ changes from + to − at x = −2 and at x = 4 (local maxima) and from − to + at x = 1. Because f is continuous at x = 1, f falls on the left of it and rises on the right, so f has a local minimum there even though f′(1) does not exist (a corner or a cusp). The answer is x = 1.',
}]);

GB('7120b2e6.lo-1', 'Corners: one-sided derivatives', [{
  t: 'left-hand derivative at a corner', d: 3, need: 'calc',
  spec: fgraph({ xRange: [-3, 7], yRange: [-4, 5], curves: [{ expr: '2x + 1', domain: [-2, 1], color: BLUE }, { expr: '4 - x', domain: [1, 6], color: BLUE }] }),
  alt: 'A graph made of two straight segments that meet at a point above the x-axis: the left segment rises steeply to the meeting point and the right segment falls from it more gently.',
  q: 'The graph of f shown has a corner at x = 1. What is the value of the limit of [f(1 + h) − f(1)] / h as h approaches 0 from the left?',
  n: '2', ck: ['curve_slope', { curve: 0, x1: 0, x2: 1 }],
  h: ['With h negative, the points 1 + h lie to the left of x = 1, so the quotient is the slope of the graph just to the left of the corner.', 'Read two grid points on the left-hand segment and compute rise over run.'],
  s: 'For h < 0 the quotient is the slope of the left-hand segment. Read from the figure: that segment passes through (0, 1) and (1, 3), so its slope is (3 − 1) / (1 − 0) = 2. The left-hand limit is 2 (the right-hand limit is −1, which is why f′(1) does not exist).',
}]);

GB('7120b2e6.lo-2', 'Vertical tangents and corners', [{
  t: 'tell a vertical tangent from a corner on one graph', d: 3, need: 'reason',
  spec: fgraph({ xRange: [-6, 6], yRange: [-1, 6], curves: [{ expr: 'abs(x + 2)/2 + 1/2', domain: [-5, 1], color: BLUE }, { expr: '3 - sqrt(2 - x)', domain: [1, 2], color: BLUE }, { expr: '3 + sqrt(x - 2)', domain: [2, 3], color: BLUE }, { expr: 'x/2 + 5/2', domain: [3, 5], color: BLUE }] }),
  alt: 'One continuous curve on a grid. On the left it is a shallow V; further right it climbs, steepens until it is upright for an instant, and then eases into a gentle straight climb.',
  q: 'The graph of a continuous function f is shown. At which values of x is f not differentiable, and which feature of the graph is the cause at each?',
  o: [
    ['x = −2 (corner) and x = 2 (vertical tangent)', 'correct'],
    ['x = −2 (vertical tangent) and x = 2 (corner)', 'exchanges the names of the two features'],
    ['x = −2 only (corner)', 'takes a graph with no break in direction to be differentiable, however steep'],
    ['x = 2 only (vertical tangent)', 'takes a function to be differentiable wherever it is continuous and not vertical'],
  ],
  holds: ['one-sided difference quotients of the spec\'s own expressions at every half unit (corner: unequal finite slopes; vertical tangent: both unbounded)', [
    (c) => { const k = nonDiff(c, -5, 5); return k.length === 2 && kindAt(c, -2) === 'corner' && kindAt(c, 2) === 'vertical'; },
    (c) => kindAt(c, -2) === 'vertical' && kindAt(c, 2) === 'corner',
    (c) => { const k = nonDiff(c, -5, 5); return k.length === 1 && kindAt(c, -2) === 'corner'; },
    (c) => { const k = nonDiff(c, -5, 5); return k.length === 1 && kindAt(c, 2) === 'vertical'; },
  ]],
  h: ['Look for places where the direction of the graph changes abruptly, and for places where the graph becomes upright.', 'At a corner the slopes from the two sides are different numbers; at a vertical tangent the slope grows without bound.'],
  s: 'Read from the figure: at x = −2 the graph turns abruptly from a slope of −1/2 to a slope of +1/2 — a corner, so the one-sided derivatives disagree. At x = 2 the curve is smooth but stands upright: the tangent line is vertical and the slope is unbounded. Everywhere else the graph is smooth and not vertical. So f is not differentiable at x = −2 (corner) and at x = 2 (vertical tangent).',
}]);

GB('7120b2e6.lo-3', 'Discontinuities and differentiability', [{
  t: 'count the points lost to discontinuity, not to corners', d: 3, need: 'reason',
  spec: fgraph({ xRange: [-5, 5], yRange: [-3, 5], curves: [{ expr: 'x + 4', domain: [-5, -2], to: 'closed', color: BLUE }, { expr: 'x', domain: [-2, 1], from: 'open', to: 'closed', color: BLUE }, { expr: 'abs(x - 3) + 2', domain: [1, 5], from: 'open', color: BLUE }] }),
  alt: 'A graph in three separate parts: a rising segment on the left ending in a filled dot, a second rising segment that starts lower at an open circle and ends in a filled dot, and a V-shaped part that starts higher at an open circle.',
  q: 'The graph of a function f is shown for −5 ≤ x ≤ 5. At how many values of x in the open interval (−5, 5) does f fail to be differentiable because it is not continuous there?',
  n: '2',
  calc: ['jumps among the non-differentiable points of the spec\'s own expressions', (c) => nonDiff(c, -5, 5).filter((k) => k.kind === 'jump').length],
  h: ['A function cannot be differentiable where it is not continuous — but it can also fail to be differentiable where it is continuous.', 'Count only the breaks in the graph; a change of direction with no break is a different kind of failure.'],
  s: 'Read from the figure: the graph breaks at x = −2 (it jumps from 2 down to −2) and at x = 1 (it jumps from 1 up to 4), so f is not continuous, and therefore not differentiable, at those two values. At x = 3 the graph has a corner: f is continuous there, so that failure is not due to a discontinuity. The answer is 2.',
}]);

GB('7120b2e6.lo-4', 'Differentiability on an interval', [{
  t: 'choose the interval free of every kind of failure', d: 3, need: 'reason',
  spec: fgraph({ xRange: [-5, 5], yRange: [-3, 4], curves: [{ expr: '(x + 3)^2 - 2', domain: [-5, -1], color: BLUE }, { expr: '2', domain: [-1, 2], to: 'closed', color: BLUE }, { expr: 'x - 3', domain: [2, 5], from: 'open', color: BLUE }] }),
  alt: 'A graph in two separate parts. The first is a U-shaped curve that runs into a level segment ending in a filled dot; the second is a rising segment that starts lower, at an open circle.',
  q: 'The graph of a function f is shown for −5 ≤ x ≤ 5. On which of these open intervals is f differentiable at every point?',
  o: [['(−5, −2)', 'correct'], ['(−2, 1)', 'overlooks the corner where the curve meets the level segment'], ['(1, 4)', 'overlooks the jump'], ['(−5, 5)', 'takes a function drawn without gaps in x to be differentiable throughout']],
  holds: ['no jump, corner or vertical tangent of the spec\'s own expressions strictly inside the interval', [
    (c) => nonDiff(c, -5, -2).length === 0,
    (c) => nonDiff(c, -2, 1).length === 0,
    (c) => nonDiff(c, 1, 4).length === 0,
    (c) => nonDiff(c, -5, 5).length === 0,
  ]],
  h: ['Find every x at which the graph has a break or an abrupt change of direction.', 'An interval qualifies only if none of those x-values lies inside it.'],
  s: 'Read from the figure: the curve meets the level segment at x = −1 with an abrupt change of slope (a corner), and the graph jumps at x = 2. Those are the only two values where f is not differentiable. The interval (−5, −2) contains neither; (−2, 1) contains −1, (1, 4) contains 2 and (−5, 5) contains both.',
}]);

GB('9e26ac42.lo-2', 'Instantaneous against average rate of change', [{
  t: 'match an instantaneous rate to an average rate', d: 3, need: 'calc',
  spec: fgraph({ xRange: [-5, 5], yRange: [-3, 5], curves: [{ expr: '4 - x^2/4' }], points: [{ x: -4, y: 0, label: 'P' }, { x: -2, y: 3, label: 'Q' }, { x: 0, y: 4, label: 'R' }, { x: 2, y: 3, label: 'S' }] }),
  alt: 'A smooth arch-shaped curve on a grid with four marked points on it: P on the x-axis at the left, Q part of the way up, R at the top of the arch and S on the way down on the right.',
  q: 'Four points are marked on the graph of f shown. At which marked point does the instantaneous rate of change of f equal the average rate of change of f between P and R?',
  o: [['Point Q', 'correct'], ['Point P', 'takes the rate at the start of the interval'], ['Point R', 'takes the rate at the end of the interval'], ['Point S', 'matches the size of the slope and ignores its sign']],
  calc: ['points_slope(P, R) against the derivative of the spec\'s expression at each marked point', (c) => { const avg = c.num('points_slope', { p1: 'P', p2: 'R' }); const f = pieces(c)[0].f; const hit = arr(c.p.points).filter((p) => near((f((p.x as number) + 1e-6) - f((p.x as number) - 1e-6)) / 2e-6, avg, 1e-5)); if (hit.length !== 1) throw new Error('not exactly one point'); return `Point ${hit[0].label}`; }],
  h: ['The average rate of change between P and R is the slope of the line through P and R.', 'Look for the marked point where the tangent to the curve is parallel to that line.'],
  s: 'Read from the figure: P is (−4, 0) and R is (0, 4), so the average rate of change between them is (4 − 0) / (0 − (−4)) = 1. The tangent at P is steeper than that (slope 2), the tangent at R is horizontal (slope 0) and at S the curve is falling (slope −1). At Q the tangent has slope 1, parallel to the line PR. The answer is point Q.',
}]);

GB('ab0207fe.lo-1', 'Cross-sections on a base region', [{
  t: 'area of a non-square cross-section', d: 3, need: 'calc',
  spec: region({ xRange: [-1, 6], yRange: [-1, 6] }, { type: 'between_curves', upper: { expr: '5 - x/2' }, lower: { expr: 'x/2 + 1' }, from: 0, to: 4 }),
  alt: 'A shaded region on a grid between a falling straight line above and a rising straight line below; the two lines meet at the right-hand end of the region, and the region is widest at the y-axis.',
  q: 'The shaded region shown is the base of a solid. Each cross-section of the solid perpendicular to the x-axis is a rectangle whose base lies across the region and whose height is twice its base. What is the area of the cross-section at x = 2?',
  n: '8',
  calc: ['2 × (upper − lower)² at x = 2, from the spec\'s own expressions', (c) => { const r = c.p.region as P; const s = compileExpression((r.upper as P).expr)(2) - compileExpression((r.lower as P).expr)(2); return 2 * s * s; }],
  h: ['The base of the cross-section at x = 2 is the vertical distance across the shaded region there.', 'A rectangle with base s and height 2s has area 2s².'],
  s: 'Read from the figure: at x = 2 the upper boundary is at y = 4 and the lower boundary at y = 2, so the base of the cross-section is 4 − 2 = 2. Its height is twice that, 4, so its area is 2 × 4 = 8.',
}]);

GB('ab0207fe.lo-2', 'Volume with square cross-sections', [{
  t: 'volume from a base read off the graph', d: 3, need: 'calc',
  spec: region({ xRange: [-1, 5], yRange: [-1, 5] }, { type: 'between_curves', upper: { expr: '3' }, lower: { expr: 'x' }, from: 0, to: 3 }),
  alt: 'A shaded triangular region on a grid, bounded by the y-axis on the left, a level line above and a rising straight line through the origin below; the two lines meet at the right-hand corner of the region.',
  q: 'The shaded region shown is the base of a solid. Every cross-section of the solid perpendicular to the x-axis is a square with one side lying across the base. What is the volume of the solid?',
  n: '9',
  calc: ['∫ (upper − lower)² dx over the region, from the spec\'s own expressions (Simpson)', (c) => { const r = c.p.region as P; const [u, l] = [compileExpression((r.upper as P).expr), compileExpression((r.lower as P).expr)]; return round(integrate((x) => (u(x) - l(x)) ** 2, r.from as number, r.to as number), 6); }],
  h: ['Write the side of the square at position x as the top boundary minus the bottom boundary, using the equations of the two lines you read from the graph.', 'The volume is the integral of the cross-sectional area, side squared, over the x-values the region covers.'],
  s: 'Read from the figure: the region runs from x = 0 to x = 3, between the line y = x below and the line y = 3 above. The side of the square at x is 3 − x, so its area is (3 − x)². The volume is the integral of (3 − x)² from 0 to 3, which is [−(3 − x)³ / 3] from 0 to 3 = 0 + 27/3 = 9.',
}]);

GB('ba15a88f.lo-1', 'A limit that differs from the function value', [{
  t: 'limit against the value at a removable discontinuity', d: 3, need: 'reason',
  spec: fgraph({ xRange: [-2, 6], yRange: [-1, 7], curves: [{ expr: 'x + 1', domain: [-2, 2], to: 'open', color: BLUE }, { expr: 'x + 1', domain: [2, 5], from: 'open', color: BLUE }], points: [{ x: 2, y: 1 }] }),
  alt: 'A rising straight line on a grid with one open circle on it, and a single filled dot directly below the open circle.',
  q: 'The graph of a function f is shown; the open circle is a point missing from the line and the filled dot directly below it gives the value of f at that x. Let L be the limit of f(x) as x approaches 2. What is L − f(2)?',
  n: '2',
  calc: ['the height the line approaches at x = 2 (spec expression) minus the y of the filled dot', (c) => pieces(c)[0].f(2) - (arr(c.p.points)[0].y as number)],
  h: ['A limit describes the heights the graph approaches from both sides; it ignores what happens exactly at x = 2.', 'f(2) is the height of the filled dot.'],
  s: 'Read from the figure: as x approaches 2 from either side, the line approaches the open circle at height 3, so L = 3. The filled dot at x = 2 is at height 1, so f(2) = 1. L − f(2) = 3 − 1 = 2.',
}]);

// c898192b.lo-1 (slope fields): no harder item — figure-core refuses slope_field for now (segments on the plot border are cut off), so nothing new is drawn on that kind.

GB('d1d61003.lo-2', 'The sign of f″ and the behaviour of f′', [{
  t: 'where f′ is increasing, from the sign of f″', d: 3, need: 'reason',
  spec: signs('f″(x)', [-2, 3], ['-', '+', '-']), hide: [-2, 3],
  alt: 'A number line with two marked values at which the second derivative is zero, and a plus or a minus sign over each of the three intervals they cut the line into.',
  q: 'The sign chart shown gives the sign of f″(x) for a function f that is twice differentiable for all x. On which interval is f′, the first derivative of f, increasing?',
  o: [['(−2, 3)', 'correct'], ['(−∞, −2)', 'takes f′ to increase where f″ is negative'], ['(3, ∞)', 'reads the right-hand interval of the chart'], ['(−∞, 3)', 'takes everything to the left of the last marked value']],
  calc: ['the interval over which the chart row is + (spec)', (c) => { const sg = arr(c.p.rows)[0].signs as string[]; const cr = c.p.critical as number[]; const i = sg.indexOf('+'); if (sg.filter((x) => x === '+').length !== 1) throw new Error('not one + interval'); const e = (v: number | undefined, inf: string): string => (v === undefined ? inf : String(v).replace('-', '−')); return `(${e(cr[i - 1], '−∞')}, ${e(cr[i], '∞')})`; }],
  h: ['f″ is the derivative of f′.', 'A function increases where its derivative is positive.'],
  s: 'f″ is the derivative of f′, so f′ is increasing exactly where f″ is positive (the same intervals on which the graph of f is concave up). Read from the figure: f″ is positive only between the two marked values, on (−2, 3).',
}]);

GB('d1d61003.lo-4', 'Counting inflection points', [{
  t: 'count inflection points when some zeros of f″ are not sign changes', d: 3, need: 'reason',
  spec: signs('f″(x)', [-4, -1, 1, 4, 6], ['+', '-', '-', '+', '+', '-']),
  alt: 'A number line with five marked values at which the second derivative is zero, and a plus or a minus sign over each of the six intervals they cut the line into.',
  q: 'The sign chart shown gives the sign of f″(x) for a function f that is twice differentiable for all x. How many inflection points does the graph of f have?',
  n: '3',
  calc: ['marked values at which the sign of the chart row changes (spec)', (c) => signChanges(c).filter((k) => k.from !== k.to).length],
  h: ['An inflection point needs the concavity to change, so f″ must change sign there.', 'Check each marked value in turn: is the sign on its left different from the sign on its right?'],
  s: 'Read from the figure: f″ changes from + to − at x = −4, stays negative through x = −1, changes from − to + at x = 1, stays positive through x = 4 and changes from + to − at x = 6. The concavity changes at three of the five marked values, so the graph has 3 inflection points.',
}]);

GB('d3878367.lo-3', 'Area between curves read from a graph', [{
  t: 'area between a level line and a V-shaped graph', d: 3, need: 'calc',
  spec: region({ xRange: [-2, 6], yRange: [-1, 6] }, { type: 'between_curves', upper: { expr: '4' }, lower: { expr: 'abs(x - 2) + 1' }, from: -1, to: 5 }),
  alt: 'A shaded region on a grid between a level line above and a V-shaped graph below; the V meets the level line at both ends of the region and has its lowest point half-way between them.',
  q: 'What is the area of the shaded region shown, in square units?',
  n: '9',
  calc: ['∫ (upper − lower) dx over the region, from the spec\'s own expressions (Simpson on each straight part)', (c) => { const r = c.p.region as P; const [u, l] = [compileExpression((r.upper as P).expr), compileExpression((r.lower as P).expr)]; return round(integrate((x) => u(x) - l(x), r.from as number, 2) + integrate((x) => u(x) - l(x), 2, r.to as number), 6); }],
  h: ['Read where the two boundaries meet, and the lowest point of the lower boundary.', 'Either integrate top minus bottom over each straight part of the lower boundary, or notice what shape the region is.'],
  s: 'Read from the figure: the upper boundary is y = 4; the lower boundary is a V with its lowest point at (2, 1), meeting the line y = 4 at x = −1 and x = 5. The region is a triangle with base 5 − (−1) = 6 along y = 4 and height 4 − 1 = 3, so its area is (1/2)(6)(3) = 9. Integrating 4 − (|x − 2| + 1) from −1 to 5 gives the same value.',
}]);

GB('e7957044.lo-3', 'Two horizontal asymptotes', [{
  t: 'difference of the limits at +∞ and −∞', d: 3, need: 'calc',
  spec: fgraph({ xRange: [-6, 6], yRange: [-3, 5], curves: [{ expr: '3 - 4/(1 + exp(x))' }], asymptotes: [{ y: 3 }, { y: -1 }] }),
  alt: 'An S-shaped curve on a grid that rises from left to right between two dashed horizontal lines, flattening against the lower one on the far left and against the upper one on the far right.',
  q: 'The graph of a function f is shown together with its two horizontal asymptotes (the dashed lines). What is the value of the limit of f(x) as x → ∞ minus the limit of f(x) as x → −∞?',
  n: '4',
  calc: ['the spec expression far to the right minus far to the left, checked against the two drawn asymptotes', (c) => { const f = pieces(c)[0].f; const [hi, lo] = [f(60), f(-60)]; const ys = arr(c.p.asymptotes).map((a) => a.y as number); if (!ys.some((y) => near(y, hi)) || !ys.some((y) => near(y, lo))) throw new Error('asymptotes do not match'); return round(hi - lo, 6); }],
  h: ['A horizontal asymptote y = b at the right-hand end means that the limit as x → ∞ is b.', 'This graph approaches a different dashed line at each end; read the height of each.'],
  s: 'Read from the figure: far to the right the curve flattens against the dashed line y = 3, so the limit as x → ∞ is 3; far to the left it flattens against the dashed line y = −1, so the limit as x → −∞ is −1. The difference is 3 − (−1) = 4.',
}]);

// ── Physics ─────────────────────────────────────────────────────────────────

GB('0938830f.lo-5', 'Emission lines and electron transitions', [{
  t: 'match a spectral line to its transition', d: 3, need: 'reason',
  spec: lines([['Hydrogen', [410, 434, 486, 656]]]),
  alt: 'One horizontal strip marked with a wavelength scale in nanometres; four thin vertical lines stand at different wavelengths, three of them toward the short-wavelength end.',
  q: 'The strip shown is the visible emission spectrum of hydrogen. Every line is produced by an electron falling to the level n = 2, and the line of longest wavelength comes from the level n = 3. From which level n does the electron fall to produce the line of shortest wavelength shown?',
  n: '6',
  calc: ['2 + the number of lines on the strip (spec): each further line comes from the next level up', (c) => 2 + ((arr(c.p.rows)[0].lines as number[]).length)],
  h: ['A shorter wavelength means a photon of greater energy, so a larger drop in energy for the electron.', 'Count the lines in order from the longest wavelength: each one comes from the next higher starting level.'],
  s: 'Read from the figure: the strip has four lines. A shorter wavelength is a larger photon energy, so a fall from a higher level. In order of decreasing wavelength the lines come from n = 3, 4, 5 and 6. The line of shortest wavelength, at about 410 nm, comes from n = 6.',
}]);

GB('111ba11a.lo-1', 'Forces on an incline: checking a diagram', [{
  t: 'find the force drawn in the wrong direction', d: 4, need: 'reason',
  spec: fbd([F('N', 'normal'), F('f', 'down-slope'), F('W', 'down')], { incline: { angle: 35 }, lengths: 'equal' }),
  alt: 'A block on an incline with three force arrows of equal length: one perpendicular to the slope and away from it, one straight down, and one along the slope toward its lower end.',
  q: 'A student drew the free-body diagram shown for a block that is sliding DOWN a rough incline; f is the kinetic friction force. Which force, if any, is drawn in the wrong direction?',
  o: [['The friction force f', 'correct'], ['The normal force N', 'expects the normal force to point straight up'], ['The weight W', 'expects the weight to point into the slope'], ['No force is drawn in the wrong direction', 'takes friction to act in the direction of motion']],
  holds: ['spec directions: kinetic friction must oppose the motion (down-slope), the normal force is perpendicular to the surface, the weight is straight down', [
    (c) => arr(c.p.forces).find((x) => x.label === 'f')!.direction === 'down-slope',
    (c) => arr(c.p.forces).find((x) => x.label === 'N')!.direction !== 'normal',
    (c) => arr(c.p.forces).find((x) => x.label === 'W')!.direction !== 'down',
    (c) => arr(c.p.forces).find((x) => x.label === 'f')!.direction === 'up-slope',
  ]],
  h: ['Check each force against its rule: weight acts toward the centre of the Earth, the normal force acts perpendicular to the surface.', 'Kinetic friction acts along the surface, opposite to the direction in which the block slides.'],
  s: 'Read from the figure: N is perpendicular to the incline and W points straight down, both correct. The arrow f points down the slope, the direction in which the block is sliding. Kinetic friction opposes the sliding, so it must point up the slope. The friction force f is drawn in the wrong direction.',
}]);

GB('111ba11a.lo-2', 'Weight components and equilibrium on an incline', [{
  t: 'friction that holds a block at rest', d: 3, need: 'calc',
  spec: fbd([F('N', 'normal'), F('f', 'up-slope'), F('W', 'down', 80)], { incline: { angle: 30 }, lengths: 'equal' }),
  alt: 'A block on an incline with three force arrows of equal length: N perpendicular to the slope, f along the slope toward its upper end, and W straight down with its size printed. The angle of the incline is marked.',
  q: 'The free-body diagram shows a block at rest on a rough incline. What is the size of the friction force f, in newtons?',
  n: '40',
  calc: ['W sin θ from the spec (the block is in equilibrium along the slope)', (c) => round((arr(c.p.forces).find((x) => x.label === 'W')!.magnitude as number) * Math.sin(deg((c.p.incline as P).angle as number)), 9)],
  h: ['The block is at rest, so the forces along the slope add to zero.', 'Along the slope there are two forces: friction, and the component of the weight parallel to the slope, W sin θ.'],
  s: 'Read from the figure: W = 80 N and the incline is at 30°. The component of the weight along the slope is W sin 30° = 80 × 0.5 = 40 N, down the slope. The block is at rest, so the friction force balances it: f = 40 N, up the slope.',
}]);

GB('1503a287.lo-1', 'Series circuits: one current everywhere', [{
  t: 'find an unlabelled resistance from the current', d: 3, need: 'calc',
  spec: circ(9, ser(R('R₁', 10), { type: 'ammeter', name: 'A', show: 'none' }, R('R₂', 20, { show: 'blank' }), R('R₃', 6))),
  alt: 'A single loop: a battery with its voltage printed, a resistor R₁ with its resistance printed, an ammeter, a resistor R₂ whose resistance is replaced by a question mark, and a resistor R₃ with its resistance printed, one after another.',
  q: 'The ammeter in the circuit shown reads 0.25 A. What is the resistance of R₂, in ohms?',
  n: '20',
  calc: ['emf ÷ 0.25 A − R₁ − R₃ from the spec, with circuit_component confirming that the ammeter then reads 0.25 A', (c) => { if (!near(cq(c, 'A', 'current'), 0.25)) throw new Error('the ammeter does not read 0.25 A'); const rs = arr((c.p.circuit as P).series).filter((x) => x.type === 'resistor'); return ((c.p.battery as P).emf as number) / 0.25 - (rs[0].value as number) - (rs[2].value as number); }],
  h: ['In a single loop the ammeter reading is the current through every resistor.', 'Use the battery voltage and the current to find the total resistance of the loop, then take away the two resistances you know.'],
  s: 'Read from the figure: the battery is 9 V, R₁ = 10 Ω and R₃ = 6 Ω, all in one loop with the ammeter. The total resistance is V / I = 9 / 0.25 = 36 Ω. Resistances in series add, so R₂ = 36 − 10 − 6 = 20 Ω.',
}]);

GB('1503a287.lo-2', 'Equivalent resistance in series', [{
  t: 'effect on the current of removing one resistor', d: 3, need: 'calc',
  spec: circ(12, ser(R('R₁', 6), R('R₂', 12), R('R₃', 18))),
  alt: 'A single loop: a battery with its voltage printed and three resistors, R₁, R₂ and R₃, one after another, each with its resistance printed.',
  q: 'In the circuit shown, resistor R₃ is taken out and replaced by a wire of negligible resistance. By what factor is the current from the battery multiplied?',
  n: '2',
  calc: ['battery current (circuit_component on R₁) with R₃ replaced by a wire ÷ the current as drawn', (c) => cq(c, 'R₁', 'current', undefined) && c.num('circuit_component', { component: 'R₁', quantity: 'current' }, swapped(c.spec, 'R₃', { type: 'wire', name: 'w' }, 'R₃ replaced by a wire')) / cq(c, 'R₁', 'current')],
  h: ['Find the equivalent resistance of the loop before and after the change.', 'The battery voltage stays the same, so the current is inversely proportional to the total resistance.'],
  s: 'Read from the figure: the three resistors are in series, so the total resistance is 6 + 12 + 18 = 36 Ω. With R₃ replaced by a wire it is 6 + 12 = 18 Ω. The voltage is unchanged and the resistance is halved, so the current is multiplied by 36 / 18 = 2.',
}]);

GB('183b6442.lo-2', 'Thin lens equation: an object inside the focal length', [{
  t: 'signed image distance of a virtual image', d: 3, need: 'calc',
  spec: ray({ element: 'converging_lens', focalLength: 12, objectDistance: 8, rays: 'none', showImage: false, show: { objectDistance: 'value', focalLength: 'value' } }),
  alt: 'A converging lens on a horizontal axis with the focal points marked on both sides and an upright object arrow standing on the axis to the left of the lens, between the lens and the nearer focal point. The object distance and the focal length are printed under the figure. No rays and no image are drawn.',
  q: 'For the converging lens and object shown, find the image distance in centimetres. Use the convention that the image distance is positive for a real image on the far side of the lens and negative for a virtual image on the same side as the object.',
  n: '-24',
  calc: ['1 / (1/f − 1/dₒ) from the spec', (c) => round(1 / (1 / (c.p.focalLength as number) - 1 / (c.p.objectDistance as number)), 9)],
  h: ['Use 1/f = 1/dₒ + 1/dᵢ with the two distances printed under the figure.', 'Compare the object distance with the focal length before you start: what kind of image should you expect, and what sign?'],
  s: 'Read from the figure: f = 12 cm and the object distance is 8 cm, less than the focal length. 1/dᵢ = 1/12 − 1/8 = (2 − 3)/24 = −1/24, so dᵢ = −24 cm. The negative sign means a virtual image, 24 cm from the lens on the same side as the object.',
}]);

GB('183b6442.lo-3', 'Mirror equation: working back to the focal length', [{
  t: 'focal length from object and image distances', d: 3, need: 'calc',
  spec: ray({ element: 'concave_mirror', focalLength: 20, objectDistance: 60, rays: 'none', showImage: true, focalMarks: false, show: { objectDistance: 'value', imageDistance: 'value' } }),
  alt: 'A concave mirror on a horizontal axis with an upright object arrow in front of it and a smaller inverted image arrow between the object and the mirror. The object distance and the image distance are printed under the figure. No rays and no focal point are drawn.',
  q: 'The diagram shows an object in front of a concave mirror and the real image of it produced by the mirror. What is the focal length of the mirror, in centimetres?',
  n: '20',
  calc: ['1 / (1/dₒ + 1/dᵢ) with dᵢ from ray_image_distance', (c) => round(1 / (1 / (c.p.objectDistance as number) + 1 / c.num('ray_image_distance', {})), 9)],
  h: ['Use the mirror equation 1/f = 1/dₒ + 1/dᵢ with the two distances printed under the figure.', 'Both distances are positive: the object and the real image are in front of the mirror.'],
  s: 'Read from the figure: the object is 60 cm and the real image 30 cm in front of the mirror. 1/f = 1/60 + 1/30 = 1/60 + 2/60 = 3/60, so f = 20 cm.',
}]);

GB('2b38f7f9.lo-1', 'Reading a position–time graph: distance against displacement', [{
  t: 'total distance when the motion reverses', d: 3, need: 'calc',
  spec: motion('position', [[2, 10], [6, 50], [8, 50], [12, 20]], { tRange: [0, 14], yRange: [0, 60], tStep: 2, yStep: 10, tLabel: 'time (s)', yLabel: 'position (m)' }),
  alt: 'A position–time graph made of three straight segments: the position rises, stays the same for a while, and then falls part of the way back.',
  q: 'The position–time graph of a delivery robot moving along a straight corridor is shown. What total distance does the robot travel during the time covered by the graph, in metres?',
  n: '70',
  calc: ['sum of |Δposition| over the segments (series_value at the marked times)', (c) => { const ts = [2, 6, 8, 12]; const ys = ts.map((t) => c.num('series_value', { series: 0, t })); return ys.slice(1).reduce((s, y, i) => s + Math.abs(y - ys[i]), 0); }],
  h: ['Distance travelled counts every metre moved, whichever way the robot is going.', 'Find how far the robot moves in each of the three stages and add the sizes.'],
  s: 'Read from the figure: the robot moves from 10 m to 50 m (40 m), stays at 50 m (0 m), then moves back from 50 m to 20 m (30 m). The total distance is 40 + 0 + 30 = 70 m, although its displacement is only 20 − 10 = 10 m.',
}]);

GB('2b38f7f9.lo-2', 'Velocity from the slope of a position–time graph', [{
  t: 'change in velocity where the slope changes', d: 3, need: 'calc',
  spec: motion('position', [[2, 5], [6, 25], [12, 10]], { tRange: [0, 14], yRange: [0, 30], tStep: 2, yStep: 5, tLabel: 'time (s)', yLabel: 'position (m)' }),
  alt: 'A position–time graph made of two straight segments: the position rises steeply and then falls more gently.',
  q: 'The position–time graph of a cart on a straight track is shown. By how much does the velocity of the cart change at t = 6 s? Give the velocity just after t = 6 s minus the velocity just before it, in m/s.',
  n: '-7.5',
  calc: ['series_slope(6, 12) − series_slope(2, 6)', (c) => c.num('series_slope', { series: 0, t1: 6, t2: 12 }) - c.num('series_slope', { series: 0, t1: 2, t2: 6 })],
  h: ['The velocity during each stage is the slope of that segment of the graph.', 'Find the two slopes, keeping their signs, and subtract the earlier one from the later one.'],
  s: 'Read from the figure: from 2 s to 6 s the position rises from 5 m to 25 m, a velocity of (25 − 5) / 4 = 5 m/s. From 6 s to 12 s it falls from 25 m to 10 m, a velocity of (10 − 25) / 6 = −2.5 m/s. The change is −2.5 − 5 = −7.5 m/s.',
}]);

GB('2b38f7f9.lo-3', 'Reading a velocity–time graph across its stages', [{
  t: 'total time above a given speed', d: 3, need: 'calc',
  spec: motion('velocity', [[2, 0], [6, 20], [10, 20], [14, 0]], { tRange: [0, 16], yRange: [-5, 25], tStep: 2, yStep: 5, tLabel: 'time (s)', yLabel: 'velocity (m/s)' }),
  alt: 'A velocity–time graph made of three straight segments: the velocity rises from zero, stays the same for a while, and then falls back to zero.',
  q: 'The velocity–time graph of a tram is shown. For how many seconds in total is the tram moving at 10 m/s or faster?',
  n: '8',
  calc: ['last − first time at which the line is at 10 m/s (series_crossing)', (c) => c.num('series_crossing', { series: 0, value: 10, want: 'greatest' }) - c.num('series_crossing', { series: 0, value: 10, want: 'least' })],
  h: ['Find the time at which the velocity first reaches 10 m/s while the tram speeds up.', 'Then find the time at which it drops back to 10 m/s while the tram slows down.'],
  s: 'Read from the figure: the line reaches 10 m/s on the way up at t = 4 s and falls back through 10 m/s at t = 12 s; between those times it is above 10 m/s. The tram moves at 10 m/s or faster for 12 − 4 = 8 s.',
}]);

GB('376f309f.lo-1', 'Components as projections: comparing two vectors', [{
  t: 'compare the components of two vectors with different tails', d: 3, need: 'reason',
  spec: vectors({ xRange: [-1, 7], yRange: [-1, 7], vectors: [{ tail: [0, 0], head: [4, 3], label: 'P' }, { tail: [1, 6], head: [5, 4], label: 'Q' }] }),
  alt: 'Two arrows on a grid, P and Q, starting at different points: P starts at the origin and points up and to the right; Q starts higher up and points down and to the right.',
  q: 'Vectors P and Q are drawn on the grid shown. Which statement about their components is correct?',
  o: [['P and Q have the same x-component', 'correct'], ['P and Q have the same y-component', 'compares the sizes of the vertical parts and ignores their directions and lengths'], ['P and Q have the same magnitude', 'judges by the look of the arrows'], ['The x-component of P equals the y-component of Q', 'reads the coordinates of a tail or a head as a component']],
  holds: ['components = head − tail (spec)', [
    (c) => vec(c, 'P')[0] === vec(c, 'Q')[0],
    (c) => vec(c, 'P')[1] === vec(c, 'Q')[1],
    (c) => near(Math.hypot(...vec(c, 'P')), Math.hypot(...vec(c, 'Q'))),
    (c) => vec(c, 'P')[0] === vec(c, 'Q')[1],
  ]],
  h: ['A component is the change in a coordinate from the tail of the arrow to its head; where the arrow starts does not matter.', 'Find the x- and y-components of each vector, with signs, before comparing.'],
  s: 'Read from the figure: P runs from (0, 0) to (4, 3), so its components are (4, 3). Q runs from (1, 6) to (5, 4), so its components are (5 − 1, 4 − 6) = (4, −2). The x-components are both 4; the y-components are 3 and −2, and the magnitudes are 5 and about 4.5.',
}]);

GB('3ef97c55.lo-2', 'Adding and subtracting vectors by components', [{
  t: 'component of a combination with a subtraction', d: 3, need: 'calc',
  spec: vectors({ xRange: [-1, 8], yRange: [-1, 7], vectors: [{ tail: [0, 0], head: [3, 2], label: 'P' }, { tail: [4, 1], head: [2, 4], label: 'Q' }, { tail: [5, 6], head: [6, 3], label: 'R' }] }),
  alt: 'Three separate arrows on a grid, P, Q and R, with their tails at different points: P points up and to the right, Q up and to the left, and R steeply down and to the right.',
  q: 'Displacement vectors P, Q and R are drawn on the grid shown; the axis numbers are in metres. What is the y-component of P + Q − R, in metres?',
  n: '8',
  calc: ['Pᵧ + Qᵧ − Rᵧ with components = head − tail (spec)', (c) => vec(c, 'P')[1] + vec(c, 'Q')[1] - vec(c, 'R')[1]],
  h: ['Read the y-component of each vector as the change in y from its tail to its head, with its sign.', 'Subtracting a vector means subtracting each of its components.'],
  s: 'Read from the figure: P rises from y = 0 to y = 2, so Pᵧ = 2; Q rises from y = 1 to y = 4, so Qᵧ = 3; R falls from y = 6 to y = 3, so Rᵧ = −3. The y-component of P + Q − R is 2 + 3 − (−3) = 8 m.',
}]);

GB('3ef97c55.lo-3', 'Resultant and equilibrant', [{
  t: 'magnitude of the force that balances two others', d: 3, need: 'calc',
  spec: vectors({ xRange: [-1, 10], yRange: [-1, 8], vectors: [{ components: [5, 2], label: 'P' }, { components: [3, 4], label: 'Q' }], tipToTail: true }),
  alt: 'Two arrows on a grid drawn tip to tail from the origin: P points to the right and slightly up, and Q continues from the tip of P, pointing up and to the right.',
  q: 'Forces P and Q act on a small ring and are drawn tip to tail on the grid shown; the axis numbers are in newtons. A third force is then added so that the ring is in equilibrium. What is the magnitude of the third force, in newtons?',
  n: '10',
  calc: ['|P + Q| from the spec components (the third force is equal and opposite to the resultant)', (c) => Math.hypot(vec(c, 'P')[0] + vec(c, 'Q')[0], vec(c, 'P')[1] + vec(c, 'Q')[1])],
  h: ['For equilibrium the third force must cancel the resultant of P and Q exactly.', 'Find the components of the resultant from the start of P to the tip of Q, then use the Pythagorean theorem.'],
  s: 'Read from the figure: the chain starts at (0, 0) and ends at the tip of Q, (8, 6), so the resultant of P and Q has components (8, 6) and magnitude √(8² + 6²) = 10 N. The third force must be equal and opposite to it, so its magnitude is 10 N.',
}]);

GB('67385871.lo-2', 'Free-body diagram of a hanging block', [{
  t: 'find the mass when the weight is not given', d: 4, need: 'calc',
  spec: fbd([F('T', 'up', 32), F('W', 'down')], { object: { shape: 'box', label: 'm' }, lengths: 'equal' }),
  alt: 'A box labelled m with two force arrows of equal length: T pointing up, with its size printed, and W pointing down, with no size printed.',
  q: 'The free-body diagram shows the forces on a block of mass m that hangs from a string passing over a pulley. The block accelerates downward at 2.0 m/s². Taking g = 10 N/kg, what is the mass of the block, in kilograms?',
  n: '4',
  calc: ['T ÷ (g − a) with T from the spec: mg − T = ma', (c) => (arr(c.p.forces).find((x) => x.label === 'T')!.magnitude as number) / (10 - 2)],
  h: ['Write Newton\'s second law for the block with down as the positive direction: the weight minus the tension equals ma.', 'The weight is mg, so the unknown mass appears on both sides of the equation.'],
  s: 'Read from the figure: the tension is T = 32 N, upward; the weight W = mg acts downward. With down positive, mg − T = ma, so m(g − a) = T and m = 32 / (10 − 2) = 4 kg. (Check: W = 40 N, net force 8 N downward, 8 / 4 = 2 m/s².)',
}]);

GB('73571e58.lo-1', 'The field of a bar magnet has a direction', [
  {
    t: 'attraction or repulsion from the field pattern alone', d: 3, need: 'reason',
    spec: magnet([{ north: 'left', poles: 'none' }, { north: 'left', poles: 'none' }], { arrows: true }),
    alt: 'Two bar magnets end to end with a gap between them; neither carries pole letters. Curved field lines with arrowheads are drawn round both magnets and in the gap between them.',
    q: 'The diagram shows the magnetic field lines round two bar magnets whose poles are not marked. What do the field lines in the gap show about the two magnets?',
    o: [['They attract; the facing poles are unlike', 'correct'], ['They attract; the facing poles are alike', 'reads the pattern correctly but takes like poles to attract'], ['They repel; the facing poles are unlike', 'takes unlike poles to repel'], ['They repel; the facing poles are alike', 'reads lines that cross the gap as lines that are pushed apart']],
    calc: ['magnet_interaction, worded with the rule that unlike poles attract', (c) => (c.txt('magnet_interaction') === 'attract' ? 'They attract; the facing poles are unlike' : 'They repel; the facing poles are alike')],
    h: ['Look at the lines in the gap: do they run across from one magnet to the other, or do the lines from the two ends bend away from each other?', 'A field line runs from a north pole to a south pole.'],
    s: 'Read from the figure: in the gap the field lines run straight across from the end of one magnet to the facing end of the other. A field line leaves a north pole and enters a south pole, so the facing poles must be one of each kind — unlike poles — and unlike poles attract.',
  },
  {
    t: 'needle directions at two places round one magnet', d: 3, need: 'reason',
    spec: magnet([{ north: 'right' }], { arrows: false, compasses: [{ x: 2.5, y: 0, label: 'X', needle: false }, { x: 0, y: -1.45, label: 'Y', needle: false }] }),
    alt: 'A horizontal bar magnet with its two halves marked with pole letters, and curved field lines without arrowheads looping from one end to the other. Two empty compasses are drawn: X beyond the right-hand end of the magnet, on its line, and Y below the middle of the magnet.',
    q: 'Two compasses, X and Y, are placed near the bar magnet in the diagram shown. In which directions do the north-seeking ends of their needles point?',
    o: [['X to the right; Y to the left', 'correct'], ['X to the left; Y to the right', 'takes a north-seeking end to point toward a north pole'], ['X to the right; Y to the right', 'takes the field to have one direction everywhere'], ['X to the left; Y to the left', 'gets the direction beyond the pole wrong and the direction beside the magnet right']],
    calc: ['magnet_compass_direction of X and of Y', (c) => `X to the ${needle(c, 'X')}; Y to the ${needle(c, 'Y')}`],
    h: ['Outside a magnet the field points away from the north pole and loops round to the south pole.', 'A needle\'s north-seeking end points the way the field points at the place where the compass is.'],
    s: 'Read from the figure: the north pole is the right-hand half of the magnet. At X, beyond the north pole, the field points away from the magnet: to the right. Beside the magnet the field runs back from the north pole toward the south pole, so at Y, below the middle, it points to the left. X points to the right and Y to the left.',
  },
]);

GB('7c124ba6.lo-4', 'Newton\'s second law in an elevator', [{
  t: 'signed acceleration from the two forces', d: 3, need: 'calc',
  spec: fbd([F('N', 'up', 540), F('W', 'down', 600)], { object: { shape: 'box', label: 'person' } }),
  alt: 'A box labelled person with two force arrows, each with its size printed: N pointing up and W pointing down, the downward arrow a little longer.',
  q: 'The free-body diagram shows the forces on a person standing on a scale in a moving elevator. Taking up as the positive direction and g = 10 N/kg, what is the acceleration of the elevator, in m/s²?',
  n: '-1',
  calc: ['(N − W) ÷ (W ÷ g) from the spec', (c) => { const m = (l: string): number => arr(c.p.forces).find((x) => x.label === l)!.magnitude as number; return (m('N') - m('W')) / (m('W') / 10); }],
  h: ['Find the net force with up as positive, and the mass of the person from the weight.', 'Then a = net force / mass; keep the sign.'],
  s: 'Read from the figure: N = 540 N upward and W = 600 N downward, so the net force is 540 − 600 = −60 N. The mass is W / g = 600 / 10 = 60 kg. The acceleration is −60 / 60 = −1 m/s²: 1 m/s² downward.',
}]);

GB('8237632d.lo-2', 'Crossing a river: using the components separately', [{
  t: 'downstream drift from the two velocity components', d: 3, need: 'calc',
  spec: vectors({ xRange: [-1, 4], yRange: [-1, 7], vectors: [{ components: [0, 5], label: 'boat' }, { components: [2, 0], label: 'current' }], tipToTail: true, xLabel: 'east (m/s)', yLabel: 'north (m/s)' }),
  alt: 'Two arrows on a grid drawn tip to tail from the origin: one named boat pointing straight north, and one named current continuing from its tip, pointing east. The axes are labelled east and north, in metres per second.',
  q: 'The arrows on the grid shown are the velocity of a boat relative to the water and the velocity of the river current, drawn tip to tail. The river is 100 m wide and flows east; the boat starts on the south bank. How far downstream from its starting point does the boat reach the north bank, in metres?',
  n: '40',
  calc: ['width ÷ (north component of the boat) × (east component of the current), from the spec', (c) => (100 / vec(c, 'boat')[1]) * vec(c, 'current')[0]],
  h: ['Only the northward part of the velocity carries the boat across; use it to find the crossing time.', 'During that time the current carries the boat east at its own speed.'],
  s: 'Read from the figure: the boat moves north at 5 m/s relative to the water and the current flows east at 2 m/s. Crossing 100 m at 5 m/s takes 100 / 5 = 20 s. In 20 s the current carries the boat 2 × 20 = 40 m downstream.',
}]);

GB('ae0f8dbd.lo-1', 'Series and parallel parts of one circuit', [{
  t: 'which bulbs depend on a broken one', d: 3, need: 'reason',
  spec: circ(6, par(ser(bulb('L₁'), bulb('L₂')), bulb('L₃'), bulb('L₄'))),
  alt: 'A battery connected to three branches side by side: the first branch holds two bulbs, L₁ and L₂, one after the other; the second holds one bulb, L₃; the third holds one bulb, L₄.',
  q: 'In the circuit shown, the filament of bulb L₁ breaks, so that no current can pass through it. How many of the other three bulbs stay lit?',
  n: '2',
  calc: ['bulbs that still carry a current (circuit_component) when L₁ is replaced by a gap', (c) => ['L₂', 'L₃', 'L₄'].filter((b) => c.num('circuit_component', { component: b, quantity: 'current' }, swapped(c.spec, 'L₁', { type: 'switch', name: 'gap', closed: false }, 'L₁ replaced by a gap')) > 0).length],
  h: ['A bulb stays lit only if there is still a complete path from the battery through it and back.', 'Which bulb shares its branch with L₁, and which bulbs have a branch of their own?'],
  s: 'Read from the figure: L₁ and L₂ are in series in one branch, so when L₁ breaks no current can flow through L₂ either. L₃ and L₄ each have their own branch connected straight across the battery, so they are unaffected. Two bulbs, L₃ and L₄, stay lit.',
}]);

GB('bf29e966.lo-5', 'Critical angle: deciding what the ray does', [{
  t: 'compare the angle of incidence with the critical angle', d: 3, need: 'calc',
  spec: ray({ element: 'interface', n1: 1.5, n2: 1, incidentAngle: 45, media: ['glass', 'air'], refracted: false }),
  alt: 'A horizontal boundary between two media, named glass above and air below, each with its refractive index printed. A ray in the glass meets the boundary at a marked angle to the dashed normal. Nothing is drawn beyond the point where the ray meets the boundary.',
  q: 'A ray of light inside a glass block meets the boundary between the glass and air at the angle shown. What happens to the ray at the boundary?',
  o: [['It is totally reflected back into the glass', 'correct'], ['It passes into the air, bending away from the normal', 'does not compare the angle with the critical angle'], ['It passes into the air, bending toward the normal', 'applies the bending for light entering a denser medium'], ['It passes into the air along the boundary', 'takes the angle shown to be exactly the critical angle']],
  holds: ['n₁ sin θ₁ against n₂ from the spec (total internal reflection when it is greater)', [
    (c) => (c.p.n1 as number) * Math.sin(deg(c.p.incidentAngle as number)) > (c.p.n2 as number) + 1e-9,
    (c) => (c.p.n1 as number) * Math.sin(deg(c.p.incidentAngle as number)) < (c.p.n2 as number) - 1e-9 && (c.p.n1 as number) > (c.p.n2 as number),
    (c) => (c.p.n1 as number) * Math.sin(deg(c.p.incidentAngle as number)) < (c.p.n2 as number) - 1e-9 && (c.p.n1 as number) < (c.p.n2 as number),
    (c) => near((c.p.n1 as number) * Math.sin(deg(c.p.incidentAngle as number)), c.p.n2 as number, 1e-6),
  ]],
  h: ['Work out the critical angle for this pair of media from sin θc = n₂ / n₁.', 'Compare the angle of incidence printed on the diagram with the critical angle.'],
  s: 'Read from the figure: the ray travels in glass, n = 1.5, toward air, n = 1.0, at 45° to the normal. The critical angle is given by sin θc = 1.0 / 1.5, so θc ≈ 41.8°. The angle of incidence, 45°, is greater than the critical angle, so no light is refracted: the ray is totally reflected back into the glass.',
}]);

GB('ef1b68d3.lo-2', 'Direction of a force and the signs of its components', [{
  t: 'signed x-component of a force in the second quadrant', d: 3, need: 'calc',
  spec: fbd([F('F', 143, 50, { showAngle: true })], { object: { shape: 'dot' }, axes: 'standard' }),
  alt: 'A dot with a single force arrow F pointing up and to the left, its size printed; an arc marks the angle between the arrow and the horizontal on its left. A small x–y indicator shows the positive directions.',
  q: 'The diagram shows a single force F acting on a particle; the marked angle is measured from the horizontal. Taking right as the positive x-direction, what is the x-component of F, in newtons? Use sin 37° = 0.60 and cos 37° = 0.80.',
  n: '-40',
  calc: ['F cos(direction) from the spec, with cos 37° taken as 0.80 as the stem says', (c) => { const f = arr(c.p.forces)[0]; if (f.direction !== 143 || !near(Math.cos(deg(143)), -0.8, 2e-3)) throw new Error('the direction is not 37° above the negative x-axis'); return -(f.magnitude as number) * 0.8; }],
  h: ['The size of the horizontal part is F times the cosine of the angle between F and the horizontal.', 'Then decide the sign: does the arrow point toward positive x or toward negative x?'],
  s: 'Read from the figure: F = 50 N, at 37° above the horizontal and pointing to the left. The horizontal part has size 50 × cos 37° = 50 × 0.80 = 40 N, and it points in the negative x-direction, so the x-component is −40 N.',
}]);

// ── AP Chemistry (graphs and spectra) ───────────────────────────────────────

GB('27b58964.lo-3', 'Maxwell–Boltzmann distributions and a threshold', [{
  t: 'fraction of molecules past a threshold at two temperatures', d: 3, need: 'reason',
  spec: fgraph({ xRange: [0, 7], yRange: [0, 5], curves: [{ expr: '4*x^2*exp(1 - x^2)', label: 'P' }, { expr: '2*(x/2)^2*exp(1 - (x/2)^2)', label: 'Q' }], asymptotes: [{ x: 3 }], xLabel: 'Molecular speed (km/s)', yLabel: 'Relative number of molecules' }),
  alt: 'Two hump-shaped curves that start at the origin: P is tall and narrow with its peak at a low speed; Q is lower and broader with its peak at a higher speed and a long tail to the right. A dashed vertical line stands to the right of both peaks.',
  q: 'Curves P and Q in the graph show the distribution of molecular speeds in the same sample of gas at two temperatures. Only molecules moving faster than the speed marked by the dashed vertical line can react. For which curve is the fraction of molecules able to react larger, and which temperature does that curve belong to?',
  o: [['Curve Q; the higher temperature', 'correct'], ['Curve P; the higher temperature', 'takes the taller peak for the hotter sample'], ['Curve P; the lower temperature', 'judges the fraction by the height of the peak'], ['Curve Q; the lower temperature', 'reads the tail correctly but takes the broader curve for the colder sample']],
  holds: ['area of each curve beyond the dashed line (Simpson on the spec\'s expressions) and the speed at which each curve peaks', [
    (c) => tailOf(c, 1) > tailOf(c, 0) && peakOf(c, 1) > peakOf(c, 0),
    (c) => tailOf(c, 0) > tailOf(c, 1) && peakOf(c, 0) > peakOf(c, 1),
    (c) => tailOf(c, 0) > tailOf(c, 1) && peakOf(c, 0) < peakOf(c, 1),
    (c) => tailOf(c, 1) > tailOf(c, 0) && peakOf(c, 1) < peakOf(c, 0),
  ]],
  h: ['The fraction of molecules able to react is the share of the area under a curve that lies to the right of the dashed line.', 'Raising the temperature moves the peak to a higher speed and makes the curve lower and broader.'],
  s: 'Read from the figure: to the right of the dashed line almost nothing is left under curve P, while a clear tail of curve Q lies there, so the fraction of molecules able to react is larger for Q. Curve Q has its peak at the higher speed and is lower and broader, which is the distribution at the higher temperature.',
}]);

GB('500ae70f.lo-4', 'Using the equivalence point of a titration curve', [{
  t: 'concentration of the acid from the equivalence volume', d: 3, need: 'calc',
  spec: S('titration_curve', { analyte: { type: 'strong_acid', concentration: 0.15, volume: 20 }, titrantConcentration: 0.1, maxVolume: 50 }),
  alt: 'A titration curve: pH against the volume of titrant added, in millilitres. The pH starts low, rises slowly, climbs almost vertically over a very small range of volume, and then levels out at a high pH.',
  q: 'A 20.0 mL sample of hydrochloric acid was titrated with 0.100 M NaOH, giving the titration curve shown. What was the concentration of the hydrochloric acid, in mol/L? Give your answer to three decimal places.',
  n: '0.150',
  calc: ['0.100 M × titration_equivalence_volume ÷ 20.0 mL', (c) => round((0.1 * c.num('titration_equivalence_volume', {})) / 20, 9)],
  h: ['Read the volume of NaOH at the middle of the near-vertical part of the curve: that is the equivalence point.', 'At equivalence the moles of NaOH added equal the moles of HCl in the sample.'],
  s: 'Read from the figure: the near-vertical rise is at 30 mL of NaOH, the equivalence point. Moles of NaOH = 0.100 mol/L × 0.030 L = 0.00300 mol, which equals the moles of HCl. The concentration of the acid is 0.00300 mol / 0.0200 L = 0.150 mol/L.',
}]);

GB('ada76c1a.lo-1', 'Isotopes: neutrons and abundance together', [{
  t: 'total neutrons in a sample with the abundances shown', d: 3, need: 'calc',
  spec: mass([[10, 20], [11, 80]], { yMax: 100, yStep: 20 }),
  alt: 'A mass spectrum with two bars at neighbouring mass-to-charge values; the bar at the higher mass is four times as tall as the other. The vertical axis is relative abundance in percent.',
  q: 'The mass spectrum shown is that of boron, atomic number 5. In a sample of exactly 10 boron atoms with the abundances shown, how many neutrons are there in total?',
  n: '58',
  calc: ['Σ (abundance ÷ 10) × (mass number − 5) over the peaks (spec)', (c) => arr(c.p.peaks).reduce((s, p) => s + ((p.abundance as number) / 10) * ((p.mz as number) - 5), 0)],
  h: ['Each bar is one isotope: its position gives the mass number and its height the percentage of atoms.', 'Neutrons = mass number − atomic number. Work out how many of the 10 atoms are of each isotope.'],
  s: 'Read from the figure: 20 % of the atoms have mass number 10 and 80 % have mass number 11. Of 10 atoms, 2 are boron-10 with 10 − 5 = 5 neutrons each and 8 are boron-11 with 11 − 5 = 6 neutrons each. Total: 2 × 5 + 8 × 6 = 58 neutrons.',
}]);

GB('f5cf533c.lo-4', 'Peak heights and shells', [{
  t: 'electrons in the outermost shell from the peak heights', d: 3, need: 'calc',
  spec: pes([[239, 2], [22.7, 2], [16.5, 6], [2.05, 2], [1.0, 4]]),
  alt: 'A photoelectron spectrum with five peaks of different heights on a logarithmic binding-energy axis that increases to the left: one alone at the far left, two close together in the middle and two close together at the right. The vertical axis is the relative number of electrons.',
  q: 'The spectrum shown is the complete photoelectron spectrum of a neutral atom in its ground state; the peak furthest to the left represents 2 electrons. How many electrons does the atom have in its outermost occupied shell?',
  n: '6',
  calc: ['sum of the electrons of the peaks whose subshell (spectrum_peak_subshell) is in the highest shell', (c) => { const pk = arr(c.p.peaks); const sub = pk.map((_, i) => c.txt('spectrum_peak_subshell', { peak: i })); const top = Math.max(...sub.map((s) => Number(s[0]))); return pk.reduce((t, p, i) => t + (Number(sub[i][0]) === top ? (p.electrons as number) : 0), 0); }],
  h: ['Use the height of the left-hand peak to find how many electrons each of the other peaks represents.', 'Assign the peaks to subshells in order of decreasing binding energy: 1s, 2s, 2p, 3s, 3p. The outermost shell may own more than one peak.'],
  s: 'Read from the figure: taking the left-hand peak as 2 electrons, the five peaks represent 2, 2, 6, 2 and 4 electrons, which are 1s² 2s² 2p⁶ 3s² 3p⁴ (sulfur). The outermost occupied shell is n = 3, shown by the two right-hand peaks: 2 + 4 = 6 electrons.',
}]);

GB('f5cf533c.lo-5', 'From a spectrum to the spectrum of the ion', [{
  t: 'predict which peaks the ion loses', d: 4, need: 'reason',
  spec: pes([[126, 2], [9.07, 2], [5.31, 6], [0.74, 2]]),
  alt: 'A photoelectron spectrum with four peaks on a logarithmic binding-energy axis that increases to the left: one at the far left, two in the middle, the second of them much the tallest, and one at the far right. The vertical axis is the relative number of electrons.',
  q: 'The spectrum shown is the complete photoelectron spectrum of a neutral atom in its ground state; the peak furthest to the left represents 2 electrons. When the atom loses all of its valence electrons to make its usual ion, which peaks would be missing from the photoelectron spectrum of that ion?',
  o: [['Only the peak furthest to the right', 'correct'], ['The two peaks furthest to the right', 'counts the 2p electrons as valence electrons'], ['Only the peak furthest to the left', 'takes the electrons that are hardest to remove for the valence electrons'], ['Only the tallest peak', 'takes the subshell with the most electrons for the valence shell']],
  holds: ['spectrum_configuration: the valence shell is the highest n; count the peaks that belong to it', [
    (c) => { const cfg = c.txt('spectrum_configuration', {}); const shells = [...cfg.matchAll(/(\d)[spdf]/g)].map((m) => Number(m[1])); return shells.filter((n) => n === Math.max(...shells)).length === 1; },
    (c) => { const cfg = c.txt('spectrum_configuration', {}); const shells = [...cfg.matchAll(/(\d)[spdf]/g)].map((m) => Number(m[1])); return shells.filter((n) => n === Math.max(...shells)).length === 2; },
    () => false, // the left-hand peak is 1s: the electrons hardest to remove
    () => false, // the tallest peak is 2p⁶, an inner subshell here
  ]],
  h: ['Work out the electron configuration from the heights of the peaks, starting with 1s at the left.', 'Valence electrons are those in the outermost shell: they have the lowest binding energy.'],
  s: 'Read from the figure: the peaks represent 2, 2, 6 and 2 electrons, so the atom is 1s² 2s² 2p⁶ 3s² (magnesium). Its valence electrons are the two 3s electrons, which have the lowest binding energy: the peak furthest to the right. The ion Mg²⁺ is 1s² 2s² 2p⁶, so only that one peak would be missing.',
}]);

GB('f79ce0db.lo-2', 'Energy diagrams read in reverse', [{
  t: 'enthalpy change of the reverse reaction', d: 3, need: 'calc',
  spec: rc({ reactantsEnergy: 30, productsEnergy: -50, activationEnergies: [40] }),
  alt: 'An energy diagram: a curve that starts at the level of the reactants, rises over a single peak and ends at the lower level of the products. The vertical axis is energy in kilojoules per mole, with numbered ticks.',
  q: 'The energy diagram shown is for a reaction as written, from reactants to products. For the REVERSE reaction, what is the enthalpy change, and is the reverse reaction endothermic or exothermic?',
  o: [['+80 kJ/mol; endothermic', 'correct'], ['−80 kJ/mol; exothermic', 'gives the values for the forward reaction'], ['+120 kJ/mol; endothermic', 'gives the activation energy of the reverse reaction'], ['+40 kJ/mol; endothermic', 'gives the activation energy of the forward reaction']],
  calc: ['−rc_delta_h, worded with its direction', (c) => { const dh = -c.num('rc_delta_h', {}); return `${dh > 0 ? '+' : '−'}${Math.abs(dh)} kJ/mol; ${dh > 0 ? 'endothermic' : 'exothermic'}`; }],
  h: ['For the reverse reaction the products of the diagram are the starting materials.', 'ΔH is the final energy minus the initial energy; it does not involve the height of the peak.'],
  s: 'Read from the figure: the reactants are at 30 kJ/mol and the products at −50 kJ/mol, so the forward reaction has ΔH = −50 − 30 = −80 kJ/mol. The reverse reaction starts at −50 and ends at 30, so ΔH = +80 kJ/mol: energy is absorbed and the reverse reaction is endothermic.',
}]);

// ── AP Chemistry (structures on ordinary objectives) ────────────────────────

GB('87ef2ba6.lo-2', 'Formal charges from a drawn structure', [{
  t: 'locate the formal charge of an ion', d: 3, need: 'calc',
  spec: mols([lin3(at('S', 'S', LP3), at('C', 'C', { lonePairs: 0 }), at('N', 'N', { lonePairs: 1 }), [1, 3])], { showFormalCharges: false }),
  alt: `Three atoms in a row: sulfur, carbon, nitrogen. A single bond joins sulfur to carbon and a triple bond joins carbon to nitrogen; the sulfur carries three lone pairs and the nitrogen one. No formal charges are marked. ${ALT_LEWIS}`,
  q: 'The diagram shows one Lewis structure of the thiocyanate ion, SCN⁻, without its formal charges. In this structure, which atom carries the formal charge of −1?',
  o: [['The sulfur atom', 'correct'], ['The nitrogen atom', 'gives the charge to the most electronegative atom without calculating'], ['The carbon atom', 'gives the charge to the central atom'], ['No single atom; each carries a third of it', 'spreads the charge of the ion evenly instead of calculating formal charges']],
  calc: ['the atom whose mol_formal_charge is −1', (c) => { const hit = (['S', 'C', 'N'] as const).filter((a) => fcOf(c, a) === -1); if (hit.length !== 1) throw new Error('not one atom at −1'); return `The ${{ S: 'sulfur', C: 'carbon', N: 'nitrogen' }[hit[0]]} atom`; }],
  h: ['Formal charge = valence electrons − lone-pair electrons − number of bonds.', 'Calculate it for each of the three atoms from what is drawn; do not guess from electronegativity.'],
  s: 'Read from the figure and compute: sulfur has three lone pairs and one bond, 6 − 6 − 1 = −1; carbon has four bonds and no lone pair, 4 − 0 − 4 = 0; nitrogen has one lone pair and three bonds, 5 − 2 − 3 = 0. In this structure the sulfur atom carries the −1.',
}]);

GB('4354050b.lo-4', 'Electron-domain geometry against molecular geometry', [{
  t: 'both geometries of a six-domain centre', d: 3, need: 'reason',
  spec: mols([molecule([at('Xe', 'Xe', { x: 0, y: 0, lonePairs: 2 }), ...[0, 90, 180, 270].map((a, i) => at(`F${i + 1}`, 'F', { from: 'Xe', angle: a, lonePairs: 3 }))], [1, 2, 3, 4].map((i) => bd('Xe', `F${i}`)), { center: 'Xe' })]),
  alt: `A xenon atom in the middle is joined by single bonds to four fluorine atoms, one on each side, above and below. The xenon carries two lone pairs and each fluorine three. ${ALT_LEWIS}`,
  q: 'The Lewis structure of a molecule is shown. What are the electron-domain geometry and the molecular geometry around the central atom?',
  o: [['Octahedral; square planar', 'correct'], ['Octahedral; octahedral', 'does not remove the lone pairs when naming the shape of the molecule'], ['Square planar; square planar', 'leaves the lone pairs out of the electron-domain count'], ['Tetrahedral; tetrahedral', 'counts four domains: the bonds only']],
  calc: ['mol_vsepr electron_geometry; molecular_geometry', (c) => { const e = c.txt('mol_vsepr', { want: 'electron_geometry' }); return `${e[0].toUpperCase()}${e.slice(1)}; ${c.txt('mol_vsepr', { want: 'molecular_geometry' })}`; }],
  h: ['Count every electron domain round the central atom: each bond and each lone pair.', 'The electron-domain geometry uses all the domains; the molecular geometry describes only where the atoms are.'],
  s: 'Read from the figure: the central xenon atom has four single bonds and two lone pairs, six electron domains in all. Six domains point to the corners of an octahedron, so the electron-domain geometry is octahedral. The two lone pairs lie opposite each other, leaving the four fluorine atoms in one plane: the molecular geometry is square planar.',
}]);

const TETRA = (center: P, hs = 4): P => {
  const around = Array.from({ length: hs }, (_, i) => `H${i + 1}`);
  return molecule([center, ...around.map((id) => at(id, 'H'))], around.map((id) => bd(center.id as string, id)), { layout: { type: hs === 4 ? 'tetrahedral' : hs === 3 ? 'trigonal_pyramidal' : 'bent', center: center.id, around }, center: center.id });
};

GB('4354050b.lo-5', 'Bond angles and lone pairs', [{
  t: 'smallest bond angle among three four-domain molecules', d: 3, need: 'reason',
  spec: mols([{ ...TETRA(at('C', 'C', { lonePairs: 0 }), 4), label: 'I' }, { ...TETRA(at('N', 'N', { lonePairs: 1 }), 3), label: 'II' }, { ...TETRA(at('O', 'O', { lonePairs: 2 }), 2), label: 'III' }]),
  alt: 'I: a carbon atom joined to four hydrogen atoms, two bonds in the plane, one on a solid wedge and one on a hashed wedge, no lone pair. II: a nitrogen atom joined to three hydrogen atoms, with one lone pair. III: an oxygen atom joined to two hydrogen atoms, with two lone pairs.',
  q: 'The diagram shows the structures of three molecules; a solid wedge is a bond toward the viewer and a hashed wedge a bond away from the viewer. In which molecule is the H–X–H bond angle smallest, where X is the central atom?',
  o: [['Molecule III', 'correct'], ['Molecule I', 'takes more bonded atoms to mean a smaller angle between them'], ['Molecule II', 'takes one lone pair to squeeze the bonds more than two'], ['The angle is the same in all three', 'stops at the common tetrahedral electron-domain geometry']],
  calc: ['all three centres have four domains (mol_vsepr); the one with the most lone pairs (mol_count) has the smallest angle', (c) => { const cs = ['C', 'N', 'O']; if (!cs.every((a, i) => c.num('mol_vsepr', { want: 'steric_number', atom: a, molecule: i }) === 4)) throw new Error('not all four-domain'); const lp = cs.map((a, i) => molCount(c, 'lone_pairs', { atom: a, molecule: i })); return `Molecule ${['I', 'II', 'III'][lp.indexOf(Math.max(...lp))]}`; }],
  h: ['Count the electron domains round each central atom: all three have the same number.', 'A lone pair repels more strongly than a bonding pair, so it pushes the bonds closer together.'],
  s: 'Read from the figure: each central atom has four electron domains — carbon four bonds, nitrogen three bonds and one lone pair, oxygen two bonds and two lone pairs. Lone pairs repel more strongly than bonding pairs, so each lone pair closes the H–X–H angle a little: 109.5° in I, about 107° in II and about 104.5° in III. The angle is smallest in molecule III.',
}]);

const BF3: P = molecule([at('B', 'B', { lonePairs: 0 }), at('F1', 'F', LP3), at('F2', 'F', LP3), at('F3', 'F', LP3)], [bd('B', 'F1'), bd('B', 'F2'), bd('B', 'F3')], { layout: { type: 'trigonal_planar', center: 'B', around: ['F1', 'F2', 'F3'] }, center: 'B' });
const NF3: P = molecule([at('N', 'N', { lonePairs: 1 }), at('F1', 'F', LP3), at('F2', 'F', LP3), at('F3', 'F', LP3)], [bd('N', 'F1'), bd('N', 'F2'), bd('N', 'F3')], { layout: { type: 'trigonal_pyramidal', center: 'N', around: ['F1', 'F2', 'F3'] }, center: 'N' });

GB('4354050b.lo-6', 'Polarity from geometry', [{
  t: 'polar or nonpolar: two molecules with the same formula type', d: 3, need: 'reason',
  spec: mols([{ ...BF3, label: 'I' }, { ...NF3, label: 'II' }]),
  alt: 'I: a boron atom joined to three fluorine atoms spread evenly in the plane, with no lone pair on the boron. II: a nitrogen atom joined to three fluorine atoms that all lie to one side of it, one on a solid wedge and one on a hashed wedge, with one lone pair on the nitrogen. Every fluorine carries three lone pairs.',
  q: 'Lewis structures of two molecules are shown; a solid wedge is a bond toward the viewer and a hashed wedge a bond away from the viewer. Which of the two molecules is polar?',
  o: [['II only', 'correct'], ['I only', 'takes the molecule without a lone pair on its central atom for the polar one'], ['I and II', 'takes polar bonds to make a polar molecule whatever the shape'], ['Neither molecule', 'takes three identical outer atoms to cancel in any arrangement']],
  calc: ['mol_polarity of each structure', (c) => { const p = [0, 1].map((i) => c.txt('mol_polarity', { molecule: i }) === 'polar'); return p[0] && p[1] ? 'I and II' : p[0] ? 'I only' : p[1] ? 'II only' : 'Neither molecule'; }],
  h: ['Every B–F and N–F bond is polar. Whether the molecule is polar depends on whether the bond dipoles cancel.', 'Find the shape of each molecule from the electron domains on its central atom, lone pairs included.'],
  s: 'Read from the figure: in I boron has three bonds and no lone pair, so the molecule is trigonal planar and its three equal bond dipoles, 120° apart, cancel: nonpolar. In II nitrogen has three bonds and one lone pair, so the molecule is trigonal pyramidal; the three bond dipoles all point to the same side and do not cancel: polar. Only II is polar.',
}]);

const SP: Record<string, string> = { sp: 'sp', sp2: 'sp²', sp3: 'sp³' };

GB('29bb74a4.lo-1', 'Hybridisation along a chain', [{
  t: 'hybridisation of three carbons with different bonding', d: 3, need: 'reason',
  spec: mols([molecule([at('C1', 'C', { x: 0, y: 0, h: 2, lonePairs: 0 }), at('C2', 'C', { x: 1.25, y: 0, h: 1, lonePairs: 0 }), at('C3', 'C', { x: 2.5, y: 0, lonePairs: 0 }), at('N', 'N', { x: 3.5, y: 0, lonePairs: 1 })], [bd('C1', 'C2', 2), bd('C2', 'C3'), bd('C3', 'N', 3)])]),
  alt: `A chain of four atoms: a carbon written with two hydrogens, a carbon written with one hydrogen, a carbon with no hydrogen, and a nitrogen with one lone pair. The first two carbons are joined by a double bond, the second and third by a single bond, and the third carbon and the nitrogen by a triple bond. ${ALT_LEWIS}`,
  q: 'The structure of a molecule is shown, with the hydrogen atoms written beside the carbon they are bonded to. What is the hybridisation of each of the three carbon atoms, from left to right?',
  o: [['sp², sp², sp', 'correct'], ['sp³, sp², sp', 'counts the number of atoms written in each group'], ['sp², sp², sp²', 'treats a triple bond like a double bond'], ['sp², sp, sp', 'counts the atoms drawn as symbols and overlooks the hydrogen on the middle carbon']],
  calc: ['mol_vsepr hybridisation of C1, C2 and C3', (c) => ['C1', 'C2', 'C3'].map((a) => SP[c.txt('mol_vsepr', { want: 'hybridisation', atom: a })]).join(', ')],
  h: ['Count the electron domains round each carbon: every atom it is bonded to counts once, however many bonds join them.', 'Do not forget the hydrogen atoms written beside a carbon. Two domains is sp, three is sp², four is sp³.'],
  s: 'Read from the figure: the left-hand carbon is bonded to two hydrogens and one carbon, three domains, sp². The middle carbon is bonded to one hydrogen and two carbons, three domains, sp². The right-hand carbon is bonded to one carbon and one nitrogen, two domains, sp. From left to right: sp², sp², sp.',
}]);

GB('29bb74a4.lo-2', 'Counting sigma bonds', [{
  t: 'sigma bonds when some hydrogens are written in groups', d: 3, need: 'calc',
  spec: mols([molecule([at('C2', 'C', { lonePairs: 0 }), at('O1', 'O', { lonePairs: 2 }), at('C1', 'C', { h: 3, lonePairs: 0 }), at('O2', 'O', { h: 1, lonePairs: 2 })], [bd('C2', 'O1', 2), bd('C2', 'C1'), bd('C2', 'O2')], { layout: { type: 'trigonal_planar', center: 'C2', around: ['O1', 'C1', 'O2'] } })]),
  alt: `A carbon atom in the middle is joined by a double bond to an oxygen atom above it, by a single bond to a carbon written with three hydrogens at the lower left, and by a single bond to an oxygen written with one hydrogen at the lower right. Each oxygen carries two lone pairs. ${ALT_LEWIS}`,
  q: 'The structure of ethanoic acid is shown, with some hydrogen atoms written beside the atom they are bonded to. How many sigma (σ) bonds does one molecule contain?',
  n: '7', ck: ['mol_count', { want: 'sigma_bonds' }],
  h: ['Every single bond is one sigma bond, and a double bond contains exactly one sigma bond.', 'Each hydrogen written beside an atom is joined to it by a bond that is not drawn as a line.'],
  s: 'Read from the figure: three bonds are drawn to the middle carbon — C–C, C–O and C=O — and each contains one sigma bond (3). The group written CH₃ hides three C–H bonds and the group written OH hides one O–H bond (4). Total: 3 + 4 = 7 sigma bonds; the second bond of C=O is a pi bond.',
}]);

GB('29bb74a4.lo-3', 'Counting pi electrons', [{
  t: 'electrons in pi bonds with a double and a triple bond', d: 3, need: 'calc',
  spec: mols([molecule([at('C1', 'C', { x: 0, y: 0, h: 1, lonePairs: 0 }), at('C2', 'C', { x: 1.1, y: 0, lonePairs: 0 }), at('C3', 'C', { x: 2.2, y: 0, h: 1, lonePairs: 0 }), at('O', 'O', { x: 3.3, y: 0, lonePairs: 2 })], [bd('C1', 'C2', 3), bd('C2', 'C3'), bd('C3', 'O', 2)])]),
  alt: `A chain of four atoms: a carbon written with one hydrogen, a carbon with no hydrogen, a carbon written with one hydrogen, and an oxygen with two lone pairs. The first two carbons are joined by a triple bond, the second and third by a single bond, and the third carbon and the oxygen by a double bond. ${ALT_LEWIS}`,
  q: 'The structure of a molecule is shown, with the hydrogen atoms written beside the carbon they are bonded to. How many electrons are in pi (π) bonds in this molecule?',
  n: '6',
  calc: ['2 × mol_count pi_bonds', (c) => 2 * molCount(c, 'pi_bonds')],
  h: ['A double bond is one sigma bond and one pi bond; a triple bond is one sigma bond and two pi bonds.', 'Count the pi bonds, then remember that each bond holds two electrons.'],
  s: 'Read from the figure: the triple bond between the first two carbons contains two pi bonds and the C=O double bond contains one; the single bonds contain none. Three pi bonds hold 3 × 2 = 6 electrons.',
}]);

const CH3 = (id: string, x: number): P => at(id, 'C', { h: 3, lonePairs: 0, x, y: 0 });
/** Three groups in a row, 1.5 bond lengths apart (room for the written hydrogens). */
const row3 = (l: P, c: P, r: P, orders: [number, number]): P => molecule([l, c, r], [bd(l.id as string, c.id as string, orders[0]), bd(c.id as string, r.id as string, orders[1])]);
const ETHER: P = row3(CH3('C1', 0), at('O', 'O', { lonePairs: 2, x: 1.5, y: 0 }), CH3('C2', 3), [1, 1]);
const ETHANOL: P = row3(CH3('C1', 0), at('C2', 'C', { h: 2, lonePairs: 0, x: 1.5, y: 0 }), at('O', 'O', { h: 1, lonePairs: 2, x: 3, y: 0 }), [1, 1]);
const PROPANE: P = row3(CH3('C1', 0), at('C2', 'C', { h: 2, lonePairs: 0, x: 1.5, y: 0 }), CH3('C3', 3), [1, 1]);
const ETHANAL: P = row3(CH3('C1', 0), at('C2', 'C', { h: 1, lonePairs: 0, x: 1.5, y: 0 }), at('O', 'O', { lonePairs: 2, x: 3, y: 0 }), [1, 2]);
/** Three structures one under another, captioned I, II, III. */
const stacked = (list: P[]): Spec => mols(list.map((m, i) => ({ ...m, label: ['I', 'II', 'III'][i], origin: [0, -1.5 * i] })), { arrangement: 'shared' });
const canHBond = (c: Ctx, i: number): boolean => c.num('mol_hbond', { want: 'donors', molecule: i }) > 0 && c.num('mol_hbond', { want: 'acceptors', molecule: i }) > 0;

GB('72c8a996.lo-3', 'Recognising hydrogen bonding from a structure', [{
  t: 'which substances hydrogen-bond with themselves', d: 3, need: 'reason',
  spec: stacked([ETHER, ETHANOL, PROPANE]),
  alt: 'Three condensed structures, one under another, each a row of three groups joined by single bonds. I: a CH₃ group, an oxygen atom with two lone pairs, a CH₃ group. II: a CH₃ group, a CH₂ group, an OH group whose oxygen has two lone pairs. III: a CH₃ group, a CH₂ group, a CH₃ group.',
  q: 'Three substances are shown as condensed structures, with the hydrogen atoms written beside the atom they are bonded to. Which of them can form hydrogen bonds between its own molecules?',
  o: [['II only', 'correct'], ['I and II', 'takes any molecule that contains oxygen to form hydrogen bonds with itself'], ['I only', 'looks for an oxygen with lone pairs and overlooks the need for a hydrogen on it'], ['All three', 'takes any molecule that contains hydrogen to form hydrogen bonds']],
  calc: ['structures with a hydrogen on N, O or F and a lone pair on N, O or F (mol_hbond donors and acceptors)', (c) => { const hit = ['I', 'II', 'III'].filter((_, i) => canHBond(c, i)); return hit.length === 3 ? 'All three' : hit.length === 1 ? `${hit[0]} only` : hit.join(' and '); }],
  h: ['A hydrogen bond needs a hydrogen atom bonded directly to N, O or F, and a lone pair on an N, O or F atom of a neighbouring molecule.', 'Check in each structure which atom every hydrogen is attached to.'],
  s: 'Read from the figure: in I the oxygen has lone pairs but every hydrogen is bonded to carbon, so molecules of I cannot donate a hydrogen bond to one another. In II one hydrogen is bonded to oxygen (the OH group) and the oxygen has lone pairs, so molecules of II hydrogen-bond with each other. III has no N, O or F at all. Only II qualifies.',
}]);

GB('72c8a996.lo-5', 'Boiling points from intermolecular forces', [{
  t: 'highest and lowest boiling point of three similar-sized molecules', d: 3, need: 'reason',
  spec: stacked([PROPANE, ETHANAL, ETHANOL]),
  alt: 'Three condensed structures, one under another, each a row of three groups. I: a CH₃ group, a CH₂ group, a CH₃ group, joined by single bonds. II: a CH₃ group, a CH group and an oxygen atom with two lone pairs, the oxygen joined by a double bond. III: a CH₃ group, a CH₂ group and an OH group whose oxygen has two lone pairs, joined by single bonds.',
  q: 'Three substances of similar molar mass are shown as condensed structures, with the hydrogen atoms written beside the atom they are bonded to. Which has the highest boiling point and which the lowest?',
  o: [['Highest III; lowest I', 'correct'], ['Highest II; lowest I', 'ranks the dipole of a C=O group above hydrogen bonding'], ['Highest III; lowest II', 'takes the molecule with the fewest hydrogen atoms to have the weakest forces'], ['Highest I; lowest III', 'ranks by the number of hydrogen atoms']],
  calc: ['hydrogen bonding (mol_hbond) > a polar C=O group with no O–H > neither (formula without oxygen, mol_formula)', (c) => { const names = ['I', 'II', 'III']; const score = names.map((_, i) => (canHBond(c, i) ? 2 : /O/.test(c.txt('mol_formula', { molecule: i })) ? 1 : 0)); if (new Set(score).size !== 3) throw new Error('scores tie'); return `Highest ${names[score.indexOf(2)]}; lowest ${names[score.indexOf(0)]}`; }],
  h: ['With similar molar masses, the dispersion forces are similar; look for the strongest other force each molecule can use.', 'Hydrogen bonding is stronger than ordinary dipole–dipole attraction, which is stronger than dispersion forces alone.'],
  s: 'Read from the figure: I (propane) has only C–C and C–H bonds, so it is nonpolar and has dispersion forces only. II (ethanal) has a polar C=O group but no hydrogen on oxygen: dipole–dipole forces. III (ethanol) has an O–H group and can hydrogen-bond. The stronger the forces, the higher the boiling point: III is highest (78 °C), I is lowest (−42 °C), with II between (20 °C).',
}]);

// ── AP Biology (batch-3 kinds on ordinary objectives) ───────────────────────

const WATER = (origin: [number, number]): P => molecule([at('O', 'O', { lonePairs: 2 }), at('H1', 'H'), at('H2', 'H')], [bd('O', 'H1'), bd('O', 'H2')], { layout: { type: 'bent', center: 'O', around: ['H1', 'H2'] }, origin });
const HB_DIR: [number, number] = [2.05 * Math.cos(deg(217.75)), 2.05 * Math.sin(deg(217.75))];

GB('b35bce28.lo-2', 'Hydrogen bonds between water molecules', [{
  t: 'how many more hydrogen bonds a molecule can form', d: 3, need: 'reason',
  spec: mols([WATER([0, 0]), WATER(HB_DIR), WATER([-HB_DIR[0], -HB_DIR[1]])], { arrangement: 'shared', hbonds: [{ from: { mol: 0, atom: 'H1' }, to: { mol: 1, atom: 'O' } }, { from: { mol: 2, atom: 'H1' }, to: { mol: 0, atom: 'O' } }] }),
  alt: 'Three water molecules in a diagonal row, each an oxygen atom with two lone pairs joined to two hydrogen atoms. A dotted line joins a hydrogen of the middle molecule to the oxygen of the lower-left molecule, and another joins a hydrogen of the upper-right molecule to the oxygen of the middle molecule.',
  q: 'The diagram shows three water molecules; each dotted line is a hydrogen bond. How many more hydrogen bonds could the middle molecule form with other water molecules, in addition to the two shown?',
  n: '2',
  calc: ['hydrogens on O (mol_hbond donors) + lone pairs on O (mol_count) of the middle molecule − the dotted lines that touch it (spec)', (c) => c.num('mol_hbond', { want: 'donors', molecule: 0 }) + molCount(c, 'lone_pairs', { atom: 'O', molecule: 0 }) - arr(c.p.hbonds).filter((b) => (b.from as P).mol === 0 || (b.to as P).mol === 0).length],
  h: ['Each hydrogen atom of a water molecule can take part in one hydrogen bond, and so can each lone pair on its oxygen.', 'See which hydrogen atoms and which lone pairs of the middle molecule are already in use.'],
  s: 'Read from the figure: the middle molecule has two hydrogen atoms and two lone pairs on its oxygen, so it can form up to four hydrogen bonds. One of its hydrogens is already bonded to the oxygen of a neighbour, and one of its lone pairs already accepts a hydrogen from another neighbour. One hydrogen and one lone pair are still free: 2 more hydrogen bonds.',
}]);

GB('d36f1900.lo-8', 'Passive or active: reading gradient and energy', [{
  t: 'classify two solutes crossing one membrane', d: 3, need: 'reason',
  spec: bio('membrane', { proteins: [{ type: 'channel' }, { type: 'pump' }], solutes: [{ outside: 10, inside: 3, through: 0, arrow: 'in', name: 'solute X' }, { outside: 3, inside: 10, through: 1, arrow: 'in', name: 'solute Y' }] }),
  alt: 'A membrane with two proteins spanning it and two kinds of solute particle scattered on both sides in unequal numbers; a key names them solute X and solute Y. An arrow runs through each protein, pointing from the outside of the cell to the inside. The letters ATP stand beside the second protein.',
  q: 'The diagram shows two solutes, X and Y, crossing a cell membrane; the number of particles drawn on each side shows the concentration there. How is each solute being transported?',
  o: [['X: passive; Y: active', 'correct'], ['X: active; Y: passive', 'takes movement toward the lower concentration to need energy'], ['X: passive; Y: passive', 'takes any movement through a protein to be facilitated diffusion'], ['X: active; Y: active', 'takes any movement through a protein to need energy']],
  calc: ['membrane_transport (as active or passive) of each solute', (c) => ['X', 'Y'].map((n, i) => `${n}: ${c.txt('membrane_transport', { solute: i, as: 'active_or_passive' })}`).join('; ')],
  h: ['For each solute, compare the number of particles on the two sides with the direction of its arrow.', 'Movement down a concentration gradient needs no energy; movement against one needs an energy source such as ATP.'],
  s: 'Read from the figure: solute X is more concentrated outside (10 particles against 3) and moves in through a channel, down its gradient: passive (facilitated diffusion). Solute Y is more concentrated inside (10 against 3) and is still moved in, against its gradient, by a protein that uses ATP: active transport.',
}]);

GB('d36f1900.lo-3', 'Facilitated diffusion at equilibrium', [{
  t: 'net movement when the concentrations are equal', d: 3, need: 'reason',
  spec: bio('membrane', { proteins: [{ type: 'channel' }], solutes: [{ outside: 7, inside: 7, name: 'solute Z' }] }),
  alt: 'A membrane with one channel protein spanning it and one kind of solute particle, named solute Z in a key, scattered on both sides of the membrane. No arrow is drawn.',
  q: 'The diagram shows a solute, Z, on the two sides of a cell membrane that contains an open channel protein for it; the number of particles drawn on each side shows the concentration there. What happens to solute Z at the channel?',
  o: [['No net movement; particles still cross both ways', 'correct'], ['Net movement into the cell', 'expects a channel to carry its solute inward whatever the concentrations'], ['Net movement out of the cell', 'miscounts the particles on the two sides'], ['No particle crosses the membrane at all', 'takes no net movement to mean no movement']],
  holds: ['membrane_net_movement of the solute; the channel is open (stem), so particles keep crossing in both directions', [
    (c) => c.txt('membrane_net_movement', { solute: 0 }) === 'no net movement',
    (c) => c.txt('membrane_net_movement', { solute: 0 }) === 'into the cell',
    (c) => c.txt('membrane_net_movement', { solute: 0 }) === 'out of the cell',
    () => false, // the stem says the channel is open: random motion still carries particles through it
  ]],
  h: ['Count the particles on each side of the membrane.', 'Diffusion is the result of random motion: think about what individual particles do when there is no concentration difference.'],
  s: 'Read from the figure: there are 7 particles of Z on each side, so there is no concentration gradient. Particles keep moving at random and pass through the open channel in both directions at equal rates, so there is no NET movement — a dynamic equilibrium, not a standstill.',
}]);

GB('d36f1900.lo-7', 'With or against the gradient: checking a label', [{
  t: 'find the evidence against a wrong label', d: 4, need: 'reason',
  spec: bio('membrane', { proteins: [{ type: 'pump' }], solutes: [{ outside: 12, inside: 4, through: 0, arrow: 'out', name: 'sodium ions' }] }),
  alt: 'A membrane with one protein spanning it, the letters ATP beside it, and one kind of particle, named sodium ions in a key, scattered on both sides in unequal numbers. An arrow runs through the protein, pointing from the inside of the cell to the outside.',
  q: 'A student labels the transport of sodium ions in the diagram shown as facilitated diffusion; the number of ions drawn on each side shows the concentration there. Which observation from the diagram shows that the label is wrong?',
  o: [['The ions move toward the side where they are more concentrated', 'correct'], ['The ions cross the membrane through a protein', 'offers a feature that facilitated diffusion shares'], ['The ions move from the inside of the cell to the outside', 'takes the direction relative to the cell to decide the type of transport'], ['The ions are found on both sides of the membrane', 'offers a feature of any solute, however it is transported']],
  holds: ['membrane_transport is active transport: the arrow runs toward the side with more marks (spec)', [
    (c) => c.txt('membrane_transport', { solute: 0 }) === 'active transport' && (arr(c.p.solutes)[0].outside as number) > (arr(c.p.solutes)[0].inside as number) && arr(c.p.solutes)[0].arrow === 'out',
    () => false, // true of the figure, and equally true of facilitated diffusion
    () => false, // true of the figure, but facilitated diffusion can run in either direction
    () => false, // true of the figure, and of every kind of transport
  ]],
  h: ['Facilitated diffusion is passive. What must be true of the direction of a passive movement?', 'Count the ions on each side and compare with the direction of the arrow.'],
  s: 'Read from the figure: there are 12 sodium ions outside the cell and 4 inside, and the arrow points outward, so the ions are being moved toward the side where they are already more concentrated — against their gradient, which takes energy (the pump is marked ATP). Facilitated diffusion can only move a solute down its gradient. Crossing through a protein, the direction relative to the cell and being present on both sides are all consistent with facilitated diffusion.',
}]);

GB('72b3b3de.lo-3', 'The stages of mitosis in order', [{
  t: 'place four drawn cells in sequence', d: 3, need: 'reason',
  spec: bio('division', { n: 2, cells: [{ stage: 'anaphase', label: 'I' }, { stage: 'prophase', label: 'II' }, { stage: 'telophase', label: 'III' }, { stage: 'metaphase', label: 'IV' }] }),
  alt: 'Four schematic cells labelled I to IV with chromosomes drawn as sticks. In one the X-shaped chromosomes are scattered inside a dashed circle; in one they are lined up across the middle on thin lines; in one single sticks are being drawn to the two ends of the cell; in one the cell is pinched in the middle with a group of single sticks at each end.',
  q: 'The four cells shown are in different stages of mitosis and are drawn in no particular order. Which cell shows the stage that comes third in the sequence of mitosis?',
  o: [['Cell I', 'correct'], ['Cell II', 'takes the cell with scattered chromosomes for a late stage'], ['Cell III', 'places the pinched cell before the separation of the chromatids'], ['Cell IV', 'places the lining-up of the chromosomes after their separation']],
  calc: ['division_stage of each cell, ordered prophase, metaphase, anaphase, telophase: the third', (c) => { const order = ['prophase', 'metaphase', 'anaphase', 'telophase']; const ls = ['I', 'II', 'III', 'IV']; return `Cell ${ls.find((l) => c.txt('division_stage', { cell: l }) === order[2])}`; }],
  h: ['Name the stage of each cell from what its chromosomes are doing.', 'The order is prophase, metaphase, anaphase, telophase.'],
  s: 'Read from the figure: in II the replicated chromosomes are condensed and scattered inside the nucleus (prophase); in IV they are lined up across the middle of the cell on the spindle (metaphase); in I the sister chromatids have separated and are moving to opposite ends (anaphase); in III two groups of chromosomes sit in new nuclei and the cell is pinching in two (telophase). The third stage, anaphase, is cell I.',
}]);

GB('e6cb021e.lo-4', 'Chromosome numbers through mitosis and meiosis', [
  {
    t: 'work back from an anaphase cell to the parent cell', d: 3, need: 'calc',
    spec: bio('division', { n: 2, cells: [{ stage: 'anaphase', label: null }] }),
    alt: 'One schematic cell with chromosomes drawn as single bent sticks: two equal groups of sticks are being drawn along thin lines toward the two ends of the cell.',
    q: 'The cell shown is in anaphase of mitosis. How many chromosomes did this cell have during G1, before its DNA was replicated?',
    n: '4',
    calc: ['division_count chromosomes ÷ 2 (in anaphase every separated chromatid counts as a chromosome)', (c) => c.num('division_count', { cell: 0, want: 'chromosomes' }) / 2],
    h: ['Count the chromosomes moving toward ONE end of the cell: that is the set one daughter cell will receive.', 'Mitosis gives each daughter cell the same number of chromosomes as the parent cell had.'],
    s: 'Read from the figure: four single chromosomes are moving to each end of the cell, eight in all. Each daughter cell will receive four, and mitosis keeps the chromosome number unchanged, so the parent cell had 4 chromosomes in G1 (2n = 4). The count is doubled to 8 only for the moment between the separation of the chromatids and the division of the cell.',
  },
  {
    t: 'chromosome number of the gametes from a metaphase I cell', d: 3, need: 'calc',
    spec: bio('division', { n: 3, cells: [{ stage: 'metaphase_I', label: null }] }),
    alt: 'One schematic cell with X-shaped chromosomes lying side by side in matched pairs across the middle of the cell, one of each pair solid and one hollow, each chromosome joined by a thin line to the nearer end of the cell.',
    q: 'The cell shown is in metaphase I of meiosis. How many chromosomes will each of the four cells produced at the end of meiosis contain?',
    n: '3',
    calc: ['division_count chromosomes ÷ 2 (meiosis halves the chromosome number)', (c) => c.num('division_count', { cell: 0, want: 'chromosomes' }) / 2],
    h: ['Count the chromosomes in the cell: each X is one replicated chromosome.', 'Meiosis I separates the two chromosomes of each matched pair, and meiosis II separates the chromatids, so each final cell gets one chromosome from each pair.'],
    s: 'Read from the figure: the cell holds six replicated chromosomes arranged as three matched (homologous) pairs, so 2n = 6. Meiosis I sends one chromosome of each pair to each cell and meiosis II separates the sister chromatids, so every one of the four final cells receives one chromosome from each pair: 3 chromosomes (n = 3).',
  },
]);

GB('98af8b31.lo-5', 'Independent assortment and the number of combinations', [{
  t: 'number of chromosome combinations in the gametes', d: 3, need: 'calc',
  spec: bio('division', { n: 2, cells: [{ stage: 'metaphase_I', label: null }] }),
  alt: 'One schematic cell with X-shaped chromosomes lying side by side in matched pairs across the middle of the cell, one of each pair solid and one hollow, each chromosome joined by a thin line to the nearer end of the cell.',
  q: 'The cell shown is in metaphase I of meiosis. Considering independent assortment only, with no crossing over, how many genetically different kinds of gamete can cells of this organism produce?',
  n: '4',
  calc: ['2 to the power of the number of homologous pairs (division_count chromosomes ÷ 2)', (c) => 2 ** (c.num('division_count', { cell: 0, want: 'chromosomes' }) / 2)],
  h: ['Count the matched pairs of chromosomes lined up in the cell.', 'Each pair can face either way, independently of the others, so the possibilities multiply.'],
  s: 'Read from the figure: two matched pairs of chromosomes are lined up across the middle of the cell, so n = 2. Each pair can line up in either of two orientations, independently of the other pair, so the number of different combinations of chromosomes in the gametes is 2 × 2 = 2² = 4.',
}]);

GB('03158f07.lo-3', 'Chemiosmosis: the direction of proton flow', [{
  t: 'direction of H⁺ flow through ATP synthase from the gradient', d: 3, need: 'reason',
  spec: bio('compartments', { organelle: 'mitochondrion', spaces: [{ id: 'matrix', label: 'P', ions: 4 }, { id: 'intermembrane_space', label: 'Q', ions: 18 }], synthase: true }),
  alt: 'A box diagram of a mitochondrion: an inner space labelled P inside an outer ring-shaped space labelled Q, with dots scattered in both in unequal numbers and a key saying a dot is one H⁺ ion. A knob on a stalk sits in the wall between the two spaces. No arrow is drawn.',
  q: 'The diagram shows a mitochondrion with its two spaces labelled P and Q; each dot is an H⁺ ion. Through ATP synthase, in which direction do H⁺ ions flow, and is that down or against their concentration gradient?',
  o: [['From Q to P, down the gradient', 'correct'], ['From P to Q, down the gradient', 'misreads which space holds more H⁺ ions'], ['From Q to P, against the gradient', 'takes a flow that drives ATP synthesis to need energy itself'], ['From P to Q, against the gradient', 'describes the pumping by the electron transport chain']],
  calc: ['compartment_gradient flow_from and flow_to; a flow from the higher to the lower concentration is down the gradient', (c) => `From ${c.txt('compartment_gradient', { want: 'flow_from' })} to ${c.txt('compartment_gradient', { want: 'flow_to' })}, down the gradient`],
  h: ['Compare the number of H⁺ ions drawn in the two spaces.', 'ATP synthase lets H⁺ ions diffuse through it; the electron transport chain is what pumps them the other way.'],
  s: 'Read from the figure: space Q, the intermembrane space, holds many more H⁺ ions (18) than space P, the matrix (4). The electron transport chain built up this gradient by pumping; ATP synthase lets the ions flow back from Q to P, down their concentration gradient, and uses the energy released to make ATP.',
}]);

GB('6422897a.lo-6', 'The proton gradient across the thylakoid membrane', [{
  t: 'ratio of H⁺ concentrations from two pH values', d: 3, need: 'calc',
  spec: bio('compartments', { organelle: 'chloroplast', spaces: [{ id: 'stroma', pH: 8 }, { id: 'thylakoid_lumen', pH: 5 }], synthase: true }),
  alt: 'A box diagram of a chloroplast: an inner space named thylakoid lumen inside an outer space named stroma, each with its pH printed in it. A knob on a stalk sits in the wall between the two spaces, the knob on the stroma side.',
  q: 'The diagram shows the pH of two spaces of a chloroplast in bright light. How many times greater is the H⁺ concentration in the thylakoid lumen than in the stroma?',
  n: '1000',
  calc: ['10 to the power of the pH difference (spec), with compartment_gradient confirming that the lumen is the more acidic space', (c) => { if (c.txt('compartment_gradient', { want: 'higher', as: 'name' }) !== 'thylakoid lumen') throw new Error('the lumen is not the more acidic space'); const ph = Object.fromEntries(arr(c.p.spaces).map((s) => [s.id as string, s.pH as number])); return 10 ** (ph.stroma - ph.thylakoid_lumen); }],
  h: ['pH is a logarithmic scale: a difference of one pH unit is a tenfold difference in H⁺ concentration.', 'Find the difference between the two pH values, and remember that the lower pH is the higher concentration.'],
  s: 'Read from the figure: the thylakoid lumen is at pH 5 and the stroma at pH 8, a difference of 3 pH units. Each unit is a factor of 10 in H⁺ concentration, so the lumen has 10³ = 1000 times the H⁺ concentration of the stroma — the gradient that drives ATP synthase.',
}]);

// ── the eleven, re-decided ──────────────────────────────────────────────────

/** Part-A objectives that the batch-3 kinds carry only in part: what the items cover and what they do not. */
const MAPPING_NOTES: Record<string, string> = {
  '252560d4.lo-7': 'PARTLY carried: the items combine a PCR with its gel (genotype by product length, a restriction digest of a PCR product, a paternity comparison) and ask what a gel cannot show and sequencing would; no item reads a sequencing read-out — gel_electrophoresis draws no chromatogram or base sequence',
  '4354050b.lo-1': 'the student reads and completes drawn Lewis structures (counting electrons, finding a missing bond order or the central atom, the charge of an ion); nothing is drawn by the student — the card has no drawing input',
  '87ef2ba6.lo-1': 'the student reads and completes drawn Lewis structures; nothing is drawn by the student — the card has no drawing input',
  '87ef2ba6.lo-4': 'resonance structures are identified, completed and averaged (bond order, formal charge) from drawn contributors; none is drawn by the student',
  'f9ff0f1c.lo-5': 'drawn on SCHEMATIC maps (rectangular land masses on a grid, a scale bar, hatching for a value) — no real coastline or real species range is shown',
  '73571e58.lo-2': 'field direction round a bar magnet from the pole letters, the arrowed field lines and compass needles; the lesson\'s "thumb toward the north pole" rule is applied to the magnet as drawn',
};
/** Part-A objectives that still cannot be carried (none expected). */
const NEEDS: Record<string, { kind: string; note: string }> = {};

// ── seeded shuffle ──────────────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled<T>(items: T[], seedText: string): T[] {
  const rnd = mulberry32(parseInt(simpleHash(seedText), 36));
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── objectives: the lesson packs and the 105 list ───────────────────────────

interface Objective { loId: string; subject: string; skill: string; description: string; pack: string; figureItems: number }
function loadObjectives(): Map<string, Objective> {
  const out = new Map<string, Objective>();
  for (const f of fs.readdirSync(PACKS).filter((x) => x.endsWith('.json')).sort()) {
    const pack = JSON.parse(fs.readFileSync(path.join(PACKS, f), 'utf8')) as { subject: string; skill: string; objectives: Array<{ objectiveLoId: string; description: string; existingItems?: Array<{ hasFigure?: boolean }> }> };
    for (const o of pack.objectives) out.set(o.objectiveLoId, { loId: o.objectiveLoId, subject: pack.subject, skill: pack.skill, description: o.description, pack: f.replace('.json', ''), figureItems: (o.existingItems ?? []).filter((x) => x.hasFigure).length });
  }
  return out;
}
const shortOf = (loId: string): string => loId.replace(/^gen-([0-9a-f]{8})-[0-9a-f-]+\.(lo-\d+)$/, '$1.$2');

// ── build ───────────────────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  const outArg = argv.indexOf('--out');
  const outDir = outArg >= 0 ? argv[outArg + 1] : DEFAULT_OUT;
  const checkOnly = argv.includes('--check');
  const wip = argv.includes('--wip');
  const objectives = loadObjectives();
  const byShort = new Map([...objectives.values()].map((o) => [shortOf(o.loId), o]));
  const list105 = JSON.parse(fs.readFileSync(OBJECTIVES_105, 'utf8')) as Array<{ subject: string; title: string; objectiveLoId: string; description: string; why: string }>;
  const listIds = new Set(list105.map((o) => o.objectiveLoId));
  type Row = { id: string; loId: string; difficulty: number; problemText: string; figure: { spec: Spec } };
  const held = [ROWS_60, ROWS_B1, ROWS_B2].flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')) as Row[]);
  const heldByLo = new Map<string, Row[]>();
  for (const r of held) heldByLo.set(r.loId, [...(heldByLo.get(r.loId) ?? []), r]);
  const mappingB2 = JSON.parse(fs.readFileSync(path.join(BATCH2, 'mapping.json'), 'utf8')) as Array<Record<string, unknown> & { loId: string; status: string }>;
  const eleven = new Set(mappingB2.filter((m) => m.status === 'needs-kind').map((m) => m.loId));

  if (argv.includes('--list-objectives')) {
    const per = new Map<string, Item[]>();
    for (const a of ITEMS) per.set(a.lo, [...(per.get(a.lo) ?? []), a]);
    for (const [lo, items] of per) {
      const o = byShort.get(lo);
      console.log(`${o?.pack ?? '???'} ${lo} ${items[0].part} ${items.length} | ${o?.subject} | ${o?.skill} | ${o?.description}`);
      for (const a of items) console.log(`      - [${a.spec.type}, ${a.need}, d${a.d}] ${a.t}`);
    }
    console.log(`${ITEMS.length} items on ${per.size} objectives`);
    return;
  }

  const problems: string[] = [];
  const notes: string[] = [];
  const now = new Date().toISOString();
  const rows: Array<Record<string, unknown>> = [];
  const proofs: Array<Record<string, unknown>> = [];
  const cards: string[] = [];
  const pngs: Array<{ id: string; svg: string }> = [];
  const perLo = new Map<string, string[]>();
  const meta: Array<{ id: string; lo: Objective; item: Item; format: string; proof: string }> = [];

  for (const [n, a] of ITEMS.entries()) {
    const obj = byShort.get(a.lo);
    const tag = `#${n + 1} ${a.lo} (${a.t})`;
    if (!obj) { problems.push(`${tag}: no objective ${a.lo} in the lesson packs`); continue; }
    if (a.part === 'A' && !eleven.has(obj.loId)) problems.push(`${tag}: a Part-A item on an objective that is not one of the eleven`);
    if (a.part === 'B' && eleven.has(obj.loId)) problems.push(`${tag}: a Part-B item on one of the eleven`);
    if (a.part === 'B' && a.d < 3) problems.push(`${tag}: a Part-B item is level 3 or 4`);
    const kinds = perLo.get(obj.loId) ?? [];
    if (kinds.includes(a.t)) problems.push(`${tag}: task kind repeated within the objective`);
    kinds.push(a.t);
    perLo.set(obj.loId, kinds);
    const id = itemIdOf(obj.loId, a.q);
    const bad = (m: string) => problems.push(`${tag}: ${m}`);

    try {
      const c = new Ctx(a.spec);
      const responseFormat: 'mcq' | 'numeric' = a.o ? 'mcq' : 'numeric';
      if (!a.o === !a.n) bad('give options or a number, not both / neither');
      if ([a.ck, a.calc, a.holds].filter(Boolean).length !== 1) bad('give exactly one of ck / calc / holds');
      // A harder item is drawn on a NEW figure: not the spec of any held item of the objective.
      for (const r of heldByLo.get(obj.loId) ?? []) if (JSON.stringify(r.figure.spec) === JSON.stringify(a.spec)) bad(`the figure is the same as that of the held item ${r.id}`);
      // The cases the renderer's author judged not good enough.
      const fp = a.spec.params;
      if (a.spec.type === 'field_diagram' && fp.variant === 'point_charges' && (fp.charges as unknown[]).length >= 3) bad('three point charges: the line counts are not reliable enough to ask about');
      if (a.spec.type === 'solid_3d' && fp.solid === 'composite' && fp.bottom === 'prism') bad('the prism + pyramid composite is not drawn well enough');
      let answer = '';
      let choices: string[] = [];
      let rationales: string[] = [];
      let keyText = '';
      if (a.o) {
        if (a.o.length !== 4 || a.o[0][1] !== 'correct') bad('needs four options, the correct one first');
        const order = shuffled(a.o, a.q);
        choices = order.map((x) => x[0]);
        rationales = order.map((x) => x[1]);
        answer = 'ABCD'[order.indexOf(a.o[0])];
        keyText = a.o[0][0];
        if (new Set(choices.map((x) => canonText(x))).size !== 4) bad('options are not four distinct texts');
        // The product compares option texts case-insensitively.
        if (new Set(choices.map((x) => canonText(x).toLowerCase())).size !== 4) bad('two options differ only by letter case');
        const lens = choices.map((x) => x.length);
        if (Math.max(...lens) > Math.min(...lens) * 2 + 6) notes.push(`${tag}: option lengths ${lens.join('/')}`);
        if (lens.indexOf(Math.max(...lens)) === 'ABCD'.indexOf(answer) && Math.max(...lens) > [...lens].sort((x, y) => y - x)[1] * 1.35 + 3) bad(`the correct option is the longest by far (${lens.join('/')})`);
        const clash = figureLetterClash(a.spec, choices);
        if (clash) bad(`option letters — ${clash.message}`);
      } else if (a.n !== undefined) {
        answer = a.n;
        keyText = a.n;
        const key = parseNumericKey(answer);
        if (!key) bad(`the numeric key "${answer}" is not a plain number under the product's rule`);
      }

      // ── the proof ────────────────────────────────────────────────────────
      let proofKind: 'checker' | 'checker+code' | 'code' = 'code';
      let proofHow = '';
      let proofResult = '';
      let derivation = { checker: 'none', args: {} as P };
      if (a.ck) {
        derivation = { checker: a.ck[0], args: a.ck[1] };
        const d = runChecker(a.spec, derivation);
        proofKind = 'checker';
        proofHow = `figure-core checker ${a.ck[0]} ${JSON.stringify(a.ck[1])}`;
        proofResult = derivedText(d);
        // examineFigureItem (below) compares the result with the stored key.
      } else if (a.calc) {
        const v = a.calc[1](c);
        proofHow = a.calc[0];
        proofResult = String(v);
        if (a.o) {
          const hit = a.o.map((x) => canonText(x[0]) === canonText(String(v)));
          if (!(hit[0] && hit.slice(1).every((x) => !x))) bad(`the key does not follow from the spec — computed "${v}", options ${JSON.stringify(a.o.map((x) => x[0]))}`);
        } else {
          const stated = Number(answer);
          const places = (answer.split('.')[1] ?? '').length;
          const num = Number(v);
          const ok = Number.isFinite(num) && (near(num, stated) || (places > 0 && Math.abs(num - stated) <= 0.5 * 10 ** -places + 1e-9));
          if (!ok) bad(`stated key ${answer}, computed ${v}`);
        }
      } else if (a.holds) {
        if (!a.o || a.holds[1].length !== 4) bad('holds needs one test per option');
        const truth = a.holds[1].map((f) => f(c));
        proofHow = a.holds[0];
        proofResult = `options true of the figure, as written: [${truth.map((x, i) => (x ? a.o![i][0] : '')).filter(Boolean).join(' | ')}]`;
        if (!(truth[0] && truth.slice(1).every((x) => !x))) bad(`the key does not follow from the spec — truth of the options as written: ${JSON.stringify(truth)}`);
      }
      if (!a.ck && c.used.length) proofKind = 'checker+code';

      // ── the alt text: what the picture prints, then the item's specifics ──
      const base = describeForAlt(a.spec, { hide: a.hide ?? [] });
      const alt = `${base} ${a.alt}`.trim();
      if (a.alt.length < 40) bad('the alt specifics are too short (name the components / lanes / labels shown)');

      // ── the job's rule checks ────────────────────────────────────────────
      const figureItem = {
        objectiveLoId: obj.loId, responseFormat, problemText: a.q, answer, choices, hints: a.h, solutionText: a.s, difficulty: a.d,
        covers: obj.description, taskType: a.t, distractorRationales: rationales, figureSpec: a.spec, alt, derivation,
      } as unknown as FigureItem;
      const exam = examineFigureItem(figureItem);
      for (const d of exam.defects) bad(`rule check — ${d}`);
      if (a.ck && exam.derivation.status !== 'derived') bad(`checker status ${exam.derivation.status}: ${exam.derivation.detail}`);
      for (const d of contentDefects(figureItem, { hasFigure: true } as never)) bad(`content check — ${d}`);
      const keyCanon = canonText(keyText).toLowerCase();
      for (const h of a.h) if (keyText.length > 2 && canonText(h).toLowerCase().includes(keyCanon)) bad('a hint contains the answer');
      if (/\\[a-zA-Z]|\$/.test([a.q, a.s, ...a.h, ...choices].join(' '))) bad('LaTeX in the text');
      if (a.h.length !== 2) bad('needs two hints');
      if (a.s.length < 60) bad('the solution is too short to name what is read from the figure');

      const figure = buildPracticeFigure(a.spec, alt);
      const safety = validateFigureSvg(figure.svg);
      if (!safety.ok) bad(`svg safety — ${JSON.stringify(safety.issues)}`);
      if (figure.svg.length > MAX_FIGURE_SVG_CHARS) bad(`svg is ${figure.svg.length} chars`);
      const warnings = checkFigureLegibility(a.spec);
      if (warnings.length) bad(`legibility — ${warnings.map((w) => `${w.code}: ${w.message}`).join('; ')}`);
      const figureText = describeFigure(a.spec).text;

      rows.push({
        id, topic: obj.skill, topicId: obj.skill, loId: obj.loId, subtopic: a.sub, difficulty: a.d,
        problemText: a.q, answer, solutionText: a.s, hints: a.h, responseFormat, choices,
        figure,
        source: { name: 'Evelyn (practice-extend offline job, figure track — hand-authored batch-3 figures)' }, license: 'internal-original', verifiedAt: now,
        verifierModel: 'none — key proven from the figure spec in code + visual read',
      });
      proofs.push({ id, loId: obj.loId, part: a.part, kind: a.spec.type, format: responseFormat, need: a.need, difficulty: a.d, key: answer, keyText, proof: proofKind, how: proofHow, result: proofResult, checkers: a.ck ? [{ checker: a.ck[0], args: a.ck[1], result: proofResult }] : c.used });
      meta.push({ id, lo: obj, item: a, format: responseFormat, proof: proofKind });
      pngs.push({ id, svg: figure.svg });
      cards.push(`<section id="${esc(id)}"><div class="fig">${figure.svg}</div><div class="q"><p class="meta">#${n + 1} · ${esc(id)}<br>Part ${a.part} · ${esc(obj.subject)} · ${esc(obj.skill)}<br>${esc(obj.description)}<br>task: ${esc(a.t)} · level ${a.d} · ${responseFormat} · ${esc(a.spec.type)} · asks: ${a.need}</p><p class="stem">${esc(a.q)}</p>${
        choices.length ? `<ol type="A">${choices.map((x, i) => `<li class="${'ABCD'[i] === answer ? 'key' : ''}">${esc(x)}${'ABCD'[i] === answer ? ' ✓' : ` <span class="why">— ${esc(rationales[i])}</span>`}</li>`).join('')}</ol>` : ''
      }<p><b>Key:</b> ${esc(answer)}${choices.length ? ` — ${esc(keyText)}` : ''}</p><p><b>Hints:</b> ${a.h.map(esc).join(' / ')}</p><p><b>Solution:</b> ${esc(a.s)}</p><p class="der"><b>Proof (${proofKind}):</b> ${esc(proofHow)} → ${esc(proofResult)}</p><p class="der"><b>Alt:</b> ${esc(alt)}</p><details><summary>spec · figure as text</summary><pre>${esc(JSON.stringify(a.spec, null, 1))}\n\n${esc(figureText)}</pre></details></div></section>`);
    } catch (e) {
      bad(`threw — ${(e as Error).message}`);
    }
  }

  // ── caps, ids, mapping ────────────────────────────────────────────────────
  const ids = rows.map((r) => r.id as string);
  if (new Set(ids).size !== ids.length) problems.push(`ids are not unique: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
  const taken = new Set(held.map((r) => r.id));
  for (const r of rows) {
    if (!/^practice-gen\.gen-[0-9a-f-]+\.lo-\d+\.[0-9a-z]+$/.test(r.id as string) || !(r.id as string).startsWith(`practice-gen.${r.loId}.`)) problems.push(`${r.id}: id is not in the scheme / does not match its loId`);
    if (taken.has(r.id as string)) problems.push(`${r.id}: id already used by an earlier figure row`);
    if (r.responseFormat === 'mcq' && ((r.choices as string[]).length !== 4 || !/^[ABCD]$/.test(r.answer as string))) problems.push(`${r.id}: mcq without four options and a letter`);
  }
  for (const [lo, kinds] of perLo) {
    const mine = meta.filter((m) => m.lo.loId === lo);
    const cap = eleven.has(lo) ? 4 : 2;
    if (kinds.length > cap) problems.push(`${shortOf(lo)}: ${kinds.length} items, cap ${cap}`);
    if (eleven.has(lo) && mine.filter((m) => m.item.d >= 3).length < 2 && !wip) problems.push(`${shortOf(lo)}: fewer than two items at level 3–4`);
  }
  // Batch 2's mapping, with the eleven needs-kind objectives re-decided.
  const mapping = mappingB2.map((o) => {
    const short = shortOf(o.loId);
    const mine = meta.filter((m) => m.lo.loId === o.loId && m.item.part === 'A');
    if (o.status !== 'needs-kind') return o;
    const base = { loId: o.loId, subject: o.subject, skill: o.skill, objective: o.objective };
    if (mine.length) {
      if (NEEDS[short]) problems.push(`${short}: has items and is also listed as needing a kind`);
      return { ...base, status: 'now-authorable', kind: [...new Set(mine.map((m) => (m.item.spec.type === 'field_diagram' ? 'field_diagram (bar_magnet)' : m.item.spec.params.variant === 'amplification_plot' ? 'gel_electrophoresis (amplification_plot)' : m.item.spec.type)))].join(', '), items: mine.length, levels: mine.map((m) => m.item.d).sort().join(','), tasks: mine.map((m) => m.item.t), ...(MAPPING_NOTES[short] ? { note: MAPPING_NOTES[short] } : {}) };
    }
    if (!NEEDS[short]) { if (!wip) problems.push(`${short} (${o.skill}: ${o.objective}): neither items nor a missing kind`); return { ...base, status: 'unmapped' }; }
    return { ...base, status: 'needs-kind', kind: NEEDS[short].kind, note: NEEDS[short].note };
  }) as Array<Record<string, unknown> & { loId: string; status: string }>;

  const count = <T,>(xs: T[], key: (x: T) => string): Record<string, number> => xs.reduce((t, x) => ({ ...t, [key(x)]: (t[key(x)] ?? 0) + 1 }), {} as Record<string, number>);
  const kindOf = (m: { item: Item }): string => (m.item.spec.type === 'field_diagram' && m.item.spec.params.variant === 'bar_magnet' ? 'field_diagram (bar_magnet)' : m.item.spec.type);
  const partA = meta.filter((m) => m.item.part === 'A');
  const partB = meta.filter((m) => m.item.part === 'B');
  /** Part B: what the objective held before, and what it gains. */
  const upgraded = [...new Set(partB.map((m) => m.lo.loId))].map((lo) => {
    const mine = partB.filter((m) => m.lo.loId === lo);
    const before = heldByLo.get(lo) ?? [];
    return { loId: lo, subject: mine[0].lo.subject, skill: mine[0].lo.skill, objective: mine[0].lo.description, heldFigureItems: before.length, heldLevels: before.map((r) => r.difficulty).sort().join(','), heldKinds: [...new Set(before.map((r) => r.figure.spec.type))].join(', '), newItems: mine.length, newLevels: mine.map((m) => m.item.d).sort().join(','), newKinds: [...new Set(mine.map(kindOf))].join(', '), why: before.length ? 'held figure items were all level 1–2 / read-offs' : 'no figure item before: the figure carries the question (batch-3 kind)' };
  });
  for (const u of upgraded) if (u.heldFigureItems > 0 && Math.max(...(heldByLo.get(u.loId) ?? []).map((r) => r.difficulty)) > 2) notes.push(`${shortOf(u.loId)}: already holds a level-3 figure item`);
  const summary = {
    generatedAt: now,
    items: rows.length,
    byPart: { A: partA.length, B: partB.length },
    bySubject: count(meta, (m) => m.lo.subject),
    byKind: count(meta, kindOf),
    byFormat: count(meta, (m) => m.format),
    byProof: count(meta, (m) => m.proof),
    byDifficulty: count(meta, (m) => `level ${m.item.d}`),
    asks: count(meta, (m) => m.item.need),
    partA: {
      objectives: eleven.size,
      objectivesWithItems: new Set(partA.map((m) => m.lo.loId)).size,
      itemsPerObjective: Object.fromEntries([...eleven].map((lo) => [shortOf(lo), { skill: objectives.get(lo)?.skill, objective: objectives.get(lo)?.description, items: partA.filter((m) => m.lo.loId === lo).length, levels: partA.filter((m) => m.lo.loId === lo).map((m) => m.item.d).sort().join(',') }])),
      byDifficulty: count(partA, (m) => `level ${m.item.d}`),
      stillNeedingAKind: mapping.filter((m) => m.status === 'needs-kind').length,
      notes: MAPPING_NOTES,
    },
    partB: {
      objectives: upgraded.length,
      objectivesThatHeldOnlyLevel1or2: upgraded.filter((u) => u.heldFigureItems > 0).length,
      objectivesNewToFigures: upgraded.filter((u) => u.heldFigureItems === 0).length,
      bySubject: count(partB, (m) => m.lo.subject),
      byKind: count(partB, kindOf),
      bySubjectAndKind: count(partB, (m) => `${m.lo.subject} · ${kindOf(m)}`),
      byDifficulty: count(partB, (m) => `level ${m.item.d}`),
    },
    list105: {
      total: list105.length,
      neededAKindBeforeBatch3: eleven.size,
      nowAuthorableInBatch3: mapping.filter((m) => m.status === 'now-authorable' && eleven.has(m.loId)).length,
      coveredAfter: mapping.filter((m) => m.status !== 'needs-kind' && m.status !== 'unmapped').length,
      stillNeedingAKind: mapping.filter((m) => m.status === 'needs-kind').length,
    },
  };
  void listIds;

  console.log(`${ITEMS.length} items declared, ${rows.length} built`);
  console.log(JSON.stringify({ byPart: summary.byPart, bySubject: summary.bySubject, byKind: summary.byKind, byFormat: summary.byFormat, byProof: summary.byProof, byDifficulty: summary.byDifficulty, list105: summary.list105 }, null, 1));
  if (notes.length) console.log(`notes:\n  ${notes.join('\n  ')}`);
  if (problems.length && !wip) {
    console.error(`\n${problems.length} PROBLEM(S) — nothing written:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  if (problems.length) console.error(`\n${problems.length} PROBLEM(S) (work in progress — files written all the same):\n  ${problems.join('\n  ')}`);
  if (checkOnly) return;

  fs.mkdirSync(path.join(outDir, 'png'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'final'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'sheets'), { recursive: true });
  for (const d of ['png', 'sheets']) for (const f of fs.readdirSync(path.join(outDir, d))) if (f.endsWith('.png')) fs.unlinkSync(path.join(outDir, d, f));
  fs.writeFileSync(path.join(outDir, 'final', `figure-rows-batch3${wip ? '-wip' : ''}.json`), JSON.stringify(rows, null, 2) + '\n');
  if (!wip) {
    fs.writeFileSync(path.join(outDir, 'final', 'audited-figure-ids.json'), JSON.stringify(ids) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'key-proofs.json'), JSON.stringify(proofs, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'part-b-upgraded-objectives.json'), JSON.stringify(upgraded, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify(mapping, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
    if (fs.existsSync(path.join(outDir, 'final', 'figure-rows-batch3-wip.json'))) fs.unlinkSync(path.join(outDir, 'final', 'figure-rows-batch3-wip.json'));
  }
  fs.writeFileSync(path.join(outDir, 'gallery.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Batch-3 figure practice items — gallery</title><style>
body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}
h1{font-size:20px}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}
.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block;border:1px dashed #bbb}.q{flex:1;min-width:300px}
.meta{font-size:12px;color:#666}.stem{font-weight:600}li.key{font-weight:700;color:#0a6b2d}.why{color:#777;font-weight:400;font-size:13px}.der{font-size:13px;color:#444}pre{font-size:12px;white-space:pre-wrap;background:#f8f8f6;padding:8px}
</style></head><body><h1>Batch-3 figure practice items — ${rows.length} items (Part A ${partA.length}, Part B ${partB.length})</h1><p>Each figure is shown at 340 px, as on the student's card. The key (✓) is proven from the figure spec in code; the proof line says how. No model was used. Generated ${esc(now)}.</p>${cards.join('\n')}</body></html>\n`);

  const mod = (await import('sharp')) as unknown as { default?: unknown };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sharp = (mod.default ?? mod) as any;
  for (const { id, svg } of pngs) await sharp(Buffer.from(svg), { density: 192 }).resize({ width: PNG_WIDTH }).png().toFile(path.join(outDir, 'png', `${id}.png`));

  // Contact sheets: six figures a sheet (three across), each under its item number; the stems and options beside them in index.txt.
  const W = 520;
  const COLS = 3;
  const PER = 6;
  const index: string[] = [];
  for (let s = 0; s < rows.length; s += PER) {
    const group = rows.slice(s, s + PER);
    const imgs: Array<{ buf: Buffer; h: number; n: number }> = [];
    for (const [k, r] of group.entries()) {
      const buf = (await sharp(path.join(outDir, 'png', `${r.id}.png`)).resize({ width: W }).png().toBuffer()) as Buffer;
      const m = (await sharp(buf).metadata()) as { height: number };
      imgs.push({ buf, h: m.height, n: s + k + 1 });
    }
    const rowsH: number[] = [];
    for (let i = 0; i < imgs.length; i += COLS) rowsH.push(Math.max(...imgs.slice(i, i + COLS).map((x) => x.h)) + 26);
    const comp: Array<{ input: Buffer; left: number; top: number }> = [];
    let y = 0;
    for (let i = 0; i < imgs.length; i += COLS) {
      imgs.slice(i, i + COLS).forEach((im, j) => {
        comp.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="24"><rect width="${W}" height="24" fill="#222"/><text x="6" y="17" font-size="15" fill="#fff" font-family="Helvetica">#${im.n}</text></svg>`), left: j * W, top: y });
        comp.push({ input: im.buf, left: j * W, top: y + 24 });
      });
      y += rowsH[i / COLS];
    }
    const file = `sheet-${String(s + 1).padStart(3, '0')}.png`;
    await sharp({ create: { width: W * COLS, height: rowsH.reduce((x, z) => x + z, 0), channels: 3, background: '#888' } }).composite(comp).png().toFile(path.join(outDir, 'sheets', file));
    index.push(`== ${file}`);
    for (const [k, r] of group.entries()) {
      index.push(`#${s + k + 1} [${(r.figure as { spec: Spec }).spec.type}] ${r.id}`);
      index.push(`   ${r.problemText}`);
      index.push((r.choices as string[]).length ? `   ${(r.choices as string[]).map((x, i) => `${'ABCD'[i]}${'ABCD'[i] === r.answer ? '*' : ''}) ${x}`).join('  |  ')}` : `   key: ${r.answer}`);
    }
  }
  fs.writeFileSync(path.join(outDir, 'sheets', 'index.txt'), index.join('\n') + '\n');
  console.log(`\nwrote ${rows.length} rows, ${pngs.length} PNGs, ${Math.ceil(rows.length / PER)} sheets, gallery.html${wip ? '' : ', mapping.json, summary.json'} to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
