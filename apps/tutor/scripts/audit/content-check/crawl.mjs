// GAC content check — PART B crawl of the deployed sandbox (plain Node 18+, no dependencies).
//
//   node scripts/audit/content-check/crawl.mjs --skills <results>/skills.json --log <scratch>/crawl-log.jsonl \
//        --students <results>/test-students.txt [--gen-budget 120] [--rpm 50] [--only SUBJECT[,SUBJECT]] [--phase 1|2|all]
//
// Talks to the sandbox exactly as a browser does: signs in through the signed launch link
// (token minted from the launch secret file — the secret is never printed), then calls the
// web app's own routes: POST /api/me/self-study-enrol, POST /api/practice.
// Opens no database connection.
//
// Phase 1 — stored sweep. For every skill, draw until every item Part A says is in service has
//   been served. The draw size is min(3, items still unserved): the UI always asks for 3, but a
//   draw larger than what is left makes the engine GENERATE new items, and generation is capped
//   at 500 items a day ACROSS ALL BRANDS (practice-gen.ts GLOBAL_DAILY_CAP). A full "ask for 3
//   until empty" crawl of 1,032 skills would spend that whole budget and leave every brand's
//   students without top-up items until 00:00 UTC.
// Phase 2 — "as the UI asks" probes (draw size 3) on a deterministic sample of skills, limited
//   by --gen-budget (generation slots this run may cause to be reserved).
//
// Resumable: every response is appended to the log; a re-run skips skills already finished.
import { readFileSync, appendFileSync, existsSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { createHmac, randomUUID } from 'node:crypto';

const WEB = 'https://greenapple.evelynlearning.com';
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const SKILLS = JSON.parse(readFileSync(arg('skills'), 'utf8'));
const LOG = arg('log');
const STUDENTS_FILE = arg('students');
const GEN_BUDGET = Number(arg('gen-budget', '120'));
const RPM = Math.min(55, Number(arg('rpm', '50')));
const ONLY = arg('only', '') ? new Set(arg('only', '').split(',')) : null;
const PHASE = arg('phase', 'all');
const MAX_SKILLS = Number(arg('max-skills', '0')); // smoke runs only
const RUN_TAG = arg('tag', new Date().toISOString().slice(0, 10).replace(/-/g, ''));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastAt = 0;
const gap = Math.ceil(60000 / RPM);
async function paced() { const wait = lastAt + gap - Date.now(); if (wait > 0) await sleep(wait); lastAt = Date.now(); }
const log = (rec) => appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), ...rec }) + '\n');

