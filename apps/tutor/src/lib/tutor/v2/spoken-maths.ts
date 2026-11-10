/**
 * Tutor brain v2 — did this reply say mathematics aloud?
 *
 * Mathematics that is only heard is lost: the student cannot hold an expression or a step in their
 * head while the next one arrives (Praveen, embed-1794339843244: "one gets lost and feels like an
 * automated machine is speaking some math incoherently"). When a reply speaks mathematics, the
 * runtime checks that the board shows it (turn.ts, the board pass). A bare verdict ("Yes, the limit
 * is 0") is not enough to count.
 */
const TOKEN = /\$[^$]+\$|\d+(?:\.\d+)?|[=+−×÷^√∞²³]|(?<![A-Za-z])[a-z](?![A-Za-z'’])|\b(?:over|minus|plus|times|divided|squared|cubed|equals?|root|power|derivative|integral|limit|numerator|denominator|fraction|factorial|logarithm|ln|log|sin|sine|cos|cosine|tan|tangent|half|halves|thirds?|quarters?|fifths?|sixths?|eighths?|tenths?|percent|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/gi;

export function speaksMaths(spoken: string, minTokens = 6): boolean {
  if (/\$[^$]*[\\^_=+\-/][^$]*\$/.test(spoken)) return true;
  // "a" and "I" are words, not variables.
  const hits = (spoken.match(TOKEN) ?? []).filter((t) => !/^(a|i)$/i.test(t));
  return hits.length >= minTokens;
}
