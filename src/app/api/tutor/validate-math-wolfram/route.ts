/**
 * Wolfram Alpha Math Validation API
 *
 * Validates numerical expressions and equations using Wolfram Alpha.
 * Used to verify that the AI tutor's calculations are correct.
 *
 * Supports:
 * - Equation evaluation (e.g., "sqrt(5^2 + 2.79^2)")
 * - Expression simplification (e.g., "120*pi*0.025")
 * - Trigonometric calculations (e.g., "arctan(2.79/5) in degrees")
 * - Unit conversions
 *
 * Falls back to Claude validation if Wolfram is unavailable or over quota.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID;
const anthropic = new Anthropic();

interface DeclaredFunctionCtx {
  name: string;   // e.g. "f"
  argVar: string; // e.g. "x"
  body: string;   // latex RHS of the declaration
}

interface ValidationRequest {
  latex: string;
  label?: string;
  conversationContext?: string;
  // Declared functions in the session, used when label announces an operation
  // on a specific named function ("Derivative of f(x)").
  declaredFunctions?: DeclaredFunctionCtx[];
  // Hint for the operation the tutor is performing on the declared function.
  // When set together with declaredFunctions, we ask Wolfram to compute it
  // and compare against the tutor's claim.
  expectedOperation?: 'derivative' | 'integral' | 'simplify' | 'evaluate';
  // The name of the declared function the operation applies to (e.g. "f").
  expectedOperationTarget?: string;
}

interface ValidationResult {
  correct: boolean;
  correctedLatex?: string;
  correctedLabel?: string;
  issues?: string[];
  source: 'wolfram' | 'claude' | 'skipped' | 'wolfram-derivative' | 'wolfram-integral';
  // When set, the tutor's latex was wrong for the announced operation.
  expected?: string;
}

// Infer the integration variable from context — look for `d<letter>` in the
// surrounding latex (e.g. `Integral e^t dt` → `t`). Falls back to undefined.
function inferIntegrationVar(contextLatex: string): string | undefined {
  const m = contextLatex.match(/\bd([a-zA-Z])\b/);
  return m?.[1];
}

// Match a balanced bracket-wrapped body immediately before a pipe: `[...]|`
// or `(...)|`. Returns the body (without outer brackets) and the full match.
// Handles nested brackets by depth-counting.
// Only `[]` and `()` are treated as evaluation-body delimiters; a curly brace
// right before `|` typically closes an exponent or subscript (`e^{t-1}|`),
// so we leave those to the one-token fallback which keeps the full expression.
function matchBalancedBody(text: string, barIdx: number): { body: string; fullStart: number } | null {
  if (barIdx <= 0) return null;
  let i = barIdx - 1;
  while (i >= 0 && /\s/.test(text[i])) i--;
  if (i < 0) return null;
  const close = text[i];
  const open = close === ']' ? '[' : close === ')' ? '(' : null;
  if (!open) return null;
  let depth = 1;
  let j = i - 1;
  while (j >= 0 && depth > 0) {
    if (text[j] === close) depth++;
    else if (text[j] === open) depth--;
    if (depth === 0) break;
    j--;
  }
  if (depth !== 0) return null;
  return { body: text.slice(j + 1, i), fullStart: j };
}

// Strip "x=" prefix from a bound like "x=2" → "2".
function unwrapBound(b: string): string {
  const m = b.trim().match(/^[a-zA-Z]\s*=\s*(.+)$/);
  return m ? m[1].trim() : b.trim();
}

// Expand definite-integral bracket notation `expr |_a^b` into `(expr @ b) - (expr @ a)`.
// Handles:
//   • `e^{t-1}|_1^2`
//   • `e^{t-1}|_{x=1}^{x=2}` (bound expressions with "x=")
//   • `[F(x) + G(x)]|_a^b` (balanced bracket-wrapped body)
//   • `(F(x))|_a^b`
// Example: "[F(x) + G(x)]|_1^2" → "((F(2) + G(2))) - ((F(1) + G(1)))"
function expandEvaluationBrackets(expr: string, contextVar?: string): string {
  // Normalize delimiter decorators.
  let s = expr
    .replace(/\\(?:left|right|big|Big|bigg|Bigg)\|/g, '|')
    .replace(/\\(?:left|right|big|Big|bigg|Bigg)\./g, '')
    .replace(/\\(?:left|right|big|Big|bigg|Bigg)(?=[\[\](){}])/g, '');

  // Iterate — a single string may have multiple evaluation brackets.
  // Each iteration finds one `|_..^..` with a balanced body and rewrites it.
  for (let attempt = 0; attempt < 4; attempt++) {
    // Pattern for the bound pair after `|`: supports {...} or bare tokens.
    const boundRe = /\|\s*_\{?([^}^]+?)\}?\s*\^\s*\{?([^}\s|]+)\}?/;
    const bm = s.match(boundRe);
    if (!bm) break;
    const barIdx = s.indexOf(bm[0]);
    const lowerRaw = bm[1];
    const upperRaw = bm[2];

    // Try balanced-bracket body first.
    let body: string | null = null;
    let fullStart: number | null = null;
    const balanced = matchBalancedBody(s, barIdx);
    if (balanced) {
      body = balanced.body;
      fullStart = balanced.fullStart;
    } else {
      // Fall back to "one token before |"
      const re = /([^\s|]+)\s*\|/;
      const m = s.slice(0, barIdx + 1).match(re);
      if (m) {
        body = m[1];
        fullStart = s.lastIndexOf(m[1], barIdx - 1);
      }
    }
    if (body === null || fullStart === null) break;

    const lower = unwrapBound(lowerRaw);
    const upper = unwrapBound(upperRaw);

    // Determine integration variable.
    let v: string;
    if (contextVar && new RegExp(`\\b${contextVar}\\b`).test(body)) {
      v = contextVar;
    } else {
      const letters = Array.from(body.matchAll(/\b([a-zA-Z])\b/g)).map(x => x[1]);
      v = letters.find(l => !['e', 'i', 'd'].includes(l)) || letters[0] || 't';
    }
    // Substitute the integration variable — treat `v` as an identifier token
    // only. `\b` alone misses `3x` (digit→letter has no word boundary), so
    // we use explicit letter/underscore negative lookarounds.
    const sub = (bound: string) => body!.replace(
      new RegExp(`(?<![a-zA-Z_])${v}(?![a-zA-Z_])`, 'g'),
      `(${bound})`,
    );
    const evaluated = `(${sub(upper)}) - (${sub(lower)})`;
    // Replace the body + evaluation bracket with the expanded form.
    const barEnd = barIdx + bm[0].length;
    s = s.slice(0, fullStart) + evaluated + s.slice(barEnd);
  }
  return s;
}

// Extract numerical expressions from LaTeX for Wolfram evaluation
function extractExpressionsFromLatex(latex: string): string[] {
  const expressions: string[] = [];

  // Pre-expand |_a^b evaluation brackets so "F(t)|_1^2" becomes "(F(2)) - (F(1))".
  // This lets Wolfram check whether the tutor's claimed RHS matches the evaluated bracket.
  const contextVar = inferIntegrationVar(latex);
  const preprocessed = expandEvaluationBrackets(latex, contextVar);

  // Look for "= <numerical expression>" patterns
  // e.g., "X_L = \\omega L = 120 \\pi \\times 0.025"
  // We want to verify that the final numerical result matches
  const parts = preprocessed.split('=').map(p => p.trim());

  for (const part of parts) {
    // Convert LaTeX to Wolfram-compatible expression
    let expr = part
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
      .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
      .replace(/\\left|\\right/g, '')
      .replace(/\\cdot/g, '*')
      .replace(/\\times/g, '*')
      .replace(/\\pi/g, 'pi')
      .replace(/\\omega/g, 'omega')
      .replace(/\\tan\^?\{?-1\}?/g, 'arctan')
      .replace(/\\sin\^?\{?-1\}?/g, 'arcsin')
      .replace(/\\cos\^?\{?-1\}?/g, 'arccos')
      .replace(/\\sin/g, 'sin')
      .replace(/\\cos/g, 'cos')
      .replace(/\\tan/g, 'tan')
      .replace(/\\ln/g, 'ln')
      .replace(/\\log/g, 'log')
      .replace(/\^{([^}]+)}/g, '^($1)')
      .replace(/_{[^}]+}/g, '') // Remove subscripts (variable names)
      .replace(/\\[a-zA-Z]+/g, '') // Remove remaining LaTeX commands
      .replace(/\{|\}/g, '') // Remove braces
      .trim();

    // Only keep expressions that contain numbers and operators
    if (/\d/.test(expr) && expr.length > 1) {
      expressions.push(expr);
    }
  }

  return expressions;
}

// Convert LaTeX RHS into a plain Wolfram-readable expression.
function latexToWolfram(latex: string): string {
  return latex
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
    .replace(/\\left|\\right/g, '')
    .replace(/\\cdot/g, '*')
    .replace(/\\times/g, '*')
    .replace(/\\pi/g, 'pi')
    .replace(/\\omega/g, 'omega')
    .replace(/\\tan\^?\{?-1\}?/g, 'arctan')
    .replace(/\\sin\^?\{?-1\}?/g, 'arcsin')
    .replace(/\\cos\^?\{?-1\}?/g, 'arccos')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\ln/g, 'ln')
    .replace(/\\log/g, 'log')
    .replace(/\^{([^}]+)}/g, '^($1)')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/\{|\}/g, '')
    .trim();
}

// Extract RHS of an equation (after the last "=")
function rhsOf(latex: string): string {
  const parts = latex.split('=');
  if (parts.length < 2) return latex.trim();
  return parts[parts.length - 1].trim();
}

// Query Wolfram v2 to get a structured plaintext result (more flexible than /result)
async function queryWolframV2(input: string): Promise<string | null> {
  if (!WOLFRAM_APP_ID) return null;
  try {
    const url = `https://api.wolframalpha.com/v2/query?input=${encodeURIComponent(input)}&appid=${WOLFRAM_APP_ID}&output=json&format=plaintext&podstate=Result__Step-by-step+solution`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const data = await response.json();
    const qr = data.queryresult;
    if (!qr?.success) return null;
    // Prefer a Result pod if present, otherwise concatenate.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pods = qr.pods as any[] | undefined;
    if (!pods) return null;
    const pickFirst = (titles: RegExp) => pods.find(p => titles.test(p.title));
    const result = pickFirst(/^result/i) || pickFirst(/^derivative/i) || pickFirst(/^indefinite integral/i) || pods[0];
    if (!result?.subpods?.length) return null;
    return result.subpods.map((s: { plaintext?: string }) => s.plaintext || '').join('\n').trim();
  } catch (err) {
    console.error('[WolframMath] v2 query failed:', err);
    return null;
  }
}

// Normalize a Wolfram / plain math expression for coarse equivalence check.
// Does NOT evaluate symbolic equivalence — only syntactic normalization.
function normalizeExpr(expr: string): string {
  return expr
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\*/g, '')
    .replace(/\\cdot/g, '')
    .replace(/\\/g, '')
    .replace(/\{|\}/g, '')
    .replace(/\(|\)/g, '')
    .replace(/\+\-/g, '-')
    .replace(/\-\+/g, '-')
    .replace(/\+0(?!\d)|0(?!\d)\+/g, '')
    .replace(/[cC]$/, ''); // drop trailing integration constant
}

