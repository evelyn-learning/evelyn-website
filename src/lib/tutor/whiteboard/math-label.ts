/**
 * prettyMathLabel — chart-label math prettifier (round-6f, 2026-07-28,
 * portal-8fded37f: the graph legend showed the raw "y = 0.5(x-2)^2 - 4").
 *
 * Chart legends / point labels / axis labels carry short function
 * expressions written in calculator notation. Full KaTeX is the wrong tool
 * there (labels freely mix prose — "f(x) = x + 2, hole at x=2" — and the
 * auto-wrap heuristic in inline-math.ts deliberately refuses `)^2`-shaped
 * scripts to stay prose-safe). Unicode super/subscripts are typography, not
 * layout: they cannot break prose, need no CSS, and work inside SVG text
 * nodes too.
 *
 * Deliberately narrow: only `^` / `_` scripts whose bodies are digits (plus
 * n, +, -, the common index forms). Anything else — `^x`, `^{ab2}` — is
 * left alone rather than half-converted. $-delimited spans are left intact
 * for InlineMathText to render as real KaTeX.
 *
 * Pure; script-tested (npm run test:math-label).
 */

const SUP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', 'n': 'ⁿ',
};
const SUB: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', 'n': 'ₙ',
};

function mapAll(body: string, table: Record<string, string>): string | null {
  let out = '';
  for (const ch of body) {
    const m = table[ch];
    if (!m) return null;
    out += m;
  }
  return out;
}

export function prettyMathLabel(text: string): string {
  if (!text) return text;
  // Leave $-delimited spans untouched — they belong to KaTeX.
  const parts = text.split(/(\$[^$]*\$)/);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return part; // inside $...$
      let t = part;
      t = t.replace(/\^\{([0-9n+\-]+)\}/g, (m, body: string) => mapAll(body, SUP) ?? m);
      t = t.replace(/\^([0-9n]+)/g, (m, body: string) => mapAll(body, SUP) ?? m);
      t = t.replace(/_\{([0-9n+\-]+)\}/g, (m, body: string) => mapAll(body, SUB) ?? m);
      t = t.replace(/_([0-9n]+)/g, (m, body: string) => mapAll(body, SUB) ?? m);
      return t;
    })
    .join('');
}