/* ---------------- sign-in through the launch link ---------------- */
const b64url = (buf) => Buffer.from(buf).toString('base64url');
function mintLaunchToken(studentId) {
  const secret = readFileSync(`${homedir()}/.evelyn/partners/greenapple-launch.secret`, 'utf8').trim();
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify({ iss: 'greenapple', sub: studentId, iat: now, exp: now + 120, jti: randomUUID(), grade: '11', dest: 'practice' }));
  return `${header}.${body}.${createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')}`;
}
const cookies = new Map();
async function signIn(studentId) {
  if (cookies.has(studentId)) return cookies.get(studentId);
  await paced();
  const res = await fetch(`${WEB}/launch?token=${mintLaunchToken(studentId)}`, { redirect: 'manual' });
  const ck = (res.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).filter((c) => /^[a-z_]+=.+/.test(c) && !/=$/.test(c));
  const session = ck.find((c) => c.startsWith('academy_session='));
  if (!session) throw new Error(`launch sign-in failed for ${studentId}: HTTP ${res.status}`);
  const known = existsSync(STUDENTS_FILE) ? readFileSync(STUDENTS_FILE, 'utf8') : '';
  if (!known.includes(studentId)) appendFileSync(STUDENTS_FILE, `${studentId}\tcreated-or-first-used ${new Date().toISOString()}\tvia signed launch link (partnerStudentId)\n`);
  cookies.set(studentId, ck.join('; '));
  log({ type: 'signin', student: studentId, status: res.status });
  return cookies.get(studentId);
}
async function post(studentId, path, body) {
  const cookie = await signIn(studentId);
  await paced();
  const t0 = Date.now();
  let status = 0; let json = null; let error;
  try {
    const res = await fetch(`${WEB}${path}`, { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(120000) });
    status = res.status;
    const text = await res.text();
    try { json = JSON.parse(text); } catch { json = { nonJson: text.slice(0, 300) }; }
  } catch (e) { error = String(e?.message ?? e); }
  return { status, json, error, ms: Date.now() - t0 };
}
const enrolled = new Set();
async function enrol(studentId, subject) {
  const k = `${studentId}|${subject}`;
  if (enrolled.has(k)) return;
  const r = await post(studentId, '/api/me/self-study-enrol', { courseKey: subject });
  log({ type: 'enrol', student: studentId, subject, status: r.status, ms: r.ms, courseId: r.json?.courseId, error: r.error });
  enrolled.add(k);
}
async function draw(studentId, sk, count, phase, note) {
  await enrol(studentId, sk.subject);
  const r = await post(studentId, '/api/practice', { courseId: sk.courseId, scope: { loId: sk.loId }, count });
  const items = Array.isArray(r.json?.items) ? r.json.items : [];
  log({ type: 'practice', phase, note, student: studentId, subject: sk.subject, loId: sk.loId, title: sk.title, count, status: r.status, ms: r.ms, error: r.error ?? (r.status >= 400 ? JSON.stringify(r.json).slice(0, 300) : undefined), practiceSetId: r.json?.practiceSetId, items, lastResult: r.json?.lastResult ? r.json.lastResult.length : undefined, extraKeys: r.json && !Array.isArray(r.json) ? Object.keys(r.json).filter((k) => !['practiceSetId', 'items', 'lastResult'].includes(k)) : [] });
  return { ...r, items };
}

