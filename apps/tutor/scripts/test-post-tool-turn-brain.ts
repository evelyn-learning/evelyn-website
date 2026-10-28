/**
 * The brain's agent loop around a tool call, end to end with a fake model
 * client (no network): voice/post-tool-turn.ts wired into claude-brain.ts.
 *
 *  A. lead-in + tool + end_turn, no question → one text-only follow-up call
 *     carrying THIN_TURN_RESCUE_INSTRUCTION; its question reaches the student.
 *  B. reply + tool (stop=tool_use) → the tool_result quotes what was sent; a
 *     second call that restates it is dropped from the sentences and fullText.
 *
 * Run: npx tsx scripts/test-post-tool-turn-brain.ts
 */
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/test-no-db';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';

import { strict as assert } from 'node:assert';

type Block = { type: 'text'; text: string } | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> };
type Scripted = { blocks: Block[]; stop: string };

async function main() {
  const registry = await import('../src/lib/tutor/ai/model-registry');
  const brain = await import('../src/lib/tutor/voice/claude-brain');
  const ptt = await import('../src/lib/tutor/voice/post-tool-turn');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = registry.getModelClient('brain').client as any;
  const requests: Array<Record<string, unknown> & { messages: Array<{ role: string; content: unknown }> }> = [];
  let script: Scripted[] = [];
  client.messages.stream = (params: Record<string, unknown> & { messages: Array<{ role: string; content: unknown }> }) => {
    requests.push(JSON.parse(JSON.stringify(params)));
    const step = script.shift() ?? { blocks: [{ type: 'text', text: '' }], stop: 'end_turn' };
    const events: unknown[] = [{ type: 'message_start' }];
    step.blocks.forEach((b, index) => {
      if (b.type === 'text') {
        events.push({ type: 'content_block_start', index, content_block: { type: 'text', text: '' } });
        events.push({ type: 'content_block_delta', index, delta: { type: 'text_delta', text: b.text } });
      } else {
        events.push({ type: 'content_block_start', index, content_block: { type: 'tool_use', id: b.id, name: b.name, input: {} } });
        events.push({ type: 'content_block_delta', index, delta: { type: 'input_json_delta', partial_json: JSON.stringify(b.input) } });
      }
      events.push({ type: 'content_block_stop', index });
    });
    events.push({ type: 'message_delta', delta: { stop_reason: step.stop } }, { type: 'message_stop' });
    return {
      abort() {}, controller: { abort() {} },
      async finalMessage() { return { content: step.blocks, stop_reason: step.stop, usage: { input_tokens: 1, output_tokens: 1 } }; },
      async *[Symbol.asyncIterator]() { for (const e of events) yield e; },
    };
  };
  const base = {
    systemPrompt: 'CORE. SESSION.', systemPromptCore: 'CORE. ',
    conversationHistory: [{ role: 'assistant' as const, content: 'What do you get?' }],
    whiteboardSnapshot: [], tools: [],
    studentTranscript: 'can you help me with this one', studentMessage: 'can you help me with this one',
  };
  const run = async (steps: Scripted[]) => {
    script = steps; requests.length = 0;
    const events: Array<Record<string, unknown>> = [];
    const l = console.log, w = console.warn; console.log = () => {}; console.warn = () => {};
    try { for await (const ev of brain.streamBrainTurn(base as never)) events.push(ev as unknown as Record<string, unknown>); }
    finally { console.log = l; console.warn = w; }
    const sentences = events.filter((e) => e.type === 'sentence').map((e) => String(e.text));
    const done = events.find((e) => e.type === 'done') as { fullText: string; stopReason: string } | undefined;
    return { events, sentences, done };
  };
  const tool = (id: string): Block => ({ type: 'tool_use', id, name: 'show_equation', input: { latex: 'x^2 - 4 = 0' } });
  let n = 0;
  const section = async (name: string, fn: () => Promise<void>) => { await fn(); n++; console.log(`  ✓ ${name}`); };

  await section('A: lead-in + tool + end_turn → one text-only follow-up asks the question', async () => {
    const r = await run([
      { blocks: [{ type: 'text', text: "Sure, let's take this one step at a time. Here it is on the board." }, tool('t1')], stop: 'end_turn' },
      { blocks: [{ type: 'text', text: 'What would you do first to the top?' }], stop: 'end_turn' },
    ]);
    assert.equal(requests.length, 2, 'two calls');
    assert.equal(requests[1].tools, undefined, 'the follow-up offers no tools');
    const last = requests[1].messages[requests[1].messages.length - 1];
    assert.equal(last.content, ptt.THIN_TURN_RESCUE_INSTRUCTION);
    assert.ok(r.sentences.includes('What would you do first to the top?'), JSON.stringify(r.sentences));
    assert.match(r.done!.fullText, /on the board\. What would you do first/);
    assert.match(r.done!.stopReason, /thin-rescued/);
  });
  await section('A: a reply that already asks → no follow-up call', async () => {
    await run([{ blocks: [{ type: 'text', text: 'Here it is on the board. What would you do first?' }, tool('t1')], stop: 'end_turn' }]);
    assert.equal(requests.length, 1);
  });
  await section('A: no tool call → no follow-up call', async () => {
    await run([{ blocks: [{ type: 'text', text: 'Okay, sounds good.' }], stop: 'end_turn' }]);
    assert.equal(requests.length, 1);
  });
  await section('B: the tool_result quotes what was sent; a restating second call is dropped', async () => {
    const first = "The limit's final value is 1/4, so 1/4 is the right final answer. How do you get rid of the 0 in the denominator?";
    const r = await run([
      { blocks: [{ type: 'text', text: first }, tool('t1')], stop: 'tool_use' },
      { blocks: [{ type: 'text', text: "The limit's value is 1/4, which is the right final answer. How do you deal with the 0 in the denominator?" }], stop: 'end_turn' },
    ]);
    assert.equal(requests.length, 2);
    const results = requests[1].messages[requests[1].messages.length - 1].content as Array<{ type: string; content: string }>;
    assert.equal(results[0].type, 'tool_result');
    assert.match(results[0].content, /^show_equation executed successfully\. Already sent to the student this turn \(never repeat or mention it\): «The limit's final value/);
    assert.deepEqual(r.sentences, ["The limit's final value is 1/4, so 1/4 is the right final answer.", 'How do you get rid of the 0 in the denominator?']);
    assert.ok(!/deal with/.test(r.done!.fullText), r.done!.fullText);
  });
  await section('B: a second call with something new is kept', async () => {
    const r = await run([
      { blocks: [{ type: 'text', text: 'Here is the graph of the line.' }, tool('t1')], stop: 'tool_use' },
      { blocks: [{ type: 'text', text: 'Where does it cross the vertical axis?' }], stop: 'end_turn' },
    ]);
    assert.ok(r.sentences.includes('Where does it cross the vertical axis?'));
    assert.match(r.done!.fullText, /vertical axis\?/);
  });
  // Round 3 (Haiku 5.5, 10-27): the later call talked about the instruction.
  await section('round 3: a reply that already asked → the later call is dropped whole (portal-93b6dd9b)', async () => {
    const r = await run([
      { blocks: [{ type: 'text', text: 'Both parts are now confirmed, so this problem is done. Back to your list?' }, tool('t1')], stop: 'tool_use' },
      { blocks: [{ type: 'text', text: "The card is up. Those words already ask the question, so I'll stop there." }], stop: 'end_turn' },
    ]);
    assert.deepEqual(r.sentences, ['Both parts are now confirmed, so this problem is done.', 'Back to your list?']);
    assert.equal(r.done!.fullText, 'Both parts are now confirmed, so this problem is done. Back to your list?');
  });
  await section('round 3: the thin-turn follow-up keeps only its first question (portal-136a30a0)', async () => {
    const r = await run([
      { blocks: [{ type: 'text', text: "Let's reason it out from the acceleration. The ball gains 10 m/s of speed every second, starting from rest." }, tool('t1')], stop: 'end_turn' },
      { blocks: [{ type: 'text', text: "After 1 second, what is its speed? The equation card is up, so there's nothing more to add. And after 2?" }], stop: 'end_turn' },
    ]);
    assert.equal(requests.length, 2);
    assert.deepEqual(r.sentences.slice(-1), ['After 1 second, what is its speed?'], JSON.stringify(r.sentences));
    assert.ok(!/nothing more to add|after 2/i.test(r.done!.fullText), r.done!.fullText);
  });
  console.log(`test:post-tool-turn-brain PASS (${n} sections)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
