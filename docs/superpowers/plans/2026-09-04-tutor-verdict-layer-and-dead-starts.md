# Tutor Verdict-Layer & Dead-Start Triage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the verdict layer in both directions — guards that killed correct answers, and guards that were structurally unable to see wrong ones — plus the coherence and observability failures found alongside them.

**Architecture:** Fourteen tasks in four phases, all in the client orchestrator, its pure helper modules, and the embed page. Nothing touches the brain, prompts, or model configuration. Each task follows the house pattern: a pure decision module under `src/lib/tutor/**` with a `scripts/test-*.ts` harness registered as a `test:*` npm script, wired into `VoiceTutorRealtime.tsx` behind a default-ON flag where it changes behaviour.

**Tech Stack:** TypeScript, React (client component), `npx tsx` test harnesses auto-discovered by `scripts/run-all-tests.mjs`.

## Evidence base — five live sessions

| Session | Who / what | What it proves |
|---|---|---|
| `portal-704e3e01-1749-4d68-abbf-bd56387a9339` | Amisha, algebra-1, 2026-09-04 00:39-01:07Z, 103 turns, $4.31 | Guards firing **wrongly**: two correct affirmations killed (Phase A); `<result>` spoken aloud, self-inflicted retries, mismatched page title (Phase C) |
| `portal-9a9b7c09-679d-4603-9f86-44629790f56a` | Vanessa Oceguera, AP-stats, 2026-09-04 03:47-04:01Z, 49 turns, $2.00 | Guards **unable to fire**: 7 of 25 tutor turns defective, zero deterministic kills all session (Phase B) |
| `portal-00fa1bb7-e68b-4ce5-ade0-1531828bdf29` | Amisha, 2026-09-04 00:32:45Z | Dead start, 0 debug events (Phase D) |
| `portal-5bc0fc1e-103e-47c7-b34d-c3d356b299a4` | Amisha, 2026-09-04 00:32:54Z — **9s after the previous, same module** | Dead start, 0 debug events (Phase D) |
| `portal-c3007206-abeb-4638-8312-4b522f363631` | Vanshika Tyagi, digital-sat, 2026-09-03 00:56:00Z | Dead start, 0 debug events; the real session `portal-255c941b` began 58s later (Phase D) |

**Regenerate any report:**
```
scp apps/tutor/scripts/inspect-tutor-session.ts root@84.247.185.169:/tmp/
ssh root@84.247.185.169 'cd /root/evelyn-tutor && cp /tmp/inspect-tutor-session.ts ./inspect.ts \
  && export $(grep -E "^(MONGODB_URI|TUTOR_AUDIO_DIR)=" apps/tutor/.env.local | xargs -d "\n") \
  && npx --yes tsx ./inspect.ts <sessionId…> --out /tmp/session-reports'
```

**Three traps that cost time in this triage — read before re-deriving anything:**
- `/root/evelyn-tutor` on prod is **build-only**: no `scripts/`, no `tsx`. Copy the inspector in (it has `mongoose` and `apps/tutor/.env.local`).
- Transcript entries are `{role, **text**, timestamp}` — `m.content` is `undefined` and prints as "undefined" silently. Whiteboard lives in **`whiteboardCommands`**, not `whiteboard`.
- **`grep -a "brain.stream" /root/.pm2/logs/evelyn-tutor-out.log` is the only place a KILLED turn's original text survives** — these guards run client-side, so their `console.warn`s never reach the server. Retries appear as `student="[validator feedback — not from the student] …"`. pm2 log files are named by ROTATION time, so a 00:39 session on Sep 4 is in the **current** `evelyn-tutor-out.log`, not `…__2026-09-04_00-00-00.log`. Nginx stamps **+0200**.

## Global Constraints

- **Worktree only.** Work in `.claude/worktrees/tutor-rounds` (branch `tutor-rounds`). Confirm with `git rev-parse --git-dir` → must contain `.git/worktrees/`. Never work or deploy from `/Users/luke/Dev/evelynlearning` itself.
- **Scope is `apps/tutor/**` only.** Do not touch `apps/marketing/**` or the academy repo.
- **Run every npm command from `apps/tutor/`.**
- **New tutor flags default ON**: `process.env.NEXT_PUBLIC_TUTOR_X !== 'off'`. Do NOT convert existing `=== 'on'` flags in `orchestrator/flags.ts`.
- **Flag names must be `NEXT_PUBLIC_`-prefixed** — every flag here is read in a client component, and a bare `process.env.TUTOR_*` is not inlined into the client bundle (this silently shipped perception stage `-1` on 2026-08-18).
- **Do not touch `useOpenAIRealtime.ts`** (frozen file). Nothing in this plan needs it.
- **Guards must fail CLOSED.** Every task here exists because a guard either killed a correct turn or stayed silent on a wrong one. When a comparison cannot be resolved, return `ok`/`unknown` — never guess. A false kill is worse than a miss, and this plan's own prototypes produced two false-kill regressions that were caught only by writing the negative test first (Task 6's mixed-operator case, Task 1's coefficient boundary).
- **Prompts stay generic.** No task here edits `system-prompt-builder.ts`; if you find yourself wanting to, stop and flag it.
- **Pre-existing test failures (4), not caused by this round** — do not chase them: `test:pedagogy-posed-problem`, `test:pedagogy-d1` (prompt-clause string drift), `test:embed-token` (gate-mode fixture; passes with `TUTOR_DEMO_GATE=off`), `test:verdict-guard` non-answer branch (R58 drift). A green run is **205/209** with exactly these four red.
- **Praveen gates the deploy.** Finishing this plan is not permission to ship it.

---

## File Structure

| File | Responsibility | Tasks |
|---|---|---|
| `src/lib/tutor/voice/false-assertion-check.ts` | Pure detector: tutor asserts a wrong FINAL value. Owns the extraction regex. | 1, 2 |
| `scripts/test-false-assertion.ts` | Existing harness; gains the live regressions. | 1, 2 |
| `src/lib/tutor/voice/verdict-preservation.ts` | **New.** Pure `hasVerdictOpener(text)` + the generic `VERDICT_REPLANT_CLAUSE`. | 3 |
| `src/lib/tutor/orchestrator/kill-scope.ts` | **New.** Pure `partitionKillableTools` — which of a killed turn's tool calls must be withheld. | 4 |
| `src/lib/tutor/voice/spoken-numbers.ts` | **New.** `spokenNumbersToDigits` — the keystone of Phase B, shared by three guards. | 5, 6, 7, 8 |
| `src/lib/tutor/voice/arithmetic-claim-check.ts` | Existing binary-claim detector; gains word input and chained sums/products. | 6 |
| `src/lib/tutor/voice/denied-answer-reversal.ts` | Existing cross-turn guard; gains normalization and the verdict-opener shape. | 7 |
| `src/lib/tutor/voice/board-contradiction.ts` | **New.** Same expression on the board and in speech, different result. | 8 |
| `src/lib/tutor/voice/meta-narration.ts` | **New.** Pure `isMetaNarration` — phrase list (moved) + structural markup rule. | 9 |
| `src/lib/tutor/orchestrator/show-problem-substitution.ts` | **New.** Pure `shouldSubstituteShowProblem`. | 10 |
| `src/lib/tutor/whiteboard/page-title.ts` | **New.** Pure `truncatePageTitle` + `retitleFromBatch`. | 11 |
| `src/app/tutor-portal/embed/page.tsx` | `EMBED_DEBUG_EVENT_PREFIXES`; telemetry survival and deferred doc creation. | 3, 4, 8, 10, 11, 12, 13 |
| `src/lib/tutor/orchestrator/flags.ts` | Nine new default-ON flags, appended in task order. | 3, 4, 6, 8, 9, 10, 11, 12, 13 |
| `src/app/tutor/components/VoiceTutorRealtime.tsx` | Wiring only. | 2, 3, 4, 6, 7, 8, 9, 10, 11 |
| `package.json` | `test:*` entries for the new harnesses. | 3, 4, 5, 8, 9, 10, 11, 12, 14 |
| `src/app/api/tutor/session-usage/route.ts` | Refuse a cross-sitting append. | 14 |

**Why `EMBED_DEBUG_EVENT_PREFIXES` matters:** every session in this plan's evidence base is a `portal-*` session, which runs through `src/app/tutor-portal/embed/page.tsx`. That page drops any debug event whose type is not in the allowlist. A new event type not added there is **silently invisible in exactly the triage that would look for it** — caught on 2026-09-02 by the R54 coverage test. Add each new type as an exact full name.

---

## Phase A — Guards that fired wrongly

`portal-704e3e01`. Amisha answered correctly twice in four minutes; both times the brain composed a correct affirmation and the client-side false-assertion guard killed it. Her words at 1453.3s: *"Okay, now I'm confused because you started a question and I don't remember you mentioning the question and I don't know if I got that last question correct, so now I'm confused, bro."*

Tasks 1 and 2 remove the two false kills. Tasks 3 and 4 make a *justified* kill survivable — they are the reason this phase is four tasks and not two.

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
- Produces: `checkFalseFinalAssertion` keeps its exact existing signature and `FalseAssertionResult` shape. Task 2 adds one optional field to its argument object; Tasks 2 and 3 extend the same call site; build them in order.

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

### Task 4: A kill stops the speech but not the lesson advance

**Root cause (live, `portal-704e3e01` @1414.3s).** This is the half of the incident the student actually described. The kill retracted the spoken affirmation, but the same turn's lesson-state tools kept dispatching:

```
1410.6s  student  "Oh, right, you divide both sides by 3, so X is 10."   ← correct
1414.3s  false_assertion_kill  x=30 verified=10
1414.5s  tool_call  showEquation                    ← AFTER the kill
1418.8s  tool_call  markSegmentComplete             ← lesson state mutated
1418.8s  pacing_segment_mastered  seg="try-numeric" streak=8
1419.9s  tool_call  advanceLesson                   ← lesson state mutated
1421.6s  tool_call  addTopicNotesPointer
1423.2s  tool_call  showProblem  (the misconception card)
1425.5s  brain_validator_retry
1433.2s  killed_render_kept_validated: showProblem-6   ← card deliberately KEPT
1430.1s  tutor  "The mistake here is treating $10 - 2$ as if it happens first…"
```

`performKill` (`VoiceTutorRealtime.tsx:10453`) drops the render buffer, resets the TTS counters and captures the speech tail — it does **nothing** about tool calls, and the streaming loop keeps dispatching them because only speech is gated on `attemptKilled`. So the board advanced to the misconception segment on the strength of a turn the student never heard, and the retry — with nothing safe to say about `x = 10` — narrated the board it had just been moved to. That is why it reads as the tutor *suddenly starting* on a new topic rather than stumbling.

Renders already have the right treatment (`dropRenderBuffer`, `rollbackKilledRenders`). Lesson state does not.

**The trade-off, stated deliberately:** withholding an advance can leave the lesson where it was if the retry does not re-emit it. That is the safer failure — a lesson that did not advance is visible and recoverable inside the conversation; a lesson that advanced past an ungraded answer is neither, and produced the worst student moment in this triage. Renders are NOT withheld (`TUTOR_KEEP_VALIDATED_ON_KILL` exists precisely because validated figures should survive); only lesson-state mutation is.

**Files:**
- Create: `apps/tutor/src/lib/tutor/orchestrator/kill-scope.ts`
- Create: `apps/tutor/scripts/test-kill-scope.ts`
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (~11705, the `totalToolNamesSeen.push(name)` funnel)
- Modify: `apps/tutor/src/app/tutor-portal/embed/page.tsx`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `export function shouldWithholdAfterKill(toolName: string): boolean` and `export const LESSON_STATE_TOOLS: ReadonlySet<string>`.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-kill-scope.ts`:

```ts
/**
 * portal-704e3e01 @1414.3s: the false-assertion kill retracted the spoken
 * affirmation, then mark_segment_complete / advance_lesson / show_problem
 * from the SAME killed turn dispatched anyway. The student got the next
 * segment with no closure on the previous one and said so.
 *
 * Usage: npx tsx scripts/test-kill-scope.ts  (npm run test:kill-scope)
 */
