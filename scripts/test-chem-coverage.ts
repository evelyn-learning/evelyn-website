/**
 * Chemistry-notation coverage sweep (2026-07-17, follows the round-24 math
 * pattern in test-math-coverage.ts and the physics sweep in
 * test-physics-coverage.ts — same choke points, chemistry taxonomy).
 *
 * Two layers over the surfaces every chemistry expression funnels through
 * (TTS: rewriteForTTS → Cartesia; display: segment/looksLikeMath →
 * InlineMathText/KaTeX in bubbles, cards, captions, Q-pin):
 *
 *  1. CURATED pins — hand-verified exact expected outputs per taxonomy
 *     category: molecular formulas, ion charges, isotopes, reaction and
 *     equilibrium arrows, aggregation states, concentration brackets,
 *     thermodynamics (ΔH°/naught), molarity + chem units, orbitals.
 *  2. GENERATED stress corpus — a grammar composes chemistry wrappers
 *     (coefficients, + reactants, \to / \rightleftharpoons, states,
 *     charges, [conc], isotopes, K-expressions, units, sci notation)
 *     to depth 3, asserting the same invariants as the math/physics sweeps:
 *       T1 zero LaTeX residue in TTS output (\ ^ _ { } $)
 *       T2 speakable charset (letters/digits/space/basic punctuation)
 *       T3 no stray apostrophe survives
 *       T4 idempotence: rewriting the output changes nothing
 *       D1 the $-span classifies as math (looksLikeMath/segment)
 *       D2 the span body parses in KaTeX
 *
 * Conventions established by this harness (the fix-wave contract):
 *   - A $-span that looks like CHEMISTRY (element formulas w/ subscripts,
 *     ion charges, ⇌/\rightleftharpoons, (aq|s|l|g) states, [conc]
 *     brackets, isotope superscripts, named K-constants, orbital runs)
 *     routes through a chemistry rewrite instead of the math pipeline:
 *       · subscripts speak as PLAIN digits/letters ("H 2 O", "K s p"),
 *         never "sub" — nobody says "H sub 2 O";
 *       · \to / → speak "yields" (math spans keep "approaches");
 *         ⇌ / \rightleftharpoons speak "is in equilibrium with"
 *         unconditionally (the harpoon glyph has no math meaning);
 *       · trailing-sign superscripts are ION CHARGES ("2 minus", "plus"),
 *         leading-sign superscripts stay exponents ("to the minus 19");
 *       · (aq)/(s)/(l)/(g) speak aqueous/solid/liquid/gas;
 *       · [X] speaks "the concentration of X";
 *       · {}^{14}C-style nuclide superscripts speak "carbon 14" (common
 *         element names; atomic number dropped, as chemists say it);
 *       · mixed-case element runs are spelled out with SPOKEN letter
 *         names ("NaCl" → "en ay see el", never "nackle"; bare capitals
 *         would re-anchor the prose unit pass — "2 N" → newtons — so the
 *         names are emitted directly); pure-caps runs (CO, NH, HA) stay
 *         joined — Cartesia letter-reads those already.
 *   - A chem span suppresses the prose-ambiguous single-letter UNITS that
 *     collide with element symbols (N, C, K, F) — "2C" in a formula is
 *     two carbons, never coulombs. Unambiguous units (mol/L, g/mol, kJ/mol,
 *     M-molar, mL, mmHg, ppm) speak everywhere the physics rules allow.
 *   - Bare single-capital-with-subscript ("$O_2$" alone, "$F_2$") is
 *     genuinely ambiguous with math ("F sub 2" the force) — it stays MATH
 *     unless a chem signal (coefficient, second element, arrow, state,
 *     charge) accompanies it. Documented, deliberate.
 *   - \ce{...} (mhchem) is NOT supported — KaTeX here has no mhchem, and
 *     the brain is prompted toward plain LaTeX. The in-span residual sweep
 *     degrades it gracefully (command deleted, interior letters survive).
 *
 * KNOWN_GAPS records triaged-but-deferred shapes; a gap that starts
 * passing must graduate to a pin. Everything else must pass — exit 1
 * otherwise.
 *
 * Run: npm run test:chem-coverage
 *      npx tsx scripts/test-chem-coverage.ts --dump
 */
import { rewriteForTTS } from '../apps/marketing/src/lib/tutor/voice/tts-pronunciation';
import { segment } from '../apps/marketing/src/lib/tutor/whiteboard/inline-math';
import katex from 'katex';

