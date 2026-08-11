# Verdict-Detector Round (R43) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three deterministic fixes for wrong-verdict classes from session portal-cb2addf5: a praise-echo check (tutor affirms a value that disagrees with what the student said), an inverse-verdict check (tutor denies an answer that matches the verified expected answer), and a self-echo carve-out (the perception classifier stops dropping correct answers that are near-echoes of the question). Plus: loosen the R41 praise-contradiction capture patterns that produced 0 fires in a session full of target-class wrongs.

**Architecture:** One new pure tri-state comparator module (`agree`/`disagree`/`unknown`) wraps the existing `resolveMcqLetter` + `extractAnswerNumber` primitives and adds a spoken-form→symbolic normalization layer. Two new pure detector modules consume it and wire into the existing sentence-arrival kill+retry seam in `callBrainOnce` (the same `performKill` + `judgeRetriesUsed` pattern as `checkArithmeticClaims` / `checkSimplificationVerdict`). The carve-out extends `classifyHeuristic`'s input and short-circuits echo-class drops. All modules pure, no LLM, unflagged.

**Tech Stack:** TypeScript, Next.js (engine repo evelynlearning), `npx tsx scripts/test-*.ts` harness pattern, `npx tsc --noEmit` gate.

## Global Constraints

- Base branch: new branch `verdict-detector-round` off engine `main` @ 369d7431 (post-R42). Do NOT build in the shared checkout (owned by another session) — use a worktree per superpowers:using-git-worktrees.
- Kill+retry may fire ONLY on verified expected answers (the existing `currentProblemRef.expectedAnswer` feeds: pipeline-verified, plan-authored, improvised-verified). Unverified card content is advisory-only (debug event + correction note, never a kill). — user decision 2026-08-10
- Praise branch compares the AFFIRMATION'S ECHOED VALUE vs the student utterance only; a bare "Right." with no echoed value never fires. No expectedAnswer dependency in the praise branch. — user decision 2026-08-10
- Echo carve-out requires BOTH: utterance matches verified expectedAnswer AND that answer does not appear in the tutor's recent TTS scripts. — user decision 2026-08-10
- `answersAgree` in `problem-generator.ts` must NOT be modified (it gates problem serving). New comparator is a separate module. — user decision 2026-08-10
- The comparator's `unknown` verdict must fire NOTHING (no kill, no advisory) — it only emits coverage telemetry. `disagree` requires full-parse of both sides; anything with unparsed residue is `unknown`.
- Ship unflagged (same posture as arith-claim-check). — user decision 2026-08-10
- Every detector fire and every carve-out emits a debug event, and new event name prefixes must be added to `EMBED_DEBUG_EVENT_PREFIXES` in `src/app/tutor-portal/embed/page.tsx` unless an existing prefix already covers them (grep first — R42 added `transcript_` and `mcq_letter_normalized` late in the array).
- All existing suites must stay green: `test:praise-contradiction`, `test:simplification-verdict`, `test:arith-claim`, `npx tsx scripts/test-perception-classifier.ts`, plus the new harnesses. `npx tsc --noEmit` after every task.

---

### Task 1: Tri-state comparator core (`utterance-answer-match.ts`)

**Files:**
- Create: `src/lib/tutor/voice/utterance-answer-match.ts`
- Test: `scripts/test-utterance-answer-match.ts` (new; register `test:answer-match` in `package.json` scripts next to `test:arith-claim`)

**Interfaces:**
- Consumes: `resolveMcqLetter(answer, choices)` and `extractAnswerNumber(s)` from `@/lib/tutor/voice/problem-generator` (both already exported).
- Produces (later tasks rely on these exact names):
  ```ts
  export type AnswerMatchVerdict = 'agree' | 'disagree' | 'unknown';
  export interface AnswerMatchResult { verdict: AnswerMatchVerdict; reason: string }
  export function matchUtteranceToAnswer(
    utterance: string,
    expected: string,
    choices?: Array<{ letter: string; text: string }>
  ): AnswerMatchResult;
  export function canonicalizeMathExpression(s: string): string | null; // null = unparseable
  ```

- [ ] **Step 1: Write the failing test**

`scripts/test-utterance-answer-match.ts`, following the assert-count pattern of `scripts/test-arithmetic-claim-check.ts` (a `check(name, cond)` helper, exit 1 on any failure). Cases:

