// Opener-filler strip (demo-polish, 2026-10-29): when the ack layer already
// spoke a filler for this turn, the brain's first sentence drops its own
// leading filler ("Okay, let's see." + "Okay, let's look at…" was the live
// stack in embed-1793240679836).
import { stripOpenerFiller } from '../src/lib/tutor/voice/opener-filler';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

check('strips Okay,', stripOpenerFiller("Okay, let's look at the point (2, 0).").text === "Let's look at the point (2, 0).");
check('strips Alright —', stripOpenerFiller('Alright — plug in x = 2.').text === 'Plug in x = 2.');
check('reports the word', stripOpenerFiller('So the origin is inside.').removed === 'So');
check('re-capitalises', stripOpenerFiller('So the origin is inside.').text === 'The origin is inside.');
check('keeps a filler-only sentence', stripOpenerFiller('Okay.').removed === null);
check('keeps short remainder', stripOpenerFiller('Okay, go on.').removed === null);
check('keeps verdict openers', stripOpenerFiller('Exactly, that is the boundary line.').removed === null);
check('keeps "Not quite"', stripOpenerFiller('Not quite, check the sign again.').removed === null);
check('keeps words that start with ok', stripOpenerFiller('Oklahoma is a state with a long name.').removed === null);
check('keeps "Right" as a verdict? no — spec lists it as filler', stripOpenerFiller('Right, so the sign flips here.').removed === 'Right');
check('untouched text returns the input', stripOpenerFiller('The line is dashed.').text === 'The line is dashed.');

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all opener-filler checks passed');
