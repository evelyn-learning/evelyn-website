/**
 * Tests for the variable-continuity helpers (validation/continuity.ts).
 *
 * R34 (session-1784833891496): the unanchored DECL_PATTERN matched a
 * mid-latex solution step ("… \Rightarrow x = \pm 2") and declared the
 * FUNCTION x; the rename pass then rewrote the brain's correct f''(x) into
 * the self-application x''(x) on the board.
 *
 * Usage: npx tsx scripts/test-continuity.ts  (npm run test:continuity)
 */
import {
  extractDeclarations,
  normalizeRenamedFunction,
  harvestPreNormalizationDeclarations,
  isTryAloneRequest,
} from '../src/lib/tutor/validation/continuity';
import type { DeclaredFunction } from '../src/lib/tutor/validation/continuity';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const decl = (name: string, argVar = 'x'): DeclaredFunction =>
  ({ name, argVar, body: '', declaredAt: 0 });

// ─── extractDeclarations ───
check('f(x) = … declares f', extractDeclarations('f(x) = -x^3 + 12x - 1')[0]?.name === 'f');
check("g'(x) = … declares g'", extractDeclarations("g'(x) = 2x")[0]?.name === "g'");
check('y = … declares y', extractDeclarations('y = x^2')[0]?.name === 'y');
check('mid-latex solution step does NOT declare (anchored)',
  extractDeclarations("f'(x) = -3x^2 + 12 = 0 \\Rightarrow x^2 = 4 \\Rightarrow x = \\pm 2")[0]?.name === "f'");
check('bare "x = …" declares NOTHING (solved variable, not a function)',
  extractDeclarations('x = \\pm 2').length === 0);
check('x(t) = … (explicit arg) still declares x',
  extractDeclarations('x(t) = t^2')[0]?.name === 'x');
check('sin(x) = … not a declaration… declares nothing single-letter-wise',
  extractDeclarations('\\sin(x) = 0.5').length === 0);

// ─── normalizeRenamedFunction ───
const renamed = normalizeRenamedFunction("g'(x) = 2x", [decl('f')]);
check("legit drift g'→f' still normalized", renamed.changed && renamed.latex.includes("f'(x)"));

// The R34 bug shape: even if state says the declared base is "x", never
// rewrite a name INTO its own argument.
const selfApp = normalizeRenamedFunction("f''(x) = -6x", [decl('x')]);
check('self-application guard: f\'\'(x) with declared "x" left untouched',
  !selfApp.changed && selfApp.latex === "f''(x) = -6x", selfApp.latex);

const multi = normalizeRenamedFunction("g'(x) = 2x", [decl('f'), decl('h')]);
check('multiple declared bases → no rename (ambiguous)', !multi.changed);

const already = normalizeRenamedFunction("f(x) = x^2", [decl('f')]);
check('matching name untouched', !already.changed);

// R58 regression (session portal-d9e1b2d6, 2026-08-27): "P(x) \approx f(x)
// near x = 0" was rewritten to the tautology "P(x) ≈ P(x)" — the canonical
// base P appears in the SAME latex beside f, which is the signal that the
// two names are a deliberate two-function relation, not a drift.
const coPresent = normalizeRenamedFunction('P(x) \\approx f(x) \\text{ near } x = 0', [decl('P')]);
check('canonical base co-present in latex → no rename (two-function relation)',
  !coPresent.changed && coPresent.latex.includes('f(x)'), coPresent.latex);
const coPresentPrimes = normalizeRenamedFunction("P'(x) = f'(x)", [decl('P')]);
check('co-presence guard holds for primed uses too',
  !coPresentPrimes.changed, coPresentPrimes.latex);

// ─── R42 regression: pre-normalization declaration harvest ───
// (session portal-cb2addf5, 2026-08-10 — 24 renames in one session, all
// collapsing to the wrong name because a metaphor \text{} card locked in
// "h" as the sole declared base and every REAL new function afterward got
// silently renamed to it before it could register.)
{
  // \text{}-RHS metaphor card alone → no canonical base registers.
  const textOnly = extractDeclarations('h(t) = \\text{height of the drone at time } t');
  check('\\text{} card alone → no canonical base', textOnly.length === 0, JSON.stringify(textOnly));

  // Simulate the VTR pipeline order fix: harvest-then-normalize, per card,
  // exactly as VoiceTutorRealtime's normalize pass now does.
  let declared: DeclaredFunction[] = [];
  const process = (latex: string) => {
    declared = harvestPreNormalizationDeclarations(latex, declared);
    return normalizeRenamedFunction(latex, declared);
  };

  // Metaphor h-card first — contributes nothing (no canonical base).
  const hCard = process('h(t) = \\text{height of the drone at time } t');
  check('metaphor h-card is left untouched', !hCard.changed, hCard.latex);
  check('metaphor h-card does not become a canonical base', declared.length === 0, JSON.stringify(declared));

  // Genuinely new declaration g(x) = x^2 e^{3x} — must survive unrenamed
  // (there was no real declared base yet) and register.
  const gCard = process('g(x) = x^2 e^{3x}');
  check('new declaration g survives (not renamed to h)', !gCard.changed && gCard.latex.includes('g(x)'), gCard.latex);
  check('g registers as a declared base', declared.some(d => d.name === 'g'), JSON.stringify(declared));

  // A second new declaration k(x) = sin(x^2) after g — multi-base session;
  // normalization must be disabled (the OLD bug: this would have been
  // rewritten to g(x) since g was the sole declared base at rename time).
  const kCard = process('k(x) = \\sin(x^2)');
  check('k(x) after g survives (multi-base disables normalization)', !kCard.changed && kCard.latex.includes('k(x)'), kCard.latex);
  check('declared bases are now multi (g, k)', declared.filter(d => !d.name.includes("'")).length === 2, JSON.stringify(declared));

  // A PRIMED usage of an already-declared base must still be left to the
  // original drift-correction mechanism — harvestPreNormalizationDeclarations
  // must not itself register primed forms as new bases (that job belongs
  // to normalizeRenamedFunction's rename pass, tested above).
  let singleBase: DeclaredFunction[] = [decl('f')];
  const primedHarvest = harvestPreNormalizationDeclarations("g'(x) = 2x", singleBase);
  check('primed declaration-shaped latex is NOT harvested as a new base', primedHarvest === singleBase || primedHarvest.length === 1, JSON.stringify(primedHarvest));
}

// ─── isTryAloneRequest (round 29 — hands-off mode) ───
{
  const yes = [
    'I think it would be better if I work through them on my own instead of you guiding me.',
    "Don't guide me, I want to try on my own.",
    'Let me try this one first.',
    'Can I do it by my own?',
    'Stop helping for a second, I want to solve it without your hints.',
    "I'll figure it out myself.",
  ];
  const no = [
    'Can you walk me through it?',
    'I own a calculator.',
    'What do I do next?',
    'My own teacher taught me differently.',
    'Show me how to do it.',
  ];
  for (const s of yes) check(`try-alone YES: "${s.slice(0, 40)}…"`, isTryAloneRequest(s), s);
  for (const s of no) check(`try-alone NO: "${s.slice(0, 40)}…"`, !isTryAloneRequest(s), s);
  // Walk-through phrases must not double-fire as try-alone and vice versa.
  check('walk-through not try-alone', !isTryAloneRequest('Walk me through it step by step.'));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
