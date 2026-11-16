/// <reference types="node" />
/**
 * Tutor brain v2 — sentence cards for language lessons (v2/sentence-cards.ts): the inline `<board sentence>` kind and
 * its card (board-inline.ts → show_sentence → the whiteboard's showSentence), its gate (a second teaching language,
 * the TUTOR_V2_SENTENCE_CARDS kill switch), the corrected sentences recorded and listed in the facts for the summary,
 * the route's reading of them, and the session PDF drawing the card with its Japanese gloss (NotoSansJP embedded).
 *   npm run test:brain-v2-sentence-cards
 *
 * Learner lines are paraphrased from the v1 live sessions (docs/superpowers/plans/2026-11-15-gdi-v1-live-sessions-findings.md).
 * No network, no model.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { mkdtempSync, readFileSync, readdirSync, rmSync, copyFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { V2_CONSTITUTION } from '../src/lib/tutor/v2/constitution';
import { BoardInlineStream, boardBlocksIn, inlineToolCall, stripBoardBlocks } from '../src/lib/tutor/v2/board-inline';
import { applyToModelBoard, boardMisfit, renderBoard } from '../src/lib/tutor/v2/board';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { runV2Turn, v2SessionPart, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import {
  V2_MAX_CORRECTED_SENTENCES, v2IsCorrectionOf, v2ReadCorrectedSentences, v2SentenceCardsOn, v2SentenceCardsSection,
} from '../src/lib/tutor/v2/sentence-cards';
import { mapFunctionCallToCommand } from '../src/app/tutor/hooks/toolDefinitions';
import { commandToPdfBlock } from '../src/lib/utils/export/pdf-session-blocks';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
function stub(replies: Anthropic.Message[]) {
  const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
  // The reply's words are streamed, as the model streams them: inline board blocks are read from the stream.
  const call: V2ModelCall = async (params, onText) => { seen.push(structuredClone(params)); const r = replies.shift(); if (!r) throw new Error('stub: no reply queued'); for (const c of r.content) if (c.type === 'text') onText?.(c.text); return r; };
  return { call, seen };
}
const words = (text: string) => msg([{ type: 'text', text }], 'end_turn');

const PLAN = {
  id: 'test.language.work.v1', title: 'Talking about your work', curriculum: 'test', grade: 'Adult', subject: 'languages', schemaVersion: 1, estimatedMinutes: 20,
  los: [{ id: 'lo.past', description: 'Talk about last week in the past simple.' }],
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2 },
    { id: 'past', kind: 'try_yourself', problem: 'Tell me about a customer you met last week.', responseFormat: 'free', estimatedMinutes: 8 },
  ],
} as unknown as LessonPlan;
const bilingual: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, plan: PLAN, languages: ['en', 'ja'] };
const english: V2Session = { ...bilingual, languages: undefined };

// Paraphrased learner lines (findings case 12: "meet" for met; "My rule is…" for role).
const SAID_MEET = 'Last week I meet a customer from Osaka.';
const SAID_ROLE = 'My rule is to manage the sales team.';
const CARD_MET = '<board sentence stress="met" gloss="「meet」の過去形は「met」です。">Last week I met a customer from Osaka.</board>';

/** Child mode: the kill switch is read once at module load, so the off case runs this script again with it set. */
async function offChild() {
  const text = `Nearly. ${CARD_MET} Say it once more.`;
  const s = stub([words(text)]);
  const r = await runV2Turn({ session: bilingual, state: newV2State(1), studentSaid: SAID_MEET, callModel: s.call, boardPass: false, mathsCheck: false, nowMs: 60000 });
  console.log(`OFF_JSON ${JSON.stringify({ blocks: boardBlocksIn(text).length, said: stripBoardBlocks(text), part: /SENTENCE CARDS/.test(v2SessionPart(bilingual)), tools: r.toolCalls.map((c) => c.name) })}`);
}

