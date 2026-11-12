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
    .map((k) => `  ${k.kind}: ${k.whenToUse.split(/(?<=[.;])\s/)[0].slice(0, 150)} Params: ${k.paramSchema.slice(0, 260)}`);
  return lines.join('\n');
}
