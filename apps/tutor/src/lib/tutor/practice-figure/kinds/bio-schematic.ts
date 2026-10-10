/**
 * bio_schematic — deliberate SCHEMATICS of cell biology: boxes, ovals,
 * sticks and leader lines. Not anatomical drawings, and not offered for
 * anything that needs one (a nephron, a neuron, a synapse are out of scope).
 *
 * variant 'cell' — a cell with its organelles as simple, distinct shapes:
 *   { cellType: 'animal' | 'plant';
 *     organelles: Array<{ type: OrganelleType;      // each at most once; drawn at a fixed place
 *                         label?: string | '?' | null }>;   // a letter, a number or a name at the end of a
 *                                                   //   leader line; "?" = a blank box; none = drawn, unlabelled
 *     title?: string }
 *   OrganelleType: nucleus, rough_er, smooth_er, golgi, mitochondrion, lysosome, ribosomes,
 *   centrioles, cell_membrane (animal and plant, except smooth_er, lysosome and centrioles in a
 *   plant cell); chloroplast, central_vacuole, cell_wall (plant only). The nucleus and the
 *   outline are always drawn. Shapes: nucleus = a large circle with a dark spot; rough ER =
 *   curved bands beside the nucleus carrying dots; smooth ER = a winding tube without dots;
 *   Golgi = a stack of bowed lines with small circles beside it; mitochondrion = a capsule with a
 *   zig-zag inside; chloroplast = a capsule with stacks of short bars; lysosome = a small grey
 *   disc; ribosomes = a cluster of free dots; centrioles = two small barrels at right angles;
 *   central vacuole = a large empty box. No legend names the shapes: that is the question.
 *
 * variant 'membrane' — a cross-section of a membrane (the fluid mosaic model):
 *   { proteins?: Array<{ type: 'channel' | 'carrier' | 'pump' | 'peripheral';   // ≤ 4, left to right
 *                        carbohydrate?: boolean (false);    // a branched chain on its outer end (not on a peripheral one)
 *                        atp?: boolean (true, pump only) }>;   // the "ATP" marker beside a pump
 *     cholesterol?: boolean (false);                // short dark bars among the tails
 *     solutes?: Array<{ outside: 0–14; inside: 0–14;         // ≤ 2; that many dots on each side — the concentrations
 *                       through?: index | 'bilayer';         // the protein it crosses by (or straight through the lipids)
 *                       arrow?: 'in' | 'out' | null;         // (null) an arrow along that path; needs `through`
 *                       name?: string;                       // named in a key under the figure
 *                       shape?: 'dot' | 'square' | 'triangle' | 'diamond' }>;   // (dot, then square)
 *     labels?: Array<{ target: 'head' | 'tails' | 'carbohydrate' | 'cholesterol' | 'channel' | 'carrier' | 'pump' | 'peripheral';
 *                      label: string | '?' }>;      // a lettered or named leader line to that part
 *     sideLabels?: [string, string] | null;         // (['Outside the cell', 'Inside the cell'])
 *     title?: string }
 *
 * variant 'division' — one to four cells of a mitosis or a meiosis, chromosomes as sticks:
 *   { n: 1 | 2 | 3;                                  // the haploid number: the cell is 2n = 2, 4 or 6
 *     cells: Array<{ stage: 'prophase' | 'metaphase' | 'anaphase' | 'telophase'        // mitosis, OR
 *                         | 'prophase_I' | 'metaphase_I' | 'anaphase_I' | 'telophase_I'
 *                         | 'metaphase_II' | 'anaphase_II' | 'telophase_II';           // meiosis (never mixed)
 *                    label?: string | '?' | null }>;   // under the cell: a letter, or the stage's name, or a blank
 *     title?: string }
 *   A replicated chromosome is an X of two sticks; a single chromatid is one bent stick.
 *   Homologous chromosomes have the same length; one of each pair is solid, the other hollow.
 *
 * variant 'compartments' — a mitochondrion or a chloroplast as nested boxes:
 *   { organelle: 'mitochondrion' | 'chloroplast';
 *     spaces: Array<{ id: 'matrix' | 'intermembrane_space'      // mitochondrion
 *                        | 'stroma' | 'thylakoid_lumen';        // chloroplast
 *                     label?: string | '?' | null;   // (the space's name) printed in the space
 *                     ions?: 0–24;                   // that many dots = H⁺ ions (a key says so)
 *                     pH?: number }>;                // printed "pH 5" in the space instead of dots
 *     synthase?: boolean (false);                    // ATP synthase in the inner / thylakoid membrane
 *     showFlow?: boolean (false);                    // an arrow through it, down the H⁺ gradient (needs synthase and a gradient)
 *     title?: string }
 */
import { FIGURE_WIDTH, SERIES_COLORS, TICK_FS, estWidth, n2, shapeMark, type SeriesShape } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, arcPath, arrow, text, titleBlock, type Box } from './draw';
import { deg, ellipseD, facts, lab, labBox, numStr, polyPath, stroke, type Notes, type Pt } from './draw2';

export const ORGANELLES = ['nucleus', 'rough_er', 'smooth_er', 'golgi', 'mitochondrion', 'lysosome', 'ribosomes', 'centrioles', 'cell_membrane', 'chloroplast', 'central_vacuole', 'cell_wall'] as const;
export type OrganelleType = (typeof ORGANELLES)[number];
const PLANT_ONLY: OrganelleType[] = ['chloroplast', 'central_vacuole', 'cell_wall'];
const ANIMAL_ONLY: OrganelleType[] = ['smooth_er', 'lysosome', 'centrioles'];
export const ORGANELLE_NAMES: Record<OrganelleType, string> = {
  nucleus: 'nucleus', rough_er: 'rough endoplasmic reticulum', smooth_er: 'smooth endoplasmic reticulum', golgi: 'Golgi apparatus', mitochondrion: 'mitochondrion', lysosome: 'lysosome',
  ribosomes: 'ribosomes', centrioles: 'centrioles', cell_membrane: 'cell membrane', chloroplast: 'chloroplast', central_vacuole: 'central vacuole', cell_wall: 'cell wall',
};
export const MEMBRANE_TARGETS = ['head', 'tails', 'carbohydrate', 'cholesterol', 'channel', 'carrier', 'pump', 'peripheral'] as const;
export type MembraneTarget = (typeof MEMBRANE_TARGETS)[number];
export const MEMBRANE_PART_NAMES: Record<MembraneTarget, string> = {
  head: 'phospholipid head (hydrophilic)', tails: 'fatty acid tails (hydrophobic)', carbohydrate: 'carbohydrate chain', cholesterol: 'cholesterol',
  channel: 'channel protein', carrier: 'carrier protein', pump: 'pump (a protein that uses ATP)', peripheral: 'peripheral protein',
};
const MITOSIS = ['prophase', 'metaphase', 'anaphase', 'telophase'] as const;
const MEIOSIS = ['prophase_I', 'metaphase_I', 'anaphase_I', 'telophase_I', 'metaphase_II', 'anaphase_II', 'telophase_II'] as const;
export type DivisionStage = (typeof MITOSIS)[number] | (typeof MEIOSIS)[number];
export const stageName = (s: DivisionStage): string => s.replace('_', ' ');
const SPACES = { mitochondrion: ['intermembrane_space', 'matrix'], chloroplast: ['stroma', 'thylakoid_lumen'] } as const;
export type SpaceId = 'intermembrane_space' | 'matrix' | 'stroma' | 'thylakoid_lumen';

