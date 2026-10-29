# GAC Homework Help — Per-Problem Sessions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A homework upload becomes a *homework set* with one card per problem; each problem opens its own one-problem tutor session with a pre-built, solver-verified figure in a fixed panel and a two-solve-verified answer key the brain checks against instead of solving live; the teacher sees the set.

**Architecture:** Three repos, three layers. The **engine** (`/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct`, Next.js `apps/tutor`) gains a background *homework build* (figure + answer key per problem, deterministic validation, resumable, cached), a per-problem plan minter, a `homework-problem` brain mode, and a fixed `ProblemPanel` in the session UI. The **academy API** (`/Users/luke/Dev/academy/.claude/worktrees/gac-29oct`, Express `apps/api`) gains a `HomeworkSet` model, three engine-client calls, student routes (set status, start problem) and the session-end outcome hook; `/api/learn/material` on the homework brand returns a set instead of starting a session. The **academy web** (`apps/web`) gains the problem list page, the problem session page (hosting the existing `EmbeddedSession`), drag-and-drop on the upload modal, and a staff *Homework sets* section. Engine↔academy traffic stays HMAC portal routes; new request/response schemas are **local** zod in each repo (no portal-contract bump, see Global Constraints).

**Tech Stack:** TypeScript; Next.js 16 (engine), Express + Mongoose (academy API), Next.js app router + Tailwind (academy web); zod; Anthropic SDK through the engine's model registry (`plangen-vision` = `claude-opus-5-5`, `content-verify` = `claude-sonnet-5`, `recap` = Haiku); engine tests are `apps/tutor/scripts/test-*.ts` run with `npx tsx` and registered as `test:*` in `apps/tutor/package.json`; academy tests are vitest in `tests/**` with the mock engine in `apps/mock-engine`.

**Spec:** `/Users/luke/Dev/evelynlearning/docs/superpowers/specs/2026-10-20-gac-homework-per-problem-design.md`

## Global Constraints

- Branch `gac-29oct` in BOTH repos; `gac-29oct` is deliberately NOT merged with `origin/main` (frozen GAC build). Engine deploys ONLY via `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct && ./deploy-tutor-gac.sh` (Praveen runs it); `npm ci` only at the worktree root.
- **No API spend in tests.** Every model call sits behind an injectable `deps` object (pattern: `defaultEnumerateDeps(getEnumerateClient())` in `enumerate-problems.ts`); tests inject stubs. Live verification is Praveen's three sheets (Task 16).
- **The answer key never reaches the browser.** `GET /api/tutor/lesson-plans/[id]` returns full plan metadata with no auth, so the key lives only in the engine's `HomeworkBuild` collection and in academy responses to **staff**; the one-problem plan's metadata carries `verified: boolean`, never the key.
- Engine gate before any deploy: `cd apps/tutor && npm run test:all` (baseline: 2 known failures `test:embed-debug-coverage`, `test:portal-student-scoping`; `test:brain-route-cache-blocks` may flake once), `npx tsc --noEmit`, and `npx tsx scripts/gen-system-prompt-hashes.ts` after any system-prompt text change. Academy gate: `npm test` (typecheck + vitest) and `npx playwright test --project=greenapple e2e/greenapple-homework.spec.ts`.
- Copy on the GAC brand must pass `e2e/greenapple-copy.spec.ts`: never the words `course(s)`, `subscribe`, `subscription`, `household`, `billing`, `trial`, `my plan` on `/app`, `/app/sessions`, `/app/account`, `/app/start`, nor on the new `/app/homework/*` pages (add them to `PAGES`).
- New flags default ON (`!== 'off'`). The only new flag is `HOMEWORK_PER_PROBLEM` (academy API) and it defaults on.
- One live session per account (`acquireSessionLock`): opening a problem while another problem session is live must end the live one first through the existing host-end handshake; the API returns 409 `session_active` otherwise (unchanged behaviour, surfaced on the problem page).
- Timings pinned by the spec: build per problem ≤ 90 s wall; problem-plan mint waits ≤ 8 s for a `preparing` problem; keyed verdict ≤ 4 s; text-thinking deadline 8 s in `homework-problem` sessions; list page polls every 3 s until every problem is `ready` or `unverified`; a `preparing` build with no progress for 3 min is re-kicked.
- Rates: `claude-opus-5-5` $4/$20, `claude-sonnet-5` $2/$10 (already in `model-rates.ts`); the build logs tokens per problem so cost per upload is auditable.

## Review Focus

1. **A worksheet whose problems have no figure** (pure algebra) — the list shows cards without thumbnails, the session has a text-only panel, nothing waits on a figure. Pinned by Task 3 (`figure: null` passes validation) and Task 8 (panel renders text only).
2. **The student opens a problem while it is still `preparing`** and keeps the session open for 20 minutes — the session stays *unverified* for its whole life (no verdicts), and the list later shows the problem `ready`; nothing crashes when the build finishes mid-session. Pinned by Task 6 (wait ≤ 8 s then mint unverified) and Task 7 (unverified block + no verdict).
3. **The two solves disagree on one lettered part but agree on the others** — the whole problem is `unverified` (no partial keys), the teacher sees both candidates. Pinned by Task 4.
4. **The engine restarts mid-build** (pm2 deploy) — the next list poll re-kicks the build; already-built problems are not rebuilt (hash cache), `preparing` ones resume. Pinned by Task 5 (idempotent runner) and Task 10 (re-kick after 3 min).
5. **The student types the correct final answer with different formatting** (`x = 20`, `20°`, `twenty`, `35.42 cm` vs key `35.4`) — numeric parts match within 1 % after unit stripping; words are `undecided` and go to the 4 s model check, never auto-wrong. Pinned by Task 7 (`keyedVerdict` table test).

---

## File structure

**Engine** (`apps/tutor/src/` unless noted)
- Create `lib/tutor/homework-build/types.ts` — `FigureCommand`, `FigureClaim`, `AnswerPart`, `AnswerKey`, `ProblemBuild`, `HomeworkBuildDoc`, `problemHash()`.
- Create `models/HomeworkBuild.ts` + register in `models/index.ts` — Mongoose model, `_id` = parent plan id.
- Create `lib/tutor/homework-build/store.ts` — `getHomeworkBuild`, `ensureHomeworkBuild`, `patchProblemBuild`, `findCachedProblem`.
- Create `lib/tutor/homework-build/figure-validate.ts` — deterministic `validateFigure`.
- Create `lib/tutor/homework-build/figure-build.ts` — `buildFigure` + `defaultFigureBuildDeps`.
- Create `lib/tutor/homework-build/key-solve.ts` — `solveKey`, `partsAgree`, `defaultKeySolveDeps`.
- Create `lib/tutor/homework-build/runner.ts` — `runHomeworkBuild`, `kickHomeworkBuild`.
- Create `app/api/portal/v1/homework-build/route.ts` — POST start/resume, GET status.
- Create `lib/tutor/lesson-plan/homework-problem.ts` — `HOMEWORK_PROBLEM_KIND`, `HomeworkProblemMeta`, `homeworkProblemOf`, `buildHomeworkProblemPlan`.
- Create `app/api/portal/v1/homework-problem-plan/route.ts` — POST mint.
- Create `lib/tutor/voice/keyed-verdict.ts` — `keyedVerdict`.
- Create `app/api/portal/v1/homework-problem-outcome/route.ts` — GET outcome + prior note.
- Create `app/tutor/components/session/ProblemPanel.tsx`.
- Modify `app/api/portal/v1/plan-generate/route.ts` (kick the build), `app/api/tutor/brain/stream/route.ts` (homework-problem mode), `lib/tutor/voice/claude-brain.ts` (block + keyed precheck + follow-up suppression), `lib/tutor/voice/text-thinking.ts` (per-session deadline), `app/tutor/components/session/SessionStage.tsx`, `TutorSession.tsx`, `VoiceTutorRealtime.tsx`, `app/tutor-portal/embed/page.tsx` (panel wiring + done event).
- Tests: `scripts/test-homework-build.ts`, `scripts/test-homework-problem-plan.ts`, `scripts/test-homework-problem-brain.ts`, `scripts/test-problem-panel.ts`; `package.json` scripts.

