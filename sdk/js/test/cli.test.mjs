import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { promisify } from 'node:util';
import { createHmac } from 'node:crypto';
import { verifySessionToken } from '../dist/esm/index.js';
import { CLI, cleanEnv, vectors } from './helpers.mjs';

const run = promisify(execFile);
const { partnerId, secret } = vectors;
const KEYS = { EVELYN_PARTNER_ID: partnerId, EVELYN_PARTNER_SECRET: secret };

/** Runs the command in `cwd`; never rejects, so a test can read the exit code and both streams. */
async function cli(args, { cwd, env = {} } = {}) {
  try {
    const { stdout, stderr } = await run(process.execPath, [CLI, ...args], { cwd, env: cleanEnv(env) });
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code, stdout: err.stdout, stderr: err.stderr };
  }
}

function project(files = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'evelyn-cli-'));
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(join(dir, name, '..'), { recursive: true });
    writeFileSync(join(dir, name), typeof content === 'string' ? content : JSON.stringify(content));
  }
  return dir;
}

const read = (dir, name) => readFileSync(join(dir, name), 'utf8');

test('init --yes in a Next.js project writes .env.local, .gitignore, a route and a page', async () => {
  const dir = project({ 'package.json': { dependencies: { next: '15.0.0', react: '19.0.0' } }, 'tsconfig.json': '{}', 'src/app/layout.tsx': '' });
  const result = await cli(['init', '--yes'], { cwd: dir, env: KEYS });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(read(dir, '.env.local'), `EVELYN_PARTNER_ID=${partnerId}\nEVELYN_PARTNER_SECRET=${secret}\n`);
  assert.equal(read(dir, '.gitignore'), '.env.local\n');
  const route = read(dir, 'src/app/api/evelyn/session/route.ts');
  assert.match(route, /import \{ EvelynTutor \} from '@evelynlearning\/tutor';/);
  assert.match(route, /export async function POST\(\)/);
  assert.match(read(dir, 'src/app/evelyn-tutor/page.tsx'), /allow="microphone; camera; autoplay; clipboard-write"/);
  assert.match(result.stdout, /npm install @evelynlearning\/tutor/);
  assert.ok(!result.stdout.includes(secret) && !result.stderr.includes(secret), 'the secret is never printed');
});

test('init --yes in a JavaScript Next.js project with no src directory uses app/ and .js files', async () => {
  const dir = project({ 'package.json': { dependencies: { next: '15.0.0', '@evelynlearning/tutor': '0.1.0' } } });
  const result = await cli(['init', '--yes'], { cwd: dir, env: KEYS });
  assert.equal(result.code, 0, result.stderr);
  assert.ok(existsSync(join(dir, 'app/api/evelyn/session/route.js')));
  assert.ok(existsSync(join(dir, 'app/evelyn-tutor/page.jsx')));
  assert.doesNotMatch(result.stdout, /npm install/);
});

test('init --yes in an Express project writes a router for the project\'s module system', async () => {
  const cjs = project({ 'package.json': { dependencies: { express: '4.19.0' } } });
  assert.equal((await cli(['init', '--yes'], { cwd: cjs, env: KEYS })).code, 0);
  assert.match(read(cjs, 'evelyn-tutor.js'), /require\('@evelynlearning\/tutor'\)[\s\S]*module\.exports = router;/);
  assert.match(read(cjs, 'evelyn-tutor.html'), /fetch\('\/api\/evelyn\/session', \{ method: 'POST' \}\)/);
  assert.equal(read(cjs, '.env'), `EVELYN_PARTNER_ID=${partnerId}\nEVELYN_PARTNER_SECRET=${secret}\n`);

  const esm = project({ 'package.json': { type: 'module', dependencies: { express: '5.0.0' } } });
  assert.equal((await cli(['init', '--yes'], { cwd: esm, env: KEYS })).code, 0);
  assert.match(read(esm, 'evelyn-tutor.js'), /import \{ EvelynTutor \} from '@evelynlearning\/tutor';[\s\S]*export default router;/);
});

test('init --yes in a plain Node project writes a standalone server that parses', async () => {
  const dir = project({ 'package.json': { name: 'plain' } });
  assert.equal((await cli(['init', '--yes'], { cwd: dir, env: KEYS })).code, 0);
  assert.ok(existsSync(join(dir, 'evelyn-tutor.html')));
  await run(process.execPath, ['--check', join(dir, 'evelyn-tutor-server.mjs')]);
});

