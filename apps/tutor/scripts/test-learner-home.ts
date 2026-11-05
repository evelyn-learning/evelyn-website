/** Learner home (GDI learner home, task 5). Run: cd apps/tutor && npx tsx scripts/test-learner-home.ts */
import fs from 'node:fs';
import path from 'node:path';
import { startLessonUrl, rowLabel, levelBadge, needsSummaryRun, nextPollDelayMs, panelPollDelayMs, postRetryDelayMs } from '../src/app/tutor-portal/home/home-rows';

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

// Task 6: end-of-lesson panel on the embed page
const rd = (f: string) => { try { return fs.readFileSync(path.join(__dirname, f), 'utf8'); } catch { return ''; } };
const embedSrc = rd('../src/app/tutor-portal/embed/page.tsx');
const panelSrc = rd('../src/app/tutor-portal/embed/LessonSummaryPanel.tsx');
const bodySrc = rd('../src/app/tutor-portal/home/SummaryBody.tsx');
const endBranch = embedSrc.slice(embedSrc.indexOf('  if (sessionEnded) {\n    return ('), embedSrc.indexOf('  if (sessionEnded) {\n    return (') + 1600);
check('embed end branch renders LessonSummaryPanel for partners', /config\.partner_id[\s\S]{0,200}<LessonSummaryPanel/.test(endBranch));
check('embed end branch keeps Session Complete fallback', /Session Complete/.test(endBranch));
check('embed passes whiteboard cmds only', /whiteboardCommands=\{whiteboardCommands\.map\(\(x\) => x\.cmd\)\}/.test(endBranch));
check('panel POSTs then GETs', /setTimeout\(\(\) => start\(1\), FIRST_POST_DELAY_MS\)/.test(panelSrc) && panelSrc.indexOf("method: 'POST'") > panelSrc.indexOf('const start = async') && panelSrc.lastIndexOf('setTimeout(poll', panelSrc.indexOf('// The completed save')) > panelSrc.indexOf("method: 'POST'") && /\$\{API\}\?sessionId=/.test(panelSrc));
check('panel waits 1.5s before first POST', /1500/.test(panelSrc));
check('panel back link only for return=home', /get\('return'\) === 'home'|showHomeLink/.test(panelSrc) && /return/.test(embedSrc.slice(embedSrc.indexOf('  if (sessionEnded) {\n    return ('), embedSrc.indexOf('  if (sessionEnded) {\n    return (') + 1600)) && /\/tutor-portal\/home\?token=/.test(panelSrc + embedSrc));
check('panel falls back to Session Complete on 401/403', /401|403/.test(panelSrc) && /Session Complete/.test(panelSrc));
check('panel reuses SummaryBody', /SummaryBody/.test(panelSrc) && /export default function SummaryBody/.test(bodySrc));
check('card reuses SummaryBody', /SummaryBody/.test(rd('../src/app/tutor-portal/home/LearnerSessionCard.tsx')));
check('panel poll schedule 2s then 10s, 2min cap', panelPollDelayMs(0) === 2000 && panelPollDelayMs(29_000) === 2000 && panelPollDelayMs(30_000) === 10_000 && panelPollDelayMs(119_000) === 10_000 && panelPollDelayMs(120_000) === null);
check('postRetryDelayMs 3s for attempts 1-5, null after', postRetryDelayMs(1) === 3000 && postRetryDelayMs(5) === 3000 && postRetryDelayMs(6) === null && postRetryDelayMs(0) === null);
check('panel has run state, Retry bumps it, no one-shot POST in Retry', /useState\(0\)/.test(panelSrc) && /setRun\(\(n\) => n \+ 1\)/.test(panelSrc) && (panelSrc.match(/method: 'POST'/g) ?? []).length === 1);
check('panel fires an immediate GET on mount before the delayed POST', panelSrc.indexOf('// Immediate GET') > -1 && panelSrc.indexOf('// Immediate GET') < panelSrc.indexOf('setTimeout(() => start(1)'));
check('panel re-POSTs on 404/5xx', /r\.status === 404 \|\| r\.status >= 500/.test(panelSrc) && /postRetryDelayMs\(attempt\)/.test(panelSrc));
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
