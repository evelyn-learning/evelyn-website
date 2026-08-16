/**
 * Per-partner flag override channel (M1c Task 8, D12 hook).
 *
 * M1c builds only the channel: a partner's `flagOverrides` map wins over the
 * build-time constant when present. Per-brand CNAME and token-carried
 * overrides are D12 and out of scope here.
 */

/** Deliberately narrower than PartnerRecord — a test fixture doesn't need to invent the rest of the row. */
export interface FlagCarrier {
  flagOverrides: Record<string, boolean | string>;
}

export function resolveFlag(
  name: string,
  partner: FlagCarrier | null,
  fallback: boolean | string,
): boolean | string {
  const v = partner?.flagOverrides?.[name];
  // `??` not `||`: an override of `false` or '' is a real value, and `||`
  // would silently fall through to the build-time constant instead — the
  // opposite of what an operator setting a flag to `false` intends.
  return v ?? fallback;
}
