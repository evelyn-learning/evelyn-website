/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7o: mic test 4 (embed-1795028886172, flag 2 at 5.5 min; Other 6 at 12.87 min): the target word of a rule /
 * correction note is marked on the board, and markdown stars never reach the captions or the transcript. The session's plan
 * (gdi-work-projects-v1), and the replies quoted in task-7m-investigation.md (B, Other 6). No network, no model, nothing to the
 * speech vendor.
 *   npm run test:brain-v2-note-targets-7o
 *
 *  1 NOTE_TARGET_QUOTES   the session part asks for the target in double quotes (language lessons only); a note's spoken copy
 *                          keeps those quotes, so the voice sets the target apart (fix round 1, I2)
 *  2 NOTE_TARGET_MARK     a language lesson's note carries `targets: true`; the board draws a short quoted span as a stress word
 *                          (amber, semibold, underlined) without its quotes; a long quote, and every other lesson's note, as before
 *  3 NOTE_STRESS_MARK     a note quoting no target, in a reply whose card stresses "for": "for" marked where it stands
 *  4 NO_MARKDOWN_STARS    「一緒に仕事をする**人**に使います」 streams without the asterisks
 *  each switch off alone (a child process per switch): the behaviour at the base commit for that item.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_NOTE_TARGET_QUOTES, TUTOR_V2_NOTE_TARGET_MARK, TUTOR_V2_NOTE_STRESS_MARK, TUTOR_V2_NO_MARKDOWN_STARS } from '../src/lib/tutor/orchestrator/flags';
import { v2NoteSegments, v2NoteHasTarget, v2NoteStressWords } from '../src/lib/tutor/v2/note-targets';
import { V2StarStrip } from '../src/lib/tutor/v2/markdown-stars';
import { withTargetPauses } from '../src/lib/tutor/v2/target-pauses';
import { v2SpeechParts } from '../src/lib/tutor/v2/languages';
import { v2SpeakSounds } from '../src/lib/tutor/v2/spoken-sounds';
import { rewriteForTTS, speakDataRuns, speakLessonNotation, speakNumberPlurals, speakSlashes } from '../src/lib/tutor/voice/tts-pronunciation';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { mapFunctionCallToCommand } from '../src/app/tutor/hooks/toolDefinitions';
import { RichBoardText } from '../src/app/tutor/components/whiteboard/RichBoardText';
import { NoteTargetText } from '../src/app/tutor/components/whiteboard/NoteTargetText';

let passed = 0; let failed = 0;
const CHILD = process.env.NOTE_7O_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Step = { text: string; after?: unknown[] };
function scripted(steps: Step[]) {
  const systems: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    systems.push(JSON.stringify(params.system));
    const s = steps[Math.min(i, steps.length - 1)]!; i += 1;
    if (onText) for (const piece of s.text.match(/[\s\S]{1,7}/g) ?? []) onText(piece);
    return msg([...(s.text ? [{ type: 'text', text: s.text }] : []), ...(s.after ?? [])], s.after?.length ? 'tool_use' : 'end_turn');
  };
  return { call, systems };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
const maths: V2Session = { studentName: 'Sam', subject: 'Math', level: 'Grade 8', mode: 'voice' };
const MIN = 60000;
const TODAY: V2BoardPage = { title: 'Today\'s lesson', items: [{ id: 't1', tool: 'annotate', summary: 'present perfect / past simple' }] };
const JOB: V2BoardPage = { title: '仕事について', items: [{ id: 'j1', tool: 'show_sentence', summary: 'I work in sales in the home appliance division.' }] };
const goalsAt = { overview: { status: 'shown' as const, at: 0 }, 'level-check': { status: 'demonstrated' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 } };
const langState = (): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone([TODAY, JOB]), current: 1 }, goals: goalsAt, timeFit: { dropped: [], byArrival: true }, practiceSaid: { 'topic-intro': 1 } });
const run = (session: V2Session, st: V2State, said: string | null, steps: Step[], nowMin: number) => {
  const heard: string[] = []; const m = scripted(steps);
  return runV2Turn({ session, state: st, studentSaid: said, callModel: m.call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: nowMin * MIN })
    .then((r) => ({ r, heard: heard.join(''), pieces: heard, system: m.systems[0] ?? '' }));
};
const tool = (id: string, name: string, input: unknown) => ({ type: 'tool_use', id, name, input });

