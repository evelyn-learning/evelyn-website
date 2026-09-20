# Holistic-Pedagogy Round — Plan 1 (engine-only) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship, engine-side only, the struggle ledger with inferred gaps and recurrence (A), the consent-gated recap at three triggers (B), the false-praise-opener guard (D), and the engine half of the homework loop plus the widened "knows the student" boot context (C.1–C.7), behind default-ON flags, with `TUTOR_LEARNER_CONTEXT=on` added to the prod env.

**Architecture:** Every new decision lives in a pure module under `src/lib/tutor/{orchestrator,voice,learner-model,practice-assign}` with its own `scripts/test-*.ts` battery; `VoiceTutorRealtime.tsx` only wires refs and events. Server work lands in the existing `student-profile/[id]` route (widened boot block + commit fields), one new embed-token-gated route (`practice-assign`), and one new model (`PracticeAssignment`). The brain sees new state only through per-turn user-content blocks (`claude-brain.ts` formatters) and opening-directive clauses (`system-prompt-builder.ts`), never through the cached system prefix.

**Tech Stack:** Next.js 15 route handlers, React refs in the orchestrator, Mongoose models, zod (contract), `npx tsx` node:assert batteries registered as `test:*` scripts.

**Spec:** `docs/superpowers/specs/2026-09-05-tutor-holistic-pedagogy-round-design.md` (read it first; section letters below refer to it). Grounding: `docs/superpowers/reports/2026-09-05-pedagogy-round-investigation.md`.

## Global Constraints

- Work ONLY in worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-rounds` (branch `tutor-rounds`); `git rev-parse --git-dir` must contain `.git/worktrees/`. Never the repo root.
- All engine paths below are relative to `apps/tutor/` unless they start with `packages/` or `docs/`.
- New flags are `process.env.NEXT_PUBLIC_<NAME> !== 'off'` in `src/lib/tutor/orchestrator/flags.ts` (default ON). Do not change any existing `=== 'on'` flag.
- No new value may be added to any contract enum (`GapSignalCode`, `SocialThread.kind`, `SessionMilestone`). Engine-only fields on `GapEntry`/`GapEvidence` are allowed (contract objects strip unknown keys).
- Prompt text stays generic: no subject-specific examples in any clause or tool description.
- Every regex that can KILL a turn is replayed against the live sentences in §D.4 of the spec before its test is written.
- Tests: `npx tsx scripts/test-<name>.ts`, node:assert style (`check(name, cond)`), registered in `package.json` as `"test:<name>"` so `test:all` picks them up. Gate at ship: `npx tsc --noEmit -p .` clean, `npm run build` clean, `npm run test:all` with only the 4 known pre-existing reds (`test:embed-token` gate-mode fixture, `test:verdict-guard` non-answer branch, `test:pedagogy-posed-problem`, `test:pedagogy-d1`).
- Commit after every task with the trailer:
  `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_017HSQzGrkRuuzVWbUCnDZ8x`.
- Deploy is Praveen-gated: never run `./deploy-tutor.sh` without his explicit go for THIS round.

---

## File structure

| File | Responsibility |
|---|---|
| `src/lib/tutor/orchestrator/flags.ts` (modify) | four new default-ON flags |
| `src/app/tutor-portal/embed/page.tsx` (modify) | new debug-event prefixes; `practice_locator` / `goal_note` config fields |
| `src/lib/tutor/orchestrator/struggle-ledger.ts` (create) | pure per-LO struggle scoring, detection, recurrence, shared regexes |
| `src/lib/tutor/student-profile/types.ts` (modify) | `GapEvidence.{recurrenceCount,inferred,recap}`, `RecapRecord`, `StudentProfile.nextSessionIntent` |
| `src/lib/tutor/student-profile/store.ts` (modify) | `recordGap` merges recurrence/recap, inferred confidence cap |
| `src/models/StudentProfile.ts` (modify) | persist `nextSessionIntent` |
| `src/app/api/tutor/student-profile/[id]/route.ts` (modify) | commit body fields; boot extras; auto-assign fallback; acknowledge |
| `packages/core/src/knowledge/types.ts` (modify) | `recurrence` on gap actions; new `closeSessionNotes` action |
| `src/app/tutor/hooks/toolDefinitions.ts` (modify) | `recurrence` arg; new `close_session_notes` tool + mapper |
| `src/lib/tutor/ai/system-prompt-builder.ts` (modify) | re-fire rule; closing section; continuity clause builders |
| `src/lib/tutor/voice/recap-reply.ts` (create) | pure accept/decline/unclear classifier |
| `src/lib/tutor/voice/claude-brain.ts` + `src/app/api/tutor/brain/stream/route.ts` (modify) | `<recap_offer>`, `<recap_go>`, `<recap_wrap>`, `<recap_offer_reply>` blocks |
| `src/lib/tutor/voice/false-praise-opener.ts` (create) | pure guard (D.2) |
| `src/lib/tutor/voice/praise-contradiction.ts` (modify) | bare-praise + bare-denial branch (D.3) |
| `src/models/PracticeAssignment.ts` (create) + `src/models/index.ts` | assignment record |
| `src/lib/tutor/practice-assign/resolve.ts` (create) | pure item resolver over `PracticeSources` |
| `src/lib/tutor/practice-assign/status.ts` (create) | pure homework status from evidence rows |
| `src/lib/tutor/practice-assign/store.ts` (create) | upsert / open / acknowledge |
| `src/app/api/tutor/practice-assign/route.ts` (create) | embed-token-gated assign route |
| `src/lib/tutor/learner-model/recap-candidate.ts` (create) | pure trigger-3 picker |
| `src/lib/tutor/learner-model/context-block.ts` (modify) | widened block + structured extras |
| `src/lib/tutor/portal/extract-social-threads.ts` (modify) | goals as `Goal:` context threads |
| `src/lib/tutor/student-profile/transient-context.ts` (modify) | `practice locator:` and `goal:` lines |
| `src/app/tutor/components/VoiceTutorRealtime.tsx` (modify) | ledger, recap state machine, guard wiring, close tool, opener clauses |
| `src/app/tutor/components/session/TutorSession.tsx` (modify) | thread two new props |
| `src/app/tutor/page.tsx` (modify) | summary-screen homework line |
| `scripts/test-{struggle-ledger,recap-reply,recap-blocks,false-praise-opener,practice-assign,homework-status,recap-candidate,learner-context,goal-threads}.ts` (create) | batteries |
| `.env.local.production` (root AND worktree, byte-identical) | `TUTOR_LEARNER_CONTEXT=on` |

---

### Task 1: Flags and debug-event prefixes

**Files:**
- Modify: `src/lib/tutor/orchestrator/flags.ts` (append after `TUTOR_KILL_WITHHOLDS_ADVANCE`, ~line 125)
- Modify: `src/app/tutor-portal/embed/page.tsx` (the `EMBED_DEBUG_EVENT_PREFIXES` array, ~line 150-170)
- Test: `scripts/test-embed-debug-coverage.ts` (existing)

**Interfaces:**
- Produces: `TUTOR_STRUGGLE_LEDGER`, `TUTOR_RECAP_OFFER`, `TUTOR_CLOSE_NOTES`, `TUTOR_FALSE_PRAISE_OPENER` (all `boolean`, exported from `flags.ts`).

- [ ] **Step 1: Add the four flags**

```ts
/** Holistic-pedagogy round (2026-09-05, spec §A.8): per-LO struggle ledger —
 *  inferred gaps + in-session recurrence. Default ON;
 *  NEXT_PUBLIC_TUTOR_STRUGGLE_LEDGER=off is the switch. */
export const TUTOR_STRUGGLE_LEDGER =
  process.env.NEXT_PUBLIC_TUTOR_STRUGGLE_LEDGER !== 'off';
/** Spec §B.8: consent-gated recap offers (mid-session recurrence + session
 *  start). Default ON; NEXT_PUBLIC_TUTOR_RECAP_OFFER=off is the switch. */
export const TUTOR_RECAP_OFFER =
  process.env.NEXT_PUBLIC_TUTOR_RECAP_OFFER !== 'off';
/** Spec §C.10: close_session_notes tool, practice-assign call, fallback,
 *  summary line. Default ON; NEXT_PUBLIC_TUTOR_CLOSE_NOTES=off is the switch. */
export const TUTOR_CLOSE_NOTES =
  process.env.NEXT_PUBLIC_TUTOR_CLOSE_NOTES !== 'off';
/** Spec §D.5: false-praise-opener guard + praise-contradiction widening.
 *  Default ON; NEXT_PUBLIC_TUTOR_FALSE_PRAISE_OPENER=off is the switch. */
export const TUTOR_FALSE_PRAISE_OPENER =
  process.env.NEXT_PUBLIC_TUTOR_FALSE_PRAISE_OPENER !== 'off';
```

- [ ] **Step 2: Add the debug-event prefixes** to `EMBED_DEBUG_EVENT_PREFIXES` in `embed/page.tsx`, as a new grouped comment block at the end of the array:

```ts
  // Holistic-pedagogy round (2026-09-05): ledger / recap / homework / guard.
  'gap_inferred', 'gap_recurred',
  'recap_offer_armed', 'recap_offer_reply', 'recap_started', 'recap_returned',
  'recap_wrap_nudged', 'recap_overrun',
  'practice_assigned', 'practice_assigned_auto', 'practice_assign_failed',
  'homework_checked',
  'false_praise_opener_kill', 'false_praise_opener_advisory',
```

- [ ] **Step 3: Run the coverage test**

Run: `npm run test:embed-debug-coverage`
Expected: PASS (it only checks that every `onDebugEvent?.('<name>'` in the runtime has a prefix; nothing emits yet, so it stays green — this step proves the list parses).

- [ ] **Step 4: Typecheck and commit**

Run: `npx tsc --noEmit -p .` → 0 errors.
```bash
git add src/lib/tutor/orchestrator/flags.ts src/app/tutor-portal/embed/page.tsx
git commit -m "feat(tutor): flags + debug prefixes for the holistic-pedagogy round"
```

---

### Task 2: Struggle ledger (pure module)

**Files:**
- Create: `src/lib/tutor/orchestrator/struggle-ledger.ts`
- Test: `scripts/test-struggle-ledger.ts`; register `"test:struggle-ledger": "npx tsx scripts/test-struggle-ledger.ts"` in `package.json`

**Interfaces:**
- Produces:
```ts
export type LedgerEventKind = 'wrong' | 'no_recovery' | 'stuck_cue' | 'slow_segment' | 'confusion' | 'brain_gap';
export interface LedgerEvent { kind: LedgerEventKind; loId: string; segId: string; atMs: number }
export interface LoLedger { score: number; events: LedgerEvent[]; detections: number; lastDetectionAtMs?: number; lastDetectionSegId?: string; inferredPushed: boolean; recovered: boolean }
export type LedgerState = Map<string, LoLedger>;
export interface LedgerDetection { loId: string; count: number; recurrence: boolean; signals: GapSignalCode[]; sawBrainGapThisSegment: boolean }
export const LEDGER_TUNING: { weights: Record<LedgerEventKind, number>; detectThreshold: number; cooldownMs: number };
export const STUCK_CUE_RE: RegExp;      // moved from VoiceTutorRealtime.tsx:6265
export const CONFUSION_RE: RegExp;
export function createLedger(): LedgerState;
export function applyLedgerEvent(state: LedgerState, ev: LedgerEvent): LedgerDetection | null; // mutates state
export function markRecovered(state: LedgerState, loId: string): void;
export function prereqKey(conceptLabel: string): string; // `prereq:<lowercased label>`
```

- [ ] **Step 1: Write the failing test**

```ts
// scripts/test-struggle-ledger.ts
/** Spec §A.2/A.5 — pure per-LO struggle ledger. Usage: npx tsx scripts/test-struggle-ledger.ts */
import {
  createLedger, applyLedgerEvent, markRecovered, LEDGER_TUNING, STUCK_CUE_RE, CONFUSION_RE, prereqKey,
} from '../src/lib/tutor/orchestrator/struggle-ledger';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}
const ev = (kind: Parameters<typeof applyLedgerEvent>[1]['kind'], loId = 'lo1', segId = 's1', atMs = 0) => ({ kind, loId, segId, atMs });

{ // one wrong answer is not a detection
  const L = createLedger();
  check('single wrong → no detection', applyLedgerEvent(L, ev('wrong')) === null);
}
{ // two wrongs cross the threshold with INCORRECT_STREAK_2_PLUS
  const L = createLedger();
  applyLedgerEvent(L, ev('wrong'));
  const d = applyLedgerEvent(L, ev('wrong', 'lo1', 's1', 1000));
  check('two wrongs → detection', d !== null && d.count === 1 && d.recurrence === false, JSON.stringify(d));
  check('signals carry INCORRECT_STREAK_2_PLUS', !!d && d.signals.includes('INCORRECT_STREAK_2_PLUS'));
  check('score resets after detection', L.get('lo1')!.score === 0);
}
{ // brain_gap alone (weight 2) detects immediately and marks sawBrainGapThisSegment
  const L = createLedger();
  const d = applyLedgerEvent(L, ev('brain_gap'));
  check('brain_gap → detection with sawBrainGapThisSegment', !!d && d.sawBrainGapThisSegment === true);
}
{ // cooldown: same segment within 90s does not produce a second detection
  const L = createLedger();
  applyLedgerEvent(L, ev('wrong')); applyLedgerEvent(L, ev('wrong', 'lo1', 's1', 1000));
  applyLedgerEvent(L, ev('wrong', 'lo1', 's1', 2000));
  const d = applyLedgerEvent(L, ev('wrong', 'lo1', 's1', 3000));
  check('second detection blocked by cooldown (same seg, <90s)', d === null);
  const d2 = applyLedgerEvent(L, ev('confusion', 'lo1', 's2', 4000));
  check('different segment → recurrence (count 2)', !!d2 && d2.count === 2 && d2.recurrence === true, JSON.stringify(d2));
  check('recurrence signals include STUDENT_VERBALIZED_CONFUSION', !!d2 && d2.signals.includes('STUDENT_VERBALIZED_CONFUSION'));
}
{ // cooldown by time in the same segment
  const L = createLedger();
  applyLedgerEvent(L, ev('wrong')); applyLedgerEvent(L, ev('wrong', 'lo1', 's1', 1000));
  applyLedgerEvent(L, ev('stuck_cue', 'lo1', 's1', 100_000));
  const d = applyLedgerEvent(L, ev('no_recovery', 'lo1', 's1', 101_000));
  check('≥90s later in same segment → recurrence', !!d && d.recurrence === true);
  check('signals include STUCK_CUE and NO_RECOVERY', !!d && d.signals.includes('STUCK_CUE') && d.signals.includes('NO_RECOVERY'));
}
{ // slow_segment weighs 0.5
  const L = createLedger();
  applyLedgerEvent(L, ev('slow_segment')); applyLedgerEvent(L, ev('slow_segment', 'lo1', 's2'));
  check('two slow segments (1.0) < threshold', applyLedgerEvent(L, ev('slow_segment', 'lo1', 's3')) === null);
  check('weights as specified', LEDGER_TUNING.weights.slow_segment === 0.5 && LEDGER_TUNING.weights.brain_gap === 2 && LEDGER_TUNING.detectThreshold === 2);
}
{ // LOs are independent; recovered flag
  const L = createLedger();
  applyLedgerEvent(L, ev('wrong', 'a')); applyLedgerEvent(L, ev('wrong', 'b'));
  check('events on different LOs do not sum', applyLedgerEvent(L, ev('slow_segment', 'a')) === null);
  markRecovered(L, 'a');
  check('markRecovered sets recovered', L.get('a')!.recovered === true);
  markRecovered(L, 'zzz');
  check('markRecovered on unknown LO is a no-op', !L.has('zzz'));
}
check('STUCK_CUE_RE matches "I don\'t know"', STUCK_CUE_RE.test("I don't know"));
check('STUCK_CUE_RE does not match "I know this"', !STUCK_CUE_RE.test('I know this one'));
check('CONFUSION_RE matches "I\'m confused"', CONFUSION_RE.test("I'm confused about this"));
check('CONFUSION_RE matches "doesn\'t make sense"', CONFUSION_RE.test("that doesn't make sense"));
check('CONFUSION_RE does not match a plain answer', !CONFUSION_RE.test('the answer is twelve'));
check('prereqKey lowercases and prefixes', prereqKey('Times Tables') === 'prereq:times tables');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx tsx scripts/test-struggle-ledger.ts`
Expected: FAIL — cannot find module `struggle-ledger`.

- [ ] **Step 3: Implement the module**

```ts
// src/lib/tutor/orchestrator/struggle-ledger.ts
/**
 * Struggle ledger (holistic-pedagogy round, spec §A) — a per-LO, in-session
 * tally of behavioural struggle signals so a gap can be INFERRED without the
 * student naming it, and a RECURRENCE noticed when the same objective trips
 * them again. Pure: no React, no DOM, no I/O. The orchestrator owns one
 * LedgerState per session in a ref and feeds it events from sites it already
 * has (streak increments, cue matches, segment turn counts, brain gap calls).
 *
 * Detection = weighted score since the last detection crosses
 * LEDGER_TUNING.detectThreshold. After a detection the score resets, so the
 * next one needs fresh evidence. A second detection on the same LO is only
 * allowed in a DIFFERENT segment or after cooldownMs — one bad minute is one
 * detection, not two. detections ≥ 2 ⇒ recurrence.
 *
 * Signals map 1:1 onto EXISTING GapSignalCode values — never a new enum
 * value (the academy parses GapsRead with a closed enum).
 */
import type { GapSignalCode } from '@/lib/tutor/student-profile/types';

export type LedgerEventKind = 'wrong' | 'no_recovery' | 'stuck_cue' | 'slow_segment' | 'confusion' | 'brain_gap';
export interface LedgerEvent { kind: LedgerEventKind; loId: string; segId: string; atMs: number }
export interface LoLedger {
  score: number;
  events: LedgerEvent[];
  detections: number;
  lastDetectionAtMs?: number;
  lastDetectionSegId?: string;
  inferredPushed: boolean;
  recovered: boolean;
}
export type LedgerState = Map<string, LoLedger>;
export interface LedgerDetection {
  loId: string;
  count: number;
  recurrence: boolean;
  signals: GapSignalCode[];
  sawBrainGapThisSegment: boolean;
}

export const LEDGER_TUNING = {
  weights: { wrong: 1, no_recovery: 1, stuck_cue: 1, confusion: 1, slow_segment: 0.5, brain_gap: 2 } as Record<LedgerEventKind, number>,
  detectThreshold: 2,
  cooldownMs: 90_000,
};

/** Moved verbatim from VoiceTutorRealtime.tsx's recordGap handler so the
 *  ledger and the objective-signal stamp share one definition. */
