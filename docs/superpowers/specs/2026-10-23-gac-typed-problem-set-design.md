# GAC — a typed PROBLEM becomes a one-problem homework set (A1)

Owner: Praveen. Approved as item A1 in `docs/superpowers/plans/2026-10-23-gac-next-session-handoff.md` ("ok to everything").

## Why

Today "Ask a question" with a typed problem ("Solve 2x + 3 = 11", a word problem, a long pasted question) takes the old homework-help plan path: the engine splits the text with the Haiku 4.5 splitter and the tutor derives everything live. There is no two-solve verified key, no solution path, no pre-built figure, no preview page and no entry in "Your homework". Uploaded sheets get all of that. A typed problem should get the same quality as an uploaded one.

## Goals

- A typed problem on the homework brand is built exactly like an uploaded one: a `HomeworkSet` whose problems go through the engine's homework build (two-solve key + steps + figure when the text describes one).
- The student lands on the problem's preview page ("Start tutoring"), not in a live session.
- The set shows up in "Your homework" so the student can come back to it.

## Non-goals

- No engine change. The engine's plan-generate already decides "is this a problem" for typed text (`typedHomeworkIsOwnMaterial` + `typedHomeworkPlanDecision`) and returns `kind: 'homework-help'` with `problems`. The build route works from any plan with homework problems and its figure step drafts from the problem text.
- Typed TOPICS ("quadratic equations") keep the lesson path unchanged: the engine returns a normal plan for them, so no set is made.
- Other brands are unchanged (everything is behind `HOMEWORK_HELP=1`).

## Anti-goals

- A typed topic must never become a set.
- A transport failure of plan-generate must still fall back to the planless session, never to an error.

## The change (academy only)

1. **`POST /learn/start`** (`apps/api/src/http/routes/core.ts`): after `generatePlan`, when `HOMEWORK_HELP === '1'`, `HOMEWORK_PER_PROBLEM !== 'off'`, `HOMEWORK_TYPED_SET !== 'off'`, and the response is `kind: 'homework-help'` with at least one problem, create the set with `createHomeworkSetFromPlan` (title = the typed text, course = the derived container) and return `201 { homeworkSetId, problems, topic, courseKey, courseTitle, generatedPlanId }` — the same shape the upload path returns. No session, no lock, no `startFreeformSession`. Records `recordHomeworkHelp` kind `'ask'` with `sessionId: set:<id>`.
2. **`POST /learn/material` with no files** (the Ask box sends text over 300 characters here as `paste`; the Upload modal can also send paste only): the existing per-problem branch drops its `files.length > 0` condition when `HOMEWORK_TYPED_SET !== 'off'`. Uploads are unchanged. Integration test (v-b), which pinned the old whole-sheet session for a paste, flips.
3. **Web** (`DashboardTopicSearch.tsx` + `LearnMaterialModal`'s `onSetCreated` handler): a `201` carrying `homeworkSetId` navigates to the preview page `/app/homework/<id>/1` when the set has one problem, else to the set list `/app/homework/<id>`. A pure helper decides the path so it is unit-tested.
4. **Kill switch** `HOMEWORK_TYPED_SET` — default ON (`!== 'off'`, per the flag rule). `off` restores today's behaviour on both routes.

## Calls I made (check these)

- **Multi-problem typed text becomes a set of N, not one problem.** If the student types two problems, the engine splits them; a 2-problem set is the natural result. One-problem sets open the preview directly; N-problem sets open the list.
- **Billing: a typed set is billed like an upload** — 1 tutoring minute per problem at build completion (`chargeHomeworkBuild` already runs for every set). The build costs the same money either way. Turning this off for typed sets would need a marker on the set; say so if you want it.
- **Paste-only Upload-modal submissions count as typed** and become sets too, since the text is the student's own problem either way.
- **The `TopicOutline` "continue this topic" steering is skipped for a set** (it only applies to lesson plans; the engine ignores it for homework plans anyway).
- **Dropped-request recovery** (`failOrRecover`) looks for a session under the typed topic; a set is not found by it. The set still appears in "Your homework", so a dropped response loses nothing but the redirect. Not fixed here.

- **The engine's verdict defines "problem".** `typedHomeworkIsOwnMaterial` is permissive on purpose (text is a problem unless it is unmistakably a bare topic). A misjudged topic now becomes a saved, billed set instead of a homework-flavoured session. No academy-side second guess; the engine already treats that text as homework today.
- **Paste keeps its current engine path.** Paste goes to the engine as a material, so it is split like an upload and skips the typed "student's own words" grounding. That is today's behaviour for the whole-sheet session too; the set only reuses the split.
- **No household learner on a set.** `HomeworkSet` has no `learnerId`; uploads already behave this way. GAC has no household learners.

## Left to the builder

- Exact test fixtures (the mock engine already splits typed `text` into problems under `goal: 'homework-help'`; existing /learn/start homework tests that expect a session may need a topic-shaped input or the switch off).

## Testing

- Integration (academy `tests/integration/homework-set.test.ts`): typed problem on /learn/start → set + no session + no lock; typed topic → session as before; `HOMEWORK_TYPED_SET=off` → session as before; paste-only /learn/material → set (v-b flipped); plan-generate 500 → planless session.
- Unit: the web path helper (one problem → preview, N → list).
- Live (minimum, local stack, after the gate): one typed problem with a described figure → preview shows the figure, key + steps present in `homeworkbuilds`.
