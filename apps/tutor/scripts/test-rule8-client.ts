import { strict as assert } from 'node:assert';
import { countBoardRenderTools, shouldClientRequestRepair } from '../src/lib/tutor/voice/rule8-client';

assert.equal(countBoardRenderTools(['show_equation']), 1);
assert.equal(countBoardRenderTools(['advance_lesson']), 0);                 // live 17:47:34 false alarm
assert.equal(countBoardRenderTools(['tutor_scroll_whiteboard', 'tutor_scroll_whiteboard']), 0); // resume 18:13:16 false alarm
assert.equal(countBoardRenderTools(['advance_lesson', 'mark_segment_complete', 'show_problem']), 1);
assert.equal(countBoardRenderTools(['some_future_tool']), 1);              // unknown ⇒ counted (fail toward repair)
assert.equal(shouldClientRequestRepair({ serverToolCount: countBoardRenderTools(['advance_lesson']), paintedCount: 0, sentenceCount: 2 }), false);
console.log('rule8-client: all assertions passed');
