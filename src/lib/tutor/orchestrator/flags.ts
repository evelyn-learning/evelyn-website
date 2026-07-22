/**
 * Extracted verbatim from VoiceTutorRealtime.tsx (seam-extraction slice 1,
 * 2026-07-05). Pure module — no component state.
 *
 * Feature flags + tuning constants read at module scope. NEXT_PUBLIC_
 * inlining works in any module — these are build-time substitutions.
 */
import { isPedagogyOpenerFlagValue } from '@/lib/tutor/ai/opening-behavior';

// ─── Topic-notes orchestrator guardrails ───
// Brain may emit expand_topic_notes_theory / add_topic_notes_method /
// add_topic_notes_pointer at segment boundaries. The orchestrator gates
// per the Q7+Q8 design in project_topic_notes_initiative.md:
//   - 3-segment warmup before tools become eligible (silent-drop earlier)
//   - per-session caps per bucket (silent-drop over-firing)
//   - active-topic binding (baselineId = current planId; brain doesn't choose)
//   - async fire-and-forget PATCH; failures log-only
// Dedup against baseline + existing overlays lives in apply-overlay.ts;
// the orchestrator just routes.
// Lowered 3 → 1 for v1 calibration: with the 3-segment gate, short test
// sessions never cleared warmup before ending, leaving the brain unable
// to fire even once. 1 lets the brain start adding notes after the
// student has shown any engagement at all (post-hook segment). Re-tune
// from telemetry once we see real over-firing patterns.
export const TOPIC_NOTES_WARMUP_SEGMENTS = 1;
export const TOPIC_NOTES_RATE_LIMITS = { theory: 5, methods: 3, pointers: 5 } as const;

// ── Latency levers (2026-05-22 claude-brain first-audio session) ──────
// Both default OFF — absent env var ⇒ false ⇒ pre-fix behavior.
//
// FIX A — fast opener. When on, the brain is prompted (system-prompt-
// builder TURN_OPENER_RULE) to begin every turn with a short content-free
// runway sentence, and the orchestrator voices that sentence-0 immediately
// (bypassing the TTS gate) while keeping the gate on sentences 1+. Drops
// first-audio latency to ~Claude-TTFT without ever voicing doomed content.
export const TUTOR_BRAIN_FAST_OPENER =
  process.env.NEXT_PUBLIC_TUTOR_BRAIN_FAST_OPENER === 'true';
// FIX B — deterministic Skip-button advance. When on, a Skip-ahead button
// click is resolved app-side (resolveAdvanceTarget) before the brain call;
// the brain is handed the advance as a FACT, deleting the Skip-button-KILL
// retry for the resolvable case.
export const TUTOR_SKIP_DETERMINISTIC =
  process.env.NEXT_PUBLIC_TUTOR_SKIP_DETERMINISTIC === 'true';
// Render↔speech sync (2026-06-19): defer each whiteboard render so it
// surfaces on the board in sync with the sentence that introduces it,
// instead of popping the instant the brain's tool-call frame is parsed
// (TTS lags, so renders otherwise beat their narration). Default ON;
// flip to 'off' for an instant, code-free rollback to immediate dispatch.
// claude-brain-mode only by construction. See
// project_tutor_render_speech_sync.
export const TUTOR_RENDER_SYNC =
  process.env.NEXT_PUBLIC_TUTOR_RENDER_SYNC !== 'off';
// Student whiteboard marks (Phase 1, 2026-07-05): tap-to-point. Default
// OFF — new student-facing input surface. See student-marks design spec.
export const TUTOR_STUDENT_MARKS =
  process.env.NEXT_PUBLIC_TUTOR_STUDENT_MARKS === 'true';
// Board-anchor structural assists (re-anchor a front-loaded equation/figure to
// its introducing sentence; auto-write a transformation "A → B" arrow when the
// tutor narrates one with no board anchor that turn). Client-side, DEFAULT OFF
// — opt in with NEXT_PUBLIC_TUTOR_BOARD_ANCHOR_ASSIST=on. Both lean on the pure
// board-anchor-assist helpers. See project_tutor_board_anchored_speech.
export const TUTOR_BOARD_ANCHOR_ASSIST =
  process.env.NEXT_PUBLIC_TUTOR_BOARD_ANCHOR_ASSIST === 'on'
  || process.env.NEXT_PUBLIC_TUTOR_BOARD_ANCHOR_ASSIST === 'true';
