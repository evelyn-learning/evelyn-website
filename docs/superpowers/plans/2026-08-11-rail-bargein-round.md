# Agenda-Rail Jump Inference + Barge-In Softening (R44) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two live-verified defects from session portal-dc74208b: (A) the agenda rail's active pill freezes when the brain jumps topics without calling `advance_lesson` (verbal jump to an in-plan item left the pill on item 1 all session), and (B) the barge-in gate's strict continuous-energy requirement let the tutor talk over a student whose sustained speech had inter-word dips / AEC-attenuated energy (2 of 5 armed gates never passed).

**Architecture:** (A) mirrors the existing `inferAdvanceFromSegmentCard` precedent — a new pure student-jump-intent matcher pends an inferred advance when the student explicitly asks for an agenda item by name; if the brain's next turn doesn't navigate, the client applies the advance through the same `applyResolvedAdvance` path. Off-plan jumps release the cursor and the rail gains an explicit "Off plan" chip instead of silently highlighting nothing. Prompt hardening rides along. (B) replaces the strict continuous-run walk in `shouldFireBargeInKill` with dip-tolerant accumulation (≥350ms above threshold within a 700ms window), and adds a classifier-confirmed kill: a final transcript that classifies as genuine (`barge_in`/`new_turn`) while TTS is still playing kills immediately, energy notwithstanding — the echo defense the gate fronts for already lives in that classifier.

**Tech Stack:** TypeScript, Next.js engine repo (evelynlearning), `npx tsx scripts/test-*.ts` harnesses, `npx tsc --noEmit`.

## Global Constraints

