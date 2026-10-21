/**
 * Outcome of one homework-problem session (GAC per-problem homework,
 * 2026-10-20), read by GET /api/portal/v1/homework-problem-outcome.
 *
 *   done          the browser recorded `homework_problem_done` (every key
 *                 part confirmed correct — voice/keyed-verdict.ts)
 *   needs_review  an unverified problem whose student's last turn says they
 *                 finished it (`claimsProblemFinished`), or ≥ 2 wrong keyed
 *                 verdicts on one part with no later correct one
 *   in_progress   anything else
 *
 * `priorNote`: two short lines for the next session on this problem, from the
 * `recap` model role; '' with no student turn or on any model failure.
 */

import { claimsSetFinished } from '../lesson-plan/homework-ledger';
import { KEYED_VERDICT_DEBUG_TYPE, parseKeyedVerdictDebug, allKeyPartsConfirmed } from '../voice/keyed-verdict';
import type { AnswerKey } from './types';

export { KEYED_VERDICT_DEBUG_TYPE };

export type HomeworkProblemOutcome = 'done' | 'in_progress' | 'needs_review';

export const HOMEWORK_PROBLEM_DONE_EVENT = 'homework_problem_done';

export const PRIOR_NOTE_INSTRUCTION = 'Two short lines: what the student did on this problem and where they stopped. No answers.';
export const PRIOR_NOTE_MAX_WORDS = 40;

type DebugEventLike = { type?: unknown; message?: unknown; timestamp?: unknown };
type TranscriptLike = { role?: unknown; text?: unknown; timestamp?: unknown };

const timeOf = (v: unknown): number | null => {
  if (v == null) return null;
  const t = v instanceof Date ? v.getTime() : new Date(v as string | number).getTime();
  return Number.isFinite(t) ? t : null;
};

/**
 * The keyed verdict events, one per (part, verdict) per student turn (R19c):
 * a stall re-dispatch of the same message records its verdict again, and two
 * records of ONE answer must never read as two wrong answers. The student
 * turn an event belongs to = the number of student transcript entries at or
 * before its timestamp; without a usable timestamp, consecutive identical
 * (part, verdict) events count once.
 */
export function dedupedKeyedVerdicts(
  events: ReadonlyArray<DebugEventLike>,
  transcript: ReadonlyArray<TranscriptLike> | null | undefined,
): Array<{ part: string; verdict: 'correct' | 'incorrect' }> {
  const studentTimes = (transcript ?? []).filter(isStudent).map((t) => timeOf(t.timestamp));
  const timed = studentTimes.length > 0 && studentTimes.every((t) => t !== null);
  const seen = new Set<string>();
  const out: Array<{ part: string; verdict: 'correct' | 'incorrect' }> = [];
  let prev: { part: string; verdict: string } | null = null;
  for (const e of events) {
    if (e?.type !== KEYED_VERDICT_DEBUG_TYPE) continue;
    const v = parseKeyedVerdictDebug(e.message);
    if (!v) continue;
    const at = timeOf(e.timestamp);
    if (timed && at !== null) {
      const turn = (studentTimes as number[]).filter((t) => t <= at).length;
      const k = `${v.part}|${v.value ?? ''}|${v.verdict}|${turn}`;
      if (seen.has(k)) continue;
      seen.add(k);
    } else if (prev && prev.part === v.part && prev.verdict === v.verdict) {
      continue;
    }
    prev = v;
    out.push(v);
  }
  return out;
}

/**
 * The student says they are finished with THIS problem ("done", "finished",
 * "that's it", "I'm done with this one", "got it, thanks") — or with the whole
 * set, which includes it. A question or a negation ("not done yet") is not.
 */
