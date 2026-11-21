/**
 * Extracted verbatim from VoiceTutorRealtime.tsx (seam-extraction slice 1,
 * 2026-07-05). Pure module — no component state.
 *
 * Feature flags + tuning constants read at module scope. NEXT_PUBLIC_
 * inlining works in any module — these are build-time substitutions.
 */
import { isPedagogyOpenerFlagValue } from '@/lib/tutor/ai/opening-behavior';
import { LANGUAGE_TURN_MAX_TOKENS_DEFAULT } from '@/lib/tutor/voice/output-budget';

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
// Partner embed voice default (2026-09-15, Kanzoo sandbox finding): a token
// with NO teacher persona used to fall back to the OpenAI Realtime voice, so
// a partner that simply omitted `teacher` got a different (synthetic) voice
// from every first-party surface. Default ON: such tokens now speak with
// Cartesia + CARTESIA_DEFAULT_VOICE_ID. A persona that explicitly declares an
// openai voice still gets it. 'off' restores the pre-2026-09-15 fallback.
export const TUTOR_EMBED_CARTESIA_DEFAULT =
  process.env.NEXT_PUBLIC_TUTOR_EMBED_CARTESIA_DEFAULT !== 'off';
// Extra tutor languages (2026-10-14, bilingual en+ja): a partner token's
// `tutor_languages` claim makes that tenant's sessions bilingual (prompt
// override of Rule 5 + per-sentence TTS language). Tokens without the claim
// are unaffected either way. 'off' ignores the claim everywhere.
export const TUTOR_EXTRA_LANGUAGES =
  process.env.NEXT_PUBLIC_TUTOR_EXTRA_LANGUAGES !== 'off';
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
// 2026-10-17 (GDI embed-1792261973710): after the lesson closes, a quiet
// LESSON_CLOSE_AUTO_END_MS ends the voice session the way the End button does
// (lesson-close.ts). Without it the mic, the recogniser and the recording ran
// 8.5 minutes past the goodbye, until the tab was closed. 'off' disables
// everywhere; per partner it is `lessonCloseAutoEnd` in
// lib/tutor/portal/partner-session-options.ts (on by default, 2026-10-27).
export const TUTOR_LESSON_CLOSE_AUTO_END =
  process.env.NEXT_PUBLIC_TUTOR_LESSON_CLOSE_AUTO_END !== 'off';
// 2026-11-09 (Crimsora portal-6ed49162): the answer streaks were saved per
// lesson plan in the browser and restored into every NEW session on that plan,
// so the first right answer read "streak 13" and "segment mastered" fired on
// arrival. A fresh session now starts both streaks at zero; a genuine resume
// still restores them (pace-preference.ts resolveStreaksOnLoad).
export const TUTOR_STREAK_FRESH_START =
  process.env.NEXT_PUBLIC_TUTOR_STREAK_FRESH_START !== 'off';
// 2026-11-09 (same session): the tutor closed the lesson, the student closed
// the tab inside the 45 s auto-end window, and the row was saved "abandoned".
// A page that goes away after the lesson has closed now saves "completed"
// (lesson-close.ts unloadSaveStatus). A discarded session stays abandoned.
export const TUTOR_CLOSED_LESSON_COMPLETES =
  process.env.NEXT_PUBLIC_TUTOR_CLOSED_LESSON_COMPLETES !== 'off';
// 2026-10-19 (GAC AP Statistics, portal-7b0e93dc; global since the 2026-10-28
// merge): a typed message while a typed student turn is in flight supersedes
// it (nothing shown yet) or queues behind it (a sentence already shown),
// instead of force-clearing the busy flag and running two overlapping turns.
// session/text-kickoff.ts `decideTypedDuringTurn`. Text mode only. 'off'
// restores the force-clear for every tenant.
export const TUTOR_TYPED_SUPERSEDE =
  process.env.NEXT_PUBLIC_TUTOR_TYPED_SUPERSEDE !== 'off';
// 2026-10-20 (GAC; global since the 2026-10-28 merge): chat bubbles run
// prepareBubbleText (bare LaTeX / unicode-with-limits auto-wrapped in $…$)
// and long math spans may wrap at a paren (InlineMathText `wrap`).
// TranscriptView.renderBubbleText + inline-emphasis.renderBubbleEmphasis.
// 'off' restores the pre-merge bubble rendering for every tenant.
export const TUTOR_BUBBLE_MATH =
  process.env.NEXT_PUBLIC_TUTOR_BUBBLE_MATH !== 'off';
// 2026-10-28 (GDI Communications trial lesson): the working-level check, where
// the tutor probes the learner's English level up front and adapts the lesson
// to it. Per partner it is `levelCheck` in
// lib/tutor/portal/partner-session-options.ts (only gdi-demo today). 'off'
// disables it for every tenant; sessions then run exactly as before.
export const TUTOR_WORKING_LEVEL =
  process.env.NEXT_PUBLIC_TUTOR_WORKING_LEVEL !== 'off';
// 2026-10-28 (GDI Communications trial lesson): pronunciation assessment on
// the learner's speech. Per partner it is `pronunciation` in
// lib/tutor/portal/partner-session-options.ts (only gdi-demo today). 'off'
// disables it for every tenant; sessions then run exactly as before.
export const TUTOR_PRONUNCIATION_ASSESS =
  process.env.NEXT_PUBLIC_TUTOR_PRONUNCIATION_ASSESS !== 'off';
// 2026-10-28 (Crimsora trial portal-ba5a6b3c, Praveen): in a FREE demo
// session (marketing demo, academy trial `is_trial`, partner showcase) the
// student may change the topic at any point and the first turn briefly
// confirms the chosen topic. On ⇒ every `is_trial` session is open-scope,
// the demo-start / showcase mints set `is_trial`, and the demo prompt blocks
// carry the switch-this-turn rule (src/lib/tutor/portal/demo-topic-choice.ts).
// `off` ⇒ previous behaviour byte-for-byte. Paid sessions never see it.
export const TUTOR_DEMO_TOPIC_CHOICE =
  process.env.NEXT_PUBLIC_TUTOR_DEMO_TOPIC_CHOICE !== 'off';
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
/** Issue-A fix (portal-85b2c632, 2026-09-01): when the previous turn posed a
 *  question with NO board write (board-anchor note planted), the active-problem
 *  anchor is suspect — downgrade a false-assertion KILL to an advisory log so a
 *  correct answer to the spoken side-question isn't killed against a stale
 *  anchor. Default ON. */
export const TUTOR_FA_STALE_ANCHOR_DOWNGRADE = process.env.NEXT_PUBLIC_TUTOR_FA_STALE_ANCHOR_DOWNGRADE !== 'off';
/** portal-704e3e01 (2026-09-04): a false-assertion KILL removed the turn's
 *  verdict and the retry restored none — the student asked out loud whether
 *  she had got the previous question right. Appends a replant clause to the
 *  false-assertion rejection so the re-delivery still grades the answer.
 *  Default ON; NEXT_PUBLIC_TUTOR_VERDICT_REPLANT_ON_KILL=off is the switch. */
export const TUTOR_VERDICT_REPLANT_ON_KILL =
  process.env.NEXT_PUBLIC_TUTOR_VERDICT_REPLANT_ON_KILL !== 'off';
/** portal-704e3e01 (2026-09-04) @1414.3s: performKill retracted the speech
 *  while mark_segment_complete / advance_lesson / show_segment_card from the
 *  SAME killed turn dispatched anyway, moving the lesson onto content the
 *  student never heard introduced. Withholds lesson-STATE tools (never
 *  renders) for the remainder of a killed attempt.
 *  Default ON; NEXT_PUBLIC_TUTOR_KILL_WITHHOLDS_ADVANCE=off is the switch. */
export const TUTOR_KILL_WITHHOLDS_ADVANCE =
  process.env.NEXT_PUBLIC_TUTOR_KILL_WITHHOLDS_ADVANCE !== 'off';
/** Holistic-pedagogy round (2026-09-05, spec §A.8): per-LO struggle ledger —
 *  inferred gaps + in-session recurrence. Default ON;
 *  NEXT_PUBLIC_TUTOR_STRUGGLE_LEDGER=off is the switch. */
export const TUTOR_STRUGGLE_LEDGER =
  process.env.NEXT_PUBLIC_TUTOR_STRUGGLE_LEDGER !== 'off';
/** Spec §B.8: consent-gated recap offers (mid-session recurrence + session
 *  start). Default ON; NEXT_PUBLIC_TUTOR_RECAP_OFFER=off is the switch. */
export const TUTOR_RECAP_OFFER =
  process.env.NEXT_PUBLIC_TUTOR_RECAP_OFFER !== 'off';
/** Spec §C.10: close_session_notes tool, practice-assign call, fallback,
 *  summary line. Default ON; NEXT_PUBLIC_TUTOR_CLOSE_NOTES=off is the switch. */
export const TUTOR_CLOSE_NOTES =
  process.env.NEXT_PUBLIC_TUTOR_CLOSE_NOTES !== 'off';
/** Spec §D.5: false-praise-opener guard + praise-contradiction widening.
 *  Default ON; NEXT_PUBLIC_TUTOR_FALSE_PRAISE_OPENER=off is the switch. */
export const TUTOR_FALSE_PRAISE_OPENER =
  process.env.NEXT_PUBLIC_TUTOR_FALSE_PRAISE_OPENER !== 'off';
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

// In-flow entry (partner spec v1.1 `entry: "in-flow"`): in-flow opener, no first-
// session tip, no teacher intro, hand-back close, no homework drafts.
// NEXT_PUBLIC_TUTOR_INFLOW_ENTRY=off restores the standard behaviour for such tokens.
export const TUTOR_INFLOW_ENTRY = process.env.NEXT_PUBLIC_TUTOR_INFLOW_ENTRY !== 'off';

// Bridge line: a fixed first line spoken by the client at the start tap, before
// the first brain call. NEXT_PUBLIC_TUTOR_BRIDGE_LINE=off restores silence.
export const TUTOR_BRIDGE_LINE = process.env.NEXT_PUBLIC_TUTOR_BRIDGE_LINE !== 'off';

// Host start (partner spec v1.1 §3): `prewarm=1` loads the embed warm with the mic
// held, and the host's `evelyn:start` message runs the Start tap's path.
// NEXT_PUBLIC_TUTOR_HOST_START=off ignores both (a prewarmed frame loads normally).
export const TUTOR_HOST_START = process.env.NEXT_PUBLIC_TUTOR_HOST_START !== 'off';
// One continuous lesson beside a host video (partner spec v1.2): standby while
// the video plays or the panel is hidden, wake on a question or a moment,
// per-turn <lesson_video> context, tutor-resumed playback.
// NEXT_PUBLIC_TUTOR_HOST_LESSON=off ignores the v1.2 host messages entirely.
export const TUTOR_HOST_LESSON = process.env.NEXT_PUBLIC_TUTOR_HOST_LESSON !== 'off';
// Question read-aloud (partner spec v1.6): the frame speaks a host question
// when it appears and one short line after a correct answer — no model call,
// standing by throughout. Applies only where the partner row asks for it
// (partner-session-options.ts `questionRead`).
// NEXT_PUBLIC_TUTOR_HOST_QUESTION_READ=off ignores `evelyn:question` / `evelyn:answer`.
export const TUTOR_HOST_QUESTION_READ = process.env.NEXT_PUBLIC_TUTOR_HOST_QUESTION_READ !== 'off';
// Evolve-in-place swap: a superseded figure leaves the board in the same
// paint as its replacement instead of seconds earlier (empty board while the
// replacement waited for its sentence). =off restores the immediate removal.
export const TUTOR_EVOLVE_SWAP = process.env.NEXT_PUBLIC_TUTOR_EVOLVE_SWAP !== 'off';
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
// Issue C (2026-09-01, portal-85b2c632 04:27:22 UTC): the correction-note
// deadline above fired while the student had declared think time ("I'm just
// doing mental math"), volunteering intermediate steps mid-think. This adds
// a student-declared-think-time hold to the timeout's busy check. Default ON
// per the R49b standing rule.
export const TUTOR_THINK_TIME_HOLD =
  process.env.NEXT_PUBLIC_TUTOR_THINK_TIME_HOLD !== 'off';
// Issue E (2026-09-01, embed-1788187567764 16:47:15->16:47:20 UTC): one
// continuous student utterance got split into two finals by the
// transcriber; each landed in the busy-turn queue separately and drained
// as its OWN full brain turn a second apart, so the student got two
// answers to what was one thought. When a new final arrives while the
// brain is busy and something is already queued (not yet dispatched),
// merge it into that queued utterance instead of adding a second entry.
// Default ON per the R49b standing rule.
export const TUTOR_TURN_COALESCE =
  process.env.NEXT_PUBLIC_TUTOR_TURN_COALESCE !== 'off';
// Pre-audio supersede (GDI meeting session 2026-10-15, 494–500s): a learner
// paused twice inside one question; each fragment became its own turn, and
// the reply to the fragment "enough?" played AFTER the full question had
// arrived, then the full question got a second answer. When a new final
// arrives while the brain is busy and the in-flight reply has not spoken a
// single sentence yet (cover/ack lines don't count), abort that reply and
// answer the in-flight text + the new text once. Acts on a real final
// transcript only, never on speech onset or noise (the E1 regression).
// Default ON per the R49b standing rule.
// Thinking cue kill switch (GDI sessions 2026-10-15): the chime + pulse +
// large on-stage "Thinking…" state. Per-session opt-in is the embed claim
// `thinking_cue`; this flag only turns it off everywhere. Default ON per
// the R49b standing rule.
export const TUTOR_THINKING_CUE =
  process.env.NEXT_PUBLIC_TUTOR_THINKING_CUE !== 'off';
export const TUTOR_SUPERSEDE_PRE_AUDIO =
  process.env.NEXT_PUBLIC_TUTOR_SUPERSEDE_PRE_AUDIO !== 'off';
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
// Issue B (2026-09-01 triage, portal-85b2c632 04:22:27 UTC). The
// dedup-rejection path surfaces a suppressed show_segment_card /
// show_problem as a kill+retry even when the suppressed duplicate IS the
// card the student is already looking at — there's nothing to re-anchor
// away from, so the retry produced a divergent resume. When on, that exact
// case (duplicate target === active board card) is a round-7 silent drop
// instead: no kill, no retry. Default ON per the standing flag-default rule.
export const TUTOR_DEDUP_ACTIVE_SILENT =
  process.env.NEXT_PUBLIC_TUTOR_DEDUP_ACTIVE_SILENT !== 'off';
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
// Shaded-region net (2026-09-24, GreenApple round 6, portal-7298bf27): the
// tutor said "…is shaded green" over a show_coordinate_plane that cannot
// shade. Speech uses a shade word + a non-shading figure tool + no graph call
// carrying `shadedRegion` → one-shot runtime note to redraw with
// show_function_graph. Pure decision: lib/tutor/voice/shaded-region-net.ts.
export const TUTOR_SHADED_REGION_NET = process.env.NEXT_PUBLIC_TUTOR_SHADED_REGION_NET !== 'off';
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
// 2026-10-17 (GDI, embed-1792271667337 — a human barge-in test): pause the
// playback clock at the onset, then kill or resume on the first evidence
// (bargein-pause.ts). The energy gate above sat at its 0.15 ceiling on the
// test laptop and never passed; every kill came from the final transcript,
// 1.5–2 s after the student began. 'off' restores decide-then-kill.
export const TUTOR_BARGEIN_PAUSE_FIRST =
  process.env.NEXT_PUBLIC_TUTOR_BARGEIN_PAUSE_FIRST !== 'off';
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
// Issue F (2026-09-01, embed-1788187567764 16:46:33->35 UTC): during the
// opening turn every perception cancel is suppressed (2026-07-04 phantom
// self-echo guard, project_tutor_r50_round) — even a REAL student
// utterance. Observed live: perception_cancel_suppressed_opening fired
// three times while the student asked a genuine ≥3-word question and the
// tutor spoke over them. This adds a narrow escape hatch: a ≥3-word
// transcript that is NOT a substring of the opener's own spoken text is a
// human, not echo/noise — the suppression lifts for that one cancel. The
// echo-substring check is exactly what preserves the 2026-07-04 guard's
// protection (a phantom self-echo transcript repeats the opener's own
// words, so it stays a substring and stays suppressed). Default ON per the
// standing flag-default rule.
export const TUTOR_OPENING_BARGEIN_ESCAPE =
  process.env.NEXT_PUBLIC_TUTOR_OPENING_BARGEIN_ESCAPE !== 'off';
/** portal-9a9b7c09 (2026-09-04): the tutor speaks numbers as words and every
 *  arithmetic guard parses digits, so a session with seven defective turns
 *  fired zero kills. Feeds tutor sentences through spokenNumbersToDigits
 *  before the arithmetic and reversal guards.
 *  Default ON; NEXT_PUBLIC_TUTOR_SPOKEN_NUMBER_GUARDS=off is the switch. */
export const TUTOR_SPOKEN_NUMBER_GUARDS =
  process.env.NEXT_PUBLIC_TUTOR_SPOKEN_NUMBER_GUARDS !== 'off';
/** portal-9a9b7c09 (2026-09-04): showEquation-11 painted
 *  "16 + 9 + 9 + 4 + 144 = 182" while the same turn's speech said the total
 *  was thirty-eight. The judge flagged it at kill severity and, being
 *  advisory-only, aired nothing. The board is ground truth the tutor wrote
 *  itself, so this deterministic comparison may kill.
 *  Default ON; NEXT_PUBLIC_TUTOR_BOARD_CONTRADICTION=off is the switch. */
export const TUTOR_BOARD_CONTRADICTION =
  process.env.NEXT_PUBLIC_TUTOR_BOARD_CONTRADICTION !== 'off';
/** portal-704e3e01 (2026-09-04) @1027.9s: the brain spoke a whole
 *  <result>…</result> block aloud. The meta-narration filter matched content
 *  phrases and that block contained none. Extract to a pure module and add a
 *  structural markup rule. Flag TUTOR_META_NARRATION_STRUCTURAL (default ON).
 *  Default ON; NEXT_PUBLIC_TUTOR_META_NARRATION_STRUCTURAL=off is the switch. */
export const TUTOR_META_NARRATION_STRUCTURAL =
  process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_STRUCTURAL !== 'off';

/** portal-704e3e01 (2026-09-04): the show_problem → show_segment_card
 *  substitution twice chose a card the orchestrator then rejected — a
 *  COMPLETE segment @1111.7s, and a card already on the board while the
 *  student had asked for a different problem @1021.1s. Both became
 *  self-inflicted validator retries. Gates the substitution on those two.
 *  Default ON; NEXT_PUBLIC_TUTOR_SUBSTITUTE_GATE=off is the switch. */
export const TUTOR_SUBSTITUTE_GATE =
  process.env.NEXT_PUBLIC_TUTOR_SUBSTITUTE_GATE !== 'off';
/** portal-704e3e01 (2026-09-04) @1122.5s: the auto-newPage was titled from
 *  the plan's authored problem while the card that rendered was a
 *  generate_problem substitute, and the fixed slice(0, 70) cut it
 *  mid-expression. Retitles at flush from the problem actually rendering.
 *  Default ON; NEXT_PUBLIC_TUTOR_PAGE_TITLE_FROM_RENDER=off is the switch. */
export const TUTOR_PAGE_TITLE_FROM_RENDER =
  process.env.NEXT_PUBLIC_TUTOR_PAGE_TITLE_FROM_RENDER !== 'off';
/** portal-00fa1bb7 / portal-5bc0fc1e / portal-c3007206 (2026-09-03/04): three
 *  dead-start sessions with ZERO debug events. Events ride a 30s interval or a
 *  beforeunload beacon an iframed embed does not reliably get. Adds pagehide +
 *  visibilitychange listeners and one early flush inside the first 10s after
 *  the session latches — on WHICHEVER of three signals fires first: the
 *  first start_tap, evelyn:session-started, or transcript growth PAST the
 *  resume baseline (fix-round-3: the transcript backstop closes every entry
 *  point that bypasses the first two — e.g. the resume-await toolbar or a
 *  restored try-yourself card — without naming any of them; start_tap and
 *  session-started still fire earlier when they apply, opening the window
 *  sooner). The baseline is resumeState.transcript.length, not zero,
 *  because a resume DOES restore transcript at mount with no gesture —
 *  fix-round-4 corrected an earlier claim here that it restored only
 *  position. A page load with none of the three is navigation, not a dead
 *  start, and mints nothing.
 *  Default ON; NEXT_PUBLIC_TUTOR_TELEMETRY_SURVIVAL=off is the switch. */
export const TUTOR_TELEMETRY_SURVIVAL =
  process.env.NEXT_PUBLIC_TUTOR_TELEMETRY_SURVIVAL !== 'off';
/** portal-00fa1bb7 / -5bc0fc1e / -c3007206: the session-usage upsert runs on
 *  MOUNT, so every embed load mints a tutorsessions row — a student browsing
 *  the lesson menu creates one "abandoned" session per click, indistinguishable
 *  from a real failed start. Holds every write until the session is ENGAGED,
 *  latched on WHICHEVER of three signals fires first (embed/page.tsx's
 *  sessionEngagedAtRef): the first start_tap (a tap that never became a
 *  session is exactly the dead-start case worth diagnosing, and it must
 *  still get its row and its telemetry — resumeContinue() emits this too,
 *  as of fix-round-2, since a resumed mount deliberately suppresses the
 *  session-started dispatch below), evelyn:session-started (gesture /
 *  typed-first-message starts), or transcript growth PAST the resume
 *  baseline (fix-round-3 backstop — after three rounds each closing one
 *  named entry point and finding another, this latches on the invariant
 *  instead: a session is one where the tutor actually did something, and
 *  every costed path ends in a brain turn that produces transcript;
 *  fix-round-4 baselined it at resumeState.transcript.length because a
 *  resume DOES restore transcript at mount with no gesture, so a `> 0`
 *  test made merely previewing a resumable session latch and overwrite the
 *  real prior session's duration/endedAt/status with an abandoned save).
 *  A load with none of the three is plain navigation and mints nothing.
 *  Default ON; NEXT_PUBLIC_TUTOR_DEFER_SESSION_DOC=off is the switch. */
export const TUTOR_DEFER_SESSION_DOC =
  process.env.NEXT_PUBLIC_TUTOR_DEFER_SESSION_DOC !== 'off';
/** 2026-10-13: every student edit to a whiteboard molecule was sent to the
 *  tutor as a message to discuss, so it talked at length about each stroke.
 *  An edit is now a silent note on the next brain turn; the tutor answers one
 *  only when its latest turn handed over an editable molecule, or the student
 *  presses "Check my molecule" (lib/tutor/whiteboard/molecule-edit.ts).
 *  Default ON; NEXT_PUBLIC_TUTOR_SILENT_MOLECULE_EDITS=off answers every edit again. */
export const TUTOR_SILENT_MOLECULE_EDITS =
  process.env.NEXT_PUBLIC_TUTOR_SILENT_MOLECULE_EDITS !== 'off';
