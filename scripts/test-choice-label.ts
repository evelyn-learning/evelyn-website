/**
 * Unit tests for MCQ choice-label de-duplication (choiceLabel.ts).
 *
 * Round 29 (live SAT session-1784936161888): the "Root Multiplicity"
 * show_problem card rendered its four choices twice — the statement text
 * embedded the full "A) … D)" block AND answerChoices was also filled.
 * stripEmbeddedChoiceBlock removes the redundant trailing block from the
 * statement, exact-match-only.
 *
 * Usage: npx tsx scripts/test-choice-label.ts  (npm run test:choice-label)
 */
import { stripRedundantChoiceLabel, stripEmbeddedChoiceBlock } from '../apps/marketing/src/app/tutor/components/whiteboard/choiceLabel';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const CHOICES = [
  { letter: 'A', text: 'y = (x-2)(x+1)' },
  { letter: 'B', text: 'y = (x-2)²(x+1)' },
  { letter: 'C', text: 'y = (x+2)²(x-1)' },
  { letter: 'D', text: 'y = (x-2)(x+1)²' },
];

// The live repro: statement embeds the whole block (with $-wrapped math).
{
  const statement =
    'The graph of a polynomial function is shown. Which could be the equation?\n\n' +
    'A) $y = (x-2)(x+1)$\nB) $y = (x-2)²(x+1)$\nC) $y = (x+2)²(x-1)$\nD) $y = (x-2)(x+1)²$';
  const out = stripEmbeddedChoiceBlock(statement, CHOICES);
  check('embedded block stripped', out === 'The graph of a polynomial function is shown. Which could be the equation?', out);
}

// Statement without embedded choices — untouched.
{
  const statement = 'Which of the following could be the equation of this function?';
  check('clean statement untouched', stripEmbeddedChoiceBlock(statement, CHOICES) === statement);
}

// Mentioning a choice letter mid-prose is not a block.
{
  const statement = 'Look at choice B) y = (x-2)²(x+1) and explain why it fits.';
  check('prose mention untouched', stripEmbeddedChoiceBlock(statement, CHOICES) === statement);
}

// Mismatched text (choices differ) — untouched.
{
  const statement = 'Pick one.\nA) y = x\nB) y = 2x\nC) y = 3x\nD) y = 4x';
  check('non-matching block untouched', stripEmbeddedChoiceBlock(statement, CHOICES) === statement);
}

// Partial block (only two of four lines) — untouched.
{
  const statement = 'Pick one.\nC) y = (x+2)²(x-1)\nD) y = (x-2)(x+1)²';
  check('partial block untouched', stripEmbeddedChoiceBlock(statement, CHOICES) === statement);
}

// Statement that IS only the block — never blanked.
{
  const statement = 'A) y = (x-2)(x+1)\nB) y = (x-2)²(x+1)\nC) y = (x+2)²(x-1)\nD) y = (x-2)(x+1)²';
  check('never blanks statement', stripEmbeddedChoiceBlock(statement, CHOICES) === statement);
}

// No choices → passthrough.
check('no choices passthrough', stripEmbeddedChoiceBlock('Hello', []) === 'Hello');
check('undefined statement', stripEmbeddedChoiceBlock(undefined, CHOICES) === '');

// Existing helper still behaves (regression guard).
check('leading label stripped', stripRedundantChoiceLabel('A) 5x + 3', 'A') === '5x + 3');
check('non-matching label kept', stripRedundantChoiceLabel('B) 5x + 3', 'A') === 'B) 5x + 3');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
