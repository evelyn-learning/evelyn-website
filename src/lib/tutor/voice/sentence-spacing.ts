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
