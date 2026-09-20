# Live-check-3 fixes + homework drafts (engine) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the ranked defect list from live check 3 (`portal-3a024b75`, 2026-09-06) in the tutor engine, and replace the three end-anchored homework creation paths with a draft-during-session / finalize-on-any-exit record, so a real session never again (a) silently loses a step equation, (b) suppresses a correct judge flag against a stale key, (c) ends with a spoken homework pointer that has no record behind it.

**Architecture:** Every guard stays deterministic and subject-free, extracted into a pure module under `src/lib/tutor/**` with its own `scripts/test-*.ts` battery, then wired into `VoiceTutorRealtime.tsx` (VTR) at the named anchor. Homework becomes one server record (`PracticeAssignment.status: 'draft' | 'assigned'`) that the client drafts on evidence, the server finalizes on End / pagehide / time-cap / the close tool, sweeps after 2 h, and the client rehydrates on resume. Spoken homework references are gated on a finalize that returned an assignment THIS session.

**Tech Stack:** Next.js (apps/tutor), TypeScript, Mongoose, `npx tsx scripts/test-*.ts` batteries registered as `test:*` in `apps/tutor/package.json`, typed-input harness `npm run test:tutor-e2e -- <scenario>`.

**Spec:** `docs/superpowers/reports/2026-09-06-handoff-live-check-3-portal-3a024b75.md` (the two "Design note (Praveen, 2026-09-07)" sections are rulings). Root cause of R1 established in this plan's Task 1 preamble.

## Global Constraints

- **Worktree only:** `/Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-rounds` (branch `tutor-rounds`). Never touch the repo root. All `npm` commands run from `apps/tutor` inside that worktree.
- **Baseline before Task 1:** record `npx tsc --noEmit -p tsconfig.json` and `npm run test:all` output in the SDD ledger. Only pre-existing failures already listed there may remain red at the final gate.
- **Flags default ON:** every new client flag is `process.env.NEXT_PUBLIC_<NAME> !== 'off'` (memory rule 2026-08-20: dark flags left prod with the bugs).
- **Every new debug-event type** (string literal in `onDebugEvent?.('…')`) must be covered by `EMBED_DEBUG_EVENT_PREFIXES` in `src/app/tutor-portal/embed/page.tsx` or explicitly excluded in `scripts/test-embed-debug-coverage.ts`. `npm run test:embed-debug-coverage` enforces it.
- **Prompts and reasons stay generic:** no subject-specific examples inside guard reasons (memory: feedback_generic_prompts).
- **Commit per task** from the worktree, message prefix `fix(tutor):` / `feat(tutor):` / `test(tutor):`, trailer lines:
  `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_017HSQzGrkRuuzVWbUCnDZ8x`.
- **Deploy and push are Praveen-gated.** The final task ends at "gate green + handoff written".
- Tests are `strict` `node:assert` scripts run with `npx tsx`; a new battery is a new `"test:<name>": "npx tsx scripts/test-<name>.ts"` line in `apps/tutor/package.json` (so `test:all` picks it up).

---

## File map (what each new file owns)

| File | Responsibility |
|---|---|
| `src/lib/tutor/whiteboard/equation-label-dedup.ts` | Pure decision for the show_equation label-duplicate guard (page-scoped, prior-on-board) |
| `src/lib/tutor/voice/rule8-client.ts` | (existing) + `countBoardRenderTools` so meta tools never trigger a client repair |
| `src/lib/tutor/voice/judge-gate-key.ts` | Which verified key the judge denial-advisory gate may use |
| `src/lib/tutor/voice/false-praise-opener.ts` | (existing) + `utteranceStatesValue` pre-check |
| `src/lib/tutor/voice/posed-computation.ts` | (existing) + DISTRIBUTE shape |
| `src/lib/tutor/voice/denied-answer-reversal.ts` | (existing) + `isExplanatoryMention` |
| `src/lib/tutor/voice/authored-ending.ts` | Solution-count classification + authored-ending contradiction |
| `src/lib/tutor/voice/self-correction-retry.ts` | Retry reason that restarts from the student's move |
| `src/lib/tutor/voice/session-struggles-block.ts` | `<session_struggles>` block for the brain turn |
| `src/lib/tutor/judge-prompt.ts` | (existing) + `<authored_solution>` block |
| `src/models/PracticeAssignment.ts` | (existing) + `status`, `draftedAt`, `finalizedAt`, `finalizeSource`, `triggers` |
| `src/lib/tutor/practice-assign/store.ts` | (existing) + draft/finalize/sweep queries and pure patch builders |
| `src/lib/tutor/practice-assign/assign.ts` | (existing) + `status` param, draft LO merge |
| `src/app/api/tutor/practice-assign/{draft,finalize,state}/route.ts` | Embed-token-gated draft lifecycle routes |
| `src/app/tutor/components/session/TutorSession.tsx` / `SessionStage.tsx` | Homework action pin |
| `scripts/tutor-e2e/scenarios/render-step-labels.ts` | Typed harness reproduction for R1 |

---

### Task 1: R1 — the show_equation label-duplicate guard must not eat step equations

**Root cause (established 2026-09-07 from `scratchpad/live3/session.json`):** every "1 render(s) painted" with no id + `rule8_client_repair sent=1 painted=0` was a `showEquation` whose `label`, after normalization, matched a label used EARLIER IN THE SAME SEGMENT with different latex. VTR's flatMap guard (`Dropping label-duplicate equation`, ~line 5354–5370) then `return []`, emitted `show_equation_label_duplicate_silent` — a type NOT in `EMBED_DEBUG_EVENT_PREFIXES`, so embed sessions persist nothing — and the empty batch still entered the render-sync buffer, whose flush logs `${ready.length} render(s) painted` (batches, not commands). The map (`equationLabelsThisSessionRef`) is cleared only on segment advance (~line 4276); this session sat in one segment for 27 minutes across five problems, so "Collecting x terms", "Final answer", "Distribution first", "Fresh equation to solve" each recurred and each recurrence vanished. The advanceLesson-only "drops" (17:47:34, 17:51:13) were the same empty-batch artefact plus Rule 8 counting a meta tool as a render — instrument noise, not lost ink.

**Files:**
- Create: `src/lib/tutor/whiteboard/equation-label-dedup.ts`
- Create: `scripts/test-equation-label-dedup.ts`
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (the block starting `// Label-normalization dedup.` inside the `if (cmd.action === 'showEquation')` flatMap branch, ~5330–5378; the ref declaration `equationLabelsThisSessionRef` ~2805)
- Modify: `src/app/tutor-portal/embed/page.tsx` (`EMBED_DEBUG_EVENT_PREFIXES`)
- Modify: `apps/tutor/package.json` (register `test:equation-label-dedup`)

