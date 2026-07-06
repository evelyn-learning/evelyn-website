// scripts/tutor/voice-harness/utterances.test.ts
import assert from 'node:assert';
import { UTTERANCES } from './utterances';

const ids = new Set(UTTERANCES.map((u) => u.id));
assert.strictEqual(ids.size, UTTERANCES.length, 'utterance ids must be unique');
assert.ok(UTTERANCES.length >= 12, 'need at least 12 utterances');
for (const u of UTTERANCES) {
  assert.ok(u.tts.length > 0, `${u.id}: empty tts text`);
  assert.ok(!/\\[a-z]+/i.test(u.tts), `${u.id}: LaTeX command survived rewriteForTTS: ${u.tts}`);
  assert.ok(!/\bsin\b|\bcos\b|\bln\b/.test(u.tts), `${u.id}: unexpanded math abbreviation: ${u.tts}`);
}
const styles = new Set(UTTERANCES.map((u) => u.style));
for (const s of ['math', 'alphanumeric', 'encouragement', 'explanation', 'question']) {
  assert.ok(styles.has(s), `missing style: ${s}`);
}
console.log(`OK — ${UTTERANCES.length} utterances validated`);