// Symbolically equivalent? Ask Wolfram: "simplify (a) - (b)" and expect 0.
async function areEquivalent(a: string, b: string): Promise<boolean | null> {
  // Quick syntactic check first
  if (normalizeExpr(a) === normalizeExpr(b)) return true;
  const result = await queryWolframV2(`simplify (${a}) - (${b})`);
  if (!result) return null;
  // Look for a result that is 0 (possibly "0", "0.0", "0 ")
  const firstLine = result.split('\n')[0].trim();
  return /^[-+]?0(\.0+)?$/.test(firstLine);
}

// Parse a Wolfram result string into a number. Handles decimals ("5.33"),
// fractions ("16/3"), and mixed forms ("≈ 5.33"). Returns NaN if unparseable.
function parseWolframNumeric(s: string): number {
  if (!s) return NaN;
  // Strip whitespace, unicode decorators, and leading "≈"/"=" tokens.
  const cleaned = s.replace(/^[≈=\s]+/, '').trim();
  // Fraction: "a/b" or "-a/b" (with optional decimals)
  const frac = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (frac) {
    const num = parseFloat(frac[1]);
    const den = parseFloat(frac[2]);
    if (den !== 0) return num / den;
  }
  // Plain number: "-3.14", "42", "1e-5"
  const plain = cleaned.match(/^-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?$/);
  if (plain) return parseFloat(cleaned);
  // Fallback: first numeric token (may be a decimal inside noise)
  const first = cleaned.match(/-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/);
  return first ? parseFloat(first[0]) : NaN;
}

