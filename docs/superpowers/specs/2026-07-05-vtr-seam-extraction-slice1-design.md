# VoiceTutorRealtime Seam Extraction — Slice 1 (module-level purities) — Design

**Date:** 2026-07-05
**Status:** Approved
**Queue:** User-ordered fixes queue 2026-07-04, item 5 (final item). Standing
guidance: INCREMENTAL seam-extraction ONLY, never a rewrite; the tangled
stateful realtime/perception core stays untouched (load-bearing guardrails,
no audio/timing test net).

## Goal

Shrink `VoiceTutorRealtime.tsx` (13,038 lines) by extracting its
module-level PURE material (~850 lines above the component) into focused
modules under `src/lib/tutor/orchestrator/`, with characterization tests
pinning behavior across the move. Zero component-body changes.

## What moves (pure relocations, verbatim code)

| New module | Contents (exact top-level declarations) |
|---|---|
| `src/lib/tutor/orchestrator/flags.ts` | `TUTOR_BRAIN_FAST_OPENER`, `TUTOR_SKIP_DETERMINISTIC`, `TUTOR_RENDER_SYNC`, `TUTOR_STUDENT_MARKS`, `TUTOR_BOARD_ANCHOR_ASSIST`, `TUTOR_SKETCH`, `TUTOR_RESUME_FROM_CLAUSE`, `TUTOR_PEDAGOGY_OPENER`, `TUTOR_VALIDATE_BEFORE_SPEAK`, `TUTOR_KEEP_VALIDATED_ON_KILL`, `TUTOR_WOLFRAM_MATH_CHECK`, `TUTOR_STUDENT_PROBLEM_GROUNDING` + tuning consts `TOPIC_NOTES_WARMUP_SEGMENTS`, `TOPIC_NOTES_RATE_LIMITS`, `BOARD_RENDER_META_ACTIONS`, `SKETCH_TIMEOUT_MS`, `RENDER_SYNC_STALL_MS`, `RENDER_SYNC_FRONT_LOAD_MAX_ANCHOR`, `VALIDATE_BEFORE_SPEAK_CAP_MS` (each keeping its full doc comment; NEXT_PUBLIC_ inlining works in any module — these are build-time substitutions) |
| `src/lib/tutor/orchestrator/text-heuristics.ts` | `WHITEBOARD_INTENT_PATTERNS`, `MATH_CONTENT_PATTERN`, `rendersStudentProblem`, `WORK_INTENT_RE`, `detectStudentBroughtProblem`, `isSafeOpener`, `JUDGE_KILL_STOPWORDS`, `judgeKillContentWords`, `judgeKillNumericTokens`, `isJudgeKillRestatement`, `extractSentence1Normalized`, `deepEqualParams`, `isMuteMeCommand` |
| `src/lib/tutor/orchestrator/ink-capture.ts` | `rasterizeGestureStrokes`, `sanitizeInkOcrText` |
| `src/lib/tutor/orchestrator/format-lesson-plan.ts` | `formatLessonPlanForRealtime` |
| `src/lib/tutor/orchestrator/types.ts` | `RealtimeHandle`, `TutorMilestone`, `TutorResumeState` |

`VoiceTutorRealtime.tsx` imports everything back and RE-EXPORTS the public
surface (`RealtimeHandle`, `TutorMilestone`, `TutorResumeState`,
`isMuteMeCommand`, `VoiceTutorRealtime` itself) so no existing importer
changes. Anything above that turns out to close over component scope or
JSX stays put (expected: none — verify during extraction).

## What explicitly stays

The entire component body (lines ~931+): stream loop, kill/retry,
perception, render-sync, caption-sync, marks transport, all refs/effects.
Also `WHITEBOARD_INTENT_PATTERNS` consumers etc. keep identical call sites
— only import paths change inside VTR.

## Safety net

1. **Characterization tests BEFORE the swap**: new
   `scripts/test-orchestrator-helpers.ts` (`npm run
   test:orchestrator-helpers`) pins current behavior of the trickiest
   heuristics — `isJudgeKillRestatement` (restatement vs diverged vs
   numeric-token mismatch), `isSafeOpener` (safe runway vs substantive),
   `detectStudentBroughtProblem` (brought vs authored-echo vs work-intent),
   `isMuteMeCommand`, `extractSentence1Normalized`, `deepEqualParams` —
   with expected values derived from the CURRENT code before any move.
2. Extraction is verbatim copy; the VTR swap deletes originals + adds
   imports/re-exports in the same commit the tests already guard.
3. Gate: `npx tsc --noEmit` + ALL suites (student-marks 44, caption-sync
   22, render-sync 22, recordings 43, orchestrator-helpers new) + `git
   diff` sanity: VTR shrinks ~850 lines, component body byte-identical.

## Later slices (mapped, out of scope)

Whiteboard-command dispatch table; brain-POST body assembly; kill/resume
text machinery; each its own session against the core's ref web.
