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
  'evelyn-marketing': { openerPrefetch: false },
  evelyntutor: { openerPrefetch: false },
  kanzoo: { openerPrefetch: false },
  greenapple: { openerPrefetch: false },
  // Skyler 2026-11-02: the chime distracts in their video lessons and the
  // label sits half under their chat box. Cue off; their ack fillers return.
  gameclass: { openerPrefetch: false, thinkingCue: false },
  globalead: { openerPrefetch: false },
};

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
    brainVersion: row?.brainVersion ?? base.brainVersion,
  };
}
