import { strict as assert } from 'node:assert';
import { verifiedKeyForJudgeGate } from '../src/lib/tutor/voice/judge-gate-key';

// tracked problem with a pinned key wins
assert.equal(verifiedKeyForJudgeGate({ pending: { statement: 'Solve 2(x+3)=20', expectedAnswer: 'x=7' }, current: { statement: '6x - 12 = 4x + 10', expectedAnswer: 'x=11' }, boardText: '6x - 12 = 4x + 10' }), 'x=11');
// live 17:42: pending key for a problem that never painted ⇒ NO key
assert.equal(verifiedKeyForJudgeGate({ pending: { statement: 'Solve 2(x+3)=20', expectedAnswer: 'x=7' }, current: { statement: '6x - 12 = 4x + 10' }, boardText: 'Subtracting 2x from both sides: 6x - 2x - 12 = 4x - 2x + 10' }), undefined);
// pending problem IS on the board (rendered as an equation card, not show_problem) ⇒ usable
assert.equal(verifiedKeyForJudgeGate({ pending: { statement: '2(x + 3) = 20', expectedAnswer: 'x=7' }, current: null, boardText: 'Fresh equation: 2(x+3) = 20' }), 'x=7');
assert.equal(verifiedKeyForJudgeGate({ pending: null, current: null, boardText: '' }), undefined);
console.log('judge-gate-key: all assertions passed');
