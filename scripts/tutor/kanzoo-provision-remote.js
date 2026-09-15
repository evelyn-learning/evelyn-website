#!/usr/bin/env node
/**
 * kanzoo-provision-remote.js — runs ON the production box, from
 * /root/evelyn-tutor/apps/tutor (uploaded + invoked by kanzoo-provision.sh).
 *
 * Does two things, both idempotent, both DRY-RUN unless `--write`:
 *   1. Deletes the test sandbox lead(s) whose name matches LEAD_NAME_PATTERN
 *      (default "Deploy Test") from `tutorsandboxrequests`.
 *   2. Creates the partner registry row PARTNER_ID in `partners`, sealing
 *      PARTNER_SECRET with the box's own PORTAL_SECRET_ENC_KEY. The document
 *      shape is byte-for-byte what scripts/seed-partner-registry.ts's
 *      buildCreateDoc() writes (allowedEndpoints ['/api/portal/v1/'], limits
 *      600/60/null, one 'seed'-labelled secret). An EXISTING row is never
 *      modified — we only report whether the provided secret matches one of
 *      its stored secrets.
 *
 * Reads MONGODB_URI + PORTAL_SECRET_ENC_KEY from ./.env.local (the file the
 * running engine actually reads). Never prints a secret or the key.
 *
 * Env in:  PARTNER_ID, PARTNER_NAME, PARTNER_SECRET (via stdin-fed env),
 *          LEAD_NAME_PATTERN (optional)
 */
'use strict';
const fs = require('fs');
const crypto = require('crypto');

const WRITE = process.argv.includes('--write');
const PARTNER_ID = process.env.PARTNER_ID;
const PARTNER_NAME = process.env.PARTNER_NAME || PARTNER_ID;
const PARTNER_SECRET = process.env.PARTNER_SECRET;
const LEAD_NAME_PATTERN = process.env.LEAD_NAME_PATTERN || 'Deploy Test';

function die(msg) { console.error('ABORT: ' + msg); process.exit(1); }
if (!PARTNER_ID || !/^[a-z0-9][a-z0-9-]{1,40}$/.test(PARTNER_ID)) die('PARTNER_ID missing or not a slug');
if (!PARTNER_SECRET || PARTNER_SECRET.length < 32) die('PARTNER_SECRET missing or shorter than 32 chars');

function readEnvFile(file) {
  const out = {};
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}
const env = readEnvFile('.env.local');
const uri = env.MONGODB_URI;
const keyB64 = env.PORTAL_SECRET_ENC_KEY;
if (!uri) die('MONGODB_URI not found in ./.env.local');
if (!keyB64) die('PORTAL_SECRET_ENC_KEY not found in ./.env.local');
const key = Buffer.from(keyB64, 'base64');
if (key.length !== 32) die(`PORTAL_SECRET_ENC_KEY must decode to 32 bytes, got ${key.length}`);
const fingerprint = crypto.createHash('sha256').update(keyB64).digest('hex').slice(0, 8);

// Mirrors src/lib/tutor/portal/secret-box.ts exactly: aes-256-gcm, 12-byte iv,
// 16-byte tag, ciphertext = base64(iv | tag | enc), keyVersion 1.
function encryptSecret(plaintext) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { ciphertext: Buffer.concat([iv, tag, enc]).toString('base64'), keyVersion: 1 };
}
function decryptSecret(sealed) {
  const buf = Buffer.from(sealed.ciphertext, 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const d = crypto.createDecipheriv('aes-256-gcm', key, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(enc), d.final()]).toString('utf8');
}
// Round-trip probe (same gate as seed-partner-registry's checkSecretKeyEnv).
if (decryptSecret(encryptSecret('probe-' + fingerprint)) !== 'probe-' + fingerprint) die('key round-trip failed');

// Resolve mongoose from the app tree (cwd = /root/evelyn-tutor/apps/tutor), not
// from wherever this file was uploaded to.
const mongoose = require(require.resolve('mongoose', {
  paths: [process.cwd(), process.cwd() + '/.next/standalone', '/root/evelyn-tutor'],
}));
mongoose.set('autoIndex', false);
mongoose.set('autoCreate', false);

