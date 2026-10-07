/**
 * Per-host choices about the in-frame session chrome (embed only).
 *
 * Resolution, per option:
 *   1. the embed token's explicit `features.<field>` boolean, if present;
 *   2. the partner default below, keyed on the token's `partner_id`;
 *   3. the engine default — what every host got before the option existed.
 *
 * Cosmetic only: these decide which controls are DRAWN. They are read from
 * the token client-side, unverified, like the rest of the embed UI config
 * (see parse-embed-config.ts) — never gate access or billing on them.
 *
 * Pure. No env, no I/O, client-safe.
 */

export interface EmbedUiOptions {
  /** Show the "Humor" section of the ⋯ (Adjust the lesson) menu.
   *  Token field: `features.humor_control` (boolean). Default true. */
  humorControl: boolean;
  /** On small screens (below Tailwind `sm`, 640px) replace the icon-only
   *  End/Pause control in the header with a labelled "Finish" control that
   *  ends the session with the `finish` intent — the same as the ⋯ menu's
   *  "Finish lesson". Wider screens are unchanged.
   *  Token field: `features.mobile_finish` (boolean). Default false. */
  mobileFinish: boolean;
  /** Show a mute control for the TUTOR's voice in the dock (beside the
   *  speaking meter). Muted, turns run exactly as before — captions and
   *  transcript at speaking pace — with no sound.
   *  Token field: `features.voice_mute` (boolean). Default false. */
  voiceMute: boolean;
  /** Show the "Pace: …" pill beside the ⋯ button. Both open the same menu;
   *  with the pill hidden, pace stays reachable through ⋯.
   *  Token field: `features.pace_chip` (boolean). Default true. */
  paceChip: boolean;
}

export const DEFAULT_EMBED_UI_OPTIONS: EmbedUiOptions = { humorControl: true, mobileFinish: false, voiceMute: false, paceChip: true };

/** Partner defaults — applied when the token does not say. A partner absent
 *  from this table gets `DEFAULT_EMBED_UI_OPTIONS`. */
const PARTNER_UI_DEFAULTS: Readonly<Record<string, Partial<EmbedUiOptions>>> = {
  // Homework-help product: no humour selector; on a phone the host's own
  // finish strip is hidden, so the frame carries the labelled Finish control.
  greenapple: { humorControl: false, mobileFinish: true },
  // Side panel beside a lesson video (Skyler's review 2026-10-07): a clear
  // way to silence the tutor and read instead; one pace control, not two.
  gameclass: { voiceMute: true, paceChip: false },
};

interface EmbedUiConfigLike {
  partner_id?: unknown;
  features?: unknown;
}

export function resolveEmbedUiOptions(config: EmbedUiConfigLike | null | undefined): EmbedUiOptions {
  const partnerId = typeof config?.partner_id === 'string' ? config.partner_id : '';
  const partner = Object.hasOwn(PARTNER_UI_DEFAULTS, partnerId) ? PARTNER_UI_DEFAULTS[partnerId] : undefined;
  const features = config?.features && typeof config.features === 'object'
    ? (config.features as Record<string, unknown>)
    : {};
  const pick = (explicit: unknown, key: keyof EmbedUiOptions): boolean =>
    typeof explicit === 'boolean' ? explicit : partner?.[key] ?? DEFAULT_EMBED_UI_OPTIONS[key];
  return {
    humorControl: pick(features.humor_control, 'humorControl'),
    mobileFinish: pick(features.mobile_finish, 'mobileFinish'),
    voiceMute: pick(features.voice_mute, 'voiceMute'),
    paceChip: pick(features.pace_chip, 'paceChip'),
  };
}
