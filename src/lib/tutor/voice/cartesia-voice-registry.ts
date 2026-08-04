/**
 * Cartesia voice registry (Phase 2, Task 1 of
 * docs/superpowers/plans/2026-07-06-cartesia-migration-phase2.md).
 *
 * Maps each demo teacher persona (see DEMO_TEACHERS in
 * src/lib/tutor/ai/teacher-persona.ts) to a persona-authentic Cartesia
 * Sonic voice, with an accent-pool fallback for portal/EmbedConfig accent
 * overrides (Phase 3 territory — this module just exposes the data +
 * resolver so Phase 3 can consume it without touching this file again).
 *
 * Pure module: zero imports from React/hooks/Next — safe to import from
 * both server routes (src/app/api/tutor/tts-cartesia) and client hooks
 * (src/app/tutor/hooks/useOpenAIRealtime.ts) / src/app/tutor/page.tsx.
 *
 * All voice IDs below are the LOCKED round-1 listening-verdict data from
 * the plan's "Locked voice registry data" section
 * (scripts/tutor/voice-harness/verdicts-round1.json records pass/fail by
 * name only, no ids — the plan text is the sole source of truth for ids).
 *
 * Two ids (Jameson/en-us-male, Archie/en-gb-male) were given in the plan
 * as a single id shared across a name list ("en-us Katie/Skylar/Jameson
 * <id>"; "en-gb Gemma/Archie <id>"). Katie and Skylar (en-us) and Gemma
 * (en-gb) already have their own distinct ids as teacher bases elsewhere
 * in the plan, so by elimination the grouped id must belong to the one
 * name in each list that has no id defined elsewhere: Jameson and Archie
 * respectively. Flagged for a quick double-check against the Cartesia
 * voice library before Task 2/3 live-verify.
 */

type Gender = 'female' | 'male';

interface VoiceEntry {
  voiceId: string;
  label: string;
  /** Optional Cartesia __experimental_controls.speed offset ∈ [-1,1] — per-voice
   *  cadence normalization (R38: Katie ≈22 chars/s vs 14–17 baseline). */
  speed?: number;
}

interface TeacherVoice extends VoiceEntry {
  gender: Gender;
  /** Accent this teacher's base voice is already native to (no pool swap needed). */
  nativeAccent: string;
}

interface AccentPool {
  female?: VoiceEntry;
  male?: VoiceEntry;
  /** Used when the accent has only one passing voice (no gender split). */
  default?: VoiceEntry;
}

