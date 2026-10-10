/**
 * Batch 3 of the figure kinds (molecular_structure, gel_electrophoresis with
 * its amplification_plot variant, bio_schematic, schematic_map) and the
 * bar-magnet variant of field_diagram: the TEXT transcription of each figure
 * and the deterministic checkers, in the conventions of figure-core-batch2.ts:
 *   - each kind is read through the SAME model its renderer draws from;
 *   - the transcription says exactly what is visible — a "?" is a blank,
 *     never the value under it; what the spec holds but does not print is not
 *     mentioned; a shape whose NAME is the question is described as a shape;
 *   - a checker recomputes the key from the spec, and refuses what the figure
 *     cannot settle.
 * Also here: `figureLetterClash` — the guard an item author runs to learn that
 * the option letters of a multiple-choice question coincide with single-letter
 * labels printed on its figure.
 *
 * figure-core.ts registers this file (`describeFigure`, `runChecker`,
 * `checkerCatalogue`, `axesOf`) with one import and four short lines. A
 * refusal is thrown as figure-core-batch2.ts's `Batch2RuleError`, which
 * figure-core.ts already rethrows as its own `FigureRuleError`.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import { renderPracticeFigure, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { PracticeFigureSpecError, Reader } from '../../src/lib/tutor/practice-figure/spec';
import { BATCH3_FIGURE_KINDS, type Batch3FigureKind } from '../../src/lib/tutor/practice-figure/kinds/batch3';
import { VALENCE, atomIndex, atomText, bondsAt, moleculeFormula, moleculeModel, vsepr, type MolAtom, type Molecule, type MoleculeModel } from '../../src/lib/tutor/practice-figure/kinds/molecule';
import { gelLayout, gelModel, type AmpModel, type GelLane, type GelModel } from '../../src/lib/tutor/practice-figure/kinds/gel';
import { bioModel, divisionCounts, stageName, type BioModel, type DivisionStage, type MembraneTarget, type OrganelleType, type SpaceId } from '../../src/lib/tutor/practice-figure/kinds/bio-schematic';
import { mapModel, type MapModel } from '../../src/lib/tutor/practice-figure/kinds/schematic-map';
import { barMagnetModel, magnetFieldAt, type BarMagnetModel } from '../../src/lib/tutor/practice-figure/kinds/bar-magnet';
import type { Derived } from './figure-core';
import { Batch2RuleError } from './figure-core-batch2';

export { BATCH3_FIGURE_KINDS };
export type { Batch3FigureKind };

type P = Record<string, unknown>;
function fail(m: string): never {
  throw new Batch2RuleError(m);
}
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const fmt = (v: number): string => { const r = Number(v.toPrecision(10)); return String(Object.is(r, -0) ? 0 : r); };
const BLANK = '(blank — a "?" box)';
const shown = (s: string): string => (s === '?' ? BLANK : `"${s}"`);
const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;

function modelOf<T>(spec: PracticeFigureSpec, build: (r: Reader) => T): T {
  try {
    return build(new Reader(spec.type, spec.params));
  } catch (e) {
    if (e instanceof PracticeFigureSpecError) return fail(e.message.replace(/^\[practice-figure:[^\]]+\]\s*/, ''));
    throw e;
  }
}
const num = (v: number): Derived => ({ kind: 'number', value: Number(v.toPrecision(12)) });
const approx = (v: number): Derived => ({ kind: 'number', value: Number(v.toPrecision(12)), approx: true });
const text = (value: string): Derived => ({ kind: 'text', value });
const label = (value: string): Derived => ({ kind: 'label', value });
const measured = (v: number): Derived => (Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-6 ? num(Math.round(v * 1e4) / 1e4) : approx(v));
function argIndex(a: P, k: string, n: number, what: string): number {
  const v = a[k] === undefined ? 0 : a[k];
  if (!isNum(v) || !Number.isInteger(v) || v < 0 || v >= n) return fail(`derivation argument "${k}" must be the 0-based index of a ${what} (0 to ${n - 1})`);
  return v;
}
function argStr(a: P, k: string): string {
  const v = a[k];
  if (typeof v !== 'string' || !v.trim()) return fail(`derivation argument "${k}" must be a name printed on (or given in) the figure`);
  return v.trim();
}
function argNum(a: P, k: string): number {
  const v = a[k];
  if (!isNum(v)) return fail(`derivation argument "${k}" must be a number`);
  return v;
}
const pick = <T extends string>(a: P, k: string, allowed: readonly T[], dflt?: T): T => {
  const v = a[k] === undefined && dflt !== undefined ? dflt : a[k];
  if (typeof v !== 'string' || !allowed.includes(v as T)) return fail(`derivation argument "${k}" must be one of ${allowed.join(' | ')}`);
  return v as T;
};
/** Eight directions, counter-clockwise from "right" — as figure-core-batch2.ts words a field direction. */
const COMPASS = ['right', 'up and to the right', 'up', 'up and to the left', 'left', 'down and to the left', 'down', 'down and to the right'];
const MAP_COMPASS = ['east', 'northeast', 'north', 'northwest', 'west', 'southwest', 'south', 'southeast'];
/** The index (0–7) of the eighth of the compass a vector points along; refused when it is over 12° off all eight. */
function eighth(x: number, y: number, what: string): number {
  if (Math.hypot(x, y) < 1e-9) return fail(`${what}: the direction is not defined (the two places coincide, or the field is zero there)`);
  const ang = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const k = Math.round(ang / 45) % 8;
  if (Math.abs(((ang - k * 45 + 540) % 360) - 180) > 12) return fail(`${what} points ${fmt(Number(ang.toFixed(0)))}° counter-clockwise from "right"/east — not within 12° of one of the eight compass directions`);
  return k;
}
const nearestEighth = (x: number, y: number): number => Math.round((((Math.atan2(y, x) * 180) / Math.PI + 360) % 360) / 45) % 8;

// ── molecular structures ────────────────────────────────────────────────────

const ORDER_WORD = ['', 'single', 'double', 'triple'];
const ELECTRONEGATIVITY: Record<string, number> = { F: 3.98, O: 3.44, Cl: 3.16, N: 3.04, Br: 2.96, I: 2.66, S: 2.58, C: 2.55, Se: 2.55, H: 2.2, P: 2.19, B: 2.04, Si: 1.9 };

/** What an atom is called in a transcription: its printed text, or what stands in its place. */
function atomWord(mol: Molecule, a: MolAtom): string {
  if (a.show.label === 'blank') return 'an atom whose symbol is a "?" box';
  if (a.show.label === 'none') return mol.skeletal && a.el === 'C' ? 'an unlabelled corner (a carbon atom)' : 'an unlabelled atom';
  return `"${atomText(a)}"`;
}
function moleculeText(m: MoleculeModel, printed: string[], out: string[]): string {
  const many = m.molecules.length > 1;
  out.push(`${many ? `${m.molecules.length} structures` : 'One structure'} drawn as atoms (element symbols) joined by bond lines${m.arrangement === 'shared' && many ? ', in one frame' : many ? ', side by side' : ''}. A pair of dots beside an atom is a lone pair; a ringed + or − is a formal charge.${m.molecules.some((x) => x.skeletal) ? ' In a skeletal structure every unlabelled corner or line end is a carbon atom carrying enough hydrogens to make four bonds.' : ''}`);
  if (m.between === 'resonance' && many) out.push('A double-headed arrow stands between neighbouring structures.');
  m.molecules.forEach((mol, mi) => {
    if (mol.label) printed.push(`caption: ${shown(mol.label)}`);
    out.push(`${many ? `Structure ${mi + 1}` : 'The structure'}${mol.label ? `, captioned ${shown(mol.label)}` : ''}${mol.skeletal ? ' (skeletal)' : ''}:`);
    const names = mol.atoms.map((a, i) => `atom ${i + 1}`);
    mol.atoms.forEach((a, i) => {
      const bits: string[] = [];
      if (a.show.label === 'value') printed.push(`atom label: "${atomText(a)}"`);
      if (a.lonePairs !== undefined && a.show.lonePairs === 'value') bits.push(a.lonePairs === 0 ? 'no lone pairs' : `${plural(a.lonePairs, 'lone pair')} (${a.lonePairs * 2} dots)`);
      if (a.show.lonePairs === 'blank') bits.push(`its lone pairs are replaced by ${BLANK}`);
      if (a.show.charge === 'value') { const c = Math.abs(a.charge) === 1 ? (a.charge > 0 ? '+' : '−') : `${Math.abs(a.charge)}${a.charge > 0 ? '+' : '−'}`; printed.push(`charge mark: "${c}"`); bits.push(`a formal-charge mark "${c}"`); }
      if (a.show.charge === 'blank') bits.push(`a formal-charge mark that is ${BLANK}`);
      if (a.partial) { const d = a.partial === '+' ? 'δ+' : 'δ−'; printed.push(`partial charge: "${d}"`); bits.push(`the partial charge "${d}"`); }
      out.push(`  ${names[i]}: ${atomWord(mol, a)}${bits.length ? ` — ${bits.join('; ')}` : ''}.`);
    });
    mol.bonds.forEach((b) => {
      const kind = b.show === 'blank' ? `a bond whose order is ${BLANK} (drawn as one dashed line)` : b.style === 'wedge' ? `a single bond drawn as a solid wedge (narrow at ${names[b.a]}): it points toward the viewer` : b.style === 'dash' ? `a single bond drawn as a hashed wedge (narrow at ${names[b.a]}): it points away from the viewer` : `a ${ORDER_WORD[b.order]} bond (${plural(b.order, 'line')})`;
      out.push(`  ${names[b.a]} – ${names[b.b]}: ${kind}${b.dipole ? `; a crossed arrow beside it points toward ${names[b.dipole === 'to_a' ? b.a : b.b]} (the crossed end is the δ+ end)` : ''}.`);
    });
    mol.highlight.forEach((h) => {
      if (h.label) printed.push(`group label: "${h.label}"`);
      out.push(`  A dashed outline${h.label ? ` marked "${h.label}"` : ''} encloses ${h.atoms.map((i) => names[i]).join(', ')}.`);
    });
  });
  m.hbonds.forEach((hb) => out.push(`A dotted line joins atom ${hb.from[1] + 1} of structure ${hb.from[0] + 1} to atom ${hb.to[1] + 1} of structure ${hb.to[0] + 1}.`));
  return many ? 'a set of structural formulas' : 'a structural formula of a molecule';
}

