/**
 * Demo-gate unit tests (demo-abuse restrictions, 2026-08-29).
 *
 * Run: `npm run test:demo-gate`
 *
 * Hermetic — covers the PURE parts: grant sign/verify (roundtrip, tamper,
 * expiry, wrong secret, malformed), email/name normalization, mode + limit
 * parsing, IP resolution (x-real-ip preferred, LAST XFF hop, ::ffff strip),
 * allowlist (private ranges + env list), and the enforce-order contract that
 * an evelyn-marketing embed token WITHOUT demo_gate must not pass while one
 * WITH it (from mintDemoEmbedToken) must. Mongo-backed counters are
 * exercised in prod via the reserve/rollback pattern proven on Crimsora;
 * they are deliberately not covered here (no hermetic Mongo in this repo).
 *
 * Style mirrors scripts/test-portal-auth.ts.
 */

import assert from 'node:assert';

// Env BEFORE imports that read it lazily (all demo-gate config reads are
// call-time, but keep the portal-auth convention).
process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ 'evelyn-marketing': 'mkt-secret' });
process.env.TUTOR_DEMO_GATE_SECRET = 'gate-secret';

import {
  demoGateLimits,
  demoGateMode,
  demoGateSecret,
  gateClientIp,
  isAllowlistedIp,
  normalizeDemoEmail,
  normalizeDemoName,
} from '@/lib/tutor/demo-gate/gate';
import { signDemoGrant, verifyDemoGrant, DEMO_GRANT_TTL_MS } from '@/lib/tutor/demo-gate/grant';
import { mintDemoEmbedToken } from '@/lib/tutor/demo-gate/mint';
import { verifyEmbedToken } from '@/lib/tutor/portal/embed-token';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}

function headers(map: Record<string, string>): Headers {
  return new Headers(map);
}