(async () => {
  console.log(`mode: ${WRITE ? 'WRITE' : 'dry-run'} · key fingerprint ${fingerprint} · db ${uri.replace(/\/\/[^@]*@/, '//***@')}`);
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  // ---- 1. test sandbox lead ------------------------------------------------
  const leads = db.collection('tutorsandboxrequests');
  const matches = await leads
    .find({ name: { $regex: LEAD_NAME_PATTERN, $options: 'i' } })
    .project({ name: 1, email: 1, company: 1, status: 1, createdAt: 1 })
    .toArray();
  console.log(`\n[1] sandbox leads matching /${LEAD_NAME_PATTERN}/i: ${matches.length}`);
  for (const m of matches) console.log(`    ${m._id} · ${m.name} · ${m.email} · ${m.company} · ${m.status} · ${m.createdAt?.toISOString?.() ?? m.createdAt}`);
  if (WRITE && matches.length) {
    const r = await leads.deleteMany({ _id: { $in: matches.map((m) => m._id) } });
    console.log(`    deleted ${r.deletedCount}`);
  }
  const remaining = await leads.find({}).project({ name: 1, email: 1, company: 1, status: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(10).toArray();
  console.log(`    remaining leads (latest ${remaining.length}):`);
  for (const m of remaining) console.log(`    ${m.name} · ${m.email} · ${m.company} · ${m.status} · ${m.createdAt?.toISOString?.() ?? m.createdAt}`);

  // ---- 2. partner row --------------------------------------------------------
  const partners = db.collection('partners');
  const existing = await partners.findOne({ _id: PARTNER_ID });
  console.log(`\n[2] partner row "${PARTNER_ID}": ${existing ? 'EXISTS' : 'absent'}`);
  if (existing) {
    console.log(`    name=${existing.name} kind=${existing.kind} status=${existing.status} secrets=${(existing.secrets || []).length} allowed=${JSON.stringify(existing.allowedEndpoints)} limits=${JSON.stringify(existing.limits)}`);
    let matched = -1;
    (existing.secrets || []).forEach((s, i) => { try { if (decryptSecret(s) === PARTNER_SECRET) matched = i; } catch (_) { /* wrong key or tampered */ } });
    console.log(matched >= 0
      ? `    provided secret MATCHES stored secret #${matched} (label=${existing.secrets[matched].label}) — nothing to do`
      : '    provided secret does NOT match any stored secret — row left untouched. To rotate, append a sealed secret by hand (see seed-partner-registry.ts header).');
  } else {
    const ts = new Date().toISOString();
    const sealed = encryptSecret(PARTNER_SECRET);
    const doc = {
      _id: PARTNER_ID,
      name: PARTNER_NAME,
      kind: 'partner',
      status: 'active',
      secrets: [{ ciphertext: sealed.ciphertext, keyVersion: sealed.keyVersion, label: 'seed', createdAt: ts }],
      allowedEndpoints: ['/api/portal/v1/'],
      limits: { rpm: 600, burst: 60, dailyQuota: null },
      flagOverrides: {},
      metering: {},
      createdAt: ts,
      updatedAt: ts,
    };
    console.log(`    would create: ${JSON.stringify({ ...doc, secrets: '[1 sealed secret]' })}`);
    if (WRITE) {
      await partners.insertOne(doc);
      const back = await partners.findOne({ _id: PARTNER_ID });
      const ok = back && decryptSecret(back.secrets[0]) === PARTNER_SECRET;
      console.log(ok ? '    created + read back + secret round-trip OK' : '    created but READ-BACK ROUND-TRIP FAILED — investigate before handing out credentials');
      if (!ok) process.exitCode = 2;
    }
  }
  const all = await partners.find({}).project({ name: 1, kind: 1, status: 1, secrets: 1 }).toArray();
  console.log('    all partner rows: ' + all.map((p) => `${p._id}(${p.kind}/${p.status}/${(p.secrets || []).length}s)`).join(', '));

  await mongoose.disconnect();
  if (!WRITE) console.log('\n(dry run — re-run with --write to apply)');
})().catch((e) => { console.error(e); process.exit(1); });