/** 2026-10-18 (GDI embed-1792338502233): the learner waited 4.6 s after Start
 *  for the tutor's first sentence — the opener brain call ran cold. The opener
 *  depends only on plan, persona and student, so the embed now builds and sends
 *  it pre-start (callBrainOnce `prefetchOnly`); the route caches the stream
 *  under the session id and the Start call replays it in ~100 ms
 *  (lib/tutor/voice/opener-prefetch.ts). One brain call per page load even if
 *  Start is never tapped — so since the 2026-10-27 merge it is a PER-PARTNER
 *  setting (lib/tutor/portal/partner-session-options.ts: on for bilingual
 *  sessions, off for English-only partners until asked). This flag is the
 *  kill switch over that: NEXT_PUBLIC_TUTOR_OPENER_PREFETCH=off restores the
 *  cold opener everywhere. */
export const TUTOR_OPENER_PREFETCH =
  process.env.NEXT_PUBLIC_TUTOR_OPENER_PREFETCH !== 'off';
/** How long after the prompt is built the pre-start opener is sent: lets the
 *  plan and persona refs settle and skips a tab that bounces straight off. */
export const OPENER_PREFETCH_DELAY_MS = 1500;
/** 2026-10-18 (output-budget.ts, Praveen's ruling after GDI
 *  embed-1792350642171): hard cap on the brain's output tokens for a plain
 *  language VOICE turn (bilingual session; not the opener, not a tool-carrying
 *  turn). Default 220 (was 320 until 2026-10-18: embed-1792363895174 passed
 *  9-sentence turns at out=216; a tool call the cap cuts is now finished by a
 *  continuation call, see output-budget.ts); a number overrides; 'off'
 *  disables. */
export const TUTOR_LANGUAGE_TURN_MAX_TOKENS: number | null = (() => {
  const raw = process.env.NEXT_PUBLIC_TUTOR_LANGUAGE_TURN_MAX_TOKENS;
  if (raw === 'off') return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : LANGUAGE_TURN_MAX_TOKENS_DEFAULT;
})();

// Demo-polish round (2026-10-29, live embed-1793240679836 + Otter recording).
// Four default-ON switches, `off` ⇒ previous behaviour byte-for-byte.
/** Board tool cluster hidden unless the partner row / token asks for it; a
 *  labelled Full screen control in the session header instead. */
export const TUTOR_HEADER_FULLSCREEN = process.env.NEXT_PUBLIC_TUTOR_HEADER_FULLSCREEN !== 'off';
/** Tutor board notes in an upright hand (Kalam first, 24px) with a
 *  left-to-right writing reveal. */
export const TUTOR_NOTE_PRINT_HAND = process.env.NEXT_PUBLIC_TUTOR_NOTE_PRINT_HAND !== 'off';
/** When the ack layer spoke this turn, the brain's first sentence drops its
 *  own leading filler ("Okay, let's see." + "Okay, let's look…"). */
export const TUTOR_ACK_OPENER_STRIP = process.env.NEXT_PUBLIC_TUTOR_ACK_OPENER_STRIP !== 'off';
/** Time-boxed sessions: a client-spoken "two minutes left" line at the wrap
 *  minute and a spoken goodbye before the hard stop ends the session. */
export const TUTOR_TIMEBOX_FAREWELL = process.env.NEXT_PUBLIC_TUTOR_TIMEBOX_FAREWELL !== 'off';

// GDI trial live run 1 (2026-10-29): the brain never advanced a fixed-script
// conversation lesson. Default-ON switches, `off` ⇒ previous behaviour.
/** Fixed-script plans: the client moves the segment pointer itself once a
 *  segment runs past its overlong note or its minutes (fixed-script.ts
 *  fixedScriptAutoAdvanceReason), and leaves a level-check segment as soon as
 *  set_working_level lands. The brain is told the move as a fact. */
export const TUTOR_FIXED_SCRIPT_AUTO_ADVANCE = process.env.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_AUTO_ADVANCE !== 'off';
/** Every validator retry that redoes killed speech carries RETRY_PREAMBLE
 *  (voice/retry-preamble.ts) so the redo never says "this time"/"again". */
export const TUTOR_RETRY_PREAMBLE = process.env.NEXT_PUBLIC_TUTOR_RETRY_PREAMBLE !== 'off';
/** Language lessons (GDI trial run 1, 2026-10-29: 3 board sentences in 29
 *  turns): a turn that quoted a model / corrected sentence and rendered nothing
 *  gets the sentence card from the client (voice/sentence-board.ts). (The
 *  TTS caps stress is now TUTOR_SPOKEN_EMPHASIS_CAPS, opt-in.) */
export const TUTOR_SENTENCE_BOARD = process.env.NEXT_PUBLIC_TUTOR_SENTENCE_BOARD !== 'off';
/** Uppercase the corrected / card emphasis words in the TTS string. OPT-IN
 *  (active only when `=== 'on'`): GDI run 8 (2026-10-30) — Cartesia spells
 *  capitals letter by letter ("ATTENDING" → "a t t …") and the caps gave no
 *  audible stress. Display text and board emphasis are never affected. */
export const TUTOR_SPOKEN_EMPHASIS_CAPS = process.env.NEXT_PUBLIC_TUTOR_SPOKEN_EMPHASIS_CAPS === 'on';

/** Fixed-script plans (GDI trial run 2, 2026-10-29): a brain
 *  advance_lesson / mark_segment_complete off a segment whose requiredPhrases
 *  have not been said yet is refused (the opening turn skipped the scripted
 *  overview). Skip button, {to:"free"} and the client's own advances are never
 *  refused. Default ON; NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_ADVANCE_GUARD=off. */
export const TUTOR_FIXED_SCRIPT_ADVANCE_GUARD = process.env.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_ADVANCE_GUARD !== 'off';
/** Fixed-script plans (GDI run 8, 2026-10-30: the brain said goodbye and
 *  called close_session_notes in the pronunciation part; the summary never
 *  ran): a close before the last part is refused (next-turn note) and the
 *  attempt's farewell is killed + retried; a post-close turn that arms a
 *  pronunciation target or asks something re-opens the lesson. Default ON. */
export const TUTOR_FIXED_SCRIPT_CLOSE_GUARD = process.env.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_CLOSE_GUARD !== 'off';

/** Fixed-script plans (GDI run 3, 2026-10-29): the opening turn puts the
 *  lesson outline on the board — one show_table titled with the plan title,
 *  a row per part (authored label, minutes). Default ON;
 *  NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_OUTLINE=off. */
export const TUTOR_FIXED_SCRIPT_OUTLINE = process.env.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_OUTLINE !== 'off';

/** Fixed-script plans (GDI run 4, 2026-10-29): when the FIRST segment carries
 *  `metadata.script`, the client speaks it as the opener (no brain opener),
 *  paints the outline, and advances to the next part with a FACT note.
 *  Default ON; NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_SPOKEN_OPENER=off. */
export const TUTOR_FIXED_SCRIPT_SPOKEN_OPENER = process.env.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_SPOKEN_OPENER !== 'off';

/** Fixed-script plans (GDI live, embed-1793326847152): a tutor turn that
 *  announces the move into the NEXT part ("Now let's move on to the open
 *  conversation.") with no advance_lesson moves the pointer as the turn
 *  budget does (lesson-plan/announced-move.ts); when that turn ended with no
 *  question, one continuation directive starts the new part once the audio
 *  has finished. Independent of TUTOR_FIXED_SCRIPT_AUTO_ADVANCE (turning that
 *  off does not stop this path). Default ON;
 *  NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_ANNOUNCED_ADVANCE=off.
 */
export const TUTOR_FIXED_SCRIPT_ANNOUNCED_ADVANCE = process.env.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_ANNOUNCED_ADVANCE !== 'off';
/** Task 26 §A (GDI run 13): fixed-script part transitions from the plan's
 *  `metadata.transition` — an "offer" part asks for one more practice
 *  sentence or the move on at its budget; a "bridge" part's advance note
 *  asks for one sentence of what it learned (lesson-plan/fixed-script.ts).
 *  Default ON; NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_TRANSITIONS=off. */
export const TUTOR_FIXED_SCRIPT_TRANSITIONS = process.env.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_TRANSITIONS !== 'off';
/** Task 26 §B1 (GDI run 13, 1435 s): a due fixed-script forced close on a
 *  turn that asked the student something runs ONE wrap turn (reply + goodbye
 *  + close_session_notes) before the fixed goodbye. Default ON;
 *  NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_CLOSE_WRAP=off. */
export const TUTOR_FIXED_SCRIPT_CLOSE_WRAP = process.env.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_CLOSE_WRAP !== 'off';

/** Level check (GDI run 4: set_working_level never called): leaving the
 *  level-check segment with no level stored asks /api/tutor/level/estimate
 *  for one from the student's answers. Default ON;
 *  NEXT_PUBLIC_TUTOR_WORKING_LEVEL_ESTIMATE=off. */
export const TUTOR_WORKING_LEVEL_ESTIMATE = process.env.NEXT_PUBLIC_TUTOR_WORKING_LEVEL_ESTIMATE !== 'off';

/** Embed (GDI run 4: "Part n · label" titles were in the page data but not
 *  visible): the current board page's title as a slim one-line header above
 *  the board content. Default ON; NEXT_PUBLIC_TUTOR_PAGE_TITLE_HEADER=off. */
export const TUTOR_PAGE_TITLE_HEADER = process.env.NEXT_PUBLIC_TUTOR_PAGE_TITLE_HEADER !== 'off';

/** Task 17 (GDI live, embed-1793326847152 02:35:44): a repeat_after_correct /
 *  required_phrase_missing kill lets the sentence in flight finish (capped at
 *  4 s) instead of cutting it mid-word — the offending sentence is a later
 *  one (voice/speech-queue-boundary.ts). Default ON;
 *  NEXT_PUBLIC_TUTOR_KILL_SENTENCE_BOUNDARY=off. */
export const TUTOR_KILL_SENTENCE_BOUNDARY = process.env.NEXT_PUBLIC_TUTOR_KILL_SENTENCE_BOUNDARY !== 'off';

/** Task 18 §B (GDI run 6): on a fixed-script plan, the client puts a part's
 *  authored card up after the part's first substantive turn when the brain
 *  did not (lesson-plan/fixed-script.ts segmentNeedsAutoCard). Default ON;
 *  NEXT_PUBLIC_TUTOR_SEGMENT_CARD_AUTO=off. */
export const TUTOR_SEGMENT_CARD_AUTO = process.env.NEXT_PUBLIC_TUTOR_SEGMENT_CARD_AUTO !== 'off';

/** Task 19 §A2 (GDI run 7: assembled answers dropped as self-voice): the
 *  perception classifier keeps a non-verbatim answer whose onset sits at the
 *  matched line's end (voice/perception-classifier.ts isAnswerAtPlaybackEnd).
 *  Default ON; NEXT_PUBLIC_TUTOR_SELF_VOICE_ANSWER_END=off. */
export const TUTOR_SELF_VOICE_ANSWER_END = process.env.NEXT_PUBLIC_TUTOR_SELF_VOICE_ANSWER_END !== 'off';
/** Task 22 §E (GDI run 10, 241 s): in a language session a student transcript
 *  that only reads the current board question aloud (voice/correct-retry.ts
 *  isBoardReadAloud) dispatches no brain turn — the answer is still to come.
 *  Default ON; NEXT_PUBLIC_TUTOR_BOARD_READ_ALOUD_HOLD=off. */
export const TUTOR_BOARD_READ_ALOUD_HOLD = process.env.NEXT_PUBLIC_TUTOR_BOARD_READ_ALOUD_HOLD !== 'off';
/** Task 24 §A1 (GDI run 12, 1092 s / 1168 s: both pronunciation clips were
 *  silent while the recogniser transcribed the sentence word-perfect): the
 *  clip is captured from the frames the speech recogniser hears (the
 *  perception / Ink hook's `onStudentAudioFrame`), not from the realtime
 *  hook's mic tap. Default ON; NEXT_PUBLIC_TUTOR_CLIP_FROM_PERCEPTION=off ⇒
 *  the realtime tap, as before. */
export const TUTOR_CLIP_FROM_PERCEPTION = process.env.NEXT_PUBLIC_TUTOR_CLIP_FROM_PERCEPTION !== 'off';
/** Task 25 §B (GDI run 13, 889 s): in a bilingual session a Japanese sentence
 *  quoting an English span of 3+ words is spoken as consecutive TTS requests,
 *  the English span in the English voice (voice/tts-language.ts
 *  splitSentenceForTts). The decision is client-side, so only the public flag
 *  works: default ON; NEXT_PUBLIC_TUTOR_TTS_SPLIT_QUOTED_SPANS=off ⇒ one
 *  request per sentence, as before. */
export const TUTOR_TTS_SPLIT_QUOTED_SPANS = process.env.NEXT_PUBLIC_TUTOR_TTS_SPLIT_QUOTED_SPANS !== 'off';

/** Task 27 §B (GDI run 14, 493 s): the student's card of a transition turn
 *  stays on the page the student answered on — with a part page pending, the
 *  turn-end part card waits for the turn's student cards
 *  (deferred-page-flush.ts orderTurnEndDispatches); a part page that already
 *  painted this turn sends a later student card to the previous page
 *  (previousPageTarget). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_STUDENT_CARDS_BEFORE_PART_PAGE=off ⇒ as before. */
export const TUTOR_STUDENT_CARDS_BEFORE_PART_PAGE = process.env.NEXT_PUBLIC_TUTOR_STUDENT_CARDS_BEFORE_PART_PAGE !== 'off';

/** Task 27 §C (GDI run 14, Image 47): the part chip strip follows the
 *  DISPLAYED segment — a pointer move whose part page is still deferred keeps
 *  the previous chip active until that page paints (rail-labels.ts
 *  displayedSegmentId). Display only (the reported pointer, the resume state
 *  and the completed set the host persists are unchanged). Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_RAIL_FOLLOWS_PAGE=off ⇒ the pointer at once. */
export const TUTOR_RAIL_FOLLOWS_PAGE = process.env.NEXT_PUBLIC_TUTOR_RAIL_FOLLOWS_PAGE !== 'off';

/** Task 27 §E (GDI run 14, 955–958 s): entering a part whose card is a
 *  question / choice menu — the off-part ask check (transition-ask.ts) runs
 *  on every turn that moved the pointer, the brain's own advance_lesson
 *  included (E1), and the client's advance lead names a choice menu (E2,
 *  fixedScriptChoiceMenuClause). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_TRANSITION_ASK_EVERY_ADVANCE=off ⇒ the FACT-note turn
 *  only, no menu clause. */
export const TUTOR_TRANSITION_ASK_EVERY_ADVANCE = process.env.NEXT_PUBLIC_TUTOR_TRANSITION_ASK_EVERY_ADVANCE !== 'off';

/** Task 27 §F (GDI run 14, 1093 s; pacing rule 2026-10-30): "move on" is an
 *  order — on a fixed-script lesson a student turn asking to move on ("let's
 *  do summary", "skip", "next", a later part's label after do / go to /
 *  start) is followed by a turn that advances, or the attempt is killed once
 *  (validator move_on_ignored; correct-retry.ts moveOnIgnored). Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_MOVE_ON_ORDER=off. */
export const TUTOR_MOVE_ON_ORDER = process.env.NEXT_PUBLIC_TUTOR_MOVE_ON_ORDER !== 'off';

/** Task 28 §D (GDI run 15, 444–518 s; "two tries, then teach"): after two
 *  attempts at the same model sentence / target word since the first repeat
 *  ask, a turn that asks for it again is killed once and retried (validator
 *  repeat_ask_after_two_tries; correct-retry.ts repeatAskAfterTwoTries).
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_REPEAT_ASK_TWO_TRIES=off. */
export const TUTOR_REPEAT_ASK_TWO_TRIES = process.env.NEXT_PUBLIC_TUTOR_REPEAT_ASK_TWO_TRIES !== 'off';

/** Task 29 §A (GDI run 16, 441–486 s / 672–734 s): a fixed-script offer
 *  part's hold starts when the offer is SPOKEN (offerAsked), not when its
 *  note is planted; a turn under a pending offer note that does not ask it
 *  is killed once and retried (validator transition_offer_missing); a
 *  declined spoken offer advances at the end of the next tutor turn.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_TRANSITION_OFFER_SPOKEN=off. */
export const TUTOR_TRANSITION_OFFER_SPOKEN = process.env.NEXT_PUBLIC_TUTOR_TRANSITION_OFFER_SPOKEN !== 'off';

/** Task 29 §E (GDI run 16, 1057–1143 s): the idle nudge after an unanswered
 *  say-it-aloud ask re-asks the repeat (idleNudgeDirective lastAskKind
 *  'repeat') instead of the part's menu, and the "no speech in 40 s"
 *  pronunciation note is held off the nudge turn for the next real student
 *  turn. Client-side: default ON; NEXT_PUBLIC_TUTOR_IDLE_NUDGE_REPEAT_KIND=off. */
export const TUTOR_IDLE_NUDGE_REPEAT_KIND = process.env.NEXT_PUBLIC_TUTOR_IDLE_NUDGE_REPEAT_KIND !== 'off';

/** Task 29 §J1 (GDI run 16, 1409 → 1452 s): on lesson_closed (any source)
 *  the host's Q-pin is cleared (event qpin_cleared_closed) and the
 *  <active_problem> card is emptied, so a post-close extra never returns to
 *  the lesson's last question. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_CLOSE_CLEARS_OPEN_QUESTION=off. */
export const TUTOR_CLOSE_CLEARS_OPEN_QUESTION = process.env.NEXT_PUBLIC_TUTOR_CLOSE_CLEARS_OPEN_QUESTION !== 'off';

/** Task 27 §G (GDI run 14, 1141 s): a microphone device change mid-session
 *  (devicechange, the shared track ended, or muted at the source > 3 s)
 *  re-acquires the shared capture on the current default input and swaps the
 *  source of every capture graph without reconnecting the WebSockets
 *  (shared-mic.ts reacquireSharedMicStream / followSharedMicSwaps;
 *  mic-reacquire.ts). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_MIC_REACQUIRE=off. */
export const TUTOR_MIC_REACQUIRE = process.env.NEXT_PUBLIC_TUTOR_MIC_REACQUIRE !== 'off';

/** Task 30 §A1 / §A3 (GDI run 17, 477–488 s): an answer to the tutor's
 *  pending offer ("one more or move on?") or numbered menu is made of the
 *  tutor's own words — the self-voice lookback gates (1.6 / 1.7) stand down
 *  for it (pendingAnswerVocabularyFor → classifier `pendingAnswerVocabulary`),
 *  and a self-voice drop of such an answer does not count toward the noise
 *  nag (countsAsNoiseCancel). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_PENDING_ANSWER_EXEMPT=off. */
export const TUTOR_PENDING_ANSWER_EXEMPT = process.env.NEXT_PUBLIC_TUTOR_PENDING_ANSWER_EXEMPT !== 'off';

/** Task 30 §D2 (GDI run 17, 746 s / 1112 s): a validator retry of an attempt
 *  the student already heard part of is told those sentences (never say them
 *  again, no "Okay, let's keep going" opener) — heardSentencesNote. §D1's
 *  offer continuation rides TUTOR_TRANSITION_OFFER_SPOKEN. Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_RETRY_HEARD_NOTE=off. */
export const TUTOR_RETRY_HEARD_NOTE = process.env.NEXT_PUBLIC_TUTOR_RETRY_HEARD_NOTE !== 'off';

/** Task 30 §F1 (GDI run 17, 688 s): a spoken sentence that near-copies the
 *  turn's preceding sentence (isAdjacentDuplicate) is dropped. Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_ADJACENT_DUPLICATE_DROP=off. */
export const TUTOR_ADJACENT_DUPLICATE_DROP = process.env.NEXT_PUBLIC_TUTOR_ADJACENT_DUPLICATE_DROP !== 'off';

/** Task 30 §H (GDI run 17, 1198 s): a student turn that picks an option of the
 *  numbered menu the last tutor turn read (resolveMenuPick: the digit / number
 *  word, or words found in exactly one option) carries a note naming it, so
 *  the options are not listed again. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_MENU_PICK_RESOLVE=off. */
export const TUTOR_MENU_PICK_RESOLVE = process.env.NEXT_PUBLIC_TUTOR_MENU_PICK_RESOLVE !== 'off';
/** Wave 11 (GDI run 7, 187 s "Can you please talk in English?"): a request to be spoken to in a session language restates
 *  the previous turn in it, re-asks the open ask and sticks for the session (language-request.ts). Client-side: default
 *  ON; NEXT_PUBLIC_TUTOR_LANGUAGE_REQUEST=off. */
export const TUTOR_LANGUAGE_REQUEST = process.env.NEXT_PUBLIC_TUTOR_LANGUAGE_REQUEST !== 'off';


/** Task 30 §J1 (GDI run 17, 112 s): the level check's card of the student's
 *  own answer needs a correct / partly-correct precheck verdict and an answer
 *  (not a request). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_LEVEL_CHECK_CARD_NEEDS_VERDICT=off. */
export const TUTOR_LEVEL_CHECK_CARD_NEEDS_VERDICT = process.env.NEXT_PUBLIC_TUTOR_LEVEL_CHECK_CARD_NEEDS_VERDICT !== 'off';

/** Task 30 §J2 (GDI run 17, 299 s / 855 s): in a language lesson a standalone
 *  digit 0–12 in the student's transcript (the recogniser's spelling, not the
 *  learner's) is spelled out before the brain sees it and before any student
 *  card is built (normaliseDigitsToWords). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_LANGUAGE_DIGIT_WORDS=off. */
export const TUTOR_LANGUAGE_DIGIT_WORDS = process.env.NEXT_PUBLIC_TUTOR_LANGUAGE_DIGIT_WORDS !== 'off';

/** Task 30 fix round 1 S9 (smoke run 241 s): a Q-pin gist whose content words
 *  are < 60 % found in the tutor turn (an invented example answer) is replaced
 *  by the turn's verbatim ask sentence (gistGrounded). Client-side: default
 *  ON; NEXT_PUBLIC_TUTOR_QPIN_GIST_GROUNDED=off. */
export const TUTOR_QPIN_GIST_GROUNDED = process.env.NEXT_PUBLIC_TUTOR_QPIN_GIST_GROUNDED !== 'off';

/** Task 30 fix round 2 E1 (r1 148 s): when every sentence of an attempt was
 *  dropped as narration, the done-frame backfill of the turn text from the
 *  server's unfiltered fullText goes through the same sentence filters
 *  (filterNarrationText). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_NARRATION_BACKFILL_FILTER=off. */
export const TUTOR_NARRATION_BACKFILL_FILTER = process.env.NEXT_PUBLIC_TUTOR_NARRATION_BACKFILL_FILTER !== 'off';

/** Task 30 fix round 2 E13 (r1 569 / 628 s): a show_sentence whose text is
 *  already a card on the current page — any kind, emphasis or gloss, the
 *  client's auto cards included — is skipped, never drawn as a second card.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_SENTENCE_SAME_TEXT_DEDUP=off. */
export const TUTOR_SENTENCE_SAME_TEXT_DEDUP = process.env.NEXT_PUBLIC_TUTOR_SENTENCE_SAME_TEXT_DEDUP !== 'off';

/** Task 30 fix round 3 R2-2a (run r2, 147–437 s: the same concept question
 *  asked eight times): a language-lesson turn whose ask has the same gist as
 *  the asks of the two previous tutor turns, with neither student turn in
 *  between answering it, is killed once and retried (validator
 *  same_question_third_time). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_SAME_QUESTION_THIRD_TIME=off. */
