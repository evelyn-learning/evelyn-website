# GameClass In-Flow — Drop 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Engine-only changes so a GameClass "Ask Tutor" session starts with an instant first line, picks up from the clip using host-supplied context, shows the short title, and skips the intro ritual and homework close.

**Architecture:** New token fields are clamped in a new module (`lib/tutor/embed/lesson-context.ts`, outside the portal folder another session owns), threaded embed page → TutorSession → VoiceTutorRealtime as one `lessonContext` prop plus `inFlow`, and rendered into the **session** block of the system prompt (the shared cached core is untouched). `inFlow` switches the opener clause, suppresses the first-session tip and teacher intro, adds a hand-back close clause, and skips homework drafts. A templated bridge line is spoken from the start tap before the first brain call; the TTS socket opens as soon as it is enabled.

**Tech Stack:** Next.js (apps/tutor), TypeScript, tsx test scripts registered as `test:*` in `apps/tutor/package.json`.

**Spec:** `docs/superpowers/specs/2026-10-02-gameclass-in-flow-design.md` (Drop 1, D1.1–D1.5); partner contract `docs/whitelabel/gameclass/spec-v1.1-in-flow.md`.

## Global Constraints

- Worktree `.claude/worktrees/gameclass-inflow`, branch `gameclass-inflow`; commands run from `apps/tutor`. Never touch the repo root.
- **Do not modify any file under `apps/tutor/src/lib/tutor/portal/`** (another session is working there). Drop 1 needs nothing there. Do not edit `app/tutor/hooks/useOpenAIRealtime.ts` (frozen).
- Prompt text must be generic: no GameClass, Shark Tank or Scrub Daddy words in any prompt string (`feedback_generic_prompts`).
- Absent fields append nothing to the prompt: `scripts/test-system-prompt-parts.ts` golden hashes must keep passing; new blocks go in the session part only (after "Current Session Context", before pronunciation).
- New flags default ON: `NEXT_PUBLIC_TUTOR_BRIDGE_LINE` and `NEXT_PUBLIC_TUTOR_INFLOW_ENTRY`, read as `!== 'off'` in `lib/tutor/orchestrator/flags.ts`.
- Field limits (clamp, never reject): `title` 80, `topic` 200, `description` 1000, `context.summary` 1500, `context.characters` ≤10 × 80, `context.transcript` 6000, `context.playhead_seconds` finite ≥ 0, `question` 2000, `student_answer` 500, `correct_answer` 500, `entry` ∈ {`in-flow`}.
- Field name inside the engine is `inFlow` (boolean); `SystemPromptContext` already has an unrelated `entryMode`.
- Test baseline: `npm run test:all` 268 pass + 2 known failures (`test:embed-debug-coverage`, `test:portal-student-scoping`). New debug event types must be added to `EMBED_DEBUG_EVENT_PREFIXES` in `app/tutor-portal/embed/page.tsx`.
- No deploy in this plan; deploy is Praveen-gated.

## Review Focus

1. A token with `entry: "in-flow"` but no `question`/`context` must still open sanely (greeting + one sentence from title/description, then a question). Pinned in Task 4.
2. A resumed session (`resume: true`) must get no bridge line and no duplicate greeting. Pinned in Task 5.
3. Text-mode sessions must get no bridge line (nothing to cover) and the in-flow opener must not say "listen"/"hear". Pinned in Task 5 and Task 4.
4. Oversized or wrongly typed fields (a 50 KB transcript, `characters` as a string, `playhead_seconds: "212"`) must clamp or drop without failing the session. Pinned in Task 1.
5. Crimsora/evelyntutor/GAC tokens (no new fields) must produce byte-identical prompts and the same opener; only the bridge line is new for them. Pinned in Task 2 (golden hashes) and Task 4 (opener unchanged when `inFlow` is false).

---

### Task 1: `lesson-context.ts` — clamp and render

**Files:**
- Create: `src/lib/tutor/embed/lesson-context.ts`
- Create: `scripts/test-lesson-context.ts`; modify `package.json` (add `test:lesson-context`)

**Interfaces (Produces):**
```ts
export type LessonContext = {
  title?: string; description?: string;
  summary?: string; characters?: string[]; transcript?: string; playheadSeconds?: number;
  question?: string; studentAnswer?: string; correctAnswer?: string;
};
export const LESSON_CONTEXT_LIMITS: { title: 80; topic: 200; description: 1000; summary: 1500; characters: 10; character: 80; transcript: 6000; question: 2000; studentAnswer: 500; correctAnswer: 500 };
export function parseLessonContext(raw: unknown): LessonContext | undefined;   // raw = the decoded token payload; undefined when no field present
export function parseEntry(raw: unknown): 'in-flow' | undefined;
export function clampTitle(s: string, max?: number): string;                    // cut + '…' when over
export function renderLessonContextBlock(lc: LessonContext): string;           // '' when nothing to say
export function renderQuestionBlock(lc: LessonContext): string;                // '' when no question
```

- [ ] **Step 1: Write the failing test**

Create `scripts/test-lesson-context.ts`:

