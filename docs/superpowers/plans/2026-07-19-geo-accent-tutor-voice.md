# Geo-Based Tutor Voice Accent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Students on /tutor hear a tutor voice matching their region — browser timezone → accent tag → existing Cartesia accent-pool resolver.

**Architecture:** Three new entries in the existing `ACCENT_POOLS` (en-au, en-sg, en-za), a new pure module `geo-accent.ts` mapping IANA timezone → accent tag, and a one-expression change on /tutor to pass that accent into the already-built `resolveCartesiaVoice({teacherId, accent})`. No resolver changes, no server changes, no new dependencies.

**Tech Stack:** TypeScript, Next.js client page, plain-assert test scripts run via `npx tsx` (repo convention — no jest/vitest here).

**Spec:** `docs/superpowers/specs/2026-07-19-geo-accent-tutor-voice-design.md`

## Global Constraints

- Voice IDs are user-locked (2026-07-19); copy them EXACTLY as written in Task 1 — do not "verify" them against Cartesia or substitute others.
- Gender assignment is user-corrected: Zanele = female, Pieter = male.
- Existing `ACCENT_POOLS` entries, `TEACHER_VOICES`, and `resolveCartesiaVoice` logic must not change.
- Test scripts follow the repo's `scripts/test-*.ts` + `check()` pattern (see `scripts/test-cartesia-voice-registry.ts`), run with `npx tsx`.
- All work in `/Users/luke/Dev/evelynlearning` on `main`.

---

### Task 1: New accent pools (en-au, en-sg, en-za)

**Files:**
- Modify: `src/lib/tutor/voice/cartesia-voice-registry.ts` (ACCENT_POOLS, ~line 82-110)
- Test: `scripts/test-cartesia-voice-registry.ts` (append)

**Interfaces:**
- Consumes: existing `resolveCartesiaVoice(opts)` and `AccentPool` shape — unchanged.
- Produces: `ACCENT_POOLS['en-au' | 'en-sg' | 'en-za']` resolvable via `resolveCartesiaVoice({ accent })` and `resolveCartesiaVoice({ teacherId, accent })`. Task 3 relies on accent tags `'en-au' | 'en-sg' | 'en-za'` existing.

- [ ] **Step 1: Write the failing tests**

Append to the end of `scripts/test-cartesia-voice-registry.ts` (before any final summary `console.log` if present, else at end of file):

