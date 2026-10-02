# Tutor Shared Prompt Cache Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let every tutor session reuse one cached copy of the tools + core prompt, so a session start writes only its own small tail instead of ≈ 125K tokens.

**Architecture:** The system prompt is split, without moving any text, into `core` (BASE_PROMPT + branding, identical for every session of a deployment) and `session` (everything after). The client sends both parts; the server sends two system blocks, each with a 1-hour cache marker, so marker A (`tools + core`) is shared across sessions and marker B is per session. The tool list a session uses is latched on the client so it can only ever widen once, never flip back and forth. Per-turn logging shows which shared entry a turn used and whether turn 1 was warm.

**Tech Stack:** Next.js (apps/tutor), TypeScript, `@anthropic-ai/sdk`, tsx test scripts (`scripts/test-*.ts`, registered as `test:*` in `apps/tutor/package.json`, run by `npm run test:all`).

**Spec:** `docs/superpowers/specs/2026-10-02-tutor-token-optimization-design.md`

## Global Constraints

- Work only in the worktree `.claude/worktrees/tutor-token-opt` (branch `tutor-token-opt`). Never edit, checkout or merge in the repo root.
- All commands run from `apps/tutor` unless stated.
- Scope: `apps/tutor/**` only. Do not touch `apps/marketing/**`, `packages/core/**`, or `src/app/tutor/hooks/useOpenAIRealtime.ts` (frozen file).
- New flag `TUTOR_SHARED_PROMPT_CACHE` is server-side and defaults ON: read it as `process.env.TUTOR_SHARED_PROMPT_CACHE !== 'off'`.
- `core + session` must equal today's prompt byte for byte. No prompt wording changes, no tool definition changes, no reordering of the tools array.
- Cache markers stay `{ type: 'ephemeral', ttl: '1h' }` on every block (a 1-hour entry must precede any shorter one).
- Do not deploy. Deploys are Praveen-gated: `./deploy-tutor.sh` from the worktree, after `cmp .env.local.production ../../.env.local.production` against the root copy and the box copy.
- Worktree bring-up (needed before tsc/tests/build): `rsync -a ../greenapple-engine/node_modules/ node_modules/` from the worktree root (a symlink breaks `next build`); copy `.env.local`, `.env.local.production`, and `apps/tutor/public/ketcher/bundle.{js,css}` from the root; `apps/tutor/.env.local -> ../../.env.local`.
- Test baseline on main: `npm run test:all` = 263/265; `test:embed-debug-coverage` and `test:portal-student-scoping` fail before this work and are not regressions.
- Any step that calls the real Anthropic API with a full prompt spends money (≈ $0.50 per cold write). Task 5 Step 4 needs Praveen's explicit go.

## Findings the plan relies on (verified at `14746c02`)

- `buildSystemPrompt` runs in the browser (`VoiceTutorRealtime.tsx` is `'use client'`). The prompt flags `TUTOR_TOOL_SUBJECT_FILTER`, `TUTOR_BOARD_ANCHORED_SPEECH`, `TUTOR_SKETCH`, `TUTOR_ANSWER_EQUIVALENCE` are not `NEXT_PUBLIC_` and `next.config.ts` has no `env` block, so in the browser they are `undefined`. Consequence: BASE_PROMPT + branding is the same for every session of a deployment (the subject-filtered prose block always renders in full), so `core` needs no subject variants. The only variant dimension for the shared entry is the tools array.
- Side finding, NOT fixed here (it would change behaviour): those three server-side prompt rules never reach the claude-brain prompt in production. Report it to Praveen in the hand-off.
- One engine process serves all tenants and resolves one key (`TUTOR_MODEL_BRAIN_API_KEY || TUTOR_MODEL_API_KEY || ANTHROPIC_API_KEY`), so the cache is shared across tenants.
- Simplification of spec §2: because `core` has no subject variants, the "one resolver for tool array, prose block and catalog" reduces to latching the tool list scope per session (Task 2 `nextToolScope`, Task 4).
- Deviation from the spec: instead of persisting a `tokenUsage` array for embed sessions (a `$push` that would duplicate on retried/keepalive saves), per-turn usage is added to the already-persisted `brain_turn` debug message. Same information, no new save path.

## File Structure

| File | Responsibility |
|---|---|
| Create `src/lib/tutor/ai/prompt-cache.ts` | Pure helpers, no SDK import: system blocks, wire split, server-side part resolution, tool-scope latch, cache-key log line |
| Modify `src/lib/tutor/ai/system-prompt-builder.ts` | `buildSystemPromptParts`; `buildSystemPrompt` becomes its concatenation |
| Modify `src/lib/tutor/voice/claude-brain.ts` | `BrainTurnInput.systemPromptCore`; three request sites use `buildSystemBlocks` |
| Modify `src/app/api/tutor/brain/stream/route.ts` | Accept the two parts, flag, sticky tool scope, `[cachekey]` log |
| Modify `src/app/tutor/components/VoiceTutorRealtime.tsx` | Keep `core`, send parts, latch tool scope, `cache_start` event, usage in `brain_turn` |
| Modify `src/app/tutor-portal/embed/page.tsx` | Allowlist `cache_start` |
| Create `scripts/test-prompt-cache.ts`, `scripts/test-system-prompt-parts.ts`, `scripts/fixtures/system-prompt-hashes.json` | Tests |
| Create `scripts/measure-prompt-cache-parts.ts`, `scripts/probe-shared-cache.ts` | Token counts (free) and the live two-session proof (paid) |

## Review Focus

1. A session whose `session` part is empty or whitespace (or whose `core` is not a prefix of the full prompt) must fall back to ONE system block; the API rejects cache markers on empty text. Pinned in Task 2.
2. An old browser tab that still sends only `systemPrompt` must keep working after the server deploys. Pinned in Task 3.
3. A session that starts with no lesson plan and gets one on turn 2 must stay on the full tool list (no second cache rewrite), and a session can never go from full back to filtered. Pinned in Task 2.
4. With `TUTOR_SHARED_PROMPT_CACHE=off` the request must be exactly one system block containing `core + session`. Pinned in Task 3.
5. A mid-session prompt rebuild (humor change, profile fetch settling) must change only `session`, never `core`. Pinned in Task 1 (core identical across the whole matrix, including humor and persona).

---

### Task 1: Split the prompt builder into core and session

**Files:**
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` (function at ~L1692–2013)
- Create: `scripts/gen-system-prompt-hashes.ts`, `scripts/fixtures/system-prompt-hashes.json`, `scripts/test-system-prompt-parts.ts`
- Modify: `package.json` (add `test:system-prompt-parts`)

**Interfaces:**
- Produces: `export function buildSystemPromptParts(context: SystemPromptContext): { core: string; session: string }` and unchanged `export function buildSystemPrompt(context: SystemPromptContext): string` (`= core + session`).

- [ ] **Step 1: Write the golden-hash generator (runs against the UNCHANGED builder)**

Create `scripts/gen-system-prompt-hashes.ts`:

```ts
/**
 * Golden hashes of buildSystemPrompt over a context matrix. Generated ONCE
 * against the pre-split builder; test-system-prompt-parts.ts asserts the split
 * builder still produces the same bytes. Run: npx tsx scripts/gen-system-prompt-hashes.ts
 */
