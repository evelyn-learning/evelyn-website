/**
 * MCQ option text → letter when options differ only by case (or only by the
 * characters `normMcqText` drops).
 *
 * `resolveMcqLetter` (src/lib/tutor/voice/answer-primitives.ts) matched an
 * answer TEXT to an option on a lossy fold (lower-case, a-z/0-9 only) and
 * returned the FIRST option with that fold. Genotypes "TT" / "Tt" / "tt",
 * "Kc" / "KC", "mg" / "Mg", "pH" / "PH" — and "-2" / "2" — all share a fold,
 * so the first one won whichever was meant. The rule now: fold as before
 * UNLESS two options of the item are different texts with the same fold; then
 * compare exactly, and an answer that still names two options names none.
 *
 * Three parts:
 *   1. the named cases;
 *   2. OLD vs NEW over synthetic items and the real MCQ shapes in the repo
 *      (mock-exam fixtures, src/data/mock-forms) — identical on every item
 *      with no such collision;
 *   3. the same rule in the portal quiz grader (`mcqResponseCorrect`,
 *      src/lib/tutor/portal/assessment.ts).
 *
 * No model calls, no database. Run: `npx tsx scripts/test-mcq-letter-case.ts`
 */
import './lib/no-db-env';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import { mcqFoldCollides, normMcqText, resolveMcqLetter } from '../src/lib/tutor/voice/answer-primitives';
import { matchUtteranceToAnswer } from '../src/lib/tutor/voice/utterance-answer-match';
import { mcqResponseCorrect } from '../src/lib/tutor/portal/assessment';
import { FIXTURE_ITEMS } from '../src/lib/tutor/mock-exam/fixtures';

type Choice = { letter: string; text: string };
const item = (...texts: string[]): Choice[] => texts.map((text, i) => ({ letter: String.fromCharCode(65 + i), text }));

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

/** `resolveMcqLetter` as it was before 2026-10-10 — VERBATIM. */
function oldResolveMcqLetter(answer: string, choices: Choice[]): string | null {
  const t = (answer ?? '').trim();
  const direct = t.match(/^\(?([A-Ea-e])\)?[.):]?$/);
  if (direct) return direct[1].toUpperCase();
  const prefixed = t.match(/^(?:option|choice|answer(?:\s+is)?)[:\s]+\(?([A-Ea-e])\)?[.):]?\s*$/i);
  if (prefixed) return prefixed[1].toUpperCase();
  const n = normMcqText(t);
  if (!n) return null;
  for (const c of choices) {
    if (normMcqText(c.text) === n) return c.letter.toUpperCase();
  }
  return null;
}

