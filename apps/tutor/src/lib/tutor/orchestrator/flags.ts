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
// Idle re-engagement nudge (round-7g, 2026-07-29, session portal-b2fe010e:
// tutor ended a confirmation turn with no next move → 7.7min of mutual
// silence). After a DELIVERED tutor turn + ~75s of student silence, dispatch
// a silent bracketed directive so the tutor gently re-engages (repeat gap
// 120s; max 2/stretch, 6/session; backs off while busy or hidden). Default
// ON; NEXT_PUBLIC_TUTOR_IDLE_NUDGE=off is the kill switch. Pure decisions in
// src/lib/tutor/voice/idle-nudge.ts (test:idle-nudge).
export const TUTOR_IDLE_NUDGE =
  process.env.NEXT_PUBLIC_TUTOR_IDLE_NUDGE !== 'off';
// R58 false-final-assertion kill (live, portal-71d11dac: "Right. Dividing
// both sides by 3 gives $x = 11$" spoken — twice — against a card whose
// verified answer is 13/3; the LLM judge killed both and Pillar 2b
// downgraded both). Deterministic member of the verdict-detector family:
// the tutor's OWN asserted "<answerVar> = <value>" is compared against the
// VERIFIED expected answer (never the student's utterance — praised
// intermediate steps must stay safe). Pure detector in
// src/lib/tutor/voice/false-assertion-check.ts (test:false-assertion).
// Default ON; NEXT_PUBLIC_TUTOR_FALSE_ASSERTION_KILL=off is the kill switch.
export const TUTOR_FALSE_ASSERTION_KILL =
  process.env.NEXT_PUBLIC_TUTOR_FALSE_ASSERTION_KILL !== 'off';
// R58 student-declared hold (live, portal-2f23ece4: "ignore everything I
// say until I say candle" — the tutor kept answering every overheard
// utterance and the private aside landed in the transcript). While
// holding: no dispatch, no transcript append, no covers/nudges; resume by
// codeword OR ready-intent OR direct address (the student came back
// WITHOUT the codeword). Pure decisions in
// src/lib/tutor/voice/student-hold.ts (test:student-hold). Default ON;
// NEXT_PUBLIC_TUTOR_STUDENT_HOLD=off is the kill switch.
export const TUTOR_STUDENT_HOLD =
  process.env.NEXT_PUBLIC_TUTOR_STUDENT_HOLD !== 'off';
// R58 first-session tip (requested 2026-08-28): a student whose browser
// has never run a session gets ONE extra opener sentence — replies take a
// few seconds, and a quiet spot helps. Keyed on localStorage (per-browser;
// incognito/cleared storage repeats it once — they look identical to new
// users), so it is structurally unrepeatable for returning students on
// the same browser. Default ON for ALL surfaces (portal + demo embeds,
// per owner ruling); NEXT_PUBLIC_TUTOR_FIRST_SESSION_TIP=off kills it.
export const TUTOR_FIRST_SESSION_TIP =
  process.env.NEXT_PUBLIC_TUTOR_FIRST_SESSION_TIP !== 'off';
// R58 noise-floor nudge (live, portal-dd0bf3a9: AirPods with
// noiseSuppression=undefined turned background noise into FLUENT nonsense
// STT — "while networking distinct account revenues" — which the
// classified-noise nag can never see). Watches the barge-in gate's
// median-based pre-speech energy floor; consecutive elevated floors ⇒ one
// spoken tip per session suggesting a quieter spot / lower volume.
// Default ON; NEXT_PUBLIC_TUTOR_NOISE_FLOOR_NUDGE=off is the kill switch.
export const TUTOR_NOISE_FLOOR_NUDGE =
  process.env.NEXT_PUBLIC_TUTOR_NOISE_FLOOR_NUDGE !== 'off';
// R58b (2026-08-28, owner-approved): Cartesia TTS model. sonic-3.6 is GA,
// same price as 3.5 (owner-verified against cartesia.ai/pricing), fully
// backwards compatible, existing voice IDs unchanged; wins are pacing/
// intonation + Indian-name pronunciation. NEXT_PUBLIC_ so the ONE name
// works in both the server route (tts-cartesia) and the client WS hook
// (useCartesiaSonicWS). Setting NEXT_PUBLIC_CARTESIA_TTS_MODEL=sonic-3.5
// is the instant rollback. ⚠ The tts-pronunciation respell pins were
// tuned against 3.5's normalizer quirks (bare "m" → "meter", 'em' voiced
// /əm/) — they still feed 3.6 plain words, but a live listen should
// confirm nothing sounds newly odd.
export const CARTESIA_TTS_MODEL =
  process.env.NEXT_PUBLIC_CARTESIA_TTS_MODEL || 'sonic-3.6';