**Interfaces:**
- Produces: `normalizeEquationLabel(raw: string): string`; `decideLabelDuplicate(args): LabelDedupDecision`; `SeenEquationLabel` type (used by VTR's ref).

- [ ] **Step 1: Write the failing test**

```ts
// scripts/test-equation-label-dedup.ts
import { strict as assert } from 'node:assert';
import { normalizeEquationLabel, decideLabelDuplicate, type SeenEquationLabel } from '../src/lib/tutor/whiteboard/equation-label-dedup';

const seen = (over: Partial<SeenEquationLabel> = {}): SeenEquationLabel => ({
  originalLabel: 'Final answer', originalLatex: 'x = 5', latexNormalized: 'x=5',
  signature: 'sig-x5', pageKey: 'Solving for x', ...over,
});

// normalization: decorations stripped, case/space folded
assert.equal(normalizeEquationLabel('Step 1: Sum ✓'), 'step 1: sum');
assert.equal(normalizeEquationLabel('  Final Answer (corrected) '), 'final answer');
assert.equal(normalizeEquationLabel('Fresh equation (2)'), 'fresh equation');

// first sighting registers
assert.deepEqual(decideLabelDuplicate({ normalizedLabel: 'final answer', normalizedLatex: 'x=5', seen: undefined, currentPageKey: 'p1', priorOnBoard: false }), { kind: 'register' });

// identical latex re-emit passes through (other dedups own it)
assert.deepEqual(decideLabelDuplicate({ normalizedLabel: 'final answer', normalizedLatex: 'x=5', seen: seen(), currentPageKey: 'Solving for x', priorOnBoard: true }), { kind: 'pass' });

// SAME page, prior still on the board, different latex ⇒ reject with a reason naming both
const r = decideLabelDuplicate({ normalizedLabel: 'final answer', normalizedLatex: 'x=11', seen: seen(), currentPageKey: 'Solving for x', priorOnBoard: true });
assert.equal(r.kind, 'reject');
if (r.kind === 'reject') {
  assert.match(r.reason, /Final answer/);
  assert.match(r.reason, /distinct label/i);
}

// DIFFERENT page ⇒ a fresh artefact: register (the live-check-3 class)
assert.deepEqual(decideLabelDuplicate({ normalizedLabel: 'final answer', normalizedLatex: 'x=11', seen: seen(), currentPageKey: 'Isolating the x term', priorOnBoard: true }), { kind: 'register' });

// prior was killed/retracted (not on the board any more) ⇒ register
assert.deepEqual(decideLabelDuplicate({ normalizedLabel: 'final answer', normalizedLatex: 'x=11', seen: seen(), currentPageKey: 'Solving for x', priorOnBoard: false }), { kind: 'register' });

console.log('equation-label-dedup: all assertions passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/tutor && npx tsx scripts/test-equation-label-dedup.ts`
Expected: FAIL — `Cannot find module '../src/lib/tutor/whiteboard/equation-label-dedup'`

- [ ] **Step 3: Write the module**

```ts
// src/lib/tutor/whiteboard/equation-label-dedup.ts
/**
 * show_equation label-duplicate guard — pure decision.
 *
 * WHY (live 2026-09-06, portal-3a024b75 — the "R1 silent render drop"):
 * the brain reuses step labels across problems ("Collecting x terms",
 * "Final answer", "Fresh equation to solve"). The old guard kept one map per
 * SEGMENT and silently dropped any later equation whose normalized label
 * matched an earlier one with different latex. A segment that hosts several
 * problems (27 min in "hook" that day) therefore lost one equation per
 * repeated label — six times in one session — and the brain, told nothing,
 * narrated as if the board had it.
 *
 * Rule now: a label collision only matters when the prior equation is on
 * the SAME PAGE and is STILL ON THE BOARD. Then it is a real "two different
 * equations under one heading" and the brain is told to relabel (a
 * rejection with a reason, not a silent drop — silent drops are the class
 * that hid this for months). Any other collision is a fresh artefact.
 */
export interface SeenEquationLabel {
  originalLabel: string;
  originalLatex: string;
  latexNormalized: string;
  /** buildShowSignature(...) of the registered command; the catalog is asked whether it is still on the board. */
  signature: string;
  /** Catalog page title the equation was registered on ('' for the untitled first page). */
  pageKey: string;
}

export type LabelDedupDecision =
  | { kind: 'pass' }
  | { kind: 'register' }
  | { kind: 'reject'; reason: string };

export function normalizeEquationLabel(raw: string): string {
  return (raw ?? '')
    .toLowerCase()
    .replace(/[✓✗✔✘☐☑]/g, '')
    .replace(/\s*\(final\)\s*$/i, '')
    .replace(/\s*\(corrected\)\s*$/i, '')
    .replace(/\s*\(updated\)\s*$/i, '')
    .replace(/\s*\(\d+\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function decideLabelDuplicate(args: {
  normalizedLabel: string;
  normalizedLatex: string;
  seen: SeenEquationLabel | undefined;
  currentPageKey: string;
  priorOnBoard: boolean;
}): LabelDedupDecision {
  const { seen } = args;
  if (!args.normalizedLabel) return { kind: 'pass' };
  if (!seen) return { kind: 'register' };
  if (seen.latexNormalized === args.normalizedLatex) return { kind: 'pass' };
  if (seen.pageKey !== args.currentPageKey) return { kind: 'register' };
  if (!args.priorOnBoard) return { kind: 'register' };
  return {
    kind: 'reject',
    reason:
      `An equation labeled "${seen.originalLabel}" is already on this page with different content (${seen.originalLatex.slice(0, 60)}). ` +
      `Re-emit show_equation with a distinct label that names THIS step, or scroll to the existing one if it is what you meant.`,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npx tsx scripts/test-equation-label-dedup.ts`
Expected: `equation-label-dedup: all assertions passed`

- [ ] **Step 5: Wire VTR**

In `VoiceTutorRealtime.tsx`:

(a) Change the ref type (~line 2805) to use the module's type:
```ts
import { normalizeEquationLabel, decideLabelDuplicate, type SeenEquationLabel } from '@/lib/tutor/whiteboard/equation-label-dedup';
// …
const equationLabelsThisSessionRef = useRef<Map<string, SeenEquationLabel>>(new Map());
```

(b) Replace the label block inside the `showEquation` flatMap branch (from `const rawLabel = (cmdAny.label?.trim() || '');` through the closing of `if (rawLabel) { … }`, keeping the `stepMatch` bookkeeping) with:
```ts
        const rawLabel = (cmdAny.label?.trim() || '');
        if (rawLabel) {
          const normalizedLabel = normalizeEquationLabel(rawLabel);
          if (normalizedLabel) {
            const seen = equationLabelsThisSessionRef.current.get(normalizedLabel);
            const signature = buildShowSignature('showEquation', cmd);
            const currentPageKey = catalogRef.current.getCurrentPageTitle() ?? '';
            const priorOnBoard = !!seen && !!catalogRef.current.findBySignature(seen.signature);
            const decision = decideLabelDuplicate({ normalizedLabel, normalizedLatex: normalized, seen, currentPageKey, priorOnBoard });
            if (decision.kind === 'reject') {
              // R1 (2026-09-07): a real same-page collision is a REJECTION the
              // brain can act on, never a silent drop — see the module header.
              console.warn(`[VoiceTutorRealtime] Rejecting label-duplicate equation: "${rawLabel}" clashes with prior "${seen!.originalLabel}" on this page`);
              onDebugEvent?.('tool_call', `Dropped label-duplicate equation: "${rawLabel}" ~= "${seen!.originalLabel}" (same page, prior on board)`);
              onDebugEvent?.('show_equation_label_duplicate', `"${rawLabel}" ~= "${seen!.originalLabel}"`);
              rejected.push({ action: 'show_equation', reason: decision.reason });
              return [];
            }
            if (decision.kind === 'register') {
              equationLabelsThisSessionRef.current.set(normalizedLabel, {
                originalLabel: rawLabel, originalLatex: latex, latexNormalized: normalized, signature, pageKey: currentPageKey,
              });
            }
            const stepMatch = /^step\s+(\d+)\b/i.exec(rawLabel);
            if (stepMatch) {
              const n = Number(stepMatch[1]);
              if (Number.isFinite(n)) stepsEmittedOnCurrentPageRef.current.add(n);
            }
          }
        }
```
`buildShowSignature` is already imported in VTR (used in the catalog loop); if not, add `import { buildShowSignature } from '@/lib/tutor/whiteboard/catalog';`. `catalogRef.current.findBySignature` and `getCurrentPageTitle` both exist (used at ~7443 and ~7415). Confirm with `grep -n "findBySignature\|getCurrentPageTitle" src/lib/tutor/whiteboard/catalog.ts` that `findBySignature` ignores items removed via `removeByIds` (read its body; if it does not, add `if (item.removed) continue` or equivalent — the kill-retraction path calls `catalogRef.current.removeByIds`).

(c) Delete the old `show_equation_label_duplicate_silent` emission (it is replaced above). Keep the segment-advance `equationLabelsThisSessionRef.current.clear()` at ~4276 — update its comment's last sentence to: "Since 2026-09-07 the map is ALSO page-scoped and prior-on-board-gated (equation-label-dedup.ts); this clear remains as the segment boundary."

(d) In `src/app/tutor-portal/embed/page.tsx`, add `'show_equation_label'` to `EMBED_DEBUG_EVENT_PREFIXES` with the comment `// R1 2026-09-07: the label-duplicate drop was invisible in embed sessions for months`.

- [ ] **Step 6: Register the battery and run the related suites**

Add to `apps/tutor/package.json` scripts: `"test:equation-label-dedup": "npx tsx scripts/test-equation-label-dedup.ts"`.

Run: `cd apps/tutor && npm run test:equation-label-dedup && npm run test:embed-debug-coverage && npm run test:equation-guards && npm run test:show-signature && npx tsc --noEmit -p tsconfig.json`
Expected: all pass, tsc 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/tutor/whiteboard/equation-label-dedup.ts scripts/test-equation-label-dedup.ts src/app/tutor/components/VoiceTutorRealtime.tsx src/app/tutor-portal/embed/page.tsx package.json
git commit -m "fix(tutor): R1 — page-scoped, prior-on-board label-duplicate guard; reject with reason instead of silent drop"
```

---

### Task 2: R1 telemetry honesty — flush counts renders, empty batches never enter the buffer, Rule 8 ignores meta tools

**Files:**
- Modify: `src/lib/tutor/voice/rule8-client.ts`
- Modify: `scripts/test-rule8-client.ts` (create if absent — check `grep -rn "rule8-client" scripts/*.ts`; if a battery exists, append to it)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — `flushReadyRenders` (~4334–4372), `dispatchVisualRef.current` (~4501), the Rule-8 v2 block (`shouldClientRequestRepair({ serverToolCount: totalToolNamesSeen.length, …` ~15490)
- Modify: `src/app/tutor-portal/embed/page.tsx` (`EMBED_DEBUG_EVENT_PREFIXES`)

**Interfaces:**
- Produces: `countBoardRenderTools(names: string[]): number`, `NON_RENDER_TOOL_NAMES: ReadonlySet<string>` in `rule8-client.ts`.

- [ ] **Step 1: Write the failing test**

```ts
// scripts/test-rule8-client.ts  (append if the file exists)
import { strict as assert } from 'node:assert';
import { countBoardRenderTools, shouldClientRequestRepair } from '../src/lib/tutor/voice/rule8-client';

assert.equal(countBoardRenderTools(['show_equation']), 1);
assert.equal(countBoardRenderTools(['advance_lesson']), 0);                 // live 17:47:34 false alarm
assert.equal(countBoardRenderTools(['tutor_scroll_whiteboard', 'tutor_scroll_whiteboard']), 0); // resume 18:13:16 false alarm
assert.equal(countBoardRenderTools(['advance_lesson', 'mark_segment_complete', 'show_problem']), 1);
assert.equal(countBoardRenderTools(['some_future_tool']), 1);              // unknown ⇒ counted (fail toward repair)
assert.equal(shouldClientRequestRepair({ serverToolCount: countBoardRenderTools(['advance_lesson']), paintedCount: 0, sentenceCount: 2 }), false);
console.log('rule8-client: all assertions passed');
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd apps/tutor && npx tsx scripts/test-rule8-client.ts`
Expected: FAIL — `countBoardRenderTools is not a function` (or module has no export).

- [ ] **Step 3: Implement**

Append to `src/lib/tutor/voice/rule8-client.ts`:
```ts
/** Tool names that never paint a board item on their own. A turn made only of
 *  these has nothing for Rule 8 to repair — live 2026-09-06 the client
 *  requested repairs after `advance_lesson` and after two `tutor_scroll_whiteboard`
 *  calls (painted=0 is CORRECT for both), which then re-asked the model for ink
 *  it never meant to draw. Unknown names are counted (fail toward repair). */
export const NON_RENDER_TOOL_NAMES: ReadonlySet<string> = new Set([
  'advance_lesson', 'mark_segment_complete', 'record_gap', 'flag_prerequisite_gap',
  'close_session_notes', 'propose_plan_swap', 'confirm_plan_los',
  'expand_topic_notes_theory', 'add_topic_notes_method', 'add_topic_notes_pointer',
  'tutor_scroll_whiteboard', 'go_to_page', 'new_page', 'generate_problem',
]);

export function countBoardRenderTools(names: string[]): number {
  return names.filter((n) => !NON_RENDER_TOOL_NAMES.has(n)).length;
}
```
Verify the meta list against the real tool names: `grep -rhoE "name: '(advance_lesson|mark_segment_complete|record_gap|flag_prerequisite_gap|close_session_notes|propose_plan_swap|confirm_plan_los|expand_topic_notes_theory|add_topic_notes_method|add_topic_notes_pointer|tutor_scroll_whiteboard|go_to_page|new_page|generate_problem)'" src/lib/tutor | sort -u` — every name in the set must appear (drop any that does not exist; add any meta tool you find that is missing, e.g. a `tutor_*` navigation tool).

In VTR:

(a) Rule-8 block — replace both uses of `totalToolNamesSeen.length` inside the `shouldClientRequestRepair({...})` call and the `repairToolCount` const with `countBoardRenderTools(totalToolNamesSeen)`; import `countBoardRenderTools` next to the existing `shouldClientRequestRepair` import.

(b) `dispatchVisualRef.current` — immediately after the `turnRenderPayloadTextRef` capture loop and before `if (!TUTOR_RENDER_SYNC || …)`, add:
```ts
    // R1 telemetry (2026-09-07): a batch that lost every command during
    // processing must not enter the sync buffer — it would flush as
    // "1 render(s) painted" with no id and Rule 8 would ask for a repair of
    // ink nobody requested. Meta-only batches (advance_lesson etc.) are the
    // routine case; a rejected sole render is the interesting one and is
    // already reported by its own `tool_call`/`render_dropped` event.
    if (processed.length === 0) {
      onDebugEvent?.('render_sync_empty_batch', 'no command survived processing');
      return;
    }
```

(c) `flushReadyRenders` — replace the `render_sync_flush` event so the count is BOARD RENDERS, keeping the `N render(s) painted` prefix (harness watchers and `scripts/test-render-sync.ts` grep it):
```ts
    if (onDebugEvent) {
      const flushedIds = ready.flatMap((e) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        e.processed.map((c) => (c as any).id).filter((id: unknown): id is string => typeof id === 'string'),
      );
      const boardRenders = ready.reduce((n, e) => n + e.processed.filter(isBoardRenderCommand).length, 0);
      onDebugEvent('render_sync_flush', `${boardRenders} render(s) painted${ready.length !== boardRenders ? ` batches=${ready.length}` : ''}${flushedIds.length ? ` (${flushedIds.join(',')})` : ''}`);
    }
```

(d) Add `'render_sync_empty'` to `EMBED_DEBUG_EVENT_PREFIXES` (the existing `'render_sync'` prefix already covers it — verify with the coverage test; if covered, no edit).

- [ ] **Step 4: Run tests**

Register `"test:rule8-client": "npx tsx scripts/test-rule8-client.ts"` if new. Run: `cd apps/tutor && npm run test:rule8-client && npm run test:render-sync && npm run test:embed-debug-coverage && npx tsc --noEmit -p tsconfig.json`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/voice/rule8-client.ts scripts/test-rule8-client.ts src/app/tutor/components/VoiceTutorRealtime.tsx src/app/tutor-portal/embed/page.tsx package.json
git commit -m "fix(tutor): R1 telemetry — flush counts board renders, empty batches skip the buffer, Rule 8 ignores meta tools"
```

---

### Task 3: F4 — judge denial-advisory gate: key must belong to the board's problem, utterance must state a value

**Why:** 17:42:56 and 17:46:06 the gate suppressed two CORRECT judge flags using `pendingGeneratedAnswerRef` (x = 7, the "fresh one" whose render was dropped) and treating "take 4x to left" as an answer.

**Files:**
- Create: `src/lib/tutor/voice/judge-gate-key.ts`
- Create: `scripts/test-judge-gate-key.ts`
- Modify: `src/lib/tutor/voice/false-praise-opener.ts` (`studentDisagreesWithVerified`)
- Modify: `scripts/test-false-praise-opener.ts` (append)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (the `judgeVerifiedKey` const inside the advisory block, ~14507)

**Interfaces:**
- Produces: `verifiedKeyForJudgeGate({ pending, current, boardText }): string | undefined`; `utteranceStatesValue(utterance, choices?): boolean` (exported from false-praise-opener).

- [ ] **Step 1: Failing tests**

```ts
// scripts/test-judge-gate-key.ts
import { strict as assert } from 'node:assert';
import { verifiedKeyForJudgeGate } from '../src/lib/tutor/voice/judge-gate-key';

// tracked problem with a pinned key wins
assert.equal(verifiedKeyForJudgeGate({ pending: { statement: 'Solve 2(x+3)=20', expectedAnswer: 'x=7' }, current: { statement: '6x - 12 = 4x + 10', expectedAnswer: 'x=11' }, boardText: '6x - 12 = 4x + 10' }), 'x=11');
// live 17:42: pending key for a problem that never painted ⇒ NO key
assert.equal(verifiedKeyForJudgeGate({ pending: { statement: 'Solve 2(x+3)=20', expectedAnswer: 'x=7' }, current: { statement: '6x - 12 = 4x + 10' }, boardText: 'Subtracting 2x from both sides: 6x - 2x - 12 = 4x - 2x + 10' }), undefined);
// pending problem IS on the board (rendered as an equation card, not show_problem) ⇒ usable
assert.equal(verifiedKeyForJudgeGate({ pending: { statement: '2(x + 3) = 20', expectedAnswer: 'x=7' }, current: null, boardText: 'Fresh equation: 2(x+3) = 20' }), 'x=7');
assert.equal(verifiedKeyForJudgeGate({ pending: null, current: null, boardText: '' }), undefined);
console.log('judge-gate-key: all assertions passed');
```

Append to `scripts/test-false-praise-opener.ts`:
```ts
import { utteranceStatesValue, studentDisagreesWithVerified } from '../src/lib/tutor/voice/false-praise-opener';
assert.equal(utteranceStatesValue('take 4x to left'), false);              // a move, not a value
assert.equal(utteranceStatesValue('subtract 2x from both sides'), false);
assert.equal(utteranceStatesValue("it'll be 4x=2x+22"), true);
assert.equal(utteranceStatesValue('x is 11'), true);
assert.equal(utteranceStatesValue('eleven'), true);                        // spoken number
assert.equal(utteranceStatesValue('c', [{ letter: 'C', text: '11' }]), true); // MCQ letter
assert.equal(utteranceStatesValue('I think we move the smaller one'), false);
assert.equal(studentDisagreesWithVerified('take 4x to left', 'x=7'), false);
```

- [ ] **Step 2: Run to verify failure**

Run: `cd apps/tutor && npx tsx scripts/test-judge-gate-key.ts; npx tsx scripts/test-false-praise-opener.ts`
Expected: both FAIL (module missing / export missing).

- [ ] **Step 3: Implement**

```ts
// src/lib/tutor/voice/judge-gate-key.ts
/**
 * Which verified answer key may the judge denial-advisory gate trust?
 *
 * Live 2026-09-06 (portal-3a024b75, 17:42:56 + 17:46:06): the gate read
 * `pendingGeneratedAnswerRef` (x = 7, staged for a "fresh one" whose render
 * was silently dropped) as the key for the problem actually on the board
 * (6x − 12 = 4x + 10, answer 11) and suppressed two correct judge flags.
 * A staged key is only evidence about a problem the student can SEE.
 */
const norm = (s: string) => (s ?? '').replace(/\\[a-z]+/g, ' ').replace(/[${}]/g, '').replace(/\s+/g, '').toLowerCase();

export function verifiedKeyForJudgeGate(args: {
  pending?: { statement: string; expectedAnswer?: string } | null;
  current?: { statement: string; expectedAnswer?: string } | null;
  boardText: string;
}): string | undefined {
  if (args.current?.expectedAnswer) return args.current.expectedAnswer;
  const p = args.pending;
  if (!p?.expectedAnswer) return undefined;
  const stmt = norm(p.statement);
  if (!stmt) return undefined;
  // The statement must be visible on the board (any card), whitespace/markup-insensitive.
  return norm(args.boardText).includes(stmt) ? p.expectedAnswer : undefined;
}
```

In `false-praise-opener.ts`, add (next to `isAnswerShaped`) and use it as the first check inside `studentDisagreesWithVerified`:
```ts
const MOVE_IMPERATIVE_RE = /^\s*(?:(?:i(?:'d|'ll|\s+would|\s+will|\s+think\s+we|\s+guess\s+we)?\s+)?(?:take|move|bring|subtract|add|divide|multiply|distribute|combine|collect|isolate|flip|swap|cancel|get\s+rid\s+of|put|shift)\b)/i;

/** Does the utterance STATE a value (a number, an expression, an equation,
 *  or an MCQ letter) rather than describe a move? The judge-advisory gate
 *  must never treat "take 4x to left" as an answer to compare with a key
 *  (live 2026-09-06). */
export function utteranceStatesValue(utterance: string, choices?: Array<{ letter: string; text: string }>): boolean {
  const u = (utterance ?? '').trim();
  if (!u) return false;
  if (MOVE_IMPERATIVE_RE.test(u) && !/=/.test(u)) return false;
  if (/=/.test(u)) return true;
  if (/\d/.test(spokenNumbersToDigits(u))) return true;
  if (choices?.length && /^[a-z]$/i.test(u.replace(/[.!?\s]/g, ''))) return true;
  return false;
}
```
(`spokenNumbersToDigits` lives in `@/lib/tutor/voice/spoken-numbers`; import it if the file does not already.) Then at the top of `studentDisagreesWithVerified`, after the `isAnswerShaped` line: `if (!utteranceStatesValue(utterance, choices)) return false;`.

In VTR replace
```ts
const judgeVerifiedKey = pendingGeneratedAnswerRef.current?.expectedAnswer ?? currentProblemRef.current?.expectedAnswer;
```
with
```ts
const judgeVerifiedKey = verifiedKeyForJudgeGate({
  pending: pendingGeneratedAnswerRef.current,
  current: currentProblemRef.current,
  boardText: boardSummary,
});
```
(`boardSummary` is the string computed for the judge call a few lines above; import `verifiedKeyForJudgeGate`.)

- [ ] **Step 4: Run**

Register `"test:judge-gate-key": "npx tsx scripts/test-judge-gate-key.ts"`. Run: `cd apps/tutor && npm run test:judge-gate-key && npm run test:false-praise-opener && npx tsc --noEmit -p tsconfig.json`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/voice/judge-gate-key.ts scripts/test-judge-gate-key.ts src/lib/tutor/voice/false-praise-opener.ts scripts/test-false-praise-opener.ts src/app/tutor/components/VoiceTutorRealtime.tsx package.json
git commit -m "fix(tutor): F4 — judge-advisory gate uses only a key whose problem is on the board and only for value-stating utterances"
```

---

### Task 4: Posed-computation guard — DISTRIBUTE shape

**Why:** 18:17:59 "what happens when we distribute that negative 3 across both terms inside?" on `10 − 2(x − 3)`; the guard covers only `A × B` / `A ÷ B`.

**Files:**
- Modify: `src/lib/tutor/voice/posed-computation.ts`
- Modify: `scripts/test-posed-computation.ts` (append)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (the reason string in the `posed_computation_ungrounded` block, ~11778–11795)

- [ ] **Step 1: Failing tests** (append to `scripts/test-posed-computation.ts`)

```ts
// DISTRIBUTE shape (live 2026-09-06 addendum A1)
const P = '10 - 2(x - 3) = 4';
const d1 = findUngroundedComputation('What happens when we distribute that negative 3 across both terms inside?', [P]);
assert.ok(d1 && d1.op === 'distribute' && d1.a === '-3' && d1.missing.join() === '-3', JSON.stringify(d1));
assert.equal(findUngroundedComputation('What happens when we distribute that negative 2 across both terms inside?', [P]), null);
assert.equal(findUngroundedComputation('What do we get distributing the 3?', ['3(2x - 4) = 4x + 10']), null);
assert.equal(findUngroundedComputation('What do we get distributing the -3?', ['-3(x + 1) = 9']), null);
assert.ok(findUngroundedComputation('What do we get distributing the 5?', ['3(2x - 4) = 4x + 10']));
// not a question ⇒ never fires
assert.equal(findUngroundedComputation('Distribute the 7 first.', [P]), null);
// coefficient not glued to a parenthesis ("2 into") does not ground
assert.ok(findUngroundedComputation('What happens when we distribute the 4?', ['4 + 2(x - 3) = 10']));
```

- [ ] **Step 2: Run to verify failure**

Run: `cd apps/tutor && npm run test:posed-computation` — Expected: FAIL on the first new assertion.

- [ ] **Step 3: Implement**

Add to `posed-computation.ts`:
```ts
const DISTRIBUTE_RE = /\bdistribut(?:e|es|ed|ing)\s+(?:the\s+|that\s+|this\s+|a\s+)?(negative\s+|minus\s+|-\s*|−\s*)?(\d+(?:\.\d+)?)\b/i;

/** Coefficients that sit directly in front of a parenthesis in `text`, sign-aware. */
function parenthesisCoefficients(text: string): Array<{ value: string; sign: '+' | '-' }> {
  const s = (text ?? '').replace(/\\left/g, '').replace(/[−–]/g, '-').replace(/\\cdot|\\times|×|·/g, '*');
  const out: Array<{ value: string; sign: '+' | '-' }> = [];
  const re = /(-?)\s*(\d+(?:\.\d+)?)\s*\*?\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const before = s.slice(0, m.index + m[1].length).replace(/\s+$/, '');
    out.push({ value: m[2], sign: m[1] === '-' || /-$/.test(before) ? '-' : '+' });
  }
  return out;
}

