/**
 * LaTeX → readable WinAnsi-safe plain text for the PDF exporter.
 *
 * Extracted from pdf-tutor-session.ts in round 24 so node test suites can
 * exercise it (the exporter module pulls in jsPDF/app-side deps). Output is
 * deliberately Latin-1 only (·, ×, ±, ASCII elsewhere) — sanitizeForPDF
 * transliterates anything fancier right back to words, so emitting √/π/∫
 * here would be undone downstream.
 */
import { segment } from '@/lib/tutor/whiteboard/inline-math';

export function latexToReadable(latex: string): string {
  let s = latex;

  // Math functions — convert to readable names BEFORE the catch-all strip
  s = s.replace(/\\sin/g, 'sin');
  s = s.replace(/\\cos/g, 'cos');
  s = s.replace(/\\tan/g, 'tan');
  s = s.replace(/\\cot/g, 'cot');
  s = s.replace(/\\sec/g, 'sec');
  s = s.replace(/\\csc/g, 'csc');
  s = s.replace(/\\arcsin/g, 'arcsin');
  s = s.replace(/\\arccos/g, 'arccos');
  s = s.replace(/\\arctan/g, 'arctan');
  s = s.replace(/\\sinh/g, 'sinh');
  s = s.replace(/\\cosh/g, 'cosh');
  s = s.replace(/\\tanh/g, 'tanh');
  s = s.replace(/\\log/g, 'log');
  s = s.replace(/\\ln/g, 'ln');
  s = s.replace(/\\exp/g, 'exp');
  s = s.replace(/\\lim/g, 'lim');
  s = s.replace(/\\max/g, 'max');
  s = s.replace(/\\min/g, 'min');
  s = s.replace(/\\det/g, 'det');
  s = s.replace(/\\gcd/g, 'gcd');
  s = s.replace(/\\mod/g, 'mod');
  s = s.replace(/\\deg/g, 'deg');

  // Summation and product
  s = s.replace(/\\sum/g, 'Sum');
  s = s.replace(/\\prod/g, 'Prod');
  s = s.replace(/\\int/g, 'Integral');
  s = s.replace(/\\infty/g, 'inf');

  // Binomial coefficient: \binom{n}{k} → C(n,k)
  s = s.replace(/\\binom\{([^}]+)\}\{([^}]+)\}/g, 'C($1,$2)');

  // Roots: \sqrt[n]{x} → n-root(x), \sqrt{x} → sqrt(x). Inner-first loop
  // so nested radicands resolve.
  let prevRoot: string;
  do {
    prevRoot = s;
    s = s.replace(/\\sqrt\[([^\]]+)\]\{([^{}]*)\}/g, '$1-root($2)');
    s = s.replace(/\\sqrt\{([^{}]*)\}/g, 'sqrt($1)');
  } while (s !== prevRoot);

  // Greek letters
  s = s.replace(/\\rho/g, 'rho');
  s = s.replace(/\\alpha/g, 'alpha');
  s = s.replace(/\\beta/g, 'beta');
  s = s.replace(/\\gamma/g, 'gamma');
  s = s.replace(/\\theta/g, 'theta');
  s = s.replace(/\\Delta/g, 'Delta ');
  s = s.replace(/\\delta/g, 'delta');
  s = s.replace(/\\epsilon/g, 'epsilon');
  s = s.replace(/\\lambda/g, 'lambda');
  s = s.replace(/\\mu/g, 'mu');
  s = s.replace(/\\pi/g, 'pi');
  s = s.replace(/\\sigma/g, 'sigma');
  s = s.replace(/\\tau/g, 'tau');
  s = s.replace(/\\phi/g, 'phi');
  s = s.replace(/\\omega/g, 'omega');

  // Common operators — use Latin-1 compatible symbols where possible
  s = s.replace(/\\cdot/g, ' · ');   // middle dot ·
  s = s.replace(/\\times/g, ' × ');  // multiplication sign ×
  s = s.replace(/\\div/g, ' ÷ ');    // division sign ÷
  s = s.replace(/\\pm/g, '±');        // plus-minus ±
  s = s.replace(/\\mp/g, '-/+');
  s = s.replace(/\\leq/g, '<=');
  s = s.replace(/\\geq/g, '>=');
  s = s.replace(/\\neq/g, '!=');
  s = s.replace(/\\approx/g, '~=');
  s = s.replace(/\\equiv/g, '===');
  s = s.replace(/\\rightarrow/g, ' -> ');
  s = s.replace(/\\leftarrow/g, ' <- ');
  s = s.replace(/\\Rightarrow/g, ' => ');
  s = s.replace(/\\to\b/g, ' -> ');
  s = s.replace(/\\quad/g, '  ');
  s = s.replace(/\\qquad/g, '    ');
  s = s.replace(/\\,/g, ' ');
  s = s.replace(/\\;/g, ' ');
  s = s.replace(/\\!/g, '');
  s = s.replace(/\\left/g, '');
  s = s.replace(/\\right/g, '');

  // Fractions: \frac{a}{b} → (a)/(b). Round-24: \dfrac/\tfrac alias (the
  // transcript's dominant display form — round-20 Rule 3b output) and an
  // inner-first loop so \frac{\frac{1}{2}}{3} resolves instead of the old
  // [^}]+ match straddling the nested brace.
  let prevFrac: string;
  do {
    prevFrac = s;
    s = s.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)');
  } while (s !== prevFrac);
  // Subscripts/superscripts: keep inline
  s = s.replace(/\^{([^}]+)}/g, '^$1');
  s = s.replace(/_{([^}]+)}/g, '_$1');
  // Remove \text{...} wrapper
  s = s.replace(/\\text\{([^}]+)\}/g, '$1');
  // Remove remaining backslash commands (spacing, formatting, etc.)
  s = s.replace(/\\[a-zA-Z]+/g, '');
  // Clean up extra braces and spaces
  s = s.replace(/[{}]/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/** Round-24: convert inline `$…$` math spans in transcript/board prose to
 *  readable plain text for the PDF. segment() owns math-vs-currency
 *  disambiguation (same call the live bubbles use), so "$5 and $10" prose
 *  passes through untouched while `$h'(1) = \dfrac{1}{1+1^2}$` becomes
 *  `h'(1) = (1)/(1+1^2)`. */
export function mathifyDollarSpans(text: string): string {
  if (!text || !text.includes('$')) return text;
  return segment(text)
    .map((p) => (p.kind === 'math' ? latexToReadable(p.body) : p.body))
    .join('');
}
