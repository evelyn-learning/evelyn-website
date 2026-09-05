import { isHomeworkAnnouncement } from '../src/lib/tutor/voice/homework-announce';

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
];
for (const s of yes) check(`announce: "${s.slice(0, 50)}"`, isHomeworkAnnouncement(s) === true);
for (const s of no) check(`not: "${s.slice(0, 50)}"`, isHomeworkAnnouncement(s) === false);
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