// ── Persona-authentic teacher bases ──
// Real DEMO_TEACHERS ids from src/lib/tutor/ai/teacher-persona.ts (NOT the
// short names used in this plan's prose — 'elena' etc. are not real ids).
const TEACHER_VOICES: Record<string, TeacherVoice> = {
  'ms-elena-vasquez': {
    // R39 (2026-08-04 user call): Katie ran ~22 chars/s and still read fast even
    // with the R38 -0.25 offset — Elena now speaks via Sophie (the Coach Riley
    // voice the user validated on SAT/ACT, seeded in the academy repo 2026-07-30).
    // No speed offset: Sophie's natural cadence is the accepted baseline. NOTE:
    // CARTESIA_DEFAULT_VOICE_ID derives from this entry, so Sophie is also the
    // global no-match fallback voice.
    voiceId: 'bf0a246a-8642-498a-9950-80c35e9276b5', // Sophie
    label: 'Sophie',
    gender: 'female',
    nativeAccent: 'en-us',
  },
  'mr-dev-khanna': {
    voiceId: '638efaaa-4d0c-442e-b701-3fae16aad012', // Sameer (user swap 2026-07-07: Amrit too soft/sleepy in live session)
    label: 'Sameer',
    gender: 'male',
    // hi→en carryover — Dev's base voice IS Indian English already.
    nativeAccent: 'en-in',
  },
  'dr-amara-osei': {
    voiceId: 'db6b0ed5-d5d3-463d-ae85-518a07d3c2b4', // Skylar
    label: 'Skylar',
    gender: 'female',
    nativeAccent: 'en-us',
  },
  sofia: {
    voiceId: '62ae83ad-4f6a-430b-af41-a9bede9286ca', // Gemma
    label: 'Gemma',
    gender: 'female',
    nativeAccent: 'en-gb',
  },
  // ── Per-accent personas (2026-07-19 accent-personas spec; ids match
  // DEMO_TEACHERS in src/lib/tutor/ai/teacher-persona.ts, voices are the
  // user-locked accent-pool picks — Priya=Palak user-confirmed) ──
  'mr-jake-sullivan': {
    voiceId: 'a5136bf9-224c-4d76-b823-52bd5efcffcc', // Jameson
    label: 'Jameson',
    gender: 'male',
    nativeAccent: 'en-us',
  },
  'ms-priya-nair': {
    voiceId: '28ca2041-5dda-42df-8123-f58ea9c3da00', // Palak
    label: 'Palak',
    gender: 'female',
    nativeAccent: 'en-in',
  },
  'mr-oliver-hartley': {
    voiceId: 'ef191366-f52f-447a-a398-ed8c0f2943a1', // Archie
    label: 'Archie',
    gender: 'male',
    nativeAccent: 'en-gb',
  },
  'ms-maryam-haddad': {
    voiceId: '9825cf5f-6aff-412a-80c5-bc58a8d55bc4', // Maryam
    label: 'Maryam',
    gender: 'female',
    nativeAccent: 'en-ar-gulf',
  },
  'mr-youssef-karim': {
    voiceId: '9cbad5f7-fbf6-4416-a22f-1ecc75ad40a2', // Youssef
    label: 'Youssef',
    gender: 'male',
    nativeAccent: 'en-ar-gulf',
  },
  'ms-anna-weber': {
    voiceId: 'ac197a78-cec7-4c50-93e5-93bdc1910b11', // Jennifer
    label: 'Jennifer',
    gender: 'female',
    nativeAccent: 'en-de',
  },
  'mr-lukas-brandt': {
    voiceId: '42f14755-88c3-4124-aae3-5cc3a9618e8f', // Jan
    label: 'Jan',
    gender: 'male',
    nativeAccent: 'en-de',
  },
  'ms-anneliese-de-vries': {
    voiceId: '225ba8cf-9fc2-4371-a78c-fe38ba38898a', // Anneliese
    label: 'Anneliese',
    gender: 'female',
    nativeAccent: 'en-nl',
  },
  'ms-grace-thompson': {
    voiceId: 'c2ad7092-0447-47ea-948b-61fbb6faf153', // Grace
    label: 'Grace',
    gender: 'female',
    nativeAccent: 'en-au',
  },
  'mr-cooper-reid': {
    voiceId: '49743b08-0f5d-4741-839c-b12933853780', // Cooper
    label: 'Cooper',
    gender: 'male',
    nativeAccent: 'en-au',
  },
  'ms-nadia-lim': {
    voiceId: 'efddb3d2-4464-45e0-9f8a-fcd5fd4fc54f', // Nadia
    label: 'Nadia',
    gender: 'female',
    nativeAccent: 'en-sg',
  },
  'mr-kiran-raj': {
    voiceId: 'ac5a9529-3965-4eac-b574-dce63664fbf4', // Kiran
    label: 'Kiran',
    gender: 'male',
    nativeAccent: 'en-sg',
  },
  'ms-zanele-dlamini': {
    voiceId: '263b9cc0-0d99-44e7-ae92-3d4ad5d2ad18', // Zanele
    label: 'Zanele',
    gender: 'female',
    nativeAccent: 'en-za',
  },
  'mr-pieter-van-der-merwe': {
    voiceId: 'baf84392-fa95-4d44-8871-d32ee36b0e01', // Pieter
    label: 'Pieter',
    gender: 'male',
    nativeAccent: 'en-za',
  },
};

