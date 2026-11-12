/**
 * Tutor brain v2 — the board's catalogue of exact figures, for the lesson in hand.
 *
 * The board can draw some 130 figures precisely from a few parameters (diagrams/catalog): a titration curve,
 * a solid of revolution, a recursion tree, a pulley, a supply-and-demand graph. v2 offered the tutor about
 * seventeen plain forms and none of these, so a physics lesson was text cards and a box with one arrow
 * (Praveen, AP Physics 1, embed-1794441323503). The after-reply board check is shown the figures that belong
 * to the lesson's subject and level and may draw one:
 *
 *   <board figure kind="torque" with="…">{"armLength":"0.3 m","force":"20 N"}</board>
 *
 * Only the check sees the list: it is long, and the check is where a missing figure is noticed.
 */
import { DIAGRAM_CATALOG, isImplementedKind } from '../diagrams/catalog/manifest';
import type { V2Session } from './types';

type Subject = (typeof DIAGRAM_CATALOG)[number]['subjects'][number];

/** Figures the board draws with a tool of its own, outside the diagram catalogue. They are offered through the
 *  same list and the same block; `fixed` is what makes the tool draw this figure and not another of its kinds. */
export interface ToolFigure { kind: string; tool: string; fixed?: Record<string, unknown>; subjects: Subject[]; when: string; params: string }
export const TOOL_FIGURES: ToolFigure[] = [
  { kind: 'boxplot', tool: 'show_stats', fixed: { type: 'boxplot' }, subjects: ['math'], when: 'One boxplot, or several on one scale to compare groups.', params: 'boxplot:{datasets:[{label, min, q1, median, q3, max, outliers?:[number]}], showValues:true}, title?, xLabel?' },
  { kind: 'distribution_curve', tool: 'show_stats', fixed: { type: 'distribution' }, subjects: ['math'], when: 'A normal, t or chi-square curve with a shaded tail or middle: a p-value, a critical region, a confidence level.', params: 'distribution:{family:normal|t|chi-square, params:{mean, sd} for normal or {df} for t and chi-square, shade?:{type:less|greater|between|outside, a:number, b?:number}, probabilityLabel?:string}, title?' },
  { kind: 'annotated_passage', tool: 'show_annotated_passage', subjects: ['ela', 'social'], when: 'A poem, passage or source with words highlighted and notes on them: a close reading.', params: 'passage:string (the exact text, lines separated by \\n), highlights:[{line:number (1 = first line), text:string (the exact words in that line), note?:string}], marginNotes?:[{line, text}], title?, source?' },
  { kind: 'collision', tool: 'show_collision', subjects: ['physics'], when: 'Two bodies before and after a collision, with their masses and velocities.', params: 'before:[{label, mass:number, velocity:number (positive = right)}], after:[{label, mass, velocity}], type?:elastic|inelastic|perfectly-inelastic, title?' },
  { kind: 'energy_bars', tool: 'show_energy_bars', subjects: ['physics'], when: 'Mechanical energy at two or more moments as stacked bars: how kinetic and potential energy trade.', params: 'positions:[{label, ke?:number, pe?:number, spring?:number, thermal?:number}], title?' },
  { kind: 'reaction_energy', tool: 'show_reaction_coordinate', subjects: ['chemistry', 'biology'], when: 'The energy profile of a reaction: reactants, the activation-energy hump, products; two curves compare a catalyst.', params: 'products_energy:number (negative = exothermic), activation_energies:[number] (one per curve), curve_labels?:[string], reactant_label?, product_label?, units?, title?' },
  { kind: 'molecule', tool: 'show_molecule', subjects: ['chemistry', 'biology'], when: 'The structure of a molecule or ion, drawn from its SMILES.', params: 'smiles:string (e.g. "CC(=O)O" for acetic acid, "CC(=O)[O-]" for acetate), title?' },
  // Connected 2026-11-11 after an inventory of every board tool: these draw what no catalogue figure does.
  // Tried and left out: show_dimensional_check (called F = m·a a mismatch), show_cell_diagram (organelles drawn
  // over one another), show_writing_frame (not seen rendering). A pedigree's carriers draw like the affected, so
  // only affected and unaffected are offered.
  { kind: 'matrix', tool: 'show_matrix', subjects: ['math'], when: 'A matrix, an augmented matrix, or a row operation on one.', params: 'rows:[[string]] (the entries as written), augmented?:number (the column after which the bar goes), rowOperations?:[{description:string, targetRow:number}], title?' },
  { kind: 'fraction_bars', tool: 'show_fraction_bar', subjects: ['math'], when: 'Fractions as shaded bars, circles or grids, to see their size or compare them.', params: 'items:[{numerator:number, denominator:number, label?:string, style?:bar|circle|grid}], showComparison?:boolean, title?' },
  { kind: 'motion_graphs', tool: 'show_motion_diagram', subjects: ['physics'], when: 'Position, velocity and acceleration against time, stacked on one time axis.', params: 'series:[{kind:position|velocity|acceleration, points:[{t:number, value:number}], label?:string}], title?' },
  { kind: 'balanced_equation', tool: 'show_balanced_equation', subjects: ['chemistry'], when: 'A chemical equation, balanced for you from the unbalanced one.', params: 'equation:string (e.g. "Fe + O2 -> Fe2O3"), reactionType?:string, title?' },
  { kind: 'pedigree', tool: 'show_pedigree', subjects: ['biology'], when: 'A family pedigree for a trait, in standard genetics notation.', params: 'individuals:[{id:string, sex:male|female, status?:unaffected|affected, generation:number (1 = top), position:number (0 = leftmost)}], marriages:[{pair:[id, id]}], children:[{parents:[id, id], childId:id}], title?' },
  { kind: 'dna', tool: 'show_dna', subjects: ['biology'], when: 'A DNA double helix, or a strand with its complementary bases and optionally the mRNA made from it.', params: 'mode:helix|base-pairs, sequence?:string (the top strand, e.g. "ATGCATGC"), mrna?:string ("" to transcribe it for you), title?' },
  { kind: 'food_web', tool: 'show_food_web', subjects: ['biology', 'earth'], when: 'Who eats whom in an ecosystem, laid out by trophic level.', params: 'species:[{id:string, label:string, level:number (1 = producer … 5 = apex)}], edges:[{from:prey id, to:predator id}], title?' },
  { kind: 'call_stack', tool: 'show_call_stack', subjects: ['cs'], when: 'The stack of calls at one moment of a program: each frame with its arguments, the newest on top.', params: 'frames:[{function:string (e.g. "factorial(3)"), args?:object, returnValue?:string, highlight?:boolean}] (oldest first), finalReturn?:string, title?' },
];
const TOOL_FIGURE_BY_KIND = new Map(TOOL_FIGURES.map((t) => [t.kind, t]));
/** The tool call a figure block stands for, when its kind is one of the tools above. */
export function toolFigureCall(kind: string, params: Record<string, unknown>): { name: string; args: Record<string, unknown> } | null {
  const t = TOOL_FIGURE_BY_KIND.get(kind);
  return t ? { name: t.tool, args: { ...params, ...(t.fixed ?? {}) } } : null;
}