test('init does not clobber existing env keys, .gitignore lines or files', async () => {
  const dir = project({
    'package.json': { name: 'plain' },
    '.env': 'DATABASE_URL=postgres://localhost/app\nEVELYN_PARTNER_ID=already-here',
    '.gitignore': 'node_modules\n',
    'evelyn-tutor.html': 'mine',
  });
  const result = await cli(['init', '--yes'], { cwd: dir, env: { EVELYN_PARTNER_SECRET: secret } });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(read(dir, '.env'), `DATABASE_URL=postgres://localhost/app\nEVELYN_PARTNER_ID=already-here\nEVELYN_PARTNER_SECRET=${secret}\n`);
  assert.equal(read(dir, '.gitignore'), 'node_modules\n.env\n');
  assert.equal(read(dir, 'evelyn-tutor.html'), 'mine');
  assert.match(result.stdout, /Kept EVELYN_PARTNER_ID as already set in \.env/);
  assert.match(result.stdout, /Kept evelyn-tutor\.html/);

  const again = await cli(['init', '--yes', '--force'], { cwd: dir, env: { EVELYN_PARTNER_ID: 'other', EVELYN_PARTNER_SECRET: 'other-secret' } });
  assert.equal(again.code, 0, again.stderr);
  assert.match(read(dir, 'evelyn-tutor.html'), /<!doctype html>/);
  assert.equal(read(dir, '.env'), `DATABASE_URL=postgres://localhost/app\nEVELYN_PARTNER_ID=already-here\nEVELYN_PARTNER_SECRET=${secret}\n`, '--force overwrites example files, never keys');
  assert.equal(read(dir, '.gitignore'), 'node_modules\n.env\n');
});

test('init leaves a .gitignore that already covers the env file alone', async () => {
  const dir = project({ 'package.json': { dependencies: { next: '15.0.0' } }, '.gitignore': '# env\n.env*.local\n' });
  assert.equal((await cli(['init', '--yes'], { cwd: dir, env: KEYS })).code, 0);
  assert.equal(read(dir, '.gitignore'), '# env\n.env*.local\n');
});

test('init --yes without keys still writes the example and says where to get keys', async () => {
  const dir = project({ 'package.json': { name: 'plain' } });
  const result = await cli(['init', '--yes', '--framework', 'express'], { cwd: dir });
  assert.equal(result.code, 0, result.stderr);
  assert.ok(!existsSync(join(dir, '.env')));
  assert.ok(existsSync(join(dir, 'evelyn-tutor.js')));
  assert.match(result.stdout, /https:\/\/tutor\.evelynlearning\.com\/sandbox/);
});

test('token prints a session URL built from the flags, with keys read from the project env file', async () => {
  const dir = project({ '.env.local': `EVELYN_PARTNER_ID=${partnerId}\nEVELYN_PARTNER_SECRET="${secret}"\n` });
  const result = await cli(['token', '--student', 'stu_1', '--topic', '聯立方程式', '--language', 'zh-TW', '--mode', 'text', '--minutes=10', '--expires', '600'], { cwd: dir });
  assert.equal(result.code, 0, result.stderr);
  const url = new URL(result.stdout.trim());
  assert.equal(url.origin + url.pathname, 'https://tutor.evelynlearning.com/embed');
  const claims = verifySessionToken(url.searchParams.get('token'), secret);
  assert.deepEqual(
    { ...claims, iat: 0, exp: claims.exp - claims.iat },
    { partner_id: partnerId, student_id: 'stu_1', subject: 'math', level: 'Grade 8', topic: '聯立方程式', target_kind: 'freestyle', tutor_languages: ['zh-TW'], input_mode: 'text', max_duration_minutes: 10, iat: 0, exp: 600 },
  );
});

test('token explains missing input and missing keys', async () => {
  const dir = project();
  const noStudent = await cli(['token'], { cwd: dir, env: KEYS });
  assert.equal(noStudent.code, 1);
  assert.match(noStudent.stderr, /--student is required/);
  const noKeys = await cli(['token', '--student', 's'], { cwd: dir });
  assert.equal(noKeys.code, 1);
  assert.match(noKeys.stderr, /EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET are not set\. Sign up at https:\/\/tutor\.evelynlearning\.com\/sandbox/);
  const unknown = await cli(['frobnicate'], { cwd: dir });
  assert.equal(unknown.code, 1);
  assert.match(unknown.stderr, /Unknown command/);
  const misspelt = await cli(['token', '--student', 's', '--langauge', 'zh-TW'], { cwd: dir, env: KEYS });
  assert.equal(misspelt.code, 1);
  assert.match(misspelt.stderr, /"token" has no option --langauge\. Its options: --student,/);
  const badMinutes = await cli(['token', '--student', 's', '--minutes', 'lots'], { cwd: dir, env: KEYS });
  assert.match(badMinutes.stderr, /max_duration_minutes must be a number from 1 to 120/);
});

