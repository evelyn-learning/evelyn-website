/** Learner home (GDI learner home, task 5). Run: cd apps/tutor && npx tsx scripts/test-learner-home.ts */
import fs from 'node:fs';
import path from 'node:path';
import {
  startLessonUrl, rowLabel, levelBadge, needsSummaryRun, nextPollDelayMs, panelPollDelayMs, postRetryDelayMs,
  isInProgress, shouldRunSummary, cardShouldPoll, IN_PROGRESS_WINDOW_MS,
} from '../src/app/tutor-portal/home/home-rows';
import { toStoredWhiteboardCommands } from '../src/app/tutor-portal/embed/stored-whiteboard';

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
// C1: the end panel's PDF gets the STORED shape {action, data, timestamp}, same mapping as the save.
check('embed end panel passes the stored whiteboard shape', /whiteboardCommands=\{toStoredWhiteboardCommands\(whiteboardCommands\)\}/.test(endBranch));
check('embed save uses the same mapping', /whiteboardCommands: toStoredWhiteboardCommands\(whiteboardCommands\)/.test(embedSrc));
{
  const stored = toStoredWhiteboardCommands([
    { cmd: { action: 'showSentence', sentence: 'I work as a manager.', emphasis: ['a'] } as any, capturedAt: '2026-11-05T10:00:00.000Z', sourceMessageIndex: 3 },
    { cmd: { action: 'clear' } as any, capturedAt: '2026-11-05T10:01:00.000Z' },
  ]) as any[];
  check('stored shape: action + data payload + capture timestamp', stored[0].action === 'showSentence' && stored[0].data.sentence === 'I work as a manager.'
    && stored[0].data.emphasis[0] === 'a' && stored[0].data.action === undefined && stored[0].timestamp === '2026-11-05T10:00:00.000Z' && stored[0].sourceMessageIndex === 3, JSON.stringify(stored[0]));
  check('stored shape: sourceMessageIndex omitted when unknown', !('sourceMessageIndex' in stored[1]) && stored[1].action === 'clear');
}
check('panel POSTs then GETs', /setTimeout\(\(\) => start\(1\), FIRST_POST_DELAY_MS\)/.test(panelSrc) && panelSrc.indexOf("method: 'POST'") > panelSrc.indexOf('const start = async') && panelSrc.lastIndexOf('setTimeout(poll', panelSrc.indexOf('// The completed save')) > panelSrc.indexOf("method: 'POST'") && /\$\{API\}\?sessionId=/.test(panelSrc));
// M3: the panel mounts only after the completed save settled, so it POSTs at once.
check('panel POSTs without a pre-delay', /const FIRST_POST_DELAY_MS = 0;/.test(panelSrc));
check('embed renders the panel only after the final save settled', /finalSaveSettled \?\s*\(\s*<LessonSummaryPanel/.test(endBranch));
check('embed final save sets finalSaveSettled in finally', /Promise\.resolve\(saveSession\(endIntent === 'discard' \? 'abandoned' : 'completed'\)\)\s*\.finally\(\(\) => setFinalSaveSettled\(true\)\)/.test(embedSrc));
check('embed final save has a 15 s settle fallback', /setTimeout\(\(\) => setFinalSaveSettled\(true\), FINAL_SAVE_SETTLE_MS\)/.test(embedSrc) && /const FINAL_SAVE_SETTLE_MS = 15_000;/.test(embedSrc));
check('saveSession returns the completed fetches', /return Promise\.allSettled\(\[/.test(embedSrc));
check('panel back link only for return=home', /get\('return'\) === 'home'|showHomeLink/.test(panelSrc) && /return/.test(embedSrc.slice(embedSrc.indexOf('  if (sessionEnded) {\n    return ('), embedSrc.indexOf('  if (sessionEnded) {\n    return (') + 1600)) && /\/tutor-portal\/home\?token=/.test(panelSrc + embedSrc));
check('panel falls back to Session Complete on 401/403', /401|403/.test(panelSrc) && /Session Complete/.test(panelSrc));
check('panel reuses SummaryBody', /SummaryBody/.test(panelSrc) && /export default function SummaryBody/.test(bodySrc));
check('card reuses SummaryBody', /SummaryBody/.test(rd('../src/app/tutor-portal/home/LearnerSessionCard.tsx')));
check('panel poll schedule 2s then 10s, 2min cap', panelPollDelayMs(0) === 2000 && panelPollDelayMs(29_000) === 2000 && panelPollDelayMs(30_000) === 10_000 && panelPollDelayMs(119_000) === 10_000 && panelPollDelayMs(120_000) === null);
check('postRetryDelayMs 3s for attempts 1-5, null after', postRetryDelayMs(1) === 3000 && postRetryDelayMs(5) === 3000 && postRetryDelayMs(6) === null && postRetryDelayMs(0) === null);
check('panel has run state, Retry bumps it, no one-shot POST in Retry', /useState\(0\)/.test(panelSrc) && /setRun\(\(n\) => n \+ 1\)/.test(panelSrc) && (panelSrc.match(/method: 'POST'/g) ?? []).length === 1);
check('panel fires an immediate GET on mount before the delayed POST', panelSrc.indexOf('// Immediate GET') > -1 && panelSrc.indexOf('// Immediate GET') < panelSrc.indexOf('setTimeout(() => start(1)'));
check('panel re-POSTs on 404/5xx', /r\.status === 404 \|\| r\.status >= 500/.test(panelSrc) && /postRetryDelayMs\(attempt\)/.test(panelSrc));

// I2: the end panel only for partner LANGUAGE lessons; home lists language lessons only.
check('embed panel gated on partner + subject languages', /config\.partner_id && config\.subject === 'languages'/.test(endBranch));
check('home lists language lessons only', /listLearnerSessions\([^;]*\)\)\.filter\(\(r\) => isLearnerSummarySubject\(r\.subject\)\)/.test(src));

// I1: kill switch on the home page — static line, no polling, no Retry, Replay/PDF kept.
check('no poll when summary disabled', !cardShouldPoll({ status: 'pending' }, { summaryDisabled: true, expired: false }));
check('no poll when link expired', !cardShouldPoll({ status: 'pending' }, { summaryDisabled: false, expired: true }));
check('poll when pending', cardShouldPoll({ status: 'pending' }, { summaryDisabled: false, expired: false }));
check('no run when disabled', !shouldRunSummary(row(), Date.parse('2026-11-05T00:00:00Z'), { summaryDisabled: true }));
check('home passes summaryDisabled from the kill switch', /const summaryDisabled = !learnerSummaryEnabled\(\);/.test(src) && /summaryDisabled=\{summaryDisabled\}/.test(src));
const cardSrc = rd('../src/app/tutor-portal/home/LearnerSessionCard.tsx');
check('card uses cardShouldPoll in its effect', /if \(!cardShouldPoll\(state, \{ summaryDisabled, expired \}\)\) return;/.test(cardSrc));
check('card disabled branch: static line, no Retry', /summaryDisabled \? \(\s*<p className="text-sm text-gray-500">Summary not available<\/p>/.test(cardSrc));

// M4: a summary is shown whatever the status (kept while regenerating / after a failed regeneration).
check('card shows any stored summary', /const s = summaryDisabled \? undefined : state\.summary;/.test(cardSrc));
check('card Retry keeps the old summary', /setState\(\(prev\) => \(\{ \.\.\.prev, status: 'pending' \}\)\)/.test(cardSrc));
check('panel shows any stored summary', /\{state\.summary && <SummaryBody summary=\{state\.summary\} \/>\}/.test(panelSrc));
check('badge from a kept summary while regenerating', levelBadge({ status: 'pending', summary: { level: { value: 'advanced' } } } as any) === 'Advanced');

// M5: an active row updated in the last 35 min is "In progress" and not summarised.
const t = Date.parse('2026-11-05T10:00:00Z');
const live = row({ status: 'active', updatedAt: new Date(t - 10 * 60_000).toISOString() });
const stale = row({ status: 'active', updatedAt: new Date(t - 36 * 60_000).toISOString() });
check('35-minute window', IN_PROGRESS_WINDOW_MS === 35 * 60_000);
check('active + recent = in progress', isInProgress(live, t) && rowLabel(live, t).status === 'In progress');
check('active + 36 min old = ended early', !isInProgress(stale, t) && rowLabel(stale, t).status === 'Ended early');
check('completed is never in progress', !isInProgress(row({ updatedAt: new Date(t).toISOString() }), t));
check('in progress: no summary run', !shouldRunSummary(live, t, { summaryDisabled: false }) && shouldRunSummary(stale, t, { summaryDisabled: false }));
check('home passes the token tutor_languages as fallback', /const fallbackTutorLanguages = tokenTutorLanguages\(payload\.tutor_languages\);/.test(src) && /runSummaryForSession\(row\.sessionId, undefined, \{ fallbackTutorLanguages \}\)/.test(src));
check('home uses shouldRunSummary', /shouldRunSummary\(row, now, \{ summaryDisabled \}\)/.test(src));

// M16: the card stops on 401/403 and says the link expired.
check('card stops polling on 401/403', /if \(r\.status === 401 \|\| r\.status === 403\) \{ setExpired\(true\); return; \}/.test(cardSrc));
check('card expired line', cardSrc.includes('This link has expired. Ask for a new one.'));

// SummaryBody hides empty support-language lines.
check('SummaryBody hides empty _ja lines', /\{ja && <p/.test(bodySrc));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