import { shouldWithholdAfterKill, LESSON_STATE_TOOLS } from '../src/lib/tutor/orchestrator/kill-scope';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── the four tools that dispatched after the kill in portal-704e3e01 ───
check('advance_lesson is withheld', shouldWithholdAfterKill('advance_lesson'));
check('mark_segment_complete is withheld', shouldWithholdAfterKill('mark_segment_complete'));
check('add_topic_notes_pointer is withheld', shouldWithholdAfterKill('add_topic_notes_pointer'));
check('show_segment_card is withheld', shouldWithholdAfterKill('show_segment_card'));

// ─── renders are NOT withheld: TUTOR_KEEP_VALIDATED_ON_KILL exists so that
//     a validated figure survives a dropped narration. ───
check('show_equation is not withheld', !shouldWithholdAfterKill('show_equation'));
check('show_problem is not withheld', !shouldWithholdAfterKill('show_problem'));
check('scribble is not withheld', !shouldWithholdAfterKill('scribble'));
check('new_page is not withheld', !shouldWithholdAfterKill('new_page'));
check('generate_problem is not withheld', !shouldWithholdAfterKill('generate_problem'));
check('tutor_scroll_whiteboard is not withheld', !shouldWithholdAfterKill('tutor_scroll_whiteboard'));

// ─── unknown tools default to NOT withheld: a new render tool must never be
//     silently swallowed by this guard (the isTeachingRenderAction drift class). ───
check('unknown tool is not withheld', !shouldWithholdAfterKill('show_some_future_thing'));
check('empty name is safe', !shouldWithholdAfterKill(''));

// ─── the set is explicit and small ───
check('LESSON_STATE_TOOLS has exactly the four', LESSON_STATE_TOOLS.size === 4, `size=${LESSON_STATE_TOOLS.size}`);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Register and run to verify it fails**

Add to `apps/tutor/package.json`:

```json
    "test:kill-scope": "npx tsx scripts/test-kill-scope.ts",
```

Run: `cd apps/tutor && npm run test:kill-scope`
Expected: FAIL — `Cannot find module '../src/lib/tutor/orchestrator/kill-scope'`.

- [ ] **Step 3: Write the pure module**

Create `apps/tutor/src/lib/tutor/orchestrator/kill-scope.ts`:

```ts
/**
 * Which of a killed attempt's tool calls must NOT dispatch.
 *
 * portal-704e3e01 (2026-09-04) @1414.3s: the false-assertion guard killed the
 * turn's speech at 1414.3s and mark_segment_complete (1418.8s), advance_lesson
 * (1419.9s), add_topic_notes_pointer (1421.6s) and the next segment's
 * show_problem (1423.2s) all dispatched afterwards. performKill drops the
 * render buffer and resets the TTS counters but never touched tool calls, and
 * the streaming loop gates only speech on `attemptKilled`. The lesson advanced
 * on a turn the student never heard, and the retry narrated the board it had
 * been moved to — "I don't know if I got that last question correct."
 *
 * Deliberately narrow: ONLY tools that mutate lesson position/progress. Render
 * tools are excluded on purpose — TUTOR_KEEP_VALIDATED_ON_KILL exists so a
 * validated figure survives a dropped narration, and withholding renders here
 * would fight it. Unknown tools are never withheld: a guard that silently
 * swallows a tool nobody registered is the drift class isTeachingRenderAction
 * was introduced to end.
 *
 * Pure module — no imports, no side effects, never throws.
 */

/** Tools whose effect is lesson STATE, not board content. */
export const LESSON_STATE_TOOLS: ReadonlySet<string> = new Set([
  'advance_lesson',
  'mark_segment_complete',
  'add_topic_notes_pointer',
  'show_segment_card',
]);

export function shouldWithholdAfterKill(toolName: string): boolean {
  return LESSON_STATE_TOOLS.has(toolName ?? '');
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run test:kill-scope`
Expected: PASS — `0 failed`.

- [ ] **Step 5: Add the flag**

In `apps/tutor/src/lib/tutor/orchestrator/flags.ts`, append after the Task 3 flag:

```ts
/** portal-704e3e01 (2026-09-04) @1414.3s: performKill retracted the speech
 *  while mark_segment_complete / advance_lesson / show_segment_card from the
 *  SAME killed turn dispatched anyway, moving the lesson onto content the
 *  student never heard introduced. Withholds lesson-STATE tools (never
 *  renders) for the remainder of a killed attempt.
 *  Default ON; NEXT_PUBLIC_TUTOR_KILL_WITHHOLDS_ADVANCE=off is the switch. */
export const TUTOR_KILL_WITHHOLDS_ADVANCE =
  process.env.NEXT_PUBLIC_TUTOR_KILL_WITHHOLDS_ADVANCE !== 'off';
```

- [ ] **Step 6: Wire it into the tool funnel**

In `VoiceTutorRealtime.tsx`, `totalToolNamesSeen.push(name);` (~line 11705) is the single point every tool in an attempt passes through. Insert immediately BEFORE it:

```ts
                  // Kill scope (portal-704e3e01 @1414.3s). Once this attempt
                  // is killed its speech is gone, so any lesson-STATE tool
                  // still arriving would advance the lesson on a turn the
                  // student never heard. Renders deliberately still dispatch
                  // (TUTOR_KEEP_VALIDATED_ON_KILL owns that decision). The
                  // retry re-emits the advance if it still means it.
                  if (TUTOR_KILL_WITHHOLDS_ADVANCE && attemptKilled && shouldWithholdAfterKill(name)) {
                    console.warn(`[brain-orchestrator] withholding lesson-state tool "${name}" — attempt already killed`);
                    onDebugEvent?.('kill_withheld_lesson_tool', name);
                    continue;
                  }
                  totalToolNamesSeen.push(name);
```

Add `shouldWithholdAfterKill` and `TUTOR_KILL_WITHHOLDS_ADVANCE` to the imports.

⚠️ **Verify the `continue` targets the tool loop, not the sentence loop.** Read the ~40 lines above the insertion point and confirm the enclosing `for`/`while` iterates tool calls. If `continue` would skip a sentence instead, use an `if (!withheld) { … }` wrapper around the dispatch block rather than `continue`, and say so in the commit message.

- [ ] **Step 7: Register the new debug event**

In `apps/tutor/src/app/tutor-portal/embed/page.tsx`, add `'kill_withheld_lesson_tool'` to `EMBED_DEBUG_EVENT_PREFIXES` as an exact full name, beside `'killed_render_kept_validated'`.

- [ ] **Step 8: Typecheck and commit**

Run: `cd apps/tutor && npx tsc --noEmit` — expected clean.

```bash
git add apps/tutor/src/lib/tutor/orchestrator/kill-scope.ts \
        apps/tutor/scripts/test-kill-scope.ts \
        apps/tutor/src/lib/tutor/orchestrator/flags.ts \
        apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx \
        apps/tutor/src/app/tutor-portal/embed/page.tsx \
        apps/tutor/package.json
git commit -m "fix(tutor): a killed turn must not still advance the lesson

portal-704e3e01 @1414.3s: the kill retracted the speech at 1414.3s while
mark_segment_complete (1418.8s), advance_lesson (1419.9s) and the next
segment's show_problem (1423.2s) dispatched anyway. Withhold lesson-state
tools for the rest of a killed attempt; renders are untouched. Flag
TUTOR_KILL_WITHHOLDS_ADVANCE (default ON).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

## Phase B — Guards that could not fire at all

`portal-9a9b7c09` (Vanessa Oceguera, AP-stats, 14:02). Dataset `3, 4, 4, 5, 19` — mean 7, Σd² = 182, variance 45.5. **Seven of 25 tutor turns carried a grading or arithmetic defect, and not one deterministic guard fired in the whole session.** Zero kills.

| At | What the tutor said | Truth |
|---|---|---|
| 172.8s | student said *"Alright."* → **"Right, seven."** | graded a non-answer as correct |
| 369.2s | *"Right. Nine, nine, nine, four"* | squares are **16, 9, 9, 4** |
| 399.9s | *"you were right the first time… nine, nine, nine, and four"* | still wrong; falsely credited the student |
| 451.1s | *"Sixteen plus nine plus nine plus four plus one-forty-four — that's **thirty-eight**"* | = **182** |
| 455.8s | *"Not quite, close."* — 3.7s later, **same turn** (one `brain_turn`, 6 sentences) | in-turn self-reversal |
| 748.6s | *"Not quite… you added instead of dividing"* to a correct **"12"** | false denial |
| 763.6s | *"Right. Twelve"* | unflagged reversal of its own denial |

**The board was right the whole time.** `showEquation-9` wrote `(3-7)^2=16, (4-7)^2=9, (4-7)^2=9, (5-7)^2=4` at 370.9s and `showEquation-11` wrote `16 + 9 + 9 + 4 + 144 = 182` at 460.8s — in the same turns as the wrong speech. Ground truth was on screen while the student's ears got the error.

**The single root cause: every deterministic guard parses digits, and the tutor speaks numbers as words.** Verified by running the shipped modules against the live sentences:

```
{"verdict":"ok"}                                          | LIVE 451.1s as spoken (words)
{"verdict":"ok"}                                          | same claim rewritten in DIGITS
{"verdict":"false_assertion","correct":"144 + 16 = 160"}  | same, TWO operands in digits
{"verdict":"false_denial","correct":"18 - 3 = 15"}        | control — the guard is alive
```

- `arithmetic-claim-check.ts` — `NUM` is `-?\d+`, digits only; and even in digits it skips chained sums by design (only binary claims fire). **Task 6.**
- `denied-answer-reversal.ts` — the stash held the student's **`"12"`**; the reversal was **`"Right. Twelve —"`**. `\b12\b` never matches, so the guard never even reached its assertion test — and its assertion-shape list also lacks the *verdict-opener + bare value* form, which is how a math tutor actually reverses. **Task 7.**
- `normalizeSpokenMath`'s `NUMBER_WORDS` map stops at **`twelve`**, so the one word→digit converter in the codebase cannot express "sixteen", "nineteen", "thirty-eight" or "one forty-four". **Task 5** — the keystone; Tasks 6, 7 and 8 all consume it.

**And the one component that DID see the errors is forbidden to stop them.** `judge_advisory_was_kill` fired at 375.5s and 459.5s on exactly the "nine, nine, nine, four" and "that's thirty-eight" sentences — kill severity, downgraded to advisory by design (Pillar 2b). Task 8 gives the deterministic tier a way to catch this class using the board as ground truth, which is the only route that respects the advisory-only judge decision.

---

### Task 5: A spoken-number normalizer (keystone — Tasks 6, 7, 8 depend on it)

**Files:**
- Create: `apps/tutor/src/lib/tutor/voice/spoken-numbers.ts`
- Create: `apps/tutor/scripts/test-spoken-numbers.ts`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: `export function spokenNumbersToDigits(text: string): string`. Consumed by Tasks 6, 7 and 8. **Build this task first.**

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-spoken-numbers.ts`. Every case below is a verbatim tutor sentence from `portal-9a9b7c09` or a false-positive control:

