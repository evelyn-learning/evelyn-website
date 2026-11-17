/// <reference types="node" />
// Task 7g: run with NEXT_PUBLIC_TUTOR_V2_CARD_EVERY_SENTENCE=off (package.json): it pins the Task 7b facts line (one card at
// most); scripts/test-brain-v2-mic2-7g.ts covers the switch on (every sentence listed, the rest owed) and off.
/**
 * Tutor brain v2 — the learner's sentence on the board as it should be (Task 7b, v2/learner-card.ts, BOARD_LEARNER_SENTENCE).
 *   npm run test:brain-v2-learner-card
 *
 * Replies and learner lines are taken from mic test 1 (embed-1794882458629), names of people and firms replaced. No network,
 * no model.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { spawnSync } from 'node:child_process';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { TUTOR_V2_BOARD_LEARNER_SENTENCE } from '../src/lib/tutor/orchestrator/flags';
import { boardBlocksIn, stripBoardBlocks } from '../src/lib/tutor/v2/board-inline';
import { applyToModelBoard } from '../src/lib/tutor/v2/board';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { LearnerCardWatch, v2LearnerCardIn, v2LearnerCardsOn, v2LearnerSentence, v2LearnerSentenceFacts, v2SentenceOnBoard, v2SentenceWords } from '../src/lib/tutor/v2/learner-card';
import { runV2Turn, type V2ModelCall, type V2ToolCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
/** The reply streamed in small pieces, as the model streams it: a quote and its sentence end arrive in different deltas. */
function stub(text: string, piece = 7) {
  const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
  const call: V2ModelCall = async (params, onText) => { seen.push(structuredClone(params)); for (let i = 0; i < text.length; i += piece) onText?.(text.slice(i, i + piece)); return msg([{ type: 'text', text }], 'end_turn'); };
  return { call, seen };
}

const PLAN = {
  id: 'test.language.work.v1', title: 'Talking about your work', curriculum: 'test', grade: 'Adult', subject: 'languages', schemaVersion: 1, estimatedMinutes: 20,
  los: [{ id: 'lo.pp', description: 'Talk about experience with the present perfect.' }],
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2 },
    { id: 'pp', kind: 'try_yourself', problem: 'Tell me how long you have worked at your company.', responseFormat: 'free', estimatedMinutes: 8 },
  ],
} as unknown as LessonPlan;
const spoken: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, plan: PLAN, languages: ['en', 'ja'] };

// Mic test 1, 6.63: the correction only spoken.
const SAID_YEARS = 'Um, I work at Acme Corp for uh 5 year.';
const REPLY_YEARS = 'Good, five years is a useful answer. Because you started in the past and still work there now, we say "I have worked at Acme Corp for five years." Can you say it once more?';
// 10.84: right first time, praised without a quote.
const SAID_EXPO = 'Last year I went to uh Robotics Expo in Beijing.';
const REPLY_EXPO_UNQUOTED = 'Yes, "I went" is the past simple, and "last year" makes it a finished event. That\'s right. Now let\'s talk about a project.';
const REPLY_EXPO_QUOTED = 'That\'s right: "Last year I went to Robotics Expo in Beijing." Now let\'s talk about a project. What is one project you are proud of?';

type Run = { r: Awaited<ReturnType<typeof runV2Turn>>; calls: V2ToolCall[]; events: string[]; said: string; seen: Anthropic.MessageCreateParamsNonStreaming[] };
/** A state whose last tutor reply asked them for a sentence (the facts line runs only after such an ask, fix round 1 M3). */
function asked(text = 'How long have you worked at your company? Tell me in one sentence.'): V2State {
  const st = newV2State(1);
  st.history = [{ role: 'user', content: [{ type: 'text', text: '[the session begins]' }] }, { role: 'assistant', content: [{ type: 'text', text }] }];
  return st;
}
async function run(session: V2Session, said: string | null, reply: string, state: V2State = asked()): Promise<Run> {
  const s = stub(reply); const calls: V2ToolCall[] = []; const events: string[] = []; let text = '';
  const r = await runV2Turn({ session, state, studentSaid: said, callModel: s.call, boardPass: false, mathsCheck: false, nowMs: 60000,
    onText: (t) => { text += t; events.push(`text:${t}`); }, onToolCall: (c) => { calls.push(c); events.push(`tool:${c.name}`); } });
  return { r, calls, events, said: text, seen: s.seen };
}
const cards = (x: Run) => x.calls.filter((c) => c.name === 'show_sentence' && !/^not /.test(c.outcome));
const storedText = (x: Run) => { const h = x.r.state.history.filter((m) => m.role === 'assistant').pop(); return !h ? '' : typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(''); };
const factsOf = (x: Run) => { const u = x.seen[0]!.messages[x.seen[0]!.messages.length - 1]!; return Array.isArray(u.content) ? u.content.map((c) => (c.type === 'text' ? c.text : '')).join('\n') : String(u.content); };

