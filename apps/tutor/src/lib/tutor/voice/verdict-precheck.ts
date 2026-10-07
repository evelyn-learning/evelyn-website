/**
 * Verdict pre-check — SERVER ONLY (reads env, calls a model). TEXT mode.
 *
 * Why (2026-10-06, replay of 23 scripted text sessions with thinking on): the
 * brain still denied or failed to credit a correct hedged answer in 5 of 12
 * sessions. In each the student had typed the correct FINAL answer while the
 * tutor's last question was about a smaller step ("what does the bottom
 * become?" → "maybe <the limit>?" → "Not quite — plug in…"), and the brain
 * graded it against the step. Reasoning inside the brain turn did not fix it:
 * the brain is busy with the reply, the board and 120K tokens of instructions.
 * A separate, small call that does ONE thing — which question does this
 * message answer, and is it right for THAT question — is run first, and its
 * finding is handed to the brain as a fact (./verdict-precheck-shared.ts
 * `formatAnswerCheckBlock`).
 *
 * When: a text-mode turn whose message proposes a value or claim
 * (turn-shape-signal.ts `answerShaped`: a hedged proposal, a bare value, a
 * fuller answer, "check my answer X") while a tutor question is open or the
 * student's own problem is tracked. Never for a bare yes / no, a question, a
 * request, or a runtime turn.
 *
 * It runs BEFORE the brain call of that turn, with nothing else in flight, so
 * the whole of its latency is added to the turn. Hard cap: 6 s (4 s until
 * 2026-10-06, when it cut 19 of 91 checks in the replay). A timeout, an
 * error, a refusal, an unparsable reply or a low-confidence reply yields
 * null / nothing injected — the turn then runs exactly as it did before.
 *
 *   TUTOR_TEXT_VERDICT_PRECHECK             unset/anything ⇒ ON · 'off' ⇒ off
 *   TUTOR_TEXT_VERDICT_PRECHECK_TIMEOUT_MS  hard cap (default 6000)
 *   TUTOR_MODEL_VERDICT_PRECHECK            model id (registry role `verdict-precheck`)
 *   TUTOR_TEXT_VERDICT_PRECHECK_THINKING    'low' (adaptive thinking, low effort) | 'off' (no thinking,
 *                                           a scratch field first) | 'bare' (neither); default per model, below
 *
 * Voice: the switch is false whatever the flag, so a voice request is the
 * pre-existing one byte for byte.
 *
 * The prompt is generic — no subject content, no example values (repo rule).
 * `runVerdictPrecheck` never throws. `npm run test:verdict-precheck`.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { getModelClient, prepareParams, resolveModel } from '../ai/model-registry';
import { falseArithmeticIn } from './turn-shape-signal';
import { TUTOR_AMBIGUOUS_EXPRESSION_RULE } from '@/lib/tutor/orchestrator/turn-round-flags';
import type {
  PrecheckConfidence,
  PrecheckTarget,
  PrecheckVerdict,
  VerdictPrecheckResult,
} from './verdict-precheck-shared';

/** 2026-10-06 (third round): 4 s cut 19 of 91 checks in the end-to-end replay
 *  (completed calls: p50 2.6 s, p90 3.3 s; the bench p90 was 6.0 s). 6 s. */
export const VERDICT_PRECHECK_TIMEOUT_MS = 6000;

/** On for a turn iff the session is text mode and the flag is not 'off'. */
export function textVerdictPrecheckEnabled(
  inputMode: unknown,
  flag: string | undefined = process.env.TUTOR_TEXT_VERDICT_PRECHECK,
): boolean {
  return inputMode === 'text' && flag !== 'off';
}

export function verdictPrecheckTimeoutMs(env: string | undefined = process.env.TUTOR_TEXT_VERDICT_PRECHECK_TIMEOUT_MS): number {
  const n = Number(env);
  return Number.isFinite(n) && n >= 500 && n <= 15_000 ? Math.round(n) : VERDICT_PRECHECK_TIMEOUT_MS;
}

export interface VerdictPrecheckInput {
  /** The student's own problems (homework session), verbatim. */
  problems?: ReadonlyArray<{ n: number; text: string }>;
  /** Which of them is tracked as current (1-based position). */
  currentProblem?: number;
  /** The tracked active problem statement, when there is one. */
  activeProblemStatement?: string;
  /** The conversation so far, oldest first; the last few turns are used. */
  history: ReadonlyArray<{ role: 'user' | 'assistant'; content: string }>;
  /** The tutor's last question, verbatim; null when none is open. */
  openQuestion: string | null;
  studentMessage: string;
  /** Facts the runtime computed from the problem itself (a system /
   *  inequality problem: whiteboard/inequality-facts.ts), as plain text. */
  problemFacts?: string;
}

