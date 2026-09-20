/**
 * Pure helpers behind the CaptionTicker's math-aware width fitting
 * (SessionStage.tsx). Extracted in the round-23 math-coverage sweep so the
 * node test suites can exercise them — captions carry the DISPLAY form, so
 * `$…$` spans flow through here on every spoken sentence.
 *
 * Live check 7 (2026-09-07, portal-8ed0fb65): the caption `"$3 off each
 * shirt" — … combine $-6$ and $4$` paired the CURRENCY "$3" with the next
 * real delimiter into one giant "math" span. The measure proxy stripped it
 * to almost nothing, the fitter decided the whole 60-word sentence fit on
 * one line, and the inner span wrapped it into eight. Every helper here now
 * shares one currency-aware span scanner: a `$` directly followed by an
 * amount and then whitespace/punctuation/end is money, not a delimiter.
 */

const CURRENCY_AT = /^\$\d[\d,]*(?:\.\d+)?(?=[\s,.;:!?)"”']|$)/;

/** Is the `$` at index `i` a currency sign (as opposed to a math delimiter)? */
export function isCurrencyDollarAt(s: string, i: number): boolean {
  if (s[i] !== '$') return false;
  if (i > 0 && s[i - 1] === '\\') return false;
  return CURRENCY_AT.test(s.slice(i, i + 40));
}

/** Balanced math spans `[start, end]` (inclusive of both `$`), skipping
 *  currency signs; `unbalancedAt` is the index of a trailing opening `$`
 *  that never closed (a typewriter cut mid-span). */
export function scanMathSpans(s: string): { spans: Array<{ start: number; end: number }>; unbalancedAt: number | null } {
  const spans: Array<{ start: number; end: number }> = [];
  let i = 0;
  while (i < s.length) {
    const open = s.indexOf('$', i);
    if (open < 0) break;
    if (isCurrencyDollarAt(s, open) || (open > 0 && s[open - 1] === '\\')) { i = open + 1; continue; }
    let close = s.indexOf('$', open + 1);
    while (close >= 0 && (isCurrencyDollarAt(s, close) || s[close - 1] === '\\')) close = s.indexOf('$', close + 1);
    if (close < 0) return { spans, unbalancedAt: open };
    spans.push({ start: open, end: close });
    i = close + 1;
  }
  return { spans, unbalancedAt: null };
}

/** Rendered-width proxy for a string that may contain $…$ math: raw LaTeX
 *  (`\dfrac{1}{f'(f^{-1}(2))}`) measures far wider as canvas text than its
 *  KaTeX-rendered form, so the fitter measures spans with commands and
 *  braces stripped as a proxy for the rendered glyph count. */
export function captionMeasureProxy(s: string): string {
  const { spans } = scanMathSpans(s);
  if (!spans.length) return s;
  let out = ''; let i = 0;
  for (const sp of spans) {
    out += s.slice(i, sp.start);
    out += s.slice(sp.start + 1, sp.end).replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '');
    i = sp.end + 1;
  }
  return out + s.slice(i);
}

/** Whitespace tokenizer where a balanced `$…$` span (which may itself
 *  contain spaces, e.g. `$y = 3$`) counts as one unsplittable unit — the
 *  tail-fit loop must never cut inside a span, or the unbalanced `$` makes
 *  the remainder render as literal LaTeX. Currency signs are plain text;
 *  an unmatched delimiter degrades to plain word splitting. */
export function tokenizeCaptionMathAtomic(s: string): string[] {
  const { spans } = scanMathSpans(s);
  const MARK = '⁣'; // invisible separator: stands in for spaces inside a span
  let masked = s;
  for (const sp of spans) {
    const body = s.slice(sp.start, sp.end + 1).replace(/\s/g, MARK);
    masked = masked.slice(0, sp.start) + body + masked.slice(sp.end + 1);
  }
  return (masked.match(/\S+/g) ?? []).map((t) => t.split(MARK).join(' '));
}

/** A typewriter/clamp cut can land mid-span; hold back the unbalanced tail
 *  until its closing `$` arrives so raw LaTeX never flashes while the
 *  caption streams in. A bare trailing `$4` (mid-reveal of `$4$`) is held
 *  back too — it reads as money until its closing `$` lands. */
export function holdBackUnbalancedMathTail(s: string): string {
  const { unbalancedAt } = scanMathSpans(s);
  if (unbalancedAt !== null) return s.slice(0, unbalancedAt);
  const trailingAmount = /\$\d[\d,]*(?:\.\d+)?$/.exec(s);
  if (trailingAmount) return s.slice(0, trailingAmount.index);
  return s;
}

/** \dfrac renders display-height and overflows the single-line ticker. */
export function normalizeCaptionMath(s: string): string {
  return s.replace(/\\dfrac/g, '\\frac');
}