export const STUCK_CUE_RE = /\b(stuck|skip|don't know|dont know|i don't get|help me|can't do)\b/i;
/** Generic verbalized-confusion shapes (no subject terms). */
export const CONFUSION_RE = /\b(i don'?t get (it|this)|i'?m confused|confusing|doesn'?t make sense|makes no sense|i'?m lost|what do you mean|i don'?t understand)\b/i;

export function prereqKey(conceptLabel: string): string {
  return `prereq:${conceptLabel.trim().toLowerCase()}`;
}

export function createLedger(): LedgerState {
  return new Map();
}

function signalsFor(events: LedgerEvent[]): GapSignalCode[] {
  const out = new Set<GapSignalCode>();
  const wrongs = events.filter((e) => e.kind === 'wrong').length;
  if (wrongs >= 2) out.add('INCORRECT_STREAK_2_PLUS');
  for (const e of events) {
    if (e.kind === 'no_recovery') out.add('NO_RECOVERY');
    if (e.kind === 'stuck_cue') out.add('STUCK_CUE');
    if (e.kind === 'slow_segment') out.add('SLOW_SEGMENT');
    if (e.kind === 'confusion') out.add('STUDENT_VERBALIZED_CONFUSION');
  }
  return [...out];
}

/** Apply one event. Returns a detection when the LO crosses the threshold
 *  (and is outside the cooldown), else null. Mutates `state`. */
export function applyLedgerEvent(state: LedgerState, ev: LedgerEvent): LedgerDetection | null {
  let lo = state.get(ev.loId);
  if (!lo) {
    lo = { score: 0, events: [], detections: 0, inferredPushed: false, recovered: false };
    state.set(ev.loId, lo);
  }
  lo.events.push(ev);
  lo.score += LEDGER_TUNING.weights[ev.kind];
  lo.recovered = false;
  if (lo.score < LEDGER_TUNING.detectThreshold) return null;
  // Cooldown: a repeat detection needs a new segment or ≥ cooldownMs.
  if (lo.detections > 0 && lo.lastDetectionAtMs !== undefined) {
    const sameSeg = lo.lastDetectionSegId === ev.segId;
    const soon = ev.atMs - lo.lastDetectionAtMs < LEDGER_TUNING.cooldownMs;
    if (sameSeg && soon) return null;
  }
  // Events since the last detection = the tail after the previous detection's count.
  const sinceIdx = lo.events.findIndex((e) => lo!.lastDetectionAtMs === undefined || e.atMs > lo!.lastDetectionAtMs);
  const recent = sinceIdx >= 0 ? lo.events.slice(sinceIdx) : lo.events;
  const sawBrainGapThisSegment = recent.some((e) => e.kind === 'brain_gap' && e.segId === ev.segId);
  lo.detections += 1;
  lo.lastDetectionAtMs = ev.atMs;
  lo.lastDetectionSegId = ev.segId;
  lo.score = 0;
  return {
    loId: ev.loId,
    count: lo.detections,
    recurrence: lo.detections >= 2,
    signals: signalsFor(recent),
    sawBrainGapThisSegment,
  };
}

export function markRecovered(state: LedgerState, loId: string): void {
  const lo = state.get(loId);
  if (lo) lo.recovered = true;
}
```

- [ ] **Step 4: Run the test**

Run: `npx tsx scripts/test-struggle-ledger.ts` → all `✓`, exit 0. If the cooldown-by-time case fails, check that `sinceIdx` uses `>` (events AT the detection timestamp belong to the previous window).

- [ ] **Step 5: Register and commit**

Add to `package.json` scripts: `"test:struggle-ledger": "npx tsx scripts/test-struggle-ledger.ts"`.
```bash
git add src/lib/tutor/orchestrator/struggle-ledger.ts scripts/test-struggle-ledger.ts package.json
git commit -m "feat(tutor): struggle ledger — pure per-LO detection + recurrence (spec §A.2)"
```

---

### Task 3: Profile types + store — recurrence, inferred cap, recap record, next-session intent

**Files:**
- Modify: `src/lib/tutor/student-profile/types.ts` (`GapEvidence` ~line 59; `StudentProfile` ~line 203)
- Modify: `src/lib/tutor/student-profile/store.ts` (`RecordGapInput` ~line 190; `recordGap` ~line 235)
- Modify: `src/models/StudentProfile.ts` (interface, schema, `toStudentProfile`)
- Test: `scripts/test-cross-session-promotion.ts` (existing `npm run test:gaps`) — append cases

**Interfaces:**
- Produces:
```ts
export interface RecapRecord { offers: number; accepts: number; declines: number; lastOfferAt: string; lastOutcome?: 'accepted' | 'declined' | 'improved' | 'still_struggling' }
// GapEvidence += recurrenceCount?: number; inferred?: boolean; recap?: RecapRecord
// StudentProfile += nextSessionIntent?: { text: string; sessionId: string; at: string }
// RecordGapInput += recurrences?: number; inferred?: boolean; recap?: { offered: number; outcome?: RecapRecord['lastOutcome'] }
export const INFERRED_CONFIDENCE_CAP = 0.5;
```

- [ ] **Step 1: Write the failing tests** (append to `scripts/test-cross-session-promotion.ts`, before the final summary/exit lines; it already imports from `../src/lib/tutor/student-profile/store` — extend that import with `recordGap, INFERRED_CONFIDENCE_CAP` and add a minimal profile factory if the file has none):

```ts
// ─── holistic-pedagogy round: recurrence / inferred cap / recap record ───
{
  const base = { id: 'p', mastery: {}, gaps: [], recentSessions: [], preferences: {}, createdAt: 'x', updatedAt: 'x' } as unknown as import('../src/lib/tutor/student-profile/types').StudentProfile;
  const inferred = recordGap(base, {
    kind: 'lo', loId: 'lo1', observation: 'Inferred from behaviour: 2 incorrect attempts', studentQuotes: [],
    signals: ['INCORRECT_STREAK_2_PLUS', 'NO_RECOVERY', 'STUCK_CUE'], sessionId: 's1', inferred: true,
  });
  const g = inferred.gaps[0];
  assert(g.status === 'candidate' && (g.confidence ?? 1) <= INFERRED_CONFIDENCE_CAP, 'inferred gap with 3 signals stays candidate (confidence capped)');
  assert(g.evidence?.inferred === true, 'inferred flag persisted on evidence');

  const recurred = recordGap(inferred, {
    kind: 'lo', loId: 'lo1', observation: 'again', studentQuotes: [], signals: ['NO_RECOVERY'], sessionId: 's1',
    recurrences: 2, recap: { offered: 1, outcome: 'declined' },
  });
  const g2 = recurred.gaps[0];
  assert(g2.evidence?.recurrenceCount === 2, 'recurrenceCount accumulates on merge');
  assert(g2.evidence?.recap?.offers === 1 && g2.evidence?.recap?.declines === 1 && g2.evidence?.recap?.lastOutcome === 'declined', 'recap record merged');
  const again = recordGap(recurred, {
    kind: 'lo', loId: 'lo1', observation: 'again2', studentQuotes: [], signals: ['NO_RECOVERY'], sessionId: 's2',
    recurrences: 1, recap: { offered: 1, outcome: 'accepted' },
  });
  const g3 = again.gaps[0];
  assert(g3.evidence?.recurrenceCount === 3 && g3.evidence?.recap?.offers === 2 && g3.evidence?.recap?.accepts === 1, 'second merge adds to counters');
  assert(g3.status === 'confirmed', 'two sessions still promote (unchanged rule)');
}
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:gaps` → FAIL (`INFERRED_CONFIDENCE_CAP` not exported / new fields unknown).

- [ ] **Step 3: Types** — in `types.ts` add after `GapEvidence.studentQuotes`:

```ts
  /** Holistic-pedagogy round (spec §A.7/§B.6). Engine-only fields — the
   *  contract's GapEntrySchema strips them on the wire. */
  /** How many times this gap RECURRED within sessions (ledger count, summed). */
  recurrenceCount?: number;
  /** True when the FIRST record came from the orchestrator's behavioural
   *  inference, not a brain tool call. Confidence is capped at
   *  INFERRED_CONFIDENCE_CAP so inference never auto-confirms. */
  inferred?: boolean;
  /** Consent-gated recap history for this gap. */
  recap?: RecapRecord;
}

export interface RecapRecord {
  offers: number;
  accepts: number;
  declines: number;
  lastOfferAt: string;
  lastOutcome?: 'accepted' | 'declined' | 'improved' | 'still_struggling';
}
```
(close the `GapEvidence` interface where it was — the snippet above ends it.) Add to `StudentProfile` after `planContentSeen?`:
```ts
  /** Spec §C.3 — the tutor's own "next time we'll…" note from the last
   *  session's close_session_notes call. Rendered next boot, ≤ 14 days. */
  nextSessionIntent?: { text: string; sessionId: string; at: string };
```

- [ ] **Step 4: Store** — in `store.ts`: add `export const INFERRED_CONFIDENCE_CAP = 0.5;` beside the other constants; extend `RecordGapInput` with `recurrences?: number; inferred?: boolean; recap?: { offered: number; outcome?: RecapRecord['lastOutcome'] };` (import `RecapRecord`). Add a helper above `recordGap`:

```ts
function mergeRecap(prev: RecapRecord | undefined, input: RecordGapInput['recap'], now: string): RecapRecord | undefined {
  if (!input) return prev;
  const base: RecapRecord = prev ?? { offers: 0, accepts: 0, declines: 0, lastOfferAt: now };
  return {
    offers: base.offers + input.offered,
    accepts: base.accepts + (input.outcome === 'accepted' || input.outcome === 'improved' || input.outcome === 'still_struggling' ? 1 : 0),
    declines: base.declines + (input.outcome === 'declined' ? 1 : 0),
    lastOfferAt: input.offered > 0 ? now : base.lastOfferAt,
    lastOutcome: input.outcome ?? base.lastOutcome,
  };
}
function capInferred(confidence: number, inferred: boolean | undefined, prevInferred: boolean | undefined): number {
  return inferred || prevInferred ? Math.min(confidence, INFERRED_CONFIDENCE_CAP) : confidence;
}
```
In the **active-match** branch: compute `const confidence = capInferred(Math.max(existing.confidence ?? 0, computeConfidence(mergedSignals)), input.inferred, existing.evidence?.inferred);` and build `evidence` as:
```ts
    const evidence: GapEvidence = {
      signals: mergedSignals,
      observation: input.observation,
      studentQuotes: mergedQuotes,
      ...(existing.evidence?.inferred || input.inferred ? { inferred: true } : {}),
      ...((existing.evidence?.recurrenceCount ?? 0) + (input.recurrences ?? 0) > 0
        ? { recurrenceCount: (existing.evidence?.recurrenceCount ?? 0) + (input.recurrences ?? 0) } : {}),
      ...(mergeRecap(existing.evidence?.recap, input.recap, now) ? { recap: mergeRecap(existing.evidence?.recap, input.recap, now) } : {}),
    };
```
Note: an inferred gap that the BRAIN later confirms (input.inferred false, existing inferred true) stays capped this session; cross-session promotion via `sessionIds.length ≥ 2` still applies (that is the "second session confirms" path the spec wants). In the **resolved-reopen** and **new** branches: `const confidence = capInferred(computeConfidence(signals), input.inferred, undefined);` and add `...(input.inferred ? { inferred: true } : {})`, `...(input.recurrences ? { recurrenceCount: input.recurrences } : {})`, `...(mergeRecap(undefined, input.recap, now) ? { recap: mergeRecap(undefined, input.recap, now) } : {})` to their `evidence` objects.

- [ ] **Step 5: Mongoose** — `src/models/StudentProfile.ts`: add `nextSessionIntent?: { text: string; sessionId: string; at: string };` to `IStudentProfile`; schema field `nextSessionIntent: { type: Schema.Types.Mixed as any, default: undefined },` (with the eslint-disable comment like `planContentSeen`); and `nextSessionIntent: obj.nextSessionIntent,` in `toStudentProfile`. Check `saveStudentProfile` in `store.ts` (~line 130) spreads the whole profile into the upsert — if it enumerates fields, add `nextSessionIntent` there too.

- [ ] **Step 6: Run tests, typecheck, commit**

Run: `npm run test:gaps` → all pass (40 existing + 6 new). `npx tsc --noEmit -p .` → 0.
```bash
git add src/lib/tutor/student-profile/types.ts src/lib/tutor/student-profile/store.ts src/models/StudentProfile.ts scripts/test-cross-session-promotion.ts
git commit -m "feat(tutor): gap recurrence + inferred cap + recap record + nextSessionIntent (spec §A.7/§B.6)"
```

---

### Task 4: Commit route — new body fields

**Files:**
- Modify: `src/app/api/tutor/student-profile/[id]/route.ts` (`CommitBody` ~line 88; gaps loop ~line 260; after `applyCrossSessionPromotion`)

**Interfaces:**
- Consumes: Task 3's `RecordGapInput` fields.
- Produces: `CommitBody.gaps[i].{recurrences?, inferred?, recap?}`, `CommitBody.nextSessionIntent?: string`, `CommitBody.practiceLocator?: string`, `CommitBody.homeworkAcknowledged?: string[]` (Task 10 consumes the last two).

- [ ] **Step 1: Extend `CommitBody`** — inside the `gaps?: Array<{...}>` element type add:
```ts
    /** Holistic-pedagogy round: ledger recurrence count this increment. */
    recurrences?: number;
    /** True when the orchestrator inferred this gap from behaviour. */
    inferred?: boolean;
    /** Consent-gated recap outcome for this gap this increment. */
    recap?: { offered: number; outcome?: 'accepted' | 'declined' | 'improved' | 'still_struggling' };
```
and top-level:
```ts
  /** Spec §C.3 — close_session_notes.nextTimeIntent (final commit only). */
  nextSessionIntent?: string;
  /** Spec §C.6 — embed-config practice locator, stamped on any auto-assigned
   *  homework record (Task 10). Absent ⇒ record stays behind the gate. */
  practiceLocator?: string;
  /** Spec §C.4 — assignment ids whose homework line rendered at boot; the
   *  final commit acknowledges them (Task 10). */
  homeworkAcknowledged?: string[];
```

- [ ] **Step 2: Thread into `recordGap`** — in the gaps loop pass:
```ts
        recurrences: typeof g.recurrences === 'number' && g.recurrences > 0 ? Math.min(g.recurrences, 20) : undefined,
        inferred: g.inferred === true,
        recap: g.recap && typeof g.recap.offered === 'number' ? { offered: Math.max(0, Math.min(g.recap.offered, 5)), outcome: g.recap.outcome } : undefined,
```

- [ ] **Step 3: Persist `nextSessionIntent`** — after the `applyCrossSessionPromotion` block:
```ts
  if (typeof body.nextSessionIntent === 'string' && body.nextSessionIntent.trim()) {
    profile = {
      ...profile,
      nextSessionIntent: { text: body.nextSessionIntent.trim().slice(0, 200), sessionId: body.sessionId, at: new Date().toISOString() },
    };
  }
```
(`profile` is later passed to `saveStudentProfile` by the existing code — confirm the save happens after this point.)

- [ ] **Step 4: Typecheck, run the DB-backed learner-model battery if a local Mongo is reachable, commit**

Run: `npx tsc --noEmit -p .` → 0. `npm run test:learner-model` (its commit-route section still passes — no behaviour change for old bodies).
```bash
git add "src/app/api/tutor/student-profile/[id]/route.ts"
git commit -m "feat(tutor): profile commit accepts recurrence/inferred/recap + nextSessionIntent"
```

---

### Task 5: Tool + prompt changes for recurrence; `recurrence` argument

**Files:**
- Modify: `packages/core/src/knowledge/types.ts` (~line 822-823)
- Modify: `src/app/tutor/hooks/toolDefinitions.ts` (`record_gap` ~line 1981, `flag_prerequisite_gap` ~line 2008, mapper ~line 2932)
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` (~line 814)
- Test: `scripts/test-tool-definitions.ts` if present (grep `package.json` for `test:tool`), else `npx tsc` + the prompt battery `npm run test:prompt-audit` if present. At minimum: typecheck + `npm run test:pedagogy-d1` unchanged (its reds are pre-existing exact-string cases; confirm the SAME two fail before and after).

- [ ] **Step 1: Core action types** — change lines 822-823 to:
```ts
  | { action: 'recordGap'; loId: string; observation: string; studentQuotes: string[]; signalsObserved: string[]; recurrence?: boolean }
  | { action: 'flagPrerequisiteGap'; conceptLabel: string; observation: string; studentQuotes: string[]; signalsObserved: string[]; recurrence?: boolean }
```

- [ ] **Step 2: Tool parameters** — in both tool definitions add to `properties`:
```ts
        recurrence: {
          type: 'boolean',
          description: 'Set true when this SAME issue already fired earlier in THIS session and has now come back. A recurrence is the strongest sign a gap is real rather than a slip.',
        },
```
and in both descriptions replace `Per session, fire at most once per (loId, distinct issue) pair.` with: `Fire once per distinct issue; if the SAME issue returns later in this session, fire again with recurrence:true (re-firing on recurrence is encouraged, not duplicate).` (same edit for the `concept_label` sentence in `flag_prerequisite_gap`).

- [ ] **Step 3: Mapper** — in both mapper branches add `recurrence: funcArgs.recurrence === true,`.

- [ ] **Step 4: Prompt** — `system-prompt-builder.ts:814`, replace the final sentence `Per session, fire at most once per (loId, distinct issue) for \`record_gap\` and once per concept_label for \`flag_prerequisite_gap\`.` with:
```
Fire once per distinct issue. If the SAME issue returns later in the session, fire the tool AGAIN with recurrence:true — a recurrence is how the system learns a gap is real and not a slip; it is never a duplicate.
```

- [ ] **Step 5: Verify and commit**

Run: `npx tsc --noEmit -p .` → 0; `npm run test:pedagogy-d1 2>&1 | tail -3` → same 2 reds as before (record the names in the commit body).
```bash
git add packages/core/src/knowledge/types.ts src/app/tutor/hooks/toolDefinitions.ts src/lib/tutor/ai/system-prompt-builder.ts
git commit -m "feat(tutor): gap tools accept recurrence:true; prompt allows in-session re-fire (spec §A.6)"
```

---

### Task 6: Wire the ledger into the orchestrator (inferred push + recurrence event)

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — accumulator type (~line 383 / the `sessionAccumRef` init ~line 1997), recordGap handler (~line 6256), streak sites (~line 14290 reset, ~line 14350 increment), cue site (~line 9246), segment-turn-count crossing (where `segmentTurnCountRef.current.count` is incremented — grep `segmentTurnCountRef.current = {`), free-mode LO attribution.
- Test: manual typed-session probe (Task 23) + `npx tsc`.

**Interfaces:**
- Consumes: Task 2 (`createLedger`, `applyLedgerEvent`, `markRecovered`, `STUCK_CUE_RE`, `CONFUSION_RE`, `prereqKey`), Task 1 (`TUTOR_STRUGGLE_LEDGER`).
- Produces: `ledgerRef: React.MutableRefObject<LedgerState>`, `recurrenceListenerRef: React.MutableRefObject<((d: LedgerDetection & { loTitle: string }) => void) | null>` (Task 15 registers the recap arming here), accumulator gap entries gain `inferred?`, `recurrences?`, `recap?`; helper `loForSegment(segId): string | null` and `activeLedgerLoRef` (Task 15 sets it during a recap).

- [ ] **Step 1: Accumulator + refs.** Extend the accumulator gap element type (where `gaps: Array<{ kind: 'lo' | 'prerequisite'; ... }>` is declared) with `inferred?: boolean; recurrences?: number; recap?: { offered: number; outcome?: 'accepted' | 'declined' | 'improved' | 'still_struggling' }`. Add near the other refs (~line 2722):
```ts
  // Holistic-pedagogy round (spec §A): per-LO struggle ledger for THIS session.
  const ledgerRef = useRef<LedgerState>(createLedger());
  // Set by the recap state machine (Task 15) while a recap runs in free mode,
  // so events with no segment LO still attribute to the recap's LO.
  const activeLedgerLoRef = useRef<string | null>(null);
  const recurrenceListenerRef = useRef<((d: LedgerDetection & { loTitle: string }) => void) | null>(null);
```
Import `createLedger, applyLedgerEvent, markRecovered, STUCK_CUE_RE, CONFUSION_RE, prereqKey, type LedgerState, type LedgerDetection` from `@/lib/tutor/orchestrator/struggle-ledger` and `TUTOR_STRUGGLE_LEDGER` from the flags module.

- [ ] **Step 2: LO resolver + feed helper.** Add a `useCallback`-free plain function inside the component (after the refs):
```ts
  const loForSegment = (segId: string): string | null => {
    const plan = lessonPlanRef.current; // the loaded LessonPlan ref used by the segmentOutcomes builder (~line 805) — reuse the same lookup
    if (!plan) return null;
    const seg = plan.segments.find((s) => s.id === segId);
    const loId = (seg as { loId?: string } | undefined)?.loId ?? plan.los[0]?.id;
    return loId ?? null;
  };
  const loTitleFor = (loId: string): string => {
    const lo = lessonPlanRef.current?.los.find((l) => l.id === loId);
    return lo?.shortTitle ?? lo?.description ?? loId;
  };
  /** Feed one ledger event; on a detection, push an inferred gap (first
   *  detection with no brain gap in this segment) or bump recurrences. */
  const feedLedger = (kind: LedgerEventKind, explicitLoId?: string) => {
    if (!TUTOR_STRUGGLE_LEDGER) return;
    const segId = currentSegmentIdRef.current;
    const loId = explicitLoId ?? (segId ? loForSegment(segId) : activeLedgerLoRef.current);
    if (!loId) return;
    const d = applyLedgerEvent(ledgerRef.current, { kind, loId, segId: segId || 'free', atMs: Date.now() });
    if (!d) return;
    const accum = sessionAccumRef.current;
    const isPrereq = loId.startsWith('prereq:');
    const existing = accum.gaps.find((g) => (isPrereq ? g.kind === 'prerequisite' && prereqKey(g.conceptLabel ?? '') === loId : g.kind === 'lo' && g.loId === loId));
    if (d.recurrence || existing) {
      if (existing) existing.recurrences = (existing.recurrences ?? 0) + 1;
      console.log(`[VoiceTutorRealtime] gap recurred loId="${loId}" count=${d.count} signals=[${d.signals.join(',')}]`);
      onDebugEvent?.('gap_recurred', `lo="${loId}" count=${d.count}`);
      recurrenceListenerRef.current?.({ ...d, loTitle: loTitleFor(loId) });
      scheduleProfileFlush();
      return;
    }
    if (!d.sawBrainGapThisSegment && !isPrereq && !ledgerRef.current.get(loId)!.inferredPushed) {
      ledgerRef.current.get(loId)!.inferredPushed = true;
      const wrongs = ledgerRef.current.get(loId)!.events.filter((e) => e.kind === 'wrong').length;
      accum.gaps.push({
        kind: 'lo', loId, inferred: true,
        observation: `Inferred from behaviour: ${wrongs} incorrect attempt${wrongs === 1 ? '' : 's'} and ${d.signals.map((s) => s.toLowerCase().replace(/_/g, ' ')).join(', ') || 'repeated difficulty'} on this objective; the student did not name the difficulty.`,
        studentQuotes: [], signals: d.signals,
      });
      accum.losTouched.add(loId);
      console.log(`[VoiceTutorRealtime] gap inferred loId="${loId}" signals=[${d.signals.join(',')}]`);
      onDebugEvent?.('gap_inferred', `lo="${loId}" signals=${d.signals.join('+')}`);
      scheduleProfileFlush();
    }
  };
```
`lessonPlanRef` — use whatever ref name the file already holds the loaded plan in (the `segmentOutcomes` builder near line 805 reads `loId` for a segment; reuse its exact expression rather than inventing one). `LedgerEventKind` is imported as a type.

- [ ] **Step 3: Event sites.**
  - Streak increment (`decision.credit === 'incorrect'`, ~line 14348): after `studentIncorrectStreakRef.current = { segId, count: priorIncCount + 1 };` add `feedLedger(priorIncCount >= 1 ? 'no_recovery' : 'wrong');`.
  - Correct branch (~line 14290, where the incorrect streak resets): add `if (TUTOR_STRUGGLE_LEDGER) { const lo = loForSegment(segId) ?? activeLedgerLoRef.current; if (lo) markRecovered(ledgerRef.current, lo); }`.
  - Cue site (~line 9246): after `studentCueRef.current = {...}` add `if (STUCK_CUE_RE.test(cueMatch[0])) feedLedger('stuck_cue');`. Also, in the same transcript-classification block, add `if (CONFUSION_RE.test(t)) feedLedger('confusion');` (where `t` is the lowercased student transcript already in scope there).
  - Segment turn count: at the site that increments `segmentTurnCountRef.current.count`, add `if (segmentTurnCountRef.current.count === 6) feedLedger('slow_segment');`.
  - Brain gap handler (~line 6256): replace the inline STUCK_CUE regex with `STUCK_CUE_RE.test(cue)`; after the accumulator push in each branch add `feedLedger('brain_gap', cmd.action === 'recordGap' ? c.loId : prereqKey(c.conceptLabel));`. Also honour `c.recurrence === true`: if an accumulator entry for that key already exists, do NOT push a second entry — bump `existing.recurrences = (existing.recurrences ?? 0) + 1`, emit `gap_recurred`, call `recurrenceListenerRef.current?.(…)` with `{ loId, count: existing.recurrences + 1, recurrence: true, signals, sawBrainGapThisSegment: true, loTitle }`, and `continue`.

- [ ] **Step 4: Flush-safety.** `feedLedger` mutates `sessionAccumRef.current.gaps` entries in place; the commit body serialises `accum.gaps` and then RESETS the accumulator (Task 4's route merges by loId, so a later increment carrying `recurrences` on a fresh entry still merges server-side). To keep a recurrence that lands AFTER a flush attributable, when `existing` is not found because the accumulator was reset, push a minimal entry: `{ kind: 'lo', loId, observation: 'Recurred later in the session.', studentQuotes: [], signals: d.signals, recurrences: 1 }` — the server merges it onto the already-committed gap. Add that fallback in the `d.recurrence && !existing` case.

- [ ] **Step 5: Typecheck, build, commit**

Run: `npx tsc --noEmit -p .` → 0; `npm run test:embed-debug-coverage` → PASS.
```bash
git add src/app/tutor/components/VoiceTutorRealtime.tsx
git commit -m "feat(tutor): wire struggle ledger — inferred gap push + recurrence events (spec §A.3-A.5)"
```

---

### Task 7: False-praise-opener guard (pure module)

**Files:**
- Create: `src/lib/tutor/voice/false-praise-opener.ts`
- Test: `scripts/test-false-praise-opener.ts`; register `"test:false-praise-opener"`.

**Interfaces:**
- Consumes: `matchUtteranceToAnswer(utterance, expected, choices?, opts?) → { verdict: 'agree'|'disagree'|'unknown'; reason }` from `@/lib/tutor/voice/utterance-answer-match`; `isPureAcknowledgment(text)` from `@/lib/tutor/voice/nonanswer-praise`; `looksMonetary` from `@/lib/tutor/voice/spoken-money` (same args the inverse-verdict check uses).
- Produces:
```ts
export const PRAISE_OPENER_STRICT_RE: RegExp;
export function isSingleValued(expected: string): boolean;
export function checkFalsePraiseOpener(args: {
  sentence: string; studentUtterance: string;
  verifiedExpectedAnswer?: string; unverifiedCardAnswer?: string;
  choices?: Array<{ letter: string; text: string }>;
  problemContext?: string; spokenMoneyEnabled?: boolean;
}): { verdict: 'ok' | 'false_praise' | 'advisory_false_praise'; expected?: string; matchReason?: string };
```

- [ ] **Step 1: Replay first (spec §D.4).** Before writing tests, run this one-off in node to see what the comparator says for the live instance-3 shape, and paste the output into the test file header as a comment:
```bash
npx tsx -e "import {matchUtteranceToAnswer as m} from './src/lib/tutor/voice/utterance-answer-match'; console.log(m('x equals nine', 'B', [{letter:'A',text:'x = 21'},{letter:'B',text:'x = 7'},{letter:'C',text:'x = 9'}])); console.log(m('x equals nine','C',[{letter:'A',text:'x = 21'},{letter:'B',text:'x = 7'},{letter:'C',text:'x = 9'}])); console.log(m('nine','C',[{letter:'C',text:'C'}]))"
```
If the MCQ-text path returns `unknown` for the letters-only choice shape (the runtime passes `{letter, text: letter}`), the guard's MCQ coverage is letters-only (student says "C") and value answers are covered by the plain value path — record that in the test names.

- [ ] **Step 2: Write the failing test**
```ts
// scripts/test-false-praise-opener.ts
/** Spec §D.2 — praise-class opener after a student answer that DISAGREES with the verified key.
 *  Live shapes replayed: instance 3 (portal-qa-typed-a-1788565070 t5) "Right, let's check the reasoning behind it." after a wrong MCQ pick;
 *  instance 1 (two-part, mx-partial-two-part) must NOT fire. Usage: npx tsx scripts/test-false-praise-opener.ts */
import { checkFalsePraiseOpener, isSingleValued, PRAISE_OPENER_STRICT_RE } from '../src/lib/tutor/voice/false-praise-opener';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }

// Opener regex
check('strict opener: "Right, let\'s check…"', PRAISE_OPENER_STRICT_RE.test("Right, let's check the reasoning behind it."));
check('strict opener: "Exactly."', PRAISE_OPENER_STRICT_RE.test('Exactly.'));
check('strict opener excludes "Right idea"', !PRAISE_OPENER_STRICT_RE.test('Right idea — but check the sign.'));
check('strict opener excludes "Close"', !PRAISE_OPENER_STRICT_RE.test('Close, but not quite.'));
check('strict opener excludes "Almost"', !PRAISE_OPENER_STRICT_RE.test('Almost there.'));
check('strict opener excludes mid-sentence right', !PRAISE_OPENER_STRICT_RE.test('The roots part is right, the vertex is not.'));

// single-valued
check('single value', isSingleValued('12'));
check('single latex value', isSingleValued('$x = 12$'));
check('two-part answer is not single-valued', !isSingleValued('roots 2 and 3, vertex (1, -4)'));
check('semicolon list is not single-valued', !isSingleValued('x = 2; y = 5'));

// KILL tier — verified value disagree
{
  const r = checkFalsePraiseOpener({ sentence: 'Right. So that gives us the answer.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13' });
  check('verified value disagree + praise opener → false_praise', r.verdict === 'false_praise' && r.expected === '13', JSON.stringify(r));
}
{ // instance 3: MCQ letters-only choices, student said the letter
  const r = checkFalsePraiseOpener({ sentence: "Right, let's check the reasoning behind it.", studentUtterance: 'C', verifiedExpectedAnswer: 'B', choices: [{ letter: 'A', text: 'A' }, { letter: 'B', text: 'B' }, { letter: 'C', text: 'C' }] });
  check('instance 3 (MCQ letter disagree) → false_praise', r.verdict === 'false_praise', JSON.stringify(r));
}
{ // agree → ok
  const r = checkFalsePraiseOpener({ sentence: 'Exactly.', studentUtterance: 'thirteen', verifiedExpectedAnswer: '13' });
  check('agree → ok', r.verdict === 'ok');
}
{ // unknown/hedged → ok
  const r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'um maybe something like that', verifiedExpectedAnswer: '13' });
  check('unparseable utterance → ok', r.verdict === 'ok');
}
{ // question / ack utterances never fire
  check('question utterance → ok', checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'is it thirteen?', verifiedExpectedAnswer: '12' }).verdict === 'ok');
  check('pure ack → ok', checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'okay', verifiedExpectedAnswer: '12' }).verdict === 'ok');
}
{ // two-part expected → never fires
  const r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'two and three', verifiedExpectedAnswer: 'roots 2 and 3, vertex (1, -4)' });
  check('multi-valued expected → ok (two-part class)', r.verdict === 'ok');
}
{ // non-praise opener never fires
  const r = checkFalsePraiseOpener({ sentence: 'Not quite — check the sign.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13' });
  check('denial opener → ok', r.verdict === 'ok');
}
{ // advisory tier
  const r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'twelve', unverifiedCardAnswer: '13' });
  check('unverified disagree → advisory', r.verdict === 'advisory_false_praise' && r.expected === '13');
  const r2 = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13', unverifiedCardAnswer: '12' });
  check('verified wins over unverified', r2.verdict === 'false_praise');
}
{ // legit discourse-marker "Right." before a NEW problem after a correct answer
  const r = checkFalsePraiseOpener({ sentence: "Right. Here's the next one: a 5 kg box…", studentUtterance: 'thirteen', verifiedExpectedAnswer: '13' });
  check('"Right." after a correct answer → ok', r.verdict === 'ok');
}
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
```

- [ ] **Step 3: Run → FAIL (module missing).**

- [ ] **Step 4: Implement**
```ts
// src/lib/tutor/voice/false-praise-opener.ts
/**
 * False-praise-opener guard (holistic-pedagogy round, spec §D.2).
 *
 * Third live instance of praise-then-reverse (2026-09-05, QA session turn 5):
 * the student picked a wrong MCQ option and the tutor opened "Right, let's
 * check the reasoning behind it…" then denied it sentences later. Neither
 * praise-contradiction.ts (needs `not <phrase>` / math substitution) nor
 * praise-echo-check.ts (needs a math token or letter IN the opener) can see a
 * bare "Right," followed by prose. But the ground truth was already on the
 * table BEFORE any later text: the student's answer disagreed with the
 * verified key, so a praise-class opener was false by construction.
 *
 * Same-claim scoping is structural: the claim is the student's answer to the
 * posed problem. Multi-valued expected answers (the "roots right, vertex
 * wrong" two-part class) never enter — `isSingleValued` refuses them, and
 * the comparator returns unknown/partial for them anyway.
 *
 * Tiers mirror inverse-verdict-check.ts: a VERIFIED expected answer may
 * kill; an unverified card answer is advisory only.
 * Pure, no LLM, never throws.
 */
import { matchUtteranceToAnswer } from '@/lib/tutor/voice/utterance-answer-match';
import { isPureAcknowledgment } from '@/lib/tutor/voice/nonanswer-praise';
import { looksMonetary } from '@/lib/tutor/voice/spoken-money';

export interface FalsePraiseResult { verdict: 'ok' | 'false_praise' | 'advisory_false_praise'; expected?: string; matchReason?: string }
const OK: FalsePraiseResult = { verdict: 'ok' };

/** Affirmation-class openers only. Partial verdicts ("right idea", "close",
 *  "almost", "nearly") are excluded — they are not affirmations. */
export const PRAISE_OPENER_STRICT_RE =
  /^\s*(?:right|yes|yep|exactly|correct|perfect|spot\s+on|bingo|that'?s\s+(?:right|correct|it)|you\s+(?:got|nailed|have)\s+it|well\s+done|nice\s+(?:work|job|one)|great\s+(?:work|job))(?!\s+(?:idea|track|direction|thinking|start))\s*[.!,—–:-]/i;

/** No list separators, at most one '=', short. */
export function isSingleValued(expected: string): boolean {
  const e = expected.trim();
  if (!e || e.length > 40) return false;
  if (/[;,]|\band\b/i.test(e)) return false;
  if ((e.match(/=/g) ?? []).length > 1) return false;
  return true;
}

function isAnswerShaped(utterance: string): boolean {
  const u = utterance.trim();
  if (!u) return false;
  if (/\?\s*$/.test(u)) return false;
  if (isPureAcknowledgment(u)) return false;
  return true;
}

export function checkFalsePraiseOpener(args: {
  sentence: string; studentUtterance: string;
  verifiedExpectedAnswer?: string; unverifiedCardAnswer?: string;
  choices?: Array<{ letter: string; text: string }>;
  problemContext?: string; spokenMoneyEnabled?: boolean;
}): FalsePraiseResult {
  try {
    if (!PRAISE_OPENER_STRICT_RE.test(args.sentence)) return OK;
    if (!isAnswerShaped(args.studentUtterance)) return OK;
    const monetary = !!args.spokenMoneyEnabled && !!args.problemContext && looksMonetary(args.problemContext);
    const verified = (args.verifiedExpectedAnswer ?? '').trim();
    if (verified) {
      if (!isSingleValued(verified)) return OK;
      const m = matchUtteranceToAnswer(args.studentUtterance, verified, args.choices, { monetary });
      return m.verdict === 'disagree' ? { verdict: 'false_praise', expected: verified, matchReason: m.reason } : OK;
    }
    const unverified = (args.unverifiedCardAnswer ?? '').trim();
    if (unverified && isSingleValued(unverified)) {
      const m = matchUtteranceToAnswer(args.studentUtterance, unverified, args.choices, { monetary });
      return m.verdict === 'disagree' ? { verdict: 'advisory_false_praise', expected: unverified, matchReason: m.reason } : OK;
    }
    return OK;
  } catch {
    return OK;
  }
}
```
If `looksMonetary`'s real signature differs (check `spoken-money.ts`), mirror exactly how `inverse-verdict-check.ts` calls it.

- [ ] **Step 5: Run → PASS; register; commit**
```bash
git add src/lib/tutor/voice/false-praise-opener.ts scripts/test-false-praise-opener.ts package.json
git commit -m "feat(tutor): false-praise-opener guard — pure module + battery (spec §D.2)"
```

---

### Task 8: Praise-contradiction widening + wire both guards into the orchestrator

**Files:**
- Modify: `src/lib/tutor/voice/praise-contradiction.ts` (`detectPraiseContradiction`)
- Modify: the existing praise-contradiction battery (grep `package.json` for `praise-contradiction`; the script under `scripts/`) — append cases
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — praise-echo block (~line 10960-11000) and the `detectPraiseContradiction` call (~line 10886)

**Interfaces:**
- Consumes: Task 7's `checkFalsePraiseOpener`; `DENIAL_RE` from `@/lib/tutor/voice/simplification-verdict-check`; flag `TUTOR_FALSE_PRAISE_OPENER`.
- Produces: `detectPraiseContradiction(turnText, opts?: { studentUtterance?: string })` (signature widened, old calls unchanged).

- [ ] **Step 1: Append failing cases to the praise-contradiction battery**
```ts
// ─── spec §D.3 — bare praise opener + bare/same-claim denial ───
{
  const inst3 = "Right, let's check the reasoning behind it. If we substitute x = 9 we get 27 + 6, which is 33. Right, that gives x = 21 on the other side, so x=9 isn't quite it here.";
  check('instance 3 (bare praise + "isn\'t quite it" naming the student value) fires', detectPraiseContradiction(inst3, { studentUtterance: 'x equals nine' }) !== null);
  const bare = "Right, let's look at this together. Not quite — let's recheck the second step.";
  check('bare praise + bare denial (no value named) fires', detectPraiseContradiction(bare) !== null);
  const twoPart = 'Right on the roots — two and three. Not quite on the vertex: it should be (1, -4), not (1, 4).';
  check('two-part: denial names a DIFFERENT value → does not fire', detectPraiseContradiction(twoPart, { studentUtterance: 'two and three' }) === null);
  const legit = "Right. Here's the next one: what is 7 times 8?";
  check('bare praise + no denial → null', detectPraiseContradiction(legit) === null);
  const aside = "Right. Not quite the same thing happens with negatives, so watch that. Your answer of 12 is correct.";
  check('denial-shaped aside that names a different value (negatives/12) → null', detectPraiseContradiction(aside, { studentUtterance: 'twelve' }) === null);
}
```
(Use the battery's existing `check`/`assert` helper name.)

- [ ] **Step 2: Run → the new cases FAIL.**

- [ ] **Step 3: Implement the third branch** in `praise-contradiction.ts`. Add imports and a helper, and widen the signature:
```ts
import { DENIAL_RE } from '@/lib/tutor/voice/simplification-verdict-check';
import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';

const BARE_DENIAL_RE = /\b(?:isn'?t\s+(?:quite\s+)?(?:it|right|correct)|not\s+quite\s+(?:it|right)|that'?s\s+not\s+(?:it|right|correct))\b/i;
/** Digits, decimals, fractions, or a $…$ span — "a value was named". */
const VALUE_TOKEN_RE = /\d+(?:[./]\d+)?|\$[^$]+\$/g;
function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}
function normValue(s: string): string {
  return spokenNumbersToDigits(s).toLowerCase().replace(/[$\s]/g, '').replace(/^[a-z]'?=/, '');
}
```
Then, at the end of `detectPraiseContradiction` (before the final `return null`), add the branch, and change the signature to `(turnText: string, opts?: { studentUtterance?: string })`:
```ts
  // Spec §D.3 — bare praise opener (prose capture, not a math token) followed
  // by a denial that either names the student's own value or names NO value.
  if (!isMathValueToken(affirmed)) {
    const sentences = splitSentences(rest);
    const studentVal = opts?.studentUtterance ? normValue(opts.studentUtterance) : '';
    for (const s of sentences) {
      const denial = DENIAL_RE.test(s) || BARE_DENIAL_RE.test(s);
      if (!denial) continue;
      const named = (s.match(VALUE_TOKEN_RE) ?? []).map(normValue);
      if (named.length === 0) return { affirmed };
      if (studentVal && named.some((v) => v === studentVal || (v.length > 0 && studentVal.endsWith(v)))) return { affirmed };
    }
  }
```
Note the `aside` test: "Not quite the same thing happens with negatives" names no value in THAT sentence — so this branch WOULD fire. To keep it null, restrict `DENIAL_RE`/`BARE_DENIAL_RE` matches to sentences that do not continue with `the same|similar|like`: add `if (/\b(?:not\s+quite|isn'?t\s+quite)\s+(?:the\s+same|similar|like|as)\b/i.test(s)) continue;` before the value test. Replay all five new strings after implementing; adjust only the exclusions, never the fire conditions.

- [ ] **Step 4: Orchestrator wiring.** In VoiceTutorRealtime.tsx:
  1. Change the existing call to `detectPraiseContradiction(praiseContradictionTextSoFar, TUTOR_FALSE_PRAISE_OPENER ? { studentUtterance: transcript } : undefined)`.
  2. Immediately BEFORE the praise-echo block (the comment `// Praise-echo check (verdict-detector round…`), add the new guard, gated to the FIRST sentence of attempt 0 (`!attemptText`) exactly like the inverse-verdict site, reusing that site's `pendingSpoken` / `pendingEq` / `mcqChoices` derivations (hoist them above this block if they are declared below it; do not duplicate the 2-minute-freshness logic):
```ts
                  if (TUTOR_FALSE_PRAISE_OPENER && !attemptKilled && judgeRetriesUsed < MAX_JUDGE_RETRIES && !attemptText && attempt === 0) {
                    const fp = checkFalsePraiseOpener({
                      sentence: updatedSentence,
                      studentUtterance: transcript,
                      verifiedExpectedAnswer: pendingSpoken?.expectedAnswer ?? currentProblemRef.current?.expectedAnswer ?? pendingEq?.display,
                      unverifiedCardAnswer: currentProblemRef.current?.unverifiedCardAnswer,
                      choices: mcqChoices,
                      spokenMoneyEnabled: TUTOR_SPOKEN_MONEY,
                      problemContext: pendingSpoken?.statement ?? currentProblemRef.current?.statement ?? pendingEq?.latex,
                    });
                    if (fp.verdict === 'false_praise') {
                      const reason =
                        `The student answered "${(transcript ?? '').slice(0, 80)}", but the verified answer is ${fp.expected}; your opener affirmed it. ` +
                        `Re-emit: open with the TRUE verdict for what they said, then guide them toward the right answer without revealing it outright.`;
                      rejectionsThisAttempt.push({ action: 'false_praise_opener', reason });
                      judgeRetriesUsed++;
                      await performKill();
                      console.warn(`[brain-orchestrator] false-praise-opener: "${updatedSentence.slice(0, 60)}" after student "${(transcript ?? '').slice(0, 40)}" vs verified ${fp.expected} — kill + retry`);
                      onDebugEvent?.('false_praise_opener_kill', `student=${(transcript ?? '').slice(0, 40)} verified=${fp.expected?.slice(0, 40)} (${fp.matchReason})`);
                      continue;
                    }
                    if (fp.verdict === 'advisory_false_praise') {
                      onDebugEvent?.('false_praise_opener_advisory', `student=${(transcript ?? '').slice(0, 40)} card=${fp.expected?.slice(0, 40)}`);
                      // Correction note, never a kill (unverified card): reuse the
                      // same note-planting call the inverse-verdict advisory tier uses
                      // (grep `advisory_false_denial` below and mirror its note text).
                    }
                  }
```
Import `checkFalsePraiseOpener` and `TUTOR_FALSE_PRAISE_OPENER`.

- [ ] **Step 5: Run batteries + typecheck + commit**

Run: praise-contradiction battery → PASS incl. 5 new; `npm run test:false-praise-opener` → PASS; `npm run test:praise-echo` (if present) unchanged; `npx tsc --noEmit -p .` → 0.
```bash
git add src/lib/tutor/voice/praise-contradiction.ts src/app/tutor/components/VoiceTutorRealtime.tsx scripts/
git commit -m "feat(tutor): false-praise-opener kill tier + bare-denial praise-contradiction branch (spec §D)"
```

---

### Task 9: `PracticeAssignment` model + store

**Files:**
- Create: `src/models/PracticeAssignment.ts`; modify `src/models/index.ts` (export)
- Create: `src/lib/tutor/practice-assign/store.ts`
- Test: typecheck only here (DB-backed behaviour is exercised by Task 12's route test section and the live probe).

**Interfaces:**
- Produces:
```ts
export interface IPracticeAssignmentLo { loId: string; title: string; reason: string; items: PracticeItem[] }
export interface IPracticeAssignment { _id: string; studentId: string; partnerId?: string; sessionId: string; lessonPlanId?: string; courseId?: string; los: IPracticeAssignmentLo[]; nextTimeIntent?: string; locator?: string; auto: boolean; assignedAt: Date; acknowledgedAt?: Date; createdAt: Date }
export const PracticeAssignmentModel: mongoose.Model<IPracticeAssignment>;
// store.ts
export async function upsertAssignment(a: Omit<IPracticeAssignment, '_id' | 'createdAt'> & { _id?: string }): Promise<IPracticeAssignment>;
export async function findOpenAssignments(studentId: string, opts?: { withinDays?: number; requireLocator?: boolean }): Promise<IPracticeAssignment[]>;
export async function findAssignmentBySession(sessionId: string): Promise<IPracticeAssignment | null>;
export async function acknowledgeAssignments(ids: string[], at?: Date): Promise<number>;
```

- [ ] **Step 1: Model**
```ts
// src/models/PracticeAssignment.ts
/**
 * PracticeAssignment — homework the tutor assigned at the close of a session
 * (holistic-pedagogy round, spec §C.3). Engine-owned: the academy reads it
 * (Plan 2's assigned-practice route) and renders the card; next-session
 * status is computed engine-side from EvidenceEvent rows whose itemId is in
 * `los[].items[].id` (practice attempts already emit per-item evidence).
 * One record per session (`sessionId` unique) — a second close call replaces.
 * `locator` absent ⇒ recorded but NEVER spoken about or surfaced (spec §C.6).
 */
import mongoose, { Schema } from 'mongoose';
import type { PracticeItem } from '@evelyn/portal-contract/v1';

export interface IPracticeAssignmentLo { loId: string; title: string; reason: string; items: PracticeItem[] }
export interface IPracticeAssignment {
  _id: string;
  studentId: string;
  partnerId?: string;
  sessionId: string;
  lessonPlanId?: string;
  courseId?: string;
  los: IPracticeAssignmentLo[];
  nextTimeIntent?: string;
  locator?: string;
  /** true when the final-commit fallback assigned it, not the brain tool. */
  auto: boolean;
  assignedAt: Date;
  acknowledgedAt?: Date;
  createdAt: Date;
}

const PracticeAssignmentSchema = new Schema<IPracticeAssignment>(
  {
    _id: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    partnerId: String,
    sessionId: { type: String, required: true, unique: true },
    lessonPlanId: String,
    courseId: String,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    los: { type: [Schema.Types.Mixed as any], default: [] },
    nextTimeIntent: String,
    locator: String,
    auto: { type: Boolean, required: true, default: false },
    assignedAt: { type: Date, required: true },
    acknowledgedAt: Date,
    createdAt: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);
PracticeAssignmentSchema.index({ studentId: 1, assignedAt: -1 });

export const PracticeAssignmentModel =
  (mongoose.models.PracticeAssignment as mongoose.Model<IPracticeAssignment>) ||
  mongoose.model<IPracticeAssignment>('PracticeAssignment', PracticeAssignmentSchema);
```
Add to `src/models/index.ts`: `export { PracticeAssignmentModel, type IPracticeAssignment, type IPracticeAssignmentLo } from './PracticeAssignment';`

- [ ] **Step 2: Store**
```ts
// src/lib/tutor/practice-assign/store.ts
import { randomUUID } from 'node:crypto';
import connectDB from '@core/db';
import { PracticeAssignmentModel, type IPracticeAssignment } from '@/models';

const MS_PER_DAY = 86_400_000;

export async function upsertAssignment(
  a: Omit<IPracticeAssignment, '_id' | 'createdAt'> & { _id?: string },
): Promise<IPracticeAssignment> {
  await connectDB();
  const existing = await PracticeAssignmentModel.findOne({ sessionId: a.sessionId }).lean();
  const _id = existing?._id ?? a._id ?? randomUUID();
  await PracticeAssignmentModel.updateOne(
    { _id },
    { $set: { ...a, _id }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );
  return (await PracticeAssignmentModel.findById(_id).lean()) as IPracticeAssignment;
}

export async function findAssignmentBySession(sessionId: string): Promise<IPracticeAssignment | null> {
  await connectDB();
  return (await PracticeAssignmentModel.findOne({ sessionId }).lean()) as IPracticeAssignment | null;
}

/** Open = not acknowledged, assigned within `withinDays` (default 21). With
 *  `requireLocator` (default true) only records the academy can render. */
export async function findOpenAssignments(
  studentId: string,
  opts?: { withinDays?: number; requireLocator?: boolean },
): Promise<IPracticeAssignment[]> {
  await connectDB();
  const since = new Date(Date.now() - (opts?.withinDays ?? 21) * MS_PER_DAY);
  const q: Record<string, unknown> = { studentId, assignedAt: { $gte: since }, acknowledgedAt: { $exists: false } };
  if (opts?.requireLocator !== false) q.locator = { $exists: true, $ne: '' };
  return (await PracticeAssignmentModel.find(q).sort({ assignedAt: -1 }).limit(5).lean()) as IPracticeAssignment[];
}

export async function acknowledgeAssignments(ids: string[], at = new Date()): Promise<number> {
  if (ids.length === 0) return 0;
  await connectDB();
  const r = await PracticeAssignmentModel.updateMany({ _id: { $in: ids }, acknowledgedAt: { $exists: false } }, { $set: { acknowledgedAt: at } });
  return r.modifiedCount ?? 0;
}
```

- [ ] **Step 3: Typecheck + commit**
```bash
npx tsc --noEmit -p .
git add src/models/PracticeAssignment.ts src/models/index.ts src/lib/tutor/practice-assign/store.ts
git commit -m "feat(tutor): PracticeAssignment model + store (spec §C.3)"
```

---

### Task 10: Assignment item resolver (pure)

**Files:**
- Create: `src/lib/tutor/practice-assign/resolve.ts`
- Test: `scripts/test-practice-assign.ts`; register `"test:practice-assign"`.

**Interfaces:**
- Consumes: `retrievePractice(req, sources)` + `PracticeSources` from `@/lib/tutor/portal/practice`; `AbilityBand` from `@/lib/tutor/learner-model/hints`.
- Produces:
```ts
export const ASSIGN_TUNING = { perLo: 4, cap: 8 };
export function difficultyForBand(band: AbilityBand): 1 | 2 | 3;
export async function resolveAssignmentItems(input: {
  los: Array<{ loId: string; title: string }>; band: AbilityBand; seenItemIds: string[];
  studentId: string; courseId: string;
}, sources: PracticeSources, retrieve?: typeof retrievePractice): Promise<Array<{ loId: string; title: string; items: PracticeItem[] }>>;
```

- [ ] **Step 1: Failing test**
```ts
// scripts/test-practice-assign.ts
/** Spec §C.3 — pure homework resolver over injected PracticeSources. Usage: npx tsx scripts/test-practice-assign.ts */
import { resolveAssignmentItems, difficultyForBand, ASSIGN_TUNING } from '../src/lib/tutor/practice-assign/resolve';
import type { PracticeSources, BankLite } from '../src/lib/tutor/portal/practice';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }

const bank = (loId: string, n: number, difficulty: 1 | 2 | 3 | 4 = 2): BankLite[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${loId}-b${i}`, problemText: `q${i}`, answer: `${i}`, difficulty, loId }));
const sources: PracticeSources = {
  async plansForLoId() { return []; },
  async plansForTopic() { return []; },
  async bankForLoId(loId, difficulty) { return bank(loId, 6).filter((b) => difficulty === undefined || b.difficulty === difficulty); },
  async bankForTopic() { return []; },
};

check('band → difficulty', difficultyForBand('building') === 1 && difficultyForBand('steady') === 2 && difficultyForBand('strong') === 3);

(async () => {
  const out = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }], band: 'steady', seenItemIds: [], studentId: 's', courseId: 'c' }, sources);
  check('one LO → perLo items', out.length === 1 && out[0].items.length === ASSIGN_TUNING.perLo, JSON.stringify(out.map((o) => o.items.length)));
  check('title carried', out[0].title === 'Alpha');

  const out2 = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }, { loId: 'B', title: 'Beta' }, { loId: 'C', title: 'Gamma' }], band: 'steady', seenItemIds: [], studentId: 's', courseId: 'c' }, sources);
  const total = out2.reduce((n, o) => n + o.items.length, 0);
  check('three LOs capped at ASSIGN_TUNING.cap total', total === ASSIGN_TUNING.cap, String(total));
  check('first LO keeps its full share (weakest-first order preserved)', out2[0].items.length === ASSIGN_TUNING.perLo);

  const out3 = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }], band: 'steady', seenItemIds: ['A-b0', 'A-b1', 'A-b2', 'A-b3', 'A-b4'], studentId: 's', courseId: 'c' }, sources);
  check('seen items excluded (only 1 unseen left)', out3[0].items.length === 1 && out3[0].items[0].id === 'A-b5', JSON.stringify(out3[0].items.map((i) => i.id)));

  const out4 = await resolveAssignmentItems({ los: [{ loId: 'Z', title: 'Zeta' }], band: 'steady', seenItemIds: [], studentId: 's', courseId: 'c' }, { ...sources, async bankForLoId() { return []; } });
  check('LO with no items is dropped', out4.length === 0);

  // difficulty passthrough: a 'strong' band asks for 3; our stub bank is all 2 → falls back to any difficulty
  const out5 = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }], band: 'strong', seenItemIds: [], studentId: 's', courseId: 'c' }, sources);
  check('difficulty miss falls back to unfiltered retrieval', out5.length === 1 && out5[0].items.length === ASSIGN_TUNING.perLo);

  console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

