/**
 * Smoke test for the Tier 1 coherence-pass plumbing. Pure functions only —
 * no UI, no Anthropic calls. Verifies that:
 *   1. getSegmentTruth pulls authored ground truth from real seed plans.
 *   2. formatSegmentTruth renders a non-empty contract block when truth exists.
 *   3. problemSimilarity scores faithful renders high and drifted ones low.
 *   4. The RULE8 visual-promise regex catches typical openings without
 *      false-positive matching plain explanations.
 *
 * Run: npx ts-node --transpile-only --project tsconfig.json scripts/test-coherence-pass.ts
 */
import { SEED_G6_FRACTIONS_ADD_UNLIKE } from '../src/lib/tutor/lesson-plan/seeds/g6-fractions-add-unlike';
import { getSegmentTruth } from '../src/lib/tutor/lesson-plan/context';
import { formatSegmentTruth } from '../src/lib/tutor/voice/claude-brain';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

// problemSimilarity is defined inline in VoiceTutorRealtime.tsx — re-implement
// the same logic here so we test the actual algorithm without pulling React.
// Keep this in sync with the helper in VoiceTutorRealtime.tsx.
function problemSimilarity(rendered: string, authored: string): number {
  const tokenize = (s: string): string[] => {
    const lowered = s.toLowerCase()
      .replace(/\$([^$]+)\$/g, ' $1 ')
      .replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, ' $1/$2 ')
      .replace(/\\(cdot|times)/g, ' * ')
      .replace(/\\[a-z]+/g, ' ')
      // eslint-disable-next-line no-useless-escape
      .replace(/[{}()\[\],;:!?"'.]/g, ' ');
    return lowered.split(/\s+/).filter((t) => t.length > 0);
  };
  const isNumeric = (t: string) => /^[-+]?\d+(?:\.\d+)?$|[\d/^*+\-=<>]/.test(t);
  const aTokens = tokenize(authored);
  if (aTokens.length === 0) return 1;
  const renderedSet = new Set(tokenize(rendered));
  const aNumerics = aTokens.filter(isNumeric);
  const aProse = aTokens.filter((t) => !isNumeric(t));
  const numericMatch = aNumerics.length === 0
    ? 1
    : aNumerics.filter((t) => renderedSet.has(t)).length / aNumerics.length;
  const proseMatch = aProse.length === 0
    ? 1
    : aProse.filter((t) => renderedSet.has(t)).length / aProse.length;
  return Math.min(numericMatch, proseMatch);
}

const visualPromiseRegex = /\b(let me|i['’]ll|i will|here['’]s|here is|i['’]m going to)\s+(?:(?:a|an|the|this|that|some)\s+(?:quick\s+|simple\s+|small\s+|nice\s+)?)?(draw|plot|show|sketch|display|render|graph|create|drawing|chart|diagram|figure|illustration|visualization|image|picture|rendering)\b/i;

console.log('\n=== Test 1: getSegmentTruth on real seed plans ===');
{
  const plan = SEED_G6_FRACTIONS_ADD_UNLIKE;
  const hook = plan.segments.find((s) => s.id === 'hook');
  const concept = plan.segments.find((s) => s.id === 'concept-1');
  const worked = plan.segments.find((s) => s.id === 'worked-1');
  const tryY = plan.segments.find((s) => s.id === 'try-1');

  check('hook has no segment truth (open-ended)', getSegmentTruth(hook) === null);
  check('concept-1 has no segment truth (open-ended)', getSegmentTruth(concept) === null);

  const wt = getSegmentTruth(worked);
  check('worked-1 returns truth', wt !== null);
  check('worked-1 problemText matches author', wt?.problemText === 'Compute 1/2 + 1/3.', wt?.problemText);
  check('worked-1 expectedAnswer matches author', wt?.expectedAnswer === '5/6', wt?.expectedAnswer);

  const tt = getSegmentTruth(tryY);
  check('try-1 returns truth', tt !== null);
  check('try-1 problemText matches author', tt?.problemText === 'Try this one: 1/4 + 2/3. Walk me through it.', tt?.problemText);
  check('try-1 expectedAnswer matches author', tt?.expectedAnswer === '11/12', tt?.expectedAnswer);
}

console.log('\n=== Test 2: formatSegmentTruth renders contract block ===');
{
  const plan = SEED_G6_FRACTIONS_ADD_UNLIKE;
  const worked = plan.segments.find((s) => s.id === 'worked-1');
  const concept = plan.segments.find((s) => s.id === 'concept-1');

  const wBlock = formatSegmentTruth(worked);
  check('worked-1 produces non-empty block', wBlock.length > 0);
  check('worked-1 block contains problemText', wBlock.includes('Compute 1/2 + 1/3.'));
  check('worked-1 block contains expectedAnswer', wBlock.includes('5/6'));
  check('worked-1 block contains CONTRACT keyword', wBlock.includes('CONTRACT'));

  const cBlock = formatSegmentTruth(concept);
  check('concept-1 produces empty block (no truth)', cBlock === '');
}

console.log('\n=== Test 3: problemSimilarity (faithful renders score high) ===');
{
  const authored = 'Compute 1/2 + 1/3.';
  const verbatim = problemSimilarity(authored, authored);
  check('verbatim render scores 1.0', verbatim === 1, String(verbatim));
  // Trailing-period strip
  const reformat = 'Compute 1/2 + 1/3';
  const reformatScore = problemSimilarity(reformat, authored);
  check('trailing-period strip stays >= 0.5 (no rejection)', reformatScore >= 0.5, String(reformatScore));
  // Latex-only render of a prose-with-math authored problem SHOULD be
  // rejected — the contract says use show_problem for prose, not
  // show_equation. Verify the algorithm enforces that.
  const latex = '\\frac{1}{2} + \\frac{1}{3} = ?';
  const latexScore = problemSimilarity(latex, authored);
  check('latex-only render of prose problem scores < 0.5 (forces show_problem)',
    latexScore < 0.5, String(latexScore));
}

console.log('\n=== Test 4: problemSimilarity (drifted renders score low) ===');
{
  const authored = 'Compute 1/2 + 1/3.';
  // Number substitution: same shape, different operands → should drift
  const drift1 = 'Compute 1/4 + 1/5.';
  const s1 = problemSimilarity(drift1, authored);
  check('number-substitution drift scores < 0.5', s1 < 0.5, String(s1));
  // Operator swap is a known v1 hole — single-token loss isn't enough
  // to drop below 0.5 with min(numericMatch, proseMatch). Documenting
  // the score so future tightening has a baseline.
  const drift2 = 'Compute 1/2 - 1/3.';
  const s2 = problemSimilarity(drift2, authored);
  check('operator-swap drift documented (escapes v1 detector)',
    s2 >= 0.5 && s2 < 1, `score=${s2.toFixed(3)} — known hole`);
  // Totally different problem
  const drift3 = 'Find the area of a triangle with base 5 and height 6.';
  const s3 = problemSimilarity(drift3, authored);
  check('different-problem drift scores < 0.3', s3 < 0.3, String(s3));
}

console.log('\n=== Test 5: problemSimilarity on a try_yourself prose problem ===');
{
  const authored = 'Try this one: 1/4 + 2/3. Walk me through it.';
  // Faithful render with show_problem statement format
  const faithful = 'Try this one: 1/4 + 2/3. Walk me through it.';
  check('faithful prose problem scores 1.0', problemSimilarity(faithful, authored) === 1);
  // Numbers swapped — the orchestrator's exact failure mode we want to
  // catch, and the original motivation for the min(numeric, prose)
  // refactor (single-overlap let this slip past at 0.69).
  const swap = 'Try this one: 1/3 + 2/5. Walk me through it.';
  const swapScore = problemSimilarity(swap, authored);
  check('swapped-numerator drift scores < 0.5', swapScore < 0.5, String(swapScore));
}

console.log('\n=== Test 6: RULE8 visual-promise regex ===');
{
  // Catches BOTH verb-form ("Let me draw / I'll plot") and noun-form
  // ("Here's a graph / Here is a quick diagram"). Negatives below check
  // that domain words ("two fractions to add", "drawing on prior
  // knowledge") don't false-positive — those phrases happen to share
  // surface tokens with the visual nouns but aren't promising a render.
  const positives = [
    "Let me draw a quick sketch.",
    "I'll plot that for you.",
    "I'm going to show you how this works.",
    "I will sketch the triangle.",
    "Here's a quick render of the system.",
    "Here is a graph showing the trend.",
  ];
  const negatives = [
    "Good question — fractions can be tricky.",
    "Notice how 5/6 is just a bit less than 1.",
    "Let me think about that for a moment.",
    "I want you to try this on your own.",
    "Here we have two fractions to add.",
    "Drawing on prior knowledge, what do you think?",
  ];
  for (const t of positives) {
    check(`positive: "${t}"`, visualPromiseRegex.test(t));
  }
  for (const t of negatives) {
    check(`negative: "${t}"`, !visualPromiseRegex.test(t));
  }
}

console.log(`\n=== Result: ${pass} pass, ${fail} fail ===`);
process.exit(fail > 0 ? 1 : 0);