export const TUTOR_SAME_QUESTION_THIRD_TIME = process.env.NEXT_PUBLIC_TUTOR_SAME_QUESTION_THIRD_TIME !== 'off';

/** Task 30 fix round 4 R3-7 (run r3, 1314–1348 s: the summary closed before
 *  its content was spoken): close_session_notes while the current part's
 *  requiredPhrases are unsaid is refused once per part (validator
 *  close_before_required_phrases). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_CLOSE_REQUIRED_PHRASES=off. */
export const TUTOR_CLOSE_REQUIRED_PHRASES = process.env.NEXT_PUBLIC_TUTOR_CLOSE_REQUIRED_PHRASES !== 'off';

/** Task 30 fix round 4 R3-13 (run r3, 155–372 s: the level check asked one of
 *  its three authored questions): in a fixed-script language part whose
 *  authored card is a numbered list of questions, each student turn carries
 *  an urgent note naming the next question not yet asked. Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_NUMBERED_QUESTION_NOTE=off. */
export const TUTOR_NUMBERED_QUESTION_NOTE = process.env.NEXT_PUBLIC_TUTOR_NUMBERED_QUESTION_NOTE !== 'off';

/** Task 30 fix round 6 R5-1 (run r5: the Start tap ran before the lesson plan
 *  loaded and the free-conversation kickoff opened instead of the authored
 *  script): the session opener waits (≤ 4 s) for an expected lesson plan and,
 *  on a fixed script, for the spoken opener's prompt. Client-side: default
 *  ON; NEXT_PUBLIC_TUTOR_OPENER_WAITS_FOR_PLAN=off. */
export const TUTOR_OPENER_WAITS_FOR_PLAN = process.env.NEXT_PUBLIC_TUTOR_OPENER_WAITS_FOR_PLAN !== 'off';

/** Task 30 fix round 8 A4 (run r6-A 1197 s): an empty turn in a fixed-script /
 *  language lesson with a pending ask re-asks it instead of "didn't come up
 *  with anything". Client-side: default ON; NEXT_PUBLIC_TUTOR_EMPTY_TURN_REASK=off. */
export const TUTOR_EMPTY_TURN_REASK = process.env.NEXT_PUBLIC_TUTOR_EMPTY_TURN_REASK !== 'off';

/** Task 31 §D (GDI run 18, 1118 s): after a brain turn that moved a
 *  fixed-script pointer itself (advance_lesson), the next brain turn carries
 *  the part's entry note (choice menu when unread). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_BRAIN_ADVANCE_ENTRY_NOTE=off. */
export const TUTOR_BRAIN_ADVANCE_ENTRY_NOTE = process.env.NEXT_PUBLIC_TUTOR_BRAIN_ADVANCE_ENTRY_NOTE !== 'off';

/** Task 31 §F (GDI run 18, 979–1061 s): in a language lesson, after the
 *  student answered the tutor's last two questions on the same point, the
 *  next brain turn carries the check-in note (no third follow-up).
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_PROBE_CHECKIN=off. */
export const TUTOR_PROBE_CHECKIN = process.env.NEXT_PUBLIC_TUTOR_PROBE_CHECKIN !== 'off';

/** Task 33 §A (GDI bot run r8, 415–504 s: the accepted offer re-asked six
 *  times): while an accepted offer's new item is unasked, a turn that asks
 *  the offer again (or "which do you mean?") is killed once and retried
 *  (validator offer_reasked_after_accept), the accepted note is re-planted
 *  first on the next student turn, and the summary's close offer takes a
 *  bare "Yes" as one more item. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_OFFER_REASK_KILL=off. */
export const TUTOR_OFFER_REASK_KILL = process.env.NEXT_PUBLIC_TUTOR_OFFER_REASK_KILL !== 'off';

/** Task 33 §C (GDI bot run r8, 1153–1220 s: the pronunciation menu asked
 *  seven times): in a fixed-script part whose card is a numbered choice
 *  menu, after MENU_ASK_CAP (2) tutor turns asked the menu with no option
 *  picked, the student's next non-pick reply moves the lesson on itself
 *  (reason=menu_unpicked, "skipping the practice today"). Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_MENU_ASK_CAP=off. */
export const TUTOR_MENU_ASK_CAP = process.env.NEXT_PUBLIC_TUTOR_MENU_ASK_CAP !== 'off';

/** Task 33 §E (GDI bot run r8, 578 s: "We can finish it." mid-part was
 *  ignored): on a fixed-script lesson before its closing part, a stop
 *  request makes the engine plant the recap + "the parts left, or stop
 *  now?" choice itself (the refusal path's response, in every part); a stop
 *  right after that choice closes. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_STOP_REQUEST_CHOICE=off. */
export const TUTOR_STOP_REQUEST_CHOICE = process.env.NEXT_PUBLIC_TUTOR_STOP_REQUEST_CHOICE !== 'off';

/** Task 33 fix round 1 (R9-2, bot run r9 847–850 s): when the one
 *  transition_offer_missing retry is still offer-less, the engine speaks
 *  the offer itself as the turn's last sentence(s) and records it spoken.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_OFFER_ENGINE_FALLBACK=off. */
export const TUTOR_OFFER_ENGINE_FALLBACK = process.env.NEXT_PUBLIC_TUTOR_OFFER_ENGINE_FALLBACK !== 'off';

/** Task 34 §A (bot run r11, 1120–1290 s: the same ask eight times to "I
 *  see." / "OK."): in a language lesson, two non-attempts in a row to the
 *  same ask plant the model-answer-and-move-on note; a turn that still
 *  re-asks has the ask dropped and the part's turn budget counts as reached.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_NO_ATTEMPT_MOVE_ON=off. */
export const TUTOR_NO_ATTEMPT_MOVE_ON = process.env.NEXT_PUBLIC_TUTOR_NO_ATTEMPT_MOVE_ON !== 'off';

/** Task 35 §A (bot run r14, 203–207 s: the advancing turn was killed, the
 *  page re-armed, and the retry's re-emitted advance_lesson moved the
 *  pointer a SECOND time — present-perfect ran without its entry note): on a
 *  fixed script the kill re-arm plants the part's entry note and marks the
 *  advance as already made, so the retry's {to:"next"} is satisfied, not
 *  applied again. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_KILL_REARM_ENTRY_NOTE=off. */
export const TUTOR_KILL_REARM_ENTRY_NOTE = process.env.NEXT_PUBLIC_TUTOR_KILL_REARM_ENTRY_NOTE !== 'off';

/** Task 35 §B (bot run r14, 693–737 s: the summary re-asked its answered
 *  contrast question): in a fixed-script closing / recap part the questions
 *  already asked and answered ride the required_phrase_missing retry
 *  directive and a running note, and a sentence that re-asks one is dropped.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_ANSWERED_GUARD=off. */
export const TUTOR_ANSWERED_GUARD = process.env.NEXT_PUBLIC_TUTOR_ANSWERED_GUARD !== 'off';

/** Task 33 §B (registered in the final review): the directive-echo /
 *  steering / part-state / board-write narration drops in meta-narration.ts
 *  (read there via flagOn, language lessons only). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_DIRECTIVE_ECHO_DROP=off. */
export const TUTOR_DIRECTIVE_ECHO_DROP = process.env.NEXT_PUBLIC_TUTOR_DIRECTIVE_ECHO_DROP !== 'off';

/** Task 36 §B (bot run r18: the session cap hit the summary unclosed): on a
 *  fixed-script plan, once the lesson's elapsed time reaches (plan minutes −
 *  closing part minutes − 1), the engine moves to the closing part on the
 *  next student turn (an optional part in progress runs on; the closing part
 *  itself is never cut). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_LESSON_TIME_GUARD=off. */
export const TUTOR_LESSON_TIME_GUARD = process.env.NEXT_PUBLIC_TUTOR_LESSON_TIME_GUARD !== 'off';

/** Task 38 §A (voice run 19, 522–530 s: a turn rendered a card and said
 *  nothing): in a language / fixed-script lesson a turn with board tools but
 *  zero spoken sentences speaks the card's sentence as the model, else
 *  re-asks the pending question. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_SILENT_TURN_FALLBACK=off. */
export const TUTOR_SILENT_TURN_FALLBACK = process.env.NEXT_PUBLIC_TUTOR_SILENT_TURN_FALLBACK !== 'off';

/** Task 38 §D (voice run 19, 963–971 s: a lead-in left behind by a dropped
 *  question, then said again by the continuation): in a language /
 *  fixed-script lesson a question lead-in is held one sentence (dropped with
 *  its dropped question, or when nothing follows), and a continuation's first
 *  sentence restating the continued turn's last sentence is dropped.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_QUESTION_LEAD_IN_HOLD=off. */
export const TUTOR_QUESTION_LEAD_IN_HOLD = process.env.NEXT_PUBLIC_TUTOR_QUESTION_LEAD_IN_HOLD !== 'off';

/** Task 38 §F (voice run 19, 1016–1037 s: repeats demanded after correct
 *  sentences): a reordered recast of a checked-correct sentence and a
 *  "say it in one sentence starting with X" ask already met are killed
 *  (repeat_after_correct), and the retry's repeat asks are dropped (the
 *  move-on line covers an empty retry). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_REPEAT_AFTER_CORRECT_DROP=off. */
export const TUTOR_REPEAT_AFTER_CORRECT_DROP = process.env.NEXT_PUBLIC_TUTOR_REPEAT_AFTER_CORRECT_DROP !== 'off';

/** Task 38 §G1 (voice run 19, 1227 s: the summary page flushed empty): on a
 *  curated fixed-script plan a recap part's page carries its authored Recap
 *  card (the mustRemember list) when it flushes without one. Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_RECAP_CARD_ON_FLUSH=off. */
export const TUTOR_RECAP_CARD_ON_FLUSH = process.env.NEXT_PUBLIC_TUTOR_RECAP_CARD_ON_FLUSH !== 'off';

/** Task 38 §G2 (voice run 19, 1222 / 1274 s: "Are you ready to close the
 *  lesson …?" in the summary): a readiness question in a fixed script's
 *  recap / closing part is dropped. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_NO_READINESS=off. */
export const TUTOR_FIXED_SCRIPT_NO_READINESS = process.env.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_NO_READINESS !== 'off';

/** Task 38 §H (voice run 19, 1187 s: an all-Japanese feedback turn in an
 *  English-first lesson): in a language lesson with tutor_languages[0] =
 *  'en', a tutor attempt with no English sentence after an English student
 *  turn is killed and retried ("Say it in English first; Japanese only as a
 *  short gloss."). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_TEACHING_LANGUAGE_FIRST=off. */
export const TUTOR_TEACHING_LANGUAGE_FIRST = process.env.NEXT_PUBLIC_TUTOR_TEACHING_LANGUAGE_FIRST !== 'off';

/** Task 38 §I3 (voice run 19, 933 / 948 / 962 s): in a fixed script's
 *  conversation (extension) part, a student answer the tutor does not
 *  correct is carded as the student's own sentence (source 'checked').
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_CONVERSATION_ANSWER_CARDS=off. */
export const TUTOR_CONVERSATION_ANSWER_CARDS = process.env.NEXT_PUBLIC_TUTOR_CONVERSATION_ANSWER_CARDS !== 'off';

/** Task 38 fix round 1 (R24-1, bot run r24 472–509 s: an announced move on
 *  the offer part advanced with the offer never asked): on an offer part an
 *  announced move is killed + retried like transition_offer_missing (engine
 *  fallback after the one retry) and does not advance until the offer was
 *  asked, unless the student declined / ordered the move on. Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_ANNOUNCED_OFFER_FIRST=off. */
export const TUTOR_ANNOUNCED_OFFER_FIRST = process.env.NEXT_PUBLIC_TUTOR_ANNOUNCED_OFFER_FIRST !== 'off';

/** Task 39 §B (voice run 20, 166–172 s): the transition_ask_off_part retry
 *  still asked the off-card quiz — on that retry off-card questions are
 *  dropped and, when it ends without the part's own question, the engine
 *  speaks the authored card question. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_CARD_ASK_ENGINE_FALLBACK=off. */
export const TUTOR_CARD_ASK_ENGINE_FALLBACK = process.env.NEXT_PUBLIC_TUTOR_CARD_ASK_ENGINE_FALLBACK !== 'off';

/** Task 39 §D (voice run 20, 1126 s): a retry after a kill that already moved
 *  the pointer re-emitted advance_lesson({to:"next"}); the client satisfied it
 *  with the committed move but the route resolved "next" one part further
 *  ("summary") and the retry wrapped the lesson up. The request now names the
 *  applied move and the route answers "already there". Client-side: default
 *  ON; NEXT_PUBLIC_TUTOR_RETRY_ADVANCE_ALREADY_APPLIED=off. */
export const TUTOR_RETRY_ADVANCE_ALREADY_APPLIED = process.env.NEXT_PUBLIC_TUTOR_RETRY_ADVANCE_ALREADY_APPLIED !== 'off';

/** Task 39 §D: a turn that spoke the part's entry menu drops the wrap-up /
 *  stop-choice sentences after it (the menu is the authored step). Language
 *  lessons (fixed script). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_MENU_WRAP_UP_DROP=off. */
export const TUTOR_MENU_WRAP_UP_DROP = process.env.NEXT_PUBLIC_TUTOR_MENU_WRAP_UP_DROP !== 'off';

/** Task 39 §E (voice run 20, 788–794 s): the offer-accepted turn asked no
 *  item ("Let's do one more … Let's move on.") — killed + retried with the
 *  ask-one-new-item order; a bare "Let's move on." that turn is dropped.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_OFFER_ACCEPTED_ASK=off. */
export const TUTOR_OFFER_ACCEPTED_ASK = process.env.NEXT_PUBLIC_TUTOR_OFFER_ACCEPTED_ASK !== 'off';

/** Task 39 §C + fix round 1 (M-1): the full recast sentence card (never its
 *  comma clause), the short-line exemption for corrections / restatements,
 *  and the correction card from a spoken full recast or a correction-kind
 *  judge note (never a fragment splice). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_FULL_RECAST_CARD=off. */
export const TUTOR_FULL_RECAST_CARD = process.env.NEXT_PUBLIC_TUTOR_FULL_RECAST_CARD !== 'off';

/** Task 39 fix round 1 (R26-1): after a non-answer student turn, a reply that
 *  asks nothing gets the pending ask appended by the engine. Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_NON_ANSWER_RETURN_ASK=off. */
export const TUTOR_NON_ANSWER_RETURN_ASK = process.env.NEXT_PUBLIC_TUTOR_NON_ANSWER_RETURN_ASK !== 'off';

/** Task 39 fix round 1 (R26-2): the announced-move detector reads Japanese
 *  move shapes (次は…に進みましょう / ここまでにして …). Client-side: default
 *  ON; NEXT_PUBLIC_TUTOR_JA_ANNOUNCED_MOVE=off. */
export const TUTOR_JA_ANNOUNCED_MOVE = process.env.NEXT_PUBLIC_TUTOR_JA_ANNOUNCED_MOVE !== 'off';

/** Task 39 fix round 1 (R26-3): a lone "Yes." to ANY "one more X, or move on?"
 *  choice the last tutor turn asked (planted or brain-made) = one more.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_LONE_YES_ANY_CHOICE=off. */
export const TUTOR_LONE_YES_ANY_CHOICE = process.env.NEXT_PUBLIC_TUTOR_LONE_YES_ANY_CHOICE !== 'off';

/** Task 40 §A (bot run r28, 439–488 s): two answers=neither verdicts in a row
 *  on the same ask = two non-attempts — the move-on note, and any re-ask of
 *  it dropped that turn. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_NEITHER_STREAK_MOVE_ON=off. */
export const TUTOR_NEITHER_STREAK_MOVE_ON = process.env.NEXT_PUBLIC_TUTOR_NEITHER_STREAK_MOVE_ON !== 'off';

/** Task 40 §C (bot run r28, 1230 s): the move-on note and the close note on
 *  the same turn — the model answer first, then the close. Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_MOVE_ON_BEFORE_CLOSE=off. */
export const TUTOR_MOVE_ON_BEFORE_CLOSE = process.env.NEXT_PUBLIC_TUTOR_MOVE_ON_BEFORE_CLOSE !== 'off';

/** Task 41 §A (bot run r32: present-perfect ran 462 s for 3.5 min; the
 *  lesson-time guard skipped pronunciation): a fixed-script part with an
 *  authored turn budget is also due at its minutes × 1.5, and any part is due
 *  when the lesson clock leaves only the later parts' minutes before the
 *  guard. The guard's skip names the skipped parts once. Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_PART_TIME_CAP=off. */
export const TUTOR_PART_TIME_CAP = process.env.NEXT_PUBLIC_TUTOR_PART_TIME_CAP !== 'off';

/** Task 41 §B (bot run r31, 1111 / 1136 s): the precheck said the reply was
 *  correct and the brain re-asked the same ask — the re-ask is dropped, the
 *  acknowledgement kept (language lessons). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_CORRECT_REPLY_REASK_DROP=off. */
export const TUTOR_CORRECT_REPLY_REASK_DROP = process.env.NEXT_PUBLIC_TUTOR_CORRECT_REPLY_REASK_DROP !== 'off';

/** Task 42 §D (bot run r36, 941–972 s): a choice-menu part entered with no
 *  menu presented on the entering turn or the turn after — the engine appends
 *  the authored menu to that turn, and the pronunciation auto-arm waits for a
 *  pick (or the menu-ask cap). Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_MENU_ENTRY_FALLBACK=off. */
export const TUTOR_MENU_ENTRY_FALLBACK = process.env.NEXT_PUBLIC_TUTOR_MENU_ENTRY_FALLBACK !== 'off';

/** Task 43 §M (voice run 21, image 92): on the recap part the summary's
 *  quoted examples and the student's own earlier sentences were carded under
 *  the recap card — the recap now cards corrections (and a contrast pair)
 *  only. Client-side: default ON; NEXT_PUBLIC_TUTOR_RECAP_CORRECTION_CARDS_ONLY=off. */
export const TUTOR_RECAP_CORRECTION_CARDS_ONLY = process.env.NEXT_PUBLIC_TUTOR_RECAP_CORRECTION_CARDS_ONLY !== 'off';

/** Task 43 §C (voice run 21, 143 s): the brain's transition and its bridge
 *  clause announced the same part in consecutive sentences — the second is
 *  dropped (bare) or keeps only its teaching (fixed scripts). Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_PART_ANNOUNCE_DEDUPE=off. */
export const TUTOR_PART_ANNOUNCE_DEDUPE = process.env.NEXT_PUBLIC_TUTOR_PART_ANNOUNCE_DEDUPE !== 'off';

/** Task 43 §D (voice run 21, 290 s): the part's authored card question,
 *  already answered, was asked again ("Now let's go back to the question on
 *  the board: …") — the re-ask is dropped in any part (the card question
 *  only). Client-side: default ON; NEXT_PUBLIC_TUTOR_ANSWERED_CARD_REASK_DROP=off. */
export const TUTOR_ANSWERED_CARD_REASK_DROP = process.env.NEXT_PUBLIC_TUTOR_ANSWERED_CARD_REASK_DROP !== 'off';

/** Task 43 §G2 (voice run 21, 689 s): a budget advance on a turn that
 *  corrected the student's sentence holds one boundary so the correction card
 *  is seen before the page flips. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_CORRECTION_CARD_HOLDS_ADVANCE=off. */
export const TUTOR_CORRECTION_CARD_HOLDS_ADVANCE = process.env.NEXT_PUBLIC_TUTOR_CORRECTION_CARD_HOLDS_ADVANCE !== 'off';

/** Task 43 §J (voice run 21, 976 s): a correction card of the student's last
 *  sentence on an advancing turn goes on the NEW page under the part card
 *  (not in front of the break / on the previous page). Client-side: default
 *  ON; NEXT_PUBLIC_TUTOR_CORRECTION_CARD_ON_NEW_PAGE=off. */
export const TUTOR_CORRECTION_CARD_ON_NEW_PAGE = process.env.NEXT_PUBLIC_TUTOR_CORRECTION_CARD_ON_NEW_PAGE !== 'off';

/** Task 43 §I (voice run 21, 961 / 976 s): the student's sentence carded as a
 *  model one turn and its correction the next left two cards of one sentence
 *  — a correction card replaces the auto model card of the same sentence on
 *  the current page (as the brain's show_sentence does). Client-side: default
 *  ON; NEXT_PUBLIC_TUTOR_CORRECTION_REPLACES_MODEL_CARD=off. */
export const TUTOR_CORRECTION_REPLACES_MODEL_CARD = process.env.NEXT_PUBLIC_TUTOR_CORRECTION_REPLACES_MODEL_CARD !== 'off';

/** Task 43 §F (voice run 21, 441 / 624 / 874 / 1116 s): validator kills cut
 *  sentences the learner had already heard — on validator-prone turns (an
 *  urgent runtime note delivered, a third repeat try, a move-on request) the
 *  attempt's TTS gate stays closed until the end-of-turn validators pass,
 *  capped at 3.5 s (bounded latency; a kill then drops the text pre-audio).
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_VALIDATOR_TTS_HOLD=off. */
export const TUTOR_VALIDATOR_TTS_HOLD = process.env.NEXT_PUBLIC_TUTOR_VALIDATOR_TTS_HOLD !== 'off';

/** Task 44 R1 (voice run 22, 473 / 1108 s): a due budget / time advance on a
 *  turn that ends with a question to the learner is held with no cap; it
 *  fires at the start of the student's reply turn. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_ADVANCE_WAITS_FOR_REPLY=off restores the capped holds. */
export const TUTOR_ADVANCE_WAITS_FOR_REPLY = process.env.NEXT_PUBLIC_TUTOR_ADVANCE_WAITS_FOR_REPLY !== 'off';

/** Task 44 R2 (voice run 22, 580 / 1059 s): an offer or proposal ends the
 *  turn — a later ask in the same turn is dropped before audio, and the turn
 *  after an accepted offer never re-offers. Fixed scripts. Client-side:
 *  default ON; NEXT_PUBLIC_TUTOR_OFFER_ENDS_TURN=off. */
export const TUTOR_OFFER_ENDS_TURN = process.env.NEXT_PUBLIC_TUTOR_OFFER_ENDS_TURN !== 'off';

/** Task 44 R3 (voice run 22, 1153 s): one authority per action — once the
 *  learner's menu pick is resolved, the transition-ask validator and the
 *  engine's menu fallback stand down. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_MENU_PICK_SINGLE_AUTHORITY=off. */
export const TUTOR_MENU_PICK_SINGLE_AUTHORITY = process.env.NEXT_PUBLIC_TUTOR_MENU_PICK_SINGLE_AUTHORITY !== 'off';

/** Task 44 R3 (voice run 22, 99 s): the brain's own re-paint of the part's
 *  authored card (tagged "[intermediate]") under the engine's card — dropped
 *  when the authored card already stands on the current page. Fixed scripts.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_AUTHORED_CARD_DEDUPE=off. */
export const TUTOR_AUTHORED_CARD_DEDUPE = process.env.NEXT_PUBLIC_TUTOR_AUTHORED_CARD_DEDUPE !== 'off';