**Academy API** (`apps/api/src/`)
- Create `models/HomeworkSet.ts` (+ `models/index.ts`), `engine/homework-types.ts` (local zod), `http/routes/homework.ts`, `services/HomeworkSetService.ts`.
- Modify `engine/EngineClient.ts`, `http/routes/core.ts` (`/learn/material` branch; `/sessions/ended`, `/sessions/live-result` hook via `SessionService`), `services/SessionService.ts` (`homeworkSetId`/`problemN` on start; outcome hook), `models/Session.ts`, `services/StudentDashboardService.ts` (staff `homeworkSets`), `http/app.ts` (mount router), `apps/mock-engine/src/server.ts` + `fixtures.ts`.
- Tests: `tests/integration/homework-set.test.ts`, `tests/services/homework-set-service.test.ts`.

**Academy web** (`apps/web/`)
- Create `app/app/homework/[setId]/page.tsx`, `app/app/homework/[setId]/[n]/page.tsx`, `components/homework/HomeworkProblemList.tsx`, `components/homework/HomeworkProblemSession.tsx`, `components/homework/status.ts`, `components/admin/HomeworkSetsTable.tsx`, BFF `app/api/homework/[setId]/route.ts`, `app/api/homework/[setId]/problems/[n]/start/route.ts`, `lib/homework.ts` (types + server reads).
- Modify `components/LearnMaterialModal.tsx` (drag-drop, set redirect), `components/DashboardTopicSearch.tsx` (`onSetCreated`), `components/HomeworkHelpHome.tsx` (recent sets), `components/admin/TutorStudentView.tsx`, `lib/admin-students.ts`, `e2e/greenapple-homework.spec.ts`, `e2e/greenapple-copy.spec.ts`.
- Tests: `tests/unit/homework-status.test.ts`, e2e updates.

---

### Task 1: Engine — build types, model and store

**Files:**
- Create: `apps/tutor/src/lib/tutor/homework-build/types.ts`
- Create: `apps/tutor/src/models/HomeworkBuild.ts`; Modify: `apps/tutor/src/models/index.ts`
- Create: `apps/tutor/src/lib/tutor/homework-build/store.ts`
- Test: `apps/tutor/scripts/test-homework-build.ts` (section "1 types+store"; add `"test:homework-build": "tsx scripts/test-homework-build.ts"` to `apps/tutor/package.json`)

**Interfaces:**
- Produces (types.ts):
  ```ts
  export type FigureCommand =
    | { action: 'showGeometryConstructed'; title?: string; given: unknown[]; steps: unknown[]; display?: Record<string, unknown> }
    | { action: 'showGraph'; type: 'function'; data: GraphData };            // GraphData from '@evelyn/core' (packages/core/src/knowledge/types.ts)
  export type FigureClaim =
    | { kind: 'on_segment'; point: string; segment: [string, string] }
    | { kind: 'on_circle'; point: string; circle: string }
    | { kind: 'parallel'; a: [string, string]; b: [string, string] }
    | { kind: 'perpendicular'; a: [string, string]; b: [string, string] }
    | { kind: 'collinear'; points: string[] }
    | { kind: 'between'; point: string; ends: [string, string] };
  export interface AnswerPart { label: string; final: string; canonical: { kind: 'number'; value: number; units?: string } | { kind: 'text'; value: string } }
  export interface AnswerKey { parts: AnswerPart[]; solvers: string[] }
  export type ProblemBuildStatus = 'preparing' | 'ready' | 'unverified';
  export interface ProblemBuild {
    n: number; text: string; hash: string; status: ProblemBuildStatus;
    figure: FigureCommand | null; figureNote?: string;
    key: AnswerKey | null; verify: { agreed: boolean; candidates?: string[]; note?: string };
    ms?: number; tokens?: { in: number; out: number }; updatedAt: Date;
  }
  export interface HomeworkBuildDoc { _id: string; partnerId: string; problems: ProblemBuild[]; startedAt: Date; updatedAt: Date; done: boolean }
  export function problemHash(text: string): string;   // sha256 of text with whitespace collapsed, 16 hex chars
  ```
- Produces (store.ts):
  ```ts
  export function getHomeworkBuild(planId: string): Promise<HomeworkBuildDoc | null>;
  export function ensureHomeworkBuild(planId: string, partnerId: string, problems: Array<{ n: number; text: string }>): Promise<HomeworkBuildDoc>; // idempotent: existing doc returned untouched
  export function patchProblemBuild(planId: string, n: number, patch: Partial<Omit<ProblemBuild, 'n' | 'text' | 'hash'>>): Promise<void>; // $set on problems.$ + updatedAt, recomputes `done`
  export function findCachedProblem(hash: string, maxAgeMs?: number): Promise<ProblemBuild | null>; // newest ready|unverified with this hash within 24 h (default)
  ```

- [ ] **Step 1: Write the failing test** — in `scripts/test-homework-build.ts` (follow `scripts/test-homework-figure.ts` for the harness: `node:assert`, a `section()` helper, pass/fail counters, exit 1 on failure). Section 1 uses an in-memory Mongo (`mongodb-memory-server` is already a devDependency: check with `grep mongodb-memory-server apps/tutor/package.json`; if absent, section 1 connects to `process.env.TEST_MONGODB_URI` and is skipped with a notice when unset):
  ```ts
  assert.equal(problemHash('a  b\n c'), problemHash('a b c'));
  const doc = await ensureHomeworkBuild('gen-p1', 'greenapple', [{ n: 1, text: 'P1' }, { n: 2, text: 'P2' }]);
  assert.equal(doc.problems.length, 2); assert.equal(doc.problems[0].status, 'preparing'); assert.equal(doc.done, false);
  await ensureHomeworkBuild('gen-p1', 'greenapple', [{ n: 1, text: 'CHANGED' }]);   // no-op
  assert.equal((await getHomeworkBuild('gen-p1'))!.problems[0].text, 'P1');
  await patchProblemBuild('gen-p1', 1, { status: 'ready', key: { parts: [], solvers: ['a','b'] }, verify: { agreed: true } });
  await patchProblemBuild('gen-p1', 2, { status: 'unverified', verify: { agreed: false, candidates: ['3', '4'] } });
  assert.equal((await getHomeworkBuild('gen-p1'))!.done, true);
  assert.equal((await findCachedProblem(problemHash('P1')))!.status, 'ready');
  assert.equal(await findCachedProblem(problemHash('P1'), 0), null);
  ```
- [ ] **Step 2: Run to verify it fails** — `cd apps/tutor && npx tsx scripts/test-homework-build.ts` → FAIL: cannot find module `../src/lib/tutor/homework-build/types`.
- [ ] **Step 3: Implement** `types.ts`, `models/HomeworkBuild.ts` (schema mirrors `HomeworkBuildDoc`; `problems` as a subdocument array with `figure`, `key`, `verify` typed `Schema.Types.Mixed`; index `{ 'problems.hash': 1, updatedAt: -1 }`; register in `models/index.ts` the way `LessonPlan` is), and `store.ts` with the four functions. `done` = every problem not `preparing`.
- [ ] **Step 4: Run to verify it passes** — same command → section 1 all pass.
- [ ] **Step 5: Commit** — `git add apps/tutor/src/lib/tutor/homework-build apps/tutor/src/models apps/tutor/scripts/test-homework-build.ts apps/tutor/package.json && git commit -m "feat(tutor): HomeworkBuild — per-problem figure/key build record with hash cache"`.

### Task 2: Engine — deterministic figure validator

**Files:**
- Create: `apps/tutor/src/lib/tutor/homework-build/figure-validate.ts`
- Test: `apps/tutor/scripts/test-homework-build.ts` (section "2 validate")

**Interfaces:**
- Consumes: `solveGeometry(spec): SolverOutput` from `lib/tutor/diagrams/geometry-solver.ts` (L2996; throws on a bad spec; output `points` carry `{ id, x, y }`), `validateFunctionValuePoints` from `lib/tutor/whiteboard/graph-consistency-validator.ts` (L75), `parseFunctionString` from `lib/tutor/whiteboard/math-expr.ts` (L64), `parseAxisStep`/`isPiStep` from `lib/tutor/whiteboard/graph-axis.ts`.
- Produces:
  ```ts
  export interface FigureContext { problemText: string; claims: FigureClaim[] }
  export type FigureVerdict = { ok: true } | { ok: false; reasons: string[] };
  export function validateFigure(figure: FigureCommand | null, ctx: FigureContext): FigureVerdict;
  export function allowedLabelTokens(problemText: string): Set<string>;   // every maximal run of [A-Za-z0-9°π.,'′″+\-=()/ ] from the text and its [Figure: …] part, trimmed, plus single capital letters
  export function checkClaims(points: Record<string, { x: number; y: number }>, circles: Record<string, { cx: number; cy: number; r: number }>, claims: FigureClaim[], tol?: number): string[]; // failing-claim messages, [] when all hold (tol default 1e-6 relative to the figure's extent)
  ```
  Rules (all deterministic): (a) `null` is ok; (b) geometry: `solveGeometry` must not throw; every `label` string in `given`/`steps` must be in `allowedLabelTokens` after normalising `°`, spaces and unicode minus; every id named by a claim must exist in the solver output; every claim must hold; (c) graph: every `points[]` entry must satisfy `validateFunctionValuePoints` against some function (tolerance 1e-3 of the y-range) or be an axis intercept; `functions[].label` must be absent (legend hidden) unless the exact expression appears in `problemText`; if `problemText` contains `π` or `pi` next to an axis mark then `xAxisStep` must satisfy `isPiStep(parseAxisStep(...))`; point labels must be in `allowedLabelTokens`.

