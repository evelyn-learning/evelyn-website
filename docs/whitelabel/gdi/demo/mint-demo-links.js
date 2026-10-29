#!/usr/bin/env node
// Mint the GDI demo session links (bilingual en+ja, one teacher voice per lesson).
//   PARTNER_SECRET="$(cat ~/.evelyn/partners/gdi-demo.secret)" node mint-demo-links.js [starter|advanced|meeting] [--ttl_hours 360] [--keep_student] [--local]
//
// TRIAL (25-min work-projects lesson, 4 testers + Josh + Praveen):
//   PARTNER_SECRET="$(cat ~/.evelyn/partners/gdi-demo.secret)" node mint-demo-links.js trial [--testers 4] [--local]
//   - gdi-trial-1..N use FIXED student ids (a tester's 2nd lesson skips the level check);
//     Josh + Praveen get FRESH ids each mint (level check can be re-seen on request).
//   - ttl defaults to 720 h for `trial`; no is_trial / wrap_at_minutes claims.
//
// Minute pool (PROD WRITES — Praveen runs these, NOT this script), before the trial starts:
//   scripts/ops/partner-pool.sh set gdi-demo 300
//   scripts/ops/partner-pool.sh session-max gdi-demo 30
'use strict';
const path = require('path');
const { signEmbedToken } = require(path.join(__dirname, '../../kanzoo/examples/sign-embed-token.js'));
const teachers = require('./teachers.json');
const secret = process.env.PARTNER_SECRET;
if (!secret) { console.error('set PARTNER_SECRET'); process.exit(1); }
const ttlIdx = process.argv.indexOf('--ttl_hours');
const argv = process.argv.slice(2);
const isTrial = argv.includes('trial');
const ttlHours = ttlIdx > 0 ? Number(process.argv[ttlIdx + 1]) : (isTrial ? 720 : 360);
const testersIdx = process.argv.indexOf('--testers');
const testers = testersIdx > 0 ? Number(process.argv[testersIdx + 1]) : 4;
if (isTrial && !(Number.isInteger(testers) && testers >= 0 && testers <= 50)) { console.error('--testers must be an integer 0-50'); process.exit(1); }
// --local: links for run-local.sh (http://localhost:3019) instead of the demo engine.
const EMBED = process.argv.includes('--local')
  ? `http://localhost:${process.env.PORT || 3019}/tutor-portal/embed`
  : 'https://tutor-demo.evelynlearning.com/tutor-portal/embed';
const LESSONS = [
  { key: 'starter', plan: 'gdi.demo.english.experiences.starter.v1', teacher: 'ryota', rate: 0.75, level: 'Adult beginner (A1)', topic: 'Experiences — Starter', student: 'gdi-demo-beginner' },
  { key: 'advanced', plan: 'gdi.demo.english.experiences.advanced.v1', teacher: 'jameson', rate: 0.85, level: 'Adult advanced (A2–B1)', topic: 'Experiences — Talking About the Past', student: 'gdi-demo-advanced' },
  { key: 'meeting', plan: 'gdi.demo.english.meeting-skills.u1-scheduling.v1', teacher: 'jameson', rate: 0.85, level: 'Adult business English', topic: 'Meeting Skills 1 — Scheduling a Meeting', student: 'gdi-demo-business' },
];
const now = Math.floor(Date.now() / 1000);
// Every mint is a NEW learner (2026-10-16, embed-1792174263669): a reused
// student_id has prior sessions, so the tutor opens as a returning learner
// ("昨日お話しした…") and recalls earlier sessions' answers. Re-mint before
// each test and before the demo. --keep_student reuses the base ids.
const keepStudent = process.argv.includes('--keep_student');
const studentSuffix = keepStudent ? '' : `-${now.toString(36)}`;
if (isTrial) {
  const ryota = teachers.find((t) => t.id === 'ryota');
  const trialClaims = (studentId, name) => ({
    partner_id: 'gdi-demo', student_id: studentId, student_name: name,
    subject: 'languages', level: 'Adult working professional', topic: 'Work projects',
    curriculum_module: 'gdi.trial.english.work-projects.v1', target_kind: 'lessonNode', input_mode: 'voice',
    teacher: ryota, tutor_languages: ['en', 'ja'], speech_rate: 0.8, thinking_cue: true,
    max_duration_minutes: 30, iat: now, exp: now + Math.round(ttlHours * 3600),
  });
  const fresh = now.toString(36);
  const rows = [];
  for (let n = 1; n <= testers; n++) rows.push([`tester-${n}`, trialClaims(`gdi-trial-${n}`, 'Trial Tester')]);
  rows.push(['josh', trialClaims(`gdi-trial-josh-${fresh}`, 'Josh')]);
  rows.push(['praveen', trialClaims(`gdi-trial-praveen-${fresh}`, 'Praveen')]);
  for (const [label, payload] of rows) console.log(`${label}\t${EMBED}?token=${signEmbedToken(payload, secret)}`);
  return;
}
for (const l of LESSONS) {
  const payload = {
    partner_id: 'gdi-demo', student_id: l.student + studentSuffix, student_name: 'Demo Learner',
    subject: 'languages', level: l.level, topic: l.topic,
    curriculum_module: l.plan, target_kind: 'lessonNode', input_mode: 'voice',
    teacher: teachers.find((t) => t.id === l.teacher), tutor_languages: ['en', 'ja'], speech_rate: l.rate, thinking_cue: true,
    max_duration_minutes: 30, iat: now, exp: now + Math.round(ttlHours * 3600),
  };
  console.log(`${l.key}\t${EMBED}?token=${signEmbedToken(payload, secret)}`);
}
