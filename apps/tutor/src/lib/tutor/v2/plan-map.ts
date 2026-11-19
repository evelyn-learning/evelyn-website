/**
 * Tutor brain v2 — the lesson plan as a map (design §4.4).
 *
 * The authored segments become goals with their materials. Nothing here orders the model to stay in a segment or
 * to end the session. A written plan's part names, minutes, turn guides and teacher's notes come along as
 * guidance on how to teach each part: a guide, never a cutoff, and never a say in when the session ends.
 */
import type { LessonPlan, Segment } from '../lesson-plan/types';
import { TUTOR_V2_PART_ENTERED, TUTOR_V2_PASSED_PART_CLOSE, TUTOR_V2_PASSED_PART_FACT, TUTOR_V2_PLAN_AS_WRITTEN, TUTOR_V2_PRONUNCIATION_PAGE } from '../orchestrator/flags';
import { V2_CLOSING_PAGE, headingWords } from './part-close';
import { stripBoardBlocks } from './board-inline';
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
/** Task 7a: whether a page heading is the part's page (pageOfPart), for part-flow.ts. */
export const v2IsPageOfPart = pageOfPart;

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
  // Task 6g: a part offered twice and not taken up is not offered again (v2PartOfferFacts names it as next time).
  const out = v2OfferedOut(plan, state);
  // Task 7f B: a part left out for time is not offered (it is named as next time).
  const passed = v2PassedParts(plan, state).filter((seg) => !out.has(seg.id) && !state.timeFit?.dropped.includes(seg.id));
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
  const out = v2OfferedOut(plan, state);
  // Task 7f B: near the close, a part left out for time is not offered (the time-fit line names it as next time).
  const left = v2UnreachedAtClose(plan, state).filter((seg) => !out.has(seg.id) && (phase === 'closing' || !state.timeFit?.dropped.includes(seg.id)));
  if (!left.length) return [];
  const list = partNames(left); const one = left.length === 1; const it = one ? 'it' : 'them';
  const head = `${list[0]!.toUpperCase()}${list.slice(1)} ${one ? 'was' : 'were'} not reached`;
  return [phase === 'closing'
    ? `${head}, and there is no time for ${it} now: in your summary, name ${it} in one short line as something for next time`
    : `${head}: before the summary, offer ${it} in one line if the time allows; if not, name ${it} in your summary, in one short line, as something for next time`];
}

/** With time left, the offer in place of a held summary page, when parts were not reached (v2UnreachedAtClose): it names
 *  them and lets the student choose, in one line. Null when nothing was missed. */
export function v2UnreachedOffer(plan: LessonPlan | undefined, state: Pick<V2State, 'goals' | 'board' | 'workingLevel'> & { history?: V2State['history']; timeFit?: V2State['timeFit'] }, enabled: boolean = TUTOR_V2_PASSED_PART_CLOSE): string | null {
  if (!enabled || !plan) return null;
  // Task 6g: not a part already offered twice and not taken up. Task 7f B: nor one left out for time.
  const out = state.history ? v2OfferedOut(plan, { ...state, history: state.history }) : new Set<string>();
  const left = v2UnreachedAtClose(plan, state).filter((seg) => !out.has(seg.id) && !state.timeFit?.dropped.includes(seg.id));
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
  const missing = v2MissedAtClose(plan, state).filter(v2PartIsOptional).filter((seg) => !v2PartNamedIn(seg, said));
  if (!missing.length) return null;
  const names = partNames(missing).replace(/\bthe (\S)/g, (_m, c: string) => `the ${c.toLowerCase()}`);
  return `We didn't get to ${names} today, so that's for next time.`;
}

/** Task 6f (FRAME_NAMES_OPENED, fix round 2): the authored name of the plan part whose page `title` is, or undefined.
 *  The part-change frame names the held page by it, at once. */
export function v2PagePartLabel(plan: LessonPlan | undefined, title: string): string | undefined {
  if (!plan) return undefined;
  const seg = plan.segments.find((x) => !!v2PartOf(x).label && pageOfPart(x, title));
  return seg ? v2PartOf(seg).label : undefined;
}

/** Task 6f: the line naming every plan part not reached as next time (v2UnreachedAtClose), said where a summary the reply
 *  has already begun opens, in place of the offer to do them first. Null when none was missed. */