- [ ] **Step 1: Write the failing test** — fixtures in the test file:
  - `ws3p5Bad`: the exact `show_geometry`-style free-coordinate figure from session `portal-eca7af34` converted to a constructed spec with `given` points `A(0,4) B(-3,0) C(3,0) D(-1.2,1.6) E(1.2,1.6)` and segments; claims `[{kind:'on_segment', point:'D', segment:['A','B']}, {kind:'on_segment', point:'E', segment:['A','C']}, {kind:'parallel', a:['D','E'], b:['B','C']}]` → `ok:false`, a reason containing `on_segment D`.
  - `ws3p5Good`: `given` A,B,C; steps `section_point D of [A,B] ratio [6,x?]` — use ratio `[6, 9]` (AD:DB = 6:9 is a drawing choice; labels still `AD = 6`, `DB = x`), `section_point E of [A,C] ratio [12, 18]`, segments with labels `AD = 6`, `DB = x`, `AE = 12`, `EC = y`, `DE = 9`, `BC = 15`; problemText = the stored text of worksheet3 problem 5 (from `/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/24cb476e-17ed-4175-98e8-db272bc6c19a/scratchpad/seca-plan.json`, copy the string into the fixture) → `ok:true`.
  - `labelLeak`: `ws3p5Good` with one label `DB = 9` (a computed value) → `ok:false`, reason contains `label`.
  - `graphLegend`: the problem-8 `showGraph` payload from the same session with `functions[0].label = 'y = 3\\sin(2x)+1'` → `ok:false`, reason contains `legend`; with the label removed and `xAxisStep:'pi/2'` → `ok:true`; with `xAxisStep` removed → `ok:false`, reason contains `axis`.
  - `null` → `ok:true`.
- [ ] **Step 2: Run to verify it fails** — FAIL: `validateFigure` not found.
- [ ] **Step 3: Implement** `figure-validate.ts` per the rules above. `checkClaims`: on_segment = collinear (cross product ≤ tol) AND between the ends; on_circle = |dist − r| ≤ tol; parallel = |cross of directions| ≤ tol; perpendicular = |dot| ≤ tol; collinear pairwise; between = on_segment of ends.
- [ ] **Step 4: Run to verify it passes.**
- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): validateFigure — solver + claims + label provenance, no legend on homework graphs"`.

### Task 3: Engine — figure builder (model behind deps)

**Files:**
- Create: `apps/tutor/src/lib/tutor/homework-build/figure-build.ts`
- Test: `apps/tutor/scripts/test-homework-build.ts` (section "3 build figure")

**Interfaces:**
- Consumes: Task 2 `validateFigure`; `getModelClient('plangen-vision')` and `prepareParams` from `lib/tutor/ai/model-registry.ts`; `getModelClient('content-verify')`; `getGeometryStepKindsDescriptionTail()` (the step catalog text used by `toolDefinitions.ts:286`) for the system prompt.
- Produces:
  ```ts
  export interface FigureProposal { figure: FigureCommand | null; claims: FigureClaim[]; note?: string }
  export interface FigureBuildDeps {
    propose(input: { text: string; feedback?: string[] }): Promise<FigureProposal>;   // Opus 5.5, adaptive thinking effort low, output_config.format json_schema (FigureProposal)
    extractClaims(text: string): Promise<FigureClaim[]>;                               // Sonnet 5 fresh context, same claim schema, from the text alone
  }
  export function defaultFigureBuildDeps(): FigureBuildDeps;
  export interface FigureBuildResult { figure: FigureCommand | null; note?: string; attempts: number; claims: FigureClaim[] }
  export async function buildFigure(problem: { n: number; text: string }, deps: FigureBuildDeps, opts?: { maxAttempts?: number }): Promise<FigureBuildResult>;
  ```
  Algorithm (the only non-obvious part): run `propose` and `extractClaims` in parallel; claims = union (dedupe by JSON); `validateFigure(figure, {problemText, claims})`; on failure, call `propose` again with `feedback = reasons` (default `maxAttempts` 2); if still failing → `{ figure: null, note: reasons.join('; ') }`. A proposal whose `figure` is `null` with a note (text-only problem) returns immediately as ok. Prompt rules for `propose` (system prompt constant `FIGURE_PROPOSE_SYSTEM`, exported for the hash test): figures with parallels / transversal / circle / point-on-segment / extended side use constructed steps (`section_point`, `midpoint`, `intersect`, `point_on_circle`, `parallel_through`…) never free coordinates for dependent points; labels are copied verbatim from the problem text, never computed; a graph copies the sheet's axis marks (`xAxisStep: "pi/2"` for π scales) and has no function label; emit a claim for every stated relation.

- [ ] **Step 1: Write the failing test** — stub deps: `propose` returns `ws3p5Bad` on the first call and `ws3p5Good` when `feedback` is non-empty; `extractClaims` returns the three claims → result `figure` equals `ws3p5Good`, `attempts === 2`. Second case: `propose` always returns `ws3p5Bad` → `figure === null`, `note` mentions `on_segment`, `attempts === 2`. Third: `propose` returns `{figure:null, claims:[], note:'no figure'}` → `attempts === 1`, `figure === null`. Also `assert.match(FIGURE_PROPOSE_SYSTEM, /never.*free coordinates/i)` and `/xAxisStep/`.
- [ ] **Step 2: Run to verify it fails.**
- [ ] **Step 3: Implement** `figure-build.ts`. `defaultFigureBuildDeps` builds both calls with `prepareParams(role, {...})`, `max_tokens` 6000 (Opus) / 2000 (Sonnet), `thinking: {type:'adaptive'}`, `output_config: { effort: 'low', format: { type: 'json_schema', schema } }`; a 60 s timeout per call (`{ timeout: 60_000, maxRetries: 0 }`); any SDK error → `{figure:null, claims:[], note:'propose_failed:<kind>'}`.
- [ ] **Step 4: Run to verify it passes.**
- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): buildFigure — Opus proposal + independent claims, validated and retried once"`.

### Task 4: Engine — answer key by agreement

**Files:**
- Create: `apps/tutor/src/lib/tutor/homework-build/key-solve.ts`
- Test: `apps/tutor/scripts/test-homework-build.ts` (section "4 key")

**Interfaces:**
- Consumes: `compareDeterministic` from `lib/tutor/portal/key-compare.ts` (L236; numbers ±1 %, relations, MCQ); `buildSolverPrompt` from `lib/tutor/portal/key-verify-prompts.ts` as the style reference (do not reuse its schema — ours is per-part).
- Produces:
  ```ts
  export type SolveFn = (text: string) => Promise<AnswerPart[] | null>;   // null = solver failed / ill-posed
  export interface KeySolveDeps { solveA: SolveFn; solveB: SolveFn; solveTieBreak: SolveFn; names: [string, string, string] }
  export function defaultKeySolveDeps(): KeySolveDeps;   // A = content-verify (Sonnet 5, effort medium), B = plangen-vision (Opus 5.5, effort medium), tie-break = Opus 5.5 effort high; each json_schema { parts:[{label, final, canonical}] , ill_posed?:string }, 60 s timeout
  export function partsAgree(a: AnswerPart[], b: AnswerPart[]): boolean;  // same part count and labels (order-insensitive by label); number parts within 1 % after unit stripping; text parts equal after lowercase/whitespace/trailing-period normalisation
  export interface KeySolveResult { key: AnswerKey | null; agreed: boolean; candidates: string[]; note?: string }
  export async function solveKey(problem: { n: number; text: string }, deps: KeySolveDeps): Promise<KeySolveResult>;
  ```
  Algorithm: A and B in parallel; agree → key = A's parts, `solvers:[names[0],names[1]]`; disagree or one null → tie-break; key = the pair that agrees (tie-break with A or with B), `solvers` names both; otherwise `key:null, agreed:false, candidates:[finals of A, B, tie-break joined per solver]`. Never a partial key.