// Tutor sketch capability (client side): gates the detectAnalogy → show_sketch
// AUTO-FIRE. The brain-emitted show_sketch path is gated server-side by the
// TUTOR_SKETCH tool flag instead (no tool → no call). Client default OFF — opt
// in with NEXT_PUBLIC_TUTOR_SKETCH=on. See project_tutor_sketch_capability.
export const TUTOR_SKETCH =
  process.env.NEXT_PUBLIC_TUTOR_SKETCH === 'on'
  || process.env.NEXT_PUBLIC_TUTOR_SKETCH === 'true';
// Resume-from-cut granularity (P5): on a confirmed-noise mid-sentence pause,
// resume from the CLAUSE the cut landed in instead of re-speaking the whole
// sentence. Client-side, DEFAULT OFF. See resume-from-cut + project_tutor_work_queue.
export const TUTOR_RESUME_FROM_CLAUSE =
  process.env.NEXT_PUBLIC_TUTOR_RESUME_FROM_CLAUSE === 'on'
  || process.env.NEXT_PUBLIC_TUTOR_RESUME_FROM_CLAUSE === 'true';
// Noise-nagging tutor reaction (2026-07-05, fixes-queue-v2 item 2): after
// repeated perception noise-cancels (3 in 3 min), the tutor kindly suggests
// reducing background noise or muting + typing, once per session. Default ON;
// NEXT_PUBLIC_TUTOR_NOISE_NAG=off is the kill switch. Pure counter in
// src/lib/tutor/voice/tutor-reactions.ts (test:tutor-reactions).
export const TUTOR_NOISE_NAG =
  process.env.NEXT_PUBLIC_TUTOR_NOISE_NAG !== 'off';
