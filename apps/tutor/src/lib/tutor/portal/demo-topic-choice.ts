/**
 * Demo topic choice (2026-10-28, Praveen, after Crimsora trial
 * portal-ba5a6b3c: the student asked five times to move from diffusion to
 * the respiratory system and the tutor kept it on diffusion — "I'll keep us
 * there for this session").
 *
 * A FREE demo session — the marketing homepage demo, an academy trial
 * (crimsora / evelyntutor / greenapple `is_trial`), a partner showcase —
 * is a showcase of teaching, not an enrolled lesson. In a demo the student
 * may change the topic at any point, and the first turn briefly confirms
 * the chosen topic while still opening ON that topic (board first).
 *
 * Pure, client-safe: no server-only imports. The embed page, the system
 * prompt builder and claude-brain all read from here so the wording and
 * the gate have one source. Gate: `NEXT_PUBLIC_TUTOR_DEMO_TOPIC_CHOICE`
 * (`TUTOR_DEMO_TOPIC_CHOICE`, default ON; `off` restores the previous
 * behaviour byte-for-byte — every string below is only concatenated when
 * the flag is on).
 */

import { TUTOR_DEMO_TOPIC_CHOICE } from '@/lib/tutor/orchestrator/flags';

/**
 * Whether a session runs open-scope (the student may take it to any
 * subject or topic). Before 10-28 only the explicit `open_scope` token claim
 * did this (the marketing homepage demo). With the flag on, every trial /
 * demo session (`is_trial` claim) is open-scope too. Paid sessions
 * (neither claim) are unchanged.
 */
export function resolveOpenScope(args: {
  openScopeClaim: boolean;
  isTrial: boolean;
  flagOn?: boolean;
}): boolean {
  const flagOn = args.flagOn ?? TUTOR_DEMO_TOPIC_CHOICE;
  return args.openScopeClaim || (flagOn && args.isTrial);
}

/**
 * Appended to the opener directive of a demo session (sessionMode 'demo').
 * Board-first stays the hard rule: the confirm question comes AFTER the
 * hook on the chosen topic is on the board, and the tutor does not wait
 * for the answer. Generic by design (feedback_generic_prompts).
 */
export const DEMO_TOPIC_CONFIRM_CLAUSE =
  'HARD RULE for this DEMO opening turn (it overrides Rule 6\'s ban on asking what to work on, for this one turn only): the LAST sentence you speak this turn is a one-line topic confirm — name what today is about and ask whether they would rather learn something else — and then you stop and listen. Everything below still applies: board first, hook first; the confirm comes after the hook, as the closing sentence, and it is the question you leave them with (no other question in this turn). If they name something else, that is the topic now — switch to it in your very next turn (open-scope rules) and put something about IT on the board. '

/**
 * Open-scope block, the part added for demos: the switch happens THIS
 * turn, mid-segment and mid-example included, with no "let's finish this
 * first". Written against the Crimsora transcript, where every refusal
 * was one of the three moves named here.
 */
export const DEMO_TOPIC_SWITCH_RULE =
  ` A request to learn something else is honored THE TURN IT IS MADE, however far into an explanation, a segment or a problem you are, and however little time is left: one short sentence acknowledging the change, the propose_plan_swap call, and then something about the NEW topic on the board in that same turn. Three moves are forbidden: finishing the current point first ("before we do, quickly…", "your last answer is still open"), calling the request "a different lesson" or "a different session", and wrapping up the old topic instead of starting the new one because the clock is low — with little time left you give a short, concrete taste of what they asked for. A request repeated is a request you already failed to honor: switch at once, without another question.`;

/**
 * Demo plan framing addition (claude-brain lesson-plan block): the plan and
 * the segment rules are subordinate to what the student asks for.
 */
export const DEMO_PLAN_SUBORDINATE_RULE =
  `The student's own request outranks this plan and the segment rules above: if they ask to learn something else — another sub-topic, another chapter, another subject — switch to it in that turn (propose_plan_swap, then teach it from your own knowledge while the new plan loads). "Stay within the current segment" never applies against a student who has asked for a different topic.`;

/**
 * `<demo_stop>` additions: the milestone and wrap directives both push the
 * tutor to land the current concept; neither may be read as a reason to
 * refuse a topic change.
 */
export const DEMO_STOP_SWITCH_EXCEPTION =
  ' If the student asks to learn something else, that request wins over landing the current concept: switch to it and make the "I get it" moment land on what they asked for.';

export const DEMO_WRAP_SWITCH_EXCEPTION =
  ' The one exception: if the student asks to learn something else now, do not refuse because time is short — give them a short, concrete taste of it, then close.';

/** Last minute of a time-boxed session (live embed-1793249649483: a switch
 *  asked 10 s before the cap opened a new equation the goodbye then cut): no
 *  new topic can land, so the request is parked for next time. */
export const DEMO_WRAP_LAST_MINUTE_RULE =
  ' If the student asks to learn something else now, there is no time left to start it: say in one sentence that it is a good one for next time, put nothing new on the board, and close.';

/** The client has already spoken the fixed "two minutes left" line. */
export const DEMO_WRAP_ALREADY_TOLD =
  ' The student has already been told time is short — do not say so again; land the point and close.';
