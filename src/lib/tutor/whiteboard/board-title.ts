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

  s = resolveFractions(s);

  // Other \command{arg} forms ("drop \command names sensibly") — keep the
  // braced content, drop the command name: \sqrt{x} -> x, \text{Hi} -> Hi.
  s = s.replace(/\\[a-zA-Z]+\{([^{}]*)\}/g, '$1');

  // Braced sub/superscript groups: _{x→0} / ^{10} -> a leading space plus
  // the bare content ("lim_{x→0}" -> "lim x→0").
  s = s.replace(/[_^]\{([^{}]*)\}/g, ' $1');

  // Bare (unbraced) sub/superscript markers: x^2 / y_1 -> "x 2" / "y 1".
  s = s.replace(/[_^]([A-Za-z0-9])/g, ' $1');

  // Any remaining bare \command names — strip the backslash, keep the
  // word: \pi -> pi, \theta -> theta, \left -> left.
  s = s.replace(/\\([a-zA-Z]+)/g, '$1');

  // Leftover braces (from commands this pass didn't specifically target)
  // and stray backslashes — drop the punctuation, keep the content.
  s = s.replace(/[{}\\]/g, '');

  // Collapse whitespace introduced above (and any that was already there).
  return s.replace(/\s+/g, ' ').trim();
}
