# M1a — Engine Workspace Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the `evelynlearning` repo into npm workspaces — `apps/tutor`, `apps/marketing`, `packages/core` — so a tutor change deploys without rebuilding the marketing site, blog, admin, outreach, prospecting, and showcase.

**Architecture:** A pure structural refactor executed in dependency order (shared code → tutor → marketing), gated after every move by the repo's existing 194 `test:*` scripts plus `next build`. The tutor's `src` subtree and `scripts/` directory move **together as a unit**, which keeps 222 scripts' `../src/...` relative imports valid without edits, and each app keeps `@/*` → its own `./src/*` so the overwhelming majority of import statements never change. Only imports that cross into `packages/core` are rewritten, by codemod.

**Tech Stack:** Next.js 16 (App Router, Turbopack), TypeScript, npm workspaces, Mongoose, pm2, nginx, `tsx` + `ts-node`/`tsconfig-paths` for the test harnesses.

**Spec:** `academy/docs/superpowers/plans/2026-08-14-evelyntutor-platform.md` (decision **D11**; §0 findings 4–5 are the motivation)

## Scope

This plan implements **D11 only** — the workspace split, through to a working two-app
production deploy. The rest of M1 is deliberately **out of scope** and becomes follow-on
plans, because each is an independent subsystem with its own test surface:

| Follow-on | Decision | Depends on this plan because |
|---|---|---|
| M1b — pm2 cluster + 2nd node + health endpoint | D13 | rewrites the deploy scripts this plan creates |
| M1c — Partner registry, enforced studentId namespacing, per-partner rate limits | D15 | needs `apps/tutor` deployable alone to canary |
| M1d — Runtime flag resolver + token-carried overrides + per-brand CNAME | D12 | touches every flag read site in `apps/tutor` |
| M1e — Engine `/admin` console | D18 | `admin/tutor-sessions` lands in `apps/tutor` here (Task 6) |

## Global Constraints

- **Zero user-visible change is the acceptance gate.** Crimsora, evelynlearning.com, and every `/api/portal/v1/**` partner must behave identically before and after. No behavior changes, no refactors of logic, no "while I'm here" cleanups.
- **`git mv` for every file move** — history must survive. Never delete-and-recreate.
- **Node/Next versions unchanged.** Do not upgrade Next, React, or any dependency during this plan.
- **The 194 `test:*` scripts are the regression oracle.** Every task that moves files ends with the full suite green.
- **Preserve `@/*` → `./src/*` semantics per app.** A file that moves from `src/lib/tutor/x.ts` to `apps/tutor/src/lib/tutor/x.ts` keeps the import specifier `@/lib/tutor/x`.
- **The repo-tracked `nginx/evelyn.conf` is NOT the live config.** The live server's `/etc/nginx/sites-available/evelyn.conf` requires a separate manual apply + `nginx -s reload`. Editing the repo file alone changes nothing in production.
- **Production deploy is `./deploy-to-production.sh` ONLY.** `deploy-update.sh` is banned (30-minute server-side build). This plan replaces the single script with two; the ban carries over.
- Existing `next.config.ts` behaviors must be preserved per app: `distDir` env override, Turbopack `root` pin, `experimental.middlewareClientMaxBodySize: '50mb'`, and the `images.remotePatterns` allowlist.

---

## File Structure

### `packages/core/` (new) — shared, tutor-agnostic
Everything both apps need that has **zero** dependency on `src/lib/tutor`.

| Path | From | Responsibility |
|---|---|---|
| `src/db.ts` | `src/lib/db.ts` | Mongoose connection singleton |
| `src/knowledge/` (26 files) | `src/lib/knowledge/` | Knowledge-base helpers |
| `src/utils/api-error-handler.ts` | `src/lib/utils/api-error-handler.ts` | Route error envelope |
| `src/utils/copyscape.ts` | `src/lib/utils/copyscape.ts` | Plagiarism client |
| `src/utils/document-extract.ts` | `src/lib/utils/document-extract.ts` | Document text extraction |
| `src/utils/rate-limit.ts` | `src/lib/utils/rate-limit.ts` | In-memory burst/daily limiter |
| `src/utils/timeAgo.ts` | `src/lib/utils/timeAgo.ts` | Date formatting |
| `src/utils.ts` | `src/lib/utils.ts` | `cn()` / misc helpers |
| `src/models/Teacher.ts` | `src/models/Teacher.ts` | Read by google-auth (marketing) **and** tutor |
| `src/models/SavedLesson.ts` | `src/models/SavedLesson.ts` | Read by showcase (marketing) **and** tutor |

Alias: `@core/*` → `packages/core/src/*`.

> `Teacher` and `SavedLesson` are the only two models both apps read, and both are **type-clean** (verified: zero `@/lib/tutor` imports). The four models that DO import tutor types — `LessonPlan`, `StudentProfile`, `StudentTopicNotes`, `EvidenceEvent` — are tutor-owned and go to `apps/tutor`, which is what keeps `packages/core` free of a dependency cycle.

### `apps/tutor/` (new) — the engine
| Path | From |
|---|---|
| `src/lib/tutor/` (2,807 files) | `src/lib/tutor/` |
| `src/app/tutor/`, `src/app/tutor-portal/` | same |
| `src/app/api/tutor/`, `src/app/api/tutor-portal/`, `src/app/api/portal/` | same |
| `src/app/admin/tutor-sessions/` | same — engine telemetry, per D18 |
| `src/models/` — tutor-owned only (`LessonPlan`, `StudentProfile`, `StudentTopicNotes`, `EvidenceEvent`, `TutorSession`, `ProblemBank`, `MockForm`, `MockAttempt`, `LearnerStateProjection`, `LearnerStateSnapshot`, `CanonicalConcept`, `PracticeGenCounter`, `LessonPlanRailLabels`, `LessonImage`, `EloRating`, `DemoSession`, `DemoInteraction`) | `src/models/` |
| `src/lib/utils/export/{latex-readable,whiteboard-capture,pdf-tutor-session}.ts` | same — the three export files that import tutor |
| `src/hooks/{useTutorSession,useStudentPreferences,useVoice}.ts` | `src/hooks/` |
| `src/data/tutor/` | same |
| `src/middleware.ts` | same — the `tutor.evelynlearning.com` → `/tutor-portal/*` rewrite |
| `scripts/` (379 `.ts` files) | repo root `scripts/` |

### `apps/marketing/` — everything else
Site, blog, admin (minus `tutor-sessions`), outreach, prospecting, showcase, webinars, speakers, interviews, industries, products, solutions, plus the remaining models, `lib/{admin,analytics,auth,chat,crypto,data,email,google,models,outreach,plagiarism,prompts,seo,services}`, `src/config`, `src/types`, and the remaining `lib/utils/export/*` PDF/SCORM writers.

### Root
`package.json` becomes the workspace root: `workspaces: ["apps/*", "packages/*"]`, plus the aggregate `test:all` runner and per-app build/dev scripts.

---

## Task 1: Aggregate test runner + green baseline

The 194 `test:*` scripts are this plan's only regression oracle, but there is **no `npm test`** and no aggregate runner (only `test:portal` and `test:outreach` chain subsets). Nothing else in this plan is safe until one exists and is green.

