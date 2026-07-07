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
    voiceId: 'f786b574-daa5-4673-aa0c-cbe3e8534c02', // Katie
    label: 'Katie',
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
};

// ── Accent pools (passing-only, round-1 verdicts) ──
const ACCENT_POOLS: Record<string, AccentPool> = {
  'en-us': {
    female: { voiceId: 'f786b574-daa5-4673-aa0c-cbe3e8534c02', label: 'Katie' },
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
};

/** Default Cartesia voice when no teacher/accent match is found — Katie. */
export const CARTESIA_DEFAULT_VOICE_ID = TEACHER_VOICES['ms-elena-vasquez'].voiceId;
const DEFAULT_LABEL = 'Katie (default)';

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
} {
  const { teacherId, accent } = opts;
  const teacher = teacherId ? TEACHER_VOICES[teacherId] : undefined;

  if (teacher) {
    if (accent) {
      // Teacher's base voice is already native to this accent — no swap.
      if (teacher.nativeAccent === accent) {
        return { voiceId: teacher.voiceId, label: teacher.label };
      }
      const pool = ACCENT_POOLS[accent];
      const picked = pool && (pool[teacher.gender] ?? pool.default);
      if (picked) return picked;
      // Unknown/unpooled accent — fall back to the teacher's own base voice.
      return { voiceId: teacher.voiceId, label: teacher.label };
    }
    return { voiceId: teacher.voiceId, label: teacher.label };
  }

  if (accent) {
    const pool = ACCENT_POOLS[accent];
    // No teacher gender to key off — default to female pick.
    const picked = pool && (pool.female ?? pool.default ?? pool.male);
    if (picked) return picked;
  }

  return { voiceId: CARTESIA_DEFAULT_VOICE_ID, label: DEFAULT_LABEL };
}
