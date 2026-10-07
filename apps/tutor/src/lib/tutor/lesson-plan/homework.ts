/**
 * Homework-help mode: wrap a student's own enumerated problems (see
 * `enumerate-problems.ts`) into the fields a `LessonPlan` needs so the
 * existing orchestrator can drive a session over them, one at a time,
 * instead of a freestyle-generated lesson about the topic.
 *
 * The plan built around these fields carries exactly ONE learning
 * objective — a wrapper LO standing in for "work through what you
 * brought" — because homework-help isn't teaching a concept the plan
 * decomposes into several LOs; it's a single activity over externally
 * supplied problems. The problems themselves live in `metadata.problems`
 * (read back via `homeworkProblemsOf`), not as separate LOs or segments,
 * so Task 4/5 can build whatever segment shape they need from the same
 * source list without this module guessing at it.
 */

import type { HomeworkProblem, EnumerateResult } from './enumerate-problems';
import type { LearningObjective } from './types';
import { ungroundedRelations, verbatimText } from './problem-text';
import { TUTOR_HOMEWORK_VERBATIM } from '../orchestrator/turn-round-flags';

/** `metadata.kind` marking a plan as homework-help, read by consumers
 *  that need to branch on it (the brain block, the client). */
export const HOMEWORK_PLAN_KIND = 'homework-help' as const;

/**
 * The wrapper LO shape a homework plan's `los[0]` takes — every field
 * `parseStage1Los` (generate-from-text.ts:211-227) fills on a normal
 * generated LO, plus `estimatedMinutes` since this LO stands in for the
 * plan's one and only activity rather than one of several.
 */
export interface LessonPlanLo extends LearningObjective {
  estimatedMinutes: number;
}

/** Suffix of a homework plan's single wrapper LO id. */
export const HOMEWORK_LO_ID_SUFFIX = 'homework-lo-1' as const;

/** The plan-scoped wrapper LO id for a homework plan. */
export function homeworkLoIdFor(planId: string): string {
  return `${planId}.${HOMEWORK_LO_ID_SUFFIX}`;
}

/** Fixed time budget for the wrapper LO — homework-help is one activity,
 *  not a paced multi-LO lesson, so this is a reasonable single estimate
 *  rather than a per-problem sum. */
const HOMEWORK_LO_ESTIMATED_MINUTES = 30;

export interface HomeworkPlanMetadata {
  kind: typeof HOMEWORK_PLAN_KIND;
  problems: HomeworkProblem[];
}

export interface HomeworkPlanFields {
  metadata: HomeworkPlanMetadata;
  los: [LessonPlanLo];
}

/**
 * Read the enumerated problems back off a plan, or null when the plan
 * isn't homework-help (or the field is missing/malformed). Pure — takes
 * only the `metadata` slice a caller has, so it works on a `LessonPlan`,
 * a partial plan under construction, or a plain object off the wire.
 */
export function homeworkProblemsOf(plan: { metadata?: Record<string, unknown> }): HomeworkProblem[] | null {
  const problems = plan.metadata?.problems;
  if (!Array.isArray(problems) || problems.length === 0) return null;
  const out: HomeworkProblem[] = [];
  for (const p of problems) {
    if (!p || typeof p !== 'object') continue;
    const it = p as Record<string, unknown>;
    if (typeof it.n !== 'number' || typeof it.text !== 'string' || !it.text.trim()) continue;
    out.push({ n: it.n, text: it.text });
  }
  return out.length > 0 ? out : null;
}

/**
 * Build the `metadata` and `los` fields a homework-help `LessonPlan`
 * needs. The caller (Task 4's plan-generate route) spreads these into a
 * full `LessonPlan` alongside `id` / `title` / `curriculum` / `grade` /
 * `subject` / `segments` / `schemaVersion` — this module only owns the
 * two fields that are specific to homework-help.
 */
export function buildHomeworkPlanFields(
  problems: HomeworkProblem[],
  topicSummary: string,
  planId: string,
): HomeworkPlanFields {
  const lo: LessonPlanLo = {
    // Namespaced under the plan id (like generated LOs, `${planId}.lo-N`):
    // everything downstream keys on the LO id — stored-plan lookup by LO,
    // practice derivedTopic, bank items, evidence events, learner-model
    // mastery — so a fixed literal would pool every homework plan's
    // evidence and bank items under one key.
    id: homeworkLoIdFor(planId),
    description: 'Work the uploaded problems in order.',
    shortTitle: topicSummary,
    estimatedMinutes: HOMEWORK_LO_ESTIMATED_MINUTES,
  };
  return {
    metadata: { kind: HOMEWORK_PLAN_KIND, problems },
    los: [lo],
  };
}