// ── Accent pools (passing-only, round-1 verdicts) ──
const ACCENT_POOLS: Record<string, AccentPool> = {
  'en-us': {
    // R39: pool female follows the Elena swap — Sophie, natural pace (see TEACHER_VOICES).
    female: { voiceId: 'bf0a246a-8642-498a-9950-80c35e9276b5', label: 'Sophie' },
    male: { voiceId: 'a5136bf9-224c-4d76-b823-52bd5efcffcc', label: 'Jameson' },
  },
  'en-gb': {
    female: { voiceId: '62ae83ad-4f6a-430b-af41-a9bede9286ca', label: 'Gemma' },
    male: { voiceId: 'ef191366-f52f-447a-a398-ed8c0f2943a1', label: 'Archie' },
  },
  'en-in': {
    female: { voiceId: 'dc4725ab-a34f-4625-9ae3-e35296b456e2', label: 'Katie (en-in localized)' },
    male: { voiceId: '638efaaa-4d0c-442e-b701-3fae16aad012', label: 'Sameer' },
    // Palak `28ca2041-5dda-42df-8123-f58ea9c3da00` also passed (en-in,
    // female) but is not the default pick — reserved for an explicit
    // future selector, not wired into gender-preferred pick.
  },
  'en-ar-gulf': {
    female: { voiceId: '9825cf5f-6aff-412a-80c5-bc58a8d55bc4', label: 'Maryam' },
    male: { voiceId: '9cbad5f7-fbf6-4416-a22f-1ecc75ad40a2', label: 'Youssef' },
  },
  'en-nl': {
    // Only one passing en-nl voice in round 1 (Stjin failed) — no gender split.
    default: { voiceId: '225ba8cf-9fc2-4371-a78c-fe38ba38898a', label: 'Anneliese' },
  },
  'en-de': {
    female: { voiceId: 'ac197a78-cec7-4c50-93e5-93bdc1910b11', label: 'Jennifer' },
    male: { voiceId: '42f14755-88c3-4124-aae3-5cc3a9618e8f', label: 'Jan' },
  },
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
};

/** True when an accent tag has a pool entry — lets tests catch tag typos. */
export function hasAccentPool(accent: string): boolean {
  return accent in ACCENT_POOLS;
}

/**
 * The /tutor geo pre-select pair for an accent: first TEACHER_VOICES entry
 * per gender whose nativeAccent matches (2026-07-19 accent-personas spec).
 * Insertion order is load-bearing — the original four personas come first,
 * so Elena (not Amara) is the en-us female. Returns DEMO_TEACHERS ids.
 */
export function teachersForAccent(accent: string): { female?: string; male?: string } {
  const out: { female?: string; male?: string } = {};
  for (const [id, v] of Object.entries(TEACHER_VOICES)) {
    if (v.nativeAccent === accent && !out[v.gender]) out[v.gender] = id;
  }
  return out;
}

/** Default Cartesia voice when no teacher/accent match is found — Sophie (R39). */
export const CARTESIA_DEFAULT_VOICE_ID = TEACHER_VOICES['ms-elena-vasquez'].voiceId;

/**
 * Test-account voice substitution (2026-07-08). Shared test Cartesia keys
 * (separate accounts, 20k credits each) don't contain our CUSTOM cloned
 * voices — e.g. Mr. Praveen's clone lives only in the main account, so a
 * TTS request for it under a test key 404s. `CARTESIA_VOICE_SUBSTITUTIONS`
 * (server env, "fromId:toId[,fromId:toId…]") remaps those ids to library
 * voices that exist in every account (Praveen → Sameer). Unset ⇒ identity —
 * production is unaffected. Parsed per call: negligible cost at TTS
 * request rate, and it keeps this module free of import-order env reads.
 */
export function substituteCartesiaVoiceId(voiceId: string): string {
  return applyCartesiaVoiceSubstitutions(voiceId, process.env.CARTESIA_VOICE_SUBSTITUTIONS);
}

