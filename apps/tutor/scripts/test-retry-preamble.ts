/**
 * Validator retries never refer to the redo (GDI trial live run 1: "Let's
 * get the overview right this time"). withRetryPreamble puts RETRY_PREAMBLE
 * on a retry instruction exactly once, after the leading
 * "[validator feedback — not from the student]" marker (server guards key on
 * the leading "["), keeping the original text; VoiceTutorRealtime applies it
 * to every retry of a killed attempt, whatever the rejection kind.
 *
 * Run: npx tsx scripts/test-retry-preamble.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RETRY_PREAMBLE, withRetryPreamble } from '../src/lib/tutor/voice/retry-preamble';
import { buildValidatorFeedback, VALIDATOR_FEEDBACK_PREFIX } from '../src/lib/tutor/orchestrator/validator-feedback';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}
const count = (s: string, sub: string) => s.split(sub).length - 1;

test('preamble text verbatim', () => {
  assert.equal(RETRY_PREAMBLE, 'The student never heard your previous attempt. Speak as if for the first time: never say "this time", "again", "let me try that again", "let me get this right" or anything else that refers to a redo.');
});
test('plain instruction: prefixed once, original preserved', () => {
  const out = withRetryPreamble('Re-emit the tool call.');
  assert.equal(out, `${RETRY_PREAMBLE} Re-emit the tool call.`);
});
test('idempotent', () => {
  const once = withRetryPreamble('X');
  assert.equal(withRetryPreamble(once), once);
  assert.equal(count(withRetryPreamble(withRetryPreamble(once)), RETRY_PREAMBLE), 1);
});
for (const [label, rejections, killed] of [
  ['required_phrase_missing (killed)', [{ action: 'required_phrase_missing', reason: 'missing "x"' }], true],
  ['show_equation (killed)', [{ action: 'show_equation', reason: 'bad latex' }], true],
  ['turn continuation', [{ action: 'turn_incomplete_continue', reason: 'stopped early.' }], false],
  ['verdict withheld', [{ action: 'voice_verdict_withheld', reason: 'withheld.' }], false],
] as const) {
  test(`validator feedback, ${label}: marker stays first, preamble once, body preserved`, () => {
    const fb = buildValidatorFeedback({ rejections: [...rejections], attemptKilled: killed, originalTranscript: 'hello', includeStudentContext: true });
    const out = withRetryPreamble(fb);
    assert.ok(out.startsWith(`${VALIDATOR_FEEDBACK_PREFIX} ${RETRY_PREAMBLE} `));
    assert.equal(count(out, RETRY_PREAMBLE), 1);
    assert.equal(out.replace(`${RETRY_PREAMBLE} `, ''), fb);
    assert.equal(withRetryPreamble(out), out);
  });
}
test('wired at the retry composition site, after buildValidatorFeedback, all rejection kinds', () => {
  const src = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  const at = src.indexOf("'brain_validator_retry',");
  const block = src.slice(at, at + 4000);
  const fbAt = block.indexOf('runTranscript = buildValidatorFeedback(');
  const preAt = block.indexOf('runTranscript = withRetryPreamble(runTranscript)');
  assert.ok(fbAt > 0 && preAt > fbAt, `fb=${fbAt} pre=${preAt}`);
  assert.ok(/if \(TUTOR_RETRY_PREAMBLE && attemptKilled\) runTranscript = withRetryPreamble\(runTranscript\);/.test(block));
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
