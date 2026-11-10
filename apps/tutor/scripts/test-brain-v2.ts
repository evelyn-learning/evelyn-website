import { renderFacts } from '../src/lib/tutor/v2/facts';
/// <reference types="node" />
/**
 * Tutor brain v2 — unit suite for the turn engine (src/lib/tutor/v2). No network.
 *   npm run test:brain-v2
 */
import type Anthropic from '@anthropic-ai/sdk';
import { SEED_AP_CALCBC_U4_LHOPITAL } from '../src/lib/tutor/lesson-plan/seeds/ap-calcbc-u4-lhopital';
import { V2_CONSTITUTION } from '../src/lib/tutor/v2/constitution';
import { renderPlanMap } from '../src/lib/tutor/v2/plan-map';
import { v2Tools } from '../src/lib/tutor/v2/tools';
import { runV2Turn, v2SessionPart, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session } from '../src/lib/tutor/v2/types';
import { paintsOnBoard, streamV2Turn } from '../src/lib/tutor/v2/client';
import { V2_CONTROL_TOOL_NAMES } from '../src/lib/tutor/v2/tool-names';
import { SentenceStream } from '../src/lib/tutor/v2/sentences';
import { mentionsTool, stripToolTalk } from '../src/lib/tutor/v2/tool-talk';
import { isOwnVoice } from '../src/lib/tutor/v2/own-voice';
import { foldInterruptedTurn, V2_CUT_MARK } from '../src/lib/tutor/v2/interrupted';
import { resolvePartnerSessionOptions } from '../src/lib/tutor/portal/partner-session-options';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};

const session: V2Session = { studentName: 'Sam', subject: 'math', level: 'ap', mode: 'text', timeBoxMinutes: 25, plan: SEED_AP_CALCBC_U4_LHOPITAL };
const usage = { input_tokens: 100, output_tokens: 20, cache_read_input_tokens: 50, cache_creation_input_tokens: 5 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);

/** A model stub that returns the queued replies in order and records each request. */
function stub(replies: Anthropic.Message[]) {
  const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
  const call: V2ModelCall = async (params, onText) => { seen.push(structuredClone(params)); const r = replies.shift(); if (!r) throw new Error('stub: no reply queued'); onText?.('x'); return r; };
  return { call, seen };
}