export interface MembraneProtein { type: 'channel' | 'carrier' | 'pump' | 'peripheral'; carbohydrate: boolean; atp: boolean }
export interface MembraneSolute { outside: number; inside: number; through?: number | 'bilayer'; arrow: 'in' | 'out' | null; name?: string; shape: SeriesShape }
export interface CompartmentSpace { id: SpaceId; label: string | null; ions?: number; pH?: number }
export type BioModel =
  | { variant: 'cell'; cellType: 'animal' | 'plant'; organelles: Array<{ type: OrganelleType; label: string | null }>; title?: string }
  | { variant: 'membrane'; proteins: MembraneProtein[]; cholesterol: boolean; solutes: MembraneSolute[]; labels: Array<{ target: MembraneTarget; label: string }>; sideLabels: [string, string] | null; title?: string }
  | { variant: 'division'; n: number; process: 'mitosis' | 'meiosis'; cells: Array<{ stage: DivisionStage; label: string | null }>; title?: string }
  | { variant: 'compartments'; organelle: 'mitochondrion' | 'chloroplast'; spaces: CompartmentSpace[]; synthase: boolean; showFlow: boolean; /** Space with more H⁺, and with less; null when no gradient is shown. */ gradient: { high: SpaceId; low: SpaceId } | null; title?: string };

/**
 * What a drawn cell holds, by the usual counting rule (one chromosome per
 * centromere): `chromatids` is null once sister chromatids have separated
 * (each is then a chromosome); `dna` counts DNA molecules.
 */
export function divisionCounts(stage: DivisionStage, n: number): { chromosomes: number; chromatids: number | null; dna: number; cells: number } {
  switch (stage) {
    case 'prophase': case 'metaphase': case 'prophase_I': case 'metaphase_I': case 'anaphase_I': case 'telophase_I':
      return { chromosomes: 2 * n, chromatids: 4 * n, dna: 4 * n, cells: 1 };
    case 'anaphase': case 'telophase': return { chromosomes: 4 * n, chromatids: null, dna: 4 * n, cells: 1 };
    case 'metaphase_II': return { chromosomes: n, chromatids: 2 * n, dna: 2 * n, cells: 1 };
    default: return { chromosomes: 2 * n, chromatids: null, dna: 2 * n, cells: 1 };
  }
}

const VARIANTS = ['cell', 'membrane', 'division', 'compartments'] as const;

export function bioModel(r: Reader): BioModel {
  const p = r.p;
  if (!VARIANTS.includes(p.variant as (typeof VARIANTS)[number])) r.fail(`variant must be one of ${VARIANTS.join(', ')}`);
  const title = r.optStr(p.title, 'title', 160);
  const labelOf = (v: unknown, name: string, max = 30): string | null => (v === undefined || v === null ? null : r.str(v, name, max));
  const whole = (v: unknown, name: string, lo: number, hi: number): number => {
    const k = r.num(v, name);
    if (!Number.isInteger(k) || k < lo || k > hi) r.fail(`${name} must be a whole number from ${lo} to ${hi}`);
    return k;
  };
  if (p.variant === 'cell') {
    if (p.cellType !== 'animal' && p.cellType !== 'plant') r.fail('cellType must be one of animal, plant');
    const cellType = p.cellType as 'animal' | 'plant';
    const organelles = r.list(p.organelles, 'organelles', 1, 10).map((raw, i) => {
      const o = r.obj(raw, `organelles[${i}]`);
      if (!ORGANELLES.includes(o.type as OrganelleType)) r.fail(`organelles[${i}].type must be one of ${ORGANELLES.join(', ')}`);
      const type = o.type as OrganelleType;
      if (cellType === 'animal' && PLANT_ONLY.includes(type)) r.fail(`organelles[${i}].type: an animal cell has no ${ORGANELLE_NAMES[type]}`);
      if (cellType === 'plant' && ANIMAL_ONLY.includes(type)) r.fail(`organelles[${i}].type: this schematic of a plant cell has no place for ${type === 'smooth_er' ? 'the smooth ER' : type === 'lysosome' ? 'a lysosome' : 'centrioles'}`);
      return { type, label: labelOf(o.label, `organelles[${i}].label`, 22) };
    });
    organelles.forEach((o, i) => { if (organelles.findIndex((x) => x.type === o.type) !== i) r.fail(`organelles[${i}].type: ${o.type} is listed twice`); });
    return { variant: 'cell', cellType, organelles, title };
  }
  if (p.variant === 'membrane') {
    const proteins = (p.proteins === undefined || p.proteins === null ? [] : r.list(p.proteins, 'proteins', 0, 4)).map((raw, i): MembraneProtein => {
      const o = r.obj(raw, `proteins[${i}]`);
      if (!['channel', 'carrier', 'pump', 'peripheral'].includes(o.type as string)) r.fail(`proteins[${i}].type must be one of channel, carrier, pump, peripheral`);
      const carbohydrate = r.bool(o.carbohydrate, `proteins[${i}].carbohydrate`, false);
      if (carbohydrate && o.type === 'peripheral') r.fail(`proteins[${i}].carbohydrate: the chain is drawn on the outer end of a protein that spans the membrane`);
      return { type: o.type as MembraneProtein['type'], carbohydrate, atp: o.type === 'pump' && r.bool(o.atp, `proteins[${i}].atp`, true) };
    });
    if (proteins.filter((q) => q.type === 'peripheral').length > 1) r.fail('proteins: at most one peripheral protein');
    const solutes = (p.solutes === undefined || p.solutes === null ? [] : r.list(p.solutes, 'solutes', 0, 2)).map((raw, i): MembraneSolute => {
      const o = r.obj(raw, `solutes[${i}]`);
      let through: number | 'bilayer' | undefined;
      if (o.through !== undefined && o.through !== null) {
        if (o.through === 'bilayer') through = 'bilayer';
        else {
          if (typeof o.through !== 'number' || !Number.isInteger(o.through) || o.through < 0 || o.through >= proteins.length) r.fail(`solutes[${i}].through must be the index of a protein (0 to ${proteins.length - 1}) or 'bilayer'`);
          if (proteins[o.through as number].type === 'peripheral') r.fail(`solutes[${i}].through: a peripheral protein does not span the membrane`);
          through = o.through as number;
        }
      }
      const arrowDir = o.arrow === undefined || o.arrow === null ? null : o.arrow;
      if (arrowDir !== null && arrowDir !== 'in' && arrowDir !== 'out') r.fail(`solutes[${i}].arrow must be 'in', 'out' or null`);
      if (arrowDir !== null && through === undefined) r.fail(`solutes[${i}].arrow: say what it crosses by (through: a protein's index, or 'bilayer')`);
      const shape = o.shape === undefined || o.shape === null ? (i === 0 ? 'dot' : 'square') : o.shape;
      if (!['dot', 'square', 'triangle', 'diamond'].includes(shape as string)) r.fail(`solutes[${i}].shape must be one of dot, square, triangle, diamond`);
      return { outside: whole(o.outside, `solutes[${i}].outside`, 0, 14), inside: whole(o.inside, `solutes[${i}].inside`, 0, 14), through, arrow: arrowDir as 'in' | 'out' | null, name: r.optStr(o.name, `solutes[${i}].name`, 16), shape: (shape === 'dot' ? 'circle' : shape) as SeriesShape };
    });
    if (solutes.length === 2 && solutes[0].shape === solutes[1].shape) r.fail('solutes: the two solutes need different shapes');
    if (solutes.length === 2 && solutes[0].through !== undefined && solutes[0].through === solutes[1].through && solutes[0].arrow && solutes[1].arrow) r.fail('solutes: two arrows through one protein cannot be told apart');
    const cholesterol = r.bool(p.cholesterol, 'cholesterol', false);
    const labels = (p.labels === undefined || p.labels === null ? [] : r.list(p.labels, 'labels', 0, 6)).map((raw, i) => {
      const o = r.obj(raw, `labels[${i}]`);
      if (!MEMBRANE_TARGETS.includes(o.target as MembraneTarget)) r.fail(`labels[${i}].target must be one of ${MEMBRANE_TARGETS.join(', ')}`);
      const target = o.target as MembraneTarget;
      const there = target === 'head' || target === 'tails' || (target === 'cholesterol' ? cholesterol : target === 'carbohydrate' ? proteins.some((q) => q.carbohydrate) : proteins.some((q) => q.type === target));
      if (!there) r.fail(`labels[${i}].target: the figure has no ${target === 'carbohydrate' ? 'carbohydrate chain' : target}`);
      return { target, label: r.str(o.label, `labels[${i}].label`, 22) };
    });
    labels.forEach((l, i) => { if (labels.findIndex((x) => x.target === l.target) !== i) r.fail(`labels[${i}].target: ${l.target} is labelled twice`); });
    let sideLabels: [string, string] | null = ['Outside the cell', 'Inside the cell'];
    if (p.sideLabels === null) sideLabels = null;
    else if (p.sideLabels !== undefined) sideLabels = r.list(p.sideLabels, 'sideLabels', 2, 2).map((v, i) => r.str(v, `sideLabels[${i}]`, 34)) as [string, string];
    return { variant: 'membrane', proteins, cholesterol, solutes, labels, sideLabels, title };
  }
  if (p.variant === 'division') {
    const n = r.num(p.n, 'n');
    if (n !== 1 && n !== 2 && n !== 3) r.fail('n must be 1, 2 or 3 (the haploid number: 2n = 2, 4 or 6 chromosomes)');
    const all = [...MITOSIS, ...MEIOSIS] as readonly string[];
    const cells = r.list(p.cells, 'cells', 1, 4).map((raw, i) => {
      const o = r.obj(raw, `cells[${i}]`);
      if (!all.includes(o.stage as string)) r.fail(`cells[${i}].stage must be one of ${all.join(', ')}`);
      return { stage: o.stage as DivisionStage, label: labelOf(o.label, `cells[${i}].label`, 16) };
    });
    const mit = cells.filter((c) => (MITOSIS as readonly string[]).includes(c.stage)).length;
    if (mit > 0 && mit < cells.length) r.fail('cells mix stages of mitosis and of meiosis — one figure shows one kind of division');
    return { variant: 'division', n, process: mit > 0 ? 'mitosis' : 'meiosis', cells, title };
  }
  if (p.organelle !== 'mitochondrion' && p.organelle !== 'chloroplast') r.fail('organelle must be one of mitochondrion, chloroplast');
  const organelle = p.organelle as 'mitochondrion' | 'chloroplast';
  const allowed = SPACES[organelle] as readonly string[];
  const spaces = r.list(p.spaces, 'spaces', 1, 2).map((raw, i): CompartmentSpace => {
    const o = r.obj(raw, `spaces[${i}]`);
    if (!allowed.includes(o.id as string)) r.fail(`spaces[${i}].id must be one of ${allowed.join(', ')}`);
    const id = o.id as SpaceId;
    const ions = o.ions === undefined || o.ions === null ? undefined : whole(o.ions, `spaces[${i}].ions`, 0, 24);
    const pH = r.optNum(o.pH, `spaces[${i}].pH`);
    if (ions !== undefined && pH !== undefined) r.fail(`spaces[${i}]: give ions (dots) or pH (a printed value), not both`);
    if (pH !== undefined && (pH < 0 || pH > 14)) r.fail(`spaces[${i}].pH must be between 0 and 14`);
    return { id, label: o.label === null ? null : r.optStr(o.label, `spaces[${i}].label`, 24) ?? id.replace(/_/g, ' '), ions, pH };
  });
  if (spaces.length === 2 && spaces[0].id === spaces[1].id) r.fail(`spaces[1].id: ${spaces[1].id} is listed twice`);
  const synthase = r.bool(p.synthase, 'synthase', false);
  const showFlow = r.bool(p.showFlow, 'showFlow', false);
  let gradient: { high: SpaceId; low: SpaceId } | null = null;
  if (spaces.length === 2) {
    const [a, b] = spaces;
    // More dots, or a lower pH, is more H⁺.
    const cmp = a.ions !== undefined && b.ions !== undefined ? a.ions - b.ions : a.pH !== undefined && b.pH !== undefined ? b.pH - a.pH : null;
    if (cmp !== null && cmp !== 0) gradient = cmp > 0 ? { high: a.id, low: b.id } : { high: b.id, low: a.id };
    if (showFlow && cmp === 0) r.fail(`showFlow: the two spaces hold the same ${a.ions !== undefined ? 'number of ions' : 'pH'} — there is no gradient to flow down`);
  }
  if (showFlow && !synthase) r.fail('showFlow: the arrow runs through ATP synthase — set synthase: true');
  if (showFlow && !gradient) r.fail('showFlow: give both spaces ions (or both a pH), so the direction of flow is fixed');
  return { variant: 'compartments', organelle, spaces, synthase, showFlow, gradient, title };
}

