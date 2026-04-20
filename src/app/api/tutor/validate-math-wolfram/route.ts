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

interface ValidationRequest {
  latex: string;
  label?: string;
  conversationContext?: string;
}

interface ValidationResult {
  correct: boolean;
  correctedLatex?: string;
  correctedLabel?: string;
  issues?: string[];
  source: 'wolfram' | 'claude' | 'skipped';
}

// Extract numerical expressions from LaTeX for Wolfram evaluation
function extractExpressionsFromLatex(latex: string): string[] {
  const expressions: string[] = [];

  // Look for "= <numerical expression>" patterns
  // e.g., "X_L = \\omega L = 120 \\pi \\times 0.025"
  // We want to verify that the final numerical result matches
  const parts = latex.split('=').map(p => p.trim());

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

export async function POST(request: NextRequest) {
  try {
    const body: ValidationRequest = await request.json();
    const { latex, label, conversationContext } = body;

    if (!latex) {
      return NextResponse.json({ error: 'latex is required' }, { status: 400 });
    }

    console.log(`[WolframMath] Validating: "${latex}" (label: "${label || ''}")`);

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

    // Check pairs: does expression[i] equal expression[i+1]?
    for (let i = 0; i < expressions.length - 1; i++) {
      const left = expressions[i];
      const right = expressions[i + 1];

      // Evaluate each side
      const leftResult = await queryWolframShort(`evaluate ${left}`);
      const rightResult = await queryWolframShort(`evaluate ${right}`);

      if (leftResult !== null && rightResult !== null) {
        wolframSucceeded = true;
        const leftNum = parseFloat(leftResult.replace(/[^0-9.\-]/g, ''));
        const rightNum = parseFloat(rightResult.replace(/[^0-9.\-]/g, ''));

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

    // Wolfram failed — fall back to Claude
    console.log('[WolframMath] Wolfram unavailable, falling back to Claude');
    const claudeResult = await validateViaClaude(latex, label, conversationContext);
    return NextResponse.json(claudeResult);
  } catch (error) {
    console.error('[WolframMath] Error:', error);
    return NextResponse.json({ correct: true, source: 'skipped', error: 'Validation failed' });
  }
}
