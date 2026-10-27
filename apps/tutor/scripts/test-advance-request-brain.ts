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
  console.log('test:advance-request-brain PASS (3 cases)');
}

main().catch((err) => { console.error(err); process.exit(1); });
