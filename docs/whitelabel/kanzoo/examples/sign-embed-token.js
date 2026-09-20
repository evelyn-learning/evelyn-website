#!/usr/bin/env node
/**
 * sign-embed-token.js — mint a signed Voice Tutor embed token (HS256 JWT).
 * Zero dependencies. Run on YOUR SERVER (never in the browser — the secret
 * must not leave your backend).
 *
 *   PARTNER_ID=kanzoo PARTNER_SECRET=... node sign-embed-token.js \
 *     --student_id stu_123 --student_name Ayaan --subject math --level "Grade 6" \
 *     --topic "Ratios and unit rates" --session_goal homework-help --max_duration_minutes 30 \
 *     --teacher ms-priya-nair        # persona + voice; see teachers.json (default ms-elena-vasquez)
 *
 * Prints the token. Put it in the iframe URL:
 *   https://tutor.evelynlearning.com/embed?token=<token>
 *
 * Or require() it:  const { signEmbedToken } = require('./sign-embed-token');
 */
'use strict';
const crypto = require('crypto');

function b64url(input) {
  return Buffer.from(typeof input === 'string' ? input : input)
    .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** payload: the embed config (see integration-guide.md §4). secret: your partner secret. */
function signEmbedToken(payload, secret) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest();
  return `${header}.${body}.${b64url(sig)}`;
}

module.exports = { signEmbedToken };

if (require.main === module) {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i += 2) opts[args[i].replace(/^--/, '')] = args[i + 1];
  const partnerId = process.env.PARTNER_ID;
  const secret = process.env.PARTNER_SECRET;
  if (!partnerId || !secret) { console.error('set PARTNER_ID and PARTNER_SECRET'); process.exit(1); }
  if (!opts.student_id || !opts.subject || !opts.level) { console.error('required: --student_id --subject --level'); process.exit(1); }

  const nowSec = Math.floor(Date.now() / 1000);
  const ttlHours = Number(opts.ttl_hours || 2);
  const payload = {
    partner_id: partnerId,
    student_id: opts.student_id,
    subject: opts.subject,
    level: opts.level,
    iat: nowSec,
    exp: nowSec + Math.round(ttlHours * 3600),
  };
  for (const k of ['student_name', 'topic', 'session_goal', 'input_mode', 'curriculum_module', 'session_id']) {
    if (opts[k]) payload[k] = opts[k];
  }
  if (opts.max_duration_minutes) payload.max_duration_minutes = Number(opts.max_duration_minutes);
  if (opts.resume) payload.resume = opts.resume === 'true';

  // Teacher persona (name, style, VOICE). Always send one: it selects the
  // natural Cartesia voice. Without it the engine falls back to a generic
  // synthetic voice. `--teacher none` opts out. Catalog: teachers.json (same dir).
  const teacherId = opts.teacher || 'ms-elena-vasquez';
  if (teacherId !== 'none') {
    const teachers = require('./teachers.json');
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) { console.error(`unknown --teacher "${teacherId}". Known: ${teachers.map((t) => t.id).join(', ')}`); process.exit(1); }
    payload.teacher = teacher;
    payload.target_kind = opts.curriculum_module ? 'lessonNode' : 'freestyle';
  }
  process.stdout.write(signEmbedToken(payload, secret) + '\n');
}