export function claimsProblemFinished(sentence: string): boolean {
  const t = String(sentence ?? '').replace(/\s+/g, ' ').trim();
  if (!t || /\?\s*$/.test(t)) return false;
  if (/\b(?:not|n't|never)\s+(?:quite\s+|yet\s+|really\s+)?(?:done|finished|complete)\b/i.test(t)) return false;
  return /\b(?:i'?m|i am|we'?re|we are|i'?ve|i have)\s+(?:all\s+|now\s+)?(?:done|finished|completed?)\b/i.test(t)
    || /^(?:ok(?:ay)?[,!.]?\s*)?(?:all\s+)?(?:done|finished)\s*[.!]*$/i.test(t)
    || /\bthat'?s\s+it\b/i.test(t)
    || /\b(?:done|finished)\s+with\s+(?:this|that|it)(?:\s+one)?\b/i.test(t)
    || /\bfinished\s+(?:this|that|it)(?:\s+one)?\b/i.test(t)
    || /\bgot\s+it,?\s+thanks?\b/i.test(t)
    || claimsSetFinished(t);
}

const isStudent = (t: TranscriptLike) => t?.role === 'student' && typeof t.text === 'string' && t.text.trim() !== '';

export function classifyHomeworkProblemOutcome(input: {
  debugEvents: ReadonlyArray<DebugEventLike> | null | undefined;
  transcript: ReadonlyArray<TranscriptLike> | null | undefined;
  /** The plan's `verified` flag; null when the plan could not be read. */
  verified: boolean | null;
  /** 2026-10-21 (hw-11): the host's finish button was pressed (GET …?finished=1).
   *  Done when every key part is confirmed by the transcript, else needs_review —
   *  never left "in progress" after the student said they finished. */
  finished?: boolean;
  /** The verified key, for the finished check; null/undefined when there is none. */
  key?: AnswerKey | null;
}): HomeworkProblemOutcome {
  const events = Array.isArray(input.debugEvents) ? input.debugEvents : [];
  if (events.some((e) => e?.type === HOMEWORK_PROBLEM_DONE_EVENT)) return 'done';
  if (input.finished) {
    const history = (input.transcript ?? []).filter(isStudent).map((t) => ({ role: 'user' as const, content: String(t.text) }));
    if (input.key?.parts?.length && allKeyPartsConfirmed(history, '', input.key)) return 'done';
    return 'needs_review';
  }
  if (input.verified === false) {
    const lastStudent = [...(input.transcript ?? [])].reverse().find(isStudent);
    if (lastStudent && claimsProblemFinished(String(lastStudent.text))) return 'needs_review';
  }
  // Per part: wrong verdicts since the last correct one.
  const wrongSinceCorrect = new Map<string, number>();
  for (const v of dedupedKeyedVerdicts(events, input.transcript)) {
    wrongSinceCorrect.set(v.part, v.verdict === 'correct' ? 0 : (wrongSinceCorrect.get(v.part) ?? 0) + 1);
  }
  if ([...wrongSinceCorrect.values()].some((n) => n >= 2)) return 'needs_review';
  return 'in_progress';
}

export interface PriorNoteDeps {
  /** The model call: `instruction` is the system prompt, `transcript` the user message. */
  summarize?: (req: { instruction: string; transcript: string }) => Promise<string>;
}

const TRANSCRIPT_MAX_CHARS = 8000;

function transcriptText(transcript: ReadonlyArray<TranscriptLike>): string {
  const lines = transcript
    .filter((t) => (t?.role === 'student' || t?.role === 'tutor') && typeof t.text === 'string' && t.text.trim())
    .map((t) => `${t.role === 'student' ? 'STUDENT' : 'TUTOR'}: ${String(t.text).replace(/\s+/g, ' ').trim()}`);
  let out = lines.join('\n');
  if (out.length > TRANSCRIPT_MAX_CHARS) out = out.slice(out.length - TRANSCRIPT_MAX_CHARS);
  return out;
}

async function recapSummarize(req: { instruction: string; transcript: string }): Promise<string> {
  const { getModelClient, prepareParams } = await import('../ai/model-registry');
  const { client, model } = getModelClient('recap');
  const res = await client.messages.create(prepareParams('recap', {
    model,
    max_tokens: 150,
    system: req.instruction,
    messages: [{ role: 'user' as const, content: req.transcript }],
  }));
  return res.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')
    .trim();
}

export async function homeworkProblemPriorNote(transcript: ReadonlyArray<TranscriptLike> | null | undefined, deps: PriorNoteDeps = {}): Promise<string> {
  const list = Array.isArray(transcript) ? transcript : [];
  if (!list.some(isStudent)) return '';
  try {
    const raw = await (deps.summarize ?? recapSummarize)({ instruction: PRIOR_NOTE_INSTRUCTION, transcript: transcriptText(list) });
    const words = String(raw ?? '').replace(/[<>]/g, ' ').trim().split(/\s+/).filter(Boolean);
    return words.slice(0, PRIOR_NOTE_MAX_WORDS).join(' ');
  } catch (err) {
    console.warn('[homework-problem-outcome] prior note failed:', (err as Error)?.message ?? err);
    return '';
  }
}
