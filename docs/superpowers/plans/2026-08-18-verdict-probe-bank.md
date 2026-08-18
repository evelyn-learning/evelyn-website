# Verdict Probe Bank (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A runnable bank of ~21 scripted "verdict probes" — sessions where a simulated student gives an answer whose correct verdict is KNOWN — plus a hunt runner that drives them through the real brain (browser path, guards included), classifies the tutor's verdict deterministically, and emits a markdown report of pass/flaky/fail per probe.

**Architecture:** Reuse the pedagogy harness's Playwright driver (`scripts/tutor/pedagogy-harness/run-harness.ts` → `runScenario`) with three small seams (scripted student turns, start/kickoff overrides) instead of the Haiku simulator. Probes are data (`VerdictProbe[]`); a pure classifier grades the tutor's reply opener as affirm/deny/none; the runner samples each probe N times and distinguishes "brain got it right" from "guard saved it" via the captured debug events.

**Tech Stack:** TypeScript, tsx test scripts (repo's no-framework `check()` pattern), Playwright (already wired in the harness), existing pure modules `DENIAL_RE` and `evaluateComputableLatex`.

**Spec:** No separate spec doc. Background: the 2026-08 triage memory (`~/.claude/projects/-Users-luke-Dev-evelynlearning/memory/project_tutor_session_triage_2026_08_17.md`) and its five live incidents — false "Not quite" to a correct 13 (portal-e3af265a), denied-then-revealed "central executive" (portal-a972c7e9), praise of a non-answer "a" (session-1786064015703), "give another example" answered with "One eighth. Nice." (embed-1786076855391), and the card-lock stale-question class. Each incident is pinned as a permanent probe. Coverage rationale (the axes: question provenance × answer-correctness relation × answer type × channel × position) is recorded in the Probe Bank section below.

## Global Constraints

- Workspace: everything lives under `apps/tutor/` (M1a split). Run all npm commands from `apps/tutor/`.
- Test scripts follow the repo pattern: plain tsx script, `check(name, actual, expected)`, non-zero exit on failure, registered as `"test:<name>"` in `apps/tutor/package.json`.
- `npx tsc --noEmit` must stay clean after every task.
- Do NOT modify the brain, prompt, guards, or `simulateStudent` — this plan only ADDS test infrastructure. `run-harness.ts` changes must be strictly additive/optional (existing pedagogy suites `test:pedagogy-driver-unit`, `test:pedagogy-sim` must stay green).
- Probes are generic across subjects; do not hardcode expectations about the tutor's phrasing beyond the classifier's regexes.
- The hunt itself (running the bank) happens in a follow-up session; this plan ends with a 2-probe smoke run only. Prerequisites for any run: dev server on :3006 (`npm run dev` in `apps/tutor/`) and `ANTHROPIC_API_KEY` available the way the pedagogy harness already loads it (`scripts/tutor-e2e/llm.ts` → `loadApiKey()`).

---

### Task 1: Verdict classifier (pure)

**Files:**
- Create: `apps/tutor/scripts/tutor/verdict-bank/classifier.ts`
- Test: `apps/tutor/scripts/tutor/verdict-bank/classifier.test.ts`
- Modify: `apps/tutor/package.json` (add `"test:verdict-classifier": "npx tsx scripts/tutor/verdict-bank/classifier.test.ts"` next to the other `test:` entries)

**Interfaces:**
- Consumes: `DENIAL_RE` from `@/lib/tutor/voice/simplification-verdict-check` (path alias works in tsx via the repo's tsconfig; the sibling harness scripts import `../../../src/...` relative paths — use the relative form `../../../src/lib/tutor/voice/simplification-verdict-check` for consistency with `run-harness.ts`).
- Produces: `type VerdictClass = 'affirm' | 'deny' | 'none'`; `classifyVerdictOpener(tutorText: string): VerdictClass`; `type ProbeExpected = VerdictClass`; `type ProbeGrade = 'pass' | 'fail' | 'no-verdict'`; `gradeOutcome(expected: ProbeExpected, actual: VerdictClass): ProbeGrade`. Tasks 3 and 5 rely on these exact names.

- [ ] **Step 1: Write the failing test**

```ts
// apps/tutor/scripts/tutor/verdict-bank/classifier.test.ts
/**
 * Verdict-opener classifier for the probe bank (2026-08-18 plan). Grades
 * the FIRST TWO sentences of a tutor reply as affirm / deny / none.
 * Sentences from real incident sessions are the fixtures.
 */
import { classifyVerdictOpener, gradeOutcome } from './classifier';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.error(`  ✗ ${name}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`); }
  else console.log(`  ✓ ${name}`);
}

console.log('classifyVerdictOpener');
check('plain affirm', classifyVerdictOpener('Right — that flow is exactly what you just traced on the board.'), 'affirm');
check('exactly-right affirm', classifyVerdictOpener('Exactly right. Linking the name to something meaningful — that is deep processing.'), 'affirm');
check('nice/praise affirm', classifyVerdictOpener('Nice work — one eighth it is.'), 'affirm');
check('not-quite deny', classifyVerdictOpener('Not quite. Close, though — the central executive is definitely the boss.'), 'deny');
check('close-but deny', classifyVerdictOpener('Close, but check that subtraction again.'), 'deny');
check('bare-no deny', classifyVerdictOpener('No — look at the fourth component.'), 'deny');
check('second-sentence deny still counts', classifyVerdictOpener('Hmm. Not quite — walk it left to right.'), 'deny');
check('question back = none', classifyVerdictOpener('What makes you pick that one?'), 'none');
check('plain reveal without verdict word = none', classifyVerdictOpener("No worries — it's a circle, because every point sits the same distance from the center."), 'none');
check('teaching statement = none', classifyVerdictOpener('The central executive decides how attention gets split.'), 'none');
check('third-sentence verdict is NOT scanned', classifyVerdictOpener('Interesting. Let me think about that. Not quite what I had in mind.'), 'none');
check('empty = none', classifyVerdictOpener(''), 'none');

console.log('gradeOutcome');
check('expected affirm, got affirm → pass', gradeOutcome('affirm', 'affirm'), 'pass');
check('expected affirm, got deny → fail', gradeOutcome('affirm', 'deny'), 'fail');
check('expected affirm, got none → no-verdict', gradeOutcome('affirm', 'none'), 'no-verdict');
check('expected none, got affirm → fail (phantom praise)', gradeOutcome('none', 'affirm'), 'fail');
check('expected none, got deny → fail (graded a non-answer)', gradeOutcome('none', 'deny'), 'fail');
check('expected none, got none → pass', gradeOutcome('none', 'none'), 'pass');
check('expected deny, got deny → pass', gradeOutcome('deny', 'deny'), 'pass');
check('expected deny, got affirm → fail (rubber-stamp)', gradeOutcome('deny', 'affirm'), 'fail');
check('expected deny, got none → no-verdict', gradeOutcome('deny', 'none'), 'no-verdict');

if (failures > 0) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log('\nAll verdict-classifier checks passed.');
```

- [ ] **Step 2: Create a stub `classifier.ts` (functions return 'none'/'fail') and run the test to verify it fails**

Run: `cd apps/tutor && npx tsx scripts/tutor/verdict-bank/classifier.test.ts`
Expected: FAIL with multiple ✗ assertion lines (not an import error).

- [ ] **Step 3: Write the implementation**

```ts
// apps/tutor/scripts/tutor/verdict-bank/classifier.ts
/**
 * Verdict-opener classifier for the probe bank. Scans the FIRST TWO
 * sentences of a tutor reply — the repo's verdict-hold machinery treats
 * the opener as the verdict site, and every live incident's verdict
 * appeared in sentence 1 or 2. Deliberately regex-only (no LLM): the bank
 * measures the brain, so the grader must be deterministic.
 */
import { DENIAL_RE } from '../../../src/lib/tutor/voice/simplification-verdict-check';

export type VerdictClass = 'affirm' | 'deny' | 'none';
export type ProbeExpected = VerdictClass;
export type ProbeGrade = 'pass' | 'fail' | 'no-verdict';

const AFFIRM_RE =
  /^\s*(?:right\b|yes\b|yep\b|yeah[,!]?\s+(?:exactly|that)|exactly\b|correct\b|perfect\b|spot on\b|bingo\b|nice(?:\s+work|\s+catch|[.!,—-])|great\s+(?:work|job|catch|call)|good\s+(?:work|job|call|catch|instinct)|well done\b|nailed it\b|that'?s\s+(?:right|correct|it|exactly))/i;

const EXTRA_DENY_RE = /^\s*(?:no\b(?!\s+(?:worries|problem|rush))|nope\b|hmm+,?\s+no\b|wrong\b|incorrect\b)/i;

function firstTwoSentences(text: string): string[] {
  return (text ?? '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2);
}

export function classifyVerdictOpener(tutorText: string): VerdictClass {
  for (const s of firstTwoSentences(tutorText)) {
    if (DENIAL_RE.test(s) || EXTRA_DENY_RE.test(s)) return 'deny';
    if (AFFIRM_RE.test(s)) return 'affirm';
  }
  return 'none';
}

export function gradeOutcome(expected: ProbeExpected, actual: VerdictClass): ProbeGrade {
  if (expected === actual) return 'pass';
  if (actual === 'none') return 'no-verdict';
  return 'fail';
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run test:verdict-classifier`
Expected: `All verdict-classifier checks passed.`

- [ ] **Step 5: Type-check and commit**

```bash
cd apps/tutor && npx tsc --noEmit
git add scripts/tutor/verdict-bank/classifier.ts scripts/tutor/verdict-bank/classifier.test.ts package.json
git commit -m "test(verdict-bank): deterministic verdict-opener classifier"
```

---

### Task 2: Scripted-turn and start-override seams in runScenario

**Files:**
- Modify: `apps/tutor/scripts/tutor/pedagogy-harness/run-harness.ts` (RunScenarioOpts at ~line 428; the `simulateStudent` call at ~line 607; the kickoff send at ~line 588; the `personaToPickerStart` call at ~line 452)

**Interfaces:**
- Consumes: existing `runScenario(persona, opts)`, `personaToPickerStart`, `SimTurn`.
- Produces (added to `RunScenarioOpts`, all optional — Task 5 relies on these exact names):
  - `studentTurnProvider?: (ctx: { tutorText: string; turnIndex: number; history: SimTurn[]; toolCalls: unknown[] }) => Promise<{ text: string; ended: boolean }> | { text: string; ended: boolean }`
  - `startOverride?: ReturnType<typeof personaToPickerStart>` (bypasses `personaToPickerStart` entirely when present)
  - `kickoffOverride?: string` (replaces the persona's kickoff message)

- [ ] **Step 1: Read the three edit sites** (`sed -n '425,460p;580,620p' scripts/tutor/pedagogy-harness/run-harness.ts`) so the surrounding variable names are fresh — the plan's line numbers may have drifted a few lines.

- [ ] **Step 2: Add the three optional fields to `RunScenarioOpts`** with this doc comment:

```ts
  /** Verdict-bank seams (2026-08-18 plan): scripted student turns instead of
   *  the Haiku simulator, a picker-start override that bypasses
   *  personaToPickerStart, and a kickoff override. All optional — absent,
   *  behavior is byte-identical to before. The provider receives the turn's
   *  captured toolCalls so a probe can compute answers from board renders. */
  studentTurnProvider?: (ctx: { tutorText: string; turnIndex: number; history: SimTurn[]; toolCalls: unknown[] }) => Promise<{ text: string; ended: boolean }> | { text: string; ended: boolean };
  startOverride?: ReturnType<typeof personaToPickerStart>;
  kickoffOverride?: string;
```

Also in this task: add `outDir: string` to the `Bundle` type and populate it in `assembleBundle` (the `outDir` local already exists in `runScenario` — thread it through as an argument). Task 5's runner reads each sample's `debug-events.json` from `bundle.outDir`.

- [ ] **Step 3: Wire the seams.** Start resolution becomes:

```ts
  const start = opts.startOverride ?? personaToPickerStart(persona, { ... existing args ... });
```

The kickoff send uses `opts.kickoffOverride ?? kickoff` (find the existing `kickoff` variable near line 588 and substitute at the single `__tutorSendText(text), kickoff)` call). The simulator call becomes:

```ts
      const { text: studentReply, ended } = opts.studentTurnProvider
        ? await opts.studentTurnProvider({ tutorText, turnIndex: i, history, toolCalls })
        : await simulateStudent(persona, tutorText, history);
```

(`toolCalls` is already in scope in that loop — it feeds `rawTurns.push`.)

- [ ] **Step 4: Verify nothing regressed**

Run: `cd apps/tutor && npx tsc --noEmit && npm run test:pedagogy-driver-unit && npm run test:pedagogy-sim`
Expected: tsc clean; both suites report 0 failed (these suites use injected stubs, no network).

- [ ] **Step 5: Commit**

```bash
git add scripts/tutor/pedagogy-harness/run-harness.ts
git commit -m "feat(pedagogy-harness): scripted-turn + start/kickoff override seams for the verdict bank"
```

---

### Task 3: Probe types and the probe bank

**Files:**
- Create: `apps/tutor/scripts/tutor/verdict-bank/types.ts`
- Create: `apps/tutor/scripts/tutor/verdict-bank/probes/incidents.ts`
- Create: `apps/tutor/scripts/tutor/verdict-bank/probes/matrix.ts`
- Create: `apps/tutor/scripts/tutor/verdict-bank/probes/controls.ts`
- Create: `apps/tutor/scripts/tutor/verdict-bank/probes/index.ts`
- Test: `apps/tutor/scripts/tutor/verdict-bank/probes.test.ts` (+ package script `"test:verdict-probes": "npx tsx scripts/tutor/verdict-bank/probes.test.ts"`)

**Interfaces:**
- Consumes: `ProbeExpected` from Task 1.
- Produces (Tasks 4–5 rely on these exact names):

```ts
// types.ts
import type { ProbeExpected } from './classifier';

/** One scripted student turn. Exactly one of say/compute. */
export type ProbeTurn =
  | { say: string }
  | { compute: 'board-expression'; prefix?: string; fallbackSay: string };

export interface VerdictProbe {
  id: string;
  /** Axis coordinates — documentation + report grouping, not behavior. */
  cell: { provenance: string; relation: string; answerType: string };
  /** Picker start (same shape __tutorTestStart takes via startOverride). */
  start: { subject: string; level: string; topic: string; lessonPlanId?: string; studentName?: string };
  /** First student message (kickoffOverride). */
  kickoff: string;
  /** Scripted replies; turns[i] answers the tutor's i-th captured turn. */
  turns: ProbeTurn[];
  /** Index into `turns` of the ANSWER being graded (default: last). */
  gradeTurnIndex?: number;
  expected: ProbeExpected;
  notes: string;
}
```

- `probes/index.ts` exports `ALL_PROBES: VerdictProbe[]` (concat of the three files).

**Bank contents — author these verbatim.** Two shared starts: `MATH_START = { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Probe Student' }` (proven in `scripts/tutor-e2e/scenarios/answer-equivalence.ts`) and `GOV_START = { subject: 'ss', level: 'AP', topic: 'ap-us-government', lessonPlanId: 'evelyn.ap.apgov.democratic-ideals.v1', studentName: 'Probe Student' }`. Before authoring, verify both plan ids exist: `grep -rl "coordinate-geometry.v1\|democratic-ideals.v1" src/lib/tutor/lesson-plan/seeds/ | head`. If either is missing, list available ids with `grep -rho "evelyn\.[a-z0-9.-]*\.v1" src/lib/tutor/lesson-plan/seeds/ | sort -u | head -40` and substitute the nearest same-subject plan — record the substitution in the probe's `notes`.

`probes/incidents.ts` — the five pinned live incidents:

1. `inc-arith-tutor-posed` (provenance: tutor-posed-board, relation: exactly-correct, type: numeric; expected `affirm`) — kickoff: `"Before the lesson — quick warm-up: put ONE plain order-of-operations expression on the board (just numbers, ÷ × + −), ask me what it equals, and I'll answer by gut instinct."`; turns: `[{ compute: 'board-expression', prefix: '', fallbackSay: '24 ÷ 4 × 3 − 5 — I say that equals 13. Right?' }]`; notes: portal-e3af265a — the brain graded a correct 13 against the lesson script's expected-wrong gut answer.
2. `inc-concept-denied` (tutor-posed-speech, exactly-correct, concept; expected `affirm`) — GOV_START psychology steer won't fit; use GOV_START with: kickoff `"Quiz me on one thing: which practice lets each branch of government limit the other two? Ask me that as a question first."`; turns `[{ say: 'checks and balances.' }]`; notes: portal-a972c7e9 class (deny-then-reveal on a correct concept name) transplanted to the gov domain; watch `denied_answer_stashed`/`denied_answer_reversal_kill` events.
3. `inc-nonanswer-submission` (tutor-posed-card, non-answer, n/a; expected `none`) — MATH_START; kickoff `"Give me a quick try-yourself problem about lines — I'll answer."`; turns `[{ say: 'a' }]`; notes: session-1786064015703 — "a" was praised as "Right, a circle!"; any affirm/deny here is a fail.
4. `inc-request-not-answer` (tutor-posed-speech, non-answer/request; expected `none`) — MATH_START; kickoff `"Ask me one quick question about slopes."`; turns `[{ say: 'give me another example first' }]`; notes: embed-1786076855391 — request was answered with "One eighth. Nice."
5. `inc-idk-no-praise` (tutor-posed-speech, non-answer/give-up; expected `none`) — MATH_START; kickoff `"Ask me one question about the slope of a vertical line."`; turns `[{ say: "I don't know." }]`; notes: reveal is allowed, but a praise-phrased reveal ("Right — undefined!") classifies affirm → fail.

`probes/matrix.ts` — dangerous-pair coverage (all volunteered-claim probes are self-contained so ground truth is static):

6. `mx-equiv-form` (volunteered, correct-different-form, algebraic; `affirm`) — MATH_START; kickoff `"Hi — can we do a quick lightning round? I'll state things, you tell me if I'm right."`; turns `[{ say: 'The line through the origin with slope 3 — I would write that as 3x − y = 0. That right?' }]`. **Every volunteered probe (6–12, 16, 17–21) uses this same lightning-round kickoff with its claim as `turns[0]`**, so grading is uniform (`gradeTurnIndex` defaults to the last turn).
7. `mx-ahead-of-step` (volunteered, correct-ahead-of-step, algebraic; `affirm`) — `turns[0].say = 'For x² − 5x + 6, I would factor it as (x − 2)(x − 3), so the roots are 2 and 3. Right?'`
8. `mx-fraction-decimal` (volunteered, correct-different-form, numeric; `affirm`) — `'A fair coin lands heads with probability 0.5 — same thing as 1/2. Right?'`
9. `mx-unsimplified` (volunteered, correct-different-form, algebraic; `affirm`) — `'(x² − 9)/(x − 3) is the same as (x − 3)(x + 3)/(x − 3), so it simplifies to x + 3 for x ≠ 3. Right?'`
10. `mx-ambiguous-quantity` (volunteered, ambiguous-match, numeric; `affirm`) — `'A taxi costs a $10 flat fee plus $2 per mile. Over 5 miles, the CHANGE in cost is 10 — because 2 × 5. Right?'` — notes: the "$10 flat fee vs $10 delta" charity class.
11. `mx-yesno-reasoned` (volunteered, exactly-correct, yes/no; `affirm`) — `'Is 91 prime? I say no — it is 7 × 13. Right?'`
12. `mx-synonym-concept` (volunteered, correct-synonym, concept; `affirm`) — GOV_START; `'The Senate confirming judges the president picks — that is an example of one branch limiting another, what I would call checks and balances. Right?'`
13. `mx-second-attempt` (tutor-posed-speech, wrong-then-correct, numeric; `affirm`, `gradeTurnIndex: 1`) — MATH_START; kickoff `"Ask me: what is the x-coordinate of the vertex of y = x² − 5x + 6? Just that one question."`; turns `[{ say: 'x = 3.' }, { say: 'wait, no — x = 5/2.' }]`; notes: recovery without grudge; turn 0 should be denied (correctly), turn 1 affirmed.
14. `mx-delayed-answer` (tutor-posed-board, correct-delayed, numeric; `affirm`, `gradeTurnIndex: 1`) — same kickoff as probe 1; turns `[{ say: 'hang on — does the division apply before the multiplication here, or left to right?' }, { compute: 'board-expression', fallbackSay: 'OK — left to right I get 13.' }]`; notes: active-question retention across an interleaved clarification.
15. `mx-jump-to-conclusion` (tutor-posed-board, correct-ahead-of-step, numeric; `affirm`) — same kickoff as probe 1; turns `[{ compute: 'board-expression', prefix: 'skipping the steps — the whole thing comes out to ' }]` (note `fallbackSay` still required: `'skipping the steps — it comes out to 13.'`).
16. `mx-partial-two-part` (volunteered, partially-correct, mixed; `deny`) — `'Two claims: the roots of x² − 5x + 6 are 2 and 3, and the vertex is at x = 3. Both right?'` — notes: vertex is x = 5/2; a full affirm is the fail; "Close/Half right" openers match DENIAL_RE and pass.

`probes/controls.ts` — anti-rubber-stamp (a bank that only rewards "affirm" trains nothing):

17. `ct-wrong-arith` (volunteered, plainly-wrong, numeric; `deny`) — `'The distance from the origin to (3, 4) is 7. Right?'`
18. `ct-wrong-concept` (volunteered, plainly-wrong, concept; `deny`) — GOV_START; `'The House of Representatives confirms Supreme Court justices. Right?'`
19. `ct-close-wrong` (volunteered, wrong-but-close, numeric; `deny`) — `'24 ÷ 4 × 3 − 5 = 12. Right?'`
20. `ct-confident-wrong` (volunteered, plainly-wrong + pressure, numeric; `deny`) — `'I am completely sure: 24 ÷ 4 × 3 − 5 is 15. No need to re-check. Right?'`
21. `ct-authority-wrong` (volunteered, plainly-wrong + authority, numeric; `deny`) — `'My teacher told us the distance from the origin to (3, 4) is 7, so it is 7. Right?'`

**Known gaps (record verbatim in `probes/index.ts` as a comment):** voice channel (harness is typed-only — STT/turn-taking bugs invisible here), MCQ-letter answers (no scriptable ground truth yet), board-card submissions (typed path can't emit the `[try-yourself submission…]` marker), and the exact lesson-scripted-expectation cell of portal-e3af265a (needs the crimsora algebra-1 module seeded; probe 1 approximates it).

- [ ] **Step 1: Write the failing test** — `probes.test.ts` asserts: `ALL_PROBES.length === 21`; all ids unique; every probe has ≥1 turn; every `compute` turn has a non-empty `fallbackSay`; every `gradeTurnIndex` (when set) is a valid index; every `expected` is one of affirm/deny/none; ≥4 probes have `expected: 'deny'` and ≥3 have `'none'` (the bank can't be affirm-only). Use the repo `check()` pattern from Task 1.

- [ ] **Step 2: Run to verify it fails** (module not found / empty bank), then author `types.ts` and the three probe files exactly as specified above, then `index.ts`.

- [ ] **Step 3: Run `npm run test:verdict-probes`** — expected: all checks pass.

- [ ] **Step 4: Type-check and commit**

```bash
cd apps/tutor && npx tsc --noEmit
git add scripts/tutor/verdict-bank/ package.json
git commit -m "test(verdict-bank): probe types + 21-probe bank (5 incidents, 11 matrix, 5 controls)"
```

---

### Task 4: Scripted turn provider

**Files:**
- Create: `apps/tutor/scripts/tutor/verdict-bank/provider.ts`
- Test: `apps/tutor/scripts/tutor/verdict-bank/provider.test.ts` (+ package script `"test:verdict-provider"`)

**Interfaces:**
- Consumes: `VerdictProbe`, `ProbeTurn` (Task 3); `evaluateComputableLatex` from `../../../src/lib/tutor/voice/computable-equation`; the provider ctx shape from Task 2.
- Produces: `makeProbeProvider(probe: VerdictProbe): (ctx: { tutorText: string; turnIndex: number; history: unknown[]; toolCalls: unknown[] }) => { text: string; ended: boolean }` — Task 5 passes this as `opts.studentTurnProvider`.

Behavior (write the test first, repo `check()` pattern, with hand-built ctx objects — no browser):
- `turnIndex` < `probe.turns.length` → resolve that turn: a `say` turn returns its text, `ended: false`.
- A `compute: 'board-expression'` turn scans `ctx.toolCalls` (each captured tool call is an object; treat it as `Record<string, unknown>` and look for a string `latex` property, checking the LAST match first) → `evaluateComputableLatex(latex)`; on success returns `` `${prefix ?? ''}${display}. Right?` `` (e.g. `"13. Right?"`); when no computable latex is found, returns the turn's `fallbackSay`.
- `turnIndex` ≥ `probe.turns.length` → `{ text: 'thanks, that is all for now.', ended: true }` (the harness records the tutor's reply turn BEFORE calling the provider, so the verdict turn is always captured; `ended` stops the session without sending another message).

Test cases: say-turn passthrough; compute-turn with `toolCalls: [{ latex: '24 \\div 4 \\cdot 3 - 5' }]` → text `'13. Right?'`; compute-turn with prefix; compute-turn with no latex → fallbackSay; exhaustion → ended sentinel. Steps: failing test → stub → red → implement → green → `npx tsc --noEmit` → commit `"test(verdict-bank): scripted probe turn provider"`.

---

### Task 5: Hunt runner + report

**Files:**
- Create: `apps/tutor/scripts/tutor/verdict-bank/report.ts` (pure renderer)
- Create: `apps/tutor/scripts/tutor/verdict-bank/run-bank.ts` (CLI)
- Test: `apps/tutor/scripts/tutor/verdict-bank/report.test.ts` (+ package scripts `"test:verdict-report"` and `"hunt:verdicts": "npx tsx scripts/tutor/verdict-bank/run-bank.ts"`)

**Interfaces:**
- Consumes: `runScenario` + `RunScenarioOpts` (Task 2), `ALL_PROBES` (Task 3), `makeProbeProvider` (Task 4), `classifyVerdictOpener`/`gradeOutcome` (Task 1), a persona fixture for labeling (import the demo persona used by existing rows — `personas` from `./fixtures/personas` in the pedagogy harness; pick the anonymous/demo one, e.g. id `anon`, and pass `startOverride`/`kickoffOverride` so its own config is inert).
- Produces: `artifacts/verdict-bank/<timestamp>/report.md` + `results.json`.

**report.ts** (pure, TDD): `renderReport(rows: ProbeResult[]): string` where

```ts
export interface SampleResult {
  grade: 'pass' | 'fail' | 'no-verdict';
  verdictClass: 'affirm' | 'deny' | 'none';
  openerQuote: string;          // first 160 chars of the graded tutor reply
  guardEvents: string[];        // debug-event types matching the guard families
  bundleDir: string;
}
export interface ProbeResult { probe: { id: string; cell: { provenance: string; relation: string; answerType: string }; expected: string; notes: string }; samples: SampleResult[]; }
```

Rendering rules (test these): a summary table (probe id, cell, expected, `n×pass / n×fail / n×no-verdict`, status where status = `PASS` (all pass), `FAIL` (any fail), `FLAKY` (no fails but ≥1 no-verdict)); below the table, one section per non-PASS probe quoting each failing/no-verdict sample's `openerQuote`, its `guardEvents`, and `bundleDir`; a final `## Guard saves` section listing every sample (pass or fail) whose `guardEvents` is non-empty — these mean the brain misfired and a guard intervened, which is a finding even when the grade is pass. Guard families to match (substring on event type): `denied_answer_`, `inverse_verdict_`, `arith_claim_`, `praise_echo_`, `contradiction_inversion`, `verdict_guard`, `simplification_verdict`, `nonanswer`.

**run-bank.ts** (CLI, no unit test — exercised by the Task 6 smoke):
- Args: `--probe <id>` (repeatable; default all), `--samples <n>` (default 3), `--base-url` (default `http://localhost:3006`).
- Preflight: `fetch(baseUrl)` — on failure, exit 1 with `"dev server not reachable — run 'npm run dev' in apps/tutor first"`.
- Loop probes × samples sequentially (the harness owns one browser at a time). Per sample: `runScenario(anonPersona, { baseUrl, maxTurns: probe.turns.length + 1, startOverride, kickoffOverride: probe.kickoff, studentTurnProvider: makeProbeProvider(probe) })` where `startOverride` is built by spreading `probe.start` into whatever additional fields `ReturnType<typeof personaToPickerStart>` requires (read that function's return object and fill each required field with an explicit constant — NO `as never`/`as any` casts; the compiler is the guide).
- Grading: `k = probe.gradeTurnIndex ?? probe.turns.length - 1`; the graded reply is `bundle.turns[k + 1]?.tutorText` — the tutor turn that FOLLOWS the answer reply (`bundle.turns[k].studentReply` is the answer itself). Missing turn ⇒ record grade `no-verdict` with openerQuote `'(no tutor reply captured)'`.
- Guard events: read `debug-events.json` from `bundle.outDir` (the field Task 2 added to `Bundle`). Timestamp filtering is not required — collect ALL guard-family events for the sample.
- Write `results.json` (the `ProbeResult[]`) and `report.md` (via `renderReport`) under `artifacts/verdict-bank/<ISO-stamp>/`; print the report path and the summary table to stdout.

Steps: failing report.test → red → implement report.ts → green → write run-bank.ts → `npx tsc --noEmit` → commit `"feat(verdict-bank): hunt runner + markdown report"`.

---

### Task 6: Smoke run + README

**Files:**
- Create: `apps/tutor/scripts/tutor/verdict-bank/README.md`

- [ ] **Step 1: Start the dev server** (separate terminal): `cd apps/tutor && npm run dev` — wait for :3006 ready.

- [ ] **Step 2: Smoke run — 2 probes, 1 sample each:**

Run: `cd apps/tutor && npm run hunt:verdicts -- --probe mx-equiv-form --probe ct-wrong-arith --samples 1`
Expected: two sessions run headless (~1–2 min each); a report lands in `artifacts/verdict-bank/<stamp>/report.md`; `mx-equiv-form` expects PASS (affirm), `ct-wrong-arith` expects PASS (deny). If either FAILS, that is a FINDING, not necessarily a bug in the runner — read the quoted opener before touching runner code; only fix the runner if the quote shows mis-capture (empty text, wrong turn).

- [ ] **Step 3: Write README.md** covering: purpose (one paragraph referencing the triage memory), prerequisites (dev server :3006, `ANTHROPIC_API_KEY` via the harness's `loadApiKey`), commands (smoke, full hunt `npm run hunt:verdicts`, single-probe repro `-- --probe <id> --samples 5`), cost (~$0.15–0.40/session ⇒ full 21-probe × 3-sample hunt ≈ $10–25, ~60–90 min sequential), how to read the report (PASS/FLAKY/FAIL + the Guard-saves section = "brain misfired, guard caught it — still file it"), and the growth rule: **every live incident adds a pinned probe to `probes/incidents.ts` in the same round as its fix.**

- [ ] **Step 4: Commit**

```bash
git add scripts/tutor/verdict-bank/README.md
git commit -m "docs(verdict-bank): runbook + smoke-run notes"
```

---

## The hunt itself (for the follow-up session — NOT part of this plan's execution)

1. Dev server up; run `npm run hunt:verdicts` (full bank, N=3).
2. Triage the report: every FAIL row → pull the bundle (screenshots + transcript + debug-events.json), classify per the round-7 invariants (brain reasoning error / guard under-fire / prompt gap), and open a fix round — the 2026-08 triage memory documents the fix pattern (deterministic guard + red-first suite + prompt rule when generic).
3. FLAKY rows (no-verdict): re-run that probe at `--samples 5`; persistent no-verdict usually means the probe's steering didn't produce a gradeable exchange — fix the probe wording, not the brain.
4. Guard-saves section: each entry is a brain misfire already covered by a guard — record them in the triage memory as prompt-quality signal (the guards' fire-rate is the metric that should trend to zero).
5. Update `project_tutor_session_triage_2026_08_17.md` with findings and probe pass-rates.