/**
 * Agenda rail (2026-08-10): persistent content-labeled progress rail above the
 * whiteboard. Kill switch: NEXT_PUBLIC_TUTOR_AGENDA_RAIL=off.
 */
export const TUTOR_AGENDA_RAIL = process.env.NEXT_PUBLIC_TUTOR_AGENDA_RAIL !== 'off';
// Task B2 — proactive opener wiring (orchestrator). Client-side, DEFAULT OFF.
// When on, the mount-time buildSystemPrompt call additionally passes the B4/B5
// opener/self-report context fields (sessionMode/openingPhase/entryMode/
// isReturning/selfReportRouting), computed from resolveOpeningBehavior +
// assembleOpeningInput (opening-behavior.ts). When off, that call is passed
// EXACTLY as before — no new fields, byte-identical prompt. See
// project_tutor_pedagogy_opener_calibration + .superpowers/sdd/task-B2-brief.md.
export const TUTOR_PEDAGOGY_OPENER = isPedagogyOpenerFlagValue(process.env.NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER);
// R49 first-turn group (2026-08-20). One flag over every fix aimed at the
// first ~20 seconds of a session, because a half-applied version can't be
// judged: (1) the teacher intro directive gains a FLOOR so the opener is
// never a bare "Elena here." (renderTeacherIntroDirective firstTurnV2);
// (2) the opening turn's FIRST board render flushes immediately instead of
// waiting for its anchor sentence, so the board is never blank while the
// tutor talks; (3) the Rule-15 "board may sit bare through the opening
// sentences" licence is withdrawn for the opener only.
// Diagnosed from embed-1787073582144 (marketing demo, bounced at 37s with
// the board still empty) and portal-2d53e403 (22.6s from Start tap to the
// first painted render). Default OFF. See the R49 entry in the live-test
// ledger.
export const TUTOR_FIRST_TURN_V2 =
  process.env.NEXT_PUBLIC_TUTOR_FIRST_TURN_V2 === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_FIRST_TURN_V2 === 'true';
// R49 brain-stall guard (2026-08-20, session portal-2d53e403). The brain
// fetch has NO request or stream timeout — its AbortController exists only
// for perception barge-in — so a wedged upstream stream simply hangs. One
// ran 125s; the student sat through 78s of silence, answering twice into
// the void, before the 90s brain watchdog requeued them. This watches SSE
// frame arrival and aborts a stalled call early enough that the existing
// brain-failure cover speaks instead of nothing. Pure decision in
// src/lib/tutor/voice/brain-stall.ts (test:brain-stall). Default OFF.
export const TUTOR_BRAIN_STALL_GUARD =
  process.env.NEXT_PUBLIC_TUTOR_BRAIN_STALL_GUARD === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_BRAIN_STALL_GUARD === 'true';
// R49 spoken-money reconciliation (2026-08-20, session portal-2d53e403).
// Money read aloud loses its decimal point — "three seventy-five" reaches
// the comparator as "375" against an expected 3.75, so a CORRECT answer
// registers as a mismatch and the tutor denied it, then derived the same
// 3.75 itself 115s later. Narrowly gated on currency markers in the live
// problem; see src/lib/tutor/voice/spoken-money.ts for why (the same digits
// are also the classic misplaced-decimal error). test:spoken-money.
// Default OFF.
export const TUTOR_SPOKEN_MONEY =
  process.env.NEXT_PUBLIC_TUTOR_SPOKEN_MONEY === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_SPOKEN_MONEY === 'true';
// R49 dock-state-only (2026-08-20, user decision). Post-start the dock mic
// becomes a pure state indicator: no interrupt-on-tap, no stop-listening.
// End/Pause owns the session, Mute owns the mic, speech owns barge-in. The
// control's own label has been unreachable since the July-2026 caption
// merge (captionSlot replaces the stateUI text block), leaving an
// unlabelled green circle that kills audio — tapped twice by the visitor
// who then abandoned embed-1787073582144 at 37s. Pre-start behaviour is
// untouched. Pure decision in session/start-tap.ts (test:start-tap).
// Default OFF.
export const TUTOR_DOCK_STATE_ONLY =
  process.env.NEXT_PUBLIC_TUTOR_DOCK_STATE_ONLY === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_DOCK_STATE_ONLY === 'true';