```ts
/**
 * The tutor speaks numbers as words; every deterministic arithmetic guard
 * parses digits. portal-9a9b7c09 had seven defective turns and zero kills.
 *
 * Usage: npx tsx scripts/test-spoken-numbers.ts  (npm run test:spoken-numbers)
 */
import { spokenNumbersToDigits } from '../src/lib/tutor/voice/spoken-numbers';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}
const eq = (name: string, input: string, expected: string) =>
  check(name, spokenNumbersToDigits(input) === expected, JSON.stringify(spokenNumbersToDigits(input)));

// ─── the live sentences ───
eq('451.1s the false sum',
  "Right. Sixteen plus nine plus nine plus four plus one-forty-four — that's *thirty-eight*.",
  "Right. 16 plus 9 plus 9 plus 4 plus 144 — that's *38*.");
eq('763.6s the unflagged reversal',
  'Right. Twelve — five plus nineteen is twenty-four, and twenty-four over two is twelve.',
  'Right. 12 — 5 plus 19 is 24, and 24 over 2 is 12.');
eq('369.2s the wrong squares', 'Right. Nine, nine, nine, four', 'Right. 9, 9, 9, 4');
eq('158.7s', 'What does thirty-five divided by five give you?', 'What does 35 divided by 5 give you?');
eq('399.9s', 'four minus seven squared is nine', '4 minus 7 squared is 9');

// ─── compound and hundreds forms ───
eq('hundreds with and', 'one hundred and forty-four', '144');
eq('plain hundreds', 'two hundred', '200');
eq('spoken shorthand "one forty-four"', 'one forty-four', '144');
eq('hyphenated shorthand', 'one-forty-four', '144');
eq('teens', 'seventeen', '17');
eq('tens compound', 'ninety-nine', '99');

// ─── FAIL CLOSED: a lone "one" is usually a determiner, never convert it ───
eq('determiner "that one number"',
  'That one number, $144$, is going to dwarf every other squared deviation.',
  'That one number, $144$, is going to dwarf every other squared deviation.');
eq('determiner "one more step"', 'one more step to go', 'one more step to go');
eq('lone one in a sum is skipped (miss, not false fire)', 'five plus one', '5 plus one');

// ─── prose "and" must survive; it only joins number words ───
eq('trailing and is handed back',
  'Add the last two nines and the four and the total lands at 182',
  'Add the last 2 nines and the 4 and the total lands at 182');

// ─── nothing to do ───
eq('no numbers', 'Take your time — no rush.', 'Take your time — no rush.');
eq('already digits', 'Distribute the $4$ across both terms.', 'Distribute the $4$ across both terms.');
eq('empty', '', '');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Register and run to verify it fails**

Add to `apps/tutor/package.json`:

```json
    "test:spoken-numbers": "npx tsx scripts/test-spoken-numbers.ts",
```

Run: `cd apps/tutor && npm run test:spoken-numbers`
Expected: FAIL — `Cannot find module '../src/lib/tutor/voice/spoken-numbers'`.

- [ ] **Step 3: Write the pure module**

Create `apps/tutor/src/lib/tutor/voice/spoken-numbers.ts`. This implementation was replayed against every case above before this plan was written:

```ts
/**
 * Spoken number words → digits, for the TUTOR's own sentences.
 *
 * Why (portal-9a9b7c09, 2026-09-04): the brain speaks numbers as words by
 * design, and every deterministic arithmetic guard parses digits. The session
 * had seven defective tutor turns — including "Sixteen plus nine plus nine
 * plus four plus one-forty-four — that's thirty-eight" (the sum is 182) — and
 * fired zero kills, because arithmetic-claim-check's NUM is `-?\d+` and
 * denied-answer-reversal was matching a stashed "12" against a spoken
 * "Twelve". normalizeSpokenMath's NUMBER_WORDS map stops at twelve and is
 * documented as being for the STUDENT utterance side only, so neither could
 * be reused.
 *
 * Fails CLOSED. A lone "one" is left alone (it is a determiner far more often
 * than a numeral: "that one number", "one more step"), which costs a guard the
 * occasional true positive and can never manufacture a false one.
 *
 * Pure module — no imports, no side effects, never throws.
 */

const UNITS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
};
const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

const VOCAB = [...Object.keys(UNITS), ...Object.keys(TENS), 'hundred', 'and'];
/** A maximal run of number words joined by spaces or hyphens. */
const RUN_RE = new RegExp(`\\b(?:${VOCAB.join('|')})(?:[- ](?:${VOCAB.join('|')}))*\\b`, 'gi');

function parseRun(run: string): number | null {
  const toks = run.toLowerCase().split(/[- ]+/).filter((t) => t && t !== 'and');
  if (toks.length === 0) return null;
  let cur = 0;
  let seen = false;
  for (const t of toks) {
    if (t in UNITS) { cur += UNITS[t]; seen = true; }
    else if (t in TENS) { cur += TENS[t]; seen = true; }
    else if (t === 'hundred') { cur = (cur === 0 ? 1 : cur) * 100; seen = true; }
    else return null;
  }
  return seen ? cur : null;
}

/** "one forty-four" / "one-forty-four" = 144 — the spoken shorthand for 1xx
 *  that parseRun would otherwise read as 1 + 44 = 45. */
function parseShorthand(run: string): number | null {
  const toks = run.toLowerCase().split(/[- ]+/).filter((t) => t && t !== 'and');
  if (toks.length < 2 || toks[0] !== 'one') return null;
  const rest = parseRun(toks.slice(1).join(' '));
  return rest !== null && rest >= 10 && rest <= 99 ? 100 + rest : null;
}