const DUMP = process.argv.includes('--dump');
let pass = 0;
let fail = 0;
const failures: string[] = [];
function check(name: string, cond: boolean, detail?: string): void {
  if (cond) { pass++; }
  else {
    fail++;
    failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
    console.error(`\x1b[31mFAIL\x1b[0m ${name}${detail ? `\n    ${detail}` : ''}`);
  }
}

// ── Shared probes ──────────────────────────────────────────────────────
/** TTS a math body inside a neutral spoken frame (the frame itself contains
 *  no math, digits, or apostrophes, so anything suspicious in the output
 *  came from the span). */
function speak(body: string): string {
  return rewriteForTTS(`so $${body}$ here.`);
}
const RESIDUE_RE = /[\\^_{}$]/;
// Frame words + verbalizer/unit vocabulary are all plain; ° √ × ± | Ω ⇌ →
// ⁺ ₂ etc. in the output mean a symbol leaked past the pipeline.
const SPEAKABLE_RE = /^[A-Za-z0-9 .,;:()\-]+$/;

function mathParts(text: string): string[] {
  return segment(text).filter((p) => p.kind === 'math').map((p) => p.body);
}
function katexParses(body: string): boolean {
  try {
    katex.renderToString(body, { throwOnError: true, strict: false, trust: true });
    return true;
  } catch {
    return false;
  }
}

// ── Layer 1: curated exact pins ────────────────────────────────────────
function tts(input: string, want: string, name: string): void {
  const got = rewriteForTTS(input);
  if (DUMP) { console.log(`TTS  ${name}\n  in:   ${input}\n  got:  ${got}${got === want ? '' : `\n  want: ${want}`}`); }
  check(`tts: ${name}`, got === want, `in:   ${input}\n    got:  ${got}\n    want: ${want}`);
}
function disp(body: string, name: string): void {
  const parts = mathParts(`We need $${body}$ to continue.`);
  check(`disp-math: ${name}`, parts.length === 1 && parts[0] === body, `span "$${body}$" segmented as ${JSON.stringify(parts)}`);
  check(`disp-katex: ${name}`, katexParses(body), `KaTeX failed to parse "${body}"`);
}
function dispProse(text: string, name: string): void {
  check(`disp-prose: ${name}`, mathParts(text).length === 0, `"${text}" produced math segments ${JSON.stringify(mathParts(text))}`);
}

// ── Layer 2: generated stress corpus ───────────────────────────────────
type Wrap = { key: string; fn: (e: string) => string };
const LEAVES = ['H_2O', 'Na^+', 'CO_2', 'O_2'];
const WRAPS: Wrap[] = [
  { key: 'coeff', fn: (e) => `2${e}` },
  { key: 'plus', fn: (e) => `${e} + O_2` },
  { key: 'yields', fn: (e) => `${e} \\to CO_2` },
  { key: 'yieldsL', fn: (e) => `CO_2 \\to ${e}` },
  { key: 'equil', fn: (e) => `${e} \\rightleftharpoons H_2O` },
  { key: 'stateg', fn: (e) => `${e}(g)` },
  { key: 'stateaq', fn: (e) => `${e}(aq)` },
  { key: 'conc', fn: (e) => `[${e}]` },
  { key: 'charge', fn: (e) => `(${e})^{2-}` },
  { key: 'iso', fn: (e) => `{}^{14}C + ${e}` },
  { key: 'frac', fn: (e) => `K_a = \\frac{${e}}{[HA]}` },
  { key: 'unitmol', fn: (e) => `${e} \\, \\text{mol/L}` },
  { key: 'unitM', fn: (e) => `${e} \\, \\text{M}` },
  { key: 'sci', fn: (e) => `${e} \\times 10^{23}` },
  { key: 'dH', fn: (e) => `\\Delta H = ${e}` },
  { key: 'Ksp', fn: (e) => `K_{sp} = ${e}` },
  { key: 'nacl', fn: (e) => `NaCl(aq) + ${e}` },
  { key: 'orb', fn: (e) => `1s^2 2s^2 (${e})` },
];

/** Which invariants a generated case is EXPECTED to fail today. Keyed by
 *  wrapper-path prefix ("outer>inner>leaf" starts-with match) + invariant. */
const KNOWN_GAPS: Array<{ match: RegExp; invariant: 'T1' | 'T2' | 'T3' | 'T4' | 'D1' | 'D2'; reason: string }> = [
];
function gapFor(path: string, invariant: string): { reason: string } | undefined {
  return KNOWN_GAPS.find((g) => g.invariant === invariant && g.match.test(path));
}

