import { isLedgerStuckCue } from '../src/lib/tutor/orchestrator/struggle-ledger';

let pass = 0, fail = 0;
function check(name: string, ok: boolean, detail = '') { if (ok) pass++; else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); } }
const yes = [
  "I don't know",
  "I don't get it",
  "Um, I don't know, maybe 12?",
  "I'm stuck, I don't get it",
  "Honestly I don't understand this part at all, can we slow down here please",   // cue leads, ≤25 words
  "Can you walk me through it?",
  "So how do I even start this one, there are so many parts to it and I keep mixing up the order of operations",  // explicit anywhere
  "no wait, I'm stuck again, I don't get it",
  "I don't understand.",
];
const no = [
  // live 2026-09-05: fillers/hedges inside long correct answers
  "So, um, idea number 2 is the experiment. Um, idea one would be the observational study. And um, the confounding variable might be um, that again, you know, maybe the kids who uh study with music, maybe they just uh, I don't know, study way more than the ones who don't. You know, you never know, so again, there's that like bias sneaking up in idea number one.",
  "Uh, yeah, let's do it. Also, um, I just had a quick doubt. I don't know if this topic comes up later in unit 3, but um, while I was, you know, I have an upcoming test on these topics, but what is the difference between random assignment and random sampling?",
  "Uh, the first move would probably be to like shuffle up the tickets. I don't know if I'm thinking of this in the right way.",
  "Uh, well, because, well, I don't know like how to frame it properly, but idea 2 would give us real data because number one could have a lot of biases, and I think 2 controls the biases better.",
  "I don't know why they chose that, but the answer is 42 because the mean is the sum over the count.",
  "yeah",
  "the derivative is 2x",
  "",
];
for (const s of yes) check(`stuck: "${s.slice(0, 50)}"`, isLedgerStuckCue(s) === true);
for (const s of no) check(`not stuck: "${s.slice(0, 50)}"`, isLedgerStuckCue(s) === false);
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