```ts
/**
 * Host-supplied lesson context (GameClass v1.1): clamp, never reject; render
 * only what is present. Run: npx tsx scripts/test-lesson-context.ts
 */
import {
  parseLessonContext, parseEntry, clampTitle, renderLessonContextBlock, renderQuestionBlock, LESSON_CONTEXT_LIMITS as L,
} from '@/lib/tutor/embed/lesson-context';

const checks: Array<[string, boolean]> = [];
const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

// parse: absent → undefined
checks.push(['no fields → undefined', parseLessonContext({ partner_id: 'x', topic: 't' }) === undefined]);
checks.push(['non-object → undefined', parseLessonContext(null) === undefined && parseLessonContext('x') === undefined]);
// parse: happy path
const full = parseLessonContext({
  title: 'Own a Piece or Lend the Money?', description: 'desc', question: 'Q?', student_answer: 'A', correct_answer: 'B',
  context: { summary: 'S', characters: ['Aaron', 'Lori'], transcript: 'T', playhead_seconds: 212 },
});
checks.push(['all fields parsed', eq(full, { title: 'Own a Piece or Lend the Money?', description: 'desc', summary: 'S', characters: ['Aaron', 'Lori'], transcript: 'T', playheadSeconds: 212, question: 'Q?', studentAnswer: 'A', correctAnswer: 'B' })]);
// clamps
const big = parseLessonContext({ title: 'x'.repeat(500), context: { transcript: 'y'.repeat(50_000), characters: Array.from({ length: 30 }, (_, i) => `c${i}`.padEnd(200, 'z')) } })!;
checks.push(['title cut to limit', big.title?.length === L.title]);
checks.push(['transcript cut to limit', big.transcript?.length === L.transcript]);
checks.push(['characters capped at 10 × 80', big.characters?.length === L.characters && big.characters.every((c) => c.length <= L.character)]);
// wrong types drop the field, keep the rest
const wrong = parseLessonContext({ title: 42, question: 'Q', context: { characters: 'Aaron', playhead_seconds: '212', summary: ['no'] } })!;
checks.push(['wrong-typed fields dropped, valid ones kept', eq(wrong, { question: 'Q' })]);
checks.push(['negative/NaN playhead dropped', parseLessonContext({ context: { playhead_seconds: -5 } }) === undefined && parseLessonContext({ context: { playhead_seconds: NaN } }) === undefined]);
checks.push(['blank strings dropped', parseLessonContext({ title: '   ', description: '' }) === undefined]);
checks.push(['strings are trimmed', parseLessonContext({ title: '  Hi  ' })?.title === 'Hi']);
// entry
checks.push(['entry in-flow', parseEntry({ entry: 'in-flow' }) === 'in-flow']);
checks.push(['entry other → undefined', parseEntry({ entry: 'standalone' }) === undefined && parseEntry({}) === undefined]);
// clampTitle
checks.push(['clampTitle short unchanged', clampTitle('Short') === 'Short']);
checks.push(['clampTitle long → 80 incl. ellipsis', clampTitle('a'.repeat(100)).length === 80 && clampTitle('a'.repeat(100)).endsWith('…')]);
// render: lesson context block
const blk = renderLessonContextBlock(full!);
checks.push(['block names the title', blk.includes('Lesson: Own a Piece or Lend the Money?')]);
checks.push(['block has clip, people, position', blk.includes('Clip: S') && blk.includes('People: Aaron, Lori') && blk.includes('3:32 of the clip')]);
checks.push(['block wraps transcript', blk.includes('<clip_transcript>\nT\n</clip_transcript>')]);
checks.push(['block carries the no-invention rule', /Do not add names, numbers, offers or events/.test(blk)]);
checks.push(['block is generic (no partner words)', !/gameclass|shark|scrub/i.test(blk)]);
checks.push(['empty context → empty block', renderLessonContextBlock({}) === '' && renderLessonContextBlock({ question: 'Q' }) === '']);
// render: question block
const qb = renderQuestionBlock(full!);
checks.push(['question block has Q/A/correct', qb.includes('Question: Q?') && qb.includes('Student answered: A') && qb.includes('never state it outright') && qb.includes('B')]);
checks.push(['no question → empty', renderQuestionBlock({ title: 't' }) === '']);
checks.push(['question without answers renders', renderQuestionBlock({ question: 'Only Q' }).includes('Question: Only Q') && !renderQuestionBlock({ question: 'Only Q' }).includes('Student answered')]);

let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
```

Add to `package.json` scripts (next to `test:system-prompt-parts`):

```json
"test:lesson-context": "npx tsx scripts/test-lesson-context.ts",
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm run --silent test:lesson-context`
Expected: FAIL — cannot find module `@/lib/tutor/embed/lesson-context`.

- [ ] **Step 3: Implement**

Create `src/lib/tutor/embed/lesson-context.ts`:

