/**
 * Tutor brain v2 — the lesson plan as a map (design §4.4).
 *
 * The authored segments become goals with their materials. Nothing here orders the model to stay in a segment or
 * to end the session. A written plan's part names, minutes, turn guides and teacher's notes come along as
 * guidance on how to teach each part: a guide, never a cutoff, and never a say in when the session ends.
 */
import type { LessonPlan, Segment } from '../lesson-plan/types';
import { TUTOR_V2_PASSED_PART_FACT, TUTOR_V2_PLAN_AS_WRITTEN } from '../orchestrator/flags';
import { V2_CLOSING_PAGE, namesPart } from './part-close';
import type { GoalStatus, V2State } from './types';

/** What a written lesson plan says about one part beyond its materials (Segment and its free-form metadata,
 *  lesson-plan/types.ts). Read here once; the map renders it, and the level check and pronunciation practice read it. */
export interface V2Part {
  /** The part's authored name, and that name per language code (`{ ja: '概要' }`). */
  label?: string;
  labelLocalized?: Record<string, string>;
  minutes?: number;
  /** The authored number of exchanges: a guide, not a limit (v2 never cuts a part off at it). */
  maxTurns?: number;
  /** Things to cover or ask in the part, not lines to read. */
  requiredPhrases: string[];
  /** The part is skipped once the student's working level is known. */
  skipWhenLevelKnown: boolean;
  /** Words and sentences to practise saying. */
  pronunciation?: { words: string[]; sentences: string[] };
}

const strings = (x: unknown): string[] => (Array.isArray(x) ? x.filter((v): v is string => typeof v === 'string' && !!v.trim()) : []);
const positive = (x: unknown): number | undefined => (typeof x === 'number' && Number.isFinite(x) && x > 0 ? x : undefined);

export function v2PartOf(seg: Segment): V2Part {
  const md = (seg.metadata && typeof seg.metadata === 'object' ? seg.metadata : {}) as Record<string, unknown>;
  const loc = md.labelLocalized && typeof md.labelLocalized === 'object' && !Array.isArray(md.labelLocalized)
    ? Object.fromEntries(Object.entries(md.labelLocalized as Record<string, unknown>).filter((e): e is [string, string] => typeof e[1] === 'string' && !!e[1].trim()))
    : {};
  const pr = md.pronunciation && typeof md.pronunciation === 'object' ? md.pronunciation as Record<string, unknown> : {};
  const words = strings(pr.words); const sentences = strings(pr.sentences);
  return {
    ...(typeof md.label === 'string' && md.label.trim() ? { label: md.label.trim() } : {}),
    ...(Object.keys(loc).length ? { labelLocalized: loc } : {}),
    ...(positive(seg.estimatedMinutes) ? { minutes: positive(seg.estimatedMinutes) } : {}),
    ...(positive(md.maxTurns) ? { maxTurns: positive(md.maxTurns) } : {}),
    requiredPhrases: strings(seg.requiredPhrases),
    skipWhenLevelKnown: md.skipWhenLevelKnown === true,
    ...(words.length || sentences.length ? { pronunciation: { words, sentences } } : {}),
  };
}

const KIND_LABEL: Record<string, string> = {
  hook: 'opening idea', concept: 'concept', worked_example: 'worked example', try_yourself: 'practice problem',
  misconception_check: 'common-mistake check', recap: 'recap', extension: 'extension',
};

