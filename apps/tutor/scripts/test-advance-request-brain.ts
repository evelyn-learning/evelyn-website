/**
 * A navigation turn reaches the brain without "grade it against the question
 * just left" (orchestrator/advance-request.ts wired into claude-brain.ts).
 *
 * Regression: lesson portal-939d545b (Haiku 5.5, 10-27) — the runtime moved
 * the lesson on "no move to the next section", but the <active_question>
 * block told the brain the student's reply answered the open question, and
 * it said "Got it, we'll stay on the two-points question."
 *
 * Fake model client, no network. Run: npx tsx scripts/test-advance-request-brain.ts
 */
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/test-no-db';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';

import { strict as assert } from 'node:assert';

async function main() {
  const registry = await import('../src/lib/tutor/ai/model-registry');
  const brain = await import('../src/lib/tutor/voice/claude-brain');
  const adv = await import('../src/lib/tutor/orchestrator/advance-request');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = registry.getModelClient('brain').client as any;
  const requests: Array<{ messages: Array<{ content: unknown }> }> = [];
  client.messages.stream = (params: { messages: Array<{ content: unknown }> }) => {
    requests.push(JSON.parse(JSON.stringify(params)));
    const text = 'Moving on.';
    const events = [
      { type: 'message_start' },
      { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } }, { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text } }, { type: 'content_block_stop', index: 0 },
      { type: 'message_delta', delta: { stop_reason: 'end_turn' } }, { type: 'message_stop' },
    ];
    return {
      abort() {}, controller: { abort() {} },
      async finalMessage() { return { content: [{ type: 'text', text }], stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1 } }; },
      async *[Symbol.asyncIterator]() { for (const e of events) yield e; },
    };
  };
  const tutorQ = 'Using only the coordinates of A, which is at (1, 2), and B, which is at (4, 6), how could you measure how steep the line through them is?';
  const base = {
    systemPrompt: 'CORE. SESSION.', systemPromptCore: 'CORE. ',
    conversationHistory: [{ role: 'assistant' as const, content: tutorQ }],
    whiteboardSnapshot: [], tools: [], textTurnShape: true,
  };
  const contentOf = async (studentTranscript: string, studentMessage: string) => {
    requests.length = 0;
    const l = console.log, w = console.warn; console.log = () => {}; console.warn = () => {};
    try { for await (const _ of brain.streamBrainTurn({ ...base, studentTranscript, studentMessage } as never)) { /* drain */ } }
    finally { console.log = l; console.warn = w; }
    const msgs = requests[0].messages;
    return String(msgs[msgs.length - 1].content);
  };
  const said = 'no move to the next section';
  const plain = await contentOf(said, said);
  assert.match(plain, /<active_question>/, 'control: an ordinary reply carries the open question');
  const fact = adv.describeTypedAdvance({ target: 'gen-x.lo-3-hook', kind: 'hook', objective: 'Interpret positive, negative, zero, and undefined slopes.' });
  const nav = await contentOf(`${fact}\n\n${said}`, said);
  assert.ok(!nav.includes('<active_question>'), 'navigation turn: no <active_question>');
  assert.ok(!nav.includes('<continuation_guard>'), 'navigation turn: no verdict guard');
  assert.ok(nav.includes('[Lesson auto-advanced:'), 'the fact reaches the brain');
  const here = adv.describeAlreadyOnObjective({ named: 'slope intercept form', target: 'gen-x.lo-4-hook' });
  const stay = await contentOf(`${here}\n\nmove on to slope intercept form`, 'move on to slope intercept form');
  assert.ok(!stay.includes('<active_question>'), 'already-here turn: no <active_question>');
  // Round 5 (portal-d82e6e5e): the runtime moved obj 2 → 3 on "no move to the
  // next section", then the brain called advance_lesson {to:"previous"} —
  // "we'll stay on the two-point problem. I'm moving the lesson back".
  const scriptedTool = (to: string) => {
    client.messages.stream = (params: { messages: Array<{ content: unknown }> }) => {
      requests.push(JSON.parse(JSON.stringify(params)));
      const first = requests.length === 1;
      const blocks: Array<Record<string, unknown>> = first
        ? [{ type: 'text', text: 'Okay.' }, { type: 'tool_use', id: 'a1', name: 'advance_lesson', input: { to } }]
        : [{ type: 'text', text: 'What do you notice?' }];
      const events: unknown[] = [{ type: 'message_start' }];
      blocks.forEach((b, index) => {
        if (b.type === 'text') {
          events.push({ type: 'content_block_start', index, content_block: { type: 'text', text: '' } }, { type: 'content_block_delta', index, delta: { type: 'text_delta', text: b.text } });
        } else {
          events.push({ type: 'content_block_start', index, content_block: { type: 'tool_use', id: b.id, name: b.name, input: {} } }, { type: 'content_block_delta', index, delta: { type: 'input_json_delta', partial_json: JSON.stringify(b.input) } });
        }
        events.push({ type: 'content_block_stop', index });
      });
      const stop = first ? 'tool_use' : 'end_turn';
      events.push({ type: 'message_delta', delta: { stop_reason: stop } }, { type: 'message_stop' });
      return {
        abort() {}, controller: { abort() {} },
        async finalMessage() { return { content: blocks, stop_reason: stop, usage: { input_tokens: 1, output_tokens: 1 } }; },
        async *[Symbol.asyncIterator]() { for (const e of events) yield e; },
      };
    };
  };
  const segIndex = ['intro', 'g.lo-2-hook', 'g.lo-2-try', 'g.lo-3-hook', 'g.lo-4-hook', 'recap'].map((id) => ({ id, kind: 'hook' }));
  const lessonPlanContext = { plan: { id: 'g', title: 'T', grade: '8', subject: 'math', los: [], estimatedMinutes: 10 }, currentSegmentId: 'g.lo-3-hook', currentSegment: { id: 'g.lo-3-hook', kind: 'hook' }, segmentIndex: segIndex };
  const eventsOf = async (studentTranscript: string, studentMessage: string) => {
    requests.length = 0;
    const out: Array<Record<string, unknown>> = [];
    const l = console.log, w = console.warn; console.log = () => {}; console.warn = () => {};
    try { for await (const ev of brain.streamBrainTurn({ ...base, studentTranscript, studentMessage, lessonPlanContext } as never)) out.push(ev as unknown as Record<string, unknown>); }
    finally { console.log = l; console.warn = w; }
    return out;
  };
  const moved = adv.describeTypedAdvance({ target: 'g.lo-3-hook', kind: 'hook', declinedOffer: true });
  for (const to of ['previous', 'g.lo-2-try']) {
    scriptedTool(to);
    const evs = await eventsOf(`${moved}\n\n${said}`, said);
    assert.ok(!evs.some((e) => e.type === 'tool-call' && e.name === 'advance_lesson'), `runtime-advanced turn: advance_lesson to "${to}" is not dispatched`);
    assert.ok(evs.some((e) => e.type === 'tool-rejected' && e.name === 'advance_lesson'), 'it is rejected with a reason the model reads');
  }
  scriptedTool('previous');
  const bare = await eventsOf('move on', 'move on');
  assert.ok(!bare.some((e) => e.type === 'tool-call' && e.name === 'advance_lesson'), 'a move request (no runtime advance) never moves back either');
  scriptedTool('next');
  const fwd = await eventsOf(`${moved}\n\n${said}`, said);
  assert.ok(fwd.some((e) => e.type === 'tool-call' && e.name === 'advance_lesson'), 'forward stays allowed');
  scriptedTool('previous');
  const ordinary = await eventsOf('can we go back to the last part?', 'can we go back to the last part?');
  assert.ok(ordinary.some((e) => e.type === 'tool-call' && e.name === 'advance_lesson'), 'an ordinary turn may still go back');
  console.log('test:advance-request-brain PASS (8 cases)');
}

main().catch((err) => { console.error(err); process.exit(1); });