// ── Task 45 (voice run 23, embed-1793747507104) ─────────────────────────────
/** Task 45 §7b (1240 s): a held budget / time advance does not fire on a reply
 *  that ACCEPTS the tutor's "one more …, or move on?" offer — the accepted
 *  item runs (ask → answer) and the next reply fires it; at most
 *  FIXED_SCRIPT_HELD_ADVANCE_MAX_OFFER_WAITS acceptances per part. Fixed
 *  scripts. Client-side: default ON; NEXT_PUBLIC_TUTOR_HELD_ADVANCE_WAITS_FOR_OFFER_ITEM=off. */
export const TUTOR_HELD_ADVANCE_WAITS_FOR_OFFER_ITEM = process.env.NEXT_PUBLIC_TUTOR_HELD_ADVANCE_WAITS_FOR_OFFER_ITEM !== 'off';
/** Task 45 §5 (865–876 s): the no-ask continuation turn re-spoke the verdict
 *  ("Your sentence is correct, and "for six months" fits well.") before its
 *  question — its leading verdict-echo sentences are dropped before audio.
 *  Fixed scripts. Client-side: default ON; NEXT_PUBLIC_TUTOR_NOASK_VERDICT_ECHO_DROP=off. */
export const TUTOR_NOASK_VERDICT_ECHO_DROP = process.env.NEXT_PUBLIC_TUTOR_NOASK_VERDICT_ECHO_DROP !== 'off';
/** Task 45 §1 (98–120 s): the judge's advisory correction note is scoped to
 *  the part it was planted in — never planted in the level check (its
 *  answers are not graded), and dropped unspent when the pointer has left
 *  that part (the 20 s timeout volunteered it into the next part, where the
 *  brain retracted a "Good." against the wrong question). Fixed scripts.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_JUDGE_NOTE_PART_SCOPED=off. */
export const TUTOR_JUDGE_NOTE_PART_SCOPED = process.env.NEXT_PUBLIC_TUTOR_JUDGE_NOTE_PART_SCOPED !== 'off';
/** Task 45 §2b (180–235 s): the part's authored card question counts as
 *  answered when the student answered the tutor's paraphrase of it correctly
 *  (the card's hint starter satisfied, or the paraphrase shares the card's
 *  content words) — so the Task 43 §D re-ask drop sees it. Fixed scripts.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_CARD_ANSWERED_IN_SUBSTANCE=off. */
export const TUTOR_CARD_ANSWERED_IN_SUBSTANCE = process.env.NEXT_PUBLIC_TUTOR_CARD_ANSWERED_IN_SUBSTANCE !== 'off';
/** Task 45 §3 (374 s / 646 s): after a correction cycle the affirmed retry
 *  goes on the board whatever the precheck said, and a one-word fix the
 *  tutor elicited ("presentations or presentation?" → "presentations")
 *  repaints the student's card with the substitution. Language lessons.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_RETRY_CARD=off. */
export const TUTOR_RETRY_CARD = process.env.NEXT_PUBLIC_TUTOR_RETRY_CARD !== 'off';
/** Task 45 §4/§6 (721 s / 1010 s): on an advancing turn the part page turns
 *  when the tutor SAYS the move ("Let's move on to …"), not when the brain
 *  stream ends — the turn's student / correction cards paint on the old page
 *  at their own sentence and stay visible through the verdict; the page
 *  break and the new part's card are anchored to the transition sentence.
 *  Fixed scripts. Client-side: default ON; NEXT_PUBLIC_TUTOR_PAGE_BREAK_ON_TRANSITION_SENTENCE=off. */
export const TUTOR_PAGE_BREAK_ON_TRANSITION_SENTENCE = process.env.NEXT_PUBLIC_TUTOR_PAGE_BREAK_ON_TRANSITION_SENTENCE !== 'off';
/** Task 45 §7a (1158 s): a pronunciation item the learner already practised
 *  in this part is never given again — the turn is retried pre-audio with
 *  the practised list (the plan's "every item is NEW" rule, engine-held).
 *  Fixed scripts with pronunciation targets. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_PRON_ITEM_REPEAT_KILL=off. */
export const TUTOR_PRON_ITEM_REPEAT_KILL = process.env.NEXT_PUBLIC_TUTOR_PRON_ITEM_REPEAT_KILL !== 'off';

// ── Task 46 (voice run 24, embed-1793756782461) ─────────────────────────────
/** Task 46 §1 (102 s): on a part's entry turn the brain's paraphrased re-paint
 *  of the authored card (word overlap ≥ 0.4) is dropped. Fixed scripts.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_AUTHORED_CARD_PARAPHRASE_DEDUPE=off. */
export const TUTOR_AUTHORED_CARD_PARAPHRASE_DEDUPE = process.env.NEXT_PUBLIC_TUTOR_AUTHORED_CARD_PARAPHRASE_DEDUPE !== 'off';
/** Task 46 §2 (723 s): a held budget / time advance does not fire on a reply
 *  to a correction / retry ask — the verdict on the retry comes first, the
 *  next reply moves (one wait per part). Fixed scripts. Client-side: default
 *  ON; NEXT_PUBLIC_TUTOR_HELD_ADVANCE_WAITS_FOR_RETRY_REPLY=off. */
export const TUTOR_HELD_ADVANCE_WAITS_FOR_RETRY_REPLY = process.env.NEXT_PUBLIC_TUTOR_HELD_ADVANCE_WAITS_FOR_RETRY_REPLY !== 'off';
/** Task 46 §2 (soft transitions): one turn before a part's turn budget is
 *  due, the brain is told the next ask is the part's last item, to say so in a
 *  few words. Fixed scripts. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_LAST_ITEM_NOTE=off. */
export const TUTOR_LAST_ITEM_NOTE = process.env.NEXT_PUBLIC_TUTOR_LAST_ITEM_NOTE !== 'off';
/** Typed turn: on fixed-script language lessons the brain returns one JSON
 *  object per turn (ack / verdict / verdict_say / correction / support_ja /
 *  next) and the engine composes speech and cards from the fields. Default
 *  ON since 2026-11-04 (bot series + Praveen's three voice runs);
 *  `NEXT_PUBLIC_TUTOR_TYPED_TURN=off` restores the prose path for fixed
 *  scripts. Client-side build-time constant. */
export const TUTOR_TYPED_TURN = process.env.NEXT_PUBLIC_TUTOR_TYPED_TURN !== 'off';
/** Task 46 §3 (73 s / 919 s): a student sentence goes on the board only when
 *  the tutor's own turn confirms it (or a correction card replaces it) — the
 *  precheck's verdict alone never cards a sentence; the level check cards no
 *  unconfirmed answer. Language lessons. Client-side: default ON;
 *  NEXT_PUBLIC_TUTOR_CARD_NEEDS_TUTOR_CONFIRMATION=off. */
export const TUTOR_CARD_NEEDS_TUTOR_CONFIRMATION = process.env.NEXT_PUBLIC_TUTOR_CARD_NEEDS_TUTOR_CONFIRMATION !== 'off';
/** Task 46 §4 (1211 s): the render stall timer does not release anchored
 *  cards while the tutor is still speaking — a long sentence is not a stall.
 *  Client-side: default ON; NEXT_PUBLIC_TUTOR_RENDER_STALL_WAITS_WHILE_SPEAKING=off. */
export const TUTOR_RENDER_STALL_WAITS_WHILE_SPEAKING = process.env.NEXT_PUBLIC_TUTOR_RENDER_STALL_WAITS_WHILE_SPEAKING !== 'off';

/** Learner home: kill switch for the learner-summary generation on a completed save (server-only; default ON). */
export const TUTOR_LEARNER_SUMMARY = process.env.TUTOR_LEARNER_SUMMARY !== 'off';

// Tutor brain v2 (2026-11-09): which sessions run on the v2 turn engine is a
// partner row (`brainVersion` in portal/partner-session-options.ts), 'v1'
// everywhere until cutover. This switch additionally lets a signed embed token
// ask for v2 with the claim `brain_version: "v2"` — for local and preview
// testing. It is OFF unless set to 'on': v2 is an unproven rewrite, so this is
// the one deliberate exception to "new flags default ON" (agreed 2026-11-09).
export const TUTOR_BRAIN_V2_CLAIM =
  process.env.NEXT_PUBLIC_TUTOR_BRAIN_V2_CLAIM === 'on';

/** Tutor brain v2 (v2/stop-signal.ts): a student's words that end the session ("Sorry, I have to finish now.",
 *  「今日はここまで」) are named in the turn's facts, and the tutor's close in that reply is never refused for time
 *  left. On v1, one learner's "please stop" got a question and the next part, and another said "I have to finish"
 *  three times (v1 live-session findings 2026-11-15, case 4). Default ON; NEXT_PUBLIC_TUTOR_V2_STOP_SIGNAL=off ⇒ the model alone
 *  reads the stop, as before. */
export const TUTOR_V2_STOP_SIGNAL = process.env.NEXT_PUBLIC_TUTOR_V2_STOP_SIGNAL !== 'off';

/** Tutor brain v2 (v2/plan-map.ts): the plan map keeps what a written lesson plan relies on — each part's teacher's
 *  note, its name (and the name in the support language), minutes, authored turn guide, required phrases, the single
 *  hint, the answer form, "skip when the level is known" and the pronunciation words/sentences. Without them a written
 *  lesson reached v2 as bare goals: the authored guidance for each part was dropped and the brain improvised the
 *  lesson (gdi-on-v2 plan, Task 3). Default ON; NEXT_PUBLIC_TUTOR_V2_PLAN_AS_WRITTEN=off ⇒ the map as before. */
export const TUTOR_V2_PLAN_AS_WRITTEN = process.env.NEXT_PUBLIC_TUTOR_V2_PLAN_AS_WRITTEN !== 'off';

/** Tutor brain v2 (v2/sentence-cards.ts): a lesson with a second teaching language is told to write the sentences it
 *  models or corrects as inline sentence cards (`<board sentence stress=… gloss=…>`), and the learner's corrected
 *  sentences are listed in the facts so the summary can board up to four. v1's brain, told to board them, did so on 3
 *  turns of 29, and the learner only heard them. Default ON; NEXT_PUBLIC_TUTOR_V2_SENTENCE_CARDS=off ⇒ no section, no
 *  facts line (the session part and facts as before), and a `<board sentence>` block is dropped unpainted. */
export const TUTOR_V2_SENTENCE_CARDS = process.env.NEXT_PUBLIC_TUTOR_V2_SENTENCE_CARDS !== 'off';

/** Tutor brain v2 (v2/time-box.ts): the time box. Every turn's facts say which part of a written plan the parts' minutes
 *  put the lesson on (fitted to the box when they add up to more); past the host's wrap minute (two before the box) the
 *  time line reads "about 2 minutes left: finish this exchange, then summary"; at the box the tutor's speech under way
 *  finishes (bounded) and a fixed goodbye is spoken before the session ends. On v1 the spoken wrap line cut into a menu
 *  the tutor was reading (tester-2), and v2 ended at the box mid-sentence with no goodbye. Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_TIME_BOX=off ⇒ no part line, no wrap, and the box cuts and ends at once, as before. Not under
 *  it: a v2 voice session ignores words heard once it is ending (they cut the goodbye, and nothing answers them), and the
 *  close follows the partner's lessonCloseAutoEnd (TUTOR_LESSON_CLOSE_AUTO_END is that switch). */
export const TUTOR_V2_TIME_BOX = process.env.NEXT_PUBLIC_TUTOR_V2_TIME_BOX !== 'off';

/** Tutor brain v2 (v2/sound-gate.ts): while the tutor speaks, a sound with no words yet pauses it only once the
 *  microphone has carried energy above the level it had just before (v1's adaptive bar and 350 ms sustain). Paused at
 *  the onset itself, the tutor's own voice from the speakers cut 2.5 s holes into its sentences, and after two the
 *  client stopped pausing on sounds for the session. Words that are not the tutor's still pause it at once. Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_BARGEIN_ENERGY_GATE=off ⇒ a sound pauses the tutor at the onset, as before. */
export const TUTOR_V2_BARGEIN_ENERGY_GATE = process.env.NEXT_PUBLIC_TUTOR_V2_BARGEIN_ENERGY_GATE !== 'off';

/** Tutor brain v2 (v2/turn.ts): a reply that itself ends the lesson (its end_lesson is accepted, in the box's last fifth)
 *  is a closing turn, and the summary page it opens is not held for "shall we go on?". The page is held back while the
 *  rest of the reply is written, and opened with it when the reply closes. Held, the reply was cut to "Next is summary.
 *  Shall we go on, or do you have a question first?" while its end_lesson still ended the session: no summary, and the
 *  last words a question (gdi-on-v2 Task 6, D1: showcase embed-1794821260705, trial embed-1794821778369). Wherever a
 *  held page and an end_lesson still meet, the end_lesson is refused: the session never ends on an unanswered offer.
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_CLOSE_OPENS_SUMMARY=off ⇒ the page is held at once, as before. */
export const TUTOR_V2_CLOSE_OPENS_SUMMARY = process.env.NEXT_PUBLIC_TUTOR_V2_CLOSE_OPENS_SUMMARY !== 'off';

/** Tutor brain v2 (v2/board-timing.ts unsaidBoardItem): in a spoken lesson, a sentence card or a numbered list of options
 *  that the reply asks the learner to act on, and that the spoken words do not carry, is read out after the reply (the
 *  options as "1, …; 2, …"). In text runs the learner saw them; in voice they would have heard "Which one would you like?
 *  Just say the number." over a menu never read (real-run-B t49) and "Please say it back to me." with the sentence unsaid
 *  (upper-int t61, which drew "What sentence do you want me to say?"). Items with mathematics are left to the board, as
 *  before; problem cards keep their own path (unsaidAsk). Default ON; NEXT_PUBLIC_TUTOR_V2_SPEAK_BOARD_ITEM=off ⇒ only a
 *  problem card is asked aloud, as before. */
export const TUTOR_V2_SPEAK_BOARD_ITEM = process.env.NEXT_PUBLIC_TUTOR_V2_SPEAK_BOARD_ITEM !== 'off';

/** Tutor brain v2 (v2/working-level.ts): a level remembered from an earlier lesson on the link is confirmed with one light
 *  question at the start ("last time we worked at <level> level: does that still feel right?"), and a "no" re-opens the
 *  level check: the remembered level is dropped and the skipped level-check parts come back. A second person on a shared
 *  link inherited the first one's level and went straight into the lesson (findings case 11; Task 6 shared-link run).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_LEVEL_RECONFIRM=off ⇒ an unnamed natural question, and no re-open, as before. */
export const TUTOR_V2_LEVEL_RECONFIRM = process.env.NEXT_PUBLIC_TUTOR_V2_LEVEL_RECONFIRM !== 'off';

/** Tutor brain v2 (v2/working-level.ts): set_working_level is refused, with the reason, until the learner has answered
 *  at least three level-check questions (an answer with content: not "yes", "no", "I'm ready" or "could you rephrase
 *  that?"), unless they asked to skip it or the time is up. Past the check's reply budget (V2_LEVEL_CHECK_MAX_REPLIES) the refusal
 *  asks for no further level question (the facts say the check is over), and the level waits for answers with content. Levels were set after two questions, one of them answered "No." twice (Task 6, D7: real-t2, both trial runs).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_LEVEL_CHECK_MIN_ANSWERS=off ⇒ the level is taken whenever it is set, as before. */
export const TUTOR_V2_LEVEL_CHECK_MIN_ANSWERS = process.env.NEXT_PUBLIC_TUTOR_V2_LEVEL_CHECK_MIN_ANSWERS !== 'off';

/** Tutor brain v2 (v2/pronunciation.ts v2TextSoundFacts): a typed language lesson's facts say nothing they say is heard
 *  or measured, so nothing is said about how they sounded, and a pronunciation part offers the sentence or words to say
 *  aloud on their own. Typed, the tutor said "you said it clearly … sounds natural" right after saying it cannot hear
 *  (beginner-ja t69–t75), and a sentence pick turned into a grammar drill (upper-int t61–t69) (Task 6, D4/D8). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_TEXT_NO_SOUND=off ⇒ no such line, as before. */
export const TUTOR_V2_TEXT_NO_SOUND = process.env.NEXT_PUBLIC_TUTOR_V2_TEXT_NO_SOUND !== 'off';

/** Tutor brain v2 (v2/languages.ts v2RetryFacts): in a lesson with a second teaching language, a learner's reply that is
 *  another try at the sentence they said just before is counted in the facts; at the second try the facts say the
 *  correct sentence comes next and the lesson goes on. One sentence was tried four times across four different errors
 *  (Task 6, D5: upper-int t13–t21). Default ON; NEXT_PUBLIC_TUTOR_V2_RETRY_COUNT=off ⇒ no such line. */
export const TUTOR_V2_RETRY_COUNT = process.env.NEXT_PUBLIC_TUTOR_V2_RETRY_COUNT !== 'off';

/** Tutor brain v2 (v2/facts.ts v2OpenerFact): every turn's facts name how the tutor's last reply opened ("your last reply
 *  opened with 'Correct'; open this one differently, or go straight to the content"). "Yes, that's right." opened 50–70%
 *  of replies (Task 6, D10); a constitution line against it only moved the stock opener to "Correct." and raised repeated
 *  openers in demo-forces 5→13 (Task 6b review I2). Default ON; NEXT_PUBLIC_TUTOR_V2_OPENER_FACT=off ⇒ no such line. */
export const TUTOR_V2_OPENER_FACT = process.env.NEXT_PUBLIC_TUTOR_V2_OPENER_FACT !== 'off';

/** Tutor brain v2 (v2/own-voice.ts isOwnVoice): a heard CJK character or number the tutor did not say is passed over as
 *  the recogniser's rendering (三 heard as 3), so the tutor's own Japanese with a slip is still taken for echo. Limited to
 *  those tokens: skipping any unsaid word took a student who added words to the tutor's sentence ("wait so the derivative
 *  of x squared is two x right") for echo and dropped them (final review I1). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_OWN_VOICE_SKIP=off ⇒ no word is passed over, as before. */
export const TUTOR_V2_OWN_VOICE_SKIP = process.env.NEXT_PUBLIC_TUTOR_V2_OWN_VOICE_SKIP !== 'off';

/** Tutor brain v2 (v2/languages.ts): a sentence the learner produces as practice (a retry after a correction, or an
 *  answer to a practice question on the point being taught) is called right only when it is fully right; otherwise the
 *  tutor says what works and gives the fix in one short clause. "Small slips pass" applied there too, and "I have worked
 *  here for eleven year" was called right (Task 6c, ruling 1: gdi-real-josh t≈4.3, gdi-real-t2 t≈4.3). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_PRACTICE_VERDICT=off ⇒ the correction line as it was. */
export const TUTOR_V2_PRACTICE_VERDICT = process.env.NEXT_PUBLIC_TUTOR_V2_PRACTICE_VERDICT !== 'off';

/** Tutor brain v2 (v2/turn.ts v2PersonaCardLines, v2/constitution.ts): a teacher persona with a `background` gives the
 *  tutor a persona card: asked about itself, it answers briefly from the card and stays consistent with it. Without a
 *  card, "no job or life story of its own" stands. With only "no life story", asked about its work it invented a
 *  customer-service job while the persona teaches Japanese professionals (Task 6c, ruling 2: gdi-real-t2 t≈9.7).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_PERSONA_CARD=off ⇒ no card, the constitution line as it was. */
export const TUTOR_V2_PERSONA_CARD = process.env.NEXT_PUBLIC_TUTOR_V2_PERSONA_CARD !== 'off';

/** Tutor brain v2 (v2/plan-map.ts v2PassedPartFact, renderPlanMap): when the board has a page for a later plan part
 *  while the part just before it was never reached, the facts name the passed-over part and say to offer it before the
 *  summary (not when the time is up, the wrap is due or the student is stopping); a plan whose part calls itself
 *  "optional" gets a line that optional is the student's choice. "Optional pronunciation practice" was read as the
 *  tutor's to skip: Conversation page → Summary page with the part never offered (Task 6c, ruling 3: gdi-real-t2
 *  t≈11.6). Default ON; NEXT_PUBLIC_TUTOR_V2_PASSED_PART_FACT=off ⇒ neither line. */
export const TUTOR_V2_PASSED_PART_FACT = process.env.NEXT_PUBLIC_TUTOR_V2_PASSED_PART_FACT !== 'off';

/** Tutor brain v2 (v2/heard.ts v2HeardIsNoise; TutorVoiceV2, the brain-v2 route): a spoken transcript that is noise, not
 *  words (one character or token repeated over most of it, or longer than any turn), is taken as unheard: it is not
 *  stored, it does not cut the tutor, and the brain is told something was said that could not be made out. The
 *  recogniser returned "I'" and about 5,000 characters of 、 and 号 for "I'm not sure about it.", and it went to the brain
 *  and into the stored transcript whole (Task 6e, v2audio tester B #29). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_HEARD_NOISE=off ⇒ every transcript is sent and stored as heard, as before. */
export const TUTOR_V2_HEARD_NOISE = process.env.NEXT_PUBLIC_TUTOR_V2_HEARD_NOISE !== 'off';

/** Tutor brain v2 (v2/turn.ts, spoken lessons): a sentence card written straight after a lead-in that ends in a colon
 *  ("The correct sentence is:", "we say:") is also spoken there, unless the reply already said it. The block is lifted
 *  out of the speech, so the learner heard "we say: …" and nothing, the sentence only on the board: 6 tutor turns of
 *  one run, 3 of them never saying it (Task 6e, v2audio tester B). Default ON; NEXT_PUBLIC_TUTOR_V2_SAY_SENTENCE_CARD=off
 *  ⇒ the card is shown and not spoken, as before. */
export const TUTOR_V2_SAY_SENTENCE_CARD = process.env.NEXT_PUBLIC_TUTOR_V2_SAY_SENTENCE_CARD !== 'off';

/** Tutor brain v2 (v2/part-close.ts): the offer that stands in for a held page asks "or do you have a question first?"
 *  only when the last part change did not ask it, and a "Shall we go on…?" that ends in a question in the second
 *  language (…進んでもいいですか。) counts as the ask. "Next is X. Shall we go on, or do you have a question first?"
 *  came 2–3 times a run, and twice in a row when the tutor's own ask ended in Japanese (Task 6e, v2audio tester A turns
 *  24 → 26). Default ON; NEXT_PUBLIC_TUTOR_V2_PART_OFFER_ONCE=off ⇒ the offer and the ask as before. */
export const TUTOR_V2_PART_OFFER_ONCE = process.env.NEXT_PUBLIC_TUTOR_V2_PART_OFFER_ONCE !== 'off';

/** Tutor brain v2 (v2/plan-map.ts v2UnreachedAtClose, v2/turn.ts): a plan part not reached when the lesson heads for its
 *  close is not passed over in silence. With time left, the held summary page's offer names it and asks whether to do
 *  it first; at the close (time short, wrap due, the student stopping), the facts say to name it in the summary as
 *  next time. The passed-part fact needs a summary page already up and is off at the close, so it never fired when
 *  time ran short: pronunciation was neither offered nor named (Task 6e, v2audio tester B). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_PASSED_PART_CLOSE=off ⇒ neither, as before. */
export const TUTOR_V2_PASSED_PART_CLOSE = process.env.NEXT_PUBLIC_TUTOR_V2_PASSED_PART_CLOSE !== 'off';

