/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7l: a target set apart by punctuation, not break tags (the product owner's pick by ear from the
 * 7j samples: English-led = option J, dashes; Japanese-led = option I, commas). No network, no audio, nothing to the vendor.
 *   npm run test:brain-v2-emphasis-7l
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { markTargets, targetPunctuation, withTargetPauses } from '../src/lib/tutor/v2/target-pauses';
import { v2SpeechParts } from '../src/lib/tutor/v2/languages';
import { v2SpeakSounds } from '../src/lib/tutor/v2/spoken-sounds';
import { rewriteForTTS, speakDataRuns, speakLessonNotation, speakNumberPlurals, speakSlashes } from '../src/lib/tutor/voice/tts-pronunciation';
import { V2Captions } from '../src/lib/tutor/v2/captions';
import { TUTOR_V2_TARGET_PAUSE, TUTOR_V2_TARGET_PUNCT } from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const CHILD = !!process.env.EMPHASIS_7L_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (CHILD) return;
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
// The student's name is only an option of rewriteForTTS; the 7j render passed one, which changes nothing in these sentences.
const restOfPath = (s: string) => rewriteForTTS(speakSlashes(speakNumberPlurals(speakDataRuns(speakLessonNotation(v2SpeakSounds(s))))), { studentName: 'Praveen' });
const speak = (sentence: string, on = true, punct = true) => v2SpeechParts(sentence, ['en', 'ja']).map((part) => withTargetPauses(part, restOfPath, on, punct));
const D = '—';
const C = '、';