/** A stand-in for the API: checks the signature the way the engine does and answers /usage. */
async function withApi(handler, body) {
  const server = createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    return await body(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

function usageApi(req, res) {
  const expected = createHmac('sha256', secret).update(`${req.headers['x-evelyn-timestamp']}.GET.${req.url}.`).digest('hex');
  const ok = req.url === '/api/portal/v1/usage' && req.headers['x-evelyn-partner'] === partnerId && req.headers['x-evelyn-signature'] === expected;
  res.writeHead(ok ? 200 : 401, { 'content-type': 'application/json' });
  res.end(JSON.stringify(ok ? { partner_id: partnerId, pooled: true, cap_minutes: 300, used_minutes: 12, remaining_minutes: 288, session_max_minutes: 15 } : { error: 'unauthorized', reason: 'bad_signature' }));
}

test('usage and doctor report a working setup', async () => {
  await withApi(usageApi, async (host) => {
    const env = { ...KEYS, EVELYN_API_HOST: host };
    const usage = await cli(['usage'], { cwd: project(), env });
    assert.equal(usage.code, 0, usage.stderr);
    assert.match(usage.stdout, /12 of 300 tutoring minutes used, 288 left/);
    assert.equal(JSON.parse((await cli(['usage', '--json'], { cwd: project(), env })).stdout).remaining_minutes, 288);

    const doctor = await cli(['doctor'], { cwd: project(), env });
    assert.equal(doctor.code, 0, doctor.stdout + doctor.stderr);
    assert.match(doctor.stdout, /ok {4}EVELYN_PARTNER_SECRET: set\n/);
    assert.match(doctor.stdout, /ok {4}Clock: within \d s of the API's clock/);
    assert.match(doctor.stdout, /ok {4}Signed GET \/usage: 12 of 300/);
    assert.match(doctor.stdout, /Everything works\./);
    assert.ok(!doctor.stdout.includes(secret));
  });
});

test('doctor names a wrong secret, a wrong clock and missing keys', async () => {
  await withApi(usageApi, async (host) => {
    const wrong = await cli(['doctor'], { cwd: project(), env: { EVELYN_PARTNER_ID: partnerId, EVELYN_PARTNER_SECRET: 'wrong', EVELYN_API_HOST: host } });
    assert.equal(wrong.code, 1);
    assert.match(wrong.stdout, /FAIL {2}Signed GET \/usage: .*401 unauthorized \(bad_signature\)\. The signature did not match/);
  });
  const skewed = (req, res) => {
    res.writeHead(401, { 'content-type': 'application/json', date: new Date(Date.now() + 3_600_000).toUTCString() });
    res.end(JSON.stringify({ error: 'unauthorized', reason: 'stale_timestamp' }));
  };
  await withApi(skewed, async (host) => {
    const result = await cli(['doctor'], { cwd: project(), env: { ...KEYS, EVELYN_API_HOST: host } });
    assert.equal(result.code, 1);
    assert.match(result.stdout, /FAIL {2}Clock: this machine is 3[56]\d\d s behind the API/);
    assert.match(result.stdout, /stale_timestamp\)\. This machine's clock/);
  });
  const missing = await cli(['doctor'], { cwd: project() });
  assert.equal(missing.code, 1);
  assert.match(missing.stdout, /FAIL {2}EVELYN_PARTNER_ID: not set\. Sign up at https:\/\/tutor\.evelynlearning\.com\/sandbox/);
});

test('docs prints the integration guide, from the bundled copy when the portal cannot be reached', async () => {
  const result = await cli(['docs'], { cwd: project(), env: { EVELYN_EMBED_HOST: 'http://127.0.0.1:9' } });
  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /^# Evelyn Voice Tutor: integration guide/);
  assert.match(result.stdout, /x-evelyn-signature/);
});

test('help lists every command', async () => {
  const result = await cli(['help']);
  for (const command of ['init', 'token', 'usage', 'doctor', 'docs', 'mcp']) assert.match(result.stdout, new RegExp(`^  ${command} `, 'm'));
});