/** Tutor brain v2 (v2/languages.ts, spoken lessons in two languages): a word in their sentence that makes little sense
 *  there, or a word that seems missing, may be the recogniser's: the tutor asks "Did you say …?" before it corrects or
 *  praises the sentence. "my role" heard as "my lover" got a correction built on it, and "I met someone" heard as
 *  "I met some" was called correct (Task 6e, v2audio tester B). Default ON; NEXT_PUBLIC_TUTOR_V2_CHECK_MISHEARD=off ⇒
 *  no such line. */
export const TUTOR_V2_CHECK_MISHEARD = process.env.NEXT_PUBLIC_TUTOR_V2_CHECK_MISHEARD !== 'off';

/** Tutor brain v2 (v2/reply-gate.ts, v2/turn.ts, v2/facts.ts): at the close, one question per reply, and nothing after
 *  a goodbye. A goodbye is held until the reply is complete; a close the runtime refuses takes its goodbye with it, so
 *  the menu the refusal asks for is not said after "See you next time!" (Task 6e fix round 1, F4: gdi-real-james; tester B asked
 *  about a question or the summary in two turns running). Default ON; NEXT_PUBLIC_TUTOR_V2_CLOSE_ONE_QUESTION=off ⇒ the
 *  goodbye goes out as written and no such facts line, as before. */
export const TUTOR_V2_CLOSE_ONE_QUESTION = process.env.NEXT_PUBLIC_TUTOR_V2_CLOSE_ONE_QUESTION !== 'off';

/** Tutor brain v2 (v2/languages.ts v2PracticeAskFacts, v2/board-timing.ts asksAloud): asks for one practice sentence are
 *  counted by the runtime, a bare "yes" to the tutor's own check is not a try, and after two asks the facts say to give
 *  the sentence and move on. "Now you say it" also counts as handing over, so no "Are you with me so far?" is added to
 *  it. Tester A was asked about nine times for "I didn't attend any exhibitions last year", each "Yes." to "Does that
 *  make sense?" setting the ask off again (Task 6e fix round 1, F2). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_PRACTICE_ASK_CAP=off ⇒ no count, and asksAloud as before. */
export const TUTOR_V2_PRACTICE_ASK_CAP = process.env.NEXT_PUBLIC_TUTOR_V2_PRACTICE_ASK_CAP !== 'off';

/** Tutor brain v2 (v2/words-watch.ts, TutorVoiceV2): speech that began, or stopped, with no transcript and no failure
 *  after it does not leave the page waiting: the client goes back to listening and the idle nudge is armed again. The
 *  recogniser ended a turn with no words (an empty turn.end is dropped without a callback), the page sat on "Got it /
 *  One moment…" with the silence timer cleared at the speech's start, and no nudge came for four minutes (Task 6e fix
 *  round 1, F6: tester B's stalled first try). Default ON; NEXT_PUBLIC_TUTOR_V2_NO_WORDS_RECOVER=off ⇒ no watch. */
export const TUTOR_V2_NO_WORDS_RECOVER = process.env.NEXT_PUBLIC_TUTOR_V2_NO_WORDS_RECOVER !== 'off';

/** Tutor brain v2 (v2/pronunciation.ts): when measuring is not available (no vendor or key, the route closed) or a
 *  recording could not be measured, the learner who asked for pronunciation practice is told once, in one short
 *  sentence, that there is no score today, and is offered to go on practising without one (say it after the tutor),
 *  instead of being moved on to the summary after one word (Task 6f: the real-voice replays ran with no vendor, and
 *  "I can't check the sound of your voice today, so I'll move on to the summary." followed the learner's first word, gdi-real-james). A reply
 *  that was not a try at the item ("I said individual words.") is answered first. Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_PRONUNCIATION_FALLBACK=off ⇒ the facts lines as before. */
export const TUTOR_V2_PRONUNCIATION_FALLBACK = process.env.NEXT_PUBLIC_TUTOR_V2_PRONUNCIATION_FALLBACK !== 'off';

/** Tutor brain v2 (v2/board-timing.ts noteSentencesToSay, v2/turn.ts, spoken teaching lessons): a note or table of
 *  example sentences that a lead-in points at ("Here is the form", "Now let's look at the two tenses you just used.",
 *  or "ここにある文を…読んでみてください" just after it) has its example sentences spoken where it stands, as a sentence
 *  card is (SAY_SENTENCE_CARD). Only sentence cards were spoken, and three lead-ins pointed at a note or a table whose
 *  sentences were never said (Task 6f, v2audio-6e2 gdi-real-james T22, tester A T16, tester B T16). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_SAY_NOTE_SENTENCES=off ⇒ notes and tables are shown and not spoken, as before. */
export const TUTOR_V2_SAY_NOTE_SENTENCES = process.env.NEXT_PUBLIC_TUTOR_V2_SAY_NOTE_SENTENCES !== 'off';

/** Tutor brain v2 (v2/turn.ts, v2/plan-map.ts v2PagePartLabel, spoken lessons with a plan): the part-change frame names
 *  the held page by its plan part's authored name when it is a part's page, else by its heading, and goes out at once.
 *  It never names a part picked by plan order and never waits for the reply's goal marks (Task 6f fix round 2: waiting
 *  1–3 s at every part change was ruled out; v2audio-6e2 gdi-real-james T20 heard "Next is your job." for a page the
 *  model wrote and then left). Default ON; NEXT_PUBLIC_TUTOR_V2_FRAME_NAMES_OPENED=off ⇒ the frame names the heading as
 *  written, as before. */
export const TUTOR_V2_FRAME_NAMES_OPENED = process.env.NEXT_PUBLIC_TUTOR_V2_FRAME_NAMES_OPENED !== 'off';

/** Tutor brain v2 (v2/turn.ts, plan-map.ts): a reply that has already begun the summary ("here is a quick summary") is not
 *  held at the summary page for the offer of a part not reached ("Before the summary, there is still the pronunciation
 *  part…"): the page opens and the part is named as next time, in one line, where it stands. Tester B heard both lead-ins
 *  in one reply (Task 6f, v2audio-6e2 T60). Default ON; NEXT_PUBLIC_TUTOR_V2_SUMMARY_BEGUN_NEXT_TIME=off ⇒ held with the
 *  offer, as before. */
export const TUTOR_V2_SUMMARY_BEGUN_NEXT_TIME = process.env.NEXT_PUBLIC_TUTOR_V2_SUMMARY_BEGUN_NEXT_TIME !== 'off';

/** Tutor brain v2 (v2/working-level.ts, lessons with a level check): set_working_level is described as called after the
 *  reply's words, in the same response, its result a receipt. Called alone first, it ended the model call with no words,
 *  and the words came from a second call: the reply that closes the level check (and asks the first part-change frame)
 *  took 4.2–8.9 s to its first sentence in all four real-voice runs, tester B's 11.1 s clip-end to reply (Task 6g,
 *  v2audio-6f). Default ON; NEXT_PUBLIC_TUTOR_V2_LEVEL_WITH_WORDS=off ⇒ the tool's description as before. */
export const TUTOR_V2_LEVEL_WITH_WORDS = process.env.NEXT_PUBLIC_TUTOR_V2_LEVEL_WITH_WORDS !== 'off';

/** Tutor brain v2 (v2/progress.ts, v2/part-flow.ts, v2/turn.ts, plans whose every part has an authored name): the part
 *  chips, the board pages and the lesson's parts move together. A part starts with its own page, headed by the part's
 *  name: a page held for "shall we go on?" opens on the learner's yes even when the reply does not write it again, and a
 *  part offered by name (optional pronunciation) opens its page when taken up. The lit chip is the part whose page is
 *  open; a part turns green when the lesson moves past it after teaching it; the level check turns green when the level
 *  is set. The chips lit the part after the last goal marked, so "Your job" went green and "Present perfect" lit while
 *  the job was still being talked about; the held present perfect page never opened after "yes, we move on"; and
 *  pronunciation ran on the conversation's page (Task 7a, mic test 1, embed-1794882458629). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_PART_PAGE_CHIP=off ⇒ chips from the goal marks and pages from the model alone, as before. */
export const TUTOR_V2_PART_PAGE_CHIP = process.env.NEXT_PUBLIC_TUTOR_V2_PART_PAGE_CHIP !== 'off';

/** Tutor brain v2 (v2/turn.ts, v2/part-flow.ts, v2/facts.ts, spoken lessons whose every plan part has an authored name):
 *  every part change after the level check is asked first, in one line that closes the part just done, names the next
 *  and asks whether they have a question or shall go on, in words that vary through the lesson. The Task 6e budget
 *  (PART_OFFER_ONCE: two asks a lesson, never two changes running) is dropped for these lessons; a frame repeated word
 *  for word is still dropped. The product owner's decision after mic test 1: past simple and the conversation opened
 *  "on its own whim" with no ask (Task 7a, embed-1794882458629). Default ON; NEXT_PUBLIC_TUTOR_V2_PART_ASK_EVERY=off ⇒
 *  the 6e budget, as before. */
export const TUTOR_V2_PART_ASK_EVERY = process.env.NEXT_PUBLIC_TUTOR_V2_PART_ASK_EVERY !== 'off';

/** Tutor brain v2 (v2/state-carry.ts, the brain-v2 turn route): the state fields the turn writes for the next turn survive
 *  the route's reading of the client's state: when the summary began (Task 6g CLOSE_ONE_QUESTION's close guards), how many
 *  replies since the board was written, and what was not painted last reply. The route rebuilt the state from a fixed list
 *  of fields and dropped all three, so those facts lines and the 6g guards never ran in a real session (Task 7a fix round
 *  1). Default ON; NEXT_PUBLIC_TUTOR_V2_STATE_CARRY=off ⇒ dropped, as before. */
export const TUTOR_V2_STATE_CARRY = process.env.NEXT_PUBLIC_TUTOR_V2_STATE_CARRY !== 'off';

/** Tutor brain v2 (v2/learner-card.ts, v2/turn.ts, v2/facts.ts, spoken lessons taught in two languages): a sentence the
 *  learner says goes on the board as a sentence card as it should be. When the reply quotes the corrected form of their
 *  sentence ("we say "…"") or quotes their sentence as right ("That's right: "…"") and writes no card, the runtime writes
 *  the card where the quote stands (the changed words stressed); a facts line asks for the card when their words were a
 *  sentence. Not while the level check runs, never twice for one sentence. Two corrections and a sentence praised were
 *  only spoken (Task 7b, mic test 1, embed-1794882458629). Default ON; NEXT_PUBLIC_TUTOR_V2_BOARD_LEARNER_SENTENCE=off ⇒
 *  cards from the model alone, as before. */
export const TUTOR_V2_BOARD_LEARNER_SENTENCE = process.env.NEXT_PUBLIC_TUTOR_V2_BOARD_LEARNER_SENTENCE !== 'off';

/** Tutor brain v2 (v2/one-question.ts, v2/turn.ts, v2/reply-gate.ts): one question per reply. An imperative that hands the
 *  turn over ("Please say that sentence again.", "Please say it: "…"", "Try it again.", 「もう一度言ってみてください。」) counts
 *  as an ask when it ends the reply, also straight after a quoted sentence (not "Say you have 5 apples…", "Try thinking…");
 *  a reply that ends asking gets no check-in, no part ask and no offer of a part not reached from the runtime (a page held
 *  for it waits marked unasked, and the next reply asks: the facts say so, and the runtime asks when that reply asks
 *  nothing); a check-in the model writes straight after such an ask, ending the reply, is dropped, spoken and stored. Mic test 1: "Please
 *  say that sentence again." + "Does that make sense so far?" left the learner not knowing which to answer (Task 7c,
 *  embed-1794882458629). The check-in guard reaches every spoken v2 lesson (the check-in does); the rest, spoken teaching
 *  lessons. Default ON; NEXT_PUBLIC_TUTOR_V2_ASK_NO_CHECKIN=off ⇒ as before. */
export const TUTOR_V2_ASK_NO_CHECKIN = process.env.NEXT_PUBLIC_TUTOR_V2_ASK_NO_CHECKIN !== 'off';

/** Tutor brain v2 (v2/part-flow.ts, v2/progress.ts, v2/turn.ts; labelled plans in spoken lessons, as PART_PAGE_CHIP): the
 *  lesson's position is the furthest part reached, the part of the newest part page (a page of a part already paged is a
 *  revisit), not the page in view. Going back to an earlier page for a learner's question is a look, not a move: after
 *  `go_to_page` back to "Past simple" the runtime's ask named "conversation" again right after the model offered
 *  pronunciation, and the lit chip jumped back (Task 7e, v2audio-7 Tester A T77–T78). And the runtime appends no part ask
 *  (after a dropped repeat, or one owed by a page held unasked) to a reply that already carries a part ask. Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_PART_POSITION_KEPT=off ⇒ the part in hand follows the page in view, as before. */
export const TUTOR_V2_PART_POSITION_KEPT = process.env.NEXT_PUBLIC_TUTOR_V2_PART_POSITION_KEPT !== 'off';

/** Tutor brain v2 (v2/turn.ts, v2/part-flow.ts; with PART_ASK_EVERY in spoken labelled-plan lessons): the model's own part
 *  ask ("Next is the present perfect… Do you have a question first, or shall we go on?") holds the part it names as a held
 *  page, as the runtime's own ask does, so an answer that is neither yes nor a question keeps the part waiting (the facts say
 *  to answer and ask again) instead of being forgotten on the next reply; and the held part's page opens when the lesson
 *  moves into it: a reply that names the held part and is not asking whether to go on opens its page before its next card
 *  (or at its end). A part the lesson moves past opens nothing. v2audio-7 learner 2 T25–T33: a content answer to the ask,
 *  then the present perfect taught on the "Your job" page with that chip lit (Task 7e). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_HELD_PART_RELEASE=off ⇒ as before. */
export const TUTOR_V2_HELD_PART_RELEASE = process.env.NEXT_PUBLIC_TUTOR_V2_HELD_PART_RELEASE !== 'off';

/** Tutor brain v2 voice client (v2/spoken-sounds.ts, TutorVoiceV2.tsx) and the second-language prompt section
 *  (v2/languages.ts): a sound written with phonetic symbols ("/z/", "/ʃ/", "[θ]") is spoken in words ("the z sound", "a
 *  buzzing z sound"); the board and the stored reply keep the symbols. "a buzzing /z/ sound, not /s/" was read with its
 *  slashes, "/s/" as "per second" (Task 7c, mic test 1, embed-1794882458629). Speech of lessons that are not maths or
 *  science only. Default ON; NEXT_PUBLIC_TUTOR_V2_SPOKEN_SOUNDS=off ⇒ the symbols reach the voice, as before. */
export const TUTOR_V2_SPOKEN_SOUNDS = process.env.NEXT_PUBLIC_TUTOR_V2_SPOKEN_SOUNDS !== 'off';

/** Tutor brain v2 (v2/level-check-count.ts, v2/working-level.ts facts): the level check counted in every turn's facts. Plan
 *  questions answered and the one follow-up the whole check may ask are counted from the history ("level check: 2 of 3
 *  questions answered, the one follow-up used"); a re-ask after a reply with no answer in it ("I don't understand") is the
 *  same question. Once three are answered the facts say to set the level now and move on. Lessons whose plan has a
 *  level-check part only. Mic test 1: six tutor turns and five questions where the plan says three (Task 7d,
 *  embed-1794882458629). Default ON; NEXT_PUBLIC_TUTOR_V2_LEVEL_CHECK_CAP=off ⇒ the uncounted line, as before. */
export const TUTOR_V2_LEVEL_CHECK_CAP = process.env.NEXT_PUBLIC_TUTOR_V2_LEVEL_CHECK_CAP !== 'off';

/** Tutor brain v2 (v2/close-invite.ts, v2/turn.ts, v2/facts.ts): questions before the close. In a spoken plan-led
 *  second-language lesson, when the summary is given with time left (more than the time-up minute) and the learner has not
 *  asked to stop, the summary reply ends with one invitation to ask questions and does not end the lesson; it ends on
 *  their answer. An end_lesson before the invitation is refused once with what to do instead; after it (answered or not)
 *  the close is never refused for it again. Time up, a firm stop and the host's End close as before. Mic test 1: the
 *  summary, the goodbye and end_lesson came in one reply with 2.4 min left (Task 7d, embed-1794882458629). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_CLOSE_INVITES_QUESTIONS=off ⇒ as before. */
export const TUTOR_V2_CLOSE_INVITES_QUESTIONS = process.env.NEXT_PUBLIC_TUTOR_V2_CLOSE_INVITES_QUESTIONS !== 'off';

/** Tutor brain v2 (v2/time-box.ts v2PartDueNow, v2/time-fit.ts, v2/facts.ts, v2/memory.ts): never squeeze a plan. The parts'
 *  minutes are no longer scaled down to the box; when they add up to more than it, the plan's OPTIONAL parts are left out,
 *  last first, until the rest fits, the learner is told once when the first teaching part opens, and the parts left out go
 *  to the next session's "plan for next time". The "by the plan's minutes" line is a guide only. Mic test 2
 *  (embed-1794941004529): a 25-minute plan in a 20-minute box thinned every part to one learner sentence (Task 7f B).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_TIME_NO_SQUEEZE=off ⇒ the minutes are fitted to the box, as before. */
export const TUTOR_V2_TIME_NO_SQUEEZE = process.env.NEXT_PUBLIC_TUTOR_V2_TIME_NO_SQUEEZE !== 'off';

/** Tutor brain v2 (v2/time-fit.ts, v2/turn.ts; spoken lessons with labelled plans, where Task 7a's part flow runs): a
 *  practice part is not closed (goal marked done, part-change ask, next page) until the learner has said at least 2 practice
 *  sentences of their own in it, unless they ask to move on. Counted in the runtime, told in the facts, and the part change
 *  held. Not the overview, the level check or the summary. Mic test 2 (embed-1794941004529, flags 4 and 7): one sentence
 *  each for the present perfect and the past simple (Task 7f C). Default ON; NEXT_PUBLIC_TUTOR_V2_PART_MIN_PRACTICE=off ⇒ as
 *  before. */
export const TUTOR_V2_PART_MIN_PRACTICE = process.env.NEXT_PUBLIC_TUTOR_V2_PART_MIN_PRACTICE !== 'off';

/** Tutor brain v2 (v2/time-box.ts v2CloseOpen and its readers: turn.ts end_lesson, the summary detection, close-invite.ts,
 *  facts.ts): the tutor may begin the summary or end by itself when the plan's required parts are done (optional ones done,
 *  left out or declined), or at the wrap minute (the host's, else two before the box); no longer at the box's last fifth.
 *  Mic test 2 (embed-1794941004529, flag 9): the summary began at 15.9 of 20 minutes with two parts not taught (Task 7f D).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_CLOSE_BY_CONTENT=off ⇒ the last fifth, as before. */
export const TUTOR_V2_CLOSE_BY_CONTENT = process.env.NEXT_PUBLIC_TUTOR_V2_CLOSE_BY_CONTENT !== 'off';

/** Tutor brain v2 (v2/time-fit.ts, v2/turn.ts, v2/facts.ts): when a learner's words look like a request for more practice after
 *  the summary has begun, or at the close, the facts say it is allowed while more than 3 minutes remain to the hard stop (the
 *  box plus the overrun margin), otherwise that there is no time left today and to name it for next time. It informs only: no
 *  close is refused for it, the model decides from the learner's meaning. The tutor still offers no NEW practice once the
 *  summary has begun (Task 6g). Mic test 2 (embed-1794941004529): "Can we do some more practice?" was refused (Task 7f E).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_MORE_PRACTICE=off ⇒ as before. */
export const TUTOR_V2_MORE_PRACTICE = process.env.NEXT_PUBLIC_TUTOR_V2_MORE_PRACTICE !== 'off';

/** Tutor brain v2 (v2/time-box.ts, useV2Turns, the embed page's pool cap, partner-pool-store charging, SessionControls): the
 *  session length is a target, not a cutoff. A v2 lesson may run TUTOR_V2_OVERRUN_MIN minutes past it: "the time is up" and the
 *  runtime's hard stop with its goodbye move to target + margin; a pooled sitting's wall-clock cap gets the same margin (never
 *  past the pool's remaining balance), and the pool is charged wall-clock for it; the visible timer counts on past the target
 *  with no alarm. v1 sessions are untouched. The owner's decision after mic test 2 (embed-1794941004529, Task 7f F). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_TIME_OVERRUN=off ⇒ the hard stop at the box, as before. */
export const TUTOR_V2_TIME_OVERRUN = process.env.NEXT_PUBLIC_TUTOR_V2_TIME_OVERRUN !== 'off';
/** The overrun margin in minutes (TUTOR_V2_TIME_OVERRUN): 5, or NEXT_PUBLIC_TUTOR_V2_OVERRUN_MIN (0–30). */
export const TUTOR_V2_OVERRUN_MIN = (() => {
  const n = Number(process.env.NEXT_PUBLIC_TUTOR_V2_OVERRUN_MIN);
  return process.env.NEXT_PUBLIC_TUTOR_V2_OVERRUN_MIN !== undefined && process.env.NEXT_PUBLIC_TUTOR_V2_OVERRUN_MIN !== '' && Number.isFinite(n) && n >= 0 && n <= 30 ? n : 5;
})();

/** Tutor brain v2 (v2/part-flow.ts, v2/progress.ts): the level check's chip lights while it runs (Task 7g, mic test 2,
 *  embed-1794941004529 flags 1–2: "Overview" stayed lit through the whole check, then "Level check" went green and "Your job"
 *  lit at once). A plan part with no page of its own (the level check: never a page, final-7 M5) is the part in hand from the
 *  reply that begins it (a level question asked after the overview's exchange, or a goal mark) until the next part's page
 *  opens; an unnamed opening page ("Page 1") is the first part's page. Default ON; NEXT_PUBLIC_TUTOR_V2_LEVEL_CHECK_CHIP=off
 *  ⇒ as before (lit only once its goal is marked, and never after an unnamed opening page). */
export const TUTOR_V2_LEVEL_CHECK_CHIP = process.env.NEXT_PUBLIC_TUTOR_V2_LEVEL_CHECK_CHIP !== 'off';

/** Tutor brain v2 (v2/learner-card.ts, v2/turn.ts, v2/facts.ts): every sentence of a practice answer goes on the board,
 *  corrected, one card each (Task 7g, mic test 2 flag 3: of several sentences about his job one was carded, a second only
 *  after he asked). The facts list the answer's sentences and ask for a card for each; the sentences the reply left uncarded
 *  are owed in the next reply's facts. Same sessions as BOARD_LEARNER_SENTENCE (spoken two-language lessons, not during the
 *  overview or the level check). Default ON; NEXT_PUBLIC_TUTOR_V2_CARD_EVERY_SENTENCE=off ⇒ the Task 7b line (one card at
 *  most), nothing owed. */
export const TUTOR_V2_CARD_EVERY_SENTENCE = process.env.NEXT_PUBLIC_TUTOR_V2_CARD_EVERY_SENTENCE !== 'off';

/** Tutor brain v2 (v2/turn.ts): in a spoken lesson that teaches a language, a practice question written as a problem card
 *  is a plain question card: no difficulty label, headed "Question" (Task 7g, mic test 2 flag 5: "Did you attend any business
 *  events…?" went up under "EASY / Problem"). Maths and science problem cards are unchanged. Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_QUESTION_CARD=off ⇒ as before. */
export const TUTOR_V2_QUESTION_CARD = process.env.NEXT_PUBLIC_TUTOR_V2_QUESTION_CARD !== 'off';

