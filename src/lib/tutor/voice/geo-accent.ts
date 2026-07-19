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
