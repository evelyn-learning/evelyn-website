import { isHomeworkAnnouncement } from '../src/lib/tutor/voice/homework-announce';
import { buildHomeworkPointerSentence } from '../src/lib/tutor/voice/homework-pointer';

let pass = 0, fail = 0;
function check(name: string, ok: boolean) { if (ok) pass++; else { fail++; console.log(`  ✗ ${name}`); } }
const yes = [
  "Your practice for that stratified-design write-up is waiting in your practice area whenever you want it.",   // live 2026-09-05
  "I've queued two questions on sampling for you.",
  "A few problems on this are assigned for homework.",
  "Do the three exercises in your practice tab before next time.",
  "Those are waiting in your homework list.",
  "Try the stratified ones as homework tonight.",
];
const no = [
  "Let's practice this one more time together.",
  "Want to try a practice problem?",
  "That question is on the board, ready when you are.",
  "Nice work today, Vanshika — see you next time!",
  "The problem asks for the mean, so add them up first.",
  "Which questions are you unsure about?",
  "We'll wait for the assignment of treatments to be random.",
  // Fix round 3: the classifier must NOT fire on ordinary in-session speech
  // about a board problem — the reason the round-2 `set|left` widening was
  // reverted and the runtime pointer was reworded instead.
  "I've set a practice problem on the board for you.",
];
// Task 13 fix round 2: the runtime speaks the pointer itself. If the model
// then echoes that sentence, the announce gate must catch it — so the
// runtime's OWN wording has to be matched by this classifier.
for (const n of [1, 5] as const) {
  const pointer = buildHomeworkPointerSentence({
    los: n === 1
      ? [{ loId: 'alg1.multi-step', title: 'Variables on both sides', count: 1 }]
      : [{ loId: 'alg1.multi-step', title: 'Variables on both sides', count: 3 }, { loId: 'alg1.classify', title: 'Classifying solutions', count: 2 }],
    locator: 'Unit 2 · Practice',
  });
  check(`runtime pointer (n=${n}) is matched: "${(pointer ?? '').slice(0, 50)}"`, !!pointer && isHomeworkAnnouncement(pointer) === true);
}
for (const s of yes) check(`announce: "${s.slice(0, 50)}"`, isHomeworkAnnouncement(s) === true);
for (const s of no) check(`not: "${s.slice(0, 50)}"`, isHomeworkAnnouncement(s) === false);
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