- [ ] **Step 1: Write the failing test** — stubs: (i) A=B=`[{label:'', final:'x = 20', canonical:{kind:'number', value:20}}]` → agreed, key.solvers has 2 names, tie-break not called (count calls). (ii) A says 35.42, B says 31.42, tie-break 35.4 → agreed with A (±1 %), solvers `[A, tie]`. (iii) A,B,tie all differ → `key:null`, `candidates.length === 3`. (iv) two-part problem where part (a) agrees and (b) differs, tie-break matches neither → `key:null` (Review Focus 3). (v) `partsAgree` table: `'20°'` vs `20` true; `'35.42 cm'` vs `35.4` true; `'1/2'` text vs `'0.5'` number → false (text parts compare as text); labels `a,b` vs `b,a` order-insensitive true.
- [ ] **Step 2: Run to verify it fails.**
- [ ] **Step 3: Implement** `key-solve.ts`. The solver system prompt (`KEY_SOLVE_SYSTEM`, exported): solve fully, one entry per lettered part (label `''` when unlettered), `final` as the student would write it, `canonical` numeric where the answer is a number (strip units into `units`), text otherwise; round to 4 significant figures; `ill_posed` when the problem cannot be solved from the text and figure description.
- [ ] **Step 4: Run to verify it passes.**
- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): solveKey — two independent solves must agree, tie-break once, never a partial key"`.

### Task 5: Engine — build runner, portal routes, kick from plan-generate

**Files:**
- Create: `apps/tutor/src/lib/tutor/homework-build/runner.ts`
- Create: `apps/tutor/src/app/api/portal/v1/homework-build/route.ts`
- Modify: `apps/tutor/src/app/api/portal/v1/plan-generate/route.ts` (after `upsertLessonPlan`, L510–518 region, homework branch only)
- Test: `apps/tutor/scripts/test-homework-build.ts` (section "5 runner"), plus a source check that plan-generate calls `kickHomeworkBuild`

**Interfaces:**
- Consumes: Tasks 1–4; `homeworkProblemsOf(plan)` from `lib/tutor/lesson-plan/homework.ts` (L65); `getLessonPlan` from `lib/tutor/lesson-plan/store.ts`; `withPortalAuth` from `lib/tutor/portal/auth.ts` (L146).
- Produces:
  ```ts
  export interface RunnerDeps { figure: FigureBuildDeps; key: KeySolveDeps; now?: () => number }
  export async function runHomeworkBuild(planId: string, partnerId: string, opts?: { first?: number; deps?: RunnerDeps; concurrency?: number }): Promise<void>;
  export function kickHomeworkBuild(planId: string, partnerId: string, opts?: { first?: number }): void;   // detached: void runHomeworkBuild(...).catch(log); in-process Set guard per planId (second kick while running is a no-op)
  export const BUILD_STALE_MS = 3 * 60_000;
  ```
  Runner: `ensureHomeworkBuild` from the plan's `metadata.problems`; for each problem still `preparing` (the `first` problem first, then ascending), with concurrency 2: `findCachedProblem(hash)` → copy; else `buildFigure` and `solveKey` **in parallel**, then `patchProblemBuild(n, { status: key ? 'ready' : 'unverified', figure, figureNote, key, verify, ms, tokens })`. A throw inside one problem marks that problem `unverified` with `verify.note = 'build_error:<message>'`; the others continue. Logs one line per problem: `[homework-build] plan=… n=… status=… figure=yes|no ms=… in=… out=…`.
  Routes (HMAC, `withPortalAuth`): `POST /api/portal/v1/homework-build` body `{ planId: string; first?: number }` → 202 `{ started: boolean }` (404 when no plan or not a homework plan); `GET /api/portal/v1/homework-build?planId=` → 200 `{ planId, done: boolean, startedAt, updatedAt, problems: Array<{ n; status; hasFigure: boolean; verify: { agreed: boolean; candidates?: string[] }; finals?: string[] }> }` (`finals` = key parts' `final`, present only when `agreed`); 404 when no build. The GET re-kicks when `!done && now − updatedAt > BUILD_STALE_MS`.

- [ ] **Step 1: Write the failing test** — with stub deps that resolve instantly and record order: a 3-problem plan inserted via `upsertLessonPlan` (metadata `kind:'homework-help', problems`); `runHomeworkBuild(id, 'greenapple', { first: 3, deps, concurrency: 1 })` → build order `[3,1,2]`, all `ready`, `done === true`; a second run makes zero deps calls (status not `preparing`); a run on a plan whose problem 2 text equals an already-built problem's text copies the cache (deps call count for n=2 is 0); a deps `figure.propose` that throws for n=1 → n=1 `unverified` with `verify.note` starting `build_error:`, n=2,3 `ready`. Source check: `assert.match(fs.readFileSync('src/app/api/portal/v1/plan-generate/route.ts','utf8'), /kickHomeworkBuild\(/)`.
- [ ] **Step 2: Run to verify it fails.**
- [ ] **Step 3: Implement** `runner.ts` and the route file; in `plan-generate/route.ts` after the successful `upsertLessonPlan` in the homework branch add `if (homeworkProblems) kickHomeworkBuild(plan.id, auth.partnerId);` (the partner id is `auth.partnerId` as used by `generatedPlanMetadata`).
- [ ] **Step 4: Run to verify it passes**; also `npx tsc --noEmit`.
- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): homework build runner + portal routes; plan-generate kicks the build for homework plans"`.

### Task 6: Engine — one-problem plan minter

**Files:**
- Create: `apps/tutor/src/lib/tutor/lesson-plan/homework-problem.ts`
- Create: `apps/tutor/src/app/api/portal/v1/homework-problem-plan/route.ts`
- Test: `apps/tutor/scripts/test-homework-problem-plan.ts` (`"test:homework-problem-plan"`)

**Interfaces:**
- Consumes: Task 1 store; `buildRecapSegment`, `upsertLessonPlan`, `generatedPlanMetadata` as used in `plan-generate/route.ts` L323–362 and L484–495; `LessonPlan` type.
- Produces:
  ```ts
  export const HOMEWORK_PROBLEM_KIND = 'homework-problem' as const;
  export interface HomeworkProblemMeta { kind: typeof HOMEWORK_PROBLEM_KIND; parentPlanId: string; n: number; text: string; figure: FigureCommand | null; verified: boolean; priorNote?: string }
  export function homeworkProblemOf(plan: { metadata?: Record<string, unknown> } | null | undefined): HomeworkProblemMeta | null;
  export function buildHomeworkProblemPlan(parent: LessonPlan, meta: Omit<HomeworkProblemMeta, 'kind'>, planId: string): LessonPlan;
    // title `Problem ${n}`, subject/grade/curriculum copied from the parent, one LO `${planId}.lo-1` ("Work problem n"), segments [ {id:'problem', kind:'concept', goal:'Work this one problem with the student.', keyIdeas:[text]}, buildRecapSegment(los) ], metadata = { ...parentMetadataWithoutProblems, kind: HOMEWORK_PROBLEM_KIND, ...meta }  — NEVER a key field
  ```
  Route `POST /api/portal/v1/homework-problem-plan` body `{ planId: string; n: number; priorNote?: string; waitMs?: number }` (waitMs clamp 0–8000, default 8000): loads the parent plan (404 if not homework-help or `n` absent), polls `getHomeworkBuild` every 500 ms up to `waitMs` while the problem is `preparing` (and `kickHomeworkBuild` once if no build doc exists), then mints `gen-${randomUUID()}` with `figure` = build figure (or null) and `verified` = `build.status === 'ready'`; response 201 `{ planId, verified: boolean, hasFigure: boolean, buildStatus: ProblemBuildStatus }`.