```ts
/**
 * Host-supplied lesson context for "in-flow" embeds (partner spec v1.1):
 * the short title, the lesson description, what happens in the clip, and the
 * question the student was on. Every field is optional and CLAMPED, never
 * rejected — a malformed host field must not fail a session. Rendered into
 * the SESSION part of the system prompt (never the shared core).
 */
export type LessonContext = {
  title?: string;
  description?: string;
  summary?: string;
  characters?: string[];
  transcript?: string;
  playheadSeconds?: number;
  question?: string;
  studentAnswer?: string;
  correctAnswer?: string;
};

export const LESSON_CONTEXT_LIMITS = {
  title: 80, topic: 200, description: 1000, summary: 1500, characters: 10, character: 80,
  transcript: 6000, question: 2000, studentAnswer: 500, correctAnswer: 500,
} as const;

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  if (!t) return undefined;
  return t.length > max ? t.slice(0, max) : t;
}

function strList(v: unknown, maxItems: number, maxEach: number): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: string[] = [];
  for (const item of v) {
    const s = str(item, maxEach);
    if (s) out.push(s);
    if (out.length >= maxItems) break;
  }
  return out.length ? out : undefined;
}

function seconds(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : undefined;
}

export function parseLessonContext(raw: unknown): LessonContext | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const r = raw as Record<string, unknown>;
  const c = (r.context && typeof r.context === 'object' && !Array.isArray(r.context) ? r.context : {}) as Record<string, unknown>;
  const L = LESSON_CONTEXT_LIMITS;
  const lc: LessonContext = {
    title: str(r.title, L.title),
    description: str(r.description, L.description),
    summary: str(c.summary, L.summary),
    characters: strList(c.characters, L.characters, L.character),
    transcript: str(c.transcript, L.transcript),
    playheadSeconds: seconds(c.playhead_seconds),
    question: str(r.question, L.question),
    studentAnswer: str(r.student_answer, L.studentAnswer),
    correctAnswer: str(r.correct_answer, L.correctAnswer),
  };
  const compact = Object.fromEntries(Object.entries(lc).filter(([, v]) => v !== undefined)) as LessonContext;
  return Object.keys(compact).length ? compact : undefined;
}

export function parseEntry(raw: unknown): 'in-flow' | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  return (raw as { entry?: unknown }).entry === 'in-flow' ? 'in-flow' : undefined;
}

/** Display title: cut with an ellipsis when over `max` (default 80). */
export function clampTitle(s: string, max: number = LESSON_CONTEXT_LIMITS.title): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function mmss(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Facts about the scene, from the host. '' when there is nothing to say. */
export function renderLessonContextBlock(lc: LessonContext): string {
  const lines: string[] = [];
  if (lc.title) lines.push(`Lesson: ${lc.title}`);
  if (lc.description) lines.push(`Description: ${lc.description}`);
  if (lc.summary) lines.push(`Clip: ${lc.summary}`);
  if (lc.characters?.length) lines.push(`People: ${lc.characters.join(', ')}`);
  if (lc.playheadSeconds !== undefined) lines.push(`The student was at ${mmss(lc.playheadSeconds)} of the clip when they asked for help.`);
  if (lc.transcript) lines.push(`<clip_transcript>\n${lc.transcript}\n</clip_transcript>`);
  if (!lines.length) return '';
  return (
    `\n## Lesson context (supplied by the host — the only source of facts about the scene)\n` +
    lines.join('\n') + '\n' +
    'Treat the lines above as the facts of the scene. Do not add names, numbers, offers or events that are not in them; ' +
    'if a detail is missing, say you do not have it rather than guessing.\n'
  );
}

/** The question the student was on. '' when there is none. */
export function renderQuestionBlock(lc: LessonContext): string {
  if (!lc.question) return '';
  let out = `\n## The question the student was on\nQuestion: ${lc.question}\n`;
  if (lc.studentAnswer) out += `Student answered: ${lc.studentAnswer}\n`;
  if (lc.correctAnswer) out += `Correct answer (never state it outright; guide the student to it): ${lc.correctAnswer}\n`;
  out += 'Start from what the student answered: find what they got right, then the one idea that fixes the rest.\n';
  return out;
}
```

- [ ] **Step 4: Run the test**

Run: `npm run --silent test:lesson-context && npx tsc --noEmit -p .`
Expected: `25/25 passed`; tsc 0.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/embed/lesson-context.ts scripts/test-lesson-context.ts package.json
git commit -m "feat(tutor): lesson-context — clamp and render host-supplied in-flow fields"
```

---

### Task 2: Prompt builder — lesson context, question and in-flow close in the session block

**Files:**
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` (`SystemPromptContext` ~L102–205; after `previousTopics` ~L1926)
- Modify: `scripts/test-system-prompt-parts.ts` (add in-flow cases)

**Interfaces:**
- Consumes: `LessonContext`, `renderLessonContextBlock`, `renderQuestionBlock` (Task 1).
- Produces: `SystemPromptContext.lessonContext?: LessonContext`, `SystemPromptContext.inFlow?: boolean`; exported `IN_FLOW_CLOSE_CLAUSE` string.

- [ ] **Step 1: Write the failing test**

Append to `scripts/test-system-prompt-parts.ts`, before the `let fail = 0;` line:

```ts
// In-flow fields render in the SESSION part only, and absent fields change nothing (golden above).
const inflowCtx = { ...PROMPT_MATRIX.freetext_subject, inFlow: true, lessonContext: { title: 'Own a Piece?', summary: 'Two offers on the table.', question: 'Which is equity?', studentAnswer: 'the loan', correctAnswer: 'the first offer' } } as builder.SystemPromptContext;
if (parts) {
  const p = parts(inflowCtx);
  const base = parts(PROMPT_MATRIX.freetext_subject);
  checks.push(['in-flow: core unchanged', p.core === base.core]);
  checks.push(['in-flow: session has the lesson context block', p.session.includes('## Lesson context') && p.session.includes('Clip: Two offers on the table.')]);
  checks.push(['in-flow: session has the question block', p.session.includes('Question: Which is equity?')]);
  checks.push(['in-flow: session has the hand-back close clause', p.session.includes(builder.IN_FLOW_CLOSE_CLAUSE)]);
  checks.push(['in-flow blocks sit before pronunciation/persona (inside session context)', p.session.indexOf('## Lesson context') < p.session.indexOf('## Pedagogy spine') === false && p.session.indexOf('## Lesson context') > p.session.indexOf('## Current Session Context')]);
  const onlyCtx = parts({ ...PROMPT_MATRIX.math_g8, lessonContext: { description: 'A lesson on slopes.' } } as builder.SystemPromptContext);
  checks.push(['lesson context without in-flow renders, no close clause', onlyCtx.session.includes('Description: A lesson on slopes.') && !onlyCtx.session.includes(builder.IN_FLOW_CLOSE_CLAUSE)]);
  checks.push(['prompt stays generic', !/gameclass|shark|scrub/i.test(p.session)]);
}
```

- [ ] **Step 2: Run to see it fail**

Run: `npm run --silent test:system-prompt-parts`
Expected: the 42 existing checks PASS; the new in-flow checks FAIL (`IN_FLOW_CLOSE_CLAUSE` undefined / blocks missing).

- [ ] **Step 3: Implement**

In `system-prompt-builder.ts`:

a. Import at the top with the other `@/lib/tutor` imports:
```ts
import { renderLessonContextBlock, renderQuestionBlock, type LessonContext } from '@/lib/tutor/embed/lesson-context';
```

b. In `SystemPromptContext`, after `inputMode?: 'voice' | 'text';` add:
```ts
  /** Host-supplied lesson context (in-flow embeds, partner spec v1.1). Rendered in the
   *  SESSION block; absent ⇒ nothing appended. */
  lessonContext?: LessonContext;
  /** The student arrived mid-activity (an "Ask the tutor" moment inside a lesson they
   *  return to). Adds the hand-back close clause; opener handled by the client. */
  inFlow?: boolean;
