import { pickRecapCandidate } from '../src/lib/tutor/learner-model/recap-candidate';
import type { GapEntry } from '../src/lib/tutor/student-profile/types';
import type { HomeworkStatus } from '../src/lib/tutor/practice-assign/status';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }
const now = new Date('2026-09-05T00:00:00Z');
const iso = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const planLos = [{ loId: 'lo1', title: 'One' }, { loId: 'lo2', title: 'Two' }, { loId: 'lo3', title: 'Three' }];
const gap = (loId: string, extra: Partial<GapEntry> & { evidence?: Partial<GapEntry['evidence']> } = {}): GapEntry => ({
  id: `g-${loId}`, kind: 'lo', loId, status: 'confirmed', confidence: 0.75, firstSeenAt: iso(10), lastSeenAt: iso(2),
  ...extra, evidence: { signals: [], observation: 'o', studentQuotes: [], ...(extra.evidence ?? {}) } as GapEntry['evidence'],
});
const hw = (loId: string, overall: HomeworkStatus['overall']): HomeworkStatus => ({ assignmentId: 'a', sessionId: 's', assignedAt: iso(3), los: [{ loId, title: 'One', total: 4, attempted: 2, correct: 0, status: 'partial' }], overall });
const base = { planLos, projections: new Map(), gaps: [], homework: [], now };

check('nothing → null', pickRecapCandidate(base) === null);
check('homework weak wins', pickRecapCandidate({ ...base, homework: [hw('lo2', 'weak')], gaps: [gap('lo1', { evidence: { recurrenceCount: 2 } })] })?.reason === 'homework-weak');
check('homework done is not a candidate', pickRecapCandidate({ ...base, homework: [hw('lo2', 'done')] }) === null);
check('recurred confirmed gap before review-due', pickRecapCandidate({ ...base, gaps: [gap('lo1', { evidence: { recurrenceCount: 1 } })], projections: new Map([['lo2', { estimate: 0.3, reviewDueAt: new Date(now.getTime() - 1) }]]) })?.loId === 'lo1');
check('review-due LO below moderate band', pickRecapCandidate({ ...base, projections: new Map([['lo2', { estimate: 0.6, reviewDueAt: new Date(now.getTime() - 1) }]]) })?.reason === 'review-due');
check('review-due but strong estimate → not a candidate', pickRecapCandidate({ ...base, projections: new Map([['lo2', { estimate: 0.9, reviewDueAt: new Date(now.getTime() - 1) }]]) }) === null);
check('review not yet due → null', pickRecapCandidate({ ...base, projections: new Map([['lo2', { estimate: 0.4, reviewDueAt: new Date(now.getTime() + 86400000) }]]) }) === null);
check('plain confirmed gap on a plan LO', pickRecapCandidate({ ...base, gaps: [gap('lo3')] })?.reason === 'confirmed');
check('candidate-status gap never offers', pickRecapCandidate({ ...base, gaps: [gap('lo3', { status: 'candidate', confidence: 0.25 })] }) === null);
check('gap on a non-plan LO ignored', pickRecapCandidate({ ...base, gaps: [gap('zzz')] }) === null);
check('declined once → soft', pickRecapCandidate({ ...base, gaps: [gap('lo1', { evidence: { recap: { offers: 1, accepts: 0, declines: 1, lastOfferAt: iso(2), lastOutcome: 'declined' } } })] })?.soft === true);
check('declined twice → excluded', pickRecapCandidate({ ...base, gaps: [gap('lo1', { evidence: { recap: { offers: 2, accepts: 0, declines: 2, lastOfferAt: iso(2), lastOutcome: 'declined' } } })] }) === null);
check('stale confirmed gap (>90d) excluded', pickRecapCandidate({ ...base, gaps: [gap('lo1', { lastSeenAt: iso(120) })] }) === null);
check('title comes from the plan', pickRecapCandidate({ ...base, gaps: [gap('lo3')] })?.title === 'Three');
const hwDoneUntouched: HomeworkStatus = { assignmentId: 'a', sessionId: 's', assignedAt: iso(3), overall: 'partial', los: [
  { loId: 'lo1', title: 'One', total: 4, attempted: 4, correct: 4, status: 'done' },
  { loId: 'lo2', title: 'Two', total: 4, attempted: 0, correct: 0, status: 'untouched' },
] };
{
  const r = pickRecapCandidate({ ...base, homework: [hwDoneUntouched] });
  check('per-LO status: done LO skipped, untouched LO offered', r?.loId === 'lo2' && r?.reason === 'homework-weak');
}
const hwBothDoneOverallStale: HomeworkStatus = { assignmentId: 'a', sessionId: 's', assignedAt: iso(3), overall: 'partial', los: [
  { loId: 'lo1', title: 'One', total: 4, attempted: 4, correct: 4, status: 'done' },
  { loId: 'lo2', title: 'Two', total: 4, attempted: 4, correct: 4, status: 'done' },
] };
check('per-LO status: both LOs done despite stale overall → falls through, null', pickRecapCandidate({ ...base, homework: [hwBothDoneOverallStale] }) === null);
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
