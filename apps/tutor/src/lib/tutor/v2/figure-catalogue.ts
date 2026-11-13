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
import { gradeOfLevel, isMathsSubject } from './session-kind';
import { DIAGRAM_CATALOG, isImplementedKind } from '../diagrams/catalog/manifest';
import type { V2Session } from './types';

type Subject = (typeof DIAGRAM_CATALOG)[number]['subjects'][number];

/** Figures the board draws with a tool of its own, outside the diagram catalogue. They are offered through the
 *  same list and the same block; `fixed` is what makes the tool draw this figure and not another of its kinds. */
export interface ToolFigure { kind: string; tool: string; fixed?: Record<string, unknown>; adapt?: (params: Record<string, unknown>) => Record<string, unknown>; subjects: Subject[]; when: string; params: string }

/** A circuit said as what is in series with what and what is in parallel with what, turned into the list of
 *  connected components the board's circuit drawing takes. The only circuit v2 could reach drew every component
 *  round one loop, so "4 Ω and 6 Ω side by side" and "2 Ω in series with a parallel pair" both went up as series
 *  circuits (AP Physics, embed-1794493438983). Nesting cannot describe a wrong wiring: a part is one component,
 *  or a series or parallel group of parts. */
type CircuitPart = Record<string, unknown>;
const CIRCUIT_TYPES: Record<string, string> = { resistor: 'resistor', bulb: 'bulb', lamp: 'bulb', capacitor: 'capacitor', inductor: 'inductor', ammeter: 'ammeter', voltmeter: 'voltmeter', battery: 'battery', cell: 'battery', wire: 'wire' };
export function circuitNetlist(params: Record<string, unknown>): Record<string, unknown> {
  const out: Array<Record<string, unknown>> = []; let n = 0;
  const node = () => `n${++n}`;
  const lay = (part: unknown, from: string, to: string): void => {
    if (Array.isArray(part)) { lay({ series: part }, from, to); return; }
    if (!part || typeof part !== 'object') return;
    const p = part as CircuitPart;
    const group = (v: unknown) => (Array.isArray(v) ? v.filter((x) => x && typeof x === 'object') : []);
    if (Array.isArray(p.series)) {
      const parts = group(p.series); if (!parts.length) return;
      let at = from;
      parts.forEach((x, i) => { const next = i === parts.length - 1 ? to : node(); lay(x, at, next); at = next; });
      return;
    }
    if (Array.isArray(p.parallel)) { for (const x of group(p.parallel)) lay(x, from, to); return; }
    if ('switch' in p) { out.push({ type: /open|off|break|false/i.test(String(p.switch)) ? 'switch-open' : 'switch-closed', from, to, ...(typeof p.label === 'string' ? { label: p.label } : {}) }); return; }
    // The older single-loop form: {type, label}.
    if (typeof p.type === 'string') { const t = p.type === 'switch' ? (p.closed === false ? 'switch-open' : 'switch-closed') : CIRCUIT_TYPES[p.type]; if (t) out.push({ type: t, from, to, ...(p.label ?? p.value ? { label: String(p.label ?? p.value) } : {}) }); return; }
    const key = Object.keys(p).find((k) => CIRCUIT_TYPES[k]);
    if (key) out.push({ type: CIRCUIT_TYPES[key], from, to, ...(p[key] !== true && p[key] != null && String(p[key]) ? { label: String(p[key]) } : {}) });
  };
  // The older form listed everything, battery included, round one loop.
  const listed = Array.isArray(params.components) ? (params.components as CircuitPart[]) : null;
  const battery = params.battery ?? listed?.find((c) => c?.type === 'battery' || c?.type === 'cell')?.label ?? '';
  const load = params.load ?? (listed ? listed.filter((c) => c?.type !== 'battery' && c?.type !== 'cell') : []);
  out.push({ type: 'battery', from: 'minus', to: 'plus', ...(String(battery) ? { label: String(battery) } : {}) });
  lay(load, 'plus', 'minus');
  return { ...(typeof params.title === 'string' ? { title: params.title } : {}), components: out };
}
/** A ray diagram's arguments. The object is drawn at a height that shows the rays: at its true 2 cm beside a
 *  60 cm object distance the three rays lay along the axis (typed run, 2026-11-13). And a diagram put up with a
 *  problem that asks for the image leaves the image out: in the same run it went up under "find the image
 *  distance" with the image drawn and "d_i = 30.0 cm" printed beside it. */
