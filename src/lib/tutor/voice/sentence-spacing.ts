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
 * - Never touch $…$ math spans — KaTeX must reach the caption
 *   renderer verbatim.
 * - Decimals are naturally immune: the char after the period is a
 *   digit, not an uppercase letter.
 */
export function normalizeSentenceSpacing(text: string): string {
  if (!text || text.length < 4) return text;
  // Odd indices after this split are complete $…$ spans — pass through
  // untouched. A trailing unpaired `$` (math still streaming in) lands in
  // the final even part; the uppercase + two-alnum guard makes a false
  // hit inside partial math effectively impossible.
  return text
    .split(/(\$[^$]*\$)/)
    .map((part, i) =>
      i % 2 === 1 ? part : part.replace(/([\p{L}\p{N}]{2}[.!?])(\p{Lu})/gu, '$1 $2'),
    )
    .join('');
}
