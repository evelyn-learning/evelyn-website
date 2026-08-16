# M1c — Partner Registry & Enforced Namespacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `PORTAL_PARTNER_SECRETS` env JSON with a `Partner` collection, make cross-partner `studentId` collision impossible at the database level, and add per-partner limits, quotas, endpoint allowlists, flag overrides and metering.

**Architecture:** Identity is resolved once, at a single choke point. `withPortalAuth` verifies a partner against the registry (cached, multi-secret for rotation) and hands handlers a verified `partnerId`; `store.ts` turns `(partnerId, externalStudentId)` into a surrogate profile `_id` via an atomic upsert guarded by a unique index. `_id` is never rewritten, so the five collections that reference it never move. Limits, quotas and metering share one counter collection keyed by window granularity.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Mongoose, `node:crypto` (AES-256-GCM), `ts-node` + `tsconfig-paths` test harnesses, `node:assert`.

**Spec:** `docs/superpowers/specs/2026-08-15-m1c-partner-registry-design.md` — read it before Task 1. It carries the measured production state the migration depends on.

## Global Constraints

- **Zero behavioural change for existing partners until the rollout gate.** `academy`, `crimsora` and `evelyn-marketing` must see identical responses through Task 8. New error codes are additive; the existing `401 unknown_partner` path is untouched.
- **The portal contract is frozen.** Do not change `@evelyn/portal-contract` or the HMAC scheme. Secrets are stored **encrypted, never hashed** — HMAC verification requires the plaintext.
- **Every test must be hermetic.** `scripts/run-all-tests.mjs` excludes anything needing a live DB or network. New tests take injected data-access dependencies rather than touching MongoDB, so they count in the oracle.
- **Do not declare the unique index before the backfill.** Mongoose auto-builds declared indexes on connect. All 495 existing profiles would share `(null, null)` and the build would fail, breaking profile writes in production. Task 6 introduces it as a **partial** index.
- **`_id` is never rewritten.** Any change requiring an `_id` rewrite is out of scope and indicates a misreading of the design.
- Node/Next versions unchanged. Do not add runtime dependencies; `node:crypto` covers encryption.
- Existing oracle: `npm run test:all` from `apps/tutor` plus marketing's `test:outreach` = 181 entries, 178 passing, 3 known-red (`test:verdict-guard`, `test:pedagogy-posed-problem`, `test:pedagogy-d1`). Do not fix the 3; they were red before this work.
- New `test:*` entries in `apps/tutor/package.json` are auto-discovered by `run-all-tests.mjs`. Each must exit non-zero on failure.
- **Identity resolution must ship behind a flag, default OFF.** `resolveProfileId` does **not** adopt a
  pre-existing row that has no `partnerId`/`externalStudentId` — it mints a new surrogate `_id`.
  Proven against a real mongod during Task 4's review. So if Task 5's call sites go live before the
  Task 6 backfill has stamped identities on the 495 existing profiles, **every existing student
  silently starts from a blank profile** while their mastery, gaps and notes stay attached to the old
  `_id`. A deploy is atomic, so code ordering cannot solve this — only a flag can. Runtime adoption of
  legacy rows is NOT an alternative: adopting safely requires knowing which partner a legacy row
  belongs to, which is exactly what the backfill derives from session data. Guessing it at runtime is
  the collision bug in a new costume.

---

## File Structure

### New — `apps/tutor/src/lib/tutor/portal/`
| Path | Responsibility |
|---|---|
| `secret-box.ts` | AES-256-GCM encrypt/decrypt of partner secrets. Pure, no DB, no Next. |
| `registry.ts` | Partner lookup + in-process TTL cache + env fallback. The only reader of the `Partner` model. |
| `limits.ts` | Burst / quota / metering counters and the two failure policies. |
| `flags.ts` | Partner flag-override resolution with fallback to build-time constants. |

### New — models
| Path | Responsibility |
|---|---|
| `apps/tutor/src/models/Partner.ts` | The registry collection. |
| `apps/tutor/src/models/PartnerCounter.ts` | Window counters for burst, quota, metering. |

### New — scripts
| Path | Responsibility |
|---|---|
| `apps/tutor/scripts/backfill-partner-namespace.ts` | Dry-run + write migration, and the index build. |
| `apps/tutor/scripts/seed-partner-registry.ts` | One-shot seed of `Partner` rows from `PORTAL_PARTNER_SECRETS`. |

### Modified
| Path | Change |
|---|---|
| `apps/tutor/src/lib/tutor/portal/auth.ts` | Registry-backed verification, status, allowlist, new codes. |
| `apps/tutor/src/lib/tutor/student-profile/store.ts` | `resolveProfileId` + the identity fields. |
| `apps/tutor/src/models/StudentProfile.ts` | `partnerId`, `externalStudentId`, indexes. |
| `apps/tutor/src/models/index.ts` | Export the two new models. |
| `apps/tutor/package.json` | Eight new `test:*` entries. |

---

## Task 1: Secret encryption helper

Pure function pair, no DB, no Next — the foundation everything else verifies against.

**Files:**
- Create: `apps/tutor/src/lib/tutor/portal/secret-box.ts`
- Create: `apps/tutor/scripts/test-partner-secret-box.ts`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: `encryptSecret(plaintext: string, key?: Buffer): SealedSecret`, `decryptSecret(sealed: SealedSecret, key?: Buffer): string`, `type SealedSecret = { ciphertext: string; keyVersion: number }`. Throws `SecretDecryptError` on any failure.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-partner-secret-box.ts`:

```ts
/**
 * Partner secret encryption tests (M1c Task 1).
 *
 * Run: `npm run test:partner-secret-box`
 *
 * D15-R1: secrets are ENCRYPTED, not hashed, because HMAC verification
 * needs the plaintext back. These tests pin that round-trip and the
 * failure modes that must be distinguishable from a signature mismatch.
 *
 * Style mirrors scripts/test-portal-auth.ts.
 */
import assert from 'node:assert';
import { randomBytes } from 'node:crypto';

process.env.PORTAL_SECRET_ENC_KEY = randomBytes(32).toString('base64');

import {
  encryptSecret,
  decryptSecret,
  SecretDecryptError,
} from '@/lib/tutor/portal/secret-box';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

(async () => {

await test('round-trips a secret', () => {
  const sealed = encryptSecret('super-secret-a');
  assert.strictEqual(decryptSecret(sealed), 'super-secret-a');
});

await test('ciphertext is not the plaintext and differs per call (random IV)', () => {
  const a = encryptSecret('same-input');
  const b = encryptSecret('same-input');
  assert.ok(!a.ciphertext.includes('same-input'));
  assert.notStrictEqual(a.ciphertext, b.ciphertext, 'IV must be random per encryption');
  assert.strictEqual(decryptSecret(a), decryptSecret(b));
});

await test('records a keyVersion', () => {
  assert.strictEqual(encryptSecret('x').keyVersion, 1);
});

await test('a wrong key throws SecretDecryptError, not a generic error', () => {
  const sealed = encryptSecret('super-secret-a');
  const wrong = randomBytes(32);
  assert.throws(() => decryptSecret(sealed, wrong), SecretDecryptError);
});

await test('a tampered ciphertext throws (GCM auth tag rejects it)', () => {
  const sealed = encryptSecret('super-secret-a');
  const buf = Buffer.from(sealed.ciphertext, 'base64');
  buf[buf.length - 1] ^= 0xff;
  assert.throws(
    () => decryptSecret({ ...sealed, ciphertext: buf.toString('base64') }),
    SecretDecryptError,
  );
});

await test('a missing PORTAL_SECRET_ENC_KEY throws a clearly-named error', () => {
  const saved = process.env.PORTAL_SECRET_ENC_KEY;
  delete process.env.PORTAL_SECRET_ENC_KEY;
  try {
    assert.throws(() => encryptSecret('x'), /PORTAL_SECRET_ENC_KEY/);
  } finally {
    process.env.PORTAL_SECRET_ENC_KEY = saved;
  }
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
```

- [ ] **Step 2: Register the test script**

In `apps/tutor/package.json` scripts, add:

```json
"test:partner-secret-box": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-partner-secret-box.ts"
```

- [ ] **Step 3: Run it and watch it fail**

```bash
cd apps/tutor && npm run test:partner-secret-box
```

Expected: fails to resolve `@/lib/tutor/portal/secret-box`.

- [ ] **Step 4: Implement**

Create `apps/tutor/src/lib/tutor/portal/secret-box.ts`:

```ts
/**
 * Symmetric encryption for partner API secrets (M1c, D15-R1).
 *
 * D15 said "hashed secret". That is not implementable: the portal contract
 * authenticates with an HMAC over the request body, so the engine must
 * RECOMPUTE the signature and therefore needs the plaintext secret back.
 * A hash is one-way. The contract is frozen, so the scheme cannot move to a
 * hash-comparable bearer token.
 *
 * AES-256-GCM gives us confidentiality at rest plus an auth tag, so a
 * tampered ciphertext fails loudly instead of decrypting to garbage that
 * would later surface as an unexplained signature mismatch.
 *
 * The key lives in PORTAL_SECRET_ENC_KEY (base64, 32 bytes). Losing it means
 * every partner must re-key — back it up with the other production secrets.
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/** Bump when the encryption key is rotated; stored per secret. */
export const CURRENT_KEY_VERSION = 1;

const IV_BYTES = 12;   // GCM standard
const TAG_BYTES = 16;

export interface SealedSecret {
  /** base64( iv | authTag | ciphertext ) */
  ciphertext: string;
  keyVersion: number;
}

export class SecretDecryptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecretDecryptError';
  }
}

function resolveKey(explicit?: Buffer): Buffer {
  if (explicit) return explicit;
  const raw = process.env.PORTAL_SECRET_ENC_KEY;
  if (!raw) {
    throw new Error(
      'PORTAL_SECRET_ENC_KEY is not set — partner secrets cannot be sealed or opened.',
    );
  }
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    throw new Error(`PORTAL_SECRET_ENC_KEY must decode to 32 bytes, got ${key.length}`);
  }
  return key;
}

export function encryptSecret(plaintext: string, key?: Buffer): SealedSecret {
  const k = resolveKey(key);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', k, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: Buffer.concat([iv, tag, enc]).toString('base64'),
    keyVersion: CURRENT_KEY_VERSION,
  };
}