/** Kinds a plain form already draws (chart, numberline, timeline, ranks, compare, table): one way to draw each thing. */
const HAS_A_PLAIN_FORM = new Set(['number_line', 'bar_chart', 'histogram', 'line_plot', 'hierarchy_pyramid', 'comparison_table', 't_chart', 'historical_timeline', 'kwl_chart', 'frayer_model', 'coordinate_grid']);

/** The catalogue subjects a session's lesson falls under. A science lesson is narrowed by its topic. */
export function catalogueSubjects(session: Pick<V2Session, 'subject' | 'topic'>): Subject[] {
  const subject = session.subject.toLowerCase();
  const about = `${session.topic ?? ''} ${subject}`.toLowerCase();
  if (/^math/.test(subject)) return ['math'];
  if (/^(cs|computer|coding|programming)/.test(subject)) return ['cs'];
  if (/^(ela|english|reading|writing|lit)/.test(subject)) return ['ela'];
  if (/^(ss|social|history|econ|gov|geo|psych)/.test(subject)) return ['social'];
  const picked: Subject[] = [];
  if (/phys|mechanic|kinemat|electr|magnet|optic|wave|thermo|rotation|motion|force|energy|momentum/.test(about)) picked.push('physics');
  if (/chem|stoich|acid|titrat|bond|mole|periodic|equilibr|redox|buffer/.test(about)) picked.push('chemistry');
  if (/bio|anatom|genetic|cell|ecolog|physiol|evolution/.test(about)) picked.push('biology');
  if (/earth|environment|astro|geolog|climate|weather|space/.test(about)) picked.push('earth');
  return picked.length ? picked : ['physics', 'chemistry', 'biology'];
}

/** The figures for this lesson, one per line: its kind, when it fits, and the parameters it takes. Empty when none fit. */
export function figureCatalogueFor(session: Pick<V2Session, 'subject' | 'topic' | 'level'>): string {
  const subjects = catalogueSubjects(session);
  // "AP", "college" and the like are the top of the school range.
  const grade = /^\s*k/i.test(session.level) ? 0 : Number.parseInt(session.level, 10) || 12;
  const lines = DIAGRAM_CATALOG
    .filter((k) => isImplementedKind(k.kind) && !HAS_A_PLAIN_FORM.has(k.kind) && k.subjects.some((s) => subjects.includes(s)))
    .filter((k) => grade >= (k.grades.from === 'k' ? 0 : k.grades.from) - 1)
    .map((k) => `  ${k.kind}: ${k.whenToUse.split(/(?<=[.;])\s/)[0].slice(0, 150)} Params: ${k.paramSchema.slice(0, 300)}`);
  const tools = TOOL_FIGURES.filter((t) => t.subjects.some((s) => subjects.includes(s))).map((t) => `  ${t.kind}: ${t.when} Params: ${t.params}`);
  return [...tools, ...lines].join('\n');
}
