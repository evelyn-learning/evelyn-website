import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inspect } from 'node:util';
import { test } from 'node:test';
import { BUNDLED_LANGUAGES, EvelynTutor, EvelynApiError, EvelynConfigError, fetchLanguages, verifySessionToken } from '../dist/esm/index.js';
import { fakeFetch, vectors } from './helpers.mjs';

const { partnerId, secret } = vectors;
const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
const JPEG = Buffer.from('ffd8ffe000104a46494600010100', 'hex');

function client(respond = () => ({})) {
  const double = fakeFetch(respond);
  return { tutor: new EvelynTutor({ partnerId, secret, fetch: double.fetch }), calls: double.calls };
}

/** Asserts one recorded call: URL, method, and a signature over exactly what was sent. Returns the parsed body. */
function assertSigned(call, method, pathWithQuery) {
  assert.equal(call.url, `https://www.evelynlearning.com${pathWithQuery}`);
  assert.equal(call.init.method, method);
  const headers = call.init.headers;
  assert.equal(headers['x-evelyn-partner'], partnerId);
  const timestamp = headers['x-evelyn-timestamp'];
  assert.ok(Math.abs(Date.now() - Number(timestamp)) < 5000);
  const raw = call.init.body ?? '';
  assert.equal(headers['x-evelyn-signature'], createHmac('sha256', secret).update(`${timestamp}.${method}.${pathWithQuery}.${raw}`).digest('hex'));
  assert.equal(headers['content-type'], raw ? 'application/json' : undefined);
  return raw ? JSON.parse(raw) : undefined;
}

test('usage() is a signed GET with no body', async () => {
  const answer = { partner_id: partnerId, pooled: true, cap_minutes: 300, used_minutes: 12, remaining_minutes: 288, session_max_minutes: 15 };
  const { tutor, calls } = client(() => ({ body: answer }));
  assert.deepEqual(await tutor.usage(), answer);
  assert.equal(calls.length, 1);
  assert.equal(assertSigned(calls[0], 'GET', '/api/portal/v1/usage'), undefined);
  assert.equal(calls[0].init.body, undefined);
});

test('worksheet.read sends plan-generate with goal homework-help and base64 images', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'evelyn-sdk-'));
  const file = join(dir, 'sheet.png');
  writeFileSync(file, PNG);
  const answer = { planId: 'gen-1', title: 'Homework help', mode: 'full', los: [], maxPickableLos: 1, estimatedMinutes: 20, generatorOk: true, cached: false, kind: 'homework-help', problems: [{ n: 1, text: '2x + 3 = 7' }] };
  const { tutor, calls } = client(() => ({ body: answer }));
  const sheet = await tutor.worksheet.read({
    images: [{ data: file }, { data: JPEG }, { data: JPEG.toString('base64') }, { data: `data:image/webp;base64,${PNG.toString('base64')}` }],
    text: '國二數學作業',
    subject: 'math',
    grade: 'Grade 8',
    locale: 'zh-TW',
    studentId: 'stu_1',
  });
  assert.deepEqual(sheet, answer);
  const body = assertSigned(calls[0], 'POST', '/api/portal/v1/plan-generate');
  assert.deepEqual(body, {
    text: '國二數學作業',
    subject: 'math',
    grade: 'Grade 8',
    goal: 'homework-help',
    locale: 'zh-TW',
    studentId: 'stu_1',
    materials: [
      { kind: 'image', mimeType: 'image/png', data: PNG.toString('base64') },
      { kind: 'image', mimeType: 'image/jpeg', data: JPEG.toString('base64') },
      { kind: 'image', mimeType: 'image/jpeg', data: JPEG.toString('base64') },
      { kind: 'image', mimeType: 'image/webp', data: PNG.toString('base64') },
    ],
  });
});

test('worksheet.read fills in a description for a photo, and takes typed questions with no photo', async () => {
  const { tutor, calls } = client();
  await tutor.worksheet.read({ images: [{ data: PNG }], subject: 'math', grade: 'Grade 8' });
  assert.equal(JSON.parse(calls[0].init.body).text, 'Worksheet');
  await tutor.worksheet.read({ text: '1. 2x + 3 = 7\n2. 5y = 20', subject: 'math', grade: 'Grade 8' });
  assert.deepEqual(JSON.parse(calls[1].init.body), { text: '1. 2x + 3 = 7\n2. 5y = 20', subject: 'math', grade: 'Grade 8', goal: 'homework-help' });
});

test('worksheet.read refuses input the API would refuse, before any request', async () => {
  const { tutor, calls } = client();
  const refuses = (input, pattern) => assert.rejects(tutor.worksheet.read(input), (err) => err instanceof EvelynConfigError && pattern.test(err.message));
  await refuses({ subject: 'math', grade: 'Grade 8' }, /at least one image/);
  await refuses({ images: Array(5).fill({ data: PNG }), subject: 'math', grade: 'Grade 8' }, /at most 4/);
  await refuses({ images: [{ data: Buffer.from('plain text') }], subject: 'math', grade: 'Grade 8' }, /not a JPEG, PNG, WebP or GIF/);
  await refuses({ images: [{ data: Buffer.alloc(8_000_001, 0xff) }], subject: 'math', grade: 'Grade 8' }, /larger than 8 MB/);
  await refuses({ images: [{ data: '/no/such/file.png' }], subject: 'math', grade: 'Grade 8' }, /could not read the file/);
  await refuses({ images: [{ data: PNG }], grade: 'Grade 8' }, /subject is required/);
  assert.equal(calls.length, 0);
});