- [ ] **Step 2: Run → FAIL.** 

- [ ] **Step 3: Implement**
```ts
// src/lib/tutor/practice-assign/resolve.ts
/**
 * Homework item resolver (spec §C.3). Pure over an injected PracticeSources:
 * per LO, retrieve `perLo` items at the band's difficulty (falling back to
 * any difficulty when the band-filtered pool is empty), excluding items the
 * student has already seen (evidence itemIds), then cap the whole set at
 * `cap`, weakest LO first (the caller orders `los`).
 * Generate-on-exhaustion is deliberately NOT invoked here: homework must be
 * vetted bank/plan items, never a fresh LLM generation at session close.
 */
import type { PracticeItem } from '@evelyn/portal-contract/v1';
import { retrievePractice, type PracticeSources } from '@/lib/tutor/portal/practice';
import type { AbilityBand } from '@/lib/tutor/learner-model/hints';

export const ASSIGN_TUNING = { perLo: 4, cap: 8 };

export function difficultyForBand(band: AbilityBand): 1 | 2 | 3 {
  return band === 'building' ? 1 : band === 'strong' ? 3 : 2;
}

export async function resolveAssignmentItems(
  input: { los: Array<{ loId: string; title: string }>; band: AbilityBand; seenItemIds: string[]; studentId: string; courseId: string },
  sources: PracticeSources,
  retrieve: typeof retrievePractice = retrievePractice,
): Promise<Array<{ loId: string; title: string; items: PracticeItem[] }>> {
  const out: Array<{ loId: string; title: string; items: PracticeItem[] }> = [];
  let remaining = ASSIGN_TUNING.cap;
  const difficulty = difficultyForBand(input.band);
  const noGen = { generate: async () => [] } as unknown as Parameters<typeof retrievePractice>[2];
  for (const lo of input.los) {
    if (remaining <= 0) break;
    const count = Math.min(ASSIGN_TUNING.perLo, remaining);
    const base = { studentId: input.studentId, courseId: input.courseId, scope: { loId: lo.loId } as const, count, excludeIds: input.seenItemIds.slice(0, 500) };
    let res = await retrieve({ ...base, difficulty }, sources, noGen);
    if (res.items.length === 0) res = await retrieve(base, sources, noGen);
    if (res.items.length === 0) continue;
    const items = res.items.slice(0, count);
    out.push({ loId: lo.loId, title: lo.title, items });
    remaining -= items.length;
  }
  return out;
}
```
Check `practice-gen.ts` for the actual `PracticeGenSources` shape and make `noGen` a stub that yields no generated items (the point is that the shortfall path never calls Anthropic). If `retrievePractice` only generates when `genSources` is provided, pass `undefined`… but confirm by reading the shortfall section (~line 175-250 of `practice.ts`) — production must never generate from this path.