/** Round 3 (A1, 2026-09-23 live check): a homework-help upload is extracted but
 *  never classified — the classifier judged a real 10-problem worksheet
 *  `unusable` and 422'd it. Extraction failures still refuse. Every other goal
 *  keeps the classifier gate unchanged. */
export function shouldClassifyMaterial(goal: string | undefined): boolean {
  return goal !== HOMEWORK_PLAN_KIND;
}

export type HomeworkPlanDecision =
  | { kind: 'homework'; problems: HomeworkProblem[] }
  | { kind: 'normal'; reason: 'enumeration_failed_open' };

/** Round 3 (A2): only a REAL enumeration makes a homework plan. A fail-open
 *  result (typed concept question, unusable text) is one "problem" holding the
 *  whole input, which produced a one-problem plan with no practice — those
 *  requests take the normal topic path instead. */
export function homeworkPlanDecision(r: EnumerateResult): HomeworkPlanDecision {
  if (r.failedOpen || r.problems.length === 0) return { kind: 'normal', reason: 'enumeration_failed_open' };
  return { kind: 'homework', problems: r.problems };
}

const LIST_MARKER = /(?:^|\s)(?:\d{1,2}|[a-hA-H])[.)]\s/g;
const OPERATOR = /[=<>+−×÷/^]/;

/** Round 4 (E1, 2026-09-24 live check): typed homework-help text is only worth
 *  a problem split when it LOOKS like problems — ≥2 lines, a numbered/lettered
 *  list, digits with an operator/relation, or ≥2 questions. A plain topic or
 *  single question skips the extra Haiku call (it pushed typed starts past the
 *  portal's timeout) and goes straight to normal generation. Pure. */
export function hasProblemSignals(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.split(/\r?\n/).filter((l) => l.trim()).length >= 2) return true;
  if ((t.match(LIST_MARKER) ?? []).length >= 2) return true;
  if (/\d/.test(t) && OPERATOR.test(t)) return true;
  return (t.match(/\?/g) ?? []).length >= 2;
}

/** Final fix wave (I2): a host may prefix the typed request with its own
 *  focus preamble (multi-line objective bullets) and end with
 *  `Topic: <topic>`. The preamble is the host's instruction, not the
 *  student's problems — keep only what follows the LAST `\nTopic: ` marker.
 *  No marker ⇒ unchanged. Pure. */
const TOPIC_MARKER = '\nTopic: ';
export function stripFocusPreamble(text: string): string {
  const i = text.lastIndexOf(TOPIC_MARKER);
  return i >= 0 ? text.slice(i + TOPIC_MARKER.length) : text;
}

/** Final fix wave (I2): what typed homework enumeration looks at — the
 *  request's own `topic` (the student's / normalised topic) when present,
 *  else the typed text with any focus preamble stripped. Pure. */
export function typedEnumerationText(requestTopic: string | undefined, text: string): string {
  return requestTopic?.trim() || stripFocusPreamble(text);
}

// ── 2026-10-05: typed homework-help text is the student's own material ─────
//
// 21 scripted Homework Help sessions (GreenApple sandbox): `hasProblemSignals`
// returned false for 6 of the 21 typed questions — every FRQ / SAQ / essay
// prompt, a statistics question carrying its own data set, an English
// sentence to fix — and each got a multi-objective lesson with INVENTED
// examples (the student's data 4, 8, 15, 16, 23, 42 became "45, 30, 60, 50,
// 40, 55"); one got an objective picker. For this goal the student's text is
// the material unless it is unmistakably a bare topic with no task.

/** "(a)", "(b)", "(1)", "(ii)" — a parenthesised part marker. */
const PAREN_MARKER = /\(\s*(?:[a-hA-H]|\d{1,2}|i{1,3}|iv|v|vi{0,3})\s*\)/;
/** A quoted span of three or more words: the prompt / sentence / passage the
 *  student was set. Straight or typographic quotes; an apostrophe inside a
 *  word ("can't") never opens a span. */
const QUOTED_SPAN =
  /(?:^|[\s(:,;—–-])(?:"([^"]{8,})"|“([^”]{8,})”|'([^']{8,})'(?![a-z])|‘([^’]{8,})’(?![a-z]))/i;
/** Three or more numbers in a list ("4, 8, 15, 16, 23, 42"). */
const NUMBER_LIST = /-?\d+(?:\.\d+)?(?:\s*(?:,|;|\band\b)\s*-?\d+(?:\.\d+)?){2,}/;