**Files:**
- Create: `scripts/run-all-tests.mjs`
- Modify: `package.json` (scripts block)
- Create: `docs/superpowers/baselines/2026-08-14-pre-split.txt`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm run test:all` — runs every `test:*` script except the live/network ones, prints `PASS`/`FAIL` per script, exits non-zero if any failed. Every later task calls this.

- [ ] **Step 1: Write the runner**

```js
// scripts/run-all-tests.mjs
// Runs every `test:*` npm script serially and reports a pass/fail table.
// EXCLUDED: scripts that hit live networks/APIs or need a seeded DB — they are
// not hermetic, so they cannot gate a mechanical refactor. Run them by hand.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const EXCLUDE = new Set([
  'test:all',
  'test:portal',            // aggregate of other test:portal-* entries
  'test:outreach',          // aggregate of other test:outreach-* entries
  'test:pedagogy-sim-live', // live LLM calls
  'test:pedagogy-seed',     // writes to a DB
  'test:pedagogy',          // interactive CLI
  'test:pedagogy-driver',   // live smoke
  'test:voice-harness',     // live STT/TTS providers
  // Live Anthropic call — observed failing bare with
  // `[expandPlanLos] stage2 FAILED reason="haiku returned non-JSON"` (35s).
  'test:plan-generate',
  // Parameterized harnesses: these REQUIRE an argument and print usage +
  // exit non-zero when run bare, e.g.
  //   "Usage: npm run test:render-harvest -- <course>  (known: macro, stats, …)"
  // They are tools, not assertions — running them bare measures nothing.
  'test:render-tools',
  'test:render-harvest',
  'test:render-judge',
  'test:tutor-e2e',
  'test:tutor-judge',
]);

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const names = Object.keys(pkg.scripts).filter((n) => n.startsWith('test:') && !EXCLUDE.has(n));

const failed = [];
for (const name of names) {
  process.stdout.write(`${name} ... `);
  try {
    execSync(`npm run --silent ${name}`, { stdio: 'pipe', timeout: 300_000 });
    console.log('PASS');
  } catch (err) {
    console.log('FAIL');
    failed.push({ name, output: String(err.stdout ?? '') + String(err.stderr ?? '') });
  }
}

console.log(`\n${names.length - failed.length}/${names.length} passed`);
for (const f of failed) {
  console.log(`\n=== ${f.name} ===\n${f.output.slice(-2000)}`);
}
process.exit(failed.length ? 1 : 0);
```

- [ ] **Step 2: Register it**

Add to `package.json` scripts:

```json
"test:all": "node scripts/run-all-tests.mjs"
```

- [ ] **Step 3: Run it and record the baseline**

```bash
npm run test:all 2>&1 | tee docs/superpowers/baselines/2026-08-14-pre-split.txt
```

Expected: a pass/fail line per script and a final `N/M passed`.

**This baseline is the contract for the whole plan.** If any script fails *here*, it was already failing before the split — record it in the baseline file and treat that exact set as the allowed-failure list. Do **not** fix pre-existing failures in this plan; that is a behavior change.

**Measured 2026-08-14, before any work started — expect this exact result:**

> **178/181 hermetic scripts pass. Three are red, and they are the allowed-failure list:**
>
> | Script | Result |
> |---|---|
> | `test:verdict-guard` | 1 failure — `non-answer branch → respond normally, no verdict word` |
> | `test:pedagogy-posed-problem` | 8 passed, 1 failed |
> | `test:pedagogy-d1` | 19 passed, 2 failed |
>
> A run that produces **fewer** failures than this is just as much a signal as one that produces more — it means a script stopped executing rather than started passing. Match the set exactly, not the count.
>
> **Note on `test:pedagogy-personas`:** the first baseline run (2026-08-14) measured it red — `ravi: resumeState is within RESUME_MAX_AGE_MS` failing at `age=3743013718ms` (~43 days). That was a **time bomb, not a defect**: `personas.test.ts` asserted freshness against `ravi.json`'s raw authored date (`2026-07-02`), which fell outside the 30-day `RESUME_MAX_AGE_MS` window in early August. The driver was never affected — `run-harness.ts` already re-dated the checkpoint via `refreshFreshCheckpoint()` before use.
>
> **Fixed before this plan begins** (commit: "fix(pedagogy-harness): assert ravi's refreshed checkpoint…"): `refreshFreshCheckpoint` moved to `fixtures/personas/index.ts` beside the type it operates on, the test now applies the driver's own transform, and a rot-proof ordering assertion was added. Now **34 passed, 0 failed**. If you see this script red, it is a **real regression from your changes**, not the old calendar issue.

- [ ] **Step 4: Record the build baseline**

```bash
rm -f tsconfig.tsbuildinfo && rm -rf .next
time npm run build 2>&1 | tail -30 | tee -a docs/superpowers/baselines/2026-08-14-pre-split.txt
```

Expected: build succeeds. Note the wall-clock time — this is the number the split is meant to reduce for tutor-only deploys, so it is the before-measurement.

- [ ] **Step 5: Commit**

```bash
git add scripts/run-all-tests.mjs package.json docs/superpowers/baselines/2026-08-14-pre-split.txt
git commit -m "test: add test:all aggregate runner and capture pre-split baseline"
```

---

## Task 2: Workspace skeleton (no file moves)

Stand up the workspace wiring while all code stays exactly where it is, so a wiring mistake is isolated from a move mistake.

**Files:**
- Create: `packages/core/package.json`, `packages/core/tsconfig.json`, `packages/core/src/.gitkeep`
- Create: `apps/tutor/package.json`, `apps/marketing/package.json` (placeholders)
- Create: `tsconfig.base.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: Task 1's `test:all`.
- Produces: `@evelyn/core` resolvable as a workspace package; `tsconfig.base.json` with `compilerOptions` shared by all three.

- [ ] **Step 1: Create the core package manifest**

```json
// packages/core/package.json
{
  "name": "@evelyn/core",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

- [ ] **Step 2: Extract the shared tsconfig**

Copy the current root `tsconfig.json`'s `compilerOptions` verbatim into `tsconfig.base.json`, **minus** `paths` and `baseUrl` (those become per-app):

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "// NOTE": "Copy every option from the pre-split root tsconfig.json EXCEPT baseUrl and paths — do not retype from memory, do not 'improve' any value.",
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  }
}
```

Then make the root `tsconfig.json` extend it, keeping its own `paths`/`include` untouched:

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Declare the workspaces**

In the root `package.json`, add above `scripts`:

```json
"workspaces": ["apps/*", "packages/*"],
```

- [ ] **Step 4: Install and verify resolution**

```bash
npm install
node -e "console.log(require.resolve('@evelyn/core/package.json'))"
```

Expected: prints a path under `packages/core`. If it prints nothing or throws, the workspaces glob is wrong — fix before continuing.

- [ ] **Step 5: Verify nothing regressed**

```bash
npm run test:all
npm run build
```