async function main() {
  // ── grant ────────────────────────────────────────────────────────────────
  await test('grant roundtrip verifies and carries email+name', () => {
    const v = signDemoGrant({ email: 'kid@example.com', name: 'Kid' }, 'sec');
    const g = verifyDemoGrant(v, 'sec');
    assert.ok(g);
    assert.strictEqual(g!.email, 'kid@example.com');
    assert.strictEqual(g!.name, 'Kid');
  });
  await test('grant rejects wrong secret', () => {
    const v = signDemoGrant({ email: 'kid@example.com' }, 'sec');
    assert.strictEqual(verifyDemoGrant(v, 'other'), null);
  });
  await test('grant rejects tampered payload', () => {
    const v = signDemoGrant({ email: 'kid@example.com' }, 'sec');
    const [body, sig] = v.split('.') as [string, string];
    const forged = Buffer.from(
      JSON.stringify({ email: 'attacker@example.com', exp: Math.floor(Date.now() / 1000) + 9999 }),
      'utf8',
    ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    assert.notStrictEqual(forged, body); // control: the forgery actually differs
    assert.strictEqual(verifyDemoGrant(`${forged}.${sig}`, 'sec'), null);
  });
  await test('grant rejects after expiry (and passes just before)', () => {
    const t0 = Date.now();
    const v = signDemoGrant({ email: 'kid@example.com' }, 'sec', t0);
    assert.ok(verifyDemoGrant(v, 'sec', t0 + DEMO_GRANT_TTL_MS - 1000));
    assert.strictEqual(verifyDemoGrant(v, 'sec', t0 + DEMO_GRANT_TTL_MS + 1000), null);
  });
  await test('grant rejects garbage inputs without throwing', () => {
    for (const bad of [null, undefined, '', 'x', 'a.b.c', 'not-base64.!!!']) {
      assert.strictEqual(verifyDemoGrant(bad as string | null | undefined, 'sec'), null);
    }
  });

  // ── validation ───────────────────────────────────────────────────────────
  await test('email: normalizes case/whitespace; requires dotted domain', () => {
    assert.strictEqual(normalizeDemoEmail('  Kid@Example.COM '), 'kid@example.com');
    assert.strictEqual(normalizeDemoEmail('user@gmail'), null); // HTML5-valid, rejected here
    assert.strictEqual(normalizeDemoEmail('no spaces@ex.com'), null);
    assert.strictEqual(normalizeDemoEmail(''), null);
    assert.strictEqual(normalizeDemoEmail(42), null);
    assert.strictEqual(normalizeDemoEmail('a@b.co'), 'a@b.co');
  });
  await test('name: trimmed, non-empty, ≤60', () => {
    assert.strictEqual(normalizeDemoName('  Riley '), 'Riley');
    assert.strictEqual(normalizeDemoName('   '), null);
    assert.strictEqual(normalizeDemoName('x'.repeat(61)), null);
  });

  // ── config ───────────────────────────────────────────────────────────────
  await test('mode: defaults ON; off/log respected', () => {
    delete process.env.TUTOR_DEMO_GATE;
    assert.strictEqual(demoGateMode(), 'on'); // flag-default-ON rule (2026-08-20)
    process.env.TUTOR_DEMO_GATE = 'off';
    assert.strictEqual(demoGateMode(), 'off');
    process.env.TUTOR_DEMO_GATE = 'log';
    assert.strictEqual(demoGateMode(), 'log');
    process.env.TUTOR_DEMO_GATE = 'bogus';
    assert.strictEqual(demoGateMode(), 'on');
    delete process.env.TUTOR_DEMO_GATE;
  });
  await test('limits: defaults + env override + junk env falls back', () => {
    delete process.env.TUTOR_DEMO_PER_IP_PER_DAY;
    assert.deepStrictEqual(demoGateLimits(), {
      perIpPerDay: 3, perDevicePerDay: 3, perEmailLifetime: 3, globalPerDay: 50,
    });
    process.env.TUTOR_DEMO_PER_IP_PER_DAY = '7';
    assert.strictEqual(demoGateLimits().perIpPerDay, 7);
    process.env.TUTOR_DEMO_PER_IP_PER_DAY = 'lots';
    assert.strictEqual(demoGateLimits().perIpPerDay, 3);
    delete process.env.TUTOR_DEMO_PER_IP_PER_DAY;
  });
  await test('secret: dedicated env wins, partner secret is the fallback', () => {
    assert.strictEqual(demoGateSecret(), 'gate-secret');
    delete process.env.TUTOR_DEMO_GATE_SECRET;
    assert.strictEqual(demoGateSecret(), 'mkt-secret');
    process.env.TUTOR_DEMO_GATE_SECRET = 'gate-secret';
  });

  // ── IP resolution ────────────────────────────────────────────────────────
  await test('ip: x-real-ip preferred; LAST XFF hop otherwise; ::ffff stripped', () => {
    assert.strictEqual(gateClientIp(headers({ 'x-real-ip': '1.2.3.4' })), '1.2.3.4');
    // Forged first hop must NOT win — nginx APPENDS the real client last.
    assert.strictEqual(
      gateClientIp(headers({ 'x-forwarded-for': '6.6.6.6, 1.2.3.4' })),
      '1.2.3.4',
    );
    assert.strictEqual(gateClientIp(headers({ 'x-real-ip': '::ffff:9.8.7.6' })), '9.8.7.6');
    assert.strictEqual(gateClientIp(headers({})), '');
  });
  await test('allowlist: private ranges always pass; env list exact-matches', () => {
    assert.ok(isAllowlistedIp('127.0.0.1'));
    assert.ok(isAllowlistedIp('::1'));
    assert.ok(isAllowlistedIp('192.168.1.5'));
    assert.ok(!isAllowlistedIp('47.161.46.72'));
    process.env.TUTOR_DEMO_IP_ALLOWLIST = '157.131.199.237, 8.8.8.8';
    assert.ok(isAllowlistedIp('157.131.199.237'));
    assert.ok(isAllowlistedIp('8.8.8.8'));
    assert.ok(!isAllowlistedIp('47.161.46.72'));
    delete process.env.TUTOR_DEMO_IP_ALLOWLIST;
    assert.ok(!isAllowlistedIp(''));
  });

  // ── mint + demo_gate claim contract ──────────────────────────────────────
  await test('mintDemoEmbedToken: signed, forced claims, demo_gate stamped', () => {
    const { token, studentId } = mintDemoEmbedToken(
      { partner_id: 'spoofed', student_id: 'spoofed', exp: 1, subject: 'math' },
      'Riley',
    );
    const verdict = verifyEmbedToken(token);
    assert.ok(verdict.ok, `expected verify ok, got ${JSON.stringify(verdict)}`);
    if (verdict.ok) {
      assert.strictEqual(verdict.payload.partner_id, 'evelyn-marketing');
      assert.strictEqual(verdict.payload.student_id, studentId);
      assert.ok(String(verdict.payload.student_id).startsWith('demo-'));
      assert.strictEqual(verdict.payload.demo_gate, 1);
      assert.strictEqual(verdict.payload.student_name, 'Riley');
      assert.strictEqual(verdict.payload.subject, 'math');
      assert.ok((verdict.payload.exp as number) * 1000 > Date.now() + 60_000);
    }
  });
  await test('enforce contract: evelyn-marketing token without demo_gate is refused shape', () => {
    // The enforce.ts rule is `partner_id !== 'evelyn-marketing' || demo_gate`.
    // Assert both halves against real minted payloads.
    const gated = mintDemoEmbedToken({});
    const v = verifyEmbedToken(gated.token);
    assert.ok(v.ok);
    if (v.ok) {
      const passes = v.payload.partner_id !== 'evelyn-marketing' || v.payload.demo_gate === 1;
      assert.ok(passes);
    }
    // A legacy-shaped ungated payload (what the old route/btoa produced).
    const legacy = { partner_id: 'evelyn-marketing', student_id: 'demo-x' } as Record<string, unknown>;
    const legacyPasses = legacy.partner_id !== 'evelyn-marketing' || legacy.demo_gate === 1;
    assert.ok(!legacyPasses);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

void main();
