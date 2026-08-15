/**
 * TEST PLAN — Fast-opener + deterministic-Skip stress (FIX A + FIX B).
 *
 * Built 2026-05-23. Torture-tests the two uncommitted latency levers in
 * VoiceTutorRealtime.tsx / system-prompt-builder.ts:
 *
 *   - FIX A (NEXT_PUBLIC_TUTOR_BRAIN_FAST_OPENER): TURN_OPENER_RULE
 *     splices into BASE_PROMPT; the orchestrator fast-voices sentence-0
 *     ungated when isSafeOpener returns true. The known gap the rule
 *     was tightened for (em-dash compliance) is the primary target.
 *   - FIX B (NEXT_PUBLIC_TUTOR_SKIP_DETERMINISTIC): Skip-button click
 *     resolves the next segment app-side BEFORE the brain call and
 *     rewrites the [Skip-button-clicked] marker to a state FACT.
 *
 * Why 4 back-to-back try_yourself segments with NO concept/worked beats
 * in between: every affirm-turn is a temptation to merge "Yes" + the
 * student's answer ("Yes — 12!") onto sentence-0. Concept segments
 * dilute that signal because the brain's first sentence on a concept
 * turn is usually a content-free segue. Rapid try_yourselfs maximize
 * the merge pressure.
 *
 * Numeric answers are short (a single value) on purpose — short
 * answers are the worst case for the merge pattern, because the brain
 * has no reason NOT to fold them onto an opener line. If FIX A+the
 * em-dash clause survive 4× short-answer affirm turns, they survive
 * everything.
 *
 * Pre-test setup:
 *   1. Confirm both flags are ON in the env that ran the dev server:
 *        NEXT_PUBLIC_TUTOR_BRAIN_FAST_OPENER=true
 *        NEXT_PUBLIC_TUTOR_SKIP_DETERMINISTIC=true
 *      Bake-time constants — must be set before `next dev` starts.
 *   2. Hard-refresh (Cmd+Shift+R) at /tutor.
 *   3. Math → 7 → Math → pick "[TEST] G7 Math — Opener+Skip merge
 *      stress (FIX A+B)".
 *   4. Open DevTools console; filter for: skip_button | fast_opener |
 *      first_sentence | first_tool | Skip-button.
 *
 * Drive-through script (the tester):
 *   1. Session starts. The brain greets — this turn IS opener test #1.
 *      ✅ Sentence 1 should be content-free: "Alright, let's get
 *      rolling." / "Okay, let's begin." — NOT "Hi! Today we're working
 *      on ratios and percents."
 *   2. Say "ready". Brain advances to try-percent + renders the show_
 *      problem card.
 *   3. Answer "12" out loud. — AFFIRM-TURN TEST #1.
 *      ✅ "Yes, that's right." then "Twelve." as separate sentences.
 *      ✗ "Yes — 12!" / "Nice — twelve!" / "Exactly — 12% of 80 is 12!"
 *      The em-dash merge is the failure pattern the prompt clause was
 *      added for. Watch the PDF transcript carefully.
 *   4. Say "ok". Brain advances to try-proportion + renders.
 *   5. Answer "two dollars eighty" or "2.80". — AFFIRM-TURN TEST #2.
 *      Same pass/fail as #3.
 *   6. Brain advances to try-linear + renders. (Or say "ok" if it
 *      asks.)
 *   7. ★ CLICK THE SKIP-AHEAD BUTTON. — FIX B TEST #1 (mid-plan).
 *      ✅ Console MUST log:
 *         [brain-orchestrator] Skip-button: app-side deterministic
 *         advance "try-linear" → "try-ratio" (brain told as fact;
 *         Skip-KILL retry bypassed).
 *      ✅ Debug event: skip_button_app_advance: "try-linear" → "try-ratio"
 *      ✅ NO line containing "Skip-button KILL" anywhere.
 *      ✅ The brain's opener for this Skip turn should be content-free
 *      ("Got it, moving on." / "Alright, skipping ahead.") and fast-
 *      voice immediately — perceptible as low first-audio latency
 *      compared to the prior turns.
 *   8. Brain teaches try-ratio (its problem is now active). Answer
 *      WRONG: say "thirty" / "30". — CORRECTIVE-TURN OPENER TEST.
 *      ✅ "Hmm, not quite." / "Almost." then a separate corrective
 *      sentence. The em-dash join is forbidden here too — "Not quite
 *      — the answer is 35." would be a failure.
 *   9. Recover ("oh, 35") or say "ok keep going". Brain advances to
 *      recap.
 *  10. Brain recaps briefly.
 *  11. ★ CLICK THE SKIP-AHEAD BUTTON. — FIX B TEST #2 (end-of-plan).
 *      ✅ Console MUST log:
 *         [brain-orchestrator] Skip-button: no resolvable next from
 *         "recap" (end of plan) — marker left for the brain
 *         (generate_problem path + Skip-KILL retry retained).
 *      ✅ Debug event: skip_button_app_advance_skipped: no next from
 *      "recap"
 *      ✅ The brain receives the original [Skip-button-clicked] marker
 *      (not the rewrite), reads the bracketed directive, and calls
 *      generate_problem. The Skip-KILL retry remains alive as the
 *      end-of-plan carve-out — this is correct behavior, NOT a
 *      regression.
 *
 * Hard pass criteria (must all be true for a clean run):
 *   - 0 occurrences of any "Skip-button KILL" / "skip_button_no_advance"
 *     line in console.
 *   - 1+ skip_button_app_advance debug event (step 7).
 *   - 1 skip_button_app_advance_skipped debug event (step 11).
 *   - PDF transcript: every brain turn's first sentence ends in `.`,
 *     `!`, or `?`-marked-as-rhetorical; contains no digit, no math
 *     operator, no question mark, no em-dash-to-substance join; word
 *     count ≤10. Scan with eyes; for a stricter pass use the regex
 *     /^[A-Z][^?=+\-×÷√^%<>≤≥*\/0-9]{1,80}\.$/ on sentence 0 of every
 *     tutor entry.
 *   - The four affirm/corrective turns (#3, #5, #8 corrective, #9
 *     recover-affirm) all show the opener-as-its-own-sentence pattern.
 *     Specifically: ZERO instances of `"<opener-word> [—,:] <value/
 *     claim>"`-shaped fragments anywhere in the transcript.
 *
 * Soft pass criteria (nice-to-haves):
 *   - Skip-turn first-audio latency visibly lower than non-Skip turns
 *     (FIX A's main win — the 1s gate timer doesn't apply on Skip
 *     turns because the gate is held ~1hr until app-side advance
 *     resolves; sentence-0 fast-voicing collapses ~411 ms on the
 *     Skip turn measured in the prior session).
 *   - Brain narration on try-linear (the SKIPPED segment) is silently
 *     dropped; the student does NOT hear partial audio from a turn
 *     that was about to render try-linear and got short-circuited by
 *     the Skip click. (Skip-turn pre-emptive TTS gating from
 *     71d4711 should cover this.)
 *
 * What this plan deliberately does NOT exercise:
 *   - Concept-segment opener behavior (no concept beats between try-
 *     yourselfs by design). If the merge bug is concept-specific,
 *     this plan won't surface it — use test-g7-math-direct-inverse-
 *     variation for the mixed-segment shape.
 *   - Tree / complex diagram renders (no show_diagram with type=
 *     binary_tree). Keeps focus on the opener+Skip surfaces.
 *   - Judge stress (no shape descriptors, no PPC, no BST arithmetic).
 *     Use test-judge-sync-stress for those.
 *
 * If 4/4 affirm/corrective turns ship clean openers AND both Skip
 * paths log the expected events, the FIX A+B pair is verified.
 * Commit suggestion: "Tutor: fast-opener (FIX A) + deterministic-Skip
 * (FIX B) flag-gated; em-dash clause in TURN_OPENER_RULE."
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_OPENER_MERGE_STRESS: LessonPlan = {
  id: 'evelyn.test.opener-merge-stress.v1',
  title: '[TEST] G7 Math — Opener+Skip merge stress (FIX A+B)',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'ratios-proportions',
  locale: 'en',
  los: [
    {
      id: 'test.opener-merge.coverage',
      description:
        'Stress FIX A (fast opener) and FIX B (deterministic Skip-button). Four back-to-back try_yourself segments with short numeric answers maximise the "Yes — 12!" merge temptation; two Skip clicks (mid-plan + end-of-plan) exercise both FIX B branches.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 8,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the rapid-fire drill so the student expects 4 short problems back-to-back. Keep this beat under 15 seconds.',
      script:
        "Quick warmup drill today — four short problems back to back. Ready?",
      teacherNote:
        'TESTER STEP 1: this is the initial greeting turn. Watch sentence-0 for opener compliance — must be content-free (no "today we\'re working on ratios" / no "let\'s drill percents"). Then say "ready" to advance to try-percent.',
      estimatedMinutes: 1,
    },

    // ── Try #1 — percent of a number ────────────────────────────────
    {
      id: 'try-percent',
      kind: 'try_yourself',
      problem: 'What is 15% of 80?',
      expectedAnswer: '12',
      hints: [
        'Convert 15% to a decimal first — what does 15% look like as a decimal?',
        '15% = 0.15. Now multiply 0.15 × 80.',
      ],
      responseFormat: 'numeric',
      prescribedRender: {
        tool: 'show_problem',
        params: {
          statement: 'What is 15% of 80?',
          format: 'free-response',
          title: 'Try Yourself: Percent of a Number',
          difficulty: 'easy',
        },
      },
      teacherNote:
        'TESTER STEP 2-3: brain renders the problem (opener test on the render turn). Then say "twelve" out loud. The affirm turn is the CRITICAL test — watch for "Yes — 12!" or "Nice — twelve!" merge patterns. Pass shape: "Yes, that\'s right. Twelve." as two sentences.',
      estimatedMinutes: 2,
    },

    // ── Try #2 — proportional reasoning ─────────────────────────────
    {
      id: 'try-proportion',
      kind: 'try_yourself',
      problem:
        'If 3 pencils cost $1.20, how much do 7 pencils cost at the same rate?',
      expectedAnswer: '$2.80',
      hints: [
        'Find the cost of ONE pencil first. What is $1.20 divided by 3?',
        'One pencil costs $0.40. Now multiply by 7.',
      ],
      responseFormat: 'numeric',
      prescribedRender: {
        tool: 'show_problem',
        params: {
          statement:
            'If 3 pencils cost $1.20, how much do 7 pencils cost at the same rate?',
          format: 'free-response',
          title: 'Try Yourself: Proportional Cost',
          difficulty: 'easy',
        },
      },
      teacherNote:
        'TESTER STEP 4-5: say "ok" if the brain asks; otherwise wait for the render. When the show_problem renders, answer "two dollars eighty" or "2.80". This is the SECOND affirm-turn opener test. Same pass/fail as the previous step.',
      estimatedMinutes: 2,
    },

    // ── Try #3 — linear equation (this one gets SKIPPED) ────────────
    {
      id: 'try-linear',
      kind: 'try_yourself',
      problem: 'Solve for x: 3x + 5 = 20',
      expectedAnswer: 'x = 5',
      hints: [
        'Subtract 5 from both sides first. What does that give you?',
        '3x = 15. Now divide both sides by 3.',
      ],
      responseFormat: 'numeric',
      prescribedRender: {
        tool: 'show_problem',
        params: {
          statement: 'Solve for x: 3x + 5 = 20',
          format: 'free-response',
          title: 'Try Yourself: Linear Equation',
          difficulty: 'easy',
        },
      },
      teacherNote:
        'TESTER STEP 6-7: when the brain renders this problem (or starts to), CLICK THE SKIP-AHEAD BUTTON. This is FIX B TEST #1 (mid-plan). Expect console log "[brain-orchestrator] Skip-button: app-side deterministic advance \\"try-linear\\" → \\"try-ratio\\"" and debug event skip_button_app_advance. The brain MUST NOT emit a Skip-KILL retry. The brain\'s opener on the Skip turn should be content-free and fast-voice (perceptibly faster first audio than prior turns).',
      estimatedMinutes: 2,
    },

    // ── Try #4 — ratio (the deliberately-wrong-answer beat) ─────────
    {
      id: 'try-ratio',
      kind: 'try_yourself',
      problem:
        'The ratio of cats to dogs at a shelter is 2:5. If there are 14 cats, how many dogs are there?',
      expectedAnswer: '35',
      hints: [
        'Each "ratio unit" for cats represents how many actual cats? You have 2 units → 14 cats.',
        '1 ratio unit = 7. Now apply that to the dogs side: 5 units × 7 = ?',
      ],
      responseFormat: 'numeric',
      prescribedRender: {
        tool: 'show_problem',
        params: {
          statement:
            'The ratio of cats to dogs at a shelter is 2:5. If there are 14 cats, how many dogs are there?',
          format: 'free-response',
          title: 'Try Yourself: Ratio Scale-Up',
          difficulty: 'easy',
        },
      },
      teacherNote:
        'TESTER STEP 8: answer WRONG on purpose — say "thirty" or "30". This is the CORRECTIVE-TURN opener test. Pass shape: "Hmm, not quite." / "Almost." as a complete first sentence, THEN a corrective sentence. The merge "Not quite — the answer is 35" is the failure pattern.\n\nSTEP 9: after the brain corrects, say "ok keep going" or "thirty-five" so the brain advances to recap.',
      estimatedMinutes: 2,
    },

    // ── Recap (end-of-plan Skip target) ─────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Percent of a number: convert the percent to a decimal, then multiply.',
        'Proportional scaling: find the per-unit value first, then scale up.',
        'Solving linear equations: undo addition first, then undo multiplication.',
        'Ratio scaling: each "unit" of the ratio represents the same real-world amount on both sides.',
      ],
      teacherNote:
        'TESTER STEP 10-11: brain recaps the four problems. THEN click the Skip-ahead button. This is FIX B TEST #2 (end-of-plan). Expect console log "[brain-orchestrator] Skip-button: no resolvable next from \\"recap\\" (end of plan) — marker left for the brain" and debug event skip_button_app_advance_skipped. The brain receives the [Skip-button-clicked] marker intact and SHOULD respond by calling generate_problem (per its prompt rule for end-of-plan Skip). This is the correct carve-out — the Skip-KILL retry remains active here ONLY.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose:
      'Focused stress test for FIX A (fast opener + em-dash clause) and FIX B (deterministic Skip-button advance). Four back-to-back try_yourself segments with short numeric answers torture-test the affirm-turn merge pattern; two Skip clicks (try-linear mid-plan + recap end-of-plan) exercise both FIX B branches. Built 2026-05-23 in lockstep with the TURN_OPENER_RULE em-dash clause addition to system-prompt-builder.ts.',
  },
};