Expected: identical to the Task 1 baseline. No code moved, so any difference is a wiring bug.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.base.json tsconfig.json packages/
git commit -m "build: add npm workspaces skeleton and shared tsconfig base"
```

---

## Task 3: Move shared code into `packages/core`

**Files:**
- Move: `src/lib/db.ts` → `packages/core/src/db.ts`
- Move: `src/lib/knowledge/` → `packages/core/src/knowledge/`
- Move: `src/lib/utils/{api-error-handler,copyscape,document-extract,rate-limit,timeAgo}.ts` → `packages/core/src/utils/`
- Move: `src/lib/utils.ts` → `packages/core/src/utils.ts`
- Move: `src/models/{Teacher,SavedLesson}.ts` → `packages/core/src/models/`
- Modify: `tsconfig.json` (add `@core/*`), `next.config.ts` (transpile the package)
- Modify: 233 import sites (codemod)

**Interfaces:**
- Consumes: `@evelyn/core` from Task 2.
- Produces: alias `@core/*` → `packages/core/src/*`. Import specifiers become `@core/db`, `@core/knowledge/...`, `@core/utils/rate-limit`, `@core/utils`, `@core/models/Teacher`, `@core/models/SavedLesson`. Every later task uses these specifiers.

- [ ] **Step 1: Move the files with history preserved**

```bash
mkdir -p packages/core/src/utils packages/core/src/models
git mv src/lib/db.ts             packages/core/src/db.ts
git mv src/lib/knowledge         packages/core/src/knowledge
git mv src/lib/utils.ts          packages/core/src/utils.ts
for f in api-error-handler copyscape document-extract rate-limit timeAgo; do
  git mv "src/lib/utils/$f.ts" "packages/core/src/utils/$f.ts"
done
git mv src/models/Teacher.ts     packages/core/src/models/Teacher.ts
git mv src/models/SavedLesson.ts packages/core/src/models/SavedLesson.ts
```

- [ ] **Step 2: Add the alias and transpile the package**

`tsconfig.json` paths:

```json
"paths": {
  "@/*": ["./src/*"],
  "@core/*": ["./packages/core/src/*"]
}
```

`next.config.ts` — Next must compile TS from a workspace package:

```ts
transpilePackages: ['@evelyn/core'],
```

- [ ] **Step 3: Codemod the import sites**

`@/lib/utils` and `@/lib/utils/export/...` both exist, so **order matters**: rewrite the longer, more specific `export/` paths is NOT needed (they stay in the app), but the bare `@/lib/utils` must not swallow them. Anchor on the closing quote:

```bash
# db (130 files), knowledge (27), utils.ts (76), and the 5 moved utils modules.
grep -rlZ "@/lib/db'" src scripts --include="*.ts" --include="*.tsx" | xargs -0 sed -i '' "s|@/lib/db'|@core/db'|g"
grep -rlZ "@/lib/knowledge" src scripts --include="*.ts" --include="*.tsx" | xargs -0 sed -i '' "s|@/lib/knowledge|@core/knowledge|g"
grep -rlZ "@/lib/utils'" src scripts --include="*.ts" --include="*.tsx" | xargs -0 sed -i '' "s|@/lib/utils'|@core/utils'|g"
for f in api-error-handler copyscape document-extract rate-limit timeAgo; do
  grep -rlZ "@/lib/utils/$f" src scripts --include="*.ts" --include="*.tsx" | xargs -0 sed -i '' "s|@/lib/utils/$f|@core/utils/$f|g"
done
grep -rlZ "@/models/Teacher" src scripts --include="*.ts" --include="*.tsx" | xargs -0 sed -i '' "s|@/models/Teacher|@core/models/Teacher|g"
grep -rlZ "@/models/SavedLesson" src scripts --include="*.ts" --include="*.tsx" | xargs -0 sed -i '' "s|@/models/SavedLesson|@core/models/SavedLesson|g"
```

- [ ] **Step 4: Prove no stale specifiers remain**

```bash
grep -rn "@/lib/db'\|@/lib/knowledge\|@/lib/utils'\|@/lib/utils/rate-limit\|@/models/Teacher\|@/models/SavedLesson" src scripts --include="*.ts" --include="*.tsx"
```

Expected: **no output.** Any hit is a missed rewrite — fix it before typechecking.

- [ ] **Step 5: Typecheck**

```bash
rm -f tsconfig.tsbuildinfo
npx tsc -p tsconfig.json --noEmit
```

Expected: zero errors. This is the real gate — it catches every import the codemod missed, including relative imports inside the moved files themselves (e.g. `knowledge/*` files importing `../db`, which is now a sibling and still resolves; and `../../models/Teacher`, which does not — fix those to `@core/models/Teacher`).

- [ ] **Step 6: Run the suite and build**

```bash
npm run test:all
npm run build
```

Expected: matches the Task 1 baseline exactly.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: move db, knowledge, shared utils, and Teacher/SavedLesson models to @evelyn/core"
```

---

## Task 4: Sever `apps/marketing` → tutor couplings

Five couplings must be cut before the tutor tree can move out; otherwise the marketing app breaks the moment its imports point at a different workspace. Measured list — there are no others.

**Files:**
- Modify: `src/components/demos/VoiceTutorLiveDemo.tsx`
- Modify: `src/app/showcase/nahq/page.tsx`, `src/app/showcase/lesson-engine/page.tsx`
- Test: `scripts/test-curated-demo-lessons.ts` (existing), `scripts/test-solutions-demo-lessons.ts` (existing)

**Interfaces:**
- Consumes: nothing new.
- Produces: a marketing tree with **zero** `@/lib/tutor` or `@/app/tutor` imports, except the video-curator surface, which Task 6 severs by relocation. Task 6 Step 8 asserts the final invariant.

> **Not severed here — relocated in Task 6:** the video curator. `src/lib/admin/video-curator/ap-macro-topics.ts` reads the entire `SEED_PLANS` array from `@/lib/tutor/lesson-plan/store` at runtime to derive AP Macro CED topics; it is *not* a static list, so it cannot be inlined or snapshotted without going stale against 1,718 seeds. It is content tooling over lesson plans — engine admin, per D18 — and `video-curator` is the **only** subdirectory of `src/lib/admin`, so the whole 12-file surface (`app/admin/video-curator` 1, `lib/admin/video-curator` 6, `app/api/admin/video-curator` 5) moves cleanly to `apps/tutor` in Task 6 Step 2.

- [ ] **Step 1: Verify the coupling list is still exactly three**

```bash
grep -rl "@/lib/tutor\|@/app/tutor\|@/hooks/useTutorSession\|@/hooks/useStudentPreferences" src \
  --include="*.ts" --include="*.tsx" \
  | grep -vE "^src/(lib/tutor|app/tutor|app/api/tutor|app/api/portal|app/tutor-portal|app/admin/tutor-sessions|app/admin/video-curator|app/api/admin/video-curator|lib/admin/video-curator|models|hooks|lib/utils/export)"
```

Expected exactly:
```
src/components/demos/VoiceTutorLiveDemo.tsx
src/app/showcase/nahq/page.tsx
src/app/showcase/lesson-engine/page.tsx
```

If the list differs, **stop** — the codebase moved since this plan was written. Re-derive the list and extend this task before proceeding.

- [ ] **Step 2: Convert `VoiceTutorLiveDemo` to an iframe**

This component currently mounts the tutor in-process and calls `accentFromTimezone`. Replace with the same iframe pattern Crimsora already uses in production — mint a demo token server-side, render an iframe of `/tutor-portal/embed`.

```tsx
'use client';
import { useEffect, useState } from 'react';

/** Marketing live demo. Post-split this app no longer links the tutor in
 *  process — it embeds it exactly as every external partner does, via a
 *  token-gated iframe of /tutor-portal/embed. The geo-accent pre-select that
 *  used to run here now happens server-side when the token is minted (the
 *  embed route reads the persona voice off the token, not from
 *  resolveCartesiaVoice — see tutor-portal/embed/page.tsx). */