- [ ] **Step 1: Write the failing test** — `homeworkProblemOf({metadata:{kind:'homework-help', problems:[]}}) === null`; `buildHomeworkProblemPlan(parentFixture, {...}, 'gen-x')`: `metadata.kind === 'homework-problem'`, `metadata.n === 5`, `metadata.problems === undefined`, `JSON.stringify(plan)` does not contain `"key"` nor `"canonical"`, `segments[0].keyIdeas[0] === text`, `los[0].id === 'gen-x.lo-1'`; `parseLessonPlan(plan)` (from store.ts) does not throw. Route source check: `/waitMs/` and `/8000/` present, `/key/` not present in the response builder (grep the file for `finals|key:`).
- [ ] **Step 2: Run to verify it fails.**
- [ ] **Step 3: Implement** both files.
- [ ] **Step 4: Run to verify it passes.**
- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): homework-problem plan — one problem, its figure, verified flag; never the key"`.

### Task 7: Engine — `homework-problem` brain mode

**Files:**
- Create: `apps/tutor/src/lib/tutor/voice/keyed-verdict.ts`
- Create: `apps/tutor/src/app/api/portal/v1/homework-problem-outcome/route.ts`
- Modify: `apps/tutor/src/app/api/tutor/brain/stream/route.ts` (near L690–716 where `body.homework` is validated, and L901 `activeProblem`)
- Modify: `apps/tutor/src/lib/tutor/voice/claude-brain.ts` (`BrainTurnInput` L320–410; the two `formatHomeworkSessionBlock` call sites ~L2002 and ~L2212; text precheck call L2437; board-anchor/correction follow-up issue points)
- Modify: `apps/tutor/src/lib/tutor/voice/text-thinking.ts` (`TEXT_THINKING_DEADLINE_MS` L65 → per-call parameter)
- Modify: `apps/tutor/src/lib/tutor/ai/system-prompt-builder.ts` only if a prompt-text constant moves there (then regenerate hashes)
- Test: `apps/tutor/scripts/test-homework-problem-brain.ts` (`"test:homework-problem-brain"`)

**Interfaces:**
- Consumes: Task 6 `homeworkProblemOf`; Task 1 `getHomeworkBuild`; `formatActiveProblemBlock` (claude-brain L1542, already has the "VERIFIED expected answer … TRUST THIS" path); `compareDeterministic` (key-compare.ts); `getModelClient('recap')`; `TutorSession` model (`debugEvents`, transcript) from `models/TutorSession.ts`.
- Produces:
  ```ts
  // keyed-verdict.ts
  export type KeyedVerdict = { verdict: 'correct' | 'incorrect' | 'undecided'; part?: string; matched?: string };
  export function keyedVerdict(studentMessage: string, key: AnswerKey): KeyedVerdict;   // deterministic: extract numbers/units/assignments (`x = 20`, `20°`, `35.42 cm`, `c ≈ 6.9`) from the message; a number part is correct when within 1 % of canonical; an explicit different number for the same part is incorrect; words/fractions/text parts → undecided
  export const KEYED_VERDICT_MODEL_TIMEOUT_MS = 4000;
  // claude-brain.ts additions
  export interface HomeworkProblemTurnInput { text: string; verified: boolean; hasFigure: boolean; priorNote?: string; key?: AnswerKey }   // server-populated only
  export function formatHomeworkProblemBlock(hp: HomeworkProblemTurnInput): string;   // <homework_problem> … </homework_problem>
  export const HOMEWORK_PROBLEM_RULES: string;   // exported for the test
  ```
  Behaviour in the stream route: when `homeworkProblemOf(plan)` is non-null for `body.lessonPlanContext.plan.id` (load the plan server-side with `getLessonPlan`; cache per request): **ignore** `body.homework` (no `<homework_session>`, no `SET_CURRENT_PROBLEM_TOOL`), build `input.homeworkProblem` with `key` from `getHomeworkBuild(parentPlanId).problems[n]` when `verified`, set `input.activeProblem = { statement: text, source: 'card', expectedAnswer: key ? key.parts.map(p => `${p.label ? p.label + ') ' : ''}${p.final}`).join('; ') : undefined }`, and set `textThinkingDeadlineMs = 8000`.
  `HOMEWORK_PROBLEM_RULES` (verbatim content decided here): the figure is already on the student's screen beside the chat (or: no figure could be drawn — refer to the sheet); never redraw the problem's figure, sketch only new work; labels and values are read from the sheet; when the student says they do not know or remember a name or fact, tell them after one miss and move on; when `verified`: check the student's final answer against the expected answer and say so plainly; when NOT verified: never say an answer is right or wrong — work it through step by step and ask the student to check with their teacher; the prior-work note is what happened last time on this problem; when every part is confirmed correct, say the problem is done and offer "Back to your list".
  Precheck: in the text path (L2437) when `homeworkProblem.key` exists: run `keyedVerdict` first; `correct`/`incorrect` → inject as today's verdict with no model call; `undecided` → existing precheck with `problemFacts` = the key's finals and `timeoutMs: KEYED_VERDICT_MODEL_TIMEOUT_MS`; when `homeworkProblem` exists and `!verified` → skip the precheck entirely. Follow-ups: board-anchor and correction re-issue turns are not issued when `input.homeworkProblem` is set. Done event: when the injected verdict is `correct` for every part (track parts confirmed in the session's debug events `homework_part_correct {part}`), the route appends debug event `homework_problem_done` once.
  Outcome route `GET /api/portal/v1/homework-problem-outcome?sessionId=` (HMAC): reads `TutorSession` by sessionId → `{ outcome: 'done' | 'in_progress' | 'needs_review', priorNote: string }` where `done` = `homework_problem_done` present; `needs_review` = the plan was unverified and the transcript's last student turn claims finished (reuse `claimsSetFinished` from homework-ledger.ts) or the student had ≥ 2 `incorrect` verdicts on the same part without a later `correct`; `priorNote` = Haiku `recap` role, ≤ 40 words, prompt "Two short lines: what the student did on this problem and where they stopped. No answers." (empty string when the transcript has no student turn; model failure → `''`).

- [ ] **Step 1: Write the failing test** — (a) `keyedVerdict` table: key `x=20` number 20: `'they are equal so x = 20'` → correct; `'x = 60/3 = 20'` → correct; `'x is 25'` → incorrect; `'twenty'` → undecided; key 35.42 with units cm: `'so perimeter is 26+3pi=35.4 cm'` → correct; `'31.42'` → incorrect; two-part key a=8, b=24: `'a) 8'` → correct with `part:'a'`. (b) `formatHomeworkProblemBlock({text:'P', verified:false, hasFigure:true})` contains `<homework_problem>` and `never say an answer is right or wrong`; with `verified:true` contains `expected answer`; with `hasFigure:false` contains `refer to the sheet`. (c) source checks on `stream/route.ts`: `/homeworkProblemOf\(/`, `/getHomeworkBuild\(/`, and that `SET_CURRENT_PROBLEM_TOOL` is attached only under a condition mentioning `homeworkProblem` (regex on the surrounding 10 lines); on `claude-brain.ts`: `/keyedVerdict\(/` and `/KEYED_VERDICT_MODEL_TIMEOUT_MS/`; on `text-thinking.ts`: `textThinkingDeadlineMs` parameter exists. (d) outcome route source: `/homework_problem_done/`, `/claimsSetFinished/`, `/recap/`.
- [ ] **Step 2: Run to verify it fails.**
- [ ] **Step 3: Implement** in the order: `keyed-verdict.ts` → claude-brain additions → stream route wiring → text-thinking parameter → outcome route. Keep `formatHomeworkSessionBlock` untouched (old whole-sheet sessions in flight keep working). If any system-prompt text constant changes, run `npx tsx scripts/gen-system-prompt-hashes.ts`.
- [ ] **Step 4: Run** `npx tsx scripts/test-homework-problem-brain.ts`, then `npx tsx scripts/test-no-reveal-ledger.ts` (must stay 101+ pass), `npx tsx scripts/test-brain-stall.ts`, `npx tsc --noEmit`.
- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): homework-problem brain mode — keyed verdict ≤4 s, no ledger, unverified never judges, outcome route"`.

### Task 8: Engine — ProblemPanel and session wiring

**Files:**
- Create: `apps/tutor/src/app/tutor/components/session/ProblemPanel.tsx`
- Modify: `apps/tutor/src/app/tutor/components/session/SessionStage.tsx` (props L58–235; render beside the board), `TutorSession.tsx` (props ~L119, pass-through ~L1655), `VoiceTutorRealtime.tsx` (`homeworkProblems` memo L2694; plan fetch L10698; `onHomeworkProgress`), `app/tutor-portal/embed/page.tsx` (`evelyn:session_ended` payload L1290–1335)
- Test: `apps/tutor/scripts/test-problem-panel.ts` (`"test:problem-panel"`) — source-level + a render-harness fixture