function molOf(m: MoleculeModel, a: P): Molecule {
  return m.molecules[argIndex(a, 'molecule', m.molecules.length, 'structure')];
}
function atomOf(mol: Molecule, a: P, k = 'atom'): number {
  const id = argStr(a, k);
  const i = atomIndex(mol, id);
  if (i < 0) return fail(`the structure has no atom with id "${id}" (ids: ${mol.atoms.map((x) => x.id).join(', ')})`);
  return i;
}
/** Lone pairs of an atom for counting: given, or 0 for hydrogen; refused when the spec does not say. */
function lonePairsOf(mol: Molecule, i: number): number {
  const a = mol.atoms[i];
  if (a.lonePairs !== undefined) return a.lonePairs;
  if (a.el === 'H' || (mol.skeletal && a.el === 'C')) return 0;
  return fail(`atom "${a.id}" has no lonePairs in the spec — a count of electrons needs the lone pairs of every atom`);
}
const hydrogensOn = (a: MolAtom): number => a.h + a.implicitH;
/** The functional group a set of atoms makes, by its usual name. */
function functionalGroup(mol: Molecule, atoms: number[]): string {
  const inSet = new Set(atoms);
  const el = (i: number) => mol.atoms[i].el;
  const nbrs = (i: number) => bondsAt(mol, i).map((b) => ({ j: b.a === i ? b.b : b.a, order: b.order }));
  const explicitH = (i: number) => nbrs(i).filter((x) => el(x.j) === 'H').length + hydrogensOn(mol.atoms[i]);
  const has = (e: string) => atoms.some((i) => el(i) === e);
  if (has('P') && has('O')) return 'phosphate';
  for (const c of atoms.filter((i) => el(i) === 'C')) {
    const n = nbrs(c);
    const dblO = n.find((x) => el(x.j) === 'O' && x.order === 2 && inSet.has(x.j));
    if (!dblO) continue;
    const singleO = n.filter((x) => el(x.j) === 'O' && x.order === 1 && inSet.has(x.j));
    if (singleO.some((x) => explicitH(x.j) > 0)) return 'carboxyl';
    if (singleO.some((x) => mol.atoms[x.j].charge < 0)) return 'carboxylate';
    if (singleO.some((x) => nbrs(x.j).some((y) => y.j !== c && el(y.j) === 'C'))) return 'ester';
    if (n.some((x) => el(x.j) === 'N' && inSet.has(x.j))) return 'amide';
    const hOnC = explicitH(c);
    return hOnC > 0 ? 'aldehyde' : 'ketone';
  }
  if (has('S') && atoms.some((i) => el(i) === 'S' && explicitH(i) > 0)) return 'sulfhydryl';
  if (has('N')) return 'amino';
  for (const o of atoms.filter((i) => el(i) === 'O')) {
    if (explicitH(o) > 0) return 'hydroxyl';
    if (nbrs(o).filter((x) => el(x.j) === 'C').length === 2) return 'ether';
  }
  if (atoms.length === 1 && el(atoms[0]) === 'C' && hydrogensOn(mol.atoms[atoms[0]]) + nbrs(atoms[0]).filter((x) => el(x.j) === 'H').length === 3) return 'methyl';
  return fail('the outlined atoms are not one of the groups this checker knows (hydroxyl, carbonyl as aldehyde / ketone, carboxyl, carboxylate, ester, amide, amino, sulfhydryl, phosphate, ether, methyl)');
}
/** Sum of |formal charge| over a structure, and the charge sitting on its most electronegative charged atom. */
function chargeScore(mol: Molecule): { total: number; misplaced: number } {
  const total = mol.atoms.reduce((s, a) => s + Math.abs(a.charge), 0);
  // A negative charge belongs on the more electronegative atom: count negative charge weighted by how far down the scale it sits.
  const neg = mol.atoms.filter((a) => a.charge < 0);
  const best = Math.max(...mol.atoms.filter((a) => a.el !== 'H').map((a) => ELECTRONEGATIVITY[a.el] ?? 0));
  const misplaced = neg.reduce((s, a) => s + (best - (ELECTRONEGATIVITY[a.el] ?? 0)) * Math.abs(a.charge), 0);
  return { total, misplaced };
}

// ── gels and amplification plots ────────────────────────────────────────────

function gelText(m: GelModel | AmpModel, printed: string[], out: string[]): string {
  if (m.variant === 'amplification_plot') {
    printed.push(`axis label: "${m.xLabel}"`, `axis label: "${m.yLabel}"`);
    out.push(`An amplification plot: horizontal axis "${m.xLabel}" from 0 to ${m.cycles}, numbered every 5 with a gridline at every whole cycle; vertical axis "${m.yLabel}" numbered from 0 to 1.2 in steps of 0.2.`);
    if (m.showThreshold) { printed.push('label: "threshold"'); out.push(`A dashed horizontal line labelled "threshold" at ${fmt(m.threshold)}.`); }
    out.push(`${plural(m.samples.length, 'curve')}, each in its own stroke pattern, named in a legend under the plot:`);
    m.samples.forEach((s) => {
      printed.push(`legend entry: ${shown(s.label)}`);
      const where = s.ct === null ? 'stays flat along the baseline and never reaches the threshold' : `rises in an S shape${m.showThreshold ? `, crossing the threshold ${Math.abs(s.ct - Math.round(s.ct)) < 1e-9 ? `at cycle ${fmt(s.ct)}` : `between cycles ${Math.floor(s.ct)} and ${Math.ceil(s.ct)}`}` : ''}, and levels off near ${fmt(Number(s.plateau.toFixed(2)))}`;
      out.push(`  the curve named ${shown(s.label)} ${where}.`);
    });
    return 'a qPCR amplification plot (fluorescence against cycle number)';
  }
  const L = m.ladder;
  const { ladderLabel } = gelLayout(m);
  out.push(`A gel: a rectangle with ${m.lanes.length + 1} lanes, each with a well (a small box) at the top; bands are dark horizontal bars. A band further from the wells is a smaller fragment. The unit "${L.unit}" is printed over the size labels.`);
  printed.push(`unit: "${L.unit}"`);
  if (ladderLabel) printed.push(`lane label: ${shown(ladderLabel)}`);
  const tag = (s: number): string => (L.hide.includes(s) ? 'an unlabelled marker' : L.blank.includes(s) ? `the marker whose label is ${BLANK}` : `the "${fmt(s)}" marker`);
  out.push(`Lane 1 (far left${ladderLabel ? `, labelled ${shown(ladderLabel)}` : ', no label'}) is a size ladder; its bands, from the wells down, are labelled to their left: ${L.sizes.map((s) => (L.hide.includes(s) ? '(no label)' : L.blank.includes(s) ? BLANK : `"${fmt(s)}"`)).join(', ')}.${m.guides ? ' A faint dotted line runs across the gel at the level of each ladder band.' : ''}`);
  L.sizes.forEach((s) => { if (!L.hide.includes(s) && !L.blank.includes(s)) printed.push(`ladder label: "${fmt(s)}"`); });
  const level = (size: number): string => {
    const on = L.sizes.find((s) => Math.abs(Math.log(s / size)) < 0.012);
    if (on !== undefined) return `level with ${tag(on)}`;
    const above = [...L.sizes].reverse().find((s) => s > size);
    const below = L.sizes.find((s) => s < size);
    if (above === undefined) return `above ${tag(L.sizes[0])} (nearer the wells)`;
    if (below === undefined) return `below ${tag(L.sizes[L.sizes.length - 1])} (further from the wells)`;
    const f = Math.log(above / size) / Math.log(above / below);
    return `between ${tag(above)} and ${tag(below)}, ${f < 0.4 ? 'nearer the upper one' : f > 0.6 ? 'nearer the lower one' : 'about half-way'}`;
  };
  m.lanes.forEach((lane, i) => {
    if (lane.label) printed.push(`lane label: ${shown(lane.label)}`);
    out.push(`Lane ${i + 2}${lane.label ? `, labelled ${shown(lane.label)}` : ' (no label)'}: ${lane.bands.length === 0 ? 'no band' : plural(lane.bands.length, 'band')}${lane.bands.length ? ' — ' : ''}${lane.bands.map((b) => { if (b.label) printed.push(`band label: ${shown(b.label)}`); return `${level(b.size)}${b.thick > 1 ? ' (a thicker band)' : ''}${b.label ? `, labelled ${shown(b.label)}` : ''}`; }).join('; ')}.`);
  });
  if (m.electrodes) { printed.push('electrode marks: "−", "+"'); out.push('A "−" is printed at the wells\' end of the gel and a "+" at the far end.'); }
  return 'a schematic of a gel after electrophoresis';
}