function materials(seg: Segment, part: V2Part, asWritten: boolean): string[] {
  const s = seg as unknown as Record<string, unknown>;
  const out: string[] = [];
  const str = (k: string, label: string) => { if (typeof s[k] === 'string' && s[k]) out.push(`${label}: ${s[k]}`); };
  const list = (k: string, label: string) => { if (Array.isArray(s[k]) && (s[k] as unknown[]).length) out.push(`${label}:\n${(s[k] as unknown[]).map((x) => `    - ${typeof x === 'string' ? x : JSON.stringify(x)}`).join('\n')}`); };
  str('goal', 'aim');
  // v2 is not a script reader: a verbatim script read out turned a part into a speech, not a lesson.
  str('script', asWritten ? 'what to get across (in your own words, not to read out)' : 'idea');
  list('keyIdeas', 'key ideas');
  str('problem', 'problem'); list('steps', 'solution steps'); str('answer', 'answer'); str('expectedAnswer', 'answer');
  list('hints', 'hints'); str('question', 'question'); list('commonErrors', 'common errors');
  list('mustRemember', 'to remember'); str('advancedQuestion', 'question');
  if (!asWritten) return out;
  // An open part's single hint and the form its answer takes were dropped: the tutor made up its own.
  str('hint', 'hint'); str('responseFormat', 'answer form');
  // The author's guidance for the part (how to open it, the correction pattern, what not to do) was dropped, and
  // the brain improvised each part (in the live v1 sessions a past-simple part drifted into present-perfect
  // questions). Lines a note quotes are examples: read as a script, they made the tutor a reader.
  str('teacherNote', 'teacher\'s note (how to teach this part; lines it quotes are examples, in your own words)');
  // Phrases read as lines turned the tutor into a reader; they are points the part must reach.
  if (part.requiredPhrases.length) out.push(`to cover or ask (not lines to read): ${part.requiredPhrases.map((p) => `"${p}"`).join('; ')}`);
  // Without it a learner whose level is known sat through the level check again.
  if (part.skipWhenLevelKnown) out.push('skip this part when the student\'s working level is already known');
  // Without them a pronunciation part practised words the author had not picked.
  if (part.pronunciation?.words.length) out.push(`pronunciation words: ${part.pronunciation.words.join(', ')}`);
  if (part.pronunciation?.sentences.length) out.push(`pronunciation sentences:\n${part.pronunciation.sentences.map((x) => `    - ${x}`).join('\n')}`);
  return out;
}

/** The part's header: its kind, then, for a written plan, its name (also in other languages), minutes and turn
 *  guide. The name keeps the part's subject in view (a grammar part named only "practice problem" drifted into
 *  the other grammar point); minutes and turns let the tutor pace a part the author timed. */
function header(seg: Segment, p: V2Part, asWritten: boolean): string {
  const kind = KIND_LABEL[seg.kind] ?? seg.kind;
  if (!asWritten) return `[${seg.id}] ${kind}`;
  const name = p.label ? `: ${p.label}${p.labelLocalized ? ` (${Object.entries(p.labelLocalized).map(([k, v]) => `${k}: ${v}`).join(', ')})` : ''}` : '';
  const extra = [p.minutes ? `about ${p.minutes} min` : '', p.maxTurns ? `written for about ${p.maxTurns} exchanges` : ''].filter(Boolean).join(', ');
  return `[${seg.id}] ${kind}${name}${extra ? `, ${extra}` : ''}`;
}

export function planGoalIds(plan: LessonPlan): string[] {
  return plan.segments.map((s) => s.id);
}

/** The plan, for the session part of the system prompt. Stable for the whole session. */
export function renderPlanMap(plan: LessonPlan, asWritten: boolean = TUTOR_V2_PLAN_AS_WRITTEN, optionalLine: boolean = TUTOR_V2_PASSED_PART_FACT): string {
  const los = plan.los.map((lo, i) => `${i + 1}. ${lo.description}`).join('\n');
  const parts = plan.segments.map((seg) => ({ seg, part: v2PartOf(seg) }));
  const goals = parts.map(({ seg, part }) => {
    const m = materials(seg, part, asWritten).map((l) => `  ${l}`).join('\n');
    return `${header(seg, part, asWritten)}\n${m}`;
  }).join('\n\n');
  // Generated plans end their recap note with "close the session": read as an order, it sent the tutor to a close
  // the runtime refuses while time is left (constitution: the student and the clock decide the end).
  const notes = asWritten && parts.some(({ seg }) => seg.teacherNote)
    ? ' Teacher\'s notes are the author\'s guidance on how to teach each part. They never decide when the session ends: that stays with the student and the clock, whatever a note says.'
    : '';
  // Without this a part's turn count read as a cutoff and its phrases as a script (the v1 fixed-script failures).
  const guide = asWritten && parts.some(({ part }) => part.maxTurns || part.requiredPhrases.length)
    ? ' The exchanges a part is written for are a guide, not a limit. Scripts and phrases are what to get across, in your own words.'
    : '';
  // Task 6c, ruling 3: "Optional pronunciation practice" was read as the tutor's to skip: the lesson went from the
  // conversation to the summary and the part was never offered (gdi-real-t2 t≈11.6). Only in a plan that has the word.
  const optional = optionalLine && plan.segments.some((seg) => (seg.metadata as { optional?: unknown } | undefined)?.optional === true || /\boptional\b/i.test(materials(seg, v2PartOf(seg), asWritten).join(' ')))
    ? ' A part marked optional is still offered: the student decides whether to do it, not you.'
    : '';
  const written = notes + guide + optional;
  return `LESSON PLAN (a map, not a script): ${plan.title}, about ${plan.estimatedMinutes} minutes as authored.\n\nWhat the student should be able to do afterwards:\n${los}\n\nGoals and their materials, in the authored order. Answers are for your checking; the student has not seen them.${written}\n\n${goals}`;
}