**Interfaces:**
- Consumes: Task 6 `homeworkProblemOf`; `CommandRenderer` (WhiteboardCanvas.tsx L2741, prop `command`); `InlineMathText` (`app/tutor/components/whiteboard/InlineMathText.tsx`); `textKickoffReady` (`session/text-kickoff.ts`).
- Produces:
  ```tsx
  export interface ProblemPanelProps { n: number; text: string; figure: FigureCommand | null; verified: boolean; collapsed?: boolean; onToggle?: () => void }
  export function ProblemPanel(props: ProblemPanelProps): JSX.Element;
  ```
  Layout decisions: desktop (≥ md) — a fixed left column `w-[min(38vw,440px)]` with the problem text (InlineMathText) above the figure (`CommandRenderer` inside a 4:3 box), `select-text`; the board + transcript take the rest (`SessionStage` wraps its existing root in a flex row when `problemPanel` is set). Phone — the panel is a collapsible sheet above the board (`collapsed` default true, header "Problem n ▾"). When `!verified` a small line "Checking the answer key…" / "Answer key unavailable — your tutor will work it through with you" (text decided here). The homework rail chip ("Problem n of N") is not rendered in this mode.
  Wiring: VTR computes `homeworkProblem = useMemo(() => homeworkProblemOf(activePlan), [activePlan])`; passes it up via a new `onHomeworkProblem?(meta | null)` (mirror of `onHomeworkProgress`) → TutorSession state → `SessionStage problemPanel={…}`. `textKickoffReady` must return true for `homework-problem` plans in text mode (it currently needs "homework ready" or `tutor_opens`; add `|| homeworkProblem != null`). `evelyn:session_ended` gains `homework_problem?: { parent_plan_id, n }` (informational; academy uses its own `Session` row).

- [ ] **Step 1: Write the failing test** — source checks: `ProblemPanel.tsx` exports `ProblemPanel` and imports `CommandRenderer` and `InlineMathText`; `SessionStage.tsx` has prop `problemPanel`; `VoiceTutorRealtime.tsx` calls `homeworkProblemOf(` and `onHomeworkProblem`; `text-kickoff.ts` mentions `homeworkProblem`; `embed/page.tsx` sends `homework_problem`. Add a render-harness fixture `apps/tutor/scripts/tutor-render-harness/fixtures/homework/problem-panel-ws3p5.json` holding the `ws3p5Good` constructed command so `npm run test:render-tools` renders it (visual check in Task 16).
- [ ] **Step 2: Run to verify it fails.**
- [ ] **Step 3: Implement.** Keep the old homework rail path intact for `homework-help` plans.
- [ ] **Step 4: Run** the test, `npx tsc --noEmit`, and `npm run dev` on :3007 → open `/tutor/render-harness#<base64 {tool:'show_geometry_constructed', args: ws3p5Good}>` once to eyeball the figure.
- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): ProblemPanel — fixed problem text + pre-built figure beside the board for homework-problem sessions"`.

### Task 9: Academy API — HomeworkSet model, engine client, mock engine

**Files:**
- Create: `apps/api/src/models/HomeworkSet.ts`; Modify: `apps/api/src/models/index.ts`, `apps/api/src/models/Session.ts` (add `homeworkSetId?: string`, `problemN?: number`, index `{ homeworkSetId: 1, problemN: 1 }`)
- Create: `apps/api/src/engine/homework-types.ts` (local zod: `HomeworkBuildStartRequest/Response`, `HomeworkBuildStatusResponse`, `HomeworkProblemPlanRequest/Response`, `HomeworkProblemOutcomeResponse` — shapes exactly as Tasks 5–7 produce)
- Modify: `apps/api/src/engine/EngineClient.ts` (four methods), `apps/mock-engine/src/server.ts` + `fixtures.ts` (the four routes; `homeworkBuildFor(planId)` returns every problem `ready`, `hasFigure: n % 2 === 1`, `finals: ['42']`; a plan id containing `unverified` returns problem 1 `unverified` with `candidates: ['3','4']`; a plan id containing `slowbuild` returns `preparing` for the first two GETs)
- Test: `tests/contract/homework-engine-client.test.ts` (stub `fetchImpl` like `tests/contract/planGenerate.test.ts`)

**Interfaces:**
- Produces:
  ```ts
  // EngineClient
  homeworkBuild(req: { planId: string; first?: number }, timeoutMs?: number): Promise<{ started: boolean }>;            // POST /homework-build
  homeworkBuildStatus(planId: string, timeoutMs?: number): Promise<HomeworkBuildStatus>;                                // GET /homework-build?planId=
  homeworkProblemPlan(req: { planId: string; n: number; priorNote?: string; waitMs?: number }, timeoutMs?: number): Promise<{ planId: string; verified: boolean; hasFigure: boolean; buildStatus: 'preparing'|'ready'|'unverified' }>;
  homeworkProblemOutcome(sessionId: string, timeoutMs?: number): Promise<{ outcome: 'done'|'in_progress'|'needs_review'; priorNote: string }>;
  // HomeworkSet (Mongoose)
  { userId: string; partnerId?: string; title: string; courseId: ObjectId; courseKey: string; lessonPlanId: string; subject?: string;
    problems: Array<{ n: number; text: string; build: 'preparing'|'ready'|'unverified'; hasFigure: boolean; verify: { agreed: boolean; candidates?: string[] }; finals?: string[];
      work: { status: 'not_started'|'in_progress'|'done'|'needs_review'; lastSessionId?: string; priorNote?: string; attempts: number; seconds: number; updatedAt?: Date } }>;
    buildDone: boolean; buildCheckedAt?: Date; createdAt: Date; updatedAt: Date }   // timestamps: true; indexes {userId, createdAt:-1}, {partnerId, createdAt:-1}
  ```

- [ ] **Step 1: Write the failing test** — client test: each method signs and hits the right path (`/api/portal/v1/homework-build` POST body `{planId:'gen-1', first: 3}`; GET with `?planId=`), parses the mock response, and throws `EngineClientError` on 404. Model test (in `tests/services/homework-set-service.test.ts`, created here with the Mongo harness): creating a set with 2 problems defaults `work.status` to `not_started`, `attempts 0`, `build 'preparing'`.
- [ ] **Step 2: Run to verify it fails** — `npx vitest run tests/contract/homework-engine-client.test.ts`.
- [ ] **Step 3: Implement** model, local schemas, client methods (`this.send('POST', this.path('/homework-build'), body, HomeworkBuildStartResponseSchema, timeoutMs)` pattern), mock-engine routes.
- [ ] **Step 4: Run to verify it passes**; `npm run typecheck`.
- [ ] **Step 5: Commit** — `git commit -m "feat(api): HomeworkSet model + engine homework-build/problem-plan/outcome client + mock engine routes"`.

### Task 10: Academy API — upload creates a set; set status; start a problem

**Files:**
- Create: `apps/api/src/services/HomeworkSetService.ts`, `apps/api/src/http/routes/homework.ts`; Modify: `apps/api/src/http/app.ts` (mount `/api/homework` with `requireAuth`, `requireActiveAccount`)
- Modify: `apps/api/src/http/routes/core.ts` `/learn/material` (after `generated` at ~L1460–1490, before the picker/session code), `apps/api/src/services/SessionService.ts` (`StartFreeformSessionInput` L331 gains `homeworkSetId?`, `problemN?`; `Session.create` L467–501 stores them)
- Test: `tests/integration/homework-set.test.ts`

