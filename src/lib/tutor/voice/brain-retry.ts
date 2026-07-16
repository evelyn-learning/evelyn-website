/**
 * Task X10 — brain empty-stream resilience: bounded retry + honest fallback.
 *
 * Pure decision helpers for the brain stream route. Kept free of the
 * Anthropic SDK and any I/O so they're trivially unit-testable (feed an
 * error shape / counters, assert the decision). The route owns the actual
 * loop, backoff sleep, and SSE plumbing.
 *
 * Background (2026-07-16, sessions portal-451eda30 + portal-d41353b0):
 * during a confirmed Anthropic "elevated errors" incident, brain turns
 * threw `overloaded_error` (529-class). The SDK client already retries
 * 5xx/429/408/409 twice by default (client.ts shouldRetry) — but those
 * retries fire fast (sub-second exponential backoff) and, during a
 * sustained incident, all hit the same overloaded upstream and exhaust,
 * so the error propagates to us as a thrown APIError. The route caught it
 * and surfaced `stop=error` with 0 sentences / 0 tools; the client then
 * spoke "could you say that again?" — with NO turn-level retry and,
 * worse, blaming a TYPED student for a server outage.
 *
 * This module adds a SECOND retry tier ON TOP of the SDK's: whole-turn
 * re-dispatch with a longer ~1s/2s backoff that gives the incident time
 * to recover between attempts, plus the layer at which we can attach
 * honest fallback UX + retry telemetry.
 */

/**
 * Classification of a thrown brain-turn error.
 *  - 'overloaded': Anthropic 529 / overloaded_error — the incident signal.
 *  - 'transient':  other retryable server / connection errors (mirrors the
 *    SDK's own shouldRetry policy: 408/409/429/5xx + connection errors).
 *  - 'fatal':      non-retryable (4xx auth/bad-request, user abort) — retrying
 *    would fail identically.
 *  - 'none':       no error (a clean but empty stream — NOT a retry trigger).
 */
export type BrainErrorKind = 'overloaded' | 'transient' | 'fatal' | 'none';

/**
 * Classify a thrown error from a brain turn WITHOUT importing the SDK — we
 * duck-type on `status` (HTTP status the SDK stamps on APIError) and the
 * Anthropic error payload's `type`, so this stays a pure function usable in
 * the unit suite. Policy intentionally matches Anthropic SDK client.ts
 * `shouldRetry` (retry 408/409/429/>=500) so our tier composes predictably
 * with the SDK's.
 */
export function classifyBrainError(err: unknown): Exclude<BrainErrorKind, 'none'> {
  const e = (err ?? {}) as {
    status?: number;
    name?: string;
    error?: { type?: string; error?: { type?: string } };
  };
  const errType = e.error?.error?.type ?? e.error?.type;
  if (errType === 'overloaded_error' || e.status === 529) return 'overloaded';

  // User abort = the client hung up. Never retry (the listener is gone).
  if (e.name === 'APIUserAbortError') return 'fatal';

  // Connection / timeout errors carry no HTTP status — worth one more try.
  if (typeof e.status !== 'number') {
    if (
      e.name === 'APIConnectionError' ||
      e.name === 'APIConnectionTimeoutError'
    ) {
      return 'transient';
    }
    // Bare Error (socket hang up, DNS, fetch failed) — treat as transient.
    return 'transient';
  }

  if (e.status === 408 || e.status === 409 || e.status === 429 || e.status >= 500) {
    return 'transient';
  }
  return 'fatal';
}

export interface BrainRetryDecisionInput {
  /** Classified error kind for the failure we're deciding on. */
  errorKind: BrainErrorKind;
  /** Sentences already streamed to the client THIS turn (across attempts). */
  sentencesEmitted: number;
  /** Tool calls already streamed to the client THIS turn (across attempts). */
  toolsEmitted: number;
  /** Retries already performed (0 on the first failure). */
  attempt: number;
  /** Max whole-turn retries. Default 2 (⇒ up to 3 total attempts). */
  maxRetries?: number;
}

export interface BrainRetryDecision {
  action: 'retry' | 'fallback';
  /** Backoff to sleep BEFORE the retry. 0 for a fallback decision. */
  delayMs: number;
  /** Machine-readable reason, for the turn telemetry log line. */
  reason:
    | 'partial-emitted'
    | 'no-error'
    | 'non-retryable'
    | 'retries-exhausted'
    | 'retry';
}

/** Backoff schedule (ms) indexed by attempt number: ~1s, then ~2s. */
const BACKOFF_MS = [1000, 2000];

/**
 * Decide whether to retry a failed/empty brain turn or fall back honestly.
 *
 * Cardinal safety rule (checked FIRST): if ANY sentence or tool call has
 * already reached the client this turn, NEVER retry — a re-dispatch would
 * double-speak or double-render. This is exactly the partial-stream shape;
 * the observed incident shape is the opposite (zero emitted), which is what
 * makes an automatic retry safe there.
 */
export function decideBrainRetry(input: BrainRetryDecisionInput): BrainRetryDecision {
  const { errorKind, sentencesEmitted, toolsEmitted, attempt } = input;
  const maxRetries = input.maxRetries ?? 2;

  // 1. Never retry a partially-played turn.
  if (sentencesEmitted > 0 || toolsEmitted > 0) {
    return { action: 'fallback', delayMs: 0, reason: 'partial-emitted' };
  }
  // 2. A clean empty stream (no thrown error) is not our retry path.
  if (errorKind === 'none') {
    return { action: 'fallback', delayMs: 0, reason: 'no-error' };
  }
  // 3. Non-retryable errors fail identically on retry.
  if (errorKind === 'fatal') {
    return { action: 'fallback', delayMs: 0, reason: 'non-retryable' };
  }
  // 4. Budget exhausted — give up honestly.
  if (attempt >= maxRetries) {
    return { action: 'fallback', delayMs: 0, reason: 'retries-exhausted' };
  }
  // 5. Retryable (overloaded / transient), zero content, budget remains.
  return {
    action: 'retry',
    delayMs: BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)],
    reason: 'retry',
  };
}
