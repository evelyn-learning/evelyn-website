/**
 * Display-only teacher metadata shared by the /tutor lobby and the
 * /products/voice-tutor live demo. Accent truth lives in
 * cartesia-voice-registry; these strings are card/row copy only.
 */

// Kept for callers that still key off the original-four set; since R40c they
// carry accent hints like everyone else (their voices have been accented
// Cartesia voices since R38/R39 — the hint-less rendering was a leftover from
// the OpenAI-voice era and read as an inconsistency in the picker).
export const ORIGINAL_TEACHER_IDS = new Set([
  'ms-elena-vasquez',
  'mr-dev-khanna',
  'dr-amara-osei',
  'sofia',
]);

export const ACCENT_CARD_HINTS: Record<string, string> = {
  // Original four — accents follow their registry voices (Sophie en-us,
  // Sameer en-in, Skylar en-us, Gemma en-gb).
  'ms-elena-vasquez': 'American accent',
  'mr-dev-khanna': 'Indian accent',
  'dr-amara-osei': 'American accent',
  'sofia': 'British accent',
  'mr-jake-sullivan': 'American accent',
  'ms-priya-nair': 'Indian accent',
  'mr-oliver-hartley': 'British accent',
  'ms-maryam-haddad': 'Gulf accent',
  'mr-youssef-karim': 'Gulf accent',
  'ms-anna-weber': 'German accent',
  'mr-lukas-brandt': 'German accent',
  'ms-anneliese-de-vries': 'Dutch accent',
  'ms-grace-thompson': 'Australian accent',
  'mr-cooper-reid': 'Australian accent',
  'ms-nadia-lim': 'Singaporean accent',
  'mr-kiran-raj': 'Singaporean accent',
  'ms-zanele-dlamini': 'South African accent',
  'mr-pieter-van-der-merwe': 'South African accent',
};
