/**
 * Task 13 — the <session_struggles> block. Pure string builder: the brain is
 * told what the deterministic ledger holds so a goodbye turn cannot claim
 * "all locked in" while the ledger has detections (live 2026-09-06).
 */
import { strict as assert } from 'node:assert';
import { formatSessionStrugglesBlock } from '../src/lib/tutor/voice/session-struggles-block';

assert.equal(formatSessionStrugglesBlock(undefined), '');
assert.equal(formatSessionStrugglesBlock([]), '');
const b = formatSessionStrugglesBlock([{ loId: 'alg1.multi-step', title: 'Variables on both sides', detections: 2 }, { loId: 'alg1.classify', title: 'Classifying solutions', detections: 1 }]);
assert.match(b, /^<session_struggles>/);
assert.match(b, /alg1\.multi-step/);
assert.match(b, /Variables on both sides \(struggled 2×\)/);
assert.match(b, /assignLoIds/);
assert.match(b, /<\/session_struggles>\n\n$/);
console.log('session-struggles-block: all assertions passed');