/* ---------------- resume state ---------------- */
const done = new Set(); // `${phase}|${student}|${loId}`
const servedBy = new Map(); // `${student}|${loId}` → Set(ids)
let genReserved = 0;
if (existsSync(LOG)) for (const line of readFileSync(LOG, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const r = JSON.parse(line);
  // a skill that stopped on an error response / timeout is retried on the next run
  if (r.type === 'skill-done' && !/^http-/.test(r.stop ?? '')) done.add(`${r.phase}|${r.student}|${r.loId}`);
  if (r.type === 'practice') { const k = `${r.student}|${r.loId}`; const s = servedBy.get(k) ?? servedBy.set(k, new Set()).get(k); for (const it of r.items ?? []) s.add(it.id); }
  if (r.type === 'gen-reserved') genReserved += r.n;
}

const subjects = [...new Set(SKILLS.map((s) => s.subject))];
const sweepStudent = (subject) => `gac-final-check-${RUN_TAG}-s${(subjects.indexOf(subject) % 3) + 1}`;
const probeStudent = `gac-final-check-${RUN_TAG}-p1`;
const reserve = (n) => { if (n > 0) { genReserved += n; log({ type: 'gen-reserved', n }); } };

async function phase1() {
  let n = 0;
  for (const sk of SKILLS) {
    if (ONLY && !ONLY.has(sk.subject)) continue;
    if (MAX_SKILLS && ++n > MAX_SKILLS) break;
    const student = sweepStudent(sk.subject);
    if (done.has(`1|${student}|${sk.loId}`)) continue;
    const expected = new Set(sk.itemIds);
    const k = `${student}|${sk.loId}`;
    const served = servedBy.get(k) ?? servedBy.set(k, new Set()).get(k);
    let rounds = 0; let stop = expected.size === 0 ? 'no-stored-items' : '';
    const maxRounds = Math.ceil(expected.size / 3) + 3;
    while (!stop) {
      const remaining = [...expected].filter((id) => !served.has(id)).length;
      if (remaining === 0) { stop = 'all-stored-items-served'; break; }
      if (rounds >= maxRounds) { stop = 'round-limit'; break; }
      const count = Math.min(3, remaining);
      const r = await draw(student, sk, count, 1);
      rounds++;
      if (r.status !== 201 && r.status !== 200) { if (r.status === 429) await sleep(60000); stop = `http-${r.status || 'error'}`; break; }
      if (r.items.length < count) reserve(Math.min(2, count - r.items.filter((it) => expected.has(it.id)).length));
      if (r.items.length === 0) { stop = 'empty-response'; break; }
      const before = served.size;
      for (const it of r.items) served.add(it.id);
      if (served.size === before) { stop = 'no-new-items'; break; }
    }
    log({ type: 'skill-done', phase: 1, student, subject: sk.subject, loId: sk.loId, expected: expected.size, served: [...served].length, rounds, stop });
    done.add(`1|${student}|${sk.loId}`);
  }
}

async function phase2() {
  // deterministic sample: per subject the first zero-stored skill, the first 1–2-item skill, the first fully stocked skill
  const plan = [];
  for (const subject of subjects) {
    if (ONLY && !ONLY.has(subject)) continue;
    const mine = SKILLS.filter((s) => s.subject === subject);
    const zero = mine.find((s) => s.itemIds.length === 0);
    const thin = mine.find((s) => s.itemIds.length > 0 && s.itemIds.length < 3);
    const full = mine.find((s) => s.itemIds.length >= 3);
    if (zero) plan.push({ sk: zero, student: probeStudent, note: 'zero-stored, fresh student, first click', want: 2 });
    if (thin) plan.push({ sk: thin, student: probeStudent, note: 'thin (1-2 stored), fresh student, first click', want: Math.min(2, 3 - thin.itemIds.length) });
    if (full) plan.push({ sk: full, student: sweepStudent(subject), note: 'stocked, after the sweep: "Give me another" past the stored pool', want: 2 });
  }
  for (const p of plan) {
    if (done.has(`2|${p.student}|${p.sk.loId}`)) continue;
    if (genReserved + p.want > GEN_BUDGET) { log({ type: 'probe-skipped', reason: 'gen-budget', loId: p.sk.loId, subject: p.sk.subject, genReserved, budget: GEN_BUDGET }); continue; }
    reserve(p.want);
    const r = await draw(p.student, p.sk, 3, 2, p.note);
    log({ type: 'skill-done', phase: 2, student: p.student, subject: p.sk.subject, loId: p.sk.loId, note: p.note, status: r.status, items: r.items.length, ms: r.ms });
    done.add(`2|${p.student}|${p.sk.loId}`);
  }
  // one skill driven to the end as the UI would: keep asking for 3 until nothing comes back (per-student cap 20 a day)
  const capSkill = SKILLS.find((s) => s.subject === 'PHYSICS' && s.itemIds.length === 1 && (!ONLY || ONLY.has('PHYSICS')));
  if (capSkill && !done.has(`3|${probeStudent}|${capSkill.loId}`)) {
    let rounds = 0; let stop = '';
    while (!stop && rounds < 14) {
      if (genReserved + 2 > GEN_BUDGET) { stop = 'gen-budget'; break; }
      reserve(2);
      const r = await draw(probeStudent, capSkill, 3, 3, 'one skill driven until the drill reports nothing more');
      rounds++;
      if (r.status !== 201 && r.status !== 200) stop = `http-${r.status}`;
      else if (r.items.length === 0) stop = 'empty-response (the drill shows "You\'ve completed all the practice available for this skill.")';
    }
    log({ type: 'skill-done', phase: 3, student: probeStudent, subject: capSkill.subject, loId: capSkill.loId, rounds, stop });
  }
}

const t0 = Date.now();
if (PHASE === '1' || PHASE === 'all') await phase1();
if (PHASE === '2' || PHASE === 'all') await phase2();
console.log(`crawl finished in ${Math.round((Date.now() - t0) / 1000)} s; generation slots this run may have caused: ${genReserved} (budget ${GEN_BUDGET})`);
void writeFileSync;