// ── The session's texts (task-7m-investigation.md B, 5.32 / 5.35 / 5.45) ──
const B_SAID = 'I have worked Nagoya Corporation 6 years.';
const B_REPLY = 'Good, you have worked there for six years. One small thing: we say "for" before the number of years. <board sentence stress="for" gloss="期間を言うときは for を入れます。">I have worked at Nagoya Corporation for six years.</board>';
const B_NOTE = 'For a period of time, use for + the number of years: for six years.';
// The note as the prompt now asks for it.
const B_NOTE_QUOTED = 'For a period of time, use "for" + the number of years: "for" six years.';
// Other 6 (12.87).
const STARS = '「with」は、一緒に仕事をする**人**に使います。';

async function probe() {
  // 1: the session part.
  const langSys = (await run(lang, langState(), B_SAID, [{ text: 'Good.' }], 5.35)).system;
  const mathsSys = (await run(maths, newV2State(0), 'ok', [{ text: 'Good.' }], 3)).system;
  // 1: a spoken note: announced by a colon, its example sentence is spoken where it stands.
  const noteSaid = await run(lang, langState(), B_SAID, [{ text: `Here is the rule: <board note>${'Use "for" + the number of years.\nI have worked here "for" six years.'}</board> Now you try.` }], 5.35);
  // Fix round 1 (I2): the session's note, quoted as asked, spoken where it stands.
  const sessionNote = await run(lang, langState(), B_SAID, [{ text: `Here is the rule: <board note>${B_NOTE_QUOTED}</board> Now you try.` }], 5.35);
  const noteSaidPlain = await run(lang, langState(), B_SAID, [{ text: `Here is the rule: <board note>${'Use for + the number of years.\nI have worked here for six years.'}</board> Now you try.` }], 5.35);
  // 2, 3: the 5.35 reply, its note an annotate tool call (5.45), as written then (no quotes) and as now asked for (quotes).
  const b = await run(lang, langState(), B_SAID, [{ text: B_REPLY, after: [tool('a1', 'annotate', { text: B_NOTE, style: 'highlight' })] }, { text: '' }], 5.35);
  const bq = await run(lang, langState(), B_SAID, [{ text: B_REPLY, after: [tool('a1', 'annotate', { text: B_NOTE_QUOTED, style: 'highlight' })] }, { text: '' }], 5.35);
  const bInline = await run(lang, langState(), B_SAID, [{ text: `${B_REPLY} <board note style="highlight">${B_NOTE}</board>` }], 5.35);
  // A maths voice lesson's note with a quoted word: no marker, no stress.
  const m = await run(maths, newV2State(0), 'ok', [{ text: 'Look. <board sentence stress="slope">The slope is the rise over the run.</board> <board note>The "slope" of the line is the rise over the run.</board>' }], 3);
  // 4: the 12.87 sentence, streamed in pieces of 7 characters (a pair split across two pieces).
  const stars = await run(lang, langState(), 'Who do I use with for?', [{ text: STARS }], 12.87);
  const lone = await run(lang, langState(), 'ok', [{ text: 'Say it once more. ***Ready?*** *' }], 12.9);
  const mathsStars = await run(maths, newV2State(0), 'ok', [{ text: 'We write it **twice**.' }], 3);
  const ann = (r: Awaited<ReturnType<typeof run>>) => r.r.toolCalls.find((c) => c.name === 'annotate')?.args ?? null;
  return {
    langSys, mathsSys,
    noteHeard: noteSaid.heard, noteHeardPlain: noteSaidPlain.heard, sessionNoteHeard: sessionNote.heard,
    sessionNoteVoice: sessionNote.heard.includes(B_NOTE_QUOTED) ? speakAsClient(B_NOTE_QUOTED) : null,
    bArgs: ann(b), bqArgs: ann(bq), bInlineArgs: ann(bInline), mArgs: ann(m),
    starsHeard: stars.heard.split('\n')[0], mathsStarsHeard: mathsStars.heard.split('\n')[0], starsSpoken: stars.r.spoken, loneHeard: lone.heard, loneSpoken: lone.r.spoken,
  };
}