// R49b meta-narration strip (2026-08-20, portal-2d53e403 288.4s). The tutor
// spoke its own adjudication reasoning in the third person — `Their reply
// "10.5" answers an earlier question (After Tuesday), but the active
// question asks for...` — which passed the judge AND stripStageDirections
// (that guard only removes parentheticals). Strips whole sentences carrying
// BOTH a third-person-student subject and an adjudication marker. Pure
// decision in voice/sentence-spacing.ts (test:stage-direction-strip).
// Default OFF.
export const TUTOR_META_NARRATION_STRIP =
  process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_STRIP === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_STRIP === 'true';
// R49b quantity anchoring (2026-08-20, portal-2d53e403 turn 1). R48's
// exercise_no_board is a PRESENCE check — "did the turn call a render
// tool?" — which a contentless placeholder satisfies completely. The
// Crimsora opener called show_number_line with one "Start" dot at 0 while
// all four money events stayed in speech, and the student had to ask for
// the board 59s later. This adds the CONTENT check: do the quantities the
// tutor spoke actually appear in the render payload? Telemetry
// (`quantities_unanchored`) alongside the existing advisory. Pure decision
// in voice/exercise-board-check.ts (test:exercise-board). Default OFF.
export const TUTOR_QUANTITY_ANCHOR = 
  process.env.NEXT_PUBLIC_TUTOR_QUANTITY_ANCHOR === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_QUANTITY_ANCHOR === 'true';
// R49b idle-nudge v2 (2026-08-20, portal-2d53e403 1003.4s). The nudge
// ANSWERED the tutor's own outstanding question ("Fourths — since half is
// just two fourths") 95s after asking it, then advanced to the next
// question — skipping the student on a question they were still thinking
// about. v1's intent was right; "offer a hint" was read as licence to
// supply the answer. v2 states the prohibition outright and bans advancing.
// Directive in voice/idle-nudge.ts (test:idle-nudge). Default OFF.
export const TUTOR_IDLE_NUDGE_V2 =
  process.env.NEXT_PUBLIC_TUTOR_IDLE_NUDGE_V2 === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_IDLE_NUDGE_V2 === 'true';
// R49b answer-reveal guard (2026-08-20, portal-2d53e403 481.5s). The tutor
// moved to a SECOND method and drew the FIRST method's answer onto the new
// page in green ("Wednesday: $3.75"), then asked the question that answer
// answered. Same class as define-before-quiz, for answers. Prompt-side —
// the brain chose to draw it, and no runtime check could know 3.75 was the
// answer to an improvised question. Default OFF.
// R50 T3 correction-note timeout (2026-08-21, portal-1f44f0eb 347-392s).
// The judge is advisory-only (Pillar 2b), so a planted correction note is
// the only repair path for a false rejection — and it waited for the
// student's NEXT REAL TURN. Live, that meant a correct answer stayed
// rejected for 40s and was only repaired because the student repeated
// themselves; a student who accepts the rejection is never corrected.
// This bounds the wait: once the deadline passes, the tutor self-corrects
// unprompted. Default ON per the R49b standing rule — R49 shipped two
// severe fixes dark and prod kept the bugs.
// R51 posed-problem board check (2026-08-22, portal-0984e111 t=97.3). The
// tutor posed a whole new word problem in speech while the turn's only
// render was the PREVIOUS problem's answer — board stale, looked current.
// Slips past all three existing checks: exercise_no_board is satisfied by
// ANY render, quantities_unanchored needs >=3 numerics, scene-prose needs a
// scene verb. Telemetry-only, never a kill. Default ON per the standing rule.
// ⚠ Measured 1 hit in 591 real turns, and that hit IS the live miss it was
// built from — so its generalisation is evidenced only by synthetic held-out
// cases. Watch for it firing on a turn nobody wrote it for; if it never
// does, it is over-narrow rather than the failure being rare.
export const TUTOR_POSED_PROBLEM_BOARD_CHECK =
  process.env.NEXT_PUBLIC_TUTOR_POSED_PROBLEM_BOARD_CHECK !== 'off';
export const TUTOR_CORRECTION_NOTE_TIMEOUT =
  process.env.NEXT_PUBLIC_TUTOR_CORRECTION_NOTE_TIMEOUT !== 'off';
