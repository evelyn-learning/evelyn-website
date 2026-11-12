import { BoardInlineStream, boardBlocksIn, inlineToolCall, stripBoardBlocks } from '../src/lib/tutor/v2/board-inline';
import { richBlocks, typesetMaths } from '../src/lib/tutor/v2/rich-text';
import { circuitNetlist, figureCatalogueFor } from '../src/lib/tutor/v2/figure-catalogue';
import { applyToModelBoard, boardMisfit, spacedRoman, taskOnly, wordsAsText } from '../src/lib/tutor/v2/board';
import { anchorSentenceFinal, anchorSentenceIndex, asksAloud, inlineSentenceIndex, saidCovers, unsaidAsk, asksAnywhere } from '../src/lib/tutor/v2/board-timing';
import { SentenceStream } from '../src/lib/tutor/v2/sentences';
import { speaksMaths, unwrittenEquations } from '../src/lib/tutor/v2/spoken-maths';
import { renderFacts, V2_NO_ASK_RECHECK_S, V2_WAITED_RECHECK_S } from '../src/lib/tutor/v2/facts';
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
import { runV2Turn, v2SessionPart, type V2ModelCall, V2_CHECK_INS } from '../src/lib/tutor/v2/turn';
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
  // 18,000 since 2026-11-10: the eleven board forms are listed in the principles (a reference list, not rules).
  check(`constitution + session part stay small (${sys.length} chars)`, sys.length < 20500, sys.length);
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
      { type: 'tool_use', id: 't1', name: 'show_problem', input: { problem: { statement: 'Evaluate $\\lim_{x\\to 0} \\sin(3x)/x$.', format: 'free-response' }, say_with: 'Try this one' } },
      { type: 'tool_use', id: 't2', name: 'update_session_note', input: { note: 'Sam: AP level. Opened with sin(3x)/x.' } },
    ], 'tool_use'),
  ]);
  const r1 = await runV2Turn({ session, state: s0, studentSaid: null, nowMs: 1_000_000 + 2 * 60000, callModel: a.call });
  const req1 = a.seen[0] as unknown as { system: Array<{ text: string; cache_control?: unknown }>; messages: Anthropic.MessageParam[]; thinking: { type: string }; tools: unknown[] };
  const last1 = req1.messages[req1.messages.length - 1].content as Array<{ type: string; text: string; cache_control?: unknown }>;
  check('say_with is taken off the board call and reported beside it', r1.toolCalls[0].sayWith === 'Try this one' && !('say_with' in r1.toolCalls[0].args) && /^painted/.test(r1.toolCalls[0].outcome), r1.toolCalls[0]);
  check('system is the constitution then the session part, both cached', req1.system.length === 2 && req1.system[0].text === V2_CONSTITUTION && req1.system.every((b) => b.cache_control));
  check('thinking is adaptive, at medium effort', req1.thinking.type === 'adaptive' && (a.seen[0] as unknown as { output_config: { effort: string } }).output_config.effort === 'medium');
  check('the user turn is the student block then one facts block', last1.length === 2 && /session has just started/.test(last1[0].text) && /^<facts>[\s\S]*<\/facts>$/.test(last1[1].text));
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
  {
    const said = ['Yes, two thirds is right.', 'Substituting gave a finite number, so the rule does not apply.', 'Now a different kind of form.', 'Try the limit of x times the natural log of x.'];
    check('a board item is matched to the sentence it is said with', anchorSentenceIndex('Now a different kind', said) === 2 && anchorSentenceIndex('Try the limit of x times', said) === 3);
    check('a loosely copied anchor still matches; none or an unknown one does not', anchorSentenceIndex('try the limit, of X', said) === 3 && anchorSentenceIndex(undefined, said) === -1 && anchorSentenceIndex('Completely different words here', said) === -1);
    check('an anchor that runs across a sentence break goes with the later sentence', anchorSentenceIndex('Now a different kind of form. Try the limit', said) === 2 && anchorSentenceIndex('does not apply. Now a different', said) === 2);
    const tools = v2Tools('math') as unknown as Array<{ name: string; input_schema: { properties: Record<string, unknown> } }>;
    check('every board tool takes say_with; control tools do not', tools.filter((t) => t.name.startsWith('show_')).every((t) => 'say_with' in t.input_schema.properties) && !('say_with' in tools.find((t) => t.name === 'track_gap')!.input_schema.properties));
  }
  {
    check('a sentence inside an equation is turned back, with where it belongs', /annotate/.test(boardMisfit('show_equation', { latex: '\\text{Hypotheses: } f, g \\text{ differentiable near } a \\text{ (except possibly at } a\\text{)}, \\lim_{x\\to a}\\frac{f(x)}{g(x)} \\text{ is of the form zero over zero}' }) ?? ''));
    check('ordinary equations and aligned working fit', boardMisfit('show_equation', { latex: '\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1' }) === null && boardMisfit('show_equation', { latex: '\\begin{aligned} f(x) &\\approx f\'(a)(x-a) \\\\ g(x) &\\approx g\'(a)(x-a) \\\\ \\frac{f(x)}{g(x)} &\\approx \\frac{f\'(a)}{g\'(a)} \\end{aligned}', label: 'Why (if 0/0)' }) === null);
    check('a very long single line is turned back', /too wide/.test(boardMisfit('show_equation', { latex: 'a+b+c+d+e+f+g+h+i+j+k+l+m+n+o+p+q+r+s+t+u+v+w+x+y+z+a+b+c+d+e+f+g+h+i+j+k+l+m+n+o+p+q+r+s+t+u+v+w+x+y+z' }) ?? ''));
    const quiet = stub([msg([{ type: 'tool_use', id: 'k1', name: 'keep_listening', input: {} }], 'tool_use')]);
    const rk = await runV2Turn({ session, state: newV2State(1_000_000), studentSaid: 'so if I put x equal to zero, um', callModel: quiet.call });
    check('keep_listening is a whole reply: no words, one model call', rk.spoken === '' && rk.modelCalls === 1 && quiet.seen.length === 1);
  }
  {
    check('a described anchor goes to the sentence it shares words with, else the last', anchorSentenceFinal('Here is the rule.', ["That's a valid method.", 'Every term after the 1 vanishes.', "Now let's see whether L'Hôpital's rule gets there just as fast."]) === 2 && anchorSentenceFinal('Three conditions matter.', ['Yes.', 'Good work.', 'On we go.']) === 2);
    const ss = new SentenceStream();
    const cut = [...ss.push('It goes to $\\ln 1 = 0. 5$ here. What form is that? '), ...ss.flush()];
    check('a sentence is never cut inside a dollar span', cut.length === 2 && cut.every((x) => (x.match(/\$/g) ?? []).length % 2 === 0), cut);
    check('spoken mathematics is recognised; a bare verdict is not', speaksMaths('The derivative of sine x is cos x, and the derivative of x is 1, so you get cos x over 1.') && speaksMaths('so $\\frac{\\sin x}{2x}$ it is') && !speaksMaths('Yes, the limit is 0. Nicely done.') && !speaksMaths('Take your time, and tell me when you are ready.'));
    const voice: V2Session = { ...session, mode: 'voice' };
    const pass = stub([
      msg([{ type: 'text', text: 'Not quite. The derivative of x sin x is sin x plus x cos x, by the product rule. Fix the bottom.' }], 'end_turn'),
      msg([{ type: 'text', text: 'I should write that. <board equation with="The derivative of x sin x" label="Product rule">(x\\sin x)\' = \\sin x + x\\cos x</board> <board problem>Now try $x\\cos x$.</board>' }, { type: 'tool_use', id: 'b2', name: 'end_lesson', input: { because: 'student_asked', summary: 'x' } }], 'tool_use'),
    ]);
    const rp = await runV2Turn({ session: voice, state: newV2State(1_000_000), studentSaid: 'cos x minus 1 over x cos x minus sin x', callModel: pass.call });
    const hist = rp.state.history as Array<{ role: string; content: Array<{ type: string; text?: string }> }>;
    check('the board pass adds the board item to a reply that only spoke the mathematics', rp.modelCalls === 2 && rp.toolCalls.length === 1 && rp.toolCalls[0].name === 'show_equation' && rp.toolCalls[0].sayWith === 'The derivative of x sin x' && /^painted/.test(rp.toolCalls[0].outcome), rp.toolCalls);
    check('its words are not spoken; it cannot end the lesson or pose a problem', !/I should write/.test(rp.spoken) && !rp.state.closed);
    check('the block is stored inside the reply, after its sentence, without the with attribute', hist.length === 2 && /by the product rule\. <board equation label="Product rule">[^<]+<\/board> Fix the bottom\.$/.test(hist[1].content[0].text ?? ''), hist[1].content[0].text);
    const none = stub([msg([{ type: 'text', text: 'Not quite. The derivative of x sin x is sin x plus x cos x, by the product rule.' }], 'end_turn'), msg([{ type: 'text', text: 'nothing' }], 'end_turn')]);
    const rn = await runV2Turn({ session: voice, state: newV2State(1_000_000), studentSaid: 'x', callModel: none.call });
    check('a board pass that finds nothing missing changes nothing', rn.toolCalls.length === 0 && !/nothing/.test(rn.spoken) && (rn.state.history as unknown[]).length === 2);
    const bare = stub([msg([{ type: 'text', text: 'Hi. Think about a food you ate this week. Was it known in Italy before 1492?' }], 'end_turn'), msg([{ type: 'text', text: '1: none\n2: none\n3: none' }], 'end_turn')]);
    const rb = await runV2Turn({ session: voice, state: newV2State(1_000_000), studentSaid: null, callModel: bare.call });
    check('a spoken session never opens on a bare board: the check is asked, and failing that the lesson heading goes up', rb.modelCalls === 2 && rb.toolCalls.length === 1 && rb.toolCalls[0].name === 'annotate', rb.toolCalls);
    const sledText = 'Yes, the box keeps sitting. Now a bigger case. <board problem>A sled sits still on snow. Two friends pull it north with 60 newtons and 45 newtons. A third pulls south with 105 newtons. Find the net force on the sled.</board>';
    const sledCall: V2ModelCall = async (_p, onText) => { onText?.(sledText); return msg([{ type: 'text', text: sledText }], 'end_turn'); };
    const rq = await runV2Turn({ session: voice, state: newV2State(1_000_000), studentSaid: 'it stays', callModel: sledCall, boardPass: false });
    check('a problem card put up without its question is asked aloud', /Find the net force on the sled\.$/.test(rq.spoken) && /A sled sits still/.test(rq.spoken), rq.spoken);
    check('a reply that already asks is left alone', unsaidAsk('Find the net force on the sled.', ['A sled sits on snow.', 'What is the net force on it?']) === null && unsaidAsk('A sled sits still. Find the net force on the sled.', ['A sled sits still on snow, pulled both ways.', 'Find the net force on that sled.']) === null);
    check('a card whose scenario was told gets only its task said', unsaidAsk('A sled sits still on snow. Two friends pull it north. Find the net force on the sled.', ['Now a bigger case.', 'A sled sits still on snow and two friends pull it north.']) === 'Find the net force on the sled.');
    check('an instruction to the student is an ask, a statement is not', asksAloud(['Here is a new one.', 'List all the bins you would need.']) && asksAloud(['Tell me the full stemplot when you have it.']) && asksAloud(['Read it and tell me what he is documenting.']) && !asksAloud(['In practice the labor was often coercive, and combined with disease it killed huge numbers of Native people.']) && !asksAloud(["It's on the board now."]));
    check('an instruction already given is not said twice', unsaidAsk('Ages at a party range from 12 to 47. Using bins of width 5, starting at 10, list all the bins you would need.', ['Ages at a party run from 12 to 47.', 'List all the bins you would need.']) === null);
    const excerpt = 'Read this excerpt: "they divided among themselves the Young Men, Women, and Children… one obtained thirty, another forty, to this Man one hundred were disposed, to the other two hundred… they sent the Males to the Mines to dig and bring away the Gold… but the Women they made use of to Manure and Till the ground, only stimulated and goaded on by insatiable Avarice and Ambition" What is Las Casas documenting';
    check('a long card is never read out', (unsaidAsk(excerpt, ['Next, a primary source.', 'It is on the board now.']) ?? '').length < 80 && !/\d{3}, \d{3}, \d{3}/.test(unsaidAsk('Heights in cm: 165, 170, 168, 172, 175, 180, 178, 169. Suggest a bin width.', ['Now a histogram choice.', 'The card is up.']) ?? ''));
    check('equations said and not written are found', JSON.stringify(unwrittenEquations('Dividing by 36 gives x²/9 + y²/4 = 1, which is correct. Compare it with the standard form (x − h)²/a² + (y − k)²/b² = 1.', ['Dividing by 36 — \\begin{aligned} \\frac{4x^2}{36} + \\frac{9y^2}{36} &= \\frac{36}{36} \\\\ \\frac{x^2}{9} + \\frac{y^2}{4} &= 1 \\end{aligned}'])) === JSON.stringify(['(x − h)²/a² + (y − k)²/b² = 1']) && unwrittenEquations('Next is the Valladolid debate of 1550 to 1551, and h = 0.', []).length === 0);
    check('the check may card only a question that was asked aloud', saidCovers('For test scores from 60 to 99, with bins of 10 points, what are the bins?', 'For test scores from 60 to 99, if each bin covers 10 points, what would the bins be?') && !saidCovers('Now try $x\\cos x$.', 'Not quite. The derivative of x sin x is sin x plus x cos x. Fix the bottom.'));
    const chart = boardBlocksIn('<board chart type="histogram" title="Heights" x="cm" width="5">165, 170, 168, 172</board><board chart type="bar">Cats | 4\nDogs | 6</board><board chart>3</board>').map(inlineToolCall);
    check('a chart block is a statistical plot', chart[0].name === 'show_stats' && (chart[0].args.data as number[]).length === 4 && chart[0].args.binWidth === 5 && (chart[1].args.bar as { values: number[] }).values[1] === 6 && !boardMisfit(chart[0].name, chart[0].args) && !!boardMisfit(chart[2].name, chart[2].args));
    const binned = inlineToolCall(boardBlocksIn('<board chart type="histogram">60 | 70 | 2\n70 | 80 | 5\n80 | 90 | 1</board>')[0]);
    check('a histogram already counted keeps its bins; an empty figure call is refused', (binned.args.bins as number[][])[1][2] === 5 && !binned.args.data && !boardMisfit(binned.name, binned.args) && !!boardMisfit('show_venn_diagram', {}));
    check('a page turns where its heading is first named', inlineSentenceIndex('new_page', 'Stemplot', ['Yes, three students scored 6.', 'Each dot is one student, so the dotplot keeps every value.', 'Next is the stemplot.', 'It splits each number.'], 0) === 2 && inlineSentenceIndex('new_page', 'Histogram', ['Good.', 'Now something new.'], 0) === 0);
    const slipText = 'Yes, it is a circle. Dividing by 4 gives $x^2 + y^2 = 4$, so the radius is 2.';
    const slip: V2ModelCall = async (params, onText) => { const last = String(params.messages[params.messages.length - 1].content); if (/slip of calculation/.test(last)) return msg([{ type: 'text', text: 'correction: Multiplying both sides by 4, not dividing, gives that equation.' }], 'end_turn'); onText?.(slipText); return msg([{ type: 'text', text: slipText }], 'end_turn'); };
    const rs = await runV2Turn({ session: voice, state: newV2State(1_000_000), studentSaid: 'a circle', callModel: slip, boardPass: false, mathsCheck: true });
    const sound: V2ModelCall = async (params, onText) => { const last = String(params.messages[params.messages.length - 1].content); if (/slip of calculation/.test(last)) return msg([{ type: 'text', text: 'maths: ok' }], 'end_turn'); onText?.(slipText); return msg([{ type: 'text', text: slipText }], 'end_turn'); };
    const rk = await runV2Turn({ session: voice, state: newV2State(1_000_000), studentSaid: 'a circle', callModel: sound, boardPass: false, mathsCheck: true });
    check('a slip of calculation is put right at the end of the same reply, and kept in the history', /One correction: Multiplying both sides by 4/.test(rs.spoken) && JSON.stringify(rs.state.history).includes('One correction') && !/correction/i.test(rk.spoken), rs.spoken);
    const cmp3 = inlineToolCall(boardBlocksIn('<board compare left="Encomienda" right="Repartimiento">Who holds the labor | one colonist | colonial officials\nHow long | a lasting grant | rotating drafts</board>')[0]);
    check('a compare row may name what it compares', JSON.stringify(cmp3.args.headers) === JSON.stringify(['', 'Encomienda', 'Repartimiento']) && (cmp3.args.rows as string[][])[1][2] === 'rotating drafts');
    const forms = boardBlocksIn('<board ranks title="Casta">Peninsulares | born in Spain\nCriollos | American-born\nMestizos</board><board web>Spanish Crown | grants the right to | an encomendero\nencomendero | demands labor from | a group of Native people\nencomendero | owes protection to | a group of Native people</board><board note>Your rows so far: 6 | 2, and 7 | 0 3 5. Check the 6 stem.</board><board note>Fewer grants to abuse | Still forced labor all the same | No free choice for workers</board>').map(inlineToolCall);
    check('ranks are a pyramid; a web merges repeated links and one thing named twice; a bar in a note is kept unless it separates points',
      forms[0].name === 'show_diagram' && ((forms[0].args.params as { tiers: unknown[] }).tiers.length === 3) && (forms[1].args.nodes as unknown[]).length === 3 && (forms[1].args.edges as Array<{ label: string }>).length === 2 && /; owes protection/.test((forms[1].args.edges as Array<{ label: string }>)[1].label)
      && String(forms[2].args.text).includes('6 | 2, and 7 | 0 3 5') && String(forms[3].args.text).split('\n').length === 3, forms);
    const two = 'Here is the circle. <board graph>x^2 + y^2 = 25</board> Now a point on it. <board graph>(3, 4) | point on the circle</board> And this. <board equation>$r^2 = 25$, \\text{ so } $r = 5$</board>';
    const twoCall: V2ModelCall = async (_p, onText) => { onText?.(two); return msg([{ type: 'text', text: two }], 'end_turn'); };
    const rg = await runV2Turn({ session: voice, state: { ...newV2State(1_000_000), history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Hello.' }] }, studentSaid: 'draw it', callModel: twoCall, boardPass: false });
    const graphs = rg.toolCalls.filter((c) => c.name === 'show_function_graph');
    check('a second graph on the page is drawn with the first and takes its place; an equation with dollar signs is a note', graphs.length === 2 && graphs[1].replaces === graphs[0].id && (graphs[1].args.functions as unknown[]).length === 1 && (graphs[1].args.points as unknown[]).length === 1 && rg.state.board.pages[0].items.filter((it) => it.tool === 'show_function_graph').length === 1 && rg.toolCalls.some((c) => c.name === 'annotate' && /so \$r = 5\$/.test(String(c.args.text))), rg.toolCalls);
    const open1 = stub([msg([], 'end_turn'), msg([{ type: 'text', text: 'Hi. What do you know?' }], 'end_turn')]);
    const ro = await runV2Turn({ session: voice, state: newV2State(1_000_000), studentSaid: null, callModel: open1.call, boardPass: false });
    check('the opening reply cannot be silence', /What do you know/.test(ro.spoken) && /waiting for you to begin/.test(JSON.stringify(open1.seen[0].messages)), [ro.spoken, JSON.stringify(open1.seen[0].messages).slice(0, 300)]);
    const tri = inlineToolCall(boardBlocksIn('<board graph>x^2 + y^2 = 25\n(3, 4) | the point\n(0, 0) to (3, 0) | horizontal leg\n(3, 0) to (3, 4) | vertical leg</board>')[0]);
    check('a graph takes straight segments', (tri.args.segments as Array<{ to: { x: number; y: number }; label: string }>).length === 2 && (tri.args.segments as Array<{ to: { x: number; y: number }; label: string }>)[1].to.y === 4 && (tri.args.functions as unknown[]).length === 1 && (tri.args.points as unknown[]).length === 1);
    const turned = 'Yes, $x^2 = -12y$ is correct. The parabola opens downward.\n\nNow a new part: telling the conics apart. <board page>Recognizing conics</board> <board note>Same sign: circle or ellipse</board> Which shape has opposite signs?';
    const turnedCall: V2ModelCall = async (params, onText) => { const last = String((params.messages[params.messages.length - 1].content as Array<{ text?: string }>)[0]?.text ?? ''); if (/board check/.test(last)) return msg([{ type: 'text', text: '1: none\n<board equation with="Yes, x² = −12y is correct">x^2 = -12y</board>\n<board note with="Which shape has opposite signs">Opposite signs: hyperbola or not?</board>' }], 'end_turn'); onText?.(turned); return msg([{ type: 'text', text: turned }], 'end_turn'); };
    const rpt = await runV2Turn({ session: voice, state: { ...newV2State(1_000_000), board: { pages: [{ title: 'Parabola', items: [] }], current: 0 }, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Find its equation.' }] }, studentSaid: 'x squared equals minus 12 y', callModel: turnedCall });
    const eq = rpt.toolCalls.find((c) => c.name === 'show_equation'); const late = rpt.toolCalls.filter((c) => c.name === 'annotate').pop();
    check('what the check adds for words before a page turn goes on the page before', !!eq?.beforeTurn && !late?.beforeTurn && rpt.state.board.pages[0].items.some((it) => it.tool === 'show_equation') && !rpt.state.board.pages[1].items.some((it) => it.tool === 'show_equation'), rpt.toolCalls);
    // Round 5 (AP Physics, embed-1794493438983).
    const lastOf = (params: Parameters<V2ModelCall>[0]) => String((params.messages[params.messages.length - 1].content as Array<{ text?: string }>)[0]?.text ?? '');
    const kvl = 'Good. Now Kirchhoff\'s voltage law: go once around any closed loop, and the gains and drops add to zero.\n\n<board page>Kirchhoff\'s voltage law</board>\n\nTake the series circuit from earlier. What must the drops across the two resistors add up to?';
    const kvlCall: V2ModelCall = async (params, onText) => { if (/board check/.test(lastOf(params))) return msg([{ type: 'text', text: '1: none\n<board note with="Now Kirchhoff\'s voltage law: go once around">Kirchhoff\'s voltage law: around a closed loop, add up the rises and drops.</board>\n3: none' }], 'end_turn'); onText?.(kvl); return msg([{ type: 'text', text: kvl }], 'end_turn'); };
    const kv = await runV2Turn({ session: voice, state: { ...newV2State(1_000_000), board: { pages: [{ title: 'Parallel pair', items: [] }], current: 0 }, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Does that make sense?' }] }, studentSaid: 'yes sure', callModel: kvlCall });
    check('a note for the sentence that names the new page goes on the new page', kv.state.board.pages[1]?.items.some((it) => it.tool === 'annotate') && !kv.state.board.pages[0].items.some((it) => it.tool === 'annotate'), kv.state.board.pages);
    const mixed = 'Good, we will go straight to a mixed problem. Here is one with a 12 volt battery, a 6 ohm resistor in series with a 3 ohm and 6 ohm pair in parallel.\n\n<board page>Mixed series and parallel</board>\n<board problem>A 12 V battery is connected to a 6 Ω resistor in series with 3 Ω and 6 Ω in parallel. Find the total current.</board>\n\nFind the total current drawn from the battery.';
    const mixedCall: V2ModelCall = async (params, onText) => { if (/board check/.test(lastOf(params))) return msg([{ type: 'text', text: '1: none\n2: none\n<board figure kind="circuit" with="Here is one with a 12 volt battery">{"battery":"12 V","load":{"series":[{"resistor":"6 Ω"},{"parallel":[{"resistor":"3 Ω"},{"resistor":"6 Ω"}]}]}}</board>' }], 'end_turn'); onText?.(mixed); return msg([{ type: 'text', text: mixed }], 'end_turn'); };
    const mx = await runV2Turn({ session: { ...voice, subject: 'sci', topic: 'physics circuits' }, state: { ...newV2State(1_000_000), board: { pages: [{ title: 'Lesson', items: [] }], current: 0 }, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Sound good?' }] }, studentSaid: 'give me a harder one', callModel: mixedCall });
    check('a figure for a problem introduced just before its page turn goes on the new page', mx.state.board.pages[1]?.items.some((it) => it.tool === 'show_circuit') && !mx.state.board.pages[0].items.some((it) => it.tool === 'show_circuit'), mx.state.board.pages);
    // Round 6 (AP Physics, embed-1794496967839).
    const physics = { ...voice, subject: 'sci', topic: 'physics circuits' };
    check('the tutor itself is told of the circuit figure in a physics lesson, and not in a history one', /\n  circuit: /.test(v2SessionPart(physics)) && !/circuit:/.test(v2SessionPart({ ...voice, subject: 'ss', topic: 'history' })), v2SessionPart(physics).slice(0, 300));
    const seenChecks: string[] = [];
    const spyCheck = (text: string): V2ModelCall => async (params, onText) => { const last = lastOf(params); if (/board check/.test(last)) { seenChecks.push(last); return msg([{ type: 'text', text: '1: none\n2: none\n3: none' }], 'end_turn'); } onText?.(text); return msg([{ type: 'text', text }], 'end_turn'); };
    const st6 = () => ({ ...newV2State(1_000_000), board: { pages: [{ title: 'Parallel', items: [] }], current: 0 }, history: [{ role: 'user' as const, content: 'hi' }, { role: 'assistant' as const, content: 'What is the total?' }] });
    await runV2Turn({ session: physics, state: st6(), studentSaid: 'what do you mean parallel', callModel: spyCheck('No problem, let us look at the picture. In parallel, the two resistors sit on separate branches, so the current from the battery can take either path.\n\n<board problem>Two resistors, 4 Ω and 6 Ω, are connected in parallel. Find 1 over R total.</board>\n\nWhat do you get for 1 over R total when R1 is 4 ohms and R2 is 6 ohms?') });
    await runV2Turn({ session: physics, state: st6(), studentSaid: 'must be 8 volts', callModel: spyCheck('Yes, 8 volts. The 4 volt and 8 volt drops add to the 12 volt rise, so the loop sums to zero. Shall we go on to the next part, or do you have a question first?') });
    check('the check is told of a promised picture, a card with no figure, and a confirmed answer with nothing written', /You spoke of a picture/.test(seenChecks[0] ?? '') && /put up a problem and no figure/.test(seenChecks[0] ?? '') && !/You confirmed/.test(seenChecks[0] ?? '') && /You confirmed the student's answer/.test(seenChecks[1] ?? '') && !/You spoke of a picture/.test(seenChecks[1] ?? ''), seenChecks.map((c) => c.slice(-600)));
    const mistake = 'Yes, it is always smaller than the smallest resistor. <board note style="warning">Common mistake: parallel resistance is not bigger. The total is always smaller than the smallest resistor.</board> Each extra branch gives the current another path.\n\nDoes that make sense so far?';
    const gone: string[] = [];
    const wd = (line: string): V2ModelCall => async (params, onText) => { if (/board check/.test(lastOf(params))) return msg([{ type: 'text', text: `${line}\n2: none\n3: none` }], 'end_turn'); onText?.(mistake); return msg([{ type: 'text', text: mistake }], 'end_turn'); };
    const st5 = () => ({ ...newV2State(1_000_000), board: { pages: [{ title: 'Parallel', items: [] }], current: 0 }, history: [{ role: 'user' as const, content: 'hi' }, { role: 'assistant' as const, content: 'Bigger or smaller?' }] });
    for (const line of ['withdraw 1', 'withdraw 1 "Does that make sense so far?"', 'withdraw 1 "What is the total resistance of the pair?"']) await runV2Turn({ session: voice, state: st5(), studentSaid: 'is it always less', callModel: wd(line), onBoardWithdraw: (id) => gone.push(id) });
    check('a withdrawal must name a question the reply asked, and a check-in is not one', gone.length === 0, gone);
    const asks = 'Each resistor takes 6 volts. <board note>Around the loop: the gains and losses net to 0.</board> Around the loop, the gain is 12 and the losses are 6 and 6.\n\nWhat do they add up to?';
    const wd2: V2ModelCall = async (params, onText) => { if (/board check/.test(lastOf(params))) return msg([{ type: 'text', text: 'withdraw 1 "What do they add up to?"\n2: none\n3: none' }], 'end_turn'); onText?.(asks); return msg([{ type: 'text', text: asks }], 'end_turn'); };
    await runV2Turn({ session: voice, state: st5(), studentSaid: 'voltage does not flow', callModel: wd2, onBoardWithdraw: (id) => gone.push(id) });
    check('a withdrawal that quotes the question the reply asked is honoured', gone.length === 1, gone);
    const say5 = (text: string): V2ModelCall => async (_params, onText) => { onText?.(text); return msg([{ type: 'text', text }], 'end_turn'); };
    const drafts = { call: say5('Let us slow down. <board note>Walking around the loop:\nStart: battery gives +12 V\nAfter first resistor: −6 V\nAfter second resistor: −6 V</board> <board note>Walking around the loop, starting at the battery:\nStart: battery gives +12 V\nAfter first resistor: 12 V − ? V\nAfter second resistor: ? V</board> After the first resistor, how many volts are left?') };
    const dr = await runV2Turn({ session: voice, state: st5(), studentSaid: 'I do not understand', callModel: drafts.call, boardPass: false });
    const notes = dr.toolCalls.filter((c) => c.name === 'annotate');
    check('a second draft of a note in the same reply takes the place of the first', dr.state.board.pages[0].items.filter((it) => it.tool === 'annotate').length === 1 && notes[1]?.replaces === notes[0]?.id, dr.toolCalls);
    const net = circuitNetlist({ battery: '12 V', load: { series: [{ resistor: '2 Ω' }, { parallel: [{ resistor: '4 Ω' }, { resistor: '6 Ω' }] }] } }).components as Array<{ type: string; from: string; to: string; label?: string }>;
    const r = (label: string) => net.find((c) => c.label === label)!;
    check('a circuit told as series and parallel groups is wired that way', net.length === 4 && r('4 Ω').from === r('6 Ω').from && r('4 Ω').to === r('6 Ω').to && r('2 Ω').to === r('4 Ω').from && r('2 Ω').from === r('12 V').to && r('4 Ω').to === r('12 V').from, net);
    const loop = circuitNetlist({ components: [{ type: 'battery', label: '9 V' }, { type: 'resistor', label: '3 Ω' }, { type: 'resistor', label: '6 Ω' }] }).components as Array<{ from: string; to: string }>;
    check('the older single-loop circuit form is one closed loop', loop.length === 3 && loop[1].to === loop[2].from && loop[2].to === loop[0].from && loop[1].from === loop[0].to, loop);
    const circ = inlineToolCall(boardBlocksIn('<board figure kind="simple_circuit">{"components":[{"type":"battery","label":"12 V"},{"type":"resistor","label":"4 Ω"}]}</board>')[0]);
    check('a circuit figure is drawn by the circuit tool, and the catalogue offers one circuit', circ?.name === 'show_circuit' && /\n  circuit: /.test(`\n${figureCatalogueFor({ subject: 'sci', topic: 'physics', level: '12' })}`) && !/simple_circuit/.test(figureCatalogueFor({ subject: 'sci', topic: 'physics', level: '12' })), circ);
    const gr = inlineToolCall(boardBlocksIn('<board graph x="0..5" y="0..1.2" xname="time, in time constants" yname="fraction of full charge">1 - e^{-x}</board>')[0]);
    check('a graph block names its axes', gr?.args.xLabel === 'time, in time constants' && gr?.args.yLabel === 'fraction of full charge', gr);
    check('a unit with a prefix on a card is not mathematics', typesetMaths('A 100 μF capacitor charges through a 10 kΩ resistor.') === 'A 100 μF capacitor charges through a 10 kΩ resistor.', typesetMaths('A 100 μF capacitor charges through a 10 kΩ resistor.'));
    check('the opening is short and ends by asking', /three sentences at most/.test(JSON.stringify((await (async () => { let seen = ''; const spy: V2ModelCall = async (params, onText) => { seen = JSON.stringify(params.messages); onText?.('Hi.'); return msg([{ type: 'text', text: 'Hi.' }], 'end_turn'); }; await runV2Turn({ session: voice, state: newV2State(1_000_000), studentSaid: null, callModel: spy, boardPass: false }); return seen; })()))), '');
    const paras = new SentenceStream(); const paraCut = [...paras.push('Yes, both right. They ranked above mestizos.\n\nNext is the debate. Las Casas argued one side.\n'), ...paras.push('\nWhich side won? '), ...paras.flush()];
    check('the sentence stream marks where paragraphs begin', paraCut.length === 5 && [...paras.paragraphStarts].join() === '0,2,4', [...paras.paragraphStarts]);
    const waited = stub([msg([{ type: 'tool_use', id: 'k1', name: 'keep_listening', input: {} }], 'tool_use'), msg([{ type: 'text', text: 'The Crown later shifted to the repartimiento.' }], 'end_turn')]);
    const rw = await runV2Turn({ session: voice, state: { ...newV2State(1_000_000), history: [{ role: 'user', content: 'ok' }, { role: 'assistant', content: 'The encomienda was a grant.' }] }, studentSaid: null, facts: { nowMs: 1_010_000, silenceSeconds: V2_NO_ASK_RECHECK_S }, callModel: waited.call, boardPass: false });
    check('after a reply that ended on a statement, saying nothing is not open to the tutor', /repartimiento/.test(rw.spoken) && rw.modelCalls === 2, rw.spoken);
    const twice = stub([msg([{ type: 'text', text: 'Hi. What do you know about spin?' }, { type: 'tool_use', id: 'k2', name: 'keep_listening', input: {} }], 'tool_use'), msg([{ type: 'text', text: 'Hi. What do you know about spin?' }], 'end_turn')]);
    const rtw = await runV2Turn({ session: voice, state: newV2State(1_000_000), studentSaid: null, callModel: twice.call, boardPass: false });
    check('an opening that has spoken and then hands over is not asked to speak again', rtw.modelCalls === 1 && (rtw.spoken.match(/What do you know/g) ?? []).length === 1, [rtw.modelCalls, rtw.spoken]);
    const codeNote = inlineToolCall(boardBlocksIn('<board note style="highlight">public static int count(int n) {\n  if (n == 1) return 1;     // base case\n  return 1 + count(n - 1);  // recursive case\n}</board>')[0]);
    check('a note that is program code becomes a code listing', codeNote.name === 'show_code' && codeNote.args.language === 'java' && /\n  if \(n == 1\)/.test(String(codeNote.args.code)), codeNote);
    const rbk = richBlocks('Here is a new method:\n\nint g(int n) { if (n <= 0) return 0; return n % 2 + g(n - 1); }\n\nWhat does g(5) return?');
    check('code on one line inside a problem is set out as typed', rbk.length === 3 && rbk[1].kind === 'code' && rbk[1].text.split('\n').length === 4 && rbk[2].kind === 'line', rbk);
    const rt2 = richBlocks('Rotational Motion and Angular Momentum\nApply rotational analogs of force.\nBase case: where it stops.\nThe time complexity is O(2^n).', { titled: true });
    check('a note gets a heading, a labelled point and typeset powers', rt2[0].kind === 'title' && rt2[2].kind === 'line' && rt2[2].label === 'Base case' && rt2[3].text.includes('$O(2^n)$') && richBlocks('Solve x = 3; then check.\nIt ends here.', { titled: true }).every((b) => b.kind === 'line'), rt2);
    const fig = inlineToolCall(boardBlocksIn('<board figure kind="torque">{"armLength":"0.3 m","force":"20 N","pivot":"bolt"}</board>')[0]);
    check('a catalogue figure is drawn from its kind and parameters, and refused when it cannot be solved', fig.name === 'show_diagram' && fig.args.type === 'torque' && boardMisfit(fig.name, fig.args) === null && /armLength is missing/.test(String(boardMisfit('show_diagram', { type: 'torque', params: { force: '20 N' } }))) && /unknown kind/.test(String(boardMisfit('show_diagram', { type: 'nonsense', params: {} }))), fig);
    const physCat = figureCatalogueFor({ subject: 'science', topic: 'ap-physics-1', level: 'ap' }); const csCat = figureCatalogueFor({ subject: 'cs', topic: 'ap-cs-a', level: '11' });
    check('the board check is shown the figures of the lesson\'s own subject', /\n  torque: /.test(`\n${physCat}`) && !/titration_curve|recursion_tree/.test(physCat) && /recursion_tree/.test(csCat) && !/torque/.test(csCat) && /titration_curve/.test(figureCatalogueFor({ subject: 'sci', topic: 'chemistry', level: '11' })) && /solid_of_revolution/.test(figureCatalogueFor({ subject: 'math', topic: 'ap-calculus-bc', level: '12' })), [physCat.length, csCat.length]);
    const fg = (t: string) => inlineToolCall(boardBlocksIn(t)[0]);
    const bp = fg('<board figure kind="boxplot">{"boxplot":{"datasets":[{"label":"A","min":1,"q1":2,"median":3,"q3":4,"max":5}]}}</board>');
    const tt = fg('<board figure kind="distribution_curve">{"type":"histogram","distribution":{"family":"t","params":{"df":18},"shade":{"type":"greater","a":2.1}}}</board>');
    check('a figure kind that is a tool of its own becomes that tool\'s call', bp.name === 'show_stats' && bp.args.type === 'boxplot' && tt.name === 'show_stats' && tt.args.type === 'distribution' && fg('<board figure kind="annotated_passage">{"passage":"a\\nb","highlights":[{"line":1,"text":"a"}]}</board>').name === 'show_annotated_passage' && fg('<board figure kind="call_stack">{"frames":[{"function":"f(1)"}]}</board>').name === 'show_call_stack', [bp, tt]);
    const sh = fg('<board graph x="-1..3" y="-1..5">x^2\n2x\nshade between 2x and x^2 from 0 to 2</board>');
    check('a graph takes a shaded area between two curves', (sh.args.functions as unknown[]).length === 2 && JSON.stringify(sh.args.shadedRegion) === JSON.stringify({ axis: 'x', between: ['2x', 'x^2'], from: 0, to: 2 }), sh.args);
    const pair = { type: 'before_after', params: { before: { kind: 'rotation', label: 'arms out', params: { radius: '2 m', omega: '2 rad/s', largestRadius: 2 } }, after: { kind: 'rotation', label: 'arms in', params: { radius: '1 m', largestRadius: 2 } } } };
    check('a before-and-after pair is two catalogue figures, and half a pair is refused', boardMisfit('show_diagram', pair) === null && /radius is missing/.test(String(boardMisfit('show_diagram', { type: 'before_after', params: { ...pair.params, after: { kind: 'rotation', params: {} } } }))) && /at is the place along/.test(String(boardMisfit('show_diagram', { type: 'rigid_body', params: { forces: [{ at: 3, direction: 'down', label: '5 N' }] } }))) && boardMisfit('show_diagram', { type: 'rigid_body', params: { forces: [{ at: 0.2, direction: 'down', label: '5 N' }], supports: [{ at: 0.5 }] } }) === null, pair);
    check('each subject is offered its own tool figures', /\n  boxplot: /.test(`\n${figureCatalogueFor({ subject: 'math', topic: 'ap-statistics', level: '12' })}`) && /annotated_passage/.test(figureCatalogueFor({ subject: 'ela', topic: 'ap-english-lit', level: '11' })) && /rigid_body[\s\S]*before_after|before_after[\s\S]*rigid_body/.test(physCat) && /molecule/.test(figureCatalogueFor({ subject: 'sci', topic: 'chemistry', level: '11' })) && !/molecule|boxplot/.test(physCat), physCat.length);
    const stmt = stub([msg([{ type: 'text', text: 'Yes, it never stops. The program crashes with a StackOverflowError.' }], 'end_turn')]);
    const rStmt = await runV2Turn({ session: voice, state: { ...newV2State(1_000_000), history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'What happens?' }] }, studentSaid: 'it goes on forever', callModel: stmt.call, boardPass: false });
    check('a spoken reply that asks nothing ends by handing the turn over', V2_CHECK_INS.some((c) => rStmt.spoken.endsWith(c)) && V2_CHECK_INS.some((c) => JSON.stringify(rStmt.state.history[rStmt.state.history.length - 1]).includes(c)), rStmt.spoken);
    const asked = stub([msg([{ type: 'text', text: 'Have you met the disc method before? Picture the region spinning around the axis.' }], 'end_turn')]);
    const ra = await runV2Turn({ session: voice, state: { ...newV2State(1_000_000), history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Hello.' }] }, studentSaid: 'ok', callModel: asked.call, boardPass: false });
    check('a question in the middle of a reply already hands the turn over', !V2_CHECK_INS.some((c) => ra.spoken.includes(c)) && asksAnywhere(['Have you met it before?', 'Picture the region spinning.', 'It sweeps out a solid.']) && !asksAnywhere(['It never stops.', 'The program crashes.']) && asksAnywhere(['Good.', 'Fix the bottom.']), ra.spoken);
    const sayIt = (text: string): V2ModelCall => async (_params, onText) => { onText?.(text); return msg([{ type: 'text', text }], 'end_turn'); };
    const carry = { call: sayIt('Yes, that is right. Next is the washer case. <board note>Each slice is a ring</board>\n\n<board page>Washer method</board>\n<board note>Outer radius and inner radius</board> Which curve is the outer radius?') };
    const rc = await runV2Turn({ session: voice, state: { ...newV2State(1_000_000), board: { pages: [{ title: 'Disc method', items: [] }], current: 0 }, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Find it.' }] }, studentSaid: 'pi over 2', callModel: carry.call, boardPass: false });
    const pageCall = rc.toolCalls.find((c) => c.name === 'new_page');
    check('an item written just before a page turn, with no words between, goes on the new page', pageCall?.carries?.length === 1 && rc.state.board.pages[0].items.length === 0 && rc.state.board.pages[1].items.length === 2, [pageCall, rc.state.board.pages.map((pg) => pg.items.length)]);
    const lit = { call: sayIt('The woods pull one way. <board forces object="the speaker">the woods | left | strong\nthe promises | right | strong</board> What does the speaker choose?') };
    const rl = await runV2Turn({ session: { ...voice, subject: 'ela', topic: 'ap-english-lit' }, state: { ...newV2State(1_000_000), history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Read it.' }] }, studentSaid: 'ok', callModel: lit.call, boardPass: false });
    check('a force diagram is refused in a lesson with no physical forces', /^not painted: a force diagram is for physical forces/.test(rl.toolCalls.find((c) => c.name === 'show_free_body_diagram')?.outcome ?? ''), rl.toolCalls);
    const farBoard = { pages: [{ title: 'P', items: [] as Array<{ id: string; tool: string; summary: string }> }], current: 0 };
    applyToModelBoard(farBoard, 'p1', 'show_problem', { statement: 'Revolve y = √x from 0 to 1 and find the volume.' });
    const near = applyToModelBoard(farBoard, 'p2', 'show_problem', { statement: 'Revolve y = √x from 0 to 1 and find the volume.' });
    for (let i = 0; i < 6; i++) applyToModelBoard(farBoard, `e${i}`, 'show_equation', { latex: `a_${i} = ${i} + ${i * 7}` });
    const far = applyToModelBoard(farBoard, 'p3', 'show_problem', { statement: 'Revolve y = √x from 0 to 1 and find the volume.' });
    check('a problem card written again on its own page is pointed at, however far up, never copied', !near.painted && near.pointAt === 'p1' && !far.painted && far.pointAt === 'p1' && farBoard.pages[0].items.filter((it) => it.tool === 'show_problem').length === 1, [near, far]);
    const eqCarry = { call: sayIt('Yes, four domains. The table lists the shapes.\n\n<board equation label="Domains on N">3 + 1 = 4</board>\n\n<board page>Shapes from domain counts</board>\n<board note>Four domains: tetrahedral</board> What shape is it?') };
    const re2 = await runV2Turn({ session: voice, state: { ...newV2State(1_000_000), history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Count them.' }] }, studentSaid: 'four', callModel: eqCarry.call, boardPass: false });
    check('a line of working written just before a page turn stays on the page it closes', !re2.toolCalls.find((c) => c.name === 'new_page')?.carries && re2.state.board.pages[re2.state.board.pages.length - 2]?.items.some((it) => it.tool === 'show_equation'), re2.state.board.pages);
    const again = { call: sayIt('Good. <board problem>Multiply the matrix by the vector and say what you get.</board> What do you get?') };
    const st0 = newV2State(1_000_000); st0.history = [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Try it.' }];
    const first = await runV2Turn({ session: voice, state: st0, studentSaid: 'ok', callModel: again.call, boardPass: false });
    const second = await runV2Turn({ session: voice, state: first.state, studentSaid: 'back to the problem', callModel: again.call, boardPass: false });
    const pointed = second.toolCalls.find((c) => c.name === 'show_problem');
    check('a block written again points at the item already up', !!pointed?.pointsAt && pointed.pointsAt === first.toolCalls.find((c) => c.name === 'show_problem')?.id && /scrolled back/.test(pointed.outcome), second.toolCalls);
    check('a matrix, a column and a vector typed on a line are typeset', typesetMaths('Let A = [[1, 2], [0, 1]] and v = [3; 1].').includes('$A = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}$') && typesetMaths('u = ⟨1, 2⟩').includes('\\langle') && typesetMaths('the list [1, 2, 3] and arr[0]') === 'the list [1, 2, 3] and arr[0]' && typesetMaths('line ŷ = 25 − 1.8x.').includes('\\hat{y} = 25'), typesetMaths('Let A = [[1, 2], [0, 1]] and v = [3; 1].'));
    check('a first line that defines a term is not a heading', richBlocks('s_x: standard deviation of the x values\ns_y: standard deviation of the y values', { titled: true }).every((b) => b.kind === 'line'), richBlocks('s_x: standard deviation of the x values\ns_y: of y', { titled: true }));
    const twoFig = (o: number[][]) => applyToModelBoard(farBoard, `d${o.length}${o[1][1]}`, 'show_diagram', { type: 'solid_of_revolution', params: { outer: o, axis: 'x', method: 'washer' } });
    check('twoFig catalogue figures with different numbers are different items', twoFig([[0, 0], [0.5, 0.5], [1, 1]]).painted && twoFig([[0, 0], [0.25, 0.5], [0.5, 0.71], [1, 1]]).painted && !twoFig([[0, 0], [0.5, 0.5], [1, 1]]).painted, farBoard.pages[0].items.length);
    check('mathematics inside a sentence is typeset; words, years and chemistry are not', typesetMaths('Try it on y = x² from x = 0 to x = 2, around the x-axis.') === 'Try it on $y = x^{2}$ from $x = 0$ to $x = 2$, around the $x$-axis.' && typesetMaths('Outer radius R = x (the higher curve, y = x).') === 'Outer radius $R = x$ (the higher curve, $y = x$).' && /\\int_\{a\}\^\{b\}/.test(typesetMaths('Volume: V = π ∫ from a to b of r(x)² dx')) && ['The war ran 1861 - 1865 and I + you agree.', 'pH = pKa + log([A⁻]/[HA])', 'A force of 20 N at 0.3 m.', 'acetate (A⁻) and already $x^2$ here'].every((t) => typesetMaths(t) === t), typesetMaths('Volume: V = π ∫ from a to b of r(x)² dx'));
    check('a heading may end in a colon, and a prose line ending in "):" is not code', (() => { const b = richBlocks('Disc method (region touches the axis):\n- Each slice is a circle\n- Area is known', { titled: true }); return b[0].kind === 'title' && b[0].text === 'Disc method (region touches the axis)' && b[1].kind === 'line' && b[1].text === 'Each slice is a circle'; })());
    check('a lone variable and a product of variables are typeset; units, list markers and words are not', typesetMaths('dogs walked (x)') === 'dogs walked $(x)$' && typesetMaths('Find the constant k, with its units.') === 'Find the constant $k$, with its units.' && typesetMaths('in the form y = kx.') === 'in the form $y = kx$.' && typesetMaths('has x-values 3, 5 and 8') === 'has $x$-values 3, 5 and 8' && ['It fell 5 m in 2 s.', 'b. the second option', 'Class A and plan B', 'so it is not a or i', 'x is to be found'].every((t) => typesetMaths(t) === t || t.startsWith('x is')), typesetMaths('in the form y = kx.'));
    const tbl = inlineToolCall(boardBlocksIn('<board table>dogs walked (x) | money earned (y)\n3 | 24</board>')[0]);
    check('a table heading with a variable is typeset', (tbl.args.headers as string[])[0] === 'dogs walked $(x)$' && (tbl.args.rows as string[][])[0][1] === '24', tbl.args);
    const gCall = (text: string): V2ModelCall => async (_params, onText) => { onText?.(text); return msg([{ type: 'text', text }], 'end_turn'); };
    const g1 = await runV2Turn({ session: voice, state: { ...newV2State(1_000_000), board: { pages: [{ title: 'P', items: [] }], current: 0 }, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Go.' }] }, studentSaid: 'ok', callModel: gCall('Here is the line. <board graph x="0..8" y="0..60">8x | y = 8x</board> <board problem>A snowfall line passes through (4, 10). Find k.</board> <board graph x="0..6" y="0..12">(0, 0) to (4, 10) | the line\n(4, 10) | the point</board> What is k?'), boardPass: false });
    const newGraphs = g1.toolCalls.filter((c) => c.name === 'show_function_graph');
    check('a graph for a new problem is not merged with the last problem\'s graph', newGraphs.length === 2 && !newGraphs[1].replaces && (newGraphs[1].args.functions as unknown[]).length === 0, newGraphs.map((c) => [c.replaces, c.args.functions]));
    const twiceQuiet = stub([msg([{ type: 'tool_use', id: 'k9', name: 'keep_listening', input: {} }], 'tool_use'), msg([{ type: 'text', text: 'A female has two X chromosomes. What does a male have?' }], 'end_turn')]);
    const rQuiet = await runV2Turn({ session: voice, state: { ...newV2State(1_000_000), history: [{ role: 'user', content: 'the female would need to have the why' }, { role: 'assistant', content: 'Go on.' }] }, studentSaid: null, facts: { nowMs: 1_010_000, silenceSeconds: V2_WAITED_RECHECK_S }, callModel: twiceQuiet.call, boardPass: false });
    check('after keeping quiet once, silence is not open to the tutor a second time', /two X chromosomes/.test(rQuiet.spoken) && /they had finished/.test(JSON.stringify(twiceQuiet.seen[0].messages)), rQuiet.spoken);
    check('a young student\'s grade sets the pace in the session part', /grade 7: go slower/.test(v2SessionPart({ ...voice, level: '7' })) && /A child in grade 3/.test(v2SessionPart({ ...voice, level: '3' })) && !/go slower|A child/.test(v2SessionPart({ ...voice, level: '11' })) && !/go slower/.test(v2SessionPart({ ...voice, level: 'ap' })));
    const sk = inlineToolCall(boardBlocksIn('<board sketch labels="bolt | 20 N push">a wrench on a bolt, pushed down at the far end</board>')[0]);
    check('a sketch block asks for a drawing with its labels', sk.name === 'show_sketch' && (sk.args.labels as string[]).length === 2 && /wrench/.test(String(sk.args.concept)), sk);
    check('a card keeps its task when the task opens with a method verb', taskOnly('A parabola has focus (0, 1) and directrix y = -1. Write its equation.').statement.endsWith('Write its equation.') && taskOnly('Find the limit. Rewrite it as one fraction first.').cut.length === 1);
    check('roman text keeps its spaces', spacedRoman('\\mathrm{N_2 \\ (atmosphere)} \\to \\mathrm{NH_3 (usable by plants)}').includes('(usable\\ by\\ plants)'));
    const kinds = boardBlocksIn('<board cycle title="N">Fixation | N2 to NH3\nNitrification | to nitrate\nDenitrification | back to N2</board><board web>Fertilizer | runs off into | Lakes\nLakes | grow | Algae</board><board map region="world">Spain | 40 | -4\nHispaniola | 19 N | 71 W</board><board page>Parabolas</board><board compare left="A" right="B">x | y</board>').map(inlineToolCall);
    check('cycle, web, map, page and compare blocks become their board calls', kinds.map((k) => k.name).join(',') === 'show_cycle_diagram,show_concept_map,show_map,new_page,show_table' && (kinds[2].args.pins as Array<{ lon: number }>)[1].lon === -71 && (kinds[1].args.nodes as unknown[]).length === 3, kinds);
    check('a one-step sequence is not a figure', !!boardMisfit('show_graphic_organizer', { kind: 'sequence', steps: ['only one'] }) && !boardMisfit('show_graphic_organizer', { kind: 'sequence', steps: ['a', 'b'] }));
    const typed = stub([msg([{ type: 'text', text: 'The derivative of $x\\sin x$ is $\\sin x + x\\cos x$, by the product rule.' }], 'end_turn')]);
    const rt = await runV2Turn({ session, state: newV2State(1_000_000), studentSaid: 'x', callModel: typed.call });
    check('typed sessions have no board pass: the student reads the reply', rt.modelCalls === 1);
  }
  {
    const early = stub([
      msg([{ type: 'text', text: 'That is everything. Well done.' }, { type: 'tool_use', id: 'z1', name: 'end_lesson', input: { because: 'time_nearly_used', summary: 's' } }], 'tool_use'),
      msg([{ type: 'text', text: 'We have time left: harder ones, more practice, or stop?' }], 'end_turn'),
    ]);
    const re = await runV2Turn({ session, state: newV2State(1_000_000), studentSaid: 'e', nowMs: 1_000_000 + 10 * 60000, callModel: early.call });
    check('the tutor cannot end the lesson by itself with time left: it is sent back to offer the choice', !re.state.closed && re.modelCalls === 2 && /not ended/.test(re.toolCalls[0].outcome));
    const late = stub([msg([{ type: 'text', text: 'Time is nearly up. Well done.' }, { type: 'tool_use', id: 'z2', name: 'end_lesson', input: { because: 'time_nearly_used', summary: 's' } }], 'tool_use')]);
    const rl = await runV2Turn({ session, state: newV2State(1_000_000), studentSaid: 'e', nowMs: 1_000_000 + 22 * 60000, callModel: late.call });
    check('near the end of the time it can', rl.state.closed);
  }
  {
    // A stub that streams its text in small pieces, as the API does.
    const streaming = (text: string, extra: unknown[] = [], stop = 'end_turn') => {
      const seen: unknown[] = [];
      const call: V2ModelCall = async (params, onText) => { seen.push(params); for (let i = 0; i < text.length; i += 7) onText?.(text.slice(i, i + 7)); return msg([{ type: 'text', text }, ...extra], stop); };
      return { call, seen };
    };
    const reply = 'Yes, that works. <board equation label="Your series">\\frac{\\sin x}{x} = 1 - \\frac{x^2}{3!} + \\cdots</board> Dividing by x leaves one minus a small term. <board problem difficulty="medium">Find $\\lim_{x\\to 0} \\frac{\\sin 2x}{x}$.</board> Now try this one.';
    const st = streaming(reply);
    const order: string[] = [];
    const ri = await runV2Turn({ session, state: newV2State(1_000_000), studentSaid: 'series?', callModel: st.call, onText: (d) => order.push(`t:${d}`), onToolCall: (c) => order.push(`b:${c.name}`) });
    const heardText = order.filter((x) => x.startsWith('t:')).map((x) => x.slice(2)).join('');
    check('inline board blocks never reach the student as words', !/board|frac|lim_/.test(heardText) && /Yes, that works\.\s+Dividing by x/.test(heardText) && ri.spoken === 'Yes, that works. Dividing by x leaves one minus a small term. Now try this one.', [heardText, ri.spoken]);
    const before = (name: string) => order.slice(0, order.indexOf(`b:${name}`)).filter((x) => x.startsWith('t:')).map((x) => x.slice(2)).join('');
    check('each block becomes a board call where it stands in the reply', ri.toolCalls.map((c) => c.name).join(',') === 'show_equation,show_problem' && ri.toolCalls.every((c) => c.inline && /^painted/.test(c.outcome)) && /works\.\s*$/.test(before('show_equation')) && /small term\.\s*$/.test(before('show_problem')), [before('show_equation'), before('show_problem'), ri.toolCalls]);
    check('the stored reply keeps its blocks; the board record has both items', JSON.stringify(ri.state.history).includes('<board equation') && ri.state.board.pages[0].items.length === 2 && ri.modelCalls === 1);
    const bad = streaming('Here. <board equation>\\text{This whole thing is a long sentence of words that belongs in a note instead}</board> Look at it.');
    const rb = await runV2Turn({ session, state: newV2State(1_000_000), studentSaid: 'x', callModel: bad.call });
    check('a block that cannot be painted is reported in the next turn\'s facts', /annotate|note/.test((rb.state.boardProblems ?? []).join(' ')) && /not painted in your last reply/.test(renderFacts(session, rb.state, { nowMs: 1_000_000 })));
    const parts = new BoardInlineStream();
    const got = [...parts.push('a <boa'), ...parts.push('rd note>x</bo'), ...parts.push('ard> b <b'), ...parts.flush()];
    check('a block split across stream pieces is still lifted out; a lone "<b" is text', got.map((x) => ('text' in x ? x.text : 'block' in x ? `[${x.block.kind}]` : '')).join('') === 'a [note] b <b', got);
    check('stripping removes an unfinished block too', stripBoardBlocks('Good. <board equation>x</board> Next <board note>cut off') === 'Good. Next');
  }
  {
    const bd = newV2State(1).board;
    applyToModelBoard(bd, 'a', 'show_equation', { latex: '\\ln y = x \\ln x' });
    check('the same line under a label is not painted twice', !applyToModelBoard(bd, 'b', 'show_equation', { latex: '\\ln y = x\\ln x', label: 'log step' }).painted);
    applyToModelBoard(bd, 'c', 'annotate', { text: 'Recap: the rule says $\\lim f/g = \\lim f\'/g\'$ when the form is 0/0. Check the form every time.' });
    check('a note already contained in one on the board is not painted again', !applyToModelBoard(bd, 'd', 'annotate', { text: 'The rule says $\\lim f/g = \\lim f\'/g\'$ when the form is 0/0. Check the form every time.' }).painted);
    check('a longer line of working that extends an earlier one is painted', applyToModelBoard(bd, 'e', 'show_equation', { latex: '\\ln y = x \\ln x = \\frac{\\ln x}{1/x} \\to 0, \\text{ so } y \\to 1' }).painted);
    const t1 = taskOnly('Compute $\\lim_{x\\to 0^+}(\\frac{1}{x}-\\frac{1}{\\sin x})$. Rewrite it as one fraction, then check the form before you apply the rule.');
    check('a problem card keeps the task and drops the how-to-begin sentence', t1.statement === 'Compute $\\lim_{x\\to 0^+}(\\frac{1}{x}-\\frac{1}{\\sin x})$.' && t1.cut.length === 1, t1);
    check('parts, questions and answer-format lines stay', ['A student gets 2. (a) Why is this wrong? (b) What is the correct value?', 'Add $\\frac{1}{2}+\\frac{1}{3}$. Write your answer in simplest form.', 'Maria eats half of 3/4 of a pizza. How much of the whole did she eat?'].every((x) => taskOnly(x).cut.length === 0));
    const op = new BoardInlineStream();
    const ev = [...op.push('Here it is. <board equa'), ...op.push('tion>x'), ...op.push('</board> ok')].map((x) => ('text' in x ? 't' : 'block' in x ? 'b' : 'o')).join('');
    check('the stream says once that a block has begun, before the block', ev === 'tobt', ev);
    const sk = new SentenceStream(); sk.push('One. ');
    check('the sentence cutter knows whether more words have begun', !sk.hasPending() && (sk.push('Tw'), sk.hasPending()));
  }
  {
    const a = ['That\'s right, 2.', 'You differentiated the top and got 2 cos 2x over 1.', 'Next, a case where you may need the rule twice.'];
    check('working appears as its stretch of speech begins; a problem with the sentence that poses it', inlineSentenceIndex('show_equation', 'x', a, 0) === 0 && inlineSentenceIndex('show_problem', 'x', a, 0) === 2);
    const sled = ['Yes, the box keeps sitting, because balanced forces leave its motion unchanged.', 'Now a bigger case with three forces.', 'A sled sits still on snow in a yard that runs north and south.', 'Two friends pull it north, one with 60 newtons and one with 45 newtons.', 'A third friend pulls it south with 105 newtons.'];
    const card = 'problem: A sled sits still on packed snow in a yard that runs north and south. Two friends pull it north: 60 newtons and 45 newtons. A third pulls south with 105 newtons. Find the net force on the sled.';
    check('a problem appears as the tutor starts telling it, with its short lead-in', inlineSentenceIndex('show_problem', card, sled, 0) === 1, inlineSentenceIndex('show_problem', card, sled, 0));
    check('a problem never appears under the verdict on the last answer', inlineSentenceIndex('show_problem', card, ['Yes, the sled stays put with 105 newtons each way.', 'A third friend now pulls south with 85 newtons.'], 0) === 1);
    check('a long sentence before the problem is not its lead-in', inlineSentenceIndex('show_problem', card, [sled[0], 'When the net force is not zero the motion changes in the direction of that net force every time.', sled[2]], 0) === 2);
    check('an item after an earlier block starts no earlier than the words since that block', inlineSentenceIndex('annotate', 'x', a, 2) === 2 && inlineSentenceIndex('show_equation', 'x', a, 9) === 2);
    const figs = boardBlocksIn('<board forces object="Box">Push | right | 10 N\nFriction | west | 4 N</board><board numberline>4 | open | right</board><board graph x="-2..6">y = x^2 - 4x + 3</board>').map(inlineToolCall);
    check('forces, number line and graph are written as plain lines', figs.map((f) => f.name).join(',') === 'show_free_body_diagram,show_number_line,show_function_graph' && (figs[0].args.forces as Array<{ direction: string }>)[1].direction === 'left' && (figs[1].args.points as Array<{ style: string }>)[0].style === 'open' && (figs[2].args.functions as Array<{ expr: string }>)[0].expr === 'x^2 - 4x + 3', figs);
    check('an empty figure is turned back', /at least one function/.test(boardMisfit('show_function_graph', { title: 'Tug-of-war', functions: [], points: [] }) ?? '') && boardMisfit('show_function_graph', { functions: [{ expr: 'x^2' }] }) === null);
    check('plain words typed into an equation are set as words', wordsAsText('2x + 22, and at x = 3 that gives 28') === '2x + 22, \\text{ and at } x = 3 \\text{ that gives } 28' && wordsAsText('\\text{Net force} = 8 - 3') === '\\text{Net force} = 8 - 3' && wordsAsText('\\sin x + \\to \\infty') === '\\sin x + \\to \\infty');
    const names = (sub: string, topic: string) => v2Tools(sub, topic).map((t) => t.name).filter((n) => n.startsWith('show_')).join(',');
    check('figure tools follow the lesson topic: no graph tool in a forces lesson', names('science', 'grade-8-physical-science Forces') === '' && names('science', 'chemistry') === 'show_lewis_constructed' && /show_tree/.test(names('math', 'ap-statistics')) && names('math', 'algebra-1') === '');
  }
  check('the earlier turn is replayed from history, without its facts', first.length === 1 && /session has just started/.test(first[0].text));
  check('the last history message carries a cache mark', !!beforeTail[beforeTail.length - 1].cache_control);
  check('the student\'s words are sent as they are', tail2[0].text === 'It is 3.');
  check('facts now show the board, the note and the answer check', /problem "Evaluate/.test(tail2[1].text) && /your note: Sam: AP level/.test(tail2[1].text) && /answer check: the student's 3 matches/.test(tail2[1].text), tail2[1].text);
  const out2 = r2.toolCalls.map((t) => t.outcome);
  check('a repeat of what is on the board is not painted', /^not painted again: already on the board \(page 1\)/.test(out2[0]), out2[0]);
  check('a goal status is recorded', out2[1] === 'recorded' && r2.state.goals['try-basic']?.status === 'demonstrated');
  check('an unknown goal is refused with the goal list', /^not recorded: no goal "nope"/.test(out2[2]) && out2[2].includes('hook'));
  check('an invalid board call is refused by the validator', /^not painted: /.test(out2[3]), out2[3]);
  check('a failed tool call gets the model a second look, with the results and its own thinking', r2.modelCalls === 2 && JSON.stringify(b.seen[1].messages).includes('already on the board') && r2.spoken === 'Yes, 3 is right.\n\nNext.', [r2.modelCalls, r2.spoken]);

  console.log('a reply with no words');
  const q = stub([
    msg([{ type: 'thinking', thinking: 'note first', signature: 's' }, { type: 'tool_use', id: 't9', name: 'update_session_note', input: { note: 'n' } }], 'tool_use'),
    msg([{ type: 'text', text: 'Bye for now.' }, { type: 'tool_use', id: 't10', name: 'end_lesson', input: { because: 'student_asked', summary: 's' } }], 'tool_use'),
  ]);
  const rq = await runV2Turn({ session, state: r1.state, studentSaid: 'I have to go', callModel: q.call });
  check('a silent reply is followed up so the student is never left without words', rq.modelCalls === 2 && rq.spoken === 'Bye for now.' && rq.state.closed && JSON.stringify(q.seen[1].messages).includes('note first'), [rq.modelCalls, rq.spoken]);

  console.log('closing');
  const c = stub([msg([{ type: 'text', text: 'Good work today.' }, { type: 'tool_use', id: 't7', name: 'end_lesson', input: { because: 'student_asked', summary: 'Did 0/0 limits.' } }], 'tool_use')]);
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
  const leak = stub([msg([{ type: 'text', text: 'Well done. Then end_lesson.' }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'student_asked', summary: 's' } }], 'tool_use')]);
  const rl = await runV2Turn({ session, state: r1.state, studentSaid: 'bye', callModel: leak.call });
  check('the turn\'s words come back without the leak', rl.spoken === 'Well done.', rl.spoken);

  console.log('selection');
  check('every partner is on v1 until cut over', ['crimsora', 'greenapple', 'gdi-demo', 'gameclass', 'unknown-partner', ''].every((id) => resolvePartnerSessionOptions({ partnerId: id }).brainVersion === 'v1'));

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main();