/** The portal grader's MCQ branch as it was before 2026-10-10 — VERBATIM. */
type McqKey = Parameters<typeof mcqResponseCorrect>[0];
function oldMcqResponseCorrect(key: McqKey, text: string): boolean {
  const norm = (s: string) => (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
  const n = norm(text);
  if (key.correctChoiceId && n === norm(key.correctChoiceId)) return true;
  if (key.expectedAnswer && n === norm(key.expectedAnswer)) return true;
  const correct = key.choices?.find((c) => c.id === key.correctChoiceId);
  if (correct && n === norm(correct.text)) return true;
  return false;
}

// ── 1. named cases ──────────────────────────────────────────────────────────
console.log('resolveMcqLetter — named cases');

const GENO = item('TT', 'Tt', 'tt', 'Cannot be determined');
check('genotypes: each option text resolves to ITS letter', () => {
  assert.equal(resolveMcqLetter('TT', GENO), 'A');
  assert.equal(resolveMcqLetter('Tt', GENO), 'B');
  assert.equal(resolveMcqLetter('tt', GENO), 'C');
  // What it used to do: the first option, whichever was meant.
  assert.equal(oldResolveMcqLetter('Tt', GENO), 'A');
  assert.equal(oldResolveMcqLetter('tt', GENO), 'A');
});
check('genotypes: surrounding space and $ are still ignored; case is not', () => {
  assert.equal(resolveMcqLetter('  Tt ', GENO), 'B');
  assert.equal(resolveMcqLetter('$Tt$', GENO), 'B');
  assert.equal(resolveMcqLetter('tT', GENO), null); // names no option exactly, three after folding
  assert.equal(resolveMcqLetter('Tt.', GENO), null);
});
check('genotypes: an option outside the collision still matches in any case', () => {
  assert.equal(resolveMcqLetter('cannot be determined.', GENO), 'D');
  assert.equal(resolveMcqLetter('CANNOT BE DETERMINED', GENO), 'D');
});

const UNITS = item('5 mg', '5 Mg', '5 g', '5 kg');
check('units: mg / Mg', () => {
  assert.equal(resolveMcqLetter('5 Mg', UNITS), 'B');
  assert.equal(resolveMcqLetter('5 mg', UNITS), 'A');
  assert.equal(resolveMcqLetter('5Mg', UNITS), 'B'); // spacing only
  assert.equal(resolveMcqLetter('5 KG', UNITS), 'D'); // not part of the collision
  assert.equal(oldResolveMcqLetter('5 Mg', UNITS), 'A');
});
check('Kc / KC and pH / PH', () => {
  assert.equal(resolveMcqLetter('KC', item('Kc', 'KC', 'Kp', 'Ksp')), 'B');
  assert.equal(resolveMcqLetter('PH', item('pOH', 'pH', 'PH', 'pKa')), 'C');
  assert.equal(resolveMcqLetter('pH', item('pOH', 'pH', 'PH', 'pKa')), 'B');
});
check('the same first-match fault for a sign or a decimal point', () => {
  const SIGN = item('2', '-2', '4', '-4');
  assert.equal(resolveMcqLetter('-2', SIGN), 'B');
  assert.equal(resolveMcqLetter('2', SIGN), 'A');
  assert.equal(resolveMcqLetter('−2', SIGN), 'B'); // typographic minus
  assert.equal(resolveMcqLetter('$-4$', SIGN), 'D');
  assert.equal(oldResolveMcqLetter('-2', SIGN), 'A');
  assert.equal(resolveMcqLetter('1.5', item('15', '1.5', '150', '0.15')), 'B');
});

const NORMAL = item('mitochondrion', 'Ribosome', 'the Golgi apparatus', '$x^2 + 1$');
check('a normal item: unchanged, case and punctuation folded', () => {
  assert.equal(resolveMcqLetter('Mitochondrion', NORMAL), 'A');
  assert.equal(resolveMcqLetter('RIBOSOME.', NORMAL), 'B');
  assert.equal(resolveMcqLetter('The golgi apparatus', NORMAL), 'C');
  assert.equal(resolveMcqLetter('x^2 + 1', NORMAL), 'D');
  assert.equal(resolveMcqLetter('nucleus', NORMAL), null);
});
check('a letter key in either case, on every kind of item', () => {
  for (const choices of [GENO, UNITS, NORMAL]) {
    for (const [ans, want] of [['b', 'B'], ['B', 'B'], ['(b)', 'B'], ['B.', 'B'], ['Option b', 'B'], ['answer is C', 'C']] as const) {
      assert.equal(resolveMcqLetter(ans, choices), want, `${ans}`);
    }
  }
});
check('option text in a different case from the key (no collision): still matches', () => {
  assert.equal(resolveMcqLetter('HOMOZYGOUS DOMINANT', item('heterozygous', 'Homozygous dominant', 'homozygous recessive')), 'B');
  assert.equal(resolveMcqLetter('tt', item('TT', 'Rr', 'rr')), 'A'); // one option folds to it — as before
});
check('duplicate options', () => {
  // Inside a collision: byte-identical options are ambiguous → no match.
  const dupes = item('TT', 'Tt', 'Tt', 'tt');
  assert.equal(resolveMcqLetter('Tt', dupes), null);
  assert.equal(resolveMcqLetter('TT', dupes), 'A');
  assert.equal(resolveMcqLetter('tt', dupes), 'D');
  // No collision (identical texts are not "different after folding"): the
  // item resolves as it always did — the first of the duplicates.
  const plain = item('12', '12', '15', '18');
  assert.equal(mcqFoldCollides(plain.map((c) => c.text), normMcqText), false);
  assert.equal(resolveMcqLetter('12', plain), oldResolveMcqLetter('12', plain));
});
check('mcqFoldCollides', () => {
  assert.equal(mcqFoldCollides(['TT', 'Tt', 'tt']), true);
  assert.equal(mcqFoldCollides(['TT', 'TT', 'Rr']), false);
  assert.equal(mcqFoldCollides([' Tt', 'Tt ']), false); // trimmed first
  assert.equal(mcqFoldCollides(['é', 'é']), false); // NFC first
  assert.equal(mcqFoldCollides(['2', '-2']), false); // case fold only…
  assert.equal(mcqFoldCollides(['2', '-2'], normMcqText), true); // …the wide fold merges them
  assert.equal(mcqFoldCollides(['<', '>'], normMcqText), false); // nothing left to match on
  assert.equal(mcqFoldCollides([null, undefined, '']), false);
});
check('the live answer match (utterance-answer-match) follows', () => {
  assert.equal(matchUtteranceToAnswer('Tt', 'B', GENO).verdict, 'agree');
  assert.equal(matchUtteranceToAnswer('tt', 'B', GENO).verdict, 'disagree');
  assert.equal(matchUtteranceToAnswer('Tt', 'A', GENO).verdict, 'disagree'); // was 'agree'
});

// ── 2. OLD vs NEW ───────────────────────────────────────────────────────────
console.log('resolveMcqLetter — old vs new');

let seed = 20261010;
const rnd = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 2 ** 32;
};
const pick = <T,>(xs: T[]): T => xs[Math.floor(rnd() * xs.length)];