// Query Wolfram Alpha Short Answers API (simpler, faster, better for calculations)
async function queryWolframShort(input: string): Promise<string | null> {
  if (!WOLFRAM_APP_ID) return null;

  try {
    const url = `https://api.wolframalpha.com/v1/result?i=${encodeURIComponent(input)}&appid=${WOLFRAM_APP_ID}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (response.status === 501) {
      // Wolfram couldn't understand the query
      return null;
    }
    if (response.status === 403) {
      // Over quota or invalid API key
      console.warn('[WolframMath] API quota exceeded or invalid key');
      return null;
    }
    if (!response.ok) return null;

    return await response.text();
  } catch (err) {
    console.error('[WolframMath] Query failed:', err);
    return null;
  }
}

// Validate via Claude as fallback
async function validateViaClaude(
  latex: string,
  label: string | undefined,
  conversationContext: string | undefined,
): Promise<ValidationResult> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: `You are a math accuracy checker. Given a LaTeX equation from an AI tutor, verify the numerical calculations are correct.
Respond with JSON only: {"correct": true/false, "issues": ["list of errors"], "correctedLatex": "fixed latex if needed"}
Only flag actual mathematical errors (wrong arithmetic, wrong formula application). Do NOT flag style/formatting differences.`,
      messages: [{
        role: 'user',
        content: `Verify this equation: ${latex}${label ? `\nLabel: ${label}` : ''}${conversationContext ? `\nContext: ${conversationContext}` : ''}`,
      }],
    });

    const text = response.content[0];
    if (text.type !== 'text') return { correct: true, source: 'claude' };

    const jsonMatch = text.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { correct: true, source: 'claude' };

    const result = JSON.parse(jsonMatch[0]);
    return {
      correct: result.correct !== false,
      correctedLatex: result.correctedLatex,
      issues: result.issues,
      source: 'claude',
    };
  } catch (err) {
    console.error('[WolframMath] Claude fallback failed:', err);
    return { correct: true, source: 'claude' };
  }
}

// Detect an operation hint from the label if the caller didn't provide one.
function inferOperation(label: string | undefined): { op: 'derivative' | 'integral' | null; target?: string } {
  if (!label) return { op: null };
  const l = label.toLowerCase();
  const derivMatch = l.match(/derivative\s+of\s+([a-zA-Z])/);
  if (derivMatch) return { op: 'derivative', target: derivMatch[1] };
  if (/\bderivative\b/.test(l)) return { op: 'derivative' };
  const intMatch = l.match(/integral\s+of\s+([a-zA-Z])/);
  if (intMatch) return { op: 'integral', target: intMatch[1] };
  if (/\bintegral\b|\bantiderivative\b/.test(l)) return { op: 'integral' };
  return { op: null };
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidationRequest = await request.json();
    const {
      latex, label, conversationContext,
      declaredFunctions, expectedOperation, expectedOperationTarget,
    } = body;

    if (!latex) {
      return NextResponse.json({ error: 'latex is required' }, { status: 400 });
    }

    console.log(`[WolframMath] Validating: "${latex}" (label: "${label || ''}")`);

    // Context-aware derivative/integral check. When we know the tutor is
    // computing d/dx of a declared function, ask Wolfram for the exact result
    // and compare against the tutor's claimed RHS.
    const inferred = inferOperation(label);
    const op = expectedOperation || inferred.op;
    const targetName = expectedOperationTarget || inferred.target;
    if (op && declaredFunctions && declaredFunctions.length > 0) {
      const decl = targetName
        ? declaredFunctions.find(d => d.name === targetName)
        : declaredFunctions[declaredFunctions.length - 1];
      if (decl) {
        const srcExpr = latexToWolfram(decl.body);
        const tutorRhs = latexToWolfram(rhsOf(latex));
        const variable = decl.argVar || 'x';
        const query = op === 'derivative'
          ? `d/d${variable} [${srcExpr}]`
          : `integrate ${srcExpr} d${variable}`;
        console.log('[WolframMath] Context check:', op, 'of', decl.name, '→ Wolfram query:', query);
        const expected = await queryWolframV2(query);
        if (expected) {
          // expected may be like "4 x^3 - 12 x^2 + 12 x - 4" or prose.
          // Take the first line, which for Wolfram Result pods is the expression.
          const expectedExpr = expected.split('\n')[0].trim();
          const equivalent = await areEquivalent(tutorRhs, expectedExpr);
          if (equivalent === false) {
            // Build a corrected LaTeX. We keep the LHS intact if possible.
            const lhs = latex.includes('=') ? latex.split('=').slice(0, -1).join('=').trim() : '';
            const correctedLatex = lhs
              ? `${lhs} = ${expectedExpr.replace(/\s+/g, ' ')}`
              : expectedExpr;
            const sourceKind = op === 'derivative' ? 'wolfram-derivative' : 'wolfram-integral';
            console.warn(`[WolframMath] Context mismatch. Tutor: "${tutorRhs}", Expected: "${expectedExpr}"`);
            return NextResponse.json({
              correct: false,
              correctedLatex,
              issues: [`${op} of ${decl.name}(${variable}) should be ${expectedExpr}, not ${tutorRhs}`],
              source: sourceKind,
              expected: expectedExpr,
            } satisfies ValidationResult);
          }
          if (equivalent === true) {
            console.log(`[WolframMath] Context check PASSED: ${op} of ${decl.name}(${variable}) = ${tutorRhs}`);
            return NextResponse.json({
              correct: true,
              source: op === 'derivative' ? 'wolfram-derivative' : 'wolfram-integral',
            } satisfies ValidationResult);
          }
          // equivalent === null → inconclusive, fall through to normal path
        }
      }
    }

    // Extract numerical expressions to verify
    const expressions = extractExpressionsFromLatex(latex);
    if (expressions.length < 2) {
      // Need at least 2 parts to verify (formula = result)
      console.log('[WolframMath] Not enough numerical expressions to verify, skipping');
      return NextResponse.json({ correct: true, source: 'skipped' });
    }

    // Try Wolfram first — verify the last expression equals the second-to-last
    const issues: string[] = [];
    let wolframSucceeded = false;
    let anyPairAttempted = false;

    // Check pairs: does expression[i] equal expression[i+1]?
    for (let i = 0; i < expressions.length - 1; i++) {
      const left = expressions[i];
      const right = expressions[i + 1];

      // Symbolic short-circuit: if neither side contains a digit (or they
      // are the identical symbolic expression), Wolfram can't evaluate —
      // skip instead of reporting a spurious mismatch. Catches false
      // positives like "P_1 V_1 ≈ P_1 V_1 but P_2 V_2 ≈ P_2 V_2 (mismatch)".
      const leftHasDigit = /\d/.test(left);
      const rightHasDigit = /\d/.test(right);
      if (!leftHasDigit && !rightHasDigit) {
        console.log(`[WolframMath] Skipping symbolic pair (no digits): "${left}" vs "${right}"`);
        continue;
      }
      if (left.replace(/\s+/g, '') === right.replace(/\s+/g, '')) {
        console.log(`[WolframMath] Skipping identical pair: "${left}"`);
        continue;
      }

      // Asymmetric-variable short-circuit (2026-05-23): when one side
      // contains a symbolic variable (a letter that isn't a known math
      // function/constant) and the other is purely numeric, Wolfram
      // can't equate them — the variable side evaluates to itself
      // ("3x" → "3 x") and the numeric side resolves ("20 - 5" → "15"),
      // producing a guaranteed false-positive mismatch report. Observed
      // in the 2026-05-23 opener-merge-stress session: brain rendered
      // "3x = 20 - 5 = 15" (a correct step in solving the linear
      // equation, NOT a numeric equality claim), Wolfram returned
      // "3x ≈ 3 x but 20 - 5 ≈ 15 (mismatch)" after a 4.6s round-trip.
      // The new step asks the student to solve for x — verifying that
      // "3x equals 15" is the student's job, not Wolfram's. Skip the
      // pair instead of round-tripping for a guaranteed-false answer.
      const stripFnConst = (s: string): string =>
        s
          .replace(
            /\\(sin|cos|tan|sec|csc|cot|arcsin|arccos|arctan|sinh|cosh|tanh|log|ln|exp|sqrt|cdot|times|div|frac|pi|theta|alpha|beta|gamma|delta|epsilon|zeta|eta|lambda|mu|nu|xi|rho|sigma|tau|phi|chi|psi|omega|sum|prod|int|infty|partial|nabla|leq|geq|neq|approx|equiv|forall|exists|in|notin|subset|supset|cup|cap|emptyset|degree|circ)\b/gi,
            '',
          )
          .replace(/\\text\{[^}]*\}/g, '');
      const leftHasSymbolicVar = /[a-zA-Z]/.test(stripFnConst(left));
      const rightHasSymbolicVar = /[a-zA-Z]/.test(stripFnConst(right));
      if (leftHasSymbolicVar !== rightHasSymbolicVar) {
        console.log(
          `[WolframMath] Skipping asymmetric symbolic pair: "${left}" vs "${right}" (one side has a variable, the other is purely numeric — can't be equated)`,
        );
        continue;
      }

      anyPairAttempted = true;
      // Evaluate each side
      const leftResult = await queryWolframShort(`evaluate ${left}`);
      const rightResult = await queryWolframShort(`evaluate ${right}`);

      if (leftResult !== null && rightResult !== null) {
        wolframSucceeded = true;
        const leftNum = parseWolframNumeric(leftResult);
        const rightNum = parseWolframNumeric(rightResult);

        if (!isNaN(leftNum) && !isNaN(rightNum)) {
          // Allow 1% tolerance for rounding
          const tolerance = Math.max(Math.abs(leftNum) * 0.01, 0.1);
          if (Math.abs(leftNum - rightNum) > tolerance) {
            issues.push(`${left} ≈ ${leftResult} but ${right} ≈ ${rightResult} (mismatch)`);
          } else {
            console.log(`[WolframMath] Verified: ${left} ≈ ${leftResult} ≈ ${right}`);
          }
        }
      }
    }

    if (wolframSucceeded) {
      console.log(`[WolframMath] Wolfram validation complete. Issues: ${issues.length > 0 ? issues.join('; ') : 'none'}`);
      return NextResponse.json({
        correct: issues.length === 0,
        issues: issues.length > 0 ? issues : undefined,
        source: 'wolfram',
      } satisfies ValidationResult);
    }

    // No numeric pair was worth sending to Wolfram — the latex is purely
    // symbolic (e.g. a formula template like A^-1 = (1/det(A)) adj(A)).
    // Claude can't verify such formulas against ground truth anyway, and a
    // 10s round-trip here used to block the whiteboard on symbolic emissions.
    // Return skipped instead.
    if (!anyPairAttempted) {
      console.log('[WolframMath] All pairs symbolic — skipping Claude fallback (nothing to verify)');
      return NextResponse.json({ correct: true, source: 'skipped' } satisfies ValidationResult);
    }

    // Wolfram failed — fall back to Claude
    console.log('[WolframMath] Wolfram unavailable, falling back to Claude');
    const claudeResult = await validateViaClaude(latex, label, conversationContext);
    return NextResponse.json(claudeResult);
  } catch (error) {
    console.error('[WolframMath] Error:', error);
    return NextResponse.json({ correct: true, source: 'skipped', error: 'Validation failed' });
  }
}
