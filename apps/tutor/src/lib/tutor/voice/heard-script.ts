/**
 * The script a learner's recognised words are shown and sent in.
 *
 * Cartesia Ink writes Mandarin in Simplified characters whoever speaks (probe 2026-11-24: a Taiwan voice's
 * 「我不會，可以再說一次嗎？」 came back 「我不会可以再说一次吗？」). A learner in Taiwan reads Traditional: their own
 * words in the caption and the transcript would look like someone else's, and the tutor, told to write only
 * Traditional, would be quoting characters the learner never uses. A lesson language with `heardAs:
 * 'traditional'` (voice/lesson-language.ts) has its heard text converted, character for character (the
 * Taiwan-standard forms, no vocabulary swaps: what they said is what is written).
 *
 * The table is 1.1 MB, so it is loaded only by a session that needs it, and until it has loaded the text passes
 * through as heard.
 */
import { taughtIn, sessionLanguageRows } from './lesson-language';
import { heardNumerals } from './heard-numerals';

export type HeardConverter = (text: string) => string;
const same: HeardConverter = (t) => t;
let traditional: Promise<HeardConverter> | null = null;

/** Whether this session's heard text is converted. */
export function heardNeedsConversion(languages: readonly string[] | null | undefined): boolean {
  return (taughtIn(languages)?.heardAs ?? sessionLanguageRows(languages).find((r) => r.heardAs)?.heardAs) === 'traditional';
}

/** Whether numbers they say are written as digits (voice/heard-numerals.ts): a lesson taught in Chinese or Japanese. */
const numeralsAsDigits = (languages: readonly string[] | null | undefined) => { const b = taughtIn(languages)?.base; return b === 'zh' || b === 'ja'; };

/** The converter for a session's heard text: the identity for every session that needs none. Never rejects. */
export function loadHeardConverter(languages: readonly string[] | null | undefined): Promise<HeardConverter> {
  const digits: HeardConverter = numeralsAsDigits(languages) ? heardNumerals : same;
  if (!heardNeedsConversion(languages)) return Promise.resolve(digits);
  traditional ??= import('opencc-js/cn2t')
    .then((m) => {
      const make = (m as unknown as { Converter: (o: { from: string; to: string }) => HeardConverter }).Converter;
      const convert = make({ from: 'cn', to: 'tw' });
      return ((text: string) => { try { return convert(text); } catch { return text; } }) as HeardConverter;
    })
    .catch(() => same);
  return traditional.then((toTraditional) => (text: string) => digits(toTraditional(text)));
}
