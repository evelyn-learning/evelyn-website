// src/lib/tutor/orchestrator/turn-round-flags.ts
/**
 * Kill switches for the "a rejected call / a thin opener must not cost the
 * turn" round. Every one defaults ON (`!== 'off'`); setting the env var to
 * 'off' restores the exact pre-round behaviour for that one mechanism.
 * NEXT_PUBLIC_ values are inlined at build time.
 */

/** Resume ("Continue lesson") opens the production mic the way the Start tap
 *  does, so resumed sessions record the student track. */
export const TUTOR_RESUME_START_LISTENING =
  process.env.NEXT_PUBLIC_TUTOR_RESUME_START_LISTENING !== 'off';

/** show_equation whose label collides with a different equation still on the
 *  same page is painted with a unique label instead of being rejected. */
export const TUTOR_LABEL_DUP_RELABEL =
  process.env.NEXT_PUBLIC_TUTOR_LABEL_DUP_RELABEL !== 'off';

/** tutor_scroll_whiteboard with an unresolvable / empty target is dropped
 *  (one call) instead of rejected (whole-turn retry). */
export const TUTOR_SCROLL_MISS_SOFT_DROP =
  process.env.NEXT_PUBLIC_TUTOR_SCROLL_MISS_SOFT_DROP !== 'off';

/** A show_problem the RUNTIME rewrote to show_segment_card, which then
 *  dedups against the same problem already on the board, is a no-op instead
 *  of a rejection. */
export const TUTOR_SUBSTITUTED_DUP_SILENT =
  process.env.NEXT_PUBLIC_TUTOR_SUBSTITUTED_DUP_SILENT !== 'off';

/** Validator-feedback retries carry the student's original utterance. */
export const TUTOR_RETRY_STUDENT_CONTEXT =
  process.env.NEXT_PUBLIC_TUTOR_RETRY_STUDENT_CONTEXT !== 'off';

/** An opening turn that announces and stops is auto-continued once. */
export const TUTOR_TURN_CONTINUATION =
  process.env.NEXT_PUBLIC_TUTOR_TURN_CONTINUATION !== 'off';

/** The full opening directive rides only until the opener has been spoken;
 *  later opening-phase turns get the slim follow-up directive. */
export const TUTOR_OPENING_DIRECTIVE_ONCE =
  process.env.NEXT_PUBLIC_TUTOR_OPENING_DIRECTIVE_ONCE !== 'off';

/** First render of a turn paints immediately while the board holds nothing
 *  but the opener fallback line. */
export const TUTOR_FALLBACK_BOARD_PAINT_NOW =
  process.env.NEXT_PUBLIC_TUTOR_FALLBACK_BOARD_PAINT_NOW !== 'off';

/** A brain show_problem is rewritten to the authored show_segment_card only
 *  when it poses the SAME problem; a different problem is painted as the
 *  brain's own card, and a same problem already on the board is a no-op.
 *  Also gates the two companions (auto card after an own problem; silent
 *  dedup drops of a substituted different problem). */
export const TUTOR_SUBSTITUTE_SAME_ONLY =
  process.env.NEXT_PUBLIC_TUTOR_SUBSTITUTE_SAME_ONLY !== 'off';

/** TELEMETRY: exact one-variable relation checks on boarded show_equation
 *  steps and on improvised-answer disputes. The one behavioural effect: an
 *  "agreeing" claimed answer whose solution set differs from the problem's is
 *  not pinned as the verified expected answer. */
export const TUTOR_RELATION_STEP_CHECK =
  process.env.NEXT_PUBLIC_TUTOR_RELATION_STEP_CHECK !== 'off';

/** A typed FIRST message in a voice session counts as the session start for
 *  the mic control: hasStarted latches at the submit, the composer's blur
 *  opens the mic, and the next mic tap opens the mic instead of sending a
 *  second [start lesson]. */
export const TUTOR_TYPED_FIRST_START =
  process.env.NEXT_PUBLIC_TUTOR_TYPED_FIRST_START !== 'off';

/** The idle-nudge stretch/timer is reset only by a DISPATCHED student turn
 *  (or typed input); a bare speech onset defers a due nudge by a short grace
 *  bounded by a hard ceiling, and every postponement is logged. */
