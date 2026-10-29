# GAC homework preview-first Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The homework problem page opens as an instant, free preview (text, figure, status) and mints the tutor session only when the student presses "Start tutoring".

**Architecture:** Academy web only. `HomeworkProblemSession` gains a `preview` prop and a `preview` state; the mount effect starts a session only after the Start button bumps `attempt`. A new `HomeworkProblemPreview` component renders what the list already knows (text via `stripFigureDescriptions`, `figureSvg` data-URI image, `problemChip`, prior note). The page passes the problem view.

**Tech Stack:** Next.js app router, React 19, vitest + jsdom (component tests mounted with `createRoot`/`act`, no JSX), Playwright e2e.

**Spec:** `/Users/luke/Dev/evelynlearning/docs/superpowers/specs/2026-10-22-gac-homework-preview-start-design.md`

## Global Constraints

- Academy worktree `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct`, branch `gac-29oct` (HEAD `a342c950`); never the main checkout; never `git stash`; do not touch `.env.gac-local`.
- No engine call before Start: the `/start` POST happens only after the button is pressed.
- Every existing start outcome keeps its notice and test ids: `hw-session-starting`, `hw-session-notice` (`data-reason` busy | checking | exhausted | error), `hw-back-to-list`; Try again on `error`/`checking` re-runs the start.
- "Back to list" from the preview is a plain link to `homeworkSetPath(setId)` (no pause, no end call); while a session is active it stays the pause button.
- Figure image: the same data-URI pattern as `HomeworkProblemList` (`data:image/svg+xml;utf8,` + `encodeURIComponent(figureSvg)`), `alt="Figure for problem n"`, `data-testid="hw-preview-figure"`; no SVG yet → the list's "Figure ready" / "Drawing the figure…" wording via `hasFigureDescription`.
- Commit trailer: `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01Q4Nu3g3ap8MJQvqRcbiozq`.

## Review Focus

1. Strict-mode double mount must not start a session (preview mounts twice in dev; `attempt` stays 0) — Task 1 test.
2. A `checking` card opened directly by URL: preview renders, Start → 409 `checking` → notice with Try again — Task 1 test.
3. Browser back from the preview posts nothing (`activeSessionId` null) — Task 1 test asserts no fetch at all without Start.
4. Prior-work note shown only when present; text with no `[Figure: …]` block renders unchanged — Task 1 test.
5. The e2e flow presses Start before waiting for the session — Task 2.

---

### Task 1: Preview state + component + unit tests

**Files:**
- Create: `apps/web/components/homework/HomeworkProblemPreview.tsx`
- Modify: `apps/web/components/homework/HomeworkProblemSession.tsx` (State union, mount effect ~line 92, `body()`, `back`)
- Modify: `apps/web/app/app/homework/[setId]/[n]/page.tsx` (pass the problem view)
- Test: `tests/unit/homework-problem-session.test.ts` (new; mirror `tests/unit/homework-problem-list-refresh.test.ts`: `// @vitest-environment jsdom`, `vi.mock('next/link')`, `vi.mock('next/navigation', () => ({ useRouter: () => ({ push, refresh, prefetch }) }))`, `vi.mock('@/components/EmbeddedSession', …)` rendering a stub `<div data-testid="embedded-session">`, `vi.stubGlobal('fetch', fetchMock)`)

**Interfaces:**
- Produces: `export interface HomeworkProblemPreviewData { n: number; text: string; figureSvg?: string; hasFigure: boolean; build: string; work: { status: string; priorNote?: string } }`; `export function HomeworkProblemPreview({ problem, starting, onStart }: { problem: HomeworkProblemPreviewData; starting: boolean; onStart: () => void })` — root `data-testid="hw-problem-preview"`, button `data-testid="hw-start-tutoring"` (label `Start tutoring`, `Opening Problem {n}…` + `disabled` while `starting`), chip via `problemChip({ build, work })` rendered with the list's chip classes, text via `stripFigureDescriptions`, prior note under a small "Where you left off" heading only when non-empty.
- `HomeworkProblemSession` props gain `preview: HomeworkProblemPreviewData`; `State` gains `{ status: 'preview' }` (initial) — `starting` is reached only through Start / Try again; the mount effect returns early while `attempt === 0`.

- [ ] **Step 1: Write the failing tests** (`tests/unit/homework-problem-session.test.ts`): (a) mounts in preview: `hw-problem-preview` present, text stripped of the figure block, `hw-preview-figure` src starts with `data:image/svg+xml;utf8,`, chip text "Not started", `fetchMock` never called, `hw-back-to-list` is an `<a>` to `/app/homework/set1`; (b) Start → button disabled and reads `Opening Problem 1…`, fetch called once with `POST /api/homework/set1/problems/1/start`; a 201 `{ engineSessionId: 'e1', embed: { embedUrl: 'u' } }` → `embedded-session` mounted and `hw-problem-preview` gone; (c) Start → 409 `{ error: { code: 'checking' } }` → `hw-session-notice[data-reason=checking]` with Try again; Try again → second fetch; (d) a problem with `priorNote` shows it; one without shows no "Where you left off"; (e) re-mounting the component twice (unmount + mount) without Start never fetches.
- [ ] **Step 2: Run** `cd /Users/luke/Dev/academy/.claude/worktrees/gac-29oct && npx vitest run tests/unit/homework-problem-session.test.ts` — FAIL (no preview, fetch on mount).
- [ ] **Step 3: Implement** per Interfaces. The page: `const problem = set.problems.find((p) => p.n === n)!;` → `preview={{ n, text: problem.text, figureSvg: problem.figureSvg, hasFigure: problem.hasFigure, build: problem.build, work: { status: problem.work.status, priorNote: problem.work.priorNote } }}` (check the `HomeworkProblemView` shape in `apps/web/lib/homework.ts` and the student view in the api for `priorNote`; if the view does not carry `priorNote`, add it to `studentView` in `apps/api/src/http/routes/homework.ts` + the view type — it is already stored on `work.priorNote`). Update the page's doc comment (it says the engine shows the problem; now the preview does first).
- [ ] **Step 4: Run** the test file (pass), `npx vitest run tests/unit/homework-problem-list-refresh.test.ts tests/unit/homework-status.test.ts` (unchanged, pass), `npm run typecheck`.
- [ ] **Step 5: Commit** `feat(web): a homework problem opens as a preview; Start tutoring mints the session`.

### Task 2: e2e flow presses Start

**Files:**
- Modify: `e2e/greenapple-homework.spec.ts` (~lines 277–360: the "Work on this opens problem 1; back to list" test and any later step that assumes the session opens on navigation)

- [ ] **Step 1:** After "Work on this", assert `hw-problem-preview` is visible and `hw-start-tutoring` enabled; click it; then the existing waits for the session. Back to list from the preview (before Start) must return to the list without any `checking` chip.
- [ ] **Step 2: Run** the spec the way the repo runs e2e for greenapple (see `package.json` scripts / `playwright.config`; if it needs the local stack on :3016, run it against it — it is up; if the spec cannot run here, say so in the report and leave the edits reviewed by reading).
- [ ] **Step 3: Commit** `test(e2e): homework problem preview then Start tutoring`.
