// scripts/test-self-correction-retry.ts
import { strict as assert } from 'node:assert';
import { buildSelfCorrectionRetryReason } from '../src/lib/tutor/voice/self-correction-retry';
const r = buildSelfCorrectionRetryReason({ sentence: 'Wait — let me match my board to your move exactly.', studentUtterance: 'take 4x to left', problemStatement: '6x - 12 = 4x + 10', lastBoardEquation: '6x - 2x - 12 = 4x - 2x + 10' });
assert.match(r, /take 4x to left/);
assert.match(r, /6x - 12 = 4x \+ 10/);
assert.match(r, /start from the student's move/i);
assert.doesNotMatch(r, /undefined/);
const bare = buildSelfCorrectionRetryReason({ sentence: 'Actually, no.', studentUtterance: '', problemStatement: undefined, lastBoardEquation: undefined });
assert.match(bare, /Re-emit your response cleanly/);
console.log('self-correction-retry: all assertions passed');