export interface VerdictPrecheckLlmRequest {
  system: string;
  user: string;
  maxTokens: number;
  signal: AbortSignal;
  timeoutMs: number;
}
export interface VerdictPrecheckLlmReply { text: string; model: string; inputTokens: number; outputTokens: number }
/** The model call, injectable so tests never touch the network. */
export type VerdictPrecheckLlm = (req: VerdictPrecheckLlmRequest) => Promise<VerdictPrecheckLlmReply>;

export interface VerdictPrecheckDeps {
  llm?: VerdictPrecheckLlm;
  timeoutMs?: number;
  /** Measurement overrides (scripts/replay-verdict-turns.ts). */
  model?: string;
  thinking?: 'low' | 'off' | 'bare';
  now?: () => number;
}

export const VERDICT_PRECHECK_SYSTEM =
  'You check ONE student message in a tutoring session, before the tutor replies. You are given the student\'s own problem or problems, the recent conversation, the last question the tutor asked (the open question), and the student\'s message. Nobody but the tutor\'s software reads your output.\n' +
  'Work in this order.\n' +
  '1. WHAT IS PROPOSED. Find the value, expression, statement or claim the message offers as an answer. A hedge that goes on to propose something ("I don\'t know, maybe …") proposes that thing. A request to check a value proposes that value. If the message proposes nothing — it is an assent, a question, a request, small talk — set answers to "neither".\n' +
  '2. SOLVE THE PROBLEM FIRST. Before deciding anything else, work out for yourself, from the student\'s own problem and data, the final answer of the problem (and of the part) being worked, and the answer to the open question. Do every operation yourself. Do not take over any value or intermediate result from the conversation — not from the tutor, even where the tutor has already confirmed or rejected something (tutors make mistakes), and not from the student\'s own message (a line of working inside it can be wrong: recompute each operation they wrote).\n' +
  '3. WHICH QUESTION IT ANSWERS.\n' +
  '   First test: does the proposed value equal the final answer of the problem or part being worked? If it does, and the open question was asking for something else (a smaller step, a method, a reason), then answers is "overall_problem" and the verdict is "correct" — the student has jumped ahead to the final answer. This holds even when the value could also be read as a wrong answer to the open question: matching the final answer is not a coincidence.\n' +
  '   Otherwise decide from what KIND of thing each question asks for and what kind of thing the student gave:\n' +
  '   "open_question" — it is a possible answer to the tutor\'s last question exactly as that question was asked (including when that question itself asks for the final answer).\n' +
  '   "overall_problem" — it is offered as an answer to the problem or part being worked rather than to the smaller step the tutor had just asked about.\n' +
  '   "other_part" — it answers a different problem, or a different part, from the one being worked — including one that was settled earlier.\n' +
  '   "neither" — it answers none of these: it is the wrong kind of thing for the open question and is not an answer to any of the student\'s problems, or it is unrelated.\n' +
  '4. COMPARE with your own answer to THAT question. An equivalent form, notation, ordering or unit spelling is the same answer. verdict: "correct" only when it is the complete right answer to that question; "incorrect"; "partly_correct" when the question asks for several things, or for all the values that work, and the student gave only some of them, or part is right and part is wrong; "cannot_determine" when the question has no single right answer (an opinion, an open-ended draft, a choice of what to do next) or there is not enough information to solve it.\n' +
  '5. CONFIDENCE. "high" only when it is unambiguous which question the message answers AND you solved that question completely. "medium" when either is somewhat uncertain. "low" otherwise. When answers is "neither", confidence is about that classification alone.\n' +
  'Fields, in this order: proposed_value — what the student proposed, as they wrote it. problem_final_answer — the final answer of the problem or part being worked, as YOU worked it out in step 2 (empty if it has no single answer). proposed_equals_final_answer — true when the two are the same answer. target — a short name for the question the message answers, in your own words. correct_value — the correct answer to THAT question, worked out by you; empty when answers is "neither" or the verdict is "cannot_determine".';