export const TUTOR_IDLE_NUDGE_DISPATCH_RESET =
  process.env.NEXT_PUBLIC_TUTOR_IDLE_NUDGE_DISPATCH_RESET !== 'off';

/** A tutor sentence whose numeric streak/tally praise ("five for five",
 *  "nine in a row") disagrees with the tracked streak is dropped from speech
 *  and transcript (advisory-only when the sentence carries a question, a
 *  verdict or other content). */
export const TUTOR_STREAK_CLAIM_GUARD =
  process.env.NEXT_PUBLIC_TUTOR_STREAK_CLAIM_GUARD !== 'off';

/** Single common words in the boredom-cue list ("next", "easy", "skip",
 *  "faster"…) count only in a request shape addressed to the tutor, not
 *  wherever they appear in a sentence. */
export const TUTOR_BOREDOM_CUE_REQUEST_SHAPE =
  process.env.NEXT_PUBLIC_TUTOR_BOREDOM_CUE_REQUEST_SHAPE !== 'off';

/** A counted relation-step disagreement in the `chain` / `vs-problem` tier
 *  plants a witness correction note for the brain's NEXT turn (never a block
 *  or a retry). Needs TUTOR_RELATION_STEP_CHECK; off ⇒ telemetry only. */
export const TUTOR_RELATION_STEP_NOTE =
  process.env.NEXT_PUBLIC_TUTOR_RELATION_STEP_NOTE !== 'off';

/** The LLM judge does not replace a DETERMINISTIC correction note that is
 *  still pending in the shared slot (the relation-step witness note, or an
 *  answer-dispute note decided by exact substitution). Off ⇒ the judge
 *  assigns the slot unconditionally, as before. */
export const TUTOR_JUDGE_NOTE_KEEP_DETERMINISTIC =
  process.env.NEXT_PUBLIC_TUTOR_JUDGE_NOTE_KEEP_DETERMINISTIC !== 'off';

/** A solver-vs-brain answer dispute is broken by exact substitution: the
 *  answer with the problem's solution set is pinned as the verified key and
 *  the mismatch note says so. Needs TUTOR_RELATION_STEP_CHECK; off ⇒ nothing
 *  pinned and the "neither value is confirmed" note, as before. */
export const TUTOR_ANSWER_DISPUTE_TIEBREAK =
  process.env.NEXT_PUBLIC_TUTOR_ANSWER_DISPUTE_TIEBREAK !== 'off';

// ── Board/flow round (2026-10-04) ──────────────────────────────────────────

/** Student-problem grounding recognises "how to solve …" / "solve: …" / a
 *  bare relation, never grounds on a question ABOUT the board, and stores a
 *  symbolic relation as the problem statement. Off ⇒ the legacy detector. */
export const TUTOR_PROBLEM_GROUNDING_RELATION =
  process.env.NEXT_PUBLIC_TUTOR_PROBLEM_GROUNDING_RELATION !== 'off';

/** A show_equation that reuses a label with different latex in a CORRECTION
 *  turn replaces the earlier card instead of painting "<label> (2)" beside
 *  it. Off ⇒ always the relabel (TUTOR_LABEL_DUP_RELABEL). */
export const TUTOR_LABEL_REUSE_CORRECTION_REPLACE =
  process.env.NEXT_PUBLIC_TUTOR_LABEL_REUSE_CORRECTION_REPLACE !== 'off';

/** show_segment_card on a segment with no authored card renders a compact
 *  card from the segment's objective instead of being ignored silently. */
export const TUTOR_EMPTY_SEGMENT_CARD_FALLBACK =
  process.env.NEXT_PUBLIC_TUTOR_EMPTY_SEGMENT_CARD_FALLBACK !== 'off';

/** A turn that asked for a segment card with no authored content and ended
 *  without a question or a problem is auto-continued (shares the
 *  turn-continuation budget: one per turn, two per session). */
export const TUTOR_EMPTY_SEGMENT_CARD_CONTINUE =
  process.env.NEXT_PUBLIC_TUTOR_EMPTY_SEGMENT_CARD_CONTINUE !== 'off';