```ts
import { matchUtteranceToAnswer, canonicalizeMathExpression } from '../src/lib/tutor/voice/utterance-answer-match';

// — MCQ path —
check('mcq letter agree', matchUtteranceToAnswer('C', 'C', [{letter:'A',text:'1'},{letter:'C',text:'3'}]).verdict === 'agree');
check('mcq letter disagree', matchUtteranceToAnswer('B', 'C', [{letter:'B',text:'2'},{letter:'C',text:'3'}]).verdict === 'disagree');
check('mcq unresolvable utterance is unknown, not disagree', matchUtteranceToAnswer('the third one', 'C', [{letter:'C',text:'3'}]).verdict === 'unknown');
// — numeric path (answersAgree tolerance semantics) —
check('numeric agree with tolerance', matchUtteranceToAnswer('0.785', 'π/4').verdict === 'agree');
check('fraction vs decimal agree', matchUtteranceToAnswer('1/2', '0.5').verdict === 'agree');
check('numeric disagree', matchUtteranceToAnswer('15', '13').verdict === 'disagree');
check('multi-value utterance is unknown', matchUtteranceToAnswer('m is 4 and b is -2', '4').verdict === 'unknown');
// — expression path —
check('expression exact agree', matchUtteranceToAnswer('3x + 2', '3x+2').verdict === 'agree');
check('expression commuted agree', matchUtteranceToAnswer('2 + 3x', '3x+2').verdict === 'agree');
check('frac form agree', matchUtteranceToAnswer('(x+1)/2', '\\frac{x+1}{2}').verdict === 'agree');
check('the session case: -2e^(-2t)', matchUtteranceToAnswer('-2e^(-2t)', '-2e^{-2t}').verdict === 'agree');
check('expression disagree, both fully parsed', matchUtteranceToAnswer('2x', '3x').verdict === 'disagree');
check('unparsed residue is unknown', matchUtteranceToAnswer('something like 3x maybe with a constant', '3x+2').verdict === 'unknown');
check('empty utterance unknown', matchUtteranceToAnswer('', '3x').verdict === 'unknown');
check('empty expected unknown', matchUtteranceToAnswer('3x', '').verdict === 'unknown');
// — canonicalizer directly —
check('canon strips $ and braces', canonicalizeMathExpression('$\\frac{1}{2}x$') === '(1)/(2)x' || canonicalizeMathExpression('$\\frac{1}{2}x$') === 'x(1)/(2)');
check('canon rejects prose', canonicalizeMathExpression('walk me through it') === null);
check('canon unicode minus', canonicalizeMathExpression('−3') === '-3');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx scripts/test-utterance-answer-match.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Write the implementation**

`src/lib/tutor/voice/utterance-answer-match.ts` — pure module, no side effects, never throws. Structure:

```ts
import { resolveMcqLetter, extractAnswerNumber } from '@/lib/tutor/voice/problem-generator';

export type AnswerMatchVerdict = 'agree' | 'disagree' | 'unknown';
export interface AnswerMatchResult { verdict: AnswerMatchVerdict; reason: string }

/** Canonicalize a symbolic math expression to a comparable string.
 *  Returns null when the input has residue we can't account for —
 *  callers treat null as "unknown", which fires nothing. */
export function canonicalizeMathExpression(s: string): string | null {
  let t = (s ?? '').trim()
    .replace(/\\\(|\\\)|\$/g, '')          // math delimiters
    .replace(/\*/g, '')                     // markdown emphasis leaks
    .replace(/−/g, '-')                     // unicode minus
    .replace(/\\[dt]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)')
    .replace(/\\cdot|\\times|×|·/g, '*')
    .replace(/÷/g, '/')
    .replace(/\\left|\\right/g, '')
    .replace(/\\pi(?![a-zA-Z])|π/g, 'pi')
    .replace(/\\theta(?![a-zA-Z])|θ/g, 'theta')
    .replace(/[{}]/g, m => (m === '{' ? '(' : ')'))
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[.?!,;]+$/, '');
  if (!t) return null;
  if (/\\/.test(t)) return null;            // residual latex command → unparseable
  if (!/^[a-z0-9+\-*/^()=.,']+$/.test(t)) return null; // residue → unparseable
  // explicit multiplication → juxtaposition so "3*2x"≡"3(2x)" comparisons
  // don't depend on the writer's style; keep '/' and '^' structural.
  t = t.replace(/\*/g, '');
  return t;
}

/** Commutative top-level term comparison: split on top-level +/- (sign
 *  travels with its term, depth tracked over parens), sort, join. */
function termMultiset(canon: string): string[] { /* depth-tracked splitter, ~15 lines */ }

function expressionsMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const ta = termMultiset(a).sort().join('&');
  const tb = termMultiset(b).sort().join('&');
  return ta === tb;
}

/** True when the utterance contains 2+ separate numeric values in a
 *  multi-assignment shape ("m is 4 and b is -2") — same class the R36
 *  cover-layer extractAnswerToken refuses. */
function isMultiValueUtterance(t: string): boolean {
  const nums = t.match(/-?\d+(?:\.\d+)?/g) ?? [];
  return nums.length >= 2 && /\b(and|,)\b|,/.test(t) && /\b(is|are|equals?)\b/.test(t);
}