import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { buildSystemPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { PROMPT_MATRIX } from './fixtures/system-prompt-matrix';

const out: Record<string, string> = {};
for (const [name, ctx] of Object.entries(PROMPT_MATRIX)) {
  out[name] = createHash('sha256').update(buildSystemPrompt(ctx)).digest('hex');
}
fs.writeFileSync(path.join(__dirname, 'fixtures', 'system-prompt-hashes.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`wrote ${Object.keys(out).length} hashes`);
```

Create `scripts/fixtures/system-prompt-matrix.ts`:

```ts
import type { SystemPromptContext } from '@/lib/tutor/ai/system-prompt-builder';

const base = { module: null, timeRemainingMinutes: 30, currentState: 'greeting' } as unknown as SystemPromptContext;
const ctx = (o: Record<string, unknown>) => ({ ...base, ...o }) as SystemPromptContext;

/** Mirrors what VoiceTutorRealtime passes. Server-only prompt flags are left
 *  unset, as they are in the browser. */
export const PROMPT_MATRIX: Record<string, SystemPromptContext> = {
  math_g8: ctx({ subject: 'math', topic: 'linear-equations', level: 'grade-8', studentName: 'Alex', sessionGoal: 'concept-review' }),
  physics_ap: ctx({ subject: 'physics', topic: 'kinematics', level: 'ap', studentName: 'Maya', sessionGoal: 'practice' }),
  freetext_subject: ctx({ subject: 'Financial Literacy', topic: 'Own a Piece or Lend the Money?', level: '11th Grade', studentName: 'Praveen', sessionGoal: 'homework-help' }),
  no_name_no_topic: ctx({ subject: 'biology', level: 'High school', sessionGoal: 'general' }),
  text_mode: ctx({ subject: 'math', topic: 'fractions', level: 'grade-6', studentName: 'Sam', sessionGoal: 'homework-help', inputMode: 'text' }),
  open_scope: ctx({ subject: 'cs', topic: 'ap-cs-principles', level: 'ap', studentName: 'Kai', sessionGoal: 'practice', openScope: true }),
  first_turn_flags: ctx({ subject: 'chemistry', topic: 'stoichiometry', level: 'grade-10', studentName: 'Ada', sessionGoal: 'test-prep', firstTurnV2: true, answerRevealGuard: true }),
  humor_override: ctx({ subject: 'math', topic: 'linear-equations', level: 'grade-8', studentName: 'Alex', sessionGoal: 'concept-review', sessionHumorOverride: 'off' }),
  self_report: ctx({ subject: 'ela', topic: 'essay-structure', level: 'grade-7', studentName: 'Noor', sessionGoal: 'catch-up', selfReportRouting: true }),
};
```

- [ ] **Step 2: Generate and commit the golden file before touching the builder**

Run: `npx tsx scripts/gen-system-prompt-hashes.ts`
Expected: `wrote 9 hashes`; `scripts/fixtures/system-prompt-hashes.json` exists with 9 entries.

```bash
git add scripts/gen-system-prompt-hashes.ts scripts/fixtures/
git commit -m "test(tutor): golden hashes of the system prompt before the core/session split"
```

- [ ] **Step 3: Write the failing test**

Create `scripts/test-system-prompt-parts.ts`:

```ts
/**
 * The core/session split must not change a single byte of the prompt, and
 * `core` must be identical for every session (it is the shared cache entry).
 * Run: npx tsx scripts/test-system-prompt-parts.ts
 */
import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as builder from '@/lib/tutor/ai/system-prompt-builder';
import { PROMPT_MATRIX } from './fixtures/system-prompt-matrix';

const golden: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'fixtures', 'system-prompt-hashes.json'), 'utf8'),
);
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const checks: Array<[string, boolean]> = [];
const parts = (builder as unknown as {
  buildSystemPromptParts?: (c: builder.SystemPromptContext) => { core: string; session: string };
}).buildSystemPromptParts;

checks.push(['buildSystemPromptParts is exported', typeof parts === 'function']);
const cores = new Set<string>();
for (const [name, ctx] of Object.entries(PROMPT_MATRIX)) {
  checks.push([`${name}: buildSystemPrompt bytes unchanged`, sha(builder.buildSystemPrompt(ctx)) === golden[name]]);
  if (!parts) continue;
  const p = parts(ctx);
  cores.add(p.core);
  checks.push([`${name}: core + session === full prompt`, sha(p.core + p.session) === golden[name]]);
  checks.push([`${name}: session is non-empty`, p.session.trim().length > 0]);
  checks.push([`${name}: session starts at the pedagogy spine`, p.session.startsWith('\n\n## Pedagogy spine')]);
}
checks.push(['core is identical across the whole matrix', cores.size === 1]);
checks.push(['core is the bulk of the prompt (> 150K chars)', [...cores][0]?.length > 150_000]);

