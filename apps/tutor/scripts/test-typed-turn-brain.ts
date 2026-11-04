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
interface Script { events: Ev[]; final: { content: unknown[]; stop_reason: string } }

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
  correction: { student: 'I go there yesterday', corrected: 'I went there yesterday.', emphasis: ['went'], explain: 'Use the past form went here.' },
  support_ja: '昨日は過去のことです。',
  next: { kind: 'question', say: 'Can you say the whole sentence once more?', item: '', level: '' },
};

const EXPECTED = [
  'typed-field ack', 'sentence', 'typed-field verdict', 'typed-field verdict_say', 'sentence',
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
    const scrambled = { next: TURN.next, support_ja: TURN.support_ja, correction: TURN.correction, verdict_say: TURN.verdict_say, verdict: TURN.verdict, ack: TURN.ack };
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify(scrambled, null, 2), 3)]);
    assert.deepEqual(seq(r.events), EXPECTED);
  });
  await test('ack of three sentences ⇒ first sentence only (field value and speech)', async () => {
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify({ ...TURN, ack: 'Good try. You were really close there. Keep going with it.' }), 3)]);
    const ack = r.events.find((e) => e.type === 'typed-field' && e.field === 'ack') as { value: string };
    assert.equal(ack.value, 'Good try.');
    const firstSentence = r.events.find((e) => e.type === 'sentence') as { text: string };
    assert.equal(firstSentence.text, 'Good try.');
    assert.deepEqual(seq(r.events), EXPECTED);
  });
  await test("illegal next.kind 'offer' ⇒ no next field/sentences, typed-turn.nextFallback = allowedNext[0]", async () => {
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify({ ...TURN, next: { kind: 'offer', say: 'One more, or shall we move on?', item: '', level: '' } }), 3)]);
    assert.deepEqual(seq(r.events), EXPECTED.filter((x, i) => !(x === 'typed-field next' || (i === 10))));
    assert.ok(!r.events.some((e) => e.type === 'sentence' && String(e.text).includes('move on')));
    const t = r.events.find((e) => e.type === 'typed-turn') as { nextFallback?: string };
    assert.equal(t.nextFallback, 'retry');
  });
  await test('unparseable object ⇒ typed-turn-fallback unparseable, then typed-turn null', async () => {
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript('{"ack":"Good try.","verdict":"incorrect"', 2, 'max_tokens')]);
    const i = r.events.findIndex((e) => e.type === 'typed-turn-fallback');
    assert.ok(i >= 0);
    assert.equal((r.events[i] as { reason: string }).reason, 'unparseable');
    const t = r.events.find((e) => e.type === 'typed-turn') as { turn: unknown };
    assert.equal(t.turn, null);
    assert.ok(r.events.findIndex((e) => e.type === 'typed-turn') > i);
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