```

c. Export the clause near `STALE_CHECKPOINT_REORIENT_CLAUSE` (~L1577):
```ts
/** In-flow sessions end by handing the student back to the activity they came from. */
export const IN_FLOW_CLOSE_CLAUSE =
  'This student came to you from a lesson in progress and goes back to it afterwards. When the help is done or the ' +
  'student wants to go, close in ONE sentence that hands them back to what they were doing — no "see you next time", ' +
  'no homework or practice pointers, no summary of the session.';
```

d. After the `previousTopics` block (the `if (context.previousTopics && …) { … }` ending ~L1926) and before the pronunciation comment, add:
```ts
  // In-flow lesson context (partner spec v1.1): facts about the scene and the
  // question the student was on. Session block only; absent ⇒ nothing.
  if (context.lessonContext) {
    prompt += renderLessonContextBlock(context.lessonContext);
    prompt += renderQuestionBlock(context.lessonContext);
  }
  if (context.inFlow) {
    prompt += `\n## Closing an in-flow session\n${IN_FLOW_CLOSE_CLAUSE}\n`;
  }
```

- [ ] **Step 4: Run tests**

Run: `npm run --silent test:system-prompt-parts && npm run --silent test:prompt-cache && npx tsc --noEmit -p .`
Expected: all PASS (49/49 for system-prompt-parts); tsc 0.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/ai/system-prompt-builder.ts scripts/test-system-prompt-parts.ts
git commit -m "feat(tutor): lesson-context, question and in-flow close blocks in the prompt's session part"
```

---

### Task 3: Thread the fields embed page → TutorSession → VoiceTutorRealtime; show the title

**Files:**
- Modify: `src/app/tutor-portal/embed/page.tsx` (`EmbedConfig` ~L301–407; variables ~L476–490; `topicDisplayName` ~L753; `<TutorSession>` ~L1510–1568)
- Modify: `src/app/tutor/components/session/TutorSession.tsx` (prop types ~L150–185; destructure ~L250; `<VoiceTutorRealtime>` ~L1378–1398)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (props interface ~L597–660; destructure ~L1086–1143; `buildSystemPromptParts` call ~L21075 + deps ~L21153)
- Create: `scripts/test-inflow-wiring.ts`; modify `package.json` (add `test:inflow-wiring`)

**Interfaces:**
- Consumes: `parseLessonContext`, `parseEntry`, `clampTitle`, `LessonContext` (Task 1); `SystemPromptContext.lessonContext/inFlow` (Task 2).
- Produces: VTR props `lessonContext?: LessonContext`, `inFlow?: boolean` (default false); TutorSession passes both through; embed page computes `lessonContext`, `inFlow`, and `topicDisplayName` from `title`.

- [ ] **Step 1: Write the failing test**

Create `scripts/test-inflow-wiring.ts`:

```ts
/**
 * Source-level wiring pins for the in-flow fields (behaviour of the pure parts
 * is tested in test-lesson-context / test-system-prompt-parts).
 * Run: npx tsx scripts/test-inflow-wiring.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
const SRC = path.join(__dirname, '..', 'src');
const read = (...p: string[]) => fs.readFileSync(path.join(SRC, ...p), 'utf8');
const embed = read('app', 'tutor-portal', 'embed', 'page.tsx');
const ts = read('app', 'tutor', 'components', 'session', 'TutorSession.tsx');
const vtr = read('app', 'tutor', 'components', 'VoiceTutorRealtime.tsx');
const checks: Array<[string, boolean]> = [];
checks.push(['embed parses lessonContext from the raw payload', /parseLessonContext\(rawPayload\)/.test(embed)]);
checks.push(['embed parses entry', /parseEntry\(rawPayload\)/.test(embed)]);
checks.push(['embed title: config.title wins, else clamped label', /config\.title \? clampTitle\(config\.title\)/.test(embed) && /clampTitle\(buildDisplayName\(/.test(embed)]);
checks.push(['embed passes lessonContext and inFlow to TutorSession', /lessonContext=\{lessonContext\}/.test(embed) && /inFlow=\{inFlow\}/.test(embed)]);
checks.push(['TutorSession forwards both to VTR', /lessonContext=\{lessonContext\}/.test(ts) && /inFlow=\{inFlow\}/.test(ts)]);
checks.push(['VTR declares the props', /lessonContext\?: LessonContext;/.test(vtr) && /inFlow\?: boolean;/.test(vtr)]);
checks.push(['VTR feeds them to buildSystemPromptParts', /\.\.\.\(lessonContext \? \{ lessonContext \} : \{\}\),/.test(vtr) && /\.\.\.\(inFlow \? \{ inFlow: true \} : \{\}\),/.test(vtr)]);
let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
```

Add to `package.json`: `"test:inflow-wiring": "npx tsx scripts/test-inflow-wiring.ts",`

- [ ] **Step 2: Run to see it fail**

Run: `npm run --silent test:inflow-wiring`
Expected: 0/7.

