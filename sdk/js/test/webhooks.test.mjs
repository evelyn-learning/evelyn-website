import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createServer } from 'node:http';
import { test } from 'node:test';
import { EvelynWebhookError, verifyWebhook, webhookHandler } from '../dist/esm/index.js';
import { vectors } from './helpers.mjs';

const { partnerId, secret } = vectors;
const [ended] = vectors.webhooks;
const headersOf = (vector) => ({ 'x-evelyn-event': vector.type, 'x-evelyn-timestamp': String(vector.timestamp), 'x-evelyn-signature': vector.signature });
const refused = (reason) => (err) => err instanceof EvelynWebhookError && err.reason === reason;

for (const vector of vectors.webhooks) {
  test(`a webhook signed by the engine verifies: ${vector.name}`, () => {
    // The engine's signer (partner-dashboard/webhooks.ts signWebhook): hex HMAC-SHA256 of `${timestamp}.${body}`.
    assert.equal(vector.signature, createHmac('sha256', secret).update(`${vector.timestamp}.${vector.body}`).digest('hex'));
    const event = verifyWebhook({ rawBody: vector.body, headers: headersOf(vector), secret, now: vector.timestamp + 1000 });
    assert.deepEqual(event, JSON.parse(vector.body));
    assert.equal(event.type, vector.type);
    assert.equal(event.partner_id, partnerId);
  });
}

test('the body may be bytes, the headers a Fetch Headers or in any case, or given as two values', () => {
  const now = ended.timestamp;
  const expected = JSON.parse(ended.body);
  assert.deepEqual(verifyWebhook({ rawBody: Buffer.from(ended.body), headers: new Headers(headersOf(ended)), secret, now }), expected);
  assert.deepEqual(verifyWebhook({ rawBody: new TextEncoder().encode(ended.body), headers: { 'X-Evelyn-Timestamp': String(ended.timestamp), 'X-EVELYN-SIGNATURE': [ended.signature.toUpperCase()] }, secret, now }), expected);
  assert.deepEqual(verifyWebhook({ rawBody: ended.body, timestamp: String(ended.timestamp), signature: ended.signature, secret, now }), expected);
  assert.deepEqual(verifyWebhook({ rawBody: ended.body, headers: headersOf(ended), secret: ['new-secret', secret], now }), expected, 'either secret verifies while keys are rotated');
});

test('a wrong secret, a changed body or another timestamp is a bad signature', () => {
  const now = ended.timestamp;
  assert.throws(() => verifyWebhook({ rawBody: ended.body, headers: headersOf(ended), secret: 'another-secret', now }), refused('bad_signature'));
  assert.throws(() => verifyWebhook({ rawBody: ended.body.replace('412', '9999'), headers: headersOf(ended), secret, now }), refused('bad_signature'));
  assert.throws(() => verifyWebhook({ rawBody: `${ended.body} `, headers: headersOf(ended), secret, now }), refused('bad_signature'));
  assert.throws(() => verifyWebhook({ rawBody: ended.body, headers: { ...headersOf(ended), 'x-evelyn-timestamp': String(ended.timestamp + 1) }, secret, now }), refused('bad_signature'));
});

test('a request outside the tolerance is stale, in either direction', () => {
  const at = (now, toleranceMs) => () => verifyWebhook({ rawBody: ended.body, headers: headersOf(ended), secret, now, toleranceMs });
  assert.throws(at(ended.timestamp + 300_001), refused('stale_timestamp'));
  assert.throws(at(ended.timestamp - 300_001), refused('stale_timestamp'));
  assert.ok(at(ended.timestamp + 300_000)());
  assert.throws(at(ended.timestamp + 5000, 1000), refused('stale_timestamp'));
});