interface StressResult { total: number; bad: number; gapHits: number; staleGaps: string[] }
function runStress(depth: number): StressResult {
  const res: StressResult = { total: 0, bad: 0, gapHits: 0, staleGaps: [] };
  const seenGapEntries = new Set<number>();
  const perKey = new Map<string, number>();
  const firstFailures: string[] = [];

  function visit(body: string, path: string): void {
    res.total++;
    const spoken = speak(body);
    const inv: Array<[string, boolean, string]> = [
      ['T1', !RESIDUE_RE.test(spoken), `residue in "${spoken}"`],
      ['T2', SPEAKABLE_RE.test(spoken), `unspeakable char in "${spoken}"`],
      ['T3', !/[A-Za-z]'/.test(spoken) && !spoken.includes("'"), `apostrophe in "${spoken}"`],
      ['T4', rewriteForTTS(spoken) === spoken, `not idempotent: "${spoken}" → "${rewriteForTTS(spoken)}"`],
      ['D1', mathParts(`We need $${body}$ now.`).length === 1, `span not classified math`],
      ['D2', katexParses(body), `KaTeX parse failure`],
    ];
    for (const [invName, ok, detail] of inv) {
      const gap = gapFor(path, invName);
      if (gap) {
        const idx = KNOWN_GAPS.findIndex((g) => g.invariant === invName && g.match.test(path));
        seenGapEntries.add(idx);
        if (ok) res.staleGaps.push(`${invName} ${path} — gap "${gap.reason}" now PASSES: graduate it`);
        else res.gapHits++;
        continue;
      }
      if (!ok) {
        res.bad++;
        const k = `${invName}:${path.split('>')[0]}`;
        perKey.set(k, (perKey.get(k) ?? 0) + 1);
        if (firstFailures.length < 40) firstFailures.push(`${invName} [${path}] $${body}$ — ${detail}`);
      }
    }
  }

  function enumerate(e: string, path: string, d: number): void {
    if (d === 0) { visit(e, path); return; }
    for (const w of WRAPS) {
      const wrapped = w.fn(e);
      if (wrapped.length > 90) continue;
      visit(wrapped, `${w.key}>${path}`);
      if (d > 1) enumerate(wrapped, `${w.key}>${path}`, d - 1);
    }
  }

  for (const leaf of LEAVES) enumerate(leaf, leaf, depth);

  if (firstFailures.length) {
    console.error(`\nStress failures (first ${firstFailures.length}):`);
    for (const f of firstFailures) console.error(`  ${f}`);
    console.error(`\nFailure counts by invariant:outer-wrapper:`);
    for (const [k, n] of [...perKey.entries()].sort((a, b) => b[1] - a[1])) console.error(`  ${k}: ${n}`);
  }
  for (let i = 0; i < KNOWN_GAPS.length; i++) {
    if (!seenGapEntries.has(i)) res.staleGaps.push(`KNOWN_GAPS[${i}] (${KNOWN_GAPS[i].reason}) matched no case — remove or fix the matcher`);
  }
  return res;
}

// ── Main ───────────────────────────────────────────────────────────────
runCurated();
const stress = runStress(3);
console.log(`\nstress: ${stress.total} cases, ${stress.bad} invariant failures, ${stress.gapHits} known-gap hits`);
for (const s of stress.staleGaps) { check(`stale gap: ${s}`, false); }
if (stress.bad > 0) { fail += 1; failures.push(`${stress.bad} stress invariant failures`); }

console.log(`\nchem-coverage: ${pass} passed, ${fail} failed (curated), stress bad=${stress.bad}`);
if (fail > 0 || stress.bad > 0) process.exit(1);

// CURATED_SECTIONS: runCurated is defined at the bottom so the category
// blocks read top-to-bottom in taxonomy order without hoisting surprises.
function runCurated(): void {
  // ── 1. Molecular formulas (LaTeX subscripts, in spans) ───────────
  tts('Water is $H_2O$ everywhere.', 'Water is H 2 O everywhere.', 'water-formula');
  tts('It releases $CO_2$ quickly.', 'It releases CO 2 quickly.', 'co2-formula');
  tts('Table salt is $NaCl$ chemically.', 'Table salt is en ay see el chemically.', 'nacl-spelled');
  tts('Glucose is $C_6H_{12}O_6$ overall.', 'Glucose is C 6 H 12 O 6 overall.', 'glucose-formula');
  tts('Ammonia is $NH_3$ here.', 'Ammonia is NH 3 here.', 'ammonia-formula');
  tts('Wrapped form $\\text{H}_2\\text{O}$ reads the same.', 'Wrapped form H 2 O reads the same.', 'text-wrapped-formula');

  // ── 2. Unicode formulas in prose ─────────────────────────────────
  tts('Burning makes CO₂ and H₂O together.', 'Burning makes CO 2 and H 2 O together.', 'unicode-prose-formulas');

  // ── 3. Ion charges ───────────────────────────────────────────────
  tts('The sodium ion is $Na^+$ here.', 'The sodium ion is sodium plus here.', 'na-plus-span');
  tts('Chloride is $Cl^-$ here.', 'Chloride is see el minus here.', 'cl-minus-span');
  tts('Sulfate is $SO_4^{2-}$ here.', 'Sulfate is SO 4 2 minus here.', 'sulfate-charge');
  tts('Calcium ion $Ca^{2+}$ forms.', 'Calcium ion see ay 2 plus forms.', 'calcium-2plus');
  // Prose unicode charges: Na⁺/K⁺ keep the round-15 element expansion
  // (charge consumed — "the sodium ion" reads best); other tokens speak
  // the sign ("OH minus", "e minus").
  tts('The Na⁺ and K⁺ ions swap.', 'The sodium and potassium ions swap.', 'prose-na-k-ions');
  tts('Hydroxide OH⁻ raises pH nicely.', 'Hydroxide OH minus raises pH nicely.', 'prose-oh-minus');
  tts('An electron e⁻ leaves.', 'An electron e minus leaves.', 'prose-electron');

  // ── 4. Isotopes ──────────────────────────────────────────────────
  tts('Dating uses ${}^{14}C$ decay.', 'Dating uses carbon 14 decay.', 'carbon-14');
  tts('Fission splits $^{235}U$ atoms.', 'Fission splits uranium 235 atoms.', 'uranium-235');
  tts('Full form ${}^{14}_{6}C$ shows both.', 'Full form carbon 14 shows both.', 'nuclide-drops-Z');
  tts('Carbon-14 decays slowly.', 'Carbon-14 decays slowly.', 'prose-isotope-name-guard');

  // ── 5. Reaction + equilibrium arrows ─────────────────────────────
  tts('Combustion gives $2H_2 + O_2 \\to 2H_2O$ overall.', 'Combustion gives 2H 2 plus O 2 yields 2H 2 O overall.', 'combustion-yields');
  tts('Haber runs $N_2 + 3H_2 \\rightleftharpoons 2NH_3$ at pressure.', 'Haber runs N 2 plus 3H 2 is in equilibrium with 2NH 3 at pressure.', 'haber-equilibrium');
  tts('So 2H₂ + O₂ → 2H₂O balances.', 'So 2H 2 + O 2 yields 2H 2 O balances.', 'prose-glyph-yields');
  tts('Also A → B stays as is.', 'Also A approaches B stays as is.', 'prose-arrow-math-guard');
  tts('Weak acids sit HA ⇌ H⁺ + A⁻ in water.', 'Weak acids sit HA is in equilibrium with H plus + A minus in water.', 'prose-harpoon');
  tts('Precipitation gives $Ag^+ + Cl^- \\to AgCl(s)$ every time.', 'Precipitation gives ay jee plus plus see el minus yields ay jee see el solid every time.', 'ionic-equation');

  // ── 6. Aggregation states ────────────────────────────────────────
  tts('Dissolving $NaCl(aq)$ conducts.', 'Dissolving en ay see el aqueous conducts.', 'state-aqueous');
  tts('Water $H_2O(l)$ stays liquid.', 'Water H 2 O liquid stays liquid.', 'state-liquid');
  tts('Rust forms $2Fe(s) + O_2(g) \\to 2FeO(s)$ slowly.', 'Rust forms 2 ef ee solid plus O 2 gas yields 2 ef ee oh solid slowly.', 'states-in-reaction');

  // ── 7. Concentration brackets + equilibrium constants ────────────
  tts('Acidity uses $[H^+]$ directly.', 'Acidity uses the concentration of H plus directly.', 'concentration-brackets');
  tts('The constant $K_a = \\frac{[H^+][A^-]}{[HA]}$ measures strength.', 'The constant K A equals the concentration of H plus times the concentration of A minus over the concentration of HA measures strength.', 'ka-expression');
  tts('Here $pH = -\\log[H^+]$ defines acidity.', 'Here pH equals minus log the concentration of H plus defines acidity.', 'ph-definition');
  tts('Solubility uses $K_{sp} = 1.1 \\times 10^{-10}$ here.', 'Solubility uses K s p equals 1.1 times 10 to the minus 10 here.', 'ksp-sci');
  tts('Compare pKa values often.', 'Compare pKa values often.', 'pka-identity-guard');

  // ── 8. Thermodynamics ────────────────────────────────────────────
  tts('Enthalpy is $\\Delta H = -286 \\, \\text{kJ/mol}$ here.', 'Enthalpy is Delta H equals minus 286 kilojoules per mole here.', 'delta-h-kj-mol');
  tts('Standard enthalpy $\\Delta H^\\circ = -286 \\, \\text{kJ/mol}$ applies.', 'Standard enthalpy Delta H naught equals minus 286 kilojoules per mole applies.', 'delta-h-naught-span');
  tts('The value ΔG° drops here.', 'The value Delta G naught drops here.', 'delta-g-naught-prose');
  tts('It reads E° = 1.10 V for the cell.', 'It reads E naught equals 1.10 volts for the cell.', 'e-naught-cell');

  // ── 9. Molarity + chem units ─────────────────────────────────────
  tts('Concentration is $0.5 \\, \\text{M}$ today.', 'Concentration is 0.5 molar today.', 'molar-span');
  tts('The solution is 0.5 M today.', 'The solution is 0.5 M today.', 'prose-M-guard');
  tts('Molar mass of water is 18 g/mol exactly.', 'Molar mass of water is 18 grams per mole exactly.', 'g-per-mol');
  tts('Bond energy is 498 kJ/mol there.', 'Bond energy is 498 kilojoules per mole there.', 'kj-per-mol-prose');
  tts('Add 250 mL of solution now.', 'Add 250 milliliters of solution now.', 'milliliters');
  tts('Pressure reads 760 mmHg at sea level.', 'Pressure reads 760 millimeters of mercury at sea level.', 'mmhg');
  tts('Lead levels hit 15 ppm there.', 'Lead levels hit 15 parts per million there.', 'ppm');
  tts('Density is 1.0 g/cm³ for water.', 'Density is 1.0 grams per cubic centimeter for water.', 'g-per-cm3');
  tts('Avogadro counts $6.022 \\times 10^{23}$ particles.', 'Avogadro counts 6.022 times 10 to the 23 particles.', 'avogadro-regression');

  // ── 10. Orbitals ─────────────────────────────────────────────────
  tts('Neon is 1s² 2s² 2p⁶ fully.', 'Neon is 1 s 2 2 s 2 2 p 6 fully.', 'orbitals-prose-glyph');
  tts('Config $1s^2 2s^2 2p^6$ fills shells.', 'Config 1 s 2 2 s 2 2 p 6 fills shells.', 'orbitals-span-caret');

  // ── 11. Hydrates ─────────────────────────────────────────────────
  tts('Hydrate $CuSO_4 \\cdot 5H_2O$ holds water.', 'Hydrate see you ess oh 4 dot 5H 2 O holds water.', 'hydrate-dot');

  // ── 12. Guards (prose must stay prose) ───────────────────────────
  tts('Take vitamin C daily.', 'Take vitamin C daily.', 'vitamin-c-guard');
  tts('The class raised 300 K for charity.', 'The class raised 300 K for charity.', 'prose-K-guard');
  tts('It costs $5 and the lab fee is $10.', 'It costs $5 and the lab fee is $10.', 'currency-tts-guard');

  // ── 13. Display: chem spans classify + parse ─────────────────────
  disp('H_2O', 'water-display');
  disp('\\text{CO}_2', 'co2-text-display');
  disp('Na^+', 'na-plus-display');
  disp('SO_4^{2-}', 'sulfate-display');
  disp('2H_2 + O_2 \\to 2H_2O', 'reaction-display');
  disp('N_2 + 3H_2 \\rightleftharpoons 2NH_3', 'equilibrium-display');
  disp('K_a = \\frac{[\\text{H}^+][\\text{A}^-]}{[\\text{HA}]}', 'ka-display');
  disp('{}^{14}\\text{C}', 'isotope-display');
  disp('\\Delta H^\\circ = -286 \\, \\text{kJ/mol}', 'delta-h-display');
  disp('[H^+]', 'concentration-display');
  disp('0.5 \\, \\text{M}', 'molar-display');
  disp('NaCl(aq)', 'nacl-state-display');
  disp('1s^2 2s^2 2p^6', 'orbital-display');
  disp('CuSO_4 \\cdot 5H_2O', 'hydrate-display');
  dispProse('It costs $5 and the lab fee is $10.', 'currency-guard-chem');
}
