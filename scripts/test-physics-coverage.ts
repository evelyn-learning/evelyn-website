/**
 * Physics-notation coverage sweep (2026-07-18, follows the round-24 math
 * pattern in test-math-coverage.ts — same choke points, physics taxonomy).
 *
 * Two layers over the surfaces every physics expression funnels through
 * (TTS: rewriteForTTS → Cartesia; display: segment/looksLikeMath →
 * InlineMathText/KaTeX in bubbles, cards, captions, Q-pin):
 *
 *  1. CURATED pins — hand-verified exact expected outputs per taxonomy
 *     category: units + SI prefixes, vectors, Greek (glyph AND command
 *     forms), canonical equations, Δ/± /scientific notation, degrees.
 *  2. GENERATED stress corpus — a grammar composes physics wrappers
 *     (Δ, vectors, magnitudes, ℏ, μ₀/ε₀, subscripts, units, ±, ×10^n)
 *     to depth 3, asserting the same invariants as the math sweep:
 *       T1 zero LaTeX residue in TTS output (\ ^ _ { } $)
 *       T2 speakable charset (letters/digits/space/basic punctuation)
 *       T3 no stray apostrophe survives
 *       T4 idempotence: rewriting the output changes nothing
 *       D1 the $-span classifies as math (looksLikeMath/segment)
 *       D2 the span body parses in KaTeX
 *
 * Conventions established by this harness (the fix-wave contract):
 *   - Units are expanded ONLY when number-anchored ("5 kg" → "5 kilograms");
 *     compound units (m/s, m/s², km/h, N·m) are unambiguous and expand
 *     unconditionally. Ambiguous-in-prose single letters (s, A, C, K, T, F)
 *     expand inside $-spans only. Bare prose "300 K" stays untouched
 *     (vitamin K / "$5K" precedent from rewriteDomainAcronyms).
 *   - Greek GLYPHS get the same spoken words as their \commands
 *     (ω ≡ \omega → "omega"); \varepsilon/\vartheta/\varphi drop the
 *     "var" prefix.
 *   - μ is micro- when number-anchored before a unit letter (5 μC), "mu"
 *     otherwise (F = μN).
 *   - Uppercase variable products (IR, PV, nRT) deliberately stay intact:
 *     they're indistinguishable from geometry segment names (AB ∥ CD, a
 *     pinned math-suite behavior) and Cartesia reads caps runs as letters.
 *
 * KNOWN_GAPS records triaged-but-deferred shapes; a gap that starts
 * passing must graduate to a pin. Everything else must pass — exit 1
 * otherwise.
 *
 * Run: npm run test:physics-coverage
 *      npx tsx scripts/test-physics-coverage.ts --dump
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
/** TTS a math body inside a neutral spoken frame (the frame itself contains
 *  no math, digits, or apostrophes, so anything suspicious in the output
 *  came from the span). */
