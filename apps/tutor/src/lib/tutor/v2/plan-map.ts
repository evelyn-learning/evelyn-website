/**
 * Tutor brain v2 — the lesson plan as a map (design §4.4).
 *
 * The authored segments become goals with their materials. Nothing here tells
 * the model to stay in a segment, in what order to go, or for how many turns.
 */
import type { LessonPlan, Segment } from '../lesson-plan/types';
import type { GoalStatus, V2State } from './types';

/** Experiment switch: TUTOR_V2X_PLAN_LABELS=off renders the plan without the stretch / more-of-the-same notes. */
const PLAN_LABELS = process.env.TUTOR_V2X_PLAN_LABELS !== 'off';

const KIND_LABEL: Record<string, string> = {
  hook: 'opening idea', concept: 'concept', worked_example: 'worked example', try_yourself: 'practice problem',
  misconception_check: 'common-mistake check', recap: 'recap', extension: PLAN_LABELS ? 'stretch (optional)' : 'extension',
};

function materials(seg: Segment): string[] {
  const s = seg as unknown as Record<string, unknown>;
  const out: string[] = [];
  const str = (k: string, label: string) => { if (typeof s[k] === 'string' && s[k]) out.push(`${label}: ${s[k]}`); };
  const list = (k: string, label: string) => { if (Array.isArray(s[k]) && (s[k] as unknown[]).length) out.push(`${label}:\n${(s[k] as unknown[]).map((x) => `    - ${typeof x === 'string' ? x : JSON.stringify(x)}`).join('\n')}`); };
  str('goal', 'aim'); str('script', 'idea'); list('keyIdeas', 'key ideas');
  str('problem', 'problem'); list('steps', 'solution steps'); str('answer', 'answer'); str('expectedAnswer', 'answer');
  list('hints', 'hints'); str('question', 'question'); list('commonErrors', 'common errors');
  list('mustRemember', 'to remember'); str('advancedQuestion', 'question');
  return out;
}

export function planGoalIds(plan: LessonPlan): string[] {
  return plan.segments.map((s) => s.id);
}

/** The plan, for the session part of the system prompt. Stable for the whole session. */
export function renderPlanMap(plan: LessonPlan): string {
  const los = plan.los.map((lo) => `- ${lo.description}`).join('\n');
  const goals = plan.segments.map((seg) => {
    const m = materials(seg).map((l) => `  ${l}`).join('\n');
    return `[${seg.id}] ${KIND_LABEL[seg.kind] ?? seg.kind}\n${m}`;
  }).join('\n\n');
  return `LESSON PLAN (a map, not a script): ${plan.title}, about ${plan.estimatedMinutes} minutes as authored.\n\nWhat the student should be able to do afterwards:\n${los}\n\nGoals and their materials, in the authored order. Answers are for your checking; the student has not seen them.${PLAN_LABELS ? ' Each practice problem is one example of its kind: a student usually needs several before it is theirs, so write more of the same kind as needed. Stretch material is optional, for a student who has already done the core alone.' : ''}\n\n${goals}`;
}

/** One line per goal, for the facts block. */
export function renderGoalStatus(plan: LessonPlan, goals: V2State['goals']): string {
  return plan.segments.map((seg) => {
    const g = goals[seg.id];
    const status: GoalStatus = g?.status ?? 'not_started';
    return `${seg.id}=${status.replace('_', ' ')}${g?.why ? ` (${g.why})` : ''}`;
  }).join('; ');
}