const WORDS = ['mitosis', 'Meiosis', 'the nucleus', 'ATP', 'NaCl', 'H2O', 'kinetic energy', 'Potential Energy', 'slope', 'y-intercept',
  'It increases', 'it decreases', 'No change', 'None of the above', 'All of the above', 'Both I and II', 'I only', 'II only', 'Kc', 'Kp',
  'pH', 'pOH', 'mg', 'kg', 'TT', 'Rr', 'rr', 'the Senate', 'Congress', 'a metaphor', 'Simile'];
const MATH = ['$x^2$', '$2x$', '\\frac{1}{2}', '3/4', '0.75', '12', '-7', '15 m/s', '9.8 m/s^2', '$\\sqrt{2}$', 'x = 3', 'y = 2x + 1',
  '(2, 3)', '(−2, 3)', '45°', '90°', '1.5 × 10^3', '25%', '$4.50', '300,000', 'π/4', '2π'];
const POOL = [...WORDS, ...MATH];
const variants = (t: string): string[] => [
  t, t.toLowerCase(), t.toUpperCase(), ` ${t} `, `${t}.`, `$${t}$`, t.replace(/\s+/g, ''), `(${t})`, t.replace(/-/g, '−'),
  `${t} `.repeat(2).trim(), t.slice(0, Math.max(1, t.length - 1)),
];
const LETTERY = ['A', 'b', '(C)', 'd.', 'E', 'Option B', 'choice: c', 'answer is D', 'F', '', '   ', 'none', 'I', 'a)'];

function answersFor(choices: Choice[]): string[] {
  return [...LETTERY, ...choices.flatMap((c) => variants(c.text)), ...[pick(POOL), pick(POOL)].flatMap(variants)];
}

