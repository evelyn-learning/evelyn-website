/**
 * Prose sent as an equation. Language lessons (GDI advanced session
 * 2026-10-15) put plain English sentences on the board as
 * `\text{I tried scuba diving last summer.}` — KaTeX draws that in the
 * serif math font, centred like a formula, so a sentence reads as math.
 *
 * `latexAsProse` returns the sentence as runs of plain/bold text when the
 * LaTeX is ONLY text: every word sits inside \text / \textbf / \textit /
 * \textrm / \mathrm-free groups, and what is left outside them has no
 * command, no ^ / _, no relation and no digit. Anything with real math
 * (`5\,\text{m}`, `x = \text{cost}`, `\frac`) returns null and stays KaTeX.
 */

export type ProseRun = { text: string; bold: boolean };

const TEXT_GROUP = /\\(text|textbf|textit|textrm|textsf|emph)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g;

export function latexAsProse(latex: string): ProseRun[] | null {
  if (typeof latex !== 'string' || !/\\(text|textbf|textit|textrm|textsf|emph)\s*\{/.test(latex)) return null;
  const runs: ProseRun[] = [];
  let last = 0;
  let outside = '';
  const push = (text: string, bold: boolean) => {
    if (!text) return;
    const prev = runs[runs.length - 1];
    if (prev && prev.bold === bold) prev.text += text;
    else runs.push({ text, bold });
  };
  for (const m of latex.matchAll(TEXT_GROUP)) {
    const between = latex.slice(last, m.index);
    outside += between;
    push(between, false);
    const inner = m[2]!.replace(/\\textbf\s*\{([^{}]*)\}/g, '$1');
    if (/\\[a-zA-Z]/.test(inner.replace(/\\[{}%&$#_ ]/g, ''))) return null;
    push(inner.replace(/\\([{}%&$#_ ])/g, '$1'), m[1] === 'textbf');
    last = (m.index ?? 0) + m[0].length;
  }
  const tail = latex.slice(last);
  outside += tail;
  push(tail, false);
  // Between text groups only spacing, an arrow, or "=" used as a label
  // ("\text{Kim's message} = \text{"Are you free…"}", GDI meeting session
  // 2026-10-15) may appear: "=" reads as ":", arrows as "→". Any other
  // command, a script, a relation, or a bare letter or digit outside the
  // text groups means this is math.
  const SEP = /\\[,;:! ]|\\qquad|\\quad|\\(rightarrow|to|Rightarrow|longrightarrow)\b/g;
  const rest = outside.replace(SEP, ' ').replace(/=/g, ' ');
  if (/\\|[\^_<>]|[A-Za-z0-9]/.test(rest)) return null;
  const sepText = (t: string) => t
    .replace(/\\qquad|\\quad/g, ' · ')
    .replace(/\\[,;:! ]/g, ' ')
    .replace(/\\(rightarrow|to|Rightarrow|longrightarrow)\b/g, ' → ')
    .replace(/(\s*·\s*)?→(\s*·\s*)?/g, ' → ')
    .replace(/\s*=\s*/g, ': ');
  const cleaned = runs
    .map((r) => ({ ...r, text: (r.bold ? r.text : sepText(r.text)).replace(/[{}]/g, '').replace(/[ \t]+/g, ' ') }))
    .filter((r) => r.text.length > 0);
  if (cleaned.length === 0) return null;
  cleaned[0]!.text = cleaned[0]!.text.trimStart();
  cleaned[cleaned.length - 1]!.text = cleaned[cleaned.length - 1]!.text.trimEnd();
  return cleaned.some((r) => /[A-Za-z぀-ヿ一-鿿]/.test(r.text)) ? cleaned : null;
}
