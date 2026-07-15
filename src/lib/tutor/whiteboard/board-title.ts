/**
 * Board-page switcher title normalizer.
 *
 * Board titles come straight from the tutor brain and sometimes carry raw
 * LaTeX WITHOUT $ delimiters ("Compute lim_{x→0} (…", live mobile Safari
 * test, IMG_7795). The switcher pill and its jump-to-page dropdown render
 * titles as plain text — InlineMathText's $...$ segmenter never sees them,
 * so the markup leaks through verbatim. This is a distinct, title-only
 * cleanup pass: it does not render math, it just makes stray LaTeX
 * readable as prose.
 */

// \frac{a}{b} -> a/b. Applied in a loop (not recursively) so nested
// fractions resolve inside-out: the regex only matches a frac whose
// numerator/denominator groups are themselves brace-free, which is
// exactly the innermost one first.
const FRAC_RE = /\\frac\{([^{}]*)\}\{([^{}]*)\}/;
function resolveFractions(t: string): string {
  let prev: string;
  do {
    prev = t;
    t = t.replace(FRAC_RE, '$1/$2');
  } while (t !== prev);
  return t;
}

export function stripLatexForTitle(t: string | undefined): string {
  let s = t || '';
  if (!s) return '';

  // Strip stray $ delimiters (defensive).
  s = s.replace(/\$/g, '');

  s = resolveFractions(s);

  // Special-case \sqrt to preserve grouping and render as symbol:
  // \sqrt{x} -> √x (single token, no parens)
  // \sqrt{x+1} -> √(x+1) (multiple tokens, parens preserve grouping)
  // \sqrt[3]{x} -> ∛x (cube root symbol)
  // \sqrt[n]{X} -> n√(X) (other roots with index notation)
  s = s.replace(/\\sqrt\[(\w+)\]\{([^{}]*)\}/g, (_, index, content) => {
    if (index === '3') return `∛${content}`;
    // For other indices, use n√(X) style
    return `${index}√(${content})`;
  });
  s = s.replace(/\\sqrt\{([^{}]*)\}/g, (_, content) => {
    // Single token doesn't need parens
    if (/^\w+$/.test(content)) return `√${content}`;
    return `√(${content})`;
  });

  // Symbol commands: map specific commands to their Unicode symbols
  // before the generic bare-command pass, so they're not converted to words.
  s = s.replace(/\\pm\b/g, '±');
  s = s.replace(/\\infty\b/g, '∞');

  // Other \command{arg} forms ("drop \command names sensibly") — keep the
  // braced content, drop the command name: \text{Hi} -> Hi.
  // (Note: \sqrt is already handled above, so we won't re-process it here.)
  s = s.replace(/\\[a-zA-Z]+\{([^{}]*)\}/g, '$1');

  // Braced sub/superscript groups: _{x→0} / ^{10} -> a leading space plus
  // the bare content ("lim_{x→0}" -> "lim x→0").
  s = s.replace(/[_^]\{([^{}]*)\}/g, ' $1');

  // Delimiter sizing commands: \left, \right, \big, \Big, \bigg, \Bigg and
  // their variants (\bigl, \bigr, \bigm, etc.) are pure sizing with no
  // semantic content — strip them entirely, not turned into words.
  s = s.replace(/\\(left|right|big[lmr]?|Big[lmr]?|bigg[lmr]?|Bigg[lmr]?)\b/g, '');

  // Any remaining bare \command names — strip the backslash, keep the
  // word: \pi -> pi, \theta -> theta. Run this BEFORE bare marker stripping
  // so that x^\pi gets converted to x^pi, and then the marker rule can strip the ^.
  s = s.replace(/\\([a-zA-Z]+)/g, '$1');

  // Bare (unbraced) sub/superscript markers: x^2 / y_1 / x^pi -> "x 2" / "y 1" / "x pi".
  // Extended character class from [A-Za-z0-9] to \S (any non-whitespace) to handle
  // symbol commands like \infty that convert to ∞.
  s = s.replace(/[_^](\S)/g, ' $1');

  // Escaped braces (\{ and \}) are literal brace characters — preserve them
  // by replacing with placeholders, then restore after removing LaTeX delimiters.
  s = s.replace(/\\{/g, '«');
  s = s.replace(/\\}/g, '»');

  // Leftover braces (from commands this pass didn't specifically target)
  // and stray backslashes — drop the punctuation, keep the content.
  s = s.replace(/[{}\\]/g, '');

  // Restore literal braces from escaped sequences.
  s = s.replace(/«/g, '{');
  s = s.replace(/»/g, '}');

  // Collapse whitespace introduced above (and any that was already there).
  return s.replace(/\s+/g, ' ').trim();
}
