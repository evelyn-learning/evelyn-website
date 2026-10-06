/**
 * `no_problem_available` for a GENERIC "another one" request — what the tutor
 * does instead of telling the student.
 *
 * 2026-10-05 (live, AP Chemistry portal-01cf022e): "Here's a similar one to
 * try. I don't have a clean follow-up problem ready right now — want to wrap
 * up here, or should I make one up on the spot for you to try?" The prompt's
 * Case B PRESCRIBED that apology ("Hmm, I don't have a clean follow-up on
 * that one") and forbade the tutor from posing its own problem. A student
 * who asked for practice was told the tutor had none.
 *
 * With TUTOR_NO_PROBLEM_SELF_POSE on, Case B becomes: never mention the
 * failed lookup; pose a similar problem of your own (answer worked out first
 * and declared so the runtime can verify it), or simply continue. Case A
 * (explicit "harder / easier" request → improvise) is unchanged.
 *
 * Implemented as a rewrite of the assembled prompt text, anchored on the
 * rule's own headings, so the big prompt template is not edited in place. A
 * missing anchor leaves the prompt as it was (and the unit test fails).
 *
 * Pure; never throws.
 */
import { TUTOR_NO_PROBLEM_SELF_POSE } from '@/lib/tutor/orchestrator/turn-round-flags';

export const CASE_B_START = '**Case B — Student request was generic';
export const CASE_B_END = '**On `advance_lesson_failed` tool_result';
const VARY_APOLOGY_START = '**Vary apology language across consecutive no_problem_available hits.**';
const BRIDGE_CASE_B_START = '- On no_problem_available + Case B:';

export const CASE_B_SELF_POSE =
  `**Case B — Student request was generic ("another one", "one more", "give me another"), with no harder/easier/different modifier.** The student asked for practice and the runtime had nothing to serve. That is yours to solve, never the student's to hear about:\n\n` +
  `1. NEVER tell the student that no problem is available, ready or left, and never apologise for it — no "I don't have a clean follow-up", no "nothing ready right now", no offer to "make one up". And never announce a problem ("here's a similar one") before one is actually on the board.\n` +
  `2. Pose a similar problem of your own: the same skill, about as hard as the one just finished. BEFORE you render it, work its answer out silently, step by step, and check that answer once more. Then render it with \`show_problem\` and declare the answer in \`expectedAnswer\` so the runtime can verify it. Use the short improvised-problem prefix exactly as in Case A.\n` +
  `3. If a fresh problem would not serve the student right now (they are in the middle of something, or have plainly had enough), simply continue with the current work or the next step instead — again without a word about the failed lookup.\n` +
  `4. DO NOT call \`generate_problem\` again with the same anchor (the runtime already exhausted retries + bank + topical-fallback).\n` +
  `5. **CRITICAL: DO NOT re-emit \`show_segment_card\` for an already-completed segment.** The runtime's session-scoped dedup will silently suppress the render — you'll narrate "here's your next problem" while the board still shows the prior one.\n\n`;

export const BRIDGE_CASE_B_SELF_POSE =
  `- On no_problem_available + Case B: no apology, and no mention that nothing was found. Either pose your own similar problem exactly as in Case A (the short prefix, then the problem — its answer worked out first and declared via \`expectedAnswer\`), or continue with the current work. Do NOT say "moving to a new page" when nothing new is rendering.`;

/** Replace the line that starts at `start` (through its newline). */
function replaceLine(text: string, start: string, replacement: string): string {
  const i = text.indexOf(start);
  if (i < 0) return text;
  const eol = text.indexOf('\n', i);
  const end = eol < 0 ? text.length : eol;
  return text.slice(0, i) + replacement + text.slice(end);
}

/**
 * @param enabled  Unset ⇒ TUTOR_NO_PROBLEM_SELF_POSE. False ⇒ the prompt is
 *   returned unchanged (byte-identical).
 */
export function applyNoProblemSelfPoseRule(prompt: string, enabled?: boolean): string {
  try {
    if ((enabled ?? TUTOR_NO_PROBLEM_SELF_POSE) !== true) return prompt;
    let out = prompt;
    const start = out.indexOf(CASE_B_START);
    const end = out.indexOf(CASE_B_END);
    if (start < 0 || end < 0 || end <= start) return prompt;
    // Case B's body AND the "insistence after a Case B refusal" paragraph
    // (there is no refusal any more) both sit between the two anchors.
    out = out.slice(0, start) + CASE_B_SELF_POSE + out.slice(end);
    // "Vary apology language…" — there is no apology to vary.
    const vary = out.indexOf(VARY_APOLOGY_START);
    if (vary >= 0) {
      const eol = out.indexOf('\n', vary);
      const after = eol < 0 ? out.length : eol + 1;
      // Drop the paragraph and the blank line that followed it.
      out = out.slice(0, vary) + out.slice(out[after] === '\n' ? after + 1 : after);
    }
    out = replaceLine(out, BRIDGE_CASE_B_START, BRIDGE_CASE_B_SELF_POSE);
    return out;
  } catch {
    return prompt;
  }
}

/** The `message` of the generate_problem tool result when nothing could be
 *  sourced — the instruction closest to the moment the brain decides. */
export function noProblemToolMessage(enabled?: boolean): string {
  return (enabled ?? TUTOR_NO_PROBLEM_SELF_POSE) === true
    ? 'No problem could be sourced. Do NOT tell the student this, do not apologise, and do not announce a problem that is not on the board. ' +
      'Either pose a similar problem of your own — work its answer out carefully first, render it with show_problem and declare expectedAnswer — or simply continue with the current work.'
    : 'No problem could be sourced. Continue without injection.';
}