- [ ] **Step 3: Implement — embed page**

a. Import: `import { parseLessonContext, parseEntry, clampTitle } from '@/lib/tutor/embed/lesson-context';`

b. The decoded payload is `config` (memo at ~L455, typed `EmbedConfig`). Add the two new typed fields to `EmbedConfig` for documentation (`title?: string; entry?: 'in-flow';`) and, right after the `config` memo, parse from the raw object (the new fields are validated by the parser, not the type):
```ts
  // In-flow fields (partner spec v1.1): clamped by the parser, never rejected.
  const rawPayload = config as unknown;
  const lessonContext = useMemo(() => parseLessonContext(rawPayload), [rawPayload]);
  const inFlow = useMemo(() => parseEntry(rawPayload) === 'in-flow', [rawPayload]);
```
   (If `config` is computed inside `EmbedSessionInner` under a different name, place these next to `openScope` at ~L476 and use that name as `rawPayload`.)

c. Replace the `topicDisplayName` memo (~L753) with:
```ts
  const topicDisplayName = useMemo(
    () => config?.title
      ? clampTitle(config.title)
      : topic ? clampTitle(buildDisplayName(subject, level, topic)) : `${subject} — ${level}`,
    [config?.title, subject, level, topic]
  );
```

d. In the `<TutorSession …>` JSX add `lessonContext={lessonContext}` and `inFlow={inFlow}` next to `openScope={openScope}`.

- [ ] **Step 4: Implement — TutorSession**

Prop types (next to `openScope?: VTRProps['openScope'];`):
```ts
  lessonContext?: VTRProps['lessonContext'];
  inFlow?: VTRProps['inFlow'];
```
Destructure `lessonContext, inFlow,` beside `openScope`; pass `lessonContext={lessonContext}` and `inFlow={inFlow}` to `<VoiceTutorRealtime>` beside `openScope={openScope}`.

- [ ] **Step 5: Implement — VoiceTutorRealtime**

a. Import: `import type { LessonContext } from '@/lib/tutor/embed/lesson-context';`

b. Props interface, after `openScope?: boolean;` (~L632):
```ts
  /** Host-supplied lesson context (in-flow embeds). Rendered in the prompt's session block. */
  lessonContext?: LessonContext;
  /** Student arrived mid-activity: in-flow opener/close, no intro ritual, no first-session tip. */
  inFlow?: boolean;
```

c. Destructure after `openScope = false,`: `lessonContext,` and `inFlow = false,`.

d. In the `buildSystemPromptParts({ … })` call, after `...(openScope ? { openScope: true } : {}),` add:
```ts
          ...(lessonContext ? { lessonContext } : {}),
          ...(inFlow ? { inFlow: true } : {}),
```
   Do not add them to the dependency array; like `openScope` they are mount-stable.

- [ ] **Step 6: Run tests**

Run: `npm run --silent test:inflow-wiring && npx tsc --noEmit -p .`
Expected: 7/7; tsc 0.

- [ ] **Step 7: Commit**

```bash
git add src/app/tutor-portal/embed/page.tsx src/app/tutor/components/session/TutorSession.tsx src/app/tutor/components/VoiceTutorRealtime.tsx scripts/test-inflow-wiring.ts package.json
git commit -m "feat(tutor): thread in-flow lesson context + entry through the embed; title from the token"
```

---

### Task 4: In-flow opener, no tip, no intro, no homework drafts

**Files:**
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` (add `buildInFlowOpenerClause` next to `buildHomeworkOpenerClause` ~L1592)
- Modify: `src/lib/tutor/orchestrator/flags.ts` (add `TUTOR_INFLOW_ENTRY`)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (opener composition ~L20971–21071; tip gate ~L11126; start-tap rebuild guard ~L21509; `draftHomework` ~L2340; close-notes finalize gate ~L7305)
- Modify: `scripts/test-opener-calibration-prompt.ts` (add in-flow cases)

**Interfaces:**
- Consumes: `inFlow` prop (Task 3), `lessonContext` (Task 3).
- Produces: `buildInFlowOpenerClause(ctx: Pick<SystemPromptContext, 'openingPhase' | 'studentName' | 'lessonContext' | 'inputMode'>): string | null`; flag `TUTOR_INFLOW_ENTRY`.

- [ ] **Step 1: Write the failing test**

Append to `scripts/test-opener-calibration-prompt.ts` (same `test(name, fn)` + `assert` style as the homework opener tests at ~L246):

```ts
test('in-flow opener: name + one pick-up sentence + question, no intro, no tip', () => {
  const c = buildInFlowOpenerClause({ openingPhase: true, studentName: 'Maya', lessonContext: { title: 'Own a Piece?', question: 'Which is equity?' } });
  assert.ok(c);
  assert.match(c!, /greet .*by name/i);
  assert.match(c!, /at most two sentences/i);
  assert.match(c!, /question the student was on/i);
  assert.doesNotMatch(c!, /introduce yourself|quiet|few seconds/i);
  assert.doesNotMatch(c!, /gameclass|shark|scrub/i);
});
test('in-flow opener without question or context still opens from the title/description', () => {
  const c = buildInFlowOpenerClause({ openingPhase: true, studentName: 'Maya', lessonContext: { title: 'Fractions' } });
  assert.match(c!, /what they were just watching or working on/i);
});
test('in-flow opener text mode: no listening words', () => {
  const c = buildInFlowOpenerClause({ openingPhase: true, studentName: undefined, lessonContext: undefined, inputMode: 'text' });
  assert.ok(c);
  assert.doesNotMatch(c!, /\b(listen|hear|say)\b/i);
});
test('in-flow opener returns null outside the opening phase', () => {
  assert.equal(buildInFlowOpenerClause({ openingPhase: false, studentName: 'Maya' }), null);
});
```
Add `buildInFlowOpenerClause` to that file's import from the builder.

- [ ] **Step 2: Run to see it fail**

Run: `npm run --silent test:pedagogy-b4`
Expected: FAIL — `buildInFlowOpenerClause` is not exported.

- [ ] **Step 3: Implement the clause**

In `system-prompt-builder.ts`, after `buildHomeworkOpenerClause`:

```ts
/**
 * In-flow opener (the student clicked for help in the middle of an activity).
 * No self-introduction, no calibration, no "replies take a few seconds": the
 * student is already engaged — pick up where they are and ask. Generic by
 * design (no partner or scene specifics; those arrive via lessonContext).
 */