function findUngroundedDistribution(s: string, grounding: string): UngroundedComputation | null {
  const m = DISTRIBUTE_RE.exec(s);
  if (!m) return null;
  const sign: '+' | '-' = m[1] ? '-' : '+';
  const value = m[2];
  const coeffs = parenthesisCoefficients(grounding);
  if (coeffs.some((c) => c.value === value && c.sign === sign)) return null;
  const a = (sign === '-' ? '-' : '') + value;
  return { a, b: '', op: 'distribute', missing: [a] };
}
```
and in `findUngroundedComputation`, after the `if (!grounding.trim()) return null;` line and before `const toks = …`, insert:
```ts
  const posed = POSED_RE.exec(s.replace(/\\times|×|·/g, '*'));
  if (!posed) return findUngroundedDistribution(s, grounding);
```
(then continue using `posed` where the function currently uses `m`; the early `if (!m) return null;` becomes the line above — restructure so the distribute check runs only when the × / ÷ shape is absent).

In VTR's reason builder, branch on `ungrounded.op`:
```ts
const reason = ungrounded.op === 'distribute'
  ? `You asked the student to distribute ${ungrounded.a}, but no coefficient ${ungrounded.a} sits in front of a parenthesis in the problem on the board (${currentProblemRef.current.statement.slice(0, 120)}). ` +
    `Re-emit: name the coefficient that is actually there, with its sign.`
  : `You posed ${ungrounded.a} ${ungrounded.op} ${ungrounded.b}, but ${ungrounded.missing.join(' and ')} ${ungrounded.missing.length === 1 ? 'does' : 'do'} not appear in the problem on the board (${currentProblemRef.current.statement.slice(0, 120)}). ` +
    `Re-emit: pose the sub-step using ONLY the numbers actually in that problem.`;
```
and the debug line: `` `${ungrounded.op === 'distribute' ? `distribute ${ungrounded.a}` : `${ungrounded.a} ${ungrounded.op} ${ungrounded.b}`} missing=…` ``.

- [ ] **Step 4: Run** — `cd apps/tutor && npm run test:posed-computation && npx tsc --noEmit -p tsconfig.json` → pass.

- [ ] **Step 5: Commit** — `git commit -am "fix(tutor): posed-computation guard covers 'distribute the N' (coefficient must sit before a parenthesis, sign-aware)"` (add the two files explicitly).

---

### Task 5: Denied-answer reversal — an explanatory mention is not an assertion

**Why:** "Right — no solution… infinite solutions only when the two sides were identical from the start" was killed as a reversal of the denied "infinite solutions"; the forced retry then apologised about an answer the student never gave.

**Files:**
- Modify: `src/lib/tutor/voice/denied-answer-reversal.ts`
- Modify: `scripts/test-denied-answer-reversal.ts` (append)

- [ ] **Step 1: Failing tests** (append; mirror the file's existing call style — it builds `denied: [{ phrase, turn }]` and calls `checkDeniedAnswerReversal`)

```ts
{
  const denied = [{ phrase: 'infinite solutions', turn: 3 }];
  const mention = checkDeniedAnswerReversal({ sentence: 'Right — no solution here. Infinite solutions only when the two sides were identical from the start, like our phone-bill trap.', denied, currentTurn: 5 });
  assert.equal(mention.verdict, 'ok', 'conditional mention after the phrase is not a reversal');
  const contrast = checkDeniedAnswerReversal({ sentence: "Unlike infinite solutions, this one leaves a false statement.", denied, currentTurn: 5 });
  assert.equal(contrast.verdict, 'ok', 'contrast before the phrase is not a reversal');
  const real = checkDeniedAnswerReversal({ sentence: "Exactly — it's infinite solutions after all.", denied, currentTurn: 5 });
  assert.equal(real.verdict, 'reversal');
  const hypothetical = checkDeniedAnswerReversal({ sentence: 'If both sides matched, the answer is infinite solutions.', denied, currentTurn: 5 });
  assert.equal(hypothetical.verdict, 'ok', 'hypothetical clause is not a reversal');
}
```

- [ ] **Step 2: Run** — `cd apps/tutor && npm run test:denied-answer-reversal` → FAIL on the first new assertion.

- [ ] **Step 3: Implement**

Add to the module (exported so Task 6 can reuse it):
```ts
/** Contrast / conditional markers that turn a mention of X into commentary
 *  ABOUT X rather than an assertion OF X. Checked in the clause before the
 *  phrase and in the few words right after it. */
const MENTION_BEFORE_RE = /\b(?:only\s+when|only\s+if|when|if|unless|whereas|while|versus|vs\.?|compared\s+(?:to|with)|as\s+opposed\s+to|rather\s+than|instead\s+of|unlike|would|could|might|not|never)\b/;
const MENTION_AFTER_RE = /^\s*(?:only\s+(?:when|if)|when|if|unless|would|could|might|versus|vs\.?|whereas)\b/;