let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
```

Add to `package.json` scripts (keep alphabetical neighbours as they are):

```json
"test:system-prompt-parts": "npx tsx scripts/test-system-prompt-parts.ts",
```

- [ ] **Step 4: Run it to make sure it fails**

Run: `npm run --silent test:system-prompt-parts`
Expected: FAIL on `buildSystemPromptParts is exported` and `core is identical across the whole matrix`; the nine `bytes unchanged` lines PASS.

- [ ] **Step 5: Implement the split**

In `src/lib/tutor/ai/system-prompt-builder.ts`:

1. Rename the existing function signature

```ts
export function buildSystemPrompt(context: SystemPromptContext): string {
  let prompt = BASE_PROMPT;
```

to

```ts
/**
 * Build the system prompt as two parts. `core` (BASE_PROMPT + branding) is
 * the same for every session of a deployment and is the cross-session cache
 * entry; `session` is everything after it. `core + session` is the complete
 * prompt — nothing moves, the split is only a cut point.
 * See docs/superpowers/specs/2026-10-02-tutor-token-optimization-design.md.
 */
export function buildSystemPromptParts(context: SystemPromptContext): { core: string; session: string } {
  let prompt = BASE_PROMPT;
```

2. Immediately after the branding append (`prompt += \`\n\n${renderBrandingBlock(branding)}\n\`;`) add:

```ts
  // Cut point: everything above is session-independent.
  const core = prompt;
```

3. Replace the final `return prompt + textModeClause;` with:

```ts
  return { core, session: (prompt + textModeClause).slice(core.length) };
}

/**
 * Build the complete system prompt
 */
export function buildSystemPrompt(context: SystemPromptContext): string {
  const { core, session } = buildSystemPromptParts(context);
  return core + session;
}
```

(Delete the old `/** Build the complete system prompt */` comment that sat above the renamed function so it is not duplicated.)

- [ ] **Step 6: Run the test and the existing byte-identity check**

Run: `npm run --silent test:system-prompt-parts && npx tsx scripts/verify-trim2-byte-identical.ts && npx tsc --noEmit -p .`
Expected: all PASS; tsc exits 0.

- [ ] **Step 7: Commit**

```bash
git add src/lib/tutor/ai/system-prompt-builder.ts scripts/test-system-prompt-parts.ts package.json
git commit -m "feat(tutor): buildSystemPromptParts — core/session cut point, bytes unchanged"
```

---

### Task 2: Pure cache helpers

**Files:**
- Create: `src/lib/tutor/ai/prompt-cache.ts`
- Create: `scripts/test-prompt-cache.ts`
- Modify: `package.json` (add `test:prompt-cache`)

**Interfaces:**
- Consumes: `resolveToolSubjects(uiSubject, topic?)` and type `CatalogSubject` from `@/lib/tutor/ai/tool-subject-taxonomy`.
- Produces (all exported from `@/lib/tutor/ai/prompt-cache`):
  - `type SystemBlock = { type: 'text'; text: string; cache_control: { type: 'ephemeral'; ttl: '1h' } }`
  - `buildSystemBlocks(systemPrompt: string, core?: string): SystemBlock[]`
  - `splitPromptForWire(full: string, core: string): { systemPrompt: string } | { systemPromptCore: string; systemPromptSession: string }`
  - `resolveSystemPrompt(body: { systemPrompt?: unknown; systemPromptCore?: unknown; systemPromptSession?: unknown }, sharedCacheOn: boolean): { full: string; core?: string } | null`
  - `type ToolScope = 'subject' | 'full'`
  - `nextToolScope(prev: ToolScope | null, turn: { openScope: boolean; hasPlan: boolean; planId: string }): ToolScope`
  - `allowedSubjectsForTurn(a: { toolScope?: unknown; subject?: string; hasPlan: boolean; planId: string }): CatalogSubject[] | null`
  - `cacheKeyLine(a: { core?: string; toolNames: string[]; mode: string; homework: boolean }): string`

- [ ] **Step 1: Write the failing test**

Create `scripts/test-prompt-cache.ts`:

```ts
/**
 * Pure helpers behind the shared prompt cache.
 * Run: npx tsx scripts/test-prompt-cache.ts
 */
import {
  buildSystemBlocks, splitPromptForWire, resolveSystemPrompt,
  nextToolScope, allowedSubjectsForTurn, cacheKeyLine,
} from '@/lib/tutor/ai/prompt-cache';

const checks: Array<[string, boolean]> = [];
const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const M = { type: 'ephemeral', ttl: '1h' };

// buildSystemBlocks
const two = buildSystemBlocks('COREsession', 'CORE');
checks.push(['two blocks when core is a proper prefix', two.length === 2 && two[0].text === 'CORE' && two[1].text === 'session']);
checks.push(['both blocks carry the 1h marker', two.every((b) => eq(b.cache_control, M))]);
checks.push(['blocks concatenate to the full prompt', two.map((b) => b.text).join('') === 'COREsession']);
checks.push(['one block when core is undefined', eq(buildSystemBlocks('COREsession').map((b) => b.text), ['COREsession'])]);
checks.push(['one block when core is empty', buildSystemBlocks('COREsession', '').length === 1]);
checks.push(['one block when core is not a prefix', buildSystemBlocks('COREsession', 'OTHER').length === 1]);
checks.push(['one block when session would be empty', buildSystemBlocks('CORE', 'CORE').length === 1]);
checks.push(['one block when session would be whitespace only', buildSystemBlocks('CORE \n', 'CORE').length === 1]);

// splitPromptForWire
checks.push(['wire split sends the two parts', eq(splitPromptForWire('COREsession', 'CORE'), { systemPromptCore: 'CORE', systemPromptSession: 'session' })]);
checks.push(['wire split falls back to the legacy field (no core)', eq(splitPromptForWire('COREsession', ''), { systemPrompt: 'COREsession' })]);
checks.push(['wire split falls back when core is not a prefix', eq(splitPromptForWire('COREsession', 'X'), { systemPrompt: 'COREsession' })]);
checks.push(['wire split falls back when nothing follows core', eq(splitPromptForWire('CORE', 'CORE'), { systemPrompt: 'CORE' })]);

// resolveSystemPrompt (server)
checks.push(['parts + flag on → full and core', eq(resolveSystemPrompt({ systemPromptCore: 'C', systemPromptSession: 'S' }, true), { full: 'CS', core: 'C' })]);
checks.push(['parts + flag off → full only (single block)', eq(resolveSystemPrompt({ systemPromptCore: 'C', systemPromptSession: 'S' }, false), { full: 'CS' })]);
checks.push(['legacy systemPrompt still accepted', eq(resolveSystemPrompt({ systemPrompt: 'LEGACY' }, true), { full: 'LEGACY' })]);
checks.push(['parts win over a legacy field sent alongside', eq(resolveSystemPrompt({ systemPrompt: 'L', systemPromptCore: 'C', systemPromptSession: 'S' }, true), { full: 'CS', core: 'C' })]);
checks.push(['empty session part → legacy field', eq(resolveSystemPrompt({ systemPrompt: 'L', systemPromptCore: 'C', systemPromptSession: '' }, true), { full: 'L' })]);
checks.push(['nothing usable → null', resolveSystemPrompt({ systemPromptCore: 'C' }, true) === null]);
checks.push(['non-string values → null', resolveSystemPrompt({ systemPrompt: 42, systemPromptCore: {}, systemPromptSession: [] }, true) === null]);

// nextToolScope (client latch)
const plan = { openScope: false, hasPlan: true, planId: 'evelyn.math.g8.v1' };
checks.push(['curated plan → subject', nextToolScope(null, plan) === 'subject']);
checks.push(['no plan on turn 1 → full', nextToolScope(null, { ...plan, hasPlan: false, planId: '' }) === 'full']);
checks.push(['full is sticky when the plan arrives later', nextToolScope('full', plan) === 'full']);
checks.push(['freestyle plan → full', nextToolScope(null, { ...plan, planId: 'freestyle-abc' }) === 'full']);
checks.push(['open scope → full', nextToolScope(null, { ...plan, openScope: true }) === 'full']);
checks.push(['subject widens to full when a later turn is untrusted', nextToolScope('subject', { ...plan, planId: 'freestyle-x' }) === 'full']);
checks.push(['subject stays subject on a trusted turn', nextToolScope('subject', plan) === 'subject']);

// allowedSubjectsForTurn (server)
checks.push(['scope full → null (every tool)', allowedSubjectsForTurn({ toolScope: 'full', subject: 'math', hasPlan: true, planId: 'p' }) === null]);
checks.push(['scope subject + trusted → subject set', eq(allowedSubjectsForTurn({ toolScope: 'subject', subject: 'math', hasPlan: true, planId: 'p' }), ['math'])]);
checks.push(['scope subject but no plan this turn → null', allowedSubjectsForTurn({ toolScope: 'subject', subject: 'math', hasPlan: false, planId: '' }) === null]);
checks.push(['legacy client (no scope) + trusted → subject set', eq(allowedSubjectsForTurn({ subject: 'physics', hasPlan: true, planId: 'p' }), ['physics'])]);
checks.push(['legacy client + freestyle → null', allowedSubjectsForTurn({ subject: 'physics', hasPlan: true, planId: 'freestyle-1' }) === null]);
checks.push(['unknown scope value is treated as legacy', eq(allowedSubjectsForTurn({ toolScope: 'weird', subject: 'math', hasPlan: true, planId: 'p' }), ['math'])]);
checks.push(['unknown subject → null', allowedSubjectsForTurn({ toolScope: 'subject', subject: 'Financial Literacy', hasPlan: true, planId: 'p' }) === null]);

// cacheKeyLine
const l1 = cacheKeyLine({ core: 'C', toolNames: ['a', 'b'], mode: 'filter', homework: false });
const l2 = cacheKeyLine({ core: 'C', toolNames: ['a', 'b'], mode: 'filter', homework: false });
const l3 = cacheKeyLine({ core: 'C', toolNames: ['a', 'b', 'c'], mode: 'failopen', homework: true });
checks.push(['cache key line is deterministic', l1 === l2]);
checks.push(['cache key line shape', /^\[cachekey\] core=[0-9a-f]{8} tools=[0-9a-f]{8} n=2 mode=filter hw=0$/.test(l1)]);
checks.push(['different tool set → different tools hash', l1.split(' ')[2] !== l3.split(' ')[2]]);
checks.push(['no core → core=none', cacheKeyLine({ toolNames: ['a'], mode: 'failopen', homework: false }).includes('core=none')]);

let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
```

Add to `package.json` scripts:

```json
"test:prompt-cache": "npx tsx scripts/test-prompt-cache.ts",
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm run --silent test:prompt-cache`
Expected: FAIL — cannot find module `@/lib/tutor/ai/prompt-cache`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/tutor/ai/prompt-cache.ts`:

```ts
/**
 * Shared prompt cache — pure helpers (no SDK import; safe on client and server).
 *
 * The API caches by exact prefix in the order tools → system → messages. The
 * system prompt is sent as two blocks: `core` (same for every session of a
 * deployment) and the session tail. A marker on `core` makes tools + core one
 * cache entry that every session reads; the session block is written per
 * session. See docs/superpowers/specs/2026-10-02-tutor-token-optimization-design.md.
 */
import { createHash } from 'crypto';
import { resolveToolSubjects, type CatalogSubject } from '@/lib/tutor/ai/tool-subject-taxonomy';

export type SystemBlock = {
  type: 'text';
  text: string;
  cache_control: { type: 'ephemeral'; ttl: '1h' };
};

const marker = (): SystemBlock['cache_control'] => ({ type: 'ephemeral', ttl: '1h' });

/** True when `core` is a proper prefix of `full` and something non-blank follows it. */
function splittable(full: string, core: string | undefined): core is string {
  return (
    typeof core === 'string' &&
    core.length > 0 &&
    full.length > core.length &&
    full.startsWith(core) &&
    full.slice(core.length).trim().length > 0
  );
}

/**
 * Two blocks (core, session) when the split is valid, otherwise the single
 * legacy block. The API rejects a cache marker on an empty text block, so any
 * doubt collapses to one block rather than risking a 400 on a live turn.
 */
export function buildSystemBlocks(systemPrompt: string, core?: string): SystemBlock[] {
  if (splittable(systemPrompt, core)) {
    return [
      { type: 'text', text: core, cache_control: marker() },
      { type: 'text', text: systemPrompt.slice(core.length), cache_control: marker() },
    ];
  }
  return [{ type: 'text', text: systemPrompt, cache_control: marker() }];
}

/** Client → server body fields. Same bytes on the wire as before, just cut in two. */
export function splitPromptForWire(
  full: string,
  core: string,
): { systemPrompt: string } | { systemPromptCore: string; systemPromptSession: string } {
  if (splittable(full, core)) {
    return { systemPromptCore: core, systemPromptSession: full.slice(core.length) };
  }
  return { systemPrompt: full };
}

/**
 * Server: accept the two parts (new clients) or the legacy single string (old
 * tabs, scripts). `core` is returned only when the shared cache is enabled;
 * without it the caller sends one block, exactly as before.
 */
export function resolveSystemPrompt(
  body: { systemPrompt?: unknown; systemPromptCore?: unknown; systemPromptSession?: unknown },
  sharedCacheOn: boolean,
): { full: string; core?: string } | null {
  const { systemPromptCore: core, systemPromptSession: session, systemPrompt: legacy } = body;
  if (typeof core === 'string' && core.length > 0 && typeof session === 'string' && session.length > 0) {
    return sharedCacheOn ? { full: core + session, core } : { full: core + session };
  }
  if (typeof legacy === 'string' && legacy.length > 0) return { full: legacy };
  return null;
}

export type ToolScope = 'subject' | 'full';

/**
 * Client-side latch for the tool list. The tools array is the FIRST thing in
 * the cache prefix, so changing it rewrites the whole cache. A session may
 * widen from the subject-filtered list to the full list once; it never
 * narrows. A turn is untrusted (full list) when the session is open-scope,
 * has no lesson plan, or the plan is freestyle (pasted content, any subject).
 */
export function nextToolScope(
  prev: ToolScope | null,
  turn: { openScope: boolean; hasPlan: boolean; planId: string },
): ToolScope {
  if (prev === 'full') return 'full';
  const untrusted = turn.openScope || !turn.hasPlan || turn.planId.startsWith('freestyle-');
  return untrusted ? 'full' : 'subject';
}

/**
 * Server: the subject set to filter the tools array by, or null for every
 * tool. The client's latched scope can only widen the result; the server's
 * own untrusted check (no plan / freestyle) still applies on every turn, and
 * a client that sends no scope gets the pre-latch behaviour.
 */
export function allowedSubjectsForTurn(a: {
  toolScope?: unknown;
  subject?: string;
  hasPlan: boolean;
  planId: string;
}): CatalogSubject[] | null {
  if (a.toolScope === 'full') return null;
  if (!a.hasPlan || a.planId.startsWith('freestyle-')) return null;
  return resolveToolSubjects(a.subject);
}

const sha8 = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 8);

