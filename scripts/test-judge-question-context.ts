/**
 * Tests for the judge prompt assembly (src/lib/tutor/judge-prompt.ts) —
 * specifically the <tutor_question> context block added 2026-07-29 after
 * demo session portal-efe6b838-5bbb-49d4-9824-6245a656ddf8: the brain
 * falsely denied a correct answer ("Is it X?" → "Not quite") and the
 * judge passed the turn (grounded=true) because it never saw the QUESTION
 * — the question lived in the tutor's PREVIOUS turn, which the judge
 * request didn't carry. Affirmation/denial cross-checks can't re-derive
 * correctness without knowing what was asked.
 *
 * Run: npx tsx scripts/test-judge-question-context.ts
 */
import { JUDGE_SYSTEM_PROMPT, buildJudgeUserContent } from '../src/lib/tutor/judge-prompt';

let passed = 0, failed = 0;
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const base = {
  boardSummary: 'Equation card: x^2+1 ) x^3',
  spokenText: 'Not quite. Think of it like regular long division.',
};

// Question context present → <tutor_question> block, placed before <student_answer>.
const full = buildJudgeUserContent({
  ...base,
  studentAnswer: 'Is it X?',
  questionContext: 'If you divide x^3 by x^2+1, what is the first term of the quotient?',
});
check('renders <tutor_question> block', full.includes('<tutor_question>\nIf you divide x^3 by x^2+1, what is the first term of the quotient?\n</tutor_question>'));
check('question precedes student_answer', full.indexOf('<tutor_question>') < full.indexOf('<student_answer>'));
check('student_answer precedes tutor_said', full.indexOf('<student_answer>') < full.indexOf('<tutor_said>'));

// Absent / blank question context → no block.
check('omitted when absent', !buildJudgeUserContent({ ...base, studentAnswer: 'Is it X?' }).includes('<tutor_question>'));
check('omitted when blank', !buildJudgeUserContent({ ...base, studentAnswer: 'Is it X?', questionContext: '   ' }).includes('<tutor_question>'));

// Untouched behavior.
check('whitespace trimmed', buildJudgeUserContent({ ...base, questionContext: '  what is 2+2?  ' }).includes('<tutor_question>\nwhat is 2+2?\n</tutor_question>'));
check('empty board → placeholder', buildJudgeUserContent({ boardSummary: '', spokenText: 'hi' }).includes('(whiteboard is empty)'));
check('focus block preserved', buildJudgeUserContent({ ...base, focus: 'the card' }).includes('<focus>\nthe card\n</focus>'));
check('no student_answer block when absent', !buildJudgeUserContent(base).includes('<student_answer>'));

// System prompt teaches the judge to use the block for verdict checks.
check('system prompt references <tutor_question>', JUDGE_SYSTEM_PROMPT.includes('<tutor_question>'));

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} judge-question-context tests passed.`);
