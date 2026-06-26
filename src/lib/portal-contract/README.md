# Evelyn Tutor Engine — Portal Contract & API (v1)

The engine is the **system of record for pedagogical state** (mastery, gaps,
notes), keyed by an application-controlled `studentId`. An external **portal**
owns student identity/profile and reads pedagogical state back through a new,
authenticated, additive API. This document is the integration reference.

> **Rule 0 (non-disruption):** everything here is additive. No existing
> collection field was renamed, removed, or made required; the existing
> internal `?studentId=` session flow, `/api/tutor/**` routes, `src/middleware.ts`,
> and the orchestrator were **not modified**. New schema fields are optional and
> migration-free (profile `preferences`/`gaps` and topic-notes overlays are
> stored as Mongoose `Mixed`; `ProblemBank` gained optional `loId?`/`topicId?`/
> `cedCode?` + one new sparse index; `CanonicalConcept` is a brand-new collection).

## The v1 contract

In-repo module `src/lib/portal-contract/v1` (importable now; designed to be
lifted into a standalone `@evelyn/portal-contract` package later). Exports
**zod schemas** (canonical validators) and **TypeScript types** (derived via
`z.infer`). `types.ts` carries compile-time drift guards: if an engine
interface stops being assignable to its contract mirror, the build fails.

Key shapes (mirror the real engine):
- `StudentContext` (portal → engine): `studentId`, `isTrial`, `courseId`,
  `profile{name,grade,locale?,curriculum?}`, `preferences{humorCeiling?, pacing?,
  modality?, tone?, interests?, socialMemoryLevel('off'|'light'|'warm', default
  'off')}`, `socialMemory?: SocialThread[]`, `target` (lessonNode | freestyle),
  `sessionConfig{voiceEngine}`.
- `SessionResult` (engine → portal; also a checkpoint via `status:'in_progress'`):
  `milestone`, `notesTouched`, `learningStateDelta{gaps{new,promoted,resolved},
  mastery}`, optional `socialMemoryDelta`, `renderedArtifacts{quizzes,conceptMaps}`,
  `transcriptRef?`, `pdfRef?`.
- Reads: `NotesRead` (= `RenderedTopicNotes`), `GapsRead` (= `GapEntry[]`),
  `MasteryRead` (= `Record<loId, MasteryEntry>`).