test('missing headers, a parsed body and a body that is not an event are malformed', () => {
  const now = ended.timestamp;
  const sign = (body) => ({ timestamp: String(now), signature: createHmac('sha256', secret).update(`${now}.${body}`).digest('hex') });
  assert.throws(() => verifyWebhook({ rawBody: ended.body, headers: {}, secret, now }), refused('malformed'));
  assert.throws(() => verifyWebhook({ rawBody: ended.body, headers: { 'x-evelyn-timestamp': String(now) }, secret, now }), refused('malformed'));
  assert.throws(() => verifyWebhook({ rawBody: ended.body, timestamp: 'yesterday', signature: ended.signature, secret, now }), refused('malformed'));
  assert.throws(() => verifyWebhook({ rawBody: ended.body, timestamp: String(now), signature: 'abc', secret, now }), refused('malformed'));
  assert.throws(() => verifyWebhook({ rawBody: JSON.parse(ended.body), headers: headersOf(ended), secret, now }), (err) => refused('malformed')(err) && /express\.raw/.test(err.message));
  assert.throws(() => verifyWebhook({ rawBody: 'not json', ...sign('not json'), secret, now }), refused('malformed'));
  assert.throws(() => verifyWebhook({ rawBody: '{"type":"session.ended"}', ...sign('{"type":"session.ended"}'), secret, now }), refused('malformed'));
  assert.throws(() => verifyWebhook({ rawBody: ended.body, headers: headersOf(ended), secret: '', now }), TypeError);
});

/** Posts to a local server running the handler, as the service would. */
async function deliver(handler, { body, headers }) {
  const server = createServer((req, res) => handler(req, res));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/hooks/evelyn`, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body });
    return { status: response.status, body: await response.json() };
  } finally {
    server.close();
  }
}

/** A delivery signed now, so the handler's own clock accepts it. */
function fresh(body = ended.body) {
  const timestamp = Date.now();
  return { body, headers: { 'x-evelyn-event': 'session.ended', 'x-evelyn-timestamp': String(timestamp), 'x-evelyn-signature': createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex') } };
}

test('webhookHandler verifies a Node http request, calls onEvent and answers 200', async () => {
  const seen = [];
  const handler = webhookHandler(secret, async (event) => {
    seen.push(event);
  });
  assert.deepEqual(await deliver(handler, fresh()), { status: 200, body: { received: true } });
  assert.deepEqual(seen, [JSON.parse(ended.body)]);
});

test('webhookHandler answers 401 or 400 without calling onEvent, and 500 when onEvent throws', async () => {
  const seen = [];
  const handler = webhookHandler(secret, (event) => {
    seen.push(event);
  });
  const good = fresh();
  assert.deepEqual(await deliver(handler, { body: good.body.replace('412', '1'), headers: good.headers }), { status: 401, body: { error: 'bad_signature' } });
  assert.deepEqual(await deliver(handler, { body: ended.body, headers: headersOf(ended) }), { status: 400, body: { error: 'stale_timestamp' } }, 'the vector is from another day');
  assert.deepEqual(await deliver(handler, { body: ended.body, headers: {} }), { status: 400, body: { error: 'malformed' } });
  assert.deepEqual(seen, []);
  const failing = webhookHandler(secret, () => {
    throw new Error('database down');
  });
  assert.deepEqual(await deliver(failing, fresh()), { status: 500, body: { error: 'handler_failed' } }, 'a 500 makes the service try again');
});

test('webhookHandler takes the raw body a parser left on req.body (express.raw), and refuses a parsed one', async () => {
  const seen = [];
  const handler = webhookHandler(secret, (event) => {
    seen.push(event.id);
  });
  // What Express hands on after a body parser: the stream is read and req.body holds the result.
  const afterParser = (toBody) => async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    req.body = toBody(Buffer.concat(chunks));
    return handler(req, res);
  };
  assert.equal((await deliver(afterParser((raw) => raw), fresh())).status, 200);
  assert.equal((await deliver(afterParser((raw) => raw.toString('utf8')), fresh())).status, 200);
  assert.deepEqual(await deliver(afterParser((raw) => JSON.parse(raw)), fresh()), { status: 400, body: { error: 'malformed' } });
  const { id } = JSON.parse(ended.body);
  assert.deepEqual(seen, [id, id]);
});