- [ ] **Step 4: Run → PASS; register; commit**
```bash
git add src/lib/tutor/practice-assign/resolve.ts scripts/test-practice-assign.ts package.json
git commit -m "feat(tutor): homework item resolver (spec §C.3)"
```

---

### Task 11: Homework status (pure)

**Files:**
- Create: `src/lib/tutor/practice-assign/status.ts`
- Test: `scripts/test-homework-status.ts`; register `"test:homework-status"`.

**Interfaces:**
- Produces:
```ts
export type HomeworkLoStatus = 'untouched' | 'partial' | 'done';
export interface HomeworkLoSummary { loId: string; title: string; total: number; attempted: number; correct: number; lastAttemptAt?: string; status: HomeworkLoStatus }
export interface HomeworkStatus { assignmentId: string; sessionId: string; assignedAt: string; locator?: string; los: HomeworkLoSummary[]; overall: 'untouched' | 'partial' | 'done' | 'weak' }
export function computeHomeworkStatus(a: IPracticeAssignment, rows: Array<{ itemId?: string; outcome: number; occurredAt: Date }>): HomeworkStatus;
export function describeHomework(h: HomeworkStatus): string; // one line for the boot block
```

- [ ] **Step 1: Failing test**
```ts
// scripts/test-homework-status.ts
import { computeHomeworkStatus, describeHomework } from '../src/lib/tutor/practice-assign/status';
import type { IPracticeAssignment } from '../src/models';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }
const t0 = new Date('2026-09-03T10:00:00Z');
const item = (id: string) => ({ id, source: 'bank' as const, problemText: id });
const a: IPracticeAssignment = {
  _id: 'as1', studentId: 's', sessionId: 'sess1', auto: false, assignedAt: t0, createdAt: t0, locator: 'Unit 2 · Practice',
  los: [{ loId: 'lo1', title: 'Fractions', reason: 'r', items: [item('i1'), item('i2'), item('i3'), item('i4')] }],
};
const row = (itemId: string, outcome: number, mins: number) => ({ itemId, outcome, occurredAt: new Date(t0.getTime() + mins * 60_000) });

{ const h = computeHomeworkStatus(a, []); check('no rows → untouched', h.overall === 'untouched' && h.los[0].status === 'untouched' && h.los[0].total === 4); }
{ const h = computeHomeworkStatus(a, [row('i1', 1, 5), row('i2', 0, 6)]); check('2 of 4 → partial, correct 1', h.los[0].status === 'partial' && h.los[0].attempted === 2 && h.los[0].correct === 1 && h.overall === 'partial'); }
{ const h = computeHomeworkStatus(a, [row('i1', 1, 5), row('i2', 1, 6), row('i3', 1, 7), row('i4', 0, 8)]); check('all attempted → done', h.los[0].status === 'done' && h.overall === 'done'); check('lastAttemptAt is the latest row', h.los[0].lastAttemptAt === new Date(t0.getTime() + 8 * 60_000).toISOString()); }
{ const h = computeHomeworkStatus(a, [row('i1', 0, 5), row('i2', 0, 6), row('i3', 1, 7), row('i4', 0, 8)]); check('done but <50% correct → overall weak', h.overall === 'weak'); }
{ const h = computeHomeworkStatus(a, [row('i1', 1, -5)]); check('rows BEFORE assignedAt are ignored', h.overall === 'untouched'); }
{ const h = computeHomeworkStatus(a, [row('i1', 1, 5), row('i1', 0, 9)]); check('same item twice counts once, latest outcome wins', h.los[0].attempted === 1 && h.los[0].correct === 0); }
{ const h = computeHomeworkStatus(a, [row('zzz', 1, 5)]); check('unrelated item ignored', h.overall === 'untouched'); }
check('describeHomework line', /Fractions — 2 of 4 attempted, 1 correct/.test(describeHomework(computeHomeworkStatus(a, [row('i1', 1, 5), row('i2', 0, 6)]))));
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement**
```ts
// src/lib/tutor/practice-assign/status.ts
/** Homework status from the engine's own evidence rows (spec §C.4). Pure. */
import type { IPracticeAssignment } from '@/models';

export type HomeworkLoStatus = 'untouched' | 'partial' | 'done';
export interface HomeworkLoSummary { loId: string; title: string; total: number; attempted: number; correct: number; lastAttemptAt?: string; status: HomeworkLoStatus }
export interface HomeworkStatus { assignmentId: string; sessionId: string; assignedAt: string; locator?: string; los: HomeworkLoSummary[]; overall: 'untouched' | 'partial' | 'done' | 'weak' }

const WEAK_BELOW = 0.5;