export function spokenNumbersToDigits(text: string): string {
  return (text ?? '').replace(RUN_RE, (m) => {
    // "and" joins number words INSIDE a value ("one hundred and forty-four");
    // a trailing one is ordinary prose ("…and the four and the total") and
    // must be handed back rather than swallowed into the match.
    let core = m;
    let tail = '';
    const tm = core.match(/(?:[- ]+and)+$/i);
    if (tm) { tail = core.slice(core.length - tm[0].length); core = core.slice(0, core.length - tm[0].length); }
    if (/^one$/i.test(core.trim())) return m;   // determiner — fail closed
    const sh = parseShorthand(core);
    if (sh !== null) return String(sh) + tail;
    const v = parseRun(core);
    return (v === null ? core : String(v)) + tail;
  });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run test:spoken-numbers`
Expected: PASS — `0 failed`, all 19 checks.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/voice/spoken-numbers.ts \
        apps/tutor/scripts/test-spoken-numbers.ts apps/tutor/package.json
git commit -m "feat(tutor): spoken-number normalizer for the tutor's own sentences

portal-9a9b7c09 had 7 defective tutor turns and zero deterministic kills:
the guards parse digits, the tutor speaks words, and NUMBER_WORDS stops at
twelve. Keystone for the arithmetic, reversal and board-contradiction
guards. Fails closed on a lone 'one' (determiner).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

### Task 6: The arithmetic guard cannot see a chained sum, or a spoken one

**Root cause (live, 451.1s).** *"Right. Sixteen plus nine plus nine plus four plus one-forty-four — that's **thirty-eight**."* The sum is 182. `checkArithmeticClaims` returned `ok` for two independent reasons: the operands were words, and even in digits its `CLAIM_RE` only matches **one binary operation** (`A op B is C`) — a chained sum is explicitly skipped by the `CONTEXT_OPS` fragment check.

**A false-kill regression this task must not reintroduce.** The first prototype of the chained matcher accepted **mixed** operators and evaluated left-to-right: `"16 + 9 * 2 is 50"` came back `false_assertion, correct: 16 + 9 * 2 = 288`, which is wrong under precedence *and* would have killed a legitimate turn. The fix is a backreference forcing one operator family across the whole chain. Both mixed-operator cases are pinned as tests below — write them first.

**Files:**
- Modify: `apps/tutor/src/lib/tutor/voice/arithmetic-claim-check.ts`
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (the existing `checkArithmeticClaims` call site)
- Test: `apps/tutor/scripts/test-arithmetic-claim-check.ts` (existing harness, registered as `test:arith-claim` — note the script name does NOT match the filename)

**Interfaces:**
- Consumes: `spokenNumbersToDigits` (Task 5).
- Produces: `checkArithmeticClaims` keeps its signature and `ArithmeticClaimResult` shape; a new optional second argument `opts?: { normalizeSpokenWords?: boolean }`.

- [ ] **Step 1: Write the failing tests**

Append to the arithmetic harness:

```ts
// ─── portal-9a9b7c09 @451.1s — the sum is 182, the tutor said 38 ───
{
  const r = checkArithmeticClaims(
    "Right. Sixteen plus nine plus nine plus four plus one-forty-four — that's *thirty-eight*.",
    { normalizeSpokenWords: true },
  );
  check('portal-9a9b7c09: spoken chained sum, false total → false_assertion',
    r.verdict === 'false_assertion', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims("Right. 16 + 9 + 9 + 4 + 144 = 38", { normalizeSpokenWords: true });
  check('same claim in digits → false_assertion', r.verdict === 'false_assertion', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims("Right. 16 + 9 + 9 + 4 + 144 — that's 182.", { normalizeSpokenWords: true });
  check('the CORRECT total → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims('2 * 3 * 4 is 26', { normalizeSpokenWords: true });
  check('chained product, wrong → false_assertion', r.verdict === 'false_assertion', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims('2 * 3 * 4 is 24', { normalizeSpokenWords: true });
  check('chained product, right → ok', r.verdict === 'ok', JSON.stringify(r));
}
// ─── FALSE-KILL REGRESSIONS: mixed operators must never be judged ───
{
  const r = checkArithmeticClaims('16 + 9 * 2 is 50', { normalizeSpokenWords: true });
  check('mixed operators are NEVER judged (precedence) → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims('3 + 4 * 5 + 6 is 100', { normalizeSpokenWords: true });
  check('mixed operators, longer chain → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims('16 plus 9 plus 9 plus 4 plus 144', { normalizeSpokenWords: true });
  check('a chain with no claimed total → ok', r.verdict === 'ok', JSON.stringify(r));
}
// ─── the existing binary behaviour is untouched with the flag off ───
{
  const r = checkArithmeticClaims("Close — 18 - 3 isn't 15 — try that subtraction again.");
  check('binary false_denial still fires with no opts', r.verdict === 'false_denial', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims('18 - 3 is 14.');
  check('binary false_assertion still fires with no opts', r.verdict === 'false_assertion', JSON.stringify(r));
}
```

- [ ] **Step 2: Run to verify the new checks fail**

Run: `cd apps/tutor && npm run test:arith-claim`
Expected: FAIL — the first five new checks fail (`{"verdict":"ok"}` where a `false_assertion` was expected), plus a TypeScript error on the unknown second argument. Both mixed-operator checks and the "no claimed total" check should already PASS — they are regressions, not new behaviour.

- [ ] **Step 3: Add the chained matcher and the normalizer hook**

In `arithmetic-claim-check.ts`, import the normalizer and add the chain rule. Keep `CLAIM_RE` and its loop exactly as they are — the chain check runs FIRST and returns; everything that is not a same-operator chain falls through to the existing binary logic unchanged.

```ts
import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';
```

Add beside the existing constants:

```ts
// Chained same-operator claim: "A + B + C … is D" (three or more operands).
// portal-9a9b7c09 @451.1s: "Sixteen plus nine plus nine plus four plus
// one-forty-four — that's thirty-eight" (the sum is 182). CLAIM_RE handles
// exactly one binary operation, and its CONTEXT_OPS check deliberately skips
// anything longer, so this shape had no detector at all.
//
// The backreference \2 forces ONE operator family across the whole chain.
// Without it a mixed chain is evaluated left-to-right and contradicts
// precedence: a prototype graded "16 + 9 * 2 is 50" as false against 288
// (the correct value is 34) — a false KILL, the exact class this round
// exists to remove. Mixed chains are never judged.
const CHAIN_RE = new RegExp(
  String.raw`(?<![\w.%])(${NUM}\s*([+*])\s*${NUM}(?:\s*\2\s*${NUM})+)\s*[—,-]?\s*(?:${DENIAL}|${ASSERT})\s*\*?(${NUM})\*?(?![\w%.])`,
  'i',
);

function checkChainedClaim(text: string): ArithmeticClaimResult {
  const m = text.match(CHAIN_RE);
  if (!m) return OK;
  const [full, expr, op, cRaw] = m;
  const parts = expr.split(/\s*[+*]\s*/).map(parseFloat);
  if (parts.some(Number.isNaN)) return OK;
  const claimed = parseFloat(cRaw);
  if (Number.isNaN(claimed)) return OK;
  const truth = op === '+'
    ? parts.reduce((a, b) => a + b, 0)
    : parts.reduce((a, b) => a * b, 1);
  const denied = new RegExp(DENIAL, 'i').test(full);
  const agree = fmt(truth) === fmt(claimed);
  if (denied) {
    return agree
      ? { verdict: 'false_denial', claim: full.trim(), correct: `${expr} = ${fmt(truth)}` }
      : OK;
  }
  return agree
    ? OK
    : { verdict: 'false_assertion', claim: full.trim(), correct: `${expr} = ${fmt(truth)}` };
}
```

Then change the entry point. The `ASSERT` alternation also needs the two spoken forms this session used:

```ts
const ASSERT = String.raw`that's|equals|is|=|comes\s+out\s+to|gives`;
```

```ts
export function checkArithmeticClaims(
  sentence: string,
  opts?: { normalizeSpokenWords?: boolean },
): ArithmeticClaimResult {
  try {
    if (typeof sentence !== 'string' || sentence.length === 0) return OK;
    if (APPROX_RE.test(sentence)) return OK;

    // The tutor speaks numbers as words; NUM is digits-only (portal-9a9b7c09).
    const source = opts?.normalizeSpokenWords === true
      ? spokenNumbersToDigits(sentence)
      : sentence;
    const text = normalize(source);

    // Same-operator chains first — they are invisible to CLAIM_RE below.
    const chained = checkChainedClaim(text);
    if (chained.verdict !== 'ok') return chained;

    CLAIM_RE.lastIndex = 0;
    // … the existing loop, unchanged …
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd apps/tutor && npm run test:arith-claim`
Expected: PASS — `0 failed`. **Both mixed-operator checks must still pass.** If either flipped to `false_assertion`, the backreference is wrong — stop and re-read `CHAIN_RE`.

- [ ] **Step 5: Add the flag and enable normalization at the call site**

In `orchestrator/flags.ts`, after the Task 4 flag:

```ts
/** portal-9a9b7c09 (2026-09-04): the tutor speaks numbers as words and every
 *  arithmetic guard parses digits, so a session with seven defective turns
 *  fired zero kills. Feeds tutor sentences through spokenNumbersToDigits
 *  before the arithmetic and reversal guards.
 *  Default ON; NEXT_PUBLIC_TUTOR_SPOKEN_NUMBER_GUARDS=off is the switch. */
export const TUTOR_SPOKEN_NUMBER_GUARDS =
  process.env.NEXT_PUBLIC_TUTOR_SPOKEN_NUMBER_GUARDS !== 'off';
```

In `VoiceTutorRealtime.tsx`, find the existing `checkArithmeticClaims(` call and pass the option:

```ts
                    const arith = checkArithmeticClaims(updatedSentence, {
                      normalizeSpokenWords: TUTOR_SPOKEN_NUMBER_GUARDS,
                    });
```

Add `TUTOR_SPOKEN_NUMBER_GUARDS` to the flags import.

- [ ] **Step 6: Typecheck and commit**

Run: `cd apps/tutor && npx tsc --noEmit` — expected clean.

```bash
git add apps/tutor/src/lib/tutor/voice/arithmetic-claim-check.ts \
        apps/tutor/scripts/test-arithmetic-claim-check.ts \
        apps/tutor/src/lib/tutor/orchestrator/flags.ts \
        apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx \
        apps/tutor/package.json
git commit -m "fix(tutor): arithmetic guard now sees spoken and chained claims

portal-9a9b7c09 @451.1s spoke '16 + 9 + 9 + 4 + 144 — that's thirty-eight'
(=182) and the guard returned ok: words, and a chain it only matched two
operands of. Mixed-operator chains are never judged — a prototype graded
'16 + 9 * 2 is 50' false against 288 and would have killed a good turn.
Flag TUTOR_SPOKEN_NUMBER_GUARDS (default ON).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

### Task 7: The denied-answer-reversal guard stashes digits and reads words

**Root cause (live, 748.6s → 763.6s).** The tutor asked *"What's $5+19$, divided by $2$?"*; the student answered **"12"** — correct; the tutor said *"Not quite. Close — you added instead of dividing"* (a description of an answer of 24, which the student never gave); 15 seconds later it said *"Right. Twelve"*.

`denied_answer_stashed "12" turn=22` fired, so the stash worked. The reversal was then invisible for **two** reasons:
1. The stash holds `"12"` and the reversal sentence contains `Twelve`. The guard's very first test is `new RegExp("\\b12\\b").test(sentence)` — it fails, and the function `continue`s before ever reaching the assertion-shape check.
2. Its assertion shapes are `it's X` / `the answer is X` / `belongs to the X` / `X after all` / `X is correct`. A math tutor reverses with **a verdict opener followed by the bare value** — `"Right. Twelve —"` — which is not in the list.

**Files:**
- Modify: `apps/tutor/src/lib/tutor/voice/denied-answer-reversal.ts`
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (the `checkDeniedAnswerReversal` call site)
- Test: `apps/tutor/scripts/test-denied-answer-reversal.ts` (existing)

**Interfaces:**
- Consumes: `spokenNumbersToDigits` (Task 5), `TUTOR_SPOKEN_NUMBER_GUARDS` (Task 6).
- Produces: `checkDeniedAnswerReversal` keeps its signature; a new optional `normalizeSpokenWords?: boolean` on its args object.

- [ ] **Step 1: Write the failing tests**

Append to `scripts/test-denied-answer-reversal.ts`:

```ts
// ─── portal-9a9b7c09: denied a CORRECT "12" @748.6s, affirmed it @763.6s ───
{
  const r = checkDeniedAnswerReversal({
    sentence: 'Right. Twelve — five plus nineteen is twenty-four, and twenty-four over two is twelve.',
    denied: [{ phrase: '12', turn: 22 }],
    currentTurn: 23,
    normalizeSpokenWords: true,
  });
  check('portal-9a9b7c09: spoken "Twelve" reverses a stashed "12"',
    r.verdict === 'reversal', JSON.stringify(r));
}
{
  const r = checkDeniedAnswerReversal({
    sentence: 'Right. 12 — five plus nineteen is twenty-four.',
    denied: [{ phrase: '12', turn: 22 }],
    currentTurn: 23,
    normalizeSpokenWords: true,
  });
  check('verdict opener + bare digit value is a reversal shape',
    r.verdict === 'reversal', JSON.stringify(r));
}
{
  const r = checkDeniedAnswerReversal({
    sentence: 'Exactly. Twelve it is.',
    denied: [{ phrase: '12', turn: 22 }],
    currentTurn: 23,
    normalizeSpokenWords: true,
  });
  check('"Exactly. Twelve it is." is a reversal', r.verdict === 'reversal', JSON.stringify(r));
}
// ─── FAIL CLOSED: a bare mention while teaching is not a reversal ───
{
  const r = checkDeniedAnswerReversal({
    sentence: 'If it were twelve, the interquartile range would change.',
    denied: [{ phrase: '12', turn: 22 }],
    currentTurn: 23,
    normalizeSpokenWords: true,
  });
  check('hypothetical mention is NOT a reversal', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkDeniedAnswerReversal({
    sentence: "It's not twelve — look at the upper half again.",
    denied: [{ phrase: '12', turn: 22 }],
    currentTurn: 23,
    normalizeSpokenWords: true,
  });
  check('negated restatement is NOT a reversal', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkDeniedAnswerReversal({
    sentence: 'Look at the twelve on the board and compare it to the median.',
    denied: [{ phrase: '12', turn: 22 }],
    currentTurn: 23,
    normalizeSpokenWords: true,
  });
  check('descriptive mention is NOT a reversal', r.verdict === 'ok', JSON.stringify(r));
}
```

- [ ] **Step 2: Run to verify the first three fail**

Run: `cd apps/tutor && npm run test:denied-answer-reversal`
Expected: FAIL — the three reversal checks return `{"verdict":"ok"}`, plus a TypeScript error on the unknown `normalizeSpokenWords` property. The three fail-closed checks should already pass.

- [ ] **Step 3: Normalize both sides and add the verdict-opener shape**

In `denied-answer-reversal.ts`:

```ts
import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';
```

Add the shape constant beside the existing ones:

```ts
/** Praise/denial openers a tutor grades with. A reversal in a math session is
 *  almost always "<verdict>. <value>" — portal-9a9b7c09 @763.6s said
 *  "Right. Twelve —" after denying a correct 12 fifteen seconds earlier, and
 *  none of the prose assertion shapes below matched it. */
const VERDICT_OPENER = String.raw`exactly|right|correct|precisely|yes|nice|perfect|that'?s it`;
```

In `checkDeniedAnswerReversal`, normalize the sentence and each stashed phrase, and extend the assertion alternation:

```ts
  const sentence = normalize(
    args.normalizeSpokenWords === true ? spokenNumbersToDigits(args.sentence) : args.sentence,
  );
  if (!sentence) return { verdict: 'ok' };
  for (const d of args.denied) {
    if (!d.phrase) continue;
    if (d.turn >= args.currentTurn) continue;             // the denial's own turn
    if (args.currentTurn - d.turn > maxAge) continue;     // stale — student moved on
    // The stash holds the STUDENT's text (usually digits) and the tutor
    // reverses in words; normalize the phrase the same way as the sentence.
    const phrase = normalize(
      args.normalizeSpokenWords === true ? spokenNumbersToDigits(d.phrase) : d.phrase,
    );
    if (!phrase) continue;
    const p = escapeRe(phrase);
```

…and add one alternative to the `assertion` regex — a verdict opener within the first few words, followed by the phrase:

```ts
    const assertion = new RegExp(
      `(?:\\b(?:it'?s|it\\s+is|that'?s|that\\s+is|this\\s+is|the\\s+answer\\s+is|resolution\\s+is|belongs?\\s+to)\\s+(?:the\\s+|a\\s+|an\\s+)?${p}\\b` +
      `|\\b${p}\\s+after\\s+all\\b` +
      `|\\b${p}\\s+(?:is|was)\\s+(?:the\\s+(?:one|answer)|correct|right|exactly\\s+(?:it|right))\\b` +
      // Verdict opener then the value, within the opening clause only:
      // "Right. Twelve —", "Exactly. 12 it is." Anchored at the start so a
      // mid-explanation mention of the value never fires.
      `|^\\s*(?:${VERDICT_OPENER})\\b[\\s.,!—-]*${p}\\b)`,
      'i',
    );
```

⚠️ The existing regex has no `i` flag because `normalize` lowercases. Adding `'i'` is harmless and makes the new anchored alternative readable; keep `normalize` doing the lowercasing either way.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd apps/tutor && npm run test:denied-answer-reversal`
Expected: PASS — `0 failed`, with all three fail-closed checks still `ok`.

- [ ] **Step 5: Enable it at the call site**

In `VoiceTutorRealtime.tsx`, find the `checkDeniedAnswerReversal({` call and add:

```ts
                      normalizeSpokenWords: TUTOR_SPOKEN_NUMBER_GUARDS,
```

- [ ] **Step 6: Typecheck and commit**

Run: `cd apps/tutor && npx tsc --noEmit` — expected clean.

```bash
git add apps/tutor/src/lib/tutor/voice/denied-answer-reversal.ts \
        apps/tutor/scripts/test-denied-answer-reversal.ts \
        apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx
git commit -m "fix(tutor): reversal guard compared a stashed '12' to a spoken 'Twelve'

portal-9a9b7c09 denied a correct '12' at 748.6s and affirmed it at 763.6s.
The stash holds digits, the tutor reverses in words, so \\b12\\b never
matched and the guard returned before its assertion check. Normalize both
sides and add the verdict-opener + bare-value shape a math tutor uses.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

### Task 8: The board holds the right answer while the speech says the wrong one

**Root cause (live, twice).** In `portal-9a9b7c09` the tool calls were correct and the speech in the *same turn* was wrong:

```
369.2s  speech  "Right. Nine, nine, nine, four"
370.9s  board   showEquation-9  "(3-7)^2=16, (4-7)^2=9, (4-7)^2=9, (5-7)^2=4"   ← correct

451.1s  speech  "Sixteen plus nine plus nine plus four plus one-forty-four — that's thirty-eight"
460.8s  board   showEquation-11 "16 + 9 + 9 + 4 + 144 = 182"                     ← correct
```

The judge caught both (`judge_advisory_was_kill` at 375.5s and 459.5s) and is advisory-only by design, so nothing aired. But ground truth was already on the board, which means a **deterministic** detector is possible — and a deterministic detector may kill under Pillar 2b.

`detectUnanchoredQuantities({ turnText, renderedText })` already compares this turn's spoken quantities against this turn's render payloads (`VoiceTutorRealtime.tsx:14005`, `TUTOR_QUANTITY_ANCHOR`); it fired twice here as coverage advisories (*"3/4 spoken value(s) never reached the board: 160, 144, 16"*). This task adds the inverse: **the same expression appears on the board and in speech with a different result.** Coverage asks "did the number reach the board?"; this asks "does the board disagree?"

**Deliberately narrow.** Fires only when a normalized `<operand-chain> = <value>` from a render payload has the identical operand chain in the spoken text with a different value. No expression matching, no algebra, no partial credit — an exact operand-sequence match or nothing.

**Files:**
- Create: `apps/tutor/src/lib/tutor/voice/board-contradiction.ts`
- Create: `apps/tutor/scripts/test-board-contradiction.ts`
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (turn-end, beside the `TUTOR_QUANTITY_ANCHOR` block at ~14005)
- Modify: `apps/tutor/src/app/tutor-portal/embed/page.tsx`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: `spokenNumbersToDigits` (Task 5).
- Produces: `export function detectBoardContradiction(args: { turnText: string; renderedText: string }): { verdict: 'ok' } | { verdict: 'contradiction'; expr: string; boardValue: string; spokenValue: string }`.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-board-contradiction.ts`:

```ts
/**
 * portal-9a9b7c09: the board wrote "16 + 9 + 9 + 4 + 144 = 182" while the
 * same turn's speech said the total was thirty-eight. The judge flagged it at
 * kill severity and, being advisory-only, aired nothing.
 *
 * Usage: npx tsx scripts/test-board-contradiction.ts  (npm run test:board-contradiction)
 */
import { detectBoardContradiction } from '../src/lib/tutor/voice/board-contradiction';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── the live incident ───
{
  const r = detectBoardContradiction({
    turnText: "Right. Sixteen plus nine plus nine plus four plus one-forty-four — that's *thirty-eight*.",
    renderedText: '16 + 9 + 9 + 4 + 144 = 182',
  });
  check('portal-9a9b7c09 @451.1s: board 182 vs spoken 38 → contradiction',
    r.verdict === 'contradiction', JSON.stringify(r));
}
{
  const r = detectBoardContradiction({
    turnText: "Right. Sixteen plus nine plus nine plus four plus one-forty-four — that's one hundred and eighty-two.",
    renderedText: '16 + 9 + 9 + 4 + 144 = 182',
  });
  check('speech AGREEING with the board → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = detectBoardContradiction({
    turnText: 'Right. 16 + 9 + 9 + 4 + 144 = 38',
    renderedText: '\\text{Sum} = 16 + 9 + 9 + 4 + 144 = 182',
  });
  check('LaTeX wrapper on the board side → contradiction', r.verdict === 'contradiction', JSON.stringify(r));
}

// ─── FAIL CLOSED ───
{
  const r = detectBoardContradiction({ turnText: 'Nice work — that lands on 182.', renderedText: '16 + 9 + 9 + 4 + 144 = 182' });
  check('speech with no operand chain → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = detectBoardContradiction({ turnText: 'Right, 2 + 2 = 5.', renderedText: '16 + 9 + 9 + 4 + 144 = 182' });
  check('different expression entirely → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = detectBoardContradiction({ turnText: 'Right. 16 + 9 + 9 + 4 + 144 = 182', renderedText: '' });
  check('empty board → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = detectBoardContradiction({ turnText: '', renderedText: '16 + 9 = 25' });
  check('empty speech → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  // Operand order matters — a reordered chain is a different claim, not a
  // contradiction to assert on.
  const r = detectBoardContradiction({ turnText: 'Right, 9 + 16 = 30.', renderedText: '16 + 9 = 25' });
  check('reordered operands → ok', r.verdict === 'ok', JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Register and run to verify it fails**

Add to `apps/tutor/package.json`:

```json
    "test:board-contradiction": "npx tsx scripts/test-board-contradiction.ts",
```

Run: `cd apps/tutor && npm run test:board-contradiction`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the pure module**

Create `apps/tutor/src/lib/tutor/voice/board-contradiction.ts`:

```ts
/**
 * The same arithmetic chain, written correctly on the board and spoken
 * incorrectly in the same turn.
 *
 * portal-9a9b7c09 (2026-09-04): showEquation-11 painted
 * "16 + 9 + 9 + 4 + 144 = 182" at 460.8s while the speech at 451.1s said the
 * total was thirty-eight. The LLM judge caught it at kill severity
 * (judge_advisory_was_kill) and, being advisory-only under Pillar 2b, aired
 * nothing. The board is deterministic ground truth the tutor itself produced,
 * so this comparison can kill where the judge may not.
 *
 * Deliberately exact: an operand chain matches only if the SAME operands
 * appear in the SAME order with the SAME operator. No algebra, no reordering,
 * no partial credit — anything less certain returns ok.
 *
 * Pure module — no side effects, never throws.
 */
import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';

export type BoardContradictionResult =
  | { verdict: 'ok' }
  | { verdict: 'contradiction'; expr: string; boardValue: string; spokenValue: string };

const OK: BoardContradictionResult = { verdict: 'ok' };

const NUM = String.raw`-?\d+(?:\.\d+)?`;
/** "<n> op <n> [op <n>]… = <n>", one operator family, three or more operands. */
const EQN_RE = new RegExp(
  String.raw`(${NUM}\s*([+*])\s*${NUM}(?:\s*\2\s*${NUM})+)\s*=\s*(${NUM})`,
  'g',
);

/** LaTeX and speech punctuation → a bare arithmetic string. */
function flatten(s: string): string {
  return (s ?? '')
    .replace(/\\(?:text|mathrm|label)\s*\{[^}]*\}/g, ' ')
    .replace(/[$\\{}]/g, ' ')
    .replace(/[×·]/g, '*')
    .replace(/−/g, '-')
    .replace(/\bplus\b/gi, '+')
    .replace(/\btimes\b/gi, '*')
    .replace(/\s+/g, ' ')
    .trim();
}

function key(expr: string): string {
  return expr.replace(/\s+/g, '');
}

export function detectBoardContradiction(args: {
  /** Everything the tutor said this turn. */
  turnText: string;
  /** Concatenated render payload text for this turn. */
  renderedText: string;
}): BoardContradictionResult {
  const board = flatten(args.renderedText);
  const spoken = flatten(spokenNumbersToDigits(args.turnText ?? ''));
  if (!board || !spoken) return OK;

  const boardValues = new Map<string, string>();
  EQN_RE.lastIndex = 0;
  for (let m = EQN_RE.exec(board); m !== null; m = EQN_RE.exec(board)) {
    boardValues.set(key(m[1]), m[3]);
  }
  if (boardValues.size === 0) return OK;

  EQN_RE.lastIndex = 0;
  for (let m = EQN_RE.exec(spoken); m !== null; m = EQN_RE.exec(spoken)) {
    const k = key(m[1]);
    const boardValue = boardValues.get(k);
    if (boardValue !== undefined && parseFloat(boardValue) !== parseFloat(m[3])) {
      return { verdict: 'contradiction', expr: m[1], boardValue, spokenValue: m[3] };
    }
  }
  return OK;
}
```

⚠️ The spoken side must also parse `"— that's *38*"` as the `= <value>` half. The normalizer turns the words into digits but leaves the prose connector. Extend `flatten` with `.replace(/—?\s*(?:that'?s|equals|comes out to|gives|is)\s*\*?/gi, ' = ')` **before** the whitespace collapse, then re-run Step 4; the first test case is the one that proves it.

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run test:board-contradiction`
Expected: PASS — `0 failed`. If case 1 still returns `ok`, the spoken side is not producing an `=`; print `flatten(spokenNumbersToDigits(turnText))` and fix the connector rule rather than loosening `EQN_RE`.

- [ ] **Step 5: Add the flag**

In `orchestrator/flags.ts`, after the Task 6 flag:

```ts
/** portal-9a9b7c09 (2026-09-04): showEquation-11 painted
 *  "16 + 9 + 9 + 4 + 144 = 182" while the same turn's speech said the total
 *  was thirty-eight. The judge flagged it at kill severity and, being
 *  advisory-only, aired nothing. The board is ground truth the tutor wrote
 *  itself, so this deterministic comparison may kill.
 *  Default ON; NEXT_PUBLIC_TUTOR_BOARD_CONTRADICTION=off is the switch. */
export const TUTOR_BOARD_CONTRADICTION =
  process.env.NEXT_PUBLIC_TUTOR_BOARD_CONTRADICTION !== 'off';
```

- [ ] **Step 6: Wire it in beside the quantity-anchor check**

In `VoiceTutorRealtime.tsx`, immediately after the `if (TUTOR_QUANTITY_ANCHOR) { … }` block (~14005), add:

```ts
        // The CONTRADICTION companion to the coverage check above. Coverage
        // asks "did the spoken number reach the board?"; this asks "does the
        // board DISAGREE?" — portal-9a9b7c09 painted the correct total and
        // spoke the wrong one in the same turn, twice.
        if (TUTOR_BOARD_CONTRADICTION) {
          const bc = detectBoardContradiction({
            turnText: fullText,
            renderedText: turnRenderPayloadTextRef.current,
          });
          if (bc.verdict === 'contradiction') {
            console.warn(`[brain-orchestrator] board contradiction: "${bc.expr}" board=${bc.boardValue} spoken=${bc.spokenValue}`);
            onDebugEvent?.(
              'board_contradiction',
              `${bc.expr} · board=${bc.boardValue} spoken=${bc.spokenValue}`,
            );
          }
        }
```

**Ship this ADVISORY first.** It is a brand-new detector on a brand-new signal; one live session's worth of `board_contradiction` events with zero false positives is the evidence needed before it is allowed to kill. Record that decision in the handoff and revisit it in the next round.

- [ ] **Step 7: Register the new debug event**

In `apps/tutor/src/app/tutor-portal/embed/page.tsx`, add `'board_contradiction'` to `EMBED_DEBUG_EVENT_PREFIXES` as an exact full name, beside `'quantities_unanchored'`.

- [ ] **Step 8: Typecheck and commit**

Run: `cd apps/tutor && npx tsc --noEmit` — expected clean.

```bash
git add apps/tutor/src/lib/tutor/voice/board-contradiction.ts \
        apps/tutor/scripts/test-board-contradiction.ts \
        apps/tutor/src/lib/tutor/orchestrator/flags.ts \
        apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx \
        apps/tutor/src/app/tutor-portal/embed/page.tsx \
        apps/tutor/package.json
git commit -m "feat(tutor): detect board/speech arithmetic contradictions (advisory)

portal-9a9b7c09 painted '16 + 9 + 9 + 4 + 144 = 182' while the same turn
said the total was thirty-eight. The judge flagged it at kill severity and
is advisory-only. Ships ADVISORY: a new detector on a new signal needs a
clean live session before it may kill. Flag TUTOR_BOARD_CONTRADICTION.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

## Phase C — Board, speech and lesson state drifting apart

`portal-704e3e01` again. Three defects that are not verdict bugs: internal scaffolding reaching TTS, the orchestrator overriding the brain's correct tool choice and then killing the turn for the override, and a page titled after a problem that was replaced before it rendered. Tasks 9 and 10 are causally linked — the substitution forced the retry whose output leaked the `<result>` block.

---

### Task 9: Internal `<result>` scaffolding was spoken to the student

**Root cause (live, 1027.9s).** The tutor said, aloud and into the persisted transcript:

```
<result>0=0, same as before — infinitely many again, so this is actually
the true-statement twin, not the false one. Let me build a genuinely
different one for variety.</result> That one came back as a regular solve…
```

The meta-narration filter (`VoiceTutorRealtime.tsx:11197`) matches **content phrases** — `the student`, `the active problem`, `let me mark`, … — and never structure. It fired correctly twice in this same session (443.2s, 1254.7s) but only because those blocks happened to contain one of those phrases; this one contained none. The filter's own comment states that dropping removes the sentence from TTS *and* transcript, so its presence in the transcript proves it was never dropped. The turn was a validator retry (confirmed in `brain.stream`: `student="[validator feedback — not from the student] …" → text="<result>0=0, same as before…"`), so Task 10 reduces how often the brain is in this state, but does not close the hole.

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

In `orchestrator/flags.ts`, after the Task 8 flag:

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

### Task 10: `show_problem` is substituted into segment cards that are already spent

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

Both are self-inflicted: the orchestrator overrode the brain's own correct choice, then killed the turn for the override. Each cost ~10s of dead air and a full re-request at ~20K input tokens — and the 1021.1 retry is the turn that leaked the `<result>` block in Task 9. Amisha had asked, in her own words: *"Now let's see uh let's see it let's see a different one."*

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

In `orchestrator/flags.ts`, after the Task 9 flag:

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

### Task 11: The auto-page title names a problem that isn't on the page

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

In `orchestrator/flags.ts`, after the Task 10 flag:

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

## Phase D — Dead starts are undiagnosable by construction

Three sessions, three students, zero debug events each:

| Session | Created | Debug events | What actually happened |
|---|---|---|---|
| `portal-00fa1bb7` | 2026-09-04 00:32:45Z | **0** | Amisha; full prereq chain 200s, then no `brain/stream`; reloaded after ~9s |
| `portal-5bc0fc1e` | 2026-09-04 00:32:54Z | **0** | Same student, **same curriculum module**, 9s later — a genuine retry |
| `portal-c3007206` | 2026-09-03 00:56:00Z | **0** | Vanshika; the real session `portal-255c941b` (69 msgs, 684 events) began 58s later |

The nginx trace for the Amisha pair (times are `+0200`; subtract 2h for UTC):

```
02:32:43  GET  /tutor-portal/embed?token=…session_id=portal-00fa1bb7…   200
02:32:45  GET  /api/tutor/lesson-plans/evelyn.hs.alg1.quadratic-graphs-vertex.v1  200
02:32:45  POST /api/tutor/session-usage   200      ← the upsert that CREATES the doc
02:32:46  POST /api/tutor/realtime-token  200
02:32:49  POST /api/tutor/cartesia-token  200      ← perception connected
02:32:49  POST /api/tutor/session-audio   200 (×2)
          … no brain/stream. reload.
02:32:53  GET  /tutor-portal/embed  200            ← SAME module, 10s later
          … identical chain, again no brain/stream. reload.
02:33:08  GET  /tutor-portal/embed  200            ← different module
02:33:18  GET  /tutor-portal/embed  200            ← third module; brain/stream at 02:33:32
```

**Three separate defects, and they compound.**

**(a) Telemetry does not survive a short session.** `perception_state` fires on mount and `shared_mic` right after — they were emitted here (cartesia-token proves perception connected) and none reached the database. Debug events ride the periodic save (`embed/page.tsx:973`, `setInterval(… , 30_000)`) or the `beforeunload` beacon (`:953`). The embed runs in an **iframe on crimsora.com**, where `beforeunload` is the one unload event that is not reliably delivered; `pagehide` and `visibilitychange` are not registered at all. So a session that dies inside the first 30s loses **100%** of its telemetry — and those are exactly the sessions worth diagnosing. The 2026-08-17 round added `start_tap` telemetry to diagnose dead starts; it has never once survived to the database for a dead start. **Task 12.**

**(b) A document is created before any teaching happens.** The `session-usage` upsert (`route.ts:286`, `upsert: true`) runs on mount, so every embed load mints a `tutorsessions` row. A student browsing the crimsora lesson menu creates one "abandoned" session per click — Amisha's four loads in 35 seconds produced two of them. These rows have no `duration`, no `endedAt` and no events; they were later swept to `status: 'abandoned'` in a batch (both Amisha rows carry the identical `updatedAt` of `2026-09-04T01:08:08.747Z`). They are indistinguishable from a real failed start, which is why all three landed in this triage. **Task 13.**

**(c) The partner reuses session ids across days, and content is appended to old documents.** Decoding the embed tokens straight out of nginx:

```
iat 1788481998 (02:33:18)  session_id = portal-85b2c632-df76-4970-beea-528047a21687
iat 1788482344 (02:39:04)  session_id = portal-85b2c632-df76-4970-beea-528047a21687
```

That id belongs to a document **created 2026-09-01T02:10:13Z**. Its contents:

```
transcript   by day: {"2026-09-01": 69, "2026-09-03": 17, "2026-09-04": 4}
debugEvents  by day: {"2026-09-01": 746, "2026-09-03": 189, "2026-09-04": 60}
whiteboard   by day: {"2026-09-01": 55, "2026-09-03": 12, "2026-09-04": 1}
```

**Three separate tutoring sessions across three days merged into one document**, with the Sep-3 block opening mid-transcript on a `pickup` opener glued to the Sep-1 content. A second document, `portal-60dcca1d` (created 2026-08-31), holds four `perception_state`/`shared_mic` events all stamped 2026-09-04. Every `duration`, `startedAt` and per-session cost figure on these rows is meaningless, and any analysis of "that session" silently reads three days as one. The engine cannot fix the partner's minting, but it must refuse to append across a day boundary and it must make the condition loud. **Task 14.**

**Honest limit on (a):** with zero telemetry we cannot say *why* the first two loads never reached `brain/stream`. The 2026-08-17 round's root cause (a pre-start tap swallowed as a listen-toggle) was fixed in `619a1cac`, and the third and fourth loads used *different* curriculum modules, which reads more like menu navigation than a broken start button. But loads one and two used the **same** module nine seconds apart, which is a retry, not navigation. Task 12 exists so the next occurrence is answerable; no task in this plan claims to fix a start-tap bug, because no evidence in these three sessions identifies one.

---

### Task 12: Telemetry must survive a session shorter than the flush interval

**Files:**
- Modify: `apps/tutor/src/app/tutor-portal/embed/page.tsx` (`:940-956` unload effect, `:970-975` interval effect)
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`
- Create: `apps/tutor/src/lib/tutor/orchestrator/flush-policy.ts`
- Create: `apps/tutor/scripts/test-flush-policy.ts`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: `export function shouldFlushEarly(args: { eventCount: number; lastFlushedCount: number; msSinceMount: number }): boolean` and `export const EARLY_FLUSH_MS`, `export const EARLY_FLUSH_EVENTS`.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-flush-policy.ts`:

```ts
/**
 * portal-00fa1bb7 / portal-5bc0fc1e / portal-c3007206: three dead-start
 * sessions, zero debug events between them. Events ride a 30s interval or a
 * beforeunload beacon that an iframed embed does not reliably get, so a
 * session that dies inside the first flush window loses everything — which
 * is exactly the session worth diagnosing.
 *
 * Usage: npx tsx scripts/test-flush-policy.ts  (npm run test:flush-policy)
 */
import { shouldFlushEarly, EARLY_FLUSH_MS, EARLY_FLUSH_EVENTS } from '../src/lib/tutor/orchestrator/flush-policy';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

check('early window is shorter than the 30s interval', EARLY_FLUSH_MS < 30_000, `${EARLY_FLUSH_MS}`);
check('the event threshold is small', EARLY_FLUSH_EVENTS > 0 && EARLY_FLUSH_EVENTS <= 10, `${EARLY_FLUSH_EVENTS}`);

// portal-00fa1bb7: perception_state ×3 + shared_mic within ~6s of mount, page
// gone by 10s. These four events must have been flushed.
check('four mount events at 6s flush early',
  shouldFlushEarly({ eventCount: 4, lastFlushedCount: 0, msSinceMount: 6_000 }));
check('one event at 2s flushes early',
  shouldFlushEarly({ eventCount: 1, lastFlushedCount: 0, msSinceMount: 2_000 }));

// Nothing new → never post.
check('no new events → no flush',
  !shouldFlushEarly({ eventCount: 4, lastFlushedCount: 4, msSinceMount: 6_000 }));
check('zero events → no flush',
  !shouldFlushEarly({ eventCount: 0, lastFlushedCount: 0, msSinceMount: 6_000 }));

// Past the early window the ordinary 30s interval owns the cadence; this
// must not add a second timer's worth of traffic to a long session.
check('after the early window, no early flush',
  !shouldFlushEarly({ eventCount: 900, lastFlushedCount: 100, msSinceMount: 15 * 60_000 }));

// At-most-once semantics inside the window: a second call with nothing new
// must not re-post.
check('idempotent inside the window',
  !shouldFlushEarly({ eventCount: 7, lastFlushedCount: 7, msSinceMount: 9_000 }));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Register and run to verify it fails**

Add to `apps/tutor/package.json`:

```json
    "test:flush-policy": "npx tsx scripts/test-flush-policy.ts",
```

Run: `cd apps/tutor && npm run test:flush-policy`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the pure module**

Create `apps/tutor/src/lib/tutor/orchestrator/flush-policy.ts`:

```ts
/**
 * When to persist debug events sooner than the ordinary 30s cadence.
 *
 * portal-00fa1bb7, portal-5bc0fc1e and portal-c3007206 (2026-09-03/04) each
 * hold ZERO debug events. All three emitted mount-time perception_state and
 * shared_mic events — the cartesia-token requests in nginx prove perception
 * connected — and none survived: events ride the 30s interval or a
 * beforeunload beacon that an iframed embed does not reliably receive. A
 * session that dies inside the first window loses 100% of its telemetry, and
 * those are precisely the sessions a triage needs.
 *
 * The window is deliberately short and one-shot per new event batch: it costs
 * a long session nothing (after EARLY_FLUSH_MS the 30s interval owns the
 * cadence again) and it costs a dead session one extra POST.
 *
 * Pure module — no side effects, never throws.
 */

/** Mount-relative window during which any new event is worth an immediate post. */
export const EARLY_FLUSH_MS = 10_000;
/** Number of new events that justifies a post inside that window. */
export const EARLY_FLUSH_EVENTS = 1;

export function shouldFlushEarly(args: {
  /** debugEventsRef.current.length */
  eventCount: number;
  /** lastSavedDebugCountRef.current */
  lastFlushedCount: number;
  /** now - mount time */
  msSinceMount: number;
}): boolean {
  if (args.msSinceMount > EARLY_FLUSH_MS) return false;
  return args.eventCount - args.lastFlushedCount >= EARLY_FLUSH_EVENTS;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run test:flush-policy`
Expected: PASS — `0 failed`.

- [ ] **Step 5: Add the flag**

In `orchestrator/flags.ts`, after the Task 11 flag:

```ts
/** portal-00fa1bb7 / portal-5bc0fc1e / portal-c3007206 (2026-09-03/04): three
 *  dead-start sessions with ZERO debug events. Events ride a 30s interval or a
 *  beforeunload beacon an iframed embed does not reliably get. Adds pagehide +
 *  visibilitychange listeners and one early flush inside the first 10s.
 *  Default ON; NEXT_PUBLIC_TUTOR_TELEMETRY_SURVIVAL=off is the switch. */
export const TUTOR_TELEMETRY_SURVIVAL =
  process.env.NEXT_PUBLIC_TUTOR_TELEMETRY_SURVIVAL !== 'off';
```

- [ ] **Step 6: Register the reliable unload events**

In `embed/page.tsx`, replace the unload effect at `:949-955`:

```ts
  // Save as abandoned on page unload.
  // beforeunload alone is not enough: this page runs in an IFRAME on the
  // partner's site, where it is the least reliably delivered unload event.
  // pagehide fires on bfcache navigation and iframe teardown; a
  // visibilitychange to 'hidden' is the only signal on mobile tab-kill.
  // All three funnel into the same idempotent saveSession('abandoned').
  useEffect(() => {
    if (sessionEnded) return;
    const handleUnload = () => saveSession('abandoned');
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') saveSession('abandoned');
    };
    window.addEventListener('beforeunload', handleUnload);
    if (TUTOR_TELEMETRY_SURVIVAL) {
      window.addEventListener('pagehide', handleUnload);
      document.addEventListener('visibilitychange', handleVisibility);
    }
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [sessionEnded, saveSession]);
```

⚠️ `saveSession('abandoned')` can now fire more than once (a tab hidden then closed). It must stay idempotent: `lastSavedDebugCountRef` already advances at send, so a second call posts no duplicate events, and the server upserts. Confirm by reading the `'abandoned'` branch before committing — **if a second call would double-append transcript entries, add a `didFinalSaveRef` latch instead of shipping this.**

- [ ] **Step 7: Add the early flush**

In `embed/page.tsx`, beside the 30s interval effect (`:970-975`):

```ts
  // Early-window flush (portal-00fa1bb7): the first debug events arrive within
  // ~2s of mount and a dead-start page is gone well before the 30s tick, so
  // without this every dead start persists nothing at all.
  const mountedAtRef = useRef<number>(Date.now());
  useEffect(() => {
    if (!TUTOR_TELEMETRY_SURVIVAL || sessionEnded) return;
    const t = setInterval(() => {
      if (shouldFlushEarly({
        eventCount: debugEventsRef.current.length,
        lastFlushedCount: lastSavedDebugCountRef.current,
        msSinceMount: Date.now() - mountedAtRef.current,
      })) {
        saveSessionRef.current('active');
      }
    }, 2_000);
    return () => clearInterval(t);
  }, [sessionEnded]);
```

Place it AFTER the `saveSessionRef` declaration (`:967`) so the ref is initialized. Add `shouldFlushEarly` and `TUTOR_TELEMETRY_SURVIVAL` to the imports.

- [ ] **Step 8: Typecheck and commit**

Run: `cd apps/tutor && npx tsc --noEmit` — expected clean.

```bash
git add apps/tutor/src/lib/tutor/orchestrator/flush-policy.ts \
        apps/tutor/scripts/test-flush-policy.ts \
        apps/tutor/src/lib/tutor/orchestrator/flags.ts \
        apps/tutor/src/app/tutor-portal/embed/page.tsx \
        apps/tutor/package.json
git commit -m "fix(tutor): dead-start sessions persisted zero telemetry

Three dead starts (portal-00fa1bb7, -5bc0fc1e, -c3007206) hold 0 debug
events each. Events rode a 30s interval or a beforeunload beacon an
iframed embed does not reliably get. Adds pagehide + visibilitychange and
one early flush inside the first 10s. Flag TUTOR_TELEMETRY_SURVIVAL.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

### Task 13: A page load is not a session

**Root cause.** `session-usage` (`route.ts:286`) is `findOneAndUpdate(..., { upsert: true })`, and the embed page posts to it on mount. Every load mints a `tutorsessions` row, so browsing the lesson menu creates one "abandoned" session per click. Amisha's four loads in 35 seconds produced two such rows; Vanshika's produced one 58 seconds before her real session. All three carry no `duration`, no `endedAt` and no events, and were swept to `abandoned` in a batch — indistinguishable from a genuine failed start, which is why all three reached this triage.

**The fix is on the client, not the route.** The route must stay upsert-capable (a resumed session legitimately upserts). The embed page simply must not post a `status: 'active'` save until the session has actually begun — the `evelyn:session-started` event this file already listens for (`:945`) is the existing signal.

**Deliberate consequence:** a session that never starts will have **no row at all** rather than an empty one. That is the correct outcome — the funnel question "how many students opened the page and never started?" belongs to page analytics, not to `tutorsessions`. Say so in the handoff, because it changes what an empty-session count means historically.

**Files:**
- Modify: `apps/tutor/src/app/tutor-portal/embed/page.tsx`
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`

**Interfaces:**
- Consumes: `TUTOR_TELEMETRY_SURVIVAL` behaviour from Task 12 (the early flush must respect the same gate).
- Produces: no new exports.

- [ ] **Step 1: Add the flag**

In `orchestrator/flags.ts`, after the Task 12 flag:

```ts
/** portal-00fa1bb7 / -5bc0fc1e / -c3007206: the session-usage upsert runs on
 *  MOUNT, so every embed load mints a tutorsessions row — a student browsing
 *  the lesson menu creates one "abandoned" session per click, indistinguishable
 *  from a real failed start. Holds the first save until the session actually
 *  starts. A never-started load then has NO row rather than an empty one.
 *  Default ON; NEXT_PUBLIC_TUTOR_DEFER_SESSION_DOC=off is the switch. */
export const TUTOR_DEFER_SESSION_DOC =
  process.env.NEXT_PUBLIC_TUTOR_DEFER_SESSION_DOC !== 'off';
```

- [ ] **Step 2: Latch on the existing session-started event**

In `embed/page.tsx`, beside the `evelyn:session-started` listener (`:945`), set a ref:

```ts
  // A page load is not a session (portal-00fa1bb7). Nothing is persisted until
  // the student actually starts — the same event the parent frame is told about.
  const sessionActuallyStartedRef = useRef(false);
```

…and inside the existing `onStarted` handler, before the `postMessage`:

```ts
      sessionActuallyStartedRef.current = true;
```

- [ ] **Step 3: Gate the saves**

At the top of `saveSession`, immediately after the `duration` line:

```ts
    // Hold every write until the session has actually begun. 'completed' and
    // 'abandoned' still write IF the session started; a load that never
    // started writes nothing at all, by design.
    if (TUTOR_DEFER_SESSION_DOC && !sessionActuallyStartedRef.current) {
      return;
    }
```

⚠️ **Read `onStarted` before writing this.** If `evelyn:session-started` fires on mount rather than on the student's first real turn, this gate does nothing and the task is not done. Verify by reading the dispatcher; if it is mount-time, latch on the first `brain/stream` dispatch instead and say so in the commit message.

- [ ] **Step 4: Verify against the live shape**

There is no unit test for this — it is a behavioural gate in a React component. Verify by reading, then confirm live after deploy (Task 15, Step 7): a fresh embed load that is closed without starting must leave **no** new `tutorsessions` row.

Run: `cd apps/tutor && npx tsc --noEmit` — expected clean.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/app/tutor-portal/embed/page.tsx \
        apps/tutor/src/lib/tutor/orchestrator/flags.ts
git commit -m "fix(tutor): a page load no longer mints a session document

The session-usage upsert ran on mount, so browsing the lesson menu created
one abandoned tutorsessions row per click — portal-00fa1bb7 and -5bc0fc1e
are two such rows 9s apart. Hold every write until the session starts.
Flag TUTOR_DEFER_SESSION_DOC (default ON).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

---

### Task 14: Refuse to append a new session onto an old document

**Root cause.** Crimsora mints embed tokens carrying a `session_id` it reuses across days. Two tokens decoded from nginx on 2026-09-04 (02:33:18 and 02:39:04) both carried `portal-85b2c632-df76-4970-beea-528047a21687`, a document created **2026-09-01T02:10:13Z**. That document now holds three days of three different tutoring sessions:

```
transcript  by day: {"2026-09-01": 69, "2026-09-03": 17, "2026-09-04": 4}
debugEvents by day: {"2026-09-01": 746, "2026-09-03": 189, "2026-09-04": 60}
```

`portal-60dcca1d` (created 2026-08-31) likewise holds four events stamped 2026-09-04. Every `duration`, `startedAt` and per-session cost on these rows is meaningless, and a triage of "that session" silently reads three days as one.

The engine cannot fix the partner's minting. It can refuse the append and make the condition loud enough that the partner integration gets fixed.

**Files:**
- Create: `apps/tutor/src/lib/tutor/portal/session-id-reuse.ts`
- Create: `apps/tutor/scripts/test-session-id-reuse.ts`
- Modify: `apps/tutor/src/app/api/tutor/session-usage/route.ts` (the `findOneAndUpdate` at `:286`)
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: `export function isStaleSessionReuse(args: { existingCreatedAt: Date | string | null | undefined; now: Date; maxAgeMs?: number }): boolean` and `export const SESSION_REUSE_MAX_AGE_MS`.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-session-id-reuse.ts`:

```ts
/**
 * portal-85b2c632 holds three days of three different sessions because the
 * partner minted 2026-09-04 embed tokens carrying a 2026-09-01 session_id.
 *
 * Usage: npx tsx scripts/test-session-id-reuse.ts  (npm run test:session-id-reuse)
 */
import { isStaleSessionReuse, SESSION_REUSE_MAX_AGE_MS } from '../src/lib/tutor/portal/session-id-reuse';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const NOW = new Date('2026-09-04T00:33:18Z');

// ─── the live case ───
check('portal-85b2c632: a 2026-09-01 doc reused on 2026-09-04 is stale',
  isStaleSessionReuse({ existingCreatedAt: new Date('2026-09-01T02:10:13Z'), now: NOW }));
check('portal-60dcca1d: 2026-08-31 doc written on 2026-09-04 is stale',
  isStaleSessionReuse({ existingCreatedAt: new Date('2026-08-31T23:48:24Z'), now: NOW }));
check('string dates are accepted',
  isStaleSessionReuse({ existingCreatedAt: '2026-09-01T02:10:13Z', now: NOW }));

// ─── legitimate resumes must NOT be refused ───
check('a same-session reconnect 3 minutes later is fine',
  !isStaleSessionReuse({ existingCreatedAt: new Date('2026-09-04T00:30:00Z'), now: NOW }));
check('a 90-minute session is fine',
  !isStaleSessionReuse({ existingCreatedAt: new Date('2026-09-03T23:03:18Z'), now: NOW }));
check('a reload 4 hours into a long sitting is fine',
  !isStaleSessionReuse({ existingCreatedAt: new Date('2026-09-03T20:33:18Z'), now: NOW }));

// ─── a brand-new session has no existing doc ───
check('no existing doc → not reuse',
  !isStaleSessionReuse({ existingCreatedAt: null, now: NOW }));
check('undefined → not reuse',
  !isStaleSessionReuse({ existingCreatedAt: undefined, now: NOW }));
check('unparseable date → not reuse (fail closed)',
  !isStaleSessionReuse({ existingCreatedAt: 'not-a-date', now: NOW }));

check('the window is longer than any plausible single sitting',
  SESSION_REUSE_MAX_AGE_MS >= 6 * 3_600_000, `${SESSION_REUSE_MAX_AGE_MS}`);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Register and run to verify it fails**

Add to `apps/tutor/package.json`:

```json
    "test:session-id-reuse": "npx tsx scripts/test-session-id-reuse.ts",
```

Run: `cd apps/tutor && npm run test:session-id-reuse`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the pure module**

Create `apps/tutor/src/lib/tutor/portal/session-id-reuse.ts`:

```ts
/**
 * Is this write landing on a session document from an earlier sitting?
 *
 * portal-85b2c632-df76-4970-beea-528047a21687 (created 2026-09-01T02:10:13Z)
 * holds transcript entries from 2026-09-01 (69), 2026-09-03 (17) and
 * 2026-09-04 (4) because the partner minted Sep-3 and Sep-4 embed tokens
 * carrying the Sep-1 session_id — verified by decoding the tokens out of the
 * nginx access log. portal-60dcca1d (created 2026-08-31) likewise holds four
 * events stamped 2026-09-04. Every duration, startedAt and per-session cost on
 * such a row is meaningless.
 *
 * The threshold is generous on purpose. A legitimate resume — a reconnect, a
 * reload, a student returning after a break — happens within one sitting; the
 * observed corruption spans DAYS. Anything under the window is allowed, so a
 * long real session can never be refused.
 *
 * Pure module — no side effects, never throws.
 */

/** Longer than any plausible single sitting; far shorter than the observed
 *  3-day spans. */
export const SESSION_REUSE_MAX_AGE_MS = 12 * 3_600_000; // 12h

export function isStaleSessionReuse(args: {
  existingCreatedAt: Date | string | null | undefined;
  now: Date;
  maxAgeMs?: number;
}): boolean {
  const raw = args.existingCreatedAt;
  if (raw === null || raw === undefined) return false;
  const created = raw instanceof Date ? raw : new Date(raw);
  const t = created.getTime();
  if (Number.isNaN(t)) return false;   // unparseable → never refuse
  const age = args.now.getTime() - t;
  if (age < 0) return false;           // clock skew → never refuse
  return age > (args.maxAgeMs ?? SESSION_REUSE_MAX_AGE_MS);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run test:session-id-reuse`
Expected: PASS — `0 failed`.

- [ ] **Step 5: Refuse the append in the route**

In `apps/tutor/src/app/api/tutor/session-usage/route.ts`, immediately BEFORE the `findOneAndUpdate` at `:286`, read the existing document's `createdAt` and refuse a stale append:

```ts
    // Cross-sitting append refusal (portal-85b2c632). The partner mints embed
    // tokens that reuse a session_id across days, so a new session's transcript
    // was being appended onto a document created days earlier — three days of
    // three sessions in one row. Refuse the append, log loudly enough for the
    // partner integration to be fixed, and let the caller carry on: losing one
    // session's telemetry is far better than corrupting a third document.
    const existing = await TutorSession.findOne({ sessionId }, { createdAt: 1 }).lean();
    if (isStaleSessionReuse({ existingCreatedAt: (existing as { createdAt?: Date } | null)?.createdAt, now: new Date() })) {
      console.error(
        `[session-usage] REFUSING stale session-id reuse: ${sessionId} was created ` +
        `${(existing as { createdAt?: Date }).createdAt?.toISOString()} — partner minted a token reusing it. ` +
        `partner=${partnerId ?? 'unknown'}`,
      );
      return NextResponse.json(
        { ok: false, error: 'stale_session_id_reuse', sessionId },
        { status: 409 },
      );
    }
```

Add the import. Use whatever variable already holds the partner id in this route (read the surrounding lines — do not invent `partnerId` if it is named differently).

⚠️ **A 409 must not break the live session.** The embed's `saveSession` already does `.catch(() => {})` on the `fetch` and `sendBeacon` ignores the response, so a 409 is inert client-side. Confirm that by reading before committing; if any caller treats a non-200 as fatal, log-and-allow instead of returning 409, and say so in the commit message.

- [ ] **Step 6: Typecheck and commit**

Run: `cd apps/tutor && npx tsc --noEmit` — expected clean.

```bash
git add apps/tutor/src/lib/tutor/portal/session-id-reuse.ts \
        apps/tutor/scripts/test-session-id-reuse.ts \
        apps/tutor/src/app/api/tutor/session-usage/route.ts \
        apps/tutor/package.json
git commit -m "fix(tutor): refuse to append a new session onto a days-old document

portal-85b2c632 holds 2026-09-01 (69 msgs), 2026-09-03 (17) and 2026-09-04
(4) because crimsora minted new tokens reusing a 3-day-old session_id
(verified by decoding the tokens from nginx). Refuse an append onto a doc
older than 12h and log it loudly; legitimate resumes are unaffected.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UurTavGgcxtzJN28oKhsR2"
```

**Follow-up for Praveen, not a task here:** the partner-side fix belongs to crimsora — the embed token should carry a fresh `session_id` per launch. Until it does, Task 14 only prevents further corruption; the existing rows stay merged. Deciding whether to split `portal-85b2c632` retroactively is a data call, not a code one.

---

### Task 15: Ship gate

Run the whole gate **on the merged tree**, not on this branch alone. Nothing ships without Praveen's go-ahead.

- [ ] **Step 1: Merge origin/main into the worktree**

```bash
cd /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-rounds
git fetch origin && git merge origin/main
```
Expected: clean merge. Resolve any conflict before continuing — the gate below is meaningless on an unmerged tree.

- [ ] **Step 2: Typecheck**

Run: `cd apps/tutor && npx tsc --noEmit`
Expected: clean, no output. (`tsc --noEmit` does NOT cover `scripts/`; the harnesses are exercised by running them.)

- [ ] **Step 3: Full test sweep**

Run: `cd apps/tutor && npm run test:all`
Expected: **≥ 205/209 plus the nine new suites**, with exactly the four known pre-existing failures from Global Constraints and nothing else.

Every suite this plan touches or creates must be green:
`test:false-assertion` · `test:verdict-preservation` · `test:kill-scope` · `test:spoken-numbers` · `test:arith-claim` · `test:denied-answer-reversal` · `test:board-contradiction` · `test:meta-narration` · `test:show-problem-substitution` · `test:page-title` · `test:flush-policy` · `test:session-id-reuse`

If a fifth pre-existing suite is red, it belongs to this round — fix it; do not add it to the known list.

- [ ] **Step 4: Production build**

Run: `cd apps/tutor && npm run build`
Expected: clean.

- [ ] **Step 5: Prove every new flag is inlined into the client bundle**

Nine of these flags are read in client components, so a missing `NEXT_PUBLIC_` prefix ships them as `undefined` and silently disables the fix — the class that shipped perception stage `-1` on 2026-08-18. Prove inlining rather than assume it:

```bash
cd apps/tutor
for f in TUTOR_VERDICT_REPLANT_ON_KILL TUTOR_KILL_WITHHOLDS_ADVANCE \
         TUTOR_SPOKEN_NUMBER_GUARDS TUTOR_BOARD_CONTRADICTION \
         TUTOR_META_NARRATION_STRUCTURAL TUTOR_SUBSTITUTE_GATE \
         TUTOR_PAGE_TITLE_FROM_RENDER TUTOR_TELEMETRY_SURVIVAL \
         TUTOR_DEFER_SESSION_DOC; do
  echo -n "$f bare-name occurrences in bundle: "
  grep -ro "NEXT_PUBLIC_$f" .next/static/chunks/ | wc -l
done
```
Expected: **0** for every flag. A non-zero count means the literal env-var NAME survived into the chunk — the value was never inlined and the flag is dead. (The build inlines the *value*, so the name should not appear.)

- [ ] **Step 6: Report to Praveen and STOP**

Post the gate results — tsc, `test:all` counts, build, the flag-inlining counts — and the list of nine flags with their kill switches. **Do not run `./deploy-tutor.sh`.** Praveen gates every deploy; announce before and after with an expected duration (~8-9 min) once he says go.

- [ ] **Step 7: After deploy — live-verify**

Most of this cannot be confirmed by the typed-input harness. In the next real session's `debugEvents`:

| Expect to see | Expect NOT to see |
|---|---|
| `show_problem_substitution_skipped` on a repeat/complete card | `show_segment_card_completed_blocked` following a `show_problem_substituted` |
| `auto_newpage_retitled_from_render` after a `generate_problem` | a page title naming a different problem than its card |
| `verdict_replant_requested` / `kill_withheld_lesson_tool` **if** a kill fires | `false_assertion_kill` where the asserted value matches what the student just said |
| `board_contradiction` — **review every one by hand** (advisory-only this round) | any `<result>` / `<span` in the transcript |
| `perception_state` + `shared_mic` present in a session under 30s | a session document with 0 debug events |

Phase D needs three explicit checks that are not debug events:
1. **Telemetry survival** — open the embed, wait 5 seconds, close the tab. A `tutorsessions` row must exist for it only if you started the session; if you did start it, its `debugEvents` must be non-empty.
2. **Deferred doc** — open the embed and close it WITHOUT starting. `db.tutorsessions.find({createdAt: {$gte: <t>}})` must return nothing.
3. **Reuse refusal** — grep for the refusal: `ssh root@84.247.185.169 'grep -a "REFUSING stale session-id reuse" /root/.pm2/logs/evelyn-tutor-out.log'`. A hit is the partner still minting reused ids — expected until crimsora fixes its side, and the evidence to send them.

---

## Out of scope — recorded, not built

Each entry says why. None of these is a placeholder for missing work in this plan.

**From `portal-704e3e01`:**
- **Speech naming content that isn't on the board** (1116.4s, *"Let's try that negative-sign trap fresh"* over a fractions card). Purely downstream of Tasks 2 and 10. Re-check after this round rather than fixing blind.
- **Metaphor churn** — four analogies for one LCM idea in 110s (market 194.5s, ticket blocks 242.2s, coupon 307.6s, store price tag 524.7s), continuing *after* the student said *"Why do I keep getting confused with words? … Because it's words."* (302.9s/304.6s). She said "I don't know fractions" three times and twice asked to have it written down. The durable fix is an orchestrator counter of distinct simile openers per segment, not a prompt rule; it needs its own design pass and must stay generic per `feedback_generic_prompts`.
- **Verbatim stall-loop** — "Take your time — no rush." twice, 20s apart (1299.9s, 1319.7s) — plus three `segment_overlong` events. `segment_overlong` is currently observational; wiring it to an escalation is a pacing round.
- **Latency and cost** — $4.31/29min; the only three student→tutor gaps over 12s (15.3s, 15.3s, 19.5s) were all kill-and-retry turns at ~21s brain time and ~28K input tokens. No task of its own: Tasks 1, 2 and 10 remove three of that session's four retries, so this is *verified*, not built. Count `brain_validator_retry` in the post-deploy session.
- **A kill without its telemetry** — the `false_final_assertion` rejection at 1113.7s reached `brain_validator_retry` with **no** matching `false_assertion_kill` among 1,016 events, although the sole call site emits one, the type IS in `EMBED_DEBUG_EVENT_PREFIXES`, and the same emitter fired normally at 1414.3s. Suspect a race in the incremental `debugEventsRef.slice(lastSavedDebugCountRef.current)` flush — **Task 12 may well fix it incidentally**; check after deploy. Not a task because there is no verified root cause and a plan step must not guess at one.

**From `portal-9a9b7c09`:**
- **Correct answer affirmed with fabricated reasoning** (349.1s: *"Uh, 20 on the top"* was RIGHT — `10 × 2(x+3)/5` does put `20(x+3)` over the denominator — and the tutor justified it with "4x + 12 … becomes 20"). `judge_advisory_flag` fired at 357.4s, advisory-only. This is the verdict bank's `inc-premature-affirm-reversal` class with a twist: the *verdict* is correct and only the *justification* is fabricated, which `praise-contradiction.ts` structurally cannot see. **Add it as a pinned probe in `probes/incidents.ts` in the round that guards it**, per the bank's growth rule.
- **In-turn affirm-then-reverse** (451.1s "Right… that's thirty-eight" → 455.8s "Not quite, close.", one `brain_turn`, two `verdict_hold_started`). `detectPraiseContradiction` missed it because it requires the denial to restate the affirmed phrase. Task 6 catches this specific instance via the arithmetic itself; the general shape was deliberately left unguarded on 2026-08-19 because of a live false-positive class (`mx-partial-two-part`). This session is the **second** live instance — worth reopening with the same-claim-scoping constraint that blocked it, as its own round.
- **Non-answer praise** — `nonanswer-praise.ts` fired 0 times against *"Alright."* → *"Right, seven."* (172.8s). The turn came from a volunteered correction note (`judge_correction_note_consumed` at 170.0s); check whether the note-delivery path bypasses the guard entirely. A one-hour investigation, not a code change with a known shape.
- **Board-anchoring** — 25 tutor turns, 26 whiteboard commands, exactly **one** `show_problem` in 14 minutes, and two `quantities_unanchored` events. Most of the session was taught in speech, which is *why* the deterministic guards had so little to check against. Task 8 exploits what board there was; increasing how much reaches the board is a pedagogy round.

**Technical non-goals:**
- **Carrying MCQ choice *texts* into `currentProblemRef`** (Task 2's non-goal). Would restore false-assertion kill coverage on MCQ cards, which Task 2 trades away for safety. Touches four write sites (`VoiceTutorRealtime.tsx:5714, 5755, 8412, 8426`) and both other `choiceLetters` consumers.
- **The sentence-final-period hole in `assertRe`.** `(?![\d./])` exists to reject a continuing decimal but also rejects a sentence-ending period, so `"…which means x = 13."` never matches at all. The R58 root case only fires because a `$` sits between the value and the period. Widening this would *increase* the guard's kill surface — the wrong direction on this evidence.
- **Splitting the merged documents.** Task 14 stops further corruption; `portal-85b2c632` and `portal-60dcca1d` stay merged. Whether to split them retroactively is a data call for Praveen.
- **The partner-side session-id fix.** Crimsora should mint a fresh `session_id` per embed launch. Engine-side refusal (Task 14) is the mitigation, not the cure.
- **Audio.** Both live sessions clip the int16 floor (45 and 12 samples) — the known `float32ToPCM16` asymmetric-encoding artifact, unchanged by this round.
