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
check('keeps "Right" — a verdict opener (review minor, 2026-10-29)', stripOpenerFiller('Right, to the left of x = 4.').removed === null);
check('untouched text returns the input', stripOpenerFiller('The line is dashed.').text === 'The line is dashed.');
check('keeps a variable lowercase', stripOpenerFiller('So x = 2 gives y = 3.').text === 'x = 2 gives y = 3.');
check('keeps f(x) lowercase', stripOpenerFiller('Okay, f(x) = 2x + 1.').text === 'f(x) = 2x + 1.');
check('keeps "Now that"', stripOpenerFiller('Now that you have x, plug it in.').removed === null);
check('keeps "Now is"', stripOpenerFiller('Now is the time to check.').removed === null);
check('keeps "So far"', stripOpenerFiller('So far, so good, keep going.').removed === null);

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all opener-filler checks passed');