/** One grep-able line per turn naming the shared cache entry the turn used. */
export function cacheKeyLine(a: { core?: string; toolNames: string[]; mode: string; homework: boolean }): string {
  return (
    `[cachekey] core=${a.core ? sha8(a.core) : 'none'} tools=${sha8(a.toolNames.join(','))} ` +
    `n=${a.toolNames.length} mode=${a.mode} hw=${a.homework ? 1 : 0}`
  );
}
```

Note: `import { createHash } from 'crypto'` is used only by `cacheKeyLine`, which only the server calls. If `next build` (Task 6) reports that `crypto` cannot be resolved for the client bundle, move `cacheKeyLine` and `sha8` into a new server-only file `src/lib/tutor/ai/prompt-cache-log.ts`, re-point the route import and the test import, and re-run this task's test.

- [ ] **Step 4: Run the test**

Run: `npm run --silent test:prompt-cache && npx tsc --noEmit -p .`
Expected: `37/37 passed`; tsc exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/ai/prompt-cache.ts scripts/test-prompt-cache.ts package.json
git commit -m "feat(tutor): prompt-cache helpers — system blocks, wire split, tool-scope latch, cache-key line"
```

---

### Task 3: Server sends two system blocks

**Files:**
- Modify: `src/lib/tutor/voice/claude-brain.ts` (`BrainTurnInput` ~L189; request sites ~L1775–1794, ~L1997–2014, ~L2198–2204)
- Modify: `src/app/api/tutor/brain/stream/route.ts` (body type ~L68, validation ~L420, humor regex ~L471, tool filter ~L596–604, after the homework block ~L646, `turnInput` ~L756)
- Create: `scripts/test-brain-system-blocks.ts`; modify `package.json` (add `test:brain-system-blocks`)