export function matchUtteranceToAnswer(
  utterance: string,
  expected: string,
  choices?: Array<{ letter: string; text: string }>
): AnswerMatchResult {
  const u = (utterance ?? '').trim(), e = (expected ?? '').trim();
  if (!u || !e) return { verdict: 'unknown', reason: 'empty side' };
  // 1) MCQ path — only when choices are supplied
  if (choices && choices.length > 0) {
    const lu = resolveMcqLetter(u, choices), le = resolveMcqLetter(e, choices);
    if (lu && le) return lu === le
      ? { verdict: 'agree', reason: `mcq ${lu}` }
      : { verdict: 'disagree', reason: `mcq ${lu}≠${le}` };
    if (le && !lu) return { verdict: 'unknown', reason: 'mcq: utterance unresolvable' };
    // expected not letter-resolvable → fall through to numeric/expression
  }
  // 2) numeric path — answersAgree tolerance, multi-value guarded
  if (isMultiValueUtterance(u)) return { verdict: 'unknown', reason: 'multi-value utterance' };
  const nu = extractAnswerNumber(u), ne = extractAnswerNumber(e);
  const cu = canonicalizeMathExpression(u), ce = canonicalizeMathExpression(e);
  const uIsPureNumber = cu !== null && /^-?[0-9.,/()]+$/.test(cu);
  const eIsPureNumber = ce !== null && /^-?[0-9.,/()]+$/.test(ce);
  if (nu !== null && ne !== null && uIsPureNumber && eIsPureNumber) {
    const tol = Math.max(0.01, Math.abs(ne) * 0.01);
    return Math.abs(nu - ne) <= tol
      ? { verdict: 'agree', reason: `numeric ${nu}≈${ne}` }
      : { verdict: 'disagree', reason: `numeric ${nu}≠${ne}` };
  }
  // 3) expression path — full-parse required on BOTH sides for any verdict
  if (cu === null || ce === null) return { verdict: 'unknown', reason: 'unparseable side' };
  if (expressionsMatch(cu, ce)) return { verdict: 'agree', reason: 'expression match' };
  // π/4 vs 0.785-style: numeric fallback when both sides EVALUATE
  if (nu !== null && ne !== null && nu !== 0 && Math.abs(nu - ne) <= Math.max(0.01, Math.abs(ne) * 0.01)) {
    return { verdict: 'agree', reason: 'numeric-eval match' };
  }
  return { verdict: 'disagree', reason: `expr ${cu}≠${ce}` };
}
```

Implementation note for the engineer: `termMultiset` walks the string char-by-char tracking paren depth; a `+`/`-` at depth 0 splits a term (a leading `-` binds to the first term, and a `-` split carries the sign into the next term so `3x-2` → `['3x','-2']` and `-2+3x` → `['-2','3x']`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx scripts/test-utterance-answer-match.ts` — Expected: all pass, exit 0.
Also: `npx tsc --noEmit` — clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/voice/utterance-answer-match.ts scripts/test-utterance-answer-match.ts package.json
git commit -m "feat(tutor): tri-state utterance-vs-answer comparator (agree/disagree/unknown)"
```

---

### Task 2: Spoken-form normalization layer

**Files:**
- Modify: `src/lib/tutor/voice/utterance-answer-match.ts`
- Test: `scripts/test-utterance-answer-match.ts` (extend)

**Interfaces:**
- Produces: `export function normalizeSpokenMath(utterance: string): string` — spoken-word math → symbolic, hedge/filler stripped. `matchUtteranceToAnswer` now applies it to the UTTERANCE side (never the expected side) before the path cascade.

- [ ] **Step 1: Write the failing tests** (append to the harness)

```ts
import { normalizeSpokenMath } from '../src/lib/tutor/voice/utterance-answer-match';
check('spoken linear form', matchUtteranceToAnswer('three x plus two', '3x+2').verdict === 'agree');
check('hedged question form', matchUtteranceToAnswer('is it 3x + 2?', '3x+2').verdict === 'agree');
check('the answer is prefix', matchUtteranceToAnswer("I think the answer is 15", '15').verdict === 'agree');
check('negative spoken', matchUtteranceToAnswer('negative two e to the negative two t', '-2e^{-2t}').verdict === 'agree');
check('over as division', matchUtteranceToAnswer('minus 3 over 6', '-3/6').verdict === 'agree');
check('spoken fraction words', matchUtteranceToAnswer('one half', '1/2').verdict === 'agree');
check('squared', matchUtteranceToAnswer('x squared plus one', 'x^2+1').verdict === 'agree');
check('hedge does not flip verdict', matchUtteranceToAnswer('maybe 2x?', '3x').verdict === 'disagree');
check('pure prose still unknown', matchUtteranceToAnswer('can you walk me through it', '3x+2').verdict === 'unknown');
check('normalizeSpokenMath direct', normalizeSpokenMath('is it three x plus two?') === '3x+2' || normalizeSpokenMath('is it three x plus two?') === '3 x + 2');
```

- [ ] **Step 2: Run to verify the new cases fail**

Run: `npx tsx scripts/test-utterance-answer-match.ts` — Expected: new cases FAIL, old cases still pass.

- [ ] **Step 3: Implement**

Add to `utterance-answer-match.ts`:

```ts
const HEDGE_PREFIX_RE = /^(?:um+|uh+|okay|ok|so|well|hmm+|oh|i think|i guess|i'd say|maybe|probably|it'?s|it is|that'?s|the answer is|my answer is|is it|would it be|could it be|i got|i get)\b[\s,]*/i;

const SPOKEN_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bnegative\s+/gi, '-'], [/\bminus\s+/gi, '- '], [/\bplus\s+/gi, '+ '],
  [/\btimes\b/gi, '*'], [/\bmultiplied by\b/gi, '*'],
  [/\bdivided by\b/gi, '/'], [/\bover\b/gi, '/'],
  [/\bequals?\b/gi, '='],
  [/\bsquared\b/gi, '^2'], [/\bcubed\b/gi, '^3'],
  [/\be to the\b/gi, 'e^'], [/\bto the power of\b/gi, '^'], [/\bto the\b/gi, '^'],
  [/\bsquare root of\b/gi, 'sqrt'],
  [/\bone half\b/gi, '1/2'], [/\bone third\b/gi, '1/3'], [/\bone quarter\b/gi, '1/4'],
  [/\btwo thirds\b/gi, '2/3'], [/\bthree quarters\b/gi, '3/4'],
  [/\bpoint\b/gi, '.'], [/\bpi\b/gi, 'pi'],
];
const NUMBER_WORDS: Record<string, string> = { zero:'0', one:'1', two:'2', three:'3', four:'4', five:'5', six:'6', seven:'7', eight:'8', nine:'9', ten:'10', eleven:'11', twelve:'12' };

