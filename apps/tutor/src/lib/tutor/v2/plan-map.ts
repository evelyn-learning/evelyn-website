/**
 * Tutor brain v2 — the lesson plan as a map (design §4.4).
 *
 * The authored segments become goals with their materials. Nothing here orders the model to stay in a segment or
 * to end the session. A written plan's part names, minutes, turn guides and teacher's notes come along as
 * guidance on how to teach each part: a guide, never a cutoff, and never a say in when the session ends.
 */
import type { LessonPlan, Segment } from '../lesson-plan/types';
import { TUTOR_V2_PASSED_PART_CLOSE, TUTOR_V2_PASSED_PART_FACT, TUTOR_V2_PLAN_AS_WRITTEN } from '../orchestrator/flags';
import { V2_CLOSING_PAGE, headingWords } from './part-close';
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
  // conversation to the summary and the part was never offered (gdi-real-t2 t≈11.6). Only in a plan with a part marked
  // optional (fix round 1: "optional" anywhere, as in "this part is not optional", set it off).
  const optional = optionalLine && plan.segments.some(v2PartIsOptional)
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

/** A part marked optional: `metadata.optional`, a name that says so, or an aim or note that opens with the word
 *  ("Optional pronunciation practice. …"). Not a part whose text only mentions it ("This is a core part, not optional"). */
export function v2PartIsOptional(seg: Segment): boolean {
  if ((seg.metadata as { optional?: unknown } | undefined)?.optional === true) return true;
  if (/\boptional\b/i.test(v2PartOf(seg).label ?? '')) return true;
  const s = seg as unknown as Record<string, unknown>;
  return ['goal', 'teacherNote', 'script'].some((k) => typeof s[k] === 'string' && /^\s*optional\b/i.test(s[k] as string));
}

const squash = (x: string) => x.replace(/\s+/g, '').toLowerCase();
/** Whether a page heading is the part's page: every word of the part's authored name is in it (namesPart's half was
 *  too loose here: "Talking about your work" named "Your job"), or it equals a localized name. */
const pageOfPart = (seg: Segment, title: string): boolean => {
  const p = v2PartOf(seg);
  const want = p.label ? headingWords(p.label) : [];
  const have = headingWords(title);
  const all = want.length > 0 && want.every((w) => have.some((x) => x === w || (w.length >= 5 && x.startsWith(w.slice(0, 5)))));
  return all || Object.values(p.labelLocalized ?? {}).some((n) => squash(n) === squash(title));
};

/** The plan parts the lesson went past without reaching (Task 6c, ruling 3). The board has a page for a later part,
 *  and the parts between it and the last part reached before it were never reached: no status recorded, no page of
 *  theirs, and not a level-check part with the level known. Only that stretch: a part earlier in the lesson taught
 *  without a status or a page of its own is not named.
 *  Fix round 1 (I1), against false alarms on plans written for other lessons: only a plan whose every part has an
 *  authored name; a page is matched by that name only (not the id or aim: "intro" and "examples" matched loosely); a
 *  summary heading stands for the last part only when it is the last page opened (an early "Quick recap" page made
 *  every later part look passed over). */
export function v2PassedParts(plan: LessonPlan, state: Pick<V2State, 'goals' | 'board' | 'workingLevel'>): Segment[] {
  const segs = plan.segments;
  if (segs.length < 2 || !segs.every((seg) => !!v2PartOf(seg).label)) return [];
  const pages = state.board.pages;
  const lastTitle = pages.length ? pages[pages.length - 1]!.title : '';
  const paged = (i: number) => pages.some((pg) => pageOfPart(segs[i]!, pg.title)) || (i === segs.length - 1 && V2_CLOSING_PAGE.test(lastTitle));
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
  const names = passed.map((seg) => `the ${v2PartOf(seg).label} part`);
  const list = names.length === 1 ? names[0]! : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  const one = passed.length === 1;
  return [`${list[0]!.toUpperCase()}${list.slice(1)} ${one ? 'was' : 'were'} not offered: offer ${one ? 'it' : 'them'} before the summary, unless time is up. The student decides whether to do ${one ? 'it' : 'them'}; if they would rather not, mark ${one ? 'it' : 'them'} skipped`];
}