- Base: branch `rail-bargein-round` off engine main @ dbad3bc4, worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/rail-bargein`. Do not touch other worktrees or the shared checkout.
- User decisions (2026-08-11): rail fix = layered + student-intent match (intent match applies a REAL cursor advance via `applyResolvedAdvance`, both directions — display-only is not implementable since the rail derives from the cursor); barge-in = dip-tolerant sustain + classifier-confirmed kill. Adaptive-threshold-on-desktop was NOT selected — out of scope.
- The intent matcher must never fire without BOTH an explicit move-verb AND a high-confidence label match against the ACTIVE plan's items; a wrong inferred jump corrupts pedagogical state (completedSegments auto-marking). Conservative misses are fine.
- The classifier-confirmed kill fires ONLY on `barge_in` or `new_turn` verdicts — never `continuation`, `filler`, `escalate`, or any echo/noise-drop verdict. Back-channel ("mm-hmm") must not cut the tutor.
- `shouldFireBargeInKill`'s non-'speaking' instant path and its liveness guards (latest frame above threshold + fresh within `maxFrameGapMs`) are behavior-frozen — only the run-continuity rule changes.
- NOTE: `bargein-gate.ts` also contains a timer-variant for the Ink2 STT path (~line 172, "Task X3") that memory records as dead code — do NOT touch it.
- New debug events use the `perception_` prefix (already whitelisted in `EMBED_DEBUG_EVENT_PREFIXES`) or `agenda_` prefix (also whitelisted — verify by grep before relying on it).
- Every existing suite stays green; the ones this round touches directly: `test:bargein-gate`, `test:rail-labels` (28), `npx tsx scripts/test-perception-classifier.ts` (109), prompt-rules pins if a prompt harness exists for Rule 12 (grep `scripts/` for the rule-pin harness pattern, e.g. `test-r33-prompt-rules`).
- Surgical edits in `VoiceTutorRealtime.tsx` (~16k lines); no reformatting. All cited line numbers are approximate post-R43 — locate by the quoted code, not the number.

---

### Task 1: Student-jump-intent matcher (pure module)

**Files:**
- Create: `src/lib/tutor/orchestrator/student-jump-intent.ts`
- Test: `scripts/test-student-jump-intent.ts` (new; register `test:student-jump-intent` in package.json next to the other `test:*` entries)

**Interfaces:**
- Consumes: nothing (pure, import-free like `segment-advance.ts`).
- Produces (Task 2 relies on these exact names):
  ```ts
  export interface JumpCandidateItem { segmentIds: string[]; label: string }
  export function matchStudentJumpIntent(
    transcript: string,
    items: JumpCandidateItem[],
    currentSegmentId: string
  ): { targetSegmentId: string; matchedLabel: string } | null;
  ```

- [ ] **Step 1: Write the failing test** (follow `scripts/test-*.ts` check-pattern; look at an existing harness first)

```ts
import { matchStudentJumpIntent } from '../src/lib/tutor/orchestrator/student-jump-intent';
const items = [
  { segmentIds: ['seg-1a', 'seg-1b'], label: 'Notation & selection' },
  { segmentIds: ['seg-2'], label: 'Second derivative example' },
  { segmentIds: ['seg-3'], label: 'Second derivatives practice' },
  { segmentIds: ['seg-4a', 'seg-4b'], label: 'Derivative patterns' },
];
// the live session's exact shape
check('explicit move-to by name', matchStudentJumpIntent("can we move to derivative patterns", items, 'seg-1a')?.targetSegmentId === 'seg-4a');
check('jump-to verb', matchStudentJumpIntent("let's jump to derivative patterns now", items, 'seg-1a')?.targetSegmentId === 'seg-4a');
check('switch-to partial label', matchStudentJumpIntent('switch to the derivative patterns one', items, 'seg-2')?.targetSegmentId === 'seg-4a');
check('backward jump allowed', matchStudentJumpIntent('go back to notation and selection', items, 'seg-3')?.targetSegmentId === 'seg-1a');
// negatives — every one must be null
check('no verb, label mentioned', matchStudentJumpIntent('is this like the derivative patterns thing?', items, 'seg-1a') === null);
check('verb, no label match', matchStudentJumpIntent("let's move to integration by parts", items, 'seg-1a') === null);
check('verb, weak overlap', matchStudentJumpIntent('move to the second one', items, 'seg-1a') === null);
check('already there', matchStudentJumpIntent('move to derivative patterns', items, 'seg-4a') === null);
check('also current when cursor on 2nd id of same item', matchStudentJumpIntent('move to derivative patterns', items, 'seg-4b') === null);
check('empty transcript', matchStudentJumpIntent('', items, 'seg-1a') === null);
check('empty items', matchStudentJumpIntent('move to derivative patterns', [], 'seg-1a') === null);
check('ambiguous two-label overlap is null', matchStudentJumpIntent('move to second derivative', items, 'seg-1a') === null); // matches both 'Second derivative example' and 'Second derivatives practice' equally-ish → refuse
```

- [ ] **Step 2: Run to verify it fails** — `npx tsx scripts/test-student-jump-intent.ts` → module not found.

- [ ] **Step 3: Implement**

```ts
/**
 * Student-jump-intent matcher (R44, session portal-dc74208b): the student
 * asked "move to derivative patterns"; the brain rerouted content but never
 * called advance_lesson, so the agenda rail's active pill froze (the exact
 * bug class segment-advance.ts already documents for show_segment_card).
 * This is the analogous inference for VERBAL in-plan jumps: an explicit
 * move-verb + a high-confidence match against an agenda item's label.
 * Conservative by design — a wrong inferred jump corrupts pedagogical
 * state, a missed one just leaves today's behavior. Pure, import-free.
 */

export interface JumpCandidateItem { segmentIds: string[]; label: string }

const MOVE_VERB_RE =
  /\b(?:move|switch|jump|go|skip)(?:\s+\w+){0,2}?\s+(?:to|on to|onto|back to)\s+|\b(?:can we do|let'?s do|let'?s try)\s+/i;