// Task B2 — proactive opener wiring (orchestrator). Client-side, DEFAULT OFF.
// When on, the mount-time buildSystemPrompt call additionally passes the B4/B5
// opener/self-report context fields (sessionMode/openingPhase/entryMode/
// isReturning/selfReportRouting), computed from resolveOpeningBehavior +
// assembleOpeningInput (opening-behavior.ts). When off, that call is passed
// EXACTLY as before — no new fields, byte-identical prompt. See
// project_tutor_pedagogy_opener_calibration + .superpowers/sdd/task-B2-brief.md.
export const TUTOR_PEDAGOGY_OPENER = isPedagogyOpenerFlagValue(process.env.NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER);
// A command that paints teaching content on the board (vs meta nav like
// newPage / scrollTo / goToPage). Used by the board-anchor-assist fallback to
// tell whether the brain drew anything this turn.
export const BOARD_RENDER_META_ACTIONS = new Set(['newPage', 'goToPage', 'openPage', 'scrollTo', 'clear']);
// Hard cap on doodler latency before fail-to-nothing. Set above the observed
// Haiku tail (2–6s; the larger 4-shot prompt pushed it up) so the slow tail
// renders instead of dropping — the stranding fix flushes a late/stale resolve
// gracefully (drainAll), so a slightly-late doodle lands in context rather than
// being lost. Past this the sketch is dropped (fail-to-nothing).
export const SKETCH_TIMEOUT_MS = 7000;
// Render-buffer STALL window. A SINGLE shared timer, reset on every
// playback-progress signal (sentence-start / drain) and on each buffer
// add. It fires only when NO progress has happened for this long — a
// genuine stall — at which point the whole buffer is released (narration
// isn't coming). This is the key correction from the first live test
// (2026-06-19, Console5): a short per-render cap RACED the legitimately-
// pending anchor — TTS is slow (2-3s/sentence) so a render buffered early
// whose introducing sentence plays 10-20s later hit the cap and popped
// BEFORE its narration. Reset-on-progress means the cap can't fire while
// sentences are steadily playing toward the anchor; it's now a true
// stall-safety + thin-turn anti-pile, never a routine racer. Sized to
// comfortably exceed one long TTS sentence (~3-5s) + slack.
export const RENDER_SYNC_STALL_MS = 6000;
// Board-anchor re-anchor: only a render emitted at the FRONT of the turn (anchor
// ≤ this) is a front-load candidate. The content-free turn-opener occupies
// sentence 0, so a front-loaded equation/figure lands at anchor 1, not 0 — the
// original anchor===0 gate never fired (observed 2026-06-22 ear-test, Console4).
// Bounded so mid-turn step renders (anchor ≥ 2) are never held/delayed.
export const RENDER_SYNC_FRONT_LOAD_MAX_ANCHOR = 1;
// Turn-length cap (2026-07-15, round-7 design, user-approved). Two layers,
// both about UNANCHORED MONOLOGUE cadence — deliberately not a content cap,
// so it's subject-agnostic (essay walkthroughs anchor excerpts on the board
// the way proofs anchor equations; languages are short-turn dialogic anyway):
//  1. prompt rule (voice-cadence.ts): ≤ TURN_CAP_SOFT_SENTENCES in a row
//     without a board anchor or a hand-back;
//  2. next-turn corrective (VoiceTutorRealtime turn-ok site): a turn over
//     TURN_CAP_HARD_SENTENCES with ZERO whiteboard actions plants a
//     [cadence note] that rides into the next brain call. Post-stream retry
//     would re-narrate a turn the student already heard — hence next-turn.
// Per-turn `turn_length` telemetry always emits for per-subject tuning.
export const TUTOR_TURN_CAP = process.env.NEXT_PUBLIC_TUTOR_TURN_CAP !== 'off';
export const TURN_CAP_SOFT_SENTENCES = 4;
export const TURN_CAP_HARD_SENTENCES = 8;
// Word-budget corrective (2026-07-15, part 2 of the verbosity round — see
// Precision rule in system-prompt-builder.ts, part 1). Sibling trigger to
// TURN_CAP_HARD_SENTENCES: a turn can stay under the sentence cap while
// still running long via wordy individual sentences (stacked restatement),
// so this is a second, independent corrective — NOT a content cap. Same
// next-turn enforcement point as the sentence cap (post-stream; retry
// would re-narrate a turn the student already heard).
export const TURN_CAP_WORDS = 110;
// Sustained-energy barge-in gate (2026-07-15, echo fix layer 1 — Task V1).
// ROOT CAUSE (session portal-81f2b582): the tutor's own TTS echoes into the
// mic, the perception VAD fires speech_started, and the stage-3 kill aborts
// the tutor mid-sentence on its OWN echo. Echo bursts are SHORT and correlated
// with playback; a genuine student barge-in is SUSTAINED. So DURING 'speaking'
// ONLY, the kill is withheld until mic energy stays above BARGEIN_ENERGY_
// THRESHOLD continuously for BARGEIN_SUSTAIN_MS. Every other production state
// keeps today's INSTANT kill (latency added only during TTS). Pure decision in
// src/lib/tutor/voice/bargein-gate.ts (test:bargein-gate). V2/V3 add the
// transcript self-voice classification layer on top; this is only the gate.
//   - SUSTAIN_MS: the added latency a real barge-in pays during TTS. Sized so a
//     "wait, stop" clears it easily while short echo bursts never do. Kept ≤ the
//     ~500ms global barge-in budget. Worst-case genuine-barge-in latency =
//     sustain + ~85ms start-frame quantization + ~50ms poll granularity ≈ 485ms,
//     which holds the ≤500ms budget (at 400 it was ~535ms).
//   - ENERGY_THRESHOLD: operates on the SCALED 0..1 "being heard" mic level
//     usePerceptionWS emits (onMicLevel = min(1, rms*6)); normal speech lands
//     mid-range (~0.5), calm ambient near 0. Set clear of the ambient floor.
//   - GATE_POLL_MS: how often the wiring re-evaluates the growing energy window
//     while a speaking-onset waits out the sustain window.
//   - GATE_MAX_MS: safety cap so a pending gate never leaks a live interval if
//     speech_stopped / a state change is somehow missed.
export const BARGEIN_SUSTAIN_MS = 350;
// Phase 2 (humanlike-latency plan): acknowledgment micro-turn — a neutral
// "thinking" phrase ~450ms after turn.end iff brain sentence-0 hasn't
// arrived. Default OFF; enable per env.
export const TUTOR_ACK_LAYER =
  process.env.NEXT_PUBLIC_TUTOR_ACK_LAYER === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_ACK_LAYER === 'true';

