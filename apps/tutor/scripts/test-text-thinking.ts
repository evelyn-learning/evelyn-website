/**
 * "Think before judging" — thinking on TEXT-mode brain turns only.
 * (src/lib/tutor/voice/text-thinking.ts, claude-brain.ts, brain-stall.ts,
 * the /api/tutor/brain/stream route and the client body.)
 *
 * No network: the brain's SDK client is replaced by a recorder that captures
 * each request and replays scripted stream events.
 *
 * Run: npx tsx scripts/test-text-thinking.ts   (npm run test:text-thinking)
 *      npx tsx scripts/test-text-thinking.ts --print-voice-hash
 *        prints the sha256 of the voice request for a fixed input; run it on
 *        two trees to prove the voice request did not change between them.
 */
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

// The registry resolves model + key at import time — set both first.
process.env.TUTOR_BRAIN_MODEL = 'claude-sonnet-5';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';
delete process.env.TUTOR_MODEL_BRAIN_FALLBACK;
delete process.env.TUTOR_TEXT_THINKING;
delete process.env.TUTOR_TEXT_THINKING_EFFORT;

type Req = Record<string, unknown> & { messages: Array<{ role: string; content: unknown }> };
type Ev = Record<string, unknown>;
interface Script { events: Ev[]; final: { content: unknown[]; stop_reason: string }; hangAfter?: number }

const usage = { input_tokens: 10, output_tokens: 20, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };

function textScript(text: string, stop = 'end_turn'): Script {
  return {
    events: [
      { type: 'message_start' },
      { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
      { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text } },
      { type: 'content_block_stop', index: 0 },
      { type: 'message_delta', delta: { stop_reason: stop } },
      { type: 'message_stop' },
    ],
    final: { content: [{ type: 'text', text }], stop_reason: stop },
  };
}

const SECRET = 'SECRET-REASONING the student is wrong because';
const THINKING_BLOCK = { type: 'thinking', thinking: SECRET, signature: 'sig-abc123' };
const REDACTED_BLOCK = { type: 'redacted_thinking', data: 'opaque-SECRET-REASONING' };

/** thinking → redacted_thinking → text → tool_use, stop_reason tool_use. */
function thinkingToolScript(): Script {
  const toolInput = { latex: 'v = 30' };
  return {
    events: [
      { type: 'message_start' },
      { type: 'content_block_start', index: 0, content_block: { type: 'thinking', thinking: '', signature: '' } },
      { type: 'content_block_delta', index: 0, delta: { type: 'thinking_delta', thinking: SECRET } },
      { type: 'content_block_delta', index: 0, delta: { type: 'signature_delta', signature: 'sig-abc123' } },
      { type: 'content_block_stop', index: 0 },
      { type: 'content_block_start', index: 1, content_block: REDACTED_BLOCK },
      { type: 'content_block_stop', index: 1 },
      { type: 'content_block_start', index: 2, content_block: { type: 'text', text: '' } },
      { type: 'content_block_delta', index: 2, delta: { type: 'text_delta', text: 'Right. Thirty metres per second is exactly it. ' } },
      { type: 'content_block_stop', index: 2 },
      { type: 'content_block_start', index: 3, content_block: { type: 'tool_use', id: 'tu_1', name: 'show_equation', input: {} } },
      { type: 'content_block_delta', index: 3, delta: { type: 'input_json_delta', partial_json: JSON.stringify(toolInput) } },
      { type: 'content_block_stop', index: 3 },
      { type: 'message_delta', delta: { stop_reason: 'tool_use' } },
      { type: 'message_stop' },
    ],
    final: {
      content: [
        THINKING_BLOCK,
        REDACTED_BLOCK,
        { type: 'text', text: 'Right. Thirty metres per second is exactly it. ' },
        { type: 'tool_use', id: 'tu_1', name: 'show_equation', input: toolInput },
      ],
      stop_reason: 'tool_use',
    },
  };
}

/** Thinking ate the whole budget: one thinking block, stop_reason max_tokens. */
function starvedScript(): Script {
  return {
    events: [
      { type: 'message_start' },
      { type: 'content_block_start', index: 0, content_block: { type: 'thinking', thinking: '', signature: '' } },
      { type: 'content_block_delta', index: 0, delta: { type: 'thinking_delta', thinking: SECRET } },
      { type: 'message_delta', delta: { stop_reason: 'max_tokens' } },
      { type: 'message_stop' },
    ],
    final: { content: [{ type: 'thinking', thinking: SECRET, signature: '' }], stop_reason: 'max_tokens' },
  };
}

