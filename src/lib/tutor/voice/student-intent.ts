/**
 * Student intent detection shared between the voice and typed-input paths.
 *
 * Prior to this helper, new-problem keyword detection lived inline in the
 * voice-transcription handler, which meant typed messages (sent via
 * sendTextMessage) bypassed it entirely. Sessions like 2026-04-24 showed
 * the consequence: typing "Draw a 30° inclined plane…" or "Show an animal
 * cell…" never triggered a newPage because the detector never ran.
 *
 * Centralizing this logic also keeps the voice-final handler readable and
 * makes the pattern list the single source of truth for "is this a new
 * problem request?" across the codebase.
 */

/**
 * Phrases that signal the student is setting up a NEW problem / example /
 * diagram on the whiteboard — the board should start a fresh page. Kept
 * broad on purpose: a false-positive newPage is a minor layout blip; a
 * missed newPage accumulates unrelated content on the same page and makes
 * the session hard to scan.
 *
 * Categories of phrases:
 *   1. Imperative draw/show/plot verbs with (a|an|the) determiner
 *   2. Scenario setups ("A ball is dropped", "An object is placed")
 *   3. Transition phrases ("now do", "next problem", "move on to")
 *   4. Topic names prefixed with "about" or "on"
 */
export const NEW_PROBLEM_PATTERNS: readonly RegExp[] = [
  // 1a. Imperative verbs + determiner — most common imperative form.
  //     Negative lookahead excludes continuation words that make the
  //     phrase refer to existing board content rather than a new problem
  //     (2026-04-24 pendulum session: "Ok can you show me the next step
  //     to find T" triggered auto-newPage even though the student was
  //     asking to see the next step of the SAME problem).
  /\b(?:draw|show|plot|sketch|graph|diagram|illustrate|display)\s+(?:a|an|the|me a|me an|me the)\s+(?!next\b|previous\b|step\b|steps\b|answer\b|answers\b|result\b|results\b|solution\b|solutions\b|calculation\b|calculations\b|derivation\b|explanation\b|reason\b|rest\b|other\b|same\b|work\b|working\b|formula\b|equation\b)/i,
  // 1b. Plot/graph + quantity (no determiner): "plot position vs time",
  //     "graph velocity", "plot f(x)" — common in physics/math.
  /\b(?:plot|graph|sketch)\s+(?:position|velocity|acceleration|force|energy|momentum|displacement|distance|height|pressure|temperature|frequency|amplitude|voltage|current|[a-z]\(\w+\)|\w+\s+vs\s+\w+)\b/i,
  // 1c. Named cycles (water/carbon/nitrogen/rock/cell/lunar/life)
  /\b(?:draw|show|plot|sketch|graph)\s+(?:me\s+)?(?:the\s+)?(?:water|carbon|nitrogen|rock|cell|lunar|life)\s+cycle\b/i,

  // 2a. Scenario declarations with linking verb — "A ball is dropped",
  //     "Two masses are connected", "An object is placed".
  /\b(?:a|an|two|three|four)\s+\w+(?:\s+\w+)?\s+(?:is|are)\s+(?:dropped|launched|thrown|placed|released|moving|connected|attached|at rest|in motion|on|falls|slides|rolls)\b/i,
  // 2b. Scenario declarations with standalone verb — "A car moves",
  //     "A rock falls", "An object slides". Determiner + noun + motion
  //     verb is unmistakably a physics scenario setup.
  /\b(?:a|an|two|three|four)\s+\w+(?:\s+\w+)?\s+(?:moves|falls|slides|rolls|accelerates|decelerates|travels|flies|slows|speeds|spins|rotates|oscillates|swings|bounces|rises|sinks|floats|stops|starts)\b/i,

  // 3. Transition / sequencing
  /\bnow\s+(?:do|show|draw|give me|let's|try)\b/i,
  /\bnext\s+(?:problem|one|example|question)\b/i,
  /\banother\s+(?:one|example|problem|question)\b/i,
  /\blet'?s\s+try\s+(?:a|another|the)\b/i,
  /\bmove on to\b/i,
  /\bnew\s+(?:problem|example|one|question|topic|subject)\b/i,

  // 4. Topic-naming — "tell me about X", "let's talk about X". These often
  //    precede a diagram request and are common pivot signals.
  /\b(?:tell me|teach me|explain)\s+(?:about|how)\b/i,
  /\blet'?s\s+(?:talk|learn|study|cover)\s+(?:about|the)\b/i,

  // 5. Standalone "compute/find/calculate <noun>" is a problem setup when
  //    it arrives WITHOUT a preceding scaffold — same turn as "Draw X" or
  //    alone. We keep this narrow (requires problem-noun keywords) to
  //    avoid triggering when the student is answering a tutor question.
  //    Negative lookahead on "of this/that/it/these/those/them" excludes
  //    continuation requests like "find the period OF THIS" (2026-04-24
  //    pendulum session: asking to find the period of the pendulum
  //    already on the board should NOT start a new page).
  /\b(?:compute|calculate|find|determine|evaluate)\s+(?:the\s+)?(?:mechanical advantage|time period|acceleration|velocity|force|momentum|energy|work|power|frequency|wavelength|period|resistance|current|voltage|area|volume|perimeter|mass|weight|density|pressure|ph|concentration|molarity|derivative|integral|limit|slope|angle|distance|time)\b(?!\s+of\s+(?:this|that|it|these|those|them))(?!\s+period)/i,
];

export interface StudentIntent {
  /** True if the text matches at least one new-problem pattern. */
  newProblem: boolean;
  /** The pattern that matched first, for debug logging. */
  matchedPattern: string | null;
}

export function detectStudentIntent(text: string): StudentIntent {
  const raw = (text || '').trim();
  if (!raw) return { newProblem: false, matchedPattern: null };
  for (const re of NEW_PROBLEM_PATTERNS) {
    if (re.test(raw)) {
      return { newProblem: true, matchedPattern: re.source };
    }
  }
  return { newProblem: false, matchedPattern: null };
}

/**
 * Phrases that indicate the student wants the tutor to stop Socratic
 * scaffolding and just work the problem end-to-end. Matches the
 * "walk-through" request set from the system prompt. Used separately from
 * the new-problem detector.
 */
export const WALK_THROUGH_PATTERNS: readonly RegExp[] = [
  /\bwalk me through\b/i,
  /\bjust show me\b/i,
  /\bshow me how\b/i,
  /\byou do it\b/i,
  /\bstep by step\b/i,
  /\bdon'?t ask me\b/i,
  /\bjust give me the answer\b/i,
];

export function isWalkThroughRequest(text: string): boolean {
  const raw = (text || '').trim();
  if (!raw) return false;
  return WALK_THROUGH_PATTERNS.some((re) => re.test(raw));
}

/**
 * Phrases that clearly signal the student wants the tutor to proceed
 * with the CURRENT problem — not start a new one. Used to filter out
 * tutor-emitted newPage markers when the tutor has misread a "next?"
 * continuation as a new-problem request.
 *
 * Examples that should match (continuation):
 *   "got it, next?", "ok next", "next step", "yep, continue",
 *   "keep going", "and then?", "go on", "what's next"
 * Examples that should NOT match (genuine new problem):
 *   "next problem", "let's do another", "new example"
 *
 * Kept conservative: only matches utterances that BOTH (a) contain a
 * continuation cue AND (b) do NOT contain a new-problem noun like
 * "problem / example / question / one" that would indicate the student
 * really is asking for a fresh prompt.
 */
const CONTINUATION_CUES =
  /\b(?:next(?:\s+step)?|continue|keep going|go on|and then|and next|what'?s next|proceed|carry on|and\?)\b|(?:got it|ok|okay|yep|yes|yeah|uh\s*huh|mhm)[\s,!?.]*(?:next|continue|go on|proceed|keep going|and\?|and then)?/i;

/**
 * Phrases that explicitly anchor the question to the current problem
 * ("for this", "of this one", "for that same problem"). When present, the
 * student is asking about the figure already on the board, not a new one.
 * Strong signal — overrides the cue requirement when no new-problem noun
 * is present.
 *
 * 2026-04-24 vertical-spring session: "Can you show me the steps to find
 * T for this?" had no CONTINUATION_CUES match ("next"/"continue"/etc.),
 * but contained "for this" — clearly a continuation of the same problem.
 * Without the anaphoric path, auto-newPage fired for the T sub-question.
 */
const ANAPHORIC_CONTINUATION =
  /\b(?:for|of|about|on)\s+(?:this|that|these|those|it|the\s+(?:same|previous|above|one\s+above|current|earlier))\b|\b(?:same|previous|above|current)\s+(?:problem|example|question|one|setup|figure|diagram|situation|scenario)\b/i;

const NEW_PROBLEM_NOUNS =
  /\b(?:problem|example|question|one|topic|subject|another)\b/i;

/**
 * Continuation-biased modifiers that, when they precede a problem-noun,
 * flip its interpretation from "new problem" to "same problem" — e.g.,
 * "the same problem", "this one", "the current question". Without this
 * override, "walk me through the same problem" would be blocked by the
 * NEW_PROBLEM_NOUNS check even though "the same" clearly anchors it to
 * the current problem.
 */
const CONTINUATION_MODIFIER_BEFORE_NOUN =
  /\b(?:same|this|that|these|those|current|previous|above|earlier|original|the\s+same)\s+(?:problem|example|question|one|topic|subject|setup|figure|diagram|situation|scenario)\b/i;

export function isContinuationRequest(text: string): boolean {
  const raw = (text || '').trim();
  if (!raw) return false;
  const hasNewProblemNoun = NEW_PROBLEM_NOUNS.test(raw);
  const hasContinuationModifier = CONTINUATION_MODIFIER_BEFORE_NOUN.test(raw);
  if (hasNewProblemNoun && !hasContinuationModifier) {
    // "next problem" / "another example" → genuine pivot, not a
    // continuation. But "the same problem" / "this one" retain their
    // continuation meaning — the modifier anchors the noun to the
    // current context.
    return false;
  }
  // Two paths count as continuation (no new-problem noun present):
  //   1. Explicit continuation cue ("next", "continue", "got it ok").
  //   2. Anaphoric reference to the current problem ("for this", "of
  //      that") — explicitly anchors the question to the figure already
  //      on the board. Catches phrases like "Can you show me the steps
  //      to find T for this?" where the "for this" pins the sub-question
  //      to the current problem even without a "next"-style cue.
  if (CONTINUATION_CUES.test(raw)) return true;
  if (ANAPHORIC_CONTINUATION.test(raw)) return true;
  return false;
}
