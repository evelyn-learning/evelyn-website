# Session-Triage Fixes (portal-704e3e01) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the client-side false-assertion guard from killing correct affirmations, stop internal scaffolding reaching TTS, and stop the `show_problem` substitution from forcing self-inflicted validator retries.

**Architecture:** Six independent fixes, all in the client orchestrator and its pure helper modules. Nothing here touches the brain, the model registry, prompts, or any server route. Each fix follows the house pattern: a pure decision module under `src/lib/tutor/**` with a `scripts/test-*.ts` harness registered as a `test:*` npm script, wired into `VoiceTutorRealtime.tsx` behind a default-ON flag where it changes behaviour.

**Tech Stack:** TypeScript, React (client component), `npx tsx` test harnesses auto-discovered by `scripts/run-all-tests.mjs`.

**Spec:** This plan is self-contained. Its source evidence is the triage of `portal-704e3e01-1749-4d68-abbf-bd56387a9339` (2026-09-04 00:39-01:07 UTC, Amisha, algebra-1 multi-step equations, 103 turns, 1,016 debug events, $4.31). Regenerate the underlying report with:
```
scp apps/tutor/scripts/inspect-tutor-session.ts root@84.247.185.169:/tmp/
ssh root@84.247.185.169 'cd /root/evelyn-tutor && cp /tmp/inspect-tutor-session.ts ./inspect.ts \
  && export $(grep -E "^(MONGODB_URI|TUTOR_AUDIO_DIR)=" apps/tutor/.env.local | xargs -d "\n") \
  && npx --yes tsx ./inspect.ts portal-704e3e01-1749-4d68-abbf-bd56387a9339 --out /tmp/session-reports'
```
The definitive record of what the brain *composed before a kill* is `grep -a "brain.stream" /root/.pm2/logs/evelyn-tutor-out.log` — the client-side `console.warn`s from these guards never reach the server, so the pm2 log is the only place the pre-kill text survives.

## Global Constraints

- **Worktree only.** Work in `.claude/worktrees/tutor-rounds` (branch `tutor-rounds`). Confirm with `git rev-parse --git-dir` → must contain `.git/worktrees/`. Never work or deploy from `/Users/luke/Dev/evelynlearning` itself.
- **Scope is `apps/tutor/**` only.** Do not touch `apps/marketing/**` or the academy repo.
- **Run every npm command from `apps/tutor/`.**
- **New tutor flags default ON**: `process.env.NEXT_PUBLIC_TUTOR_X !== 'off'`. Do NOT convert existing `=== 'on'` flags in `orchestrator/flags.ts`.
- **Flag names must be `NEXT_PUBLIC_`-prefixed** — every flag in this plan is read in a client component, and a bare `process.env.TUTOR_*` is not inlined into the client bundle (this silently shipped stage `-1` on 2026-08-18; see the deploy incident in `project_tutor_session_triage_2026_08_17`).
- **Do not touch `useOpenAIRealtime.ts`** (frozen file). Nothing in this plan needs it.
- **Prompts stay generic.** No task here edits `system-prompt-builder.ts`; if you find yourself wanting to, stop and flag it.
- **Pre-existing test failures (4), not caused by this round** — do not chase them: `test:pedagogy-posed-problem`, `test:pedagogy-d1` (prompt-clause string drift), `test:embed-token` (gate-mode fixture; passes with `TUTOR_DEMO_GATE=off`), `test:verdict-guard` non-answer branch (R58 drift). A green run is **205/209** with exactly these four red.
- **Praveen gates the deploy.** Finishing this plan is not permission to ship it.

---

## File Structure

| File | Responsibility | Tasks |
|---|---|---|
| `src/lib/tutor/voice/false-assertion-check.ts` | Pure detector: tutor asserts a wrong FINAL value. Owns the extraction regex. | 1, 2 |
| `scripts/test-false-assertion.ts` | Existing harness; gains the live regressions. | 1, 2 |
| `src/lib/tutor/voice/meta-narration.ts` | **New.** Pure `isMetaNarration(sentence)` — phrase list (moved) + structural markup rule. | 4 |
| `scripts/test-meta-narration.ts` | **New.** Pins the moved phrase behaviour, then the `<result>` case. | 4 |
| `src/lib/tutor/voice/verdict-preservation.ts` | **New.** Pure `hasVerdictOpener(text)` + the generic `VERDICT_REPLANT_CLAUSE`. | 3 |
| `scripts/test-verdict-preservation.ts` | **New.** | 3 |
| `src/lib/tutor/orchestrator/show-problem-substitution.ts` | **New.** Pure `shouldSubstituteShowProblem(...)`. | 5 |
| `scripts/test-show-problem-substitution.ts` | **New.** | 5 |
| `src/lib/tutor/whiteboard/page-title.ts` | **New.** Pure `truncatePageTitle` + `pageTitleForBatch`. | 6 |
| `scripts/test-page-title.ts` | **New.** | 6 |
| `src/lib/tutor/orchestrator/flags.ts` | Four new default-ON flags. | 3, 4, 5, 6 |
| `src/app/tutor/components/VoiceTutorRealtime.tsx` | Wiring only. | 2, 3, 4, 5, 6 |
| `src/app/tutor-portal/embed/page.tsx` | `EMBED_DEBUG_EVENT_PREFIXES` — new event names. | 3, 4, 5, 6 |
| `package.json` | `test:*` entries for the four new harnesses. | 3, 4, 5, 6 |

**Why `EMBED_DEBUG_EVENT_PREFIXES` matters:** `portal-*` sessions run through `src/app/tutor-portal/embed/page.tsx`, which drops any debug event whose type does not start with a listed prefix. A new event type that is not added there is **silently invisible in exactly the triage that would look for it** — this was caught on 2026-09-02 by the R54 coverage test. Add each new type as an exact full name.

---

### Task 1: The false-assertion regex reads `3x = 30` as `x = 30`

**Root cause (live, 1414.3s).** Student: *"Oh, right, you divide both sides by 3, so X is 10."* — correct. The brain composed **"Exactly. $3x = 30$ divided by $3$ gives $x = 10$."** — also correct. `checkFalseFinalAssertion` extracted `30`, compared it against the verified answer `10`, and killed the turn (`false_assertion_kill x=30 verified=10 (integer 30≠10)`). The retry dropped the verdict entirely and jumped to the next segment; 19.5s later Amisha said *"I don't know if I got that last question correct, so now I'm confused, bro."*

Two defects in one expression:
1. The left boundary `(?:^|[^a-zA-Z])` admits a **digit**, so a coefficient (`3x`) satisfies it.
2. `String.match` without `g` returns only the **first** match, so the genuine `x = 10` later in the same sentence is never examined.

**The existing regression test for this is a dead instrument.** `'Right — subtracting 7 gives 3x = 13.'` is labelled *"intermediate step (3x = 13, not bare x) → ok"* and passes — but **only because of its trailing period**, which the `(?![\d./])` lookahead rejects. Move the same step mid-sentence (`'… gives 3x = 13 on the left.'`) and the shipped regex matches `13`. The test never exercised the coefficient boundary it claims to cover. Step 1 below fixes the instrument before fixing the code.