/** One line per goal, for the facts block. */
export function renderGoalStatus(plan: LessonPlan, goals: V2State['goals']): string {
  return plan.segments.map((seg) => {
    const g = goals[seg.id];
    const status: GoalStatus = g?.status ?? 'not_started';
    return `${seg.id}=${status.replace('_', ' ')}${g?.why ? ` (${g.why})` : ''}`;
  }).join('; ');
}

/** A part's names as a page heading might give them: its authored name, its aim, its id. */
const partNames = (seg: Segment): string[] => [v2PartOf(seg).label, (seg as { goal?: string }).goal, seg.id].filter((x): x is string => typeof x === 'string' && !!x.trim());

/** The plan parts the lesson went past without reaching (Task 6c, ruling 3). The board has a page for a later part
 *  (named by its heading, or a summary page for the last part), and the parts between it and the last part reached
 *  before it were never reached: no status recorded, no page of theirs, and not a level-check part with the level
 *  known. Only that stretch: a part earlier in the lesson taught without a status or a page of its own is not named. */
export function v2PassedParts(plan: LessonPlan, state: Pick<V2State, 'goals' | 'board' | 'workingLevel'>): Segment[] {
  const segs = plan.segments;
  if (segs.length < 2) return [];
  const titles = state.board.pages.map((pg) => pg.title);
  const paged = (i: number) => titles.some((t) => partNames(segs[i]!).some((n) => namesPart(n, t)) || (i === segs.length - 1 && V2_CLOSING_PAGE.test(t)));
  let furthest = -1;
  for (let i = segs.length - 1; i > 0; i--) if (paged(i)) { furthest = i; break; }
  if (furthest < 1) return [];
  const reached = (i: number) => {
    const seg = segs[i]!;
    return !!state.goals[seg.id] || paged(i) || (v2PartOf(seg).skipWhenLevelKnown && !!state.workingLevel);
  };
  let from = furthest - 1;
  while (from >= 0 && !reached(from)) from -= 1;
  return segs.slice(from + 1, furthest);
}

/** The facts line naming the parts the lesson went past (v2PassedParts): offer them before the summary. Not once the
 *  time is up, the wrap is due or the student is stopping (`closing`): then the close comes first. `enabled` is the
 *  kill switch. */
export function v2PassedPartFact(plan: LessonPlan | undefined, state: V2State, closing: boolean, enabled: boolean = TUTOR_V2_PASSED_PART_FACT): string[] {
  if (!enabled || !plan || closing || state.closed) return [];
  const passed = v2PassedParts(plan, state);
  if (!passed.length) return [];
  const names = passed.map((seg) => `the ${v2PartOf(seg).label ?? (seg as { goal?: string }).goal ?? seg.id} part`);
  const list = names.length === 1 ? names[0]! : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  const one = passed.length === 1;
  return [`${list[0]!.toUpperCase()}${list.slice(1)} ${one ? 'was' : 'were'} not offered: offer ${one ? 'it' : 'them'} before the summary, unless time is up. The student decides whether to do ${one ? 'it' : 'them'}; if they would rather not, mark ${one ? 'it' : 'them'} skipped`];
}
