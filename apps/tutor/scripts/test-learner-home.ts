/** Learner home (GDI learner home, task 5). Run: cd apps/tutor && npx tsx scripts/test-learner-home.ts */
import fs from 'node:fs';
import path from 'node:path';
import { startLessonUrl, rowLabel, levelBadge, needsSummaryRun, nextPollDelayMs } from '../src/app/tutor-portal/home/home-rows';

let passed = 0; let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ok  ${name}`); } else { failed++; console.log(`  FAIL ${name}${detail ? `  — ${detail}` : ''}`); }
}
const row = (o: Record<string, unknown> = {}) => ({
  sessionId: 's1', startedAt: '2026-11-03T10:05:00.000Z', durationSec: 600, status: 'completed', turnCount: 8, hasAudio: false,
  topic: 'Meetings', summary: { status: 'none' }, transcript: [], whiteboardCommands: [], ...o,
}) as any;

check('startLessonUrl encodes', startLessonUrl('a b') === '/tutor-portal/embed?token=a%20b&return=home');
check('completed label', rowLabel(row()).status === 'Completed');
check('other status = Ended early', rowLabel(row({ status: 'abandoned' })).status === 'Ended early');
check('title is topic', rowLabel(row()).title === 'Meetings');
check('when is the ISO start', rowLabel(row()).when === '2026-11-03T10:05:00.000Z');
check('badge null when pending', levelBadge({ status: 'pending' }) === null);
check('badge null when failed', levelBadge({ status: 'failed' }) === null);
const ready: any = { status: 'ready', summary: { level: { value: 'intermediate' } } };
check('badge for ready', levelBadge(ready) === 'Intermediate');
check('badge null for null level', levelBadge({ status: 'ready', summary: { level: { value: null } } } as any) === null);
check('run for none', needsSummaryRun({ status: 'none' }));
check('no run for pending', !needsSummaryRun({ status: 'pending' }));
check('no run for ready', !needsSummaryRun(ready));
check('no auto run for failed', !needsSummaryRun({ status: 'failed' }));
check('poll delay 3s at start', nextPollDelayMs(0) === 3000);
check('poll delay 3s at 57s', nextPollDelayMs(57_000) === 3000);
check('poll stops at 60s', nextPollDelayMs(60_000) === null);
check('card uses LocalTime and no startedPoll', /LocalTime/.test(fs.readFileSync(path.join(__dirname, '../src/app/tutor-portal/home/LearnerSessionCard.tsx'), 'utf8')) && !/startedPoll/.test(fs.readFileSync(path.join(__dirname, '../src/app/tutor-portal/home/LearnerSessionCard.tsx'), 'utf8')));

const src = fs.readFileSync(path.join(__dirname, '../src/app/tutor-portal/home/page.tsx'), 'utf8');
check('page lists with partner_id and student_id', /listLearnerSessions\(\s*payload\.partner_id,\s*(payload\.)?student_id/.test(src) || /listLearnerSessions\([^)]*partner_id[^)]*student_id/.test(src));
check('page refuses missing student_id', /student_id[\s\S]{0,200}<Refusal|!student_id[\s\S]{0,120}Refusal/.test(src));
check('home-rows has no react/next imports', !/from ['"](react|next)/.test(fs.readFileSync(path.join(__dirname, '../src/app/tutor-portal/home/home-rows.ts'), 'utf8')));
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