/** The plan parts not reached as the lesson heads for its close (Task 6e): after the furthest part reached, up to but not
 *  including the last part (the close is the last part's own). Reached: a status recorded, a page of its own, or a
 *  level-check part with the level known. Same plans as v2PassedParts: every part named. v2PassedParts needs a later page
 *  already up, and the summary's page comes with the close itself, so a lesson that ran short of time went to its
 *  summary with the pronunciation part neither offered nor named (v2audio tester B, about 17 of 20 min). */
export function v2UnreachedAtClose(plan: LessonPlan, state: Pick<V2State, 'goals' | 'board' | 'workingLevel'>): Segment[] {
  const segs = plan.segments;
  if (segs.length < 2 || !segs.every((seg) => !!v2PartOf(seg).label)) return [];
  const pages = state.board.pages;
  const reached = (i: number) => {
    const seg = segs[i]!;
    return !!state.goals[seg.id] || pages.some((pg) => pageOfPart(seg, pg.title)) || (v2PartOf(seg).skipWhenLevelKnown && !!state.workingLevel);
  };
  const before = segs.length - 1;
  let furthest = -1;
  for (let i = before - 1; i >= 0; i--) if (reached(i)) { furthest = i; break; }
  if (furthest < 0) return [];
  return segs.slice(furthest + 1, before);
}

const partNames = (segs: Segment[]) => {
  const names = segs.map((seg) => `the ${v2PartOf(seg).label} part`);
  return names.length === 1 ? names[0]! : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
};

/** Near or at the close, the parts not reached (v2UnreachedAtClose) are not passed over in silence. `phase` 'near' (the
 *  box's last fifth): offer them in one line before the summary if the time allows, else name them in it as next time.
 *  'closing' (the time is up, the wrap is due or the student is stopping): name them in the summary as next time. Not
 *  once the lesson has closed. `enabled` is the kill switch. */
export function v2UnreachedAtCloseFact(plan: LessonPlan | undefined, state: V2State, phase: 'near' | 'closing' | null, enabled: boolean = TUTOR_V2_PASSED_PART_CLOSE): string[] {
  if (!enabled || !plan || !phase || state.closed) return [];
  const left = v2UnreachedAtClose(plan, state);
  if (!left.length) return [];
  const list = partNames(left); const one = left.length === 1; const it = one ? 'it' : 'them';
  const head = `${list[0]!.toUpperCase()}${list.slice(1)} ${one ? 'was' : 'were'} not reached`;
  return [phase === 'closing'
    ? `${head}, and there is no time for ${it} now: in your summary, name ${it} in one short line as something for next time`
    : `${head}: before the summary, offer ${it} in one line if the time allows; if not, name ${it} in your summary, in one short line, as something for next time`];
}

/** With time left, the offer in place of a held summary page, when parts were not reached (v2UnreachedAtClose): it names
 *  them and lets the student choose, in one line. Null when nothing was missed. */
export function v2UnreachedOffer(plan: LessonPlan | undefined, state: Pick<V2State, 'goals' | 'board' | 'workingLevel'>, enabled: boolean = TUTOR_V2_PASSED_PART_CLOSE): string | null {
  if (!enabled || !plan) return null;
  const left = v2UnreachedAtClose(plan, state);
  if (!left.length) return null;
  const list = partNames(left).replace(/\bthe (\S)/g, (_m, c: string) => `the ${c.toLowerCase()}`);
  const one = left.length === 1;
  return `Before the summary, there is still ${list}. Would you like to do ${one ? 'it' : 'them'} now, or go straight to the summary?`;
}

/** The line naming an optional plan part that was not reached, said before a goodbye that does not name it (Task 6e fix
 *  round 1, F3): one learner's stop goodbye (gdi-real-josh) named the past simple and the conversation as next time, not pronunciation, and
 *  tester B's summary did not name it at all. Only optional parts (a part the student chooses, which a close passes over
 *  most easily); null when none is unreached or `said` already names each. */