export default function VoiceTutorLiveDemo({ topic }: { topic?: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch('/api/tutor-portal/demo-token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ topic, timezone: tz }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { embedUrl: string }) => setSrc(d.embedUrl))
      .catch(() => setSrc(null));
  }, [topic]);

  if (!src) return <div className="h-[640px] animate-pulse rounded-lg bg-slate-100" />;
  return (
    <iframe
      src={src}
      title="Evelyn live tutor demo"
      className="h-[640px] w-full rounded-lg border-0"
      allow="microphone; autoplay"
    />
  );
}
```

> `POST /api/tutor-portal/demo-token` already exists (`src/app/api/tutor-portal/demo-token/route.ts`) and moves to `apps/tutor` in Task 6. Pass `timezone` so the token minter can apply `accentFromTimezone` server-side; if the route does not yet accept `timezone`, add it as an **optional** field that defaults to current behavior when absent — that keeps the change additive.

- [ ] **Step 3: Convert the two showcase pages**

`showcase/nahq/page.tsx` and `showcase/lesson-engine/page.tsx` use `useTutorSession` / `useStudentPreferences`. Replace each tutor-session surface with the same `<VoiceTutorLiveDemo />` iframe from Step 2, deleting the hook imports. These are marketing showcase pages, not the product — an iframe is the correct fidelity.

- [ ] **Step 4: Verify severance**

Re-run the Step 1 grep. Expected: **no output.**

- [ ] **Step 5: Run the suite and build**

```bash
npm run test:all
npm run build
```

Expected: baseline. `test:curated-demo` and `test:solutions-demo` specifically exercise the demo-lesson surfaces — confirm both still pass.

- [ ] **Step 6: Manual smoke — the demo actually renders**

```bash
npm run dev
```

Visit `http://localhost:3006/products/adaptive-learning` (or whichever page renders `VoiceTutorLiveDemo`), plus `/showcase/nahq` and `/showcase/lesson-engine`. Expected: the iframe loads and the tutor mounts inside it. A blank iframe means the demo-token route rejected the request — check its response in the network tab before continuing.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: sever marketing->tutor couplings; live demo and showcase now iframe the embed"
```

---

## Task 5: Create `apps/marketing` (move the remaining app in place)

Move the current app wholesale into `apps/marketing`, *including* the tutor tree — which then moves out in Task 6. Doing it in this order means only one large `git mv` of the app shell, and the tutor tree is extracted from a known-good workspace app rather than into a bare directory.

**Files:**
- Move: `src/`, `public/`, `next.config.ts`, `next-sitemap.config.js`, `postcss.config.mjs`, `tailwind.config.ts`, `next-env.d.ts`, `tsconfig.json` → `apps/marketing/`
- Create: `apps/marketing/package.json`
- Modify: root `package.json`

**Interfaces:**
- Consumes: `@core/*` from Task 3.
- Produces: `npm run --workspace @evelyn/marketing build` builds the whole site. Root `npm run build:marketing` proxies it.

- [ ] **Step 1: Move the app shell**

```bash
mkdir -p apps/marketing
for p in src public next.config.ts next-sitemap.config.js postcss.config.mjs \
         tailwind.config.ts next-env.d.ts tsconfig.json; do
  git mv "$p" "apps/marketing/$p"
done
```

`scripts/` stays at the root for now — Task 6 moves it to `apps/tutor`.

- [ ] **Step 2: Create the app manifest**

```json
// apps/marketing/package.json
{
  "name": "@evelyn/marketing",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 3006",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

Dependencies stay hoisted at the workspace root — do **not** split the 55 deps / 21 devDeps between apps in this plan. Splitting them is a separate, independently verifiable change and would confound this task's gate.

- [ ] **Step 3: Fix the paths that assumed a repo-root app**

`apps/marketing/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["../../packages/core/src/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`apps/marketing/next.config.ts` — the Turbopack root pin now points at the app, not the repo. Leave `distDir`, `experimental.middlewareClientMaxBodySize`, `images.remotePatterns`, and the `redirects()` block **byte-identical**:

```ts
turbopack: {
  root: path.join(__dirname),
},
```

- [ ] **Step 4: Wire the root scripts**

In the root `package.json`, replace `dev`/`build`/`start`/`lint` with workspace proxies. **Keep every `test:*` and `lint:*` script exactly as-is** — they still reference `scripts/` and `src/`, which Task 6 relocates.

```json
"dev:marketing": "npm run --workspace @evelyn/marketing dev",
"build:marketing": "npm run --workspace @evelyn/marketing build",
"start:marketing": "npm run --workspace @evelyn/marketing start"
```

- [ ] **Step 5: Point the 194 test scripts at the moved source**

Every `test:*` script resolves either `../src/...` relatively from `scripts/` (222 files) or `@/*` via `tsconfig-paths` (35 ts-node scripts). Both now break. Fix by making the **root** tsconfig's alias point into the moved app, and by running the harnesses from the app directory:

Root `tsconfig.json`:

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./apps/marketing/src/*"],
      "@core/*": ["./packages/core/src/*"]
    }
  },
  "include": ["scripts/**/*.ts"]
}
```

Then repoint the relative imports:

```bash
grep -rlZ "from '\.\./src/" scripts --include="*.ts" | xargs -0 sed -i '' "s|from '\.\./src/|from '../apps/marketing/src/|g"
grep -rlZ "from '\.\./\.\./src/" scripts --include="*.ts" | xargs -0 sed -i '' "s|from '\.\./\.\./src/|from '../../apps/marketing/src/|g"
```

> This rewrite is **deliberately temporary** — Task 6 moves `scripts/` next to the tutor's `src/` and reverts it. It exists so this task has a green gate of its own rather than deferring all verification to Task 6.

- [ ] **Step 6: Verify**

```bash
npm install
npm run test:all
npm run build:marketing
```

Expected: `test:all` matches the Task 1 baseline; the build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: move the Next app into apps/marketing workspace"
```

---

## Task 6: Extract `apps/tutor`

The big move. `src` subtree and `scripts/` move **together**, which is what lets the 222 relative-import scripts revert to their original specifiers.

**Files:**
- Move: the tutor tree out of `apps/marketing/src/` into `apps/tutor/src/`
- Move: `scripts/` → `apps/tutor/scripts/`
- Create: `apps/tutor/package.json`, `apps/tutor/tsconfig.json`, `apps/tutor/next.config.ts`, `apps/tutor/postcss.config.mjs`, `apps/tutor/tailwind.config.ts`, `apps/tutor/next-env.d.ts`, `apps/tutor/app/layout.tsx` shim if needed
- Modify: root `package.json`