test('worksheet.prepare, build, status and outcome call the homework endpoints', async () => {
  const { tutor, calls } = client((url) => (url.includes('homework-problem-plan') ? { status: 201, body: { planId: 'gen-q3', verified: true, hasFigure: false, buildStatus: 'ready' } } : url.endsWith('homework-build') ? { status: 202, body: { started: true } } : { body: {} }));

  assert.deepEqual(await tutor.worksheet.prepare('gen-1', 3, { waitMs: 8000, priorNote: 'Got as far as x = 2', priorConfirmed: ['part:a'], locale: 'zh-TW' }), { planId: 'gen-q3', verified: true, hasFigure: false, buildStatus: 'ready' });
  assert.deepEqual(assertSigned(calls[0], 'POST', '/api/portal/v1/homework-problem-plan'), { planId: 'gen-1', n: 3, waitMs: 8000, priorNote: 'Got as far as x = 2', priorConfirmed: ['part:a'], locale: 'zh-TW' });

  assert.deepEqual(await tutor.worksheet.build('gen-1'), { started: true });
  assert.deepEqual(assertSigned(calls[1], 'POST', '/api/portal/v1/homework-build'), { planId: 'gen-1' });
  await tutor.worksheet.build('gen-1', { first: 2 });
  assert.deepEqual(assertSigned(calls[2], 'POST', '/api/portal/v1/homework-build'), { planId: 'gen-1', first: 2 });

  await tutor.worksheet.status('gen-1');
  assertSigned(calls[3], 'GET', '/api/portal/v1/homework-build?planId=gen-1');

  await tutor.worksheet.outcome("sess 1'&x", 'gen-q3');
  assertSigned(calls[4], 'GET', '/api/portal/v1/homework-problem-outcome?sessionId=sess+1%27%26x&planId=gen-q3');
  await tutor.worksheet.outcome('sess-1');
  assertSigned(calls[5], 'GET', '/api/portal/v1/homework-problem-outcome?sessionId=sess-1');

  await assert.rejects(tutor.worksheet.prepare('gen-1', 0), /question number/);
  await assert.rejects(tutor.worksheet.status(''), /planId is required/);
});

test('the signed path survives URL parsing unchanged, as the server signs what it parses', async () => {
  const { tutor, calls } = client();
  await tutor.worksheet.outcome("it's (a) ~test*", 'p/1');
  const sent = new URL(calls[0].url);
  assert.equal(`https://www.evelynlearning.com${sent.pathname}${sent.search}`, calls[0].url);
});

test('worksheet.sessionUrl opens a homework-help session on the question plan', () => {
  const { tutor } = client();
  const url = new URL(tutor.worksheet.sessionUrl('gen-q3', { student_id: 'stu_1', subject: 'math', level: 'Grade 8', tutor_languages: ['zh-TW'] }));
  assert.equal(url.origin + url.pathname, 'https://tutor.evelynlearning.com/embed');
  const claims = verifySessionToken(url.searchParams.get('token'), secret);
  assert.equal(claims.partner_id, partnerId);
  assert.equal(claims.session_goal, 'homework-help');
  assert.equal(claims.curriculum_module, 'gen-q3');
  assert.equal(claims.topic, undefined);
  assert.equal(claims.target_kind, undefined);
  assert.deepEqual(claims.tutor_languages, ['zh-TW']);
});

test('sessionToken and sessionUrl sign with the client\'s keys and hosts', () => {
  const tutor = new EvelynTutor({ partnerId, secret, embedHost: 'http://localhost:3007/', fetch: async () => new Response('{}') });
  const claims = verifySessionToken(tutor.sessionToken({ student_id: 'stu_1' }, { expiresInSeconds: 60 }), secret);
  assert.equal(claims.exp - claims.iat, 60);
  assert.ok(tutor.sessionUrl({ student_id: 'stu_1' }).startsWith('http://localhost:3007/embed?token='));
});

