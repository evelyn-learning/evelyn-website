/**
 * Sentence-spacing normalizer (session-quality C1, 2026-07-08).
 *
 * Sonnet occasionally drops the space after a sentence terminator —
 * observed in Vanshika's AP Stats session (`portal-9549e3af`):
 * "independent.Let's build", "one step at a time.Take a look",
 * "Exactly right.Ten out of fifty", "proportions.Proportions are".
 * The SentenceBuffer boundary regex requires trailing whitespace after
 * the terminator, so the merged pair rides through as ONE sentence:
 * captions show the glued text and TTS phrases straight through the
 * boundary without a pause.
 *
 * The rules are deliberately narrow — an earlier broad "split after
 * period" defense in the SentenceBuffer regressed real decimals
 * ("85.4" → "85. 4", TTS read "eighty five four") and was reverted;
 * see the asterisk-merge comment in claude-brain.ts.
 *
 * - Fire ONLY on a terminator immediately followed by an UPPERCASE
 *   letter. Sentence starts are capitalized; lowercase-after covers
 *   filenames, domains and mid-sentence abbreviations — leave those.
 * - Require two alphanumerics immediately before the terminator so
 *   acronyms and initials ("U.S.A", "A.M.") never split.
 * - Colons count as terminators under the same guards ("…is:So here",
 *   2026-07-10 coop-conics run). Clock times (3:45) are digit-after,
 *   ratios (a:b) are lowercase-after, single-letter labels (x:Y) fail
 *   the two-alnum guard — all naturally immune.
 * - Never touch $…$ math spans — KaTeX must reach the caption
 *   renderer verbatim.
 * - Decimals are naturally immune: the char after the period is a
 *   digit, not an uppercase letter.
 */
/**
 * Abbreviation tails whose trailing period must NOT be treated as a
 * sentence end. Shared by the SentenceBuffer streaming chunker
 * (claude-brain.ts) and the fallback splitter (tts-recovery.ts) — round
 * 28 (2026-07-24, live: "the U.S. It became…" split into two TTS
 * requests, voicing a hard sentence pause inside "U.S.").
 *
 * Arms:
 * - Word abbreviations (honorifics + titles + citation shorthand).
 *   Deliberately excludes "St"/"Mt" (ordinals like "1st." would
 *   false-positive across the digit→letter word boundary) and "No"
 *   ("No." is a common complete student/tutor sentence).
 * - `e.g` / `i.e` retained explicitly (predate the generic arm).
 * - Generic dotted initialism: letter(.letter)+. — covers U.S., U.K.,
 *   U.N., D.C., B.C.E., U.S.S.R., a.m., p.m. in one shape (min two
 *   letters, so a sentence genuinely ending in "…option B." never
 *   matches).
 */
export const ABBREV_TAIL_RE =
  /(?:\b(?:Mr|Ms|Mrs|Mx|Dr|Prof|Sr|Jr|vs|etc|approx|Sen|Rep|Gov|Gen|Col|Lt|Rev|Hon|Fig|Ch|Inc|Ltd|Univ|Dept)|\be\.g|\bi\.e|\b[\p{L}](?:\.[\p{L}])+)\.$/iu;

export function normalizeSentenceSpacing(text: string): string {
  if (!text || text.length < 4) return text;
  // Odd indices after this split are complete $…$ spans — pass through
  // untouched. A trailing unpaired `$` (math still streaming in) lands in
  // the final even part; the uppercase + two-alnum guard makes a false
  // hit inside partial math effectively impossible.
  return text
    .split(/(\$[^$]*\$)/)
    .map((part, i) =>
      i % 2 === 1 ? part : part.replace(/([\p{L}\p{N}]{2}[.!?:])(\p{Lu})/gu, '$1 $2'),
    )
    .join('');
}

/**
 * Stage-direction leak defense (live 2026-07-30, portal-589b451a): the
 * brain wrote "…what does that give you?(waiting for the student's
 * answer)" and the parenthetical was spoken aloud by TTS and stored in
 * the transcript. The model occasionally scripts the pause it expects —
 * screenplay-style — instead of just ending its turn.
 *
 * Deliberately narrow: only parentheticals whose content STARTS with a
 * stage-direction verb/noun (waiting/pauses/beat/silence/listening/
 * "no response"/"student responds") are stripped. Math parentheticals
 * ("3(x-2)"), ordinary asides ("(about an hour a day)"), and content
 * where a stage verb appears mid-parenthetical ("(his rivals were
 * waiting)") pass through untouched. The system prompt also bans the
 * pattern — this is the runtime backstop.
 */
const STAGE_DIRECTION_RE =
  /\(\s*(?:a\s+|the\s+)?(?:waiting|waits?|awaiting|awaits?|paus(?:e|es|ing)|beat\b|silence|silent(?:ly)?|listen(?:s|ing)?|no\s+(?:response|answer)|student\s+(?:answers?|responds?|replies|thinks?|works?))\b[^()]*\)/gi;