export function v2NextTimeAllLine(plan: LessonPlan | undefined, state: Pick<V2State, 'goals' | 'board' | 'workingLevel'>, said: string = ''): string | null {
  if (!plan) return null;
  // Task 6g: parts the words already said name are left out (`said`: a reply complete before the line goes in).
  const left = v2MissedAtClose(plan, state).filter((seg) => !said || !v2PartNamedIn(seg, said));
  if (!left.length) return null;
  return `We didn't get to ${partNames(left).replace(/\bthe (\S)/g, (_m, c: string) => `the ${c.toLowerCase()}`)} today, so that's for next time.`;
}

/** Whether `text` names a plan part: every word of its authored name (by its first five letters), or its name in another
 *  language. A part with no name words counts as named (nothing to say it by). */
export function v2PartNamedIn(seg: Segment, text: string): boolean {
  const p = v2PartOf(seg); const label = p.label ?? '';
  return headingWords(label).every((w) => text.toLowerCase().includes(w.slice(0, 5))) || Object.values(p.labelLocalized ?? {}).some((n) => text.includes(n));
}

/** Task 7s fix round 1 (M1, controller ruling): the runtime's pronunciation cards (turn.ts writePronCards, ids `…_pronN`) show the
 *  word to say at the arm, but enter nothing: a scored attempt is what enters the pronunciation part (practiceSaid). */
export const V2_PRON_CARD_ID = /_pron\d+$/;
export function v2PageHoldsWork(items: ReadonlyArray<{ id: string }>, enabled: boolean = TUTOR_V2_PRONUNCIATION_PAGE): boolean {
  return enabled ? items.some((it) => !V2_PRON_CARD_ID.test(it.id)) : items.length > 0;
}
/** Task 7i (PART_ENTERED): a page of the part that holds something (a card, a note, a question). */
/** Task 7k fix round 1 (I1, `skip`): pages opened by a practice visit (state.visitPages) are not the lesson entering the part. */
export function v2PartPageHolds(seg: Segment, board: V2State['board'], skip: readonly number[] = []): boolean {
  return board.pages.some((pg, i) => v2PageHoldsWork(pg.items) && !skip.includes(i) && pageOfPart(seg, pg.title));
}

/** Task 7i (PART_ENTERED): the lesson entered the part: a goal of it shown or demonstrated, its page holds something, or practice
 *  was counted in it; never a part left out for time. A page alone is not entered: mic test 3 (embed-1794967959470) opened an
 *  empty "Pronunciation" page in minute 1, and it counted as taught, green and completed for the whole lesson. */
/** Task 7k fix round 1 (I1): a page a practice visit opened (state.visitPages) never counts: a visit never moves the lesson. */
export function v2PartEntered(seg: Segment, state: Pick<V2State, 'goals' | 'board'> & Partial<Pick<V2State, 'practiceSaid' | 'timeFit' | 'visitPages'>>): boolean {
  if (state.timeFit?.dropped.includes(seg.id)) return false;
  const g = state.goals[seg.id]?.status;
  return g === 'shown' || g === 'demonstrated' || (state.practiceSaid?.[seg.id] ?? 0) > 0 || v2PartPageHolds(seg, state.board, state.visitPages);
}

/** Task 6g: a part taken up: a status of shown or demonstrated, or a page of its own. Task 7i (PART_ENTERED): entered
 *  (v2PartEntered), not a page alone. */
const takenUp = (seg: Segment, state: Pick<V2State, 'goals' | 'board'> & Partial<Pick<V2State, 'practiceSaid' | 'timeFit'>>, entered: boolean = TUTOR_V2_PART_ENTERED) => {
  if (entered) return v2PartEntered(seg, state);
  const g = state.goals[seg.id]?.status;
  return g === 'shown' || g === 'demonstrated' || state.board.pages.some((pg) => pageOfPart(seg, pg.title));
};

/** The plan parts the close names as next time (Task 6g, PASSED_PART_CLOSE): those not reached (v2UnreachedAtClose), and
 *  an optional part not taken up wherever it stands: no page of its own and no shown or demonstrated status, so marked
 *  skipped or never marked. Tester B's lesson skipped pronunciation and named it nowhere (v2audio-6f); a part the model
 *  marks skipped counted as reached, and was never named. Same plans as v2UnreachedAtClose: every part named. `skipped`
 *  false: v2UnreachedAtClose alone, as before. */
export function v2MissedAtClose(plan: LessonPlan, state: Pick<V2State, 'goals' | 'board' | 'workingLevel'>, skipped: boolean = TUTOR_V2_PASSED_PART_CLOSE): Segment[] {
  const left = v2UnreachedAtClose(plan, state);
  const segs = plan.segments;
  if (!skipped || segs.length < 2 || !segs.every((seg) => !!v2PartOf(seg).label)) return left;
  return segs.filter((seg, i) => left.includes(seg) || (i < segs.length - 1 && v2PartIsOptional(seg) && !takenUp(seg, state)));
}