/**
 * 2026-10-06b (portal-10beb4f5, voice): a spoken expression arrived as words
 * with no brackets, could be grouped two ways, and the check graded the
 * grouping the student did not mean — a correct answer came back "incorrect"
 * with high confidence. The same happens with typed input that leaves its
 * brackets out. One sentence added to step 4; generic wording.
 */
export const AMBIGUOUS_READING_RULE =
  ' AMBIGUOUS WRITING OR SPEECH. The student\'s words may reach you spoken aloud and transcribed, or typed without brackets, so what they proposed can have more than one reasonable reading (how its parts are grouped, which part a word applies to). List the reasonable readings before you compare. If ANY reasonable reading is the right answer to that question, the verdict is "correct", and correct_value gives that answer written out in full and unambiguously. Only when NO reasonable reading is right is the verdict "incorrect". Never return "incorrect" on the strength of one reading while another reasonable reading is right.';

/** The system prompt the check is sent. `ambiguousReadingRule` unset ⇒
 *  TUTOR_AMBIGUOUS_EXPRESSION_RULE; false ⇒ the prompt of 2026-10-06. */
export function verdictPrecheckSystem(opts?: { ambiguousReadingRule?: boolean }): string {
  if (!(opts?.ambiguousReadingRule ?? TUTOR_AMBIGUOUS_EXPRESSION_RULE)) return VERDICT_PRECHECK_SYSTEM;
  const marker = '\n5. CONFIDENCE.';
  const at = VERDICT_PRECHECK_SYSTEM.indexOf(marker);
  if (at < 0) return VERDICT_PRECHECK_SYSTEM + AMBIGUOUS_READING_RULE;
  return VERDICT_PRECHECK_SYSTEM.slice(0, at) + AMBIGUOUS_READING_RULE + VERDICT_PRECHECK_SYSTEM.slice(at);
}

/** `working` is a scratch field for a model that is NOT thinking: it is
 *  written first so the verdict follows the working. A thinking model has
 *  done its working already, and the field would only add ~1 s of output. */
const WORKING_FIELD_NOTE = ' working — your own working, at most 80 words, written before anything else.';

// Field ORDER is part of the method: the reply is written in this order, so
// the final answer of the problem is on the page — and compared with what the
// student proposed — before the model commits to which question the message
// answers. (Bench, 2026-10-06: without these two fields a correct final
// answer given while a method question was open was classed, with high
// confidence, as a wrong answer to the method question.)
const BASE_PROPERTIES = {
  proposed_value: { type: 'string' },
  problem_final_answer: { type: 'string' },
  proposed_equals_final_answer: { type: 'boolean' },
  answers: { type: 'string', enum: ['open_question', 'overall_problem', 'other_part', 'neither'] },
  target: { type: 'string' },
  correct_value: { type: 'string' },
  verdict: { type: 'string', enum: ['correct', 'incorrect', 'partly_correct', 'cannot_determine'] },
  confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
} as const;

export const VERDICT_PRECHECK_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: ['proposed_value', 'problem_final_answer', 'proposed_equals_final_answer', 'answers', 'target', 'correct_value', 'verdict', 'confidence'],
  properties: BASE_PROPERTIES,
};
export const VERDICT_PRECHECK_SCHEMA_WITH_WORKING: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: ['working', 'proposed_value', 'problem_final_answer', 'proposed_equals_final_answer', 'answers', 'target', 'correct_value', 'verdict', 'confidence'],
  properties: { working: { type: 'string' }, ...BASE_PROPERTIES },
};

const HISTORY_TURNS = 8;
const TURN_MAX_CHARS = 900;
const PROBLEM_MAX_CHARS = 1500;

function clip(s: string, max: number): string {
  const t = (s ?? '').trim();
  return t.length > max ? `${t.slice(0, max)} …` : t;
}

