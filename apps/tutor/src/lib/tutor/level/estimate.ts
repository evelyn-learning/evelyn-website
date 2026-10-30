/**
 * Working-level estimate fallback (Task 14 §G, GDI run 4: the brain never
 * called set_working_level, so the whole lesson ran unlevelled).
 *
 * When the client leaves the level-check segment with no level held, it
 * posts the student's turns from that segment to POST
 * /api/tutor/level/estimate; one non-streaming call to the brain model
 * answers strict JSON `{ "level", "evidence" }`, and the client applies the
 * level through the same path as a set_working_level tool result.
 *
 * Gate (404-first, like the pronunciation assess route): the
 * TUTOR_WORKING_LEVEL_ESTIMATE + TUTOR_WORKING_LEVEL flags, a LIVE session
 * (status 'active', no endedAt) whose partner has the `levelCheck` option.
 * Anything else — including an unknown session or a malformed body — is a
 * 404, so other tenants cannot discover the route.
 *
 * The handler takes its I/O as deps so the gating and the parsing are
 * testable with a stubbed model (scripts/test-level-estimate.ts).
 */
import { resolvePartnerSessionOptions } from '@/lib/tutor/portal/partner-session-options';
import { sessionAllowsAssess, CallBudget } from '@/lib/tutor/pronunciation/assess-request';
import { WORKING_LEVELS, parseWorkingLevel, type WorkingLevel } from './working-level';

export const LEVEL_ESTIMATE_TIMEOUT_MS = 10_000;
export const LEVEL_ESTIMATE_MAX_TOKENS = 200;
export const LEVEL_ESTIMATE_MAX_BODY_BYTES = 32 * 1024;
export const LEVEL_ESTIMATE_MAX_ANSWERS = 20;
export const LEVEL_ESTIMATE_MAX_ANSWER_CHARS = 1000;
export const LEVEL_ESTIMATE_MAX_EVIDENCE_WORDS = 30;
/** Model calls per session per process (one is the normal case). */
export const LEVEL_ESTIMATE_MAX_CALLS = 3;

export function levelEstimateRouteEnabled(flagsOn: boolean, partnerId: string | null | undefined): boolean {
  return flagsOn && resolvePartnerSessionOptions({ partnerId }).levelCheck;
}

export interface LevelEstimateBody { sessionId: string; answers: string[]; levels: WorkingLevel[] }

/** The request body, or null (⇒ 404). `levels` defaults to all three; any
 *  unknown level makes the body invalid. Answers are trimmed, empty ones
 *  dropped, each capped; at least one answer is required. */
export function parseLevelEstimateBody(body: unknown): LevelEstimateBody | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as { sessionId?: unknown; answers?: unknown; levels?: unknown };
  if (typeof b.sessionId !== 'string' || !b.sessionId.trim()) return null;
  if (!Array.isArray(b.answers)) return null;
  const answers = b.answers
    .filter((a): a is string => typeof a === 'string')
    .map((a) => a.trim().slice(0, LEVEL_ESTIMATE_MAX_ANSWER_CHARS))
    .filter(Boolean)
    .slice(-LEVEL_ESTIMATE_MAX_ANSWERS);
  if (answers.length === 0) return null;
  let levels: WorkingLevel[] = [...WORKING_LEVELS];
  if (b.levels !== undefined) {
    if (!Array.isArray(b.levels) || b.levels.length === 0) return null;
    const parsed = b.levels.map(parseWorkingLevel);
    if (parsed.some((l) => l === null)) return null;
    levels = [...new Set(parsed as WorkingLevel[])];
  }
  return { sessionId: b.sessionId.trim(), answers, levels };
}

export const LEVEL_ESTIMATE_SYSTEM =
  'You place an adult English learner at a working level for the rest of a lesson, from what they said during a short spoken level check. ' +
  'Beginner: short sentences, familiar words, needs help to understand or answer, may answer in their first language. ' +
  'Intermediate: connected sentences with grammar or vocabulary errors. ' +
  'Advanced: fluent, varied vocabulary, complex sentences. ' +
  'The answers are speech-recognition transcripts: ignore fillers and recognition noise. ' +
  'Reply with ONLY a JSON object and nothing else: {"level": "<one of the allowed levels>", "evidence": "<at most 30 words>"}';

