/**
 * Partner dashboard and self-serve sandbox (lib/tutor/partner-dashboard): the whole flow against an in-memory
 * store. No database, no mail.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  SANDBOX_FREE_MINUTES, cleanEmail, envPartnerIds, hashToken, loginLinkUrl, maskSecret, partnerIdFromCompany, pickPartnerId,
  signupLimits, testLessonClaims, usageByDay,
} from '../src/lib/tutor/partner-dashboard/core';
import {
  accountForSession, addMember, noteFirstSession, removeMember, requestLink, rotateSecret, signOut, useLink,
  type AccountRow, type DashStore, type LinkRow, type Mail, type ServiceEnv,
} from '../src/lib/tutor/partner-dashboard/service';

import { POOL_CALLS_FLOOR, POOL_CALLS_PER_CAP_MINUTE, poolCallCeiling, poolGuardVerdict, poolServerGuardOn } from '../src/lib/tutor/portal/pool-server-guard';
import { sessionsCsv } from '../src/lib/tutor/partner-dashboard/data';
import { admitRefusedLine, partnerApiLogOn } from '../src/lib/tutor/partner-dashboard/api-log';
import { isDashboardAdmin, parseAdminAction } from '../src/lib/tutor/partner-dashboard/admin';
import { createHmac } from 'node:crypto';
import { checkWebhookUrl, checkWebhookUrlShape, isPrivateAddress, signWebhook, webhookBody } from '../src/lib/tutor/partner-dashboard/webhooks';
import { MINUTE_PACKS, PACK_LIFETIME_MS, billingEnv, checkoutForm, lapsePlan, mayBuy, packById, paidCheckoutFromEvent, perMinute, topUpLineSec, verifyStripeSignature, type Lot } from '../src/lib/tutor/partner-dashboard/billing';
import { TEXT_MINUTE_RATE, pooledSeconds } from '../src/lib/tutor/portal/partner-pool';

let passed = 0; let failed = 0;
const pending: Promise<void>[] = [];
function test(name: string, fn: () => void | Promise<void>) {
  pending.push((async () => {
    try { await fn(); passed++; console.log(`  ✓ ${name}`); } catch (err) { failed++; console.log(`  ✗ ${name}\n      ${(err as Error).message}`); }
  })());
}

function memory() {
  const s = {
    t: Date.parse('2026-11-24T12:00:00Z'),
    counters: new Map<string, number>(), accounts: new Map<string, AccountRow>(), links: new Map<string, LinkRow & { used?: boolean }>(),
    sessions: new Map<string, { email: string; expiresAt: Date }>(),
    partners: new Map<string, { name: string; secrets: Array<{ secret: string; expiresAt?: Date }>; poolMinutes: number }>(),
    mail: [] as Mail[], failCreatePartner: false,
  };
  const store: DashStore & { stampFirstSession(partnerId: string, at: Date): Promise<AccountRow | null> } = {
    now: () => s.t,
    async reserve(key, cap) { const n = s.counters.get(key) ?? 0; if (cap > 0 && n >= cap) return false; s.counters.set(key, n + 1); return true; },
    async release(key) { s.counters.set(key, Math.max(0, (s.counters.get(key) ?? 0) - 1)); },
    async findAccount(email) { return s.accounts.get(email) ?? null; },
    async listAccounts(partnerId) { return [...s.accounts.values()].filter((a) => a.partnerId === partnerId); },
    async createAccount(row) { if (s.accounts.has(row.email)) return false; s.accounts.set(row.email, { ...row }); return true; },
    async updateAccount(email, set) { const a = s.accounts.get(email); if (a) Object.assign(a, set); },
    async removeAccount(email) { s.accounts.delete(email); },
    async saveLink(row) { s.links.set(row.tokenHash, { ...row }); },
    async takeLink(h) { const l = s.links.get(h); if (!l || l.used || l.expiresAt.getTime() <= s.t) return null; l.used = true; return l; },
    async saveSession(h, email, expiresAt) { s.sessions.set(h, { email, expiresAt }); },
    async sessionEmail(h) { const x = s.sessions.get(h); return x && x.expiresAt.getTime() > s.t ? x.email : null; },
    async dropSession(h) { s.sessions.delete(h); },
    async dropSessionsOf(email) { for (const [h, x] of s.sessions) if (x.email === email) s.sessions.delete(h); },
    async partnerIdTaken(id) { return s.partners.has(id) || id === 'crimsora'; },
    async createPartner({ partnerId, name, secret, poolMinutes }) {
      if (s.failCreatePartner) throw new Error('db down');
      if (s.partners.has(partnerId)) throw new Error('taken');
      s.partners.set(partnerId, { name, secrets: [{ secret }], poolMinutes });
    },
    async partnerSecrets(partnerId) { return (s.partners.get(partnerId)?.secrets ?? []).filter((x) => !x.expiresAt || x.expiresAt.getTime() > s.t).map((x) => ({ secret: x.secret, label: 'x', createdAt: '', expiresAt: x.expiresAt?.toISOString() })); },
    async rotateSecret(partnerId, secret, until) { const p = s.partners.get(partnerId)!; p.secrets = [{ secret }, ...p.secrets.map((x) => ({ ...x, expiresAt: x.expiresAt && x.expiresAt < until ? x.expiresAt : until }))]; },
    async sendMail(m) { s.mail.push(m); return true; },
    async stampFirstSession(partnerId, at) { const o = [...s.accounts.values()].find((a) => a.partnerId === partnerId && a.role === 'owner' && !a.firstSessionAt); if (!o) return null; const before = { ...o }; o.firstSessionAt = at; return before; },
  };
  return { s, store };
}

const env: ServiceEnv = { origin: 'https://tutor.example', limits: signupLimits({} as NodeJS.ProcessEnv), ownerEmail: 'owner@example.com', signupOn: true };
const tokenIn = (m: Mail) => decodeURIComponent(/verify\?token=([^\s"<]+)/.exec(m.text)![1]);
const signup = { email: 'Dev@Acme.io', name: 'Dana Dev', company: 'Acme Learning', useCase: 'maths app', acceptTerms: true, ip: '9.9.9.9' };

console.log('core');
test('a company name becomes a partner id; reserved and unusable names do not', () => {
  assert.equal(partnerIdFromCompany('Acme Learning, Inc.'), 'acme-learning-inc');
  assert.equal(partnerIdFromCompany('Évelyn & Co'), null, 'ours');
  assert.equal(partnerIdFromCompany('Lumiq'), 'lumiq');
  for (const bad of ['', 'ab', '学習', 'Evelyn', 'evelyn-marketing', 'admin', 'Test', 'lmtest', '123 Go', 'sandbox']) assert.equal(partnerIdFromCompany(bad), null, bad);
  assert.ok(partnerIdFromCompany('x'.repeat(80))!.length <= 28);
});
test('a taken id gets a random tail; a name that gives none gets a random id', async () => {
  let n = 0; const rand = () => `r${n++}`;
  assert.equal(await pickPartnerId('Crimsora', async (id) => id === 'crimsora', rand), 'crimsora-r0');
  assert.match(await pickPartnerId('学習', async () => false, rand), /^sb-r\d+r\d+$/);
  await assert.rejects(pickPartnerId('Acme', async () => true, rand));
});
test('names in the env secrets map count as taken', () => {
  const ids = envPartnerIds({ PORTAL_PARTNER_SECRETS: '{"academy":"a","crimsora":"b"}', PORTAL_PARTNER_ID: 'solo' } as unknown as NodeJS.ProcessEnv);
  assert.deepEqual([...ids].sort(), ['academy', 'crimsora', 'solo']);
  assert.equal(envPartnerIds({ PORTAL_PARTNER_SECRETS: 'not json' } as unknown as NodeJS.ProcessEnv).size, 0);
});
test('emails are lower-cased and checked; the link opens a page, never an API route', () => {
  assert.equal(cleanEmail('  Dev@Acme.IO '), 'dev@acme.io');
  for (const bad of ['', 'a@b', 'a b@c.d', 5, null]) assert.equal(cleanEmail(bad), null);
  assert.equal(loginLinkUrl('a+b', 'https://x.y'), 'https://x.y/dashboard/verify?token=a%2Bb');
});
test('a test lesson is an ordinary session of the partner, on the dashboard-test student', () => {
  const now = Date.parse('2026-11-24T00:00:00Z');
  const c = testLessonClaims('acme', { language: 'zh-TW', subject: 'math', topic: '聯立方程式', mode: 'text', minutes: 500, partner_id: 'crimsora' } as never, now, ['en', 'ja', 'zh-TW']);
  assert.equal(c.partner_id, 'acme'); assert.equal(c.student_id, 'dashboard-test'); assert.deepEqual(c.tutor_languages, ['zh-TW']);
  assert.equal(c.input_mode, 'text'); assert.equal(c.max_duration_minutes, 30); assert.equal(c.exp, now / 1000 + 7200);
  const en = testLessonClaims('acme', { language: 'xx' }, now, ['en', 'ja']);
  assert.equal('tutor_languages' in en, false); assert.equal(en.input_mode, 'voice'); assert.equal(en.max_duration_minutes, 10);
});
test('usage by day: thirty days, oldest first, empty days kept, older sessions left out', () => {
  const now = Date.parse('2026-11-24T12:00:00Z');
  const d = usageByDay([{ startedAt: '2026-11-24T01:00:00Z', seconds: 90 }, { startedAt: '2026-11-24T02:00:00Z', seconds: 30 }, { startedAt: '2026-11-20T00:00:00Z', seconds: 600 }, { startedAt: '2026-09-01T00:00:00Z', seconds: 999 }], now);
  assert.equal(d.length, 30); assert.equal(d[0].day, '2026-10-26'); assert.deepEqual(d[29], { day: '2026-11-24', minutes: 2, sessions: 2 });
  assert.deepEqual(d[25], { day: '2026-11-20', minutes: 10, sessions: 1 }); assert.equal(d.reduce((n, x) => n + x.sessions, 0), 3);
});
test('a masked secret shows its last four characters only', () => {
  assert.equal(maskSecret('abcdef0123456789'), '••••••••••••6789'); assert.equal(maskSecret('abc'), '••••');
});

console.log('sign-up');
test('a new email: nothing exists until the link is used; then partner, pool, owner account, session and a note to us', async () => {
  const { s, store } = memory();
  assert.deepEqual(await requestLink(store, env, signup), { ok: true });
  assert.equal(s.partners.size, 0); assert.equal(s.accounts.size, 0);
  assert.equal(s.mail.length, 1); assert.equal(s.mail[0].to, 'dev@acme.io');
  const token = tokenIn(s.mail[0]);
  assert.ok(!s.links.has(token) && s.links.has(hashToken(token)), 'only the hash is stored');
  const r = await useLink(store, env, token);
  assert.ok(r.ok && r.created && r.partnerId === 'acme-learning');
  const p = s.partners.get('acme-learning')!;
  assert.equal(p.poolMinutes, SANDBOX_FREE_MINUTES); assert.match(p.secrets[0].secret, /^[0-9a-f]{64}$/);
  const a = s.accounts.get('dev@acme.io')!;
  assert.equal(a.role, 'owner'); assert.ok(a.termsAcceptedAt && a.termsVersion);
  assert.equal(s.mail[1].to, 'owner@example.com'); assert.match(s.mail[1].subject, /New sandbox: Acme Learning/); assert.match(s.mail[1].text, /maths app/);
  assert.equal((await accountForSession(store, r.ok ? r.sessionToken : ''))?.email, 'dev@acme.io');
  assert.ok(!s.mail.some((m) => m.text.includes(p.secrets[0].secret)), 'the secret is never emailed');
});
test('a link works once, and not after 30 minutes', async () => {
  const { s, store } = memory();
  await requestLink(store, env, signup);
  const token = tokenIn(s.mail[0]);
  assert.ok((await useLink(store, env, token)).ok);
  assert.deepEqual(await useLink(store, env, token), { ok: false, error: 'invalid_link' });
  await requestLink(store, env, { email: signup.email });
  s.t += 31 * 60_000;
  assert.deepEqual(await useLink(store, env, tokenIn(s.mail.at(-1)!)), { ok: false, error: 'invalid_link' });
  for (const bad of ['', 'short', 5, 'x'.repeat(300)]) assert.deepEqual(await useLink(store, env, bad), { ok: false, error: 'invalid_link' });
});
test('one sandbox per email: a second sign-up for the same email signs in to the first', async () => {
  const { s, store } = memory();
  await requestLink(store, env, signup); await requestLink(store, env, signup);
  const [t1, t2] = [tokenIn(s.mail[0]), tokenIn(s.mail[1])];
  const a = await useLink(store, env, t1); const b = await useLink(store, env, t2);
  assert.ok(a.ok && a.created); assert.ok(b.ok && !b.created && b.partnerId === 'acme-learning');
  assert.equal(s.partners.size, 1);
  // after the account exists the same form sends a sign-in link, and says the same thing
  assert.deepEqual(await requestLink(store, env, { ...signup, company: 'Other Co' }), { ok: true });
  assert.equal(s.links.get(hashToken(tokenIn(s.mail.at(-1)!)))!.purpose, 'login');
});
test('a sign-in request for an unknown email answers ok and sends nothing', async () => {
  const { s, store } = memory();
  assert.deepEqual(await requestLink(store, env, { email: 'nobody@x.io' }), { ok: true });
  assert.equal(s.mail.length, 0); assert.equal(s.links.size, 0);
});
test('sign-up needs a name, a company and the terms', async () => {
  const { store } = memory();
  assert.deepEqual(await requestLink(store, env, { ...signup, company: '' }), { ok: false, error: 'missing_fields' });
  assert.deepEqual(await requestLink(store, env, { ...signup, acceptTerms: 'yes' }), { ok: false, error: 'terms_required' });
  assert.deepEqual(await requestLink(store, env, { ...signup, email: 'nope' }), { ok: false, error: 'invalid_email' });
});
test('limits: links per email per day, sandboxes per IP per day, sandboxes per day for everyone', async () => {
  const { s, store } = memory();
  const tight: ServiceEnv = { ...env, limits: { linksPerEmailPerDay: 2, linksPerIpPerDay: 50, sandboxesPerIpPerDay: 1, sandboxesPerDay: 2 } };
  await requestLink(store, tight, signup); await requestLink(store, tight, signup);
  assert.deepEqual(await requestLink(store, tight, signup), { ok: false, error: 'rate_limited' });
  assert.ok((await useLink(store, tight, tokenIn(s.mail[0]))).ok);
  await requestLink(store, tight, { ...signup, email: 'b@b.io', company: 'Beta Co' });
  assert.deepEqual(await useLink(store, tight, tokenIn(s.mail.at(-1)!)), { ok: false, error: 'rate_limited' }, 'second sandbox from one IP');
  assert.equal(s.counters.get('dash:signup:global:2026-11-24'), 1, 'the refused one gave its place back');
  await requestLink(store, tight, { ...signup, email: 'c@c.io', company: 'Gamma Co', ip: '1.1.1.1' });
  assert.ok((await useLink(store, tight, tokenIn(s.mail.at(-1)!))).ok);
  await requestLink(store, tight, { ...signup, email: 'd@d.io', company: 'Delta Co', ip: '2.2.2.2' });
  assert.deepEqual(await useLink(store, tight, tokenIn(s.mail.at(-1)!)), { ok: false, error: 'rate_limited' }, 'the day is full');
  assert.equal(s.partners.size, 2);
});
test('sign-ups switched off: no new sandbox, sign-in still works', async () => {
  const { s, store } = memory();
  await requestLink(store, env, signup); await useLink(store, env, tokenIn(s.mail[0]));
  const closed = { ...env, signupOn: false };
  assert.deepEqual(await requestLink(store, closed, { ...signup, email: 'new@x.io' }), { ok: false, error: 'signup_closed' });
  assert.deepEqual(await requestLink(store, closed, { email: signup.email }), { ok: true });
  assert.ok((await useLink(store, closed, tokenIn(s.mail.at(-1)!))).ok);
});
test('keys could not be made: no account is left behind, and the email can sign up again', async () => {
  const { s, store } = memory();
  await requestLink(store, env, signup);
  s.failCreatePartner = true;
  await assert.rejects(useLink(store, env, tokenIn(s.mail[0])));
  assert.equal(s.accounts.size, 0); assert.equal(s.counters.get('dash:signup:global:2026-11-24'), 0);
  s.failCreatePartner = false;
  await requestLink(store, env, signup);
  assert.ok((await useLink(store, env, tokenIn(s.mail.at(-1)!))).ok);
});
test('a taken company id gets a tail', async () => {
  const { s, store } = memory();
  await requestLink(store, env, { ...signup, company: 'Crimsora' });
  const r = await useLink(store, env, tokenIn(s.mail[0]));
  assert.ok(r.ok && /^crimsora-[0-9a-f]{6}$/.test(r.partnerId));
});

console.log('signed in');
async function signedIn() {
  const m = memory();
  await requestLink(m.store, env, signup);
  const r = await useLink(m.store, env, tokenIn(m.s.mail[0]));
  assert.ok(r.ok);
  return { ...m, token: r.ok ? r.sessionToken : '', owner: m.s.accounts.get('dev@acme.io')! };
}
test('sign-out ends the session on the server; a session ends after thirty days', async () => {
  const { s, store, token } = await signedIn();
  s.t += 29 * 86_400_000; assert.ok(await accountForSession(store, token));
  s.t += 2 * 86_400_000; assert.equal(await accountForSession(store, token), null);
  const again = await signedIn();
  await signOut(again.store, again.token);
  assert.equal(await accountForSession(again.store, again.token), null);
  assert.equal(await accountForSession(again.store, undefined), null);
});
test('rotating the secret: the new one is first, the old one works for a day, then is gone', async () => {
  const { s, store, owner } = await signedIn();
  const old = (await store.partnerSecrets('acme-learning'))[0].secret;
  const r = await rotateSecret(store, owner);
  assert.ok(r.ok && r.secret !== old);
  let live = await store.partnerSecrets('acme-learning');
  assert.deepEqual(live.map((x) => x.secret), [r.ok ? r.secret : '', old]);
  s.t += 25 * 3_600_000;
  live = await store.partnerSecrets('acme-learning');
  assert.deepEqual(live.map((x) => x.secret), [r.ok ? r.secret : '']);
});
test('members: an owner adds and removes them; a member cannot rotate, add or remove; the owner cannot be removed', async () => {
  const { s, store, owner } = await signedIn();
  assert.deepEqual(await addMember(store, env, owner, 'Pat@Acme.io'), { ok: true });
  const member = s.accounts.get('pat@acme.io')!;
  assert.equal(member.partnerId, 'acme-learning'); assert.equal(member.role, 'member');
  assert.deepEqual(await addMember(store, env, owner, 'pat@acme.io'), { ok: false, error: 'email_in_use' });
  assert.deepEqual(await rotateSecret(store, member), { ok: false, error: 'owner_only' });
  assert.deepEqual(await addMember(store, env, member, 'x@y.io'), { ok: false, error: 'owner_only' });
  assert.deepEqual(await removeMember(store, member, owner.email), { ok: false, error: 'owner_only' });
  assert.deepEqual(await removeMember(store, owner, owner.email), { ok: false, error: 'not_found' });
  // a member signs in with their own link, and their session ends when they are removed
  await requestLink(store, env, { email: 'pat@acme.io' });
  const r = await useLink(store, env, tokenIn(s.mail.at(-1)!));
  assert.ok(r.ok && !r.created && r.partnerId === 'acme-learning');
  assert.deepEqual(await removeMember(store, owner, 'pat@acme.io'), { ok: true });
  assert.equal(await accountForSession(store, r.ok ? r.sessionToken : ''), null);
});
test('an owner cannot remove a person of another partner', async () => {
  const { s, store, owner } = await signedIn();
  await requestLink(store, env, { ...signup, email: 'o@other.io', company: 'Other Co', ip: '3.3.3.3' });
  await useLink(store, env, tokenIn(s.mail.at(-1)!));
  await addMember(store, env, s.accounts.get('o@other.io')!, 'm@other.io');
  assert.deepEqual(await removeMember(store, owner, 'm@other.io'), { ok: false, error: 'not_found' });
  assert.ok(s.accounts.has('m@other.io'));
});
test('the first session is told to us once', async () => {
  const { s, store } = await signedIn();
  const before = s.mail.length;
  assert.equal(await noteFirstSession(store, env, { partnerId: 'acme-learning', sessionId: 'embed-1', minutes: 6.4, languages: ['zh-TW'], topic: '聯立方程式', inputMode: 'voice' }), true);
  assert.equal(await noteFirstSession(store, env, { partnerId: 'acme-learning', sessionId: 'embed-2', minutes: 2 }), false);
  assert.equal(await noteFirstSession(store, env, { partnerId: 'greenapple', sessionId: 'embed-3', minutes: 2 }), false, 'a partner with no dashboard account');
  assert.equal(s.mail.length, before + 1);
  assert.match(s.mail.at(-1)!.subject, /First session: Acme Learning/); assert.match(s.mail.at(-1)!.text, /zh-TW[\s\S]*聯立方程式/);
});

console.log('wiring (source)');
const src = (rel: string) => readFileSync(join(__dirname, '..', 'src', rel), 'utf8');
test('the replay page checks the partner as well as the student', () => {
  assert.match(src('app/tutor-portal/replay/page.tsx'), /session\.sourcePartnerId !== payload\.partner_id/);
});
test('every dashboard route that changes something asks for a same-origin request; reads are scoped by the account', () => {
  for (const r of ['keys/reveal', 'keys/rotate', 'test-link', 'sessions/replay', 'account', 'members']) {
    assert.match(src(`app/api/tutor-portal/dashboard/${r}/route.ts`), /requireAccount\(req, \{ write: true \}\)/, r);
  }
  for (const r of ['start', 'verify', 'logout']) assert.match(src(`app/api/tutor-portal/dashboard/${r}/route.ts`), /sameOrigin\(req\)/, r);
  const data = src('lib/tutor/partner-dashboard/data.ts');
  assert.equal((data.match(/TutorSession\.(?:find|findOne|countDocuments|aggregate)(?:<[^(]*>)?\(/g) ?? []).length, (data.match(/sourcePartnerId: partnerId/g) ?? []).length + 1, 'each query names the partner (one shares a filter object)');
});
test('a new partner gets its pool before its row, and the pool is never skipped', () => {
  const st = src('lib/tutor/partner-dashboard/mongo-store.ts');
  assert.ok(st.indexOf('PartnerPoolModel.create') > 0 && st.indexOf('PartnerPoolModel.create') < st.indexOf('PartnerModel.create'));
  assert.match(st, /allowedEndpoints: ENV_FALLBACK_ALLOWED_ENDPOINTS/); assert.match(st, /invalidatePartner\(partnerId\)/);
});

console.log('pool held on the server');
test('an empty pool refuses a paid call; a pool with minutes left allows it; no pool row is not pooled', () => {
  assert.equal(poolGuardVerdict(null), 'ok');
  assert.equal(poolGuardVerdict({ capSec: 18000, usedSec: 100, serverCalls: 5 }), 'ok');
  assert.equal(poolGuardVerdict({ capSec: 18000, usedSec: 18000, serverCalls: 5 }), 'pool_exhausted');
  assert.equal(poolGuardVerdict({ capSec: 0, usedSec: 0 }), 'pool_exhausted');
});
test('paid calls are counted, with a ceiling that follows the cap: a caller that reports no minutes is still stopped', () => {
  assert.equal(poolCallCeiling(18000), 300 * POOL_CALLS_PER_CAP_MINUTE);
  assert.equal(poolCallCeiling(600), POOL_CALLS_FLOOR);
  assert.equal(poolGuardVerdict({ capSec: 18000, usedSec: 0, serverCalls: 9000 }), 'ok');
  assert.equal(poolGuardVerdict({ capSec: 18000, usedSec: 0, serverCalls: 9001 }), 'pool_call_limit');
  assert.equal(poolGuardVerdict({ capSec: 36000, usedSec: 0, serverCalls: 9001 }), 'ok', 'a top-up raises it');
});
test('the gate asks the guard for a partner token and answers 402; the switch defaults on', () => {
  const g = src('lib/tutor/demo-gate/enforce.ts');
  assert.match(g, /await poolServerGuard\(p\.partner_id\)/); assert.match(g, /status: 402/);
  assert.equal(poolServerGuardOn({} as NodeJS.ProcessEnv), true); assert.equal(poolServerGuardOn({ TUTOR_POOL_SERVER_GUARD: 'off' } as unknown as NodeJS.ProcessEnv), false);
});

console.log('students, export, API log, owner view');
test('the CSV escapes commas, quotes and line breaks, and disarms cells a spreadsheet would run', () => {
  const csv = sessionsCsv([{ sessionId: 's1', studentId: '=HYPERLINK("x")', startedAt: '2026-11-24T00:00:00.000Z', minutes: 2.5, status: 'completed', languages: ['zh-TW', 'en'], subject: 'math', topic: 'a, "b"\nc', inputMode: 'voice', messages: 4, test: false }]);
  const [head, line] = csv.split('\r\n');
  assert.equal(head, 'session_id,student_id,started_at,minutes,status,languages,subject,topic,mode,messages');
  assert.ok(line.startsWith('s1,"\'=HYPERLINK(""x"")",2026-11-24T00:00:00.000Z,2.5,completed,zh-TW en,math,"a, ""b""'));
});
test('a refused call is logged once a second per claimed partner; the log has an off switch', () => {
  assert.equal(admitRefusedLine('zz-flood', 1000), true); assert.equal(admitRefusedLine('zz-flood', 1500), false);
  assert.equal(admitRefusedLine('zz-other', 1500), true); assert.equal(admitRefusedLine('zz-flood', 2001), true);
  assert.equal(partnerApiLogOn({} as NodeJS.ProcessEnv), true); assert.equal(partnerApiLogOn({ PARTNER_API_LOG: 'off' } as unknown as NodeJS.ProcessEnv), false);
  assert.match(src('lib/tutor/portal/auth.ts'), /recordPartnerApiCall\(\{ partnerId: req\.headers\.get\(PORTAL_PARTNER_HEADER\)/);
  assert.doesNotMatch(src('lib/tutor/partner-dashboard/api-log.ts'), /u\.search|rawBody|body:/, 'no query string, no body');
});
test('the owner view is for the listed emails only, and its actions are checked', () => {
  const env = { PARTNER_DASHBOARD_ADMINS: 'A@x.io, b@y.io' } as unknown as NodeJS.ProcessEnv;
  assert.ok(isDashboardAdmin('a@x.io', env) && isDashboardAdmin('B@Y.io', env)); assert.ok(!isDashboardAdmin('c@z.io', env) && !isDashboardAdmin(null, env));
  assert.ok(isDashboardAdmin('praveen@evelynlearning.com', {} as NodeJS.ProcessEnv));
  assert.deepEqual(parseAdminAction({ action: 'add_minutes', partnerId: 'acme', minutes: 300 }), { action: 'add_minutes', partnerId: 'acme', minutes: 300 });
  assert.deepEqual(parseAdminAction({ action: 'suspend', partnerId: 'acme' }), { action: 'suspend', partnerId: 'acme' });
  for (const bad of [null, {}, { action: 'add_minutes', partnerId: 'acme', minutes: -5 }, { action: 'add_minutes', partnerId: 'acme', minutes: 1.5 }, { action: 'add_minutes', partnerId: 'acme', minutes: 1e9 }, { action: 'delete', partnerId: 'acme' }, { action: 'suspend', partnerId: 'Acme Co' }, { action: 'suspend', partnerId: { $ne: '' } }]) assert.equal(parseAdminAction(bad), null, JSON.stringify(bad));
  const route = src('app/api/tutor-portal/dashboard/admin/partners/route.ts');
  assert.equal((route.match(/if \(!isDashboardAdmin\(a\.account\.email\)\) return json\(\{ error: 'not_found' \}, 404\)/g) ?? []).length, 2);
  assert.match(src('lib/tutor/partner-dashboard/admin.ts'), /\$inc: \{ capSec: a\.minutes \* 60 \}/);
});
test('erasing a student is the owner\'s, scoped to the account\'s partner', () => {
  const r = src('app/api/tutor-portal/dashboard/students/route.ts');
  assert.match(r, /a\.account\.role !== 'owner'\) return json\(\{ error: 'owner_only' \}, 403\)/);
  assert.match(r, /eraseStudentData\(\{ partnerId: a\.account\.partnerId, externalStudentId: body\.studentId \}\)/);
});

console.log('webhooks to the partner');
test('a webhook URL must be HTTPS, public, with no credentials and an ordinary port', () => {
  assert.deepEqual(checkWebhookUrlShape('https://api.acme.io/hooks/evelyn?x=1#frag'), { ok: true, url: 'https://api.acme.io/hooks/evelyn?x=1' });
  const bad: Array<[unknown, string]> = [['http://api.acme.io/h', 'https_only'], ['https://user:pw@acme.io/h', 'no_credentials'], ['https://acme.io:22/h', 'bad_port'], ['https://localhost/h', 'private_host'], ['https://intranet/h', 'private_host'], ['https://db.internal/h', 'private_host'], ['https://127.0.0.1/h', 'private_host'], ['https://10.1.2.3/h', 'private_host'], ['https://169.254.169.254/latest/meta-data', 'private_host'], ['https://[::1]/h', 'private_host'], ['https://[::ffff:10.0.0.1]/h', 'private_host'], ['ftp://acme.io', 'https_only'], ['not a url', 'invalid_url'], [5, 'invalid_url'], ['https://a.io/' + 'x'.repeat(600), 'invalid_url']];
  for (const [u, why] of bad) assert.deepEqual(checkWebhookUrlShape(u), { ok: false, error: why }, String(u));
});
test('private address ranges, v4 and v6', () => {
  for (const ip of ['0.0.0.0', '10.0.0.1', '100.64.0.1', '127.0.0.1', '169.254.1.1', '172.16.0.1', '172.31.255.255', '192.168.1.1', '198.18.0.1', '224.0.0.1', '255.255.255.255', '::', '::1', 'fc00::1', 'fd12::1', 'fe80::1', 'ff02::1', '::ffff:192.168.0.1', 'nonsense']) assert.equal(isPrivateAddress(ip), true, ip);
  for (const ip of ['8.8.8.8', '172.32.0.1', '100.63.0.1', '193.0.0.1', '2606:4700::1111', '::ffff:8.8.8.8']) assert.equal(isPrivateAddress(ip), ip === '::ffff:8.8.8.8' ? false : false, ip);
});
test('a host that resolves to a private address is refused, at save and before each send', async () => {
  assert.deepEqual(await checkWebhookUrl('https://hooks.acme.io/x', async () => ['93.184.216.34']), { ok: true, url: 'https://hooks.acme.io/x' });
  assert.deepEqual(await checkWebhookUrl('https://rebind.acme.io/x', async () => ['93.184.216.34', '10.0.0.5']), { ok: false, error: 'private_host' });
  assert.deepEqual(await checkWebhookUrl('https://nowhere.acme.io/x', async () => { throw new Error('ENOTFOUND'); }), { ok: false, error: 'invalid_url' });
  const w = src('lib/tutor/partner-dashboard/webhooks.ts');
  assert.ok((w.match(/await checkWebhookUrl\(/g) ?? []).length >= 3); assert.equal((w.match(/redirect: 'manual'/g) ?? []).length, (w.match(/await fetch\(/g) ?? []).length);
});
test('the webhook body and its signature: the partner\'s secret over timestamp.body', () => {
  const body = webhookBody('acme', 'session.ended', { session_id: 's1' }, Date.parse('2026-11-24T00:00:00Z'), 'evt_1');
  assert.equal(body, '{"id":"evt_1","type":"session.ended","created":"2026-11-24T00:00:00.000Z","partner_id":"acme","data":{"session_id":"s1"}}');
  assert.equal(signWebhook('secret', 1795500000000, body), createHmac('sha256', 'secret').update(`1795500000000.${body}`).digest('hex'));
});
test('a session\'s end is told once, from the save of its end', () => {
  const r = src('app/api/tutor/session-usage/route.ts');
  assert.match(r, /if \(status !== "active"\) notifySessionEnded\(who\.partnerId, sessionId\)/);
  assert.match(src('models/PartnerWebhookDelivery.ts'), /index\(\{ partnerId: 1, event: 1, key: 1 \}, \{ unique: true \}\)/);
});

console.log('billing');
test('the packs: per-minute price falls with size from the published rate', () => {
  assert.deepEqual(MINUTE_PACKS.map((p) => [p.minutes, p.usd, perMinute(p)]), [[500, 100, 0.2], [2500, 450, 0.18], [10000, 1600, 0.16]]);
  assert.equal(packById('pack_2500')!.minutes, 2500); assert.equal(packById('nope'), null); assert.equal(packById({ $ne: '' }), null);
});
test('no key: nothing is on sale; a test key sells only to the listed test buyers; a live key to everyone', () => {
  assert.equal(billingEnv({} as NodeJS.ProcessEnv), null); assert.equal(billingEnv({ STRIPE_SECRET_KEY: 'whatever' } as unknown as NodeJS.ProcessEnv), null);
  const t = billingEnv({ STRIPE_SECRET_KEY: 'sk_test_x', STRIPE_WEBHOOK_SECRET: 'whsec_x', PARTNER_BILLING_TEST_BUYERS: 'A@x.io' } as unknown as NodeJS.ProcessEnv)!;
  assert.equal(t.live, false); assert.equal(mayBuy(t, 'a@x.io'), true); assert.equal(mayBuy(t, 'b@x.io'), false);
  const l = billingEnv({ STRIPE_SECRET_KEY: 'sk_live_x', STRIPE_WEBHOOK_SECRET: 'whsec_x' } as unknown as NodeJS.ProcessEnv)!;
  assert.equal(l.live, true); assert.equal(mayBuy(l, 'anyone@x.io'), true);
  assert.equal(mayBuy(billingEnv({ STRIPE_SECRET_KEY: 'sk_live_x' } as unknown as NodeJS.ProcessEnv), 'anyone@x.io'), false, 'no webhook secret: a payment could not be credited');
  assert.equal(mayBuy(null, 'a@x.io'), false);
});
test('the checkout asks Stripe for the pack\'s price and carries the partner and the pack', () => {
  const f = checkoutForm({ pack: packById('pack_2500')!, partnerId: 'acme', email: 'd@acme.io', customerId: 'cus_1', origin: 'https://tutor.example', automaticTax: false });
  assert.equal(f.mode, 'payment'); assert.equal(f['line_items[0][price_data][unit_amount]'], 45000); assert.equal(f['metadata[partner_id]'], 'acme'); assert.equal(f['metadata[pack_id]'], 'pack_2500');
  assert.equal(f.success_url, 'https://tutor.example/dashboard/billing?paid={CHECKOUT_SESSION_ID}'); assert.equal('automatic_tax[enabled]' in f, false);
  assert.equal(checkoutForm({ pack: packById('pack_500')!, partnerId: 'acme', email: 'd@acme.io', customerId: 'cus_1', origin: 'https://t.e', automaticTax: true })['automatic_tax[enabled]'], true);
});
test('Stripe\'s signature: right secret and fresh timestamp only', () => {
  const body = '{"id":"evt_1"}'; const now = 1795500000000; const t = Math.floor(now / 1000);
  const sig = createHmac('sha256', 'whsec_a').update(`${t}.${body}`).digest('hex');
  assert.equal(verifyStripeSignature(body, `t=${t},v1=${sig}`, 'whsec_a', now), true);
  assert.equal(verifyStripeSignature(body, `t=${t},v1=deadbeef,v1=${sig}`, 'whsec_a', now), true, 'a rotated secret sends two');
  assert.equal(verifyStripeSignature(body + ' ', `t=${t},v1=${sig}`, 'whsec_a', now), false);
  assert.equal(verifyStripeSignature(body, `t=${t},v1=${sig}`, 'whsec_b', now), false);
  assert.equal(verifyStripeSignature(body, `t=${t},v1=${sig}`, 'whsec_a', now + 301_000), false, 'replayed later');
  for (const h of [null, '', 'v1=' + sig, `t=abc,v1=${sig}`, `t=${t}`]) assert.equal(verifyStripeSignature(body, h, 'whsec_a', now), false);
});
test('only a paid checkout of one of our packs, at the pack\'s price, is credited; the minutes come from the pack table', () => {
  const ev = (o: Record<string, unknown>, type = 'checkout.session.completed') => ({ type, livemode: false, data: { object: { id: 'cs_1', mode: 'payment', payment_status: 'paid', amount_subtotal: 10000, amount_total: 10800, currency: 'usd', metadata: { partner_id: 'acme', pack_id: 'pack_500', minutes: '999999', by: 'd@acme.io' }, ...o } } });
  assert.deepEqual(paidCheckoutFromEvent(ev({})), { sessionId: 'cs_1', partnerId: 'acme', packId: 'pack_500', minutes: 500, amountCents: 10800, currency: 'usd', by: 'd@acme.io', livemode: false, kind: 'checkout' });
  assert.ok(paidCheckoutFromEvent(ev({}, 'checkout.session.async_payment_succeeded')));
  for (const o of [{ payment_status: 'unpaid' }, { mode: 'subscription' }, { amount_subtotal: 100, amount_total: 100 }, { currency: 'inr' }, { metadata: { partner_id: 'acme', pack_id: 'pack_x' } }, { metadata: { partner_id: 'Bad Id', pack_id: 'pack_500' } }, { metadata: {} }, { id: '' }]) assert.equal(paidCheckoutFromEvent(ev(o)), null, JSON.stringify(o));
  assert.equal(paidCheckoutFromEvent(ev({}, 'payment_intent.succeeded')), null); assert.equal(paidCheckoutFromEvent(null), null);
});
test('a pack is credited once: the claim is one step, and the webhook is the only thing that credits', () => {
  const b = src('lib/tutor/partner-dashboard/billing.ts');
  assert.match(b, /findOneAndUpdate\(\{ stripeSessionId: p\.sessionId, creditedAt: \{ \$exists: false \} \}/);
  assert.match(src('models/PartnerPurchase.ts'), /stripeSessionId: \{ type: String, required: true, unique: true \}/);
  const hook = src('app/api/tutor-portal/billing/stripe-webhook/route.ts');
  assert.ok(hook.indexOf('verifyStripeSignature') < hook.indexOf('JSON.parse')); assert.match(hook, /paid\.livemode !== b\.live/);
  for (const r of ['billing/route.ts', 'billing/checkout/route.ts', 'billing/portal/route.ts']) assert.doesNotMatch(src(`app/api/tutor-portal/dashboard/${r}`), /creditPurchase/, r);
});

console.log('billing: text rate, expiry, automatic top-up');
test('a typed minute draws 0.8 of a minute, rounded on the running total', () => {
  assert.equal(TEXT_MINUTE_RATE, 0.8); assert.equal(pooledSeconds(600, 0.8), 480); assert.equal(pooledSeconds(600, 1), 600);
  let total = 0; for (let w = 7; w <= 700; w += 7) total += pooledSeconds(w, 0.8) - pooledSeconds(w - 7, 0.8);
  assert.equal(total, pooledSeconds(700, 0.8), 'a hundred small reports come to the same as one');
  assert.equal(pooledSeconds(100, 5), 100, 'a rate above 1 is not a rate'); assert.equal(pooledSeconds(-5, 0.8), 0);
  const st = src('lib/tutor/portal/partner-pool-store.ts');
  assert.match(st, /const rate = input\.textMode \? TEXT_MINUTE_RATE : 1;/); assert.match(st, /incPool\(input\.partnerId, poolDelta\)/);
  assert.match(src('app/api/tutor/session-usage/route.ts'), /body\.inputMode === "text" \? \{ textMode: true \} : \{\}/);
});
test('lapse: free minutes go first and never lapse; a pack past twelve months loses only what was not used', () => {
  const day = 86_400_000; const now = 400 * day;
  const lot = (id: string, min: number, creditedDay: number, o: Partial<Lot> = {}): Lot => ({ id, sec: min * 60, creditedAtMs: creditedDay * day, expiresAtMs: (creditedDay + 365) * day, lapsed: false, lapsedSec: 0, ...o });
  // 300 free + a 500 pack bought on day 10 (lapsed by day 400), 450 minutes used in all: 150 of the pack used, 350 lapse
  assert.deepEqual(lapsePlan({ capSec: 800 * 60, usedSec: 450 * 60 }, [lot('a', 500, 10)], now), [{ id: 'a', forfeitSec: 350 * 60 }]);
  // nothing used beyond the free minutes: the whole pack lapses, the free minutes stay
  assert.deepEqual(lapsePlan({ capSec: 800 * 60, usedSec: 100 * 60 }, [lot('a', 500, 10)], now), [{ id: 'a', forfeitSec: 500 * 60 }]);
  // fully used: lapses with nothing to take
  assert.deepEqual(lapsePlan({ capSec: 800 * 60, usedSec: 800 * 60 }, [lot('a', 500, 10)], now), [{ id: 'a', forfeitSec: 0 }]);
  // not yet due: nothing
  assert.deepEqual(lapsePlan({ capSec: 800 * 60, usedSec: 0 }, [lot('a', 500, 100)], now), []);
  // two packs, oldest used first: old one lapsed, newer one untouched
  assert.deepEqual(lapsePlan({ capSec: (300 + 500 + 2500) * 60, usedSec: 600 * 60 }, [lot('new', 2500, 200), lot('old', 500, 10)], now), [{ id: 'old', forfeitSec: 200 * 60 }]);
  // an already-lapsed pack counts only for what was used of it, and is not lapsed twice
  assert.deepEqual(lapsePlan({ capSec: (300 + 150 + 2500) * 60, usedSec: 600 * 60 }, [lot('old', 500, 10, { lapsed: true, lapsedSec: 350 * 60 }), lot('new', 2500, 20)], now), [{ id: 'new', forfeitSec: (2500 - 150) * 60 }]);
  assert.equal(PACK_LIFETIME_MS, 365 * day);
  const b = src('lib/tutor/partner-dashboard/billing.ts');
  assert.match(b, /findOneAndUpdate\(\{ _id: step\.id, expiredAt: \{ \$exists: false \} \}/, 'a pack is claimed before its seconds come off');
  assert.ok(b.indexOf('await lapseExpiredMinutes(p.partnerId)') < b.indexOf("$set: { creditedAt: now, expiresAt"), 'old lapses come off before a new pack goes on');
});
test('automatic top-up: the line, the paid invoice, and only our own invoices', () => {
  assert.equal(topUpLineSec(packById('pack_500')!), 50 * 60); assert.equal(topUpLineSec(packById('pack_10000')!), 1000 * 60); assert.equal(topUpLineSec({ id: 'x', minutes: 100, usd: 20, label: '' }), 30 * 60);
  const inv = (o: Record<string, unknown>, meta: Record<string, string> = { partner_id: 'acme', pack_id: 'pack_2500', kind: 'auto_topup' }) => ({ type: 'invoice.paid', livemode: true, data: { object: { id: 'in_1', status: 'paid', subtotal: 45000, total: 48600, amount_paid: 48600, currency: 'usd', metadata: meta, ...o } } });
  assert.deepEqual(paidCheckoutFromEvent(inv({})), { sessionId: 'in_1', partnerId: 'acme', packId: 'pack_2500', minutes: 2500, amountCents: 48600, currency: 'usd', livemode: true, kind: 'auto_topup' });
  assert.equal(paidCheckoutFromEvent(inv({}, {})), null, 'the invoice of an ordinary checkout is not a top-up');
  assert.equal(paidCheckoutFromEvent(inv({ status: 'open' })), null); assert.equal(paidCheckoutFromEvent(inv({ subtotal: 100 })), null);
  const b = src('lib/tutor/partner-dashboard/billing.ts');
  assert.match(b, /'autoTopUp\.pendingAt': \{ \$lt: new Date\(now\.getTime\(\) - 60 \* 60_000\) \}/, 'one top-up at a time');
  assert.doesNotMatch(b.slice(b.indexOf('export async function maybeAutoTopUp')), /creditPurchase|\$inc: \{ capSec/, 'the webhook credits, never the charge call');
  assert.match(src('app/api/tutor-portal/dashboard/billing/auto-topup/route.ts'), /role !== 'owner'\) return json\(\{ error: 'owner_only' \}, 403\)/);
  assert.equal(checkoutForm({ pack: packById('pack_500')!, partnerId: 'acme', email: 'd@acme.io', customerId: 'cus_1', origin: 'https://t.e', automaticTax: false })['payment_intent_data[setup_future_usage]'], 'off_session');
});

void Promise.all(pending).then(() => {
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
});
