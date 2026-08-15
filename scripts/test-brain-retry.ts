/**
 * Task X10 — brain empty-stream resilience. Unit suite for the pure retry
 * decision + error classification helpers used by the brain stream route.
 *
 * Context (2026-07-16 incident): during a confirmed Anthropic "elevated
 * errors" event, brain turns threw `overloaded_error` (529-class) and the
 * route surfaced `stop=error` with 0 sentences / 0 tools, then the client
 * spoke "could you say that again?" — even for TYPED input — with NO retry.
 * These helpers make the retry decision testable in isolation: given the
 * error kind + how much of the turn already streamed + how many retries
 * we've done, decide retry-vs-give-up. The cardinal safety rule is
 * NEVER retry a partially-played turn (would double-speak / double-render).
 *
 * Run: npm run test:brain-retry
 */
import {
  classifyBrainError,
  decideBrainRetry,
} from '../apps/marketing/src/lib/tutor/voice/brain-retry';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

// ── classifyBrainError ────────────────────────────────────────────
{
  // overloaded_error (529-class) is the incident signal. Recognised via
  // either the status code OR the Anthropic error.type payload.
  check(
    'classify: status 529 → overloaded',
    classifyBrainError({ status: 529 }) === 'overloaded',
  );
  check(
    'classify: error.type overloaded_error → overloaded',
    classifyBrainError({ error: { error: { type: 'overloaded_error' } } }) === 'overloaded',
  );
  check(
    'classify: nested type variant (single-level) → overloaded',
    classifyBrainError({ error: { type: 'overloaded_error' } }) === 'overloaded',
  );
  // Other transient/server errors mirror the SDK's own shouldRetry policy.
  check('classify: 500 → transient', classifyBrainError({ status: 500 }) === 'transient');
  check('classify: 503 → transient', classifyBrainError({ status: 503 }) === 'transient');
  check('classify: 429 rate-limit → transient', classifyBrainError({ status: 429 }) === 'transient');
  check('classify: 408 timeout → transient', classifyBrainError({ status: 408 }) === 'transient');
  check('classify: 409 lock → transient', classifyBrainError({ status: 409 }) === 'transient');
  // Connection errors (no HTTP status) are transient — worth one more try.
  check(
    'classify: connection error (no status) → transient',
    classifyBrainError(new Error('socket hang up')) === 'transient',
  );
  check(
    'classify: APIConnectionError name → transient',
    classifyBrainError({ name: 'APIConnectionError' }) === 'transient',
  );
  // A user abort is the client disconnecting — never worth retrying.
  check(
    'classify: user abort → fatal',
    classifyBrainError({ name: 'APIUserAbortError' }) === 'fatal',
  );
  // Client-side 4xx (bad prompt, auth) will fail identically on retry.
  check('classify: 400 → fatal', classifyBrainError({ status: 400 }) === 'fatal');
  check('classify: 401 → fatal', classifyBrainError({ status: 401 }) === 'fatal');
  check('classify: 404 → fatal', classifyBrainError({ status: 404 }) === 'fatal');
}

// ── decideBrainRetry: the cardinal safety rule ────────────────────
{
  // NEVER retry once ANY event reached the client — even on an
  // overloaded error mid-stream. Retrying would cause duplication.
  check(
    'decide: overloaded but 1 sentence already streamed → fallback',
    decideBrainRetry({ errorKind: 'overloaded', sentencesEmitted: 1, toolsEmitted: 0, attempt: 0 }).action === 'fallback',
  );
  check(
    'decide: overloaded but 1 tool already streamed → fallback',
    decideBrainRetry({ errorKind: 'overloaded', sentencesEmitted: 0, toolsEmitted: 1, attempt: 0 }).action === 'fallback',
  );
  check(
    'decide: tool-rejected sent but sentences=0 tools=0 → fallback (emittedToClient guards)',
    decideBrainRetry({ errorKind: 'overloaded', sentencesEmitted: 0, toolsEmitted: 0, emittedToClient: 1, attempt: 0 }).action === 'fallback',
  );
  check(
    'decide: partial-emitted reason is explicit (emittedToClient path)',
    decideBrainRetry({ errorKind: 'transient', sentencesEmitted: 0, toolsEmitted: 0, emittedToClient: 1, attempt: 0 }).reason === 'partial-emitted',
  );
  check(
    'decide: partial-emitted reason is explicit (per-type counters)',
    decideBrainRetry({ errorKind: 'transient', sentencesEmitted: 2, toolsEmitted: 1, attempt: 0 }).reason === 'partial-emitted',
  );
}

// ── decideBrainRetry: the happy retry path (the observed shape) ────
{
  // The exact live shape: overloaded_error, 0 sentences, 0 tools, first try.
  const d0 = decideBrainRetry({ errorKind: 'overloaded', sentencesEmitted: 0, toolsEmitted: 0, attempt: 0 });
  check('decide: overloaded + zero content + attempt 0 → retry', d0.action === 'retry');
  check('decide: attempt 0 backoff ~1s', d0.delayMs === 1000);

  const d1 = decideBrainRetry({ errorKind: 'overloaded', sentencesEmitted: 0, toolsEmitted: 0, attempt: 1 });
  check('decide: overloaded + zero content + attempt 1 → retry', d1.action === 'retry');
  check('decide: attempt 1 backoff ~2s', d1.delayMs === 2000);

  check(
    'decide: transient + zero content → retry',
    decideBrainRetry({ errorKind: 'transient', sentencesEmitted: 0, toolsEmitted: 0, attempt: 0 }).action === 'retry',
  );
}

// ── decideBrainRetry: exhaustion + non-retryable → fallback ────────
{
  // After maxRetries (default 2) retries, give up honestly.
  const d2 = decideBrainRetry({ errorKind: 'overloaded', sentencesEmitted: 0, toolsEmitted: 0, attempt: 2 });
  check('decide: attempt 2 == maxRetries → fallback (exhausted)', d2.action === 'fallback');
  check('decide: exhausted reason is explicit', d2.reason === 'retries-exhausted');
  check('decide: fallback carries no backoff', d2.delayMs === 0);

  check(
    'decide: custom maxRetries=1 exhausts at attempt 1',
    decideBrainRetry({ errorKind: 'overloaded', sentencesEmitted: 0, toolsEmitted: 0, attempt: 1, maxRetries: 1 }).action === 'fallback',
  );

  // Fatal errors never retry, even on the first failure with zero content.
  check(
    'decide: fatal error → fallback immediately',
    decideBrainRetry({ errorKind: 'fatal', sentencesEmitted: 0, toolsEmitted: 0, attempt: 0 }).action === 'fallback',
  );
  check(
    'decide: fatal reason is non-retryable',
    decideBrainRetry({ errorKind: 'fatal', sentencesEmitted: 0, toolsEmitted: 0, attempt: 0 }).reason === 'non-retryable',
  );

  // A clean empty stream (no error) is not the retry path — the brain
  // legitimately produced nothing; retrying would likely repeat it.
  check(
    'decide: errorKind none → fallback (not our retry path)',
    decideBrainRetry({ errorKind: 'none', sentencesEmitted: 0, toolsEmitted: 0, attempt: 0 }).action === 'fallback',
  );
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