async function main() {
  if (CHILD) {
    console.log('OFF_JSON ' + JSON.stringify({ pause: TUTOR_V2_TARGET_PAUSE, punct: TUTOR_V2_TARGET_PUNCT, s2: v2SpeechParts('Good, you used "attended" for a finished event.', ['en', 'ja']).map((p) => withTargetPauses(p, restOfPath, TUTOR_V2_TARGET_PAUSE, TUTOR_V2_TARGET_PUNCT)) }));
    return;
  }
  console.log('1  the four approved strings (7j report: S1-J, S2-J, S3-J, S4-I), byte for byte');
  {
    const s1 = [...speak('Your sentence is about three years of experience that continues now, so we need "have worked" here, not "work."'), ...speak('Please say it again with "have worked."')];
    check('S1-J', JSON.stringify(s1) === JSON.stringify([`Your sentence is about three years of experience that continues now, so we need ${D} have worked ${D} here, not ${D} work.`, `Please say it again with ${D} have worked.`]), s1);
    const s2 = [...speak('Good, you used "attended" for a finished event at a specific time.'), ...speak('One small thing: we say "two years ago," and "in Tokyo" for the place.')];
    check('S2-J', JSON.stringify(s2) === JSON.stringify([`Good, you used ${D} attended ${D} for a finished event at a specific time.`, `One small thing: we say ${D} two years ago, and ${D} in Tokyo ${D} for the place.`]), s2);
    const s3 = speak('One small thing: we say "a donation project," not "donations project."');
    check('S3-J', JSON.stringify(s3) === JSON.stringify([`One small thing: we say ${D} a donation project, not ${D} donations project.`]), s3);
    const s4 = speak('過去の終わったできごとには「attended」を使います。');
    check('S4-I (Japanese-led: commas, no spaces)', JSON.stringify(s4) === JSON.stringify([`過去の終わったできごとには${C}attended${C}を使います。`]), s4);
    check('the dash is U+2014 and the Japanese comma U+3001 (bytes)', Buffer.from(s1[1]!).includes(Buffer.from([0xe2, 0x80, 0x94])) && Buffer.from(s4[0]!).includes(Buffer.from([0xe3, 0x80, 0x81])));
  }

  console.log('2  placement');
  {
    const end = speak('Please say "have worked".')[0]!;
    check('a target ending its sentence (no stop inside the quotes): a dash before, nothing after the sentence\'s own full stop', end === `Please say ${D} have worked.`, end);
    const endQ = speak('Which is right, "went" or "goed"?')[0]!;
    check('a question ending on a target: nothing after it; none before the first (it follows a comma)', endQ === `Which is right, went ${D} or ${D} goed?`, endQ);
    const bare = speak('We say "went"')[0]!;
    check('a target ending the text with no stop: nothing after it', bare === `We say ${D} went`, bare);
    const colon = speak('Say: "went" please.')[0]!;
    check('a target right after a colon: no dash before it (not doubled)', colon === `Say: went ${D} please.`, colon);
    const comma = speak('First, "went" is right.')[0]!;
    check('a target right after a comma: no dash before it', comma === `First, went ${D} is right.`, comma);
    const start = speak('"went" is right.')[0]!;
    check('a target at the start of the text: nothing before it', start === `went ${D} is right.`, start);
    const nextComma = speak('We say "went", then stop.')[0]!;
    check('a target followed by a comma outside the quotes: nothing after it', nextComma === `We say ${D} went, then stop.`, nextComma);
    const two = speak('We say "went" when the time is finished, not "goed".')[0]!;
    check('two targets: each set apart on its own (no shared pair)', two === `We say ${D} went ${D} when the time is finished, not ${D} goed.`, two);
    const near = speak('Say "went" and not "goed".')[0]!;
    check('two targets close together: still one dash either side of each', near === `Say ${D} went ${D} and not ${D} goed.`, near);
    const adj = speak('Use "a" "an" "the".')[0]!;
    check('adjacent targets: never two dashes in a row (the second shares the first\'s after-dash)', adj === `Use ${D} a ${D} an ${D} the.` && !new RegExp(`${D}\\s*${D}`).test(adj), adj);
    const three = speak('We say "went", "saw" and "met", never "goed".')[0]!;
    check('three or more targets: only the first two are targets (as before), the rest as written', three === `We say ${D} went, saw ${D} and met, never goed.`, three);
    const long = speak('Say "I attended a robotics exhibition in Tokyo two years ago." now.')[0]!;
    check('a quoted sentence (more than three words) gets nothing', long === restOfPath('Say "I attended a robotics exhibition in Tokyo two years ago." now.') && !long.includes(D), long);
    const ed = speak('Add "-ed" to the verb.')[0]!;
    check('an ending: "-ed" is set apart, reaches the voice as -ed', ed === `Add ${D} -ed ${D} to the verb.`, ed);
    const ja2 = speak('「an」を「important customer」の前に付けてください。');
    check('Japanese-led with two targets: a comma either side of each (none before the first at the start of the text), none doubled', ja2.length === 1 && ja2[0] === `an${C}を${C}important customer${C}の前に付けてください。`, ja2);
    const jaEnd = speak('これは「went」。')[0]!;
    check('Japanese-led target before its sentence\'s full stop: nothing after it', jaEnd === `これは${C}went。`, jaEnd);
    const jaLong = speak('例えば「I attended an exhibition last year.」です。');
    check('a Japanese sentence quoting an English sentence: split as before, no mark', jaLong.length === 3 && !jaLong.join('').includes(D) && !jaLong.join('').includes('<break'), jaLong);
    check('a number or a sound in quotes is not a target', speak('The "6" inch pipe and the "/z/" sound.')[0] === restOfPath('The "6" inch pipe and the "/z/" sound.'));
    check('no break tag is emitted on this path (any case above)', ![end, endQ, bare, colon, comma, start, nextComma, two, near, adj, three, ed, ...ja2, jaEnd].some((t) => t.includes('<break')));
    check('a stray mark is removed; text without marks is unchanged', targetPunctuation('a  b') === 'a  b' && !/[-]/.test(targetPunctuation(markTargets('Say "went" now.'))));
  }

  console.log('3  the rest of the speech path: no dash read aloud, one request per sentence');
  {
    const s = speak('One small thing: we say "two years ago," and "in Tokyo" for the place.');
    check('the whole sentence is one request (the dash and comma do not split it)', s.length === 1, s);
    check('the dash is not turned into a word by the path (rewriteForTTS is applied before the marks, so nothing reads them)', !/\b(dash|minus|hyphen)\b/i.test(s[0]!));
    check('the voice client: the flag is passed as the fourth argument', /withTargetPauses\(sentence, .*TUTOR_V2_TARGET_PAUSE && \(\(p\.current\.tutorLanguages\?\.length \?\? 0\) >= 2 \|\| !!p\.current\.pronunciation\), TUTOR_V2_TARGET_PUNCT\), \[\]\);/.test(readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'TutorVoiceV2.tsx'), 'utf8')));
  }

  console.log('4  captions, transcript and record are unchanged (the marks are only in the voice text)');
  {
    const SENT = 'Please add "an" before "important customer".';
    const cap = new V2Captions(); cap.begin(); cap.sentence(SENT, v2SpeechParts(SENT, ['en', 'ja']));
    const shown = cap.poll({ sentence: SENT, elapsedSec: 9, arrivedTotalSec: 3, playing: true }).text;
    check('the caption shows the sentence as written (no dash, no tag)', !shown.includes(D) && !shown.includes('<break'), shown);
    check('the speech parts (what the transcript and echo guard keep) are the written text', v2SpeechParts(SENT, ['en', 'ja']).join(' ') === SENT);
  }

  console.log('5  each flag off alone (a child process per switch)');
  {
    const child = (flag: string) => {
      const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', EMPHASIS_7L_CHILD: '1' }, encoding: 'utf8' });
      const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
      return line ? JSON.parse(line.slice('OFF_JSON '.length)) : { error: res.stderr };
    };
    const BR = '<break time="200ms"/>';
    const punctOff = child('TARGET_PUNCT');
    check('TARGET_PUNCT off alone: the 7h break tags, as at HEAD', punctOff.pause === true && punctOff.punct === false && JSON.stringify(punctOff.s2) === JSON.stringify([`Good, you used ${BR}attended${BR} for a finished event.`]), punctOff);
    const pauseOff = child('TARGET_PAUSE');
    check('TARGET_PAUSE off: no marks at all (as before 7h), whatever the punctuation flag says', pauseOff.pause === false && JSON.stringify(pauseOff.s2) === JSON.stringify(['Good, you used attended for a finished event.']), pauseOff);
    const on = child('NOTHING');
    check('both on (the default): the dashes', on.pause === true && on.punct === true && JSON.stringify(on.s2) === JSON.stringify([`Good, you used ${D} attended ${D} for a finished event.`]), on);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