**Interfaces:**
- Produces (service):
  ```ts
  export async function createHomeworkSetFromPlan(a: { userId; partnerId?; title; courseId; courseKey; generated: { planId; problems: Array<{n;text}>; subject? }; engine: EngineClient }): Promise<HomeworkSetDoc>;  // creates the set, then void engine.homeworkBuild({planId}).catch(log)
  export async function refreshHomeworkSetBuild(set: HomeworkSetDoc, engine: EngineClient, now?: Date): Promise<HomeworkSetDoc>;  // when !buildDone and (no buildCheckedAt or > 3 s old): GET status, copy build/hasFigure/verify/finals per problem, set buildDone/buildCheckedAt; swallow engine errors (keeps last known)
  export function studentView(set: HomeworkSetDoc): HomeworkSetStudentView;   // strips `finals` and `verify.candidates`
  export function staffView(set: HomeworkSetDoc): HomeworkSetStaffView;       // keeps them
  export async function startHomeworkProblem(a: { set; n; userId; learnerId?; deviceId?; fairUse; engine; timeBox }): Promise<StartSessionResult>;  // engine.homeworkProblemPlan({planId:set.lessonPlanId, n, priorNote: work.priorNote}) (timeout 12_000) → startFreeformSession({..., lessonPlanId: problemPlanId, goal:'homework-help', topic: `Problem ${n}`, homeworkSetId, problemN: n}) → work.status 'in_progress', lastSessionId, attempts+1
  ```
  Routes: `GET /api/homework` → `{ sets: HomeworkSetStudentView[] }` (mine, newest 20); `GET /api/homework/:setId` → `HomeworkSetStudentView` (404 when not mine; calls `refreshHomeworkSetBuild` first); `POST /api/homework/:setId/problems/:n/start` → same gates as `/learn/material` (`assertPaidAccess`, `gateFairUse`), 201 `{ engineSessionId, embed, setId, n }`, 409 `session_active` passthrough via `mapLockError`.
  `/learn/material` change: when `process.env.HOMEWORK_HELP === '1' && (body.files?.length ?? 0) > 0 && generated.kind === 'homework-help' && (generated.problems?.length ?? 0) > 0 && process.env.HOMEWORK_PER_PROBLEM !== 'off'` → create the set, `persistAttachments` keyed by the set id (`sessionId: set:${setId}` — the existing `SessionAttachment.sessionId` is a free string), `recordHomeworkHelp({kind:'upload', sessionId: set:${setId}})`, respond **201 `{ homeworkSetId, problems: [{n,text}], topic: body.topicHint, courseKey, courseTitle, generatedPlanId }`** — no session, no lock. Paste-only and non-homework brands unchanged.

- [ ] **Step 1: Write the failing test** — reuse the `learn-material-summary.test.ts` setup (mock engine, `signupNoEnroll`, `png('hw.png')`): (i) `HOMEWORK_HELP=1` + file → 201 with `homeworkSetId` and `problems.length ≥ 1`, no `engineSessionId`, a `HomeworkSet` row exists with `problems[0].work.status === 'not_started'`, no `Session` row; (ii) `GET /api/homework/:id` → every problem `build === 'ready'`, response JSON has no `finals` key; (iii) `POST /api/homework/:id/problems/1/start` → 201 with `embed.embedUrl`, `Session` row has `homeworkSetId`, `problemN 1`, `lessonPlanId` ≠ the set's `lessonPlanId`, and the mock engine's last problem-plan request was `{planId, n:1}`; set `work.status === 'in_progress'`, `attempts === 1`; (iv) a second start on problem 2 while problem 1 is live → 409 `session_active`; (v) `HOMEWORK_PER_PROBLEM=off` → the old 201 with `engineSessionId`; (vi) plan id containing `slowbuild` → first GET shows `preparing`, third GET `ready`.
- [ ] **Step 2: Run to verify it fails.**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `npx vitest run tests/integration/homework-set.test.ts tests/integration/learn-material-summary.test.ts tests/integration/learn-homework-goal.test.ts`; `npm run typecheck`.
- [ ] **Step 5: Commit** — `git commit -m "feat(api): homework upload creates a HomeworkSet; per-problem start mints a one-problem session"`.

### Task 11: Academy API — session-end outcome hook and staff view

**Files:**
- Modify: `apps/api/src/services/SessionService.ts` (`recordSessionEnded` L1529 and `finalizeLiveSession` L1273: after usage is ticked, when `session.homeworkSetId` → `recordHomeworkOutcome`), `apps/api/src/services/HomeworkSetService.ts` (`recordHomeworkOutcome`), `apps/api/src/services/StudentDashboardService.ts` (`buildStudentDetail` L315–585 adds `homeworkSets`), `apps/api/src/http/routes/admin.ts` (nothing new; the tutor whitelist at L564–584 must include `homeworkSets`)
- Test: `tests/integration/homework-set.test.ts` (extend), `tests/admin/…` existing student-detail test extended

**Interfaces:**
- Produces:
  ```ts
  export async function recordHomeworkOutcome(a: { session: SessionDoc; engine: EngineClient; seconds: number }): Promise<void>;   // engine.homeworkProblemOutcome(engineSessionId, 8_000) → work.status = outcome==='done' ? 'done' : outcome==='needs_review' ? 'needs_review' : 'in_progress'; priorNote; seconds += ; swallow engine errors (status stays in_progress)
  // StudentDetail (both tutor and admin shapes)
  homeworkSets: Array<{ id; title; createdAt; buildDone; problems: Array<{ n; text; build; work: { status; attempts; seconds; priorNote? }; verify: { agreed; candidates? }; finals?; lastSessionId? }> }>  // HOMEWORK_HELP only; newest 20
  ```

- [ ] **Step 1: Write the failing test** — (i) start problem 1, `POST /api/sessions/ended` for it → mock engine outcome `done` (mock: sessionId containing… the mock cannot know; make the mock return `done` by default and `needs_review` when the engine session id was minted for a plan id containing `unverified`) → set problem 1 `work.status === 'done'`, `priorNote` non-empty, `seconds > 0`; (ii) `GET /api/admin/students/:id` as a tutor → `homeworkSets[0].problems[0].finals` present and `work.status === 'done'`; `logStaffAccess` called with `recordType: 'homework_set'`.
- [ ] **Step 2: Run to verify it fails.**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the tests + `npm run typecheck`.
- [ ] **Step 5: Commit** — `git commit -m "feat(api): per-problem outcome at session end; staff student detail lists homework sets"`.

### Task 12: Academy web — upload modal: drag-and-drop and set redirect; BFF routes

**Files:**
- Modify: `apps/web/components/LearnMaterialModal.tsx` (file input L430–438; 201 branch L271–280), `apps/web/components/DashboardTopicSearch.tsx` (`handleMaterialSession` L632–637; mount L1533–1543)
- Create: `apps/web/app/api/homework/route.ts` (GET mine), `apps/web/app/api/homework/[setId]/route.ts` (GET), `apps/web/app/api/homework/[setId]/problems/[n]/start/route.ts` (POST `forward`), `apps/web/lib/homework.ts` (types `HomeworkSetView`, `getHomeworkSet(id)`, `getHomeworkSets()` via `apiGet`)
- Test: `tests/unit/learn-material.test.ts` (extend), `e2e/greenapple-homework.spec.ts`

**Interfaces:**
- Produces: `LearnMaterialModal` prop `onSetCreated?: (r: { homeworkSetId: string; topic: string }) => void`; on a 201 whose body has `homeworkSetId`, call `onSetCreated` (DashboardTopicSearch does `router.push(`/app/homework/${id}`)`); a 201 with `engineSessionId` keeps today's `onSessionStart`. Drop zone: copy the `OrgIngestForm.tsx` L188–222 pattern (`dragActive`, `onDragOver/Leave/Drop` → the modal's existing `acceptFiles`), `data-testid="hh-dropzone"`, text "Drop photos or PDFs here, or" + the existing "Choose files" button.

- [ ] **Step 1: Write the failing test** — unit: a pure helper `materialResultKind(data)` in `lib/learnMaterial.ts` returns `'set' | 'session' | 'picker'` for the three 201/200 shapes (add to `tests/unit/learn-material.test.ts`). E2E (greenapple project, mock engine): upload `hw.png` → URL becomes `/app/homework/<id>` and the page lists ≥ 1 card; drop zone exists (`hh-dropzone`).
- [ ] **Step 2: Run to verify it fails** — `npx vitest run tests/unit/learn-material.test.ts`.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** unit + `npx playwright test --project=greenapple e2e/greenapple-homework.spec.ts` (the list page lands in Task 13; mark the e2e `test.fixme` until then and un-fixme in Task 13).
- [ ] **Step 5: Commit** — `git commit -m "feat(web): homework upload — drag-and-drop, and a set redirect instead of an inline session"`.

### Task 13: Academy web — problem list page and problem session page