```ts
// ── Geo-accent pools (2026-07-19 spec: user-locked ids, no listening round) ──
const GRACE_EN_AU = 'c2ad7092-0447-47ea-948b-61fbb6faf153';
const COOPER_EN_AU = '49743b08-0f5d-4741-839c-b12933853780';
const NADIA_EN_SG = 'efddb3d2-4464-45e0-9f8a-fcd5fd4fc54f';
const KIRAN_EN_SG = 'ac5a9529-3965-4eac-b574-dce63664fbf4';
const ZANELE_EN_ZA = '263b9cc0-0d99-44e7-ae92-3d4ad5d2ad18';
const PIETER_EN_ZA = 'baf84392-fa95-4d44-8871-d32ee36b0e01';

check('elena + en-au -> Grace (female pool pick)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: ELENA, accent: 'en-au' }).voiceId,
    GRACE_EN_AU,
  );
});

check('dev + en-au -> Cooper (male pool pick)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: DEV, accent: 'en-au' }).voiceId,
    COOPER_EN_AU,
  );
});

check('no teacher + en-sg -> Nadia (female default)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ accent: 'en-sg' }).voiceId,
    NADIA_EN_SG,
  );
});

check('dev + en-sg -> Kiran (male pool pick)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: DEV, accent: 'en-sg' }).voiceId,
    KIRAN_EN_SG,
  );
});

check('elena + en-za -> Zanele (female pool pick; user-corrected gender)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: ELENA, accent: 'en-za' }).voiceId,
    ZANELE_EN_ZA,
  );
});

check('dev + en-za -> Pieter (male pool pick; user-corrected gender)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: DEV, accent: 'en-za' }).voiceId,
    PIETER_EN_ZA,
  );
});

check('dev + en-in still -> Sameer (native-accent short-circuit unchanged)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: DEV, accent: 'en-in' }).voiceId,
    SAMEER,
  );
});
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `cd /Users/luke/Dev/evelynlearning && npm run test:cartesia-registry`
Expected: existing checks pass, then FAIL on `'elena + en-au -> Grace (female pool pick)'` — the unknown accent falls back to Katie, so the assert fires. (The script throws on first failure.)

- [ ] **Step 3: Add the three pools**

In `src/lib/tutor/voice/cartesia-voice-registry.ts`, append inside the `ACCENT_POOLS` object, after the `'en-de'` entry:

```ts
  // ── Geo-default pools (2026-07-19 geo-accent spec; user-locked ids,
  // no listening round — see docs/superpowers/specs/
  // 2026-07-19-geo-accent-tutor-voice-design.md). en-sg also serves the
  // Philippines/SE Asia (Cartesia stocks no Filipino accent); en-za serves
  // all African-accent needs (only African accent Cartesia stocks).
  'en-au': {
    female: { voiceId: 'c2ad7092-0447-47ea-948b-61fbb6faf153', label: 'Grace' },
    male: { voiceId: '49743b08-0f5d-4741-839c-b12933853780', label: 'Cooper' },
  },
  'en-sg': {
    female: { voiceId: 'efddb3d2-4464-45e0-9f8a-fcd5fd4fc54f', label: 'Nadia' },
    male: { voiceId: 'ac5a9529-3965-4eac-b574-dce63664fbf4', label: 'Kiran' },
  },
  'en-za': {
    // Gender labels user-corrected 2026-07-19: Zanele female, Pieter male.
    female: { voiceId: '263b9cc0-0d99-44e7-ae92-3d4ad5d2ad18', label: 'Zanele' },
    male: { voiceId: 'baf84392-fa95-4d44-8871-d32ee36b0e01', label: 'Pieter' },
  },
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:cartesia-registry`
Expected: all checks print `ok - …`, exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/voice/cartesia-voice-registry.ts scripts/test-cartesia-voice-registry.ts
git commit -m "feat(voice): en-au/en-sg/en-za Cartesia accent pools (geo-accent spec)"
```

---

### Task 2: `geo-accent.ts` timezone → accent mapper

**Files:**
- Create: `src/lib/tutor/voice/geo-accent.ts`
- Create: `scripts/test-geo-accent.ts`
- Modify: `package.json` (add `test:geo-accent` script next to `test:cartesia-registry`, line ~65)

**Interfaces:**
- Consumes: nothing (pure module, zero imports).
- Produces: `accentFromTimezone(tz: string | undefined): string | undefined` — returns an `ACCENT_POOLS` key or `undefined`. Task 3 imports it as `import { accentFromTimezone } from '@/lib/tutor/voice/geo-accent';`.

- [ ] **Step 1: Write the failing test file**

Create `scripts/test-geo-accent.ts`:

