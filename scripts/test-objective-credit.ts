/**
 * Unit test for the objective-correct pacing-credit decision (R47 Task 1,
 * session portal-d859df30): a deterministic false-denial kill (arithmetic-
 * claim / simplification-verdict / inverse-verdict) IS machine proof the
 * student's answer was right — the affirm/correction regexes are only
 * fallback heuristics over brain prose and misread post-kill retries that
 * NARRATE the correction ("Right, exactly. 72 minus 3 is 69 — so your setup
 * and your arithmetic were…" tripped brainCorrectionRegex and fired
 * streak-incorrect on a turn the brain got right). An objective signal for
 * THIS turn must force 'correct' over whatever the regexes read.
 * Usage: npx tsx scripts/test-objective-credit.ts
 */
import { decidePacingCredit, type ObjectiveCorrectSignal } from '../src/lib/tutor/voice/objective-credit';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — got: ${detail}` : ''}`); }
}

const signal: ObjectiveCorrectSignal = { source: 'arith_false_denial', segId: 'try-easy-1', atMs: 1000 };

// --- objective signal present: forces correct regardless of regex reading ---
{
  // the live-incident shape: isVerification true, isAffirm true (retry opens
  // "Right, exactly."), but isCorrect ALSO true (the correction-narrative
  // phrasing trips brainCorrectionRegex on fullText) — today's code would
  // fall into the isCorrect branch and fire streak-incorrect. The signal
  // must override.
  const r = decidePacingCredit({ isVerification: true, isAffirm: true, isCorrect: true, objectiveSignal: signal });
  check('objective forces correct over isCorrect=true (live shape)', r.credit === 'correct' && r.objective === true, JSON.stringify(r));
}
{
  // deliberate widening: objective credit fires even when the verification
  // classifier read the turn as non-verification — the deterministic kill
  // only fires when the student DID state an answer, a stronger signal than
  // the classifier's heuristic read of the utterance.
  const r = decidePacingCredit({ isVerification: false, isAffirm: false, isCorrect: false, objectiveSignal: signal });
  check('objective credits even when isVerification=false', r.credit === 'correct' && r.objective === true, JSON.stringify(r));
}
{
  // objective signal wins even against a plain incorrect-only reading
  const r = decidePacingCredit({ isVerification: true, isAffirm: false, isCorrect: true, objectiveSignal: signal });
  check('objective forces correct over affirm=false/isCorrect=true', r.credit === 'correct' && r.objective === true, JSON.stringify(r));
}

// --- no objective signal: byte-match today's regex behavior ---
{
  const r = decidePacingCredit({ isVerification: true, isAffirm: true, isCorrect: false, objectiveSignal: null });
  check('no-signal affirm-only → correct, not objective', r.credit === 'correct' && r.objective === false, JSON.stringify(r));
}
{
  const r = decidePacingCredit({ isVerification: true, isAffirm: false, isCorrect: true, objectiveSignal: null });
  check('no-signal correction → incorrect', r.credit === 'incorrect' && r.objective === false, JSON.stringify(r));
}
{
  const r = decidePacingCredit({ isVerification: false, isAffirm: true, isCorrect: false, objectiveSignal: null });
  check('no-signal non-verification → none', r.credit === 'none' && r.objective === false, JSON.stringify(r));
}
{
  const r = decidePacingCredit({ isVerification: true, isAffirm: true, isCorrect: true, objectiveSignal: null });
  check('no-signal affirm+correction → incorrect (correction wins)', r.credit === 'incorrect' && r.objective === false, JSON.stringify(r));
}
{
  const r = decidePacingCredit({ isVerification: true, isAffirm: false, isCorrect: false, objectiveSignal: null });
  check('no-signal neither affirm nor correction → none', r.credit === 'none' && r.objective === false, JSON.stringify(r));
}
{
  const r = decidePacingCredit({ isVerification: false, isAffirm: false, isCorrect: false, objectiveSignal: null });
  check('null-signal + nothing → none', r.credit === 'none' && r.objective === false, JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