/** The deferred segment-advance newPage is dropped when the batch already
 *  opens its own page before any content (no empty page in between). */
export const TUTOR_DEFERRED_PAGE_DEDUP =
  process.env.NEXT_PUBLIC_TUTOR_DEFERRED_PAGE_DEDUP !== 'off';

/** A session started by a non-mic gesture (upload / board action / agenda
 *  pick through the handle) opens the production mic the way the Start tap
 *  does, so the student track is recorded. */
export const TUTOR_GESTURE_START_LISTENING =
  process.env.NEXT_PUBLIC_TUTOR_GESTURE_START_LISTENING !== 'off';

// ── Verdict/counting round (2026-10-04) ────────────────────────────────────

/** A turn that opens with an affirmation and then says the student's OWN bare
 *  value is excluded / does not satisfy is killed and re-asked once (attempt 0
 *  only, and only when the open question asked for a value that satisfies).
 *  Off ⇒ no kill and no advisory event. */
export const TUTOR_PRAISE_EXCLUSION_KILL =
  process.env.NEXT_PUBLIC_TUTOR_PRAISE_EXCLUSION_KILL !== 'off';

/** The judge's structured fields (studentAnswerVerdict / issueKind) decide
 *  whether a flagged issue plants a correction note and withholds credit, and
 *  which note wording is used. Off ⇒ keyed on the claim text, as before. */
export const TUTOR_JUDGE_STRUCTURED_VERDICT =
  process.env.NEXT_PUBLIC_TUTOR_JUDGE_STRUCTURED_VERDICT !== 'off';

/** Corrections without a correction word are read in the head of the tutor's
 *  turn ("let's try that again", "doesn't satisfy", "isn't included", and the
 *  opposite member of a closed pair to the student's short answer) for the
 *  pacing streak and the struggle ledger. Off ⇒ the original markers only. */
export const TUTOR_CORRECTION_WIDENING =
  process.env.NEXT_PUBLIC_TUTOR_CORRECTION_WIDENING !== 'off';

/** A bare short answer (a number, or one to three content words) is a
 *  verification turn while a tutor question is open. Off ⇒ the length /
 *  digits / maths-language / six-word test only. */
export const TUTOR_SHORT_ANSWER_ATTEMPT =
  process.env.NEXT_PUBLIC_TUTOR_SHORT_ANSWER_ATTEMPT !== 'off';

/** "Good question" / "Good to know" / "Good thinking" acknowledge the
 *  student's move and are not affirmations of an answer. Off ⇒ any
 *  affirmation word at the start of a head sentence counts, as before. */
export const TUTOR_ACK_NOT_AFFIRM =
  process.env.NEXT_PUBLIC_TUTOR_ACK_NOT_AFFIRM !== 'off';

/** A student turn that is a question or a self-report of difficulty is never
 *  a verification turn and never a ledger answer attempt (credits neither
 *  correct nor incorrect). Off ⇒ no shape test, as before. */
export const TUTOR_TURN_SHAPE_GATE =
  process.env.NEXT_PUBLIC_TUTOR_TURN_SHAPE_GATE !== 'off';

/** Review of the verdict/counting round (2026-10-04): the praise-then-
 *  exclusion guard NO LONGER KILLS — TUTOR_PRAISE_EXCLUSION_KILL above now
 *  only switches its detection (the advisory event) on or off; the name is
 *  kept because this file is append-only. On an unmistakable detection the
 *  guard plants a neutral correction note for the NEXT brain turn (never over
 *  a pending note; protected from the LLM judge like the other deterministic
 *  notes; no volunteer deadline). Off ⇒ the advisory event only. */
export const TUTOR_PRAISE_EXCLUSION_NOTE =
  process.env.NEXT_PUBLIC_TUTOR_PRAISE_EXCLUSION_NOTE !== 'off';

// ── Homework Help text-session round (2026-10-05, 21 scripted sessions) ────

/** Typed homework-help text is the student's own material unless it is a bare
 *  topic with no task (lesson-plan/homework.ts `typedHomeworkIsOwnMaterial`);
 *  a failed split of such text still makes a one-problem homework plan; a
 *  homework-help request never returns an objective picker. Server-read.
 *  Off ⇒ the regex gate `hasProblemSignals` alone, as before. */