function gelOf(spec: PracticeFigureSpec): GelModel {
  const m = modelOf(spec, gelModel);
  if (m.variant !== 'gel') return fail('this checker is for a gel, not an amplification plot');
  return m;
}
function ampOf(spec: PracticeFigureSpec): AmpModel {
  const m = modelOf(spec, gelModel);
  if (m.variant !== 'amplification_plot') return fail('this checker is for the amplification_plot variant');
  return m;
}
/** A lane by its printed label, or by its 0-based index among the sample lanes. */
function laneOf(m: GelModel, v: unknown, k: string): GelLane {
  if (isNum(v) && Number.isInteger(v) && v >= 0 && v < m.lanes.length) return m.lanes[v];
  const hit = typeof v === 'string' ? m.lanes.filter((l) => l.label === v) : [];
  if (hit.length !== 1) return fail(`derivation argument "${k}" must be the label of one sample lane (${m.lanes.map((l) => l.label ?? '(none)').join(', ')}) or its 0-based index`);
  return hit[0];
}
const laneName = (m: GelModel, lane: GelLane): string => lane.label && lane.label !== '?' ? lane.label : `lane ${m.lanes.indexOf(lane) + 2}`;
const sameSize = (a: number, b: number): boolean => Math.abs(Math.log(a / b)) < 0.012;
function sampleOf(m: AmpModel, a: P, k: string): AmpModel['samples'][number] {
  const v = a[k];
  const s = isNum(v) ? m.samples[v] : m.samples.find((x) => x.label === v);
  return s ?? fail(`derivation argument "${k}" must be the name of a curve (${m.samples.map((x) => x.label).join(', ')}) or its 0-based index`);
}

// ── bio schematics ──────────────────────────────────────────────────────────

/** What each organelle is drawn as — never its name. */
const ORGANELLE_SHAPES: Record<OrganelleType, string> = {
  nucleus: 'a large circle with a dark spot inside', rough_er: 'curved bands beside the large circle, carrying small dots', smooth_er: 'a winding tube with no dots', golgi: 'a stack of bowed lines with small circles beside it',
  mitochondrion: 'a capsule with a zig-zag line inside', lysosome: 'a small grey disc', ribosomes: 'a cluster of small free dots', centrioles: 'two small barrels at right angles', cell_membrane: 'the thin outline of the cell',
  chloroplast: 'a capsule with stacks of short bars inside (two are drawn)', central_vacuole: 'a large empty box', cell_wall: 'the thick outer outline',
};
/** The name a checker returns for an organelle (write options with these). */
export const ORGANELLE_KEYS: Record<OrganelleType, string> = {
  nucleus: 'nucleus', rough_er: 'rough ER', smooth_er: 'smooth ER', golgi: 'Golgi apparatus', mitochondrion: 'mitochondrion', lysosome: 'lysosome', ribosomes: 'ribosomes', centrioles: 'centrioles',
  cell_membrane: 'cell membrane', chloroplast: 'chloroplast', central_vacuole: 'central vacuole', cell_wall: 'cell wall',
};
const PART_SHAPES: Record<MembraneTarget, string> = {
  head: 'one of the round heads on the outer face', tails: 'the paired lines between the two rows of heads', carbohydrate: 'the branched chain of small hexagons on the outer end of a protein', cholesterol: 'a short dark bar among the lines between the heads',
  channel: 'the pair of pillars with a gap between them', carrier: 'the block with a notch in its outer end', pump: 'the hourglass-shaped block', peripheral: 'the small oval on the inner face',
};
export const PART_KEYS: Record<MembraneTarget, string> = {
  head: 'phospholipid head', tails: 'fatty acid tails', carbohydrate: 'carbohydrate', cholesterol: 'cholesterol', channel: 'channel protein', carrier: 'carrier protein', pump: 'pump', peripheral: 'peripheral protein',
};
const PROTEIN_SHAPES: Record<string, string> = { channel: 'two pillars through both rows with a gap (a pore) between them', carrier: 'one block through both rows with a notch in its outer end', pump: 'an hourglass-shaped block through both rows', peripheral: 'a small oval lying against the inner row of heads only' };
const SPACE_WORDS: Record<SpaceId, string> = { intermembrane_space: 'the band between the outer box and the inner box', matrix: 'the inside of the inner box', stroma: 'the space between the outer box and the inner box', thylakoid_lumen: 'the inside of the inner box' };
const SPACE_NAMES: Record<SpaceId, string> = { intermembrane_space: 'intermembrane space', matrix: 'matrix', stroma: 'stroma', thylakoid_lumen: 'thylakoid lumen' };

function divisionPicture(stage: DivisionStage, n: number): string {
  const c = divisionCounts(stage, n);
  const X = (k: number) => `${plural(k, 'X-shaped chromosome')} (each two sticks crossed)`;
  switch (stage) {
    case 'prophase': return `${X(c.chromosomes)} scattered inside a dashed circle; no lines to the ends of the cell`;
    case 'metaphase': return `${X(c.chromosomes)} in a single file across the middle of the cell, each joined by thin lines to both ends of the cell`;
    case 'anaphase': return `${plural(c.dna, 'single bent stick')}, ${c.dna / 2} moving to each end of the cell on thin lines, bent ends leading; the cell is one oval`;
    case 'telophase': return `the outline is pinched in the middle; ${plural(c.dna / 2, 'single bent stick')} in a dashed oval at each end; no thin lines`;
    case 'prophase_I': return `${X(c.chromosomes)} lying side by side in ${plural(n, 'matched pair')} (one solid, one hollow, of the same length) inside a dashed circle`;
    case 'metaphase_I': return `${plural(n, 'matched pair')} of X-shaped chromosomes (one solid, one hollow) side by side across the middle of the cell, each chromosome joined by thin lines to the nearer end only`;
    case 'anaphase_I': return `${X(c.chromosomes)}, ${n} moving to each end of the cell on thin lines — the two of each matched pair to opposite ends; each is still an X`;
    case 'telophase_I': return `the outline is pinched in the middle; ${X(n)} in a dashed oval at each end`;
    case 'metaphase_II': return `${X(c.chromosomes)} in a single file across the middle (no matched pairs: one of each length), each joined by thin lines to both ends of the cell`;
    case 'anaphase_II': return `${plural(c.dna, 'single bent stick')}, ${c.dna / 2} moving to each end of the cell on thin lines`;
    default: return `the outline is pinched in the middle; ${plural(c.dna / 2, 'single bent stick')} in a dashed oval at each end`;
  }
}