/** Thinking starts and then the stream goes quiet for good. */
function hangingScript(): Script {
  return {
    events: [
      { type: 'message_start' },
      { type: 'content_block_start', index: 0, content_block: { type: 'thinking', thinking: '', signature: '' } },
    ],
    hangAfter: 2,
    final: { content: [], stop_reason: 'end_turn' },
  };
}

async function main() {
  const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
  const brain = await import('../src/lib/tutor/voice/claude-brain');
  const { buildSystemBlocks } = await import('../src/lib/tutor/ai/prompt-cache');
  const { WHITEBOARD_TOOLS, toAnthropicTools } = await import('../src/app/tutor/hooks/toolDefinitions');

  const requests: Req[] = [];
  let aborts = 0;
  let queue: Script[] = [];
  const client = getModelClient('brain').client as unknown as { messages: { stream: (p: Req) => unknown } };
  client.messages.stream = (params: Req) => {
    requests.push(JSON.parse(JSON.stringify(params)) as Req);
    const script = queue.shift();
    if (!script) throw new Error('test: no scripted response left for this request');
    let aborted = false;
    return {
      abort() { aborted = true; aborts++; },
      async finalMessage() { return { ...script.final, usage }; },
      [Symbol.asyncIterator]() {
        let i = 0;
        return {
          async next() {
            if (script.hangAfter !== undefined && i >= script.hangAfter) {
              // Quiet stream: resolves only when aborted (as the SDK's does).
              await new Promise<void>((resolve) => {
                const t = setInterval(() => { if (aborted) { clearInterval(t); resolve(); } }, 5);
              });
              return { done: true as const, value: undefined };
            }
            if (i >= script.events.length) return { done: true as const, value: undefined };
            return { done: false as const, value: script.events[i++] };
          },
          async return() { return { done: true as const, value: undefined }; },
        };
      },
    };
  };

  const tools = WHITEBOARD_TOOLS.filter((t) => t.name === 'show_equation' || t.name === 'show_problem');
  const baseInput = {
    systemPrompt: 'CORE PROMPT. SESSION PART.',
    systemPromptCore: 'CORE PROMPT. ',
    conversationHistory: [
      { role: 'user' as const, content: 'For (b): v = 10 x 3 / 2 = 15 m/s.' },
      { role: 'assistant' as const, content: 'Not quite. With g = 10 and t = 3, what do you get?' },
    ],
    studentTranscript: "I don't know, maybe 30 m/s?",
    whiteboardSnapshot: [],
    tools,
    activeProblem: { statement: 'A ball is dropped. What is its speed after 3 s? Use g = 10.', source: 'card' as const },
  };
  type Input = Parameters<typeof brain.streamBrainTurn>[0];
  const run = async (input: Record<string, unknown>, scripts: Script[]) => {
    requests.length = 0; aborts = 0; queue = [...scripts];
    const events: Array<Record<string, unknown>> = [];
    const origLog = console.log, origWarn = console.warn;
    console.log = () => {}; console.warn = () => {};
    try {
      for await (const ev of brain.streamBrainTurn(input as unknown as Input)) events.push(ev as unknown as Record<string, unknown>);
    } finally { console.log = origLog; console.warn = origWarn; }
    return { events, requests: [...requests], aborts };
  };

  if (process.argv.includes('--print-voice-hash')) {
    const r = await run(baseInput, [textScript('Right. Thirty it is.')]);
    console.log(createHash('sha256').update(JSON.stringify(r.requests)).digest('hex'));
    return;
  }

  const tt = await import('../src/lib/tutor/voice/text-thinking');
  const stall = await import('../src/lib/tutor/voice/brain-stall');

  let passed = 0, failed = 0;
  const test = async (name: string, fn: () => void | Promise<void>) => {
    try { await fn(); console.log(`  ✓ ${name}`); passed++; }
    catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message.split('\n').slice(0, 6).join('\n      ')}`); failed++; }
  };

  console.log('flag');
  await test('text + flag unset ⇒ on', () => assert.equal(tt.textThinkingEnabled('text', undefined), true));
  await test('text + any other value ⇒ on (default ON)', () => assert.equal(tt.textThinkingEnabled('text', 'on'), true));
  await test("text + 'off' ⇒ off", () => assert.equal(tt.textThinkingEnabled('text', 'off'), false));
  await test('voice ⇒ off whatever the flag', () => {
    assert.equal(tt.textThinkingEnabled('voice', undefined), false);
    assert.equal(tt.textThinkingEnabled('voice', 'on'), false);
  });
  await test('no mode / malformed mode (old client) ⇒ off', () => {
    assert.equal(tt.textThinkingEnabled(undefined, undefined), false);
    assert.equal(tt.textThinkingEnabled(true, undefined), false);
    assert.equal(tt.textThinkingEnabled('TEXT', undefined), false);
  });
  await test('effort: env override accepted only for known levels', () => {
    assert.equal(tt.textThinkingEffort(undefined), tt.TEXT_THINKING_DEFAULT_EFFORT);
    assert.equal(tt.textThinkingEffort('low'), 'low');
    assert.equal(tt.textThinkingEffort('high'), 'high');
    assert.equal(tt.textThinkingEffort('max'), tt.TEXT_THINKING_DEFAULT_EFFORT);
  });

  console.log('request params');
  await test('off ⇒ exactly the old pair, same key order', () => {
    assert.equal(JSON.stringify(tt.brainThinkingParams(false, 2000)), '{"max_tokens":2000,"thinking":{"type":"disabled"}}');
  });
  await test('on ⇒ adaptive thinking, an effort level, and room on top of the base cap', () => {
    const p = tt.brainThinkingParams(true, 2000, 'low') as { max_tokens: number; thinking: { type: string }; output_config: { effort: string } };
    assert.deepEqual(p.thinking, { type: 'adaptive' });
    assert.deepEqual(p.output_config, { effort: 'low' });
    assert.equal(p.max_tokens, 2000 + tt.TEXT_THINKING_HEADROOM_TOKENS);
    assert.ok(tt.TEXT_THINKING_HEADROOM_TOKENS >= 4000, 'thinking must not have to fit inside the reply cap');
  });
  await test('no budget_tokens anywhere (rejected by this model family)', () => {
    assert.ok(!JSON.stringify(tt.brainThinkingParams(true, 2000)).includes('budget_tokens'));
  });

  console.log('brain request');
  const voice = await run(baseInput, [textScript('Right. Thirty it is.')]);
  await test('voice turn: keys, order and values are the pre-existing request', () => {
    assert.equal(voice.requests.length, 1);
    const req = voice.requests[0];
    assert.deepEqual(Object.keys(req), ['model', 'max_tokens', 'thinking', 'system', 'tools', 'messages']);
    const expected = {
      model: 'claude-sonnet-5',
      max_tokens: 2000,
      thinking: { type: 'disabled' },
      system: buildSystemBlocks(baseInput.systemPrompt, baseInput.systemPromptCore),
      tools: toAnthropicTools(tools),
      messages: req.messages,
    };
    assert.equal(JSON.stringify(req), JSON.stringify(expected));
    assert.ok(!JSON.stringify(req).includes('private_reasoning'));
    assert.ok(!JSON.stringify(req).includes('output_config'));
  });
  await test('voice turn: no thinking event is emitted', () => {
    assert.ok(!voice.events.some((e) => e.type === 'thinking'));
  });
  await test('textThinking false ⇒ byte-identical to the voice request (flag off = before)', async () => {
    const off = await run({ ...baseInput, textThinking: false }, [textScript('Right. Thirty it is.')]);
    assert.equal(JSON.stringify(off.requests), JSON.stringify(voice.requests));
    assert.equal(JSON.stringify(off.events), JSON.stringify(voice.events));
  });

  const text = await run({ ...baseInput, textThinking: true }, [textScript('Right. Thirty it is.')]);
  await test('text turn: adaptive thinking + effort + raised max_tokens', () => {
    const req = text.requests[0] as Req & { max_tokens: number };
    assert.deepEqual(req.thinking, { type: 'adaptive' });
    assert.deepEqual(req.output_config, { effort: tt.TEXT_THINKING_DEFAULT_EFFORT });
    assert.equal(req.max_tokens, 2000 + tt.TEXT_THINKING_HEADROOM_TOKENS);
  });
  await test('text turn: tools and system blocks are the same bytes as voice (only the thinking config differs)', () => {
    assert.equal(JSON.stringify(text.requests[0].system), JSON.stringify(voice.requests[0].system));
    assert.equal(JSON.stringify(text.requests[0].tools), JSON.stringify(voice.requests[0].tools));
  });
  await test('text turn: history is the same bytes; user content = voice content + the reasoning block above the guard', () => {
    const tm = text.requests[0].messages, vm = voice.requests[0].messages;
    assert.equal(JSON.stringify(tm.slice(0, -1)), JSON.stringify(vm.slice(0, -1)));
    const block = tt.formatTextThinkingBlock(true, baseInput.studentTranscript);
    const tc = tm[tm.length - 1].content as string, vc = vm[vm.length - 1].content as string;
    assert.ok(block.length > 0 && tc.includes(block));
    assert.equal(tc.replace(block, ''), vc);
    assert.ok(tc.indexOf('<private_reasoning>') < tc.indexOf('<verdict_guard>'));
    assert.ok(tc.indexOf('<verdict_guard>') < tc.indexOf('<student_said>'));
  });
  await test('text turn: a runtime (bracketed) dispatch thinks too — one cache namespace per session — but carries no block', async () => {
    const r = await run({ ...baseInput, textThinking: true, studentTranscript: '[Session start — begin the lesson]' }, [textScript('Welcome.')]);
    assert.deepEqual(r.requests[0].thinking, { type: 'adaptive' });
    assert.ok(!JSON.stringify(r.requests[0].messages).includes('private_reasoning'));
  });

  console.log('prompt block');
  await test('off / empty / bracketed ⇒ no block', () => {
    assert.equal(tt.formatTextThinkingBlock(false, 'x = 4'), '');
    assert.equal(tt.formatTextThinkingBlock(true, '  '), '');
    assert.equal(tt.formatTextThinkingBlock(true, '[Skip-button-clicked]'), '');
  });
  await test('block covers the four points and is generic (no digits, no worked example)', () => {
    const b = tt.formatTextThinkingBlock(true, 'x = 4');
    assert.match(b, /which question is open/i);
    assert.match(b, /work out the correct result yourself/i);
    assert.match(b, /open it with a verdict that matches/i);
    assert.match(b, /Never put your plan/i);
    assert.ok(!/\d\s*[=+\-×x]\s*\d/.test(b), 'no arithmetic example');
    assert.ok(!/"[^"]{3,}"/.test(b), 'no quoted example phrases');
    assert.ok(b.length < 1700, `short (${b.length} chars)`);
  });
  await test('block does not contradict the verdict guard', () => {
    const b = tt.formatTextThinkingBlock(true, 'x = 4');
    const g = brain.formatVerdictGuardBlock('x = 4', 'What is x?');
    // The guard owns the opener rules; the block must not restate them differently.
    assert.ok(g.includes('do NOT state the correct value'));
    assert.ok(!/state the correct (value|answer)|tell them the answer|give the answer/i.test(b));
    assert.ok(!/always open with|must open with (praise|a denial)/i.test(b));
    // Both say: a non-answer gets no verdict or praise word.
    assert.match(g, /NO verdict or praise word/);
    assert.match(b, /no verdict or praise word/);
  });

  console.log('stream handling');
  const loop = await run({ ...baseInput, textThinking: true }, [thinkingToolScript(), textScript('What would the speed be after four seconds?')]);
  await test('thinking text never reaches any emitted event', () => {
    const wire = JSON.stringify(loop.events);
    assert.ok(!wire.includes('SECRET'), 'thinking text leaked into the event stream');
    assert.ok(!wire.includes('sig-abc123'), 'signature leaked into the event stream');
  });
  await test('sentences and fullText carry only the text blocks', () => {
    const sentences = loop.events.filter((e) => e.type === 'sentence').map((e) => e.text);
    assert.equal(sentences.join(' '), 'Right. Thirty metres per second is exactly it. What would the speed be after four seconds?');
    const done = loop.events.find((e) => e.type === 'done') as { fullText: string };
    assert.ok(!done.fullText.includes('SECRET'));
    assert.ok(done.fullText.startsWith('Right.'));
  });
  await test('a bare `thinking` liveness event precedes the first sentence and carries nothing else', () => {
    const iThinking = loop.events.findIndex((e) => e.type === 'thinking');
    const iSentence = loop.events.findIndex((e) => e.type === 'sentence');
    assert.ok(iThinking >= 0 && iThinking < iSentence);
    assert.deepEqual(loop.events[iThinking], { type: 'thinking' });
  });
  await test('tool loop: the assistant turn is passed back with its thinking blocks unmodified and first', () => {
    assert.equal(loop.requests.length, 2);
    const msgs = loop.requests[1].messages;
    const assistant = msgs[msgs.length - 2];
    assert.equal(assistant.role, 'assistant');
    assert.deepEqual(assistant.content, thinkingToolScript().final.content);
    assert.deepEqual((assistant.content as unknown[])[0], THINKING_BLOCK);
    assert.deepEqual((assistant.content as unknown[])[1], REDACTED_BLOCK);
    const results = msgs[msgs.length - 1];
    assert.equal(results.role, 'user');
    assert.deepEqual((results.content as Array<{ type: string; tool_use_id: string }>).map((b) => [b.type, b.tool_use_id]), [['tool_result', 'tu_1']]);
  });
  await test('tool loop: the second iteration keeps the same thinking config (one cache namespace per turn)', () => {
    assert.deepEqual(loop.requests[1].thinking, { type: 'adaptive' });
    assert.deepEqual(loop.requests[1].output_config, loop.requests[0].output_config);
    assert.equal(loop.requests[1].max_tokens, loop.requests[0].max_tokens);
  });

  console.log('token cap');
  await test('thinkingStarved: only a thinking turn that hit the cap with nothing to show', () => {
    const s = { thinkingOn: true, stopReason: 'max_tokens', textChars: 0, toolCalls: 0 };
    assert.equal(tt.thinkingStarved(s), true);
    assert.equal(tt.thinkingStarved({ ...s, thinkingOn: false }), false);
    assert.equal(tt.thinkingStarved({ ...s, stopReason: 'end_turn' }), false);
    assert.equal(tt.thinkingStarved({ ...s, textChars: 12 }), false);
    assert.equal(tt.thinkingStarved({ ...s, toolCalls: 1 }), false);
  });
  const starved = await run({ ...baseInput, textThinking: true }, [starvedScript(), textScript('Right. Thirty it is.')]);
  await test('stop_reason max_tokens with only thinking ⇒ the iteration is re-issued without thinking; the student gets a reply', () => {
    assert.equal(starved.requests.length, 2);
    assert.deepEqual(starved.requests[1].thinking, { type: 'disabled' });
    assert.equal(starved.requests[1].max_tokens, 2000);
    assert.ok(!('output_config' in starved.requests[1]));
    // Same conversation — the starved attempt is not appended to it.
    assert.equal(JSON.stringify(starved.requests[1].messages), JSON.stringify(starved.requests[0].messages));
    const done = starved.events.find((e) => e.type === 'done') as { fullText: string; stopReason: string };
    assert.equal(done.fullText, 'Right. Thirty it is.');
    assert.ok(!JSON.stringify(starved.events).includes('SECRET'));
  });
  await test('a voice turn at max_tokens is NOT re-issued (unchanged behaviour)', async () => {
    const r = await run(baseInput, [{ ...textScript('', 'max_tokens'), final: { content: [], stop_reason: 'max_tokens' } }]);
    assert.equal(r.requests.length, 1);
  });

  console.log('thinking deadline');
  const late = await run({ ...baseInput, textThinking: true, textThinkingDeadlineMs: 40 }, [hangingScript(), textScript('Right. Thirty it is.')]);
  await test('nothing shown by the deadline ⇒ stream aborted, iteration re-issued without thinking', () => {
    assert.equal(late.aborts, 1);
    assert.equal(late.requests.length, 2);
    assert.deepEqual(late.requests[1].thinking, { type: 'disabled' });
    assert.equal(late.requests[1].max_tokens, 2000);
    const done = late.events.find((e) => e.type === 'done') as { fullText: string };
    assert.equal(done.fullText, 'Right. Thirty it is.');
  });
  await test('the deadline never cuts a turn that has started to show text', async () => {
    const r = await run({ ...baseInput, textThinking: true, textThinkingDeadlineMs: 40 }, [textScript('Right. Thirty it is.')]);
    assert.equal(r.aborts, 0);
    assert.equal(r.requests.length, 1);
  });
  await test('default deadline leaves room under the client nothing-shown window', () => {
    assert.ok(tt.TEXT_THINKING_DEADLINE_MS + 6000 <= stall.BRAIN_STALL_PRE_AUDIO_MS);
  });

  console.log('stall window');
  const sb = { enabled: true, spokeAnySentence: false, alreadyAborted: false };
  await test('non-thinking turn: 22 s nothing-shown window unchanged', () => {
    assert.equal(stall.shouldAbortStalledBrain({ ...sb, msSinceLastFrame: stall.BRAIN_STALL_PRE_AUDIO_MS - 1 }), false);
    assert.equal(stall.shouldAbortStalledBrain({ ...sb, msSinceLastFrame: stall.BRAIN_STALL_PRE_AUDIO_MS }), true);
    assert.equal(stall.shouldAbortStalledBrain({ ...sb, thinking: false, msSinceLastFrame: stall.BRAIN_STALL_PRE_AUDIO_MS }), true);
  });
  await test('thinking turn: the nothing-shown window is longer, and still finite', () => {
    assert.ok(stall.BRAIN_STALL_PRE_AUDIO_THINKING_MS > stall.BRAIN_STALL_PRE_AUDIO_MS);
    assert.ok(stall.BRAIN_STALL_PRE_AUDIO_THINKING_MS <= stall.BRAIN_STALL_MID_TURN_MS);
    assert.equal(stall.shouldAbortStalledBrain({ ...sb, thinking: true, msSinceLastFrame: stall.BRAIN_STALL_PRE_AUDIO_MS + 1000 }), false);
    assert.equal(stall.shouldAbortStalledBrain({ ...sb, thinking: true, msSinceLastFrame: stall.BRAIN_STALL_PRE_AUDIO_THINKING_MS }), true);
  });
  await test('thinking turn: once text is showing, the mid-turn window applies as before', () => {
    assert.equal(stall.shouldAbortStalledBrain({ ...sb, thinking: true, spokeAnySentence: true, msSinceLastFrame: stall.BRAIN_STALL_MID_TURN_MS - 1 }), false);
    assert.equal(stall.shouldAbortStalledBrain({ ...sb, thinking: true, spokeAnySentence: true, msSinceLastFrame: stall.BRAIN_STALL_MID_TURN_MS }), true);
  });
  await test('thinking turn: flag off / already aborted still never abort', () => {
    assert.equal(stall.shouldAbortStalledBrain({ ...sb, thinking: true, enabled: false, msSinceLastFrame: 999_999 }), false);
    assert.equal(stall.shouldAbortStalledBrain({ ...sb, thinking: true, alreadyAborted: true, msSinceLastFrame: 999_999 }), false);
  });

  console.log('wiring (source)');
  const SRC = path.join(__dirname, '..', 'src');
  const brainSrc = fs.readFileSync(path.join(SRC, 'lib', 'tutor', 'voice', 'claude-brain.ts'), 'utf8');
  const routeSrc = fs.readFileSync(path.join(SRC, 'app', 'api', 'tutor', 'brain', 'stream', 'route.ts'), 'utf8');
  const clientSrc = fs.readFileSync(path.join(SRC, 'app', 'tutor', 'components', 'VoiceTutorRealtime.tsx'), 'utf8');
  await test('route: thinking is decided server-side from the body mode and the server flag', () => {
    assert.match(routeSrc, /textThinking: textThinkingEnabled\(body\.inputMode\)/);
  });
  await test('route: the thinking liveness frame does not count as egress (a retry stays duplication-free)', () => {
    assert.match(routeSrc, /if \(ev\.type === 'thinking'(?: \|\| ev\.type === 'verdict-precheck')?\) \{\s*sendTelemetry\(ev\);/);
  });
  await test('client: sends inputMode only for a text session (voice body unchanged)', () => {
    assert.match(clientSrc, /\.\.\.\(sessionMode === 'text' \? \{ inputMode: 'text' as const \} : \{\}\),/);
  });
  await test('client: a thinking frame widens the nothing-shown window for that call', () => {
    assert.match(clientSrc, /thinking: stallState\.thinking,/);
    assert.match(clientSrc, /ev\.type === 'thinking'/);
  });
  await test('non-streaming brain route keeps thinking disabled (voice fallback path)', () => {
    assert.equal((brainSrc.match(/thinking: \{ type: 'disabled' as const \},/g) ?? []).length, 1);
  });

  console.log(`\n${passed}/${passed + failed} passed`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
