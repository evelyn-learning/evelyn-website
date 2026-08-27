/**
 * Material classification — the gate that decides whether a lesson can be
 * built from what the student uploaded, and what kind of lesson it should be.
 *
 * The asymmetry these tests are shaped around: a wrong REFUSAL blocks a
 * student who did nothing wrong and is immediately visible to them; a wrong
 * PROCEED produces a confident lesson about nothing, which is invisible until
 * they are already in it. So the module fails OPEN everywhere it is unsure,
 * and most of these tests pin exactly which inputs are allowed to refuse.
 *
 * Usage: npx tsx scripts/test-material-classify.ts
 *        (npm run test:material-classify)
 */
import {
  parseClassification,
  materialVerdict,
  generationHintForKind,
  isTooShortToClassify,
  MIN_CLASSIFIABLE_CHARS,
  UNUSABLE_BASE_MESSAGE,
  type MaterialKind,
} from '../src/lib/tutor/lesson-plan/material-classify';

let passed = 0;
let failed = 0;
function assert(cond: boolean, name: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

console.log('material-classify: the gate on what actually drives generation');

// --- the short-circuit --------------------------------------------------
console.log('\ntoo short to classify');
assert(isTooShortToClassify('') === true, 'empty text is too short');
assert(isTooShortToClassify('   \n  ') === true, 'whitespace-only is too short');
assert(isTooShortToClassify('x'.repeat(MIN_CLASSIFIABLE_CHARS - 1)) === true, 'just under the floor is too short');
assert(isTooShortToClassify('x'.repeat(MIN_CLASSIFIABLE_CHARS)) === false, 'exactly the floor is classifiable');
// ⚠ THE CASE THE FLOOR EXISTS TO NOT BREAK: a real single-line worksheet
// instruction. This is the exact string from the 2026-08-26 report.
const REAL_ONE_LINER = 'Provide an IUPAC name for each of the following alcohols';
assert(REAL_ONE_LINER.length > MIN_CLASSIFIABLE_CHARS, 'precondition: the real one-liner is above the floor');
assert(isTooShortToClassify(REAL_ONE_LINER) === false, 'REGRESSION TARGET: a real one-line question is NOT too short');

// --- parsing ------------------------------------------------------------
console.log('\nparseClassification');
const good = parseClassification({ kind: 'problem_set', topicSummary: 'IUPAC naming of alcohols', itemCount: 8 });
assert(good?.kind === 'problem_set' && good.itemCount === 8, 'a well-formed answer parses');
assert(parseClassification({ kind: 'unusable', reason: 'a photo of a cat' })?.kind === 'unusable',
  'unusable parses WITHOUT a topicSummary (it has nothing to summarise)');
assert(parseClassification({ kind: 'problem_set' }) === null,
  'a teachable kind with NO summary is incoherent -> null (fail open), not a refusal');
assert(parseClassification({ kind: 'nonsense', topicSummary: 'x' }) === null, 'an unknown kind -> null');
assert(parseClassification(null) === null, 'null -> null');
assert(parseClassification('problem_set') === null, 'a bare string -> null');
assert(parseClassification({ kind: 'diagram', topicSummary: 'a titration curve', itemCount: -3 })?.itemCount === undefined,
  'a nonsense itemCount is dropped, not stored');
assert((parseClassification({ kind: 'diagram', topicSummary: 'x', itemCount: 9999 })?.itemCount ?? 0) <= 200,
  'itemCount is bounded');
assert((parseClassification({ kind: 'explanatory_text', topicSummary: 'y'.repeat(999) })?.topicSummary.length ?? 0) <= 300,
  'topicSummary is bounded');

// --- the decision -------------------------------------------------------
console.log('\nmaterialVerdict');
const refusal = materialVerdict({ kind: 'unusable', topicSummary: '', reason: 'the image shows a cat' });
assert(refusal.proceed === false, 'unusable REFUSES');
assert(refusal.proceed === false && refusal.code === 'material_unusable', 'refusal carries a distinct code');
assert(refusal.proceed === false && refusal.message.includes(UNUSABLE_BASE_MESSAGE),
  'the refusal always contains the actionable base message');
assert(refusal.proceed === false && refusal.message.includes('cat'),
  "the classifier's reason is APPENDED, so the student knows what we saw");

const bare = materialVerdict({ kind: 'unusable', topicSummary: '' });
assert(bare.proceed === false && bare.message === UNUSABLE_BASE_MESSAGE, 'no reason -> just the actionable message');

// ⚠ The fail-open cases. Each of these would, if it refused, block a student
// whose upload was fine.
for (const k of ['problem_set', 'explanatory_text', 'mixed', 'diagram'] as MaterialKind[]) {
  assert(materialVerdict({ kind: k, topicSummary: 'something real' }).proceed === true, `${k} proceeds`);
}
assert(materialVerdict(null).proceed === true,
  'REGRESSION TARGET: a classifier that errored or answered nonsense PROCEEDS (fail open)');

// The distinction that matters most in this file, stated as an assertion:
// "no answer" and "answered: unusable" must not collapse into each other.
assert(materialVerdict(null).proceed !== materialVerdict({ kind: 'unusable', topicSummary: '' }).proceed,
  'CONTROL: "no answer" and "answered unusable" reach OPPOSITE outcomes');

// --- generation hints ---------------------------------------------------
console.log('\ngenerationHintForKind');
const ps = generationHintForKind('problem_set', 8);
assert(ps.includes('8'), 'the item count reaches the generator when known');
assert(/how to solve these/i.test(ps), 'a problem set asks for METHOD, not a topic survey');
assert(!/verbatim|word.for.word|exact(ly)? as written/i.test(ps),
  '⚠ REGRESSION TARGET: it must NOT ask for the questions verbatim — vision transcription of drawn structures is lossy, and a garbled copy presented as the student\'s OWN question is worse than a clean analogue');
assert(generationHintForKind('problem_set').includes('questions they brought'), 'the lesson is told to refer to the upload');
assert(/content first/i.test(generationHintForKind('mixed')), 'mixed teaches content before questions');
assert(/interpret/i.test(generationHintForKind('diagram')), 'a diagram lesson is about reading it');
assert(generationHintForKind('explanatory_text').includes('own order'), 'explanatory text keeps its own order');
assert(generationHintForKind('unusable') === '', 'unusable has no hint — it never reaches generation');

const hints = (['problem_set', 'explanatory_text', 'mixed', 'diagram'] as MaterialKind[]).map((k) => generationHintForKind(k));
assert(new Set(hints).size === hints.length, 'CONTROL: every kind gets a DISTINCT instruction');
assert(hints.every((h) => /brought/.test(h)),
  'every kind tells the lesson to acknowledge the upload — the amnesia in the original report');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
