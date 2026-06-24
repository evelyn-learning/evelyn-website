import React from 'react';
import katex from 'katex';
import { EquationRenderer } from './EquationRenderer';
import { InlineMathText } from './InlineMathText';

/** Strip LaTeX markup down to readable text — graceful fallback when a cell's
 *  LaTeX is malformed (e.g. the brain emits a stray "}"), so we never dump raw
 *  red "\text{...}\sqrt{...}" source into a table cell. */
function latexToReadableText(s: string): string {
  return s
    .replace(/\\text\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, '√$1')
    .replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1)/($2)')
    .replace(/\\[\s,;:!]/g, ' ')  // control space / escaped punctuation → space
    .replace(/\\[a-zA-Z]+/g, ' ') // drop any remaining commands
    .replace(/[{}$]/g, '')         // drop braces / $ delimiters
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Render a table cell / header that may contain math. Detects LaTeX and renders
 * it through KaTeX; otherwise renders plain text. Shared by the generic
 * `show_table` renderer (WhiteboardCanvas) AND the catalog `comparison_table` /
 * `t_chart`-style renderers (CatalogAdvancedRenderers) so both honour LaTeX in
 * cells — previously the catalog tables dumped raw "\frac{...}", "\pm", etc.
 *
 * When a cell mixes English prose with math (e.g. "Expression with 2^x"),
 * KaTeX in math mode concatenates consecutive letters — it would render
 * "Expressionwith2^x". Auto-wrap prose word-runs in \text{} before KaTeX so
 * spaces are preserved and letters stay upright.
 */
export function CellContent({ value }: { value: string }) {
  if (!value) return null;

  // Defensive ASCII-math → LaTeX upgrade for the unambiguous tokens the brain
  // still emits in table cells (sqrt(...), bare greek words, "2pi"). Without
  // this KaTeX renders them as literal letters ("sqrt", "theta", "pir"). The
  // genuinely ambiguous cases — a bare "x" meant as ×, or "pi" fused to a
  // variable as in "pir" — are deliberately left alone: auto-fixing them would
  // corrupt legitimate single-letter variables, so the brain prompt owns them.
  const normalized = value
    .replace(/\bsqrt\s*[([]\s*([^)\]]*?)\s*[)\]]/gi, '\\sqrt{$1}')
    .replace(/\b(pi|theta|alpha|beta|gamma|delta|lambda|sigma|phi|omega)\b/g, '\\$1')
    .replace(/(\d)\s*pi\b/g, '$1\\pi');

  // Explicit $...$ delimiters → use the inline text+math renderer.
  if (/\$.+?\$/.test(normalized)) {
    return <InlineMathText text={normalized} />;
  }

  // Any backslash-command signals LaTeX: a named command (\frac, \pm, \pi,
  // …) OR a spacing/punctuation command (\, \; \: \! and the control space
  // "\ " = backslash-whitespace). The earlier match missed the control
  // space, so a cell like "(a,\ 0)" fell through to plain text and leaked the
  // literal "\ " (2026-06-24 Console17 Img2; "(a,\,0)" thin space was the
  // 2026-06-19 Console5 case). In a math table cell a backslash is virtually
  // always LaTeX, so the broad match is safe.
  const hasLatexCmd = /\\(?:[a-zA-Z]+|[\s,;:!])/.test(normalized);
  const hasSubSup = /[_^{}]/.test(normalized);

  if (!hasLatexCmd && !hasSubSup) {
    return <>{value}</>;
  }

  // Heuristic: does the cell also contain English prose? If so, auto-wrap
  // alphabetic word-runs of length ≥ 2 in \text{} so KaTeX renders them as
  // upright prose. Common filler words (with/and/the/of/...) signal prose.
  // Single-letter variables (x, y, etc.) are untouched.
  const proseSignal = /\b(with|and|the|of|in|to|from|then|for|using|given|or|as|it|is|are|each|both|let|apply|rewrite|simplify|substitution|substitute|multiply|divide|expression|original|result|answer|step|formula|final|combined|limit|upper|lower|angle|base|height|width|length|opp|adj|hyp|radius|side|area|perimeter|diameter)\b/i.test(normalized);
  let latex = normalized;
  if (proseSignal) {
    // Wrap each 2+ letter alphabetic run in \text{...}. Skip runs that are
    // already inside a \text{} block (simple check: previous char was "{")
    // and skip common math-mode function names (sin, cos, tan, log, ln, exp).
    const mathFns = new Set(['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'log', 'ln', 'exp', 'lim', 'max', 'min', 'arg', 'det', 'dim', 'gcd', 'lcm']);
    latex = normalized.replace(/(\\?)([a-zA-Z]{2,})/g, (match, slash, word) => {
      if (slash) return match;
      if (mathFns.has(word.toLowerCase())) return match;
      return `\\text{${word}}`;
    });
  }

  // Validate before handing to the (red-on-error) KaTeX renderer. If the LaTeX
  // is malformed (unbalanced braces, etc.), degrade to cleaned readable text
  // instead of dumping raw red source into the cell.
  let valid = true;
  try {
    katex.renderToString(latex, { throwOnError: true, displayMode: false });
  } catch {
    valid = false;
  }
  if (!valid) {
    return <span className="text-gray-800">{latexToReadableText(value)}</span>;
  }

  return <EquationRenderer latex={latex} displayMode={false} className="inline-block" />;
}