export function computeHomeworkStatus(
  a: IPracticeAssignment,
  rows: Array<{ itemId?: string; outcome: number; occurredAt: Date }>,
): HomeworkStatus {
  const since = a.assignedAt.getTime();
  // latest outcome per item, only rows after assignment
  const latest = new Map<string, { outcome: number; at: Date }>();
  for (const r of rows) {
    if (!r.itemId || r.occurredAt.getTime() < since) continue;
    const prev = latest.get(r.itemId);
    if (!prev || r.occurredAt > prev.at) latest.set(r.itemId, { outcome: r.outcome, at: r.occurredAt });
  }
  const los: HomeworkLoSummary[] = a.los.map((lo) => {
    let attempted = 0, correct = 0, last: Date | undefined;
    for (const it of lo.items) {
      const l = latest.get(it.id);
      if (!l) continue;
      attempted += 1;
      if (l.outcome >= 0.99) correct += 1;
      if (!last || l.at > last) last = l.at;
    }
    const status: HomeworkLoStatus = attempted === 0 ? 'untouched' : attempted >= lo.items.length ? 'done' : 'partial';
    return { loId: lo.loId, title: lo.title, total: lo.items.length, attempted, correct, ...(last ? { lastAttemptAt: last.toISOString() } : {}), status };
  });
  const attempted = los.reduce((n, l) => n + l.attempted, 0);
  const correct = los.reduce((n, l) => n + l.correct, 0);
  const total = los.reduce((n, l) => n + l.total, 0);
  let overall: HomeworkStatus['overall'] = attempted === 0 ? 'untouched' : attempted >= total ? 'done' : 'partial';
  if (attempted > 0 && correct / attempted < WEAK_BELOW) overall = 'weak';
  return { assignmentId: a._id, sessionId: a.sessionId, assignedAt: a.assignedAt.toISOString(), ...(a.locator ? { locator: a.locator } : {}), los, overall };
}

export function describeHomework(h: HomeworkStatus): string {
  const date = h.assignedAt.slice(0, 10);
  const parts = h.los.map((l) =>
    l.status === 'untouched' ? `${l.title} — not attempted`
      : l.status === 'done' ? `${l.title} — done, ${l.correct} of ${l.total} correct`
        : `${l.title} — ${l.attempted} of ${l.total} attempted, ${l.correct} correct`);
  return `homework (assigned ${date}): ${parts.join('; ')}`;
}
```

- [ ] **Step 4: Run → PASS; register; commit**
```bash
git add src/lib/tutor/practice-assign/status.ts scripts/test-homework-status.ts package.json
git commit -m "feat(tutor): homework status from evidence rows (spec §C.4)"
```

---

### Task 12: `practice-assign` route + commit-time fallback + acknowledge

**Files:**
- Create: `src/app/api/tutor/practice-assign/route.ts`
- Create: `src/lib/tutor/practice-assign/assign.ts` (shared server helper used by the route AND the commit fallback)
- Modify: `src/app/api/tutor/student-profile/[id]/route.ts` (fallback + acknowledge, near the end of POST before the response)
- Test: `scripts/test-learner-model.ts` — append a DB-backed section (same pattern as its existing commit-route section) if a local Mongo is configured; otherwise typecheck + Task 23's live probe.

**Interfaces:**
- Consumes: Tasks 9–11; `mongoPracticeSources()` from `@/lib/tutor/portal/adapters`; `getLearnerHints(studentId, subject, partnerId)` from `@/lib/tutor/learner-model/hints`; `EvidenceEventModel`; `getLessonPlan`; `checkEmbedAuthAsync`, `partnerIdForInternalRoute`, `embedTokenRejectionReason`, `resolveProfileIdOrRaw`.
- Produces:
```ts
// assign.ts
export async function assignPractice(input: { profileId: string; partnerId: string; externalStudentId: string; sessionId: string; lessonPlanId?: string; courseId?: string; loIds: string[]; reason: string; locator?: string; nextTimeIntent?: string; subject?: string; auto: boolean }): Promise<{ assigned: Array<{ loId: string; title: string; count: number }>; assignmentId: string } | null>;
```
Route: `POST /api/tutor/practice-assign` body `{ studentId, sessionId, lessonPlanId?, courseId?, loIds: string[], reason: string, locator?: string, nextTimeIntent?: string, subject?: string }`, header `x-embed-token` (or body `embedToken`), → `200 { assigned, assignmentId }` | `204` when nothing resolvable | `400` | `401`.

- [ ] **Step 1: Helper**
```ts
// src/lib/tutor/practice-assign/assign.ts
import connectDB from '@core/db';
import { EvidenceEventModel } from '@/models';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { mongoPracticeSources } from '@/lib/tutor/portal/adapters';
import { getLearnerHints } from '@/lib/tutor/learner-model/hints';
import { resolveAssignmentItems } from './resolve';
import { upsertAssignment } from './store';

const MAX_LOS = 2;

export async function assignPractice(input: {
  profileId: string; partnerId: string; externalStudentId: string; sessionId: string; lessonPlanId?: string; courseId?: string;
  loIds: string[]; reason: string; locator?: string; nextTimeIntent?: string; subject?: string; auto: boolean;
}): Promise<{ assigned: Array<{ loId: string; title: string; count: number }>; assignmentId: string } | null> {
  const plan = input.lessonPlanId ? await getLessonPlan(input.lessonPlanId) : null;
  const titleFor = (loId: string): string => {
    const lo = plan?.los.find((l) => l.id === loId);
    return lo?.shortTitle ?? lo?.description ?? loId;
  };
  const loIds = [...new Set(input.loIds.filter((id) => typeof id === 'string' && id.length > 0))].slice(0, MAX_LOS);
  if (loIds.length === 0) return null;
  await connectDB();
  const seen = await EvidenceEventModel.find({ studentId: input.profileId, loId: { $in: loIds }, itemId: { $exists: true } }).select('itemId').lean();
  const seenItemIds = [...new Set(seen.map((r) => r.itemId).filter((x): x is string => typeof x === 'string'))];
  const hints = await getLearnerHints(input.externalStudentId, input.subject, input.partnerId);
  const los = await resolveAssignmentItems(
    { los: loIds.map((loId) => ({ loId, title: titleFor(loId) })), band: hints.band, seenItemIds, studentId: input.profileId, courseId: input.courseId ?? plan?.topic ?? '' },
    mongoPracticeSources(),
  );
  if (los.length === 0) return null;
  const rec = await upsertAssignment({
    studentId: input.profileId, partnerId: input.partnerId, sessionId: input.sessionId,
    lessonPlanId: input.lessonPlanId, courseId: input.courseId,
    los: los.map((l) => ({ ...l, reason: input.reason })),
    nextTimeIntent: input.nextTimeIntent, locator: input.locator, auto: input.auto, assignedAt: new Date(),
  });
  return { assignmentId: rec._id, assigned: los.map((l) => ({ loId: l.loId, title: l.title, count: l.items.length })) };
}
```

- [ ] **Step 2: Route**
```ts
// src/app/api/tutor/practice-assign/route.ts
/** Embed-token-gated homework assignment (spec §C.2). Same auth/identity
 *  shape as mock-review-context/route.ts. Never throws to the client with
 *  a 500 for a resolvable-but-empty pool — 204 means "nothing to assign". */
