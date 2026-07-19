# Geo-based tutor voice accent — design

**Date:** 2026-07-19
**Status:** Approved (user, this session)
**Scope:** Engine repo, public `/tutor` page only. Portal embed (`EmbedConfig` accent override) untouched.

## Problem

`/tutor` serves students worldwide but every session defaults to Ms. Elena Vasquez's
American voice (Katie). The `resolveCartesiaVoice({teacherId, accent})` resolver and
`ACCENT_POOLS` were built for exactly this ("Phase 3: portal/EmbedConfig override or
geo default") but nothing supplies the `accent` input on /tutor, and several large
student regions have no pool at all.

GA4 (property 311660678, 2026-04-20 → 2026-07-19, /tutor pages, users by country):
US 56, India 54, Philippines 7, Jordan 5, South Africa 5, UAE 5, Canada 4, Germany 4,
Nigeria 4, Peru 4, Singapore 4, Australia 3, plus long tail. Existing pools cover
~75%; the gaps were PH/SE-Asia, Africa, Australia, LatAm.

## Voice additions (user-selected, no listening round needed)

Three new `ACCENT_POOLS` entries in
`src/lib/tutor/voice/cartesia-voice-registry.ts`:

| Pool | Female | Male |
|------|--------|------|
| `en-au` | Grace `c2ad7092-0447-47ea-948b-61fbb6faf153` | Cooper `49743b08-0f5d-4741-839c-b12933853780` |
| `en-sg` | Nadia `efddb3d2-4464-45e0-9f8a-fcd5fd4fc54f` | Kiran `ac5a9529-3965-4eac-b574-dce63664fbf4` |
| `en-za` | Zanele `263b9cc0-0d99-44e7-ae92-3d4ad5d2ad18` | Pieter `baf84392-fa95-4d44-8871-d32ee36b0e01` |

Gender labels corrected by user 2026-07-19: Zanele is the female voice, Pieter the
male. Cartesia has no Filipino accent, so `en-sg` (Singaporean) serves the
Philippines and SE Asia. `en-za` (South African) serves all African-accent needs —
the only African accent Cartesia stocks (African American was considered and
rejected as a US accent). Existing pools and teacher base voices are unchanged.

## Geo detection

The site is served directly by nginx (no Cloudflare/CDN), so no geo header exists.
Detection is client-side from the browser's IANA timezone —
`Intl.DateTimeFormat().resolvedOptions().timeZone` — zero infra, no IP-geo API,
works under Next.js prerender.

New pure module `src/lib/tutor/voice/geo-accent.ts`:

```ts
export function accentFromTimezone(tz: string | undefined): string | undefined
```

Mapping (first match wins; zone lists enumerated in the implementation):

| Timezones | Accent |
|-----------|--------|
| India, Pakistan, Bangladesh, Sri Lanka, Nepal (Asia/Kolkata, Karachi, Dhaka, Colombo, Kathmandu) | `en-in` |
| Australia/*, Pacific/Auckland (NZ) | `en-au` |
| Asia/Manila, Singapore, Kuala_Lumpur, Hong_Kong, Brunei | `en-sg` |
| Sub-Saharan Africa/* (Johannesburg, Lagos, Nairobi, Dar_es_Salaam, Accra, …) | `en-za` |
| Gulf + North Africa + Levant (Asia/Dubai, Riyadh, Amman, Kuwait, Qatar, Bahrain, Baghdad, Africa/Cairo, Casablanca, Algiers, Tunis, …) | `en-ar-gulf` |
| Europe/Berlin, Vienna, Zurich | `en-de` |
| Europe/Amsterdam, Brussels | `en-nl` |
| Europe/London, Dublin, Malta | `en-gb` |
| America/* (US, Canada, LatAm) | `en-us` |
| Anything else / unknown | `undefined` |

`undefined` falls through to the teacher's own base voice — France, non-mapped
Europe, and East Asia land there (or on `en-us` via America/*). LatAm deliberately
maps to `en-us` (no es→en carryover voice chosen; revisit if LatAm traffic grows).

## Wiring

`src/app/tutor/page.tsx` (~line 400) currently:

```ts
() => resolveCartesiaVoice({ teacherId: selectedTeacherId }).voiceId
```

becomes a call that also passes
`accent: accentFromTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)`.

The existing resolver semantics do the rest, unchanged:

- Teacher whose `nativeAccent` equals the geo accent keeps their own voice
  (an Indian student picking Mr. Sameer hears Sameer, not the pool pick).
- Otherwise the gender-matched pool voice swaps in — persona name, personality,
  and teaching behavior unchanged; only the voice differs.
- Unknown/unpooled accent → teacher base voice (today's behavior).

The teacher picker still works; geo only changes what each persona *sounds* like
for that student. Voice IDs still flow through `substituteCartesiaVoiceId` for
test accounts.

## Error handling

- `Intl` unavailable or timezone unparsable → `accentFromTimezone` returns
  `undefined` → today's behavior exactly. No user-visible failure mode.
- SSR: the memo runs client-side; guard so server render resolves without
  `Intl` timezone (accent `undefined`), matching hydration expectations — the
  voice id is only consumed at TTS-request time, so a client-side-only resolve
  is acceptable.

## Testing

- `geo-accent.test.ts`: table-driven — each mapped zone list spot-checked, plus
  `undefined`, garbage input, and unmapped zones (`Europe/Paris`, `Asia/Tokyo`,
  `America/Lima` → `en-us` for Lima since it's America/*).
- Extend `scripts/test-cartesia-voice-registry.ts` for the three new pools:
  gender-preferred pick, female-default pick with no teacher, and
  teacher+geo-accent swap (e.g. Elena + `en-au` → Grace; Sameer + `en-in` →
  Sameer unchanged).

## Out of scope

- Portal embed accent (already supported via EmbedConfig).
- New teacher personas, persona name localization, accent picker UI.
- es→en / fr→en / en-PH pools (Cartesia doesn't stock PH; LatAm/France deferred).