export function normalizeSpokenMath(utterance: string): string {
  let t = (utterance ?? '').trim().replace(/[?.!]+$/, '');
  for (let i = 0; i < 4; i++) {           // strip stacked hedges: "um, I think it's..."
    const next = t.replace(HEDGE_PREFIX_RE, '');
    if (next === t) break; t = next;
  }
  for (const [re, sub] of SPOKEN_REPLACEMENTS) t = t.replace(re, sub);
  t = t.replace(/\b([a-z]+)\b/gi, (w) => NUMBER_WORDS[w.toLowerCase()] ?? w);
  // "3 x" → "3x" (spoken juxtaposition), "e^ -2t" → "e^(-2t)"
  t = t.replace(/(\d)\s+([a-z])\b/gi, '$1$2');
  t = t.replace(/\^\s*(-?\s*\d*\.?\d*[a-z]*)/gi, (_m, p) => `^(${p.replace(/\s+/g, '')})`);
  return t.trim();
}
```

`matchUtteranceToAnswer` change: first line becomes `const u = normalizeSpokenMath(utterance);` (expected side untouched — it's already symbolic). The ONE-WORD ordering constraint: number-word replacement must run AFTER the fraction words ("one half" would otherwise become "1 half").

- [ ] **Step 4: Run tests + tsc** — `npx tsx scripts/test-utterance-answer-match.ts` all pass; `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): spoken-form math normalization for the answer comparator"`

---

### Task 3: Loosen R41 praise-contradiction captures

**Files:**
- Modify: `src/lib/tutor/voice/praise-contradiction.ts`
- Test: `scripts/test-praise-contradiction.ts` (extend; existing 9 cases must stay green)

**Interfaces:**
- Produces (Task 4 imports these): `export const PRAISE_OPENER_RE` (currently module-private) and `export function extractPraiseEcho(turnText: string): string | null` — returns the affirmed value phrase from an opener, or null.