import { NextRequest, NextResponse } from 'next/server';
import { checkEmbedAuthAsync, partnerIdForInternalRoute, embedTokenRejectionReason } from '@/lib/tutor/portal/embed-token';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';
import { assignPractice } from '@/lib/tutor/practice-assign/assign';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }); }
  const token = req.headers.get('x-embed-token') ?? (typeof body.embedToken === 'string' ? body.embedToken : null);
  delete body.embedToken;
  const studentId = typeof body.studentId === 'string' ? body.studentId : '';
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
  const loIds = Array.isArray(body.loIds) ? body.loIds.filter((x): x is string => typeof x === 'string') : [];
  const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 240) : '';
  if (!studentId || !sessionId || loIds.length === 0 || !reason) {
    return NextResponse.json({ error: 'studentId, sessionId, loIds[], reason required' }, { status: 400 });
  }
  const auth = await checkEmbedAuthAsync({ token, expectedStudentId: studentId, route: 'practice-assign:POST' });
  if (!auth.allow) return NextResponse.json({ error: 'unauthorized', reason: auth.reason }, { status: 401 });
  const rejection = embedTokenRejectionReason(token, auth);
  if (rejection) return NextResponse.json({ error: 'unauthorized', reason: rejection }, { status: 401 });
  const partnerId = partnerIdForInternalRoute(auth);
  const profileId = await resolveProfileIdOrRaw({ partnerId, externalStudentId: studentId });
  try {
    const out = await assignPractice({
      profileId, partnerId, externalStudentId: studentId, sessionId,
      lessonPlanId: typeof body.lessonPlanId === 'string' ? body.lessonPlanId : undefined,
      courseId: typeof body.courseId === 'string' ? body.courseId : undefined,
      loIds, reason,
      locator: typeof body.locator === 'string' && body.locator.trim() ? body.locator.trim().slice(0, 80) : undefined,
      nextTimeIntent: typeof body.nextTimeIntent === 'string' ? body.nextTimeIntent.trim().slice(0, 200) : undefined,
      subject: typeof body.subject === 'string' ? body.subject : undefined,
      auto: false,
    });
    if (!out) return new NextResponse(null, { status: 204 });
    console.log(`[practice-assign] session=${sessionId} assigned=${JSON.stringify(out.assigned)} locator=${body.locator ? 'yes' : 'no'}`);
    return NextResponse.json(out);
  } catch (e) {
    console.error('[practice-assign] failed', e);
    return NextResponse.json({ error: 'assign_failed' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit-time fallback + acknowledge** — in the profile POST, after `nextSessionIntent` handling (Task 4) and before the summary generation:
```ts
  // Spec §C.3 fallback: FINAL commit, nothing assigned this session, and the
  // session produced a recurrence or a well-signalled gap → auto-assign the
  // top LO. Best-effort: a failure here never fails the commit.
  if (body.generateNotes !== false && Array.isArray(body.gaps) && body.gaps.length) {
    const candidates = body.gaps
      .filter((g) => (g.kind ?? 'lo') === 'lo' && g.loId && ((g.recurrences ?? 0) >= 1 || (g.signals?.length ?? 0) >= 2))
      .sort((a, b) => ((b.recurrences ?? 0) - (a.recurrences ?? 0)) || ((b.signals?.length ?? 0) - (a.signals?.length ?? 0)));
    if (candidates.length) {
      try {
        const existing = await findAssignmentBySession(body.sessionId);
        if (!existing) {
          const plan = body.lessonPlanId ? await getLessonPlan(body.lessonPlanId) : null;
          const lo = plan?.los.find((l) => l.id === candidates[0].loId);
          const title = lo?.shortTitle ?? lo?.description ?? candidates[0].loId!;
          const out = await assignPractice({
            profileId, partnerId: partnerIdForInternalRoute(auth), externalStudentId: id, sessionId: body.sessionId,
            lessonPlanId: body.lessonPlanId, loIds: [candidates[0].loId!],
            reason: `Your tutor noticed ${title} needed more practice this session.`,
            locator: body.practiceLocator, nextTimeIntent: body.nextSessionIntent, subject: body.subject, auto: true,
          });
          if (out) { autoAssigned = out.assigned; console.log(`[student-profile] auto-assigned homework session=${body.sessionId} ${JSON.stringify(out.assigned)}`); }
        }
      } catch (e) { console.error('[student-profile] auto-assign failed', e); }
    }
  }
  if (Array.isArray(body.homeworkAcknowledged) && body.homeworkAcknowledged.length) {
    acknowledgeAssignments(body.homeworkAcknowledged.filter((x): x is string => typeof x === 'string').slice(0, 10))
      .catch((e) => console.error('[student-profile] acknowledge failed', e));
  }
```
Declare `let autoAssigned: Array<{ loId: string; title: string; count: number }> | undefined;` before the block and include `...(autoAssigned ? { assigned: autoAssigned } : {})` in the POST's JSON response object. Import `assignPractice`, `findAssignmentBySession`, `acknowledgeAssignments`.

- [ ] **Step 4: Typecheck; DB section (optional); commit**
```bash
npx tsc --noEmit -p .
git add src/app/api/tutor/practice-assign/route.ts src/lib/tutor/practice-assign/assign.ts "src/app/api/tutor/student-profile/[id]/route.ts"
git commit -m "feat(tutor): practice-assign route + commit-time auto-assign fallback + acknowledge (spec §C.2-C.3)"
```

---

### Task 13: `close_session_notes` tool, prompt section, orchestrator handler, embed-config fields, summary line

**Files:**
- Modify: `packages/core/src/knowledge/types.ts` (action union), `src/app/tutor/hooks/toolDefinitions.ts` (tool + mapper), `src/lib/tutor/ai/system-prompt-builder.ts` (new section after line 833), `src/app/tutor/components/VoiceTutorRealtime.tsx` (handler; META_ACTIONS at ~6751; filter at ~7528; commit body; `getSessionSummary`; props), `src/app/tutor-portal/embed/page.tsx` (`EmbedConfig` + prop pass ~1251), `src/app/tutor/components/session/TutorSession.tsx` (props ~141/232/1240), `src/lib/tutor/student-profile/transient-context.ts`, `src/app/tutor/page.tsx` (summary ~3224).

**Interfaces:**
- Consumes: Task 12's route; Task 4's `practiceLocator`/`nextSessionIntent` commit fields; `TUTOR_CLOSE_NOTES`.
- Produces: action `{ action: 'closeSessionNotes'; assignLoIds: string[]; reason?: string; nextTimeIntent?: string }`; VTR props `practiceLocator?: string`, `goalNote?: string`; `getSessionSummary().assignedPractice?: Array<{ loId; title; count }>`.

- [ ] **Step 1: Core action + tool + mapper.** `packages/core/src/knowledge/types.ts` after the gap actions:
```ts
  | { action: 'closeSessionNotes'; assignLoIds: string[]; reason?: string; nextTimeIntent?: string }
```
Tool definition (place after `flag_prerequisite_gap`):
```ts
  {
    name: 'close_session_notes',
    description: 'Silent close-of-session notes — the student does not hear or see this. Call it ONCE when the session is wrapping up: the student signals they are done, you reach the recap segment, the time budget is nearly used, or they say goodbye. It records (a) which objectives deserve homework and (b) what you intend to open with next time. Assign practice ONLY for objectives where you saw real difficulty this session (a recorded gap, repeated errors, a recap that was needed) — never for slips, and never more than two. After calling it, tell the student in ONE sentence where the practice is waiting, naming the practice location given in your context if there is one; if no location was given, say nothing about homework.',
    parameters: {
      type: 'object',
      properties: {
        assignLoIds: { type: 'array', items: { type: 'string' }, maxItems: 2, description: 'LO ids from <lesson_plan> that need practice before next session. Omit or empty when none.' },
        reason: { type: 'string', description: 'One plain sentence the student will read on their homework card, e.g. why these questions help. ≤ 30 words.' },
        nextTimeIntent: { type: 'string', description: 'What you plan to open with next session, in ≤ 20 words — a real intention you will honor, not a platitude.' },
      },
      required: [],
    },
  },
```
Mapper (beside the gap mappers):
```ts
  if (funcName === 'close_session_notes') {
    return {
      action: 'closeSessionNotes',
      assignLoIds: Array.isArray(funcArgs.assignLoIds) ? funcArgs.assignLoIds.filter((x: unknown): x is string => typeof x === 'string').slice(0, 2) : [],
      reason: typeof funcArgs.reason === 'string' ? funcArgs.reason.slice(0, 240) : undefined,
      nextTimeIntent: typeof funcArgs.nextTimeIntent === 'string' ? funcArgs.nextTimeIntent.slice(0, 200) : undefined,
    };
  }
```
Also add `'closeSessionNotes'` to `META_ACTIONS` (~6751) and to the `processed.filter` exclusion list (~7528). If the tools array is subject-filtered (Lever A), confirm `close_session_notes` is in the always-allowed set the way `record_gap` is (grep `record_gap` in `src/lib/tutor/ai/tool-filter*` or wherever `TUTOR_TOOL_SUBJECT_FILTER` is applied, and add it there).

- [ ] **Step 2: Prompt section** — insert after line 833 (end of the notes section), before `### "I'm stuck"`:
```
### Closing the session (silent)

You have one more silent tool, \`close_session_notes\`, for the end of a session. When the session is wrapping — the student says they are done, you reach the recap, the time budget is nearly spent, or they say goodbye — call it ONCE. Give it the one or two objectives where you saw REAL difficulty this session (skip it entirely when there were none — slips are not homework), one plain sentence the student will read beside those questions, and what you intend to open with next time (you will be reminded of it, so mean it). After the call, tell the student in ONE warm sentence where the practice is waiting, using the practice location named in your context when one is given; if none is given, do not mention homework at all.
```

- [ ] **Step 3: Orchestrator handler** — in the command loop beside the gap handler:
```ts
      if (cmd.action === 'closeSessionNotes') {
        if (!TUTOR_CLOSE_NOTES) continue;
        const c = cmd as { assignLoIds: string[]; reason?: string; nextTimeIntent?: string };
        if (c.nextTimeIntent) sessionAccumRef.current.nextTimeIntent = c.nextTimeIntent;
        const planLos = new Set((lessonPlanRef.current?.los ?? []).map((l) => l.id));
        const ledgerLos = new Set([...ledgerRef.current.keys()].filter((k) => !k.startsWith('prereq:')));
        const loIds = c.assignLoIds.filter((id) => planLos.has(id) || ledgerLos.has(id));
        if (loIds.length && studentId && !closeNotesFiredRef.current) {
          closeNotesFiredRef.current = true;
          const reason = (c.reason ?? '').trim() || 'Your tutor picked these to follow up on today\'s lesson.';
          void (async () => {
            try {
              const res = await fetch('/api/tutor/practice-assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(embedToken ? { 'x-embed-token': embedToken } : {}) },
                body: JSON.stringify({ studentId, sessionId: sessionIdRef.current, lessonPlanId, subject, loIds, reason, locator: practiceLocator, nextTimeIntent: c.nextTimeIntent }),
              });
              if (res.status === 200) {
                const data = await res.json() as { assigned: Array<{ loId: string; title: string; count: number }> };
                assignedPracticeRef.current = data.assigned;
                sessionAccumRef.current.assignmentMade = true;
                onDebugEvent?.('practice_assigned', data.assigned.map((a) => `${a.loId}:${a.count}`).join(','));
              } else if (res.status !== 204) {
                onDebugEvent?.('practice_assign_failed', `status=${res.status}`);
              }
            } catch (e) {
              onDebugEvent?.('practice_assign_failed', String((e as Error).message).slice(0, 80));
            }
          })();
        }
        scheduleProfileFlush();
        continue;
      }
```
Add refs `closeNotesFiredRef = useRef(false)`, `assignedPracticeRef = useRef<Array<{ loId: string; title: string; count: number }> | null>(null)`; accumulator fields `nextTimeIntent?: string; assignmentMade?: boolean` (reset them ONLY on the final commit: the intermediate reset must carry `nextTimeIntent`/`assignmentMade` forward — copy them into the fresh accumulator object in the reset at the commit site). In the commit body add `...(isFinal && accum.nextTimeIntent ? { nextSessionIntent: accum.nextTimeIntent } : {})`, `...(isFinal && practiceLocator ? { practiceLocator } : {})`, `...(isFinal && homeworkAckIdsRef.current.length ? { homeworkAcknowledged: homeworkAckIdsRef.current } : {})` (`homeworkAckIdsRef` is filled in Task 20). In the commit response handling, if `data.assigned` is present and `assignedPracticeRef.current` is null, set it and emit `practice_assigned_auto`.

- [ ] **Step 4: Props + embed config + transient lines.** Add `practiceLocator?: string; goalNote?: string;` to `VoiceTutorRealtime`'s props (beside `readinessNote`, ~line 478) and destructure them (~line 918); add the same two to `TutorSession` props (~141), destructure (~232) and pass through (~1240); in `embed/page.tsx` add to `EmbedConfig` after `readiness_note`:
```ts
  /** Spec §C.7 — where tutor-assigned practice lands in the academy UI
   *  ("Unit 2 · Practice"). Presence = the academy renders the homework card. */
  practice_locator?: string;
  /** Spec §C.7 — the student's stated goal, composed by the academy. */
  goal_note?: string;
```
and pass `practiceLocator={config.practice_locator}` `goalNote={config.goal_note}` at ~1251. In `transient-context.ts` add `practiceLocator?: string; goalNote?: string;` to `TransientContextInput` and render, after the readiness line, `practice location for homework: ${practiceLocator}` and `goal: ${goalNote}` when present; include them in both `renderTransientContextBlock(...)` call sites in VTR (~2268 and ~8305) and in their emptiness conditions.

- [ ] **Step 5: Summary line.** In `getSessionSummary` (~18773) add `assignedPractice: assignedPracticeRef.current ?? undefined,`. In `src/app/tutor/page.tsx` summary (~3224, beside `topicsCovered`), render when present:
```tsx
        {sessionSummary.assignedPractice?.length ? (
          <div className="mt-4 text-sm">
            <span className="font-medium">Homework:</span>{' '}
            {sessionSummary.assignedPractice.map((a) => `${a.count} questions on ${a.title}`).join(' · ')} — find them in your Practice tab.
          </div>
        ) : null}
```
Extend the `getSessionSummary` fallback object type in page.tsx (`{ topicsCovered: [], conceptsCovered: [], weakTopics: [] }`) so the new optional field typechecks.

- [ ] **Step 6: Typecheck, coverage test, commit**
```bash
npx tsc --noEmit -p . && npm run test:embed-debug-coverage
git add packages/core/src/knowledge/types.ts src/app/tutor/hooks/toolDefinitions.ts src/lib/tutor/ai/system-prompt-builder.ts src/app/tutor/components/VoiceTutorRealtime.tsx src/app/tutor/components/session/TutorSession.tsx src/app/tutor-portal/embed/page.tsx src/lib/tutor/student-profile/transient-context.ts src/app/tutor/page.tsx
git commit -m "feat(tutor): close_session_notes tool → practice-assign + next-time intent; locator/goal embed fields (spec §C.1-C.2, C.7)"
```

---

### Task 14: Recap candidate picker (pure)

**Files:**
- Create: `src/lib/tutor/learner-model/recap-candidate.ts`
- Test: `scripts/test-recap-candidate.ts`; register `"test:recap-candidate"`.

**Interfaces:**
- Consumes: `GapEntry` (Task 3 fields), `HomeworkStatus` (Task 11), `TUNING.contextBands` from `estimator.ts`, `isGapStale` from the profile store.
- Produces:
```ts
export interface RecapCandidateInput { planLos: Array<{ loId: string; title: string }>; projections: Map<string, { estimate: number | null; reviewDueAt?: Date }>; gaps: GapEntry[]; homework: HomeworkStatus[]; now: Date }
export interface RecapCandidate { loId: string; title: string; reason: 'homework-weak' | 'recurred' | 'review-due' | 'confirmed'; soft: boolean }
export function pickRecapCandidate(input: RecapCandidateInput): RecapCandidate | null;
```

- [ ] **Step 1: Failing test**
```ts
// scripts/test-recap-candidate.ts
import { pickRecapCandidate } from '../src/lib/tutor/learner-model/recap-candidate';
import type { GapEntry } from '../src/lib/tutor/student-profile/types';
import type { HomeworkStatus } from '../src/lib/tutor/practice-assign/status';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }
const now = new Date('2026-09-05T00:00:00Z');
const iso = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const planLos = [{ loId: 'lo1', title: 'One' }, { loId: 'lo2', title: 'Two' }, { loId: 'lo3', title: 'Three' }];
const gap = (loId: string, extra: Partial<GapEntry> & { evidence?: Partial<GapEntry['evidence']> } = {}): GapEntry => ({
  id: `g-${loId}`, kind: 'lo', loId, status: 'confirmed', confidence: 0.75, firstSeenAt: iso(10), lastSeenAt: iso(2),
  ...extra, evidence: { signals: [], observation: 'o', studentQuotes: [], ...(extra.evidence ?? {}) } as GapEntry['evidence'],
});
const hw = (loId: string, overall: HomeworkStatus['overall']): HomeworkStatus => ({ assignmentId: 'a', sessionId: 's', assignedAt: iso(3), los: [{ loId, title: 'One', total: 4, attempted: 2, correct: 0, status: 'partial' }], overall });
const base = { planLos, projections: new Map(), gaps: [], homework: [], now };

check('nothing → null', pickRecapCandidate(base) === null);
check('homework weak wins', pickRecapCandidate({ ...base, homework: [hw('lo2', 'weak')], gaps: [gap('lo1', { evidence: { recurrenceCount: 2 } })] })?.reason === 'homework-weak');
check('homework done is not a candidate', pickRecapCandidate({ ...base, homework: [hw('lo2', 'done')] }) === null);
check('recurred confirmed gap before review-due', pickRecapCandidate({ ...base, gaps: [gap('lo1', { evidence: { recurrenceCount: 1 } })], projections: new Map([['lo2', { estimate: 0.3, reviewDueAt: new Date(now.getTime() - 1) }]]) })?.loId === 'lo1');
check('review-due LO below moderate band', pickRecapCandidate({ ...base, projections: new Map([['lo2', { estimate: 0.6, reviewDueAt: new Date(now.getTime() - 1) }]]) })?.reason === 'review-due');
check('review-due but strong estimate → not a candidate', pickRecapCandidate({ ...base, projections: new Map([['lo2', { estimate: 0.9, reviewDueAt: new Date(now.getTime() - 1) }]]) }) === null);
check('review not yet due → null', pickRecapCandidate({ ...base, projections: new Map([['lo2', { estimate: 0.4, reviewDueAt: new Date(now.getTime() + 86400000) }]]) }) === null);
check('plain confirmed gap on a plan LO', pickRecapCandidate({ ...base, gaps: [gap('lo3')] })?.reason === 'confirmed');
check('candidate-status gap never offers', pickRecapCandidate({ ...base, gaps: [gap('lo3', { status: 'candidate', confidence: 0.25 })] }) === null);
check('gap on a non-plan LO ignored', pickRecapCandidate({ ...base, gaps: [gap('zzz')] }) === null);
check('declined once → soft', pickRecapCandidate({ ...base, gaps: [gap('lo1', { evidence: { recap: { offers: 1, accepts: 0, declines: 1, lastOfferAt: iso(2), lastOutcome: 'declined' } } })] })?.soft === true);
check('declined twice → excluded', pickRecapCandidate({ ...base, gaps: [gap('lo1', { evidence: { recap: { offers: 2, accepts: 0, declines: 2, lastOfferAt: iso(2), lastOutcome: 'declined' } } })] }) === null);
check('stale confirmed gap (>90d) excluded', pickRecapCandidate({ ...base, gaps: [gap('lo1', { lastSeenAt: iso(120) })] }) === null);
check('title comes from the plan', pickRecapCandidate({ ...base, gaps: [gap('lo3')] })?.title === 'Three');
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement**
```ts
// src/lib/tutor/learner-model/recap-candidate.ts
/** Trigger-3 recap candidate (spec §B.7). Pure. One candidate or null. */
import type { GapEntry } from '@/lib/tutor/student-profile/types';
import { isGapStale } from '@/lib/tutor/student-profile/store';
import type { HomeworkStatus } from '@/lib/tutor/practice-assign/status';
import { TUNING } from './estimator';

export interface RecapCandidateInput {
  planLos: Array<{ loId: string; title: string }>;
  projections: Map<string, { estimate: number | null; reviewDueAt?: Date }>;
  gaps: GapEntry[];
  homework: HomeworkStatus[];
  now: Date;
}
export interface RecapCandidate { loId: string; title: string; reason: 'homework-weak' | 'recurred' | 'review-due' | 'confirmed'; soft: boolean }

const MAX_DECLINES = 2;

export function pickRecapCandidate(input: RecapCandidateInput): RecapCandidate | null {
  const titles = new Map(input.planLos.map((l) => [l.loId, l.title]));
  const nowMs = input.now.getTime();
  const softness = (g: GapEntry | undefined): { excluded: boolean; soft: boolean } => {
    const r = g?.evidence?.recap;
    if (!r) return { excluded: false, soft: false };
    if (r.declines >= MAX_DECLINES) return { excluded: true, soft: false };
    return { excluded: false, soft: r.lastOutcome === 'declined' };
  };
  const eligibleGaps = input.gaps.filter((g) =>
    g.kind !== 'prerequisite' && !!g.loId && titles.has(g.loId)
    && (g.status === 'confirmed' || g.status === 'open') && !isGapStale(g, nowMs));
  const gapFor = (loId: string) => eligibleGaps.find((g) => g.loId === loId) ?? input.gaps.find((g) => g.loId === loId);

  // 1. homework partial/weak/untouched on a plan LO
  for (const h of input.homework) {
    if (h.overall === 'done') continue;
    for (const lo of h.los) {
      if (!titles.has(lo.loId)) continue;
      const s = softness(gapFor(lo.loId));
      if (s.excluded) continue;
      return { loId: lo.loId, title: titles.get(lo.loId)!, reason: 'homework-weak', soft: s.soft };
    }
  }
  // 2. recurred confirmed gap
  const recurred = eligibleGaps
    .filter((g) => (g.evidence?.recurrenceCount ?? 0) >= 1)
    .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));
  for (const g of recurred) {
    const s = softness(g);
    if (!s.excluded) return { loId: g.loId!, title: titles.get(g.loId!)!, reason: 'recurred', soft: s.soft };
  }
  // 3. review-due plan LO with estimate below the moderate band
  const due = [...input.projections.entries()]
    .filter(([loId, p]) => titles.has(loId) && p.reviewDueAt && p.reviewDueAt.getTime() <= nowMs && (p.estimate ?? TUNING.untouchedPrior) < TUNING.contextBands.moderate)
    .sort((a, b) => a[1].reviewDueAt!.getTime() - b[1].reviewDueAt!.getTime());
  for (const [loId] of due) {
    const s = softness(gapFor(loId));
    if (!s.excluded) return { loId, title: titles.get(loId)!, reason: 'review-due', soft: s.soft };
  }
  // 4. any confirmed gap on a plan LO
  for (const g of eligibleGaps.sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))) {
    const s = softness(g);
    if (!s.excluded) return { loId: g.loId!, title: titles.get(g.loId!)!, reason: 'confirmed', soft: s.soft };
  }
  return null;
}
```

- [ ] **Step 4: Run → PASS; register; commit**
```bash
git add src/lib/tutor/learner-model/recap-candidate.ts scripts/test-recap-candidate.ts package.json
git commit -m "feat(tutor): trigger-3 recap candidate picker (spec §B.7)"
```

---

### Task 15: Widened `<learner_context>` block + structured boot extras

**Files:**
- Modify: `src/lib/tutor/learner-model/context-block.ts` (renderer input widened; join extended; new return shape)
- Modify: `src/app/api/tutor/student-profile/[id]/route.ts` GET (~line 82)
- Modify: `src/lib/tutor/student-profile/render.ts` (nothing — the profile block stays as is)
- Test: `scripts/test-learner-context.ts` (renderer, pure); register `"test:learner-context"`.

**Interfaces:**
- Consumes: Task 11 `computeHomeworkStatus`/`describeHomework`; Task 14 `pickRecapCandidate`; Task 9 `findOpenAssignments`; `getLearnerHints`; `trendOf`, `TUNING`; `LearnerStateSnapshotModel`, `EvidenceEventModel`, `LearnerStateProjectionModel`.
- Produces:
```ts
export interface LearnerContextLo { loId: string; title: string; estimate: number | null; confidence: string; reviewDue: boolean; trend?: 'up' | 'flat' | 'down'; practice?: { correct: number; total: number; date: string }; quiz?: { awarded: number; max: number; date: string }; mock?: { correct: number; total: number; date: string } }
export interface LearnerContextGap { label: string; observation: string }
export interface LearnerContextInput { los: LearnerContextLo[]; gaps: LearnerContextGap[]; ability?: 'building' | 'steady' | 'strong'; gapsResolved90d?: number; cadence?: { daysSinceLast: number | null; sessionsLast7d: number }; nextTimeIntent?: string; homework?: HomeworkStatus[]; recapCandidate?: RecapCandidate | null; goals?: string[] }
export function renderLearnerContextBlock(input: LearnerContextInput): string | null;   // (old (los, gaps) positional form removed — only context-block.ts and its test call it)
export interface LearnerContextExtras { recapCandidate: RecapCandidate | null; homework: HomeworkStatus[]; nextTimeIntent?: string }
export async function getLearnerContext(profileId: string, lessonPlanId: string, opts: { partnerId: string; externalStudentId: string; subject?: string; socialGoalNotes?: string[] }): Promise<{ block: string | null; extras: LearnerContextExtras }>;
export const LEARNER_CONTEXT_MAX_CHARS = 2400;  // ~600 tokens
```

- [ ] **Step 1: Failing renderer test**
```ts
// scripts/test-learner-context.ts
import { renderLearnerContextBlock, LEARNER_CONTEXT_MAX_CHARS } from '../src/lib/tutor/learner-model/context-block';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }
const lo = (i: number) => ({ loId: `lo${i}`, title: `Objective ${i}`, estimate: 0.4, confidence: 'medium', reviewDue: i === 1, trend: 'up' as const, practice: { correct: 3, total: 5, date: '2026-09-02' }, quiz: { awarded: 6, max: 8, date: '2026-08-30' } });
const full = renderLearnerContextBlock({
  los: [lo(1), lo(2)], gaps: [{ label: 'lo1', observation: 'adds numerators and denominators' }],
  ability: 'building', gapsResolved90d: 2, cadence: { daysSinceLast: 9, sessionsLast7d: 0 },
  nextTimeIntent: 'start with the vertex form', goals: ['Goal: an A in algebra by December'],
  homework: [{ assignmentId: 'a', sessionId: 's', assignedAt: '2026-09-03T00:00:00Z', los: [{ loId: 'lo1', title: 'Objective 1', total: 4, attempted: 2, correct: 1, status: 'partial' }], overall: 'partial' }],
  recapCandidate: { loId: 'lo1', title: 'Objective 1', reason: 'homework-weak', soft: false },
})!;
check('renders', typeof full === 'string' && full.startsWith('<learner_context>'));
check('LO line has band, trend, due, practice and quiz digests', /Objective 1: developing \(medium confidence\) ↑ — DUE FOR REVIEW · practice 3\/5 on 2026-09-02 · quiz 6\/8 pts on 2026-08-30/.test(full), full);
check('ability line', /ability: building/.test(full));
check('resolved line', /gaps resolved in the last 90 days: 2/.test(full));
check('cadence line', /cadence: last session 9 days ago; 0 sessions in the last 7 days/.test(full));
check('next time line', /next time \(your own note from last session\): "start with the vertex form"/.test(full));
check('homework line', /homework \(assigned 2026-09-03\): Objective 1 — 2 of 4 attempted, 1 correct/.test(full));
check('recap candidate line', /recap_candidate: Objective 1 — homework-weak/.test(full));
check('goal line', /goal: an A in algebra by December/.test(full));
check('cadence directive present', /after 7\+ days/.test(full));
check('progress-question directive present', /how they are doing/.test(full));
check('never-read-aloud directive present', /never read this block aloud/i.test(full));
check('size cap', full.length <= LEARNER_CONTEXT_MAX_CHARS, String(full.length));
check('empty → null', renderLearnerContextBlock({ los: [], gaps: [] }) === null);
const minimal = renderLearnerContextBlock({ los: [{ loId: 'x', title: 'X', estimate: null, confidence: 'low', reviewDue: false }], gaps: [] })!;
check('untouched LO bands as developing with no digests', /X: developing \(low confidence\)$/m.test(minimal), minimal);
check('no optional lines when absent', !/cadence:|homework|recap_candidate|goal:|next time/.test(minimal));
const big = renderLearnerContextBlock({ los: Array.from({ length: 12 }, (_, i) => lo(i)), gaps: Array.from({ length: 6 }, (_, i) => ({ label: `g${i}`, observation: 'x'.repeat(300) })) })!;
check('caps LOs at 8 and gaps at 3', (big.match(/^- Objective/gm) ?? []).length === 8 && (big.match(/^- g\d/gm) ?? []).length === 3);
check('big input still under the char cap', big.length <= LEARNER_CONTEXT_MAX_CHARS, String(big.length));
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Renderer** — replace `renderLearnerContextBlock(los, gaps)` with the object form. Keep `bandLabel`, `clipObservation`, `MAX_LOS`, `MAX_GAPS`. Add `export const LEARNER_CONTEXT_MAX_CHARS = 2400;` and `const TREND_GLYPH = { up: '↑', flat: '→', down: '↓' } as const;`. Body:
```ts
export function renderLearnerContextBlock(input: LearnerContextInput): string | null {
  const { los, gaps } = input;
  if (los.length === 0 && gaps.length === 0) return null;
  const lines: string[] = ['<learner_context>'];
  const cappedLos = los.slice(0, MAX_LOS);
  if (cappedLos.length > 0) {
    lines.push("This student's current standing on this lesson's objectives (from accumulated evidence):");
    for (const lo of cappedLos) {
      const estimate = lo.estimate ?? TUNING.untouchedPrior;
      const trend = lo.trend ? ` ${TREND_GLYPH[lo.trend]}` : '';
      const due = lo.reviewDue ? ' — DUE FOR REVIEW' : '';
      const digests: string[] = [];
      if (lo.practice) digests.push(`practice ${lo.practice.correct}/${lo.practice.total} on ${lo.practice.date}`);
      if (lo.quiz) digests.push(`quiz ${lo.quiz.awarded}/${lo.quiz.max} pts on ${lo.quiz.date}`);
      if (lo.mock) digests.push(`mock ${lo.mock.correct}/${lo.mock.total} (${lo.mock.date})`);
      const tail = digests.length ? ` · ${digests.join(' · ')}` : '';
      lines.push(`- ${lo.title}: ${bandLabel(estimate)} (${lo.confidence} confidence)${trend}${due}${tail}`);
    }
  }
  if (input.ability) lines.push(`ability: ${input.ability}`);
  if (typeof input.gapsResolved90d === 'number' && input.gapsResolved90d > 0) lines.push(`gaps resolved in the last 90 days: ${input.gapsResolved90d}`);
  if (input.cadence) {
    const d = input.cadence.daysSinceLast;
    const last = d === null ? 'no prior session on record' : `last session ${d} day${d === 1 ? '' : 's'} ago`;
    lines.push(`cadence: ${last}; ${input.cadence.sessionsLast7d} session${input.cadence.sessionsLast7d === 1 ? '' : 's'} in the last 7 days`);
  }
  if (input.nextTimeIntent) lines.push(`next time (your own note from last session): "${input.nextTimeIntent}"`);
  for (const h of input.homework ?? []) lines.push(describeHomework(h));
  if (input.recapCandidate) lines.push(`recap_candidate: ${input.recapCandidate.title} — ${input.recapCandidate.reason}${input.recapCandidate.soft ? ' (soft)' : ''}`);
  for (const g of (input.goals ?? []).slice(0, 2)) lines.push(`goal: ${g.replace(/^goal:\s*/i, '')}`);
  const cappedGaps = gaps.slice(0, MAX_GAPS);
  if (cappedGaps.length > 0) {
    lines.push('Active gaps observed in past work:');
    for (const gap of cappedGaps) lines.push(`- ${gap.label}: ${clipObservation(gap.observation)}`);
  }
  lines.push(
    'Teach to this: fast-track objectives marked strong (quick check, then advance); slow down and probe where developing; where a gap is listed, surface and resolve the misconception rather than re-explaining from scratch.',
    'Cadence: after 7+ days away, open with a one-minute warm-up on the last objective before the hook; after 2 days or less, skip any re-orientation.',
    'When the student asks how they are doing, answer from these lines — name the trend, one gap that is closing, the homework status and the next step — specifically and honestly; never invent progress.',
    'Never read this block aloud, and never cite it as a record or a system.',
    '</learner_context>',
  );
  let out = lines.join('\n');
  if (out.length > LEARNER_CONTEXT_MAX_CHARS) {
    // Drop gap observations first, then LO digests, until it fits.
    out = out.replace(/(^- [^:\n]+: )([^\n]{80,})$/gm, (_m, a: string, b: string) => `${a}${b.slice(0, 80).trimEnd()}…`);
    if (out.length > LEARNER_CONTEXT_MAX_CHARS) out = out.replace(/ · [^\n]*$/gm, '');
  }
  return out;
}
```
Import `describeHomework` and the `HomeworkStatus`/`RecapCandidate` types.