/** Tutor brain v2 (useV2Turns, v2/time-box.ts): the engine's clock starts when the session starts (the tap that opens it,
 *  or the first typed message: where the visible timer starts), not when the page mounted the hook (Task 7g, mic test 2:
 *  the engine ran about a minute ahead, "we're nearly out of time" with 5 minutes on screen). A resumed session keeps its
 *  start. Default ON; NEXT_PUBLIC_TUTOR_V2_CLOCK_FROM_START=off ⇒ the clock from the hook's mount, as before. */
export const TUTOR_V2_CLOCK_FROM_START = process.env.NEXT_PUBLIC_TUTOR_V2_CLOCK_FROM_START !== 'off';

/** Tutor brain v2 (v2/echo-window.ts, TutorVoiceV2): the microphone's words are the tutor's own voice only where they could
 *  have come from the speakers: a sentence counts once its audio has begun, while it plays or for a short tail after, and
 *  only the stretch of it played around where the heard words began. A learner who says the model sentence back is heard
 *  (Task 7h, mic test 2 flag 6, embed-1794941004529: "I attended a robotics exhibition in Tokyo 2 year ago." was dropped as
 *  echo and the tutor talked over him twice). Default ON; NEXT_PUBLIC_TUTOR_V2_ECHO_BY_PLAYBACK=off ⇒ the words are matched
 *  against the last sentences written, while speech is pending, as before. */
export const TUTOR_V2_ECHO_BY_PLAYBACK = process.env.NEXT_PUBLIC_TUTOR_V2_ECHO_BY_PLAYBACK !== 'off';

/** Tutor brain v2 (useV2Turns, v2/close-mic.ts): in a spoken lesson the microphone stays open while the closing reply is
 *  said, and the session is closed only once it has been said. Words over it (other than thanks or a goodbye) stop the
 *  tutor as any interruption does and go to it as a turn: the lesson is open again. The time box's hard stop stays
 *  uninterruptible. Task 7h, mic test 2 flags 9–10 (embed-1794941004529): a 55 s closing reply with the microphone off.
 *  Same switch name as the close work on another branch (9efef789). Default ON; NEXT_PUBLIC_TUTOR_V2_CLOSE_HEARS=off ⇒ the
 *  microphone closes as end_lesson is accepted, as before. */
export const TUTOR_V2_CLOSE_HEARS = process.env.NEXT_PUBLIC_TUTOR_V2_CLOSE_HEARS !== 'off';

/** Tutor brain v2 (v2/target-pauses.ts, TutorVoiceV2 plainSpeech): in a spoken lesson that teaches a language, a short quoted
 *  target in the tutor's speech (a word, an ending such as "-ed", a phrase of at most three words; Latin script) is set apart by
 *  a short pause either side (the voice's break tag), at most two targets per speech part (a sentence, or one language part of
 *  it: each is its own generation request); targets fewer than four words apart share their breaks (one before the first,
 *  one after the last, none between), never two tags back to back; targets further apart keep their own; a quoted sentence gets none and nothing on the board changes. Task 7h, mic test 2 flag 8 (embed-1794941004529): in Please add "an" before "important customer" the
 *  quoted words had no stress (the quotes are stripped before the voice). Default ON; NEXT_PUBLIC_TUTOR_V2_TARGET_PAUSE=off ⇒
 *  the quotes are stripped with no pause, as before. */
export const TUTOR_V2_TARGET_PAUSE = process.env.NEXT_PUBLIC_TUTOR_V2_TARGET_PAUSE !== 'off';

/** Tutor brain v2 (v2/target-pauses.ts targetPunctuation, TutorVoiceV2 plainSpeech): HOW a target is set apart (Task 7l; needs
 *  TUTOR_V2_TARGET_PAUSE on). By punctuation: a long dash either side when the speech part is led in English, a comma either
 *  side when led in Japanese (the product owner's pick by ear from the 7j samples); nothing after a target ending its sentence,
 *  nothing doubled beside a comma, colon or dash. Mic test 3 (embed-1794967959470, flags 3 and 4): each break tag splits the
 *  generation (the voice falls before it; 200 ms became about 0.6 s). Default ON; NEXT_PUBLIC_TUTOR_V2_TARGET_PUNCT=off alone
 *  ⇒ the 7h break tags. */
export const TUTOR_V2_TARGET_PUNCT = process.env.NEXT_PUBLIC_TUTOR_V2_TARGET_PUNCT !== 'off';

/** Tutor brain v2 (v2/part-flow.ts v2PendingPart; spoken lessons with labelled plans): a part waits for the learner's yes only
 *  after a real part-change ask (v2AsksPartChange: a strict move-on frame, or a part named), and the part comes from the ask
 *  itself (its "Next is …" lead included), never from a sentence before it. Mic test 3 (embed-1794967959470, flag 1): the
 *  overview ended "…At the end, you can practice pronunciation if you like. Are you ready?", and "Yes." opened an empty
 *  "Pronunciation" page (Task 7i, item 1). Default ON; NEXT_PUBLIC_TUTOR_V2_PART_ASK_NAMED=off ⇒ any ask (PART_OFFERS) and the
 *  part named in its last two sentences, as before. */
export const TUTOR_V2_PART_ASK_NAMED = process.env.NEXT_PUBLIC_TUTOR_V2_PART_ASK_NAMED !== 'off';

/** Tutor brain v2 (v2/time-fit.ts, v2/part-flow.ts, v2/turn.ts, v2/facts.ts, v2/time-box.ts; with TIME_NO_SQUEEZE): an optional
 *  part is decided when the lesson arrives at it, not up front: nothing is dropped or announced on the way; when it is the next
 *  part and its minutes plus the summary's no longer fit before target + margin (measured from the real elapsed time), it is
 *  left out, the learner told once in the reply that moves on, and it is carried to the next session; asked for by name later,
 *  it is taken while it still fits before the hard stop. A plan whose required parts alone exceed target + margin keeps the
 *  Task 7f up-front drop. Mic test 3 (embed-1794967959470, flag 1): pronunciation dropped and announced in minute 1 (Task 7i,
 *  item 2). Default ON; NEXT_PUBLIC_TUTOR_V2_OPTIONAL_AT_ARRIVAL=off ⇒ the Task 7f decision at the first teaching page. */
export const TUTOR_V2_OPTIONAL_AT_ARRIVAL = process.env.NEXT_PUBLIC_TUTOR_V2_OPTIONAL_AT_ARRIVAL !== 'off';

/** Tutor brain v2 (v2/part-flow.ts, v2/time-box.ts, v2/plan-map.ts, v2/progress.ts; labelled plans): a page alone is not a part
 *  reached. A part counts as reached, done (green) or completed only once the lesson entered it: a goal of it shown or
 *  demonstrated, its page holding something, or practice counted in it; a part left out for time never. An empty part page
 *  that is not the page in view does not move the lit chip. Mic test 3 (embed-1794967959470, flags 1 and 6): an empty
 *  "Pronunciation" page was green all lesson, stored as completed, and held the close open from minute 0.83 (Task 7i, item 3).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_PART_ENTERED=off ⇒ any page of a part counts, as before. */
export const TUTOR_V2_PART_ENTERED = process.env.NEXT_PUBLIC_TUTOR_V2_PART_ENTERED !== 'off';

/** Tutor brain v2 (v2/part-close.ts mayOpenPart, v2/turn.ts; with PART_ASK_EVERY): a page block the model writes for the next
 *  part after a part ask opens only on a go (v2MoveAnswer 'go'), or the learner steering to it or naming it; any other answer
 *  keeps the page held and the ask is said again. Mic test 3 (embed-1794967959470, flag 2): the learner read a corrected
 *  sentence aloud and the "Present perfect" page opened (Task 7i, item 4). Default ON; NEXT_PUBLIC_TUTOR_V2_PAGE_NEEDS_GO=off ⇒
 *  any answer to the ask lets the page through, as before. */
export const TUTOR_V2_PAGE_NEEDS_GO = process.env.NEXT_PUBLIC_TUTOR_V2_PAGE_NEEDS_GO !== 'off';

/** Tutor brain v2 (v2/time-box.ts, v2/facts.ts, v2/interrupted.ts; spoken lessons with labelled plans): stay in a part the plan
 *  gives time to. Facts only: while the lesson is ahead of its plan in a required practice part, the time line says how many of
 *  its minutes are left and to go on with it rather than offer the next part; and after a barge-in that cut sentences the
 *  learner did not hear, the next turn's facts name them, so a question lost that way can be asked again. Mic test 3
 *  (embed-1794967959470, flag 6: "it's still 13 minutes and it's rushing to the summary") (Task 7i, item 5). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_STAY_IN_PART=off ⇒ neither line, as before. */
export const TUTOR_V2_STAY_IN_PART = process.env.NEXT_PUBLIC_TUTOR_V2_STAY_IN_PART !== 'off';

/** Tutor brain v2 (v2/turn.ts): no runtime check-in ("Does that make sense so far?") after a spoken reply that says goodbye.
 *  Mic test 3 (embed-1794967959470): "…Goodbye! Does that make sense so far?" (Task 7i, item 6). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_NO_CHECKIN_AFTER_GOODBYE=off ⇒ as before. */
export const TUTOR_V2_NO_CHECKIN_AFTER_GOODBYE = process.env.NEXT_PUBLIC_TUTOR_V2_NO_CHECKIN_AFTER_GOODBYE !== 'off';

/** Tutor brain v2 (v2/part-flow.ts v2PartViewed / v2PartPracticeAsked, v2/progress.ts, v2/turn.ts, v2/facts.ts,
 *  v2/time-fit.ts, v2/learner-card.ts; spoken lessons with labelled plans): practice of another part is done on that part's
 *  page. When the learner asks for practice of a labelled part other than the one in view (earlier, left out for time, or the
 *  optional one not taken), the runtime turns the board to its page (an existing page; else a new page under its name) before
 *  the reply writes; the facts say to keep that practice's cards there and to turn back to the page of the lesson's position
 *  when it is over; the lit chip follows the page in view while it is another part's page (the position, done / green and the
 *  part flow unchanged: the position is the furthest part reached); the answers are counted and carded for the part in view.
 *  Mic test 3 (embed-1794967959470, flags 5, 7, 8): "one more past simple" and three requests at the close were practised on
 *  the page in view with the chip on Summary (Task 7k, item 1). Default ON; NEXT_PUBLIC_TUTOR_V2_PRACTICE_ON_PART_PAGE=off ⇒
 *  as before. */
export const TUTOR_V2_PRACTICE_ON_PART_PAGE = process.env.NEXT_PUBLIC_TUTOR_V2_PRACTICE_ON_PART_PAGE !== 'off';

/** Tutor brain v2 (v2/close-invite.ts, v2/turn.ts, v2/facts.ts, v2/time-fit.ts, useV2Turns; the lessons of the 7d close): a
 *  reopened close asks before it ends. The learner speaking over the closing words (7h, v2_close_called_off) or asking for
 *  more practice / another part after the invitation reopens it (state.closeReopened): the goodbye line is lifted, and after
 *  the practice the reply asks whether they want more or to finish; the lesson ends on their answer to that ask (the 7d
 *  invitation run again, an end_lesson before it deferred once), as often as they ask, until the hard stop. The request test
 *  (v2AsksMorePractice) also hears a request that names a plan part or asks "one more". Mic test 3 (embed-1794967959470,
 *  flag 8: "it's always in a hurry to end") (Task 7k, item 2). Default ON; NEXT_PUBLIC_TUTOR_V2_CLOSE_REOPENED=off ⇒ as
 *  before. */
export const TUTOR_V2_CLOSE_REOPENED = process.env.NEXT_PUBLIC_TUTOR_V2_CLOSE_REOPENED !== 'off';

/** Tutor brain v2 (v2/target-pauses.ts, TutorVoiceV2, useV2Turns): a sentence card's stressed words are set apart in its spoken
 *  copy by the Task 7l punctuation (dashes English-led, commas Japanese-led), and so is a stress word inside a longer quoted
 *  correction ("we say "in the home appliance division.""); at most two marks a piece of speech; captions, transcript, echo
 *  guard and board unchanged. Mic test 4 (embed-1795028886172, flag 1: "the word the should have been emphasised") (Task 7m,
 *  item 1). Default ON; NEXT_PUBLIC_TUTOR_V2_CARD_STRESS_SPOKEN=off ⇒ as before. */
export const TUTOR_V2_CARD_STRESS_SPOKEN = process.env.NEXT_PUBLIC_TUTOR_V2_CARD_STRESS_SPOKEN !== 'off';

/** Tutor brain v2 (v2/sentences.ts, v2/board-timing.ts, v2/facts.ts, v2/turn.ts): no false silence turn. The sentence cut
 *  also falls after `…"` before a capital, so `Try starting with "I have worked with…"` is the reply's last sentence and an ask
 *  ("try starting with" counts anywhere); a 2-second recheck after a reply that asked says so and asks for one short line (take
 *  your time, or a hint), no claim, no new card; a silence turn carries no owed-card line and keeps the owed card for the next
 *  learner turn. Mic test 4 (embed-1795028886172, flag 4) (Task 7m, item 2). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_NO_FALSE_SILENCE=off ⇒ as before. */
export const TUTOR_V2_NO_FALSE_SILENCE = process.env.NEXT_PUBLIC_TUTOR_V2_NO_FALSE_SILENCE !== 'off';

/** Tutor brain v2 (v2/turn.ts, v2/board-timing.ts): a question card in a spoken language lesson is labelled once and said
 *  once. A leading "Question:" / 「質問：」 is cut from its statement (the title says it); an inline question card's question is
 *  spoken where the card stands (before the hint that follows it) unless already said; the after-reply ask splits at 。 and
 *  hears a Japanese hand-over (答えてみて…), and adds nothing when the card's question was said. Mic test 4
 *  (embed-1795028886172, flag 5a) (Task 7m, item 3). Default ON; NEXT_PUBLIC_TUTOR_V2_QUESTION_ONCE=off ⇒ as before. */
export const TUTOR_V2_QUESTION_ONCE = process.env.NEXT_PUBLIC_TUTOR_V2_QUESTION_ONCE !== 'off';

/** Tutor brain v2 (v2/turn.ts, v2/learner-card.ts, v2/board-timing.ts): every correction is on the board in the same reply.
 *  A reply that leaves a sentence of the learner's answer owed a card runs the board check in the same turn (its length
 *  counted by characters for a language written without spaces) with a line asking for that card; a card of a starter
 *  fragment ending in "…" is refused; a sentence whose card is already on the board is not owed. Mic test 4
 *  (embed-1795028886172, flag 6; 9.94 and 11.31 min) (Task 7m, item 4). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_CORRECTION_CARD_NOW=off ⇒ as before. */
export const TUTOR_V2_CORRECTION_CARD_NOW = process.env.NEXT_PUBLIC_TUTOR_V2_CORRECTION_CARD_NOW !== 'off';

/** Tutor brain v2 (v2/spoken-sounds.ts, TutorVoiceV2): a wave dash 〜 / ～ standing for "something" is not spoken (the voice
 *  read 「今、〜しています」 as 「今、からしています」); kept between two numbers or times. Mic test 4 (embed-1795028886172,
 *  6.76 min) (Task 7m, item 5). Default ON; NEXT_PUBLIC_TUTOR_V2_WAVE_DASH=off ⇒ as before. */
export const TUTOR_V2_WAVE_DASH = process.env.NEXT_PUBLIC_TUTOR_V2_WAVE_DASH !== 'off';

/** Tutor brain v2 (v2/language-pack.ts, v2/part-flow.ts, v2/time-fit.ts, v2/turn.ts): the part-change ask is read in the lesson's
 *  teaching languages, by position (the reply's last sentence a go-on, the question-first check before it, the lead 「次は X です。」
 *  before that), the wording from the language pack; a go answer with a leading filler ("Uh, move on.", 「えっと、はい」) is a go,
 *  and a move-on. Mic test 4 (embed-1795028886172, flag 3) (Task 7n, item 1). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_PART_ASK_LANGS=off ⇒ as before. */
export const TUTOR_V2_PART_ASK_LANGS = process.env.NEXT_PUBLIC_TUTOR_V2_PART_ASK_LANGS !== 'off';

/** Tutor brain v2 (v2/progress.ts, useV2Turns): the lit part chip follows the board as painted: while a page this reply turns to
 *  is still held for its sentence, the chip stays on the page shown; it changes when that page is painted. Green stays the
 *  lesson position's. Mic test 4 (embed-1795028886172, flag 7) (Task 7n, item 2). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_CHIP_ON_PAINT=off ⇒ as before. */
export const TUTOR_V2_CHIP_ON_PAINT = process.env.NEXT_PUBLIC_TUTOR_V2_CHIP_ON_PAINT !== 'off';

/** Tutor brain v2 (v2/time-box.ts, v2/turn.ts, v2/state-carry.ts, useV2Turns, TutorVoiceV2, the embed's evelyn:clock): while the
 *  tester's debug flag panel is open the lesson clock is paused: the paused total rides in the state (`clockPausedMs`) and is
 *  taken off the engine's clock server-side (time fit, wrap, time left), the client's hard stop is pushed back by it and the host
 *  clock message leaves it out. Billing and the recorded session length are unchanged. Only the debug flag tool pauses. Mic test
 *  4 (embed-1795028886172: 4.71 min of flags) (Task 7n, item 3). Default ON; NEXT_PUBLIC_TUTOR_V2_FLAG_CLOCK_PAUSE=off ⇒ as before. */
export const TUTOR_V2_FLAG_CLOCK_PAUSE = process.env.NEXT_PUBLIC_TUTOR_V2_FLAG_CLOCK_PAUSE !== 'off';

/** Tutor brain v2 (v2/note-targets.ts, v2/turn.ts): in a spoken lesson that teaches a language, the session part asks for the
 *  target word or short phrase of a rule / correction note in double quotes (a <board note> block or annotate), every time it
 *  stands as the target; a spoken note keeps the quotes, so its target gets the 7l marks in speech too (fix round 1, I2). Mic test 4
 *  (embed-1795028886172, flag 2: "use for + the number of years: for six years" with no emphasis on "for") (Task 7o, item 1).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_NOTE_TARGET_QUOTES=off ⇒ as before. */
export const TUTOR_V2_NOTE_TARGET_QUOTES = process.env.NEXT_PUBLIC_TUTOR_V2_NOTE_TARGET_QUOTES !== 'off';

/** Tutor brain v2 (v2/note-targets.ts, v2/turn.ts, toolDefinitions annotate, WhiteboardCanvas / RichBoardText / NoteTargetText):
 *  a note of such a lesson carries `targets: true`, and the board draws each short quoted span in it (at most three words, the 7h
 *  target test; straight, curly or 「」 quotes, or **…**) as a sentence card draws a stress word (amber, semibold, underlined),
 *  without the quote marks. Every other note renders as before (Task 7o, item 2). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_NOTE_TARGET_MARK=off ⇒ as before. */
export const TUTOR_V2_NOTE_TARGET_MARK = process.env.NEXT_PUBLIC_TUTOR_V2_NOTE_TARGET_MARK !== 'off';

/** Tutor brain v2 (v2/note-targets.ts, v2/turn.ts): a note of such a lesson that quotes no target, written in a reply that put up a
 *  sentence card with stress words, carries those stress words that stand in it as whole words (`stress`), and the board marks
 *  them there (Task 7o, item 3). Default ON; NEXT_PUBLIC_TUTOR_V2_NOTE_STRESS_MARK=off ⇒ as before. */
export const TUTOR_V2_NOTE_STRESS_MARK = process.env.NEXT_PUBLIC_TUTOR_V2_NOTE_STRESS_MARK !== 'off';

/** Tutor brain v2 (v2/markdown-stars.ts, v2/turn.ts): in such a lesson the `**` of markdown bold is taken out of the reply's words
 *  as they stream, so captions and the transcript never show the asterisks (mic test 4, 12.87 min: 「一緒に仕事をする**人**に使います」)
 *  (Task 7o, item 4). Default ON; NEXT_PUBLIC_TUTOR_V2_NO_MARKDOWN_STARS=off ⇒ as before. */
export const TUTOR_V2_NO_MARKDOWN_STARS = process.env.NEXT_PUBLIC_TUTOR_V2_NO_MARKDOWN_STARS !== 'off';

/** Tutor brain v2 (v2/card-gloss.ts, v2/facts.ts): in a spoken lesson that teaches a language through the learner's own language,
 *  while the learner's working level is beginner (or not known yet), the facts ask for gloss="…" on question cards (<board
 *  problem>: the question in the learner's language, one short line) and on rule notes (<board note>: one short line on what the
 *  rule means). Above beginner, and in every other lesson, no line. Mic test 4 (embed-1795028886172, flag 5c) (Task 7p, item 1).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_CARD_GLOSS_ASK=off ⇒ as before. */
export const TUTOR_V2_CARD_GLOSS_ASK = process.env.NEXT_PUBLIC_TUTOR_V2_CARD_GLOSS_ASK !== 'off';

/** Tutor brain v2 (v2/board-inline.ts, v2/turn.ts, toolDefinitions show_problem / annotate, WhiteboardCanvas / CardGloss): the
 *  gloss attribute of a problem / note block rides on the card (`gloss`), kept only in such a lesson at the beginner level (or
 *  not known yet) and dropped otherwise, and the board draws it under the card in the sentence card's small grey gloss style. It
 *  is never spoken, never the card's ask and not in the board record (Task 7p, items 2 and 3). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_CARD_GLOSS_SHOW=off ⇒ as before. */
export const TUTOR_V2_CARD_GLOSS_SHOW = process.env.NEXT_PUBLIC_TUTOR_V2_CARD_GLOSS_SHOW !== 'off';

/** Tutor brain v2 (v2/card-gloss.ts, v2/facts.ts): when the last reply put up a question card without a gloss while one was asked
 *  for, the next turn's facts say so once (no runtime translation) (Task 7p, item 4). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_CARD_GLOSS_REMIND=off ⇒ as before. */
export const TUTOR_V2_CARD_GLOSS_REMIND = process.env.NEXT_PUBLIC_TUTOR_V2_CARD_GLOSS_REMIND !== 'off';

/** Tutor brain v2 (v2/adaptive.ts, v2/turn.ts, v2/facts.ts): in a spoken lesson that teaches a language with a labelled plan, the
 *  support for the next question steps up after two answers in a row that needed a correction (their sentence carded corrected)
 *  and down after two answered right (carded as said), over five steps (stretch, normal, starter, gap, repeat), kept per lesson
 *  and moved one step towards normal at a part change. Facts only: one line while the step is not normal, in practice parts
 *  only (not the level check, the overview, pronunciation or the summary). Mic test 4 (embed-1795028886172) (Task 7q, item 1).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_SUPPORT_STEPS=off ⇒ as before. */
export const TUTOR_V2_SUPPORT_STEPS = process.env.NEXT_PUBLIC_TUTOR_V2_SUPPORT_STEPS !== 'off';

/** Tutor brain v2 (v2/adaptive.ts, v2/turn.ts, v2/facts.ts, v2/memory.ts): in such a lesson a correction (their sentence carded
 *  corrected, its stress words the target) is recorded, at most 5; in a later practice part not behind its plan minutes, one at
 *  a time and at most 3 a lesson, the facts ask for one question whose natural answer needs the target (for at most 2 turns);
 *  their next carded sentences in that part give the outcome (passed / missed / not asked), a pass allows one word of praise, a
 *  miss goes to the profile's gaps. Facts only. Mic test 4 (embed-1795028886172) (Task 7q, item 2). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_RETEST_MISTAKE=off ⇒ as before. */