/** How long a planted note may sit undelivered before the tutor volunteers
 *  the correction. Chosen from the live trace: the student's own repair came
 *  at ~33s after the plant, so a shorter bound repairs the silent case
 *  without pre-empting a student who is simply thinking. */
export const CORRECTION_NOTE_TIMEOUT_MS = 20_000;
export const TUTOR_ANSWER_REVEAL_GUARD =
  process.env.NEXT_PUBLIC_TUTOR_ANSWER_REVEAL_GUARD === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_ANSWER_REVEAL_GUARD === 'true';
// R49b dedup-retry awareness (2026-08-20, portal-2d53e403 1429.1s). The
// student asked for ANOTHER fraction problem; the brain re-posed the
// identical one; dedup dropped the render; and the retry reason — which
// opens "The student is still looking at the previous problem" — led the
// brain to narrate the OLD card verbatim instead of making a new one. When
// on, the reason carries what the student actually asked for. Detector in
// voice/another-problem-request.ts (test:another-problem). Default OFF.
export const TUTOR_DEDUP_RETRY_CONTEXT =
  process.env.NEXT_PUBLIC_TUTOR_DEDUP_RETRY_CONTEXT === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_DEDUP_RETRY_CONTEXT === 'true';
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
// Board-anchored-question net (2026-07-26, R2 E2, session portal-19ac025c):
// a turn ending in a substantive question with ZERO content board writes
// plants a next-turn [board-anchor note] (same lifecycle as the cadence
// note — soft, never a kill). The prompt HARD RULE is the primary fix;
// this catches only the zero-write case by design.
export const TUTOR_BOARD_ANCHOR_NET = process.env.NEXT_PUBLIC_TUTOR_BOARD_ANCHOR_NET !== 'off';
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

// R32: contextual cover layer v2 — classifier-driven cover phrases, silent
// verdicts, instant liveness replies, escalating in-flight covers, 45s
// give-up, terminal covers. Requires TUTOR_ACK_LAYER on. Default OFF.
export const TUTOR_COVER_V2 =
  process.env.NEXT_PUBLIC_TUTOR_COVER_V2 === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_COVER_V2 === 'true';

// R34: hold a finalized transcript that ends on a dangling function word
// ("give me a…") for HOLD_MS and merge with resumed speech — Ink2's
// endpointer sometimes cuts mid-hesitation. Default OFF.
export const TUTOR_INCOMPLETE_HOLD =
  process.env.NEXT_PUBLIC_TUTOR_INCOMPLETE_HOLD === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_INCOMPLETE_HOLD === 'true';

// R34: availability gate for the student-facing "Manual mic" toggle —
// buffered turn composition with tap-to-send instead of auto endpointing.
// The MODE is opt-in per device (localStorage); this flag just ships the UI.
export const TUTOR_MANUAL_MIC =
  process.env.NEXT_PUBLIC_TUTOR_MANUAL_MIC === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_MANUAL_MIC === 'true';

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
// Task 3.1 (humanlike-latency plan): Cartesia TTS over WebSocket with
// word-level timestamps (word clock for render↔speech sync). Cold sentences
// synthesize over one persistent WS; any WS failure falls back to the HTTP
// path for the session (debug event `tts_ws_fallback`). Default OFF.
export const TUTOR_TTS_WS =
  process.env.NEXT_PUBLIC_TUTOR_TTS_WS === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_TTS_WS === 'true';
// How long a dispatched sentence waits for its FIRST WS audio chunk before
// falling back to the HTTP path (spike 2026-07-22 measured first chunk well
// under 1s; 4s tolerates a cold reconnect without stalling the turn).
export const SONIC_WS_FIRST_CHUNK_TIMEOUT_MS = 4000;
// Phase 4.2 (humanlike-latency plan): content-bearing renders that fail
// structural validation (organizer diagrams / trees with well-formed text)
// paint a plain title+text fallback card instead of nothing, so
// board-anchored narration never points at a blank board. Duplicates,
// equations, and broken geometry stay dropped. Default OFF.
export const TUTOR_RENDER_FALLBACK_CARD =
  process.env.NEXT_PUBLIC_TUTOR_RENDER_FALLBACK_CARD === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_RENDER_FALLBACK_CARD === 'true';
