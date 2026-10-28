/**
 * First-turn runway strip (2026-10-28, Praveen: "Hey Praveen. Let's get
 * started. Let's dig in, Praveen" — three stacked lead-ins before any content).
 *
 * The turn-opener rule (system-prompt-builder TURN_OPENER_RULE) wants a
 * content-free runway phrase on every turn EXCEPT the session's first, and
 * the prompt says so in words. Haiku emits it anyway: "Okay, let's dig in",
 * "Alright, let's dig in", "Let's dig in, Praveen" opened every live demo
 * on 10-28. Structural fix: on the opening attempt, sentence 0 is run
 * through this — a bare runway sentence is dropped, a runway prefix on a
 * real sentence is trimmed. Every other turn is untouched (the runway buys
 * time there). Pure, client-safe.
 */

const LEAD = "(?:(?:okay|ok|alright|all right|right|so|great|well|sure|now)[,.!]?\\s+)?";
const RUNWAY = "let[’']?s\\s+(?:dig(?:\\s+right)?\\s+in|get\\s+started|dive(?:\\s+right)?\\s+in|get\\s+going|jump(?:\\s+right)?\\s+in|begin|start)";
const TAIL = "(?:,?\\s+(?:then|now))?(?:,\\s*[\\p{L}][\\p{L}'’-]*)?";
const END = "[.!,…:;\\s]*";

/** Whole sentence is a runway phrase (optionally with a name): "Let's dig in, Praveen." */
export const FIRST_TURN_RUNWAY_SENTENCE_RE = new RegExp(`^\\s*${LEAD}${RUNWAY}${TAIL}${END}$`, 'iu');
/** Runway prefix on a longer sentence: "Okay, let's dig in: a caterpillar…" */
export const FIRST_TURN_RUNWAY_PREFIX_RE = new RegExp(`^\\s*${LEAD}${RUNWAY}${TAIL}[.!,…:;]+\\s*`, 'iu');

/**
 * Returns the sentence with any leading runway phrase removed; '' when the
 * sentence was nothing but the runway phrase (caller drops it).
 */
export function stripFirstTurnRunway(sentence: string): string {
  const s = sentence ?? '';
  if (FIRST_TURN_RUNWAY_SENTENCE_RE.test(s)) return '';
  const m = s.match(FIRST_TURN_RUNWAY_PREFIX_RE);
  if (!m) return s;
  const rest = s.slice(m[0].length);
  if (!rest.trim()) return '';
  // Re-capitalise the first letter of what remains.
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}
