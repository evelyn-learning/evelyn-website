/**
 * Subject-notation coverage sweep (2026-07-18) — the thin-surface tail
 * after the math/physics/chem sweeps. Three domains whose notation gaps
 * are real but too small each to warrant a full 20k-case harness, so they
 * share one: GENETICS (Punnett crosses, sex-linked alleles, N-part
 * phenotype ratios), ECONOMICS (LaTeX literal escapes \% \$ \& — a general
 * bug that surfaces here first), STATISTICS (starred critical values z-star
 * / t-star, the unicode combining-macron x-bar the physics circumflex rule
 * missed).
 *
 * Same two layers and choke points as the prior sweeps (TTS: rewriteForTTS
 * → Cartesia; display: segment/looksLikeMath). Curated exact pins carry the
 * taxonomy; a modest stress corpus guards the T1-T4/D1-D2 invariants over
 * the new rule shapes.
 *
 * Conventions established here (the fix-wave contract):
 *   - LaTeX literal escapes are unescaped up front, BEFORE the $-span
 *     splitter: \% → "%", \& → "and", \$ → "$" (so Cartesia's native
 *     currency reading applies, matching the currency-guard convention
 *     that deliberately leaves "$5" literal). \$ additionally corrupted
 *     span parsing, so this must precede the splitter.
 *   - A starred exponent "z^*"/"t^*"/"A^*" speaks "star" (critical values,
 *     conjugates) — in-span, so a prose asterisk is untouched.
 *   - The unicode combining macron (x̄) speaks "bar", the sibling of the
 *     already-handled combining circumflex (p̂ → "p hat").
 *   - A ratio chains: "9:3:3:1" → "9 to 3 to 3 to 1" (dihybrid phenotype
 *     ratios), not just the 2-part "3:1" the math sweep handled. In-span.
 *   - A genotype token — even length, letters only, consecutive same-base
 *     allele pairs (Aa, aa, AaBb) — respells with CASE PRESERVED, which is
 *     the whole meaning: "Bb" → "big bee little bee". Case-insensitive
 *     letter products ("ab", "xy") keep the round-22 "ay bee" split. In-
 *     span, gated on the strict pairs shape so ordinary two-letter math
 *     tokens are untouched.
 *   - Sex-linked alleles "X^A"/"X^a" carry the allele on the chromosome,
 *     not an exponent: "X big ay X little ay".
 *
 * Deliberate, documented non-goals: bare biological Latin/Greek term
 * pronunciation (a dictionary problem, not notation); mhchem \ce{};
 * H_0 → "H naught" (a subscript-0 rewrite would collide with physics
 * v_0 → "v sub 0" — "H sub 0" is left acceptable).
 *
 * Run: npm run test:subject-notation
 *      npx tsx scripts/test-subject-notation-coverage.ts --dump
 */
import { rewriteForTTS } from '../src/lib/tutor/voice/tts-pronunciation';
import { segment } from '../src/lib/tutor/whiteboard/inline-math';
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
function speak(body: string): string {
  return rewriteForTTS(`so $${body}$ here.`);
}
const RESIDUE_RE = /[\\^_{}$]/;
// Strict speakable charset — the stress grammar deliberately emits no
// currency/percent leaves (those live in curated pins, where $ and % are
// intended Cartesia-native output), so the stress output must be pure
// words/digits/punctuation.
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

// ── Layer 2: generated stress corpus ───────────────────────────────────
type Wrap = { key: string; fn: (e: string) => string };
const LEAVES = ['x', 'A', '2', 'n'];
const WRAPS: Wrap[] = [
  { key: 'hat', fn: (e) => `\\hat{${e}}` },
  { key: 'bar', fn: (e) => `\\bar{${e}}` },
  // star/sup2 parenthesize their operand so composing them (star>star)
  // yields valid KaTeX "((x)^*)^*", not the double-superscript "x^*^*"
  // that no brain emits — a grammar artifact, not a real notation.
  { key: 'star', fn: (e) => `(${e})^*` },
  { key: 'sub0', fn: (e) => `(${e})_0` },
  { key: 'sup2', fn: (e) => `(${e})^2` },
  { key: 'frac', fn: (e) => `\\frac{${e}}{n}` },
  { key: 'times', fn: (e) => `${e} \\times n` },
  { key: 'paren', fn: (e) => `(${e} + 1)` },
];

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

console.log(`\nsubject-notation: ${pass} passed, ${fail} failed (curated), stress bad=${stress.bad}`);
if (fail > 0 || stress.bad > 0) process.exit(1);

