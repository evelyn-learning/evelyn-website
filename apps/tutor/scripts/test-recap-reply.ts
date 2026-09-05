import { classifyRecapReply as c } from '../src/lib/tutor/voice/recap-reply';
let passed = 0, failed = 0;
function check(name: string, cond: boolean) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}`); } }
for (const s of ['sure', 'yes please', 'yeah', 'ok', 'okay let\'s do it', 'go ahead', 'that would help', 'why not', 'a quick one', 'yes', 'sounds good', 'let\'s do that']) check(`accept: "${s}"`, c(s) === 'accept');
for (const s of ['no', 'nah', 'not now', 'maybe later', 'skip it', 'let\'s keep going', 'move on', 'i\'m fine', 'i\'m good', 'i get it now', 'straight in', 'no thanks', 'let\'s just continue']) check(`decline: "${s}"`, c(s) === 'decline');
for (const s of ['what do you mean by recap', 'twelve', 'um', 'can you explain the vertex again', 'I think it is x equals 4']) check(`unclear: "${s}"`, c(s) === 'unclear');
check('accept with filler', c('um, yeah sure') === 'accept');
check('negated accept is decline', c('no, I\'m good') === 'decline');
check('first-clause anchoring: yes but…', c('yes but can we do it after this problem') === 'unclear');
check("first-clause anchoring: sure, what's…", c('sure, what\'s a recap?') === 'unclear');
check('first-clause anchoring: okay so number', c('okay so the answer is twelve') === 'unclear');
check("decline: don't think so", c('I don\'t think so') === 'decline');
check("decline: well + don't think so", c('well, I don\'t think so') === 'decline');
check('accept: yes please (short remainder)', c('yes please') === 'accept');
check("accept: sure let's do it (short remainder)", c('sure let\'s do it') === 'accept');
// Final review, Important 6 — spec-listed phrases that used to classify
// 'unclear', so a real decline was never counted as one (declines gate the
// soft/excluded logic in pickRecapCandidate).
for (const s of ['go straight in', "I'd rather go straight in", "let's just start", "let's just get going"]) check(`decline (final review): "${s}"`, c(s) === 'decline');
check('accept (final review): "sure why not"', c('sure why not') === 'accept');
// The "why not" exemption is remainder-scoped only — a long or marker-bearing
// reply that happens to contain it stays unclear.
check('why-not exemption does not widen: "sure, why not after this problem?"', c('sure, why not after this problem?') === 'unclear');
// Scoped re-review: the unanchored decline must be those four shapes only.
// "let's just start THE RECAP" is an accept-shaped request, not a decline —
// and decline is tested first, so a loose alternation would have stolen it.
check('unanchored decline stays narrow: "yeah, let\'s just start the recap"', c("yeah, let's just start the recap") === 'unclear', `got ${c("yeah, let's just start the recap")}`);
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