function normalizeLabel(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOPWORDS = new Set(['the', 'a', 'an', 'one', 'thing', 'and', 'to', 'of', 'on']);

function contentTokens(s: string): string[] {
  return normalizeLabel(s).split(' ').filter((w) => w && !STOPWORDS.has(w));
}

export function matchStudentJumpIntent(
  transcript: string,
  items: JumpCandidateItem[],
  currentSegmentId: string
): { targetSegmentId: string; matchedLabel: string } | null {
  const t = (transcript ?? '').trim();
  if (!t || items.length === 0) return null;
  const verbMatch = MOVE_VERB_RE.exec(t);
  if (!verbMatch) return null;
  // Only the text AFTER the verb phrase names the destination.
  const tail = normalizeLabel(t.slice(verbMatch.index + verbMatch[0].length));
  if (!tail) return null;
  const tailTokens = new Set(contentTokens(tail));
  if (tailTokens.size === 0) return null;

  // Score every item: fraction of the LABEL's content tokens present in the
  // tail. Full-label containment (normalized substring) is an immediate max.
  type Scored = { item: JumpCandidateItem; score: number };
  const scored: Scored[] = items.map((item) => {
    const norm = normalizeLabel(item.label);
    if (norm && tail.includes(norm)) return { item, score: 1 };
    const toks = contentTokens(item.label);
    if (toks.length === 0) return { item, score: 0 };
    const hit = toks.filter((w) => tailTokens.has(w)).length;
    return { item, score: hit / toks.length };
  });
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const second = scored[1];
  // High confidence: ≥0.75 of the label's tokens present, AND a clear winner
  // (second-best strictly lower, or best is a full containment at 1).
  if (!best || best.score < 0.75) return null;
  if (second && second.score >= best.score && best.score < 1) return null;
  if (second && second.score === 1 && best.score === 1) return null; // two full matches → ambiguous
  if (best.item.segmentIds.includes(currentSegmentId)) return null; // already there
  const targetSegmentId = best.item.segmentIds[0];
  if (!targetSegmentId) return null;
  return { targetSegmentId, matchedLabel: best.item.label };
}
```

Implementation note: the ambiguity test ("move to second derivative" vs the two "Second derivative(s) …" labels) must come out null — if the sketch's scoring doesn't achieve that (both items score ≥0.75 with a tie or near-tie), tighten the clear-winner rule until it does; do not weaken the test.

- [ ] **Step 4: Run tests + tsc** — all green, `npx tsc --noEmit` clean.
- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): student-jump-intent matcher for verbal agenda jumps"`

---

### Task 2: Wire inferred advance + cursor release into VTR

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx`

**Interfaces:**
- Consumes: `matchStudentJumpIntent` (Task 1); existing `applyResolvedAdvance(plan, fromSegId, next)` (~line 3134), `runStudentTurnDetection` (~line 3098), the `cmd.action === 'advanceLesson'` handler (~line 4958), `topicShiftPendingRef`, `activePlanRef`/`currentSegmentIdRef` (locate by grep), and `buildRailModel`'s item labels — the rail items come from `src/lib/tutor/lesson-plan/rail-labels.ts` `buildRailModel()`; reuse its grouping so the matcher sees the same labels the user sees (export a light helper from rail-labels if needed: `railJumpCandidates(plan, segmentLabels): JumpCandidateItem[]` mapping each rail item to its segment ids + label).
- Produces: pending-jump mechanism Task 3's rail test relies on indirectly (no new exports from VTR).

- [ ] **Step 1: Add the pending-jump ref + detection**

In `runStudentTurnDetection` (both voice and typed paths reach it), after the existing `detectStudentIntent` block, add:

```ts
// R44 student-jump inference: an explicit "move to <agenda item>" request.
// Pend it; if the brain's NEXT turn navigates (advance_lesson or an
// inferred segment-card advance), the pending entry is cleared unused.
// If the turn completes WITHOUT navigation, we apply the advance the
// brain forgot — same philosophy as inferAdvanceFromSegmentCard.
if (activePlanRef.current && currentSegmentIdRef.current) {
  const candidates = railJumpCandidates(activePlanRef.current, segmentLabelsRef.current);
  const jump = matchStudentJumpIntent(text, candidates, currentSegmentIdRef.current);
  if (jump) {
    pendingStudentJumpRef.current = { segId: jump.targetSegmentId, label: jump.matchedLabel, atMs: Date.now() };
    onDebugEvent?.('agenda_jump_pending', `${jump.matchedLabel} → ${jump.targetSegmentId}`);
  }
}
```

New ref near the other advance-related refs: `const pendingStudentJumpRef = useRef<{ segId: string; label: string; atMs: number } | null>(null);`
(Exact ref names for plan/labels: grep for how `buildRailModel` is fed in `TutorSession.tsx:1107` and how VTR exposes the plan — if `segmentLabels` lives only in TutorSession, thread the candidates differently: compute them from `activePlanRef.current.segments` titles directly; the matcher only needs labels the student would say, and segment titles are the source rail labels derive from. State in the report which source you used and why.)

- [ ] **Step 2: Clear-on-navigation + apply-on-turn-end**

(a) In the `advanceLesson` command handler (~4958), first line: `pendingStudentJumpRef.current = null;` (brain navigated — inference not needed, regardless of where it went).
(b) In the `show_segment_card` inferred-advance site (VTR ~11060, `inferAdvanceFromSegmentCard` wiring): clear the ref there too when an advance is inferred.
(c) At the brain-turn completion seam — locate where a completed brain turn's bookkeeping runs after the command batch is fully processed (candidates: where `brain_turn` debug event is emitted, or immediately after the attempt loop resolves in `callBrainOnce`'s success path; pick the one that runs exactly once per completed turn and AFTER all tool-calls of that turn were handled; name it in your report):

```ts
// R44: the student explicitly asked for an agenda item last turn and the
// brain served content without any navigation — apply the advance it
// forgot (mirrors inferAdvanceFromSegmentCard's contract).
const pendingJump = pendingStudentJumpRef.current;
if (pendingJump && activePlanRef.current) {
  pendingStudentJumpRef.current = null;
  const plan = activePlanRef.current;
  if (plan.segments.some((s) => s.id === pendingJump.segId) && currentSegmentIdRef.current !== pendingJump.segId) {
    applyResolvedAdvance(plan, currentSegmentIdRef.current, pendingJump.segId);
    onDebugEvent?.('agenda_jump_inferred', `${pendingJump.label} → ${pendingJump.segId}`);
  }
}
```

The pending entry lives for exactly ONE brain turn: set on the student's transcript, consumed (applied or discarded) at that turn's completion. No timers.

(d) Off-plan release: in the same turn-end seam, AFTER the pending-jump block — when there was no pending jump but `topicShiftPendingRef.current` fired for this turn AND the turn contained no `advance_lesson` AND a plan is active with a non-empty cursor, release the cursor exactly as the `to === 'free'` branch does (~4974: `currentSegmentIdRef.current = ''` + `setActiveSegmentId('')` — copy that branch's full body including any side-effects it runs) + `onDebugEvent?.('agenda_offplan_release', 'topic shift without navigation')`. Track "turn contained no advance_lesson" with a per-turn boolean set false at turn start and true in the advanceLesson handler. NOTE: `topicShiftPendingRef` is also consumed by the whiteboard newPage logic — read how it's cleared (grep `topicShiftPendingRef`) and do NOT steal its consumption; read the flag without clearing it if the newPage path owns clearing, and state in your report how you avoided double-consumption.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean. No component harness exists for VTR wiring: paste the three wiring hunks in your report with a manual trace of the live session's shape (student "move to derivative patterns" → pending set → brain turn serves showEquation only → turn end applies advance → rail re-derives with new cursor).
- [ ] **Step 4: Commit** — `git commit -m "feat(tutor): infer agenda advance from explicit student jump requests; release cursor on off-plan topic shifts"`

---

### Task 3: Rail off-plan chip

**Files:**
- Modify: `src/lib/tutor/lesson-plan/rail-labels.ts` (`buildRailModel`), `src/app/tutor/components/session/AgendaRail.tsx`
- Test: extend the rail harness (`test:rail-labels`, 28 existing checks — find the script by grep)

**Interfaces:**
- Consumes: `buildRailModel(plan, currentSegmentId, completed, segmentLabels)` — currently marks `current` per item via `segIds.includes(currentSegmentId)` (rail-labels.ts ~55-58).
- Produces: `buildRailModel`'s return gains `offPlan: boolean` (true when `currentSegmentId === ''` and the plan has segments); `AgendaRail` renders a trailing muted chip labeled `Off plan` with the active highlight when `offPlan` is true.

- [ ] **Step 1: Failing tests** — add to the rail harness:

```ts
check('empty cursor → offPlan flag set', buildRailModel(plan, '', new Set(), labels).offPlan === true);
check('empty cursor → no item current', buildRailModel(plan, '', new Set(), labels).items.every((i) => !i.current));
check('normal cursor → offPlan false', buildRailModel(plan, firstSegId, new Set(), labels).offPlan === false);
```

(Adapt fixture construction to the harness's existing plan fixtures.)

- [ ] **Step 2: Implement** — `buildRailModel` computes `offPlan = plan.segments.length > 0 && currentSegmentId === ''` and returns it alongside items. `AgendaRail.tsx`: when `offPlan`, append a chip after the item pills using the same pill classes as an active item but with muted styling (reuse the existing class strings in the file — match idiom, e.g. the `current` classes with a lower-emphasis background) and label text `Off plan`; it is non-interactive like the others (display-only v1). Update `TutorSession.tsx`'s call site only if the return-shape change requires destructuring edits.
- [ ] **Step 3: Run** — rail harness all green (28 + 3), `npx tsc --noEmit` clean.
- [ ] **Step 4: Commit** — `git commit -m "feat(tutor): agenda rail off-plan chip — free-cursor state is visible instead of blank"`

---

### Task 4: Prompt hardening (Rule 12 / action-commitment)

**Files:**
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` (Rule 12 area ~397-399 and the topic-switch paragraph ~772)
- Test: if a prompt-pin harness covers these rules (grep `scripts/` for the file asserting Rule-12/action-commitment strings, e.g. `test-r33-prompt-rules`), pin the new sentence; otherwise state in the report that no harness covers this prompt region.

- [ ] **Step 1: Edit** — in the Rule-12/topic-switch text add one HARD sentence with an inline example (match the file's existing rule voice):
  `When the student asks to move to an agenda item BY NAME ("can we move to derivative patterns"), call advance_lesson({to: "<that segment's id>"}) BEFORE serving any content for it — narrating the move without the tool call freezes the lesson cursor and the agenda display.`
- [ ] **Step 2: Pin it** (if a harness exists), run that harness + `npx tsc --noEmit`.
- [ ] **Step 3: Commit** — `git commit -m "feat(tutor): prompt hard-rule — named agenda jumps must call advance_lesson before content"`

---

### Task 5: Dip-tolerant barge-in sustain

**Files:**
- Modify: `src/lib/tutor/voice/bargein-gate.ts` (`shouldFireBargeInKill` only — the Ink2 timer-variant lower in the file is frozen)
- Test: extend the gate harness (`test:bargein-gate` — find the script file)

**Interfaces:**
- Consumes/Produces: `shouldFireBargeInKill(input: BargeInGateInput): boolean` — signature unchanged. `BargeInGateInput` gains optional `accumWindowMs?: number` (default new exported const `DEFAULT_BARGEIN_ACCUM_WINDOW_MS = 700`). Call sites need no edits (defaulted), but verify both VTR call sites still typecheck.

- [ ] **Step 1: Failing tests** — using the harness's existing frame-builder helpers:

```ts
// Live incident shape: sustained speech with inter-word dips. Frames at ~85ms
// cadence; energy alternates 0.3 / 0.1 in 200ms voiced runs with 100ms dips.
// Total above-threshold coverage ≥350ms within the last 700ms → FIRES.
check('dips within window fire', shouldFireBargeInKill(framesWithDips()) === true);
// A single 200ms echo blip then silence → still refuses (accumulated < 350).
check('short blip still refused', shouldFireBargeInKill(shortBlip()) === false);
// Sparse blips: 3×100ms voiced spread over 2s (only ~100-200ms inside any
// 700ms window) → refused.
check('sparse blips refused', shouldFireBargeInKill(sparseBlips()) === false);
// Continuous 350ms run (the old passing shape) still fires.
check('continuous run still fires', shouldFireBargeInKill(continuousRun()) === true);
// Liveness guards unchanged: currently-quiet mic refused even with past coverage.
check('dead burst refused', shouldFireBargeInKill(deadBurst()) === false);
// non-'speaking' instant path unchanged.
check('non-speaking instant', shouldFireBargeInKill(nonSpeaking()) === true);
```

- [ ] **Step 2: Implement** — keep the existing filter/sort, the `last.energy < threshold → false` and staleness guards VERBATIM. Replace the backward run-walk with accumulation: walk frames inside `[nowMs - accumWindowMs, nowMs]`; for each above-threshold frame, credit `min(gap-to-next-frame-or-now, maxFrameGapMs)`... simpler and sufficient: credit each above-threshold frame the duration to its successor frame (or to `nowMs` for the last), capped at `maxFrameGapMs`; sum credits; fire when `sum >= sustainMs`. Document in the header comment that the continuity requirement became windowed accumulation (R44, session portal-dc74208b: 2/5 armed gates never passed on sustained real speech — inter-word dips + AEC-attenuated capture broke the strict run).
- [ ] **Step 3: Run** — gate harness all green (old + new), `npx tsc --noEmit` clean.
- [ ] **Step 4: Commit** — `git commit -m "fix(tutor): barge-in sustain is windowed accumulation — inter-word dips no longer reset the gate"`

---

### Task 6: Classifier-confirmed barge-in kill

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (the transcript-during-speaking seam — the retro-gate arm site is the anchor: `perception_bargein_gate_armed … (retro)` string, ~line 14690)

**Interfaces:**
- Consumes: the classifier verdict already computed for the arriving transcript (`classifyHeuristic` call site — the retro path runs after/near it; read the surrounding flow to find where the verdict for THIS transcript is available), the kill path the gate-pass timer invokes (whatever runs after `perception_bargein_gate_passed` — reuse that exact function/branch).

- [ ] **Step 1: Implement** — at the retro seam, when a FINAL transcript's verdict is `barge_in` or `new_turn` AND production state is still `'speaking'`: skip the retro energy poll entirely and fire the same kill the gate-pass fires, with `onDebugEvent?.('perception_bargein_classifier_kill', `verdict=${verdict} · "${transcript.slice(0, 60)}"`)`. Verdicts `continuation`, `filler`, `escalate`, and every drop verdict keep today's behavior (retro energy poll or deferred dispatch). The transcript then dispatches through its existing path — do not double-dispatch; the kill only silences TTS/aborts the brain turn exactly as a gate-pass kill does. Guard: if a gate-pass kill already fired for this utterance (`bargeInGateTimerRef` cleared by a pass), do nothing.
- [ ] **Step 2: Verify** — `npx tsc --noEmit`; no component harness — report the wiring hunk with a manual trace of the live incident (06:27:52: gate armed, energy never passed, transcript "Okay, so I have no idea that it's a product…" classified `new_turn` while tutor mid-turn → classifier kill fires → tutor stops → dispatch proceeds). Also trace the back-channel negative: "mm-hmm" during TTS → filler/echo verdict → no kill.
- [ ] **Step 3: Commit** — `git commit -m "feat(tutor): classifier-confirmed barge-in kill — genuine transcripts cut TTS even when the energy gate never passes"`

---

### Task 7: Full battery gate

**Files:** none (verification only)

- [ ] **Step 1:** Run: `test:student-jump-intent`, the rail harness, the bargein-gate harness, `npx tsx scripts/test-perception-classifier.ts`, `npx tsx scripts/test-utterance-answer-match.ts`, `npx tsx scripts/test-praise-echo-check.ts`, `npx tsx scripts/test-inverse-verdict-check.ts`, any prompt-pin harness touched in Task 4. Expected: all green (verdict-guard's 1 pre-existing main failure is known — do not chase it).
- [ ] **Step 2:** `npx tsc --noEmit` + `npm run build` — clean/success.
- [ ] **Step 3:** Report; do NOT merge or deploy — the controller gates the ship (headless-browser probe of /tutor + embed is part of the deploy protocol now).

## Self-Review (at write time)

- Both user decisions covered (Tasks 1-4 = layered+intent; Tasks 5-6 = accumulation+classifier kill); adaptive-desktop correctly excluded.
- Type consistency: `JumpCandidateItem`/`matchStudentJumpIntent` names match between Tasks 1-2; `accumWindowMs` default exported for the harness.
- Known soft spots for implementers: Task 2's turn-end seam and `topicShiftPendingRef` non-consumption are locate-by-reading steps with explicit report-back requirements; Task 6 reuses the existing kill path rather than defining a new one.