**Interfaces:**
- Consumes: `@core/*`; a severed marketing tree (Task 4).
- Produces: `npm run --workspace @evelyn/tutor build`; `npm run test:all` runs from `apps/tutor`. `apps/tutor` serves `/tutor`, `/tutor-portal/*`, `/api/tutor/*`, `/api/tutor-portal/*`, `/api/portal/v1/*`, `/admin/tutor-sessions`.

- [ ] **Step 1: Create the app skeleton**

```json
// apps/tutor/package.json
{
  "name": "@evelyn/tutor",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 3007",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

Copy `postcss.config.mjs`, `tailwind.config.ts`, and `next-env.d.ts` from `apps/marketing` (copy, not move — marketing still needs them). In `apps/tutor/tailwind.config.ts`, repoint `content` globs at `./src/**/*.{ts,tsx}`.

- [ ] **Step 2: Move the tutor tree**

```bash
cd apps/tutor && mkdir -p src/app/api src/app/admin src/lib/utils src/models src/hooks src/data && cd ../..
M=apps/marketing/src
T=apps/tutor/src

git mv $M/lib/tutor              $T/lib/tutor
git mv $M/app/tutor              $T/app/tutor
git mv $M/app/tutor-portal       $T/app/tutor-portal
git mv $M/app/api/tutor          $T/app/api/tutor
git mv $M/app/api/tutor-portal   $T/app/api/tutor-portal
git mv $M/app/api/portal         $T/app/api/portal
git mv $M/app/admin/tutor-sessions $T/app/admin/tutor-sessions
git mv $M/data/tutor             $T/data/tutor
git mv $M/middleware.ts          $T/middleware.ts

# Video curator — engine content tooling over SEED_PLANS (see Task 4's note).
# `video-curator` is the only subdirectory of lib/admin, so lib/admin goes whole.
mkdir -p $T/lib/admin
git mv $M/app/admin/video-curator     $T/app/admin/video-curator
git mv $M/lib/admin/video-curator     $T/lib/admin/video-curator
git mv $M/app/api/admin/video-curator $T/app/api/admin/video-curator

for f in latex-readable whiteboard-capture pdf-tutor-session; do
  mkdir -p $T/lib/utils/export && git mv "$M/lib/utils/export/$f.ts" "$T/lib/utils/export/$f.ts"
done

for h in useTutorSession useStudentPreferences useVoice; do
  git mv "$M/hooks/$h.ts" "$T/hooks/$h.ts"
done

for m in LessonPlan StudentProfile StudentTopicNotes EvidenceEvent TutorSession \
         ProblemBank MockForm MockAttempt LearnerStateProjection LearnerStateSnapshot \
         CanonicalConcept PracticeGenCounter LessonPlanRailLabels LessonImage \
         EloRating DemoSession DemoInteraction; do
  git mv "$M/models/$m.ts" "$T/models/$m.ts"
done

git mv scripts apps/tutor/scripts
```

- [ ] **Step 3: Revert the temporary script-import rewrite**

`scripts/` now sits beside `apps/tutor/src/` exactly as it sat beside the old root `src/`, so the original relative specifiers are correct again:

```bash
cd apps/tutor
grep -rlZ "from '\.\./apps/marketing/src/" scripts --include="*.ts" | xargs -0 sed -i '' "s|from '\.\./apps/marketing/src/|from '../src/|g"
grep -rlZ "from '\.\./\.\./apps/marketing/src/" scripts --include="*.ts" | xargs -0 sed -i '' "s|from '\.\./\.\./apps/marketing/src/|from '../../src/|g"
cd ../..
```

- [ ] **Step 4: Write the tutor tsconfig and next.config**

```json
// apps/tutor/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["../../packages/core/src/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`apps/tutor/next.config.ts` — carry over **only** the settings the tutor actually needs, preserving their exact values:

```ts
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  turbopack: { root: path.join(__dirname) },
  transpilePackages: ['@evelyn/core'],
  // 50mb, NOT the 10mb default: /api/tutor/session-audio flushes exceeded 10MB
  // (2026-04-24 "Unterminated JSON at position 10436608" = exactly the cutoff).
  experimental: { middlewareClientMaxBodySize: '50mb' },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.evelynlearning.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh7-us.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
```

The marketing `redirects()` block does **not** come along — those are marketing URLs. Verify none of them target `/tutor*` before dropping them:

```bash
grep -n "tutor" apps/marketing/next.config.ts
```

Expected: no redirect source or destination under `/tutor`. If there is one, move that entry into `apps/tutor/next.config.ts`.

- [ ] **Step 5: Give the tutor app a root layout**

Next requires `src/app/layout.tsx`. The old root layout lives in `apps/marketing/src/app/layout.tsx` and carries marketing chrome (nav, footer, analytics). Create a minimal one for the tutor — the tutor's surfaces are full-bleed and iframe-embedded, so marketing chrome must NOT be inherited:

```tsx
// apps/tutor/src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Evelyn Tutor' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Copy `apps/marketing/src/app/globals.css` to `apps/tutor/src/app/globals.css` (copy, not move).

- [ ] **Step 6: Point the test scripts at the tutor app**

Move every `test:*` and tutor `lint:*` script from the root `package.json` into `apps/tutor/package.json` **verbatim**, and move `scripts/run-all-tests.mjs` with them. In the root, add proxies:

```json
"test:all": "npm run --workspace @evelyn/tutor test:all",
"test:outreach": "npm run --workspace @evelyn/marketing test:outreach"
```

The outreach tests (`test:outreach-*`) reference `src/lib/outreach/**` and `src/models/{Lead,ResearchJob}.ts`, which stayed in marketing — move those script entries to `apps/marketing/package.json` instead, and add `EXCLUDE` handling so the tutor's `run-all-tests.mjs` no longer sees them.

- [ ] **Step 7: Typecheck both apps**

```bash
rm -f apps/*/tsconfig.tsbuildinfo
npx tsc -p apps/tutor/tsconfig.json --noEmit
npx tsc -p apps/marketing/tsconfig.json --noEmit
```

Expected: zero errors in both. Errors in `apps/marketing` referencing `@/lib/tutor` mean Task 4 missed a coupling — go back and sever it rather than re-adding a dependency.

- [ ] **Step 8: Assert the boundary holds**

```bash
grep -rn "@/lib/tutor\|@/app/tutor" apps/marketing/src --include="*.ts" --include="*.tsx"
grep -rn "apps/marketing" apps/tutor/src apps/tutor/scripts --include="*.ts" --include="*.tsx"
```

Expected: **no output from either.** These two greps are the structural invariant this whole plan exists to create — add them to CI later.

- [ ] **Step 9: Run the full suite and both builds**

```bash
npm run test:all
npm run --workspace @evelyn/marketing test:outreach
time npm run --workspace @evelyn/tutor build
time npm run --workspace @evelyn/marketing build
```

Expected: `test:all` matches the Task 1 baseline exactly. Record both build times — **the tutor build time versus the Task 1 baseline is this plan's headline result.**

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "refactor: extract apps/tutor workspace from apps/marketing"
```

---

## Task 7: Two deploy scripts, two pm2 processes, nginx split