// Rule-8 repair v2 (round 6): the in-stream server repair pass fires only
// when the turn emitted ZERO tools — it cannot see client-side drops. When
// the server sent tools but every one was dropped client-side (dedup /
// validator / kill), the client POSTs the turn's spoken sentences to
// /api/tutor/rule8-repair at turn end and dispatches the returned frames
// through the normal validator/dedup stack. Mutually exclusive with the
// server pass by construction. Default OFF.
export const TUTOR_CLIENT_RULE8_REPAIR =
  process.env.NEXT_PUBLIC_TUTOR_CLIENT_RULE8_REPAIR === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_CLIENT_RULE8_REPAIR === 'true';
// Task 3.2 (humanlike-latency plan): word-anchored render flush — buffered
// renders release the moment the introducing sentence speaks its REFERRING
// word (word clock from TUTOR_TTS_WS) instead of at the sentence boundary.
// Strictly an accelerator over sentence semantics. Default OFF.
export const TUTOR_RENDER_WORD_ANCHOR =
  process.env.NEXT_PUBLIC_TUTOR_RENDER_WORD_ANCHOR === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_RENDER_WORD_ANCHOR === 'true';
// Opening-turn barge-in sustain (2026-07-22 live: blanket suppression made
// first-turn interruption impossible — student spoke 12s over the opener,
// unheard, in two sessions). Tuning history: 2500ms ("keeps talking over
// me", round 3) → 900ms (still read as not-fixed, round 4) → aligned with
// the production-proven mid-lesson BARGEIN_SUSTAIN_MS (350ms; echo blips
// measure ~264ms and disarm on speech_stopped). The 2026-07-04 phantom
// class this guard exists for was TRANSCRIPT-driven retro-cancels, which
// remain fully suppressed during the opener regardless of this value.
export const OPENER_BARGEIN_SUSTAIN_MS = 350;

// Round-6d (live 2026-07-28, portal-37c0e0bf): after a verdict CONFIRMS a
// cancel was the tutor's own echo (drop_self_voice), suppress further
// perception cancels for this window. The failure it breaks: app-switching
// resets the mobile audio session, AEC de-converges, and every resumed
// sentence's echo re-kills the resume — an audible kill→replay loop
// (overlapping tails + repeated phrases). Within ~2.5s of a CONFIRMED
// self-echo kill, the next onset while the tutor speaks is overwhelmingly
// the same echo; a genuine student interrupt in that window still reaches
// the brain via its transcript (the kill is what's suppressed, not the
// dispatch).
export const SELF_ECHO_CANCEL_IMMUNITY_MS = 2500;
export const BARGEIN_ENERGY_THRESHOLD = 0.15;
export const BARGEIN_GATE_POLL_MS = 50;
export const BARGEIN_GATE_MAX_MS = 5000;
// Adaptive barge-in energy gate (2026-07-27, round-5 echo fix). The fixed
// 0.15 above is a DESKTOP-calibrated constant and is unusable on a phone:
// measuring the recorded student/tutor PCM of two real mobile prod sessions
// (portal-c867381f, portal-fb520c16) in this same scaled 0..1 domain gives
//   echo   p50 .012-.022, p99 .039-.042
//   speech p50 .104,      max .139
// — i.e. BOTH self-echo and genuine student speech sit far below 0.15, so
// the fixed gate can only ever be all-block or all-pass on mobile (desktop
// session-1785023522127 measures echo p50 .247 / speech p50 .308, ~10x
// hotter). So the live threshold is derived per-device from the observed
// echo floor just before the onset: threshold = clamp(margin * baseline,
// FLOOR, BARGEIN_ENERGY_THRESHOLD). The ceiling keeps this from EVER being
// stricter than the shipped constant; the floor keeps a silent baseline from
// collapsing the gate to ~0. margin 2.5 lands at ~.055 on the measured
// mobile sessions — above echo p99 (.042), below student speech (.104).
// Draggable tutor ink notes (R2 E3). Turned OFF 2026-07-27 (round-5): the
// affordance wasn't wanted. Off restores the pre-drag behaviour exactly —
// notes are pointer-events-none again, so a tap falls through to the
// tap-to-mark wrapper natively. The drag machinery in InkNotesOverlay is
// deliberately left in place; set this true to bring it back.
export const INK_NOTE_DRAG = false;
export const BARGEIN_ENERGY_FLOOR = 0.03;
export const BARGEIN_ECHO_MARGIN = 2.5;
/** How far back from the onset the echo-floor baseline is sampled. Must stay
 *  under usePerceptionWS/useCartesiaInkWS's 1500ms energy window. */
export const BARGEIN_BASELINE_LOOKBACK_MS = 600;
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