export function buildLevelEstimateUserMessage(answers: readonly string[], levels: readonly WorkingLevel[]): string {
  return [
    `Allowed levels: ${levels.join(', ')}.`,
    'The learner\'s answers, in order:',
    ...answers.map((a, i) => `${i + 1}. ${a}`),
  ].join('\n');
}

/** The model's reply → { level, evidence }, or null. The first {...} object
 *  in the reply is parsed (a code fence or a stray word around it is
 *  forgiven); the level must be one of `levels`; evidence is cut to 30 words. */
export function parseLevelEstimateReply(raw: string, levels: readonly WorkingLevel[]): { level: WorkingLevel; evidence: string } | null {
  const m = (raw ?? '').match(/\{[\s\S]*?\}/);
  if (!m) return null;
  let obj: unknown;
  try { obj = JSON.parse(m[0]); } catch { return null; }
  const o = obj as { level?: unknown; evidence?: unknown };
  const level = parseWorkingLevel(o.level);
  if (!level || !levels.includes(level)) return null;
  const words = (typeof o.evidence === 'string' ? o.evidence : '').trim().split(/\s+/).filter(Boolean);
  return { level, evidence: words.slice(0, LEVEL_ESTIMATE_MAX_EVIDENCE_WORDS).join(' ') };
}

export interface LevelEstimateDeps {
  /** both flags (TUTOR_WORKING_LEVEL_ESTIMATE && TUTOR_WORKING_LEVEL) */
  enabled: boolean;
  findSession: (sessionId: string) => Promise<{ sourcePartnerId?: string; status?: string; endedAt?: Date | string | null } | null>;
  /** one non-streaming model call; resolves to the reply text */
  callModel: (args: { system: string; user: string; maxTokens: number; signal: AbortSignal }) => Promise<string>;
  budget?: CallBudget;
  timeoutMs?: number;
}

export type LevelEstimateResult =
  | { status: 404 }
  | { status: 429; body: { status: 'unavailable'; reason: 'budget' } }
  | { status: 200; body: { status: 'ok'; level: WorkingLevel; evidence: string } }
  | { status: 200; body: { status: 'unavailable'; reason: 'timeout' | 'model_error' | 'bad_reply' } };

const defaultBudget = new CallBudget(LEVEL_ESTIMATE_MAX_CALLS);

/** The route's logic: `body` is the parsed JSON (or undefined when it could
 *  not be read). */
export async function handleLevelEstimate(body: unknown, deps: LevelEstimateDeps): Promise<LevelEstimateResult> {
  if (!deps.enabled) return { status: 404 };
  const parsed = parseLevelEstimateBody(body);
  if (!parsed) return { status: 404 };
  const session = await deps.findSession(parsed.sessionId);
  if (!session || !sessionAllowsAssess(session) || !levelEstimateRouteEnabled(deps.enabled, session.sourcePartnerId)) return { status: 404 };
  if (!(deps.budget ?? defaultBudget).take(parsed.sessionId)) return { status: 429, body: { status: 'unavailable', reason: 'budget' } };
  const ctrl = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; ctrl.abort(); }, deps.timeoutMs ?? LEVEL_ESTIMATE_TIMEOUT_MS);
  let raw: string;
  try {
    raw = await deps.callModel({
      system: LEVEL_ESTIMATE_SYSTEM,
      user: buildLevelEstimateUserMessage(parsed.answers, parsed.levels),
      maxTokens: LEVEL_ESTIMATE_MAX_TOKENS,
      signal: ctrl.signal,
    });
  } catch {
    return { status: 200, body: { status: 'unavailable', reason: timedOut ? 'timeout' : 'model_error' } };
  } finally {
    clearTimeout(timer);
  }
  const est = parseLevelEstimateReply(raw, parsed.levels);
  if (!est) return { status: 200, body: { status: 'unavailable', reason: 'bad_reply' } };
  return { status: 200, body: { status: 'ok', ...est } };
}
