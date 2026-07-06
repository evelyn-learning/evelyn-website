# Teaching Variety — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** On REPEAT sessions of a lesson plan, give an enrolled student fresh hook / worked-example / extension content (same LOs, vocab, difficulty, misconception target) instead of the identical authored script, using a per-plan "already seen" memory.

**Architecture:** A pure seen-memory store (`planContentSeen` on StudentProfile, FIFO cap 3) written at the final session commit by folding filling-extraction into the existing session-summary LLM pass, and read at session start to render a `<content_variety>` directive into the brain's lesson-plan context. All behind `NEXT_PUBLIC_TUTOR_CONTENT_VARIETY` (default OFF, flag-off byte-identical). Only slots with no student-validated answer (hook, worked_example, extension) vary in Phase 1.

**Tech Stack:** TypeScript, Next.js app router, Anthropic SDK (Haiku summary), Mongo StudentProfile store, node:assert unit tests via `tsx`.

## Global Constraints

- Flag `NEXT_PUBLIC_TUTOR_CONTENT_VARIETY`; default OFF; flag-off ⇒ zero added LLM cost + byte-identical prompts/requests.
- Generic prompt wording only — NO subject-specific teaching examples (feedback_generic_prompts).
- Never vary the first session; capture runs every flagged session (incl. first) to seed the baseline.
- Reuse the incremental-commit plumbing from gaps blending (commit ea8ea59); no contract change.
- Pure helpers get unit tests before wiring (TDD).

---

### Task 1: Seen-memory type + store function

**Files:**
- Modify: `src/lib/tutor/student-profile/types.ts` (add `PlanContentSeen`, `PlanContentFillings`, `StudentProfile.planContentSeen`, cap const)
- Modify: `src/lib/tutor/student-profile/store.ts` (add `recordPlanContentSeen`)
- Test: `scripts/test-content-variety.ts` (new)
- Modify: `package.json` (add `test:content-variety` script)

**Interfaces:**
- Produces: `interface PlanContentFillings { hooks: string[]; examples: string[]; problems: string[] }`; `interface PlanContentSeen { hooks: string[]; examples: string[]; problems: string[] }`; `StudentProfile.planContentSeen?: Record<string, PlanContentSeen>`; `PLAN_CONTENT_SEEN_CAP = 3`; `recordPlanContentSeen(profile: StudentProfile, planId: string, fillings: PlanContentFillings): StudentProfile` (pure; FIFO cap, per-plan key, case-insensitive dedup, newest kept).

- [ ] **Step 1: Write the failing test** — create `scripts/test-content-variety.ts`:

