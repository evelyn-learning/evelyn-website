import type { Scenario } from '../types';

/** R1 reproduction (2026-09-07): two problems solved in ONE segment with the
 *  brain's habitual step labels ("Collecting x terms", "Final answer"). Every
 *  show_equation tool call must produce a board entry: count `tool_call
 *  Whiteboard tool: showEquation` events vs showEquation whiteboardCommands
 *  in the saved session — they must be equal, and no
 *  `show_equation_label_duplicate` event may fire for a different page. */
const scenario: Scenario = {
  name: 'render-step-labels',
  description: 'two multi-step equations in one segment; every step equation must paint (R1)',
  start: { subject: 'math', level: '9-10', topic: 'algebra-1', lessonPlanId: 'evelyn.hs.alg1.multi-step-equations.v1', studentName: 'Probe Student', studentId: 'e2e-probe-r1' },
  seedTurns: [],
  testTurns: [
    { say: 'can we solve 4x - 7 = 2x + 9 together, step by step, writing each step on the board', timeoutMs: 120_000, watchFor: 'showEquation painted with an id' },
    { say: 'subtract 2x from both sides', watchFor: 'render_sync_flush with (showEquation-N)' },
    { say: 'add 7 to both sides, then divide by 2, so x = 8', watchFor: 'the "Final answer" equation paints' },
    { say: 'great, now a fresh one: 6x - 12 = 4x + 10, same steps please', watchFor: 'the fresh equation paints — this is the case that used to drop' },
    { say: 'take 4x to the left', watchFor: 'the collecting step paints even though the label repeats' },
    { say: 'add 12 then divide by 2, x = 11', watchFor: 'a second "Final answer" paints; no rule8_client_repair sent=1 painted=0' },
  ],
};
export default scenario;