export function buildInFlowOpenerClause(
  ctx: Pick<SystemPromptContext, 'openingPhase' | 'studentName' | 'lessonContext' | 'inputMode'>,
): string | null {
  if (!ctx.openingPhase) return null;
  const greet = ctx.studentName
    ? 'Greet the student by name in three or four words'
    : 'Greet the student in three or four words (no name is available — never speak a placeholder)';
  const pickUp = ctx.lessonContext?.question
    ? 'then pick up directly from the question the student was on and what they answered'
    : 'then pick up directly from what they were just watching or working on (use the lesson context if present)';
  const wording = ctx.inputMode === 'text' ? 'Write' : 'Speak';
  return (
    `${greet}, ${pickUp}, and ask your first question. ${wording} at most two sentences before that question. ` +
    'Do not introduce yourself, do not explain how you work or how long replies take, do not ask them to find a ' +
    'quiet place, and do not give an overview of the lesson — they came from it and go back to it.'
  );
}
```

- [ ] **Step 4: Flag**

In `lib/tutor/orchestrator/flags.ts`, after `TUTOR_FIRST_SESSION_TIP`:
```ts
// In-flow entry (partner spec v1.1 `entry: "in-flow"`): in-flow opener, no first-
// session tip, no teacher intro, hand-back close, no homework drafts.
// NEXT_PUBLIC_TUTOR_INFLOW_ENTRY=off restores the standard behaviour for such tokens.
export const TUTOR_INFLOW_ENTRY = process.env.NEXT_PUBLIC_TUTOR_INFLOW_ENTRY !== 'off';
```

- [ ] **Step 5: Wire in VTR**

Import `buildInFlowOpenerClause` with the other builder imports and `TUTOR_INFLOW_ENTRY` with the other flags. Add near the destructure: `const isInFlow = TUTOR_INFLOW_ENTRY && inFlow;`

a. Opener composition (~L20971–21071): change
```ts
            const isHomeworkOpener = sessionGoal === 'homework-help';
            ...
            const openerClause = isHomeworkOpener
              ? buildHomeworkOpenerClause(openerCtx)
              : buildOpenerClause({ ...openerCtx, agendaItemCount: pendingAgendaItemCountRef.current ?? 0 });
```
to
```ts
            const isHomeworkOpener = sessionGoal === 'homework-help';
            ...
            const openerClause = isInFlow
              ? buildInFlowOpenerClause({ ...openerCtx, lessonContext, inputMode: sessionMode })
              : isHomeworkOpener
                ? buildHomeworkOpenerClause(openerCtx)
                : buildOpenerClause({ ...openerCtx, agendaItemCount: pendingAgendaItemCountRef.current ?? 0 });