/**
 * Pure form of the substitution above (Task 3.1, humanlike-latency plan):
 * the browser-side TTS WebSocket path can't read the server env, so the
 * cartesia-token route ships the raw mapping to the client (voice ids are
 * not secrets) and useCartesiaSonicWS applies it here.
 */
export function applyCartesiaVoiceSubstitutions(voiceId: string, raw: string | undefined): string {
  if (!raw) return voiceId;
  for (const pair of raw.split(',')) {
    const [from, to] = pair.split(':').map((s) => s.trim());
    if (from && to && from === voiceId) return to;
  }
  return voiceId;
}
const DEFAULT_LABEL = 'Sophie (default)';

export interface ResolveCartesiaVoiceOpts {
  /** DEMO_TEACHERS id, e.g. 'ms-elena-vasquez'. */
  teacherId?: string;
  /** Accent tag, e.g. 'en-in', 'en-ar-gulf'. Phase 3: portal/EmbedConfig override or geo default. */
  accent?: string;
}

/**
 * Resolve the Cartesia voice for a teacher persona + optional accent
 * override. Fallback chain: teacher+accent (native-accent short-circuit,
 * else gender-preferred accent-pool pick) → teacher base → accent pool
 * (female-default when no teacher given) → CARTESIA_DEFAULT_VOICE_ID.
 */
export function resolveCartesiaVoice(opts: ResolveCartesiaVoiceOpts = {}): {
  voiceId: string;
  label: string;
  speed?: number;
} {
  const { teacherId, accent } = opts;
  const teacher = teacherId ? TEACHER_VOICES[teacherId] : undefined;

  if (teacher) {
    if (accent) {
      // Teacher's base voice is already native to this accent — no swap.
      if (teacher.nativeAccent === accent) {
        return { voiceId: teacher.voiceId, label: teacher.label, speed: teacher.speed };
      }
      const pool = ACCENT_POOLS[accent];
      const picked = pool && (pool[teacher.gender] ?? pool.default);
      if (picked) return picked;
      // Unknown/unpooled accent — fall back to the teacher's own base voice.
      return { voiceId: teacher.voiceId, label: teacher.label, speed: teacher.speed };
    }
    return { voiceId: teacher.voiceId, label: teacher.label, speed: teacher.speed };
  }

  if (accent) {
    const pool = ACCENT_POOLS[accent];
    // No teacher gender to key off — default to female pick.
    const picked = pool && (pool.female ?? pool.default ?? pool.male);
    if (picked) return picked;
  }

  // The default IS Katie — carry her per-voice speed offset here too.
  return { voiceId: CARTESIA_DEFAULT_VOICE_ID, label: DEFAULT_LABEL, speed: TEACHER_VOICES['ms-elena-vasquez'].speed };
}

/**
 * Per-voice speed lookup by RAW voiceId (R38 Task 6 embed fix). Surfaces
 * that receive a raw voiceId directly — the embed token path
 * (config.teacher.voice.voiceId), which never calls resolveCartesiaVoice()
 * because it isn't keyed by teacherId — use this to pick up the same
 * per-voice cadence normalization (e.g. Katie's -0.25) that /tutor gets via
 * resolveCartesiaVoice(). Scans both TEACHER_VOICES and ACCENT_POOLS so a
 * match is found regardless of which table originally carried the speed.
 * Unknown/marketplace voice ids (partner-cloned voices) resolve undefined —
 * no speed sent, unchanged behavior.
 */
export function cartesiaSpeedForVoiceId(voiceId: string | undefined): number | undefined {
  if (!voiceId) return undefined;
  for (const teacher of Object.values(TEACHER_VOICES)) {
    if (teacher.voiceId === voiceId) return teacher.speed;
  }
  for (const pool of Object.values(ACCENT_POOLS)) {
    for (const entry of [pool.female, pool.male, pool.default]) {
      if (entry && entry.voiceId === voiceId) return entry.speed;
    }
  }
  return undefined;
}