export const TUTOR_V2_RETEST_MISTAKE = process.env.NEXT_PUBLIC_TUTOR_V2_RETEST_MISTAKE !== 'off';

/** Tutor brain v2 (v2/one-question.ts v2AsksTheLearner, components/v2/TutorVoiceV2.tsx, v2/facts.ts): one test for "this reply
 *  asked the learner something", on the reply's whole sentences, used by the client's 2 s "ended on a statement" recheck and by
 *  the facts of a silence turn. It knows a Japanese question ending 「…か。」 with no ？, 〜てみましょう, 繰り返して(ください),
 *  教えて / 始めて (ください), どうぞ, and an instruction to speak in either of the last two sentences. Mic test 5
 *  (embed-1795050656326): 9 asks in 「か。」 got the 2 s recheck and the tutor asked again or answered itself (Task 7r, item 1).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_ASK_ONE_TEST=off ⇒ as before. */
export const TUTOR_V2_ASK_ONE_TEST = process.env.NEXT_PUBLIC_TUTOR_V2_ASK_ONE_TEST !== 'off';

/** Tutor brain v2 (v2/facts.ts): a silence turn after a reply that asked them something says the question in hand is not answered
 *  yet: one short encouragement or a smaller hint; never the answer, no new question, the question or the part-change ask not
 *  repeated word for word (the tutor answered its own summary question, mic test 5, embed-1795050656326) (Task 7r, item 2).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_SILENCE_AFTER_ASK=off ⇒ as before. */
export const TUTOR_V2_SILENCE_AFTER_ASK = process.env.NEXT_PUBLIC_TUTOR_V2_SILENCE_AFTER_ASK !== 'off';

/** Tutor brain v2 (v2/language-pack.ts v2EndingAsk): a part ask in a language whose pack words it by clauses (Japanese) is read by
 *  its clauses: the reply's last one or two asking sentences hold a go-on verb or a "questions?" clause, and the part is named
 *  there or in the sentence before (「次は会話の練習です。質問がありますか、それとも進みましょうか。」). Mic test 5
 *  (embed-1795050656326): none of 9 Japanese part asks was read (Task 7r, item 3). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_PART_ASK_CLAUSES=off ⇒ as before. */
export const TUTOR_V2_PART_ASK_CLAUSES = process.env.NEXT_PUBLIC_TUTOR_V2_PART_ASK_CLAUSES !== 'off';

/** Tutor brain v2 (v2/part-flow.ts v2MoveAnswer / v2GoForPart, v2/turn.ts): naming the part the ask named ("pronunciation.",
 *  "Uh, summary.", まとめ, "wrap up" to an ask naming the summary) is a go; a page of the part a go answered (or the summary) is not
 *  held for another ask, and no runtime part ask is added to that reply. Mic test 5 (embed-1795050656326, 11.9 and 18 min)
 *  (Task 7r, item 4). Default ON; NEXT_PUBLIC_TUTOR_V2_PART_GO_NAMED=off ⇒ as before. */
export const TUTOR_V2_PART_GO_NAMED = process.env.NEXT_PUBLIC_TUTOR_V2_PART_GO_NAMED !== 'off';

/** Tutor brain v2 (v2/practice-facts.ts, v2/facts.ts): the turn after the tutor asked the learner for a sentence (to make one, a
 *  question included, or to say a given one: learner-card.ts v2AskedForSentence, the structural record), the facts say their words
 *  are their practice: feedback and a card, never an answer from the persona card. Mic test 5 (embed-1795050656326, 10.2 min:
 *  "Did you enjoy the robotics exhibition…?" was answered as the tutor's own weekend) (Task 7s, item 2). Spoken lessons that teach a
 *  language only. Default ON; NEXT_PUBLIC_TUTOR_V2_PRACTISED_SENTENCE=off ⇒ as before. */
export const TUTOR_V2_PRACTISED_SENTENCE = process.env.NEXT_PUBLIC_TUTOR_V2_PRACTISED_SENTENCE !== 'off';

/** Tutor brain v2 (v2/practice-facts.ts, v2/adaptive.ts): a starter given for an answer is the opening of the answer itself, a
 *  statement ("Yes, I enjoyed…"), never the question form ("Did you enjoy…", "Has the project…"); asking them to make a question
 *  is said plainly. The 7q `starter` step says the same. Mic test 5 (embed-1795050656326, 10.2 and 14.1 min) (Task 7s, item 3).
 *  Spoken lessons that teach a language only. Default ON; NEXT_PUBLIC_TUTOR_V2_STARTER_IS_ANSWER=off ⇒ as before. */
export const TUTOR_V2_STARTER_IS_ANSWER = process.env.NEXT_PUBLIC_TUTOR_V2_STARTER_IS_ANSWER !== 'off';

/** Tutor brain v2 (v2/pronunciation.ts, v2/turn.ts): pronunciation practice shows on its page and counts. Each item armed by
 *  practise_pronunciation while the pronunciation part's page is in view is written on it as a card by the runtime; a measured
 *  attempt there counts as practice of that part (so the part is entered and the close does not say it was not reached); the
 *  facts say the measured score is the only number to say; no check-in is added to a reply that asks them to repeat or say
 *  something, or that armed a recording. Mic test 5 (embed-1795050656326, 16–19 min) (Task 7s, item 4). Spoken lessons that teach
 *  a language only. Default ON; NEXT_PUBLIC_TUTOR_V2_PRONUNCIATION_PAGE=off ⇒ as before. */
export const TUTOR_V2_PRONUNCIATION_PAGE = process.env.NEXT_PUBLIC_TUTOR_V2_PRONUNCIATION_PAGE !== 'off';

/** Tutor brain v2 (v2/practice-facts.ts, whiteboard/WhiteboardCanvas.tsx): a question the learner must answer goes in a question
 *  card (<board problem>), never a note; and a plain note with a gloss line is drawn as a note (white, slate edge), not in the
 *  grey of a learner's sentence card. Mic test 5 (embed-1795050656326, 18.4 min: the summary's check question looked like the
 *  four sentence cards above it) (Task 7s, item 5). Spoken lessons that teach a language only. Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_QUESTION_NOT_NOTE=off ⇒ as before. */
export const TUTOR_V2_QUESTION_NOT_NOTE = process.env.NEXT_PUBLIC_TUTOR_V2_QUESTION_NOT_NOTE !== 'off';

/** Tutor v2 session header (session/HeaderClock.tsx, SessionControls.tsx): the header timer leaves out the time the tester's
 *  debug flag panel was open (development only), as the lesson clock does (7n FLAG_CLOCK_PAUSE). Mic test 5
 *  (embed-1795050656326: 22:35 / 20:00 with about 5 min of flags) (Task 7s, item 6). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_HEADER_CLOCK_PAUSE=off ⇒ as before. */
export const TUTOR_V2_HEADER_CLOCK_PAUSE = process.env.NEXT_PUBLIC_TUTOR_V2_HEADER_CLOCK_PAUSE !== 'off';

/** Tutor brain v2 (v2/turn.ts): a sentence card of a two-language lesson that ends on a preposition or an article ("I am proud
 *  of.") where the learner's own sentence goes on past that word is a fragment, not a sentence: refused like a "…" starter (7m).
 *  Mic test 5 (embed-1795050656326, 13 min) (Task 7s, item 6). Default ON; NEXT_PUBLIC_TUTOR_V2_FRAGMENT_CARD=off ⇒ as before. */
export const TUTOR_V2_FRAGMENT_CARD = process.env.NEXT_PUBLIC_TUTOR_V2_FRAGMENT_CARD !== 'off';

/** Tutor brain v2 (v2/turn.ts, v2/board-timing.ts, components/v2/TutorVoiceV2.tsx): in a spoken lesson that teaches a language, a
 *  sentence card or note whose words are spoken in the reply appears as that sentence starts (the runtime's own spoken line for
 *  it, or the sentence that quotes it), not at the start of its paragraph; and no board item of a reply appears before one the
 *  reply wrote earlier. Mic test 6 (embed-1795067373124, 18.4 min: each summary card went up one sentence early) (Task 7u,
 *  item 1). Default ON; NEXT_PUBLIC_TUTOR_V2_CARD_AT_SENTENCE=off ⇒ as before. */
export const TUTOR_V2_CARD_AT_SENTENCE = process.env.NEXT_PUBLIC_TUTOR_V2_CARD_AT_SENTENCE !== 'off';

/** Tutor brain v2 (v2/summary-layout.ts, v2/sentence-cards.ts, v2/turn.ts, whiteboard/WhiteboardCanvas.tsx): the summary page of a
 *  spoken language lesson with a labelled plan is laid out in groups: the rule notes, a "What went well" heading and 1–2 right
 *  sentences, a "To improve" heading and 1–2 corrected sentences (the changed words marked), at most 4 sentence cards (the runtime
 *  refuses a fifth on the summary page); a heading note is drawn as a bold line with no box. Mic test 6 (embed-1795067373124)
 *  (Task 7u, item 2). Default ON; NEXT_PUBLIC_TUTOR_V2_SUMMARY_GROUPS=off ⇒ as before. */
export const TUTOR_V2_SUMMARY_GROUPS = process.env.NEXT_PUBLIC_TUTOR_V2_SUMMARY_GROUPS !== 'off';

/** Tutor brain v2 (v2/close-check.ts, v2/facts.ts, v2/turn.ts): the plan's closing check question is its own step: the summary
 *  reply ends on it as a question card and does not answer it; the next reply gives feedback on their answer, then the questions
 *  invitation (7d) deferred by that one reply. Skipped with about a minute or less to the hard stop. Mic test 6
 *  (embed-1795067373124, 18.8 min: the tutor answered the check itself) (Task 7u, item 3). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_CLOSE_CHECK=off ⇒ as before. */
export const TUTOR_V2_CLOSE_CHECK = process.env.NEXT_PUBLIC_TUTOR_V2_CLOSE_CHECK !== 'off';

/** Tutor brain v2 (v2/working-level.ts): the level check's facts say not to number its questions aloud ("Now the second
 *  question" was said under the third question card, the follow-up having a card too). Mic test 6 (embed-1795067373124, 1.3 min)
 *  (Task 7u, item 4). Default ON; NEXT_PUBLIC_TUTOR_V2_LEVEL_NO_NUMBER=off ⇒ as before. */
export const TUTOR_V2_LEVEL_NO_NUMBER = process.env.NEXT_PUBLIC_TUTOR_V2_LEVEL_NO_NUMBER !== 'off';

/** Tutor brain v2 (v2/sentence-cards.ts v2IsCorrectionOf, used by the corrected-sentence list, the learner cards and 7q): a number
 *  written as a digit and a filler ("uh") are no correction: "I have led uh my team for 2 years" → "…for two years." is their
 *  sentence right. Mic test 6 (embed-1795067373124, 5.0 and 9.7 min: two false "wrong" signals) (Task 7u, item 5). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_NUMBER_NOT_CORRECTION=off ⇒ as before. */
export const TUTOR_V2_NUMBER_NOT_CORRECTION = process.env.NEXT_PUBLIC_TUTOR_V2_NUMBER_NOT_CORRECTION !== 'off';

/** Tutor brain v2 (v2/time-fit.ts, v2/turn.ts, v2/facts.ts, v2/adaptive.ts): a part's time is measured from when the lesson entered
 *  it (state.partStart, round-tripped), not from the lesson's start: "there is time in this part, go on with it" holds until half of
 *  its own plan minutes have passed since it began, "this part's minutes are used, offer the next part" comes once all of them have,
 *  and the lesson-clock "[part] would be running now" guide is not shown beside them. Time an early part saved stays in hand for the
 *  core and optional parts. Spoken timed lessons with a labelled plan only. Mic test 6 (embed-1795067373124: a level check done in
 *  1.5 of its 3 minutes made "Your job" run 5.3 minutes against 3 planned) (Task 7v, item 1). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_PART_CLOCK=off ⇒ as before. */
export const TUTOR_V2_PART_CLOCK = process.env.NEXT_PUBLIC_TUTOR_V2_PART_CLOCK !== 'off';

/** Tutor brain v2 (v2/time-fit.ts, v2/turn.ts, v2/facts.ts, v2/plan-map.ts): the 7i time fit (the optional part's minutes plus the
 *  summary's within the box plus the margin, from the real elapsed time) alone decides an optional part: at the offer, at their yes
 *  (its page opens past the wrap minute while it fits, and the wrap moves to the end of its minutes), and when they ask for it later
 *  by name (its page opens for it while it fits). The wrap minute never overrides a fit that says yes. Mic test 6
 *  (embed-1795067373124: "Uh, yes, let's go." at 18.1 minutes, after the wrap at 18, opened nothing, and a later request with six
 *  minutes left was refused) (Task 7v, item 2). Default ON; NEXT_PUBLIC_TUTOR_V2_OPTIONAL_FIT=off ⇒ as before. */
export const TUTOR_V2_OPTIONAL_FIT = process.env.NEXT_PUBLIC_TUTOR_V2_OPTIONAL_FIT !== 'off';

/** Tutor brain v2 (v2/adaptive.ts, under RETEST_MISTAKE): a retest's target is the word(s) the correction changed (numbers and
 *  fillers aside, function words kept), each shown with one neighbour word ("in the home"); more than three changed words, or none:
 *  the card's stress words, adjacent ones as one phrase. The praise line names only changed words. Mic test 6 (embed-1795067373124:
 *  "on → in" became the target "home, appliance, division", and "You said 'customers' clearly" praised a word never wrong) (Task 7v,
 *  item 3). Default ON; NEXT_PUBLIC_TUTOR_V2_RETEST_TARGET_CHANGED=off ⇒ as before. */
export const TUTOR_V2_RETEST_TARGET_CHANGED = process.env.NEXT_PUBLIC_TUTOR_V2_RETEST_TARGET_CHANGED !== 'off';

/** Tutor brain v2 (v2/adaptive.ts, under RETEST_MISTAKE): retests are spread: at most two corrections recorded per part (a newer one
 *  replaces the oldest never offered when the list is full), one retest offered per part, one place kept for a free-conversation part
 *  still to come, and only retests that were put to them (not ended "not asked") count against the three a lesson. Mic test 6
 *  (embed-1795067373124: all three retests went to Present perfect, none was asked, and the list was full after "Your job") (Task
 *  7v, item 4). Default ON; NEXT_PUBLIC_TUTOR_V2_RETEST_SPREAD=off ⇒ as before. */
export const TUTOR_V2_RETEST_SPREAD = process.env.NEXT_PUBLIC_TUTOR_V2_RETEST_SPREAD !== 'off';

/** Tutor brain v2 (v2/learner-card.ts): an answer to a fill-the-gap ask ("Next, fill the gap in this sentence and say the whole
 *  sentence aloud. Last year, I ___ a customer in Canada.", or a question card with a ___ gap in the reply), or to an ask the learner
 *  spoke over (its sentences in state.unheard), is an answer to an ask for a sentence: it is carded and counted for the support step.
 *  Mic test 6 (embed-1795067373124, turns 30, 35, 44: three right answers gave no practice signal) (Task 7v, item 5). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_ANSWER_SIGNAL=off ⇒ as before. */
export const TUTOR_V2_ANSWER_SIGNAL = process.env.NEXT_PUBLIC_TUTOR_V2_ANSWER_SIGNAL !== 'off';

/** Tutor brain v2 (v2/adaptive.ts, v2/facts.ts): the support step's facts line names the form of the next question first, with one
 *  example of its shape ("not a starter" for a gap), and stands beside the practice facts for the next question; in a part the plan
 *  marks as free conversation (its note, aim or name: "open conversation", "conversation partner") the step never goes above
 *  starter (no gap-fill or repeat drills; stretch allowed). Mic test 6 (embed-1795067373124: a third of new questions ignored the
 *  step, and the core conversation became nine mostly gap drills) (Task 7v, item 6). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_SUPPORT_FOLLOWED=off ⇒ as before. */
export const TUTOR_V2_SUPPORT_FOLLOWED = process.env.NEXT_PUBLIC_TUTOR_V2_SUPPORT_FOLLOWED !== 'off';

/** Tutor brain v2 (components/v2/useV2Turns.ts, v2/practice-facts.ts): words of the learner's whose reply was cut before anything
 *  reached them are carried into the next turn with the words that cut it, and a short phrase right after a full sentence in the
 *  same turn is read as a self-correction of that sentence, never corrected as a fragment. Mic test 6 (embed-1795067373124, 6.1
 *  min: "for senior bosses." after his full sentence reached the tutor alone and was corrected as a fragment) (Task 7v, item 7a).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_SELF_CORRECTION=off ⇒ as before. */
export const TUTOR_V2_SELF_CORRECTION = process.env.NEXT_PUBLIC_TUTOR_V2_SELF_CORRECTION !== 'off';

/** Tutor brain v2 (v2/echo-window.ts): heard words that run ahead of the tutor's voice (two or more of them are words of the part
 *  playing that it has not played yet) are the learner saying the sentence with it or after it, never its echo. Mic test 6
 *  (embed-1795067373124, 13:38: his repeat-after-me said with the model sentence was dropped as the tutor's own voice) (Task 7v,
 *  item 7b). Default ON; NEXT_PUBLIC_TUTOR_V2_REPEAT_NOT_ECHO=off ⇒ as before. */
export const TUTOR_V2_REPEAT_NOT_ECHO = process.env.NEXT_PUBLIC_TUTOR_V2_REPEAT_NOT_ECHO !== 'off';

/** Tutor brain v2 (v2/summary-marks.ts, v2/turn.ts, v2/facts.ts): each correction made in the lesson is recorded with what the learner
 *  said and the words it changed (state.corrections); on the Summary page a sentence card that is one of them gets those marks when the
 *  model wrote none (or words not in the sentence), a recorded correction is not painted under "What went well", and the summary facts
 *  list the corrections as "said → correct (changed: …)". Spoken lessons that teach a language with a labelled plan. Mic test 7
 *  (embed-1795100797999: the four summary cards carried no marks, and a corrected sentence stood under "What went well") (Task 7w,
 *  item 1). Default ON; NEXT_PUBLIC_TUTOR_V2_SUMMARY_MARKS=off ⇒ as before. */
export const TUTOR_V2_SUMMARY_MARKS = process.env.NEXT_PUBLIC_TUTOR_V2_SUMMARY_MARKS !== 'off';

/** Tutor brain v2 (v2/summary-layout.ts): the summary page's facts say each group is said aloud, one or two sentences before its
 *  cards. Mic test 7 (embed-1795100797999, 16.9 min: the Summary page went up with nothing said for it) (Task 7w, item 2). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_SUMMARY_SPOKEN=off ⇒ as before. */
export const TUTOR_V2_SUMMARY_SPOKEN = process.env.NEXT_PUBLIC_TUTOR_V2_SUMMARY_SPOKEN !== 'off';

/** Tutor brain v2 (v2/summary-close.ts, v2/time-box.ts, v2/close-check.ts, v2/turn.ts, v2/facts.ts): once the tutor begins the summary
 *  (its page written), the close is open from that reply on, whatever the wrap minute or a held wrap says; the summary is marked begun
 *  as the page is written (an end_lesson in that reply meets the check / invitation deferral, never the generic menu); the check
 *  question's line stands beside the summary page's; a summary reply that skipped the check owes it on the next reply, once. Spoken
 *  lessons that teach a language with a labelled plan. Mic test 7 (embed-1795100797999, 16.9 min: summary given before the close
 *  opened, no check, no invitation, "something harder, more practice…" after it) (Task 7w, item 3). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_SUMMARY_OPENS_CLOSE=off ⇒ as before. */
export const TUTOR_V2_SUMMARY_OPENS_CLOSE = process.env.NEXT_PUBLIC_TUTOR_V2_SUMMARY_OPENS_CLOSE !== 'off';

/** Tutor brain v2 (v2/turn.ts): the blank-board fallback of the opening reply, in a spoken lesson that teaches a language with a
 *  labelled plan that opens on an overview part, opens that part's page with the lesson's title as its heading: never the plan's
 *  learning objectives, and the overview's own page block then stays on it. Mic test 7 (embed-1795100797999: an untitled page 1 of
 *  the title and three objectives, then an "Overview" page saying the same) (Task 7w, item 4). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_OPENING_PAGE_TITLE=off ⇒ as before. */
export const TUTOR_V2_OPENING_PAGE_TITLE = process.env.NEXT_PUBLIC_TUTOR_V2_OPENING_PAGE_TITLE !== 'off';

/** Tutor session (TutorSession.tsx, v2/time-fit.ts v2OverlongQuiet): the old `segment_overlong` warning is not raised where the 7v part
 *  clock governs the part (spoken timed v2 lessons with a labelled plan). Mic test 7 (embed-1795100797999: it fired three times beside
 *  the part clock) (Task 7w, item 5). Default ON; NEXT_PUBLIC_TUTOR_V2_OVERLONG_QUIET=off ⇒ as before. */
export const TUTOR_V2_OVERLONG_QUIET = process.env.NEXT_PUBLIC_TUTOR_V2_OVERLONG_QUIET !== 'off';

/** Tutor brain v2 (v2/part-flow.ts, v2/optional-hold.ts, v2/facts.ts, v2/turn.ts): a part opened on the learner's yes begins with its
 *  own first step from the plan (its opening question / choice, asked and waited for); an optional part that was taken is not left
 *  before two items and, while it still fits, half of its own minutes, unless the learner asks to stop or move on, and the summary
 *  page's lines are not in the facts meanwhile. Spoken lessons that teach a language with a labelled plan. Mic test 7
 *  (embed-1795100797999, 16.3 min: the pronunciation part skipped its choice and ended after one word) (Task 7x, item 1). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_PART_FIRST_STEP=off ⇒ as before. */
export const TUTOR_V2_PART_FIRST_STEP = process.env.NEXT_PUBLIC_TUTOR_V2_PART_FIRST_STEP !== 'off';

/** Tutor brain v2 (v2/adaptive.ts, v2/turn.ts): in a part the plan marks as free conversation, no starter line unless the learner was
 *  silent or asked for help, at most two corrections made aloud (later mistakes carded quietly, kept for the summary), and once, at half
 *  the part's minutes, an invitation for the learner to ask the tutor a question. Spoken lessons that teach a language with a labelled
 *  plan. Mic test 7 (embed-1795100797999: twelve starter questions, seven corrections, no question of the learner's) (Task 7x, item 2).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_FREE_CONVERSATION=off ⇒ as before. */
export const TUTOR_V2_FREE_CONVERSATION = process.env.NEXT_PUBLIC_TUTOR_V2_FREE_CONVERSATION !== 'off';

/** Tutor brain v2 (v2/reply-gate.ts, v2/turn.ts, v2/one-question.ts): in a spoken language lesson, a reply to the learner's practice
 *  answer that asks them to say a sentence again ends there: a later question in it (spoken or on a question card) is left out, and
 *  the next question comes after their repeat. Mic test 7 (embed-1795100797999: five barge-ins, each his repeat over the next
 *  question) (Task 7x, item 3). Default ON; NEXT_PUBLIC_TUTOR_V2_REPEAT_THEN_WAIT=off ⇒ as before. */