/** `sentence` and `phrase` are already normalized the same way. */
export function isExplanatoryMention(sentence: string, phrase: string): boolean {
  const m = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).exec(sentence);
  if (!m) return false;
  const before = sentence.slice(0, m.index);
  const clauseStart = Math.max(before.lastIndexOf('. '), before.lastIndexOf('; '), before.lastIndexOf(': '), before.lastIndexOf(' - '), before.lastIndexOf(' — '));
  const clause = before.slice(clauseStart + 1).slice(-80);
  if (MENTION_BEFORE_RE.test(clause)) return true;
  const after = sentence.slice(m.index + m[0].length, m.index + m[0].length + 40);
  return MENTION_AFTER_RE.test(after);
}
```
In `checkDeniedAnswerReversal`, after the existing negation `continue` and before the opener-shape test, add `if (isExplanatoryMention(sentence, phrase)) continue;`. Note `normalize()` keeps `-` and `.`; the em-dash in the live sentence becomes a space, so `' - '` covers the ASCII form and the `. ` covers the sentence break.

- [ ] **Step 4: Run** — `npm run test:denied-answer-reversal` → pass (all existing assertions too).

- [ ] **Step 5: Commit** — `git add src/lib/tutor/voice/denied-answer-reversal.ts scripts/test-denied-answer-reversal.ts && git commit -m "fix(tutor): reversal guard skips explanatory/conditional mentions of the denied phrase"`.

---

### Task 6: Authored-ending contradiction guard (kill + retry against the seed's answer)

**Why:** 17:22:51 "105 = 105 → no solution" against the authored "Infinitely many solutions (identity)". Deterministic, subject-free: compare the tutor's stated solution-count class with the authored answer's class.

**Files:**
- Create: `src/lib/tutor/voice/authored-ending.ts`
- Create: `scripts/test-authored-ending.ts`
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (new block right after the posed-computation block, same guards; new flag `TUTOR_AUTHORED_ENDING_GUARD`)
- Modify: `src/app/tutor-portal/embed/page.tsx` (prefix `'authored_ending'`)

**Interfaces:**
- Consumes: `isExplanatoryMention` (Task 5); `getSegmentTruth(seg)` — find its import path with `grep -n "getSegmentTruth" src/lib/tutor/voice/claude-brain.ts` (it returns `{ kind, problemText, expectedAnswer? }`).
- Produces: `classifySolutionCount(text): SolutionClass | null`; `findAuthoredEndingContradiction({ sentence, authoredAnswer }): { stated, authored } | null`; `problemMatchesAuthored(statement, problemText): boolean`.

- [ ] **Step 1: Failing tests**

```ts
// scripts/test-authored-ending.ts
import { strict as assert } from 'node:assert';
import { classifySolutionCount, findAuthoredEndingContradiction, problemMatchesAuthored } from '../src/lib/tutor/voice/authored-ending';

assert.equal(classifySolutionCount('Infinitely many solutions (identity)'), 'infinite');
assert.equal(classifySolutionCount('No solution'), 'none');
assert.equal(classifySolutionCount('x = 11'), null);
assert.equal(classifySolutionCount('one solution, x = 4'), 'one');
assert.equal(classifySolutionCount('no solution or infinitely many'), null); // ambiguous authored text ⇒ guard stays off

// live 17:22:51 — affirmed "no solution" on an identity
const c = findAuthoredEndingContradiction({ sentence: "Right — 105 equals 105 with no g left, so there's no solution.", authoredAnswer: 'Infinitely many solutions (identity)' });
assert.deepEqual(c, { stated: 'none', authored: 'infinite' });
// agreeing verdict ⇒ null
assert.equal(findAuthoredEndingContradiction({ sentence: 'So this one has infinitely many solutions.', authoredAnswer: 'Infinitely many solutions (identity)' }), null);
// explanatory contrast ⇒ null (Task 5 helper)
assert.equal(findAuthoredEndingContradiction({ sentence: 'Unlike a no-solution case, a true statement means every value works.', authoredAnswer: 'Infinitely many solutions' }), null);
// a question is never a verdict
assert.equal(findAuthoredEndingContradiction({ sentence: 'Does that mean no solution, or infinitely many?', authoredAnswer: 'Infinitely many solutions' }), null);
// no authored answer ⇒ null
assert.equal(findAuthoredEndingContradiction({ sentence: "so there's no solution.", authoredAnswer: undefined }), null);

assert.equal(problemMatchesAuthored('Solve: 3(35 + 4g) = 105 + 12g', 'Solve 3(35+4g) = 105+12g for g'), true);
assert.equal(problemMatchesAuthored('6x - 12 = 4x + 10', 'Solve 3(35+4g) = 105+12g for g'), false);
console.log('authored-ending: all assertions passed');
```

- [ ] **Step 2: Run** — `npx tsx scripts/test-authored-ending.ts` → FAIL (module missing).

- [ ] **Step 3: Implement**

```ts
// src/lib/tutor/voice/authored-ending.ts
/**
 * Authored-ending contradiction guard (live 2026-09-06, portal-3a024b75).
 * The tutor affirmed "no solution" for an identity whose authored answer is
 * "infinitely many". The judge saw it but the claim carried no math ⇒ not
 * noteworthy ⇒ no note; the segment-truth block does not catch a
 * contradiction of the authored ENDING. Solution-count classification is a
 * closed three-way vocabulary, so it can be checked deterministically with
 * zero subject knowledge: compare the class the tutor asserted with the
 * class the seed authored. Anything ambiguous on either side ⇒ null.
 */
import { isExplanatoryMention } from './denied-answer-reversal';

export type SolutionClass = 'none' | 'one' | 'infinite';

const NONE_RE = /\bno\s+solutions?\b|\bempty\s+set\b|\bnever\s+true\b|\bfalse\s+statement\b|\bcontradiction\b/i;
const INFINITE_RE = /\binfinite(?:ly\s+many)?\s+solutions?\b|\binfinitely\s+many\b|\bidentity\b|\ball\s+real\s+numbers\b|\bevery\s+(?:value|number|real)\b|\balways\s+true\b/i;
const ONE_RE = /\b(?:exactly\s+|just\s+|only\s+)?one\s+solution\b|\bunique\s+solution\b|\bsingle\s+solution\b/i;

export function classifySolutionCount(text: string): SolutionClass | null {
  const t = (text ?? '');
  const hits: SolutionClass[] = [];
  if (NONE_RE.test(t)) hits.push('none');
  if (INFINITE_RE.test(t)) hits.push('infinite');
  if (ONE_RE.test(t)) hits.push('one');
  return hits.length === 1 ? hits[0] : null;
}

/** The class phrase must be PRESENTED as this problem's verdict. */
const VERDICT_CUE_RE = /\b(?:so|therefore|thus|that\s+means|which\s+means|meaning|there(?:'s|\s+is|\s+are)|it\s+has|we\s+have|this\s+has|the\s+answer\s+is|it'?s|that'?s|gives|leaves\s+us\s+with|right|exactly|correct|yes|nailed\s+it)\b/i;

const norm = (s: string) => (s ?? '').toLowerCase().replace(/[*_`"'’‘“”]/g, '').replace(/[—–]/g, ' - ').replace(/\s+/g, ' ').trim();

function classPhrase(sentence: string, cls: SolutionClass): string | null {
  const re = cls === 'none' ? NONE_RE : cls === 'infinite' ? INFINITE_RE : ONE_RE;
  const m = re.exec(sentence);
  return m ? m[0] : null;
}

export function findAuthoredEndingContradiction(args: { sentence: string; authoredAnswer: string | undefined }): { stated: SolutionClass; authored: SolutionClass } | null {
  const authored = args.authoredAnswer ? classifySolutionCount(args.authoredAnswer) : null;
  if (!authored) return null;
  const s = norm(args.sentence);
  if (!s || /\?\s*$/.test(s)) return null;
  const stated = classifySolutionCount(s);
  if (!stated || stated === authored) return null;
  const phrase = classPhrase(s, stated);
  if (!phrase) return null;
  if (isExplanatoryMention(s, norm(phrase))) return null;
  const idx = s.indexOf(norm(phrase));
  const clause = s.slice(Math.max(0, idx - 80), idx);
  if (!VERDICT_CUE_RE.test(clause)) return null;
  return { stated, authored };
}

const stripMath = (s: string) => (s ?? '').toLowerCase().replace(/\\[a-z]+/g, ' ').replace(/[${}]/g, '').replace(/[^0-9a-z=+\-*/()^.]/g, '');

/** Is the tracked board problem the authored one (so the authored answer applies)? */
export function problemMatchesAuthored(statement: string | undefined, problemText: string | undefined): boolean {
  const a = stripMath(statement ?? ''); const b = stripMath(problemText ?? '');
  if (a.length < 6 || b.length < 6) return false;
  return a.includes(b) || b.includes(a) || (a.length >= 12 && b.includes(a.slice(0, 12))) || (b.length >= 12 && a.includes(b.slice(0, 12)));
}
```

VTR wiring — add a flag near the other `NEXT_PUBLIC_TUTOR_*` consts: `const TUTOR_AUTHORED_ENDING_GUARD = process.env.NEXT_PUBLIC_TUTOR_AUTHORED_ENDING_GUARD !== 'off';` and, directly after the posed-computation `if (…) { … continue; }` block (same `!attemptKilled && judgeRetriesUsed < MAX_JUDGE_RETRIES && attempt === 0` guards):
```ts
                  if (TUTOR_AUTHORED_ENDING_GUARD && !attemptKilled && judgeRetriesUsed < MAX_JUDGE_RETRIES && attempt === 0) {
                    const seg = lessonPlanRef.current?.segments.find((sg) => sg.id === currentSegmentIdRef.current);
                    const truth = seg ? getSegmentTruth(seg) : null;
                    const authoredAnswer = truth?.expectedAnswer && problemMatchesAuthored(currentProblemRef.current?.statement, truth.problemText)
                      ? truth.expectedAnswer : undefined;
                    const contra = findAuthoredEndingContradiction({ sentence: updatedSentence, authoredAnswer });
                    if (contra) {
                      const reason =
                        `The authored answer for this problem is "${authoredAnswer}" (${contra.authored} solution(s)); your sentence classified it as "${contra.stated}". ` +
                        `Re-derive from the authored answer and re-speak the verdict — and if the student's classification was actually right, say so plainly.`;
                      rejectionsThisAttempt.push({ action: 'authored_ending_contradiction', reason });
                      judgeRetriesUsed++;
                      await performKill();
                      onDebugEvent?.('authored_ending_kill', `stated=${contra.stated} authored=${contra.authored} · ${updatedSentence.slice(0, 80)}`);
                      continue;
                    }
                  }
```
Import `getSegmentTruth` from the path claude-brain.ts imports it from, and the two functions from `@/lib/tutor/voice/authored-ending`. Add `'authored_ending'` to `EMBED_DEBUG_EVENT_PREFIXES`.

- [ ] **Step 4: Run** — register `"test:authored-ending": "npx tsx scripts/test-authored-ending.ts"`; `npm run test:authored-ending && npm run test:embed-debug-coverage && npx tsc --noEmit -p tsconfig.json` → pass.

- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): authored-ending contradiction guard — kill+retry when the tutor's solution-count verdict contradicts the seed answer"`.

---

### Task 7: The ledger must not count a judge-flagged denial as the student's wrong answer

**Why:** 17:33:55 `gap_inferred` and 17:46:06 `gap_recurred` came from the tutor's own mis-gradings; the recap then blamed the student. The judge verdict (mid-stream, awaited) lands BEFORE the post-stream pacing block increments the incorrect streak and feeds the ledger, so the fix is a per-turn "withhold" flag rather than a retraction.

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — declare `judgeFlaggedDenialThisTurnRef`; set it in the advisory block where `denialFlagged` is computed (~14507); read it in the post-stream `else if (decision.credit === 'incorrect')` block (~15263); reset it where per-turn refs reset at turn start (search `objectiveCorrectThisTurnRef.current = null` near the top of the turn handler — reset alongside).
- Modify: `src/app/tutor-portal/embed/page.tsx` (prefix `'pacing_credit'`)
- Test: `scripts/test-pacing-verdict.ts` exists — append a pure test ONLY if a pure helper is introduced; otherwise the verification is the typed harness in Task 17 (`credit_withheld_judge_flag` must appear when the judge flags a denial).

- [ ] **Step 1: Declare + set**

Near the other per-turn refs (e.g. next to `recapOfferSentThisTurnRef`):
```ts
  /** Set when the judge flagged THIS turn's denial as ungrounded (and the
   *  deterministic gate did not overrule it). The post-stream pacing block
   *  then withholds the incorrect-streak increment and the ledger event:
   *  live 2026-09-06 the tutor's mis-gradings became the student's
   *  "incorrect streak", a gap, a recurrence and a recap blaming them. */
  const judgeFlaggedDenialThisTurnRef = useRef(false);
```
In the advisory block, right after `const denialVerifiedRight = …;`:
```ts
                  if (denialFlagged && !denialVerifiedRight) judgeFlaggedDenialThisTurnRef.current = true;
```
Also set it when a KILL issue's claim matches `DENIAL_RE` (inside `if (killIssues.length > 0) {`): `if (killIssues.some((i) => DENIAL_RE.test(i.claim))) judgeFlaggedDenialThisTurnRef.current = true;`.

- [ ] **Step 2: Read it in the pacing block**

Wrap the body of `} else if (decision.credit === 'incorrect') {`:
```ts
          } else if (decision.credit === 'incorrect' && judgeFlaggedDenialThisTurnRef.current) {
            onDebugEvent?.('pacing_credit_withheld', 'judge flagged this denial — not counted against the student');
          } else if (decision.credit === 'incorrect') {
            … (existing body unchanged)
```
Reset `judgeFlaggedDenialThisTurnRef.current = false;` at the start of each brain turn, next to the existing per-turn reset of `objectiveCorrectThisTurnRef` (grep `objectiveCorrectThisTurnRef.current = null` and pick the turn-START occurrence, not the exits).

- [ ] **Step 3: Coverage + typecheck** — add `'pacing_credit'` prefix; `npm run test:embed-debug-coverage && npx tsc --noEmit -p tsconfig.json` → pass.

- [ ] **Step 4: Commit** — `git commit -m "fix(tutor): withhold incorrect-streak + ledger event when the judge flagged the tutor's denial"`.

---

### Task 8: The judge grounds against the authored solution, not only the tutor's own board

**Why:** from 17:44:37 the board carried the tutor's wrong derivation and the judge grounded every later claim against it ("x = 5.5" passed).

**Files:**
- Modify: `src/lib/tutor/judge-prompt.ts` (body type + `<authored_solution>` block + system-prompt paragraph)
- Modify: `src/app/api/tutor/judge/route.ts` (accept optional `authoredSolution: string` ≤ 1500 chars)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (judge fetch body ~14311)
- Create: `scripts/test-judge-authored-solution.ts`

- [ ] **Step 1: Failing test**

```ts
// scripts/test-judge-authored-solution.ts
import { strict as assert } from 'node:assert';
import { buildJudgeUserMessage, JUDGE_SYSTEM_PROMPT } from '../src/lib/tutor/judge-prompt';
// (if the user-message builder has a different export name, read judge-prompt.ts:30-50 and use that name)
const withTruth = buildJudgeUserMessage({ boardSummary: 'Eq: 6x - 2x - 12 = 4x - 2x + 10', spokenText: 'So x equals 5.5.', authoredSolution: 'Problem: 6x - 12 = 4x + 10 · steps: subtract 4x; add 12; divide by 2 · answer: x = 11' });
assert.match(withTruth, /<authored_solution>[\s\S]*x = 11[\s\S]*<\/authored_solution>/);
const without = buildJudgeUserMessage({ boardSummary: 'Eq: 2x = 4', spokenText: 'So x is 2.' });
assert.doesNotMatch(without, /<authored_solution>/);
assert.match(JUDGE_SYSTEM_PROMPT, /authored_solution/);
assert.match(JUDGE_SYSTEM_PROMPT, /outranks the whiteboard/i);
console.log('judge-authored-solution: all assertions passed');
```

- [ ] **Step 2: Run** → FAIL (`authoredSolution` unknown / no block).

- [ ] **Step 3: Implement**

`judge-prompt.ts`: add `authoredSolution?: string` to the body interface; in the user-message builder, after the `<whiteboard_state>` block append
```ts
    (body.authoredSolution ? `<authored_solution>\n${body.authoredSolution}\n</authored_solution>\n\n` : '') +
```
and add to `JUDGE_SYSTEM_PROMPT` (after the BOARD CLAIMS section):
```
(1b) AUTHORED SOLUTION — when an <authored_solution> block is present it is the lesson author's ground truth for the problem the student is working, and it outranks the whiteboard. If the whiteboard contradicts the authored solution, the whiteboard is the tutor's own error: do NOT treat board content as true. A claim that matches the board but contradicts the authored solution's answer or a listed step is NOT grounded — flag it as "advisory" with why beginning "contradicts authored solution:". Never derive the authored answer yourself; use only what the block states.
```
`route.ts`: after the `boardSummary` validation add `if (body.authoredSolution !== undefined && (typeof body.authoredSolution !== 'string' || body.authoredSolution.length > 1500)) return badRequest('authoredSolution must be a string ≤ 1500 chars');` and pass it through to the prompt builder.

VTR: before the judge `fetch`, compute
```ts
            const judgeSeg = lessonPlanRef.current?.segments.find((sg) => sg.id === currentSegmentIdRef.current);
            const judgeTruth = judgeSeg ? getSegmentTruth(judgeSeg) : null;
            const authoredSolution = judgeTruth && problemMatchesAuthored(currentProblemRef.current?.statement, judgeTruth.problemText)
              ? [
                  `Problem: ${judgeTruth.problemText}`,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ...(Array.isArray((judgeSeg as any)?.steps) ? [`Steps: ${((judgeSeg as any).steps as string[]).join(' | ')}`] : []),
                  ...(judgeTruth.expectedAnswer ? [`Answer: ${judgeTruth.expectedAnswer}`] : []),
                ].join('\n').slice(0, 1500)
              : undefined;
```
and add `...(authoredSolution ? { authoredSolution } : {})` to the fetch body. Emit `onDebugEvent?.('judge_authored_solution', authoredSolution.slice(0, 80))` when present (prefix `'judge'` already persists it).

- [ ] **Step 4: Run** — register `"test:judge-authored-solution"`; `npm run test:judge-authored-solution && npm run test:judge-prompt && npx tsc --noEmit -p tsconfig.json` → pass.

- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): judge receives the authored solution and treats it as outranking the board"`.

---

### Task 9: Validator retry after a mid-turn self-correction restarts from the student's move

**Why:** 17:30:45 the retry opened "Divide both sides by 2." mid-routine after the student's "take 4x to left".

**Files:**
- Create: `src/lib/tutor/voice/self-correction-retry.ts`
- Create: `scripts/test-self-correction-retry.ts`
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (the `reason` inside the `mid_turn_self_correction` block, ~11460)

- [ ] **Step 1: Failing test**

```ts
// scripts/test-self-correction-retry.ts
import { strict as assert } from 'node:assert';
import { buildSelfCorrectionRetryReason } from '../src/lib/tutor/voice/self-correction-retry';
const r = buildSelfCorrectionRetryReason({ sentence: 'Wait — let me match my board to your move exactly.', studentUtterance: 'take 4x to left', problemStatement: '6x - 12 = 4x + 10', lastBoardEquation: '6x - 2x - 12 = 4x - 2x + 10' });
assert.match(r, /take 4x to left/);
assert.match(r, /6x - 12 = 4x \+ 10/);
assert.match(r, /start from the student's move/i);
assert.doesNotMatch(r, /undefined/);
const bare = buildSelfCorrectionRetryReason({ sentence: 'Actually, no.', studentUtterance: '', problemStatement: undefined, lastBoardEquation: undefined });
assert.match(bare, /Re-emit your response cleanly/);
console.log('self-correction-retry: all assertions passed');
```

- [ ] **Step 2: Run** → FAIL (module missing).

- [ ] **Step 3: Implement**

```ts
// src/lib/tutor/voice/self-correction-retry.ts
/** Retry reason after a mid-turn self-correction. Live 2026-09-06 the
 *  retry resumed mid-routine ("Divide both sides by 2.") instead of
 *  re-applying the student's move — the retry prompt carried no anchor. */
export function buildSelfCorrectionRetryReason(args: {
  sentence: string;
  studentUtterance: string;
  problemStatement?: string;
  lastBoardEquation?: string;
}): string {
  const base =
    `You started self-correcting mid-turn ("${args.sentence.slice(0, 120)}"). ` +
    `That's confusing for the student to hear. Re-emit your response cleanly: recompute first, then speak ONLY the correct version. ` +
    `Do not narrate your own confusion or backtrack out loud.`;
  const move = (args.studentUtterance ?? '').trim();
  const stmt = (args.problemStatement ?? '').trim();
  if (!move && !stmt) return base;
  const anchor: string[] = [];
  if (stmt) anchor.push(`The problem on the board: ${stmt.slice(0, 160)}.`);
  if (args.lastBoardEquation?.trim()) anchor.push(`The last equation you wrote: ${args.lastBoardEquation.trim().slice(0, 160)}.`);
  if (move) anchor.push(`The student's move was: "${move.slice(0, 120)}".`);
  return `${base} Start from the student's move: apply exactly that move to the current equation, write the resulting equation, then speak it. ${anchor.join(' ')}`;
}
```
VTR: replace the inline `const reason = …` in the self-correction block with
```ts
                    const reason = buildSelfCorrectionRetryReason({
                      sentence: updatedSentence,
                      studentUtterance: transcript ?? '',
                      problemStatement: currentProblemRef.current?.statement,
                      lastBoardEquation: turnEquationsRef.current[turnEquationsRef.current.length - 1],
                    });
