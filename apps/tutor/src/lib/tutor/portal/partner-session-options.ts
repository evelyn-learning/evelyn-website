/**
 * Per-partner session BEHAVIOUR choices (not chrome — see embed-ui-options.ts
 * for what is drawn). Decided 2026-10-27 for the GDI → main merge: a few GDI
 * mechanisms cost money or change the feel of a lesson for every tenant, so
 * each is a per-partner setting with a documented default instead of a
 * global switch.
 *
 * Resolution, per option:
 *   1. the partner row below, keyed on the token's `partner_id`;
 *   2. the engine default — computed from the session's languages where the
 *      mechanism was built for bilingual lessons, otherwise the global
 *      decision.
 *
 * The retail /tutor page and every surface without a partner id get the
 * engine defaults. The `TUTOR_OPENER_PREFETCH` / `TUTOR_LESSON_CLOSE_AUTO_END`
 * build-time flags (orchestrator/flags.ts) stay as kill switches on top.
 *
 * Pure. No env, no I/O, client-safe.
 */
import { sessionAllowsNonLatin } from '@/lib/tutor/voice/transcript-filters';

export interface PartnerSessionOptions {
  /** Run the opener's brain call pre-start and replay it on Start
   *  (lib/tutor/voice/opener-prefetch.ts). Saves ~4 s on the first sentence
   *  but COSTS ONE BRAIN CALL PER PAGE LOAD even when Start is never tapped.
   *  Default: on only for a bilingual session (non-Latin tutor language),
   *  where the cold opener was measured; off for every English-only partner
   *  until that partner is asked. */
  openerPrefetch: boolean;
  /** After the lesson is CLOSED (close_session_notes or a mutual farewell),
   *  a quiet 45 s ends the voice session the way the End button does
   *  (lib/tutor/voice/lesson-close.ts). Never fires before the close; any
   *  student turn restarts it; text sessions are exempt in the runtime.
   *  Default: on (decision 2026-10-27), per partner reversible here. */
  lessonCloseAutoEnd: boolean;
  /** Working-level check: the tutor probes the learner's English level at the
   *  start and adapts the lesson to it (GDI trial, 2026-10-28). Default off
   *  for every partner; the TUTOR_WORKING_LEVEL flag is the global kill switch. */
  levelCheck: boolean;
  /** Pronunciation assessment on the learner's speech (GDI trial,
   *  2026-10-28). Default off for every partner; the
   *  TUTOR_PRONUNCIATION_ASSESS flag is the global kill switch. */
  pronunciation: boolean;
  /** The thinking cue (chime + on-stage "Thinking…" label) while the tutor
   *  prepares a reply (lib/tutor/voice/thinking-cue.ts). Default: on
   *  (decision 2026-10-29); an explicit `thinking_cue` token claim still wins
   *  either way. With the cue off, the spoken ack fillers come back. */
  thinkingCue: boolean;
  /** Which turn engine the partner's sessions use. 'v1' everywhere until v2 is cut over
   *  partner by partner (docs/superpowers/specs/2026-11-09-tutor-brain-v2-design.md §4.1). */
  brainVersion: 'v1' | 'v2';
}

/** Partner rows — applied when present. A partner absent from this table
 *  gets the computed defaults. Keys are embed-token `partner_id` values. */
export const PARTNER_SESSION_DEFAULTS: Readonly<Record<string, Partial<PartnerSessionOptions>>> = {
  // GDI Communications demo (showcase mint, tutor_languages ["en","ja"]):
  // the prefetch was built on its sessions (embed-1792338502233). Explicit so
  // the row survives a token minted without the languages claim.
  'gdi-demo': { openerPrefetch: true, levelCheck: true, pronunciation: true },
  // Praveen 2026-10-28: prefetch ON only for GDI; OFF for every other
  // existing partner (it is a brain call per page load). Rows for each
  // `partners` _id in production as of 2026-10-28 (registry is DB-backed), so
  // a later `tutor_languages` claim on one of these cannot switch it on by
  // the language default. Post-close auto-end stays on for all (his call).
  academy: { openerPrefetch: false },
  crimsora: { openerPrefetch: false },
  evelyn: { openerPrefetch: false },
  // Praveen 2026-11-12: the marketing demo is the first tenant on tutor v2 (the other tenants need lesson
  // progress reporting, session memory, resume and homework ported first).
  'evelyn-marketing': { openerPrefetch: false, brainVersion: 'v2' },
  evelyntutor: { openerPrefetch: false },
  kanzoo: { openerPrefetch: false },
  greenapple: { openerPrefetch: false },
  // Skyler 2026-11-02: the chime distracts in their video lessons and the
  // label sits half under their chat box. Cue off; their ack fillers return.
  gameclass: { openerPrefetch: false, thinkingCue: false },
  globalead: { openerPrefetch: false },
};

