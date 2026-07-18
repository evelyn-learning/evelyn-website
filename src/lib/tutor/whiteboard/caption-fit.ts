/**
 * Pure helpers behind the CaptionTicker's math-aware width fitting
 * (SessionStage.tsx). Extracted in the round-23 math-coverage sweep so the
 * node test suites can exercise them — captions carry the DISPLAY form, so
 * `$…$` spans flow through here on every spoken sentence.
 */

/** Rendered-width proxy for a string that may contain $…$ math: raw LaTeX
 *  (`\dfrac{1}{f'(f^{-1}(2))}`) measures far wider as canvas text than its
 *  KaTeX-rendered form, so the fitter measures spans with commands and
 *  braces stripped as a proxy for the rendered glyph count. */
export function captionMeasureProxy(s: string): string {
  return s.replace(/\$([^$]*)\$/g, (_m, b: string) =>
    b.replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, ''));
}

/** Whitespace tokenizer where a balanced `$…$` span (which may itself
 *  contain spaces, e.g. `$y = 3$`) counts as one unsplittable unit — the
 *  tail-fit loop must never cut inside a span, or the unbalanced `$` makes
 *  the remainder render as literal LaTeX. Unmatched `$` degrades to plain
 *  word splitting. */
export function tokenizeCaptionMathAtomic(s: string): string[] {
  return s.match(/(?:\$[^$]*\$|\S)+/g) ?? [];
}

/** A typewriter/clamp cut can land mid-span; hold back the unbalanced tail
 *  until its closing `$` arrives so raw LaTeX never flashes while the
 *  caption streams in. */
export function holdBackUnbalancedMathTail(s: string): string {
  if (((s.match(/\$/g) ?? []).length) % 2 === 1) {
    return s.slice(0, s.lastIndexOf('$'));
  }
  return s;
}

/** \dfrac renders display-height and overflows the single-line ticker. */
export function normalizeCaptionMath(s: string): string {
  return s.replace(/\\dfrac/g, '\\frac');
}
