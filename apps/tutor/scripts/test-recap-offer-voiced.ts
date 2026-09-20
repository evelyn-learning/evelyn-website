import { isRecapOfferVoiced } from '../src/lib/tutor/voice/recap-offer-voiced';

let pass = 0, fail = 0;
function check(name: string, ok: boolean, detail = '') {
  if (ok) pass++; else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); }
}
const voiced = [
  "No worries. I think a quick two-minute recap of this idea might help — want to do that now?",
  "Before we go on: would a short refresher on this help? Say the word and we'll step back.",
  "Let's circle back for a couple of minutes on that idea. Sound good?",
  "How about we run back through the definition quickly?",
];
const unvoiced = [
  "No worries — let's isolate just this piece. What's 3 squared, plus 1?",              // sub-question only (live probe)
  "Let's slow down right here. Which terms actually cancel out?",                        // no recap shape
  "Okay, quick recap: the derivative is the limit of the difference quotient.",            // started the recap, never asked
  "",
];
for (const s of voiced) check(`voiced: "${s.slice(0, 50)}"`, isRecapOfferVoiced(s) === true);
for (const s of unvoiced) check(`unvoiced: "${s.slice(0, 50)}"`, isRecapOfferVoiced(s) === false);
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