**Files:**
- Modify: `apps/tutor/src/lib/tutor/voice/false-assertion-check.ts:78-92` (the `assertRe` construction and the `sentence.match` call)
- Test: `apps/tutor/scripts/test-false-assertion.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `checkFalseFinalAssertion` keeps its exact existing signature and `FalseAssertionResult` shape. Task 2 adds one optional field to its argument object; nothing else in this plan depends on Task 1.

- [ ] **Step 1: Add the failing tests (three of them) to `scripts/test-false-assertion.ts`**

Append these blocks immediately before the final `console.log(\`\n${passed} passed, ${failed} failed\`);` line. The first is the live incident; the second is the latent false kill the dead instrument hid; the third pins last-match selection.

```ts
// ─── portal-704e3e01 @1414.3s — the brain's sentence was CORRECT ───
// "Exactly. $3x = 30$ divided by $3$ gives $x = 10$." was killed as x=30.
// The coefficient satisfied the left boundary [^a-zA-Z]; non-global match
// meant the real terminal value ($x = 10$) was never reached.
{
  const r = checkFalseFinalAssertion({
    sentence: 'Exactly. $3x = 30$ divided by $3$ gives $x = 10$.',
    problemStatement: 'Solve for x: x/2 + 3 = x/5 + 6. What is x?',
    verifiedExpectedAnswer: '10',
  });
  check('portal-704e3e01: coefficient step 3x = 30 does not mask the true x = 10',
    r.verdict === 'ok', JSON.stringify(r));
}
// The same intermediate step the suite already claims to cover, moved off
// the end of the sentence so the trailing-period lookahead cannot save it.
{
  const r = checkFalseFinalAssertion({
    sentence: 'Right — subtracting 7 gives 3x = 13 on the left.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
  });
  check('mid-sentence intermediate step (3x = 13 …) → ok', r.verdict === 'ok', JSON.stringify(r));
}
// When a sentence asserts more than one value, the LAST one is the value
// the student takes away — judge that, not the working step before it.
{
  const r = checkFalseFinalAssertion({
    sentence: 'So 2x = 26, which means $x = 13$ exactly.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: '13',
    });
  check('multi-assertion sentence judges the LAST value (13, correct) → ok',
    r.verdict === 'ok', JSON.stringify(r));
}
```

- [ ] **Step 2: Run the suite to verify the three new checks fail**

Run: `cd apps/tutor && npm run test:false-assertion`
Expected: FAIL — 3 failed. The first reports `{"verdict":"false_assertion","asserted":"30",…}`, the second `"asserted":"13"`, the third `"asserted":"26"`. Every pre-existing check still passes.

- [ ] **Step 3: Fix the boundary and switch to last-match**

In `false-assertion-check.ts`, replace the `assertRe` block and the match that follows it:

```ts
  // Asserted equality for exactly the answer variable. The value capture is
  // compact — a signed number, decimal, plain fraction, or a \frac{}{}:
  // anything longer (an expression continuing with + / −) is a WORKING
  // step, not a final value, and must not be judged. (answerVar is a
  // letter plus optional primes — no regex-special characters to escape.)
  //
  // Left boundary excludes digits and '.' as well as letters (live,
  // portal-704e3e01 @1414.3s): with [^a-zA-Z] a COEFFICIENT satisfied it,
  // so "3x = 30" read as "x = 30" and killed the correct sentence
  // "Exactly. $3x = 30$ divided by $3$ gives $x = 10$." The suite's
  // "intermediate step" case only passed because its 3x = 13 sat at the
  // end of the sentence, where the trailing '.' trips the [\d./] lookahead.
  const esc = answerVar;
  const assertRe = new RegExp(
    `(?:^|[^a-zA-Z0-9.])\\$?${esc}\\$?\\s*(?:=|equals)\\s*\\$?` +
    `(-?\\d+(?:\\.\\d+)?(?:\\s*/\\s*-?\\d+(?:\\.\\d+)?)?|\\\\d?frac\\{-?\\d+\\}\\{-?\\d+\\})` +
    // No trailing digit/fraction continuation, and no arithmetic operator
    // after the value (with the whitespace INSIDE the lookahead — a `\s*`
    // before a negative lookahead backtracks to zero-width and defeats it).
    `\\$?(?![\\d./])(?!\\s*(?:[+*×·]|-\\s|\\\\cdot|\\\\times))`,
    'g',
  );
  // LAST assertion only. A turn that shows its work ("3x = 30 … gives
  // x = 10") asserts several values; the terminal one is what the student
  // takes away, and judging an earlier working step against the verified
  // FINAL answer is guaranteed to disagree. Requires the 'g' flag above.
  const all = [...sentence.matchAll(assertRe)];
  if (all.length === 0) return OK;
  const m = all[all.length - 1];
  const asserted = m[1].replace(/\\d?frac\{(-?\d+)\}\{(-?\d+)\}/, '$1/$2').replace(/\s+/g, '');
```

Also correct the module header's now-false claim. Replace the sentence *"students answer praised INTERMEDIATE sub-questions constantly … so comparing the STUDENT's utterance against the final answer would kill correct praise"* — keep it, but append after that paragraph:

```
 *  - Only the LAST asserted equality in the sentence is judged, and the
 *    variable must not be preceded by a digit or '.'. Both guard the
 *    tutor's own working steps: "3x = 30 … gives x = 10" asserts two
 *    values and only the second is the answer (portal-704e3e01).
```

- [ ] **Step 4: Run the suite to verify everything passes**

Run: `cd apps/tutor && npm run test:false-assertion`
Expected: PASS — `0 failed`. All pre-existing checks (including `x = 11` vs `13/3` firing, `\frac{13}{3}` passing, hypothetical framing, different-variable) must still hold; if any pre-existing check flipped, the boundary change was too broad — stop and re-read.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/voice/false-assertion-check.ts apps/tutor/scripts/test-false-assertion.ts
git commit -m "fix(tutor): false-assertion guard read a coefficient step as the final answer

portal-704e3e01 @1414.3s killed the correct sentence \"Exactly. \$3x = 30\$
divided by \$3\$ gives \$x = 10\$\" as x=30. The left boundary [^a-zA-Z]
admitted a digit, and the non-global match never reached the real x = 10.
The suite's 'intermediate step' case passed only on its trailing period.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

### Task 2: On an MCQ card the guard compares a number against a letter

**Root cause (live, 1113.7s).** The live card was `showProblem-4`, `format: "multiple-choice"`, choices `A: "x = 4.5"`, `B: "x = 18"`, `C: "x = 9"`, `D: "x = -9"`, verified expected answer = the bare letter `"C"`. Amisha said *"Okay, the X is 9, so C."* The brain composed **"Exactly. $x = 9$ — that's choice *C*."** `checkFalseFinalAssertion` calls the matcher as

```ts
matchUtteranceToAnswer(asserted, verified, undefined, { monetary: … })
//                                        ^^^^^^^^^ choices
```

so the MCQ branch at `utterance-answer-match.ts:311` (`if (choices && choices.length > 0)`) is skipped, `"9"` falls through to the expression path and disagrees with `"C"`. This fires for **every** correct numeric assertion on **every** MCQ card. Task 1 does not fix it — the boundary there is `$`, so the regex still (correctly) extracts `9`.

Supplying the choices routes it to `resolveMcqLetter`, which resolves the expected side (`"C"` → `C`) but not a bare `"9"` against letter-only choice objects, so the matcher returns `{ verdict: 'unknown', reason: 'mcq: utterance unresolvable' }` — and `unknown` never kills. That is the correct outcome: with only choice *letters* in `currentProblemRef`, the guard genuinely cannot compare a number to a letter, and refusing to answer beats guessing.

**Deliberate non-goal:** carrying the choice *texts* into `currentProblemRef` would turn `unknown` into a positive `agree` and restore kill coverage on MCQ cards. That is a ref-shape change touching four write sites (`VoiceTutorRealtime.tsx:5714, 5755, 8412, 8426`) and both other consumers of `choiceLetters`; it is a separate round. Note it in the handoff.

**Files:**
- Modify: `apps/tutor/src/lib/tutor/voice/false-assertion-check.ts` (add optional `choices` to the args interface and pass it through)
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx:10871-10877` (the `checkFalseFinalAssertion` call)
- Test: `apps/tutor/scripts/test-false-assertion.ts`

**Interfaces:**
- Consumes: `checkFalseFinalAssertion` from Task 1 (unchanged behaviour).
- Produces: `checkFalseFinalAssertion` args gain `choices?: Array<{ letter: string; text: string }>`. Optional — every existing caller and test keeps compiling unchanged.

- [ ] **Step 1: Add the failing tests**

Append to `scripts/test-false-assertion.ts`, before the final summary line:

```ts
// ─── portal-704e3e01 @1113.7s — MCQ card, verified answer is a LETTER ───
// showProblem-4: choices A "x = 4.5" · B "x = 18" · C "x = 9" · D "x = -9",
// verified "C". The brain said "Exactly. $x = 9$ — that's choice *C*."
const MCQ_STATEMENT = 'Solve for $x$: $4(x - 3) = 2x + 6$. What is x?';
const MCQ_CHOICES = ['A', 'B', 'C', 'D'].map((l) => ({ letter: l, text: l }));
{
  const r = checkFalseFinalAssertion({
    sentence: "Exactly. $x = 9$ — that's choice *C*.",
    problemStatement: MCQ_STATEMENT,
    verifiedExpectedAnswer: 'C',
    choices: MCQ_CHOICES,
  });
  check('portal-704e3e01: numeric assertion vs MCQ letter answer → ok (never kill)',
    r.verdict === 'ok', JSON.stringify(r));
}
{
  // Same card, and the tutor asserts a value that is NOT choice C. With
  // letters-only choices the guard still cannot resolve "18" to a letter,
  // so it must stay silent rather than guess. Documents the coverage cost.
  const r = checkFalseFinalAssertion({
    sentence: 'Right, $x = 18$ — choice B.',
    problemStatement: MCQ_STATEMENT,
    verifiedExpectedAnswer: 'C',
    choices: MCQ_CHOICES,
  });
  check('MCQ coverage cost is explicit: wrong numeric assertion also → ok',
    r.verdict === 'ok', JSON.stringify(r));
}
{
  // Safety net inside the module: even with NO choices supplied, a bare
  // single-letter verified answer can never be compared to a number.
  const r = checkFalseFinalAssertion({
    sentence: "Exactly. $x = 9$ — that's choice *C*.",
    problemStatement: MCQ_STATEMENT,
    verifiedExpectedAnswer: 'C',
  });
  check('bare single-letter verified answer, no choices → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  // Non-MCQ behaviour is untouched: a numeric verified answer still kills.
  const r = checkFalseFinalAssertion({
    sentence: 'Right. Dividing both sides by 3 gives $x = 11$.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
    choices: undefined,
  });
  check('numeric verified answer still fires with choices undefined',
    r.verdict === 'false_assertion', JSON.stringify(r));
}
```

- [ ] **Step 2: Run the suite to verify the new checks fail**

Run: `cd apps/tutor && npm run test:false-assertion`
Expected: FAIL — the first three new checks fail (the module does not yet accept `choices`, so TypeScript errors first: `Object literal may only specify known properties, and 'choices' does not exist`). That compile error IS the red state; do not work around it.

- [ ] **Step 3: Thread `choices` through the pure module**

In `false-assertion-check.ts`, add the field to the args interface and the single-letter safety net, then pass it to the matcher:

```ts
export function checkFalseFinalAssertion(args: {
  /** One streamed sentence of the tutor's turn. */
  sentence: string;
  /** The live problem's statement (currentProblemRef.statement). */
  problemStatement?: string;
  /** VERIFIED tier only — see the header. */
  verifiedExpectedAnswer?: string;
  /** R49 currency reconciliation, mirrored from inverse-verdict-check. */
  spokenMoneyEnabled?: boolean;
  /** Live MCQ choices, same shape the praise-echo check builds. Without
   *  these, a verified answer that is a choice LETTER is compared against
   *  the tutor's numeric assertion and always disagrees — portal-704e3e01
   *  @1113.7s killed "Exactly. $x = 9$ — that's choice *C*." on a card
   *  whose verified answer was the string "C". */
  choices?: Array<{ letter: string; text: string }>;
}): FalseAssertionResult {
  const verified = (args.verifiedExpectedAnswer ?? '').trim();
  if (!verified) return OK;
  // Safety net independent of the caller: a bare single letter is an MCQ
  // key, and the value this module extracts is always numeric — there is
  // no comparison to make, so never claim one. Belt-and-braces with the
  // `choices` passthrough below.
  if (/^[A-Za-z]$/.test(verified)) return OK;
```

…and at the comparison:

```ts
  const cmp = matchUtteranceToAnswer(asserted, verified, args.choices, {
    monetary: args.spokenMoneyEnabled === true,
  });
```

- [ ] **Step 4: Run the suite to verify it passes**

Run: `cd apps/tutor && npm run test:false-assertion`
Expected: PASS — `0 failed`, including every Task 1 check and every original check.

- [ ] **Step 5: Wire the live choices in at the call site**

In `VoiceTutorRealtime.tsx`, the `checkFalseFinalAssertion` call currently reads:

```ts
                    const fa = checkFalseFinalAssertion({
                      sentence: updatedSentence,
                      problemStatement: currentProblemRef.current?.statement,
                      verifiedExpectedAnswer: currentProblemRef.current?.expectedAnswer,
                      spokenMoneyEnabled: TUTOR_SPOKEN_MONEY,
                    });
```

Replace with — note this is the exact `echoChoices` idiom already used ~40 lines below at the praise-echo site, including the `choiceLetters?.length` check that keeps an empty array from becoming `[]`:

```ts
                    // Live MCQ choices, same construction as the praise-echo
                    // and inverse-verdict sites below. Without them, an MCQ
                    // card whose verified answer is the letter "C" made every
                    // correct numeric assertion disagree — portal-704e3e01
                    // @1113.7s killed "Exactly. $x = 9$ — that's choice *C*."
                    const faChoices = currentProblemRef.current?.hasChoices && currentProblemRef.current.choiceLetters?.length
                      ? currentProblemRef.current.choiceLetters.map((l) => ({ letter: l, text: l }))
                      : undefined;
                    const fa = checkFalseFinalAssertion({
                      sentence: updatedSentence,
                      problemStatement: currentProblemRef.current?.statement,
                      verifiedExpectedAnswer: currentProblemRef.current?.expectedAnswer,
                      spokenMoneyEnabled: TUTOR_SPOKEN_MONEY,
                      choices: faChoices,
                    });
```

- [ ] **Step 6: Typecheck**

Run: `cd apps/tutor && npx tsc --noEmit`
Expected: clean. (`tsc --noEmit` does not cover `scripts/`; the harnesses are exercised by running them.)

- [ ] **Step 7: Commit**

```bash
git add apps/tutor/src/lib/tutor/voice/false-assertion-check.ts \
        apps/tutor/scripts/test-false-assertion.ts \
        apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx
git commit -m "fix(tutor): false-assertion guard compared a number to an MCQ letter

portal-704e3e01 @1113.7s: card showProblem-4 verified answer is the letter
\"C\"; the guard called matchUtteranceToAnswer with choices undefined, so
\"9\" fell through the MCQ branch and disagreed with \"C\", killing the
correct \"Exactly. \$x = 9\$ — that's choice *C*.\" Pass the live choices
(same idiom as the praise-echo site) and refuse a bare-letter comparison.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

### Task 3: A kill that removes the verdict must not leave the student with no verdict

**Root cause (live, both incidents).** The rejection text handed back to the brain reads *"…never state `x = N` again."* When `N` was in fact correct, the model has no safe way to grade the answer, so it drops the verdict entirely. Both retries opened on the **next** segment's content:

```
student="Oh, right, you divide both sides by 3, so X is 10."
  → "Exactly. $3x = 30$ divided by $3$ gives $x = 10$. …"          [KILLED]
student="[validator feedback — not from the student] …"
  → "The mistake here is treating $10 - 2$ as if it happens first…" [AIRED]
```

Tasks 1 and 2 stop these two kills. This task is the backstop for the next one: a genuinely-justified false-assertion kill must still return a verdict on what the student said. It is the reason Amisha's next line was *"I don't know if I got that last question correct."*

**Files:**
- Create: `apps/tutor/src/lib/tutor/voice/verdict-preservation.ts`
- Create: `apps/tutor/scripts/test-verdict-preservation.ts`
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts` (append after the `TUTOR_FA_STALE_ANCHOR_DOWNGRADE` block, ~line 110)
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (the false-assertion kill branch, ~10886-10897)
- Modify: `apps/tutor/src/app/tutor-portal/embed/page.tsx` (`EMBED_DEBUG_EVENT_PREFIXES`)
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: `checkFalseFinalAssertion` (Tasks 1-2), unchanged.
- Produces: `export function hasVerdictOpener(text: string): boolean` and `export const VERDICT_REPLANT_CLAUSE: string`. Nothing later in this plan depends on them.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-verdict-preservation.ts`:

```ts
/**
 * portal-704e3e01: a false-assertion kill removed the turn's verdict and the
 * retry never restored one. The student asked, in the session, whether she
 * had got the previous question right.
 *
 * Usage: npx tsx scripts/test-verdict-preservation.ts  (npm run test:verdict-preservation)
 */
import { hasVerdictOpener, VERDICT_REPLANT_CLAUSE } from '../src/lib/tutor/voice/verdict-preservation';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── verdict openers, verbatim from the killed turns ───
check('killed turn 1414.3s opened with a verdict',
  hasVerdictOpener('Exactly. $3x = 30$ divided by $3$ gives $x = 10$.'));
check('killed turn 1113.7s opened with a verdict',
  hasVerdictOpener("Exactly. $x = 9$ — that's choice *C*."));
check('"Right —" opener', hasVerdictOpener('Right — that\'s exactly the connection.'));
check('"Not quite" is also a verdict', hasVerdictOpener('Not quite. Look at your number line.'));
check('"Correct." opener', hasVerdictOpener('Correct. Now divide both sides.'));

// ─── the retries that replaced them had none ───
check('aired retry 1430.1s had NO verdict',
  !hasVerdictOpener('The mistake here is treating $10 - 2$ as if it happens first.'));
check('aired retry 1116.4s had NO verdict',
  !hasVerdictOpener("Let's try that negative-sign trap fresh. Here's one for you — take a look."));
check('a plain question has no verdict',
  !hasVerdictOpener('What does $4(x+3)$ expand to?'));
check('a wait acknowledgement has no verdict',
  !hasVerdictOpener('Take your time — no rush.'));

// ─── mid-turn verdicts count; only the opening two sentences are scanned ───
check('verdict in sentence two still counts',
  hasVerdictOpener('Okay, one moment. Right — that lands on 10.'));
check('a verdict word buried far downstream does not',
  !hasVerdictOpener('Look at the board. There are two pieces here. Now combine them. Right.'));

// ─── the replant clause is generic (no subject content, no numbers) ───
check('replant clause carries no digits', !/\d/.test(VERDICT_REPLANT_CLAUSE));
check('replant clause is non-empty', VERDICT_REPLANT_CLAUSE.length > 40);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Register the script and run it to verify it fails**

Add to `apps/tutor/package.json` `"scripts"`, next to `"test:false-assertion"`:

```json
    "test:verdict-preservation": "npx tsx scripts/test-verdict-preservation.ts",
```

Run: `cd apps/tutor && npm run test:verdict-preservation`
Expected: FAIL — `Cannot find module '../src/lib/tutor/voice/verdict-preservation'`.

- [ ] **Step 3: Write the pure module**

Create `apps/tutor/src/lib/tutor/voice/verdict-preservation.ts`:

```ts
/**
 * portal-704e3e01 (2026-09-04): the false-assertion guard killed two turns
 * that had correctly graded the student, and both retries came back with no
 * verdict at all. The rejection text tells the brain "never state x = N
 * again"; when N was in fact right, the model has nothing safe to say about
 * the answer, so it drops the grading and opens on the next segment. The
 * student's own words 20s later: "I don't know if I got that last question
 * correct, so now I'm confused."
 *
 * This module decides, purely, whether a retry has silently dropped the
 * verdict the killed attempt was carrying. Generic — verdict words only, no
 * subject content, no numbers.
 *
 * Pure module — no side effects, never throws.
 */

/** Praise- and denial-class openers. Kept deliberately small: these are the
 *  words the system prompt tells the brain to open a graded turn with. */
const VERDICT_WORD_RE =
  /\b(?:exactly|right|correct|precisely|spot on|that'?s it|nice work|good job|not quite|not really|almost|close|that'?s not|incorrect|nope)\b/i;

/** Only the opening TWO sentences are scanned — the same window the
 *  verdict-hold and praise-contradiction detectors use. A verdict word
 *  further downstream is prose ("Right, so next…"), not a grading. */
const OPENING_SENTENCES = 2;

function firstSentences(text: string, n: number): string {
  const parts = (text ?? '').split(/(?<=[.!?])\s+/);
  return parts.slice(0, n).join(' ');
}

export function hasVerdictOpener(text: string): boolean {
  return VERDICT_WORD_RE.test(firstSentences(text, OPENING_SENTENCES));
}

/** Appended to a false-assertion rejection so the retry cannot answer by
 *  simply saying nothing about the student's answer. Generic by design — it
 *  names no value, so it can never coach the brain toward a wrong one. */
export const VERDICT_REPLANT_CLAUSE =
  ' Your previous attempt graded the student\'s answer and that grading was cut before they heard it. '
  + 'Your re-delivery MUST still open by telling the student whether their answer was right or wrong — '
  + 're-derive the value first if you need to, but do not move on to new content without grading what they said.';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run test:verdict-preservation`
Expected: PASS — `0 failed`.

- [ ] **Step 5: Add the flag**

In `apps/tutor/src/lib/tutor/orchestrator/flags.ts`, append immediately after the `TUTOR_FA_STALE_ANCHOR_DOWNGRADE` export (~line 110):

```ts
/** portal-704e3e01 (2026-09-04): a false-assertion KILL removed the turn's
 *  verdict and the retry restored none — the student asked out loud whether
 *  she had got the previous question right. Appends a replant clause to the
 *  false-assertion rejection so the re-delivery still grades the answer.
 *  Default ON; NEXT_PUBLIC_TUTOR_VERDICT_REPLANT_ON_KILL=off is the switch. */
export const TUTOR_VERDICT_REPLANT_ON_KILL =
  process.env.NEXT_PUBLIC_TUTOR_VERDICT_REPLANT_ON_KILL !== 'off';
```

- [ ] **Step 6: Wire it into the false-assertion kill branch**

In `VoiceTutorRealtime.tsx`, add `TUTOR_VERDICT_REPLANT_ON_KILL` to the existing `orchestrator/flags` import and `hasVerdictOpener, VERDICT_REPLANT_CLAUSE` to the voice imports, then in the `else` branch of the false-assertion check replace the `reason` construction:

```ts
                      } else {
                        // Verdict preservation (portal-704e3e01): if this
                        // attempt had already graded the student, tell the
                        // retry it must grade again. Without this the retry
                        // answers the rejection by saying nothing about the
                        // student's answer at all and opening on new content.
                        const killedTextSoFar = (attemptText ? attemptText + ' ' : '') + updatedSentence;
                        const carriedVerdict = TUTOR_VERDICT_REPLANT_ON_KILL && hasVerdictOpener(killedTextSoFar);
                        const reason =
                          `You asserted ${fa.answerVar} = ${fa.asserted}, but the verified answer for the active problem is ${fa.expected}. ` +
                          `Re-derive the value step by step and re-deliver the turn with the correct final value — never state ${fa.answerVar} = ${fa.asserted} again.`
                          + (carriedVerdict ? VERDICT_REPLANT_CLAUSE : '');
                        rejectionsThisAttempt.push({ action: 'false_final_assertion', reason });
                        judgeRetriesUsed++;
                        await performKill();
                        console.warn(`[brain-orchestrator] false-assertion check: asserted ${fa.answerVar}=${fa.asserted} vs verified ${fa.expected} — kill + retry`);
                        onDebugEvent?.('false_assertion_kill', `${fa.answerVar}=${fa.asserted} verified=${fa.expected?.slice(0, 40)} (${fa.matchReason})`);
                        if (carriedVerdict) onDebugEvent?.('verdict_replant_requested', `${fa.answerVar}=${fa.asserted}`);
                        continue;
                      }
```

- [ ] **Step 7: Register the new debug event for embed persistence**

In `apps/tutor/src/app/tutor-portal/embed/page.tsx`, add `'verdict_replant_requested'` to `EMBED_DEBUG_EVENT_PREFIXES` as an exact full name, on the same line group as `'false_assertion_kill'`.

- [ ] **Step 8: Typecheck and commit**

Run: `cd apps/tutor && npx tsc --noEmit` — expected clean.

```bash
git add apps/tutor/src/lib/tutor/voice/verdict-preservation.ts \
        apps/tutor/scripts/test-verdict-preservation.ts \
        apps/tutor/src/lib/tutor/orchestrator/flags.ts \
        apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx \
        apps/tutor/src/app/tutor-portal/embed/page.tsx \
        apps/tutor/package.json
git commit -m "feat(tutor): a false-assertion kill must not drop the student's verdict

portal-704e3e01: both kills removed a correct grading and both retries
opened on the next segment instead of re-grading. Flag
TUTOR_VERDICT_REPLANT_ON_KILL (default ON).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

### Task 4: Internal `<result>` scaffolding was spoken to the student

**Root cause (live, 1027.9s).** The tutor said, aloud and into the persisted transcript:

```
<result>0=0, same as before — infinitely many again, so this is actually
the true-statement twin, not the false one. Let me build a genuinely
different one for variety.</result> That one came back as a regular solve…
```

The meta-narration filter (`VoiceTutorRealtime.tsx:11197`) matches **content phrases** — `the student`, `the active problem`, `let me mark`, … — and never structure. It fired correctly twice in this same session (443.2s, 1254.7s) but only because those blocks happened to contain one of those phrases; this one contained none. The filter's own comment states that dropping removes the sentence from TTS *and* transcript, so its presence in the transcript proves it was never dropped. The turn was a validator retry (confirmed in `brain.stream`: `student="[validator feedback — not from the student] …" → text="<result>0=0, same as before…"`), so Task 5 reduces how often the brain is in this state, but does not close the hole.

**Files:**
- Create: `apps/tutor/src/lib/tutor/voice/meta-narration.ts`
- Create: `apps/tutor/scripts/test-meta-narration.ts`
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx:11197-11214`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: `export function isMetaNarration(sentence: string, opts?: { structural?: boolean }): boolean`. Not consumed by later tasks.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-meta-narration.ts`:

```ts
/**
 * The meta-narration filter drops brain sentences that leak internal
 * reasoning. portal-704e3e01 @1027.9s spoke a whole <result>…</result>
 * block aloud because the filter matched content phrases only.
 *
 * Usage: npx tsx scripts/test-meta-narration.ts  (npm run test:meta-narration)
 */
import { isMetaNarration } from '../src/lib/tutor/voice/meta-narration';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── the pre-existing phrase behaviour, pinned before it moved ───
check('"The student already solved this one."', isMetaNarration('The student already solved this one.'));
check('"Let me check — the active problem is …"', isMetaNarration('Let me check — the active problem is the dataset.'));
check('"Let me mark this segment complete."', isMetaNarration('Let me mark this segment complete.'));
check('"Since the student answered, …"', isMetaNarration('Since the student answered, we advance.'));
check('"that\'s a greenlight to advance"', isMetaNarration("That's a greenlight to advance."));
check('tool_result leak', isMetaNarration('The tool_result came back empty.'));

// ─── structural leaks: the portal-704e3e01 class ───
check('portal-704e3e01 @1027.9s <result> block',
  isMetaNarration('<result>0=0, same as before — infinitely many again, so this is actually the true-statement twin, not the false one.</result>'));
check('closing tag alone', isMetaNarration('different one for variety.</result>'));
check('<span style="opacity:0"> variant (443.2s)',
  isMetaNarration('<span style="opacity:0">verdict: request, not an answer — no praise</span>'));
check('<thinking> leak', isMetaNarration('<thinking>she is stuck on denominators</thinking>'));

// ─── real teaching speech must survive ───
check('plain math sentence survives',
  !isMetaNarration('Distribute the $4$ across both terms inside those parentheses.'));
check('inequality is not markup', !isMetaNarration('So $x < 5$ and $y > 2$ together.'));
check('spoken comparison is not markup', !isMetaNarration('That means 3 < 10, which is true.'));
check('a verdict survives', !isMetaNarration('Exactly. $x = 10$ — nice work.'));
check('LaTeX survives', !isMetaNarration('Look at $\\frac{x}{2} + 3 = \\frac{x}{5} + 6$ on the board.'));

// ─── the structural rule is separable (kill switch behaviour) ───
check('structural:false leaves <result> alone',
  !isMetaNarration('<result>0=0, same as before.</result>', { structural: false }));
check('structural:false still drops phrase leaks',
  isMetaNarration('The student already solved this one.', { structural: false }));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Register and run to verify it fails**

Add to `apps/tutor/package.json`:

```json
    "test:meta-narration": "npx tsx scripts/test-meta-narration.ts",
```

Run: `cd apps/tutor && npm run test:meta-narration`
Expected: FAIL — `Cannot find module '../src/lib/tutor/voice/meta-narration'`.

- [ ] **Step 3: Write the pure module**

Create `apps/tutor/src/lib/tutor/voice/meta-narration.ts`. The two phrase regexes are moved **verbatim** from `VoiceTutorRealtime.tsx:11197-11200` — do not retype them from memory, copy them:

```ts
/**
 * Round-7++ meta-narration filter, extracted from the brain orchestrator so
 * it can be tested directly.
 *
 * The system prompt already forbids speaking internal reasoning, but the
 * brain leaks it regularly; orchestrator-side filtering is the safety net.
 *
 * TWO rules, and the second is why this module exists. The phrase rule
 * (moved verbatim) matches known leak wordings. The STRUCTURAL rule matches
 * XML/HTML-ish markup in a spoken sentence: portal-704e3e01 @1027.9s spoke a
 * whole `<result>…</result>` block to the student because it contained none
 * of the phrases — the filter had no notion that markup is never speech.
 * Structure is the durable signal; phrase lists only ever catch the leaks
 * someone already saw.
 *
 * Generic patterns only — no subject content.
 *
 * Pure module — no side effects, never throws.
 */

const PHRASE_START_RE =
  /^\s*(?:the student\b|the active problem\b|let me mark\b|since the student\b|the runtime\b|the system\b|that'?s? a greenlight\b|re-?checking my\b)/i;

const PHRASE_ANYWHERE_RE =
  /\bactive problem\b|\bgreenlight to advance\b|\bmark (?:it|this|the)? *(?:segment )?complete\b|\b(?:current|active) *segment\s*[Ii][Dd]?\b|\bcanonicaltext\b|\btool[_ ]result\b/i;

/** A tag-shaped run: '<' + a letter or '/', a tag name, then '>'. Requires
 *  BOTH delimiters, so spoken inequalities ("3 < 10", "$x < 5$ and $y > 2$")
 *  cannot match — there is no tag name between them. LaTeX is unaffected:
 *  '\frac{...}' carries no angle brackets at all. */
const MARKUP_RE = /<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s[^<>]*)?>/;

export function isMetaNarration(
  sentence: string,
  opts?: { structural?: boolean },
): boolean {
  const s = sentence ?? '';
  if (PHRASE_START_RE.test(s) || PHRASE_ANYWHERE_RE.test(s)) return true;
  if (opts?.structural === false) return false;
  return MARKUP_RE.test(s);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run test:meta-narration`
Expected: PASS — `0 failed`.

- [ ] **Step 5: Add the flag**

In `orchestrator/flags.ts`, after the Task 3 flag:

```ts
/** portal-704e3e01 (2026-09-04) @1027.9s: the brain spoke a whole
 *  <result>…</result> block aloud. The meta-narration filter matched content
 *  phrases only, so markup with no known phrase in it went to TTS and the
 *  transcript. Adds a structural markup rule alongside the phrase list.
 *  Default ON; NEXT_PUBLIC_TUTOR_META_NARRATION_STRUCTURAL=off is the switch. */
export const TUTOR_META_NARRATION_STRUCTURAL =
  process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_STRUCTURAL !== 'off';
```

- [ ] **Step 6: Replace the inline filter with the module**

In `VoiceTutorRealtime.tsx`, keep the existing comment block above the filter (it carries the 2026-05-03 provenance) and add a sentence about the structural rule, then replace lines 11197-11214's `metaNarrationRe` construction and its `if` with:

```ts
                  const metaNarrationRe = isMetaNarration(updatedSentence, {
                    structural: TUTOR_META_NARRATION_STRUCTURAL,
                  });
                  if (metaNarrationRe) {
                    console.warn('[brain-orchestrator] dropped meta-narration sentence:', JSON.stringify(updatedSentence.slice(0, 100)));
                    onDebugEvent?.('meta_narration_dropped', updatedSentence.slice(0, 80));
                    continue;
                  }
```

Add `isMetaNarration` to the voice imports and `TUTOR_META_NARRATION_STRUCTURAL` to the flags import. The debug event name is unchanged, so no `EMBED_DEBUG_EVENT_PREFIXES` edit is needed for this task.

- [ ] **Step 7: Typecheck and commit**

Run: `cd apps/tutor && npx tsc --noEmit` — expected clean.

```bash
git add apps/tutor/src/lib/tutor/voice/meta-narration.ts \
        apps/tutor/scripts/test-meta-narration.ts \
        apps/tutor/src/lib/tutor/orchestrator/flags.ts \
        apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx \
        apps/tutor/package.json
git commit -m "fix(tutor): drop markup sentences, not just known meta phrases

portal-704e3e01 @1027.9s spoke a whole <result>…</result> block aloud: the
filter matched content phrases and that block contained none. Extract to a
pure module and add a structural markup rule. Flag
TUTOR_META_NARRATION_STRUCTURAL (default ON).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

### Task 5: `show_problem` is substituted into segment cards that are already spent

**Root cause (live, twice).** The substitution at `VoiceTutorRealtime.tsx:12180` rewrites the brain's `show_problem` into `show_segment_card({ segmentId })` whenever the targets match. Twice in this session the card it substituted to was one the orchestrator then rejected 50 lines later:

```
1021.1  show_problem_substituted        → show_segment_card("try-classify")
1021.1  render_dropped                  showProblem — duplicate of showProblem-3
1021.1  dedup_surfaced_as_rejection     show_segment_card → try-classify
1024.7  brain_validator_retry           "THE STUDENT JUST ASKED FOR A NEW PROBLEM"

1111.7  show_problem_substituted        → show_segment_card("try-numeric")
1111.7  show_segment_card_completed_blocked  try-numeric
1113.7  brain_validator_retry           "Segment try-numeric is already marked COMPLETE"
```

Both are self-inflicted: the orchestrator overrode the brain's own correct choice, then killed the turn for the override. Each cost ~10s of dead air and a full re-request at ~20K input tokens — and the 1021.1 retry is the turn that leaked the `<result>` block in Task 4. Amisha had asked, in her own words: *"Now let's see uh let's see it let's see a different one."*

Two conditions must block the substitution, and both use signals this file already has:
- `completedSegmentIdsRef.current.has(segId)` — the exact set the `show_segment_card_completed_blocked` branch at line 12233 checks. Substituting into it guarantees a kill.
- `detectAnotherProblemRequest(lastStudentText)` — the pure detector already imported and used at line 12631. If the student just asked for a different problem, the brain's free-form `show_problem` *is* the right response.

**Files:**
- Create: `apps/tutor/src/lib/tutor/orchestrator/show-problem-substitution.ts`
- Create: `apps/tutor/scripts/test-show-problem-substitution.ts`
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx:12180-12186`
- Modify: `apps/tutor/src/app/tutor-portal/embed/page.tsx`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `export function shouldSubstituteShowProblem(args: { targetsDiverge: boolean; newPageInTurn: boolean; generateProblemInTurn: boolean; segmentComplete: boolean; studentAskedForAnother: boolean }): { substitute: boolean; skipReason?: 'targets-diverge' | 'new-page-in-turn' | 'generate-problem-in-turn' | 'segment-complete' | 'student-asked-for-another' }`.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-show-problem-substitution.ts`:

```ts
/**
 * portal-704e3e01: the show_problem → show_segment_card substitution twice
 * chose a card the orchestrator then rejected, turning the brain's correct
 * tool choice into a self-inflicted validator retry.
 *
 * Usage: npx tsx scripts/test-show-problem-substitution.ts  (npm run test:show-problem-substitution)
 */
import { shouldSubstituteShowProblem } from '../src/lib/tutor/orchestrator/show-problem-substitution';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const BASE = {
  targetsDiverge: false,
  newPageInTurn: false,
  generateProblemInTurn: false,
  segmentComplete: false,
  studentAskedForAnother: false,
};

// ─── the behaviour that must not change ───
{
  const r = shouldSubstituteShowProblem({ ...BASE });
  check('plain matching-target case still substitutes', r.substitute === true, JSON.stringify(r));
}
{
  const r = shouldSubstituteShowProblem({ ...BASE, targetsDiverge: true });
  check('diverging targets never substitute', r.substitute === false && r.skipReason === 'targets-diverge', JSON.stringify(r));
}
{
  const r = shouldSubstituteShowProblem({ ...BASE, newPageInTurn: true });
  check('new_page in turn = fresh context, no substitute',
    r.substitute === false && r.skipReason === 'new-page-in-turn', JSON.stringify(r));
}
{
  const r = shouldSubstituteShowProblem({ ...BASE, generateProblemInTurn: true });
  check('generate_problem in turn, no substitute',
    r.substitute === false && r.skipReason === 'generate-problem-in-turn', JSON.stringify(r));
}

// ─── portal-704e3e01 @1111.7s ───
{
  const r = shouldSubstituteShowProblem({ ...BASE, segmentComplete: true });
  check('completed segment is never substituted into (would be killed anyway)',
    r.substitute === false && r.skipReason === 'segment-complete', JSON.stringify(r));
}

// ─── portal-704e3e01 @1021.1s ───
{
  const r = shouldSubstituteShowProblem({ ...BASE, studentAskedForAnother: true });
  check('student asked for a different problem — the brain\'s own card stands',
    r.substitute === false && r.skipReason === 'student-asked-for-another', JSON.stringify(r));
}

// ─── precedence: the pre-existing reasons still win, so telemetry stays stable ───
{
  const r = shouldSubstituteShowProblem({ ...BASE, targetsDiverge: true, segmentComplete: true });
  check('targets-diverge outranks segment-complete', r.skipReason === 'targets-diverge', JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Register and run to verify it fails**

Add to `apps/tutor/package.json`:

```json
    "test:show-problem-substitution": "npx tsx scripts/test-show-problem-substitution.ts",
```

Run: `cd apps/tutor && npm run test:show-problem-substitution`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the pure module**

Create `apps/tutor/src/lib/tutor/orchestrator/show-problem-substitution.ts`:

```ts
/**
 * Should a brain-emitted show_problem be rewritten into the current
 * segment's authored show_segment_card?
 *
 * The substitution exists so the brain cannot drift from the authored
 * script. portal-704e3e01 (2026-09-04) showed its two failure modes, both of
 * which end in the orchestrator killing the turn for its own override:
 *
 *   @1111.7s  substituted into a segment already marked COMPLETE, which the
 *             show_segment_card branch then blocks by design.
 *   @1021.1s  substituted while the student had just asked for a DIFFERENT
 *             problem ("let's see a different one"), so the authored card
 *             deduped against what was already on the board.
 *
 * Pure decision — no side effects, never throws. The two pre-existing skip
 * reasons are evaluated first so existing telemetry keeps its meaning.
 */
export type SubstitutionSkipReason =
  | 'targets-diverge'
  | 'new-page-in-turn'
  | 'generate-problem-in-turn'
  | 'segment-complete'
  | 'student-asked-for-another';

export interface SubstitutionDecision {
  substitute: boolean;
  skipReason?: SubstitutionSkipReason;
}

export function shouldSubstituteShowProblem(args: {
  /** Brain's target word disagrees with the authored one — handled upstream. */
  targetsDiverge: boolean;
  /** new_page in this turn signals a deliberate fresh-context render. */
  newPageInTurn: boolean;
  /** generate_problem in this turn means the brain is building a new one. */
  generateProblemInTurn: boolean;
  /** Segment is in completedSegmentIdsRef — show_segment_card would be blocked. */
  segmentComplete: boolean;
  /** detectAnotherProblemRequest() on the latest student turn. */
  studentAskedForAnother: boolean;
}): SubstitutionDecision {
  if (args.targetsDiverge) return { substitute: false, skipReason: 'targets-diverge' };
  if (args.newPageInTurn) return { substitute: false, skipReason: 'new-page-in-turn' };
  if (args.generateProblemInTurn) return { substitute: false, skipReason: 'generate-problem-in-turn' };
  if (args.segmentComplete) return { substitute: false, skipReason: 'segment-complete' };
  if (args.studentAskedForAnother) return { substitute: false, skipReason: 'student-asked-for-another' };
  return { substitute: true };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run test:show-problem-substitution`
Expected: PASS — `0 failed`.

- [ ] **Step 5: Add the flag**

In `orchestrator/flags.ts`, after the Task 4 flag:

```ts
/** portal-704e3e01 (2026-09-04): the show_problem → show_segment_card
 *  substitution twice chose a card the orchestrator then rejected — a
 *  COMPLETE segment @1111.7s, and a card already on the board while the
 *  student had asked for a different problem @1021.1s. Both became
 *  self-inflicted validator retries. Gates the substitution on those two.
 *  Default ON; NEXT_PUBLIC_TUTOR_SUBSTITUTE_GATE=off is the switch. */
export const TUTOR_SUBSTITUTE_GATE =
  process.env.NEXT_PUBLIC_TUTOR_SUBSTITUTE_GATE !== 'off';
```

- [ ] **Step 6: Wire it in**

In `VoiceTutorRealtime.tsx`, replace the substitute-path `if`/`else if` at ~12180 with:

```ts
                        // Substitution gate (portal-704e3e01). The two
                        // pre-existing conditions are unchanged; the gate adds
                        // the two cases where substituting guarantees the
                        // orchestrator will kill its own override.
                        const lastStudentTextForSub = ([...transcriptRef.current]
                          .reverse()
                          .find((e) => e.role === 'student')?.text ?? '');
                        const subDecision = shouldSubstituteShowProblem({
                          targetsDiverge,
                          newPageInTurn,
                          generateProblemInTurn,
                          segmentComplete: TUTOR_SUBSTITUTE_GATE && !!segId && completedSegmentIdsRef.current.has(segId),
                          studentAskedForAnother: TUTOR_SUBSTITUTE_GATE && detectAnotherProblemRequest(lastStudentTextForSub),
                        });
                        if (subDecision.substitute) {
                          console.log(`[brain-orchestrator] auto-substitute show_problem → show_segment_card for segment "${segId}" (authored truth exists)`);
                          onDebugEvent?.('show_problem_substituted', `→ show_segment_card("${segId}")`);
                          name = 'show_segment_card';
                          args = { segmentId: segId };
                        } else if (subDecision.skipReason === 'new-page-in-turn') {
                          console.log(`[brain-orchestrator] show_problem on segment "${segId}" with matching target but new_page in turn — fresh-context render, NOT substituting.`);
                          onDebugEvent?.('show_problem_substitute_bypass', `new_page-in-turn; segId="${segId}" target="${brainTarget}"`);
                          // Fall through to dispatch the brain's
                          // free-form show_problem as-is.
                        } else if (subDecision.skipReason === 'segment-complete'
                                || subDecision.skipReason === 'student-asked-for-another') {
                          console.log(`[brain-orchestrator] show_problem substitution SKIPPED (${subDecision.skipReason}) for segment "${segId}" — dispatching the brain's own card.`);
                          onDebugEvent?.('show_problem_substitution_skipped', `${subDecision.skipReason}; segId="${segId}"`);
                          // Fall through to dispatch the brain's
                          // free-form show_problem as-is.
                        }
```

Add `shouldSubstituteShowProblem` and `TUTOR_SUBSTITUTE_GATE` to the imports. `detectAnotherProblemRequest` and `transcriptRef` are already imported/declared in this file (see line 12631 for the identical reverse-scan idiom).

- [ ] **Step 7: Register the new debug event**

In `apps/tutor/src/app/tutor-portal/embed/page.tsx`, add `'show_problem_substitution_skipped'` to `EMBED_DEBUG_EVENT_PREFIXES` as an exact full name, beside the existing `'show_problem_substitute_bypass'` entry if present, otherwise beside `'show_problem_substituted'`.

- [ ] **Step 8: Typecheck and commit**

Run: `cd apps/tutor && npx tsc --noEmit` — expected clean.

```bash
git add apps/tutor/src/lib/tutor/orchestrator/show-problem-substitution.ts \
        apps/tutor/scripts/test-show-problem-substitution.ts \
        apps/tutor/src/lib/tutor/orchestrator/flags.ts \
        apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx \
        apps/tutor/src/app/tutor-portal/embed/page.tsx \
        apps/tutor/package.json
git commit -m "fix(tutor): stop substituting show_problem into spent segment cards

portal-704e3e01 substituted into a COMPLETE segment @1111.7s and into a
card already on the board while the student asked for a different problem
@1021.1s — both self-inflicted validator retries. Flag
TUTOR_SUBSTITUTE_GATE (default ON).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

### Task 6: The auto-page title names a problem that isn't on the page

**Root cause (live, 1122.5s).** The whiteboard opened a page headed

```
"Try: Solve for x and type your answer as a number: 2(x + 5) − 3 = 4x −"
```

over a card reading `Solve for x: \frac{x}{2} + 3 = \frac{x}{5} + 6.` Two defects:

1. The title is built at *advance* time from the plan segment's authored text (`VoiceTutorRealtime.tsx:3965`, `descRaw = loDesc || nextSeg.goal || nextSeg.problem || nextSeg.question`) and deferred; the card that actually renders is the `generate_problem` substitute received 5s later. The title describes the problem that was replaced.
2. `String(newPageTitle).slice(0, 70)` cuts at a fixed character count, landing mid-expression on a trailing minus sign.

Amisha spent the next four minutes on this card and asked *"Wait, for which problem?"* at 1366.5s.

The fix belongs at **flush** time (line ~6672), where the batch about to render is in hand: if the batch contains a `showProblem`, title the page from that problem's statement.

**Files:**
- Create: `apps/tutor/src/lib/tutor/whiteboard/page-title.ts`
- Create: `apps/tutor/scripts/test-page-title.ts`
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx:3965` (use the shared truncator) and `~6672-6681` (retitle at flush)
- Modify: `apps/tutor/src/app/tutor-portal/embed/page.tsx`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `export function truncatePageTitle(text: string, max?: number): string` and `export function retitleFromBatch(args: { deferredTitle: string; renderedStatement?: string }): { title: string; retitled: boolean }`.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-page-title.ts`:

```ts
/**
 * portal-704e3e01 @1122.5s: page titled "Try: Solve for x and type your
 * answer as a number: 2(x + 5) − 3 = 4x −" over a card reading
 * "Solve for x: x/2 + 3 = x/5 + 6." — the authored problem's text on the
 * generated substitute's page, cut mid-expression by a fixed slice(0, 70).
 *
 * Usage: npx tsx scripts/test-page-title.ts  (npm run test:page-title)
 */
import { truncatePageTitle, retitleFromBatch } from '../src/lib/tutor/whiteboard/page-title';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── truncation ───
const LIVE = 'Try: Solve for x and type your answer as a number: 2(x + 5) − 3 = 4x − 11';
{
  const t = truncatePageTitle(LIVE, 70);
  check('never ends on a dangling operator', !/[−\-+*/=]\s*$/.test(t.replace(/…$/, '')), JSON.stringify(t));
  check('marks the cut with an ellipsis', t.endsWith('…'), JSON.stringify(t));
  check('stays within the budget', t.length <= 70, `len=${t.length}`);
}
{
  const short = 'Recap';
  check('short titles pass through untouched', truncatePageTitle(short, 70) === short);
}
{
  const exact = 'Try: How many solutions does 3(2x − 4) = 6x − 12 have?';
  check('a title under the budget is unchanged', truncatePageTitle(exact, 70) === exact);
}
{
  check('empty input is safe', truncatePageTitle('', 70) === '');
}
{
  // A single unbroken run longer than the budget still has to be cut.
  const runOn = 'A'.repeat(120);
  const t = truncatePageTitle(runOn, 70);
  check('unbroken run is still bounded', t.length <= 70, `len=${t.length}`);
}

// ─── retitling ───
{
  const r = retitleFromBatch({
    deferredTitle: 'Try: Solve for x and type your answer as a number: 2(x + 5) − 3 = 4x −',
    renderedStatement: 'Solve for x: $\\frac{x}{2} + 3 = \\frac{x}{5} + 6$. Type your answer as a number.',
  });
  check('portal-704e3e01: page is titled from the problem that actually renders',
    r.retitled === true && r.title.includes('frac{x}{2}'), JSON.stringify(r));
  check('the retitled page keeps the stage prefix', r.title.startsWith('Try: '), JSON.stringify(r));
}
{
  const r = retitleFromBatch({ deferredTitle: 'Recap', renderedStatement: undefined });
  check('no rendered problem → deferred title stands',
    r.retitled === false && r.title === 'Recap', JSON.stringify(r));
}
{
  // When the authored card IS what rendered, the title must not churn.
  const r = retitleFromBatch({
    deferredTitle: 'Try: Solve for x: 4x + 7 = 9x − 13',
    renderedStatement: 'Solve for x: 4x + 7 = 9x − 13',
  });
  check('matching statement does not retitle', r.retitled === false, JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Register and run to verify it fails**

Add to `apps/tutor/package.json`:

```json
    "test:page-title": "npx tsx scripts/test-page-title.ts",
```

Run: `cd apps/tutor && npm run test:page-title`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the pure module**

Create `apps/tutor/src/lib/tutor/whiteboard/page-title.ts`:

```ts
/**
 * Titles for the auto-newPage that fires on a segment advance.
 *
 * portal-704e3e01 (2026-09-04) @1122.5s produced a page headed "Try: Solve
 * for x and type your answer as a number: 2(x + 5) − 3 = 4x −" carrying a
 * card that read "Solve for x: x/2 + 3 = x/5 + 6." Two causes, both fixed
 * here: the title was built at ADVANCE time from the plan's authored problem
 * while the card was a generate_problem substitute resolved seconds later,
 * and a fixed slice(0, 70) cut it mid-expression on a trailing minus.
 * The student asked "Wait, for which problem?" four minutes later.
 *
 * Pure module — no side effects, never throws.
 */

const DEFAULT_MAX = 70;
/** Trailing operators, opening brackets and separators a title must not end on. */
const DANGLING_RE = /[\s.,;:+\-−*/=(<[{]+$/;

export function truncatePageTitle(text: string, max: number = DEFAULT_MAX): string {
  const s = (text ?? '').trim();
  if (s.length <= max) return s;
  // Reserve one character for the ellipsis, then cut back to the last space
  // so a token is never split; if there is no space to fall back to (a long
  // unbroken run) take the hard cut, which is still bounded.
  const budget = max - 1;
  let cut = s.slice(0, budget);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > budget * 0.5) cut = cut.slice(0, lastSpace);
  cut = cut.replace(DANGLING_RE, '');
  return `${cut}…`;
}

/** Everything before the first ': ' is the stage prefix ("Try: ", "Check: ").
 *  Preserved when a page is retitled so the progress read stays consistent. */
function stagePrefix(title: string): string {
  const i = (title ?? '').indexOf(': ');
  return i > 0 ? title.slice(0, i + 2) : '';
}

/** Normalized for comparison only — never for display. */
function comparable(s: string): string {
  return (s ?? '').toLowerCase().replace(/[\s$\\{}]+/g, '');
}

export function retitleFromBatch(args: {
  /** Title computed at advance time from the plan's authored segment. */
  deferredTitle: string;
  /** Statement of the showProblem actually in the flushing batch, if any. */
  renderedStatement?: string;
}): { title: string; retitled: boolean } {
  const deferred = (args.deferredTitle ?? '').trim();
  const rendered = (args.renderedStatement ?? '').trim();
  if (!rendered) return { title: deferred, retitled: false };
  // The authored card IS what rendered — leave the title alone. The deferred
  // title carries the authored text after its stage prefix, so compare that.
  const deferredBody = deferred.slice(stagePrefix(deferred).length);
  if (comparable(deferredBody).includes(comparable(rendered))
    || comparable(rendered).includes(comparable(deferredBody))) {
    return { title: deferred, retitled: false };
  }
  return { title: truncatePageTitle(`${stagePrefix(deferred)}${rendered}`), retitled: true };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run test:page-title`
Expected: PASS — `0 failed`.

- [ ] **Step 5: Add the flag**

In `orchestrator/flags.ts`, after the Task 5 flag:

```ts
/** portal-704e3e01 (2026-09-04) @1122.5s: the auto-newPage was titled from
 *  the plan's authored problem while the card that rendered was a
 *  generate_problem substitute, and the fixed slice(0, 70) cut it
 *  mid-expression. Retitles at flush from the problem actually rendering.
 *  Default ON; NEXT_PUBLIC_TUTOR_PAGE_TITLE_FROM_RENDER=off is the switch. */
export const TUTOR_PAGE_TITLE_FROM_RENDER =
  process.env.NEXT_PUBLIC_TUTOR_PAGE_TITLE_FROM_RENDER !== 'off';
```

- [ ] **Step 6: Use the shared truncator at advance time**

In `VoiceTutorRealtime.tsx`, replace line 3965:

```ts
    const pageTitleStr = String(newPageTitle).slice(0, 70);
```

with:

```ts
    // Boundary-safe: the fixed slice cut "…= 4x − 11" to "…= 4x −"
    // mid-expression (portal-704e3e01 @1122.5s).
    const pageTitleStr = truncatePageTitle(String(newPageTitle));
```

- [ ] **Step 7: Retitle at flush from what actually renders**

In the `hasFreshTeaching` branch (~6672), replace the three lines that build and open the page:

```ts
      if (hasFreshTeaching) {
        const deferred = pendingAdvanceNewPageRef.current;
        // Title from the problem that is actually about to render, not the
        // authored one this page was named after at advance time — a
        // generate_problem substitute resolves AFTER the title is computed
        // (portal-704e3e01 @1122.5s: "…2(x + 5) − 3 = 4x −" over a card
        // reading "x/2 + 3 = x/5 + 6").
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const renderedProblem = processed.find((cmd) => String(cmd.action) === 'showProblem') as any;
        const renderedStatement = typeof renderedProblem?.problem?.statement === 'string'
          ? renderedProblem.problem.statement
          : undefined;
        const titleDecision = TUTOR_PAGE_TITLE_FROM_RENDER
          ? retitleFromBatch({ deferredTitle: deferred.title, renderedStatement })
          : { title: deferred.title, retitled: false };
        const pageTitle = titleDecision.title;
        processed = [{ action: 'newPage', title: pageTitle } as WhiteboardCommand, ...processed];
        // Open the deferred page in the catalog Page model (this synthetic
        // newPage is prepended after the step-1 side-effect loop, so the
        // setCurrentPage bridge never sees it). setCurrentPage syncs the view.
        catalogRef.current.openPage({ title: pageTitle, segmentId: deferred.segmentId });
        catalogRef.current.setCurrentPage(pageTitle);
        console.log(`[VoiceTutorRealtime] auto-newPage on segment advance FLUSHED (deferred) → "${deferred.segmentId}" ("${pageTitle}")`);
        onDebugEvent?.('auto_newpage_on_advance_flushed', `${deferred.segmentId}: ${pageTitle}`);
        if (titleDecision.retitled) {
          onDebugEvent?.('auto_newpage_retitled_from_render', `${deferred.segmentId}: "${deferred.title}" → "${pageTitle}"`);
        }
        pendingAdvanceNewPageRef.current = null;
      } else {
```

Add `truncatePageTitle, retitleFromBatch` and `TUTOR_PAGE_TITLE_FROM_RENDER` to the imports.

- [ ] **Step 8: Register the new debug event**

In `apps/tutor/src/app/tutor-portal/embed/page.tsx`, add `'auto_newpage_retitled_from_render'` to `EMBED_DEBUG_EVENT_PREFIXES` as an exact full name, beside `'auto_newpage_on_advance_flushed'`.

- [ ] **Step 9: Typecheck and commit**

Run: `cd apps/tutor && npx tsc --noEmit` — expected clean.

```bash
git add apps/tutor/src/lib/tutor/whiteboard/page-title.ts \
        apps/tutor/scripts/test-page-title.ts \
        apps/tutor/src/lib/tutor/orchestrator/flags.ts \
        apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx \
        apps/tutor/src/app/tutor-portal/embed/page.tsx \
        apps/tutor/package.json
git commit -m "fix(tutor): title the auto-page from the problem that renders

portal-704e3e01 @1122.5s headed a page with the authored problem while a
generate_problem substitute rendered, and slice(0, 70) cut it mid-expression
on a trailing minus. Retitle at flush; boundary-safe truncation. Flag
TUTOR_PAGE_TITLE_FROM_RENDER (default ON).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

### Task 7: Ship gate

Run the whole gate **on the merged tree**, not on this branch alone. Nothing ships without Praveen's go-ahead.

- [ ] **Step 1: Merge origin/main into the worktree**

```bash
cd /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-rounds
git fetch origin && git merge origin/main
```
Expected: clean merge. Resolve any conflict before continuing — the gate below is meaningless on an unmerged tree.

- [ ] **Step 2: Typecheck**

Run: `cd apps/tutor && npx tsc --noEmit`
Expected: clean, no output.

- [ ] **Step 3: Full test sweep**

Run: `cd apps/tutor && npm run test:all`
Expected: **205/209 or better**, with exactly the four known pre-existing failures listed in Global Constraints and nothing else. The five harnesses touched or created by this plan must all be green: `test:false-assertion`, `test:verdict-preservation`, `test:meta-narration`, `test:show-problem-substitution`, `test:page-title`.

If a fifth suite is red, it belongs to this round — fix it before proceeding, do not add it to the known list.

- [ ] **Step 4: Production build**

Run: `cd apps/tutor && npm run build`
Expected: clean.

- [ ] **Step 5: Verify every new flag is inlined into the client bundle**

All five flags are read in a client component, so a missing `NEXT_PUBLIC_` prefix ships them as `undefined` and silently disables the fix (this exact class shipped perception stage `-1` on 2026-08-18). Prove inlining rather than assume it:

```bash
cd apps/tutor
for f in TUTOR_VERDICT_REPLANT_ON_KILL TUTOR_META_NARRATION_STRUCTURAL \
         TUTOR_SUBSTITUTE_GATE TUTOR_PAGE_TITLE_FROM_RENDER; do
  echo -n "$f bare-name occurrences in bundle: "
  grep -ro "NEXT_PUBLIC_$f" .next/static/chunks/ | wc -l
done
```
Expected: **0** for every flag. A non-zero count means the literal env-var NAME survived into the chunk — the value was never inlined and the flag is dead. (The build inlines the *value*, so the name should not appear.)

- [ ] **Step 6: Report to Praveen and STOP**

Post the gate results — tsc, `test:all` counts, build, the flag-inlining counts — and the list of five flags with their kill switches. **Do not run `./deploy-tutor.sh`.** Praveen gates every deploy; announce before and after with an expected duration (~8-9 min) once he says go.

- [ ] **Step 7: After deploy — live-verify**

These fixes cannot be confirmed by the typed-input harness; they need one real session. In the next session's `debugEvents`, look for:

| Expect to see | Expect NOT to see |
|---|---|
| `show_problem_substitution_skipped` on a repeat/complete card | `show_segment_card_completed_blocked` following a `show_problem_substituted` |
| `auto_newpage_retitled_from_render` after a `generate_problem` | a page title naming a different problem than its card |
| `verdict_replant_requested` if a false-assertion kill fires at all | `false_assertion_kill` where the asserted value matches what the student just said |
| `meta_narration_dropped` on any markup | any `<result>` / `<span` in the transcript |

Grep the transcript for markup directly:
```
ssh root@84.247.185.169 'cd /root/evelyn-tutor && node -e "…"'   # see the Spec block's inspector recipe
```

---

## Out of scope — recorded, not built

These came out of the same triage and are deliberately **not** tasks here. Each says why.

- **Finding 07 — speech naming content that isn't on the board** (1116.4s, *"Let's try that negative-sign trap fresh"* over a fractions card). Purely downstream of Tasks 2 and 5: the retry prompt described the segment the orchestrator had advanced to while the board showed the generated substitute. Re-check after this round rather than fixing blind.
- **Finding 08 — metaphor churn** (four analogies for one LCM idea in 110s, after the student said *"Because it's words."*). Real and probably the session's largest teaching failure, but the fix is a prompt/pacing rule, and prompt rules are probabilistic. The durable version is an orchestrator counter of distinct simile openers per segment. Needs its own design pass; keep it generic per `feedback_generic_prompts`.
- **Finding 09 — correct answer affirmed with fabricated arithmetic** (349.1s: *"Uh, 20 on the top"* was right; the tutor justified it with "4x + 12 … becomes 20"). `judge_advisory_flag` fired and, being advisory, aired nothing. This is the verdict-bank's `inc-premature-affirm-reversal` class with a twist — the verdict is correct and only the justification is fabricated, which `praise-contradiction.ts` cannot see. **Add it as a pinned probe in `probes/incidents.ts` in the same round as any guard**, per the bank's growth rule.
- **Finding 10 — verbatim stall-loop** ("Take your time — no rush." twice, 20s apart) and three `segment_overlong` events. `segment_overlong` is currently observational; wiring it to an escalation is a pacing round.
- **Finding 11 — genuine speech killed as barge-in** (1628.1s, a mid-sentence self-correction). The `perception_bare_return_rescued` path caught it. Worth checking whether "not X, maybe Y" is a systematic trigger, but not urgent.
- **Finding 13 — a kill without its telemetry.** The `false_final_assertion` rejection at 1113.7s reached `brain_validator_retry` with **no** matching `false_assertion_kill` among the session's 1,016 events, although the sole call site emits one immediately after `performKill()`, the type IS in `EMBED_DEBUG_EVENT_PREFIXES`, and the same emitter fired normally at 1414.3s. Most likely a race in the incremental `debugEventsRef.current.slice(lastSavedDebugCountRef.current)` flush (`embed/page.tsx:670`). Stated at lower confidence than the rest. Not a task because there is no verified root cause yet and a plan step must not guess at one — but worth ten minutes before the next triage, because without it a kill of this class is invisible to exactly the investigation that would look for it.
- **Finding 12 — latency and cost** ($4.31 / 29 min; the only three student→tutor gaps over 12s were 15.3s, 15.3s and 19.5s, every one of them a kill-and-retry turn at ~21s brain time and ~28K input tokens). No task of its own: Tasks 1, 2 and 5 remove three of the session's four retries, so this is verified rather than built. Confirm it in the post-deploy session by counting `brain_validator_retry` events.
- **Carrying MCQ choice *texts* into `currentProblemRef`** (see Task 2's non-goal). Would restore false-assertion kill coverage on MCQ cards, which Task 2 trades away for safety. Touches four write sites and both other `choiceLetters` consumers.
- **The sentence-final-period hole in `assertRe`.** `(?![\d./])` exists to reject a continuing decimal, but it also rejects a sentence-ending period, so `"…which means x = 13."` never matches at all. The R58 root case only fires because a `$` sits between the value and the period. Widening this would *increase* the guard's kill surface — the wrong direction on the evidence of this session. Recorded, not changed.
- **Audio.** Student track clips the int16 floor (45 samples, 79% silence) — the known `float32ToPCM16` asymmetric-encoding artifact, unchanged by this round.
