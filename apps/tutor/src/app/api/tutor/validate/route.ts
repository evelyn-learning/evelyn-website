/**
 * Unified validator dispatcher.
 *
 * Single endpoint that routes by `domain` field to the appropriate
 * validator. Consistent response shape: {correct, expected?, issues?, source}.
 *
 * New validators plug in by adding a case. Existing standalone routes
 * (validate-math-wolfram, validate-graph-wolfram, validate-tool-call) remain
 * for backward compatibility; this dispatcher is the go-forward interface.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkBalance, suggestSmallIntegerBalance } from '@/lib/tutor/validation/chemistry';
import { checkFormulaDimensions, checkAgainstUnit } from '@/lib/tutor/validation/dimensional';
import { canonicalize, smilesEquivalent, validateSmilesName } from '@/lib/tutor/validation/smiles';
import { runJsSandbox, type TestCase } from '@/lib/tutor/validation/code-sandbox';
import { extractNumericClaims, verifyNumericClaim } from '@/lib/tutor/validation/geometry-numeric';
import { validatePhSet, validateHendersonHasselbalch, validateStrongSolution } from '@/lib/tutor/validation/acid-base';
import { validateCircuitClaim, type CircuitElement } from '@/lib/tutor/validation/circuit';
import { classifyPedigree, type Individual } from '@/lib/tutor/validation/pedigree';
import { checkGrammar } from '@/lib/tutor/validation/language';
import { validateFactClaim } from '@/lib/tutor/validation/wikidata';
import { runSymPyStub, type SymPyRequest } from '@/lib/tutor/validation/sympy-stub';
import {
  classifyGenotype,
  validateGenotypeAssertion,
  monohybridCross,
  canReceiveFrom,
  validateReceiveClaim,
  type BloodType,
} from '@/lib/tutor/validation/biology';

interface ValidateResponse {
  correct: boolean;
  expected?: unknown;
  issues?: string[];
  source: string;
  // Optional freeform data — domain-specific extras (suggested balance, etc.)
  data?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { domain?: string; claim?: unknown; context?: unknown };
    const domain = (body.domain || '').trim();
    if (!domain) {
      return NextResponse.json({
        correct: false,
        issues: ['Missing required "domain" field.'],
        source: 'dispatcher',
      } satisfies ValidateResponse, { status: 400 });
    }

    switch (domain) {
      case 'chemistry-balance': {
        const claim = body.claim as { equation?: string } | undefined;
        const equation = claim?.equation || '';
        if (!equation) {
          return NextResponse.json({ correct: false, issues: ['claim.equation is required'], source: 'chemistry-balance' });
        }
        const result = checkBalance(equation);
        let expected: string | undefined;
        if (!result.balanced) {
          expected = suggestSmallIntegerBalance(equation) || undefined;
        }
        return NextResponse.json({
          correct: result.balanced,
          expected,
          issues: result.issues,
          source: 'chemistry-balance',
          data: {
            leftCounts: result.leftCounts,
            rightCounts: result.rightCounts,
            delta: result.delta,
          },
        } satisfies ValidateResponse);
      }

      case 'dimensional-analysis': {
        const claim = body.claim as { formula?: string; expression?: string; targetUnit?: string } | undefined;
        if (claim?.formula) {
          const r = checkFormulaDimensions(claim.formula);
          return NextResponse.json({
            correct: r.match,
            expected: r.leftDim,
            issues: r.issues,
            source: 'dimensional-analysis',
            data: { leftDim: r.leftDim, rightDim: r.rightDim },
          } satisfies ValidateResponse);
        }
        if (claim?.expression && claim.targetUnit) {
          const r = checkAgainstUnit(claim.expression, claim.targetUnit);
          return NextResponse.json({
            correct: r.match,
            expected: r.expected,
            issues: r.issues,
            source: 'dimensional-analysis',
            data: { computed: r.computed, expected: r.expected },
          } satisfies ValidateResponse);
        }
        return NextResponse.json({
          correct: false,
          issues: ['claim must have either {formula} or {expression, targetUnit}'],
          source: 'dimensional-analysis',
        } satisfies ValidateResponse);
      }

      case 'genetics-notation': {
        const claim = body.claim as { text?: string; genotype?: string } | undefined;
        if (claim?.text) {
          const r = validateGenotypeAssertion(claim.text);
          return NextResponse.json({
            correct: r.correct,
            expected: r.actual,
            issues: r.issues,
            source: 'genetics-notation',
            data: { genotype: r.genotype, actual: r.actual, claimed: r.claimed },
          } satisfies ValidateResponse);
        }
        if (claim?.genotype) {
          const actual = classifyGenotype(claim.genotype);
          return NextResponse.json({
            correct: actual !== 'unknown',
            expected: actual,
            source: 'genetics-notation',
            data: { genotype: claim.genotype, zygosity: actual },
          } satisfies ValidateResponse);
        }
        return NextResponse.json({
          correct: false,
          issues: ['claim must have either {text} or {genotype}'],
          source: 'genetics-notation',
        } satisfies ValidateResponse);
      }

      case 'genetics-punnett': {
        // Validate claimed offspring against canonical cross output.
        const claim = body.claim as { parent1?: string; parent2?: string; offspring?: string[] } | undefined;
        const { parent1, parent2, offspring } = claim || {};
        if (!parent1 || !parent2 || !Array.isArray(offspring)) {
          return NextResponse.json({
            correct: false,
            issues: ['claim must have {parent1, parent2, offspring[]}'],
            source: 'genetics-punnett',
          });
        }
        const expected = monohybridCross(parent1, parent2);
        if (!expected) {
          return NextResponse.json({
            correct: false,
            issues: [`Could not compute cross for ${parent1} × ${parent2} (must be 2-letter allele pairs)`],
            source: 'genetics-punnett',
          });
        }
        // Compare as multisets — genotype strings, order-insensitive, using
        // case-normalized-order form (Pp === pP).
        const canon = (g: string) => {
          if (g.length !== 2) return g;
          const [a, b] = [g[0], g[1]];
          if (a.toLowerCase() === b.toLowerCase() && a !== b) {
            return a === a.toUpperCase() ? a + b : b + a;
          }
          return [a, b].sort().join('');
        };
        const exp = expected.map(canon).sort();
        const got = offspring.map(canon).sort();
        const correct = exp.length === got.length && exp.every((v, i) => v === got[i]);
        return NextResponse.json({
          correct,
          expected,
          issues: correct ? undefined : [
            `Expected offspring: [${expected.join(', ')}]; got: [${offspring.join(', ')}]`,
          ],
          source: 'genetics-punnett',
        } satisfies ValidateResponse);
      }

      case 'blood-type-receive': {
        const claim = body.claim as { recipient?: string; types?: string[] } | undefined;
        if (!claim?.recipient) {
          return NextResponse.json({
            correct: false,
            issues: ['claim must have {recipient, types[]}'],
            source: 'blood-type-receive',
          });
        }
        const types = (claim.types || []) as BloodType[];
        const r = validateReceiveClaim(claim.recipient as BloodType, types);
        return NextResponse.json({
          correct: r.correct,
          expected: r.expected,
          issues: r.correct ? undefined : [
            `${claim.recipient} can receive from: [${r.expected.join(', ')}]`,
            ...(r.missing.length ? [`Missed: ${r.missing.join(', ')}`] : []),
            ...(r.extra.length ? [`Incorrectly included: ${r.extra.join(', ')}`] : []),
          ],
          source: 'blood-type-receive',
        } satisfies ValidateResponse);
      }

      case 'blood-type-lookup': {
        const claim = body.claim as { recipient?: string } | undefined;
        if (!claim?.recipient) {
          return NextResponse.json({
            correct: false,
            issues: ['claim must have {recipient}'],
            source: 'blood-type-lookup',
          });
        }
        const expected = canReceiveFrom(claim.recipient as BloodType);
        return NextResponse.json({
          correct: true,
          expected,
          source: 'blood-type-lookup',
        } satisfies ValidateResponse);
      }

      case 'acid-base-ph': {
        const claim = body.claim as { hConc?: number; ohConc?: number; pH?: number; pOH?: number; temperature?: number };
        const r = validatePhSet(claim);
        return NextResponse.json({
          correct: r.correct,
          expected: r.expected,
          issues: r.issues,
          source: 'acid-base-ph',
        });
      }

      case 'acid-base-henderson': {
        const claim = body.claim as { pH?: number; pKa?: number; aMinus?: number; hA?: number };
        const r = validateHendersonHasselbalch(claim);
        return NextResponse.json({ correct: r.correct, expected: r.expected, issues: r.issues, source: 'acid-base-henderson' });
      }

      case 'acid-base-strong': {
        const claim = body.claim as { type: 'acid' | 'base'; molarity: number; pH?: number };
        const r = validateStrongSolution(claim);
        return NextResponse.json({ correct: r.correct, expected: r.expected, issues: r.issues, source: 'acid-base-strong' });
      }

      case 'circuit': {
        const claim = body.claim as { network: CircuitElement; totalResistance?: number; totalCurrent?: number; totalVoltage?: number };
        if (!claim?.network) {
          return NextResponse.json({ correct: false, issues: ['claim must have {network, ...}'], source: 'circuit' });
        }
        const r = validateCircuitClaim(claim.network, claim);
        return NextResponse.json({
          correct: r.correct,
          expected: r.expected,
          issues: r.issues,
          source: 'circuit',
        });
      }

      case 'pedigree-pattern': {
        const claim = body.claim as { people?: Individual[]; claimedPattern?: string };
        if (!Array.isArray(claim?.people)) {
          return NextResponse.json({ correct: false, issues: ['claim must have {people[], claimedPattern?}'], source: 'pedigree-pattern' });
        }
        const { pattern, evidence, alternativePatterns } = classifyPedigree(claim.people);
        const claimed = claim.claimedPattern;
        if (claimed) {
          const correct = claimed === pattern || alternativePatterns.includes(claimed as never);
          return NextResponse.json({
            correct,
            expected: pattern,
            issues: correct ? undefined : [`Pedigree pattern is ${pattern}, not ${claimed}`],
            source: 'pedigree-pattern',
            data: { evidence, alternativePatterns },
          });
        }
        return NextResponse.json({
          correct: true,
          expected: pattern,
          source: 'pedigree-pattern',
          data: { evidence, alternativePatterns },
        });
      }

      case 'grammar': {
        const claim = body.claim as { text?: string; language?: string };
        if (!claim?.text) {
          return NextResponse.json({ correct: false, issues: ['claim.text required'], source: 'grammar' });
        }
        const r = await checkGrammar(claim.text, { language: claim.language });
        const serious = r.issues.filter(i => i.severity === 'typo' || i.severity === 'grammar');
        return NextResponse.json({
          correct: serious.length === 0,
          issues: serious.slice(0, 5).map(i => `${i.message}${i.suggestion ? ' → "' + i.suggestion + '"' : ''}`),
          source: 'grammar',
          data: { all: r.issues },
        });
      }

      case 'fact': {
        const claim = body.claim as { kind?: 'capital' | 'birth-year' | 'event-year'; subject?: string; claimedValue?: string | number };
        if (!claim?.kind || !claim?.subject || claim.claimedValue === undefined) {
          return NextResponse.json({ correct: false, issues: ['claim must have {kind, subject, claimedValue}'], source: 'fact' });
        }
        const r = await validateFactClaim({ kind: claim.kind, subject: claim.subject, claimedValue: claim.claimedValue });
        return NextResponse.json({
          correct: r.correct,
          expected: r.expected,
          issues: r.issues,
          source: 'fact-wikidata',
        });
      }

      case 'sympy': {
        const r = await runSymPyStub(body.claim as SymPyRequest);
        return NextResponse.json({ correct: r.correct, expected: r.expected, issues: r.issues, source: r.source });
      }

      case 'geometry-numeric': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const claim = body.claim as { text?: string; points?: any[] } | undefined;
        if (!claim?.text || !Array.isArray(claim?.points)) {
          return NextResponse.json({
            correct: false,
            issues: ['claim must have {text, points[]}'],
            source: 'geometry-numeric',
          });
        }
        const claims = extractNumericClaims(claim.text);
        if (claims.length === 0) {
          return NextResponse.json({
            correct: true,
            source: 'geometry-numeric',
            data: { extracted: 0 },
          });
        }
        const allResults = claims.map(c => ({
          claim: c,
          ...verifyNumericClaim(c, claim.points!),
        }));
        const wrong = allResults.filter(r => !r.correct);
        return NextResponse.json({
          correct: wrong.length === 0,
          issues: wrong.length ? wrong.flatMap(r => r.issues || []) : undefined,
          source: 'geometry-numeric',
          data: { checks: allResults },
        } satisfies ValidateResponse);
      }

      case 'code-run': {
        const claim = body.claim as { code?: string; language?: string; tests?: TestCase[]; entryName?: string } | undefined;
        if (!claim?.code || !Array.isArray(claim?.tests)) {
          return NextResponse.json({
            correct: false,
            issues: ['claim must have {code, tests[]} (optional: language, entryName)'],
            source: 'code-run',
          });
        }
        const lang = (claim.language || 'javascript').toLowerCase();
        if (lang !== 'javascript' && lang !== 'js' && lang !== 'typescript' && lang !== 'ts') {
          return NextResponse.json({
            correct: false,
            issues: [`Language "${lang}" not supported in this sandbox. Only JS/TS for now.`],
            source: 'code-run',
          });
        }
        const runResult = runJsSandbox(claim.code, claim.tests, { entryName: claim.entryName });
        const issues: string[] = [];
        if (runResult.compileError) issues.push(`Compile error: ${runResult.compileError}`);
        if (runResult.runtimeError) issues.push(`Runtime error: ${runResult.runtimeError}`);
        if (runResult.timedOut) issues.push(`Timed out (suspected infinite loop).`);
        for (const t of runResult.tests) {
          if (!t.passed) {
            issues.push(t.error
              ? `${t.name}: ${t.error}`
              : `${t.name}: expected ${JSON.stringify(t.expected)}, got ${JSON.stringify(t.actual)}`);
          }
        }
        return NextResponse.json({
          correct: runResult.ok,
          issues: issues.length ? issues : undefined,
          source: 'code-run',
          data: {
            tests: runResult.tests,
            stdout: runResult.stdout,
          },
        } satisfies ValidateResponse);
      }

      case 'chemistry-smiles': {
        const claim = body.claim as { smiles?: string; name?: string; compareTo?: string } | undefined;
        if (!claim?.smiles) {
          return NextResponse.json({
            correct: false,
            issues: ['claim must have {smiles} (optional: name or compareTo)'],
            source: 'chemistry-smiles',
          });
        }
        if (claim.compareTo) {
          const r = await smilesEquivalent(claim.smiles, claim.compareTo);
          return NextResponse.json({
            correct: r.equivalent,
            expected: r.canonicalB,
            issues: r.equivalent ? undefined : [
              `"${claim.smiles}" (canonical ${r.canonicalA}) ≠ "${claim.compareTo}" (canonical ${r.canonicalB})`,
            ],
            source: 'chemistry-smiles',
            data: { canonicalA: r.canonicalA, canonicalB: r.canonicalB },
          } satisfies ValidateResponse);
        }
        if (claim.name) {
          const r = await validateSmilesName(claim.smiles, claim.name);
          return NextResponse.json({
            correct: r.correct,
            expected: r.expected,
            issues: r.issues,
            source: 'chemistry-smiles',
            data: { canonical: r.canonical, expected: r.expected },
          } satisfies ValidateResponse);
        }
        // Just canonicalize
        const canon = await canonicalize(claim.smiles);
        return NextResponse.json({
          correct: canon !== null,
          expected: canon,
          issues: canon === null ? ['SMILES could not be parsed.'] : undefined,
          source: 'chemistry-smiles',
        } satisfies ValidateResponse);
      }

      default:
        return NextResponse.json({
          correct: false,
          issues: [`Unknown domain: "${domain}". Supported: chemistry-balance, chemistry-smiles, acid-base-ph, acid-base-henderson, acid-base-strong, dimensional-analysis, circuit, code-run, genetics-notation, genetics-punnett, blood-type-receive, blood-type-lookup, pedigree-pattern, geometry-numeric, grammar, fact, sympy.`],
          source: 'dispatcher',
        } satisfies ValidateResponse, { status: 400 });
    }
  } catch (err) {
    console.error('[validate dispatcher] error:', err);
    return NextResponse.json({
      correct: false,
      issues: ['Validator threw an error.'],
      source: 'dispatcher',
    } satisfies ValidateResponse, { status: 500 });
  }
}