export const TUTOR_V2_REPEAT_THEN_WAIT = process.env.NEXT_PUBLIC_TUTOR_V2_REPEAT_THEN_WAIT !== 'off';

/** Tutor brain v2 (v2/adaptive.ts): the retest line is the instruction for the next question ("Your next question must make them
 *  say …"), sent for up to three turns, and its outcome stays open until the part it was offered in ends: a later carded sentence of
 *  theirs in that part using the target right = passed, a new correction on it = missed. Mic test 7 (embed-1795100797999: six
 *  offered, none asked; a late right use two turns after the window closed) (Task 7x, item 4). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_RETEST_ASKED=off ⇒ as before. */
export const TUTOR_V2_RETEST_ASKED = process.env.NEXT_PUBLIC_TUTOR_V2_RETEST_ASKED !== 'off';

/** Tutor brain v2 (v2/echo-window.ts, components/v2/TutorVoiceV2.tsx): a paused voice ends the played stretch for the echo clock
 *  (words that begin or keep growing more than the echo tail after the pause are the learner's), a partial that adds words keeps a
 *  pause going (it ends on the transcript or on silence, not on the sound-pause clock), and one heard word matched to the played
 *  stretch is undecided, never the tutor's own voice. Mic test 8 (embed-1795115593161, wall 19:09–19:12: his "I" over the paused
 *  repeat model taken for echo, the voice spoke over him) (Task 7y, item 1). Default ON; NEXT_PUBLIC_TUTOR_V2_PAUSE_NOT_ECHO=off ⇒
 *  as before. */
export const TUTOR_V2_PAUSE_NOT_ECHO = process.env.NEXT_PUBLIC_TUTOR_V2_PAUSE_NOT_ECHO !== 'off';

/** Tutor brain v2 (components/v2/TutorVoiceV2.tsx, v2/board-pause.ts): while the voice is paused (barge-in pause, sound pause, the flag
 *  panel) the board paints nothing: every arriving item is held, the 45 s hold timers are suspended with their remaining time and
 *  restarted on resume. Mic test 8 (embed-1795115593161, wall 10:15 two cards painted into a barge-in pause; 10:22 → 11:07 a question
 *  painted during the flag pause) (Task 7y, item 2). Default ON; NEXT_PUBLIC_TUTOR_V2_PAUSE_HOLDS_BOARD=off ⇒ as before. */
export const TUTOR_V2_PAUSE_HOLDS_BOARD = process.env.NEXT_PUBLIC_TUTOR_V2_PAUSE_HOLDS_BOARD !== 'off';

/** Tutor brain v2 (v2/echo-window.ts, components/v2/TutorVoiceV2.tsx): on a confirmed barge-in the sentence playing counts as heard
 *  when the echo clock shows at least V2_MOSTLY_HEARD_SHARE of its words played (the record, state.unheard). Mic test 8
 *  (embed-1795115593161, wall 12:03: a bare "Yes." over the last words of a part ask and the tutor asked again) (Task 7y, item 3).
 *  Default ON; NEXT_PUBLIC_TUTOR_V2_MOSTLY_HEARD=off ⇒ as before (the sentence playing is always unheard). */
export const TUTOR_V2_MOSTLY_HEARD = process.env.NEXT_PUBLIC_TUTOR_V2_MOSTLY_HEARD !== 'off';

/** Tutor brain v2 (v2/sentences.ts, v2/languages.ts, v2/target-pauses.ts): a lone letter and a full stop before a capitalised word
 *  ends the sentence; a sentence led in Latin script that quotes a Japanese span is spoken in parts (English frame, the Japanese span,
 *  the rest), each part's language by its script; target marks (dash / Japanese comma) by the language of the part around the target.
 *  Mic test 8 (embed-1795115593161, wall 02:56: "…we say "washing machines" with an s. Your question … 「…」" went whole to the
 *  Japanese voice) (Task 7y, item 4). Default ON; NEXT_PUBLIC_TUTOR_V2_MIXED_SENTENCE_PARTS=off ⇒ as before. */
export const TUTOR_V2_MIXED_SENTENCE_PARTS = process.env.NEXT_PUBLIC_TUTOR_V2_MIXED_SENTENCE_PARTS !== 'off';

/** Tutor brain v2 (v2/optional-hold.ts, v2/part-flow.ts): a part opened on the learner's yes whose plan opening question leads with a
 *  yes/no offer of the part and then gives choices: the facts say they already said yes, to say in a few words that it is starting and
 *  give the choices (quoted), not to ask again whether they want it, and that its question card holds the choices. Nothing after the
 *  yes/no: the 7x line as before. Mic test 8 (embed-1795115593161, wall 17:35: "Yes, pronunciation." got the yes/no again) (Task 7z,
 *  item 1). Default ON; NEXT_PUBLIC_TUTOR_V2_PART_YES_CHOICES=off ⇒ as before. */
export const TUTOR_V2_PART_YES_CHOICES = process.env.NEXT_PUBLIC_TUTOR_V2_PART_YES_CHOICES !== 'off';

/** Tutor brain v2 (v2/turn.ts, v2/close-check.ts, v2/close-invite.ts, lib/tutor/qpin-behavior.ts, components/v2/useV2Turns.ts): a close
 *  step whose ask is in state.unheard (the check question, the invitation to ask questions) is not counted as given and is owed again;
 *  a question pin is not cleared by words said over an ask that was not heard; the check's answer line says reading the card back is
 *  no explanation; a question card the runtime speaks drops a lead-in clause the sentence just before already said. Mic test 8
 *  (embed-1795115593161, wall 21:45–22:02: the invitation cut 0.8 s in, then goodbye) (Task 7z, item 2). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_UNHEARD_ASK_OWED=off ⇒ as before. */
export const TUTOR_V2_UNHEARD_ASK_OWED = process.env.NEXT_PUBLIC_TUTOR_V2_UNHEARD_ASK_OWED !== 'off';

/** Tutor brain v2 (v2/adaptive.ts, v2/facts.ts): in a free-conversation part, a positive facts line: ask the question and stop, a
 *  sentence starter only after silence or a request for help (the general starter line is not sent then); the "no more corrections
 *  aloud" line stands beside the card line of their answer. Mic test 8 (embed-1795115593161: 11 starters, 4 corrections aloud) (Task
 *  7z, item 3). Default ON; NEXT_PUBLIC_TUTOR_V2_FREE_CONV_NO_STARTER=off ⇒ as before. */
export const TUTOR_V2_FREE_CONV_NO_STARTER = process.env.NEXT_PUBLIC_TUTOR_V2_FREE_CONV_NO_STARTER !== 'off';

/** Tutor brain v2 (v2/turn.ts): in a lesson whose labelled plan opens on an overview part, the opening reply's first page is always
 *  the overview's page with the plan title as its heading, written before anything the reply writes (which goes under it). Mic test 8
 *  (embed-1795115593161: an untitled "Page 1" holding the model's grammar note) (Task 7z, item 4). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_OPENING_PAGE_FIRST=off ⇒ as before (the 7w fallback only when the reply painted nothing). */
export const TUTOR_V2_OPENING_PAGE_FIRST = process.env.NEXT_PUBLIC_TUTOR_V2_OPENING_PAGE_FIRST !== 'off';

/** Tutor brain v2 (v2/adaptive.ts, v2/turn.ts): each recorded correction keeps the tutor question that drew it; the retest line gives
 *  the corrected sentence and that question, to be asked again in fresh words before the next question. Mic test 8
 *  (embed-1795115593161: 1 of 3 retests asked; fragments no other question fitted) (Task 7z, item 5). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_RETEST_QUESTION=off ⇒ as before. */
export const TUTOR_V2_RETEST_QUESTION = process.env.NEXT_PUBLIC_TUTOR_V2_RETEST_QUESTION !== 'off';

/** Tutor brain v2 (v2/optional-hold.ts, v2/facts.ts): once the hold of an optional part taken lifts and the part still has minutes, the
 *  facts say to ask "one more, or move on?" before leaving it. Facts only. Mic test 8 (embed-1795115593161, wall 20:53: the summary in
 *  the reply of the second score, 1.2 of its minutes left) (Task 7z, item 6). Default ON; NEXT_PUBLIC_TUTOR_V2_OPTIONAL_ONE_MORE=off ⇒
 *  as before. */
export const TUTOR_V2_OPTIONAL_ONE_MORE = process.env.NEXT_PUBLIC_TUTOR_V2_OPTIONAL_ONE_MORE !== 'off';

/** Tutor brain v2 (v2/turn.ts): a reply that corrects their sentence (a sentence card that reworks their words) and ends by asking them to
 *  say it again (one-question.ts v2AsksRepeat) is not a reply that "did not catch it" (learner-card.ts V2_REPLY_MISHEARD matched
 *  「もう一度言って…」), so the correction is counted for the support steps and re-tests and the owed-card check. A real "sorry, I didn't catch
 *  that" (no correction card) still is. Mic test 8 (embed-1795115593161, T12: the washing-machines correction never recorded) (Task 7z fix
 *  round 1). Default ON; NEXT_PUBLIC_TUTOR_V2_REPEAT_NOT_MISHEARD=off ⇒ as before. */
export const TUTOR_V2_REPEAT_NOT_MISHEARD = process.env.NEXT_PUBLIC_TUTOR_V2_REPEAT_NOT_MISHEARD !== 'off';

/** Tutor brain v2 (v2/adaptive.ts, v2/time-fit.ts): in a free-conversation part the facts make the tutor a conversation partner, not an
 *  interviewer: now and then a short thought or experience of its own before its question, open questions that need more than one
 *  sentence, and after a one-sentence answer a request for more on the same point before a new subject (still one question a reply, the
 *  corrections-aloud limit, the no-starter rule and the one invitation); the part's time line says "let them say more" rather than
 *  "another question". Mic test 9 (embed-1795132864767: 23 narrow questions in 6.8 minutes, answers of 9 words on average) (Task 8a,
 *  item 1). Default ON; NEXT_PUBLIC_TUTOR_V2_FREE_CONV_PARTNER=off ⇒ as before. */
export const TUTOR_V2_FREE_CONV_PARTNER = process.env.NEXT_PUBLIC_TUTOR_V2_FREE_CONV_PARTNER !== 'off';

/** Tutor brain v2 (v2/adaptive.ts, v2/turn.ts): the retest line is sent only until a reply on a turn it was sent on carried a question
 *  (state: the retest's `put`, the turn); then it waits for the outcome. The send limit stays for replies that asked nothing. A retest
 *  put that way and left with no outcome when the part ends is `not_used`, never `not_asked`. Mic test 9 (embed-1795132864767: the same
 *  question asked at T50 and T54 and a near-copy at T56; T30's retest scored not asked) (Task 8a, item 2). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_RETEST_ASK_ONCE=off ⇒ as before. */
export const TUTOR_V2_RETEST_ASK_ONCE = process.env.NEXT_PUBLIC_TUTOR_V2_RETEST_ASK_ONCE !== 'off';

/** Tutor brain v2 (v2/working-level.ts, v2/level-check-count.ts, v2/facts.ts, v2/turn.ts): the level check counts the questions it put
 *  that the learner answered (a tutor reply whose heard words, or its question card, put a question; words that go on with an answer
 *  after a cut reply, and the same question asked again, are no new one), not the learner's answers; the level is set after three, or
 *  once the level-check part has had its own minutes. Mic test 9 (embed-1795132864767: a barge-in continuation and a re-asked follow-up
 *  made three answers; 1 of the plan's 3 questions asked) (Task 8a, item 3). Default ON; NEXT_PUBLIC_TUTOR_V2_LEVEL_CHECK_PUT=off ⇒ as
 *  before. */
export const TUTOR_V2_LEVEL_CHECK_PUT = process.env.NEXT_PUBLIC_TUTOR_V2_LEVEL_CHECK_PUT !== 'off';

/** Tutor brain v2 (v2/summary-marks.ts, v2/client-state.ts, v2/state-carry.ts): every correction of the lesson stays known to the summary
 *  guard (a corrected sentence is never painted under "What went well"): those pushed out of the 12 kept in full are kept as their
 *  normalised sentence (state.correctedOlder). Mic test 9 (embed-1795132864767: WB76, corrected at T42, pushed out by the conversation's
 *  quiet cards) (Task 8a, item 4). Default ON; NEXT_PUBLIC_TUTOR_V2_CORRECTIONS_ALL_GUARDED=off ⇒ as before. */
export const TUTOR_V2_CORRECTIONS_ALL_GUARDED = process.env.NEXT_PUBLIC_TUTOR_V2_CORRECTIONS_ALL_GUARDED !== 'off';

/** Tutor brain v2 (v2/learner-card.ts, v2/turn.ts): the board never shows the learner's uncorrected sentence after its correction. A card
 *  of the reply that is a correction of their sentence (v2IsCorrectionOf, the one test; never their sentence itself) and belongs to it
 *  (not to another sentence of the turn) carries it, so no owed-card line is sent for it; the owed-card line asks only for the right
 *  sentence; a sentence card that is their own sentence of this turn as said, with words marked, is not painted when a card of this
 *  reply corrected it. Mic test 10 (embed-1795202398886: WB26, WB30 written by the board check after the corrected card) (Task 8c,
 *  item 1). Default ON; NEXT_PUBLIC_TUTOR_V2_OWED_CARD_RIGHT=off ⇒ as before. */
export const TUTOR_V2_OWED_CARD_RIGHT = process.env.NEXT_PUBLIC_TUTOR_V2_OWED_CARD_RIGHT !== 'off';

/** Tutor brain v2 (v2/adaptive.ts): a correction is kept. The practice pairing gives each card to the one sentence of the turn it belongs
 *  to, and of a sentence's cards takes a right one as said (no marks) first, then a correction (v2IsCorrectionOf), then a marked as-said
 *  card, so a stray marked as-said card never turns a corrected answer into `clean`. Mic test 10 (embed-1795202398886: turns 19 and 21
 *  scored clean) (Task 8c, item 2; fix round 1: the note-only recording removed). Default ON; NEXT_PUBLIC_TUTOR_V2_CORRECTION_KEPT=off ⇒
 *  as before. */
export const TUTOR_V2_CORRECTION_KEPT = process.env.NEXT_PUBLIC_TUTOR_V2_CORRECTION_KEPT !== 'off';

/** Tutor brain v2 (v2/summary-headings.ts, v2/turn.ts): on the Summary page of a lesson laid out in groups (7u), the runtime writes the
 *  group headings itself, by state: before the first card of a recorded correction a "To improve" heading, before the first other card
 *  a "What went well" heading (another card placed above "To improve" when that is up), once each, with the learner-language line where
 *  the page's cards carry one; a heading the model wrote stands and is not written twice. Mic test 10 (embed-1795202398886, flag 4: no
 *  headings, two corrections under the spoken "went well") (Task 8c, item 3). Default ON; NEXT_PUBLIC_TUTOR_V2_SUMMARY_HEADINGS=off ⇒ as
 *  before. */
export const TUTOR_V2_SUMMARY_HEADINGS = process.env.NEXT_PUBLIC_TUTOR_V2_SUMMARY_HEADINGS !== 'off';

/** Tutor brain v2 (v2/close-invite.ts, v2/close-check.ts, v2/turn.ts): the summary is given once. The questions invitation is recorded
 *  from the reply's last QUESTION sentence (a statement after it, "if not, we'll finish here", does not undo it); once the summary has
 *  been given (state.summaryBegunAt, or a closing page) no facts line or end_lesson result asks for it again; after it, the goodbye
 *  facts say thank them and say goodbye in one or two sentences with no recap (also when they ask to stop). Mic test 10
 *  (embed-1795202398886, flags 5 and 6: T91's invitation not recorded, the summary given again at T93 and recapped at T95) (Task 8d,
 *  item 1). Default ON; NEXT_PUBLIC_TUTOR_V2_CLOSE_SUMMARY_ONCE=off ⇒ as before. */
export const TUTOR_V2_CLOSE_SUMMARY_ONCE = process.env.NEXT_PUBLIC_TUTOR_V2_CLOSE_SUMMARY_ONCE !== 'off';

/** Tutor brain v2 (v2/part-flow.ts, v2/close-check.ts, v2/turn.ts): an answer said over the ask moves on. When the learner cut in while
 *  the reply's part ask was the sentence playing (the first unheard sentence of the reply that made it, state.unheard) and their words
 *  are a go to it, the ask counts as heard and answered: the part is released as for a heard ask and the ask is left out of the "not
 *  heard" line. The same for the close invitation answered with a plain "no questions": it is not owed again. By state and position;
 *  an answer that is not a go, or an ask that was not the sentence playing, keeps the behaviour before. Mic test 10
 *  (embed-1795202398886, flag 3: "Yes." over T52's ask, the same ask again at T54) (Task 8d, item 2). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_ANSWER_OVER_ASK=off ⇒ as before. */
export const TUTOR_V2_ANSWER_OVER_ASK = process.env.NEXT_PUBLIC_TUTOR_V2_ANSWER_OVER_ASK !== 'off';

/** Tutor brain v2 (v2/turn.ts): a reply that armed a pronunciation recording says what it armed. When the armed item's words are not in
 *  the reply's spoken words (the model put the sentence only on a card, which is not read aloud after a lead-in the card reader does not
 *  know), the runtime says it as the reply's last sentence. Mic test 10 (embed-1795202398886, T82: "まず聞いてください。最後の文は英語
 *  だけです。" then the card; nothing said, 12 s of silence until the idle nudge) (Task 8d, item 3). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_PRON_TARGET_SAID=off ⇒ as before. */
export const TUTOR_V2_PRON_TARGET_SAID = process.env.NEXT_PUBLIC_TUTOR_V2_PRON_TARGET_SAID !== 'off';

/** Tutor brain v2 (v2/learner-card.ts): an ask for a sentence is read from the reply's last QUESTION sentence when all that follows it is
 *  one short sentence that is no question ("…for a long time? Please answer in English."): by shape only. Mic test 10
 *  (embed-1795202398886 T44 → T45: no practice answer, the re-test put at T44 never scored) (Task 8c fix round 1). Default ON;
 *  NEXT_PUBLIC_TUTOR_V2_ASK_LAST_QUESTION=off ⇒ as before. */
export const TUTOR_V2_ASK_LAST_QUESTION = process.env.NEXT_PUBLIC_TUTOR_V2_ASK_LAST_QUESTION !== 'off';

/** Tutor brain v2 (v2/sentence-cards.ts v2IsCorrectionOf, the one correction test: the owed-card test, the as-said refusal, the pairing, the
 *  7w record): a card word counts as the learner's when it has the same stem as one of theirs (learn / learned, customer / customers).
 *  Mic test 10 (embed-1795202398886 T36: WB29 was no correction of T35 by exact words, so WB30, their sentence as said, went up) (Task 8c
 *  fix round 2). Default ON; NEXT_PUBLIC_TUTOR_V2_CORRECTION_STEMS=off ⇒ as before. */
export const TUTOR_V2_CORRECTION_STEMS = process.env.NEXT_PUBLIC_TUTOR_V2_CORRECTION_STEMS !== 'off';

/** Tutor brain v2 (v2/turn.ts, the worked answer key of main's 0015a7fa): a problem the tutor sets that is not the plan's is worked out
 *  apart by a second model call after the reply, for the tutor to check answers by. In a spoken lesson that teaches a language
 *  (note-targets.ts v2NoteTargetsOn: two teaching languages or measured pronunciation, the gate of the target marks) every question
 *  card is such a "problem" ("What kind of products do you sell?"): there is no answer to work out, and each card held the turn open
 *  for a second call. There the key is not recorded and not worked. Maths and science lessons, typed lessons, homework and
 *  discussions are as on main (Task 8e fix round 1, ruling 2). Default ON; NEXT_PUBLIC_TUTOR_V2_OWN_KEY_NOT_LANGUAGE=off ⇒ the key
 *  is worked in every lesson, as on main. (Main's own switch TUTOR_V2_OWN_KEY=off still turns the key off everywhere.) */
export const TUTOR_V2_OWN_KEY_NOT_LANGUAGE = process.env.NEXT_PUBLIC_TUTOR_V2_OWN_KEY_NOT_LANGUAGE !== 'off';

/** Learner summary (portal/learner-summary.ts, server only): for a session that ran on tutor brain v2 (its `start_v2` event), the summary's
 *  facts come from what v2 records: the pronunciation scores (`pronunciation_scored` with the sentence of its `pronunciation_armed`), the
 *  lesson's corrections (the row's marked sentence cards, each with the sentence of theirs it reworks, by the one correction test), and the
 *  sentences they said right (theirs that no card corrected). v1 read data only v1 writes: mic test 11 (embed-1795220913119) was told no
 *  score was measured (it was 84), listed no corrections, and praised a sentence they had said wrong (Task 8g, item 1). Default ON;
 *  TUTOR_V2_LEARNER_SUMMARY=off ⇒ as before. v1 sessions are unchanged either way. */
export const TUTOR_V2_LEARNER_SUMMARY = process.env.TUTOR_V2_LEARNER_SUMMARY !== 'off';

/** Tutor brain v2 (v2/pronunciation-recorder.ts): a learner's onset heard while the tutor's voice still plays is recorded when that voice
 *  ends within V2_PRON_ONSET_GRACE_MS of it (the model sentence was at its end): the capture opens then, its pre-roll holding the onset.
 *  Mic test 11 (embed-1795220913119, 16:52.59: he began about 50 ms before the voice ended; the attempt was never recorded and he had to
 *  say it again) (Task 8g, item 2). Default ON; NEXT_PUBLIC_TUTOR_V2_PRON_ONSET_GRACE=off ⇒ as before. */
export const TUTOR_V2_PRON_ONSET_GRACE = process.env.NEXT_PUBLIC_TUTOR_V2_PRON_ONSET_GRACE !== 'off';

/** Tutor brain v2 (v2/turn.ts, the practice pairing and the 7w record): a correction of this turn is a sentence card this reply painted (or
 *  pointed at an item this reply painted); a card of an earlier turn the reply points back at is not. By state: the item ids on the board
 *  when the turn began. Mic test 11 (embed-1795220913119, T54: a praised repeat scored wrong from the card of T53 it pointed back to, a
 *  false correction recorded and a live re-test replaced) (Task 8g, item 3). Default ON; NEXT_PUBLIC_TUTOR_V2_PAIR_PAINTED_ONLY=off ⇒ as
 *  before. */
export const TUTOR_V2_PAIR_PAINTED_ONLY = process.env.NEXT_PUBLIC_TUTOR_V2_PAIR_PAINTED_ONLY !== 'off';

/** Tutor brain v2 (v2/learner-card.ts, the ask for an answer): a question card the last reply painted (a `<board problem>` block or a
 *  `show_problem` call, on the board) asks for a sentence when its question is a question about them, as the spoken last question is read.
 *  Mic test 11 (embed-1795220913119, T28: a Japanese instruction and a question card only; T29 "…for 6 year." got no practice signal, its
 *  correction no re-test) (Task 8g, item 4). Default ON; NEXT_PUBLIC_TUTOR_V2_ASK_QUESTION_CARD=off ⇒ as before. */
export const TUTOR_V2_ASK_QUESTION_CARD = process.env.NEXT_PUBLIC_TUTOR_V2_ASK_QUESTION_CARD !== 'off';
