// Task 7f: runs with the default switches (test:brain-v2) and with NEXT_PUBLIC_TUTOR_V2_CLOSE_BY_CONTENT=off
// (test:brain-v2-before-7f), the one check that differs being flag-aware.
import { BoardInlineStream, boardBlocksIn, inlineToolCall, stripBoardBlocks } from '../src/lib/tutor/v2/board-inline';
import { richBlocks, typesetMaths, typesetPowers, looksLikeCodeLine, isCodeBody } from '../src/lib/tutor/v2/rich-text';
import { segment, autoWrapLatex, autoWrapUnicodeMath } from '../src/lib/tutor/whiteboard/inline-math';
import { circuitNetlist, figureCatalogueFor } from '../src/lib/tutor/v2/figure-catalogue';
import { heardAsWords } from '../src/lib/tutor/v2/heard';
import { mayOpenPart, partOffer } from '../src/lib/tutor/v2/part-close';
import { mentionsTool } from '../src/lib/tutor/v2/tool-talk';
import { applyToModelBoard, renderBoard, boardMisfit, spacedRoman, taskOnly, wordsAsText, stackedRow } from '../src/lib/tutor/v2/board';
import { anchorSentenceFinal, anchorSentenceIndex, asksAloud, inlineSentenceIndex, saidCovers, unsaidAsk, unsaidBoardItem, asksAnywhere } from '../src/lib/tutor/v2/board-timing';
import { TUTOR_V2_CLOSE_BY_CONTENT, TUTOR_V2_OWN_KEY_NOT_LANGUAGE, TUTOR_V2_QUESTION_ONCE, TUTOR_V2_SAY_SENTENCE_CARD, TUTOR_V2_SPEAK_BOARD_ITEM } from '../src/lib/tutor/orchestrator/flags';
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
import { DISCUSSION_CHECK_INS, DISCUSSION_OPENING, DISCUSSION_VERDICT_WORDS, V2_DISCUSSION_CONSTITUTION, directionAnswered, discussionOf, discussionStageIndex, reflectAsked, reflectAtMinutes, renderDiscussionMap, untoldCases } from '../src/lib/tutor/v2/discussion';
import { PRIVATE_ECS_AI_LITERACY_CH2 } from '../src/lib/tutor/lesson-plan/private/ecs-ai-literacy-ch2';
import { SEED_PLANS, getLessonPlan, isPrivatePlan } from '../src/lib/tutor/lesson-plan/store';
import type { LessonPlan as PlanT } from '../src/lib/tutor/lesson-plan/types';
import { renderPlanMap } from '../src/lib/tutor/v2/plan-map';
import { v2Tools } from '../src/lib/tutor/v2/tools';
import { runV2Turn, v2SessionPart, v2StudentBlock, type V2ModelCall, V2_CHECK_INS } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session } from '../src/lib/tutor/v2/types';
import { answeredAsItEnded } from '../src/lib/tutor/v2/interrupted';
import { paintsOnBoard, streamV2Turn } from '../src/lib/tutor/v2/client';
import { gradeOfLevel, isMathsSubject, isScienceSubject } from '../src/lib/tutor/v2/session-kind';
import { v2Progress, goalForProblem, goalForTitle, goalForTalk, laterPartAlone, wholeProblem } from '../src/lib/tutor/v2/progress';
import * as envsciSeed from '../src/lib/tutor/lesson-plan/seeds/ap-envsci-u1-carbon-water-cycles';
import { SEED_AP_STATS_U2_SCATTERPLOTS } from '../src/lib/tutor/lesson-plan/seeds/ap-stats-u2-scatterplots';
import { SEED_AP_APGOV_U2_PRESIDENCY } from '../src/lib/tutor/lesson-plan/seeds/ap-apgov-u2-presidency';
import { SEED_AP_CALCBC_U5_FIRST_DERIVATIVE_ANALYSIS } from '../src/lib/tutor/lesson-plan/seeds/ap-calcbc-u5-first-derivative-analysis';
import { closeDueMinutes, reopensClose, asksToWait } from '../src/lib/tutor/v2/close-heard';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { v2Background } from '../src/lib/tutor/v2/background';
import { V2_MASTERY_DOWN, V2_MASTERY_UP, V2_MASTERY_UP_MIXED, v2Mastery, v2MemoryLines, v2ProfileCommit } from '../src/lib/tutor/v2/memory';
import { v2StateFromCheckpoint } from '../src/lib/tutor/v2/resume';
import { V2_CONTROL_TOOL_NAMES } from '../src/lib/tutor/v2/tool-names';
import { drawFigure } from '../src/lib/tutor/v2/drawn-figures';
import { speakGroups } from '../src/lib/tutor/voice/tts-pronunciation';
import { SentenceStream } from '../src/lib/tutor/v2/sentences';
import { mentionsTool, stripToolTalk } from '../src/lib/tutor/v2/tool-talk';
import { isOwnVoice } from '../src/lib/tutor/v2/own-voice';
import { ROOM_NOISY_AFTER, afterWords, partialIsConfirmed, partialIsJudged, plainlyTheStudent, repliedBackground, roomCheckMessage, roomVoicesFact, sameWords, studentPart, studentWordsIn, waitsForCheck } from '../src/lib/tutor/v2/room-voices';
import { foldInterruptedTurn, trimToSpoken, V2_CUT_MARK } from '../src/lib/tutor/v2/interrupted';
import { SEED_DSAT_U1_LINEAR_INEQUALITIES } from '../src/lib/tutor/lesson-plan/seeds/dsat-u1-linear-inequalities';
import { brainVersionOverrides, resolvePartnerSessionOptions, v2CanRunSession } from '../src/lib/tutor/portal/partner-session-options';

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
  // 26,000 since 2026-11-13 (three teaching principles, drawing what is pictured, and the session's own figures with their parameters). 18,000 since 2026-11-10: the eleven board forms are listed in the principles (a reference list, not rules).
  check(`constitution + session part stay small (${sys.length} chars)`, sys.length < 26000, sys.length);
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
    const rk = await runV2Turn({ session: { ...session, mode: 'voice' }, state: newV2State(1_000_000), studentSaid: 'so if I put x equal to zero, um', callModel: quiet.call });
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
    check('a page turns where its heading is first named', inlineSentenceIndex('new_page', 'Stemplot', ['Yes, three students scored 6.', 'Each dot is one student, so the dotplot keeps every value.', 'Next is the stemplot.', 'It splits each number.'], 0) === 2 && inlineSentenceIndex('new_page', 'Histogram', ['Good.', 'Now something new.'], 0) === 2);
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
    // Round 7 (AP Physics, embed-1794500923861).
    const say7 = (text: string): V2ModelCall => async (_params, onText) => { onText?.(text); return msg([{ type: 'text', text }], 'end_turn'); };
    const pages7 = () => ({ ...newV2State(), /* mid-lesson: started now, not decades past its time box (the close window opens pages, turn.ts closingTurn) */ board: { pages: [{ title: 'Lesson', items: [] }, { title: 'Series', items: [] }, { title: "Kirchhoff's voltage law", items: [] }], current: 2 }, history: [{ role: 'user' as const, content: 'hi' }, { role: 'assistant' as const, content: 'The battery rise is 12 V and the two drops are 6 V each. Do the rises and drops add to zero?' }] });
    const flip = 'Yes, 12 V up and 6 V + 6 V down adds to zero, so the voltage law holds.\n\n<board page>RC circuits</board>\n<board problem>A 100 μF capacitor charges through a 10 kΩ resistor. Find the time constant.</board>\n\nWhat do you get for tau?';
    const heardText: string[] = [];
    const fl = await runV2Turn({ session: physics, state: pages7(), studentSaid: 'Uh, yes, they do.', callModel: say7(flip), boardPass: false, onText: (t) => heardText.push(t) });
    const flHist = JSON.stringify(fl.state.history[fl.state.history.length - 1]);
    check('a new part the student was not asked about is held: the reply ends with the offer, and nothing of the new part is shown or said', fl.state.board.pages.length === 3 && !fl.toolCalls.some((c) => c.name === 'show_problem' || c.name === 'new_page') && /Next is RC circuits\. Shall we go on, or do you have a question first\?$/.test(fl.spoken) && !/tau/.test(fl.spoken) && !/tau/.test(heardText.join('')) && !/board page|What do you get/.test(flHist) && /Shall we go on/.test(flHist), { spoken: fl.spoken, flHist });
    const go = await runV2Turn({ session: physics, state: pages7(), studentSaid: 'Yes they do, can we move on?', callModel: say7(flip), boardPass: false });
    check('a student who asks to move on gets the new page at once', go.state.board.pages.length === 4 && go.toolCalls.some((c) => c.name === 'show_problem'), go.toolCalls);
    const offered = { ...pages7(), history: [{ role: 'user' as const, content: 'hi' }, { role: 'assistant' as const, content: 'Yes, the law holds. Next is RC circuits. Shall we go on, or do you have a question first?' }] };
    const go2 = await runV2Turn({ session: physics, state: offered, studentSaid: 'yes', callModel: say7(flip), boardPass: false });
    check('after the offer, a yes opens the page', go2.state.board.pages.length === 4, go2.toolCalls);
    check('a task question that says "before we go on" is not an offer', !mayOpenPart({ title: "Kirchhoff's voltage law", studentSaid: 'smaller than both', lastTutor: 'Before we go on, quick check: is the 2.4 Ω total bigger or smaller than the 4 Ω resistor on its own?', pagesOpen: 5 }) && mayOpenPart({ title: 'AC and DC', studentSaid: 'is AC harder than DC', lastTutor: 'Sound good?', pagesOpen: 2 }), '');
    const twoCircuits = 'Here are both.\n\n<board figure kind="circuit">{"battery":"12 V","load":{"series":[{"resistor":"6 Ω"},{"resistor":"6 Ω"}]}}</board>\n<board figure kind="circuit">{"battery":"12 V","load":{"parallel":[{"resistor":"6 Ω"},{"resistor":"6 Ω"}]}}</board>\n\nWhich is which?';
    const tw = await runV2Turn({ session: physics, state: st6(), studentSaid: 'show me both', callModel: say7(twoCircuits), boardPass: false });
    check('two untitled circuits wired differently are two figures', tw.state.board.pages[0].items.filter((it) => it.tool === 'show_circuit').length === 2, tw.toolCalls);
    const cardTurn = 'Yes, 12 divided by 4 gives 3 amps. Next is series resistors, where the resistances add up.\n\n<board page>Series resistors</board>\n<board problem>Two 6 Ω resistors are connected in series with a 12 V battery. Find the current.</board>\n\nFind the current.';
    const cardCall: V2ModelCall = async (params, onText) => { if (/board check/.test(lastOf(params))) return msg([{ type: 'text', text: '1: none\n2: none\n<board figure kind="circuit" with="Two 6 Ω resistors are connected in series">{"battery":"12 V","load":{"series":[{"resistor":"6 Ω"},{"resistor":"6 Ω"}]}}</board>' }], 'end_turn'); onText?.(cardTurn); return msg([{ type: 'text', text: cardTurn }], 'end_turn'); };
    const ct = await runV2Turn({ session: physics, state: { ...pages7(), history: [{ role: 'user' as const, content: 'hi' }, { role: 'assistant' as const, content: 'Next is series resistors. Ready?' }] }, studentSaid: 'yes, 12 divided by 4', callModel: cardCall });
    check('a figure the check anchors to the problem card goes on the card\'s page', ct.state.board.pages[3]?.items.some((it) => it.tool === 'show_circuit') && !ct.state.board.pages[2].items.some((it) => it.tool === 'show_circuit'), ct.state.board.pages);
    check('a lone 1 or 2 that is a pronoun is written as the word, and a quantity is left alone', heardAsWords('basically we just multiply the 2. So I got this 1. Um, we can just move on.') === 'basically we just multiply the two. So I got this one. Um, we can just move on.' && heardAsWords('12 divided by 12 is equal to 1 amp, and this 1 second') === '12 divided by 12 is equal to 1 amp, and this 1 second' && heardAsWords('the 2 resistors') === 'the 2 resistors', heardAsWords('multiply the 2. So I got this 1.'));
    let toldModel = ''; const spy7: V2ModelCall = async (params, onText) => { toldModel = lastOf(params); onText?.('Sure.'); return msg([{ type: 'text', text: 'Sure. Ready?' }], 'end_turn'); };
    await runV2Turn({ session: physics, state: st6(), studentSaid: 'So I got this 1.', callModel: spy7, boardPass: false });
    check('the tutor reads the spoken words with the pronoun restored', /I got this one\./.test(toldModel), toldModel.slice(-200));
    check('an order to the board said aloud is not spoken', mentionsTool('Open a new page for it.') && !mentionsTool('Let us look at a new page of problems.'), '');
    // Round 8 (AP Calc BC embed-1794511321049, chemistry embed-1794512595935, AP CS A embed-1794513964237).
    const set8 = (t: string) => typesetPowers(typesetMaths(t));
    check('calculus on a card is set as mathematics', set8('Product rule: d/dx(uv) = u′v + uv′') === "Product rule: $\\frac{d}{dx}(uv) = u'v + uv'$" && set8('Compute ∫ x e^(2x) dx. Choose u and dv.') === 'Compute $\\int  x e^{2x} \\,dx$. Choose $u$ and $dv$.' && set8('E: exponential (eˣ)') === 'E: exponential $(e^{x})$' && set8('Leave + C off v.') === 'Leave + $C$ off $v$.', [set8('Product rule: d/dx(uv) = u′v + uv′'), set8('Compute ∫ x e^(2x) dx. Choose u and dv.'), set8('E: exponential (eˣ)')]);
    check('a chemical formula is set upright, alone or in a reaction, and a quantity beside it stays words', set8('It breaks down into sodium (Na) and nitrogen gas (N₂).') === 'It breaks down into sodium $\\mathrm{(Na)}$ and nitrogen gas $\\mathrm{(N_{2})}$.' && /^The reaction is \$2\\,\\mathrm\{H_\{2\}\} \+ \\mathrm\{O_\{2\}\}\s+\\rightarrow\s+2\\,\\mathrm\{H_\{2\}O\}\$\./.test(set8('The reaction is 2 H₂ + O₂ → 2 H₂O.')) && set8('so 8.0 g H₂ ÷ 2.0 g/mol') === 'so 8.0 g $\\mathrm{H_{2}}$ ÷ 2.0 g/mol' && set8('As the pH rises, He said no.') === 'As the pH rises, He said no.', [set8('It breaks down into sodium (Na) and nitrogen gas (N₂).'), set8('The reaction is 2 H₂ + O₂ → 2 H₂O.'), set8('so 8.0 g H₂ ÷ 2.0 g/mol')]);
    const codeCard = richBlocks('Trace this method and say what mystery(5) returns. public static int mystery(int n) { if (n == 0) return 0; return n + mystery(n - 1); }');
    check('a problem that runs straight into its code is a sentence and then the code', codeCard.length === 2 && codeCard[0].kind === 'line' && codeCard[1].kind === 'code' && /^public static int mystery/.test(codeCard[1].text), codeCard);
    check('"let\'s take a look" and "how many grams" are not a request to move on', !mayOpenPart({ title: 'Oxygen needed', studentSaid: "Uh sure. So um let's take a look at this. So 4 moles will give 4 moles of sodium, which is 92 grams.", lastTutor: 'Before we go on, try the sodium question from the airbag page on your own.', pagesOpen: 4 }) && !mayOpenPart({ title: 'Propane practice', studentSaid: 'how many grams of oxygen comes from its molar mass, so it should need 64 grams', lastTutor: 'Find what went wrong, and give the correct mass of O₂.', pagesOpen: 6 }) && mayOpenPart({ title: 'Hydrogen and water', studentSaid: 'Can you give me um some other reaction maybe?', lastTutor: 'Now try one on your own.', pagesOpen: 3 }), '');
    const back8 = await runV2Turn({ session: physics, state: { ...pages7(), current: 2 } as never, studentSaid: 'can you go back to that', callModel: say7('Sure, we are back on it.\n\n<board page>Series</board>\n\nGo ahead.'), boardPass: false });
    const backCall = back8.toolCalls.find((c) => c.name === 'go_to_page');
    check('turning back to a page tells the board which page', backCall?.args.title === 'Series' && backCall?.args.page === 2 && back8.state.board.current === 1, back8.toolCalls);
    const twoPages = { ...newV2State(1_000_000), board: { pages: [{ title: 'Formula', items: [{ id: 'a1', tool: 'show_equation', summary: 'integration by parts — \\int u\\,dv = uv - \\int v\\,du', core: '\\intu\\,dv=uv-\\intv\\,du' }] }, { title: 'Log first', items: [] }], current: 1 }, history: [{ role: 'user' as const, content: 'hi' }, { role: 'assistant' as const, content: 'What are du and v?' }] };
    const again8 = await runV2Turn({ session: voice, state: twoPages, studentSaid: 'can you write the formula again', callModel: say7('Here it is again.\n\n<board equation label="integration by parts">\\int u\\,dv = uv - \\int v\\,du</board>\n\nWhat do you get?'), boardPass: false });
    check('a thing asked for again is written on the page in view when its first copy is on another page', again8.state.board.pages[1].items.some((it) => it.tool === 'show_equation'), again8.toolCalls);
    const chemWork = await runV2Turn({ session: physics, state: st6(), studentSaid: '72 grams', callModel: say7('Yes, 72 g of water.\n\n<board equation label="Your working">\\begin{aligned} 8.0 \\text{ g H}_2 \\div 2.0 \\text{ g/mol} &= 4.0 \\text{ mol H}_2 \\\\ 4.0 \\text{ mol H}_2 \\times \\frac{2 \\text{ mol H}_2\\text{O}}{2 \\text{ mol H}_2} &= 4.0 \\text{ mol H}_2\\text{O} \\\\ 4.0 \\text{ mol H}_2\\text{O} \\times 18.0 \\text{ g/mol} &= 72 \\text{ g H}_2\\text{O} \\end{aligned}</board>\n\nReady for the next one?'), boardPass: false });
    check('working written with its units is an equation, not a sentence', chemWork.state.board.pages[0].items.some((it) => it.tool === 'show_equation'), chemWork.toolCalls);
    const parts8 = 'Yes, du = dx and v = −cos x are both right. Putting them into the formula gives this.\n\n<board equation label="applying the formula">\\int x\\sin x\\,dx = -x\\cos x - \\int (-\\cos x)\\,dx</board>\n\nCan you finish that last integral?';
    const orderCall: V2ModelCall = async (params, onText) => { if (/board check/.test(lastOf(params))) return msg([{ type: 'text', text: '1: none\n<board equation with="Yes, du = dx and v">du = dx,\\quad v = -\\cos x</board>\n3: none' }], 'end_turn'); onText?.(parts8); return msg([{ type: 'text', text: parts8 }], 'end_turn'); };
    const ord = await runV2Turn({ session: voice, state: st6(), studentSaid: 'du is dx and v is negative cos x', callModel: orderCall });
    const ordItems = ord.state.board.pages[0].items.filter((it) => it.tool === 'show_equation');
    check('what the check writes for an earlier sentence goes under what is already up, never above it', ordItems.length === 2 && /du=dx/.test(ordItems[1].core ?? '') && ord.toolCalls.every((c) => c.before === undefined), { ordItems, calls: ord.toolCalls });
    // Round 9 (biology, embed-1794520770137).
    const heldCalls: Array<{ name: string; outcome: string }> = [];
    await runV2Turn({ session: physics, state: pages7(), studentSaid: 'Uh, yes, they do.', callModel: say7(flip), boardPass: false, onToolCall: (c) => heldCalls.push(c) });
    const heldPage = heldCalls.find((c) => c.name === 'new_page');
    check('a held page is told to the client as not opened, and the client does not paint it', !!heldPage && !paintsOnBoard(heldPage as never, new Set<string>()), heldCalls);
    check('a page the student agreed to is marked so, one they steered to is not', go2.toolCalls.find((c) => c.name === 'new_page')?.agreed === true && go.toolCalls.find((c) => c.name === 'new_page')?.agreed !== true, [go.toolCalls, go2.toolCalls]);
    const bio9 = () => ({ ...newV2State(1_000_000), board: { pages: [{ title: 'Alleles', items: [] }], current: 0 }, history: [{ role: 'user' as const, content: 'hi' }, { role: 'assistant' as const, content: 'What genotype would you write?' }] });
    const geno1 = await runV2Turn({ session: physics, state: bio9(), studentSaid: 'x little a x little a', callModel: say7('Yes.\n\n<board equation label="colour-blind female">X^a X^a</board>\n\nAnd a carrier?'), boardPass: false });
    const geno2 = await runV2Turn({ session: physics, state: geno1.state, studentSaid: 'x big a x little a', callModel: say7('Yes, that is right.\n\n<board equation label="carrier female">X^A X^a</board>\n\nNow try a cross.'), boardPass: false });
    check('a capital and a small letter are different mathematics: X^A X^a is not a repeat of X^a X^a', geno2.state.board.pages[0].items.filter((it) => it.tool === 'show_equation').length === 2 && !geno2.toolCalls.some((c) => c.pointsAt), geno2.toolCalls);
    const wide9 = await runV2Turn({ session: physics, state: bio9(), studentSaid: 'the son is normal and the daughter is a carrier', callModel: say7('Yes, that is right.\n\n<board equation label="children of X^a Y × X^A X^A">X^A Y (normal son from the mother\'s X and the father\'s Y), X^A X^a (carrier daughter from the mother\'s X and the father\'s X)</board>\n\nShall we go on?'), boardPass: false });
    const wideNote = wide9.state.board.pages[0].items.find((it) => it.tool === 'annotate');
    check('working too wide for an equation goes up as a note, a line for each outcome', !!wideNote && /children of[\s\S]*\n[\s\S]*normal son[\s\S]*\n[\s\S]*carrier daughter/.test(wideNote.summary), wide9.toolCalls);
    const family9 = 'Not quite, it is recessive. Let us test that on a new family. In generation I, an unaffected man is married to an unaffected woman.\n\n<board problem>In generation I, an unaffected man is married to an unaffected woman. They have three children: an affected daughter, an unaffected son, and an unaffected daughter. Which conclusion does this pedigree support?</board>\n\nWhich conclusion does it support?';
    const ped9 = '{"individuals":[{"id":"I1","sex":"male","status":"unaffected","generation":1,"position":0},{"id":"I2","sex":"female","status":"unaffected","generation":1,"position":1},{"id":"II1","sex":"female","status":"affected","generation":2,"position":0}],"marriages":[{"pair":["I1","I2"]}],"children":[{"parents":["I1","I2"],"childId":"II1"}]}';
    const figCall: V2ModelCall = async (params, onText) => { if (/board check/.test(lastOf(params))) return msg([{ type: 'text', text: `1: none\n<board figure kind="pedigree" with="In generation I, an unaffected">${ped9}</board>\n3: none` }], 'end_turn'); onText?.(family9); return msg([{ type: 'text', text: family9 }], 'end_turn'); };
    const fam = await runV2Turn({ session: voice, state: bio9(), studentSaid: 'so the trait was dominant', callModel: figCall });
    const famItems = fam.state.board.pages[0].items.map((it) => it.tool);
    check('a figure the check draws for a problem stands under its card', famItems.indexOf('show_problem') >= 0 && famItems.indexOf('show_pedigree') > famItems.indexOf('show_problem') && !fam.toolCalls.find((c) => c.name === 'show_pedigree')?.before, { famItems, calls: fam.toolCalls.map((c) => [c.name, c.outcome, c.before]) });
    const offerSpy: string[] = [];
    const offerCall: V2ModelCall = async (params, onText) => { if (/board check/.test(lastOf(params))) { offerSpy.push('check'); return msg([{ type: 'text', text: '1: none\n<board note>Females: XX. Males: XY.</board>\n3: none' }], 'end_turn'); } const t = 'Good, so you already know the name of it and you have met it before in a family you know well enough. Let us start with the chromosomes that decide why boys are affected more often than girls across the whole population of a country.\n\n<board page>Sex chromosomes</board>\n<board note>Females: XX</board>\n\nFemales have two.'; onText?.(t); return msg([{ type: 'text', text: t }], 'end_turn'); };
    const off9 = await runV2Turn({ session: voice, state: pages7(), studentSaid: 'yeah I have heard of it', callModel: offerCall });
    check('a reply that ended on the offer of the next part is not written ahead by the check', offerSpy.length === 0 && off9.state.board.pages.length === 3 && !off9.toolCalls.some((c) => c.name === 'annotate'), { offerSpy, calls: off9.toolCalls });
    // Round 10 (AP World History, embed-1794536181149).
    const partSpy: string[] = [];
    const partCall: V2ModelCall = async (params, onText) => { if (/board check/.test(lastOf(params))) { partSpy.push('check'); return msg([{ type: 'text', text: '1: none\n2: none\n3: none' }], 'end_turn'); } const t = 'Yes, paper money is a valid answer. Now part (b): how did it make trade bigger?'; onText?.(t); return msg([{ type: 'text', text: t }], 'end_turn'); };
    await runV2Turn({ session: voice, state: st6(), studentSaid: 'paper money', callModel: partCall });
    check('the next part of a question asked aloud with nothing written is put to the board check', partSpy.length === 1, partSpy);
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
    // A derivative named in a sentence is set whole, and so is a number on x standing by itself (portal-8e2d86f3).
    check('f prime in a sentence is one piece of mathematics', typesetMaths("Critical point: where f'(x) = 0 or f'(x) does not exist.") === "Critical point: where $f'(x) = 0$ or $f'(x)$ does not exist." && typesetMaths("At x = 0: f' goes from negative to positive.") === "At $x = 0$: $f'$ goes from negative to positive." && typesetMaths("Sign of f' and the shape of f") === "Sign of $f'$ and the shape of $f$", typesetMaths("At x = 0: f' goes from negative to positive."));
    check('a number on x said by itself is mathematics; "2x faster" is not', typesetMaths('For x < 0, 2x is negative, so f is falling.') === 'For $x < 0$, $2x$ is negative, so $f$ is falling.' && typesetMaths('It runs 2x faster now.') === 'It runs 2x faster now.' && typesetMaths("the student's answer") === "the student's answer", typesetMaths('It runs 2x faster now.'));
    {
      const fd = SEED_AP_CALCBC_U5_FIRST_DERIVATIVE_ANALYSIS;
      check('a plan problem asked in other words is known by its formula; a formula of the tutor\'s own belongs to no part', goalForProblem(fd, 'For f(x) = x³ − 12x, find the intervals where f is increasing and where it is decreasing, and find the local maximum and local minimum.') === 'try-analyze' && goalForProblem(fd, 'For f(x) = x^4 - 8x^2 + 1 on the closed interval [-3, 2], find the absolute maximum and the absolute minimum, using the Candidates Test.') === 'try-absolute' && goalForProblem(fd, 'For f(x) = x^3 - 3x on the closed interval [-2, 3], find the absolute maximum and the absolute minimum, using the Candidates Test.') === null && goalForProblem(fd, 'For f(x) = x^2 on the closed interval [-1, 2], find the absolute maximum and the absolute minimum.') === null);
    }
    check('several statements typed as one row go up one to a line', stackedRow('f(-3) = 81 - 72 + 1 = 10, \\quad f(-2) = 16 - 32 + 1 = -15, \\quad f(0) = 1, \\quad f(2) = -15') === '\\begin{aligned} &f(-3) = 81 - 72 + 1 = 10 \\\\ &f(-2) = 16 - 32 + 1 = -15 \\\\ &f(0) = 1 \\\\ &f(2) = -15 \\end{aligned}' && stackedRow('f(0) = 0, \\quad f(2) = 4') === 'f(0) = 0, \\quad f(2) = 4' && stackedRow('x = \\frac{a}{b} \\quad \\text{for all } t') === 'x = \\frac{a}{b} \\quad \\text{for all } t' && stackedRow('a = 1 \\\\ b = 2, \\quad c = 3') === 'a = 1 \\\\ b = 2, \\quad c = 3', stackedRow('f(0) = 0, \\quad f(2) = 4'));
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
    const typedQuiet = stub([msg([{ type: 'tool_use', id: 'k3', name: 'keep_listening', input: {} }], 'tool_use'), msg([{ type: 'text', text: 'Close. What happens to the smell across the room?' }], 'end_turn')]);
    const rtq = await runV2Turn({ session: { ...voice, mode: 'text' }, state: { ...newV2State(1_000_000), history: [{ role: 'user', content: 'ok' }, { role: 'assistant', content: 'What happens to the smell?' }] }, studentSaid: 'The particles fly around fast and far apart.', callModel: typedQuiet.call, boardPass: false });
    check('a typed message is finished: keeping silent is not open to the tutor (demo check 11-13)', /smell/.test(rtq.spoken) && rtq.modelCalls === 2, [rtq.modelCalls, rtq.spoken]);
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
    const rStmt = await runV2Turn({ session: voice, state: { ...newV2State(1_000_000), history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'What happens?' }] }, studentSaid: 'it goes on forever', nowMs: 1_000_000 + 60000, callModel: stmt.call, boardPass: false });
    const rBye = await runV2Turn({ session: { ...voice, timeBoxMinutes: 30 }, state: { ...newV2State(1_000_000), history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'What happens?' }] }, studentSaid: 'ok', nowMs: 1_000_000 + 29 * 60000, callModel: stub([msg([{ type: 'text', text: 'Good work today.' }], 'end_turn')]).call, boardPass: false });
    check('with the close due, a goodbye is not followed by a check-in', rBye.spoken === 'Good work today.', rBye.spoken);
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
    // Task 7f D (CLOSE_BY_CONTENT): with no host wrap, the close by the clock opens at the wrap minute, box − 2 (23 of 25); main
    // (Task 8e merge): at the close due, two minutes before the box. 23.5 is past both.
    const rl = await runV2Turn({ session, state: newV2State(1_000_000), studentSaid: 'e', nowMs: 1_000_000 + 23.5 * 60000, callModel: late.call });
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
    const ri = await runV2Turn({ session, state: newV2State(1_000_000), studentSaid: 'series?', callModel: st.call, boardPass: false, onText: (d) => order.push(`t:${d}`), onToolCall: (c) => order.push(`b:${c.name}`) });
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
  {
    // A lesson stopped before its recap ends on a recap page made from the plan's own points.
    const planR = SEED_AP_CALCBC_U5_FIRST_DERIVATIVE_ANALYSIS;
    const bye = () => stub([msg([{ type: 'text', text: 'Good work today.' }, { type: 'tool_use', id: 'e9', name: 'end_lesson', input: { because: 'student_asked', summary: 's' } }], 'tool_use')]);
    const stR = newV2State(1_000_000); applyToModelBoard(stR.board, 'pg', 'new_page', { title: 'Try it' }); stR.goals = { 'concept-first-deriv': { status: 'shown', at: 1 } } as never;
    const rr = await runV2Turn({ session: { ...session, plan: planR }, state: stR, studentSaid: "I'll just stop here", callModel: bye().call });
    const note = rr.toolCalls.find((c) => c.name === 'annotate');
    check('a lesson stopped early ends on a recap page of the plan\'s points, with no further model call', rr.state.closed && rr.modelCalls === 1 && rr.toolCalls.some((c) => c.name === 'new_page' && c.args.title === 'Recap') && /Critical points/.test(String(note?.args.text)) && rr.state.board.pages[rr.state.board.current].title === 'Recap' && !!rr.state.partsSeen?.recap, rr.toolCalls.map((c) => [c.name, c.outcome]));
    const stN = newV2State(1_000_000); applyToModelBoard(stN.board, 'pg', 'new_page', { title: 'Opening' });
    const rn = await runV2Turn({ session: { ...session, plan: planR }, state: stN, studentSaid: "I'll just stop here", callModel: bye().call });
    check('no recap page when the idea was never taught', rn.state.closed && !rn.toolCalls.some((c) => c.name === 'new_page'), rn.toolCalls.map((c) => c.name));
    const stH = newV2State(1_000_000); applyToModelBoard(stH.board, 'pg', 'new_page', { title: 'Recap' }); stH.goals = { 'concept-first-deriv': { status: 'shown', at: 1 } } as never;
    const rh = await runV2Turn({ session: { ...session, plan: planR }, state: stH, studentSaid: 'bye', callModel: bye().call });
    check('no second recap page when one is already up', rh.state.closed && !rh.toolCalls.some((c) => c.name === 'new_page'), rh.toolCalls.map((c) => c.name));
    // portal-a9b9b4d4 (Digital SAT): the tutor's own recap went under the practice working, and the plan's recap followed on a new page.
    const ownRecap = 'Here is the recap. <board note style="highlight">\nRecap\nFlip the sign when dividing by a negative\nTest a point by substituting\nA system needs every inequality\n</board>';
    const sayBye = (text: string, id: string): V2ModelCall => async (_params, onText) => { onText?.(text); return msg([{ type: 'text', text }, { type: 'tool_use', id, name: 'end_lesson', input: { because: 'student_asked', summary: 's' } }], 'tool_use'); };
    const stO = newV2State(1_000_000); applyToModelBoard(stO.board, 'pg', 'new_page', { title: 'Timed practice' }); applyToModelBoard(stO.board, 'w1', 'show_equation', { latex: '1 > 0' }); stO.goals = { 'concept-first-deriv': { status: 'shown', at: 1 } } as never;
    const ro = await runV2Turn({ session: { ...session, plan: planR }, state: stO, studentSaid: 'let us recap', callModel: sayBye(ownRecap, 'e10') });
    const pagesO = ro.toolCalls.filter((c) => c.name === 'new_page' && !/^not /.test(c.outcome));
    check('the tutor\'s own recap note opens a recap page, is written there without its heading, and the lesson closes on that one recap', ro.state.closed && pagesO.length === 1 && pagesO[0].args.title === 'Recap' && ro.toolCalls.findIndex((c) => c.name === 'new_page') < ro.toolCalls.findIndex((c) => c.name === 'annotate') && ro.toolCalls.filter((c) => c.name === 'annotate').length === 1 && ro.state.board.pages.length === 2 && ro.state.board.pages[1].items.length === 1 && !/^Recap/.test(ro.state.board.pages[1].items[0].summary) && /Flip the sign/.test(ro.state.board.pages[1].items[0].summary) && ro.state.board.pages[0].items.length === 1, ro.toolCalls.map((c) => [c.name, c.outcome, c.args.title ?? String(c.args.text ?? '').slice(0, 30)]));
    const stP = newV2State(1_000_000); applyToModelBoard(stP.board, 'pg', 'new_page', { title: 'Timed practice' }); applyToModelBoard(stP.board, 'w1', 'show_equation', { latex: '1 > 0' }); stP.goals = { 'concept-first-deriv': { status: 'shown', at: 1 } } as never;
    const plainSummary = stub([msg([{ type: 'text', text: 'To finish. <board note>Flip the sign when dividing by a negative\nTest a point by substituting\nA system needs every inequality</board>' }, { type: 'tool_use', id: 'e11', name: 'end_lesson', input: { because: 'student_asked', summary: 's' } }], 'tool_use')]);
    const rp = await runV2Turn({ session: { ...session, plan: planR }, state: stP, studentSaid: 'bye', callModel: sayBye('To finish. <board note>Flip the sign when dividing by a negative\nTest a point by substituting\nA system needs every inequality</board>', 'e11') });
    check('a closing reply that wrote its own summary gets no second recap from the plan', rp.state.closed && !rp.toolCalls.some((c) => c.name === 'new_page') && rp.toolCalls.filter((c) => c.name === 'annotate').length === 1, rp.toolCalls.map((c) => [c.name, c.outcome]));
  }
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
  {
    const done = { ...r1.state, history: [...r1.state.history, { role: 'user' as const, content: 'I kind of agree.' }, { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'Agreeing is a fine place to start. Here is a first case. Kelly finishes her story.' }, { type: 'tool_use' as const, id: 'sp1', name: 'show_passage', input: {} }] }, { role: 'user' as const, content: [{ type: 'tool_result' as const, tool_use_id: 'sp1', content: 'painted' }] }] };
    const cut = trimToSpoken(done, ['Agreeing is a fine place to start.', 'Here is a first case.', 'Kelly finishes her story.'], 1);
    const last = cut.history[cut.history.length - 2].content as { type: string; text?: string }[];
    check('a finished reply talked over keeps only the sentences heard, and its tool calls', last[0].text === `Agreeing is a fine place to start. ${V2_CUT_MARK}` && last[1].type === 'tool_use' && trimToSpoken(done, ['a.', 'b.'], 2) === done && (done.history[done.history.length - 2].content as { text?: string }[])[0].text!.includes('Kelly'), JSON.stringify(last));
  }
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
  const plan9 = { segments: [{ id: 'hook', kind: 'hook' }, { id: 'c1', kind: 'concept' }, { id: 't1', kind: 'try_yourself' }, { id: 'recap', kind: 'recap' }] } as never;
  const pr = (goals: Record<string, { status: 'shown' | 'demonstrated' | 'skipped' }>) => v2Progress(plan9, goals as never);
  check('progress for a partner\'s portal is read off the goals: a practice problem only put up is still in hand', JSON.stringify(pr({})) === JSON.stringify({ currentSegmentId: 'hook', completedSegmentIds: [], milestone: null })
    && JSON.stringify(pr({ hook: { status: 'shown' }, c1: { status: 'shown' }, t1: { status: 'shown' } })) === JSON.stringify({ currentSegmentId: 't1', completedSegmentIds: ['hook', 'c1'], milestone: 'first_concept_complete' })
    && pr({ hook: { status: 'shown' }, c1: { status: 'shown' }, t1: { status: 'demonstrated' } }).milestone === 'first_try_yourself_success' && pr({ hook: { status: 'shown' }, c1: { status: 'shown' }, t1: { status: 'demonstrated' } }).currentSegmentId === 'recap'
    && pr({ c1: { status: 'skipped' }, recap: { status: 'shown' } }).milestone === 'recap_reached', pr({ hook: { status: 'shown' }, c1: { status: 'shown' }, t1: { status: 'shown' } }));
  const bg = v2Background({ progressDigest: { unitsCompleted: 3, unitsTotal: 10, percentComplete: 30, weeksElapsed: 2 } as never, goalNote: ' Pass the AP exam ', socialMemory: [{ note: 'plays cricket on Saturdays' } as never], practiceLocator: 'Unit 2 · Practice' });
  check('what the portal knows about the student reaches the tutor as plain facts', bg.length === 4 && /3 of 10 units/.test(bg[0]) && /Pass the AP exam/.test(bg[1]) && /cricket/.test(bg[2]) && /Unit 2/.test(bg[3]) && /What is known about this student[\s\S]*cricket/.test(v2SessionPart({ subject: 'math', level: '9', mode: 'voice', background: bg })) && v2Background({}).length === 0, bg);
  const back = v2StateFromCheckpoint({ transcript: [{ role: 'tutor', text: 'Hi, welcome.' }, { role: 'user', text: 'hello' }, { role: 'tutor', text: 'A square is a male.' }, { role: 'tutor', text: 'What is a circle?' }, { role: 'user', text: 'a fem' }], completedSegmentIds: ['hook'] }, 5, '[The session has just started.]');
  check('a session rebuilt from a checkpoint has a history the model accepts, and knows what is done', back.history.length === 4 && back.history[0].role === 'user' && back.history[3].role === 'assistant' && /square[\s\S]*circle/.test(String(back.history[3].content)) && back.goals.hook.status === 'demonstrated' && /reloaded/.test(back.note), back.history);
  const rs = stub([msg([{ type: 'text', text: 'Welcome back.' }], 'end_turn')]);
  await runV2Turn({ session, state: back, studentSaid: null, facts: { nowMs: 10, resumed: true }, callModel: rs.call, boardPass: false });
  check('the first turn after a reload tells the tutor the student has come back', /page was reloaded/.test(JSON.stringify(rs.seen[0].messages.slice(-1))), '');
  check('v2 leaves to v1 the sessions it has not taken over', v2CanRunSession({ sessionGoal: 'concept-review', tutorLanguages: ['en'] }) && v2CanRunSession({}) && !v2CanRunSession({ sessionGoal: 'homework-help' }) && v2CanRunSession({ sessionGoal: 'homework-help', homeworkOnV2: true }) && !v2CanRunSession({ sessionGoal: 'mock-review', homeworkOnV2: true }) && !v2CanRunSession({ sessionGoal: 'mock-review' }) && !v2CanRunSession({ targetKind: 'diagnostic' }) && v2CanRunSession({ tutorLanguages: ['en', 'ja'] }) && !v2CanRunSession({ tutorLanguages: ['ja'] }) && !v2CanRunSession({ standby: true }));
  const mem = v2MemoryLines({ recentSessions: [{ sessionId: 's1', endedAt: '2026-11-10T10:00:00Z', topic: 'biology', summary: 'Learned XX and XY.', losTouched: [] }, { sessionId: 'now', endedAt: '2026-11-12T10:00:00Z', summary: 'this one', losTouched: [] }], gaps: [{ id: 'g', status: 'candidate', conceptLabel: 'carrier meaning', evidence: { observation: 'Explained, not yet done.' }, firstSeenAt: '2026-11-10', lastSeenAt: '2026-11-10' }, { id: 'h', status: 'resolved', conceptLabel: 'old', firstSeenAt: '2026-11-01', lastSeenAt: '2026-11-01' }], nextSessionIntent: { text: 'Start with carriers.', sessionId: 's1', at: '2026-11-10' }, preferences: {} } as never, 'now');
  check('the engine\'s memory of a student reaches v2 as plain lines, without the session in progress', mem.length === 3 && /2026-11-10[\s\S]*XX and XY/.test(mem[0]) && /Start with carriers/.test(mem[1]) && /carrier meaning/.test(mem[2]) && v2MemoryLines(null).length === 0, mem);
  const commit = v2ProfileCommit({ sessionId: 'now', subject: 'science', level: '10', plan: { title: 'Pedigrees', los: [{ id: 'lo.a', description: 'x' }], segments: [{ id: 'hook', kind: 'hook' }, { id: 'c1', kind: 'concept' }] } as never, state: { ...newV2State(1), goals: { hook: { status: 'shown' }, c1: { status: 'shown' } }, gaps: [{ what: 'carrier meaning', status: 'explained' }, { what: 'squares', status: 'done_alone' }], closeSummary: 'Did XX and XY.' } as never, transcript: [{ role: 'tutor', text: 'Hi' }, { role: 'user', text: 'hello' }, { role: 'tutor', text: '' }] });
  check('a v2 session commits its transcript, its open gaps and the plan for next time', (commit.transcript as unknown[]).length === 2 && JSON.stringify(commit.gaps) === JSON.stringify([{ kind: 'prerequisite', conceptLabel: 'carrier meaning', observation: 'Explained to them; they have not yet done one themselves.' }]) && commit.nextSessionIntent === 'Did XX and XY.' && JSON.stringify(commit.losTouched) === '["lo.a"]' && commit.topic === 'Pedigrees', commit);
  const planM = { los: [{ id: 'lo.a', description: 'a' }, { id: 'lo.b', description: 'b' }, { id: 'lo.c', description: 'c' }, { id: 'lo.d', description: 'd' }], segments: [{ id: 'lo.a-concept', kind: 'concept' }, { id: 'lo.a-try', kind: 'try_yourself' }, { id: 'lo.b-try', kind: 'try_yourself' }, { id: 'lo.b-try2', kind: 'try_yourself' }, { id: 'lo.c-try', kind: 'try_yourself' }, { id: 'lo.d-concept', kind: 'concept' }, { id: 'lo.d-try', kind: 'try_yourself' }] } as never;
  const goalsM = { 'lo.a-concept': { status: 'shown' }, 'lo.a-try': { status: 'demonstrated' }, 'lo.b-try': { status: 'demonstrated' }, 'lo.b-try2': { status: 'shown' }, 'lo.c-try': { status: 'shown' }, 'lo.d-concept': { status: 'shown' } } as never;
  const mm = v2Mastery(planM, goalsM, ['lo.b', 'lo.c', 'lo.d', 'not.in.plan']);
  check('mastery moves on what the student did with a practice problem: up alone, up by half when still named, down when set one and not got, nothing when never set one', JSON.stringify(mm.masteryDeltas) === JSON.stringify([{ loId: 'lo.a', delta: V2_MASTERY_UP }, { loId: 'lo.b', delta: V2_MASTERY_UP_MIXED }, { loId: 'lo.c', delta: V2_MASTERY_DOWN }]) && mm.segmentOutcomes.length === 2 && mm.segmentOutcomes[0].outcome === 1 && mm.segmentOutcomes[1].loId === 'lo.b' && mm.segmentOutcomes[1].outcome === 0.5, mm);
  const single = v2Mastery({ los: [{ id: 'only', description: 'x' }], segments: [{ id: 'try-1', kind: 'try_yourself' }, { id: 'c', kind: 'concept' }] } as never, { 'try-1': { status: 'demonstrated' }, c: { status: 'demonstrated' } } as never);
  check('a plan with one objective credits it; a lesson only taught, or ended before any practice, moves no mastery', JSON.stringify(single.masteryDeltas) === JSON.stringify([{ loId: 'only', delta: V2_MASTERY_UP }]) && single.segmentOutcomes.length === 1 && v2Mastery(planM, { 'lo.a-concept': { status: 'shown' } } as never, ['lo.a']).masteryDeltas.length === 0 && v2Mastery(null, {}).masteryDeltas.length === 0, single);
  const back3 = { pages: [{ title: 'Rule', items: [] }, { title: 'Cosine limit', items: [{ id: 'a', tool: 'show_equation', summary: 'cos pi = -1' }] }, { title: 'x ln x', items: [{ id: 'b', tool: 'show_problem', summary: 'lim x ln x' }] }], current: 2 };
  const went = applyToModelBoard(back3 as never, 'g1', 'go_to_page', { pageIndex: 1 });
  check('turned back to an earlier page, the tutor is told where the work in progress is', went.painted && /^now on page 2 "Cosine limit"\. The work in progress stays on page 3 "x ln x"/.test(went.detail) && /page 2 "Cosine limit" \(in view: turned back to for a look\)/.test(renderBoard(back3 as never)) && /page 3 "x ln x" \(the work in progress[^)]*\): problem "lim x ln x"/.test(renderBoard(back3 as never)) && !/work in progress/.test(applyToModelBoard(back3 as never, 'g2', 'go_to_page', { pageIndex: 2 }).detail) && !/work in progress|turned back/.test(renderBoard(back3 as never)), [went.detail, renderBoard(back3 as never)]);
  check('the marketing demo, Crimsora, evelyntutor and GreenApple run on v2', ['evelyn-marketing', 'crimsora', 'evelyntutor', 'greenapple'].every((id) => resolvePartnerSessionOptions({ partnerId: id }).brainVersion === 'v2'));
  check('every partner is on v1 until cut over', ['gdi-demo', 'gameclass', 'kanzoo', 'academy', 'unknown-partner', ''].every((id) => resolvePartnerSessionOptions({ partnerId: id }).brainVersion === 'v1'));
  check('a deploy can name each partner\'s engine, and ignores what it cannot read', JSON.stringify(brainVersionOverrides(' evelyn-marketing=v2, crimsora=v1 ,gdi-demo=v9,=v2,junk')) === JSON.stringify({ 'evelyn-marketing': 'v2', crimsora: 'v1' }) && Object.keys(brainVersionOverrides(undefined)).length === 0);
  const demoSys = v2SessionPart({ subject: 'physics', level: 'High school', mode: 'voice', trial: true, teacher: { name: 'Ms. Elena Vasquez', style: 'Gentle and patient.' } });
  check('a trial session names its teacher and leaves the topic to the student; an ordinary one says neither', /You are Ms\. Elena Vasquez/.test(demoSys) && /free trial lesson/.test(demoSys) && !/free trial|You are /.test(v2SessionPart({ subject: 'physics', level: '12', mode: 'voice' })));
  check('subject and level labels in a partner\'s own words are read for what they mean', isMathsSubject('Precalculus') && isMathsSubject('math') && !isMathsSubject('Physics') && isScienceSubject('Physics') && !isScienceSubject('History') && gradeOfLevel('Grade 3') === 3 && gradeOfLevel('Middle school') === 7 && gradeOfLevel('9-10') === 9 && gradeOfLevel('ap') === undefined && gradeOfLevel('k') === 0);

  // 2026-11-13: the optics and rational-expressions sessions.
  const s13: V2Session = { subject: 'physics', level: '12', mode: 'voice', timeBoxMinutes: 30 };
  const strm = (text: string) => ({ call: (async (_p, onText) => { for (let i = 0; i < text.length; i += 7) onText?.(text.slice(i, i + 7)); return msg([{ type: 'text', text }], 'end_turn'); }) as V2ModelCall });
  const recap = '<board note style="highlight">Clear denominators, solve, then check every answer against the excluded values.\nFactors cancel, terms do not.\nExcluded values come from the original denominator.\nExtraneous answers are rejected, and the equation can have no solution.</board>';
  const r13 = strm(`Yes, x = 3 is the excluded value. ${recap} <board note style="warning">x = 3 is an excluded value, so it is extraneous.\nThe equation has no solution.</board> What next?`);
  const t13 = await runV2Turn({ session: s13, state: newV2State(0), studentSaid: 'x is 3', facts: { nowMs: 60000 }, callModel: r13.call, boardPass: false });
  check('a short note whose words are all in a longer one of the same reply does not take its place', t13.toolCalls.filter((c) => c.name === 'annotate').length === 2 && !t13.toolCalls.some((c) => c.replaces) && t13.state.board.pages[0].items.length === 2, JSON.stringify(t13.toolCalls.map((c) => [c.name, c.replaces, c.outcome])));
  const r14 = strm('Put it in. <board equation label="x = 5 in the original">\\frac{5+2}{(5-5)(5+2)} = \\frac{7}{0}</board> Does that make sense? <board equation label="x = 5 in the original">\\frac{5+2}{(5-5)(5+2)} = \\frac{?}{?}</board>');
  const t14 = await runV2Turn({ session: s13, state: newV2State(0), studentSaid: 'what if x is 5', facts: { nowMs: 60000 }, callModel: r14.call, boardPass: false });
  check('an equation written again under the same label in one reply takes the first one\'s place, and its label is typeset', t14.toolCalls.filter((c) => c.name === 'show_equation').length === 2 && !!t14.toolCalls[1].replaces && t14.state.board.pages[0].items.length === 1 && t14.toolCalls[0].args.label === '$x = 5$ in the original', JSON.stringify(t14.toolCalls.map((c) => [c.args.label, c.replaces, c.outcome])));
  const pencil = (last: string) => `<board graph x="-5..5" y="-5..5">(-5, 0) to (5, 0) | water surface\n(-1, -3) to (0, 0) | light from the tip\n${last}</board>`;
  const r15 = strm(`Here is the picture. ${pencil('(2, 3) to (-2, -3) | the line back')} Can you see it? ${pencil('(2, 3) to (-3, -4.5) | where does it appear?')}`);
  const t15 = await runV2Turn({ session: s13, state: newV2State(0), studentSaid: 'draw it', facts: { nowMs: 60000 }, callModel: r15.call, boardPass: false });
  const segs15 = (t15.toolCalls.filter((c) => c.name === 'show_function_graph').pop()?.args.segments ?? []) as unknown[];
  check('a figure of segments drawn again in one reply is the new drawing, not both on top of each other', segs15.length === 3, String(segs15.length));
  const hole = inlineToolCall(boardBlocksIn('<board graph x="-6..8" y="-5..5">1/(x-5) | simplified\n(-2, -0.14) | hole at x = −2\n(1, 2) open | left out\n(3, -0.5) | a point on it</board>')[0]).args.points as Array<{ open?: boolean }>;
  check('a hole or an excluded point on a graph is drawn hollow', hole.length === 3 && hole[0].open === true && hole[1].open === true && hole[2].open === undefined, JSON.stringify(hole));
  const ended = stub([msg([{ type: 'text', text: 'Good work today.' }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'plan_complete', summary: 'done' } }], 'tool_use'), msg([{ type: 'text', text: 'What would you like next?' }], 'end_turn')]);
  const tEnd = await runV2Turn({ session: { ...s13, timeBoxMinutes: 30 }, state: newV2State(0), studentSaid: 'x is 3', facts: { nowMs: 22 * 60000 }, nowMs: 22 * 60000, callModel: ended.call, boardPass: false });
  const refusal = tEnd.toolCalls.find((c) => c.name === 'end_lesson')?.outcome ?? '';
  check('a close refused with time left is not worded as something to repeat to the student', /^not ended/.test(refusal) && !/minutes remain|has not asked/.test(refusal) && !tEnd.state.closed, refusal);
  // Task 8h (ruling 1): a maths lesson is no part-flow lesson: its time line is main's ("tell the student so now…", 18bf8177),
  // whatever CLOSE_BY_CONTENT says. The assertion is main's again.
  check('the facts say how much time is left and that the close is not due', /about 8 left, which is time for more/.test(renderFacts(s13, newV2State(0), { nowMs: 22 * 60000 })) && /tell the student/.test(renderFacts(s13, newV2State(0), { nowMs: 28.5 * 60000 })), renderFacts(s13, newV2State(0), { nowMs: 22 * 60000 }).split('\n')[1]);
  const planP = { segments: [{ id: 'hook', kind: 'hook' }, { id: 'c', kind: 'concept' }, { id: 't1', kind: 'try_yourself' }, { id: 't2', kind: 'try_yourself' }, { id: 'mis', kind: 'misconception_check' }, { id: 'recap', kind: 'recap' }] } as never;
  const goalsP = { hook: { status: 'shown', at: 1 }, c: { status: 'shown', at: 2 }, t1: { status: 'shown', at: 3 }, t2: { status: 'demonstrated', at: 4 }, mis: { status: 'shown', at: 9 } } as never;
  {
    // A part the lesson was on and has left is behind the student (portal-a4f66d55).
    const leftTry = v2Progress(planP, { hook: { status: 'shown', at: 1 }, c: { status: 'shown', at: 2 }, t1: { status: 'shown', at: 3 } } as never, { t1: 3, c: 9 });
    check('a practice problem the lesson has left shows as done, and the part the board is on is the one in hand', leftTry.currentSegmentId === 'c' && leftTry.completedSegmentIds.includes('t1'), leftTry);
    const onTry = v2Progress(planP, { hook: { status: 'shown', at: 1 }, t1: { status: 'shown', at: 3 } } as never, { t1: 3 });
    check('while it is the part in hand it is not done', onTry.currentSegmentId === 't1' && !onTry.completedSegmentIds.includes('t1'), onTry);
    check('a closing question answered as it ended was heard', answeredAsItEnded('Yeah.', ['Good.', 'Shall we go on, or do you have a question first?'], 2) && answeredAsItEnded("Yeah, let's go.", ['Shall we go on?'], 1));
    check('but not a longer reply, an earlier sentence, or a statement', !answeredAsItEnded('wait what did you say about the wheat side of it', ['Shall we go on?'], 1) && !answeredAsItEnded('Yeah.', ['What is your first step?', 'Take your time.', 'Shall we go on?'], 1) && !answeredAsItEnded('Yeah.', ['The curve bows out.'], 1));
  }
  check('the part in hand is the one the tutor last marked, not one left open earlier', v2Progress(planP, goalsP).currentSegmentId === 'mis' && v2Progress(planP, { ...(goalsP as object), mis: { status: 'demonstrated', at: 9 } } as never).currentSegmentId === 'recap' && v2Progress(planP, { hook: { status: 'shown' } } as never).currentSegmentId === 'c', v2Progress(planP, goalsP).currentSegmentId);
  // portal-1115afec (AP US Government, federalism): the plan runs practice problem, then common-mistake check; the
  // tutor took the check first. The chips showed Recap in hand through the whole practice problem.
  const planF = { segments: [{ id: 'hook', kind: 'hook' }, { id: 'c', kind: 'concept' }, { id: 'w', kind: 'worked_example' }, { id: 'try', kind: 'try_yourself' }, { id: 'mis', kind: 'misconception_check' }, { id: 'recap', kind: 'recap' }] } as never;
  const goalsF = { hook: { status: 'shown', at: 1 }, c: { status: 'shown', at: 2 }, w: { status: 'shown', at: 3 }, mis: { status: 'demonstrated', at: 4 } };
  check('a part taken out of order does not carry the lesson past one never started', v2Progress(planF, goalsF as never).currentSegmentId === 'try'
    && v2Progress(planF, { ...goalsF, try: { status: 'skipped', at: 5 } } as never).currentSegmentId === 'recap'
    && v2Progress(planF, { ...goalsF, try: { status: 'shown', at: 5 }, recap: { status: 'shown', at: 6 } } as never).currentSegmentId === 'recap', v2Progress(planF, goalsF as never).currentSegmentId);
  const money = 'Working: categorical $581B ÷ total $692B ≈ 84%, so most grant money comes with federal conditions attached.';
  const shownMoney = (t: string) => segment(autoWrapLatex(autoWrapUnicodeMath(typesetPowers(typesetMaths(t))))).filter((x) => x.kind === 'math').map((x) => x.body);
  check('amounts of money on a card are not mathematics', typesetPowers(typesetMaths(money)) === money && shownMoney(money).length === 0
    && typesetMaths('Maya has $50 and a $15 ticket, from $5 to $10.') === 'Maya has $50 and a $15 ticket, from $5 to $10.'
    && typesetMaths('It costs $5, and $x$ more gives y = 2x.') === 'It costs $5, and $x$ more gives $y = 2x$.'
    && typesetMaths('Here $3 + 4 = 7$ and $2M$ stay.') === 'Here $3 + 4 = 7$ and $2M$ stay.', `${typesetPowers(typesetMaths(money))} | ${JSON.stringify(shownMoney(money))}`);
  check('words over the closing words call the close off; thanks and a goodbye do not', reopensClose('Wait, I have a question about Lopez.') && reopensClose('can we do one more') && reopensClose('no')
    && !reopensClose('Okay, thank you so much. Bye!') && !reopensClose('Thanks, see you next time.') && !reopensClose('yeah') && !reopensClose(' ... ') && !reopensClose('Thank you, Mr. Cole.') && reopensClose('Okay, wait.') && reopensClose('Thanks. One more?'), String(reopensClose('Thank you, Mr. Cole.')));
  const early = stub([msg([{ type: 'text', text: 'Good work today.' }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'time_nearly_used', summary: 'done' } }], 'tool_use'), msg([{ type: 'text', text: 'What would you like next?' }], 'end_turn')]);
  const tEarly = await runV2Turn({ session: { ...s13, timeBoxMinutes: 30 }, state: newV2State(0), studentSaid: 'regulate commerce', facts: { nowMs: 24.4 * 60000 }, nowMs: 24.4 * 60000, callModel: early.call, boardPass: false });
  const late = stub([msg([{ type: 'text', text: 'Good work today.' }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'time_nearly_used', summary: 'done' } }], 'tool_use')]);
  const tLate = await runV2Turn({ session: { ...s13, timeBoxMinutes: 30 }, state: newV2State(0), studentSaid: 'regulate commerce', facts: { nowMs: 28.5 * 60000 }, nowMs: 28.5 * 60000, callModel: late.call, boardPass: false });
  check('a lesson is not closed by the tutor with more than five minutes of thirty left', !tEarly.state.closed && tLate.state.closed === true && /about 6 left, which is time for more/.test(renderFacts(s13, newV2State(0), { nowMs: 24.4 * 60000 })), renderFacts(s13, newV2State(0), { nowMs: 24.4 * 60000 }).split('\n')[1]);
  check('brackets in spoken mathematics are heard as pauses and a product is said', speakGroups('the factors are (x minus 5)(x + 2), since') === 'the factors are x minus 5, times, x + 2, since' && speakGroups('1 + 2(x minus 4) equals 9') === '1 + 2 times, x minus 4, equals 9' && speakGroups('the point (3 comma 4) and (as we said) f of x') === 'the point (3 comma 4) and (as we said) f of x', speakGroups('1 + 2(x minus 4) equals 9'));
  const fig = (kind: string, params: object) => inlineToolCall(boardBlocksIn(`<board figure kind="${kind}">${JSON.stringify(params)}</board>`)[0]);
  const refr = fig('refraction', { n1: 1, n2: 1.33, angle: 30, media: ['air', 'water'] });
  const drawn = drawFigure((refr.args as { kind: string }).kind, (refr.args as { params: object }).params);
  check('a ray bending at a surface is a figure of its own, with the angle the physics gives', refr.name === 'show_drawn_figure' && 'svg' in drawn && /θ₂ = 22\.1°/.test(drawn.svg) && 'refused' in drawFigure('refraction', { n1: 1, n2: 1.33 }) && 'svg' in drawFigure('refraction', { n1: 1.5, n2: 1, angle: 60 }) && /all of it is reflected/.test((drawFigure('refraction', { n1: 1.5, n2: 1, angle: 60 }) as { svg: string }).svg) && 'svg' in drawFigure('apparent_depth', {}), JSON.stringify(refr).slice(0, 200));
  const optics = figureCatalogueFor({ subject: 'physics', topic: 'Optics: refraction, lenses, mirrors', level: '12' });
  check('an optics lesson is offered the full ray diagram, refraction and apparent depth, and not the lens figure without rays', /lens_rays:/.test(optics) && /refraction:/.test(optics) && /apparent_depth:/.test(optics) && !/ray_diagram_lens:/.test(optics) && fig('lens_rays', { type: 'converging', focalLength: 5, objectDistance: 5 }).name === 'show_ray_diagram' && fig('lens_rays', { type: 'converging', focalLength: 20, objectDistance: 60, objectHeight: 2, find: 'image' }).args.hideImage === true && (fig('lens_rays', { type: 'converging', focalLength: 20, objectDistance: 60, objectHeight: 2 }).args.objectHeight as number) > 8 && fig('lens_rays', { type: 'converging', focalLength: 20, objectDistance: 60 }).args.hideImage === undefined, JSON.stringify(fig('lens_rays', { type: 'converging', focalLength: 20, objectDistance: 60, find: 'image' }).args));
  check('a test-prep mathematics lesson reads the mathematics figures, and a grade band is read at its top', /unit_circle:/.test(figureCatalogueFor({ subject: 'test-prep', topic: 'SAT Math: trigonometry', level: 'SAT' })) && /punnett_square:/.test(figureCatalogueFor({ subject: 'science', topic: 'grade-7-life-science Punnett Squares', level: '6-8' })), '');
  check('the standing prompt covers a student who says they have it, calculator arithmetic and a question of their own', /says they have it/.test(V2_CONSTITUTION) && /Arithmetic that needs a calculator/.test(V2_CONSTITUTION) && /answered for its own sake first/.test(V2_CONSTITUTION), '');

  // 2026-11-13: figures connected from the practice-question engine, and the graph's asymptotes and pieces.
  const kinds13: Array<[string, object]> = [
    ['geometry_figure', { shape: 'triangle', sides: [3, 4, 5], sideLabels: ['3', '4', '?'] }],
    ['geometry_figure', { shape: 'circle', radius: 5, points: [{ name: 'A', at: 200 }, { name: 'B', at: 340 }], radii: [{ to: 'A' }, { to: 'B' }], angles: [{ vertex: 'center', from: 'A', to: 'B', label: '140°' }] }],
    ['geometry_figure', { shape: 'parallel_lines', angle: 65, labels: { 1: '115°', 6: 'x' } }],
    ['probability_tree', { branches: [{ label: 'H', p: '1/2' }, { label: 'T', p: '1/2' }] }],
    ['cladogram', { tree: { children: ['Lamprey', { traits: ['jaws'], children: ['Shark', 'Frog'] }] } }],
    ['cell', { variant: 'cell', cellType: 'plant', organelles: [{ type: 'nucleus', label: 'nucleus' }, { type: 'chloroplast', label: '?' }] }],
    ['energy_levels', { variant: 'levels', hydrogen: { nMax: 4 }, transitions: [{ from: 3, to: 2, label: 'A' }] }],
    ['spectrum', { variant: 'lines', rows: [{ label: 'Hydrogen', lines: [410, 434, 486, 656] }] }],
    ['photoelectric', { variant: 'tube', wavelength: 400, workFunction: 2.28 }],
    ['heating_curve', { corners: [[0, -20], [4, 0], [37, 0], [79, 100]] }],
    ['mechanics_setup', { variant: 'pulley', arrangement: 'atwood', m1: 2, m2: 3 }],
    ['particles', { states: ['solid', 'gas'] }], ['buoyancy', { objectDensity: 600 }], ['pipe_flow', { area1: 12, area2: 3, speed1: 2 }],
  ];
  const drew13 = kinds13.map(([k, p]) => [k, drawFigure(k, p)] as const);
  check('every connected figure draws from its parameters', drew13.every(([, d]) => 'svg' in d && d.svg.startsWith('<svg')), drew13.filter(([, d]) => 'refused' in d).map(([k, d]) => `${k}: ${(d as { refused: string }).refused}`).join(' | '));
  const bad13 = drawFigure('energy_levels', { variant: 'levels', hydrogen: { nMax: 4 }, transitions: [{ from: 3, to: 2, label: 'blue-green' }] });
  check('a figure that cannot be drawn as written is refused in words that name the parameter', 'refused' in bad13 && /transitions\[0\]\.label/.test(bad13.refused) && 'refused' in drawFigure('buoyancy', {}) && 'refused' in drawFigure('nothing', {}), JSON.stringify(bad13).slice(0, 160));
  const rBad = strm('Here it is. <board figure kind="energy_levels">{"variant":"levels","hydrogen":{"nMax":4},"transitions":[{"from":3,"to":2,"label":"blue-green"}]}</board> See the drop?');
  const tBad = await runV2Turn({ session: s13, state: newV2State(0), studentSaid: 'show me', facts: { nowMs: 60000 }, callModel: rBad.call, boardPass: false });
  check('a refused figure is not painted and the tutor is told why next turn', !tBad.toolCalls.some((c) => c.name === 'show_drawn_figure' && !/^not /.test(c.outcome)) && /label is longer/.test((tBad.state.boardProblems ?? []).join(' ')), JSON.stringify(tBad.state.boardProblems));
  const cat = (subject: string, topic: string, level = '10') => figureCatalogueFor({ subject, topic, level });
  check('each subject is offered its new figures', /geometry_figure:/.test(cat('math', 'Triangles')) && /probability_tree:/.test(cat('math', 'Probability')) && /cladogram:/.test(cat('science', 'biology: evolution')) && /\n  cell:/.test(cat('science', 'biology: cells')) && /energy_levels:/.test(cat('science', 'physics: atomic models')) && /particles:/.test(cat('science', 'chemistry: states of matter')) && /buoyancy:/.test(cat('science', 'physics: fluids')) && !/cladogram:/.test(cat('math', 'Triangles')), '');
  const g13 = inlineToolCall(boardBlocksIn('<board graph x="-6..10" y="-5..5">1/(x-5) | f\nx = 5 | vertical asymptote | dashed\nx^2 | first piece | from -3 to 0\n2x+1 | second piece | x > 0</board>')[0]).args.functions as Array<{ lineStyle?: string; domain?: number[] }>;
  check('a graph draws an asymptote dashed and a piece over its own stretch of x', g13.length === 4 && !g13[0].lineStyle && g13[1].lineStyle === 'dashed' && JSON.stringify(g13[2].domain) === '[-3,0]' && JSON.stringify(g13[3].domain) === '[0,10]', JSON.stringify(g13));

  const nlHalf = inlineToolCall(boardBlocksIn('<board numberline title="Probability scale">\n0 | impossible\n1/2 | even chance\n1 | certain\n</board>')[0]).args as { min: number; max: number; step: number; points: Array<{ value: number }> };
  check('a number line reads fractions and keeps a 0-to-1 scale to 0 to 1 (demo check 11-13)', nlHalf.min === 0 && nlHalf.max === 1 && nlHalf.step === 0.5 && nlHalf.points.map((p) => p.value).join() === '0,0.5,1', JSON.stringify(nlHalf));
  const nlInt = inlineToolCall(boardBlocksIn('<board numberline>\n-3 | open\n2\n</board>')[0]).args as { min: number; max: number; step: number };
  check('a number line of whole numbers keeps its room either side', nlInt.min === -7 && nlInt.max === 6 && nlInt.step === 1, JSON.stringify(nlInt));
  // portal-02fd8638 (compound inequalities): "-2 < x ≤ 3" was written as two shaded values and went up as two rays,
  // each to the end of the line, so everything from -6 to 7 was shaded and each ray ended on a filled dot.
  type Iv = { from: number; to: number; fromInclusive: boolean; toInclusive: boolean; fromOpenEnded?: boolean; toOpenEnded?: boolean };
  const nl = (body: string) => (inlineToolCall(boardBlocksIn(`<board numberline>\n${body}\n</board>`)[0]).args as { intervals: Iv[] }).intervals;
  const between = nl('-2 | open | right\n3 | closed | left');
  check('two values shaded towards each other are the stretch between them', between.length === 1 && between[0].from === -2 && between[0].to === 3 && between[0].fromInclusive === false && between[0].toInclusive === true && !between[0].fromOpenEnded && !between[0].toOpenEnded && JSON.stringify(nl('3 | closed | left\n-2 | open | right')) === JSON.stringify(between), JSON.stringify(between));
  const apart = nl('-2 | open | left\n5 | closed | right');
  check('two values shaded away from each other are two rays, each running on past the end of the line', apart.length === 2 && apart[0].to === -2 && apart[0].toInclusive === false && apart[0].fromOpenEnded === true && apart[1].from === 5 && apart[1].fromInclusive === true && apart[1].toOpenEnded === true && nl('4 | open | right').length === 1 && nl('4 | open | right')[0].toOpenEnded === true, JSON.stringify(apart));
  check('the turn after keeping quiet is told not to remark on the wait', /no remark about the wait/.test(renderFacts(s13, newV2State(0), { nowMs: 60000, silenceSeconds: 3 })) && v2StudentBlock(null, { ...newV2State(0), history: [{ role: 'user', content: 'x' }] } as never, 3) === '[The student has said nothing more: they had finished.]' && v2StudentBlock(null, { ...newV2State(0), history: [{ role: 'user', content: 'x' }] } as never, 75) === '[The student has not replied.]');
  // portal-50a1e584 (Algebra 1, relations and functions).
  check('a set of numbers at the end of a line is not program code', !looksLikeCodeLine('Domain = inputs, each once, in order: {−3, −1, 2, 5}') && !isCodeBody('Domain = inputs, each once, in order: {−3, −1, 2, 5}\nRange = outputs, each once, in order: {−6, 0, 4}') && looksLikeCodeLine('int[] a = {1, 2, 3};') && looksLikeCodeLine('if (n <= 0) { return 0; }') && looksLikeCodeLine('}'));
  check('a function at a negative number is typeset like its fellows', typesetMaths('If f(x) = 5 − 2x, what is f(−4)? Give the number.') === 'If $f(x) = 5 - 2x$, what is $f(-4)$? Give the number.' && typesetMaths('Evaluating f(x)') === 'Evaluating $f(x)$', typesetMaths('If f(x) = 5 − 2x, what is f(−4)? Give the number.'));
  check('a request to wait is heard as one', asksToWait("Yeah, I'm here. I I just want you to pause for a second. I'm looking at something else.") && asksToWait('hold on, give me a minute') && asksToWait('wait a sec') && asksToWait('one moment please') && !asksToWait('I waited a second and then divided') && !asksToWait('wait, why is it negative?') && !asksToWait('the answer is 3'));
  const planR = { title: 'Relations and functions', estimatedMinutes: 25, los: [{ id: 'lo1', description: 'Tell a function from a relation.' }], segments: [{ id: 'hook', kind: 'hook' }, { id: 'c', kind: 'concept' }, { id: 'w1', kind: 'worked_example', problem: 'Is the relation {(−3, 4), (−1, 0), (2, 4), (5, −6)} a function? State its domain and range.' }, { id: 't2', kind: 'try_yourself', problem: 'If f(x) = 5 − 2x, what is f(−4)?' }, { id: 't3', kind: 'try_yourself', problem: 'The relation {(−5, 2), (−1, 7), (0, 2), (3, 9), (6, 7)} is a function. How many numbers are in its range? Type your answer as a number.' }, { id: 'mis', kind: 'misconception_check', question: 'Given f(x) = 2x + 1, a student writes f(3) = f · 3 = 3f. Another student decides f(3) means "set 2x + 1 equal to 3 and solve", getting x = 1. What went wrong in each case?' }, { id: 'recap', kind: 'recap' }] } as never;
  check('a problem put on the board is known for the part of the plan it belongs to', goalForProblem(planR, 'Is the relation {(−3, 4), (−1, 0), (2, 4), (5, −6)} a function? If so, state its domain and range.') === 'w1' && goalForProblem(planR, 'If $f(x) = 5 - 2x$, what is f(−4)? Give the number.') === 't2' && goalForProblem(planR, 'The relation {(−5, 2), (−1, 7), (0, 2), (3, 9), (6, 7)} is a function. How many numbers are in its range? Give a number.') === 't3' && goalForProblem(planR, 'Given f(x) = 2x + 1, one student writes f(3) = 3f. Another decides f(3) means solve 2x + 1 = 3. What went wrong in each case?') === 'mis' && goalForProblem(planR, 'Is the relation {(1, 5), (2, 5), (3, 5)} a function? Say yes or no, and why.') === null, String(goalForProblem(planR, 'Given f(x) = 2x + 1, one student writes f(3) = 3f. Another decides f(3) means solve 2x + 1 = 3. What went wrong in each case?')));
  const shownT2 = v2Progress(planR, { t2: { status: 'shown', at: 5 } } as never);
  check('with a practice problem on the board, the parts only told before it are behind the student', shownT2.currentSegmentId === 't2' && shownT2.completedSegmentIds.join() === 'hook,c,w1', JSON.stringify(shownT2));
    const sayR = (text: string): V2ModelCall => async (_params, onText) => { onText?.(text); return msg([{ type: 'text', text }], 'end_turn'); };
  const tGoal = await runV2Turn({ session: { ...s13, plan: planR }, state: newV2State(0), studentSaid: 'ok', nowMs: 60000, callModel: sayR('Try this one.\n\n<board problem>If f(x) = 5 − 2x, what is f(−4)? Give the number.</board>\n\nWhat do you get?'), boardPass: false });
  check('putting a plan problem on the board marks its part as begun, without the tutor recording it', tGoal.state.goals.t2?.status === 'shown' && !tGoal.state.goals.t3, JSON.stringify(tGoal.state.goals));
  // Task 8h (ruling 1): main's assertion again (the close by content and the wrap minute are a part-flow lesson's only).
  check('the close of a lesson is due with two minutes left, and the tutor is told to say so', closeDueMinutes(30) === 2 && closeDueMinutes(60) === 2 && closeDueMinutes(5) === 1 && /about 2 left[^\n]*tell the student/i.test(renderFacts(s13, newV2State(0), { nowMs: 28.2 * 60000 })) && /time for more/.test(renderFacts(s13, newV2State(0), { nowMs: 27 * 60000 })) && v2StudentBlock(null, { ...newV2State(0), history: [{ role: 'user', content: 'x' }] } as never, undefined, undefined, undefined, true) === '[No one has spoken. The session is nearly out of time: see the time below.]', renderFacts(s13, newV2State(0), { nowMs: 28.2 * 60000 }).split('\n')[1]);
  // portal-ddf273bf (AP US Government, separation of powers; first lesson taken on the local stack, five flags).
  const tryText = 'Congress passes a controversial law creating a new federal regulatory agency, over the objection of the President, who believes the law oversteps executive authority. (a) Describe the tool the President could use in response to the bill before it becomes law, and explain what Congress could do next. (b) The agency\'s first director resigns, and the President nominates a replacement. Explain how the Senate\'s power of advice and consent applies to this nomination. (c) A different group later sues, arguing the law creating the agency is unconstitutional. Explain how a federal court could resolve this dispute using judicial review, and note one important fact about where that power does NOT come from.';
  const planS = { title: 'Separation of powers', estimatedMinutes: 25, los: [{ id: 'lo1', description: 'Explain checks and balances.' }], segments: [{ id: 'hook', kind: 'hook' }, { id: 'c', kind: 'concept' }, { id: 'try', kind: 'try_yourself', problem: tryText }, { id: 'mis', kind: 'misconception_check', question: 'True or false: separation of powers and checks and balances are two names for the same principle of the Constitution.' }, { id: 'recap', kind: 'recap' }] } as never;
  const partA = 'Congress passes a controversial law creating a new federal regulatory agency, over the objection of the President, who believes the law oversteps executive authority. (a) Describe the tool the President could use in response to the bill before it becomes law, and explain what Congress could do next.';
  const partC = 'A different group later sues, arguing the law creating the agency is unconstitutional. (c) Explain how a federal court could resolve this dispute using judicial review, and note one important fact about where that power does NOT come from.';
  check('a part of a plan problem is known for the whole it belongs to', wholeProblem(planS, partA)?.goal === 'try' && wholeProblem(planS, partA)?.statement === tryText && wholeProblem(planS, partC)?.goal === 'try' && wholeProblem(planS, tryText)?.statement === tryText && wholeProblem(planR, 'If f(x) = 5 − 2x, what is f(−4)? Give the number.') === null);
  const sessS = { ...s13, plan: planS };
  const t1 = await runV2Turn({ session: sessS, state: newV2State(0), studentSaid: 'ok', nowMs: 60000, callModel: sayR(`Let us test it.\n\n<board page>Practice</board>\n\n<board problem>${partA}</board>\n\nStart with part (a).`), boardPass: false });
  const card1 = t1.toolCalls.find((c) => c.name === 'show_problem');
  check('the first part of a plan problem goes up as the whole problem, all its parts in view', /\(b\)[\s\S]*\(c\)/.test(String(card1?.args.statement ?? '')) && /^painted/.test(card1?.outcome ?? ''), String(card1?.args.statement ?? '').slice(0, 80));
  const t2 = await runV2Turn({ session: sessS, state: t1.state, studentSaid: 'veto', nowMs: 120000, callModel: sayR(`Right. Now part (b).\n\n<board problem>The agency's first director resigns, and the President nominates a replacement. Explain how the Senate's power of advice and consent applies to this nomination.</board>\n\nHow does it apply?`), boardPass: false });
  const card2 = t2.toolCalls.find((c) => c.name === 'show_problem');
  check('a later part of it is not a second card: the board points at the problem already up', /^not painted again/.test(card2?.outcome ?? '') && card2?.pointsAt === card1?.id && card2?.turnsTo === undefined, card2?.outcome);
  const t3 = await runV2Turn({ session: sessS, state: { ...t2.state, goals: { ...t2.state.goals, try: { status: 'shown', at: 1 }, mis: { status: 'demonstrated', at: 2 }, recap: { status: 'shown', at: 3 } } }, studentSaid: 'ok', nowMs: 180000, callModel: sayR('Here is the recap.\n\n<board page>Recap</board>\n\n<board note>Four checks.</board>\n\nGot it?'), boardPass: false });
  const t4 = await runV2Turn({ session: sessS, state: t3.state, studentSaid: 'Can you show me that question again?', nowMs: 240000, callModel: sayR(`Sure. Here is part (c) again.\n\n<board problem>${partC}</board>\n\nTry it.`), boardPass: false });
  const card4 = t4.toolCalls.find((c) => c.name === 'show_problem');
  check('asked for again from another page, the board turns back to the page the problem is on', /^not painted again[\s\S]*turned back/.test(card4?.outcome ?? '') && card4?.pointsAt === card1?.id && card4?.turnsTo === 0 && t4.state.board.current === 0 && t4.state.board.pages[1].items.every((it) => it.tool !== 'show_problem'), `${card4?.outcome} · turnsTo=${card4?.turnsTo}`);
  check('and the practice problem is the part in hand again', v2Progress(planS, t4.state.goals).currentSegmentId === 'try', v2Progress(planS, t4.state.goals).currentSegmentId);
  // portal-e8640e11 (AP Psychology, the brain): after one look at an earlier page, three replies wrote there.
  const t5 = await runV2Turn({ session: sessS, state: structuredClone(t4.state), studentSaid: 'the courts', nowMs: 300000, callModel: sayR('Yes.\n\n<board note>Judicial review settles it.</board>\n\nAnd where does it not come from?'), boardPass: false });
  check('turned to a problem\'s page to carry on with it, later replies keep writing there', t5.state.board.current === 0 && !t5.toolCalls.some((c) => c.name === 'go_to_page') && t5.state.board.pages[0].items.some((it) => /Judicial review settles/.test(it.summary)), JSON.stringify(t5.toolCalls.map((c) => c.name)));
  const l1 = await runV2Turn({ session: sessS, state: structuredClone(t3.state), studentSaid: 'Can we look at the practice page for a second?', nowMs: 240000, callModel: sayR('Sure.\n\n<board page>Practice</board>\n\n<board note>The veto is the tool in part (a).</board>\n\nSee it?'), boardPass: false });
  check('a look back at an earlier page: what that reply writes goes on the page it turned to', l1.state.board.current === 0 && l1.state.board.look === true && l1.state.board.pages[0].items.some((it) => /veto is the tool/.test(it.summary)), JSON.stringify(l1.state.board));
  const l2 = await runV2Turn({ session: sessS, state: structuredClone(l1.state), studentSaid: 'yes', nowMs: 300000, callModel: sayR('Good. Back to the recap.\n\n<board note>Each branch checks the other two.</board>\n\nClear?'), boardPass: false });
  const ret = l2.toolCalls.findIndex((c) => c.name === 'go_to_page'); const wrote = l2.toolCalls.findIndex((c) => c.name === 'annotate');
  check('after the look, the next reply\'s writing goes on the page of the work in progress, and the board turns to it first', ret >= 0 && ret < wrote && l2.toolCalls[ret].args.pageIndex === 1 && l2.state.board.current === 1 && !l2.state.board.look && l2.state.board.pages[1].items.some((it) => /Each branch checks/.test(it.summary)) && !l1.state.board.pages[0].items.some((it) => /Each branch checks/.test(it.summary)), JSON.stringify(l2.toolCalls.map((c) => `${c.name}: ${c.outcome}`)));
  const l3 = await runV2Turn({ session: sessS, state: structuredClone(l1.state), studentSaid: 'and part b?', nowMs: 300000, callModel: sayR('Still on this page.\n\n<board page>Practice</board>\n\n<board note>Advice and consent is the Senate\'s check in part (b).</board>\n\nClear?'), boardPass: false });
  check('the page block of the page in view keeps the writing on it, with no second page of that name', l3.state.board.current === 0 && l3.state.board.pages.length === l1.state.board.pages.length && l3.state.board.pages[0].items.some((it) => /Advice and consent/.test(it.summary)), JSON.stringify(l3.toolCalls.map((c) => `${c.name}: ${c.outcome}`)));
  const l4 = await runV2Turn({ session: sessS, state: structuredClone(l1.state), studentSaid: 'yes', nowMs: 300000, callModel: sayR('Good, shall we go on with the recap?'), boardPass: false });
  check('a reply that writes nothing leaves the board on the page being looked at', l4.state.board.current === 0 && l4.state.board.look === true && !l4.toolCalls.some((c) => c.name === 'go_to_page'));
  // portal-a9b9b4d4 (Digital SAT, linear inequalities).
  const ineq = inlineToolCall(boardBlocksIn('<board graph x="-5..5" y="-5..5">y \\le x + 2\ny > 3x - 4 | second\n(1, 3) | solution</board>')[0]);
  check('an inequality on a graph is a shaded region, not a curve', JSON.stringify(ineq.args.inequalities) === JSON.stringify([{ expr: 'y \\le x + 2' }, { expr: 'y > 3x - 4', label: 'second' }]) && (ineq.args.functions as unknown[]).length === 0 && (ineq.args.points as unknown[]).length === 1 && boardMisfit('show_function_graph', ineq.args) === null, ineq.args);
  const styled = inlineToolCall(boardBlocksIn('<board graph>x + 2\n3x - 4 | dashed</board>')[0]).args.functions as Array<{ label?: string; legend?: string; lineStyle?: string }>;
  check('"dashed" after a line is how it is drawn, not its name, and two unnamed lines get their equations as legend', !styled[1].label && styled[1].lineStyle === 'dashed' && styled[0].legend === '$y = x + 2$' && styled[1].legend === '$y = 3x - 4$' && !(inlineToolCall(boardBlocksIn('<board graph>x^2</board>')[0]).args.functions as Array<{ legend?: string }>)[0].legend, styled);
  const g2 = await runV2Turn({ session: sessS, state: structuredClone(t3.state), studentSaid: 'is (1, 3) in it?', nowMs: 240000, callModel: sayR('Here is the region. <board graph x="-5..5" y="-5..5">y > 2x - 1</board> And the point. <board graph>(1, 3) | solution</board> See it?'), boardPass: false });
  const g2graphs = g2.toolCalls.filter((c) => c.name === 'show_function_graph');
  check('a region is painted, and a point tested against it is drawn on the same graph', g2graphs.length === 2 && g2graphs.every((c) => /^painted/.test(c.outcome)) && g2graphs[1].replaces === g2graphs[0].id && (g2graphs[1].args.inequalities as unknown[]).length === 1 && (g2graphs[1].args.points as unknown[]).length === 1, g2graphs.map((c) => [c.outcome, c.replaces, c.args]));
  check('words typed into an equation are set as words, whatever the words', wordsAsText('-3 < -1, so (0, -3) fails the test') === '-3 < -1, \\text{ so } (0, -3) \\text{ fails the test }' && wordsAsText('ABCD is a square') === 'ABCD \\text{ is a square }' && wordsAsText('v_{initial} = sinx + abc') === 'v_{\\text{initial}} = sinx + abc' && wordsAsText('\\begin{aligned} x &= 2 \\end{aligned}') === '\\begin{aligned} x &= 2 \\end{aligned}' && wordsAsText('NaCl + so a = 5') === 'NaCl + \\text{ so } a = 5', [wordsAsText('-3 < -1, so (0, -3) fails the test'), wordsAsText('NaCl + so a = 5')]);
  check('an American course is written in American English; a British one keeps its own', /American spelling/.test(v2SessionPart({ ...sessS, subject: 'digital-sat', level: 'Grade 11' })) && !/American spelling/.test(v2SessionPart({ ...sessS, subject: 'maths', level: 'Year 9' })) && !/American spelling/.test(v2SessionPart({ ...sessS, subject: 'GCSE chemistry' })));
  // portal-b0efc3c2 (Digital SAT, on crimsora.com).
  const l5 = await runV2Turn({ session: sessS, state: structuredClone(t3.state), studentSaid: 'one more of the first kind', nowMs: 240000, callModel: sayR('Back to the practice page for one more.\n\n<board page>Practice</board>\n\n<board problem>Name the check the courts hold over Congress, and say where it comes from.</board>\n\nTry it.'), boardPass: false });
  const l6 = await runV2Turn({ session: sessS, state: structuredClone(l5.state), studentSaid: 'judicial review, from Marbury', nowMs: 300000, callModel: sayR('Yes.\n\n<board note>Judicial review, from Marbury v. Madison.</board>\n\nGood.'), boardPass: false });
  check('a problem set on a page the tutor turned back to is worked on that page', l5.state.board.current === 0 && !l5.state.board.look && l6.state.board.current === 0 && !l6.toolCalls.some((c) => c.name === 'go_to_page') && l6.state.board.pages[0].items.some((it) => /Marbury/.test(it.summary)), JSON.stringify([l5.state.board.look, l6.toolCalls.map((c) => `${c.name}: ${c.outcome}`)]));
  const far = await runV2Turn({ session: sessS, state: structuredClone(t3.state), studentSaid: 'show me (2, 6)', nowMs: 240000, callModel: sayR('Here. <board graph x="-5..5" y="-5..5">y > 2x - 1\n(2, 6) | the point</board> See it?'), boardPass: false });
  const farG = far.toolCalls.find((c) => c.name === 'show_function_graph');
  check('a graph\'s window grows to take in a point outside it', JSON.stringify(farG?.args.yRange) === '[-5,7]' && JSON.stringify(farG?.args.xRange) === '[-5,5]', [farG?.args.xRange, farG?.args.yRange]);
  // portal-3d431436 (ACT Math, coordinate geometry).
  check('a sentence that carries the card\'s own expression has asked it: the card is not read out after it', unsaidAsk('What is the vertex of the parabola y = x² − 6x + 5? Give it as an ordered pair (x, y).', ['Then plug 3 back in to get the y-value.', 'Try the vertex of y = x² − 6x + 5.']) === null && unsaidAsk('Find the net force on the sled, in newtons.', ['A sled sits on snow.', 'Try it.']) !== null);
  check('an ordered pair of letters is one piece of mathematics', typesetMaths('Give it as an ordered pair (x, y).') === 'Give it as an ordered pair $(x,\\ y)$.' && typesetMaths('from A(1, 2) to B(7, 10)') === 'from A(1, 2) to B(7, 10)', typesetMaths('Give it as an ordered pair (x, y).'));
  {
    const stT = { ...newV2State(0), history: [{ role: 'user', content: 'plus 3' }, { role: 'assistant', content: [{ type: 'text', text: 'Yes, plus 3. So the vertex is (−2, 3).\n\nOne more: what is the vertex of y = x² − 2x − 3?\n\n<board problem difficulty="medium">What is the vertex of the parabola y = x² − 2x − 3?</board>' }] }] } as never;
    const cutT = JSON.stringify(trimToSpoken(stT, ['Yes, plus 3.', 'So the vertex is (−2, 3).', 'One more: what is the vertex of y = x² − 2x − 3?'], 2).history[1]);
    check('a problem put on the board in a sentence that was cut stays in the tutor\'s record', cutT.includes('So the vertex is (−2, 3). [cut off here') && /had already put on the board[^\]]*the problem \\"What is the vertex of the parabola y = x² − 2x − 3\?/.test(cutT), cutT);
  }
  { const hyp = drawFigure('geometry_figure', { shape: 'triangle', sides: [5, 4, 3], vertices: ['O', 'Q', 'P'], sideLabels: ['distance = 5 (hypotenuse)', '4 (up)', '3 (across)'], angleLabels: [null, null, 'right angle'] });
    check('a figure whose label is too long is drawn with the label shortened', 'svg' in hyp && /distance = 5/.test(hyp.svg) && !/hypotenuse\)/.test(hyp.svg), JSON.stringify(hyp).slice(0, 200)); }
  check('a first reading of "another voice" is confirmed on more words', !partialIsConfirmed('So the center here would') && partialIsConfirmed('So the center here would be negative 3 comma 1 and'));
  // portal-87303e9f (ACT Math, plane geometry).
  {
    const sessP = { ...s13, plan: SEED_DSAT_U1_LINEAR_INEQUALITIES } as never;
    const p1 = await runV2Turn({ session: sessP, state: { ...newV2State(1_000_000), board: { pages: [{ title: 'Page 1', items: [] }, { title: 'One-variable inequalities', items: [] }], current: 1 }, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Ready?' }] }, studentSaid: 'yes', nowMs: 1_060_000, callModel: sayR('Here is one.\n\n<board problem>Solve for x: −6x + 5 > 41</board>\n\nTry it.'), boardPass: false });
    const p2 = await runV2Turn({ session: sessP, state: structuredClone(p1.state), studentSaid: 'x is less than minus 6', nowMs: 1_120_000, callModel: sayR('Yes, x < −6.\n\n<board note style="highlight">Systems of inequalities: a point must pass every one.</board>\n\n<board problem>Which of the following points is a solution to the system y ≤ x + 2 and y > 3x − 4? (2, 5), (0, −5), (1, 3), (3, 1)</board>\n\nWhich point works?'), boardPass: false });
    check('a problem from the next part of the plan does not go up under the last part\'s problem: the part is offered first', !p2.toolCalls.some((c) => c.name === 'show_problem' && /^painted/.test(c.outcome)) && /Next is systems of inequalities\. Shall we go on/.test(p2.spoken) && p2.state.board.pages.length === 2, [p2.spoken, p2.toolCalls.map((c) => `${c.name}: ${c.outcome}`)]);
    const p3 = await runV2Turn({ session: sessP, state: structuredClone(p1.state), studentSaid: 'x is less than minus 6', nowMs: 1_120_000, callModel: sayR('Yes, x < −6. One more of the same kind.\n\n<board problem>Solve for x: 7 − 2x ≥ 15</board>\n\nTry it.'), boardPass: false });
    check('a second problem of the tutor\'s own on the same page is left where it is', p3.toolCalls.some((c) => c.name === 'show_problem' && /^painted/.test(c.outcome)) && !p3.toolCalls.some((c) => c.name === 'new_page'), p3.toolCalls.map((c) => `${c.name}: ${c.outcome}`));
  }
  {
    const stF = { ...newV2State(0), history: [{ role: 'user', content: '120' }, { role: 'assistant', content: 'Yes, 120°. Next is parallel lines cut by a transversal, where one pairing of angles is a common trap. Shall we go on?' }] } as never;
    check('told that the student agreed to the part just named, so it is not announced again', /named what comes next \("Next is parallel lines[^)]*\) and the student has answered/.test(renderFacts(s13, stF, { nowMs: 60000, heard: 'Uh, yes.' })) && !/named what comes next/.test(renderFacts(s13, stF, { nowMs: 60000, heard: 'Actually can we go back to the circle one because I did not get the sector' })));
    const circ = drawFigure('geometry_figure', { shape: 'circle', radius: 12, points: [{ name: 'O', at: 0 }, { name: 'P', at: 0 }, { name: 'Q', at: 90 }], angles: [{ vertex: 'center', from: 'P', to: 'Q', label: '90°' }] });
    check('a circle\'s centre is not also a point on its rim, and an angle at the centre brings its radii', 'svg' in circ && (circ.svg.match(/>O</g) ?? []).length === 1 && (circ.svg.match(/<path d="M[^"]*L[^"]*"/g) ?? []).length >= 2, JSON.stringify(circ).slice(0, 300));
    const ext = drawFigure('geometry_figure', { shape: 'triangle', asa: [50, 10, 70], vertices: ['A', 'B', 'C'], angleLabels: ['50°', '70°', null], exterior: { at: 2, label: '?' } });
    check('a triangle can show the exterior angle at a vertex', 'svg' in ext && /stroke-dasharray="5 3"/.test(ext.svg) && />\?</.test(ext.svg), JSON.stringify(ext).slice(0, 200));
    const folded = foldInterruptedTurn(newV2State(0), 'uh so yeah', 'Yes, 36π.', [{ id: 'q1', name: 'show_problem', args: { statement: 'A circle has a diameter of 18. Find its area.' }, outcome: 'not painted: the student spoke before you reached it, so it never went up' }] as never);
    check('a board item dropped before it was shown is not in the tutor\'s record of the board, and its result says so', folded.board.pages.every((pg) => pg.items.length === 0) && JSON.stringify(folded.history).includes('never went up'), JSON.stringify(folded.board));
  }
  const triBlank = drawFigure('geometry_figure', { shape: 'triangle', sides: [3, 4, 5], sideLabels: ['a', 'b', 'c'], angleLabels: ['', '', '90°'] });
  check('an empty label on a triangle is no label, not a refusal (demo check 11-13)', 'svg' in triBlank, JSON.stringify(triBlank).slice(0, 200));
  const cellNamed = drawFigure('cell', { cellType: 'plant', organelles: ['nucleus', 'chloroplasts', 'vacuole', 'cell wall', 'mitochondria', 'lysosome'] });
  check('a cell drawn from everyday organelle names, each labelled, a lysosome left out of a plant (demo check 11-13)', 'svg' in cellNamed && /Chloroplast/.test(cellNamed.svg) && /Central vacuole/.test(cellNamed.svg) && !/Lysosome/.test(cellNamed.svg) && /#bbf7d0/.test(cellNamed.svg), JSON.stringify(cellNamed).slice(0, 200));
  const gapNet = circuitNetlist({ battery: '1.5 V', load: [{ bulb: 'bulb' }, { gap: 'not joined' }, { object: 'plastic spoon' }] }).components as Array<{ type: string; label?: string }>;
  check('a circuit can show a break in the wire and a thing put across a gap', gapNet.some((c) => c.type === 'gap') && gapNet.some((c) => c.type === 'object' && c.label === 'plastic spoon'), JSON.stringify(gapNet));
  const moon = drawFigure('moon_orbit', { highlight: 'first quarter', find: 'waning_gibbous' });
  check('the Moon round Earth draws its eight places, rings one and leaves one as a question', 'svg' in moon && /First quarter/.test(moon.svg) && /which phase\?/.test(moon.svg) && !/Waning gibbous/.test(moon.svg) && 'refused' in drawFigure('moon_orbit', { find: 'blue' }), '');
  const bareCard = "Ava's flashlight has a battery, a bulb and two wires. One wire is joined to the battery and the bulb, but the other wire is not joined to the bulb. Does the bulb light up? Say yes or no, and say why.";
  check('a bare "say yes or no" is not the question: the card\'s question is said (demo check 11-13)', unsaidAsk(bareCard, ['Now one for you.', 'A battery, wires and a bulb are in a circuit.', 'Say yes or no, and say why.']) === 'Does the bulb light up?' && unsaidAsk(bareCard, ['Here it is.', 'Does the bulb light up when the wire is not joined?']) === null, unsaidAsk(bareCard, ['Now one for you.', 'A battery, wires and a bulb are in a circuit.', 'Say yes or no, and say why.']));
  check('a part headed by a question is offered as one, and a page title loses its page number', partOffer('Which one matches?', false) === 'Next: which one matches? Shall we go on, or do you have a question first?' && (inlineToolCall(boardBlocksIn('<board page>Page 2: What makes a light turn on?</board>')[0]).args as { title: string }).title === 'What makes a light turn on?', partOffer('Which one matches?', false));
  const nested = 'Now a plastic spoon.\n\n<board problem>Will the bulb light?\n<board figure kind="circuit">{"battery":"1.5 V","load":[{"bulb":"lamp"},{"object":"plastic spoon"}]}</board>\n</board> What do you think?';
  const nStream = new BoardInlineStream(); const nParts = [...nStream.push(nested.slice(0, 40)), ...nStream.push(nested.slice(40)), ...nStream.flush()];
  check('a figure written inside a problem goes up after it, and no closing tag is said (demo check 11-13)', boardBlocksIn(nested).map((b) => b.kind).join() === 'problem,figure' && nParts.filter((p) => 'block' in p).length === 2 && !nParts.some((p) => 'text' in p && /board/.test(p.text)) && !/board/.test(stripBoardBlocks(nested)), JSON.stringify(nParts).slice(0, 300));
  const crateDirs = (inlineToolCall(boardBlocksIn('<board forces object="the crate">Cable, first | toward the door | 150 N\nCable, third | away from the door | 400 N\nAir | up from the air | 2 N</board>')[0]).args as { forces: Array<{ direction: string }> }).forces.map((f) => f.direction).join();
  check('a force direction said in words is drawn that way: "away from the door" is the other way (demo check 11-13)', crateDirs === 'right,left,up', crateDirs);

  console.log('a board item the learner must act on is heard (D2)');
  {
    const menu = { name: 'annotate', args: { text: '1) individual words\n2) a complete sentence\n3) speaking more naturally\n4) skip and continue' }, outcome: 'painted on page 7' };
    check('real-run-B t49: the menu is read as "1, …; 2, …"', unsaidBoardItem([menu], ['発音の練習です。', '次のどれにしますか？', 'Which one would you like?', 'Just say the number.']) === '1, individual words; 2, a complete sentence; 3, speaking more naturally; 4, skip and continue.');
    const card = { name: 'show_sentence', args: { sentence: 'I want to expand our business internationally.' }, outcome: 'painted on page 6' };
    check('upper-int t61: the sentence to say back is read', unsaidBoardItem([card], ['Here is one you can use for your plans:', 'Please say it back to me.']) === 'I want to expand our business internationally.');
    check('a sentence already said is not said twice', unsaidBoardItem([card], ['Try this one: I want to expand our business internationally.', 'Say it back to me.']) === null);
    check('options already read are not read twice', unsaidBoardItem([menu], ['You can practise individual words, a complete sentence, speaking more naturally, or skip and continue.', 'Which one?']) === null);
    check('a card the reply does not ask about (a correction, the summary) is left to the board', unsaidBoardItem([card], ['Yes, that is a clear plan.']) === null);
    // Review M6: a correction card, then a new question about something else: read after that question it would land in
    // the wrong place, so it is not read.
    const fix = { name: 'show_sentence', args: { sentence: 'I have worked here for eleven years.' }, outcome: 'painted on page 3' };
    check('a correction card under a new, unrelated question is not read after it (review M6)', unsaidBoardItem([fix], ['After a number we say years.', 'Now, what did you do last weekend?']) === null);
    check('…but under "try the sentence again" it is', unsaidBoardItem([fix], ['After a number we say years.', 'Can you try the sentence again?']) === 'I have worked here for eleven years.');
    check('options under a question that is not about choosing are not read', unsaidBoardItem([menu], ['Good.', 'How was your weekend?']) === null);
    // Final review M5: a menu asked without "which"/"number" is read; a "which" that is not a choice is not.
    check('a menu asked as "What would you like to practise?" is read', unsaidBoardItem([menu], ['Let\'s practise pronunciation.', 'What would you like to practise?']) === '1, individual words; 2, a complete sentence; 3, speaking more naturally; 4, skip and continue.');
    check('a menu asked as "Would you like words or a sentence?" is read', unsaidBoardItem([menu], ['We can practise a few ways.', 'Would you like words or a sentence?']) === '1, individual words; 2, a complete sentence; 3, speaking more naturally; 4, skip and continue.');
    const steps = { name: 'annotate', args: { text: '1) Write the forces on the block\n2) Resolve the weight along the slope\n3) Apply Newton\'s second law' }, outcome: 'painted' };
    check('"Which step is hardest?" under a numbered steps note is not read as a menu', unsaidBoardItem([steps], ['Those are the three steps.', 'Which step is hardest?']) === null);
    check('…while "Which one would you like to start with?" under the same list is', unsaidBoardItem([steps], ['Those are the three steps.', 'Which one would you like to start with?']) !== null);
    check('mathematics stays on the board', unsaidBoardItem([{ name: 'annotate', args: { text: '1) $x = 2$\n2) $x = 3$' }, outcome: 'painted' }], ['Which one is right?']) === null);
    check('a note that is not a numbered list is not a menu', unsaidBoardItem([{ name: 'annotate', args: { text: 'Present perfect: have + past participle.' }, outcome: 'painted' }], ['Can you make one?']) === null);
    check('an item that was not painted is not read', unsaidBoardItem([{ ...card, outcome: 'not painted: bad' }], ['Please say it back to me.']) === null);
    check('a card the board scrolled back to is read', unsaidBoardItem([{ ...card, outcome: 'not painted again: already on the board (page 4); the board has scrolled back to it' }], ['Please say it back to me.']) === 'I want to expand our business internationally.');
    const longCard = { name: 'show_sentence', args: { sentence: Array.from({ length: 40 }, (_, i) => `word${i}`).join(' ') }, outcome: 'painted' };
    check('a card too long to say is left to the board', unsaidBoardItem([longCard], ['Read it to me.']) === null);

    // Whole turns, streamed as the model writes them.
    const streaming = (text: string): V2ModelCall => async (_p, onText) => { for (const piece of text.match(/[\s\S]{1,23}/g) ?? []) onText?.(piece); return msg([{ type: 'text', text }], 'end_turn'); };
    const lang: V2Session = { studentName: 'Kenji', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, languages: ['en', 'ja'] };
    const midLesson = () => ({ ...newV2State(0), board: { pages: [{ title: 'Warm-up', items: [] }, { title: 'Pronunciation', items: [] }], current: 1 }, history: [{ role: 'user' as const, content: 'hi' }, { role: 'assistant' as const, content: 'Shall we go on, or do you have a question first?' }] });
    const t61 = 'Here is one you can use for your plans:\n\n<board sentence stress="expand">I want to expand our business internationally.</board>\n\nPlease say it back to me.';
    const v61 = await runV2Turn({ session: lang, state: midLesson(), studentSaid: 'A sentence, please.', callModel: streaming(t61), boardPass: false, mathsCheck: false, nowMs: 15 * 60000 });
    // Task 6e: after a lead-in ending in a colon the card is spoken where it stands (TUTOR_V2_SAY_SENTENCE_CARD); with that
    // switch off it is read after the ask, as before.
    check('voice, upper-int t61: the sentence is said once — after its lead-in (Task 6e), else at the end', TUTOR_V2_SAY_SENTENCE_CARD
      ? /^Here is one you can use for your plans:\s+I want to expand our business internationally\.\s+Please say it back to me\.$/.test(v61.spoken) && v61.spoken.split('I want to expand').length === 2
      : /Please say it back to me\.\n\nI want to expand our business internationally\.$/.test(v61.spoken), v61.spoken);
    const t49 = '発音の練習です。次のどれにしますか？\n\n<board note>1) individual words\n2) a complete sentence\n3) speaking more naturally\n4) skip and continue</board>\n\nWhich one would you like? Just say the number.';
    const v49 = await runV2Turn({ session: lang, state: midLesson(), studentSaid: 'Yes, thank you.', callModel: streaming(t49), boardPass: false, mathsCheck: false, nowMs: 10 * 60000 });
    check('voice, real-run-B t49: the reply ends with the options, read', /Just say the number\.\n\n1, individual words; 2, a complete sentence; 3, speaking more naturally; 4, skip and continue\.$/.test(v49.spoken), v49.spoken);
    const t5 = 'Great. Here is the first question.\n\n<board problem difficulty="easy">Can you tell me a little about your job? What do you do?</board>\n\nPlease answer in English, and don\'t worry about mistakes.';
    const v5 = await runV2Turn({ session: lang, state: midLesson(), studentSaid: 'Yes, I am ready.', callModel: streaming(t5), boardPass: false, mathsCheck: false, nowMs: 2 * 60000 });
    // Task 7m (QUESTION_ONCE): the card's question is asked where the card stands, before the instruction after it, and once;
    // with that switch off it is appended at the end, as before.
    check('voice, real-run-A t5: the question on the card is asked aloud (the problem card\'s own path)', TUTOR_V2_QUESTION_ONCE
      ? /^Great\. Here is the first question\.\s+Can you tell me a little about your job\? What do you do\?\s+Please answer in English, and don't worry about mistakes\.$/.test(v5.spoken) && v5.spoken.split('What do you do?').length === 2
      : /What do you do\?$/.test(v5.spoken), v5.spoken);
    const x61 = await runV2Turn({ session: { ...lang, mode: 'text' }, state: midLesson(), studentSaid: 'A sentence, please.', callModel: streaming(t61), boardPass: false, mathsCheck: false, nowMs: 15 * 60000 });
    check('text: nothing is added (the board is in front of them)', /Please say it back to me\.$/.test(x61.spoken), x61.spoken);
    check('the kill switch defaults on', TUTOR_V2_SPEAK_BOARD_ITEM === true);
  }

  console.log('discussion sessions');
  {
    const dPlan = PRIVATE_ECS_AI_LITERACY_CH2;
    const dSession: V2Session = { studentName: 'Jo', subject: dPlan.subject, level: dPlan.grade, mode: 'voice', timeBoxMinutes: 12, plan: dPlan };
    check('a discussion plan is read as one; a teaching plan is not', !!discussionOf(dPlan) && !discussionOf(SEED_AP_CALCBC_U4_LHOPITAL));
    check('the private plan is found by id and is in no catalogue', (await getLessonPlan(dPlan.id)) === dPlan && !SEED_PLANS.some((p) => p.id === dPlan.id) && isPrivatePlan(dPlan.id) && !isPrivatePlan(SEED_AP_CALCBC_U4_LHOPITAL.id));
    check('the discussion prompt shares the board section word for word', V2_DISCUSSION_CONSTITUTION.includes(V2_CONSTITUTION.slice(V2_CONSTITUTION.indexOf('# The board'), V2_CONSTITUTION.indexOf('# Your notes')).trim()));
    check('the discussion prompt has no verdicts or gaps in it', !/track_gap|"not quite"|yes, that's right/.test(V2_DISCUSSION_CONSTITUTION));
    const part = v2SessionPart(dSession);
    check('the session part carries the cases as written and no answer key', part.includes('Kelly reads the suggestions carefully') && part.includes('Considerations to complicate') && !/Answers are for your checking/.test(part) && !/LESSON PLAN/.test(part));
    const dTools = v2Tools(dSession.subject, dSession.topic ?? '', true).map((t) => t.name);
    check('a discussion gets record_thinking and no gap tracker or figure tools', dTools.includes('record_thinking') && !dTools.includes('track_gap') && dTools.join() === 'keep_listening,update_session_note,set_goal_status,record_thinking,end_lesson', dTools.join());
    check('a teaching session keeps its tools', !v2Tools('math').some((t) => t.name === 'record_thinking') && v2Tools('math').some((t) => t.name === 'track_gap'));

    const open = stub([msg([{ type: 'text', text: 'Hi Jo. Today is about AI and student writing, and there are no right answers. What is your first reaction when a student uses AI on a draft?' }], 'end_turn')]);
    // A plan with no scripted welcome leaves the opening to the tutor.
    const { welcome: _w, welcomeBoard: _wb, ...unscripted } = dPlan.metadata as Record<string, unknown>;
    const r0 = await runV2Turn({ session: { ...dSession, plan: { ...dPlan, metadata: unscripted } }, state: newV2State(1_000_000), studentSaid: null, nowMs: 1_000_000, callModel: open.call });
    const none = stub([]);
    const rw = await runV2Turn({ session: { ...dSession, studentName: 'Jo Smith', teacher: { name: 'Sofia' } } as V2Session, state: newV2State(1_000_000), studentSaid: null, nowMs: 1_000_000, callModel: none.call });
    check('a scripted welcome is spoken word for word with no model call, with its board up (ECS review 11-17)', rw.spoken.startsWith('Welcome to the ECS Voice Tutors, powered by Evelyn Learning. I\'m Sofia.') && /To begin, Jo: when you hear/.test(rw.spoken) && !/[{}]|board/.test(rw.spoken) && none.seen.length === 0 && rw.toolCalls.some((c) => c.name === 'annotate' && !/^not /.test(c.outcome)) && rw.state.history.length === 2, `${rw.spoken} | ${JSON.stringify(rw.toolCalls.map((c) => [c.name, c.outcome]))}`);
    const rwNoName = await runV2Turn({ session: { ...dSession, studentName: '' }, state: newV2State(1_000_000), studentSaid: null, nowMs: 1_000_000, callModel: stub([]).call });
    check('the welcome reads cleanly without a name', /To begin: when you hear/.test(rwNoName.spoken) && /I'm your thinking partner\./.test(rwNoName.spoken), rwNoName.spoken);
    const sys0 = (open.seen[0].system as Anthropic.TextBlockParam[]).map((b) => b.text).join('\n');
    const user0 = JSON.stringify(open.seen[0].messages);
    check('the opening uses the discussion prompt and the discussion opener', sys0.startsWith(V2_DISCUSSION_CONSTITUTION.slice(0, 60)) && user0.includes(DISCUSSION_OPENING.slice(1, 40)) && !sys0.includes(V2_CONSTITUTION.slice(0, 60)));
    check('a discussion reply gets no board pass', r0.modelCalls === 1);

    const think = stub([msg([
      { type: 'text', text: 'So the line for you is who makes the decisions. What about a student who accepts every suggestion?' },
      { type: 'tool_use', id: 'd1', name: 'record_thinking', input: { position: 'Fine if the student decides', weighed: ['student keeps control', 'voice'] } },
      { type: 'tool_use', id: 'd2', name: 'record_thinking', input: { weighed: ['Student keeps control!', 'disclosure'], shift: 'from "fine" to "fine if they choose"' } },
    ], 'tool_use'), msg([{ type: 'text', text: '' }], 'end_turn')]);
    const r1 = await runV2Turn({ session: dSession, state: r0.state, studentSaid: 'Kelly is fine, she chose.', nowMs: 1_000_000 + 3 * 60000, callModel: think.call });
    check('record_thinking keeps the position, adds what was weighed once, and keeps shifts', r1.state.thinking?.position === 'Fine if the student decides' && r1.state.thinking?.weighed.join('|') === 'student keeps control|voice|disclosure' && r1.state.thinking?.shifts.length === 1, JSON.stringify(r1.state.thinking));
    const f1 = renderFacts(dSession, r1.state, { nowMs: 1_000_000 + 4 * 60000 });
    check('the facts show their thinking and a discussion clock', /already raised or weighed.*disclosure/.test(f1) && /4 min used of about 12; about 8 left: plenty of time/.test(f1) && !/time for more/.test(f1), f1);

    const early = stub([
      msg([{ type: 'text', text: 'Thanks, Jo.' }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'conversation_complete', summary: 's' } }], 'tool_use'),
      msg([{ type: 'text', text: 'What would be most valuable for you to explore next?' }], 'end_turn'),
    ]);
    const re = await runV2Turn({ session: dSession, state: r1.state, studentSaid: 'ok', nowMs: 1_000_000 + 6 * 60000, callModel: early.call });
    check('a discussion cannot end early without a chosen direction', !re.state.closed && /not ended/.test(re.toolCalls[0].outcome));
    const unasked = stub([
      msg([{ type: 'text', text: 'Thanks, Jo.' }, { type: 'tool_use', id: 'e5', name: 'end_lesson', input: { because: 'conversation_complete', summary: 's', next_direction: 'showing steps' } }], 'tool_use'),
      msg([{ type: 'text', text: 'What would you most like to explore next?' }], 'end_turn'),
    ]);
    const reflected = { ...r1.state, history: [...r1.state.history, { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'What are you thinking now, and has anything shifted?' }] }] };
    const ruf = await runV2Turn({ session: dSession, state: r1.state, studentSaid: 'Worth trying, I guess.', nowMs: 1_000_000 + 7 * 60000, callModel: stub([msg([{ type: 'text', text: 'Thanks, Jo.' }, { type: 'tool_use', id: 'e6', name: 'end_lesson', input: { because: 'conversation_complete', summary: 's' } }], 'tool_use'), msg([{ type: 'text', text: 'What are you thinking now?' }], 'end_turn')]).call });
    check('a discussion cannot close before asking what they are thinking now (embed-1794971130343)', (!ruf.state.closed && /not yet asked what they are thinking now/.test(ruf.toolCalls[0].outcome)) || reflectAsked(r1.state.history, discussionOf(dPlan)), ruf.toolCalls[0]?.outcome);
    const paceState = { ...r1.state, goals: { orient: { status: 'shown' as const }, explore: { status: 'shown' as const } } };
    const fp7 = renderFacts(dSession, paceState, { nowMs: r1.state.startedAtMs + 7 * 60000 });
    const fp9 = renderFacts(dSession, paceState, { nowMs: r1.state.startedAtMs + 9.2 * 60000 });
    check('the facts say when the last two stages are due by the plan\'s times, and when a stage has overrun', reflectAtMinutes(dPlan, 15) === 8 && /time to ask what they are thinking now/.test(fp9) && !/time to ask what they are thinking now/.test(fp7) && /stage \[explore\] has had its time/.test(renderFacts(dSession, { ...r1.state, goals: { orient: { status: 'shown' as const } } }, { nowMs: r1.state.startedAtMs + 6 * 60000 })), `${fp7}\n${fp9}`);
    const sameQ = { ...r1.state, history: [...r1.state.history, { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'Would you want that for every student, or only the ones whose work worries you?' }] }, { role: 'user' as const, content: 'Ah, a reference.' }, { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'A baseline. Would you want that baseline for every student, or only the ones whose work worries you?' }] }] };
    check('the same question asked twice is pointed out', /asked the same question as the reply before it/.test(renderFacts(dSession, sameQ, { nowMs: r1.state.startedAtMs + 5 * 60000 })));
    const ru = await runV2Turn({ session: dSession, state: reflected, studentSaid: 'Worth trying, I guess.', nowMs: 1_000_000 + 7 * 60000, callModel: unasked.call });
    check('a discussion cannot close on a direction it wrote itself, before asking them', !ru.state.closed && /not asked them yet/.test(ru.toolCalls[0].outcome), ru.toolCalls[0]?.outcome);
    const asked = { ...reflected, history: [...reflected.history, { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'What would be most valuable for you to explore next?' }] }] };
    const done = stub([msg([{ type: 'text', text: 'You are leaving with a question for your team. Thanks, Jo.' }, { type: 'tool_use', id: 'e2', name: 'end_lesson', input: { because: 'conversation_complete', summary: 's', next_direction: 'a conversation with my grade team' } }], 'tool_use')]);
    const rd = await runV2Turn({ session: dSession, state: asked, studentSaid: 'Talk to my grade team.', nowMs: 1_000_000 + 9 * 60000, callModel: done.call });
    check('with a direction chosen it ends before the clock and keeps the direction', rd.state.closed && rd.state.nextDirection === 'a conversation with my grade team');
    const closingWords = discussionOf(dPlan)!.closing!;
    check('the plan\'s closing words end the session, once, and are kept in the history (ECS review 11-17)', rd.spoken.endsWith(closingWords) && rd.spoken.split(closingWords).length === 2 && JSON.stringify(rd.state.history.at(-2)).includes(closingWords.slice(0, 40)), rd.spoken);
    const late = stub([msg([{ type: 'text', text: 'Thanks, Jo. The time is up.' }, { type: 'tool_use', id: 'e9', name: 'end_lesson', input: { because: 'time_nearly_used', summary: 's', next_direction: 'comparing Kelly with Diego' } }], 'tool_use')]);
    const rl = await runV2Turn({ session: dSession, state: r1.state, studentSaid: 'hello', nowMs: 1_000_000 + 13 * 60000, callModel: late.call });
    check('when the time runs out before the question was asked, no direction is kept (embed-1794953503551)', rl.state.closed && !rl.state.nextDirection && /the close names none/.test(renderFacts(dSession, { ...r1.state, thinking: { ...r1.state.thinking!, direction: undefined } }, { nowMs: 1_000_000 + 13 * 60000 })), String(rl.state.nextDirection));
    const steer = stub([msg([{ type: 'text', text: 'You are right to say so. What do you actually think?' }, { type: 'tool_use', id: 's1', name: 'record_thinking', input: { shift_withdrawn: true } }], 'tool_use'), msg([{ type: 'text', text: '' }], 'end_turn')]);
    const rs = await runV2Turn({ session: dSession, state: r1.state, studentSaid: 'It\'s a shift because that was sort of the only answer you were going to accept from me.', nowMs: 1_000_000 + 5 * 60000, callModel: steer.call });
    const fs0 = JSON.stringify(steer.seen[0].messages.at(-1));
    const fs1 = renderFacts(dSession, rs.state, { nowMs: 1_000_000 + 6 * 60000 });
    check('a person who says they were steered is heard: the shift is withdrawn and the facts hold it (embed-1794951911157)', /they feel steered toward an answer/.test(fs0) && rs.state.thinking?.steered === true && rs.state.thinking.shifts.length === 0 && /they said they felt steered/.test(fs1) && !/shifts:/.test(fs1), fs1);
    const hypo = { ...r1.state, history: [...r1.state.history, { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'Think of a student who used AI only to tidy one paragraph. What would the chatbot have to do, in a case like that one, for the ideas in the paragraph to stop being the ideas of the student who wrote it?' }] }] };
    check('a hypothetical student and an over-long question are pointed out', /it put a hypothetical student to them/.test(renderFacts(dSession, hypo, { nowMs: 1_000_000 + 5 * 60000 })) && /its question ran to \d+ words/.test(renderFacts(dSession, hypo, { nowMs: 1_000_000 + 5 * 60000 })), renderFacts(dSession, hypo, { nowMs: 1_000_000 + 5 * 60000 }));
    const dMap = renderDiscussionMap(dPlan, discussionOf(dPlan)!);
    check('the map sends board points to the board, keeps the scenario for the tutor, and carries the lead-in and closing', /board points[^\n]*\n\s+- Kelly wrote her story herself/.test(dMap) && /not for the board\): Kelly finishes writing/.test(dMap) && !/as written \(for the board\)/.test(dMap) && /Before the first case, lead in with this/.test(dMap) && /Closing words the session says/.test(dMap));
    check('the prompt takes no side and offers ideas as possibilities', /You have no position to bring them to/.test(V2_DISCUSSION_CONSTITUTION) && /Offer ideas as possibilities/.test(V2_DISCUSSION_CONSTITUTION) && /Never put the full scenario on the board when the plan gives points/.test(V2_DISCUSSION_CONSTITUTION));

    const mute = stub([
      msg([{ type: 'tool_use', id: 'm1', name: 'record_thinking', input: { position: 'Worried about a slippery slope' } }], 'tool_use'),
      msg([], 'end_turn'),
      msg([{ type: 'text', text: 'Where does it stop is the question. What would tell you a student had crossed the line?' }], 'end_turn'),
    ]);
    const rm = await runV2Turn({ session: dSession, state: r1.state, studentSaid: 'Where does it stop?', nowMs: 1_000_000 + 5 * 60000, callModel: mute.call });
    check('a discussion reply with no words is asked once more, and speaks', /Where does it stop/.test(rm.spoken) && rm.modelCalls === 3 && /no words/.test(JSON.stringify(mute.seen[2].messages)), rm.spoken);
    const flat = stub([msg([{ type: 'text', text: 'That is a careful way to put it.' }], 'end_turn')]);
    const rf = await runV2Turn({ session: dSession, state: r1.state, studentSaid: 'It depends on the assignment.', nowMs: 1_000_000 + 5 * 60000, callModel: flat.call });
    check('a spoken reply that asks nothing hands over with a discussion question', DISCUSSION_CHECK_INS.some((q) => rf.spoken.endsWith(q)) && !V2_CHECK_INS.some((q) => rf.spoken.endsWith(q)), rf.spoken);
    const box = stub([msg([
      { type: 'text', text: 'Kelly asks an AI for advice on her story and keeps only what fits her voice. What do you make of her?' },
      { type: 'tool_use', id: 'b1', name: 'record_thinking', input: { their_time_minutes: 8, their_example: 'a grade 7 boy who pasted every suggestion', complicated: true } },
    ], 'tool_use'), msg([{ type: 'text', text: '' }], 'end_turn')]);
    const rb = await runV2Turn({ session: dSession, state: { ...r1.state, thinking: { ...r1.state.thinking!, direction: undefined } }, studentSaid: 'I have about eight minutes.', nowMs: 1_000_000 + 60000, callModel: box.call });
    const fb = renderFacts(dSession, rb.state, { nowMs: 1_000_000 + 5 * 60000 });
    check('a stated time becomes the clock, and their example and the complication count reach the facts', /of about 8 \(the time they said they have\); about 3 left: time to reflect/.test(fb) && /their own student or experience: a grade 7 boy/.test(fb) && /complications you have brought in: 1/.test(fb), fb);
    const named = { ...rb.state, history: [...rb.state.history, { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'What are you thinking now?' }] }, { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'Where would you like to take this next?' }] }], thinking: { ...rb.state.thinking!, direction: 'parents', complications: 3 } };
    const fn = renderFacts(dSession, named, { nowMs: 1_000_000 + 5 * 60000 });
    check('a named direction is shown as not to be asked again; three complications are enough', /direction they chose: parents \(named; don't ask for it again\)/.test(fn) && /that is enough/.test(fn), fn);
    const endNamed = stub([msg([{ type: 'text', text: 'Bye, Jo.' }, { type: 'tool_use', id: 'e3', name: 'end_lesson', input: { because: 'conversation_complete', summary: 's' } }], 'tool_use')]);
    const ren = await runV2Turn({ session: dSession, state: named, studentSaid: 'Parents, then.', nowMs: 1_000_000 + 5 * 60000, callModel: endNamed.call });
    const twice = { ...rb.state, thinking: { ...rb.state.thinking!, justComplicated: true } };
    const ft = renderFacts(dSession, twice, { nowMs: 1_000_000 + 5 * 60000 });
    const rt = await runV2Turn({ session: dSession, state: twice, studentSaid: 'Hmm.', nowMs: 1_000_000 + 5 * 60000, callModel: stub([msg([{ type: 'text', text: 'Tell me more about him.' }], 'end_turn')]).call });
    check('after a complication the next turn is told so, once', /brought in a complication: this one builds/.test(ft) && !rt.state.thinking?.justComplicated, ft);
    check('a direction recorded earlier lets the conversation close', ren.state.closed && ren.state.nextDirection === 'parents');
    const judged = { ...r1.state, history: [...r1.state.history, { role: 'assistant' as const, content: [{ type: 'text' as const, text: "That's a clear line. Not quite, though. With about three minutes left, does it hold for Diego? And for older students? Here is a long stretch of words to push this reply past the limit a spoken reply should keep to, so that the engine notices it ran long and says so in the next turn's facts block for the tutor." }] }] };
    const fj = renderFacts(dSession, judged, { nowMs: 1_000_000 + 5 * 60000 });
    check('the facts point out a judging opener and a double question in the last reply', /your last reply: it opened by judging their point \("That's a clear line"\); it asked 2 questions; it corrected them \("Not quite"\); it ran to \d+ words.*; it read the clock out/.test(fj), fj);
    const lost = renderFacts(dSession, judged, { nowMs: 1_000_000 + 5 * 60000, heard: 'Sorry, say that again?' });
    check('when they did not follow, the next turn is told to say it again plainly', /they did not follow it: say it again in one plain sentence/.test(lost) && !/did not follow/.test(fj), lost);
    check('the map gives the spoken version of a case and the author\'s reflection questions', /to tell aloud: Kelly finishes a story/.test(renderDiscussionMap(dPlan, discussionOf(dPlan)!)) && /Does this still sound like me\?/.test(renderDiscussionMap(dPlan, discussionOf(dPlan)!)));
    const selfOrder = stub([msg([{ type: 'text', text: 'Record the direction, then close.' }, { type: 'tool_use', id: 'e4', name: 'end_lesson', input: { because: 'conversation_complete', summary: 's', next_direction: 'a talk with my department.' } }], 'tool_use')]);
    const rso = await runV2Turn({ session: dSession, state: asked, studentSaid: 'My department, I think.', nowMs: 1_000_000 + 9 * 60000, callModel: selfOrder.call });
    check('an order to itself is never said, and a close with nothing left to say still closes in words', rso.state.closed && !/Record the direction/.test(rso.spoken) && rso.spoken === `Thank you for thinking this through with me. The direction you chose: a talk with my department.\n\n${closingWords}`, rso.spoken);
    // Asked but unanswered: silence after the question is no direction (local test embed-1794971130343).
    const silentEnd = stub([msg([{ type: 'text', text: 'Thank you, Jo.' }, { type: 'tool_use', id: 'e5', name: 'end_lesson', input: { because: 'conversation_complete', summary: 's', next_direction: 'start with the ones who worry you' } }], 'tool_use'), msg([{ type: 'text', text: 'What would you like to explore next?' }], 'end_turn')]);
    const rsil = await runV2Turn({ session: dSession, state: asked, studentSaid: null, facts: { silenceSeconds: 20 }, nowMs: 1_000_000 + 9 * 60000, callModel: silentEnd.call });
    check('a direction question met with silence does not close with a direction', !rsil.state.closed && !rsil.state.nextDirection && !directionAnswered(asked.history, null) && directionAnswered(asked.history, 'My department.'), String(rsil.state.nextDirection));
    const dMeta = discussionOf(PRIVATE_ECS_AI_LITERACY_CH2)!;
    const hist = (texts: string[]) => texts.map((t) => ({ role: 'assistant' as const, content: [{ type: 'text' as const, text: t }] }));
    const untoldAll = untoldCases(dMeta, hist(['Welcome. What is your first reaction?']));
    const namedOnly = untoldCases(dMeta, hist([`${dMeta.cases[0].spoken} What do you make of it?`, "Would you say the same about Diego's case, where the AI rewrites the whole story?"]));
    check('a case is untold until its spoken version has been said; its name alone does not tell it', untoldAll.length === dMeta.cases.length && namedOnly.length === dMeta.cases.length - 1 && !namedOnly.includes(dMeta.cases[0]), `${untoldAll.length} ${namedOnly.length}`);
    const fu = renderFacts({ ...dSession, plan: PRIVATE_ECS_AI_LITERACY_CH2 }, { ...r1.state, history: hist([`${dMeta.cases[0].spoken}`]) }, { nowMs: 1_000_000 + 3 * 60000 });
    check('the facts list the cases not yet told', /not yet told to them: /.test(fu) && !fu.includes(`not yet told to them: ${dMeta.cases[0].title}`), fu);
    // Second local test (embed-1795030468491): the second case told with nothing on the board; the title twice; chips a stage ahead.
    const c0 = dMeta.cases[0], c1 = dMeta.cases[1];
    const tellNoBoard = stub([msg([{ type: 'text', text: `${c1.spoken} How does that sit with you?` }], 'end_turn')]);
    const toldFirst = { ...r1.state, goals: {}, history: [...r1.state.history, { role: 'assistant' as const, content: [{ type: 'text' as const, text: `${c0.spoken} What do you make of it?` }] }] };
    const rtb = await runV2Turn({ session: dSession, state: structuredClone(toldFirst), studentSaid: "Who's Diego?", nowMs: 1_000_000 + 5 * 60000, callModel: tellNoBoard.call });
    const pagesNow = rtb.state.board.pages;
    check('a case told without its board gets its page and points from the session itself', pagesNow.some((pg) => pg.title === c1.title && pg.items.some((it) => it.summary.includes(c1.glance![0]))), JSON.stringify(pagesNow.map((pg) => [pg.title, pg.items.map((it) => it.summary)])));
    const dupTitle = stub([msg([{ type: 'text', text: `<board page>${c1.title}</board>\n${c1.spoken}\n<board note style="highlight">${c1.title}\n${c1.glance!.join('\n')}</board>\nHow does that sit with you?` }], 'end_turn')]);
    const rdt = await runV2Turn({ session: dSession, state: structuredClone(toldFirst), studentSaid: 'Go on.', nowMs: 1_000_000 + 5 * 60000, callModel: dupTitle.call });
    const diegoPage = rdt.state.board.pages.find((pg) => pg.title === c1.title);
    check('a note does not repeat the title of its page', !!diegoPage && diegoPage.items.length === 1 && !diegoPage.items[0].summary.startsWith(c1.title) && diegoPage.items[0].summary.includes(c1.glance![0]), JSON.stringify(diegoPage));
    const A = (t: string) => ({ role: 'assistant' as const, content: [{ type: 'text' as const, text: t }] }); const U = (t: string) => ({ role: 'user' as const, content: t });
    const h1 = [A('Welcome. What is your first reaction?'), U('Cheating.')];
    const h2 = [...h1, A(`${c0.spoken} What do you make of it?`), U('Fine.')];
    const h3 = [...h2, A(`${c1.spoken} And this one?`), U('Worse.')];
    const h4 = [...h3, A('What bothers you most in it?'), U('Not knowing.')];
    const h5 = [...h4, A('What are you thinking now, and has anything shifted?'), U('No.')];
    const h6 = [...h5, A('What would you like to explore next?'), U('Rules.')];
    const stageAt = (h: typeof h1, closed = false) => discussionStageIndex(dPlan, dMeta, h, closed);
    check('the stage in hand is read from the conversation: opening, cases, probing, reflecting, direction, done', [stageAt(h1), stageAt(h2), stageAt(h3), stageAt(h4), stageAt(h5), stageAt(h6), stageAt(h6, true)].join(',') === '0,1,1,2,3,4,5', [stageAt(h1), stageAt(h2), stageAt(h3), stageAt(h4), stageAt(h5), stageAt(h6), stageAt(h6, true)].join(','));
    check('stages follow the conversation after a turn, whatever the tutor marked', Object.keys(rtb.state.goals).join(',') === 'orient' && rtb.state.goals.orient.status === 'shown', JSON.stringify(rtb.state.goals));
    check('asking leave to go on to a case is pointed out', /asked leave to move on/.test(renderFacts(dSession, { ...r1.state, history: [...r1.state.history, A('The first part is done. Shall we go on to Diego, who used AI in a different way?')] }, { nowMs: r1.state.startedAtMs + 5 * 60000 })));
    check('the verdict-word scan catches praise and passes a plain acknowledgement', DISCUSSION_VERDICT_WORDS.test('Excellent point.') && DISCUSSION_VERDICT_WORDS.test("That's right, Jo.") && !DISCUSSION_VERDICT_WORDS.test('Tying it to what the student decides is a useful test.'));
  }
  {
    // AP US Government, portal-84f8660d: the lesson went concept → common-mistake check → concept → worked example.
    const pp = SEED_AP_APGOV_U2_PRESIDENCY; const C = 'concept-presidency-formal-informal-powers'; const M = 'misconception-executive-orders-are-laws'; const W = 'worked-federalist-70-energy';
    {
      // AP Environmental Science, portal-03406355.
      const ep = Object.values(envsciSeed)[0] as unknown as PlanT;
      const opened = "Deforestation hits two cycles Good. Here's a case that hits both cycles: the Amazon rainforest being cut and burned. For water, the trees stop transpiring, so less rain falls. Carbon: the trees' stored carbon goes straight into the air as CO₂. This affects both.";
      check('a page whose heading names no part is placed by what is said on opening it', goalForTitle(ep, 'Deforestation hits two cycles') === null && goalForTalk(ep, opened) === 'worked-disruption'
        && goalForTalk(ep, "Water's cycle Let's follow water now. Picture a rainy soccer afternoon: some soaks in, some runs off, some evaporates. That whole loop is the water cycle.") === null
        && goalForTalk(ep, 'Recap Carbon moves through photosynthesis, respiration, decomposition and combustion. Burning fossil fuels, deforestation, paving and dams are the main human changes to the carbon and water cycle.') === null);
      const seg = (id: string) => (ep.segments.find((x) => x.id === id) as unknown as { problem: string }).problem;
      check('one later part of a problem in parts, asked by itself, is told from its first part', laterPartAlone(seg('try-process-id'), 'For a forest scenario, fallen leaves rot on the forest floor. Which carbon-cycle process is responsible: photosynthesis, respiration, decomposition, or combustion?')
        && !laterPartAlone(seg('try-process-id'), 'A growing forest absorbs CO₂ from the atmosphere. Which process is that?')
        && !laterPartAlone(seg('try-synthesis'), 'Atmospheric CO₂ has risen from about 280 ppm in 1850 to about 420 ppm today. Name the two largest human sources of this CO₂.')
        && !laterPartAlone(seg('try-synthesis'), seg('try-synthesis')));
    }
    check('a page is known for the part of the plan its heading belongs to', ['Formal powers', 'War Powers Resolution', 'Executive agreements', 'Bargaining and the bully pulpit', 'The 22nd Amendment'].every((t) => goalForTitle(pp, t) === C) && goalForTitle(pp, 'Federalist No. 70') === W && goalForTitle(pp, 'Practice') === null && goalForTitle(pp, 'Page 1') === null && goalForTitle(pp, 'Recap') === 'recap');
    check('a passage on the board is the worked example that reads it', goalForProblem(pp, 'Energy in the Executive is a leading character in the definition of good Government. ... Decision, activity, secrecy, and despatch, will generally characterize the proceedings of one man, in a much more eminent degree than the proceedings of any greater number.') === W);
    const done = { [M]: { status: 'demonstrated' as const, at: 3 } };
    check('the part in hand is the one the board is on', v2Progress(pp, {}, { [C]: 1 }).currentSegmentId === C && v2Progress(pp, done, { [C]: 4 }).currentSegmentId === C && v2Progress(pp, { ...done, [C]: { status: 'shown', at: 5 } }, { [C]: 6, [W]: 7 }).currentSegmentId === W);
    check('a part just finished stays the chip until the board moves on', v2Progress(pp, done, { [C]: 1 }).currentSegmentId === M && v2Progress(pp, { ...done, [C]: { status: 'shown', at: 5 } }, { [C]: 4 }).currentSegmentId === C && v2Progress(pp, done).currentSegmentId !== M);
    check('a part the board never showed is not counted done because a later one is', !v2Progress(pp, done, { [C]: 4 }).completedSegmentIds.includes(W) && v2Progress(pp, done, { [C]: 4 }).completedSegmentIds.includes('hook') && v2Progress(pp, done).completedSegmentIds.includes(W));
    check('a request to wait put as a question is still one', asksToWait('Wait, uh, can you give me a second, please?') && asksToWait('Could you hold on a minute?') && !asksToWait('hold on, what does that mean?'));
    const nb = { pages: [{ title: 'p', items: [] as never[] }], current: 0 };
    const q = 'sends U.S. troops into hostilities and Congress never declares war or authorizes the use of force, what must happen after 60 days under the War Powers Resolution?';
    const note = 'Executive agreement: a deal with a foreign government, made without Senate ratification\nTreaty: needs two-thirds of the Senate\nDurability: ';
    check('a card in slightly other words is not put up twice on a page', applyToModelBoard(nb, 'a', 'show_problem', { statement: `If a president ${q}` }).painted && !applyToModelBoard(nb, 'b', 'show_problem', { statement: `If the President ${q}` }).painted && applyToModelBoard(nb, 'c', 'show_problem', { statement: 'Troops were sent into hostilities on day 1. On day 20, Congress passes a law authorizing the use of force. Does the 60-day withdrawal deadline still apply? Say yes or no, and why.' }).painted
      && applyToModelBoard(nb, 'd', 'annotate', { text: `${note}a successor president can withdraw from an executive agreement alone` }).painted && !applyToModelBoard(nb, 'e', 'annotate', { text: `${note}?` }).painted && applyToModelBoard(nb, 'f', 'annotate', { text: 'Declaring war: Congress only\nOrdering troops into hostilities: the President, as commander-in-chief' }).painted);
  }
  {
    // AP Statistics, portal-b8ee9d0f: every plan problem was put in the tutor's own words.
    const sp = SEED_AP_STATS_U2_SCATTERPLOTS;
    check('a plan problem reworded by the tutor is still known for its part', goalForProblem(sp, 'For each pair, say which variable is explanatory and which is response: hours of sleep and reaction time.') === 'try-explan-response'
      && goalForProblem(sp, 'A scatterplot of hours studied (x) against exam score (y) for 30 students. The points form a fairly tight upward band, with one student at 8 hours who scored only 50. What is the direction of the relationship, in context?') === 'worked-describe'
      && goalForProblem(sp, 'A scatterplot of arm span (x, in cm) against height (y, in cm) for 50 people. The points cluster tightly around a straight upward line, with no clear outliers. Describe the scatterplot with all four DUFS parts, in context.') === 'try-describe'
      && goalForProblem(sp, 'A scatterplot of car age (x, in years) against resale value (y, in thousands of dollars) for 40 cars. The points fall steeply at first, then level off, with no clear outliers. Describe the scatterplot with all four DUFS parts, in context.') === null
      && goalForTitle(sp, 'Explanatory and response variables') === 'concept-scatter');
    {
      // Each field the turn keeps in the state must be let through by the endpoint, or it is gone by the next turn.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
      // Merge with main (Task 8e): the endpoint's read of the state is v2/client-state.ts on this branch (v2ReadClientState).
      const route = fs.readFileSync(path.join(__dirname, '../src/lib/tutor/v2/client-state.ts'), 'utf8');
      check('the endpoint keeps what the board has shown of the plan between turns', /partsSeen \? \{ partsSeen \}/.test(route) && /problemCards \? \{ problemCards \}/.test(route));
    }
    check('a thought about the student is not said to them', stripToolTalk("Take your time. The student is still thinking, so I'll stay quiet.") === 'Take your time.' && stripToolTalk('One student at 8 hours scored only 50. I will mark the student on the plot.') !== '' && !mentionsTool('The student who studied 8 hours scored 50.'));
  }
  {
    // A problem the tutor makes up is worked out apart, and the result is a fact from the next turn on (portal-8e2d86f3).
    const ownText = 'Try this one. <board problem>For f(x) = x^3 - 3x on the closed interval [-2, 3], find the absolute maximum and the absolute minimum.</board> Start with the candidates.';
    const ownSeen: Anthropic.MessageCreateParamsNonStreaming[] = [];
    const ownCall: V2ModelCall = async (p, onText) => { ownSeen.push(structuredClone(p)); if (ownSeen.length === 1) { onText?.(ownText); return msg([{ type: 'text', text: ownText }], 'end_turn'); } return msg([{ type: 'text', text: "f'(x) = 3x² − 3 = 0 gives x = −1 and x = 1. Absolute max 18 at x = 3." }], 'end_turn'); };
    const ownVoice: V2Session = { ...session, mode: 'voice' };
    const ro = await runV2Turn({ session: ownVoice, state: newV2State(1_000_000), studentSaid: 'ok', callModel: ownCall, boardPass: false, ownKey: true });
    const keys = Object.entries(ro.state.ownKeys ?? {});
    check('a problem of the tutor\'s own is worked out after the reply that set it', keys.length === 1 && /x = −1 and x = 1/.test(keys[0][1]) && ownSeen.length === 2 && /x\^3 - 3x/.test(JSON.stringify(ownSeen[1].messages)) && !ownSeen[1].system, keys);
    check('its worked answer is a fact while its card is on the page in view', /you set yourself[\s\S]*x = −1 and x = 1/.test(renderFacts(ownVoice, ro.state, { nowMs: 1_060_000 })));
    const away = structuredClone(ro.state); away.board.pages.push({ title: 'Next', items: [] }); away.board.current = away.board.pages.length - 1;
    check('and not once the board has moved to another page', !/you set yourself/.test(renderFacts(ownVoice, away, { nowMs: 1_060_000 })));
    {
      // Task 8e fix round 1 (OWN_KEY_NOT_LANGUAGE): a question card in a spoken lesson that teaches a language starts no second call.
      const cardText = 'Good. <board problem>What kind of products do you sell?</board> Tell me in one sentence.';
      const run = async (s: V2Session, notLanguage?: boolean) => {
        const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
        const call: V2ModelCall = async (p, onText) => { seen.push(structuredClone(p)); if (seen.length === 1) { onText?.(cardText); return msg([{ type: 'text', text: cardText }], 'end_turn'); } return msg([{ type: 'text', text: 'No single answer.' }], 'end_turn'); };
        const r = await runV2Turn({ session: s, state: newV2State(1_000_000), studentSaid: 'ok', callModel: call, boardPass: false, ownKey: true, ...(notLanguage === undefined ? {} : { ownKeyNotLanguage: notLanguage }) });
        return { calls: seen.length, keys: Object.keys(r.state.ownKeys ?? {}).length, carded: r.state.board.pages.some((pg) => pg.items.some((it) => it.tool === 'show_problem')) };
      };
      const lang: V2Session = { ...session, mode: 'voice', subject: 'English', languages: ['en', 'ja'] };
      const langOn = await run(lang); const langOff = await run(lang, false);
      const maths = await run(ownVoice); const typedLang = await run({ ...lang, mode: 'text' }); const pron = await run({ ...session, mode: 'voice', subject: 'English', pronunciation: true });
      check('a question card in a spoken language lesson starts no second call and records no key', langOn.carded && langOn.calls === 1 && langOn.keys === 0, langOn);
      check('…nor in one with measured pronunciation', pron.carded && pron.calls === 1 && pron.keys === 0, pron);
      check('in a maths lesson the same card is worked, as on main; a typed language lesson too', maths.carded && maths.calls === 2 && maths.keys === 1 && typedLang.calls === 2 && typedLang.keys === 1, [maths, typedLang]);
      check('OWN_KEY_NOT_LANGUAGE off alone: worked in the language lesson, as on main', langOff.calls === 2 && langOff.keys === 1 && TUTOR_V2_OWN_KEY_NOT_LANGUAGE === true, langOff);
    }
    // Interrupted before it was worked: the next turn works it.
    const left = structuredClone(ro.state); left.ownKeys = { [keys[0]?.[0] ?? 'x']: '' };
    const again = stub([msg([{ type: 'text', text: 'Take your time.' }], 'end_turn'), msg([{ type: 'text', text: 'x = −1 and x = 1; max 18.' }], 'end_turn')]);
    const ra = await runV2Turn({ session: ownVoice, state: left, studentSaid: 'one moment', callModel: again.call, boardPass: false, ownKey: true });
    check('a problem left unworked by an interrupted turn is worked at the end of the next', /max 18/.test(ra.state.ownKeys?.[keys[0]?.[0] ?? 'x'] ?? ''), ra.state.ownKeys);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
    {
      // A question asked aloud with no card: its answer is worked after the reply and is a fact on the next turn only.
      const ask = stub([msg([{ type: 'text', text: 'Good. Now set 3x^2 - 3 = 0. What values of x do you get?' }], 'end_turn'), msg([{ type: 'text', text: 'x^2 = 1, so x = 1 and x = -1. Check: 3(1) - 3 = 0.' }], 'end_turn')]);
      const rq1 = await runV2Turn({ session: ownVoice, state: newV2State(1_000_000), studentSaid: 'the derivative is 3x squared minus 3', callModel: ask.call, boardPass: false, askedKey: true });
      check('a question asked aloud is worked out after the reply', rq1.modelCalls >= 1 && /x = 1 and x = -1/.test(rq1.state.askedKey?.key ?? '') && /What values of x/.test(rq1.state.askedKey?.q ?? '') && /worked out apart/.test(JSON.stringify(ask.seen[1]?.messages ?? '') ) === false && /Find what the tutor is leaving/.test(JSON.stringify(ask.seen[1]?.messages ?? '')), [rq1.state.askedKey, ask.seen.length]);
      check('and the tutor is given it when the student answers', /the question you asked last \("What values of x do you get\?"\).*x = 1 and x = -1/.test(renderFacts(ownVoice, rq1.state, { nowMs: 1_060_000 })));
      check('the worked answer is not spoken', !/Check: 3\(1\)/.test(rq1.spoken));
      const open = stub([msg([{ type: 'text', text: 'We have f(x) = x^3 - 3x here. What do you notice about its shape?' }], 'end_turn'), msg([{ type: 'text', text: 'open' }], 'end_turn')]);
      const ro2 = await runV2Turn({ session: ownVoice, state: structuredClone(rq1.state), studentSaid: 'plus and minus one', callModel: open.call, boardPass: false, askedKey: true });
      check('a question with nothing to work out leaves no answer, and the old one is dropped', ro2.state.askedKey === undefined, ro2.state.askedKey);
      const plain = stub([msg([{ type: 'text', text: 'Shall we go on to the next part?' }], 'end_turn')]);
      const rp2 = await runV2Turn({ session: ownVoice, state: newV2State(1_000_000), studentSaid: 'ok', callModel: plain.call, boardPass: false, askedKey: true });
      check('a question with no mathematics about it costs no call', rp2.modelCalls === 1 && plain.seen.length === 1, plain.seen.length);
    }
    {
      // Merge with main (Task 8e): main's fields through the read this branch moved out of the route, and through its scoping.
      const sent = { ...newV2State(0), problemCards: { g1: 'tool_1' }, partsSeen: { g1: 5 }, ownKeys: { tool_2: 'x = 3' }, askedKey: { q: 'What is x?', key: 'x = 3' }, thinking: { position: 'p', weighed: [], shifts: [], steered: true }, board: { pages: [{ title: 'A', items: [] }, { title: 'B', items: [] }], current: 0, look: true } };
      const read = v2ReadClientState(JSON.parse(JSON.stringify(sent)));
      const scoped = read ? v2ScopeCarried(structuredClone(read), { subject: 'math', level: 'x', mode: 'voice' } as never) : null;
      check('main\'s state fields survive the client-state read and its scoping (problemCards, partsSeen, ownKeys, askedKey, steered, the look back)', !!scoped && scoped.problemCards?.g1 === 'tool_1' && scoped.partsSeen?.g1 === 5 && scoped.ownKeys?.tool_2 === 'x = 3' && scoped.askedKey?.key === 'x = 3' && scoped.thinking?.steered === true && scoped.board.look === true, scoped);
    }
    check('the endpoint keeps the worked answers between turns', /ownKeys \? \{ ownKeys \}/.test(fs.readFileSync(path.join(__dirname, '../src/lib/tutor/v2/client-state.ts'), 'utf8')) && /askedKey \? \{ askedKey \}/.test(fs.readFileSync(path.join(__dirname, '../src/lib/tutor/v2/client-state.ts'), 'utf8')));
  }
  // ── Other voices in the room (room-voices.ts; ECS, embed-1795049380206) ──
  {
    const tv = 'increase inflammation and gallbladder, severe stomach problems, to bring people with diabetes';
    check('speech over the tutor waits for the check', waitsForCheck({ text: tv, speaking: true, suspect: false }));
    check('with the tutor silent in a quiet room, words go straight through', !waitsForCheck({ text: 'I think Kelly did the right thing', speaking: false, suspect: false }));
    check('with the tutor silent in a room where other voices were heard, they wait', waitsForCheck({ text: 'eligible patients', speaking: false, suspect: true }));
    check('typed words never wait', !waitsForCheck({ text: tv, typed: true, speaking: true, suspect: true }));
    for (const said of ['Stop.', 'wait', 'Hold on', 'Sorry, can you say that again?', 'Could you repeat that please', 'excuse me', 'I didn\'t catch that', 'slow down', 'yes', 'Yeah, okay.', 'no', 'I don\'t know', 'Go on']) check(`"${said}" is the student's without being asked about`, plainlyTheStudent(said) && !waitsForCheck({ text: said, speaking: true, suspect: true }), said);
    for (const said of ['eligible patients', 'the urine sinks a bit before.', 'Here comes the big guy with the big deal', 'Call your prescribers', 'no purchase necessary see stores for details today', tv]) check(`"${said.slice(0, 30)}" is not taken on trust`, !plainlyTheStudent(said), said);
    check('a stretch is judged early at five words', !partialIsJudged('increase inflammation and gallbladder', false) && partialIsJudged('increase inflammation and gallbladder severe', false));
    check('and at three in a noisy room', partialIsJudged('here comes the', true) && !partialIsJudged('here comes', true));
    check('a reply that opens with BACKGROUND is another voice, with or without a reason after it', repliedBackground('BACKGROUND') && repliedBackground(' Background.') && repliedBackground('BACKGROUND\n\nThis is clearly a pharmaceutical') && !repliedBackground('STUDENT') && !repliedBackground('') && !repliedBackground('It might be BACKGROUND or STUDENT'));
    const m = roomCheckMessage({ tutorSaid: 'What do you make of Kelly?', heard: tv, earlier: ['a', 'b', 'c'] });
    check('the check is given what the tutor said, what was heard and the last two left out', /What do you make of Kelly\?/.test(m) && m.includes(tv) && /- b\n- c/.test(m) && !/- a\n/.test(m), m);
    const voiceS: V2Session = { subject: 'math', level: 'Grade 8', mode: 'voice' };
    const told = renderFacts(voiceS, newV2State(1_000_000), { nowMs: 1_060_000, roomVoices: ROOM_NOISY_AFTER });
    check('the tutor is told of the other voices, and to say so once', told.includes(roomVoicesFact(ROOM_NOISY_AFTER)) && /headphones or a quieter place/.test(told));
    check('not otherwise', !/other voices/.test(renderFacts(voiceS, newV2State(1_000_000), { nowMs: 1_060_000 })));
    // The student's words out of a mixed stretch (local test, embed-1795054401972).
    const run = 'tonight exclusive here in China I think students should write the first draft themselves how advanced the trifold phones';
    check('the student\'s words are taken out of a mixed stretch', studentWordsIn('I think students should write the first draft themselves', run) === 'I think students should write the first draft themselves');
    check('ALL hands the stretch back whole', studentWordsIn('ALL', run) === run && studentWordsIn(' all. ', run) === run);
    check('NONE finds nothing', studentWordsIn('NONE', run) === null && studentWordsIn('None.', run) === null);
    check('words that are not in the stretch are not trusted: the stretch goes whole', studentWordsIn('The student believes drafting matters for learning', run) === run);
    check('nearly all of it kept is all of it', studentWordsIn(run.split(' ').slice(1).join(' '), run) === run);
    check('an empty reply is the student', studentWordsIn('', run) === run);
    check('read as the student\'s: the words picked out, or all of it', studentPart(false, 'I think so', run) === 'I think so' && studentPart(false, null, run) === run);
    check('read as another voice: only words picked out from among the rest', studentPart(true, 'I think so', run) === 'I think so' && studentPart(true, null, run) === null && studentPart(true, run, run) === null);
    check('words already taken are skipped', afterWords('a b c d e', 3) === 'd e' && afterWords('a b', 5) === '' && afterWords(' a b ', 0) === 'a b');
    check('the same words, whatever the punctuation', sameWords('I think so.', 'i think so') && !sameWords('I think so', 'I think so too'));
    check('a turn taken to speak of the other voices is not called a silence', !/has said nothing for/.test(renderFacts(voiceS, newV2State(1_000_000), { nowMs: 1_060_000, roomVoices: 2, silenceSeconds: 6 })) && /turn their microphone off with the mic button/.test(told));
    check('and its opening line says why the tutor has the floor', /other voices in their room/.test(v2StudentBlock(null, { ...newV2State(0), history: [{ role: 'user', content: 'x' }] } as never, 6, undefined, undefined, undefined, 2)) && v2StudentBlock('hello', newV2State(0), undefined, undefined, undefined, undefined, 2) === 'hello');
    check('never in a typed session', !/other voices/.test(renderFacts({ ...voiceS, mode: 'text' }, newV2State(1_000_000), { nowMs: 1_060_000, roomVoices: 2 })));
    const body = { n: 0 as unknown };
    await streamV2Turn({ session: voiceS, state: newV2State(1), studentSaid: 'hi', roomVoices: 2, fetchImpl: (async (_u: unknown, init?: { body?: string }) => { body.n = JSON.parse(init?.body ?? '{}').roomVoices; throw new Error('stop'); }) as unknown as typeof fetch }).catch(() => undefined);
    check('the count travels with the turn', body.n === 2, body.n);
    const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
    check('the endpoint reads it', /body\.roomVoices/.test(fs.readFileSync(path.join(__dirname, '../src/app/api/tutor/brain-v2/turn/route.ts'), 'utf8')));
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main();
