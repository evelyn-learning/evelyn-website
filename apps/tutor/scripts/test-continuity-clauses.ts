import { pickContinuityClause } from '../src/lib/tutor/ai/system-prompt-builder';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }
const hw = (overall: 'untouched' | 'partial' | 'done' | 'weak') => [{ assignmentId: 'a', sessionId: 's', assignedAt: '2026-09-03T00:00:00Z', los: [{ loId: 'lo1', title: 'Fractions', total: 4, attempted: overall === 'untouched' ? 0 : 4, correct: overall === 'weak' ? 1 : 3, status: overall === 'untouched' ? 'untouched' as const : 'done' as const }], overall }];
const cand = { loId: 'lo1', title: 'Fractions', reason: 'confirmed' as const, soft: false };
check('nothing → null', pickContinuityClause({}) === null);
const done = pickContinuityClause({ homework: hw('done'), recapCandidate: cand })!;
check('homework done → acknowledge clause, no recap offer', /done well/.test(done.clause) && done.recapOffer === undefined);
const weak = pickContinuityClause({ homework: hw('weak'), recapCandidate: cand })!;
check('homework weak → check + recap offer as its own second sentence', /homework/.test(weak.clause) && /two-minute recap/.test(weak.clause) && /second short sentence/.test(weak.clause) && weak.recapOffer?.loId === 'lo1');
const untouched = pickContinuityClause({ homework: hw('untouched'), recapCandidate: cand })!;
check('untouched → no guilt + recap offer as its own second sentence', /no guilt/.test(untouched.clause) && /two-minute recap/.test(untouched.clause) && /second short sentence/.test(untouched.clause) && untouched.recapOffer !== undefined);
const intent = pickContinuityClause({ nextTimeIntent: 'start with vertex form' })!;
check('next-time intent alone', /start with vertex form/.test(intent.clause) && intent.recapOffer === undefined);
const both = pickContinuityClause({ nextTimeIntent: 'start with vertex form', recapCandidate: cand })!;
check('intent + candidate → intent wins, recap offered as its own second sentence', /start with vertex form/.test(both.clause) && /two-minute recap/.test(both.clause) && /second short sentence/.test(both.clause) && both.recapOffer?.loId === 'lo1');
const recap = pickContinuityClause({ recapCandidate: { ...cand, soft: true } })!;
check('recap alone (soft) → offer clause with easy-to-decline', /easy to decline/.test(recap.clause) && recap.recapOffer?.soft === true);
check('every clause says this is the ONE continuity move', [done, weak, untouched, intent, both, recap].every((c) => /ONE continuity/.test(c.clause)));
check('no subject words leak', ![done, weak, untouched, intent, both, recap].some((c) => /fraction|algebra|vertex/i.test(c.clause.replace(/Fractions|vertex form/g, ''))));

// --- Fix round 1: no contradiction between "ONE sentence" and "ask ... wait" ---
const weakNoOffer = pickContinuityClause({ homework: hw('weak') })!;
check('weak, no recap candidate → check clause only, no recap mention', /homework/.test(weakNoOffer.clause) && weakNoOffer.recapOffer === undefined && !/two-minute recap/.test(weakNoOffer.clause));
const partialNoOffer = pickContinuityClause({ homework: hw('partial') })!;
check('partial, no recap candidate → check clause only, no recap mention', /homework/.test(partialNoOffer.clause) && partialNoOffer.recapOffer === undefined && !/two-minute recap/.test(partialNoOffer.clause));
const untouchedNoOffer = pickContinuityClause({ homework: hw('untouched') })!;
check('untouched, no recap candidate → no guilt, no recap mention', /no guilt/.test(untouchedNoOffer.clause) && untouchedNoOffer.recapOffer === undefined && !/two-minute recap/.test(untouchedNoOffer.clause));

// --- Minor 1: Oxford-comma join for 3+ LO titles; two titles stay "A and B" ---
const twoLoHw = [{ assignmentId: 'a', sessionId: 's', assignedAt: '2026-09-03T00:00:00Z', los: [
  { loId: 'lo1', title: 'Fractions', total: 4, attempted: 4, correct: 4, status: 'done' as const },
  { loId: 'lo2', title: 'Decimals', total: 4, attempted: 4, correct: 4, status: 'done' as const },
], overall: 'done' as const }];
const twoTitles = pickContinuityClause({ homework: twoLoHw })!;
check('two LO titles join as "A and B"', /Fractions and Decimals/.test(twoTitles.clause));
const threeLoHw = [{ assignmentId: 'a', sessionId: 's', assignedAt: '2026-09-03T00:00:00Z', los: [
  { loId: 'lo1', title: 'Fractions', total: 4, attempted: 4, correct: 4, status: 'done' as const },
  { loId: 'lo2', title: 'Decimals', total: 4, attempted: 4, correct: 4, status: 'done' as const },
  { loId: 'lo3', title: 'Percents', total: 4, attempted: 4, correct: 4, status: 'done' as const },
], overall: 'done' as const }];
const threeTitles = pickContinuityClause({ homework: threeLoHw })!;
check('3+ LO titles join with Oxford comma', /Fractions, Decimals, and Percents/.test(threeTitles.clause));

// --- Minor 3: double quotes in nextTimeIntent are normalized to single quotes ---
const quotedIntent = pickContinuityClause({ nextTimeIntent: 'start with "vertex form" review' })!;
check('nextTimeIntent double quotes replaced with single quotes', /'vertex form' review/.test(quotedIntent.clause) && !/"vertex form"/.test(quotedIntent.clause));

console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