export const TUTOR_HOMEWORK_OWN_MATERIAL =
  process.env.NEXT_PUBLIC_TUTOR_HOMEWORK_OWN_MATERIAL !== 'off';

/** Judge correction notes: a distinct false-praise wording, no note on a
 *  grounding/other issue whose verdict is not_an_answer or whose own reason
 *  says the statement is correct, and no sentence handed over to recite.
 *  Off ⇒ the 2026-10-04 decision table and note texts. */
export const TUTOR_JUDGE_NOTE_FALSE_PRAISE =
  process.env.NEXT_PUBLIC_TUTOR_JUDGE_NOTE_FALSE_PRAISE !== 'off';

/** A hedged proposal with a unit, an inequality / interval / expression, or
 *  a trailing because-clause is an answer attempt ("I don't know, maybe
 *  30 m/s?"). Off ⇒ a bare number / choice only. */
export const TUTOR_HEDGED_ANSWER_WIDENING =
  process.env.NEXT_PUBLIC_TUTOR_HEDGED_ANSWER_WIDENING !== 'off';

/** The tutor's denial of a HEDGED answer is counted against the student
 *  (pacing incorrect, ledger wrong) only when a verified key or the judge
 *  agrees the answer was wrong. Off ⇒ counted like any other denial. */
export const TUTOR_HEDGED_DENIAL_NEEDS_CONFIRMATION =
  process.env.NEXT_PUBLIC_TUTOR_HEDGED_DENIAL_NEEDS_CONFIRMATION !== 'off';

/** Per-turn prompt wording: "I don't know" alone is a non-answer, "I don't
 *  know, maybe X" is the answer X; and in multi-part homework the tracked
 *  problem's key applies only to an answer to that part. Off ⇒ the previous
 *  block texts byte for byte. */
export const TUTOR_VERDICT_PROMPT_HEDGE_AND_PARTS =
  process.env.NEXT_PUBLIC_TUTOR_VERDICT_PROMPT_HEDGE_AND_PARTS !== 'off';

/** A bare yes / no / ok typed while the open tutor question is NOT a yes/no
 *  question, answered with an affirming verdict opener, is killed before
 *  display and re-asked once. Off ⇒ no such kill. */
export const TUTOR_BARE_ASSENT_PRAISE_KILL =
  process.env.NEXT_PUBLIC_TUTOR_BARE_ASSENT_PRAISE_KILL !== 'off';

/** Third-person reference to the learner combined with self-instruction
 *  ("they're mid-step…, so I should…") is dropped as runtime talk. */
export const TUTOR_META_NARRATION_THIRD_PERSON =
  process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_THIRD_PERSON !== 'off';

/** show_dimensional_check is dropped (the turn continues) unless the session
 *  subject is a physical science and the checked text carries unit tokens. */
export const TUTOR_DIMENSIONAL_CHECK_GATE =
  process.env.NEXT_PUBLIC_TUTOR_DIMENSIONAL_CHECK_GATE !== 'off';

/** The spoken-problem board net never boards a sentence window that carries
 *  a verdict / correction or quotes the student's answer. */
export const TUTOR_SPOKEN_PROBLEM_VERDICT_EXCLUDE =
  process.env.NEXT_PUBLIC_TUTOR_SPOKEN_PROBLEM_VERDICT_EXCLUDE !== 'off';

/** A brain stall with nothing shown retries the turn once; a second stall
 *  shows an apology line in the transcript for typed turns (and speaks it
 *  for voice). Off ⇒ the single spoken cover line, as before. */
export const TUTOR_BRAIN_STALL_RETRY =
  process.env.NEXT_PUBLIC_TUTOR_BRAIN_STALL_RETRY !== 'off';

/** On `no_problem_available` for a generic request the tutor poses its own
 *  similar problem (worked out first) or continues; it never tells the
 *  student that no problem is ready. Server-read (prompt + tool result).
 *  Off ⇒ the apologise-and-offer-a-choice rule. */