let compared = 0;
let colliding = 0;
function compare(choices: Choice[], label: string) {
  const collides = mcqFoldCollides(choices.map((c) => c.text), normMcqText);
  if (collides) colliding++;
  for (const ans of answersFor(choices)) {
    const was = oldResolveMcqLetter(ans, choices);
    const now = resolveMcqLetter(ans, choices);
    if (!collides) {
      assert.equal(now, was, `${label}: "${ans}" over ${JSON.stringify(choices.map((c) => c.text))}`);
    } else if (now !== null && now !== was) {
      // A changed letter must be the option the answer names more exactly
      // than the old one: the old option is a different text.
      const nowText = choices.find((c) => c.letter === now)!.text;
      const wasText = was ? choices.find((c) => c.letter === was)!.text : null;
      assert.notEqual(nowText.normalize('NFC').trim(), wasText?.normalize('NFC').trim(), `${label}: "${ans}"`);
      // …and the answer is that option's text, give or take case, spacing
      // and `$` (spacing can change what the fold itself reads: "\\lex").
      const light = (t: string) => t.normalize('NFC').replace(/[−–—]/g, '-').replace(/[$\s]/g, '').toLowerCase();
      assert.ok(light(nowText) === light(ans) || normMcqText(nowText) === normMcqText(ans), `${label}: "${ans}" → ${nowText}`);
    }
    compared++;
  }
}

check('600 synthetic items without a collision: identical for every answer', () => {
  let made = 0;
  while (made < 600) {
    const n = 3 + Math.floor(rnd() * 3);
    const texts: string[] = [];
    while (texts.length < n) texts.push(rnd() < 0.08 && texts.length ? pick(texts) : pick(POOL)); // some duplicates
    const choices = item(...texts);
    if (mcqFoldCollides(texts, normMcqText)) continue;
    compare(choices, `synthetic#${made}`);
    made++;
  }
  assert.equal(colliding, 0);
});

check('300 synthetic items WITH a collision: a changed letter is always the more exact option', () => {
  const before = colliding;
  const twist = (t: string) => pick([t.toUpperCase(), t.toLowerCase(), t[0].toUpperCase() + t.slice(1).toLowerCase(), `-${t}`, t.replace(/[^A-Za-z0-9]/g, '')]);
  let made = 0;
  while (made < 300) {
    const base = pick(POOL);
    const texts = [base, twist(base), pick(POOL), pick(POOL)].sort(() => rnd() - 0.5);
    if (!mcqFoldCollides(texts, normMcqText)) continue;
    const choices = item(...texts);
    compare(choices, `colliding#${made}`);
    // Every option text that is unique in the item resolves to its own letter.
    for (const c of choices) {
      const same = choices.filter((o) => o.text.normalize('NFC').trim() === c.text.normalize('NFC').trim());
      if (/^\(?[A-Ea-e]\)?[.):]?$/.test(c.text.trim()) || !normMcqText(c.text)) continue; // read as a letter / nothing to match
      assert.equal(resolveMcqLetter(c.text, choices), same.length === 1 ? c.letter : null, `colliding#${made}: own text "${c.text}"`);
    }
    made++;
  }
  assert.equal(colliding - before, 300);
});

const realItems: Array<{ id: string; choices: Choice[] }> = [];
for (const it of FIXTURE_ITEMS) if (it.choices?.length) realItems.push({ id: it.id, choices: item(...it.choices) });
const formsDir = path.join(__dirname, '..', 'src', 'data', 'mock-forms');
for (const dir of fs.existsSync(formsDir) ? fs.readdirSync(formsDir).sort() : []) {
  const file = path.join(formsDir, dir, 'items.json');
  if (!fs.existsSync(file)) continue;
  for (const it of JSON.parse(fs.readFileSync(file, 'utf8')) as Array<{ id: string; choices?: string[] }>) {
    if (Array.isArray(it.choices) && it.choices.length) realItems.push({ id: `${dir}/${it.id}`, choices: item(...it.choices) });
  }
}
// The shape scripts/test-verify-answer-match.ts pins (LaTeX option texts).
realItems.push({
  id: 'verify-answer-match',
  choices: item(
    'If $\\lim_{x\\to c} f(x)=L$, then $f(c)=L$ must hold',
    'A limit exists only where the function is continuous',
    '$\\lim_{x\\to c} f(x)$ never equals $f(c)$',
    '$\\lim_{x\\to c} f(x)$ can exist even when $f(c)$ is undefined',
  ),
});