function bioText(m: BioModel, printed: string[], out: string[]): string {
  if (m.variant === 'cell') {
    out.push(`A schematic ${m.cellType === 'plant' ? 'cell with a thick rectangular outer outline and a thin outline just inside it' : 'cell with a rounded outline'}. Its parts are drawn as simple shapes; leader lines join some of them to labels outside the cell. No key says what the shapes are.`);
    const drawn = m.organelles.some((o) => o.type === 'nucleus') ? m.organelles : [{ type: 'nucleus' as OrganelleType, label: null }, ...m.organelles];
    drawn.forEach((o) => {
      if (o.label) printed.push(`label: ${shown(o.label)}`);
      out.push(`  ${ORGANELLE_SHAPES[o.type]} — ${o.label === null ? 'not labelled' : `labelled ${shown(o.label)}`}.`);
    });
    return `a schematic of ${m.cellType === 'plant' ? 'a plant' : 'an animal'} cell`;
  }
  if (m.variant === 'membrane') {
    out.push('A membrane in cross-section: two rows of round heads, the rows facing away from each other, each head with two lines (tails) pointing inward to the middle.');
    if (m.sideLabels) { printed.push(`side label: "${m.sideLabels[0]}"`, `side label: "${m.sideLabels[1]}"`); out.push(`The space above it is labelled "${m.sideLabels[0]}" and the space below it "${m.sideLabels[1]}".`); }
    const span = m.proteins.filter((q) => q.type !== 'peripheral');
    m.proteins.forEach((q) => {
      const where = q.type === 'peripheral' ? '' : ` (${['first', 'second', 'third'][span.indexOf(q)]} from the left of ${span.length})`;
      if (q.atp) printed.push('label: "ATP"');
      out.push(`  ${PROTEIN_SHAPES[q.type]}${where}${q.carbohydrate ? '; a branched chain of small hexagons stands on its outer end' : ''}${q.atp ? '; "ATP" is printed beside its inner end' : ''}.`);
    });
    if (m.cholesterol) out.push('  Short dark bars lie among the tails here and there.');
    m.solutes.forEach((s, k) => {
      const mark = s.shape === 'circle' ? 'dots' : `${s.shape}s`;
      if (s.name) printed.push(`key entry: "= ${s.name}"`);
      const via = s.through === undefined ? '' : s.through === 'bilayer' ? ' straight through the rows of heads and tails' : ` through the ${['first', 'second', 'third'][span.indexOf(m.proteins[s.through])]} protein from the left`;
      out.push(`  ${s.name ? `"${s.name}"` : `Solute ${k + 1}`} (${mark}): ${s.outside} above the membrane, ${s.inside} below it.${s.arrow ? ` An arrow runs${via}, pointing ${s.arrow === 'in' ? 'down (into the lower space)' : 'up (into the upper space)'}.` : ''}`);
    });
    m.labels.forEach((l) => { printed.push(`label: ${shown(l.label)}`); out.push(`  A leader line joins ${shown(l.label)} to ${PART_SHAPES[l.target]}.`); });
    return 'a schematic cross-section of a cell membrane';
  }
  if (m.variant === 'division') {
    out.push(`${plural(m.cells.length, 'schematic cell')} with chromosomes drawn as sticks. Chromosomes of the same length are a matched pair; one of each pair is solid and the other hollow. A chromosome drawn as an X is two joined chromatids; a single bent stick is one chromatid on its own.`);
    m.cells.forEach((c, i) => {
      const isName = c.label !== null && c.label !== '?' && c.label.toLowerCase().replace(/\s+/g, ' ') === stageName(c.stage).toLowerCase();
      if (c.label) printed.push(`${isName ? 'stage name' : 'cell label'}: ${shown(c.label)}`);
      out.push(`  Cell ${i + 1}${c.label === null ? ' (no label)' : `, labelled ${shown(c.label)}`}: ${divisionPicture(c.stage, m.n)}.`);
    });
    return 'a set of schematic cells in stages of cell division';
  }
  out.push(`A box diagram: a large rounded outer box with a smaller rounded box inside it${m.organelle === 'chloroplast' ? ' (flat, in the lower half)' : ''}.`);
  m.spaces.forEach((sp) => {
    if (sp.label) printed.push(`space label: ${shown(sp.label)}`);
    if (sp.pH !== undefined) printed.push(`value: "pH ${fmt(sp.pH)}"`);
    out.push(`  ${SPACE_WORDS[sp.id].replace(/^the/, 'The')}${sp.label === null ? ' has no label' : ` is labelled ${shown(sp.label)}`}${sp.pH !== undefined ? `, with "pH ${fmt(sp.pH)}" printed in it` : ''}${sp.ions !== undefined ? `; it holds ${plural(sp.ions, 'dot')}` : ''}.`);
  });
  if (m.spaces.some((sp) => sp.ions)) { printed.push('key: "= one H⁺ ion"'); out.push('A key under the diagram says a dot is one H⁺ ion.'); }
  if (m.synthase) out.push(`A knob on a short stalk sits in the wall of the inner box, the knob on the side of ${m.organelle === 'mitochondrion' ? 'the inside of the inner box' : 'the outer space'}.${m.showFlow && m.gradient ? ` An arrow beside it points ${(m.gradient.low === 'matrix' || m.gradient.low === 'thylakoid_lumen') ? 'into the inner box' : 'out of the inner box'}.` : ' No arrow is drawn through it.'}`);
  return `a box diagram of ${m.organelle === 'mitochondrion' ? 'a mitochondrion' : 'a chloroplast'}`;
}

type BioOf<V extends BioModel['variant']> = Extract<BioModel, { variant: V }>;
function bioOf<V extends BioModel['variant']>(spec: PracticeFigureSpec, v: V): BioOf<V> {
  const m = modelOf(spec, bioModel);
  if (m.variant !== v) return fail(`this checker is for the ${v} variant, not ${m.variant}`);
  return m as BioOf<V>;
}
/** Every labelled thing of a bio schematic: its printed label and what it is. */
function bioParts(m: BioModel): Array<{ label: string | null; key: string; id: string }> {
  if (m.variant === 'cell') return m.organelles.map((o) => ({ label: o.label, key: ORGANELLE_KEYS[o.type], id: o.type }));
  if (m.variant === 'membrane') return m.labels.map((l) => ({ label: l.label, key: PART_KEYS[l.target], id: l.target }));
  if (m.variant === 'division') return m.cells.map((c, i) => ({ label: c.label, key: stageName(c.stage), id: String(i) }));
  return m.spaces.map((sp) => ({ label: sp.label, key: SPACE_NAMES[sp.id], id: sp.id }));
}
function soluteOf(m: BioOf<'membrane'>, a: P): BioOf<'membrane'>['solutes'][number] {
  const v = a.solute === undefined ? 0 : a.solute;
  const s = isNum(v) ? m.solutes[v] : m.solutes.find((x) => x.name === v);
  return s ?? fail(`derivation argument "solute" must be the 0-based index of a solute (the figure has ${m.solutes.length})${m.solutes.some((x) => x.name) ? ' or its name' : ''}`);
}
function cellOf(m: BioOf<'division'>, a: P): BioOf<'division'>['cells'][number] {
  const v = a.cell === undefined ? 0 : a.cell;
  const hit = isNum(v) ? [m.cells[v]].filter(Boolean) : m.cells.filter((c) => c.label === v);
  if (hit.length !== 1) return fail(`derivation argument "cell" must be the label of one cell (${m.cells.map((c) => c.label ?? '(none)').join(', ')}) or its 0-based index`);
  return hit[0];
}

// ── schematic maps ──────────────────────────────────────────────────────────