export function rayDiagramArgs(params: Record<string, unknown>): Record<string, unknown> {
  const f = Math.abs(Number(params.focalLength)); const d = Math.abs(Number(params.objectDistance));
  const { find, objectHeight: _given, ...rest } = params; void _given;
  if (!(f > 0) || !(d > 0)) return rest;
  const diverging = /diverging|convex-mirror/.test(String(params.type ?? ''));
  const inv = 1 / (diverging ? -f : f) - 1 / d; const di = Math.abs(inv) < 1e-9 ? Infinity : 1 / inv;
  const extent = Math.max(d, Number.isFinite(di) ? Math.abs(di) : d * 1.5, f * 2.2);
  const m = Number.isFinite(di) ? Math.abs(di / d) : 1;
  return { ...rest, objectHeight: Math.round((0.24 * extent) / Math.max(1, m / 1.5) * 100) / 100, ...(/image|\?|true/i.test(String(find ?? '')) ? { hideImage: true } : {}) };
}
export const TOOL_FIGURES: ToolFigure[] = [
  { kind: 'circuit', tool: 'show_circuit', adapt: circuitNetlist, subjects: ['physics'], when: 'Any circuit a problem or an explanation describes: one loop, branches in parallel, or a mix of the two. Draw it whenever a circuit is being talked about.', params: 'battery:string (e.g. "12 V"), load:PART, title?. A PART is one component, {resistor:"4 Ω"} | {bulb:"lamp 1"} | {capacitor:"100 μF"} | {switch:"open"|"closed"} | {ammeter:"A"} | {voltmeter:"V"}, or a group of parts, {series:[PART, …]} | {parallel:[PART, …]}. A 2 Ω resistor in series with a 4 Ω and a 6 Ω side by side is {"battery":"12 V","load":{"series":[{"resistor":"2 Ω"},{"parallel":[{"resistor":"4 Ω"},{"resistor":"6 Ω"}]}]}}' },
  // Optics (2026-11-13, embed-1794593747478): the catalogue's lens figure drew no rays and took centimetres for
  // pixels, so an object at the focal point came out as a lens with two marks on it; and there was no figure at
  // all for a ray bending at a surface. The ray diagram is the board's full one; the other two are drawn-figures.ts.
  { kind: 'lens_rays', tool: 'show_ray_diagram', adapt: rayDiagramArgs, subjects: ['physics'], when: 'A thin lens or a curved mirror with its object, the principal rays and the image they form. With a problem that asks where the image is, draw it with find:"image" (the set-up alone); draw it in full when the image has been found, or to explain how one forms.', params: 'type:converging|diverging|concave-mirror|convex-mirror, focalLength:number (cm), objectDistance:number (cm), find?:"image" (leave the rays and the image out), title?' },
  { kind: 'refraction', tool: 'show_drawn_figure', fixed: { kind: 'refraction' }, adapt: (params) => ({ params, ...(typeof params.title === 'string' ? { title: params.title } : {}) }), subjects: ['physics'], when: 'A ray of light crossing a flat surface between two materials, with the normal and both angles marked: Snell\'s law, bending toward or away from the normal, total internal reflection. Draw it when a refraction problem is set (find:"?" leaves the second angle as a question mark) and again when its answer is found.', params: 'n1:number (the material the light comes from), n2:number (the material it enters), angle:number (degrees from the normal), media?:[string, string] (their names), find?:"?" (hide the second angle), reflected?:boolean, title?' },
  { kind: 'apparent_depth', tool: 'show_drawn_figure', fixed: { kind: 'apparent_depth' }, adapt: (params) => ({ params, ...(typeof params.title === 'string' ? { title: params.title } : {}) }), subjects: ['physics'], when: 'Why a thing under water looks nearer the surface, or a straw or pencil looks bent: its light bends at the surface and the eye traces it straight back.', params: 'object?:string (what is under the surface, e.g. "pencil tip"), medium?:string ("water"), n?:number (1.33), title?' },
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
// A reply that still writes the single-loop kind is drawn by the same tool.
TOOL_FIGURE_BY_KIND.set('simple_circuit', TOOL_FIGURE_BY_KIND.get('circuit')!);
/** The tool call a figure block stands for, when its kind is one of the tools above. */
export function toolFigureCall(kind: string, params: Record<string, unknown>): { name: string; args: Record<string, unknown> } | null {
  const t = TOOL_FIGURE_BY_KIND.get(kind);
  return t ? { name: t.tool, args: { ...(t.adapt ? t.adapt(params) : params), ...(t.fixed ?? {}) } } : null;
}

/** Kinds a plain form already draws (chart, numberline, timeline, ranks, compare, table): one way to draw each thing. */
const HAS_A_PLAIN_FORM = new Set(['ray_diagram_lens', 'ray_diagram_mirror', 'simple_circuit', 'number_line', 'bar_chart', 'histogram', 'line_plot', 'hierarchy_pyramid', 'comparison_table', 't_chart', 'historical_timeline', 'kwl_chart', 'frayer_model', 'coordinate_grid']);

/** The catalogue subjects a session's lesson falls under. A science lesson is narrowed by its topic. */
export function catalogueSubjects(session: Pick<V2Session, 'subject' | 'topic'>): Subject[] {
  const subject = session.subject.toLowerCase();
  const about = `${session.topic ?? ''} ${subject}`.toLowerCase();
  // A test-prep lesson is the subject its topic names: read by its own label alone, SAT and ACT mathematics were
  // offered the science figures and none of the mathematics ones (audit, 2026-11-13).
  if (isMathsSubject(subject) || (/test|prep|sat|act|gre|gmat|exam/.test(subject) && isMathsSubject(session.topic ?? ''))) return ['math'];
  if (/^(cs|computer|coding|programming)/.test(subject)) return ['cs'];
  if (/^(ela|english|reading|writing|lit)/.test(subject)) return ['ela'];
  if (/^(ss|social|history|econ|gov|geo|psych)/.test(subject)) return ['social'];
  const picked: Subject[] = [];
  if (/phys|mechanic|kinemat|electr|magnet|optic|wave|thermo|rotation|motion|force|energy|momentum/.test(about)) picked.push('physics');
  if (/chem|stoich|acid|titrat|bond|mole|periodic|equilibr|redox|buffer/.test(about)) picked.push('chemistry');
  if (/bio|anatom|genetic|cell|ecolog|ecosystem|food (?:web|chain)|life.?sci|organism|photosynth|heredit|physiol|evolution/.test(about)) picked.push('biology');
  if (/earth|environment|astro|geolog|climate|weather|space/.test(about)) picked.push('earth');
  return picked.length ? picked : ['physics', 'chemistry', 'biology'];
}

/** The few figures the tutor itself is told of, in the session part: those drawn by a tool of their own. Asked
 *  "show me that as a diagram", a tutor who did not know the board draws circuits drew the loop as a cycle of
 *  three boxes, and said "let's look at the picture" over no picture (AP Physics, embed-1794496967839). The long
 *  catalogue stays with the check. */
export function tutorFigureLines(session: Pick<V2Session, 'subject' | 'topic'>): string {
  const subjects = catalogueSubjects(session);
  const mine = TOOL_FIGURES.filter((t) => t.subjects.some((s) => subjects.includes(s)));
  if (!mine.length) return '';
  return `Exact figures the board also draws in this lesson. One is written <board figure kind="its kind">its parameters as one JSON object</board>, and is the right form whenever the thing it draws is what you are talking about:\n${mine.map((t) => `  ${t.kind}: ${t.when} Params: ${t.params}`).join('\n')}`;
}

/** The figures for this lesson, one per line: its kind, when it fits, and the parameters it takes. Empty when none fit. */
export function figureCatalogueFor(session: Pick<V2Session, 'subject' | 'topic' | 'level'>): string {
  const subjects = catalogueSubjects(session);
  // "AP", "college" and the like are the top of the school range.
  // A band ("6-8") is read at its top for this: a figure for grade 8 belongs to a lesson that runs to grade 8.
  // Read at its first number, a grades 6-8 genetics lesson was not offered the Punnett square (audit, 2026-11-13).
  const band = (session.level ?? '').match(/(\d{1,2})\s*(?:-|–|to)\s*(\d{1,2})/);
  const grade = band && Number(band[2]) <= 12 ? Number(band[2]) : gradeOfLevel(session.level) ?? 12;
  const lines = DIAGRAM_CATALOG
    .filter((k) => isImplementedKind(k.kind) && !HAS_A_PLAIN_FORM.has(k.kind) && k.subjects.some((s) => subjects.includes(s)))
    .filter((k) => grade >= (k.grades.from === 'k' ? 0 : k.grades.from) - 1)
    .map((k) => `  ${k.kind}: ${k.whenToUse.split(/(?<=[.;])\s/)[0].slice(0, 150)} Params: ${k.paramSchema.slice(0, 300)}`);
  const tools = TOOL_FIGURES.filter((t) => t.subjects.some((s) => subjects.includes(s))).map((t) => `  ${t.kind}: ${t.when} Params: ${t.params}`);
  return [...tools, ...lines].join('\n');
}
