/**
 * Unit tests for the perception heuristic classifier (Stage 1).
 *
 * Focus: state-aware filler semantics (2026-07-11 fix). While the tutor is
 * LISTENING, a bare acknowledgement ("yeah", "okay", "yeah okay") is the
 * student's ANSWER — e.g. to "shall we move on?" — and must classify as
 * new_turn so the perception direct-dispatch path fires a brain turn
 * (Stage 4 made perception the sole input authority; a 'filler' verdict in
 * listening is a silent drop). Pure hesitations ("um", "uh") still drop in
 * every state, and acknowledgements during speaking/processing stay filler
 * (defence layer 3 — false-barge-in protection).
 *
 * Run: npm run test:perception-classifier
 */
import {
  classifyHeuristic,
  type HeuristicInput,
  type ProductionStateForClassifier,
} from '../src/lib/tutor/voice/perception-classifier';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

function classify(transcript: string, productionState: ProductionStateForClassifier) {
  const input: HeuristicInput = {
    transcript,
    productionState,
    recentTtsScripts: [],
    now: 1_000_000,
    speechStartedAt: 999_000,
  };
  return classifyHeuristic(input);
}

console.log('\n=== Listening: bare acknowledgements are answers (regression 2026-07-11) ===');
{
  // Live repro: tutor asked a question, student said "Yeah, okay." 3×,
  // classifier tagged filler each time, turn never dispatched.
  const r = classify('Yeah, okay.', 'listening');
  check('"Yeah, okay." in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('Okay.', 'listening');
  check('"Okay." in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('yeah', 'listening');
  check('"yeah" in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('Mhm.', 'listening');
  check('"Mhm." in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}
{
  // Mixed hesitation+ack ("um, yeah") — the ack carries the meaning.
  const r = classify('Um, yeah.', 'listening');
  check('"Um, yeah." in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}
{
  // 'connected' shares the listening input path.
  const r = classify('Okay.', 'connected');
  check('"Okay." in connected → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}

console.log('\n=== Listening: pure hesitations still drop ===');
{
  const r = classify('Um.', 'listening');
  check('"Um." in listening → filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('uh, hmm', 'listening');
  check('"uh, hmm" in listening → filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}

console.log('\n=== Speaking/processing: acknowledgements stay filler (barge-in defence unchanged) ===');
{
  const r = classify('Yeah, okay.', 'speaking');
  check('"Yeah, okay." in speaking → filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('okay', 'speaking');
  check('"okay" in speaking → filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('Yeah, okay.', 'processing');
  check('"Yeah, okay." in processing → filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}

console.log('\n=== Unchanged behaviour around the fix ===');
{
  const r = classify('', 'listening');
  check('empty transcript → noise', r.verdict === 'noise', `verdict=${r.verdict}`);
}
{
  const r = classify('What is a derivative?', 'listening');
  check('real question in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict}`);
}
{
  const r = classify('No, wait.', 'speaking');
  check('"No, wait." in speaking → barge_in', r.verdict === 'barge_in', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('so the answer is', 'speaking');
  check('mid-length ambiguous in speaking → escalate', r.verdict === 'escalate', `verdict=${r.verdict}`);
}
{
  const r = classify('and the radius too', 'processing');
  check('continuation lead in processing → continuation', r.verdict === 'continuation', `verdict=${r.verdict}`);
}
{
  const r = classify('okay right', 'error');
  check('ack bigram in transient state → filler (no action path anyway)', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