**Files:**
- Create: `deploy-tutor.sh`, `deploy-marketing.sh`
- Delete: `deploy-to-production.sh` (after both replacements are proven)
- Modify: `nginx/evelyn.conf`

**Interfaces:**
- Consumes: two buildable apps from Task 6.
- Produces: pm2 processes `evelyn-tutor` (port **3007**) and `evelyn-marketing` (port **3001**, keeping the existing port so nothing else has to change); nginx upstream `evelyn_tutor_upstream` fronting the tutor locations.

- [ ] **Step 1: Split the nginx config**

Add a second upstream and repoint the three tutor locations. `evelyn_upstream` keeps port 3001 for everything else, so `location /` is untouched.

```nginx
upstream evelyn_upstream {
    server 127.0.0.1:3001;
    keepalive 64;
}

upstream evelyn_tutor_upstream {
    server 127.0.0.1:3007;
    keepalive 64;
}
```

Then change `proxy_pass http://evelyn_upstream;` → `proxy_pass http://evelyn_tutor_upstream;` in exactly these three blocks, leaving every `add_header`, timeout, and `client_max_body_size` line untouched:

- `location = /tutor-portal/replay`
- `location = /tutor-portal/embed`
- `location /api/portal/v1/` (keeps its `client_max_body_size 46m;`)

And add blocks routing the remaining tutor surfaces. These carry the same directives as the existing `location /` block — including the `Upgrade`/`Connection` pair, which the tutor's WebSocket paths require:

```nginx
    location /tutor/ {
        proxy_pass http://evelyn_tutor_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    location /tutor-portal/ {
        proxy_pass http://evelyn_tutor_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    location /api/tutor/ {
        # /api/tutor/session-audio posts PCM16 chunks; the server block's
        # global 16m is what that limit was originally raised for. Keep it.
        proxy_pass http://evelyn_tutor_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    location /api/tutor-portal/ {
        proxy_pass http://evelyn_tutor_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
```

> **Ordering matters.** nginx matches exact (`=`) locations first, then the longest prefix. The two existing `location = /tutor-portal/{embed,replay}` blocks keep their per-route CSP `frame-ancestors` headers and still win over the new `location /tutor-portal/` prefix block — but only because they are exact matches. Do not convert them to prefix blocks.
>
> **`/admin/video-curator` moved to the tutor app** (Task 6) and is not routed here — it will 404 until M1e stands up the engine admin console. That is expected and acceptable: it is an internal curation tool with a single operator. If it is needed sooner, add a `location /admin/video-curator/` block pointing at `evelyn_tutor_upstream` **plus** an auth gate — the current `/admin` tree has no middleware gate, so an unguarded block would expose it publicly.

> **The repo-tracked `nginx/evelyn.conf` is not live.** Applying it to `/etc/nginx/sites-available/evelyn.conf` + `nginx -t && nginx -s reload` is Step 5, on the server.

- [ ] **Step 2: Write `deploy-tutor.sh`**

`deploy-to-production.sh` is 319 lines of local-build → zip → upload → unzip → `npm ci --omit=dev` → pm2, and nearly every comment in it documents a real past incident. **Copy it, then make the substitutions below — do not rewrite it from scratch, and do not delete a comment you don't understand.**

```bash
cp deploy-to-production.sh deploy-tutor.sh
cp deploy-to-production.sh deploy-marketing.sh
```

In `deploy-tutor.sh`, change exactly these:

| Line (approx) | From | To |
|---|---|---|
| 17 | `REMOTE_DIR="/root/evelynlearning"` | `REMOTE_DIR="/root/evelyn-tutor"` |
| 18 | `ZIP_FILE="evelyn-website.zip"` | `ZIP_FILE="evelyn-tutor.zip"` |
| 126 | `rm -f tsconfig.tsbuildinfo` | `rm -f apps/tutor/tsconfig.tsbuildinfo` |
| 128 | `npm run build` | `npm run --workspace @evelyn/tutor build` |
| 298 | `pm2 delete evelyn-website` | `pm2 delete evelyn-tutor` |
| 299 | `pm2 start node_modules/.bin/next --name evelyn-website -- start -p 3001` | `pm2 start node_modules/.bin/next --name evelyn-tutor -- start -p 3007 --dir apps/tutor` |

Then update every path that assumed the app was at the repo root — the three manifest builders (`.deploy-public-manifest`, `.deploy-static-manifest`, `.deploy-server-chunks-manifest`) and the zip's file list all reference `.next/` and `public/`, which are now `apps/tutor/.next/` and `apps/tutor/public/`. Work through the script top to bottom and prefix each.

> **Do not change `npm ci --omit=dev` (line 297) casually.** `--omit=dev` has bitten this stack before: a native dependency sitting in `devDependencies` gets no binary on prod and fails silently at runtime. Because deps stay hoisted at the workspace root in this plan, `npm ci --omit=dev` still installs the union of both apps' dependencies — correct, just not minimal. Slimming it is the deferred "dependency splitting" follow-up.

- [ ] **Step 3: Write `deploy-marketing.sh`**

Same substitutions in `deploy-marketing.sh`, with:

| Line (approx) | To |
|---|---|
| 17 | `REMOTE_DIR="/root/evelyn-marketing"` |
| 18 | `ZIP_FILE="evelyn-marketing.zip"` |
| 126 | `rm -f apps/marketing/tsconfig.tsbuildinfo` |
| 128 | `npm run --workspace @evelyn/marketing build` |
| 298–299 | `pm2 delete evelyn-marketing` / `pm2 start node_modules/.bin/next --name evelyn-marketing -- start -p 3001 --dir apps/marketing` |

Marketing keeps port **3001** so `upstream evelyn_upstream` and every non-tutor nginx location need no change at all.

- [ ] **Step 4: Dry-run both builds locally**

```bash
bash -n deploy-tutor.sh && bash -n deploy-marketing.sh
npm run --workspace @evelyn/tutor build
npm run --workspace @evelyn/marketing build
```

Expected: both scripts parse; both builds succeed.

- [ ] **Step 5: Cut over on the server, tutor first**

This is the runbook, in order. `S=root@84.247.185.169` throughout. Nothing below has been
performed. Two ordering constraints drive the whole sequence, and neither is optional:

- The old `evelyn-website` process holds port **3001**, which is exactly the port
  `evelyn-marketing` will claim. Deploying marketing before retiring `evelyn-website`
  produces an `EADDRINUSE` crash loop.
- The tutor must be verified on :3007 **before** marketing is touched, because until
  `evelyn-website` is deleted the rollback is a single `nginx -s reload` with zero downtime.

**Phase 0 — preparation. No traffic impact; do it ahead of the window.**