- `RetrievePracticeRequest`/`Response`, `GradeFreeResponseRequest`/`Response`,
  `FrqRubric`, `ShowQuizPayload`, `ShowConceptMapPayload`,
  `SessionEmitRequest` (the emitter's input).

Flashcards are intentionally **omitted from v1** (the engine has no flashcard
pipeline yet); they will be added in a minor bump when that pipeline lands.

Versioning: a breaking change ⇒ new `v2/` sibling folder; v1 stays frozen.

## Auth model (service-to-service, signed requests)

All `/api/portal/v1/**` endpoints are wrapped with `withPortalAuth`
(`src/lib/tutor/portal/auth.ts`). Every request carries three headers:

| header | meaning |
| --- | --- |
| `x-evelyn-partner` | partner id (selects the shared secret) |
| `x-evelyn-timestamp` | unix epoch ms |
| `x-evelyn-signature` | hex HMAC-SHA256 over the canonical signing string |

Signing string (built identically on both ends — see
`src/lib/portal-contract/auth.ts`):

```
`${timestamp}.${METHOD}.${pathname+search}.${rawBody}`
```

The signature binds method + path + **query** + body, so a captured signature
cannot be replayed against a different endpoint or with a swapped `studentId`;
the ±5-minute timestamp window bounds replay of the same request. Verification
is constant-time. Secrets resolve from env: a JSON map
`PORTAL_PARTNER_SECRETS='{"portalA":"…"}'`, or a single default via
`PORTAL_PARTNER_ID` + `PORTAL_API_SECRET`.

> Body-bound HMAC cannot be verified in Next.js edge middleware (the body is
> not readable there), so verification lives in the route wrapper, not
> `src/middleware.ts`.

**Isolation:** every endpoint scopes data access to the `studentId` in its
verified request; there is no listing/enumeration endpoint, so a partner can
only read the exact student it names — and it cannot tamper that id without
breaking the signature.

## Portal API surface

| method | path | purpose |
| --- | --- | --- |
| POST | `/api/portal/v1/context` | ingest `StudentContext`: persist preferences + **interests** (first-class) + `socialMemoryLevel`; read `socialMemory` transiently |
| GET | `/api/portal/v1/notes?studentId=&baselineId=` | resolved topic notes (`resolveTopicNotes`, incl. `sourceGapId`) |
| GET | `/api/portal/v1/gaps?studentId=` | staleness-filtered gaps |
| GET | `/api/portal/v1/mastery?studentId=&courseId=` | per-LO mastery map |
| POST | `/api/portal/v1/practice` | LO/topic-scoped practice retrieval (plan try-yourselves + LO-tagged bank) |
| POST | `/api/portal/v1/grade` | FRQ grading (rubric part-by-part, else legacy single-answer judge) |
| POST | `/api/portal/v1/session-result` | commit session deltas + run Phase-3 passes → `SessionResult`; idempotent on `sessionId`; `status:'in_progress'` = checkpoint snapshot |

All reuse existing engine functions (`resolveTopicNotes`,
`getOrCreateStudentProfile`, `updateStudentPreferences`, `applyMasteryDeltas`,
`recordGap`, `resolveSettledGaps`, `appendSessionMemory`, …).

## Social/rapport memory — transient pass-through

The engine **produces and consumes** social memory but **never persists** it.
- `socialMemoryLevel` is a stored **dial/ceiling** (like `humorCeiling`),
  min-clamped, default `off`.
- `socialMemory` **threads** flow IN on `StudentContext` for the session only;
  the engine suggests a `socialMemoryDelta` OUT on `SessionResult` for the
  portal to store. Threads are **never** written to `mastery`/`gaps`/notes.
- v1 emits an absent `socialMemoryDelta` (the field is frozen in the contract
  so the portal integrates now; the behavior ships in Phase 2).
- Storage, retention, deletion, and parental controls live on the **portal**.

## The four fixes (Phase 3)

- **(a)** `reconcile-gap-links.ts` — idempotent session-end backfill of overlay
  `sourceGapId` (expansion↔lo gaps by `loId`; prereq-refresher↔prereq gaps by
  `conceptLabel`); runs from the session-result emitter only.
- **(b)** `concept-registry/normalizer.ts` + `CanonicalConcept` model — async,
  off the hot path: embed `conceptLabel` (1536-d), cosine-merge ≥ 0.85 else
  create; plus `resolveSettledPrereqGaps` mirroring LO-gap resolution
  (reversible via the existing `recordGap` reopen path).
- **(c)** `ProblemBank.loId?/topicId?/cedCode?` + sparse `{loId,difficulty}`
  index + `practice.ts` LO-matched retrieval (join key = `los[].id`).
- **(d)** `FrqRubric` + `grade-free-response.ts` — part-by-part rubric grading
  with a legacy single-answer fallback.

## AP-Statistics CED policy

`los[].standard` is a **required, validated** CED companion on every AP-Stats
plan LO. Accepted forms: single topic `AP-STATS-1.10`, range `AP-STATS-1.1-1.4`,
FRQ marker `AP-STATS-1-FRQ`. Generated content is tagged at the most-specific
single-topic level (`isSingleTopicApStatsCed`). All 48 existing plans pass the
audit (`npm run test:portal-ced`, a permanent regression guard).

## Tests

`npm run test:portal` runs the whole suite (contract conformance, auth &
isolation, the four fixes, CED audit, endpoint integration). Each is a
standalone `ts-node` script (the repo convention) with `node:assert`.

## Left untouched (Rule 0)

Internal `/api/tutor/**` routes, `src/middleware.ts`, `VoiceTutorRealtime.tsx`
orchestrator, brain tool behavior, and all existing collection schemas (beyond
the optional additive fields noted above). Existing test suites pass unchanged.
