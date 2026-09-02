# Course-Generation Model Routing + Grades 6/8 Cost Estimate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every offline content-generation script's model swappable by env (like the brain's `TUTOR_MODEL_<ROLE>` registry), instrument them all with token/cost logging, then run an instrumented pilot and hand Praveen a measured cost estimate for full Grades 6 & 8 course generation — **stopping there; no grade content is generated under this plan.**

**Architecture:** Three new registry roles (`content-gen`, `content-verify`, `notes-pointers`) route the engine's batch scripts through the existing `model-registry.ts` (env grammar `TUTOR_MODEL_<ROLE>` / `_BASE_URL` / `_API_KEY` comes free, so DeepSeek/Haiku are env-only swaps). Academy's guide generator (no registry there) gets a plain env override. A generalized bank-item generator (parameterized clone of the CPHQ one) makes item generation scriptable for future waves and measurable in the pilot. All defaults are byte-for-byte today's models — behavior changes only when an env var is set.

**Tech Stack:** TypeScript/tsx scripts, `@anthropic-ai/sdk` (incl. Message Batches API in Task 8), the engine model registry + `model-rates.ts`, Mongo via mongoose (existing scripts).

**Spec:** The "Course generation on a cheaper model" section of the Tutor Brain Economics artifact (https://claude.ai/code/artifact/a8ca15fa-cef2-460d-9d1e-5f7554b67397) + this header. Evidence base: the pipeline survey of 2026-09-02 (generator scripts, hardcoded models, gates — file:line cites repeated inline below).

## Global Constraints

- **Defaults unchanged.** Every task preserves today's model as the default (`content-gen`/`content-verify` → `claude-sonnet-5`, `notes-pointers` → `claude-opus-5` with legacy `POINTER_GEN_MODEL` honored, guides → `claude-opus-5`). With no new env set, every script must produce byte-identical requests. Swapping models is an env/ops decision made AFTER the Task 10 estimate, by Praveen.
- **HARD STOP after Task 10.** Present the estimate; do NOT begin Grade 6/8 generation, do NOT author wave plans, do NOT set any model-override env in prod. The generation itself gets its own wave plan (mirroring the tracked `academy/docs/superpowers/plans/2026-08-20-grade7-wave2-courses.md` runbook) once Praveen approves scope + models.
- Engine work in a linked worktree of `/Users/luke/Dev/evelynlearning` (`git rev-parse --git-dir` must contain `.git/worktrees/`). **Task 6 edits ONE file in `/Users/luke/Dev/academy`** (`tools/generate-guides.ts`) — academy is another session's lane: check `ListAgents` for a live academy session and announce the single-file edit before making it; commit it in academy with its own message; do not touch anything else there and do not deploy academy.
- Registry gotcha (from [[tutor-model-registry]]): `getModelClient()` at module scope in a tsx script constructs a client before dotenv runs — use a lazy getter (`let c; function client(){ return (c ??= getModelClient(role)); }`) in any script that loads dotenv itself.
- Non-native endpoints (any `_BASE_URL` override, e.g. DeepSeek): wrap request params in `prepareParams(role, params)` so Anthropic-only fields (`thinking`, `output_config`, `cache_control`) are stripped. The Batches API is Anthropic-only — batch mode must refuse when the resolved role is non-native.
- Pilot outputs are throwaway: never overwrite shipped content (`apps/web/content/guides/**`, `src/data/problem-bank/**`), never upsert to prod Mongo, never commit generated pilot content. Pilot writes go to explicitly-passed scratch dirs.
- Engine gate before each commit: `cd apps/tutor && npx tsc --noEmit` clean. Known pre-existing `test:all` failures (NOT yours): `test:embed-token`, `test:verdict-guard` non-answer, `test:pedagogy-posed-problem`, `test:pedagogy-d1`.
- Every LLM-calling script ends its run by printing `Token usage: <in> in / <out> out` and a cost line derived from `lookupModelRate` (engine) or the inline table (academy) — estimates are labeled informational.

---

### Task 1: Three content roles in the model registry

**Files:**
- Modify: `apps/tutor/src/lib/tutor/ai/model-registry.ts` (ModelRole union ~line 26-48, `DEFAULT_MODEL` ~50-73, `LEGACY_MODEL_ENV` ~76-82)
- Create: `apps/tutor/scripts/test-content-model-roles.ts`
- Modify: `apps/tutor/package.json` (add `test:content-model-roles`; `scripts/run-all-tests.mjs` auto-discovers `test:*` entries — verify it needs no edit by reading its discovery block)

**Interfaces:**
- Produces: registry roles `'content-gen'`, `'content-verify'`, `'notes-pointers'` resolvable via the existing `resolveModel(role)` / `getModelClient(role)` / `prepareParams(role, params)` — consumed by Tasks 2-5, 7, 8.

- [ ] **Step 1: Write the failing test** at `apps/tutor/scripts/test-content-model-roles.ts`, following the assert style of `scripts/test-cancel-storm.ts`:

```ts
/* Content-generation model roles resolve through the registry with correct
 * defaults, env override, and legacy alias. Run: npm run test:content-model-roles */
import { resolveModel } from '../src/lib/tutor/ai/model-registry';

let failures = 0;
function check(name: string, cond: boolean) {
  if (cond) console.log(`  ✓ ${name}`);
  else { failures++; console.error(`  ✗ ${name}`); }
}

// Defaults (no env set in the test process for these roles)
delete process.env.TUTOR_MODEL_CONTENT_GEN;
delete process.env.TUTOR_MODEL_CONTENT_VERIFY;
delete process.env.TUTOR_MODEL_NOTES_POINTERS;
delete process.env.POINTER_GEN_MODEL;
check('content-gen defaults to claude-sonnet-5', resolveModel('content-gen').model === 'claude-sonnet-5');
check('content-verify defaults to claude-sonnet-5', resolveModel('content-verify').model === 'claude-sonnet-5');
check('notes-pointers defaults to claude-opus-5', resolveModel('notes-pointers').model === 'claude-opus-5');

// Env override wins
process.env.TUTOR_MODEL_CONTENT_GEN = 'claude-haiku-4-5';
check('TUTOR_MODEL_CONTENT_GEN overrides', resolveModel('content-gen').model === 'claude-haiku-4-5');
delete process.env.TUTOR_MODEL_CONTENT_GEN;

// Legacy alias still works, and the registry var outranks it
process.env.POINTER_GEN_MODEL = 'claude-sonnet-5';
check('POINTER_GEN_MODEL legacy alias honored', resolveModel('notes-pointers').model === 'claude-sonnet-5');
process.env.TUTOR_MODEL_NOTES_POINTERS = 'claude-opus-5';
check('TUTOR_MODEL_NOTES_POINTERS outranks legacy', resolveModel('notes-pointers').model === 'claude-opus-5');

// Base-URL override flips native off (DeepSeek-style routing)
process.env.TUTOR_MODEL_CONTENT_VERIFY_BASE_URL = 'https://api.deepseek.com/anthropic';
check('base URL override → native:false', resolveModel('content-verify').native === false);
delete process.env.TUTOR_MODEL_CONTENT_VERIFY_BASE_URL;

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('content-model-roles: all assertions passed');
```

- [ ] **Step 2: Run it, expect failure.** `cd apps/tutor && npx tsx scripts/test-content-model-roles.ts` — expected: TypeScript/type error (`'content-gen'` not assignable to `ModelRole`).

- [ ] **Step 3: Implement.** In `model-registry.ts`, extend the union (after `| 'taxonomy'`):

```ts
  | 'content-gen'      // offline course-content generation (bank items, batch authoring scripts)
  | 'content-verify'   // offline fresh-context solve-verify gate (problem bank, mock forms)
  | 'notes-pointers';  // topic-notes pointer enrichment (legacy POINTER_GEN_MODEL)
```

`DEFAULT_MODEL` additions (values = today's hardcoded models — do not "improve" them):

```ts
  'content-gen': 'claude-sonnet-5',
  'content-verify': 'claude-sonnet-5',
  'notes-pointers': 'claude-opus-5',
```

`LEGACY_MODEL_ENV` addition:

```ts
  'notes-pointers': 'POINTER_GEN_MODEL',
```

- [ ] **Step 4: Add the package.json entry** `"test:content-model-roles": "tsx scripts/test-content-model-roles.ts"` matching neighboring `test:*` entries' runner exactly; read `scripts/run-all-tests.mjs`'s discovery block and confirm the new entry is auto-picked-up (add explicitly only if discovery is a hardcoded list).
- [ ] **Step 5: Run the test → PASS.** Then `npx tsc --noEmit` → clean.
- [ ] **Step 6: Commit** `git add apps/tutor && git commit -m "feat(tutor): content-gen/content-verify/notes-pointers roles in the model registry"`.

### Task 2: seed-problem-bank verify gate → registry + usage logging + --dry-run

**Files:**
- Modify: `apps/tutor/scripts/seed-problem-bank.ts` (`VERIFIER_MODEL` at ~:35, `verifyItem()` ~:173-226, verify call site ~:280-300, CLI parsing near the top — re-grep, lines drift)

**Interfaces:**
- Consumes: `getModelClient('content-verify')`, `prepareParams('content-verify', params)` (Task 1), `lookupModelRate(model)` from `src/lib/tutor/ai/model-rates.ts` (existing: returns `ModelRate | undefined`).
- Produces: CLI flag `--dry-run` (validate + verify, skip ALL Mongo writes) consumed by the Task 9 pilot; end-of-run usage/cost print.

- [ ] **Step 1: Route the model.** Read the whole script first. Replace `const VERIFIER_MODEL = 'claude-sonnet-5';` and the verify-site `new Anthropic({ apiKey: … })` with the registry:

```ts
import { getModelClient, prepareParams } from '../src/lib/tutor/ai/model-registry';
import { lookupModelRate } from '../src/lib/tutor/ai/model-rates';
```

At the verify call site (inside `main`, where `const anthropic = new Anthropic(...)` is today):

```ts
const { client: anthropic, model: verifierModel } = getModelClient('content-verify');
console.log(`\nVerifying ${items.length} items via ${verifierModel} (concurrency ${opts.concurrency})...`);
```

Change `verifyItem`'s signature to `verifyItem(anthropic: Anthropic, model: string, item: SeedItem, courseName: string)`; inside it, build `params` with `model` instead of `VERIFIER_MODEL` and send `prepareParams('content-verify', params)` instead of `params` (this strips `thinking`/`output_config` when a `_BASE_URL` override makes the role non-native — the ANTHROPIC_API_KEY guard at the call site should also relax to "registry resolved an apiKey": `getModelClient` already falls back to `ANTHROPIC_API_KEY`, so keep the guard but test `resolveModel('content-verify').apiKey` instead of the raw env var).

- [ ] **Step 2: Accumulate usage.** The `msg` cast currently types only `content` — extend it to `{ content: …; usage?: { input_tokens?: number; output_tokens?: number } }`, return `usage` alongside the verdict (extend `VerifyResult` with optional `usageIn`/`usageOut`), and sum in the call-site loop. After the verdict summary print:

```ts
const rate = lookupModelRate(verifierModel);
const cost = rate ? (usageIn / 1e6) * rate.input + (usageOut / 1e6) * rate.output : undefined;
console.log(`Token usage: ${usageIn} in / ${usageOut} out.` + (cost !== undefined ? ` Est. verify cost: $${cost.toFixed(3)} (informational)` : ' (no rate row for this model)'));
```

Adapt the `ModelRate` field names to the real interface at `model-rates.ts:10` — read it; if the fields are e.g. `inputPerMTok`/`outputPerMTok`, use those.

- [ ] **Step 3: Add `--dry-run`.** In the CLI parsing (follow the existing `--no-verify` flag's style): `--dry-run` runs validation + the verify gate but skips the Mongo connect/upsert entirely (early-return before any `mongoose.connect` write path; print `DRY RUN — nothing upserted`). Read the script's flow first: if Mongo is connected before verification, gate the connect too.
- [ ] **Step 4: Verify.** `npx tsc --noEmit` clean. Then a live smoke (cheap, ~6 calls): `npx tsx scripts/seed-problem-bank.ts --course cphq --limit 6 --dry-run` (adapt `--limit`/course to the script's real flags — read them; if no `--limit` exists, use the smallest course unit file). Expected: verify verdicts print, usage/cost line prints, no Mongo writes.
- [ ] **Step 5: Commit** `git commit -m "feat(tutor): seed-problem-bank verify gate routes through the content-verify registry role + usage logging + --dry-run"`.

### Task 3: seed-mock-form verify gate → registry + usage logging

**Files:**
- Modify: `apps/tutor/scripts/seed-mock-form.ts` (`VERIFIER_MODEL` ~:57, verify site ~:470-490)

**Interfaces:**
- Consumes: same as Task 2 (`content-verify` role, `prepareParams`, `lookupModelRate`).

- [ ] **Step 1: Apply the identical transformation as Task 2 Steps 1-2** (this file is the same pattern: `const VERIFIER_MODEL`, `new Anthropic(...)` at the verify site, a `verifyItem(anthropic, item)` — thread `model` through, wrap params in `prepareParams('content-verify', …)`, extend the usage cast, sum, print the usage/cost line). Do not add `--dry-run` here unless the script lacks an equivalent (it already has `--no-verify`; read the flags and report what exists).
- [ ] **Step 2: Verify** `npx tsc --noEmit` clean; if a cheap smoke exists (a small fixture form), run it — otherwise state in the report that typecheck + review is the verification and why.
- [ ] **Step 3: Commit** `git commit -m "feat(tutor): seed-mock-form verify gate routes through the content-verify registry role + usage logging"`.

### Task 4: generate-cphq-items → registry + shared rate table

**Files:**
- Modify: `apps/tutor/scripts/generate-cphq-items.ts` (`const MODEL = 'claude-sonnet-5'` at ~:33; client at ~:228; hardcoded $2/$10 math at ~:325-328)

**Interfaces:**
- Consumes: `getModelClient('content-gen')`, `prepareParams('content-gen', …)`, `lookupModelRate`.

- [ ] **Step 1: Route the model.** Replace `const MODEL = …` + `new Anthropic({ apiKey: … })` with `const { client: anthropic, model } = getModelClient('content-gen');` inside `main` (after dotenv — read where dotenv.config runs; this script loads it at the top, so inside `main` is safe). Thread `model` into `generateForLo` (it takes `anthropic` today — add a `model: string` param) and both `messages.create` sites; wrap both params objects in `prepareParams('content-gen', …)`.
- [ ] **Step 2: Replace the hardcoded rate math** (the `$2 + $10` block with the "intro pricing" comment) with `lookupModelRate(model)` priced the same way as Task 2 Step 2, keeping the "informational only" caveat.
- [ ] **Step 3: Verify** `npx tsc --noEmit` clean; run `npx tsx scripts/generate-cphq-items.ts --limit 1` against one LO (real call, ~$0.03) and confirm the printed model + cost line. If the LOS file (`.cphq-los.json`) is absent locally, skip the live run and say so.
- [ ] **Step 4: Commit** `git commit -m "feat(tutor): generate-cphq-items routes through the content-gen registry role, prices from model-rates"`.

### Task 5: gen-topic-notes-pointers → registry role (lazy client)

**Files:**
- Modify: `apps/tutor/scripts/gen-topic-notes-pointers.ts` (`const MODEL = process.env.POINTER_GEN_MODEL || 'claude-opus-5'` at ~:30; module-scope `const anthropic = new Anthropic(...)` at ~:36; the `messages.create` at ~:445)

**Interfaces:**
- Consumes: `getModelClient('notes-pointers')` (legacy `POINTER_GEN_MODEL` keeps working via Task 1's alias), `prepareParams`, `lookupModelRate`.

- [ ] **Step 1: Lazy client.** This script constructs its client at module scope — replace both the `MODEL` const and the module-scope client with the lazy-getter pattern (Global Constraints):

```ts
import { getModelClient, prepareParams } from '../src/lib/tutor/ai/model-registry';
import { lookupModelRate } from '../src/lib/tutor/ai/model-rates';
import type { RoleClient } from '../src/lib/tutor/ai/model-registry';

let _rc: RoleClient | null = null;
const rc = () => (_rc ??= getModelClient('notes-pointers'));
```

Replace uses of `MODEL` with `rc().model` and `anthropic.messages.create(p)` with `rc().client.messages.create(prepareParams('notes-pointers', p))`. Keep the existing ANTHROPIC_API_KEY guard but move it into `main` (module-scope guard + lazy client would otherwise still exit before an override-supplied `_API_KEY` could apply): `if (!resolveModel('notes-pointers').apiKey) { … exit … }`.

- [ ] **Step 2: Add the usage/cost print** (same pattern as Task 2 Step 2) accumulated across all calls in a run.
- [ ] **Step 3: Verify** `npx tsc --noEmit` clean. Confirm by grep that `POINTER_GEN_MODEL` no longer appears in the script (it lives in the registry alias now) and note it in the report.
- [ ] **Step 4: Commit** `git commit -m "feat(tutor): gen-topic-notes-pointers routes through the notes-pointers registry role"`.

### Task 6: academy generate-guides → env-swappable model + usage logging + --out-dir (CROSS-LANE)

**Files:**
- Modify: `/Users/luke/Dev/academy/tools/generate-guides.ts` (hardcoded `model: 'claude-opus-5'` at ~:238; worker pool + summary at ~:285-315)

**Interfaces:**
- Produces: env `GUIDES_MODEL` (default `claude-opus-5`); CLI flag `--out-dir <path>` (default unchanged: the existing guides dir) consumed by the Task 9 pilot; end-of-run usage/cost print.

- [ ] **Step 0: Cross-lane courtesy.** `ListAgents`; if an academy-repo session is live, message it that you are editing `tools/generate-guides.ts` only (no deploy). Proceed after announcing (or immediately if none is live — record which).
- [ ] **Step 1: Model + rates.** Academy has no registry — keep it simple:

```ts
const GUIDES_MODEL = process.env.GUIDES_MODEL || 'claude-opus-5';
// Informational rate table (per MTok in/out, Anthropic list, 2026-09). Extend as needed.
const RATES: Record<string, { in: number; out: number }> = {
  'claude-opus-5': { in: 5, out: 25 },
  'claude-sonnet-5': { in: 2, out: 10 },
  'claude-haiku-4-5': { in: 1, out: 5 },
};
```

Use `GUIDES_MODEL` in the `messages.create` call. Accumulate `res.usage.input_tokens`/`output_tokens` across `generate()` calls (module-level `let usageIn = 0, usageOut = 0;`), and extend the final `done:` summary:

```ts
const rate = RATES[GUIDES_MODEL];
console.log(`model: ${GUIDES_MODEL} — tokens ${usageIn} in / ${usageOut} out` +
  (rate ? ` — est. $${((usageIn / 1e6) * rate.in + (usageOut / 1e6) * rate.out).toFixed(3)} (informational)` : ''));
```

Note: if `GUIDES_MODEL` is a Haiku id, `thinking: { type: 'adaptive' }` is invalid on Haiku 4.5 (pre-4.6 thinking grammar) — read the create call and make `thinking` conditional: include it only when the model id does not start with `claude-haiku`.

- [ ] **Step 2: `--out-dir`.** Add the flag beside the existing `--course/--limit/--force` parsing; when present it overrides the computed `outDir` (pilot writes go to scratch, shipped guides untouched). Default behavior unchanged.
- [ ] **Step 3: Verify.** Academy's own typecheck (read package.json for the command; `npx tsc --noEmit` from `apps/web` or the repo's documented check). Then a one-node smoke: `GUIDES_MODEL=claude-opus-5 npx tsx tools/generate-guides.ts --course <existing course key> --limit 1 --force --out-dir /tmp/guides-smoke` — confirm the file lands in the scratch dir and the usage line prints.
- [ ] **Step 4: Commit (in academy)** `git -C /Users/luke/Dev/academy add tools/generate-guides.ts && git -C /Users/luke/Dev/academy commit -m "feat(tools): generate-guides model env-swappable (GUIDES_MODEL) + usage logging + --out-dir"`. Do NOT push or deploy academy; note the commit sha for Praveen.

### Task 7: Generalized bank-item generator (generate-bank-items.ts)

**Files:**
- Create: `apps/tutor/scripts/generate-bank-items.ts` (parameterized clone of `generate-cphq-items.ts` — that file is the reference implementation and stays untouched)

**Interfaces:**
- Consumes: `getModelClient('content-gen')` / `prepareParams` / `lookupModelRate` (Tasks 1, 4); LessonPlan grounding via the same Mongo fetch `generate-cphq-items.ts` uses (`fetchGrounding(planId, loId)` — copy it).
- Produces: CLI `npx tsx scripts/generate-bank-items.ts --los-file <path> --out-dir <path> --ced-prefix <str> [--items-per-lo 6] [--concurrency 4] [--limit N] [--only-lo id]` writing `u<unit>.json` files in the exact `SeedItem` shape `seed-problem-bank.ts` validates — so its output feeds directly into the existing verify gate. Consumed by the Task 9 pilot; the future-wave unlock for scripted item generation.

- [ ] **Step 1: Read `generate-cphq-items.ts` end-to-end** and list in your report what is CPHQ-specific (the LOS_FILE path, OUT_DIR, `CPHQ-U<unit>.<n>` cedCode format, the CPHQ-flavored SYSTEM prompt, DIFFICULTIES 1-4 with 4 items/LO).
- [ ] **Step 2: Create the clone, parameterized:** `--los-file` (same JSON shape: `{loId, planId, title, description, unit}[]`), `--out-dir`, `--ced-prefix` (cedCode = `<prefix>-U<unit>.<n>`), `--items-per-lo` (default 6, matching the Grade-7 wave's 6/LO; the prompt's item list scales with it — difficulties cycle 1..4), `--subject-label` (free text used in the system prompt in place of "CPHQ", e.g. "Grade 6 Mathematics"). The SYSTEM prompt must stay GENERIC pedagogically (no subject-specific worked examples — house rule); the subject enters only via `--subject-label` and the per-LO grounding. Reuse `runPool`, `stripFences`, slug/cedCode bookkeeping from the reference file. Route the model via `getModelClient('content-gen')` + `prepareParams` and price via `lookupModelRate` from the start.
- [ ] **Step 3: Verify with one real LO** (cheap): build a 1-entry LOS file pointing at an existing Grade-7 Math plan/LO (find one via the seeds or Mongo — the report must name which), run with `--limit 1 --out-dir <scratchpad>`, then feed the output through `npx tsx scripts/seed-problem-bank.ts --dry-run` pointing at the scratch dir (read how seed-problem-bank locates course dirs; if it only reads `src/data/problem-bank/<course>/`, add nothing — copy the scratch output into a temp course dir under a throwaway name for the check and delete it after; do NOT commit it). Expected: items validate and reach the verify gate.
- [ ] **Step 4: Typecheck clean → Commit** `git commit -m "feat(tutor): generalized bank-item generator (generate-bank-items) behind the content-gen role"`.

### Task 8: Batch API mode for the problem-bank verify gate

**Files:**
- Modify: `apps/tutor/scripts/seed-problem-bank.ts` (verify call site; `verifyItem` refactor)

**Interfaces:**
- Consumes: Task 2's registry routing. SDK: `client.messages.batches.create({ requests })` / `.retrieve(id)` / `.results(id)` (Anthropic Message Batches — 50% price, results keyed by `custom_id`, any order).
- Produces: CLI flag `--batch` on the verify gate.

- [ ] **Step 1: Extract param-building** from `verifyItem` into `buildVerifyParams(model, item, courseName)` returning the create-params object (post-`prepareParams`), and a `parseVerdict(item, rawText)` from the existing JSON-extraction + fallback logic, so the sequential path becomes `create(params)` → `parseVerdict` and stays behaviorally identical. Run the Task 2 smoke again to confirm no drift.
- [ ] **Step 2: Add `--batch`:** when set (and only when `resolveModel('content-verify').native` — otherwise exit with `--batch requires the Anthropic API (no _BASE_URL override)`),

```ts
const batch = await anthropic.messages.batches.create({
  requests: items.map((item) => ({
    custom_id: item.id,
    params: buildVerifyParams(verifierModel, item, courseName),
  })),
});
console.log(`Batch ${batch.id} submitted (${items.length} requests). Polling…`);
let status = batch;
while (status.processing_status !== 'ended') {
  await new Promise((r) => setTimeout(r, 30_000));
  status = await anthropic.messages.batches.retrieve(batch.id);
  console.log(`  …${status.processing_status}`);
}
const byId = new Map<string, VerifyResult>();
for await (const entry of await anthropic.messages.batches.results(batch.id)) {
  const item = items.find((i) => i.id === entry.custom_id)!;
  if (entry.result.type === 'succeeded') {
    const text = entry.result.message.content.find((b: { type: string }) => b.type === 'text') as { text?: string } | undefined;
    byId.set(entry.custom_id, parseVerdict(item, text?.text?.trim() ?? ''));
    // usage accumulation: entry.result.message.usage
  } else {
    byId.set(entry.custom_id, { ok: false, modelAnswer: '', note: `batch ${entry.result.type}` });
  }
}
const verdicts = items.map((i) => byId.get(i.id) ?? { ok: false, modelAnswer: '', note: 'missing from batch results' });
```

Adapt the iteration/typing to the installed SDK version (read `node_modules/@anthropic-ai/sdk` typings for `messages.batches`; if the installed SDK predates batches, STOP and report NEEDS_CONTEXT rather than upgrading the SDK unilaterally — an SDK bump is a shared-gate change). Batch usage is billed at 50% — note in the cost line (`× 0.5 batch discount`).

- [ ] **Step 3: Verify** with a real 6-item batch (`--course cphq --limit 6 --dry-run --batch`): submits, polls, verdicts match the sequential run's for the same items. Record wall-clock in the report.
- [ ] **Step 4: Typecheck clean → Commit** `git commit -m "feat(tutor): --batch mode for the problem-bank verify gate (Message Batches, 50% rate)"`.

### Task 9: Instrumented pilot — measure cost + first-pass yield per model

All runs use env overrides only; nothing committed, nothing upserted, scratch dirs only. Record for EVERY run: model, tokens in/out, printed cost, wall-clock, and the gate outcome (validation/verify pass counts). Suggested candidates: `claude-sonnet-5` (baseline), `claude-haiku-4-5` — plus `deepseek-chat` via `TUTOR_MODEL_CONTENT_GEN_BASE_URL=https://api.deepseek.com/anthropic` + `_API_KEY` **only if** the DeepSeek key (see [[tutor-model-registry]]) still has balance; skip otherwise and say so.

- [ ] **Step 1: Guides pilot (academy).** For one existing Grade-7 course key, 5 nodes each: `GUIDES_MODEL=claude-opus-5 … --limit 5 --force --out-dir /tmp/pilot-guides-opus` then the same 5 nodes with `GUIDES_MODEL=claude-sonnet-5` and `GUIDES_MODEL=claude-haiku-4-5`. Yield metric: how many of 5 pass `validateGuide` + KaTeX on the FIRST attempt (the script's own `retry` warnings count first-attempt failures). Also eyeball one guide per model for obvious quality collapse and say what you saw.
- [ ] **Step 2: Bank-items pilot (engine).** Build a LOS file for ~5 Grade-7 Math LOs (from the seeds/Mongo — name them). For each candidate model (`TUTOR_MODEL_CONTENT_GEN=<model> npx tsx scripts/generate-bank-items.ts --los-file … --items-per-lo 6 --out-dir /tmp/pilot-items-<model>`), then run each output through the verify gate at the Sonnet baseline (`npx tsx scripts/seed-problem-bank.ts --dry-run …`). Yield metric: verify pass-rate per generator model (the decision metric from the artifact). Verifier stays `claude-sonnet-5` for every leg — it is the instrument, don't vary it.
- [ ] **Step 3: Batch-discount check.** One `--batch --dry-run` verify leg (Task 8) over the same items; confirm identical verdicts and record the halved cost line.
- [ ] **Step 4: Write the raw table** to `docs/superpowers/reports/2026-09-02-course-gen-pilot.md` (create the dir if absent): one row per run with all recorded fields, plus a `first-pass yield` column. No conclusions in this file — numbers only. Commit it (engine repo): `git commit -m "docs(tutor): course-generation model pilot — raw measurements"`.

### Task 10: The Grades 6 & 8 estimate → Praveen (HARD STOP)

- [ ] **Step 1: Scope assumption.** Default scope: mirror Grade 7 — four courses per grade (Math, ELA, Science, Geography) × 2 grades = 8 courses, each at the Grade-7 shape (40 plans · 240 bank items @6/LO · 40 notes baselines · 40 guides, from the wave runbook). State it as an assumption Praveen can trim, not a decision.
- [ ] **Step 2: Compute the estimate** from Task 9's measured per-item costs (never the modeled artifact numbers where a measurement exists):
  - Per course and per model option: `guides = 40 × measured per-guide cost ÷ first-pass yield`, `items gen = 40 LOs × per-LO cost ÷ yield`, `items verify = 240 × per-item verify cost` (× 0.5 if batch), notes = mechanical baseline + 40 × pointer-pass cost (price from Task 5's instrumentation on one real plan if cheap, else model it and label it), mock exams if in scope.
  - Lesson plans: TWO options priced side by side — (a) agent fan-out as in Grade 7 (estimate from the wave runbook's batch counts; label clearly ESTIMATED, since Claude Code usage was never metered), (b) scripted generation via `generate-from-text.ts`-style pipeline (NOT built for seeds today — if priced, label as requiring its own build task in the wave plan).
  - Present 2-3 model stacks: all-Sonnet baseline / Haiku-gen + Sonnet-verify / (if measured) DeepSeek-gen + Sonnet-verify — each with total $ for all 8 courses and the measured yield caveat.
- [ ] **Step 3: Deliver.** Append the estimate as a section in the pilot report AND summarize it to Praveen in chat (per-course and 8-course totals per stack, the plans-authoring option fork, and the recommendation). **Then STOP — per Global Constraints, no generation, no wave plan, no env changes until Praveen picks scope + models.** Update memory ([[tutor-session-handoff]] gets a dated section; a new `project_course_gen_model_routing` memory records the roles/flags/pilot outcome).

## Self-Review (completed 2026-09-02)

- Coverage: user ask 1 (de-hardcode, "scalable like the brain") → Tasks 1-6 (registry roles + env grammar incl. base-URL/key per role; academy env var); instrumentation gap → usage/cost prints in every task; batch lever → Task 8; user ask 2 (estimate before Grades 6/8) → Tasks 7 (makes item generation measurable/scriptable), 9 (measurements), 10 (estimate + HARD STOP). Actual grade generation is explicitly out of scope (Global Constraints) — it gets its own wave plan after approval.
- Placeholders: none — every code step carries real code or an exact locate-and-adapt instruction; Tasks 2/6/8 name the read-first checks where the installed SDK/CLI shapes must come from the live file.
- Type consistency: role names `'content-gen'`/`'content-verify'`/`'notes-pointers'` uniform across Tasks 1-9; `buildVerifyParams`/`parseVerdict` introduced in Task 8 Step 1 and used in Step 2; `--dry-run` produced in Task 2 and consumed in Tasks 7/9; `--out-dir` produced in Task 6 and consumed in Task 9; `lookupModelRate` signature checked against the real file in Task 2 (field-name adaptation instruction included).