async function main() {
  if (process.env.SENTENCE_CARDS_OFF_CHILD === '1') { await offChild(); return; }
  console.log('the gate: a second teaching language, under the kill switch');
  check('a bilingual taught lesson has sentence cards', v2SentenceCardsOn(bilingual));
  check('one language: none', !v2SentenceCardsOn(english) && !v2SentenceCardsOn({ ...bilingual, languages: ['en'] }));
  check('the kill switch off: none', !v2SentenceCardsOn(bilingual, false));
  check('a homework session: none', !v2SentenceCardsOn({ ...bilingual, homework: { text: 'Solve 2x = 6.', verified: false, hasFigure: false } }));
  const part = v2SessionPart(bilingual);
  const sec = v2SentenceCardsSection(['en', 'ja']);
  check('the bilingual session part carries the section, after the two-languages section', part.includes(sec) && part.indexOf(sec) > part.indexOf('TWO LANGUAGES'));
  check('a one-language session part has no section and no word of sentence cards', !/SENTENCE CARDS|board sentence/.test(v2SessionPart(english)));
  check('the constitution is unchanged: no sentence kind in it, no partner', !/board sentence|SENTENCE CARDS/.test(V2_CONSTITUTION) && !/gdi|nagoya|josh|james/i.test(V2_CONSTITUTION + sec));
  {
    const s1 = stub([words('Hello.')]); const s2 = stub([words('Hello.')]);
    await runV2Turn({ session: english, state: newV2State(1), studentSaid: null, callModel: s1.call, boardPass: false, mathsCheck: false, nowMs: 2 });
    await runV2Turn({ session: bilingual, state: newV2State(1), studentSaid: null, callModel: s2.call, boardPass: false, mathsCheck: false, nowMs: 2 });
    check('no new tool: the tools are the same with and without cards', JSON.stringify(s1.seen[0].tools) === JSON.stringify(s2.seen[0].tools));
  }

  console.log('the section');
  check('it shows the inline form, with stress and a gloss in the support language', sec.includes('<board sentence stress="word | word" gloss="a short note in Japanese">The whole sentence.</board>'), sec);
  check('the target and support languages come from the session', /An? English sentence you model or correct/.test(sec) && /in Japanese/.test(sec) && /Spanish/.test(v2SentenceCardsSection(['en', 'es'])));
  check('the summary boards up to four of their corrected sentences from the facts', /up to 4 of their corrected sentences from the facts/.test(sec) && /close they asked for/.test(sec));
  check('the summary opens its own page first (on the page they were corrected on, the cards are not written again)', /open a page for the summary with a page block first/.test(sec) && /not written again/.test(sec), sec);
  check('a card is for what they should say, never their mistake', /never for their mistake/.test(sec));

  console.log('the inline kind');
  const [b] = boardBlocksIn(`Nearly. ${CARD_MET} Say it once more.`);
  check('the block is read as a sentence card', b?.kind === 'sentence' && b.body === 'Last week I met a customer from Osaka.', b);
  const call = b ? inlineToolCall(b) : null;
  check('it becomes show_sentence: the sentence, its stressed words, the gloss', call?.name === 'show_sentence' && call.args.sentence === 'Last week I met a customer from Osaka.' && JSON.stringify(call.args.emphasis) === '["met"]' && call.args.gloss === '「meet」の過去形は「met」です。', call);
  const two = inlineToolCall(boardBlocksIn('<board sentence stress="have worked | for" title="Present perfect">I have worked here\n for three years.</board>')[0]);
  check('several stressed words, a phrase as its words (the card marks words); a title is the label; a line break inside is a space', JSON.stringify(two.args.emphasis) === '["have","worked","for"]' && two.args.label === 'Present perfect' && two.args.sentence === 'I have worked here for three years.', two);
  const bare = inlineToolCall(boardBlocksIn('<board sentence>I work in sales.</board>')[0]);
  check('no stress, no gloss: the sentence alone', bare.name === 'show_sentence' && JSON.stringify(bare.args) === '{"sentence":"I work in sales."}', bare);
  check('the student hears the words, not the card', stripBoardBlocks(`Nearly. ${CARD_MET} Say it once more.`) === 'Nearly. Say it once more.');
  {
    const st = new BoardInlineStream(); const parts = [...st.push('Nearly. <board sentence stress="met" gl'), ...st.push('oss="過去形">Last week I met a customer.</board> Again?'), ...st.flush()];
    check('streamed: the card arrives whole, between the words', parts.some((p) => 'block' in p && p.block.kind === 'sentence') && parts.filter((p) => 'text' in p).map((p) => (p as { text: string }).text).join('').replace(/\s+/g, ' ').trim() === 'Nearly. Again?', parts);
  }
  const cmd = call ? mapFunctionCallToCommand(call.name, call.args) as unknown as Record<string, unknown> : null;
  check('the whiteboard gets v1\'s showSentence card', cmd?.action === 'showSentence' && cmd.sentence === 'Last week I met a customer from Osaka.' && cmd.gloss === '「meet」の過去形は「met」です。' && JSON.stringify(cmd.emphasis) === '["met"]', cmd);

  console.log('the board record');
  {
    const board = newV2State(1).board;
    const a = applyToModelBoard(board, 'c1', 'show_sentence', { sentence: 'Last week I met a customer from Osaka.' });
    const c = applyToModelBoard(board, 'c2', 'show_sentence', { sentence: 'My role is to manage the sales team.' });
    const again = applyToModelBoard(board, 'c3', 'show_sentence', { sentence: 'Last week I met a customer from Osaka.', gloss: '過去形' });
    check('two different cards both paint (a card is its sentence, not "(no text)")', a.painted && c.painted, [a, c]);
    check('the same sentence again points at the card already up', !again.painted && again.pointAt === 'c1', again);
    check('the facts show the card by its sentence', renderBoard(board).includes('sentence "Last week I met a customer from Osaka."'), renderBoard(board));
    check('a card with no sentence is refused with the reason', /sentence card needs its sentence/.test(boardMisfit('show_sentence', { sentence: ' ', gloss: 'x' }) ?? ''));
  }

  console.log('corrected sentences: recorded, listed, read back');
  check('a card that reworks what they said is a correction', v2IsCorrectionOf('Last week I met a customer from Osaka.', SAID_MEET) && v2IsCorrectionOf('My role is to manage the sales team.', SAID_ROLE));
  check('their own sentence carded as it stands is not', !v2IsCorrectionOf('I met a customer from Osaka.', 'Yes. I met a customer from Osaka last week.'));
  check('a model sentence of the tutor\'s own is not', !v2IsCorrectionOf('I have worked here for three years.', 'Yes, I understand.'));
  check('a card after they said nothing is not', !v2IsCorrectionOf('Last week I met a customer.', null));
  {
    const s = stub([words(`Nearly: we say met for the past. ${CARD_MET} Try it?`)]);
    const r = await runV2Turn({ session: bilingual, state: newV2State(1), studentSaid: SAID_MEET, callModel: s.call, boardPass: false, mathsCheck: false, nowMs: 60000 });
    const painted = r.toolCalls.find((c) => c.name === 'show_sentence');
    check('the turn paints the card', !!painted && /^painted/.test(painted.outcome), r.toolCalls);
    check('the correction is recorded', JSON.stringify(r.state.correctedSentences) === '["Last week I met a customer from Osaka."]', r.state.correctedSentences);
    const s2 = stub([words(`Good. <board sentence stress="role" gloss="rule ではなく role（役割）です。">My role is to manage the sales team.</board> And your team?`)]);
    const r2 = await runV2Turn({ session: bilingual, state: r.state, studentSaid: SAID_ROLE, callModel: s2.call, boardPass: false, mathsCheck: false, nowMs: 120000 });
    check('a second correction is added after it', r2.state.correctedSentences?.length === 2 && r2.state.correctedSentences[1] === 'My role is to manage the sales team.', r2.state.correctedSentences);
    const s3 = stub([words('Shall we sum up?')]);
    await runV2Turn({ session: bilingual, state: r2.state, studentSaid: 'Yes, please.', callModel: s3.call, boardPass: false, mathsCheck: false, nowMs: 180000 });
    const facts = JSON.stringify(s3.seen[0].messages.at(-1));
    check('the next turn\'s facts list them for the summary', facts.includes('their corrected sentences so far: \\"Last week I met a customer from Osaka.\\"; \\"My role is to manage the sales team.\\"'), facts);
    // The whole path (review 4c I1): corrected and carded, then the summary on a page of its own boards them again.
    // A lesson of two pages, the cards on the page in view (page 2): the part-close hold applies to any new page here
    // (pagesOpen >= 2), so the test cannot pass because the lesson is only beginning (re-review N1).
    const twoPages: V2State = structuredClone(r2.state);
    twoPages.board.pages.unshift({ title: 'Warm-up', items: [] }); twoPages.board.current = 1;
    const summary = `Well done today. <board page>Summary</board> <board sentence stress="met">Last week I met a customer from Osaka.</board> <board sentence stress="role">My role is to manage the sales team.</board> Goodbye!`;
    const closing = (text: string) => msg([{ type: 'text', text }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'student_asked', summary: 'Past simple at work.' } }], 'tool_use');
    const s6 = stub([closing(summary), words('')]);
    // Five minutes in: only the student's stop makes this a closing turn, not the clock.
    const r6 = await runV2Turn({ session: bilingual, state: twoPages, studentSaid: 'Sorry, I have to finish now.', callModel: s6.call, boardPass: false, mathsCheck: false, nowMs: 300000 });
    const cards6 = r6.toolCalls.filter((c) => c.name === 'show_sentence');
    check('"I have to finish now" with two pages open: the summary page opens (not held for "shall we go on?")', r6.toolCalls.some((c) => c.name === 'new_page' && /^new page 3/.test(c.outcome)) && !r6.toolCalls.some((c) => /not opened yet/.test(c.outcome)) && r6.state.board.pages[2]?.title === 'Summary', r6.toolCalls.map((c) => `${c.name} ${c.outcome}`));
    check('both corrected sentences paint again, on the summary page', cards6.length === 2 && cards6.every((c) => /^painted on page 3/.test(c.outcome)), cards6.map((c) => c.outcome));
    check('the goodbye is said and end_lesson closes the session', /Goodbye!/.test(r6.spoken) && !/Shall we go on/.test(r6.spoken) && r6.state.closed === true, [r6.spoken, r6.state.closed]);
    // A mid-lesson page is held exactly as before.
    const s9 = stub([words('Good, that is right. <board page>Present perfect</board> Now, how long have you worked there?')]);
    const r9 = await runV2Turn({ session: bilingual, state: twoPages, studentSaid: 'I met a customer last week.', callModel: s9.call, boardPass: false, mathsCheck: false, nowMs: 300000 });
    check('mid-lesson, two pages open: a new part\'s page is still held, with the offer in its place', !r9.toolCalls.some((c) => c.name === 'new_page') && r9.state.board.pages.length === 2 && /Shall we go on/.test(r9.spoken), [r9.toolCalls.map((c) => c.outcome), r9.spoken]);
    // The clock's close window (end_lesson no longer refused): the summary page opens on a plain "yes".
    const s10 = stub([closing(summary.replace('Goodbye!', 'See you next time!')), words('')]);
    const r10 = await runV2Turn({ session: bilingual, state: twoPages, studentSaid: 'Yes, please.', callModel: s10.call, boardPass: false, mathsCheck: false, nowMs: 17 * 60000 });
    check('in the last fifth of the time, the summary page opens on a plain "yes, please"', r10.state.board.pages[2]?.title === 'Summary' && r10.toolCalls.filter((c) => c.name === 'show_sentence').length === 2, r10.toolCalls.map((c) => `${c.name} ${c.outcome}`));
    const cmds6 = cards6.map((c) => mapFunctionCallToCommand(c.name, c.args) as unknown as Record<string, unknown>);
    check('the client gets them as showSentence cards', cmds6.every((c) => c?.action === 'showSentence') && cmds6[1]?.sentence === 'My role is to manage the sales team.', cmds6);
    const s7 = stub([words(`Well done today. <board sentence>Last week I met a customer from Osaka.</board> Goodbye!`)]);
    const r7 = await runV2Turn({ session: bilingual, state: r2.state, studentSaid: 'Sorry, I have to finish now.', callModel: s7.call, boardPass: false, mathsCheck: false, nowMs: 1140000 });
    check('written on the page they were corrected on, the card is pointed back to, not written twice (why the summary opens a page)', /^not painted again: already on the board/.test(r7.toolCalls.find((c) => c.name === 'show_sentence')?.outcome ?? ''), r7.toolCalls);
    // Review 4c M3: a correction the board points at a longer card already holding it is still a correction.
    const s8 = stub([words('Nearly. <board sentence stress="met">I met a customer from Osaka.</board>')]);
    const r8 = await runV2Turn({ session: bilingual, state: r.state, studentSaid: 'I meet a customer from Osaka.', callModel: s8.call, boardPass: false, mathsCheck: false, nowMs: 130000 });
    check('a correction pointed at a longer card holding it is still recorded', /^not painted again/.test(r8.toolCalls[0]?.outcome ?? '') && r8.state.correctedSentences?.includes('I met a customer from Osaka.'), [r8.toolCalls[0]?.outcome, r8.state.correctedSentences]);
    const s4 = stub([words(`Here is one. <board sentence>I have worked here for three years.</board>`)]);
    const r4 = await runV2Turn({ session: bilingual, state: newV2State(1), studentSaid: 'Can you give me an example?', callModel: s4.call, boardPass: false, mathsCheck: false, nowMs: 60000 });
    check('a model card answering a question is not recorded', !r4.state.correctedSentences, r4.state.correctedSentences);
    const s5 = stub([words(`Nearly. ${CARD_MET}`)]);
    const r5 = await runV2Turn({ session: english, state: newV2State(1), studentSaid: SAID_MEET, callModel: s5.call, boardPass: false, mathsCheck: false, nowMs: 60000 });
    check('one-language session: the card still paints, nothing is recorded, the facts are unchanged', r5.toolCalls.some((c) => c.name === 'show_sentence' && /^painted/.test(c.outcome)) && !r5.state.correctedSentences && !/corrected sentences/.test(renderFacts(english, { ...r5.state, correctedSentences: ['x y z'] }, { nowMs: 60000 })));
  }
  {
    const st: V2State = newV2State(1);
    st.correctedSentences = Array.from({ length: 12 }, (_, i) => `Sentence number ${i} here.`);
    const read = v2ReadCorrectedSentences([...st.correctedSentences, 3, '', null]);
    check(`the route keeps the last ${V2_MAX_CORRECTED_SENTENCES}, strings only`, read?.length === V2_MAX_CORRECTED_SENTENCES && read[0] === 'Sentence number 4 here.', read);
    check('the route drops a malformed value', v2ReadCorrectedSentences('x') === undefined && v2ReadCorrectedSentences([]) === undefined);
    const route = readFileSync(join(__dirname, '..', 'src', 'app', 'api', 'tutor', 'brain-v2', 'turn', 'route.ts'), 'utf8');
    check('the route reads them into the state', /v2ReadCorrectedSentences\(s\.correctedSentences\)/.test(route));
    const quoted = renderFacts(bilingual, { ...newV2State(1), correctedSentences: ['He said "yes" to the plan.', 'I met a customer.'] }, { nowMs: 60000 });
    check('a sentence with a double quote keeps its own quote in the facts (review 4c M5)', quoted.includes('their corrected sentences so far: "He said \\"yes\\" to the plan."; "I met a customer."'), quoted);
  }

  console.log('the kill switch off (a fresh process with NEXT_PUBLIC_TUTOR_V2_SENTENCE_CARDS=off)');
  {
    const r = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, NEXT_PUBLIC_TUTOR_V2_SENTENCE_CARDS: 'off', SENTENCE_CARDS_OFF_CHILD: '1' }, encoding: 'utf8' });
    const line = (r.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    const got = line ? JSON.parse(line.slice('OFF_JSON '.length)) as { blocks: number; said: string; part: boolean; tools: string[] } : null;
    check('the block is dropped unpainted, as before the kind existed (review 4c M1)', got?.blocks === 0 && got.tools.length === 0, got ?? r.stderr);
    check('the student still hears only the words', got?.said === 'Nearly. Say it once more.', got);
    check('no section in the session part', got?.part === false, got);
  }

  console.log('the session PDF: the card and its Japanese gloss');
  {
    const block = commandToPdfBlock(cmd as never);
    check('the exporter draws it as a sentence card with its gloss', block.kind === 'sentence' && (block as { gloss?: string }).gloss === '「meet」の過去形は「met」です。' && JSON.stringify((block as { emphasisIdx?: number[] }).emphasisIdx) === '[3]', block);
    const { exportTutorSessionPDF } = await import('../src/lib/utils/export/pdf-tutor-session');
    const scratch = mkdtempSync(join(tmpdir(), 'v2-sentence-card-pdf-'));
    const prevCwd = process.cwd(); const prevFetch = globalThis.fetch;
    const fontPath = join(__dirname, '..', 'public', 'fonts', 'NotoSansJP-Regular-subset.ttf');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = async (url: string) => (String(url).endsWith('/fonts/NotoSansJP-Regular-subset.ttf') ? new Response(readFileSync(fontPath)) : new Response('nope', { status: 404 }));
    process.chdir(scratch);
    let pdf = '';
    try {
      await exportTutorSessionPDF(
        [
          { id: '1', timestamp: new Date('2026-11-15T10:00:00Z'), role: 'student', text: SAID_MEET },
          { id: '2', timestamp: new Date('2026-11-15T10:00:10Z'), role: 'tutor', text: 'Nearly: we say met for the past. Try it?' },
        ],
        [{ ...(cmd as Record<string, unknown>), id: 'inl_1' } as never],
        'Talking about your work', 'concept-review', 'Ken', { subject: 'English', level: 'Adult' },
      );
      const file = readdirSync(scratch).find((f) => f.endsWith('.pdf'))!;
      pdf = readFileSync(join(scratch, file), 'latin1');
      if (process.env.SENTENCE_CARD_PDF_OUT) copyFileSync(join(scratch, file), process.env.SENTENCE_CARD_PDF_OUT);
    } finally { process.chdir(prevCwd); globalThis.fetch = prevFetch; rmSync(scratch, { recursive: true, force: true }); }
    check('the Japanese font is embedded', /NotoSansJP/.test(pdf));
    check('the Japanese is drawn, not replaced by "[Japanese text]" or "??"', !pdf.includes('[Japanese text]') && !/\(\?\?/.test(pdf));
    check('the card\'s English is in the PDF', /customer/.test(pdf) && /Osaka/.test(pdf));
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