export const TUTOR_NO_PROBLEM_SELF_POSE =
  process.env.NEXT_PUBLIC_TUTOR_NO_PROBLEM_SELF_POSE !== 'off';

// ── Text-mode answer-judging round 2 (2026-10-06, replay of 23 sessions) ───

/** A bare yes / no / ok that settles nothing — an either/or question, or a
 *  wh-question asked after a yes/no one in the same turn — answered with an
 *  affirming verdict, or with a reply that ends the session, is killed before
 *  display and re-asked once (voice/nonanswer-praise.ts `ambiguousAssentKill`).
 *  Off ⇒ only the 2026-10-05 kill (TUTOR_BARE_ASSENT_PRAISE_KILL). */
export const TUTOR_AMBIGUOUS_ASSENT_KILL =
  process.env.NEXT_PUBLIC_TUTOR_AMBIGUOUS_ASSENT_KILL !== 'off';

/** Text mode: a tutor opener that contradicts a HIGH-confidence verdict
 *  pre-check of the student's message (voice/verdict-precheck-shared.ts) is
 *  killed before display and retried once. Off ⇒ no such kill. Inert when the
 *  server sends no pre-check (voice, TUTOR_TEXT_VERDICT_PRECHECK=off). */
export const TUTOR_PRECHECK_VERDICT_KILL =
  process.env.NEXT_PUBLIC_TUTOR_PRECHECK_VERDICT_KILL !== 'off';

/** Text mode: a HIGH-confidence verdict pre-check overrides the reading of the
 *  tutor's words in the counting path — a correct answer the tutor denied is
 *  not counted wrong, a wrong or off-target one it praised is not counted
 *  correct, and a pre-check "incorrect" confirms the denial of a hedged
 *  answer. Off ⇒ counting reads the tutor's words alone, as before. */
export const TUTOR_PRECHECK_CREDIT =
  process.env.NEXT_PUBLIC_TUTOR_PRECHECK_CREDIT !== 'off';

// ── Text mode "work it, then match" (2026-10-06, third round) ──────────────
// Both act only on a turn for which the server announced the mode (the
// `work-then-match` stream frame; server flag TUTOR_TEXT_WORK_THEN_MATCH), so
// that flag alone restores the previous behaviour end to end.

/** Text mode: a reply's first sentence that is only a verdict or praise
 *  opener is dropped before display; one fused with content is killed and
 *  retried once, and on the retry the verdict phrase is cut
 *  (voice/work-then-match.ts). Off ⇒ replies are shown as written. */
export const TUTOR_TEXT_OPENER_BACKSTOP =
  process.env.NEXT_PUBLIC_TUTOR_TEXT_OPENER_BACKSTOP !== 'off';

/** Text mode: the counting path (pacing credit, ledger `wrong` events) does
 *  not read the tutor's opener. It uses a verified key, else a HIGH-confidence
 *  pre-check, else the tutor's explicit match statement; a WRONG needs the
 *  pre-check and the match statement to agree (voice/work-then-match.ts
 *  `resolveMatchCredit`). Off ⇒ the tutor's words are read as before. */
export const TUTOR_TEXT_MATCH_COUNTING =
  process.env.NEXT_PUBLIC_TUTOR_TEXT_MATCH_COUNTING !== 'off';

/** Homework sessions: the tutor does not sign off, or say the homework is
 *  done, unless the student asked to stop or every problem they brought is
 *  finished (per-turn <homework_session> rule). Off ⇒ the block as before. */
export const TUTOR_HOMEWORK_NO_EARLY_SIGNOFF =
  process.env.NEXT_PUBLIC_TUTOR_HOMEWORK_NO_EARLY_SIGNOFF !== 'off';

/** The time figures the prompt carries (time remaining, the session's minute
 *  budget) are for pacing only: the tutor never mentions time used, minutes,
 *  limits or usage to the student. One sentence beside each figure (the
 *  partner session prompt, <demo_stop>, <homework_session>). Off ⇒ those
 *  texts byte for byte as before. */
export const TUTOR_NO_TIME_TALK =
  process.env.NEXT_PUBLIC_TUTOR_NO_TIME_TALK !== 'off';