/** Which turn engine each partner runs, set per deploy: NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS="evelyn-marketing=v2,crimsora=v1".
 *  It wins over the partner's row, so a tenant is moved to another engine (or back) by changing one line of
 *  the instance's env and redeploying; a partner it does not name keeps its row. Read in the browser, so it
 *  is fixed at build time. Only engines present in the build can be named (today v1 and v2). */
export function brainVersionOverrides(raw: string | undefined): Readonly<Record<string, 'v1' | 'v2'>> {
  const out: Record<string, 'v1' | 'v2'> = {};
  for (const pair of (raw ?? '').split(',')) {
    const [id, version] = pair.split('=').map((x) => x.trim());
    if (id && (version === 'v1' || version === 'v2')) out[id] = version;
  }
  return out;
}
const BRAIN_VERSION_BY_PARTNER = brainVersionOverrides(process.env.NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS);

/** Whether tutor v2 can run this session. A partner on v2 still gets v1 for the kinds of session v2 has not
 *  taken over: homework help and mock review (their own flows, uploads and ledgers), a diagnostic, a lesson
 *  taught in or alongside another language, and a session that stands by for a host's video. Those fall back
 *  instead of being taught as an ordinary lesson. */
export function v2CanRunSession(s: { sessionGoal?: string | null; targetKind?: string | null; tutorLanguages?: string[]; standby?: boolean }): boolean {
  if (s.sessionGoal === 'homework-help' || s.sessionGoal === 'mock-review') return false;
  if (s.targetKind === 'diagnostic') return false;
  if ((s.tutorLanguages ?? []).some((l) => !/^en\b/i.test(l))) return false;
  if (s.standby) return false;
  return true;
}

export interface PartnerSessionLike {
  partnerId?: string | null;
  tutorLanguages?: string[] | undefined;
}

export function defaultPartnerSessionOptions(tutorLanguages: string[] | undefined): PartnerSessionOptions {
  return {
    openerPrefetch: sessionAllowsNonLatin(tutorLanguages),
    lessonCloseAutoEnd: true,
    levelCheck: false,
    pronunciation: false,
    thinkingCue: true,
    brainVersion: 'v1',
  };
}

export function resolvePartnerSessionOptions(session: PartnerSessionLike | null | undefined): PartnerSessionOptions {
  const partnerId = typeof session?.partnerId === 'string' ? session.partnerId : '';
  const row = Object.hasOwn(PARTNER_SESSION_DEFAULTS, partnerId) ? PARTNER_SESSION_DEFAULTS[partnerId] : undefined;
  const base = defaultPartnerSessionOptions(session?.tutorLanguages);
  return {
    openerPrefetch: row?.openerPrefetch ?? base.openerPrefetch,
    lessonCloseAutoEnd: row?.lessonCloseAutoEnd ?? base.lessonCloseAutoEnd,
    levelCheck: row?.levelCheck ?? base.levelCheck,
    pronunciation: row?.pronunciation ?? base.pronunciation,
    thinkingCue: row?.thinkingCue ?? base.thinkingCue,
    brainVersion: (Object.hasOwn(BRAIN_VERSION_BY_PARTNER, partnerId) ? BRAIN_VERSION_BY_PARTNER[partnerId] : undefined) ?? row?.brainVersion ?? base.brainVersion,
  };
}