- [ ] **Step 1: Write failing tests** (append; mirror the file's existing pattern)

```ts
// R42 post-mortem: 40-char cap never latched on long math openers
check('long math opener latches', detectPraiseContradiction("Right — $f'(x) = 3x^2 e^{3x} + 2x e^{3x} \\cdot x$. Wait, that should be not $f'(x) = 3x^2 e^{3x} + 2x e^{3x} \\cdot x$ ...") !== null);
// whitespace-bearing $-token enters the value-substitution branch
check('whitespace math token qualifies', detectPraiseContradiction('Right — $3 \\cdot 2x$. So we get $3 \\cdot 2x = 7x$.') !== null);
// extractPraiseEcho: capture without requiring a contradiction
check('echo extraction', extractPraiseEcho('Right — $2x$. Now differentiate again.') === '$2x$');
check('bare praise no echo', extractPraiseEcho('Right. Now try the next one.') === null);
check('non-praise returns null', extractPraiseEcho('Not quite — check the sign.') === null);
```

- [ ] **Step 2: Run to verify new cases fail** — `npx tsx scripts/test-praise-contradiction.ts`

- [ ] **Step 3: Implement**

In `praise-contradiction.ts`:
1. `PRAISE_OPENER_RE`: change the value capture `([^.!?\n]{1,40})` → `([^!?\n]{1,120})` with a non-greedy sentence-end match: `/^\s*(?:right|yes|exactly|correct|perfect|spot on|that'?s (?:right|correct|it))\s*[—–,.:!-]\s*([^!?\n]{1,120}?)[.!?](?:\s|$)/i` — the `.` inside a `$...$` span is rare, but the non-greedy + `(?:\s|$)` terminator stops at the first real sentence boundary; export it.
2. `isMathValueToken`: allow internal whitespace when the token is `$`-delimited or contains a backslash command — replace the `if (!raw || /\s/.test(raw)) return false;` line with `if (!raw) return false; if (/\s/.test(raw) && !/^\$.*\$$/.test(raw) && !/\\/.test(raw)) return false;`.
3. New `export function extractPraiseEcho(turnText)`: run `PRAISE_OPENER_RE`, return the trimmed capture (with `*` stripped, whitespace collapsed — same cleanup as `detectPraiseContradiction` line 102) only when `isMathValueToken(capture)` is true, else null. Bare praise ("Right." with nothing after the terminator) yields no capture → null.

- [ ] **Step 4: Run tests + tsc** — all pass (9 legacy + new), `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit** — `git commit -m "fix(tutor): loosen R41 praise-capture patterns (40-char cap, whitespace tokens) + export echo extraction"`

---

### Task 4: Praise-echo check (echo-vs-utterance kill)

**Files:**
- Create: `src/lib/tutor/voice/praise-echo-check.ts`
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (sentence-arrival seam, directly after the praise-contradiction block ~line 9607)
- Modify: `src/app/tutor-portal/embed/page.tsx` (whitelist — grep `EMBED_DEBUG_EVENT_PREFIXES` first; add `'praise_echo'` if not covered)
- Test: `scripts/test-praise-echo-check.ts` (new; register `test:praise-echo`)

**Interfaces:**
- Consumes: `extractPraiseEcho` (Task 3), `matchUtteranceToAnswer` (Tasks 1–2).
- Produces:
  ```ts
  export interface PraiseEchoResult { verdict: 'ok' | 'false_praise'; affirmed?: string; studentSaid?: string; matchReason?: string }
  export function checkPraiseEcho(args: {
    turnTextSoFar: string;        // accumulated attempt text (same input as detectPraiseContradiction)
    studentUtterance: string;     // the transcript var in callBrainOnce scope
    choices?: Array<{ letter: string; text: string }>;
  }): PraiseEchoResult;
  ```

- [ ] **Step 1: Write failing tests**

```ts
import { checkPraiseEcho } from '../src/lib/tutor/voice/praise-echo-check';
// the R41 target class: affirm echoes a DIFFERENT value than the student said
check('echo disagrees with utterance → false_praise',
  checkPraiseEcho({ turnTextSoFar: 'Right — $2x$. So the second derivative is...', studentUtterance: 'three x' }).verdict === 'false_praise');
// equivalent reformulation is fine
check('equivalent echo ok', checkPraiseEcho({ turnTextSoFar: 'Right — $0.5$. Nice.', studentUtterance: 'one half' }).verdict === 'ok');
// bare praise never fires (user decision: no expectedAnswer fallback)
check('bare praise ok', checkPraiseEcho({ turnTextSoFar: 'Right. Now try the next one.', studentUtterance: 'three x' }).verdict === 'ok');
// unknown comparator verdict never fires
check('unparseable utterance ok', checkPraiseEcho({ turnTextSoFar: 'Right — $2x$. Good.', studentUtterance: 'yeah that thing we did' }).verdict === 'ok');
// MCQ shape
check('mcq echo mismatch fires', checkPraiseEcho({ turnTextSoFar: 'Right — B. Moving on.', studentUtterance: 'C', choices: [{letter:'B',text:'4'},{letter:'C',text:'6'}] }).verdict === 'false_praise');
// denial opener is not praise
check('denial opener ok', checkPraiseEcho({ turnTextSoFar: 'Not quite — $2x$ is the derivative.', studentUtterance: 'three x' }).verdict === 'ok');
```

- [ ] **Step 2: Run to verify failure** — `npx tsx scripts/test-praise-echo-check.ts`

- [ ] **Step 3: Implement the module**

```ts
import { extractPraiseEcho } from '@/lib/tutor/voice/praise-contradiction';
import { matchUtteranceToAnswer } from '@/lib/tutor/voice/utterance-answer-match';

export interface PraiseEchoResult { verdict: 'ok' | 'false_praise'; affirmed?: string; studentSaid?: string; matchReason?: string }

export function checkPraiseEcho(args: {
  turnTextSoFar: string; studentUtterance: string;
  choices?: Array<{ letter: string; text: string }>;
}): PraiseEchoResult {
  const affirmed = extractPraiseEcho(args.turnTextSoFar);
  if (!affirmed) return { verdict: 'ok' };
  const m = matchUtteranceToAnswer(args.studentUtterance, affirmed, args.choices);
  if (m.verdict === 'disagree') {
    return { verdict: 'false_praise', affirmed, studentSaid: args.studentUtterance, matchReason: m.reason };
  }
  return { verdict: 'ok' };
}
```

- [ ] **Step 4: Wire into VTR**

In `VoiceTutorRealtime.tsx`, immediately after the praise-contradiction block (after its closing `}` ~line 9607), same guard pattern:

```ts
// Praise-echo check (verdict-detector round, session portal-cb2addf5):
// the opener affirms a value that DISAGREES with what the student
// actually said ("Right — $2x$." after the student said "3x").
// praise-contradiction above compares the tutor against ITSELF; this
// compares the affirmation against the STUDENT. Tri-state comparator:
// 'unknown' never fires, so hedges/prose can't kill. Pure, no LLM.
if (!attemptKilled && judgeRetriesUsed < MAX_JUDGE_RETRIES) {
  const praiseEchoTextSoFar = (attemptText ? attemptText + ' ' : '') + updatedSentence;
  const pe = checkPraiseEcho({
    turnTextSoFar: praiseEchoTextSoFar,
    studentUtterance: transcript,
    choices: undefined, // letters-only ref: resolveMcqLetter's direct-letter path needs no texts
  });
  if (pe.verdict === 'false_praise') {
    const reason =
      `Your opener affirmed "${pe.affirmed}" but the student actually said "${(pe.studentSaid ?? '').slice(0, 80)}" — those are different values. ` +
      `Re-evaluate the student's ACTUAL answer and open with the true verdict for what THEY said.`;
    rejectionsThisAttempt.push({ action: 'praise_echo_mismatch', reason });
    judgeRetriesUsed++;
    await performKill();
    console.warn(`[brain-orchestrator] praise-echo check: affirmed "${pe.affirmed}" vs student "${(pe.studentSaid ?? '').slice(0, 60)}" — kill + retry`);
    onDebugEvent?.('praise_echo_kill', `affirmed=${pe.affirmed} student=${(pe.studentSaid ?? '').slice(0, 40)} (${pe.matchReason})`);
    continue;
  }
}
```

Import `checkPraiseEcho` next to the existing detector imports (~line 86). MCQ choices note: `currentProblemRef` carries `choiceLetters?: string[]` (R42) but not texts; when `currentProblemRef.current?.hasChoices` is true, build `choices` as `choiceLetters.map(l => ({ letter: l, text: l }))` so `resolveMcqLetter`'s direct-letter path works — the text-match path simply won't trigger, which is the conservative behavior we want. Add that mapping inline where the check is wired.

Then grep `EMBED_DEBUG_EVENT_PREFIXES` in `src/app/tutor-portal/embed/page.tsx` — no existing prefix covers `praise_echo_kill`? Note `'praise_contradiction'` may not be whitelisted either (check); add `'praise_echo'` entry.

- [ ] **Step 5: Run tests + tsc** — new harness green, `npx tsc --noEmit` clean, `npx tsx scripts/test-praise-contradiction.ts` still green.

- [ ] **Step 6: Commit** — `git commit -m "feat(tutor): praise-echo kill — affirmation value vs student utterance disagreement"`

---

### Task 5: Inverse-verdict check (false denial of a verified-correct answer)

**Files:**
- Create: `src/lib/tutor/voice/inverse-verdict-check.ts`
- Modify: `src/lib/tutor/voice/simplification-verdict-check.ts` (export `DENIAL_RE` — one-line change: `export const DENIAL_RE = ...`)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (three places: the seam block; `currentProblemRef` type gains `unverifiedCardAnswer?: string`; the improvised-answer verify-FAILURE branch ~line 10128-10166 stores the claim instead of dropping it)
- Modify: `src/app/tutor-portal/embed/page.tsx` (whitelist `'inverse_verdict'`)
- Test: `scripts/test-inverse-verdict-check.ts` (new; register `test:inverse-verdict`)

**Interfaces:**
- Consumes: `DENIAL_RE` (newly exported), `matchUtteranceToAnswer`.
- Produces:
  ```ts
  export interface InverseVerdictResult { verdict: 'ok' | 'false_denial' | 'advisory_false_denial'; expected?: string; matchReason?: string }
  export function checkInverseVerdict(args: {
    sentence: string;                 // current streamed sentence (denial opener check)
    studentUtterance: string;
    verifiedExpectedAnswer?: string;  // currentProblemRef.expectedAnswer — kill tier
    unverifiedCardAnswer?: string;    // new advisory tier
    choices?: Array<{ letter: string; text: string }>;
  }): InverseVerdictResult;
  ```

- [ ] **Step 1: Write failing tests**

```ts
import { checkInverseVerdict } from '../src/lib/tutor/voice/inverse-verdict-check';
// the (3x+2)-class: verified answer, student says it, tutor denies
check('verified false denial kills', checkInverseVerdict({ sentence: 'Not quite — check that again.', studentUtterance: '3x + 2', verifiedExpectedAnswer: '3x+2' }).verdict === 'false_denial');
check('spoken form matches too', checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: 'three x plus two', verifiedExpectedAnswer: '3x+2' }).verdict === 'false_denial');
check('hedged question form', checkInverseVerdict({ sentence: "That's not it.", studentUtterance: 'is it 3x + 2?', verifiedExpectedAnswer: '3x+2' }).verdict === 'false_denial');
// unverified tier is advisory only
check('unverified → advisory', checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: '3x + 2', unverifiedCardAnswer: '3x+2' }).verdict === 'advisory_false_denial');
// verified tier wins when both present
check('verified beats unverified', checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: '3x + 2', verifiedExpectedAnswer: '3x+2', unverifiedCardAnswer: '99' }).verdict === 'false_denial');
// wrong student answer: denial is correct, no fire
check('true denial ok', checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: '3x + 7', verifiedExpectedAnswer: '3x+2' }).verdict === 'ok');
// comparator unknown never fires
check('unparseable ok', checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: 'hmm let me think', verifiedExpectedAnswer: '3x+2' }).verdict === 'ok');
// non-denial sentence never fires
check('no denial opener ok', checkInverseVerdict({ sentence: 'Good — now factor it.', studentUtterance: '3x + 2', verifiedExpectedAnswer: '3x+2' }).verdict === 'ok');
// no expected answer at all
check('no expected ok', checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: '3x + 2' }).verdict === 'ok');
// mcq: student letter matches verified letter, tutor denies
check('mcq false denial', checkInverseVerdict({ sentence: 'Nope.', studentUtterance: 'C', verifiedExpectedAnswer: 'C', choices: [{letter:'B',text:'B'},{letter:'C',text:'C'}] }).verdict === 'false_denial');
```

- [ ] **Step 2: Run to verify failure** — `npx tsx scripts/test-inverse-verdict-check.ts`

- [ ] **Step 3: Implement the module**

```ts
import { DENIAL_RE } from '@/lib/tutor/voice/simplification-verdict-check';
import { matchUtteranceToAnswer } from '@/lib/tutor/voice/utterance-answer-match';