**Files:**
- Create: `apps/web/app/app/homework/[setId]/page.tsx` (server: `requireHomeworkHelpReady()` like `app/app/page.tsx` L31; `notFound()` unless `BRAND.homeworkHelp`; fetch via `getHomeworkSet`), `apps/web/components/homework/HomeworkProblemList.tsx` (client; polls `/api/homework/<id>` every 3 s while `!buildDone`), `apps/web/components/homework/status.ts`, `apps/web/app/app/homework/[setId]/[n]/page.tsx`, `apps/web/components/homework/HomeworkProblemSession.tsx` (client: POST start on mount, then `<EmbeddedSession host="dashboard" embedUrl engineSessionId nodeTitle={`Problem ${n}`} onSessionEnd={() => router.push(list)} />`; 409 → notice "Finish or close your other problem first" with a link back to the list; 429 → the existing exhausted copy)
- Modify: `apps/web/components/HomeworkHelpHome.tsx` (a "Your homework" block: newest 5 sets with "k of N done", link to the list)
- Test: `tests/unit/homework-status.test.ts`, `e2e/greenapple-homework.spec.ts`, `e2e/greenapple-copy.spec.ts` (`PAGES` += `/app/homework/<id>` created in the spec's setup)

**Interfaces:**
- Produces (`status.ts`):
  ```ts
  export type ProblemChip = { label: 'Not started' | 'In progress' | 'Done' | 'Needs review' | 'Still preparing'; tone: 'neutral' | 'brand' | 'good' | 'warn' | 'muted' };
  export function problemChip(p: { build: 'preparing'|'ready'|'unverified'; work: { status: 'not_started'|'in_progress'|'done'|'needs_review' } }): ProblemChip;  // work status wins over build except: build 'preparing' + not_started → 'Still preparing'
  export function setProgressLabel(problems: Array<{ work: { status } }>): string;  // "k of N done"
  export function problemSessionPath(setId: string, n: number): string;
  ```
  Card content: "Problem n", the text (first 240 chars, `InlineMath` via the web's existing math typesetting used in `ReviewRow`), the chip, "Work on this" (disabled with "Preparing…" tooltip only when the student would rather wait — the button is always enabled; a `preparing` problem opens in unverified mode per the spec), a small "No answer check for this one yet" line when `build === 'unverified'`.

- [ ] **Step 1: Write the failing test** — unit table for `problemChip` (5 cases incl. `preparing + in_progress → 'In progress'`) and `setProgressLabel`. E2E: after upload, the list shows N cards; clicking "Work on this" on card 1 lands on `/app/homework/<id>/1` with an iframe whose `src` contains `/tutor-portal/embed?token=`; the browser back/"Back to list" returns to the list; copy sweep passes on the list page.
- [ ] **Step 2: Run to verify it fails.**
- [ ] **Step 3: Implement.** Phone layout: cards full width; the problem page uses `host="dashboard"` heights.
- [ ] **Step 4: Run** unit, `npm run typecheck:web`, the two e2e specs.
- [ ] **Step 5: Commit** — `git commit -m "feat(web): homework set list and per-problem session pages"`.

### Task 14: Academy web — staff Homework sets section

**Files:**
- Create: `apps/web/components/admin/HomeworkSetsTable.tsx`
- Modify: `apps/web/components/admin/TutorStudentView.tsx` (new section after Sessions, HOMEWORK_HELP brand only), `apps/web/lib/admin-students.ts` (types)
- Test: `tests/admin/…` (extend the existing student-detail rendering test if one renders markup; otherwise a unit test on a pure `homeworkSetRows(set)` helper exported from the component file)

**Interfaces:**
- Produces: `HomeworkSetsTable({ sets, studentId })` — one block per set (title, date, "k of N done"); a row per problem: n, text (truncated, math typeset), work-status pill (reuse the `PracticePopover` pill classes), an **Unverified** badge when `!verify.agreed` with a hover/tap popover listing `verify.candidates`, the finals when verified (staff only), and a replay link to `lastSessionId` via `staffReplayPath`.

- [ ] **Step 1: Write the failing test** — `homeworkSetRows` returns `{ n, pill, unverified, candidates, replayHref }` with `unverified === true` and `candidates.length === 2` for the fixture problem; `replayHref` uses `staffReplayPath`.
- [ ] **Step 2–5:** fail → implement → pass (`npm run typecheck:web`) → `git commit -m "feat(web): staff sees homework sets with per-problem status and unverified keys"`.

### Task 15: Local stack wiring and the old flow's exit

**Files:**
- Modify: `/Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh` (nothing structural; confirm `HOMEWORK_PER_PROBLEM` is unset = on), `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct/.env.gac-local` (no change needed; document the flag in `.env.greenapple.production.example` next to `HOMEWORK_HELP`)
- Modify: `apps/api/src/http/routes/core.ts` — nothing further; the whole-sheet path remains reachable only with `HOMEWORK_PER_PROBLEM=off` (kill switch)
- Docs: append the flag and the new routes to `docs/whitelabel/greenapple/integration/live-test-2026-10-16/TEST-CASES.md` as "Session A2 — per-problem homework" (steps: upload worksheet3 → list shows 8 → open #5 → figure correct, labels from sheet → answer `x = 9, y = 18` judged → Done → list shows Done → teacher view shows the set).

- [ ] **Step 1:** Add the env example line and the TEST-CASES section.
- [ ] **Step 2:** `bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh stop && … start` (restart api + engine so new models/routes load); `curl -s localhost:4015/api/homework -H 'authorization: Bearer <token>'` is not scriptable without a token — instead run the academy integration suite once more against the real engine: skip; the manual run is Task 16.
- [ ] **Step 3:** Commit docs in both repos.

### Task 16: Gate, acceptance on the three sheets, deploy

- [ ] **Step 1: Engine gate** — `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/apps/tutor && npm run test:all 2>&1 | tail -30` → only the 2 baseline failures; `npx tsc --noEmit` clean; `npx tsx scripts/gen-system-prompt-hashes.ts` committed if prompts changed.
- [ ] **Step 2: Academy gate** — `cd /Users/luke/Dev/academy/.claude/worktrees/gac-29oct && npm test && npx playwright test --project=greenapple` → green.
- [ ] **Step 3: Acceptance (Praveen, local at http://localhost:3016, GAC test student)** — upload each of `/Users/luke/Downloads/worksheet_clean.png`, `worksheet2_clean.png`, `worksheet3_clean.png`, `worksheet3_photo.jpg`; expected per sheet: list within 35 s; all problems `ready` within 4 min (engine log `[homework-build]` lines show ms/tokens; total cost per sheet ≤ $0.60); every figure accepted by eye against the sheet (the Task 8 harness fixture for ws3 #5 as the reference); open ws3 #1, #5, #6, #8: first sentence ≤ 8 s median (read `first_sentence=` in `[brain.stream]` lines), no turn > 15 s; ws3 #6 `35.4` judged correct, `31.42` judged incorrect; an `unverified` problem never hears "correct"/"incorrect"; teacher view lists the set with statuses. Record results in ISSUES.md round 10.
- [ ] **Step 4: Deploy** — engine: `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct && ./deploy-tutor-gac.sh` (Praveen); academy: the GreenApple deploy script named in memory `project_greenapple_handoff.md` (API + web), after `git push origin gac-29oct` in both repos. Verify `https://session.evelynlearning.com/tutor` build hash and one real upload on the GAC sandbox; tell GAC about the new flow (Praveen's call).

---

## Self-review notes

- Spec §3 flow → Tasks 10, 12, 13; §4 data model → Tasks 1, 9; §5 build → Tasks 2–5; §6 session → Tasks 6–8; §7 teacher → Tasks 11, 14; §9 acceptance → Task 16. Non-goal `highlight_figure` tool from spec §6 is deliberately dropped (the tutor sketches new work on the board; the pre-built figure is never redrawn) — spec §6 to be amended on execution.
- Names used across tasks: `FigureCommand`, `FigureClaim`, `AnswerKey`, `ProblemBuild` (Task 1) ↔ Tasks 2–7; `homeworkProblemOf` (Task 6) ↔ Tasks 7–8; `kickHomeworkBuild` (Task 5) ↔ Task 6 route; `HomeworkBuildStatus` (Task 9) ↔ Task 10 `refreshHomeworkSetBuild`; `problemChip` (Task 13) ↔ Task 14 pills reuse `PracticePopover` classes, not `problemChip`.
- Open risks the executor should raise early: (1) `mongodb-memory-server` availability for engine tests (Task 1 Step 1 fallback); (2) `compareDeterministic`'s exact signature in `key-compare.ts` L236 (adapt `partsAgree` to it, do not fork it); (3) Opus 5.5 build latency per problem (budget 60 s per call; if a sheet exceeds 4 min total, lower `concurrency` is wrong — raise it to 3); (4) the engine's detached build dies on a pm2 restart during deploy — the GET re-kick covers it, but deploy only between test runs.
