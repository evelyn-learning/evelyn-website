/**
 * Task H5 (Layer 1) — deterministic gates over a captured pedagogy-harness
 * `Bundle` (Task H4, ./run-harness). Hard pass/fail structural checks — see
 * the plan's "Testing & Reporting Protocol" (docs/superpowers/plans/
 * 2026-07-02-tutor-pedagogy-opener-calibration.md): "A failing gate blocks
 * the task." Pure — no network, no I/O; every gate reads only the Bundle.
 *
 * A registry maps a plan taskId (e.g. "B2", the Scenario Matrix's row keys)
 * to the gate ids that task's L1 column exercises. `runGates` looks up the
 * taskId and runs just those gates; an unknown taskId returns `[]` (by
 * design — this module only wires up the concrete, Bundle-checkable gates
 * this task ships; a task with no L1 gates registered yet, or a typo'd
 * taskId, both fail open to "nothing to check" rather than throwing).
 */
import type { Bundle } from './run-harness';

export type GateResult = { id: string; ok: boolean; detail: string };
type GateFn = (bundle: Bundle) => GateResult;

/** Banned sell-initiating phrases (E2/B: "the brain never emits a
 *  sell-initiating utterance"). Exported so the report/tests can reference
 *  the same list the gate checks. */
export const BANNED_SELL_PHRASES: RegExp[] = [
  /\bsign up\b/i,
  /\bsubscribe\b/i,
  /\benroll now\b/i,
  /\bupgrade\b/i,
];

/** B2 — the tutor produced the opener turn (turn 0 exists with non-empty
 *  tutorText). In a Bundle the tutor's turn precedes the student's reply by
 *  construction (see BundleTurn), so a non-empty turns[0].tutorText IS the
 *  proactive first turn having fired. */
function gateProactiveOpener(bundle: Bundle): GateResult {
  const opener = bundle.turns[0];
  const ok = !!opener && typeof opener.tutorText === 'string' && opener.tutorText.trim().length > 0;
  return {
    id: 'proactive-opener',
    ok,
    detail: ok
      ? `turn 0 tutorText present ("${opener.tutorText.slice(0, 60)}${opener.tutorText.length > 60 ? '…' : ''}")`
      : 'turns[0] is missing or its tutorText is empty/whitespace',
  };
}

/** B3 — something was drawn on the opener turn (board never blank on
 *  turn 1, including via the fail-to-simple fallback, which still renders
 *  A tool call). */
function gateBoardNotBlank(bundle: Bundle): GateResult {
  const opener = bundle.turns[0];
  const count = opener?.toolCalls?.length ?? 0;
  const ok = count > 0;
  return {
    id: 'board-not-blank',
    ok,
    detail: ok ? `${count} tool call(s) attributed to the opener turn` : 'turns[0].toolCalls is empty or turns[0] is missing',
  };
}

/** E2/B — no tutorText anywhere in the transcript contains a banned
 *  sell-initiating phrase (the brain never initiates a sell; the UI owns
 *  the CTA — see decision "demo philosophy" in the plan). */
function gateNoSellPhrase(bundle: Bundle): GateResult {
  const hits: string[] = [];
  for (const turn of bundle.turns) {
    for (const re of BANNED_SELL_PHRASES) {
      if (re.test(turn.tutorText)) hits.push(`turn ${turn.index} matched ${re}`);
    }
  }
  return {
    id: 'no-sell-phrase',
    ok: hits.length === 0,
    detail: hits.length > 0 ? hits.join('; ') : 'no banned sell-initiating phrases found in any tutor turn',
  };
}

/** Best-effort read of a loosely-typed `sessionResult` (the Bundle types it
 *  as `unknown` — see run-harness.ts's doc comment: no real hook wires it up
 *  for the demo/picker path today). Returns true if it carries ANY non-empty
 *  learningStateDelta or socialMemoryDelta write. */
function hasDeltaWrites(sessionResult: unknown): boolean {
  if (!sessionResult || typeof sessionResult !== 'object') return false;
  const sr = sessionResult as Record<string, unknown>;

  const lsd = sr.learningStateDelta as Record<string, unknown> | undefined;
  if (lsd && typeof lsd === 'object') {
    const gaps = lsd.gaps as Record<string, unknown[]> | undefined;
    if (gaps) {
      if ((gaps.new?.length ?? 0) > 0) return true;
      if ((gaps.promoted?.length ?? 0) > 0) return true;
      if ((gaps.resolved?.length ?? 0) > 0) return true;
    }
    if (Array.isArray(lsd.mastery) && lsd.mastery.length > 0) return true;
  }

  const smd = sr.socialMemoryDelta as Record<string, unknown[]> | undefined;
  if (smd && typeof smd === 'object') {
    if ((smd.new?.length ?? 0) > 0) return true;
    if ((smd.referenced?.length ?? 0) > 0) return true;
  }

  return false;
}

/** Privacy — for a demo-mode bundle, zero persistence: `sessionResult` is
 *  absent entirely, OR present but carries no learningStateDelta/
 *  socialMemoryDelta writes (empty arrays are fine — a well-formed
 *  no-delta snapshot, per assembleBundle's "never fabricated" contract). */
function gateZeroPersistenceDemo(bundle: Bundle): GateResult {
  if (bundle.sessionResult === undefined) {
    return { id: 'zero-persistence-demo', ok: true, detail: 'no sessionResult emitted for this demo session' };
  }
  const writes = hasDeltaWrites(bundle.sessionResult);
  return {
    id: 'zero-persistence-demo',
    ok: !writes,
    detail: writes
      ? 'sessionResult carries a non-empty learningStateDelta and/or socialMemoryDelta write for a demo session'
      : 'sessionResult present but carries no non-empty delta writes',
  };
}

const GATES: Record<string, GateFn> = {
  'proactive-opener': gateProactiveOpener,
  'board-not-blank': gateBoardNotBlank,
  'no-sell-phrase': gateNoSellPhrase,
  'zero-persistence-demo': gateZeroPersistenceDemo,
};

/** taskId (Scenario Matrix row) -> gate ids that taskId's L1 column
 *  exercises, per docs/superpowers/plans/2026-07-02-tutor-pedagogy-opener-
 *  calibration.md. Only the gates this task ships are wired up; other
 *  Scenario Matrix rows (B4, C2, D1, D2, ...) have L1 columns that are NOT
 *  Bundle-checkable with the fields captured today (they need brain-prompt
 *  snapshots, academy DB reads, etc.) and are intentionally left
 *  unregistered rather than faked. */
const REGISTRY: Record<string, string[]> = {
  B2: ['proactive-opener'],
  B3: ['board-not-blank'],
  E2: ['no-sell-phrase'],
  D3: ['zero-persistence-demo'],
};

/**
 * Runs the Layer-1 deterministic gates registered for `taskId` against
 * `bundle`. Unknown taskId -> `[]` (documented above): nothing to check,
 * not an error.
 */
export function runGates(bundle: Bundle, taskId: string): GateResult[] {
  const ids = REGISTRY[taskId];
  if (!ids) return [];
  return ids.map((id) => GATES[id](bundle));
}