// ---------------------------------------------------------------------------
// Shared drawing pieces
// ---------------------------------------------------------------------------

const FILL = '#eef2f6';
const rrect = (x: number, y: number, w: number, h: number, rx: number, attrs: string): string => `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}" rx="${n2(rx)}" ${attrs}/>`;
const dot = (x: number, y: number, rad: number, fill: string = INK): string => `<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(rad)}" fill="${fill}"/>`;
const leader = (from: Pt, to: Pt): string => `<path d="M${n2(from[0])},${n2(from[1])}L${n2(to[0])},${n2(to[1])}" ${stroke(MUTED, 1.1)}/>` + dot(to[0], to[1], 2);

/** A low-discrepancy point in the unit square (Halton, bases 2 and 3): even, and the same every time. */
function halton(i: number): Pt {
  const h = (b: number): number => { let f = 1; let v = 0; let k = i; while (k > 0) { f /= b; v += f * (k % b); k = Math.floor(k / b); } return v; };
  return [h(2), h(3)];
}
/** `count` points inside `box` for which `ok` holds, at least `gap` apart and clear of `avoid`. */
function scatter(count: number, box: Box, ok: (x: number, y: number) => boolean, avoid: Box[], gap: number, seed: number, taken: Pt[] = []): Pt[] {
  const out: Pt[] = [];
  for (let g = gap; out.length < count && g > 3; g *= 0.85) {
    for (let i = 1; i < 2500 && out.length < count; i++) {
      const [u, v] = halton(i + seed * 977);
      const x = box.x0 + u * (box.x1 - box.x0);
      const y = box.y0 + v * (box.y1 - box.y0);
      if (!ok(x, y) || avoid.some((b) => x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1)) continue;
      if ([...out, ...taken].some((q) => Math.hypot(q[0] - x, q[1] - y) < g)) continue;
      out.push([x, y]);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// cell
// ---------------------------------------------------------------------------

type Side = 'L' | 'R' | 'T';
interface Slot { fx: number; fy: number; side: Side }
const ANIMAL_SLOTS: Partial<Record<OrganelleType, Slot>> = {
  nucleus: { fx: 0.36, fy: 0.5, side: 'L' }, rough_er: { fx: 0.36, fy: 0.5, side: 'R' }, golgi: { fx: 0.74, fy: 0.22, side: 'R' }, mitochondrion: { fx: 0.74, fy: 0.75, side: 'R' },
  lysosome: { fx: 0.47, fy: 0.9, side: 'R' }, ribosomes: { fx: 0.5, fy: 0.12, side: 'T' }, centrioles: { fx: 0.14, fy: 0.27, side: 'L' }, smooth_er: { fx: 0.2, fy: 0.82, side: 'L' }, cell_membrane: { fx: 0, fy: 0.66, side: 'L' },
};
const PLANT_SLOTS: Partial<Record<OrganelleType, Slot>> = {
  nucleus: { fx: 0.19, fy: 0.33, side: 'L' }, rough_er: { fx: 0.19, fy: 0.33, side: 'T' }, golgi: { fx: 0.62, fy: 0.125, side: 'T' }, mitochondrion: { fx: 0.85, fy: 0.13, side: 'R' },
  ribosomes: { fx: 0.44, fy: 0.115, side: 'T' }, chloroplast: { fx: 0.2, fy: 0.76, side: 'L' }, central_vacuole: { fx: 0.635, fy: 0.52, side: 'R' }, cell_wall: { fx: 0, fy: 0.12, side: 'L' }, cell_membrane: { fx: 0, fy: 0.55, side: 'L' },
};

function renderCell(m: Extract<BioModel, { variant: 'cell' }>, W: number, t: { svg: string; top: number }): Drawn {
  const notes: Notes = [];
  const plant = m.cellType === 'plant';
  const slots = plant ? PLANT_SLOTS : ANIMAL_SLOTS;
  const FS = 12;
  const wOf = (s: string | null): number => (s === null ? 0 : s === '?' ? 20 : estWidth(s, FS));
  const sideW = (side: Side): number => Math.max(0, ...m.organelles.filter((o) => o.label !== null && (slots[o.type] as Slot).side === side).map((o) => wOf(o.label)));
  const ML = Math.max(26, sideW('L') + 18);
  const MR = Math.max(26, sideW('R') + 18);
  const topLabels = m.organelles.filter((o) => o.label !== null && (slots[o.type] as Slot).side === 'T');
  const x0 = ML;
  const x1 = W - MR;
  const cw = x1 - x0;
  const sc = Math.max(0.7, Math.min(1, cw / 250));
  if (cw < 170) notes.push({ code: 'crowded', message: 'the labels leave the cell under 170 units wide — use letters or numbers, with the names in the question' });
  const y0 = t.top + (topLabels.length ? 34 : 6);
  const ch = 178;
  const at = (s: Slot): Pt => [x0 + s.fx * cw, y0 + s.fy * ch];
  const parts: string[] = [];
  const has = (type: OrganelleType): boolean => m.organelles.some((o) => o.type === type);
  const anchors: Partial<Record<OrganelleType, Pt>> = {};
  // The outline.
  if (plant) {
    parts.push(rrect(x0, y0, cw, ch, 7, `fill="#ffffff" stroke="${INK}" stroke-width="4"`), rrect(x0 + 7, y0 + 7, cw - 14, ch - 14, 4, `fill="#ffffff" stroke="${INK}" stroke-width="1.3"`));
    anchors.cell_wall = [x0, y0 + 0.12 * ch];
    anchors.cell_membrane = [x0 + 7, y0 + 0.55 * ch];
  } else {
    parts.push(rrect(x0, y0, cw, ch, 62 * sc, `fill="#ffffff" stroke="${INK}" stroke-width="2"`));
    anchors.cell_membrane = [x0, y0 + 0.66 * ch];
  }
  // The nucleus is always there.
  const [nx, ny] = at(slots.nucleus as Slot);
  const NR = (plant ? 23 : 31) * sc;
  parts.push(`<circle cx="${n2(nx)}" cy="${n2(ny)}" r="${n2(NR)}" fill="${FILL}" stroke="${INK}" stroke-width="1.8"/>`, dot(nx + NR * 0.28, ny - NR * 0.18, NR * 0.3, MUTED));
  anchors.nucleus = [nx - NR, ny];
  if (has('rough_er')) {
    const radii = plant ? [NR + 6, NR + 12] : [NR + 7, NR + 14, NR + 21];
    const span = plant ? 52 : 50;
    radii.forEach((rr, k) => {
      parts.push(`<path d="${arcPath(nx, ny, rr, deg(-span), deg(span))}" ${stroke(INK, 1.5)}/>`);
      if (k !== 1 || plant) for (let a = -span + 9; a <= span - 9; a += plant ? 17 : 13) parts.push(dot(nx + (rr + 2.6) * Math.cos(deg(a)), ny - (rr + 2.6) * Math.sin(deg(a)), 1.5));
    });
    const outer = radii[radii.length - 1];
    anchors.rough_er = plant ? [nx + outer * Math.cos(deg(46)), ny - outer * Math.sin(deg(46))] : [nx + outer, ny];
  }
  const capsule = (cx: number, cy: number, w: number, h: number): string => rrect(cx - w / 2, cy - h / 2, w, h, h / 2, `fill="${FILL}" stroke="${INK}" stroke-width="1.6"`);
  if (has('mitochondrion')) {
    const [cx, cy] = at(slots.mitochondrion as Slot);
    const w = 52 * sc;
    const zig: Pt[] = [];
    for (let i = 0; i <= 8; i++) zig.push([cx - w * 0.34 + (w * 0.68 * i) / 8, cy + (i % 2 === 0 ? -5.5 : 5.5) * sc]);
    parts.push(capsule(cx, cy, w, 24 * sc), `<path d="${polyPath(zig)}" ${stroke(INK, 1.3)} stroke-linejoin="round"/>`);
    anchors.mitochondrion = [cx + w / 2, cy];
  }
  if (has('chloroplast')) {
    const [cx, cy] = at(slots.chloroplast as Slot);
    const w = 50 * sc;
    const stacks = (px: number, py: number): string => [-1, 0, 1].map((k) => `<rect x="${n2(px - 4.5)}" y="${n2(py + k * 4.4 - 1.3)}" width="9" height="2.6" fill="${INK}"/>`).join('');
    parts.push(capsule(cx, cy, w, 25 * sc), stacks(cx - w * 0.27, cy), stacks(cx, cy), stacks(cx + w * 0.27, cy));
    // A second one, so "chloroplasts" reads as a kind of organelle, not one object.
    const [bx, by] = [x0 + 0.62 * cw, y0 + 0.87 * ch];
    parts.push(capsule(bx, by, w * 0.9, 21 * sc), stacks(bx - w * 0.24, by), stacks(bx, by), stacks(bx + w * 0.24, by));
    anchors.chloroplast = [cx - w / 2, cy];
  }
  if (has('central_vacuole')) {
    const [vx0, vy0, vx1, vy1] = [x0 + 0.42 * cw, y0 + 0.27 * ch, x0 + 0.85 * cw, y0 + 0.77 * ch];
    parts.push(rrect(vx0, vy0, vx1 - vx0, vy1 - vy0, 18, `fill="#f8fafc" stroke="${INK}" stroke-width="1.5"`));
    anchors.central_vacuole = [vx1, (vy0 + vy1) / 2];
  }
  if (has('golgi')) {
    const [cx, cy] = at(slots.golgi as Slot);
    const bows = [0, 1, 2, 3].map((k) => { const w = (21 - k * 3) * sc; const y = cy - 9 * sc + k * 6 * sc; return `M${n2(cx - w)},${n2(y)}Q${n2(cx)},${n2(y + 7 * sc)} ${n2(cx + w)},${n2(y)}`; });
    parts.push(`<path d="${bows.join('')}" ${stroke(INK, 2.6)} stroke-linecap="round"/>`);
    for (const [dx, dy] of [[27, -7], [30, 3], [25, 11]]) parts.push(`<circle cx="${n2(cx + dx * sc)}" cy="${n2(cy + dy * sc)}" r="2.7" fill="#ffffff" stroke="${INK}" stroke-width="1.2"/>`);
    anchors.golgi = plant ? [cx, cy - 9 * sc] : [cx + 21 * sc, cy - 9 * sc];
  }
  if (has('ribosomes')) {
    const [cx, cy] = at(slots.ribosomes as Slot);
    for (const [dx, dy] of [[-8, 2], [-3, -3], [3, 3], [8, -2], [0, 8], [-10, -5]]) parts.push(dot(cx + dx, cy + dy, 1.9));
    anchors.ribosomes = [cx - 3, cy - 3];
  }
  if (has('lysosome')) {
    const [cx, cy] = at(slots.lysosome as Slot);
    parts.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="7.5" fill="#94a3b8" stroke="${INK}" stroke-width="1.3"/>`);
    anchors.lysosome = [cx + 7.5, cy];
  }
  if (has('centrioles')) {
    const [cx, cy] = at(slots.centrioles as Slot);
    parts.push(`<rect x="${n2(cx - 9)}" y="${n2(cy - 8)}" width="7" height="16" fill="#ffffff" stroke="${INK}" stroke-width="1.3"/><path d="M${n2(cx - 5.5)},${n2(cy - 8)}v16" ${stroke(INK, 1)}/>`,
      `<rect x="${n2(cx + 1)}" y="${n2(cy - 1)}" width="16" height="7" fill="#ffffff" stroke="${INK}" stroke-width="1.3"/><path d="M${n2(cx + 1)},${n2(cy + 2.5)}h16" ${stroke(INK, 1)}/>`);
    anchors.centrioles = [cx - 9, cy];
  }
  if (has('smooth_er')) {
    const [cx, cy] = at(slots.smooth_er as Slot);
    const d = `M${n2(cx - 20)},${n2(cy - 5)}q7,-9 14,0t14,0t14,0M${n2(cx - 14)},${n2(cy + 7)}q7,-9 14,0t14,0t14,0`;
    parts.push(`<path d="${d}" ${stroke(INK, 5.4)} stroke-linecap="round"/><path d="${d}" ${stroke('#ffffff', 2.6)} stroke-linecap="round"/>`);
    anchors.smooth_er = [cx - 20, cy - 5];
  }
  // Labels: left and right columns (kept a line apart), and a row above for the top band.
  const lines: string[] = [];
  const labels: string[] = [];
  for (const side of ['L', 'R'] as const) {
    const mine = m.organelles.filter((o) => o.label !== null && (slots[o.type] as Slot).side === side).map((o) => ({ o, a: anchors[o.type] as Pt, y: (anchors[o.type] as Pt)[1] })).sort((p1, p2) => p1.y - p2.y);
    for (let i = 1; i < mine.length; i++) if (mine[i].y - mine[i - 1].y < 17) mine[i].y = mine[i - 1].y + 17;
    for (const q of mine) {
      const lx = side === 'L' ? x0 - 12 : x1 + 12;
      lines.push(leader([lx + (side === 'L' ? 3 : -3), q.y], q.a));
      labels.push(lab(lx, q.y + FS * 0.36, q.o.label as string, side === 'L' ? 'end' : 'start', { fs: FS, weight: 700 }));
    }
  }
  topLabels.map((o) => ({ o, a: anchors[o.type] as Pt })).sort((p1, p2) => p1.a[0] - p2.a[0]).forEach((q, i, all) => {
    // Two heights, so neighbouring names do not run together.
    const near = i > 0 && q.a[0] - all[i - 1].a[0] < (wOf(q.o.label) + wOf(all[i - 1].o.label)) / 2 + 8;
    const ly = y0 - (near && i % 2 === 1 ? 22 : 9);
    lines.push(leader([q.a[0], ly + 3], q.a));
    labels.push(lab(q.a[0], ly, q.o.label as string, 'middle', { fs: FS, weight: 700 }));
  });
  return { body: t.svg + parts.join('') + lines.join('') + labels.join(''), H: y0 + ch + 10, facts: facts(notes) };
}

// ---------------------------------------------------------------------------
// membrane
// ---------------------------------------------------------------------------

function renderMembrane(m: Extract<BioModel, { variant: 'membrane' }>, W: number, t: { svg: string; top: number }): Drawn {
  const notes: Notes = [];
  const parts: string[] = [];
  const over: string[] = [];
  const top = t.top + 2;
  const zone = 74;                       // height of the space drawn on each side
  const yT = top + zone + 5;             // centres of the outer heads
  const yc = yT + 18;
  const yB = yc + 18;
  const HEAD = 4.3;
  const PITCH = 10.6;
  const xL = 12;
  const xR = W - 12;
  // Proteins: the spanning ones evenly across; a peripheral one on the inner face, in a gap.
  const spanning = m.proteins.map((q, i) => ({ q, i })).filter((x) => x.q.type !== 'peripheral');
  const px = new Map<number, number>();
  spanning.forEach((x, k) => px.set(x.i, xL + ((xR - xL) * (k + 1)) / (spanning.length + 1)));
  const half: Record<string, number> = { channel: 17, carrier: 15, pump: 16 };
  const gaps: Array<[number, number]> = spanning.map((x) => [(px.get(x.i) as number) - half[x.q.type] - 2, (px.get(x.i) as number) + half[x.q.type] + 2]);
  const lipidXs: number[] = [];
  for (let x = xL + HEAD + 1; x <= xR - HEAD - 1 + 1e-6; x += PITCH) if (!gaps.some(([a, b]) => x + HEAD > a && x - HEAD < b)) lipidXs.push(x);
  const chol = m.cholesterol ? lipidXs.filter((_, i) => i % 5 === 2).map((x) => x + PITCH / 2).filter((x) => !gaps.some(([a, b]) => x + 3 > a && x - 3 < b)) : [];
  const tails: string[] = [];
  for (const x of lipidXs) {
    tails.push(`M${n2(x - 1.7)},${n2(yT + HEAD)}V${n2(yc - 1.5)}M${n2(x + 1.7)},${n2(yT + HEAD)}V${n2(yc - 1.5)}M${n2(x - 1.7)},${n2(yB - HEAD)}V${n2(yc + 1.5)}M${n2(x + 1.7)},${n2(yB - HEAD)}V${n2(yc + 1.5)}`);
  }
  parts.push(`<path d="${tails.join('')}" ${stroke(MUTED, 1.1)}/>`);
  for (const x of lipidXs) parts.push(`<circle cx="${n2(x)}" cy="${n2(yT)}" r="${HEAD}" fill="#ffffff" stroke="${INK}" stroke-width="1.4"/><circle cx="${n2(x)}" cy="${n2(yB)}" r="${HEAD}" fill="#ffffff" stroke="${INK}" stroke-width="1.4"/>`);
  chol.forEach((x, k) => parts.push(`<rect x="${n2(x - 1.8)}" y="${n2(k % 2 === 0 ? yT + HEAD + 1 : yc + 2)}" width="3.6" height="10.5" rx="1.8" fill="${INK}"/>`));
  const avoid: Box[] = [];
  const anchors: Partial<Record<MembraneTarget, Pt>> = {};
  const body = (d: string): string => `<path d="${d}" fill="${FILL}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
  const [pT, pB] = [yT - 11, yB + 11];
  let carbTop: Pt | null = null;
  // The peripheral protein sits on the inner face, under the widest run of lipids.
  const peri = m.proteins.findIndex((q) => q.type === 'peripheral');
  let periX = NaN;
  if (peri >= 0) {
    const edges = [xL, ...gaps.flat(), xR];
    let best = 0;
    for (let k = 0; k < edges.length; k += 2) if (edges[k + 1] - edges[k] > edges[best + 1] - edges[best] + 1e-9) best = k;
    periX = edges[best] + (edges[best + 1] - edges[best]) * (best === 0 && edges.length > 2 ? 0.66 : 0.5);
  }
  m.proteins.forEach((q, i) => {
    if (q.type === 'peripheral') return;
    const x = px.get(i) as number;
    if (q.type === 'channel') {
      parts.push(rrect(x - 17, pT, 12, pB - pT, 5, `fill="${FILL}" stroke="${INK}" stroke-width="1.5"`), rrect(x + 5, pT, 12, pB - pT, 5, `fill="${FILL}" stroke="${INK}" stroke-width="1.5"`));
    } else if (q.type === 'carrier') {
      parts.push(body(`M${n2(x - 15)},${n2(pT)}L${n2(x - 6)},${n2(pT)}L${n2(x)},${n2(pT + 13)}L${n2(x + 6)},${n2(pT)}L${n2(x + 15)},${n2(pT)}V${n2(pB)}H${n2(x - 15)}z`));
    } else {
      parts.push(body(`M${n2(x - 16)},${n2(pT)}H${n2(x + 16)}L${n2(x + 8)},${n2(yc)}L${n2(x + 16)},${n2(pB)}H${n2(x - 16)}L${n2(x - 8)},${n2(yc)}z`));
      if (q.atp) {
        // Beside the inner end — on the left when the peripheral protein is on the right.
        const sd = Number.isFinite(periX) && periX > x && periX < x + 70 ? -1 : 1;
        over.push(text(x + sd * 24, pB + 13, 'ATP', { fs: 12, weight: 700, anchor: sd > 0 ? 'start' : 'end' }), `<path d="M${n2(x + sd * 22)},${n2(pB + 8)}L${n2(x + sd * 12)},${n2(pB - 4)}" ${stroke(INK, 1.2)}/>`);
        avoid.push(sd > 0 ? { x0: x + 8, y0: pB - 6, x1: x + 54, y1: pB + 19 } : { x0: x - 54, y0: pB - 6, x1: x - 8, y1: pB + 19 });
      }
    }
    anchors[q.type] = anchors[q.type] ?? [x + (q.type === 'channel' ? 11 : 6), pB];
    avoid.push({ x0: x - 20, y0: pT - 4, x1: x + 20, y1: pB + 4 });
    if (q.carbohydrate) {
      // A branched chain of beads on the outer end.
      const bx = x + (q.type === 'channel' ? -11 : q.type === 'carrier' ? -10 : -8);
      const beads: Pt[] = [[bx, pT - 5], [bx, pT - 12.5], [bx - 5, pT - 19], [bx + 5, pT - 19], [bx - 9, pT - 26]];
      parts.push(`<path d="M${n2(bx)},${n2(pT)}V${n2(pT - 12.5)}L${n2(bx - 5)},${n2(pT - 19)}L${n2(bx - 9)},${n2(pT - 26)}M${n2(bx)},${n2(pT - 12.5)}L${n2(bx + 5)},${n2(pT - 19)}" ${stroke(INK, 1.1)}/>`);
      for (const b of beads) parts.push(`<path d="${polyPath([[b[0] - 3.6, b[1]], [b[0] - 1.8, b[1] - 3.1], [b[0] + 1.8, b[1] - 3.1], [b[0] + 3.6, b[1]], [b[0] + 1.8, b[1] + 3.1], [b[0] - 1.8, b[1] + 3.1]], true)}" fill="#ffffff" stroke="${INK}" stroke-width="1.2"/>`);
      avoid.push({ x0: bx - 19, y0: pT - 36, x1: bx + 15, y1: pT + 2 });
      carbTop = carbTop ?? [bx + 5, pT - 19];
    }
  });
  if (carbTop) anchors.carbohydrate = carbTop;
  if (peri >= 0) {
    const x = periX;
    parts.push(`<path d="${ellipseD(x, yB + HEAD + 7, 15, 7.5)}" fill="${FILL}" stroke="${INK}" stroke-width="1.5"/>`);
    anchors.peripheral = [x, yB + HEAD + 14.5];
    avoid.push({ x0: x - 19, y0: yB, x1: x + 19, y1: yB + HEAD + 18 });
  }
  // Leaders: outer parts are named above the membrane, inner parts below it.
  const usable = lipidXs.filter((x) => !avoid.some((b) => x > b.x0 - 4 && x < b.x1 + 4));
  if (usable.length >= 6) {
    anchors.head = [usable[1], yT - HEAD];
    const tx = usable[Math.min(usable.length - 2, 4)] + PITCH / 2;
    anchors.tails = [lipidXs.includes(tx - PITCH / 2 + PITCH) ? tx : usable[3] + PITCH / 2, yc + 9];
  } else {
    anchors.head = [lipidXs[0], yT - HEAD];
    anchors.tails = [lipidXs[0] + PITCH / 2, yc + 9];
  }
  if (chol.length) anchors.cholesterol = [chol[chol.length > 2 ? 2 : 0], yT + HEAD + 6];
  const labelBoxes: Box[] = [];
  for (const l of m.labels) {
    const a = anchors[l.target] as Pt;
    const up = l.target === 'head' || l.target === 'carbohydrate' || l.target === 'cholesterol';
    const side = l.target === 'carbohydrate' ? 1 : 0;
    const w = l.label === '?' ? 20 : estWidth(l.label, 12);
    let lx = a[0] + side * 14;
    let ly = up ? (l.target === 'carbohydrate' ? a[1] - 2 : yT - 22) : yB + (l.target === 'tails' ? 26 : 30);
    const anchor = side ? 'start' as const : 'middle' as const;
    const boxAt = (): Box => { const b = labBox(lx, ly, l.label, anchor, 12); return { x0: b.x0 - 3, y0: b.y0 - 2, x1: b.x1 + 3, y1: b.y1 + 2 }; };
    // Keep inside the figure, and step away from a label already set.
    if (!side) lx = Math.max(xL + w / 2, Math.min(xR - w / 2, lx));
    for (let k = 0; k < 4 && labelBoxes.some((b) => { const c = boxAt(); return c.x0 < b.x1 && b.x0 < c.x1 && c.y0 < b.y1 && b.y0 < c.y1; }); k++) ly += up ? -15 : 15;
    const b = boxAt();
    labelBoxes.push(b);
    avoid.push({ x0: b.x0 - 3, y0: Math.min(b.y0, a[1]) - 3, x1: b.x1 + 3, y1: Math.max(b.y1, a[1]) + 3 });
    over.push(leader(side ? [lx - 2, ly - 4] : [Math.max(b.x0 + 3, Math.min(b.x1 - 3, a[0])), up ? b.y1 - 1 : b.y0 + 1], a), lab(lx, ly, l.label, anchor, { fs: 12, weight: 700 }));
  }
  // The two sides.
  const outBox: Box = { x0: xL + 4, y0: top + (m.sideLabels ? 18 : 6), x1: xR - 4, y1: yT - HEAD - 9 };
  const inBox: Box = { x0: xL + 4, y0: yB + HEAD + 9, x1: xR - 4, y1: yB + zone - (m.sideLabels ? 12 : 0) };
  if (m.sideLabels) {
    over.push(text(xL, top + 11, m.sideLabels[0], { weight: 600, fill: MUTED }), text(xL, yB + zone + 5, m.sideLabels[1], { weight: 600, fill: MUTED }));
  }
  // Transport arrows.
  m.solutes.forEach((s, k) => {
    if (!s.arrow || s.through === undefined) return;
    let x: number;
    if (s.through === 'bilayer') {
      const free = lipidXs.filter((v) => !avoid.some((b) => v > b.x0 - 8 && v < b.x1 + 8));
      x = (free[Math.floor(free.length * (k === 0 ? 0.3 : 0.7))] ?? lipidXs[2]) + PITCH / 2;
    } else x = px.get(s.through) as number;
    const [a, b] = s.arrow === 'in' ? [pT - 16, pB + 17] : [pB + 16, pT - 17];
    over.push(arrow(x, a, x, b, { color: SERIES_COLORS[k], width: 2.4, head: 9 }));
    avoid.push({ x0: x - 9, y0: pT - 22, x1: x + 9, y1: pB + 22 });
  });
  const placedDots: Pt[] = [];
  m.solutes.forEach((s, k) => {
    const draw = (q: Pt) => parts.push(s.shape === 'circle' ? `<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="3.2" fill="${SERIES_COLORS[k]}" stroke="#ffffff" stroke-width="1"/>` : shapeMark(s.shape, q[0], q[1], 3.2, SERIES_COLORS[k]));
    const put = (count: number, box: Box, seed: number) => {
      const got = scatter(count, box, () => true, avoid, 15, seed, placedDots);
      if (got.length < count) notes.push({ code: 'crowded', message: `solutes[${k}]: only ${got.length} of ${count} marks fit on one side — fewer marks, labels or proteins` });
      placedDots.push(...got);
      got.forEach(draw);
    };
    put(s.outside, outBox, 1 + k * 2);
    put(s.inside, inBox, 2 + k * 2);
  });
  let H = yB + zone + (m.sideLabels ? 12 : 4);
  const named = m.solutes.map((s, k) => ({ s, k })).filter((x) => x.s.name);
  if (named.length) {
    let x = xL;
    for (const { s, k } of named) {
      parts.push(s.shape === 'circle' ? `<circle cx="${n2(x + 5)}" cy="${n2(H + 8)}" r="3.2" fill="${SERIES_COLORS[k]}" stroke="#ffffff" stroke-width="1"/>` : shapeMark(s.shape, x + 5, H + 8, 3.2, SERIES_COLORS[k]), text(x + 13, H + 12, `= ${s.name}`, {}));
      x += 13 + estWidth(`= ${s.name}`, TICK_FS) + 18;
    }
    H += 20;
  }
  if (m.proteins.length === 0 && m.solutes.length === 0 && m.labels.length === 0) notes.push({ code: 'ambiguous_blank', message: 'a bare bilayer: no protein, solute or label is drawn' });
  return { body: t.svg + parts.join('') + over.join(''), H: H + 4, facts: facts(notes) };
}

// ---------------------------------------------------------------------------
// division
// ---------------------------------------------------------------------------

const CHR_LEN = [13, 9, 11];

function renderDivision(m: Extract<BioModel, { variant: 'division' }>, W: number, t: { svg: string; top: number }): Drawn {
  const notes: Notes = [];
  const parts: string[] = [];
  const perRow = m.cells.length <= 3 ? m.cells.length : 2;
  const bw = Math.min(170, (W - 12) / perRow);
  const RX = Math.min(72, bw / 2 - 6);
  const RY = 48;
  const rowH = 2 * RY + 30;
  /** One chromatid stick; a hollow one (the homologue from the other parent) has a white core. */
  const stick = (pts: Pt[], hollow: boolean): string => `<path d="${polyPath(pts)}" ${stroke(INK, 3.4)} stroke-linecap="round"/>` + (hollow ? `<path d="${polyPath(pts)}" ${stroke('#ffffff', 1.3)} stroke-linecap="round"/>` : '');
  /** A replicated chromosome: an X, upright. */
  const X = (cx: number, cy: number, len: number, hollow: boolean): string => stick([[cx - 2.6, cy - len / 2], [cx + 2.6, cy + len / 2]], hollow) + stick([[cx + 2.6, cy - len / 2], [cx - 2.6, cy + len / 2]], hollow);
  /** A single chromatid being pulled to the pole on side `s` (−1 left, 1 right): a V with its point leading. */
  const V = (cx: number, cy: number, len: number, hollow: boolean, s: number): string => stick([[cx - s * len * 0.36, cy - len * 0.42], [cx + s * len * 0.2, cy], [cx - s * len * 0.36, cy + len * 0.42]], hollow);
  m.cells.forEach((cell, ci) => {
    const row = Math.floor(ci / perRow);
    const inRow = Math.min(perRow, m.cells.length - row * perRow);
    const cx = W / 2 + ((ci % perRow) - (inRow - 1) / 2) * bw;
    const cy = t.top + 4 + RY + row * rowH;
    const st = cell.stage;
    const n = m.n;
    const pinched = st.startsWith('telophase');
    // The outline: one oval, or two lobes joined at a furrow.
    if (pinched) {
      const lobe = RX * 0.58;
      const dx = RX - lobe;
      const hy = Math.sqrt(Math.max(0, lobe * lobe - dx * dx)) * (RY / lobe);
      parts.push(`<path d="M${n2(cx)},${n2(cy - hy)}A${n2(lobe)},${n2(RY)} 0 1 0 ${n2(cx)},${n2(cy + hy)}A${n2(lobe)},${n2(RY)} 0 1 0 ${n2(cx)},${n2(cy - hy)}z" fill="#ffffff" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`);
    } else parts.push(`<path d="${ellipseD(cx, cy, RX, RY)}" fill="#ffffff" stroke="${INK}" stroke-width="1.8"/>`);
    /** Chromosomes of the whole set: [pair, hollow]. Haploid cells of meiosis II take one of each pair. */
    const diploid: Array<[number, boolean]> = [];
    for (let k = 0; k < n; k++) diploid.push([k, false], [k, true]);
    const haploid: Array<[number, boolean]> = Array.from({ length: n }, (_, k) => [k, k % 2 === 1]);
    /** y of slot i of `count` in a column inside the cell. */
    const colY = (i: number, count: number, lens: number[]): number => {
      const total = lens.reduce((a, b) => a + b, 0) + (count - 1) * 5;
      let y = cy - total / 2;
      for (let k = 0; k < i; k++) y += lens[k] + 5;
      return y + lens[i] / 2;
    };
    const spindle: string[] = [];
    const pole = RX * 0.86;
    const fibre = (x: number, y: number, s: number) => spindle.push(`M${n2(cx + s * pole)},${n2(cy)}L${n2(x)},${n2(y)}`);
    const body: string[] = [];
    if (st === 'prophase' || st === 'prophase_I') {
      // Scattered inside a nuclear envelope that is breaking down (dashed).
      parts.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(RY * 0.74)}" ${stroke(MUTED, 1.2, '4 3')}/>`);
      const spots: Pt[] = st === 'prophase' ? [[-14, -14], [13, -10], [-10, 12], [15, 14], [0, -24], [1, 26]] : [[-12, -13], [13, 12], [2, -1]];
      if (st === 'prophase') diploid.forEach(([k, hollow], i) => body.push(X(cx + spots[i][0], cy + spots[i][1], CHR_LEN[k], hollow)));
      else for (let k = 0; k < n; k++) { const [sx, sy] = n === 1 ? [0, 0] : spots[k]; body.push(X(cx + sx - 4.6, cy + sy, CHR_LEN[k], false), X(cx + sx + 4.6, cy + sy, CHR_LEN[k], true)); }
    } else if (st === 'metaphase' || st === 'metaphase_II') {
      const set = st === 'metaphase' ? diploid : haploid;
      const lens = set.map(([k]) => CHR_LEN[k]);
      set.forEach(([k, hollow], i) => { const y = colY(i, set.length, lens); body.push(X(cx, y, CHR_LEN[k], hollow)); fibre(cx - 3, y, -1); fibre(cx + 3, y, 1); });
    } else if (st === 'metaphase_I') {
      const lens = Array.from({ length: n }, (_, k) => CHR_LEN[k]);
      for (let k = 0; k < n; k++) {
        const y = colY(k, n, lens);
        const flip = k % 2 === 1;
        body.push(X(cx - 6, y, CHR_LEN[k], flip), X(cx + 6, y, CHR_LEN[k], !flip));
        fibre(cx - 9, y, -1);
        fibre(cx + 9, y, 1);
      }
    } else if (st === 'anaphase_I' || st === 'telophase_I') {
      const lens = Array.from({ length: n }, (_, k) => CHR_LEN[k]);
      const off = st === 'anaphase_I' ? RX * 0.4 : RX * 0.44;
      for (let k = 0; k < n; k++) {
        const y = colY(k, n, lens);
        const flip = k % 2 === 1;
        body.push(X(cx - off, y, CHR_LEN[k], flip), X(cx + off, y, CHR_LEN[k], !flip));
        if (st === 'anaphase_I') { fibre(cx - off - 3, y, -1); fibre(cx + off + 3, y, 1); }
      }
    } else {
      // anaphase / telophase of mitosis, anaphase II / telophase II: single chromatids to each pole.
      const set = st === 'anaphase' || st === 'telophase' ? diploid : haploid;
      const lens = set.map(([k]) => CHR_LEN[k] * 0.84);
      const off = pinched ? RX * 0.44 : RX * 0.4;
      set.forEach(([k, hollow], i) => {
        const y = colY(i, set.length, lens);
        body.push(V(cx - off, y, CHR_LEN[k], hollow, -1), V(cx + off, y, CHR_LEN[k], hollow, 1));
        if (!pinched) { fibre(cx - off - 3, y, -1); fibre(cx + off + 3, y, 1); }
      });
    }
    if (pinched) {
      // A nuclear envelope re-forming round each group (dashed).
      const count = st === 'telophase' ? 2 * n : n;
      const ry = Math.min(RY * 0.8, count * 7.5 + 8);
      for (const s2 of [-1, 1]) parts.push(`<path d="${ellipseD(cx + s2 * RX * 0.44, cy, 16, ry)}" ${stroke(MUTED, 1.2, '4 3')}/>`);
    }
    if (spindle.length) parts.push(`<path d="${spindle.join('')}" ${stroke('#94a3b8', 0.9)}/>`, dot(cx - pole, cy, 2.2, MUTED), dot(cx + pole, cy, 2.2, MUTED));
    parts.push(...body);
    if (cell.label) parts.push(lab(cx, cy + RY + 17, cell.label, 'middle', { fs: 12, weight: 700 }));
  });
  const rows = Math.ceil(m.cells.length / perRow);
  return { body: t.svg + parts.join(''), H: t.top + 4 + rows * rowH, facts: facts(notes) };
}

// ---------------------------------------------------------------------------
// compartments
// ---------------------------------------------------------------------------

function renderCompartments(m: Extract<BioModel, { variant: 'compartments' }>, W: number, t: { svg: string; top: number }): Drawn {
  const notes: Notes = [];
  const parts: string[] = [];
  const over: string[] = [];
  const top = t.top + 6;
  const mito = m.organelle === 'mitochondrion';
  const outer: Box = { x0: 24, y0: top, x1: W - 24, y1: top + 168 };
  const inner: Box = mito ? { x0: outer.x0 + 30, y0: outer.y0 + 34, x1: outer.x1 - 30, y1: outer.y1 - 30 } : { x0: outer.x0 + 62, y0: outer.y0 + 70, x1: outer.x1 - 62, y1: outer.y1 - 30 };
  const box = (b: Box, rx: number, fill: string, width: number): string => rrect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, rx, `fill="${fill}" stroke="${INK}" stroke-width="${width}"`);
  parts.push(box(outer, 26, mito ? FILL : '#ffffff', 2), box(inner, mito ? 16 : 22, mito ? '#ffffff' : FILL, 2));
  const inIn = (x: number, y: number, pad: number): boolean => x > inner.x0 + pad && x < inner.x1 - pad && y > inner.y0 + pad && y < inner.y1 - pad;
  const inOut = (x: number, y: number, pad: number): boolean => x > outer.x0 + pad && x < outer.x1 - pad && y > outer.y0 + pad && y < outer.y1 - pad;
  const region = (id: SpaceId): { ok: (x: number, y: number) => boolean; labelAt: Pt; anchor: 'start' | 'middle' } => {
    const innerSpace = id === 'matrix' || id === 'thylakoid_lumen';
    if (innerSpace) return { ok: (x, y) => inIn(x, y, 8), labelAt: [(inner.x0 + inner.x1) / 2, inner.y0 + 17], anchor: 'middle' };
    return { ok: (x, y) => inOut(x, y, 8) && !inIn(x, y, -8), labelAt: mito ? [outer.x0 + 22, outer.y0 + 21] : [(outer.x0 + outer.x1) / 2, outer.y0 + 22], anchor: mito ? 'start' : 'middle' };
  };
  const avoid: Box[] = [];
  // ATP synthase: a stalk through the inner membrane and a knob on the low-H⁺ side by convention
  // (the matrix; the stroma) — drawn the same whatever the gradient.
  const sx = (inner.x0 + inner.x1) / 2 + 58;
  const sy = mito ? inner.y1 : inner.y0;
  const dir = mito ? -1 : -1;          // the knob points into the matrix (up from the lower wall) / into the stroma (up from the upper wall)
  if (m.synthase) {
    over.push(`<rect x="${n2(sx - 5)}" y="${n2(sy - 9)}" width="10" height="18" fill="#ffffff" stroke="${INK}" stroke-width="1.5"/>`, `<circle cx="${n2(sx)}" cy="${n2(sy + dir * 17)}" r="9" fill="#ffffff" stroke="${INK}" stroke-width="1.5"/>`);
    avoid.push({ x0: sx - 15, y0: sy - 34, x1: sx + 15, y1: sy + 30 });
    if (m.showFlow && m.gradient) {
      // From the space with more H⁺ to the one with less: the knob's space is the inner one for a
      // mitochondrion (matrix) and the outer one for a chloroplast (stroma).
      const knobSpace: SpaceId = mito ? 'matrix' : 'stroma';
      const toKnob = m.gradient.low === knobSpace;
      const far = sy - dir * 24;
      const near = sy + dir * 31;
      over.push(arrow(sx + 16, toKnob ? far : near, sx + 16, toKnob ? near : far, { color: INK, width: 2.2, head: 9 }));
      avoid.push({ x0: sx + 8, y0: Math.min(far, near) - 4, x1: sx + 26, y1: Math.max(far, near) + 4 });
    }
  }
  let anyIons = false;
  m.spaces.forEach((sp, k) => {
    const reg = region(sp.id);
    const lines = [sp.label, sp.pH === undefined ? null : `pH ${numStr(sp.pH, 1)}`].filter((x): x is string => x !== null);
    lines.forEach((s, i) => {
      const y = reg.labelAt[1] + i * 15;
      over.push(lab(reg.labelAt[0], y, s, reg.anchor, { fs: 12, weight: i === 0 && sp.label !== null ? 700 : 400, halo: true }));
      const b = labBox(reg.labelAt[0], y, s, reg.anchor, 12);
      avoid.push({ x0: b.x0 - 5, y0: b.y0 - 4, x1: b.x1 + 5, y1: b.y1 + 4 });
    });
    if (sp.ions) {
      anyIons = true;
      const got = scatter(sp.ions, outer, reg.ok, avoid, 13, 3 + k);
      if (got.length < sp.ions) notes.push({ code: 'crowded', message: `spaces[${k}]: only ${got.length} of ${sp.ions} dots fit` });
      got.forEach((q) => parts.push(dot(q[0], q[1], 2.4)));
    }
  });
  let H = outer.y1 + 8;
  if (anyIons) {
    parts.push(dot(outer.x0 + 6, H + 8, 2.4), text(outer.x0 + 14, H + 12, '= one H⁺ ion', {}));
    H += 20;
  }
  if (!m.gradient) notes.push({ code: 'ambiguous_blank', message: 'no H⁺ gradient is shown — give both spaces ions (dots) or both a pH' });
  return { body: t.svg + parts.join('') + over.join(''), H: H + 2, facts: facts(notes) };
}

export function renderBioSchematic(r: Reader): Drawn {
  const m = bioModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  if (m.variant === 'cell') return renderCell(m, W, t);
  if (m.variant === 'membrane') return renderMembrane(m, W, t);
  if (m.variant === 'division') return renderDivision(m, W, t);
  return renderCompartments(m, W, t);
}