```

- [ ] **Step 4: Run** — register `"test:self-correction-retry"`; `npm run test:self-correction-retry && npx tsc --noEmit -p tsconfig.json` → pass.

- [ ] **Step 5: Commit** — `git commit -m "fix(tutor): self-correction retry restarts from the student's move and the current equation"`.

---

### Task 10: Homework record gains a draft lifecycle (model + store + assign)

**Design (Praveen's ruling, spec design note 1):** one server record per session; `status: 'draft'` while the session runs, `'assigned'` after finalize; a record with no `status` is a legacy assigned record.

**Files:**
- Modify: `src/models/PracticeAssignment.ts`
- Modify: `src/lib/tutor/practice-assign/store.ts`
- Modify: `src/lib/tutor/practice-assign/assign.ts`
- Modify: `scripts/test-practice-assign.ts` (append pure tests)
- Modify: `src/app/api/portal/v1/assigned-practice/route.ts` (`includeAcknowledged` branch must also exclude drafts)

**Interfaces (Produces):**
```ts
type AssignmentStatus = 'draft' | 'assigned';
type FinalizeSource = 'close_tool' | 'end' | 'pagehide' | 'time_cap' | 'sweep';
// store.ts
export function draftStatusClause(): { status: { $ne: 'draft' } }
export function mergeDraftLos(existing: IPracticeAssignmentLo[], incoming: IPracticeAssignmentLo[], max?: number): IPracticeAssignmentLo[]
export function finalizePatch(rec: IPracticeAssignment, p: { reason?: string; nextTimeIntent?: string; locator?: string; source: FinalizeSource; now?: Date }): Partial<IPracticeAssignment>
export async function findDraftBySession(sessionId: string): Promise<IPracticeAssignment | null>
export async function finalizeDraft(sessionId: string, p: { reason?: string; nextTimeIntent?: string; locator?: string; source: FinalizeSource }): Promise<IPracticeAssignment | null>
export async function sweepStaleDrafts(studentId: string, olderThanMs: number): Promise<number>
// assign.ts — assignPractice input gains: status?: AssignmentStatus (default 'assigned'); trigger?: string
```

- [ ] **Step 1: Failing tests** (append to `scripts/test-practice-assign.ts`, following its existing import style)

```ts
import { openAssignmentsQuery, mergeDraftLos, finalizePatch, draftStatusClause } from '../src/lib/tutor/practice-assign/store';
// open reads exclude drafts
assert.deepEqual(openAssignmentsQuery('s1').status, { $ne: 'draft' });
assert.deepEqual(draftStatusClause(), { status: { $ne: 'draft' } });
// merge keeps earlier LOs, caps at 2, dedups by loId
const lo = (id: string) => ({ loId: id, title: id, reason: 'r', items: [] });
assert.deepEqual(mergeDraftLos([lo('a')], [lo('a'), lo('b')]).map((l) => l.loId), ['a', 'b']);
assert.deepEqual(mergeDraftLos([lo('a'), lo('b')], [lo('c')]).map((l) => l.loId), ['a', 'b']);
// finalize patch promotes + stamps + applies the brain's reason to every LO
const rec: any = { _id: 'x', studentId: 's1', sessionId: 'sess', los: [lo('a')], status: 'draft', draftedAt: new Date(0), auto: true, assignedAt: new Date(0), createdAt: new Date(0) };
const now = new Date('2026-09-07T10:00:00Z');
const patch = finalizePatch(rec, { reason: 'This tripped you up twice today.', nextTimeIntent: 'start with a warm-up', locator: 'Unit 2 · Practice', source: 'close_tool', now });
assert.equal(patch.status, 'assigned');
assert.equal(patch.finalizeSource, 'close_tool');
assert.equal(patch.assignedAt?.toISOString(), now.toISOString());
assert.equal(patch.finalizedAt?.toISOString(), now.toISOString());
assert.equal(patch.los?.[0].reason, 'This tripped you up twice today.');
assert.equal(patch.locator, 'Unit 2 · Practice');
// no reason ⇒ the draft's default reason survives
assert.equal(finalizePatch(rec, { source: 'end', now }).los?.[0].reason, 'r');
```

- [ ] **Step 2: Run** — `npm run test:practice-assign` → FAIL (exports missing).

- [ ] **Step 3: Implement**

Model — add to the interface and schema:
```ts
  /** 'draft' while the session runs (drafted on evidence), 'assigned' after finalize. Absent ⇒ legacy assigned record. */
  status?: 'draft' | 'assigned';
  draftedAt?: Date;
  finalizedAt?: Date;
  finalizeSource?: 'close_tool' | 'end' | 'pagehide' | 'time_cap' | 'sweep';
  /** Evidence that drafted each LO (e.g. "recurrence:alg1.x", "incorrect_streak:alg1.y"). */
  triggers?: string[];
```
schema: `status: { type: String, enum: ['draft', 'assigned'] }, draftedAt: Date, finalizedAt: Date, finalizeSource: String, triggers: { type: [String], default: undefined }` and index `PracticeAssignmentSchema.index({ status: 1, draftedAt: 1 });`.

store.ts:
```ts
export type FinalizeSource = 'close_tool' | 'end' | 'pagehide' | 'time_cap' | 'sweep';
export const DRAFT_MAX_LOS = 2;
export function draftStatusClause(): { status: { $ne: 'draft' } } { return { status: { $ne: 'draft' } }; }

export function mergeDraftLos(existing: IPracticeAssignmentLo[], incoming: IPracticeAssignmentLo[], max = DRAFT_MAX_LOS): IPracticeAssignmentLo[] {
  const out = [...existing];
  for (const lo of incoming) {
    if (out.length >= max) break;
    if (!out.some((e) => e.loId === lo.loId)) out.push(lo);
  }
  return out;
}