```
and make the `continuity` and `baseDirective` expressions treat in-flow like homework (no continuity clause, no stale reorient): replace `!isHomeworkOpener` with `!isHomeworkOpener && !isInFlow` in the `continuity` condition and `openerStaleReorientRef` line, and `isHomeworkOpener ? openerClause` with `(isHomeworkOpener || isInFlow) ? openerClause` in `baseDirective`.

b. Teacher intro (~L21059): `teacherPersona && baseDirective && !isInFlow && shouldIntroduceTeacher(beh.journey)`.

c. Tip gate (~L11126): `if (TUTOR_FIRST_SESSION_TIP && !isInFlow && firstSessionTipPendingRef.current) {`.

d. Start-tap rebuild (~L21509): where the code skips the rebuild for `sessionGoal === 'homework-help'`, extend to `sessionGoal === 'homework-help' || isInFlow`.

e. Homework drafts: at the top of `draftHomework` (~L2340) add `if (isInFlow) return;` with a one-line comment ("in-flow: the host owns follow-up; nothing to assign"), and in the close-notes handler gate (~L7305) add `&& !isInFlow` to the condition that fires the draft/finalize POSTs.

If `isInFlow` is needed inside a memoized callback whose deps are checked by lint, add it to that callback's dependency array (it is mount-stable, so this is harmless).

- [ ] **Step 6: Run tests**

Run: `npm run --silent test:pedagogy-b4 && npm run --silent test:pedagogy-b6 && npm run --silent test:system-prompt-parts && npx tsc --noEmit -p .`
Expected: all PASS; tsc 0.

- [ ] **Step 7: Commit**

```bash
git add src/lib/tutor/ai/system-prompt-builder.ts src/lib/tutor/orchestrator/flags.ts src/app/tutor/components/VoiceTutorRealtime.tsx scripts/test-opener-calibration-prompt.ts
git commit -m "feat(tutor): in-flow entry — pick-up opener, no tip/intro, hand-back close, no homework drafts"
```

---

### Task 5: Bridge line — instant first words from the start tap

**Files:**
- Create: `src/lib/tutor/voice/bridge-line.ts`
- Modify: `src/lib/tutor/orchestrator/flags.ts` (add `TUTOR_BRIDGE_LINE`)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (start branch after `realtime.unlockAudio()` ~L21463; opening-directive assembly ~L11115)
- Modify: `src/app/tutor-portal/embed/page.tsx` (allowlist `bridge_spoken`)
- Create: `scripts/test-bridge-line.ts`; modify `package.json`

**Interfaces:**
- Produces: `bridgeLineFor(a: { studentName?: string; title?: string; inFlow: boolean; inputMode: 'voice' | 'text'; resume: boolean }): string | null`; `BRIDGE_SPOKEN_DIRECTIVE` string; flag `TUTOR_BRIDGE_LINE`.

- [ ] **Step 1: Write the failing test**

Create `scripts/test-bridge-line.ts`:
```ts
/** Bridge line: fixed, model-free first words. Run: npx tsx scripts/test-bridge-line.ts */
import { bridgeLineFor, BRIDGE_SPOKEN_DIRECTIVE } from '@/lib/tutor/voice/bridge-line';
const checks: Array<[string, boolean]> = [];
const v = { inputMode: 'voice' as const, resume: false };
checks.push(['in-flow with name and title', bridgeLineFor({ ...v, studentName: 'Maya', title: 'Own a Piece?', inFlow: true }) === 'Hey Maya. Own a Piece? — let’s look at it.']);
checks.push(['in-flow without title', bridgeLineFor({ ...v, studentName: 'Maya', inFlow: true }) === 'Hey Maya. Let’s look at it.']);
checks.push(['standalone with name', bridgeLineFor({ ...v, studentName: 'Alex', inFlow: false }) === 'Hey Alex. Let’s get started.']);
checks.push(['no name', bridgeLineFor({ ...v, inFlow: false }) === 'Hey. Let’s get started.']);
checks.push(['first name only', bridgeLineFor({ ...v, studentName: 'Maya Chen', inFlow: false })?.startsWith('Hey Maya.') === true]);
checks.push(['long title is cut', (bridgeLineFor({ ...v, studentName: 'M', title: 'x'.repeat(200), inFlow: true }) ?? '').length < 90]);
checks.push(['text mode → null', bridgeLineFor({ ...v, inputMode: 'text', studentName: 'Maya', inFlow: true }) === null]);
checks.push(['resume → null', bridgeLineFor({ ...v, resume: true, studentName: 'Maya', inFlow: true }) === null]);
checks.push(['directive tells the brain not to greet again', /already greeted|do not greet again/i.test(BRIDGE_SPOKEN_DIRECTIVE)]);
let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
```
Add to `package.json`: `"test:bridge-line": "npx tsx scripts/test-bridge-line.ts",`

- [ ] **Step 2: Run to see it fail**

Run: `npm run --silent test:bridge-line` → FAIL, module not found.

- [ ] **Step 3: Implement the pure part**

Create `src/lib/tutor/voice/bridge-line.ts`:
```ts
/**
 * Bridge line: the tutor's first words, spoken by the CLIENT from a fixed
 * table the moment the session starts — before the first brain call — so the
 * student hears something within a second instead of 3–8 s of silence.
 * No model, no personalisation beyond first name and the host's short title.
 */
const MAX_TITLE = 60;

export function bridgeLineFor(a: {
  studentName?: string;
  title?: string;
  inFlow: boolean;
  inputMode: 'voice' | 'text';
  resume: boolean;
}): string | null {
  if (a.inputMode === 'text' || a.resume) return null;
  const first = (a.studentName || '').trim().split(/\s+/)[0];
  const greet = first ? `Hey ${first}.` : 'Hey.';
  if (a.inFlow) {
    const t = (a.title || '').trim();
    const title = t.length > MAX_TITLE ? `${t.slice(0, MAX_TITLE - 1)}…` : t;
    return title ? `${greet} ${title} — let’s look at it.` : `${greet} Let’s look at it.`;
  }
  return `${greet} Let’s get started.`;
}

/** Appended to the opening directive when a bridge line was spoken. */
export const BRIDGE_SPOKEN_DIRECTIVE =
  ' You have ALREADY greeted the student by name a moment ago (a short spoken line); do not greet again or repeat ' +
  'their name — start directly with your first content sentence.';
```

- [ ] **Step 4: Flag**

In `flags.ts`: 
```ts
// Bridge line: a fixed first line spoken by the client at the start tap, before
// the first brain call. NEXT_PUBLIC_TUTOR_BRIDGE_LINE=off restores silence.
export const TUTOR_BRIDGE_LINE = process.env.NEXT_PUBLIC_TUTOR_BRIDGE_LINE !== 'off';
```

- [ ] **Step 5: Wire in VTR**

a. Imports: `bridgeLineFor, BRIDGE_SPOKEN_DIRECTIVE` and `TUTOR_BRIDGE_LINE`. Refs near the other start refs: `const bridgeSpokenRef = useRef(false);`

b. In `handleMicClick`'s `'start'` branch, directly after `realtime.unlockAudio(); audioUnlockedRef.current = true;` (~L21463) and before the kickoff branches, insert:
```ts
          // Bridge line: fixed first words before the brain's first sentence
          // (no model). Once per mount; never on resume or in text mode.
          if (TUTOR_BRIDGE_LINE && claudeBrainMode && !bridgeSpokenRef.current) {
            const line = bridgeLineFor({
              studentName, title: lessonContext?.title, inFlow: isInFlow,
              inputMode: sessionMode, resume: Boolean(resumeState),
            });
            if (line) {
              bridgeSpokenRef.current = true;
              try { realtime.speakText(line, pushTtsScriptForPerception(line)); } catch { /* skip; brain follows */ }
              transcriptRef.current = [
                ...transcriptRef.current,
                { id: `tutor-${Date.now()}-bridge`, timestamp: new Date(), role: 'tutor', text: line } as TranscriptEntry,
              ];
              onTranscriptUpdate([...transcriptRef.current]);
              onTrackInteraction?.('message', line, undefined, 'tutor');
              onDebugEvent?.('bridge_spoken', line);
            }
          }
```
   Use the names the surrounding code already uses for the resume state (`resumeState` prop or its ref) and for `sessionMode`.

c. In the opening-directive assembly (~L11115, where `openingDirective` is built from `intro` + `openingDirectiveRef.current`), after that assignment add:
```ts
            if (bridgeSpokenRef.current && openingDirectiveBrainTurnsRef.current === 1) {
              openingDirective += BRIDGE_SPOKEN_DIRECTIVE;
            }
```
   (Place it after `openingDirectiveBrainTurnsRef.current += 1;` so the check `=== 1` means "first opening turn".)

d. Embed allowlist: add `'bridge_spoken',` to `EMBED_DEBUG_EVENT_PREFIXES`.

- [ ] **Step 6: Run tests**

Run: `npm run --silent test:bridge-line && npx tsc --noEmit -p . && npm run --silent test:embed-debug-coverage 2>&1 | grep -c bridge_spoken`
Expected: 9/9; tsc 0; `0` (the new event is not listed as uncovered).

- [ ] **Step 7: Commit**

```bash
git add src/lib/tutor/voice/bridge-line.ts src/lib/tutor/orchestrator/flags.ts src/app/tutor/components/VoiceTutorRealtime.tsx src/app/tutor-portal/embed/page.tsx scripts/test-bridge-line.ts package.json
git commit -m "feat(tutor): bridge line — fixed first words at the start tap, before the brain"
```

---

### Task 6: Open the TTS socket as soon as it is enabled

**Files:**
- Modify: `src/app/tutor/hooks/useCartesiaSonicWS.ts` (the `[enabled]` effect ~L279–293)
- Create: `scripts/test-tts-prewarm-on-enable.ts`; modify `package.json`

- [ ] **Step 1: Write the failing test** (source pin; the hook needs a browser)

```ts
/** TTS socket opens on enable, not on the first sentence. Run: npx tsx scripts/test-tts-prewarm-on-enable.ts */
import * as fs from 'node:fs';
import * as path from 'node:path';
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'tutor', 'hooks', 'useCartesiaSonicWS.ts'), 'utf8');
const ok = /useEffect\(\(\) => \{\s*if \(enabled\) void ensureOpen\(\);/.test(src);
console.log(`${ok ? 'PASS' : 'FAIL'}  useCartesiaSonicWS opens the socket when enabled`);
process.exit(ok ? 0 : 1);
```
Add `"test:tts-prewarm-on-enable": "npx tsx scripts/test-tts-prewarm-on-enable.ts",`

- [ ] **Step 2: Run to see it fail** → FAIL.

- [ ] **Step 3: Implement**

In `useCartesiaSonicWS.ts`, add a new effect directly above the existing `[enabled]` close-on-disable effect:
```ts
  // Prewarm: open the socket (and mint its token) as soon as TTS over WS is
  // enabled, so the FIRST sentence does not pay the handshake (measured
  // 2026-10-02: 629 ms to first audio vs ~130 ms once warm). ensureOpen is
  // idempotent; a socket closed by idleness reopens on the next speak.
  useEffect(() => {
    if (enabled) void ensureOpen();
  }, [enabled, ensureOpen]);
```
If `ensureOpen` is not a stable `useCallback`, reference it through the ref the file already keeps for it, or add `// eslint-disable-next-line react-hooks/exhaustive-deps` with `[enabled]`.

- [ ] **Step 4: Run** `npm run --silent test:tts-prewarm-on-enable && npx tsc --noEmit -p .` → PASS; tsc 0.

- [ ] **Step 5: Commit**
```bash
git add src/app/tutor/hooks/useCartesiaSonicWS.ts scripts/test-tts-prewarm-on-enable.ts package.json
git commit -m "perf(tutor): open the Cartesia TTS socket on enable, not on the first sentence"
```

---

### Task 7: Gate and live check

- [ ] **Step 1: Portal-folder guard**

Run: `git diff --name-only origin/main...HEAD | grep -c 'src/lib/tutor/portal/'`
Expected: `0`.

- [ ] **Step 2: Merge main, type-check, full suite, build**

```bash
git fetch origin && git merge origin/main
npx tsc --noEmit -p .
npm run test:all
npm run build
```
Expected: tsc 0; `test:all` = baseline pass count + 6 new batteries, only the 2 known failures; build exit 0.

- [ ] **Step 3: Live check on a dev server (real brain, ≈ $0.10 warm)**

Mint a GameClass-shaped token with the v1.1 fields (extend `scripts/mint-embed-token.ts` only if it cannot pass extra claims; otherwise sign with `docs/whitelabel/gameclass/examples/sign-embed-token.js` and the dev secret) with `entry: "in-flow"`, `title`, `context.summary`, `question`/`student_answer`/`correct_answer`, `session_goal: homework-help`, voice. Open it in Playwright against the dev server, tap start, record:
- `bridge_spoken` event and its timestamp vs `start_tap` (expect < 1 s);
- no `first_session_tip_attached`;
- opener transcript: no "I'm <name>", ≤ 2 sentences before the first question, references the clip/question;
- header shows `title`;
- the brain's first turn does not repeat the greeting.
Then one control run with a Crimsora-shaped token (no new fields): opener unchanged apart from the bridge line.

- [ ] **Step 4: Hand-off**

Report commits, gate results, live-check transcript excerpts, and the deploy checklist (announce, `cmp` env, `./deploy-tutor.sh` from this worktree, push). Deploy is Praveen-gated.
