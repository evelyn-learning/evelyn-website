#!/usr/bin/env node
/**
 * portal-api-client.js — call the Voice Tutor partner API with HMAC signing.
 * Zero dependencies (Node 18+). Server-side only.
 *
 *   PARTNER_ID=kanzoo PARTNER_SECRET=... node portal-api-client.js GET "/api/portal/v1/gaps?studentId=stu_123"
 *   PARTNER_ID=kanzoo PARTNER_SECRET=... node portal-api-client.js GET "/api/portal/v1/sessions/summary?ids=sess_1,sess_2"
 *   PARTNER_ID=kanzoo PARTNER_SECRET=... node portal-api-client.js POST /api/portal/v1/plan-generate '{"text":"...","subject":"math","grade":"Grade 6"}'
 *
 * Signing (see integration-guide.md §6):
 *   headers  x-evelyn-partner, x-evelyn-timestamp (epoch ms), x-evelyn-signature (hex)
 *   signature = HMAC-SHA256(secret, `${timestamp}.${METHOD}.${path-with-query}.${rawBody}`)
 *   timestamp must be within ±5 minutes of server time. GET → rawBody is "".
 */
'use strict';
const crypto = require('crypto');

const BASE_URL = process.env.EVELYN_BASE_URL || 'https://www.evelynlearning.com';

function signPortalRequest(secret, { method, path, timestamp, body }) {
  return crypto.createHmac('sha256', secret)
    .update(`${timestamp}.${method.toUpperCase()}.${path}.${body}`)
    .digest('hex');
}

/** path = "/api/portal/v1/..." INCLUDING the query string. body = object | undefined. */
async function portalFetch({ partnerId, secret, method, path, body }) {
  const raw = body === undefined ? '' : JSON.stringify(body);
  const timestamp = String(Date.now());
  const signature = signPortalRequest(secret, { method, path, timestamp, body: raw });
  const res = await fetch(BASE_URL + path, {
    method,
    headers: {
      'content-type': 'application/json',
      'x-evelyn-partner': partnerId,
      'x-evelyn-timestamp': timestamp,
      'x-evelyn-signature': signature,
    },
    body: raw === '' ? undefined : raw,
  });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, body: json };
}

module.exports = { signPortalRequest, portalFetch };

if (require.main === module) {
  const [method, path, bodyArg, flag] = process.argv.slice(2);
  const partnerId = process.env.PARTNER_ID, secret = process.env.PARTNER_SECRET;
  if (!partnerId || !secret || !method || !path) {
    console.error('usage: PARTNER_ID=.. PARTNER_SECRET=.. node portal-api-client.js <GET|POST> <path> [jsonBody] [--status-only]');
    process.exit(1);
  }
  const statusOnly = bodyArg === '--status-only' || flag === '--status-only';
  const body = bodyArg && bodyArg !== '--status-only' ? JSON.parse(bodyArg) : undefined;
  portalFetch({ partnerId, secret, method, path, body }).then((r) => {
    if (statusOnly) { process.stdout.write(String(r.status) + '\n'); return; }
    console.log('HTTP', r.status);
    console.log(typeof r.body === 'string' ? r.body : JSON.stringify(r.body, null, 2));
  }).catch((e) => { console.error(e); process.exit(1); });
}