test('languages() reads the public list with no signature, and falls back to the bundled list', async () => {
  const live = [{ code: 'en', label: 'English', english: 'English', firstTopic: 'Fractions', extra: 'ignored' }, { code: 'pt-BR', label: 'Português', english: 'Portuguese', firstTopic: 'Frações' }];
  const { tutor, calls } = client(() => ({ body: { languages: live } }));
  assert.deepEqual(await tutor.languages(), [{ code: 'en', label: 'English', english: 'English', firstTopic: 'Fractions' }, live[1]]);
  assert.equal(calls[0].url, 'https://tutor.evelynlearning.com/api/tutor-portal/languages');
  assert.equal(calls[0].init.headers, undefined, 'no keys are sent to the public list');

  const codes = (list) => list.map((language) => language.code);
  const bundled = ['en', 'ja', 'zh-TW', 'zh-CN', 'hi', 'hi-Latn', 'fr', 'es'];
  assert.deepEqual(codes(BUNDLED_LANGUAGES), bundled);
  const failures = [
    () => ({ status: 404, body: '<html>Not found</html>' }),
    () => ({ body: { languages: [] } }),
    () => ({ body: { languages: [{ code: 'xx' }] } }),
    () => {
      throw new TypeError('fetch failed');
    },
  ];
  for (const respond of failures) assert.deepEqual(codes(await client(respond).tutor.languages()), bundled);

  const copy = await fetchLanguages({ fetch: async () => { throw new Error('offline'); } });
  copy[0].code = 'changed';
  assert.equal(BUNDLED_LANGUAGES[0].code, 'en', 'the fallback is a copy');
  const other = fakeFetch(() => ({ body: { languages: live } }));
  await fetchLanguages({ embedHost: 'http://localhost:3007/', fetch: other.fetch });
  assert.equal(other.calls[0].url, 'http://localhost:3007/api/tutor-portal/languages');
});

test('sessions.summary joins ids and returns the sessions array', async () => {
  const sessions = [{ sessionId: 'a', status: 'completed', startedAt: '2026-11-24T10:00:00.000Z', studentTurns: 4, tutorTurns: 5, boardItems: 2 }];
  const { tutor, calls } = client(() => ({ body: { sessions } }));
  assert.deepEqual(await tutor.sessions.summary(['a', 'b']), sessions);
  assertSigned(calls[0], 'GET', '/api/portal/v1/sessions/summary?ids=a%2Cb');
  await assert.rejects(tutor.sessions.summary([]), /1 to 50/);
  await assert.rejects(tutor.sessions.summary(Array(51).fill('x')), /1 to 50/);
  await assert.rejects(tutor.sessions.summary(['a,b']), /comma/);
});

test('a non-2xx answer becomes an EvelynApiError with status, code, reason and body', async () => {
  const { tutor } = client(() => ({ status: 401, body: { error: 'unauthorized', reason: 'bad_signature' } }));
  await assert.rejects(tutor.usage(), (err) => {
    assert.ok(err instanceof EvelynApiError);
    assert.equal(err.status, 401);
    assert.equal(err.code, 'unauthorized');
    assert.equal(err.reason, 'bad_signature');
    assert.deepEqual(err.body, { error: 'unauthorized', reason: 'bad_signature' });
    assert.match(err.message, /GET \/api\/portal\/v1\/usage failed: 401 unauthorized \(bad_signature\)/);
    return true;
  });
  const html = client(() => ({ status: 502, body: '<html>Bad gateway</html>' }));
  await assert.rejects(html.tutor.usage(), (err) => err.status === 502 && err.code === 'http_502' && err.body === '<html>Bad gateway</html>');
  const unreadable = client(() => ({ status: 422, body: { error: 'scanned_pdf', message: 'No text could be read.' } }));
  await assert.rejects(unreadable.tutor.worksheet.read({ images: [{ data: PNG }], subject: 'math', grade: 'Grade 8' }), (err) => err.code === 'scanned_pdf' && err.reason === 'No text could be read.');
});

test('keys default to the environment, and missing keys say how to get them', () => {
  const saved = { id: process.env.EVELYN_PARTNER_ID, secret: process.env.EVELYN_PARTNER_SECRET };
  try {
    delete process.env.EVELYN_PARTNER_ID;
    delete process.env.EVELYN_PARTNER_SECRET;
    assert.throws(() => new EvelynTutor(), (err) => err instanceof EvelynConfigError && /EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET are not set/.test(err.message) && err.message.includes('https://tutor.evelynlearning.com/sandbox'));
    process.env.EVELYN_PARTNER_ID = 'from-env';
    assert.throws(() => new EvelynTutor(), /EVELYN_PARTNER_SECRET is not set/);
    process.env.EVELYN_PARTNER_SECRET = 'env-secret';
    const tutor = new EvelynTutor();
    assert.equal(tutor.partnerId, 'from-env');
    assert.equal(verifySessionToken(tutor.sessionToken({ student_id: 's' }), 'env-secret').partner_id, 'from-env');
  } finally {
    for (const [name, value] of [['EVELYN_PARTNER_ID', saved.id], ['EVELYN_PARTNER_SECRET', saved.secret]]) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});

test('the secret is not exposed when a client is logged or serialised', () => {
  const { tutor } = client();
  assert.ok(!inspect(tutor, { depth: 5, showHidden: true }).includes(secret));
  assert.ok(!JSON.stringify(tutor).includes(secret));
  assert.ok(!Object.values(tutor).includes(secret));
});

test('the client refuses to be built in a browser', () => {
  globalThis.window = {};
  try {
    assert.throws(() => new EvelynTutor({ partnerId, secret }), /must not run in a browser: the partner secret has to stay on your server/);
  } finally {
    delete globalThis.window;
  }
});
