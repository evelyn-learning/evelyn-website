/**
 * Homework-help plans: advancing past the homework segment (homework-advance.ts).
 *
 * Fixture: portal-897212b5 (2026-10-06). Plan = [homework (concept), recap].
 * 6:31 advance_lesson({to:"free"}) for a recap detour; 9:15
 * advance_lesson({to:"next"}) to return — resolved from the stashed
 * `homework` to `recap`, and `homework` was recorded completed with the one
 * problem unsolved.
 *
 * Run: npx tsx scripts/test-homework-advance.ts
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { decideHomeworkAdvance, isMoveOnRequest, type HomeworkAdvanceInput } from '../src/lib/tutor/lesson-plan/homework-advance';
import { resolveAdvanceTarget } from '../src/lib/tutor/lesson-plan/context';
import { buildLessonProgress } from '../src/lib/tutor/portal/lesson-progress';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';

const __dirname = dirname(fileURLToPath(import.meta.url));

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (!cond) failures++;
  console.log(`${cond ? 'PASS' : 'FAIL'} — ${name}${!cond && detail ? ` (${detail})` : ''}`);
}

const base: HomeworkAdvanceInput = {
  isHomeworkPlan: true,
  segmentIds: ['homework', 'recap'],
  segmentKinds: { homework: 'concept', recap: 'recap' },
  fromSegId: 'homework',
  nextSegId: 'recap',
  returningFromFree: false,
  completedSegmentIds: new Set<string>(),
  studentText: 'Okay, got it.',
  current: 1,
  total: 1,
};

// ── the live defect: returning from the recap detour ────────────────────────
{
  const d = decideHomeworkAdvance({ ...base, returningFromFree: true });
  check('return from a free-mode detour ⇒ RESUME the homework segment', d.action === 'resume' && d.homeworkSegId === 'homework', JSON.stringify(d));
}
// ── not from free: blocked with a usable message ────────────────────────────
{
  const d = decideHomeworkAdvance(base);
  check('advance past homework with no completion and no request ⇒ soft-reject', d.action === 'reject');
  if (d.action === 'reject') {
    check('message says the position did not move', /has NOT moved/.test(d.reason));
    check('message offers the detour, the completion, and the skip', /advance_lesson\(\{to:"free"\}\)/.test(d.reason) && /mark_segment_complete\(\{segmentId:"homework"\}\)/.test(d.reason) && /asks to stop or move on/.test(d.reason));
    check('message names the problem in play', /problem 1 of 1 is in play/.test(d.reason));
  }
}
// ── never a trap ────────────────────────────────────────────────────────────
{
  check('brain marked it complete earlier ⇒ allow', decideHomeworkAdvance({ ...base, completedSegmentIds: ['homework'] }).action === 'allow');
  check('brain marks it complete in the same batch ⇒ allow', decideHomeworkAdvance({ ...base, markedCompleteThisBatch: ['homework'] }).action === 'allow');
  check('marked complete, returning from free ⇒ allow (goes on to recap)', decideHomeworkAdvance({ ...base, returningFromFree: true, completedSegmentIds: new Set(['homework']) }).action === 'allow');
  for (const said of ["Can we skip this one?", "let's move on", "I'm done", "that's enough for today", "I have to go", "[Skip-button-clicked: skip ahead]", "let's stop here", "next problem please", 'Bye!']) {
    const d = decideHomeworkAdvance({ ...base, studentText: said });
    check(`student: "${said}" ⇒ advances as a skip (segment left incomplete)`, d.action === 'allow_skipped' && d.homeworkSegId === 'homework', JSON.stringify(d));
  }
  check('a student request wins over the resume', decideHomeworkAdvance({ ...base, returningFromFree: true, studentText: "let's stop for today" }).action === 'allow_skipped');
  for (const said of ['Okay, got it.', 'Yes.', "let's finish this one first", 'what do I do next in this step?', 'dashed', "I don't know", 'Sure.']) {
    check(`student: "${said}" is not a request to move on`, !isMoveOnRequest(said));
  }
}
// ── everything else is untouched ────────────────────────────────────────────
{
  check('not a homework plan ⇒ allow', decideHomeworkAdvance({ ...base, isHomeworkPlan: false }).action === 'allow');
  check('moving back to homework ⇒ allow', decideHomeworkAdvance({ ...base, fromSegId: 'recap', nextSegId: 'homework' }).action === 'allow');
  check('already past homework ⇒ allow', decideHomeworkAdvance({ ...base, segmentIds: ['homework', 'recap', 'extra'], segmentKinds: { homework: 'concept', recap: 'recap', extra: 'extension' }, fromSegId: 'recap', nextSegId: 'extra' }).action === 'allow');
  check('staying on homework ⇒ allow', decideHomeworkAdvance({ ...base, nextSegId: 'homework' }).action === 'allow');
  check('a lesson plan with real segments is never touched (flag is homework-only)', decideHomeworkAdvance({ ...base, isHomeworkPlan: false, segmentIds: ['hook', 'concept', 'try', 'recap'], segmentKinds: {}, fromSegId: 'hook', nextSegId: 'concept' }).action === 'allow');
}

// ── end to end with the real resolver + progress builder ────────────────────
{
  const plan = {
    id: 'gen-test', title: 'Homework help', curriculum: 'freestyle', grade: 9, subject: 'math', topic: 't', locale: 'en',
    los: [{ id: 'gen-test.homework-lo-1', description: 'Work the uploaded problems in order.' }],
    segments: [
      { id: 'homework', kind: 'concept', goal: 'Work the uploaded problems in order, one at a time.', keyIdeas: ['k'] },
      { id: 'recap', kind: 'recap', goal: 'Recap', keyIdeas: ['k'] },
    ],
    prerequisites: [], followUps: [], schemaVersion: 1, metadata: { kind: 'homework-help', problems: [{ n: 1, text: 'Solve the system…' }] },
  } as unknown as LessonPlan;

  // What the runtime computed in the session: cursor released, stash = homework.
  const next = resolveAdvanceTarget(plan, 'homework', 'next', { consumedHashes: new Set(), completedSegmentIds: new Set() });
  check('fixture: the real resolver sends "next" from homework to recap', next === 'recap', String(next));
  const d = decideHomeworkAdvance({
    isHomeworkPlan: true,
    segmentIds: plan.segments.map((s) => s.id),
    segmentKinds: Object.fromEntries(plan.segments.map((s) => [s.id, s.kind])),
    fromSegId: 'homework', nextSegId: next ?? '', returningFromFree: true,
    completedSegmentIds: new Set<string>(), studentText: 'Okay, got it.', current: 1, total: 1,
  });
  check('…and the guard turns it into a resume', d.action === 'resume');
  const asWas = buildLessonProgress(plan, 'recap', ['homework']);
  const asNow = buildLessonProgress(plan, 'homework', []);
  check('progress as it was: homework completed, recap current', asWas?.currentSegmentId === 'recap' && asWas.completedSegmentIds.includes('homework'));
  check('progress now: homework current, nothing completed', asNow?.currentSegmentId === 'homework' && asNow.completedSegmentIds.length === 0);
  const skipped = buildLessonProgress(plan, 'recap', []);
  check('a student skip: recap current, homework NOT in completedSegmentIds', skipped?.currentSegmentId === 'recap' && !skipped.completedSegmentIds.includes('homework'));
}

// ── wiring ──────────────────────────────────────────────────────────────────
{
  const vtr = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'VoiceTutorRealtime.tsx'), 'utf8');
  check('advance_lesson consults the guard', /TUTOR_HOMEWORK_ADVANCE_GUARD\s+\? decideHomeworkAdvance\(/.test(vtr));
  check('a reject goes back to the brain as an advance_lesson rejection', /rejected\.push\(\{ action: 'advance_lesson', reason: hwAdvance\.reason \}\)/.test(vtr));
  check('a resume restores the cursor without applyResolvedAdvance', /hwAdvance\?\.action === 'resume'/.test(vtr) && /currentSegmentIdRef\.current = hwSeg;/.test(vtr));
  check('a skip leaves the segment out of the completed set', /leaveIncomplete: hwAdvance\.homeworkSegId/.test(vtr) && /segId !== opts\?\.leaveIncomplete/.test(vtr));
  check('the Skip button and the inferred (segment-card) advance are covered', /skipLeavesHomework \? \{ leaveIncomplete: skipFromSegId \}/.test(vtr) && /inferred advance "\$\{cursorId\}" → "\$\{segId\}" not applied/.test(vtr));
}

console.log(failures === 0 ? '\nAll homework-advance checks passed.' : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
