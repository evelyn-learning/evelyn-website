/**
 * Wire-serialization guard for portal responses.
 *
 * The frozen portal contract (@evelyn/portal-contract v1) declares every
 * optional field as `.optional()` — NOT `.nullable()`. So a JSON payload with
 * an explicit `"field": null` FAILS the portal's parse even though the field is
 * "optional", and the portal 500s. `JSON.stringify` already drops `undefined`,
 * but it keeps `null`, and persisted/legacy engine data (e.g. a GapEntry whose
 * conceptLabel was written null) carries nulls onto the wire.
 *
 * `stripNullsDeep` recursively removes every null-valued key from objects (and
 * walks arrays) so the serialized shape matches the contract's `.optional()`
 * (field absent) rather than tripping it (field present, null). Non-plain
 * values (Dates, etc.) are passed through untouched.
 */

export function stripNullsDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripNullsDeep(v)) as unknown as T;
  }
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === null) continue; // drop null optionals → field absent, contract-valid
      out[k] = stripNullsDeep(v);
    }
    return out as T;
  }
  return value;
}
