/**
 * Typed turn — server branch (claude-brain.ts streamBrainTurn + the stream route).
 *
 * No network: the brain's SDK client is replaced by a recorder that captures
 * each request and replays scripted stream events (same harness as
 * scripts/test-text-thinking.ts).
 *
 * Run: npx tsx scripts/test-typed-turn-brain.ts   (npm run test:typed-turn-brain)
 */
import { strict as assert } from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

process.env.TUTOR_BRAIN_MODEL = 'claude-sonnet-5';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';
delete process.env.TUTOR_MODEL_BRAIN_FALLBACK;
delete process.env.TUTOR_TEXT_THINKING;
delete process.env.TUTOR_TEXT_THINKING_EFFORT;

type Req = Record<string, unknown> & { messages: Array<{ role: string; content: unknown }> };
type Ev = Record<string, unknown>;
interface Script { events: Ev[]; final: { content: unknown[]; stop_reason: string }; /** Rejects the first read (an HTTP error before any event). */ error?: unknown }

const usage = { input_tokens: 10, output_tokens: 20, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };

/** One text block streamed in `chunks` text_delta events. */
function chunkedTextScript(text: string, chunks: number, stop = 'end_turn'): Script {
  const size = Math.ceil(text.length / chunks);
  const deltas: Ev[] = [];
  for (let i = 0; i < text.length; i += size) {
    deltas.push({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: text.slice(i, i + size) } });
  }
  return {
    events: [
      { type: 'message_start' },
      { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
      ...deltas,
      { type: 'content_block_stop', index: 0 },
      { type: 'message_delta', delta: { stop_reason: stop } },
      { type: 'message_stop' },
    ],
    final: { content: [{ type: 'text', text }], stop_reason: stop },
  };
}

const TURN = {
  ack: 'Good try.',
  verdict: 'incorrect',
  verdict_say: 'Nearly there, the verb changes.',
  board: '',
  correction: { student: 'I go there yesterday', corrected: 'I went there yesterday.', emphasis: ['went'], explain: 'Use the past form went here.' },
  support_ja: '昨日は過去のことです。',
  next: { kind: 'question', say: 'Can you say the whole sentence once more?', item: '', level: '' },
};

const EXPECTED = [
  'typed-field ack', 'sentence', 'typed-field verdict', 'typed-field verdict_say', 'sentence', 'typed-field board',
  'typed-field correction', 'sentence', 'typed-field support_ja', 'sentence', 'typed-field next', 'sentence',
  'typed-turn', 'done',
];

