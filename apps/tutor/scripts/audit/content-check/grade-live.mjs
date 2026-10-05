// GAC content check — PART B live grading (plain Node 18+, no dependencies).
//
//   node scripts/audit/content-check/grade-live.mjs --crawl <scratch>/crawl-log.jsonl --log <scratch>/grade-log.jsonl \
//        [--mcq 400] [--numeric 220] [--engine 260] [--rpm 50]
//
// Grades a deterministic sample of the items the crawl was served, through the same routes the
// practice drill uses, as the test student that was served them:
//   - multiple choice + numeric: POST /api/practice/attempt (the stored grade; the drill's own
//     ✓ is computed in the browser from the same payload) — one attempt with every keyed
//     answer (all must be correct), one with wrong answers (all must be incorrect);
//   - free / frq: POST /api/practice/grade — the stored key (must be full marks) and one
//     obviously wrong value (must not be).
// The sample is fixed by the crawl log order: practice sets are taken round-robin by subject.
// Resumable. Every request and response is logged.
import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { createHmac, createHash, randomUUID } from 'node:crypto';

const WEB = 'https://greenapple.evelynlearning.com';
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const CRAWL = arg('crawl'); const LOG = arg('log');
const WANT = { mcq: Number(arg('mcq', '400')), numeric: Number(arg('numeric', '220')), engine: Number(arg('engine', '260')) };
const RPM = Math.min(55, Number(arg('rpm', '50')));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastAt = 0; const gap = Math.ceil(60000 / RPM);
async function paced() { const wait = lastAt + gap - Date.now(); if (wait > 0) await sleep(wait); lastAt = Date.now(); }
const log = (rec) => appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), ...rec }) + '\n');

const b64url = (buf) => Buffer.from(buf).toString('base64url');
const cookies = new Map();
async function signIn(studentId) {
  if (cookies.has(studentId)) return cookies.get(studentId);
  const secret = readFileSync(`${homedir()}/.evelyn/partners/greenapple-launch.secret`, 'utf8').trim();
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify({ iss: 'greenapple', sub: studentId, iat: now, exp: now + 120, jti: randomUUID(), grade: '11', dest: 'practice' }));
  await paced();
  const res = await fetch(`${WEB}/launch?token=${header}.${body}.${createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')}`, { redirect: 'manual' });
  const ck = (res.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).filter((c) => /^[a-z_]+=.+/.test(c) && !/=$/.test(c));
  if (!ck.some((c) => c.startsWith('academy_session='))) throw new Error(`launch sign-in failed for ${studentId}: HTTP ${res.status}`);
  cookies.set(studentId, ck.join('; '));
  return cookies.get(studentId);
}
async function post(studentId, path, body) {
  const cookie = await signIn(studentId);
  for (let attempt = 0; ; attempt++) {
    await paced();
    const t0 = Date.now(); let status = 0; let json = null; let error;
    try {
      const res = await fetch(`${WEB}${path}`, { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(120000) });
      status = res.status; const text = await res.text();
      try { json = JSON.parse(text); } catch { json = { nonJson: text.slice(0, 300) }; }
    } catch (e) { error = String(e?.message ?? e); }
    if (status === 429 && attempt < 2) { await sleep(65000); continue; }
    return { status, json, error, ms: Date.now() - t0 };
  }
}

/** The drill's own rule (apps/web/components/practice/shared.tsx `correctChoiceIdOf`): what the student must click. */
function correctChoiceIdOf(it) {
  const flagged = it.choices?.find((c) => c.correct)?.id;
  if (flagged) return flagged;
  const ea = (it.expectedAnswer ?? '').trim();
  if (/^[A-E]$/i.test(ea)) return ea.toUpperCase();
  return it.choices?.find((c) => c.text.trim().toLowerCase() === ea.toLowerCase())?.id;
}
const pathOf = (it) => (it.choices && it.choices.length > 0 ? 'mcq' : it.responseFormat === 'frq' || it.responseFormat === 'free' ? 'engine' : 'numeric');
function wrongFor(it) {
  const key = String(it.expectedAnswer ?? '').trim();
  const p = pathOf(it);
  if (p === 'mcq') { const k = correctChoiceIdOf(it); return it.choices.find((c) => c.id !== k)?.id ?? ''; }
  const m = key.replace(/[−–]/g, '-').match(/^-?\$?\s*(\d+(?:\.\d+)?)/);
  if (m) { const n = Number(m[1]); const dec = (m[1].split('.')[1] ?? '').length; return (n * 3 + 1234.5).toFixed(Math.max(dec, 1)); }
  return 'It cannot be determined from the information given; my answer is 987654.';
}