/** The user content of the pre-check call. Exported for the tests. */
export function buildVerdictPrecheckUser(input: VerdictPrecheckInput): string {
  const parts: string[] = [];
  const problems = input.problems ?? [];
  if (problems.length > 0) {
    const cur = problems[(input.currentProblem ?? 0) - 1];
    parts.push(
      '<student_problems>\n'
      + problems.map((p) => `${p.n}. ${clip(p.text, PROBLEM_MAX_CHARS)}`).join('\n')
      + (cur ? `\n(The tutor's tracker marks Problem ${cur.n} as the one being worked. The tracker can lag behind the conversation.)` : '')
      + '\n</student_problems>',
    );
  }
  const statement = (input.activeProblemStatement ?? '').trim();
  if (statement && !problems.some((p) => p.text.includes(statement.slice(0, 60)))) {
    parts.push(`<problem_on_the_board>\n${clip(statement, PROBLEM_MAX_CHARS)}\n</problem_on_the_board>`);
  }
  // 2026-10-06b: the check read the same conversation as the tutor and
  // followed its error about which side of a line is shaded. These facts are
  // computed from the problem's own inequalities.
  const facts = (input.problemFacts ?? '').trim();
  if (facts) {
    parts.push(`<computed_facts>\n${clip(facts, 3000)}\nThese were computed from the problem itself and are certain: use them as given in step 2, even where the conversation — tutor or student — says otherwise.\n</computed_facts>`);
  }
  const recent = input.history.filter((m) => typeof m.content === 'string' && m.content.trim()).slice(-HISTORY_TURNS);
  if (recent.length > 0) {
    parts.push(
      '<recent_conversation>\n'
      + recent.map((m) => `${m.role === 'assistant' ? 'TUTOR' : 'STUDENT'}: ${clip(m.content, TURN_MAX_CHARS)}`).join('\n')
      + '\n</recent_conversation>',
    );
  }
  parts.push(`<open_question>\n${input.openQuestion ? clip(input.openQuestion, 500) : '(the tutor\'s last message asked no question)'}\n</open_question>`);
  parts.push(`<student_message>\n${clip(input.studentMessage, 1200)}\n</student_message>`);
  // A written calculation with the wrong result: a calculator's finding, so
  // the model does not have to notice it (it did not, once — see
  // turn-shape-signal.ts `falseArithmeticIn`).
  const wrongSum = falseArithmeticIn(input.studentMessage);
  if (wrongSum) {
    parts.push(`<calculator_check>\nThe student's message states "${wrongSum.claim}". By calculator: ${wrongSum.correct}.\n</calculator_check>`);
  }
  return parts.join('\n\n');
}

/** Default thinking setting per model family. Measured 2026-10-06 on the 91
 *  answer-shaped turns of the 23 replayed sessions
 *  (scripts/replay-verdict-turns.ts `--precheck-bench`; outputs and my
 *  reading in artifacts/replay-verdict-turns/levers/):
 *    claude-sonnet-5, thinking low   88/91 right · p50 2.6–3.5 s · p90 3.3–6.0 s
 *    claude-sonnet-4-6 (grader class) no thinking, scratch field first:
 *                                    81/89 right, 4 high-confidence errors on
 *                                    exactly the hedged class · p50 4.3 s
 *    claude-haiku-4-5                75/89, 12 high-confidence errors · p50 2.3 s
 *  'bare' (no thinking, no scratch field; Sonnet 5) was 44/46 on the wrong +
 *  hedged classes at p50 ~2.2 s but wrote a wrong correct_value twice — the
 *  faster option if the 4 s cap cuts too many checks (it cut 19 of 91 in the
 *  end-to-end replay with thinking low). */
export function verdictPrecheckThinking(
  model: string,
  env: string | undefined = process.env.TUTOR_TEXT_VERDICT_PRECHECK_THINKING,
): 'low' | 'off' | 'bare' {
  if (env === 'low' || env === 'off' || env === 'bare') return env;
  return /sonnet-5|opus-5/.test(model) ? 'low' : 'off';
}

function defaultLlm(deps: VerdictPrecheckDeps): VerdictPrecheckLlm {
  return async (req) => {
    const role = getModelClient('verdict-precheck');
    const model = deps.model ?? role.model;
    const thinking = deps.thinking ?? verdictPrecheckThinking(model);
    // 'bare' (measurement only): no thinking and no scratch field.
    const schema = thinking === 'off' ? VERDICT_PRECHECK_SCHEMA_WITH_WORKING : VERDICT_PRECHECK_SCHEMA;
    const params = prepareParams('verdict-precheck', {
      model,
      max_tokens: req.maxTokens,
      system: thinking === 'off' ? req.system + WORKING_FIELD_NOTE : req.system,
      messages: [{ role: 'user', content: req.user }],
      ...(thinking === 'low'
        ? { thinking: { type: 'adaptive' }, output_config: { effort: 'low', format: { type: 'json_schema', schema } } }
        : { thinking: { type: 'disabled' }, output_config: { format: { type: 'json_schema', schema } } }),
    });
    const msg = await role.client.messages.create(params as unknown as Anthropic.MessageCreateParamsNonStreaming, {
      signal: req.signal,
      timeout: req.timeoutMs,
      maxRetries: 0,
    });
    if (msg.stop_reason === 'refusal') throw new Error('model declined the request');
    if (msg.stop_reason === 'max_tokens') throw new Error('reply truncated');
    const text = msg.content.filter((b) => b.type === 'text').map((b) => (b as Anthropic.TextBlock).text).join('');
    return { text, model, inputTokens: msg.usage?.input_tokens ?? 0, outputTokens: msg.usage?.output_tokens ?? 0 };
  };
}