const centroid = (pts: Array<[number, number]>): [number, number] => [pts.reduce((s, q) => s + q[0], 0) / pts.length, pts.reduce((s, q) => s + q[1], 0) / pts.length];
function inPolygon(pts: Array<[number, number]>, x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function mapText(m: MapModel, printed: string[], out: string[]): string {
  out.push(`A schematic map${m.showGrid ? ` on a square grid ${m.cols} squares wide and ${m.rows} squares tall` : ` (${m.cols} units wide and ${m.rows} tall; no grid is drawn)`}. Positions below are in squares from the left edge and from the bottom edge. ${m.north ? 'An arrow marked "N" points up the page.' : 'No north arrow is drawn.'}`);
  if (m.north) printed.push('north arrow: "N"');
  if (m.scale.show === 'none') out.push('No scale bar is drawn.');
  else {
    const s = m.scale.show === 'blank' ? BLANK : `"${fmt(m.scale.length)} ${m.scale.unit}"`;
    printed.push('scale label: "0"', `scale label: ${s}`);
    out.push(`A scale bar under the map is ${fmt(m.scale.squares)} squares long; its ends are labelled "0" and ${s}.`);
  }
  if (m.legend && m.classes.length) {
    printed.push(`legend title: "${m.legend.title}"`);
    out.push(`A legend titled "${m.legend.title}" explains the hatching: ${m.classes.map((v, k) => { printed.push(`legend entry: "${fmt(v)}${m.legend?.unit ? ` ${m.legend.unit}` : ''}"`); return `${['no hatching', 'sparse slanted lines', 'dense slanted lines', 'cross-hatching'][k]} = ${fmt(v)}${m.legend?.unit ? ` ${m.legend.unit}` : ''}`; }).join('; ')}.`);
  }
  m.regions.forEach((reg, i) => {
    const [cx, cy] = centroid(reg.points);
    if (reg.label) printed.push(`region label: ${shown(reg.label)}`);
    const hatch = reg.value === undefined ? '' : `; filled with ${['no hatching', 'sparse slanted lines', 'dense slanted lines', 'cross-hatching'][m.classes.indexOf(reg.value)]}`;
    out.push(`  Region ${i + 1}${reg.label ? `, labelled ${shown(reg.label)}` : ' (no label)'}: an outlined area with corners at ${reg.points.map((q) => `(${fmt(q[0])}, ${fmt(q[1])})`).join(', ')} — centred near (${fmt(Number(cx.toFixed(1)))}, ${fmt(Number(cy.toFixed(1)))})${hatch}.`);
  });
  m.markers.forEach((mk) => {
    printed.push(`marker label: ${shown(mk.label)}`);
    const on = m.regions.findIndex((reg) => inPolygon(reg.points, mk.x, mk.y));
    out.push(`  A dot labelled ${shown(mk.label)} at (${fmt(mk.x)}, ${fmt(mk.y)})${on >= 0 ? `, inside region ${on + 1}` : ', outside every region'}.`);
  });
  m.arrows.forEach((a) => {
    if (a.label) printed.push(`arrow label: "${a.label}"`);
    out.push(`  ${a.dashed ? 'A dashed arrow' : 'An arrow'}${a.label ? ` labelled "${a.label}"` : ''} from (${fmt(a.from[0])}, ${fmt(a.from[1])}) to (${fmt(a.to[0])}, ${fmt(a.to[1])}).`);
  });
  return 'a schematic map of regions on a grid';
}
/** A place on the map: a marker by its label, or a region by its label / name (its centroid). */
function placeOf(m: MapModel, a: P, k: string): [number, number] {
  const v = argStr(a, k);
  const mk = m.markers.find((x) => x.label === v);
  if (mk) return [mk.x, mk.y];
  const reg = m.regions.find((x) => x.label === v || x.name === v);
  if (reg) return centroid(reg.points);
  return fail(`derivation argument "${k}": the map has no marker or region "${v}" (markers: ${m.markers.map((x) => x.label).join(', ') || 'none'}; regions: ${m.regions.map((x) => x.name).join(', ') || 'none'})`);
}

// ── bar magnets ─────────────────────────────────────────────────────────────

function magnetText(m: BarMagnetModel, printed: string[], out: string[]): string {
  const two = m.magnets.length === 2;
  out.push(`${two ? 'Two bar magnets end to end on one horizontal line, with a gap between them' : 'One bar magnet lying horizontally in the middle of the figure'}; each is a rectangle divided into a left half and a right half.`);
  m.magnets.forEach((mg, i) => {
    const which = two ? `The ${i === 0 ? 'left-hand' : 'right-hand'} magnet` : 'The magnet';
    if (mg.poles === 'value') { printed.push('pole label: "N"', 'pole label: "S"'); out.push(`${which}: its left half is marked "${mg.north === 'left' ? 'N' : 'S'}" and its right half "${mg.north === 'right' ? 'N' : 'S'}".`); }
    else out.push(`${which}: ${mg.poles === 'blank' ? `each half holds ${BLANK}` : 'its halves carry no letters'}.`);
  });
  if (!m.lines) out.push('No field lines are drawn.');
  else if (m.arrows) out.push(`Curved field lines with arrowheads: ${m.magnets.map((mg, i) => `they leave the ${mg.north} end of ${two ? `the ${i === 0 ? 'left-hand' : 'right-hand'} magnet` : 'the magnet'} and enter its ${mg.north === 'left' ? 'right' : 'left'} end`).join('; ')}.${two ? ` In the gap between the magnets the lines ${m.interaction === 'attract' ? 'run straight across from one magnet to the other' : 'from the two facing ends bend away from each other and none crosses the gap'}.` : ''}`);
  else out.push(`Curved field lines without arrowheads loop from one end of ${two ? 'each magnet' : 'the magnet'} to the other.${two ? ` In the gap the lines ${m.interaction === 'attract' ? 'run straight across from one magnet to the other' : 'from the two facing ends bend away from each other and none crosses the gap'}.` : ''}`);
  const at = (x: number, y: number): string => `${Math.abs(y) < 0.45 ? 'level with the magnets' : y > 0 ? 'above the line of the magnets' : 'below the line of the magnets'}, ${Math.abs(x) < 0.25 ? 'at the middle of the figure' : `${fmt(Math.abs(Number(x.toFixed(1))))} units ${x < 0 ? 'left' : 'right'} of the middle`} (a magnet is 2.4 units long)`;
  m.compasses.forEach((c) => {
    printed.push(`compass label: "${c.label}"`);
    const [bx, by] = magnetFieldAt(m, c.x, c.y);
    const exact = Math.abs((((Math.atan2(by, bx) * 180) / Math.PI - nearestEighth(bx, by) * 45 + 540) % 360) - 180) <= 12;
    out.push(`  A compass (a small circle) labelled "${c.label}" ${at(c.x, c.y)}: ${c.needle ? `its needle's dark end points ${exact ? '' : 'roughly '}${COMPASS[nearestEighth(bx, by)]}` : 'it is empty — no needle is drawn'}.`);
  });
  if (m.compasses.some((c) => c.needle)) out.push('  The dark end of a compass needle is its north-seeking end.');
  m.points.forEach((q) => { printed.push(`point label: "${q.label}"`); out.push(`  A dot labelled "${q.label}" ${at(q.x, q.y)}.`); });
  return two ? 'a diagram of the magnetic field of two bar magnets' : 'a diagram of the magnetic field of a bar magnet';
}
function magnetOf(spec: PracticeFigureSpec): BarMagnetModel {
  if (spec.params.variant !== 'bar_magnet') return fail('this checker is for the bar_magnet variant of field_diagram');
  return modelOf(spec, barMagnetModel);
}

// ── registration ────────────────────────────────────────────────────────────

/** Is this spec transcribed and checked here? (A batch-3 kind, or the bar-magnet variant of field_diagram.) */
export const isBatch3Spec = (spec: PracticeFigureSpec): boolean => (BATCH3_FIGURE_KINDS as readonly string[]).includes(spec.type) || (spec.type === 'field_diagram' && spec.params?.variant === 'bar_magnet');
export const isBatch3Kind = (type: string): type is Batch3FigureKind => (BATCH3_FIGURE_KINDS as readonly string[]).includes(type);

/** The transcription of a batch-3 figure (as `describeBatch2`); '' when the spec is not one of this file's. */
export function describeBatch3(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  if (spec.type === 'field_diagram') return spec.params?.variant === 'bar_magnet' ? magnetText(modelOf(spec, barMagnetModel), printed, out) : '';
  switch (spec.type as Batch3FigureKind) {
    case 'molecular_structure': return moleculeText(modelOf(spec, moleculeModel), printed, out);
    case 'gel_electrophoresis': return gelText(modelOf(spec, gelModel), printed, out);
    case 'bio_schematic': return bioText(modelOf(spec, bioModel), printed, out);
    case 'schematic_map': return mapText(modelOf(spec, mapModel), printed, out);
    default: return '';
  }
}

export interface Batch3CheckerDef {
  kinds: Array<Batch3FigureKind | 'field_diagram'>;
  args: string;
  returns: string;
  run: (spec: PracticeFigureSpec, args: P) => Derived;
}

export const BATCH3_CHECKERS: Record<string, Batch3CheckerDef> = {
  // molecular_structure
  mol_count: {
    kinds: ['molecular_structure'], args: '{ want: lone_pairs | bonding_pairs | sigma_bonds | pi_bonds | valence_electrons, molecule?: index (0), atom?: id }',
    returns: 'a count over the whole structure, or on one atom when `atom` is given (hydrogens written with a symbol or implied on a skeletal carbon count as bonds)',
    run: (s, a) => {
      const mol = molOf(modelOf(s, moleculeModel), a);
      const want = pick(a, 'want', ['lone_pairs', 'bonding_pairs', 'sigma_bonds', 'pi_bonds', 'valence_electrons'] as const);
      const one = a.atom === undefined ? null : atomOf(mol, a);
      const atoms = one === null ? mol.atoms.map((_, i) => i) : [one];
      const lone = () => atoms.reduce((t, i) => t + lonePairsOf(mol, i), 0);
      const hs = atoms.reduce((t, i) => t + hydrogensOn(mol.atoms[i]), 0);
      const bonds = one === null ? mol.bonds : bondsAt(mol, one);
      const sigma = bonds.length + hs;
      const pi = bonds.reduce((t, b) => t + b.order - 1, 0);
      return num(want === 'lone_pairs' ? lone() : want === 'sigma_bonds' ? sigma : want === 'pi_bonds' ? pi : want === 'bonding_pairs' ? sigma + pi : 2 * lone() + 2 * (sigma + pi));
    },
  },
  mol_formal_charge: {
    kinds: ['molecular_structure'], args: '{ atom: id, molecule?: index (0) }', returns: 'the formal charge on that atom: valence electrons − 2 × lone pairs − bonds (needs the atom\'s lonePairs in the spec)',
    run: (s, a) => {
      const mol = molOf(modelOf(s, moleculeModel), a);
      const at = mol.atoms[atomOf(mol, a)];
      if (at.lonePairs === undefined && at.el !== 'H') return fail(`atom "${at.id}" has no lonePairs in the spec — its formal charge cannot be worked out from the figure`);
      if (VALENCE[at.el] === undefined) return fail(`no valence-electron count is known for ${at.el}`);
      return num(at.charge);
    },
  },
  mol_vsepr: {
    kinds: ['molecular_structure'], args: '{ want: steric_number | electron_geometry | molecular_geometry | hybridisation, atom?: id (the molecule\'s `center`), molecule?: index (0) }',
    returns: 'the steric number, or the label of the geometry ("linear", "bent", "trigonal planar", "trigonal pyramidal", "tetrahedral", "seesaw", "T-shaped", "trigonal bipyramidal", "square planar", "square pyramidal", "octahedral") or of the hybridisation ("sp", "sp2", "sp3", "sp3d", "sp3d2")',
    run: (s, a) => {
      const mol = molOf(modelOf(s, moleculeModel), a);
      const id = a.atom === undefined ? mol.center ?? fail('name the central atom: derivation argument "atom" (the structure declares no `center`)') : mol.atoms[atomOf(mol, a)].id;
      const v = vsepr(mol, id) ?? fail(`atom "${id}": the steric number needs its lonePairs in the spec and two to six electron domains`);
      const want = pick(a, 'want', ['steric_number', 'electron_geometry', 'molecular_geometry', 'hybridisation'] as const);
      return want === 'steric_number' ? num(v.steric) : label(want === 'electron_geometry' ? v.electron : want === 'molecular_geometry' ? v.molecular : v.hybridisation);
    },
  },
  mol_functional_group: {
    kinds: ['molecular_structure'], args: '{ group: index of the outlined group (0), molecule?: index (0) }',
    returns: 'the label of the outlined functional group: hydroxyl, aldehyde, ketone, carboxyl, carboxylate, ester, amide, amino, sulfhydryl, phosphate, ether or methyl',
    run: (s, a) => {
      const mol = molOf(modelOf(s, moleculeModel), a);
      if (mol.highlight.length === 0) return fail('the structure has no outlined group (highlight)');
      return label(functionalGroup(mol, mol.highlight[argIndex(a, 'group', mol.highlight.length, 'outlined group')].atoms));
    },
  },
  mol_hbond: {
    kinds: ['molecular_structure'], args: '{ want: donors | acceptors, molecule?: index (0) }',
    returns: 'donors: the number of hydrogens bonded to N, O or F; acceptors: the number of N, O and F atoms that carry at least one lone pair (an atom whose lone pairs the spec does not give counts when it is uncharged)',
    run: (s, a) => {
      const mol = molOf(modelOf(s, moleculeModel), a);
      const nof = (i: number) => ['N', 'O', 'F'].includes(mol.atoms[i].el);
      if (pick(a, 'want', ['donors', 'acceptors'] as const) === 'acceptors') return num(mol.atoms.filter((x, i) => nof(i) && (x.lonePairs === undefined ? x.charge <= 0 : x.lonePairs > 0)).length);
      return num(mol.atoms.reduce((t, x, i) => t + (nof(i) ? hydrogensOn(x) + bondsAt(mol, i).filter((b) => mol.atoms[b.a === i ? b.b : b.a].el === 'H').length : 0), 0));
    },
  },
  mol_formula: {
    kinds: ['molecular_structure'], args: '{ molecule?: index (0) }', returns: 'the molecular formula in plain digits, carbon first, then hydrogen, then the rest alphabetically ("C3H7NO2") — implied hydrogens of a skeletal structure counted',
    run: (s, a) => text(moleculeFormula(molOf(modelOf(s, moleculeModel), a))),
  },
  mol_polarity: {
    kinds: ['molecular_structure'], args: '{ atom?: id (the molecule\'s `center`), molecule?: index (0) }',
    returns: 'the label "polar" or "nonpolar": nonpolar only when the geometry round the central atom is a symmetric one (linear, trigonal planar, tetrahedral, trigonal bipyramidal, octahedral, square planar) with the same element at every corner; a two-atom molecule is polar when its atoms differ',
    run: (s, a) => {
      const mol = molOf(modelOf(s, moleculeModel), a);
      if (mol.atoms.length === 2 && mol.bonds.length === 1) return label(mol.atoms[0].el === mol.atoms[1].el ? 'nonpolar' : 'polar');
      const id = a.atom === undefined ? mol.center ?? fail('name the central atom: derivation argument "atom" (the structure declares no `center`)') : mol.atoms[atomOf(mol, a)].id;
      const i = atomIndex(mol, id);
      const v = vsepr(mol, id) ?? fail(`atom "${id}": polarity needs its lonePairs in the spec and two to six electron domains`);
      const nb = bondsAt(mol, i).map((b) => mol.atoms[b.a === i ? b.b : b.a]);
      if (nb.length + hydrogensOn(mol.atoms[i]) !== mol.atoms.length - 1 + hydrogensOn(mol.atoms[i]) || nb.some((x) => bondsAt(mol, mol.atoms.indexOf(x)).length > 1 || hydrogensOn(x) > 0)) return fail('polarity is only derived for one central atom with single atoms round it');
      const corners = [...nb.map((x) => x.el), ...Array(hydrogensOn(mol.atoms[i])).fill('H')];
      const symmetric = ['linear', 'trigonal planar', 'tetrahedral', 'trigonal bipyramidal', 'octahedral', 'square planar'].includes(v.molecular) && !(v.molecular === 'linear' && v.lonePairs !== 0 && v.lonePairs !== 3);
      return label(symmetric && corners.every((e) => e === corners[0]) ? 'nonpolar' : 'polar');
    },
  },
  mol_best_structure: {
    kinds: ['molecular_structure'], args: '{}',
    returns: 'the caption of the candidate structure that formal charges favour: the smallest sum of |formal charge|, then any negative charge on the most electronegative atom (refused when the candidates tie, or carry no captions)',
    run: (s) => {
      const m = modelOf(s, moleculeModel);
      if (m.molecules.length < 2) return fail('there is only one structure — nothing to compare');
      if (m.molecules.some((x) => !x.label || x.label === '?')) return fail('every candidate needs a caption (label) to be named by');
      m.molecules.forEach((mol) => mol.atoms.forEach((_, i) => lonePairsOf(mol, i)));
      const scored = m.molecules.map((mol) => ({ mol, ...chargeScore(mol) })).sort((x, y) => x.total - y.total || x.misplaced - y.misplaced);
      if (scored[0].total === scored[1].total && Math.abs(scored[0].misplaced - scored[1].misplaced) < 1e-9) return fail('formal charges do not separate the candidates (equivalent resonance structures)');
      return label(scored[0].mol.label as string);
    },
  },
  mol_bond_order: {
    kinds: ['molecular_structure'], args: '{ a: id, b: id, molecule?: index | "average" (0) }',
    returns: 'the order of the bond between two atoms in one structure — or, with molecule: "average", its average over all the structures drawn (resonance), e.g. 1.33',
    run: (s, a) => {
      const m = modelOf(s, moleculeModel);
      const orderIn = (mol: Molecule): number => {
        const [i, j] = [atomOf(mol, a, 'a'), atomOf(mol, a, 'b')];
        const b = mol.bonds.find((x) => (x.a === i && x.b === j) || (x.a === j && x.b === i));
        return b ? b.order : fail(`"${mol.atoms[i].id}" and "${mol.atoms[j].id}" are not bonded${m.molecules.length > 1 ? ' in every structure' : ''}`);
      };
      if (a.molecule === 'average') return measured(m.molecules.reduce((t, mol) => t + orderIn(mol), 0) / m.molecules.length);
      return num(orderIn(molOf(m, a)));
    },
  },
  // gel_electrophoresis — gel
  gel_band_size: {
    kinds: ['gel_electrophoresis'], args: '{ lane: label | index, band?: index from the wells (0), claimed?: number, tolerancePct?: number (10, at most 25) }',
    returns: 'the size of a band, in the ladder\'s unit. Read by interpolation a size is only approximate: give the key as `claimed` and it is accepted (returned) when it is within tolerancePct of the true size AND on the same side of every ladder marker as the band; otherwise the true size is returned',
    run: (s, a) => {
      const m = gelOf(s);
      const lane = laneOf(m, a.lane, 'lane');
      if (lane.bands.length === 0) return fail(`${laneName(m, lane)} has no band`);
      const b = lane.bands[argIndex(a, 'band', lane.bands.length, 'band (0 = nearest the wells)')];
      if (a.claimed === undefined) return num(b.size);
      const claimed = argNum(a, 'claimed');
      const tol = a.tolerancePct === undefined ? 10 : argNum(a, 'tolerancePct');
      if (!(tol > 0 && tol <= 25)) return fail('tolerancePct must be greater than 0 and at most 25');
      const side = (v: number): string => m.ladder.sizes.map((x) => (sameSize(x, v) ? '=' : v > x ? '>' : '<')).join('');
      return num(claimed > 0 && Math.abs(claimed - b.size) / b.size <= tol / 100 + 1e-12 && side(claimed) === side(b.size) ? claimed : b.size);
    },
  },
  gel_shared_bands: {
    kinds: ['gel_electrophoresis'], args: '{ a: lane, b: lane }', returns: 'how many bands the two lanes have at the same level',
    run: (s, a) => { const m = gelOf(s); const [x, y] = [laneOf(m, a.a, 'a'), laneOf(m, a.b, 'b')]; return num(x.bands.filter((p) => y.bands.some((q) => sameSize(p.size, q.size))).length); },
  },
  gel_lanes_with_band: {
    kinds: ['gel_electrophoresis'], args: '{ size: number, want?: lanes | count (lanes) }',
    returns: 'the sample lanes that have a band of that size: their labels as a comma list in lane order ("1, 3"; "none" when there is none) — or, want: count, how many',
    run: (s, a) => {
      const m = gelOf(s);
      const size = argNum(a, 'size');
      const hit = m.lanes.filter((l) => l.bands.some((b) => sameSize(b.size, size)));
      if (pick(a, 'want', ['lanes', 'count'] as const, 'lanes') === 'count') return num(hit.length);
      if (hit.some((l) => !l.label || l.label === '?')) return fail('a lane with that band has no printed label to be named by');
      return text(hit.length ? hit.map((l) => l.label).join(', ') : 'none');
    },
  },
  gel_presence: {
    kinds: ['gel_electrophoresis'], args: '{ lane: label | index, size: number }', returns: 'the label "yes" or "no": does that lane show a band of that size? (a PCR target present or absent)',
    run: (s, a) => { const m = gelOf(s); const size = argNum(a, 'size'); return label(laneOf(m, a.lane, 'lane').bands.some((b) => sameSize(b.size, size)) ? 'yes' : 'no'); },
  },
  gel_zygosity: {
    kinds: ['gel_electrophoresis'], args: '{ lane: label | index }', returns: 'the label "heterozygous" (two bands: two alleles of different length) or "homozygous" (one band) — refused for any other number of bands',
    run: (s, a) => { const m = gelOf(s); const lane = laneOf(m, a.lane, 'lane'); return lane.bands.length === 1 ? label('homozygous') : lane.bands.length === 2 ? label('heterozygous') : fail(`${laneName(m, lane)} has ${lane.bands.length} bands — one locus gives one band or two`); },
  },
  gel_match: {
    kinds: ['gel_electrophoresis'], args: '{ mode: identity | paternity, candidates: lane[], sample?: lane (identity), child?: lane, mother?: lane (paternity) }',
    returns: 'the label of the ONE candidate lane that matches: identity — the same bands as `sample`; paternity — it has every band of `child` that `mother` lacks (refused when none or several match)',
    run: (s, a) => {
      const m = gelOf(s);
      if (!Array.isArray(a.candidates) || a.candidates.length < 2) return fail('derivation argument "candidates" must list at least two lanes');
      const cands = (a.candidates as unknown[]).map((v, i) => laneOf(m, v, `candidates[${i}]`));
      const hasBand = (l: GelLane, size: number) => l.bands.some((b) => sameSize(b.size, size));
      let hits: GelLane[];
      if (pick(a, 'mode', ['identity', 'paternity'] as const) === 'identity') {
        const sample = laneOf(m, a.sample, 'sample');
        hits = cands.filter((c) => c.bands.length === sample.bands.length && sample.bands.every((b) => hasBand(c, b.size)));
      } else {
        const child = laneOf(m, a.child, 'child');
        const mother = laneOf(m, a.mother, 'mother');
        const paternal = child.bands.filter((b) => !hasBand(mother, b.size));
        if (paternal.length === 0) return fail('every band of the child is also in the mother\'s lane — the gel excludes nobody');
        hits = cands.filter((c) => paternal.every((b) => hasBand(c, b.size)));
      }
      if (hits.length !== 1) return fail(`${hits.length === 0 ? 'no candidate matches' : `${hits.length} candidates match (${hits.map((l) => laneName(m, l)).join(', ')})`} — the figure does not single one out`);
      return hits[0].label && hits[0].label !== '?' ? label(hits[0].label) : fail('the matching lane has no printed label');
    },
  },
  gel_fragment_count: {
    kinds: ['gel_electrophoresis'], args: '{ lane: label | index, want?: fragments | cut_sites (fragments), dna?: linear | circular (linear) }',
    returns: 'the number of bands (fragments) in the lane — or the number of cut sites that gives them: one fewer for linear DNA, the same number for a circular plasmid',
    run: (s, a) => {
      const m = gelOf(s);
      const n = laneOf(m, a.lane, 'lane').bands.length;
      if (pick(a, 'want', ['fragments', 'cut_sites'] as const, 'fragments') === 'fragments') return num(n);
      if (n === 0) return fail('the lane has no band');
      return num(pick(a, 'dna', ['linear', 'circular'] as const, 'linear') === 'linear' ? n - 1 : n);
    },
  },
  // gel_electrophoresis — amplification plot
  amp_ct: {
    kinds: ['gel_electrophoresis'], args: '{ sample: name | index }', returns: 'the cycle at which that curve crosses the threshold (refused for a curve that never does, and for a Ct between two gridlines)',
    run: (s, a) => {
      const m = ampOf(s);
      const smp = sampleOf(m, a, 'sample');
      if (!m.showThreshold) return fail('the threshold line is not drawn — a Ct cannot be read');
      if (smp.ct === null) return fail(`the curve "${smp.label}" never crosses the threshold`);
      return Math.abs(smp.ct - Math.round(smp.ct)) < 1e-9 ? num(smp.ct) : fail(`the curve "${smp.label}" crosses the threshold between two gridlines (Ct ${fmt(smp.ct)}) — it cannot be read to a whole cycle`);
    },
  },
  amp_fold_difference: {
    kinds: ['gel_electrophoresis'], args: '{ more: name | index, less: name | index }', returns: 'how many times more target the sample `more` started with than `less`: 2 to the power of the difference of their Ct values (each cycle is a doubling)',
    run: (s, a) => {
      const m = ampOf(s);
      const [x, y] = [sampleOf(m, a, 'more'), sampleOf(m, a, 'less')];
      if (x.ct === null || y.ct === null) return fail('one of the two curves never crosses the threshold — there is no Ct to compare');
      if (y.ct - x.ct > 20) return fail('a difference of more than 20 cycles is over a million-fold — not a sound comparison');
      return measured(2 ** (y.ct - x.ct));
    },
  },
  amp_extreme: {
    kinds: ['gel_electrophoresis'], args: '{ want: most | least }', returns: 'the name of the curve whose sample started with the most target (the lowest Ct) or the least (the highest Ct among those that amplify) — refused on a tie',
    run: (s, a) => {
      const m = ampOf(s);
      const live = m.samples.filter((x) => x.ct !== null).sort((x, y) => (x.ct as number) - (y.ct as number));
      if (live.length < 2) return fail('fewer than two curves cross the threshold');
      const [first, second] = pick(a, 'want', ['most', 'least'] as const) === 'most' ? live : [...live].reverse();
      if (first.ct === second.ct) return fail('two curves cross the threshold at the same cycle');
      return first.label === '?' ? fail('that curve\'s name is a blank on the figure') : label(first.label);
    },
  },
  // bio_schematic
  bio_identify: {
    kinds: ['bio_schematic'], args: '{ label: the letter, number or "?" printed on the figure }',
    returns: 'what that label marks — cell: nucleus, rough ER, smooth ER, Golgi apparatus, mitochondrion, lysosome, ribosomes, centrioles, cell membrane, chloroplast, central vacuole or cell wall; membrane: phospholipid head, fatty acid tails, carbohydrate, cholesterol, channel protein, carrier protein, pump or peripheral protein; division: the stage ("metaphase", "anaphase I"); compartments: matrix, intermembrane space, stroma or thylakoid lumen',
    run: (s, a) => {
      const parts = bioParts(modelOf(s, bioModel));
      const want = argStr(a, 'label');
      const hit = parts.filter((x) => x.label === want);
      if (hit.length !== 1) return fail(`${hit.length === 0 ? 'no part' : 'more than one part'} of the figure is labelled "${want}" (labels: ${parts.map((x) => x.label).filter(Boolean).join(', ') || 'none'})`);
      return label(hit[0].key);
    },
  },
  bio_label_of: {
    kinds: ['bio_schematic'], args: '{ part: organelle type | membrane target | space id | stage }', returns: 'the label printed on the figure for that part ("Q", "3") — refused when it is unlabelled, blank, or drawn more than once',
    run: (s, a) => {
      const parts = bioParts(modelOf(s, bioModel));
      const want = argStr(a, 'part');
      const hit = parts.filter((x) => x.id === want || x.key.toLowerCase() === want.toLowerCase());
      if (hit.length !== 1) return fail(`the figure shows ${hit.length === 0 ? 'no' : 'more than one'} "${want}"`);
      return hit[0].label && hit[0].label !== '?' ? label(hit[0].label) : fail(`"${want}" carries no printed label`);
    },
  },
  membrane_net_movement: {
    kinds: ['bio_schematic'], args: '{ solute?: index | name (0) }', returns: 'the label "into the cell", "out of the cell" or "no net movement": the direction of net DIFFUSION, from the side with more marks to the side with fewer',
    run: (s, a) => { const sol = soluteOf(bioOf(s, 'membrane'), a); return label(sol.outside > sol.inside ? 'into the cell' : sol.outside < sol.inside ? 'out of the cell' : 'no net movement'); },
  },
  membrane_transport: {
    kinds: ['bio_schematic'], args: '{ solute?: index | name (0), as?: type | active_or_passive (type) }',
    returns: 'how the arrowed solute crosses — the label "simple diffusion", "facilitated diffusion" or "active transport" (or "active" / "passive"): down its gradient through the lipids, down it through a channel or carrier, or against it through the pump marked ATP. Refused when the arrow is missing or the figure is not sound (against the gradient with no ATP)',
    run: (s, a) => {
      const m = bioOf(s, 'membrane');
      const sol = soluteOf(m, a);
      if (!sol.arrow || sol.through === undefined) return fail('that solute has no arrow on the figure — how it crosses is not shown');
      if (sol.outside === sol.inside) return fail('that solute has the same number of marks on both sides — there is no gradient');
      const down = (sol.arrow === 'in') === (sol.outside > sol.inside);
      const via = sol.through === 'bilayer' ? null : m.proteins[sol.through];
      const short = pick(a, 'as', ['type', 'active_or_passive'] as const, 'type') === 'active_or_passive';
      if (!down) return via && via.type === 'pump' && via.atp ? label(short ? 'active' : 'active transport') : fail('the arrow runs against the gradient through something that shows no ATP — not a sound figure for a transport question');
      if (via && via.type === 'pump' && via.atp) return fail('the arrow runs DOWN the gradient through a pump marked ATP — the figure does not settle active against passive');
      return label(short ? 'passive' : via ? 'facilitated diffusion' : 'simple diffusion');
    },
  },
  division_count: {
    kinds: ['bio_schematic'], args: '{ cell: label | index, want: chromosomes | chromatids | dna_molecules }',
    returns: 'what the drawn cell holds, one chromosome per centromere: chromosomes; chromatids (refused once sister chromatids have separated — each is then a chromosome); DNA molecules (every stick)',
    run: (s, a) => {
      const m = bioOf(s, 'division');
      const c = divisionCounts(cellOf(m, a).stage, m.n);
      const want = pick(a, 'want', ['chromosomes', 'chromatids', 'dna_molecules'] as const);
      if (want === 'chromatids') return c.chromatids === null ? fail('the sister chromatids of that cell have separated: each is counted as a chromosome — ask for chromosomes or DNA molecules') : num(c.chromatids);
      return num(want === 'chromosomes' ? c.chromosomes : c.dna);
    },
  },
  division_stage: {
    kinds: ['bio_schematic'], args: '{ cell: label | index }', returns: 'the label of the stage that cell is in: "prophase", "metaphase", "anaphase", "telophase" — or, for meiosis, "prophase I", "metaphase I", "anaphase I", "telophase I", "metaphase II", "anaphase II", "telophase II"',
    run: (s, a) => { const c = cellOf(bioOf(s, 'division'), a); return c.label !== null && c.label.toLowerCase() === stageName(c.stage).toLowerCase() ? fail('the stage of that cell is printed under it') : label(stageName(c.stage)); },
  },
  compartment_gradient: {
    kinds: ['bio_schematic'], args: '{ want: higher | lower | flow_to | flow_from, as?: label | name (label) }',
    returns: 'the space with the higher (or lower) H⁺ concentration — more dots, or the lower pH — or the space H⁺ flows to / from through ATP synthase (down the gradient). Named by the label printed in it; with as: name (or when that label is hidden or blank) by its name: matrix, intermembrane space, stroma, thylakoid lumen',
    run: (s, a) => {
      const m = bioOf(s, 'compartments');
      if (!m.gradient) return fail('the figure shows no H⁺ gradient (both spaces need dots, or both a pH, and they must differ)');
      const want = pick(a, 'want', ['higher', 'lower', 'flow_to', 'flow_from'] as const);
      if ((want === 'flow_to' || want === 'flow_from') && !m.synthase) return fail('ATP synthase is not drawn');
      const id = want === 'higher' || want === 'flow_from' ? m.gradient.high : m.gradient.low;
      const sp = m.spaces.find((x) => x.id === id) as (typeof m.spaces)[number];
      const byName = pick(a, 'as', ['label', 'name'] as const, 'label') === 'name' || !sp.label || sp.label === '?';
      return label(byName ? SPACE_NAMES[id] : sp.label as string);
    },
  },
  // schematic_map
  map_distance: {
    kinds: ['schematic_map'], args: '{ from: marker or region, to: marker or region }', returns: 'the straight-line distance between two places, in the scale bar\'s unit (a region is measured from its middle): squares apart × the length of one square',
    run: (s, a) => { const m = modelOf(s, mapModel); const [p, q] = [placeOf(m, a, 'from'), placeOf(m, a, 'to')]; return measured(Math.hypot(q[0] - p[0], q[1] - p[1]) * m.unitsPerSquare); },
  },
  map_direction: {
    kinds: ['schematic_map'], args: '{ from: marker or region, to: marker or region }', returns: 'the compass direction from one place to the other, as ONE word: north, northeast, east, southeast, south, southwest, west, northwest (refused when it is over 12° off all eight)',
    run: (s, a) => { const m = modelOf(s, mapModel); const [p, q] = [placeOf(m, a, 'from'), placeOf(m, a, 'to')]; return label(MAP_COMPASS[eighth(q[0] - p[0], q[1] - p[1], `the direction from "${String(a.from)}" to "${String(a.to)}"`)]); },
  },
  map_extreme_region: {
    kinds: ['schematic_map'], args: '{ want: highest | lowest }', returns: 'the label of the region with the highest (or lowest) legend value — refused on a tie',
    run: (s, a) => {
      const m = modelOf(s, mapModel);
      const valued = m.regions.filter((x) => x.value !== undefined).sort((x, y) => (x.value as number) - (y.value as number));
      if (valued.length < 2) return fail('fewer than two regions carry a value');
      const [first, second] = pick(a, 'want', ['highest', 'lowest'] as const) === 'lowest' ? valued : [...valued].reverse();
      if (first.value === second.value) return fail(`two regions share the ${String(a.want)} value`);
      return first.label && first.label !== '?' ? label(first.label) : fail('that region has no printed label (or a blank one)');
    },
  },
  map_region_count: {
    kinds: ['schematic_map'], args: '{ op: above | below | at_least | at_most | equal, value: number }', returns: 'how many regions have a legend value that meets the condition',
    run: (s, a) => {
      const m = modelOf(s, mapModel);
      const v = argNum(a, 'value');
      const op = pick(a, 'op', ['above', 'below', 'at_least', 'at_most', 'equal'] as const);
      const valued = m.regions.filter((x) => x.value !== undefined).map((x) => x.value as number);
      if (valued.length === 0) return fail('no region carries a value');
      return num(valued.filter((x) => (op === 'above' ? x > v : op === 'below' ? x < v : op === 'at_least' ? x >= v : op === 'at_most' ? x <= v : x === v)).length);
    },
  },
  map_marker_region: {
    kinds: ['schematic_map'], args: '{ marker: label, as?: label | name (label) }', returns: 'the region a marker lies in, by its printed label (or, as: name / when the label is hidden or blank, by its `name`) — refused when it is in none',
    run: (s, a) => {
      const m = modelOf(s, mapModel);
      const want = argStr(a, 'marker');
      const mk = m.markers.find((x) => x.label === want) ?? fail(`the map has no marker "${want}"`);
      const reg = m.regions.find((x) => inPolygon(x.points, mk.x, mk.y)) ?? fail(`the marker "${want}" lies in no region`);
      return label(pick(a, 'as', ['label', 'name'] as const, 'label') === 'name' || !reg.label || reg.label === '?' ? reg.name : reg.label);
    },
  },
  // field_diagram — bar magnet
  magnet_field_direction: {
    kinds: ['field_diagram'], args: '{ point: label }', returns: 'the direction of the magnetic field at a marked point: "up", "left", "up and to the right" … (refused when it is over 12° off all eight)',
    run: (s, a) => {
      const m = magnetOf(s);
      const name = argStr(a, 'point');
      const q = m.points.find((x) => x.label === name) ?? fail(`the figure marks no point "${name}"`);
      const [bx, by] = magnetFieldAt(m, q.x, q.y);
      return label(COMPASS[eighth(bx, by, `the field at "${name}"`)]);
    },
  },
  magnet_compass_direction: {
    kinds: ['field_diagram'], args: '{ compass: label }', returns: 'the direction the north-seeking end of that compass needle points (the direction of the field there): "up", "left", "down and to the right" … (refused when it is over 12° off all eight)',
    run: (s, a) => {
      const m = magnetOf(s);
      const name = argStr(a, 'compass');
      const c = m.compasses.find((x) => x.label === name) ?? fail(`the figure has no compass "${name}"`);
      const [bx, by] = magnetFieldAt(m, c.x, c.y);
      return label(COMPASS[eighth(bx, by, `the needle of compass "${name}"`)]);
    },
  },
  magnet_north_end: {
    kinds: ['field_diagram'], args: '{ magnet?: index (0) }', returns: 'the label "left" or "right": the end of that magnet that is its north pole (field lines leave it)',
    run: (s, a) => {
      const m = magnetOf(s);
      const mg = m.magnets[argIndex(a, 'magnet', m.magnets.length, 'magnet')];
      if (mg.poles !== 'value' && !(m.lines && m.arrows) && !m.compasses.some((c) => c.needle)) return fail('nothing on the figure fixes which end is north (no pole letters, no arrowheads, no needle)');
      return label(mg.north);
    },
  },
  magnet_interaction: {
    kinds: ['field_diagram'], args: '{}', returns: 'the label "attract" or "repel": what the two magnets do (unlike poles facing attract, like poles repel)',
    run: (s) => { const m = magnetOf(s); return m.interaction ? label(m.interaction) : fail('there is only one magnet'); },
  },
};

// ── the option-letter guard ─────────────────────────────────────────────────

/**
 * Do the option LETTERS of a multiple-choice question coincide with labels
 * printed on its figure? "Which node is the ancestor … A. node B  B. node D"
 * is unanswerable aloud and easy to mis-key. Returns the letters that are both
 * an option letter (A, B, C, D — as many as there are choices) and a
 * single-letter label printed on the drawn figure, with advice; null when
 * there is no clash (or no choices: a numeric or typed answer has no letters).
 *
 * It reads the rendered SVG, so it sees exactly what a student sees — a
 * label the spec hides or turns into a numeral is not a clash. A circuit's
 * meter letters ("A", "V") and a structure's element symbols ("C", "B") are
 * symbols, not names, and are left out.
 */
export function figureLetterClash(spec: PracticeFigureSpec, choices: ReadonlyArray<string>): { letters: string[]; message: string } | null {
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const options = 'ABCDEF'.slice(0, choices.length).split('');
  const svg = renderPracticeFigure(spec).svg;
  const printed = new Set([...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim()).filter((t) => /^[A-Z]$/.test(t)));
  if (spec.type === 'circuit_diagram') { printed.delete('A'); printed.delete('V'); }
  if (spec.type === 'molecular_structure') {
    // Element symbols ("C", "B") are not names: only captions and group letters count.
    const m = modelOf(spec, moleculeModel);
    const names = new Set(m.molecules.flatMap((mol) => [mol.label, ...mol.highlight.map((h) => h.label)]).filter((x): x is string => !!x));
    for (const l of [...printed]) if (!names.has(l)) printed.delete(l);
  }
  const letters = options.filter((l) => printed.has(l));
  if (letters.length === 0) return null;
  const numerals = ['phylogenetic_tree', 'spectrum', 'unit_circle'].includes(spec.type) ? ` — set letterLabels: 'numerals' (or 'roman') on the figure` : ' — relabel them with numbers, Roman numerals or letters from later in the alphabet (P, Q, R, S)';
  return { letters, message: `the figure prints the label${letters.length > 1 ? 's' : ''} ${letters.map((l) => `"${l}"`).join(', ')}, which ${letters.length > 1 ? 'are' : 'is'} also ${letters.length > 1 ? 'option letters' : 'an option letter'} of the question${numerals}` };
}