```typescript
/**
 * Unit tests for content-variety seen-memory + directive (Phase 1).
 * Run: npm run test:content-variety
 * Design: docs/superpowers/specs/2026-07-05-teaching-variety-plan-freedom-design.md
 */
import { strict as assert } from 'node:assert';
import { recordPlanContentSeen, PLAN_CONTENT_SEEN_CAP } from '../src/lib/tutor/student-profile/store';
import type { StudentProfile, PlanContentFillings } from '../src/lib/tutor/student-profile/types';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.log(`  ✗ ${name}\n      ${(e as Error).message}`); failed++; }
}
function makeProfile(): StudentProfile {
  return {
    id: 's1', mastery: {}, gaps: [], recentSessions: [],
    preferences: {}, createdAt: '2026-07-05T00:00:00.000Z',
    updatedAt: '2026-07-05T00:00:00.000Z', schemaVersion: 1,
  } as StudentProfile;
}
const F = (over: Partial<PlanContentFillings> = {}): PlanContentFillings =>
  ({ hooks: [], examples: [], problems: [], ...over });

console.log('recordPlanContentSeen:');

test('records fillings under the plan id', () => {
  const p = recordPlanContentSeen(makeProfile(), 'plan-A', F({ hooks: ['garden fence'] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.hooks, ['garden fence']);
});

test('separate plans are isolated', () => {
  let p = recordPlanContentSeen(makeProfile(), 'plan-A', F({ hooks: ['a'] }));
  p = recordPlanContentSeen(p, 'plan-B', F({ hooks: ['b'] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.hooks, ['a']);
  assert.deepEqual(p.planContentSeen?.['plan-B']?.hooks, ['b']);
});

test('appends across sessions, newest last', () => {
  let p = recordPlanContentSeen(makeProfile(), 'plan-A', F({ hooks: ['h1'] }));
  p = recordPlanContentSeen(p, 'plan-A', F({ hooks: ['h2'] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.hooks, ['h1', 'h2']);
});

test(`FIFO cap at ${PLAN_CONTENT_SEEN_CAP} (oldest dropped)`, () => {
  let p = makeProfile();
  for (const h of ['h1', 'h2', 'h3', 'h4']) p = recordPlanContentSeen(p, 'plan-A', F({ hooks: [h] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.hooks, ['h2', 'h3', 'h4']);
});

test('case-insensitive dedup keeps newest position', () => {
  let p = recordPlanContentSeen(makeProfile(), 'plan-A', F({ examples: ['5x3 Rug'] }));
  p = recordPlanContentSeen(p, 'plan-A', F({ examples: ['5X3 rug'] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.examples, ['5X3 rug']);
});

test('empty fillings is a no-op (no empty strings stored)', () => {
  const p = recordPlanContentSeen(makeProfile(), 'plan-A', F({ hooks: ['', '  '] }));
  assert.deepEqual(p.planContentSeen?.['plan-A']?.hooks ?? [], []);
});

test('does not mutate the input profile', () => {
  const orig = makeProfile();
  recordPlanContentSeen(orig, 'plan-A', F({ hooks: ['x'] }));
  assert.equal(orig.planContentSeen, undefined);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
```

Add to `package.json` scripts (after `test:resume-seed`):
```json
    "test:content-variety": "npx tsx scripts/test-content-variety.ts",
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:content-variety`
Expected: FAIL — `recordPlanContentSeen` / `PlanContentFillings` not exported.

- [ ] **Step 3: Add the types** to `src/lib/tutor/student-profile/types.ts` — after the `SessionMemory` interface add:

```typescript
/** Bounded record of the specific FILLINGS a student has already been shown
 *  for a given plan, so repeat sessions can diverge from them (content-variety
 *  Phase 1). Short descriptors for narrative slots; problem statements for
 *  graded ones. */
export interface PlanContentSeen {
  hooks: string[];
  examples: string[];
  problems: string[];
}
/** Same shape, used as the per-session extraction payload written in. */
export type PlanContentFillings = PlanContentSeen;
/** Max prior renditions kept per slot per plan (FIFO). */
export const PLAN_CONTENT_SEEN_CAP = 3;
```

In `StudentProfile`, after `metadata?: Record<string, unknown>;` add:
```typescript
  /** Per-plan record of fillings already shown to this student (content
   *  variety Phase 1). Keyed by lessonPlanId. Absent for students who have
   *  never had a flagged session. */
  planContentSeen?: Record<string, PlanContentSeen>;
```

- [ ] **Step 4: Implement `recordPlanContentSeen`** — in `src/lib/tutor/student-profile/store.ts`, after `upsertSessionMemory`, add (and import the const):

```typescript
import { PLAN_CONTENT_SEEN_CAP, type PlanContentFillings, type PlanContentSeen } from './types';

/** Merge one session's used fillings into the per-plan seen-memory (content
 *  variety Phase 1). Pure. Per slot: append new non-empty descriptors,
 *  case-insensitive dedup (newest position wins), FIFO-cap at
 *  PLAN_CONTENT_SEEN_CAP. Absent slots stay absent. */
export function recordPlanContentSeen(
  profile: StudentProfile,
  planId: string,
  fillings: PlanContentFillings,
): StudentProfile {
  const prev: PlanContentSeen = profile.planContentSeen?.[planId] ?? { hooks: [], examples: [], problems: [] };
  const mergeSlot = (old: string[], incoming: string[]): string[] => {
    const out = [...old];
    for (const raw of incoming) {
      const v = (raw ?? '').trim();
      if (!v) continue;
      const i = out.findIndex((e) => e.toLowerCase() === v.toLowerCase());
      if (i !== -1) out.splice(i, 1); // drop old occurrence; re-add at end (newest)
      out.push(v);
    }
    return out.slice(-PLAN_CONTENT_SEEN_CAP);
  };
  const next: PlanContentSeen = {
    hooks: mergeSlot(prev.hooks, fillings.hooks),
    examples: mergeSlot(prev.examples, fillings.examples),
    problems: mergeSlot(prev.problems, fillings.problems),
  };
  return { ...profile, planContentSeen: { ...(profile.planContentSeen ?? {}), [planId]: next } };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:content-variety`