/** A task the student was set, as an instruction: the verb opens the text, a
 *  sentence, or follows a colon / part marker. A gerund title ("Solving
 *  Linear Inequalities") is not an instruction. */
const TASK_VERB =
  '(?:solve|find|calculate|compute|evaluate|simplify|factor(?:ise|ize)?|expand|convert|determine|identify|describe|' +
  'explain|compare|contrast|discuss|analy[sz]e|write|fix|correct|rewrite|revise|edit|prove|show|graph|sketch|draw|' +
  'balance|define|list|name|state|give|summari[sz]e|differentiate|integrate|derive|estimate|round|translate|label|' +
  'classify|justify|choose|select|complete|fill|check|verify|outline|plan|draft|argue|evaluate|interpret|predict|' +
  'construct|plot|rank|order|match|rearrange|substitute|measure|answer)';
const TASK_INSTRUCTION = new RegExp(
  `(?:^|[.?!:;]\\s+|\\)\\s*|\\b(?:briefly|then|and|please)\\s+)${TASK_VERB}\\b(?:\\s+\\S+){3,}`,
  'i',
);

/** A request ABOUT a topic, with no task: "help me with fractions", "I need
 *  help with photosynthesis", "can you teach me the quadratic formula?",
 *  "how do I factor a quadratic?", "what is a mole?". The frame is stripped
 *  and what is left must be a short phrase. */
const TOPIC_FRAME = new RegExp(
  '^(?:(?:hi|hey|hello|please|ok|okay|so|um)[,!.\\s]+)*' +
  '(?:' +
    "(?:can|could|would|will)\\s+(?:you|we|u)\\s+(?:please\\s+)?(?:help(?:\\s+me)?(?:\\s+(?:with|on|understand|learn|study|review|out\\s+with))?|teach(?:\\s+me)?(?:\\s+about)?|explain(?:\\s+to\\s+me)?|go\\s+over|review|cover|tell\\s+me\\s+about|show\\s+me)" +
    "|(?:i\\s+)?(?:need|want|would\\s+like|'?d\\s+like)\\s+(?:some\\s+|a\\s+little\\s+|to\\s+get\\s+)?help\\s+(?:with|on|in|understanding|learning)" +
    "|i\\s+(?:need|want|would\\s+like|'?d\\s+like)\\s+to\\s+(?:learn|study|review|understand|practi[cs]e|go\\s+over|work\\s+on)(?:\\s+about)?" +
    "|i(?:'?m|\\s+am)\\s+(?:stuck|confused|lost|struggling)\\s+(?:on|with|about|in)" +
    "|i\\s+(?:do\\s+not|don'?t|dont|can'?t|cannot)\\s+(?:understand|get)" +
    '|help(?:\\s+me)?\\s+(?:with|on|understand|learn|study|review)' +
    '|teach\\s+me(?:\\s+about)?|explain(?:\\s+to\\s+me)?|tell\\s+me\\s+about|let\'?s\\s+(?:do|study|review|learn|practi[cs]e|go\\s+over|work\\s+on)' +
    '|how\\s+(?:do|can|would|should)\\s+(?:i|you|we|u)|how\\s+to|what\\s+(?:is|are|\'?s)|homework\\s+(?:help\\s+)?(?:on|about|in|for)|questions?\\s+(?:on|about)' +
  ')\\s+',
  'i',
);
const BARE_TOPIC_MAX_WORDS = 7;
/** A long single line with no other signal is more than a topic name. */
const LONG_TEXT_MIN_WORDS = 14;

function wordsOf(t: string): number {
  return t.split(/\s+/).filter(Boolean).length;
}

/**
 * Is this typed text a BARE TOPIC with no task — "help me with fractions",
 * "Solving Linear Inequalities One Variable", "Grade 8 fractions", "How do I
 * factor a quadratic?" Only then does a homework-help request take the
 * ordinary generated-lesson path. Pure.
 */
export function isBareTopicRequest(text: string): boolean {
  const t = (text || '').trim();
  if (!t) return true;
  if (t.split(/\r?\n/).filter((l) => l.trim()).length >= 2) return false;
  if (PAREN_MARKER.test(t) || QUOTED_SPAN.test(t) || NUMBER_LIST.test(t)) return false;
  if ((t.match(/\?/g) ?? []).length >= 2) return false;
  const framed = TOPIC_FRAME.test(t);
  const rest = t.replace(TOPIC_FRAME, '').replace(/[\s?.!]+$/g, '').trim();
  if (framed) return wordsOf(rest) <= BARE_TOPIC_MAX_WORDS && !(/\d/.test(rest) && OPERATOR.test(rest));
  // No request frame: a title-like phrase (no question, no instruction).
  if (/\?/.test(t) || TASK_INSTRUCTION.test(t)) return false;
  if (/\d/.test(t) && OPERATOR.test(t)) return false;
  return wordsOf(t) < LONG_TEXT_MIN_WORDS;
}