- [ ] **Step 4: Join** — rename `getLearnerContextBlock` to `getLearnerContext` with the new signature. Keep the existing plan/projection/gap lookup; add:
```ts
    // trend: same read the learner-state route does (snapshot ≥ trendWindowDays old)
    const cutoffDate = new Date(now - TUNING.trendWindowDays * 86_400_000).toISOString().slice(0, 10);
    const prior = await LearnerStateSnapshotModel.findOne({ studentId: profileId, date: { $lte: cutoffDate } }).sort({ date: -1 }).lean();
    const priorByLo = new Map((prior?.los ?? []).map((l) => [l.loId, l.estimate]));
    // per-LO digests from evidence rows (last 60 days, newest first)
    const loIds = cappedPlanLos.map((l) => l.id);
    const rows = await EvidenceEventModel.find({ studentId: profileId, loId: { $in: loIds }, occurredAt: { $gte: new Date(now - 60 * 86_400_000) } })
      .select('loId source outcome pointsAwarded maxPoints occurredAt sessionId').sort({ occurredAt: -1 }).lean();
    const digestFor = (loId: string): Pick<LearnerContextLo, 'practice' | 'quiz' | 'mock'> => {
      const byLo = rows.filter((r) => r.loId === loId);
      const d: Pick<LearnerContextLo, 'practice' | 'quiz' | 'mock'> = {};
      const practiceRows = byLo.filter((r) => r.source === 'practice');
      if (practiceRows.length) { // last practice SET = rows sharing the newest practice sessionId
        const sid = practiceRows[0].sessionId; const set = practiceRows.filter((r) => r.sessionId === sid);
        d.practice = { correct: set.filter((r) => r.outcome >= 0.99).length, total: set.length, date: practiceRows[0].occurredAt.toISOString().slice(0, 10) };
      }
      const quizRows = byLo.filter((r) => r.source === 'quiz' || r.source === 'assessment' || r.source === 'diagnostic');
      if (quizRows.length) {
        const sid = quizRows[0].sessionId; const set = quizRows.filter((r) => r.sessionId === sid);
        const awarded = set.reduce((n, r) => n + (r.pointsAwarded ?? r.outcome), 0); const max = set.reduce((n, r) => n + (r.maxPoints ?? 1), 0);
        d.quiz = { awarded: Math.round(awarded * 10) / 10, max, date: quizRows[0].occurredAt.toISOString().slice(0, 10) };
      }
      const mockRows = byLo.filter((r) => r.source === 'mock');
      if (mockRows.length) {
        const sid = mockRows[0].sessionId; const set = mockRows.filter((r) => r.sessionId === sid);
        d.mock = { correct: set.filter((r) => r.outcome >= 0.99).length, total: set.length, date: mockRows[0].occurredAt.toISOString().slice(0, 10) };
      }
      return d;
    };
```
Build `los` with `trend: trendOf(proj?.estimate ?? null, priorByLo.get(lo.id))` and `...digestFor(lo.id)`. Then:
```ts
    const hints = await getLearnerHints(opts.externalStudentId, opts.subject, opts.partnerId);
    const gapsResolved90d = profile.gaps.filter((g) => g.status === 'resolved' && Date.parse(g.lastSeenAt) >= now - 90 * 86_400_000).length;
    const ended = profile.recentSessions.map((s) => Date.parse(s.endedAt)).filter((t) => Number.isFinite(t));
    const cadence = { daysSinceLast: ended.length ? Math.floor((now - Math.max(...ended)) / 86_400_000) : null, sessionsLast7d: ended.filter((t) => t >= now - 7 * 86_400_000).length };
    const intent = profile.nextSessionIntent && Date.parse(profile.nextSessionIntent.at) >= now - 14 * 86_400_000 ? profile.nextSessionIntent.text : undefined;
    const open = await findOpenAssignments(profileId, { withinDays: 21, requireLocator: true });
    const hwItemIds = open.flatMap((a) => a.los.flatMap((l) => l.items.map((i) => i.id)));
    const hwRows = hwItemIds.length ? await EvidenceEventModel.find({ studentId: profileId, itemId: { $in: hwItemIds } }).select('itemId outcome occurredAt').lean() : [];
    const homework = open.map((a) => computeHomeworkStatus(a, hwRows));
    const recapCandidate = pickRecapCandidate({
      planLos: cappedPlanLos.map((l) => ({ loId: l.id, title: l.shortTitle ?? l.description })),
      projections: new Map(projections.map((p) => [p.loId, { estimate: p.estimate, reviewDueAt: p.reviewDueAt ?? undefined }])),
      gaps: profile.gaps, homework, now: new Date(now),
    });
    const block = renderLearnerContextBlock({ los, gaps, ability: hints.band, gapsResolved90d, cadence, nextTimeIntent: intent, homework, recapCandidate, goals: opts.socialGoalNotes });
    return { block, extras: { recapCandidate, homework, nextTimeIntent: intent } };
```
The catch returns `{ block: null, extras: { recapCandidate: null, homework: [] } }`. Gaps for the block (`MAX_GAPS`) keep the existing confirmed/open filter.

- [ ] **Step 5: Route** — GET handler: replace the `learnerContext` assignment with
```ts
  if (process.env.TUTOR_LEARNER_CONTEXT === 'on' && lessonPlanId) {
    const goalNotes = (new URL(req.url).searchParams.get('goals') ?? '').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 2);
    const lc = await getLearnerContext(profileId, lessonPlanId, { partnerId: partnerIdForInternalRoute(auth), externalStudentId: id, subject: new URL(req.url).searchParams.get('subject') ?? undefined, socialGoalNotes: goalNotes });
    responseBody.learnerContext = lc.block;
    responseBody.learnerExtras = lc.extras;
  }
```
(The client sends `goals` = the `Goal:`-prefixed social-thread notes and `subject` as query params — Task 20 wires that.)

- [ ] **Step 6: Run → PASS; typecheck; register; commit**
```bash
npx tsx scripts/test-learner-context.ts && npx tsc --noEmit -p .
git add src/lib/tutor/learner-model/context-block.ts "src/app/api/tutor/student-profile/[id]/route.ts" scripts/test-learner-context.ts package.json
git commit -m "feat(tutor): widened <learner_context> (trend, digests, cadence, homework, recap candidate, goals) + boot extras (spec §C.4)"
```

---

### Task 16: Recap reply classifier (pure)

**Files:**
- Create: `src/lib/tutor/voice/recap-reply.ts`
- Test: `scripts/test-recap-reply.ts`; register `"test:recap-reply"`.

**Interfaces:**
- Produces: `export type RecapReply = 'accept' | 'decline' | 'unclear'; export function classifyRecapReply(text: string): RecapReply;`

- [ ] **Step 1: Failing test**
```ts
// scripts/test-recap-reply.ts
import { classifyRecapReply as c } from '../src/lib/tutor/voice/recap-reply';
let passed = 0, failed = 0;
function check(name: string, cond: boolean) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}`); } }
for (const s of ['sure', 'yes please', 'yeah', 'ok', 'okay let\'s do it', 'go ahead', 'that would help', 'why not', 'a quick one', 'yes', 'sounds good', 'let\'s do that']) check(`accept: "${s}"`, c(s) === 'accept');
for (const s of ['no', 'nah', 'not now', 'maybe later', 'skip it', 'let\'s keep going', 'move on', 'i\'m fine', 'i\'m good', 'i get it now', 'straight in', 'no thanks', 'let\'s just continue']) check(`decline: "${s}"`, c(s) === 'decline');
for (const s of ['what do you mean by recap', 'twelve', 'um', 'can you explain the vertex again', 'I think it is x equals 4']) check(`unclear: "${s}"`, c(s) === 'unclear');
check('accept with filler', c('um, yeah sure') === 'accept');
check('negated accept is decline', c('no, I\'m good') === 'decline');
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement**
```ts
// src/lib/tutor/voice/recap-reply.ts
/** Spec §B.4 — deterministic yes/no/unclear for a recap OFFER. Decline is
 *  tested first so "no, I'm good" never reads as accept. Pure. */
export type RecapReply = 'accept' | 'decline' | 'unclear';
const FILLER = /\b(?:um+|uh+|er+|hmm+|like|well|so)\b[,\s]*/gi;
const DECLINE_RE = /^(?:no+|nah|nope|not (?:now|right now|today)|(?:maybe )?later|skip(?: it)?|let'?s (?:keep going|just continue|continue|move on)|move on|i'?m (?:fine|good|ok|okay)|i get it(?: now)?|straight in|no thanks?|i'?m alright|we'?re good)\b/i;
const ACCEPT_RE = /^(?:sure|yes+|yeah|yep|yup|ok|okay|alright|go ahead|please|why not|sounds good|let'?s do (?:it|that)|that would help|a quick one|quick one|yes please|do it|i'?d like that)\b/i;
export function classifyRecapReply(text: string): RecapReply {
  const t = text.trim().toLowerCase().replace(FILLER, '').replace(/^[\s,.!-]+/, '').trim();
  if (!t) return 'unclear';
  if (DECLINE_RE.test(t)) return 'decline';
  if (ACCEPT_RE.test(t)) return 'accept';
  return 'unclear';
}
```

- [ ] **Step 4: Run → PASS; register; commit**
```bash
git add src/lib/tutor/voice/recap-reply.ts scripts/test-recap-reply.ts package.json
git commit -m "feat(tutor): recap-offer reply classifier (spec §B.4)"
```

---

### Task 17: Recap per-turn blocks in the brain input

**Files:**
- Modify: `src/lib/tutor/voice/claude-brain.ts` (`BrainTurnInput` ~line 235-260; block assembly at both call sites ~line 1552-1612 and ~1757-1811)
- Modify: `src/app/api/tutor/brain/stream/route.ts` (input passthrough ~line 90-105 and the sanitizer ~line 609-640)
- Test: `scripts/test-recap-blocks.ts`; register `"test:recap-blocks"`.

**Interfaces:**
- Produces on `BrainTurnInput`: `recapOffer?: { loTitle: string; soft?: boolean }; recapGo?: { loTitle: string }; recapWrap?: boolean; recapReply?: 'accept' | 'decline' | 'unclear'`; `export function formatRecapBlocks(input: Pick<BrainTurnInput, 'recapOffer' | 'recapGo' | 'recapWrap' | 'recapReply'>): string`.

- [ ] **Step 1: Failing test**
```ts
// scripts/test-recap-blocks.ts
import { formatRecapBlocks } from '../src/lib/tutor/voice/claude-brain';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }
check('nothing → empty string (byte-identical user content)', formatRecapBlocks({}) === '');
const offer = formatRecapBlocks({ recapOffer: { loTitle: 'Adding fractions' } });
check('offer block names the LO and says STOP and wait', /<recap_offer>[\s\S]*Adding fractions[\s\S]*STOP and wait[\s\S]*<\/recap_offer>/.test(offer), offer);
check('offer block forbids citing a record', /never say a record or system/i.test(offer));
check('soft variant adds the easy-to-decline line', /easy to decline/.test(formatRecapBlocks({ recapOffer: { loTitle: 'X', soft: true } })) && !/easy to decline/.test(offer));
const go = formatRecapBlocks({ recapGo: { loTitle: 'Adding fractions' } });
check('go block orders advance_lesson free then next', /advance_lesson\(\{to:"free"\}\)[\s\S]*advance_lesson\(\{to:"next"\}\)/.test(go), go);
check('go block bounds the recap', /three minutes/.test(go));
check('wrap block', /<recap_wrap>[\s\S]*advance_lesson\(\{to:"next"\}\)[\s\S]*<\/recap_wrap>/.test(formatRecapBlocks({ recapWrap: true })));
check('reply note (decline)', /<recap_offer_reply>[\s\S]*declined[\s\S]*do not ask again/i.test(formatRecapBlocks({ recapReply: 'decline' })));
check('reply note (unclear) tells the brain not to re-ask', /<recap_offer_reply>[\s\S]*unclear[\s\S]*do not re-ask/i.test(formatRecapBlocks({ recapReply: 'unclear' })));
check('accept reply is carried by recap_go, not a reply note', formatRecapBlocks({ recapReply: 'accept' }) === '');
check('blocks end with a blank line separator', formatRecapBlocks({ recapWrap: true }).endsWith('\n\n'));
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement.** Add to `BrainTurnInput` (after `mockReview`):
```ts
  /** Holistic-pedagogy round (spec §B.3/B.5): one-turn recap directives.
   *  All volatile per-turn user content, never the cached system prefix.
   *  Absent ⇒ no block ⇒ userContent byte-identical. */
  recapOffer?: { loTitle: string; soft?: boolean };
  recapGo?: { loTitle: string };
  recapWrap?: boolean;
  recapReply?: 'accept' | 'decline' | 'unclear';
```
Add the formatter beside `formatPracticeSessionBlock`:
```ts
export function formatRecapBlocks(input: Pick<BrainTurnInput, 'recapOffer' | 'recapGo' | 'recapWrap' | 'recapReply'>): string {
  let out = '';
  if (input.recapOffer) {
    const t = input.recapOffer.loTitle;
    out += `<recap_offer>\nYou have now seen the student stumble more than once on: ${t}. In THIS turn, after responding to what they just said, offer a short recap of that idea: say in one sentence that you think a quick two- to three-minute recap might help, ask whether they want it now, then STOP and wait for their answer. Do not begin the recap in this turn. Speak from what you observed; never say a record or system shows they are weak.${input.recapOffer.soft ? ' They said no to this once before — make the offer light and easy to decline.' : ''}\n</recap_offer>\n\n`;
  }
  if (input.recapGo) {
    out += `<recap_go>\nThe student accepted a recap of ${input.recapGo.loTitle}. Do it now: first call advance_lesson({to:"free"}), then run a recall-first recap — ask them to say what they remember, fix the one idea that was wrong, then one short check they do themselves. Keep it under about three minutes. When they get the check right (or after two tries), call advance_lesson({to:"next"}) to return to the lesson and say you are picking up where you left off.\n</recap_go>\n\n`;
  }
  if (input.recapWrap) {
    out += `<recap_wrap>\nWrap the recap now: one sentence of closure, then call advance_lesson({to:"next"}) to return to the lesson.\n</recap_wrap>\n\n`;
  }
  if (input.recapReply === 'decline') {
    out += `<recap_offer_reply>\nThe student declined the recap you offered. Do not ask again this session; carry on with the lesson and keep weaving quick checks of that idea into the material as it comes up.\n</recap_offer_reply>\n\n`;
  } else if (input.recapReply === 'unclear') {
    out += `<recap_offer_reply>\nThe student's reply to your recap offer was unclear. Do not re-ask; respond to what they actually said and continue the lesson.\n</recap_offer_reply>\n\n`;
  }
  return out;
}
```
At BOTH user-content assembly sites (the two places `demoStopBlock + practiceSessionBlock + mockReviewBlock` are concatenated), compute `const recapBlocks = formatRecapBlocks(input);` and insert it right after `mockReviewBlock` in the concatenation.
In `stream/route.ts`: add the four fields to the request body type (beside `mockReview`), and in the sanitizer section pass them through with shape checks:
```ts
      const recapOffer = body.recapOffer && typeof body.recapOffer.loTitle === 'string'
        ? { loTitle: body.recapOffer.loTitle.slice(0, 120), ...(body.recapOffer.soft === true ? { soft: true } : {}) } : undefined;
      const recapGo = body.recapGo && typeof body.recapGo.loTitle === 'string' ? { loTitle: body.recapGo.loTitle.slice(0, 120) } : undefined;
      const recapWrap = body.recapWrap === true ? true : undefined;
      const recapReply = body.recapReply === 'accept' || body.recapReply === 'decline' || body.recapReply === 'unclear' ? body.recapReply : undefined;
```
and include them in the `BrainTurnInput` the route builds (same place `demoStop`/`practiceMode` go).

- [ ] **Step 4: Run → PASS; typecheck; register; commit**
```bash
npx tsx scripts/test-recap-blocks.ts && npx tsc --noEmit -p .
git add src/lib/tutor/voice/claude-brain.ts src/app/api/tutor/brain/stream/route.ts scripts/test-recap-blocks.ts package.json
git commit -m "feat(tutor): <recap_offer>/<recap_go>/<recap_wrap>/<recap_offer_reply> per-turn blocks (spec §B.3-B.5)"
```

---

### Task 18: Recap state machine in the orchestrator

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — refs (~2722), recurrence listener registration (after `feedLedger`), brain-input assembly (~9790-9830), `advance_lesson` free/next handling (~5828 / ~5868), commit body (accumulator gap `recap` field), the accepted-turn dispatch path.

**Interfaces:**
- Consumes: Task 6 (`recurrenceListenerRef`, `activeLedgerLoRef`, `ledgerRef`), Task 16 (`classifyRecapReply`), Task 17 (`recapOffer`/`recapGo`/`recapWrap`/`recapReply` input fields), flag `TUTOR_RECAP_OFFER`.
- Produces: `recapRef`, `pendingRecapOfferRef`, `pendingRecapGoRef`, `activeRecapRef`, and `armSessionStartRecap(c: { loId: string; loTitle: string; soft: boolean })` (Task 20 calls it).

- [ ] **Step 1: Refs + constants**
```ts
  // Holistic-pedagogy round (spec §B): consent-gated recap state.
  const recapRef = useRef<Map<string, { source: 'recurrence' | 'session-start'; offeredAtMs: number; outcome: 'pending' | 'accepted' | 'declined' | 'unclear'; loTitle: string }>>(new Map());
  const pendingRecapOfferRef = useRef<{ loId: string; loTitle: string; source: 'recurrence' | 'session-start'; soft: boolean } | null>(null);
  const pendingRecapGoRef = useRef<{ loId: string; loTitle: string } | null>(null);
  const pendingRecapReplyRef = useRef<'decline' | 'unclear' | null>(null);
  const activeRecapRef = useRef<{ loId: string; loTitle: string; startedAtMs: number; turns: number; wrapNudged: boolean; overrunLogged: boolean; goSeen: boolean } | null>(null);
  const RECAP_WRAP_TURNS = 6, RECAP_WRAP_MS = 4 * 60_000, RECAP_OVERRUN_TURNS = 2;
```

- [ ] **Step 2: Arm on recurrence.** Right after `feedLedger` is defined (Task 6), register the listener once per mount (a `useEffect(() => { recurrenceListenerRef.current = (d) => {...}; return () => { recurrenceListenerRef.current = null; }; }, [])`) with body:
```ts
      if (!TUTOR_RECAP_OFFER || !d.recurrence) return;
      if (recapRef.current.has(d.loId) || activeRecapRef.current) return; // one offer per LO per session; never during a recap
      pendingRecapOfferRef.current = { loId: d.loId, loTitle: d.loTitle, source: 'recurrence', soft: false };
      onDebugEvent?.('recap_offer_armed', `lo="${d.loId}" source=recurrence`);
```
Export the same as a plain function for Task 20:
```ts
  const armSessionStartRecap = (c: { loId: string; loTitle: string; soft: boolean }) => {
    if (!TUTOR_RECAP_OFFER || recapRef.current.has(c.loId)) return;
    recapRef.current.set(c.loId, { source: 'session-start', offeredAtMs: Date.now(), outcome: 'pending', loTitle: c.loTitle });
    onDebugEvent?.('recap_offer_armed', `lo="${c.loId}" source=session-start${c.soft ? ' soft' : ''}`);
  };