// Task 1.1 (humanlike-latency plan): stream the cold first sentence's
// Cartesia audio — start playback at ~0.4s of PCM instead of waiting for
// full-sentence synthesis. Default OFF; enable per env.
export const TUTOR_TTS_STREAM_HEAD =
  process.env.NEXT_PUBLIC_TUTOR_TTS_STREAM_HEAD === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_TTS_STREAM_HEAD === 'true';
// 0.4s at the pipeline's hardcoded 24kHz playback rate.
export const TTS_STREAM_HEAD_SAMPLES = 9_600;
// Follow-chunk window (0.5s). Live round 2026-07-22: a single monolithic
// tail gapped audibly at the head boundary (it waited for the WHOLE
// remainder to synthesize); pumping ~0.5s windows pipelines playback
// against synthesis.
export const TTS_STREAM_FOLLOW_SAMPLES = 12_000;
// A tail this late means the stream is wedged — end the sentence early
// (truncation, flag-revertible) rather than holding the turn open forever.
export const TTS_STREAM_TAIL_TIMEOUT_MS = 15_000;
// Opening-turn barge-in sustain (2026-07-22 live: blanket suppression made
// first-turn interruption impossible — student spoke 12s over the opener,
// unheard, in two sessions). Tuning history: 2500ms ("keeps talking over
// me", round 3) → 900ms (still read as not-fixed, round 4) → aligned with
// the production-proven mid-lesson BARGEIN_SUSTAIN_MS (350ms; echo blips
// measure ~264ms and disarm on speech_stopped). The 2026-07-04 phantom
// class this guard exists for was TRANSCRIPT-driven retro-cancels, which
// remain fully suppressed during the opener regardless of this value.
export const OPENER_BARGEIN_SUSTAIN_MS = 350;
export const BARGEIN_ENERGY_THRESHOLD = 0.15;
export const BARGEIN_GATE_POLL_MS = 50;
export const BARGEIN_GATE_MAX_MS = 5000;
// Validate-before-speak (Pillar 2 of the robustness track,
// project_tutor_validate_before_speak). Rolling micro-hold: after the
// first clean tool opens the gate, subsequent sentences stay BUFFERED
// (not spoken) and a sentence flushes only when the NEXT tool-call
// validates OK or a short cap elapses — so a LATER rejecting tool drops
// the wrong sentence BEFORE its audio plays ("never spoke it" instead of
// "spoke wrong → corrected 3-8s later"). Default OFF until live-verified;
// claude-brain orchestrator only (this is the only path with the gate).
export const TUTOR_VALIDATE_BEFORE_SPEAK =
  process.env.NEXT_PUBLIC_TUTOR_VALIDATE_BEFORE_SPEAK === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_VALIDATE_BEFORE_SPEAK === 'true';
// Per-sentence cap for the rolling hold: a buffered sentence with no
// following tool flushes after this long (the verbal-tail flush). Must
// exceed the typical sentence→tool gap so a wrong claim stays buffered
// until its rejecting tool arrives. Hidden behind TTS playback for
// multi-sentence turns; only the post-last-tool tail pays it. Tunable.
export const VALIDATE_BEFORE_SPEAK_CAP_MS = 1200;
// Round-15 Issue 2 (2026-07-16): verdict hold — the first verdict-shaped
// sentence of a turn ("Not quite…" / "That's right…") is held pre-audio
// until 2 successor sentences arrive without a contradiction signal, or
// this cap fires (bounds the latency on short "Not quite." turns whose
// stream stays open while the brain thinks). Sized just above the VBS
// cap: long enough for the successor sentence that carries a reversal
// to stream in, short enough that a clean verdict doesn't feel laggy.
export const VERDICT_HOLD_CAP_MS = 1500;
// Keep-validated-on-kill (robustness track, project_tutor_validate_before_speak
// / work-queue #5+#7). On a content kill / give-up, the existing rollback
// removes EVERY render the killed attempt(s) painted — including renders that
// passed validation (e.g. wolfram-correct tangent equations) and were merely
// collateral to a LATER tool's failure. Instrumentation (2026-06-20 e2e
// give-up capture) showed two validated equations vanish for exactly this
// reason. When ON, the rollback is NARROWED: a painted render is kept unless a
// later same-turn render SUPERSEDES it (same figure-category + page, via
// computeFigureCategory — the H6 grouping primitive; non-figure renders
// coexist → always kept). This subsumes the long-deferred Tier-3 #7
// (winningAttemptRendered all-or-nothing sweep). Default OFF until
// live-verified; claude-brain orchestrator only. Pure decision in
// src/lib/tutor/whiteboard/kill-keep.ts (test:kill-keep). When OFF, the
// full-attempt rollback runs verbatim (zero behavior change).
export const TUTOR_KEEP_VALIDATED_ON_KILL =
  process.env.NEXT_PUBLIC_TUTOR_KEEP_VALIDATED_ON_KILL === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_KEEP_VALIDATED_ON_KILL === 'true';