Expected: `7 passed, 0 failed`

- [ ] **Step 6: Commit**

```bash
git add src/lib/tutor/student-profile/types.ts src/lib/tutor/student-profile/store.ts scripts/test-content-variety.ts package.json
git commit -m "feat(tutor): planContentSeen store + recordPlanContentSeen (content-variety phase 1, task 1)"
```

---

### Task 2: Flag + directive builder

**Files:**
- Modify: `src/lib/tutor/orchestrator/flags.ts` (add `TUTOR_CONTENT_VARIETY`)
- Modify: `src/lib/tutor/voice/claude-brain.ts` (add `LessonPlanContext.contentVariety`, `buildContentVarietyDirective`, render into `formatLessonPlanContext`)
- Test: `scripts/test-content-variety.ts` (extend)

**Interfaces:**
- Consumes: `PlanContentSeen` (Task 1).
- Produces: `TUTOR_CONTENT_VARIETY: boolean`; `buildContentVarietyDirective(seen: PlanContentSeen | undefined): string` (pure; `''` when undefined/all-empty, else a `<content_variety>` block); `LessonPlanContext.contentVariety?: PlanContentSeen`.

- [ ] **Step 1: Write the failing test** — append to `scripts/test-content-variety.ts` before the final summary line:

```typescript
import { buildContentVarietyDirective } from '../src/lib/tutor/voice/claude-brain';

console.log('\nbuildContentVarietyDirective:');

test('undefined seen → empty string (byte-identical when absent)', () => {
  assert.equal(buildContentVarietyDirective(undefined), '');
});

test('all-empty slots → empty string', () => {
  assert.equal(buildContentVarietyDirective({ hooks: [], examples: [], problems: [] }), '');
});

test('non-empty → renders a content_variety block listing seen fillings', () => {
  const out = buildContentVarietyDirective({ hooks: ['garden fence'], examples: ['5x3 rug'], problems: [] });
  assert.match(out, /<content_variety>/);
  assert.match(out, /<\/content_variety>/);
  assert.match(out, /garden fence/);
  assert.match(out, /5x3 rug/);
});

test('directive tells the brain to differ + keep LOs/difficulty/misconception', () => {
  const out = buildContentVarietyDirective({ hooks: ['h'], examples: [], problems: [] });
  assert.match(out, /different/i);
  assert.match(out, /difficulty/i);
  assert.match(out, /misconception/i);
});

test('omits an empty slot from the listing', () => {
  const out = buildContentVarietyDirective({ hooks: ['h'], examples: [], problems: [] });
  assert.doesNotMatch(out, /examples already/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:content-variety`
Expected: FAIL — `buildContentVarietyDirective` not exported.

- [ ] **Step 3: Add the flag** — in `src/lib/tutor/orchestrator/flags.ts`, after `TUTOR_STUDENT_PROBLEM_GROUNDING`:

```typescript
// Content variety (teaching-variety phase 1, 2026-07-05): on REPEAT sessions
// of a plan, the brain gets fresh hook/worked-example/extension content
// (same LOs/vocab/difficulty/misconception target) instead of the identical
// authored script, driven by per-plan seen-memory. Default OFF; ships dark.
// See project_tutor_teaching_variety + the phase-1 spec.
export const TUTOR_CONTENT_VARIETY =
  process.env.NEXT_PUBLIC_TUTOR_CONTENT_VARIETY === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_CONTENT_VARIETY === 'true';
```

- [ ] **Step 4: Add the directive builder + context field** — in `src/lib/tutor/voice/claude-brain.ts`:

Add the `PlanContentSeen` import to the existing student-profile-types import (or a new import line):
```typescript
import type { PlanContentSeen } from '@/lib/tutor/student-profile/types';
```

In `interface LessonPlanContext`, after the `sessionMode?` field:
```typescript
  /** Content variety (phase 1): fillings this student has already been shown
   *  for THIS plan on prior sessions. Present only when the client's
   *  TUTOR_CONTENT_VARIETY flag is on AND there is prior-session content to
   *  diverge from. Absent ⇒ no <content_variety> block ⇒ byte-identical. */
  contentVariety?: PlanContentSeen;
```

Add the pure builder (top-level export, near `formatLessonPlanContext`):
```typescript
/** Render the <content_variety> directive from per-plan seen-memory. Returns
 *  '' when there's nothing seen (caller renders nothing → byte-identical).
 *  Generic wording only — no subject-specific teaching content. */
export function buildContentVarietyDirective(seen: PlanContentSeen | undefined): string {
  if (!seen) return '';
  const slots: Array<[string, string[]]> = [
    ['hooks / openers', seen.hooks],
    ['worked-example contexts', seen.examples],
    ['practice problems', seen.problems],
  ];
  const shown = slots.filter(([, arr]) => arr.length > 0);
  if (shown.length === 0) return '';
  const lines: string[] = [
    ``,
    `<content_variety>`,
    `This student has worked through this plan before. Teach the SAME learning objectives, keep the vocabulary, the difficulty level, and the exact misconception each check targets — but make the HOOK, the WORKED EXAMPLE, and the EXTENSION materially different from the standard version and from what they have already seen. Fresh story, fresh objects, fresh numbers; same skill. Do NOT reuse any of these:`,
  ];
  for (const [label, arr] of shown) {
    lines.push(`  already seen (${label}): ${arr.map((s) => `"${s}"`).join(', ')}`);
  }
  lines.push(`</content_variety>`);
  return lines.join('\n');
}
```

In `formatLessonPlanContext`, render it alongside `planFraming`. Find the `return [ ... ].join('\n')` at the end and insert the directive. Change:
```typescript
    ...planFraming,
    completedNote,
  ].join('\n');
```
to:
```typescript
    ...planFraming,
    ...(ctx.contentVariety ? [buildContentVarietyDirective(ctx.contentVariety)].filter(Boolean) : []),
    completedNote,
  ].join('\n');
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:content-variety`
Expected: `12 passed, 0 failed`

- [ ] **Step 6: Type-check + commit**

```bash
npx tsc --noEmit
git add src/lib/tutor/orchestrator/flags.ts src/lib/tutor/voice/claude-brain.ts scripts/test-content-variety.ts
git commit -m "feat(tutor): TUTOR_CONTENT_VARIETY flag + buildContentVarietyDirective (task 2)"
```

---

### Task 3: Capture — extract fillings in the summary pass + persist

**Files:**
- Modify: `src/lib/tutor/student-profile/session-summary.ts` (add optional fillings extraction to the one LLM call)
- Modify: `src/app/api/tutor/student-profile/[id]/route.ts` (gate on `captureContentFillings`, write via `recordPlanContentSeen`, return `planContentSeen` slice)

**Interfaces:**
- Consumes: `recordPlanContentSeen` (Task 1), `PlanContentFillings` (Task 1).
- Produces: `generateSessionRecap(input, opts?: { extractFillings?: boolean }): Promise<{ summary: string; fillings: PlanContentFillings | null }>`; commit body field `captureContentFillings?: boolean`; GET response gains `planContentSeen`.

- [ ] **Step 1: Add `generateSessionRecap`** to `src/lib/tutor/student-profile/session-summary.ts` (keep `generateSessionSummary` as a thin wrapper so nothing else breaks):

