/**
 * Creation-time answer-key verification — SERVER ONLY (reads env, calls a model).
 *
 * Why: the 2026-10-04 audit of 6,375 practice items found ~100 wrong keys and
 * ~180 defective questions, almost all in content whose key was never
 * independently checked when it was created; the one source that WAS checked
 * at creation (the authored problem bank's fresh-context blind solve) came out
 * clean. So a stored key is trusted only if an independent solve agreed with
 * it, and this module is that check for everything generated at runtime:
 * lesson-plan / review-plan try-yourselves (lesson-plan/plan-key-verify.ts)
 * and free-text on-demand practice items (./practice-gen.ts).
 *
 * How (the audit's stages 1–2, same prompts, same comparison):
 *   1. BLIND SOLVE by the `content-verify` model. The solver prompt is built
 *      from a `SolverView`, which has no key and no `correct` flag — the
 *      claimed answer cannot reach the solver. The solver may declare the
 *      question ill-posed.
 *   2. COMPARE (./key-compare.ts): multiple choice by option; identical text;
 *      relations/inequalities by exact solution set; single numbers within
 *      max(0.01, 1 %); anything else by a JUDGE call
 *      (SAME / DIFFERENT / KEY_INCOMPLETE / CANNOT_JUDGE).
 *
 * There is NO tie-break stage here (the audit's stage 3): one disagreeing
 * solve is enough to stop trusting a key. That errs toward dropping a correct
 * key when the solver slips — the safe direction, since a dropped key only
 * means the tutor derives the answer itself.
 *
 * FAIL CLOSED: any network / parse / refusal / truncation failure, in either
 * call (after its one retry), yields `unverifiable`. This function never throws.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { getModelClient, prepareParams, resolveModel } from '../ai/model-registry';
import type { KeyCheckStatus } from '../lesson-plan/types';
import { compareKeyWithJudge, toChoices, type JudgeVerdict } from './key-compare';
import { buildJudgePrompt, buildSolverPrompt } from './key-verify-prompts';

export type { KeyCheckStatus };

/** Emergency switch for every creation-time key check (plans + free-text
 *  practice items). Default ON; only the literal 'off' disables it, and with
 *  it off every caller behaves exactly as it did before the check existed. */
export function keyVerifyEnabled(): boolean {
  return process.env.TUTOR_KEY_VERIFY_AT_CREATION !== 'off';
}

/** The model id that does the blind solve (registry role `content-verify`). */
export function keyVerifyModel(): string {
  return resolveModel('content-verify').model;
}

export interface KeyVerifyUsage {
  calls: number;
  inputTokens: number;
  outputTokens: number;
}

export interface KeyVerifyLlmRequest {
  kind: 'solve' | 'judge';
  system: string;
  user: string;
  /** JSON schema the reply must match. */
  schema: Record<string, unknown>;
  maxTokens: number;
  effort: 'low' | 'medium';
  signal?: AbortSignal;
}

export interface KeyVerifyLlmReply {
  /** The model's reply text (a JSON object). */
  text: string;
  inputTokens: number;
  outputTokens: number;
}

/** The model call, injectable so tests never touch the network. */
export type KeyVerifyLlm = (req: KeyVerifyLlmRequest) => Promise<KeyVerifyLlmReply>;

export interface VerifyAnswerKeyInput {
  question: string;
  /** Multiple-choice options: strings, or `{ id?, text, correct? }` objects. */
  choices?: ReadonlyArray<string | { id?: string; text: string; correct?: boolean }>;
  /** The stored key (a letter or the option text for multiple choice). */
  claimedAnswer: string;
  /** 'mcq' | 'numeric' | 'free' | 'frq' — steers the solver's answer format. */
  answerFormat?: string;
}

export interface VerifyAnswerKeyResult {
  status: KeyCheckStatus;
  /** The independent solver's final answer, when it produced one. */
  solverAnswer?: string;
  reason: string;
  /** Model id that did the solve. */
  model: string;
  usage: KeyVerifyUsage;
}

export interface VerifyAnswerKeyDeps {
  llm?: KeyVerifyLlm;
  /** Aborts the in-flight model call (→ `unverifiable`). */
  signal?: AbortSignal;
  /** Overrides the recorded model id (tests). */
  model?: string;
}

/** Output caps. They include the solver's own reasoning, so they are generous;
 *  the audit measured p90 ≈ 300 output tokens for a solve. */
const MAX_TOKENS = { solve: 6000, judge: 2000 } as const;
/** Hard per-call ceiling; callers add their own overall budget via `signal`. */
const CALL_TIMEOUT_MS = 45_000;

/** The real model call: the request shape the audit tool proved on 6,666 items
 *  (adaptive thinking + JSON-schema output), non-streaming, one SDK retry. */
const defaultLlm: KeyVerifyLlm = async (req) => {
  const { client, model } = getModelClient('content-verify');
  const params = prepareParams('content-verify', {
    model,
    max_tokens: req.maxTokens,
    system: req.system,
    messages: [{ role: 'user', content: req.user }],
    thinking: { type: 'adaptive' },
    output_config: { effort: req.effort, format: { type: 'json_schema', schema: req.schema } },
  });
  const msg = await client.messages.create(params as unknown as Anthropic.MessageCreateParamsNonStreaming, {
    signal: req.signal,
    timeout: CALL_TIMEOUT_MS,
    maxRetries: 1,
  });
  if (msg.stop_reason === 'refusal') throw new Error('model declined the request');
  if (msg.stop_reason === 'max_tokens') throw new Error(`reply truncated at max_tokens=${req.maxTokens}`);
  const text = msg.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as Anthropic.TextBlock).text)
    .join('');
  return { text, inputTokens: msg.usage?.input_tokens ?? 0, outputTokens: msg.usage?.output_tokens ?? 0 };
};

