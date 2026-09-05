import { classifyRecapReply as c } from '../src/lib/tutor/voice/recap-reply';
let passed = 0, failed = 0;
function check(name: string, cond: boolean) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}`); } }
for (const s of ['sure', 'yes please', 'yeah', 'ok', 'okay let\'s do it', 'go ahead', 'that would help', 'why not', 'a quick one', 'yes', 'sounds good', 'let\'s do that']) check(`accept: "${s}"`, c(s) === 'accept');
for (const s of ['no', 'nah', 'not now', 'maybe later', 'skip it', 'let\'s keep going', 'move on', 'i\'m fine', 'i\'m good', 'i get it now', 'straight in', 'no thanks', 'let\'s just continue']) check(`decline: "${s}"`, c(s) === 'decline');
for (const s of ['what do you mean by recap', 'twelve', 'um', 'can you explain the vertex again', 'I think it is x equals 4']) check(`unclear: "${s}"`, c(s) === 'unclear');
check('accept with filler', c('um, yeah sure') === 'accept');
check('negated accept is decline', c('no, I\'m good') === 'decline');
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