```typescript
import type { PlanContentFillings } from './types';

const FILLINGS_SYSTEM = `You produce a JSON object with two fields describing a tutoring session. "summary": a one-paragraph plain-text recap (grade-calibrated, only what the transcript shows, no markdown). "fillings": { "hooks": string[], "examples": string[], "problems": string[] } — SHORT descriptors (≤8 words each) of the specific opening hook/story, the worked-example contexts, and the practice-problem statements ACTUALLY USED this session. Empty arrays if none. Output ONLY the JSON object, no fences, no preamble.`;

/** Session recap. Default = the plain summary string wrapped in the object
 *  (fillings null), one LLM call. With extractFillings, the SAME single call
 *  also returns the fillings-used (content variety). Parse failures degrade to
 *  { summary, fillings: null } — capture never breaks a commit. */
export async function generateSessionRecap(
  input: SessionSummaryInput,
  opts?: { extractFillings?: boolean },
): Promise<{ summary: string; fillings: PlanContentFillings | null }> {
  if (!opts?.extractFillings) {
    return { summary: await generateSessionSummary(input), fillings: null };
  }
  const profile = getGradeProfile(input.grade);
  const userMessage = buildUserMessage(input, profile.band);
  const response = await anthropic.messages.create({
    model: SUMMARY_MODEL,
    max_tokens: 700,
    system: FILLINGS_SYSTEM,
    messages: [{ role: 'user', content: userMessage }],
  });
  const raw = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')
    .trim();
  try {
    const json = JSON.parse(raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim());
    const arr = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').map((s) => s.slice(0, 80)) : [];
    return {
      summary: (typeof json.summary === 'string' && json.summary.trim()) || '(no summary)',
      fillings: { hooks: arr(json.fillings?.hooks), examples: arr(json.fillings?.examples), problems: arr(json.fillings?.problems) },
    };
  } catch {
    return { summary: '(no summary)', fillings: null };
  }
}
```

- [ ] **Step 2: Wire the route** — in `src/app/api/tutor/student-profile/[id]/route.ts`:

Add to imports: `recordPlanContentSeen` from the store, `generateSessionRecap` from session-summary (replace the `generateSessionSummary` import).

Add to `CommitBody`:
```typescript
  /** Content variety (phase 1): when true AND a lessonPlanId is present, the
   *  final-commit summary pass ALSO extracts the fillings used and merges them
   *  into planContentSeen[lessonPlanId]. Client sets it only when its
   *  TUTOR_CONTENT_VARIETY flag is on. */
  captureContentFillings?: boolean;
```

Replace the summary block:
```typescript
      summary = await generateSessionSummary(summaryInput);
```
with:
```typescript
      const recap = await generateSessionRecap(summaryInput, {
        extractFillings: body.captureContentFillings === true && !!body.lessonPlanId,
      });
      summary = recap.summary;
      if (recap.fillings && body.lessonPlanId) {
        profile = recordPlanContentSeen(profile, body.lessonPlanId, recap.fillings);
      }
```