function parseJsonObject(text: string): Record<string, unknown> {
  const t = (text ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  let v: unknown;
  try {
    v = JSON.parse(t);
  } catch {
    const s = t.indexOf('{');
    const e = t.lastIndexOf('}');
    if (s < 0 || e <= s) throw new Error('model reply was not JSON');
    v = JSON.parse(t.slice(s, e + 1));
  }
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('model reply was not a JSON object');
  return v as Record<string, unknown>;
}

const JUDGE_VERDICTS: ReadonlySet<string> = new Set(['SAME', 'DIFFERENT', 'KEY_INCOMPLETE', 'CANNOT_JUDGE']);

const errText = (e: unknown): string => (e instanceof Error ? e.message : String(e)).slice(0, 160);

/**
 * Independently verify one stored answer key.
 *
 *   verified     — the blind solve agrees with the key;
 *   mismatch     — it gives a different answer, or the key covers only part of
 *                  what the question asks (judge: KEY_INCOMPLETE);
 *   ill_posed    — the solver could not answer the question as written;
 *   unverifiable — no verdict: empty key, unresolvable option, judge could not
 *                  tell, or any model/parse failure (fail closed).
 */
export async function verifyAnswerKey(
  input: VerifyAnswerKeyInput,
  deps: VerifyAnswerKeyDeps = {},
): Promise<VerifyAnswerKeyResult> {
  const llm = deps.llm ?? defaultLlm;
  const usage: KeyVerifyUsage = { calls: 0, inputTokens: 0, outputTokens: 0 };
  let model = deps.model ?? '';
  const done = (status: KeyCheckStatus, reason: string, solverAnswer?: string): VerifyAnswerKeyResult => ({
    status,
    reason,
    model,
    usage,
    ...(solverAnswer ? { solverAnswer } : {}),
  });

  try {
    if (!model) model = keyVerifyModel();
    const question = (input.question ?? '').trim();
    const claimed = (input.claimedAnswer ?? '').trim();
    const choices = toChoices(input.choices ? [...input.choices] : []);
    if (!question) return done('unverifiable', 'no question text');
    if (!claimed && !choices.some((c) => c.correct)) return done('unverifiable', 'no stored key to check');

    const call = async (kind: 'solve' | 'judge', prompt: { system: string; user: string; schema: Record<string, unknown> }) => {
      const req: KeyVerifyLlmRequest = {
        kind,
        ...prompt,
        maxTokens: MAX_TOKENS[kind],
        effort: kind === 'solve' ? 'medium' : 'low',
        signal: deps.signal,
      };
      // ONE retry on a failed call (the audit run saw a few percent of calls
      // end in a transient refusal / timeout that succeeded when repeated);
      // never after the caller's budget aborted it. A second failure
      // propagates → `unverifiable`.
      let reply: KeyVerifyLlmReply;
      try {
        reply = await llm(req);
      } catch (e) {
        if (deps.signal?.aborted) throw e;
        reply = await llm(req);
      }
      usage.calls += 1;
      usage.inputTokens += reply.inputTokens || 0;
      usage.outputTokens += reply.outputTokens || 0;
      return parseJsonObject(reply.text);
    };

    // 1. Blind solve — the prompt is built from the question + option texts only.
    const format = choices.length > 0 ? 'mcq' : (input.answerFormat ?? 'free');
    let solved: Record<string, unknown>;
    try {
      solved = await call(
        'solve',
        buildSolverPrompt({ format, question, options: choices.map((c) => ({ letter: c.letter, text: c.text })) }),
      );
    } catch (e) {
      return done('unverifiable', `solve failed: ${errText(e)}`);
    }
    if (solved.ill_posed === true) {
      return done('ill_posed', String(solved.ill_posed_reason ?? '').trim().slice(0, 240) || 'solver found the question ill-posed');
    }
    const solverAnswer = String(solved.final_answer ?? '').trim();
    const solverOption = String(solved.chosen_option ?? '').trim();
    if (!solverAnswer && !solverOption) return done('unverifiable', 'solver gave no answer');

    // 2. Compare — deterministic first, the judge only for what that cannot decide.
    let cmp: { verdict: JudgeVerdict; method: string; reason: string };
    try {
      cmp = await compareKeyWithJudge(
        { claimedAnswer: claimed, choices, solverAnswer, solverOption },
        async (a1, a2) => {
          const j = await call('judge', buildJudgePrompt(question, a1, a2));
          const verdict = String(j.verdict ?? '');
          if (!JUDGE_VERDICTS.has(verdict)) throw new Error(`judge returned an unknown verdict "${verdict.slice(0, 40)}"`);
          return { verdict: verdict as JudgeVerdict, reason: String(j.reason ?? '').trim() };
        },
      );
    } catch (e) {
      return done('unverifiable', `compare failed: ${errText(e)}`, solverAnswer || solverOption);
    }
    const shown = solverAnswer || solverOption;
    const reason = `${cmp.method}: ${cmp.reason}`.slice(0, 240);
    switch (cmp.verdict) {
      case 'SAME':
        return done('verified', reason, shown);
      case 'DIFFERENT':
        return done('mismatch', reason, shown);
      case 'KEY_INCOMPLETE':
        return done('mismatch', `key incomplete — ${reason}`.slice(0, 240), shown);
      default:
        return done('unverifiable', reason, shown);
    }
  } catch (e) {
    return done('unverifiable', `verifier error: ${errText(e)}`);
  }
}