// The voice client's plain-speech path (TutorVoiceV2 plainSpeech, 7h / 7l / 7m), as the 7m suite runs it.
const restOfPath = (s: string) => rewriteForTTS(speakSlashes(speakNumberPlurals(speakDataRuns(speakLessonNotation(v2SpeakSounds(s))))), { studentName: 'Ken' });
const speakAsClient = (sentence: string) => v2SpeechParts(sentence, ['en', 'ja']).map((part) => withTargetPauses(part, restOfPath, true, true, []));
const html = (el: React.ReactElement) => renderToStaticMarkup(el);

async function main() {
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(await probe())}`); return; }
  const on = await probe();

  console.log('the switches: each on by default');
  check('NOTE_TARGET_QUOTES, NOTE_TARGET_MARK, NOTE_STRESS_MARK, NO_MARKDOWN_STARS default on', TUTOR_V2_NOTE_TARGET_QUOTES && TUTOR_V2_NOTE_TARGET_MARK && TUTOR_V2_NOTE_STRESS_MARK && TUTOR_V2_NO_MARKDOWN_STARS);

  console.log('1  the prompt asks for the target in double quotes; a spoken note keeps them (fix round 1, I2)');
  check('a spoken language lesson\'s session part asks for the target word in double quotes, in <board note> and annotate', /TARGET WORDS IN NOTES/.test(on.langSys) && on.langSys.includes('use \\"for\\" + the number of years: \\"for\\" six years') && /board note/.test(on.langSys) && /annotate/.test(on.langSys), on.langSys.slice(-900));
  check('a maths voice lesson\'s session part has no such section', !/TARGET WORDS IN NOTES/.test(on.mathsSys));
  check('fix round 1 (I2): a spoken note keeps its quotes (as written; captions and transcript show the note as written)', on.noteHeard.includes('I have worked here "for" six years.') && on.noteHeardPlain.includes('I have worked here for six years.'), [on.noteHeard, on.noteHeardPlain]);
  check('fix round 1 (I2): the session\'s quoted note is spoken where it stands, and the voice copy sets "for" apart (7l marks, cap 2): speech and board agree', JSON.stringify(on.sessionNoteVoice) === JSON.stringify(['For a period of time, use — for — + the number of years: for — six years.']), [on.sessionNoteHeard, on.sessionNoteVoice]);

  console.log('2  the board marks a short quoted span in a language lesson\'s note');
  check('the 5.45 note (annotate tool call) carries targets: true', on.bqArgs?.targets === true, on.bqArgs);
  check('… and its text is unchanged (the record keeps the quotes)', on.bqArgs?.text === B_NOTE_QUOTED);
  check('an inline <board note> of the lesson carries it too', on.bInlineArgs?.targets === true, on.bInlineArgs);
  check('a maths voice lesson\'s note carries no marker and no stress', on.mArgs !== null && on.mArgs.targets === undefined && on.mArgs.stress === undefined, on.mArgs);
  {
    const segs = v2NoteSegments(B_NOTE_QUOTED, { quoted: true });
    check('segments: "for" marked twice, quotes dropped, the rest plain', JSON.stringify(segs) === JSON.stringify([{ text: 'For a period of time, use ' }, { text: 'for', mark: true }, { text: ' + the number of years: ' }, { text: 'for', mark: true }, { text: ' six years.' }]), segs);
    const curly = v2NoteSegments('Use “at” for a place; 期間には「for」を使います。', { quoted: true });
    check('curly quotes and 「」 alike', JSON.stringify(curly) === JSON.stringify([{ text: 'Use ' }, { text: 'at', mark: true }, { text: ' for a place; 期間には' }, { text: 'for', mark: true }, { text: 'を使います。' }]), curly);
    const long = v2NoteSegments('We say "I have worked here for six years."', { quoted: true });
    check('a quoted sentence (more than three words) is left as written', JSON.stringify(long) === JSON.stringify([{ text: 'We say "I have worked here for six years."' }]), long);
    const three = v2NoteSegments('Use "have worked" or "in the morning", and "-ed".', { quoted: true });
    check('up to three words, and an ending, are targets', three.filter((s) => s.mark).map((s) => s.text).join('|') === 'have worked|in the morning|-ed', three);
    const punct = v2NoteSegments('We say "for."', { quoted: true });
    check('a stop inside the quotes stays plain after the mark', JSON.stringify(punct) === JSON.stringify([{ text: 'We say ' }, { text: 'for', mark: true }, { text: '.' }]), punct);
    const bold = v2NoteSegments('Use **for** with a period, **not with a point in time**.', { quoted: true });
    check('markdown bold: a short span marked, a long one shown without its stars', JSON.stringify(bold) === JSON.stringify([{ text: 'Use ' }, { text: 'for', mark: true }, { text: ' with a period, not with a point in time.' }]), bold);
    check('without a marker: one plain run, quotes kept (every other lesson)', JSON.stringify(v2NoteSegments('The "slope" of the line')) === JSON.stringify([{ text: 'The "slope" of the line' }]));
  }
  {
    const marked = html(<NoteTargetText text={B_NOTE_QUOTED} quoted />);
    check('NoteTargetText draws each target in the sentence card\'s emphasis style, without quotes', (marked.match(/<span[^>]*font-semibold[^>]*>for<\/span>/g) ?? []).length === 2 && /text-decoration:underline/.test(marked) && /color:#a16207/.test(marked) && !marked.includes('&quot;for&quot;'), marked);
    const rich = html(<RichBoardText text={B_NOTE_QUOTED} titled quoted />);
    check('RichBoardText (inline notes) with the marker: the same marks', (rich.match(/<span[^>]*font-semibold[^>]*>for<\/span>/g) ?? []).length === 2, rich);
    const label = html(<RichBoardText text={'Past simple: use "ago" with a time.'} titled quoted />);
    check('… in a labelled point too', /<span[^>]*font-semibold[^>]*>ago<\/span>/.test(label) && label.includes('Past simple'), label);
    const mathsNote = 'The "slope" of the line is $\\frac{rise}{run}$.';
    check('RichBoardText without the marker renders exactly as before (a maths note with a quoted word)', html(<RichBoardText text={mathsNote} titled />) === html(<RichBoardText text={mathsNote} titled quoted={undefined} stress={undefined} />) && !/text-decoration:underline/.test(html(<RichBoardText text={mathsNote} titled />)));
    const canvas = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'whiteboard', 'WhiteboardCanvas.tsx'), 'utf8');
    const at = canvas.indexOf("case 'annotate': {");
    const body = canvas.slice(at, at + 3200);
    check('WhiteboardCanvas passes the note\'s marker and stress to both note paths (rich and plain)', /quoted=\{noteMarks\.quoted\}/.test(body) && /<NoteTargetText /.test(body), body.slice(0, 400));
    const cmd = mapFunctionCallToCommand('annotate', { text: B_NOTE_QUOTED, style: 'highlight', targets: true, stress: ['for'] }) as unknown as Record<string, unknown>;
    const plain = mapFunctionCallToCommand('annotate', { text: 'x', style: 'highlight', rich: true }) as unknown as Record<string, unknown>;
    check('the annotate command carries targets and stress; without them its keys are as before', cmd.targets === true && JSON.stringify(cmd.stress) === '["for"]' && JSON.stringify(Object.keys(plain)) === '["action","text","style","rich"]', [cmd, plain]);
  }

  console.log('3  a note quoting no target, in a reply whose card stresses "for": "for" marked where it stands');
  check('the 5.45 note as written then carries stress ["for"]', JSON.stringify(on.bArgs?.stress) === '["for"]', on.bArgs);
  check('… its text unchanged', on.bArgs?.text === B_NOTE);
  check('a note that quotes its target carries no stress (the quotes decide)', on.bqArgs?.stress === undefined, on.bqArgs);
  {
    const segs = v2NoteSegments(B_NOTE, { quoted: true, stress: ['for'] });
    check('fix round 1 (I1): the board marks exactly the two target "for"s; the opening "For" stays plain; not "for" inside another word', JSON.stringify(segs) === JSON.stringify([{ text: 'For a period of time, use ' }, { text: 'for', mark: true }, { text: ' + the number of years: ' }, { text: 'for', mark: true }, { text: ' six years.' }]) && JSON.stringify(v2NoteSegments('before forty', { stress: ['for'] })) === JSON.stringify([{ text: 'before forty' }]), segs);
    const the = v2NoteSegments('The article: use the before a known thing.\nThe home appliance division.', { stress: ['the'] });
    check('fix round 1 (I1): a card stressing "the" leaves every line- or sentence-opening "The" plain', the.filter((s) => s.mark).length === 1 && the.filter((s) => s.mark)[0]!.text === 'the', the);
    const cap = v2NoteSegments('Monday: on Monday we meet; monday is wrong.', { stress: ['Monday'] });
    check('fix round 1 (I1): a capitalised stress word matches in either case (it may open the sentence)', cap.filter((s) => s.mark).length === 3, cap);
    check('fix round 1 (I1): a lower-case stress word standing only at a sentence start is not carried', v2NoteStressWords('For six years.', [{ name: 'show_sentence', args: { sentence: 'x', emphasis: ['for'] }, outcome: 'painted on page 2' }]).length === 0);
    const math = v2NoteSegments('Use "for" with $\\text{for } n$ years.', { quoted: true, stress: ['for'] });
    check('fix round 1 (minor 5): a $…$ span is never cut by a mark', math.some((s) => s.text.includes('$\\text{for } n$')) && math.filter((s) => s.mark).length === 1, math);
    check('no card, no stress words (never guessed)', v2NoteStressWords(B_NOTE, []).length === 0 && v2NoteStressWords(B_NOTE, [{ name: 'show_sentence', args: { sentence: 'x', emphasis: ['for'] }, outcome: 'not painted: x' }]).length === 0);
    check('a stress word not in the note is not carried', JSON.stringify(v2NoteStressWords(B_NOTE, [{ name: 'show_sentence', args: { sentence: 'x', emphasis: ['at', 'for'] }, outcome: 'painted on page 2' }])) === '["for"]');
    check('v2NoteHasTarget: quoted target yes; quoted sentence no', v2NoteHasTarget(B_NOTE_QUOTED) && !v2NoteHasTarget('We say "I have worked here for six years."') && !v2NoteHasTarget(B_NOTE));
    const marked = html(<NoteTargetText text={B_NOTE} stress={['for']} />);
    check('NoteTargetText draws the stress words (two, the opening "For" plain)', (marked.match(/<span[^>]*font-semibold[^>]*>for<\/span>/g) ?? []).length === 2 && !/>For<\/span>/.test(marked), marked);
    const src = readFileSync(join(__dirname, '..', 'src', 'lib', 'tutor', 'v2', 'note-marks.ts'), 'utf8');
    const comp = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'whiteboard', 'NoteTargetText.tsx'), 'utf8');
    check('fix round 1 (minor 1): the whiteboard imports note-marks.ts, which imports only the 7h target test (no discussion.ts / constitution)', /from '@\/lib\/tutor\/v2\/note-marks'/.test(comp) && (src.match(/^import /gm) ?? []).length === 1 && /from '\.\/target-pauses'/.test(src));
  }

  console.log('4  Other 6 (12.87 min): no literal ** in captions or transcript');
  check('the 12.87 sentence streams without its asterisks', on.starsHeard === '「with」は、一緒に仕事をする人に使います。', on.starsHeard);
  check('… and the turn\'s final text (the transcript entry) has none either', !on.starsSpoken.includes('*') && on.starsSpoken.includes('一緒に仕事をする人に使います'), on.starsSpoken);
  {
    const s = new V2StarStrip();
    const out = ['a *', '*b*', '* c', ' 2 * 3'].map((p) => s.push(p)).join('');
    check('V2StarStrip: a pair split across pieces is a pair; a single * is kept', out === 'a b c 2 * 3', out);
    const t = new V2StarStrip();
    const bi = ['***x', '***', ' and **', '*y***'].map((p) => t.push(p)).join('');
    check('fix round 1 (minor 3): ***x*** (bold italic) leaves no star, also split across pieces', bi === 'x and y' && t.end() === '', bi);
    const e = new V2StarStrip(); const held = e.push('ends *');
    check('fix round 1 (minor 3): a lone star at the very end is held and handed back by end()', held === 'ends ' && e.end() === '*');
  }
  check('fix round 1 (minor 3): a lone trailing star and ***…*** leave neither the stream nor the final text (the two the same)', !on.loneHeard.includes('*') && !on.loneSpoken.includes('*') && on.loneSpoken.startsWith('Say it once more. Ready?'), [on.loneHeard, on.loneSpoken]);
  {
    const turn = readFileSync(join(__dirname, '..', 'src', 'lib', 'tutor', 'v2', 'turn.ts'), 'utf8');
    check('fix round 1 (minor 2): the runtime\'s lines that may carry the model\'s words go through the stripper too (two offers, the card ask, the correction)', (turn.match(/input\.onText\?\.\(`\\n\\n\$\{unstar\(/g) ?? []).length === 4);
  }
  check('a maths voice lesson streams as before (stars untouched)', on.mathsStarsHeard === 'We write it **twice**.', on.mathsStarsHeard);

  console.log('5  each flag off alone (a child process per switch): as at the base commit for that item, the others on');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', NOTE_7O_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    return line ? JSON.parse(line.slice('OFF_JSON '.length)) as typeof on : ({ error: res.stderr } as unknown as typeof on);
  };
  {
    const off = child('NOTE_TARGET_QUOTES');
    check('NOTE_TARGET_QUOTES off: no section in the prompt; a note the model quoted is spoken with its quotes and the 7l marks (as before)', !/TARGET WORDS IN NOTES/.test(off.langSys) && off.noteHeard.includes('I have worked here "for" six years.') && JSON.stringify(off.sessionNoteVoice) === JSON.stringify(on.sessionNoteVoice), off.noteHeard);
    check('… the other items as on', off.bqArgs?.targets === true && JSON.stringify(off.bArgs?.stress) === '["for"]' && off.starsHeard === on.starsHeard);
  }
  {
    const off = child('NOTE_TARGET_MARK');
    check('NOTE_TARGET_MARK off: no marker on the note (renders as before)', off.bqArgs !== null && off.bqArgs.targets === undefined && off.bInlineArgs?.targets === undefined, off.bqArgs);
    check('… the other items as on', /TARGET WORDS IN NOTES/.test(off.langSys) && JSON.stringify(off.bArgs?.stress) === '["for"]' && off.starsHeard === on.starsHeard);
  }
  {
    const off = child('NOTE_STRESS_MARK');
    check('NOTE_STRESS_MARK off: the unquoted note carries no stress (as before)', off.bArgs !== null && off.bArgs.stress === undefined, off.bArgs);
    check('… the other items as on', off.bqArgs?.targets === true && off.starsHeard === on.starsHeard);
  }
  {
    const off = child('NO_MARKDOWN_STARS');
    check('NO_MARKDOWN_STARS off: the asterisks stream as before', off.starsHeard === STARS && off.starsSpoken.includes('**人**'), off.starsHeard);
    check('… the other items as on', off.bqArgs?.targets === true && JSON.stringify(off.bArgs?.stress) === '["for"]');
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