```
(Session-start offers ride the opening directive, not `<recap_offer>` — so they go straight to `pending`.)

- [ ] **Step 3: Classify the reply.** In the per-turn brain-input assembly (the block that computes `openingDirective`, ~9663), BEFORE the `input` object is built and only for a real student utterance (`transcript` non-empty and not bracket-marked: `!/^\s*\[/.test(transcript)`), add:
```ts
        let recapReply: 'accept' | 'decline' | 'unclear' | undefined;
        if (TUTOR_RECAP_OFFER) {
          const pendingEntry = [...recapRef.current.entries()].find(([, e]) => e.outcome === 'pending');
          if (pendingEntry && transcript && !/^\s*\[/.test(transcript)) {
            const [loId, entry] = pendingEntry;
            const verdict = classifyRecapReply(transcript);
            entry.outcome = verdict === 'accept' ? 'accepted' : verdict === 'decline' ? 'declined' : 'unclear';
            onDebugEvent?.('recap_offer_reply', `lo="${loId}" ${verdict}`);
            const accum = sessionAccumRef.current;
            const g = accum.gaps.find((x) => x.kind === 'lo' && x.loId === loId);
            const rec = { offered: 1, outcome: verdict === 'accept' ? 'accepted' as const : verdict === 'decline' ? 'declined' as const : undefined };
            if (g) g.recap = rec; else if (verdict !== 'unclear') accum.gaps.push({ kind: 'lo', loId, observation: 'Recap offered this session.', studentQuotes: [], signals: [], recap: rec });
            if (verdict === 'accept') pendingRecapGoRef.current = { loId, loTitle: entry.loTitle };
            else recapReply = verdict;
            scheduleProfileFlush();
          }
        }
```
- [ ] **Step 4: Attach blocks to the turn** — in the `input` object add:
```ts
            recapOffer: TUTOR_RECAP_OFFER && pendingRecapOfferRef.current ? { loTitle: pendingRecapOfferRef.current.loTitle, ...(pendingRecapOfferRef.current.soft ? { soft: true } : {}) } : undefined,
            recapGo: TUTOR_RECAP_OFFER && pendingRecapGoRef.current ? { loTitle: pendingRecapGoRef.current.loTitle } : undefined,
            recapWrap: TUTOR_RECAP_OFFER && activeRecapRef.current && activeRecapRef.current.wrapNudged && !activeRecapRef.current.overrunLogged ? undefined : undefined, // set below
            recapReply,
```
then, immediately after the `input` object is built (before the fetch), consume the one-turn refs:
```ts
        if (TUTOR_RECAP_OFFER) {
          if (pendingRecapOfferRef.current) {
            const o = pendingRecapOfferRef.current;
            recapRef.current.set(o.loId, { source: o.source, offeredAtMs: Date.now(), outcome: 'pending', loTitle: o.loTitle });
            pendingRecapOfferRef.current = null;
          }
          if (pendingRecapGoRef.current) {
            activeRecapRef.current = { ...pendingRecapGoRef.current, startedAtMs: Date.now(), turns: 0, wrapNudged: false, overrunLogged: false, goSeen: false };
            activeLedgerLoRef.current = pendingRecapGoRef.current.loId;
            pendingRecapGoRef.current = null;
          } else if (activeRecapRef.current) {
            const a = activeRecapRef.current;
            a.turns += 1;
            const over = a.turns >= RECAP_WRAP_TURNS || Date.now() - a.startedAtMs >= RECAP_WRAP_MS;
            if (over && !a.wrapNudged) { a.wrapNudged = true; input.recapWrap = true; onDebugEvent?.('recap_wrap_nudged', `lo="${a.loId}" turns=${a.turns}`); }
            else if (a.wrapNudged && a.turns >= RECAP_WRAP_TURNS + RECAP_OVERRUN_TURNS && !a.overrunLogged) { a.overrunLogged = true; onDebugEvent?.('recap_overrun', `lo="${a.loId}" turns=${a.turns}`); }
          }
        }
```
(Replace the placeholder `recapWrap: … ? undefined : undefined` line with plain `recapWrap: undefined,` — the block above mutates `input.recapWrap`. `input` must be a `let`/mutable object; if it is built inline into `JSON.stringify`, hoist it into a `const input = {...}` first.)

- [ ] **Step 5: Free/next hooks.** In the `to === 'free'` branch (after `currentSegmentIdRef.current = ''`): `if (activeRecapRef.current && !activeRecapRef.current.goSeen) { activeRecapRef.current.goSeen = true; onDebugEvent?.('recap_started', `lo="${activeRecapRef.current.loId}"`); }`. After the `to === 'next'` resolution succeeds (inside `if (next) {` before `applyResolvedAdvance`), add:
```ts
            if (activeRecapRef.current) {
              const a = activeRecapRef.current;
              const recovered = ledgerRef.current.get(a.loId)?.recovered === true;
              const g = sessionAccumRef.current.gaps.find((x) => x.kind === 'lo' && x.loId === a.loId);
              const outcome = recovered ? 'improved' as const : 'still_struggling' as const;
              if (g) g.recap = { offered: g.recap?.offered ?? 0, outcome }; else sessionAccumRef.current.gaps.push({ kind: 'lo', loId: a.loId, observation: `Recap ${outcome === 'improved' ? 'helped' : 'did not settle it'} this session.`, studentQuotes: [], signals: [], recap: { offered: 0, outcome } });
              onDebugEvent?.('recap_returned', `lo="${a.loId}" turns=${a.turns} outcome=${outcome}`);
              activeRecapRef.current = null;
              activeLedgerLoRef.current = null;
              scheduleProfileFlush();
            }
```

- [ ] **Step 6: Typecheck; coverage; commit**
```bash
npx tsc --noEmit -p . && npm run test:embed-debug-coverage
git add src/app/tutor/components/VoiceTutorRealtime.tsx
git commit -m "feat(tutor): recap state machine — arm on recurrence, classify reply, free-detour go/return, wrap nudge (spec §B)"
```

---

### Task 19: Continuity clause builders (opener)

**Files:**
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` (beside `STALE_CHECKPOINT_REORIENT_CLAUSE`)
- Test: `scripts/test-continuity-clauses.ts`; register `"test:continuity-clauses"`.

**Interfaces:**
- Produces:
```ts
export interface ContinuityInput { homework?: HomeworkStatus[]; nextTimeIntent?: string; recapCandidate?: RecapCandidate | null }
export function pickContinuityClause(input: ContinuityInput): { clause: string; recapOffer?: { loId: string; loTitle: string; soft: boolean } } | null
```

- [ ] **Step 1: Failing test**
```ts
// scripts/test-continuity-clauses.ts
import { pickContinuityClause } from '../src/lib/tutor/ai/system-prompt-builder';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }
const hw = (overall: 'untouched' | 'partial' | 'done' | 'weak') => [{ assignmentId: 'a', sessionId: 's', assignedAt: '2026-09-03T00:00:00Z', los: [{ loId: 'lo1', title: 'Fractions', total: 4, attempted: overall === 'untouched' ? 0 : 4, correct: overall === 'weak' ? 1 : 3, status: overall === 'untouched' ? 'untouched' as const : 'done' as const }], overall }];
const cand = { loId: 'lo1', title: 'Fractions', reason: 'confirmed' as const, soft: false };
check('nothing → null', pickContinuityClause({}) === null);
const done = pickContinuityClause({ homework: hw('done'), recapCandidate: cand })!;
check('homework done → acknowledge clause, no recap offer', /done well/.test(done.clause) && done.recapOffer === undefined);
const weak = pickContinuityClause({ homework: hw('weak'), recapCandidate: cand })!;
check('homework weak → check + recap offer in one clause', /homework/.test(weak.clause) && /two-minute recap/.test(weak.clause) && weak.recapOffer?.loId === 'lo1');
const untouched = pickContinuityClause({ homework: hw('untouched'), recapCandidate: cand })!;
check('untouched → no guilt + recap offer', /no guilt/.test(untouched.clause) && untouched.recapOffer !== undefined);
const intent = pickContinuityClause({ nextTimeIntent: 'start with vertex form' })!;
check('next-time intent alone', /start with vertex form/.test(intent.clause) && intent.recapOffer === undefined);
const both = pickContinuityClause({ nextTimeIntent: 'start with vertex form', recapCandidate: cand })!;
check('intent + candidate → intent wins, still offers recap', /start with vertex form/.test(both.clause) && /two-minute recap/.test(both.clause) && both.recapOffer?.loId === 'lo1');
const recap = pickContinuityClause({ recapCandidate: { ...cand, soft: true } })!;
check('recap alone (soft) → offer clause with easy-to-decline', /easy to decline/.test(recap.clause) && recap.recapOffer?.soft === true);
check('every clause says this is the ONE continuity move', [done, weak, untouched, intent, both, recap].every((c) => /ONE continuity/.test(c.clause)));
check('no subject words leak', ![done, weak, untouched, intent, both, recap].some((c) => /fraction|algebra|vertex/i.test(c.clause.replace(/Fractions|vertex form/g, ''))));
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement** (after `STALE_CHECKPOINT_REORIENT_CLAUSE`):
```ts
import type { HomeworkStatus } from '@/lib/tutor/practice-assign/status';
import type { RecapCandidate } from '@/lib/tutor/learner-model/recap-candidate';

export interface ContinuityInput { homework?: HomeworkStatus[]; nextTimeIntent?: string; recapCandidate?: RecapCandidate | null }

const ONE_MOVE = 'This is your ONE continuity move for the opening — do not add a second callback or any recap of past sessions beyond it. ';
function recapOfferSentence(c: RecapCandidate, lead: string): string {
  return `${lead}ask whether they would like a two-minute recap of ${c.title} before today's lesson or to go straight in, then wait for their answer before the day's hook.${c.soft ? ' They said no to this once before — make the offer light and easy to decline.' : ''}`;
}

/** Spec §C.6 precedence: homework result → next-time intent → recap offer.
 *  Deterministic — the brain never has to choose between them. */
export function pickContinuityClause(input: ContinuityInput): { clause: string; recapOffer?: { loId: string; loTitle: string; soft: boolean } } | null {
  const hw = input.homework?.[0];
  const cand = input.recapCandidate ?? null;
  const offer = cand ? { loId: cand.loId, loTitle: cand.title, soft: cand.soft } : undefined;
  if (hw) {
    const title = hw.los.map((l) => l.title).join(' and ');
    if (hw.overall === 'done') {
      return { clause: `${ONE_MOVE}Open by checking the homework in ONE sentence: they did it well (${title}) — acknowledge that specifically, then move into today's content.` };
    }
    const status = hw.overall === 'untouched'
      ? `they did not get to the homework on ${title} — ask lightly, with no guilt, then `
      : `their homework on ${title} was only partly done or went shakily — say so kindly in one sentence, then `;
    if (offer) return { clause: `${ONE_MOVE}Open by checking the homework in ONE sentence: ${recapOfferSentence(cand!, status)}`, recapOffer: offer };
    return { clause: `${ONE_MOVE}Open by checking the homework in ONE sentence: ${status}continue into today's content.` };
  }
  if (input.nextTimeIntent) {
    const base = `${ONE_MOVE}You said last time you would start with "${input.nextTimeIntent}" — honor that in your opening. `;
    if (offer) return { clause: base + recapOfferSentence(cand!, 'Before starting, '), recapOffer: offer };
    return { clause: base.trimEnd() };
  }
  if (offer) {
    return { clause: `${ONE_MOVE}Your continuity sentence this session is an OFFER: mention that ${cand!.title} gave them some trouble last time (or that it is a good moment to revisit it), and ${recapOfferSentence(cand!, '')}`, recapOffer: offer };
  }
  return null;
}
```

- [ ] **Step 4: Run → PASS; typecheck; register; commit**
```bash
git add src/lib/tutor/ai/system-prompt-builder.ts scripts/test-continuity-clauses.ts package.json
git commit -m "feat(tutor): deterministic continuity clause (homework → next-time → recap offer) (spec §C.6)"
```

---

### Task 20: Wire boot extras into the opener

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — boot fetch (~8284-8310), directive build (~19010-19030 and ~19365-19380), commit body (`homeworkAcknowledged`), `subject`/`goals` query params.

**Interfaces:**
- Consumes: Task 15's `learnerExtras` response field; Task 18's `armSessionStartRecap`; Task 19's `pickContinuityClause`.
- Produces: `learnerExtrasRef`, `homeworkAckIdsRef` (Task 13's commit body reads it).

- [ ] **Step 1: Boot fetch.** Extend the URL with `&subject=${encodeURIComponent(subject)}` and, when `socialMemory` has threads whose note starts with `Goal:`, `&goals=${encodeURIComponent(goalNotes.join('|'))}`. After `learnerContextBlockRef.current = data.learnerContext ?? null;` add:
```ts
        learnerExtrasRef.current = data.learnerExtras ?? null;
        if (learnerExtrasRef.current?.homework?.length) {
          homeworkAckIdsRef.current = learnerExtrasRef.current.homework.map((h) => h.assignmentId);
          onDebugEvent?.('homework_checked', learnerExtrasRef.current.homework.map((h) => `${h.assignmentId}:${h.overall}`).join(','));
        }
```
with refs `learnerExtrasRef = useRef<{ recapCandidate: RecapCandidate | null; homework: HomeworkStatus[]; nextTimeIntent?: string } | null>(null)` and `homeworkAckIdsRef = useRef<string[]>([])`.

- [ ] **Step 2: Directive build.** At the `baseDirective` site (~19023) and the rebuild site (~19373), prepend the continuity clause when the journey is a returning-subscribed one (`beh.journey === 'subscribed-returning' || beh.journey === 'node-revisit' || beh.journey === 'course-complete'`) and `TUTOR_RECAP_OFFER`:
```ts
            const continuity = TUTOR_RECAP_OFFER && learnerExtrasRef.current && ['subscribed-returning', 'node-revisit', 'course-complete'].includes(beh.journey)
              ? pickContinuityClause(learnerExtrasRef.current) : null;
            if (continuity?.recapOffer) armSessionStartRecap(continuity.recapOffer);
            const baseDirective =
              beh.journey === 'resume-stale' && openerClause
                ? `${STALE_CHECKPOINT_REORIENT_CLAUSE} ${openerClause}`
                : continuity && openerClause ? `${continuity.clause} ${openerClause}` : openerClause;
```
Store `continuity?.clause` in a `continuityClauseRef` so the rebuild site (~19373) uses `continuityClauseRef.current ? `${continuityClauseRef.current} ${rebuilt}` : rebuilt` (keep the stale-reorient branch as is; the two never co-occur since `resume-stale` is excluded above).

- [ ] **Step 3: Typecheck; coverage; commit**
```bash
npx tsc --noEmit -p . && npm run test:embed-debug-coverage
git add src/app/tutor/components/VoiceTutorRealtime.tsx
git commit -m "feat(tutor): opener consumes homework/next-time/recap extras; acknowledges rendered homework (spec §B.7, §C.6)"
```

---

### Task 21: Goals via the social-thread extractor

**Files:**
- Modify: `src/lib/tutor/portal/extract-social-threads.ts` (prompt JOB 1 list ~line 85-90)
- Modify: `src/lib/tutor/student-profile/transient-context.ts` (`renderThreadLine`: a `Goal:`-prefixed context thread renders as `- [goal] …`)
- Test: `scripts/test-goal-threads.ts`; register `"test:goal-threads"`.

- [ ] **Step 1: Failing test**
```ts
// scripts/test-goal-threads.ts
import { renderTransientContextBlock } from '../src/lib/tutor/student-profile/transient-context';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }
const out = renderTransientContextBlock({ socialMemory: [
  { id: 't1', note: 'Goal: an A in algebra by December', kind: 'context', capturedAt: '2026-09-01T00:00:00Z' },
  { id: 't2', note: 'has a dog called Max', kind: 'context', capturedAt: '2026-09-01T00:00:00Z' },
] })!;
check('goal thread renders with [goal] tag', /- \[goal\] an A in algebra by December/.test(out), out);
check('ordinary context thread unchanged', /- \[context\] has a dog called Max/.test(out));
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement.** In `transient-context.ts` `renderThreadLine`:
```ts
function renderThreadLine(t: SocialThread): string {
  const isGoal = /^goal:\s*/i.test(t.note);
  const kind = isGoal ? '[goal] ' : t.kind ? `[${t.kind}] ` : '';
  const note = isGoal ? t.note.replace(/^goal:\s*/i, '') : t.note;
  const lastUsed = t.lastReferencedAt ? ` (last used ${dateOnly(t.lastReferencedAt)})` : '';
  return `- ${kind}${note}${lastUsed}`;
}
```
In `extract-social-threads.ts` JOB 1 add a fourth bullet after `"context"`:
```ts
    '- a GOAL or target the student stated (a grade, a score, an exam date, a skill they want): emit it as kind "context" with the note starting exactly "Goal: " — e.g. "Goal: <what they said>". One goal thread at most.',
```
(`VALID_KINDS` unchanged — the contract's thread-kind enum is closed.)

- [ ] **Step 4: Run → PASS; register; commit**
```bash
git add src/lib/tutor/portal/extract-social-threads.ts src/lib/tutor/student-profile/transient-context.ts scripts/test-goal-threads.ts package.json
git commit -m "feat(tutor): goals captured as Goal:-prefixed context threads; rendered as [goal] (spec §C.5)"
```

---

### Task 22: Prod env flip (byte-identical root + worktree)

**Files:**
- Modify: `/Users/luke/Dev/evelynlearning/.env.local.production` and `/Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-rounds/.env.local.production` (untracked files; R54 byte-copy rule).

- [ ] **Step 1:** Append to the worktree file, after line 336 (`ENABLE_LEARNER_MODEL_SNAPSHOT=true`):
```
# Holistic-pedagogy round (2026-09-05, spec decision 7): the <learner_context>
# boot block (per-LO standing, homework, recap candidate). Server-runtime read.
TUTOR_LEARNER_CONTEXT=on
```
- [ ] **Step 2:** `cp` the worktree file over the root file, then `cmp` them → identical. `grep -n "TUTOR_LEARNER_CONTEXT" .env.local.production` in both → line present once.
- [ ] **Step 3:** No commit (untracked by design). Record the change in the deploy announcement (Task 23).

---

### Task 23: Final gate, typed-input probes, deploy (Praveen-gated)

- [ ] **Step 1: Merge origin/main and gate on the merged tree** (protocol Rule 16): `git fetch origin && git merge origin/main` (resolve nothing unexpected — main should still be `b1dace0c`), then `npx tsc --noEmit -p .`, `npm run build`, `npm run test:all` → only the 4 known reds. Paste the three outputs' tails into the ledger.
- [ ] **Step 2: Flag inlining check** — per the standing lesson, all four new `NEXT_PUBLIC_` flags are absent from the env, so `grep -c NEXT_PUBLIC_TUTOR_STRUGGLE_LEDGER .next/static -r` shows 1 (name present, value inlined as undefined ⇒ ON). Record the counts.
- [ ] **Step 3: Typed-input local probes** (`npm run dev`, `/tutor?studentId=probe-hp-001`, any math plan): (a) answer wrong twice on one try-yourself → debug panel shows `gap_inferred`; a third wrong in the next segment → `gap_recurred` + `recap_offer_armed`, the tutor OFFERS; type `sure` → `recap_offer_reply accept`, `recap_started`, tutor runs the recap, `recap_returned`. (b) fresh session same student, decline with `not now` → `recap_offer_reply decline`, no second offer. (c) type `I'm done for today` → tutor calls `close_session_notes` → `practice_assigned` (or 204 with no bank items — then run on a plan whose LOs have bank rows, e.g. an AP Stats plan). (d) fresh session on the same plan → `homework_checked`, opener checks homework and offers the recap. (e) MCQ card: pick a wrong letter; if the brain opens "Right…" → `false_praise_opener_kill` (expect it rarely; the test battery is the proof, this is a smoke check).
- [ ] **Step 4: Ledger + handoff memory.** Write `docs/superpowers/reports/2026-09-0X-holistic-pedagogy-plan1-ledger.md` (tasks, reviews, rulings, gate outputs) and update `project_tutor_session_handoff.md` + `project_tutor_inferred_gaps_and_consented_recap.md`.
- [ ] **Step 5: Deploy only on Praveen's go** — announce before/after (~8-9 min), `./deploy-tutor.sh` from the worktree, verify `BUILD_ID`, pm2 restarts 0, then `git push origin tutor-rounds:main`. The env line from Task 22 rides this deploy; confirm on the box with `grep TUTOR_LEARNER_CONTEXT /root/evelyn-tutor/.env.local.production` (read-only ssh).

---

## Self-review notes (writer's pass)

- Spec coverage: A.2 (T2), A.3–A.5 (T6), A.6 (T5), A.7 (T3–T4), A.8 (T1); B.1 (no task, by design), B.3–B.6 (T16–T18), B.7 (T14, T15, T19, T20), B.8 (T1, T22); C.1–C.2 (T13), C.3 (T9–T12), C.4 (T11, T15), C.5 (T21), C.6 (T19, T20, locator gate in T9's `findOpenAssignments` + T12), C.7 engine side (T13), C.10 (T1, T22); D.2 (T7), D.3–D.4 (T8), D.5 (T1); §6 telemetry (T1 + each emitter); §7 batteries (one per pure module) + probes (T23).
- Known deviation from spec §C.3: the embed end-screen homework line is not built here (only `/tutor`'s summary); the academy's Session-row chip in Plan 2 covers the enrolled surface. Recorded in the ledger.
- Type consistency: `LedgerDetection`, `HomeworkStatus`, `RecapCandidate`, `ContinuityInput`, `formatRecapBlocks`, `assignPractice`, `getLearnerContext` are each defined once and referenced by those names throughout.
