'use client';

/**
 * InlineMathText
 *
 * Renders a string that mixes plain text and inline LaTeX math, where math
 * segments are delimited with $...$ (single dollar signs). Used for problem
 * statements, answer choices, and other cards where the tutor embeds
 * equations inline with prose.
 *
 * Example:
 *   "Solve for x: $2^{x+1} - 3 \\cdot 2^{x+2} = 0$"
 *   renders "Solve for x: " as text and the math in KaTeX.
 *
 * Currency vs. math: a $...$ pair is treated as math ONLY if the inner
 * content contains a LaTeX-style indicator (\, ^, _, {, }) or is a short
 * (≤4 char) whitespace-free identifier like $x$ or $T$. Without that, the
 * $ is treated as literal text — so prose containing currency like
 * "Maya has $50 and a $15 movie" renders correctly instead of being parsed
 * as a math segment "50 and a 15 movie".
 *
 * Unmatched $ is treated as literal text (so a raw "$5" shows as dollar-five).
 */

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface InlineMathTextProps {
  text: string;
  className?: string;
}

// Reject candidate math segments that look like prose with currency.
// Real math contains at least one LaTeX-only signal (backslash command,
// caret/underscore for sup/subscript, or braces). Short identifier-like
// strings ($x$, $T$, $y_1$ — handled by the brace/underscore rule) also
// pass. Anything else (e.g. "50 and one Saturday afternoon. She wants to
// (a) see a 15") fails and the surrounding $ stay literal.
function looksLikeMath(inner: string): boolean {
  if (/[\\^_{}]/.test(inner)) return true;
  if (inner.length <= 4 && !/\s/.test(inner)) return true;
  return false;
}

// Pre-pass: auto-wrap Unicode math symbols with limits in $...$ so they
// render through KaTeX. Seeds and brain narration commonly write
// "∫_0^4 x² dx" without any math delimiters; without this pass the
// underscore/caret render as literal characters (observed 2026-05-08
// AP Calc BC riemann-sums session — the worked-example card showed
// "∫_0^4" with literal `_` and `^` instead of stacked limits). Handles
// ∫ ∑ ∏ with either _<lo>^<hi> or ^<hi>_<lo> ordering. Token shapes
// supported: alphanumeric run, {brace group}, (paren group). Plain
// symbols without limits are NOT wrapped — they render fine as Unicode
// and wrapping a bare ∫ in math mode forces a font swap that looks
// inconsistent with the surrounding prose.
const MATH_SYMBOL_TO_CMD: Record<string, string> = { '∫': '\\int', '∑': '\\sum', '∏': '\\prod' };
const LIMIT_TOKEN = '\\{[^}]*\\}|\\([^)]*\\)|[A-Za-z0-9]+';
const SYMBOL_WITH_LIMITS_RE = new RegExp(
  `([∫∑∏])(?:_(${LIMIT_TOKEN})\\^(${LIMIT_TOKEN})|\\^(${LIMIT_TOKEN})_(${LIMIT_TOKEN}))`,
  'g',
);
function autoWrapUnicodeMath(text: string): string {
  if (!text) return text;
  return text.replace(SYMBOL_WITH_LIMITS_RE, (_match, sym, lowerA, upperA, upperB, lowerB) => {
    const cmd = MATH_SYMBOL_TO_CMD[sym] ?? sym;
    const lo = lowerA ?? lowerB;
    const hi = upperA ?? upperB;
    return `$${cmd}_{${lo}}^{${hi}}$`;
  });
}

// Split a string into alternating plain-text and math segments.
// Math is anything between matched single $...$ that doesn't include whitespace-only
// content, doesn't span across a newline, and passes the looksLikeMath check.
function segment(text: string): Array<{ kind: 'text' | 'math'; body: string }> {
  if (!text) return [];
  const out: Array<{ kind: 'text' | 'math'; body: string }> = [];
  let i = 0;
  while (i < text.length) {
    const dollar = text.indexOf('$', i);
    if (dollar < 0) {
      out.push({ kind: 'text', body: text.slice(i) });
      break;
    }
    // Escaped \$ → treat as literal dollar
    if (dollar > 0 && text[dollar - 1] === '\\') {
      out.push({ kind: 'text', body: text.slice(i, dollar - 1) + '$' });
      i = dollar + 1;
      continue;
    }
    const close = text.indexOf('$', dollar + 1);
    if (close < 0) {
      // Unmatched — emit remainder as text
      out.push({ kind: 'text', body: text.slice(i) });
      break;
    }
    const inner = text.slice(dollar + 1, close);
    // Skip empty / whitespace-only / multi-line pairs; treat as literal text
    if (!inner.trim() || inner.includes('\n')) {
      out.push({ kind: 'text', body: text.slice(i, close + 1) });
      i = close + 1;
      continue;
    }
    // Currency guard: if the inner doesn't look like math, treat the
    // opening $ as a literal character and resume scanning AFTER it (do
    // NOT consume the closing $, which may pair legitimately with a
    // later $ later in the string).
    if (!looksLikeMath(inner)) {
      out.push({ kind: 'text', body: text.slice(i, dollar + 1) });
      i = dollar + 1;
      continue;
    }
    if (dollar > i) out.push({ kind: 'text', body: text.slice(i, dollar) });
    out.push({ kind: 'math', body: inner });
    i = close + 1;
  }
  return out;
}

function Math({ latex }: { latex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    try {
      const processed = latex
        .replace(/\\\\(?=[a-zA-Z{])/g, '\\')
        .replace(/\\n/g, '\n');
      katex.render(processed, ref.current, {
        throwOnError: false,
        displayMode: false,
        trust: true,
        strict: false,
      });
    } catch {
      // Fall back to raw text if KaTeX throws
      if (ref.current) ref.current.textContent = latex;
    }
  }, [latex]);
  return <span ref={ref} className="inline-block align-baseline" />;
}

/** Decode the small set of HTML entities the brain habitually emits
 *  when generating code in plain-text fields (Java generics, C++
 *  templates, comparisons, etc.). The show_problem statement is
 *  rendered as plain text — entities would otherwise display literally
 *  ("ArrayList&lt;Integer&gt;" instead of "ArrayList<Integer>").
 *  Observed 2026-05-15 session. The set is restricted to the entities
 *  with unambiguous text equivalents; numeric entities (&#N;) and
 *  named entities beyond this set are intentionally NOT decoded to
 *  avoid surprising rewrites of intentional content. */
function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&'); // amp last
}

export function InlineMathText({ text, className = '' }: InlineMathTextProps) {
  const parts = segment(autoWrapUnicodeMath(decodeHtmlEntities(text)));
  return (
    <span className={`whitespace-pre-wrap ${className}`}>
      {parts.map((p, i) =>
        p.kind === 'math'
          ? <Math key={i} latex={p.body} />
          : <span key={i}>{p.body}</span>
      )}
    </span>
  );
}