function runCurated(): void {
  // ── GENETICS ─────────────────────────────────────────────────────
  // Monohybrid / test crosses — case preserved (dominant vs recessive is
  // the meaning). "aa" is homozygous recessive → "little ay little ay".
  tts('The cross $Bb \\times Bb$ gives offspring.', 'The cross big bee little bee times big bee little bee gives offspring.', 'monohybrid-cross');
  tts('A test cross $Aa \\times aa$ shows the ratio.', 'A test cross big ay little ay times little ay little ay shows the ratio.', 'test-cross');
  tts('The dihybrid $AaBb \\times AaBb$ is classic.', 'The dihybrid big ay little ay big bee little bee times big ay little ay big bee little bee is classic.', 'dihybrid-cross');
  tts('A lone genotype $AaBb$ is heterozygous.', 'A lone genotype big ay little ay big bee little bee is heterozygous.', 'lone-genotype');
  // Sex-linked alleles ride the chromosome, not an exponent.
  tts('Sex-linked $X^A X^a$ is a carrier.', 'Sex-linked X big ay X little ay is a carrier.', 'sex-linked-carrier');
  // The bare Y chromosome respells to the letter name "why" (tier-1 rule),
  // which is how the letter Y is said aloud — "ex-why" is the spoken XY.
  tts('An affected male is $X^a Y$ here.', 'An affected male is X little ay why here.', 'sex-linked-male');
  // N-part phenotype ratios chain (the math sweep only did 2-part).
  tts('The dihybrid ratio $9:3:3:1$ appears often.', 'The dihybrid ratio 9 to 3 to 3 to 1 appears often.', 'dihybrid-ratio');
  tts('A monohybrid ratio $3:1$ is typical.', 'A monohybrid ratio 3 to 1 is typical.', 'monohybrid-ratio');
  // Guards: a lowercase letter PRODUCT is not a genotype; prose is prose.
  tts('The product $ab$ factors cleanly.', 'The product A bee factors cleanly.', 'letter-product-guard');
  tts('The dominant allele B masks b.', 'The dominant allele B masks bee.', 'prose-allele-guard');

  // ── ECONOMICS ────────────────────────────────────────────────────
  // LaTeX literal escapes — no backslash may leak; \$ leaves currency for
  // Cartesia (the currency-guard convention).
  tts('GDP hit \\$21 trillion overall.', 'GDP hit $21 trillion overall.', 'escaped-dollar-prose');
  tts('A \\$5 tariff shifts supply here.', 'A $5 tariff shifts supply here.', 'escaped-dollar-tariff');
  tts('Elasticity $E_d = \\frac{\\%\\Delta Q}{\\%\\Delta P}$ falls.', 'Elasticity E sub dee equals % Delta Q over % Delta P falls.', 'escaped-percent-frac');
  tts('The set $A \\& B$ intersects.', 'The set A and bee intersects.', 'escaped-ampersand');
  // Equilibrium / marginal identities and the multiplier read fine already.
  tts('Firms produce where $MR = MC$ exactly.', 'Firms produce where MR equals MC exactly.', 'mr-mc');
  tts('The multiplier is $\\frac{1}{1 - MPC}$ overall.', 'The multiplier is 1 over 1 minus MPC overall.', 'multiplier');
  tts('Unemployment fell to 3.5% overall.', 'Unemployment fell to 3.5% overall.', 'percent-native-econ');
  tts('The curve $D_1$ shifts to $D_2$ rightward.', 'The curve D 1 shifts to D 2 rightward.', 'demand-curves');

  // ── STATISTICS ───────────────────────────────────────────────────
  // Starred critical values.
  tts('Critical value $z^* = 1.96$ here.', 'Critical value z star equals 1.96 here.', 'z-star');
  tts('Use $t^* = 2.04$ for the interval.', 'Use t star equals 2.04 for the interval.', 't-star');
  // Estimators — \bar/\hat commands already work (regression pins).
  tts('The mean $\\bar{x} = 12.4$ estimates mu.', 'The mean x bar equals 12.4 estimates mu.', 'x-bar-command');
  tts('We use $\\hat{p} = 0.42$ as the estimate.', 'We use p hat equals 0.42 as the estimate.', 'p-hat-command');
  // Unicode decorations: combining macron (new) + combining circumflex
  // (already handled by the physics rule — regression pin).
  tts('The sample mean is x̄ overall.', 'The sample mean is x bar overall.', 'x-bar-unicode');
  tts('Estimate p̂ from the data.', 'Estimate p hat from the data.', 'p-hat-unicode');
  // Standard error and hypotheses read acceptably as-is.
  tts('The SE is $\\frac{\\sigma}{\\sqrt{n}}$ small.', 'The SE is sigma over the square root of n small.', 'standard-error');
  tts('Test $H_0: \\mu = 100$ now.', 'Test H 0 : mu equals 100 now.', 'null-hypothesis');

  // ── Display: new spans classify + parse ──────────────────────────
  disp('Bb \\times Bb', 'cross-display');
  disp('X^A X^a', 'sex-linked-display');
  disp('z^*', 'z-star-display');
  disp('\\bar{x}', 'x-bar-display');
  disp('\\hat{p}', 'p-hat-display');
  disp('9:3:3:1', 'ratio-display');
  disp('\\frac{\\sigma}{\\sqrt{n}}', 'se-display');
}