**Interfaces:**
- Consumes: `buildSystemBlocks`, `resolveSystemPrompt`, `allowedSubjectsForTurn`, `cacheKeyLine` from Task 2.
- Produces: `BrainTurnInput.systemPromptCore?: string`; route body fields `systemPromptCore?: string`, `systemPromptSession?: string`, `toolScope?: 'subject' | 'full'` (Task 4 sends them).

- [ ] **Step 1: Write the failing test**

The three request sites are inside network functions, so the test pins the source wiring (same style as `scripts/test-embed-debug-coverage.ts`, which scans source text). Create `scripts/test-brain-system-blocks.ts`:

```ts
/**
 * Every brain request must build its system blocks through buildSystemBlocks
 * (so core/session caching and the single-block fallback are uniform), and
 * the route must accept both the split and the legacy prompt fields.
 * Run: npx tsx scripts/test-brain-system-blocks.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const SRC = path.join(__dirname, '..', 'src');
const brain = fs.readFileSync(path.join(SRC, 'lib', 'tutor', 'voice', 'claude-brain.ts'), 'utf8');
const route = fs.readFileSync(path.join(SRC, 'app', 'api', 'tutor', 'brain', 'stream', 'route.ts'), 'utf8');
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;
const checks: Array<[string, boolean]> = [];

checks.push(['claude-brain: 3 request sites use buildSystemBlocks', count(brain, /system: buildSystemBlocks\(input\.systemPrompt, input\.systemPromptCore\)/g) === 3]);
checks.push(['claude-brain: no hand-built system block remains', count(brain, /text: input\.systemPrompt,/g) === 0]);
checks.push(['claude-brain: BrainTurnInput declares systemPromptCore', /systemPromptCore\?: string;/.test(brain)]);
checks.push(['route: resolves the prompt through resolveSystemPrompt', /resolveSystemPrompt\(body, process\.env\.TUTOR_SHARED_PROMPT_CACHE !== 'off'\)/.test(route)]);
checks.push(['route: no direct body.systemPrompt use remains', count(route, /body\.systemPrompt\b/g) === 0]);
checks.push(['route: passes core to the brain', /systemPromptCore: prompt\.core,/.test(route)]);
checks.push(['route: tool filter goes through allowedSubjectsForTurn', /allowedSubjectsForTurn\(/.test(route)]);
checks.push(['route: logs the cache key', /cacheKeyLine\(/.test(route)]);

let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
```

Add to `package.json` scripts:

```json
"test:brain-system-blocks": "npx tsx scripts/test-brain-system-blocks.ts",
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm run --silent test:brain-system-blocks`
Expected: FAIL on all 8 checks.

- [ ] **Step 3: Implement in `claude-brain.ts`**

Add the import next to the other `@/lib/tutor/ai/*` imports:

```ts
import { buildSystemBlocks } from '@/lib/tutor/ai/prompt-cache';
```

In `BrainTurnInput`, directly under `systemPrompt: string;` add:

```ts
  /** Session-independent prefix of `systemPrompt` (BASE_PROMPT + branding).
   *  When set and a proper prefix, the request sends two system blocks so
   *  tools + core is one cache entry shared by every session. Absent ⇒ one
   *  block, as before. */
  systemPromptCore?: string;
```

At each of the three sites replace the whole literal

```ts
      system: [
        {
          type: 'text',
          text: input.systemPrompt,
          ...comment lines...
          cache_control: { type: 'ephemeral', ttl: '1h' },
        },
      ],
```

with

```ts
      // 1-hour TTL on every block: survives student pauses > 5 min, and the
      // core block must outlive the gap between sessions (shared entry).
      system: buildSystemBlocks(input.systemPrompt, input.systemPromptCore),
```

