/**
 * Round-7++ meta-narration filter, extracted from the brain orchestrator so
 * it can be tested directly.
 *
 * The system prompt already forbids speaking internal reasoning, but the
 * brain leaks it regularly; orchestrator-side filtering is the safety net.
 *
 * TWO rules, and the second is why this module exists. The phrase rule
 * (moved verbatim) matches known leak wordings. The STRUCTURAL rule matches
 * XML/HTML-ish markup in a spoken sentence: portal-704e3e01 @1027.9s spoke a
 * whole `<result>…</result>` block to the student because it contained none
 * of the phrases — the filter had no notion that markup is never speech.
 * Structure is the durable signal; phrase lists only ever catch the leaks
 * someone already saw.
 *
 * Generic patterns only — no subject content.
 *
 * Pure module — no side effects, never throws.
 */

const PHRASE_START_RE =
  /^\s*(?:the student\b|the active problem\b|let me mark\b|since the student\b|the runtime\b|the system\b|that'?s? a greenlight\b|re-?checking my\b)/i;

const PHRASE_ANYWHERE_RE =
  /\bactive problem\b|\bgreenlight to advance\b|\bmark (?:it|this|the)? *(?:segment )?complete\b|\b(?:current|active) *segment\s*[Ii][Dd]?\b|\bcanonicaltext\b|\btool[_ ]result\b/i;

const SELF_REFERENCE_RE =
  /\bthe student\b|\bno verdict\b|\bisn'?t (?:quite )?an answer\b|\bnot an answer\b|\bmy (?:last|earlier|previous) correction\b|\bmy correction was\b|\bnothing to walk back\b|\bno correction (?:is )?needed\b|\brequest pattern\b|\bclassify (?:away|silently)\b|\bgive (?:her|him|them) (?:room|space)\b|\bautomated review\b/i;

// 2026-08-31 (Haiku observation round): spoken self-audit
// collocations that slipped the lists above — "I need to
// check myself first / my prior turn", "Let me compute:
// 8+8+5+5", "So my 'Not quite' was correct". Colon after
// "compute" is load-bearing: "Let me compute the area
// together" is legitimate teaching and must survive.
const SELF_AUDIT_RE =
  /^\s*i need to check\b|\blet me compute:\s|\bmy (?:prior|previous|last) turn\b|\bmy ["'“”]?not quite["'“”]? was\b/i;

// 2026-09-05 (live, portal-51b667f1): the correction-note re-check narrated
// as a sentence — "Let me re-derive this myself before responding." and
// "Let me re-verify that prior problem silently:". The note text already
// forbids it; this is the spoken-text backstop. Anchored to a re-*/verify
// verb AND a private-act marker (myself / silently / before responding /
// first / that prior …) so "Let me verify this with you" survives.
const RE_DERIVE_RE =
  /^\s*(?:ok(?:ay)?,?\s+)?let me (?:re-?derive|re-?verify|re-?check|re-?do|re-?examine|double-?check|verify|check)\b[^.!?]{0,60}?\b(?:myself|silently|quietly|before (?:responding|answering|replying)|first,?\s+then|that prior|my prior|my earlier|my previous|my last)\b/i;

/** A tag-shaped run: '<' + a letter or '/', a tag name, then '>'. Requires
 *  BOTH delimiters AND an '=' in any attribute section (so unspaced algebra
 *  like "3<n and n>10" or "a<b and c>d" survives — prose between brackets
 *  never contains attribute assignments). Legitimate markup either has no
 *  attributes ("<result>", "<thinking>") or carries a real one
 *  ("<span style="...">"). Spoken inequalities and LaTeX are unaffected. */
const MARKUP_RE = /<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s[^<>]*=[^<>]*)?>/;

export function isMetaNarration(
  sentence: string,
  opts?: { structural?: boolean },
): boolean {
  const s = sentence ?? '';
  if (PHRASE_START_RE.test(s) || PHRASE_ANYWHERE_RE.test(s) || SELF_REFERENCE_RE.test(s) || SELF_AUDIT_RE.test(s) || RE_DERIVE_RE.test(s)) return true;
  if (opts?.structural === false) return false;
  return MARKUP_RE.test(s);
}