/** The most times an optional part is offered while it is not taken up (Task 6g): once, and once more. Tester A heard
 *  pronunciation offered four times in nine turns (v2audio-6f T58, T68, T72, T74). */
export const V2_MAX_PART_OFFERS = 2;
const ASKS_END = /(?:[?？]|か[。．]?)["'」』）)]*\s*$/;
const SENTENCES = /(?<=[.!?]["'”’)]*)\s+|(?<=[。！？][」』)）"”]*)\s*/;
const historyText = (h: V2State['history'][number]) => (typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '));

/** How many of the tutor's replies offered `seg`: a sentence that asks and names the part ("Would you like to practise
 *  your pronunciation next…?", 「…発音の練習をするか、どちらにしますか？」), or the runtime's own offer ("Before the summary,
 *  there is still the pronunciation part. Would you like to do it now…?"). */
export function v2PartOffers(seg: Segment, history: V2State['history']): number {
  // Fix round 1 (minor 2): a part with no name words and no localized name has nothing to be offered by (v2PartNamedIn
  // counts it as named everywhere, and every question would have been an offer).
  const p = v2PartOf(seg);
  if (!headingWords(p.label ?? '').length && !Object.keys(p.labelLocalized ?? {}).length) return 0;
  let n = 0;
  for (const h of history) {
    if (h.role !== 'assistant') continue;
    const xs = stripBoardBlocks(historyText(h)).split(SENTENCES).map((x) => x.trim()).filter(Boolean);
    if (xs.some((x, i) => ASKS_END.test(x) && ((V2_OFFER_SHAPE.test(x) && v2PartNamedIn(seg, x)) || (i > 0 && /^Before the summary, there is still\b/.test(xs[i - 1]!) && v2PartNamedIn(seg, xs[i - 1]!))))) n += 1;
  }
  return n;
}
/** Fix round 1 (minor 2): an offer or a choice, not any question that names the part ("How was your pronunciation
 *  class?"). */
// Fix round 2 (minor): "or" only as a choice about doing the part ("…, or skip it?", "…, or move on?").
export const V2_OFFER_SHAPE = /\b(?:would you like|do you want|want to|shall we|how about|or (?:skip|move on|go on|keep|continue|go straight|finish|stop|leave))\b|どちら|しますか|しましょうか|やりますか|やってみますか|どうですか|それとも/i;

/** The optional parts not taken up that have been offered V2_MAX_PART_OFFERS times or more: not offered again. */
export function v2OfferedOut(plan: LessonPlan, state: Pick<V2State, 'goals' | 'board' | 'history'>, enabled: boolean = TUTOR_V2_PASSED_PART_CLOSE): Set<string> {
  const out = new Set<string>();
  if (!enabled || plan.segments.length < 2 || !plan.segments.every((seg) => !!v2PartOf(seg).label)) return out;
  for (const seg of plan.segments.slice(0, -1)) if (v2PartIsOptional(seg) && !takenUp(seg, state) && v2PartOffers(seg, state.history) >= V2_MAX_PART_OFFERS) out.add(seg.id);
  return out;
}

/** The facts lines counting the offers of an optional part not taken up (Task 6g): offered once, it may be offered once
 *  more, before the summary; offered twice, it is not offered again and is named in the summary as next time. Not once the
 *  lesson has closed. `enabled` is the kill switch (PASSED_PART_CLOSE). */
export function v2PartOfferFacts(plan: LessonPlan | undefined, state: V2State, enabled: boolean = TUTOR_V2_PASSED_PART_CLOSE): string[] {
  if (!enabled || !plan || state.closed || plan.segments.length < 2 || !plan.segments.every((seg) => !!v2PartOf(seg).label)) return [];
  const lines: string[] = [];
  for (const seg of plan.segments.slice(0, -1)) {
    if (!v2PartIsOptional(seg) || takenUp(seg, state)) continue;
    const n = v2PartOffers(seg, state.history);
    if (!n) continue;
    const name = `The ${v2PartOf(seg).label} part`;
    lines.push(n >= V2_MAX_PART_OFFERS
      ? `${name} has been offered ${n} times and not taken up: do not offer it again; name it in your summary, in one short line, as something for next time`
      : `${name} has been offered once and not taken up: offer it at most once more, and only before the summary; if they do not take it up then, name it in your summary as something for next time`);
  }
  return lines;
}