export interface InverseVerdictResult { verdict: 'ok' | 'false_denial' | 'advisory_false_denial'; expected?: string; matchReason?: string }

export function checkInverseVerdict(args: {
  sentence: string; studentUtterance: string;
  verifiedExpectedAnswer?: string; unverifiedCardAnswer?: string;
  choices?: Array<{ letter: string; text: string }>;
}): InverseVerdictResult {
  if (!DENIAL_RE.test(args.sentence ?? '')) return { verdict: 'ok' };
  const verified = (args.verifiedExpectedAnswer ?? '').trim();
  if (verified) {
    const m = matchUtteranceToAnswer(args.studentUtterance, verified, args.choices);
    if (m.verdict === 'agree') return { verdict: 'false_denial', expected: verified, matchReason: m.reason };
    return { verdict: 'ok' };  // disagree OR unknown: denial stands / can't judge
  }
  const unverified = (args.unverifiedCardAnswer ?? '').trim();
  if (unverified) {
    const m = matchUtteranceToAnswer(args.studentUtterance, unverified, args.choices);
    if (m.verdict === 'agree') return { verdict: 'advisory_false_denial', expected: unverified, matchReason: m.reason };
  }
  return { verdict: 'ok' };
}
```

- [ ] **Step 4: Thread the unverified tier + wire the seam**

(a) `currentProblemRef` type (~line 2023): append `unverifiedCardAnswer?: string` to the ref's object type.

(b) The improvised-claim verification path (~lines 10128-10166): the branch where `verifyClaimedAnswer` FAILS (or its try/catch error path) currently just drops the claim (the `delete (args as ...)` already happened at ~10140). In that failure branch add, guarded on the statement matching the current problem the same way the success branch does:

```ts
if (currentProblemRef.current && !currentProblemRef.current.expectedAnswer) {
  currentProblemRef.current.unverifiedCardAnswer = claimedAnswer;
  onDebugEvent?.('inverse_verdict_unverified_pinned', claimedAnswer.slice(0, 60));
}
```

Read the surrounding branch carefully first: mirror the SAME statement-match condition the success path uses to attach `expectedAnswer`, and never overwrite an existing verified `expectedAnswer`.

(c) The seam block, placed directly after the praise-echo block from Task 4 (same guard):

```ts
// Inverse-verdict check (verdict-detector round): tutor DENIES an answer
// that matches the verified expected answer — the "(3x+2)" class. Kill
// tier = verified expectedAnswer only; brain-claimed-but-unverified card
// answers are advisory (correction note, no kill) — a wrong unverified
// card + correct denial must never kill a good turn.
if (!attemptKilled && judgeRetriesUsed < MAX_JUDGE_RETRIES) {
  const mcqChoices = currentProblemRef.current?.hasChoices && currentProblemRef.current.choiceLetters?.length
    ? currentProblemRef.current.choiceLetters.map((l) => ({ letter: l, text: l }))
    : undefined;
  const inv = checkInverseVerdict({
    sentence: updatedSentence,
    studentUtterance: transcript,
    verifiedExpectedAnswer: currentProblemRef.current?.expectedAnswer,
    unverifiedCardAnswer: currentProblemRef.current?.unverifiedCardAnswer,
    choices: mcqChoices,
  });
  if (inv.verdict === 'false_denial') {
    const reason =
      `You denied the student's answer, but "${(transcript ?? '').slice(0, 80)}" MATCHES the verified expected answer (${inv.expected}). ` +
      `Their answer is correct. Re-emit your response: affirm it plainly, then move the lesson forward.`;
    rejectionsThisAttempt.push({ action: 'inverse_verdict_false_denial', reason });
    judgeRetriesUsed++;
    await performKill();
    console.warn(`[brain-orchestrator] inverse-verdict check: false denial of verified "${inv.expected}" — kill + retry`);
    onDebugEvent?.('inverse_verdict_kill', `expected=${inv.expected?.slice(0, 40)} student=${(transcript ?? '').slice(0, 40)} (${inv.matchReason})`);
    continue;
  }
  if (inv.verdict === 'advisory_false_denial') {
    onDebugEvent?.('inverse_verdict_advisory', `unverified expected=${inv.expected?.slice(0, 40)} student=${(transcript ?? '').slice(0, 40)}`);
    // plant a next-real-turn correction note via the same ref the judge
    // uses (R42-gated against synthetic consumption) — locate
    // pendingJudgeCorrectionNoteRef's plant format at its judge call site
    // and mirror it verbatim with this text:
    // `The student's earlier answer "<utterance>" may actually match the intended answer "<expected>" — re-check and, if right, credit them.`
  }
}
```

The advisory correction-note plant: grep `pendingJudgeCorrectionNoteRef` in VTR, copy the exact assignment shape the judge advisory path uses (string vs object), and only plant when the ref is currently empty (never clobber a judge kill-class note — that "kill-class wins slot" rule is R41 behavior; preserve it).

(d) Export `DENIAL_RE` from `simplification-verdict-check.ts` (add `export` keyword; grep for other `DENIAL_RE` declarations to avoid name clashes).

(e) Whitelist: add `'inverse_verdict'` to `EMBED_DEBUG_EVENT_PREFIXES`.

- [ ] **Step 5: Run everything** — `npx tsx scripts/test-inverse-verdict-check.ts`, `npx tsx scripts/test-simplification-verdict-check.ts` (or its registered `test:simplification-verdict` — check `package.json`), `npx tsc --noEmit`.

- [ ] **Step 6: Commit** — `git commit -m "feat(tutor): inverse-verdict kill — denial of an answer matching the verified expected answer"`

---

### Task 6: Self-echo expected-answer carve-out

**Files:**
- Modify: `src/lib/tutor/voice/perception-classifier.ts`
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (the `classifyHeuristic` call site ~line 14997 + a debug event on carve-out)
- Test: `scripts/test-perception-classifier.ts` (extend — keep every existing case green)

**Interfaces:**
- Consumes: `matchUtteranceToAnswer`, `canonicalizeMathExpression` (Task 1-2).
- Produces:
  - `HeuristicInput` gains `verifiedExpectedAnswer?: string`.
  - `HeuristicResult` gains `carveOut?: 'expected_answer'` (set when the carve-out rescued a would-be echo drop, so the call site can emit telemetry).
  - New export `export function expectedAnswerSpokenInScripts(expected: string, scripts: Array<{ text: string }>): boolean`.

- [ ] **Step 1: Write failing tests** (append to `scripts/test-perception-classifier.ts`, following its existing fixture style — read the file's harness pattern first)

```ts
// Session portal-cb2addf5: "-2e^(-2t)" transcribed perfectly, dropped as
// self-echo (similarity vs the QUESTION "differentiate -2e^{-2t}...").
// With a verified expected answer matching the utterance and the answer
// absent from recent scripts → dispatch, carveOut set.
const carveBase = {
  transcript: '-2e^(-2t)',
  productionState: 'speaking' as const,
  recentTtsScripts: [{ id: 1, text: 'Differentiate $e^{-2t}$ — what do you get? Take the derivative of $e^{-2t}$.', spokenStartedAt: now - 4000, spokenEndedAt: null }],
  onsetDuringTutorSpeech: true, now, speechStartedAt: now - 1500,
};
// (1) without the field: whatever today's verdict is (echo-drop) — assert it drops, pinning the pre-fix behavior
// (2) with verifiedExpectedAnswer: '-2e^{-2t}' → verdict dispatches, result.carveOut === 'expected_answer'
// (3) tutor SPOKE the answer ("...the answer is $-2e^{-2t}$...") → carve-out does NOT apply, still drops
// (4) verifiedExpectedAnswer present but utterance DOESN'T match it ("e^{-2t}") → still drops (no carve-out)
// (5) expectedAnswerSpokenInScripts unit: finds '$-2e^{-2t}$' inside a script line; misses when only 'e^{-2t}' present
```

Write these as real cases with the file's actual `check`/fixture helpers (read the harness first — it has an existing fixture builder for `HeuristicInput`).

- [ ] **Step 2: Run to verify the new cases fail** — `npx tsx scripts/test-perception-classifier.ts`

- [ ] **Step 3: Implement**

In `perception-classifier.ts`:

```ts
import { matchUtteranceToAnswer, canonicalizeMathExpression } from '@/lib/tutor/voice/utterance-answer-match';

