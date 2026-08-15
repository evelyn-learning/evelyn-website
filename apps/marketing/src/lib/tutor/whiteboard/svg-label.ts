/**
 * texToSvgText — plain-Unicode rendering of LaTeX-ish snippets for SVG
 * <text> labels, where KaTeX can't run (it needs HTML). Chart curve labels
 * arrive from the brain as things like "r = 1 + \cos\theta"; without this
 * they render with raw backslash commands (observed live 2026-07-13,
 * PolarGraphRenderer cardioid label). Deliberately conservative: known
 * commands map to Unicode, function names lose their backslash, unknown
 * commands just lose the backslash rather than vanishing (a wrong-looking
 * "operatorname" beats silently dropped math).
 */

const GREEK: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', zeta: 'ζ',
  eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ',
  nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ',
  upsilon: 'υ', phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
  Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
};

const SYMBOLS: Record<string, string> = {
  cdot: '·', times: '×', pm: '±', mp: '∓', div: '÷', neq: '≠', ne: '≠',
  leq: '≤', le: '≤', geq: '≥', ge: '≥', approx: '≈', infty: '∞',
  rightarrow: '→', to: '→', leftarrow: '←', degree: '°', circ: '°',
  sqrt: '√', propto: '∝', partial: '∂', nabla: '∇', pm_: '±',
};

// Function names keep their letters, just lose the backslash.
const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'arcsin', 'arccos', 'arctan',
  'sinh', 'cosh', 'tanh', 'ln', 'log', 'exp', 'lim', 'max', 'min', 'det',
]);

export function texToSvgText(s: string): string {
  if (!s || !s.includes('\\')) return s;
  return s
    .replace(/\\text\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1)/($2)')
    .replace(/\\([a-zA-Z]+)/g, (_m, cmd: string) => {
      if (GREEK[cmd]) return GREEK[cmd];
      if (SYMBOLS[cmd]) return SYMBOLS[cmd];
      if (FUNCTIONS.has(cmd)) return cmd;
      return cmd; // unknown command: drop the backslash, keep the word
    })
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