check(`real MCQ items in the repo (${realItems.length}): identical unless the item collides`, () => {
  const before = colliding;
  const collidingIds: string[] = [];
  for (const it of realItems) {
    const c0 = colliding;
    compare(it.choices, it.id);
    if (colliding > c0) collidingIds.push(`${it.id} ${JSON.stringify(it.choices.map((c) => c.text))}`);
  }
  assert.ok(realItems.length > 4, 'expected the mock-form items to be found');
  console.log(`    real items whose options collide under the fold: ${colliding - before}`);
  for (const line of collidingIds.slice(0, 12)) console.log(`      ${line}`);
});

// ── 3. the portal quiz grader ───────────────────────────────────────────────
console.log('mcqResponseCorrect (portal assessment)');

const ids = (...texts: string[]) => texts.map((text, i) => ({ id: String.fromCharCode(65 + i), text }));
check('genotypes: only the keyed option is right', () => {
  const key: McqKey = { choices: ids('TT', 'Tt', 'tt', 'Cannot be determined'), correctChoiceId: 'A', expectedAnswer: 'A' };
  assert.equal(mcqResponseCorrect(key, 'TT'), true);
  assert.equal(mcqResponseCorrect(key, 'Tt'), false); // was true
  assert.equal(mcqResponseCorrect(key, 'tt'), false); // was true
  assert.equal(oldMcqResponseCorrect(key, 'Tt'), true);
  assert.equal(mcqResponseCorrect(key, 'A'), true);
  assert.equal(mcqResponseCorrect(key, 'a'), true); // the letter in either case
  assert.equal(mcqResponseCorrect(key, 'B'), false);
});
check('genotypes keyed by option TEXT (plan item, lower-case ids)', () => {
  const choices = [{ id: 'a', text: 'TT' }, { id: 'b', text: 'Tt' }, { id: 'c', text: 'tt' }];
  const key: McqKey = { choices, correctChoiceId: 'b', expectedAnswer: 'Tt' };
  assert.equal(mcqResponseCorrect(key, 'Tt'), true);
  assert.equal(mcqResponseCorrect(key, ' Tt '), true);
  assert.equal(mcqResponseCorrect(key, 'TT'), false);
  assert.equal(mcqResponseCorrect(key, 'tt'), false);
  assert.equal(mcqResponseCorrect(key, 'B'), true);
  assert.equal(mcqResponseCorrect(key, 'b'), true);
  // A key with no flagged option: the text key alone decides, exactly.
  assert.equal(mcqResponseCorrect({ choices, expectedAnswer: 'Tt' }, 'tt'), false);
  assert.equal(mcqResponseCorrect({ choices, expectedAnswer: 'Tt' }, 'Tt'), true);
  // …and a LETTER key with no correctChoiceId is still a letter, either case.
  assert.equal(mcqResponseCorrect({ choices, expectedAnswer: 'B' }, 'b'), true);
});
check('items without a case collision: identical to the old grader', () => {
  let n = 0;
  for (let i = 0; i < 400; i++) {
    const texts: string[] = [];
    while (texts.length < 4) texts.push(pick(POOL));
    const lower = rnd() < 0.5;
    const choices = texts.map((text, k) => ({ id: String.fromCharCode((lower ? 97 : 65) + k), text }));
    if (mcqFoldCollides(texts.map((t) => t.replace(/\s+/g, ' ')))) continue;
    const right = Math.floor(rnd() * 4);
    const keys: McqKey[] = [
      { choices, correctChoiceId: choices[right].id, expectedAnswer: choices[right].id.toUpperCase() },
      { choices, correctChoiceId: choices[right].id, expectedAnswer: texts[right] },
      { choices, expectedAnswer: texts[right] },
      { choices, expectedAnswer: choices[right].id },
      { expectedAnswer: texts[right] },
    ];
    for (const key of keys) {
      for (const ans of [...LETTERY, ...texts.flatMap(variants)]) {
        assert.equal(mcqResponseCorrect(key, ans), oldMcqResponseCorrect(key, ans), `"${ans}" vs ${JSON.stringify(key)}`);
        n++;
      }
    }
  }
  assert.ok(n > 20000);
});

console.log(`\n${passed} checks passed (${compared} old-vs-new letter comparisons)`);
