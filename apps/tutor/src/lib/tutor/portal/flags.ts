/**
 * Per-partner flag override channel (M1c Task 8, D12 hook).
 *
 * M1c builds only the channel: a partner's `flagOverrides` map wins over the
 * build-time constant when present. Per-brand CNAME and token-carried
 * overrides are D12 and out of scope here.
 */

/** Deliberately narrower than PartnerRecord — a test fixture doesn't need to invent the rest of the row. */
export interface FlagCarrier {
  flagOverrides: Record<string, boolean | string | number>;
}

// `number` joined the union in Task 12: `flagOverrides` is stored as
// Mongoose `Mixed` (Partner.ts), so a numeric override like
// `practice_assign_cap: 3` round-trips as a real `number`, not a stringified
// one — `resolveFlag` must be able to carry and return that value (and take
// a numeric `fallback`) without the caller pre-stringifying it.
export function resolveFlag(
  name: string,
  partner: FlagCarrier | null,
  fallback: boolean | string | number,
): boolean | string | number {
  const overrides = partner?.flagOverrides;
  // `Object.hasOwn`, not a bare index read: `flagOverrides` arrives from a
  // Mongo `lean()` as an ordinary object, so `overrides['constructor']` /
  // `['toString']` / `['valueOf']` would resolve to an Object.prototype
  // member instead of falling through to the build-time constant. Flag
  // names are compile-time constants today; this is one line of insurance
  // against the day one isn't.
  if (!overrides || !Object.hasOwn(overrides, name)) return fallback;
  const v = overrides[name];
  // `??` not `||`: an override of `false` or '' is a real value, and `||`
  // would silently fall through to the build-time constant instead — the
  // opposite of what an operator setting a flag to `false` intends.
  return v ?? fallback;
}