(Sites: the non-streaming `runBrainTurn` request, the streaming `streamBrainTurn` request, and the tools-less rescue call. Keep each site's indentation.)

- [ ] **Step 4: Implement in `route.ts`**

Add the import beside the existing taxonomy import:

```ts
import { resolveSystemPrompt, allowedSubjectsForTurn, cacheKeyLine } from '@/lib/tutor/ai/prompt-cache';
```

In `BrainStreamRequestBody` change `systemPrompt: string;` to:

```ts
  /** Legacy single-string prompt (old tabs, scripts). New clients send the
   *  two parts below instead; `core + session` is the same bytes. */
  systemPrompt?: string;
  systemPromptCore?: string;
  systemPromptSession?: string;
  /** Client-latched tool list scope: 'full' once the session has ever had an
   *  untrusted turn (no plan / freestyle / open scope). Can only widen. */
  toolScope?: 'subject' | 'full';
```

Replace the validation

```ts
  if (typeof body.systemPrompt !== 'string' || body.systemPrompt.length === 0) {
    return badRequest('systemPrompt is required');
  }
```

with

```ts
  // Shared prompt cache: default ON. 'off' ⇒ core is dropped and the request
  // carries one system block, byte-identical to the pre-split behaviour.
  const prompt = resolveSystemPrompt(body, process.env.TUTOR_SHARED_PROMPT_CACHE !== 'off');
  if (!prompt) {
    return badRequest('systemPrompt is required');
  }
```

Change the humor regex line from `body.systemPrompt.match(` to `prompt.full.match(`.

In the tool filter `else` branch replace

```ts
        const planId = body.lessonPlanContext?.plan?.id ?? '';
        const untrusted =
          !body.lessonPlanContext || planId.startsWith('freestyle-');
        toolFilter = filterToolsForSubject(
          WHITEBOARD_TOOLS,
          untrusted ? null : resolveToolSubjects(body.subject),
        );
```

with

```ts
        toolFilter = filterToolsForSubject(
          WHITEBOARD_TOOLS,
          allowedSubjectsForTurn({
            toolScope: body.toolScope,
            subject: body.subject,
            hasPlan: !!body.lessonPlanContext,
            planId: body.lessonPlanContext?.plan?.id ?? '',
          }),
        );
```

If `resolveToolSubjects` is now unused in `route.ts`, remove it from the import list (tsc/lint will say).

Directly after the `if (homework) { … }` block add:

```ts
      // Which shared cache entry this turn can read: tools + core. One line
      // per turn, next to [toolfilter] and [brain.stream].
      console.log(
        cacheKeyLine({
          core: prompt.core,
          toolNames: toolFilter.tools.map((t) => t.name),
          mode: toolFilter.mode,
          homework: !!homework,
        }),
      );
```

In `turnInput` replace `systemPrompt: body.systemPrompt,` with:

```ts
          systemPrompt: prompt.full,
          systemPromptCore: prompt.core,
```

- [ ] **Step 5: Run the tests**

Run: `npm run --silent test:brain-system-blocks && npm run --silent test:prompt-cache && npm run --silent test:brain-fallback-permission && npx tsc --noEmit -p .`
Expected: `8/8 passed`, `37/37 passed`, `6/6 passed`, tsc exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/lib/tutor/voice/claude-brain.ts src/app/api/tutor/brain/stream/route.ts scripts/test-brain-system-blocks.ts package.json
git commit -m "feat(tutor): brain requests send core + session system blocks; sticky tool scope; [cachekey] log"
```

---

### Task 4: Client sends the parts, latches tool scope, reports warm/cold starts

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (ref ~L2070; body ~L11200 and ~L11270; usage site ~L14617; `brain_turn` ~L15728; prompt build ~L21050 and ~L21106)
- Modify: `src/app/tutor-portal/embed/page.tsx` (`EMBED_DEBUG_EVENT_PREFIXES` ~L51)
- Create: `scripts/test-client-prompt-parts.ts`; modify `package.json` (add `test:client-prompt-parts`)

**Interfaces:**
- Consumes: `buildSystemPromptParts` (Task 1); `splitPromptForWire`, `nextToolScope`, `type ToolScope` (Task 2); route body fields from Task 3.
- Produces: debug event `cache_start` (message `read=<n> created=<n> in=<n>`), once per mounted session; `brain_turn` message gains ` · in=<n> out=<n> cr=<n> cc=<n>`.

- [ ] **Step 1: Write the failing test**

Create `scripts/test-client-prompt-parts.ts`:

```ts
/**
 * The session component must send the split prompt, latch the tool scope and
 * emit the warm/cold start event; the embed page must persist that event.
 * Run: npx tsx scripts/test-client-prompt-parts.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const SRC = path.join(__dirname, '..', 'src');
const vtr = fs.readFileSync(path.join(SRC, 'app', 'tutor', 'components', 'VoiceTutorRealtime.tsx'), 'utf8');
const embed = fs.readFileSync(path.join(SRC, 'app', 'tutor-portal', 'embed', 'page.tsx'), 'utf8');
const checks: Array<[string, boolean]> = [];

checks.push(['VTR builds the prompt through buildSystemPromptParts', /buildSystemPromptParts\(\{/.test(vtr)]);
checks.push(['VTR stores core in a ref', /claudeSystemPromptCoreRef\.current = promptParts\.core;/.test(vtr)]);
checks.push(['VTR body spreads splitPromptForWire', /\.\.\.splitPromptForWire\(claudeSystemPromptRef\.current, claudeSystemPromptCoreRef\.current\),/.test(vtr)]);
checks.push(['VTR body no longer sends the single string', !/systemPrompt: claudeSystemPromptRef\.current,/.test(vtr)]);
checks.push(['VTR latches the tool scope', /toolScopeRef\.current = nextToolScope\(toolScopeRef\.current,/.test(vtr)]);
checks.push(['VTR sends toolScope', /toolScope: toolScopeRef\.current,/.test(vtr)]);
checks.push(['VTR emits cache_start once', /onDebugEvent\?\.\('cache_start'/.test(vtr) && /cacheStartLoggedRef\.current = true;/.test(vtr)]);
checks.push(['brain_turn message carries usage', /cr=\$\{lastUsage\?\.cacheReadTokens \?\? 0\} cc=\$\{lastUsage\?\.cacheCreationTokens \?\? 0\}/.test(vtr)]);
checks.push(['embed allowlist persists cache_start', /'cache_start'/.test(embed)]);

let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
```

Add to `package.json` scripts:

```json
"test:client-prompt-parts": "npx tsx scripts/test-client-prompt-parts.ts",
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm run --silent test:client-prompt-parts`
Expected: FAIL on all 9 checks.

- [ ] **Step 3: Implement in `VoiceTutorRealtime.tsx`**

a. Imports: change the builder import to include `buildSystemPromptParts` (keep any other names already imported from that module; `buildSystemPrompt` may become unused — remove it only if tsc/lint reports it unused), and add:

```ts
import { splitPromptForWire, nextToolScope, type ToolScope } from '@/lib/tutor/ai/prompt-cache';
```

b. Next to `const claudeSystemPromptRef = useRef<string>('');` add:

```ts
  // Shared prompt cache: the session-independent prefix of the prompt
  // (BASE_PROMPT + branding). Sent separately so the server can cache
  // tools + core once for every session.
  const claudeSystemPromptCoreRef = useRef<string>('');
  // Tool list scope, latched: once a turn is untrusted (no plan / freestyle /
  // open scope) the session stays on the full list — the tools array is the
  // first thing in the cache prefix, so it must never flip back and forth.
  const toolScopeRef = useRef<ToolScope | null>(null);
  const cacheStartLoggedRef = useRef(false);
```

c. In the prompt-build effect replace

```ts
        const systemPrompt = buildSystemPrompt({
```

with

```ts
        const promptParts = buildSystemPromptParts({
```

and, directly after that call's closing `});`, add:

```ts
        const systemPrompt = promptParts.core + promptParts.session;
```

Then next to `claudeSystemPromptRef.current = openAIInstructions;` add:

```ts
        claudeSystemPromptCoreRef.current = promptParts.core;
```

(`openAIInstructions` starts with `systemPrompt`, so `core` is still a prefix of the full string and the voice wrapper lands in the session part.)

d. In `callBrainOnce`, immediately before `const input = {` add:

```ts
        toolScopeRef.current = nextToolScope(toolScopeRef.current, {
          openScope: !!openScope,
          hasPlan: !!lessonPlanContext,
          planId: lessonPlanContext?.plan?.id ?? '',
        });
```

In the `input` object replace

```ts
            systemPrompt: claudeSystemPromptRef.current,
```

with

```ts
            // Same bytes as before, cut at the core/session boundary (falls
            // back to the single `systemPrompt` field if the cut is invalid).
            ...splitPromptForWire(claudeSystemPromptRef.current, claudeSystemPromptCoreRef.current),
```

and directly after the existing `subject: openScope ? undefined : subject,` line add:

```ts
            toolScope: toolScopeRef.current,
```

If `openScope` or `lessonPlanContext` is not in scope under those names at that point, use the identifiers the surrounding code already uses for the `subject:` line and the `lessonPlanContext,` body field (both are a few lines away in the same object).

e. At the usage site, inside `if (lastUsage) {` and before `onBrainUsage?.({`, add:

```ts
                    if (!cacheStartLoggedRef.current) {
                      cacheStartLoggedRef.current = true;
                      // Warm start = large read, small created. Cold = the reverse.
                      onDebugEvent?.(
                        'cache_start',
                        `read=${lastUsage.cacheReadTokens ?? 0} created=${lastUsage.cacheCreationTokens ?? 0} in=${lastUsage.inputTokens ?? 0}`,
                      );
                    }
```

f. Change the success-path `brain_turn` event from

```ts
      onDebugEvent?.('brain_turn', `Brain ${ms}ms · ${totalToolNamesSeen.length} tool call(s) · ${totalSentenceCount} sentence(s) · first_sentence=${firstSentenceMs}ms`);
```

to

```ts
      onDebugEvent?.('brain_turn', `Brain ${ms}ms · ${totalToolNamesSeen.length} tool call(s) · ${totalSentenceCount} sentence(s) · first_sentence=${firstSentenceMs}ms · in=${lastUsage?.inputTokens ?? 0} out=${lastUsage?.outputTokens ?? 0} cr=${lastUsage?.cacheReadTokens ?? 0} cc=${lastUsage?.cacheCreationTokens ?? 0}`);
```

Before editing (f), run `grep -rn 'first_sentence=' src scripts --include='*.ts' --include='*.tsx' | grep -v VoiceTutorRealtime` and check no parser depends on the message ending at `first_sentence=…ms`; if one does, it must keep matching (the new text is appended, so prefix matches are unaffected).

- [ ] **Step 4: Persist the event for embed sessions**

In `src/app/tutor-portal/embed/page.tsx`, add to `EMBED_DEBUG_EVENT_PREFIXES` (new last entries, with a comment):

```ts
  // 2026-10-02 shared prompt cache: turn-1 warm/cold signal per session.
  'cache_start',
```

- [ ] **Step 5: Run the tests**

Run: `npm run --silent test:client-prompt-parts && npm run --silent test:embed-debug-coverage; npx tsc --noEmit -p .`
Expected: `9/9 passed`; `test:embed-debug-coverage` fails ONLY on the 5 pre-existing unregistered events (the same list it prints on `origin/main`) and does not list `cache_start`; tsc exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/app/tutor/components/VoiceTutorRealtime.tsx src/app/tutor-portal/embed/page.tsx scripts/test-client-prompt-parts.ts package.json
git commit -m "feat(tutor): client sends core/session prompt parts, latches tool scope, logs cache_start"
```

---

### Task 5: Measure and prove it against the real API

**Files:**
- Create: `scripts/measure-prompt-cache-parts.ts` (free: `countTokens`)
- Create: `scripts/probe-shared-cache.ts` (paid: three small real requests)
- Modify: `docs/superpowers/specs/2026-10-02-tutor-token-optimization-design.md` (append a "Measured" section)

**Interfaces:**
- Consumes: `buildSystemPromptParts` (Task 1), `buildSystemBlocks` (Task 2), `getModelClient` / `resolveModel` from `@/lib/tutor/ai/model-registry`, `WHITEBOARD_TOOLS` / `toAnthropicTools` from `@/app/tutor/hooks/toolDefinitions`, `filterToolsForSubject` / `resolveToolSubjects` from `@/lib/tutor/ai/tool-subject-taxonomy`.

- [ ] **Step 1: Write the token-count script**

Create `scripts/measure-prompt-cache-parts.ts`:

```ts
/**
 * Token sizes of the shared-cache parts on the live brain model. Uses
 * messages.countTokens (no generation, no charge). Run from apps/tutor:
 *   npx tsx scripts/measure-prompt-cache-parts.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { getModelClient } from '@/lib/tutor/ai/model-registry';
import { buildSystemPromptParts } from '@/lib/tutor/ai/system-prompt-builder';
import { WHITEBOARD_TOOLS, toAnthropicTools } from '@/app/tutor/hooks/toolDefinitions';
import { filterToolsForSubject, resolveToolSubjects } from '@/lib/tutor/ai/tool-subject-taxonomy';
import { PROMPT_MATRIX } from './fixtures/system-prompt-matrix';

async function main() {
  const { client } = getModelClient('brain');
  const model = process.env.MEASURE_MODEL || 'claude-sonnet-5'; // the prod brain (TUTOR_BRAIN_MODEL)
  const msg = [{ role: 'user' as const, content: 'hi' }];
  const count = async (p: { system?: string; tools?: ReturnType<typeof toAnthropicTools> }) =>
    (await client.messages.countTokens({ model, messages: msg, ...(p.system ? { system: p.system } : {}), ...(p.tools ? { tools: p.tools } : {}) })).input_tokens;

  const floor = await count({});
  const parts = buildSystemPromptParts(PROMPT_MATRIX.math_g8);
  console.log(`model=${model}  floor(messages only)=${floor}`);
  console.log(`core            ${(await count({ system: parts.core })) - floor} tok  (${parts.core.length} chars)`);
  for (const [name, ctx] of Object.entries(PROMPT_MATRIX)) {
    const s = buildSystemPromptParts(ctx).session;
    console.log(`session ${name.padEnd(18)} ${(await count({ system: s })) - floor} tok  (${s.length} chars)`);
  }
  const buckets: Array<[string, string | undefined]> = [
    ['full', undefined], ['math', 'math'], ['physics', 'physics'], ['chemistry', 'chemistry'], ['biology', 'biology'],
    ['earth', 'earth'], ['cs', 'cs'], ['ela', 'ela'], ['social', 'social'], ['science', 'science'],
  ];
  for (const [name, subject] of buckets) {
    const f = filterToolsForSubject(WHITEBOARD_TOOLS, subject ? resolveToolSubjects(subject) : null);
    console.log(`tools ${name.padEnd(10)} ${(await count({ tools: toAnthropicTools(f.tools) })) - floor} tok  (${f.sent}/${f.total} tools)`);
  }
}
main().catch((e) => { console.error('MEASURE FAILED:', e?.status ?? '', e?.message ?? e); process.exit(1); });
```

- [ ] **Step 2: Run it and record the numbers**

Run: `npx tsx scripts/measure-prompt-cache-parts.ts`
Expected: one `core` line, nine `session` lines, ten `tools` lines. Sanity: `core` + `tools full` should be the large majority of the total (order of 100K tokens); each `session` should be far smaller than `core`.

Append the raw output to the spec under a new heading `## Measured (YYYY-MM-DD, claude-sonnet-5)` and replace the estimate table's "≈" figures with the measured ones (keep the estimates' structure).

- [ ] **Step 3: Write the live probe**

Create `scripts/probe-shared-cache.ts`:

```ts
/**
 * Proof that two different sessions share the tools + core cache entry.
 * SPENDS REAL MONEY: one cold write of tools + core (≈ $0.50 on Sonnet 5)
 * plus small writes. Requires PROBE_ALLOW_SPEND=1. Run from apps/tutor:
 *   PROBE_ALLOW_SPEND=1 npx tsx scripts/probe-shared-cache.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { getModelClient, resolveModel } from '@/lib/tutor/ai/model-registry';
import { buildSystemPromptParts } from '@/lib/tutor/ai/system-prompt-builder';
import { buildSystemBlocks } from '@/lib/tutor/ai/prompt-cache';
import { WHITEBOARD_TOOLS, toAnthropicTools } from '@/app/tutor/hooks/toolDefinitions';
import { PROMPT_MATRIX } from './fixtures/system-prompt-matrix';

async function main() {
  if (process.env.PROBE_ALLOW_SPEND !== '1') throw new Error('refusing to spend: set PROBE_ALLOW_SPEND=1');
  const r = resolveModel('brain');
  if (!r.native) throw new Error(`brain resolves to a non-Anthropic endpoint (${r.model}); caching cannot be probed`);
  const { client, model } = getModelClient('brain');
  const tools = toAnthropicTools(WHITEBOARD_TOOLS);

  const call = async (label: string, ctxName: keyof typeof PROMPT_MATRIX) => {
    const p = buildSystemPromptParts(PROMPT_MATRIX[ctxName]);
    const res = await client.messages.create({
      model,
      max_tokens: 16,
      thinking: { type: 'disabled' },
      system: buildSystemBlocks(p.core + p.session, p.core),
      tools,
      messages: [{ role: 'user', content: 'Say hi in three words.' }],
    });
    const u = res.usage;
    console.log(`${label.padEnd(34)} read=${u.cache_read_input_tokens ?? 0} created=${u.cache_creation_input_tokens ?? 0} in=${u.input_tokens}`);
    return { read: u.cache_read_input_tokens ?? 0, created: u.cache_creation_input_tokens ?? 0 };
  };

  // A: first session (cold unless something warmed it in the last hour).
  const a = await call('A  session math_g8 (first)', 'math_g8');
  // B: a DIFFERENT session (other student, subject, level, goal) — must read tools + core.
  const b = await call('B  session freetext_subject', 'freetext_subject');
  // A again: same session — must read everything.
  const a2 = await call('A2 session math_g8 (repeat)', 'math_g8');

  const shared = a.read + a.created - 0; // total cached prefix of A = tools + core + session_A
  const checks: Array<[string, boolean]> = [
    ['B reads a large shared prefix (> 60% of A\'s cached prefix)', b.read > 0.6 * shared],
    ['B writes only its session tail (< 40% of A\'s cached prefix)', b.created < 0.4 * shared],
    ['A2 reads its whole prefix and writes ~nothing', a2.created < 200 && a2.read >= b.read],
  ];
  let fail = 0;
  for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error('PROBE FAILED:', e?.status ?? '', e?.message ?? e); process.exit(1); });
```

Do not register this script as `test:*` (it is paid and non-hermetic; `test:all` must not run it).

- [ ] **Step 4: Run the probe — ONLY after Praveen says go (≈ $0.60)**

Run: `PROBE_ALLOW_SPEND=1 npx tsx scripts/probe-shared-cache.ts`
Expected: three usage lines and 3 PASS. B's `read` should be close to `core + tools full` from Step 2 and B's `created` close to the `freetext_subject` session size. If B shows `read=0`, the prefix is not byte-identical between sessions: diff `buildSystemPromptParts(PROMPT_MATRIX.math_g8).core` against the `freetext_subject` core and check the tools array order before changing anything else.

Paste the three usage lines under the spec's `## Measured` section.

- [ ] **Step 5: Commit**

```bash
git add scripts/measure-prompt-cache-parts.ts scripts/probe-shared-cache.ts docs/superpowers/specs/2026-10-02-tutor-token-optimization-design.md
git commit -m "chore(tutor): token counts and live two-session proof for the shared prompt cache"
```

---

### Task 6: Gate

**Files:** none new.

- [ ] **Step 1: Merge the latest main and re-run everything on the merged tree**

```bash
git fetch origin && git merge origin/main
cd apps/tutor
npx tsc --noEmit -p .
npm run test:all
```

Expected: tsc exits 0. `test:all` fails only `test:embed-debug-coverage` and `test:portal-student-scoping` (both pre-existing; the second needs Mongo). The four new batteries (`test:system-prompt-parts`, `test:prompt-cache`, `test:brain-system-blocks`, `test:client-prompt-parts`) PASS.

- [ ] **Step 2: Production build**

Run: `npm run build` (from `apps/tutor`, with the worktree bring-up from Global Constraints done)
Expected: exit 0. If the build reports that `crypto` cannot be resolved in a client bundle, apply the note at the end of Task 2 Step 3, re-run Tasks 2–3 tests, and rebuild.

- [ ] **Step 3: Kill-switch check on a dev server**

Start the dev server twice (default, then with `TUTOR_SHARED_PROMPT_CACHE=off`), run one typed turn each through an embed token (`npx tsx scripts/mint-embed-token.ts --partner academy --mode text --student probe-cache-1`), and read the server log.
Expected, default: `[cachekey] core=<8 hex> tools=<8 hex> …` and, on a second session's first turn within the hour, `[brain.stream] … cache_read=` large and `cache_creation=` small. With the flag off: `[cachekey] core=none …`.
Each fresh session here can cost up to ≈ $0.50 if the cache is cold; ask Praveen before running it, and reuse the cache warmed by Task 5 where possible.

- [ ] **Step 4: Hand-off note (no deploy)**

Report to Praveen: commits on `tutor-token-opt`, the measured token table, the probe output, the side finding (server-only prompt flags never reach the browser-built prompt), and the deploy checklist (announce, `cmp` env files, `./deploy-tutor.sh` from the worktree, then watch `cache_start` events and `[cachekey]` lines for a week before deciding the variant/keep-warm policy in spec §4).
