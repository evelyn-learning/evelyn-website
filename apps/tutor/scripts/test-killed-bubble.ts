/**
 * A killed attempt's chat bubble while its retry runs (orchestrator/killed-bubble.ts).
 *
 * Regression (local Geometry run, portal-fbf35f94, 10-27): "can you check my
 * answer x = 4" — the judge killed the reply after its first sentence; for the
 * ~5 s the retry ran, the bubble showed only "That isn't what the vertical
 * angles problem gives." with no typing caret, so it read as the whole reply
 * (the test runner and a student both took it as finished). A killed bubble
 * waiting on its retry is shown dimmed AND still in progress.
 *
 * Run: npx tsx scripts/test-killed-bubble.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { markKilledBubbleRevising } from '../src/lib/tutor/orchestrator/killed-bubble';

const entries = [
  { id: 'student-1', role: 'student', text: 'can you check my answer x = 4' },
  { id: 'tutor-streaming-1-0', role: 'tutor', text: "That isn't what the vertical angles problem gives.", streaming: true },
];
const r = markKilledBubbleRevising(entries, 'tutor-streaming-1-0');
assert.equal(r.changed, true);
const b = r.entries[1] as { revising?: boolean; streaming?: boolean };
assert.equal(b.revising, true, 'dimmed');
assert.equal(b.streaming, true, 'still in progress (typing caret) — never shown as a finished reply');
assert.equal(entries[1].streaming, true, 'input not mutated');
assert.equal(r.entries[0], entries[0], 'other entries untouched');
const again = markKilledBubbleRevising(r.entries, 'tutor-streaming-1-0');
assert.equal(again.changed, false, 'idempotent');
assert.equal(markKilledBubbleRevising(entries, 'missing').changed, false);

// Wiring: the kill → retry hand-off uses it; revising bubbles are still dropped at turn end.
const src = readFileSync(join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
assert.match(src, /markKilledBubbleRevising\(transcriptRef\.current, killedStreamingId\)/);
assert.ok(!/return \{ \.\.\.e, revising: true, streaming: false \};/.test(src), 'the old "finished-looking" revising bubble is gone');
assert.match(src, /!\(e\.revising && typeof e\.id === 'string' && e\.id\.startsWith\(turnStreamingPrefix\)\)/, 'turn-end cleanup still drops revising bubbles');
console.log('test:killed-bubble PASS');
