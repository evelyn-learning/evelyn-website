import React from 'react';
import katex from 'katex';
import { EquationRenderer } from './EquationRenderer';
import { InlineMathText } from './InlineMathText';
import { normalizeCellForKatex } from './cellContentNormalize';

// Re-exported so existing imports of `{ normalizeCellForKatex } from
// './CellContent'` keep working; the implementation lives in
// cellContentNormalize.ts (a plain, CSS-import-free module) so it can be
// unit-tested from a node script — see that file's docstring for why.
export { normalizeCellForKatex };

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
 * "Expressionwith2^x". normalizeCellForKatex() auto-wraps prose word-runs in
 * \text{} before KaTeX so spaces are preserved and letters stay upright, and
 * braces bare parenthesized superscripts like f^(n).
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

  // Brace bare parenthesized superscripts and \text{}-wrap prose word-runs
  // (see normalizeCellForKatex docstring for why per-word wrapping broke).
  const latex = normalizeCellForKatex(normalized);

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
