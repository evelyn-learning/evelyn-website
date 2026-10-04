/**
 * LIVE smoke of the creation-time answer-key verifier (portal/key-verify.ts).
 *
 * Real model calls, NO database, NO env files: the API key must be passed on
 * the command line —
 *
 *   ANTHROPIC_API_KEY=… npx tsx scripts/audit/smoke-key-verify.ts
 *
 * Not a registered test (it costs money and needs the network). Exits 1 when
 * any item's status is not one of its expected statuses.
 */
import { verifyAnswerKey, keyVerifyModel, type VerifyAnswerKeyInput } from '../../src/lib/tutor/portal/key-verify';

interface Case {
  id: string;
  input: VerifyAnswerKeyInput;
  expect: string[];
}

const LINEAR = 'Solve: (3x + 7)/2 = 10. What is x?';
const INEQ = 'Solve the inequality: 2x + 3 < 13';
const MCQ_Q = 'What is the slope of the line through the points (1, 2) and (3, 10)?';
const MCQ_CHOICES = ['2', '4', '8', '1/4'];
const SCI_Q = 'Which organelle is the main site of ATP production by aerobic respiration in a eukaryotic cell?';

const CASES: Case[] = [
  { id: 'a linear, wrong key', input: { question: LINEAR, claimedAnswer: '11', answerFormat: 'numeric' }, expect: ['mismatch'] },
  { id: 'b linear, exact key', input: { question: LINEAR, claimedAnswer: '13/3', answerFormat: 'numeric' }, expect: ['verified'] },
  { id: 'c linear, decimal key', input: { question: LINEAR, claimedAnswer: '4.33', answerFormat: 'numeric' }, expect: ['verified'] },
  { id: 'd1 inequality x < 5', input: { question: INEQ, claimedAnswer: 'x < 5', answerFormat: 'free' }, expect: ['verified'] },
  { id: 'd2 inequality x > 5', input: { question: INEQ, claimedAnswer: 'x > 5', answerFormat: 'free' }, expect: ['mismatch'] },
  { id: 'd3 inequality x ≤ 5', input: { question: INEQ, claimedAnswer: 'x ≤ 5', answerFormat: 'free' }, expect: ['mismatch'] },
  { id: 'e1 mcq, right letter', input: { question: MCQ_Q, choices: MCQ_CHOICES, claimedAnswer: 'B', answerFormat: 'mcq' }, expect: ['verified'] },
  { id: 'e2 mcq, wrong letter', input: { question: MCQ_Q, choices: MCQ_CHOICES, claimedAnswer: 'C', answerFormat: 'mcq' }, expect: ['mismatch'] },
  { id: 'f1 science, right key', input: { question: SCI_Q, claimedAnswer: 'the mitochondrion', answerFormat: 'free' }, expect: ['verified'] },
  { id: 'f2 science, wrong key', input: { question: SCI_Q, claimedAnswer: 'the ribosome', answerFormat: 'free' }, expect: ['mismatch'] },
  {
    id: 'g ill-posed',
    input: { question: 'A block slides down an incline. Find its acceleration.', claimedAnswer: '4.9 m/s²', answerFormat: 'numeric' },
    expect: ['ill_posed', 'unverifiable'],
  },
];

async function main(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY must be passed on the command line (this script reads no env file).');
    process.exit(2);
  }
  console.log(`model=${keyVerifyModel()}`);
  let bad = 0;
  const rows = await Promise.all(
    CASES.map(async (c) => {
      const t0 = Date.now();
      const r = await verifyAnswerKey(c.input);
      return { c, r, ms: Date.now() - t0 };
    }),
  );
  for (const { c, r, ms } of rows) {
    const ok = c.expect.includes(r.status);
    if (!ok) bad++;
    console.log(
      [
        ok ? 'OK  ' : 'FAIL',
        c.id.padEnd(24),
        `claimed=${JSON.stringify(c.input.claimedAnswer)}`,
        `status=${r.status}`,
        `solver=${JSON.stringify(r.solverAnswer ?? '')}`,
        `ms=${ms}`,
        `calls=${r.usage.calls} in=${r.usage.inputTokens} out=${r.usage.outputTokens}`,
        `reason=${JSON.stringify(r.reason)}`,
      ].join(' | '),
    );
  }
  console.log(bad === 0 ? `ALL ${rows.length} OK` : `${bad} of ${rows.length} NOT as expected`);
  process.exit(bad === 0 ? 0 : 1);
}

void main();
