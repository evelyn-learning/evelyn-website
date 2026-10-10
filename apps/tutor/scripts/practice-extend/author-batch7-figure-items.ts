/**
 * Hand-authored practice items that are read off a FIGURE — batch 7.
 *
 * The first items for the eight figure kinds of the renderer's fifth round
 * (`BATCH5_FIGURE_KINDS`: replication_fork, operon_map, cell_cycle_wheel,
 * transformer, induction_loop, doppler_wavefronts, photoelectric_setup,
 * data_table), which no item used before. Each item is written for an
 * objective the kind genuinely serves — its description AND its lesson text in
 * the lesson packs — at most three items an objective, a mix of level 2 and 3
 * with a few level 4.
 *
 * What makes an item level 3 here — at least two of: two separate readings
 * combined; a reading that must be interpreted through the objective's idea
 * before it is used; a choice between cases that the figure decides; working
 * backwards from a stated result to a feature of the figure; finding which of
 * four statements about the figure is false; comparing two set-ups. A single
 * reading, or two printed values put into one formula, is level 2.
 *
 * Lessons of the earlier batches applied here: the answer must need the
 * figure (a table carries its data in the drawn table, never in the stem; a
 * transformer item makes the student count the drawn turns, or see which coil
 * is joined to the source); nothing that is asked for is printed; numeric keys
 * are exact or tested in code against early rounding (`alts`); hints name a
 * method, never a part of the answer; the alt text names what the figure
 * shows without giving the answer, by statement or by omission (a lettered
 * marker is never tied to its place; a table's alt names its headers only).
 * Markers and boxes that are asked for are LETTERED (W, X, Y, Z), not
 * numbered: the alt lists the printed labels, and a numbered key would be
 * "stated" by that list.
 *
 * Same pattern, rules and output layout as author-batch6-figure-items.ts.
 * Every item is data in this file. For every item the script
 *   - draws the figure (`buildPracticeFigure`) and runs the SVG safety check,
 *     the legibility report (no warning allowed), the option-letter guard
 *     (`figureLetterClash`) and the job's rule checks;
 *   - PROVES the key from the figure spec: by a figure-core checker whose
 *     result is the key (`ck`), by code that combines checker results
 *     (`calc` / `holds` using `c.run`), or by code on the model the renderer
 *     itself draws from; an item whose key does not follow from its spec
 *     stops the run;
 *   - shuffles and letters the options with a seeded shuffle (the correct
 *     option is written FIRST in this file);
 *   - writes the alt text from `describeForAlt` (what the picture prints,
 *     with any value to keep back hidden) plus the item's own specifics.
 * It then writes ProblemBank-shaped rows (insert-only import — NOT imported
 * here), the audited ids, the key proofs, the mapping (by kind and by
 * objective), a gallery page, PNGs at the 340 px column (2×), contact sheets
 * and a summary.
 *
 * No database, no network, no model. Run from apps/tutor:
 *   env -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL MONGODB_URI="" \
 *     npx tsx scripts/practice-extend/author-batch7-figure-items.ts [--out <dir>] [--check] [--wip] [--list-objectives]
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { checkFigureLegibility } from '../../src/lib/tutor/practice-figure/legibility';
import { buildPracticeFigure, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { MAX_FIGURE_SVG_CHARS, validateFigureSvg } from '../../src/lib/tutor/practice-figure/svg-safety';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { END_TRUTH, forkModel } from '../../src/lib/tutor/practice-figure/kinds/replication-fork';
import { operonModel } from '../../src/lib/tutor/practice-figure/kinds/operon-map';
import { cycleModel } from '../../src/lib/tutor/practice-figure/kinds/cell-cycle';
import { transformerModel } from '../../src/lib/tutor/practice-figure/kinds/transformer';
import { tableModel } from '../../src/lib/tutor/practice-figure/kinds/data-table';
import { contentDefects, itemIdOf, simpleHash } from './core';
import { canonText, derivedText, describeFigure, describeForAlt, examineFigureItem, figureLetterClash, numbersIn, runChecker, type Derived, type FigureItem } from './figure-core';
import { modelOf } from './figure-core-batch4-kit';
import { BATCH5_FIGURE_KINDS } from './figure-core-batch5';

const INTEGRATION = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration';
const DEFAULT_OUT = `${INTEGRATION}/practice-figures-2026-10-17-items`;
/** Every figure row written before this batch (released or not) — an id may not be reused. Those that exist are read. */
const EARLIER_ROWS = [
  `${INTEGRATION}/release-2026-10-15/figure-rows-428.json`,
  `${INTEGRATION}/release-2026-10-15/figure-rows-253-second.json`,
  `${INTEGRATION}/practice-figures-2026-10-14-items/final/figure-rows-batch6.json`,
  `${INTEGRATION}/practice-figures-2026-10-15-batch5/final/figure-rows-batch5.json`,
  `${INTEGRATION}/practice-figures-2026-10-16-items/final/figure-rows-batch6-61.json`,
  // The first of the three above does not exist under that name: the 10-14 folder holds the batch-4 rows.
  // Every rows file of the three folders is read, so that no id of any of those runs can be reused.
  `${INTEGRATION}/practice-figures-2026-10-14-items/final/figure-rows-batch4.json`,
  `${INTEGRATION}/practice-figures-2026-10-14-items/final/figure-rows-batch4-101.json`,
  `${INTEGRATION}/practice-figures-2026-10-15-batch5/final/figure-rows-batch5-152.json`,
  `${INTEGRATION}/practice-figures-2026-10-16-items/final/figure-rows-batch6.json`,
];
/** The CURRENT lesson packs (lesson text and every existing item). */
const PACKS = `${INTEGRATION}/practice-expand-2026-10-12/packs`;
const PNG_WIDTH = 680; // the 340 px column at 2×
/** At most three items an objective. */
const CAP_PER_OBJECTIVE = 3;

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
  d: 2 | 3 | 4;
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
  /** numeric: the key again by the routes a student may take (early rounding of an intermediate, another value of a constant, …) — every one must round to the stated key. */
  alts?: [string, (c: Ctx) => number[]];
  /** mcq: whether each option, as written, is a right answer to the question (correct first), computed from the spec. */
  holds?: [string, Array<(c: Ctx) => boolean>];
  h: [string, string];
  s: string;
}
interface Item extends A { lo: string; sub: string }

const ITEMS: Item[] = [];
/** `lo` is "<first block of the plan id>.lo-N"; resolved against the lesson packs. */
function G(lo: string, sub: string, items: A[]): void {
  for (const a of items) ITEMS.push({ ...a, lo, sub });
}

const S = (type: string, params: P): Spec => ({ type, params });
const near = (a: number, b: number, tol = 1e-9): boolean => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
const round = (v: number, dp: number): number => Number(v.toFixed(dp));
const arr = (v: unknown): P[] => v as P[];
const sum = (xs: number[]): number => xs.reduce((t, v) => t + v, 0);
/** One test per option: the option holds when the value computed from the spec is the value the option states. */
const pick = <T,>(how: string, f: (c: Ctx) => T, stated: T[]): [string, Array<(c: Ctx) => boolean>] => [how, stated.map((v) => (c: Ctx) => JSON.stringify(f(c)) === JSON.stringify(v))];

// ── helpers for particular kinds ────────────────────────────────────────────

const fork = (p: P = {}): Spec => S('replication_fork', p);
const forkOf = (c: Ctx) => modelOf(c.spec, forkModel);
const operon = (p: P): Spec => S('operon_map', p);
const operonOf = (spec: Spec) => modelOf(spec, operonModel);
const wheel = (p: P): Spec => S('cell_cycle_wheel', p);
const cycleOf = (c: Ctx) => modelOf(c.spec, cycleModel);
const xf = (p: P): Spec => S('transformer', p);
const xfOf = (c: Ctx) => modelOf(c.spec, transformerModel);
const loop = (p: P): Spec => S('induction_loop', p);
const dop = (p: P): Spec => S('doppler_wavefronts', p);
const photo = (p: P): Spec => S('photoelectric_setup', p);
/** Units of the photoelectric kinds: frequencies in 10¹⁴ Hz, so h is 0.414 eV per unit with h = 4.14 × 10⁻¹⁵ eV·s. */
const H_STEM = 0.414;
const H_SI = (6.63e-34 / 1.6e-19) * 1e14;

const table = (columns: unknown[], rows: unknown[][], extra: P = {}): Spec => S('data_table', { columns, rows, ...extra });
/** The number a cell PRINTS, through the model the renderer draws from (0-based row and column); NaN for a cell left out as "?". */
const tv = (c: Ctx, i: number, j: number): number => {
  const cell = modelOf(c.spec, tableModel).rows[i][j];
  if (cell.kind === 'blank') return NaN;
  if (cell.kind !== 'value' || cell.value === undefined) throw new Error(`cell [${i}][${j}] prints no number`);
  return cell.value;
};
/** A whole column of printed numbers, top to bottom (`rows` = how many rows, default all). */
const tcol = (c: Ctx, j: number, rows?: number): number[] => Array.from({ length: rows ?? modelOf(c.spec, tableModel).rows.length }, (_, i) => tv(c, i, j));
/** Left / right Riemann and trapezoidal sums of tabulated values. */
const leftSum = (x: number[], f: number[]): number => sum(x.slice(1).map((v, k) => f[k] * (v - x[k])));
const rightSum = (x: number[], f: number[]): number => sum(x.slice(1).map((v, k) => f[k + 1] * (v - x[k])));
const trapSum = (x: number[], f: number[]): number => (leftSum(x, f) + rightSum(x, f)) / 2;
const TRAVEL = ['', 'Bus', 'Car', 'Walk', 'Total'];
const RATE_COLS = ['Experiment', { header: '[A]', unit: 'M' }, { header: '[B]', unit: 'M' }, { header: 'Initial rate', unit: 'M/s' }];
const FG_COLS = ['x', 'f(x)', 'f′(x)', 'g(x)', 'g′(x)'];
/** The value of one column in the row where another column prints `equals` (a table of values read across). */
const look = (c: Ctx, where: number, equals: number, find: number): number => c.num('table_lookup', { where, equals, find });

// ITEMS-BEGIN

// ════════════════════════════════════════════════════════════════════════════
// AP BIOLOGY — replication fork
// ════════════════════════════════════════════════════════════════════════════

// ── DNA Replication mechanisms (pack 099) ───────────────────────────────────

G('ffe602ec.lo-2', 'Where helicase works, and which way it moves', [
  {
    t: 'the lettered marker where the parental strands are being separated', d: 2, need: 'reason',
    spec: fork({ enzymes: [{ type: 'polymerase', label: 'W' }, { type: 'ligase', label: 'X' }, { type: 'helicase', label: 'Y' }, { type: 'primase', label: 'Z' }] }),
    alt: 'Four lettered markers of different shapes stand at four different places: one in the mouth of the fork, one on the continuous new strand, one on the template of the new strand made in pieces, and one over a gap between two of the pieces.',
    q: 'The figure shows a replication fork with four lettered markers, each at a place where a different enzyme acts. At which marker are the hydrogen bonds between the two parental strands being broken?',
    o: [
      ['Y', 'correct'],
      ['W', 'the marker at the growing end of the continuous new strand, where nucleotides are added'],
      ['X', 'the marker over a gap between two pieces, where a backbone is sealed'],
      ['Z', 'the marker where the newest piece begins, on a strand that is already single'],
    ],
    ck: ['fork_marker', { enzyme: 'helicase' }],
    h: ['Name the enzyme whose job is to separate the two parental strands.', 'That enzyme works where the DNA is still double on one side and already open on the other. Find the marker at that place.'],
    s: 'The hydrogen bonds between paired bases are broken by helicase as it unwinds the double helix. Read from the figure: marker Y is the wedge in the mouth of the fork, exactly where the unopened double strand parts into two single strands. The other three markers stand on strands that have already been separated: W on the continuous new strand, Z where the newest piece begins, and X over a gap between two older pieces.',
  },
  {
    t: 'the direction helicase moves and the new strand that grows the same way', d: 2, need: 'reason',
    spec: fork({ forkDirection: 'left', leading: 'bottom', templateEnds: 'none' }),
    alt: 'The unopened double strand is on one side and the two separated strands open out to the other side. One new strand is a single continuous arrow and the other is drawn as separate short arrows; the two sets of arrowheads point opposite ways. No strand end is labelled.',
    q: 'The figure shows a replication fork; each arrowhead shows the direction in which a new strand is growing. Toward which side of the figure is helicase moving, and which new strand grows in that same direction?',
    o: [
      ['To the left; the lower new strand', 'correct'],
      ['To the left; the upper new strand', 'right direction for helicase, but picks the strand made in pieces, whose pieces grow away from the fork'],
      ['To the right; the lower new strand', 'has helicase moving back over DNA that is already unwound'],
      ['To the right; the upper new strand', 'follows the arrowheads of the short pieces and sends helicase with them'],
    ],
    holds: ['from the renderer\'s model of the fork: helicase moves toward the side the unopened double strand is on, and the new strand that grows that way is the continuous one', pick('', (c) => { const m = forkOf(c); return [m.direction, m.leading === 'top' ? 'upper' : 'lower']; }, [['left', 'lower'], ['left', 'upper'], ['right', 'lower'], ['right', 'upper']])[1]],
    h: ['Helicase moves into the part of the DNA that is still double-stranded. Find which side of the figure that is.', 'Then compare the arrowheads: one new strand points toward the fork, and the pieces of the other point away from it.'],
    s: 'Helicase unwinds the helix by moving into the DNA that is still double-stranded. Read from the figure: the unopened double strand is on the left, so helicase, and with it the fork, moves to the left. The lower new strand is one continuous arrow pointing left, toward the fork, so it grows in the same direction as helicase. The short pieces of the upper new strand point right, away from the fork.',
  },
]);

G('ffe602ec.lo-3', 'Where a primer lies on its piece, and how many were needed', [
  {
    t: 'the end of a piece that carries its primer, and what the primer is made of', d: 2, need: 'reason',
    spec: fork({ primers: true, primerKey: false, templateEnds: 'none', ends: { lagging_start: 'blank' } }),
    alt: 'Each new strand carries arrowheads, and a thick block lies at the end of each new piece opposite its arrowhead. A question-mark box stands at one end of the short piece nearest the fork. No strand end is labelled and the blocks are not named.',
    q: 'In the figure each arrowhead marks the end of a new strand to which DNA polymerase is adding nucleotides, and each thick block is the short stretch that primase made to start that piece. A ? box stands at one end of the piece nearest the fork. What belongs in the ? box, and what is the thick block at that end made of?',
    o: [
      ['5′; RNA', 'correct'],
      ['3′; RNA', 'knows what a primer is made of but puts the growing end of the piece at its primer'],
      ['5′; DNA', 'finds the end but takes primase to make DNA, as the polymerase does'],
      ['3′; DNA', 'puts the growing end at the primer and also takes the primer to be DNA'],
    ],
    holds: ['fork_end for the boxed end (settled by the arrowheads), on a figure that draws the primer at that end; primase makes RNA', (() => {
      const is = (end: string, made: string) => (c: Ctx) => { const m = forkOf(c); if (!m.primers || m.ends.lagging_start !== 'blank') throw new Error('the figure does not show the primers and the box'); return c.txt('fork_end', { end: 'lagging_start' }) === end && made === 'RNA'; };
      return [is('5′', 'RNA'), is('3′', 'RNA'), is('5′', 'DNA'), is('3′', 'DNA')];
    })()],
    h: ['An arrowhead is at the end where nucleotides are being added. Recall which end of a strand DNA polymerase can extend, and notice at which end of its piece the box stands.', 'Recall what kind of nucleic acid primase makes, and why DNA polymerase cannot do without it.'],
    s: 'DNA polymerase adds nucleotides only to a 3′ end, so the arrowhead of each piece is at its 3′ end. Read from the figure: the ? box is at the opposite end of the piece nearest the fork, the end where its thick block lies, so that end is 5′. The block is the primer that primase laid down to start the piece. Primase makes a short stretch of RNA, which gives DNA polymerase the free 3′–OH that it needs before it can add DNA nucleotides.',
  },
  {
    t: 'how many more primers the strand in pieces needed', d: 2, need: 'reason',
    spec: fork({ leading: 'bottom', templateEnds: 'none' }),
    alt: 'One new strand is a single continuous arrow pointing toward the fork; the other is drawn as separate short arrows pointing away from it. No primers, no enzymes and no strand ends are marked.',
    q: 'The figure shows all the new DNA made so far at one replication fork. How many more RNA primers did primase have to make for the upper new strand than for the lower new strand?',
    n: '2',
    calc: ['fork_primer_count for the strand in pieces minus fork_primer_count for the continuous strand (the figure must draw the pieces on the upper arm)', (c) => { if (forkOf(c).leading !== 'bottom') throw new Error('the pieces are not on the upper arm'); return c.num('fork_primer_count', { strand: 'lagging' }) - c.num('fork_primer_count', { strand: 'leading' }); }],
    h: ['DNA polymerase cannot start a strand: every separate piece of new DNA began from its own primer.', 'Count the separate pieces of each new strand, then compare the two counts.'],
    s: 'Every separate piece of new DNA is started from its own RNA primer, because DNA polymerase can only extend an existing 3′ end. Read from the figure: the upper new strand is drawn as three separate pieces, so it needed three primers; the lower new strand is one continuous piece, so it needed one. The difference is 3 − 1 = 2.',
  },
]);

G('ffe602ec.lo-4', 'The 5′ to 3′ rule applied to unlabelled ends', [
  {
    t: 'a hidden end found through two antiparallel steps, and whether polymerase can extend it', d: 3, need: 'reason',
    spec: fork({ arrows: false, templateEnds: 'none', ends: { template_lagging_open: 'value', leading_tip: 'blank' } }),
    alt: 'No arrowheads are drawn. The outer end of one parental strand is labelled with its polarity. A question-mark box stands at one end of the continuous new strand, which lies along the other parental strand.',
    q: 'The figure shows a replication fork without arrowheads; one strand end is labelled and one is marked with a ? box. What belongs in the ? box, and is that the kind of end to which DNA polymerase can add nucleotides?',
    o: [
      ['3′; yes', 'correct'],
      ['3′; no', 'finds the polarity but has DNA polymerase adding nucleotides to 5′ ends'],
      ['5′; no', 'misses one of the reversals of direction, then applies the rule for polymerase correctly to the wrong label'],
      ['5′; yes', 'misses one of the reversals of direction and also has polymerase adding to 5′ ends'],
    ],
    holds: ['fork_end for the boxed end (settled by the one printed end); DNA polymerase adds nucleotides to a 3′ end only', (() => {
      const is = (end: string, can: boolean) => (c: Ctx) => { const e = c.txt('fork_end', { end: 'leading_tip' }); return e === end && (e === '3′') === can; };
      return [is('3′', true), is('3′', false), is('5′', false), is('5′', true)];
    })()],
    h: ['Start from the labelled end: the two parental strands run in opposite directions, so compare their two outer ends.', 'A new strand is antiparallel to the parental strand it lies along. Then recall which end of a strand DNA polymerase extends.'],
    s: 'Read from the figure: the labelled end, the outer end of the lower parental strand, is 5′. The two parental strands are antiparallel, so the outer end of the upper parental strand is 3′. The continuous new strand lies along the upper parental strand and is antiparallel to it, so its outer end is 5′ and its other end, the boxed end nearest the fork, is 3′. DNA polymerase adds nucleotides only to a free 3′–OH, so this is the kind of end it extends; it is the growing end of that strand.',
  },
  {
    t: 'both hidden ends of the parental strands, worked back from the arrowheads', d: 3, need: 'reason',
    spec: fork({ leading: 'bottom', forkDirection: 'left', templateEnds: 'none', ends: { template_leading_parental: 'blank', template_lagging_parental: 'blank' } }),
    alt: 'Each new strand carries arrowheads: one new strand is a single continuous arrow, the other is separate short arrows pointing the opposite way. The two ends of the parental strands inside the unopened double strand each carry a question-mark box; no end is labelled.',
    q: 'In the figure each arrowhead shows the direction in which DNA polymerase is extending a new strand. The two ? boxes are at the ends of the two parental strands inside the unopened double strand. What belongs in the upper box and in the lower box?',
    o: [
      ['Upper box 3′; lower box 5′', 'correct'],
      ['Upper box 5′; lower box 3′', 'gives each parental strand the same direction as the new strand made on it'],
      ['3′ in the upper box and in the lower box', 'treats the two parental strands as parallel, taking both from the continuous new strand'],
      ['5′ in the upper box and in the lower box', 'treats the two parental strands as parallel, taking both from the short pieces'],
    ],
    holds: ['fork_end for each boxed end (settled by the arrowheads); the upper box is on the template of the strand in pieces when the continuous strand is drawn on the lower arm', (() => {
      const is = (up: string, low: string) => (c: Ctx) => { const top = forkOf(c).leading === 'top' ? 'template_leading_parental' : 'template_lagging_parental'; const bottom = top === 'template_leading_parental' ? 'template_lagging_parental' : 'template_leading_parental'; return c.txt('fork_end', { end: top }) === up && c.txt('fork_end', { end: bottom }) === low; };
      return [is('3′', '5′'), is('5′', '3′'), is('3′', '3′'), is('5′', '5′')];
    })()],
    h: ['DNA polymerase extends a strand only at one kind of end, so every arrowhead marks that kind of end.', 'Each parental strand runs opposite to the new strand paired with it. Follow each parental strand from its outer end to its end in the double strand.'],
    s: 'DNA polymerase extends a strand only at its 3′ end, so each arrowhead is at a 3′ end. Read from the figure: the continuous lower new strand points left, toward the fork, so it runs 5′ to 3′ from right to left. Its template, the lower parental strand, runs the opposite way: 3′ at its outer right end and 5′ at its end in the double strand, so the lower box is 5′. The short pieces of the upper new strand point right, so the upper parental strand is 5′ at its outer end and 3′ in the double strand: the upper box is 3′. The two boxes also agree with the parental strands being antiparallel.',
  },
]);

G('ffe602ec.lo-5', 'Leading and lagging strands told apart, and what would change them', [
  {
    t: 'which lettered strand is the lagging strand and how many fragments are drawn', d: 2, need: 'read',
    spec: fork({ fragments: 4, templateEnds: 'none', strandLabels: { leading: 'Y', lagging: 'X' } }),
    alt: 'The two new strands are lettered. One is a single continuous arrow pointing toward the fork; the other is drawn as several separate short arrows pointing away from the fork. No strand end is labelled.',
    q: 'In the figure the two new strands at a replication fork are labelled X and Y. Which of them is the lagging strand, and how many Okazaki fragments of it are drawn?',
    o: [
      ['X; 4 fragments', 'correct'],
      ['Y; 1 fragment', 'takes the continuous strand for the lagging strand'],
      ['Y; 4 fragments', 'right count, but names the continuous strand'],
      ['X; 3 fragments', 'counts the gaps between the pieces instead of the pieces'],
    ],
    holds: ['fork_strand for each letter and fork_fragment_count', (() => {
      const is = (name: string, n: number) => (c: Ctx) => c.txt('fork_strand', { label: name }) === 'lagging' && c.num('fork_fragment_count') === n;
      return [is('X', 4), is('Y', 1), is('Y', 4), is('X', 3)];
    })()],
    h: ['The lagging strand is the one that cannot be made in a single run toward the fork.', 'Count the separate pieces, not the spaces between them.'],
    s: 'The lagging strand is made discontinuously, as Okazaki fragments, because its template runs the wrong way for continuous 5′ to 3′ synthesis toward the fork. Read from the figure: strand Y is one continuous arrow pointing at the fork, so it is the leading strand; strand X is drawn as four separate short arrows pointing away from the fork, so it is the lagging strand, with four fragments.',
  },
  {
    t: 'which parental strand would template the lagging strand if the fork ran the other way', d: 3, need: 'reason',
    spec: fork({}),
    alt: 'The four ends of the two parental strands are labelled with their polarity. One new strand is a single continuous arrow lying along one parental strand; the other is drawn as separate short arrows lying along the other parental strand.',
    q: 'The figure shows a replication fork. Suppose the same stretch of DNA were instead copied by a fork moving through it in the OPPOSITE direction, with every strand keeping its own 5′ and 3′ ends. Which parental strand would then be the template for the lagging strand?',
    o: [
      ['The upper strand, which is the leading-strand template in the figure', 'correct'],
      ['The lower strand, which is the lagging-strand template in the figure', 'thinks a parental strand keeps its role whichever way the fork moves'],
      ['The upper strand, which is the lagging-strand template in the figure', 'misreads which arm carries the short pieces, and then keeps the role'],
      ['The lower strand, which is the leading-strand template in the figure', 'reverses the roles but starts from a misreading of which arm carries the short pieces'],
    ],
    holds: ['from the renderer\'s model: the arm that carries the continuous strand now; reversing the fork turns that strand\'s 3′→5′ reading (in the direction of fork movement) into 5′→3′, so the roles exchange', (() => {
      const is = (strand: 'upper' | 'lower', roleNow: 'leading' | 'lagging') => (c: Ctx) => { const leadNow = forkOf(c).leading === 'top' ? 'upper' : 'lower'; const lagAfter = leadNow; return strand === lagAfter && roleNow === (strand === leadNow ? 'leading' : 'lagging'); };
      return [is('upper', 'leading'), is('lower', 'lagging'), is('upper', 'lagging'), is('lower', 'leading')];
    })()],
    h: ['Read off which parental strand lies under the continuous new strand, and how its 5′ and 3′ ends lie relative to the direction in which the fork is moving.', 'A template can be copied continuously only if it is read 3′ to 5′ in the direction the fork moves. Ask what happens to that reading when the fork comes from the other side.'],
    s: 'Read from the figure: the continuous new strand lies along the upper parental strand, which is 3′ at its outer end and 5′ inside the double strand, so the fork reads it 3′ to 5′ as it advances: the upper strand is the leading-strand template. A fork moving the opposite way would meet the same strand 5′ end first and read it 5′ to 3′, so the new strand on it could only be made in pieces pointing away from the fork. The upper strand would become the lagging-strand template, and the lower strand the leading-strand template.',
  },
  {
    t: 'the false statement about two lettered new strands', d: 3, need: 'reason',
    spec: fork({ leading: 'bottom', strandLabels: { leading: 'X', lagging: 'Y' } }),
    alt: 'The two new strands are lettered and carry arrowheads; one is a single continuous arrow and the other is drawn as separate short arrows. The four ends of the parental strands are labelled with their polarity.',
    q: 'In the figure the two new strands at a replication fork are labelled X and Y. Which statement about them is NOT correct?',
    o: [
      ['Each piece of strand Y is extended toward the fork', 'correct'],
      ['Strand X grows in the direction in which the fork is moving', 'true of the continuous strand; picked by a reader who takes X for the strand made in pieces'],
      ['The piece of strand Y nearest the fork is the one started most recently', 'true; picked by a reader who thinks the oldest piece lies nearest the fork'],
      ['Strands X and Y are both extended only at 3′ ends', 'true; picked by a reader who thinks the lagging strand is built in the 3′ to 5′ direction'],
    ],
    holds: ['fork_strand for X and Y; a statement is the right answer when it is false: the pieces of the lagging strand grow AWAY from the fork, the leading strand grows with the fork, the newest piece is nearest the fork (the renderer\'s model), and both strands are extended at 3′ ends (END_TRUTH)', [
      (c) => c.txt('fork_strand', { label: 'Y' }) === 'lagging',
      (c) => c.txt('fork_strand', { label: 'X' }) !== 'leading',
      () => false,
      () => !(END_TRUTH.leading_tip === '3′' && END_TRUTH.lagging_tip === '3′'),
    ]],
    h: ['First decide from the drawing which lettered strand is continuous and which is made in pieces.', 'Then test each statement against the arrowheads: note which way the continuous arrow points and which way the short arrows point.'],
    s: 'Read from the figure: X is one continuous arrow pointing at the fork (the leading strand) and Y is drawn as short arrows that point away from the fork (the lagging strand). So the statement that each piece of Y is extended toward the fork is false. The other three are true: X grows with the fork; a new piece of Y can only be started on template that helicase has just exposed, so the newest piece is nearest the fork; and DNA polymerase extends every strand at its 3′ end.',
  },
]);