function speak(body: string): string {
  return rewriteForTTS(`so $${body}$ here.`);
}
const RESIDUE_RE = /[\\^_{}$]/;
// Frame words + verbalizer/unit vocabulary are all plain; ° √ × ± | Ω μ etc.
// in the output mean a symbol leaked past the pipeline.
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
const LEAVES = ['x', '2', 'v_0', '\\theta'];
const WRAPS: Wrap[] = [
  { key: 'delta', fn: (e) => `\\Delta ${e}` },
  { key: 'vecdot', fn: (e) => `\\vec{v} \\cdot (${e})` },
  { key: 'mag', fn: (e) => `|\\vec{F}| + ${e}` },
  { key: 'hbar', fn: (e) => `\\hbar (${e})` },
  { key: 'mu0', fn: (e) => `\\mu_0 (${e})` },
  { key: 'eps0', fn: (e) => `\\varepsilon_0 (${e})` },
  { key: 'om', fn: (e) => `\\omega (${e})` },
  { key: 'sub0', fn: (e) => `(${e})_0` },
  { key: 'subx', fn: (e) => `F_{${e}}` },
  { key: 'unitms', fn: (e) => `${e} \\, \\text{m/s}` },
  { key: 'unitms2', fn: (e) => `${e} \\, \\text{m/s}^2` },
  { key: 'unitkg', fn: (e) => `${e} \\, \\text{kg}` },
  { key: 'ohm', fn: (e) => `${e} \\, \\Omega` },
  { key: 'pm', fn: (e) => `${e} \\pm 0.2` },
  { key: 'sci', fn: (e) => `${e} \\times 10^{-3}` },
  { key: 'degc', fn: (e) => `(${e})^\\circ` },
  { key: 'frac', fn: (e) => `\\frac{${e}}{t}` },
  { key: 'eq', fn: (e) => `F = ${e}` },
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

console.log(`\nphysics-coverage: ${pass} passed, ${fail} failed (curated), stress bad=${stress.bad}`);
if (fail > 0 || stress.bad > 0) process.exit(1);

// CURATED_SECTIONS: runCurated is defined at the bottom so the category
// blocks read top-to-bottom in taxonomy order without hoisting surprises.
function runCurated(): void {
  // ── 1. Base units (number-anchored) ──────────────────────────────
  tts('The mass is 5 kg here.', 'The mass is 5 kilograms here.', 'kilograms');
  tts('It moved 1 m forward.', 'It moved 1 meter forward.', 'meter-singular');
  tts('The force is 10 N upward.', 'The force is 10 newtons upward.', 'newtons');
  tts('That transfer is 250 J total.', 'That transfer is 250 joules total.', 'joules');
  tts('Power output is 60 W steady.', 'Power output is 60 watts steady.', 'watts');
  tts('Air pressure is 101 kPa here.', 'Air pressure is 101 kilopascals here.', 'kilopascals');
  tts('The tone is 440 Hz exactly.', 'The tone is 440 hertz exactly.', 'hertz');
  tts('Batteries give 12 V output.', 'Batteries give 12 volts output.', 'volts');
  tts('React 2 mol of gas fully.', 'React 2 moles of gas fully.', 'moles');
  tts('Sweep 2 rad of arc here.', 'Sweep 2 radians of arc here.', 'radians');
  tts('Carbon-12 is 12 amu by definition.', 'Carbon-12 is 12 atomic mass units by definition.', 'amu');
  tts('It binds at 13.6 eV exactly.', 'It binds at 13.6 electron volts exactly.', 'electron-volts');

  // ── 2. SI prefixes ───────────────────────────────────────────────
  tts('The chip runs at 3 GHz now.', 'The chip runs at 3 gigahertz now.', 'gigahertz');
  tts('The resistor is 5 Ω here.', 'The resistor is 5 ohms here.', 'ohms-glyph');
  tts('Use a 2 kΩ resistor here.', 'Use a 2 kilohms resistor here.', 'kilohms');
  tts('A charge of 5 μC sits here.', 'A charge of 5 microcoulombs sits here.', 'microcoulombs');
  tts('The flash lasts 5 μs only.', 'The flash lasts 5 microseconds only.', 'microseconds');
  tts('Light of 500 nm looks green.', 'Light of 500 nanometers looks green.', 'nanometers');
  tts('A pulse every 10 ms repeats.', 'A pulse every 10 milliseconds repeats.', 'milliseconds');

  // ── 3. Compound units (unconditional — shape is unambiguous) ─────
  tts('Speed is 5 m/s here.', 'Speed is 5 meters per second here.', 'm-per-s');
  tts('Gravity is 9.8 m/s² down.', 'Gravity is 9.8 meters per second squared down.', 'm-per-s2-glyph');
  tts('The limit is 100 km/h here.', 'The limit is 100 kilometers per hour here.', 'km-per-h');
  tts('Torque of 5 N·m turns it.', 'Torque of 5 newton meters turns it.', 'newton-meters');

  // ── 4. Span-only units (ambiguous in prose, unambiguous in $…$) ──
  tts('Room temperature is $T = 300 \\, \\text{K}$ roughly.', 'Room temperature is T equals 300 kelvin roughly.', 'kelvin-span');
  tts('The current is $I = 2 \\, \\text{A}$ steady.', 'The current is I equals 2 amps steady.', 'amps-span');
  tts('The charge is $Q = 5 \\, \\text{C}$ stored.', 'The charge is Q equals 5 coulombs stored.', 'coulombs-span');
  tts('The field is $B = 2 \\, \\text{T}$ strong.', 'The field is bee equals 2 tesla strong.', 'tesla-span');
  tts('It waits $t = 5 \\, \\text{s}$ between pulses.', 'It waits t equals 5 seconds between pulses.', 'seconds-span');
  // Prose guard: bare K/A/C/T never expand outside a span.
  tts('The class raised 300 K for charity.', 'The class raised 300 K for charity.', 'prose-K-guard');

  // ── 5. Degrees ───────────────────────────────────────────────────
  tts('Water boils at 100°C at sea level.', 'Water boils at 100 degrees Celsius at sea level.', 'celsius');
  tts('It read 68°F outside.', 'It read 68 degrees Fahrenheit outside.', 'fahrenheit');
  tts('Rotate by $\\theta = 30°$ counterclockwise.', 'Rotate by theta equals 30 degrees counterclockwise.', 'degrees-in-span');

  // ── 6. Scientific notation with units ────────────────────────────
  tts('Light travels 3 × 10⁸ m/s in vacuum.', 'Light travels 3 times 10 to the 8 meters per second in vacuum.', 'sci-glyph-units');
  tts('Planck gave 6.6 × 10⁻³⁴ J of action.', 'Planck gave 6.6 times 10 to the minus 34 joules of action.', 'sci-neg-superscript');
  tts('An electron carries $q = 1.6 \\times 10^{-19} \\, \\text{C}$ of charge.', 'An electron carries q equals 1.6 times 10 to the minus 19 coulombs of charge.', 'sci-neg-exp-coulombs');

  // ── 7. Vectors ───────────────────────────────────────────────────
  // Round-28: bare in-span "m" now respells to "em" (Cartesia read a
  // standalone m as "meter" in a live calc session) — these pins updated
  // deliberately to the spoken letterform, same as the ay/bee precedent.
  tts('The force $\\vec{F} = m\\vec{a}$ governs motion.', 'The force vector F equals em vector ay governs motion.', 'second-law-vectors');
  tts('So $\\vec F = m \\vec a$ works too.', 'So vector F equals em vector ay works too.', 'braceless-vec');
  tts('Split it into $3\\hat{i} + 4\\hat{j}$ parts.', 'Split it into 3 i hat plus 4 j hat parts.', 'unit-vectors');
  tts('The direction î points east.', 'The direction i hat points east.', 'i-hat-glyph');
  tts('So $|\\vec{v}| = 5$ overall.', 'So the magnitude of vector v equals 5 overall.', 'vector-magnitude');
  tts('Resolve $F_x = F\\cos\\theta$ first.', 'Resolve F sub x equals F cosine theta first.', 'component-x');
  tts('Then $F_y = F\\sin\\theta$ next.', 'Then F sub why equals F sine theta next.', 'component-y');
  tts('Start from $v_0 = 4$ upward.', 'Start from v sub 0 equals 4 upward.', 'v-naught');

  // ── 8. Greek: glyphs AND commands ────────────────────────────────
  tts('Angular speed ω rises here.', 'Angular speed omega rises here.', 'omega-glyph');
  tts('The wavelength λ shrinks here.', 'The wavelength lambda shrinks here.', 'lambda-glyph');
  tts('Charge density ρ varies here.', 'Charge density rho varies here.', 'rho-glyph');
  tts('The flux Φ drops to zero.', 'The flux Phi drops to zero.', 'Phi-glyph');
  tts('The angle θ opens wider.', 'The angle theta opens wider.', 'theta-glyph');
  tts('Ohm symbol Ω stands alone here.', 'Ohm symbol Omega stands alone here.', 'Omega-glyph-bare');
  tts('So α = 2ω after the spin.', 'So alpha equals 2 omega after the spin.', 'alpha-eq-glyph');
  tts('Compute Δx over Δt directly.', 'Compute Delta x over Delta t directly.', 'Delta-glyph');
  tts('Frequency uses $\\omega = 2\\pi f$ directly.', 'Frequency uses omega equals 2 pie f directly.', 'omega-2pif');
  tts('Permittivity $\\varepsilon_0$ appears here.', 'Permittivity epsilon sub 0 appears here.', 'varepsilon-strips-var');
  tts('Permeability μ₀ is small.', 'Permeability mu 0 is small.', 'mu-naught-glyph');
  tts('Friction obeys $F = \\mu N$ here.', 'Friction obeys F equals mu N here.', 'mu-friction');

  // Round-29 (live 2026-07-23, session-1784778855564): PROSE "F equals m
  // times a" left the bare m for Cartesia, which read it as "meter". The
  // in-span rules never see prose; anchor m after "equals" / before "times".
  tts('The formula is F equals m times a — so you need to rearrange.', 'The formula is F equals em times ay, so you need to rearrange.', 'prose-equals-m-times-a');
  tts('Net force is m times a.', 'Net force is em times ay.', 'prose-m-before-times');
  tts('Force equals m a.', 'Force equals em ay.', 'prose-equals-m-bare');
  // Units guards: digit-anchored m stays a unit; m/s untouched by the new anchors.
  tts('The hallway is 5 m long.', 'The hallway is 5 meters long.', 'prose-unit-m-guard');
  tts('It moves at 3 m/s here.', 'It moves at 3 meters per second here.', 'prose-unit-ms-guard');

  // ── 9. Canonical equations ───────────────────────────────────────
  tts('Newton wrote $F = ma$ compactly.', 'Newton wrote F equals em ay compactly.', 'f-equals-ma');
  tts('Einstein wrote $E = mc^2$ famously.', 'Einstein wrote E equals em c squared famously.', 'e-mc2');
  tts('Use $v = v_0 + at$ for velocity.', 'Use v equals v sub 0 plus ay t for velocity.', 'kinematics-at');
  tts('Then $x = v_0 t + \\frac{1}{2}at^2$ follows.', 'Then x equals v sub 0 t plus 1 over 2 ay t squared follows.', 'kinematics-x');
  tts('Kinetic energy is $KE = \\frac{1}{2}mv^2$ always.', 'Kinetic energy is KE equals 1 over 2 em v squared always.', 'kinetic-energy');
  tts('Work is $W = F d \\cos\\theta$ along the path.', 'Work is W equals F dee cosine theta along the path.', 'work-eq');
  tts('Waves follow $v = f\\lambda$ neatly.', 'Waves follow v equals f lambda neatly.', 'wave-eq');
  tts('Period is $T = \\frac{2\\pi}{\\omega}$ here.', 'Period is T equals 2 pie over omega here.', 'period-eq');
  tts('Energy quantizes as $E = \\hbar \\omega$ here.', 'Energy quantizes as E equals h bar omega here.', 'hbar');
  // Uppercase products stay intact by design (see header).
  tts('Ohm gave $V = IR$ simply.', 'Ohm gave V equals IR simply.', 'ohms-law-accepted');
  tts('Ideal gases follow $PV = nRT$ closely.', 'Ideal gases follow PV equals nRT closely.', 'ideal-gas-accepted');

  // ── 10. Uncertainty & percent ────────────────────────────────────
  tts('Uncertainty is $g = 9.8 \\pm 0.2 \\, \\text{m/s}^2$ measured.', 'Uncertainty is g equals 9.8 plus or minus 0.2 meters per second squared measured.', 'pm-uncertainty');
  tts('The error is 5% at worst.', 'The error is 5% at worst.', 'percent-native');

  // ── 11. Display: physics spans classify + parse ──────────────────
  disp('\\vec{F}', 'vec-display');
  disp('F_x', 'subscript-display');
  disp('|\\vec{v}|', 'magnitude-display');
  disp('\\hbar \\omega', 'hbar-display');
  disp('\\Delta x', 'Delta-display');
  disp('\\mu_0', 'mu0-display');
  disp('\\varepsilon_0', 'eps0-display');
  disp('9.8 \\, \\text{m/s}^2', 'units-display');
  disp('1.6 \\times 10^{-19}', 'sci-display');
  disp('v = v_0 + at', 'kinematics-display');
  disp('F = \\mu N', 'friction-display');
  disp('PV = nRT', 'ideal-gas-display');
  disp('\\omega = 2\\pi f', 'omega-display');
  disp('3\\hat{i} + 4\\hat{j}', 'unit-vector-display');
  dispProse('It costs $5 and the lab fee is $10.', 'currency-guard-physics');
}