export function finalizePatch(rec: IPracticeAssignment, p: { reason?: string; nextTimeIntent?: string; locator?: string; source: FinalizeSource; now?: Date }): Partial<IPracticeAssignment> {
  const now = p.now ?? new Date();
  const reason = p.reason?.trim().slice(0, 240);
  return {
    status: 'assigned',
    assignedAt: now,
    finalizedAt: now,
    finalizeSource: p.source,
    auto: p.source !== 'close_tool',
    los: reason ? rec.los.map((l) => ({ ...l, reason })) : rec.los,
    ...(p.nextTimeIntent?.trim() ? { nextTimeIntent: p.nextTimeIntent.trim().slice(0, 200) } : {}),
    ...(p.locator?.trim() ? { locator: p.locator.trim().slice(0, 80) } : {}),
  };
}

export async function findDraftBySession(sessionId: string): Promise<IPracticeAssignment | null> {
  await connectDB();
  return (await PracticeAssignmentModel.findOne({ sessionId, status: 'draft' }).lean()) as IPracticeAssignment | null;
}

export async function finalizeDraft(sessionId: string, p: { reason?: string; nextTimeIntent?: string; locator?: string; source: FinalizeSource }): Promise<IPracticeAssignment | null> {
  await connectDB();
  const rec = await findDraftBySession(sessionId);
  if (!rec) return null;
  await PracticeAssignmentModel.updateOne({ _id: rec._id, status: 'draft' }, { $set: finalizePatch(rec, p) });
  return (await PracticeAssignmentModel.findById(rec._id).lean()) as IPracticeAssignment;
}

/** Drafts the session never finalized (tab killed, network gone): promote
 *  after `olderThanMs` with the draft's default reason. Called lazily from
 *  the student-facing reads, so "nightly" is whenever the student next looks. */
export async function sweepStaleDrafts(studentId: string, olderThanMs: number): Promise<number> {
  await connectDB();
  const cutoff = new Date(Date.now() - olderThanMs);
  const stale = (await PracticeAssignmentModel.find({ studentId, status: 'draft', draftedAt: { $lte: cutoff } }).lean()) as IPracticeAssignment[];
  for (const rec of stale) {
    await PracticeAssignmentModel.updateOne({ _id: rec._id, status: 'draft' }, { $set: finalizePatch(rec, { source: 'sweep' }) });
  }
  return stale.length;
}
```
`openAssignmentsQuery`: add `Object.assign(q, draftStatusClause());` before the courseId merge. `upsertAssignment`: unchanged for assigned writes; add
```ts
export async function upsertDraft(a: Omit<IPracticeAssignment, '_id' | 'createdAt' | 'assignedAt'> & { _id?: string }): Promise<{ rec: IPracticeAssignment; alreadyAssigned: boolean }> {
  await connectDB();
  const existing = (await PracticeAssignmentModel.findOne({ sessionId: a.sessionId }).lean()) as IPracticeAssignment | null;
  if (existing && existing.status !== 'draft') return { rec: existing, alreadyAssigned: true }; // never demote (legacy = assigned)
  const _id = existing?._id ?? a._id ?? randomUUID();
  const los = existing ? mergeDraftLos(existing.los, a.los) : a.los.slice(0, DRAFT_MAX_LOS);
  const triggers = [...new Set([...(existing?.triggers ?? []), ...(a.triggers ?? [])])];
  await PracticeAssignmentModel.updateOne(
    { _id },
    { $set: { ...a, _id, los, triggers, status: 'draft', draftedAt: existing?.draftedAt ?? new Date(), assignedAt: existing?.assignedAt ?? new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );
  return { rec: (await PracticeAssignmentModel.findById(_id).lean()) as IPracticeAssignment, alreadyAssigned: false };
}
```
assign.ts: add `status?: 'draft' | 'assigned'; trigger?: string;` to the input; when `input.status === 'draft'` call `upsertDraft({ …same fields…, triggers: input.trigger ? [input.trigger] : [] , auto: true })` and return `{ assignmentId, assigned, status: 'draft' }`; otherwise existing behaviour. Return type gains `status: 'draft' | 'assigned'`. The `alreadyAssigned` case returns the existing record's summary with `status: 'assigned'`.

`assigned-practice/route.ts`: in the `includeAcknowledged` branch add `...draftStatusClause()` to the find filter.

- [ ] **Step 4: Run** — `npm run test:practice-assign && npm run test:homework-status && npx tsc --noEmit -p tsconfig.json` → pass.

- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): PracticeAssignment draft lifecycle — status, merge, finalize patch, stale sweep; open reads exclude drafts"`.

---

### Task 11: Draft / finalize / state routes + finalize on the profile commit + lazy sweep

**Files:**
- Create: `src/app/api/tutor/practice-assign/draft/route.ts`, `…/finalize/route.ts`, `…/state/route.ts`
- Modify: `src/app/api/tutor/student-profile/[id]/route.ts` (`CommitBody` + the "Spec §C.3 fallback" block)
- Modify: `src/app/api/portal/v1/assigned-practice/route.ts` and `src/lib/tutor/learner-model/context-block.ts` (lazy sweep before the homework read)
- Create: `scripts/test-practice-assign-routes.ts` (pure: body parsing helpers)

- [ ] **Step 1: Failing test**

```ts
// scripts/test-practice-assign-routes.ts
import { strict as assert } from 'node:assert';
import { parseDraftBody, parseFinalizeBody } from '../src/lib/tutor/practice-assign/route-bodies';
assert.deepEqual(parseDraftBody({ studentId: 's', sessionId: 'x', loIds: ['a', 3, 'b'], trigger: 'recurrence:a', locator: 'Unit 2 · Practice' }),
  { ok: true, value: { studentId: 's', sessionId: 'x', loIds: ['a', 'b'], trigger: 'recurrence:a', locator: 'Unit 2 · Practice', lessonPlanId: undefined, courseId: undefined, subject: undefined } });
assert.equal(parseDraftBody({ studentId: 's', sessionId: 'x', loIds: [] }).ok, false);
assert.deepEqual(parseFinalizeBody({ studentId: 's', sessionId: 'x', source: 'close_tool', reason: ' r ', nextTimeIntent: 'n' }),
  { ok: true, value: { studentId: 's', sessionId: 'x', source: 'close_tool', reason: 'r', nextTimeIntent: 'n', locator: undefined } });
assert.equal(parseFinalizeBody({ studentId: 's', sessionId: 'x', source: 'bogus' }).ok, false);
console.log('practice-assign-routes: all assertions passed');
```

- [ ] **Step 2: Run** → FAIL (module missing).

- [ ] **Step 3: Implement**

```ts
// src/lib/tutor/practice-assign/route-bodies.ts
import type { FinalizeSource } from './store';
const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
const SOURCES: FinalizeSource[] = ['close_tool', 'end', 'pagehide', 'time_cap', 'sweep'];
export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

export interface DraftBody { studentId: string; sessionId: string; loIds: string[]; trigger?: string; locator?: string; lessonPlanId?: string; courseId?: string; subject?: string }
export function parseDraftBody(b: Record<string, unknown>): Parsed<DraftBody> {
  const studentId = str(b.studentId); const sessionId = str(b.sessionId);
  const loIds = Array.isArray(b.loIds) ? b.loIds.filter((x): x is string => typeof x === 'string' && x.length > 0) : [];
  if (!studentId || !sessionId || loIds.length === 0) return { ok: false, error: 'studentId, sessionId, loIds[] required' };
  return { ok: true, value: { studentId, sessionId, loIds, trigger: str(b.trigger), locator: str(b.locator), lessonPlanId: str(b.lessonPlanId), courseId: str(b.courseId), subject: str(b.subject) } };
}
export interface FinalizeBody { studentId: string; sessionId: string; source: FinalizeSource; reason?: string; nextTimeIntent?: string; locator?: string }
export function parseFinalizeBody(b: Record<string, unknown>): Parsed<FinalizeBody> {
  const studentId = str(b.studentId); const sessionId = str(b.sessionId); const source = str(b.source) as FinalizeSource | undefined;
  if (!studentId || !sessionId || !source || !SOURCES.includes(source)) return { ok: false, error: 'studentId, sessionId, source required' };
  return { ok: true, value: { studentId, sessionId, source, reason: str(b.reason), nextTimeIntent: str(b.nextTimeIntent), locator: str(b.locator) } };
}
```

Routes — each copies the auth preamble of `practice-assign/route.ts` verbatim (token from `x-embed-token` header or `body.embedToken`; `checkEmbedAuthAsync({ token, expectedStudentId: studentId, route: '<name>:POST' })`; `embedTokenRejectionReason`; `partnerIdForInternalRoute`; `resolveProfileIdOrRaw`):

`draft/route.ts` — body via `parseDraftBody`; calls `assignPractice({ …, loIds, reason: 'Your tutor noticed this needed more practice this session.', status: 'draft', trigger, auto: true })`; 204 when null; 200 `{ assignmentId, status, los: assigned }`; logs `[practice-assign:draft] session=… trigger=… los=…`.

`finalize/route.ts` — body via `parseFinalizeBody`; `const rec = await finalizeDraft(sessionId, { reason, nextTimeIntent, locator, source })`; if null: `const existing = await findAssignmentBySession(sessionId)`; existing && status !== 'draft' → 200 `{ assignmentId, status: 'assigned', assigned: existing.los.map(l => ({ loId, title, count: l.items.length })), alreadyFinalized: true }` else 204; else 200 `{ assignmentId: rec._id, status: 'assigned', assigned: … }`.

`state/route.ts` — body `{ studentId, sessionId }`; `findAssignmentBySession`; 204 if none; 200 `{ assignmentId, status: rec.status ?? 'assigned', locator, los: [{loId,title,count}] }`.

Profile commit route — add to `CommitBody`: `finalizeHomework?: { source: 'end' | 'pagehide' | 'time_cap' };` and replace the head of the "Spec §C.3 fallback" block with:
```ts
  let autoAssigned: Array<{ loId: string; title: string; count: number }> | undefined;
  let finalizedLocator: string | undefined;
  if (body.finalizeHomework && ['end', 'pagehide', 'time_cap'].includes(body.finalizeHomework.source)) {
    try {
      const rec = await finalizeDraft(body.sessionId, { nextTimeIntent: body.nextSessionIntent, locator: body.practiceLocator, source: body.finalizeHomework.source });
      if (rec) { autoAssigned = rec.los.map((l) => ({ loId: l.loId, title: l.title, count: l.items.length })); finalizedLocator = rec.locator; console.log(`[student-profile] finalized draft homework session=${body.sessionId} source=${body.finalizeHomework.source}`); }
    } catch (e) { console.error('[student-profile] finalize draft failed', e); }
  }
  if (!autoAssigned && body.generateNotes !== false && Array.isArray(body.gaps) && body.gaps.length) {
    … (existing candidates/auto-assign block unchanged) …
  }
```
and make sure the response includes `assignedPractice: autoAssigned` and `practiceLocator: finalizedLocator` when set (find where `autoAssigned` is already put on the response and extend it).

Lazy sweep: at the top of the `assigned-practice` POST handler (after `profileId`) and at the start of context-block's homework read (`findOpenAssignments` caller): `await sweepStaleDrafts(profileId, 2 * 60 * 60 * 1000).catch((e) => console.error('[practice-assign] sweep failed', e));`.

- [ ] **Step 4: Run** — register `"test:practice-assign-routes"`; `npm run test:practice-assign-routes && npm run test:practice-assign && npx tsc --noEmit -p tsconfig.json` → pass.

- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): homework draft/finalize/state routes; final profile commit finalizes drafts; lazy 2h sweep on reads"`.

---

### Task 12: Client drafts homework on evidence (recurrence, recap still-struggling, incorrect streak ≥ 2)

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx`:
  - new flag `TUTOR_HOMEWORK_DRAFTS` (`NEXT_PUBLIC_TUTOR_HOMEWORK_DRAFTS !== 'off'`)
  - new refs `draftedLosRef`, `homeworkFinalizedRef`
  - new `draftHomework` callback
  - call sites: recurrence listener (the `useEffect` that sets `recurrenceListenerRef.current`), `recap_returned` outcome (`~6275`), inside `feedLedger` after `applyLedgerEvent`
- Modify: `src/app/tutor-portal/embed/page.tsx` (prefix `'practice_draft'`)

- [ ] **Step 1: Declare**

```ts
const TUTOR_HOMEWORK_DRAFTS = process.env.NEXT_PUBLIC_TUTOR_HOMEWORK_DRAFTS !== 'off';
// …
  /** LOs already drafted as homework this page (server merges; this only saves round-trips). */
  const draftedLosRef = useRef<Set<string>>(new Set());
  /** True once a finalize returned an assignment THIS session — the only licence to speak about homework. */
  const homeworkFinalizedRef = useRef(false);
```

- [ ] **Step 2: The drafting callback** (place after `scheduleProfileFlush`)

```ts
  // Homework drafts (Praveen 2026-09-07 ruling): homework is DRAFTED during
  // the session on deterministic evidence and FINALIZED on any exit — no
  // creation path depends on the brain calling a tool at the goodbye.
  const draftHomework = useCallback((loId: string, trigger: 'recurrence' | 'recap_still_struggling' | 'incorrect_streak') => {
    if (!TUTOR_HOMEWORK_DRAFTS || !studentId || !lessonPlanId) return;
    if (loId.startsWith('prereq:')) return;
    if (!(lessonPlanRef.current?.los ?? []).some((l) => l.id === loId)) return;
    if (draftedLosRef.current.has(loId) || homeworkFinalizedRef.current) return;
    draftedLosRef.current.add(loId);
    void fetch('/api/tutor/practice-assign/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(embedToken ? { 'x-embed-token': embedToken } : {}) },
      body: JSON.stringify({ studentId, sessionId: sessionIdRef.current, lessonPlanId, subject, loIds: [loId], trigger: `${trigger}:${loId}`, locator: practiceLocator }),
    }).then(async (res) => {
      if (res.status === 200) {
        const data = await res.json() as { status: string; los: Array<{ loId: string; count: number }> };
        onDebugEvent?.('practice_draft_upserted', `lo=${loId} trigger=${trigger} status=${data.status} count=${data.los.find((l) => l.loId === loId)?.count ?? 0}`);
      } else if (res.status === 204) {
        onDebugEvent?.('practice_draft_empty', `lo=${loId} trigger=${trigger} (no bank items)`);
      } else {
        draftedLosRef.current.delete(loId);
        onDebugEvent?.('practice_draft_failed', `lo=${loId} status=${res.status}`);
      }
    }).catch((e) => { draftedLosRef.current.delete(loId); onDebugEvent?.('practice_draft_failed', `lo=${loId} ${String((e as Error).message).slice(0, 60)}`); });
  }, [studentId, lessonPlanId, subject, embedToken, practiceLocator, onDebugEvent]);