```ts
/**
 * Unit tests for the timezone -> accent mapper
 * (docs/superpowers/specs/2026-07-19-geo-accent-tutor-voice-design.md).
 * Pure-logic test — no network, no DOM.
 *
 * Usage: npx tsx scripts/test-geo-accent.ts
 */
import assert from 'node:assert';
import { accentFromTimezone } from '../src/lib/tutor/voice/geo-accent';

let passed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (err) {
    console.error(`  FAIL - ${name}`);
    throw err;
  }
}

const CASES: Array<[string | undefined, string | undefined]> = [
  // en-in: subcontinent
  ['Asia/Kolkata', 'en-in'],
  ['Asia/Calcutta', 'en-in'], // legacy alias still emitted by some browsers
  ['Asia/Karachi', 'en-in'],
  ['Asia/Dhaka', 'en-in'],
  ['Asia/Colombo', 'en-in'],
  ['Asia/Kathmandu', 'en-in'],
  // en-au: Australia + NZ
  ['Australia/Sydney', 'en-au'],
  ['Australia/Perth', 'en-au'],
  ['Pacific/Auckland', 'en-au'],
  // en-sg: SE Asia (serves PH too — no Filipino accent in Cartesia)
  ['Asia/Manila', 'en-sg'],
  ['Asia/Singapore', 'en-sg'],
  ['Asia/Kuala_Lumpur', 'en-sg'],
  ['Asia/Hong_Kong', 'en-sg'],
  ['Asia/Brunei', 'en-sg'],
  // en-za: sub-Saharan Africa (prefix rule)
  ['Africa/Johannesburg', 'en-za'],
  ['Africa/Lagos', 'en-za'],
  ['Africa/Nairobi', 'en-za'],
  ['Africa/Dar_es_Salaam', 'en-za'],
  ['Africa/Porto-Novo', 'en-za'],
  // en-ar-gulf: Gulf + Levant + North Africa (exact beats Africa/* prefix)
  ['Asia/Dubai', 'en-ar-gulf'],
  ['Asia/Riyadh', 'en-ar-gulf'],
  ['Asia/Amman', 'en-ar-gulf'],
  ['Asia/Kuwait', 'en-ar-gulf'],
  ['Asia/Qatar', 'en-ar-gulf'],
  ['Asia/Bahrain', 'en-ar-gulf'],
  ['Asia/Baghdad', 'en-ar-gulf'],
  ['Asia/Beirut', 'en-ar-gulf'],
  ['Asia/Damascus', 'en-ar-gulf'],
  ['Asia/Muscat', 'en-ar-gulf'],
  ['Africa/Cairo', 'en-ar-gulf'],
  ['Africa/Casablanca', 'en-ar-gulf'],
  ['Africa/Algiers', 'en-ar-gulf'],
  ['Africa/Tunis', 'en-ar-gulf'],
  ['Africa/Tripoli', 'en-ar-gulf'],
  ['Africa/Khartoum', 'en-ar-gulf'],
  // en-de / en-nl / en-gb
  ['Europe/Berlin', 'en-de'],
  ['Europe/Vienna', 'en-de'],
  ['Europe/Zurich', 'en-de'],
  ['Europe/Amsterdam', 'en-nl'],
  ['Europe/Brussels', 'en-nl'],
  ['Europe/London', 'en-gb'],
  ['Europe/Dublin', 'en-gb'],
  ['Europe/Malta', 'en-gb'],
  // en-us: all of the Americas (prefix rule) + Hawaii
  ['America/New_York', 'en-us'],
  ['America/Toronto', 'en-us'],
  ['America/Lima', 'en-us'],
  ['America/Sao_Paulo', 'en-us'],
  ['Pacific/Honolulu', 'en-us'],
  // fall-through: unmapped -> undefined (teacher base voice wins)
  ['Europe/Paris', undefined],
  ['Europe/Madrid', undefined],
  ['Asia/Tokyo', undefined],
  ['Asia/Shanghai', undefined],
  ['Europe/Istanbul', undefined],
  [undefined, undefined],
  ['', undefined],
  ['Not/A_Zone', undefined],
];

for (const [tz, expected] of CASES) {
  check(`${JSON.stringify(tz)} -> ${JSON.stringify(expected)}`, () => {
    assert.strictEqual(accentFromTimezone(tz), expected);
  });
}

console.log(`\n${passed}/${CASES.length} geo-accent checks passed`);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd /Users/luke/Dev/evelynlearning && npx tsx scripts/test-geo-accent.ts`
Expected: FAIL — `Cannot find module '../src/lib/tutor/voice/geo-accent'` (module doesn't exist yet).

- [ ] **Step 3: Implement the module**

Create `src/lib/tutor/voice/geo-accent.ts`:

```ts
/**
 * Browser-timezone -> tutor voice accent mapping
 * (docs/superpowers/specs/2026-07-19-geo-accent-tutor-voice-design.md).
 *
 * The site is served directly by nginx (no CDN geo header), so the /tutor
 * page derives a default accent client-side from the IANA timezone
 * (`Intl.DateTimeFormat().resolvedOptions().timeZone`) — zero infra, no
 * IP-geo API. Returned tags are ACCENT_POOLS keys consumed by
 * resolveCartesiaVoice (src/lib/tutor/voice/cartesia-voice-registry.ts);
 * `undefined` means "no geo opinion" and the teacher's base voice wins.
 *
 * Pure module: zero imports, safe anywhere.
 */

/** Exact-match zones. Checked before prefix rules so that e.g.
 * Africa/Cairo (Arabic) beats the Africa/* -> en-za prefix rule. */
const EXACT_ZONE_ACCENTS: Record<string, string> = {
  // Subcontinent -> en-in
  'Asia/Kolkata': 'en-in',
  'Asia/Calcutta': 'en-in', // legacy alias some browsers still emit
  'Asia/Karachi': 'en-in',
  'Asia/Dhaka': 'en-in',
  'Asia/Colombo': 'en-in',
  'Asia/Kathmandu': 'en-in',
  'Asia/Thimphu': 'en-in',
  // NZ rides with en-au (Australia/* handled by prefix rule)
  'Pacific/Auckland': 'en-au',
  'Pacific/Chatham': 'en-au',
  // SE Asia -> en-sg (also serves PH: Cartesia stocks no Filipino accent)
  'Asia/Manila': 'en-sg',
  'Asia/Singapore': 'en-sg',
  'Asia/Kuala_Lumpur': 'en-sg',
  'Asia/Kuching': 'en-sg',
  'Asia/Hong_Kong': 'en-sg',
  'Asia/Macau': 'en-sg',
  'Asia/Brunei': 'en-sg',
  // Gulf + Levant -> en-ar-gulf
  'Asia/Dubai': 'en-ar-gulf',
  'Asia/Riyadh': 'en-ar-gulf',
  'Asia/Amman': 'en-ar-gulf',
  'Asia/Kuwait': 'en-ar-gulf',
  'Asia/Qatar': 'en-ar-gulf',
  'Asia/Bahrain': 'en-ar-gulf',
  'Asia/Baghdad': 'en-ar-gulf',
  'Asia/Beirut': 'en-ar-gulf',
  'Asia/Damascus': 'en-ar-gulf',
  'Asia/Muscat': 'en-ar-gulf',
  'Asia/Aden': 'en-ar-gulf',
  'Asia/Hebron': 'en-ar-gulf',
  'Asia/Gaza': 'en-ar-gulf',
  // Arabic North Africa -> en-ar-gulf (must beat Africa/* prefix)
  'Africa/Cairo': 'en-ar-gulf',
  'Africa/Casablanca': 'en-ar-gulf',
  'Africa/El_Aaiun': 'en-ar-gulf',
  'Africa/Algiers': 'en-ar-gulf',
  'Africa/Tunis': 'en-ar-gulf',
  'Africa/Tripoli': 'en-ar-gulf',
  'Africa/Khartoum': 'en-ar-gulf',
  'Africa/Nouakchott': 'en-ar-gulf',
  // DACH -> en-de
  'Europe/Berlin': 'en-de',
  'Europe/Busingen': 'en-de',
  'Europe/Vienna': 'en-de',
  'Europe/Zurich': 'en-de',
  // Benelux -> en-nl
  'Europe/Amsterdam': 'en-nl',
  'Europe/Brussels': 'en-nl',
  // UK/IE/MT -> en-gb
  'Europe/London': 'en-gb',
  'Europe/Dublin': 'en-gb',
  'Europe/Malta': 'en-gb',
  'Europe/Isle_of_Man': 'en-gb',
  'Europe/Jersey': 'en-gb',
  'Europe/Guernsey': 'en-gb',
  'Europe/Gibraltar': 'en-gb',
  // US outliers not under America/*
  'Pacific/Honolulu': 'en-us',
};

/**
 * Map an IANA timezone to a tutor accent tag, or `undefined` when we have
 * no geo opinion (unmapped region, missing/garbage input) — callers fall
 * back to the teacher's base voice. LatAm deliberately maps to en-us via
 * the America/* rule (no es->en carryover voice chosen; revisit if LatAm
 * traffic grows).
 */
export function accentFromTimezone(tz: string | undefined): string | undefined {
  if (!tz) return undefined;
  const exact = EXACT_ZONE_ACCENTS[tz];
  if (exact) return exact;
  if (tz.startsWith('Australia/')) return 'en-au';
  if (tz.startsWith('Africa/')) return 'en-za';
  if (tz.startsWith('America/')) return 'en-us';
  return undefined;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx tsx scripts/test-geo-accent.ts`
Expected: every line `ok - …`, final line `56/56 geo-accent checks passed`, exit 0.

- [ ] **Step 5: Add the npm script**

In `package.json`, directly after the `"test:cartesia-registry"` line (~line 65), add:

```json
    "test:geo-accent": "npx tsx scripts/test-geo-accent.ts",
```

Run: `npm run test:geo-accent`
Expected: same passing output as Step 4.

- [ ] **Step 6: Commit**

```bash
git add src/lib/tutor/voice/geo-accent.ts scripts/test-geo-accent.ts package.json
git commit -m "feat(voice): timezone -> accent mapper for geo-default tutor voice"
```

---

### Task 3: Wire geo accent into /tutor

**Files:**
- Modify: `src/app/tutor/page.tsx` (import block ~line 58; `cartesiaVoiceId` memo, lines 399-402)

**Interfaces:**
- Consumes: `accentFromTimezone` (Task 2), accent tags resolvable in pools (Task 1), existing `resolveCartesiaVoice`.
- Produces: nothing new — `cartesiaVoiceId` (existing const) now geo-aware.

- [ ] **Step 1: Make the change**

In `src/app/tutor/page.tsx`, extend the existing registry import (line 58):

```ts
import { resolveCartesiaVoice } from '@/lib/tutor/voice/cartesia-voice-registry';
import { accentFromTimezone } from '@/lib/tutor/voice/geo-accent';
```

Replace the `cartesiaVoiceId` memo (lines 399-402):

```ts
  const cartesiaVoiceId = useMemo(
    () =>
      resolveCartesiaVoice({
        teacherId: selectedTeacherId,
        // Geo default (2026-07-19 spec): browser timezone -> accent pool.
        // Client-only signal; during SSR Intl has no user timezone, but
        // this memo's value is only consumed at TTS-request time (client),
        // so the server-render value is never used for audio.
        accent: accentFromTimezone(
          typeof Intl !== 'undefined'
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : undefined,
        ),
      }).voiceId,
    [selectedTeacherId],
  );
```

- [ ] **Step 2: Type-check and lint the touched file**

Run: `cd /Users/luke/Dev/evelynlearning && npx tsc --noEmit -p tsconfig.json`
Expected: exit 0 (no new errors; if the repo has pre-existing errors, confirm none mention `page.tsx`/`geo-accent`).

Run: `npx next lint --file src/app/tutor/page.tsx`
Expected: no errors for the edited lines.

- [ ] **Step 3: Run both voice test suites (regression)**

Run: `npm run test:cartesia-registry && npm run test:geo-accent`
Expected: both exit 0, all `ok`.

- [ ] **Step 4: Live smoke check**

Run the dev server and load /tutor with a spoofed timezone:

```bash
TZ=Australia/Sydney npm run dev
```

Open http://localhost:3000/tutor, start a Cartesia-TTS session (requires the `NEXT_PUBLIC_TUTOR_TTS_ENGINE=cartesia` flag or `?tts=cartesia` override per the existing page comment), and confirm in the network tab that the TTS request carries Grace's voice id `c2ad7092-0447-47ea-948b-61fbb6faf153` for Elena. (`TZ` env sets Node's zone; the browser uses the OS zone — if spoofing the browser is awkward, temporarily hardcode `accentFromTimezone('Australia/Sydney')` locally to verify, then revert, or verify via devtools sensor override: DevTools ⋮ → More tools → Sensors → Location → set a custom timezone.)
Expected: voice id in the TTS request switches per timezone; with an unmapped zone (e.g. Tokyo) Elena stays Katie `f786b574-daa5-4673-aa0c-cbe3e8534c02`.

- [ ] **Step 5: Commit**

```bash
git add src/app/tutor/page.tsx
git commit -m "feat(tutor): geo-default voice accent from browser timezone"
```

---

## Deploy note (post-plan, user-gated)

Deploy to production ONLY via `./deploy-update.sh` (never `npm run deploy` — ships to a dead dir). Not part of this plan's tasks; user decides when.
