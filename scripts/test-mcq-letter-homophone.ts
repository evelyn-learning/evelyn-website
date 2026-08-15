/**
 * Tests for MCQ letter-homophone normalization (2026-08-10 triage, session
 * portal-cb2addf5): "See." dispatched as ordinary chatter instead of the
 * MCQ answer "C" — ASR transcribes the spoken letter as the word it sounds
 * like, and nothing downstream recognized the homophone.
 *
 * Run: npx tsx scripts/test-mcq-letter-homophone.ts
 */
import { normalizeMcqLetterUtterance, extractChoiceLetters } from '../apps/marketing/src/lib/tutor/voice/mcq-letter-homophone';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const ABCD = ['A', 'B', 'C', 'D'];

// ---------- the session's exact case ----------
check('"See." → "C"', normalizeMcqLetterUtterance('See.', ABCD) === 'C');

// ---------- negative: no active MCQ ----------
check('no active MCQ (empty choiceLetters) → untouched', normalizeMcqLetterUtterance('See.', []) === null);

// ---------- negative: longer sentence never rewritten ----------
check('"see the graph" unchanged (longer sentence)', normalizeMcqLetterUtterance('see the graph', ABCD) === null);
check('"will it be graded" unchanged (longer sentence)', normalizeMcqLetterUtterance('will it be graded', ABCD) === null);
check('"can you say that again" unchanged', normalizeMcqLetterUtterance('can you say that again', ABCD) === null);

// ---------- each requested letter/homophone ----------
check('"Bee" → "B"', normalizeMcqLetterUtterance('Bee', ABCD) === 'B');
check('"Be" → "B"', normalizeMcqLetterUtterance('Be', ABCD) === 'B');
check('"Dee" → "D"', normalizeMcqLetterUtterance('Dee', ABCD) === 'D');
check('"Ay" → "A"', normalizeMcqLetterUtterance('Ay', ABCD) === 'A');
check('"Aye" → "A"', normalizeMcqLetterUtterance('Aye', ABCD) === 'A');
// R42 review round 1: 'eh' deliberately NOT a homophone for A — highest-FP
// shape (a confused student's "Eh?" must never dispatch as the answer "A").
check('"Eh" is NOT an A-homophone (dropped — highest false-positive risk)', normalizeMcqLetterUtterance('Eh', ABCD) === null);
check('"Eh?" is NOT an A-homophone either (trailing punctuation)', normalizeMcqLetterUtterance('Eh?', ABCD) === null);
check('"Sea" → "C"', normalizeMcqLetterUtterance('Sea', ABCD) === 'C');
check('"Cee" → "C"', normalizeMcqLetterUtterance('Cee', ABCD) === 'C');

// ---------- case-insensitive + trailing punctuation tolerance ----------
check('"SEE" (uppercase) → "C"', normalizeMcqLetterUtterance('SEE', ABCD) === 'C');
check('"Sea!" (trailing !) → "C"', normalizeMcqLetterUtterance('Sea!', ABCD) === 'C');
check('"cee?" (trailing ?) → "C"', normalizeMcqLetterUtterance('cee?', ABCD) === 'C');
check('"  Dee  " (whitespace) → "D"', normalizeMcqLetterUtterance('  Dee  ', ABCD) === 'D');

// ---------- "letter C" / "option C" forms ----------
check('"letter C" → "C"', normalizeMcqLetterUtterance('letter C', ABCD) === 'C');
check('"option C" → "C"', normalizeMcqLetterUtterance('option C', ABCD) === 'C');
check('"choice C" → "C"', normalizeMcqLetterUtterance('choice C', ABCD) === 'C');
check('"the answer C" → "C"', normalizeMcqLetterUtterance('the answer C', ABCD) === 'C');
check('"letter see" (framed homophone) → "C"', normalizeMcqLetterUtterance('letter see', ABCD) === 'C');

// ---------- letter not among the active choices ----------
check('"Dee" on a 3-choice A/B/C problem → untouched', normalizeMcqLetterUtterance('Dee', ['A', 'B', 'C']) === null);

// ---------- bare literal letters (already-understood form; no-op is fine) ----------
check('bare "c" → "C" (identity, harmless)', normalizeMcqLetterUtterance('c', ABCD) === 'C');

// ---------- a word that is homophone-shaped but embedded, not standalone ----------
check('"I see a bee" (multi-word, not a bare homophone) unchanged', normalizeMcqLetterUtterance('I see a bee', ABCD) === null);

// ---------- extractChoiceLetters ----------
{
  const showProblemChoices = [{ letter: 'A', text: '1' }, { letter: 'B', text: '2' }, { letter: 'C', text: '3' }];
  check('extractChoiceLetters: showProblem answerChoices (letter field)',
    JSON.stringify(extractChoiceLetters(showProblemChoices)) === JSON.stringify(['A', 'B', 'C']));

  const tryYourselfChoices = [{ id: 'A', text: '1' }, { id: 'B', text: '2' }];
  check('extractChoiceLetters: try-yourself choices (id field)',
    JSON.stringify(extractChoiceLetters(tryYourselfChoices)) === JSON.stringify(['A', 'B']));

  const noLetterField = [{ text: 'first' }, { text: 'second' }, { text: 'third' }];
  check('extractChoiceLetters: falls back to positional A/B/C when no letter/id field is present at all',
    JSON.stringify(extractChoiceLetters(noLetterField)) === JSON.stringify(['A', 'B', 'C']));

  check('extractChoiceLetters: empty/undefined → []',
    extractChoiceLetters(undefined).length === 0 && extractChoiceLetters([]).length === 0);

  // R42 review round 1: ProblemAnswerChoice.letter can legitimately be
  // numeric ("1", "2", ... — src/lib/knowledge/types.ts:272-275) and the
  // renderer badges that value verbatim. A numeric-labeled MCQ must NOT
  // get the positional A/B/C fallback — that would let "Ay" normalize to
  // "A" against a board that shows "1".
  const numericLetterField = [{ letter: '1', text: 'first' }, { letter: '2', text: 'second' }, { letter: '3', text: 'third' }];
  check('extractChoiceLetters: numeric letter field → [] (normalization disabled, no positional fallback)',
    extractChoiceLetters(numericLetterField).length === 0, JSON.stringify(extractChoiceLetters(numericLetterField)));

  const numericIdField = [{ id: '1', text: 'first' }, { id: '2', text: 'second' }];
  check('extractChoiceLetters: numeric id field (try-yourself shape) → [] (normalization disabled)',
    extractChoiceLetters(numericIdField).length === 0, JSON.stringify(extractChoiceLetters(numericIdField)));

  // End-to-end: a numeric-labeled problem's choiceLetters ([]) means
  // normalizeMcqLetterUtterance never fires, even for an otherwise-valid
  // homophone.
  check('numeric-labeled choices → normalization never fires end-to-end',
    normalizeMcqLetterUtterance('See.', extractChoiceLetters(numericLetterField)) === null);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
