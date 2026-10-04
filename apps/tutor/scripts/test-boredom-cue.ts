/**
 * Boredom / pace cue detection (2026-10-03).
 *
 * Regression under test: production — the student said "whatever we're
 * supposed to do next"; the bare word "next" matched boredomCueRegex
 * (pacing_cue cue="next"), a boredom hint rode the next turn, and the tutor
 * said "Given that boredom cue, let's not linger". A common word appearing
 * in a sentence is not a request to the tutor.
 *
 * Run: npx tsx scripts/test-boredom-cue.ts
 */
import { detectBoredomCue, LEGACY_BOREDOM_CUE_RE } from '../src/lib/tutor/orchestrator/boredom-cue';
import { formatStudentStateBlock } from '../src/lib/tutor/voice/claude-brain';
import { buildSystemPrompt } from '../src/lib/tutor/ai/system-prompt-builder';
import { PROMPT_MATRIX } from './fixtures/system-prompt-matrix';

let failures = 0;
let passed = 0;
function check(name: string, cond: boolean, got?: unknown) {
  if (!cond) { failures++; console.error(`FAIL ${name}${got !== undefined ? ` — got ${JSON.stringify(got)}` : ''}`); }
  else passed++;
}
const cueOf = (s: string) => detectBoredomCue(s, { requestShape: true }).cue;
const legacyOf = (s: string) => detectBoredomCue(s, { requestShape: false }).cue;

// The production utterance: no cue, and the rejection is reported.
{
  const d = detectBoredomCue("whatever we're supposed to do next", { requestShape: true });
  check('production utterance does not match', d.cue === null, d);
  check('production utterance reports the ignored word', d.ignored.length === 1 && d.ignored[0] === 'next', d);
  check('legacy rule did match it (the bug)', legacyOf("whatever we're supposed to do next") === 'next');
}

// Required positives.
const POSITIVE: Array<[string, string]> = [
  ['next', 'next'],
  ['Next.', 'next'],
  ['next one please', 'next'],
  ['can we go to the next problem', 'next'],
  // Request shapes for "next".
  ['Okay, next.', 'next'],
  ['um next question', 'next'],
  ['I got it. Next!', 'next'],
  ['please go to the next one', 'next'],
  ["let's do the next one", 'next'],
  ['can you give me the next question', 'next'],
  ['I want the next problem', 'next'],
  // Other single common words, request/evaluative shape.
  ['skip', 'skip'],
  ['skip this', 'skip this'],
  ['can we skip this one', 'skip this'],
  ["let's skip", 'skip'],
  ['easy', 'easy'],
  ['too easy', 'easy'],
  ['this is easy', 'easy'],
  ["that's so easy", 'easy'],
  ['these are way too easy', 'easy'],
  ['no, this is too easy', 'easy'],
  ['obviously', 'obviously'],
  ['Obviously it is five', 'obviously'],
  ['faster', 'faster'],
  ['can you go faster', 'faster'],
  ['go a bit faster please', 'faster'],
  ['slower please', 'slower'],
  ['could you talk slower', 'slower'],
  // Unambiguous cues still match anywhere.
  ['you are going too fast for me', 'too fast'],
  ['wait slow down', 'slow down'],
  ['ugh I know this already', 'I know this'],
  ['this is boring', 'boring'],
  ['well duh', 'duh'],
  ['can you speed up', 'speed up'],
];
for (const [text, cue] of POSITIVE) {
  const got = cueOf(text);
  check(`match: "${text}" → ${cue}`, (got ?? '').toLowerCase() === cue.toLowerCase(), got);
}

// Negatives: the word merely appears.
const NEGATIVE = [
  "whatever we're supposed to do next",
  'what do we do next',
  'I think you add three next',
  'Next you subtract three from both sides',
  'next to the seven there is a two',
  'and then the next number is nine',
  "I don't know what comes next",
  'is there an easy way to do this',
  "it's not easy for me",
  'this is not that easy',
  'that one was easier',
  'you skip count by fives',
  'I would skip a number',
  'the faster car wins',
  'it gets there faster',
  'the slower train takes six hours',
  "it's obviously wrong but I don't see why",
  'the answer is twelve',
  // "move on" was never a cue in the legacy list and is not one now: an
  // ordinary request to continue says nothing about pace or level.
  "let's move on",
  'can we move on',
  'move on please',
  'okay moving on',
  "let's keep moving on",
  '',
];
for (const text of NEGATIVE) {
  const got = cueOf(text);
  check(`no match: "${text}"`, got === null, got);
}

// Pace-direction cues keep the strings the paceBias step keys on.
check('slow down keeps its cue text', /slow\s+down/.test((cueOf('please slow down') ?? '').toLowerCase()));
check('speed up keeps its cue text', /speed\s+up/.test((cueOf('speed up') ?? '').toLowerCase()));

// Flag off ⇒ byte-identical to the old regex's first match.
for (const text of [...POSITIVE.map((p) => p[0]), ...NEGATIVE]) {
  const m = text.match(LEGACY_BOREDOM_CUE_RE);
  check(`legacy parity: "${text}"`, legacyOf(text) === (m ? m[0] : null), legacyOf(text));
}
check('legacy regex unchanged',
  LEGACY_BOREDOM_CUE_RE.source === String.raw`\b(i\s+know\s+this|obviously|skip(\s+this)?|duh|easy|boring|next|too\s+fast|slow\s+down|slower|faster|speed\s+up)\b` && LEGACY_BOREDOM_CUE_RE.flags === 'i');

// What the brain READS must carry no quotable label for the signal: the tutor
// said "Given that boredom cue, …" because the hint named it, and the
// <student_state> attribute / system prompt named it too.
{
  const thresholds = { silentRampStreak: 3, explicitOfferStreak: 4, inverseStreak: 2, checkInMinTurns: 6, checkInCooldown: 4 };
  const { block, hint } = formatStudentStateBlock({ correctStreak: 1, incorrectStreak: 0, segmentTurns: 2, cue: 'too fast', thresholds });
  check('student_state: the student\'s words ride as pace_request="…"', block.includes('pace_request="too fast"'), block);
  check('student_state: no `cue` attribute or word anywhere in the block', !/\bcue\b/i.test(block), block);
  check('student_state: no "boredom" anywhere in the block', !/boredom/i.test(block), block);
  check('hint still carries the instruction', !!hint && /verbally offer "harder \/ skip \/ different topic" immediately/.test(hint), hint);
  const quiet = formatStudentStateBlock({ correctStreak: 2, incorrectStreak: 0, segmentTurns: 3 });
  check('no cue ⇒ no pace_request attribute', !quiet.block.includes('pace_request'), quiet.block);
  for (const [name, ctx] of Object.entries(PROMPT_MATRIX)) {
    const prompt = buildSystemPrompt(ctx);
    check(`system prompt (${name}): no "boredom cue" label`, !/boredom\s+cue/i.test(prompt));
    check(`system prompt (${name}): explains pace_request`, prompt.includes('pace_request='));
    check(`system prompt (${name}): pacing rule refers to the hint by what it says`, prompt.includes('the pace or level is not right for them'));
  }
}

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log(`test:boredom-cue PASS (${passed} checks)`);