In the GET response object, add `planContentSeen: profile.planContentSeen ?? {}` (so the client can read the current plan's seen slice).

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/lib/tutor/student-profile/session-summary.ts "src/app/api/tutor/student-profile/[id]/route.ts"
git commit -m "feat(tutor): extract+persist content fillings in the summary pass (task 3)"
```

---

### Task 4: Client wiring — read seen at mount, inject, send capture flag

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (fetch planContentSeen into a ref; thread `contentVariety` into lessonPlanContext; send `captureContentFillings` on final commit)

**Interfaces:**
- Consumes: `TUTOR_CONTENT_VARIETY` (Task 2), `LessonPlanContext.contentVariety` (Task 2), GET `planContentSeen` (Task 3).

- [ ] **Step 1: Import the flag** — add `TUTOR_CONTENT_VARIETY` to the existing `@/lib/tutor/orchestrator/flags` import block in VoiceTutorRealtime.tsx.

- [ ] **Step 2: Add a ref** near `studentProfileBlockRef`:

```typescript
  // Content variety (phase 1): the current plan's seen-memory slice, read
  // once from the profile GET at mount. null ⇒ never varied (first time on
  // this plan, flag off, or no studentId).
  const planContentSeenRef = useRef<{ hooks: string[]; examples: string[]; problems: string[] } | null>(null);
```

- [ ] **Step 3: Populate it at the profile fetch** — find the profile GET at ~line 5645 (`studentProfileBlockRef.current = data.block ?? '';`) and add right after:

```typescript
        if (TUTOR_CONTENT_VARIETY && lessonPlanId && data.profile?.planContentSeen?.[lessonPlanId]) {
          const s = data.profile.planContentSeen[lessonPlanId];
          // Only arm when there's actually something seen (≥1 prior session
          // left content) — otherwise the directive stays absent (first session
          // unchanged).
          if ((s.hooks?.length || s.examples?.length || s.problems?.length)) {
            planContentSeenRef.current = { hooks: s.hooks ?? [], examples: s.examples ?? [], problems: s.problems ?? [] };
          }
        }
```

- [ ] **Step 4: Thread into lessonPlanContext** — change the `sessionMode` spread block (~line 6679) to also add `contentVariety`:

```typescript
        const lessonPlanContext = baseLessonPlanContext
          ? {
              ...baseLessonPlanContext,
              ...(TUTOR_PEDAGOGY_OPENER && sessionModeRef.current ? { sessionMode: sessionModeRef.current } : {}),
              ...(TUTOR_CONTENT_VARIETY && planContentSeenRef.current ? { contentVariety: planContentSeenRef.current } : {}),
            }
          : baseLessonPlanContext;
```

- [ ] **Step 5: Send the capture flag on final commit** — in `commitSessionToProfile`, in the `body` object, add:

```typescript
      ...(isFinal && TUTOR_CONTENT_VARIETY && lessonPlanId ? { captureContentFillings: true } : {}),
```

- [ ] **Step 6: Type-check + commit**

```bash
npx tsc --noEmit
git add src/app/tutor/components/VoiceTutorRealtime.tsx
git commit -m "feat(tutor): wire content-variety read/inject/capture into VTR (task 4)"
```

---

### Task 5: Live verification (2 sessions, same student + plan)

**Files:**
- Create: `$CLAUDE_JOB_DIR/tmp/verify-content-variety.ts` (driver, not committed)

- [ ] **Step 1: Write the driver** — Playwright, `NEXT_PUBLIC_TUTOR_CONTENT_VARIETY=on` in the dev env. Fresh studentId. Session 1 on `evelyn.g3.math.area-perimeter.v1` (walk hook + one segment, then End so the final commit + extraction runs). Poll the profile GET until `planContentSeen[planId].hooks` is non-empty. Session 2 same studentId + plan; capture the opener/hook tutor text. Assert: (a) session 1 hook ≈ the authored "garden / fence / grass" framing; (b) `planContentSeen` captured a hook descriptor; (c) session 2's hook does NOT reuse the garden framing (materially different); (d) LOs/vocab unchanged (concept keyIdeas still taught). Also run once with the flag OFF and assert both sessions use the authored hook (byte-identical path).

- [ ] **Step 2: Run**

Run: `NODE_PATH=<repo>/node_modules npx tsx $CLAUDE_JOB_DIR/tmp/verify-content-variety.ts`
Expected: `PASS`.

- [ ] **Step 3: Regression gates**

Run: `npm run test:content-variety && npm run test:gaps && npm run test:resume-seed && npm run test:tutor-reactions && npx tsc --noEmit`
Expected: all green, tsc clean.

- [ ] **Step 4: Final commit (if any verify-driven fixes)** + update memory `project_tutor_teaching_variety.md` to Phase-1-shipped.

---

## Self-Review

- **Spec coverage:** seen-memory type+store (Task 1) ✓ · flag (Task 2) ✓ · directive builder + inject (Task 2 build, Task 4 wire) ✓ · capture folded into summary pass, flag-gated, final-commit-only (Task 3) ✓ · first-session-unchanged + capture-seeds-baseline (Task 3 gate + Task 4 arm-only-when-seen) ✓ · slot list hook/worked/extension (directive wording, Task 2) ✓ · live verify + flag-off byte-identical (Task 5) ✓. Phase 2 (graded slots / Layer 2) intentionally out of scope.
- **Placeholder scan:** none — all code shown.
- **Type consistency:** `PlanContentSeen`/`PlanContentFillings` (Task 1) used identically in Tasks 2–4; `recordPlanContentSeen` signature stable; `generateSessionRecap` return `{summary, fillings}` consumed in Task 3 route; `contentVariety` field name consistent Task 2↔4.