/* ---------------- sample ---------------- */
const sets = []; // one per practice response that returned items
const seenItem = new Set();
for (const line of readFileSync(CRAWL, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const r = JSON.parse(line);
  if (r.type !== 'practice' || !r.practiceSetId || !r.items?.length) continue;
  const items = r.items.filter((it) => !seenItem.has(it.id));
  for (const it of items) seenItem.add(it.id);
  if (items.length) sets.push({ student: r.student, subject: r.subject, loId: r.loId, practiceSetId: r.practiceSetId, items });
}
const bySubject = new Map();
for (const s of sets) (bySubject.get(s.subject) ?? bySubject.set(s.subject, []).get(s.subject)).push(s);
const subjects = [...bySubject.keys()];
const got = { mcq: 0, numeric: 0, engine: 0 };
const autoPlan = []; const enginePlan = [];
// round-robin over subjects; within a subject the sets are taken in a fixed pseudo-random order
// (hash of skill + first item id), so the sample spreads over the skills and is the same on every run
// over the same served items.
const h = (set) => createHash('sha1').update(`${set.loId}|${set.items[0].id}`).digest('hex');
for (const list of bySubject.values()) list.sort((a, b) => h(a).localeCompare(h(b)));
const cursors = new Map(subjects.map((s) => [s, 0]));
const stride = () => 1;
for (let guard = 0; guard < 100000 && (got.mcq < WANT.mcq || got.numeric < WANT.numeric || got.engine < WANT.engine); guard++) {
  let progressed = false;
  for (const subject of subjects) {
    const list = bySubject.get(subject); const i = cursors.get(subject);
    if (i >= list.length) continue;
    cursors.set(subject, i + stride(subject)); progressed = true;
    const set = list[i];
    const auto = set.items.filter((it) => pathOf(it) !== 'engine');
    const nM = auto.filter((it) => pathOf(it) === 'mcq').length; const nN = auto.length - nM;
    if (auto.length && ((nM && got.mcq < WANT.mcq) || (nN && got.numeric < WANT.numeric))) { autoPlan.push({ ...set, items: auto }); got.mcq += nM; got.numeric += nN; }
    for (const it of set.items.filter((x) => pathOf(x) === 'engine' && String(x.expectedAnswer ?? '').trim())) {
      if (got.engine >= WANT.engine) break;
      enginePlan.push({ student: set.student, subject: set.subject, loId: set.loId, practiceSetId: set.practiceSetId, item: it }); got.engine++;
    }
  }
  if (!progressed) break;
}
console.log(`sample: ${autoPlan.length} sets for the attempt route (${got.mcq} multiple choice, ${got.numeric} numeric), ${enginePlan.length} typed items for the grade route`);

const done = new Set();
if (existsSync(LOG)) for (const line of readFileSync(LOG, 'utf8').split('\n')) { if (line.trim()) { const r = JSON.parse(line); if (r.key) done.add(r.key); } }

for (const set of autoPlan) {
  for (const which of ['key', 'wrong']) {
    const k = `attempt|${set.practiceSetId}|${which}`;
    if (done.has(k)) continue;
    const responses = set.items.map((it) => ({ itemId: it.id, answer: which === 'key' ? (pathOf(it) === 'mcq' ? (correctChoiceIdOf(it) ?? '') : String(it.expectedAnswer ?? '')) : wrongFor(it) }));
    const request = { practiceSetId: set.practiceSetId, responses };
    const r = await post(set.student, '/api/practice/attempt', request);
    log({ key: k, type: 'attempt', which, student: set.student, subject: set.subject, loId: set.loId, request, status: r.status, ms: r.ms, error: r.error, response: r.json, items: set.items.map((it) => ({ id: it.id, path: pathOf(it), expectedAnswer: it.expectedAnswer, choices: it.choices, problemText: it.problemText })) });
  }
}
for (const e of enginePlan) {
  for (const which of ['key', 'wrong']) {
    const k = `grade|${e.practiceSetId}|${e.item.id}|${which}`;
    if (done.has(k)) continue;
    const text = which === 'key' ? String(e.item.expectedAnswer) : wrongFor(e.item);
    const request = { practiceSetId: e.practiceSetId, itemId: e.item.id, response: { text } };
    const r = await post(e.student, '/api/practice/grade', request);
    log({ key: k, type: 'grade', which, student: e.student, subject: e.subject, loId: e.loId, request, status: r.status, ms: r.ms, error: r.error, response: r.json, item: { id: e.item.id, expectedAnswer: e.item.expectedAnswer, problemText: e.item.problemText, responseFormat: e.item.responseFormat } });
  }
}
console.log('grading finished');
