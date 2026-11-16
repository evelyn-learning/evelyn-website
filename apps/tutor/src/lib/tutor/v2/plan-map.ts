/**
 * Tutor brain v2 — the lesson plan as a map (design §4.4).
 *
 * The authored segments become goals with their materials. Nothing here orders the model to stay in a segment or
 * to end the session. A written plan's part names, minutes, turn guides and teacher's notes come along as
 * guidance on how to teach each part: a guide, never a cutoff, and never a say in when the session ends.
 */
import type { LessonPlan, Segment } from '../lesson-plan/types';
import { TUTOR_V2_PLAN_AS_WRITTEN } from '../orchestrator/flags';
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
export function renderPlanMap(plan: LessonPlan, asWritten: boolean = TUTOR_V2_PLAN_AS_WRITTEN): string {
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
  const written = notes + guide;
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