/** True when the expected answer's canonical form appears inside any of
 *  the tutor's recent spoken scripts — if the tutor SAID the answer, a
 *  matching utterance may be a genuine acoustic echo and must not be
 *  rescued. Canonical containment, min length 2 to avoid single-char hits. */
export function expectedAnswerSpokenInScripts(
  expected: string,
  scripts: Array<{ text: string }>
): boolean {
  const canonExpected = canonicalizeMathExpression(expected);
  if (!canonExpected || canonExpected.length < 2) return true; // can't prove absence → no carve-out
  for (const s of scripts) {
    // canonicalize each $span$ in the script; also the whole line as a fallback
    const spans = (s.text.match(/\$[^$]+\$/g) ?? []).concat(s.text);
    for (const span of spans) {
      const c = canonicalizeMathExpression(span);
      if (c && c.includes(canonExpected)) return true;
    }
  }
  return false;
}

function expectedAnswerCarveOut(input: HeuristicInput): boolean {
  const expected = (input.verifiedExpectedAnswer ?? '').trim();
  if (!expected) return false;
  if (matchUtteranceToAnswer(input.transcript, expected).verdict !== 'agree') return false;
  return !expectedAnswerSpokenInScripts(expected, input.recentTtsScripts);
}
```

Then in `classifyHeuristic`: identify every return site whose verdict drops the transcript on ECHO grounds (self-voice score ≥ `SELF_VOICE_THRESHOLD`, `SPEAKING_ECHO_OVERLAP_THRESHOLD`, `MIDLENGTH_ECHO_OVERLAP_THRESHOLD`, the phonetic pass, `isOfferedOptionEcho`) — read the function top to bottom and list them; timing-only/noise/non-echo drops are NOT eligible. At each eligible site, before returning the drop:

```ts
if (expectedAnswerCarveOut(input)) {
  return { verdict: /* the function's normal dispatch verdict — read PerceptionVerdict (line 26) and use the same value the healthy-dispatch path returns */,
           reason: `expected-answer carve-out (was: ${originalReason})`, carveOut: 'expected_answer', selfVoiceScore };
}
```

Rather than duplicating that block N times, wrap it: give the function a local `const dropAsEcho = (result: HeuristicResult): HeuristicResult => expectedAnswerCarveOut(input) ? { verdict: DISPATCH_VERDICT, reason: `expected-answer carve-out (was: ${result.reason})`, carveOut: 'expected_answer', selfVoiceScore: result.selfVoiceScore } : result;` and route each eligible echo-drop return through it.

At the VTR call site (~14997): add `verifiedExpectedAnswer: currentProblemRef.current?.expectedAnswer` to the input object, and after the call: `if (heur.carveOut) onDebugEvent?.('echo_carveout', `${heur.reason} · "${transcript.slice(0, 60)}"`);`. Whitelist: add `'echo_carveout'` to `EMBED_DEBUG_EVENT_PREFIXES`.

- [ ] **Step 4: Run tests + tsc** — full classifier suite green (old + new), `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): expected-answer carve-out — correct answers no longer dropped as self-echo of the question"`