async function main() {
  const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
  const brain = await import('../src/lib/tutor/voice/claude-brain');
  const tt = await import('../src/lib/tutor/voice/typed-turn');
  const { WHITEBOARD_TOOLS } = await import('../src/app/tutor/hooks/toolDefinitions');

  const requests: Req[] = [];
  let queue: Script[] = [];
  const client = getModelClient('brain').client as unknown as { messages: { stream: (p: Req) => unknown } };
  client.messages.stream = (params: Req) => {
    requests.push(JSON.parse(JSON.stringify(params)) as Req);
    const script = queue.shift();
    if (!script) throw new Error('test: no scripted response left for this request');
    return {
      abort() {},
      async finalMessage() { return { ...script.final, usage }; },
      [Symbol.asyncIterator]() {
        let i = 0;
        return {
          async next() {
            if (script.error) throw script.error;
            if (i >= script.events.length) return { done: true as const, value: undefined };
            return { done: false as const, value: script.events[i++] };
          },
          async return() { return { done: true as const, value: undefined }; },
        };
      },
    };
  };

  const tools = WHITEBOARD_TOOLS.filter((t) => t.name === 'show_equation' || t.name === 'show_problem');
  const typedTurn = { state: '<turn_state part="practice" open_ask="question"/>', allowedNext: ['retry', 'question'], recap: false };
  const baseInput = {
    systemPrompt: 'CORE PROMPT. SESSION PART.',
    systemPromptCore: 'CORE PROMPT. ',
    conversationHistory: [
      { role: 'user' as const, content: 'Hello.' },
      { role: 'assistant' as const, content: 'Say: I went there yesterday.' },
    ],
    studentTranscript: 'I go there yesterday',
    whiteboardSnapshot: [],
    tools,
    textTurnShape: true,
  };
  type Input = Parameters<typeof brain.streamBrainTurn>[0];
  const run = async (input: Record<string, unknown>, scripts: Script[]) => {
    requests.length = 0; queue = [...scripts];
    const events: Array<Record<string, unknown>> = [];
    const origLog = console.log, origWarn = console.warn;
    console.log = () => {}; console.warn = () => {};
    try {
      for await (const ev of brain.streamBrainTurn(input as unknown as Input)) events.push(ev as unknown as Record<string, unknown>);
    } finally { console.log = origLog; console.warn = origWarn; }
    return { events, requests: [...requests] };
  };
  const seq = (events: Array<Record<string, unknown>>) => events
    .filter((e) => ['typed-field', 'sentence', 'typed-turn', 'typed-turn-fallback', 'done'].includes(e.type as string))
    .map((e) => (e.type === 'typed-field' ? `typed-field ${e.field}` : e.type as string));
  const lastUserText = (req: Req): string => {
    const m = req.messages[req.messages.length - 1];
    if (typeof m.content === 'string') return m.content;
    return (m.content as Array<{ type: string; text?: string }>).map((b) => b.text ?? '').join('');
  };

  let passed = 0, failed = 0;
  const test = async (name: string, fn: () => void | Promise<void>) => {
    try { await fn(); console.log(`  ✓ ${name}`); passed++; }
    catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message.split('\n').slice(0, 8).join('\n      ')}`); failed++; }
  };

  console.log('typed request');
  const full = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify(TURN), 3)]);
  await test('no tools key; output_config.format is json_schema with the typed schema', () => {
    assert.equal(full.requests.length, 1);
    const req = full.requests[0] as Req & { output_config?: { format?: { type: string; schema: unknown } } };
    assert.ok(!('tools' in req), 'typed request must not carry tools');
    assert.equal(req.output_config?.format?.type, 'json_schema');
    assert.deepEqual(req.output_config?.format?.schema, tt.TYPED_TURN_SCHEMA);
  });
  await test('system: core block unchanged, tail carries TYPED_TURN_INSTRUCTIONS', () => {
    const sys = full.requests[0].system as Array<{ text: string }>;
    assert.equal(sys[0].text, 'CORE PROMPT. ');
    assert.ok(sys[sys.length - 1].text.includes(tt.TYPED_TURN_INSTRUCTIONS));
  });
  await test('last user message: typed_turn block right before <student_said>, no <turn_shape', () => {
    const text = lastUserText(full.requests[0]);
    assert.ok(text.includes('<typed_turn allowed_next="retry,question"'), 'typed_turn block missing');
    assert.ok(text.trimEnd().endsWith('</student_said>'));
    const block = tt.typedTurnStateBlock(typedTurn as never);
    assert.ok(text.includes(block + '\n\n<student_said>') || text.includes(block + '\n<student_said>') || text.includes(block + '<student_said>'),
      'typed_turn block must immediately precede <student_said>');
    assert.ok(!text.includes('<turn_shape'), 'turn_shape must be omitted on typed');
    assert.ok(!text.includes('<verdict_guard'), 'verdict_guard must be omitted on typed');
  });
  await test('event sequence in composition order', () => {
    assert.deepEqual(seq(full.events), EXPECTED);
  });
  await test('typed-turn carries the parsed turn (next.kind question, retries 0)', () => {
    const t = full.events.find((e) => e.type === 'typed-turn') as { turn: { next: { kind: string } }; retries: number; nextFallback?: string };
    assert.equal(t.turn.next.kind, 'question');
    assert.equal(t.retries, 0);
    assert.equal(t.nextFallback, undefined);
  });
  await test('speech sentences are the speech fields, in order; done.fullText is the speech, not JSON', () => {
    const sentences = full.events.filter((e) => e.type === 'sentence').map((e) => e.text);
    assert.deepEqual(sentences, [TURN.ack, TURN.verdict_say, TURN.correction.explain, TURN.support_ja, TURN.next.say]);
    const done = full.events.find((e) => e.type === 'done') as { fullText: string };
    assert.ok(!done.fullText.includes('{'), `fullText leaked JSON: ${done.fullText}`);
    assert.ok(done.fullText.includes(TURN.next.say));
  });

  console.log('streamed shapes');
  await test('pretty-printed JSON with scrambled key order ⇒ identical sequence', async () => {
    const scrambled = { next: TURN.next, support_ja: TURN.support_ja, correction: TURN.correction, board: TURN.board, verdict_say: TURN.verdict_say, verdict: TURN.verdict, ack: TURN.ack };
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify(scrambled, null, 2), 3)]);
    assert.deepEqual(seq(r.events), EXPECTED);
  });
  await test('V1: TYPED_TURN_SCHEMA.required contains board', () => {
    assert.ok((tt.TYPED_TURN_SCHEMA as { required: string[] }).required.includes('board'));
  });
  await test('V1: a correct turn with board ⇒ typed-field board (one sentence, never spoken) right after verdict_say', async () => {
    const CORRECT = { ...TURN, verdict: 'correct', verdict_say: 'That is right.', correction: null,
      board: 'I sell washing machines to customers. And I like it.', next: { ...TURN.next, say: 'What do you sell most?' } };
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify(CORRECT), 3)]);
    const s = seq(r.events);
    assert.equal(s[s.indexOf('typed-field verdict_say') + 2], 'typed-field board', s.join(' | '));
    const b = r.events.find((e) => e.type === 'typed-field' && e.field === 'board') as { value: string };
    assert.equal(b.value, 'I sell washing machines to customers.');
    assert.ok(!r.events.some((e) => e.type === 'sentence' && String(e.text).includes('washing machines')), 'board is not speech');
    const t = r.events.find((e) => e.type === 'typed-turn') as { turn: { board: string } };
    assert.equal(t.turn.board, 'I sell washing machines to customers.');
  });
  await test('ack of three sentences ⇒ first sentence only (field value and speech)', async () => {
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify({ ...TURN, ack: 'Good try. You were really close there. Keep going with it.' }), 3)]);
    const ack = r.events.find((e) => e.type === 'typed-field' && e.field === 'ack') as { value: string };
    assert.equal(ack.value, 'Good try.');
    const firstSentence = r.events.find((e) => e.type === 'sentence') as { text: string };
    assert.equal(firstSentence.text, 'Good try.');
    assert.deepEqual(seq(r.events), EXPECTED);
  });
  console.log('retry (Task 6)');
  const OFFER = { kind: 'offer', say: 'One more, or shall we move on?', item: '', level: '' };
  const RETRY_NEXT = { kind: 'question', say: 'What did you do last weekend?', item: '', level: '' };
  type TT = { turn: { next: { kind: string; say: string; item: string; level: string } } | null; retries: number; nextFallback?: string; retryReason?: string; retryDisagreed?: boolean };
  const turnEv = (events: Array<Record<string, unknown>>) => events.find((e) => e.type === 'typed-turn') as unknown as TT;
  const sentencesOf = (events: Array<Record<string, unknown>>) => events.filter((e) => e.type === 'sentence').map((e) => String(e.text));
  {
    const first = JSON.stringify({ ...TURN, next: OFFER });
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(first, 3), chunkedTextScript(JSON.stringify({ ...TURN, next: RETRY_NEXT }), 2)]);
    await test("illegal next.kind 'offer' ⇒ one retry call; its legal next is spoken once with retried: true", () => {
      assert.equal(r.requests.length, 2, 'exactly one extra SDK call');
      const nexts = r.events.filter((e) => e.type === 'typed-field' && e.field === 'next');
      assert.equal(nexts.length, 1);
      assert.equal(nexts[0].retried, true);
      assert.deepEqual(nexts[0].value, RETRY_NEXT);
      assert.deepEqual(seq(r.events), EXPECTED);
      const said = sentencesOf(r.events);
      assert.equal(said[said.length - 1], RETRY_NEXT.say);
      assert.ok(!said.some((x) => x.includes('move on')), 'the refused next is never spoken');
      assert.equal(said.filter((x) => x === TURN.ack).length, 1, 'ack spoken once');
    });
    await test('typed-turn: retries 1, retryReason illegal_kind, turn.next is the retry\'s next', () => {
      const t = turnEv(r.events);
      assert.equal(t.retries, 1);
      assert.equal(t.retryReason, 'illegal_kind');
      assert.equal(t.nextFallback, undefined);
      assert.deepEqual(t.turn?.next, RETRY_NEXT);
      assert.equal(t.retryDisagreed, undefined);
    });
    await test('retry request: same typed params, messages end [assistant first JSON, user retry message]', () => {
      const req = r.requests[1] as Req & { output_config?: { format?: { type: string } } };
      assert.ok(!('tools' in req));
      assert.equal(req.output_config?.format?.type, 'json_schema');
      assert.deepEqual(req.messages.slice(0, -2), r.requests[0].messages);
      const [a, u] = req.messages.slice(-2);
      assert.equal(a.role, 'assistant');
      assert.equal(a.content, first);
      assert.equal(u.role, 'user');
      assert.ok(String(u.content).startsWith('[typed turn retry — not from the student]'));
      assert.ok(String(u.content).includes('refused "offer"'));
      assert.ok(String(u.content).includes('allowed: retry, question'));
    });
  }
  await test('retry object with a different verdict ⇒ ignored, typed-turn.retryDisagreed', async () => {
    const r = await run({ ...baseInput, typedTurn }, [
      chunkedTextScript(JSON.stringify({ ...TURN, next: OFFER }), 3),
      chunkedTextScript(JSON.stringify({ ...TURN, verdict: 'correct', correction: null, next: RETRY_NEXT }), 2),
    ]);
    const t = turnEv(r.events);
    assert.equal(t.retryDisagreed, true);
    assert.equal(r.events.filter((e) => e.type === 'typed-field' && e.field === 'verdict').length, 1);
    assert.equal((t.turn as unknown as { verdict: string }).verdict, 'incorrect');
  });
  await test('both illegal ⇒ no next sentences, nextFallback = allowedNext[0], retries 1, turn.next carries no refused line', async () => {
    const r = await run({ ...baseInput, typedTurn }, [
      chunkedTextScript(JSON.stringify({ ...TURN, next: OFFER }), 3),
      chunkedTextScript(JSON.stringify({ ...TURN, next: { ...OFFER, say: 'Shall we move on now?' } }), 2),
    ]);
    assert.equal(r.requests.length, 2);
    assert.ok(!r.events.some((e) => e.type === 'typed-field' && e.field === 'next'));
    assert.ok(!sentencesOf(r.events).some((x) => x.includes('move on')));
    const t = turnEv(r.events);
    assert.equal(t.nextFallback, 'retry');
    assert.equal(t.retries, 1);
    assert.deepEqual(t.turn?.next, { kind: 'retry', say: '', item: '', level: '' });
  });
  const FOUR = 'Good. Now the next one. Think about last weekend. What did you do?';
  await test('next.say of 4 sentences on a non-recap part ⇒ retry (say_over_budget), the short retry is spoken', async () => {
    const r = await run({ ...baseInput, typedTurn }, [
      chunkedTextScript(JSON.stringify({ ...TURN, next: { ...RETRY_NEXT, say: FOUR } }), 3),
      chunkedTextScript(JSON.stringify({ ...TURN, next: RETRY_NEXT }), 2),
    ]);
    assert.equal(r.requests.length, 2);
    const t = turnEv(r.events);
    assert.equal(t.retryReason, 'say_over_budget');
    assert.equal(t.retries, 1);
    assert.ok(String(r.requests[1].messages[r.requests[1].messages.length - 1].content).includes('at most 3 sentences'));
    assert.ok(!sentencesOf(r.events).join(' ').includes('Think about last weekend.'));
    assert.equal(sentencesOf(r.events).pop(), RETRY_NEXT.say);
  });
  await test('G1: a sentence in verdict_say AND support_ja is spoken once; a different sentence is not dropped', async () => {
    const dup = 'Now tell me what you did at the trade show.';
    const obj = { ...TURN, verdict_say: `Yes, you did. ${dup}`, support_ja: `「そうでしたね」という意味です。 ${dup}`, next: { ...RETRY_NEXT, say: 'Try a full sentence.' } };
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify(obj), 3)]);
    const said = sentencesOf(r.events);
    assert.equal(said.join(' ').split(dup).length - 1, 1, said.join(' | '));
    assert.ok(said.join(' ').includes('Yes, you did.'), said.join(' | '));
    assert.ok(said.includes('Try a full sentence.'), said.join(' | '));
    const sj = r.events.find((e) => e.type === 'typed-field' && e.field === 'support_ja') as { value: string };
    assert.ok(sj.value.includes(dup), 'the field value is not edited');
  });
  await test('G3: a menu say of 4 EN sentences on a non-recap part ⇒ NO retry', async () => {
    const MENU = { kind: 'menu', say: 'Good work. Now pronunciation. Which would you like? Say a number. 1) Individual words. 2) A complete sentence. 3) Naturally.', item: '', level: '' };
    const r = await run({ ...baseInput, typedTurn: { ...typedTurn, allowedNext: ['menu', 'wait'] } }, [chunkedTextScript(JSON.stringify({ ...TURN, next: MENU }), 3)]);
    assert.equal(r.requests.length, 1);
    assert.equal(turnEv(r.events).retries, 0);
  });
  const BILINGUAL = 'Good. Next one. What did you do? では次です。 発音の練習です。';
  await test('F2: next.say of 3 EN + 2 JA sentences on a non-recap part ⇒ NO retry', async () => {
    const r = await run({ ...baseInput, typedTurn }, [
      chunkedTextScript(JSON.stringify({ ...TURN, next: { ...RETRY_NEXT, say: BILINGUAL } }), 3),
    ]);
    assert.equal(r.requests.length, 1);
    assert.equal(turnEv(r.events).retries, 0);
  });
  await test('F2: 4 EN sentences ⇒ retry (two requests)', async () => {
    const r = await run({ ...baseInput, typedTurn }, [
      chunkedTextScript(JSON.stringify({ ...TURN, next: { ...RETRY_NEXT, say: FOUR } }), 3),
      chunkedTextScript(JSON.stringify({ ...TURN, next: RETRY_NEXT }), 2),
    ]);
    assert.equal(r.requests.length, 2);
  });
  await test('retry still over budget ⇒ spoken as is (spec §4.8), no third call', async () => {
    const r = await run({ ...baseInput, typedTurn }, [
      chunkedTextScript(JSON.stringify({ ...TURN, next: { ...RETRY_NEXT, say: FOUR } }), 3),
      chunkedTextScript(JSON.stringify({ ...TURN, next: { ...RETRY_NEXT, say: FOUR } }), 2),
    ]);
    assert.equal(r.requests.length, 2);
    assert.equal(sentencesOf(r.events).join(' ').split('Think about last weekend.').length - 1, 1);
    assert.equal(turnEv(r.events).nextFallback, undefined);
  });
  await test('next.say of 4 sentences with recap: true ⇒ no retry, spoken', async () => {
    const r = await run({ ...baseInput, typedTurn: { ...typedTurn, recap: true } }, [
      chunkedTextScript(JSON.stringify({ ...TURN, next: { ...RETRY_NEXT, say: FOUR } }), 3),
    ]);
    assert.equal(r.requests.length, 1);
    assert.equal(turnEv(r.events).retries, 0);
    assert.ok(sentencesOf(r.events).join(' ').includes('Think about last weekend.'));
  });

  console.log('fallbacks (Task 6)');
  await test('400 output_config.format rejected ⇒ typed-turn-fallback format_rejected, then the prose call with tools', async () => {
    const reject: Script = { events: [], final: { content: [], stop_reason: 'end_turn' }, error: { status: 400, message: 'output_config.format is not supported' } };
    const r = await run({ ...baseInput, typedTurn }, [reject, chunkedTextScript('Nearly. Say it again please.', 1)]);
    assert.equal(r.requests.length, 2);
    const fb = r.events.find((e) => e.type === 'typed-turn-fallback') as { reason: string };
    assert.equal(fb?.reason, 'format_rejected');
    const prose = r.requests[1] as Req & { output_config?: unknown };
    assert.ok(Array.isArray(prose.tools) && (prose.tools as unknown[]).length > 0);
    assert.ok(!('output_config' in prose));
    assert.ok(!lastUserText(prose).includes('<typed_turn'));
    assert.equal(sentencesOf(r.events).join(' '), 'Nearly. Say it again please.');
    assert.ok(!r.events.some((e) => e.type === 'typed-turn' || e.type === 'typed-field'));
  });
  await test('a 400 that is not a format rejection is not swallowed', async () => {
    const reject: Script = { events: [], final: { content: [], stop_reason: 'end_turn' }, error: { status: 400, message: 'prompt is too long' } };
    await assert.rejects(run({ ...baseInput, typedTurn }, [reject, chunkedTextScript('x', 1)]));
  });
  await test('truncated object + max_tokens ⇒ fallback cut, typed-turn null with nextFallback, ack not repeated, no second call', async () => {
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript('{"ack":"Good try.","verdict":"incorrect","verdict_say":"Nearly the', 2, 'max_tokens')]);
    assert.equal(r.requests.length, 1);
    const fb = r.events.filter((e) => e.type === 'typed-turn-fallback').map((e) => e.reason);
    assert.deepEqual(fb, ['cut']);
    const t = turnEv(r.events);
    assert.equal(t.turn, null);
    assert.equal(t.retries, 0);
    assert.equal(t.nextFallback, 'retry');
    assert.deepEqual(sentencesOf(r.events), ['Good try.']);
    assert.ok(r.events.findIndex((e) => e.type === 'typed-turn') > r.events.findIndex((e) => e.type === 'typed-turn-fallback'));
  });
  await test('cut after an early-closed next was voiced ⇒ no nextFallback on top of it', async () => {
    const text = '{"next":' + JSON.stringify(TURN.next) + ',"ack":"Good try.","verdict":"incorrect","verdict_say":"Nearly the';
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(text, 2, 'max_tokens')]);
    assert.ok(sentencesOf(r.events).join(' ').includes(TURN.next.say));
    const t = turnEv(r.events);
    assert.equal(t.turn, null);
    assert.equal(t.nextFallback, undefined);
  });
  await test('complete but invalid object ⇒ typed-turn-fallback unparseable, then typed-turn null', async () => {
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript('{"ack":"Good try.","verdict":"bogus","next":{}}', 2)]);
    const i = r.events.findIndex((e) => e.type === 'typed-turn-fallback');
    assert.ok(i >= 0);
    assert.equal((r.events[i] as { reason: string }).reason, 'unparseable');
    const t = r.events.find((e) => e.type === 'typed-turn') as { turn: unknown };
    assert.equal(t.turn, null);
    assert.ok(r.events.findIndex((e) => e.type === 'typed-turn') > i);
  });
  await test('W4: complete but invalid object with no usable next ⇒ typed-turn null with nextFallback = allowedNext[0]', async () => {
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript('{"ack":"Good try.","verdict":"bogus","next":{}}', 2)]);
    assert.equal(r.requests.length, 1, 'no retry call');
    const t = r.events.find((e) => e.type === 'typed-turn') as { turn: unknown; nextFallback?: string };
    assert.equal(t.turn, null);
    assert.equal(t.nextFallback, 'retry');
  });
  await test('W4: invalid object whose legal next was voiced ⇒ no nextFallback on top of it', async () => {
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify({ ...TURN, verdict: 'bogus' }), 2)]);
    const t = r.events.find((e) => e.type === 'typed-turn') as { turn: unknown; nextFallback?: string };
    assert.equal(t.turn, null);
    assert.equal(t.nextFallback, undefined);
  });
  {
    const LEFT = ['I was responsible for communicating with our customers.', 'We finished the project last month.'];
    const itemTurn = { state: '<turn_state part="pronunciation" open_ask="item"/>', allowedNext: ['item', 'offer', 'move'], recap: false, itemsLeft: LEFT };
    const unlisted = { kind: 'item', say: 'Now say: I have worked with international customers for several years.', item: 'I have worked with international customers for several years.', level: '' };
    const listed = { kind: 'item', say: `Next one: ${LEFT[0]}`, item: LEFT[0], level: '' };
    const r = await run({ ...baseInput, typedTurn: itemTurn }, [chunkedTextScript(JSON.stringify({ ...TURN, next: unlisted }), 3), chunkedTextScript(JSON.stringify({ ...TURN, next: listed }), 2)]);
    await test('W6: an item not in itemsLeft is refused before speech; the retry lists the items; its listed item is spoken once', () => {
      assert.equal(r.requests.length, 2, 'one retry call');
      const u = r.requests[1].messages[r.requests[1].messages.length - 1];
      assert.ok(String(u.content).includes('item_not_listed'), String(u.content));
      for (const x of LEFT) assert.ok(String(u.content).includes(`"${x}"`), x);
      const said = sentencesOf(r.events);
      assert.ok(!said.some((x) => x.includes('international customers')), 'the unlisted item is never spoken');
      assert.equal(said.filter((x) => x.includes(LEFT[0])).length, 1, 'the listed item spoken once');
      const t = turnEv(r.events);
      assert.equal(t.retries, 1);
      assert.equal(t.retryReason, 'illegal_kind');
      assert.deepEqual(t.turn?.next, listed);
    });
    await test('W6: a listed item (whitespace aside) passes with no retry', async () => {
      const r2 = await run({ ...baseInput, typedTurn: itemTurn }, [chunkedTextScript(JSON.stringify({ ...TURN, next: { ...listed, item: ` ${LEFT[1]} ` } }), 2)]);
      assert.equal(r2.requests.length, 1);
      assert.equal(turnEv(r2.events).retries, 0);
    });
    await test('W6: no itemsLeft in the request ⇒ no item gate', async () => {
      const { itemsLeft: _drop, ...noLeft } = itemTurn;
      const r3 = await run({ ...baseInput, typedTurn: noLeft }, [chunkedTextScript(JSON.stringify({ ...TURN, next: unlisted }), 2)]);
      assert.equal(r3.requests.length, 1);
    });
  }
  await test('two text blocks ⇒ exactly one typed-turn', async () => {
    const one = chunkedTextScript(JSON.stringify(TURN), 2);
    const second = [
      { type: 'content_block_start', index: 1, content_block: { type: 'text', text: '' } },
      { type: 'content_block_delta', index: 1, delta: { type: 'text_delta', text: ' ' } },
      { type: 'content_block_stop', index: 1 },
    ];
    const ix = one.events.findIndex((e) => e.type === 'message_delta');
    const r = await run({ ...baseInput, typedTurn }, [{ ...one, events: [...one.events.slice(0, ix), ...second, ...one.events.slice(ix)] }]);
    assert.equal(r.events.filter((e) => e.type === 'typed-turn').length, 1);
  });
  await test('textWorkThenMatch on a typed turn ⇒ no work-then-match frame', async () => {
    const r = await run({ ...baseInput, typedTurn, textWorkThenMatch: true }, [chunkedTextScript(JSON.stringify(TURN), 2)]);
    assert.ok(!r.events.some((e) => e.type === 'work-then-match'));
  });

  console.log('prose regression pin');
  await test('no typedTurn ⇒ tools present, no output_config/format, same keys', async () => {
    const r = await run(baseInput, [chunkedTextScript('Nearly. Say it again please.', 1)]);
    const req = r.requests[0] as Req & { output_config?: unknown };
    assert.ok(Array.isArray(req.tools) && (req.tools as unknown[]).length > 0);
    assert.ok(!('output_config' in req), 'prose request must not carry output_config');
    assert.deepEqual(Object.keys(req), ['model', 'max_tokens', 'thinking', 'system', 'tools', 'messages']);
    assert.ok(!lastUserText(req).includes('<typed_turn'));
    assert.ok(!r.events.some((e) => String(e.type).startsWith('typed')));
  });

  console.log('route');
  const routeSrc = fs.readFileSync(path.join(__dirname, '../src/app/api/tutor/brain/stream/route.ts'), 'utf8');
  await test('route body accepts typedTurn and shape-checks it against TYPED_NEXT_KINDS', () => {
    assert.match(routeSrc, /typedTurn\?: TypedTurnRequest/);
    assert.match(routeSrc, /TYPED_NEXT_KINDS/);
    assert.match(routeSrc, /typed_turn_body_rejected/);
    // W6: the optional itemsLeft array (strings only, at most 8)
    assert.match(routeSrc, /itemsLeft/);
    assert.ok(routeSrc.includes('t.itemsLeft.length <= 8 && t.itemsLeft.every((x) => typeof x === \'string\')'), 'itemsLeft shape check');
  });
  const brainSrc = fs.readFileSync(path.join(__dirname, '../src/lib/tutor/voice/claude-brain.ts'), 'utf8');
  await test('brain: answer_check on typed carries the advisory line; provider fallback wired', () => {
    assert.ok(brainSrc.includes('(advisory: your own "verdict" field decides)'));
    assert.match(brainSrc, /reason: 'provider'/);
  });

  console.log(`\n${passed}/${passed + failed} passed`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