```bash
# 0.1  Nothing may already hold :3007.
ssh $S 'ss -lntp | grep -w 3007 || echo "3007 free"'          # expect: 3007 free
ssh $S 'pm2 list'                                              # expect: evelyn-website only

# 0.2  Deploy-machine prerequisites. RUN THESE IN THE CHECKOUT YOU WILL DEPLOY FROM.
#      NOTE: the m1a worktree does NOT have .env.local.production. Deploying from it
#      aborts at the Step 0 preflight — by design, but know it before the window.
ls -l .env.local.production                                    # expect: present, non-empty
ls -l apps/tutor/public/ketcher/                               # expect: bundle.js ~26M,
                                                               #         bundle.css ~183K,
                                                               #         index.html ~1.2K
# If the bundles are absent, seed them from the pre-split path (they are gitignored,
# were left behind by Task 6's `git mv`, and CANNOT be rebuilt — see the prerequisite
# block at the top of deploy-tutor.sh). Do NOT copy index.html; the tracked one is
# authoritative:
#   mkdir -p apps/tutor/public/ketcher
#   cp -n public/ketcher/bundle.js  apps/tutor/public/ketcher/
#   cp -n public/ketcher/bundle.css apps/tutor/public/ketcher/

# 0.3  Seed marketing's public/ so production never serves a tree missing 200+ MB of
#      user uploads and the GSC verification HTML. mkdir -p first: the deploy is what
#      normally creates that tree, and `cp -a src/. dst/` creates only the last component.
ssh $S 'mkdir -p /root/evelyn-marketing/apps/marketing/public && \
        cp -an /root/evelynlearning/public/. /root/evelyn-marketing/apps/marketing/public/ && \
        find /root/evelyn-marketing/apps/marketing/public -type f | wc -l'
# Prune-safe: files in no manifest are never deleted.

# 0.4  Capture the runtime-written curation file BEFORE /root/evelynlearning is retired.
#      `unzip -o` overwrites it every deploy, so prod-side approvals are transient.
ssh $S 'cat /root/evelynlearning/src/data/curated-videos-ap.json' > /tmp/prod-curated.json
diff /tmp/prod-curated.json apps/tutor/src/data/curated-videos-ap.json || true
# Commit anything production has that the repo does not.
```

**Phase 1 — deploy the tutor to its NEW port. Zero tutor downtime: nothing routes to
:3007 yet and `evelyn-website` keeps serving 100% of traffic on :3001 throughout.**

```bash
./deploy-tutor.sh
ssh $S 'pm2 list | grep evelyn-tutor'                                          # expect: online
ssh $S 'curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3007/tutor'  # expect: 200
```

**Phase 2 — nginx. NEVER blind-`scp` this file.**

The repo conf is **not** the live conf and the live one has provably drifted: production
answers `/short-interviews` with **308**, which is Next's `permanent: true` — an nginx
`return 301` cannot produce it, so the four WordPress redirect blocks that used to sit in
the repo file were never in the running config. (They have since been deleted from the repo
file: all four are handled by `apps/marketing/next.config.ts` `redirects()`, and
`location /webinar`, being a *prefix*, would additionally have turned `/webinars` — a live
200 — into an infinite redirect loop.) Capture, diff, merge:

```bash
# 2.1  Capture and diff. Reconcile every difference by hand; do not overwrite.
ssh $S 'cat /etc/nginx/sites-available/evelyn.conf' > /tmp/live-evelyn.conf
ssh $S 'ls -l /etc/nginx/sites-enabled/'          # any sibling files are part of the picture
diff -u /tmp/live-evelyn.conf nginx/evelyn.conf   # merge into a single intended file
```

**2.2 — `tutor.evelynlearning.com` must move to `evelyn_tutor_upstream` in this same edit
and this same reload.** `https://tutor.evelynlearning.com/` is live and returns 200 today,
and the repo conf has **no** server block for it — so it is either drift inside the live
file or a sibling in `sites-enabled`. After cutover :3001 is marketing, which has no
`middleware.ts` and no `/tutor-portal` routes, so if that block is missed the white-label
host goes completely dark. (`tutor-sandbox.evelynlearning.com` does **not** resolve in DNS —
ignore it.)

```bash
# 2.3  Upload the MERGED file, syntax-check it, then reload.
#      This is the first time nginx -t has ever run against this config: there is no
#      nginx and no container runtime on the dev machine, so it could not be checked
#      locally. Do not skip it.
scp /tmp/merged-evelyn.conf $S:/etc/nginx/sites-available/evelyn.conf
ssh $S 'nginx -t && nginx -s reload'
```

**VERIFY THE TUTOR NOW, BEFORE TOUCHING MARKETING.** Run the whole of Step 6 except the
marketing-only rows. If anything is wrong, roll back by reverting nginx alone —
`evelyn-website` is still up and still serves `/tutor`, so the revert is one
`nginx -s reload` with zero downtime.

**Phase 3 — marketing. Only once the tutor is confirmed good.**

Build FIRST, then swap. The outage window is bounded by what sits between `pm2 delete` and
the new process binding :3001, so everything that can fail beforehand should fail beforehand:

```bash
# 3.1  Build marketing locally and confirm exit 0 BEFORE freeing the port.
#      (deploy-marketing.sh does its own build at its Step 1; doing it here first means a
#      build failure costs nothing instead of stranding www.evelynlearning.com with no
#      process.)
npm run build:marketing; echo "exit: $?"                       # expect: 0

# 3.2  These two must be adjacent — :3001 is unserved between them.
ssh $S 'pm2 delete evelyn-website && pm2 save'
./deploy-marketing.sh

ssh $S 'pm2 list | grep evelyn-marketing'                                  # expect: online
ssh $S 'curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3001/'   # expect: 200
```

**ROLLBACK for marketing**, if `deploy-marketing.sh` fails after the port is freed. Keep
`/root/evelynlearning` in place until BOTH apps are verified — it is the rollback source and
also the source for 0.3 and the ketcher bundles:

```bash
ssh $S 'cd /root/evelynlearning && pm2 start node_modules/.bin/next --name evelyn-website -- start -p 3001 && pm2 save'
```

> Marketing takes a short outage between 3.2's two commands — with the build already done,
> it is the upload + unzip + `npm ci` window. The tutor sees **zero** downtime, which is the
> one that matters: Crimsora sessions are live traffic. If even the marketing gap is
> unacceptable, start `evelyn-marketing` on a spare port first, flip `evelyn_upstream` to
> it, then retire `evelyn-website`.

- [ ] **Step 6: Production smoke — every surface, both brands**

```bash
for u in https://www.evelynlearning.com/ \
         https://www.evelynlearning.com/blog \
         https://www.evelynlearning.com/webinars \
         https://www.evelynlearning.com/tutor \
         https://www.evelynlearning.com/tutor-portal/embed \
         https://www.evelynlearning.com/ketcher/index.html \
         https://www.evelynlearning.com/admin/demos \
         https://tutor.evelynlearning.com/ \
         https://www.crimsora.com/ ; do
  echo -n "$u "; curl -sS -o /dev/null -w "%{http_code}\n" "$u"
done
```

Expected: `200` on every marketing URL and on `/webinars` (a redirect loop there means an
nginx WordPress-redirect block came back); `/ketcher/index.html` 200; `/admin/demos` reaches
the tutor and renders its own auth gate rather than 404; `tutor.evelynlearning.com` 200 (the
2.2 check, live); the embed returns its normal token-gated response — compare against a
pre-split capture, do not assume.

**The JavaScript check, which nothing else covers.** `nginx -t` cannot validate the
`/_next/static/` fallback, and a tutor page that serves HTML with zero JS still returns 200 —
so a plain status check cannot tell a working tutor from a broken one:

```bash
# Pull a real chunk URL out of the served HTML and fetch it back through nginx.
CHUNK=$(curl -s https://www.evelynlearning.com/tutor \
        | grep -o '/_next/static/chunks/[^"]*\.js' | head -1)
echo "$CHUNK"
curl -sS -o /dev/null -w "%{http_code}\n" "https://www.evelynlearning.com$CHUNK"  # expect: 200
```

A 404 here means the marketing-first / tutor-fallback pair is not working and every tutor
page is loading no JavaScript at all.

```bash
# Cross-process calls that no build or test can catch:
curl -sS -o /dev/null -w "%{http_code}\n" -X POST \
     https://www.evelynlearning.com/api/tutor-portal/demo-token     # expect: NOT 404
```

Then the real gate: **run one live tutor session end to end from the Crimsora student
dashboard** — voice in, whiteboard render, session ends, transcript and mastery land — and
make one of the problems a **chemistry** one, so the ketcher iframe is exercised. Nothing
about a green test suite proves the WebSocket path survived an nginx change.

- [ ] **Step 7: Remove the old deploy script**

```bash
git rm deploy-to-production.sh
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "build: split deploy into deploy-tutor.sh and deploy-marketing.sh; nginx routes tutor to :3007"
```

---

## Task 8: Guard the boundary in CI, and update the docs

Without an automated check, the two greps from Task 6 Step 8 rot within weeks.

**Files:**
- Create: `scripts/check-workspace-boundaries.mjs` (repo root)
- Modify: root `package.json`, `README.md`, `CLAUDE.md` (if present)

**Interfaces:**
- Consumes: the split layout.
- Produces: `npm run check:boundaries`, exit-non-zero on violation.

- [ ] **Step 1: Write the check**

```js
// scripts/check-workspace-boundaries.mjs
// Structural invariants created by the M1a workspace split. A violation here
// means someone re-coupled the marketing site to the tutor engine (which
// re-couples their deploys), or made the engine depend on marketing.
import { execSync } from 'node:child_process';

const RULES = [
  { name: 'marketing must not import tutor',
    cmd: `grep -rn "@/lib/tutor\\|@/app/tutor" apps/marketing/src --include=*.ts --include=*.tsx || true` },
  { name: 'tutor must not reference apps/marketing',
    cmd: `grep -rn "apps/marketing" apps/tutor/src apps/tutor/scripts --include=*.ts --include=*.tsx || true` },
  { name: 'core must not import tutor',
    cmd: `grep -rn "@/lib/tutor\\|lib/tutor" packages/core/src --include=*.ts || true` },
];

let failed = false;
for (const r of RULES) {
  const out = execSync(r.cmd, { encoding: 'utf8' }).trim();
  if (out) { failed = true; console.error(`VIOLATION — ${r.name}:\n${out}\n`); }
  else console.log(`ok — ${r.name}`);
}
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Register and run it**

```json
"check:boundaries": "node scripts/check-workspace-boundaries.mjs"
```

```bash
npm run check:boundaries
```

Expected: three `ok` lines, exit 0.

- [ ] **Step 3: Document the new layout**

In `README.md`, replace any "run `npm run dev`" instruction with the per-app commands, and add:

```markdown
## Workspaces

| Workspace | What it is | Dev | Deploy | pm2 | Port |
|---|---|---|---|---|---|
| `apps/tutor` | The tutor engine: `/tutor`, `/tutor-portal/*`, `/api/tutor/*`, `/api/portal/v1/*`. Every portal (Crimsora, evelyntutor, white-labels, API partners) consumes THIS. | `npm run --workspace @evelyn/tutor dev` | `./deploy-tutor.sh` | `evelyn-tutor` | 3007 |
| `apps/marketing` | evelynlearning.com: site, blog, admin, outreach, prospecting, showcase. | `npm run --workspace @evelyn/marketing dev` | `./deploy-marketing.sh` | `evelyn-marketing` | 3001 |
| `packages/core` | Shared, tutor-agnostic: db, knowledge, utils, Teacher/SavedLesson models. Imported as `@core/*`. | — | — | — | — |

The 194 `test:*` scripts live in `apps/tutor`. Run them all with `npm run test:all`.
`npm run check:boundaries` enforces that marketing never imports the tutor.
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add workspace boundary check and document the split layout"
```

---

## Acceptance gate

The plan is done when **all** of these hold:

1. `npm run test:all` matches `docs/superpowers/baselines/2026-08-14-pre-split.txt` — same passes, same allowed-failure set, no new failures.
2. `npm run check:boundaries` exits 0.
3. Both apps build, **each alone**, and neither drags the other's code in. Measured cold against the Task 1 baseline of a 3:06.68 full build: `apps/marketing` now builds in **37.4s** and `apps/tutor` in **2:31.77**.

   The win the plan was after is real but it landed on marketing, not the tutor: the app that ships most often now deploys in ~38s instead of 3:07, a **~5×** improvement, while the tutor deploys alone in ~2:32.

   **Amended after measurement.** As originally worded this gate asked for a *materially faster tutor build* and treated any shortfall as proof of a surviving cross-link. The tutor came out only ~17% faster, and that is genuine rather than a symptom: both boundary greps are empty, marketing compiles in ~10s so it demonstrably carries no tutor code, and 152s + 37s ≈ 189s against 187s pre-split — the split is almost exactly additive. The cause is code volume. `apps/tutor/src` is 3,141 files / 488,835 lines against marketing's 562 / 117,556, so the pre-split build was already ~83% tutor; isolating it could never have won big. Do not re-open the tutor's wall clock as a bug.

   The cross-link check the original wording was reaching for is preserved, pointed at signals that actually detect coupling: `npm run check:boundaries` exits 0 (gate 2), and marketing's compile stays in the ~10s range. A marketing compile that creeps toward the tutor's is the symptom to chase, not the tutor's total.
4. `./deploy-tutor.sh` deploys the engine **without** rebuilding the blog, admin, outreach, prospecting, or showcase.
5. Crimsora runs a full live voice session — voice in, whiteboard render, clean end, transcript and mastery persisted — with **no** change to its own config or deploy.
6. `https://www.evelynlearning.com/` and `/blog` return 200 and render unchanged.

---

## Known follow-ups deliberately left undone

- **Dependency splitting.** All 55 deps / 21 devDeps stay hoisted at the workspace root. Splitting them per app would shrink each `npm ci`, but it is a separate change with its own failure modes; doing it here would confound this plan's gate.
- **Geo-accent on the embed.** `accentFromTimezone` is consumed only by `app/tutor/page.tsx` and the marketing demo — **the embed route never calls it**, because it reads a raw `voiceId` off the persona wire the portal supplies. Task 4 Step 2 passes `timezone` to the demo-token route so marketing keeps its behavior, but making geo pre-select work for portal-minted sessions is **M2** portal-side work (resolve accent → `teachersForAccent()` → pick persona → mint token).
- **`rate-limit.ts` is in `packages/core` but still guards only marketing/showcase routes.** Per-partner limits for `/api/portal/v1/**` are M1c, and they need a shared durable store — the current in-memory `Map` implementation breaks under the pm2 cluster mode M1b introduces.