async function main() {
  console.log('standing prompt');
  const sys = V2_CONSTITUTION + v2SessionPart(session);
  const tools = v2Tools('math');
  const toolChars = JSON.stringify(tools).length;
  check(`constitution + session part stay small (${sys.length} chars)`, sys.length < 16000, sys.length);
  check(`a math session gets a handful of tools (${tools.length}, ${toolChars} chars)`, tools.length <= 16 && toolChars < 24000, [tools.length, toolChars]);
  check('the control tools are present', ['update_session_note', 'set_goal_status', 'track_gap', 'end_lesson'].every((n) => tools.some((t) => t.name === n)));
  check('the constitution names no partner, topic or symptom', !/crimsora|greenapple|gdi|l'h[oô]pital|cos\(|streak/i.test(V2_CONSTITUTION));
  const map = renderPlanMap(SEED_AP_CALCBC_U4_LHOPITAL);
  check('the plan map lists every segment as a goal', SEED_AP_CALCBC_U4_LHOPITAL.segments.every((s) => map.includes(`[${s.id}]`)));
  check('the plan map gives no staying or ordering order', !/stay within|must complete|before advancing|turn budget/i.test(map));

  console.log('first turn (tutor opens)');
  const s0 = newV2State(1_000_000);
  const a = stub([
    msg([
      { type: 'thinking', thinking: 'plan the opener', signature: 's' },
      { type: 'text', text: 'Hi Sam. Try this one.' },
      { type: 'tool_use', id: 't1', name: 'show_problem', input: { problem: { statement: 'Evaluate $\\lim_{x\\to 0} \\sin(3x)/x$.', format: 'free-response' } } },
      { type: 'tool_use', id: 't2', name: 'update_session_note', input: { note: 'Sam: AP level. Opened with sin(3x)/x.' } },
    ], 'tool_use'),
  ]);
  const r1 = await runV2Turn({ session, state: s0, studentSaid: null, nowMs: 1_000_000 + 2 * 60000, callModel: a.call });
  const req1 = a.seen[0] as unknown as { system: Array<{ text: string; cache_control?: unknown }>; messages: Anthropic.MessageParam[]; thinking: { type: string }; tools: unknown[] };
  const last1 = req1.messages[req1.messages.length - 1].content as Array<{ type: string; text: string; cache_control?: unknown }>;
  check('system is the constitution then the session part, both cached', req1.system.length === 2 && req1.system[0].text === V2_CONSTITUTION && req1.system.every((b) => b.cache_control));
  check('thinking is adaptive, at medium effort', req1.thinking.type === 'adaptive' && (a.seen[0] as unknown as { output_config: { effort: string } }).output_config.effort === 'medium');
  check('the user turn is the student block then one facts block', last1.length === 2 && /session has just begun/.test(last1[0].text) && /^<facts>[\s\S]*<\/facts>$/.test(last1[1].text));
  check('the cache mark is on the student block, not the facts', !!last1[0].cache_control && !last1[1].cache_control);
  check('facts carry time, board, plan and note', /time: 2 min used of about 25/.test(last1[1].text) && /board:\n\s+empty/.test(last1[1].text) && /plan: hook=not started/.test(last1[1].text) && /your note: \(empty/.test(last1[1].text), last1[1].text);
  check('no instruction blocks from v1 are sent', !/<active_question>|<verdict_guard>|<segment_truth>|<student_state>|runtime note/.test(JSON.stringify(req1.messages)));
  check('a reply with words whose tool calls all worked ends the turn in one model call', r1.spoken === 'Hi Sam. Try this one.' && r1.modelCalls === 1, [r1.spoken, r1.modelCalls]);
  check('the board records the painted problem', r1.state.board.pages.length === 1 && r1.state.board.pages[0].items[0].summary.includes('sin(3x)'));
  check('the note is saved', r1.state.note === 'Sam: AP level. Opened with sin(3x)/x.');
  check('tool outcomes are reported', r1.toolCalls.map((t) => t.outcome).join('|') === 'painted on page 1|saved', r1.toolCalls.map((t) => t.outcome));
  const h1 = JSON.stringify(r1.state.history);
  check('history keeps words, tool calls and outcomes', h1.includes('Hi Sam') && h1.includes('"tool_use"') && h1.includes('painted on page 1'));
  check('history keeps no thinking and no facts', !h1.includes('plan the opener') && !h1.includes('<facts>'));
  check('the caller\'s state is untouched', s0.history.length === 0 && s0.note === '' && s0.board.pages.length === 0);
  check('usage is reported with the model that answered', r1.usage.inputTokens === 100 && r1.usage.cacheReadTokens === 50 && r1.usage.model === 'x');

  console.log('second turn (student answers)');
  const b = stub([
    msg([
      { type: 'text', text: 'Yes, 3 is right.' },
      { type: 'tool_use', id: 't3', name: 'show_problem', input: { problem: { statement: 'Evaluate $\\lim_{x\\to 0} \\sin(3x)/x$.', format: 'free-response' } } },
      { type: 'tool_use', id: 't4', name: 'set_goal_status', input: { goal: 'try-basic', status: 'demonstrated' } },
      { type: 'tool_use', id: 't5', name: 'set_goal_status', input: { goal: 'nope', status: 'shown' } },
      { type: 'tool_use', id: 't6', name: 'show_table', input: {} },
    ], 'tool_use'),
    msg([{ type: 'text', text: 'Next.' }], 'end_turn'),
  ]);
  const r2 = await runV2Turn({ session, state: r1.state, studentSaid: 'It is 3.', nowMs: 1_000_000 + 4 * 60000, callModel: b.call, facts: { answerCheck: 'the student\'s 3 matches the stored answer' } });
  const req2 = b.seen[0];
  const first = req2.messages[0].content as Array<{ text: string }>;
  const tail2 = req2.messages[req2.messages.length - 1].content as Array<{ text: string; cache_control?: unknown }>;
  const beforeTail = req2.messages[req2.messages.length - 2].content as Array<{ cache_control?: unknown }>;
  check('a reply that paints leaves no board-gap fact; a reply that paints nothing is counted', !/board last written on/.test(tail2[tail2.length - 1].text) && r2.state.repliesSinceBoard === 1 && /board last written on: 1 reply ago/.test(renderFacts(session, r2.state, { nowMs: 1_000_000 })));
  check('the earlier turn is replayed from history, without its facts', first.length === 1 && /session has just begun/.test(first[0].text));
  check('the last history message carries a cache mark', !!beforeTail[beforeTail.length - 1].cache_control);
  check('the student\'s words are sent as they are', tail2[0].text === 'It is 3.');
  check('facts now show the board, the note and the answer check', /problem "Evaluate/.test(tail2[1].text) && /your note: Sam: AP level/.test(tail2[1].text) && /answer check: the student's 3 matches/.test(tail2[1].text), tail2[1].text);
  const out2 = r2.toolCalls.map((t) => t.outcome);
  check('a repeat of what is on the board is not painted', out2[0] === 'not painted: already on the board (page 1)', out2[0]);
  check('a goal status is recorded', out2[1] === 'recorded' && r2.state.goals['try-basic']?.status === 'demonstrated');
  check('an unknown goal is refused with the goal list', /^not recorded: no goal "nope"/.test(out2[2]) && out2[2].includes('hook'));
  check('an invalid board call is refused by the validator', /^not painted: /.test(out2[3]), out2[3]);
  check('a failed tool call gets the model a second look, with the results and its own thinking', r2.modelCalls === 2 && JSON.stringify(b.seen[1].messages).includes('already on the board') && r2.spoken === 'Yes, 3 is right.\n\nNext.', [r2.modelCalls, r2.spoken]);

  console.log('a reply with no words');
  const q = stub([
    msg([{ type: 'thinking', thinking: 'note first', signature: 's' }, { type: 'tool_use', id: 't9', name: 'update_session_note', input: { note: 'n' } }], 'tool_use'),
    msg([{ type: 'text', text: 'Bye for now.' }, { type: 'tool_use', id: 't10', name: 'end_lesson', input: { summary: 's' } }], 'tool_use'),
  ]);
  const rq = await runV2Turn({ session, state: r1.state, studentSaid: 'I have to go', callModel: q.call });
  check('a silent reply is followed up so the student is never left without words', rq.modelCalls === 2 && rq.spoken === 'Bye for now.' && rq.state.closed && JSON.stringify(q.seen[1].messages).includes('note first'), [rq.modelCalls, rq.spoken]);

  console.log('closing');
  const c = stub([msg([{ type: 'text', text: 'Good work today.' }, { type: 'tool_use', id: 't7', name: 'end_lesson', input: { summary: 'Did 0/0 limits.' } }], 'tool_use')]);
  const r3 = await runV2Turn({ session, state: r2.state, studentSaid: 'Can we stop?', callModel: c.call });
  check('end_lesson closes the session without another model call', r3.state.closed && r3.state.closeSummary === 'Did 0/0 limits.' && r3.modelCalls === 1);
  const roles = r3.state.history.map((m) => m.role).join(',');
  check('stored history never has two assistant messages in a row', !/assistant,assistant/.test(roles), roles);

  console.log('gaps');
  const g = stub([
    msg([{ type: 'text', text: 'Let us look at that.' },
      { type: 'tool_use', id: 'g1', name: 'track_gap', input: { what: 'Chain rule', status: 'found' } },
      { type: 'tool_use', id: 'g2', name: 'track_gap', input: { what: 'derivative of ln x', status: 'explained' } },
      { type: 'tool_use', id: 'g3', name: 'track_gap', input: { what: 'chain rule!', status: 'done_with_help' } },
      { type: 'tool_use', id: 'g4', name: 'track_gap', input: { what: 'x', status: 'fixed' } }], 'tool_use'),
    msg([{ type: 'text', text: 'ok' }], 'end_turn'),
    msg([{ type: 'text', text: 'next' }], 'end_turn'),
  ]);
  const rg = await runV2Turn({ session, state: r2.state, studentSaid: 'I forgot', callModel: g.call });
  check('a gap is recorded and updated in place under the same name', JSON.stringify(rg.state.gaps) === JSON.stringify([{ what: 'Chain rule', status: 'done_with_help' }, { what: 'derivative of ln x', status: 'explained' }]), rg.state.gaps);
  check('an unknown status is refused', /^not recorded: status must be/.test(rg.toolCalls[3].outcome));
  await runV2Turn({ session, state: rg.state, studentSaid: 'ok', callModel: g.call });
  const gapFacts = (g.seen[2].messages[g.seen[2].messages.length - 1].content as Array<{ text: string }>)[1].text;
  check('the next turn\'s facts list the gaps and how far each has got', /gaps you have recorded:\n  - Chain rule: they did one with help, not yet alone\n  - derivative of ln x: explained to them, not yet done by them/.test(gapFacts), gapFacts);
  check('a state with no gaps says nothing about them', !/gaps you have recorded/.test(last1[1].text));

  console.log('a reply cut short');
  const cut = stub([msg([{ type: 'text', text: 'Here.' }, { type: 'tool_use', id: 't8', name: 'show_equation', input: { latex: 'y=e' } }], 'max_tokens')]);
  const r4 = await runV2Turn({ session, state: r2.state, studentSaid: 'go on', callModel: cut.call });
  const tail4 = r4.state.history.slice(-2);
  check('a tool call in a reply that stopped for another reason still gets its result stored', tail4[0].role === 'assistant' && tail4[1].role === 'user' && JSON.stringify(tail4[1].content).includes('"tool_use_id":"t8"'), tail4.map((m) => m.role));

  console.log('cancelling');
  const ac = new AbortController(); let gotSignal: AbortSignal | undefined;
  await runV2Turn({ session, state: r1.state, studentSaid: 'x', signal: ac.signal, callModel: async (_p, _t, sig) => { gotSignal = sig; return msg([{ type: 'text', text: 'ok' }], 'end_turn'); } });
  check('the caller\'s cancel signal reaches the model call', gotSignal === ac.signal);

  console.log('failure');
  let threw = false;
  try { await runV2Turn({ session, state: r2.state, studentSaid: 'x', callModel: async () => { throw new Error('boom'); } }); } catch { threw = true; }
  check('a failed model call throws and leaves the state alone', threw && !r2.state.closed);

  console.log('browser side of a turn');
  const sse = (events: unknown[], split = 37) => {
    const raw = new TextEncoder().encode(events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join(''));
    // Deliver in awkward chunk sizes so frames straddle reads.
    return new ReadableStream<Uint8Array>({ start(c) { for (let i = 0; i < raw.length; i += split) c.enqueue(raw.slice(i, i + split)); c.close(); } });
  };
  const doneEv = { type: 'done', spoken: 'Yes — é.', state: r2.state, usage: { inputTokens: 1, outputTokens: 2, cacheReadTokens: 3, cacheCreationTokens: 4 }, firstTextMs: 5, totalMs: 6 };
  let sent: { url: string; headers: Record<string, string>; body: Record<string, unknown> } | null = null;
  const okFetch = (async (url: string, init: RequestInit) => {
    sent = { url, headers: init.headers as Record<string, string>, body: JSON.parse(init.body as string) };
    return new Response(sse([{ type: 'text', delta: 'Yes — ' }, { type: 'text', delta: 'é.' }, { type: 'tool-call', id: 't', name: 'show_equation', args: { latex: 'x' }, outcome: 'painted on page 1' }, doneEv]), { status: 200 });
  }) as unknown as typeof fetch;
  const deltas: string[] = []; const calls: string[] = [];
  const d = await streamV2Turn({ session: { subject: 'math', level: 'ap', mode: 'text', lessonPlanId: 'p1' }, state: r1.state, studentSaid: 'hi', embedToken: 'tok', fetchImpl: okFetch, onText: (x) => deltas.push(x), onToolCall: (c) => calls.push(c.name) });
  check('posts the state and the student\'s words with the embed token', sent!.url === '/api/tutor/brain-v2/turn' && sent!.headers['x-embed-token'] === 'tok' && sent!.body.studentSaid === 'hi' && (sent!.body.session as { lessonPlanId: string }).lessonPlanId === 'p1' && Array.isArray((sent!.body.state as { history: unknown[] }).history));
  check('reads text, tool calls and the result across split frames', deltas.join('') === 'Yes — é.' && calls.join() === 'show_equation' && d.spoken === 'Yes — é.' && d.usage.cacheReadTokens === 3, [deltas, calls]);
  const rejects = async (f: typeof fetch) => { try { await streamV2Turn({ session: { subject: 'm', level: 'l', mode: 'text' }, state: r1.state, studentSaid: null, fetchImpl: f }); return ''; } catch (e) { return (e as Error).message; } };
  check('an HTTP error rejects with the server\'s reason', /400.*state is missing/.test(await rejects((async () => new Response(JSON.stringify({ error: 'state is missing or malformed' }), { status: 400 })) as unknown as typeof fetch)));
  check('an error event rejects', /boom/.test(await rejects((async () => new Response(sse([{ type: 'text', delta: 'a' }, { type: 'error', message: 'boom' }]), { status: 200 })) as unknown as typeof fetch)));
  check('a stream with no result rejects', /without a result/.test(await rejects((async () => new Response(sse([{ type: 'text', delta: 'a' }]), { status: 200 })) as unknown as typeof fetch)));
  check('only painted board calls go to the whiteboard', paintsOnBoard({ id: '1', name: 'show_equation', args: {}, outcome: 'painted on page 1' }, V2_CONTROL_TOOL_NAMES) && !paintsOnBoard({ id: '2', name: 'show_equation', args: {}, outcome: 'not painted: already on the board (page 1)' }, V2_CONTROL_TOOL_NAMES) && !paintsOnBoard({ id: '3', name: 'update_session_note', args: {}, outcome: 'saved' }, V2_CONTROL_TOOL_NAMES));

  console.log('sentences for speech');
  const feed = (pieces: string[]) => { const ss = new SentenceStream(); const got: string[] = []; for (const x of pieces) got.push(...ss.push(x)); return [got, ss.flush()] as const; };
  const [s1, f1] = feed(['Yes, that', "'s right. Now try", ' this one: what is 3.5 times 2? Take your', ' time']);
  check('cuts at sentence ends as the text arrives', s1.join('|') === "Yes, that's right.|Now try this one: what is 3.5 times 2?" && f1.join() === 'Take your time', [s1, f1]);
  const [s2] = feed(['Use e.g. the chain rule. Then f. g is fine! Done. ']);
  check('an abbreviation or a lone letter does not end a sentence', s2.join('|') === 'Use e.g. the chain rule.|Then f. g is fine!|Done.', s2);
  const [s3, f3] = feed(['First part\n\nSecond part. ']);
  check('a paragraph break ends a sentence', s3.join('|') === 'First part|Second part.' && f3.length === 0, [s3, f3]);
  const [s4, f4] = feed(['He said "stop." Then left.']);
  check('closing quotes stay with their sentence; the end waits for flush', s4.join('|') === 'He said "stop."' && f4.join() === 'Then left.', [s4, f4]);

  console.log('a turn the student talked over');
  const cutState = foldInterruptedTurn(r1.state, 'wait', 'Now look at', [
    { id: 'c1', name: 'show_equation', args: { latex: 'y=x^2' }, outcome: 'painted on page 1' },
    { id: 'c2', name: 'update_session_note', args: { note: 'zzz' }, outcome: 'saved' },
  ]);
  const cutTail = cutState.history.slice(-3);
  check('keeps the student\'s words, what was heard with a cut mark, and the settled tool calls with results', cutTail.map((m) => m.role).join() === 'user,assistant,user' && JSON.stringify(cutTail[1]).includes(`Now look at ${V2_CUT_MARK}`) && JSON.stringify(cutTail[2]).includes('"tool_use_id":"c1"') && JSON.stringify(cutTail[2]).includes('"tool_use_id":"c2"'));
  check('the board record gains what was painted; the note is not replayed', cutState.board.pages[0].items.some((it) => it.summary === 'y=x^2') && cutState.note === r1.state.note);
  check('the earlier state is untouched and a turn nobody heard leaves no trace', r1.state.history.length + 3 === cutState.history.length && foldInterruptedTurn(r1.state, 'x', '  ', []) === r1.state);
  const afterCut = stub([msg([{ type: 'text', text: 'Go ahead.' }], 'end_turn')]);
  const rc = await runV2Turn({ session, state: cutState, studentSaid: 'Actually, a question', callModel: afterCut.call });
  check('the next turn runs on the rebuilt history', rc.spoken === 'Go ahead.' && JSON.stringify(afterCut.seen[0].messages).includes(V2_CUT_MARK));

  console.log('the tutor\'s own voice in the microphone');
  const justSaid = ['Yes, that is right.', 'Now take the derivative of the top and the bottom separately.'];
  check('the tutor\'s own sentence coming back is recognised', isOwnVoice('now take the derivative of the top and the bottom', justSaid));
  check('a mis-heard copy of it is still recognised', isOwnVoice('take the derivative of the top and bottom separately', justSaid));
  check('the student\'s own words are not', !isOwnVoice('wait can you explain why that works', justSaid));
  check('a short reply over the tutor is always the student', !isOwnVoice('yes that is', justSaid) && !isOwnVoice('the top', justSaid));
  check('nothing said yet means nothing to echo', !isOwnVoice('now take the derivative of the top', []));

  console.log('tool names in the tutor\'s words');
  check('a sentence naming a tool is dropped, the rest kept', stripToolTalk('Good work today. Then end_lesson. See you next time.') === 'Good work today. See you next time.', stripToolTalk('Good work today. Then end_lesson. See you next time.'));
  check('paragraphs survive and clean text is untouched', stripToolTalk('One.\n\nI will call show_problem now.\n\nTwo.') === 'One.\n\nTwo.' && stripToolTalk('Show me the problem. End the lesson?') === 'Show me the problem. End the lesson?');
  check('ordinary words are not tool names', !mentionsTool('Let me show you a new page of gaps to track.') && mentionsTool('call track_gap'));
  const leak = stub([msg([{ type: 'text', text: 'Well done. Then end_lesson.' }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { summary: 's' } }], 'tool_use')]);
  const rl = await runV2Turn({ session, state: r1.state, studentSaid: 'bye', callModel: leak.call });
  check('the turn\'s words come back without the leak', rl.spoken === 'Well done.', rl.spoken);

  console.log('selection');
  check('every partner is on v1 until cut over', ['crimsora', 'greenapple', 'gdi-demo', 'gameclass', 'unknown-partner', ''].every((id) => resolvePartnerSessionOptions({ partnerId: id }).brainVersion === 'v1'));

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main();
