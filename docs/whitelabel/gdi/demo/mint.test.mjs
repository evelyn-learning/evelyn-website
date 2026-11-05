// node docs/whitelabel/gdi/demo/mint.test.mjs
// Runs mint-demo-links.js as a child process with a DUMMY secret and checks the trial claims.
import { execFileSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const SECRET = 'dummy-secret';
const teachers = JSON.parse((await import('node:fs')).readFileSync(path.join(dir, 'teachers.json'), 'utf8'));
const run = (args) => execFileSync('node', [path.join(dir, 'mint-demo-links.js'), ...args], {
  env: { ...process.env, PARTNER_SECRET: SECRET }, encoding: 'utf8',
}).trim().split('\n').map((l) => { const [label, url] = l.split('\t'); return { label, url }; });
const b64 = (s) => Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
const decode = (url) => {
  const token = new URL(url).searchParams.get('token');
  const [h, p, s] = token.split('.');
  const sig = createHmac('sha256', SECRET).update(`${h}.${p}`).digest();
  assert.ok(sig.equals(b64(s)), 'signature verifies with the partner secret');
  return JSON.parse(b64(p).toString('utf8'));
};

const links = run(['trial', '--testers', '4']);
assert.equal(links.length, 6, '4 testers + josh + praveen');
const claims = links.map((l) => decode(l.url));
const ids = claims.map((c) => c.student_id);
assert.deepEqual(ids.slice(0, 4), ['gdi-trial-1', 'gdi-trial-2', 'gdi-trial-3', 'gdi-trial-4']);
assert.match(ids[4], /^gdi-trial-josh-.+/);
assert.match(ids[5], /^gdi-trial-praveen-.+/);
// Testers are unnamed (no placeholder spoken as a name); the two named links are named.
for (const c of claims.slice(0, 4)) assert.ok(!('student_name' in c), `no student_name for ${c.student_id}`);
assert.equal(claims[4].student_name, 'Josh');
assert.equal(claims[5].student_name, 'Praveen');
for (const c of claims) {
  assert.equal(c.partner_id, 'gdi-demo');
  assert.equal(c.curriculum_module, 'gdi.trial.english.work-projects.v1');
  assert.equal(c.target_kind, 'lessonNode');
  assert.equal(c.input_mode, 'voice');
  assert.deepEqual(c.teacher, teachers.find((t) => t.id === 'ryota'));
  assert.deepEqual(c.tutor_languages, ['en', 'ja']);
  assert.equal(c.speech_rate, 0.7);
  assert.equal(c.max_duration_minutes, 30);
  assert.ok(!('is_trial' in c), 'no is_trial');
  assert.ok(!('wrap_at_minutes' in c), 'no wrap_at_minutes');
  assert.equal(c.exp - c.iat, 720 * 3600);
}
assert.ok(links[0].url.startsWith('https://tutor-demo.evelynlearning.com/tutor-portal/embed?token='));
// Fixed ids stay fixed across mints; the two fresh ids change.
await new Promise((r) => setTimeout(r, 1100));
const again = run(['trial']).map((l) => decode(l.url).student_id);
assert.deepEqual(again.slice(0, 4), ids.slice(0, 4));
assert.notEqual(again[4], ids[4]);
assert.notEqual(again[5], ids[5]);
assert.equal(run(['trial', '--testers', '2']).length, 4, '--testers 2');
// Existing lessons untouched.
assert.deepEqual(run([]).map((l) => l.label), ['starter', 'advanced', 'meeting']);

// --home / --from / --add (learner home links).
const home = run(['trial', '--home', '--testers', '2']);
assert.ok(home.every((l) => l.url.startsWith('https://tutor-demo.evelynlearning.com/tutor-portal/home?token=')), '--home path');
{
  const { writeFileSync, mkdtempSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const sign = (payload) => {
    const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const h = enc({ alg: 'HS256', typ: 'JWT' }); const p = enc(payload);
    return `${h}.${p}.${createHmac('sha256', SECRET).update(`${h}.${p}`).digest('base64url')}`;
  };
  const oldIat = Math.floor(Date.now() / 1000) - 7 * 86400;
  const fx = [
    ['tester-1', { partner_id: 'gdi-demo', student_id: 'gdi-trial-1', topic: 'Work projects', custom: 'keep-me', iat: oldIat, exp: oldIat + 720 * 3600 }],
    ['josh', { partner_id: 'gdi-demo', student_id: 'gdi-trial-josh-abc', student_name: 'Josh', iat: oldIat, exp: oldIat + 720 * 3600 }],
  ];
  const file = path.join(mkdtempSync(path.join(tmpdir(), 'mint-')), 'links.txt');
  writeFileSync(file, fx.map(([l, c]) => `${l}\thttps://tutor-demo.evelynlearning.com/tutor-portal/embed?token=${sign(c)}`).join('\n') + '\n');
  const out = run(['trial', '--home', '--from', file, '--add', 'james']);
  assert.deepEqual(out.map((l) => l.label), ['tester-1', 'josh', 'james'], '--from replaces generated rows; --add appends james');
  assert.ok(out.every((l) => l.url.includes('/tutor-portal/home?token=')));
  const oc = out.map((l) => decode(l.url));
  assert.equal(oc[0].student_id, 'gdi-trial-1');
  assert.equal(oc[0].custom, 'keep-me', 'claims kept');
  assert.equal(oc[1].student_name, 'Josh');
  assert.ok(oc[0].exp > fx[0][1].exp, 'exp bumped');
  assert.ok(oc[0].iat > oldIat, 'iat refreshed');
  assert.equal(oc[0].exp - oc[0].iat, 720 * 3600);
  assert.match(oc[2].student_id, /^gdi-trial-james-.+/);
  assert.equal(oc[2].student_name, 'James');
  assert.equal(oc[2].curriculum_module, 'gdi.trial.english.work-projects.v1');
  const plain = run(['trial', '--testers', '1', '--add', 'james']);
  assert.deepEqual(plain.map((l) => l.label), ['tester-1', 'josh', 'praveen', 'james'], '--add alone appends');
}
console.log('mint.test.mjs: all assertions passed');
