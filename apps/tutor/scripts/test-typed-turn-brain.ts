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
  // W9-A (fix wave 9): a correction is always followed by `retry` — the base fixture's ask is that retry.
  next: { kind: 'retry', say: 'Can you say the whole sentence once more?', item: '', level: '' },
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
  await test('typed-turn carries the parsed turn (next.kind retry, retries 0)', () => {
    const t = full.events.find((e) => e.type === 'typed-turn') as { turn: { next: { kind: string } }; retries: number; nextFallback?: string };
    assert.equal(t.turn.next.kind, 'retry');
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
  // W9-A: the legal next after the fixture's correction is a retry (a question beside a correction is refused).
  const RETRY_NEXT = { kind: 'retry', say: 'Say it once more: I went there yesterday.', item: '', level: '' };
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

  const SIX = 'You talked about your work today. You used the present perfect well. One thing you did well was your clear answers. Try to add the past form next time. Here is the check. What is the difference between these two sentences?';
  const EIGHT = `${SIX} Take your time. I will help you.`;
  await test('V3: a recap next.say of 6 English sentences ⇒ no retry; 8 ⇒ retry (budget 7)', async () => {
    const recapTurn = { ...typedTurn, recap: true };
    const ok6 = await run({ ...baseInput, typedTurn: recapTurn }, [chunkedTextScript(JSON.stringify({ ...TURN, next: { ...RETRY_NEXT, say: SIX } }), 3)]);
    assert.equal(ok6.requests.length, 1);
    assert.equal(turnEv(ok6.events).retries, 0);
    const over8 = await run({ ...baseInput, typedTurn: recapTurn }, [
      chunkedTextScript(JSON.stringify({ ...TURN, next: { ...RETRY_NEXT, say: EIGHT } }), 3),
      chunkedTextScript(JSON.stringify({ ...TURN, next: { ...RETRY_NEXT, say: SIX } }), 2),
    ]);
    assert.equal(over8.requests.length, 2);
    assert.equal(turnEv(over8.events).retryReason, 'say_over_budget');
    assert.ok(String(over8.requests[1].messages[over8.requests[1].messages.length - 1].content).includes('at most 7 sentences'));
  });

  {
    // R3 (fix round 1): the level check's third reply may move only when it was a real answer
    const lcTurn = { state: '<turn_state part="level_check" open_ask="question" move_needs_answer="yes"/>', allowedNext: ['question', 'move'], recap: false, moveNeedsAnswer: true };
    const MOVE = { kind: 'move', say: 'Thank you. Now let us talk about your week. What did you do on Monday?', item: '', level: 'intermediate' };
    const ASK = { kind: 'question', say: 'What is one skill you would like to improve?', item: '', level: '' };
    const NONE = { ...TURN, verdict: 'none', verdict_say: '', correction: null, support_ja: '' };
    await test('R3: verdict none + move + moveNeedsAnswer ⇒ refused before speech; the retry\'s question is spoken once', async () => {
      const r = await run({ ...baseInput, typedTurn: lcTurn }, [chunkedTextScript(JSON.stringify({ ...NONE, next: MOVE }), 3), chunkedTextScript(JSON.stringify({ ...NONE, next: ASK }), 2)]);
      assert.equal(r.requests.length, 2);
      const u = String(r.requests[1].messages[r.requests[1].messages.length - 1].content);
      assert.ok(u.includes('move_needs_answer') && /not an answer/.test(u), u);
      const said = sentencesOf(r.events);
      assert.ok(!said.some((x) => x.includes('Monday')), 'the refused move is never spoken');
      assert.equal(said.filter((x) => x === ASK.say).length, 1);
      const t = turnEv(r.events);
      assert.equal(t.retryReason, 'move_needs_answer');
      assert.deepEqual(t.turn?.next, ASK);
    });
    await test('R3: the retry moves again on a non-answer ⇒ fallback question, never move', async () => {
      const r = await run({ ...baseInput, typedTurn: lcTurn }, [chunkedTextScript(JSON.stringify({ ...NONE, next: MOVE }), 3), chunkedTextScript(JSON.stringify({ ...NONE, next: MOVE }), 2)]);
      const t = turnEv(r.events);
      assert.equal(t.nextFallback, 'question');
      assert.ok(!sentencesOf(r.events).some((x) => x.includes('Monday')));
    });
    await test('R3: verdict correct + move + moveNeedsAnswer ⇒ one call, the move is spoken', async () => {
      const r = await run({ ...baseInput, typedTurn: lcTurn }, [chunkedTextScript(JSON.stringify({ ...TURN, verdict: 'correct', correction: null, next: MOVE }), 3)]);
      assert.equal(r.requests.length, 1);
      assert.ok(sentencesOf(r.events).some((x) => x.includes('Monday')));
    });
    await test('R5: a cut object in the moveNeedsAnswer cell falls back to question (allowedNext[0]), never move', async () => {
      const r = await run({ ...baseInput, typedTurn: lcTurn }, [chunkedTextScript('{"ack":"Good try.","verdict":"none","verdict_say":"","board":"","correction":null,"support_ja":"","next":{"kind":"mo', 2, 'max_tokens')]);
      assert.equal(turnEv(r.events).nextFallback, 'question');
      // R7: nothing of a move is emitted or spoken (the fallback's line is the client's engineLineFor('question'))
      assert.ok(!r.events.some((e) => e.type === 'typed-field' && e.field === 'next'), 'no next field');
      assert.deepEqual(sentencesOf(r.events), ['Good try.'], 'only the ack is spoken');
    });
    await test('R7: an ABSENT verdict (invalid, never released) + move + moveNeedsAnswer ⇒ the move is refused, never spoken', async () => {
      const r = await run({ ...baseInput, typedTurn: lcTurn }, [chunkedTextScript(JSON.stringify({ ...NONE, verdict: 'bogus', next: MOVE }), 3), chunkedTextScript(JSON.stringify({ ...NONE, next: ASK }), 2)]);
      assert.ok(!r.events.some((e) => e.type === 'typed-field' && e.field === 'verdict'), 'verdict never released');
      assert.ok(!sentencesOf(r.events).some((x) => x.includes('Monday')), 'the move is never spoken');
      assert.ok(!r.events.some((e) => e.type === 'typed-field' && e.field === 'next' && (e.value as { kind: string }).kind === 'move'));
    });
    await test('R3: without moveNeedsAnswer a none + move is not refused', async () => {
      const { moveNeedsAnswer: _m, ...plain } = lcTurn;
      const r = await run({ ...baseInput, typedTurn: plain }, [chunkedTextScript(JSON.stringify({ ...NONE, next: MOVE }), 3)]);
      assert.equal(r.requests.length, 1);
    });
  }

  {
    // X2 (fix wave 3): a recap close without a required phrase is refused once (r61b 745 s "Well done today…")
    const recapTurn = { state: '<turn_state part="recap" recap_step="close" required_phrases="one thing you did well"/>', allowedNext: ['close'], recap: true, requiredPhrases: ['one thing you did well'] };
    const BARE = { kind: 'close', say: 'Well done today, Haruto. See you next time!', item: '', level: '' };
    const WITH = { kind: 'close', say: 'One thing you did well was   your clear examples. Well done today, see you next time!', item: '', level: '' };
    const OK = { ...TURN, verdict: 'correct', verdict_say: 'Right, that is the core idea.', correction: null, support_ja: '' };
    await test('X2: close lacking a required phrase ⇒ refused before speech, two requests, the retry\'s say spoken once', async () => {
      const r = await run({ ...baseInput, typedTurn: recapTurn }, [chunkedTextScript(JSON.stringify({ ...OK, next: BARE }), 3), chunkedTextScript(JSON.stringify({ ...OK, next: WITH }), 2)]);
      assert.equal(r.requests.length, 2);
      const u = String(r.requests[1].messages[r.requests[1].messages.length - 1].content);
      assert.ok(u.includes('missing_required_phrase') && u.includes('"one thing you did well"'), u);
      const said = sentencesOf(r.events);
      assert.ok(!said.some((x) => x.includes('Haruto')), 'the refused close is never spoken');
      assert.equal(said.filter((x) => /One thing you did well/.test(x)).length, 1, said.join(' | '));
      const t = turnEv(r.events);
      assert.equal(t.retryReason, 'missing_required_phrase');
      assert.deepEqual(t.turn?.next, WITH);
    });
    await test('X2: the retry still lacks the phrase ⇒ taken anyway (the render guard stays the last line)', async () => {
      const r = await run({ ...baseInput, typedTurn: recapTurn }, [chunkedTextScript(JSON.stringify({ ...OK, next: BARE }), 3), chunkedTextScript(JSON.stringify({ ...OK, next: BARE }), 2)]);
      assert.equal(r.requests.length, 2);
      assert.deepEqual(turnEv(r.events).turn?.next, BARE);
      assert.equal(sentencesOf(r.events).filter((x) => x.includes('Haruto')).length, 1);
    });
    await test('X2: the phrase already in verdict_say (case / whitespace differ) ⇒ one request', async () => {
      const r = await run({ ...baseInput, typedTurn: recapTurn }, [chunkedTextScript(JSON.stringify({ ...OK, verdict_say: 'Right. ONE thing  you did well was your examples.', next: BARE }), 3)]);
      assert.equal(r.requests.length, 1);
      assert.ok(sentencesOf(r.events).some((x) => x.includes('Haruto')));
    });
    // F4.5: any spoken field before next counts (ack / support_ja / correction.explain)
    for (const [where, over] of [
      ['support_ja', { support_ja: 'One thing you did well was your examples. よくできました。' }],
      ['ack', { ack: 'One thing you did well was your examples.' }],
      ['correction.explain', { verdict: 'partly_correct', correction: { student: 'I work here five years', corrected: 'I have worked here for five years.', emphasis: ['have worked'], explain: 'One thing you did well was the time phrase; add have.' } }],
    ] as const) {
      await test(`X2/F4.5: the phrase spoken in ${where} ⇒ one request`, async () => {
        const r = await run({ ...baseInput, typedTurn: recapTurn }, [chunkedTextScript(JSON.stringify({ ...OK, ...over, next: BARE }), 3)]);
        assert.equal(r.requests.length, 1);
        assert.ok(sentencesOf(r.events).some((x) => x.includes('Haruto')));
      });
    }
    await test('X2: a close without requiredPhrases (non-recap) ⇒ unchanged, one request', async () => {
      const r = await run({ ...baseInput, typedTurn: { state: '<turn_state part="plain"/>', allowedNext: ['close'], recap: false } }, [chunkedTextScript(JSON.stringify({ ...OK, next: BARE }), 3)]);
      assert.equal(r.requests.length, 1);
    });
  }

  {
    // W9-A (fix wave 9, run 5 101 s): a correction and a move in the same turn — the learner never said the corrected sentence.
    const bridgeTurn = { state: '<turn_state part="bridge" open_ask="question" budget_due="yes" post_due="0"/>', allowedNext: ['question', 'retry', 'move'], recap: false };
    const CORR = { ...TURN, verdict: 'partly_correct', correction: { student: 'I uh tell manager to help', corrected: 'I tell my manager to help.', emphasis: ['my'], explain: 'Add my before manager.' } };
    const MOVE = { kind: 'move', say: 'Good, now the present perfect. Have you worked for your current company for a long time?', item: '', level: '' };
    const RETRY = { kind: 'retry', say: 'Say the corrected sentence once: I tell my manager to help.', item: '', level: '' };
    await test('W9-A: correction + move with retry allowed ⇒ refused before speech (correction_needs_retry); the retry\'s retry spoken once', async () => {
      const r = await run({ ...baseInput, typedTurn: bridgeTurn }, [chunkedTextScript(JSON.stringify({ ...CORR, next: MOVE }), 3), chunkedTextScript(JSON.stringify({ ...CORR, next: RETRY }), 2)]);
      assert.equal(r.requests.length, 2);
      const u = String(r.requests[1].messages[r.requests[1].messages.length - 1].content);
      assert.ok(u.includes('correction_needs_retry') && /corrected/.test(u), u);
      const said = sentencesOf(r.events);
      assert.ok(!said.some((x) => x.includes('present perfect')), 'the refused move is never spoken');
      assert.equal(said.filter((x) => x === RETRY.say).length, 1, said.join(' | '));
      const t = turnEv(r.events);
      assert.equal(t.retryReason, 'correction_needs_retry');
      assert.deepEqual(t.turn?.next, RETRY);
    });
    await test('W9-A: the retry moves again ⇒ fallback retry, the move never spoken', async () => {
      const r = await run({ ...baseInput, typedTurn: bridgeTurn }, [chunkedTextScript(JSON.stringify({ ...CORR, next: MOVE }), 3), chunkedTextScript(JSON.stringify({ ...CORR, next: MOVE }), 2)]);
      assert.equal(turnEv(r.events).nextFallback, 'retry');
      assert.ok(!sentencesOf(r.events).some((x) => x.includes('present perfect')));
    });
    await test('W9-A: correction + question with retry allowed ⇒ refused too (the retry comes first)', async () => {
      const Q = { kind: 'question', say: 'What else do you do at work?', item: '', level: '' };
      const r = await run({ ...baseInput, typedTurn: bridgeTurn }, [chunkedTextScript(JSON.stringify({ ...CORR, next: Q }), 3), chunkedTextScript(JSON.stringify({ ...CORR, next: RETRY }), 2)]);
      assert.equal(r.requests.length, 2);
      assert.equal(turnEv(r.events).retryReason, 'correction_needs_retry');
    });
    await test('W9-A: retry not allowed (post_due ≥ 1 / move request / level check rows) ⇒ correction + move is not refused', async () => {
      const r = await run({ ...baseInput, typedTurn: { ...bridgeTurn, allowedNext: ['question', 'move'] } }, [chunkedTextScript(JSON.stringify({ ...CORR, next: MOVE }), 3)]);
      assert.equal(r.requests.length, 1);
      assert.ok(sentencesOf(r.events).some((x) => x.includes('present perfect')));
    });
    await test('W9-A: no correction ⇒ a move with retry allowed is not refused', async () => {
      const r = await run({ ...baseInput, typedTurn: bridgeTurn }, [chunkedTextScript(JSON.stringify({ ...TURN, verdict: 'correct', correction: null, next: MOVE }), 3)]);
      assert.equal(r.requests.length, 1);
    });
    await test('W9-A: a dropped no-change correction does not force a retry', async () => {
      const same = { ...CORR, correction: { ...CORR.correction, student: 'I went there yesterday', corrected: 'I went there yesterday.', emphasis: ['went'] }, next: MOVE };
      const r = await run({ ...baseInput, studentMessage: 'I went there yesterday', typedTurn: bridgeTurn }, [chunkedTextScript(JSON.stringify(same), 3)]);
      assert.equal(r.requests.length, 1);
    });
  }

  {
    // W9-C (fix wave 9, run 5 997 s): the close stuffed the unasked check question in as a statement; the learner was never asked.
    const recapQ = { state: '<turn_state part="recap" recap_step="close" required_phrases="the difference between"/>', allowedNext: ['close', 'question'], recap: true, requiredPhrases: ['the difference between'] };
    const OK = { ...TURN, verdict: 'correct', verdict_say: 'Right, that is the core idea.', correction: null, support_ja: '' };
    const STUFFED = { kind: 'close', say: 'Before we finish, the difference between the two sentences is that the first still continues. Well done, Haruto, see you next time!', item: '', level: '' };
    const BARE = { kind: 'close', say: 'Well done today, Haruto. See you next time!', item: '', level: '' };
    const ASK = { kind: 'question', say: 'Before we finish, can you explain the difference between these two sentences? I have worked here for five years. I worked here five years ago.', item: '', level: '' };
    await test('W9-C: a close that introduces a required phrase while question is allowed ⇒ refused (check_question_unasked); the retry\'s question is spoken once', async () => {
      const r = await run({ ...baseInput, typedTurn: recapQ }, [chunkedTextScript(JSON.stringify({ ...OK, next: STUFFED }), 3), chunkedTextScript(JSON.stringify({ ...OK, next: ASK }), 2)]);
      assert.equal(r.requests.length, 2);
      const u = String(r.requests[1].messages[r.requests[1].messages.length - 1].content);
      assert.ok(u.includes('check_question_unasked') && u.includes('"the difference between"') && /"question"/.test(u), u);
      const said = sentencesOf(r.events);
      assert.ok(!said.some((x) => x.includes('Haruto')), 'the refused close is never spoken');
      assert.equal(said.filter((x) => x.includes('can you explain the difference between')).length, 1, said.join(' | '));
      const t = turnEv(r.events);
      assert.equal(t.retryReason, 'check_question_unasked');
      assert.deepEqual(t.turn?.next, ASK);
    });
    await test('W9-C: a close lacking the phrase altogether ⇒ the same refusal (ask it; never write it into the close)', async () => {
      const r = await run({ ...baseInput, typedTurn: recapQ }, [chunkedTextScript(JSON.stringify({ ...OK, next: BARE }), 3), chunkedTextScript(JSON.stringify({ ...OK, next: ASK }), 2)]);
      assert.equal(turnEv(r.events).retryReason, 'check_question_unasked');
    });
    await test('W9-C: the retry closes again ⇒ fallback question, no close emitted or spoken', async () => {
      const r = await run({ ...baseInput, typedTurn: recapQ }, [chunkedTextScript(JSON.stringify({ ...OK, next: STUFFED }), 3), chunkedTextScript(JSON.stringify({ ...OK, next: STUFFED }), 2)]);
      assert.equal(turnEv(r.events).nextFallback, 'question');
      assert.ok(!sentencesOf(r.events).some((x) => x.includes('Haruto')));
      assert.ok(!r.events.some((e) => e.type === 'typed-field' && e.field === 'next' && (e.value as { kind: string }).kind === 'close'));
    });
    await test('W9-C: the phrase spoken before next (verdict_say, after the answer) ⇒ one request, the close stands', async () => {
      const r = await run({ ...baseInput, typedTurn: recapQ }, [chunkedTextScript(JSON.stringify({ ...OK, verdict_say: 'Right: the difference between them is the time.', next: BARE }), 3)]);
      assert.equal(r.requests.length, 1);
      assert.ok(sentencesOf(r.events).some((x) => x.includes('Haruto')));
    });
    await test('W9-C: question not allowed (post-due) ⇒ the X2 path (missing_required_phrase); the stuffed retry is taken', async () => {
      const r = await run({ ...baseInput, typedTurn: { ...recapQ, allowedNext: ['close'] } }, [chunkedTextScript(JSON.stringify({ ...OK, next: BARE }), 3), chunkedTextScript(JSON.stringify({ ...OK, next: STUFFED }), 2)]);
      assert.equal(turnEv(r.events).retryReason, 'missing_required_phrase');
      assert.deepEqual(turnEv(r.events).turn?.next, STUFFED);
    });
  }

  {
    // A (fix wave 6, p3 1118–1141 s): a Japanese-only turn to an English-speaking student is refused before speech.
    const offerTurn = { state: '<turn_state part="pronunciation"/>', allowedNext: ['move', 'offer'], recap: false, studentEnglish: true };
    const JA = { ...TURN, ack: 'ありがとうございます。', verdict: 'correct', verdict_say: 'そうです、その文で大丈夫です。', correction: null, support_ja: '',
      next: { kind: 'offer', say: 'もう一つ練習しますか、それともまとめに進みますか？', item: '', level: '' } };
    const EN_NEXT = { kind: 'offer', say: 'Would you like one more practice, or shall we move on to the summary?', item: '', level: '' };
    const studentEn = { ...baseInput, studentMessage: 'The CEO said the robots were very good and that they could make washing machines easily.' };
    await test('A: a JA-only turn after an English student turn ⇒ refused (english_missing), two requests, the retry\'s English spoken once', async () => {
      const r = await run({ ...studentEn, typedTurn: offerTurn }, [chunkedTextScript(JSON.stringify(JA), 3), chunkedTextScript(JSON.stringify({ ...JA, next: EN_NEXT }), 2)]);
      assert.equal(r.requests.length, 2);
      const u = String(r.requests[1].messages[r.requests[1].messages.length - 1].content);
      assert.ok(u.includes('english_missing') && /at least one English sentence/.test(u) && /in English/.test(u), u);
      const said = sentencesOf(r.events);
      assert.ok(!said.some((x) => x.includes('もう一つ')), 'the refused JA offer is never spoken');
      assert.equal(said.filter((x) => x.includes('one more practice')).length, 1, said.join(' | '));
      assert.equal(turnEv(r.events).retryReason, 'english_missing');
    });
    await test('A: a bilingual turn (one English sentence) ⇒ one request', async () => {
      const r = await run({ ...studentEn, typedTurn: offerTurn }, [chunkedTextScript(JSON.stringify({ ...JA, verdict_say: 'Yes, that sentence is fine. そうです。' }), 3)]);
      assert.equal(r.requests.length, 1);
    });
    await test('A: English only in support_ja does not count (support_ja is exempt) ⇒ refused', async () => {
      const r = await run({ ...studentEn, typedTurn: offerTurn }, [chunkedTextScript(JSON.stringify({ ...JA, support_ja: 'That is fine.' }), 3), chunkedTextScript(JSON.stringify({ ...JA, next: EN_NEXT }), 2)]);
      assert.equal(r.requests.length, 2);
    });
    await test('A: a JA-only turn after a JAPANESE student turn (no studentEnglish) ⇒ one request', async () => {
      const r = await run({ ...baseInput, studentMessage: '日本語で説明してください。', typedTurn: { ...offerTurn, studentEnglish: undefined } }, [chunkedTextScript(JSON.stringify(JA), 3)]);
      assert.equal(r.requests.length, 1);
      assert.ok(sentencesOf(r.events).some((x) => x.includes('もう一つ')));
    });
    await test('A: studentSpokeEnglish — ≥ 3 ASCII words, no Japanese script', () => {
      assert.equal(tt.studentSpokeEnglish('Can you say in English?'), true);
      assert.equal(tt.studentSpokeEnglish('OK thanks'), false);
      assert.equal(tt.studentSpokeEnglish('英語で say it please'), false);
      assert.equal(tt.studentSpokeEnglish('日本語で説明してください。'), false);
    });
  }

  {
    // Z2 (fix wave 8, run 4 67 s): a question that dictates the opening words is refused before speech (one retry).
    const DICT = { ...TURN, verdict: 'correct', verdict_say: 'That is a clear goal.', correction: null, support_ja: '',
      next: { kind: 'question', say: 'Now tell me one reason it matters to your work. Try starting with: I want to…', item: '', level: '' } };
    const PLAIN = { kind: 'question', say: 'Now tell me one reason it matters to your work.', item: '', level: '' };
    await test('Z2: a question with "Try starting with: I want to…" ⇒ refused (question_dictates_opening), the retry\'s question spoken once', async () => {
      const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify(DICT), 3), chunkedTextScript(JSON.stringify({ ...DICT, next: PLAIN }), 2)]);
      assert.equal(r.requests.length, 2);
      const u = String(r.requests[1].messages[r.requests[1].messages.length - 1].content);
      assert.ok(u.includes('question_dictates_opening') && /which words to begin with/.test(u), u);
      const said = sentencesOf(r.events);
      assert.ok(!said.some((x) => /starting with/i.test(x)), 'the refused question is never spoken');
      assert.equal(said.filter((x) => x.includes('one reason it matters')).length, 1, said.join(' | '));
      assert.equal(turnEv(r.events).retryReason, 'question_dictates_opening');
    });
    await test('Z2: a retry with "starting with:" passes untouched ⇒ one request', async () => {
      const R = { ...TURN, next: { kind: 'retry', say: 'Can you say the whole sentence once more, starting with: I went…', item: '', level: '' } };
      const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify(R), 3)]);
      assert.equal(r.requests.length, 1);
      assert.ok(sentencesOf(r.events).some((x) => x.includes('starting with: I went')), sentencesOf(r.events).join(' | '));
    });
  }

  await test('B (fix wave 6, p3 654 s): the ack "Good, you met Mr. Kenji last month." streams as ONE sentence, not cut at "Mr."', async () => {
    // Fix round 1 (F1) pin moved: the streamed abbreviation case is St. (the single-initial rule was dropped)
    const T = { ...TURN, ack: 'Good, you met Mr. Kenji last month.', verdict: 'correct', verdict_say: 'That is right, you met St. Mary at the fair. Good.', correction: null, support_ja: '' };
    const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify(T), 3)]);
    const said = sentencesOf(r.events);
    assert.equal(said[0], 'Good, you met Mr. Kenji last month.', said.join(' | '));
    assert.ok(said.includes('That is right, you met St. Mary at the fair.'), said.join(' | '));
    assert.ok(said.includes('Good.'), said.join(' | '));
    assert.equal(turnEv(r.events).turn?.ack, 'Good, you met Mr. Kenji last month.');
  });
  // Fix round 1 (F1) pin moved: the typed/prose pair uses "St." (prose ABBREV_TAIL_RE excludes St; the typed rule holds it)
  // and the typed buffer now splits "plan B. Then" (the single-initial rule merged real sentences).
  await test('B: the prose SentenceBuffer is unchanged (no option) — "St." still splits there; typed holds it', () => {
    const b = new brain.SentenceBuffer();
    assert.deepEqual([...b.push('That is right, you met St. Mary at the fair. '), b.flush()], ['That is right, you met St.', 'Mary at the fair.']);
    const t = new brain.SentenceBuffer({ typed: true });
    assert.deepEqual([...t.push('That is right, you met St. Mary at the fair. '), t.flush()], ['That is right, you met St. Mary at the fair.', null]);
    const t2 = new brain.SentenceBuffer({ typed: true });
    assert.deepEqual([...t2.push('Okay, so you can choose plan B. Then we start the next part. '), t2.flush()], ['Okay, so you can choose plan B.', 'Then we start the next part.', null]);
  });

  {
    // D (fix wave 6, p3 1171 s): the recap's review question boards its two sentences
    const OK = { ...TURN, verdict: 'none', verdict_say: '', correction: null, support_ja: '', next: { kind: 'question', say: 'What is the difference between these two sentences?', item: '', level: '' } };
    const recapTurn = { state: '<turn_state part="recap" recap_step="review_feedback_check"/>', allowedNext: ['question'], recap: true };
    for (const board of ['I have worked here for five years. | I worked here five years ago.', 'I have worked here for five years. I worked here five years ago.']) {
      await test(`D: a recap board of two sentences is not truncated (${board.includes('|') ? 'pipe' : 'no pipe'})`, async () => {
        const r = await run({ ...baseInput, typedTurn: recapTurn }, [chunkedTextScript(JSON.stringify({ ...OK, board }), 3)]);
        const f = r.events.find((e) => e.type === 'typed-field' && e.field === 'board');
        assert.equal(f?.value, board);
        assert.equal(turnEv(r.events).turn?.board, board);
      });
    }
    await test('D: a non-recap board of two sentences is still cut to one', async () => {
      const r = await run({ ...baseInput, typedTurn }, [chunkedTextScript(JSON.stringify({ ...OK, verdict: 'correct', board: 'I have worked here for five years. I worked here five years ago.' }), 3)]);
      assert.equal(r.events.find((e) => e.type === 'typed-field' && e.field === 'board')?.value, 'I have worked here for five years.');
    });
  }

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

  {
    // Z1 (fix wave 5, p2.txt 310 s): a correction equal to the student's words is dropped before speech, retry refused
    const CANVA = 'I use Canva to prepare presentations with pictures and graphics.';
    const ztt = { state: '<turn_state part="bridge" open_ask="retry" correction_open="yes"/>', allowedNext: ['retry', 'question', 'offer'], recap: false };
    const zin = { ...baseInput, typedTurn: ztt, studentTranscript: CANVA, studentMessage: CANVA };
    const NOOP = {
      ack: 'Canva with pictures and graphics, that sounds nice.', verdict: 'partly_correct',
      verdict_say: 'Nearly there. After the verb use, you need the word for, so it is to prepare presentations.', board: '',
      correction: { student: CANVA, corrected: CANVA, emphasis: ['presentations'], explain: 'That sentence is already correct, so no change is needed here.' },
      support_ja: '', next: { kind: 'retry', say: 'Can you say the whole sentence once more?', item: '', level: '' },
    };
    const ASK = { kind: 'question', say: 'What is one presentation you have prepared recently for your boss?', item: '', level: '' };
    await test('Z1: no-change correction ⇒ verdict correct, no verdict_say / explain spoken, retry refused, the retry\'s question spoken once', async () => {
      const r = await run(zin, [chunkedTextScript(JSON.stringify(NOOP), 4), chunkedTextScript(JSON.stringify({ ...NOOP, verdict: 'correct', verdict_say: '', correction: null, next: ASK }), 2)]);
      assert.equal(r.requests.length, 2, 'one retry');
      const said = sentencesOf(r.events);
      assert.deepEqual(said, [NOOP.ack, ASK.say], said.join(' | '));
      const vf = r.events.find((e) => e.type === 'typed-field' && e.field === 'verdict');
      assert.equal(vf?.value, 'correct');
      const cf = r.events.find((e) => e.type === 'typed-field' && e.field === 'correction');
      assert.equal(cf?.value, null);
      assert.ok(r.events.some((e) => e.type === 'typed-correction-no-change'), 'telemetry frame');
      assert.ok(!r.events.some((e) => e.type === 'typed-field' && e.field === 'next' && (e.value as { kind: string }).kind === 'retry'), 'the retry is never released');
      const u = String(r.requests[1].messages[r.requests[1].messages.length - 1].content);
      assert.ok(u.includes('(correction_no_change)') && u.includes("the student's sentence already has that form; no correction, no retry — ask the next question or offer"), u);
      assert.ok(u.includes('verdict: "correct"') && u.includes('correction: null') && u.includes('verdict_say: ""'), 'already-said fields are the released ones');
      const t = turnEv(r.events);
      assert.equal(t.retryReason, 'illegal_kind');
      assert.equal(t.turn?.verdict, 'correct');
      assert.equal(t.turn?.correction, null);
      assert.deepEqual(t.turn?.next, ASK);
      assert.ok(!t.retryDisagreed, 'the retry echoing the released fields agrees');
    });
    await test('Z1: the retry asks for a retry again ⇒ fallback is the first allowed kind that is not retry', async () => {
      const r = await run(zin, [chunkedTextScript(JSON.stringify(NOOP), 3), chunkedTextScript(JSON.stringify(NOOP), 2)]);
      const t = turnEv(r.events);
      assert.equal(t.nextFallback, 'question');
      assert.ok(!sentencesOf(r.events).some((x) => x.includes('once more')));
    });
    await test('Z1: no-change correction + a question next ⇒ one call, question spoken, verdict correct', async () => {
      const r = await run(zin, [chunkedTextScript(JSON.stringify({ ...NOOP, next: ASK }), 3)]);
      assert.equal(r.requests.length, 1);
      assert.deepEqual(sentencesOf(r.events), [NOOP.ack, ASK.say]);
      assert.equal(turnEv(r.events).turn?.verdict, 'correct');
    });
    await test('Z1: a real correction (go → went) is spoken and its retry stands', async () => {
      const r = await run({ ...baseInput, typedTurn: ztt }, [chunkedTextScript(JSON.stringify({ ...TURN, verdict: 'partly_correct', next: { ...NOOP.next } }), 3)]);
      assert.equal(r.requests.length, 1);
      const said = sentencesOf(r.events);
      assert.ok(said.includes(TURN.verdict_say) && said.includes(TURN.correction.explain) && said.includes(NOOP.next.say), said.join(' | '));
      assert.ok(!r.events.some((e) => e.type === 'typed-correction-no-change'));
    });
    await test('Z1 round 1: a no-change correction then a cut object ⇒ the fallback is never retry', async () => {
      const json = JSON.stringify(NOOP);
      const cut = json.slice(0, json.indexOf('"next"') + 20);
      const r = await run(zin, [chunkedTextScript(cut, 3, 'max_tokens')]);
      assert.equal(turnEv(r.events).nextFallback, 'question');
      const u = await run(zin, [chunkedTextScript(json.replace('"next":{"kind":"retry"', '"next":{"kind":"retry","bogus":') + 'x', 3)]);
      const t = turnEv(u.events);
      assert.notEqual(t.nextFallback, 'retry', JSON.stringify(t));
    });
    await test('Z1: runtime notes in front of the transcript are not the student\'s words (no studentMessage)', async () => {
      const r = await run({ ...baseInput, typedTurn: ztt, studentTranscript: `[correction note: x]\n\n${CANVA}` }, [chunkedTextScript(JSON.stringify({ ...NOOP, next: ASK }), 3)]);
      assert.equal(turnEv(r.events).turn?.verdict, 'correct');
    });
  }

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
    // R3: optional boolean moveNeedsAnswer, passed through only when true
    assert.ok(routeSrc.includes("&& (t.moveNeedsAnswer === undefined || typeof t.moveNeedsAnswer === 'boolean')"), 'moveNeedsAnswer shape check');
    assert.ok(routeSrc.includes('...(t.moveNeedsAnswer === true ? { moveNeedsAnswer: true } : {}),'), 'moveNeedsAnswer passed through');
    // X2: optional requiredPhrases (strings ≤ 120 chars, at most 8), passed through when non-empty
    assert.ok(routeSrc.includes("&& (t.requiredPhrases === undefined || (Array.isArray(t.requiredPhrases) && t.requiredPhrases.length <= 8 && t.requiredPhrases.every((x) => typeof x === 'string' && x.length <= 120)))"), 'requiredPhrases shape check');
    assert.ok(routeSrc.includes('...(t.requiredPhrases?.length ? { requiredPhrases: t.requiredPhrases } : {}),'), 'requiredPhrases passed through');
    // A (fix wave 6): optional boolean studentEnglish, passed through only when true
    assert.ok(routeSrc.includes("&& (t.studentEnglish === undefined || typeof t.studentEnglish === 'boolean')"), 'studentEnglish shape check');
    assert.ok(routeSrc.includes('...(t.studentEnglish === true ? { studentEnglish: true } : {}),'), 'studentEnglish passed through');
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