```
`draftHomework` is used inside `feedLedger` (defined earlier in the file) — hold it in a ref: `const draftHomeworkRef = useRef(draftHomework); draftHomeworkRef.current = draftHomework;` declared right after the callback, and call `draftHomeworkRef.current(...)` from the earlier sites.

- [ ] **Step 3: Call sites**

(a) In the recurrence listener effect body, after the prereq early-return: `draftHomeworkRef.current(d.loId, 'recurrence');`
(b) At `recap_returned`, when `outcome === 'still_struggling'`: `draftHomeworkRef.current(a.loId, 'recap_still_struggling');`
(c) In `feedLedger`, immediately after `const d = applyLedgerEvent(...)` (works even when `d` is null):
```ts
    if (kind === 'wrong' || kind === 'no_recovery') {
      const wrongs = ledgerRef.current.get(loId)?.events.filter((e) => e.kind === 'wrong' || e.kind === 'no_recovery').length ?? 0;
      if (wrongs >= 2) draftHomeworkRef.current(loId, 'incorrect_streak');
    }
```
Add `'practice_draft'` to `EMBED_DEBUG_EVENT_PREFIXES`.

- [ ] **Step 4: Verify** — `npm run test:embed-debug-coverage && npx tsc --noEmit -p tsconfig.json` → pass. Manual typed probe (dev server on :3007 with `TUTOR_E2E_URL`, real brain): run `npm run test:tutor-e2e -- pedagogy-recap-accept` and confirm `practice_draft_upserted` appears in the session's debug events (`scripts/tutor-e2e` prints them) — record the outcome in the ledger; this is the change's only end-to-end proof until Task 17.

- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): draft homework during the session on recurrence / still-struggling recap / incorrect streak"`.

---

### Task 13: Finalize on every exit, announce only what exists, tell the brain what the ledger flagged

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx`:
  - `closeSessionNotes` handler (~6763–6851) — draft the brain's LOs then finalize (awaited, bounded), tool-result note
  - the `WhiteboardCommandResult` type (search `interface WhiteboardCommandResult`) gains `note?: string`; the tool_result builder that reads `result.assignedIds` (~13481) includes it
  - `commitSessionToProfile` body (`...(isFinal && locatorForPrompt ? …)` block) — add `finalizeHomework`; response handling sets `assignedPracticeRef`
  - homework-announcement drop (`if (!locatorForPrompt && isHomeworkAnnouncement(updatedSentence))` ~12122) → gate on `assignedPracticeRef.current`
  - brain-stream request (`recapOffer: recapOfferForTurn,` ~10660) — add `ledgerFlags`
- Create: `src/lib/tutor/voice/session-struggles-block.ts` + `scripts/test-session-struggles-block.ts`
- Modify: `src/lib/tutor/voice/claude-brain.ts` (`BrainTurnInput.ledgerFlags`, render the block next to `<recap_offer>`), `src/app/api/tutor/brain/stream/route.ts` (parse `ledgerFlags`)
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` — the close_session_notes / homework rule (grep `practice is waiting` or `close_session_notes` in that file) must say: "Call close_session_notes BEFORE your goodbye sentence. Mention where practice is waiting ONLY if the tool result's note says something was assigned; if it says nothing was assigned, do not mention homework or practice at all."

- [ ] **Step 1: Failing test for the block**

```ts
// scripts/test-session-struggles-block.ts
import { strict as assert } from 'node:assert';
import { formatSessionStrugglesBlock } from '../src/lib/tutor/voice/session-struggles-block';
assert.equal(formatSessionStrugglesBlock(undefined), '');
assert.equal(formatSessionStrugglesBlock([]), '');
const b = formatSessionStrugglesBlock([{ loId: 'alg1.multi-step', title: 'Variables on both sides', detections: 2 }, { loId: 'alg1.classify', title: 'Classifying solutions', detections: 1 }]);
assert.match(b, /^<session_struggles>/);
assert.match(b, /alg1\.multi-step/);
assert.match(b, /Variables on both sides \(struggled 2×\)/);
assert.match(b, /assignLoIds/);
assert.match(b, /<\/session_struggles>\n\n$/);
console.log('session-struggles-block: all assertions passed');
```

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement the block + plumbing**

```ts
// src/lib/tutor/voice/session-struggles-block.ts
export interface LedgerFlag { loId: string; title: string; detections: number }
/** Live 2026-09-06: the brain said "all locked in" and passed no objectives
 *  to close_session_notes while the ledger held two detections. The ledger
 *  is the deterministic record; the brain is told what it holds. */
export function formatSessionStrugglesBlock(flags: LedgerFlag[] | undefined): string {
  if (!flags?.length) return '';
  const lines = flags.slice(0, 3).map((f) => `- ${f.loId}: ${f.title} (struggled ${f.detections}×)`).join('\n');
  return `<session_struggles>\nObjectives the student struggled with this session, by the deterministic ledger:\n${lines}\nWhen you call close_session_notes, include these ids in assignLoIds unless the student demonstrably recovered on that objective later in the session. Never tell the student a record or system flagged them; speak from what you observed.\n</session_struggles>\n\n`;
}
```
claude-brain.ts: `ledgerFlags?: LedgerFlag[]` on `BrainTurnInput`; where `<recap_offer>` is appended, add `out += formatSessionStrugglesBlock(input.ledgerFlags);` (only when `input.recapOffer` is not set for this turn — the offer already owns the turn). stream route: parse `body.ledgerFlags` as an array of `{loId: string, title: string, detections: number}` (max 3) into the turn input.

VTR request: next to `recapOffer: recapOfferForTurn,` add
```ts
            ledgerFlags: TUTOR_CLOSE_NOTES
              ? [...ledgerRef.current.entries()]
                  .filter(([k, v]) => !k.startsWith('prereq:') && v.detections >= 1 && !v.recovered)
                  .sort((a, b) => b[1].detections - a[1].detections)
                  .slice(0, 3)
                  .map(([loId, v]) => ({ loId, title: loTitleFor(loId), detections: v.detections }))
              : undefined,
```

closeSessionNotes handler — replace the `void (async () => { … })()` fetch with an AWAITED sequence (the handler is already `async`), bounded by `AbortSignal.timeout(4000)`:
```ts
        let note = 'close_session_notes: nothing was assigned — do not mention homework or practice.';
        if (studentId && !closeNotesFiredRef.current) {
          try {
            const headers = { 'Content-Type': 'application/json', ...(embedToken ? { 'x-embed-token': embedToken } : {}) };
            if (loIds.length && TUTOR_HOMEWORK_DRAFTS) {
              await fetch('/api/tutor/practice-assign/draft', { method: 'POST', headers, signal: AbortSignal.timeout(4000),
                body: JSON.stringify({ studentId, sessionId: sessionIdRef.current, lessonPlanId, subject, loIds, trigger: 'close_tool', locator: practiceLocator }) });
            }
            const reason = (c.reason ?? '').trim() || 'Your tutor picked these to follow up on today\'s lesson.';
            const res = TUTOR_HOMEWORK_DRAFTS
              ? await fetch('/api/tutor/practice-assign/finalize', { method: 'POST', headers, signal: AbortSignal.timeout(4000),
                  body: JSON.stringify({ studentId, sessionId: sessionIdRef.current, source: 'close_tool', reason, nextTimeIntent: c.nextTimeIntent, locator: practiceLocator }) })
              : await fetch('/api/tutor/practice-assign', { method: 'POST', headers, signal: AbortSignal.timeout(4000),
                  body: JSON.stringify({ studentId, sessionId: sessionIdRef.current, lessonPlanId, subject, loIds, reason, locator: practiceLocator, nextTimeIntent: c.nextTimeIntent }) });
            if (res.status === 200 || res.status === 204) closeNotesFiredRef.current = true;
            if (res.status === 200) {
              const data = await res.json() as { assigned: Array<{ loId: string; title: string; count: number }> };
              const detail = data.assigned.map((a) => `${a.loId}:${a.count}`).join(',');
              if (practiceLocator && data.assigned.length) {
                assignedPracticeRef.current = data.assigned;
                homeworkFinalizedRef.current = true;
                onHomeworkAssignedRef.current?.({ los: data.assigned, locator: practiceLocator });
                note = `close_session_notes: assigned practice on ${data.assigned.map((a) => a.title).join(' and ')} — it is waiting in "${practiceLocator}". You may tell the student that, once.`;
                onDebugEvent?.('practice_assigned', detail);
              } else {
                onDebugEvent?.('practice_assigned', `silent=${practiceLocator ? 'empty' : 'no-locator'} ${detail}`);
              }
            } else if (res.status !== 204) {
              onDebugEvent?.('practice_assign_failed', `status=${res.status}`);
            }
          } catch (e) {
            onDebugEvent?.('practice_assign_failed', String((e as Error).message).slice(0, 80));
          }
        }
        closeNotesResultNoteRef.current = note;
```
(`onHomeworkAssignedRef` is introduced in Task 15; declare it here as `const onHomeworkAssignedRef = useRef<((a: { los: Array<{ loId: string; title: string; count: number }>; locator?: string }) => void) | undefined>(undefined);` so this task compiles; Task 15 assigns it.) Keep the existing `practice_assign_skipped` telemetry for the no-LO case — but with drafts, a finalize with NO brain LOs can still promote an evidence draft: so call the finalize even when `loIds` is empty (only skip the draft POST), and let the 204 say "nothing".

Tool-result note: declare `const closeNotesResultNoteRef = useRef<string | null>(null);`; at the end of `handleWhiteboardCommand` where the result object is returned (`return { rejected, assignedIds, manifests, boardSnapshot }`), add `...(closeNotesResultNoteRef.current ? { note: closeNotesResultNoteRef.current } : {})` and reset the ref to null after reading; in the tool_result builder that reads `result.assignedIds`, include `...(result.note ? { note: result.note } : {})`.

Announce gate: change `if (!locatorForPrompt && isHomeworkAnnouncement(updatedSentence)) {` to `if (!assignedPracticeRef.current && isHomeworkAnnouncement(updatedSentence)) {` and update the adjacent comment: "2026-09-07: gated on an assignment finalized THIS session, not on the locator — live 2026-09-06 the tutor announced a card that did not exist."

Commit body: add `...(isFinal && TUTOR_HOMEWORK_DRAFTS && !homeworkFinalizedRef.current ? { finalizeHomework: { source: opts?.keepalive ? 'pagehide' : 'end' } } : {})`; where the final commit's response is read (search `final profile commit status=`), parse `{ assignedPractice?, practiceLocator? }` and if `assignedPractice?.length && practiceLocator` set `assignedPracticeRef.current`, `homeworkFinalizedRef.current = true`, and call `onHomeworkAssignedRef.current?.(…)` (so the summary screen's card and the pin reflect an End-time finalize).

- [ ] **Step 4: Run** — register `"test:session-struggles-block"`; `npm run test:session-struggles-block && npm run test:homework-announce && npm run test:recap-blocks && npm run test:embed-debug-coverage && npx tsc --noEmit -p tsconfig.json` → pass.

- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): finalize homework on close tool + every exit; announce only a finalized assignment; brain sees ledger flags"`.

---

### Task 14: Resume rehydrates drafts + ledger detections

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — a mount effect keyed on `resumeState` (the prop, non-null on a resumed page) and `studentId`
- Modify: `src/app/tutor-portal/embed/page.tsx` (prefix `'homework_state'`)

- [ ] **Step 1: Implement**