---

### Task 7: Full battery + build gate

**Files:** none (verification only)

- [ ] **Step 1: Run the detector suites**

```bash
npx tsx scripts/test-utterance-answer-match.ts
npx tsx scripts/test-praise-echo-check.ts
npx tsx scripts/test-inverse-verdict-check.ts
npx tsx scripts/test-praise-contradiction.ts
npx tsx scripts/test-perception-classifier.ts
npx tsx scripts/test-arithmetic-claim-check.ts
npx tsx scripts/test-simplification-verdict-check.ts
npx tsx scripts/test-verdict-guard.ts 2>/dev/null || npm run test:verdict-guard
npx tsx scripts/test-mcq-letter-homophone.ts
npx tsx scripts/test-judge-correction-note.ts
```
(Where a script name guess misses, check `package.json` `scripts` for the registered `test:*` alias and run that.) Expected: all green.

- [ ] **Step 2: Repo-wide gates**

```bash
npx tsc --noEmit
npm run test:math   # full TTS battery — detector round must not disturb it
npm run build       # prod build must succeed
```
Expected: tsc clean, math suite green (171 pins + stress corpus 0 failures), build completes.

- [ ] **Step 3: Commit any test-registration stragglers, then hand off for review**

Per superpowers:requesting-code-review — final review before merge. Do NOT merge to main or deploy; user gates the ship (live sessions may be active — check `git branch --show-current` and the shared-checkout rule first).

---

## Self-Review (done at write time)

- Spec coverage: praise branch (Task 4), inverse branch + advisory tier (Task 5), carve-out (Task 6), R41 captures (Task 3), comparator + spoken layer (Tasks 1-2), unflagged rollout (no flag tasks — correct), telemetry (`praise_echo_kill`, `inverse_verdict_kill`, `inverse_verdict_advisory`, `inverse_verdict_unverified_pinned`, `echo_carveout` + whitelist steps in Tasks 4-6). ✔
- Loop safety: every kill rides `judgeRetriesUsed < MAX_JUDGE_RETRIES` — bounded like every existing detector; a retry that repeats the false verdict re-fires only within that cap. ✔
- Known judgment calls for the implementing engineer to preserve: comparator never returns `disagree` with unparsed residue; carve-out fails CLOSED (`canonicalizeMathExpression(expected) === null` → treated as "spoken", no rescue); advisory note never clobbers an existing correction note.