export function v2NextTimeLine(plan: LessonPlan | undefined, state: Pick<V2State, 'goals' | 'board' | 'workingLevel'>, said: string): string | null {
  if (!plan) return null;
  const missing = v2UnreachedAtClose(plan, state).filter(v2PartIsOptional).filter((seg) => {
    const p = v2PartOf(seg); const label = p.label ?? '';
    const named = headingWords(label).every((w) => said.toLowerCase().includes(w.slice(0, 5))) || Object.values(p.labelLocalized ?? {}).some((n) => said.includes(n));
    return !named;
  });
  if (!missing.length) return null;
  const names = partNames(missing).replace(/\bthe (\S)/g, (_m, c: string) => `the ${c.toLowerCase()}`);
  return `We didn't get to ${names} today, so that's for next time.`;
}

/** Task 6f: the part a part-change frame names for a held page headed `title`. The learner heard "Next is your job." (gdi-real-james T20) from a
 *  reply that wrote a "Your job" page and, in the same reply, marked the job part done (set_goal_status); the next reply
 *  opened the present perfect. When the held page is the page of a plan part already marked (before this reply, or by it:
 *  `markedNow`), the frame names the plan's next part not reached instead (its authored name), or nothing (null: "Shall
 *  we go on?" alone) when there is none. Undefined: name the held page, as before (no plan, a page of no part, or a part
 *  not marked). */
/** A goal marked as having happened (fix round 1, minor 5): shown, demonstrated or skipped; not "not started". */
const MARKED: ReadonlySet<string> = new Set(['shown', 'demonstrated', 'skipped']);
const markedIn = (state: Pick<V2State, 'goals'>, markedNow: readonly string[]) => (id: string) => MARKED.has(state.goals[id]?.status ?? '') || markedNow.includes(id);
/** The index of the plan part (with an authored name) whose page `title` is, or -1. */
const partAt = (plan: LessonPlan, title: string) => plan.segments.findIndex((seg) => !!v2PartOf(seg).label && pageOfPart(seg, title));

/** Task 6f fix round 1 (I1): whether the frame for a held page headed `title` must wait for the reply to be complete: the
 *  page is a plan part's and that part is not marked yet, so this reply may still mark it (set_goal_status). Any other
 *  held page (no plan, a page of no part, a part already marked) is named at once. */
export function v2FramePartPending(plan: LessonPlan | undefined, state: Pick<V2State, 'goals'>, title: string): boolean {
  if (!plan) return false;
  const at = partAt(plan, title);
  return at >= 0 && !markedIn(state, [])(plan.segments[at]!.id);
}

export function v2FramePartLabel(plan: LessonPlan | undefined, state: Pick<V2State, 'goals' | 'board' | 'workingLevel'>, title: string, markedNow: readonly string[]): string | null | undefined {
  if (!plan) return undefined;
  const segs = plan.segments;
  const at = partAt(plan, title);
  if (at < 0) return undefined;
  const marked = markedIn(state, markedNow);
  if (!marked(segs[at]!.id)) return undefined;
  const reached = (seg: Segment) => marked(seg.id) || state.board.pages.some((pg) => pageOfPart(seg, pg.title)) || (v2PartOf(seg).skipWhenLevelKnown && !!state.workingLevel);
  const next = segs.slice(at + 1).find((seg) => !reached(seg));
  return next ? (v2PartOf(next).label ?? null) : null;
}

/** Task 6f: the line naming every plan part not reached as next time (v2UnreachedAtClose), said where a summary the reply
 *  has already begun opens, in place of the offer to do them first. Null when none was missed. */
export function v2NextTimeAllLine(plan: LessonPlan | undefined, state: Pick<V2State, 'goals' | 'board' | 'workingLevel'>): string | null {
  if (!plan) return null;
  const left = v2UnreachedAtClose(plan, state);
  if (!left.length) return null;
  return `We didn't get to ${partNames(left).replace(/\bthe (\S)/g, (_m, c: string) => `the ${c.toLowerCase()}`)} today, so that's for next time.`;
}