```ts
  // Resume rehydrate (Praveen 2026-09-07 ruling §5): the struggle ledger and
  // the drafted-LO set are page memory; a resumed page must reload them or
  // the close-tool fallback sees nothing (live 2026-09-06 addendum A2).
  useEffect(() => {
    if (!TUTOR_HOMEWORK_DRAFTS || !resumeState || !studentId) return;
    let cancelled = false;
    void fetch('/api/tutor/practice-assign/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(embedToken ? { 'x-embed-token': embedToken } : {}) },
      body: JSON.stringify({ studentId, sessionId: sessionIdRef.current }),
    }).then(async (res) => {
      if (cancelled || res.status !== 200) { if (res.status !== 204) onDebugEvent?.('homework_state_rehydrate_failed', `status=${res.status}`); return; }
      const data = await res.json() as { status: 'draft' | 'assigned'; locator?: string; los: Array<{ loId: string; title: string; count: number }> };
      for (const lo of data.los) {
        draftedLosRef.current.add(lo.loId);
        if (!ledgerRef.current.has(lo.loId)) {
          ledgerRef.current.set(lo.loId, { score: 0, events: [], detections: 1, inferredPushed: true, recovered: false });
        }
      }
      if (data.status === 'assigned') {
        homeworkFinalizedRef.current = true;
        if (data.locator && data.los.length) { assignedPracticeRef.current = data.los; onHomeworkAssignedRef.current?.({ los: data.los, locator: data.locator }); }
      }
      onDebugEvent?.('homework_state_rehydrated', `status=${data.status} los=[${data.los.map((l) => l.loId).join(',')}]`);
    }).catch((e) => onDebugEvent?.('homework_state_rehydrate_failed', String((e as Error).message).slice(0, 60)));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeState, studentId, embedToken]);
```
Add `'homework_state'` to `EMBED_DEBUG_EVENT_PREFIXES`.

- [ ] **Step 2: Verify** — `npm run test:embed-debug-coverage && npm run test:pedagogy-resume && npx tsc --noEmit -p tsconfig.json` → pass.

- [ ] **Step 3: Commit** — `git commit -m "feat(tutor): resumed pages rehydrate homework drafts + ledger detections from the server"`.

---

### Task 15: Homework action pin on the board at close

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — new prop `onHomeworkAssigned?: (a: { los: Array<{ loId: string; title: string; count: number }>; locator?: string }) => void`; assign `onHomeworkAssignedRef.current = onHomeworkAssigned` after props destructure
- Modify: `src/app/tutor/components/session/TutorSession.tsx` — state + element + prop pass-through
- Modify: `src/app/tutor/components/session/SessionStage.tsx` — `actionPin?: ReactNode` rendered in the same wrapper as `hiccupPin`
- Modify: `src/app/tutor-portal/embed/page.tsx` (prefix `'action_pin'`)
- Create: `scripts/test-action-pin-text.ts` + `src/lib/tutor/action-pin-text.ts`

- [ ] **Step 1: Failing test**

```ts
// scripts/test-action-pin-text.ts
import { strict as assert } from 'node:assert';
import { homeworkPinText } from '../src/lib/tutor/action-pin-text';
assert.equal(homeworkPinText({ los: [{ loId: 'a', title: 'Classifying solutions', count: 4 }], locator: 'Unit 2 · Practice' }), 'Homework · Unit 2 · Practice — 4 questions on Classifying solutions');
assert.equal(homeworkPinText({ los: [{ loId: 'a', title: 'A', count: 1 }, { loId: 'b', title: 'B', count: 3 }], locator: 'Unit 1 · Practice' }), 'Homework · Unit 1 · Practice — 4 questions on A and B');
assert.equal(homeworkPinText({ los: [], locator: 'Unit 1 · Practice' }), null);
assert.equal(homeworkPinText({ los: [{ loId: 'a', title: 'A', count: 2 }] }), null); // no locator ⇒ never surfaced
console.log('action-pin-text: all assertions passed');
```

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement**

```ts
// src/lib/tutor/action-pin-text.ts
export function homeworkPinText(a: { los: Array<{ loId: string; title: string; count: number }>; locator?: string }): string | null {
  if (!a.locator || a.los.length === 0) return null;
  const n = a.los.reduce((s, l) => s + l.count, 0);
  const titles = a.los.map((l) => l.title).join(' and ');
  return `Homework · ${a.locator} — ${n} question${n === 1 ? '' : 's'} on ${titles}`;
}
```
TutorSession: `const TUTOR_ACTION_PIN = process.env.NEXT_PUBLIC_TUTOR_ACTION_PIN !== 'off';`, `const [homeworkPin, setHomeworkPin] = useState<string | null>(null);`, pass to VTR `onHomeworkAssigned={(a) => { const t = homeworkPinText(a); if (TUTOR_ACTION_PIN && t) { setHomeworkPin(t); onDebugEvent?.('action_pin_set', t.slice(0, 80)); } }}`, and next to `hiccupPinEl`:
```tsx
  const actionPinEl = homeworkPin ? (
    <div className="ss-cap w-full flex items-center gap-2 rounded-xl bg-emerald-50/95 border border-emerald-200 shadow-md px-3 py-1.5" data-testid="action-pin">
      <span className="shrink-0 grid place-items-center w-5 h-5 rounded-md bg-emerald-500 text-white text-[10px] font-bold">H</span>
      <span className="min-w-0 text-sm font-medium leading-snug text-emerald-900">{homeworkPin}</span>
      <button type="button" aria-label="Dismiss homework pin" onClick={() => setHomeworkPin(null)} className="shrink-0 grid place-items-center w-5 h-5 rounded-md text-emerald-700/70 hover:bg-emerald-100 hover:text-emerald-900">✕</button>
    </div>
  ) : undefined;
```
pass `actionPin={actionPinEl}` to `SessionStage`; in SessionStage add the prop to the interface + destructure and render it right after the `hiccupPin` block using the same wrapper markup (`{actionPin && (<div …same classes…>{actionPin}</div>)}`). Add `'action_pin'` to the embed prefixes.

- [ ] **Step 4: Run** — register `"test:action-pin-text"`; `npm run test:action-pin-text && npm run test:embed-debug-coverage && npx tsc --noEmit -p tsconfig.json` → pass.

- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): homework action pin on the board when an assignment is finalized this session"`.

---

### Task 16: Resume-board seeding telemetry (addendum A6, log-only)

**Why:** after resume the brain scrolled to a card it remembered (`showProblem-4`, persisted at 17:53:57) and the catalog offered only "Worked Example". Nothing records what the seed rebuilt.

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — at the resume-seed replay (search `resumeContentSeededRef` ~8966 and the `{ resumeSeed: true }` batch dispatch)
- Modify: `src/app/tutor-portal/embed/page.tsx` (prefix `'resume_board'`)

- [ ] **Step 1: Implement**

Right after the seed batch is dispatched and the catalog mirrored, emit:
```ts
      {
        const items = catalogRef.current.getItems();
        const pages = catalogRef.current.getPages();
        const last = items[items.length - 1]?.itemId ?? '(none)';
        onDebugEvent?.('resume_board_seeded', `persisted=${seedCommands.length} catalog=${items.length} pages=${pages.length} last=${last}`);
        if (items.length < seedCommands.filter(isBoardRenderCommand).length) {
          onDebugEvent?.('resume_board_seed_mismatch', `persisted_renders=${seedCommands.filter(isBoardRenderCommand).length} catalog=${items.length}`);
        }
      }
```
(`seedCommands` = whatever local name the replay uses for the restored command array — read the block and use its name.) Add `'resume_board'` to the prefixes.

- [ ] **Step 2: Verify** — `npm run test:resume-seed && npm run test:embed-debug-coverage && npx tsc --noEmit -p tsconfig.json` → pass.

- [ ] **Step 3: Commit** — `git commit -m "chore(tutor): resume-board seeding telemetry (A6 investigation hook)"`.

---

### Task 17: Harness reproduction for R1, final gate, handoff

**Files:**
- Create: `scripts/tutor-e2e/scenarios/render-step-labels.ts`
- Modify: `docs/superpowers/reports/2026-09-07-live-check-3-fixes-handoff.md` (create)
- Ledger: `.superpowers/sdd/2026-09-07-live-check-3-fixes/progress.md` (git-ignored)

- [ ] **Step 1: Scenario**

```ts
// scripts/tutor-e2e/scenarios/render-step-labels.ts
import type { Scenario } from '../types';

/** R1 reproduction (2026-09-07): two problems solved in ONE segment with the
 *  brain's habitual step labels ("Collecting x terms", "Final answer"). Every
 *  show_equation tool call must produce a board entry: count `tool_call
 *  Whiteboard tool: showEquation` events vs showEquation whiteboardCommands
 *  in the saved session — they must be equal, and no
 *  `show_equation_label_duplicate` event may fire for a different page. */
const scenario: Scenario = {
  name: 'render-step-labels',
  description: 'two multi-step equations in one segment; every step equation must paint (R1)',
  start: { subject: 'math', level: 'high-school', topic: 'algebra-1', lessonPlanId: 'evelyn.hs.alg1.multi-step-equations.v1', studentName: 'Probe Student', studentId: 'e2e-probe-r1' },
  seedTurns: [],
  testTurns: [
    { say: 'can we solve 4x - 7 = 2x + 9 together, step by step, writing each step on the board', timeoutMs: 120_000, watchFor: 'showEquation painted with an id' },
    { say: 'subtract 2x from both sides', watchFor: 'render_sync_flush with (showEquation-N)' },
    { say: 'add 7 to both sides, then divide by 2, so x = 8', watchFor: 'the "Final answer" equation paints' },
    { say: 'great, now a fresh one: 6x - 12 = 4x + 10, same steps please', watchFor: 'the fresh equation paints — this is the case that used to drop' },
    { say: 'take 4x to the left', watchFor: 'the collecting step paints even though the label repeats' },
    { say: 'add 12 then divide by 2, x = 11', watchFor: 'a second "Final answer" paints; no rule8_client_repair sent=1 painted=0' },
  ],
};
export default scenario;
```

- [ ] **Step 2: Run the scenario** — dev server on :3007 (`PORT=3007 npm run dev` in `apps/tutor`), then `TUTOR_E2E_URL=http://localhost:3007 npm run test:tutor-e2e -- render-step-labels`. Read the saved session (the harness prints the session id; fetch it as the previous handoff did, or inspect the harness output) and assert by hand: `count(tool_call showEquation) === count(whiteboardCommands.showEquation)` and zero `rule8_client_repair … painted=0` after a showEquation. Record the numbers in the ledger. If a drop still occurs, its `tool_call Dropped …` / `render_dropped` event now names the path — fix that path in a follow-up task before proceeding.

- [ ] **Step 3: Final gate** (from `apps/tutor`, on the merged tree — first `git merge origin/main` in the worktree and resolve nothing silently):
```bash
npx tsc --noEmit -p tsconfig.json
npm run test:all
npm run build
```
Expected: tsc 0; `test:all` = baseline passes + every new battery; build exit 0. Record the exact `N/M passed` line and the list of reds (must equal the baseline reds recorded before Task 1).

- [ ] **Step 4: Handoff doc** — `docs/superpowers/reports/2026-09-07-live-check-3-fixes-handoff.md`: what shipped per task (sha), the R1 root cause paragraph from Task 1, the gate output, the harness numbers, what is NOT verified (live voice; academy tab; the A6 mismatch event has not yet been observed), and the deploy checklist (`cmp .env.local.production ../../../.env.local.production` before `./deploy-tutor.sh`; push `git push origin tutor-rounds:main`).

- [ ] **Step 5: Commit** — `git add scripts/tutor-e2e/scenarios/render-step-labels.ts docs/superpowers/reports/2026-09-07-live-check-3-fixes-handoff.md && git commit -m "test(tutor): R1 harness scenario + live-check-3 fixes handoff"`.

---

## Deferred (recorded, not built here)

- **Step-result keys from seeds** (spec ranked item 5f): worked-example `steps` are prose; exposing intermediate results as verifiable keys needs seed authoring changes across 900+ plans. Deferred until the authored-ending guard (Task 6) and judge authored-solution (Task 8) have live evidence.
- **Contract `status` on AssignedPracticeEntry / `includeDrafts`**: not needed — the engine never returns drafts from the portal read. Add only if the academy wants to show "in progress" drafts.
- **Academy Practice & Quizzes tab overhaul + lessons-tab chip overflow (A4/A5 UI, design note 2):** separate plan in the academy repo (`~/Dev/academy`, worktree `holistic-pedagogy-plan2`), written after this plan's gate is green.

## Self-review notes

- Spec coverage: R1 (T1, T2, T17) · F4 (T3) · DISTRIBUTE (T4) · reversal mention (T5) · authored ending (T6) · ledger blame (T7) · judge authored truth (T8) · retry from student's move (T9) · homework design note §1–§5 (T10–T14) · action pin A4 (T15) · A6 (T16). A5 + Practice tab = academy plan.
- Names used across tasks: `homeworkFinalizedRef`, `draftedLosRef`, `onHomeworkAssignedRef`, `assignedPracticeRef` (existing), `closeNotesResultNoteRef`, `TUTOR_HOMEWORK_DRAFTS`, `finalizeDraft`, `findDraftBySession`, `sweepStaleDrafts`, `draftStatusClause`, `homeworkPinText`, `countBoardRenderTools`, `verifiedKeyForJudgeGate`, `utteranceStatesValue`, `isExplanatoryMention`, `findAuthoredEndingContradiction`, `problemMatchesAuthored`, `buildSelfCorrectionRetryReason`, `formatSessionStrugglesBlock`.