async function offChild() {
  const a = await run(spoken, SAID_YEARS, REPLY_YEARS);
  console.log(`OFF_JSON ${JSON.stringify({ flag: TUTOR_V2_BOARD_LEARNER_SENTENCE, cards: cards(a).length, fact: /a sentence of theirs/.test(factsOf(a)), stored: storedText(a) === REPLY_YEARS })}`);
}

async function main() {
  if (process.env.LEARNER_CARD_OFF_CHILD === '1') { await offChild(); return; }

  console.log('the learner\'s words as a sentence');
  check('fillers out, the stutter out, a capital and a full stop', v2LearnerSentence('Um, I I work at Acme Corp for uh 5 year') === 'I work at Acme Corp for 5 year.', v2LearnerSentence('Um, I I work at Acme Corp for uh 5 year'));
  check('a yes is not a sentence ("Uh, yes, we move on.", "Yes, makes sense.")', v2LearnerSentence('Uh, yes, we move on.') === null && v2LearnerSentence('Yes, makes sense.') === null);
  check('short answers and a sorry are not ("This is clear.", "Sorry, I didn\'t understand.")', v2LearnerSentence('This is clear.') === null && v2LearnerSentence("Sorry, I didn't understand.") === null);
  check('a question is not', v2LearnerSentence('Can I say it with have worked?') === null);
  check('a yes at the head is set aside', v2LearnerSentence('Yes, I have worked with Canadian customers.') === 'I have worked with Canadian customers.');

  console.log('which quote is carded (and the abstentions)');
  const c1 = v2LearnerCardIn('Because you started in the past and still work there now, we say "I have worked at Acme Corp for five years."', SAID_YEARS);
  check('a correction given with "we say": the corrected form, the changed words stressed ("five" for "5" is no change)', c1?.sentence === 'I have worked at Acme Corp for five years.' && JSON.stringify(c1.stress) === '["have","worked","years"]', c1);
  const c2 = v2LearnerCardIn('A more natural way to say it is "I haven\'t worked on any other social projects since then."', 'Um, I have worked on no other social project since then.');
  check('"a more natural way to say it is": carded, stress on what changed', c2?.sentence === "I haven't worked on any other social projects since then." && JSON.stringify(c2.stress) === '["haven\'t","any","projects"]', c2);
  check('"Please say it with "collected": …" is an ask, not a correction lead-in: none (the facts line asks for it)', v2LearnerCardIn('Please say it with "collected": "I collected money from my office colleagues online."', 'I collect money from my office colleague online.') === null);
  const e1 = v2LearnerCardIn('"I worked on a project to donate money for climate change" is a clear sentence.', 'I worked on a project to uh donate money for climate change.');
  check('their sentence quoted and praised in the same sentence: carded as said, no stress', e1?.sentence === 'I worked on a project to donate money for climate change.' && e1.stress.length === 0, e1);
  check('right first time with no quote: no runtime card (the facts line asks for it)', v2LearnerCardIn('That\'s right.', SAID_EXPO) === null && v2LearnerCardIn('Yes, "I went" is the past simple, and "last year" makes it a finished event.', SAID_EXPO) === null);
  check('quoted words, not a sentence ("washing machines"): none', v2LearnerCardIn('One last change: we say "washing machines" and "international customers" in the plural.', 'I am responsible for selling washing machine to international customer.') === null);
  check('their mistake quoted after "you said": none', v2LearnerCardIn('You said "I collect money from my office colleague online."', 'I collect money from my office colleague online.') === null);
  check('a near-echo of the mistake after "you said" (5 for five): none', v2LearnerCardIn('You said "I work at Acme Corp for five year."', SAID_YEARS) === null);
  check('a quote taken back after it ("… is not right"): none; the form given after it is carded', v2LearnerCardIn('"I goed to Beijing last year" is not right.', 'I goed to Beijing last year.') === null
    && v2LearnerCardIn('"I goed to Beijing last year" is not right; we say "I went to Beijing last year."', 'I goed to Beijing last year.')?.sentence === 'I went to Beijing last year.');
  check('their words quoted with no praise (a question back): none', v2LearnerCardIn('Did you mean "I worked on a project to donate money"?', 'I worked on a project to donate money.') === null);
  check('praise held back ("almost"): none', v2LearnerCardIn('Almost right: "I worked on a project to donate money."', 'I worked on a project to donate money.') === null);
  check('a model sentence of the tutor\'s own, not built on their words: none', v2LearnerCardIn('We say "I sold twenty-five washing machines last month."', 'I have worked with Canadian customers.') === null);
  check('a correction with no lead-in that gives it ("Did you want …"): none', v2LearnerCardIn('Did you want "I have worked at Acme Corp for five years."?', SAID_YEARS) === null);
  check('a quote with a gap or "…": none', v2LearnerCardIn('Try starting with "I worked on a project to…"', 'I worked on a project.') === null);
  check('no words from them: none', v2LearnerCardIn(REPLY_YEARS, null) === null);

  console.log('fix round 1: review probes (I1, I3)');
  {
    const RIGHT = 'I have worked at Acme Corp for five years.';
    const WRONG = 'I work at Acme Corp for five year.';
    check('I3: "Great. Now try "…"" after a right sentence: none (the tutor\'s next model, not their correction)', v2LearnerCardIn('Great. Now try "I have worked at Acme Corp since 2020."', RIGHT) === null);
    check('I3: "Now say it with "since": "…"": none', v2LearnerCardIn('Perfect. Now say it with "since": "I have worked at Acme Corp since 2020."', RIGHT) === null);
    check('I3: "we say "…"" after the reply called their sentence right: none', v2LearnerCardIn('We say "I have worked at Acme Corp since 2020."', RIGHT, { afterRight: true }) === null);
    check('I3: their words kept whole with more added, after the reply called them right: none', v2LearnerCardIn('We say "I went to Beijing with my team last year."', 'I went to Beijing with my team.', { afterRight: true }) === null);
    // Fix round 2 ruling: under an explicit correction lead-in, any change is a correction (an article, a plural added).
    const art = v2LearnerCardIn('We say "I went to the Robotics Expo in Beijing."', 'I went to Robotics Expo in Beijing.');
    check('ruling: an article added under "we say": carded, the article stressed', art?.kind === 'correction' && JSON.stringify(art.stress) === '["the"]', art);
    const plural = v2LearnerCardIn('The correct sentence is "I have worked at Acme Corp for five years."', 'I have worked at Acme Corp for five year.');
    check('ruling: a plural added under "the correct sentence is": carded, the plural stressed', plural?.kind === 'correction' && JSON.stringify(plural.stress) === '["years"]', plural);
    check('I3: "you could say "…"" (an alternative, not a correction): none', v2LearnerCardIn('You could say "I have been at Acme Corp for five years."', WRONG) === null);
    check('I1: "Your pronunciation of "…" was good.": none', v2LearnerCardIn('Your pronunciation of "I work at Acme Corp for five year" was good.', WRONG) === null);
    check('I1: "You used the past correctly in "…", well done for trying.": none', v2LearnerCardIn('You used the past correctly in "I goed to Beijing last year with my boss", well done for trying.', 'I goed to Beijing last year with my boss.') === null);
    check('I1: "Exactly, "…" uses work; we need have worked.": none', v2LearnerCardIn('Exactly, "I work at Acme Corp for five year" uses work; we need have worked.', WRONG) === null);
    check('I1: "That\'s right: "…", but …": none', v2LearnerCardIn('That\'s right: "I work at Acme Corp for five year", but we add have.', WRONG) === null);
    check('I1: "You sound clear: "…"": none (how it sounded)', v2LearnerCardIn('You sound clear: "I work at Acme Corp for five year."', WRONG) === null);
    check('I1: their words quoted with praise elsewhere in the sentence, no verdict framing it: none', v2LearnerCardIn('Well, "I have worked at Acme Corp for five years" has a nice rhythm, great work.', RIGHT) === null);
    check('the probe\'s other shapes still abstain: a 「」 quote with no lead-in, an "it is" mistake, a question, an A-or-B', v2LearnerCardIn('「I have worked at Acme Corp for five years.」です。', WRONG) === null
      && v2LearnerCardIn('The verb in it is "I work at Acme Corp for five year" so change it.', WRONG) === null
      && v2LearnerCardIn('Is "I have worked at Acme Corp for five years" correct?', RIGHT) === null
      && v2LearnerCardIn('Which is right: "I work at Acme Corp for five years" or "I have worked at Acme Corp for five years"?', WRONG) === null);
    check('Japanese lead-in after the quote: 「…」と言います is a correction', v2LearnerCardIn('「I have worked at Acme Corp for five years.」と言います。', WRONG)?.sentence === 'I have worked at Acme Corp for five years.');
    check('an example before the real correction: the correction is carded', v2LearnerCardIn('For example "I have lived in Tokyo for five years." So we say "I have worked at Acme Corp for five years."', WRONG)?.sentence === 'I have worked at Acme Corp for five years.');
    check('"the correct sentence is" and "it should be" are correction lead-ins', v2LearnerCardIn('The correct sentence is "I have worked at Acme Corp for five years."', WRONG)?.kind === 'correction' && v2LearnerCardIn('It should be "I have worked at Acme Corp for five years."', WRONG)?.kind === 'correction');
    const w = new LearnerCardWatch(RIGHT, () => false);
    const parts = [...w.feed([{ text: 'Perfect. We say "I have worked at Acme Corp since 2020." Now you.' }]), ...w.end()];
    check('I3 in the stream: a "we say" after "Perfect." in the same reply: none', parts.every((p) => !('block' in p)), parts);
  }

  console.log('fix round 2: an acknowledgement is no verdict, and the next sentence is read (N1); quote marks pair (N2); numbers stress whole (N3)');
  {
    const WRONG = 'I work at Acme Corp for five year.';
    for (const reply of ['Yes, "I work at Acme Corp for five year." Almost there: we need have worked.', 'Great, "I work at Acme Corp for five year." Let\'s fix one thing.', 'Good: "I work at Acme Corp for five year." Now one change.']) {
      const a = await run(spoken, WRONG, reply);
      check(`no card, nothing among their corrected sentences: ${reply}`, cards(a).length === 0 && !(a.r.state.correctedSentences ?? []).length && !/<board sentence/.test(storedText(a)) && storedText(a).startsWith(reply), { calls: a.calls, stored: storedText(a) });
    }
    check('"Yes,", "Good:", "Great," before their words are no verdict', ['Yes, "I work at Acme Corp for five year."', 'Good: "I work at Acme Corp for five year."', 'Great, "I work at Acme Corp for five year."'].every((x) => v2LearnerCardIn(x, WRONG) === null));
    const SAID_RIGHT = 'I have worked at Acme Corp for five years.';
    const held = await run(spoken, SAID_RIGHT, 'That\'s right: "I have worked at Acme Corp for five years." Almost perfect, but say "for" more clearly.');
    check('"That\'s right: "…"" then a sentence that holds back: dropped', cards(held).length === 0, held.calls);
    const ok = 'That\'s right: "I have worked at Acme Corp for five years." Now tell me about a project.';
    const b = await run(spoken, SAID_RIGHT, ok);
    check('"That\'s right: "…"" then the lesson goes on: carded; stored right after the quote\'s own sentence (N5)', cards(b).length === 1 && storedText(b) === 'That\'s right: "I have worked at Acme Corp for five years." <board sentence>I have worked at Acme Corp for five years.</board> Now tell me about a project.', storedText(b));
    // Fix round 3 (N5): painted after the next sentence (the N1 check), but stored after the quote: never after the ask in
    // the history the model reads (the shape Task 6e forbids).
    const ask = 'That\'s right: "I have worked at Acme Corp for five years." What else did you do last year?';
    const c = await run(spoken, SAID_RIGHT, ask);
    const stored = storedText(c);
    check('N5: stored before the ask "What else…?", never after it', cards(c).length === 1 && stored.indexOf('<board sentence>') >= 0 && stored.indexOf('<board sentence>') < stored.indexOf('What else') && !/\?\s*<board sentence/.test(stored), stored);
    check('N5: the stored words read as the reply', stripBoardBlocks(stored).startsWith(ask), stored);
    // Fix round 3: the model's own card of the same sentence after the next sentence still wins.
    const late = 'That\'s right: "I have worked at Acme Corp for five years." Well done. <board sentence gloss="現在完了">I have worked at Acme Corp for five years.</board> Now tell me about a project.';
    const d = await run(spoken, SAID_RIGHT, late);
    const ds = d.calls.filter((x) => x.name === 'show_sentence');
    check('the model\'s card after the next sentence: one card, the model\'s with its gloss; the stored reply is the model\'s', ds.length === 1 && ds[0]!.args.gloss === '現在完了' && boardBlocksIn(storedText(d)).filter((x) => x.kind === 'sentence').length === 1 && storedText(d).startsWith(late), { ds, stored: storedText(d) });
    // N6: a Japanese sentence end has no space after it; the stored card is set off by one.
    const ja = '「I have worked at Acme Corp for five years.」と言います。もう一度言ってください。';
    const e = await run(spoken, 'I work at Acme Corp for five year.', ja);
    check('N6: after 。 the stored card has a space on both sides', cards(e).length === 1 && storedText(e).startsWith('「I have worked at Acme Corp for five years.」と言います。 <board sentence stress="have | worked | years">I have worked at Acme Corp for five years.</board> もう一度言ってください。'), storedText(e));
    check('…and the words heard are the model\'s', b.said.replace(/\s+/g, ' ').trim() === ok, b.said);
    const w = new LearnerCardWatch(SAID_RIGHT, () => false);
    const p1 = w.feed([{ text: 'Correct: "I have worked at Acme Corp for five years." Now tell me ' }]);
    check('the as-said card waits; the words do not (all of them out, no card yet)', p1.every((p) => !('block' in p)) && p1.map((p) => ('text' in p ? p.text : '')).join('') === 'Correct: "I have worked at Acme Corp for five years." Now tell me ', p1);
    const p2 = [...w.feed([{ text: 'about a project.' }]), ...w.end()];
    check('…written once the next sentence ends without a correction', p2.some((p) => 'block' in p), p2);
    check('N2: "…」 is no quote', v2LearnerCardIn('We say "I have worked at Acme Corp for five years.」', WRONG) === null);
    const num = v2LearnerCardIn('We say "I sold twenty-five machines last month."', 'I sell 25 machine last month.');
    check('N3: "twenty-five" against their "25" is not stressed', JSON.stringify(num?.stress) === '["sold","machines"]', num);
    const num2 = v2LearnerCardIn('We say "I sold twenty five machines last month."', 'I sell 25 machine last month.');
    check('N3: "twenty five" (spaced) is not stressed either', JSON.stringify(num2?.stress) === '["sold","machines"]', num2);
  }

  console.log('fix round 1: numbers alike (M5) and the facts line only after an ask (M3)');
  {
    check('"5 year" and "five year", "25" and "twenty-five" are one key', v2SentenceWords('I sold twenty-five machines for five years.').join(' ') === v2SentenceWords('I sold 25 machines for 5 years.').join(' '));
    const st = newV2State(1); applyToModelBoard(st.board, 'c', 'show_sentence', { sentence: 'I sold twenty-five washing machines last month.' });
    check('a card in words: the same sentence in digits is up already', v2SentenceOnBoard(st.board, 'I sold 25 washing machines last month.'));
    check('no line when the last reply asked for no sentence (small talk, a statement)', v2LearnerSentenceFacts(spoken, asked('Nice to meet you. I am your tutor today.'), SAID_YEARS).length === 0);
    check('no line with no reply before', v2LearnerSentenceFacts(spoken, newV2State(1), SAID_YEARS).length === 0);
    check('a line after a practice ask, a request for a sentence, or a question about them', v2LearnerSentenceFacts(spoken, asked('Please say the sentence again.'), SAID_YEARS).length === 1
      && v2LearnerSentenceFacts(spoken, asked('Answer with one sentence that starts with "Last year, I…"'), SAID_EXPO).length === 1
      && v2LearnerSentenceFacts(spoken, asked('Good. What did you do last year?'), SAID_EXPO).length === 1);
    check('it says one card at most and none for small talk', /One card in this reply at most; none of their mistake, none for small talk/.test(v2LearnerSentenceFacts(spoken, asked(), SAID_YEARS)[0] ?? ''));
  }

  console.log('the board check (same-sentence de-dup)');
  {
    const st = newV2State(1); applyToModelBoard(st.board, 'p', 'new_page', { title: 'Your job' });
    applyToModelBoard(st.board, 'c', 'show_sentence', { sentence: 'I have worked at Acme Corp for five years.' });
    applyToModelBoard(st.board, 'n', 'annotate', { text: 'Example: I sold 25 washing machines last month.' });
    check('a card of it on the board: up', v2SentenceOnBoard(st.board, 'I have worked at Acme Corp for five years.'));
    check('its words in a note on the page in view: up', v2SentenceOnBoard(st.board, 'I sold 25 washing machines last month.'));
    check('among their corrected sentences: up', v2SentenceOnBoard(newV2State(1).board, 'I went to Beijing.', ['I went to Beijing.']));
    check('another sentence: not up', !v2SentenceOnBoard(st.board, 'I went to Beijing last year.'));
  }

  console.log('a correction not boarded: the card is added where the quote stands (6.63)');
  {
    const a = await run(spoken, SAID_YEARS, REPLY_YEARS);
    const cs = cards(a);
    check('one card, the corrected sentence, its changed words stressed, no gloss', cs.length === 1 && cs[0]!.args.sentence === 'I have worked at Acme Corp for five years.' && JSON.stringify(cs[0]!.args.emphasis) === '["have","worked","years"]' && cs[0]!.args.gloss === undefined, cs);
    check('painted inline, on the page in view', cs[0]?.inline === true && a.r.state.board.pages[a.r.state.board.current]!.items.some((it) => it.tool === 'show_sentence'), cs[0]);
    const ti = a.events.findIndex((e) => e === 'tool:show_sentence');
    const before = a.events.slice(0, ti).filter((e) => e.startsWith('text:')).map((e) => e.slice(5)).join('');
    check('it comes after the quote\'s sentence and before the ask (never appended after it)', /five years\."\s*$/.test(before) && !/once more/.test(before), before);
    check('never spoken twice: the words heard are the model\'s words exactly', a.said.replace(/\s+/g, ' ').trim() === REPLY_YEARS, a.said);
    const stored = storedText(a);
    check('stored where it stood: after the quote\'s sentence, before the ask', /five years\." <board sentence stress="have \| worked \| years">I have worked at Acme Corp for five years\.<\/board> Can you say it once more\?$/.test(stored), stored);
    check('the stored words read as before', stripBoardBlocks(stored) === REPLY_YEARS);
    check('recorded among their corrected sentences (the summary\'s cards)', (a.r.state.correctedSentences ?? []).includes('I have worked at Acme Corp for five years.'), a.r.state.correctedSentences);
    check('the learner-sentence fact was in this turn\'s facts', /their words just now answered your ask with a sentence of theirs: .*Japanese gloss/.test(factsOf(a)), factsOf(a));
  }

  console.log('right first time');
  {
    const a = await run(spoken, SAID_EXPO, REPLY_EXPO_QUOTED);
    const cs = cards(a);
    check('quoted and praised: carded as said, no stress', cs.length === 1 && cs[0]!.args.sentence === 'Last year I went to Robotics Expo in Beijing.' && cs[0]!.args.emphasis === undefined, cs);
    check('the card is not read aloud again', a.said.replace(/\s+/g, ' ').trim() === REPLY_EXPO_QUOTED, a.said);
    const b = await run(spoken, SAID_EXPO, REPLY_EXPO_UNQUOTED);
    check('praised without a quote: no runtime card (a "That\'s right." may not cover the whole sentence)', cards(b).length === 0, b.calls);
    check('…and the facts asked for it: the sentence as said when right, the corrected form when corrected', /their words just now answered your ask with a sentence of theirs: .*as they said it \(without fillers\) when it is right/.test(factsOf(b)), factsOf(b));
  }

  console.log('the level check: none while it runs');
  {
    const lc: V2Session = { ...spoken, levelCheck: true };
    const st = asked();
    check('rule off while the level is not set and the check not over', !v2LearnerCardsOn(lc, st, SAID_YEARS));
    const a = await run(lc, SAID_YEARS, REPLY_YEARS, st);
    check('no card and no facts line in a level-check reply', cards(a).length === 0 && !/a sentence of theirs/.test(factsOf(a)), { calls: a.calls, facts: factsOf(a) });
    const set: V2State = { ...newV2State(1), workingLevel: { level: 'intermediate', from: 'this_lesson' } } as V2State;
    check('once the level is set, the rule runs', v2LearnerCardsOn(lc, set, SAID_YEARS));
  }

  console.log('a repeat of a sentence already boarded: no second card');
  {
    const st = asked(); applyToModelBoard(st.board, 'p', 'new_page', { title: 'Your job' });
    applyToModelBoard(st.board, 'c', 'show_sentence', { sentence: 'I collected money from my office colleagues online.' });
    const a = await run(spoken, 'I collected money from my office colleagues online.', 'Yes, that\'s right: "I collected money from my office colleagues online." Now, have you worked on any other projects?', st);
    check('no card painted, and no facts line asking for one', cards(a).length === 0 && a.calls.every((c) => c.name !== 'show_sentence') && !/a sentence of theirs/.test(factsOf(a)), { calls: a.calls });
    check('the board still holds the one card', a.r.state.board.pages.flatMap((p) => p.items).filter((it) => it.tool === 'show_sentence').length === 1);
  }

  console.log('a reply that already has the card: untouched');
  {
    const own = 'Good. We say <board sentence stress="have | worked" gloss="現在完了">I have worked at Acme Corp for five years.</board> "I have worked at Acme Corp for five years." Say it once more.';
    const a = await run(spoken, SAID_YEARS, own);
    const cs = a.calls.filter((c) => c.name === 'show_sentence');
    check('one card, the model\'s, with its gloss', cs.length === 1 && cs[0]!.args.gloss === '現在完了', cs);
    check('the stored reply is the model\'s, byte for byte', storedText(a) === own, storedText(a));
  }

  console.log('fix round 1 (I2): the model\'s card right after the quote wins');
  {
    const after = 'Good. We say "I have worked at Acme Corp for five years." <board sentence stress="have | worked" gloss="現在完了">I have worked at Acme Corp for five years.</board> Say it once more.';
    const a = await run(spoken, SAID_YEARS, after);
    const cs = a.calls.filter((c) => c.name === 'show_sentence');
    check('one card painted, the model\'s, with its gloss', cs.length === 1 && cs[0]!.args.gloss === '現在完了' && !/^not /.test(cs[0]!.outcome), cs);
    check('the stored reply is the model\'s, byte for byte (one sentence block)', storedText(a) === after && boardBlocksIn(storedText(a)).filter((b) => b.kind === 'sentence').length === 1, storedText(a));
    check('the words heard are the model\'s words', a.said.replace(/\s+/g, ' ').trim() === stripBoardBlocks(after), a.said);
    const other = 'We say "I have worked at Acme Corp for five years." <board note>Present perfect: have + past participle</board> Say it once more.';
    const b = await run(spoken, SAID_YEARS, other);
    const order = b.calls.map((c) => c.name);
    check('another block after the quote: the runtime card goes out first, where the quote stood', order.indexOf('show_sentence') >= 0 && order.indexOf('show_sentence') < order.indexOf('annotate'), order);
    check('…stored before that block', /five years\." <board sentence[^>]*>I have worked at Acme Corp for five years\.<\/board> <board note>/.test(storedText(b)), storedText(b));
    // The card waits; the words never do: every word up to the quote's end is out before the card is decided, and the words
    // after it go out in the same part the card goes before.
    const w = new LearnerCardWatch(SAID_YEARS, () => false);
    const p1 = w.feed([{ text: 'We say "I have worked at Acme Corp for five years." ' }]);
    check('the quote\'s sentence goes out at once, the card waits (no words held)', p1.map((p) => ('text' in p ? p.text : '')).join('') === 'We say "I have worked at Acme Corp for five years." ' && p1.every((p) => !('block' in p)), p1);
    const p2 = w.feed([{ text: 'Say it once more.' }]);
    check('the next words: the card goes before them, and they go out in the same call', p2.length === 2 && 'block' in p2[0]! && 'text' in p2[1]! && p2[1].text === 'Say it once more.', p2);
  }

  console.log('fix round 1 (M1): the card is always in the stored text where it was painted');
  {
    const across = 'We say <board note>have + past participle</board> "I have worked at Acme Corp for five years." Say it once more.';
    const a = await run(spoken, SAID_YEARS, across);
    check('a quote whose lead-in is across a model block: not carded (the sentence is read within one run of words)', cards(a).length === 0 && storedText(a) === across, { calls: a.calls, stored: storedText(a) });
    const afterNote = 'Good. <board note>have + past participle</board> We say "I have worked at Acme Corp for five years." Say it once more.';
    const b = await run(spoken, SAID_YEARS, afterNote);
    check('a quote after a model block: carded', cards(b).length === 1, b.calls);
    check('…stored right after its sentence, after the note, before the ask', storedText(b) === 'Good. <board note>have + past participle</board> We say "I have worked at Acme Corp for five years." <board sentence stress="have | worked | years">I have worked at Acme Corp for five years.</board> Say it once more.', storedText(b));
    const order = b.calls.map((c) => c.name);
    check('…painted after the note', order.indexOf('annotate') >= 0 && order.indexOf('annotate') < order.indexOf('show_sentence'), order);
  }

  console.log('one card a reply');
  {
    const two = 'We say "I have worked at Acme Corp for five years." You could also say "I have worked at Acme Corp since 2020." Say the first one again.';
    const a = await run(spoken, SAID_YEARS, two);
    check('only the first quote is carded', cards(a).length === 1 && cards(a)[0]!.args.sentence === 'I have worked at Acme Corp for five years.', cards(a));
  }

  console.log('the watch on its own (a quote split across deltas, the last sentence at the end of the words)');
  {
    const w = new LearnerCardWatch(SAID_YEARS, () => false);
    const parts = [...w.feed([{ text: 'Close. We say "I have wor' }]), ...w.feed([{ text: 'ked at Acme Corp for five years."' }]), ...w.end()];
    check('the card follows the words, at their end', parts.length === 3 && 'block' in parts[2]! && parts[2].block.kind === 'sentence', parts);
    const w2 = new LearnerCardWatch(SAID_YEARS, () => false);
    const p2 = [...w2.feed([{ block: boardBlocksIn('<board sentence>I work here.</board>')[0]! }, { text: 'We say "I have worked at Acme Corp for five years." Again?' }]), ...w2.end()];
    check('after a card of the model\'s in the reply: none', p2.filter((p) => 'block' in p).length === 1, p2);
  }

  console.log('other sessions unchanged');
  {
    const english: V2Session = { ...spoken, languages: undefined };
    const typed: V2Session = { ...spoken, mode: 'text' };
    const maths: V2Session = { ...spoken, subject: 'Maths', languages: undefined };
    const homework: V2Session = { ...spoken, homework: { text: 'Translate: I have worked here for five years.', verified: false, hasFigure: false } };
    for (const [name, sess] of [['a one-language spoken lesson', english], ['a typed bilingual lesson', typed], ['a maths voice lesson', maths], ['homework', homework]] as const) {
      const a = await run(sess, SAID_YEARS, REPLY_YEARS);
      check(`${name}: no runtime card, no facts line, the stored reply as written`, cards(a).length === 0 && !/a sentence of theirs/.test(factsOf(a)) && storedText(a) === REPLY_YEARS, { calls: a.calls.map((c) => c.name) });
    }
    check('renderFacts off: no line', !/a sentence of theirs/.test(renderFacts(spoken, newV2State(1), { nowMs: 60000, heard: SAID_YEARS, learnerCards: false })));
    check('renderFacts on: the line', /a sentence of theirs/.test(renderFacts(spoken, asked(), { nowMs: 60000, heard: SAID_YEARS })));
    check('the facts line names no tenant or learner', !/gdi|nagoya|praveen|ryota|ken\b/i.test(v2LearnerSentenceFacts(spoken, asked(), SAID_YEARS).join(' ')) && v2LearnerSentenceFacts(spoken, asked(), SAID_YEARS).length === 1);
  }

  console.log('the flag off (a fresh process with NEXT_PUBLIC_TUTOR_V2_BOARD_LEARNER_SENTENCE=off)');
  {
    check('flag on by default', TUTOR_V2_BOARD_LEARNER_SENTENCE === true);
    const r = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, NEXT_PUBLIC_TUTOR_V2_BOARD_LEARNER_SENTENCE: 'off', LEARNER_CARD_OFF_CHILD: '1' }, encoding: 'utf8' });
    const line = (r.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    const off = line ? JSON.parse(line.slice('OFF_JSON '.length)) as { flag: boolean; cards: number; fact: boolean; stored: boolean } : null;
    check('off: no runtime card, no facts line, the reply stored as written (behaviour before)', !!off && off.flag === false && off.cards === 0 && !off.fact && off.stored, { off, err: r.stderr?.slice(0, 400) });
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