export function decryptSecret(sealed: SealedSecret, key?: Buffer): string {
  const k = resolveKey(key);
  let buf: Buffer;
  try {
    buf = Buffer.from(sealed.ciphertext, 'base64');
  } catch {
    throw new SecretDecryptError('ciphertext is not valid base64');
  }
  if (buf.length <= IV_BYTES + TAG_BYTES) {
    throw new SecretDecryptError('ciphertext is too short to contain iv + tag');
  }
  const iv = buf.subarray(0, IV_BYTES);
  const tag = buf.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const enc = buf.subarray(IV_BYTES + TAG_BYTES);
  try {
    const decipher = createDecipheriv('aes-256-gcm', k, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
  } catch {
    throw new SecretDecryptError(
      `failed to open sealed secret (keyVersion=${sealed.keyVersion}) — wrong key or tampered value`,
    );
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
cd apps/tutor && npm run test:partner-secret-box
```

Expected: `6 passed, 0 failed`.

- [ ] **Step 6: Commit**

```bash
git add apps/tutor/src/lib/tutor/portal/secret-box.ts apps/tutor/scripts/test-partner-secret-box.ts apps/tutor/package.json
git commit -m "feat(m1c): AES-256-GCM sealing for partner secrets"
```

---

## Task 2: `Partner` model and the cached registry

**Files:**
- Create: `apps/tutor/src/models/Partner.ts`
- Create: `apps/tutor/src/lib/tutor/portal/registry.ts`
- Create: `apps/tutor/scripts/test-partner-registry.ts`
- Modify: `apps/tutor/src/models/index.ts`, `apps/tutor/package.json`

**Interfaces:**
- Consumes: `SealedSecret`, `decryptSecret`, `SecretDecryptError` from Task 1.
- Produces:
  - `type PartnerKind = 'partner' | 'first-party' | 'test'`
  - `type PartnerStatus = 'active' | 'suspended'`
  - `interface PartnerRecord { partnerId: string; kind: PartnerKind; status: PartnerStatus; secrets: string[]; allowedEndpoints: string[]; limits: { rpm: number; burst: number; dailyQuota: number | null }; flagOverrides: Record<string, boolean | string>; }`
  - `getPartner(partnerId: string, deps?: RegistryDeps): Promise<PartnerRecord | null>` — decrypted secrets, cached 60s.
  - `invalidatePartner(partnerId: string): void`
  - `interface RawPartnerDoc { kind: PartnerKind; status: PartnerStatus; secrets: Array<{ ciphertext: string; keyVersion: number; label: string }>; allowedEndpoints?: string[]; limits?: { rpm: number; burst: number; dailyQuota: number | null }; flagOverrides?: Record<string, boolean | string> }`
  - `interface RegistryDeps { findPartner(id: string): Promise<RawPartnerDoc | null>; now(): number; env: NodeJS.ProcessEnv }`

> `findPartner` returns the **narrow** `RawPartnerDoc`, not the full `IPartner`. The registry reads only these fields, and a narrow type lets the hermetic tests build a fixture without inventing `name`, `createdAt`, `updatedAt` and `metering` — or casting through `unknown`.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-partner-registry.ts`:

```ts
/**
 * Partner registry tests (M1c Task 2).
 *
 * Run: `npm run test:partner-registry`
 *
 * Hermetic: the registry takes an injected `findPartner` so these tests
 * never touch MongoDB and therefore count in the 181-script oracle.
 */
import assert from 'node:assert';
import { randomBytes } from 'node:crypto';

process.env.PORTAL_SECRET_ENC_KEY = randomBytes(32).toString('base64');

import { encryptSecret } from '@/lib/tutor/portal/secret-box';
import { getPartner, invalidatePartner, type RegistryDeps } from '@/lib/tutor/portal/registry';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

function doc(over: Record<string, unknown> = {}) {
  return {
    _id: 'crimsora',
    kind: 'partner',
    status: 'active',
    secrets: [{ ...encryptSecret('secret-one'), label: 'v1', createdAt: '2026-01-01' }],
    allowedEndpoints: ['/api/portal/v1/'],
    limits: { rpm: 600, burst: 60, dailyQuota: null },
    flagOverrides: {},
    ...over,
  };
}

function deps(over: Partial<RegistryDeps> = {}): RegistryDeps {
  return {
    findPartner: async () => doc(),
    now: () => 1_000_000,
    env: {} as NodeJS.ProcessEnv,
    ...over,
  };
}

(async () => {

await test('decrypts secrets on read', async () => {
  invalidatePartner('crimsora');
  const p = await getPartner('crimsora', deps());
  assert.deepStrictEqual(p!.secrets, ['secret-one']);
});

await test('returns every live secret so rotation has two valid at once', async () => {
  invalidatePartner('crimsora');
  const two = doc({ secrets: [
    { ...encryptSecret('old'), label: 'v1', createdAt: '2026-01-01' },
    { ...encryptSecret('new'), label: 'v2', createdAt: '2026-02-01' },
  ] });
  const p = await getPartner('crimsora', deps({ findPartner: async () => two }));
  assert.deepStrictEqual(p!.secrets, ['old', 'new']);
});

await test('a secret that fails to decrypt is dropped, not fatal', async () => {
  invalidatePartner('crimsora');
  const mixed = doc({ secrets: [
    { ciphertext: 'not-openable', keyVersion: 1, label: 'bad', createdAt: '2026-01-01' },
    { ...encryptSecret('good'), label: 'v2', createdAt: '2026-02-01' },
  ] });
  const p = await getPartner('crimsora', deps({ findPartner: async () => mixed }));
  assert.deepStrictEqual(p!.secrets, ['good'], 'one bad secret must not lock the partner out');
});

await test('caches within the TTL — a second read does not hit the store', async () => {
  invalidatePartner('crimsora');
  let calls = 0;
  const d = deps({ findPartner: async () => { calls++; return doc(); } });
  await getPartner('crimsora', d);
  await getPartner('crimsora', d);
  assert.strictEqual(calls, 1);
});

await test('re-reads after the TTL expires', async () => {
  invalidatePartner('crimsora');
  let calls = 0, t = 1_000_000;
  const d = deps({ findPartner: async () => { calls++; return doc(); }, now: () => t });
  await getPartner('crimsora', d);
  t += 61_000;
  await getPartner('crimsora', d);
  assert.strictEqual(calls, 2);
});

await test('invalidatePartner forces a re-read', async () => {
  invalidatePartner('crimsora');
  let calls = 0;
  const d = deps({ findPartner: async () => { calls++; return doc(); } });
  await getPartner('crimsora', d);
  invalidatePartner('crimsora');
  await getPartner('crimsora', d);
  assert.strictEqual(calls, 2);
});

await test('unknown partner resolves to null', async () => {
  invalidatePartner('nobody');
  const p = await getPartner('nobody', deps({ findPartner: async () => null }));
  assert.strictEqual(p, null);
});

await test('falls back to PORTAL_PARTNER_SECRETS when the row is absent', async () => {
  invalidatePartner('academy');
  const p = await getPartner('academy', deps({
    findPartner: async () => null,
    env: { PORTAL_PARTNER_SECRETS: JSON.stringify({ academy: 'env-secret' }) } as NodeJS.ProcessEnv,
  }));
  assert.deepStrictEqual(p!.secrets, ['env-secret']);
  assert.strictEqual(p!.kind, 'partner');
  assert.deepStrictEqual(p!.allowedEndpoints, ['/api/portal/v1/'], 'env fallback grants all portal routes');
});

await test('the registry row wins over the env fallback', async () => {
  invalidatePartner('crimsora');
  const p = await getPartner('crimsora', deps({
    env: { PORTAL_PARTNER_SECRETS: JSON.stringify({ crimsora: 'env-secret' }) } as NodeJS.ProcessEnv,
  }));
  assert.deepStrictEqual(p!.secrets, ['secret-one']);
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
```

- [ ] **Step 2: Register the test**

```json
"test:partner-registry": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-partner-registry.ts"
```

- [ ] **Step 3: Run it and watch it fail**

```bash
cd apps/tutor && npm run test:partner-registry
```

Expected: cannot resolve `@/lib/tutor/portal/registry`.

- [ ] **Step 4: Create the model**

Create `apps/tutor/src/models/Partner.ts`:

```ts
/**
 * MongoDB model for the partner registry (M1c, D15).
 *
 * String _id — the partner slug that arrives in the x-evelyn-partner header.
 *
 * `secrets` is an ARRAY so rotation never has a window where neither the old
 * nor the new secret works: add the new one, both verify, retire the old.
 *
 * `kind`:
 *   'partner'     — a real API caller
 *   'first-party' — owns a student namespace but never authenticates
 *                   (the 'evelyn' row for retail /tutor and showcase users)
 *   'test'        — historical fixture prefixes (lmtest, trial, revtest,
 *                   portalA) that need a valid registry reference without
 *                   appearing in partner lists or billing
 * Only 'partner' rows may authenticate; see withPortalAuth.
 */
import mongoose, { Schema } from 'mongoose';

export interface ISealedSecretDoc {
  ciphertext: string;
  keyVersion: number;
  label: string;
  createdAt: string;
  expiresAt?: string;
}

export interface IPartner {
  _id: string;
  name: string;
  kind: 'partner' | 'first-party' | 'test';
  status: 'active' | 'suspended';
  secrets: ISealedSecretDoc[];
  allowedEndpoints: string[];
  limits: { rpm: number; burst: number; dailyQuota: number | null };
  flagOverrides: Record<string, boolean | string>;
  metering: { plan?: string };
  createdAt: string;
  updatedAt: string;
}

const SealedSecretSchema = new Schema<ISealedSecretDoc>({
  ciphertext: { type: String, required: true },
  keyVersion: { type: Number, required: true },
  label: { type: String, required: true },
  createdAt: { type: String, required: true },
  expiresAt: { type: String },
}, { _id: false });

const PartnerSchema = new Schema<IPartner>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  kind: { type: String, enum: ['partner', 'first-party', 'test'], required: true },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  secrets: { type: [SealedSecretSchema], default: [] },
  allowedEndpoints: { type: [String], default: [] },
  limits: {
    rpm: { type: Number, default: 600 },
    burst: { type: Number, default: 60 },
    dailyQuota: { type: Number, default: null },
  },
  flagOverrides: { type: Schema.Types.Mixed, default: {} },
  metering: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
}, { _id: false });

export const PartnerModel =
  (mongoose.models.Partner as mongoose.Model<IPartner>) ||
  mongoose.model<IPartner>('Partner', PartnerSchema);
```

- [ ] **Step 5: Implement the registry**

Create `apps/tutor/src/lib/tutor/portal/registry.ts`:

```ts
/**
 * Partner lookup with an in-process TTL cache (M1c Task 2).
 *
 * Why a cache: withPortalAuth runs on every authenticated request, including
 * the hot path of a live voice session. Reading Mongo per request would put a
 * network round-trip in front of every partner call for data that changes
 * perhaps monthly.
 *
 * Why an env fallback: rollout step 1 seeds the collection while
 * PORTAL_PARTNER_SECRETS is still authoritative. The registry row WINS once it
 * exists, so the switchover is per-partner and reversible by deleting a row.
 * Remove the fallback at rollout step 5.
 */
import connectDB from '@core/db';
import { PartnerModel } from '@/models/Partner';
import { decryptSecret } from './secret-box';

export type PartnerKind = 'partner' | 'first-party' | 'test';
export type PartnerStatus = 'active' | 'suspended';

/**
 * Exactly the fields the registry reads. Deliberately narrower than IPartner
 * so a test fixture does not have to invent name/createdAt/updatedAt/metering
 * or cast through `unknown`.
 */
export interface RawPartnerDoc {
  kind: PartnerKind;
  status: PartnerStatus;
  secrets: Array<{ ciphertext: string; keyVersion: number; label: string }>;
  allowedEndpoints?: string[];
  limits?: { rpm: number; burst: number; dailyQuota: number | null };
  flagOverrides?: Record<string, boolean | string>;
}

export interface PartnerRecord {
  partnerId: string;
  kind: PartnerKind;
  status: PartnerStatus;
  /** Decrypted, in stored order. Every entry is a candidate for HMAC verification. */
  secrets: string[];
  allowedEndpoints: string[];
  limits: { rpm: number; burst: number; dailyQuota: number | null };
  flagOverrides: Record<string, boolean | string>;
}

export interface RegistryDeps {
  findPartner(id: string): Promise<RawPartnerDoc | null>;
  now(): number;
  env: NodeJS.ProcessEnv;
}

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { at: number; value: PartnerRecord | null }>();

const defaultDeps: RegistryDeps = {
  async findPartner(id) {
    await connectDB();
    return PartnerModel.findById(id).lean<RawPartnerDoc>().exec();
  },
  now: () => Date.now(),
  env: process.env,
};

/** Drop a partner from the cache. Call after any admin write. */
export function invalidatePartner(partnerId: string): void {
  cache.delete(partnerId);
}

function fromEnv(partnerId: string, env: NodeJS.ProcessEnv): PartnerRecord | null {
  const raw = env.PORTAL_PARTNER_SECRETS;
  if (!raw) return null;
  let map: Record<string, string>;
  try { map = JSON.parse(raw) as Record<string, string>; } catch { return null; }
  const secret = map[partnerId];
  if (typeof secret !== 'string' || !secret) return null;
  return {
    partnerId,
    kind: 'partner',
    status: 'active',
    secrets: [secret],
    allowedEndpoints: ['/api/portal/v1/'],
    limits: { rpm: 600, burst: 60, dailyQuota: null },
    flagOverrides: {},
  };
}

export async function getPartner(
  partnerId: string,
  deps: RegistryDeps = defaultDeps,
): Promise<PartnerRecord | null> {
  if (!partnerId) return null;

  const hit = cache.get(partnerId);
  if (hit && deps.now() - hit.at < CACHE_TTL_MS) return hit.value;

  let value: PartnerRecord | null = null;
  const doc = await deps.findPartner(partnerId);

  if (doc) {
    const secrets: string[] = [];
    for (const s of doc.secrets ?? []) {
      try {
        secrets.push(decryptSecret({ ciphertext: s.ciphertext, keyVersion: s.keyVersion }));
      } catch {
        // One unopenable secret must not lock a partner out — a half-finished
        // key rotation would otherwise take the partner down. Logged distinctly
        // so a key fault is not misread as a partner integration bug.
        console.error(
          `[portal/registry] secret label=${s.label} for partner=${partnerId} failed to decrypt`,
        );
      }
    }
    value = {
      partnerId,
      kind: doc.kind,
      status: doc.status,
      secrets,
      allowedEndpoints: doc.allowedEndpoints ?? [],
      limits: doc.limits ?? { rpm: 600, burst: 60, dailyQuota: null },
      flagOverrides: doc.flagOverrides ?? {},
    };
  } else {
    value = fromEnv(partnerId, deps.env);
  }

  cache.set(partnerId, { at: deps.now(), value });
  return value;
}
```

- [ ] **Step 6: Export from the barrel**

In `apps/tutor/src/models/index.ts`, add alongside the other tutor-owned models:

```ts
export { PartnerModel, type IPartner } from './Partner';
```

- [ ] **Step 7: Run the test to verify it passes**

```bash
cd apps/tutor && npm run test:partner-registry
```

Expected: `9 passed, 0 failed`.

- [ ] **Step 8: Commit**

```bash
git add apps/tutor/src/models/Partner.ts apps/tutor/src/models/index.ts apps/tutor/src/lib/tutor/portal/registry.ts apps/tutor/scripts/test-partner-registry.ts apps/tutor/package.json
git commit -m "feat(m1c): Partner collection and cached registry with env fallback"
```

---

## Task 3: `withPortalAuth` verifies against the registry

**Files:**
- Modify: `apps/tutor/src/lib/tutor/portal/auth.ts`
- Create: `apps/tutor/scripts/test-portal-auth-registry.ts`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: `getPartner`, `PartnerRecord` from Task 2.
- Produces: `PortalAuth` gains `partner: PartnerRecord`. `getPartnerSecret` is retained for back-compat but no longer used by `withPortalAuth`.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-portal-auth-registry.ts`. Mirror the request/echo harness from `scripts/test-portal-auth.ts` (read it first — reuse its `NextRequest` construction verbatim), and assert:

```ts
/**
 * withPortalAuth against the registry (M1c Task 3).
 *
 * Run: `npm run test:portal-auth-registry`
 *
 * scripts/test-portal-auth.ts still covers the contract-level signing rules.
 * This file covers ONLY what the registry adds: rotation, status, kind and
 * the endpoint allowlist. Build requests exactly as that file does.
 */
```

Cases, each asserting `status` and `json.reason`:

| Case | Setup | Expect |
|---|---|---|
| rotation, old secret | partner has `['old','new']`, sign with `old` | 200 |
| rotation, new secret | same, sign with `new` | 200 |
| retired secret | partner has `['new']`, sign with `old` | 401 `invalid_signature` |
| suspended | `status: 'suspended'`, valid signature | 403 `partner_suspended` |
| first-party cannot authenticate | `kind: 'first-party'`, valid signature | 403 `partner_cannot_authenticate` |
| test kind cannot authenticate | `kind: 'test'`, valid signature | 403 `partner_cannot_authenticate` |
| endpoint not allowed | `allowedEndpoints: ['/api/portal/v1/context']`, call `/api/portal/v1/practice` | 403 `endpoint_not_allowed` |
| endpoint allowed by prefix | same, call `/api/portal/v1/context` | 200 |
| unknown partner | registry returns null, no env | 401 `unknown_partner` |
| no openable secret | all secrets fail to decrypt | 401 `unknown_partner` |
| handler receives the record | valid call | `auth.partner.partnerId === 'crimsora'` |

Inject the registry by exporting an override hook from `auth.ts` (see Step 3) rather than mocking Mongo, so the test stays hermetic.

- [ ] **Step 2: Register the test**

```json
"test:portal-auth-registry": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-portal-auth-registry.ts"
```

- [ ] **Step 3: Modify `auth.ts`**

Replace the body of `withPortalAuth` between the header check and the JSON parse. Keep every existing comment; the existing signing/verification logic is unchanged apart from looping over candidate secrets.

```ts
import { getPartner, type PartnerRecord, type RegistryDeps } from './registry';

/** What an authed handler receives in addition to the raw request. */
export interface PortalAuth {
  /** Verified partner id (from the signed header). */
  partnerId: string;
  /** The full registry record — limits, flags and allowlist for this caller. */
  partner: PartnerRecord;
  /** Parsed JSON body (undefined for empty bodies / GET). */
  body: unknown;
  /** Raw body string, exactly as signed. */
  rawBody: string;
}

/**
 * Test seam: lets the hermetic auth tests supply a registry without a DB.
 * Production never sets this.
 */
let registryOverride: ((id: string) => Promise<PartnerRecord | null>) | null = null;
export function __setRegistryOverrideForTests(
  fn: ((id: string) => Promise<PartnerRecord | null>) | null,
): void {
  registryOverride = fn;
}

function denyStatus(reason: string, status: number): NextResponse {
  return NextResponse.json({ error: 'forbidden', reason }, { status });
}
```

Inside the returned handler, after the three headers are present:

```ts
    const partner = registryOverride
      ? await registryOverride(partnerId)
      : await getPartner(partnerId);

    // Unknown, or known but with no secret we can open: both are
    // indistinguishable to a caller on purpose — we do not confirm that a
    // partner id exists to an unauthenticated request.
    if (!partner || partner.secrets.length === 0) return deny('unknown_partner');

    // Only real partners authenticate. 'first-party' rows exist to own a
    // student namespace ('evelyn' for retail /tutor); 'test' rows exist so
    // fixture data has a valid reference. Neither may hold API credentials,
    // even if a secret is added to one by mistake.
    if (partner.kind !== 'partner') {
      return denyStatus('partner_cannot_authenticate', 403);
    }
    if (partner.status === 'suspended') {
      return denyStatus('partner_suspended', 403);
    }

    const rawBody = await req.text();
    const u = new URL(req.url);
    const parts: SigningParts = {
      method: req.method,
      path: u.pathname + u.search,
      timestamp,
      body: rawBody,
    };

    // Endpoint allowlist is checked BEFORE signature verification is accepted
    // but AFTER the partner is known, so an allowlist miss is never used as an
    // id-enumeration oracle by an unsigned caller.
    const allowed = partner.allowedEndpoints.some((p) => u.pathname.startsWith(p));
    if (!allowed) return denyStatus('endpoint_not_allowed', 403);

    // Rotation: any live secret may have signed this request. Try each and
    // accept the first that verifies; report the LAST failure reason so a
    // genuine tamper still surfaces as invalid_signature.
    let verdict = { ok: false as boolean, reason: 'invalid_signature' as string };
    for (const secret of partner.secrets) {
      const v = verifyPortalSignature(secret, parts, signature);
      if (v.ok) { verdict = { ok: true, reason: '' }; break; }
      verdict = { ok: false, reason: v.reason };
    }
    if (!verdict.ok) return deny(verdict.reason);
```

and pass the record through:

```ts
    return handler(req, { partnerId, partner, body, rawBody }, ctx);
```

- [ ] **Step 4: Run both auth test suites**

```bash
cd apps/tutor && npm run test:portal-auth && npm run test:portal-auth-registry
```

Expected: both pass. `test:portal-auth` must still pass **unchanged** — it exercises the env fallback path, which proves existing partners are unaffected.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/portal/auth.ts apps/tutor/scripts/test-portal-auth-registry.ts apps/tutor/package.json
git commit -m "feat(m1c): verify partners against the registry with rotation, status and allowlist"
```

---

## Task 4: Identity fields and `resolveProfileId`

**Files:**
- Modify: `apps/tutor/src/models/StudentProfile.ts`
- Modify: `apps/tutor/src/lib/tutor/student-profile/store.ts`
- Create: `apps/tutor/scripts/test-profile-resolver.ts`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `resolveProfileId(input: { partnerId: string; externalStudentId: string }, deps?: ResolverDeps): Promise<string>` returning the surrogate `_id`; `interface ResolverDeps { findOneAndUpsert(...): Promise<{ _id: string } | null>; findExisting(...): Promise<{ _id: string } | null>; newId(): string }`.

> **DO NOT declare the unique index in this task.** All 495 existing profiles have `partnerId: undefined`, so Mongoose's auto-build would attempt a unique index over 495 identical `(null, null)` keys, fail, and take profile writes down. The index arrives in Task 6, after the backfill, as a **partial** index.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-profile-resolver.ts`:

```ts
/**
 * Profile identity resolution tests (M1c Task 4).
 *
 * Run: `npm run test:profile-resolver`
 *
 * THE test in this milestone is `two partners sending the same external id
 * get two profiles`. That is the defect M1c exists to eliminate.
 *
 * Hermetic: an in-memory fake stands in for the collection, including its
 * unique-index behaviour, so this counts in the oracle.
 */
import assert from 'node:assert';
import { resolveProfileId, type ResolverDeps } from '@/lib/tutor/student-profile/store';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

/** Fake collection enforcing unique (partnerId, externalStudentId). */
function fakeStore() {
  const rows = new Map<string, string>(); // "partner|ext" -> _id
  let seq = 0;
  const deps: ResolverDeps = {
    newId: () => `gen-${++seq}`,
    findExisting: async ({ partnerId, externalStudentId }) => {
      const id = rows.get(`${partnerId}|${externalStudentId}`);
      return id ? { _id: id } : null;
    },
    findOneAndUpsert: async ({ partnerId, externalStudentId, newId }) => {
      const k = `${partnerId}|${externalStudentId}`;
      if (rows.has(k)) return { _id: rows.get(k)! };
      rows.set(k, newId);
      return { _id: newId };
    },
  };
  return { deps, rows };
}

(async () => {

await test('creates a profile id for a new (partner, student) pair', async () => {
  const { deps } = fakeStore();
  const id = await resolveProfileId({ partnerId: 'crimsora', externalStudentId: 'user_1' }, deps);
  assert.ok(id);
});

await test('is stable — the same pair resolves to the same id', async () => {
  const { deps } = fakeStore();
  const a = await resolveProfileId({ partnerId: 'crimsora', externalStudentId: 'user_1' }, deps);
  const b = await resolveProfileId({ partnerId: 'crimsora', externalStudentId: 'user_1' }, deps);
  assert.strictEqual(a, b);
});

await test('THE COLLISION TEST: two partners, same external id, two profiles', async () => {
  const { deps } = fakeStore();
  const a = await resolveProfileId({ partnerId: 'crimsora', externalStudentId: 'user_1' }, deps);
  const b = await resolveProfileId({ partnerId: 'academy', externalStudentId: 'user_1' }, deps);
  assert.notStrictEqual(a, b, 'two partners sharing an external id MUST NOT share a profile');
});

await test('retail students resolve under the evelyn namespace', async () => {
  const { deps } = fakeStore();
  const retail = await resolveProfileId({ partnerId: 'evelyn', externalStudentId: 'user_1' }, deps);
  const partner = await resolveProfileId({ partnerId: 'crimsora', externalStudentId: 'user_1' }, deps);
  assert.notStrictEqual(retail, partner);
});

await test('a duplicate-key race re-reads instead of throwing', async () => {
  const { deps, rows } = fakeStore();
  let first = true;
  const racing: ResolverDeps = {
    ...deps,
    findOneAndUpsert: async (args) => {
      if (first) {
        first = false;
        // Simulate the competitor winning between our miss and our insert.
        rows.set(`${args.partnerId}|${args.externalStudentId}`, 'winner-id');
        const err = new Error('E11000 duplicate key error') as Error & { code?: number };
        err.code = 11000;
        throw err;
      }
      return deps.findOneAndUpsert(args);
    },
  };
  const id = await resolveProfileId(
    { partnerId: 'crimsora', externalStudentId: 'racer' }, racing,
  );
  assert.strictEqual(id, 'winner-id', 'must adopt the winner rather than surface E11000');
});

await test('rejects an empty partnerId', async () => {
  const { deps } = fakeStore();
  await assert.rejects(
    () => resolveProfileId({ partnerId: '', externalStudentId: 'user_1' }, deps),
    /partnerId/,
  );
});

await test('rejects an empty externalStudentId', async () => {
  const { deps } = fakeStore();
  await assert.rejects(
    () => resolveProfileId({ partnerId: 'crimsora', externalStudentId: '' }, deps),
    /externalStudentId/,
  );
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
```

- [ ] **Step 2: Register the test**

```json
"test:profile-resolver": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-profile-resolver.ts"
```

- [ ] **Step 3: Run it and watch it fail**

Expected: `resolveProfileId` is not exported.

- [ ] **Step 4: Add the fields to the model**

In `apps/tutor/src/models/StudentProfile.ts`, extend `IStudentProfile` and the schema. **No unique index yet.**

```ts
  /** M1c: which partner this student belongs to. 'evelyn' for retail. */
  partnerId?: string;
  /** M1c: the raw id the partner sent, before namespacing. */
  externalStudentId?: string;
```

```ts
  partnerId: { type: String, index: true },
  externalStudentId: { type: String },
```

Add a comment above them:

```ts
// M1c: identity is (partnerId, externalStudentId); `_id` is a surrogate and
// is never rewritten, which is what keeps the five collections that reference
// it from having to migrate. The UNIQUE index on this pair is created by
// scripts/backfill-partner-namespace.ts AFTER the backfill — declaring it here
// would make Mongoose auto-build it over 495 rows that all share (null, null).
```

- [ ] **Step 5: Implement the resolver**

Append to `apps/tutor/src/lib/tutor/student-profile/store.ts`:

```ts
import { randomUUID } from 'node:crypto';

export interface ResolveProfileInput {
  partnerId: string;
  externalStudentId: string;
}

export interface ResolverDeps {
  findExisting(input: ResolveProfileInput): Promise<{ _id: string } | null>;
  findOneAndUpsert(
    input: ResolveProfileInput & { newId: string },
  ): Promise<{ _id: string } | null>;
  newId(): string;
}

const defaultResolverDeps: ResolverDeps = {
  newId: () => randomUUID(),
  async findExisting({ partnerId, externalStudentId }) {
    await connectDB();
    return StudentProfileModel
      .findOne({ partnerId, externalStudentId })
      .select('_id')
      .lean<{ _id: string }>()
      .exec();
  },
  async findOneAndUpsert({ partnerId, externalStudentId, newId }) {
    await connectDB();
    const now = new Date().toISOString();
    return StudentProfileModel.findOneAndUpdate(
      { partnerId, externalStudentId },
      {
        $setOnInsert: {
          _id: newId,
          ...emptyProfile(newId),
          partnerId,
          externalStudentId,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).select('_id').lean<{ _id: string }>().exec();
  },
};

/**
 * Turn a partner-scoped identity into the surrogate profile `_id`.
 *
 * This is the M1c choke point. Two partners sending the same
 * `externalStudentId` get two profiles because the unique index on
 * (partnerId, externalStudentId) refuses otherwise — the guarantee is the
 * database's, not a convention every call site must remember.
 *
 * Find-or-create is ONE atomic upsert, not a read followed by a write: two
 * concurrent first-requests for the same new student would both miss and both
 * insert, and the loser would surface E11000 to a legitimate student. On that
 * error we re-read and adopt whoever won.
 */
export async function resolveProfileId(
  input: ResolveProfileInput,
  deps: ResolverDeps = defaultResolverDeps,
): Promise<string> {
  if (!input.partnerId) throw new Error('resolveProfileId: partnerId is required');
  if (!input.externalStudentId) {
    throw new Error('resolveProfileId: externalStudentId is required');
  }
  const newId = deps.newId();
  try {
    const doc = await deps.findOneAndUpsert({ ...input, newId });
    if (doc) return doc._id;
  } catch (err) {
    const code = (err as { code?: number }).code;
    if (code !== 11000) throw err;
  }
  const existing = await deps.findExisting(input);
  if (!existing) {
    throw new Error(
      `resolveProfileId: upsert reported a duplicate for ${input.partnerId} but no row was found`,
    );
  }
  return existing._id;
}
```

- [ ] **Step 6: Run the test to verify it passes**

```bash
cd apps/tutor && npm run test:profile-resolver
```

Expected: `7 passed, 0 failed`.

- [ ] **Step 7: Commit**

```bash
git add apps/tutor/src/models/StudentProfile.ts apps/tutor/src/lib/tutor/student-profile/store.ts apps/tutor/scripts/test-profile-resolver.ts apps/tutor/package.json
git commit -m "feat(m1c): resolveProfileId — partner-scoped identity via atomic upsert"
```

---

## Task 5: Wire resolution into the entry points

**Files:**
- Modify: every `/api/portal/v1/**` route that reads a `studentId` from the body or query
- Modify: the retail/internal callers of `getOrCreateStudentProfile`
- Create: `apps/tutor/scripts/test-portal-student-scoping.ts`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: `resolveProfileId` (Task 4), `PortalAuth.partner` (Task 3).
- Produces: no new exports. After this task, no portal handler passes a raw body `studentId` to the profile store.

- [ ] **Step 1: Enumerate the call sites**

```bash
cd apps/tutor
grep -rnE "getOrCreateStudentProfile|getStudentProfile\(|updateStudentPreferences" src --include=*.ts
```

**Do NOT filter out `student-profile/store.ts`.** An earlier draft of this step did, and it hid two
call sites: `updateStudentPreferences` is a *third* entry point into the store, and its own
`getOrCreateStudentProfile` call lives inside the excluded file, so the grep reported "all accounted
for" while `/api/portal/v1/context` and `/api/tutor/student-profile/[id]/preferences` went unresolved.
Unresolved writes create fresh **unnamespaced** rows after the backfill has removed them, and the
partial unique index cannot see them because it filters on `partnerId: {$exists: true}`.

Record the list in the commit message. Every hit is either a **portal** path (must resolve with the verified `auth.partnerId`) or an **internal/retail** path (must resolve with `'evelyn'`).

- [ ] **Step 2: Write the failing test**

Create `apps/tutor/scripts/test-portal-student-scoping.ts` asserting, with the `__setRegistryOverrideForTests` seam from Task 3 and a stubbed resolver:

- a portal request for `studentId: 'user_1'` from `crimsora` resolves with `partnerId: 'crimsora'`, never the raw string;
- the same body from `academy` resolves with `partnerId: 'academy'`;
- a handler never receives the raw `studentId` as a profile key.

- [ ] **Step 3: Register the test**

```json
"test:portal-student-scoping": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-portal-student-scoping.ts"
```

- [ ] **Step 3a: Gate resolution behind `PORTAL_IDENTITY_RESOLUTION`**

Every call site changed below must consult a single helper, default **off**:

```ts
/**
 * M1c: identity resolution is flag-gated because resolveProfileId does NOT adopt
 * a pre-existing row lacking partnerId/externalStudentId — it mints a new
 * surrogate _id. Turning this on before the Task 6 backfill has stamped the 495
 * existing profiles would hand every existing student a blank profile while
 * their mastery stayed on the old _id. Flip it at rollout step 5a, after the
 * backfill and the index build. Default off so a deploy is always safe.
 */
export function identityResolutionEnabled(): boolean {
  return process.env.PORTAL_IDENTITY_RESOLUTION === 'on';
}
```

When off, a call site passes the raw id through exactly as today. Test both branches.

- [ ] **Step 4: Change each portal call site**

Replace, at every portal handler that touches a profile:

```ts
const profile = await getOrCreateStudentProfile(body.studentId);
```

with:

```ts
const profileId = await resolveProfileId({
  partnerId: auth.partnerId,
  externalStudentId: body.studentId,
});
const profile = await getOrCreateStudentProfile(profileId);
```

- [ ] **Step 4a: Pass the resolved id to EVERY student-keyed store, not just the profile**

Per spec §4.1, resolve **once per request** and use that `profileId` for all of:
`getOrCreateStudentProfile`, `updateStudentPreferences`, `appendEvidence({ studentId })`,
`LearnerStateProjection`/`LearnerStateSnapshot` queries, `StudentTopicNotes` keys,
`MockAttempt.studentId`, and `EloRating`'s `student:<id>|<subject>` rows.

**The one exception:** `EloRating`'s `item:<itemId>` and `lo:<loId>:d<n>` rows are item-difficulty
records, genuinely global and partner-agnostic. Do **not** resolve those.

Resolving only the profile would leave two partners sending `user_1` with two profiles but one shared
Elo rating, one projection and one set of topic notes — the milestone's premise, half-fixed. It would
also break `scripts/backfill-evidence.ts`, which writes `studentId: profile._id` and therefore assumes
the two agree.

- [ ] **Step 5: Change each retail/internal call site**

```ts
const profileId = await resolveProfileId({
  partnerId: 'evelyn',
  externalStudentId: userId,
});
const profile = await getOrCreateStudentProfile(profileId);
```

Leave the **ephemeral demo path** alone: sessions with no persistent identity never reach the store's DB branch, and inventing an identity for them would create a profile per demo visitor.

- [ ] **Step 6: Verify no raw studentId reaches the store**

```bash
cd apps/tutor
grep -rn "getOrCreateStudentProfile(" src --include=*.ts | grep -v "profileId" | grep -v student-profile/store.ts
```

Expected: empty.

- [ ] **Step 7: Run the full oracle**

```bash
cd apps/tutor && npm run test:all
```

Expected: 178 pass, the same 3 known-red.

- [ ] **Step 8: Commit**

```bash
git add -A apps/tutor
git commit -m "feat(m1c): scope every profile read to its partner at the entry points"
```

---

## Task 6: Backfill and the unique index

**Files:**
- Create: `apps/tutor/scripts/backfill-partner-namespace.ts`
- Create: `apps/tutor/scripts/test-partner-backfill.ts`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: the `Partner` model (Task 2), `StudentProfile` fields (Task 4).
- Produces: `attributeProfile(profile: { _id: string; partnerId?: string; externalStudentId?: string }, sessionsByStudentId: Map<string, Array<{ sourcePartnerId?: string }>>): { partnerId: string; externalStudentId: string; signal: 'already-migrated' | 'existing-prefix' | 'sourcePartnerId' | 'orphan-default' }` — exported for testing; throws on ambiguous attribution.

**Measured starting state** (from the spec; re-verify before the write pass): 495 profiles, 102 unnamespaced, 73 attributable via `TutorSession.sourcePartnerId` (`evelyn-marketing` 65, `crimsora` 6, `academy` 2), 29 orphans, zero ambiguity.

- [ ] **Step 1: Write the failing test**

Create `apps/tutor/scripts/test-partner-backfill.ts` covering `attributeProfile` in isolation:

```ts
/**
 * Backfill attribution tests (M1c Task 6).
 *
 * Run: `npm run test:partner-backfill`
 *
 * Pure function tests — attributeProfile takes the sessions it needs, so no
 * DB is involved and this counts in the oracle.
 */
import assert from 'node:assert';
import { attributeProfile } from './backfill-partner-namespace';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

(async () => {

await test('uses a prefix as a partner HINT but never strips it from externalStudentId', () => {
  const r = attributeProfile({ _id: 'lmtest:abc:def' }, new Map());
  assert.strictEqual(r.partnerId, 'lmtest');
  // Spec 4.2: the partner sends the WHOLE string. Splitting it here would make
  // resolveProfileId('lmtest', 'abc:def') miss this row after the flip and mint
  // a blank profile — for 393 of the 495 rows.
  assert.strictEqual(r.externalStudentId, 'lmtest:abc:def');
  assert.strictEqual(r.signal, 'existing-prefix');
});

await test('attributes via sourcePartnerId', () => {
  const sessions = new Map([['u1', [{ sourcePartnerId: 'crimsora' }]]]);
  const r = attributeProfile({ _id: 'u1' }, sessions);
  assert.strictEqual(r.partnerId, 'crimsora');
  assert.strictEqual(r.externalStudentId, 'u1');
  assert.strictEqual(r.signal, 'sourcePartnerId');
});

await test('falls back to evelyn when no session carries a partner', () => {
  const r = attributeProfile({ _id: 'orphan-1' }, new Map());
  assert.strictEqual(r.partnerId, 'evelyn');
  assert.strictEqual(r.signal, 'orphan-default');
});

await test('falls back to evelyn for a session with no sourcePartnerId', () => {
  const sessions = new Map([['u2', [{ source: 'tutor' }]]]);
  const r = attributeProfile({ _id: 'u2' }, sessions);
  assert.strictEqual(r.partnerId, 'evelyn');
});

await test('REFUSES to guess when two sessions disagree', () => {
  const sessions = new Map([['u3', [{ sourcePartnerId: 'crimsora' }, { sourcePartnerId: 'academy' }]]]);
  assert.throws(() => attributeProfile({ _id: 'u3' }, sessions), /ambiguous/i);
});

await test('is idempotent — a migrated profile is left alone', () => {
  const r = attributeProfile(
    { _id: 'gen-1', partnerId: 'crimsora', externalStudentId: 'user_1' }, new Map(),
  );
  assert.strictEqual(r.signal, 'already-migrated');
  assert.strictEqual(r.partnerId, 'crimsora');
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
```

- [ ] **Step 2: Register the test**

```json
"test:partner-backfill": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-partner-backfill.ts"
```

- [ ] **Step 3: Implement the script**

Create `apps/tutor/scripts/backfill-partner-namespace.ts`. It must:

1. Default to **dry-run**; require `--write` to mutate. Require `--build-index` as a separate flag.
2. Load every `TutorSession` with a `studentId` into a `Map<studentId, {sourcePartnerId?, sourceHost?, source?}[]>`.
3. For each profile, call `attributeProfile`.
4. Print a table: `_id` (masked), inferred `partnerId`, signal. Summarise counts by signal.
5. `--write`: `$set` `partnerId` + `externalStudentId` (always `= _id`, never a substring — spec 4.2). **Never touch `_id`.**
6. Ensure a `Partner` row exists for `evelyn` (`kind: 'first-party'`) and for the test prefixes
   `lmtest`/`trial`/`revtest`/`portalA` (`kind: 'test'`). **NEVER create a `kind: 'partner'` row** —
   a credential-less row wins over the env fallback and 401s that partner's live traffic. If a real
   partner id is observed with no existing row, **abort** and tell the operator to seed first.
   Also assert the observed partner set is a subset of the eight expected ids and abort otherwise:
   any `_id` containing a stray colon would otherwise mint a fabricated partner and a permanent
   namespace for that student.
7. Disable Mongoose index auto-build before connecting (`mongoose.set('autoIndex', false)`) so the
   dry run is genuinely read-only. Otherwise opening the connection builds every schema-declared
   index — including `TutorSession`'s `{startedAt:1}` TTL index, which **deletes** sessions older
   than 180 days.
7. `--build-index`: create the unique index, then verify it exists.

```ts
export function attributeProfile(
  profile: { _id: string; partnerId?: string; externalStudentId?: string },
  sessionsByStudentId: Map<string, Array<{ sourcePartnerId?: string }>>,
): { partnerId: string; externalStudentId: string; signal: string } {
  if (profile.partnerId && profile.externalStudentId) {
    return {
      partnerId: profile.partnerId,
      externalStudentId: profile.externalStudentId,
      signal: 'already-migrated',
    };
  }
  const colon = profile._id.indexOf(':');
  if (colon > 0) {
    return {
      partnerId: profile._id.slice(0, colon),
      // NOT sliced. See spec 4.2: `_id` is exactly what the partner transmits,
      // because pre-M1c the raw request id became the `_id`. Stripping the
      // prefix here would break resolution after the flip.
      externalStudentId: profile._id,
      signal: 'existing-prefix',
    };
  }
  const partners = new Set(
    (sessionsByStudentId.get(profile._id) ?? [])
      .map((s) => s.sourcePartnerId)
      .filter((p): p is string => Boolean(p)),
  );
  if (partners.size > 1) {
    throw new Error(
      `ambiguous attribution for ${profile._id}: ${[...partners].join(', ')} — resolve by hand`,
    );
  }
  if (partners.size === 1) {
    return {
      partnerId: [...partners][0],
      externalStudentId: profile._id,
      signal: 'sourcePartnerId',
    };
  }
  return { partnerId: 'evelyn', externalStudentId: profile._id, signal: 'orphan-default' };
}
```

The index build, run only under `--build-index`:

```ts
// PARTIAL on purpose. A plain unique index would also constrain any row that
// has not been migrated, and every unmigrated row shares (null, null). The
// partial filter means the index constrains exactly the rows we have given an
// identity to, so the build is safe to run before the backfill is universal
// and stays correct after it is.
await StudentProfileModel.collection.createIndex(
  { partnerId: 1, externalStudentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      partnerId: { $exists: true },
      externalStudentId: { $exists: true },
    },
    name: 'partner_external_student_unique',
  },
);
```

- [ ] **Step 4: Run the unit test**

```bash
cd apps/tutor && npm run test:partner-backfill
```

Expected: `6 passed, 0 failed`.

- [ ] **Step 5: Dry-run against production data**

```bash
cd apps/tutor && npx ts-node -r tsconfig-paths/register --compiler-options '{"module":"commonjs","baseUrl":"./"}' scripts/backfill-partner-namespace.ts
```

Expected, matching the spec's measured state: 102 to migrate — 73 `sourcePartnerId`, 29 `orphan-default`; 393 `existing-prefix`; 0 ambiguous. **Any ambiguity stops the rollout** — resolve by hand before continuing.

- [ ] **Step 6: Commit**

```bash
git add apps/tutor/scripts/backfill-partner-namespace.ts apps/tutor/scripts/test-partner-backfill.ts apps/tutor/package.json
git commit -m "feat(m1c): partner-namespace backfill with dry-run and partial unique index"
```

---

## Task 7: Limits, quotas and metering

**Files:**
- Create: `apps/tutor/src/models/PartnerCounter.ts`
- Create: `apps/tutor/src/lib/tutor/portal/limits.ts`
- Create: `apps/tutor/scripts/test-partner-limits.ts`
- Modify: `apps/tutor/src/lib/tutor/portal/auth.ts`, `apps/tutor/package.json`

**Interfaces:**
- Consumes: `PartnerRecord` (Task 2).
- Produces: `checkPartnerLimits(partner, endpoint, deps?): Promise<LimitVerdict>` where `LimitVerdict = { ok: true } | { ok: false; status: 429 | 402; reason: string; retryAfterSec?: number }`.

Model mirrors `PracticeGenCounter` (`index({ scopeKey, day }, { unique: true })` + a TTL index) — read it first.

- [ ] **Step 1: Write the failing test**

Cover, with an injected counter store:

| Case | Expect |
|---|---|
| under the burst limit | `ok: true` |
| over the burst limit | `429`, `retryAfterSec > 0` |
| a new minute window resets burst | `ok: true` |
| no `dailyQuota` configured, over any count | `ok: true` |
| `dailyQuota` configured and exceeded | `402 quota_exceeded` |
| **store throws, no quota configured** | `ok: true` — burst fails OPEN |
| **store throws, quota configured** | `402` — quota fails CLOSED |
| report-only mode, over the limit | `ok: true`, and a `[portal/limits] would-block` line is logged |
| metering | the day counter increments once per call |

The two failure-policy rows are the point of this task; the spec's §6.1 explains why they differ.

- [ ] **Step 2: Register the test**

```json
"test:partner-limits": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-partner-limits.ts"
```

- [ ] **Step 3: Implement the counter model**

Create `apps/tutor/src/models/PartnerCounter.ts`:

```ts
/**
 * Per-partner request counters (M1c Task 7).
 *
 * TWO documents per request, distinguished by `windowKind`:
 *   'minute' — burst limiting; expires quickly, never read after its window
 *   'day'    — serves BOTH the daily quota and metering, so billing is a
 *              byproduct of the quota write rather than a second code path
 *
 * Shape mirrors PracticeGenCounter: a unique compound key plus a TTL index.
 * `windowStart` is an ISO string so the key is human-readable in Compass.
 */
import mongoose, { Schema } from 'mongoose';

export interface IPartnerCounter {
  partnerId: string;
  endpoint: string;
  windowKind: 'minute' | 'day';
  windowStart: string;
  count: number;
  createdAt: Date;
}

const PartnerCounterSchema = new Schema<IPartnerCounter>({
  partnerId: { type: String, required: true },
  endpoint: { type: String, required: true },
  windowKind: { type: String, enum: ['minute', 'day'], required: true },
  windowStart: { type: String, required: true },
  count: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

PartnerCounterSchema.index(
  { partnerId: 1, endpoint: 1, windowKind: 1, windowStart: 1 },
  { unique: true },
);
// 48h is well past the longest window (a day) and matches PracticeGenCounter.
// The day documents are read for billing before they expire; export them if
// billing ever needs a longer horizon than two days.
PartnerCounterSchema.index({ createdAt: 1 }, { expireAfterSeconds: 48 * 60 * 60 });

export const PartnerCounterModel =
  (mongoose.models.PartnerCounter as mongoose.Model<IPartnerCounter>) ||
  mongoose.model<IPartnerCounter>('PartnerCounter', PartnerCounterSchema);
```

- [ ] **Step 4: Implement `checkPartnerLimits`**

Create `apps/tutor/src/lib/tutor/portal/limits.ts`:

```ts
/**
 * Per-partner burst, quota and metering (M1c Task 7).
 *
 * Failure policy, and why the two halves differ (spec section 6.1):
 *   - BURST fails OPEN. Crimsora is live paying traffic; serving an unmetered
 *     request beats 503-ing a student mid-session.
 *   - QUOTA fails CLOSED, but ONLY for partners that actually have a
 *     dailyQuota configured. Without that carve-out the two policies
 *     contradict each other: both counters share a store, so a store outage
 *     would trip fail-closed and the fail-open would never matter. No partner
 *     has a quota today, so an outage degrades to unmetered service.
 *
 * PORTAL_LIMITS_MODE=report-only logs what WOULD be blocked and allows it.
 */
import connectDB from '@core/db';
import { PartnerCounterModel } from '@/models/PartnerCounter';
import type { PartnerRecord } from './registry';

export type LimitVerdict =
  | { ok: true }
  | { ok: false; status: 429 | 402; reason: string; retryAfterSec?: number };

export interface LimitsDeps {
  /** Increment and return the new count for one window. */
  bump(key: {
    partnerId: string; endpoint: string;
    windowKind: 'minute' | 'day'; windowStart: string;
  }): Promise<number>;
  now(): number;
  env: NodeJS.ProcessEnv;
}

const defaultLimitsDeps: LimitsDeps = {
  async bump(key) {
    await connectDB();
    const doc = await PartnerCounterModel.findOneAndUpdate(
      key,
      { $inc: { count: 1 }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, new: true },
    ).lean<{ count: number }>().exec();
    return doc?.count ?? 1;
  },
  now: () => Date.now(),
  env: process.env,
};

function minuteWindow(ms: number): string {
  return new Date(Math.floor(ms / 60_000) * 60_000).toISOString();
}
function dayWindow(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export async function checkPartnerLimits(
  partner: PartnerRecord,
  endpoint: string,
  deps: LimitsDeps = defaultLimitsDeps,
): Promise<LimitVerdict> {
  const reportOnly = deps.env.PORTAL_LIMITS_MODE === 'report-only';
  const hasQuota =
    typeof partner.limits.dailyQuota === 'number' && partner.limits.dailyQuota > 0;
  const nowMs = deps.now();

  const block = (v: Exclude<LimitVerdict, { ok: true }>): LimitVerdict => {
    if (reportOnly) {
      console.warn(
        `[portal/limits] would-block partner=${partner.partnerId} endpoint=${endpoint} reason=${v.reason}`,
      );
      return { ok: true };
    }
    return v;
  };

  // --- burst: fails OPEN -------------------------------------------------
  try {
    const count = await deps.bump({
      partnerId: partner.partnerId, endpoint,
      windowKind: 'minute', windowStart: minuteWindow(nowMs),
    });
    if (partner.limits.burst > 0 && count > partner.limits.burst) {
      const retryAfterSec = Math.ceil((60_000 - (nowMs % 60_000)) / 1000);
      return block({ ok: false, status: 429, reason: 'rate_limited', retryAfterSec });
    }
  } catch (err) {
    console.error(
      `[portal/limits] burst counter unavailable for partner=${partner.partnerId} — failing OPEN`,
      err,
    );
    // Deliberately fall through and serve the request.
  }

  // --- quota + metering: fails CLOSED, but only when a quota exists -------
  try {
    const count = await deps.bump({
      partnerId: partner.partnerId, endpoint,
      windowKind: 'day', windowStart: dayWindow(nowMs),
    });
    if (hasQuota && count > (partner.limits.dailyQuota as number)) {
      return block({ ok: false, status: 402, reason: 'quota_exceeded' });
    }
  } catch (err) {
    console.error(
      `[portal/limits] day counter unavailable for partner=${partner.partnerId} — ` +
        `failing ${hasQuota ? 'CLOSED (quota configured)' : 'OPEN (no quota configured)'}`,
      err,
    );
    if (hasQuota) {
      return block({ ok: false, status: 402, reason: 'quota_unverifiable' });
    }
  }

  return { ok: true };
}
```

- [ ] **Step 5: Wire into `withPortalAuth`**

Call `checkPartnerLimits` immediately **after** the allowlist check — which now runs after signature
verification, not before it. This step originally said "before signature verification is accepted",
which was written against the pre-Task-3 ordering and is stale: Task 3's review found that checking
the allowlist before the signature let an unauthenticated caller enumerate a partner's allowlist, so
the order is now headers → partner → kind → status → **signature** → allowlist → limits. Do not
reorder any of it.

- [ ] **Step 6: Run the tests**

```bash
cd apps/tutor && npm run test:partner-limits && npm run test:portal-auth-registry
```

- [ ] **Step 7: Commit**

```bash
git add apps/tutor/src/models/PartnerCounter.ts apps/tutor/src/lib/tutor/portal/limits.ts apps/tutor/src/lib/tutor/portal/auth.ts apps/tutor/scripts/test-partner-limits.ts apps/tutor/package.json
git commit -m "feat(m1c): per-partner burst limits, quotas and metering counters"
```

---

## Task 8: Flag-override channel

**Files:**
- Create: `apps/tutor/src/lib/tutor/portal/flags.ts`
- Create: `apps/tutor/scripts/test-partner-flags.ts`
- Modify: `apps/tutor/package.json`

**Interfaces:**
- Consumes: `PartnerRecord.flagOverrides` (Task 2).
- Produces: `resolveFlag(name: string, partner: PartnerRecord | null, fallback: boolean | string): boolean | string`.

- [ ] **Step 1: Write the failing test**

Assert: an override wins; absent override falls back to the build-time constant; a `null` partner (internal/retail call) falls back; `false` and empty-string overrides are honoured rather than treated as absent (the `??` vs `||` trap).

- [ ] **Step 2: Register, run, watch it fail, implement, run**

```json
"test:partner-flags": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-partner-flags.ts"
```

```ts
export function resolveFlag(
  name: string,
  partner: { flagOverrides: Record<string, boolean | string> } | null,
  fallback: boolean | string,
): boolean | string {
  const v = partner?.flagOverrides?.[name];
  // `??` not `||`: an override of `false` or '' is a real value, and `||`
  // would silently fall through to the build-time constant instead.
  return v ?? fallback;
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/tutor/src/lib/tutor/portal/flags.ts apps/tutor/scripts/test-partner-flags.ts apps/tutor/package.json
git commit -m "feat(m1c): per-partner flag override channel (D12 hook)"
```

---

## Task 9: Seed script and rollout switches

**Files:**
- Create: `apps/tutor/scripts/seed-partner-registry.ts`
- Modify: `README.md`
- Modify: `apps/tutor/package.json`

- [ ] **Step 1: Write the seed script**

Reads `PORTAL_PARTNER_SECRETS`, writes one `Partner` row per entry with `kind: 'partner'`, `status: 'active'`, `allowedEndpoints: ['/api/portal/v1/']` (all 23 routes, so nothing changes for existing callers), `limits: { rpm: 600, burst: 60, dailyQuota: null }`, and the secret sealed via `encryptSecret`. Also creates the `evelyn` row with `kind: 'first-party'` and no secrets. Idempotent: re-running updates rather than duplicating, and never overwrites an existing secret array.

- [ ] **Step 2: Register both ops scripts**

```json
"seed:partner-registry": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/seed-partner-registry.ts",
"backfill:partner-namespace": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/backfill-partner-namespace.ts"
```

Neither is a `test:*` entry, so neither joins the oracle.

- [ ] **Step 3: Document the rollout in `README.md`**

Add a "Partner registry (M1c)" section recording: `PORTAL_SECRET_ENC_KEY` must be backed up with the other production secrets; the ordered rollout below; and that `PORTAL_PARTNER_SECRETS` is removed only at step 5.

- [ ] **Step 4: Full oracle**

```bash
cd apps/tutor && npm run test:all
```

Expected: 178 pass plus the eight new suites, the same 3 known-red.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/scripts/seed-partner-registry.ts README.md apps/tutor/package.json
git commit -m "chore(m1c): partner registry seed script and rollout documentation"
```

---

## Rollout (production, after all tasks land)

Each step is independently reversible. **Do not batch them.**

1. Set `PORTAL_SECRET_ENC_KEY` in the production env and **back it up**. Deploy. Env still authoritative.
2. `npm run seed:partner-registry` — rows exist; registry wins per-partner; verify one live partner call still succeeds.
3. `npm run backfill:partner-namespace` (dry-run) — review the attribution table.
4. `npm run backfill:partner-namespace -- --write`.
5. `npm run backfill:partner-namespace -- --build-index` — the build is the verification; it refuses on any duplicate.
5a. **Preconditions, both of which must hold before the flip:**
    (i) `EMBED_TOKEN_ENFORCE=on` in the target environment. With it `off`, `checkEmbedAuth` allows a
    request with no token, `partner_id` is undefined, and internal routes fall back to `'evelyn'` —
    which is exactly the split spec §4.0 exists to prevent. **Verified 2026-08-15: production already
    has `EMBED_TOKEN_ENFORCE=on`**, so this is a guard for other environments and for any new node.
    (ii) `/api/tutor/topic-notes/**` has embed-token auth (done in Task 5 round 2).

5a. **Only now set `PORTAL_IDENTITY_RESOLUTION=on` and deploy.** Until this flip, call sites keep using
    the raw id, so existing students keep their profiles. Flipping before step 4 gives every existing
    student a blank profile — see the Global Constraint. Reversible: unset the flag and redeploy.
6. Remove `PORTAL_PARTNER_SECRETS` from the env. Deploy.
   **Precondition, found during Task 3:** `getPartnerSecret` is NOT retired —
   `src/app/api/tutor-portal/demo-token/route.ts` still calls it directly for `evelyn-marketing`,
   bypassing the registry entirely. Removing the env before that partner has a working registry row
   **and** that route is migrated would break the live demo-token path. Verify both before this step.
7. `PORTAL_LIMITS_MODE=report-only`. Observe for a day.
8. Remove `PORTAL_LIMITS_MODE`. Limits enforced.

---

## Acceptance gate

1. `npm run test:all` — 178 prior passes plus the eight new suites; the same 3 known-red; no new failures.
2. `npm run check:boundaries` exits 0.
3. The collision test passes at the **store** level, not just the profile level: two partners sending
   `user_1` get two profiles **and** two projections, two topic-note documents and two Elo student rows
   (spec §4.1). A test asserting only on `StudentProfile` does not satisfy this gate.
3a. Every backfilled profile round-trips: resolving with the id the partner actually transmits returns
   that profile's own `_id`, not a new one (spec §4.2).
4. The dry-run backfill reports **0 ambiguous** attributions against production data.
5. The unique partial index exists and `db.studentprofiles.getIndexes()` shows `partner_external_student_unique`.
6. Crimsora runs a full live voice session with **no change to its own config or credentials**.
7. `/api/portal/v1/**` returns 401/402/403/429 per §8 of the spec and never 404.

---

## Known follow-ups deliberately left undone

- **Marketing's in-memory rate limiter** is untouched — different threat model.
- **Redis** remains the documented upgrade path for counters if volume justifies it; Mongo was chosen because M1b's second node cannot see the box's loopback-bound Redis.
- **An admin UI for the registry** — M1c ships the seed script and the collection; the console is M1e.
- **Per-brand CNAME and token-carried flag overrides** are D12; M1c ships only the channel.
- **`EvidenceEvent.partnerId`** stays as it is (populated on 7 of 2,423). Nothing reads it; the profile is the authority.