/**
 * Should typed homework-help text be treated as the student's OWN material
 * (split into problems and coached on as written) rather than as a topic to
 * generate a lesson about?
 *
 * Yes for: everything `hasProblemSignals` already accepted; parenthesised
 * part markers "(a) … (b) …"; a quoted prompt or sentence; a list of numbers;
 * an instruction to carry out ("Identify ONE way …", "Fix the pronoun error
 * …"); a direct question that is not a "what is / how do I" topic request.
 * No only for a bare topic (`isBareTopicRequest`). Pure.
 *
 * @param opts.enabled  false ⇒ `hasProblemSignals` alone (the behaviour
 *   before 2026-10-05). The route passes TUTOR_HOMEWORK_OWN_MATERIAL.
 */
export function typedHomeworkIsOwnMaterial(text: string, opts?: { enabled?: boolean }): boolean {
  const t = (text || '').trim();
  if (!t) return false;
  if (hasProblemSignals(t)) return true;
  if (opts?.enabled === false) return false;
  return !isBareTopicRequest(t);
}

/**
 * `homeworkPlanDecision` for TYPED text that passed
 * `typedHomeworkIsOwnMaterial`: when the splitter failed open, the whole
 * typed text is still what the student brought — one problem, verbatim —
 * never a generated lesson with other examples. Uploads and the flag-off
 * path keep `homeworkPlanDecision` exactly. Pure.
 */
export function typedHomeworkPlanDecision(
  r: EnumerateResult,
  opts: { ownMaterial: boolean },
): HomeworkPlanDecision {
  const base = homeworkPlanDecision(r);
  if (base.kind === 'homework' || !opts.ownMaterial) return base;
  const only = r.problems[0];
  if (!r.failedOpen || !only || !only.text.trim()) return base;
  return { kind: 'homework', problems: [{ n: 1, text: only.text }] };
}

/** A homework-help request never returns an objective picker: when the
 *  ordinary path discovers more objectives than the session can hold, keep
 *  the first `max` (the order Stage 1 proposed) and build a full plan. Pure. */
export function capObjectivesForHomework<T>(los: T[], max: number): T[] {
  return los.slice(0, Math.max(1, max));
}

// ── 2026-10-06c: the student's own text, verbatim ──────────────────────────
//
// portal-818996c1: the student typed a system of two inequalities; the
// session's problem card showed "y < −2x + 4 and 2x + y < 4" — one of them
// solved for y, the other dropped — and the tutor said both were "already
// solved for y". The splitter is told to copy the problems verbatim
// ("do not solve, hint, rephrase or omit") but nothing held it to that: its
// text became the plan's problem as returned.

/**
 * Hold a TYPED split to the student's text. An entry carrying an equation or
 * inequality that does not occur in what the student typed (in any
 * typesetting) is not their problem as written: the split is replaced by ONE
 * problem holding the typed text verbatim (whitespace normalised only), and
 * the splitter's wording is kept apart in `rewritten`. A split whose entries
 * are all grounded is returned unchanged. Uploads are not passed here (the
 * splitter is asked to turn extracted maths into plain text, which an OCR
 * source does not survive character for character). Pure.
 * @param opts.enabled unset ⇒ TUTOR_HOMEWORK_VERBATIM.
 */
/** = enumerate-problems.ts HOMEWORK_MAX_PROBLEM_CHARS (the contract's cap);
 *  repeated, not imported — that module carries the model client and this
 *  one is read in the browser. */
const TYPED_PROBLEM_MAX_CHARS = 4000;

export function groundTypedProblems(
  problems: HomeworkProblem[],
  typedText: string,
  opts?: { enabled?: boolean },
): { problems: HomeworkProblem[]; altered: string[] } {
  if (!(opts?.enabled ?? TUTOR_HOMEWORK_VERBATIM)) return { problems, altered: [] };
  const own = verbatimText(typedText);
  if (!own || problems.length === 0) return { problems, altered: [] };
  const altered = problems.flatMap((p) => ungroundedRelations(p.text, own));
  if (altered.length === 0) return { problems, altered: [] };
  return {
    problems: [{ n: problems.length === 1 ? problems[0].n : 1, text: own.slice(0, TYPED_PROBLEM_MAX_CHARS), rewritten: problems.map((p) => `${p.n}. ${p.text}`).join('\n') }],
    altered,
  };
}