G('ffe602ec.lo-6', 'How many joins ligase makes, and between which ends', [
  {
    t: 'the number of nicks ligase must seal', d: 2, need: 'reason',
    spec: fork({ fragments: 4, forkDirection: 'left', templateEnds: 'none' }),
    alt: 'One new strand is a single continuous arrow pointing toward the fork; the lower new strand is drawn as several separate short arrows pointing away from the fork. No strand end and no enzyme is marked.',
    q: 'The figure shows the new DNA made so far at one replication fork. After the RNA primers have been replaced with DNA, how many nicks must DNA ligase seal to join all the pieces of the lower new strand drawn in the figure into one strand?',
    n: '3',
    calc: ['fork_fragment_count − 1: one nick between each pair of neighbouring pieces (the figure must draw the pieces on the lower arm)', (c) => { if (forkOf(c).leading !== 'top') throw new Error('the pieces are not on the lower arm'); return c.num('fork_fragment_count') - 1; }],
    h: ['Count the separate pieces of the lower new strand.', 'Ligase makes one join between each pair of neighbouring pieces; a piece at the end of the row has a neighbour on one side only.'],
    s: 'Once the primers have been replaced with DNA, a nick remains between each pair of neighbouring pieces, and DNA ligase seals each nick with one phosphodiester bond. Read from the figure: the lower new strand is drawn as four separate pieces, which have three boundaries between them. Ligase must seal 3 nicks.',
  },
  {
    t: 'which piece supplies the 3′ end when the two oldest pieces are joined', d: 3, need: 'reason',
    spec: fork({ fragments: 4, templateEnds: 'none' }),
    alt: 'The unopened double strand is on one side of the figure. One new strand is a single continuous arrow; the lower new strand is drawn as a row of separate short arrows, all pointing the same way. No strand end and no enzyme is marked.',
    q: 'In the figure DNA ligase has not yet acted. When it joins the two OLDEST pieces of the lower new strand, it links the 3′ end of one piece to the 5′ end of the other. Counting the pieces of the lower strand from the left of the figure, which piece supplies the 3′ end?',
    o: [
      ['The second piece from the left', 'correct'],
      ['The first piece from the left', 'finds the oldest pair but has each piece growing toward the fork'],
      ['The fourth piece from the left', 'takes the pieces nearest the fork to be the oldest'],
      ['The third piece from the left', 'takes the pieces nearest the fork to be the oldest and also reverses the direction of growth'],
    ],
    holds: ['from the renderer\'s model: the oldest pieces are the two farthest from the fork; each piece grows away from the fork (its arrowhead, a 3′ end, is at its far end), so the join is made by the 3′ end of the NEWER piece of the pair', pick('', (c) => { const m = forkOf(c); if (m.leading !== 'top' || END_TRUTH.lagging_tip !== '3′') throw new Error('the pieces are not on the lower arm'); return m.direction === 'right' ? 2 : m.fragments - 1; }, [2, 1, 4, 3])[1]],
    h: ['The newest piece is the one nearest the fork, so decide which end of the row holds the two oldest pieces.', 'An arrowhead marks the 3′ end of its piece. At the boundary between the two oldest pieces, see which piece has its arrowhead there.'],
    s: 'Read from the figure: the fork is on the right, so the newest piece is the rightmost and the two oldest pieces are the first and second from the left. Every piece points left, away from the fork, so its 3′ end is its left end and its 5′ end is its right end. At the boundary between the first and second pieces, the second piece arrives with its 3′ end and meets the 5′ end of the first piece. Ligase therefore links the 3′ end of the second piece from the left to the 5′ end of the first.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// AP BIOLOGY — operon map
// ════════════════════════════════════════════════════════════════════════════

// ── Gene Regulation in Prokaryotes and Eukaryotes (pack 054) ────────────────

G('03d38863.lo-1', 'The parts of the lac operon and what sets its transcription', [
  {
    t: 'the lettered box the lac repressor binds', d: 2, need: 'reason',
    spec: operon({ system: 'lac', lactose: true, glucose: false, capSite: true, showRepressor: false, labels: { regulator: 'W', capSite: 'X', promoter: 'Y', operator: 'Z' } }),
    alt: 'One box stands apart on the left and six boxes form a row; the four boxes that are not structural genes carry letters instead of names. A round protein sits on one lettered box and an oval protein on the lettered box next to it, and an arrow runs over the three gene boxes. No repressor is drawn.',
    q: 'The figure shows the lac operon while its genes are being transcribed; the repressor is not drawn, and four boxes carry letters in place of their names. Which lettered box is the DNA to which the lac repressor binds when no lactose is present?',
    o: [
      ['Z', 'correct'],
      ['W', 'the gene that codes for the repressor, not the site the repressor binds'],
      ['X', 'the site where the activator protein CAP is sitting'],
      ['Y', 'the promoter, where RNA polymerase is sitting'],
    ],
    ck: ['operon_box', { element: 'operator' }],
    h: ['Name the stretch of DNA that the repressor protein binds.', 'A bound repressor has to be in the path of RNA polymerase. Use the proteins that are drawn to work out what the other lettered boxes are.'],
    s: 'The lac repressor binds the operator, which lies between the promoter and the first structural gene, where a bound repressor blocks RNA polymerase. Read from the figure: RNA polymerase (RNAP) sits on box Y, so Y is the promoter; CAP sits on box X, its own site; box W stands apart from the row and is the regulator gene that codes for the repressor. The box between the promoter and lacZ is Z, the operator.',
  },
  {
    t: 'the rate of transcription when lactose and glucose are both present', d: 3, need: 'reason',
    spec: operon({ system: 'lac', lactose: true, glucose: true, capSite: true, transcription: 'blank', showConditions: true }),
    alt: 'A line above the map states whether lactose and glucose are present. A pill-shaped protein with a small triangle attached is drawn near the row of boxes, and the box named CAP site is drawn with or without a protein on it. A question-mark box stands where the transcription arrow over the genes would be.',
    q: 'The figure shows the lac operon under the conditions printed above it. Which describes the transcription of lacZ, lacY and lacA that belongs in the ? box?',
    o: [
      ['Transcription at a low rate', 'correct'],
      ['Transcription at a high rate', 'sees the repressor off the operator and ignores the empty CAP site'],
      ['No transcription, with the repressor on the operator', 'thinks glucose keeps the repressor bound even when lactose is present'],
      ['No transcription, with RNA polymerase unable to bind at all', 'thinks RNA polymerase cannot bind the promoter in any way without CAP'],
    ],
    ck: ['operon_transcription', {}],
    h: ['Two things are needed for a high rate: the operator must be free, and the activator CAP must be helping RNA polymerase. Check each one on the figure.', 'Decide what a free operator WITHOUT the activator gives.'],
    s: 'Read from the figure: lactose is present, and the repressor R, with allolactose attached, is off the operator, so RNA polymerase is not blocked. Glucose is also present, and nothing sits on the CAP site, so the activator CAP is not helping RNA polymerase to bind. With the operator free but without CAP, RNA polymerase binds the promoter only weakly and the three genes are transcribed at a low rate. A high rate needs lactose present and glucose absent.',
  },
  {
    t: 'transcription in an operator mutant, with and without lactose', d: 3, need: 'reason',
    spec: operon({ system: 'lac', lactose: false, glucose: false, mutation: 'operator', transcription: 'blank', showConditions: true }),
    alt: 'A line above the map states whether lactose and glucose are present. A cross under one box of the row marks a mutation; a pill-shaped protein is drawn near the row of boxes. A question-mark box stands where the transcription arrow over the genes would be.',
    q: 'The figure shows the lac operon of a mutant cell under the conditions printed above it; the ✕ marks the element that has lost its function. What belongs in the ? box, and would adding lactose to the medium change it?',
    o: [
      ['Transcription; adding lactose would not change it', 'correct'],
      ['No transcription; adding lactose would switch it on', 'ignores the mutation and treats the cell as normal'],
      ['No transcription; adding lactose would make no difference', 'takes a mutated operator to mean genes that cannot be transcribed at all'],
      ['Transcription; adding lactose would switch it off', 'has lactose acting to shut the operon down'],
    ],
    holds: ['operon_transcription for the figure as drawn and again with lactose present', (() => {
      const is = (on: boolean, onWithLactose: boolean) => (c: Ctx) => (c.txt('operon_transcription', {}) !== 'off') === on && (c.txt('operon_transcription', { lactose: true }) !== 'off') === onWithLactose;
      return [is(true, true), is(false, true), is(false, false), is(true, false)];
    })()],
    h: ['Find which box carries the ✕ and recall what normally binds to that box.', 'If that binding can no longer happen, ask whether the thing lactose normally removes is still in the way.'],
    s: 'Read from the figure: the ✕ is under the operator (O), and the repressor R is drawn off the DNA although no lactose is present. A mutated operator cannot be bound by the repressor, so nothing blocks RNA polymerase and the genes are transcribed. Lactose normally works by pulling the repressor off the operator; here the repressor is already unable to bind, so adding lactose changes nothing. The operon is expressed all the time.',
  },
]);

G('03d38863.lo-2', 'The trp operon read from the state of its repressor', [
  {
    t: 'tryptophan level and transcription from a free repressor', d: 2, need: 'reason',
    spec: operon({ system: 'trp', tryptophan: false, transcription: 'blank' }),
    alt: 'A pill-shaped protein is drawn near the row of boxes, with or without a small triangle attached. A question-mark box stands where the transcription arrow over the five gene boxes would be. The conditions in the cell are not printed.',
    q: 'The figure shows the trp operon in a cell at one moment; the conditions in the cell are not printed. Judging from the repressor as it is drawn, is tryptophan scarce or plentiful in this cell, and what belongs in the ? box?',
    o: [
      ['Scarce; transcription', 'correct'],
      ['Plentiful; transcription', 'has tryptophan switching the genes on, as lactose does for the lac operon'],
      ['Scarce; no transcription', 'thinks a repressor shuts the operon down whenever it is present in the cell'],
      ['Plentiful; no transcription', 'describes the opposite state, with the repressor carrying tryptophan and sitting on the operator'],
    ],
    holds: ['from the spec: whether tryptophan is present, and operon_transcription for the state drawn', (() => {
      const is = (plentiful: boolean, on: boolean) => (c: Ctx) => operonOf(c.spec).tryptophan === plentiful && (c.txt('operon_transcription', {}) !== 'off') === on;
      return [is(false, true), is(true, true), is(false, false), is(true, false)];
    })()],
    h: ['Look at where the repressor is drawn, and whether anything is attached to it.', 'Recall whether the trp repressor needs tryptophan in order to bind the operator, or in order to leave it.'],
    s: 'Read from the figure: the repressor R floats above the operator, not touching the DNA, and no small molecule is attached to it. The trp repressor is inactive by itself and binds the operator only with tryptophan (its corepressor) attached, so a bare, unbound repressor means tryptophan is scarce. With the operator free, RNA polymerase transcribes the five genes, and the cell makes the enzymes that synthesise tryptophan.',
  },
  {
    t: 'a regulator-gene mutant compared with a normal cell in the same medium', d: 3, need: 'reason',
    spec: operon({ system: 'trp', tryptophan: true, mutation: 'regulator', transcription: 'blank', showConditions: true }),
    alt: 'A line above the map states whether tryptophan is present. A cross under one box marks a mutation. A question-mark box stands where the transcription arrow over the five gene boxes would be.',
    q: 'The figure shows the trp operon of a mutant cell under the condition printed above it; the ✕ marks the element that has lost its function. What belongs in the ? box, and what would the box show for a normal cell in the same medium?',
    o: [
      ['Transcription in the mutant; none in a normal cell', 'correct'],
      ['None in the mutant; transcription in a normal cell', 'has the mutation silencing the operon and tryptophan switching a normal operon on'],
      ['Transcription in the mutant and in a normal cell', 'forgets that tryptophan lets a normal repressor bind the operator'],
      ['None in the mutant and none in a normal cell', 'thinks tryptophan blocks the operator by itself, without a repressor'],
    ],
    holds: ['operon_transcription for the figure as drawn and again with the mutation removed', (() => {
      const is = (mutantOn: boolean, normalOn: boolean) => (c: Ctx) => (c.txt('operon_transcription', {}) !== 'off') === mutantOn && (c.txt('operon_transcription', { mutation: 'none' }) !== 'off') === normalOn;
      return [is(true, false), is(false, true), is(true, true), is(false, false)];
    })()],
    h: ['Find which box carries the ✕ and recall what that gene codes for.', 'Then ask what tryptophan needs in order to switch the operon off, and whether the mutant cell still has it.'],
    s: 'Read from the figure: tryptophan is present, and the ✕ is under trpR, the regulator gene that codes for the repressor, so the mutant makes no working repressor. Tryptophan switches the operon off only by binding the repressor and so letting it bind the operator; with no repressor, the operator stays free and the genes are transcribed even though tryptophan is plentiful. In a normal cell in the same medium the repressor with tryptophan attached sits on the operator, and there is no transcription.',
  },
]);

G('03d38863.lo-3', 'Inducible and repressible control told apart from a drawn state', [
  {
    t: 'the type of an unnamed operon and the role of its small molecule', d: 3, need: 'reason',
    spec: operon({ system: 'trp', tryptophan: true, genes: ['gene 1', 'gene 2', 'gene 3'], labels: { regulator: 'reg', effector: 'small molecule' } }),
    alt: 'The operon is not named: its boxes are a regulator gene, P, O and three numbered genes. A pill-shaped protein with a small triangle attached is drawn at the row of boxes, and a bent arrow with a label is drawn where the genes begin.',
    q: 'The figure shows an operon in a cell in which the small molecule ▲ is plentiful. Which describes this operon and the role of ▲?',
    o: [
      ['Repressible; ▲ is a corepressor', 'correct'],
      ['Inducible; ▲ is an inducer', 'assumes that any small molecule bound to a repressor switches the genes on'],
      ['Repressible; ▲ is an inducer', 'right type of operon, wrong name for the role of the molecule'],
      ['Inducible; ▲ is a corepressor', 'right role for the molecule, wrong name for the type of operon'],
    ],
    holds: ['from the renderer\'s model of the drawn state: the small molecule is on the repressor; the operon is repressible (and the molecule a corepressor) when that repressor is ON the operator with transcription off, inducible (an inducer) when it is off the operator', (() => {
      const state = (c: Ctx): [string, string] => { const m = operonOf(c.spec); if (!m.state.effectorBound) throw new Error('no small molecule is on the repressor'); return m.state.repressorBound && m.state.level === 'off' ? ['repressible', 'corepressor'] : ['inducible', 'inducer']; };
      const is = (type: string, role: string) => (c: Ctx) => state(c)[0] === type && state(c)[1] === role;
      return [is('repressible', 'corepressor'), is('inducible', 'inducer'), is('repressible', 'inducer'), is('inducible', 'corepressor')];
    })()],
    h: ['See where the repressor is when ▲ is attached to it, and whether the genes are being transcribed.', 'A molecule whose presence turns genes OFF acts with the repressor; a molecule whose presence turns genes ON acts against it.'],
    s: 'Read from the figure: the repressor R, with ▲ attached, sits on the operator O, and the arrow over the genes is cut short and labelled "no transcription". So when ▲ is plentiful it helps the repressor to bind and the genes are switched off. An operon that is on by default and is switched off by a plentiful small molecule is repressible, and a small molecule that activates a repressor is a corepressor (as tryptophan is for the trp operon).',
  },
  {
    t: 'the condition that puts the trp repressor where the lac repressor is drawn', d: 3, need: 'reason',
    spec: operon({ system: 'lac', lactose: false, glucose: false }),
    alt: 'A pill-shaped protein is drawn at the row of boxes, and a bent arrow with a label is drawn where the three gene boxes begin. The conditions in the cell are not printed.',
    q: 'The figure shows the lac operon with its repressor in the position drawn. For the repressor of the trp operon to be in the same position on its own operon, which must be true of the cell?',
    o: [
      ['Tryptophan is present and bound to the trp repressor', 'correct'],
      ['Tryptophan is absent from the cell', 'carries the lac rule over: a repressor binds when its small molecule is missing'],
      ['Allolactose is present and bound to the trp repressor', 'mixes up the small molecules of the two systems'],
      ['The gene for the trp repressor has lost its function', 'with no repressor made, none could be on the operator'],
    ],
    holds: ['the position of the lac repressor from the renderer\'s model of the figure, and operon_repressor for a trp operon with tryptophan present, with it absent, and with the regulator gene mutated (allolactose does not act on the trp repressor)', (() => {
      const trp = (params: P): Spec => operon({ system: 'trp', showRepressor: false, ...params });
      const same = (c: Ctx, params: P, what: string) => { const lac = operonOf(c.spec); if (lac.system !== 'lac') throw new Error('the figure is not the lac operon'); return (c.txt('operon_repressor', {}, { spec: trp(params), what }) === 'bound') === lac.state.repressorBound; };
      return [
        (c) => same(c, { tryptophan: true }, 'trp operon, tryptophan present'),
        (c) => same(c, { tryptophan: false }, 'trp operon, tryptophan absent'),
        () => false,
        (c) => same(c, { tryptophan: true, mutation: 'regulator' }, 'trp operon, regulator gene mutated'),
      ];
    })()],
    h: ['Read off where the lac repressor is, and what that does to transcription.', 'The two repressors respond in opposite ways to their small molecules: one binds DNA without its molecule, the other only with it.'],
    s: 'Read from the figure: the lac repressor R sits on the operator, with no small molecule attached, and the genes are not transcribed; this is the lac operon without lactose. The trp repressor works the other way round. By itself it is inactive and stays off the DNA; it binds its operator only when tryptophan, its corepressor, is bound to it. So for the trp repressor to sit on its operator, tryptophan must be present and bound to it.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// AP BIOLOGY — cell-cycle wheel
// ════════════════════════════════════════════════════════════════════════════

// ── Cell Cycle Phases and DNA Content (pack 073) ────────────────────────────

G('72b3b3de.lo-1', 'The phases of interphase placed in the cycle', [
  {
    t: 'the lettered phase in which DNA is being copied', d: 2, need: 'reason',
    spec: wheel({ phases: [{ name: 'G1', duration: 10, label: 'W' }, { name: 'S', duration: 8, label: 'X' }, { name: 'G2', duration: 4, label: 'Y' }, { name: 'M', duration: 2 }], durations: 'none', scale: 'equal' }),
    alt: 'A ring of four equal sectors read clockwise, with an arrow showing the direction. One sector is named and the other three carry letters in place of their names. No durations are printed.',
    q: 'The figure shows the cell cycle, read clockwise, with the three phases of interphase lettered. In which lettered phase would you find a cell that holds more DNA than a cell in G1 but has not yet finished copying its chromosomes?',
    o: [
      ['X', 'correct'],
      ['W', 'the phase that follows division, in which no DNA has yet been copied'],
      ['Y', 'the phase before mitosis, in which copying is already complete'],
      ['M', 'mitosis itself, which begins only after copying is complete'],
    ],
    holds: ['cycle_phase for each lettered sector: the option holds when that sector is S (the named sector M is not S)', ['X', 'W', 'Y'].map((l) => (c: Ctx) => c.txt('cycle_phase', { label: l }) === 'S').concat([(c: Ctx) => cycleOf(c).phases.find((ph) => ph.label === 'M')?.name === 'S'])],
    h: ['Name the phase of interphase in which the chromosomes are copied.', 'The cycle is read clockwise from the phase that is named; interphase starts with the growth phase that follows division.'],
    s: 'A cell with more DNA than a G1 cell that is still copying its chromosomes is in S phase, the middle phase of interphase. Read from the figure: the cycle runs clockwise, and the named sector M (mitosis) is followed by W, then X, then Y. After mitosis comes G1, then S, then G2, so W is G1, X is S and Y is G2. The cell is in phase X.',
  },
  {
    t: 'the share of the cycle spent in interphase when one duration is hidden', d: 3, need: 'calc',
    spec: wheel({ phases: [{ name: 'G1', duration: 9 }, { name: 'S', duration: 6, showDuration: 'blank' }, { name: 'G2', duration: 3 }, { name: 'M', duration: 2 }], total: 'value', scale: 'equal' }),
    alt: 'A ring of four equal sectors, each named, marked "not to scale". A duration is printed beside three of the sectors and a question-mark box beside the fourth; the length of one whole cycle is printed in the middle.',
    q: 'The figure shows the cell cycle of one type of cell; one duration is hidden behind a ? box. What percentage of the cycle does a cell of this type spend in interphase?',
    n: '90',
    calc: ['cycle_interphase (G1 + S + G2, the hidden duration from the printed cycle length) ÷ the printed cycle length × 100', (c) => { const m = cycleOf(c); if (m.showTotal !== 'value') throw new Error('the cycle length is not printed'); return round((c.num('cycle_interphase') / m.total) * 100, 6); }],
    h: ['Interphase is made up of three of the four phases. Decide which phase is NOT part of it.', 'You do not need the hidden duration by itself: the length of the whole cycle is printed.'],
    s: 'Interphase is G1, S and G2 together: every part of the cycle except M. Read from the figure: one cycle lasts 20 h and M lasts 2 h, so interphase lasts 20 − 2 = 18 h, whatever the hidden length of S is (it must be 20 − 9 − 3 − 2 = 6 h). The share is 18 ÷ 20 = 0.90, that is 90%.',
  },
]);

G('72b3b3de.lo-5', 'DNA content used to count cells and to find a hidden phase length', [
  {
    t: 'how many cells of a sample hold twice the G1 amount of DNA', d: 3, need: 'calc',
    spec: wheel({ phases: [{ name: 'G1', duration: 12 }, { name: 'S', duration: 6 }, { name: 'G2', duration: 4 }, { name: 'M', duration: 2 }], total: 'value' }),
    alt: 'A ring of four named sectors, each as wide as its share of the cycle, with the duration of each phase printed beside it and the length of one whole cycle printed in the middle.',
    q: 'The figure gives the length of each phase of the cell cycle for a culture whose cells divide out of step with one another. In a sample of 600 cells from this culture, how many cells are expected to hold twice as much DNA as a cell in G1?',
    n: '150',
    calc: ['cycle_cells_in_phase for G2 plus cycle_cells_in_phase for M, with 600 cells: the two phases in which a cell holds the fully replicated amount', (c) => c.num('cycle_cells_in_phase', { phase: 'G2', cells: 600 }) + c.num('cycle_cells_in_phase', { phase: 'M', cells: 600 })],
    h: ['Decide in which phases a cell holds the fully replicated amount of DNA: after replication has finished and before the cell has divided.', 'When cells divide out of step, the fraction of cells found in a phase equals the fraction of the cycle that the phase takes up.'],
    s: 'A cell holds twice the G1 amount of DNA from the end of S until it divides, that is throughout G2 and M (during S the amount is still rising). Read from the figure: G2 lasts 4 h and M lasts 2 h, out of a cycle of 24 h. In a culture dividing out of step, the fraction of cells in these phases is (4 + 2) ÷ 24 = 0.25, so 0.25 × 600 = 150 cells are expected.',
  },
  {
    t: 'the hidden length of G1 from a count of cells with intermediate DNA content', d: 4, need: 'calc',
    spec: wheel({ phases: [{ name: 'G1', duration: 10, showDuration: 'blank' }, { name: 'S', duration: 8, showDuration: 'blank' }, { name: 'G2', duration: 4 }, { name: 'M', duration: 2 }], total: 'value', scale: 'equal' }),
    alt: 'A ring of four equal sectors, each named, marked "not to scale". A duration is printed beside two of the sectors and a question-mark box beside each of the other two; the length of one whole cycle is printed in the middle.',
    q: 'The figure shows the cell cycle of a culture whose cells divide out of step with one another; two durations are hidden behind ? boxes. When the DNA in 1,200 cells of the culture is measured, 400 cells hold more DNA than a G1 cell but less than a G2 cell. How many hours does G1 last?',
    n: '10',
    calc: ['S = (400 ÷ 1200) × the printed cycle length (it must be the S of the spec); G1 = cycle length − S − the printed G2 and M', (c) => {
      const m = cycleOf(c); const d = (n: string) => m.phases.find((ph) => ph.name === n)!;
      const s = (400 / 1200) * m.total;
      if (m.showTotal !== 'value' || !near(s, d('S').duration) || d('G2').showDuration !== 'value' || d('M').showDuration !== 'value') throw new Error('the count does not fit the wheel');
      return m.total - s - d('G2').duration - d('M').duration;
    }],
    h: ['A cell with more DNA than G1 but less than G2 is part-way through one particular phase. Use the count of such cells to find how long that phase lasts.', 'With that phase known, the printed cycle length and the two printed durations leave only one phase to find.'],
    s: 'A cell holding more DNA than a G1 cell but less than a G2 cell is in S phase, copying its DNA. With cells dividing out of step, the fraction of cells in S equals the fraction of the cycle spent in S: 400 ÷ 1,200 = 1/3. Read from the figure: one cycle lasts 24 h, so S lasts 24 ÷ 3 = 8 h; G2 lasts 4 h and M lasts 2 h. G1 takes what is left: 24 − 8 − 4 − 2 = 10 h.',
  },
]);

// ── Cell Cycle Checkpoints and Cancer (pack 095) ────────────────────────────

G('f963fcbd.lo-1', 'Events of the cycle placed in time', [
  {
    t: 'the time from division until every chromosome has two chromatids', d: 2, need: 'calc',
    spec: wheel({ phases: [{ name: 'G1', duration: 9 }, { name: 'S', duration: 7 }, { name: 'G2', duration: 5 }, { name: 'M', duration: 3 }] }),
    alt: 'A ring of four named sectors read clockwise, each as wide as its share of the cycle, with the duration of each phase printed beside it. The length of the whole cycle is not printed.',
    q: 'The figure gives the length of each phase of the cell cycle for one type of cell. A cell of this type has just been formed by cytokinesis. According to the figure, how many hours pass before every one of its chromosomes consists of two sister chromatids?',
    n: '16',
    calc: ['cycle_duration of G1 plus cycle_duration of S: the chromosomes are all doubled when S ends', (c) => c.num('cycle_duration', { phase: 'G1' }) + c.num('cycle_duration', { phase: 'S' })],
    h: ['Name the phase in which each chromosome is copied to give two sister chromatids. The event asked for is the END of that phase.', 'A cell that has just divided is at the start of the first phase of interphase; add the phases it must pass through.'],
    s: 'Each chromosome comes to consist of two sister chromatids when its DNA is replicated, and replication of all the chromosomes is complete at the end of S phase. A cell just formed by cytokinesis is at the start of G1. Read from the figure: G1 lasts 9 h and S lasts 7 h, so the chromosomes are all doubled 9 + 7 = 16 h after the cell was formed.',
  },
]);

G('f963fcbd.lo-3', 'Checkpoints located on the cycle', [
  {
    t: 'the lettered checkpoint that guards entry into mitosis', d: 2, need: 'reason',
    spec: wheel({ phases: [{ name: 'G1', duration: 10 }, { name: 'S', duration: 8 }, { name: 'G2', duration: 4 }, { name: 'M', duration: 2 }], durations: 'none', checkpoints: [{ at: 'M', label: 'W' }, { at: 'G1/S', label: 'X' }, { at: 'S', label: 'Y' }, { at: 'G2/M', label: 'Z' }] }),
    alt: 'A ring of four named sectors read clockwise. Four lettered triangles on the rim mark checkpoints: two stand at boundaries between sectors and two stand in the middle of a sector. No durations are printed.',
    q: 'The figure marks four checkpoints of the cell cycle with lettered triangles. At which lettered checkpoint does the cell confirm that its DNA has been completely replicated and is undamaged before it commits itself to mitosis?',
    o: [
      ['Z', 'correct'],
      ['X', 'the checkpoint passed before DNA replication begins'],
      ['Y', 'the checkpoint that acts while replication is still under way'],
      ['W', 'the checkpoint inside mitosis, after the cell has already entered it'],
    ],
    holds: ['cycle_checkpoint for each lettered triangle: the option holds when that triangle stands at the G2/M boundary', ['Z', 'X', 'Y', 'W'].map((l) => (c: Ctx) => c.txt('cycle_checkpoint', { label: l }) === 'G2/M')],
    h: ['Completed, undamaged DNA is checked after one phase has ended and before another begins. Name the two phases.', 'Find the triangle that stands on the boundary between those two sectors.'],
    s: 'Replication must be complete, and the DNA undamaged, before a cell enters mitosis; this is checked at the G2/M checkpoint, at the end of G2. Read from the figure: triangle Z stands on the boundary between the G2 sector and the M sector. X stands between G1 and S (the checkpoint before replication), Y in the middle of S (the checkpoint that acts during replication) and W in the middle of M (the checkpoint within mitosis).',
  },
  {
    t: 'the first checkpoint ahead of a cell damaged at a stated time', d: 3, need: 'reason',
    spec: wheel({ phases: [{ name: 'G1', duration: 10 }, { name: 'S', duration: 8 }, { name: 'G2', duration: 4 }, { name: 'M', duration: 2 }], checkpoints: [{ at: 'G1/S' }, { at: 'G2/M' }] }),
    alt: 'A ring of four named sectors read clockwise, each as wide as its share of the cycle, with the duration of each phase printed beside it. Two named triangles on the rim mark checkpoints at two of the boundaries between sectors.',
    q: 'The figure gives the length of each phase of the cell cycle for one type of cell and marks two checkpoints. The DNA of a cell is damaged 19 hours after the cell was formed by cytokinesis. Which is the first checkpoint that can halt this cell, and has the cell replicated its DNA by the time of the damage?',
    o: [
      ['The G2/M checkpoint; its DNA is already replicated', 'correct'],
      ['The G1/S checkpoint; its DNA is not yet replicated', 'places the cell in G1 without adding up the phases it has already passed through'],
      ['The G2/M checkpoint; its DNA is not yet replicated', 'finds the checkpoint but forgets that all of S lies before it'],
      ['The G1/S checkpoint; its DNA is already replicated', 'takes the cell to have divided already, so that the next checkpoint is in the following cycle'],
    ],
    holds: ['from the durations the figure prints (cycle_duration): the phase the cell is in 19 h after cytokinesis, the first drawn checkpoint it has still to pass, and whether S has ended', (() => {
      const state = (c: Ctx): [string, boolean] => {
        const g1 = c.num('cycle_duration', { phase: 'G1' }); const s = c.num('cycle_duration', { phase: 'S' }); const g2 = c.num('cycle_duration', { phase: 'G2' });
        const t = 19;
        if (near(t, g1) || near(t, g1 + s) || near(t, g1 + s + g2) || t > g1 + s + g2) throw new Error('19 h is on a boundary or after G2');
        return [t < g1 ? 'G1/S' : 'G2/M', t > g1 + s];
      };
      const is = (cp: string, done: boolean) => (c: Ctx) => state(c)[0] === cp && state(c)[1] === done;
      return [is('G2/M', true), is('G1/S', false), is('G2/M', false), is('G1/S', true)];
    })()],
    h: ['A cell just formed by cytokinesis is at the start of G1. Add the phase lengths in order to find which phase it is in after 19 hours.', 'The first checkpoint that can act is the next one the cell has still to pass, going clockwise.'],
    s: 'Read from the figure: G1 lasts 10 h, S lasts 8 h and G2 lasts 4 h. A cell formed by cytokinesis starts in G1, is in S from 10 h to 18 h and in G2 from 18 h to 22 h, so at 19 h it is in G2 and has finished replicating its DNA. Going clockwise, the next checkpoint it meets is the one drawn on the boundary between G2 and M: the G2/M checkpoint, which can hold the cell in G2 until the damage is repaired.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PHYSICS — transformer
// ════════════════════════════════════════════════════════════════════════════

// ── Transformer Turns-Ratio Problems (pack 212) ─────────────────────────────

G('233ad806.lo-1', 'Turns counted on the drawing', [
  {
    t: 'turns ratio and kind of transformer from the drawn turns', d: 2, need: 'reason',
    spec: xf({ primary: { turns: 4 }, secondary: { turns: 6 }, windings: 'counted', show: { Np: 'none', Ns: 'none' }, load: 'lamp' }),
    alt: 'Every turn of each coil is drawn, and the two coils have different numbers of turns. The primary coil is joined to an AC source and the secondary coil to a lamp. No numbers are printed.',
    q: 'In the figure every turn of each coil of an ideal transformer is drawn. What is its turns ratio, primary : secondary, and which kind of transformer is it?',
    o: [
      ['2 : 3; step-up', 'correct'],
      ['3 : 2; step-up', 'right kind, but writes the ratio with the secondary first'],
      ['2 : 3; step-down', 'right ratio, but judges the kind from the smaller number coming first'],
      ['3 : 2; step-down', 'takes the coil joined to the lamp for the primary'],
    ],
    holds: ['the turns DRAWN on each coil in the renderer\'s model (windings: counted), reduced to lowest terms, and transformer_type', (() => {
      const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
      const is = (p: number, s: number, kind: string) => (c: Ctx) => { const m = xfOf(c); if (m.windings !== 'counted') throw new Error('the turns are not all drawn'); const g = gcd(m.loops[0], m.loops[1]); return m.loops[0] / g === p && m.loops[1] / g === s && c.txt('transformer_type', {}) === kind; };
      return [is(2, 3, 'step-up'), is(3, 2, 'step-up'), is(2, 3, 'step-down'), is(3, 2, 'step-down')];
    })()],
    h: ['The primary coil is the one joined to the source. Count the turns of each coil.', 'Write the ratio in the order asked and reduce it; the kind of transformer depends on which coil has more turns.'],
    s: 'Read from the figure: the primary coil, joined to the AC source, has 4 turns and the secondary coil, joined to the lamp, has 6 turns. The turns ratio primary : secondary is 4 : 6 = 2 : 3. The secondary has more turns than the primary, so the secondary voltage is higher than the primary voltage: it is a step-up transformer.',
  },
  {
    t: 'the number of secondary turns needed for a new output voltage', d: 3, need: 'calc',
    spec: xf({ primary: { turns: 6, voltage: 18 }, secondary: { turns: 2, voltage: 6 }, windings: 'counted', show: { Np: 'none', Ns: 'none', Vs: 'none' } }),
    alt: 'Every turn of each coil is drawn, and the two coils have different numbers of turns. The primary coil is joined to an AC source whose voltage is printed, and the secondary coil to a resistor. No turn numbers and no secondary voltage are printed.',
    q: 'In the figure every turn of each coil of an ideal transformer is drawn. The secondary coil is to be rewound, leaving the primary coil and the source as they are, so that the secondary voltage becomes 12 V. How many turns must the new secondary coil have?',
    n: '4',
    calc: ['transformer_value for Ns with the secondary voltage 12 V of the question: the drawn primary turns × 12 V ÷ the printed primary voltage', (c) => c.num('transformer_value', { want: 'Ns', Vs: 12 })],
    h: ['Only the primary coil stays as drawn, so count its turns and read the voltage across it.', 'In an ideal transformer the voltage across each coil is proportional to its number of turns; find the volts per turn first.'],
    s: 'Read from the figure: the primary coil has 6 turns and the source supplies 18 V, so each turn of the primary has 18 ÷ 6 = 3 V across it. In an ideal transformer every turn of either coil has the same voltage, so a secondary voltage of 12 V needs 12 ÷ 3 = 4 turns. (The 2 turns drawn at present give 6 V.)',
  },
]);

G('233ad806.lo-2', 'Secondary voltage from drawn turns, and with the coils exchanged', [
  {
    t: 'the hidden secondary voltage from the counted turns', d: 2, need: 'calc',
    spec: xf({ primary: { turns: 8, voltage: 12 }, secondary: { turns: 6, voltage: 9 }, windings: 'counted', show: { Np: 'none', Ns: 'none', Vs: 'blank' }, load: 'lamp' }),
    alt: 'Every turn of each coil is drawn, and the two coils have different numbers of turns. The primary voltage is printed beside the AC source; the secondary voltage, beside the lamp, is a question-mark box. No turn numbers are printed.',
    q: 'In the figure every turn of each coil of an ideal transformer is drawn. What secondary voltage, in volts, belongs in the ? box?',
    n: '9',
    ck: ['transformer_value', { want: 'Vs' }],
    h: ['Count the turns on the coil joined to the source and on the coil joined to the lamp.', 'The secondary voltage is the primary voltage multiplied by secondary turns ÷ primary turns.'],
    s: 'Read from the figure: the primary coil has 8 turns and 12 V across it; the secondary coil has 6 turns. For an ideal transformer V₂ ÷ V₁ = N₂ ÷ N₁, so V₂ = 12 × 6 ÷ 8 = 9 V. The secondary has fewer turns than the primary, so the voltage is stepped down.',
  },
  {
    t: 'the output voltage when the same coils are connected the other way round', d: 3, need: 'calc',
    spec: xf({ primary: { turns: 800, voltage: 240 }, secondary: { turns: 200, voltage: 60 }, show: { Vs: 'none' } }),
    alt: 'Two coils on one core, the primary joined to an AC source and the secondary to a resistor. The number of turns is printed under each coil and the primary voltage beside the source; the secondary voltage is not printed.',
    q: 'The figure shows an ideal transformer. The same two coils are then connected the other way round: the same source is joined to the coil labelled Secondary, and the load to the coil labelled Primary. What voltage, in volts, now appears across the coil labelled Primary?',
    n: '960',
    calc: ['transformer_value for the secondary voltage with the two printed turn numbers exchanged (the coil labelled Secondary now acts as the primary) and the printed source voltage', (c) => { const m = xfOf(c); if (m.q.Np.show !== 'value' || m.q.Ns.show !== 'value') throw new Error('the turns are not printed'); return c.num('transformer_value', { want: 'Vs', Np: m.q.Ns.value, Ns: m.q.Np.value }); }],
    h: ['The coil joined to the source is the one that acts as the primary, whatever its label says.', 'Write the ratio output turns ÷ input turns for the new connection and apply it to the source voltage.'],
    s: 'Read from the figure: the coil labelled Primary has 800 turns, the coil labelled Secondary has 200 turns, and the source supplies 240 V. Connected the other way round, the 200-turn coil is the input and the 800-turn coil is the output, so the output voltage is 240 × 800 ÷ 200 = 960 V. The same pair of coils that stepped the voltage down to 60 V now steps it up.',
  },
]);

G('233ad806.lo-3', 'Current and the inverse turns ratio', [
  {
    t: 'voltage and current of the secondary compared with the primary, from the drawn coils', d: 2, need: 'reason',
    spec: xf({ primary: { turns: 900, label: 'Coil X' }, secondary: { turns: 300, label: 'Coil Y' }, show: { Np: 'none', Ns: 'none' } }),
    alt: 'Two coils, named Coil X and Coil Y, on one core; one is joined to an AC source and the other to a resistor. One coil is drawn with more loops than the other. No numbers are printed.',
    q: 'The figure shows an ideal transformer in use; the coil drawn with more loops is the one with more turns. Compared with coil X, what are the voltage across coil Y and the current in coil Y?',
    o: [
      ['Lower voltage; higher current', 'correct'],
      ['Higher voltage; lower current', 'takes the coil joined to the load to be the one with more turns'],
      ['Lower voltage; lower current', 'has the current stepped down together with the voltage'],
      ['Higher voltage; higher current', 'has a transformer raising voltage and current together, as if it added power'],
    ],
    holds: ['transformer_type (from the coil the figure draws with more loops): a step-down transformer gives a lower secondary voltage and, power being conserved, a higher secondary current', (() => {
      const is = (v: string, i: string) => (c: Ctx) => { const kind = c.txt('transformer_type', {}); if (kind === 'neither') throw new Error('the coils are alike'); return (kind === 'step-down' ? 'lower' : 'higher') === v && (kind === 'step-down' ? 'higher' : 'lower') === i; };
      return [is('lower', 'higher'), is('higher', 'lower'), is('lower', 'lower'), is('higher', 'higher')];
    })()],
    h: ['Decide which coil is the primary (it is joined to the source) and which coil has more turns.', 'Voltage is proportional to turns, and an ideal transformer delivers the same power as it takes in.'],
    s: 'Read from the figure: coil X is joined to the AC source, so it is the primary, and it is drawn with more loops than coil Y, so coil Y has fewer turns. Voltage is proportional to turns, so the voltage across coil Y is lower. An ideal transformer delivers the power it takes in (V₁I₁ = V₂I₂), so the lower voltage goes with a higher current in coil Y.',
  },
  {
    t: 'the hidden primary current from the counted turns', d: 2, need: 'calc',
    spec: xf({ primary: { turns: 9, current: 2 }, secondary: { turns: 3, current: 6 }, windings: 'counted', show: { Np: 'none', Ns: 'none', Ip: 'blank' } }),
    alt: 'Every turn of each coil is drawn, and the two coils have different numbers of turns. The secondary current is printed over the wire to the resistor; the primary current is a question-mark box. No turn numbers and no voltages are printed.',
    q: 'In the figure every turn of each coil of an ideal transformer is drawn. What primary current, in amperes, belongs in the ? box?',
    n: '2',
    ck: ['transformer_value', { want: 'Ip' }],
    h: ['Count the turns on each coil.', 'For an ideal transformer the currents are in the INVERSE ratio of the turns: the coil with more turns carries the smaller current.'],
    s: 'Read from the figure: the primary coil has 9 turns, the secondary coil has 3 turns, and the secondary current is 6 A. For an ideal transformer I₁ ÷ I₂ = N₂ ÷ N₁, so I₁ = 6 × 3 ÷ 9 = 2 A. The primary has three times as many turns, so it carries one third of the current.',
  },
]);

G('233ad806.lo-4', 'Voltage, current and power combined', [
  {
    t: 'the power drawn from the source, from counted turns and a load resistance', d: 3, need: 'calc',
    spec: xf({ primary: { turns: 8, voltage: 48 }, secondary: { turns: 2, voltage: 12 }, windings: 'counted', show: { Np: 'none', Ns: 'none', Vs: 'none' }, loadLabel: 'R = 6 Ω' }),
    alt: 'Every turn of each coil is drawn, and the two coils have different numbers of turns. The primary voltage is printed beside the AC source, and the resistance of the resistor joined to the secondary coil is printed. No turn numbers, no secondary voltage and no currents are printed.',
    q: 'In the figure every turn of each coil of an ideal transformer is drawn, and the secondary coil is joined to the resistor shown. How much power, in watts, does the source deliver to the primary coil?',
    n: '24',
    calc: ['transformer_value for the secondary voltage (from the counted turns), squared and divided by the printed load resistance: an ideal transformer takes in the power it delivers', (c) => { const r = numbersIn(String(c.p.loadLabel)); if (r.length !== 1) throw new Error('no single load resistance is printed'); return c.num('transformer_value', { want: 'Vs' }) ** 2 / r[0]; }],
    h: ['Count the turns to find the secondary voltage, then use the resistor to find the secondary current or the power in the resistor.', 'An ideal transformer wastes nothing: the power taken from the source equals the power delivered to the resistor.'],
    s: 'Read from the figure: the primary has 8 turns and 48 V across it, the secondary has 2 turns, and the resistor is 6 Ω. The secondary voltage is 48 × 2 ÷ 8 = 12 V, so the current in the resistor is 12 ÷ 6 = 2 A and the power delivered to it is 12 × 2 = 24 W. An ideal transformer takes in exactly the power it delivers, so the source supplies 24 W (a primary current of 24 ÷ 48 = 0.5 A).',
  },
  {
    t: 'the false statement about a transformer with four printed values', d: 3, need: 'calc',
    spec: xf({ primary: { turns: 1000, voltage: 240, current: 0.5 }, secondary: { turns: 50, voltage: 12, current: 10 }, show: { Vs: 'none', Is: 'none' } }),
    alt: 'Two coils on one core, the primary joined to an AC source and the secondary to a resistor. The number of turns is printed under each coil, and the voltage and the current are printed for the primary coil only.',
    q: 'The figure shows an ideal transformer supplying a resistor. Which statement about it is NOT correct?',
    o: [
      ['The resistance of the load is 24 Ω', 'correct'],
      ['The secondary voltage is 12 V', 'true (240 × 50 ÷ 1000); picked by a reader who multiplies the voltage by the turns ratio the wrong way up'],
      ['The secondary current is 10 A', 'true (0.5 × 1000 ÷ 50); picked by a reader who steps the current down with the voltage'],
      ['The load receives 120 W', 'true (240 × 0.5, all of it passed on); picked by a reader who expects the power to change with the turns ratio'],
    ],
    holds: ['transformer_value for the secondary voltage, the secondary current and the power delivered, from the four printed values; the load resistance is secondary voltage ÷ secondary current. A statement is the right answer when it is false', [
      (c) => !near(c.num('transformer_value', { want: 'Vs' }) / c.num('transformer_value', { want: 'Is' }), 24),
      (c) => !near(c.num('transformer_value', { want: 'Vs' }), 12),
      (c) => !near(c.num('transformer_value', { want: 'Is' }), 10),
      (c) => !near(c.num('transformer_value', { want: 'power_out' }), 120),
    ]],
    h: ['Find the secondary voltage from the turns, and the secondary current from the fact that the currents are in the inverse ratio of the turns.', 'The resistance of the load is the voltage across the load divided by the current through the load: both must be secondary values.'],
    s: 'Read from the figure: N₁ = 1000, N₂ = 50, V₁ = 240 V and I₁ = 0.5 A. The secondary voltage is 240 × 50 ÷ 1000 = 12 V and the secondary current is 0.5 × 1000 ÷ 50 = 10 A, so the load receives 12 × 10 = 120 W, the same as the 240 × 0.5 = 120 W taken in. The load resistance is 12 V ÷ 10 A = 1.2 Ω, not 24 Ω: 24 Ω comes from dividing the primary voltage by the secondary current.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PHYSICS — induction loop
// ════════════════════════════════════════════════════════════════════════════

// ── Faraday's and Lenz's Laws (pack 240) ────────────────────────────────────

G('ae321f2b.lo-1', 'Whether, and how, the flux through a loop is changing', [
  {
    t: 'a loop moving wholly inside a uniform field', d: 2, need: 'reason',
    spec: loop({ variant: 'field', field: 'into', position: 'inside', direction: 'right', current: 'blank' }),
    alt: 'A rectangular loop of wire is drawn in a region of magnetic field marked with crosses, with an arrow showing the velocity of the loop. A question-mark box stands on the loop where the induced current would be drawn.',
    q: 'The figure shows a wire loop moving through a region of uniform magnetic field. How is the magnetic flux through the loop changing at the instant shown, and what belongs in the ? box?',
    o: [
      ['The flux is not changing; no current', 'correct'],
      ['The flux is increasing; a counterclockwise current', 'thinks that moving through a field always adds flux'],
      ['The flux is decreasing; a clockwise current', 'thinks the loop is already carrying its flux out of the region'],
      ['The flux is not changing; a clockwise current', 'sees that the flux is steady but still expects a moving loop to carry a current'],
    ],
    holds: ['induction_flux_change and induction_current_direction', (() => {
      const is = (flux: string, current: string) => (c: Ctx) => c.txt('induction_flux_change') === flux && c.txt('induction_current_direction') === current;
      return [is('not changing', 'no current'), is('increasing', 'counterclockwise'), is('decreasing', 'clockwise'), is('not changing', 'clockwise')];
    })()],
    h: ['Flux depends on the field strength, on the area of the loop that lies in the field, and on the angle between them. Check whether any of the three is changing.', 'A current is induced only while the flux through the loop is changing.'],
    s: 'Read from the figure: the whole loop lies inside the region of field, and its velocity keeps it inside for the moment. The field is uniform, the area of the loop in the field stays the same and the loop does not turn, so the flux B × A through the loop is not changing even though the loop is moving. With no change of flux there is no induced EMF and no current.',
  },
  {
    t: 'the direction of a magnet\'s field through a loop and the change of flux', d: 2, need: 'reason',
    spec: loop({ variant: 'magnet', pole: 'S', motion: 'toward', magnetSide: 'right' }),
    alt: 'A bar magnet lies on the axis of a circular loop of wire, with its two poles marked. An arrow over the magnet shows which way the magnet is moving along the axis. No current is drawn.',
    q: 'The figure shows a bar magnet moving along the axis of a wire loop. Which describes the magnet\'s field where it passes through the loop, and the magnetic flux through the loop?',
    o: [
      ['The field points toward the magnet; the flux is increasing', 'correct'],
      ['The field points away from the magnet; the flux is increasing', 'gives the field of a north pole'],
      ['The field points toward the magnet; the flux is decreasing', 'reads the motion as taking the magnet away from the loop'],
      ['The field points away from the magnet; the flux is decreasing', 'gives the field of a north pole and also reads the motion as a retreat'],
    ],
    holds: ['the pole that faces the loop (field lines run into a south pole and out of a north pole) and induction_flux_change', (() => {
      const is = (field: string, flux: string) => (c: Ctx) => (c.p.pole === 'S' ? 'toward' : 'away') === field && c.txt('induction_flux_change') === flux;
      return [is('toward', 'increasing'), is('away', 'increasing'), is('toward', 'decreasing'), is('away', 'decreasing')];
    })()],
    h: ['Outside a magnet, field lines leave the north pole and enter the south pole. See which pole faces the loop.', 'The field of a magnet is stronger close to it. See whether the magnet is getting closer to the loop or further from it.'],
    s: 'Read from the figure: the pole that faces the loop is S, and the arrow shows the magnet moving toward the loop. Field lines enter a magnet at its south pole, so at the loop the field points toward the magnet. As the magnet comes closer, the field at the loop grows stronger, so the flux through the loop is increasing.',
  },
]);

G('ae321f2b.lo-2', 'Faraday\'s law applied to what the figure shows', [
  {
    t: 'the EMF of a loop entering a field, from the rate at which area enters', d: 3, need: 'calc',
    spec: loop({ variant: 'field', field: 'into', position: 'entering', direction: 'right', B: 0.5, length: 0.2, speed: 4 }),
    alt: 'A rectangular loop of wire lies partly inside a region of magnetic field marked with crosses, with an arrow showing its velocity. The field strength, the speed of the loop and the length of the side of the loop that crosses the edge of the region are printed.',
    q: 'The figure shows a rectangular wire loop being pushed at a steady speed into a region of uniform magnetic field; the side of the loop that crosses the edge of the region has the length printed. Using Faraday\'s law, what is the magnitude of the EMF induced in the loop, in volts?',
    n: '0.4',
    ck: ['induction_emf', { want: 'emf' }],
    alts: ['the flux gained in one second (B × the area that enters in 1 s) and in a tenth of a second', (c) => { const p = c.p as { B: number; length: number; speed: number }; return [p.B * (p.length * p.speed * 1) / 1, round(p.B * round(p.length * p.speed * 0.1, 3), 3) / 0.1]; }],
    h: ['Work out how much new area of the loop enters the field in one second: a strip as long as the printed side and as wide as the distance the loop moves.', 'The flux gained in that second is the field strength times that area, and the EMF is the flux gained per second.'],
    s: 'Faraday\'s law: EMF = ΔΦ ÷ Δt for one turn. Read from the figure: B = 0.5 T, the side crossing the edge is 0.2 m long, and the loop moves at 4 m/s. In one second the loop advances 4 m, so an extra area of 0.2 × 4 = 0.8 m² enters the field and the flux through the loop grows by 0.5 × 0.8 = 0.4 Wb. The EMF is 0.4 Wb ÷ 1 s = 0.4 V.',
  },
  {
    t: 'the EMF in a coil beside a magnet that is not moving', d: 2, need: 'reason',
    spec: loop({ variant: 'magnet', pole: 'N', motion: 'rest', turns: 200, meter: true }),
    alt: 'A bar magnet lies on the axis of a coil of wire that is joined to a meter. The number of turns of the coil is printed, the poles of the magnet are marked, and a note beside the magnet says how it is moving.',
    q: 'The figure shows a bar magnet and a coil that is joined to a meter. With the magnet where it is drawn, the magnetic flux through each turn of the coil is 3.0 × 10⁻⁴ Wb. What EMF, in volts, is induced in the coil?',
    n: '0',
    calc: ['induction_flux_change: the figure marks the magnet "at rest", so the flux is not changing and the EMF is zero whatever the flux and the number of turns', (c) => { if (c.txt('induction_flux_change') !== 'not changing') throw new Error('the flux is changing'); return 0; }],
    h: ['Faraday\'s law uses the CHANGE of flux in a time, not the flux itself.', 'Read from the figure what the magnet is doing, and decide how fast the flux through the coil is changing.'],
    s: 'Faraday\'s law gives the EMF as N × ΔΦ ÷ Δt: it depends on how fast the flux changes, not on how large the flux is. Read from the figure: the magnet is marked "at rest", so the flux through each of the 200 turns stays at 3.0 × 10⁻⁴ Wb and ΔΦ = 0. The induced EMF is 0 V, and the meter shows no current.',
  },
]);

G('ae321f2b.lo-3', 'Lenz\'s law, forwards and backwards', [
  {
    t: 'the pole the loop presents and the direction of the current, for an approaching north pole', d: 3, need: 'reason',
    spec: loop({ variant: 'magnet', pole: 'N', motion: 'toward', current: 'blank' }),
    alt: 'A bar magnet lies on the axis of a circular loop of wire, with its two poles marked and an arrow showing which way the magnet is moving. A question-mark box stands on the loop where the induced current would be drawn.',
    q: 'The figure shows a bar magnet moving along the axis of a wire loop. Which pole does the face of the loop nearest the magnet act as, and in which direction does the induced current run as seen from the magnet?',
    o: [
      ['A north pole; counterclockwise', 'correct'],
      ['A north pole; clockwise', 'applies Lenz\'s law correctly but turns the hand rule the wrong way'],
      ['A south pole; clockwise', 'has the loop attracting the approaching magnet, helping the change instead of opposing it'],
      ['A south pole; counterclockwise', 'has the loop attracting the approaching magnet and also turns the hand rule the wrong way'],
    ],
    holds: ['induction_current_direction as seen from the magnet; the near face of the loop repels an approaching pole (it is the same pole) and attracts a retreating one', (() => {
      const is = (face: string, dir: string) => (c: Ctx) => { if (c.p.motion === 'rest') throw new Error('the magnet is at rest'); const same = c.p.motion === 'toward'; const facePole = same ? c.p.pole : c.p.pole === 'N' ? 'S' : 'N'; return facePole === face && c.txt('induction_current_direction', { view: 'magnet' }) === dir; };
      return [is('N', 'counterclockwise'), is('N', 'clockwise'), is('S', 'clockwise'), is('S', 'counterclockwise')];
    })()],
    h: ['The induced current opposes the change that causes it. Decide whether the loop must push the magnet away or pull it closer.', 'Then use the right-hand rule: with the thumb along the field that the loop itself produces, the fingers curl the way the current runs. Take care to view the loop from the side the question names.'],
    s: 'Read from the figure: the north pole of the magnet faces the loop and the magnet is moving toward it, so the flux through the loop is increasing. By Lenz\'s law the induced current opposes this increase: the loop must repel the approaching north pole, so the face of the loop nearest the magnet acts as a north pole. The field of the loop then points out of that face toward the magnet, and by the right-hand rule the current runs counterclockwise as seen from the magnet.',
  },
  {
    t: 'the direction of a hidden field from the induced current drawn', d: 3, need: 'reason',
    spec: loop({ variant: 'field', field: 'into', position: 'leaving', direction: 'right', current: 'value', showField: 'blank' }),
    alt: 'A rectangular loop of wire lies partly inside a region of magnetic field whose direction is not shown: a question-mark box follows the words "field direction". An arrow shows the velocity of the loop, and arrowheads on the loop show the induced current.',
    q: 'The figure shows a wire loop being pulled out of a region of uniform magnetic field, with the induced current drawn on the loop. What is the direction of the magnetic field in the region?',
    o: [
      ['Into the page', 'correct'],
      ['Out of the page', 'has the induced field opposing the field itself instead of opposing the change of flux'],
      ['Toward the right of the page', 'takes the field to lie along the direction in which the loop moves'],
      ['Toward the top of the page', 'takes the field to lie in the plane of the loop, along one of its sides'],
    ],
    ck: ['induction_cause', {}],
    h: ['Use the right-hand rule on the current drawn to find the direction of the field that the induced current itself makes inside the loop.', 'The flux through the loop is getting smaller as it leaves, and the induced field tries to keep the flux as it was.'],
    s: 'Read from the figure: the loop is leaving the region, so the flux through it is decreasing, and the induced current runs clockwise (to the right along the top side). By the right-hand rule a clockwise current makes a field inside the loop directed into the page. By Lenz\'s law the induced field opposes the decrease, so it points the same way as the field that is being lost. The field in the region is directed into the page.',
  },
  {
    t: 'the induced current when both the field and its change are reversed', d: 3, need: 'reason',
    spec: loop({ variant: 'field', field: 'into', position: 'inside', change: 'decreasing', current: 'blank' }),
    alt: 'A rectangular loop of wire at rest inside a region of magnetic field marked with crosses; a caption says how the field strength is changing. A question-mark box stands on the loop where the induced current would be drawn.',
    q: 'The figure shows a wire loop at rest in a magnetic field that is changing as marked. Consider also a second case, not drawn: the same loop at rest in a field directed OUT of the page that is increasing. What is the direction of the induced current in the case drawn and in the second case?',
    o: [
      ['Clockwise in each of the two cases', 'correct'],
      ['Clockwise in the case drawn; counterclockwise in the second case', 'thinks that reversing the field must reverse the current, without looking at how the flux changes'],
      ['Counterclockwise in the case drawn; clockwise in the second case', 'has the induced field opposing the field itself in the case drawn'],
      ['Counterclockwise in each of the two cases', 'turns the hand rule the wrong way throughout'],
    ],
    holds: ['induction_current_direction for the figure as drawn, and for the same loop in a field out of the page that is increasing', (() => {
      const second = (c: Ctx): Spec => loop({ ...c.p, field: 'out', change: 'increasing' });
      const is = (drawn: string, other: string) => (c: Ctx) => c.txt('induction_current_direction') === drawn && c.txt('induction_current_direction', {}, { spec: second(c), what: 'field out of the page, increasing' }) === other;
      return [is('clockwise', 'clockwise'), is('clockwise', 'counterclockwise'), is('counterclockwise', 'clockwise'), is('counterclockwise', 'counterclockwise')];
    })()],
    h: ['In each case decide which way the induced field must point inside the loop to oppose the CHANGE of flux: to replace flux that is being lost, or to cancel flux that is being added.', 'Then use the right-hand rule to turn the direction of that induced field into a direction of current.'],
    s: 'Read from the figure: the field is directed into the page and is decreasing. The induced field must replace the flux that is being lost, so it points into the page, and by the right-hand rule the current is clockwise. In the second case the field points out of the page and is increasing; the induced field must cancel the added flux, so it again points into the page and the current is again clockwise. Reversing both the field and the way it changes leaves the induced current unchanged.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PHYSICS — Doppler wavefronts
// ════════════════════════════════════════════════════════════════════════════

// ── Doppler Shifts and Frequency Changes (pack 236) ─────────────────────────

G('9b765c71.lo-1', 'What the crowding of the wavefronts means', [
  {
    t: 'which observer the fronts reach more often, and the wavelength there', d: 2, need: 'reason',
    spec: dop({ speedRatio: 0.4, direction: 'left', observers: [{ position: 'ahead', label: 'P' }, { position: 'behind', label: 'Q' }] }),
    alt: 'Circular wavefronts around a source, with an arrow showing which way the source is moving. The circles are not concentric: they are crowded together on one side of the source and spread out on the other. Two observers, P and Q, are on the line of motion, one on each side.',
    q: 'The figure shows the wavefronts from a moving source and two observers at rest, P and Q. Which observer do the wavefronts reach more often each second, and how does the wavelength arriving there compare with the wavelength arriving at the other observer?',
    o: [
      ['P; a shorter wavelength', 'correct'],
      ['P; a longer wavelength', 'links fronts that arrive more often with waves that are longer'],
      ['Q; a shorter wavelength', 'places the crowded wavefronts behind the source'],
      ['Q; a longer wavelength', 'reads the wavelength correctly at Q but thinks spread-out fronts arrive more often'],
    ],
    holds: ['doppler_higher_frequency (the observer the source is moving toward): the fronts are closer together there, so the wavelength is shorter', (() => {
      const is = (who: string, wl: string) => (c: Ctx) => c.txt('doppler_higher_frequency') === who && wl === 'shorter';
      return [is('P', 'shorter'), is('P', 'longer'), is('Q', 'shorter'), is('Q', 'longer')];
    })()],
    h: ['See on which side of the source the wavefronts are drawn closer together.', 'Every front travels at the same speed, so fronts that are closer together pass an observer more often.'],
    s: 'Read from the figure: the source is moving to the left, toward P, and the wavefronts are crowded together on that side and spread out on the side of Q. The distance between neighbouring fronts is the wavelength, so the wavelength arriving at P is shorter. All the fronts travel at the same wave speed, so the closely spaced fronts pass P more often each second than the widely spaced fronts pass Q.',
  },
  {
    t: 'the false statement about a moving source and two observers', d: 3, need: 'reason',
    spec: dop({ speedRatio: 0.5, observers: [{ position: 'ahead', label: 'P' }, { position: 'behind', label: 'Q' }], emissionPoints: true }),
    alt: 'Circular wavefronts around a source, with an arrow showing which way the source is moving and a row of small dots marking where each front was emitted. The circles are crowded together on one side of the source and spread out on the other. Two observers, P and Q, are on the line of motion, one on each side.',
    q: 'The figure shows the wavefronts from a source moving through still air and two observers at rest, P and Q. Which statement is NOT correct?',
    o: [
      ['Q receives a higher frequency than the source emits', 'correct'],
      ['The source sends out as many wavefronts each second toward Q as toward P', 'true; picked by a reader who thinks the source itself emits more fronts in the direction it is moving'],
      ['Each wavefront travels outward at the same speed toward P and toward Q', 'true; picked by a reader who thinks the motion of the source is added to the speed of the wave'],
      ['The wavefronts arriving at P are closer together than they would be if the source were at rest', 'true; picked by a reader who places P behind the source'],
    ],
    holds: ['the side each observer is on (doppler_higher_frequency names the one ahead). A statement is the right answer when it is false: the observer behind receives a LOWER frequency; the source emits each front once, in all directions; every front is a circle that grows at the wave speed; the fronts ahead are closer together', [
      (c) => c.txt('doppler_higher_frequency') !== 'Q',
      () => false,
      () => false,
      (c) => c.txt('doppler_higher_frequency') !== 'P',
    ]],
    h: ['Each circle is one wavefront, sent out once in all directions from the place where the source was at that moment.', 'Use the arrow to decide which observer the source is approaching, and separate what the source does (how often it emits) from what each observer receives (how often fronts arrive).'],
    s: 'Read from the figure: the arrow shows the source moving toward P and away from Q, and the fronts are crowded on the side of P and spread out on the side of Q. Fronts that are further apart pass Q less often, so Q receives a LOWER frequency than the source emits; the statement about Q is false. The other three are true: each front is a complete circle, so the source sends the same number each second in every direction; the circles grow at the wave speed in every direction; and the fronts reaching P are closer together than for a source at rest.',
  },
]);

G('9b765c71.lo-2', 'Higher or lower: decided by the direction of motion', [
  {
    t: 'the pair of received frequencies that fits the figure', d: 2, need: 'reason',
    spec: dop({ speedRatio: 0.4, frequency: 420, direction: 'left', observers: [{ position: 'ahead' }, { position: 'behind' }], letterLabels: 'numerals' }),
    alt: 'Circular wavefronts around a source, with an arrow showing which way the source is moving. The circles are crowded together on one side of the source and spread out on the other. Two numbered observers are on the line of motion, one on each side; the frequency of the source is printed under the figure.',
    q: 'The figure shows the wavefronts from a moving source, which emits the frequency printed under the figure, and two observers at rest. Which pair of frequencies could the two observers receive?',
    o: [
      ['Observer 1: 700 Hz; observer 2: 300 Hz', 'correct'],
      ['Observer 1: 300 Hz; observer 2: 700 Hz', 'has the frequency falling ahead of the source and rising behind it'],
      ['Observer 1: 700 Hz; observer 2: 700 Hz', 'thinks any motion of the source raises the frequency for everyone'],
      ['Observer 1: 420 Hz; observer 2: 420 Hz', 'thinks only a moving observer, not a moving source, changes the frequency received'],
    ],
    holds: ['doppler_observed_frequency for each observer, with the ratio of the speeds that the figure is drawn for', (() => {
      const is = (f1: number, f2: number) => (c: Ctx) => near(c.num('doppler_observed_frequency', { observer: '1', speedRatio: c.p.speedRatio }), f1) && near(c.num('doppler_observed_frequency', { observer: '2', speedRatio: c.p.speedRatio }), f2);
      return [is(700, 300), is(300, 700), is(700, 700), is(420, 420)];
    })()],
    h: ['Decide which observer the source is moving toward and which it is moving away from.', 'An observer the source approaches receives more than the emitted frequency; an observer it leaves receives less.'],
    s: 'Read from the figure: the arrow shows the source moving to the left, toward observer 1 and away from observer 2, and the source emits 420 Hz. The fronts are crowded on the side of observer 1, who therefore receives a frequency above 420 Hz, and spread out on the side of observer 2, who receives a frequency below 420 Hz. Only the pair 700 Hz and 300 Hz fits.',
  },
  {
    t: 'how the received frequency changes when the source turns round', d: 3, need: 'reason',
    spec: dop({ speedRatio: 0.3, observers: [{ position: 'behind', label: 'P' }] }),
    alt: 'Circular wavefronts around a source, with an arrow showing which way the source is moving. The circles are crowded together on one side of the source and spread out on the other. One observer, P, is on the line of motion.',
    q: 'The figure shows the wavefronts from a moving source that emits a frequency f, and an observer at rest, P. The source then turns round and travels at the same speed in the opposite direction along the same line. How does the frequency that P receives change when the source turns round?',
    o: [
      ['It rises from below f to above f', 'correct'],
      ['It falls from above f to below f', 'places P ahead of the source in the figure'],
      ['It rises, but stays below f', 'thinks an observer who starts behind the source always receives less than f'],
      ['It does not change', 'thinks only the speed of the source matters, not its direction'],
    ],
    holds: ['the side of the source the observer is on in the spec: behind (the source is leaving, so the frequency received is below f), and ahead after the turn (above f)', pick('', (c) => { const o = arr(c.p.observers); if (o.length !== 1) throw new Error('one observer expected'); return o[0].position === 'behind' ? 'below→above' : 'above→below'; }, ['below→above', 'above→below', 'below→below', 'same'])[1]],
    h: ['Use the arrow and the position of P to decide whether the source is approaching P or leaving P in the figure.', 'After the turn the answer to that question is reversed. Compare each case with the frequency f that the source emits.'],
    s: 'Read from the figure: the arrow points away from P, and P is on the side where the wavefronts are spread out, so the source is moving away from P and P receives a frequency below f. After the source turns round it travels toward P, the fronts on that side are crowded together, and P receives a frequency above f. The frequency received rises from below f to above f.',
  },
]);

G('9b765c71.lo-3', 'The Doppler equation with the sign chosen from the figure', [
  {
    t: 'the frequency received by the observer the source is leaving', d: 2, need: 'calc',
    spec: dop({ waveSpeed: 340, sourceSpeed: 60, frequency: 600, direction: 'left', observers: [{ position: 'ahead' }, { position: 'behind' }], letterLabels: 'numerals' }),
    alt: 'Circular wavefronts around a moving source, with its speed printed on the arrow that shows its direction. Two numbered observers are on the line of motion, one on each side of the source. The wave speed and the frequency of the source are printed under the figure.',
    q: 'The figure shows a moving source of sound, with its speed, the speed of sound and the frequency it emits, and two observers at rest. What frequency, in hertz, does observer 2 receive?',
    n: '510',
    ck: ['doppler_observed_frequency', { observer: '2' }],
    h: ['Decide from the arrow whether the source is moving toward observer 2 or away from observer 2.', 'For a source moving away, the speed of the source is ADDED to the speed of sound in the denominator of the Doppler equation.'],
    s: 'Read from the figure: the source moves to the left at 60 m/s, away from observer 2; the speed of sound is 340 m/s and the source emits 600 Hz. For a source moving away from an observer at rest, f′ = f × v ÷ (v + v_source) = 600 × 340 ÷ (340 + 60) = 600 × 340 ÷ 400 = 510 Hz, lower than the emitted frequency, as it must be.',
  },
  {
    t: 'the distance between wavefronts ahead of the source', d: 3, need: 'calc',
    spec: dop({ waveSpeed: 340, sourceSpeed: 40, frequency: 600, observers: [{ position: 'ahead', label: 'P' }] }),
    alt: 'Circular wavefronts around a moving source, with its speed printed on the arrow that shows its direction. One observer, P, is on the line of motion. The wave speed and the frequency of the source are printed under the figure.',
    q: 'The figure shows a moving source of sound, with its speed, the speed of sound and the frequency it emits, and an observer at rest, P. What is the distance, in metres, between successive wavefronts arriving at P?',
    n: '0.5',
    ck: ['doppler_wavelength', { observer: 'P' }],
    alts: ['through the frequency P receives (f × v ÷ (v − v_source)) and then v ÷ that frequency', (c) => { const p = c.p as { waveSpeed: number; sourceSpeed: number; frequency: number }; return [p.waveSpeed / ((p.frequency * p.waveSpeed) / (p.waveSpeed - p.sourceSpeed))]; }],
    h: ['Decide from the arrow whether the source is moving toward P, and find the frequency that P receives.', 'The fronts still travel at the speed of sound, so the distance between them is the speed of sound divided by the frequency received.'],
    s: 'Read from the figure: the source moves at 40 m/s toward P; the speed of sound is 340 m/s and the source emits 600 Hz. P receives f′ = 600 × 340 ÷ (340 − 40) = 680 Hz. The fronts arrive at the speed of sound, so their spacing is 340 ÷ 680 = 0.5 m. (Directly: in one period the front moves 340 ÷ 600 m and the source follows it by 40 ÷ 600 m, leaving 300 ÷ 600 = 0.5 m.)',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PHYSICS — photoelectric effect
// ════════════════════════════════════════════════════════════════════════════

// ── Photoelectric Effect Fundamentals (pack 229) ────────────────────────────

G('7aae9be7.lo-2', 'The work function read from a graph', [
  {
    t: 'the work function from the frequency at which emission begins', d: 2, need: 'calc',
    spec: photo({ variant: 'graph', metals: [{ threshold: 5 }], fMax: 9, xStep: 1, yRange: [0, 2], yStep: 0.5 }),
    alt: 'One straight line that starts at a point on the frequency axis and rises to the right; to the left of that point nothing is drawn. Both axes are numbered.',
    q: 'The graph shows how the maximum kinetic energy of the electrons emitted from a metal depends on the frequency of the light. Using h = 4.14 × 10⁻¹⁵ eV·s, what is the work function of the metal, in eV, to two decimal places?',
    n: '2.07',
    ck: ['photo_work_function', {}],
    alts: ['h = 4.14 × 10⁻¹⁵ eV·s, and h = 6.63 × 10⁻³⁴ J·s with 1 eV = 1.6 × 10⁻¹⁹ J, each times the threshold frequency of the spec', (c) => { const f0 = arr(c.p.metals)[0].threshold as number; return [H_STEM * f0, H_SI * f0]; }],
    h: ['Find the lowest frequency at which electrons are emitted at all: the point where the line leaves the frequency axis.', 'A photon of exactly that frequency has just enough energy to free an electron, with none left over.'],
    s: 'The work function is the smallest photon energy that can eject an electron, so it equals the energy of a photon at the threshold frequency, where the maximum kinetic energy is zero. Read from the graph: the line leaves the frequency axis at 5 × 10¹⁴ Hz. The work function is hf₀ = 4.14 × 10⁻¹⁵ × 5 × 10¹⁴ = 2.07 eV.',
  },
  {
    t: 'the difference between two work functions from the intercepts on the energy axis', d: 2, need: 'reason',
    spec: photo({ variant: 'graph', metals: [{ workFunction: 2, label: 'metal P' }, { workFunction: 3, label: 'metal Q' }], extend: true, fMax: 12, xStep: 2, yRange: [-4, 2], yStep: 1 }),
    alt: 'Two parallel straight lines, a solid one and a dashed one, each rising to the right from a point on the frequency axis. Thin dashes continue each line down and to the left until it meets the energy axis below zero. Both axes are numbered.',
    q: 'The graph shows the maximum kinetic energy of the emitted electrons against the frequency of the light for two metals; thin dashes continue each line back to the energy axis. By how many eV is the work function of metal Q greater than the work function of metal P?',
    n: '1',
    calc: ['photo_work_function for metal Q minus photo_work_function for metal P (each read where the continued line meets the numbered energy axis)', (c) => c.num('photo_work_function', { metal: 1 }) - c.num('photo_work_function', { metal: 0 })],
    h: ['The lines follow KE = hf − W. Decide what the equation gives when the frequency is zero.', 'Read where each continued line meets the energy axis, and take care with the sign.'],
    s: 'Each line follows KE_max = hf − W, so continued back to f = 0 it meets the energy axis at −W. Read from the graph: the continued line of metal P meets the energy axis at −2 eV and the continued line of metal Q at −3 eV, so the work functions are 2 eV and 3 eV. The work function of metal Q is greater by 3 − 2 = 1 eV.',
  },
]);

G('7aae9be7.lo-3', 'Photon energy and frequency', [
  {
    t: 'the ratio of two photon energies, not of the plotted kinetic energies', d: 3, need: 'reason',
    spec: photo({ variant: 'graph', metals: [{ threshold: 4 }], fMax: 14, xStep: 2, yRange: [0, 5], yStep: 1, marks: [{ frequency: 8, label: 'R' }, { frequency: 12, label: 'S' }] }),
    alt: 'One straight line that starts at a point on the frequency axis and rises to the right, with two lettered dots, R and S, marked on it. Both axes are numbered.',
    q: 'The graph shows the maximum kinetic energy of the electrons emitted from a metal against the frequency of the light; the dots R and S mark two kinds of light that were used. How many times as large as the energy of one photon of the light at R is the energy of one photon of the light at S?',
    n: '1.5',
    calc: ['photo_photon_energy at the frequency of S ÷ photo_photon_energy at the frequency of R (the two marked frequencies of the spec, both on numbered gridlines)', (c) => { const m = arr(c.p.marks); const f = (l: string) => m.find((k) => k.label === l)!.frequency as number; return round(c.num('photo_photon_energy', { frequency: f('S') }) / c.num('photo_photon_energy', { frequency: f('R') }), 6); }],
    h: ['The energy of a photon is given by E = hf: it depends on the frequency of the light only.', 'The vertical axis shows the kinetic energy of the ELECTRONS, which is what is left of the photon energy after the electron has escaped. Read the axis that E = hf needs.'],
    s: 'The energy of a photon is E = hf, so the ratio of two photon energies is the ratio of the two frequencies. Read from the graph: R is at 8 × 10¹⁴ Hz and S is at 12 × 10¹⁴ Hz, so the photons at S have 12 ÷ 8 = 1.5 times the energy of the photons at R. (The heights of the dots give the kinetic energy of the electrons, hf − W, which is not proportional to the photon energy.)',
  },
]);

G('7aae9be7.lo-4', 'Whether electrons are emitted', [
  {
    t: 'which of two metals emits at a stated frequency, and which has the larger work function', d: 3, need: 'reason',
    spec: photo({ variant: 'graph', metals: [{ threshold: 4, label: 'metal P' }, { threshold: 7, label: 'metal Q' }], fMax: 12, xStep: 1, yRange: [0, 4], yStep: 1 }),
    alt: 'Two parallel straight lines, a solid one and a dashed one, each starting at its own point on the frequency axis and rising to the right. A legend names the two metals. Both axes are numbered.',
    q: 'The graph shows the maximum kinetic energy of the emitted electrons against the frequency of the light for two metals. Light of frequency 6 × 10¹⁴ Hz shines on both metals. Which of the metals emit electrons, and which metal has the larger work function?',
    o: [
      ['Only P emits; Q has the larger work function', 'correct'],
      ['Only Q emits; Q has the larger work function', 'thinks a larger work function makes emission easier'],
      ['Only P emits; P has the larger work function', 'takes the metal that emits to be the one that holds its electrons more tightly'],
      ['P and Q emit; Q has the larger work function', 'imagines the line of Q continuing to the left of the point where it starts'],
    ],
    holds: ['photo_emits for each metal at 6 × 10¹⁴ Hz and photo_larger_work_function', (() => {
      const is = (p: boolean, q: boolean, larger: string) => (c: Ctx) => (c.txt('photo_emits', { frequency: 6, metal: 0 }) === 'yes') === p && (c.txt('photo_emits', { frequency: 6, metal: 1 }) === 'yes') === q && c.txt('photo_larger_work_function') === larger;
      return [is(true, false, 'metal Q'), is(false, true, 'metal Q'), is(true, false, 'metal P'), is(true, true, 'metal Q')];
    })()],
    h: ['For each metal, find the frequency at which its line leaves the frequency axis: below that frequency no electrons are emitted.', 'A photon at that threshold frequency has an energy equal to the work function, so compare the two thresholds.'],
    s: 'Read from the graph: the line of metal P leaves the frequency axis at 4 × 10¹⁴ Hz and the line of metal Q at 7 × 10¹⁴ Hz. Light of 6 × 10¹⁴ Hz is above the threshold of P and below the threshold of Q, so only P emits electrons. The work function equals h times the threshold frequency, so the metal with the higher threshold, Q, has the larger work function.',
  },
  {
    t: 'whether the light shown ejects electrons, and the wavelengths that would', d: 3, need: 'calc',
    spec: photo({ variant: 'tube', wavelength: 620, workFunction: 2.5 }),
    alt: 'A photoelectric tube: light falls on a metal plate that faces a collector inside an evacuated tube, and a meter and a variable source are joined to the two plates outside it. The wavelength of the light and the work function of the plate are printed. No electrons are drawn.',
    q: 'The figure shows light falling on the metal plate of a photoelectric tube, with the wavelength of the light and the work function of the metal. Taking hc = 1240 eV·nm, does this light eject electrons from the plate, and which wavelengths of light would?',
    o: [
      ['No; only wavelengths of 496 nm or shorter', 'correct'],
      ['No; only wavelengths of 496 nm or longer', 'finds the limiting wavelength but thinks longer waves carry more energy'],
      ['Yes; any wavelength up to 620 nm', 'assumes the tube is working as drawn and takes the light shown as the limit'],
      ['Yes; any wavelength of 496 nm or longer', 'finds 496 nm and compares it with 620 nm as if a longer wavelength meant more energy'],
    ],
    holds: ['photo_emits for the light and the plate printed, and the limiting wavelength 1240 ÷ the printed work function', (() => {
      const is = (emits: boolean, limit: number, side: 'shorter' | 'longer') => (c: Ctx) => { const p = c.p as { workFunction: number; wavelength: number }; const cut = 1240 / p.workFunction; return (c.txt('photo_emits', {}) === 'yes') === emits && near(limit, cut) && side === 'shorter'; };
      return [is(false, 496, 'shorter'), is(false, 496, 'longer'), is(true, 620, 'shorter'), is(true, 496, 'longer')];
    })()],
    h: ['Find the energy of one photon of this light from its wavelength, and compare it with the work function.', 'The limiting wavelength is the one whose photon energy equals the work function. A shorter wavelength means a higher frequency.'],
    s: 'Read from the figure: the light has a wavelength of 620 nm and the plate has a work function of 2.5 eV. One photon carries 1240 ÷ 620 = 2.0 eV, less than 2.5 eV, so no electrons are ejected. A photon has just enough energy when 1240 ÷ λ = 2.5, that is λ = 496 nm. Photon energy rises as the wavelength falls, so only light of 496 nm or shorter ejects electrons.',
  },
]);

G('7aae9be7.lo-5', 'Energy conservation for the fastest electrons', [
  {
    t: 'the hidden work function from the wavelength and the stopping voltage', d: 2, need: 'calc',
    spec: photo({ variant: 'tube', wavelength: 310, workFunction: 2.5, showWorkFunction: 'blank', showStoppingVoltage: 'value' }),
    alt: 'A photoelectric tube: light falls on a metal plate that faces a collector inside an evacuated tube, and a meter and a variable source are joined to the two plates outside it. The wavelength of the light and the stopping voltage of the source are printed; the work function of the plate is a question-mark box.',
    q: 'The figure shows a photoelectric tube. The reverse voltage printed on it is the smallest voltage that stops even the fastest emitted electrons, so their maximum kinetic energy in eV is equal to that voltage in volts. Taking hc = 1240 eV·nm, what work function, in eV, belongs in the ? box?',
    n: '2.5',
    calc: ['photo_work_function with the stopping voltage the figure prints (photon energy from the printed wavelength minus the maximum kinetic energy)', (c) => { const p = c.p as { wavelength: number; workFunction: number }; const printed = round(1240 / p.wavelength - p.workFunction, 2); if (c.p.showStoppingVoltage !== 'value') throw new Error('the stopping voltage is not printed'); return c.num('photo_work_function', { stoppingVoltage: printed }); }],
    alts: ['with the photon energy from h = 6.63 × 10⁻³⁴ J·s, c = 3.0 × 10⁸ m/s and 1 eV = 1.6 × 10⁻¹⁹ J, rounded to one decimal place before subtracting, and unrounded', (c) => { const p = c.p as { wavelength: number; workFunction: number }; const ke = round(1240 / p.wavelength - p.workFunction, 2); const e = (6.63e-34 * 3.0e8) / (p.wavelength * 1e-9) / 1.6e-19; return [round(e, 1) - ke, e - ke]; }],
    h: ['Find the energy of one photon of the light from its wavelength.', 'The photon energy is shared between freeing the electron and the kinetic energy of the fastest electrons: KE_max = photon energy − work function.'],
    s: 'Read from the figure: the light has a wavelength of 310 nm and the stopping voltage is 1.5 V, so the fastest electrons have a kinetic energy of 1.5 eV. One photon carries 1240 ÷ 310 = 4.0 eV. By conservation of energy KE_max = photon energy − work function, so the work function is 4.0 − 1.5 = 2.5 eV.',
  },
  {
    t: 'the difference between the maximum kinetic energies from two metals in the same light', d: 3, need: 'calc',
    spec: photo({ variant: 'graph', metals: [{ threshold: 3, label: 'metal P' }, { threshold: 6, label: 'metal Q' }], fMax: 12, xStep: 1, yRange: [0, 4], yStep: 1 }),
    alt: 'Two parallel straight lines, a solid one and a dashed one, each starting at its own point on the frequency axis and rising to the right. A legend names the two metals. Both axes are numbered.',
    q: 'The graph shows the maximum kinetic energy of the emitted electrons against the frequency of the light for two metals. Light of frequency 10 × 10¹⁴ Hz shines on both metals. Using h = 4.14 × 10⁻¹⁵ eV·s, by how many eV does the maximum kinetic energy of the electrons from metal P exceed that of the electrons from metal Q? Give your answer to two decimal places.',
    n: '1.24',
    calc: ['photo_ke_max at 10 × 10¹⁴ Hz for metal P minus photo_ke_max at 10 × 10¹⁴ Hz for metal Q', (c) => c.num('photo_ke_max', { frequency: 10, metal: 0 }) - c.num('photo_ke_max', { frequency: 10, metal: 1 })],
    alts: ['h × the difference of the thresholds; each kinetic energy rounded to two places first; both with h = 4.14 × 10⁻¹⁵ eV·s and with h = 6.63 × 10⁻³⁴ J·s, 1 eV = 1.6 × 10⁻¹⁹ J', (c) => { const t = arr(c.p.metals).map((m) => m.threshold as number); return [H_STEM, H_SI].flatMap((h) => [h * (t[1] - t[0]), round(h * (10 - t[0]), 2) - round(h * (10 - t[1]), 2)]); }],
    h: ['For each metal KE_max = hf − W, and W is h times the frequency at which that metal\'s line leaves the axis.', 'The light is the same for both metals, so when you subtract, the term hf is the same in both.'],
    s: 'For each metal KE_max = hf − hf₀, where f₀ is its threshold frequency. Read from the graph: the line of metal P leaves the frequency axis at 3 × 10¹⁴ Hz and the line of metal Q at 6 × 10¹⁴ Hz. In the same light the term hf cancels, so the difference is h × (6 − 3) × 10¹⁴ = 4.14 × 10⁻¹⁵ × 3 × 10¹⁴ = 1.24 eV. (Separately: 2.90 eV for P and 1.66 eV for Q.)',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// DATA TABLES — AP CALCULUS AB
// ════════════════════════════════════════════════════════════════════════════

// ── Riemann and Trapezoidal Sum Approximations (pack 103) ───────────────────

G('204491c4.lo-3', 'Right and left sums compared when a value is missing', [
  {
    t: 'right sum minus left sum with one table value hidden', d: 4, need: 'reason',
    spec: table(['x', 'f(x)'], [[0, 5], [3, 8], [6, '?'], [9, 10], [12, 13]]),
    alt: 'The first column holds five values of x that go up in equal steps; the second holds the values of f, one of which, in the middle of the table, is hidden behind a question-mark box.',
    q: 'The table gives values of a function f at five values of x; one value is hidden behind a ? box. Using the four subintervals of the table, by how much does the right Riemann sum for the integral of f from 0 to 12 exceed the left Riemann sum?',
    n: '24',
    calc: ['right sum − left sum from the printed table values, computed twice with two different numbers in the hidden cell: the result must not depend on it', (c) => {
      const x = tcol(c, 0); const f = tcol(c, 1);
      const diff = (k: number): number => { const g = f.map((v) => (Number.isNaN(v) ? k : v)); return rightSum(x, g) - leftSum(x, g); };
      if (f.filter(Number.isNaN).length !== 1 || !near(diff(0), diff(1000))) throw new Error('the difference depends on the hidden value');
      return diff(0);
    }],
    h: ['Write out the two sums term by term, with a letter for the hidden value.', 'Most of the terms appear in both sums. See what is left when one sum is subtracted from the other.'],
    s: 'Read from the table: the subintervals all have width 3, with f(0) = 5 and f(12) = 13; call the hidden value k. Right sum = 3 × (8 + k + 10 + 13) and left sum = 3 × (5 + 8 + k + 10). Subtracting, the terms 8, k and 10 cancel, leaving 3 × (13 − 5) = 24. The difference is Δx × [f(12) − f(0)], so the hidden value is not needed.',
  },
]);

G('204491c4.lo-5', 'A trapezoidal sum run backwards', [
  {
    t: 'the hidden table value that gives a stated trapezoidal sum', d: 3, need: 'calc',
    spec: table(['x', 'f(x)'], [[0, 6], [2, 10], [4, '?'], [6, 14], [8, 8]]),
    alt: 'The first column holds five values of x that go up in equal steps; the second holds the values of f, one of which, in the middle of the table, is hidden behind a question-mark box.',
    q: 'The table gives values of a function f; one value is hidden behind a ? box. The trapezoidal sum for the integral of f from 0 to 8 that uses the four subintervals of the table is equal to 100. What is the hidden value?',
    n: '19',
    calc: ['the trapezoidal sum of the table is linear in the hidden value k: with T(0) and T(1) computed from the printed values, k = (100 − T(0)) ÷ (T(1) − T(0))', (c) => {
      const x = tcol(c, 0); const f = tcol(c, 1);
      const t = (k: number): number => trapSum(x, f.map((v) => (Number.isNaN(v) ? k : v)));
      const k = (100 - t(0)) / (t(1) - t(0));
      if (!near(t(k), 100)) throw new Error('no value gives 100');
      return k;
    }],
    h: ['Write the trapezoidal sum with a letter for the hidden value; each interior table value is counted twice, each end value once.', 'Set the expression equal to the stated sum and solve for the letter.'],
    s: 'Read from the table: the four subintervals each have width 2, and the values are 6, 10, k, 14 and 8. The trapezoidal sum is (2 ÷ 2) × [6 + 2(10) + 2k + 2(14) + 8] = 62 + 2k. Setting 62 + 2k = 100 gives k = 19.',
  },
]);

G('204491c4.lo-6', 'Over- and underestimates judged from the pattern of a table', [
  {
    t: 'the order of a left sum, a trapezoidal sum and the integral, from table values', d: 3, need: 'reason',
    spec: table(['x', 'f(x)'], [[0, 2], [1, 7], [2, 10], [3, 12], [4, 13]]),
    alt: 'The first column holds five values of x that go up in equal steps; the second holds the five values of f.',
    q: 'The table gives values of a function f that is twice differentiable on [0, 4]; neither f′ nor f″ changes sign there. Let L be the left Riemann sum and T the trapezoidal sum for the integral I of f from 0 to 4, each using the four subintervals of the table. Which ordering is correct?',
    o: [
      ['L < T < I', 'correct'],
      ['L < I < T', 'takes the trapezoidal sum of this function to be an overestimate, as for a graph that is concave up'],
      ['T < L < I', 'knows both sums are too small but puts the trapezoidal sum below the left sum'],
      ['I < T < L', 'treats the function as decreasing, so that the left sum is the largest'],
    ],
    holds: ['from the table values: f increasing (all first differences positive) makes L < T, since T is the mean of the left and right sums; first differences that shrink (f′ decreasing, f″ < 0 with no sign change) make T < I', (() => {
      const order = (c: Ctx): string => {
        const x = tcol(c, 0); const f = tcol(c, 1);
        const d1 = f.slice(1).map((v, k) => v - f[k]); const d2 = d1.slice(1).map((v, k) => v - d1[k]);
        if (!d1.every((v) => v > 0) || !d2.every((v) => v < 0)) throw new Error('the table is not increasing with shrinking differences');
        if (!(leftSum(x, f) < trapSum(x, f))) throw new Error('L is not below T');
        return 'L<T<I';
      };
      return ['L<T<I', 'L<I<T', 'T<L<I', 'I<T<L'].map((o) => (c: Ctx) => order(c) === o);
    })()],
    h: ['Look at how f changes from row to row to decide whether it is increasing or decreasing; that settles whether a left sum is too small or too large.', 'Then look at whether those changes are growing or shrinking: that gives the concavity, which settles the trapezoidal sum.'],
    s: 'Read from the table: f rises at every step (2, 7, 10, 12, 13), so f is increasing and each left-endpoint rectangle lies under the graph: L < I, and also L < T, because T is the average of the left and right sums. The increases shrink (5, 3, 2, 1), so f′ is decreasing and the graph is concave down; each trapezoid then lies under the graph, so T < I. Together: L < T < I. (Here L = 31 and T = 36.5.)',
  },
]);

// ── Average and Instantaneous Rates of Change (pack 129) ────────────────────

G('9e26ac42.lo-1', 'Average rates over intervals of unequal length', [
  {
    t: 'the interval of a table with the greatest average rate of change', d: 2, need: 'calc',
    spec: table([{ header: 't', unit: 'min' }, { header: 'h', unit: 'cm' }], [[0, 4], [2, 10], [5, 18], [9, 22], [10, 24]]),
    alt: 'The first column holds five times in minutes, which are not equally spaced; the second holds the depth in centimetres at each time.',
    q: 'The table gives the depth h of the water in a tank at five times t. Over which of these intervals is the average rate of change of the depth greatest?',
    o: [
      ['From t = 0 to t = 2', 'correct'],
      ['From t = 2 to t = 5', 'picks the largest change in depth without dividing by the time taken'],
      ['From t = 5 to t = 9', 'picks the longest interval'],
      ['From t = 9 to t = 10', 'picks the shortest interval, expecting the smallest divisor to give the largest rate'],
    ],
    holds: ['table_average_rate between each pair of neighbouring rows: the option holds when its interval has the single greatest rate', [0, 1, 2, 3].map((k) => (c: Ctx) => { const r = [0, 1, 2, 3].map((i) => c.num('table_average_rate', { x: 0, y: 1, from: i, to: i + 1 })); return r.every((v, i) => i === k || v < r[k] - 1e-9); })],
    h: ['For each interval divide the change in depth by the change in time.', 'The intervals have different lengths, so a large change in depth does not by itself mean a large rate.'],
    s: 'The average rate of change is Δh ÷ Δt. Read from the table: from 0 to 2 it is (10 − 4) ÷ 2 = 3 cm/min; from 2 to 5 it is (18 − 10) ÷ 3 ≈ 2.7 cm/min; from 5 to 9 it is (22 − 18) ÷ 4 = 1 cm/min; from 9 to 10 it is (24 − 22) ÷ 1 = 2 cm/min. The greatest is 3 cm/min, from t = 0 to t = 2, even though the depth changes most from t = 2 to t = 5.',
  },
]);

G('9e26ac42.lo-2', 'An instantaneous rate estimated between table entries', [
  {
    t: 'velocity at a time between two rows, from the closest entries', d: 2, need: 'calc',
    spec: table([{ header: 't', unit: 's' }, { header: 's', unit: 'm' }], [[2, 3], [4, 10], [6, 18], [9, 24]]),
    alt: 'The first column holds four times in seconds, which are not equally spaced; the second holds the position in metres at each time.',
    q: 'The table gives the position s of a cart at four times t. Using the two table entries closest to t = 5 s, one on each side, what is the best estimate of the instantaneous velocity of the cart at t = 5 s, in metres per second?',
    n: '4',
    ck: ['table_average_rate', { x: 0, y: 1, from: 1, to: 2 }],
    h: ['Find the two rows whose times are closest to the time asked about, one before it and one after it.', 'The average rate of change of position over that short interval is the estimate of the velocity inside it.'],
    s: 'An instantaneous rate is estimated by the average rate over the shortest interval that contains the time. Read from the table: the entries closest to t = 5 s are at t = 4 s, where s = 10 m, and at t = 6 s, where s = 18 m. The estimate is (18 − 10) ÷ (6 − 4) = 4 m/s.',
  },
]);

// ── Chain Rule for Composite Functions (pack 137) ───────────────────────────

G('bf93975f.lo-4', 'The chain rule with every value looked up', [
  {
    t: 'the derivative of f(g(x)) + g(f(x)) at one point', d: 3, need: 'calc',
    spec: table(FG_COLS, [[1, 3, 2, 2, -1], [2, 4, 5, 1, 3], [3, 1, -2, 4, 6], [4, 2, 1, 3, 2]]),
    alt: 'Each row gives, for one value of x, the values of two functions f and g and of their derivatives.',
    q: 'The table gives values of two differentiable functions f and g and of their derivatives. Let h(x) = f(g(x)) + g(f(x)). What is h′(1)?',
    n: '7',
    calc: ['f′(g(1)) · g′(1) + g′(f(1)) · f′(1), every value by table_lookup in the row its input names', (c) => { const at = (col: number, x: number) => look(c, 0, x, col); return at(2, at(3, 1)) * at(4, 1) + at(4, at(1, 1)) * at(2, 1); }],
    h: ['Differentiate each of the two terms with the chain rule: the derivative of the outer function is evaluated at the VALUE of the inner function.', 'So for each term, first look up the inner function at x = 1; that value tells you which row to use for the outer derivative.'],
    s: 'By the chain rule h′(x) = f′(g(x)) · g′(x) + g′(f(x)) · f′(x). Read from the table: g(1) = 2 and g′(1) = −1, and in the row x = 2, f′(2) = 5, so the first term is 5 × (−1) = −5. Also f(1) = 3 and f′(1) = 2, and in the row x = 3, g′(3) = 6, so the second term is 6 × 2 = 12. Therefore h′(1) = −5 + 12 = 7.',
  },
  {
    t: 'the x in the table at which the derivative of f(g(x)) is greatest', d: 3, need: 'calc',
    spec: table(FG_COLS, [[1, 2, 4, 3, -1], [2, 3, 1, 1, 3], [3, 4, -2, 4, 2], [4, 1, 5, 2, 6]]),
    alt: 'Each row gives, for one value of x, the values of two functions f and g and of their derivatives.',
    q: 'The table gives values of two differentiable functions f and g and of their derivatives. At which of the four values of x in the table is the derivative of f(g(x)) greatest?',
    n: '2',
    calc: ['f′(g(x)) · g′(x) for each x of the table (by table_lookup): the x with the single greatest value', (c) => { const at = (col: number, x: number) => look(c, 0, x, col); const xs = tcol(c, 0); const d = xs.map((x) => at(2, at(3, x)) * at(4, x)); const best = Math.max(...d); if (d.filter((v) => near(v, best)).length !== 1) throw new Error('a tie'); return xs[d.indexOf(best)]; }],
    h: ['The derivative of f(g(x)) is f′(g(x)) · g′(x): the factor f′ is taken from the row named by the VALUE of g, not from the row of x itself.', 'Work out the product for each of the four rows and compare.'],
    s: 'The derivative of f(g(x)) is f′(g(x)) · g′(x). Read from the table: at x = 1, g = 3 and g′ = −1, giving f′(3) × (−1) = (−2)(−1) = 2. At x = 2, g = 1 and g′ = 3, giving f′(1) × 3 = 4 × 3 = 12. At x = 3, g = 4 and g′ = 2, giving f′(4) × 2 = 5 × 2 = 10. At x = 4, g = 2 and g′ = 6, giving f′(2) × 6 = 1 × 6 = 6. The greatest value, 12, is at x = 2.',
  },
]);

// ── Derivatives of inverse functions (pack 146) ─────────────────────────────

G('f883acea.lo-3', 'The tangent line to an inverse function from a table', [
  {
    t: 'the y-intercept of the tangent to the inverse function', d: 3, need: 'calc',
    spec: table(['x', 'f(x)', 'f′(x)'], [[1, 2, 3], [2, 5, 4], [5, 9, 2]]),
    alt: 'Each row gives, for one value of x, the value of a function f and the value of its derivative.',
    q: 'The table gives values of a differentiable, increasing function f and of its derivative. The line tangent to the graph of the inverse function f⁻¹ at x = 5 crosses the y-axis at what value of y? Give your answer as a decimal.',
    n: '0.75',
    calc: ['the row where f(x) = 5 gives the point (5, x) on the inverse and the slope 1 ÷ f′(x) (table_lookup); the tangent line there, evaluated at 0', (c) => { const x0 = look(c, 1, 5, 0); const slope = 1 / look(c, 1, 5, 2); return x0 + slope * (0 - 5); }],
    h: ['To find f⁻¹(5), look for 5 in the column of VALUES of f, not in the column of x.', 'The slope of the inverse at that point is the reciprocal of f′ at the matching x. With a point and a slope, write the line and set x = 0.'],
    s: 'Read from the table: f(2) = 5, so f⁻¹(5) = 2 and the tangent line touches the graph of f⁻¹ at the point (5, 2). Its slope is (f⁻¹)′(5) = 1 ÷ f′(2) = 1 ÷ 4. The line is y − 2 = (1/4)(x − 5); at x = 0 this gives y = 2 − 5/4 = 0.75. (The row x = 5 is not the one to use: there 5 is an input of f, not a value of f.)',
  },
]);

// ── Intermediate Value Theorem Application (pack 113) ───────────────────────

G('47ff9a07.lo-3', 'The Intermediate Value Theorem on every subinterval of a table', [
  {
    t: 'the value of k that the theorem guarantees in every subinterval', d: 3, need: 'reason',
    spec: table(['x', 'f(x)'], [[0, 1], [2, 7], [4, 3], [6, 9], [8, 4]]),
    alt: 'The first column holds five values of x that go up in equal steps; the second holds the five values of f, which rise and fall from row to row.',
    q: 'The table gives values of a function f that is continuous on [0, 8]. For which value of k does the Intermediate Value Theorem guarantee a solution of f(x) = k in every one of the four subintervals of the table?',
    o: [
      ['k = 5', 'correct'],
      ['k = 2', 'lies between the two table values of the first subinterval only'],
      ['k = 8', 'lies between the table values of the last two subintervals only'],
      ['k = 3.5', 'lies between the table values of the first three subintervals but not of the last'],
    ],
    holds: ['for the k of each option: strictly between the two printed values of f at the ends of all four subintervals', [5, 2, 8, 3.5].map((k) => (c: Ctx) => { const f = tcol(c, 1); return f.slice(1).every((v, i) => (f[i] - k) * (v - k) < 0); })],
    h: ['On one subinterval the theorem guarantees a solution of f(x) = k when k lies between the values of f at its two ends.', 'Write down, for each of the four subintervals, the range between its two end values, and find a k that is inside all four ranges.'],
    s: 'For a continuous function, the theorem guarantees a solution of f(x) = k in a subinterval whenever k lies between the values of f at its ends. Read from the table: the four subintervals have end values 1 and 7, 7 and 3, 3 and 9, and 9 and 4. A value of k inside all four ranges must be greater than 4 and less than 7. Of the values offered only 5 is: 2 fits the first subinterval only, 8 only the last two, and 3.5 the first three but not the last.',
  },
]);

// ── Estimating Limits from Graphs and Tables (pack 135) ─────────────────────

G('ba15a88f.lo-2', 'A one-sided limit read from the correct half of a table', [
  {
    t: 'the right-hand limit where the two sides of a table disagree', d: 2, need: 'reason',
    spec: table(['x', 'g(x)'], [['2.9', '4.21'], ['2.99', '4.0201'], ['2.999', '4.002'], ['3.001', '6.997'], ['3.01', '6.97'], ['3.1', '6.7']]),
    alt: 'The first column holds six values of x close to one number, three below it and three above it; the second holds the values of g at those x.',
    q: 'The table gives values of a function g for x near 3. Estimate the limit of g(x) as x approaches 3 from the right.',
    n: '7',
    calc: ['from the rows with x > 3 only, taken toward 3: the values move steadily toward one number and the row closest to 3 is within 0.005 of it', (c) => { const x = tcol(c, 0); const g = tcol(c, 1); const right = x.map((v, i) => ({ v, g: g[i] })).filter((r) => r.v > 3).sort((a, b) => b.v - a.v); const lim = Math.round(right[right.length - 1].g); if (right.length < 3 || !right.every((r, i) => i === 0 || Math.abs(r.g - lim) < Math.abs(right[i - 1].g - lim)) || Math.abs(right[right.length - 1].g - lim) > 0.005) throw new Error('the right-hand rows do not settle'); return lim; }],
    h: ['"From the right" means through values of x that are greater than 3. Decide which rows of the table those are.', 'Read those rows in the order in which x gets closer to 3 and see what number the values of g are closing in on.'],
    s: 'Approaching 3 from the right means using only the rows with x greater than 3. Read from the table: as x goes 3.1, 3.01, 3.001, the values of g go 6.7, 6.97, 6.997, closing in on 7. The limit from the right is 7. (The rows with x less than 3 close in on 4, which is the limit from the left; it plays no part here.)',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// DATA TABLES — AP CHEMISTRY
// ════════════════════════════════════════════════════════════════════════════

// ── Determining rate laws from initial rates (pack 170) ─────────────────────

G('6dbceb88.lo-2', 'An order that no pair of experiments isolates', [
  {
    t: 'the order in B when B never changes alone', d: 3, need: 'calc',
    spec: table(RATE_COLS, [[1, '0.10', '0.10', '2.0 × 10⁻³'], [2, '0.20', '0.10', '8.0 × 10⁻³'], [3, '0.30', '0.20', '3.6 × 10⁻²']]),
    alt: 'Three experiments, each with the starting concentrations of A and B and the initial rate. The concentration of A is different in every experiment.',
    q: 'The table gives initial-rate data for the reaction A + B → products at a fixed temperature. What is the order of the reaction with respect to B?',
    n: '1',
    calc: ['table_reaction_order for A (experiments 1 and 2 change A alone); then from experiments 1 and 3, the factor in the rate left after the change in A is accounted for, as a power of the factor in [B]', (c) => { const m = c.num('table_reaction_order', { rate: 3, concentration: 1, concentrations: [1] }, { spec: table(RATE_COLS, (c.p.rows as unknown[][]).slice(0, 2)), what: 'experiments 1 and 2 only' }); const r = (i: number, j: number) => tv(c, i, j); const n = Math.log(r(2, 3) / r(0, 3) / (r(2, 1) / r(0, 1)) ** m) / Math.log(r(2, 2) / r(0, 2)); if (!near(n, Math.round(n), 1e-6)) throw new Error(`order ${n}`); return Math.round(n); }],
    h: ['Start with the pair of experiments in which only one concentration changes, and find the order for that reactant.', 'In the remaining comparison both concentrations change. Divide out the part of the change in rate that the first reactant explains; what is left is due to B.'],
    s: 'Read from the table: from experiment 1 to experiment 2, [A] doubles while [B] stays at 0.10 M and the rate goes from 2.0 × 10⁻³ to 8.0 × 10⁻³ M/s, four times as large, so the reaction is second order in A. From experiment 1 to experiment 3, [A] triples and [B] doubles, and the rate becomes 18 times as large. Tripling [A] accounts for a factor of 3² = 9, leaving a factor of 2 for the doubling of [B]. So the reaction is first order in B.',
  },
]);

G('6dbceb88.lo-3', 'A rate law used to recover a concentration', [
  {
    t: 'the hidden concentration that gives the measured rate', d: 3, need: 'calc',
    spec: table(RATE_COLS, [[1, '0.10', '0.10', '1.0 × 10⁻³'], [2, '0.20', '0.10', '2.0 × 10⁻³'], [3, '0.20', '0.20', '8.0 × 10⁻³'], [4, '0.20', '?', '1.8 × 10⁻²']]),
    alt: 'Four experiments, each with the starting concentrations of A and B and the initial rate. In the last experiment the concentration of B is hidden behind a question-mark box.',
    q: 'The table gives initial-rate data for the reaction A + B → products at a fixed temperature; one concentration is hidden behind a ? box. What concentration of B, in M, was used in experiment 4? Give your answer to two decimal places.',
    n: '0.30',
    calc: ['the orders from experiments 1–3 (table_reaction_order on those rows), then [B] in experiment 4 from the rate law, by comparison with experiment 3', (c) => { const first3 = { spec: table(RATE_COLS, (c.p.rows as unknown[][]).slice(0, 3)), what: 'experiments 1 to 3' }; const m = c.num('table_reaction_order', { rate: 3, concentration: 1 }, first3); const n = c.num('table_reaction_order', { rate: 3, concentration: 2 }, first3); const r = (i: number, j: number) => tv(c, i, j); return r(2, 2) * (r(3, 3) / r(2, 3) / (r(3, 1) / r(2, 1)) ** m) ** (1 / n); }],
    alts: ['through the rate constant found from experiment 1 (k = rate ÷ ([A][B]²)) and the rate law solved for [B]', (c) => { const r = (i: number, j: number) => tv(c, i, j); const k = r(0, 3) / (r(0, 1) * r(0, 2) ** 2); return [Math.sqrt(r(3, 3) / (k * r(3, 1)))]; }],
    h: ['Use the first three experiments to find the order for each reactant: compare two experiments in which only one concentration changes.', 'Then compare experiment 4 with an experiment that has the same [A], and ask what change in [B] produces the change in rate.'],
    s: 'Read from the table: from experiment 1 to 2, [A] doubles at constant [B] and the rate doubles, so the order in A is 1. From experiment 2 to 3, [B] doubles at constant [A] and the rate becomes four times as large, so the order in B is 2: rate = k[A][B]². Experiments 3 and 4 have the same [A], and the rate rises from 8.0 × 10⁻³ to 1.8 × 10⁻² M/s, a factor of 2.25. So [B] rose by a factor of √2.25 = 1.5, from 0.20 M to 0.30 M.',
  },
]);

G('6dbceb88.lo-4', 'The rate constant and its units', [
  {
    t: 'the rate constant with its units, from a table of initial rates', d: 3, need: 'calc',
    spec: table(RATE_COLS, [[1, '0.10', '0.20', '2.0 × 10⁻³'], [2, '0.30', '0.20', '6.0 × 10⁻³'], [3, '0.30', '0.40', '1.2 × 10⁻²']]),
    alt: 'Three experiments, each with the starting concentrations of A and B and the initial rate.',
    q: 'The table gives initial-rate data for the reaction A + B → products at a fixed temperature. What is the rate constant k, with its units?',
    o: [
      ['0.10 M⁻¹·s⁻¹', 'correct'],
      ['0.10 s⁻¹', 'right number, but the units of a first-order rate constant'],
      ['0.020 s⁻¹', 'divides the rate by [A] alone, as if the rate did not depend on B'],
      ['0.50 M⁻²·s⁻¹', 'takes the reaction to be second order in B'],
    ],
    holds: ['table_rate_constant and table_overall_order: the option holds when its number is k and its units are M^(1 − overall order)·s⁻¹', (() => {
      const units = (order: number): string => (order === 1 ? 's⁻¹' : order === 2 ? 'M⁻¹·s⁻¹' : order === 3 ? 'M⁻²·s⁻¹' : '?');
      const is = (k: number, u: string) => (c: Ctx) => near(c.num('table_rate_constant', { rate: 3 }), k, 1e-6) && units(c.num('table_overall_order', { rate: 3 })) === u;
      return [is(0.1, 'M⁻¹·s⁻¹'), is(0.1, 's⁻¹'), is(0.02, 's⁻¹'), is(0.5, 'M⁻²·s⁻¹')];
    })()],
    h: ['Find the order for each reactant from a pair of experiments in which only that reactant changes, and write the rate law.', 'Put the numbers of any one experiment into the rate law to find k; its units are whatever makes k × (concentrations) come out in M/s.'],
    s: 'Read from the table: from experiment 1 to 2, [A] triples at constant [B] and the rate triples, so the order in A is 1. From experiment 2 to 3, [B] doubles at constant [A] and the rate doubles, so the order in B is 1: rate = k[A][B]. From experiment 1, k = 2.0 × 10⁻³ ÷ (0.10 × 0.20) = 0.10. The rate is in M/s and [A][B] is in M², so k is in M⁻¹·s⁻¹.',
  },
]);

// ── Reaction Rate Calculations from Data (pack 160) ─────────────────────────

G('3ba7563b.lo-2', 'Average rates over two unequal intervals compared', [
  {
    t: 'how many times as fast the first interval is as the last', d: 2, need: 'calc',
    spec: table([{ header: 'Time', unit: 's' }, { header: '[A]', unit: 'M' }], [[0, '0.80'], [10, '0.60'], [20, '0.50'], [40, '0.30']]),
    alt: 'The first column holds four times in seconds, which are not equally spaced; the second holds the concentration of A at each time.',
    q: 'The table gives the concentration of a reactant A during a reaction. How many times as large as the average rate of consumption of A over the last 20 s of the table is the average rate over the first 10 s?',
    n: '2',
    calc: ['table_average_rate between the first two rows ÷ table_average_rate between the last two rows', (c) => round(c.num('table_average_rate', { x: 0, y: 1, from: 0, to: 1 }) / c.num('table_average_rate', { x: 0, y: 1, from: 2, to: 3 }), 6)],
    h: ['For each interval the average rate is the change in concentration divided by the time that passes.', 'The two intervals are not equally long, so compare the rates, not the changes in concentration.'],
    s: 'Read from the table: in the first 10 s, [A] falls from 0.80 M to 0.60 M, an average rate of 0.20 ÷ 10 = 0.020 M/s. In the last 20 s, from 20 s to 40 s, [A] falls from 0.50 M to 0.30 M, an average rate of 0.20 ÷ 20 = 0.010 M/s. The first rate is 0.020 ÷ 0.010 = 2 times the last. The concentration falls by the same amount in both intervals, but the second takes twice as long.',
  },
]);

G('3ba7563b.lo-4', 'The rate of one species from data for another', [
  {
    t: 'the rate of consumption of a reactant from the concentration of a product', d: 3, need: 'calc',
    spec: table([{ header: 'Time', unit: 's' }, { header: '[O₂]', unit: 'M' }], [[0, '0.000'], [20, '0.012'], [40, '0.020'], [60, '0.026'], [80, '0.030']]),
    alt: 'The first column holds five times in seconds, equally spaced; the second holds the concentration of oxygen at each time.',
    q: 'The table gives the concentration of O₂ formed in a sealed flask by the reaction 2N₂O₅(g) → 4NO₂(g) + O₂(g). What is the average rate of consumption of N₂O₅ between 20 s and 60 s? Give your answer in units of 10⁻⁴ M/s.',
    n: '7',
    calc: ['2 × table_average_rate of [O₂] between the rows at 20 s and 60 s (two N₂O₅ are consumed for each O₂ formed), in units of 10⁻⁴ M/s', (c) => round(2 * c.num('table_average_rate', { x: 0, y: 1, from: 1, to: 3 }) * 1e4, 6)],
    h: ['Find the average rate of formation of O₂ over the interval from the table.', 'Use the coefficients of the balanced equation to turn the rate for O₂ into the rate for N₂O₅.'],
    s: 'Read from the table: [O₂] rises from 0.012 M at 20 s to 0.026 M at 60 s, so O₂ forms at an average rate of 0.014 ÷ 40 = 3.5 × 10⁻⁴ M/s. The equation shows that 2 mol of N₂O₅ are consumed for each 1 mol of O₂ formed, so N₂O₅ is consumed at 2 × 3.5 × 10⁻⁴ = 7.0 × 10⁻⁴ M/s, that is 7 in the units asked for.',
  },
]);

// ── Integrated Rate Laws and Half-Life (pack 182) ───────────────────────────

G('cc23c103.lo-2', 'The order found from which column is linear in time', [
  {
    t: 'order and rate constant from tabulated [A], ln[A] and 1/[A]', d: 3, need: 'reason',
    spec: table([{ header: 'Time', unit: 's' }, { header: '[A]', unit: 'M' }, 'ln[A]', { header: '1/[A]', unit: 'M⁻¹' }], [[0, '0.500', '−0.69', '2.00'], [10, '0.250', '−1.39', '4.00'], [20, '0.167', '−1.79', '6.00'], [30, '0.125', '−2.08', '8.00']]),
    alt: 'Four rows at equally spaced times. For each time the table gives the concentration of A and two quantities calculated from it: its natural logarithm and its reciprocal.',
    q: 'The table gives data for the reaction A → products, with two columns calculated from the concentration. What is the order of the reaction in A, and what is its rate constant?',
    o: [
      ['Second order; k = 0.20 M⁻¹·s⁻¹', 'correct'],
      ['First order; k = 0.069 s⁻¹', 'uses the first interval of the ln[A] column only, without checking the later ones'],
      ['Zero order; k = 0.025 M/s', 'uses the first interval of the [A] column only, without checking the later ones'],
      ['Second order; k = 2.0 M⁻¹·s⁻¹', 'finds the order but reads the first entry of the 1/[A] column instead of its slope'],
    ],
    holds: ['table_pattern for each of the three columns against time: the order is 0, 1 or 2 according to which column is linear; k is the size of the slope of that column (table_slope)', (() => {
      const found = (c: Ctx): [number, number] => { const lin = [1, 2, 3].filter((j) => c.txt('table_pattern', { x: 0, y: j }) === 'linear'); if (lin.length !== 1) throw new Error(`${lin.length} linear columns`); return [lin[0] - 1, Math.abs(c.num('table_slope', { x: 0, y: lin[0] }))]; };
      const is = (order: number, k: number) => (c: Ctx) => found(c)[0] === order && near(found(c)[1], k, 1e-6);
      return [is(2, 0.2), is(1, 0.069), is(0, 0.025), is(2, 2)];
    })()],
    h: ['For each of the three columns, check whether it changes by the same amount in every 10 s.', 'The column that is linear in time identifies the order, and the size of its slope is the rate constant.'],
    s: 'Read from the table: in each 10 s, [A] falls by 0.250, 0.083 and 0.042 M (not constant), ln[A] falls by 0.70, 0.40 and 0.29 (not constant), and 1/[A] rises by 2.00 M⁻¹ every time. Only 1/[A] is linear in time, which is the mark of a second-order reaction. The rate constant is the slope of 1/[A] against time: 2.00 M⁻¹ ÷ 10 s = 0.20 M⁻¹·s⁻¹.',
  },
]);

G('cc23c103.lo-4', 'What successive half-lives reveal', [
  {
    t: 'order and a predicted time from half-lives that double', d: 3, need: 'reason',
    spec: table([{ header: 'Time', unit: 's' }, { header: '[A]', unit: 'M' }], [[0, '0.80'], [10, '0.40'], [30, '0.20'], [70, '0.10']]),
    alt: 'The first column holds four times in seconds, which are not equally spaced; the second holds the concentration of A at each time.',
    q: 'The table gives the concentration of A during the reaction A → products. What is the order of the reaction in A, and at what time will [A] reach 0.050 M?',
    o: [
      ['Second order; at 150 s', 'correct'],
      ['First order; at 110 s', 'sees the concentration halving and assumes a constant half-life, equal to the last one'],
      ['Second order; at 110 s', 'names the order but repeats the last half-life instead of doubling it'],
      ['Zero order; at 90 s', 'knows the half-life changes but has it shrinking, as for zero order'],
    ],
    holds: ['from the table: each row halves [A]; the successive half-lives double, which fits 1/[A] linear in time (second order, checked on the three intervals); the time for 0.050 M from that straight line', (() => {
      const found = (c: Ctx): [number, number] => { const t = tcol(c, 0); const a = tcol(c, 1); const inv = a.map((v) => 1 / v); const k = inv.slice(1).map((v, i) => (v - inv[i]) / (t[i + 1] - t[i])); if (!a.slice(1).every((v, i) => near(v, a[i] / 2)) || !k.every((v) => near(v, k[0], 1e-9))) throw new Error('not second order with halving rows'); return [2, t[0] + (1 / 0.05 - inv[0]) / k[0]]; };
      const is = (order: number, time: number) => (c: Ctx) => found(c)[0] === order && near(found(c)[1], time, 1e-6);
      return [is(2, 150), is(1, 110), is(2, 110), is(0, 90)];
    })()],
    h: ['From one row to the next the concentration halves. Work out how long each halving takes.', 'Compare the way the half-life changes with what each reaction order predicts, then continue the pattern by one more halving.'],
    s: 'Read from the table: [A] halves from 0.80 to 0.40 M in 10 s, from 0.40 to 0.20 M in the next 20 s, and from 0.20 to 0.10 M in the next 40 s. The half-life doubles each time the concentration halves, as it does for a second-order reaction, where t½ = 1 ÷ (k[A]₀). The next halving, from 0.10 to 0.050 M, therefore takes 80 s, and [A] reaches 0.050 M at 70 + 80 = 150 s.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// DATA TABLES — ALGEBRA II
// ════════════════════════════════════════════════════════════════════════════

// ── Conditional Probability Two-Way Tables (pack 024) ───────────────────────

G('9a2d1f9c.lo-1', 'Cells, margins and what each one counts', [
  {
    t: 'a count that combines a row total with one cell, with a cell hidden', d: 2, need: 'calc',
    spec: table(['', 'Plays a sport', 'No sport', 'Total'], [['Juniors', 45, '?', 80], ['Seniors', 30, 40, 70], ['Total', 75, 75, 150]], { rowHeaders: true, totalsRow: true, totalsColumn: true }),
    alt: 'A two-way table of students: rows for juniors and seniors, columns for those who play a sport and those who do not, with a total for every row and column. One count is hidden behind a question-mark box.',
    q: 'In the two-way table one count is hidden behind a ? box. How many of the students in the table are juniors, or do not play a sport, or both?',
    n: '120',
    calc: ['table_total of the row Juniors (with the hidden cell solved from the printed totals by table_missing_cell) plus table_cell for seniors who play no sport', (c) => c.num('table_cell', { row: 'Juniors', column: 'Plays a sport' }) + c.num('table_missing_cell', {}) + c.num('table_cell', { row: 'Seniors', column: 'No sport' })],
    h: ['Decide which cells of the table hold students who fit the description, taking care not to count any cell twice.', 'A row total already counts every student in that row, so the hidden cell need not be found separately.'],
    s: 'The students described fill three cells: juniors who play a sport, juniors who do not, and seniors who do not. Read from the table: the two junior cells together are the row total for juniors, 80, and there are 40 seniors who play no sport. The number is 80 + 40 = 120. (Equivalently, all 150 students except the 30 seniors who play a sport.)',
  },
  {
    t: 'the statement a two-way table does not support', d: 3, need: 'reason',
    spec: table(TRAVEL, [['Lower school', 36, 24, 20, 80], ['Upper school', 18, 42, 10, 70], ['Total', 54, 66, 30, 150]], { rowHeaders: true, totalsRow: true, totalsColumn: true, columnGroup: 'How they travel to school' }),
    alt: 'A two-way table of students: rows for the lower school and the upper school, columns for three ways of travelling to school, with a total for every row and column.',
    q: 'The two-way table shows how the students of the lower school and the upper school travel to school. Which statement is NOT supported by the table?',
    o: [
      ['Most of the students who walk are in the upper school', 'correct'],
      ['More than half of the upper-school students travel by car', 'true (42 of 70); picked by a reader who divides by the number of car travellers or by all the students'],
      ['Fewer than half of all the students travel by bus', 'true (54 of 150); picked by a reader who looks at the lower school alone, where the bus is the commonest'],
      ['A lower-school student is more likely to take the bus than an upper-school student is', 'true (36 of 80 against 18 of 70); picked by a reader who compares shares of the bus column instead of shares of each part of the school'],
    ],
    holds: ['table_relative_frequency for each statement; a statement is the right answer when the table makes it false', [
      (c) => !(c.num('table_relative_frequency', { row: 'Upper school', givenColumn: 'Walk' }) > 0.5),
      (c) => !(c.num('table_relative_frequency', { column: 'Car', givenRow: 'Upper school' }) > 0.5),
      (c) => !(c.num('table_relative_frequency', { column: 'Bus' }) < 0.5),
      (c) => !(c.num('table_relative_frequency', { column: 'Bus', givenRow: 'Lower school' }) > c.num('table_relative_frequency', { column: 'Bus', givenRow: 'Upper school' })),
    ]],
    h: ['For each statement, decide which group it is about: that group\'s total is the number to divide by.', 'A statement about "the students who walk" is about a column; a statement about "upper-school students" is about a row.'],
    s: 'Read from the table: 30 students walk, and 20 of them are in the lower school, so most of the walkers are in the lower school, not the upper school; that statement is not supported. The others are: 42 of the 70 upper-school students travel by car (60%); 54 of all 150 students take the bus (36%); and the bus is used by 36 of 80 lower-school students (45%) but only 18 of 70 upper-school students (about 26%).',
  },
]);

G('9a2d1f9c.lo-2', 'Conditional probabilities with the right denominator', [
  {
    t: 'a conditional probability whose numerator is a hidden cell', d: 3, need: 'calc',
    spec: table(['', 'Fiction', 'Non-fiction', 'Total'], [['Print', 48, 22, 70], ['E-book', '?', 18, 50], ['Total', 80, 40, 120]], { rowHeaders: true, totalsRow: true, totalsColumn: true }),
    alt: 'A two-way table of books: rows for print books and e-books, columns for fiction and non-fiction, with a total for every row and column. One count is hidden behind a question-mark box.',
    q: 'The two-way table shows the books borrowed from a library in one day; one count is hidden behind a ? box. A book borrowed that day is chosen at random. What is the probability that it is an e-book, given that it is fiction? Give your answer as a decimal.',
    n: '0.4',
    ck: ['table_relative_frequency', { row: 'E-book', givenColumn: 'Fiction' }],
    h: ['The condition "given that it is fiction" restricts the choice to one column: its total is the denominator.', 'The numerator is the hidden count; find it from a printed total and the other count in the same row or column.'],
    s: 'Given that the book is fiction, only the fiction column counts. Read from the table: 80 fiction books were borrowed, 48 of them in print, so the hidden count of fiction e-books is 80 − 48 = 32 (the e-book row agrees: 50 − 18 = 32). The probability is 32 ÷ 80 = 0.4. Dividing by the 50 e-books instead would answer a different question: the probability that an e-book is fiction.',
  },
  {
    t: 'a conditional probability whose condition joins two columns', d: 3, need: 'calc',
    spec: table(TRAVEL, [['Grade 11', 30, 40, 10, 80], ['Grade 12', 12, 48, 20, 80], ['Total', 42, 88, 30, 160]], { rowHeaders: true, totalsRow: true, totalsColumn: true, columnGroup: 'How they travel to school' }),
    alt: 'A two-way table of students: rows for Grade 11 and Grade 12, columns for three ways of travelling to school, with a total for every row and column.',
    q: 'The two-way table shows how the students of two grades travel to school. A student is chosen at random from those who do NOT travel by car. What is the probability that the student is in Grade 11?',
    o: [
      ['5/9', 'correct'],
      ['1/2', 'divides by the Grade 11 total: the condition and the event exchanged'],
      ['1/4', 'divides by all 160 students: a joint relative frequency, not a conditional one'],
      ['5/7', 'conditions on the bus alone and leaves out the students who walk'],
    ],
    holds: ['(Grade 11 by bus + Grade 11 walking) ÷ (the bus total + the walk total), every count by table_cell and table_total; the option holds when its fraction equals that', ['5/9', '1/2', '1/4', '5/7'].map((o) => (c: Ctx) => near((c.num('table_cell', { row: 'Grade 11', column: 'Bus' }) + c.num('table_cell', { row: 'Grade 11', column: 'Walk' })) / (c.num('table_total', { column: 'Bus' }) + c.num('table_total', { column: 'Walk' })), numbersIn(o)[0]))],
    h: ['The condition "does not travel by car" picks out two columns of the table. Their totals together make the denominator.', 'The numerator is the number of Grade 11 students inside those two columns.'],
    s: 'The students who do not travel by car are those in the bus column and the walk column. Read from the table: 42 take the bus and 30 walk, 72 students in all; of these, 30 + 10 = 40 are in Grade 11. The probability is 40 ÷ 72 = 5/9. Dividing by the 80 Grade 11 students would give instead the probability that a Grade 11 student does not travel by car.',
  },
]);

G('9a2d1f9c.lo-3', 'Independence tested column by column', [
  {
    t: 'the way of travelling that is independent of the grade', d: 3, need: 'calc',
    spec: table(TRAVEL, [['Grade 9', 24, 40, 16, 80], ['Grade 10', 36, 36, 48, 120], ['Total', 60, 76, 64, 200]], { rowHeaders: true, totalsRow: true, totalsColumn: true, columnGroup: 'How they travel to school' }),
    alt: 'A two-way table of students: rows for Grade 9 and Grade 10, columns for three ways of travelling to school, with a total for every row and column.',
    q: 'The two-way table shows how the students of two grades travel to school. For which way of travelling is the event "travels that way" independent of the event "is in Grade 9"?',
    o: [
      ['Bus only', 'correct'],
      ['Car only', 'picks the column whose two counts are closest to each other'],
      ['Walk only', 'picks the column in which the Grade 10 count is a whole multiple of the Grade 9 count'],
      ['Bus and Car', 'accepts counts that are nearly equal as well as conditional probabilities that are equal'],
    ],
    holds: ['for each way of travelling, table_relative_frequency given Grade 9 against the same for all students: the option holds when its list is exactly the ways for which the two are equal', [['Bus'], ['Car'], ['Walk'], ['Bus', 'Car']].map((list) => (c: Ctx) => JSON.stringify(['Bus', 'Car', 'Walk'].filter((w) => near(c.num('table_relative_frequency', { column: w, givenRow: 'Grade 9' }), c.num('table_relative_frequency', { column: w })))) === JSON.stringify(list))],
    h: ['Two events are independent when knowing that one has happened does not change the probability of the other.', 'For each way of travelling, compare the proportion of Grade 9 students who use it with the proportion of all the students who use it.'],
    s: 'An event is independent of "is in Grade 9" when its probability among Grade 9 students equals its probability among all the students. Read from the table: bus, 24 ÷ 80 = 0.30 among Grade 9 and 60 ÷ 200 = 0.30 overall, equal; car, 40 ÷ 80 = 0.50 against 76 ÷ 200 = 0.38; walk, 16 ÷ 80 = 0.20 against 64 ÷ 200 = 0.32. Only travelling by bus is independent of being in Grade 9.',
  },
]);

// ── Inverse and Joint Variation Problems (pack 043) ─────────────────────────

G('dd3fd7db.lo-4', 'The constant of a joint variation found from rows of data', [
  {
    t: 'a hidden value of y from the constant the other rows give', d: 2, need: 'calc',
    spec: table(['x', 'z', 'y'], [[2, 1, 6], [1, 2, 12], [3, 2, 36], [4, 3, '?']]),
    alt: 'Four rows, each giving a value of x, a value of z and the matching value of y. In the last row the value of y is hidden behind a question-mark box.',
    q: 'In the table y varies jointly with x and the square of z; one value is hidden behind a ? box. What is the hidden value of y?',
    n: '108',
    calc: ['k = y ÷ (x·z²) from each complete row of the table (the rows must agree); the hidden value is k·x·z² for the last row', (c) => { const x = tcol(c, 0); const z = tcol(c, 1); const y = tcol(c, 2); const k = [0, 1, 2].map((i) => y[i] / (x[i] * z[i] ** 2)); if (!k.every((v) => near(v, k[0])) || !Number.isNaN(y[3])) throw new Error('the rows do not give one constant'); return k[0] * x[3] * z[3] ** 2; }],
    h: ['Write the variation as an equation with a constant k, and use one complete row to find k.', 'Check k with another row, then put the x and z of the last row into the equation.'],
    s: 'Joint variation with x and the square of z means y = k·x·z². Read from the table: the first row gives 6 = k × 2 × 1², so k = 3; the second row agrees (3 × 1 × 2² = 12) and so does the third (3 × 3 × 2² = 36). For the last row, y = 3 × 4 × 3² = 108.',
  },
]);

// ── Exponential Growth and Decay (pack 035) ─────────────────────────────────

G('c205ed52.lo-1', 'An exponential function picked out of a table', [
  {
    t: 'which tabulated function is exponential and its factor per unit of x', d: 3, need: 'reason',
    spec: table(['x', 'f(x)', 'g(x)', 'h(x)'], [[0, 5, 5, 5], [2, 20, 20, 20], [4, 80, 35, 45], [6, 320, 50, 80]]),
    alt: 'Four rows at equally spaced values of x. For each x the table gives the values of three functions, f, g and h.',
    q: 'The table gives values of three functions at equally spaced values of x. One of the functions is exponential. Which one is it, and by what factor does it grow for each increase of 1 in x?',
    o: [
      ['f; a factor of 2', 'correct'],
      ['f; a factor of 4', 'gives the factor for one step of the table, which is an increase of 2 in x'],
      ['h; a factor of 4', 'judges from the first two rows only, where all three functions go from 5 to 20'],
      ['g; a factor of 4', 'takes equal differences for steady growth and then divides the first two values'],
    ],
    holds: ['table_pattern for each function against x (the exponential one), and table_common_ratio for it, turned into the factor for one unit of x by the step of the x column', (() => {
      const found = (c: Ctx): [string, number] => { const names = ['f', 'g', 'h']; const exp = [1, 2, 3].filter((j) => c.txt('table_pattern', { x: 0, y: j }) === 'exponential'); if (exp.length !== 1) throw new Error(`${exp.length} exponential columns`); const x = tcol(c, 0); return [names[exp[0] - 1], round(c.num('table_common_ratio', { x: 0, y: exp[0] }) ** (1 / (x[1] - x[0])), 9)]; };
      const is = (name: string, factor: number) => (c: Ctx) => found(c)[0] === name && near(found(c)[1], factor);
      return [is('f', 2), is('f', 4), is('h', 4), is('g', 4)];
    })()],
    h: ['An exponential function is multiplied by the same number for every equal step in x. Test each column over ALL its rows, not just the first two.', 'The rows are not one unit apart. Find the factor for one step of the table, then the factor that gives it when applied once for each unit of x.'],
    s: 'Read from the table: f goes 5, 20, 80, 320, multiplied by 4 at every step; g goes 5, 20, 35, 50, adding 15 each time (linear); h goes 5, 20, 45, 80, with ratios 4, 2.25 and about 1.8 (neither). So f is the exponential function. Each step of the table is an increase of 2 in x, so the factor b for an increase of 1 satisfies b² = 4, giving b = 2.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// DATA TABLES — PRECALCULUS
// ════════════════════════════════════════════════════════════════════════════

// ── Estimating Limits from Tables and Graphs (pack 292) ─────────────────────

G('9f2a3bed.lo-6', 'One-sided values compared for two functions at once', [
  {
    t: 'for which of two tabulated functions the two-sided limit exists', d: 3, need: 'reason',
    spec: table(['x', 'f(x)', 'g(x)'], [['2.9', '3.8', '0.9'], ['2.99', '3.98', '0.99'], ['2.999', '3.998', '0.999'], ['3.001', '4.002', '2.001'], ['3.01', '4.02', '2.01'], ['3.1', '4.2', '2.1']]),
    alt: 'Six rows with values of x close to one number, three below it and three above it. For each x the table gives the values of two functions, f and g.',
    q: 'The table gives values of two functions f and g for x near 3. For which of the functions does the limit as x approaches 3 exist, and what does the table show about it?',
    o: [
      ['Only f; its limit is 4', 'correct'],
      ['f and g; the limit of g is 1.5', 'averages the two values that g approaches from the two sides'],
      ['f and g; the limit of g is 2', 'accepts the values of g on the right of 3 as its limit'],
      ['Neither function', 'wants a table entry at x = 3 itself before a limit can exist'],
    ],
    holds: ['from the table: for each function the number its values close in on from the left of 3 and from the right of 3 (the row nearest 3 on each side, to the nearest 0.01); a two-sided limit exists when the two agree', (() => {
      const sides = (c: Ctx, j: number): [number, number] => { const x = tcol(c, 0); const y = tcol(c, j); const L = x.map((v, i) => ({ v, y: y[i] })).filter((r) => r.v < 3).sort((a, b) => b.v - a.v)[0].y; const R = x.map((v, i) => ({ v, y: y[i] })).filter((r) => r.v > 3).sort((a, b) => a.v - b.v)[0].y; return [round(L, 2), round(R, 2)]; };
      const state = (c: Ctx) => { const f = sides(c, 1); const g = sides(c, 2); return { f: near(f[0], f[1]) ? f[0] : null, g: near(g[0], g[1]) ? g[0] : null }; };
      return [
        (c) => { const s = state(c); return s.f === 4 && s.g === null; },
        (c) => { const s = state(c); return s.f !== null && s.g === 1.5; },
        (c) => { const s = state(c); return s.f !== null && s.g === 2; },
        (c) => { const s = state(c); return s.f === null && s.g === null; },
      ];
    })()],
    h: ['For each function, read the rows with x below 3 toward 3, and separately the rows with x above 3 toward 3.', 'A two-sided limit exists only when the two sides close in on the same number. The table does not need an entry at x = 3.'],
    s: 'Read from the table: as x approaches 3 from below, f goes 3.8, 3.98, 3.998, and from above 4.2, 4.02, 4.002; both sides close in on 4, so the limit of f exists and is 4. For g, the values from below go 0.9, 0.99, 0.999, closing in on 1, and from above 2.1, 2.01, 2.001, closing in on 2. The two one-sided limits of g differ, so the limit of g does not exist. A limit does not depend on the value at x = 3, which the table does not give.',
  },
]);

G('9f2a3bed.lo-4', 'A left-hand limit read from the correct half of a table', [
  {
    t: 'the left-hand limit where the two sides of a table disagree', d: 2, need: 'reason',
    spec: table(['x', 'h(x)'], [['1.9', '2.71'], ['1.99', '2.9701'], ['1.999', '2.997'], ['2.001', '5.002'], ['2.01', '5.02'], ['2.1', '5.2']]),
    alt: 'The first column holds six values of x close to one number, three below it and three above it; the second holds the values of h at those x.',
    q: 'The table gives values of a function h for x near 2. Estimate the limit of h(x) as x approaches 2 from the left.',
    n: '3',
    calc: ['from the rows with x < 2 only, taken toward 2: the values move steadily toward one number and the row closest to 2 is within 0.005 of it', (c) => { const x = tcol(c, 0); const y = tcol(c, 1); const left = x.map((v, i) => ({ v, y: y[i] })).filter((r) => r.v < 2).sort((a, b) => a.v - b.v); const lim = Math.round(left[left.length - 1].y); if (left.length < 3 || !left.every((r, i) => i === 0 || Math.abs(r.y - lim) < Math.abs(left[i - 1].y - lim)) || Math.abs(left[left.length - 1].y - lim) > 0.005) throw new Error('the left-hand rows do not settle'); return lim; }],
    h: ['"From the left" means through values of x that are less than 2. Decide which rows of the table those are.', 'Read those rows in the order in which x gets closer to 2 and see what number the values of h are closing in on.'],
    s: 'Approaching 2 from the left means using only the rows with x less than 2. Read from the table: as x goes 1.9, 1.99, 1.999, the values of h go 2.71, 2.9701, 2.997, closing in on 3. The limit from the left is 3. (The rows with x greater than 2 close in on 5, the limit from the right, which is not asked for.)',
  },
]);

// ── Half-Life and Doubling-Time Problems (pack 279) ─────────────────────────

G('58bad0ec.lo-2', 'A half-life found in a table and run backwards in time', [
  {
    t: 'how long before the first reading the sample had a stated larger mass', d: 3, need: 'calc',
    spec: table([{ header: 'Time', unit: 'days' }, { header: 'Mass', unit: 'mg' }], [[0, 240], [4, 170], [8, 120], [12, 85], [16, 60]]),
    alt: 'The first column holds five times in days, equally spaced; the second holds the mass of the sample in milligrams at each time.',
    q: 'The table gives the mass of a radioactive sample, which decays exponentially. The sample had already been decaying in the same way before the first reading. How many days before the first reading was its mass 1920 mg?',
    n: '24',
    calc: ['the half-life from the table (the spacing of two rows whose masses are exactly in the ratio 2 : 1 — every such pair must agree); then log₂(1920 ÷ the first mass) half-lives', (c) => { const t = tcol(c, 0); const m = tcol(c, 1); const hl: number[] = []; m.forEach((a, i) => m.forEach((b, j) => { if (j > i && near(a, 2 * b)) hl.push(t[j] - t[i]); })); if (!hl.length || !hl.every((v) => near(v, hl[0]))) throw new Error('no single half-life'); const n = Math.log2(1920 / m[0]); if (!near(n, Math.round(n))) throw new Error('not a whole number of half-lives'); return Math.round(n) * hl[0]; }],
    h: ['Find two rows of the table in which the mass has exactly halved, and read the time between them.', 'Going back in time, the mass doubles once for every half-life. Count the doublings needed to get from the first reading to the mass asked about.'],
    s: 'Read from the table: the mass falls from 240 mg at 0 days to 120 mg at 8 days, and from 120 mg to 60 mg at 16 days, so the half-life is 8 days (the rows between do not show a halving). Going backwards, the mass doubles every 8 days: 240, 480, 960, 1920. That is three doublings, so the mass was 1920 mg 3 × 8 = 24 days before the first reading.',
  },
]);

G('58bad0ec.lo-3', 'A doubling time found in a table and run forwards', [
  {
    t: 'the time at which a culture reaches a stated size', d: 3, need: 'calc',
    spec: table([{ header: 'Time', unit: 'h' }, 'Cells'], [[0, 300], [5, 378], [10, 476], [15, 600], [20, 756]]),
    alt: 'The first column holds five times in hours, equally spaced; the second holds the number of cells in the culture at each time.',
    q: 'The table gives the number of cells in a culture that grows exponentially. If the growth continues in the same way, at what time, in hours, will the culture reach 4800 cells?',
    n: '60',
    calc: ['the doubling time from the table (the spacing of two rows whose counts are exactly in the ratio 1 : 2 — every such pair must agree); then log₂(4800 ÷ the first count) doubling times after the first row', (c) => { const t = tcol(c, 0); const n = tcol(c, 1); const dt: number[] = []; n.forEach((a, i) => n.forEach((b, j) => { if (j > i && near(b, 2 * a)) dt.push(t[j] - t[i]); })); if (!dt.length || !dt.every((v) => near(v, dt[0]))) throw new Error('no single doubling time'); const k = Math.log2(4800 / n[0]); if (!near(k, Math.round(k))) throw new Error('not a whole number of doublings'); return t[0] + Math.round(k) * dt[0]; }],
    h: ['Find two rows of the table in which the number of cells has exactly doubled, and read the time between them.', 'Work out how many doublings take the first count to the count asked about; each one takes one doubling time.'],
    s: 'Read from the table: the count rises from 300 at 0 h to 600 at 15 h (and from 378 at 5 h to 756 at 20 h), so the doubling time is 15 h. From 300 cells, the count doubles to 600, 1200, 2400 and 4800: four doublings. The culture reaches 4800 cells at 4 × 15 = 60 h.',
  },
]);

// ── Arithmetic and Geometric Sequence Formulas (pack 274) ───────────────────

G('457d35da.lo-5', 'A common ratio found from terms that are not neighbours', [
  {
    t: 'the common ratio from every second term of a geometric sequence', d: 2, need: 'calc',
    spec: table(['n', 'aₙ'], [[1, 6], [3, 24], [5, 96], [7, 384]]),
    alt: 'The first column holds four term numbers, which are not consecutive; the second holds the value of the term with each number.',
    q: 'The table gives four terms of a geometric sequence in which every term is positive. What is the common ratio of the sequence?',
    n: '2',
    calc: ['table_common_ratio for one step of the table, turned into the ratio for one step of n by the spacing of the n column (the positive root, every term being positive)', (c) => { const n = tcol(c, 0); return round(c.num('table_common_ratio', { x: 0, y: 1 }) ** (1 / (n[1] - n[0])), 9); }],
    h: ['Look at the term numbers before dividing: check whether the terms in the table are neighbours in the sequence.', 'Between two rows of the table the sequence is multiplied by the common ratio more than once.'],
    s: 'Read from the table: the term numbers go 1, 3, 5, 7, so the rows are two terms apart, and each value is 4 times the one above it (6, 24, 96, 384). Two steps of the sequence multiply a term by r², so r² = 4. Every term is positive, so r = 2. (The terms between are 12, 48 and 192.)',
  },
]);

// ── Sinusoidal Models from Real Data (pack 263) ─────────────────────────────

G('1c19dde2.lo-1', 'A period found in data and used to look ahead', [
  {
    t: 'a later value of a periodic record, from its period', d: 3, need: 'reason',
    spec: table([{ header: 'Time', unit: 'h' }, { header: 'Depth', unit: 'm' }], [[0, '5.0'], [3, '8.0'], [6, '5.0'], [9, '2.0'], [12, '5.0'], [15, '8.0'], [18, '5.0'], [21, '2.0']]),
    alt: 'The first column holds eight times in hours, equally spaced; the second holds the depth of the water in metres at each time. The depths rise and fall in a repeating pattern.',
    q: 'The table gives the depth of the water at a pier, recorded every 3 hours; the pattern continues in the same way. What depth, in metres, does the pattern give 39 hours after the first reading?',
    n: '8',
    calc: ['the period from the table (the smallest shift of rows under which every depth repeats), then the depth in the row whose time is 39 h less a whole number of periods', (c) => { const t = tcol(c, 0); const d = tcol(c, 1); const shift = [1, 2, 3, 4, 5, 6].find((s) => d.every((v, i) => i + s >= d.length || near(v, d[i + s]))); if (!shift) throw new Error('no period'); const period = (t[1] - t[0]) * shift; const at = 39 - period * Math.floor(39 / period); const i = t.findIndex((v) => near(v, at)); if (i < 0) throw new Error('39 h does not fall on a row'); return d[i]; }],
    h: ['Find how long it takes for the whole pattern of depths to repeat: from one high value to the next high value.', 'Take away whole periods from the time asked about until you land on a time that is in the table.'],
    s: 'Read from the table: the depth is highest, 8.0 m, at 3 h and again at 15 h, and the whole pattern (5.0, 8.0, 5.0, 2.0) repeats from 12 h onward, so the period is 12 hours. Since 39 = 3 × 12 + 3, the depth at 39 h is the same as the depth at 3 h, which is 8.0 m.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// DATA TABLES — AP BIOLOGY
// ════════════════════════════════════════════════════════════════════════════

// ── Chi-Square Test for Genetics (pack 055) ─────────────────────────────────

G('21937bfb.lo-2', 'Expected numbers set against the observed ones', [
  {
    t: 'the class whose observed number most exceeds its expected number', d: 3, need: 'calc',
    spec: table(['Phenotype', 'Observed'], [['Round, yellow', 280], ['Round, green', 85], ['Wrinkled, yellow', 95], ['Wrinkled, green', 20], ['Total', 480]], { rowHeaders: true, totalsRow: true }),
    hide: ['Round', 'Wrinkled'],
    alt: 'A table of the offspring of a cross: four rows, one for each combination of the two seed shapes and the two seed colours, each with the number of offspring observed, and a total.',
    q: 'The table gives the offspring of a cross between two pea plants that are each heterozygous for seed shape and for seed colour (round and yellow are dominant); a 9 : 3 : 3 : 1 ratio is expected. For which phenotype is the observed number greater than the expected number by the largest amount?',
    o: [
      ['Round, yellow', 'correct'],
      ['Wrinkled, yellow', 'is above its expected number, but by half as much'],
      ['Wrinkled, green', 'differs from its expected number by as much, but falls short of it'],
      ['Round, green', 'is the class nearest to its expected number, and below it'],
    ],
    holds: ['expected numbers 9/16, 3/16, 3/16 and 1/16 of the printed total, in the order of the rows; the option holds when its class has the single largest (observed − expected)', (() => {
      const names = ['Round, yellow', 'Round, green', 'Wrinkled, yellow', 'Wrinkled, green'];
      const excess = (c: Ctx): number[] => { const total = c.num('table_cell', { row: 'Total', column: 'Observed' }); return names.map((n, i) => c.num('table_cell', { row: n, column: 'Observed' }) - (total * [9, 3, 3, 1][i]) / 16); };
      return ['Round, yellow', 'Wrinkled, yellow', 'Wrinkled, green', 'Round, green'].map((n) => (c: Ctx) => { const e = excess(c); const k = names.indexOf(n); return e.every((v, i) => i === k || v < e[k] - 1e-9); });
    })()],
    h: ['Find the expected number for each class: its share of the 9 : 3 : 3 : 1 ratio times the total number of offspring.', 'Subtract expected from observed for each class and keep the sign: the question asks for an excess, not just a difference.'],
    s: 'The expected numbers are 9/16, 3/16, 3/16 and 1/16 of the total. Read from the table: there are 480 offspring, so 270 round yellow, 90 round green, 90 wrinkled yellow and 30 wrinkled green are expected. Observed minus expected is 280 − 270 = +10, 85 − 90 = −5, 95 − 90 = +5 and 20 − 30 = −10. The largest excess, +10, is for round, yellow.',
  },
]);

G('21937bfb.lo-5', 'A decision that depends on the degrees of freedom', [
  {
    t: 'degrees of freedom, critical value and decision from a table of critical values', d: 3, need: 'reason',
    spec: table(['Degrees of freedom', '0.05 level', '0.01 level'], [[1, '3.84', '6.63'], [2, '5.99', '9.21'], [3, '7.81', '11.34'], [4, '9.49', '13.28']]),
    alt: 'A table of critical values of chi-square: one row for each number of degrees of freedom, with a critical value for each of two levels of significance.',
    q: 'The table gives critical values of chi-square. A dihybrid cross produces offspring in four phenotype classes, and a chi-square test of the expected 9 : 3 : 3 : 1 ratio gives χ² = 8.60. At the 0.05 level of significance, how many degrees of freedom does the test have, and what is the decision about the null hypothesis?',
    o: [
      ['3 degrees of freedom; reject the null hypothesis', 'correct'],
      ['4 degrees of freedom; fail to reject the null hypothesis', 'uses the number of classes as the number of degrees of freedom'],
      ['3 degrees of freedom; fail to reject the null hypothesis', 'compares χ² with the critical value for the 0.01 level'],
      ['4 degrees of freedom; reject the null hypothesis', 'uses the number of classes and then rejects although χ² is below that critical value'],
    ],
    holds: ['degrees of freedom = 4 classes − 1; the critical value by table_lookup in that row under the 0.05 level; reject when 8.60 is greater than it', (() => {
      const is = (df: number, reject: boolean) => (c: Ctx) => df === 4 - 1 && (8.6 > c.num('table_lookup', { where: 0, equals: df, find: 1 })) === reject;
      return [is(3, true), is(4, false), is(3, false), is(4, true)];
    })()],
    h: ['Find the number of degrees of freedom from the number of phenotype classes, not from the number of offspring.', 'Read the critical value in that row under the level of significance stated, and compare χ² with it: a larger χ² means the data are too far from the expected ratio.'],
    s: 'With four phenotype classes there are 4 − 1 = 3 degrees of freedom. Read from the table: for 3 degrees of freedom the critical value at the 0.05 level is 7.81. The calculated χ² of 8.60 is greater than 7.81, so the null hypothesis, that the offspring fit a 9 : 3 : 3 : 1 ratio, is rejected. (Using 4 degrees of freedom would give 9.49 and the opposite decision.)',
  },
]);

// ── Hardy-Weinberg Equilibrium (pack 075) ───────────────────────────────────

G('7bc3506d.lo-2', 'An allele frequency counted from genotypes', [
  {
    t: 'the frequency of an allele from genotype counts', d: 2, need: 'calc',
    spec: table(['Genotype', 'Number of individuals'], [['AA', 90], ['Aa', 60], ['aa', 50], ['Total', 200]], { rowHeaders: true, totalsRow: true }),
    alt: 'A table of a sample from a population: one row for each of the three genotypes of a gene with two alleles, each with the number of individuals, and a total.',
    q: 'The table gives the genotype of every individual in a sample from a population. What is the frequency of allele A in the sample? Give your answer as a decimal.',
    n: '0.6',
    calc: ['(2 × the number of AA + the number of Aa) ÷ (2 × the printed total), each by table_cell', (c) => (2 * c.num('table_cell', { row: 'AA', column: 1 }) + c.num('table_cell', { row: 'Aa', column: 1 })) / (2 * c.num('table_cell', { row: 'Total', column: 1 }))],
    h: ['Every individual carries two copies of the gene, so count alleles, not individuals.', 'Count the copies of A carried by each genotype, and divide by the total number of copies of the gene in the sample.'],
    s: 'Each individual carries two alleles, so 200 individuals carry 400 alleles. Read from the table: the 90 AA individuals carry 180 copies of A and the 60 Aa individuals carry 60 copies, 240 in all. The frequency of A is 240 ÷ 400 = 0.6. (Taking the square root of the AA frequency would be valid only if the sample were known to be in Hardy-Weinberg equilibrium, and here it is not.)',
  },
]);

G('7bc3506d.lo-5', 'Three populations tested against Hardy-Weinberg expectations', [
  {
    t: 'the population whose genotype counts do not fit its allele frequencies', d: 3, need: 'calc',
    spec: table(['Population', 'AA', 'Aa', 'aa'], [['X', 49, 42, 9], ['Y', 64, 32, 4], ['Z', 60, 20, 20]], { rowHeaders: true }),
    alt: 'A table of three populations, X, Y and Z: for each, the numbers of individuals with each of the three genotypes of a gene with two alleles.',
    q: 'The table gives the numbers of the three genotypes in samples of 100 individuals from three populations. Which of the populations is NOT in Hardy-Weinberg equilibrium for this gene?',
    o: [
      ['Population Z only', 'correct'],
      ['Population X only', 'expects the heterozygotes to be the commonest genotype at equilibrium'],
      ['Population Y only', 'takes a very small number of aa individuals as a sign that the population is not at equilibrium'],
      ['Populations Y and Z', 'expects the two homozygotes to be equally common at equilibrium'],
    ],
    holds: ['for each population: p from its own counts (table_cell), the expected numbers p², 2pq and q² of its total, compared with the counts; the option holds when its list is exactly the populations that do not fit', [['Z'], ['X'], ['Y'], ['Y', 'Z']].map((list) => (c: Ctx) => JSON.stringify(['X', 'Y', 'Z'].filter((pop) => { const [aa, ab, bb] = ['AA', 'Aa', 'aa'].map((g) => c.num('table_cell', { row: pop, column: g })); const n = aa + ab + bb; const p = (2 * aa + ab) / (2 * n); return !(near(p * p * n, aa, 1e-6) && near(2 * p * (1 - p) * n, ab, 1e-6) && near((1 - p) ** 2 * n, bb, 1e-6)); })) === JSON.stringify(list))],
    h: ['For each population find the frequency p of allele A by counting alleles, and q = 1 − p.', 'Then compare the numbers observed with the numbers that p², 2pq and q² predict for a sample of 100.'],
    s: 'Read from the table and count alleles in each sample of 100. X: p = (98 + 42) ÷ 200 = 0.7, predicting 49, 42 and 9, exactly as observed. Y: p = (128 + 32) ÷ 200 = 0.8, predicting 64, 32 and 4, exactly as observed. Z: p = (120 + 20) ÷ 200 = 0.7, predicting 49, 42 and 9, but 60, 20 and 20 are observed: far too few heterozygotes. Only population Z is not in Hardy-Weinberg equilibrium.',
  },
]);

// ── Non-Mendelian Inheritance Patterns (pack 057) ───────────────────────────

G('24fa47fc.lo-5', 'Linkage read from the sizes of four classes', [
  {
    t: 'which alleles were linked in the parent, and the map distance', d: 3, need: 'calc',
    spec: table(['Phenotype of offspring', 'Number'], [['A B', 48], ['A b', 452], ['a B', 448], ['a b', 52], ['Total', 1000]], { rowHeaders: true, totalsRow: true }),
    alt: 'A table of the offspring of a cross: four rows, one for each combination of the phenotypes of two genes, each with the number of offspring, and a total. Two of the classes are much larger than the other two.',
    q: 'A fruit fly heterozygous for two linked genes (Aa Bb) is crossed with a fly that is homozygous recessive for both genes, and the table gives the offspring. Which alleles did the heterozygous parent carry together on one chromosome, and how far apart are the two genes?',
    o: [
      ['Each dominant allele with the recessive allele of the other gene; 10 map units', 'correct'],
      ['The two dominant alleles together; 10 map units', 'finds the recombination frequency but assumes the two dominant alleles lie together'],
      ['Each dominant allele with the recessive allele of the other gene; 5 map units', 'counts only one of the two recombinant classes'],
      ['The two dominant alleles together; 90 map units', 'takes the two large classes to be the recombinants'],
    ],
    holds: ['from the table: the two largest classes are the parental types (they name the alleles carried together), and the map distance is the two smallest classes ÷ the printed total × 100', (() => {
      const found = (c: Ctx): [string, number] => { const rows = ['A B', 'A b', 'a B', 'a b'].map((n) => ({ n, v: c.num('table_cell', { row: n, column: 'Number' }) })).sort((a, b) => b.v - a.v); const total = c.num('table_cell', { row: 'Total', column: 'Number' }); const parental = rows.slice(0, 2).map((r) => r.n); const together = parental.includes('A B') && parental.includes('a b') ? 'dominants together' : parental.includes('A b') && parental.includes('a B') ? 'dominant with recessive' : '?'; return [together, round(((rows[2].v + rows[3].v) / total) * 100, 6)]; };
      const is = (pair: string, cm: number) => (c: Ctx) => found(c)[0] === pair && near(found(c)[1], cm);
      return [is('dominant with recessive', 10), is('dominants together', 10), is('dominant with recessive', 5), is('dominants together', 90)];
    })()],
    h: ['The offspring classes that are most common carry the chromosomes the heterozygous parent received unchanged from its own parents.', 'The two rare classes come from crossing over. Their share of all the offspring, as a percentage, is the map distance.'],
    s: 'In a testcross each offspring phenotype shows which chromosome it received from the heterozygous parent. Read from the table: the large classes are A b (452) and a B (448), so these are the parental chromosomes: the parent carried A with b on one chromosome and a with B on the other. The small classes, A B (48) and a b (52), are recombinants: (48 + 52) ÷ 1000 = 10%, so the genes are 10 map units apart.',
  },
]);

// ── Community Interactions and Diversity (pack 053) ─────────────────────────

G('038a26f6.lo-4', 'Simpson\'s index for two sites compared', [
  {
    t: 'the index of the more diverse of two sites', d: 3, need: 'calc',
    spec: table(['Species', 'Site 1', 'Site 2'], [['Oak', 50, 40], ['Maple', 25, 40], ['Birch', 25, 20], ['Total', 100, 100]], { rowHeaders: true, totalsRow: true }),
    alt: 'A table of trees at two sites: one row for each of three species, with the number of trees of that species at each site, and a total for each site.',
    q: 'The table gives the numbers of trees of three species at two sites. Using D = 1 − Σ(n/N)², what is Simpson\'s Diversity Index of the more diverse of the two sites? Give your answer to two decimal places.',
    n: '0.64',
    calc: ['D = 1 − Σ(n/N)² for each site from its three counts and its printed total (table_cell); the larger of the two', (c) => Math.max(...['Site 1', 'Site 2'].map((s) => { const n = c.num('table_cell', { row: 'Total', column: s }); return 1 - sum(['Oak', 'Maple', 'Birch'].map((sp) => (c.num('table_cell', { row: sp, column: s }) / n) ** 2)); }))],
    alts: ['with each squared proportion rounded to two decimal places before adding', (c) => [1 - sum(['Oak', 'Maple', 'Birch'].map((sp) => round((c.num('table_cell', { row: sp, column: 'Site 2' }) / 100) ** 2, 2)))]],
    h: ['For each site turn the three counts into proportions of that site\'s total, square them and add.', 'Both sites have the same three species, so the index must be worked out for each before they can be compared.'],
    s: 'Read from the table: each site has 100 trees. Site 1 has proportions 0.50, 0.25 and 0.25, so D = 1 − (0.25 + 0.0625 + 0.0625) = 0.625. Site 2 has proportions 0.40, 0.40 and 0.20, so D = 1 − (0.16 + 0.16 + 0.04) = 0.64. Site 2 is the more diverse, because its trees are shared more evenly among the species, and its index is 0.64.',
  },
]);

// ITEMS-END

/** Kinds of this round that get no item here, and why — none: every kind has objectives it genuinely serves. */
const KIND_NOT_COVERED: Record<string, string> = {};

/** Objectives that were considered and left out, and why (written into mapping.json). */
const CONSIDERED_NOT_USED: Record<string, string> = {
  '21937bfb.lo-3': 'computing a chi-square statistic from a table: the pack already holds the plain calculation, the "which class contributes most" variant and the backwards variant — a table item would differ from one of them only in its numbers',
  '4dfe2b18.lo-4': 'the Mean Value Theorem on tabulated positions: the pack already holds exactly this task ("which speed must the runner have had") — a second table would be its twin',
  '9f2a3bed.lo-2': 'two-sided limits from a table: all three pack items are already tables of this kind (converging, converging with a different value at the point, two sides disagreeing)',
  '72b3b3de.lo-2': 'DNA replication during S phase: a replication-fork figure fits the mechanism objectives of the replication pack; here the lesson is about DNA content, which the cell-cycle wheel serves under lo-5',
  '233ad806 (a battery on the primary)': 'the transformer kind can draw a DC source, for which the secondary voltage is zero; the lesson text of the pack never states that a transformer needs a changing current, so no item rests on it',
  '7aae9be7.lo-1': 'defining photoemission: the qualitative items the figure could carry (frequency against intensity) are already in the pack four times over',
};

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

// ── objectives: the lesson packs and the released figure rows ───────────────

interface Objective { loId: string; subject: string; skill: string; description: string; pack: string; have: number; existing: string }
function loadObjectives(): Map<string, Objective> {
  const out = new Map<string, Objective>();
  for (const f of fs.readdirSync(PACKS).filter((x) => x.endsWith('.json')).sort()) {
    const pack = JSON.parse(fs.readFileSync(path.join(PACKS, f), 'utf8')) as { subject: string; skill: string; objectives: Array<{ objectiveLoId: string; description: string; have?: number; existingItems?: unknown }> };
    for (const o of pack.objectives) out.set(o.objectiveLoId, { loId: o.objectiveLoId, subject: pack.subject, skill: pack.skill, description: o.description, pack: f.replace('.json', ''), have: o.have ?? 0, existing: typeof o.existingItems === 'string' ? o.existingItems : JSON.stringify(o.existingItems ?? '') });
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
  type Row = { id: string; loId: string };
  const earlierFound = EARLIER_ROWS.filter((f) => fs.existsSync(f));
  const earlier = earlierFound.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')) as Row[]);
  const earlierByLo = new Map<string, number>();
  for (const r of earlier) earlierByLo.set(r.loId, (earlierByLo.get(r.loId) ?? 0) + 1);

  if (argv.includes('--list-objectives')) {
    const per = new Map<string, Item[]>();
    for (const a of ITEMS) per.set(a.lo, [...(per.get(a.lo) ?? []), a]);
    for (const [lo, items] of per) {
      const o = byShort.get(lo);
      console.log(`${o?.pack ?? '???'} ${lo} ${items.length} | ${o?.subject} | ${o?.skill} | ${o?.description}`);
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
  const specsPerLo = new Map<string, string[]>();
  const meta: Array<{ id: string; lo: Objective; item: Item; format: string; proof: string }> = [];
  const plain = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  for (const [n, a] of ITEMS.entries()) {
    const obj = byShort.get(a.lo);
    const tag = `#${n + 1} ${a.lo} (${a.t})`;
    if (!obj) { problems.push(`${tag}: no objective ${a.lo} in the lesson packs`); continue; }
    if (!(BATCH5_FIGURE_KINDS as readonly string[]).includes(a.spec.type)) problems.push(`${tag}: ${a.spec.type} is not one of the kinds of this batch`);
    if (![2, 3, 4].includes(a.d)) problems.push(`${tag}: an item of this batch is level 2, 3 or 4`);
    const kinds = perLo.get(obj.loId) ?? [];
    if (kinds.includes(a.t)) problems.push(`${tag}: task kind repeated within the objective`);
    kinds.push(a.t);
    perLo.set(obj.loId, kinds);
    // No twins: two items of one objective never share a figure, and no stem repeats an item the pack already holds.
    const specs = specsPerLo.get(obj.loId) ?? [];
    if (specs.includes(JSON.stringify(a.spec))) problems.push(`${tag}: the same figure is used twice within the objective`);
    specs.push(JSON.stringify(a.spec));
    specsPerLo.set(obj.loId, specs);
    if (plain(obj.existing).includes(plain(a.q).slice(0, 90))) problems.push(`${tag}: the stem repeats an item the pack already holds`);
    const id = itemIdOf(obj.loId, a.q);
    const bad = (m: string) => problems.push(`${tag}: ${m}`);

    try {
      const c = new Ctx(a.spec);
      const responseFormat: 'mcq' | 'numeric' = a.o ? 'mcq' : 'numeric';
      if (!a.o === !a.n) bad('give options or a number, not both / neither');
      if ([a.ck, a.calc, a.holds].filter(Boolean).length !== 1) bad('give exactly one of ck / calc / holds');
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
      const stated = Number(answer);
      const places = (answer.split('.')[1] ?? '').length;
      const fits = (v: number): boolean => Number.isFinite(v) && (near(v, stated) || (places > 0 && Math.abs(v - stated) <= 0.5 * 10 ** -places + 1e-9));
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
        } else if (!fits(Number(v))) bad(`stated key ${answer}, computed ${v}`);
      } else if (a.holds) {
        if (!a.o || a.holds[1].length !== 4) bad('holds needs one test per option');
        const truth = a.holds[1].map((f) => f(c));
        proofHow = a.holds[0];
        proofResult = `options that answer the question, as written: [${truth.map((x, i) => (x ? a.o![i][0] : '')).filter(Boolean).join(' | ')}]`;
        if (!(truth[0] && truth.slice(1).every((x) => !x))) bad(`the key does not follow from the spec — the options as written: ${JSON.stringify(truth)}`);
      }
      // A numeric key must survive the other routes a student may take (early rounding, another value of a constant).
      if (a.alts) {
        if (a.o) bad('alts are for a numeric key');
        for (const alt of a.alts[1](c)) if (!(Number.isFinite(alt) && Math.abs(alt - stated) <= 0.5 * 10 ** -places + 1e-9)) bad(`the key moves with ordinary rounding — ${a.alts[0]}: ${alt} against the stated ${answer}`);
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
      // A hint must not give the key: the key's text, or (numeric) the key as a number of its own.
      const keyCanon = canonText(keyText).toLowerCase();
      for (const h of a.h) {
        if (keyText.length > 2 && canonText(h).toLowerCase().includes(keyCanon)) bad('a hint contains the answer');
        if (!a.o && new RegExp(`(?<![\\d.,/−-])${answer.replace('-', '[−-]').replace('.', '\\.')}(?![\\d/]|[.,]\\d)`).test(h.replace(/\b(?:x|y|t)\s*=\s*[−-]?[\d.]+/g, ''))) bad(`a hint prints the key ${answer}`);
      }
      if (/\\[a-zA-Z]|\$/.test([a.q, a.s, ...a.h, ...choices].join(' '))) bad('LaTeX in the text');
      if (a.h.length !== 2) bad('needs two hints');
      if (a.s.length < 60) bad('the solution is too short to name what is read from the figure');
      if (!/\bread/i.test(a.s)) bad('the solution does not say what is read from the figure');

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
        source: { name: 'Evelyn (practice-extend offline job, figure track — hand-authored batch-7 figures)' }, license: 'internal-original', verifiedAt: now,
        verifierModel: 'none — key proven from the figure spec in code + visual read',
      });
      proofs.push({ id, loId: obj.loId, kind: a.spec.type, format: responseFormat, need: a.need, difficulty: a.d, key: answer, keyText, proof: proofKind, how: proofHow, result: proofResult, checkers: a.ck ? [{ checker: a.ck[0], args: a.ck[1], result: proofResult }] : c.used });
      meta.push({ id, lo: obj, item: a, format: responseFormat, proof: proofKind });
      pngs.push({ id, svg: figure.svg });
      cards.push(`<section id="${esc(id)}"><div class="fig">${figure.svg}</div><div class="q"><p class="meta">#${n + 1} · ${esc(id)}<br>${esc(obj.subject)} · ${esc(obj.skill)}<br>${esc(obj.description)}<br>task: ${esc(a.t)} · level ${a.d} · ${responseFormat} · ${esc(a.spec.type)} · asks: ${a.need}</p><p class="stem">${esc(a.q)}</p>${
        choices.length ? `<ol type="A">${choices.map((x, i) => `<li class="${'ABCD'[i] === answer ? 'key' : ''}">${esc(x)}${'ABCD'[i] === answer ? ' ✓' : ` <span class="why">— ${esc(rationales[i])}</span>`}</li>`).join('')}</ol>` : ''
      }<p><b>Key:</b> ${esc(answer)}${choices.length ? ` — ${esc(keyText)}` : ''}</p><p><b>Hints:</b> ${a.h.map(esc).join(' / ')}</p><p><b>Solution:</b> ${esc(a.s)}</p><p class="der"><b>Proof (${proofKind}):</b> ${esc(proofHow)} → ${esc(proofResult)}</p><p class="der"><b>Alt:</b> ${esc(alt)}</p><details><summary>spec · figure as text</summary><pre>${esc(JSON.stringify(a.spec, null, 1))}\n\n${esc(figureText)}</pre></details></div></section>`);
    } catch (e) {
      bad(`threw — ${(e as Error).message}`);
    }
  }

  // ── caps, ids, kinds, mapping ─────────────────────────────────────────────
  const ids = rows.map((r) => r.id as string);
  if (new Set(ids).size !== ids.length) problems.push(`ids are not unique: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
  const taken = new Set(earlier.map((r) => r.id));
  for (const r of rows) {
    if (!/^practice-gen\.gen-[0-9a-f-]+\.lo-\d+\.[0-9a-z]+$/.test(r.id as string) || !(r.id as string).startsWith(`practice-gen.${r.loId}.`)) problems.push(`${r.id}: id is not in the scheme / does not match its loId`);
    if (taken.has(r.id as string)) problems.push(`${r.id}: id already used by an earlier figure row`);
    if (r.responseFormat === 'mcq' && ((r.choices as string[]).length !== 4 || !/^[ABCD]$/.test(r.answer as string))) problems.push(`${r.id}: mcq without four options and a letter`);
  }
  for (const [lo, kinds] of perLo) if (kinds.length > CAP_PER_OBJECTIVE) problems.push(`${shortOf(lo)}: ${kinds.length} items, cap ${CAP_PER_OBJECTIVE}`);
  // The correct option must not sit on one letter throughout.
  const letters = rows.filter((r) => r.responseFormat === 'mcq').map((r) => r.answer as string);
  for (const l of 'ABCD') if (letters.length >= 12 && letters.filter((x) => x === l).length > letters.length * 0.45) problems.push(`the key is option ${l} in ${letters.filter((x) => x === l).length} of ${letters.length} multiple-choice items`);
  for (const kind of BATCH5_FIGURE_KINDS) {
    const n = meta.filter((m) => m.item.spec.type === kind).length;
    if (n === 0 && !KIND_NOT_COVERED[kind]) problems.push(`${kind}: no item, and no reason given in KIND_NOT_COVERED`);
    if (n > 0 && KIND_NOT_COVERED[kind]) problems.push(`${kind}: has items and is also listed as not covered`);
  }

  const count = <T,>(xs: T[], key: (x: T) => string): Record<string, number> => xs.reduce((t, x) => ({ ...t, [key(x)]: (t[key(x)] ?? 0) + 1 }), {} as Record<string, number>);
  const coveredLos = [...new Set(meta.map((m) => m.lo.loId))];
  const mapping = {
    kinds: BATCH5_FIGURE_KINDS.map((kind) => {
      const mine = meta.filter((m) => m.item.spec.type === kind);
      if (!mine.length) return { kind, status: 'not-covered', note: KIND_NOT_COVERED[kind] ?? '' };
      return { kind, status: 'covered', items: mine.length, levels: mine.map((m) => m.item.d).sort().join(','), subjects: count(mine, (m) => m.lo.subject), objectives: [...new Set(mine.map((m) => shortOf(m.lo.loId)))] };
    }),
    objectives: coveredLos.map((lo) => {
      const o = objectives.get(lo)!;
      const mine = meta.filter((m) => m.lo.loId === lo);
      return { loId: lo, pack: o.pack, subject: o.subject, skill: o.skill, objective: o.description, itemsInPack: o.have, earlierFigureRows: earlierByLo.get(lo) ?? 0, newItems: mine.length, newLevels: mine.map((m) => m.item.d).sort().join(','), kinds: [...new Set(mine.map((m) => m.item.spec.type))].join(', '), tasks: mine.map((m) => m.item.t), ids: mine.map((m) => m.id) };
    }),
    consideredNotUsed: CONSIDERED_NOT_USED,
  };
  const summary = {
    generatedAt: now,
    items: rows.length,
    objectives: coveredLos.length,
    bySubject: count(meta, (m) => m.lo.subject),
    byKind: count(meta, (m) => m.item.spec.type),
    byFormat: count(meta, (m) => m.format),
    byProof: count(meta, (m) => m.proof),
    byDifficulty: count(meta, (m) => `level ${m.item.d}`),
    bySubjectAndDifficulty: count(meta, (m) => `${m.lo.subject} · level ${m.item.d}`),
    byKindAndDifficulty: count(meta, (m) => `${m.item.spec.type} · level ${m.item.d}`),
    asks: count(meta, (m) => m.item.need),
    keyLetters: count(letters, (l) => l),
    kindsNotCovered: KIND_NOT_COVERED,
    earlierRowFilesRead: earlierFound,
    earlierRowFilesMissing: EARLIER_ROWS.filter((f) => !earlierFound.includes(f)),
    earlierIds: taken.size,
  };

  console.log(`${ITEMS.length} items declared, ${rows.length} built, on ${coveredLos.length} objectives`);
  console.log(JSON.stringify({ bySubject: summary.bySubject, byKind: summary.byKind, byFormat: summary.byFormat, byProof: summary.byProof, byDifficulty: summary.byDifficulty, keyLetters: summary.keyLetters, earlierRowFilesMissing: summary.earlierRowFilesMissing }, null, 1));
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
  fs.writeFileSync(path.join(outDir, 'final', `figure-rows-batch7${wip ? '-wip' : ''}.json`), JSON.stringify(rows, null, 2) + '\n');
  if (!wip) {
    fs.writeFileSync(path.join(outDir, 'final', 'audited-figure-ids.json'), JSON.stringify(ids) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'key-proofs.json'), JSON.stringify(proofs, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify(mapping, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
    if (fs.existsSync(path.join(outDir, 'final', 'figure-rows-batch7-wip.json'))) fs.unlinkSync(path.join(outDir, 'final', 'figure-rows-batch7-wip.json'));
  }
  fs.writeFileSync(path.join(outDir, 'gallery.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Batch-7 figure practice items — gallery</title><style>
body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}
h1{font-size:20px}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}
.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block;border:1px dashed #bbb}.q{flex:1;min-width:300px}
.meta{font-size:12px;color:#666}.stem{font-weight:600}li.key{font-weight:700;color:#0a6b2d}.why{color:#777;font-weight:400;font-size:13px}.der{font-size:13px;color:#444}pre{font-size:12px;white-space:pre-wrap;background:#f8f8f6;padding:8px}
</style></head><body><h1>Batch-7 figure practice items — ${rows.length} first items for the eight figure kinds of round five</h1><p>Each figure is shown at 340 px, as on the student's card. The key (✓) is proven from the figure spec in code; the proof line says how. No model was used. Generated ${esc(now)}.</p>${cards.join('\n')}</body></html>\n`);

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