// Wolfram math/graph validation (the external PAID API). The old "check every
// math" directive fired Wolfram on every showGraph/showEquation turn. Measured
// 2026-06-20 (e2e, all subjects): Wolfram caught ZERO real errors — only 2
// false-positives (0.5≈1/2, 4x≈4 x) — while costing money, risking commercial
// terms (free tier is non-commercial only), and adding noise. The FREE local
// validators (validateConicGraph / validateGeometryCommand / intersection +
// the geometry solver) run independently (earlier block) and catch the real
// structured errors. So Wolfram is SCOPED DOWN: default OFF; set
// NEXT_PUBLIC_TUTOR_WOLFRAM_MATH_CHECK='on' to re-enable (e.g. after a
// commercial license). See work-queue item 11d.
export const TUTOR_WOLFRAM_MATH_CHECK =
  process.env.NEXT_PUBLIC_TUTOR_WOLFRAM_MATH_CHECK === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_WOLFRAM_MATH_CHECK === 'true';
// Student-problem grounding (coherence fix, 2026-06-21). Measured: in a
// plan-anchored segment the brain teaches the AUTHORED example (e.g. the
// worked_example's problemText) and ignores the student's OWN stated problem,
// because the segment-truth CONTRACT + divergence guard substitute the authored
// card. When ON, the worked_example/show_problem divergence guards RELAX if the
// rendered problem matches the STUDENT's recent message (token overlap) — i.e.
// the brain is legitimately teaching the student's brought problem, not
// drifting. Brain-drift (matches neither authored nor student) is still caught.
// Default OFF until live-verified (touches the divergence machinery). See
// project_tutor_work_queue + the cooperative-student coherence map.
export const TUTOR_STUDENT_PROBLEM_GROUNDING =
  process.env.NEXT_PUBLIC_TUTOR_STUDENT_PROBLEM_GROUNDING === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_STUDENT_PROBLEM_GROUNDING === 'true';
// Content variety (teaching-variety phase 1, 2026-07-05): on REPEAT sessions
// of a plan, the brain gets fresh hook/worked-example/extension content
// (same LOs/vocab/difficulty/misconception target) instead of the identical
// authored script, driven by per-plan seen-memory. Default OFF; ships dark.
// See project_tutor_teaching_variety + the phase-1 spec.
export const TUTOR_CONTENT_VARIETY =
  process.env.NEXT_PUBLIC_TUTOR_CONTENT_VARIETY === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_CONTENT_VARIETY === 'true';
// Cartesia migration Phase 2, Task 5 (docs/superpowers/plans/
// 2026-07-06-cartesia-migration-phase2.md): swap the perception/STT hook
// from usePerceptionWS (OpenAI gpt-realtime-2 transcription-only) to
// useCartesiaInkWS (Cartesia Ink 2, English-only). Default OFF — unset
// means 'openai', byte-identical to pre-Task-5 behavior. Independent of
// TUTOR_TTS_ENGINE (Task 3); each flag can be flipped alone per the
// single-variable rollout discipline.
export const TUTOR_STT_ENGINE_INK2 =
  process.env.NEXT_PUBLIC_TUTOR_STT_ENGINE === 'ink2';