export function stripStageDirections(text: string): string {
  if (!text || !text.includes('(')) return text;
  const stripped = text.replace(STAGE_DIRECTION_RE, '');
  if (stripped === text) return text;
  // Tidy what the removal leaves behind: doubled spaces mid-sentence,
  // an orphaned space before punctuation, leading/trailing whitespace.
  return stripped.replace(/[ \t]{2,}/g, ' ').replace(/ +([.,!?;:])/g, '$1').trim();
}

/**
 * Third-person meta-narration leak defense (live 2026-08-20,
 * portal-2d53e403 at 288.4s). The tutor SPOKE its own adjudication
 * reasoning to the student:
 *
 *   Their reply "10.5" answers an earlier question (After Tuesday), but
 *   the active question asks for ten fifty minus six seventy-five.
 *   Hang on — that ten fifty was the number after Tuesday...
 *
 * That first sentence is machinery talking to itself. It is NOT a template
 * — no such string exists in this codebase; the brain composed it, prompted
 * by the stale-card grading rule in claude-brain.ts ("Their reply answers
 * THIS question — grade it against THIS..."). It passed the judge
 * (`judge_pass grounded`) and passed stripStageDirections, which only ever
 * removes PARENTHETICALS, and was counted as part of a 4-sentence turn.
 *
 * The discriminator is grammatical person. A tutor addresses the student in
 * the SECOND person — "you", "your answer". A sentence whose subject is the
 * student in the THIRD person ("their reply", "the student's answer") is
 * addressed to no one in the room.
 *
 * DELIBERATELY TWO-PART, and the second part is what makes it safe: the
 * sentence needs a third-person-student subject AND an adjudication marker.
 * "Their reply to the king was open defiance" is ordinary history prose and
 * must survive; so must "The colonists sent their answer, and it did not
 * match what London expected." Requiring both signals is what separates the
 * grading machinery's voice from a lesson about people who replied to
 * things. When only one signal is present, the sentence is kept — a leaked
 * sentence is embarrassing, but eating a real sentence of teaching mid-turn
 * is worse and much harder to notice.
 *
 * Exercised by `npm run test:stage-direction-strip`.
 */

/** Subject is the student, in the third person, doing something answer-shaped. */
const META_SUBJECT_RE =
  /^\s*["'“]?\s*(?:their|they|the\s+student(?:'s|’s)?|student(?:'s|’s))\s+(?:\w+\s+){0,2}?(?:repl(?:y|ies|ied)|answers?|answered|responses?|responded|responds?|utterances?|said|says|claims?|claimed|guess(?:es|ed)?)\b/i;

/** The turn is adjudicating an answer against a question, not teaching. */
const META_ADJUDICATION_RE =
  /\b(?:active|earlier|previous|current|prior)\s+question\b|\bexpected\s+answer\b|\bactive\s+problem\b|\bthe\s+question\s+(?:asks|asked)\b|\b(?:matches|match(?:es)?|contradicts)\s+the\s+(?:expected|verified|active)\b/i;

/**
 * Remove whole sentences that are internal adjudication narrated in the
 * third person. Returns the remaining text, trimmed. Returns '' when every
 * sentence was meta — callers already drop empty sentences (SentenceBuffer
 * pushes only truthy strings and flush() returns `trimmed || null`).
 */
export function stripMetaNarration(text: string): string {
  const src = (text ?? '').trim();
  if (!src) return '';
  // Cheap bail: no third-person student subject anywhere ⇒ nothing to do.
  if (!/\b(?:their|they|student)\b/i.test(src)) return src;
  // Sentence split that does NOT break on decimals. A naive /[.!?]/ split
  // cuts `Their reply "10.5" answers...` in half at the decimal point,
  // leaving the subject in one fragment and the adjudication marker in the
  // other so NEITHER matches — which is exactly how the live leak slipped
  // through a first attempt at this guard. In a math tutor, decimals inside
  // sentences are the norm, not an edge case. So: break only where a
  // terminator is followed by whitespace and a capital (or a quote then a
  // capital). `10.5` has a digit after the period and stays intact.
  const parts = src.split(/(?<=[.!?]["'”’]?)\s+(?=["'“']?[A-Z])/);
  if (parts.length === 0) return src;
  const kept = parts.filter((raw) => {
    const one = raw.trim();
    if (!one) return false;
    return !(META_SUBJECT_RE.test(one) && META_ADJUDICATION_RE.test(one));
  });
  if (kept.length === parts.length) return src; // nothing matched
  return kept.join(' ').replace(/[ \t]{2,}/g, ' ').trim();
}