function parseReply(text: string): Record<string, unknown> | null {
  const t = (text ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    const s = t.indexOf('{');
    const e = t.lastIndexOf('}');
    if (s < 0 || e <= s) return null;
    const v = JSON.parse(t.slice(s, e + 1)) as unknown;
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

const TARGETS: ReadonlySet<string> = new Set(['open_question', 'overall_problem', 'other_part', 'neither']);
const VERDICTS: ReadonlySet<string> = new Set(['correct', 'incorrect', 'partly_correct', 'cannot_determine']);
const CONFIDENCES: ReadonlySet<string> = new Set(['high', 'medium', 'low']);

/** The model the pre-check will call (registry role `verdict-precheck`). */
export function verdictPrecheckModel(): string {
  return resolveModel('verdict-precheck').model;
}

/**
 * Run the pre-check. Resolves to null — never rejects — on a timeout, an
 * error, a refusal or a reply that is not the schema.
 */
export async function runVerdictPrecheck(
  input: VerdictPrecheckInput,
  deps: VerdictPrecheckDeps = {},
): Promise<VerdictPrecheckResult | null> {
  const now = deps.now ?? Date.now;
  const startedAt = now();
  const timeoutMs = deps.timeoutMs ?? verdictPrecheckTimeoutMs();
  const abort = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    if (!(input.studentMessage ?? '').trim()) return null;
    const llm = deps.llm ?? defaultLlm(deps);
    const call = llm({
      system: verdictPrecheckSystem(),
      user: buildVerdictPrecheckUser(input),
      maxTokens: 1500,
      signal: abort.signal,
      timeoutMs,
    });
    // The abandoned call rejects when aborted; nothing awaits it then.
    call.catch(() => undefined);
    const raced = await Promise.race([
      call,
      new Promise<'timeout'>((resolve) => { timer = setTimeout(() => resolve('timeout'), timeoutMs); }),
    ]);
    if (raced === 'timeout') {
      abort.abort();
      console.warn(`[verdict-precheck] timed out after ${timeoutMs} ms — nothing injected`);
      return null;
    }
    const o = parseReply(raced.text);
    if (!o || !TARGETS.has(String(o.answers)) || !VERDICTS.has(String(o.verdict)) || !CONFIDENCES.has(String(o.confidence))) {
      console.warn('[verdict-precheck] unusable reply — nothing injected');
      return null;
    }
    // The model's own two findings are held to each other: a proposal it says
    // EQUALS the final answer of the problem being worked is a correct answer
    // to that problem, whatever it then wrote about the open question —
    // unless it classed it as a correct answer to the open question already.
    if (o.proposed_equals_final_answer === true && String(o.problem_final_answer ?? '').trim()
        && !(o.verdict === 'correct' && (o.answers === 'open_question' || o.answers === 'overall_problem'))) {
      o.answers = 'overall_problem';
      o.verdict = 'correct';
      o.correct_value = String(o.problem_final_answer);
      if (o.confidence === 'low') o.confidence = 'medium';
    }
    return {
      answers: o.answers as PrecheckTarget,
      target: String(o.target ?? '').trim().slice(0, 200),
      proposed: String(o.proposed_value ?? '').trim().slice(0, 240),
      verdict: o.verdict as PrecheckVerdict,
      confidence: o.confidence as PrecheckConfidence,
      correctValue: String(o.correct_value ?? '').trim().slice(0, 240),
      model: raced.model,
      ms: now() - startedAt,
      inputTokens: raced.inputTokens,
      outputTokens: raced.outputTokens,
    };
  } catch (err) {
    console.warn(`[verdict-precheck] failed (${(err instanceof Error ? err.message : String(err)).slice(0, 120)}) — nothing injected`);
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
